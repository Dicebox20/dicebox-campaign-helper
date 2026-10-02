import { describe, expect, it } from "vitest";
import { approveDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import {
  executeApprovedProjectRename,
  ProjectRenameExecutionError,
  type ProjectRenameStore,
} from "../apps/campaign-helper-desktop/src/project-rename-executor.js";
import { createDesktopProjectRenameProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session.js";
import { createProjectRenamePreview, createProjectRenameProposalBatch } from "../apps/campaign-helper-desktop/src/project-rename-proposal-adapter.js";
import type {
  ProjectCatalogResponse,
  ProjectLoadResponse,
  WorkspaceMetadataReceipt,
} from "../apps/campaign-helper-desktop/src/project-store.js";
import { previewProposalBatch } from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m339-rename";
const contentSha256 = "a".repeat(64);
const sceneId = "dbx:scene:m339-rename-main";

function loadResponse(displayName: string, generation: number, workspaceIndexGeneration: number): ProjectLoadResponse {
  return {
    scenesJson: [JSON.stringify({ schemaVersion: "0.1.0", revision: 0, id: sceneId, name: "M339", width: 1, height: 1, background: { color: 0, gridSize: 1 }, entities: [] })],
    activeSceneId: sceneId,
    assets: [],
    receipt: {
      operation: "dicebox.project.load",
      status: "PASS",
      projectId,
      generation,
      contentSha256,
      sceneSha256: "b".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "b".repeat(64) }],
      assetCount: 0,
      recoveredFrom: null,
      migrationStatus: "current",
      persistedContentSha256: contentSha256,
      noFoundryWrite: true,
    },
  };
}

class MemoryRenameStore implements ProjectRenameStore {
  displayName = "Before";
  workspaceIndexGeneration = 9;
  readonly renameCalls: Array<Readonly<{ displayName: string; expectedWorkspaceGeneration: number }>> = [];
  listCalls = 0;
  loadCalls = 0;

  list(): Promise<ProjectCatalogResponse> {
    this.listCalls += 1;
    return Promise.resolve({
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{
        projectId,
        status: "PASS",
        sceneId,
        sceneName: "M339",
        sceneCount: 1,
        activeSceneId: sceneId,
        generation: 1,
        contentSha256,
        assetCount: 0,
        recoveredFrom: null,
        blockerCode: null,
        displayName: this.displayName,
        lastOpenedSequence: 1,
        workspaceMetadataWarning: null,
      }],
      workspaceIndexGeneration: this.workspaceIndexGeneration,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    });
  }

  load(): Promise<ProjectLoadResponse> {
    this.loadCalls += 1;
    return Promise.resolve(loadResponse(this.displayName, 1, this.workspaceIndexGeneration));
  }

  rename(_projectId: string, displayName: string, expectedWorkspaceGeneration: number): Promise<WorkspaceMetadataReceipt> {
    this.renameCalls.push({ displayName, expectedWorkspaceGeneration });
    if (expectedWorkspaceGeneration !== this.workspaceIndexGeneration) return Promise.reject(new Error("stale workspace generation"));
    this.displayName = displayName;
    this.workspaceIndexGeneration += 1;
    return Promise.resolve({
      operation: "dicebox.workspace-metadata.rename",
      status: "PASS",
      projectId,
      displayName,
      lastOpenedSequence: 1,
      indexGeneration: this.workspaceIndexGeneration,
      contentSha256,
      recoveredFrom: null,
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: true,
      noFoundryWrite: true,
    });
  }
}

async function approvedSession() {
  const preview = await createProjectRenamePreview({
    projectId,
    workspaceIndexGeneration: 9,
    currentDisplayName: "Before",
    proposedDisplayName: "After",
    contentSha256,
  });
  const batch = await createProjectRenameProposalBatch({
    batchId: "dbx:proposal:m339-rename",
    preview,
    createdAt: "2026-08-27T22:00:00.000Z",
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-27T22:00:01.000Z");
  const session = await createDesktopProjectRenameProposalSession({ projectId, batch, history });
  return approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, batch.base, "2026-08-27T22:00:02.000Z");
}

describe("approved project.rename execution adapter", () => {
  it("executes, rereads, inversely undoes, and returns the append-only history", async () => {
    const store = new MemoryRenameStore();
    const result = await executeApprovedProjectRename({
      session: await approvedSession(),
      executor: { actorId: "reviewer", role: "reviewer" },
      store,
    });

    expect(result.status).toBe("PASS");
    expect(result.before).toMatchObject({ displayName: "Before", workspaceIndexGeneration: 9, generation: 1, contentSha256 });
    expect(result.afterApply).toMatchObject({ displayName: "After", workspaceIndexGeneration: 10, generation: 1, contentSha256 });
    expect(result.afterUndo).toMatchObject({ displayName: "Before", workspaceIndexGeneration: 11, generation: 1, contentSha256 });
    expect(result.history.status).toBe("undone");
    expect(result.history.receipts.map((receipt) => receipt.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
    expect(store.renameCalls).toEqual([
      { displayName: "After", expectedWorkspaceGeneration: 9 },
      { displayName: "Before", expectedWorkspaceGeneration: 10 },
    ]);
    expect(result.projectContentWrite).toBe(false);
    expect(result.noFoundryWrite).toBe(true);
  });

  it("blocks execution before any reread or native write unless the session is approved", async () => {
    const store = new MemoryRenameStore();
    await expect(executeApprovedProjectRename({
      session: await (async () => {
        const preview = await createProjectRenamePreview({ projectId, workspaceIndexGeneration: 9, currentDisplayName: "Before", proposedDisplayName: "After", contentSha256 });
        const batch = await createProjectRenameProposalBatch({ batchId: "dbx:proposal:m339-preview-only", preview, createdAt: "2026-08-27T22:01:00.000Z" });
        const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-27T22:01:01.000Z");
        return createDesktopProjectRenameProposalSession({ projectId, batch, history });
      })(),
      executor: { actorId: "reviewer", role: "reviewer" },
      store,
    })).rejects.toMatchObject({ code: "PROJECT_RENAME_NOT_APPROVED" });
    expect(store.listCalls).toBe(0);
    expect(store.renameCalls).toHaveLength(0);
  });

  it("rereads once and refuses retry when the native transport outcome is unknown", async () => {
    const store = new MemoryRenameStore();
    const failingStore: ProjectRenameStore = {
      list: () => store.list(),
      load: () => store.load(),
      rename: async () => { throw new Error("simulated transport failure"); },
    };
    await expect(executeApprovedProjectRename({
      session: await approvedSession(),
      executor: { actorId: "reviewer", role: "reviewer" },
      store: failingStore,
    })).rejects.toMatchObject({ code: "PROJECT_RENAME_OUTCOME_UNKNOWN" });
    expect(store.listCalls).toBe(2);
    expect(store.loadCalls).toBe(2);
  });

  it("rejects a stale exact base before entering applying", async () => {
    const store = new MemoryRenameStore();
    store.displayName = "Changed by another writer";
    const error = await executeApprovedProjectRename({
      session: await approvedSession(),
      executor: { actorId: "reviewer", role: "reviewer" },
      store,
    }).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(ProjectRenameExecutionError);
    expect(error).toMatchObject({ code: "PROJECT_RENAME_CONFLICT", authoritativeRead: { displayName: "Changed by another writer" } });
    expect(store.renameCalls).toHaveLength(0);
  });
});
