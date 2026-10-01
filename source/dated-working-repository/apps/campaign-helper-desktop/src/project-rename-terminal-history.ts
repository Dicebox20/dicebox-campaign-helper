import {
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  validateProposalBatchHistory,
  type ProposalBatchHistory,
} from "@dicebox/core";
import type {
  ProjectRenameAuthoritativeRead,
  ProjectRenameExecutionFailureCode,
  ProjectRenameExecutionReceipt,
} from "./project-rename-executor";
import type { WorkspaceMetadataReceipt } from "./project-store";

export const PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectRenameTerminalHistoryBlockerCode = ProjectRenameExecutionFailureCode | "TERMINAL_HISTORY_VALIDATION_FAILED";

export type ProjectRenameTerminalHistoryBlocker = Readonly<{
  code: ProjectRenameTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
}>;

export type ProjectRenameTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.rename.execute";
  commandKind: "project.rename";
  projectId: string;
  batchId: string;
  currentDisplayName: string;
  proposedDisplayName: string;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectRenameAuthoritativeRead;
    afterApply: ProjectRenameAuthoritativeRead;
    afterUndo: ProjectRenameAuthoritativeRead;
  }>;
  sourceReceipt: ProjectRenameExecutionReceipt;
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
  projectContentWrite: false;
  sourceProjectContentWrite: false;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectRenameRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.rename.redo";
  commandKind: "project.rename";
  projectId: string;
  batchId: string;
  currentDisplayName: string;
  proposedDisplayName: string;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectRenameAuthoritativeRead;
    afterRedo: ProjectRenameAuthoritativeRead;
  }>;
  matchedReread: Readonly<{
    status: "matched";
    targetId: string;
    revision: number;
    sha256: string;
  }>;
  redoReceipt: WorkspaceMetadataReceipt;
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
  rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectRenameTerminalHistoryValidationError extends Error {
  readonly code: "TERMINAL_HISTORY_VALIDATION_FAILED";
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectRenameTerminalHistoryValidationError";
    this.code = "TERMINAL_HISTORY_VALIDATION_FAILED";
  }
}

function blocked(message: string): never {
  throw new ProjectRenameTerminalHistoryValidationError(message);
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

function displayName(value: unknown, label: string): string {
  const result = string(value, label);
  if (result.trim() !== result || result.trim().length === 0) blocked(`${label} must be a trimmed non-empty display name.`);
  return result;
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

function nullableString(value: unknown, label: string): string | null {
  if (value !== null && typeof value !== "string") blocked(`${label} must be a string or null.`);
  return value as string | null;
}

function exact(value: unknown, expected: string, label: string): void {
  if (value !== expected) blocked(`${label} must be ${expected}.`);
}

function validateProjectRead(value: unknown, projectId: string, label: string): ProjectRenameAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const readDisplayName = displayName(read.displayName, `${label}.displayName`);
  const workspaceIndexGeneration = integer(read.workspaceIndexGeneration, `${label}.workspaceIndexGeneration`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = string(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  string(read.authoritativeStateSha256, `${label}.authoritativeStateSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not an accepted catalog status.`);
  if (catalog.workspaceIndexGeneration !== workspaceIndexGeneration) blocked(`${label}.catalog workspace generation does not match the authoritative read.`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`).map((entry) => record(entry, `${label}.catalog.entries[]`));
  const matchingCatalogEntries = catalogEntries.filter((entry) => entry.projectId === projectId);
  if (matchingCatalogEntries.length !== 1) blocked(`${label}.catalog must contain exactly one entry for the target project.`);

  const catalogEntry = record(read.catalogEntry, `${label}.catalogEntry`);
  exact(catalogEntry.projectId, projectId, `${label}.catalogEntry.projectId`);
  exact(catalogEntry.status, "PASS", `${label}.catalogEntry.status`);
  if (
    catalogEntry.displayName !== readDisplayName
    || catalogEntry.generation !== generation
    || catalogEntry.contentSha256 !== contentSha256
  ) blocked(`${label}.catalogEntry does not match the authoritative project identity, name, generation, or hash.`);
  integer(catalogEntry.lastOpenedSequence, `${label}.catalogEntry.lastOpenedSequence`);
  nullableString(catalogEntry.recoveredFrom, `${label}.catalogEntry.recoveredFrom`);
  nullableString(catalogEntry.workspaceMetadataWarning, `${label}.catalogEntry.workspaceMetadataWarning`);
  if (catalogEntry.sceneCount !== null) integer(catalogEntry.sceneCount, `${label}.catalogEntry.sceneCount`);
  if (catalogEntry.assetCount !== null) integer(catalogEntry.assetCount, `${label}.catalogEntry.assetCount`);
  if (catalogEntry.generation !== null) integer(catalogEntry.generation, `${label}.catalogEntry.generation`);
  if (catalogEntry.contentSha256 !== null) string(catalogEntry.contentSha256, `${label}.catalogEntry.contentSha256`, sha256Pattern);
  nullableString(catalogEntry.blockerCode, `${label}.catalogEntry.blockerCode`);
  nullableString(catalogEntry.sceneId, `${label}.catalogEntry.sceneId`);
  nullableString(catalogEntry.sceneName, `${label}.catalogEntry.sceneName`);
  nullableString(catalogEntry.activeSceneId, `${label}.catalogEntry.activeSceneId`);

  const project = record(read.project, `${label}.project`);
  const scenesJson = array(project.scenesJson, `${label}.project.scenesJson`);
  const assets = array(project.assets, `${label}.project.assets`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (
    projectReceipt.generation !== generation
    || projectReceipt.contentSha256 !== contentSha256
    || projectReceipt.persistedContentSha256 !== contentSha256
    || projectReceipt.sceneCount !== scenesJson.length
    || projectReceipt.assetCount !== assets.length
    || projectReceipt.activeSceneId !== project.activeSceneId
  ) blocked(`${label}.project receipt does not match the authoritative project generation, hash, or collection counts.`);
  string(projectReceipt.contentSha256, `${label}.project.receipt.contentSha256`, sha256Pattern);
  string(projectReceipt.persistedContentSha256, `${label}.project.receipt.persistedContentSha256`, sha256Pattern);
  string(projectReceipt.sceneSha256, `${label}.project.receipt.sceneSha256`, sha256Pattern);
  string(projectReceipt.activeSceneId, `${label}.project.receipt.activeSceneId`, stableIdPattern);
  integer(projectReceipt.generation, `${label}.project.receipt.generation`);
  integer(projectReceipt.sceneCount, `${label}.project.receipt.sceneCount`);
  integer(projectReceipt.assetCount, `${label}.project.receipt.assetCount`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  return read as ProjectRenameAuthoritativeRead;
}

function validateWorkspaceRenameReceipt(
  value: unknown,
  projectId: string,
  displayNameValue: string,
  state: ProjectRenameAuthoritativeRead,
  label: string,
): void {
  const receipt = record(value, label);
  exact(receipt.operation, "dicebox.workspace-metadata.rename", `${label}.operation`);
  exact(receipt.status, "PASS", `${label}.status`);
  exact(receipt.projectId, projectId, `${label}.projectId`);
  exact(receipt.displayName, displayNameValue, `${label}.displayName`);
  if (receipt.indexGeneration !== state.workspaceIndexGeneration) blocked(`${label}.indexGeneration does not match its authoritative reread.`);
  if (receipt.contentSha256 !== state.contentSha256) blocked(`${label}.contentSha256 does not match its authoritative reread.`);
  integer(receipt.lastOpenedSequence, `${label}.lastOpenedSequence`);
  nullableString(receipt.recoveredFrom, `${label}.recoveredFrom`);
  trueValue(receipt.atomicReplace, `${label}.atomicReplace`);
  trueValue(receipt.directoryEntrySync, `${label}.directoryEntrySync`);
  trueValue(receipt.backupPreserved, `${label}.backupPreserved`);
  trueValue(receipt.noFoundryWrite, `${label}.noFoundryWrite`);
  string(receipt.contentSha256, `${label}.contentSha256`, sha256Pattern);
  integer(receipt.indexGeneration, `${label}.indexGeneration`);
}

function validateTerminalHistory(
  value: unknown,
  batchId: string,
  projectId: string,
  afterApply: ProjectRenameAuthoritativeRead,
  afterUndo: ProjectRenameAuthoritativeRead,
): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project rename proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) {
    blocked("Project rename history must end in exactly five receipts with status undone.");
  }
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) {
    blocked("Project rename history does not use the expected preview-to-undo transition sequence.");
  }
  const commit = history.receipts[3]!;
  const undo = history.receipts[4]!;
  if (
    commit.reread?.status !== "matched"
    || commit.reread.targetId !== projectId
    || commit.reread.revision !== afterApply.workspaceIndexGeneration
    || commit.reread.sha256 !== afterApply.authoritativeStateSha256
  ) blocked("Commit history does not retain the matched authoritative afterApply reread.");
  if (
    undo.reread?.status !== "matched"
    || undo.reread.targetId !== projectId
    || undo.reread.revision !== afterUndo.workspaceIndexGeneration
    || undo.reread.sha256 !== afterUndo.authoritativeStateSha256
  ) blocked("Undo history does not retain the matched authoritative afterUndo reread.");
  return history;
}

function validateRedoneTerminalHistory(
  value: unknown,
  batchId: string,
  projectId: string,
  beforeRedo: ProjectRenameAuthoritativeRead,
  afterRedo: ProjectRenameAuthoritativeRead,
): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project rename redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) {
    blocked("Project rename redo history must end in exactly six receipts with status redone.");
  }
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) {
    blocked("Project rename redo history does not use the expected preview-to-redo transition sequence.");
  }
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (
    undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus
    || undo.reread.targetId !== projectId
    || undo.reread.revision !== beforeRedo.workspaceIndexGeneration
    || undo.reread.sha256 !== beforeRedo.authoritativeStateSha256
  ) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (
    redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus
    || redo.reread.targetId !== projectId
    || redo.reread.revision !== afterRedo.workspaceIndexGeneration
    || redo.reread.sha256 !== afterRedo.authoritativeStateSha256
  ) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateExecutionReceipt(input: unknown): {
  source: ProjectRenameExecutionReceipt;
  projectId: string;
  batchId: string;
  currentDisplayName: string;
  proposedDisplayName: string;
  before: ProjectRenameAuthoritativeRead;
  afterApply: ProjectRenameAuthoritativeRead;
  afterUndo: ProjectRenameAuthoritativeRead;
  history: ProposalBatchHistory;
} {
  const source = record(input, "Project rename execution receipt");
  exact(source.operation, "dicebox.project.rename.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const projectId = string(source.projectId, "execution receipt.projectId", stableIdPattern);
  const batchId = string(source.batchId, "execution receipt.batchId", stableIdPattern);
  const currentDisplayName = displayName(source.currentDisplayName, "execution receipt.currentDisplayName");
  const proposedDisplayName = displayName(source.proposedDisplayName, "execution receipt.proposedDisplayName");
  if (currentDisplayName === proposedDisplayName) blocked("execution receipt display-name transition must contain a change.");
  falseValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");

  const before = validateProjectRead(source.before, projectId, "before");
  const afterApply = validateProjectRead(source.afterApply, projectId, "afterApply");
  const afterUndo = validateProjectRead(source.afterUndo, projectId, "afterUndo");
  if (
    before.displayName !== currentDisplayName
    || afterApply.displayName !== proposedDisplayName
    || afterUndo.displayName !== currentDisplayName
  ) blocked("Project rename rereads do not prove the exact Before-to-proposed-to-Before display-name transition.");
  if (
    afterApply.workspaceIndexGeneration !== before.workspaceIndexGeneration + 1
    || afterUndo.workspaceIndexGeneration !== afterApply.workspaceIndexGeneration + 1
  ) blocked("Project rename rereads do not prove exact monotonic workspace index-generation increments.");
  if (
    afterApply.generation !== before.generation
    || afterUndo.generation !== before.generation
    || afterApply.contentSha256 !== before.contentSha256
    || afterUndo.contentSha256 !== before.contentSha256
  ) blocked("Project rename rereads do not prove unchanged project content generation and hash.");
  if (
    afterApply.authoritativeStateSha256 === before.authoritativeStateSha256
    || afterUndo.authoritativeStateSha256 === afterApply.authoritativeStateSha256
  ) blocked("Project rename rereads do not prove distinct authoritative metadata states.");

  validateWorkspaceRenameReceipt(source.apply, projectId, proposedDisplayName, afterApply, "apply");
  validateWorkspaceRenameReceipt(source.undo, projectId, currentDisplayName, afterUndo, "undo");
  const history = validateTerminalHistory(source.history, batchId, projectId, afterApply, afterUndo);

  return {
    source: source as ProjectRenameExecutionReceipt,
    projectId,
    batchId,
    currentDisplayName,
    proposedDisplayName,
    before,
    afterApply,
    afterUndo,
    history,
  };
}

export function bridgeProjectRenameExecutionToTerminalHistory(input: unknown): ProjectRenameTerminalHistoryReceipt {
  const validated = validateExecutionReceipt(input);
  return {
    schemaVersion: PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.rename.execute",
    commandKind: "project.rename",
    projectId: validated.projectId,
    batchId: validated.batchId,
    currentDisplayName: validated.currentDisplayName,
    proposedDisplayName: validated.proposedDisplayName,
    history: validated.history,
    historyStatus: "undone",
    historyTransitions: validated.history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: {
      before: validated.before,
      afterApply: validated.afterApply,
      afterUndo: validated.afterUndo,
    },
    sourceReceipt: validated.source,
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
    projectContentWrite: false,
    sourceProjectContentWrite: false,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function validateMatchedRedoReread(
  value: unknown,
  projectId: string,
  afterRedo: ProjectRenameAuthoritativeRead,
): ProjectRenameRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Project rename redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "Project rename redo matched reread.status");
  exact(reread.targetId, projectId, "Project rename redo matched reread.targetId");
  if (integer(reread.revision, "Project rename redo matched reread.revision") !== afterRedo.workspaceIndexGeneration) {
    blocked("Project rename redo matched reread revision does not match afterRedo.");
  }
  const sha256 = string(reread.sha256, "Project rename redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.authoritativeStateSha256) blocked("Project rename redo matched reread hash does not match afterRedo.");
  return {
    status: "matched",
    targetId: projectId,
    revision: afterRedo.workspaceIndexGeneration,
    sha256: afterRedo.authoritativeStateSha256,
  };
}

export function bridgeProjectRenameRedoToTerminalHistory(input: unknown): ProjectRenameRedoTerminalHistoryReceipt {
  const source = record(input, "Project rename redo receipt");
  exact(source.operation, "dicebox.project.rename.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = string(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = string(source.batchId, "redo receipt.batchId", stableIdPattern);
  const currentDisplayName = displayName(source.currentDisplayName, "redo receipt.currentDisplayName");
  const proposedDisplayName = displayName(source.proposedDisplayName, "redo receipt.proposedDisplayName");
  if (currentDisplayName === proposedDisplayName) blocked("redo receipt display-name transition must contain a change.");
  falseValue(source.projectContentWrite, "redo receipt.projectContentWrite");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");

  const beforeRedo = validateProjectRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateProjectRead(source.afterRedo, projectId, "afterRedo");
  if (beforeRedo.displayName !== currentDisplayName || afterRedo.displayName !== proposedDisplayName) {
    blocked("Project rename redo rereads do not prove the exact current-to-proposed display-name transition.");
  }
  if (afterRedo.workspaceIndexGeneration !== beforeRedo.workspaceIndexGeneration + 1) {
    blocked("Project rename redo rereads do not show one exact monotonic workspace-index generation.");
  }
  if (
    afterRedo.generation !== beforeRedo.generation
    || afterRedo.contentSha256 !== beforeRedo.contentSha256
    || afterRedo.authoritativeStateSha256 === beforeRedo.authoritativeStateSha256
  ) blocked("Project rename redo rereads do not prove unchanged project content and a distinct authoritative metadata state.");

  const redoReceipt = record(source.redoReceipt, "redoReceipt");
  validateWorkspaceRenameReceipt(redoReceipt, projectId, proposedDisplayName, afterRedo, "redoReceipt");
  const history = validateRedoneTerminalHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);

  return {
    schemaVersion: PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.rename.redo",
    commandKind: "project.rename",
    projectId,
    batchId,
    currentDisplayName,
    proposedDisplayName,
    history,
    historyStatus: "redone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { beforeRedo, afterRedo },
    matchedReread,
    redoReceipt: redoReceipt as WorkspaceMetadataReceipt,
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
    rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectRenameTerminalHistoryReceipt {
  const receipt = record(input, "Project rename terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.rename.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.rename", "terminal-history receipt.commandKind");
  const projectId = string(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = string(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const currentDisplayName = displayName(receipt.currentDisplayName, "terminal-history receipt.currentDisplayName");
  const proposedDisplayName = displayName(receipt.proposedDisplayName, "terminal-history receipt.proposedDisplayName");
  if (currentDisplayName === proposedDisplayName) blocked("terminal-history receipt display-name transition must contain a change.");
  exact(receipt.historyStatus, "undone", "terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  if (receipt.readyClaim !== false) blocked("terminal-history receipt.readyClaim must be false.");
  trueValue(receipt.foreignStatePreserved, "terminal-history receipt.foreignStatePreserved");
  falseValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  falseValue(receipt.sourceProjectContentWrite, "terminal-history receipt.sourceProjectContentWrite");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) {
    blocked("A successful terminal-undone receipt cannot erase blocker or outcome-unknown semantics.");
  }

  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  if (authority.genericExecutor !== false) blocked("terminal-history receipt.authority.genericExecutor must be false.");

  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateProjectRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateProjectRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateProjectRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  if (
    before.displayName !== currentDisplayName
    || afterApply.displayName !== proposedDisplayName
    || afterUndo.displayName !== currentDisplayName
    || afterApply.workspaceIndexGeneration !== before.workspaceIndexGeneration + 1
    || afterUndo.workspaceIndexGeneration !== afterApply.workspaceIndexGeneration + 1
    || afterApply.generation !== before.generation
    || afterUndo.generation !== before.generation
    || afterApply.contentSha256 !== before.contentSha256
    || afterUndo.contentSha256 !== before.contentSha256
  ) blocked("terminal-history receipt does not retain the exact rename transition and unchanged content evidence.");

  const history = validateTerminalHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) {
    blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  }
  const source = record(receipt.sourceReceipt, "terminal-history receipt.sourceReceipt");
  const sourceReceipt = validateExecutionReceipt(source);
  if (
    sourceReceipt.projectId !== projectId
    || sourceReceipt.batchId !== batchId
    || sourceReceipt.currentDisplayName !== currentDisplayName
    || sourceReceipt.proposedDisplayName !== proposedDisplayName
    || sourceReceipt.before.displayName !== before.displayName
    || sourceReceipt.afterApply.displayName !== afterApply.displayName
    || sourceReceipt.afterUndo.displayName !== afterUndo.displayName
    || sourceReceipt.history.status !== history.status
  ) {
    blocked("terminal-history receipt is not bound to the validated operation-specific source receipt.");
  }
  return receipt as ProjectRenameTerminalHistoryReceipt;
}

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectRenameRedoTerminalHistoryReceipt {
  const receipt = record(input, "Project rename redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_RENAME_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.rename.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.rename", "redo terminal-history receipt.commandKind");
  const projectId = string(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = string(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  const currentDisplayName = displayName(receipt.currentDisplayName, "redo terminal-history receipt.currentDisplayName");
  const proposedDisplayName = displayName(receipt.proposedDisplayName, "redo terminal-history receipt.proposedDisplayName");
  if (currentDisplayName === proposedDisplayName) blocked("redo terminal-history receipt display-name transition must contain a change.");
  exact(receipt.historyStatus, "redone", "redo terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "redo terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "redo terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "redo terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "redo terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "redo terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "redo terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "redo terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "redo terminal-history receipt.execution");
  if (
    receipt.readyClaim !== false
    || receipt.blocker !== null
    || receipt.outcomeUnknown !== false
    || receipt.authoritativeRereadRequired !== false
    || receipt.retryAllowed !== false
  ) blocked("A successful terminal-redone receipt cannot add mutation authority or erase outcome-unknown semantics.");
  trueValue(receipt.foreignStatePreserved, "redo terminal-history receipt.foreignStatePreserved");
  trueValue(receipt.noFoundryWrite, "redo terminal-history receipt.noFoundryWrite");
  falseValue(receipt.sourceProjectContentWrite, "redo terminal-history receipt.sourceProjectContentWrite");
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectRenameRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");

  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  if (authority.genericExecutor !== false) blocked("redo terminal-history receipt.authority.genericExecutor must be false.");

  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const beforeRedo = validateProjectRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateProjectRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  if (
    beforeRedo.displayName !== currentDisplayName
    || afterRedo.displayName !== proposedDisplayName
    || afterRedo.workspaceIndexGeneration !== beforeRedo.workspaceIndexGeneration + 1
    || afterRedo.generation !== beforeRedo.generation
    || afterRedo.contentSha256 !== beforeRedo.contentSha256
    || afterRedo.authoritativeStateSha256 === beforeRedo.authoritativeStateSha256
  ) blocked("redo terminal-history receipt does not retain the exact rename transition and unchanged content evidence.");

  const history = validateRedoneTerminalHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) {
    blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  }
  validateWorkspaceRenameReceipt(receipt.redoReceipt, projectId, proposedDisplayName, afterRedo, "redo terminal-history receipt.redoReceipt");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectRenameRedoTerminalHistoryReceipt;
}

export const projectRenameTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectRenameTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectRenameTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectRenameTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectRenameTerminalHistoryValidationError
        ? error
        : new ProjectRenameTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const projectRenameRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectRenameRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectRenameRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectRenameTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectRenameTerminalHistoryValidationError
        ? error
        : new ProjectRenameTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
