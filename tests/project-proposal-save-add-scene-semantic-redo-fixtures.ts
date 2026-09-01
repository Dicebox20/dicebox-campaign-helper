import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const saveProjectId = "dbx:project:m890-save";
const saveBatchId = "dbx:proposal:m890-save";
const saveCommandId = "dbx:proposal-command:m890-save";
const saveSceneId = "dbx:scene:m890-save";
const saveObserved = (second: number) => `2026-09-01T11:00:${String(second).padStart(2, "0")}.000Z`;

async function saveExecutionReceipt() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: saveBatchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.save", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: saveProjectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId: saveCommandId,
      kind: "project.save",
      dependsOn: [],
      payload: {
        contentDescriptorSha256: "b".repeat(64),
        currentContentSha256: "c".repeat(64),
        expectedGeneration: 2,
        operation: "project.save",
        projectId: saveProjectId,
        proposedActiveSceneId: saveSceneId,
        proposedAssetCount: 0,
        proposedSceneCount: 1,
      },
    }],
    createdAt: saveObserved(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, saveObserved(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, saveObserved(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, saveObserved(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: saveProjectId, revision: 3, sha256: "d".repeat(64) }, saveObserved(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: saveProjectId, revision: 4, sha256: "e".repeat(64) }, saveObserved(5));

  const read = (
    generation: number,
    contentSha256: string,
    semanticContentSha256: string,
    primaryByteSha256: string,
    backupByteSha256: string,
  ) => ({
    projectId: saveProjectId,
    generation,
    contentSha256,
    semanticContentSha256,
    activeSceneId: saveSceneId,
    sceneCount: 1,
    assetCount: 0,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId: saveProjectId, status: "PASS", generation, contentSha256 }],
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId: saveProjectId, status: "PASS", generation, contentSha256 },
    project: {
      activeSceneId: saveSceneId,
      scenesJson: [{}],
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId: saveProjectId,
        generation,
        contentSha256,
        activeSceneId: saveSceneId,
        sceneCount: 1,
        assetCount: 0,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId: saveProjectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
    },
    noWrite: true,
    noFoundryWrite: true,
  });

  return {
    operation: "dicebox.project.save.execute",
    status: "PASS",
    projectId: saveProjectId,
    batchId: saveBatchId,
    before: read(2, "c".repeat(64), "0".repeat(64), "f".repeat(64), "1".repeat(64)),
    afterApply: read(3, "d".repeat(64), "2".repeat(64), "2".repeat(64), "f".repeat(64)),
    afterUndo: read(4, "e".repeat(64), "0".repeat(64), "3".repeat(64), "2".repeat(64)),
    save: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId: saveProjectId,
      generation: 3,
      contentSha256: "d".repeat(64),
      sceneSha256: "4".repeat(64),
      sceneCount: 1,
      activeSceneId: saveSceneId,
      assetCount: 0,
      scenes: [{}],
      projectRelativePath: "projects/m890/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    inverseRestore: {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId: saveProjectId,
      generation: 4,
      contentSha256: "e".repeat(64),
      sceneSha256: "5".repeat(64),
      sceneCount: 1,
      activeSceneId: saveSceneId,
      assetCount: 0,
      scenes: [{}],
      projectRelativePath: "projects/m890/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    },
    history,
    projectContentWrite: true,
    noFoundryWrite: true,
  };
}

function advancedSaveRead(input: Awaited<ReturnType<typeof saveExecutionReceipt>>["afterUndo"], generation: number, contentSha256: string, semanticContentSha256: string, primaryByteSha256: string, backupByteSha256: string) {
  return {
    ...input,
    generation,
    contentSha256,
    semanticContentSha256,
    primaryByteSha256,
    backupByteSha256,
    catalog: { ...input.catalog, entries: input.catalog.entries.map((entry) => ({ ...entry, generation, contentSha256 })) },
    catalogEntry: { ...input.catalogEntry, generation, contentSha256 },
    project: { ...input.project, receipt: { ...input.project.receipt, generation, contentSha256 } },
    recovery: {
      ...input.recovery,
      generation,
      contentSha256,
      primary: { ...input.recovery.primary, byteSha256: primaryByteSha256 },
      backup: { ...input.recovery.backup, byteSha256: backupByteSha256 },
    },
  };
}

export async function createSaveRedoExecutionReceipt() {
  const source = await saveExecutionReceipt();
  const beforeRedo = source.afterUndo;
  const afterRedo = advancedSaveRead(beforeRedo, 5, "7".repeat(64), "2".repeat(64), "4".repeat(64), "3".repeat(64));
  const last = source.history.receipts.at(-1)!;
  const redoHistory = {
    ...source.history,
    status: "redone" as const,
    receipts: [...source.history.receipts, {
      ...last,
      sequence: 5,
      receiptId: "dbx:proposal-receipt:m890-save-5",
      transition: "redo" as const,
      fromStatus: "undone" as const,
      toStatus: "redone" as const,
      observedAt: saveObserved(6),
      reread: { status: "matched" as const, targetId: saveProjectId, revision: 5, sha256: "7".repeat(64) },
    }],
  };
  return {
    operation: "dicebox.project.save.redo",
    status: "PASS",
    projectId: saveProjectId,
    batchId: saveBatchId,
    beforeRedo,
    afterRedo,
    redoReceipt: { ...source.save, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "6".repeat(64) },
    history: redoHistory,
    matchedReread: { status: "matched" as const, targetId: saveProjectId, revision: 5, sha256: "7".repeat(64) },
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

const addSceneProjectId = "dbx:project:m890-add-scene";
const addSceneBatchId = "dbx:proposal:m890-add-scene";
const addSceneCommandId = "dbx:proposal-command:m890-add-scene";
const originalSceneId = "dbx:scene:m890-original";
const addedSceneId = "dbx:scene:m890-added";
const addSceneContentSha256 = "d".repeat(64);
const addSceneObserved = (second: number) => `2026-09-01T11:30:${String(second).padStart(2, "0")}.000Z`;

function addScene(sceneId: string, name: string) {
  return { schemaVersion: "0.1.0", revision: 0, id: sceneId, name, width: 1, height: 1, background: { color: 0, gridSize: 1 }, entities: [] };
}

const addSceneSave = (generation: number, contentSha: string, scenes: readonly string[], activeSceneId: string) => ({
  operation: "dicebox.project.save",
  status: "PASS",
  projectId: addSceneProjectId,
  generation,
  contentSha256: contentSha,
  sceneSha256: "b".repeat(64),
  sceneCount: scenes.length,
  activeSceneId,
  scenes: scenes.map((sceneId) => ({ sceneId, sceneSha256: "b".repeat(64) })),
  assetCount: 0,
  projectRelativePath: "projects/m890/project.json",
  atomicReplace: true,
  directoryEntrySync: true,
  backupPreserved: true,
  noFoundryWrite: true,
});

async function addSceneExecutionReceipt() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: addSceneBatchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.add-scene.persist", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: addSceneProjectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId: addSceneCommandId,
      kind: "project.add-scene.persist",
      dependsOn: [],
      payload: {
        addedOrdinal: 2,
        addedSceneId,
        currentActiveSceneId: originalSceneId,
        currentContentSha256: addSceneContentSha256,
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
        projectId: addSceneProjectId,
      },
    }],
    createdAt: addSceneObserved(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, addSceneObserved(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, addSceneObserved(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, addSceneObserved(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: addSceneProjectId, revision: 3, sha256: "7".repeat(64) }, addSceneObserved(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: addSceneProjectId, revision: 4, sha256: "8".repeat(64) }, addSceneObserved(5));

  const read = (generation: number, contentSha: string, sceneIds: readonly string[], scenesSha: string, activeSceneId: string, primaryByteSha256: string, backupByteSha256: string) => {
    const scenes = sceneIds.map((id) => addScene(id, id === originalSceneId ? "Original" : "Added"));
    return {
      projectId: addSceneProjectId,
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
        entries: [{ projectId: addSceneProjectId, status: "PASS", sceneId: originalSceneId, sceneName: "Original", sceneCount: scenes.length, activeSceneId, generation, contentSha256: contentSha, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: "M890", lastOpenedSequence: 1, workspaceMetadataWarning: null }],
        workspaceIndexGeneration: 1,
        workspaceMetadataWarning: null,
        noWrite: true,
        noFoundryWrite: true,
      },
      catalogEntry: { projectId: addSceneProjectId, status: "PASS", sceneId: originalSceneId, sceneName: "Original", sceneCount: scenes.length, activeSceneId, generation, contentSha256: contentSha, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: "M890", lastOpenedSequence: 1, workspaceMetadataWarning: null },
      project: {
        scenesJson: scenes.map((value) => JSON.stringify(value)),
        activeSceneId,
        assets: [],
        receipt: { operation: "dicebox.project.load", status: "PASS", projectId: addSceneProjectId, generation, contentSha256: contentSha, sceneSha256: "9".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((value) => ({ sceneId: value.id, sceneSha256: "9".repeat(64) })), assetCount: 0, recoveredFrom: null, migrationStatus: "current", persistedContentSha256: contentSha, noFoundryWrite: true },
      },
      recovery: {
        operation: "dicebox.project.recovery.inspect",
        status: "PASS",
        projectId: addSceneProjectId,
        generation,
        contentSha256: contentSha,
        activeSceneId,
        scenes: scenes.map((value) => ({ sceneId: value.id, sceneSha256: "9".repeat(64) })),
        primary: { relativePath: "projects/m890/project.json", status: "VALID", byteSha256: primaryByteSha256 },
        backup: { relativePath: "projects/m890/project.backup.json", status: "VALID", byteSha256: backupByteSha256 },
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

  return {
    operation: "dicebox.project.add-scene.persist.execute",
    status: "PASS",
    projectId: addSceneProjectId,
    batchId: addSceneBatchId,
    addedSceneId,
    addedOrdinal: 2,
    before: read(2, addSceneContentSha256, [originalSceneId], "a".repeat(64), originalSceneId, "f".repeat(64), "1".repeat(64)),
    afterApply: read(3, "7".repeat(64), [originalSceneId, addedSceneId], "e".repeat(64), addedSceneId, "2".repeat(64), "f".repeat(64)),
    afterUndo: read(4, "8".repeat(64), [originalSceneId], "a".repeat(64), originalSceneId, "3".repeat(64), "2".repeat(64)),
    save: addSceneSave(3, "7".repeat(64), [originalSceneId, addedSceneId], addedSceneId),
    inverseRestore: addSceneSave(4, "8".repeat(64), [originalSceneId], originalSceneId),
    history,
    batch,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sceneContentRestored: true,
    assetsPreserved: true,
    noFoundryWrite: true,
  };
}

export async function createPersistentAddSceneRedoExecutionReceipt() {
  const undone = await addSceneExecutionReceipt();
  const history = await redoProposalBatch(undone.history, undone.batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: addSceneProjectId, revision: 5, sha256: "7".repeat(64) }, addSceneObserved(6));
  const beforeRedo = undone.afterUndo;
  const afterRedo = {
    ...undone.afterApply,
    generation: 5,
    primaryByteSha256: "9".repeat(64),
    backupByteSha256: undone.afterUndo.primaryByteSha256,
    catalog: { ...undone.afterApply.catalog, entries: undone.afterApply.catalog.entries.map((entry) => ({ ...entry, generation: 5 })) },
    catalogEntry: { ...undone.afterApply.catalogEntry, generation: 5 },
    project: { ...undone.afterApply.project, receipt: { ...undone.afterApply.project.receipt, generation: 5 } },
    recovery: { ...undone.afterApply.recovery, generation: 5, primary: { ...undone.afterApply.recovery.primary, byteSha256: "9".repeat(64) }, backup: { ...undone.afterApply.recovery.backup, byteSha256: undone.afterUndo.primaryByteSha256 } },
  };
  return {
    operation: "dicebox.project.add-scene.persist.redo",
    status: "PASS",
    projectId: addSceneProjectId,
    batchId: addSceneBatchId,
    addedSceneId,
    addedOrdinal: 2,
    beforeRedo,
    afterRedo,
    redoReceipt: addSceneSave(5, "7".repeat(64), [originalSceneId, addedSceneId], addedSceneId),
    history,
    matchedReread: { status: "matched" as const, targetId: addSceneProjectId, revision: 5, sha256: "7".repeat(64) },
    projectContentWrite: false,
    projectPersistenceWrite: false,
    sceneContentRestored: false,
    assetsPreserved: true,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}
