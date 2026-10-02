import type { Result } from "@dicebox/core";
import {
  TransactionJournalLedger,
  type LedgerAppendOutcome,
} from "./transaction-ledger.js";

export interface AppendOnlyJournalLog {
  /** Read the complete log. An empty string means a new journal. */
  read(): Promise<string>;
  /** Append exactly one newline-terminated JSON entry. Never rewrite history. */
  append(line: string): Promise<void>;
}

export interface TransactionJournalStore {
  load(): Promise<Result<TransactionJournalLedger>>;
  append(input: unknown): Promise<Result<LedgerAppendOutcome>>;
  entries(): Promise<Result<readonly unknown[]>>;
}

function invalid(message: string): Result<never> {
  return { ok: false, error: { code: "INVALID_INPUT", message, retry: "never" } };
}

function unavailable(message: string): Result<never> {
  return { ok: false, error: { code: "UNAVAILABLE", message, retry: "after-reread" } };
}

function unknownOutcome(message: string): Result<never> {
  return { ok: false, error: { code: "UNKNOWN_OUTCOME", message, retry: "after-reread" } };
}

function replayLog(input: string): Result<TransactionJournalLedger> {
  const ledger = new TransactionJournalLedger();
  for (const [lineNumber, line] of input.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    let decoded: unknown;
    try {
      decoded = JSON.parse(line);
    } catch {
      return invalid(`Transaction journal line ${lineNumber + 1} is not valid JSON.`);
    }
    const appended = ledger.append(decoded);
    if (!appended.ok) {
      return invalid(`Transaction journal line ${lineNumber + 1} failed ledger validation: ${appended.error.message}`);
    }
  }
  return { ok: true, value: ledger };
}

/**
 * Append-only transaction persistence with one in-process writer queue.
 * Cross-process writers are intentionally outside this contract; a future
 * driver must supply an equivalent exclusive/atomic append guarantee.
 */
export function createAppendOnlyTransactionJournalStore(log: AppendOnlyJournalLog): TransactionJournalStore {
  let ledger: TransactionJournalLedger | undefined;
  let queue: Promise<unknown> = Promise.resolve();

  function serialized<T>(operation: () => Promise<Result<T>>): Promise<Result<T>> {
    const next = queue.then(operation, operation);
    queue = next.then(() => undefined, () => undefined);
    return next;
  }

  async function loadUnlocked(): Promise<Result<TransactionJournalLedger>> {
    if (ledger) return { ok: true, value: ledger };
    let text: string;
    try {
      text = await log.read();
    } catch {
      return unavailable("Transaction journal could not be read; no state was promoted.");
    }
    const replayed = replayLog(text);
    if (replayed.ok) ledger = replayed.value;
    return replayed;
  }

  return {
    load: () => serialized(loadUnlocked),
    append: (input) => serialized(async () => {
      const loaded = await loadUnlocked();
      if (!loaded.ok) return loaded;

      // Work on a replayed candidate so a failed append does not falsely
      // advance the in-memory ledger when the durable outcome is unknown.
      const candidate = TransactionJournalLedger.fromJSON(loaded.value.toJSON());
      if (!candidate.ok) return candidate;
      const appended = candidate.value.append(input);
      if (!appended.ok) return appended;
      if (!appended.value.inserted) return appended;
      try {
        await log.append(`${JSON.stringify(appended.value.entry)}\n`);
      } catch {
        ledger = undefined;
        return unknownOutcome("Transaction journal append may have committed; reread before retry.");
      }
      ledger = candidate.value;
      return appended;
    }),
    entries: () => serialized(async () => {
      const loaded = await loadUnlocked();
      return loaded.ok ? { ok: true, value: loaded.value.entries() } : loaded;
    }),
  };
}
