import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type {
  ProjectCreateAuthoritativeRead,
  ProjectCreateExecutionReceipt,
} from "./project-create-executor";

export const PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectCreateTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.create.execute";
  commandKind: "project.create";
  targetProjectId: string;
  batchId: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectCreateAuthoritativeRead;
    afterApply: ProjectCreateAuthoritativeRead;
  }>;
  sourceReceipt: ProjectCreateExecutionReceipt;
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
  authoritativeReread: true;
  noProjectMutation: true;
  execution: "not-implemented";
  readyClaim: false;
  foreignStatePreserved: true;
  noFoundryWrite: true;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  targetCreated: true;
  firstGenerationBackupMissing: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectCreateRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.create.redo";
  commandKind: "project.create";
  targetProjectId: string;
  batchId: string;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectCreateAuthoritativeRead;
    afterRedo: ProjectCreateAuthoritativeRead;
  }>;
  matchedReread: Readonly<{ status: "matched"; targetId: string; revision: number; sha256: string }>;
  sourceReceipt: ProjectCreateExecutionReceipt;
  authority: Readonly<{ target: "local-project"; apply: "operation-specific"; genericExecutor: false }>;
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  noGenericExecutor: true;
  bridgeOnly: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema";
  authoritativeReread: true;
  noProjectMutation: true;
  execution: "not-implemented";
  readyClaim: false;
  foreignStatePreserved: true;
  noFoundryWrite: true;
  sourceProjectContentWrite: false;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectCreateTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectCreateTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectCreateTerminalHistoryValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function array(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) blocked(`${label} must be an array.`);
  return value;
}

function string(value: unknown, label: string, pattern?: RegExp): string {
  if (typeof value !== "string" || value.length === 0 || (pattern !== undefined && !pattern.test(value))) blocked(`${label} must be a non-empty value with the expected format.`);
  return value;
}

function integer(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) blocked(`${label} must be a non-negative safe integer.`);
  return value;
}

function trueValue(value: unknown, label: string): true {
  if (value !== true) blocked(`${label} must be true.`);
  return true;
}

function falseValue(value: unknown, label: string): false {
  if (value !== false) blocked(`${label} must be false.`);
  return false;
}

function exact(value: unknown, expected: string, label: string): void {
  if (value !== expected) blocked(`${label} must be ${expected}.`);
}

function validateTargetRead(value: unknown, targetProjectId: string, label: string): ProjectCreateAuthoritativeRead["target"] {
  const read = record(value, label);
  exact(read.projectId, targetProjectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = string(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  const sceneIds = array(read.sceneIds, `${label}.sceneIds`).map((sceneId, index) => string(sceneId, `${label}.sceneIds[${index}]`, stableIdPattern));
  const scenesSha256 = string(read.scenesSha256, `${label}.scenesSha256`, sha256Pattern);
  const activeSceneId = string(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  if (sceneCount < 1 || sceneIds.length !== sceneCount || !sceneIds.includes(activeSceneId)) blocked(`${label} does not contain an exact ordered active Scene collection.`);
  const assets = array(read.assets, `${label}.assets`);
  string(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not accepted.`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const entries = array(catalog.entries, `${label}.catalog.entries`).map((entry) => record(entry, `${label}.catalog.entries[]`));
  if (entries.filter((entry) => entry.projectId === targetProjectId).length !== 1) blocked(`${label}.catalog must contain exactly one matching target entry.`);

  const catalogEntry = record(read.catalogEntry, `${label}.catalogEntry`);
  exact(catalogEntry.projectId, targetProjectId, `${label}.catalogEntry.projectId`);
  exact(catalogEntry.status, "PASS", `${label}.catalogEntry.status`);
  if (catalogEntry.generation !== generation || catalogEntry.contentSha256 !== contentSha256) blocked(`${label}.catalogEntry does not match the target reread.`);

  const project = record(read.project, `${label}.project`);
  exact(project.activeSceneId, activeSceneId, `${label}.project.activeSceneId`);
  const scenesJson = array(project.scenesJson, `${label}.project.scenesJson`);
  if (scenesJson.length !== sceneCount) blocked(`${label}.project.scenesJson does not match sceneCount.`);
  const projectAssets = array(project.assets, `${label}.project.assets`);
  if (projectAssets.length !== assets.length) blocked(`${label}.project.assets does not match assets.`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, targetProjectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256 || projectReceipt.activeSceneId !== activeSceneId || projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assets.length) blocked(`${label}.project.receipt does not match the target reread.`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, targetProjectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the target reread.`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  string(primary.byteSha256, `${label}.recovery.primary.byteSha256`, sha256Pattern);
  exact(backup.status, "MISSING", `${label}.recovery.backup.status`);

  return read as ProjectCreateAuthoritativeRead["target"];
}

function validateCreateReceipt(value: unknown, targetProjectId: string, target: ProjectCreateAuthoritativeRead["target"]): void {
  const create = record(value, "create");
  exact(create.operation, "dicebox.project.create", "create.operation");
  exact(create.status, "PASS", "create.status");
  exact(create.projectId, targetProjectId, "create.projectId");
  if (create.generation !== 1) blocked("create.generation must be the first generation.");
  const contentSha256 = string(create.contentSha256, "create.contentSha256", sha256Pattern);
  string(create.sceneSha256, "create.sceneSha256", sha256Pattern);
  const sceneCount = integer(create.sceneCount, "create.sceneCount");
  if (sceneCount !== target!.sceneCount) blocked("create.sceneCount does not match target reread.");
  exact(create.activeSceneId, target!.activeSceneId, "create.activeSceneId");
  const scenes = array(create.scenes, "create.scenes");
  if (scenes.length !== sceneCount) blocked("create.scenes does not match sceneCount.");
  if (integer(create.assetCount, "create.assetCount") !== 0 || target!.assets.length !== 0) blocked("create must prove the empty first-generation asset collection.");
  string(create.projectRelativePath, "create.projectRelativePath");
  trueValue(create.atomicReplace, "create.atomicReplace");
  trueValue(create.directoryEntrySync, "create.directoryEntrySync");
  falseValue(create.backupPreserved, "create.backupPreserved");
  trueValue(create.noFoundryWrite, "create.noFoundryWrite");
  const workspaceMetadata = record(create.workspaceMetadata, "create.workspaceMetadata");
  exact(workspaceMetadata.operation, "dicebox.workspace-metadata.touch", "create.workspaceMetadata.operation");
  exact(workspaceMetadata.status, "PASS", "create.workspaceMetadata.status");
  exact(workspaceMetadata.projectId, targetProjectId, "create.workspaceMetadata.projectId");
  string(workspaceMetadata.displayName, "create.workspaceMetadata.displayName");
  integer(workspaceMetadata.lastOpenedSequence, "create.workspaceMetadata.lastOpenedSequence");
  integer(workspaceMetadata.indexGeneration, "create.workspaceMetadata.indexGeneration");
  exact(workspaceMetadata.contentSha256, contentSha256, "create.workspaceMetadata.contentSha256");
  trueValue(workspaceMetadata.atomicReplace, "create.workspaceMetadata.atomicReplace");
  trueValue(workspaceMetadata.directoryEntrySync, "create.workspaceMetadata.directoryEntrySync");
  falseValue(workspaceMetadata.backupPreserved, "create.workspaceMetadata.backupPreserved");
  trueValue(workspaceMetadata.noFoundryWrite, "create.workspaceMetadata.noFoundryWrite");
}

function validateTerminalHistory(value: unknown, batchId: string, targetProjectId: string, target: ProjectCreateAuthoritativeRead["target"]): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project create proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "committed" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project create history must end in exactly four committed receipts.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("Project create history does not use the expected preview-to-commit sequence.");
  const commit = history.receipts[3]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== targetProjectId || commit.reread.revision !== target!.generation || commit.reread.sha256 !== target!.contentSha256) blocked("Commit history does not retain the matched authoritative target reread.");
  return history;
}

function validateRedoAbsentRead(value: unknown, label: string): ProjectCreateAuthoritativeRead {
  const read = record(value, label);
  if (read.target !== null || read.targetAbsent !== true) blocked(`${label} must retain the exact undone target absence.`);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);
  return read as ProjectCreateAuthoritativeRead;
}

function validateRedoPresentRead(value: unknown, targetProjectId: string, label: string): ProjectCreateAuthoritativeRead {
  const read = record(value, label);
  if (read.targetAbsent !== false) blocked(`${label}.targetAbsent must be false after redo.`);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);
  validateTargetRead(read.target, targetProjectId, `${label}.target`);
  return read as ProjectCreateAuthoritativeRead;
}

function validateRedoneCreateHistory(value: unknown, batchId: string, targetProjectId: string, afterRedo: ProjectCreateAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project create redo history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) blocked("Project create redo history must end in exactly six redone receipts.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) blocked("Project create redo history does not retain the exact preview-to-redo sequence.");
  const redo = history.receipts[5]!;
  const target = afterRedo.target!;
  if (redo.reread?.status !== "matched" || redo.reread.targetId !== targetProjectId || redo.reread.revision !== target.generation || redo.reread.sha256 !== target.contentSha256) blocked("Project create redo history does not retain the matched post-redo authoritative reread.");
  return history;
}

function validateExecutionReceipt(input: unknown): ProjectCreateExecutionReceipt {
  const source = record(input, "Project create execution receipt");
  exact(source.operation, "dicebox.project.create.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const targetProjectId = string(source.targetProjectId, "execution receipt.targetProjectId", stableIdPattern);
  const batchId = string(source.batchId, "execution receipt.batchId", stableIdPattern);
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.projectPersistenceWrite, "execution receipt.projectPersistenceWrite");
  trueValue(source.targetCreated, "execution receipt.targetCreated");
  trueValue(source.firstGenerationBackupMissing, "execution receipt.firstGenerationBackupMissing");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");

  const before = record(source.before, "before");
  trueValue(before.targetAbsent, "before.targetAbsent");
  if (before.target !== null) blocked("before.target must be null for project create.");
  trueValue(before.noWrite, "before.noWrite");
  trueValue(before.noFoundryWrite, "before.noFoundryWrite");
  const beforeIndex = integer(before.workspaceIndexGeneration, "before.workspaceIndexGeneration");
  const after = record(source.afterApply, "afterApply");
  if (after.targetAbsent !== false) blocked("afterApply.targetAbsent must be false after project create.");
  trueValue(after.noWrite, "afterApply.noWrite");
  trueValue(after.noFoundryWrite, "afterApply.noFoundryWrite");
  const afterIndex = integer(after.workspaceIndexGeneration, "afterApply.workspaceIndexGeneration");
  if (afterIndex !== beforeIndex + 1) blocked("Project create does not prove one workspace-index generation advance.");
  const target = validateTargetRead(after.target, targetProjectId, "afterApply.target");
  if (target!.generation !== 1) blocked("Project create target must be first-generation.");
  validateCreateReceipt(source.create, targetProjectId, target);
  const create = record(source.create, "create");
  const workspaceMetadata = record(create.workspaceMetadata, "create.workspaceMetadata");
  if (workspaceMetadata.indexGeneration !== afterIndex || target!.contentSha256 !== create.contentSha256 || target!.catalogEntry.displayName !== workspaceMetadata.displayName) blocked("Project create target reread does not match the operation receipt.");
  validateTerminalHistory(source.history, batchId, targetProjectId, target);
  return source as ProjectCreateExecutionReceipt;
}

export function bridgeProjectCreateExecutionToTerminalHistory(input: unknown): ProjectCreateTerminalHistoryReceipt {
  const source = validateExecutionReceipt(input);
  const before = source.before;
  const afterApply = source.afterApply;
  const target = afterApply.target!;
  const history = validateTerminalHistory(source.history, source.batchId, source.targetProjectId, target);
  return {
    schemaVersion: PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.create.execute",
    commandKind: "project.create",
    targetProjectId: source.targetProjectId,
    batchId: source.batchId,
    history,
    historyStatus: "committed",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { before, afterApply },
    sourceReceipt: source,
    authority: { target: "local-project", apply: "operation-specific", genericExecutor: false },
    targetAuthority: "local-project",
    applyAuthority: "operation-specific",
    noGenericExecutor: true,
    bridgeOnly: true,
    noExecutionAuthority: true,
    authoritativeReread: true,
    noProjectMutation: true,
    execution: "not-implemented",
    readyClaim: false,
    foreignStatePreserved: true,
    noFoundryWrite: true,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    targetCreated: true,
    firstGenerationBackupMissing: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

export function bridgeProjectCreateRedoToTerminalHistory(input: unknown): ProjectCreateRedoTerminalHistoryReceipt {
  const source = record(input, "Project create redo receipt");
  exact(source.operation, "dicebox.project.create.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const targetProjectId = string(source.targetProjectId, "redo receipt.targetProjectId", stableIdPattern);
  const batchId = string(source.batchId, "redo receipt.batchId", stableIdPattern);
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  const sourceReceipt = validateExecutionReceipt(source.sourceReceipt);
  if (sourceReceipt.targetProjectId !== targetProjectId || sourceReceipt.batchId !== batchId) blocked("Project create redo receipt is foreign to its source create receipt.");
  const beforeRedo = validateRedoAbsentRead(source.beforeRedo, "redo receipt.beforeRedo");
  const afterRedo = validateRedoPresentRead(source.afterRedo, targetProjectId, "redo receipt.afterRedo");
  const originalTarget = sourceReceipt.afterApply.target!;
  const redoneTarget = afterRedo.target!;
  if (redoneTarget.generation <= originalTarget.generation || redoneTarget.contentSha256 !== originalTarget.contentSha256 || redoneTarget.scenesSha256 !== originalTarget.scenesSha256 || redoneTarget.assetCollectionSha256 !== originalTarget.assetCollectionSha256) blocked("Project create redo does not preserve the exact first-generation content identity through a later authoritative reread.");
  const history = validateRedoneCreateHistory(source.history, batchId, targetProjectId, afterRedo);
  const matchedReread = record(source.matchedReread, "redo receipt.matchedReread");
  exact(matchedReread.status, "matched", "redo receipt.matchedReread.status");
  exact(matchedReread.targetId, targetProjectId, "redo receipt.matchedReread.targetId");
  if (matchedReread.revision !== redoneTarget.generation || matchedReread.sha256 !== redoneTarget.contentSha256) blocked("Project create redo matched reread does not match the authoritative redone target.");
  return {
    schemaVersion: PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.create.redo",
    commandKind: "project.create",
    targetProjectId,
    batchId,
    history,
    historyStatus: "redone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { beforeRedo, afterRedo },
    matchedReread: matchedReread as ProjectCreateRedoTerminalHistoryReceipt["matchedReread"],
    sourceReceipt,
    authority: { target: "local-project", apply: "operation-specific", genericExecutor: false },
    targetAuthority: "local-project",
    applyAuthority: "operation-specific",
    noGenericExecutor: true,
    bridgeOnly: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
    authoritativeReread: true,
    noProjectMutation: true,
    execution: "not-implemented",
    readyClaim: false,
    foreignStatePreserved: true,
    noFoundryWrite: true,
    sourceProjectContentWrite: false,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectCreateTerminalHistoryReceipt {
  const receipt = record(input, "Project create terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_CREATE_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.create.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.create", "terminal-history receipt.commandKind");
  const targetProjectId = string(receipt.targetProjectId, "terminal-history receipt.targetProjectId", stableIdPattern);
  const batchId = string(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  exact(receipt.historyStatus, "committed", "terminal-history receipt.historyStatus");
  trueValue(receipt.targetAuthority === "local-project", "terminal-history receipt.targetAuthority");
  trueValue(receipt.applyAuthority === "operation-specific", "terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  if (receipt.readyClaim !== false) blocked("terminal-history receipt.readyClaim must be false.");
  trueValue(receipt.foreignStatePreserved, "terminal-history receipt.foreignStatePreserved");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  trueValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  trueValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  trueValue(receipt.targetCreated, "terminal-history receipt.targetCreated");
  trueValue(receipt.firstGenerationBackupMissing, "terminal-history receipt.firstGenerationBackupMissing");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker or outcome-unknown semantics.");
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = record(rereads.before, "terminal-history receipt.authoritativeRereads.before");
  if (before.target !== null || before.targetAbsent !== true) blocked("terminal-history receipt.before does not retain target absence.");
  trueValue(before.noWrite, "terminal-history receipt.before.noWrite");
  trueValue(before.noFoundryWrite, "terminal-history receipt.before.noFoundryWrite");
  const after = record(rereads.afterApply, "terminal-history receipt.authoritativeRereads.afterApply");
  if (after.targetAbsent !== false) blocked("terminal-history receipt.afterApply does not retain target creation.");
  trueValue(after.noWrite, "terminal-history receipt.afterApply.noWrite");
  trueValue(after.noFoundryWrite, "terminal-history receipt.afterApply.noFoundryWrite");
  const target = validateTargetRead(after.target, targetProjectId, "terminal-history receipt.authoritativeRereads.afterApply.target");
  validateTerminalHistory(receipt.history, batchId, targetProjectId, target);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.targetProjectId !== targetProjectId || source.batchId !== batchId) blocked("terminal-history receipt is not bound to the validated operation-specific source receipt.");
  return receipt as ProjectCreateTerminalHistoryReceipt;
}

export const projectCreateTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectCreateTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectCreateTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectCreateTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectCreateTerminalHistoryValidationError
        ? error
        : new ProjectCreateTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const projectCreateRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectCreateRedoTerminalHistoryReceipt {
    return bridgeProjectCreateRedoToTerminalHistory(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectCreateRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectCreateTerminalHistoryValidationError }> {
    try {
      return { success: true, data: bridgeProjectCreateRedoToTerminalHistory(input) };
    } catch (error) {
      const validationError = error instanceof ProjectCreateTerminalHistoryValidationError
        ? error
        : new ProjectCreateTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
