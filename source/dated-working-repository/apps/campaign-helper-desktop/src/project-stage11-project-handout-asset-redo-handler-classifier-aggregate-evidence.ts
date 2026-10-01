export const PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m989-stage11-project-handout-asset-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M991";
  sourceMilestone: "M989";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.asset.register-handout";
  operation: "project.asset.register-handout.redo";
  handler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory";
  rereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  handoutAssetIdentityPreserved: true;
  contentAddressedRegistrationPreserved: true;
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

export class ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M989 source receipt");
  exact(source.milestone, "M989", "M989.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.REGISTER-HANDOUT REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M989.status");
  const implementation = record(source.implementation, "M989.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-handout-asset-redo-handler-classifier-evidence.ts", "M989.implementation.source");
  exact(implementation.operation, "project.asset.register-handout.redo", "M989.implementation.operation");
  exact(implementation.commandKind, "project.asset.register-handout", "M989.implementation.commandKind");
  exact(implementation.redoHandler, "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory", "M989.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectHandoutAssetRedoTerminalHistoryReceiptSchema", "M989.implementation.redoClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M989.implementation.bindingStatus");
  exact(implementation.rereadStatus, "matched", "M989.implementation.rereadStatus");
  exact(implementation.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M989.implementation.rereadRequirement");
  for (const field of ["exactTargetRequired", "generationAndHashRequired", "handoutAssetIdentityPreserved", "contentAddressedRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(implementation[field], true, `M989.implementation.${field}`);
  exact(implementation.byteHashAndEnvelopeEvidence, "source-receipt-only", "M989.implementation.byteHashAndEnvelopeEvidence");
  exact(implementation.transitionInvocation, "not-invoked", "M989.implementation.transitionInvocation");
  exact(implementation.rereadInvocation, "not-invoked", "M989.implementation.rereadInvocation");
  const safety = record(source.safety, "M989.safety");
  exact(safety.noTransitionAuthority, true, "M989.safety.noTransitionAuthority");
  exact(safety.executionAuthority, "none", "M989.safety.executionAuthority");
  exact(safety.foreignStateMutation, "none", "M989.safety.foreignStateMutation");
  exact(safety.liveBehavior, "unproven", "M989.safety.liveBehavior");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(safety[field], true, `M989.safety.${field}`);
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(safety[field], false, `M989.safety.${field}`);
  exact(safety.stage11AcceptanceStatus, "blocked", "M989.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M989.aggregateBoundary");
  exact(boundary.operationCount, 14, "M989.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M989.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M989.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M989.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M989.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M989.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M989.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.handlerClassifierAggregateAttachments, 5, "M989.aggregateBoundary.handlerClassifierAggregateAttachments");
  exact(boundary.semanticAggregateAttachments, 9, "M989.aggregateBoundary.semanticAggregateAttachments");
  exact(boundary.currentAuthority, "PARTIAL", "M989.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M989.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M989.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M991 handout asset aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "assetTreePreserved", "bindingStatus", "byteHashAndEnvelopeEvidence", "contentAddressedRegistrationPreserved", "contentHashChanged", "currentAuthority", "evidenceLabel", "envelopeRotated", "generationAdvanced", "handoutAssetIdentityPreserved", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "scenePreserved", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M991 handout asset aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M991.schemaVersion");
  exact(value.milestone, "M991", "M991.milestone");
  exact(value.sourceMilestone, "M989", "M991.sourceMilestone");
  exact(value.evidenceLabel, "local", "M991.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M991.sourceReceipt");
  exact(value.producer, "project.asset.register-handout", "M991.producer");
  exact(value.operation, "project.asset.register-handout.redo", "M991.operation");
  exact(value.handler, "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory", "M991.handler");
  exact(value.rereadClassifier, "projectHandoutAssetRedoTerminalHistoryReceiptSchema", "M991.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M991.bindingStatus");
  for (const field of ["matchedRereadRequired", "handoutAssetIdentityPreserved", "contentAddressedRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(value[field], true, `M991.${field}`);
  exact(value.byteHashAndEnvelopeEvidence, "source-receipt-only", "M991.byteHashAndEnvelopeEvidence");
  exact(value.sourceInvocation, false, "M991.sourceInvocation");
  exact(value.rereadInvocation, false, "M991.rereadInvocation");
  exact(value.operationCount, 14, "M991.operationCount");
  exact(value.operationCountChanged, false, "M991.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M991.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M991.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M991.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M991.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M991.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M991.stage12Started");
  exact(value.readyClaim, false, "M991.readyClaim");
  return value as ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M991",
    sourceMilestone: "M989",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.asset.register-handout",
    operation: "project.asset.register-handout.redo",
    handler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory",
    rereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    handoutAssetIdentityPreserved: true,
    contentAddressedRegistrationPreserved: true,
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

export const projectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
