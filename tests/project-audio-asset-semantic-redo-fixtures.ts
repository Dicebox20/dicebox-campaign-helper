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

const projectId = "dbx:project:m896-audio";
const batchId = "dbx:proposal:m896-audio";
const sceneId = "dbx:scene:m896-main";
const assetSha256 = "a".repeat(64);
const descriptor = {
  assetId: `dbx:asset:sha256-${assetSha256}`,
  assetSha256,
  mediaType: "audio/wav",
  role: "audio",
  label: "M896 audio.wav",
  provenance: "user-import",
} as const;

const scene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 0,
  id: sceneId,
  name: "M896 Main",
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

function read(generation: number, contentSha256: string, primaryByteSha256: string, backupByteSha256: string, assets: readonly (typeof asset)[]) {
  const projectAssets = [...assets];
  const catalogEntry = {
    projectId,
    status: "PASS",
    sceneId,
    sceneName: "M896 Main",
    sceneCount: 1,
    activeSceneId: sceneId,
    generation,
    contentSha256,
    assetCount: projectAssets.length,
    recoveredFrom: null,
    blockerCode: null,
    displayName: "M896 Audio",
    lastOpenedSequence: 1,
    workspaceMetadataWarning: null,
  };
  return {
    projectId,
    generation,
    contentSha256,
    sceneContentSha256: "b".repeat(64),
    assetCollectionSha256: "e".repeat(64),
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
      primary: { relativePath: "projects/m896-audio/project.json", status: "VALID", byteSha256: primaryByteSha256 },
      backup: { relativePath: "projects/m896-audio/project.backup.json", status: "VALID", byteSha256: backupByteSha256 },
      registeredAssets: projectAssets.map((current) => ({
        assetId: current.registration.assetId,
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

function save(generation: number, contentSha256: string) {
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
    assetCount: 1,
    projectRelativePath: "projects/m896-audio/project.json",
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
}

export async function createAudioAssetRedoExecutionReceipt() {
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
      commandId: "dbx:proposal-command:m896-audio",
      kind: "project.asset.register-audio",
      dependsOn: [],
      payload: { operation: "project.asset.register-audio", projectId, expectedGeneration: 1 },
    }],
    createdAt: "2026-09-01T12:00:00.000Z",
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-09-01T12:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, "2026-09-01T12:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, "2026-09-01T12:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 2, sha256: "2".repeat(64) }, "2026-09-01T12:00:04.000Z");
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "3".repeat(64) }, "2026-09-01T12:00:05.000Z");

  const beforeRedo = read(3, "3".repeat(64), "7".repeat(64), "6".repeat(64), [asset]);
  const afterRedo = read(4, "8".repeat(64), "9".repeat(64), "7".repeat(64), [asset]);
  const redoHistory = await redoProposalBatch(
    history,
    batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) },
    "2026-09-01T12:00:06.000Z",
  );

  return {
    operation: "dicebox.project.asset.register-audio.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: descriptor,
    beforeRedo,
    afterRedo,
    redoReceipt: save(4, "8".repeat(64)),
    history: redoHistory,
    matchedReread: { status: "matched" as const, targetId: projectId, revision: 4, sha256: "8".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}
