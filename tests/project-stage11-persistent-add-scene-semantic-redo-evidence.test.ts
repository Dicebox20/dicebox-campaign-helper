import { describe, expect, it } from "vitest";
import {
  createProjectStage11PersistentAddSceneSemanticRedoEvidence,
  projectStage11PersistentAddSceneSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-semantic-redo-evidence.js";
import { bridgeProjectPersistentAddSceneRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-add-scene-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m912-add-scene";
const batchId = "dbx:proposal:m912-add-scene";
const commandId = "dbx:proposal-command:m912-add-scene";
const originalSceneId = "dbx:scene:m912-original";
const addedSceneId = "dbx:scene:m912-added";
const observed = (second: number) => `2026-09-01T23:30:${String(second).padStart(2, "0")}.000Z`;

function projectRead(generation: number, contentSha256: string, sceneIds: readonly string[], scenesSha256: string, activeSceneId: string, primaryByteSha256: string, backupByteSha256: string) {
  const scenes = sceneIds.map((sceneId) => JSON.stringify({ schemaVersion: "0.1.0", id: sceneId, name: sceneId }));
  const catalogEntry = { projectId, status: "PASS", sceneId: originalSceneId, sceneName: "Original", sceneCount: sceneIds.length, activeSceneId, generation, contentSha256, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: "M912", lastOpenedSequence: 1, workspaceMetadataWarning: null };
  return {
    projectId,
    generation,
    contentSha256,
    sceneIds,
    scenesSha256,
    activeSceneId,
    sceneCount: sceneIds.length,
    assets: [],
    assetCollectionSha256: "9".repeat(64),
    primaryByteSha256,
    backupByteSha256,
    catalog: { operation: "dicebox.project.catalog", status: "PASS", entries: [catalogEntry], workspaceIndexGeneration: 1, workspaceMetadataWarning: null, noWrite: true, noFoundryWrite: true },
    catalogEntry,
    project: {
      scenesJson: scenes,
      activeSceneId,
      assets: [],
      receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation, contentSha256, sceneSha256: "9".repeat(64), sceneCount: sceneIds.length, activeSceneId, scenes: sceneIds.map((sceneId) => ({ sceneId, sceneSha256: "9".repeat(64) })), assetCount: 0, recoveredFrom: null, migrationStatus: "current", persistedContentSha256: contentSha256, noFoundryWrite: true },
    },
    recovery: { operation: "dicebox.project.recovery.inspect", status: "PASS", projectId, generation, contentSha256, activeSceneId, scenes: sceneIds.map((sceneId) => ({ sceneId, sceneSha256: "9".repeat(64) })), primary: { relativePath: "projects/m912/project.json", status: "VALID", byteSha256: primaryByteSha256 }, backup: { relativePath: "projects/m912/project.backup.json", status: "VALID", byteSha256: backupByteSha256 }, registeredAssets: [], pendingArtifacts: [], brokenSceneReferences: [], retry: "none", restoreEligible: false, noWrite: true, noFoundryWrite: true },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function executionReceipt() {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.add-scene.persist", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: projectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{ commandId, kind: "project.add-scene.persist", dependsOn: [], payload: { addedOrdinal: 2, addedSceneId, currentActiveSceneId: originalSceneId, currentContentSha256: "c".repeat(64), currentSceneCount: 1, currentSceneIds: [originalSceneId], currentScenesSha256: "a".repeat(64), expectedGeneration: 2, operation: "project.add-scene.persist", previewSha256: "b".repeat(64), proposedActiveSceneId: addedSceneId, proposedSceneCount: 2, proposedSceneIds: [originalSceneId, addedSceneId], proposedScenesSha256: "e".repeat(64), projectId } }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 3, sha256: "7".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 4, sha256: "8".repeat(64) }, observed(5));
  return {
    operation: "dicebox.project.add-scene.persist.execute",
    status: "PASS",
    projectId,
    batchId,
    addedSceneId,
    addedOrdinal: 2,
    before: projectRead(2, "c".repeat(64), [originalSceneId], "a".repeat(64), originalSceneId, "f".repeat(64), "1".repeat(64)),
    afterApply: projectRead(3, "7".repeat(64), [originalSceneId, addedSceneId], "e".repeat(64), addedSceneId, "2".repeat(64), "f".repeat(64)),
    afterUndo: projectRead(4, "8".repeat(64), [originalSceneId], "a".repeat(64), originalSceneId, "3".repeat(64), "2".repeat(64)),
    save: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 3, contentSha256: "7".repeat(64), sceneSha256: "b".repeat(64), sceneCount: 2, activeSceneId: addedSceneId, scenes: [{ sceneId: originalSceneId, sceneSha256: "b".repeat(64) }, { sceneId: addedSceneId, sceneSha256: "b".repeat(64) }], assetCount: 0, projectRelativePath: "projects/m912/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    inverseRestore: { operation: "dicebox.project.save", status: "PASS", projectId, generation: 4, contentSha256: "8".repeat(64), sceneSha256: "b".repeat(64), sceneCount: 1, activeSceneId: originalSceneId, scenes: [{ sceneId: originalSceneId, sceneSha256: "b".repeat(64) }], assetCount: 0, projectRelativePath: "projects/m912/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true },
    history,
    batch,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sceneContentRestored: true,
    assetsPreserved: true,
    noFoundryWrite: true,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const undone = await executionReceipt();
  const history = await redoProposalBatch(undone.history, undone.batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) }, observed(6));
  const beforeRedo = undone.afterUndo;
  const afterRedo = projectRead(5, "7".repeat(64), [originalSceneId, addedSceneId], "e".repeat(64), addedSceneId, "9".repeat(64), undone.afterUndo.primaryByteSha256);
  const redoReceipt = { operation: "dicebox.project.save", status: "PASS", projectId, generation: 5, contentSha256: "7".repeat(64), sceneSha256: "b".repeat(64), sceneCount: 2, activeSceneId: addedSceneId, scenes: [{ sceneId: originalSceneId, sceneSha256: "b".repeat(64) }, { sceneId: addedSceneId, sceneSha256: "b".repeat(64) }], assetCount: 0, projectRelativePath: "projects/m912/project.json", atomicReplace: true, directoryEntrySync: true, backupPreserved: true, noFoundryWrite: true };
  return { operation: "dicebox.project.add-scene.persist.redo", status: "PASS", projectId, batchId, addedSceneId, addedOrdinal: 2, beforeRedo, afterRedo, redoReceipt, history, matchedReread: { status: "matched", targetId: projectId, revision: 5, sha256: "7".repeat(64) }, projectContentWrite: false, projectPersistenceWrite: false, sceneContentRestored: false, assetsPreserved: true, noProjectMutation: true, noFoundryWrite: true, ...overrides };
}

describe("M912 project.add-scene.persist semantic redo evidence", () => {
  it("composes raw strict persistent add-Scene redo evidence", async () => {
    const result = createProjectStage11PersistentAddSceneSemanticRedoEvidence(await redoExecutionReceipt());
    expect(result).toMatchObject({ schemaVersion: "0.1.0", milestone: "M912", evidenceLabel: "local", receipt: "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json", status: "bounded-local", operation: "project.add-scene.persist.redo", semantic: "redo-post-state", sceneAppended: true, orderedSceneSetPreserved: true, activeSceneSelected: true, generationAdvanced: true, semanticContentChanged: true, assetCountPreserved: true, assetTreePreserved: true, byteEnvelopeRotated: true, matchedReread: true, readOnly: true, nonCertifying: true, noExecutionAuthority: true, noTransitionAuthority: true, noGenericExecutor: true, noFoundryWrite: true, noProjectMutation: true, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(result.sourceReceipt.authoritativeRereads.beforeRedo.sceneIds).toEqual([originalSceneId]);
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.sceneIds).toEqual([originalSceneId, addedSceneId]);
    expect(projectStage11PersistentAddSceneSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("accepts the canonical terminal-redone receipt shape", async () => {
    const terminal = bridgeProjectPersistentAddSceneRedoToTerminalHistory(await redoExecutionReceipt());
    const result = createProjectStage11PersistentAddSceneSemanticRedoEvidence(terminal);
    expect(result.sourceReceipt).toEqual(terminal);
    expect(result.byteEnvelopeRotated).toBe(true);
  });

  it("fails closed for Scene, content, envelope, and authority drift", async () => {
    const sceneDrift = await redoExecutionReceipt();
    sceneDrift.afterRedo.sceneIds = [originalSceneId];
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|scene|append|active/i);

    const contentDrift = await redoExecutionReceipt();
    contentDrift.afterRedo.contentSha256 = contentDrift.beforeRedo.contentSha256;
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoEvidence(contentDrift)).toThrow(/content|hash|persisted/i);

    const envelopeDrift = await redoExecutionReceipt();
    envelopeDrift.afterRedo.backupByteSha256 = "a".repeat(64);
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoEvidence(envelopeDrift)).toThrow(/byte|envelope|backup/i);

    const authorityDrift = await redoExecutionReceipt({ noProjectMutation: false });
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoEvidence(authorityDrift)).toThrow(/mutation|authority|false/i);
  });
});
