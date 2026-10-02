export const PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const SOURCE_RECEIPT = "outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json" as const;

export type ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M995";
  sourceMilestone: "M993";
  evidenceLabel: "local";
  sourceReceipt: typeof SOURCE_RECEIPT;
  producer: "project.asset.register-audio";
  operation: "project.asset.register-audio.redo";
  handler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory";
  rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema";
  bindingStatus: "bound-operation-specific";
  matchedRereadRequired: true;
  audioAssetIdentityPreserved: true;
  approvedAudioRegistrationPreserved: true;
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

export class ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateSourceReceipt(input: unknown): void {
  const source = record(input, "M993 source receipt");
  exact(source.milestone, "M993", "M993.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.REGISTER-AUDIO REDO HANDLER/CLASSIFIER EVIDENCE; STAGE 11 NOT ACCEPTED", "M993.status");
  const implementation = record(source.implementation, "M993.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-stage11-project-audio-asset-redo-handler-classifier-evidence.ts", "M993.implementation.source");
  exact(implementation.operation, "project.asset.register-audio.redo", "M993.implementation.operation");
  exact(implementation.commandKind, "project.asset.register-audio", "M993.implementation.commandKind");
  exact(implementation.redoHandler, "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory", "M993.implementation.redoHandler");
  exact(implementation.redoClassifier, "projectAudioAssetRedoTerminalHistoryReceiptSchema", "M993.implementation.redoClassifier");
  exact(implementation.bindingStatus, "bound-operation-specific", "M993.implementation.bindingStatus");
  exact(implementation.rereadStatus, "matched", "M993.implementation.rereadStatus");
  exact(implementation.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M993.implementation.rereadRequirement");
  for (const field of ["exactTargetRequired", "generationAndHashRequired", "audioAssetIdentityPreserved", "approvedAudioRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(implementation[field], true, `M993.implementation.${field}`);
  exact(implementation.byteHashAndEnvelopeEvidence, "source-receipt-only", "M993.implementation.byteHashAndEnvelopeEvidence");
  exact(implementation.transitionInvocation, "not-invoked", "M993.implementation.transitionInvocation");
  exact(implementation.rereadInvocation, "not-invoked", "M993.implementation.rereadInvocation");
  const safety = record(source.safety, "M993.safety");
  exact(safety.noTransitionAuthority, true, "M993.safety.noTransitionAuthority");
  exact(safety.executionAuthority, "none", "M993.safety.executionAuthority");
  exact(safety.foreignStateMutation, "none", "M993.safety.foreignStateMutation");
  exact(safety.liveBehavior, "unproven", "M993.safety.liveBehavior");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(safety[field], true, `M993.safety.${field}`);
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(safety[field], false, `M993.safety.${field}`);
  exact(safety.stage11AcceptanceStatus, "blocked", "M993.safety.stage11AcceptanceStatus");
  const boundary = record(source.aggregateBoundary, "M993.aggregateBoundary");
  exact(boundary.operationCount, 14, "M993.aggregateBoundary.operationCount");
  exact(boundary.operationCountChanged, false, "M993.aggregateBoundary.operationCountChanged");
  exact(boundary.stage11PartialClauses, 4, "M993.aggregateBoundary.stage11PartialClauses");
  exact(boundary.producerFamilies, 11, "M993.aggregateBoundary.producerFamilies");
  exact(boundary.directProjections, 16, "M993.aggregateBoundary.directProjections");
  exact(boundary.stage11MatrixRedoBindings, 8, "M993.aggregateBoundary.stage11MatrixRedoBindings");
  exact(boundary.aggregateDirectStrands, 9, "M993.aggregateBoundary.aggregateDirectStrands");
  exact(boundary.handlerClassifierAggregateAttachments, 6, "M993.aggregateBoundary.handlerClassifierAggregateAttachments");
  exact(boundary.semanticAggregateAttachments, 9, "M993.aggregateBoundary.semanticAggregateAttachments");
  exact(boundary.currentAuthority, "PARTIAL", "M993.aggregateBoundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M993.aggregateBoundary.aggregateAuthority");
  exact(boundary.runtime, "PARKED", "M993.aggregateBoundary.runtime");
}

function parseEvidence(input: unknown): ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence {
  const value = record(input, "M995 audio asset aggregate evidence");
  const expectedKeys = [
    "aggregateAttachment", "aggregateAuthority", "approvedAudioRegistrationPreserved", "assetTreePreserved", "audioAssetIdentityPreserved", "bindingStatus", "byteHashAndEnvelopeEvidence", "contentHashChanged", "currentAuthority", "evidenceLabel", "envelopeRotated", "generationAdvanced", "handler", "matchedRereadRequired", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "operationCount", "operationCountChanged", "producer", "readOnly", "readyClaim", "rereadClassifier", "rereadInvocation", "schemaVersion", "scenePreserved", "sourceInvocation", "sourceMilestone", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M995 audio asset aggregate evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M995.schemaVersion");
  exact(value.milestone, "M995", "M995.milestone");
  exact(value.sourceMilestone, "M993", "M995.sourceMilestone");
  exact(value.evidenceLabel, "local", "M995.evidenceLabel");
  exact(value.sourceReceipt, SOURCE_RECEIPT, "M995.sourceReceipt");
  exact(value.producer, "project.asset.register-audio", "M995.producer");
  exact(value.operation, "project.asset.register-audio.redo", "M995.operation");
  exact(value.handler, "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory", "M995.handler");
  exact(value.rereadClassifier, "projectAudioAssetRedoTerminalHistoryReceiptSchema", "M995.rereadClassifier");
  exact(value.bindingStatus, "bound-operation-specific", "M995.bindingStatus");
  for (const field of ["matchedRereadRequired", "audioAssetIdentityPreserved", "approvedAudioRegistrationPreserved", "assetTreePreserved", "scenePreserved", "generationAdvanced", "contentHashChanged", "envelopeRotated"] as const) exact(value[field], true, `M995.${field}`);
  exact(value.byteHashAndEnvelopeEvidence, "source-receipt-only", "M995.byteHashAndEnvelopeEvidence");
  exact(value.sourceInvocation, false, "M995.sourceInvocation");
  exact(value.rereadInvocation, false, "M995.rereadInvocation");
  exact(value.operationCount, 14, "M995.operationCount");
  exact(value.operationCountChanged, false, "M995.operationCountChanged");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M995.aggregateAttachment");
  exact(value.currentAuthority, "partial", "M995.currentAuthority");
  exact(value.aggregateAuthority, "not-granted", "M995.aggregateAuthority");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation"] as const) exact(value[field], true, `M995.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M995.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M995.stage12Started");
  exact(value.readyClaim, false, "M995.readyClaim");
  return value as ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence;
}

export function createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence(input: unknown): ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence {
  validateSourceReceipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M995",
    sourceMilestone: "M993",
    evidenceLabel: "local",
    sourceReceipt: SOURCE_RECEIPT,
    producer: "project.asset.register-audio",
    operation: "project.asset.register-audio.redo",
    handler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory",
    rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
    bindingStatus: "bound-operation-specific",
    matchedRereadRequired: true,
    audioAssetIdentityPreserved: true,
    approvedAudioRegistrationPreserved: true,
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

export const projectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError
        ? error
        : new ProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
