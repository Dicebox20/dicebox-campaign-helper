import { describe, expect, it } from "vitest";
import {
  approveTransaction,
  createPreviewTransaction,
  fingerprintManagedJournalEntry,
  markApplying,
  markUnknownOutcome,
  prepareTransaction,
  previewManagedJournalEntry,
  recoverUnknownOutcome,
  type ApprovalToken,
  type DocumentPlanPreview,
  type TransactionJournal,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type Result, type RuntimeProfile } from "@dicebox/core";

const approvedAt = "2026-08-21T01:00:00.000Z";
const applyingAt = "2026-08-21T01:05:00.000Z";
const expiry = "2026-08-21T02:00:00.000Z";

function readyRuntime(): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt: approvedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [
      { id: "foundry.document.write", state: "available", reason: "fixture" },
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
  };
}

function preview(): DocumentPlanPreview {
  return previewManagedJournalEntry({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "transaction-journal"),
    semantic: { id: createStableDiceBoxId("journal", "transaction"), kind: "journal" },
    documentType: "JournalEntry",
    operation: "create",
    title: "Transaction fixture",
    content: "A bounded transaction fixture.",
    expectedBindingGeneration: 0,
  }, readyRuntime(), { authority: "gm", observedAt: approvedAt });
}

function tokenFor(currentPreview: DocumentPlanPreview): ApprovalToken {
  return {
    schemaVersion: "0.1.0",
    tokenId: createStableDiceBoxId("approval", "transaction-journal"),
    planId: currentPreview.plan.planId,
    previewReceiptId: currentPreview.receipt.receiptId as ApprovalToken["previewReceiptId"],
    planFingerprint: fingerprintManagedJournalEntry(currentPreview.plan),
    approvedBy: "gm",
    approvedByUserId: "gm-fixture",
    approvedAt,
    expiresAt: expiry,
  };
}

function unwrap<T>(result: Result<T>): T {
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result.value;
}

function applyingTransaction(): { currentPreview: DocumentPlanPreview; transaction: TransactionJournal } {
  const currentPreview = preview();
  const transaction = createPreviewTransaction(currentPreview);
  const approved = unwrap(approveTransaction(transaction, currentPreview, tokenFor(currentPreview), { observedAt: approvedAt, activeGmUserId: "gm-fixture" }));
  const applyReady = unwrap(prepareTransaction(approved, applyingAt));
  return { currentPreview, transaction: unwrap(markApplying(applyReady, applyingAt)) };
}

describe("M3 approval and staged transaction contract", () => {
  it("binds approval to the exact preview and advances to apply-ready", () => {
    const currentPreview = preview();
    const transaction = createPreviewTransaction(currentPreview);
    const approved = unwrap(approveTransaction(transaction, currentPreview, tokenFor(currentPreview), { observedAt: approvedAt, activeGmUserId: "gm-fixture" }));
    const applyReady = unwrap(prepareTransaction(approved, applyingAt));

    expect(transaction.transactionId).toBe(createStableDiceBoxId("transaction", "transaction-journal"));
    expect(approved.stage).toBe("approved");
    expect(applyReady.stage).toBe("apply-ready");
    expect(applyReady.approvalTokenId).toBe(tokenFor(currentPreview).tokenId);
    expect(applyReady.approvedByUserId).toBe("gm-fixture");
  });

  it("rejects a token for a different plan or expired approval window", () => {
    const currentPreview = preview();
    const transaction = createPreviewTransaction(currentPreview);
    const mismatched = { ...tokenFor(currentPreview), planId: createStableDiceBoxId("plan", "other") };
    const expired = { ...tokenFor(currentPreview), expiresAt: approvedAt };

    const mismatchResult = approveTransaction(transaction, currentPreview, mismatched, { observedAt: applyingAt, activeGmUserId: "gm-fixture" });
    const expiredResult = approveTransaction(transaction, currentPreview, expired, { observedAt: applyingAt, activeGmUserId: "gm-fixture" });
    expect(mismatchResult.ok).toBe(false);
    expect(expiredResult.ok).toBe(false);
    if (!mismatchResult.ok) expect(mismatchResult.error.code).toBe("FORBIDDEN");
    if (!expiredResult.ok) expect(expiredResult.error.code).toBe("FORBIDDEN");
  });

  it("does not permit a second approval or a direct apply transition", () => {
    const currentPreview = preview();
    const transaction = createPreviewTransaction(currentPreview);
    const approved = unwrap(approveTransaction(transaction, currentPreview, tokenFor(currentPreview), { observedAt: approvedAt, activeGmUserId: "gm-fixture" }));
    const secondApproval = approveTransaction(approved, currentPreview, tokenFor(currentPreview), { observedAt: applyingAt, activeGmUserId: "gm-fixture" });
    const directApplying = markApplying(transaction, applyingAt);

    expect(secondApproval.ok).toBe(false);
    expect(directApplying.ok).toBe(false);
  });

  it("rejects approval when the active GM identity changed", () => {
    const currentPreview = preview();
    const transaction = createPreviewTransaction(currentPreview);
    const result = approveTransaction(transaction, currentPreview, tokenFor(currentPreview), {
      observedAt: approvedAt,
      activeGmUserId: "different-gm",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain("currently rechecked active GM");
  });

  it("records applying and unknown outcome without authorizing retry", () => {
    const { transaction } = applyingTransaction();
    const unknown = unwrap(markUnknownOutcome(transaction, applyingAt));
    const rereadStillUnknown = unwrap(recoverUnknownOutcome(unknown, {
      status: "unknown",
      binding: null,
      observedAt: "2026-08-21T01:06:00.000Z",
      notes: ["The world could not be read after the timeout."],
    }));

    expect(transaction.stage).toBe("applying");
    expect(unknown.stage).toBe("unknown-outcome");
    expect(rereadStillUnknown.stage).toBe("unknown-outcome");
    expect(rereadStillUnknown.notes.join(" ")).toContain("retry is not authorized");
  });

  it("commits only after an exact binding is confirmed by reread", () => {
    const { transaction, currentPreview } = applyingTransaction();
    const unknown = unwrap(markUnknownOutcome(transaction, applyingAt));
    const committed = unwrap(recoverUnknownOutcome(unknown, {
      status: "committed",
      binding: {
        semantic: currentPreview.plan.semantic,
        runtime: "foundry",
        documentType: "JournalEntry",
        documentId: "fixture123",
        uuid: "JournalEntry.world.fixture123",
        generation: 1,
      },
      observedAt: "2026-08-21T01:07:00.000Z",
      notes: ["Exact binding reread."],
    }));

    expect(committed.stage).toBe("committed");
    expect(committed.resolution).toBe("committed");
    expect(committed.binding?.uuid).toBe("JournalEntry.world.fixture123");
  });

  it("preserves not-committed and conflicting state as recovered outcomes", () => {
    const first = applyingTransaction();
    const firstUnknown = unwrap(markUnknownOutcome(first.transaction, applyingAt));
    const notCommitted = unwrap(recoverUnknownOutcome(firstUnknown, {
      status: "not-committed",
      binding: null,
      observedAt: "2026-08-21T01:08:00.000Z",
      notes: ["No exact managed binding was found."],
    }));

    const second = applyingTransaction();
    const secondUnknown = unwrap(markUnknownOutcome(second.transaction, applyingAt));
    const conflict = unwrap(recoverUnknownOutcome(secondUnknown, {
      status: "conflict",
      binding: {
        semantic: { id: createStableDiceBoxId("journal", "foreign"), kind: "journal" },
        runtime: "foundry",
        documentType: "JournalEntry",
        documentId: "foreign123",
        uuid: "JournalEntry.world.foreign123",
        generation: 3,
      },
      observedAt: "2026-08-21T01:09:00.000Z",
      notes: ["Foreign state was observed."],
    }));

    expect(notCommitted).toMatchObject({ stage: "recovered", resolution: "not-committed", binding: null });
    expect(conflict).toMatchObject({ stage: "recovered", resolution: "conflict", binding: { documentId: "foreign123" } });
    expect(conflict.notes.join(" ")).toContain("preserved");
  });
});
