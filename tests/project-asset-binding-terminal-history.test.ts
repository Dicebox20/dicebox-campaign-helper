import { describe, expect, it } from "vitest";
import {
  bridgeProjectAssetBindingRedoToTerminalHistory,
  bridgeProjectAssetBindingExecutionToTerminalHistory,
  projectAssetBindingRedoTerminalHistoryReceiptSchema,
  projectAssetBindingTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-terminal-history.js";
import {
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  approveProposalBatch,
  beginProposalApply,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m729-bind";
const batchId = "dbx:proposal:m729-bind";
const commandId = "dbx:proposal-command:m729-bind";
const sceneId = "dbx:scene:m729-bind";
const previousAssetId = "dbx:asset:sha256-" + "a".repeat(64);
const assetSha256 = "d".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-08-31T00:00:${String(second).padStart(2, "0")}.000Z`;

function storedAsset() {
  return { sha256: assetSha256, mediaType: "image/png", byteLength: 12, relativePath: `assets/sha256/${assetSha256}`, registration: { assetId, role: "background", label: "M729 background.png", provenance: "user-import", approval: "approved" } };
}

function projectRead(generation: number, contentSha256: string, assetCollectionSha256: string, primaryByteSha256: string, backupByteSha256: string, binding: string | null) {
  const assets = [storedAsset()];
  const registeredAssets = [{ assetId, sha256: assetSha256, mediaType: "image/png", byteLength: 12, relativePath: `assets/sha256/${assetSha256}`, disposition: "PRESENT_VALID" }];
  return {
    projectId,
    generation,
    contentSha256,
    semanticContentSha256: "b".repeat(64),
    sceneContentSha256: "a".repeat(64),
    assetCollectionSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assetCount: assets.length,
    backgroundBindings: [{ sceneId, assetId: binding }],
    assets,
    primaryByteSha256,
    backupByteSha256,
    catalog: { operation: "dicebox.project.catalog", status: "PASS", entries: [{ projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: 1 }], noWrite: true, noFoundryWrite: true },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: 1 },
    project: { scenesJson: [JSON.stringify({ id: sceneId, background: binding ? { assetId: binding } : {} })], activeSceneId: sceneId, assets, receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation, contentSha256, activeSceneId: sceneId, sceneCount: 1, assetCount: 1, noFoundryWrite: true } },
    recovery: { operation: "dicebox.project.recovery.inspect", status: "PASS", projectId, generation, contentSha256, noWrite: true, noFoundryWrite: true, primary: { status: "VALID", byteSha256: primaryByteSha256 }, backup: { status: "VALID", byteSha256: backupByteSha256 }, registeredAssets },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0", batchId, revision: 0, previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.bind", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false }, risk: "high",
    base: { targetId: projectId, revision: 2, sha256: "c".repeat(64) },
    commands: [{ commandId, kind: "project.asset.bind", dependsOn: [], payload: { operation: "project.asset.bind", projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "e".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "f".repeat(64) }, observed(5));
  const before = projectRead(2, "c".repeat(64), "1".repeat(64), "a".repeat(64), "b".repeat(64), previousAssetId);
  const afterApply = projectRead(3, "e".repeat(64), "1".repeat(64), "b".repeat(64), "a".repeat(64), assetId);
  const afterUndo = projectRead(4, "f".repeat(64), "1".repeat(64), "c".repeat(64), "b".repeat(64), previousAssetId);
  return {
    operation: "dicebox.project.asset.bind.execute", status: "PASS", projectId, batchId,
    asset: { assetId, assetSha256, mediaType: "image/png", role: "background", sceneId, label: "M729 background.png", provenance: "user-import" },
    before, afterApply, afterUndo,
    save: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 3, contentSha256: "e".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m729-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    inverseRestore: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 4, contentSha256: "f".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m729-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history, batch, projectContentWrite: true, assetBytesPersisted: true, assetAdded: false, assetTreePreserved: true, sceneContentRestored: true, noFoundryWrite: true, ...overrides,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const undone = await executionReceipt();
  const history = await redoProposalBatch(
    undone.history,
    undone.batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    observed(6),
  );
  const beforeRedo = undone.afterUndo;
  const afterRedo = projectRead(5, "7".repeat(64), "1".repeat(64), "f".repeat(64), "c".repeat(64), assetId);
  return {
    operation: "dicebox.project.asset.bind.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: { assetId, assetSha256, mediaType: "image/png", role: "background", sceneId, label: "M729 background.png", provenance: "user-import" },
    beforeRedo,
    afterRedo,
    redoReceipt: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m729-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
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

describe("project.asset.bind terminal-history bridge", () => {
  it("projects the exact applied-and-undone local background-binding lifecycle", async () => {
    const result = bridgeProjectAssetBindingExecutionToTerminalHistory(await executionReceipt());
    expect(result).toMatchObject({ status: "undone", disposition: "terminal-undone", operation: "dicebox.project.asset.bind.execute", commandKind: "project.asset.bind", projectId, batchId, asset: { assetId, assetSha256, role: "background", sceneId }, targetAuthority: "local-project", applyAuthority: "operation-specific", noGenericExecutor: true, bridgeOnly: true, noExecutionAuthority: true, authoritativeReread: true, foreignStatePreserved: true, execution: "not-implemented", readyClaim: false, historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo"], assetTreePreserved: true, sceneContentRestored: true });
    expect(projectAssetBindingTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for tampered Scene restoration, Foundry-writing, and persistence evidence", async () => {
    const tampered = await executionReceipt();
    (tampered.afterUndo as { backgroundBindings: Array<{ sceneId: string; assetId: string | null }> }).backgroundBindings = [{ sceneId, assetId }];
    expect(() => bridgeProjectAssetBindingExecutionToTerminalHistory(tampered)).toThrow(/binding|restor|Scene/i);
    const foundryWriting = await executionReceipt({ noFoundryWrite: false });
    expect(() => bridgeProjectAssetBindingExecutionToTerminalHistory(foundryWriting)).toThrow(/Foundry|write/i);
    const nonPersistent = await executionReceipt({ assetBytesPersisted: false });
    expect(() => bridgeProjectAssetBindingExecutionToTerminalHistory(nonPersistent)).toThrow(/assetBytesPersisted|true/i);
  });

  it("projects one exact redo lifecycle with matched asset and Scene reread", async () => {
    const result = bridgeProjectAssetBindingRedoToTerminalHistory(await redoExecutionReceipt());
    expect(result).toMatchObject({
      status: "redone",
      operation: "dicebox.project.asset.bind.redo",
      commandKind: "project.asset.bind",
      projectId,
      batchId,
      asset: { assetId, assetSha256, role: "background", sceneId },
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
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
      matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    });
    expect(result.authoritativeRereads.beforeRedo.backgroundBindings).toEqual([{ sceneId, assetId: previousAssetId }]);
    expect(result.authoritativeRereads.afterRedo.backgroundBindings).toEqual([{ sceneId, assetId }]);
    expect(projectAssetBindingRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-terminal, and mismatched redo evidence", async () => {
    const foreign = await redoExecutionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectAssetBindingRedoToTerminalHistory(foreign)).toThrow(/project|foreign/i);

    const nonTerminal = await redoExecutionReceipt();
    nonTerminal.history = { ...nonTerminal.history, status: "undone", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectAssetBindingRedoToTerminalHistory(nonTerminal)).toThrow(/terminal|redone|history/i);

    const mismatched = await redoExecutionReceipt({ matchedReread: { status: "matched", targetId: projectId, revision: 99, sha256: "7".repeat(64) } });
    expect(() => bridgeProjectAssetBindingRedoToTerminalHistory(mismatched)).toThrow(/revision|reread|afterRedo/i);
  });
});
