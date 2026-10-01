import { describe, expect, it } from "vitest";
import {
  bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory,
  bridgeProjectTokenAssetRegistrationRedoToTerminalHistory,
  projectTokenAssetRedoTerminalHistoryReceiptSchema,
  projectTokenAssetTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-token-asset-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m727-token";
const batchId = "dbx:proposal:m727-token";
const commandId = "dbx:proposal-command:m727-token";
const sceneId = "dbx:scene:m727-token";
const assetSha256 = "d".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-08-31T00:00:${String(second).padStart(2, "0")}.000Z`;

function tokenAsset() {
  return {
    sha256: assetSha256,
    mediaType: "image/webp",
    byteLength: 32,
    relativePath: "assets/tokens/m727-token.webp",
    registration: { assetId, role: "token", label: "M727 token", provenance: "user-import" },
  };
}

function registeredAsset() {
  return { assetId, sha256: assetSha256, mediaType: "image/webp", byteLength: 32, relativePath: "assets/tokens/m727-token.webp", disposition: "PRESENT_VALID" };
}

function projectRead(generation: number, contentSha256: string, assetCollectionSha256: string, primaryByteSha256: string, backupByteSha256: string) {
  const assets = generation === 2 ? [] : [tokenAsset()];
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
      entries: [{ projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M727" }],
      workspaceIndexGeneration: generation + 10,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length, displayName: "M727" },
    project: {
      scenesJson: [JSON.stringify({ id: sceneId })],
      activeSceneId: sceneId,
      assets,
      receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation, contentSha256, activeSceneId: sceneId, sceneCount: 1, assetCount: assets.length, noFoundryWrite: true },
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
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-token", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: projectId, revision: 2, sha256: "c".repeat(64) },
    commands: [{ commandId, kind: "project.asset.register-token", dependsOn: [], payload: { operation: "project.asset.register-token", projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "e".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "f".repeat(64) }, observed(5));
  const before = projectRead(2, "c".repeat(64), "1".repeat(64), "a".repeat(64), "b".repeat(64));
  const afterApply = projectRead(3, "e".repeat(64), "2".repeat(64), "3".repeat(64), "a".repeat(64));
  const afterUndo = projectRead(4, "f".repeat(64), "2".repeat(64), "4".repeat(64), "3".repeat(64));
  return {
    batch,
    operation: "dicebox.project.asset.register-token.execute",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/webp", role: "token", label: "M727 token", provenance: "user-import" },
    before,
    afterApply,
    afterUndo,
    save: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 3, contentSha256: "e".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m727-token/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    inverseRestore: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 4, contentSha256: "f".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m727-token/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

async function redoReceipt(overrides: Record<string, unknown> = {}) {
  const source = await executionReceipt();
  const afterRedo = projectRead(5, "7".repeat(64), "2".repeat(64), "5".repeat(64), "4".repeat(64));
  const history = await redoProposalBatch(source.history, source.batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) }, observed(6));
  return {
    operation: "dicebox.project.asset.register-token.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/webp", role: "token", label: "M727 token", provenance: "user-import" },
    beforeRedo: source.afterUndo,
    afterRedo,
    redoReceipt: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m727-token/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("project.asset.register-token terminal-history bridge", () => {
  it("projects the exact applied-and-undone local asset lifecycle without execution authority", async () => {
    const result = bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory(await executionReceipt());
    expect(result).toMatchObject({
      status: "undone",
      disposition: "terminal-undone",
      operation: "dicebox.project.asset.register-token.execute",
      commandKind: "project.asset.register-token",
      projectId,
      batchId,
      asset: { assetId, assetSha256, role: "token", mediaType: "image/webp" },
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
    expect(projectTokenAssetTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for tampered persistence, Foundry-writing, and asset-tree evidence", async () => {
    const nonPersistent = await executionReceipt({ assetBytesPersisted: false });
    expect(() => bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory(nonPersistent)).toThrow(/assetBytesPersisted|true/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const mismatchedUndo = await executionReceipt();
    (mismatchedUndo.afterUndo as { assetCollectionSha256: string }).assetCollectionSha256 = "5".repeat(64);
    expect(() => bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory(mismatchedUndo)).toThrow(/asset tree|asset collection|preserv/i);
  });

  it("projects the exact terminal-redone token lifecycle without execution authority", async () => {
    const result = bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(await redoReceipt());
    expect(result).toMatchObject({
      status: "redone",
      disposition: "terminal-redone",
      operation: "dicebox.project.asset.register-token.redo",
      commandKind: "project.asset.register-token",
      projectId,
      batchId,
      asset: { assetId, assetSha256, role: "token", mediaType: "image/webp" },
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      authoritativeReread: true,
      noProjectMutation: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
      historyStatus: "redone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"],
      assetTreePreserved: true,
      sceneContentRestored: false,
    });
    expect(projectTokenAssetRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for token redo authority, reread, and persistence tampering", async () => {
    const executionAuthority = await redoReceipt({ noProjectMutation: false });
    expect(() => bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(executionAuthority)).toThrow(/projectMutation|true/i);
    const mismatchedReread = await redoReceipt({ matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "8".repeat(64) } });
    expect(() => bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(mismatchedReread)).toThrow(/reread|hash/i);
    const changedTree = await redoReceipt();
    (changedTree.afterRedo as { assetCollectionSha256: string }).assetCollectionSha256 = "8".repeat(64);
    expect(() => bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(changedTree)).toThrow(/asset tree|asset collection|preserv/i);
  });
});
