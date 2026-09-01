import { TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS, validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type {
  CommittedProjectAddSceneExecutionReceipt,
  CommittedProjectAddSceneUndoReceipt,
  ProjectAddSceneAuthoritativeRead,
} from "./project-add-scene-executor";

export const PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedCommitTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedTerminalTransitions = [...expectedCommitTransitions, "undo"] as const;
const expectedRedoneTransitions = [...expectedTerminalTransitions, "redo"] as const;

export type ProjectAddSceneInMemoryTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.add-scene.commit-in-memory";
  commandKind: "project.add-scene.commit-in-memory";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectAddSceneAuthoritativeRead;
    afterApply: ProjectAddSceneAuthoritativeRead;
    afterUndo: ProjectAddSceneAuthoritativeRead;
  }>;
  sourceReceipts: Readonly<{
    commit: CommittedProjectAddSceneExecutionReceipt;
    undo: CommittedProjectAddSceneUndoReceipt;
  }>;
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
  projectPersistenceWrite: false;
  sceneContentRestored: true;
  assetsPreserved: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectAddSceneInMemoryRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.add-scene.commit-in-memory.redo";
  commandKind: "project.add-scene.commit-in-memory";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectAddSceneAuthoritativeRead;
    afterRedo: ProjectAddSceneAuthoritativeRead;
  }>;
  matchedReread: Readonly<{
    status: "matched";
    targetId: string;
    revision: number;
    sha256: string;
  }>;
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
  projectPersistenceWrite: false;
  sceneContentRestored: false;
  assetsPreserved: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectAddSceneInMemoryTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAddSceneInMemoryTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAddSceneInMemoryTerminalHistoryValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function array(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) blocked(`${label} must be an array.`);
  return value;
}

function stringValue(value: unknown, label: string, pattern?: RegExp): string {
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

function falseValue(value: unknown, label: string): false {
  if (value !== false) blocked(`${label} must be false.`);
  return false;
}

function exact(value: unknown, expected: string, label: string): void {
  if (value !== expected) blocked(`${label} must be ${expected}.`);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function validateRead(value: unknown, projectId: string, label: string): ProjectAddSceneAuthoritativeRead {
  const read = record(value, label);
  const sceneIds = array(read.sceneIds, `${label}.sceneIds`).map((entry, index) => stringValue(entry, `${label}.sceneIds[${index}]`, sceneIdPattern));
  if (sceneIds.length === 0 || sceneIds.length > 256 || new Set(sceneIds).size !== sceneIds.length) blocked(`${label}.sceneIds must contain unique Scene IDs.`);
  exact(read.projectId, projectId, `${label}.projectId`);
  const activeSceneId = stringValue(read.activeSceneId, `${label}.activeSceneId`, sceneIdPattern);
  if (!sceneIds.includes(activeSceneId)) blocked(`${label}.activeSceneId must identify an authoritative Scene.`);
  if (integer(read.sceneCount, `${label}.sceneCount`) !== sceneIds.length) blocked(`${label}.sceneCount does not match sceneIds.`);
  stringValue(read.scenesSha256, `${label}.scenesSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noPersistenceWrite, `${label}.noPersistenceWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);
  return read as unknown as ProjectAddSceneAuthoritativeRead;
}

function sameReadIdentity(left: ProjectAddSceneAuthoritativeRead, right: ProjectAddSceneAuthoritativeRead): boolean {
  return left.projectId === right.projectId
    && sameStrings(left.sceneIds, right.sceneIds)
    && left.scenesSha256 === right.scenesSha256
    && left.activeSceneId === right.activeSceneId
    && left.sceneCount === right.sceneCount
    && left.noWrite === right.noWrite
    && left.noPersistenceWrite === right.noPersistenceWrite
    && left.noFoundryWrite === right.noFoundryWrite;
}

function validateHistory(value: unknown, batchId: string, projectId: string, expectedStatus: "committed" | "undone", expectedTransitions: readonly string[], afterApply: ProjectAddSceneAuthoritativeRead, afterUndo: ProjectAddSceneAuthoritativeRead | null, label: string): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`${label} is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, `${label}.batchId`);
  if (history.status !== expectedStatus || history.receipts.length !== expectedTransitions.length) blocked(`${label} does not retain the expected terminal lifecycle.`);
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedTransitions[index])) blocked(`${label} does not retain the expected transition order.`);
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== projectId || commit.reread.revision !== afterApply.sceneCount || commit.reread.sha256 !== afterApply.scenesSha256) blocked(`${label} does not retain the matched afterApply reread.`);
  if (afterUndo !== null) {
    const undo = history.receipts[4];
    if (undo?.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== afterUndo.sceneCount || undo.reread.sha256 !== afterUndo.scenesSha256) blocked(`${label} does not retain the matched afterUndo reread.`);
  }
  return history;
}

function validateRedoneHistory(value: unknown, batchId: string, projectId: string, beforeRedo: ProjectAddSceneAuthoritativeRead, afterRedo: ProjectAddSceneAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`project.add-scene.commit-in-memory redo history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneTransitions.length) blocked("project.add-scene.commit-in-memory redo history must end in exactly six receipts with status redone.");
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedRedoneTransitions[index])) blocked("project.add-scene.commit-in-memory redo history does not use the expected preview-to-redo sequence.");
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus || undo.reread.targetId !== projectId || undo.reread.revision !== beforeRedo.sceneCount || undo.reread.sha256 !== beforeRedo.scenesSha256) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus || redo.reread.targetId !== projectId || redo.reread.revision !== afterRedo.sceneCount || redo.reread.sha256 !== afterRedo.scenesSha256) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateRedoLifecycle(beforeRedo: ProjectAddSceneAuthoritativeRead, afterRedo: ProjectAddSceneAuthoritativeRead, projectId: string, addedSceneId: string, addedOrdinal: number): void {
  if (beforeRedo.projectId !== projectId || afterRedo.projectId !== projectId) blocked("In-memory add-Scene redo rereads are not bound to the exact project.");
  if (afterRedo.sceneCount !== beforeRedo.sceneCount + 1) blocked("In-memory add-Scene redo rereads do not prove one exact added Scene.");
  if (addedOrdinal < 2 || addedOrdinal > afterRedo.sceneCount) blocked("In-memory add-Scene redo ordinal is outside the valid Scene range.");
  const expectedSceneIds = [...beforeRedo.sceneIds];
  expectedSceneIds.splice(addedOrdinal - 1, 0, addedSceneId);
  if (!sameStrings(afterRedo.sceneIds, expectedSceneIds) || afterRedo.activeSceneId !== addedSceneId || afterRedo.scenesSha256 === beforeRedo.scenesSha256) blocked("In-memory add-Scene redo does not prove the exact ordered Scene-set transition and active Scene.");
  if (afterRedo.noWrite !== true || afterRedo.noPersistenceWrite !== true || afterRedo.noFoundryWrite !== true) blocked("In-memory add-Scene redo must remain no-write, non-persistent, and no-Foundry-write evidence.");
}

function validateMatchedRedoReread(value: unknown, projectId: string, afterRedo: ProjectAddSceneAuthoritativeRead): ProjectAddSceneInMemoryRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "In-memory add-Scene redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "In-memory add-Scene redo matched reread.status");
  exact(reread.targetId, projectId, "In-memory add-Scene redo matched reread.targetId");
  if (integer(reread.revision, "In-memory add-Scene redo matched reread.revision") !== afterRedo.sceneCount) blocked("In-memory add-Scene redo matched reread revision does not match afterRedo.");
  const sha256 = stringValue(reread.sha256, "In-memory add-Scene redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.scenesSha256) blocked("In-memory add-Scene redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.sceneCount, sha256: afterRedo.scenesSha256 };
}

function validateSession(value: unknown, batchId: string, projectId: string, label: string): Record<string, unknown> {
  const session = record(value, label);
  const batch = record(session.batch, `${label}.batch`);
  exact(batch.batchId, batchId, `${label}.batch.batchId`);
  const base = record(batch.base, `${label}.batch.base`);
  exact(base.targetId, projectId, `${label}.batch.base.targetId`);
  const producer = record(batch.producer, `${label}.batch.producer`);
  exact(producer.kind, "human", `${label}.batch.producer.kind`);
  exact(producer.sourceId, "desktop.project.add-scene", `${label}.batch.producer.sourceId`);
  if (producer.provider !== null) blocked(`${label}.batch.producer.provider must be null.`);
  const commands = array(batch.commands, `${label}.batch.commands`);
  if (commands.length !== 1) blocked(`${label}.batch.commands must contain exactly one command.`);
  const command = record(commands[0], `${label}.batch.commands[0]`);
  exact(command.kind, "project.add-scene", `${label}.batch.commands[0].kind`);
  const payload = record(command.payload, `${label}.batch.commands[0].payload`);
  exact(payload.projectId, projectId, `${label}.batch.commands[0].payload.projectId`);
  return session;
}

function validateCommit(value: unknown): Readonly<{
  source: CommittedProjectAddSceneExecutionReceipt;
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  before: ProjectAddSceneAuthoritativeRead;
  afterApply: ProjectAddSceneAuthoritativeRead;
  history: ProposalBatchHistory;
}> {
  const source = record(value, "commit receipt");
  exact(source.operation, "dicebox.project.add-scene.commit-in-memory", "commit receipt.operation");
  exact(source.status, "PASS", "commit receipt.status");
  const projectId = stringValue(source.projectId, "commit receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "commit receipt.batchId", stableIdPattern);
  const addedSceneId = stringValue(source.addedSceneId, "commit receipt.addedSceneId", sceneIdPattern);
  const addedOrdinal = integer(source.addedOrdinal, "commit receipt.addedOrdinal");
  falseValue(source.projectContentWrite, "commit receipt.projectContentWrite");
  falseValue(source.projectPersistenceWrite, "commit receipt.projectPersistenceWrite");
  trueValue(source.noFoundryWrite, "commit receipt.noFoundryWrite");
  const before = validateRead(source.before, projectId, "commit receipt.before");
  const afterApply = validateRead(source.afterApply, projectId, "commit receipt.afterApply");
  if (addedOrdinal !== before.sceneCount + 1 || afterApply.sceneCount !== before.sceneCount + 1 || !sameStrings(afterApply.sceneIds, [...before.sceneIds, addedSceneId]) || afterApply.activeSceneId !== addedSceneId || afterApply.scenesSha256 === before.scenesSha256) blocked("commit receipt does not prove one exact appended Scene.");
  const session = validateSession(source.session, batchId, projectId, "commit receipt.session");
  const history = validateHistory(session.history, batchId, projectId, "committed", expectedCommitTransitions, afterApply, null, "commit receipt.session.history");
  return { source: source as unknown as CommittedProjectAddSceneExecutionReceipt, projectId, batchId, addedSceneId, addedOrdinal, before, afterApply, history };
}

function validateUndo(value: unknown, expected: Readonly<{ projectId: string; batchId: string; addedSceneId: string; addedOrdinal: number; before: ProjectAddSceneAuthoritativeRead; afterApply: ProjectAddSceneAuthoritativeRead; history: ProposalBatchHistory }>): Readonly<{ source: CommittedProjectAddSceneUndoReceipt; afterUndo: ProjectAddSceneAuthoritativeRead; history: ProposalBatchHistory }> {
  const source = record(value, "undo receipt");
  exact(source.operation, "dicebox.project.add-scene.undo-in-memory", "undo receipt.operation");
  exact(source.status, "PASS", "undo receipt.status");
  exact(source.projectId, expected.projectId, "undo receipt.projectId");
  exact(source.batchId, expected.batchId, "undo receipt.batchId");
  falseValue(source.projectContentWrite, "undo receipt.projectContentWrite");
  falseValue(source.projectPersistenceWrite, "undo receipt.projectPersistenceWrite");
  trueValue(source.noFoundryWrite, "undo receipt.noFoundryWrite");
  const afterUndo = validateRead(source.afterUndo, expected.projectId, "undo receipt.afterUndo");
  if (afterUndo.sceneCount !== expected.before.sceneCount || afterUndo.activeSceneId !== expected.before.activeSceneId || !sameStrings(afterUndo.sceneIds, expected.before.sceneIds) || afterUndo.scenesSha256 !== expected.before.scenesSha256) blocked("undo receipt does not prove exact inverse Scene restoration.");
  const session = validateSession(source.session, expected.batchId, expected.projectId, "undo receipt.session");
  const history = validateHistory(session.history, expected.batchId, expected.projectId, "undone", expectedTerminalTransitions, expected.afterApply, afterUndo, "undo receipt.session.history");
  if (JSON.stringify(history.receipts.slice(0, 4)) !== JSON.stringify(expected.history.receipts)) blocked("undo receipt history does not retain the exact committed prefix.");
  return { source: source as unknown as CommittedProjectAddSceneUndoReceipt, afterUndo, history };
}

export function bridgeProjectAddSceneInMemoryExecutionToTerminalHistory(input: unknown): ProjectAddSceneInMemoryTerminalHistoryReceipt {
  const root = record(input, "project.add-scene.commit-in-memory receipt pair");
  const expectedKeys = ["commit", "undo"];
  if (Object.keys(root).sort().join("|") !== expectedKeys.sort().join("|")) blocked("receipt pair contains unknown or missing fields.");
  const commit = validateCommit(root.commit);
  const undo = validateUndo(root.undo, commit);
  if (!sameReadIdentity(commit.before, commit.source.before) || !sameReadIdentity(commit.afterApply, commit.source.afterApply)) blocked("commit receipt rereads changed during validation.");
  return {
    schemaVersion: PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.add-scene.commit-in-memory",
    commandKind: "project.add-scene.commit-in-memory",
    projectId: commit.projectId,
    batchId: commit.batchId,
    addedSceneId: commit.addedSceneId,
    addedOrdinal: commit.addedOrdinal,
    history: undo.history,
    historyStatus: "undone",
    historyTransitions: undo.history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { before: commit.before, afterApply: commit.afterApply, afterUndo: undo.afterUndo },
    sourceReceipts: { commit: commit.source, undo: undo.source },
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
    projectPersistenceWrite: false,
    sceneContentRestored: true,
    assetsPreserved: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

export function bridgeProjectAddSceneInMemoryRedoToTerminalHistory(input: unknown): ProjectAddSceneInMemoryRedoTerminalHistoryReceipt {
  const source = record(input, "project.add-scene.commit-in-memory redo receipt");
  exact(source.operation, "dicebox.project.add-scene.commit-in-memory.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = stringValue(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "redo receipt.batchId", stableIdPattern);
  const addedSceneId = stringValue(source.addedSceneId, "redo receipt.addedSceneId", sceneIdPattern);
  const addedOrdinal = integer(source.addedOrdinal, "redo receipt.addedOrdinal");
  falseValue(source.projectContentWrite, "redo receipt.projectContentWrite");
  falseValue(source.projectPersistenceWrite, "redo receipt.projectPersistenceWrite");
  falseValue(source.sceneContentRestored, "redo receipt.sceneContentRestored");
  trueValue(source.assetsPreserved, "redo receipt.assetsPreserved");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  const rereads = record(source.authoritativeRereads, "redo receipt.authoritativeRereads");
  const beforeRedo = validateRead(rereads.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateRead(rereads.afterRedo, projectId, "afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, projectId, addedSceneId, addedOrdinal);
  const history = validateRedoneHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);
  return {
    schemaVersion: PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.add-scene.commit-in-memory.redo",
    commandKind: "project.add-scene.commit-in-memory",
    projectId,
    batchId,
    addedSceneId,
    addedOrdinal,
    history,
    historyStatus: "redone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { beforeRedo, afterRedo },
    matchedReread,
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
    projectPersistenceWrite: false,
    sceneContentRestored: false,
    assetsPreserved: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
    noTransitionAuthority: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectAddSceneInMemoryTerminalHistoryReceipt {
  const receipt = record(input, "project.add-scene.commit-in-memory terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.add-scene.commit-in-memory", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.add-scene.commit-in-memory", "terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const addedSceneId = stringValue(receipt.addedSceneId, "terminal-history receipt.addedSceneId", sceneIdPattern);
  const addedOrdinal = integer(receipt.addedOrdinal, "terminal-history receipt.addedOrdinal");
  exact(receipt.historyStatus, "undone", "terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  falseValue(receipt.readyClaim, "terminal-history receipt.readyClaim");
  trueValue(receipt.foreignStatePreserved, "terminal-history receipt.foreignStatePreserved");
  falseValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  falseValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  trueValue(receipt.sceneContentRestored, "terminal-history receipt.sceneContentRestored");
  trueValue(receipt.assetsPreserved, "terminal-history receipt.assetsPreserved");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-undone receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");
  const pair = record(receipt.sourceReceipts, "terminal-history receipt.sourceReceipts");
  const commit = validateCommit(pair.commit);
  const undo = validateUndo(pair.undo, commit);
  if (commit.projectId !== projectId || commit.batchId !== batchId || commit.addedSceneId !== addedSceneId || commit.addedOrdinal !== addedOrdinal || !sameReadIdentity(commit.before, commit.source.before) || !sameReadIdentity(commit.afterApply, commit.source.afterApply)) blocked("terminal-history receipt is not bound to the exact commit source identity and rereads.");
  if (undo.source.projectId !== projectId || undo.source.batchId !== batchId) blocked("terminal-history receipt is not bound to the exact undo source identity.");
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  if (!sameReadIdentity(before, commit.before) || !sameReadIdentity(afterApply, commit.afterApply) || !sameReadIdentity(afterUndo, undo.afterUndo)) blocked("terminal-history receipt does not retain exact authoritative rereads.");
  const history = validateHistory(receipt.history, batchId, projectId, "undone", expectedTerminalTransitions, afterApply, afterUndo, "terminal-history receipt.history");
  if (JSON.stringify(history) !== JSON.stringify(undo.history)) blocked("terminal-history receipt history differs from the undo source receipt.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTerminalTransitions.length || transitions.some((transition, index) => transition !== expectedTerminalTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  return receipt as unknown as ProjectAddSceneInMemoryTerminalHistoryReceipt;
}

export const projectAddSceneInMemoryTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAddSceneInMemoryTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAddSceneInMemoryTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAddSceneInMemoryTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAddSceneInMemoryTerminalHistoryValidationError
        ? error
        : new ProjectAddSceneInMemoryTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectAddSceneInMemoryRedoTerminalHistoryReceipt {
  const receipt = record(input, "project.add-scene.commit-in-memory redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ADD_SCENE_IN_MEMORY_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.add-scene.commit-in-memory.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.add-scene.commit-in-memory", "redo terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  const addedSceneId = stringValue(receipt.addedSceneId, "redo terminal-history receipt.addedSceneId", sceneIdPattern);
  const addedOrdinal = integer(receipt.addedOrdinal, "redo terminal-history receipt.addedOrdinal");
  exact(receipt.historyStatus, "redone", "redo terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "redo terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "redo terminal-history receipt.applyAuthority");
  trueValue(receipt.noGenericExecutor, "redo terminal-history receipt.noGenericExecutor");
  trueValue(receipt.bridgeOnly, "redo terminal-history receipt.bridgeOnly");
  trueValue(receipt.noExecutionAuthority, "redo terminal-history receipt.noExecutionAuthority");
  trueValue(receipt.authoritativeReread, "redo terminal-history receipt.authoritativeReread");
  trueValue(receipt.noProjectMutation, "redo terminal-history receipt.noProjectMutation");
  exact(receipt.execution, "not-implemented", "redo terminal-history receipt.execution");
  falseValue(receipt.readyClaim, "redo terminal-history receipt.readyClaim");
  trueValue(receipt.foreignStatePreserved, "redo terminal-history receipt.foreignStatePreserved");
  falseValue(receipt.projectContentWrite, "redo terminal-history receipt.projectContentWrite");
  falseValue(receipt.projectPersistenceWrite, "redo terminal-history receipt.projectPersistenceWrite");
  falseValue(receipt.sceneContentRestored, "redo terminal-history receipt.sceneContentRestored");
  trueValue(receipt.assetsPreserved, "redo terminal-history receipt.assetsPreserved");
  trueValue(receipt.noFoundryWrite, "redo terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-redone receipt cannot add mutation authority or erase blocker, unknown-outcome, reread, or retry semantics.");
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");
  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "redo terminal-history receipt.authority.genericExecutor");
  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const beforeRedo = validateRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, projectId, addedSceneId, addedOrdinal);
  const history = validateRedoneHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneTransitions[index])) blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectAddSceneInMemoryRedoTerminalHistoryReceipt;
}

export const projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAddSceneInMemoryRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAddSceneInMemoryRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAddSceneInMemoryTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAddSceneInMemoryTerminalHistoryValidationError
        ? error
        : new ProjectAddSceneInMemoryTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
