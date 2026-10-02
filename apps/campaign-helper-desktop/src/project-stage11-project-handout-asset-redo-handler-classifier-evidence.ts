import {
  bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory,
  projectHandoutAssetRedoTerminalHistoryReceiptSchema,
} from "./project-handout-asset-terminal-history";

export const PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M725_BRIDGE_RECEIPT = "outputs/m725-stage11-project-handout-asset-terminal-history-bridge-receipt.json" as const;
const M898_SEMANTIC_RECEIPT = "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json" as const;
const M918_AGGREGATE_SEMANTIC_RECEIPT = "outputs/m918-stage11-handout-asset-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectHandoutAssetRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.asset.register-handout";
  operation: "dicebox.project.asset.register-handout.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory";
  matchedRereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  handoutAssetIdentityPreserved: true;
  contentAddressedRegistrationPreserved: true;
  assetTreePreserved: true;
  scenePreserved: true;
  generationAdvanced: true;
  contentHashChanged: true;
  envelopeRotated: true;
  byteHashAndEnvelopeEvidence: "source-receipt-only";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m725BridgeEvidence: "preserved-out-of-scope";
  m898SemanticEvidence: "preserved-out-of-scope";
  m918AggregateSemanticEvidence: "preserved-out-of-scope";
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
  source: "project-handout-asset-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-project-handout-asset-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.asset.register-handout",
  operation: "dicebox.project.asset.register-handout.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM725BridgeReceipt(input: unknown): void {
  const source = record(input, "M725 bridge receipt");
  exact(source.milestone, "M725", "M725.milestone");
  exact(source.stage, "proposal-approval-history", "M725.stage");
  exact(source.status, "PASS CODE-ONLY; STAGE 11 NOT ACCEPTED", "M725.status");
  exact(source.scope, "Bridge one existing operation-specific local-project project.asset.register-handout execution receipt into typed terminal history.", "M725.scope");
  const implementation = record(source.implementation, "M725.implementation");
  exact(implementation.entryPoint, "apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.ts:bridgeProjectHandoutAssetRegistrationExecutionToTerminalHistory", "M725.implementation.entryPoint");
  exact(implementation.schema, "projectHandoutAssetTerminalHistoryReceiptSchema.parse/safeParse", "M725.implementation.schema");
  exact(implementation.acceptedOperation, "dicebox.project.asset.register-handout.execute", "M725.implementation.acceptedOperation");
  const safety = record(source.safety, "M725.safety");
  exact(safety.bridgeOnly, true, "M725.safety.bridgeOnly");
  exact(safety.noExecutionAuthority, true, "M725.safety.noExecutionAuthority");
  exact(safety.noProjectMutation, true, "M725.safety.noProjectMutation");
  exact(safety.noGenericExecutor, true, "M725.safety.noGenericExecutor");
  exact(safety.foreignStatePreserved, true, "M725.safety.foreignStatePreserved");
  exact(safety.foundryAction, false, "M725.safety.foundryAction");
  exact(safety.runtimeMutation, false, "M725.safety.runtimeMutation");
  exact(safety.execution, "not-implemented", "M725.safety.execution");
  exact(safety.readyClaim, false, "M725.safety.readyClaim");
  exact(safety.stage11Acceptance, false, "M725.safety.stage11Acceptance");
  exact(safety.stage12Started, false, "M725.safety.stage12Started");
}

function validateM898SemanticReceipt(input: unknown): void {
  const source = record(input, "M898 semantic receipt");
  exact(source.milestone, "M898", "M898.milestone");
  exact(source.stage, "proposal-approval-history", "M898.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M898.status");
  exact(source.evidenceClass, "local", "M898.evidenceClass");
  const composition = record(source.composition, "M898.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.ts", "M898.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-handout-asset-semantic-redo-evidence.ts", "M898.composition.semanticLayer");
  exact(composition.fixture, "tests/project-handout-asset-semantic-redo-fixtures.ts", "M898.composition.fixture");
  exact(composition.operation, "project.asset.register-handout.redo", "M898.composition.operation");
  exact(composition.semantic, "redo-post-state", "M898.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M898.composition.${field}`);
  exact(composition.driftRejected, "handout-asset/content/Scene/envelope/readback identity drift", "M898.composition.driftRejected");
  const safety = record(source.safety, "M898.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M898.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M898.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M898.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M898.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M898.safety.stage12Started");
}

function validateM918AggregateSemanticReceipt(input: unknown): void {
  const source = record(input, "M918 aggregate semantic receipt");
  exact(source.milestone, "M918", "M918.milestone");
  exact(source.stage, "proposal-approval-history", "M918.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M918.status");
  const evidence = record(source.evidence, "M918.evidence");
  exact(evidence.sourceMilestone, "M898", "M918.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, M898_SEMANTIC_RECEIPT, "M918.evidence.sourceReceipt");
  exact(evidence.operation, "project.asset.register-handout.redo", "M918.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M918.evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(evidence[field], true, `M918.evidence.${field}`);
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M918.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M918.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M918.boundary.${field}`);
  for (const field of ["countsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M918.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M918.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M918.boundary.stage11AcceptanceStatus");
}

function validateSources(input: unknown): void {
  const value = record(input, "M989 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt", "aggregateSemanticReceipt"], "M989 source bundle");
  validateM725BridgeReceipt(value.bridgeReceipt);
  validateM898SemanticReceipt(value.semanticReceipt);
  validateM918AggregateSemanticReceipt(value.aggregateSemanticReceipt);
}

export const TYPED_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectHandoutAssetRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.asset.register-handout",
  operation: "dicebox.project.asset.register-handout.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory",
  matchedRereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  exactTargetRequired: true,
  generationAndHashRequired: true,
  handoutAssetIdentityPreserved: true,
  contentAddressedRegistrationPreserved: true,
  assetTreePreserved: true,
  scenePreserved: true,
  generationAdvanced: true,
  contentHashChanged: true,
  envelopeRotated: true,
  byteHashAndEnvelopeEvidence: "source-receipt-only",
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m725BridgeEvidence: "preserved-out-of-scope",
  m898SemanticEvidence: "preserved-out-of-scope",
  m918AggregateSemanticEvidence: "preserved-out-of-scope",
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
  source: "project-handout-asset-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-project-handout-asset-handler-classifier-binding",
  remainingGap: "Complete handout-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectHandoutAssetRedoHandlerClassifierEvidence {
  const value = record(input, "M989 project.handout-asset handler/classifier evidence");
  exactKeys(value, Object.keys(TYPED_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!), "M989 project.handout-asset handler/classifier evidence");
  const expected = TYPED_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectHandoutAssetRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M989 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M989 evidence.remainingGap must be non-empty.");
  return value as ProjectHandoutAssetRedoHandlerClassifierEvidence;
}

export function createProjectHandoutAssetRedoHandlerClassifierEvidence(input: unknown): readonly ProjectHandoutAssetRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectHandoutAssetRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectHandoutAssetRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M989 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectHandoutAssetRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectHandoutAssetRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M989_PROJECT_HANDOUT_ASSET_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M725_BRIDGE_RECEIPT,
  semantic: M898_SEMANTIC_RECEIPT,
  aggregateSemantic: M918_AGGREGATE_SEMANTIC_RECEIPT,
  bridgeFunction: bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory,
  rereadClassifier: projectHandoutAssetRedoTerminalHistoryReceiptSchema,
});
