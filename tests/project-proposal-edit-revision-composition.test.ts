import { describe, expect, it } from "vitest";
import {
  approveDesktopProjectProposalSession,
  createDesktopProjectProposalSession,
  editDesktopProjectProposalSession,
  inspectDesktopProjectProposalSession,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createStableDiceBoxId } from "../packages/dicebox-core/src/identity.js";
import { previewProposalBatch, type ProposalBatch, type ProposalBatchActor } from "../packages/dicebox-core/src/proposal-batch.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";

const projectId = "dbx:project:m880-proposal-edit-revision-composition";
const stableProjectId = createStableDiceBoxId("project", "m880-proposal-edit-revision-composition");
const sceneId = "dbx:scene:m880-proposal-edit-revision-composition-main";
const observedAt = (second: number) => `2026-09-01T06:00:${String(second).padStart(2, "0")}.000Z`;
const requester: ProposalBatchActor = { actorId: "human:m880-requester", role: "requester" };
const reviewer: ProposalBatchActor = { actorId: "human:m880-reviewer", role: "reviewer" };

async function makeOperationBatches(): Promise<readonly [ProposalBatch, ProposalBatch]> {
  const scene = createBlankProjectScene(projectId);
  const candidate = {
    mediaType: "image/png" as const,
    bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0],
    label: "M880 proposal edit.png",
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
    batchId: "dbx:proposal:m880-asset-bind",
    preview: bindingPreview,
    createdAt: observedAt(0),
  });
  const recoveryBatch = await createProjectRecoveryProposalBatch({
    batchId: "dbx:proposal:m880-backup-promote",
    preview: {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId,
      primary: { relativePath: "projects/m880-proposal-edit-revision-composition/project.json", status: "MISSING" },
      backup: { relativePath: "projects/m880-proposal-edit-revision-composition/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "d".repeat(64) },
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

describe("M880 operation-specific proposal edit/revision composition", () => {
  it("creates a new hash-bound revision and requires fresh review for both producers", async () => {
    const batches = await makeOperationBatches();
    for (const [index, batch] of batches.entries()) {
      const initial = await createDesktopProjectProposalSession({
        projectId,
        batch,
        history: await previewProposalBatch(batch, requester, observedAt(index * 8)),
      });
      const edited = await editDesktopProjectProposalSession(initial, reviewer, batch.commands, observedAt(index * 8 + 1), "high");
      const inspection = inspectDesktopProjectProposalSession(edited);

      expect(inspection).toMatchObject({ projectId, batchRevision: 1, status: "previewed", historyLength: 2, noWrite: true });
      expect(edited.batch.batchId).toBe(batch.batchId);
      expect(edited.batch.batchSha256).not.toBe(batch.batchSha256);
      expect(edited.batch.previousBatchSha256).toBe(batch.batchSha256);
      expect(edited.batch.revision).toBe(batch.revision + 1);
      expect(edited.batch.risk).toBe("high");
      expect(edited.batch.commands[0]?.kind).toBe(batch.commands[0]?.kind);
      expect(edited.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "edit"]);
      expect(edited.history.receipts.every((receipt) => receipt.reread === null)).toBe(true);
      expect(edited.history.receipts.some((receipt) => receipt.transition === "begin-apply" || receipt.transition === "commit-after-reread")).toBe(false);

      await expect(createDesktopProjectProposalSession({ projectId, batch: edited.batch, history: initial.history })).rejects.toThrow(/revision|hash|batch/i);
      const freshApproval = await approveDesktopProjectProposalSession(edited, reviewer, edited.batch.base, observedAt(index * 8 + 2));
      expect(freshApproval.history.status).toBe("approved");
      expect(freshApproval.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "edit", "approve"]);
      expect(freshApproval.history.receipts.at(-1)?.batchRevision).toBe(edited.batch.revision);
      expect(freshApproval.history.receipts.at(-1)?.batchSha256).toBe(edited.batch.batchSha256);
      expect(freshApproval.history.receipts.at(-1)?.reread).toBeNull();
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
