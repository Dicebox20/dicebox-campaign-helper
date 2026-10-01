import {
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  validateProposalBatchHistory,
  type ProposalBatchHistory,
} from "@dicebox/core";
import type {
  ProjectPersistentAddSceneAuthoritativeRead,
  ProjectPersistentAddSceneExecutionFailureCode,
  ProjectPersistentAddSceneExecutionReceipt,
} from "./project-persistent-add-scene-executor";
import type { ProjectSaveReceipt, StoredAsset } from "./project-store";

export const PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sceneIdPattern = /^dbx:scene:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;
const assetRoles = new Set(["background", "handout", "audio", "token"]);

export type ProjectPersistentAddSceneTerminalHistoryBlockerCode =
  | ProjectPersistentAddSceneExecutionFailureCode
  | "TERMINAL_HISTORY_VALIDATION_FAILED";

export type ProjectPersistentAddSceneTerminalHistoryBlocker = Readonly<{
  code: ProjectPersistentAddSceneTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
}>;

export type ProjectPersistentAddSceneTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.add-scene.persist.execute";
  commandKind: "project.add-scene.persist";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectPersistentAddSceneAuthoritativeRead;
    afterApply: ProjectPersistentAddSceneAuthoritativeRead;
    afterUndo: ProjectPersistentAddSceneAuthoritativeRead;
  }>;
  sourceReceipt: ProjectPersistentAddSceneExecutionReceipt;
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
  projectContentWrite: true;
  projectPersistenceWrite: true;
  sceneContentRestored: true;
  assetsPreserved: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectPersistentAddSceneRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.add-scene.persist.redo";
  commandKind: "project.add-scene.persist";
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectPersistentAddSceneAuthoritativeRead;
    afterRedo: ProjectPersistentAddSceneAuthoritativeRead;
  }>;
  matchedReread: Readonly<{
    status: "matched";
    targetId: string;
    revision: number;
    sha256: string;
  }>;
  redoReceipt: ProjectSaveReceipt;
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
  sourceProjectContentWrite: false;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectPersistentAddSceneTerminalHistoryValidationError extends Error {
  readonly code: "TERMINAL_HISTORY_VALIDATION_FAILED";
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectPersistentAddSceneTerminalHistoryValidationError";
    this.code = "TERMINAL_HISTORY_VALIDATION_FAILED";
  }
}

function blocked(message: string): never {
  throw new ProjectPersistentAddSceneTerminalHistoryValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    blocked(`${label} must be an object.`);
  }
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
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    blocked(`${label} must be a non-negative safe integer.`);
  }
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

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) blocked("Terminal-history evidence cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (value === undefined || typeof value !== "object") blocked("Terminal-history evidence must contain JSON values.");
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sceneIds(value: unknown, label: string): readonly string[] {
  const values = array(value, label).map((entry, index) => stringValue(entry, `${label}[${index}]`, sceneIdPattern));
  if (values.length === 0 || values.length > 256 || new Set(values).size !== values.length) {
    blocked(`${label} must contain between one and 256 unique Scene IDs.`);
  }
  return values;
}

function validateAssets(value: unknown, label: string): readonly StoredAsset[] {
  return array(value, label).map((entry, index) => {
    const asset = record(entry, `${label}[${index}]`);
    stringValue(asset.sha256, `${label}[${index}].sha256`, sha256Pattern);
    stringValue(asset.mediaType, `${label}[${index}].mediaType`);
    integer(asset.byteLength, `${label}[${index}].byteLength`);
    stringValue(asset.relativePath, `${label}[${index}].relativePath`);
    if (asset.registration !== undefined) {
      const registration = record(asset.registration, `${label}[${index}].registration`);
      stringValue(registration.assetId, `${label}[${index}].registration.assetId`, stableIdPattern);
      stringValue(registration.role, `${label}[${index}].registration.role`);
      if (!assetRoles.has(registration.role as string)) blocked(`${label}[${index}].registration.role is not an allowed asset role.`);
      stringValue(registration.label, `${label}[${index}].registration.label`);
      stringValue(registration.provenance, `${label}[${index}].registration.provenance`);
      exact(registration.approval, "approved", `${label}[${index}].registration.approval`);
    }
    return asset as StoredAsset;
  });
}

function validateSceneReceipts(value: unknown, expectedSceneIds: readonly string[], label: string): void {
  const receipts = array(value, label);
  if (receipts.length !== expectedSceneIds.length) blocked(`${label} does not match the authoritative Scene count.`);
  receipts.forEach((entry, index) => {
    const receipt = record(entry, `${label}[${index}]`);
    exact(receipt.sceneId, expectedSceneIds[index]!, `${label}[${index}].sceneId`);
    stringValue(receipt.sceneSha256, `${label}[${index}].sceneSha256`, sha256Pattern);
  });
}

function validateCatalogEntry(value: unknown, projectId: string, read: Readonly<{
  sceneIds: readonly string[];
  activeSceneId: string;
  generation: number;
  contentSha256: string;
  assetCount: number;
}>, label: string): void {
  const entry = record(value, label);
  exact(entry.projectId, projectId, `${label}.projectId`);
  exact(entry.status, "PASS", `${label}.status`);
  if (entry.sceneId !== read.sceneIds[0]) blocked(`${label}.sceneId does not match the first authoritative Scene.`);
  if (entry.sceneCount !== read.sceneIds.length) blocked(`${label}.sceneCount does not match the authoritative Scene count.`);
  exact(entry.activeSceneId, read.activeSceneId, `${label}.activeSceneId`);
  if (entry.generation !== read.generation || entry.contentSha256 !== read.contentSha256) {
    blocked(`${label} does not match the authoritative generation and content hash.`);
  }
  if (entry.assetCount !== read.assetCount) blocked(`${label}.assetCount does not match the authoritative asset count.`);
  stringValue(entry.displayName, `${label}.displayName`);
  integer(entry.lastOpenedSequence, `${label}.lastOpenedSequence`);
  if (entry.recoveredFrom !== null && typeof entry.recoveredFrom !== "string") blocked(`${label}.recoveredFrom must be null or a string.`);
  if (entry.blockerCode !== null && typeof entry.blockerCode !== "string") blocked(`${label}.blockerCode must be null or a string.`);
  if (entry.workspaceMetadataWarning !== null && typeof entry.workspaceMetadataWarning !== "string") blocked(`${label}.workspaceMetadataWarning must be null or a string.`);
}

function validateProjectRead(value: unknown, projectId: string, label: string): ProjectPersistentAddSceneAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = stringValue(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  const ids = sceneIds(read.sceneIds, `${label}.sceneIds`);
  const scenesSha256 = stringValue(read.scenesSha256, `${label}.scenesSha256`, sha256Pattern);
  const activeSceneId = stringValue(read.activeSceneId, `${label}.activeSceneId`, sceneIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  if (sceneCount !== ids.length || !ids.includes(activeSceneId)) blocked(`${label} Scene count or active Scene is inconsistent.`);
  const assets = validateAssets(read.assets, `${label}.assets`);
  const assetCollectionSha256 = stringValue(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  const primaryByteSha256 = stringValue(read.primaryByteSha256, `${label}.primaryByteSha256`, sha256Pattern);
  const backupByteSha256 = stringValue(read.backupByteSha256, `${label}.backupByteSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not an accepted status.`);
  integer(catalog.workspaceIndexGeneration, `${label}.catalog.workspaceIndexGeneration`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`);
  const matchingEntries = catalogEntries.filter((entry) => record(entry, `${label}.catalog.entries[]`).projectId === projectId);
  if (matchingEntries.length !== 1) blocked(`${label}.catalog must contain exactly one entry for the target project.`);
  const entryRead = { sceneIds: ids, activeSceneId, generation, contentSha256, assetCount: assets.length } as const;
  validateCatalogEntry(matchingEntries[0], projectId, entryRead, `${label}.catalog.entries[target]`);
  if (catalog.workspaceMetadataWarning !== null && typeof catalog.workspaceMetadataWarning !== "string") blocked(`${label}.catalog.workspaceMetadataWarning must be null or a string.`);
  validateCatalogEntry(read.catalogEntry, projectId, entryRead, `${label}.catalogEntry`);

  const project = record(read.project, `${label}.project`);
  const scenesJson = array(project.scenesJson, `${label}.project.scenesJson`);
  if (scenesJson.length !== sceneCount || scenesJson.some((scene, index) => typeof scene !== "string" || scene.length === 0 || index < 0)) {
    blocked(`${label}.project.scenesJson does not match the authoritative Scene count.`);
  }
  exact(project.activeSceneId, activeSceneId, `${label}.project.activeSceneId`);
  const projectAssets = validateAssets(project.assets, `${label}.project.assets`);
  if (projectAssets.length !== assets.length || canonicalize(projectAssets) !== canonicalize(assets)) {
    blocked(`${label}.project.assets does not match the authoritative asset collection.`);
  }
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256 || projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assets.length) {
    blocked(`${label}.project.receipt does not match the authoritative project state.`);
  }
  exact(projectReceipt.activeSceneId, activeSceneId, `${label}.project.receipt.activeSceneId`);
  stringValue(projectReceipt.sceneSha256, `${label}.project.receipt.sceneSha256`, sha256Pattern);
  stringValue(projectReceipt.persistedContentSha256, `${label}.project.receipt.persistedContentSha256`, sha256Pattern);
  validateSceneReceipts(projectReceipt.scenes, ids, `${label}.project.receipt.scenes`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, projectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the authoritative generation and content hash.`);
  exact(recovery.activeSceneId, activeSceneId, `${label}.recovery.activeSceneId`);
  validateSceneReceipts(recovery.scenes, ids, `${label}.recovery.scenes`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  exact(backup.status, "VALID", `${label}.recovery.backup.status`);
  exact(primary.byteSha256, primaryByteSha256, `${label}.recovery.primary.byteSha256`);
  exact(backup.byteSha256, backupByteSha256, `${label}.recovery.backup.byteSha256`);
  if (!Array.isArray(recovery.registeredAssets) || !Array.isArray(recovery.pendingArtifacts) || !Array.isArray(recovery.brokenSceneReferences)) {
    blocked(`${label}.recovery diagnostics must be arrays.`);
  }

  return read as ProjectPersistentAddSceneAuthoritativeRead;
}

function validateSaveReceipt(value: unknown, projectId: string, read: ProjectPersistentAddSceneAuthoritativeRead, label: string): ProjectSaveReceipt {
  const save = record(value, label);
  exact(save.operation, "dicebox.project.save", `${label}.operation`);
  exact(save.status, "PASS", `${label}.status`);
  exact(save.projectId, projectId, `${label}.projectId`);
  if (save.generation !== read.generation || save.contentSha256 !== read.contentSha256 || save.sceneCount !== read.sceneCount || save.assetCount !== read.assets.length) {
    blocked(`${label} does not match its authoritative reread.`);
  }
  exact(save.activeSceneId, read.activeSceneId, `${label}.activeSceneId`);
  stringValue(save.sceneSha256, `${label}.sceneSha256`, sha256Pattern);
  stringValue(save.projectRelativePath, `${label}.projectRelativePath`);
  validateSceneReceipts(save.scenes, read.sceneIds, `${label}.scenes`);
  trueValue(save.atomicReplace, `${label}.atomicReplace`);
  trueValue(save.directoryEntrySync, `${label}.directoryEntrySync`);
  trueValue(save.backupPreserved, `${label}.backupPreserved`);
  trueValue(save.noFoundryWrite, `${label}.noFoundryWrite`);
  return save as ProjectSaveReceipt;
}

function validateTerminalHistory(value: unknown, batchId: string, projectId: string, afterApply: ProjectPersistentAddSceneAuthoritativeRead, afterUndo: ProjectPersistentAddSceneAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Persistent add-Scene proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) {
    blocked("Persistent add-Scene history must end in exactly five receipts with status undone.");
  }
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) {
    blocked("Persistent add-Scene history does not use the expected preview-to-undo transition sequence.");
  }
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

function validateRedoneTerminalHistory(
  value: unknown,
  batchId: string,
  projectId: string,
  beforeRedo: ProjectPersistentAddSceneAuthoritativeRead,
  afterRedo: ProjectPersistentAddSceneAuthoritativeRead,
): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Persistent add-Scene redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) {
    blocked("Persistent add-Scene redo history must end in exactly six receipts with status redone.");
  }
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) {
    blocked("Persistent add-Scene redo history does not use the expected preview-to-redo transition sequence.");
  }
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (
    undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus
    || undo.reread.targetId !== projectId
    || undo.reread.revision !== beforeRedo.generation
    || undo.reread.sha256 !== beforeRedo.contentSha256
  ) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (
    redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus
    || redo.reread.targetId !== projectId
    || redo.reread.revision !== afterRedo.generation
    || redo.reread.sha256 !== afterRedo.contentSha256
  ) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateRedoLifecycle(
  beforeRedo: ProjectPersistentAddSceneAuthoritativeRead,
  afterRedo: ProjectPersistentAddSceneAuthoritativeRead,
  addedSceneId: string,
  addedOrdinal: number,
): void {
  if (addedOrdinal !== beforeRedo.sceneCount + 1) blocked("redo addedOrdinal is not the exact one-based append ordinal.");
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Persistent add-Scene redo rereads do not prove one exact monotonic generation.");
  if (afterRedo.sceneCount !== beforeRedo.sceneCount + 1) blocked("Persistent add-Scene redo does not prove exactly one Scene added.");
  if (!sameStrings(afterRedo.sceneIds, [...beforeRedo.sceneIds, addedSceneId]) || afterRedo.activeSceneId !== addedSceneId) {
    blocked("afterRedo does not contain exactly one ordered appended Scene and active selection.");
  }
  if (afterRedo.scenesSha256 === beforeRedo.scenesSha256 || afterRedo.contentSha256 === beforeRedo.contentSha256) {
    blocked("Redo Scene/content hashes do not prove a new persisted Scene state.");
  }
  if (afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256 || canonicalize(afterRedo.assets) !== canonicalize(beforeRedo.assets)) {
    blocked("Asset collection identity was not preserved across redo.");
  }
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) {
    blocked("Persistent add-Scene redo does not prove exact backup-preserving byte-envelope rotation.");
  }
}

function validateLifecycle(
  before: ProjectPersistentAddSceneAuthoritativeRead,
  afterApply: ProjectPersistentAddSceneAuthoritativeRead,
  afterUndo: ProjectPersistentAddSceneAuthoritativeRead,
  addedSceneId: string,
  addedOrdinal: number,
): void {
  if (addedOrdinal !== before.sceneCount + 1) blocked("addedOrdinal is not the exact one-based append ordinal.");
  if (afterApply.generation !== before.generation + 1 || afterUndo.generation !== afterApply.generation + 1) {
    blocked("Persistent add-Scene rereads do not prove two exact monotonic generations.");
  }
  if (afterApply.sceneCount !== before.sceneCount + 1 || afterUndo.sceneCount !== before.sceneCount) {
    blocked("Persistent add-Scene rereads do not prove one Scene added and one inverse restoration.");
  }
  if (!sameStrings(afterApply.sceneIds, [...before.sceneIds, addedSceneId]) || afterApply.activeSceneId !== addedSceneId) {
    blocked("afterApply does not contain exactly one ordered appended Scene and active selection.");
  }
  if (!sameStrings(afterUndo.sceneIds, before.sceneIds) || afterUndo.activeSceneId !== before.activeSceneId) {
    blocked("afterUndo does not restore the exact ordered Scene identity and active selection.");
  }
  if (afterApply.scenesSha256 === before.scenesSha256 || afterUndo.scenesSha256 !== before.scenesSha256) {
    blocked("Scene hashes do not prove one added Scene followed by exact inverse restoration.");
  }
  if (afterApply.assetCollectionSha256 !== before.assetCollectionSha256 || afterUndo.assetCollectionSha256 !== before.assetCollectionSha256 || canonicalize(afterApply.assets) !== canonicalize(before.assets) || canonicalize(afterUndo.assets) !== canonicalize(before.assets)) {
    blocked("Asset collection identity was not preserved across apply and inverse restoration.");
  }
  if (afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256) {
    blocked("Persistent add-Scene rereads do not prove exact backup-preserving byte-envelope rotation.");
  }
}

function validateExecutionReceipt(input: unknown): Readonly<{
  source: ProjectPersistentAddSceneExecutionReceipt;
  projectId: string;
  batchId: string;
  addedSceneId: string;
  addedOrdinal: number;
  before: ProjectPersistentAddSceneAuthoritativeRead;
  afterApply: ProjectPersistentAddSceneAuthoritativeRead;
  afterUndo: ProjectPersistentAddSceneAuthoritativeRead;
  history: ProposalBatchHistory;
}> {
  const source = record(input, "Persistent add-Scene execution receipt");
  exact(source.operation, "dicebox.project.add-scene.persist.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const projectId = stringValue(source.projectId, "execution receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "execution receipt.batchId", stableIdPattern);
  const addedSceneId = stringValue(source.addedSceneId, "execution receipt.addedSceneId", sceneIdPattern);
  const addedOrdinal = integer(source.addedOrdinal, "execution receipt.addedOrdinal");
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.projectPersistenceWrite, "execution receipt.projectPersistenceWrite");
  trueValue(source.sceneContentRestored, "execution receipt.sceneContentRestored");
  trueValue(source.assetsPreserved, "execution receipt.assetsPreserved");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");

  const before = validateProjectRead(source.before, projectId, "before");
  const afterApply = validateProjectRead(source.afterApply, projectId, "afterApply");
  const afterUndo = validateProjectRead(source.afterUndo, projectId, "afterUndo");
  validateLifecycle(before, afterApply, afterUndo, addedSceneId, addedOrdinal);
  validateSaveReceipt(source.save, projectId, afterApply, "save");
  validateSaveReceipt(source.inverseRestore, projectId, afterUndo, "inverseRestore");
  const history = validateTerminalHistory(source.history, batchId, projectId, afterApply, afterUndo);
  return { source: source as ProjectPersistentAddSceneExecutionReceipt, projectId, batchId, addedSceneId, addedOrdinal, before, afterApply, afterUndo, history };
}

export function bridgeProjectPersistentAddSceneExecutionToTerminalHistory(input: unknown): ProjectPersistentAddSceneTerminalHistoryReceipt {
  const validated = validateExecutionReceipt(input);
  return {
    schemaVersion: PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.add-scene.persist.execute",
    commandKind: "project.add-scene.persist",
    projectId: validated.projectId,
    batchId: validated.batchId,
    addedSceneId: validated.addedSceneId,
    addedOrdinal: validated.addedOrdinal,
    history: validated.history,
    historyStatus: "undone",
    historyTransitions: validated.history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { before: validated.before, afterApply: validated.afterApply, afterUndo: validated.afterUndo },
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
    projectContentWrite: true,
    projectPersistenceWrite: true,
    sceneContentRestored: true,
    assetsPreserved: true,
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
  afterRedo: ProjectPersistentAddSceneAuthoritativeRead,
): ProjectPersistentAddSceneRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Persistent add-Scene redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "Persistent add-Scene redo matched reread.status");
  exact(reread.targetId, projectId, "Persistent add-Scene redo matched reread.targetId");
  if (integer(reread.revision, "Persistent add-Scene redo matched reread.revision") !== afterRedo.generation) {
    blocked("Persistent add-Scene redo matched reread revision does not match afterRedo.");
  }
  const sha256 = stringValue(reread.sha256, "Persistent add-Scene redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.contentSha256) blocked("Persistent add-Scene redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.generation, sha256: afterRedo.contentSha256 };
}

export function bridgeProjectPersistentAddSceneRedoToTerminalHistory(input: unknown): ProjectPersistentAddSceneRedoTerminalHistoryReceipt {
  const source = record(input, "Persistent add-Scene redo receipt");
  exact(source.operation, "dicebox.project.add-scene.persist.redo", "redo receipt.operation");
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

  const beforeRedo = validateProjectRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateProjectRead(source.afterRedo, projectId, "afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, addedSceneId, addedOrdinal);
  validateSaveReceipt(source.redoReceipt, projectId, afterRedo, "redoReceipt");
  const history = validateRedoneTerminalHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);

  return {
    schemaVersion: PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.add-scene.persist.redo",
    commandKind: "project.add-scene.persist",
    projectId,
    batchId,
    addedSceneId,
    addedOrdinal,
    history,
    historyStatus: "redone",
    historyTransitions: history.receipts.map((receipt) => receipt.transition),
    authoritativeRereads: { beforeRedo, afterRedo },
    matchedReread,
    redoReceipt: source.redoReceipt as ProjectSaveReceipt,
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
    sourceProjectContentWrite: false,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
    noTransitionAuthority: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
  };
}

function sameReadIdentity(left: ProjectPersistentAddSceneAuthoritativeRead, right: ProjectPersistentAddSceneAuthoritativeRead): boolean {
  return left.projectId === right.projectId
    && left.generation === right.generation
    && left.contentSha256 === right.contentSha256
    && sameStrings(left.sceneIds, right.sceneIds)
    && left.scenesSha256 === right.scenesSha256
    && left.activeSceneId === right.activeSceneId
    && left.sceneCount === right.sceneCount
    && left.assetCollectionSha256 === right.assetCollectionSha256
    && canonicalize(left.assets) === canonicalize(right.assets)
    && left.primaryByteSha256 === right.primaryByteSha256
    && left.backupByteSha256 === right.backupByteSha256;
}

function parseTerminalHistoryReceipt(input: unknown): ProjectPersistentAddSceneTerminalHistoryReceipt {
  const receipt = record(input, "Persistent add-Scene terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.add-scene.persist.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.add-scene.persist", "terminal-history receipt.commandKind");
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
  trueValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  trueValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  trueValue(receipt.sceneContentRestored, "terminal-history receipt.sceneContentRestored");
  trueValue(receipt.assetsPreserved, "terminal-history receipt.assetsPreserved");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) {
    blocked("A successful terminal-undone receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  }

  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");

  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.projectId !== projectId || source.batchId !== batchId || source.addedSceneId !== addedSceneId || source.addedOrdinal !== addedOrdinal) {
    blocked("terminal-history receipt is not bound to the exact operation-specific source identity.");
  }
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateProjectRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateProjectRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateProjectRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  validateLifecycle(before, afterApply, afterUndo, addedSceneId, addedOrdinal);
  if (!sameReadIdentity(before, source.before) || !sameReadIdentity(afterApply, source.afterApply) || !sameReadIdentity(afterUndo, source.afterUndo)) {
    blocked("terminal-history receipt does not retain the exact authoritative rereads from its source receipt.");
  }
  const history = validateTerminalHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  if (canonicalize(history) !== canonicalize(source.history)) blocked("terminal-history receipt history differs from its source receipt.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) {
    blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  }
  return receipt as ProjectPersistentAddSceneTerminalHistoryReceipt;
}

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectPersistentAddSceneRedoTerminalHistoryReceipt {
  const receipt = record(input, "Persistent add-Scene redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_PERSISTENT_ADD_SCENE_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.add-scene.persist.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.add-scene.persist", "redo terminal-history receipt.commandKind");
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
  falseValue(receipt.sourceProjectContentWrite, "redo terminal-history receipt.sourceProjectContentWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) {
    blocked("A successful terminal-redone receipt cannot add mutation authority or erase blocker, unknown-outcome, reread, or retry semantics.");
  }
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");

  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "redo terminal-history receipt.authority.genericExecutor");

  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const beforeRedo = validateProjectRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateProjectRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, addedSceneId, addedOrdinal);
  const history = validateRedoneTerminalHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) {
    blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  }
  validateSaveReceipt(receipt.redoReceipt, projectId, afterRedo, "redo terminal-history receipt.redoReceipt");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectPersistentAddSceneRedoTerminalHistoryReceipt;
}

export const projectPersistentAddSceneTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectPersistentAddSceneTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectPersistentAddSceneTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectPersistentAddSceneTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectPersistentAddSceneTerminalHistoryValidationError
        ? error
        : new ProjectPersistentAddSceneTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const projectPersistentAddSceneRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectPersistentAddSceneRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectPersistentAddSceneRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectPersistentAddSceneTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectPersistentAddSceneTerminalHistoryValidationError
        ? error
        : new ProjectPersistentAddSceneTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
