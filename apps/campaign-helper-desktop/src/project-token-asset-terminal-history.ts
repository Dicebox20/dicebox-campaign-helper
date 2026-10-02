import { TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS, validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type {
  ProjectTokenAssetAuthoritativeRead,
  ProjectTokenAssetRegistrationExecutionFailureCode,
  ProjectTokenAssetRegistrationExecutionReceipt,
} from "./project-token-asset-executor";
import type { ProjectTokenAssetDescriptor } from "./project-token-asset-proposal-adapter";
import type { ProjectSaveReceipt } from "./project-store";

export const PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectTokenAssetTerminalHistoryBlockerCode =
  | ProjectTokenAssetRegistrationExecutionFailureCode
  | "TERMINAL_HISTORY_VALIDATION_FAILED";

export type ProjectTokenAssetTerminalHistoryBlocker = Readonly<{
  code: ProjectTokenAssetTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
}>;

export type ProjectTokenAssetTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.asset.register-token.execute";
  commandKind: "project.asset.register-token";
  projectId: string;
  batchId: string;
  asset: ProjectTokenAssetDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectTokenAssetAuthoritativeRead;
    afterApply: ProjectTokenAssetAuthoritativeRead;
    afterUndo: ProjectTokenAssetAuthoritativeRead;
  }>;
  sourceReceipt: ProjectTokenAssetRegistrationExecutionReceipt;
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
  assetBytesPersisted: true;
  assetTreePreserved: true;
  sceneContentRestored: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectTokenAssetRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.asset.register-token.redo";
  commandKind: "project.asset.register-token";
  projectId: string;
  batchId: string;
  asset: ProjectTokenAssetDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectTokenAssetAuthoritativeRead;
    afterRedo: ProjectTokenAssetAuthoritativeRead;
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
  noFoundryWrite: true;
  projectContentWrite: false;
  assetBytesPersisted: false;
  assetTreePreserved: true;
  sceneContentRestored: false;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectTokenAssetTerminalHistoryValidationError extends Error {
  readonly code: "TERMINAL_HISTORY_VALIDATION_FAILED";
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectTokenAssetTerminalHistoryValidationError";
    this.code = "TERMINAL_HISTORY_VALIDATION_FAILED";
  }
}

function blocked(message: string): never {
  throw new ProjectTokenAssetTerminalHistoryValidationError(message);
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

function validateAssetDescriptor(value: unknown, label: string): ProjectTokenAssetDescriptor {
  const asset = record(value, label);
  const assetId = stringValue(asset.assetId, `${label}.assetId`, stableIdPattern);
  const assetSha256 = stringValue(asset.assetSha256, `${label}.assetSha256`, sha256Pattern);
  if (asset.mediaType !== "image/png" && asset.mediaType !== "image/webp") blocked(`${label}.mediaType must be image/png or image/webp.`);
  exact(asset.role, "token", `${label}.role`);
  const assetLabel = stringValue(asset.label, `${label}.label`);
  if (assetLabel.trim() !== assetLabel || [...assetLabel].length > 100 || [...assetLabel].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) blocked(`${label}.label must be a trimmed non-control label of at most 100 characters.`);
  exact(asset.provenance, "user-import", `${label}.provenance`);
  if (assetId !== `dbx:asset:sha256-${assetSha256}`) blocked(`${label} must use the content-addressed token asset identity.`);
  return asset as ProjectTokenAssetDescriptor;
}

function validateStoredAsset(value: unknown, label: string): Record<string, unknown> {
  const asset = record(value, label);
  stringValue(asset.sha256, `${label}.sha256`, sha256Pattern);
  stringValue(asset.mediaType, `${label}.mediaType`);
  integer(asset.byteLength, `${label}.byteLength`);
  stringValue(asset.relativePath, `${label}.relativePath`);
  if (asset.registration !== undefined) {
    const registration = record(asset.registration, `${label}.registration`);
    stringValue(registration.assetId, `${label}.registration.assetId`, stableIdPattern);
    stringValue(registration.role, `${label}.registration.role`);
    stringValue(registration.label, `${label}.registration.label`);
    exact(registration.provenance, "user-import", `${label}.registration.provenance`);
  }
  return asset;
}

function validateAuthoritativeRead(value: unknown, projectId: string, label: string): ProjectTokenAssetAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = stringValue(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  stringValue(read.sceneContentSha256, `${label}.sceneContentSha256`, sha256Pattern);
  stringValue(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  const activeSceneId = stringValue(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  if (sceneCount < 1) blocked(`${label}.sceneCount must be positive.`);
  const assetValues = array(read.assets, `${label}.assets`);
  assetValues.forEach((asset, index) => validateStoredAsset(asset, `${label}.assets[${index}]`));
  const assetCount = integer(read.assetCount, `${label}.assetCount`);
  if (assetCount !== assetValues.length) blocked(`${label}.assetCount does not match its asset collection.`);
  stringValue(read.primaryByteSha256, `${label}.primaryByteSha256`, sha256Pattern);
  if (read.backupByteSha256 !== null) stringValue(read.backupByteSha256, `${label}.backupByteSha256`, sha256Pattern);
  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not accepted.`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`).map((entry, index) => record(entry, `${label}.catalog.entries[${index}]`));
  if (catalogEntries.filter((entry) => entry.projectId === projectId).length !== 1) blocked(`${label}.catalog must contain exactly one matching project entry.`);

  const catalogEntry = record(read.catalogEntry, `${label}.catalogEntry`);
  exact(catalogEntry.projectId, projectId, `${label}.catalogEntry.projectId`);
  exact(catalogEntry.status, "PASS", `${label}.catalogEntry.status`);
  if (catalogEntry.generation !== generation || catalogEntry.contentSha256 !== contentSha256 || catalogEntry.assetCount !== assetCount || catalogEntry.sceneCount !== sceneCount) blocked(`${label}.catalogEntry does not match generation, hash, or collection counts.`);

  const project = record(read.project, `${label}.project`);
  exact(project.activeSceneId, activeSceneId, `${label}.project.activeSceneId`);
  const scenesJson = array(project.scenesJson, `${label}.project.scenesJson`);
  if (scenesJson.length !== sceneCount) blocked(`${label}.project.scenesJson does not match sceneCount.`);
  const projectAssets = array(project.assets, `${label}.project.assets`);
  if (projectAssets.length !== assetCount) blocked(`${label}.project.assets does not match assetCount.`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256 || projectReceipt.activeSceneId !== activeSceneId || projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assetCount) blocked(`${label}.project.receipt does not match the authoritative project state.`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, projectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the authoritative project state.`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  exact(primary.byteSha256, read.primaryByteSha256 as string, `${label}.recovery.primary.byteSha256`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  if (read.backupByteSha256 === null) {
    exact(backup.status, "MISSING", `${label}.recovery.backup.status`);
  } else {
    exact(backup.status, "VALID", `${label}.recovery.backup.status`);
    exact(backup.byteSha256, read.backupByteSha256 as string, `${label}.recovery.backup.byteSha256`);
  }
  const registeredAssets = array(recovery.registeredAssets, `${label}.recovery.registeredAssets`);
  registeredAssets.forEach((asset, index) => {
    const registered = record(asset, `${label}.recovery.registeredAssets[${index}]`);
    stringValue(registered.assetId, `${label}.recovery.registeredAssets[${index}].assetId`, stableIdPattern);
    stringValue(registered.sha256, `${label}.recovery.registeredAssets[${index}].sha256`, sha256Pattern);
    stringValue(registered.mediaType, `${label}.recovery.registeredAssets[${index}].mediaType`);
    integer(registered.byteLength, `${label}.recovery.registeredAssets[${index}].byteLength`);
    stringValue(registered.relativePath, `${label}.recovery.registeredAssets[${index}].relativePath`);
    exact(registered.disposition, "PRESENT_VALID", `${label}.recovery.registeredAssets[${index}].disposition`);
  });
  return read as ProjectTokenAssetAuthoritativeRead;
}

function validateSaveReceipt(value: unknown, projectId: string, expectedGeneration: number, expectedAssetCount: number, label: string): void {
  const save = record(value, label);
  exact(save.operation, "dicebox.project.save", `${label}.operation`);
  exact(save.status, "PASS", `${label}.status`);
  exact(save.projectId, projectId, `${label}.projectId`);
  if (save.generation !== expectedGeneration || save.assetCount !== expectedAssetCount) blocked(`${label} does not match its expected generation or asset count.`);
  stringValue(save.contentSha256, `${label}.contentSha256`, sha256Pattern);
  stringValue(save.sceneSha256, `${label}.sceneSha256`, sha256Pattern);
  integer(save.sceneCount, `${label}.sceneCount`);
  stringValue(save.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  if (!Array.isArray(save.scenes) || save.scenes.length !== save.sceneCount) blocked(`${label}.scenes does not match sceneCount.`);
  stringValue(save.projectRelativePath, `${label}.projectRelativePath`);
  trueValue(save.atomicReplace, `${label}.atomicReplace`);
  trueValue(save.directoryEntrySync, `${label}.directoryEntrySync`);
  trueValue(save.backupPreserved, `${label}.backupPreserved`);
  trueValue(save.noFoundryWrite, `${label}.noFoundryWrite`);
}

function sameAssetTree(left: ProjectTokenAssetAuthoritativeRead, right: ProjectTokenAssetAuthoritativeRead): boolean {
  return JSON.stringify(left.assets) === JSON.stringify(right.assets) && left.assetCollectionSha256 === right.assetCollectionSha256 && left.assetCount === right.assetCount;
}

function validateTerminalHistory(value: unknown, batchId: string, projectId: string, afterApply: ProjectTokenAssetAuthoritativeRead, afterUndo: ProjectTokenAssetAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project token asset proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project token asset history must end in exactly five receipts with status undone.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("Project token asset history does not use the expected preview-to-undo sequence.");
  const commit = history.receipts[3]!;
  const undo = history.receipts[4]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== projectId || commit.reread.revision !== afterApply.generation || commit.reread.sha256 !== afterApply.contentSha256) blocked("Commit history does not retain the matched authoritative afterApply reread.");
  if (undo.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== afterUndo.generation || undo.reread.sha256 !== afterUndo.contentSha256) blocked("Undo history does not retain the matched authoritative afterUndo reread.");
  return history;
}

function validateRedoneHistory(value: unknown, batchId: string, projectId: string, beforeRedo: ProjectTokenAssetAuthoritativeRead, afterRedo: ProjectTokenAssetAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project token asset redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) blocked("Project token asset redo history must end in exactly six receipts with status redone.");
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedRedoneHistoryTransitions[index])) blocked("Project token asset redo history does not use the expected preview-to-redo sequence.");
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus || undo.reread.targetId !== projectId || undo.reread.revision !== beforeRedo.generation || undo.reread.sha256 !== beforeRedo.contentSha256) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus || redo.reread.targetId !== projectId || redo.reread.revision !== afterRedo.generation || redo.reread.sha256 !== afterRedo.contentSha256) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateRedoLifecycle(beforeRedo: ProjectTokenAssetAuthoritativeRead, afterRedo: ProjectTokenAssetAuthoritativeRead, descriptor: ProjectTokenAssetDescriptor): void {
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Token asset redo rereads do not prove one exact monotonic generation.");
  if (afterRedo.sceneContentSha256 !== beforeRedo.sceneContentSha256 || afterRedo.activeSceneId !== beforeRedo.activeSceneId || afterRedo.sceneCount !== beforeRedo.sceneCount || JSON.stringify(afterRedo.project.scenesJson) !== JSON.stringify(beforeRedo.project.scenesJson)) blocked("Token asset redo does not preserve the exact Scene collection, content, or active selection.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256 || !sameAssetTree(beforeRedo, afterRedo)) blocked("Token asset redo does not preserve the exact registered asset tree while proving a new project state.");
  const beforeAsset = beforeRedo.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  const afterAsset = afterRedo.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  if (beforeAsset.length !== 1 || afterAsset.length !== 1 || beforeAsset[0]!.mediaType !== descriptor.mediaType || afterAsset[0]!.mediaType !== descriptor.mediaType || beforeAsset[0]!.relativePath !== afterAsset[0]!.relativePath || beforeAsset[0]!.registration?.assetId !== descriptor.assetId || afterAsset[0]!.registration?.assetId !== descriptor.assetId || beforeAsset[0]!.registration?.role !== "token" || afterAsset[0]!.registration?.role !== "token" || beforeAsset[0]!.registration?.label !== descriptor.label || afterAsset[0]!.registration?.label !== descriptor.label || beforeAsset[0]!.registration?.provenance !== descriptor.provenance || afterAsset[0]!.registration?.provenance !== descriptor.provenance) blocked("Token asset redo rereads do not retain the exact approved content-addressed registration.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("Token asset redo does not prove exact backup-preserving byte-envelope rotation.");
}

function validateMatchedRedoReread(value: unknown, projectId: string, afterRedo: ProjectTokenAssetAuthoritativeRead): ProjectTokenAssetRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Token asset redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "Token asset redo matched reread.status");
  exact(reread.targetId, projectId, "Token asset redo matched reread.targetId");
  if (integer(reread.revision, "Token asset redo matched reread.revision") !== afterRedo.generation) blocked("Token asset redo matched reread revision does not match afterRedo.");
  const sha256 = stringValue(reread.sha256, "Token asset redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.contentSha256) blocked("Token asset redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.generation, sha256: afterRedo.contentSha256 };
}

function validateExecutionReceipt(input: unknown): {
  source: ProjectTokenAssetRegistrationExecutionReceipt;
  projectId: string;
  batchId: string;
  asset: ProjectTokenAssetDescriptor;
  before: ProjectTokenAssetAuthoritativeRead;
  afterApply: ProjectTokenAssetAuthoritativeRead;
  afterUndo: ProjectTokenAssetAuthoritativeRead;
  history: ProposalBatchHistory;
} {
  const source = record(input, "Project token asset registration execution receipt");
  exact(source.operation, "dicebox.project.asset.register-token.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const projectId = stringValue(source.projectId, "execution receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "execution receipt.batchId", stableIdPattern);
  const asset = validateAssetDescriptor(source.asset, "execution receipt.asset");
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.assetBytesPersisted, "execution receipt.assetBytesPersisted");
  trueValue(source.assetTreePreserved, "execution receipt.assetTreePreserved");
  trueValue(source.sceneContentRestored, "execution receipt.sceneContentRestored");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");
  const before = validateAuthoritativeRead(source.before, projectId, "before");
  const afterApply = validateAuthoritativeRead(source.afterApply, projectId, "afterApply");
  const afterUndo = validateAuthoritativeRead(source.afterUndo, projectId, "afterUndo");
  if (afterApply.generation !== before.generation + 1 || afterUndo.generation !== afterApply.generation + 1) blocked("Token asset rereads do not show two exact monotonic generations.");
  if (afterApply.contentSha256 === before.contentSha256 || afterUndo.contentSha256 === afterApply.contentSha256) blocked("Token asset rereads do not prove distinct apply and inverse content envelopes.");
  if (afterApply.sceneContentSha256 !== before.sceneContentSha256 || afterUndo.sceneContentSha256 !== before.sceneContentSha256 || afterApply.activeSceneId !== before.activeSceneId || afterUndo.activeSceneId !== before.activeSceneId || afterApply.sceneCount !== before.sceneCount || afterUndo.sceneCount !== before.sceneCount) blocked("Token asset rereads do not prove Scene preservation and inverse Scene restoration.");
  if (afterApply.assetCount !== before.assetCount + 1 || afterUndo.assetCount !== afterApply.assetCount || afterApply.assetCollectionSha256 === before.assetCollectionSha256 || !sameAssetTree(afterApply, afterUndo)) blocked("Token asset rereads do not prove additive registration and preserved asset tree through inverse restore.");
  const appliedAsset = afterApply.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  const restoredAsset = afterUndo.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  if (!appliedAsset || !restoredAsset || appliedAsset.registration?.assetId !== asset.assetId || restoredAsset.registration?.assetId !== asset.assetId || appliedAsset.mediaType !== asset.mediaType || restoredAsset.mediaType !== asset.mediaType || appliedAsset.registration?.role !== "token" || restoredAsset.registration?.role !== "token" || appliedAsset.registration?.label !== asset.label || restoredAsset.registration?.label !== asset.label || appliedAsset.registration?.provenance !== asset.provenance || restoredAsset.registration?.provenance !== asset.provenance) blocked("Token asset rereads do not retain the exact approved content-addressed registration.");
  if (afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256) blocked("Token asset rereads do not prove persisted envelope rotation and backup preservation.");
  validateSaveReceipt(source.save, projectId, afterApply.generation, afterApply.assetCount, "save");
  validateSaveReceipt(source.inverseRestore, projectId, afterUndo.generation, afterUndo.assetCount, "inverseRestore");
  const history = validateTerminalHistory(source.history, batchId, projectId, afterApply, afterUndo);
  return { source: source as ProjectTokenAssetRegistrationExecutionReceipt, projectId, batchId, asset, before, afterApply, afterUndo, history };
}

export function bridgeProjectTokenAssetRegistrationExecutionToTerminalHistory(input: unknown): ProjectTokenAssetTerminalHistoryReceipt {
  const validated = validateExecutionReceipt(input);
  return {
    schemaVersion: PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.asset.register-token.execute",
    commandKind: "project.asset.register-token",
    projectId: validated.projectId,
    batchId: validated.batchId,
    asset: validated.asset,
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
    noFoundryWrite: true,
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

export function bridgeProjectTokenAssetRegistrationRedoToTerminalHistory(input: unknown): ProjectTokenAssetRedoTerminalHistoryReceipt {
  const source = record(input, "Token asset redo receipt");
  exact(source.operation, "dicebox.project.asset.register-token.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = stringValue(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "redo receipt.batchId", stableIdPattern);
  const asset = validateAssetDescriptor(source.asset, "redo receipt.asset");
  falseValue(source.projectContentWrite, "redo receipt.projectContentWrite");
  falseValue(source.assetBytesPersisted, "redo receipt.assetBytesPersisted");
  trueValue(source.assetTreePreserved, "redo receipt.assetTreePreserved");
  falseValue(source.sceneContentRestored, "redo receipt.sceneContentRestored");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  const beforeRedo = validateAuthoritativeRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateAuthoritativeRead(source.afterRedo, projectId, "afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  validateSaveReceipt(source.redoReceipt, projectId, afterRedo.generation, afterRedo.assetCount, "redoReceipt");
  const history = validateRedoneHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);
  return {
    schemaVersion: PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.asset.register-token.redo",
    commandKind: "project.asset.register-token",
    projectId,
    batchId,
    asset,
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
    assetBytesPersisted: false,
    assetTreePreserved: true,
    sceneContentRestored: false,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
    noTransitionAuthority: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    rereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema",
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectTokenAssetTerminalHistoryReceipt {
  const receipt = record(input, "Project token asset terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.register-token.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.register-token", "terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const asset = validateAssetDescriptor(receipt.asset, "terminal-history receipt.asset");
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
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  trueValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  trueValue(receipt.assetBytesPersisted, "terminal-history receipt.assetBytesPersisted");
  trueValue(receipt.assetTreePreserved, "terminal-history receipt.assetTreePreserved");
  trueValue(receipt.sceneContentRestored, "terminal-history receipt.sceneContentRestored");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-undone receipt cannot erase blocker or outcome-unknown semantics.");
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateAuthoritativeRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateAuthoritativeRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateAuthoritativeRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  validateTerminalHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.projectId !== projectId || source.batchId !== batchId || source.asset.assetId !== asset.assetId || source.before.generation !== before.generation || source.afterApply.generation !== afterApply.generation || source.afterUndo.generation !== afterUndo.generation) blocked("terminal-history receipt is not bound to the exact validated source receipt and rereads.");
  return receipt as ProjectTokenAssetTerminalHistoryReceipt;
}

export const projectTokenAssetTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectTokenAssetTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectTokenAssetTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectTokenAssetTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectTokenAssetTerminalHistoryValidationError
        ? error
        : new ProjectTokenAssetTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectTokenAssetRedoTerminalHistoryReceipt {
  const receipt = record(input, "Token asset redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_TOKEN_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.register-token.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.register-token", "redo terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  validateAssetDescriptor(receipt.asset, "redo terminal-history receipt.asset");
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
  trueValue(receipt.noFoundryWrite, "redo terminal-history receipt.noFoundryWrite");
  falseValue(receipt.projectContentWrite, "redo terminal-history receipt.projectContentWrite");
  falseValue(receipt.assetBytesPersisted, "redo terminal-history receipt.assetBytesPersisted");
  trueValue(receipt.assetTreePreserved, "redo terminal-history receipt.assetTreePreserved");
  falseValue(receipt.sceneContentRestored, "redo terminal-history receipt.sceneContentRestored");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-redone receipt cannot add mutation authority or erase blocker, unknown-outcome, reread, or retry semantics.");
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectTokenAssetRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");
  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "redo terminal-history receipt.authority.genericExecutor");
  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const asset = validateAssetDescriptor(receipt.asset, "redo terminal-history receipt.asset");
  const beforeRedo = validateAuthoritativeRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateAuthoritativeRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  const history = validateRedoneHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  validateSaveReceipt(receipt.redoReceipt, projectId, afterRedo.generation, afterRedo.assetCount, "redo terminal-history receipt.redoReceipt");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectTokenAssetRedoTerminalHistoryReceipt;
}

export const projectTokenAssetRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectTokenAssetRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectTokenAssetRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectTokenAssetTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectTokenAssetTerminalHistoryValidationError
        ? error
        : new ProjectTokenAssetTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
