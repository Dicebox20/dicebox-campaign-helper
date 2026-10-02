import { describe, expect, it } from "vitest";
import { approveProposalBatch, beginProposalApply, commitProposalAfterReread, previewProposalBatch } from "@dicebox/core";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter";
import type { BackupRecoveryPromotionPreviewReceipt, BackupRecoveryPromotionReceipt, ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";
import { bridgeProjectBackupPromotionExecutionToTerminalHistory, projectBackupPromotionTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-backup-promotion-terminal-history";

const projectId = "dbx:project:m733-backup-promotion";
const batchId = "dbx:proposal:m733-backup-promotion";
const sceneId = "dbx:scene:m733-backup-promotion-main";
const observedAt = (second: number) => `2026-08-31T01:00:${String(second).padStart(2, "0")}.000Z`;

const preview = {
  operation: "dicebox.project.recovery.backup-promotion.preview",
  status: "PREVIEW",
  projectId,
  primary: { relativePath: "projects/m733-backup-promotion/project.json", status: "MISSING" },
  backup: { relativePath: "projects/m733-backup-promotion/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "b".repeat(64) },
  generation: 1,
  contentSha256: "c".repeat(64),
  scenes: [{ sceneId, sceneSha256: "d".repeat(64) }],
  activeSceneId: sceneId,
  assetCount: 0,
  assetCollectionSha256: "e".repeat(64),
  semanticStateSha256: "f".repeat(64),
  backupByteSha256: "b".repeat(64),
  protectedStateSha256: "1".repeat(64),
  assetTreeSha256: "2".repeat(64),
  previewSha256: "3".repeat(64),
  requiresApproval: true,
  noWrite: true,
  noFoundryWrite: true,
} as const satisfies BackupRecoveryPromotionPreviewReceipt;

async function inputPair() {
  const batch = await createProjectRecoveryProposalBatch({ batchId, preview, createdAt: observedAt(0) });
  let history = await previewProposalBatch(batch, { actorId: "human:requester", role: "requester" }, observedAt(1));
  history = await approveProposalBatch(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, observedAt(2));
  history = await beginProposalApply(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, observedAt(3));
  const promotion: BackupRecoveryPromotionReceipt = {
    operation: "dicebox.project.recovery.backup-promotion",
    status: "PASS",
    projectId,
    generation: 1,
    contentSha256: preview.contentSha256,
    scenes: preview.scenes,
    activeSceneId: sceneId,
    assetCount: 0,
    primaryRestored: true,
    backupUnchanged: true,
    semanticStateUnchanged: true,
    assetTreeUnchanged: true,
    workspaceUnchanged: true,
    foreignStateUnchanged: true,
    authoritativeCurrentReread: true,
    backupByteSha256: preview.backupByteSha256,
    previewSha256: preview.previewSha256,
    directoryEntrySync: true,
    noFoundryWrite: true,
  };
  history = await commitProposalAfterReread(history, batch, { actorId: "human:reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 1, sha256: preview.contentSha256 }, observedAt(4));
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  const inspection: ProjectRecoveryInspectionReceipt = {
    operation: "dicebox.project.recovery.inspect",
    status: "PASS",
    projectId,
    generation: 1,
    contentSha256: preview.contentSha256,
    activeSceneId: sceneId,
    scenes: preview.scenes,
    primary: { relativePath: "projects/m733-backup-promotion/project.json", status: "VALID", byteSha256: "a".repeat(64) },
    backup: { relativePath: "projects/m733-backup-promotion/project.backup.json", status: "VALID", byteSha256: preview.backupByteSha256 },
    registeredAssets: [],
    pendingArtifacts: [],
    brokenSceneReferences: [],
    retry: "none",
    restoreEligible: false,
    noWrite: true,
    noFoundryWrite: true,
  };
  return { preview, receipt: promotion, inspection, session };
}

describe("project.recovery.backup-promote terminal-history bridge", () => {
  it("projects the exact approved committed recovery lifecycle", async () => {
    const result = bridgeProjectBackupPromotionExecutionToTerminalHistory(await inputPair());
    expect(result).toMatchObject({ status: "committed", disposition: "terminal-committed", operation: "dicebox.project.recovery.backup-promote", commandKind: "project.recovery.backup-promote", projectId, generation: 1, targetAuthority: "local-project", applyAuthority: "operation-specific", noGenericExecutor: true, bridgeOnly: true, noExecutionAuthority: true, execution: "not-implemented", readyClaim: false, primaryRestored: true, backupUnchanged: true, foreignStateUnchanged: true, historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"] });
    expect(projectBackupPromotionTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for claimed Foundry writes and altered recovery rereads", async () => {
    const foundryWrite = structuredClone(await inputPair()) as unknown as { receipt: { noFoundryWrite: boolean }; inspection: ProjectRecoveryInspectionReceipt };
    foundryWrite.receipt.noFoundryWrite = false;
    expect(() => bridgeProjectBackupPromotionExecutionToTerminalHistory(foundryWrite)).toThrow(/Foundry|true/i);
    const altered = structuredClone(await inputPair()) as unknown as { receipt: BackupRecoveryPromotionReceipt; inspection: ProjectRecoveryInspectionReceipt };
    altered.inspection = { ...altered.inspection, status: "BLOCKED" };
    expect(() => bridgeProjectBackupPromotionExecutionToTerminalHistory(altered)).toThrow(/status|PASS/i);
  });
});
