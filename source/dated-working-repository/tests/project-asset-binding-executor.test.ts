import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  executeApprovedProjectAssetBinding,
  executeApprovedProjectAssetBindingCommit,
  ProjectAssetBindingExecutionError,
  type ProjectAssetBindingStore,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-executor.js";
import {
  createProjectAssetBindingPreview,
  createProjectAssetBindingProposalBatch,
  deriveProjectBackgroundAssetDescriptor,
  sceneWithBackgroundAsset,
  type ProjectBackgroundAssetCandidate,
  type ProjectAssetBindingContent,
} from "../apps/campaign-helper-desktop/src/project-asset-binding-proposal-adapter.js";
import type {
  ProjectCatalogResponse,
  ProjectLoadResponse,
  ProjectRecoveryInspectionReceipt,
  ProjectSaveReceipt,
  StoredAsset,
} from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import type { SceneDocument } from "../packages/dicebox-scene/src/index.js";
import { serializeSceneDocument } from "../packages/dicebox-scene/src/index.js";

const projectId = "dbx:project:m341-asset-bind";
const mainSceneId = "dbx:scene:m341-main";
const secondSceneId = "dbx:scene:m341-secondary";
const candidate: ProjectBackgroundAssetCandidate = {
  mediaType: "image/png",
  bytes: [137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0],
  label: "M341 background.png",
  provenance: "user-import",
};

function scene(id: string, name: string): SceneDocument {
  return { schemaVersion: "0.1.0", revision: 0, id, name, width: 10, height: 10, background: { color: 0, gridSize: 1 }, entities: [] };
}

async function fixtureContent(): Promise<Readonly<{ descriptor: Awaited<ReturnType<typeof deriveProjectBackgroundAssetDescriptor>>; original: ProjectAssetBindingContent; proposed: ProjectAssetBindingContent }>> {
  const descriptor = await deriveProjectBackgroundAssetDescriptor(candidate, mainSceneId);
  const main = scene(mainSceneId, "M341 Main");
  const second = sceneWithBackgroundAsset(scene(secondSceneId, "M341 Secondary"), descriptor.assetId);
  return {
    descriptor,
    original: { scenes: [main, second], activeSceneId: secondSceneId, sceneId: mainSceneId, candidate },
    proposed: { scenes: [sceneWithBackgroundAsset(main, descriptor.assetId), second], activeSceneId: secondSceneId, sceneId: mainSceneId, candidate },
  };
}

function loadResponse(content: ProjectAssetBindingContent, assets: readonly StoredAsset[], generation: number, contentSha256: string): ProjectLoadResponse {
  const scenesJson = content.scenes.map(serializeSceneDocument);
  return {
    scenesJson,
    activeSceneId: content.activeSceneId,
    assets,
    receipt: {
      operation: "dicebox.project.load",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      sceneSha256: "d".repeat(64),
      sceneCount: scenesJson.length,
      activeSceneId: content.activeSceneId,
      scenes: content.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
      assetCount: assets.length,
      recoveredFrom: null,
      migrationStatus: "current",
      persistedContentSha256: contentSha256,
      noFoundryWrite: true,
    },
  };
}

function recoveryResponse(content: ProjectAssetBindingContent, assets: readonly StoredAsset[], generation: number, contentSha256: string, primaryByteSha256: string, backupByteSha256: string): ProjectRecoveryInspectionReceipt {
  return {
    operation: "dicebox.project.recovery.inspect",
    status: "PASS",
    projectId,
    generation,
    contentSha256,
    activeSceneId: content.activeSceneId,
    scenes: content.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
    primary: { relativePath: "projects/m341/project.json", status: "VALID", byteSha256: primaryByteSha256 },
    backup: { relativePath: "projects/m341/project.backup.json", status: "VALID", byteSha256: backupByteSha256 },
    registeredAssets: assets.filter((asset) => asset.registration !== undefined).map((asset) => ({
      assetId: asset.registration!.assetId,
      role: asset.registration!.role,
      sha256: asset.sha256,
      mediaType: asset.mediaType,
      byteLength: asset.byteLength,
      relativePath: asset.relativePath,
      affectedSceneIds: content.scenes.filter((current) => current.background.assetId === asset.registration!.assetId).map((current) => current.id),
      disposition: "PRESENT_VALID" as const,
      restoreEligible: false,
    })),
    pendingArtifacts: [],
    brokenSceneReferences: [],
    retry: "none",
    restoreEligible: false,
    noWrite: true,
    noFoundryWrite: true,
  };
}

class MemoryAssetBindingStore implements ProjectAssetBindingStore {
  generation = 2;
  contentSha256 = "a".repeat(64);
  primaryByteSha256 = "b".repeat(64);
  backupByteSha256 = "c".repeat(64);
  scenes: readonly SceneDocument[];
  assets: readonly StoredAsset[];
  activeSceneId = secondSceneId;
  listCalls = 0;
  loadCalls = 0;
  inspectCalls = 0;
  readonly saveCalls: Array<Readonly<{ expectedGeneration: number; scenes: readonly SceneDocument[] }>> = [];

  constructor(content: ProjectAssetBindingContent, asset: StoredAsset | null) {
    this.scenes = content.scenes;
    this.assets = asset ? [asset] : [];
  }

  list(): Promise<ProjectCatalogResponse> {
    this.listCalls += 1;
    return Promise.resolve({
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", sceneId: this.scenes[0]!.id, sceneName: this.scenes[0]!.name, sceneCount: this.scenes.length, activeSceneId: this.activeSceneId, generation: this.generation, contentSha256: this.contentSha256, assetCount: this.assets.length, recoveredFrom: null, blockerCode: null, displayName: "M341 Asset Binding", lastOpenedSequence: 1, workspaceMetadataWarning: null }],
      workspaceIndexGeneration: 4,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  load(): Promise<ProjectLoadResponse> {
    this.loadCalls += 1;
    return Promise.resolve(loadResponse({ scenes: this.scenes, activeSceneId: this.activeSceneId, sceneId: mainSceneId, candidate }, this.assets, this.generation, this.contentSha256));
  }

  inspect(): Promise<ProjectRecoveryInspectionReceipt> {
    this.inspectCalls += 1;
    return Promise.resolve(recoveryResponse({ scenes: this.scenes, activeSceneId: this.activeSceneId, sceneId: mainSceneId, candidate }, this.assets, this.generation, this.contentSha256, this.primaryByteSha256, this.backupByteSha256));
  }

  async save(_projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number, assets: Parameters<ProjectAssetBindingStore["save"]>[4]): Promise<ProjectSaveReceipt> {
    this.saveCalls.push({ expectedGeneration, scenes });
    if (expectedGeneration !== this.generation) throw new Error("stale project generation");
    for (const asset of assets) {
      const sha256 = asset.registration.assetId.replace("dbx:asset:sha256-", "");
      if (!this.assets.some((existing) => existing.sha256 === sha256)) {
        this.assets = [...this.assets, {
          sha256,
          mediaType: asset.mediaType,
          byteLength: asset.bytes.length,
          relativePath: `assets/sha256/${sha256}`,
          registration: asset.registration,
        }];
      }
    }
    this.backupByteSha256 = this.primaryByteSha256;
    this.primaryByteSha256 = (this.generation === 2 ? "d" : "e").repeat(64);
    this.generation += 1;
    this.scenes = scenes;
    this.activeSceneId = activeSceneId;
    this.contentSha256 = (this.generation === 3 ? "f" : "e").repeat(64);
    return { operation: "dicebox.project.save", status: "PASS", projectId, generation: this.generation, contentSha256: this.contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })), assetCount: this.assets.length, projectRelativePath: "projects/m341/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true };
  }
}

async function approvedSession(content: ProjectAssetBindingContent, descriptor: Awaited<ReturnType<typeof deriveProjectBackgroundAssetDescriptor>>) {
  const preview = await createProjectAssetBindingPreview({ projectId, currentGeneration: 2, currentContentSha256: "a".repeat(64), candidate, sceneId: mainSceneId, proposedSceneCount: content.scenes.length, proposedActiveSceneId: content.activeSceneId, proposedAssetCount: 1 });
  expect(preview.assetId).toBe(descriptor.assetId);
  const batch = await createProjectAssetBindingProposalBatch({ batchId: "dbx:proposal:m341-asset-bind", preview, createdAt: new Date(Date.now() - 4000).toISOString() });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date(Date.now() - 3000).toISOString());
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, batch.base, new Date(Date.now() - 2000).toISOString());
}

describe("approved project.asset.bind execution adapter", () => {
  it("supports one explicitly selected committed binding without inventing a generic executor", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const store = new MemoryAssetBindingStore(original, null);
    const result = await executeApprovedProjectAssetBindingCommit({ session: await approvedSession(proposed, descriptor), content: proposed, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result).toMatchObject({ operation: "dicebox.project.asset.bind.commit", status: "PASS", projectId, projectContentWrite: true, assetBytesPersisted: true, assetAdded: true, assetTreePreserved: true, noFoundryWrite: true });
    expect(result.before.generation).toBe(2);
    expect(result.afterApply.generation).toBe(3);
    expect(result.afterApply.backgroundBindings.find((binding) => binding.sceneId === mainSceneId)?.assetId).toBe(descriptor.assetId);
    expect(result.afterApply.assetCount).toBe(1);
    expect(result.history.status).toBe("committed");
    expect(result.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
    expect(store.saveCalls.map((call) => call.expectedGeneration)).toEqual([2]);
  });

  it("executes, rereads, inversely restores, and preserves the registered PNG asset tree", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const asset: StoredAsset = { sha256: descriptor.assetSha256, mediaType: "image/png", byteLength: candidate.bytes.length, relativePath: `assets/sha256/${descriptor.assetSha256}`, registration: { assetId: descriptor.assetId, role: "background", label: candidate.label, provenance: candidate.provenance, approval: "approved" } };
    const store = new MemoryAssetBindingStore(original, asset);
    const session = await approvedSession(proposed, descriptor);
    expect(Object.keys(session.batch.commands[0]!.payload).sort()).toEqual(["assetId", "assetSha256", "candidateDescriptorSha256", "currentContentSha256", "expectedGeneration", "operation", "projectId", "proposedActiveSceneId", "proposedAssetCount", "proposedSceneCount", "role", "sceneId"]);
    expect(JSON.stringify(session.batch.commands[0]!.payload)).not.toContain("bytes");
    expect(JSON.stringify(session.batch.commands[0]!.payload)).not.toContain("M341 background.png");
    const result = await executeApprovedProjectAssetBinding({ session, content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result).toMatchObject({ status: "PASS", projectId, asset: { assetId: descriptor.assetId, role: "background", sceneId: mainSceneId }, projectContentWrite: true, assetBytesPersisted: true, assetTreePreserved: true, noFoundryWrite: true });
    expect(result.afterApply).toMatchObject({ generation: 3, assetCount: 1 });
    expect(result.afterApply.backgroundBindings.find((binding) => binding.sceneId === mainSceneId)?.assetId).toBe(descriptor.assetId);
    expect(result.afterUndo).toMatchObject({ generation: 4, assetCount: 1 });
    expect(result.afterUndo.backgroundBindings).toEqual(result.before.backgroundBindings);
    expect(result.afterUndo.assetCollectionSha256).toBe(result.before.assetCollectionSha256);
    expect(result.history.status).toBe("undone");
    expect(result.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
    expect(store.saveCalls.map((call) => call.expectedGeneration)).toEqual([2, 3]);
  });

  it("registers a new PNG candidate through the same approved binding path and restores only the Scene binding", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const store = new MemoryAssetBindingStore(original, null);
    const session = await approvedSession(proposed, descriptor);
    const result = await executeApprovedProjectAssetBinding({ session, content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result).toMatchObject({ status: "PASS", assetAdded: true, assetBytesPersisted: true, assetTreePreserved: true, sceneContentRestored: true });
    expect(result.before.assetCount).toBe(0);
    expect(result.afterApply.assetCount).toBe(1);
    expect(result.afterApply.backgroundBindings.find((binding) => binding.sceneId === mainSceneId)?.assetId).toBe(descriptor.assetId);
    expect(result.afterUndo.assetCount).toBe(1);
    expect(result.afterUndo.backgroundBindings).toEqual(result.before.backgroundBindings);
    expect(result.afterUndo.assetCollectionSha256).not.toBe(result.before.assetCollectionSha256);
  });

  it("accepts an explicit first-generation missing backup, then requires the post-write backup chain", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const store = new MemoryAssetBindingStore(original, null);
    const originalInspect = store.inspect.bind(store);
    let firstInspection = true;
    store.inspect = async () => {
      const receipt = await originalInspect();
      if (!firstInspection) return receipt;
      firstInspection = false;
      return { ...receipt, backup: { relativePath: receipt.backup.relativePath, status: "MISSING" as const } };
    };
    const session = await approvedSession(proposed, descriptor);
    const result = await executeApprovedProjectAssetBinding({ session, content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result.before.backupByteSha256).toBeNull();
    expect(result.afterApply.backupByteSha256).toBe(result.before.primaryByteSha256);
    expect(result.afterUndo.backupByteSha256).toBe(result.afterApply.primaryByteSha256);
  });

  it("blocks before reread or native write unless the session is approved", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const asset: StoredAsset = { sha256: descriptor.assetSha256, mediaType: "image/png", byteLength: candidate.bytes.length, relativePath: `assets/sha256/${descriptor.assetSha256}`, registration: { assetId: descriptor.assetId, role: "background", label: candidate.label, provenance: candidate.provenance, approval: "approved" } };
    const store = new MemoryAssetBindingStore(original, asset);
    const preview = await createProjectAssetBindingPreview({ projectId, currentGeneration: 2, currentContentSha256: "a".repeat(64), candidate, sceneId: mainSceneId, proposedSceneCount: 2, proposedActiveSceneId: secondSceneId, proposedAssetCount: 1 });
    const batch = await createProjectAssetBindingProposalBatch({ batchId: "dbx:proposal:m341-preview-only", preview, createdAt: new Date(Date.now() - 4000).toISOString() });
    const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date(Date.now() - 3000).toISOString());
    const session = await createDesktopProjectProposalSession({ projectId, batch, history });
    await expect(executeApprovedProjectAssetBinding({ session, content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store })).rejects.toMatchObject({ code: "PROJECT_ASSET_BIND_NOT_APPROVED" });
    expect(store.listCalls).toBe(0);
    expect(store.saveCalls).toHaveLength(0);
  });

  it("rereads once and refuses retry when native binding outcome is unknown", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const asset: StoredAsset = { sha256: descriptor.assetSha256, mediaType: "image/png", byteLength: candidate.bytes.length, relativePath: `assets/sha256/${descriptor.assetSha256}`, registration: { assetId: descriptor.assetId, role: "background", label: candidate.label, provenance: candidate.provenance, approval: "approved" } };
    const store = new MemoryAssetBindingStore(original, asset);
    const failingStore: ProjectAssetBindingStore = { list: () => store.list(), load: () => store.load(), inspect: () => store.inspect(), save: async () => { throw new Error("simulated transport failure"); } };
    await expect(executeApprovedProjectAssetBinding({ session: await approvedSession(proposed, descriptor), content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store: failingStore })).rejects.toMatchObject({ code: "PROJECT_ASSET_BIND_OUTCOME_UNKNOWN" });
    expect(store.listCalls).toBe(2);
    expect(store.loadCalls).toBe(2);
    expect(store.inspectCalls).toBe(2);
  });

  it("rejects a stale exact base before entering applying", async () => {
    const { descriptor, original, proposed } = await fixtureContent();
    const asset: StoredAsset = { sha256: descriptor.assetSha256, mediaType: "image/png", byteLength: candidate.bytes.length, relativePath: `assets/sha256/${descriptor.assetSha256}`, registration: { assetId: descriptor.assetId, role: "background", label: candidate.label, provenance: candidate.provenance, approval: "approved" } };
    const store = new MemoryAssetBindingStore(original, asset);
    store.generation = 3;
    const error = await executeApprovedProjectAssetBinding({ session: await approvedSession(proposed, descriptor), content: proposed, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(ProjectAssetBindingExecutionError);
    expect(error).toMatchObject({ code: "PROJECT_ASSET_BIND_CONFLICT", authoritativeRead: { generation: 3 } });
    expect(store.saveCalls).toHaveLength(0);
  });
});
