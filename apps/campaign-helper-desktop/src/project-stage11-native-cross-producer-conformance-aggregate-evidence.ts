export const PROJECT_STAGE11_NATIVE_CROSS_PRODUCER_CONFORMANCE_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const RECEIPT = "outputs/m874-stage11-native-cross-producer-conformance-closure-receipt.json" as const;

export type ProjectStage11NativeCrossProducerConformanceAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_NATIVE_CROSS_PRODUCER_CONFORMANCE_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M933";
  sourceMilestone: "M874";
  evidenceLabel: "local";
  receipt: typeof RECEIPT;
  operation: "dicebox.project.cross-producer.native-conformance";
  target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3";
  projectCreateGeneration: 1;
  assetBindingCommitGeneration: 2;
  transientGeneration: 3;
  committedBackupGeneration: 2;
  primaryRemoved: true;
  missingPrimaryValidBackupObserved: true;
  recoveryApprovalRequired: true;
  recoveryApplied: true;
  authoritativeRestoredReread: true;
  backupPreserved: true;
  semanticStatePreserved: true;
  assetTreePreserved: true;
  workspacePreserved: true;
  foreignStatePreserved: true;
  noFoundryWrite: true;
  runtimeRetry: false;
  desktopRuntime: "not-run";
  aggregateAttachment: "one-cross-producer-producer-scoped-non-certifying";
  producerScopedOnly: true;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryAuthority: true;
  noProjectMutation: true;
  aggregateAuthority: "not-granted";
  countsChanged: false;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11NativeCrossProducerConformanceAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_NATIVE_CROSS_PRODUCER_CONFORMANCE_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11NativeCrossProducerConformanceAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11NativeCrossProducerConformanceAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateSourceReceipt(input: unknown): void {
  const receipt = record(input, "M933 M874 closure receipt");
  exactKeys(receipt, ["evidenceClass", "limits", "milestone", "next", "operation", "scenario", "stage", "status", "target", "validation"], "M933 M874 closure receipt");
  exact(receipt.milestone, "M874", "M933 M874 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M933 M874 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL NATIVE CONFORMANCE; STAGE 11 NOT ACCEPTED", "M933 M874 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M933 M874 closure receipt.evidenceClass");
  exact(receipt.target, "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3", "M933 M874 closure receipt.target");
  exact(receipt.operation, "dicebox.project.cross-producer.native-conformance", "M933 M874 closure receipt.operation");
  exact(receipt.next, "Perform a fresh read-only Stage 11 reconciliation; retain the desktop runtime lane as parked and do not infer aggregate authority from this native test.", "M933 M874 closure receipt.next");

  const scenario = record(receipt.scenario, "M933 M874 closure receipt.scenario");
  exactKeys(scenario, ["assetBindingCommit", "finalReread", "projectCreate", "recoveryApply", "recoveryInspection", "recoveryPreview", "transition"], "M933 M874 closure receipt.scenario");

  const projectCreate = record(scenario.projectCreate, "M933 M874 scenario.projectCreate");
  exactKeys(projectCreate, ["assetCount", "generation", "status"], "M933 M874 scenario.projectCreate");
  exact(projectCreate.status, "PASS", "M933 M874 scenario.projectCreate.status");
  exact(projectCreate.generation, 1, "M933 M874 scenario.projectCreate.generation");
  exact(projectCreate.assetCount, 0, "M933 M874 scenario.projectCreate.assetCount");

  const assetBindingCommit = record(scenario.assetBindingCommit, "M933 M874 scenario.assetBindingCommit");
  exactKeys(assetBindingCommit, ["approval", "assetCount", "generation", "status"], "M933 M874 scenario.assetBindingCommit");
  exact(assetBindingCommit.status, "PASS", "M933 M874 scenario.assetBindingCommit.status");
  exact(assetBindingCommit.generation, 2, "M933 M874 scenario.assetBindingCommit.generation");
  exact(assetBindingCommit.assetCount, 1, "M933 M874 scenario.assetBindingCommit.assetCount");
  exact(assetBindingCommit.approval, "operation-specific native test setup", "M933 M874 scenario.assetBindingCommit.approval");

  const transition = record(scenario.transition, "M933 M874 scenario.transition");
  exactKeys(transition, ["backupGeneration", "beforeGeneration", "committedBindingPreservedInBackup", "committedGeneration", "primaryRemoved", "status"], "M933 M874 scenario.transition");
  exact(transition.status, "PASS", "M933 M874 scenario.transition.status");
  exact(transition.beforeGeneration, 2, "M933 M874 scenario.transition.beforeGeneration");
  exact(transition.committedGeneration, 3, "M933 M874 scenario.transition.committedGeneration");
  exact(transition.backupGeneration, 2, "M933 M874 scenario.transition.backupGeneration");
  exact(transition.primaryRemoved, true, "M933 M874 scenario.transition.primaryRemoved");
  exact(transition.committedBindingPreservedInBackup, true, "M933 M874 scenario.transition.committedBindingPreservedInBackup");

  const recoveryInspection = record(scenario.recoveryInspection, "M933 M874 scenario.recoveryInspection");
  exactKeys(recoveryInspection, ["assetCount", "backup", "generation", "noWrite", "primary", "status"], "M933 M874 scenario.recoveryInspection");
  exact(recoveryInspection.status, "PASS", "M933 M874 scenario.recoveryInspection.status");
  exact(recoveryInspection.primary, "MISSING", "M933 M874 scenario.recoveryInspection.primary");
  exact(recoveryInspection.backup, "VALID", "M933 M874 scenario.recoveryInspection.backup");
  exact(recoveryInspection.generation, 2, "M933 M874 scenario.recoveryInspection.generation");
  exact(recoveryInspection.assetCount, 1, "M933 M874 scenario.recoveryInspection.assetCount");
  exact(recoveryInspection.noWrite, true, "M933 M874 scenario.recoveryInspection.noWrite");

  const recoveryPreview = record(scenario.recoveryPreview, "M933 M874 scenario.recoveryPreview");
  exactKeys(recoveryPreview, ["assetCount", "backup", "generation", "noWrite", "primary", "requiresApproval", "status"], "M933 M874 scenario.recoveryPreview");
  exact(recoveryPreview.status, "PREVIEW", "M933 M874 scenario.recoveryPreview.status");
  exact(recoveryPreview.requiresApproval, true, "M933 M874 scenario.recoveryPreview.requiresApproval");
  exact(recoveryPreview.primary, "MISSING", "M933 M874 scenario.recoveryPreview.primary");
  exact(recoveryPreview.backup, "VALID", "M933 M874 scenario.recoveryPreview.backup");
  exact(recoveryPreview.generation, 2, "M933 M874 scenario.recoveryPreview.generation");
  exact(recoveryPreview.assetCount, 1, "M933 M874 scenario.recoveryPreview.assetCount");
  exact(recoveryPreview.noWrite, true, "M933 M874 scenario.recoveryPreview.noWrite");

  const recoveryApply = record(scenario.recoveryApply, "M933 M874 scenario.recoveryApply");
  exactKeys(recoveryApply, ["assetTreeUnchanged", "approved", "authoritativeCurrentReread", "backupUnchanged", "foreignStateUnchanged", "primaryRestored", "semanticStateUnchanged", "status", "workspaceUnchanged"], "M933 M874 scenario.recoveryApply");
  exact(recoveryApply.status, "PASS", "M933 M874 scenario.recoveryApply.status");
  for (const field of ["approved", "primaryRestored", "backupUnchanged", "semanticStateUnchanged", "assetTreeUnchanged", "workspaceUnchanged", "foreignStateUnchanged", "authoritativeCurrentReread"] as const) exact(recoveryApply[field], true, `M933 M874 scenario.recoveryApply.${field}`);

  const finalReread = record(scenario.finalReread, "M933 M874 scenario.finalReread");
  exactKeys(finalReread, ["assetCount", "backup", "boundAssetRestored", "foreignMarkerPreserved", "generation", "noFoundryWrite", "primary", "status"], "M933 M874 scenario.finalReread");
  exact(finalReread.status, "PASS", "M933 M874 scenario.finalReread.status");
  exact(finalReread.generation, 2, "M933 M874 scenario.finalReread.generation");
  exact(finalReread.assetCount, 1, "M933 M874 scenario.finalReread.assetCount");
  exact(finalReread.primary, "VALID", "M933 M874 scenario.finalReread.primary");
  exact(finalReread.backup, "VALID", "M933 M874 scenario.finalReread.backup");
  for (const field of ["boundAssetRestored", "foreignMarkerPreserved", "noFoundryWrite"] as const) exact(finalReread[field], true, `M933 M874 scenario.finalReread.${field}`);

  const validation = record(receipt.validation, "M933 M874 closure receipt.validation");
  exactKeys(validation, ["diffCheck", "focusedNativeTest", "fullNativeCrate", "packageTypeCheck", "runtimeRetry", "desktopRuntime"], "M933 M874 closure receipt.validation");
  exact(validation.focusedNativeTest, "PASS: 1 test", "M933 M874 closure receipt.validation.focusedNativeTest");
  exact(validation.fullNativeCrate, "PASS: 61 tests; 0 failed", "M933 M874 closure receipt.validation.fullNativeCrate");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M933 M874 closure receipt.validation.packageTypeCheck");
  exact(validation.diffCheck, "PASS", "M933 M874 closure receipt.validation.diffCheck");
  exact(validation.runtimeRetry, false, "M933 M874 closure receipt.validation.runtimeRetry");
  exact(validation.desktopRuntime, "NOT_RUN", "M933 M874 closure receipt.validation.desktopRuntime");

  const limits = record(receipt.limits, "M933 M874 closure receipt.limits");
  exactKeys(limits, ["foundryAuthority", "genericExecutor", "playerPasswordsGenerated", "producerScopedOnly", "providerOrCredentialActivity", "readyClaim", "stage11AcceptanceStatus", "stage12Started", "userOrForeignProjectTouched"], "M933 M874 closure receipt.limits");
}

export function createProjectStage11NativeCrossProducerConformanceAggregateEvidence(input: unknown): ProjectStage11NativeCrossProducerConformanceAggregateEvidence {
  validateSourceReceipt(input);
  const receipt = record(input, "M933 native cross-producer conformance aggregate input");
  const scenario = record(receipt.scenario, "M933 native cross-producer conformance aggregate input.scenario");
  const transition = record(scenario.transition, "M933 native cross-producer conformance aggregate input.scenario.transition");
  const recoveryInspection = record(scenario.recoveryInspection, "M933 native cross-producer conformance aggregate input.scenario.recoveryInspection");
  const recoveryPreview = record(scenario.recoveryPreview, "M933 native cross-producer conformance aggregate input.scenario.recoveryPreview");
  const recoveryApply = record(scenario.recoveryApply, "M933 native cross-producer conformance aggregate input.scenario.recoveryApply");
  const finalReread = record(scenario.finalReread, "M933 native cross-producer conformance aggregate input.scenario.finalReread");
  const validation = record(receipt.validation, "M933 native cross-producer conformance aggregate input.validation");
  const limits = record(receipt.limits, "M933 native cross-producer conformance aggregate input.limits");
  exact(limits.producerScopedOnly, true, "M933 native cross-producer conformance aggregate input.limits.producerScopedOnly");
  exact(limits.stage11AcceptanceStatus, "blocked", "M933 native cross-producer conformance aggregate input.limits.stage11AcceptanceStatus");
  exact(limits.stage12Started, false, "M933 native cross-producer conformance aggregate input.limits.stage12Started");
  exact(limits.readyClaim, false, "M933 native cross-producer conformance aggregate input.limits.readyClaim");
  exact(limits.genericExecutor, false, "M933 native cross-producer conformance aggregate input.limits.genericExecutor");
  exact(limits.foundryAuthority, false, "M933 native cross-producer conformance aggregate input.limits.foundryAuthority");
  exact(limits.providerOrCredentialActivity, false, "M933 native cross-producer conformance aggregate input.limits.providerOrCredentialActivity");
  exact(limits.playerPasswordsGenerated, false, "M933 native cross-producer conformance aggregate input.limits.playerPasswordsGenerated");
  exact(limits.userOrForeignProjectTouched, false, "M933 native cross-producer conformance aggregate input.limits.userOrForeignProjectTouched");
  exact(validation.runtimeRetry, false, "M933 native cross-producer conformance aggregate input.validation.runtimeRetry");
  exact(validation.desktopRuntime, "NOT_RUN", "M933 native cross-producer conformance aggregate input.validation.desktopRuntime");
  exact(transition.primaryRemoved, true, "M933 native cross-producer conformance aggregate input.transition.primaryRemoved");
  exact(recoveryInspection.primary, "MISSING", "M933 native cross-producer conformance aggregate input.recoveryInspection.primary");
  exact(recoveryInspection.backup, "VALID", "M933 native cross-producer conformance aggregate input.recoveryInspection.backup");
  exact(recoveryPreview.requiresApproval, true, "M933 native cross-producer conformance aggregate input.recoveryPreview.requiresApproval");
  exact(recoveryApply.approved, true, "M933 native cross-producer conformance aggregate input.recoveryApply.approved");
  exact(recoveryApply.authoritativeCurrentReread, true, "M933 native cross-producer conformance aggregate input.recoveryApply.authoritativeCurrentReread");
  exact(finalReread.noFoundryWrite, true, "M933 native cross-producer conformance aggregate input.finalReread.noFoundryWrite");
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_NATIVE_CROSS_PRODUCER_CONFORMANCE_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M933",
    sourceMilestone: "M874",
    evidenceLabel: "local",
    receipt: RECEIPT,
    operation: "dicebox.project.cross-producer.native-conformance",
    target: "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3",
    projectCreateGeneration: 1,
    assetBindingCommitGeneration: 2,
    transientGeneration: 3,
    committedBackupGeneration: 2,
    primaryRemoved: true,
    missingPrimaryValidBackupObserved: true,
    recoveryApprovalRequired: true,
    recoveryApplied: true,
    authoritativeRestoredReread: true,
    backupPreserved: true,
    semanticStatePreserved: true,
    assetTreePreserved: true,
    workspacePreserved: true,
    foreignStatePreserved: true,
    noFoundryWrite: true,
    runtimeRetry: false,
    desktopRuntime: "not-run",
    aggregateAttachment: "one-cross-producer-producer-scoped-non-certifying",
    producerScopedOnly: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noFoundryAuthority: true,
    noProjectMutation: true,
    aggregateAuthority: "not-granted",
    countsChanged: false,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}
