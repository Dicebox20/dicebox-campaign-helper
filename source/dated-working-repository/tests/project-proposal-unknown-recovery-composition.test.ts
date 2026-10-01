import { describe, expect, it } from "vitest";
import {
  approveDesktopProjectProposalSession,
  beginDesktopProjectProposalSessionApply,
  createDesktopProjectProposalSession,
  desktopProjectProposalRecoveryView,
  markDesktopProjectProposalOutcomeUnknown,
  recoverDesktopProjectProposalSession,
  inspectDesktopProjectProposalSession,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createStableDiceBoxId } from "../packages/dicebox-core/src/identity.js";
import {
  previewProposalBatch,
  type ProposalBatch,
  type ProposalBatchActor,
  type ProposalBatchReread,
} from "../packages/dicebox-core/src/proposal-batch.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";

const projectId = "dbx:project:m882-proposal-unknown-recovery-composition";
const stableProjectId = createStableDiceBoxId("project", "m882-proposal-unknown-recovery-composition");
const sceneId = "dbx:scene:m882-proposal-unknown-recovery-composition-main";
const observedAt = (second: number) => `2026-09-01T07:00:${String(second).padStart(2, "0")}.000Z`;
const requester: ProposalBatchActor = { actorId: "human:m882-requester", role: "requester" };
const reviewer: ProposalBatchActor = { actorId: "human:m882-reviewer", role: "reviewer" };

async function makeOperationBatches(): Promise<readonly [ProposalBatch, ProposalBatch]> {
  const scene = createBlankProjectScene(projectId);
  const candidate = {
    mediaType: "image/png" as const,
    bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0],
    label: "M882 proposal recovery.png",
    provenance: "user-import" as const,
  };
  const bindingPreview = await createProjectAssetBindingPreview({
    projectId,
    currentGeneration: 1,
    currentContentSha256: "0".repeat(64),
    candidate,
    sceneId: scene.id,
    proposedSceneCount: 1,
    proposedActiveSceneId: scene.id,
    proposedAssetCount: 1,
  });
  const bindingBatch = await createProjectAssetBindingProposalBatch({
    batchId: "dbx:proposal:m882-asset-bind",
    preview: bindingPreview,
    createdAt: observedAt(0),
  });
  const recoveryBatch = await createProjectRecoveryProposalBatch({
    batchId: "dbx:proposal:m882-backup-promote",
    preview: {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId,
      primary: { relativePath: "projects/m882-proposal-unknown-recovery-composition/project.json", status: "MISSING" },
      backup: { relativePath: "projects/m882-proposal-unknown-recovery-composition/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "d".repeat(64) },
      generation: 2,
      contentSha256: "b".repeat(64),
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

function rereadFor(status: ProposalBatchReread["status"]): ProposalBatchReread {
  if (status === "unknown") return { status, targetId: stableProjectId, revision: null, sha256: null };
  return { status, targetId: stableProjectId, revision: status === "conflict" ? 9 : 1, sha256: status === "conflict" ? "c".repeat(64) : "0".repeat(64) };
}

describe("M882 operation-specific proposal unknown-outcome/recovery composition", () => {
  it("requires reread before recovery and preserves the typed outcome mapping", async () => {
    const batches = await makeOperationBatches();
    const outcomes: readonly ProposalBatchReread["status"][] = ["not-committed", "conflict", "unknown"];
    for (const [batchIndex, batch] of batches.entries()) {
      for (const [outcomeIndex, outcome] of outcomes.entries()) {
        const offset = (batchIndex * outcomes.length + outcomeIndex) * 8;
        const initial = await createDesktopProjectProposalSession({
          projectId,
          batch,
          history: await previewProposalBatch(batch, requester, observedAt(offset)),
        });
        const approved = await approveDesktopProjectProposalSession(initial, reviewer, batch.base, observedAt(offset + 1));
        const applying = await beginDesktopProjectProposalSessionApply(approved, reviewer, batch.base, observedAt(offset + 2));
        const reread = rereadFor(outcome);

        await expect(recoverDesktopProjectProposalSession(applying, reviewer, reread, observedAt(offset + 3))).rejects.toThrow(/not allowed|transition/i);
        const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, reviewer, observedAt(offset + 3));
        expect(unknown.history.status).toBe("unknown-outcome");
        expect(desktopProjectProposalRecoveryView(unknown)).toMatchObject({ outcomeUnknown: true, authoritativeRereadRequired: true, retryAllowed: false });
        await expect(beginDesktopProjectProposalSessionApply(unknown, reviewer, batch.base, observedAt(offset + 4))).rejects.toThrow(/not allowed|transition/i);

        const recovered = await recoverDesktopProjectProposalSession(unknown, reviewer, reread, observedAt(offset + 5));
        const expectedStatus = outcome === "unknown" ? "unknown-outcome" : "recovered";
        expect(recovered.history.status).toBe(expectedStatus);
        expect(recovered.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "mark-unknown", "recover-after-reread"]);
        expect(recovered.history.receipts.at(-1)?.reread).toEqual(reread);
        expect(recovered.history.receipts.filter((receipt) => receipt.reread !== null).map((receipt) => receipt.reread)).toEqual([reread]);
        expect(inspectDesktopProjectProposalSession(recovered)).toMatchObject({ projectId, batchId: batch.batchId, commandCount: 1, historyLength: 5, noWrite: true });
        await expect(beginDesktopProjectProposalSessionApply(recovered, reviewer, batch.base, observedAt(offset + 6))).rejects.toThrow(/not allowed|transition/i);
      }
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
