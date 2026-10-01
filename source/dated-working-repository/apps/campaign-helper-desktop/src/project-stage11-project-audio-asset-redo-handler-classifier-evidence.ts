import {
  bridgeProjectAudioAssetRegistrationRedoToTerminalHistory,
  projectAudioAssetRedoTerminalHistoryReceiptSchema,
} from "./project-audio-asset-terminal-history";

export const PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M760_BRIDGE_RECEIPT = "outputs/m760-stage11-project-audio-asset-register-redo-terminal-history-bridge-closure-receipt.json" as const;
const M896_SEMANTIC_RECEIPT = "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json" as const;
const M916_AGGREGATE_SEMANTIC_RECEIPT = "outputs/m916-stage11-audio-asset-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectAudioAssetRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.asset.register-audio";
  operation: "dicebox.project.asset.register-audio.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory";
  matchedRereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  audioAssetIdentityPreserved: true;
  approvedAudioRegistrationPreserved: true;
  assetTreePreserved: true;
  scenePreserved: true;
  generationAdvanced: true;
  contentHashChanged: true;
  envelopeRotated: true;
  byteHashAndEnvelopeEvidence: "source-receipt-only";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m760BridgeEvidence: "preserved-out-of-scope";
  m896SemanticEvidence: "preserved-out-of-scope";
  m916AggregateSemanticEvidence: "preserved-out-of-scope";
  noTransitionAuthority: true;
  executionAuthority: "none";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
  noProjectMutation: true;
  stage11Ready: false;
  stage12Started: false;
  readyClaim: false;
  source: "project-audio-asset-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-project-audio-asset-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.asset.register-audio",
  operation: "dicebox.project.asset.register-audio.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM760BridgeReceipt(input: unknown): void {
  const source = record(input, "M760 bridge receipt");
  exact(source.milestone, "M760", "M760.milestone");
  exact(source.stage, "proposal-approval-history", "M760.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.REGISTER-AUDIO REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M760.status");
  exact(source.scope, "Add one disjoint project.asset.register-audio-only read-only redo terminal-history receipt bridge and matched-reread classifier for undone-to-redo-to-redone.", "M760.scope");
  const implementation = record(source.implementation, "M760.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.ts", "M760.implementation.source");
  exact(implementation.classifier, "projectAudioAssetRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output and requires matched post-redo target/revision/hash evidence.", "M760.implementation.classifier");
  const acceptance = record(source.acceptance, "M760.acceptance");
  exact(acceptance.stage12, "NOT STARTED", "M760.acceptance.stage12");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M760.acceptance.stage11");
}

function validateM896SemanticReceipt(input: unknown): void {
  const source = record(input, "M896 semantic receipt");
  exact(source.milestone, "M896", "M896.milestone");
  exact(source.stage, "proposal-approval-history", "M896.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M896.status");
  exact(source.evidenceClass, "local", "M896.evidenceClass");
  const composition = record(source.composition, "M896.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.ts", "M896.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-audio-asset-semantic-redo-evidence.ts", "M896.composition.semanticLayer");
  exact(composition.fixture, "tests/project-audio-asset-semantic-redo-fixtures.ts", "M896.composition.fixture");
  exact(composition.operation, "project.asset.register-audio.redo", "M896.composition.operation");
  exact(composition.semantic, "redo-post-state", "M896.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "approvedAudioRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M896.composition.${field}`);
  exact(composition.driftRejected, "audio-asset/content/Scene/envelope/readback identity drift", "M896.composition.driftRejected");
  const safety = record(source.safety, "M896.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M896.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M896.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M896.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M896.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M896.safety.stage12Started");
}

function validateM916AggregateSemanticReceipt(input: unknown): void {
  const source = record(input, "M916 aggregate semantic receipt");
  exact(source.milestone, "M916", "M916.milestone");
  exact(source.stage, "proposal-approval-history", "M916.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M916.status");
  const evidence = record(source.evidence, "M916.evidence");
  exact(evidence.sourceMilestone, "M896", "M916.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, M896_SEMANTIC_RECEIPT, "M916.evidence.sourceReceipt");
  exact(evidence.operation, "project.asset.register-audio.redo", "M916.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M916.evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "approvedAudioRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(evidence[field], true, `M916.evidence.${field}`);
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M916.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M916.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M916.boundary.${field}`);
  for (const field of ["countsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M916.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M916.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M916.boundary.stage11AcceptanceStatus");
}

function validateSources(input: unknown): void {
  const value = record(input, "M993 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt", "aggregateSemanticReceipt"], "M993 source bundle");
  validateM760BridgeReceipt(value.bridgeReceipt);
  validateM896SemanticReceipt(value.semanticReceipt);
  validateM916AggregateSemanticReceipt(value.aggregateSemanticReceipt);
}

export const TYPED_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectAudioAssetRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.asset.register-audio",
  operation: "dicebox.project.asset.register-audio.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory",
  matchedRereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  exactTargetRequired: true,
  generationAndHashRequired: true,
  audioAssetIdentityPreserved: true,
  approvedAudioRegistrationPreserved: true,
  assetTreePreserved: true,
  scenePreserved: true,
  generationAdvanced: true,
  contentHashChanged: true,
  envelopeRotated: true,
  byteHashAndEnvelopeEvidence: "source-receipt-only",
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m760BridgeEvidence: "preserved-out-of-scope",
  m896SemanticEvidence: "preserved-out-of-scope",
  m916AggregateSemanticEvidence: "preserved-out-of-scope",
  noTransitionAuthority: true,
  executionAuthority: "none",
  foreignStateMutation: "none",
  liveBehavior: "unproven",
  readOnly: true,
  nonCertifying: true,
  noExecutionAuthority: true,
  noGenericExecutor: true,
  noProjectMutation: true,
  stage11Ready: false,
  stage12Started: false,
  readyClaim: false,
  source: "project-audio-asset-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-project-audio-asset-handler-classifier-binding",
  remainingGap: "Complete audio-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectAudioAssetRedoHandlerClassifierEvidence {
  const value = record(input, "M993 project.audio-asset handler/classifier evidence");
  exactKeys(value, Object.keys(TYPED_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!), "M993 project.audio-asset handler/classifier evidence");
  const expected = TYPED_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectAudioAssetRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M993 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M993 evidence.remainingGap must be non-empty.");
  return value as ProjectAudioAssetRedoHandlerClassifierEvidence;
}

export function createProjectAudioAssetRedoHandlerClassifierEvidence(input: unknown): readonly ProjectAudioAssetRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectAudioAssetRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectAudioAssetRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M993 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectAudioAssetRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectAudioAssetRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M993_PROJECT_AUDIO_ASSET_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M760_BRIDGE_RECEIPT,
  semantic: M896_SEMANTIC_RECEIPT,
  aggregateSemantic: M916_AGGREGATE_SEMANTIC_RECEIPT,
  bridgeFunction: bridgeProjectAudioAssetRegistrationRedoToTerminalHistory,
  rereadClassifier: projectAudioAssetRedoTerminalHistoryReceiptSchema,
});
