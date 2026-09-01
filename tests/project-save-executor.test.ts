import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  executeApprovedProjectSave,
  ProjectSaveExecutionError,
  type ProjectSaveStore,
} from "../apps/campaign-helper-desktop/src/project-save-executor.js";
import {
  createProjectSavePreview,
  createProjectSaveProposalBatch,
  hashProjectSaveContent,
  type ProjectSaveContent,
} from "../apps/campaign-helper-desktop/src/project-save-proposal-adapter.js";
import type {
  ProjectCatalogResponse,
  ProjectLoadResponse,
  ProjectRecoveryInspectionReceipt,
  ProjectSaveReceipt,
} from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import type { SceneDocument } from "../packages/dicebox-scene/src/index.js";
import { serializeSceneDocument } from "../packages/dicebox-scene/src/index.js";

const projectId = "dbx:project:m340-save";
const firstSceneId = "dbx:scene:m340-main";
const secondSceneId = "dbx:scene:m340-secondary";

function scene(id: string, name: string): SceneDocument {
  return {
    schemaVersion: "0.1.0",
    revision: 0,
    id,
    name,
    width: 10,
    height: 10,
    background: { color: 0, gridSize: 1 },
    entities: [],
  };
}

const originalContent: ProjectSaveContent = {
  scenes: [scene(firstSceneId, "Original Main"), scene(secondSceneId, "Original Secondary")],
  activeSceneId: secondSceneId,
  assets: [],
};
const proposedContent: ProjectSaveContent = {
  scenes: [scene(firstSceneId, "Edited Main"), scene(secondSceneId, "Edited Secondary")],
  activeSceneId: firstSceneId,
  assets: [],
};

function hashForGeneration(generation: number): string {
  return String.fromCharCode(96 + generation).repeat(64);
}

function loadResponse(content: ProjectSaveContent, generation: number, contentSha256: string): ProjectLoadResponse {
  const scenesJson = content.scenes.map(serializeSceneDocument);
  return {
    scenesJson,
    activeSceneId: content.activeSceneId,
    assets: [],
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
      assetCount: 0,
      recoveredFrom: null,
      migrationStatus: "current",
      persistedContentSha256: contentSha256,
      noFoundryWrite: true,
    },
  };
}

function recoveryResponse(content: ProjectSaveContent, generation: number, contentSha256: string, primaryByteSha256: string, backupByteSha256: string): ProjectRecoveryInspectionReceipt {
  return {
    operation: "dicebox.project.recovery.inspect",
    status: "PASS",
    projectId,
    generation,
    contentSha256,
    activeSceneId: content.activeSceneId,
    scenes: content.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
    primary: { relativePath: `projects/m340/project.json`, status: "VALID", byteSha256: primaryByteSha256 },
    backup: { relativePath: `projects/m340/project.backup.json`, status: "VALID", byteSha256: backupByteSha256 },
    registeredAssets: [],
    pendingArtifacts: [],
    brokenSceneReferences: [],
    retry: "none",
    restoreEligible: false,
    noWrite: true,
    noFoundryWrite: true,
  };
}

class MemorySaveStore implements ProjectSaveStore {
  generation = 2;
  content = originalContent;
  contentSha256 = "a".repeat(64);
  primaryByteSha256 = "b".repeat(64);
  backupByteSha256 = "c".repeat(64);
  listCalls = 0;
  loadCalls = 0;
  inspectCalls = 0;
  readonly saveCalls: Array<Readonly<{ expectedGeneration: number; content: ProjectSaveContent }>> = [];

  list(): Promise<ProjectCatalogResponse> {
    this.listCalls += 1;
    return Promise.resolve({
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{
        projectId,
        status: "PASS",
        sceneId: this.content.scenes[0]!.id,
        sceneName: this.content.scenes[0]!.name,
        sceneCount: this.content.scenes.length,
        activeSceneId: this.content.activeSceneId,
        generation: this.generation,
        contentSha256: this.contentSha256,
        assetCount: 0,
        recoveredFrom: null,
        blockerCode: null,
        displayName: "M340 Save",
        lastOpenedSequence: 1,
        workspaceMetadataWarning: null,
      }],
      workspaceIndexGeneration: 4,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  load(): Promise<ProjectLoadResponse> {
    this.loadCalls += 1;
    return Promise.resolve(loadResponse(this.content, this.generation, this.contentSha256));
  }

  inspect(): Promise<ProjectRecoveryInspectionReceipt> {
    this.inspectCalls += 1;
    return Promise.resolve(recoveryResponse(this.content, this.generation, this.contentSha256, this.primaryByteSha256, this.backupByteSha256));
  }

  async save(_projectId: string, content: ProjectSaveContent, expectedGeneration: number): Promise<ProjectSaveReceipt> {
    this.saveCalls.push({ expectedGeneration, content });
    if (expectedGeneration !== this.generation) throw new Error("stale project generation");
    this.backupByteSha256 = this.primaryByteSha256;
    this.primaryByteSha256 = (this.generation === 2 ? "d" : "e").repeat(64);
    this.generation += 1;
    this.content = content;
    this.contentSha256 = hashForGeneration(this.generation);
    return {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: this.generation,
      contentSha256: this.contentSha256,
      sceneSha256: "d".repeat(64),
      sceneCount: content.scenes.length,
      activeSceneId: content.activeSceneId,
      scenes: content.scenes.map((current) => ({ sceneId: current.id, sceneSha256: "d".repeat(64) })),
      assetCount: 0,
      projectRelativePath: "projects/m340/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    };
  }
}

async function approvedSession() {
  const currentContentSha256 = "a".repeat(64);
  const contentDescriptorSha256 = await hashProjectSaveContent(proposedContent);
  const now = Date.now();
  const preview = await createProjectSavePreview({
    projectId,
    currentGeneration: 2,
    currentContentSha256,
    contentDescriptorSha256,
    proposedSceneCount: 2,
    proposedActiveSceneId: firstSceneId,
    proposedAssetCount: 0,
  });
  const batch = await createProjectSaveProposalBatch({ batchId: "dbx:proposal:m340-save", preview, createdAt: new Date(now - 4000).toISOString() });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date(now - 3000).toISOString());
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, batch.base, new Date(now - 2000).toISOString());
}

describe("approved project.save execution adapter", () => {
  it("executes, rereads, inversely restores, and records the semantic lifecycle", async () => {
    const store = new MemorySaveStore();
    const session = await approvedSession();
    expect(Object.keys(session.batch.commands[0]!.payload).sort()).toEqual([
      "contentDescriptorSha256",
      "currentContentSha256",
      "expectedGeneration",
      "operation",
      "projectId",
      "proposedActiveSceneId",
      "proposedAssetCount",
      "proposedSceneCount",
    ]);
    expect(JSON.stringify(session.batch.commands[0]!.payload)).not.toContain("Edited Main");
    const result = await executeApprovedProjectSave({
      session,
      content: proposedContent,
      inverseContent: originalContent,
      executor: { actorId: "reviewer", role: "reviewer" },
      store,
    });

    expect(result.status).toBe("PASS");
    expect(result.before).toMatchObject({ generation: 2, sceneCount: 2, activeSceneId: secondSceneId });
    expect(result.afterApply).toMatchObject({ generation: 3, sceneCount: 2, activeSceneId: firstSceneId });
    expect(result.afterUndo).toMatchObject({ generation: 4, sceneCount: 2, activeSceneId: secondSceneId, semanticContentSha256: result.before.semanticContentSha256 });
    expect(result.history.status).toBe("undone");
    expect(result.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
    expect(store.saveCalls.map((call) => call.expectedGeneration)).toEqual([2, 3]);
    expect(result.save.atomicReplace).toBe(true);
    expect(result.inverseRestore.directoryEntrySync).toBe(true);
    expect(result.projectContentWrite).toBe(true);
    expect(result.noFoundryWrite).toBe(true);
  });

  it("blocks before reread or native write unless the session is approved", async () => {
    const store = new MemorySaveStore();
    const now = Date.now();
    const preview = await createProjectSavePreview({
      projectId,
      currentGeneration: 2,
      currentContentSha256: "a".repeat(64),
      contentDescriptorSha256: await hashProjectSaveContent(proposedContent),
      proposedSceneCount: 2,
      proposedActiveSceneId: firstSceneId,
      proposedAssetCount: 0,
    });
    const batch = await createProjectSaveProposalBatch({ batchId: "dbx:proposal:m340-preview-only", preview, createdAt: new Date(now - 4000).toISOString() });
    const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, new Date(now - 3000).toISOString());
    const session = await createDesktopProjectProposalSession({ projectId, batch, history });
    await expect(executeApprovedProjectSave({ session, content: proposedContent, inverseContent: originalContent, executor: { actorId: "reviewer", role: "reviewer" }, store })).rejects.toMatchObject({ code: "PROJECT_SAVE_NOT_APPROVED" });
    expect(store.listCalls).toBe(0);
    expect(store.saveCalls).toHaveLength(0);
  });

  it("rereads once and refuses retry when the native save outcome is unknown", async () => {
    const store = new MemorySaveStore();
    const failingStore: ProjectSaveStore = {
      list: () => store.list(),
      load: () => store.load(),
      inspect: () => store.inspect(),
      save: async () => { throw new Error("simulated transport failure"); },
    };
    await expect(executeApprovedProjectSave({ session: await approvedSession(), content: proposedContent, inverseContent: originalContent, executor: { actorId: "reviewer", role: "reviewer" }, store: failingStore })).rejects.toMatchObject({ code: "PROJECT_SAVE_OUTCOME_UNKNOWN" });
    expect(store.listCalls).toBe(2);
    expect(store.loadCalls).toBe(2);
    expect(store.inspectCalls).toBe(2);
  });

  it("rejects a stale exact base before entering applying", async () => {
    const store = new MemorySaveStore();
    store.generation = 3;
    const error = await executeApprovedProjectSave({ session: await approvedSession(), content: proposedContent, inverseContent: originalContent, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(ProjectSaveExecutionError);
    expect(error).toMatchObject({ code: "PROJECT_SAVE_CONFLICT", authoritativeRead: { generation: 3 } });
    expect(store.saveCalls).toHaveLength(0);
  });
});
