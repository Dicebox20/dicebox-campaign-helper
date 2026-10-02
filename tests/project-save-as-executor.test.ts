import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createProjectSaveAsPreview, createProjectSaveAsProposalBatch, hashProjectSaveAsAssetCollection } from "../apps/campaign-helper-desktop/src/project-save-as-proposal-adapter.js";
import { executeApprovedProjectSaveAs, type ProjectSaveAsStore } from "../apps/campaign-helper-desktop/src/project-save-as-executor.js";
import type { ProjectCatalogResponse, ProjectLoadResponse, ProjectRecoveryInspectionReceipt, ProjectSaveReceipt, StoredAsset } from "../apps/campaign-helper-desktop/src/project-store.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import { serializeSceneDocument, type SceneDocument } from "../packages/dicebox-scene/src/index.js";

const sourceProjectId = "dbx:project:m353-source";
const targetProjectId = "dbx:project:m353-copy";
const first = createBlankProjectScene(sourceProjectId);
const second = createBlankProjectScene(sourceProjectId, 2);
const observedAt = "2026-08-28T23:30:00.000Z";

function hashForGeneration(generation: number): string {
  return String.fromCharCode(96 + generation).repeat(64);
}

class MemorySaveAsStore implements ProjectSaveAsStore {
  sourceGeneration = 2;
  sourceContentSha256 = "a".repeat(64);
  sourceScenes: readonly SceneDocument[] = [first, second];
  sourceActiveSceneId = second.id;
  sourceAssets: readonly StoredAsset[] = [];
  workspaceIndexGeneration = 4;
  target: Readonly<{ generation: number; contentSha256: string; scenes: readonly SceneDocument[]; activeSceneId: string; displayName: string; assets: readonly StoredAsset[] }> | null = null;
  saveAsCalls: Array<Readonly<{ sourceProjectId: string; targetProjectId: string; expectedWorkspaceGeneration: number; displayName: string; scenes: readonly SceneDocument[] }>> = [];
  failuresRemaining = 0;
  workspaceMetadataFailure = false;

  private sourceEntry() {
    return { projectId: sourceProjectId, status: "PASS" as const, sceneId: this.sourceScenes[0]!.id, sceneName: this.sourceScenes[0]!.name, sceneCount: this.sourceScenes.length, activeSceneId: this.sourceActiveSceneId, generation: this.sourceGeneration, contentSha256: this.sourceContentSha256, assetCount: this.sourceAssets.length, recoveredFrom: null, blockerCode: null, displayName: "M353 Source", lastOpenedSequence: 1, workspaceMetadataWarning: null };
  }

  private targetEntry() {
    if (!this.target) return null;
    return { projectId: targetProjectId, status: "PASS" as const, sceneId: this.target.scenes[0]!.id, sceneName: this.target.scenes[0]!.name, sceneCount: this.target.scenes.length, activeSceneId: this.target.activeSceneId, generation: this.target.generation, contentSha256: this.target.contentSha256, assetCount: this.target.assets.length, recoveredFrom: null, blockerCode: null, displayName: this.target.displayName, lastOpenedSequence: 2, workspaceMetadataWarning: null };
  }

  list(): Promise<ProjectCatalogResponse> {
    const targetEntry = this.targetEntry();
    return Promise.resolve({ operation: "dicebox.project.catalog", status: "PASS", entries: [this.sourceEntry(), ...(targetEntry ? [targetEntry] : [])], workspaceIndexGeneration: this.workspaceIndexGeneration, workspaceMetadataWarning: null, noWrite: true, noFoundryWrite: true });
  }

  load(projectId: string): Promise<ProjectLoadResponse> {
    if (projectId === sourceProjectId) return Promise.resolve(this.loadResponse(sourceProjectId, this.sourceGeneration, this.sourceContentSha256, this.sourceScenes, this.sourceActiveSceneId, this.sourceAssets));
    if (projectId === targetProjectId && this.target) return Promise.resolve(this.loadResponse(targetProjectId, this.target.generation, this.target.contentSha256, this.target.scenes, this.target.activeSceneId, this.target.assets));
    return Promise.reject(new Error("missing exact project"));
  }

  private loadResponse(projectId: string, generation: number, contentSha256: string, scenes: readonly SceneDocument[], activeSceneId: string, assets: readonly StoredAsset[]): ProjectLoadResponse {
    const scenesJson = scenes.map(serializeSceneDocument);
    return { scenesJson, activeSceneId, assets, receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation, contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), assetCount: assets.length, recoveredFrom: null, migrationStatus: "current", persistedContentSha256: contentSha256, noFoundryWrite: true } };
  }

  inspect(projectId: string): Promise<ProjectRecoveryInspectionReceipt> {
    const isSource = projectId === sourceProjectId;
    const current = isSource ? { generation: this.sourceGeneration, contentSha256: this.sourceContentSha256, scenes: this.sourceScenes, activeSceneId: this.sourceActiveSceneId, assets: this.sourceAssets } : this.target;
    if (!current) return Promise.reject(new Error("missing exact project recovery state"));
    return Promise.resolve({ operation: "dicebox.project.recovery.inspect", status: "PASS", projectId, generation: current.generation, contentSha256: current.contentSha256, activeSceneId: current.activeSceneId, scenes: current.scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), primary: { relativePath: `projects/${projectId.slice(-10)}/project.json`, status: "VALID", byteSha256: isSource ? "b".repeat(64) : "f".repeat(64) }, backup: { relativePath: `projects/${projectId.slice(-10)}/project.backup.json`, status: isSource ? "VALID" : "MISSING" }, registeredAssets: current.assets.filter((asset) => asset.registration).map((asset) => ({ assetId: asset.registration!.assetId, role: asset.registration!.role, sha256: asset.sha256, mediaType: asset.mediaType, byteLength: asset.byteLength, relativePath: asset.relativePath, affectedSceneIds: [], disposition: "PRESENT_VALID", restoreEligible: false })), pendingArtifacts: [], brokenSceneReferences: [], retry: "none", restoreEligible: false, noWrite: true, noFoundryWrite: true });
  }

  async saveAs(sourceId: string, targetId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<ProjectSaveReceipt> {
    this.saveAsCalls.push({ sourceProjectId: sourceId, targetProjectId: targetId, expectedWorkspaceGeneration, displayName, scenes });
    if (this.failuresRemaining > 0) {
      this.failuresRemaining -= 1;
      throw new Error("fixture save-as transport stopped");
    }
    if (sourceId !== sourceProjectId || targetId !== targetProjectId || expectedWorkspaceGeneration !== this.workspaceIndexGeneration || this.target) throw new Error("save-as target or workspace conflict");
    this.target = { generation: 1, contentSha256: hashForGeneration(1), scenes, activeSceneId, displayName, assets: this.sourceAssets };
    this.workspaceIndexGeneration += 1;
    const workspaceMetadata = { operation: "dicebox.workspace-metadata.touch" as const, status: "PASS" as const, projectId: targetId, displayName, lastOpenedSequence: 2, indexGeneration: this.workspaceIndexGeneration, contentSha256: this.target.contentSha256, recoveredFrom: null, atomicReplace: true as const, directoryEntrySync: true as const, backupPreserved: false, noFoundryWrite: true as const };
    return { operation: "dicebox.project.save-as", status: "PASS", projectId: targetId, generation: 1, contentSha256: this.target.contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), assetCount: this.sourceAssets.length, projectRelativePath: "projects/m353-copy/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: false, noFoundryWrite: true, ...(this.workspaceMetadataFailure ? { workspaceMetadataWarning: "STALE_WORKSPACE_INDEX_GENERATION" } : { workspaceMetadata }) };
  }
}

async function proposalSession(batchId = "dbx:proposal:m353-save-as", store = new MemorySaveAsStore()): Promise<Awaited<ReturnType<typeof createDesktopProjectProposalSession>>> {
  const preview = await createProjectSaveAsPreview({ sourceProjectId, targetProjectId, sourceGeneration: store.sourceGeneration, sourceContentSha256: store.sourceContentSha256, sourceAssetCount: store.sourceAssets.length, sourceAssetCollectionSha256: await hashProjectSaveAsAssetCollection(store.sourceAssets), workspaceIndexGeneration: store.workspaceIndexGeneration, scenes: store.sourceScenes, activeSceneId: store.sourceActiveSceneId, proposedDisplayName: "M353 Copy" });
  const batch = await createProjectSaveAsProposalBatch({ batchId, preview, createdAt: observedAt });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observedAt);
  return createDesktopProjectProposalSession({ projectId: sourceProjectId, batch, history });
}

async function approvedSession(store = new MemorySaveAsStore()) {
  const session = await proposalSession("dbx:proposal:m353-save-as", store);
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, session.batch.base, observedAt);
}

describe("project save-as proposal and source-preserving executor", () => {
  it("creates a deterministic metadata-only source/target batch", async () => {
    const store = new MemorySaveAsStore();
    const preview = await createProjectSaveAsPreview({ sourceProjectId, targetProjectId, sourceGeneration: store.sourceGeneration, sourceContentSha256: store.sourceContentSha256, sourceAssetCount: store.sourceAssets.length, sourceAssetCollectionSha256: await hashProjectSaveAsAssetCollection(store.sourceAssets), workspaceIndexGeneration: store.workspaceIndexGeneration, scenes: store.sourceScenes, activeSceneId: store.sourceActiveSceneId, proposedDisplayName: "M353 Copy" });
    const batch = await createProjectSaveAsProposalBatch({ batchId: "dbx:proposal:m353-metadata", preview, createdAt: observedAt });
    expect(batch).toMatchObject({ producer: { kind: "project-store", sourceId: "desktop.project.save-as", provider: null }, base: { targetId: sourceProjectId, revision: 2 }, commands: [{ kind: "project.save-as" }] });
    expect(Object.keys(batch.commands[0]!.payload).sort()).toEqual(["operation", "sourceProjectId", "targetProjectId", "sourceGeneration", "sourceContentSha256", "sourceAssetCount", "sourceAssetCollectionSha256", "workspaceIndexGeneration", "sourceSceneIds", "sourceScenesSha256", "sourceActiveSceneId", "sourceSceneCount", "proposedDisplayName", "targetAbsent", "previewSha256"].sort());
    expect(JSON.stringify(batch)).not.toMatch(/raw|bytes|path|credential|password|secret|M353 Source/i);
  });

  it("preserves a complete asset tree for an asset-bearing save-as", async () => {
    const store = new MemorySaveAsStore();
    const assetSha256 = "1".repeat(64);
    store.sourceAssets = [{
      sha256: assetSha256,
      mediaType: "image/png",
      byteLength: 4,
      relativePath: `assets/sha256/${assetSha256}`,
      registration: {
        assetId: `dbx:asset:sha256-${assetSha256}`,
        role: "handout",
        label: "M367 handout",
        provenance: "user-import",
        approval: "approved",
      },
    }];
    const receipt = await executeApprovedProjectSaveAs({ session: await approvedSession(store), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(receipt.before.source.assets).toEqual(store.sourceAssets);
    expect(receipt.afterApply.target?.assets).toEqual(store.sourceAssets);
    expect(receipt.afterApply.target?.assetCollectionSha256).toBe(receipt.before.source.assetCollectionSha256);
    expect(receipt.afterApply.target?.assetCollectionSha256).toBe(await hashProjectSaveAsAssetCollection(store.sourceAssets));
    expect(receipt.saveAs.assetCount).toBe(1);
  });

  it("creates a fresh target, rereads it and preserves the source", async () => {
    const store = new MemorySaveAsStore();
    const receipt = await executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(receipt).toMatchObject({ operation: "dicebox.project.save-as.execute", status: "PASS", sourceProjectId, targetProjectId, projectContentWrite: true, projectPersistenceWrite: true, sourcePreserved: true, targetCreated: true, noFoundryWrite: true });
    expect(receipt.before.targetAbsent).toBe(true);
    expect(receipt.afterApply.targetAbsent).toBe(false);
    expect(receipt.afterApply.target?.projectId).toBe(targetProjectId);
    expect(receipt.afterApply.target?.sceneIds).toEqual([first.id, second.id]);
    expect(receipt.afterApply.target?.activeSceneId).toBe(second.id);
    expect(receipt.afterApply.source.generation).toBe(2);
    expect(receipt.afterApply.source.contentSha256).toBe(receipt.before.source.contentSha256);
    expect(receipt.afterApply.source.sceneIds).toEqual(receipt.before.source.sceneIds);
    expect(receipt.saveAs.workspaceMetadata?.displayName).toBe("M353 Copy");
    expect(receipt.history.status).toBe("committed");
    expect(receipt.history.receipts.map((item) => item.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
    expect(store.saveAsCalls).toHaveLength(1);
  });

  it("rejects an unapproved session and a colliding target before save-as", async () => {
    const unapprovedStore = new MemorySaveAsStore();
    await expect(executeApprovedProjectSaveAs({ session: await proposalSession("dbx:proposal:m353-unapproved"), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: unapprovedStore })).rejects.toMatchObject({ code: "PROJECT_SAVE_AS_NOT_APPROVED" });
    expect(unapprovedStore.saveAsCalls).toHaveLength(0);

    const collidingStore = new MemorySaveAsStore();
    collidingStore.target = { generation: 1, contentSha256: "f".repeat(64), scenes: [first, second], activeSceneId: second.id, displayName: "Existing", assets: [] };
    await expect(executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: collidingStore })).rejects.toMatchObject({ code: "PROJECT_SAVE_AS_CONFLICT" });
    expect(collidingStore.saveAsCalls).toHaveLength(0);
  });

  it("rejects stale source content or foreign Scene content before save-as", async () => {
    const store = new MemorySaveAsStore();
    store.sourceContentSha256 = "c".repeat(64);
    await expect(executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store })).rejects.toMatchObject({ code: "PROJECT_SAVE_AS_CONFLICT" });
    expect(store.saveAsCalls).toHaveLength(0);

    const foreignStore = new MemorySaveAsStore();
    const foreign = { ...second, name: "Foreign" };
    await expect(executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, foreign], activeSceneId: foreign.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: foreignStore })).rejects.toMatchObject({ code: "PROJECT_SAVE_AS_CONFLICT" });
    expect(foreignStore.saveAsCalls).toHaveLength(0);
  });

  it("marks save-as transport uncertainty and never retries", async () => {
    const store = new MemorySaveAsStore();
    store.failuresRemaining = 1;
    const error = await executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toMatchObject({ code: "PROJECT_SAVE_AS_OUTCOME_UNKNOWN", session: { history: { status: "unknown-outcome" } } });
    expect(store.saveAsCalls).toHaveLength(1);
  });

  it("marks a post-write workspace metadata failure as outcome-unknown", async () => {
    const store = new MemorySaveAsStore();
    store.workspaceMetadataFailure = true;
    const error = await executeApprovedProjectSaveAs({ session: await approvedSession(), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toMatchObject({ code: "PROJECT_SAVE_AS_OUTCOME_UNKNOWN", session: { history: { status: "unknown-outcome" } } });
    expect(store.target).not.toBeNull();
    expect(store.saveAsCalls).toHaveLength(1);
  });
});
