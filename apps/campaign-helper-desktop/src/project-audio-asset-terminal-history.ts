import {
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  validateProposalBatchHistory,
  type ProposalBatchHistory,
} from "@dicebox/core";
import { migrateSceneDocument, serializeSceneDocument, type SceneDocument } from "@dicebox/scene";
import type {
  ProjectAudioAssetAuthoritativeRead,
  ProjectAudioAssetRegistrationExecutionFailureCode,
  ProjectAudioAssetRegistrationExecutionReceipt,
} from "./project-audio-asset-executor";
import type { ProjectAudioAssetDescriptor } from "./project-audio-asset-proposal-adapter";
import type { ProjectSaveReceipt, StoredAsset } from "./project-store";

export const PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo"] as const;
const expectedRedoneHistoryTransitions = ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"] as const;
const assetRoles = new Set(["background", "handout", "audio", "token"]);

export type ProjectAudioAssetTerminalHistoryBlockerCode =
  | ProjectAudioAssetRegistrationExecutionFailureCode
  | "TERMINAL_HISTORY_VALIDATION_FAILED";

export type ProjectAudioAssetTerminalHistoryBlocker = Readonly<{
  code: ProjectAudioAssetTerminalHistoryBlockerCode;
  message: string;
  outcomeUnknown: boolean;
  authoritativeRereadRequired: boolean;
  retryAllowed: boolean;
}>;

export type ProjectAudioAssetTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "undone";
  disposition: "terminal-undone";
  operation: "dicebox.project.asset.register-audio.execute";
  commandKind: "project.asset.register-audio";
  projectId: string;
  batchId: string;
  asset: ProjectAudioAssetDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "undone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    before: ProjectAudioAssetAuthoritativeRead;
    afterApply: ProjectAudioAssetAuthoritativeRead;
    afterUndo: ProjectAudioAssetAuthoritativeRead;
  }>;
  sourceReceipt: ProjectAudioAssetRegistrationExecutionReceipt;
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
  assetBytesPersisted: true;
  assetTreePreserved: true;
  sceneContentRestored: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export type ProjectAudioAssetRedoTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "redone";
  disposition: "terminal-redone";
  operation: "dicebox.project.asset.register-audio.redo";
  commandKind: "project.asset.register-audio";
  projectId: string;
  batchId: string;
  asset: ProjectAudioAssetDescriptor;
  history: ProposalBatchHistory;
  historyStatus: "redone";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRereads: Readonly<{
    beforeRedo: ProjectAudioAssetAuthoritativeRead;
    afterRedo: ProjectAudioAssetAuthoritativeRead;
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
  rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema";
}>;

export class ProjectAudioAssetTerminalHistoryValidationError extends Error {
  readonly code: "TERMINAL_HISTORY_VALIDATION_FAILED";
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAudioAssetTerminalHistoryValidationError";
    this.code = "TERMINAL_HISTORY_VALIDATION_FAILED";
  }
}

function blocked(message: string): never {
  throw new ProjectAudioAssetTerminalHistoryValidationError(message);
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

function canonicalize(value: unknown): string {
  if (value === undefined) blocked("Terminal-history evidence must contain JSON values.");
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) blocked("Terminal-history evidence cannot contain a non-finite number.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value !== "object") blocked("Terminal-history evidence must contain JSON values.");
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  if (Object.keys(value).sort().join("|") !== [...expected].sort().join("|")) blocked(`${label} contains unknown or missing fields.`);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function validateDescriptor(value: unknown, label: string): ProjectAudioAssetDescriptor {
  const descriptor = record(value, label);
  exactKeys(descriptor, ["assetId", "assetSha256", "mediaType", "role", "label", "provenance"], label);
  const assetSha256 = stringValue(descriptor.assetSha256, `${label}.assetSha256`, sha256Pattern);
  const assetId = stringValue(descriptor.assetId, `${label}.assetId`, stableIdPattern);
  exact(assetId, `dbx:asset:sha256-${assetSha256}`, `${label}.assetId`);
  exact(descriptor.mediaType, "audio/wav", `${label}.mediaType`);
  exact(descriptor.role, "audio", `${label}.role`);
  const labelValue = stringValue(descriptor.label, `${label}.label`);
  if (labelValue.trim() !== labelValue || [...labelValue].length > 100 || [...labelValue].some((character) => /[\u0000-\u001f\u007f]/u.test(character))) {
    blocked(`${label}.label must be 1–100 trimmed non-control characters.`);
  }
  exact(descriptor.provenance, "user-import", `${label}.provenance`);
  return descriptor as ProjectAudioAssetDescriptor;
}

function assetIdentity(asset: StoredAsset): Readonly<Record<string, unknown>> {
  return {
    sha256: asset.sha256,
    mediaType: asset.mediaType,
    byteLength: asset.byteLength,
    relativePath: asset.relativePath,
    ...(asset.registration === undefined ? {} : { registration: asset.registration }),
  };
}

function validateAssets(value: unknown, label: string): readonly StoredAsset[] {
  return array(value, label).map((entry, index) => {
    const asset = record(entry, `${label}[${index}]`);
    const hasRegistration = Object.prototype.hasOwnProperty.call(asset, "registration");
    exactKeys(asset, hasRegistration ? ["sha256", "mediaType", "byteLength", "relativePath", "registration"] : ["sha256", "mediaType", "byteLength", "relativePath"], `${label}[${index}]`);
    const sha256 = stringValue(asset.sha256, `${label}[${index}].sha256`, sha256Pattern);
    const mediaType = stringValue(asset.mediaType, `${label}[${index}].mediaType`);
    const byteLength = integer(asset.byteLength, `${label}[${index}].byteLength`);
    if (byteLength < 1) blocked(`${label}[${index}].byteLength must be positive.`);
    exact(asset.relativePath, `assets/sha256/${sha256}`, `${label}[${index}].relativePath`);
    if (asset.registration !== undefined) {
      const registration = record(asset.registration, `${label}[${index}].registration`);
      exactKeys(registration, ["assetId", "role", "label", "provenance", "approval"], `${label}[${index}].registration`);
      const registrationAssetId = stringValue(registration.assetId, `${label}[${index}].registration.assetId`, stableIdPattern);
      exact(registrationAssetId, `dbx:asset:sha256-${sha256}`, `${label}[${index}].registration.assetId`);
      const role = stringValue(registration.role, `${label}[${index}].registration.role`);
      if (!assetRoles.has(role)) blocked(`${label}[${index}].registration.role is not an allowed asset role.`);
      if (role === "audio") exact(mediaType, "audio/wav", `${label}[${index}].mediaType`);
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

function sceneSnapshot(value: unknown, expectedSceneCount: number, expectedActiveSceneId: string, label: string): Readonly<{ ids: readonly string[]; serialized: readonly string[] }> {
  const read = record(value, label);
  const project = record(read.project, `${label}.project`);
  const storedScenes = array(project.scenesJson, `${label}.project.scenesJson`);
  if (storedScenes.length !== expectedSceneCount || storedScenes.length === 0 || storedScenes.length > 256) blocked(`${label}.project.scenesJson does not match the authoritative Scene count.`);
  const scenes = storedScenes.map((stored, index) => {
    if (typeof stored !== "string" || stored.length === 0) blocked(`${label}.project.scenesJson[${index}] must be a non-empty JSON string.`);
    try {
      return migrateSceneDocument(JSON.parse(stored) as SceneDocument);
    } catch (error) {
      blocked(`${label}.project.scenesJson[${index}] is not a valid Scene: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
  const ids = scenes.map((scene, index) => stringValue(scene.id, `${label}.project.scenesJson[${index}].id`, stableIdPattern));
  if (new Set(ids).size !== ids.length || !ids.includes(expectedActiveSceneId)) blocked(`${label} Scene IDs or active Scene are inconsistent.`);
  exact(project.activeSceneId, expectedActiveSceneId, `${label}.project.activeSceneId`);
  return { ids, serialized: scenes.map(serializeSceneDocument) };
}

function validateCatalogEntry(value: unknown, projectId: string, read: Readonly<{ ids: readonly string[]; activeSceneId: string; generation: number; contentSha256: string; assetCount: number }>, label: string): void {
  const entry = record(value, label);
  exact(entry.projectId, projectId, `${label}.projectId`);
  exact(entry.status, "PASS", `${label}.status`);
  if (entry.sceneId !== read.ids[0]) blocked(`${label}.sceneId does not match the first authoritative Scene.`);
  if (entry.sceneCount !== read.ids.length) blocked(`${label}.sceneCount does not match the authoritative Scene count.`);
  exact(entry.activeSceneId, read.activeSceneId, `${label}.activeSceneId`);
  if (entry.generation !== read.generation || entry.contentSha256 !== read.contentSha256) blocked(`${label} does not match the authoritative generation and content hash.`);
  if (entry.assetCount !== read.assetCount) blocked(`${label}.assetCount does not match the authoritative asset count.`);
  stringValue(entry.displayName, `${label}.displayName`);
  integer(entry.lastOpenedSequence, `${label}.lastOpenedSequence`);
  if (entry.recoveredFrom !== null && typeof entry.recoveredFrom !== "string") blocked(`${label}.recoveredFrom must be null or a string.`);
  if (entry.blockerCode !== null && typeof entry.blockerCode !== "string") blocked(`${label}.blockerCode must be null or a string.`);
  if (entry.workspaceMetadataWarning !== null && typeof entry.workspaceMetadataWarning !== "string") blocked(`${label}.workspaceMetadataWarning must be null or a string.`);
}

function validateRecoveryAssets(value: unknown, assets: readonly StoredAsset[], label: string): void {
  const recoveryAssets = array(value, label).map((entry, index) => {
    const recovery = record(entry, `${label}[${index}]`);
    const assetId = stringValue(recovery.assetId, `${label}[${index}].assetId`, stableIdPattern);
    const role = stringValue(recovery.role, `${label}[${index}].role`);
    if (!assetRoles.has(role)) blocked(`${label}[${index}].role is not an allowed asset role.`);
    const sha256 = stringValue(recovery.sha256, `${label}[${index}].sha256`, sha256Pattern);
    exact(assetId, `dbx:asset:sha256-${sha256}`, `${label}[${index}].assetId`);
    const mediaType = stringValue(recovery.mediaType, `${label}[${index}].mediaType`);
    const byteLength = integer(recovery.byteLength, `${label}[${index}].byteLength`);
    if (byteLength < 1) blocked(`${label}[${index}].byteLength must be positive.`);
    if (role === "audio") exact(mediaType, "audio/wav", `${label}[${index}].mediaType`);
    exact(recovery.relativePath, `assets/sha256/${sha256}`, `${label}[${index}].relativePath`);
    const affectedSceneIds = array(recovery.affectedSceneIds, `${label}[${index}].affectedSceneIds`).map((sceneId, sceneIndex) => stringValue(sceneId, `${label}[${index}].affectedSceneIds[${sceneIndex}]`, stableIdPattern));
    stringValue(recovery.disposition, `${label}[${index}].disposition`);
    if (recovery.blockerCode !== undefined) stringValue(recovery.blockerCode, `${label}[${index}].blockerCode`);
    if (recovery.blockerMessage !== undefined) stringValue(recovery.blockerMessage, `${label}[${index}].blockerMessage`);
    if (recovery.retry !== undefined) stringValue(recovery.retry, `${label}[${index}].retry`);
    if (typeof recovery.restoreEligible !== "boolean") blocked(`${label}[${index}].restoreEligible must be boolean.`);
    return { assetId, role, sha256, mediaType, byteLength, relativePath: recovery.relativePath as string, affectedSceneIds, disposition: recovery.disposition as string, blockerCode: recovery.blockerCode as string | undefined };
  });
  if (new Set(recoveryAssets.map((asset) => asset.assetId)).size !== recoveryAssets.length) blocked(`${label} contains duplicate asset IDs.`);
  const registeredAssets = assets.filter((asset) => asset.registration !== undefined);
  if (recoveryAssets.length !== registeredAssets.length) blocked(`${label} does not match the persisted registered asset tree.`);
  for (const asset of registeredAssets) {
    const registration = asset.registration!;
    const matches = recoveryAssets.filter((candidate) => candidate.assetId === registration.assetId);
    if (matches.length !== 1 || matches[0]!.role !== registration.role || matches[0]!.sha256 !== asset.sha256 || matches[0]!.mediaType !== asset.mediaType || matches[0]!.byteLength !== asset.byteLength || matches[0]!.relativePath !== asset.relativePath || matches[0]!.disposition !== "PRESENT_VALID" || matches[0]!.blockerCode !== undefined) {
      blocked(`${label} does not attest every persisted registered asset as PRESENT_VALID.`);
    }
  }
}

function validateProjectRead(value: unknown, projectId: string, label: string): ProjectAudioAssetAuthoritativeRead {
  const read = record(value, label);
  exact(read.projectId, projectId, `${label}.projectId`);
  const generation = integer(read.generation, `${label}.generation`);
  const contentSha256 = stringValue(read.contentSha256, `${label}.contentSha256`, sha256Pattern);
  const sceneContentSha256 = stringValue(read.sceneContentSha256, `${label}.sceneContentSha256`, sha256Pattern);
  const assetCollectionSha256 = stringValue(read.assetCollectionSha256, `${label}.assetCollectionSha256`, sha256Pattern);
  const activeSceneId = stringValue(read.activeSceneId, `${label}.activeSceneId`, stableIdPattern);
  const sceneCount = integer(read.sceneCount, `${label}.sceneCount`);
  const assets = validateAssets(read.assets, `${label}.assets`);
  const assetCount = integer(read.assetCount, `${label}.assetCount`);
  if (assetCount !== assets.length) blocked(`${label}.assetCount does not match the authoritative asset collection.`);
  const primaryByteSha256 = stringValue(read.primaryByteSha256, `${label}.primaryByteSha256`, sha256Pattern);
  if (read.backupByteSha256 !== null) stringValue(read.backupByteSha256, `${label}.backupByteSha256`, sha256Pattern);

  const project = record(read.project, `${label}.project`);
  const snapshot = sceneSnapshot(read, sceneCount, activeSceneId, label);
  const projectAssets = validateAssets(project.assets, `${label}.project.assets`);
  if (projectAssets.length !== assets.length || canonicalize(projectAssets.map(assetIdentity)) !== canonicalize(assets.map(assetIdentity))) blocked(`${label}.project.assets does not match the authoritative asset collection.`);
  const projectReceipt = record(project.receipt, `${label}.project.receipt`);
  exact(projectReceipt.operation, "dicebox.project.load", `${label}.project.receipt.operation`);
  exact(projectReceipt.status, "PASS", `${label}.project.receipt.status`);
  exact(projectReceipt.projectId, projectId, `${label}.project.receipt.projectId`);
  if (projectReceipt.generation !== generation || projectReceipt.contentSha256 !== contentSha256 || projectReceipt.sceneCount !== sceneCount || projectReceipt.assetCount !== assetCount) blocked(`${label}.project.receipt does not match the authoritative project state.`);
  exact(projectReceipt.activeSceneId, activeSceneId, `${label}.project.receipt.activeSceneId`);
  stringValue(projectReceipt.sceneSha256, `${label}.project.receipt.sceneSha256`, sha256Pattern);
  stringValue(projectReceipt.persistedContentSha256, `${label}.project.receipt.persistedContentSha256`, sha256Pattern);
  validateSceneReceipts(projectReceipt.scenes, snapshot.ids, `${label}.project.receipt.scenes`);
  trueValue(projectReceipt.noFoundryWrite, `${label}.project.receipt.noFoundryWrite`);

  const catalog = record(read.catalog, `${label}.catalog`);
  exact(catalog.operation, "dicebox.project.catalog", `${label}.catalog.operation`);
  if (catalog.status !== "PASS" && catalog.status !== "PARTIAL") blocked(`${label}.catalog.status is not an accepted status.`);
  integer(catalog.workspaceIndexGeneration, `${label}.catalog.workspaceIndexGeneration`);
  trueValue(catalog.noWrite, `${label}.catalog.noWrite`);
  trueValue(catalog.noFoundryWrite, `${label}.catalog.noFoundryWrite`);
  const catalogEntries = array(catalog.entries, `${label}.catalog.entries`);
  const matchingEntries = catalogEntries.filter((entry) => record(entry, `${label}.catalog.entries[]`).projectId === projectId);
  if (matchingEntries.length !== 1) blocked(`${label}.catalog must contain exactly one entry for the target project.`);
  const entryRead = { ids: snapshot.ids, activeSceneId, generation, contentSha256, assetCount } as const;
  validateCatalogEntry(matchingEntries[0], projectId, entryRead, `${label}.catalog.entries[target]`);
  if (catalog.workspaceMetadataWarning !== null && typeof catalog.workspaceMetadataWarning !== "string") blocked(`${label}.catalog.workspaceMetadataWarning must be null or a string.`);
  validateCatalogEntry(read.catalogEntry, projectId, entryRead, `${label}.catalogEntry`);

  const recovery = record(read.recovery, `${label}.recovery`);
  exact(recovery.operation, "dicebox.project.recovery.inspect", `${label}.recovery.operation`);
  exact(recovery.status, "PASS", `${label}.recovery.status`);
  exact(recovery.projectId, projectId, `${label}.recovery.projectId`);
  if (recovery.generation !== generation || recovery.contentSha256 !== contentSha256) blocked(`${label}.recovery does not match the authoritative generation and content hash.`);
  exact(recovery.activeSceneId, activeSceneId, `${label}.recovery.activeSceneId`);
  validateSceneReceipts(recovery.scenes, snapshot.ids, `${label}.recovery.scenes`);
  trueValue(recovery.noWrite, `${label}.recovery.noWrite`);
  trueValue(recovery.noFoundryWrite, `${label}.recovery.noFoundryWrite`);
  const primary = record(recovery.primary, `${label}.recovery.primary`);
  exact(primary.status, "VALID", `${label}.recovery.primary.status`);
  stringValue(primary.relativePath, `${label}.recovery.primary.relativePath`);
  exact(primary.byteSha256, primaryByteSha256, `${label}.recovery.primary.byteSha256`);
  const backup = record(recovery.backup, `${label}.recovery.backup`);
  if (backup.status === "VALID") {
    stringValue(backup.relativePath, `${label}.recovery.backup.relativePath`);
    exact(backup.byteSha256, read.backupByteSha256 as string, `${label}.recovery.backup.byteSha256`);
  } else if (backup.status === "MISSING") {
    if (read.backupByteSha256 !== null) blocked(`${label}.recovery.backup is missing but the authoritative read retains a backup byte hash.`);
  } else {
    blocked(`${label}.recovery.backup.status must be VALID or MISSING.`);
  }
  validateRecoveryAssets(recovery.registeredAssets, assets, `${label}.recovery.registeredAssets`);
  if (!Array.isArray(recovery.pendingArtifacts) || !Array.isArray(recovery.brokenSceneReferences)) blocked(`${label}.recovery diagnostics must be arrays.`);
  stringValue(recovery.retry, `${label}.recovery.retry`);
  if (typeof recovery.restoreEligible !== "boolean") blocked(`${label}.recovery.restoreEligible must be boolean.`);

  trueValue(read.noWrite, `${label}.noWrite`);
  trueValue(read.noFoundryWrite, `${label}.noFoundryWrite`);
  return read as ProjectAudioAssetAuthoritativeRead;
}

function sceneState(read: ProjectAudioAssetAuthoritativeRead, label: string): Readonly<{ ids: readonly string[]; serialized: readonly string[] }> {
  return sceneSnapshot(read, read.sceneCount, read.activeSceneId, label);
}

function validateSaveReceipt(value: unknown, projectId: string, read: ProjectAudioAssetAuthoritativeRead, label: string): ProjectSaveReceipt {
  const save = record(value, label);
  exact(save.operation, "dicebox.project.save", `${label}.operation`);
  exact(save.status, "PASS", `${label}.status`);
  exact(save.projectId, projectId, `${label}.projectId`);
  if (save.generation !== read.generation || save.contentSha256 !== read.contentSha256 || save.sceneCount !== read.sceneCount || save.assetCount !== read.assetCount) blocked(`${label} does not match its authoritative reread.`);
  exact(save.activeSceneId, read.activeSceneId, `${label}.activeSceneId`);
  stringValue(save.sceneSha256, `${label}.sceneSha256`, sha256Pattern);
  stringValue(save.projectRelativePath, `${label}.projectRelativePath`);
  validateSceneReceipts(save.scenes, sceneState(read, label).ids, `${label}.scenes`);
  trueValue(save.atomicReplace, `${label}.atomicReplace`);
  trueValue(save.directoryEntrySync, `${label}.directoryEntrySync`);
  trueValue(save.backupPreserved, `${label}.backupPreserved`);
  trueValue(save.noFoundryWrite, `${label}.noFoundryWrite`);
  return save as ProjectSaveReceipt;
}

function validateTerminalHistory(value: unknown, batchId: string, projectId: string, afterApply: ProjectAudioAssetAuthoritativeRead, afterUndo: ProjectAudioAssetAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project audio asset proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "history.batchId");
  if (history.status !== "undone" || history.receipts.length !== expectedHistoryTransitions.length) blocked("Project audio asset history must end in exactly five receipts with status undone.");
  const transitions = history.receipts.map((receipt) => receipt.transition);
  if (transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("Project audio asset history does not use the expected preview-to-undo transition sequence.");
  const commit = history.receipts[3]!;
  const undo = history.receipts[4]!;
  if (commit.reread?.status !== "matched" || commit.reread.targetId !== projectId || commit.reread.revision !== afterApply.generation || commit.reread.sha256 !== afterApply.contentSha256) blocked("Commit history does not retain the matched authoritative afterApply reread.");
  if (undo.reread?.status !== "matched" || undo.reread.targetId !== projectId || undo.reread.revision !== afterUndo.generation || undo.reread.sha256 !== afterUndo.contentSha256) blocked("Undo history does not retain the matched authoritative afterUndo reread.");
  return history;
}

function validateRedoneHistory(value: unknown, batchId: string, projectId: string, beforeRedo: ProjectAudioAssetAuthoritativeRead, afterRedo: ProjectAudioAssetAuthoritativeRead): ProposalBatchHistory {
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(value);
  } catch (error) {
    blocked(`Project audio asset redo proposal history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(history.batchId, batchId, "redo history.batchId");
  if (history.status !== "redone" || history.receipts.length !== expectedRedoneHistoryTransitions.length) blocked("Project audio asset redo history must end in exactly six receipts with status redone.");
  if (history.receipts.some((receipt, index) => receipt.transition !== expectedRedoneHistoryTransitions[index])) blocked("Project audio asset redo history does not use the expected preview-to-redo sequence.");
  const undo = history.receipts[4]!;
  const redo = history.receipts[5]!;
  if (undo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus || undo.reread.targetId !== projectId || undo.reread.revision !== beforeRedo.generation || undo.reread.sha256 !== beforeRedo.contentSha256) blocked("Undo history does not retain the exact matched authoritative beforeRedo reread.");
  if (redo.reread?.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus || redo.reread.targetId !== projectId || redo.reread.revision !== afterRedo.generation || redo.reread.sha256 !== afterRedo.contentSha256) blocked("Redo history does not retain the exact matched post-redo authoritative reread.");
  return history;
}

function validateRedoLifecycle(beforeRedo: ProjectAudioAssetAuthoritativeRead, afterRedo: ProjectAudioAssetAuthoritativeRead, descriptor: ProjectAudioAssetDescriptor): void {
  const beforeScenes = sceneState(beforeRedo, "beforeRedo");
  const afterScenes = sceneState(afterRedo, "afterRedo");
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("Audio asset redo rereads do not prove one exact monotonic generation.");
  if (afterRedo.sceneContentSha256 !== beforeRedo.sceneContentSha256 || !sameStrings(afterScenes.ids, beforeScenes.ids) || canonicalize(afterScenes.serialized) !== canonicalize(beforeScenes.serialized) || afterRedo.activeSceneId !== beforeRedo.activeSceneId || afterRedo.sceneCount !== beforeRedo.sceneCount) blocked("Audio asset redo does not preserve the exact Scene collection, content, or active selection.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256 || afterRedo.assetCount !== beforeRedo.assetCount || afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256 || canonicalize(afterRedo.assets.map(assetIdentity)) !== canonicalize(beforeRedo.assets.map(assetIdentity))) blocked("Audio asset redo does not preserve the exact registered asset tree while proving a new project state.");
  const beforeAsset = beforeRedo.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  const afterAsset = afterRedo.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  if (beforeAsset.length !== 1 || afterAsset.length !== 1 || !assetMatchesDescriptor(beforeAsset[0]!, descriptor) || !assetMatchesDescriptor(afterAsset[0]!, descriptor)) blocked("Audio asset redo rereads do not retain the exact approved content-addressed registration.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("Audio asset redo does not prove exact backup-preserving byte-envelope rotation.");
}

function validateMatchedRedoReread(value: unknown, projectId: string, afterRedo: ProjectAudioAssetAuthoritativeRead): ProjectAudioAssetRedoTerminalHistoryReceipt["matchedReread"] {
  const reread = record(value, "Audio asset redo matched reread");
  exact(reread.status, TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus, "Audio asset redo matched reread.status");
  exact(reread.targetId, projectId, "Audio asset redo matched reread.targetId");
  if (integer(reread.revision, "Audio asset redo matched reread.revision") !== afterRedo.generation) blocked("Audio asset redo matched reread revision does not match afterRedo.");
  const sha256 = stringValue(reread.sha256, "Audio asset redo matched reread.sha256", sha256Pattern);
  if (sha256 !== afterRedo.contentSha256) blocked("Audio asset redo matched reread hash does not match afterRedo.");
  return { status: "matched", targetId: projectId, revision: afterRedo.generation, sha256: afterRedo.contentSha256 };
}

function assetMatchesDescriptor(asset: StoredAsset, descriptor: ProjectAudioAssetDescriptor): boolean {
  const registration = asset.registration;
  return asset.sha256 === descriptor.assetSha256
    && asset.mediaType === descriptor.mediaType
    && asset.relativePath === `assets/sha256/${descriptor.assetSha256}`
    && registration !== undefined
    && registration.assetId === descriptor.assetId
    && registration.role === descriptor.role
    && registration.label === descriptor.label
    && registration.provenance === descriptor.provenance
    && registration.approval === "approved";
}

function validateLifecycle(before: ProjectAudioAssetAuthoritativeRead, afterApply: ProjectAudioAssetAuthoritativeRead, afterUndo: ProjectAudioAssetAuthoritativeRead, descriptor: ProjectAudioAssetDescriptor): void {
  const beforeScenes = sceneState(before, "before");
  const afterApplyScenes = sceneState(afterApply, "afterApply");
  const afterUndoScenes = sceneState(afterUndo, "afterUndo");
  if (afterApply.generation !== before.generation + 1 || afterUndo.generation !== afterApply.generation + 1) blocked("Project audio asset rereads do not prove two exact monotonic generations.");
  if (afterApply.sceneContentSha256 !== before.sceneContentSha256 || afterUndo.sceneContentSha256 !== before.sceneContentSha256 || !sameStrings(afterApplyScenes.ids, beforeScenes.ids) || !sameStrings(afterUndoScenes.ids, beforeScenes.ids) || canonicalize(afterApplyScenes.serialized) !== canonicalize(beforeScenes.serialized) || canonicalize(afterUndoScenes.serialized) !== canonicalize(beforeScenes.serialized) || afterApply.activeSceneId !== before.activeSceneId || afterUndo.activeSceneId !== before.activeSceneId) blocked("Scene content or active Scene was not preserved and restored exactly.");

  const appliedAsset = afterApply.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  const restoredAsset = afterUndo.assets.filter((asset) => asset.sha256 === descriptor.assetSha256);
  if (before.assets.some((asset) => asset.sha256 === descriptor.assetSha256 || asset.registration?.assetId === descriptor.assetId) || appliedAsset.length !== 1 || restoredAsset.length !== 1 || !assetMatchesDescriptor(appliedAsset[0]!, descriptor) || !assetMatchesDescriptor(restoredAsset[0]!, descriptor)) blocked("Audio asset byte identity or registration is not exact across the lifecycle.");
  if (afterApply.assets.length !== before.assets.length + 1 || afterUndo.assets.length !== afterApply.assets.length) blocked("Audio asset lifecycle does not prove one additive persisted asset.");
  const withoutApplied = afterApply.assets.filter((asset) => asset.sha256 !== descriptor.assetSha256);
  if (canonicalize(withoutApplied.map(assetIdentity)) !== canonicalize(before.assets.map(assetIdentity)) || canonicalize(afterUndo.assets.map(assetIdentity)) !== canonicalize(afterApply.assets.map(assetIdentity)) || afterApply.assetCollectionSha256 === before.assetCollectionSha256 || afterUndo.assetCollectionSha256 !== afterApply.assetCollectionSha256) blocked("Asset tree preservation is not proven across apply and inverse restore.");
  if (afterApply.backupByteSha256 !== before.primaryByteSha256 || afterApply.primaryByteSha256 === before.primaryByteSha256 || afterUndo.backupByteSha256 !== afterApply.primaryByteSha256 || afterUndo.primaryByteSha256 === afterApply.primaryByteSha256) blocked("Audio asset rereads do not prove exact backup-preserving byte-envelope rotation.");
}

function validateExecutionReceipt(input: unknown): Readonly<{ source: ProjectAudioAssetRegistrationExecutionReceipt; projectId: string; batchId: string; asset: ProjectAudioAssetDescriptor; before: ProjectAudioAssetAuthoritativeRead; afterApply: ProjectAudioAssetAuthoritativeRead; afterUndo: ProjectAudioAssetAuthoritativeRead; history: ProposalBatchHistory }> {
  const source = record(input, "Project audio asset execution receipt");
  exact(source.operation, "dicebox.project.asset.register-audio.execute", "execution receipt.operation");
  exact(source.status, "PASS", "execution receipt.status");
  const projectId = stringValue(source.projectId, "execution receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "execution receipt.batchId", stableIdPattern);
  const asset = validateDescriptor(source.asset, "execution receipt.asset");
  trueValue(source.projectContentWrite, "execution receipt.projectContentWrite");
  trueValue(source.assetBytesPersisted, "execution receipt.assetBytesPersisted");
  trueValue(source.assetTreePreserved, "execution receipt.assetTreePreserved");
  trueValue(source.sceneContentRestored, "execution receipt.sceneContentRestored");
  trueValue(source.noFoundryWrite, "execution receipt.noFoundryWrite");
  const before = validateProjectRead(source.before, projectId, "before");
  const afterApply = validateProjectRead(source.afterApply, projectId, "afterApply");
  const afterUndo = validateProjectRead(source.afterUndo, projectId, "afterUndo");
  validateLifecycle(before, afterApply, afterUndo, asset);
  validateSaveReceipt(source.save, projectId, afterApply, "save");
  validateSaveReceipt(source.inverseRestore, projectId, afterUndo, "inverseRestore");
  const history = validateTerminalHistory(source.history, batchId, projectId, afterApply, afterUndo);
  return { source: source as ProjectAudioAssetRegistrationExecutionReceipt, projectId, batchId, asset, before, afterApply, afterUndo, history };
}

export function bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory(input: unknown): ProjectAudioAssetTerminalHistoryReceipt {
  const validated = validateExecutionReceipt(input);
  return {
    schemaVersion: PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "undone",
    disposition: "terminal-undone",
    operation: "dicebox.project.asset.register-audio.execute",
    commandKind: "project.asset.register-audio",
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
    projectContentWrite: true,
    assetBytesPersisted: true,
    assetTreePreserved: true,
    sceneContentRestored: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

export function bridgeProjectAudioAssetRegistrationRedoToTerminalHistory(input: unknown): ProjectAudioAssetRedoTerminalHistoryReceipt {
  const source = record(input, "Audio asset redo receipt");
  exact(source.operation, "dicebox.project.asset.register-audio.redo", "redo receipt.operation");
  exact(source.status, "PASS", "redo receipt.status");
  const projectId = stringValue(source.projectId, "redo receipt.projectId", stableIdPattern);
  const batchId = stringValue(source.batchId, "redo receipt.batchId", stableIdPattern);
  const asset = validateDescriptor(source.asset, "redo receipt.asset");
  falseValue(source.projectContentWrite, "redo receipt.projectContentWrite");
  falseValue(source.assetBytesPersisted, "redo receipt.assetBytesPersisted");
  trueValue(source.assetTreePreserved, "redo receipt.assetTreePreserved");
  falseValue(source.sceneContentRestored, "redo receipt.sceneContentRestored");
  trueValue(source.noProjectMutation, "redo receipt.noProjectMutation");
  trueValue(source.noFoundryWrite, "redo receipt.noFoundryWrite");
  const beforeRedo = validateProjectRead(source.beforeRedo, projectId, "beforeRedo");
  const afterRedo = validateProjectRead(source.afterRedo, projectId, "afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  validateSaveReceipt(source.redoReceipt, projectId, afterRedo, "redoReceipt");
  const history = validateRedoneHistory(source.history, batchId, projectId, beforeRedo, afterRedo);
  const matchedReread = validateMatchedRedoReread(source.matchedReread, projectId, afterRedo);
  return {
    schemaVersion: PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "redone",
    disposition: "terminal-redone",
    operation: "dicebox.project.asset.register-audio.redo",
    commandKind: "project.asset.register-audio",
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
    rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
  };
}

export const bridgeProjectAudioAssetExecutionToTerminalHistory = bridgeProjectAudioAssetRegistrationExecutionToTerminalHistory;

function parseTerminalHistoryReceipt(input: unknown): ProjectAudioAssetTerminalHistoryReceipt {
  const receipt = record(input, "Project audio asset terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "undone", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-undone", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.register-audio.execute", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.register-audio", "terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const asset = validateDescriptor(receipt.asset, "terminal-history receipt.asset");
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
  trueValue(receipt.assetBytesPersisted, "terminal-history receipt.assetBytesPersisted");
  trueValue(receipt.assetTreePreserved, "terminal-history receipt.assetTreePreserved");
  trueValue(receipt.sceneContentRestored, "terminal-history receipt.sceneContentRestored");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-undone receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");

  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");

  const source = validateExecutionReceipt(receipt.sourceReceipt);
  if (source.projectId !== projectId || source.batchId !== batchId || canonicalize(source.asset) !== canonicalize(asset)) blocked("terminal-history receipt is not bound to the exact operation-specific source identity.");
  const rereads = record(receipt.authoritativeRereads, "terminal-history receipt.authoritativeRereads");
  const before = validateProjectRead(rereads.before, projectId, "terminal-history receipt.authoritativeRereads.before");
  const afterApply = validateProjectRead(rereads.afterApply, projectId, "terminal-history receipt.authoritativeRereads.afterApply");
  const afterUndo = validateProjectRead(rereads.afterUndo, projectId, "terminal-history receipt.authoritativeRereads.afterUndo");
  validateLifecycle(before, afterApply, afterUndo, asset);
  if (canonicalize(before) !== canonicalize(source.before) || canonicalize(afterApply) !== canonicalize(source.afterApply) || canonicalize(afterUndo) !== canonicalize(source.afterUndo)) blocked("terminal-history receipt does not retain the exact authoritative rereads from its source receipt.");
  const history = validateTerminalHistory(receipt.history, batchId, projectId, afterApply, afterUndo);
  if (canonicalize(history) !== canonicalize(source.history)) blocked("terminal-history receipt history differs from its source receipt.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedHistoryTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-undo sequence.");
  return receipt as ProjectAudioAssetTerminalHistoryReceipt;
}

export const projectAudioAssetTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAudioAssetTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAudioAssetTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAudioAssetTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAudioAssetTerminalHistoryValidationError
        ? error
        : new ProjectAudioAssetTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

function parseRedoTerminalHistoryReceipt(input: unknown): ProjectAudioAssetRedoTerminalHistoryReceipt {
  const receipt = record(input, "Audio asset redo terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_AUDIO_ASSET_TERMINAL_HISTORY_SCHEMA_VERSION, "redo terminal-history receipt.schemaVersion");
  exact(receipt.status, "redone", "redo terminal-history receipt.status");
  exact(receipt.disposition, "terminal-redone", "redo terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.register-audio.redo", "redo terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.register-audio", "redo terminal-history receipt.commandKind");
  const projectId = stringValue(receipt.projectId, "redo terminal-history receipt.projectId", stableIdPattern);
  const batchId = stringValue(receipt.batchId, "redo terminal-history receipt.batchId", stableIdPattern);
  validateDescriptor(receipt.asset, "redo terminal-history receipt.asset");
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
  exact(receipt.rereadClassifier, "projectAudioAssetRedoTerminalHistoryReceiptSchema", "redo terminal-history receipt.rereadClassifier");
  const authority = record(receipt.authority, "redo terminal-history receipt.authority");
  exact(authority.target, "local-project", "redo terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "redo terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "redo terminal-history receipt.authority.genericExecutor");
  const rereads = record(receipt.authoritativeRereads, "redo terminal-history receipt.authoritativeRereads");
  const asset = validateDescriptor(receipt.asset, "redo terminal-history receipt.asset");
  const beforeRedo = validateProjectRead(rereads.beforeRedo, projectId, "redo terminal-history receipt.authoritativeRereads.beforeRedo");
  const afterRedo = validateProjectRead(rereads.afterRedo, projectId, "redo terminal-history receipt.authoritativeRereads.afterRedo");
  validateRedoLifecycle(beforeRedo, afterRedo, asset);
  const history = validateRedoneHistory(receipt.history, batchId, projectId, beforeRedo, afterRedo);
  const transitions = array(receipt.historyTransitions, "redo terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedRedoneHistoryTransitions.length || transitions.some((transition, index) => transition !== expectedRedoneHistoryTransitions[index])) blocked("redo terminal-history receipt.historyTransitions does not retain the expected preview-to-redo sequence.");
  validateSaveReceipt(receipt.redoReceipt, projectId, afterRedo, "redo terminal-history receipt.redoReceipt");
  validateMatchedRedoReread(receipt.matchedReread, projectId, afterRedo);
  return receipt as ProjectAudioAssetRedoTerminalHistoryReceipt;
}

export const projectAudioAssetRedoTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAudioAssetRedoTerminalHistoryReceipt {
    return parseRedoTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAudioAssetRedoTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAudioAssetTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseRedoTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAudioAssetTerminalHistoryValidationError
        ? error
        : new ProjectAudioAssetTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
