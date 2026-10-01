import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type { DesktopProjectProposalSession } from "./project-proposal-session";
import type {
  MissingAssetDetachPreviewReceipt,
  MissingAssetDetachReceipt,
  ProjectRecoveryInspectionReceipt,
} from "./project-store";

export const PROJECT_ASSET_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedPreviewKeys = [
  "affectedScenes", "assetId", "assetSha256", "assetTreeSha256", "byteLength", "contentSha256", "generation",
  "mediaType", "migrationStatus", "nextGeneration", "noFoundryWrite", "noWrite", "operation", "previewSha256",
  "primaryByteSha256", "projectId", "protectedStateSha256", "registration", "requiresApproval", "resultingAssetCollectionSha256",
  "resultingAssetCount", "resultingContentSha256", "resultingScenes", "status", "targetRelativePath",
] as const;
const expectedReceiptKeys = [
  "affectedScenes", "assetId", "assetSha256", "assetTreeUnchanged", "authoritativeReload", "backupPreservesPriorEnvelope",
  "contentSha256", "descriptorRemoved", "directoryEntrySync", "foreignStateUnchanged", "generation", "noFoundryWrite",
  "operation", "previousContentSha256", "previousGeneration", "previewSha256", "projectId", "scenes", "status",
  "targetRelativePath", "targetRemainsAbsent", "workspaceUnchanged",
] as const;
const expectedTerminalReceiptKeys = [
  "affectedScenes", "applyAuthority", "assetBytesWrite", "assetId", "assetSha256", "authority", "authoritativeRecoveryReread",
  "authoritativeReread", "backupPreservesPriorEnvelope", "batchId", "blocker", "bridgeOnly", "commandKind", "contentSha256",
  "descriptorRemoved", "directoryEntrySync", "disposition", "execution", "foreignStatePreserved", "foreignStateUnchanged",
  "generation", "history", "historyStatus", "historyTransitions", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor",
  "noProjectMutation", "noProjectWrite", "operation", "outcomeUnknown", "previewSha256", "previousContentSha256",
  "previousGeneration", "projectContentWrite", "projectId", "projectPersistenceWrite", "readyClaim", "schemaVersion", "scenes",
  "session", "sourcePreview", "sourceReceipt", "status", "targetAuthority", "targetRelativePath", "targetRemainsAbsent",
  "assetTreeUnchanged", "workspaceUnchanged", "authoritativeRereadRequired", "retryAllowed",
] as const;

type AssetDetachRegistration = Readonly<{
  assetId: string;
  role: "background";
  label: string;
  provenance: string;
  approval: "approved";
}>;

type AssetDetachPreviewReceipt = MissingAssetDetachPreviewReceipt & Readonly<{
  registration: AssetDetachRegistration;
}>;

export type ProjectAssetDetachTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_ASSET_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.asset.detach";
  commandKind: "project.asset.detach";
  projectId: string;
  batchId: string;
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  assetId: string;
  assetSha256: string;
  targetRelativePath: string;
  affectedScenes: readonly { sceneId: string; sceneSha256: string }[];
  scenes: readonly { sceneId: string; sceneSha256: string }[];
  previewSha256: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRecoveryReread: ProjectRecoveryInspectionReceipt;
  sourcePreview: AssetDetachPreviewReceipt;
  sourceReceipt: MissingAssetDetachReceipt;
  session: DesktopProjectProposalSession;
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
  assetBytesWrite: false;
  projectContentWrite: true;
  projectPersistenceWrite: true;
  descriptorRemoved: true;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  backupPreservesPriorEnvelope: true;
  targetRemainsAbsent: true;
  directoryEntrySync: true;
  noProjectWrite: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectAssetDetachTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAssetDetachTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAssetDetachTerminalHistoryValidationError(message);
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
  if (typeof value !== "string" || value.length === 0 || value.trim() !== value || (pattern !== undefined && !pattern.test(value))) {
    blocked(`${label} is invalid.`);
  }
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

function relativePath(value: unknown, label: string): string {
  const parsed = text(value, label);
  const normalized = parsed.replaceAll("\\", "/");
  if (normalized.startsWith("/") || /^[A-Za-z]:\//u.test(normalized) || normalized.split("/").some((segment) => segment === "..")) {
    blocked(`${label} must remain a relative project-store path.`);
  }
  return parsed;
}

function sceneReceipts(value: unknown, label: string): readonly { sceneId: string; sceneSha256: string }[] {
  return array(value, label).map((entry, index) => {
    const scene = record(entry, `${label}[${index}]`);
    exactKeys(scene, ["sceneId", "sceneSha256"], `${label}[${index}]`);
    return {
      sceneId: text(scene.sceneId, `${label}[${index}].sceneId`, stableIdPattern),
      sceneSha256: text(scene.sceneSha256, `${label}[${index}].sceneSha256`, sha256Pattern),
    };
  });
}

function validateRegistration(value: unknown, assetId: string, label: string): AssetDetachRegistration {
  const registration = record(value, label);
  exactKeys(registration, ["approval", "assetId", "label", "provenance", "role"], label);
  exact(registration.assetId, assetId, `${label}.assetId`);
  exact(registration.role, "background", `${label}.role`);
  exact(registration.approval, "approved", `${label}.approval`);
  return {
    assetId,
    role: "background",
    label: text(registration.label, `${label}.label`),
    provenance: text(registration.provenance, `${label}.provenance`),
    approval: "approved",
  };
}

function validatePreview(value: unknown): AssetDetachPreviewReceipt {
  const preview = record(value, "asset-detach preview");
  exactKeys(preview, expectedPreviewKeys, "asset-detach preview");
  exact(preview.operation, "dicebox.project.asset.detach.preview", "preview.operation");
  exact(preview.status, "PREVIEW", "preview.status");
  const projectId = text(preview.projectId, "preview.projectId", stableIdPattern);
  const generation = integer(preview.generation, "preview.generation");
  text(preview.contentSha256, "preview.contentSha256", sha256Pattern);
  exact(preview.migrationStatus, "current", "preview.migrationStatus");
  const assetId = text(preview.assetId, "preview.assetId", stableIdPattern);
  const assetSha256 = text(preview.assetSha256, "preview.assetSha256", sha256Pattern);
  if (!assetId.endsWith(assetSha256)) blocked("preview.assetId must be content-addressed by preview.assetSha256.");
  if (preview.mediaType !== "image/png" && preview.mediaType !== "image/webp") blocked("preview.mediaType must be image/png or image/webp.");
  if (integer(preview.byteLength, "preview.byteLength") < 1) blocked("preview.byteLength must be positive.");
  relativePath(preview.targetRelativePath, "preview.targetRelativePath");
  const affectedScenes = sceneReceipts(preview.affectedScenes, "preview.affectedScenes");
  const resultingScenes = sceneReceipts(preview.resultingScenes, "preview.resultingScenes");
  if (integer(preview.nextGeneration, "preview.nextGeneration") !== generation + 1) blocked("preview.nextGeneration must advance exactly one generation.");
  if (integer(preview.resultingAssetCount, "preview.resultingAssetCount") < 0) blocked("preview.resultingAssetCount must be non-negative.");
  for (const key of ["assetTreeSha256", "contentSha256", "primaryByteSha256", "protectedStateSha256", "previewSha256", "resultingAssetCollectionSha256", "resultingContentSha256"] as const) {
    text(preview[key], `preview.${key}`, sha256Pattern);
  }
  trueValue(preview.requiresApproval, "preview.requiresApproval");
  trueValue(preview.noWrite, "preview.noWrite");
  trueValue(preview.noFoundryWrite, "preview.noFoundryWrite");
  const registration = validateRegistration(preview.registration, assetId, "preview.registration");
  return { ...preview, projectId, generation, assetId, assetSha256, affectedScenes, resultingScenes, registration } as unknown as AssetDetachPreviewReceipt;
}

function validateReceipt(value: unknown, preview: AssetDetachPreviewReceipt): MissingAssetDetachReceipt {
  const receipt = record(value, "asset-detach receipt");
  exactKeys(receipt, expectedReceiptKeys, "asset-detach receipt");
  exact(receipt.operation, "dicebox.project.asset.detach", "receipt.operation");
  exact(receipt.status, "PASS", "receipt.status");
  exact(receipt.projectId, preview.projectId, "receipt.projectId");
  if (integer(receipt.previousGeneration, "receipt.previousGeneration") !== preview.generation) blocked("receipt.previousGeneration must match preview.generation.");
  if (integer(receipt.generation, "receipt.generation") !== preview.nextGeneration) blocked("receipt.generation must match preview.nextGeneration.");
  if (text(receipt.previousContentSha256, "receipt.previousContentSha256", sha256Pattern) !== preview.contentSha256) blocked("receipt.previousContentSha256 must match preview.contentSha256.");
  if (text(receipt.contentSha256, "receipt.contentSha256", sha256Pattern) !== preview.resultingContentSha256) blocked("receipt.contentSha256 must match preview.resultingContentSha256.");
  exact(receipt.assetId, preview.assetId, "receipt.assetId");
  exact(receipt.assetSha256, preview.assetSha256, "receipt.assetSha256");
  exact(receipt.targetRelativePath, preview.targetRelativePath, "receipt.targetRelativePath");
  if (canonicalize(sceneReceipts(receipt.affectedScenes, "receipt.affectedScenes")) !== canonicalize(preview.affectedScenes)) blocked("receipt.affectedScenes does not match the preview.");
  if (canonicalize(sceneReceipts(receipt.scenes, "receipt.scenes")) !== canonicalize(preview.resultingScenes)) blocked("receipt.scenes does not match preview.resultingScenes.");
  if (text(receipt.previewSha256, "receipt.previewSha256", sha256Pattern) !== preview.previewSha256) blocked("receipt.previewSha256 does not match the preview.");
  for (const key of ["descriptorRemoved", "assetTreeUnchanged", "workspaceUnchanged", "foreignStateUnchanged", "backupPreservesPriorEnvelope", "targetRemainsAbsent", "authoritativeReload", "directoryEntrySync", "noFoundryWrite"] as const) trueValue(receipt[key], `receipt.${key}`);
  return receipt as unknown as MissingAssetDetachReceipt;
}

function validateFileDisposition(value: unknown, label: string): void {
  const disposition = record(value, label);
  knownKeys(disposition, ["relativePath", "status"], ["blockerCode", "blockerMessage", "byteSha256", "migrationStatus", "retry", "sourceSchemaVersion"], label);
  relativePath(disposition.relativePath, `${label}.relativePath`);
  text(disposition.status, `${label}.status`);
  for (const key of ["blockerCode", "blockerMessage", "migrationStatus", "retry", "sourceSchemaVersion"] as const) if (disposition[key] !== undefined) text(disposition[key], `${label}.${key}`);
  if (disposition.byteSha256 !== undefined) text(disposition.byteSha256, `${label}.byteSha256`, sha256Pattern);
}

function validateRegisteredAsset(value: unknown, label: string): Record<string, unknown> {
  const asset = record(value, label);
  knownKeys(asset, ["affectedSceneIds", "assetId", "byteLength", "disposition", "mediaType", "relativePath", "restoreEligible", "role", "sha256"], ["blockerCode", "blockerMessage", "retry"], label);
  text(asset.assetId, `${label}.assetId`, stableIdPattern);
  text(asset.role, `${label}.role`);
  text(asset.sha256, `${label}.sha256`, sha256Pattern);
  text(asset.mediaType, `${label}.mediaType`);
  integer(asset.byteLength, `${label}.byteLength`);
  relativePath(asset.relativePath, `${label}.relativePath`);
  ids(asset.affectedSceneIds, `${label}.affectedSceneIds`);
  text(asset.disposition, `${label}.disposition`);
  if (asset.blockerCode !== undefined) text(asset.blockerCode, `${label}.blockerCode`);
  if (asset.blockerMessage !== undefined) text(asset.blockerMessage, `${label}.blockerMessage`);
  if (asset.retry !== undefined) text(asset.retry, `${label}.retry`);
  if (typeof asset.restoreEligible !== "boolean") blocked(`${label}.restoreEligible must be boolean.`);
  return asset;
}

function validateInspection(value: unknown, preview: AssetDetachPreviewReceipt, receipt: MissingAssetDetachReceipt): ProjectRecoveryInspectionReceipt {
  const inspection = record(value, "asset-detach authoritative recovery reread");
  knownKeys(inspection, ["backup", "brokenSceneReferences", "contentSha256", "generation", "noFoundryWrite", "noWrite", "operation", "pendingArtifacts", "primary", "projectId", "registeredAssets", "restoreEligible", "retry", "scenes", "status"], ["activeSceneId", "blockerCode", "blockerMessage", "migrationStatus", "recoveredFrom"], "asset-detach authoritative recovery reread");
  exact(inspection.operation, "dicebox.project.recovery.inspect", "inspection.operation");
  exact(inspection.projectId, preview.projectId, "inspection.projectId");
  if (integer(inspection.generation, "inspection.generation") !== receipt.generation || text(inspection.contentSha256, "inspection.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("inspection identity does not match the detach receipt.");
  if (inspection.activeSceneId !== undefined) text(inspection.activeSceneId, "inspection.activeSceneId", stableIdPattern);
  if (inspection.recoveredFrom !== undefined) relativePath(inspection.recoveredFrom, "inspection.recoveredFrom");
  if (inspection.migrationStatus !== undefined) exact(inspection.migrationStatus, "current", "inspection.migrationStatus");
  if (inspection.blockerCode !== undefined) text(inspection.blockerCode, "inspection.blockerCode");
  if (inspection.blockerMessage !== undefined) text(inspection.blockerMessage, "inspection.blockerMessage");
  text(inspection.status, "inspection.status");
  text(inspection.retry, "inspection.retry");
  if (typeof inspection.restoreEligible !== "boolean") blocked("inspection.restoreEligible must be boolean.");
  if (canonicalize(sceneReceipts(inspection.scenes, "inspection.scenes")) !== canonicalize(sceneReceipts(receipt.scenes, "receipt.scenes"))) blocked("inspection.scenes does not match the authoritative detach receipt.");
  validateFileDisposition(inspection.primary, "inspection.primary");
  validateFileDisposition(inspection.backup, "inspection.backup");
  if (record(inspection.primary, "inspection.primary").status !== "VALID") blocked("inspection.primary must remain VALID after asset detach.");
  const backupStatus = record(inspection.backup, "inspection.backup").status;
  if (backupStatus !== "VALID" && backupStatus !== "MISSING") blocked("inspection.backup must remain VALID or MISSING after asset detach.");
  const pending = array(inspection.pendingArtifacts, "inspection.pendingArtifacts");
  pending.forEach((artifact, index) => {
    const item = record(artifact, `inspection.pendingArtifacts[${index}]`);
    knownKeys(item, ["artifactKind", "relativePath", "retry", "status"], ["blockerCode", "blockerMessage", "byteSha256", "stagedContentSha256"], `inspection.pendingArtifacts[${index}]`);
    text(item.artifactKind, `inspection.pendingArtifacts[${index}].artifactKind`);
    relativePath(item.relativePath, `inspection.pendingArtifacts[${index}].relativePath`);
    exact(item.status, "PRESENT_VALID", `inspection.pendingArtifacts[${index}].status`);
    if (item.blockerCode !== undefined) blocked(`inspection.pendingArtifacts[${index}] must not retain a blocker.`);
  });
  if (array(inspection.brokenSceneReferences, "inspection.brokenSceneReferences").length !== 0) blocked("inspection must not retain a broken Scene reference after asset detach.");
  const registered = array(inspection.registeredAssets, "inspection.registeredAssets").map((entry, index) => validateRegisteredAsset(entry, `inspection.registeredAssets[${index}]`));
  if (new Set(registered.map((asset) => asset.assetId)).size !== registered.length) blocked("inspection.registeredAssets must not contain duplicate asset identities.");
  if (registered.some((asset) => asset.assetId === preview.assetId || asset.relativePath === preview.targetRelativePath)) blocked("inspection must prove the detached asset and target path remain absent.");
  trueValue(inspection.noWrite, "inspection.noWrite");
  trueValue(inspection.noFoundryWrite, "inspection.noFoundryWrite");
  return inspection as unknown as ProjectRecoveryInspectionReceipt;
}

function validateSession(value: unknown, preview: AssetDetachPreviewReceipt, receipt: MissingAssetDetachReceipt): { session: DesktopProjectProposalSession; history: ProposalBatchHistory } {
  const session = record(value, "asset-detach proposal session");
  exactKeys(session, ["batch", "history", "projectId", "schemaVersion"], "asset-detach proposal session");
  exact(session.schemaVersion, "0.1.0", "session.schemaVersion");
  exact(session.projectId, preview.projectId, "session.projectId");
  const batch = record(session.batch, "session.batch");
  exactKeys(batch, ["base", "batchId", "batchSha256", "commands", "createdAt", "previousBatchSha256", "producer", "reviewAuthority", "revision", "risk", "schemaVersion", "targetAuthority"], "session.batch");
  exact(batch.schemaVersion, "0.1.0", "session.batch.schemaVersion");
  const batchId = text(batch.batchId, "session.batch.batchId", stableIdPattern);
  if (integer(batch.revision, "session.batch.revision") !== 0) blocked("session.batch.revision must remain the initial approved detach batch revision.");
  if (batch.previousBatchSha256 !== null) blocked("session.batch.previousBatchSha256 must be null for a new detach proposal.");
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
  exact(producer.sourceId, "project.asset.detach", "session.batch.producer.sourceId");
  if (producer.provider !== null) blocked("session.batch.producer.provider must be null.");
  const reviewAuthority = record(batch.reviewAuthority, "session.batch.reviewAuthority");
  exactKeys(reviewAuthority, ["domain", "requiredRole"], "session.batch.reviewAuthority");
  exact(reviewAuthority.domain, "human-review", "session.batch.reviewAuthority.domain");
  exact(reviewAuthority.requiredRole, "reviewer", "session.batch.reviewAuthority.requiredRole");
  const targetAuthority = record(batch.targetAuthority, "session.batch.targetAuthority");
  exactKeys(targetAuthority, ["domain", "requiredActiveGm"], "session.batch.targetAuthority");
  exact(targetAuthority.domain, "local-project", "session.batch.targetAuthority.domain");
  if (targetAuthority.requiredActiveGm !== false) blocked("session.batch.targetAuthority.requiredActiveGm must be false.");
  exact(batch.risk, "high", "session.batch.risk");
  const commands = array(batch.commands, "session.batch.commands");
  if (commands.length !== 1) blocked("session.batch.commands must contain exactly one command.");
  const command = record(commands[0], "session.batch.commands[0]");
  exactKeys(command, ["commandId", "dependsOn", "kind", "payload"], "session.batch.commands[0]");
  text(command.commandId, "session.batch.commands[0].commandId", stableIdPattern);
  if (array(command.dependsOn, "session.batch.commands[0].dependsOn").length !== 0) blocked("session.batch.commands[0].dependsOn must be empty.");
  exact(command.kind, "project.asset.detach", "session.batch.commands[0].kind");
  const payload = record(command.payload, "session.batch.commands[0].payload");
  exactKeys(payload, ["affectedSceneIds", "assetId", "assetSha256", "assetTreeSha256", "contentSha256", "generation", "nextGeneration", "operation", "previewSha256", "projectId", "resultingContentSha256"], "session.payload");
  exact(payload.operation, "project.asset.detach", "session.payload.operation");
  exact(payload.projectId, preview.projectId, "session.payload.projectId");
  if (integer(payload.generation, "session.payload.generation") !== preview.generation || integer(payload.nextGeneration, "session.payload.nextGeneration") !== preview.nextGeneration) blocked("session payload generations do not match the preview.");
  exact(payload.contentSha256, preview.contentSha256, "session.payload.contentSha256");
  exact(payload.resultingContentSha256, preview.resultingContentSha256, "session.payload.resultingContentSha256");
  exact(payload.assetId, preview.assetId, "session.payload.assetId");
  exact(payload.assetSha256, preview.assetSha256, "session.payload.assetSha256");
  exact(payload.assetTreeSha256, preview.assetTreeSha256, "session.payload.assetTreeSha256");
  if (canonicalize(ids(payload.affectedSceneIds, "session.payload.affectedSceneIds")) !== canonicalize(preview.affectedScenes.map((scene) => scene.sceneId))) blocked("session payload Scene IDs do not match the preview.");
  exact(payload.previewSha256, preview.previewSha256, "session.payload.previewSha256");
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(session.history);
  } catch (error) {
    blocked(`session.history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (history.status !== "committed" || history.batchId !== batchId || history.receipts.length !== expectedTransitions.length || history.receipts.some((item, index) => item.transition !== expectedTransitions[index])) blocked("session.history is not the exact preview-to-commit lifecycle.");
  for (const [index, item] of history.receipts.entries()) if (item.batchId !== batchId || item.batchRevision !== batch.revision || item.batchSha256 !== batch.batchSha256) blocked(`session.history.receipts[${index}] is not bound to the exact approved detach batch.`);
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== preview.projectId || commit.reread.revision !== receipt.generation || commit.reread.sha256 !== receipt.contentSha256) blocked("session.history does not retain the matched authoritative detach reread.");
  return { session: session as unknown as DesktopProjectProposalSession, history };
}

export function bridgeProjectAssetDetachExecutionToTerminalHistory(input: unknown): ProjectAssetDetachTerminalHistoryReceipt {
  const root = record(input, "asset-detach terminal-history input");
  exactKeys(root, ["inspection", "preview", "receipt", "session"], "asset-detach terminal-history input");
  const preview = validatePreview(root.preview);
  const receipt = validateReceipt(root.receipt, preview);
  const authoritativeRecoveryReread = validateInspection(root.inspection, preview, receipt);
  const session = validateSession(root.session, preview, receipt);
  return {
    schemaVersion: PROJECT_ASSET_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.asset.detach",
    commandKind: "project.asset.detach",
    projectId: preview.projectId,
    batchId: session.session.batch.batchId,
    previousGeneration: receipt.previousGeneration,
    generation: receipt.generation,
    previousContentSha256: receipt.previousContentSha256,
    contentSha256: receipt.contentSha256,
    assetId: receipt.assetId,
    assetSha256: receipt.assetSha256,
    targetRelativePath: receipt.targetRelativePath,
    affectedScenes: receipt.affectedScenes,
    scenes: receipt.scenes,
    previewSha256: receipt.previewSha256,
    history: session.history,
    historyStatus: "committed",
    historyTransitions: session.history.receipts.map((item) => item.transition),
    authoritativeRecoveryReread,
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
    assetBytesWrite: false,
    projectContentWrite: true,
    projectPersistenceWrite: true,
    descriptorRemoved: true,
    assetTreeUnchanged: true,
    workspaceUnchanged: true,
    foreignStateUnchanged: true,
    backupPreservesPriorEnvelope: true,
    targetRemainsAbsent: true,
    directoryEntrySync: true,
    noProjectWrite: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectAssetDetachTerminalHistoryReceipt {
  const receipt = record(input, "asset-detach terminal-history receipt");
  exactKeys(receipt, expectedTerminalReceiptKeys, "asset-detach terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_ASSET_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.asset.detach", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.asset.detach", "terminal-history receipt.commandKind");
  const projectId = text(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = text(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const previousGeneration = integer(receipt.previousGeneration, "terminal-history receipt.previousGeneration");
  const generation = integer(receipt.generation, "terminal-history receipt.generation");
  const previousContentSha256 = text(receipt.previousContentSha256, "terminal-history receipt.previousContentSha256", sha256Pattern);
  const contentSha256 = text(receipt.contentSha256, "terminal-history receipt.contentSha256", sha256Pattern);
  const assetId = text(receipt.assetId, "terminal-history receipt.assetId", stableIdPattern);
  const assetSha256 = text(receipt.assetSha256, "terminal-history receipt.assetSha256", sha256Pattern);
  relativePath(receipt.targetRelativePath, "terminal-history receipt.targetRelativePath");
  text(receipt.previewSha256, "terminal-history receipt.previewSha256", sha256Pattern);
  exact(receipt.historyStatus, "committed", "terminal-history receipt.historyStatus");
  exact(receipt.targetAuthority, "local-project", "terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "terminal-history receipt.applyAuthority");
  for (const key of ["noGenericExecutor", "bridgeOnly", "noExecutionAuthority", "authoritativeReread", "noProjectMutation", "foreignStatePreserved", "projectContentWrite", "projectPersistenceWrite", "descriptorRemoved", "assetTreeUnchanged", "workspaceUnchanged", "foreignStateUnchanged", "backupPreservesPriorEnvelope", "targetRemainsAbsent", "directoryEntrySync", "noProjectWrite", "noFoundryWrite"] as const) trueValue(receipt[key], `terminal-history receipt.${key}`);
  falseValue(receipt.assetBytesWrite, "terminal-history receipt.assetBytesWrite");
  exact(receipt.execution, "not-implemented", "terminal-history receipt.execution");
  falseValue(receipt.readyClaim, "terminal-history receipt.readyClaim");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");
  const preview = validatePreview(receipt.sourcePreview);
  const source = validateReceipt(receipt.sourceReceipt, preview);
  if (source.projectId !== projectId || source.previousGeneration !== previousGeneration || source.generation !== generation || source.previousContentSha256 !== previousContentSha256 || source.contentSha256 !== contentSha256 || source.assetId !== assetId || source.assetSha256 !== assetSha256 || source.targetRelativePath !== receipt.targetRelativePath || source.previewSha256 !== receipt.previewSha256) blocked("terminal-history receipt is not bound to the exact detach source identity.");
  if (canonicalize(sceneReceipts(receipt.affectedScenes, "terminal-history receipt.affectedScenes")) !== canonicalize(sceneReceipts(source.affectedScenes, "source.affectedScenes")) || canonicalize(sceneReceipts(receipt.scenes, "terminal-history receipt.scenes")) !== canonicalize(sceneReceipts(source.scenes, "source.scenes"))) blocked("terminal-history receipt Scene evidence does not match the exact detach source.");
  const authoritative = validateInspection(receipt.authoritativeRecoveryReread, preview, source);
  const session = validateSession(receipt.session, preview, source);
  if (session.session.batch.batchId !== batchId || canonicalize(session.history) !== canonicalize(receipt.history)) blocked("terminal-history receipt does not retain the exact committed session history.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTransitions.length || transitions.some((item, index) => item !== expectedTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  if (canonicalize(authoritative) !== canonicalize(receipt.authoritativeRecoveryReread)) blocked("terminal-history receipt recovery reread changed during validation.");
  return receipt as unknown as ProjectAssetDetachTerminalHistoryReceipt;
}

export const projectAssetDetachTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectAssetDetachTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAssetDetachTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectAssetDetachTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAssetDetachTerminalHistoryValidationError
        ? error
        : new ProjectAssetDetachTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
