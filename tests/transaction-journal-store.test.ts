import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  createAppendOnlyTransactionJournalStore,
} from "@dicebox/compiler";
import { createFileTransactionJournalStore } from "@dicebox/storage";
import { createStableDiceBoxId } from "@dicebox/core";

const transactionId = createStableDiceBoxId("transaction", "store");
const idempotencyKey = createStableDiceBoxId("idempotency", "store");
const planId = createStableDiceBoxId("plan", "store");
const semanticId = createStableDiceBoxId("journal", "store");
const receiptId = createStableDiceBoxId("receipt", "store");

function entry(stage: "previewed" | "approved") {
  return {
    schemaVersion: "0.1.0" as const,
    transactionId,
    idempotencyKey,
    planId,
    semanticId,
    documentType: "JournalEntry" as const,
    operation: "create" as const,
    stage,
    resolution: "pending" as const,
    attempt: 0,
    previewReceiptId: receiptId,
    approvalTokenId: null,
    approvedByUserId: null,
    binding: null,
    observedAt: stage === "previewed" ? "2026-08-21T06:00:00.000Z" : "2026-08-21T06:01:00.000Z",
    notes: [stage],
  };
}

describe("append-only transaction journal store", () => {
  it("replays after restart and does not duplicate exact entries", async () => {
    let text = "";
    const log = {
      read: async () => text,
      append: async (line: string) => { text += line; },
    };
    const first = createAppendOnlyTransactionJournalStore(log);
    const previewed = await first.append(entry("previewed"));
    const duplicate = await first.append(entry("previewed"));
    const approved = await first.append(entry("approved"));

    expect(previewed.ok && previewed.value.inserted).toBe(true);
    expect(duplicate.ok && duplicate.value.inserted).toBe(false);
    expect(approved.ok && approved.value.inserted).toBe(true);
    expect(text.trim().split("\n")).toHaveLength(2);

    const restarted = createAppendOnlyTransactionJournalStore(log);
    const entries = await restarted.entries();
    expect(entries.ok).toBe(true);
    if (entries.ok) expect(entries.value).toHaveLength(2);
  });

  it("rejects malformed history before exposing any state", async () => {
    const store = createAppendOnlyTransactionJournalStore({
      read: async () => "{not-json}\n",
      append: async () => undefined,
    });
    const result = await store.load();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("INVALID_INPUT");
  });

  it("treats a failed append as unknown and rereads on the next attempt", async () => {
    let text = "";
    let failOnce = true;
    const store = createAppendOnlyTransactionJournalStore({
      read: async () => text,
      append: async (line: string) => {
        text += line;
        if (failOnce) {
          failOnce = false;
          throw new Error("simulated response loss");
        }
      },
    });
    const first = await store.append(entry("previewed"));
    expect(first.ok).toBe(false);
    if (!first.ok) expect(first.error.code).toBe("UNKNOWN_OUTCOME");

    const reread = await store.load();
    expect(reread.ok).toBe(true);
    if (reread.ok) expect(reread.value.entries()).toHaveLength(1);
  });

  it("uses an append-only JSON-lines file driver across a fresh store instance", async () => {
    const directory = await mkdtemp(join(tmpdir(), "dicebox-journal-"));
    const filePath = join(directory, "transactions.jsonl");
    try {
      const first = createFileTransactionJournalStore(filePath);
      expect((await first.append(entry("previewed"))).ok).toBe(true);
      expect((await first.append(entry("approved"))).ok).toBe(true);
      const raw = await readFile(filePath, "utf8");
      expect(raw.trim().split("\n")).toHaveLength(2);

      const restarted = createFileTransactionJournalStore(filePath);
      const loaded = await restarted.load();
      expect(loaded.ok).toBe(true);
      if (loaded.ok) expect(loaded.value.entries()).toHaveLength(2);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
