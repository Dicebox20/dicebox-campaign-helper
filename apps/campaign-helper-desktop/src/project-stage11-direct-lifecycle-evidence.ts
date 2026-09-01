export const PROJECT_STAGE11_DIRECT_LIFECYCLE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11DirectLifecycleEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_DIRECT_LIFECYCLE_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "two-producer-scoped-local-observations";
  observations: readonly [
    Readonly<{ milestone: "M466"; producer: "project.recovery.backup-promotion"; lifecycle: "preview-proposal-approval-apply-reread" }>,
    Readonly<{ milestone: "M645"; producer: "project.save"; lifecycle: "preview-approval-save-reread-inverse-restore" }>,
  ];
  observedLifecycleCount: 2;
  producerScopedOnly: true;
  readOnly: true;
  noAuthorityGrant: true;
  noCoverageClaim: true;
  noFoundryAuthority: true;
  noExecutionAuthority: true;
  noRecoveryAuthority: true;
  noFoundryWrite: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11DirectLifecycleEvidenceValidationError extends Error {
  readonly code = "STAGE11_DIRECT_LIFECYCLE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectStage11DirectLifecycleEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectStage11DirectLifecycleEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function field(value: Record<string, unknown>, key: string, expected: unknown, label: string): void {
  if (value[key] !== expected) blocked(`${label}.${key} must match the fixed receipt.`);
}

export function createProjectStage11DirectLifecycleEvidence(m466Input: unknown, m645Input: unknown): ProjectStage11DirectLifecycleEvidenceReceipt {
  const m466 = record(m466Input, "M466");
  field(m466, "milestone", "M466", "M466");
  field(m466, "status", "PASS_LOCAL_BOUNDED_RECOVERY", "M466");
  field(m466, "trace", "fixture→preview→proposal→approval→apply→authoritative reread→pass", "M466");
  field(m466, "primaryRestored", true, "M466");
  field(m466, "backupUnchanged", true, "M466");
  field(m466, "foundryWrite", false, "M466");
  field(m466, "evidenceLabel", "local", "M466");
  const m466Limits = m466.doesNotProve;
  if (!Array.isArray(m466Limits) || !m466Limits.includes("generic Stage 11 acceptance") || !m466Limits.includes("Foundry authority")) blocked("M466 must retain non-certification limits.");

  const m645 = record(m645Input, "M645");
  field(m645, "milestone", "M645", "M645");
  field(m645, "status", "PASS LOCAL BOUNDED OBSERVATION", "M645");
  field(m645, "stage", "proposal-approval-history", "M645");
  const scope = m645.scope;
  if (typeof scope !== "string" || !scope.includes("preview→approval→save→reread→inverse-restore")) blocked("M645.scope must retain the exact lifecycle trace.");
  const observation = record(m645.accessibilityObservation, "M645.accessibilityObservation");
  field(observation, "projectId", "dbx:project:desktop-multiscene-self-test", "M645.accessibilityObservation");
  field(observation, "foundryWrite", false, "M645.accessibilityObservation");
  const reread = record(m645.authoritativeReread, "M645.authoritativeReread");
  if (typeof reread.primarySha256 !== "string" || typeof reread.backupSha256 !== "string" || !Array.isArray(reread.remainingExactTargetPids) || reread.remainingExactTargetPids.length !== 0) blocked("M645 must retain its authoritative reread and clean process state.");
  const preservation = record(m645.preservation, "M645.preservation");
  field(preservation, "foundryAction", false, "M645.preservation");
  field(preservation, "playerPasswordAction", false, "M645.preservation");
  if (typeof m645.limits !== "string" || !m645.limits.includes("does not accept aggregate Stage 11")) blocked("M645 must retain its non-certification limit.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_DIRECT_LIFECYCLE_EVIDENCE_SCHEMA_VERSION,
    status: "PASS",
    disposition: "two-producer-scoped-local-observations",
    observations: Object.freeze([
      Object.freeze({ milestone: "M466", producer: "project.recovery.backup-promotion", lifecycle: "preview-proposal-approval-apply-reread" }),
      Object.freeze({ milestone: "M645", producer: "project.save", lifecycle: "preview-approval-save-reread-inverse-restore" }),
    ]) as ProjectStage11DirectLifecycleEvidenceReceipt["observations"],
    observedLifecycleCount: 2,
    producerScopedOnly: true,
    readOnly: true,
    noAuthorityGrant: true,
    noCoverageClaim: true,
    noFoundryAuthority: true,
    noExecutionAuthority: true,
    noRecoveryAuthority: true,
    noFoundryWrite: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}
