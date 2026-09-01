import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m898-handout";
const batchId = "dbx:proposal:m898-handout";
const sceneId = "dbx:scene:m898-handout";
const assetSha256 = "c".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const asset = {
  sha256: assetSha256,
  mediaType: "image/png",
  byteLength: 32,
  relativePath: "assets/handouts/m898-handout.png",
  registration: { assetId, role: "handout", label: "M898 handout", provenance: "user-import" },
} as const;
const descriptor = {
  assetId,
  assetSha256,
  mediaType: "image/png",
  role: "handout",
  label: "M898 handout",
  provenance: "user-import",
} as const;
const observed = (second: number) => `2026-09-01T12:30:${String(second).padStart(2, "0")}.000Z`;

function projectRead(generation: number, contentSha256: string, assetCollectionSha256: string, primaryByteSha256: string, backupByteSha256: string) {
  const assets = generation === 2 ? [] : [asset];
  const registeredAssets = assets.length === 0 ? [] : [{ assetId, sha256: assetSha256, mediaType: "image/png", byteLength: 32, relativePath: asset.relativePath, disposition: "PRESENT_VALID" }];
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
      entries: [{ projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length }],
      workspaceIndexGeneration: generation + 10,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, sceneCount: 1, assetCount: assets.length },
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

function save(generation: number, contentSha256: string) {
  return {
    operation: "dicebox.project.save",
    status: "PASS",
    projectId,
    generation,
    contentSha256,
    sceneSha256: "a".repeat(64),
    sceneCount: 1,
    activeSceneId: sceneId,
    scenes: [{ sceneId, sceneSha256: "a".repeat(64) }],
    assetCount: 1,
    projectRelativePath: "projects/m898-handout/project.json",
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
}

export async function createHandoutAssetRedoExecutionReceipt() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.asset.register-handout", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "high",
    base: { targetId: projectId, revision: 2, sha256: "f".repeat(64) },
    commands: [{ commandId: "dbx:proposal-command:m898-handout", kind: "project.asset.register-handout", dependsOn: [], payload: { operation: "project.asset.register-handout", projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "d".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "e".repeat(64) }, observed(5));
  const beforeRedo = projectRead(4, "e".repeat(64), "2".repeat(64), "2".repeat(64), "0".repeat(64));
  const afterRedo = projectRead(5, "8".repeat(64), "2".repeat(64), "3".repeat(64), "2".repeat(64));
  const redoHistory = await redoProposalBatch(
    history,
    batch,
    { actorId: "reviewer", role: "reviewer" },
    { status: "matched", targetId: projectId, revision: 5, sha256: "8".repeat(64) },
    observed(6),
  );
  return {
    operation: "dicebox.project.asset.register-handout.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: descriptor,
    beforeRedo,
    afterRedo,
    redoReceipt: save(5, "8".repeat(64)),
    history: redoHistory,
    matchedReread: { status: "matched" as const, targetId: projectId, revision: 5, sha256: "8".repeat(64) },
    projectContentWrite: false,
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}
