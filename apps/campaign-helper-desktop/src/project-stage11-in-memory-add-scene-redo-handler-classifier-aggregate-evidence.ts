export const PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M1008";
  sourceMilestone: "M1006";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.add-scene.commit-in-memory";
  operation: "project.add-scene.commit-in-memory.redo";
  handler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory";
  rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  orderedSceneSetPreserved: true;
  addedSceneAppended: true;
  activeSceneSelected: true;
  assetPreservation: true;
  nonPersistencePreserved: true;
  sceneSetIdentityChanged: true;
  byteHashRotation: "not-claimed";
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

export class ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M1006 source receipt");
  exact(source.milestone, "M1006", "M1006.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ADD-SCENE.COMMIT-IN-MEMORY REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M1006.status");
  const implementation = record(source.implementation, "M1006.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-redo-handler-classifier-evidence.ts", "M1006.implementation.source");
  exact(implementation.operation, "project.add-scene.commit-in-memory.redo", "M1006.implementation.operation");
  exact(implementation.commandKind, "project.add-scene.commit-in-memory", "M1006.implementation.commandKind");
  exact(implementation.handler, "bridgeProjectAddSceneInMemoryRedoToTerminalHistory", "M1006.implementation.handler");
  exact(implementation.rereadClassifier, "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema", "M1006.implementation.rereadClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M1006.implementation.bindingStatus");
  exact(implementation.matchedRereadRequired, true, "M1006.implementation.matchedRereadRequired");
  for (const field of ["orderedSceneSetPreserved", "addedSceneAppended", "activeSceneSelected", "assetPreservation", "nonPersistencePreserved", "sceneSetIdentityChanged"] as const) exact(implementation[field], true, `M1006.implementation.${field}`);
  exact(implementation.byteHashRotation, "not-claimed", "M1006.implementation.byteHashRotation");
  exact(implementation.sourceInvocation, false, "M1006.implementation.sourceInvocation");
  exact(implementation.rereadInvocation, false, "M1006.implementation.rereadInvocation");
  exact(implementation.transitionInvocation, false, "M1006.implementation.transitionInvocation");
  const safety = record(source.safety, "M1006.safety");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(safety[field], true, `M1006.safety.${field}`);
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(safety[field], false, `M1006.safety.${field}`);
  exact(safety.stage11AcceptanceStatus, "blocked", "M1006.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M1006.aggregateBoundary");
  exact(boundary.operationCount, 14, "M1006.aggregateBoundary.operationCount");
  exact(boundary.countsChanged, false, "M1006.aggregateBoundary.countsChanged");
  exact(boundary.stage11PartialClauses, 4, "M1006.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M1006.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M1006.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M1006.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M1006.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.handlerClassifierAggregateAttachmentsBefore, 9, "M1006.aggregateBoundary.handlerClassifierAggregateAttachmentsBefore");
  exact(boundary.handlerClassifierAggregateAttachmentsAfter, 9, "M1006.aggregateBoundary.handlerClassifierAggregateAttachmentsAfter");
  exact(boundary.semanticAggregateAttachments, 9, "M1006.aggregateBoundary.semanticAggregateAttachments");
  exact(boundary.currentAuthority, "PARTIAL", "M1006.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M1006.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M1006.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M1008 in-memory add-Scene aggregate evidence");
  const expectedKeys = [
    "activeSceneSelected", "addedSceneAppended", "aggregateAttachment", "aggregateAuthority", "assetPreservation", "bindingStatus", "byteHashRotation", "currentAuthority", "evidenceLabel", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "nonPersistencePreserved", "operation", "operationCount", "operationCountChanged", "orderedSceneSetPreserved", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sceneSetIdentityChanged", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1008 in-memory add-Scene aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M1008.schemaVersion");
  exact(value.milestone, "M1008", "M1008.milestone");
  exact(value.sourceMilestone, "M1006", "M1008.sourceMilestone");
  exact(value.evidenceLabel, "local", "M1008.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M1008.sourceReceipt");
  exact(value.producer, "project.add-scene.commit-in-memory", "M1008.producer");
  exact(value.operation, "project.add-scene.commit-in-memory.redo", "M1008.operation");
  exact(value.handler, "bridgeProjectAddSceneInMemoryRedoToTerminalHistory", "M1008.handler");
  exact(value.rereadClassifier, "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema", "M1008.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M1008.bindingStatus");
  for (const field of ["matchedRereadRequired", "orderedSceneSetPreserved", "addedSceneAppended", "activeSceneSelected", "assetPreservation", "nonPersistencePreserved", "sceneSetIdentityChanged"] as const) exact(value[field], true, `M1008.${field}`);
  exact(value.byteHashRotation, "not-claimed", "M1008.byteHashRotation");
  exact(value.sourceInvocation, false, "M1008.sourceInvocation");
  exact(value.rereadInvocation, false, "M1008.rereadInvocation");
  exact(value.operationCount, 14, "M1008.operationCount");
  exact(value.operationCountChanged, false, "M1008.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M1008.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M1008.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M1008.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M1008.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1008.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1008.stage12Started");
  exact(value.readyClaim, false, "M1008.readyClaim");
  return value as ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M1008",
    sourceMilestone: "M1006",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.add-scene.commit-in-memory",
    operation: "project.add-scene.commit-in-memory.redo",
    handler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory",
    rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    orderedSceneSetPreserved: true,
    addedSceneAppended: true,
    activeSceneSelected: true,
    assetPreservation: true,
    nonPersistencePreserved: true,
    sceneSetIdentityChanged: true,
    byteHashRotation: "not-claimed",
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

export const projectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
