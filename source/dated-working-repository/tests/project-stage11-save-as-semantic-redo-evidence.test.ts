import { describe, expect, it } from "vitest";
import {
  createProjectStage11SaveAsSemanticRedoEvidence,
  projectStage11SaveAsSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-save-as-semantic-redo-evidence.js";
import { bridgeProjectSaveAsRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-save-as-terminal-history.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const sourceProjectId = "dbx:project:m910-source";
const targetProjectId = "dbx:project:m910-target";
const batchId = "dbx:proposal:m910-save-as";
const commandId = "dbx:proposal-command:m910-save-as";
const sceneId = "dbx:scene:m910-source";
const observed = (second: number) => `2026-09-01T23:00:${String(second).padStart(2, "0")}.000Z`;

function projectRead(projectId: string, generation: number, contentSha256: string, scenesSha256: string, primaryByteSha256: string, backupByteSha256: string, displayName: string) {
  return {
    projectId,
    generation,
    contentSha256,
    sceneIds: [sceneId],
    scenesSha256,
    activeSceneId: sceneId,
    sceneCount: 1,
    assets: [],
    assetCollectionSha256: "9".repeat(64),
    catalogEntry: { projectId, status: "PASS", generation, contentSha256, displayName },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: {
        operation: "dicebox.project.load",
        status: "PASS",
        projectId,
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
      projectId,
      generation,
      contentSha256,
      noWrite: true,
      noFoundryWrite: true,
      primary: { status: "VALID", byteSha256: primaryByteSha256 },
      backup: { status: "VALID", byteSha256: backupByteSha256 },
    },
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", generation, contentSha256, displayName }],
      workspaceIndexGeneration: 4,
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
    producer: { kind: "project-store", sourceId: "desktop.project.save-as", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: sourceProjectId, revision: 2, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.save-as",
      dependsOn: [],
      payload: {
        operation: "project.save-as",
        sourceProjectId,
        targetProjectId,
        sourceGeneration: 2,
        sourceContentSha256: "c".repeat(64),
        sourceAssetCount: 0,
        sourceAssetCollectionSha256: "9".repeat(64),
        workspaceIndexGeneration: 4,
        sourceSceneIds: [sceneId],
        sourceScenesSha256: "a".repeat(64),
        sourceActiveSceneId: sceneId,
        sourceSceneCount: 1,
        proposedDisplayName: "Copy",
        targetAbsent: true,
        previewSha256: "b".repeat(64),
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: sourceProjectId, revision: 2, sha256: "c".repeat(64) }, observed(4));

  const beforeSource = projectRead(sourceProjectId, 2, "c".repeat(64), "a".repeat(64), "f".repeat(64), "1".repeat(64), "Source");
  const afterSource = projectRead(sourceProjectId, 2, "c".repeat(64), "a".repeat(64), "f".repeat(64), "1".repeat(64), "Source");
  const afterTarget = projectRead(targetProjectId, 1, "d".repeat(64), "b".repeat(64), "2".repeat(64), "3".repeat(64), "Copy");
  afterSource.catalog.workspaceIndexGeneration = 5;
  afterTarget.catalog.workspaceIndexGeneration = 5;
  const source = {
    operation: "dicebox.project.save-as.execute",
    status: "PASS",
    sourceProjectId,
    targetProjectId,
    batchId,
    before: { source: beforeSource, target: null, targetAbsent: true, workspaceIndexGeneration: 4, catalog: beforeSource.catalog, noWrite: true, noFoundryWrite: true },
    afterApply: { source: afterSource, target: afterTarget, targetAbsent: false, workspaceIndexGeneration: 5, catalog: { ...afterTarget.catalog, entries: [beforeSource.catalogEntry, afterTarget.catalogEntry] }, noWrite: true, noFoundryWrite: true },
    saveAs: {
      operation: "dicebox.project.save-as",
      status: "PASS",
      projectId: targetProjectId,
      generation: 1,
      contentSha256: "d".repeat(64),
      sceneSha256: "b".repeat(64),
      sceneCount: 1,
      activeSceneId: sceneId,
      scenes: [{ sceneId, sceneSha256: "b".repeat(64) }],
      assetCount: 0,
      projectRelativePath: "projects/m910-target/project.json",
      atomicReplace: true,
      directoryEntrySync: true,
      backupPreserved: false,
      noFoundryWrite: true,
      workspaceMetadata: {
        operation: "dicebox.workspace-metadata.touch",
        status: "PASS",
        projectId: targetProjectId,
        displayName: "Copy",
        lastOpenedSequence: 2,
        indexGeneration: 5,
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
    sourcePreserved: true,
    targetCreated: true,
    noFoundryWrite: true,
    batch,
    ...overrides,
  };

  const afterRedoSource = projectRead(sourceProjectId, 2, "c".repeat(64), "a".repeat(64), "f".repeat(64), "1".repeat(64), "Source");
  afterRedoSource.catalog.workspaceIndexGeneration = 5;
  const afterRedoTarget = projectRead(targetProjectId, 3, "d".repeat(64), "b".repeat(64), "4".repeat(64), "5".repeat(64), "Copy");
  const undoneHistory = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: sourceProjectId, revision: 2, sha256: "c".repeat(64) }, observed(5));
  const redoneHistory = await redoProposalBatch(undoneHistory, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: sourceProjectId, revision: 2, sha256: "c".repeat(64) }, observed(6));
  return {
    operation: "dicebox.project.save-as.redo",
    status: "PASS",
    sourceProjectId,
    targetProjectId,
    batchId,
    beforeRedo: { source: beforeSource, target: null, targetAbsent: true, noWrite: true, noFoundryWrite: true },
    afterRedo: { source: afterRedoSource, target: afterRedoTarget, targetAbsent: false, noWrite: true, noFoundryWrite: true },
    matchedReread: { status: "matched" as const, targetId: targetProjectId, revision: 3, sha256: "d".repeat(64) },
    history: redoneHistory,
    sourceReceipt: source,
    noProjectMutation: true,
    noFoundryWrite: true,
  };
}

describe("M910 project.save-as semantic redo evidence", () => {
  it("composes raw strict save-as redo evidence into non-certifying semantic evidence", async () => {
    const result = createProjectStage11SaveAsSemanticRedoEvidence(await redoExecutionReceipt());

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M910",
      evidenceLabel: "local",
      receipt: "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.save-as.redo",
      semantic: "redo-post-state",
      sourceAndTargetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      sourcePreserved: true,
      generationAdvanced: true,
      contentPreserved: true,
      sceneCollectionPreserved: true,
      assetCollectionPreserved: true,
      matchedReread: true,
      targetCreationIntegrityPreserved: true,
      driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift",
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
    expect(projectStage11SaveAsSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("accepts the canonical terminal-redone receipt shape", async () => {
    const terminal = bridgeProjectSaveAsRedoToTerminalHistory(await redoExecutionReceipt());
    const result = createProjectStage11SaveAsSemanticRedoEvidence(terminal);

    expect(result.sourceReceipt).toEqual(terminal);
    expect(result.sourceAndTargetIdentityPreserved).toBe(true);
    expect(result.targetCreationIntegrityPreserved).toBe(true);
  });

  it("fails closed for target, source, content, and authority drift", async () => {
    const targetDrift = await redoExecutionReceipt();
    (targetDrift.beforeRedo as { target: unknown }).target = {};
    expect(() => createProjectStage11SaveAsSemanticRedoEvidence(targetDrift)).toThrow(/target|absent/i);

    const sourceDrift = await redoExecutionReceipt();
    sourceDrift.afterRedo.source.contentSha256 = "4".repeat(64);
    expect(() => createProjectStage11SaveAsSemanticRedoEvidence(sourceDrift)).toThrow(/source|preserve|reread|identity/i);

    const contentDrift = await redoExecutionReceipt();
    contentDrift.afterRedo.target.contentSha256 = "4".repeat(64);
    expect(() => createProjectStage11SaveAsSemanticRedoEvidence(contentDrift)).toThrow(/target|content|identity|hash/i);

    const authorityDrift = await redoExecutionReceipt();
    authorityDrift.noProjectMutation = false;
    expect(() => createProjectStage11SaveAsSemanticRedoEvidence(authorityDrift)).toThrow(/mutation|authority|false/i);
  });
});
