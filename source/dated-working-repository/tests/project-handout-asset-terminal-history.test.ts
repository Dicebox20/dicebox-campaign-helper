import { describe, expect, it } from "vitest";
import {
  bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory,
  bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory,
  projectHandoutAssetRedoTerminalHistoryReceiptSchema,
  projectHandoutAssetTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m725-handout";
const batchId = "dbx:proposal:m725-handout";
const commandId = "dbx:proposal-command:m725-handout";
const sceneId = "dbx:scene:m725-handout";
const assetSha256 = "c".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-08-30T23:00:${String(second).padStart(2, "0")}.000Z`;

function handoutAsset() {
  return {
    sha256: assetSha256,
    mediaType: "image/png",
    byteLength: 32,
    relativePath: "assets/handouts/m725-handout.png",
    registration: { assetId, role: "handout", label: "M725 handout", provenance: "user-import" },
  };
}

function registeredAsset() {
  return { assetId, sha256: assetSha256, mediaType: "image/png", byteLength: 32, relativePath: "assets/handouts/m725-handout.png", disposition: "PRESENT_VALID" };
}

function projectRead(generation: number, contentSha256: string, assetCollectionSha256: string, primaryByteSha256: string, backupByteSha256: string) {
  const assets = generation === 2 ? [] : [handoutAsset()];
  const registeredAssets = assets.length === 0 ? [] : [registeredAsset()];
  return {
    projectId,
    generation,
    contentSha256,
    sceneContentSha256: "a".repeat(64),
    assetCollectionSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assetCount: assets.length,
    assets,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M725" }],
      workspaceIndexGeneration: generation + 10,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M725" },
    project: {
      scenesJson: [JSON.stringify({ id: sceneId })],
      activeSceneId: sceneId,
      assets,
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
        generation,
        contentSha256,
        activeSceneId: sceneId,
        sceneCount: 1,
        assetCount: assets.length,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
      registeredAssets,
    },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-handout", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: projectId, revision: 2, sha256: "c".repeat(64) },
    commands: [{ commandId, kind: "project.asset.register-handout", dependsOn: [], payload: { operation: "project.asset.register-handout", projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "d".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "e".repeat(64) }, observed(5));

  const before = projectRead(2, "c".repeat(64), "1".repeat(64), "f".repeat(64), "1".repeat(64));
  const afterApply = projectRead(3, "d".repeat(64), "2".repeat(64), "0".repeat(64), "f".repeat(64));
  const afterUndo = projectRead(4, "e".repeat(64), "2".repeat(64), "2".repeat(64), "0".repeat(64));
  return {
    operation: "dicebox.project.asset.register-handout.execute",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/png", role: "handout", label: "M725 handout", provenance: "user-import" },
    before,
    afterApply,
    afterUndo,
    save: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: 3,
      contentSha256: "d".repeat(64),
      sceneSha256: "a".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "a".repeat(64) }],
      assetCount: 1,
      projectRelativePath: "projects/m725-handout/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    inverseRestore: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: 4,
      contentSha256: "e".repeat(64),
      sceneSha256: "a".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "a".repeat(64) }],
      assetCount: 1,
      projectRelativePath: "projects/m725-handout/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    history,
    batch,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const undone = await executionReceipt();
  const history = await redoProposalBatch(
    undone.history,
    undone.batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 5, sha256: "8".repeat(64) },
    observed(6),
  );
  const beforeRedo = undone.afterUndo;
  const afterRedo = projectRead(5, "8".repeat(64), "2".repeat(64), "3".repeat(64), "2".repeat(64));
  return {
    operation: "dicebox.project.asset.register-handout.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/png", role: "handout", label: "M725 handout", provenance: "user-import" },
    beforeRedo,
    afterRedo,
    redoReceipt: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: 5,
      contentSha256: "8".repeat(64),
      sceneSha256: "a".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "a".repeat(64) }],
      assetCount: 1,
      projectRelativePath: "projects/m725-handout/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "8".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("project.asset.register-handout terminal-history bridge", () => {
  it("projects the exact applied-and-undone local asset lifecycle without execution authority", async () => {
    const result = bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "undone",
      disposition: "terminal-undone",
      operation: "dicebox.project.asset.register-handout.execute",
      commandKind: "project.asset.register-handout",
      projectId,
      batchId,
      asset: { assetId, assetSha256, role: "handout", mediaType: "image/png" },
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "undone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo"],
      assetBytesPersisted: true,
      assetTreePreserved: true,
      sceneContentRestored: true,
    });
    expect(projectHandoutAssetTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for tampered persistence, Foundry-writing, and asset-tree evidence", async () => {
    const nonPersistent = await executionReceipt({ assetBytesPersisted: false });
    expect(() => bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory(nonPersistent)).toThrow(/assetBytesPersisted|true/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const mismatchedUndo = await executionReceipt();
    (mismatchedUndo.afterUndo as { assetCollectionSha256: string }).assetCollectionSha256 = "3".repeat(64);
    expect(() => bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory(mismatchedUndo)).toThrow(/asset tree|asset collection|preserv/i);
  });

  it("projects one exact handout-asset redo lifecycle with matched project reread", async () => {
    const result = bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory(await redoExecutionReceipt());

    expect(result).toMatchObject({
      status: "redone",
      disposition: "terminal-redone",
      operation: "dicebox.project.asset.register-handout.redo",
      commandKind: "project.asset.register-handout",
      projectId,
      batchId,
      asset: { assetId, assetSha256, role: "handout" },
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      noProjectMutation: true,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "redone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"],
      projectContentWrite: false,
      assetBytesPersisted: false,
      assetTreePreserved: true,
      sceneContentRestored: false,
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema",
      matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "8".repeat(64) },
    });
    expect(result.authoritativeRereads.beforeRedo.assets).toContainEqual(handoutAsset());
    expect(result.authoritativeRereads.afterRedo.assets).toContainEqual(handoutAsset());
    expect(projectHandoutAssetRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-terminal, and mismatched redo evidence", async () => {
    const foreign = await redoExecutionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory(foreign)).toThrow(/project|foreign/i);

    const nonTerminal = await redoExecutionReceipt();
    (nonTerminal.history as any) = { ...nonTerminal.history, status: "undone", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory(nonTerminal)).toThrow(/terminal|redone|history/i);

    const mismatched = await redoExecutionReceipt({ matchedReread: { status: "matched", targetId: projectId, revision: 99, sha256: "8".repeat(64) } });
    expect(() => bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory(mismatched)).toThrow(/revision|reread|afterRedo/i);
  });
});
