export const PROJECT_STAGE11_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m971-stage11-persistent-add-scene-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M973";
  sourceMilestone: "M971";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.add-scene.persist";
  operation: "project.add-scene.persist.redo";
  handler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory";
  rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  orderedSceneSetRequired: true;
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

export class ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError(message);
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
  const source = record(input, "M971 source receipt");
  exact(source.milestone, "M971", "M971.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ADD-SCENE.PERSIST REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M971.status");
  const implementation = record(source.implementation, "M971.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-redo-handler-classifier-evidence.ts", "M971.implementation.source");
  exact(implementation.redoHandler, "bridgeProjectPersistentAddSceneRedoToTerminalHistory", "M971.implementation.redoHandler");
  exact(implementation.redoRereadClassifier, "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema", "M971.implementation.redoRereadClassifier");
  exact(implementation.redoBindingStatus, "bound-operation-specific", "M971.implementation.redoBindingStatus");
  exact(implementation.sourceOperationInvocation, false, "M971.implementation.sourceOperationInvocation");
  exact(implementation.rereadClassifierInvocation, false, "M971.implementation.rereadClassifierInvocation");
  exact(implementation.semanticEvidencePreserved, true, "M971.implementation.semanticEvidencePreserved");
  const safety = record(source.safety, "M971.safety");
  exact(safety.operationAuthority, "not-granted", "M971.safety.operationAuthority");
  for (const field of ["noTransitionAuthority", "noExecutionAuthority", "noGenericExecutor", "readOnly", "nonCertifying", "runtimeOrFoundryAction", "projectMutation", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) {
    exact(safety[field], field === "runtimeOrFoundryAction" || field === "projectMutation" || field === "providerOrCredentialActivity" || field === "playerPasswordsGenerated" || field === "stage12Started" || field === "readyClaim" ? false : true, `M971.safety.${field}`);
  }
  exact(safety.stage11AcceptanceStatus, "blocked", "M971.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M971.aggregateBoundary");
  exact(boundary.operationCount, 14, "M971.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M971.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M971.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M971.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M971.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M971.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M971.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.currentAuthority, "PARTIAL", "M971.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M971.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M971.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M973 project.add-scene.persist aggregate evidence");
  exactKeys(value, [
    "aggregateAttachment", "aggregateAuthority", "bindingStatus", "currentAuthority", "evidenceLabel", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "orderedSceneSetRequired", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort(), "M973 project.add-scene.persist aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M973.schemaVersion");
  exact(value.milestone, "M973", "M973.milestone");
  exact(value.sourceMilestone, "M971", "M973.sourceMilestone");
  exact(value.evidenceLabel, "local", "M973.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M973.sourceReceipt");
  exact(value.producer, "project.add-scene.persist", "M973.producer");
  exact(value.operation, "project.add-scene.persist.redo", "M973.operation");
  exact(value.handler, "bridgeProjectPersistentAddSceneRedoToTerminalHistory", "M973.handler");
  exact(value.rereadClassifier, "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema", "M973.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M973.bindingStatus");
  exact(value.matchedRereadRequired, true, "M973.matchedRereadRequired");
  exact(value.orderedSceneSetRequired, true, "M973.orderedSceneSetRequired");
  exact(value.sourceInvocation, false, "M973.sourceInvocation");
  exact(value.rereadInvocation, false, "M973.rereadInvocation");
  exact(value.operationCount, 14, "M973.operationCount");
  exact(value.operationCountChanged, false, "M973.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M973.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M973.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M973.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M973.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M973.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M973.stage12Started");
  exact(value.readyClaim, false, "M973.readyClaim");
  return value as ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M973",
    sourceMilestone: "M971",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.add-scene.persist",
    operation: "project.add-scene.persist.redo",
    handler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory",
    rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    orderedSceneSetRequired: true,
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

export const projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
