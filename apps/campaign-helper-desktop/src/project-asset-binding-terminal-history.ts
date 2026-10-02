import {
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  validateProposalBatchHistory,
  type ProposalBatchHistory,
} from "@dicebox/core";
import type {
  ProjectAssetBindingAuthoritativeRead,
  ProjectAssetBindingExecutionFailureCode,
  ProjectAssetBindingExecutionReceipt,
} from "./project-asset-binding-executor";
import type { ProjectAssetBindingDescriptor } from "./project-asset-binding-proposal-adapter";
import type { ProjectSaveReceipt } from "./project-store";

export const PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;

export type ProjectAssetBindingTerminalHistoryBlockerCode = ProjectAssetBindingExecutionFailureCode | "TERMINAL_HISTORY_VALIDATION_FAILED";
export type ProjectAssetBindingTerminalHistoryBlocker = Readonly<{
  code: ProjectAssetBindingTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
}>;

export type ProjectAssetBindingTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.asset.bind.execute";
  commandKind: "project.asset.bind";
  projectId: string;
  batchId: string;
  asset: ProjectAssetBindingDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectAssetBindingAuthoritativeRead;
    afterApply: ProjectAssetBindingAuthoritativeRead;
    afterUndo: ProjectAssetBindingAuthoritativeRead;
  }>;
  sourceReceipt: ProjectAssetBindingExecutionReceipt;
  authority: Readonly<{ target: "local-project"; apply: "operation-specific"; genericExecutor: false }>;
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

export type ProjectAssetBindingRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.asset.bind.redo";
  commandKind: "project.asset.bind";
  projectId: string;
  batchId: string;
  asset: ProjectAssetBindingDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectAssetBindingAuthoritativeRead;
    afterRedo: ProjectAssetBindingAuthoritativeRead;
  }>;
  matchedReread: Readonly<{
    status: "matched";
    targetId: string;
    revision: number;
    sha256: string;
  }>;
  redoReceipt: ProjectSaveReceipt;
  authority: Readonly<{ target: "local-project"; apply: "operation-specific"; genericExecutor: false }>;
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
  assetBytesPersisted: false;
  assetTreePreserved: true;
  sceneContentRestored: false;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
  noTransitionAuthority: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectAssetBindingTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAssetBindingTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAssetBindingTerminalHistoryValidationError(message);
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

function validateAssetDescriptor(value: unknown, label: string): ProjectAssetBindingDescriptor {
  const asset = record(value, label);
  const assetId = stringValue(asset.assetId, `${label}.assetId`, stableIdPattern);
  const assetSha256 = stringValue(asset.assetSha256, `${label}.assetSha256`, sha256Pattern);
  exact(asset.mediaType, "image/png", `${label}.mediaType`);
  exact(asset.role, "background", `${label}.role`);
  stringValue(asset.sceneId, `${label}.sceneId`, stableIdPattern);
  const assetLabel = stringValue(asset.label, `${label}.label`);
  if (assetLabel.trim() !== assetLabel || [...assetLabel].length > 100 || [...assetLabel].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) blocked(`${label}.label must be a trimmed non-control label of at most 100 characters.`);
  exact(asset.provenance, "user-import", `${label}.provenance`);
  if (assetId !== `dbx:asset:sha256-${assetSha256}`) blocked(`${label} must use the content-addressed background asset identity.`);
  return asset as ProjectAssetBindingDescriptor;
}

function validateStoredAsset(value: unknown, label: string): void {
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
}

function validateAuthoritativeRead(value: unknown, projectId: string, label: string): ProjectAssetBindingAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = stringValue(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  stringValue(read.semanticContentSha256, `${label}.semanticContentSha256`, sha256Pattern);
  stringValue(read.sceneContentSha256, `${label}.sceneContentSha256`, sha256Pattern);
  stringValue(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  const activeSceneId = stringValue(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  if (sceneCount < 1) blocked(`${label}.sceneCount must be positive.`);
  const assets = array(read.assets, `${label}.assets`);
  assets.forEach((asset, index) => validateStoredAsset(asset, `${label}.assets[${index}]`));
  const assetCount = integer(read.assetCount, `${label}.assetCount`);
  if (assetCount !== assets.length) blocked(`${label}.assetCount does not match its asset collection.`);
  const bindings = array(read.backgroundBindings, `${label}.backgroundBindings`);
  bindings.forEach((binding, index) => {
    const value = record(binding, `${label}.backgroundBindings[${index}]`);
    stringValue(value.sceneId, `${label}.backgroundBindings[${index}].sceneId`, stableIdPattern);
    if (value.assetId !== null) stringValue(value.assetId, `${label}.backgroundBindings[${index}].assetId`, stableIdPattern);
  });
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
  if (array(project.scenesJson, `${label}.project.scenesJson`).length !== sceneCount) blocked(`${label}.project.scenesJson does not match sceneCount.`);
  if (array(project.assets, `${label}.project.assets`).length !== assetCount) blocked(`${label}.project.assets does not match assetCount.`);
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
  if (read.backupByteSha256 === null) exact(backup.status, "MISSING", `${label}.recovery.backup.status`);
  else {
    exact(backup.status, "VALID", `${label}.recovery.backup.status`);
    exact(backup.byteSha256, read.backupByteSha256 as string, `${label}.recovery.backup.byteSha256`);
  }
  array(recovery.registeredAssets, `${label}.recovery.registeredAssets`).forEach((asset, index) => {
    const registered = record(asset, `${label}.recovery.registeredAssets[${index}]`);
    stringValue(registered.assetId, `${label}.recovery.registeredAssets[${index}].assetId`, stableIdPattern);
    stringValue(registered.sha256, `${label}.recovery.registeredAssets[${index}].sha256`, sha256Pattern);
    stringValue(registered.relativePath, `${label}.recovery.registeredAssets[${index}].relativePath`);
    exact(registered.disposition, "PRESENT_VALID", `${label}.recovery.registeredAssets[${index}].disposition`);
  });
  return read as ProjectAssetBindingAuthoritativeRead;
}

function validateSaveReceipt(value: unknown, projectId: string, generation: number, assetCount: number, label: string): void {
  const save = record(value, label);
  exact(save.operation, "dicebox.project.save", `${label}.operation`);
  exact(save.status, "PASS", `${label}.status`);
  exact(save.projectId, projectId, `${label}.projectId`);
  if (save.generation !== generation || save.assetCount !== assetCount) blocked(`${label} does not match its expected generation or asset count.`);
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

function containsSameAssets(before: ProjectAssetBindingAuthoritativeRead, after: ProjectAssetBindingAuthoritativeRead): boolean {
  return before.assets.every((asset) => after.assets.some((candidate) => JSON.stringify(candidate) === JSON.stringify(asset)));
}

function validateHistory(value: unknown, batchId: string, projectId: string, afterApply: ProjectAssetBindingAuthoritativeRead, afterUndo: ProjectAssetBindingAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try { history = validateProposalBatchHistory(value); }
  catch (error) { blocked(`Project asset binding proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`); }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project asset binding history must end in exactly five receipts with status undone.");
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedHistoryTransitions[index])) blocked("Project asset binding history does not use the expected preview-to-undo sequence.");
  const commit = history.receipts[3]!;
  const undo = history.receipts[4]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== projectId || commit.reread.revision !== afterApply.generation || commit.reread.sha256 !== afterApply.contentSha256) blocked("Commit history does not retain the matched authoritative afterApply reread.");
  if (undo.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== afterUndo.generation || undo.reread.sha256 !== afterUndo.contentSha256) blocked("Undo history does not retain the matched authoritative afterUndo reread.");
  return history;
}

function validateRedoneHistory(value: unknown, batchId: string, projectId: string, beforeRedo: ProjectAssetBindingAuthoritativeRead, afterRedo: ProjectAssetBindingAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try { history = validateProposalBatchHistory(value); }
  catch (error) { blocked(`Project asset binding redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`); }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) blocked("Project asset binding redo history must end in exactly six receipts with status redone.");
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedRedoneHistoryTransitions[index])) blocked("Project asset binding redo history does not use the expected preview-to-redo sequence.");
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus || undo.reread.targetId !== projectId || undo.reread.revision !== beforeRedo.generation || undo.reread.sha256 !== beforeRedo.contentSha256) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus || redo.reread.targetId !== projectId || redo.reread.revision !== afterRedo.generation || redo.reread.sha256 !== afterRedo.contentSha256) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateRedoLifecycle(beforeRedo: ProjectAssetBindingAuthoritativeRead, afterRedo: ProjectAssetBindingAuthoritativeRead, asset: ProjectAssetBindingDescriptor): void {
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Asset binding redo rereads do not prove one exact monotonic generation.");
  if (afterRedo.sceneCount !== beforeRedo.sceneCount || afterRedo.activeSceneId !== beforeRedo.activeSceneId) blocked("Asset binding redo does not preserve the exact Scene collection and active selection.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256) blocked("Asset binding redo rereads do not prove a new persisted binding state.");
  if (afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256 || !containsSameAssets(beforeRedo, afterRedo)) blocked("Asset binding redo does not preserve the exact asset collection.");
  const beforeBinding = beforeRedo.backgroundBindings.find((binding) => binding.sceneId === asset.sceneId);
  const afterBinding = afterRedo.backgroundBindings.find((binding) => binding.sceneId === asset.sceneId);
  if (!beforeBinding || beforeBinding.assetId === asset.assetId || afterBinding?.assetId !== asset.assetId) blocked("Asset binding redo rereads do not prove one exact Scene binding transition.");
  const beforeAsset = beforeRedo.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  const afterAsset = afterRedo.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  if (!beforeAsset || !afterAsset || beforeAsset.relativePath !== `assets/sha256/${asset.assetSha256}` || afterAsset.relativePath !== beforeAsset.relativePath || beforeAsset.registration?.assetId !== asset.assetId || afterAsset.registration?.assetId !== asset.assetId || beforeAsset.registration?.role !== "background" || afterAsset.registration?.role !== "background" || beforeAsset.registration?.label !== asset.label || afterAsset.registration?.label !== asset.label || beforeAsset.registration?.provenance !== asset.provenance || afterAsset.registration?.provenance !== asset.provenance) blocked("Asset binding redo rereads do not retain the exact approved content-addressed registration.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("Asset binding redo does not prove exact backup-preserving byte-envelope rotation.");
}

function validateMatchedRedoReread(value: unknown, projectId: string, afterRedo: ProjectAssetBindingAuthoritativeRead): ProjectAssetBindingRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Asset binding redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "Asset binding redo matched reread.status");
  exact(reread.targetId, projectId, "Asset binding redo matched reread.targetId");
  if (integer(reread.revision, "Asset binding redo matched reread.revision") !== afterRedo.generation) blocked("Asset binding redo matched reread revision does not match afterRedo.");
  const sha256 = stringValue(reread.sha256, "Asset binding redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.contentSha256) blocked("Asset binding redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.generation, sha256: afterRedo.contentSha256 };
}

function validateExecutionReceipt(input: unknown): {
  source: ProjectAssetBindingExecutionReceipt;
  projectId: string;
  batchId: string;
  asset: ProjectAssetBindingDescriptor;
  before: ProjectAssetBindingAuthoritativeRead;
  afterApply: ProjectAssetBindingAuthoritativeRead;
  afterUndo: ProjectAssetBindingAuthoritativeRead;
  history: ProposalBatchHistory;
} {
  const source = record(input, "Project asset binding execution receipt");
  exact(source.operation, "dicebox.project.asset.bind.execute", "execution receipt.operation");
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
  const beforeBinding = before.backgroundBindings.find((binding) => binding.sceneId === asset.sceneId);
  const appliedBinding = afterApply.backgroundBindings.find((binding) => binding.sceneId === asset.sceneId);
  const undoneBinding = afterUndo.backgroundBindings.find((binding) => binding.sceneId === asset.sceneId);
  if (afterApply.generation !== before.generation + 1 || afterUndo.generation !== afterApply.generation + 1) blocked("Asset binding rereads do not show two exact monotonic generations.");
  if (afterApply.contentSha256 === before.contentSha256 || afterUndo.contentSha256 === afterApply.contentSha256) blocked("Asset binding rereads do not prove distinct apply and inverse content envelopes.");
  if (afterApply.sceneContentSha256 !== before.sceneContentSha256 || afterUndo.sceneContentSha256 !== before.sceneContentSha256 || afterApply.activeSceneId !== before.activeSceneId || afterUndo.activeSceneId !== before.activeSceneId || afterApply.sceneCount !== before.sceneCount || afterUndo.sceneCount !== before.sceneCount) blocked("Asset binding rereads do not prove Scene preservation and inverse Scene restoration.");
  if (!beforeBinding || beforeBinding.assetId === asset.assetId || appliedBinding?.assetId !== asset.assetId || undoneBinding?.assetId !== beforeBinding.assetId) blocked("Asset binding rereads do not prove one exact Scene binding transition and restoration.");
  if (afterApply.assetCount !== afterUndo.assetCount || afterApply.assetCollectionSha256 !== afterUndo.assetCollectionSha256 || !containsSameAssets(before, afterApply) || !containsSameAssets(afterApply, afterUndo)) blocked("Asset binding rereads do not prove asset-tree preservation through inverse restore.");
  const appliedAsset = afterApply.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  const restoredAsset = afterUndo.assets.find((candidate) => candidate.sha256 === asset.assetSha256);
  if (!appliedAsset || !restoredAsset || appliedAsset.relativePath !== `assets/sha256/${asset.assetSha256}` || restoredAsset.relativePath !== appliedAsset.relativePath || appliedAsset.registration?.assetId !== asset.assetId || restoredAsset.registration?.assetId !== asset.assetId || appliedAsset.registration?.role !== "background" || restoredAsset.registration?.role !== "background" || appliedAsset.registration?.label !== asset.label || restoredAsset.registration?.label !== asset.label || appliedAsset.registration?.provenance !== asset.provenance || restoredAsset.registration?.provenance !== asset.provenance) blocked("Asset binding rereads do not retain the exact approved content-addressed registration.");
  if (afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256) blocked("Asset binding rereads do not prove persisted envelope rotation and backup preservation.");
  validateSaveReceipt(source.save, projectId, afterApply.generation, afterApply.assetCount, "save");
  validateSaveReceipt(source.inverseRestore, projectId, afterUndo.generation, afterUndo.assetCount, "inverseRestore");
  const history = validateHistory(source.history, batchId, projectId, afterApply, afterUndo);
  return { source: source as ProjectAssetBindingExecutionReceipt, projectId, batchId, asset, before, afterApply, afterUndo, history };
}

export function bridgeProjectAssetBindingExecutionToTerminalHistory(input: unknown): ProjectAssetBindingTerminalHistoryReceipt {
  const validated = validateExecutionReceipt(input);
  return {
    schemaVersion: PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.asset.bind.execute",
    commandKind: "project.asset.bind",
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

export function bridgeProjectAssetBindingRedoToTerminalHistory(input: unknown): ProjectAssetBindingRedoTerminalHistoryReceipt {
  const source = record(input, "Asset binding redo receipt");
  exact(source.operation, "dicebox.project.asset.bind.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = stringValue(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "redo receipt.batchId", stableIdPattern);
  const asset = validateAssetDescriptor(source.asset, "redo receipt.asset");
  falseValue(source.projectContentWrite, "redo receipt.projectContentWrite");
  falseValue(source.assetBytesPersisted, "redo receipt.assetBytesPersisted");
  falseValue(source.sceneContentRestored, "redo receipt.sceneContentRestored");
  trueValue(source.assetTreePreserved, "redo receipt.assetTreePreserved");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  const beforeRedo = validateAuthoritativeRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateAuthoritativeRead(source.afterRedo, projectId, "afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  validateSaveReceipt(source.redoReceipt, projectId, afterRedo.generation, afterRedo.assetCount, "redoReceipt");
  const history = validateRedoneHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);
  return {
    schemaVersion: PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.asset.bind.redo",
    commandKind: "project.asset.bind",
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
    rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectAssetBindingTerminalHistoryReceipt {
  const receipt = record(input, "Project asset binding terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.bind.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.bind", "terminal-history receipt.commandKind");
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
  validateHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.projectId !== projectId || source.batchId !== batchId || source.asset.assetId !== asset.assetId || source.asset.sceneId !== asset.sceneId || source.before.generation !== before.generation || source.afterApply.generation !== afterApply.generation || source.afterUndo.generation !== afterUndo.generation) blocked("terminal-history receipt is not bound to the exact validated source receipt and rereads.");
  return receipt as ProjectAssetBindingTerminalHistoryReceipt;
}

export const projectAssetBindingTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAssetBindingTerminalHistoryReceipt { return parseTerminalHistoryReceipt(input); },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAssetBindingTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAssetBindingTerminalHistoryValidationError }> {
    try { return { success: true, data: parseTerminalHistoryReceipt(input) }; }
    catch (error) {
      const validationError = error instanceof ProjectAssetBindingTerminalHistoryValidationError
        ? error
        : new ProjectAssetBindingTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectAssetBindingRedoTerminalHistoryReceipt {
  const receipt = record(input, "Asset binding redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ASSET_BINDING_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.bind.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.bind", "redo terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  const asset = validateAssetDescriptor(receipt.asset, "redo terminal-history receipt.asset");
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
  falseValue(receipt.assetBytesPersisted, "redo terminal-history receipt.assetBytesPersisted");
  trueValue(receipt.assetTreePreserved, "redo terminal-history receipt.assetTreePreserved");
  falseValue(receipt.sceneContentRestored, "redo terminal-history receipt.sceneContentRestored");
  trueValue(receipt.noFoundryWrite, "redo terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-redone receipt cannot add mutation authority or erase blocker, unknown-outcome, reread, or retry semantics.");
  trueValue(receipt.noTransitionAuthority, "redo terminal-history receipt.noTransitionAuthority");
  exact(receipt.transitionInvocation, "not-invoked", "redo terminal-history receipt.transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "redo terminal-history receipt.rereadInvocation");
  exact(receipt.rereadClassifier, "projectAssetBindingRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");
  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "redo terminal-history receipt.authority.genericExecutor");
  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const beforeRedo = validateAuthoritativeRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateAuthoritativeRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  const history = validateRedoneHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  validateSaveReceipt(receipt.redoReceipt, projectId, afterRedo.generation, afterRedo.assetCount, "redo terminal-history receipt.redoReceipt");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectAssetBindingRedoTerminalHistoryReceipt;
}

export const projectAssetBindingRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAssetBindingRedoTerminalHistoryReceipt { return parseRedoTerminalHistoryReceipt(input); },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAssetBindingRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAssetBindingTerminalHistoryValidationError }> {
    try { return { success: true, data: parseRedoTerminalHistoryReceipt(input) }; }
    catch (error) {
      const validationError = error instanceof ProjectAssetBindingTerminalHistoryValidationError
        ? error
        : new ProjectAssetBindingTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
