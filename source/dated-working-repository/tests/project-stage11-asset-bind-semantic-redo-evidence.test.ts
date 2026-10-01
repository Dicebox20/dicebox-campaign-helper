import { describe, expect, it } from "vitest";
import {
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  approveProposalBatch,
  beginProposalApply,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";
import {
  createProjectStage11AssetBindSemanticRedoEvidence,
  projectStage11AssetBindSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-asset-bind-semantic-redo-evidence";

const projectId = "dbx:project:m908-bind";
const batchId = "dbx:proposal:m908-bind";
const commandId = "dbx:proposal-command:m908-bind";
const sceneId = "dbx:scene:m908-bind";
const previousAssetId = "dbx:asset:sha256-" + "a".repeat(64);
const assetSha256 = "d".repeat(64);
const assetId = `dbx:asset:sha256-${assetSha256}`;
const observed = (second: number) => `2026-09-01T00:00:${String(second).padStart(2, "0")}.000Z`;

function storedAsset() {
  return { sha256: assetSha256, mediaType: "image/png", byteLength: 12, relativePath: `assets/sha256/${assetSha256}`, registration: { assetId, role: "background", label: "M908 background.png", provenance: "user-import", approval: "approved" } };
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

async function redoReceipt(overrides: Record<string, unknown> = {}) {
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
  const undone = {
    operation: "dicebox.project.asset.bind.execute", status: "PASS", projectId, batchId,
    asset: { assetId, assetSha256, mediaType: "image/png", role: "background", sceneId, label: "M908 background.png", provenance: "user-import" },
    before: projectRead(2, "c".repeat(64), "1".repeat(64), "a".repeat(64), "b".repeat(64), previousAssetId),
    afterApply: projectRead(3, "e".repeat(64), "1".repeat(64), "b".repeat(64), "a".repeat(64), assetId),
    afterUndo: projectRead(4, "f".repeat(64), "1".repeat(64), "c".repeat(64), "b".repeat(64), previousAssetId),
    save: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 3, contentSha256: "e".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m908-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    inverseRestore: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 4, contentSha256: "f".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m908-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history, batch, projectContentWrite: true, assetBytesPersisted: true, assetAdded: false, assetTreePreserved: true, sceneContentRestored: true, noFoundryWrite: true,
  };
  const redoHistory = await redoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) }, observed(6));
  return {
    operation: "dicebox.project.asset.bind.redo",
    status: "PASS",
    projectId,
    batchId,
    asset: undone.asset,
    beforeRedo: undone.afterUndo,
    afterRedo: projectRead(5, "7".repeat(64), "1".repeat(64), "f".repeat(64), "c".repeat(64), assetId),
    redoReceipt: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "a".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "a".repeat(64) }], assetCount: 1, projectRelativePath: "projects/m908-bind/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history: redoHistory,
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

describe("M908 project.asset.bind semantic redo evidence", () => {
  it("composes the strict asset-binding redo bridge into non-certifying semantic evidence", async () => {
    const result = createProjectStage11AssetBindSemanticRedoEvidence(await redoReceipt());
    expect(result).toMatchObject({
      milestone: "M908",
      receipt: "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json",
      operation: "project.asset.bind.redo",
      semantic: "redo-post-state",
      assetDescriptorPreserved: true,
      bindingTransitionPreserved: true,
      matchedReread: true,
      generationAdvanced: true,
      assetCountPreserved: true,
      sceneCollectionPreserved: true,
      assetTreePreserved: true,
      assetBytesNonPersistentOnRedo: true,
      semanticContentChanged: true,
      byteEnvelopeRotated: true,
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.backgroundBindings).toEqual([{ sceneId, assetId }]);
    expect(projectStage11AssetBindSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for descriptor, binding, content, Scene, asset-tree, reread, and authority drift", async () => {
    const descriptorDrift = await redoReceipt() as any;
    descriptorDrift.asset.assetId = previousAssetId;
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(descriptorDrift)).toThrow(/asset|content-addressed/i);

    const bindingDrift = await redoReceipt() as any;
    bindingDrift.afterRedo.backgroundBindings[0].assetId = previousAssetId;
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(bindingDrift)).toThrow(/binding|transition|asset/i);

    const contentDrift = await redoReceipt() as any;
    contentDrift.afterRedo.contentSha256 = contentDrift.beforeRedo.contentSha256;
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(contentDrift)).toThrow(/content|generation|redo/i);

    const sceneDrift = await redoReceipt() as any;
    sceneDrift.afterRedo.activeSceneId = "dbx:scene:foreign";
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|active|foreign/i);

    const assetTreeDrift = await redoReceipt() as any;
    assetTreeDrift.assetTreePreserved = false;
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(assetTreeDrift)).toThrow(/asset|tree|true/i);

    const rereadDrift = await redoReceipt() as any;
    rereadDrift.matchedReread.sha256 = "f".repeat(64);
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(rereadDrift)).toThrow(/reread|hash/i);

    const authorityDrift = await redoReceipt() as any;
    authorityDrift.noProjectMutation = false;
    expect(() => createProjectStage11AssetBindSemanticRedoEvidence(authorityDrift)).toThrow(/noProjectMutation|true/i);
  });
});
