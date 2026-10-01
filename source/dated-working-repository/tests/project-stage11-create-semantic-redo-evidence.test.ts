import { describe, expect, it } from "vitest";
import {
  createProjectStage11CreateSemanticRedoEvidence,
  projectStage11CreateSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-create-semantic-redo-evidence.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const targetProjectId = "dbx:project:m904-created";
const batchId = "dbx:proposal:m904-create";
const commandId = "dbx:proposal-command:m904-create";
const sceneId = "dbx:scene:m904-created";
const observed = (second: number) => `2026-09-01T22:00:${String(second).padStart(2, "0")}.000Z`;

function targetRead(generation: number, contentSha256: string, scenesSha256: string, primaryByteSha256: string, displayName: string) {
  return {
    projectId: targetProjectId,
    generation,
    contentSha256,
    sceneIds: [sceneId],
    scenesSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assets: [],
    assetCollectionSha256: "9".repeat(64),
    catalogEntry: { projectId: targetProjectId, status: "PASS", generation, contentSha256, displayName },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId: targetProjectId,
        generation,
        contentSha256,
        activeSceneId: sceneId,
        sceneCount: 1,
        assetCount: 0,
        noFoundryWrite: true,
      },
    },
    recovery: {
      operation: "dicebox.project.recovery.inspect",
      status: "PASS",
      projectId: targetProjectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "MISSING" },
    },
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId: targetProjectId, status: "PASS", generation, contentSha256, displayName }],
      workspaceIndexGeneration: 7,
      noWrite: true,
      noFoundryWrite: true,
    },
    noWrite: true,
    noFoundryWrite: true,
  };
}

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: "desktop.project.create", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: targetProjectId, revision: 0, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.create",
      dependsOn: [],
      payload: {
        operation: "project.create",
        targetProjectId,
        workspaceIndexGeneration: 7,
        sceneIds: [sceneId],
        scenesSha256: "b".repeat(64),
        activeSceneId: sceneId,
        sceneCount: 1,
        proposedDisplayName: "Created",
        targetAbsent: true,
        previewSha256: "c".repeat(64),
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 1, sha256: "d".repeat(64) }, observed(4));

  const before = { target: null, targetAbsent: true, workspaceIndexGeneration: 7, catalog: { operation: "dicebox.project.catalog", status: "PASS", entries: [], workspaceIndexGeneration: 7, noWrite: true, noFoundryWrite: true }, noWrite: true, noFoundryWrite: true };
  const afterTarget = targetRead(1, "d".repeat(64), "b".repeat(64), "2".repeat(64), "Created");
  const source = {
    operation: "dicebox.project.create.execute",
    status: "PASS",
    targetProjectId,
    batchId,
    before,
    afterApply: { target: afterTarget, targetAbsent: false, workspaceIndexGeneration: 8, catalog: { ...afterTarget.catalog, workspaceIndexGeneration: 8 }, noWrite: true, noFoundryWrite: true },
    create: {
      operation: "dicebox.project.create",
      status: "PASS",
      projectId: targetProjectId,
      generation: 1,
      contentSha256: "d".repeat(64),
      sceneSha256: "b".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "b".repeat(64) }],
      assetCount: 0,
      projectRelativePath: "projects/m904-created/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: false,
      noFoundryWrite: true,
      workspaceMetadata: {
        operation: "dicebox.workspace-metadata.touch",
        status: "PASS",
        projectId: targetProjectId,
        displayName: "Created",
        lastOpenedSequence: 3,
        indexGeneration: 8,
        contentSha256: "d".repeat(64),
        recoveredFrom: null,
        atomicReplace: true,
        directoryEntrySync: true,
        backupPreserved: false,
        noFoundryWrite: true,
      },
    },
    history,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    targetCreated: true,
    firstGenerationBackupMissing: true,
    noFoundryWrite: true,
    batch,
    ...overrides,
  };
  const originalTarget = afterTarget;
  const afterRedoTarget = targetRead(3, originalTarget.contentSha256, originalTarget.scenesSha256, "3".repeat(64), "Created");
  const undoneHistory = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 2, sha256: "e".repeat(64) }, observed(5));
  const redoneHistory = await redoProposalBatch(undoneHistory, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: targetProjectId, revision: 3, sha256: originalTarget.contentSha256 }, observed(6));
  return {
    operation: "dicebox.project.create.redo",
    status: "PASS",
    targetProjectId,
    batchId,
    beforeRedo: { target: null, targetAbsent: true, noWrite: true, noFoundryWrite: true },
    afterRedo: { target: afterRedoTarget, targetAbsent: false, noWrite: true, noFoundryWrite: true },
    matchedReread: { status: "matched" as const, targetId: targetProjectId, revision: 3, sha256: originalTarget.contentSha256 },
    history: redoneHistory,
    sourceReceipt: source,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

describe("M904 project.create semantic redo evidence", () => {
  it("composes the strict create redo bridge into non-certifying semantic evidence", async () => {
    const result = createProjectStage11CreateSemanticRedoEvidence(await redoExecutionReceipt());

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M904",
      evidenceLabel: "local",
      receipt: "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.create.redo",
      semantic: "redo-post-state",
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      generationAdvanced: true,
      firstGenerationContentIdentityPreserved: true,
      matchedReread: true,
      scenesPreserved: true,
      assetCollectionPreserved: true,
      driftRejected: "target/content/scenes/assets/reread identity drift",
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
    expect(result.sourceReceipt.authoritativeRereads.beforeRedo.target).toBeNull();
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.target?.generation).toBe(3);
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.target?.contentSha256).toBe(result.sourceReceipt.sourceReceipt.afterApply.target?.contentSha256);
    expect(projectStage11CreateSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for target, content, Scene, asset, and authority drift", async () => {
    const targetDrift = await redoExecutionReceipt();
    (targetDrift.beforeRedo as { target: unknown }).target = {};
    expect(() => createProjectStage11CreateSemanticRedoEvidence(targetDrift)).toThrow(/target|absent/i);

    const contentDrift = await redoExecutionReceipt();
    contentDrift.afterRedo.target.contentSha256 = "4".repeat(64);
    contentDrift.matchedReread.sha256 = "4".repeat(64);
    expect(() => createProjectStage11CreateSemanticRedoEvidence(contentDrift)).toThrow(/target|content|identity|hash|catalog/i);

    const sceneDrift = await redoExecutionReceipt();
    sceneDrift.afterRedo.target.scenesSha256 = "5".repeat(64);
    expect(() => createProjectStage11CreateSemanticRedoEvidence(sceneDrift)).toThrow(/Scene|scene|identity/i);

    const assetDrift = await redoExecutionReceipt();
    assetDrift.afterRedo.target.assetCollectionSha256 = "6".repeat(64);
    expect(() => createProjectStage11CreateSemanticRedoEvidence(assetDrift)).toThrow(/asset|collection|identity/i);

    const authorityDrift = await redoExecutionReceipt() as any;
    authorityDrift.noProjectMutation = false;
    expect(() => createProjectStage11CreateSemanticRedoEvidence(authorityDrift)).toThrow(/mutation|authority|false/i);
  });
});
