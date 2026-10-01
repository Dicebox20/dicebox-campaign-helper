import { describe, expect, it } from "vitest";
import {
  bridgeProjectPersistentAddSceneRedoToTerminalHistory,
  bridgeProjectPersistentAddSceneExecutionToTerminalHistory,
  projectPersistentAddSceneRedoTerminalHistoryReceiptSchema,
  projectPersistentAddSceneTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-add-scene-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m717-add-scene";
const batchId = "dbx:proposal:m717-add-scene";
const commandId = "dbx:proposal-command:m717-add-scene";
const originalSceneId = "dbx:scene:m717-original";
const addedSceneId = "dbx:scene:m717-added";
const contentSha256 = "d".repeat(64);
const observed = (second: number) => `2026-08-30T21:00:${String(second).padStart(2, "0")}.000Z`;

function scene(sceneId: string, name: string) {
  return { schemaVersion: "0.1.0", revision: 0, id: sceneId, name, width: 1, height: 1, background: { color: 0, gridSize: 1 }, entities: [] };
}

async function executionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.add-scene.persist", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: projectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.add-scene.persist",
      dependsOn: [],
      payload: {
        addedOrdinal: 2,
        addedSceneId,
        currentActiveSceneId: originalSceneId,
        currentContentSha256: contentSha256,
        currentSceneCount: 1,
        currentSceneIds: [originalSceneId],
        currentScenesSha256: "a".repeat(64),
        expectedGeneration: 2,
        operation: "project.add-scene.persist",
        previewSha256: "b".repeat(64),
        proposedActiveSceneId: addedSceneId,
        proposedSceneCount: 2,
        proposedSceneIds: [originalSceneId, addedSceneId],
        proposedScenesSha256: "e".repeat(64),
        projectId,
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "7".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) }, observed(5));

  const read = (
    generation: number,
    contentSha: string,
    sceneIds: readonly string[],
    scenesSha: string,
    activeSceneId: string,
    primaryByteSha256: string,
    backupByteSha256: string,
  ) => {
    const scenes = sceneIds.map((id) => scene(id, id === originalSceneId ? "Original" : "Added"));
    const scenesJson = scenes.map((value) => JSON.stringify(value));
    return {
      projectId,
      generation,
      contentSha256: contentSha,
      sceneIds,
      scenesSha256: scenesSha,
      activeSceneId,
      sceneCount: scenes.length,
      assets: [],
    assetCollectionSha256: "9".repeat(64),
      primaryByteSha256,
      backupByteSha256,
      catalog: {
        operation: "dicebox.project.catalog",
        status: "PASS",
        entries: [{
          projectId,
          status: "PASS",
          sceneId: originalSceneId,
          sceneName: "Original",
          sceneCount: scenes.length,
          activeSceneId,
          generation,
          contentSha256: contentSha,
          assetCount: 0,
          recoveredFrom: null,
          blockerCode: null,
          displayName: "M717",
          lastOpenedSequence: 1,
          workspaceMetadataWarning: null,
        }],
        workspaceIndexGeneration: 1,
        workspaceMetadataWarning: null,
        noWrite: true,
        noFoundryWrite: true,
      },
      catalogEntry: {
        projectId,
        status: "PASS",
        sceneId: originalSceneId,
        sceneName: "Original",
        sceneCount: scenes.length,
        activeSceneId,
        generation,
        contentSha256: contentSha,
        assetCount: 0,
        recoveredFrom: null,
        blockerCode: null,
        displayName: "M717",
        lastOpenedSequence: 1,
        workspaceMetadataWarning: null,
      },
      project: {
        scenesJson,
        activeSceneId,
        assets: [],
        receipt: {
          operation: "dicebox.project.load",
          status: "PASS",
          projectId,
          generation,
          contentSha256: contentSha,
          sceneSha256: "9".repeat(64),
          sceneCount: scenes.length,
          activeSceneId,
          scenes: scenes.map((value) => ({ sceneId: value.id, sceneSha256: "9".repeat(64) })),
          assetCount: 0,
          recoveredFrom: null,
          migrationStatus: "current",
          persistedContentSha256: contentSha,
          noFoundryWrite: true,
        },
      },
      recovery: {
        operation: "dicebox.project.recovery.inspect",
        status: "PASS",
        projectId,
        generation,
        contentSha256: contentSha,
        activeSceneId,
        scenes: scenes.map((value) => ({ sceneId: value.id, sceneSha256: "9".repeat(64) })),
        primary: { relativePath: "projects/m717/project.json", status: "VALID", byteSha256: primaryByteSha256 },
        backup: { relativePath: "projects/m717/project.backup.json", status: "VALID", byteSha256: backupByteSha256 },
        registeredAssets: [],
        pendingArtifacts: [],
        brokenSceneReferences: [],
        retry: "none",
        restoreEligible: false,
        noWrite: true,
        noFoundryWrite: true,
      },
      noWrite: true,
      noFoundryWrite: true,
    };
  };

  const save = (generation: number, contentSha: string, scenes: readonly string[], activeSceneId: string) => ({
    operation: "dicebox.project.save",
    status: "PASS",
    projectId,
    generation,
    contentSha256: contentSha,
    sceneSha256: "b".repeat(64),
    sceneCount: scenes.length,
    activeSceneId,
    scenes: scenes.map((sceneId) => ({ sceneId, sceneSha256: "b".repeat(64) })),
    assetCount: 0,
    projectRelativePath: "projects/m717/project.json",
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  });

  return {
    operation: "dicebox.project.add-scene.persist.execute",
    status: "PASS",
    projectId,
    batchId,
    addedSceneId,
    addedOrdinal: 2,
    before: read(2, contentSha256, [originalSceneId], "a".repeat(64), originalSceneId, "f".repeat(64), "1".repeat(64)),
    afterApply: read(3, "7".repeat(64), [originalSceneId, addedSceneId], "e".repeat(64), addedSceneId, "2".repeat(64), "f".repeat(64)),
    afterUndo: read(4, "8".repeat(64), [originalSceneId], "a".repeat(64), originalSceneId, "3".repeat(64), "2".repeat(64)),
    save: save(3, "7".repeat(64), [originalSceneId, addedSceneId], addedSceneId),
    inverseRestore: save(4, "8".repeat(64), [originalSceneId], originalSceneId),
    history,
    batch,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sceneContentRestored: true,
    assetsPreserved: true,
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
    { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    observed(6),
  );
  const beforeRedo = undone.afterUndo;
  const afterRedo = {
    ...undone.afterApply,
    generation: 5,
    primaryByteSha256: "9".repeat(64),
    backupByteSha256: undone.afterUndo.primaryByteSha256,
    catalog: {
      ...undone.afterApply.catalog,
      entries: undone.afterApply.catalog.entries.map((entry) => ({ ...entry, generation: 5 })),
    },
    catalogEntry: { ...undone.afterApply.catalogEntry, generation: 5 },
    project: {
      ...undone.afterApply.project,
      receipt: { ...undone.afterApply.project.receipt, generation: 5 },
    },
    recovery: {
      ...undone.afterApply.recovery,
      generation: 5,
      primary: { ...undone.afterApply.recovery.primary, byteSha256: "9".repeat(64) },
      backup: { ...undone.afterApply.recovery.backup, byteSha256: undone.afterUndo.primaryByteSha256 },
    },
  };
  const redoReceipt = {
    operation: "dicebox.project.save",
    status: "PASS",
    projectId,
    generation: 5,
    contentSha256: "7".repeat(64),
    sceneSha256: "b".repeat(64),
    sceneCount: 2,
    activeSceneId: addedSceneId,
    scenes: [
      { sceneId: originalSceneId, sceneSha256: "b".repeat(64) },
      { sceneId: addedSceneId, sceneSha256: "b".repeat(64) },
    ],
    assetCount: 0,
    projectRelativePath: "projects/m717/project.json",
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
  return {
    operation: "dicebox.project.add-scene.persist.redo",
    status: "PASS",
    projectId,
    batchId,
    addedSceneId,
    addedOrdinal: 2,
    beforeRedo,
    afterRedo,
    redoReceipt,
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    projectContentWrite: false,
    projectPersistenceWrite: false,
    sceneContentRestored: false,
    assetsPreserved: true,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("project.add-scene.persist terminal-history bridge", () => {
  it("projects one completed Scene persistence lifecycle without adding execution authority", async () => {
    const result = bridgeProjectPersistentAddSceneExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "undone",
      operation: "dicebox.project.add-scene.persist.execute",
      commandKind: "project.add-scene.persist",
      projectId,
      batchId,
      addedSceneId,
      addedOrdinal: 2,
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
    });
    expect(projectPersistentAddSceneTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-persistent, and non-terminal evidence", async () => {
    const foreign = await executionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectPersistentAddSceneExecutionToTerminalHistory(foreign)).toThrow(/project|foreign/i);
    const nonPersistent = await executionReceipt({ projectPersistenceWrite: false });
    expect(() => bridgeProjectPersistentAddSceneExecutionToTerminalHistory(nonPersistent)).toThrow(/persistence|write/i);
    const committed = await executionReceipt();
    committed.history = { ...committed.history, status: "committed", receipts: committed.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectPersistentAddSceneExecutionToTerminalHistory(committed)).toThrow(/terminal|undone|history/i);
  });

  it("projects one exact redo lifecycle with Scene-set reread and no execution authority", async () => {
    const result = bridgeProjectPersistentAddSceneRedoToTerminalHistory(await redoExecutionReceipt());

    expect(result).toMatchObject({
      status: "redone",
      operation: "dicebox.project.add-scene.persist.redo",
      commandKind: "project.add-scene.persist",
      projectId,
      batchId,
      addedSceneId,
      addedOrdinal: 2,
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
      rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
      matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) },
    });
    expect(result.authoritativeRereads.beforeRedo.sceneIds).toEqual([originalSceneId]);
    expect(result.authoritativeRereads.afterRedo.sceneIds).toEqual([originalSceneId, addedSceneId]);
    expect(projectPersistentAddSceneRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-terminal, and mismatched redo evidence", async () => {
    const foreign = await redoExecutionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectPersistentAddSceneRedoToTerminalHistory(foreign)).toThrow(/project|foreign/i);

    const nonTerminal = await redoExecutionReceipt();
    nonTerminal.history = { ...nonTerminal.history, status: "undone", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectPersistentAddSceneRedoToTerminalHistory(nonTerminal)).toThrow(/terminal|redone|history/i);

    const mismatched = await redoExecutionReceipt({
      matchedReread: { status: "matched", targetId: projectId, revision: 99, sha256: "9".repeat(64) },
    });
    expect(() => bridgeProjectPersistentAddSceneRedoToTerminalHistory(mismatched)).toThrow(/revision|reread|afterRedo/i);
  });
});
