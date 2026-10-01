export const PROJECT_STAGE11_BACKUP_PROMOTION_RECOVERY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11BackupPromotionRecoveryEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_BACKUP_PROMOTION_RECOVERY_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "one-producer-scoped-local-backup-promotion-recovery-observation";
  observations: readonly [Readonly<{
    milestone: "M466";
    producer: "project.recovery.backup-promotion";
    lifecycle: "fixture-preview-proposal-approval-apply-authoritative-reread";
  }>];
  observedLifecycleCount: 1;
  producerScopedOnly: true;
  recoveryObserved: true;
  authoritativeReread: true;
  preservationObserved: true;
  noFoundryWrite: true;
  processClosed: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noCoverageClaim: true;
  noExecutionAuthority: true;
  noRecoveryAuthority: true;
  noProjectMutationAuthority: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11BackupPromotionRecoveryEvidenceValidationError extends Error {
  readonly code = "STAGE11_BACKUP_PROMOTION_RECOVERY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11BackupPromotionRecoveryEvidenceValidationError"; }
}
function blocked(message: string): never { throw new ProjectStage11BackupPromotionRecoveryEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> { if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`); return value as Record<string, unknown>; }
function exact(value: unknown, expected: string | number | boolean, label: string): void { if (value !== expected) blocked(`${label} must be ${String(expected)}.`); }
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void { const actual = Object.keys(value).sort(); const required = [...expected].sort(); if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`); }
function exactArray(value: unknown, expected: readonly string[], label: string): void { if (!Array.isArray(value) || value.length !== expected.length || value.some((item, index) => item !== expected[index])) blocked(`${label} must retain exact ordered values.`); }

export function createProjectStage11BackupPromotionRecoveryEvidence(input: unknown): ProjectStage11BackupPromotionRecoveryEvidenceReceipt {
  const receipt = record(input, "M466 receipt");
  exactKeys(receipt, ["backupUnchanged", "captureReceipt", "captureReceiptSha256", "desktopProcessCount", "doesNotProve", "evidenceLabel", "foreignSha256", "foundryWrite", "milestone", "primaryRestored", "primarySha256", "projectId", "status", "trace"], "M466 receipt");
  exact(receipt.milestone, "M466", "M466.milestone"); exact(receipt.status, "PASS_LOCAL_BOUNDED_RECOVERY", "M466.status"); exact(receipt.captureReceipt, "outputs/m466-stage11-backup-promotion-observation-receipt.json", "M466.captureReceipt"); exact(receipt.captureReceiptSha256, "24649A8DF8C5EFC9058BF23B6636D7F7809E767BB53B1FF3DFF1270E8BDCB0C9", "M466.captureReceiptSha256"); exact(receipt.trace, "fixture→preview→proposal→approval→apply→authoritative reread→pass", "M466.trace"); exact(receipt.projectId, "dbx:project:desktop-backup-authoritative-recovery-promotion-self-test", "M466.projectId"); exact(receipt.primaryRestored, true, "M466.primaryRestored"); exact(receipt.primarySha256, "F5AF1E42C838ADD5AEDDEE9ABC3B5D2125932D539A750763AA9C764F004EAC2B", "M466.primarySha256"); exact(receipt.backupUnchanged, true, "M466.backupUnchanged"); exact(receipt.foreignSha256, "9A5350AAD8C13C79B978DB42D3B339E75C54A96C4DF9815EB2A8BF5D8F1203F2", "M466.foreignSha256"); exact(receipt.desktopProcessCount, 0, "M466.desktopProcessCount"); exact(receipt.foundryWrite, false, "M466.foundryWrite"); exact(receipt.evidenceLabel, "local", "M466.evidenceLabel"); exactArray(receipt.doesNotProve, ["generic Stage 11 acceptance", "Foundry authority", "Ready-to-Play"], "M466.doesNotProve");
  return Object.freeze({ schemaVersion: PROJECT_STAGE11_BACKUP_PROMOTION_RECOVERY_EVIDENCE_SCHEMA_VERSION, status: "PASS", disposition: "one-producer-scoped-local-backup-promotion-recovery-observation", observations: Object.freeze([Object.freeze({ milestone: "M466", producer: "project.recovery.backup-promotion", lifecycle: "fixture-preview-proposal-approval-apply-authoritative-reread" })]) as ProjectStage11BackupPromotionRecoveryEvidenceReceipt["observations"], observedLifecycleCount: 1, producerScopedOnly: true, recoveryObserved: true, authoritativeReread: true, preservationObserved: true, noFoundryWrite: true, processClosed: true, nonCertifying: true, noAuthorityGrant: true, noCoverageClaim: true, noExecutionAuthority: true, noRecoveryAuthority: true, noProjectMutationAuthority: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
}
