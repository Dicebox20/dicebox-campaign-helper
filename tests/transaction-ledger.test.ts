import { describe, expect, it } from "vitest";
import {
  approveTransaction,
  createPreviewTransaction,
  fingerprintManagedJournalEntry,
  markApplying,
  markCommittedAfterReadback,
  markUnknownOutcome,
  prepareTransaction,
  previewManagedJournalEntry,
  recoverUnknownOutcome,
  TransactionJournalLedger,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T03:00:00.000Z";

function currentPreview() {
  const runtime: RuntimeProfile = {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write", state: "available", reason: "fixture" },
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
  };
  return previewManagedJournalEntry({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "ledger"),
    semantic: { id: createStableDiceBoxId("journal", "ledger"), kind: "journal" },
    documentType: "JournalEntry",
    operation: "create",
    title: "Ledger fixture",
    content: "Append-only journal fixture.",
    expectedBindingGeneration: 0,
  }, runtime, { authority: "gm", observedAt });
}

function approvedTransaction() {
  const preview = currentPreview();
  const transaction = createPreviewTransaction(preview);
  const token = {
    schemaVersion: "0.1.0" as const,
    tokenId: createStableDiceBoxId("approval", "ledger"),
    planId: preview.plan.planId,
    previewReceiptId: preview.receipt.receiptId as `dbx:${string}:${string}`,
    planFingerprint: fingerprintManagedJournalEntry(preview.plan),
    approvedBy: "gm" as const,
    approvedByUserId: "gm-fixture",
    approvedAt: observedAt,
    expiresAt: "2026-08-21T04:00:00.000Z",
  };
  const result = approveTransaction(transaction, preview, token, { observedAt, activeGmUserId: "gm-fixture" });
  if (!result.ok) throw new Error(result.error.message);
  return { preview, transaction: result.value };
}

function sequence() {
  const { preview, transaction: approved } = approvedTransaction();
  const applyReady = prepareTransaction(approved, "2026-08-21T03:01:00.000Z");
  if (!applyReady.ok) throw new Error(applyReady.error.message);
  const applying = markApplying(applyReady.value, "2026-08-21T03:02:00.000Z");
  if (!applying.ok) throw new Error(applying.error.message);
  const unknown = markUnknownOutcome(applying.value, "2026-08-21T03:03:00.000Z");
  if (!unknown.ok) throw new Error(unknown.error.message);
  const recovered = recoverUnknownOutcome(unknown.value, {
    status: "not-committed",
    binding: null,
    observedAt: "2026-08-21T03:04:00.000Z",
    notes: ["No exact binding found."],
  });
  if (!recovered.ok) throw new Error(recovered.error.message);
  return { preview, entries: [createPreviewTransaction(preview), approved, applyReady.value, applying.value, unknown.value, recovered.value] };
}

describe("append-only transaction journal", () => {
  it("accepts the legal staged sequence and preserves every state", () => {
    const ledger = new TransactionJournalLedger();
    const { entries } = sequence();
    for (const entry of entries) expect(ledger.append(entry).ok).toBe(true);
    const first = entries[0]!;

    expect(ledger.history(first.transactionId).map((entry) => entry.stage)).toEqual([
      "previewed", "approved", "apply-ready", "applying", "unknown-outcome", "recovered",
    ]);
    expect(ledger.latest(first.transactionId)?.resolution).toBe("not-committed");
  });

  it("makes exact duplicate appends idempotent and does not duplicate history", () => {
    const ledger = new TransactionJournalLedger();
    const entry = sequence().entries[0]!;
    const first = ledger.append(entry);
    const second = ledger.append(entry);

    expect(first.ok).toBe(true);
    expect(second).toMatchObject({ ok: true, value: { inserted: false } });
    expect(ledger.history(entry.transactionId)).toHaveLength(1);
  });

  it("rejects skipped, changed-identity, and terminal-state transitions", () => {
    const ledger = new TransactionJournalLedger();
    const { entries } = sequence();
    const first = entries[0]!;
    const second = entries[1]!;
    const third = entries[2]!;
    const last = entries.at(-1)!;
    expect(ledger.append(third).ok).toBe(false);
    expect(ledger.append(first).ok).toBe(true);
    expect(ledger.append({ ...second, semanticId: createStableDiceBoxId("journal", "other") }).ok).toBe(false);
    for (const entry of entries.slice(1)) expect(ledger.append(entry).ok).toBe(true);
    expect(ledger.append({ ...last, stage: "previewed" }).ok).toBe(false);
  });

  it("freezes stored entries and round-trips the full history as JSON", () => {
    const ledger = new TransactionJournalLedger();
    const { entries } = sequence();
    const first = entries[0]!;
    for (const entry of entries) ledger.append(entry);
    const stored = ledger.latest(first.transactionId);
    expect(() => { (stored as unknown as { notes: string[] }).notes.push("mutation"); }).toThrow();

    const restored = TransactionJournalLedger.fromJSON(ledger.toJSON());
    expect(restored.ok).toBe(true);
    if (restored.ok) expect(restored.value.entries()).toEqual(ledger.entries());
  });

  it("rejects malformed journal JSON", () => {
    expect(TransactionJournalLedger.fromJSON("not-json").ok).toBe(false);
    expect(TransactionJournalLedger.fromJSON("[{\"stage\":\"committed\"}]").ok).toBe(false);
  });

  it("permits a committed terminal state only after exact binding read-back", () => {
    const ledger = new TransactionJournalLedger();
    const { preview, entries } = sequence();
    const first = entries[0]!;
    const applying = entries[3]!;
    for (const entry of entries.slice(0, 4)) ledger.append(entry);
    const binding: RuntimeBinding = {
      semantic: preview.plan.semantic,
      runtime: "foundry",
      documentType: "JournalEntry",
      documentId: "ledger123",
      uuid: "JournalEntry.world.ledger123",
      generation: 1,
    };
    const committed = markCommittedAfterReadback(applying, binding, "2026-08-21T03:05:00.000Z");
    expect(committed.ok).toBe(true);
    if (committed.ok) {
      expect(ledger.append(committed.value).ok).toBe(true);
      expect(ledger.latest(first.transactionId)?.stage).toBe("committed");
    }
  });
});
