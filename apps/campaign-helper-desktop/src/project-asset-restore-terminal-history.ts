import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type { DesktopProjectProposalSession } from "./project-proposal-session";
import type {
  MissingAssetRestorePreviewReceipt,
  MissingAssetRestoreReceipt,
  ProjectRecoveryInspectionReceipt,
} from "./project-store";
import { isAssetRestoreUiTerminalInspection } from "./project-store";

export const PROJECT_ASSET_RESTORE_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedPreviewKeys = [
  "affectedSceneIds", "assetId", "assetSha256", "byteLength", "candidateByteLength", "candidateSha256",
  "contentSha256", "generation", "mediaType", "migrationStatus", "noFoundryWrite", "noWrite", "operation",
  "previewSha256", "protectedStateSha256", "recoveredFrom", "registration", "requiresApproval", "status",
  "projectId", "targetRelativePath",
] as const;
const expectedReceiptKeys = [
  "assetId", "assetSha256", "authoritativeAssetSha256", "authoritativeProjectContentSha256", "backupsUnchanged",
  "byteLength", "contentSha256", "createNewOnly", "directoryEntrySync", "envelopeUnchanged", "foreignStateUnchanged",
  "generation", "mediaType", "noFoundryWrite", "noProjectWrite", "operation", "previewSha256", "projectId",
  "projectStateUnchanged", "scenesUnchanged", "status", "targetRelativePath", "workspaceUnchanged", "affectedSceneIds",
] as const;
const expectedTerminalReceiptKeys = [
  "applyAuthority", "assetBytesWrite", "assetId", "assetSha256", "authority", "authoritativeRecoveryReread", "authoritativeReread",
  "backupsUnchanged", "batchId", "blocker", "bridgeOnly", "commandKind", "contentSha256", "createNewOnly",
  "directoryEntrySync", "disposition", "envelopeUnchanged", "execution", "expectedRemainingAssetIds", "foreignStatePreserved",
  "foreignStateUnchanged", "generation", "history", "historyStatus", "historyTransitions", "noExecutionAuthority",
  "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noProjectWrite", "operation", "outcomeUnknown",
  "projectContentWrite", "projectId", "projectPersistenceWrite", "projectStateUnchanged", "readyClaim", "retryAllowed",
  "scenesUnchanged", "schemaVersion", "session", "sourcePreview", "sourceReceipt", "status", "targetAuthority",
  "workspaceUnchanged", "authoritativeRereadRequired",
] as const;

type AssetRestoreRegistration = Readonly<{
  assetId: string;
  role: "background";
  label: string;
  provenance: string;
  approval: "approved";
}>;

type AssetRestorePreviewReceipt = MissingAssetRestorePreviewReceipt & Readonly<{
  status: "PREVIEW";
  registration: AssetRestoreRegistration;
}>;

export type ProjectAssetRestoreTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ASSET_RESTORE_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.asset.restore";
  commandKind: "project.asset.restore";
  projectId: string;
  batchId: string;
  generation: number;
  contentSha256: string;
  assetId: string;
  assetSha256: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRecoveryReread: ProjectRecoveryInspectionReceipt;
  expectedRemainingAssetIds: readonly string[];
  sourcePreview: AssetRestorePreviewReceipt;
  sourceReceipt: MissingAssetRestoreReceipt;
  session: DesktopProjectProposalSession;
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
  assetBytesWrite: true;
  projectContentWrite: false;
  projectPersistenceWrite: false;
  envelopeUnchanged: true;
  projectStateUnchanged: true;
  scenesUnchanged: true;
  workspaceUnchanged: true;
  backupsUnchanged: true;
  foreignStateUnchanged: true;
  createNewOnly: true;
  directoryEntrySync: true;
  noProjectWrite: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectAssetRestoreTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAssetRestoreTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAssetRestoreTerminalHistoryValidationError(message);
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

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  if (Object.keys(value).sort().join("|") !== [...expected].sort().join("|")) blocked(`${label} contains unknown or missing fields.`);
}

function knownKeys(value: Record<string, unknown>, required: readonly string[], optional: readonly string[], label: string): void {
  const allowed = new Set([...required, ...optional]);
  if (Object.keys(value).some((key) => !allowed.has(key)) || required.some((key) => !(key in value))) blocked(`${label} contains unknown or missing fields.`);
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

function ids(value: unknown, label: string): readonly string[] {
  const result = array(value, label).map((entry, index) => text(entry, `${label}[${index}]`, stableIdPattern));
  if (new Set(result).size !== result.length) blocked(`${label} must contain unique stable IDs.`);
  return result;
}

function sceneIds(value: unknown, label: string): readonly string[] {
  return ids(value, label);
}

function relativePath(value: unknown, label: string): string {
  const parsed = text(value, label);
  const normalized = parsed.replaceAll("\\", "/");
  if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized) || normalized.split("/").some((segment) => segment === "..")) {
    blocked(`${label} must remain a relative project-store path.`);
  }
  return parsed;
}

function validatePreview(value: unknown): AssetRestorePreviewReceipt {
  const preview = record(value, "asset-restore preview");
  exactKeys(preview, expectedPreviewKeys, "asset-restore preview");
  exact(preview.operation, "dicebox.project.asset.restore.preview", "preview.operation");
  exact(preview.status, "PREVIEW", "preview.status");
  text(preview.projectId, "preview.projectId", stableIdPattern);
  integer(preview.generation, "preview.generation");
  text(preview.contentSha256, "preview.contentSha256", sha256Pattern);
  exact(preview.migrationStatus, "current", "preview.migrationStatus");
  if (preview.recoveredFrom !== null) relativePath(preview.recoveredFrom, "preview.recoveredFrom");
  const assetId = text(preview.assetId, "preview.assetId", stableIdPattern);
  const assetSha256 = text(preview.assetSha256, "preview.assetSha256", sha256Pattern);
  if (!assetId.endsWith(assetSha256)) blocked("preview.assetId must be content-addressed by preview.assetSha256.");
  if (preview.mediaType !== "image/png" && preview.mediaType !== "image/webp") blocked("preview.mediaType must be image/png or image/webp.");
  const byteLength = integer(preview.byteLength, "preview.byteLength");
  if (byteLength < 1) blocked("preview.byteLength must be positive.");
  if (integer(preview.candidateByteLength, "preview.candidateByteLength") !== byteLength) blocked("preview candidate byte length must match the registered asset byte length.");
  relativePath(preview.targetRelativePath, "preview.targetRelativePath");
  sceneIds(preview.affectedSceneIds, "preview.affectedSceneIds");
  if (text(preview.candidateSha256, "preview.candidateSha256", sha256Pattern) !== assetSha256) blocked("preview candidate hash must match the registered asset hash.");
  text(preview.protectedStateSha256, "preview.protectedStateSha256", sha256Pattern);
  text(preview.previewSha256, "preview.previewSha256", sha256Pattern);
  trueValue(preview.requiresApproval, "preview.requiresApproval");
  trueValue(preview.noWrite, "preview.noWrite");
  trueValue(preview.noFoundryWrite, "preview.noFoundryWrite");
  const registration = record(preview.registration, "preview.registration");
  const registrationKeys = Object.keys(registration).sort().join("|");
  if (registrationKeys !== "approval|assetId|label|provenance|role") blocked("preview.registration contains unknown or missing fields.");
  exact(registration.assetId, assetId, "preview.registration.assetId");
  exact(registration.role, "background", "preview.registration.role");
  exact(registration.approval, "approved", "preview.registration.approval");
  text(registration.label, "preview.registration.label");
  text(registration.provenance, "preview.registration.provenance");
  return preview as unknown as AssetRestorePreviewReceipt;
}

function validateReceipt(value: unknown, preview: AssetRestorePreviewReceipt): MissingAssetRestoreReceipt {
  const receipt = record(value, "asset-restore receipt");
  exactKeys(receipt, expectedReceiptKeys, "asset-restore receipt");
  exact(receipt.operation, "dicebox.project.asset.restore", "receipt.operation");
  exact(receipt.status, "PASS", "receipt.status");
  exact(receipt.projectId, preview.projectId, "receipt.projectId");
  if (integer(receipt.generation, "receipt.generation") !== preview.generation) blocked("receipt.generation must preserve the preview generation.");
  if (text(receipt.contentSha256, "receipt.contentSha256", sha256Pattern) !== preview.contentSha256) blocked("receipt.contentSha256 must preserve project content.");
  exact(receipt.assetId, preview.assetId, "receipt.assetId");
  if (text(receipt.assetSha256, "receipt.assetSha256", sha256Pattern) !== preview.assetSha256 || text(receipt.authoritativeAssetSha256, "receipt.authoritativeAssetSha256", sha256Pattern) !== preview.assetSha256) blocked("receipt asset hash does not match the exact candidate.");
  exact(receipt.mediaType, preview.mediaType, "receipt.mediaType");
  if (integer(receipt.byteLength, "receipt.byteLength") !== preview.byteLength) blocked("receipt.byteLength does not match the exact candidate.");
  exact(receipt.targetRelativePath, preview.targetRelativePath, "receipt.targetRelativePath");
  if (canonicalize(sceneIds(receipt.affectedSceneIds, "receipt.affectedSceneIds")) !== canonicalize(sceneIds(preview.affectedSceneIds, "preview.affectedSceneIds"))) blocked("receipt.affectedSceneIds does not match the preview.");
  if (text(receipt.previewSha256, "receipt.previewSha256", sha256Pattern) !== preview.previewSha256 || text(receipt.authoritativeProjectContentSha256, "receipt.authoritativeProjectContentSha256", sha256Pattern) !== preview.contentSha256) blocked("receipt preview/content reread hashes do not match the preview.");
  trueValue(receipt.envelopeUnchanged, "receipt.envelopeUnchanged");
  trueValue(receipt.projectStateUnchanged, "receipt.projectStateUnchanged");
  trueValue(receipt.scenesUnchanged, "receipt.scenesUnchanged");
  trueValue(receipt.workspaceUnchanged, "receipt.workspaceUnchanged");
  trueValue(receipt.backupsUnchanged, "receipt.backupsUnchanged");
  trueValue(receipt.foreignStateUnchanged, "receipt.foreignStateUnchanged");
  trueValue(receipt.createNewOnly, "receipt.createNewOnly");
  trueValue(receipt.directoryEntrySync, "receipt.directoryEntrySync");
  trueValue(receipt.noProjectWrite, "receipt.noProjectWrite");
  trueValue(receipt.noFoundryWrite, "receipt.noFoundryWrite");
  return receipt as unknown as MissingAssetRestoreReceipt;
}

function validateFileDisposition(value: unknown, label: string): void {
  const disposition = record(value, label);
  knownKeys(disposition, ["relativePath", "status"], ["blockerCode", "blockerMessage", "byteSha256", "migrationStatus", "retry", "sourceSchemaVersion"], label);
  relativePath(disposition.relativePath, `${label}.relativePath`);
  text(disposition.status, `${label}.status`);
  for (const key of ["blockerCode", "blockerMessage", "migrationStatus", "retry", "sourceSchemaVersion"] as const) {
    if (disposition[key] !== undefined) text(disposition[key], `${label}.${key}`);
  }
  if (disposition.byteSha256 !== undefined) text(disposition.byteSha256, `${label}.byteSha256`, sha256Pattern);
}

function validateRegisteredAsset(value: unknown, label: string): Record<string, unknown> {
  const asset = record(value, label);
  knownKeys(asset, ["affectedSceneIds", "assetId", "byteLength", "disposition", "mediaType", "relativePath", "retry", "restoreEligible", "role", "sha256"], ["blockerCode", "blockerMessage"], label);
  text(asset.assetId, `${label}.assetId`, stableIdPattern);
  text(asset.role, `${label}.role`);
  text(asset.sha256, `${label}.sha256`, sha256Pattern);
  text(asset.mediaType, `${label}.mediaType`);
  integer(asset.byteLength, `${label}.byteLength`);
  relativePath(asset.relativePath, `${label}.relativePath`);
  sceneIds(asset.affectedSceneIds, `${label}.affectedSceneIds`);
  text(asset.disposition, `${label}.disposition`);
  if (asset.blockerCode !== undefined) text(asset.blockerCode, `${label}.blockerCode`);
  if (asset.blockerMessage !== undefined) text(asset.blockerMessage, `${label}.blockerMessage`);
  if (asset.retry !== undefined) text(asset.retry, `${label}.retry`);
  if (typeof asset.restoreEligible !== "boolean") blocked(`${label}.restoreEligible must be boolean.`);
  return asset;
}

function validateInspection(value: unknown, preview: AssetRestorePreviewReceipt, receipt: MissingAssetRestoreReceipt, expectedRemainingAssetIds: readonly string[]): ProjectRecoveryInspectionReceipt {
  const inspection = record(value, "asset-restore authoritative recovery reread");
  knownKeys(inspection, ["backup", "brokenSceneReferences", "contentSha256", "generation", "noFoundryWrite", "noWrite", "operation", "pendingArtifacts", "primary", "projectId", "registeredAssets", "restoreEligible", "retry", "scenes", "status"], ["activeSceneId", "blockerCode", "blockerMessage", "migrationStatus", "recoveredFrom"], "asset-restore authoritative recovery reread");
  exact(inspection.operation, "dicebox.project.recovery.inspect", "inspection.operation");
  exact(inspection.projectId, preview.projectId, "inspection.projectId");
  if (integer(inspection.generation, "inspection.generation") !== receipt.generation || text(inspection.contentSha256, "inspection.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("inspection identity does not match the restore receipt.");
  if (inspection.activeSceneId !== undefined) text(inspection.activeSceneId, "inspection.activeSceneId", stableIdPattern);
  if (inspection.recoveredFrom !== undefined) relativePath(inspection.recoveredFrom, "inspection.recoveredFrom");
  if (inspection.migrationStatus !== undefined) exact(inspection.migrationStatus, "current", "inspection.migrationStatus");
  if (inspection.blockerCode !== undefined) text(inspection.blockerCode, "inspection.blockerCode");
  if (inspection.blockerMessage !== undefined) text(inspection.blockerMessage, "inspection.blockerMessage");
  text(inspection.retry, "inspection.retry");
  if (typeof inspection.restoreEligible !== "boolean") blocked("inspection.restoreEligible must be boolean.");
  const scenes = array(inspection.scenes, "inspection.scenes");
  scenes.forEach((scene, index) => {
    const item = record(scene, `inspection.scenes[${index}]`);
    exactKeys(item, ["sceneId", "sceneSha256"], `inspection.scenes[${index}]`);
    text(item.sceneId, `inspection.scenes[${index}].sceneId`, stableIdPattern);
    text(item.sceneSha256, `inspection.scenes[${index}].sceneSha256`, sha256Pattern);
  });
  validateFileDisposition(inspection.primary, "inspection.primary");
  validateFileDisposition(inspection.backup, "inspection.backup");
  if (record(inspection.primary, "inspection.primary").status !== "VALID") blocked("inspection.primary must remain VALID after asset restore.");
  const backupStatus = record(inspection.backup, "inspection.backup").status;
  if (backupStatus !== "VALID" && backupStatus !== "MISSING") blocked("inspection.backup must remain VALID or MISSING after asset restore.");
  const pending = array(inspection.pendingArtifacts, "inspection.pendingArtifacts");
  pending.forEach((artifact, index) => {
    const item = record(artifact, `inspection.pendingArtifacts[${index}]`);
    knownKeys(item, ["artifactKind", "relativePath", "retry", "status"], ["blockerCode", "blockerMessage", "byteSha256", "stagedContentSha256"], `inspection.pendingArtifacts[${index}]`);
    text(item.artifactKind, `inspection.pendingArtifacts[${index}].artifactKind`);
    relativePath(item.relativePath, `inspection.pendingArtifacts[${index}].relativePath`);
    exact(item.status, "PRESENT_VALID", `inspection.pendingArtifacts[${index}].status`);
    if (item.blockerCode !== undefined) blocked(`inspection.pendingArtifacts[${index}] must not retain a blocker.`);
  });
  const broken = array(inspection.brokenSceneReferences, "inspection.brokenSceneReferences");
  if (broken.length !== 0) blocked("inspection must not retain broken Scene references after asset restore.");
  const registered = array(inspection.registeredAssets, "inspection.registeredAssets").map((entry, index) => validateRegisteredAsset(entry, `inspection.registeredAssets[${index}]`));
  if (new Set(registered.map((asset) => asset.assetId)).size !== registered.length) blocked("inspection.registeredAssets must not contain duplicate asset identities.");
  trueValue(inspection.noWrite, "inspection.noWrite");
  trueValue(inspection.noFoundryWrite, "inspection.noFoundryWrite");
  const selected = registered.find((entry) => entry.assetId === preview.assetId);
  if (!selected) blocked("inspection does not contain the restored asset.");
  exact(selected.role, "background", "inspection.selected.role");
  exact(selected.sha256, preview.assetSha256, "inspection.selected.sha256");
  exact(selected.mediaType, preview.mediaType, "inspection.selected.mediaType");
  if (integer(selected.byteLength, "inspection.selected.byteLength") !== preview.byteLength) blocked("inspection.selected.byteLength does not match the restored bytes.");
  exact(selected.relativePath, preview.targetRelativePath, "inspection.selected.relativePath");
  exact(selected.disposition, "PRESENT_VALID", "inspection.selected.disposition");
  falseValue(selected.restoreEligible, "inspection.selected.restoreEligible");
  if (selected.blockerCode !== undefined) blocked("inspection.selected must not retain a blocker after restore.");
  if (canonicalize(sceneIds(selected.affectedSceneIds, "inspection.selected.affectedSceneIds")) !== canonicalize(sceneIds(preview.affectedSceneIds, "preview.affectedSceneIds"))) blocked("inspection.selected.affectedSceneIds does not match the preview.");
  let terminal = false;
  try {
    terminal = isAssetRestoreUiTerminalInspection(inspection as unknown as ProjectRecoveryInspectionReceipt, preview.projectId, preview.assetId, expectedRemainingAssetIds);
  } catch {
    terminal = false;
  }
  if (!terminal) blocked("inspection does not prove selected/restored and unselected/preserved recovery topology.");
  return inspection as unknown as ProjectRecoveryInspectionReceipt;
}

function validateSession(value: unknown, preview: AssetRestorePreviewReceipt, receipt: MissingAssetRestoreReceipt): { session: DesktopProjectProposalSession; history: ProposalBatchHistory } {
  const session = record(value, "asset-restore proposal session");
  exactKeys(session, ["batch", "history", "projectId", "schemaVersion"], "asset-restore proposal session");
  exact(session.schemaVersion, "0.1.0", "session.schemaVersion");
  exact(session.projectId, preview.projectId, "session.projectId");
  const batch = record(session.batch, "session.batch");
  exactKeys(batch, ["base", "batchId", "batchSha256", "commands", "createdAt", "previousBatchSha256", "producer", "reviewAuthority", "revision", "risk", "schemaVersion", "targetAuthority"], "session.batch");
  exact(batch.schemaVersion, "0.1.0", "session.batch.schemaVersion");
  const batchId = text(batch.batchId, "session.batch.batchId", stableIdPattern);
  if (integer(batch.revision, "session.batch.revision") !== 0) blocked("session.batch.revision must remain the initial approved restore batch revision.");
  if (batch.previousBatchSha256 !== null) blocked("session.batch.previousBatchSha256 must be null for a new restore proposal.");
  text(batch.createdAt, "session.batch.createdAt");
  text(batch.batchSha256, "session.batch.batchSha256", sha256Pattern);
  const base = record(batch.base, "session.batch.base");
  exactKeys(base, ["targetId", "revision", "sha256"], "session.batch.base");
  exact(base.targetId, preview.projectId, "session.batch.base.targetId");
  if (integer(base.revision, "session.batch.base.revision") !== preview.generation) blocked("session base revision does not match preview.generation.");
  text(base.sha256, "session.batch.base.sha256", sha256Pattern);
  const producer = record(batch.producer, "session.batch.producer");
  exactKeys(producer, ["kind", "provider", "sourceId"], "session.batch.producer");
  exact(producer.kind, "project-store", "session.batch.producer.kind");
  exact(producer.sourceId, "project.asset.restore", "session.batch.producer.sourceId");
  if (producer.provider !== null) blocked("session.batch.producer.provider must be null.");
  const reviewAuthority = record(batch.reviewAuthority, "session.batch.reviewAuthority");
  exactKeys(reviewAuthority, ["domain", "requiredRole"], "session.batch.reviewAuthority");
  exact(reviewAuthority.domain, "human-review", "session.batch.reviewAuthority.domain");
  exact(reviewAuthority.requiredRole, "reviewer", "session.batch.reviewAuthority.requiredRole");
  const targetAuthority = record(batch.targetAuthority, "session.batch.targetAuthority");
  exactKeys(targetAuthority, ["domain", "requiredActiveGm"], "session.batch.targetAuthority");
  exact(targetAuthority.domain, "local-project", "session.batch.targetAuthority.domain");
  if (targetAuthority.requiredActiveGm !== false) blocked("session.batch.targetAuthority.requiredActiveGm must be false.");
  exact(batch.risk, "medium", "session.batch.risk");
  const commands = array(batch.commands, "session.batch.commands");
  if (commands.length !== 1) blocked("session.batch.commands must contain exactly one command.");
  const command = record(commands[0], "session.batch.commands[0]");
  exactKeys(command, ["commandId", "dependsOn", "kind", "payload"], "session.batch.commands[0]");
  text(command.commandId, "session.batch.commands[0].commandId", stableIdPattern);
  if (array(command.dependsOn, "session.batch.commands[0].dependsOn").length !== 0) blocked("session.batch.commands[0].dependsOn must be empty.");
  exact(command.kind, "project.asset.restore", "session.batch.commands[0].kind");
  const payload = record(command.payload, "session.batch.commands[0].payload");
  exactKeys(payload, ["affectedSceneIds", "assetId", "assetSha256", "candidateByteLength", "contentSha256", "generation", "mediaType", "operation", "previewSha256", "projectId", "registration"], "session.payload");
  exact(payload.operation, "project.asset.restore", "session.payload.operation");
  exact(payload.projectId, preview.projectId, "session.payload.projectId");
  if (integer(payload.generation, "session.payload.generation") !== preview.generation) blocked("session.payload.generation does not match preview.generation.");
  exact(payload.contentSha256, preview.contentSha256, "session.payload.contentSha256");
  exact(payload.assetId, preview.assetId, "session.payload.assetId");
  exact(payload.assetSha256, preview.assetSha256, "session.payload.assetSha256");
  exact(payload.mediaType, preview.mediaType, "session.payload.mediaType");
  if (integer(payload.candidateByteLength, "session.payload.candidateByteLength") !== preview.candidateByteLength) blocked("session.payload.candidateByteLength does not match the preview.");
  if (canonicalize(sceneIds(payload.affectedSceneIds, "session.payload.affectedSceneIds")) !== canonicalize(sceneIds(preview.affectedSceneIds, "preview.affectedSceneIds"))) blocked("session payload Scene IDs do not match the preview.");
  exact(payload.previewSha256, preview.previewSha256, "session.payload.previewSha256");
  const registration = record(payload.registration, "session.payload.registration");
  exactKeys(registration, ["approval", "assetId", "label", "provenance", "role"], "session.payload.registration");
  exact(registration.assetId, preview.assetId, "session.payload.registration.assetId");
  exact(registration.role, "background", "session.payload.registration.role");
  exact(registration.approval, "approved", "session.payload.registration.approval");
  exact(registration.label, preview.registration.label, "session.payload.registration.label");
  exact(registration.provenance, preview.registration.provenance, "session.payload.registration.provenance");
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(session.history);
  } catch (error) {
    blocked(`session.history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (history.status !== "committed" || history.batchId !== batchId || history.receipts.length !== expectedTransitions.length || history.receipts.some((item, index) => item.transition !== expectedTransitions[index])) blocked("session.history is not the exact preview-to-commit lifecycle.");
  for (const [index, item] of history.receipts.entries()) {
    if (item.batchId !== batchId || item.batchRevision !== batch.revision || item.batchSha256 !== batch.batchSha256) blocked(`session.history.receipts[${index}] is not bound to the exact approved restore batch.`);
  }
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== preview.projectId || commit.reread.revision !== receipt.generation || commit.reread.sha256 !== receipt.contentSha256) blocked("session.history does not retain the matched authoritative restore reread.");
  return { session: session as unknown as DesktopProjectProposalSession, history };
}

export function bridgeProjectAssetRestoreExecutionToTerminalHistory(input: unknown): ProjectAssetRestoreTerminalHistoryReceipt {
  const root = record(input, "asset-restore terminal-history input");
  const expectedKeys = ["expectedRemainingAssetIds", "inspection", "preview", "receipt", "session"];
  if (Object.keys(root).sort().join("|") !== expectedKeys.sort().join("|")) blocked("asset-restore terminal-history input contains unknown or missing fields.");
  const preview = validatePreview(root.preview);
  const receipt = validateReceipt(root.receipt, preview);
  const expectedRemainingAssetIds = ids(root.expectedRemainingAssetIds, "expectedRemainingAssetIds");
  if (expectedRemainingAssetIds.includes(preview.assetId)) blocked("expectedRemainingAssetIds cannot include the selected restored asset.");
  const authoritativeRecoveryReread = validateInspection(root.inspection, preview, receipt, expectedRemainingAssetIds);
  const session = validateSession(root.session, preview, receipt);
  return {
    schemaVersion: PROJECT_ASSET_RESTORE_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.asset.restore",
    commandKind: "project.asset.restore",
    projectId: preview.projectId,
    batchId: session.session.batch.batchId,
    generation: receipt.generation,
    contentSha256: receipt.contentSha256,
    assetId: receipt.assetId,
    assetSha256: receipt.assetSha256,
    history: session.history,
    historyStatus: "committed",
    historyTransitions: session.history.receipts.map((item) => item.transition),
    authoritativeRecoveryReread,
    expectedRemainingAssetIds,
    sourcePreview: preview,
    sourceReceipt: receipt,
    session: session.session,
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
    assetBytesWrite: true,
    projectContentWrite: false,
    projectPersistenceWrite: false,
    envelopeUnchanged: true,
    projectStateUnchanged: true,
    scenesUnchanged: true,
    workspaceUnchanged: true,
    backupsUnchanged: true,
    foreignStateUnchanged: true,
    createNewOnly: true,
    directoryEntrySync: true,
    noProjectWrite: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectAssetRestoreTerminalHistoryReceipt {
  const receipt = record(input, "asset-restore terminal-history receipt");
  exactKeys(receipt, expectedTerminalReceiptKeys, "asset-restore terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ASSET_RESTORE_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.restore", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.restore", "terminal-history receipt.commandKind");
  const projectId = text(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = text(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  integer(receipt.generation, "terminal-history receipt.generation");
  text(receipt.contentSha256, "terminal-history receipt.contentSha256", sha256Pattern);
  text(receipt.assetId, "terminal-history receipt.assetId", stableIdPattern);
  text(receipt.assetSha256, "terminal-history receipt.assetSha256", sha256Pattern);
  exact(receipt.historyStatus, "committed", "terminal-history receipt.historyStatus");
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
  trueValue(receipt.assetBytesWrite, "terminal-history receipt.assetBytesWrite");
  falseValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  falseValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  trueValue(receipt.envelopeUnchanged, "terminal-history receipt.envelopeUnchanged");
  trueValue(receipt.projectStateUnchanged, "terminal-history receipt.projectStateUnchanged");
  trueValue(receipt.scenesUnchanged, "terminal-history receipt.scenesUnchanged");
  trueValue(receipt.workspaceUnchanged, "terminal-history receipt.workspaceUnchanged");
  trueValue(receipt.backupsUnchanged, "terminal-history receipt.backupsUnchanged");
  trueValue(receipt.foreignStateUnchanged, "terminal-history receipt.foreignStateUnchanged");
  trueValue(receipt.createNewOnly, "terminal-history receipt.createNewOnly");
  trueValue(receipt.directoryEntrySync, "terminal-history receipt.directoryEntrySync");
  trueValue(receipt.noProjectWrite, "terminal-history receipt.noProjectWrite");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");
  const preview = validatePreview(receipt.sourcePreview);
  const source = validateReceipt(receipt.sourceReceipt, preview);
  if (source.projectId !== projectId || source.generation !== integer(receipt.generation, "terminal-history receipt.generation") || source.contentSha256 !== receipt.contentSha256 || source.assetId !== receipt.assetId || source.assetSha256 !== receipt.assetSha256) blocked("terminal-history receipt is not bound to the exact restore source identity.");
  const expectedRemainingAssetIds = ids(receipt.expectedRemainingAssetIds, "terminal-history receipt.expectedRemainingAssetIds");
  if (expectedRemainingAssetIds.includes(receipt.assetId as string)) blocked("terminal-history receipt expected remaining IDs cannot include the selected asset.");
  const authoritative = validateInspection(receipt.authoritativeRecoveryReread, preview, source, expectedRemainingAssetIds);
  const session = validateSession(receipt.session, preview, source);
  if (session.session.batch.batchId !== batchId || canonicalize(session.history) !== canonicalize(receipt.history)) blocked("terminal-history receipt does not retain the exact committed session history.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTransitions.length || transitions.some((item, index) => item !== expectedTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  if (canonicalize(authoritative) !== canonicalize(receipt.authoritativeRecoveryReread)) blocked("terminal-history receipt recovery reread changed during validation.");
  return receipt as unknown as ProjectAssetRestoreTerminalHistoryReceipt;
}

export const projectAssetRestoreTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAssetRestoreTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAssetRestoreTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAssetRestoreTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAssetRestoreTerminalHistoryValidationError
        ? error
        : new ProjectAssetRestoreTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
