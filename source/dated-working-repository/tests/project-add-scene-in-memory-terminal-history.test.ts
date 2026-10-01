import { describe, expect, it } from "vitest";
import { approveProposalBatch, previewProposalBatch, redoProposalBatch } from "@dicebox/core";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store";
import { createProjectAddScenePreview, createProjectAddSceneProposalBatch, type ProjectAddSceneState } from "../apps/campaign-helper-desktop/src/project-add-scene-proposal-adapter";
import { createDesktopProjectAddSceneProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { executeCommittedProjectAddScene, inMemoryProjectAddSceneStore, undoCommittedProjectAddScene } from "../apps/campaign-helper-desktop/src/project-add-scene-executor";
import { bridgeProjectAddSceneInMemoryExecutionToTerminalHistory, bridgeProjectAddSceneInMemoryRedoToTerminalHistory, projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema, projectAddSceneInMemoryTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history";

const projectId = "dbx:project:m731-add-scene";
const observedAt = "2026-08-31T00:00:00.000Z";

function initialState(): ProjectAddSceneState {
  const first = createBlankProjectScene(projectId);
  const second = createBlankProjectScene(projectId, 2);
  return { projectId, scenes: [first, second], activeSceneId: first.id };
}

async function receiptPair() {
  const state = initialState();
  const preview = await createProjectAddScenePreview(state);
  const batch = await createProjectAddSceneProposalBatch({ batchId: "dbx:proposal:m731-add-scene", preview, createdAt: observedAt });
  const previewed = await previewProposalBatch(batch, { actorId: "human:add-scene", role: "requester" }, observedAt);
  const session = await createDesktopProjectAddSceneProposalSession({ projectId, batch, history: previewed });
  const approved = await approveProposalBatch(session.history, batch, { actorId: "human:reviewer", role: "reviewer" }, { targetId: projectId, revision: 2, sha256: batch.base.sha256 }, observedAt);
  const approvedSession = await createDesktopProjectAddSceneProposalSession({ projectId, batch, history: approved });
  const store = inMemoryProjectAddSceneStore(state);
  const commit = await executeCommittedProjectAddScene({ session: approvedSession, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
  const undo = await undoCommittedProjectAddScene({ session: commit.session, store, inverseState: state, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
  return { commit, undo };
}

describe("project.add-scene.commit-in-memory terminal-history bridge", () => {
  it("projects the exact paired committed and undone lifecycle", async () => {
    const pair = await receiptPair();
    const result = bridgeProjectAddSceneInMemoryExecutionToTerminalHistory(pair);
    expect(result).toMatchObject({ status: "undone", disposition: "terminal-undone", operation: "dicebox.project.add-scene.commit-in-memory", commandKind: "project.add-scene.commit-in-memory", projectId, targetAuthority: "local-project", applyAuthority: "operation-specific", noGenericExecutor: true, bridgeOnly: true, noExecutionAuthority: true, execution: "not-implemented", readyClaim: false, projectContentWrite: false, projectPersistenceWrite: false, sceneContentRestored: true, assetsPreserved: true, historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] });
    expect(result.authoritativeRereads.afterUndo).toEqual(result.authoritativeRereads.before);
    expect(projectAddSceneInMemoryTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for altered rereads and any claimed write", async () => {
    const pair = await receiptPair();
    const tampered = structuredClone(pair) as unknown as { commit: { afterApply: { noFoundryWrite: boolean } }; undo: { afterUndo: { sceneIds: readonly string[] } } };
    tampered.commit.afterApply.noFoundryWrite = false;
    expect(() => bridgeProjectAddSceneInMemoryExecutionToTerminalHistory(tampered)).toThrow(/Foundry|true/i);
    const altered = structuredClone(pair) as { commit: typeof pair.commit; undo: typeof pair.undo };
    (altered.undo as unknown as { projectPersistenceWrite: boolean }).projectPersistenceWrite = true;
    expect(() => bridgeProjectAddSceneInMemoryExecutionToTerminalHistory(altered)).toThrow(/projectPersistenceWrite|false/i);
  });

  it("projects the exact terminal-redone in-memory Scene lifecycle without persistence authority", async () => {
    const pair = await receiptPair();
    const history = await redoProposalBatch(pair.undo.session.history, pair.undo.session.batch, { actorId: "system:add-scene", role: "system" }, { status: "matched", targetId: projectId, revision: pair.commit.afterApply.sceneCount, sha256: pair.commit.afterApply.scenesSha256 }, observedAt);
    const input = {
      operation: "dicebox.project.add-scene.commit-in-memory.redo",
      status: "PASS",
      projectId,
      batchId: pair.commit.batchId,
      addedSceneId: pair.commit.addedSceneId,
      addedOrdinal: pair.commit.addedOrdinal,
      history,
      authoritativeRereads: { beforeRedo: pair.undo.afterUndo, afterRedo: pair.commit.afterApply },
      matchedReread: { status: "matched", targetId: projectId, revision: pair.commit.afterApply.sceneCount, sha256: pair.commit.afterApply.scenesSha256 },
      projectContentWrite: false,
      projectPersistenceWrite: false,
      sceneContentRestored: false,
      assetsPreserved: true,
      noProjectMutation: true,
      noFoundryWrite: true,
    };
    const result = bridgeProjectAddSceneInMemoryRedoToTerminalHistory(input);
    expect(result).toMatchObject({ status: "redone", disposition: "terminal-redone", operation: "dicebox.project.add-scene.commit-in-memory.redo", commandKind: "project.add-scene.commit-in-memory", projectId, targetAuthority: "local-project", applyAuthority: "operation-specific", noGenericExecutor: true, bridgeOnly: true, noExecutionAuthority: true, authoritativeReread: true, noProjectMutation: true, execution: "not-implemented", readyClaim: false, projectContentWrite: false, projectPersistenceWrite: false, sceneContentRestored: false, assetsPreserved: true, historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] });
    expect(result.authoritativeRereads.afterRedo.sceneIds).toContain(result.addedSceneId);
    expect(projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for in-memory redo persistence, Scene, and matched-reread tampering", async () => {
    const pair = await receiptPair();
    const history = await redoProposalBatch(pair.undo.session.history, pair.undo.session.batch, { actorId: "system:add-scene", role: "system" }, { status: "matched", targetId: projectId, revision: pair.commit.afterApply.sceneCount, sha256: pair.commit.afterApply.scenesSha256 }, observedAt);
    const base = {
      operation: "dicebox.project.add-scene.commit-in-memory.redo",
      status: "PASS",
      projectId,
      batchId: pair.commit.batchId,
      addedSceneId: pair.commit.addedSceneId,
      addedOrdinal: pair.commit.addedOrdinal,
      history,
      authoritativeRereads: { beforeRedo: pair.undo.afterUndo, afterRedo: pair.commit.afterApply },
      matchedReread: { status: "matched", targetId: projectId, revision: pair.commit.afterApply.sceneCount, sha256: pair.commit.afterApply.scenesSha256 },
      projectContentWrite: false,
      projectPersistenceWrite: false,
      sceneContentRestored: false,
      assetsPreserved: true,
      noProjectMutation: true,
      noFoundryWrite: true,
    };
    expect(() => bridgeProjectAddSceneInMemoryRedoToTerminalHistory({ ...base, projectPersistenceWrite: true })).toThrow(/projectPersistenceWrite|false/i);
    const altered = structuredClone(base) as typeof base;
    (altered.authoritativeRereads.afterRedo as unknown as { sceneIds: string[] }).sceneIds = [...pair.undo.afterUndo.sceneIds];
    expect(() => bridgeProjectAddSceneInMemoryRedoToTerminalHistory(altered)).toThrow(/Scene-set|Scene|redo/i);
    expect(() => bridgeProjectAddSceneInMemoryRedoToTerminalHistory({ ...base, matchedReread: { status: "matched", targetId: projectId, revision: pair.commit.afterApply.sceneCount, sha256: "f".repeat(64) } })).toThrow(/reread|hash/i);
  });
});
