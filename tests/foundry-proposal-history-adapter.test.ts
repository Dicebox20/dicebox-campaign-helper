import { describe, expect, it } from "vitest";
import { createFoundryTerminalProposalHistoryEvidence } from "@dicebox/compiler";
import { createProposalBatch } from "@dicebox/core";

const observedAt = "2026-08-30T18:00:00.000Z";
const planId = "dbx:plan:history-adapter";
const planSha256 = "a".repeat(64);

async function batch(kind: "foundry" | "compiler" = "foundry") {
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: "dbx:proposal:history-adapter",
    revision: 0,
    previousBatchSha256: null,
    producer: { kind, sourceId: planId, provider: kind === "foundry" ? "foundry-14.367" : null },
    reviewAuthority: kind === "foundry" ? { domain: "foundry-runtime", requiredRole: "gm" } : { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: kind === "foundry" ? { domain: "foundry-active-gm", requiredActiveGm: true } : { domain: "none", requiredActiveGm: false },
    risk: "high",
    base: { targetId: planId, revision: 0, sha256: planSha256 },
    commands: [{ commandId: "dbx:proposal-command:history-adapter-000", kind: "foundry.create.scene", dependsOn: [], payload: { stableId: "dbx:scene:history-adapter" } }],
    createdAt: observedAt,
  });
}

function receipt(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "0.1.0", receiptId: "dbx:staged-receipt:history-adapter-committed", operation: "staged-foundry-ir.execute", status: "committed",
    planId, planSha256, committedStableIds: ["dbx:scene:history-adapter"], unresolvedStableIds: [], idempotencyKeys: ["dbx:staged-idempotency:history-adapter"], recoveryKeys: ["dbx:staged-recovery:history-adapter"], blockers: [],
    adapterBoundary: "injected-adapter-only", noSameBatchReferences: true, authoritativeReread: true, unknownOutcome: false, foreignStatePreserved: true, readyClaim: false, observedAt, notes: ["matched reread"], ...overrides,
  };
}

const reread = { status: "matched", targetId: planId, revision: 0, sha256: planSha256 };

describe("Foundry terminal staged-executor proposal-history adapter", () => {
  it("maps only a terminal matched Foundry receipt into non-executing history metadata", async () => {
    const evidence = await createFoundryTerminalProposalHistoryEvidence({ batch: await batch(), receipt: receipt(), reread });
    expect(evidence).toMatchObject({ status: "committed", transition: "commit-after-reread", targetAuthority: "foundry-active-gm", requiredActiveGm: true, executionAuthority: "staged-executor-only", undoRedo: "not-implemented" });
  });

  it("fails closed for unresolved, hash-mismatched, foreign, or non-Foundry evidence", async () => {
    const current = await batch();
    await expect(createFoundryTerminalProposalHistoryEvidence({ batch: current, receipt: receipt({ status: "unknown", unknownOutcome: true, authoritativeReread: false }), reread })).rejects.toThrow("terminal");
    await expect(createFoundryTerminalProposalHistoryEvidence({ batch: current, receipt: receipt({ planSha256: "b".repeat(64) }), reread })).rejects.toThrow("target or hash");
    await expect(createFoundryTerminalProposalHistoryEvidence({ batch: await batch("compiler"), receipt: receipt(), reread })).rejects.toThrow("Foundry proposal batch");
  });
});
