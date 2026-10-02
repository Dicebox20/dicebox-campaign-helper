import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession, createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  createProjectPersistentAddScenePreview,
  createProjectPersistentAddSceneProposalBatch,
  type ProjectPersistentAddSceneState,
} from "../apps/campaign-helper-desktop/src/project-persistent-add-scene-proposal-adapter.js";
import {
  executeApprovedProjectPersistentAddScene,
  type ProjectPersistentAddSceneStore,
} from "../apps/campaign-helper-desktop/src/project-persistent-add-scene-executor.js";
import type {
  ProjectCatalogResponse,
  ProjectLoadResponse,
  ProjectRecoveryInspectionReceipt,
  ProjectSaveReceipt,
  StoredAsset,
} from "../apps/campaign-helper-desktop/src/project-store.js";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";
import { serializeSceneDocument, type SceneDocument } from "../packages/dicebox-scene/src/index.js";

const projectId = "dbx:project:m351-persistent-add-scene";
const observedAt = "2026-08-28T23:00:00.000Z";
const first = createBlankProjectScene(projectId);
const second = createBlankProjectScene(projectId, 2);
const third = createBlankProjectScene(projectId, 3);
const asset: StoredAsset = {
  sha256: "f".repeat(64),
  mediaType: "image/png",
  byteLength: 8,
  relativePath: "assets/sha256/ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  registration: { assetId: "dbx:asset:m351-existing", role: "background", label: "existing.png", provenance: "user-import", approval: "approved" },
};

function generationHash(generation: number): string {
  return String.fromCharCode(96 + generation).repeat(64);
}

function initialState(): ProjectPersistentAddSceneState {
  return { projectId, generation: 2, contentSha256: "a".repeat(64), scenes: [first, second], activeSceneId: first.id };
}

class MemoryPersistentStore implements ProjectPersistentAddSceneStore {
  generation = 2;
  contentSha256 = "a".repeat(64);
  primaryByteSha256 = "b".repeat(64);
  backupByteSha256 = "c".repeat(64);
  scenes: readonly SceneDocument[] = [first, second];
  activeSceneId = first.id;
  assets: readonly StoredAsset[] = [asset];
  saveCalls: Array<Readonly<{ expectedGeneration: number; scenes: readonly SceneDocument[]; activeSceneId: string }>> = [];
  failuresRemaining = 0;

  list(): Promise<ProjectCatalogResponse> {
    return Promise.resolve({
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{
        projectId,
        status: "PASS",
        sceneId: this.scenes[0]!.id,
        sceneName: this.scenes[0]!.name,
        sceneCount: this.scenes.length,
        activeSceneId: this.activeSceneId,
        generation: this.generation,
        contentSha256: this.contentSha256,
        assetCount: this.assets.length,
        recoveredFrom: null,
        blockerCode: null,
        displayName: "M351 Persistent Add Scene",
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
        scenes: this.scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })),
        assetCount: this.assets.length,
        recoveredFrom: null,
        migrationStatus: "current",
        persistedContentSha256: this.contentSha256,
        noFoundryWrite: true,
      },
    });
  }

  inspect(): Promise<ProjectRecoveryInspectionReceipt> {
    return Promise.resolve({
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId,
      generation: this.generation,
      contentSha256: this.contentSha256,
      activeSceneId: this.activeSceneId,
      scenes: this.scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })),
      primary: { relativePath: "projects/m351/project.json", status: "VALID", byteSha256: this.primaryByteSha256 },
      backup: { relativePath: "projects/m351/project.backup.json", status: "VALID", byteSha256: this.backupByteSha256 },
      registeredAssets: [],
      pendingArtifacts: [],
      brokenSceneReferences: [],
      retry: "none",
      restoreEligible: false,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  async save(_projectId: string, scenes: readonly SceneDocument[], activeSceneId: string, expectedGeneration: number): Promise<ProjectSaveReceipt> {
    this.saveCalls.push({ expectedGeneration, scenes, activeSceneId });
    if (this.failuresRemaining > 0) {
      this.failuresRemaining -= 1;
      throw new Error("fixture transport stopped");
    }
    if (expectedGeneration !== this.generation) throw new Error("stale project generation");
    this.backupByteSha256 = this.primaryByteSha256;
    this.primaryByteSha256 = (this.generation === 2 ? "d" : "e").repeat(64);
    this.generation += 1;
    this.scenes = scenes;
    this.activeSceneId = activeSceneId;
    this.contentSha256 = generationHash(this.generation);
    return {
      operation: "dicebox.project.save",
      status: "PASS",
      projectId,
      generation: this.generation,
      contentSha256: this.contentSha256,
      sceneSha256: "d".repeat(64),
      sceneCount: scenes.length,
      activeSceneId,
      scenes: scenes.map((scene) => ({ sceneId: scene.id, sceneSha256: "d".repeat(64) })),
      assetCount: this.assets.length,
      projectRelativePath: "projects/m351/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    };
  }
}

async function proposalSession(batchId = "dbx:proposal:m351-persistent-add-scene"): Promise<Awaited<ReturnType<typeof createDesktopProjectProposalSession>>> {
  const state = initialState();
  const preview = await createProjectPersistentAddScenePreview({ projectId: state.projectId, currentGeneration: state.generation, currentContentSha256: state.contentSha256, scenes: state.scenes, activeSceneId: state.activeSceneId });
  const batch = await createProjectPersistentAddSceneProposalBatch({ batchId, preview, createdAt: observedAt });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observedAt);
  return createDesktopProjectProposalSession({ projectId, batch, history });
}

async function approvedSession(batchId?: string) {
  const session = await proposalSession(batchId);
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, session.batch.base, observedAt);
}

describe("persistent add-Scene proposal and project-store executor", () => {
  it("creates a deterministic metadata-only approved-bound batch", async () => {
    const state = initialState();
    const previewInput = { projectId: state.projectId, currentGeneration: state.generation, currentContentSha256: state.contentSha256, scenes: state.scenes, activeSceneId: state.activeSceneId };
    const firstPreview = await createProjectPersistentAddScenePreview(previewInput);
    const secondPreview = await createProjectPersistentAddScenePreview(previewInput);
    expect(firstPreview).toEqual(secondPreview);
    const batch = await createProjectPersistentAddSceneProposalBatch({ batchId: "dbx:proposal:m351-metadata", preview: firstPreview, createdAt: observedAt });
    expect(batch).toMatchObject({
      producer: { kind: "project-store", sourceId: "desktop.project.add-scene.persist", provider: null },
      reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
      targetAuthority: { domain: "local-project", requiredActiveGm: false },
      base: { targetId: projectId, revision: 2 },
    });
    expect(batch.commands).toHaveLength(1);
    expect(batch.commands[0]).toMatchObject({ kind: "project.add-scene.persist", dependsOn: [] });
    expect(Object.keys(batch.commands[0]!.payload).sort()).toEqual([
      "addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentContentSha256", "currentSceneCount", "currentSceneIds", "currentScenesSha256", "expectedGeneration", "operation", "previewSha256", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256", "projectId",
    ].sort());
    expect(JSON.stringify(batch)).not.toMatch(/bytes|raw|path|credential|password|secret|Original|Blank Scene/i);
  });

  it("persists one deterministic Scene, rereads, inversely restores, and preserves assets", async () => {
    const store = new MemoryPersistentStore();
    const session = await approvedSession();
    const inverseContent = { scenes: [first, second], activeSceneId: first.id } as const;
    const proposedContent = { scenes: [first, second, third], activeSceneId: third.id } as const;
    const receipt = await executeApprovedProjectPersistentAddScene({ session, content: proposedContent, inverseContent, executor: { actorId: "reviewer", role: "reviewer" }, store });
    expect(receipt).toMatchObject({
      operation: "dicebox.project.add-scene.persist.execute",
      status: "PASS",
      projectId,
      addedSceneId: third.id,
      addedOrdinal: 3,
      projectContentWrite: true,
      projectPersistenceWrite: true,
      sceneContentRestored: true,
      assetsPreserved: true,
      noFoundryWrite: true,
    });
    expect([receipt.before.generation, receipt.afterApply.generation, receipt.afterUndo.generation]).toEqual([2, 3, 4]);
    expect([receipt.before.sceneCount, receipt.afterApply.sceneCount, receipt.afterUndo.sceneCount]).toEqual([2, 3, 2]);
    expect(receipt.afterApply.sceneIds).toEqual([first.id, second.id, third.id]);
    expect(receipt.afterApply.activeSceneId).toBe(third.id);
    expect(receipt.afterUndo.sceneIds).toEqual(receipt.before.sceneIds);
    expect(receipt.afterUndo.activeSceneId).toBe(first.id);
    expect(receipt.afterUndo.scenesSha256).toBe(receipt.before.scenesSha256);
    expect(receipt.afterUndo.assetCollectionSha256).toBe(receipt.before.assetCollectionSha256);
    expect(store.assets).toEqual([asset]);
    expect(store.saveCalls.map((call) => [call.expectedGeneration, call.scenes.length, call.activeSceneId])).toEqual([[2, 3, third.id], [3, 2, first.id]]);
    expect(receipt.history.status).toBe("undone");
    expect(receipt.history.receipts.map((item) => item.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
  });

  it("rejects unapproved and stale or foreign exact-target state before a save", async () => {
    const unapprovedStore = new MemoryPersistentStore();
    const unapproved = await proposalSession("dbx:proposal:m351-unapproved");
    await expect(executeApprovedProjectPersistentAddScene({ session: unapproved, content: { scenes: [first, second, third], activeSceneId: third.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: unapprovedStore })).rejects.toMatchObject({ code: "PROJECT_PERSISTENT_ADD_SCENE_NOT_APPROVED" });
    expect(unapprovedStore.saveCalls).toHaveLength(0);

    const staleStore = new MemoryPersistentStore();
    staleStore.generation = 3;
    staleStore.contentSha256 = "c".repeat(64);
    staleStore.scenes = [first, second, third];
    staleStore.activeSceneId = third.id;
    const approved = await approvedSession("dbx:proposal:m351-stale");
    await expect(executeApprovedProjectPersistentAddScene({ session: approved, content: { scenes: [first, second, third], activeSceneId: third.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: staleStore })).rejects.toMatchObject({ code: "PROJECT_PERSISTENT_ADD_SCENE_CONFLICT" });
    expect(staleStore.saveCalls).toHaveLength(0);
  });

  it("rejects a tampered proposal or wrong deterministic Scene without writing", async () => {
    const session = await approvedSession("dbx:proposal:m351-tampered");
    const tamperedBatch = { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: { ...session.batch.commands[0]!.payload, proposedSceneCount: 4 } }] };
    const store = new MemoryPersistentStore();
    await expect(executeApprovedProjectPersistentAddScene({ session: { ...session, batch: tamperedBatch }, content: { scenes: [first, second, third], activeSceneId: third.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: { actorId: "reviewer", role: "reviewer" }, store })).rejects.toThrow();
    expect(store.saveCalls).toHaveLength(0);

    const wrongSceneStore = new MemoryPersistentStore();
    const wrongThird = { ...third, name: "Foreign Scene" };
    await expect(executeApprovedProjectPersistentAddScene({ session, content: { scenes: [first, second, wrongThird], activeSceneId: wrongThird.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: { actorId: "reviewer", role: "reviewer" }, store: wrongSceneStore })).rejects.toMatchObject({ code: "PROJECT_PERSISTENT_ADD_SCENE_CONFLICT" });
    expect(wrongSceneStore.saveCalls).toHaveLength(0);
  });

  it("marks a save transport failure outcome-unknown and never retries", async () => {
    const store = new MemoryPersistentStore();
    store.failuresRemaining = 1;
    const session = await approvedSession("dbx:proposal:m351-outcome-unknown");
    const error = await executeApprovedProjectPersistentAddScene({ session, content: { scenes: [first, second, third], activeSceneId: third.id }, inverseContent: { scenes: [first, second], activeSceneId: first.id }, executor: { actorId: "reviewer", role: "reviewer" }, store }).catch((value: unknown) => value);
    expect(error).toMatchObject({ code: "PROJECT_PERSISTENT_ADD_SCENE_OUTCOME_UNKNOWN", session: { history: { status: "unknown-outcome" } } });
    expect(store.saveCalls).toHaveLength(1);
  });
});
