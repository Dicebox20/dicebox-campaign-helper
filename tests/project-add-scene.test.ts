import { describe, expect, it } from "vitest";
import { previewProposalBatch, validateProposalBatch } from "@dicebox/core";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store";
import {
  createProjectAddScenePreview,
  createProjectAddSceneProposalBatch,
  hashProjectAddSceneBase,
  type ProjectAddSceneState,
} from "../apps/campaign-helper-desktop/src/project-add-scene-proposal-adapter";
import { createDesktopProjectAddSceneProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import {
  executeProjectAddScene,
  executeCommittedProjectAddScene,
  inMemoryProjectAddSceneStore,
  ProjectAddSceneExecutionError,
  undoCommittedProjectAddScene,
  type ProjectAddSceneStore,
} from "../apps/campaign-helper-desktop/src/project-add-scene-executor";

const projectId = "dbx:project:add-scene-proposal";
const observedAt = "2026-08-28T22:00:00.000Z";

function initialState(): ProjectAddSceneState {
  const first = createBlankProjectScene(projectId);
  const second = createBlankProjectScene(projectId, 2);
  return { projectId, scenes: [first, second], activeSceneId: first.id };
}

async function sessionFor(state: ProjectAddSceneState, batchId = "dbx:proposal:add-scene"): Promise<Awaited<ReturnType<typeof createDesktopProjectAddSceneProposalSession>>> {
  const preview = await createProjectAddScenePreview(state);
  const batch = await createProjectAddSceneProposalBatch({ batchId, preview, createdAt: observedAt });
  const history = await previewProposalBatch(batch, { actorId: "human:add-scene", role: "requester" }, observedAt);
  return createDesktopProjectAddSceneProposalSession({ projectId, batch, history });
}

describe("project add-Scene proposal and in-memory executor", () => {
  it("creates a deterministic metadata-only human/no-provider batch", async () => {
    const state = initialState();
    const firstPreview = await createProjectAddScenePreview(state);
    const secondPreview = await createProjectAddScenePreview(state);
    expect(firstPreview).toEqual(secondPreview);
    const batch = await createProjectAddSceneProposalBatch({ batchId: "dbx:proposal:add-scene-metadata", preview: firstPreview, createdAt: observedAt });
    await expect(validateProposalBatch(batch)).resolves.toEqual(batch);
    expect(batch).toMatchObject({
      producer: { kind: "human", sourceId: "desktop.project.add-scene", provider: null },
      reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
      targetAuthority: { domain: "local-project", requiredActiveGm: false },
      risk: "medium",
      base: { targetId: projectId, revision: 2 },
    });
    expect(batch.commands).toHaveLength(1);
    expect(batch.commands[0]).toMatchObject({ kind: "project.add-scene", dependsOn: [] });
    expect(Object.keys(batch.commands[0]?.payload ?? {}).sort()).toEqual([
      "addedOrdinal", "addedSceneId", "currentActiveSceneId", "currentSceneCount", "currentSceneIds", "currentScenesSha256",
      "operation", "previewSha256", "projectId", "proposedActiveSceneId", "proposedSceneCount", "proposedSceneIds", "proposedScenesSha256",
    ]);
    expect(JSON.stringify(batch)).not.toMatch(/bytes|rawBytes|path|credential|password|secret|approved|execute|execution/i);
  });

  it("requires approval, applies exactly one deterministic blank Scene, rereads, and inversely restores memory", async () => {
    const state = initialState();
    const session = await sessionFor(state);
    const store = inMemoryProjectAddSceneStore(state);
    const approvedHistory = await import("@dicebox/core").then(({ approveProposalBatch }) => approveProposalBatch(
      session.history,
      session.batch,
      { actorId: "human:reviewer", role: "reviewer" },
      { targetId: session.batch.base.targetId, revision: session.batch.base.revision, sha256: session.batch.base.sha256 },
      observedAt,
    ));
    const approvedSession = await createDesktopProjectAddSceneProposalSession({ projectId, batch: session.batch, history: approvedHistory });
    const receipt = await executeProjectAddScene({ session: approvedSession, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
    expect(receipt).toMatchObject({
      operation: "dicebox.project.add-scene.execute",
      status: "PASS",
      projectId,
      addedSceneId: createBlankProjectScene(projectId, 3).id,
      addedOrdinal: 3,
      projectContentWrite: false,
      projectPersistenceWrite: false,
      noFoundryWrite: true,
    });
    expect(receipt.before.sceneIds).toEqual([createBlankProjectScene(projectId).id, createBlankProjectScene(projectId, 2).id]);
    expect(receipt.afterApply.sceneIds).toEqual([...receipt.before.sceneIds, receipt.addedSceneId]);
    expect(receipt.afterApply.activeSceneId).toBe(receipt.addedSceneId);
    expect(receipt.afterUndo).toEqual(receipt.before);
    expect(receipt.history.status).toBe("undone");
    expect(receipt.history.receipts.map((item) => item.transition)).toEqual(["preview", "approve", "begin-apply", "commit-after-reread", "undo"]);
    expect(await hashProjectAddSceneBase(await store.read(projectId))).toBe(session.batch.base.sha256);
  });

  it("keeps the editor-facing in-memory add committed until an explicit later undo", async () => {
    const state = initialState();
    const session = await sessionFor(state, "dbx:proposal:add-scene-committed");
    const { approveProposalBatch } = await import("@dicebox/core");
    const history = await approveProposalBatch(session.history, session.batch, { actorId: "human:reviewer", role: "reviewer" }, { targetId: session.batch.base.targetId, revision: session.batch.base.revision, sha256: session.batch.base.sha256 }, observedAt);
    const approvedSession = await createDesktopProjectAddSceneProposalSession({ projectId, batch: session.batch, history });
    const store = inMemoryProjectAddSceneStore(state);
    const committed = await executeCommittedProjectAddScene({ session: approvedSession, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
    expect(committed).toMatchObject({ operation: "dicebox.project.add-scene.commit-in-memory", status: "PASS", projectId, projectContentWrite: false, projectPersistenceWrite: false, noFoundryWrite: true });
    expect(committed.session.history.status).toBe("committed");
    expect((await store.read(projectId)).scenes.map((scene) => scene.id)).toEqual(committed.afterApply.sceneIds);
    const undone = await undoCommittedProjectAddScene({ session: committed.session, store, inverseState: state, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
    expect(undone).toMatchObject({ operation: "dicebox.project.add-scene.undo-in-memory", status: "PASS", projectId, projectContentWrite: false, projectPersistenceWrite: false, noFoundryWrite: true });
    expect(undone.session.history.status).toBe("undone");
    expect(undone.afterUndo.sceneIds).toEqual(state.scenes.map((scene) => scene.id));
    expect((await store.read(projectId)).activeSceneId).toBe(state.activeSceneId);
  });

  it("blocks unapproved and stale sessions before the in-memory write", async () => {
    const state = initialState();
    const session = await sessionFor(state, "dbx:proposal:add-scene-guards");
    const replacements: ProjectAddSceneState[] = [];
    const store: ProjectAddSceneStore = {
      read: async () => state,
      replace: async (_projectId, next) => { replacements.push(next); },
    };
    await expect(executeProjectAddScene({ session, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt })).rejects.toMatchObject({ code: "PROJECT_ADD_SCENE_NOT_APPROVED" });
    expect(replacements).toHaveLength(0);

    const approvedHistory = await import("@dicebox/core").then(({ approveProposalBatch }) => approveProposalBatch(
      session.history,
      session.batch,
      { actorId: "human:reviewer", role: "reviewer" },
      { targetId: session.batch.base.targetId, revision: session.batch.base.revision, sha256: "b".repeat(64) },
      observedAt,
    ).catch((error) => error));
    expect(approvedHistory).toBeInstanceOf(Error);
  });

  it("marks an in-memory transport failure outcome-unknown and never retries", async () => {
    const state = initialState();
    const session = await sessionFor(state, "dbx:proposal:add-scene-unknown");
    const { approveProposalBatch } = await import("@dicebox/core");
    const history = await approveProposalBatch(session.history, session.batch, { actorId: "human:reviewer", role: "reviewer" }, { targetId: session.batch.base.targetId, revision: session.batch.base.revision, sha256: session.batch.base.sha256 }, observedAt);
    const approvedSession = await createDesktopProjectAddSceneProposalSession({ projectId, batch: session.batch, history });
    let replaceCount = 0;
    const store: ProjectAddSceneStore = {
      read: async () => state,
      replace: async () => { replaceCount += 1; throw new Error("fixture transport stopped"); },
    };
    await expect(executeProjectAddScene({ session: approvedSession, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt })).rejects.toMatchObject({ code: "PROJECT_ADD_SCENE_OUTCOME_UNKNOWN" });
    expect(replaceCount).toBe(1);
    expect(replaceCount).toBe(1);
  });
});
