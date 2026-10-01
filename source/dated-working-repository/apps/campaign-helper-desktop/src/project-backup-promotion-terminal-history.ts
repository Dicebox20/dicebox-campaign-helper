import { validateProposalBatchHistory, type ProposalBatchHistory } from "@dicebox/core";
import type { DesktopProjectProposalSession } from "./project-proposal-session";
import type {
  BackupRecoveryPromotionPreviewReceipt,
  BackupRecoveryPromotionReceipt,
  ProjectRecoveryInspectionReceipt,
} from "./project-store";

export const PROJECT_BACKUP_PROMOTION_TERMINAL_HISTORY_SCHEMA_VERSION = "0.1.0" as const;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const expectedTransitions = ["preview", "approve", "begin-apply", "commit-after-reread"] as const;

export type ProjectBackupPromotionTerminalHistoryReceipt = Readonly<{
  schemaVersion: typeof PROJECT_BACKUP_PROMOTION_TERMINAL_HISTORY_SCHEMA_VERSION;
  status: "committed";
  disposition: "terminal-committed";
  operation: "dicebox.project.recovery.backup-promote";
  commandKind: "project.recovery.backup-promote";
  projectId: string;
  batchId: string;
  generation: number;
  contentSha256: string;
  history: ProposalBatchHistory;
  historyStatus: "committed";
  historyTransitions: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  authoritativeRecoveryReread: ProjectRecoveryInspectionReceipt;
  sourcePreview: BackupRecoveryPromotionPreviewReceipt;
  sourceReceipt: BackupRecoveryPromotionReceipt;
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
  projectContentWrite: true;
  projectPersistenceWrite: true;
  primaryRestored: true;
  backupUnchanged: true;
  semanticStateUnchanged: true;
  assetTreeUnchanged: true;
  workspaceUnchanged: true;
  foreignStateUnchanged: true;
  noFoundryWrite: true;
  blocker: null;
  outcomeUnknown: false;
  authoritativeRereadRequired: false;
  retryAllowed: false;
}>;

export class ProjectBackupPromotionTerminalHistoryValidationError extends Error {
  readonly code = "TERMINAL_HISTORY_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectBackupPromotionTerminalHistoryValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectBackupPromotionTerminalHistoryValidationError(message);
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

function validatePreview(value: unknown): BackupRecoveryPromotionPreviewReceipt {
  const preview = record(value, "backup-promotion preview");
  exact(preview.operation, "dicebox.project.recovery.backup-promotion.preview", "preview.operation");
  exact(preview.status, "PREVIEW", "preview.status");
  text(preview.projectId, "preview.projectId", stableIdPattern);
  integer(preview.generation, "preview.generation");
  text(preview.contentSha256, "preview.contentSha256", sha256Pattern);
  text(preview.backupByteSha256, "preview.backupByteSha256", sha256Pattern);
  text(preview.protectedStateSha256, "preview.protectedStateSha256", sha256Pattern);
  text(preview.assetTreeSha256, "preview.assetTreeSha256", sha256Pattern);
  text(preview.previewSha256, "preview.previewSha256", sha256Pattern);
  trueValue(preview.requiresApproval, "preview.requiresApproval");
  trueValue(preview.noWrite, "preview.noWrite");
  trueValue(preview.noFoundryWrite, "preview.noFoundryWrite");
  const primary = record(preview.primary, "preview.primary");
  exact(primary.status, "MISSING", "preview.primary.status");
  const backup = record(preview.backup, "preview.backup");
  exact(backup.status, "VALID", "preview.backup.status");
  if (backup.byteSha256 !== undefined) text(backup.byteSha256, "preview.backup.byteSha256", sha256Pattern);
  return preview as unknown as BackupRecoveryPromotionPreviewReceipt;
}

function validateInspection(value: unknown, projectId: string, receipt: BackupRecoveryPromotionReceipt): ProjectRecoveryInspectionReceipt {
  const inspection = record(value, "backup-promotion authoritative recovery inspection");
  exact(inspection.operation, "dicebox.project.recovery.inspect", "inspection.operation");
  exact(inspection.status, "PASS", "inspection.status");
  exact(inspection.projectId, projectId, "inspection.projectId");
  if (integer(inspection.generation, "inspection.generation") !== receipt.generation) blocked("inspection.generation does not match the promotion receipt.");
  if (text(inspection.contentSha256, "inspection.contentSha256", sha256Pattern) !== receipt.contentSha256) blocked("inspection.contentSha256 does not match the promotion receipt.");
  trueValue(inspection.noWrite, "inspection.noWrite");
  trueValue(inspection.noFoundryWrite, "inspection.noFoundryWrite");
  const primary = record(inspection.primary, "inspection.primary");
  exact(primary.status, "VALID", "inspection.primary.status");
  const backup = record(inspection.backup, "inspection.backup");
  exact(backup.status, "VALID", "inspection.backup.status");
  const scenes = array(inspection.scenes, "inspection.scenes");
  if (scenes.length !== receipt.scenes.length || canonicalize(scenes) !== canonicalize(receipt.scenes)) blocked("inspection.scenes does not match the authoritative promotion receipt.");
  if (inspection.activeSceneId !== receipt.activeSceneId) blocked("inspection active Scene does not match the promotion receipt.");
  return inspection as unknown as ProjectRecoveryInspectionReceipt;
}

function validateSession(value: unknown, preview: BackupRecoveryPromotionPreviewReceipt, receipt: BackupRecoveryPromotionReceipt): Readonly<{ session: DesktopProjectProposalSession; history: ProposalBatchHistory }> {
  const session = record(value, "backup-promotion session");
  exact(session.projectId, preview.projectId, "session.projectId");
  const batch = record(session.batch, "session.batch");
  exact(batch.batchId, text(batch.batchId, "session.batch.batchId", stableIdPattern), "session.batch.batchId");
  const base = record(batch.base, "session.batch.base");
  exact(base.targetId, preview.projectId, "session.batch.base.targetId");
  if (integer(base.revision, "session.batch.base.revision") !== preview.generation) blocked("session base revision does not match the preview generation.");
  const producer = record(batch.producer, "session.batch.producer");
  exact(producer.kind, "project-store", "session.batch.producer.kind");
  exact(producer.sourceId, "project.recovery.backup-promote", "session.batch.producer.sourceId");
  if (producer.provider !== null) blocked("session.batch.producer.provider must be null.");
  const commands = array(batch.commands, "session.batch.commands");
  if (commands.length !== 1) blocked("session.batch.commands must contain exactly one command.");
  const command = record(commands[0], "session.batch.commands[0]");
  exact(command.kind, "project.recovery.backup-promote", "session.batch.commands[0].kind");
  const payload = record(command.payload, "session.batch.commands[0].payload");
  exact(payload.operation, "project.recovery.backup-promote", "session payload.operation");
  exact(payload.projectId, preview.projectId, "session payload.projectId");
  exact(payload.contentSha256, preview.contentSha256, "session payload.contentSha256");
  exact(payload.backupByteSha256, preview.backupByteSha256, "session payload.backupByteSha256");
  exact(payload.semanticStateSha256, preview.semanticStateSha256, "session payload.semanticStateSha256");
  exact(payload.assetTreeSha256, preview.assetTreeSha256, "session payload.assetTreeSha256");
  exact(payload.previewSha256, preview.previewSha256, "session payload.previewSha256");
  let history: ProposalBatchHistory;
  try {
    history = validateProposalBatchHistory(session.history);
  } catch (error) {
    blocked(`session.history is not structurally valid: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (history.status !== "committed" || history.batchId !== batch.batchId || history.receipts.length !== expectedTransitions.length || history.receipts.some((item, index) => item.transition !== expectedTransitions[index])) blocked("session.history is not the exact preview-to-commit lifecycle.");
  const commit = history.receipts[3];
  if (commit?.reread?.status !== "matched" || commit.reread.targetId !== preview.projectId || commit.reread.revision !== receipt.generation || commit.reread.sha256 !== receipt.contentSha256) blocked("session.history does not retain the matched authoritative promotion reread.");
  return { session: session as unknown as DesktopProjectProposalSession, history };
}

function validatePromotion(value: unknown, preview: BackupRecoveryPromotionPreviewReceipt): BackupRecoveryPromotionReceipt {
  const receipt = record(value, "backup-promotion receipt");
  exact(receipt.operation, "dicebox.project.recovery.backup-promotion", "receipt.operation");
  exact(receipt.status, "PASS", "receipt.status");
  exact(receipt.projectId, preview.projectId, "receipt.projectId");
  if (integer(receipt.generation, "receipt.generation") !== preview.generation) blocked("receipt.generation does not match the preview.");
  if (text(receipt.contentSha256, "receipt.contentSha256", sha256Pattern) !== preview.contentSha256) blocked("receipt.contentSha256 does not match the preview.");
  if (text(receipt.backupByteSha256, "receipt.backupByteSha256", sha256Pattern) !== preview.backupByteSha256) blocked("receipt.backupByteSha256 does not match the preview.");
  if (text(receipt.previewSha256, "receipt.previewSha256", sha256Pattern) !== preview.previewSha256) blocked("receipt.previewSha256 does not match the preview.");
  trueValue(receipt.primaryRestored, "receipt.primaryRestored");
  trueValue(receipt.backupUnchanged, "receipt.backupUnchanged");
  trueValue(receipt.semanticStateUnchanged, "receipt.semanticStateUnchanged");
  trueValue(receipt.assetTreeUnchanged, "receipt.assetTreeUnchanged");
  trueValue(receipt.workspaceUnchanged, "receipt.workspaceUnchanged");
  trueValue(receipt.foreignStateUnchanged, "receipt.foreignStateUnchanged");
  trueValue(receipt.authoritativeCurrentReread, "receipt.authoritativeCurrentReread");
  trueValue(receipt.directoryEntrySync, "receipt.directoryEntrySync");
  trueValue(receipt.noFoundryWrite, "receipt.noFoundryWrite");
  if (canonicalize(receipt.scenes) !== canonicalize(preview.scenes) || receipt.activeSceneId !== preview.activeSceneId || receipt.assetCount !== preview.assetCount) blocked("receipt semantic Scene/asset identity does not match the preview.");
  return receipt as unknown as BackupRecoveryPromotionReceipt;
}

export function bridgeProjectBackupPromotionExecutionToTerminalHistory(input: unknown): ProjectBackupPromotionTerminalHistoryReceipt {
  const root = record(input, "backup-promotion terminal-history input");
  const expectedKeys = ["inspection", "preview", "receipt", "session"];
  if (Object.keys(root).sort().join("|") !== expectedKeys.sort().join("|")) blocked("backup-promotion terminal-history input contains unknown or missing fields.");
  const preview = validatePreview(root.preview);
  const receipt = validatePromotion(root.receipt, preview);
  const authoritativeReread = validateInspection(root.inspection, preview.projectId, receipt);
  const session = validateSession(root.session, preview, receipt);
  return {
    schemaVersion: PROJECT_BACKUP_PROMOTION_TERMINAL_HISTORY_SCHEMA_VERSION,
    status: "committed",
    disposition: "terminal-committed",
    operation: "dicebox.project.recovery.backup-promote",
    commandKind: "project.recovery.backup-promote",
    projectId: preview.projectId,
    batchId: session.session.batch.batchId,
    generation: receipt.generation,
    contentSha256: receipt.contentSha256,
    history: session.history,
    historyStatus: "committed",
    historyTransitions: session.history.receipts.map((item) => item.transition),
    authoritativeRecoveryReread: authoritativeReread,
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
    projectContentWrite: true,
    projectPersistenceWrite: true,
    primaryRestored: true,
    backupUnchanged: true,
    semanticStateUnchanged: true,
    assetTreeUnchanged: true,
    workspaceUnchanged: true,
    foreignStateUnchanged: true,
    noFoundryWrite: true,
    blocker: null,
    outcomeUnknown: false,
    authoritativeRereadRequired: false,
    retryAllowed: false,
  };
}

function parseTerminalHistoryReceipt(input: unknown): ProjectBackupPromotionTerminalHistoryReceipt {
  const receipt = record(input, "backup-promotion terminal-history receipt");
  exact(receipt.schemaVersion, PROJECT_BACKUP_PROMOTION_TERMINAL_HISTORY_SCHEMA_VERSION, "terminal-history receipt.schemaVersion");
  exact(receipt.status, "committed", "terminal-history receipt.status");
  exact(receipt.disposition, "terminal-committed", "terminal-history receipt.disposition");
  exact(receipt.operation, "dicebox.project.recovery.backup-promote", "terminal-history receipt.operation");
  exact(receipt.commandKind, "project.recovery.backup-promote", "terminal-history receipt.commandKind");
  const projectId = text(receipt.projectId, "terminal-history receipt.projectId", stableIdPattern);
  const batchId = text(receipt.batchId, "terminal-history receipt.batchId", stableIdPattern);
  integer(receipt.generation, "terminal-history receipt.generation");
  text(receipt.contentSha256, "terminal-history receipt.contentSha256", sha256Pattern);
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
  trueValue(receipt.primaryRestored, "terminal-history receipt.primaryRestored");
  trueValue(receipt.backupUnchanged, "terminal-history receipt.backupUnchanged");
  trueValue(receipt.semanticStateUnchanged, "terminal-history receipt.semanticStateUnchanged");
  trueValue(receipt.assetTreeUnchanged, "terminal-history receipt.assetTreeUnchanged");
  trueValue(receipt.workspaceUnchanged, "terminal-history receipt.workspaceUnchanged");
  trueValue(receipt.foreignStateUnchanged, "terminal-history receipt.foreignStateUnchanged");
  trueValue(receipt.noFoundryWrite, "terminal-history receipt.noFoundryWrite");
  trueValue(receipt.projectContentWrite, "terminal-history receipt.projectContentWrite");
  trueValue(receipt.projectPersistenceWrite, "terminal-history receipt.projectPersistenceWrite");
  if (receipt.blocker !== null || receipt.outcomeUnknown !== false || receipt.authoritativeRereadRequired !== false || receipt.retryAllowed !== false) blocked("A successful terminal-committed receipt cannot erase blocker, unknown-outcome, reread, or retry semantics.");
  const authority = record(receipt.authority, "terminal-history receipt.authority");
  exact(authority.target, "local-project", "terminal-history receipt.authority.target");
  exact(authority.apply, "operation-specific", "terminal-history receipt.authority.apply");
  falseValue(authority.genericExecutor, "terminal-history receipt.authority.genericExecutor");
  const preview = validatePreview(receipt.sourcePreview);
  const source = validatePromotion(receipt.sourceReceipt, preview);
  if (source.projectId !== projectId || source.generation !== integer(receipt.generation, "terminal-history receipt.generation") || source.contentSha256 !== receipt.contentSha256) blocked("terminal-history receipt is not bound to the exact promotion source identity.");
  const authoritativeReread = validateInspection(receipt.authoritativeRecoveryReread, projectId, source);
  const session = validateSession(receipt.session, preview, source);
  if (session.session.batch.batchId !== batchId || canonicalize(session.history) !== canonicalize(receipt.history)) blocked("terminal-history receipt does not retain the exact committed session history.");
  const transitions = array(receipt.historyTransitions, "terminal-history receipt.historyTransitions");
  if (transitions.length !== expectedTransitions.length || transitions.some((item, index) => item !== expectedTransitions[index])) blocked("terminal-history receipt.historyTransitions does not retain the expected preview-to-commit sequence.");
  if (canonicalize(authoritativeReread) !== canonicalize(receipt.authoritativeRecoveryReread)) blocked("terminal-history receipt reread changed during validation.");
  return receipt as unknown as ProjectBackupPromotionTerminalHistoryReceipt;
}

export const projectBackupPromotionTerminalHistoryReceiptSchema = Object.freeze({
  parse(input: unknown): ProjectBackupPromotionTerminalHistoryReceipt {
    return parseTerminalHistoryReceipt(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectBackupPromotionTerminalHistoryReceipt }>
    | Readonly<{ success: false; error: ProjectBackupPromotionTerminalHistoryValidationError }> {
    try {
      return { success: true, data: parseTerminalHistoryReceipt(input) };
    } catch (error) {
      const validationError = error instanceof ProjectBackupPromotionTerminalHistoryValidationError
        ? error
        : new ProjectBackupPromotionTerminalHistoryValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
