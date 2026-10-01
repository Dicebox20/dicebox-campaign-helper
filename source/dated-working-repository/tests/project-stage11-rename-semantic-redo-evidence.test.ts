import { describe, expect, it } from "vitest";
import { bridgeProjectRenameRedoToTerminalHistory } from "../apps/campaign-helper-desktop/src/project-rename-terminal-history.js";
import {
  createProjectStage11RenameSemanticRedoEvidence,
  projectStage11RenameSemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-rename-semantic-redo-evidence.js";
import {
  approveProposalBatch,
  beginProposalApply,
  commitProposalAfterReread,
  createProposalBatch,
  previewProposalBatch,
  redoProposalBatch,
  undoProposalBatch,
} from "../packages/dicebox-core/src/index.js";

const projectId = "dbx:project:m902-rename";
const batchId = "dbx:proposal:m902-rename";
const commandId = "dbx:proposal-command:m902-rename";
const contentSha256 = "c".repeat(64);
const sceneId = "dbx:scene:m902-rename";
const observed = (second: number) => `2026-09-01T20:00:${String(second).padStart(2, "0")}.000Z`;

async function redoExecutionReceipt(overrides: Record<string, unknown> = {}) {
  const batch = await createProposalBatch({
    schemaVersion: "0.1.0",
    batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "human", sourceId: "desktop.project.rename", provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "low",
    base: { targetId: projectId, revision: 9, sha256: "a".repeat(64) },
    commands: [{
      commandId,
      kind: "project.rename",
      dependsOn: [],
      payload: {
        contentSha256,
        currentDisplayName: "Before",
        operation: "project.rename",
        previewSha256: "b".repeat(64),
        projectId,
        proposedDisplayName: "After",
        workspaceIndexGeneration: 9,
      },
    }],
    createdAt: observed(0),
  });
  let history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, observed(1));
  history = await approveProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(2));
  history = await beginProposalApply(history, batch, { actorId: "reviewer", role: "reviewer" }, batch.base, observed(3));
  history = await commitProposalAfterReread(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 10, sha256: "d".repeat(64) }, observed(4));
  history = await undoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 11, sha256: "e".repeat(64) }, observed(5));
  const before = {
    projectId,
    displayName: "Before",
    workspaceIndexGeneration: 11,
    generation: 1,
    contentSha256,
    authoritativeStateSha256: "e".repeat(64),
    catalog: {
      operation: "dicebox.project.catalog",
      status: "PASS",
      entries: [{ projectId, status: "PASS", sceneId, sceneName: "M902", sceneCount: 1, activeSceneId: sceneId, generation: 1, contentSha256, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: "Before", lastOpenedSequence: 1, workspaceMetadataWarning: null }],
      workspaceIndexGeneration: 11,
      workspaceMetadataWarning: null,
      noWrite: true,
      noFoundryWrite: true,
    },
    catalogEntry: { projectId, status: "PASS", sceneId, sceneName: "M902", sceneCount: 1, activeSceneId: sceneId, generation: 1, contentSha256, assetCount: 0, recoveredFrom: null, blockerCode: null, displayName: "Before", lastOpenedSequence: 1, workspaceMetadataWarning: null },
    project: {
      scenesJson: [JSON.stringify({ sceneId })],
      activeSceneId: sceneId,
      assets: [],
      receipt: { operation: "dicebox.project.load", status: "PASS", projectId, generation: 1, contentSha256, sceneSha256: "f".repeat(64), sceneCount: 1, activeSceneId: sceneId, scenes: [{ sceneId, sceneSha256: "f".repeat(64) }], assetCount: 0, recoveredFrom: null, migrationStatus: "current", persistedContentSha256: contentSha256, noFoundryWrite: true },
    },
    noWrite: true,
    noFoundryWrite: true,
  };
  const after = {
    ...before,
    displayName: "After",
    workspaceIndexGeneration: 12,
    authoritativeStateSha256: "f".repeat(64),
    catalog: { ...before.catalog, workspaceIndexGeneration: 12, entries: before.catalog.entries.map((entry) => ({ ...entry, displayName: "After" })) },
    catalogEntry: { ...before.catalogEntry, displayName: "After" },
  };
  const redoReceipt = {
    operation: "dicebox.workspace-metadata.rename",
    status: "PASS",
    projectId,
    displayName: "After",
    lastOpenedSequence: 1,
    indexGeneration: 12,
    contentSha256,
    recoveredFrom: null,
    atomicReplace: true,
    directoryEntrySync: true,
    backupPreserved: true,
    noFoundryWrite: true,
  };
  const redoneHistory = await redoProposalBatch(history, batch, { actorId: "reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 12, sha256: "f".repeat(64) }, observed(6));
  return {
    operation: "dicebox.project.rename.redo",
    status: "PASS",
    projectId,
    batchId,
    currentDisplayName: "Before",
    proposedDisplayName: "After",
    beforeRedo: before,
    afterRedo: after,
    redoReceipt,
    history: redoneHistory,
    matchedReread: { status: "matched", targetId: projectId, revision: 12, sha256: "f".repeat(64) },
    projectContentWrite: false,
    noProjectMutation: true,
    noFoundryWrite: true,
    ...overrides,
  };
}

describe("M902 project.rename semantic redo evidence", () => {
  it("composes the strict rename redo bridge into non-certifying semantic evidence", async () => {
    const source = bridgeProjectRenameRedoToTerminalHistory(await redoExecutionReceipt());
    const result = createProjectStage11RenameSemanticRedoEvidence(source);

    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M902",
      evidenceLabel: "local",
      receipt: "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json",
      status: "bounded-local",
      operation: "project.rename.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      displayNameChanged: true,
      contentPreserved: true,
      metadataEnvelopePreserved: true,
      driftRejected: "display-name/content/metadata-envelope/readback identity drift",
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
    expect(result.sourceReceipt.authoritativeRereads.beforeRedo.displayName).toBe("Before");
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.displayName).toBe("After");
    expect(result.sourceReceipt.authoritativeRereads.afterRedo.contentSha256).toBe(result.sourceReceipt.authoritativeRereads.beforeRedo.contentSha256);
    expect(projectStage11RenameSemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for display-name, content, metadata, and authority drift", async () => {
    const base = await redoExecutionReceipt();

    const equalContent = structuredClone(base) as any;
    equalContent.afterRedo.authoritativeStateSha256 = equalContent.beforeRedo.authoritativeStateSha256;
    equalContent.matchedReread.sha256 = equalContent.afterRedo.authoritativeStateSha256;
    expect(() => bridgeProjectRenameRedoToTerminalHistory(equalContent)).toThrow(/content|hash|metadata/i);

    const displayDrift = await redoExecutionReceipt();
    displayDrift.afterRedo.displayName = "Foreign";
    expect(() => bridgeProjectRenameRedoToTerminalHistory(displayDrift)).toThrow(/display|rename|proposed|catalog/i);

    const metadataDrift = await redoExecutionReceipt();
    metadataDrift.redoReceipt.backupPreserved = false;
    expect(() => bridgeProjectRenameRedoToTerminalHistory(metadataDrift)).toThrow(/backup|preserv|metadata/i);

    const authorityDrift = bridgeProjectRenameRedoToTerminalHistory(await redoExecutionReceipt()) as any;
    authorityDrift.noTransitionAuthority = false;
    expect(() => createProjectStage11RenameSemanticRedoEvidence(authorityDrift)).toThrow(/transition|authority/i);
  });
});
