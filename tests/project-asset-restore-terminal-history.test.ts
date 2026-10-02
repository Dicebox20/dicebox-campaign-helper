import { describe, expect, it } from "vitest";
import { approveProposalBatch, beginProposalApply, commitProposalAfterReread, previewProposalBatch } from "@dicebox/core";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter";
import type { MissingAssetRestoreReceipt, ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";
import { bridgeProjectAssetRestoreExecutionToTerminalHistory, projectAssetRestoreTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-asset-restore-terminal-history";

const projectId = "dbx:project:m737-asset-restore";
const batchId = "dbx:proposal:m737-asset-restore";
const sceneId = "dbx:scene:m737-main";
const assetSha256 = "a".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;

const preview = {
  operation: "dicebox.project.asset.restore.preview",
  status: "PREVIEW",
  projectId,
  generation: 4,
  contentSha256: "b".repeat(64),
  migrationStatus: "current",
  recoveredFrom: null,
  assetId,
  assetSha256,
  mediaType: "image/webp",
  byteLength: 4,
  targetRelativePath: `assets/sha256/${assetSha256}`,
  affectedSceneIds: [sceneId],
  candidateSha256: assetSha256,
  candidateByteLength: 4,
  protectedStateSha256: "1".repeat(64),
  previewSha256: "2".repeat(64),
  requiresApproval: true,
  noWrite: true,
  noFoundryWrite: true,
  registration: { assetId, role: "background", label: "Restored background", provenance: "user-import", approval: "approved" },
};

const sourceReceipt: MissingAssetRestoreReceipt = {
  operation: "dicebox.project.asset.restore",
  status: "PASS",
  projectId,
  generation: 4,
  contentSha256: preview.contentSha256,
  assetId,
  assetSha256,
  mediaType: preview.mediaType,
  byteLength: preview.byteLength,
  targetRelativePath: preview.targetRelativePath,
  affectedSceneIds: preview.affectedSceneIds,
  previewSha256: preview.previewSha256,
  authoritativeAssetSha256: assetSha256,
  authoritativeProjectContentSha256: preview.contentSha256,
  envelopeUnchanged: true,
  projectStateUnchanged: true,
  scenesUnchanged: true,
  workspaceUnchanged: true,
  backupsUnchanged: true,
  foreignStateUnchanged: true,
  createNewOnly: true,
  directoryEntrySync: true,
  noProjectWrite: true,
  noFoundryWrite: true,
};

const inspection: ProjectRecoveryInspectionReceipt = {
  operation: "dicebox.project.recovery.inspect",
  status: "PASS",
  projectId,
  generation: 4,
  contentSha256: preview.contentSha256,
  activeSceneId: sceneId,
  scenes: [{ sceneId, sceneSha256: "c".repeat(64) }],
  primary: { relativePath: "projects/m737-asset-restore/project.json", status: "VALID", sourceSchemaVersion: "0.3.0" },
  backup: { relativePath: "projects/m737-asset-restore/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0" },
  registeredAssets: [{
    assetId,
    role: "background",
    sha256: assetSha256,
    mediaType: preview.mediaType,
    byteLength: preview.byteLength,
    relativePath: preview.targetRelativePath,
    affectedSceneIds: [sceneId],
    disposition: "PRESENT_VALID",
    retry: "none",
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
  const batch = await createProjectRecoveryProposalBatch({ batchId, preview, createdAt: "2026-08-31T01:00:00.000Z" });
  let history = await previewProposalBatch(batch, { actorId: "human:requester", role: "requester" }, "2026-08-31T01:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T01:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T01:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "human:reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: preview.contentSha256 }, "2026-08-31T01:00:04.000Z");
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return { expectedRemainingAssetIds: [], inspection, preview, receipt: sourceReceipt, session };
}

describe("project.asset.restore terminal-history bridge", () => {
  it("projects the exact committed create-new-only restore lifecycle", async () => {
    const result = bridgeProjectAssetRestoreExecutionToTerminalHistory(await inputPair());
    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.asset.restore",
      commandKind: "project.asset.restore",
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
      assetBytesWrite: true,
      projectContentWrite: false,
      projectPersistenceWrite: false,
      createNewOnly: true,
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"],
    });
    expect(projectAssetRestoreTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for claimed project writes and an altered restored asset", async () => {
    const projectWrite = structuredClone(await inputPair()) as unknown as { receipt: { noProjectWrite: boolean } };
    projectWrite.receipt.noProjectWrite = false;
    expect(() => bridgeProjectAssetRestoreExecutionToTerminalHistory(projectWrite)).toThrow(/project|true/i);
    const altered = structuredClone(await inputPair()) as unknown as { inspection: ProjectRecoveryInspectionReceipt };
    altered.inspection = { ...altered.inspection, registeredAssets: [{ ...altered.inspection.registeredAssets[0]!, disposition: "MISSING", restoreEligible: true }] };
    expect(() => bridgeProjectAssetRestoreExecutionToTerminalHistory(altered)).toThrow(/PRESENT_VALID|restored|topology/i);
  });
});
