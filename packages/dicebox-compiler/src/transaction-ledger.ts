import { z } from "zod";
import { type Result } from "@dicebox/core";
import { transactionJournalSchema, type TransactionJournal } from "./transaction.js";

const transitions: Readonly<Record<TransactionJournal["stage"], readonly TransactionJournal["stage"][]>> = {
  previewed: ["approved"],
  approved: ["apply-ready"],
  "apply-ready": ["applying"],
  applying: ["unknown-outcome", "committed"],
  "unknown-outcome": ["unknown-outcome", "committed", "recovered"],
  committed: [],
  recovered: [],
};

export interface LedgerAppendOutcome {
  readonly entry: TransactionJournal;
  readonly inserted: boolean;
}

/** Sync or async append boundary used by the executor and durable drivers. */
export interface TransactionJournalWriter {
  append(input: unknown): Result<LedgerAppendOutcome> | Promise<Result<LedgerAppendOutcome>>;
}

function failure(code: "INVALID_INPUT" | "FORBIDDEN", message: string): Result<never> {
  return { ok: false, error: { code, message, retry: "never" } };
}

function freezeEntry(entry: TransactionJournal): TransactionJournal {
  const binding = entry.binding
    ? Object.freeze({
      ...entry.binding,
      semantic: Object.freeze({ ...entry.binding.semantic }),
    })
    : null;
  return Object.freeze({
    ...entry,
    approvalTokenId: entry.approvalTokenId,
    binding,
    notes: Object.freeze([...entry.notes]),
  });
}

function sameIdentity(left: TransactionJournal, right: TransactionJournal): boolean {
  return left.transactionId === right.transactionId
    && left.idempotencyKey === right.idempotencyKey
    && left.planId === right.planId
    && left.semanticId === right.semanticId
    && left.documentType === right.documentType
    && left.operation === right.operation
    && left.previewReceiptId === right.previewReceiptId;
}

export class TransactionJournalLedger {
  private readonly histories = new Map<string, TransactionJournal[]>();

  append(input: unknown): Result<LedgerAppendOutcome> {
    const parsed = transactionJournalSchema.safeParse(input);
    if (!parsed.success) return failure("INVALID_INPUT", "Transaction journal entry does not match the strict schema.");
    const entry = freezeEntry(parsed.data);
    const history = this.histories.get(entry.transactionId) ?? [];
    const previous = history.at(-1);

    if (!previous) {
      if (entry.stage !== "previewed") return failure("FORBIDDEN", "A transaction journal must begin in previewed state.");
      this.histories.set(entry.transactionId, [entry]);
      return { ok: true, value: { entry, inserted: true } };
    }
    if (!sameIdentity(previous, entry)) {
      return failure("FORBIDDEN", "Transaction identity cannot change within a journal history.");
    }
    if (JSON.stringify(previous) === JSON.stringify(entry)) {
      return { ok: true, value: { entry: previous, inserted: false } };
    }
    if (!transitions[previous.stage].includes(entry.stage)) {
      return failure("FORBIDDEN", `Invalid transaction transition: ${previous.stage} → ${entry.stage}.`);
    }
    history.push(entry);
    this.histories.set(entry.transactionId, history);
    return { ok: true, value: { entry, inserted: true } };
  }

  latest(transactionId: string): TransactionJournal | null {
    return this.histories.get(transactionId)?.at(-1) ?? null;
  }

  history(transactionId: string): readonly TransactionJournal[] {
    return Object.freeze([...(this.histories.get(transactionId) ?? [])]);
  }

  entries(): readonly TransactionJournal[] {
    return Object.freeze([...this.histories.values()].flat().sort((left, right) =>
      left.transactionId.localeCompare(right.transactionId)
      || left.attempt - right.attempt
      || left.observedAt.localeCompare(right.observedAt)));
  }

  toJSON(): string {
    return JSON.stringify(this.entries());
  }

  static fromJSON(input: string): Result<TransactionJournalLedger> {
    let decoded: unknown;
    try {
      decoded = JSON.parse(input);
    } catch {
      return failure("INVALID_INPUT", "Transaction journal JSON could not be parsed.");
    }
    const parsed = z.array(transactionJournalSchema).safeParse(decoded);
    if (!parsed.success) return failure("INVALID_INPUT", "Transaction journal JSON does not match the strict entry schema.");
    const ledger = new TransactionJournalLedger();
    for (const entry of parsed.data) {
      const appended = ledger.append(entry);
      if (!appended.ok) return appended;
    }
    return { ok: true, value: ledger };
  }
}
