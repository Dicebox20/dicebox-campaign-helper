import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  executeApprovedProjectTokenAssetRegistration,
  ProjectTokenAssetRegistrationExecutionError,
  type ProjectTokenAssetRegistrationStore,
} from "../apps/campaign-helper-desktop/src/project-token-asset-executor.js";
import {
  createProjectTokenAssetRegistrationPreview,
  createProjectTokenAssetRegistrationProposalBatch,
  deriveProjectTokenAssetDescriptor,
  projectTokenAssetInputFromCandidate,
  type ProjectTokenAssetCandidate,
  type ProjectTokenAssetContent,
} from "../apps/campaign-helper-desktop/src/project-token-asset-proposal-adapter.js";
import type { ProjectCatalogResponse, ProjectLoadResponse, ProjectRecoveryInspectionReceipt, ProjectSaveReceipt, StoredAsset } from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import type { SceneDocument } from "../packages/dicebox-scene/src/index.js";
import { serializeSceneDocument } from "../packages/dicebox-scene/src/index.js";

const projectId = "dbx:project:m349-token";
const sceneId = "dbx:scene:m349-main";
const candidate: ProjectTokenAssetCandidate = {
  mediaType: "image/png",
  bytes: [137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4],
  label: "M349 token.png",
  provenance: "user-import",
};

const scene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 0,
  id: sceneId,
  name: "M349 Main",
  width: 10,
  height: 10,
  background: { color: 0, gridSize: 1 },
  entities: [],
};

function content(): ProjectTokenAssetContent {
  return { scenes: [scene], activeSceneId: sceneId, candidate };
}

class MemoryTokenStore implements ProjectTokenAssetRegistrationStore {
  generation = 1;
  contentSha256 = "a".repeat(64);
  primaryByteSha256 = "b".repeat(64);
  backupByteSha256: string | null = "c".repeat(64);
  scenes: readonly SceneDocument[] = [scene];
  activeSceneId = sceneId;
  assets: readonly StoredAsset[] = [];
  listCalls = 0;
  loadCalls = 0;
  inspectCalls = 0;
  readonly saveCalls: Array<Readonly<{ expectedGeneration: number; assets: number }>> = [];

  constructor(readonly tokenSha256 = "f".repeat(64)) {}

  list(): Promise<ProjectCatalogResponse> {
    this.listCalls += 1;
    return Promise.resolve({
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", sceneId, sceneName: this.scenes[0]!.name, sceneCount: this.scenes.length, activeSceneId: this.activeSceneId, generation: this.generation, contentSha256: this.contentSha256, assetCount: this.assets.length, recoveredFrom: null, displayName: "M349 Token", lastOpenedSequence: 1, blockerCode: null, workspaceMetadataWarning: null }],
      workspaceIndexGeneration: 1,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  load(): Promise<ProjectLoadResponse> {
    this.loadCalls += 1;
    const scenesJson = this.scenes.map(serializeSceneDocument);
    return Promise.resolve({
      scenesJson,
      activeSceneId: this.activeSceneId,
      assets: this.assets,
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
        generation: this.generation,
        contentSha256: this.contentSha256,
        sceneSha256: "d".repeat(64),
        sceneCount: scenesJson.length,
        activeSceneId: this.activeSceneId,
        scenes: this.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
        assetCount: this.assets.length,
        recoveredFrom: null,
        migrationStatus: "current",
        persistedContentSha256: this.contentSha256,
        noFoundryWrite: true,
      },
    });
  }

  inspect(): Promise<ProjectRecoveryInspectionReceipt> {
    this.inspectCalls += 1;
    return Promise.resolve({
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation: this.generation,
      contentSha256: this.contentSha256,
      activeSceneId: this.activeSceneId,
      scenes: this.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
      primary: { relativePath: "projects/m349-token/project.json", status: "VALID", byteSha256: this.primaryByteSha256 },
      backup: this.backupByteSha256 === null
        ? { relativePath: "projects/m349-token/project.backup.json", status: "MISSING" }
        : { relativePath: "projects/m349-token/project.backup.json", status: "VALID", byteSha256: this.backupByteSha256 },
      registeredAssets: this.assets.filter((asset) => asset.registration).map((asset) => ({ assetId: asset.registration!.assetId, role: asset.registration!.role, sha256: asset.sha256, mediaType: asset.mediaType, byteLength: asset.byteLength, relativePath: asset.relativePath, affectedSceneIds: [], disposition: "PRESENT_VALID", restoreEligible: false })),
      pendingArtifacts: [],
      brokenSceneReferences: [],
      retry: "none",
      restoreEligible: false,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  async save(_id: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number, assets: readonly ReturnType<typeof projectTokenAssetInputFromCandidate>[] = []): Promise<ProjectSaveReceipt> {
    this.saveCalls.push({ expectedGeneration, assets: assets.length });
    if (expectedGeneration !== this.generation) throw new Error("stale project generation");
    this.backupByteSha256 = this.primaryByteSha256;
    this.primaryByteSha256 = (this.generation === 1 ? "d" : "e").repeat(64);
    this.generation += 1;
    this.scenes = scenes;
    this.activeSceneId = activeSceneId;
    this.assets = [...this.assets, ...assets.map((asset) => ({ sha256: this.tokenSha256, mediaType: asset.mediaType, byteLength: asset.bytes.length, relativePath: `assets/sha256/${this.tokenSha256}`, registration: asset.registration }))];
    this.contentSha256 = (this.generation === 2 ? "1" : "2").repeat(64);
    return { operation: "dicebox.project.save", status: "PASS", projectId, generation: this.generation, contentSha256: this.contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })), assetCount: this.assets.length, projectRelativePath: "projects/m349-token/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true };
  }
}

async function approvedSession() {
  const preview = await createProjectTokenAssetRegistrationPreview({ projectId, currentGeneration: 1, currentContentSha256: "a".repeat(64), candidate, proposedSceneCount: 1, proposedActiveSceneId: sceneId, proposedAssetCount: 1 });
  const batch = await createProjectTokenAssetRegistrationProposalBatch({ batchId: "dbx:proposal:m349-token", preview, createdAt: new Date(Date.now() - 3000).toISOString() });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date(Date.now() - 2000).toISOString());
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, batch.base, new Date(Date.now() - 1000).toISOString());
}

describe("approved project.asset.register-token execution adapter", () => {
  it("keeps bytes out of generic history, persists token, rereads, restores Scene content, and preserves the additive asset", async () => {
    const original = content();
    const descriptor = await deriveProjectTokenAssetDescriptor(candidate);
    const store = new MemoryTokenStore(descriptor.assetSha256);
    const session = await approvedSession();
    expect(session.batch.producer.sourceId).toBe("desktop.project.asset.register-token");
    expect(session.batch.commands[0]?.kind).toBe("project.asset.register-token");
    expect(JSON.stringify(session.batch.commands[0]?.payload)).not.toContain("bytes");
    expect(JSON.stringify(session.batch.commands[0]?.payload)).not.toContain(candidate.label);
    const result = await executeApprovedProjectTokenAssetRegistration({ session, content: original, inverseContent: original, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result).toMatchObject({ status: "PASS", projectId, asset: { assetId: descriptor.assetId, role: "token", mediaType: "image/png" }, projectContentWrite: true, assetBytesPersisted: true, assetTreePreserved: true, sceneContentRestored: true, noFoundryWrite: true });
    expect(result.before).toMatchObject({ generation: 1, sceneCount: 1, assetCount: 0 });
    expect(result.afterApply).toMatchObject({ generation: 2, sceneCount: 1, assetCount: 1 });
    expect(result.afterUndo).toMatchObject({ generation: 3, sceneCount: 1, assetCount: 1, sceneContentSha256: result.before.sceneContentSha256 });
    expect(result.afterUndo.assets[0]?.registration?.role).toBe("token");
    expect(result.history.status).toBe("undone");
    expect(result.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
    expect(store.saveCalls.map((call) => call.expectedGeneration)).toEqual([1, 2]);
  });

  it("blocks before reread or native write unless approved", async () => {
    const store = new MemoryTokenStore();
    const preview = await createProjectTokenAssetRegistrationPreview({ projectId, currentGeneration: 1, currentContentSha256: "a".repeat(64), candidate, proposedSceneCount: 1, proposedActiveSceneId: sceneId, proposedAssetCount: 1 });
    const batch = await createProjectTokenAssetRegistrationProposalBatch({ batchId: "dbx:proposal:m349-preview-only", preview, createdAt: new Date().toISOString() });
    const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date().toISOString());
    const session = await createDesktopProjectProposalSession({ projectId, batch, history });
    await expect(executeApprovedProjectTokenAssetRegistration({ session, content: content(), inverseContent: content(), executor: { actorId: "reviewer", role: "reviewer" }, store })).rejects.toMatchObject({ code: "PROJECT_TOKEN_ASSET_NOT_APPROVED" });
    expect(store.listCalls).toBe(0);
    expect(store.saveCalls).toHaveLength(0);
  });

  it("rejects a stale exact base before entering applying", async () => {
    const store = new MemoryTokenStore();
    store.generation = 2;
    const error = await executeApprovedProjectTokenAssetRegistration({ session: await approvedSession(), content: content(), inverseContent: content(), executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(ProjectTokenAssetRegistrationExecutionError);
    expect(error).toMatchObject({ code: "PROJECT_TOKEN_ASSET_CONFLICT", authoritativeRead: { generation: 2 } });
    expect(store.saveCalls).toHaveLength(0);
  });

  it("permits a missing backup only before the first write and attests it after both writes", async () => {
    const descriptor = await deriveProjectTokenAssetDescriptor(candidate);
    const store = new MemoryTokenStore(descriptor.assetSha256);
    store.backupByteSha256 = null;
    const result = await executeApprovedProjectTokenAssetRegistration({ session: await approvedSession(), content: content(), inverseContent: content(), executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(result.before.backupByteSha256).toBeNull();
    expect(result.afterApply.backupByteSha256).toBe(result.before.primaryByteSha256);
    expect(result.afterUndo.backupByteSha256).toBe(result.afterApply.primaryByteSha256);
  });

  it("rejects a candidate whose declared media does not match its image signature", async () => {
    await expect(createProjectTokenAssetRegistrationPreview({ projectId, currentGeneration: 1, currentContentSha256: "a".repeat(64), candidate: { ...candidate, mediaType: "image/webp" }, proposedSceneCount: 1, proposedActiveSceneId: sceneId, proposedAssetCount: 1 })).rejects.toThrow("signature");
  });

  it("rereads once and refuses retry when native registration outcome is unknown", async () => {
    const store = new MemoryTokenStore();
    const failingStore: ProjectTokenAssetRegistrationStore = { list: () => store.list(), load: () => store.load(), inspect: () => store.inspect(), save: async () => { throw new Error("simulated transport failure"); } };
    await expect(executeApprovedProjectTokenAssetRegistration({ session: await approvedSession(), content: content(), inverseContent: content(), executor: { actorId: "reviewer", role: "reviewer" }, store: failingStore })).rejects.toMatchObject({ code: "PROJECT_TOKEN_ASSET_OUTCOME_UNKNOWN" });
    expect(store.listCalls).toBe(2);
    expect(store.loadCalls).toBe(2);
    expect(store.inspectCalls).toBe(2);
  });
});
