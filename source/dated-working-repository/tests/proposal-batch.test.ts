import { describe, expect, it } from "vitest";
import {
  approveProposalBatch,
  beginProposalApply,
  cancelProposalBatch,
  commitProposalAfterReread,
  createProposalBatch,
  editProposalBatch,
  invalidateStaleProposalBatch,
  markProposalOutcomeUnknown,
  previewProposalBatch,
  recoverProposalAfterReread,
  redoProposalBatch,
  rejectProposalBatch,
  serializeProposalBatch,
  undoProposalBatch,
  validateProposalBatch,
  validateProposalBatchHistory,
  type ProposalBatch,
  type ProposalBatchInput,
} from "@dicebox/core";

const at = (minute: number) => `2026-08-27T20:${String(minute).padStart(2, "0")}:00.000Z`;
const reviewer = { actorId: "reviewer-1", role: "reviewer" as const };
const requester = { actorId: "requester-1", role: "requester" as const };
const gm = { actorId: "gm-1", role: "gm" as const };
const base = { targetId: "dbx:scene:proposal-fixture", revision: 7, sha256: "a".repeat(64) } as const;

const commandA: ProposalBatchInput["commands"][number] = {
  commandId: "dbx:command:add-room",
  kind: "scene.add-room",
  dependsOn: [],
  payload: { roomId: "dbx:room:north", x: 64, labels: ["north", "safe"] },
};

const commandB: ProposalBatchInput["commands"][number] = {
  commandId: "dbx:command:add-door",
  kind: "scene.add-door",
  dependsOn: ["dbx:command:add-room"],
  payload: { doorId: "dbx:door:north", open: false },
};

function input(overrides: Partial<ProposalBatchInput> = {}): ProposalBatchInput {
  return {
    schemaVersion: "0.1.0",
    batchId: "dbx:proposal:fixture",
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "campaign-director", sourceId: "turn-17", provider: "chatgpt-subscription" },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base,
    commands: [commandA, commandB],
    createdAt: at(0),
    ...overrides,
  };
}

async function batch(overrides: Partial<ProposalBatchInput> = {}): Promise<ProposalBatch> {
  return createProposalBatch(input(overrides));
}

describe("generic proposal batch core", () => {
  it("hashes canonical batches deterministically and round-trips strict serialization", async () => {
    const first = await batch();
    const second = await batch();

    expect(first.batchSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(second.batchSha256).toBe(first.batchSha256);
    expect(await validateProposalBatch(JSON.parse(serializeProposalBatch(first)))).toEqual(first);
    await expect(validateProposalBatch({ ...first, risk: "critical" })).rejects.toThrow("hash does not match");
    await expect(validateProposalBatch({ ...first, hidden: true })).rejects.toThrow();
  });

  it("runs preview, approval, apply, authoritative commit, undo, and redo with append-only receipts", async () => {
    const proposal = await batch();
    let history = await previewProposalBatch(proposal, requester, at(1));
    history = await approveProposalBatch(history, proposal, reviewer, base, at(2));
    history = await beginProposalApply(history, proposal, reviewer, base, at(3));
    history = await commitProposalAfterReread(history, proposal, reviewer, { status: "matched", ...base, revision: 8, sha256: "b".repeat(64) }, at(4));
    history = await undoProposalBatch(history, proposal, reviewer, { status: "matched", ...base, revision: 9, sha256: "c".repeat(64) }, at(5));
    history = await redoProposalBatch(history, proposal, reviewer, { status: "matched", ...base, revision: 10, sha256: "d".repeat(64) }, at(6));

    expect(history.status).toBe("redone");
    expect(history.receipts.map((receipt) => receipt.transition)).toEqual([
      "preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo",
    ]);
    expect(history.receipts.map((receipt) => receipt.sequence)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(validateProposalBatchHistory(JSON.parse(JSON.stringify(history)), proposal)).toEqual(history);
    expect(history.receipts[1]?.notes[0]).toContain("does not grant target execution authority");
  });

  it("supports rejection, cancellation, stale invalidation, and hash-bound editing as distinct terminal or replacement paths", async () => {
    const proposal = await batch();
    const preview = await previewProposalBatch(proposal, requester, at(1));

    const rejected = await rejectProposalBatch(preview, proposal, reviewer, at(2));
    const cancelled = await cancelProposalBatch(preview, proposal, requester, at(2));
    const stale = await invalidateStaleProposalBatch(preview, proposal, reviewer, at(2));
    const edited = await editProposalBatch({
      history: preview,
      batch: proposal,
      actor: reviewer,
      observedAt: at(2),
      commands: [commandA],
      risk: "low",
    });

    expect([rejected.status, cancelled.status, stale.status]).toEqual(["rejected", "cancelled", "stale"]);
    expect(edited.batch.revision).toBe(1);
    expect(edited.batch.previousBatchSha256).toBe(proposal.batchSha256);
    expect(edited.batch.batchSha256).not.toBe(proposal.batchSha256);
    expect(edited.history.status).toBe("previewed");
    expect(edited.history.receipts.at(-1)).toMatchObject({ transition: "edit", batchRevision: 1, batchSha256: edited.batch.batchSha256 });
    expect(validateProposalBatchHistory(edited.history, edited.batch)).toEqual(edited.history);
    await expect(approveProposalBatch(edited.history, proposal, reviewer, base, at(3))).rejects.toThrow("supplied batch revision and hash");
  });

  it("treats timeout as unknown, forbids retry, and resolves only from authoritative reread", async () => {
    const proposal = await batch();
    let history = await previewProposalBatch(proposal, requester, at(1));
    history = await approveProposalBatch(history, proposal, reviewer, base, at(2));
    history = await beginProposalApply(history, proposal, reviewer, base, at(3));
    history = await markProposalOutcomeUnknown(history, proposal, reviewer, at(4));

    await expect(beginProposalApply(history, proposal, reviewer, base, at(5))).rejects.toThrow("not allowed");
    const stillUnknown = await recoverProposalAfterReread(history, proposal, reviewer, { status: "unknown", targetId: base.targetId, revision: null, sha256: null }, at(5));
    expect(stillUnknown.status).toBe("unknown-outcome");
    expect(stillUnknown.receipts.at(-1)?.notes[0]).toContain("retry is still forbidden");

    const recovered = await recoverProposalAfterReread(stillUnknown, proposal, reviewer, { status: "not-committed", ...base }, at(6));
    expect(recovered.status).toBe("recovered");

    const matched = await recoverProposalAfterReread(history, proposal, reviewer, { status: "matched", ...base, revision: 8, sha256: "e".repeat(64) }, at(5));
    expect(matched.status).toBe("committed");
  });

  it("rejects stale bases, wrong reviewers, illegal transitions, and non-GM Foundry dispatch", async () => {
    const proposal = await batch();
    const preview = await previewProposalBatch(proposal, requester, at(1));
    const changedBase = { ...base, revision: 8 };

    await expect(approveProposalBatch(preview, proposal, requester, base, at(2))).rejects.toThrow("requires role reviewer");
    await expect(approveProposalBatch(preview, proposal, reviewer, changedBase, at(2))).rejects.toThrow("base is stale");
    await expect(beginProposalApply(preview, proposal, reviewer, base, at(2))).rejects.toThrow("not allowed");

    const foundry = await batch({
      batchId: "dbx:proposal:foundry-fixture",
      reviewAuthority: { domain: "foundry-runtime", requiredRole: "gm" },
      targetAuthority: { domain: "foundry-active-gm", requiredActiveGm: true },
    });
    let foundryHistory = await previewProposalBatch(foundry, requester, at(1));
    foundryHistory = await approveProposalBatch(foundryHistory, foundry, gm, base, at(2));
    await expect(beginProposalApply(foundryHistory, foundry, reviewer, base, at(3))).rejects.toThrow("current active-GM role");
    expect((await beginProposalApply(foundryHistory, foundry, gm, base, at(3))).status).toBe("applying");
  });

  it("rejects duplicate, missing, cyclic, dependency-unsorted, and noncanonical commands", async () => {
    await expect(batch({ commands: [commandA, commandA] })).rejects.toThrow("Duplicate");
    await expect(batch({ commands: [{ ...commandB, dependsOn: ["dbx:command:missing"] }] })).rejects.toThrow("missing dependency");
    await expect(batch({ commands: [
      { ...commandA, dependsOn: [commandB.commandId] },
      { ...commandB, dependsOn: [commandA.commandId] },
    ] })).rejects.toThrow("cycle");
    await expect(batch({ commands: [commandB, commandA] })).rejects.toThrow("canonical topological order");
    await expect(batch({ commands: [
      commandA,
      { ...commandB, dependsOn: ["dbx:command:z", "dbx:command:a"] },
      { commandId: "dbx:command:a", kind: "noop", dependsOn: [], payload: {} },
      { commandId: "dbx:command:z", kind: "noop", dependsOn: [], payload: {} },
    ] })).rejects.toThrow("lexically ordered");
  });

  it("rejects malformed target authority, reread claims, and append-only history drift", async () => {
    await expect(batch({ targetAuthority: { domain: "local-project", requiredActiveGm: true } })).rejects.toThrow();
    const proposal = await batch();
    const preview = await previewProposalBatch(proposal, requester, at(1));
    const approved = await approveProposalBatch(preview, proposal, reviewer, base, at(2));
    const applying = await beginProposalApply(approved, proposal, reviewer, base, at(3));

    await expect(commitProposalAfterReread(applying, proposal, reviewer, { status: "unknown", targetId: base.targetId, revision: 8, sha256: "b".repeat(64) }, at(4))).rejects.toThrow();
    await expect(commitProposalAfterReread(applying, proposal, reviewer, { status: "matched", targetId: "dbx:scene:foreign", revision: 8, sha256: "b".repeat(64) }, at(4))).rejects.toThrow("target does not match");

    expect(() => validateProposalBatchHistory({ ...approved, status: "previewed" }, proposal)).toThrow("summary status");
    expect(() => validateProposalBatchHistory({ ...approved, receipts: approved.receipts.map((receipt, index) => index === 1 ? { ...receipt, sequence: 9 } : receipt) }, proposal)).toThrow("sequence or identity drifted");
    expect(() => validateProposalBatchHistory({ ...approved, receipts: approved.receipts.map((receipt, index) => index === 1 ? { ...receipt, fromStatus: "approved" } : receipt) }, proposal)).toThrow("status chain drifted");
  });
});
