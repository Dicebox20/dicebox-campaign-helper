import { describe, expect, it } from "vitest";
import { approveProposalBatch, beginProposalApply, commitProposalAfterReread, previewProposalBatch } from "@dicebox/core";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter";
import type { BrokenReferenceDetachPreviewReceipt, BrokenReferenceDetachReceipt, ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";
import { bridgeProjectBrokenReferenceDetachExecutionToTerminalHistory, projectBrokenReferenceDetachTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-broken-reference-detach-terminal-history";

const projectId = "dbx:project:m741-broken-reference";
const batchId = "dbx:proposal:m741-broken-reference";
const sceneId = "dbx:scene:m741-main";
const assetSha256 = "a".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const primarySource = "projects/m741-broken-reference/project.json" as const;
const backupSource = "projects/m741-broken-reference/project.backup.json" as const;

const preview: BrokenReferenceDetachPreviewReceipt = {
  operation: "dicebox.project.broken-reference.detach.preview",
  status: "PREVIEW",
  projectId,
  generation: 4,
  contentSha256: "b".repeat(64),
  sceneId,
  assetId,
  blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
  assetDescriptorPreserved: true,
  assetSha256,
  affectedScene: { sceneId, sceneSha256: "c".repeat(64) },
  resultingScenes: [{ sceneId, sceneSha256: "d".repeat(64) }],
  resultingAssetCount: 1,
  resultingAssetCollectionSha256: "e".repeat(64),
  nextGeneration: 5,
  resultingContentSha256: "1".repeat(64),
  primaryByteSha256: "2".repeat(64),
  backupByteSha256: "3".repeat(64),
  protectedStateSha256: "4".repeat(64),
  assetTreeSha256: "5".repeat(64),
  previewSha256: "6".repeat(64),
  requiresApproval: true,
  noWrite: true,
  noFoundryWrite: true,
};

const sourceReceipt: BrokenReferenceDetachReceipt = {
  operation: "dicebox.project.broken-reference.detach",
  status: "PASS",
  projectId,
  previousGeneration: 4,
  generation: 5,
  previousContentSha256: preview.contentSha256,
  contentSha256: preview.resultingContentSha256,
  sceneId,
  assetId,
  blockerCode: preview.blockerCode,
  assetDescriptorPreserved: true,
  assetTreeUnchanged: true,
  workspaceUnchanged: true,
  foreignStateUnchanged: true,
  backupPreservesPriorEnvelope: true,
  targetBindingAbsent: true,
  unrelatedReferencesUnchanged: true,
  authoritativeInspection: true,
  residualBrokenReferenceCount: 0,
  previewSha256: preview.previewSha256,
  directoryEntrySync: true,
  noFoundryWrite: true,
};

const inspection: ProjectRecoveryInspectionReceipt = {
  operation: "dicebox.project.recovery.inspect",
  status: "BLOCKED",
  projectId,
  generation: 5,
  contentSha256: preview.resultingContentSha256,
  activeSceneId: sceneId,
  scenes: preview.resultingScenes,
  primary: { relativePath: primarySource, status: "VALID", sourceSchemaVersion: "0.3.0" },
  backup: { relativePath: backupSource, status: "VALID", sourceSchemaVersion: "0.3.0" },
  registeredAssets: [{
    assetId,
    role: "handout",
    sha256: assetSha256,
    mediaType: "image/webp",
    byteLength: 14,
    relativePath: `assets/sha256/${assetSha256}`,
    affectedSceneIds: [],
    disposition: "PRESENT_VALID",
    restoreEligible: false,
  }],
  pendingArtifacts: [],
  brokenSceneReferences: [{
    source: backupSource,
    sceneId,
    assetId,
    blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
    blockerMessage: "Preserved backup diagnostic",
    retry: "never",
  }],
  retry: "never",
  restoreEligible: false,
  noWrite: true,
  noFoundryWrite: true,
};

async function inputPair() {
  const batch = await createProjectRecoveryProposalBatch({ batchId, preview, createdAt: "2026-08-31T03:00:00.000Z" });
  let history = await previewProposalBatch(batch, { actorId: "human:requester", role: "requester" }, "2026-08-31T03:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T03:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T03:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "human:reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: preview.resultingContentSha256 }, "2026-08-31T03:00:04.000Z");
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return { inspection, preview, receipt: sourceReceipt, session };
}

describe("project.broken-reference.detach terminal-history bridge", () => {
  it("projects the exact committed selected-reference detach lifecycle", async () => {
    const result = bridgeProjectBrokenReferenceDetachExecutionToTerminalHistory(await inputPair());
    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.broken-reference.detach",
      commandKind: "project.broken-reference.detach",
      projectId,
      sceneId,
      assetId,
      blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
      assetDescriptorPreserved: true,
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
      targetBindingAbsent: true,
      unrelatedReferencesUnchanged: true,
      residualBrokenReferenceCount: 0,
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"],
    });
    expect(projectBrokenReferenceDetachTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for claimed binding retention and a primary broken-reference reread", async () => {
    const alteredReceipt = structuredClone(await inputPair()) as unknown as { receipt: { targetBindingAbsent: boolean } };
    alteredReceipt.receipt.targetBindingAbsent = false;
    expect(() => bridgeProjectBrokenReferenceDetachExecutionToTerminalHistory(alteredReceipt)).toThrow(/targetBindingAbsent|true|binding/i);
    const alteredInspection = structuredClone(await inputPair()) as unknown as { inspection: { brokenSceneReferences: Array<ProjectRecoveryInspectionReceipt["brokenSceneReferences"][number]> } };
    alteredInspection.inspection.brokenSceneReferences = [{
      ...alteredInspection.inspection.brokenSceneReferences[0]!,
      source: primarySource,
    }];
    expect(() => bridgeProjectBrokenReferenceDetachExecutionToTerminalHistory(alteredInspection)).toThrow(/primary|reference|terminal/i);
  });
});
