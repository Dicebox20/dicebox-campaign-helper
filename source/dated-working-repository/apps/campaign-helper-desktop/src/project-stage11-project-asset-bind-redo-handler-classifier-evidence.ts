import {
  bridgeProjectAssetBindingRedoToTerminalHistory,
  projectAssetBindingRedoTerminalHistoryReceiptSchema,
} from "./project-asset-binding-terminal-history";

export const PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M758_BRIDGE_RECEIPT = "outputs/m758-stage11-project-asset-bind-redo-terminal-history-bridge-closure-receipt.json" as const;
const M908_SEMANTIC_RECEIPT = "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json" as const;
const M923_AGGREGATE_SEMANTIC_RECEIPT = "outputs/m923-stage11-asset-bind-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectAssetBindRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.asset.bind";
  operation: "dicebox.project.asset.bind.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectAssetBindingRedoToTerminalHistory";
  matchedRereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  assetDescriptorPreserved: true;
  contentAddressedAssetIdentityPreserved: true;
  bindingTransitionPreserved: true;
  assetTreePreserved: true;
  assetBytesNonPersistentOnRedo: true;
  generationAdvanced: true;
  assetCountPreserved: true;
  sceneCollectionPreserved: true;
  activeScenePreserved: true;
  semanticContentChanged: true;
  envelopeRotated: true;
  byteHashAndEnvelopeEvidence: "source-receipt-only";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m758BridgeEvidence: "preserved-out-of-scope";
  m908SemanticEvidence: "preserved-out-of-scope";
  m923AggregateSemanticEvidence: "preserved-out-of-scope";
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
  source: "project-asset-binding-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-project-asset-bind-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.asset.bind",
  operation: "project.asset.bind.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectAssetBindRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAssetBindRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAssetBindRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM758BridgeReceipt(input: unknown): void {
  const source = record(input, "M758 bridge receipt");
  exact(source.milestone, "M758", "M758.milestone");
  exact(source.stage, "proposal-approval-history", "M758.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ASSET.BIND REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M758.status");
  exact(source.scope, "Add one disjoint project.asset.bind-only read-only redo terminal-history receipt bridge and matched-reread classifier for undone-to-redo-to-redone.", "M758.scope");
  const implementation = record(source.implementation, "M758.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-asset-binding-terminal-history.ts", "M758.implementation.source");
  exact(implementation.classifier, "projectAssetBindingRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output and requires matched post-redo target/revision/hash evidence.", "M758.implementation.classifier");
  const acceptance = record(source.acceptance, "M758.acceptance");
  exact(acceptance.stage12, "NOT STARTED", "M758.acceptance.stage12");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M758.acceptance.stage11");
}

function validateM908SemanticReceipt(input: unknown): void {
  const source = record(input, "M908 semantic receipt");
  exact(source.milestone, "M908", "M908.milestone");
  exact(source.stage, "proposal-approval-history", "M908.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M908.status");
  exact(source.evidenceClass, "local", "M908.evidenceClass");
  exact(source.scope, "Compose the existing strict project.asset.bind redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M908.scope");
  const evidence = record(source.evidence, "M908.evidence");
  exact(evidence.operation, "project.asset.bind.redo", "M908.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.asset.bind.redo", "M908.evidence.strictProducerReceipt");
  for (const field of ["assetDescriptorPreserved", "contentAddressedAssetIdentity", "bindingTransitionPreserved", "matchedBeforeAndAfterRedoRereads", "generationAdvanced", "assetCountPreserved", "SceneCollectionPreserved", "activeScenePreserved", "assetTreePreserved", "assetBytesNonPersistentOnRedo", "semanticContentChanged", "byteEnvelopeRotated"] as const) exact(evidence[field], true, `M908.evidence.${field}`);
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M908.evidence.backupPromotion");
  const boundary = record(source.boundary, "M908.boundary");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M908.boundary.${field}`);
  for (const field of ["projectContentWrite", "assetBytesPersisted", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M908.boundary.${field}`);
  exact(boundary.stage11AcceptanceStatus, "blocked", "M908.boundary.stage11AcceptanceStatus");
}

function validateM923AggregateSemanticReceipt(input: unknown): void {
  const source = record(input, "M923 aggregate semantic receipt");
  exact(source.milestone, "M923", "M923.milestone");
  exact(source.stage, "proposal-approval-history", "M923.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M923.status");
  exact(source.scope, "Attach the exact M908 asset-bind project.asset.bind semantic-redo closure receipt to the Stage 11 aggregate ledger as one strict typed, non-certifying producer-scoped field without changing modeled counts or authority.", "M923.scope");
  const evidence = record(source.evidence, "M923.evidence");
  exact(evidence.sourceMilestone, "M908", "M923.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, M908_SEMANTIC_RECEIPT, "M923.evidence.sourceReceipt");
  exact(evidence.operation, "project.asset.bind.redo", "M923.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M923.evidence.semantic");
  for (const field of ["assetDescriptorPreserved", "contentAddressedAssetIdentityPreserved", "bindingTransitionPreserved", "matchedReread", "generationAdvanced", "assetCountPreserved", "sceneCollectionPreserved", "activeScenePreserved", "assetTreePreserved", "assetBytesNonPersistentOnRedo", "semanticContentChanged", "envelopeRotated"] as const) exact(evidence[field], true, `M923.evidence.${field}`);
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M923.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M923.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M923.boundary.${field}`);
  for (const field of ["countsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M923.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M923.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M923.boundary.stage11AcceptanceStatus");
}

function validateSources(input: unknown): void {
  const value = record(input, "M1001 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt", "aggregateSemanticReceipt"], "M1001 source bundle");
  validateM758BridgeReceipt(value.bridgeReceipt);
  validateM908SemanticReceipt(value.semanticReceipt);
  validateM923AggregateSemanticReceipt(value.aggregateSemanticReceipt);
}

export const TYPED_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectAssetBindRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.asset.bind",
  operation: "dicebox.project.asset.bind.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectAssetBindingRedoToTerminalHistory",
  matchedRereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  exactTargetRequired: true,
  generationAndHashRequired: true,
  assetDescriptorPreserved: true,
  contentAddressedAssetIdentityPreserved: true,
  bindingTransitionPreserved: true,
  assetTreePreserved: true,
  assetBytesNonPersistentOnRedo: true,
  generationAdvanced: true,
  assetCountPreserved: true,
  sceneCollectionPreserved: true,
  activeScenePreserved: true,
  semanticContentChanged: true,
  envelopeRotated: true,
  byteHashAndEnvelopeEvidence: "source-receipt-only",
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m758BridgeEvidence: "preserved-out-of-scope",
  m908SemanticEvidence: "preserved-out-of-scope",
  m923AggregateSemanticEvidence: "preserved-out-of-scope",
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
  source: "project-asset-binding-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-project-asset-bind-handler-classifier-binding",
  remainingGap: "Complete asset-bind proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectAssetBindRedoHandlerClassifierEvidence {
  const value = record(input, "M1001 project.asset-bind handler/classifier evidence");
  exactKeys(value, Object.keys(TYPED_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!), "M1001 project.asset-bind handler/classifier evidence");
  const expected = TYPED_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectAssetBindRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M1001 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M1001 evidence.remainingGap must be non-empty.");
  return value as ProjectAssetBindRedoHandlerClassifierEvidence;
}

export function createProjectAssetBindRedoHandlerClassifierEvidence(input: unknown): readonly ProjectAssetBindRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectAssetBindRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectAssetBindRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M1001 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectAssetBindRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectAssetBindRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAssetBindRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectAssetBindRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M1001_PROJECT_ASSET_BIND_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M758_BRIDGE_RECEIPT,
  semantic: M908_SEMANTIC_RECEIPT,
  aggregateSemantic: M923_AGGREGATE_SEMANTIC_RECEIPT,
  bridgeFunction: bridgeProjectAssetBindingRedoToTerminalHistory,
  rereadClassifier: projectAssetBindingRedoTerminalHistoryReceiptSchema,
});
