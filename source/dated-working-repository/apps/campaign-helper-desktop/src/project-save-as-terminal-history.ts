import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type {
  ProjectSaveAsAuthoritativeRead,
  ProjectSaveAsExecutionReceipt,
} from "./project-save-as-executor";

export const PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectSaveAsTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.save-as.execute";
  commandKind: "project.save-as";
  sourceProjectId: string;
  targetProjectId: string;
  batchId: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectSaveAsAuthoritativeRead;
    afterApply: ProjectSaveAsAuthoritativeRead;
  }>;
  sourceReceipt: ProjectSaveAsExecutionReceipt;
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
  sourcePreserved: true;
  targetCreated: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectSaveAsRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone"; disposition: "terminal-redone"; operation: "dicebox.project.save-as.redo"; commandKind: "project.save-as";
  sourceProjectId: string; targetProjectId: string; batchId: string; history: ProposalBatchHistory; historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][]; authoritativeRereads: Readonly<{ beforeRedo: ProjectSaveAsAuthoritativeRead; afterRedo: ProjectSaveAsAuthoritativeRead }>;
  matchedReread: Readonly<{ status: "matched"; targetId: string; revision: number; sha256: string }>; sourceReceipt: ProjectSaveAsExecutionReceipt;
  targetAuthority: "local-project"; applyAuthority: "operation-specific"; noGenericExecutor: true; bridgeOnly: true; noExecutionAuthority: true; noTransitionAuthority: true; transitionInvocation: "not-invoked"; rereadInvocation: "not-invoked"; rereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema"; authoritativeReread: true; noProjectMutation: true; execution: "not-implemented"; readyClaim: false; foreignStatePreserved: true; noFoundryWrite: true; sourceProjectContentWrite: false; blocker: null; outcomeUnknown: false; authoritativeRereadRequired: false; retryAllowed: false;
}>;

export class ProjectSaveAsTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;

  constructor(message: string) {
    super(message);
    this.name = "ProjectSaveAsTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectSaveAsTerminalHistoryValidationError(message);
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

function boolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") blocked(`${label} must be boolean.`);
  return value;
}

function validateProjectRead(value: unknown, projectId: string, label: string): ProjectSaveAsAuthoritativeRead["source"] {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = string(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  string(read.scenesSha256, `${label}.scenesSha256`, sha256Pattern);
  const activeSceneId = string(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  if (sceneCount < 1) blocked(`${label}.sceneCount must be positive.`);
  const assets = array(read.assets, `${label}.assets`);
  string(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not accepted.`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`).map((entry) => record(entry, `${label}.catalog.entries[]`));
  const matchingEntries = catalogEntries.filter((entry) => entry.projectId === projectId);
  if (matchingEntries.length !== 1) blocked(`${label}.catalog must contain exactly one matching project entry.`);

  const catalogEntry = record(read.catalogEntry, `${label}.catalogEntry`);
  exact(catalogEntry.projectId, projectId, `${label}.catalogEntry.projectId`);
  exact(catalogEntry.status, "PASS", `${label}.catalogEntry.status`);
  if (catalogEntry.generation !== generation || catalogEntry.contentSha256 !== contentSha256) blocked(`${label}.catalogEntry does not match the project reread.`);

  const project = record(read.project, `${label}.project`);
  exact(project.activeSceneId, activeSceneId, `${label}.project.activeSceneId`);
  const scenesJson = array(project.scenesJson, `${label}.project.scenesJson`);
  if (scenesJson.length !== sceneCount) blocked(`${label}.project.scenesJson does not match sceneCount.`);
  if (assets.length !== integer(project.assets instanceof Array ? project.assets.length : -1, `${label}.project.assets.length`)) blocked(`${label}.assets does not match project.assets.`);
  const projectAssets = array(project.assets, `${label}.project.assets`);
  if (projectAssets.length !== assets.length) blocked(`${label}.project.assets does not match assets.`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256 || projectReceipt.activeSceneId !== activeSceneId || projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assets.length) blocked(`${label}.project.receipt does not match the project reread.`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, projectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the project reread.`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  if (backup.status !== "VALID" && !(generation === 1 && backup.status === "MISSING")) blocked(`${label}.recovery.backup.status is not an accepted generation-bound state.`);
  if (backup.status === "VALID") string(backup.byteSha256, `${label}.recovery.backup.byteSha256`, sha256Pattern);
  string(primary.byteSha256, `${label}.recovery.primary.byteSha256`, sha256Pattern);

  return read as ProjectSaveAsAuthoritativeRead["source"];
}

function validateSaveAsReceipt(value: unknown, source: ProjectSaveAsAuthoritativeRead["source"], targetProjectId: string): void {
  const saveAs = record(value, "saveAs");
  exact(saveAs.operation, "dicebox.project.save-as", "saveAs.operation");
  exact(saveAs.status, "PASS", "saveAs.status");
  exact(saveAs.projectId, targetProjectId, "saveAs.projectId");
  const generation = integer(saveAs.generation, "saveAs.generation");
  if (generation < 1) blocked("saveAs.generation must be positive.");
  const contentSha256 = string(saveAs.contentSha256, "saveAs.contentSha256", sha256Pattern);
  string(saveAs.sceneSha256, "saveAs.sceneSha256", sha256Pattern);
  const sceneCount = integer(saveAs.sceneCount, "saveAs.sceneCount");
  if (sceneCount !== source.sceneCount) blocked("saveAs.sceneCount must preserve the source Scene count.");
  exact(saveAs.activeSceneId, source.activeSceneId, "saveAs.activeSceneId");
  const scenes = array(saveAs.scenes, "saveAs.scenes");
  if (scenes.length !== sceneCount) blocked("saveAs.scenes does not match sceneCount.");
  if (integer(saveAs.assetCount, "saveAs.assetCount") !== source.assets.length) blocked("saveAs.assetCount does not preserve source assets.");
  string(saveAs.projectRelativePath, "saveAs.projectRelativePath");
  trueValue(saveAs.atomicReplace, "saveAs.atomicReplace");
  trueValue(saveAs.directoryEntrySync, "saveAs.directoryEntrySync");
  boolean(saveAs.backupPreserved, "saveAs.backupPreserved");
  trueValue(saveAs.noFoundryWrite, "saveAs.noFoundryWrite");
  const workspaceMetadata = record(saveAs.workspaceMetadata, "saveAs.workspaceMetadata");
  exact(workspaceMetadata.operation, "dicebox.workspace-metadata.touch", "saveAs.workspaceMetadata.operation");
  exact(workspaceMetadata.status, "PASS", "saveAs.workspaceMetadata.status");
  exact(workspaceMetadata.projectId, targetProjectId, "saveAs.workspaceMetadata.projectId");
  integer(workspaceMetadata.indexGeneration, "saveAs.workspaceMetadata.indexGeneration");
  trueValue(workspaceMetadata.atomicReplace, "saveAs.workspaceMetadata.atomicReplace");
  trueValue(workspaceMetadata.directoryEntrySync, "saveAs.workspaceMetadata.directoryEntrySync");
  boolean(workspaceMetadata.backupPreserved, "saveAs.workspaceMetadata.backupPreserved");
  trueValue(workspaceMetadata.noFoundryWrite, "saveAs.workspaceMetadata.noFoundryWrite");
  string(contentSha256, "saveAs.contentSha256", sha256Pattern);
}

function sameProjectRead(left: ProjectSaveAsAuthoritativeRead["source"], right: ProjectSaveAsAuthoritativeRead["source"]): boolean {
  return left.projectId === right.projectId
    && left.generation === right.generation
    && left.contentSha256 === right.contentSha256
    && left.scenesSha256 === right.scenesSha256
    && left.activeSceneId === right.activeSceneId
    && left.sceneCount === right.sceneCount
    && left.assets.length === right.assets.length
    && left.assetCollectionSha256 === right.assetCollectionSha256
    && JSON.stringify(left.assets) === JSON.stringify(right.assets);
}

function validateTerminalHistory(value: unknown, batchId: string, sourceProjectId: string, source: ProjectSaveAsAuthoritativeRead["source"]): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project save-as proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "committed" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project save-as history must end in exactly four committed receipts.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("Project save-as history does not use the expected preview-to-commit sequence.");
  const commit = history.receipts[3]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== sourceProjectId || commit.reread.revision !== source.generation || commit.reread.sha256 !== source.contentSha256) blocked("Commit history does not retain the matched authoritative source reread.");
  return history;
}

function validateExecutionReceipt(input: unknown): ProjectSaveAsExecutionReceipt {
  const source = record(input, "Project save-as execution receipt");
  exact(source.operation, "dicebox.project.save-as.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const sourceProjectId = string(source.sourceProjectId, "execution receipt.sourceProjectId", stableIdPattern);
  const targetProjectId = string(source.targetProjectId, "execution receipt.targetProjectId", stableIdPattern);
  if (sourceProjectId === targetProjectId) blocked("Save-as source and target project IDs must differ.");
  const batchId = string(source.batchId, "execution receipt.batchId", stableIdPattern);
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.projectPersistenceWrite, "execution receipt.projectPersistenceWrite");
  trueValue(source.sourcePreserved, "execution receipt.sourcePreserved");
  trueValue(source.targetCreated, "execution receipt.targetCreated");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");

  const beforeValue = record(source.before, "before");
  trueValue(beforeValue.targetAbsent, "before.targetAbsent");
  if (beforeValue.target !== null) blocked("before.target must be null for a create-only save-as.");
  const beforeSource = validateProjectRead(beforeValue.source, sourceProjectId, "before.source");
  const afterValue = record(source.afterApply, "afterApply");
  if (afterValue.targetAbsent !== false) blocked("afterApply.targetAbsent must be false after save-as.");
  const afterSource = validateProjectRead(afterValue.source, sourceProjectId, "afterApply.source");
  const afterTarget = validateProjectRead(afterValue.target, targetProjectId, "afterApply.target");
  if (!sameProjectRead(beforeSource, afterSource)) blocked("Save-as does not preserve the exact source project reread.");
  const beforeIndex = integer(beforeValue.workspaceIndexGeneration, "before.workspaceIndexGeneration");
  const afterIndex = integer(afterValue.workspaceIndexGeneration, "afterApply.workspaceIndexGeneration");
  if (afterIndex !== beforeIndex + 1) blocked("Save-as does not prove one workspace-index generation advance.");
  if (afterTarget.generation < 1 || afterTarget.sceneCount !== beforeSource.sceneCount || afterTarget.activeSceneId !== beforeSource.activeSceneId || afterTarget.assets.length !== beforeSource.assets.length || afterTarget.assetCollectionSha256 !== beforeSource.assetCollectionSha256) blocked("Save-as target does not prove exact source content and asset preservation.");
  validateSaveAsReceipt(source.saveAs, beforeSource, targetProjectId);
  const saveAs = record(source.saveAs, "saveAs");
  if (afterTarget.generation !== saveAs.generation || afterTarget.contentSha256 !== saveAs.contentSha256 || afterValue.workspaceIndexGeneration !== record(saveAs.workspaceMetadata, "saveAs.workspaceMetadata").indexGeneration) blocked("Save-as target reread does not match the operation receipt.");
  const history = validateTerminalHistory(source.history, batchId, sourceProjectId, beforeSource);
  return source as ProjectSaveAsExecutionReceipt;
}

export function bridgeProjectSaveAsExecutionToTerminalHistory(input: unknown): ProjectSaveAsTerminalHistoryReceipt {
  const source = validateExecutionReceipt(input);
  const before = source.before;
  const afterApply = source.afterApply;
  const history = validateTerminalHistory(source.history, source.batchId, source.sourceProjectId, before.source);
  return {
    schemaVersion: PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.save-as.execute",
    commandKind: "project.save-as",
    sourceProjectId: source.sourceProjectId,
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
    sourcePreserved: true,
    targetCreated: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

export function bridgeProjectSaveAsRedoToTerminalHistory(input: unknown): ProjectSaveAsRedoTerminalHistoryReceipt {
  const receipt = record(input, "Project save-as redo receipt");
  exact(receipt.operation, "dicebox.project.save-as.redo", "redo.operation"); exact(receipt.status, "PASS", "redo.status");
  const sourceProjectId = string(receipt.sourceProjectId, "redo.sourceProjectId", stableIdPattern); const targetProjectId = string(receipt.targetProjectId, "redo.targetProjectId", stableIdPattern); const batchId = string(receipt.batchId, "redo.batchId", stableIdPattern);
  trueValue(receipt.noProjectMutation, "redo.noProjectMutation"); trueValue(receipt.noFoundryWrite, "redo.noFoundryWrite");
  const sourceReceipt = validateExecutionReceipt(receipt.sourceReceipt);
  if (sourceReceipt.sourceProjectId !== sourceProjectId || sourceReceipt.targetProjectId !== targetProjectId || sourceReceipt.batchId !== batchId) blocked("Save-as redo receipt is foreign to its source receipt.");
  const beforeRedo = record(receipt.beforeRedo, "redo.beforeRedo"); const afterRedo = record(receipt.afterRedo, "redo.afterRedo");
  if (beforeRedo.target !== null || beforeRedo.targetAbsent !== true) blocked("Save-as redo must retain absent target before redo.");
  const beforeSource = validateProjectRead(beforeRedo.source, sourceProjectId, "redo.beforeRedo.source"); const afterSource = validateProjectRead(afterRedo.source, sourceProjectId, "redo.afterRedo.source"); const afterTarget = validateProjectRead(afterRedo.target, targetProjectId, "redo.afterRedo.target");
  if (afterRedo.targetAbsent !== false || !sameProjectRead(beforeSource, afterSource)) blocked("Save-as redo must preserve source and restore target.");
  const originalTarget = sourceReceipt.afterApply.target; if (!originalTarget || afterTarget.contentSha256 !== originalTarget.contentSha256 || afterTarget.scenesSha256 !== originalTarget.scenesSha256 || afterTarget.assetCollectionSha256 !== originalTarget.assetCollectionSha256 || afterTarget.generation <= originalTarget.generation) blocked("Save-as redo does not preserve target content through later reread.");
  let history: ProposalBatchHistory; try { history = validateProposalBatchHistory(receipt.history); } catch (error) { blocked(`Save-as redo history invalid: ${error instanceof Error ? error.message : String(error)}`); }
  if (history.batchId !== batchId || history.status !== "redone" || history.receipts.length !== 6 || history.receipts.some((item, index) => item.transition !== expectedRedoneHistoryTransitions[index])) blocked("Save-as redo history is not canonical.");
  const redo = history.receipts[5]!; if (redo.reread?.status !== "matched" || redo.reread.targetId !== sourceProjectId || redo.reread.revision !== afterSource.generation || redo.reread.sha256 !== afterSource.contentSha256) blocked("Save-as redo history lacks matched source reread.");
  const matchedReread = record(receipt.matchedReread, "redo.matchedReread"); if (matchedReread.status !== "matched" || matchedReread.targetId !== targetProjectId || matchedReread.revision !== afterTarget.generation || matchedReread.sha256 !== afterTarget.contentSha256) blocked("Save-as redo matched reread drifted.");
  return { schemaVersion: PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION, status:"redone", disposition:"terminal-redone", operation:"dicebox.project.save-as.redo", commandKind:"project.save-as", sourceProjectId, targetProjectId, batchId, history, historyStatus:"redone", historyTransitions:history.receipts.map((item)=>item.transition), authoritativeRereads:{beforeRedo:beforeRedo as ProjectSaveAsAuthoritativeRead,afterRedo:afterRedo as ProjectSaveAsAuthoritativeRead}, matchedReread:matchedReread as ProjectSaveAsRedoTerminalHistoryReceipt["matchedReread"], sourceReceipt, targetAuthority:"local-project", applyAuthority:"operation-specific", noGenericExecutor:true, bridgeOnly:true, noExecutionAuthority:true, noTransitionAuthority:true, transitionInvocation:"not-invoked", rereadInvocation:"not-invoked", rereadClassifier:"projectSaveAsRedoTerminalHistoryReceiptSchema", authoritativeReread:true, noProjectMutation:true, execution:"not-implemented", readyClaim:false, foreignStatePreserved:true, noFoundryWrite:true, sourceProjectContentWrite:false, blocker:null, outcomeUnknown:false, authoritativeRereadRequired:false, retryAllowed:false };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectSaveAsTerminalHistoryReceipt {
  const receipt = record(input, "Project save-as terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_SAVE_AS_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.save-as.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.save-as", "terminal-history receipt.commandKind");
  const sourceProjectId = string(receipt.sourceProjectId, "terminal-history receipt.sourceProjectId", stableIdPattern);
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
  trueValue(receipt.sourcePreserved, "terminal-history receipt.sourcePreserved");
  trueValue(receipt.targetCreated, "terminal-history receipt.targetCreated");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker or outcome-unknown semantics.");
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = record(rereads.before, "terminal-history receipt.authoritativeRereads.before");
  const beforeSource = validateProjectRead(before.source, sourceProjectId, "terminal-history receipt.authoritativeRereads.before.source");
  const after = record(rereads.afterApply, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterSource = validateProjectRead(after.source, sourceProjectId, "terminal-history receipt.authoritativeRereads.afterApply.source");
  const afterTarget = validateProjectRead(after.target, targetProjectId, "terminal-history receipt.authoritativeRereads.afterApply.target");
  if (before.target !== null || before.targetAbsent !== true || after.targetAbsent !== false || !sameProjectRead(beforeSource, afterSource) || afterTarget.projectId !== targetProjectId) blocked("terminal-history receipt does not retain the exact source-preserving save-as rereads.");
  validateTerminalHistory(receipt.history, batchId, sourceProjectId, beforeSource);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.sourceProjectId !== sourceProjectId || source.targetProjectId !== targetProjectId || source.batchId !== batchId) blocked("terminal-history receipt is not bound to the validated operation-specific source receipt.");
  return receipt as ProjectSaveAsTerminalHistoryReceipt;
}

export const projectSaveAsTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectSaveAsTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectSaveAsTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectSaveAsTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectSaveAsTerminalHistoryValidationError
        ? error
        : new ProjectSaveAsTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
