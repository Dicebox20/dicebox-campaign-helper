import { describe, expect, it } from "vitest";
import {
  approveDesktopProjectProposalSession,
  beginDesktopProjectProposalSessionApply,
  commitDesktopProjectProposalSessionAfterReread,
  createDesktopProjectProposalSession,
  inspectDesktopProjectProposalSession,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { previewProposalBatch, type ProposalBatch, type ProposalBatchActor } from "../packages/dicebox-core/src/proposal-batch.js";
import { createStableDiceBoxId } from "../packages/dicebox-core/src/identity.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";

const projectId = "dbx:project:m876-proposal-history-conformance";
const stableProjectId = createStableDiceBoxId("project", "m876-proposal-history-conformance");
const sceneId = "dbx:scene:m876-proposal-history-conformance-main";
const boundContentSha256 = "b".repeat(64);
const recoveryPreviewSha256 = "c".repeat(64);
const observedAt = (second: number) => `2026-09-01T04:00:${String(second).padStart(2, "0")}.000Z`;
const requester: ProposalBatchActor = { actorId: "human:requester", role: "requester" };
const reviewer: ProposalBatchActor = { actorId: "human:reviewer", role: "reviewer" };

async function committedSession(batch: ProposalBatch, rereadRevision: number, rereadSha256: string) {
  let session = await createDesktopProjectProposalSession({
    projectId,
    batch,
    history: await previewProposalBatch(batch, requester, observedAt(1)),
  });
  session = await approveDesktopProjectProposalSession(session, reviewer, batch.base, observedAt(2));
  session = await beginDesktopProjectProposalSessionApply(session, reviewer, batch.base, observedAt(3));
  return commitDesktopProjectProposalSessionAfterReread(
    session,
    reviewer,
    { status: "matched", targetId: stableProjectId, revision: rereadRevision, sha256: rereadSha256 },
    observedAt(4),
  );
}

describe("M876 cross-producer proposal-history composition", () => {
  it("keeps asset binding and backup promotion as separate committed operation histories", async () => {
    const scene = createBlankProjectScene(projectId);
    const candidate = {
      mediaType: "image/png" as const,
      bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0],
      label: "M876 proposal history.png",
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
      batchId: "dbx:proposal:m876-asset-bind",
      preview: bindingPreview,
      createdAt: observedAt(0),
    });

    const recoveryPreview = {
      operation: "dicebox.project.recovery.backup-promotion.preview",
      status: "PREVIEW",
      projectId,
      primary: { relativePath: "projects/m876-proposal-history-conformance/project.json", status: "MISSING" },
      backup: { relativePath: "projects/m876-proposal-history-conformance/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "d".repeat(64) },
      generation: 2,
      contentSha256: boundContentSha256,
      scenes: [{ sceneId, sceneSha256: "e".repeat(64) }],
      activeSceneId: sceneId,
      assetCount: 1,
      assetCollectionSha256: "f".repeat(64),
      semanticStateSha256: "1".repeat(64),
      backupByteSha256: "d".repeat(64),
      protectedStateSha256: "2".repeat(64),
      assetTreeSha256: "3".repeat(64),
      previewSha256: recoveryPreviewSha256,
      requiresApproval: true,
      noWrite: true,
      noFoundryWrite: true,
    } as const;
    const recoveryBatch = await createProjectRecoveryProposalBatch({
      batchId: "dbx:proposal:m876-backup-promote",
      preview: recoveryPreview,
      createdAt: observedAt(5),
    });

    const committedBinding = await committedSession(bindingBatch, 2, boundContentSha256);
    const committedRecovery = await committedSession(recoveryBatch, 2, boundContentSha256);
    const bindingInspection = inspectDesktopProjectProposalSession(committedBinding);
    const recoveryInspection = inspectDesktopProjectProposalSession(committedRecovery);

    expect(bindingInspection).toMatchObject({
      projectId,
      batchId: "dbx:proposal:m876-asset-bind",
      status: "committed",
      commandCount: 1,
      historyLength: 4,
      noWrite: true,
    });
    expect(recoveryInspection).toMatchObject({
      projectId,
      batchId: "dbx:proposal:m876-backup-promote",
      status: "committed",
      commandCount: 1,
      historyLength: 4,
      noWrite: true,
    });
    expect(bindingBatch.batchId).not.toBe(recoveryBatch.batchId);
    expect(bindingBatch.batchSha256).not.toBe(recoveryBatch.batchSha256);
    expect(bindingBatch.reviewAuthority).toEqual({ domain: "human-review", requiredRole: "reviewer" });
    expect(recoveryBatch.reviewAuthority).toEqual({ domain: "human-review", requiredRole: "reviewer" });
    expect(bindingBatch.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
    expect(recoveryBatch.targetAuthority).toEqual({ domain: "local-project", requiredActiveGm: false });
    expect(bindingBatch.commands[0]).toMatchObject({ kind: "project.asset.bind", payload: { operation: "project.asset.bind", projectId, assetSha256: bindingPreview.assetSha256 } });
    expect(recoveryBatch.commands[0]).toMatchObject({ kind: "project.recovery.backup-promote", payload: { operation: "project.recovery.backup-promote", projectId, contentSha256: boundContentSha256 } });
    expect(committedBinding.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
    expect(committedRecovery.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
    expect(committedBinding.history.receipts.at(-1)?.reread).toEqual({ status: "matched", targetId: projectId, revision: 2, sha256: boundContentSha256 });
    expect(committedRecovery.history.receipts.at(-1)?.reread).toEqual({ status: "matched", targetId: projectId, revision: 2, sha256: boundContentSha256 });
  });
});
