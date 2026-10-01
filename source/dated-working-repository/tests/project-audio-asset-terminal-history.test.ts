import { describe, expect, it } from "vitest";
import {
  bridgeProjectAudioAssetRegistrationRedoToTerminalHistory,
  bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory,
  projectAudioAssetRedoTerminalHistoryReceiptSchema,
  projectAudioAssetTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";
import { serializeSceneDocument, type SceneDocument } from "../packages/dicebox-scene/src/index.js";

const projectId = "dbx:project:m723-audio";
const batchId = "dbx:proposal:m723-audio";
const sceneId = "dbx:scene:m723-main";
const assetSha256 = "a".repeat(64);
const descriptor = {
  assetId: `dbx:asset:sha256-${assetSha256}`,
  assetSha256,
  mediaType: "audio/wav",
  role: "audio",
  label: "M723 audio.wav",
  provenance: "user-import",
} as const;

const scene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 0,
  id: sceneId,
  name: "M723 Main",
  width: 10,
  height: 10,
  background: { color: 0, gridSize: 1 },
  entities: [],
};

const sceneJson = serializeSceneDocument(scene);
const asset = {
  sha256: assetSha256,
  mediaType: "audio/wav",
  byteLength: 16,
  relativePath: `assets/sha256/${assetSha256}`,
  registration: { assetId: descriptor.assetId, role: "audio", label: descriptor.label, provenance: descriptor.provenance, approval: "approved" },
} as const;

function sceneReceipts() {
  return [{ sceneId, sceneSha256: "c".repeat(64) }];
}

function read(generation: number, contentSha256: string, primaryByteSha256: string, backupByteSha256: string | null, assets: readonly (typeof asset)[]) {
  const projectAssets = [...assets];
  const catalogEntry = {
    projectId,
    status: "PASS",
    sceneId,
    sceneName: "M723 Main",
    sceneCount: 1,
    activeSceneId: sceneId,
    generation,
    contentSha256,
    assetCount: projectAssets.length,
    recoveredFrom: null,
    blockerCode: null,
    displayName: "M723 Audio",
    lastOpenedSequence: 1,
    workspaceMetadataWarning: null,
  };
  return {
    projectId,
    generation,
    contentSha256,
    sceneContentSha256: "b".repeat(64),
    assetCollectionSha256: projectAssets.length === 0 ? "d".repeat(64) : "e".repeat(64),
    activeSceneId: sceneId,
    sceneCount: 1,
    assetCount: projectAssets.length,
    assets: projectAssets,
    primaryByteSha256,
    backupByteSha256,
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [catalogEntry],
      workspaceIndexGeneration: 1,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry,
    project: {
      scenesJson: [sceneJson],
      activeSceneId: sceneId,
      assets: projectAssets,
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
        generation,
        contentSha256,
        sceneSha256: "c".repeat(64),
        sceneCount: 1,
        activeSceneId: sceneId,
        scenes: sceneReceipts(),
        assetCount: projectAssets.length,
        recoveredFrom: null,
        migrationStatus: "current",
        persistedContentSha256: contentSha256,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      activeSceneId: sceneId,
      scenes: sceneReceipts(),
      primary: { relativePath: "projects/m723-audio/project.json", status: "VALID", byteSha256: primaryByteSha256 },
      backup: backupByteSha256 === null
        ? { relativePath: "projects/m723-audio/project.backup.json", status: "MISSING" }
        : { relativePath: "projects/m723-audio/project.backup.json", status: "VALID", byteSha256: backupByteSha256 },
      registeredAssets: projectAssets.map((current) => ({
        assetId: (current as typeof asset).registration.assetId,
        role: "audio",
        sha256: current.sha256,
        mediaType: current.mediaType,
        byteLength: current.byteLength,
        relativePath: current.relativePath,
        affectedSceneIds: [],
        disposition: "PRESENT_VALID",
        restoreEligible: false,
      })),
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
}

function save(generation: number, contentSha256: string, assetCount: number) {
  return {
    operation: "dicebox.project.save",
    status: "PASS",
    projectId,
    generation,
    contentSha256,
    sceneSha256: "c".repeat(64),
    sceneCount: 1,
    activeSceneId: sceneId,
    scenes: sceneReceipts(),
    assetCount,
    projectRelativePath: "projects/m723-audio/project.json",
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
}

async function executionReceipt() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-audio", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: projectId, revision: 1, sha256: "f".repeat(64) },
    commands: [{
      commandId: "dbx:proposal-command:m723-audio",
      kind: "project.asset.register-audio",
      dependsOn: [],
      payload: { operation: "project.asset.register-audio", projectId, expectedGeneration: 1 },
    }],
    createdAt: "2026-08-30T21:00:00.000Z",
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-30T21:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, "2026-08-30T21:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, "2026-08-30T21:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 2, sha256: "2".repeat(64) }, "2026-08-30T21:00:04.000Z");
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "3".repeat(64) }, "2026-08-30T21:00:05.000Z");

  const before = read(1, "1".repeat(64), "4".repeat(64), "5".repeat(64), []);
  const afterApply = read(2, "2".repeat(64), "6".repeat(64), "4".repeat(64), [asset]);
  const afterUndo = read(3, "3".repeat(64), "7".repeat(64), "6".repeat(64), [asset]);
  return {
    operation: "dicebox.project.asset.register-audio.execute",
    status: "PASS",
    projectId,
    batchId,
    asset: descriptor,
    before,
    afterApply,
    afterUndo,
    save: save(2, "2".repeat(64), 1),
    inverseRestore: save(3, "3".repeat(64), 1),
    history,
    batch,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const undone = await executionReceipt();
  const history = await redoProposalBatch(
    undone.history,
    undone.batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) },
    "2026-08-30T21:00:06.000Z",
  );
  const beforeRedo = undone.afterUndo;
  const afterRedo = read(4, "8".repeat(64), "9".repeat(64), "7".repeat(64), [asset]);
  return {
    operation: "dicebox.project.asset.register-audio.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: descriptor,
    beforeRedo,
    afterRedo,
    redoReceipt: save(4, "8".repeat(64), 1),
    history,
    matchedReread: { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("project.asset.register-audio terminal-history bridge", () => {
  it("projects the exact apply/undo rereads as a typed, non-executing receipt", async () => {
    const result = bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory(await executionReceipt());

    expect(result).toMatchObject({
      status: "undone",
      disposition: "terminal-undone",
      operation: "dicebox.project.asset.register-audio.execute",
      commandKind: "project.asset.register-audio",
      projectId,
      batchId,
      asset: descriptor,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      noProjectMutation: true,
      authoritativeReread: true,
      execution: "not-implemented",
      readyClaim: false,
      projectContentWrite: true,
      assetBytesPersisted: true,
      assetTreePreserved: true,
      sceneContentRestored: true,
      noFoundryWrite: true,
      historyStatus: "undone",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo"],
    });
    expect(result.authoritativeRereads.afterApply.assets).toContainEqual(asset);
    expect(result.authoritativeRereads.afterUndo.assets).toContainEqual(asset);
    expect(projectAudioAssetTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed when Scene, asset-byte, or authority evidence is tampered", async () => {
    const sceneTampered = structuredClone(await executionReceipt()) as any;
    sceneTampered.afterUndo.project.scenesJson[0] = JSON.stringify({ ...scene, name: "tampered" });
    expect(() => bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory(sceneTampered)).toThrow(/Scene|preserved|restored/i);

    const assetTampered = structuredClone(await executionReceipt()) as any;
    assetTampered.afterApply.project.assets[0].byteLength = 15;
    expect(() => bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory(assetTampered)).toThrow(/asset|authoritative|collection/i);

    const valid = bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory(await executionReceipt());
    const authorityTampered = structuredClone(valid) as any;
    authorityTampered.noGenericExecutor = false;
    expect(projectAudioAssetTerminalHistoryReceiptSchema.safeParse(authorityTampered)).toMatchObject({ success: false });
  });

  it("projects one exact audio-asset redo lifecycle with matched project reread", async () => {
    const result = bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(await redoExecutionReceipt());

    expect(result).toMatchObject({
      status: "redone",
      disposition: "terminal-redone",
      operation: "dicebox.project.asset.register-audio.redo",
      commandKind: "project.asset.register-audio",
      projectId,
      batchId,
      asset: descriptor,
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
      assetTreePreserved: true,
      projectContentWrite: false,
      assetBytesPersisted: false,
      sceneContentRestored: false,
      noTransitionAuthority: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
      matchedReread: { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) },
    });
    expect(result.authoritativeRereads.beforeRedo.assets).toContainEqual(asset);
    expect(result.authoritativeRereads.afterRedo.assets).toContainEqual(asset);
    expect(projectAudioAssetRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for foreign, non-terminal, and mismatched redo evidence", async () => {
    const foreign = await redoExecutionReceipt({ projectId: "dbx:project:foreign" });
    expect(() => bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(foreign)).toThrow(/project|foreign/i);

    const nonTerminal = await redoExecutionReceipt();
    (nonTerminal.history as any) = { ...nonTerminal.history, status: "undone", receipts: nonTerminal.history.receipts.slice(0, -1) };
    expect(() => bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(nonTerminal)).toThrow(/terminal|redone|history/i);

    const mismatched = await redoExecutionReceipt({ matchedReread: { status: "matched", targetId: projectId, revision: 99, sha256: "8".repeat(64) } });
    expect(() => bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(mismatched)).toThrow(/revision|reread|afterRedo/i);
  });
});
