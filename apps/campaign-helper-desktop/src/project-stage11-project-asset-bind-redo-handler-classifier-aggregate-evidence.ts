export const PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M1003";
  sourceMilestone: "M1001";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.asset.bind";
  operation: "project.asset.bind.redo";
  handler: "bridgeProjectAssetBindingRedoToTerminalHistory";
  rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  assetDescriptorPreserved: true;
  contentAddressedAssetIdentityPreserved: true;
  bindingTransitionPreserved: true;
  assetTreePreserved: true;
  sceneCollectionPreserved: true;
  activeScenePreserved: true;
  generationAdvanced: true;
  assetCountPreserved: true;
  semanticContentChanged: true;
  envelopeRotated: true;
  byteHashAndEnvelopeEvidence: "source-receipt-only";
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

export class ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M1001 source receipt");
  exact(source.milestone, "M1001", "M1001.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.BIND REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M1001.status");
  const implementation = record(source.implementation, "M1001.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-asset-bind-redo-handler-classifier-evidence.ts", "M1001.implementation.source");
  exact(implementation.operation, "project.asset.bind.redo", "M1001.implementation.operation");
  exact(implementation.commandKind, "project.asset.bind", "M1001.implementation.commandKind");
  exact(implementation.handler, "bridgeProjectAssetBindingRedoToTerminalHistory", "M1001.implementation.handler");
  exact(implementation.rereadClassifier, "projectAssetBindingRedoTerminalHistoryReceiptSchema", "M1001.implementation.rereadClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M1001.implementation.bindingStatus");
  exact(implementation.matchedRereadRequired, true, "M1001.implementation.matchedRereadRequired");
  for (const field of ["assetDescriptorPreserved", "contentAddressedAssetIdentityPreserved", "bindingTransitionPreserved", "assetTreePreserved", "sceneCollectionPreserved", "activeScenePreserved", "generationAdvanced", "assetCountPreserved", "semanticContentChanged", "envelopeRotated"] as const) exact(implementation[field], true, `M1001.implementation.${field}`);
  exact(implementation.byteHashAndEnvelopeEvidence, "source-receipt-only", "M1001.implementation.byteHashAndEnvelopeEvidence");
  exact(implementation.sourceInvocation, false, "M1001.implementation.sourceInvocation");
  exact(implementation.rereadInvocation, false, "M1001.implementation.rereadInvocation");
  const safety = record(source.safety, "M1001.safety");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(safety[field], true, `M1001.safety.${field}`);
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(safety[field], false, `M1001.safety.${field}`);
  exact(safety.stage11AcceptanceStatus, "blocked", "M1001.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M1001.aggregateBoundary");
  exact(boundary.operationCount, 14, "M1001.aggregateBoundary.operationCount");
  exact(boundary.countsChanged, false, "M1001.aggregateBoundary.countsChanged");
  exact(boundary.stage11PartialClauses, 4, "M1001.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M1001.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M1001.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M1001.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M1001.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.handlerClassifierAggregateAttachmentsBefore, 8, "M1001.aggregateBoundary.handlerClassifierAggregateAttachmentsBefore");
  exact(boundary.handlerClassifierAggregateAttachmentsAfter, 8, "M1001.aggregateBoundary.handlerClassifierAggregateAttachmentsAfter");
  exact(boundary.semanticAggregateAttachments, 9, "M1001.aggregateBoundary.semanticAggregateAttachments");
  exact(boundary.currentAuthority, "PARTIAL", "M1001.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M1001.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M1001.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M1003 asset-bind aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "assetCountPreserved", "assetDescriptorPreserved", "assetTreePreserved", "bindingStatus", "bindingTransitionPreserved", "byteHashAndEnvelopeEvidence", "contentAddressedAssetIdentityPreserved", "currentAuthority", "evidenceLabel", "envelopeRotated", "generationAdvanced", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "sceneCollectionPreserved", "semanticContentChanged", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1003 asset-bind aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M1003.schemaVersion");
  exact(value.milestone, "M1003", "M1003.milestone");
  exact(value.sourceMilestone, "M1001", "M1003.sourceMilestone");
  exact(value.evidenceLabel, "local", "M1003.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M1003.sourceReceipt");
  exact(value.producer, "project.asset.bind", "M1003.producer");
  exact(value.operation, "project.asset.bind.redo", "M1003.operation");
  exact(value.handler, "bridgeProjectAssetBindingRedoToTerminalHistory", "M1003.handler");
  exact(value.rereadClassifier, "projectAssetBindingRedoTerminalHistoryReceiptSchema", "M1003.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M1003.bindingStatus");
  for (const field of ["matchedRereadRequired", "assetDescriptorPreserved", "contentAddressedAssetIdentityPreserved", "bindingTransitionPreserved", "assetTreePreserved", "sceneCollectionPreserved", "activeScenePreserved", "generationAdvanced", "assetCountPreserved", "semanticContentChanged", "envelopeRotated"] as const) exact(value[field], true, `M1003.${field}`);
  exact(value.byteHashAndEnvelopeEvidence, "source-receipt-only", "M1003.byteHashAndEnvelopeEvidence");
  exact(value.sourceInvocation, false, "M1003.sourceInvocation");
  exact(value.rereadInvocation, false, "M1003.rereadInvocation");
  exact(value.operationCount, 14, "M1003.operationCount");
  exact(value.operationCountChanged, false, "M1003.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M1003.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M1003.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M1003.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M1003.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1003.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1003.stage12Started");
  exact(value.readyClaim, false, "M1003.readyClaim");
  return value as ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M1003",
    sourceMilestone: "M1001",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.asset.bind",
    operation: "project.asset.bind.redo",
    handler: "bridgeProjectAssetBindingRedoToTerminalHistory",
    rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    assetDescriptorPreserved: true,
    contentAddressedAssetIdentityPreserved: true,
    bindingTransitionPreserved: true,
    assetTreePreserved: true,
    sceneCollectionPreserved: true,
    activeScenePreserved: true,
    generationAdvanced: true,
    assetCountPreserved: true,
    semanticContentChanged: true,
    envelopeRotated: true,
    byteHashAndEnvelopeEvidence: "source-receipt-only",
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

export const projectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
