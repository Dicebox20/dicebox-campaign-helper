import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createProjectCreatePreview, createProjectCreateProposalBatch } from "../apps/campaign-helper-desktop/src/project-create-proposal-adapter.js";
import { executeApprovedProjectCreate, type ProjectCreateStore } from "../apps/campaign-helper-desktop/src/project-create-executor.js";
import type { ProjectCatalogResponse, ProjectLoadResponse, ProjectRecoveryInspectionReceipt, ProjectSaveReceipt } from "../apps/campaign-helper-desktop/src/project-store.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import { serializeSceneDocument, type SceneDocument } from "../packages/dicebox-scene/src/index.js";

const targetProjectId = "dbx:project:m355-create";
const first = createBlankProjectScene(targetProjectId);
const second = createBlankProjectScene(targetProjectId, 2);
const observedAt = "2026-08-28T23:45:00.000Z";

class MemoryCreateStore implements ProjectCreateStore {
  workspaceIndexGeneration = 4;
  target: Readonly<{ generation: number; contentSha256: string; scenes: readonly SceneDocument[]; activeSceneId: string; displayName: string }> | null = null;
  createCalls: Array<Readonly<{ projectId: string; expectedWorkspaceGeneration: number; displayName: string; scenes: readonly SceneDocument[] }>> = [];
  failuresRemaining = 0;
  workspaceMetadataFailure = false;

  private targetEntry() {
    if (!this.target) return null;
    return { projectId: targetProjectId, status: "PASS" as const, sceneId: this.target.scenes[0]!.id, sceneName: this.target.scenes[0]!.name, sceneCount: this.target.scenes.length, activeSceneId: this.target.activeSceneId, generation: this.target.generation, contentSha256: this.target.contentSha256, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: this.target.displayName, lastOpenedSequence: 1, workspaceMetadataWarning: null };
  }

  list(): Promise<ProjectCatalogResponse> {
    const targetEntry = this.targetEntry();
    return Promise.resolve({ operation: "dicebox.project.catalog", status: "PASS", entries: targetEntry ? [targetEntry] : [], workspaceIndexGeneration: this.workspaceIndexGeneration, workspaceMetadataWarning: null, noWrite: true, noFoundryWrite: true });
  }

  load(projectId: string): Promise<ProjectLoadResponse> {
    if (projectId !== targetProjectId || !this.target) return Promise.reject(new Error("missing exact project"));
    const scenesJson = this.target.scenes.map(serializeSceneDocument);
    return Promise.resolve({ scenesJson, activeSceneId: this.target.activeSceneId, assets: [], receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation: this.target.generation, contentSha256: this.target.contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenesJson.length, activeSceneId: this.target.activeSceneId, scenes: this.target.scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), assetCount: 0, recoveredFrom: null, migrationStatus: "current", persistedContentSha256: this.target.contentSha256, noFoundryWrite: true } });
  }

  inspect(projectId: string): Promise<ProjectRecoveryInspectionReceipt> {
    if (projectId !== targetProjectId || !this.target) return Promise.reject(new Error("missing exact project recovery state"));
    return Promise.resolve({ operation: "dicebox.project.recovery.inspect", status: "PASS", projectId, generation: this.target.generation, contentSha256: this.target.contentSha256, activeSceneId: this.target.activeSceneId, scenes: this.target.scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), primary: { relativePath: "projects/m355-create/project.json", status: "VALID", byteSha256: "e".repeat(64) }, backup: { relativePath: "projects/m355-create/project.backup.json", status: "MISSING" }, registeredAssets: [], pendingArtifacts: [], brokenSceneReferences: [], retry: "none", restoreEligible: false, noWrite: true, noFoundryWrite: true });
  }

  async create(projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<ProjectSaveReceipt> {
    this.createCalls.push({ projectId, expectedWorkspaceGeneration, displayName, scenes });
    if (this.failuresRemaining > 0) {
      this.failuresRemaining -= 1;
      throw new Error("fixture create transport stopped");
    }
    if (projectId !== targetProjectId || expectedWorkspaceGeneration !== this.workspaceIndexGeneration || this.target) throw new Error("create target or workspace conflict");
    this.target = { generation: 1, contentSha256: "f".repeat(64), scenes, activeSceneId, displayName };
    this.workspaceIndexGeneration += 1;
    const workspaceMetadata = { operation: "dicebox.workspace-metadata.touch" as const, status: "PASS" as const, projectId, displayName, lastOpenedSequence: 1, indexGeneration: this.workspaceIndexGeneration, contentSha256: this.target.contentSha256, recoveredFrom: null, atomicReplace: true as const, directoryEntrySync: true as const, backupPreserved: false, noFoundryWrite: true as const };
    return { operation: "dicebox.project.create", status: "PASS", projectId, generation: 1, contentSha256: this.target.contentSha256, sceneSha256: "d".repeat(64), sceneCount: scenes.length, activeSceneId, scenes: scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })), assetCount: 0, projectRelativePath: "projects/m355-create/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: false, noFoundryWrite: true, ...(this.workspaceMetadataFailure ? { workspaceMetadataWarning: "STALE_WORKSPACE_INDEX_GENERATION" } : { workspaceMetadata }) };
  }
}

async function proposalSession(store: MemoryCreateStore, batchId = "dbx:proposal:m355-create") {
  const preview = await createProjectCreatePreview({ targetProjectId, workspaceIndexGeneration: store.workspaceIndexGeneration, scenes: [first, second], activeSceneId: second.id, proposedDisplayName: "M355 Create" });
  const batch = await createProjectCreateProposalBatch({ batchId, preview, createdAt: observedAt });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observedAt);
  return createDesktopProjectProposalSession({ projectId: targetProjectId, batch, history });
}

async function approvedSession(store: MemoryCreateStore, batchId = "dbx:proposal:m355-create") {
  const session = await proposalSession(store, batchId);
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, session.batch.base, observedAt);
}

describe("project create proposal and exact first-generation executor", () => {
  it("creates a deterministic metadata-only target-absent batch", async () => {
    const store = new MemoryCreateStore();
    const preview = await createProjectCreatePreview({ targetProjectId, workspaceIndexGeneration: store.workspaceIndexGeneration, scenes: [first, second], activeSceneId: second.id, proposedDisplayName: "M355 Create" });
    const batch = await createProjectCreateProposalBatch({ batchId: "dbx:proposal:m355-metadata", preview, createdAt: observedAt });
    expect(batch).toMatchObject({ producer: { kind: "project-store", sourceId: "desktop.project.create", provider: null }, base: { targetId: targetProjectId, revision: 0 }, commands: [{ kind: "project.create" }] });
    expect(Object.keys(batch.commands[0]!.payload).sort()).toEqual(["operation", "targetProjectId", "workspaceIndexGeneration", "sceneIds", "scenesSha256", "activeSceneId", "sceneCount", "proposedDisplayName", "targetAbsent", "previewSha256"].sort());
    expect(JSON.stringify(batch)).not.toMatch(/raw|bytes|path|credential|password|secret/i);
  });

  it("creates a fresh first-generation target, rereads it, and commits history", async () => {
    const store = new MemoryCreateStore();
    const receipt = await executeApprovedProjectCreate({ session: await approvedSession(store), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(receipt).toMatchObject({ operation: "dicebox.project.create.execute", status: "PASS", targetProjectId, projectContentWrite: true, projectPersistenceWrite: true, targetCreated: true, firstGenerationBackupMissing: true, noFoundryWrite: true });
    expect(receipt.before.targetAbsent).toBe(true);
    expect(receipt.afterApply.targetAbsent).toBe(false);
    expect(receipt.afterApply.target?.generation).toBe(1);
    expect(receipt.afterApply.target?.sceneIds).toEqual([first.id, second.id]);
    expect(receipt.afterApply.target?.activeSceneId).toBe(second.id);
    expect(receipt.afterApply.target?.recovery.backup.status).toBe("MISSING");
    expect(receipt.create.workspaceMetadata?.displayName).toBe("M355 Create");
    expect(receipt.history.status).toBe("committed");
    expect(receipt.history.receipts.map((item) => item.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread"]);
    expect(store.createCalls).toHaveLength(1);
  });

  it("rejects an unapproved session and a colliding target before create", async () => {
    const unapprovedStore = new MemoryCreateStore();
    await expect(executeApprovedProjectCreate({ session: await proposalSession(unapprovedStore, "dbx:proposal:m355-unapproved"), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: unapprovedStore })).rejects.toMatchObject({ code: "PROJECT_CREATE_NOT_APPROVED" });
    expect(unapprovedStore.createCalls).toHaveLength(0);

    const collidingStore = new MemoryCreateStore();
    collidingStore.target = { generation: 1, contentSha256: "f".repeat(64), scenes: [first, second], activeSceneId: second.id, displayName: "Existing" };
    await expect(executeApprovedProjectCreate({ session: await approvedSession(collidingStore), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: collidingStore })).rejects.toMatchObject({ code: "PROJECT_CREATE_CONFLICT" });
    expect(collidingStore.createCalls).toHaveLength(0);
  });

  it("rejects workspace drift or foreign Scene content before create", async () => {
    const staleStore = new MemoryCreateStore();
    const staleSession = await approvedSession(staleStore, "dbx:proposal:m355-stale");
    staleStore.workspaceIndexGeneration += 1;
    await expect(executeApprovedProjectCreate({ session: staleSession, content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: staleStore })).rejects.toMatchObject({ code: "PROJECT_CREATE_CONFLICT" });
    expect(staleStore.createCalls).toHaveLength(0);

    const foreignStore = new MemoryCreateStore();
    const foreign = { ...second, name: "Foreign" };
    await expect(executeApprovedProjectCreate({ session: await approvedSession(foreignStore, "dbx:proposal:m355-foreign"), content: { scenes: [first, foreign], activeSceneId: foreign.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: foreignStore })).rejects.toMatchObject({ code: "PROJECT_CREATE_CONFLICT" });
    expect(foreignStore.createCalls).toHaveLength(0);
  });

  it("marks create transport uncertainty and never retries", async () => {
    const store = new MemoryCreateStore();
    store.failuresRemaining = 1;
    const error = await executeApprovedProjectCreate({ session: await approvedSession(store), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toMatchObject({ code: "PROJECT_CREATE_OUTCOME_UNKNOWN", session: { history: { status: "unknown-outcome" } } });
    expect(store.createCalls).toHaveLength(1);
  });

  it("marks incomplete post-write metadata as outcome-unknown and does not clean up", async () => {
    const store = new MemoryCreateStore();
    store.workspaceMetadataFailure = true;
    const error = await executeApprovedProjectCreate({ session: await approvedSession(store), content: { scenes: [first, second], activeSceneId: second.id }, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toMatchObject({ code: "PROJECT_CREATE_OUTCOME_UNKNOWN", session: { history: { status: "unknown-outcome" } } });
    expect(store.target).not.toBeNull();
    expect(store.createCalls).toHaveLength(1);
  });
});
