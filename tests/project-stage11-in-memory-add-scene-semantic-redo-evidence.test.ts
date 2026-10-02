import { describe, expect, it } from "vitest";
import { approveProposalBatch, previewProposalBatch, redoProposalBatch } from "@dicebox/core";
import { createBlankProjectScene } from "../apps/campaign-helper-desktop/src/project-store";
import { createProjectAddScenePreview, createProjectAddSceneProposalBatch, type ProjectAddSceneState } from "../apps/campaign-helper-desktop/src/project-add-scene-proposal-adapter";
import { createDesktopProjectAddSceneProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { executeCommittedProjectAddScene, inMemoryProjectAddSceneStore, undoCommittedProjectAddScene } from "../apps/campaign-helper-desktop/src/project-add-scene-executor";
import { bridgeProjectAddSceneInMemoryRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history";
import {
  createProjectStage11InMemoryAddSceneSemanticRedoEvidence,
  projectStage11InMemoryAddSceneSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-semantic-redo-evidence";

const projectId = "dbx:project:m906-add-scene";
const observedAt = "2026-09-01T00:00:00.000Z";

function initialState(): ProjectAddSceneState {
  const first = createBlankProjectScene(projectId);
  const second = createBlankProjectScene(projectId, 2);
  return { projectId, scenes: [first, second], activeSceneId: first.id };
}

async function redoReceipt() {
  const state = initialState();
  const preview = await createProjectAddScenePreview(state);
  const batch = await createProjectAddSceneProposalBatch({ batchId: "dbx:proposal:m906-add-scene", preview, createdAt: observedAt });
  const previewed = await previewProposalBatch(batch, { actorId: "human:add-scene", role: "requester" }, observedAt);
  const session = await createDesktopProjectAddSceneProposalSession({ projectId, batch, history: previewed });
  const approved = await approveProposalBatch(session.history, batch, { actorId: "human:reviewer", role: "reviewer" }, { targetId: projectId, revision: 2, sha256: batch.base.sha256 }, observedAt);
  const approvedSession = await createDesktopProjectAddSceneProposalSession({ projectId, batch, history: approved });
  const store = inMemoryProjectAddSceneStore(state);
  const commit = await executeCommittedProjectAddScene({ session: approvedSession, store, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
  const undo = await undoCommittedProjectAddScene({ session: commit.session, store, inverseState: state, executor: { actorId: "system:add-scene", role: "system" }, observedAt });
  const history = await redoProposalBatch(undo.session.history, undo.session.batch, { actorId: "system:add-scene", role: "system" }, { status: "matched", targetId: projectId, revision: commit.afterApply.sceneCount, sha256: commit.afterApply.scenesSha256 }, observedAt);
  return {
    operation: "dicebox.project.add-scene.commit-in-memory.redo",
    status: "PASS",
    projectId,
    batchId: commit.batchId,
    addedSceneId: commit.addedSceneId,
    addedOrdinal: commit.addedOrdinal,
    history,
    authoritativeRereads: { beforeRedo: undo.afterUndo, afterRedo: commit.afterApply },
    matchedReread: { status: "matched", targetId: projectId, revision: commit.afterApply.sceneCount, sha256: commit.afterApply.scenesSha256 },
    projectContentWrite: false,
    projectPersistenceWrite: false,
    sceneContentRestored: false,
    assetsPreserved: true,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

describe("M906 in-memory add-Scene semantic redo evidence", () => {
  it("composes the strict in-memory redo bridge into non-certifying semantic evidence", async () => {
    const result = createProjectStage11InMemoryAddSceneSemanticRedoEvidence(await redoReceipt());
    expect(result).toMatchObject({
      milestone: "M906",
      receipt: "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json",
      operation: "project.add-scene.commit-in-memory.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      revisionAdvanced: true,
      orderedSceneSetPreserved: true,
      sceneAppended: true,
      activeSceneSelected: true,
      nonPersistencePreserved: true,
      assetsPreserved: true,
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
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.sceneIds).toContain(result.sourceReceipt.addedSceneId);
    expect(projectStage11InMemoryAddSceneSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for persistence, Scene-set, matched-reread, and authority drift", async () => {
    const persistenceDrift = await redoReceipt() as any;
    persistenceDrift.projectPersistenceWrite = true;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoEvidence(persistenceDrift)).toThrow(/persistence|false/i);

    const sceneDrift = await redoReceipt() as any;
    sceneDrift.authoritativeRereads.afterRedo.sceneIds = [...sceneDrift.authoritativeRereads.beforeRedo.sceneIds];
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|redo/i);

    const rereadDrift = await redoReceipt() as any;
    rereadDrift.matchedReread.sha256 = "f".repeat(64);
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoEvidence(rereadDrift)).toThrow(/reread|hash/i);

    const authorityDrift = await redoReceipt() as any;
    authorityDrift.noProjectMutation = false;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoEvidence(authorityDrift)).toThrow(/noProjectMutation|true/i);
  });
});
