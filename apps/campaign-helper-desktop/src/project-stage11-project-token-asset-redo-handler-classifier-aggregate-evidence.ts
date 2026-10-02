export const PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m997-stage11-project-token-asset-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M999";
  sourceMilestone: "M997";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.asset.register-token";
  operation: "project.asset.register-token.redo";
  handler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory";
  rereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  tokenAssetIdentityPreserved: true;
  contentAddressedTokenRegistrationPreserved: true;
  assetTreePreserved: true;
  scenePreserved: true;
  generationAdvanced: true;
  contentHashChanged: true;
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

export class ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M997 source receipt");
  exact(source.milestone, "M997", "M997.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.REGISTER-TOKEN REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M997.status");
  const implementation = record(source.implementation, "M997.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-token-asset-redo-handler-classifier-evidence.ts", "M997.implementation.source");
  exact(implementation.operation, "project.asset.register-token.redo", "M997.implementation.operation");
  exact(implementation.commandKind, "project.asset.register-token", "M997.implementation.commandKind");
  exact(implementation.redoHandler, "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory", "M997.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectTokenAssetRedoTerminalHistoryReceiptSchema", "M997.implementation.redoClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M997.implementation.bindingStatus");
  exact(implementation.rereadStatus, "matched", "M997.implementation.rereadStatus");
  exact(implementation.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M997.implementation.rereadRequirement");
  for (const field of ["exactTargetRequired", "generationAndHashRequired", "tokenAssetIdentityPreserved", "contentAddressedTokenRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(implementation[field], true, `M997.implementation.${field}`);
  exact(implementation.byteHashAndEnvelopeEvidence, "source-receipt-only", "M997.implementation.byteHashAndEnvelopeEvidence");
  exact(implementation.transitionInvocation, "not-invoked", "M997.implementation.transitionInvocation");
  exact(implementation.rereadInvocation, "not-invoked", "M997.implementation.rereadInvocation");
  const safety = record(source.safety, "M997.safety");
  exact(safety.noTransitionAuthority, true, "M997.safety.noTransitionAuthority");
  exact(safety.executionAuthority, "none", "M997.safety.executionAuthority");
  exact(safety.foreignStateMutation, "none", "M997.safety.foreignStateMutation");
  exact(safety.liveBehavior, "unproven", "M997.safety.liveBehavior");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(safety[field], true, `M997.safety.${field}`);
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(safety[field], false, `M997.safety.${field}`);
  exact(safety.stage11AcceptanceStatus, "blocked", "M997.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M997.aggregateBoundary");
  exact(boundary.operationCount, 14, "M997.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M997.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M997.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M997.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M997.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M997.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M997.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.handlerClassifierAggregateAttachments, 7, "M997.aggregateBoundary.handlerClassifierAggregateAttachments");
  exact(boundary.semanticAggregateAttachments, 9, "M997.aggregateBoundary.semanticAggregateAttachments");
  exact(boundary.currentAuthority, "PARTIAL", "M997.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M997.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M997.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M999 token asset aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "assetTreePreserved", "bindingStatus", "byteHashAndEnvelopeEvidence", "contentAddressedTokenRegistrationPreserved", "contentHashChanged", "currentAuthority", "evidenceLabel", "envelopeRotated", "generationAdvanced", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "scenePreserved", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "tokenAssetIdentityPreserved",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M999 token asset aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M999.schemaVersion");
  exact(value.milestone, "M999", "M999.milestone");
  exact(value.sourceMilestone, "M997", "M999.sourceMilestone");
  exact(value.evidenceLabel, "local", "M999.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M999.sourceReceipt");
  exact(value.producer, "project.asset.register-token", "M999.producer");
  exact(value.operation, "project.asset.register-token.redo", "M999.operation");
  exact(value.handler, "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory", "M999.handler");
  exact(value.rereadClassifier, "projectTokenAssetRedoTerminalHistoryReceiptSchema", "M999.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M999.bindingStatus");
  for (const field of ["matchedRereadRequired", "tokenAssetIdentityPreserved", "contentAddressedTokenRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(value[field], true, `M999.${field}`);
  exact(value.byteHashAndEnvelopeEvidence, "source-receipt-only", "M999.byteHashAndEnvelopeEvidence");
  exact(value.sourceInvocation, false, "M999.sourceInvocation");
  exact(value.rereadInvocation, false, "M999.rereadInvocation");
  exact(value.operationCount, 14, "M999.operationCount");
  exact(value.operationCountChanged, false, "M999.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M999.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M999.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M999.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M999.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M999.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M999.stage12Started");
  exact(value.readyClaim, false, "M999.readyClaim");
  return value as ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M999",
    sourceMilestone: "M997",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.asset.register-token",
    operation: "project.asset.register-token.redo",
    handler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory",
    rereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    tokenAssetIdentityPreserved: true,
    contentAddressedTokenRegistrationPreserved: true,
    assetTreePreserved: true,
    scenePreserved: true,
    generationAdvanced: true,
    contentHashChanged: true,
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

export const projectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
