import { describe, expect, it } from "vitest";
import {
  approveDesktopProjectProposalSession,
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  createDesktopProjectProposalSession,
  inspectDesktopProjectProposalSession,
  undoDesktopProjectProposalSession,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createStableDiceBoxId } from "../packages/dicebox-core/src/identity.js";
import { previewProposalBatch, redoProposalBatch, type ProposalBatch, type ProposalBatchActor, type ProposalBatchReread } from "../packages/dicebox-core/src/proposal-batch.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";

const projectId = "dbx:project:m884-proposal-undo-redo-composition";
const stableProjectId = createStableDiceBoxId("project", "m884-proposal-undo-redo-composition");
const foreignProjectId = createStableDiceBoxId("project", "m884-foreign");
const sceneId = "dbx:scene:m884-proposal-undo-redo-composition-main";
const observedAt = (second: number) => `2026-09-01T08:00:${String(second).padStart(2, "0")}.000Z`;
const requester: ProposalBatchActor = { actorId: "human:m884-requester", role: "requester" };
const reviewer: ProposalBatchActor = { actorId: "human:m884-reviewer", role: "reviewer" };
const contentSha256 = "b".repeat(64);
const emptySha256 = "0".repeat(64);

async function makeOperationBatches(): Promise<readonly [ProposalBatch, ProposalBatch]> {
  const scene = createBlankProjectScene(projectId);
  const candidate = {
    mediaType: "image/png" as const,
    bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0],
    label: "M884 proposal undo-redo.png",
    provenance: "user-import" as const,
  };
  const bindingPreview = await createProjectAssetBindingPreview({
    projectId,
    currentGeneration: 1,
    currentContentSha256: emptySha256,
    candidate,
    sceneId: scene.id,
    proposedSceneCount: 1,
    proposedActiveSceneId: scene.id,
    proposedAssetCount: 1,
  });
  const bindingBatch = await createProjectAssetBindingProposalBatch({
    batchId: "dbx:proposal:m884-asset-bind",
    preview: bindingPreview,
    createdAt: observedAt(0),
  });
  const recoveryBatch = await createProjectRecoveryProposalBatch({
    batchId: "dbx:proposal:m884-backup-promote",
    preview: {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId,
      primary: { relativePath: "projects/m884-proposal-undo-redo-composition/project.json", status: "MISSING" },
      backup: { relativePath: "projects/m884-proposal-undo-redo-composition/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "d".repeat(64) },
      generation: 2,
      contentSha256,
      scenes: [{ sceneId, sceneSha256: "e".repeat(64) }],
      activeSceneId: sceneId,
      assetCount: 1,
      assetCollectionSha256: "f".repeat(64),
      semanticStateSha256: "1".repeat(64),
      backupByteSha256: "d".repeat(64),
      protectedStateSha256: "2".repeat(64),
      assetTreeSha256: "3".repeat(64),
      previewSha256: "c".repeat(64),
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    },
    createdAt: observedAt(1),
  });
  return [bindingBatch, recoveryBatch];
}

function matchedReread(targetId: ProposalBatchReread["targetId"], revision: number, sha256: string): ProposalBatchReread {
  return { status: "matched", targetId, revision, sha256 };
}

async function committedSession(batch: ProposalBatch, offset: number) {
  let session = await createDesktopProjectProposalSession({
    projectId,
    batch,
    history: await previewProposalBatch(batch, requester, observedAt(offset)),
  });
  session = await approveDesktopProjectProposalSession(session, reviewer, batch.base, observedAt(offset + 1));
  session = await beginDesktopProjectProposalSessionApply(session, reviewer, batch.base, observedAt(offset + 2));
  return commitDesktopProjectProposalSessionAfterReread(
    session,
    reviewer,
    matchedReread(stableProjectId, 2, contentSha256),
    observedAt(offset + 3),
  );
}

async function redoSession(session: Awaited<ReturnType<typeof committedSession>> extends infer T ? T : never, reread: ProposalBatchReread, observedAt: string) {
  const history = await redoProposalBatch(session.history, session.batch, reviewer, reread, observedAt);
  return createDesktopProjectProposalSession({ projectId, batch: session.batch, history });
}

describe("M884 operation-specific proposal undo/redo composition", () => {
  it("requires matched rereads for committed undo and redo histories of both producers", async () => {
    const batches = await makeOperationBatches();
    for (const [index, batch] of batches.entries()) {
      const committed = await committedSession(batch, index * 10);
      expect(committed.history.status).toBe("committed");
      expect(committed.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
      expect(committed.history.receipts.at(-1)?.reread).toEqual(matchedReread(stableProjectId, 2, contentSha256));

      await expect(undoDesktopProjectProposalSession(committed, reviewer, matchedReread(foreignProjectId, 1, emptySha256), observedAt(index * 10 + 4))).rejects.toThrow(/target|match/i);
      await expect(undoDesktopProjectProposalSession(committed, reviewer, { status: "conflict", targetId: stableProjectId, revision: 1, sha256: emptySha256 }, observedAt(index * 10 + 4))).rejects.toThrow(/matched|reread/i);
      const undone = await undoDesktopProjectProposalSession(committed, reviewer, matchedReread(stableProjectId, 1, emptySha256), observedAt(index * 10 + 4));
      expect(inspectDesktopProjectProposalSession(undone)).toMatchObject({ projectId, batchId: batch.batchId, status: "undone", commandCount: 1, historyLength: 5, noWrite: true });
      expect(undone.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
      expect(undone.history.receipts.at(-1)?.reread).toEqual(matchedReread(stableProjectId, 1, emptySha256));

      await expect(redoSession(undone, matchedReread(foreignProjectId, 2, contentSha256), observedAt(index * 10 + 5))).rejects.toThrow(/target|match/i);
      await expect(redoSession(undone, { status: "unknown", targetId: stableProjectId, revision: null, sha256: null }, observedAt(index * 10 + 5))).rejects.toThrow(/matched|reread/i);
      const redone = await redoSession(undone, matchedReread(stableProjectId, 2, contentSha256), observedAt(index * 10 + 5));
      expect(inspectDesktopProjectProposalSession(redone)).toMatchObject({ projectId, batchId: batch.batchId, status: "redone", commandCount: 1, historyLength: 6, noWrite: true });
      expect(redone.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"]);
      expect(redone.history.receipts.at(-1)?.reread).toEqual(matchedReread(stableProjectId, 2, contentSha256));
      expect(redone.history.receipts.filter((receipt) => receipt.reread !== null).map((receipt) => receipt.reread)).toEqual([
        matchedReread(stableProjectId, 2, contentSha256),
        matchedReread(stableProjectId, 1, emptySha256),
        matchedReread(stableProjectId, 2, contentSha256),
      ]);
      await expect(redoSession(redone, matchedReread(stableProjectId, 2, contentSha256), observedAt(index * 10 + 6))).rejects.toThrow(/not allowed|transition/i);
    }

    expect(batches[0]?.batchId).not.toBe(batches[1]?.batchId);
    expect(batches[0]?.batchSha256).not.toBe(batches[1]?.batchSha256);
    expect(batches[0]?.base.targetId).toBe(stableProjectId);
    expect(batches[1]?.base.targetId).toBe(stableProjectId);
    expect(batches[0]?.producer.provider).toBeNull();
    expect(batches[1]?.producer.provider).toBeNull();
    expect(batches[0]?.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
    expect(batches[1]?.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
  });
});
