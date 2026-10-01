import {
  bridgeProjectTokenAssetRegistrationRedoToTerminalHistory,
  projectTokenAssetRedoTerminalHistoryReceiptSchema,
} from "./project-token-asset-terminal-history";

export const PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M764_BRIDGE_RECEIPT = "outputs/m764-stage11-project-token-asset-register-redo-terminal-history-bridge-closure-receipt.json" as const;
const M900_SEMANTIC_RECEIPT = "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json" as const;
const M920_AGGREGATE_SEMANTIC_RECEIPT = "outputs/m920-stage11-token-asset-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectTokenAssetRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.asset.register-token";
  operation: "dicebox.project.asset.register-token.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory";
  matchedRereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  tokenAssetIdentityPreserved: true;
  contentAddressedTokenRegistrationPreserved: true;
  assetTreePreserved: true;
  scenePreserved: true;
  generationAdvanced: true;
  contentHashChanged: true;
  envelopeRotated: true;
  byteHashAndEnvelopeEvidence: "source-receipt-only";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m764BridgeEvidence: "preserved-out-of-scope";
  m900SemanticEvidence: "preserved-out-of-scope";
  m920AggregateSemanticEvidence: "preserved-out-of-scope";
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
  source: "project-token-asset-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-project-token-asset-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.asset.register-token",
  operation: "dicebox.project.asset.register-token.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM764BridgeReceipt(input: unknown): void {
  const source = record(input, "M764 bridge receipt");
  exact(source.milestone, "M764", "M764.milestone");
  exact(source.stage, "proposal-approval-history", "M764.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.REGISTER-TOKEN REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M764.status");
  exact(source.scope, "Add one disjoint project.asset.register-token-only read-only redo terminal-history receipt bridge and matched-reread classifier for undone-to-redo-to-redone.", "M764.scope");
  const implementation = record(source.implementation, "M764.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-token-asset-terminal-history.ts", "M764.implementation.source");
  exact(implementation.classifier, "projectTokenAssetRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output and requires matched post-redo target/revision/hash evidence.", "M764.implementation.classifier");
  const acceptance = record(source.acceptance, "M764.acceptance");
  exact(acceptance.stage12, "NOT STARTED", "M764.acceptance.stage12");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M764.acceptance.stage11");
}

function validateM900SemanticReceipt(input: unknown): void {
  const source = record(input, "M900 semantic receipt");
  exact(source.milestone, "M900", "M900.milestone");
  exact(source.stage, "proposal-approval-history", "M900.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M900.status");
  exact(source.evidenceClass, "local", "M900.evidenceClass");
  const composition = record(source.composition, "M900.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-token-asset-terminal-history.ts", "M900.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-token-asset-semantic-redo-evidence.ts", "M900.composition.semanticLayer");
  exact(composition.fixture, "tests/project-stage11-token-asset-semantic-redo-evidence.test.ts", "M900.composition.fixture");
  exact(composition.operation, "project.asset.register-token.redo", "M900.composition.operation");
  exact(composition.semantic, "redo-post-state", "M900.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M900.composition.${field}`);
  exact(composition.driftRejected, "token-asset/content/Scene/envelope/readback identity drift", "M900.composition.driftRejected");
  const safety = record(source.safety, "M900.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M900.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M900.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M900.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M900.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M900.safety.stage12Started");
}

function validateM920AggregateSemanticReceipt(input: unknown): void {
  const source = record(input, "M920 aggregate semantic receipt");
  exact(source.milestone, "M920", "M920.milestone");
  exact(source.stage, "proposal-approval-history", "M920.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M920.status");
  const evidence = record(source.evidence, "M920.evidence");
  exact(evidence.sourceMilestone, "M900", "M920.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, M900_SEMANTIC_RECEIPT, "M920.evidence.sourceReceipt");
  exact(evidence.operation, "project.asset.register-token.redo", "M920.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M920.evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(evidence[field], true, `M920.evidence.${field}`);
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M920.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M920.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M920.boundary.${field}`);
  for (const field of ["countsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M920.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M920.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M920.boundary.stage11AcceptanceStatus");
}

function validateSources(input: unknown): void {
  const value = record(input, "M997 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt", "aggregateSemanticReceipt"], "M997 source bundle");
  validateM764BridgeReceipt(value.bridgeReceipt);
  validateM900SemanticReceipt(value.semanticReceipt);
  validateM920AggregateSemanticReceipt(value.aggregateSemanticReceipt);
}

export const TYPED_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectTokenAssetRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.asset.register-token",
  operation: "dicebox.project.asset.register-token.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory",
  matchedRereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  exactTargetRequired: true,
  generationAndHashRequired: true,
  tokenAssetIdentityPreserved: true,
  contentAddressedTokenRegistrationPreserved: true,
  assetTreePreserved: true,
  scenePreserved: true,
  generationAdvanced: true,
  contentHashChanged: true,
  envelopeRotated: true,
  byteHashAndEnvelopeEvidence: "source-receipt-only",
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m764BridgeEvidence: "preserved-out-of-scope",
  m900SemanticEvidence: "preserved-out-of-scope",
  m920AggregateSemanticEvidence: "preserved-out-of-scope",
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
  source: "project-token-asset-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-project-token-asset-handler-classifier-binding",
  remainingGap: "Complete token-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectTokenAssetRedoHandlerClassifierEvidence {
  const value = record(input, "M997 project.token-asset handler/classifier evidence");
  exactKeys(value, Object.keys(TYPED_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!), "M997 project.token-asset handler/classifier evidence");
  const expected = TYPED_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectTokenAssetRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M997 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M997 evidence.remainingGap must be non-empty.");
  return value as ProjectTokenAssetRedoHandlerClassifierEvidence;
}

export function createProjectTokenAssetRedoHandlerClassifierEvidence(input: unknown): readonly ProjectTokenAssetRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectTokenAssetRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectTokenAssetRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M997 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectTokenAssetRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectTokenAssetRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M997_PROJECT_TOKEN_ASSET_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M764_BRIDGE_RECEIPT,
  semantic: M900_SEMANTIC_RECEIPT,
  aggregateSemantic: M920_AGGREGATE_SEMANTIC_RECEIPT,
  bridgeFunction: bridgeProjectTokenAssetRegistrationRedoToTerminalHistory,
  rereadClassifier: projectTokenAssetRedoTerminalHistoryReceiptSchema,
});
