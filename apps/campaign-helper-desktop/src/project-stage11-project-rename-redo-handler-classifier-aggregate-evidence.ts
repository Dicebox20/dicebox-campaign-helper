export const PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m975-stage11-project-rename-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M977";
  sourceMilestone: "M975";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.rename";
  operation: "project.rename.redo";
  handler: "bridgeProjectRenameRedoToTerminalHistory";
  rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  metadataOnlyRenameRequired: true;
  projectContentPreserved: true;
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

export class ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError(message);
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
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M975 source receipt");
  exact(source.milestone, "M975", "M975.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.RENAME REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M975.status");
  const implementation = record(source.implementation, "M975.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-rename-redo-handler-classifier-evidence.ts", "M975.implementation.source");
  exact(implementation.redoHandler, "bridgeProjectRenameRedoToTerminalHistory", "M975.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectRenameRedoTerminalHistoryReceiptSchema", "M975.implementation.redoClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M975.implementation.bindingStatus");
  exact(implementation.sourceInvocation, false, "M975.implementation.sourceInvocation");
  exact(implementation.rereadInvocation, false, "M975.implementation.rereadInvocation");
  exact(implementation.metadataOnlyRename, true, "M975.implementation.metadataOnlyRename");
  exact(implementation.projectContentPreserved, true, "M975.implementation.projectContentPreserved");
  const safety = record(source.safety, "M975.safety");
  exact(safety.operationAuthority, "not-granted", "M975.safety.operationAuthority");
  for (const field of ["noTransitionAuthority", "noExecutionAuthority", "noGenericExecutor", "readOnly", "nonCertifying", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved", "runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) {
    exact(safety[field], field === "runtimeOrFoundryAction" || field === "providerOrCredentialActivity" || field === "playerPasswordsGenerated" || field === "stage12Started" || field === "readyClaim" ? false : true, `M975.safety.${field}`);
  }
  exact(safety.stage11AcceptanceStatus, "blocked", "M975.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M975.aggregateBoundary");
  exact(boundary.operationCount, 14, "M975.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M975.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M975.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M975.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M975.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M975.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M975.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.currentAuthority, "PARTIAL", "M975.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M975.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M975.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M977 project.rename aggregate evidence");
  exactKeys(value, [
    "aggregateAttachment", "aggregateAuthority", "bindingStatus", "currentAuthority", "evidenceLabel", "handler", "matchedRereadRequired", "metadataOnlyRenameRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "projectContentPreserved", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort(), "M977 project.rename aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M977.schemaVersion");
  exact(value.milestone, "M977", "M977.milestone");
  exact(value.sourceMilestone, "M975", "M977.sourceMilestone");
  exact(value.evidenceLabel, "local", "M977.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M977.sourceReceipt");
  exact(value.producer, "project.rename", "M977.producer");
  exact(value.operation, "project.rename.redo", "M977.operation");
  exact(value.handler, "bridgeProjectRenameRedoToTerminalHistory", "M977.handler");
  exact(value.rereadClassifier, "projectRenameRedoTerminalHistoryReceiptSchema", "M977.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M977.bindingStatus");
  exact(value.matchedRereadRequired, true, "M977.matchedRereadRequired");
  exact(value.metadataOnlyRenameRequired, true, "M977.metadataOnlyRenameRequired");
  exact(value.projectContentPreserved, true, "M977.projectContentPreserved");
  exact(value.sourceInvocation, false, "M977.sourceInvocation");
  exact(value.rereadInvocation, false, "M977.rereadInvocation");
  exact(value.operationCount, 14, "M977.operationCount");
  exact(value.operationCountChanged, false, "M977.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M977.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M977.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M977.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M977.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M977.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M977.stage12Started");
  exact(value.readyClaim, false, "M977.readyClaim");
  return value as ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M977",
    sourceMilestone: "M975",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.rename",
    operation: "project.rename.redo",
    handler: "bridgeProjectRenameRedoToTerminalHistory",
    rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    metadataOnlyRenameRequired: true,
    projectContentPreserved: true,
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

export const projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
