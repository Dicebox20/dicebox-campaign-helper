import { describe, expect, it } from "vitest";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  bridgeProjectAssetBindingRedoToTerminalHistory,
  projectAssetBindingRedoTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-terminal-history.js";
import {
  bridgeProjectBackupPromotionExecutionToTerminalHistory,
  projectBackupPromotionTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-backup-promotion-terminal-history.js";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter.js";
import type { BackupRecoveryPromotionReceipt, ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store.js";

const assetProjectId = "dbx:project:m886-asset-bind";
const assetBatchId = "dbx:proposal:m886-asset-bind";
const assetCommandId = "dbx:proposal-command:m886-asset-bind";
const backupProjectId = "dbx:project:m886-backup-promote";
const backupBatchId = "dbx:proposal:m886-backup-promote";
const sceneId = "dbx:scene:m886-main";
const previousAssetId = "dbx:asset:sha256-" + "a".repeat(64);
const assetSha256 = "d".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-09-01T09:00:${String(second).padStart(2, "0")}.000Z`;

function storedAsset() {
  return {
    sha256: assetSha256,
    mediaType: "image/png",
    byteLength: 12,
    relativePath: `assets/sha256/${assetSha256}`,
    registration: { assetId, role: "background", label: "M886 background.png", provenance: "user-import", approval: "approved" },
  };
}

function assetRead(generation: number, contentSha256: string, primaryByteSha256: string, backupByteSha256: string, binding: string) {
  const assets = [storedAsset()];
  return {
    projectId: assetProjectId,
    generation,
    contentSha256,
    semanticContentSha256: "b".repeat(64),
    sceneContentSha256: "a".repeat(64),
    assetCollectionSha256: "1".repeat(64),
    activeSceneId: sceneId,
    sceneCount: 1,
    assetCount: 1,
    backgroundBindings: [{ sceneId, assetId: binding }],
    assets,
    primaryByteSha256,
    backupByteSha256,
    catalog: { operation: "dicebox.project.catalog", status: "PASS", entries: [{ projectId: assetProjectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: 1 }], noWrite: true, noFoundryWrite: true },
    catalogEntry: { projectId: assetProjectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: 1 },
    project: { scenesJson: [JSON.stringify({ id: sceneId, background: { assetId: binding } })], activeSceneId: sceneId, assets, receipt: { operation: "dicebox.project.load", status: "PASS", projectId: assetProjectId, generation, contentSha256, activeSceneId: sceneId, sceneCount: 1, assetCount: 1, noFoundryWrite: true } },
    recovery: { operation: "dicebox.project.recovery.inspect", status: "PASS", projectId: assetProjectId, generation, contentSha256, noWrite: true, noFoundryWrite: true, primary: { status: "VALID", byteSha256: primaryByteSha256 }, backup: { status: "VALID", byteSha256: backupByteSha256 }, registeredAssets: [] },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function assetRedoEvidence() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: assetBatchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.bind", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: assetProjectId, revision: 2, sha256: "c".repeat(64) },
    commands: [{ commandId: assetCommandId, kind: "project.asset.bind", dependsOn: [], payload: { operation: "project.asset.bind", projectId: assetProjectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "human:m886-requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, { status: "matched", targetId: assetProjectId, revision: 3, sha256: "e".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, { status: "matched", targetId: assetProjectId, revision: 4, sha256: "f".repeat(64) }, observed(5));
  history = await redoProposalBatch(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, { status: "matched", targetId: assetProjectId, revision: 5, sha256: "7".repeat(64) }, observed(6));
  const session = await createDesktopProjectProposalSession({ projectId: assetProjectId, batch, history });
  const beforeRedo = assetRead(4, "f".repeat(64), "c".repeat(64), "b".repeat(64), previousAssetId);
  const afterRedo = assetRead(5, "7".repeat(64), "f".repeat(64), "c".repeat(64), assetId);
  return {
    session,
    receipt: {
      operation: "dicebox.project.asset.bind.redo",
      status: "PASS",
      projectId: assetProjectId,
      batchId: assetBatchId,
      asset: { assetId, assetSha256, mediaType: "image/png", role: "background", sceneId, label: "M886 background.png", provenance: "user-import" },
      beforeRedo,
      afterRedo,
      redoReceipt: { operation: "dicebox.project.save", status: "PASS", projectId: assetProjectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m886-asset-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
      history,
      matchedReread: { status: "matched", targetId: assetProjectId, revision: 5, sha256: "7".repeat(64) },
      projectContentWrite: false,
      assetBytesPersisted: false,
      assetTreePreserved: true,
      sceneContentRestored: false,
      noProjectMutation: true,
      noFoundryWrite: true,
    },
  };
}

async function backupPromotionEvidence() {
  const preview = {
    operation: "dicebox.project.recovery.backup-promotion.preview",
    status: "PREVIEW",
    projectId: backupProjectId,
    primary: { relativePath: "projects/m886-backup-promote/project.json", status: "MISSING" },
    backup: { relativePath: "projects/m886-backup-promote/project.backup.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "b".repeat(64) },
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
  } as const;
  const batch = await createProjectRecoveryProposalBatch({ batchId: backupBatchId, preview, createdAt: observed(10) });
  let history = await previewProposalBatch(batch, { actorId: "human:m886-requester", role: "requester" }, observed(11));
  history = await approveProposalBatch(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, batch.base, observed(12));
  history = await beginProposalApply(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, batch.base, observed(13));
  history = await commitProposalAfterReread(history, batch, { actorId: "human:m886-reviewer", role: "reviewer" }, { status: "matched", targetId: backupProjectId, revision: 1, sha256: preview.contentSha256 }, observed(14));
  const promotion: BackupRecoveryPromotionReceipt = {
    operation: "dicebox.project.recovery.backup-promotion",
    status: "PASS",
    projectId: backupProjectId,
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
  const inspection: ProjectRecoveryInspectionReceipt = {
    operation: "dicebox.project.recovery.inspect",
    status: "PASS",
    projectId: backupProjectId,
    generation: 1,
    contentSha256: preview.contentSha256,
    activeSceneId: sceneId,
    scenes: preview.scenes,
    primary: { relativePath: "projects/m886-backup-promote/project.json", status: "VALID", byteSha256: "a".repeat(64) },
    backup: { relativePath: "projects/m886-backup-promote/project.backup.json", status: "VALID", byteSha256: preview.backupByteSha256 },
    registeredAssets: [],
    pendingArtifacts: [],
    brokenSceneReferences: [],
    retry: "none",
    restoreEligible: false,
    noWrite: true,
    noFoundryWrite: true,
  };
  return { preview, receipt: promotion, inspection, session: await createDesktopProjectProposalSession({ projectId: backupProjectId, batch, history }) };
}

describe("M886 operation-specific proposal semantic composition", () => {
  it("binds generic undo/redo history to strict asset-bind redo semantics", async () => {
    const evidence = await assetRedoEvidence();
    const result = bridgeProjectAssetBindingRedoToTerminalHistory(evidence.receipt);
    expect(result.history).toEqual(evidence.session.history);
    expect(result).toMatchObject({ status: "redone", projectId: assetProjectId, batchId: assetBatchId, historyStatus: "redone", matchedReread: { revision: 5, sha256: "7".repeat(64) }, noProjectMutation: true, noFoundryWrite: true });
    expect(result.authoritativeRereads.beforeRedo.backgroundBindings).toEqual([{ sceneId, assetId: previousAssetId }]);
    expect(result.authoritativeRereads.afterRedo.backgroundBindings).toEqual([{ sceneId, assetId }]);
    expect(projectAssetBindingRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);

    const drifted = structuredClone(evidence.receipt) as typeof evidence.receipt;
    (drifted.afterRedo as { generation: number }).generation = 6;
    expect(() => bridgeProjectAssetBindingRedoToTerminalHistory(drifted)).toThrow(/generation|revision|history/i);
  });

  it("retains backup promotion as committed one-way semantics", async () => {
    const evidence = await backupPromotionEvidence();
    const result = bridgeProjectBackupPromotionExecutionToTerminalHistory(evidence);
    expect(result.history).toEqual(evidence.session.history);
    expect(result).toMatchObject({ status: "committed", projectId: backupProjectId, batchId: backupBatchId, historyStatus: "committed", primaryRestored: true, backupUnchanged: true, semanticStateUnchanged: true, assetTreeUnchanged: true, foreignStateUnchanged: true, noProjectMutation: true, noFoundryWrite: true });
    expect(result.historyTransitions).not.toContain("undo");
    expect(result.historyTransitions).not.toContain("redo");
    expect(projectBackupPromotionTerminalHistoryReceiptSchema.parse(result)).toEqual(result);

    const drifted = structuredClone(evidence) as typeof evidence;
    (drifted.receipt as { foreignStateUnchanged: boolean }).foreignStateUnchanged = false;
    expect(() => bridgeProjectBackupPromotionExecutionToTerminalHistory(drifted)).toThrow(/foreign|true|preserv/i);
  });
});
