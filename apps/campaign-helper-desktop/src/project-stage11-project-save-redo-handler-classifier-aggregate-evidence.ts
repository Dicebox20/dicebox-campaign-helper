export const PROJECT_STAGE11_PROJECT_SAVE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m966-stage11-project-save-redo-handler-classifier-evidence-bridge-closure-receipt.json" as const;

export type ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_SAVE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M968";
  sourceMilestone: "M966";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.save";
  operation: "project.save.redo";
  handler: "bridgeProjectSaveRedoToTerminalHistory";
  rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  sourceInvocation: false;
  rereadInvocation: false;
  operationCount: 14;
  operationCountChanged: false;
  aggregateAttachment: "one-producer-scoped-non-certifying";
  currentAuthority: "partial";
  aggregateAuthority: "not-granted";
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_SAVE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M966 source receipt");
  exact(source.milestone, "M966", "M966.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.SAVE REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M966.status");
  const implementation = record(source.implementation, "M966.implementation");
  exact(implementation.redoHandler, "bridgeProjectSaveRedoToTerminalHistory", "M966.implementation.redoHandler");
  exact(implementation.redoRereadClassifier, "projectSaveRedoTerminalHistoryReceiptSchema", "M966.implementation.redoRereadClassifier");
  exact(implementation.redoBindingStatus, "bound-operation-specific", "M966.implementation.redoBindingStatus");
  exact(implementation.sourceOperationInvocation, false, "M966.implementation.sourceOperationInvocation");
  exact(implementation.rereadClassifierInvocation, false, "M966.implementation.rereadClassifierInvocation");
  const safety = record(source.safety, "M966.safety");
  exact(safety.operationAuthority, "not-granted", "M966.safety.operationAuthority");
  exact(safety.noTransitionAuthority, true, "M966.safety.noTransitionAuthority");
  exact(safety.noExecutionAuthority, true, "M966.safety.noExecutionAuthority");
  exact(safety.noGenericExecutor, true, "M966.safety.noGenericExecutor");
  exact(safety.readOnly, true, "M966.safety.readOnly");
  exact(safety.nonCertifying, true, "M966.safety.nonCertifying");
  exact(safety.runtimeOrFoundryAction, false, "M966.safety.runtimeOrFoundryAction");
  exact(safety.projectMutation, false, "M966.safety.projectMutation");
  exact(safety.playerPasswordsGenerated, false, "M966.safety.playerPasswordsGenerated");
  exact(safety.stage11AcceptanceStatus, "blocked", "M966.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M966.safety.stage12Started");
  exact(safety.readyClaim, false, "M966.safety.readyClaim");
  const boundary = record(source.aggregateBoundary, "M966.aggregateBoundary");
  exact(boundary.operationCount, 14, "M966.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M966.aggregateBoundary.operationCountChanged");
  exact(boundary.currentAuthority, "PARTIAL", "M966.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M966.aggregateBoundary.aggregateAuthority");
}

function validateOutput(input: unknown): ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M968 project.save redo aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "bindingStatus", "currentAuthority", "evidenceLabel", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M968 project.save redo aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_SAVE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M968.schemaVersion");
  exact(value.milestone, "M968", "M968.milestone");
  exact(value.sourceMilestone, "M966", "M968.sourceMilestone");
  exact(value.evidenceLabel, "local", "M968.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M968.sourceReceipt");
  exact(value.producer, "project.save", "M968.producer");
  exact(value.operation, "project.save.redo", "M968.operation");
  exact(value.handler, "bridgeProjectSaveRedoToTerminalHistory", "M968.handler");
  exact(value.rereadClassifier, "projectSaveRedoTerminalHistoryReceiptSchema", "M968.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M968.bindingStatus");
  exact(value.matchedRereadRequired, true, "M968.matchedRereadRequired");
  exact(value.sourceInvocation, false, "M968.sourceInvocation");
  exact(value.rereadInvocation, false, "M968.rereadInvocation");
  exact(value.operationCount, 14, "M968.operationCount");
  exact(value.operationCountChanged, false, "M968.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M968.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M968.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M968.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M968.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M968.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M968.stage12Started");
  exact(value.readyClaim, false, "M968.readyClaim");
  return value as ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_SAVE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M968",
    sourceMilestone: "M966",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.save",
    operation: "project.save.redo",
    handler: "bridgeProjectSaveRedoToTerminalHistory",
    rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    sourceInvocation: false,
    rereadInvocation: false,
    operationCount: 14,
    operationCountChanged: false,
    aggregateAttachment: "one-producer-scoped-non-certifying",
    currentAuthority: "partial",
    aggregateAuthority: "not-granted",
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence {
    return validateOutput(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: validateOutput(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
