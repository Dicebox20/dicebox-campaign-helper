import {
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  validateProposalBatchHistory,
  type ProposalBatchHistory,
} from "@dicebox/core";
import type {
  ProjectSaveAuthoritativeRead,
  ProjectSaveExecutionFailureCode,
  ProjectSaveExecutionReceipt,
} from "./project-save-executor";

export const PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectSaveTerminalHistoryBlockerCode = ProjectSaveExecutionFailureCode | "TERMINAL_HISTORY_VALIDATION_FAILED";

export type ProjectSaveTerminalHistoryBlocker = Readonly<{
  code: ProjectSaveTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
}>;

export type ProjectSaveTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.save.execute";
  commandKind: "project.save";
  projectId: string;
  batchId: string;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectSaveAuthoritativeRead;
    afterApply: ProjectSaveAuthoritativeRead;
    afterUndo: ProjectSaveAuthoritativeRead;
  }>;
  sourceReceipt: ProjectSaveExecutionReceipt;
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
  sourceProjectContentWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectSaveRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.save.redo";
  commandKind: "project.save";
  projectId: string;
  batchId: string;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectSaveAuthoritativeRead;
    afterRedo: ProjectSaveAuthoritativeRead;
  }>;
  matchedReread: Readonly<{
    status: "matched";
    targetId: string;
    revision: number;
    sha256: string;
  }>;
  redoReceipt: ProjectSaveExecutionReceipt["save"];
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
  sourceProjectContentWrite: false;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectSaveTerminalHistoryValidationError extends Error {
  readonly code: "TERMINAL_HISTORY_VALIDATION_FAILED";
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectSaveTerminalHistoryValidationError";
    this.code = "TERMINAL_HISTORY_VALIDATION_FAILED";
  }
}

function blocked(message: string): never {
  throw new ProjectSaveTerminalHistoryValidationError(message);
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
  if (typeof value !== "string" || value.length === 0 || (pattern !== undefined && !pattern.test(value))) {
    blocked(`${label} must be a non-empty value with the expected format.`);
  }
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

function exact(value: unknown, expected: string, label: string): void {
  if (value !== expected) blocked(`${label} must be ${expected}.`);
}

function validateProjectRead(value: unknown, projectId: string, label: string): ProjectSaveAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = string(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  string(read.semanticContentSha256, `${label}.semanticContentSha256`, sha256Pattern);
  string(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  const assetCount = integer(read.assetCount, `${label}.assetCount`);
  const primaryByteSha256 = string(read.primaryByteSha256, `${label}.primaryByteSha256`, sha256Pattern);
  const backupByteSha256 = string(read.backupByteSha256, `${label}.backupByteSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not an accepted catalog status.`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`).map((entry) => record(entry, `${label}.catalog.entries[]`));
  const matchingCatalogEntries = catalogEntries.filter((entry) => entry.projectId === projectId);
  if (matchingCatalogEntries.length !== 1) blocked(`${label}.catalog must contain exactly one entry for the target project.`);

  const catalogEntry = record(read.catalogEntry, `${label}.catalogEntry`);
  exact(catalogEntry.projectId, projectId, `${label}.catalogEntry.projectId`);
  exact(catalogEntry.status, "PASS", `${label}.catalogEntry.status`);
  if (catalogEntry.generation !== generation || catalogEntry.contentSha256 !== contentSha256) blocked(`${label}.catalogEntry does not match the authoritative project generation and hash.`);

  const project = record(read.project, `${label}.project`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256) blocked(`${label}.project receipt does not match the authoritative project generation and hash.`);
  exact(projectReceipt.activeSceneId, read.activeSceneId as string, `${label}.project.receipt.activeSceneId`);
  if (projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assetCount) blocked(`${label}.project receipt counts do not match the authoritative project read.`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);
  if (!Array.isArray(project.scenesJson) || project.scenesJson.length !== sceneCount) blocked(`${label}.project.scenesJson does not match the authoritative Scene count.`);
  if (!Array.isArray(project.assets) || project.assets.length !== assetCount) blocked(`${label}.project.assets does not match the authoritative asset count.`);
  exact(project.activeSceneId, read.activeSceneId as string, `${label}.project.activeSceneId`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, projectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the authoritative project generation and hash.`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  exact(backup.status, "VALID", `${label}.recovery.backup.status`);
  exact(primary.byteSha256, primaryByteSha256, `${label}.recovery.primary.byteSha256`);
  exact(backup.byteSha256, backupByteSha256, `${label}.recovery.backup.byteSha256`);

  return read as ProjectSaveAuthoritativeRead;
}

function validateSaveReceipt(value: unknown, projectId: string, generation: number, contentSha256: string, label: string): void {
  const save = record(value, label);
  exact(save.operation, "dicebox.project.save", `${label}.operation`);
  exact(save.status, "PASS", `${label}.status`);
  exact(save.projectId, projectId, `${label}.projectId`);
  if (save.generation !== generation || save.contentSha256 !== contentSha256) blocked(`${label} does not match its authoritative post-operation reread.`);
  string(save.sceneSha256, `${label}.sceneSha256`, sha256Pattern);
  integer(save.sceneCount, `${label}.sceneCount`);
  string(save.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  if (integer(save.assetCount, `${label}.assetCount`) < 0) blocked(`${label}.assetCount cannot be negative.`);
  if (!Array.isArray(save.scenes) || save.scenes.length !== save.sceneCount) blocked(`${label}.scenes does not match sceneCount.`);
  string(save.projectRelativePath, `${label}.projectRelativePath`);
  trueValue(save.atomicReplace, `${label}.atomicReplace`);
  trueValue(save.directoryEntrySync, `${label}.directoryEntrySync`);
  trueValue(save.backupPreserved, `${label}.backupPreserved`);
  trueValue(save.noFoundryWrite, `${label}.noFoundryWrite`);
}

function validateTerminalHistory(value: unknown, batchId: string, projectId: string, afterApply: ProjectSaveAuthoritativeRead, afterUndo: ProjectSaveAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project save proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project save history must end in exactly five receipts with status undone.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("Project save history does not use the expected preview-to-undo transition sequence.");
  const commit = history.receipts[3]!;
  const undo = history.receipts[4]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== projectId || commit.reread.revision !== afterApply.generation || commit.reread.sha256 !== afterApply.contentSha256) {
    blocked("Commit history does not retain the matched authoritative afterApply reread.");
  }
  if (undo.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== afterUndo.generation || undo.reread.sha256 !== afterUndo.contentSha256) {
    blocked("Undo history does not retain the matched authoritative afterUndo reread.");
  }
  return history;
}

function validateRedoneTerminalHistory(value: unknown, batchId: string, projectId: string, beforeRedo: ProjectSaveAuthoritativeRead, afterRedo: ProjectSaveAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project save redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) blocked("Project save redo history must end in exactly six receipts with status redone.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) blocked("Project save redo history does not use the expected preview-to-redo transition sequence.");
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (undo.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== beforeRedo.generation || undo.reread.sha256 !== beforeRedo.contentSha256) {
    blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  }
  if (redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus || redo.reread.targetId !== projectId || redo.reread.revision !== afterRedo.generation || redo.reread.sha256 !== afterRedo.contentSha256) {
    blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  }
  return history;
}

export function bridgeProjectSaveExecutionToTerminalHistory(input: unknown): ProjectSaveTerminalHistoryReceipt {
  const source = record(input, "Project save execution receipt");
  exact(source.operation, "dicebox.project.save.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const projectId = string(source.projectId, "execution receipt.projectId", stableIdPattern);
  const batchId = string(source.batchId, "execution receipt.batchId", stableIdPattern);
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");

  const before = validateProjectRead(source.before, projectId, "before");
  const afterApply = validateProjectRead(source.afterApply, projectId, "afterApply");
  const afterUndo = validateProjectRead(source.afterUndo, projectId, "afterUndo");
  if (afterApply.generation !== before.generation + 1 || afterUndo.generation !== afterApply.generation + 1) blocked("Project save rereads do not show two exact monotonic generations.");
  if (afterApply.semanticContentSha256 === before.semanticContentSha256 || afterUndo.semanticContentSha256 !== before.semanticContentSha256) blocked("Project save rereads do not prove changed content followed by semantic restoration.");
  if (afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256) blocked("Project save rereads do not prove backup preservation and envelope rotation.");

  validateSaveReceipt(source.save, projectId, afterApply.generation, afterApply.contentSha256, "save");
  validateSaveReceipt(source.inverseRestore, projectId, afterUndo.generation, afterUndo.contentSha256, "inverseRestore");
  const history = validateTerminalHistory(source.history, batchId, projectId, afterApply, afterUndo);

  return {
    schemaVersion: PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.save.execute",
    commandKind: "project.save",
    projectId,
    batchId,
    history,
    historyStatus: "undone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { before, afterApply, afterUndo },
    sourceReceipt: source as ProjectSaveExecutionReceipt,
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
    sourceProjectContentWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function validateMatchedRedoReread(value: unknown, projectId: string, afterRedo: ProjectSaveAuthoritativeRead): ProjectSaveRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Project save redo matched reread");
  exact(reread.status, "matched", "Project save redo matched reread.status");
  exact(reread.targetId, projectId, "Project save redo matched reread.targetId");
  if (integer(reread.revision, "Project save redo matched reread.revision") !== afterRedo.generation) blocked("Project save redo matched reread revision does not match afterRedo.");
  const sha256 = string(reread.sha256, "Project save redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.contentSha256) blocked("Project save redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.generation, sha256: afterRedo.contentSha256 };
}

export function bridgeProjectSaveRedoToTerminalHistory(input: unknown): ProjectSaveRedoTerminalHistoryReceipt {
  const source = record(input, "Project save redo receipt");
  exact(source.operation, "dicebox.project.save.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = string(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = string(source.batchId, "redo receipt.batchId", stableIdPattern);
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");

  const beforeRedo = validateProjectRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateProjectRead(source.afterRedo, projectId, "afterRedo");
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Project save redo rereads do not show one exact monotonic generation.");
  if (afterRedo.semanticContentSha256 === beforeRedo.semanticContentSha256) blocked("Project save redo rereads do not prove a changed semantic post-state.");
  if (afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256 || afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256) blocked("Project save redo rereads do not prove a rotated post-redo envelope.");

  const redoReceipt = record(source.redoReceipt, "redoReceipt");
  validateSaveReceipt(redoReceipt, projectId, afterRedo.generation, afterRedo.contentSha256, "redoReceipt");
  const history = validateRedoneTerminalHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);

  return {
    schemaVersion: PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.save.redo",
    commandKind: "project.save",
    projectId,
    batchId,
    history,
    historyStatus: "redone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { beforeRedo, afterRedo },
    matchedReread,
    redoReceipt: redoReceipt as ProjectSaveExecutionReceipt["save"],
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
    sourceProjectContentWrite: false,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
    noTransitionAuthority: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema",
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectSaveTerminalHistoryReceipt {
  const receipt = record(input, "Project save terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.save.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.save", "terminal-history receipt.commandKind");
  const projectId = string(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = string(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  exact(receipt.historyStatus, "undone", "terminal-history receipt.historyStatus");
  trueValue(receipt.targetAuthority === "local-project", "terminal-history receipt.targetAuthority");
  trueValue(receipt.applyAuthority === "operation-specific", "terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor === true, "terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  if (receipt.readyClaim !== false) blocked("terminal-history receipt.readyClaim must be false.");
  trueValue(receipt.foreignStatePreserved, "terminal-history receipt.foreignStatePreserved");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  trueValue(receipt.sourceProjectContentWrite, "terminal-history receipt.sourceProjectContentWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) {
    blocked("A successful terminal-undone receipt cannot erase blocker or outcome-unknown semantics.");
  }

  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateProjectRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateProjectRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateProjectRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  validateTerminalHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) {
    blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  }
  const source = record(receipt.sourceReceipt, "terminal-history receipt.sourceReceipt");
  const sourceReceipt = bridgeProjectSaveExecutionToTerminalHistory(source);
  if (sourceReceipt.projectId !== projectId || sourceReceipt.batchId !== batchId || sourceReceipt.historyStatus !== "undone" || before.generation !== sourceReceipt.authoritativeRereads.before.generation || afterApply.generation !== sourceReceipt.authoritativeRereads.afterApply.generation || afterUndo.generation !== sourceReceipt.authoritativeRereads.afterUndo.generation) {
    blocked("terminal-history receipt is not bound to the validated operation-specific source receipt.");
  }
  return receipt as ProjectSaveTerminalHistoryReceipt;
}

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectSaveRedoTerminalHistoryReceipt {
  const receipt = record(input, "Project save redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_SAVE_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.save.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.save", "redo terminal-history receipt.commandKind");
  const projectId = string(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = string(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  exact(receipt.historyStatus, "redone", "redo terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "redo terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "redo terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "redo terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "redo terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "redo terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "redo terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "redo terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "redo terminal-history receipt.execution");
  if (receipt.readyClaim !== false || receipt.sourceProjectContentWrite !== false || receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) {
    blocked("A successful terminal-redone receipt cannot add mutation authority or erase outcome-unknown semantics.");
  }
  trueValue(receipt.foreignStatePreserved, "redo terminal-history receipt.foreignStatePreserved");
  trueValue(receipt.noFoundryWrite, "redo terminal-history receipt.noFoundryWrite");
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectSaveRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");

  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const beforeRedo = validateProjectRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateProjectRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Redo terminal-history receipt does not retain one exact monotonic generation.");
  if (afterRedo.semanticContentSha256 === beforeRedo.semanticContentSha256) blocked("Redo terminal-history receipt does not prove a changed semantic post-state.");
  validateRedoneTerminalHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  validateSaveReceipt(receipt.redoReceipt, projectId, afterRedo.generation, afterRedo.contentSha256, "redo terminal-history receipt.redoReceipt");
  const matchedReread = validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  if (matchedReread.revision !== afterRedo.generation || matchedReread.sha256 !== afterRedo.contentSha256) blocked("Redo terminal-history receipt matched reread drifted from afterRedo.");
  return receipt as ProjectSaveRedoTerminalHistoryReceipt;
}

export const projectSaveTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectSaveTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectSaveTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectSaveTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectSaveTerminalHistoryValidationError
        ? error
        : new ProjectSaveTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const projectSaveRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectSaveRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectSaveRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectSaveTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectSaveTerminalHistoryValidationError
        ? error
        : new ProjectSaveTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
