import { describe, expect, it } from "vitest";
import { approveProposalBatch, beginProposalApply, commitProposalAfterReread, previewProposalBatch } from "@dicebox/core";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter";
import type { MissingAssetDetachPreviewReceipt, MissingAssetDetachReceipt, ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";
import { bridgeProjectAssetDetachExecutionToTerminalHistory, projectAssetDetachTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-asset-detach-terminal-history";

const projectId = "dbx:project:m739-asset-detach";
const batchId = "dbx:proposal:m739-asset-detach";
const sceneId = "dbx:scene:m739-main";
const assetSha256 = "a".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const preservedAssetSha256 = "f".repeat(64);
const preservedAssetId = `dbx:asset:sha256-${preservedAssetSha256}`;

const preview: MissingAssetDetachPreviewReceipt = {
  operation: "dicebox.project.asset.detach.preview",
  status: "PREVIEW",
  projectId,
  generation: 4,
  contentSha256: "b".repeat(64),
  migrationStatus: "current",
  assetId,
  assetSha256,
  mediaType: "image/webp",
  byteLength: 4,
  registration: { assetId, role: "background", label: "Missing background", provenance: "user-import", approval: "approved" },
  targetRelativePath: `assets/sha256/${assetSha256}`,
  affectedScenes: [{ sceneId, sceneSha256: "c".repeat(64) }],
  resultingScenes: [{ sceneId, sceneSha256: "d".repeat(64) }],
  resultingAssetCount: 1,
  resultingAssetCollectionSha256: "e".repeat(64),
  nextGeneration: 5,
  resultingContentSha256: "1".repeat(64),
  primaryByteSha256: "2".repeat(64),
  protectedStateSha256: "3".repeat(64),
  assetTreeSha256: "4".repeat(64),
  previewSha256: "5".repeat(64),
  requiresApproval: true,
  noWrite: true,
  noFoundryWrite: true,
};

const sourceReceipt: MissingAssetDetachReceipt = {
  operation: "dicebox.project.asset.detach",
  status: "PASS",
  projectId,
  previousGeneration: 4,
  generation: 5,
  previousContentSha256: preview.contentSha256,
  contentSha256: preview.resultingContentSha256,
  assetId,
  assetSha256,
  targetRelativePath: preview.targetRelativePath,
  affectedScenes: preview.affectedScenes,
  scenes: preview.resultingScenes,
  descriptorRemoved: true,
  assetTreeUnchanged: true,
  workspaceUnchanged: true,
  foreignStateUnchanged: true,
  backupPreservesPriorEnvelope: true,
  targetRemainsAbsent: true,
  authoritativeReload: true,
  previewSha256: preview.previewSha256,
  directoryEntrySync: true,
  noFoundryWrite: true,
};

const inspection: ProjectRecoveryInspectionReceipt = {
  operation: "dicebox.project.recovery.inspect",
  status: "PASS",
  projectId,
  generation: 5,
  contentSha256: preview.resultingContentSha256,
  activeSceneId: sceneId,
  scenes: preview.resultingScenes,
  primary: { relativePath: "projects/m739-asset-detach/project.json", status: "VALID", sourceSchemaVersion: "0.3.0" },
  backup: { relativePath: "projects/m739-asset-detach/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0" },
  registeredAssets: [{
    assetId: preservedAssetId,
    role: "background",
    sha256: preservedAssetSha256,
    mediaType: "image/webp",
    byteLength: 3,
    relativePath: `assets/sha256/${preservedAssetSha256}`,
    affectedSceneIds: [],
    disposition: "PRESENT_VALID",
    restoreEligible: false,
  }],
  pendingArtifacts: [],
  brokenSceneReferences: [],
  retry: "none",
  restoreEligible: false,
  noWrite: true,
  noFoundryWrite: true,
};

async function inputPair() {
  const batch = await createProjectRecoveryProposalBatch({ batchId, preview, createdAt: "2026-08-31T02:00:00.000Z" });
  let history = await previewProposalBatch(batch, { actorId: "human:requester", role: "requester" }, "2026-08-31T02:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T02:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T02:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "human:reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: preview.resultingContentSha256 }, "2026-08-31T02:00:04.000Z");
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return { inspection, preview, receipt: sourceReceipt, session };
}

describe("project.asset.detach terminal-history bridge", () => {
  it("projects the exact committed descriptor-removal lifecycle", async () => {
    const result = bridgeProjectAssetDetachExecutionToTerminalHistory(await inputPair());
    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.asset.detach",
      commandKind: "project.asset.detach",
      projectId,
      assetId,
      assetSha256,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      execution: "not-implemented",
      readyClaim: false,
      assetBytesWrite: false,
      projectContentWrite: true,
      projectPersistenceWrite: true,
      descriptorRemoved: true,
      targetRemainsAbsent: true,
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"],
    });
    expect(projectAssetDetachTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for claimed byte writes and an altered detached asset reread", async () => {
    const alteredReceipt = structuredClone(await inputPair()) as unknown as { receipt: { targetRemainsAbsent: boolean } };
    alteredReceipt.receipt.targetRemainsAbsent = false;
    expect(() => bridgeProjectAssetDetachExecutionToTerminalHistory(alteredReceipt)).toThrow(/targetRemainsAbsent|true|absent/i);
    const alteredInspection = structuredClone(await inputPair()) as unknown as { inspection: { registeredAssets: Array<ProjectRecoveryInspectionReceipt["registeredAssets"][number]> } };
    alteredInspection.inspection.registeredAssets = [{
      ...alteredInspection.inspection.registeredAssets[0]!,
      assetId,
      relativePath: preview.targetRelativePath,
    }];
    expect(() => bridgeProjectAssetDetachExecutionToTerminalHistory(alteredInspection)).toThrow(/detached|absent|target/i);
  });
});
