import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type { DesktopProjectProposalSession } from "./project-proposal-session";
import type {
  BrokenReferenceDetachPreviewReceipt,
  BrokenReferenceDetachReceipt,
  ProjectRecoveryInspectionReceipt,
} from "./project-store";
import { isBrokenReferenceUiTerminalInspection } from "./project-store";

export const PROJECT_BROKEN_REFERENCE_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;
const expectedPreviewRequiredKeys = [
  "affectedScene", "assetDescriptorPreserved", "assetId", "assetTreeSha256", "blockerCode", "contentSha256", "generation",
  "noFoundryWrite", "noWrite", "nextGeneration", "operation", "primaryByteSha256", "projectId", "protectedStateSha256",
  "previewSha256", "requiresApproval", "resultingAssetCollectionSha256", "resultingAssetCount", "resultingContentSha256",
  "resultingScenes", "sceneId", "status",
] as const;
const expectedPreviewOptionalKeys = ["assetSha256", "backupByteSha256"] as const;
const expectedReceiptKeys = [
  "assetDescriptorPreserved", "assetId", "assetTreeUnchanged", "authoritativeInspection", "backupPreservesPriorEnvelope",
  "blockerCode", "contentSha256", "directoryEntrySync", "foreignStateUnchanged", "generation", "noFoundryWrite", "operation",
  "previousContentSha256", "previousGeneration", "previewSha256", "projectId", "residualBrokenReferenceCount", "sceneId", "status",
  "targetBindingAbsent", "unrelatedReferencesUnchanged", "workspaceUnchanged",
] as const;
const expectedTerminalReceiptKeys = [
  "applyAuthority", "assetBytesWrite", "assetDescriptorPreserved", "assetId", "assetSha256", "assetTreeUnchanged", "authority",
  "authoritativeInspection", "authoritativeRecoveryReread", "authoritativeReread", "backupPreservesPriorEnvelope", "batchId",
  "blocker", "blockerCode", "bridgeOnly", "commandKind", "contentSha256", "directoryEntrySync", "disposition", "execution",
  "foreignStatePreserved", "foreignStateUnchanged", "generation", "history", "historyStatus", "historyTransitions",
  "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noProjectWrite", "operation", "outcomeUnknown",
  "previewSha256", "previousContentSha256", "previousGeneration", "projectContentWrite", "projectId", "projectPersistenceWrite",
  "readyClaim", "residualBrokenReferenceCount", "sceneId", "schemaVersion", "scenes", "session", "sourcePreview", "sourceReceipt",
  "status", "targetAuthority", "targetBindingAbsent", "unrelatedReferencesUnchanged", "workspaceUnchanged", "authoritativeRereadRequired",
  "retryAllowed",
] as const;

type BrokenReferencePreview = BrokenReferenceDetachPreviewReceipt;

export type ProjectBrokenReferenceDetachTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_BROKEN_REFERENCE_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.broken-reference.detach";
  commandKind: "project.broken-reference.detach";
  projectId: string;
  batchId: string;
  previousGeneration: number;
  generation: number;
  previousContentSha256: string;
  contentSha256: string;
  sceneId: string;
  assetId: string;
  assetSha256?: string;
  blockerCode: "BACKGROUND_ASSET_MISSING" | "BACKGROUND_ASSET_ROLE_MISMATCH";
  assetDescriptorPreserved: boolean;
  authoritativeInspection: true;
  residualBrokenReferenceCount: 0;
  targetBindingAbsent: true;
  unrelatedReferencesUnchanged: true;
  previewSha256: string;
  scenes: readonly { sceneId: string; sceneSha256: string }[];
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRecoveryReread: ProjectRecoveryInspectionReceipt;
  sourcePreview: BrokenReferencePreview;
  sourceReceipt: BrokenReferenceDetachReceipt;
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
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  backupPreservesPriorEnvelope: true;
  directoryEntrySync: true;
  noProjectWrite: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectBrokenReferenceDetachTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectBrokenReferenceDetachTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectBrokenReferenceDetachTerminalHistoryValidationError(message);
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

function sceneReceipts(value: unknown, label: string): readonly { sceneId: string; sceneSha256: string }[] {
  return array(value, label).map((entry, index) => {
    const scene = record(entry, `${label}[${index}]`);
    exactKeys(scene, ["sceneId", "sceneSha256"], `${label}[${index}]`);
    return { sceneId: text(scene.sceneId, `${label}[${index}].sceneId`, stableIdPattern), sceneSha256: text(scene.sceneSha256, `${label}[${index}].sceneSha256`, sha256Pattern) };
  });
}

function validatePreview(value: unknown): BrokenReferencePreview {
  const preview = record(value, "broken-reference detach preview");
  knownKeys(preview, expectedPreviewRequiredKeys, expectedPreviewOptionalKeys, "broken-reference detach preview");
  exact(preview.operation, "dicebox.project.broken-reference.detach.preview", "preview.operation");
  exact(preview.status, "PREVIEW", "preview.status");
  text(preview.projectId, "preview.projectId", stableIdPattern);
  const generation = integer(preview.generation, "preview.generation");
  text(preview.contentSha256, "preview.contentSha256", sha256Pattern);
  const sceneId = text(preview.sceneId, "preview.sceneId", stableIdPattern);
  const assetId = text(preview.assetId, "preview.assetId", stableIdPattern);
  const blockerCode = preview.blockerCode;
  if (blockerCode !== "BACKGROUND_ASSET_MISSING" && blockerCode !== "BACKGROUND_ASSET_ROLE_MISMATCH") blocked("preview.blockerCode is unsupported.");
  if (typeof preview.assetDescriptorPreserved !== "boolean") blocked("preview.assetDescriptorPreserved must be boolean.");
  if (preview.assetSha256 !== undefined) text(preview.assetSha256, "preview.assetSha256", sha256Pattern);
  exact(preview.migrationStatus ?? "current", "current", "preview.migrationStatus");
  const affectedScene = sceneReceipts([preview.affectedScene], "preview.affectedScene")[0]!;
  exact(affectedScene.sceneId, sceneId, "preview.affectedScene.sceneId");
  const resultingScenes = sceneReceipts(preview.resultingScenes, "preview.resultingScenes");
  if (integer(preview.nextGeneration, "preview.nextGeneration") !== generation + 1) blocked("preview.nextGeneration must advance exactly one generation.");
  if (integer(preview.resultingAssetCount, "preview.resultingAssetCount") < 0) blocked("preview.resultingAssetCount must be non-negative.");
  for (const key of ["assetTreeSha256", "contentSha256", "primaryByteSha256", "protectedStateSha256", "previewSha256", "resultingAssetCollectionSha256", "resultingContentSha256"] as const) text(preview[key], `preview.${key}`, sha256Pattern);
  if (preview.backupByteSha256 !== undefined) text(preview.backupByteSha256, "preview.backupByteSha256", sha256Pattern);
  trueValue(preview.requiresApproval, "preview.requiresApproval");
  trueValue(preview.noWrite, "preview.noWrite");
  trueValue(preview.noFoundryWrite, "preview.noFoundryWrite");
  return { ...preview, affectedScene, resultingScenes } as unknown as BrokenReferencePreview;
}

function validateReceipt(value: unknown, preview: BrokenReferencePreview): BrokenReferenceDetachReceipt {
  const receipt = record(value, "broken-reference detach receipt");
  exactKeys(receipt, expectedReceiptKeys, "broken-reference detach receipt");
  exact(receipt.operation, "dicebox.project.broken-reference.detach", "receipt.operation");
  exact(receipt.status, "PASS", "receipt.status");
  exact(receipt.projectId, preview.projectId, "receipt.projectId");
  if (integer(receipt.previousGeneration, "receipt.previousGeneration") !== preview.generation) blocked("receipt.previousGeneration must match preview.generation.");
  if (integer(receipt.generation, "receipt.generation") !== preview.nextGeneration) blocked("receipt.generation must match preview.nextGeneration.");
  if (text(receipt.previousContentSha256, "receipt.previousContentSha256", sha256Pattern) !== preview.contentSha256) blocked("receipt.previousContentSha256 must match preview.contentSha256.");
  if (text(receipt.contentSha256, "receipt.contentSha256", sha256Pattern) !== preview.resultingContentSha256) blocked("receipt.contentSha256 must match preview.resultingContentSha256.");
  exact(receipt.sceneId, preview.sceneId, "receipt.sceneId");
  exact(receipt.assetId, preview.assetId, "receipt.assetId");
  exact(receipt.blockerCode, preview.blockerCode, "receipt.blockerCode");
  if (receipt.assetDescriptorPreserved !== preview.assetDescriptorPreserved) blocked("receipt.assetDescriptorPreserved must match the preview.");
  if (integer(receipt.residualBrokenReferenceCount, "receipt.residualBrokenReferenceCount") !== 0) blocked("receipt.residualBrokenReferenceCount must be zero for the selected primary reference.");
  for (const key of ["assetTreeUnchanged", "workspaceUnchanged", "foreignStateUnchanged", "backupPreservesPriorEnvelope", "targetBindingAbsent", "unrelatedReferencesUnchanged", "authoritativeInspection", "directoryEntrySync", "noFoundryWrite"] as const) trueValue(receipt[key], `receipt.${key}`);
  if (text(receipt.previewSha256, "receipt.previewSha256", sha256Pattern) !== preview.previewSha256) blocked("receipt.previewSha256 does not match the preview.");
  return receipt as unknown as BrokenReferenceDetachReceipt;
}

function validateFileDisposition(value: unknown, label: string): void {
  const disposition = record(value, label);
  knownKeys(disposition, ["relativePath", "status"], ["blockerCode", "blockerMessage", "byteSha256", "migrationStatus", "retry", "sourceSchemaVersion"], label);
  text(disposition.relativePath, `${label}.relativePath`);
  text(disposition.status, `${label}.status`);
  if (disposition.byteSha256 !== undefined) text(disposition.byteSha256, `${label}.byteSha256`, sha256Pattern);
  for (const key of ["blockerCode", "blockerMessage", "migrationStatus", "retry", "sourceSchemaVersion"] as const) if (disposition[key] !== undefined) text(disposition[key], `${label}.${key}`);
}

function validateRegisteredAsset(value: unknown, label: string): Record<string, unknown> {
  const asset = record(value, label);
  knownKeys(asset, ["affectedSceneIds", "assetId", "byteLength", "disposition", "mediaType", "relativePath", "restoreEligible", "role", "sha256"], ["blockerCode", "blockerMessage", "retry"], label);
  text(asset.assetId, `${label}.assetId`, stableIdPattern);
  text(asset.role, `${label}.role`);
  text(asset.sha256, `${label}.sha256`, sha256Pattern);
  text(asset.mediaType, `${label}.mediaType`);
  integer(asset.byteLength, `${label}.byteLength`);
  text(asset.relativePath, `${label}.relativePath`);
  ids(asset.affectedSceneIds, `${label}.affectedSceneIds`);
  text(asset.disposition, `${label}.disposition`);
  if (asset.blockerCode !== undefined) text(asset.blockerCode, `${label}.blockerCode`);
  if (asset.blockerMessage !== undefined) text(asset.blockerMessage, `${label}.blockerMessage`);
  if (asset.retry !== undefined) text(asset.retry, `${label}.retry`);
  if (typeof asset.restoreEligible !== "boolean") blocked(`${label}.restoreEligible must be boolean.`);
  return asset;
}

function validateInspection(value: unknown, preview: BrokenReferencePreview, receipt: BrokenReferenceDetachReceipt): ProjectRecoveryInspectionReceipt {
  const inspection = record(value, "broken-reference authoritative recovery reread");
  knownKeys(inspection, ["backup", "brokenSceneReferences", "contentSha256", "generation", "noFoundryWrite", "noWrite", "operation", "pendingArtifacts", "primary", "projectId", "registeredAssets", "restoreEligible", "retry", "scenes", "status"], ["activeSceneId", "blockerCode", "blockerMessage", "migrationStatus", "recoveredFrom"], "broken-reference authoritative recovery reread");
  exact(inspection.operation, "dicebox.project.recovery.inspect", "inspection.operation");
  exact(inspection.projectId, preview.projectId, "inspection.projectId");
  if (integer(inspection.generation, "inspection.generation") !== receipt.generation || text(inspection.contentSha256, "inspection.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("inspection identity does not match the broken-reference receipt.");
  if (inspection.activeSceneId !== undefined) text(inspection.activeSceneId, "inspection.activeSceneId", stableIdPattern);
  if (inspection.blockerCode !== undefined) text(inspection.blockerCode, "inspection.blockerCode");
  if (inspection.blockerMessage !== undefined) text(inspection.blockerMessage, "inspection.blockerMessage");
  text(inspection.status, "inspection.status");
  text(inspection.retry, "inspection.retry");
  if (typeof inspection.restoreEligible !== "boolean") blocked("inspection.restoreEligible must be boolean.");
  if (canonicalize(sceneReceipts(inspection.scenes, "inspection.scenes")) !== canonicalize(preview.resultingScenes)) blocked("inspection.scenes does not match preview.resultingScenes.");
  validateFileDisposition(inspection.primary, "inspection.primary");
  validateFileDisposition(inspection.backup, "inspection.backup");
  if (!["VALID", "MISSING"].includes(record(inspection.primary, "inspection.primary").status as string)) blocked("inspection.primary must remain VALID or MISSING.");
  if (!["VALID", "MISSING"].includes(record(inspection.backup, "inspection.backup").status as string)) blocked("inspection.backup must remain VALID or MISSING.");
  const pending = array(inspection.pendingArtifacts, "inspection.pendingArtifacts");
  pending.forEach((artifact, index) => {
    const item = record(artifact, `inspection.pendingArtifacts[${index}]`);
    knownKeys(item, ["artifactKind", "relativePath", "retry", "status"], ["blockerCode", "blockerMessage", "byteSha256", "stagedContentSha256"], `inspection.pendingArtifacts[${index}]`);
    text(item.artifactKind, `inspection.pendingArtifacts[${index}].artifactKind`);
    text(item.relativePath, `inspection.pendingArtifacts[${index}].relativePath`);
    exact(item.status, "PRESENT_VALID", `inspection.pendingArtifacts[${index}].status`);
    if (item.blockerCode !== undefined) blocked(`inspection.pendingArtifacts[${index}] must not retain a blocker.`);
  });
  const registered = array(inspection.registeredAssets, "inspection.registeredAssets").map((entry, index) => validateRegisteredAsset(entry, `inspection.registeredAssets[${index}]`));
  if (new Set(registered.map((asset) => asset.assetId)).size !== registered.length) blocked("inspection.registeredAssets must not contain duplicate asset identities.");
  const selected = registered.find((asset) => asset.assetId === preview.assetId);
  if (preview.assetDescriptorPreserved) {
    if (!selected || selected.disposition !== "PRESENT_VALID" || selected.blockerCode !== undefined) blocked("inspection must preserve the selected asset descriptor after broken-reference detach.");
  } else if (selected) {
    blocked("inspection must not retain the selected descriptor when the preview removes it.");
  }
  trueValue(inspection.noWrite, "inspection.noWrite");
  trueValue(inspection.noFoundryWrite, "inspection.noFoundryWrite");
  let terminal = false;
  try {
    terminal = isBrokenReferenceUiTerminalInspection(inspection as unknown as ProjectRecoveryInspectionReceipt, preview.projectId);
  } catch {
    terminal = false;
  }
  if (!terminal) blocked("inspection does not prove the selected primary reference is detached while foreign/backup diagnostics remain governed.");
  return inspection as unknown as ProjectRecoveryInspectionReceipt;
}

function validateSession(value: unknown, preview: BrokenReferencePreview, receipt: BrokenReferenceDetachReceipt): { session: DesktopProjectProposalSession; history: ProposalBatchHistory } {
  const session = record(value, "broken-reference proposal session");
  exactKeys(session, ["batch", "history", "projectId", "schemaVersion"], "broken-reference proposal session");
  exact(session.schemaVersion, "0.1.0", "session.schemaVersion");
  exact(session.projectId, preview.projectId, "session.projectId");
  const batch = record(session.batch, "session.batch");
  exactKeys(batch, ["base", "batchId", "batchSha256", "commands", "createdAt", "previousBatchSha256", "producer", "reviewAuthority", "revision", "risk", "schemaVersion", "targetAuthority"], "session.batch");
  exact(batch.schemaVersion, "0.1.0", "session.batch.schemaVersion");
  const batchId = text(batch.batchId, "session.batch.batchId", stableIdPattern);
  if (integer(batch.revision, "session.batch.revision") !== 0) blocked("session.batch.revision must remain the initial approved broken-reference batch revision.");
  if (batch.previousBatchSha256 !== null) blocked("session.batch.previousBatchSha256 must be null for a new broken-reference proposal.");
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
  exact(producer.sourceId, "project.broken-reference.detach", "session.batch.producer.sourceId");
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
  exact(command.kind, "project.broken-reference.detach", "session.batch.commands[0].kind");
  const payload = record(command.payload, "session.batch.commands[0].payload");
  exactKeys(payload, ["assetDescriptorPreserved", "assetId", "assetTreeSha256", "blockerCode", "contentSha256", "generation", "nextGeneration", "operation", "previewSha256", "projectId", "resultingContentSha256", "sceneId", "sceneSha256"], "session.payload");
  exact(payload.operation, "project.broken-reference.detach", "session.payload.operation");
  exact(payload.projectId, preview.projectId, "session.payload.projectId");
  if (integer(payload.generation, "session.payload.generation") !== preview.generation || integer(payload.nextGeneration, "session.payload.nextGeneration") !== preview.nextGeneration) blocked("session payload generations do not match the preview.");
  exact(payload.contentSha256, preview.contentSha256, "session.payload.contentSha256");
  exact(payload.resultingContentSha256, preview.resultingContentSha256, "session.payload.resultingContentSha256");
  exact(payload.sceneId, preview.sceneId, "session.payload.sceneId");
  exact(payload.sceneSha256, preview.affectedScene.sceneSha256, "session.payload.sceneSha256");
  exact(payload.assetId, preview.assetId, "session.payload.assetId");
  exact(payload.blockerCode, preview.blockerCode, "session.payload.blockerCode");
  if (payload.assetDescriptorPreserved !== preview.assetDescriptorPreserved) blocked("session.payload.assetDescriptorPreserved must match the preview.");
  exact(payload.assetTreeSha256, preview.assetTreeSha256, "session.payload.assetTreeSha256");
  exact(payload.previewSha256, preview.previewSha256, "session.payload.previewSha256");
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(session.history);
  } catch (error) {
    blocked(`session.history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (history.status !== "committed" || history.batchId !== batchId || history.receipts.length !== expectedTransitions.length || history.receipts.some((item, index) => item.transition !== expectedTransitions[index])) blocked("session.history is not the exact preview-to-commit lifecycle.");
  for (const [index, item] of history.receipts.entries()) if (item.batchId !== batchId || item.batchRevision !== batch.revision || item.batchSha256 !== batch.batchSha256) blocked(`session.history.receipts[${index}] is not bound to the exact approved broken-reference batch.`);
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== preview.projectId || commit.reread.revision !== receipt.generation || commit.reread.sha256 !== receipt.contentSha256) blocked("session.history does not retain the matched authoritative broken-reference reread.");
  return { session: session as unknown as DesktopProjectProposalSession, history };
}

export function bridgeProjectBrokenReferenceDetachExecutionToTerminalHistory(input: unknown): ProjectBrokenReferenceDetachTerminalHistoryReceipt {
  const root = record(input, "broken-reference terminal-history input");
  exactKeys(root, ["inspection", "preview", "receipt", "session"], "broken-reference terminal-history input");
  const preview = validatePreview(root.preview);
  const receipt = validateReceipt(root.receipt, preview);
  const authoritativeRecoveryReread = validateInspection(root.inspection, preview, receipt);
  const session = validateSession(root.session, preview, receipt);
  return {
    schemaVersion: PROJECT_BROKEN_REFERENCE_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.broken-reference.detach",
    commandKind: "project.broken-reference.detach",
    projectId: preview.projectId,
    batchId: session.session.batch.batchId,
    previousGeneration: receipt.previousGeneration,
    generation: receipt.generation,
    previousContentSha256: receipt.previousContentSha256,
    contentSha256: receipt.contentSha256,
    sceneId: receipt.sceneId,
    assetId: receipt.assetId,
    ...(preview.assetSha256 === undefined ? {} : { assetSha256: preview.assetSha256 }),
    blockerCode: receipt.blockerCode,
    assetDescriptorPreserved: receipt.assetDescriptorPreserved,
    authoritativeInspection: true,
    residualBrokenReferenceCount: 0,
    targetBindingAbsent: true,
    unrelatedReferencesUnchanged: true,
    previewSha256: receipt.previewSha256,
    scenes: preview.resultingScenes,
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
    assetTreeUnchanged: true,
    workspaceUnchanged: true,
    foreignStateUnchanged: true,
    backupPreservesPriorEnvelope: true,
    directoryEntrySync: true,
    noProjectWrite: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectBrokenReferenceDetachTerminalHistoryReceipt {
  const receipt = record(input, "broken-reference terminal-history receipt");
  exactKeys(receipt, expectedTerminalReceiptKeys, "broken-reference terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_BROKEN_REFERENCE_DETACH_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.broken-reference.detach", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.broken-reference.detach", "terminal-history receipt.commandKind");
  const projectId = text(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = text(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  const previousGeneration = integer(receipt.previousGeneration, "terminal-history receipt.previousGeneration");
  const generation = integer(receipt.generation, "terminal-history receipt.generation");
  const previousContentSha256 = text(receipt.previousContentSha256, "terminal-history receipt.previousContentSha256", sha256Pattern);
  const contentSha256 = text(receipt.contentSha256, "terminal-history receipt.contentSha256", sha256Pattern);
  const sceneId = text(receipt.sceneId, "terminal-history receipt.sceneId", stableIdPattern);
  const assetId = text(receipt.assetId, "terminal-history receipt.assetId", stableIdPattern);
  if (receipt.assetSha256 !== undefined) text(receipt.assetSha256, "terminal-history receipt.assetSha256", sha256Pattern);
  const blockerCode = receipt.blockerCode;
  if (blockerCode !== "BACKGROUND_ASSET_MISSING" && blockerCode !== "BACKGROUND_ASSET_ROLE_MISMATCH") blocked("terminal-history receipt.blockerCode is unsupported.");
  if (typeof receipt.assetDescriptorPreserved !== "boolean") blocked("terminal-history receipt.assetDescriptorPreserved must be boolean.");
  if (integer(receipt.residualBrokenReferenceCount, "terminal-history receipt.residualBrokenReferenceCount") !== 0) blocked("terminal-history receipt.residualBrokenReferenceCount must be zero.");
  exact(receipt.targetAuthority, "local-project", "terminal-history receipt.targetAuthority");
  exact(receipt.applyAuthority, "operation-specific", "terminal-history receipt.applyAuthority");
  for (const key of ["noGenericExecutor", "bridgeOnly", "noExecutionAuthority", "authoritativeReread", "authoritativeInspection", "noProjectMutation", "foreignStatePreserved", "projectContentWrite", "projectPersistenceWrite", "assetTreeUnchanged", "workspaceUnchanged", "foreignStateUnchanged", "backupPreservesPriorEnvelope", "directoryEntrySync", "noProjectWrite", "noFoundryWrite", "targetBindingAbsent", "unrelatedReferencesUnchanged"] as const) trueValue(receipt[key], `terminal-history receipt.${key}`);
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
  if (source.projectId !== projectId || source.previousGeneration !== previousGeneration || source.generation !== generation || source.previousContentSha256 !== previousContentSha256 || source.contentSha256 !== contentSha256 || source.sceneId !== sceneId || source.assetId !== assetId || source.blockerCode !== blockerCode || source.assetDescriptorPreserved !== receipt.assetDescriptorPreserved || source.previewSha256 !== receipt.previewSha256) blocked("terminal-history receipt is not bound to the exact broken-reference source identity.");
  if (receipt.assetSha256 !== undefined && preview.assetSha256 !== receipt.assetSha256) blocked("terminal-history receipt asset hash does not match the preview.");
  if (canonicalize(sceneReceipts(receipt.scenes, "terminal-history receipt.scenes")) !== canonicalize(preview.resultingScenes)) blocked("terminal-history receipt Scene evidence does not match the exact broken-reference preview.");
  const authoritative = validateInspection(receipt.authoritativeRecoveryReread, preview, source);
  const session = validateSession(receipt.session, preview, source);
  if (session.session.batch.batchId !== batchId || canonicalize(session.history) !== canonicalize(receipt.history)) blocked("terminal-history receipt does not retain the exact committed session history.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTransitions.length || transitions.some((item, index) => item !== expectedTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  if (canonicalize(authoritative) !== canonicalize(receipt.authoritativeRecoveryReread)) blocked("terminal-history receipt recovery reread changed during validation.");
  return receipt as unknown as ProjectBrokenReferenceDetachTerminalHistoryReceipt;
}

export const projectBrokenReferenceDetachTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectBrokenReferenceDetachTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectBrokenReferenceDetachTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectBrokenReferenceDetachTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectBrokenReferenceDetachTerminalHistoryValidationError
        ? error
        : new ProjectBrokenReferenceDetachTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
