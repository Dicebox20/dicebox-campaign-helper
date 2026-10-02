export const PROJECT_STAGE11_PROJECT_SAVE_CURRENT_AUTHORITY_LIFECYCLE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m645-stage11-observable-save-ui-packaged-observation-receipt.json" as const;
const PROJECT_ID = "dbx:project:desktop-multiscene-self-test" as const;

export type ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_SAVE_CURRENT_AUTHORITY_LIFECYCLE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M963";
  sourceMilestone: "M645";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.save";
  operation: "project.save";
  projectId: typeof PROJECT_ID;
  lifecycle: "preview→approval→save→reread→inverse-restore";
  sourceOperationObserved: true;
  sourceMutationObserved: true;
  directCurrentAuthority: "operation-specific-local-project";
  aggregateAuthority: "not-granted";
  sourceObservation: Readonly<{
    generation: 10;
    historyEntries: 5;
    terminalState: "undone / clean / active";
    foundryWrite: false;
  }>;
  authoritativeReread: Readonly<{
    primaryGeneration: 10;
    backupGeneration: 9;
    remainingExactTargetPids: readonly [];
  }>;
  lifecycleCoverage: Readonly<{
    preview: true;
    approval: true;
    apply: true;
    authoritativeReread: true;
    inverseRestore: true;
  }>;
  foreignStatePreserved: true;
  noFoundryWrite: true;
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noProjectMutationByM963: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_SAVE_CURRENT_AUTHORITY_LIFECYCLE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) blocked(`${label} must be a non-empty string.`);
  return value;
}

function nonEmptyArray(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) blocked(`${label} must be an array.`);
  return value;
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M645 source receipt");
  exact(source.milestone, "M645", "M645.milestone");
  exact(source.stage, "proposal-approval-history", "M645.stage");
  exact(source.status, "PASS LOCAL BOUNDED OBSERVATION", "M645.status");
  const scope = stringValue(source.scope, "M645.scope");
  exact(scope, "One exact M644 exit=0 packaged desktop launch, one accessibility read, explicit exact-process stop, and one exact target/process reread.", "M645.scope");

  const observation = record(source.accessibilityObservation, "M645.accessibilityObservation");
  exact(observation.projectId, PROJECT_ID, "M645.accessibilityObservation.projectId");
  exact(observation.terminalTitle, "DiceBox Project Save UI Execute PASS · dbx:project:desktop-multiscene-self-test · preview→approval→save→reread→inverse-restore · generation 10 · history 5 · no Foundry write", "M645.accessibilityObservation.terminalTitle");
  exact(observation.generation, 10, "M645.accessibilityObservation.generation");
  exact(observation.historyEntries, 5, "M645.accessibilityObservation.historyEntries");
  exact(observation.terminalState, "undone / clean / active", "M645.accessibilityObservation.terminalState");
  exact(observation.foundryWrite, false, "M645.accessibilityObservation.foundryWrite");

  const reread = record(source.authoritativeReread, "M645.authoritativeReread");
  exact(reread.primaryGeneration, 10, "M645.authoritativeReread.primaryGeneration");
  exact(reread.backupGeneration, 9, "M645.authoritativeReread.backupGeneration");
  if (nonEmptyArray(reread.remainingExactTargetPids, "M645.authoritativeReread.remainingExactTargetPids").length !== 0) blocked("M645.authoritativeReread.remainingExactTargetPids must be empty.");

  const preservation = record(source.preservation, "M645.preservation");
  exact(preservation.ordinarySessionInspected, false, "M645.preservation.ordinarySessionInspected");
  exact(preservation.ordinarySessionChanged, false, "M645.preservation.ordinarySessionChanged");
  exact(preservation.browserStorageInspected, false, "M645.preservation.browserStorageInspected");
  exact(preservation.retries, 0, "M645.preservation.retries");
  exact(preservation.providerOrCredentialAction, false, "M645.preservation.providerOrCredentialAction");
  exact(preservation.foundryAction, false, "M645.preservation.foundryAction");
  exact(preservation.playerPasswordAction, false, "M645.preservation.playerPasswordAction");
  const limits = stringValue(source.limits, "M645.limits");
  if (!limits.includes("does not accept aggregate Stage 11") || !limits.includes("certify Ready-to-Play")) blocked("M645.limits must retain aggregate and Ready-to-Play non-certification.");
}

function validateOutput(input: unknown): ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence {
  const value = record(input, "M963 project.save current-authority/lifecycle evidence");
  const expectedKeys = [
    "aggregateAuthority", "authoritativeReread", "directCurrentAuthority", "evidenceLabel", "foreignStatePreserved", "lifecycle", "lifecycleCoverage", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutationByM963", "noTransitionAuthority", "nonCertifying", "operation", "producer", "projectId", "readOnly", "readyClaim", "schemaVersion", "sourceMilestone", "sourceMutationObserved", "sourceObservation", "sourceOperationObserved", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M963 project.save evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_SAVE_CURRENT_AUTHORITY_LIFECYCLE_EVIDENCE_SCHEMA_VERSION, "M963.schemaVersion");
  exact(value.milestone, "M963", "M963.milestone");
  exact(value.sourceMilestone, "M645", "M963.sourceMilestone");
  exact(value.evidenceLabel, "local", "M963.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M963.sourceReceipt");
  exact(value.producer, "project.save", "M963.producer");
  exact(value.operation, "project.save", "M963.operation");
  exact(value.projectId, PROJECT_ID, "M963.projectId");
  exact(value.lifecycle, "preview→approval→save→reread→inverse-restore", "M963.lifecycle");
  exact(value.sourceOperationObserved, true, "M963.sourceOperationObserved");
  exact(value.sourceMutationObserved, true, "M963.sourceMutationObserved");
  exact(value.directCurrentAuthority, "operation-specific-local-project", "M963.directCurrentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M963.aggregateAuthority");
  exact(value.foreignStatePreserved, true, "M963.foreignStatePreserved");
  exact(value.noFoundryWrite, true, "M963.noFoundryWrite");
  exact(value.readOnly, true, "M963.readOnly");
  exact(value.nonCertifying, true, "M963.nonCertifying");
  exact(value.noAuthorityGrant, true, "M963.noAuthorityGrant");
  exact(value.noExecutionAuthority, true, "M963.noExecutionAuthority");
  exact(value.noTransitionAuthority, true, "M963.noTransitionAuthority");
  exact(value.noGenericExecutor, true, "M963.noGenericExecutor");
  exact(value.noProjectMutationByM963, true, "M963.noProjectMutationByM963");
  exact(value.stage11AcceptanceStatus, "blocked", "M963.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M963.stage12Started");
  exact(value.readyClaim, false, "M963.readyClaim");

  const observation = record(value.sourceObservation, "M963.sourceObservation");
  exact(observation.generation, 10, "M963.sourceObservation.generation");
  exact(observation.historyEntries, 5, "M963.sourceObservation.historyEntries");
  exact(observation.terminalState, "undone / clean / active", "M963.sourceObservation.terminalState");
  exact(observation.foundryWrite, false, "M963.sourceObservation.foundryWrite");
  const reread = record(value.authoritativeReread, "M963.authoritativeReread");
  exact(reread.primaryGeneration, 10, "M963.authoritativeReread.primaryGeneration");
  exact(reread.backupGeneration, 9, "M963.authoritativeReread.backupGeneration");
  if (nonEmptyArray(reread.remainingExactTargetPids, "M963.authoritativeReread.remainingExactTargetPids").length !== 0) blocked("M963.authoritativeReread.remainingExactTargetPids must be empty.");
  const coverage = record(value.lifecycleCoverage, "M963.lifecycleCoverage");
  for (const field of ["preview", "approval", "apply", "authoritativeReread", "inverseRestore"] as const) exact(coverage[field], true, `M963.lifecycleCoverage.${field}`);
  return value as ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence;
}

export function createProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence(input: unknown): ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_SAVE_CURRENT_AUTHORITY_LIFECYCLE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M963",
    sourceMilestone: "M645",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.save",
    operation: "project.save",
    projectId: PROJECT_ID,
    lifecycle: "preview→approval→save→reread→inverse-restore",
    sourceOperationObserved: true,
    sourceMutationObserved: true,
    directCurrentAuthority: "operation-specific-local-project",
    aggregateAuthority: "not-granted",
    sourceObservation: { generation: 10, historyEntries: 5, terminalState: "undone / clean / active", foundryWrite: false } as const,
    authoritativeReread: { primaryGeneration: 10, backupGeneration: 9, remainingExactTargetPids: [] } as const,
    lifecycleCoverage: { preview: true, approval: true, apply: true, authoritativeReread: true, inverseRestore: true } as const,
    foreignStatePreserved: true,
    noFoundryWrite: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noProjectMutationByM963: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence {
    return validateOutput(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError }> {
    try {
      return { success: true, data: validateOutput(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError
        ? error
        : new ProjectStage11ProjectSaveCurrentAuthorityLifecycleEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
