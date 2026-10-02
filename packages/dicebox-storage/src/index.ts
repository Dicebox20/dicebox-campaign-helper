import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  createAppendOnlyTransactionJournalStore,
  type AppendOnlyJournalLog,
  type TransactionJournalStore,
} from "@dicebox/compiler";
export * from "./program-state-store.js";

function isNodeError(value: unknown): value is { readonly code?: string } {
  return typeof value === "object" && value !== null && "code" in value;
}

export type { AppendOnlyJournalLog, TransactionJournalStore };

/** Program-side durable JSON-lines driver. Foundry module persistence is separate. */
export function createFileTransactionJournalStore(filePath: string): TransactionJournalStore {
  return createAppendOnlyTransactionJournalStore({
    async read() {
      try {
        return await readFile(filePath, "utf8");
      } catch (cause) {
        if (isNodeError(cause) && cause.code === "ENOENT") return "";
        throw cause;
      }
    },
    async append(line) {
      await mkdir(dirname(filePath), { recursive: true });
      await appendFile(filePath, line, { encoding: "utf8", flag: "a" });
    },
  });
}
