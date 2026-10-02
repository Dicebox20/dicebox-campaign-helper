import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type { DesktopProjectProposalSession } from "./project-proposal-session";
import type {
  ProjectCatalogEntry,
  ProjectCatalogResponse,
  ProjectLoadResponse,
  ProjectMigrationExplanationReceipt,
  ProjectMigrationPersistPreviewReceipt,
  ProjectMigrationPersistReceipt,
  ProjectRecoveryInspectionReceipt,
} from "./project-store";

export const PROJECT_MIGRATION_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;

export type ProjectMigrationAuthoritativeRead = Readonly<{
  project: ProjectLoadResponse;
  recovery: ProjectRecoveryInspectionReceipt;
  explanation: ProjectMigrationExplanationReceipt;
  catalog: ProjectCatalogResponse;
  catalogEntry: ProjectCatalogEntry;
}>;

export type ProjectMigrationTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_MIGRATION_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.migration.persist";
  commandKind: "project.migration.persist";
  projectId: string;
  batchId: string;
  sourceSchemaVersion: "0.1.0" | "0.2.0";
  targetSchemaVersion: "0.3.0";
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeReread: ProjectMigrationAuthoritativeRead;
  sourcePreview: ProjectMigrationPersistPreviewReceipt;
  sourceReceipt: ProjectMigrationPersistReceipt;
  session: DesktopProjectProposalSession;
  inverse: "not-available-source-operation-is-one-way";
  authority: Readonly<{
    target: "local-project";
    apply: "operation-specific";
    genericExecutor: false;
  }>;
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  noGenericExecutor: true;
  bridgeOnly: true;
  noExecutionAuthority: true;
  authoritativeRereadVerified: true;
  noProjectMutation: true;
  execution: "not-implemented";
  readyClaim: false;
  foreignStatePreserved: true;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  semanticStateUnchanged: true;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  backupPreservesLegacyPrimary: true;
  directoryEntrySync: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectMigrationTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectMigrationTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectMigrationTerminalHistoryValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function array(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) blocked(`${label} must be an array.`);
  return value;
}

function text(value: unknown, label: string, pattern?: RegExp): string {
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value || (pattern !== undefined && !pattern.test(value))) blocked(`${label} is invalid.`);
  return value;
}

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) blocked(`${label} must be a non-negative safe integer.`);
  return value;
}

function exact(value: unknown, expected: string, label: string): void {
  if (value !== expected) blocked(`${label} must be ${expected}.`);
}

function trueValue(value: unknown, label: string): true {
  if (value !== true) blocked(`${label} must be true.`);
  return true;
}

function falseValue(value: unknown, label: string): false {
  if (value !== false) blocked(`${label} must be false.`);
  return false;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) blocked("Canonical value cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Canonical value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

function sceneReceipts(value: unknown, label: string): readonly Readonly<{ sceneId: string; sceneSha256: string }>[] {
  return array(value, label).map((entry, index) => {
    const scene = record(entry, `${label}[${index}]`);
    const keys = Object.keys(scene).sort().join("|");
    if (keys !== "sceneId|sceneSha256") blocked(`${label}[${index}] contains unknown or missing fields.`);
    return {
      sceneId: text(scene.sceneId, `${label}[${index}].sceneId`, stableIdPattern),
      sceneSha256: text(scene.sceneSha256, `${label}[${index}].sceneSha256`, sha256Pattern),
    };
  });
}

function validatePreview(value: unknown): ProjectMigrationPersistPreviewReceipt {
  const preview = record(value, "migration preview");
  exact(preview.operation, "dicebox.project.migration.persist.preview", "preview.operation");
  exact(preview.status, "PREVIEW", "preview.status");
  const projectId = text(preview.projectId, "preview.projectId", stableIdPattern);
  exact(preview.authoritativeSource, "project.json", "preview.authoritativeSource");
  const sourceSchemaVersion = text(preview.sourceSchemaVersion, "preview.sourceSchemaVersion");
  if (sourceSchemaVersion !== "0.1.0" && sourceSchemaVersion !== "0.2.0") blocked("preview.sourceSchemaVersion is not supported.");
  exact(preview.targetSchemaVersion, "0.3.0", "preview.targetSchemaVersion");
  const generation = integer(preview.generation, "preview.generation");
  if (integer(preview.nextGeneration, "preview.nextGeneration") !== generation + 1) blocked("preview.nextGeneration must advance exactly once.");
  text(preview.persistedContentSha256, "preview.persistedContentSha256", sha256Pattern);
  text(preview.resultingContentSha256, "preview.resultingContentSha256", sha256Pattern);
  sceneReceipts(preview.scenes, "preview.scenes");
  text(preview.activeSceneId, "preview.activeSceneId", stableIdPattern);
  integer(preview.assetCount, "preview.assetCount");
  text(preview.assetCollectionSha256, "preview.assetCollectionSha256", sha256Pattern);
  text(preview.semanticStateSha256, "preview.semanticStateSha256", sha256Pattern);
  array(preview.actions, "preview.actions").forEach((action, index) => text(action, `preview.actions[${index}]`));
  text(preview.primaryByteSha256, "preview.primaryByteSha256", sha256Pattern);
  text(preview.protectedStateSha256, "preview.protectedStateSha256", sha256Pattern);
  text(preview.assetTreeSha256, "preview.assetTreeSha256", sha256Pattern);
  text(preview.previewSha256, "preview.previewSha256", sha256Pattern);
  trueValue(preview.requiresApproval, "preview.requiresApproval");
  trueValue(preview.noWrite, "preview.noWrite");
  trueValue(preview.noFoundryWrite, "preview.noFoundryWrite");
  return preview as unknown as ProjectMigrationPersistPreviewReceipt;
}

function validateReceipt(value: unknown, preview: ProjectMigrationPersistPreviewReceipt): ProjectMigrationPersistReceipt {
  const receipt = record(value, "migration persistence receipt");
  exact(receipt.operation, "dicebox.project.migration.persist", "receipt.operation");
  exact(receipt.status, "PASS", "receipt.status");
  exact(receipt.projectId, preview.projectId, "receipt.projectId");
  exact(receipt.sourceSchemaVersion, preview.sourceSchemaVersion, "receipt.sourceSchemaVersion");
  exact(receipt.targetSchemaVersion, preview.targetSchemaVersion, "receipt.targetSchemaVersion");
  if (integer(receipt.previousGeneration, "receipt.previousGeneration") !== preview.generation) blocked("receipt.previousGeneration does not match preview.generation.");
  if (integer(receipt.generation, "receipt.generation") !== preview.nextGeneration) blocked("receipt.generation does not match preview.nextGeneration.");
  if (text(receipt.previousContentSha256, "receipt.previousContentSha256", sha256Pattern) !== preview.persistedContentSha256) blocked("receipt.previousContentSha256 does not match the legacy content.");
  if (text(receipt.contentSha256, "receipt.contentSha256", sha256Pattern) !== preview.resultingContentSha256) blocked("receipt.contentSha256 does not match the resulting content.");
  if (canonicalize(sceneReceipts(receipt.scenes, "receipt.scenes")) !== canonicalize(sceneReceipts(preview.scenes, "preview.scenes"))) blocked("receipt.scenes does not match the preview.");
  exact(receipt.activeSceneId, preview.activeSceneId, "receipt.activeSceneId");
  if (integer(receipt.assetCount, "receipt.assetCount") !== preview.assetCount) blocked("receipt.assetCount does not match the preview.");
  if (text(receipt.previewSha256, "receipt.previewSha256", sha256Pattern) !== preview.previewSha256) blocked("receipt.previewSha256 does not match the preview.");
  trueValue(receipt.semanticStateUnchanged, "receipt.semanticStateUnchanged");
  trueValue(receipt.assetTreeUnchanged, "receipt.assetTreeUnchanged");
  trueValue(receipt.workspaceUnchanged, "receipt.workspaceUnchanged");
  trueValue(receipt.foreignStateUnchanged, "receipt.foreignStateUnchanged");
  trueValue(receipt.backupPreservesLegacyPrimary, "receipt.backupPreservesLegacyPrimary");
  trueValue(receipt.authoritativeCurrentReread, "receipt.authoritativeCurrentReread");
  trueValue(receipt.directoryEntrySync, "receipt.directoryEntrySync");
  trueValue(receipt.noFoundryWrite, "receipt.noFoundryWrite");
  return receipt as unknown as ProjectMigrationPersistReceipt;
}

function validateProject(value: unknown, projectId: string, receipt: ProjectMigrationPersistReceipt): ProjectLoadResponse {
  const project = record(value, "authoritative project reread");
  const projectReceipt = record(project.receipt, "authoritative project reread.receipt");
  exact(projectReceipt.operation, "dicebox.project.load", "project.receipt.operation");
  exact(projectReceipt.status, "PASS", "project.receipt.status");
  exact(projectReceipt.projectId, projectId, "project.receipt.projectId");
  if (integer(projectReceipt.generation, "project.receipt.generation") !== receipt.generation || text(projectReceipt.contentSha256, "project.receipt.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("project reread does not match the migration receipt identity.");
  exact(projectReceipt.migrationStatus, "current", "project.receipt.migrationStatus");
  exact(projectReceipt.persistedContentSha256, receipt.contentSha256, "project.receipt.persistedContentSha256");
  trueValue(projectReceipt.noFoundryWrite, "project.receipt.noFoundryWrite");
  exact(project.activeSceneId, receipt.activeSceneId, "project.activeSceneId");
  if (array(project.scenesJson, "project.scenesJson").length !== receipt.scenes.length) blocked("project.scenesJson does not match the migrated Scene count.");
  if (array(project.assets, "project.assets").length !== receipt.assetCount) blocked("project.assets does not match the migrated asset count.");
  const scenes = sceneReceipts(projectReceipt.scenes, "project.receipt.scenes");
  if (canonicalize(scenes) !== canonicalize(receipt.scenes)) blocked("project.receipt.scenes does not match the migration receipt.");
  return project as unknown as ProjectLoadResponse;
}

function validateRecovery(value: unknown, projectId: string, receipt: ProjectMigrationPersistReceipt): ProjectRecoveryInspectionReceipt {
  const recovery = record(value, "authoritative recovery reread");
  exact(recovery.operation, "dicebox.project.recovery.inspect", "recovery.operation");
  exact(recovery.status, "PASS", "recovery.status");
  exact(recovery.projectId, projectId, "recovery.projectId");
  if (integer(recovery.generation, "recovery.generation") !== receipt.generation || text(recovery.contentSha256, "recovery.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("recovery reread does not match the migration receipt identity.");
  exact(recovery.migrationStatus, "current", "recovery.migrationStatus");
  trueValue(recovery.noWrite, "recovery.noWrite");
  trueValue(recovery.noFoundryWrite, "recovery.noFoundryWrite");
  const primary = record(recovery.primary, "recovery.primary");
  exact(primary.status, "VALID", "recovery.primary.status");
  exact(primary.sourceSchemaVersion, receipt.targetSchemaVersion, "recovery.primary.sourceSchemaVersion");
  const backup = record(recovery.backup, "recovery.backup");
  exact(backup.status, "VALID", "recovery.backup.status");
  exact(backup.sourceSchemaVersion, receipt.sourceSchemaVersion, "recovery.backup.sourceSchemaVersion");
  if (canonicalize(sceneReceipts(recovery.scenes, "recovery.scenes")) !== canonicalize(receipt.scenes)) blocked("recovery.scenes does not match the migration receipt.");
  exact(recovery.activeSceneId, receipt.activeSceneId, "recovery.activeSceneId");
  return recovery as unknown as ProjectRecoveryInspectionReceipt;
}

function validateExplanation(value: unknown, projectId: string, preview: ProjectMigrationPersistPreviewReceipt, receipt: ProjectMigrationPersistReceipt): ProjectMigrationExplanationReceipt {
  const explanation = record(value, "migration explanation reread");
  exact(explanation.operation, "dicebox.project.migration.explain", "explanation.operation");
  exact(explanation.status, "preview-only", "explanation.status");
  exact(explanation.projectId, projectId, "explanation.projectId");
  exact(explanation.authoritativeSource, "project.json", "explanation.authoritativeSource");
  exact(explanation.sourceSchemaVersion, preview.sourceSchemaVersion, "explanation.sourceSchemaVersion");
  exact(explanation.targetSchemaVersion, receipt.targetSchemaVersion, "explanation.targetSchemaVersion");
  exact(explanation.migrationStatus, "current", "explanation.migrationStatus");
  if (integer(explanation.generation, "explanation.generation") !== receipt.generation || text(explanation.contentSha256, "explanation.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("explanation does not match the current migrated project.");
  trueValue(explanation.noWrite, "explanation.noWrite");
  trueValue(explanation.noFoundryWrite, "explanation.noFoundryWrite");
  const primary = record(explanation.primary, "explanation.primary");
  exact(primary.status, "VALID", "explanation.primary.status");
  exact(primary.sourceSchemaVersion, receipt.targetSchemaVersion, "explanation.primary.sourceSchemaVersion");
  const backup = record(explanation.backup, "explanation.backup");
  exact(backup.status, "VALID", "explanation.backup.status");
  exact(backup.sourceSchemaVersion, preview.sourceSchemaVersion, "explanation.backup.sourceSchemaVersion");
  return explanation as unknown as ProjectMigrationExplanationReceipt;
}

function validateCatalog(value: unknown, projectId: string, receipt: ProjectMigrationPersistReceipt): { catalog: ProjectCatalogResponse; entry: ProjectCatalogEntry } {
  const catalog = record(value, "workspace/catalog reread");
  exact(catalog.operation, "dicebox.project.catalog", "catalog.operation");
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked("catalog.status is not accepted.");
  integer(catalog.workspaceIndexGeneration, "catalog.workspaceIndexGeneration");
  trueValue(catalog.noWrite, "catalog.noWrite");
  trueValue(catalog.noFoundryWrite, "catalog.noFoundryWrite");
  const entries = array(catalog.entries, "catalog.entries").map((entry, index) => record(entry, `catalog.entries[${index}]`));
  const matching = entries.filter((entry) => entry.projectId === projectId);
  if (matching.length !== 1) blocked("catalog must contain exactly one matching migrated project.");
  const entry = matching[0]!;
  exact(entry.status, "PASS", "catalogEntry.status");
  if (integer(entry.generation, "catalogEntry.generation") !== receipt.generation || text(entry.contentSha256, "catalogEntry.contentSha256", sha256Pattern) !== receipt.contentSha256 || integer(entry.assetCount, "catalogEntry.assetCount") !== receipt.assetCount) blocked("catalogEntry does not match the migration receipt.");
  return { catalog: catalog as unknown as ProjectCatalogResponse, entry: entry as unknown as ProjectCatalogEntry };
}

function validateSession(value: unknown, preview: ProjectMigrationPersistPreviewReceipt, receipt: ProjectMigrationPersistReceipt): { session: DesktopProjectProposalSession; history: ProposalBatchHistory } {
  const session = record(value, "migration proposal session");
  exact(session.projectId, preview.projectId, "session.projectId");
  const batch = record(session.batch, "session.batch");
  const batchId = text(batch.batchId, "session.batch.batchId", stableIdPattern);
  const base = record(batch.base, "session.batch.base");
  exact(base.targetId, preview.projectId, "session.batch.base.targetId");
  if (integer(base.revision, "session.batch.base.revision") !== preview.generation) blocked("session base revision does not match preview.generation.");
  const producer = record(batch.producer, "session.batch.producer");
  exact(producer.kind, "project-store", "session.batch.producer.kind");
  exact(producer.sourceId, "project.migration.persist", "session.batch.producer.sourceId");
  if (producer.provider !== null) blocked("session.batch.producer.provider must be null.");
  const commands = array(batch.commands, "session.batch.commands");
  if (commands.length !== 1) blocked("session.batch.commands must contain exactly one command.");
  const command = record(commands[0], "session.batch.commands[0]");
  exact(command.kind, "project.migration.persist", "session.batch.commands[0].kind");
  const payload = record(command.payload, "session.batch.commands[0].payload");
  exact(payload.operation, "project.migration.persist", "session.payload.operation");
  exact(payload.projectId, preview.projectId, "session.payload.projectId");
  exact(payload.sourceSchemaVersion, preview.sourceSchemaVersion, "session.payload.sourceSchemaVersion");
  exact(payload.targetSchemaVersion, preview.targetSchemaVersion, "session.payload.targetSchemaVersion");
  if (integer(payload.generation, "session.payload.generation") !== preview.generation || integer(payload.nextGeneration, "session.payload.nextGeneration") !== preview.nextGeneration) blocked("session payload generations do not match the preview.");
  exact(payload.persistedContentSha256, preview.persistedContentSha256, "session.payload.persistedContentSha256");
  exact(payload.resultingContentSha256, preview.resultingContentSha256, "session.payload.resultingContentSha256");
  exact(payload.semanticStateSha256, preview.semanticStateSha256, "session.payload.semanticStateSha256");
  exact(payload.assetTreeSha256, preview.assetTreeSha256, "session.payload.assetTreeSha256");
  exact(payload.previewSha256, preview.previewSha256, "session.payload.previewSha256");
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(session.history);
  } catch (error) {
    blocked(`session.history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (history.status !== "committed" || history.batchId !== batchId || history.receipts.length !== expectedTransitions.length || history.receipts.some((item, index) => item.transition !== expectedTransitions[index])) blocked("session.history is not the exact preview-to-commit lifecycle.");
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== preview.projectId || commit.reread.revision !== receipt.generation || commit.reread.sha256 !== receipt.contentSha256) blocked("session.history does not retain the matched authoritative migration reread.");
  return { session: session as unknown as DesktopProjectProposalSession, history };
}

function validateAuthoritativeRead(value: unknown, projectId: string, preview: ProjectMigrationPersistPreviewReceipt, receipt: ProjectMigrationPersistReceipt): ProjectMigrationAuthoritativeRead {
  const read = record(value, "migration authoritative reread");
  const project = validateProject(read.project, projectId, receipt);
  const recovery = validateRecovery(read.recovery, projectId, receipt);
  const explanation = validateExplanation(read.explanation, projectId, preview, receipt);
  const catalog = validateCatalog(read.catalog, projectId, receipt);
  return { project, recovery, explanation, catalog: catalog.catalog, catalogEntry: catalog.entry };
}

export function bridgeProjectMigrationExecutionToTerminalHistory(input: unknown): ProjectMigrationTerminalHistoryReceipt {
  const root = record(input, "migration terminal-history input");
  const expectedKeys = ["authoritativeReread", "preview", "receipt", "session"];
  if (Object.keys(root).sort().join("|") !== expectedKeys.sort().join("|")) blocked("migration terminal-history input contains unknown or missing fields.");
  const preview = validatePreview(root.preview);
  const receipt = validateReceipt(root.receipt, preview);
  const authoritativeReread = validateAuthoritativeRead(root.authoritativeReread, preview.projectId, preview, receipt);
  const session = validateSession(root.session, preview, receipt);
  return {
    schemaVersion: PROJECT_MIGRATION_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.migration.persist",
    commandKind: "project.migration.persist",
    projectId: preview.projectId,
    batchId: session.session.batch.batchId,
    sourceSchemaVersion: preview.sourceSchemaVersion,
    targetSchemaVersion: preview.targetSchemaVersion,
    previousGeneration: preview.generation,
    generation: receipt.generation,
    previousContentSha256: preview.persistedContentSha256,
    contentSha256: receipt.contentSha256,
    history: session.history,
    historyStatus: "committed",
    historyTransitions: session.history.receipts.map((item) => item.transition),
    authoritativeReread,
    sourcePreview: preview,
    sourceReceipt: receipt,
    session: session.session,
    inverse: "not-available-source-operation-is-one-way",
    authority: { target: "local-project", apply: "operation-specific", genericExecutor: false },
    targetAuthority: "local-project",
    applyAuthority: "operation-specific",
    noGenericExecutor: true,
    bridgeOnly: true,
    noExecutionAuthority: true,
    authoritativeRereadVerified: true,
    noProjectMutation: true,
    execution: "not-implemented",
    readyClaim: false,
    foreignStatePreserved: true,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    semanticStateUnchanged: true,
    assetTreeUnchanged: true,
    workspaceUnchanged: true,
    foreignStateUnchanged: true,
    backupPreservesLegacyPrimary: true,
    directoryEntrySync: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectMigrationTerminalHistoryReceipt {
  const receipt = record(input, "migration terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_MIGRATION_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.migration.persist", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.migration.persist", "terminal-history receipt.commandKind");
  const projectId = text(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = text(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const sourceSchemaVersion = text(receipt.sourceSchemaVersion, "terminal-history receipt.sourceSchemaVersion");
  if (sourceSchemaVersion !== "0.1.0" && sourceSchemaVersion !== "0.2.0") blocked("terminal-history receipt.sourceSchemaVersion is not supported.");
  exact(receipt.targetSchemaVersion, "0.3.0", "terminal-history receipt.targetSchemaVersion");
  integer(receipt.previousGeneration, "terminal-history receipt.previousGeneration");
  integer(receipt.generation, "terminal-history receipt.generation");
  text(receipt.previousContentSha256, "terminal-history receipt.previousContentSha256", sha256Pattern);
  text(receipt.contentSha256, "terminal-history receipt.contentSha256", sha256Pattern);
  exact(receipt.historyStatus, "committed", "terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeRereadVerified, "terminal-history receipt.authoritativeRereadVerified");
  trueValue(receipt.noProjectMutation, "terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  falseValue(receipt.readyClaim, "terminal-history receipt.readyClaim");
  exact(receipt.inverse, "not-available-source-operation-is-one-way", "terminal-history receipt.inverse");
  trueValue(receipt.foreignStatePreserved, "terminal-history receipt.foreignStatePreserved");
  trueValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  trueValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  trueValue(receipt.semanticStateUnchanged, "terminal-history receipt.semanticStateUnchanged");
  trueValue(receipt.assetTreeUnchanged, "terminal-history receipt.assetTreeUnchanged");
  trueValue(receipt.workspaceUnchanged, "terminal-history receipt.workspaceUnchanged");
  trueValue(receipt.foreignStateUnchanged, "terminal-history receipt.foreignStateUnchanged");
  trueValue(receipt.backupPreservesLegacyPrimary, "terminal-history receipt.backupPreservesLegacyPrimary");
  trueValue(receipt.directoryEntrySync, "terminal-history receipt.directoryEntrySync");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");
  const preview = validatePreview(receipt.sourcePreview);
  const source = validateReceipt(receipt.sourceReceipt, preview);
  if (source.projectId !== projectId || source.generation !== integer(receipt.generation, "terminal-history receipt.generation") || source.contentSha256 !== receipt.contentSha256 || source.sourceSchemaVersion !== sourceSchemaVersion) blocked("terminal-history receipt is not bound to the exact migration source identity.");
  const authoritativeReread = validateAuthoritativeRead(receipt.authoritativeReread, projectId, preview, source);
  const session = validateSession(receipt.session, preview, source);
  if (session.session.batch.batchId !== batchId || canonicalize(session.history) !== canonicalize(receipt.history)) blocked("terminal-history receipt does not retain the exact committed session history.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTransitions.length || transitions.some((item, index) => item !== expectedTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  if (canonicalize(authoritativeReread) !== canonicalize(receipt.authoritativeReread)) blocked("terminal-history receipt reread changed during validation.");
  return receipt as unknown as ProjectMigrationTerminalHistoryReceipt;
}

export const projectMigrationTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectMigrationTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectMigrationTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectMigrationTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectMigrationTerminalHistoryValidationError
        ? error
        : new ProjectMigrationTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
