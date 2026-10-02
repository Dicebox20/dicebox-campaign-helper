import { describe, expect, it } from "vitest";
import { approveProposalBatch, beginProposalApply, commitProposalAfterReread, previewProposalBatch } from "@dicebox/core";
import { createDesktopProjectProposalSession } from "../apps/campaign-helper-desktop/src/project-proposal-session";
import { createProjectRecoveryProposalBatch } from "../apps/campaign-helper-desktop/src/project-recovery-proposal-adapter";
import type {
  ProjectCatalogResponse,
  ProjectLoadResponse,
  ProjectMigrationExplanationReceipt,
  ProjectMigrationPersistPreviewReceipt,
  ProjectMigrationPersistReceipt,
  ProjectRecoveryInspectionReceipt,
} from "../apps/campaign-helper-desktop/src/project-store";
import { bridgeProjectMigrationExecutionToTerminalHistory, projectMigrationTerminalHistoryReceiptSchema } from "../apps/campaign-helper-desktop/src/project-migration-terminal-history";

const projectId = "dbx:project:m735-legacy-migration";
const batchId = "dbx:proposal:m735-legacy-migration";
const sceneId = "dbx:scene:m735-legacy-main";
const preview = {
  operation: "dicebox.project.migration.persist.preview",
  status: "PREVIEW",
  projectId,
  authoritativeSource: "project.json",
  sourceSchemaVersion: "0.2.0",
  targetSchemaVersion: "0.3.0",
  generation: 1,
  nextGeneration: 2,
  persistedContentSha256: "a".repeat(64),
  resultingContentSha256: "b".repeat(64),
  scenes: [{ sceneId, sceneSha256: "c".repeat(64) }],
  activeSceneId: sceneId,
  assetCount: 0,
  assetCollectionSha256: "d".repeat(64),
  semanticStateSha256: "e".repeat(64),
  actions: ["preserve-scenes-and-assets", "write-only-on-explicit-save"],
  primaryByteSha256: "f".repeat(64),
  protectedStateSha256: "1".repeat(64),
  assetTreeSha256: "2".repeat(64),
  previewSha256: "3".repeat(64),
  requiresApproval: true,
  noWrite: true,
  noFoundryWrite: true,
} as const satisfies ProjectMigrationPersistPreviewReceipt;

const receipt: ProjectMigrationPersistReceipt = {
  operation: "dicebox.project.migration.persist",
  status: "PASS",
  projectId,
  sourceSchemaVersion: "0.2.0",
  targetSchemaVersion: "0.3.0",
  previousGeneration: 1,
  generation: 2,
  previousContentSha256: "a".repeat(64),
  contentSha256: "b".repeat(64),
  scenes: preview.scenes,
  activeSceneId: sceneId,
  assetCount: 0,
  semanticStateUnchanged: true,
  assetTreeUnchanged: true,
  workspaceUnchanged: true,
  foreignStateUnchanged: true,
  backupPreservesLegacyPrimary: true,
  authoritativeCurrentReread: true,
  previewSha256: preview.previewSha256,
  directoryEntrySync: true,
  noFoundryWrite: true,
};

const catalog: ProjectCatalogResponse = {
  operation: "dicebox.project.catalog",
  status: "PASS",
  entries: [{
    projectId,
    status: "PASS",
    sceneId,
    sceneName: "Legacy Main",
    sceneCount: 1,
    activeSceneId: sceneId,
    generation: 2,
    contentSha256: receipt.contentSha256,
    assetCount: 0,
    recoveredFrom: null,
    blockerCode: null,
    displayName: "Legacy Migration",
    lastOpenedSequence: 1,
    workspaceMetadataWarning: null,
  }],
  workspaceIndexGeneration: 2,
  workspaceMetadataWarning: null,
  noWrite: true,
  noFoundryWrite: true,
};

const project: ProjectLoadResponse = {
  scenesJson: ["{\"id\":\"legacy-main\"}"],
  activeSceneId: sceneId,
  assets: [],
  receipt: {
    operation: "dicebox.project.load",
    status: "PASS",
    projectId,
    generation: 2,
    contentSha256: receipt.contentSha256,
    sceneSha256: "4".repeat(64),
    sceneCount: 1,
    activeSceneId: sceneId,
    scenes: preview.scenes,
    assetCount: 0,
    recoveredFrom: null,
    migrationStatus: "current",
    persistedContentSha256: receipt.contentSha256,
    noFoundryWrite: true,
  },
};

const recovery: ProjectRecoveryInspectionReceipt = {
  operation: "dicebox.project.recovery.inspect",
  status: "PASS",
  projectId,
  generation: 2,
  contentSha256: receipt.contentSha256,
  activeSceneId: sceneId,
  scenes: preview.scenes,
  primary: { relativePath: "projects/m735-legacy-migration/project.json", status: "VALID", sourceSchemaVersion: "0.3.0", byteSha256: "5".repeat(64) },
  backup: { relativePath: "projects/m735-legacy-migration/project.backup.json", status: "VALID", sourceSchemaVersion: "0.2.0", byteSha256: "6".repeat(64) },
  registeredAssets: [],
  pendingArtifacts: [],
  brokenSceneReferences: [],
  retry: "none",
  restoreEligible: false,
  migrationStatus: "current",
  noWrite: true,
  noFoundryWrite: true,
};

const explanation: ProjectMigrationExplanationReceipt = {
  operation: "dicebox.project.migration.explain",
  status: "preview-only",
  projectId,
  authoritativeSource: "project.json",
  primary: { relativePath: "projects/m735-legacy-migration/project.json", status: "VALID", sourceSchemaVersion: "0.3.0" },
  backup: { relativePath: "projects/m735-legacy-migration/project.backup.json", status: "VALID", sourceSchemaVersion: "0.2.0" },
  sourceSchemaVersion: "0.2.0",
  targetSchemaVersion: "0.3.0",
  migrationStatus: "current",
  generation: 2,
  contentSha256: receipt.contentSha256,
  actions: ["preserve-scenes-and-assets"],
  blockers: [],
  retry: "not-applicable-read-only",
  noWrite: true,
  noFoundryWrite: true,
};

async function inputPair() {
  const batch = await createProjectRecoveryProposalBatch({ batchId, preview, createdAt: "2026-08-31T01:00:00.000Z" });
  let history = await previewProposalBatch(batch, { actorId: "human:requester", role: "requester" }, "2026-08-31T01:00:01.000Z");
  history = await approveProposalBatch(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T01:00:02.000Z");
  history = await beginProposalApply(history, batch, { actorId: "human:reviewer", role: "reviewer" }, batch.base, "2026-08-31T01:00:03.000Z");
  history = await commitProposalAfterReread(history, batch, { actorId: "human:reviewer", role: "reviewer" }, { status: "matched", targetId: projectId, revision: 2, sha256: receipt.contentSha256 }, "2026-08-31T01:00:04.000Z");
  const session = await createDesktopProjectProposalSession({ projectId, batch, history });
  return { preview, receipt, session, authoritativeReread: { project, recovery, explanation, catalog, catalogEntry: catalog.entries[0]! } };
}

describe("project.migration.persist terminal-history bridge", () => {
  it("projects the exact approved committed migration lifecycle and rereads", async () => {
    const result = bridgeProjectMigrationExecutionToTerminalHistory(await inputPair());
    expect(result).toMatchObject({
      status: "committed",
      disposition: "terminal-committed",
      operation: "dicebox.project.migration.persist",
      commandKind: "project.migration.persist",
      projectId,
      sourceSchemaVersion: "0.2.0",
      targetSchemaVersion: "0.3.0",
      generation: 2,
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      noGenericExecutor: true,
      bridgeOnly: true,
      noExecutionAuthority: true,
      execution: "not-implemented",
      readyClaim: false,
      inverse: "not-available-source-operation-is-one-way",
      historyTransitions: ["preview", "approve", "begin-apply", "commit-after-reread"],
    });
    expect(projectMigrationTerminalHistoryReceiptSchema.parse(result)).toEqual(result);
  });

  it("fails closed for claimed Foundry writes and altered current rereads", async () => {
    const foundryWrite = structuredClone(await inputPair()) as unknown as { receipt: { noFoundryWrite: boolean } };
    foundryWrite.receipt.noFoundryWrite = false;
    expect(() => bridgeProjectMigrationExecutionToTerminalHistory(foundryWrite)).toThrow(/Foundry|true/i);
    const altered = structuredClone(await inputPair()) as unknown as { authoritativeReread: { explanation: ProjectMigrationExplanationReceipt } };
    altered.authoritativeReread.explanation = { ...altered.authoritativeReread.explanation, migrationStatus: "migrated-in-memory" };
    expect(() => bridgeProjectMigrationExecutionToTerminalHistory(altered)).toThrow(/migrationStatus|current/i);
  });
});
