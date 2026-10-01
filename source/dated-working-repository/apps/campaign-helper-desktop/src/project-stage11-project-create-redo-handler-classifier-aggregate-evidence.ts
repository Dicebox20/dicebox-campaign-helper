export const PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M986";
  sourceMilestone: "M984";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.create";
  operation: "project.create.redo";
  handler: "bridgeProjectCreateRedoToTerminalHistory";
  rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  targetIdentityPreserved: true;
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  generationAdvanced: true;
  firstGenerationContentIdentityPreserved: true;
  scenesPreserved: true;
  assetCollectionPreserved: true;
  sourceInvocation: false;
  rereadInvocation: false;
  byteHashRotation: "not-claimed";
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

export class ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M984 source receipt");
  exact(source.milestone, "M984", "M984.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.CREATE REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M984.status");
  const implementation = record(source.implementation, "M984.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-create-redo-handler-classifier-evidence.ts", "M984.implementation.source");
  exact(implementation.operation, "project.create.redo", "M984.implementation.operation");
  exact(implementation.commandKind, "project.create", "M984.implementation.commandKind");
  exact(implementation.redoHandler, "bridgeProjectCreateRedoToTerminalHistory", "M984.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectCreateRedoTerminalHistoryReceiptSchema", "M984.implementation.redoClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M984.implementation.bindingStatus");
  exact(implementation.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M984.implementation.rereadRequirement");
  exact(implementation.sourceStatus, "undone", "M984.implementation.sourceStatus");
  exact(implementation.destinationStatus, "redone", "M984.implementation.destinationStatus");
  for (const field of ["targetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "scenesPreserved", "assetCollectionPreserved"] as const) {
    exact(implementation[field], true, `M984.implementation.${field}`);
  }
  exact(implementation.transitionInvocation, "not-invoked", "M984.implementation.transitionInvocation");
  exact(implementation.rereadInvocation, "not-invoked", "M984.implementation.rereadInvocation");
  exact(implementation.byteHashRotation, "not-claimed", "M984.implementation.byteHashRotation");
  const safety = record(source.safety, "M984.safety");
  exact(safety.operationAuthority, "not-granted", "M984.safety.operationAuthority");
  for (const field of ["noTransitionAuthority", "noExecutionAuthority", "noGenericExecutor", "readOnly", "nonCertifying", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) {
    exact(safety[field], true, `M984.safety.${field}`);
  }
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) {
    exact(safety[field], false, `M984.safety.${field}`);
  }
  exact(safety.stage11AcceptanceStatus, "blocked", "M984.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M984.aggregateBoundary");
  exact(boundary.aggregateSemanticAttachmentPresent, true, "M984.aggregateBoundary.aggregateSemanticAttachmentPresent");
  exact(boundary.handlerClassifierAggregateAttachment, false, "M984.aggregateBoundary.handlerClassifierAggregateAttachment");
  exact(boundary.operationCount, 14, "M984.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M984.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M984.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M984.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M984.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M984.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M984.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.currentAuthority, "PARTIAL", "M984.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M984.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M984.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M986 project.create aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "assetCollectionPreserved", "bindingStatus", "byteHashRotation", "currentAuthority", "evidenceLabel", "firstGenerationContentIdentityPreserved", "generationAdvanced", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "scenesPreserved", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "targetAbsentBeforeRedo", "targetIdentityPreserved", "targetPresentAfterRedo",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M986 project.create aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M986.schemaVersion");
  exact(value.milestone, "M986", "M986.milestone");
  exact(value.sourceMilestone, "M984", "M986.sourceMilestone");
  exact(value.evidenceLabel, "local", "M986.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M986.sourceReceipt");
  exact(value.producer, "project.create", "M986.producer");
  exact(value.operation, "project.create.redo", "M986.operation");
  exact(value.handler, "bridgeProjectCreateRedoToTerminalHistory", "M986.handler");
  exact(value.rereadClassifier, "projectCreateRedoTerminalHistoryReceiptSchema", "M986.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M986.bindingStatus");
  for (const field of ["matchedRereadRequired", "targetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "scenesPreserved", "assetCollectionPreserved"] as const) exact(value[field], true, `M986.${field}`);
  exact(value.sourceInvocation, false, "M986.sourceInvocation");
  exact(value.rereadInvocation, false, "M986.rereadInvocation");
  exact(value.byteHashRotation, "not-claimed", "M986.byteHashRotation");
  exact(value.operationCount, 14, "M986.operationCount");
  exact(value.operationCountChanged, false, "M986.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M986.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M986.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M986.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M986.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M986.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M986.stage12Started");
  exact(value.readyClaim, false, "M986.readyClaim");
  return value as ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M986",
    sourceMilestone: "M984",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.create",
    operation: "project.create.redo",
    handler: "bridgeProjectCreateRedoToTerminalHistory",
    rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    targetIdentityPreserved: true,
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    generationAdvanced: true,
    firstGenerationContentIdentityPreserved: true,
    scenesPreserved: true,
    assetCollectionPreserved: true,
    sourceInvocation: false,
    rereadInvocation: false,
    byteHashRotation: "not-claimed",
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

export const projectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
