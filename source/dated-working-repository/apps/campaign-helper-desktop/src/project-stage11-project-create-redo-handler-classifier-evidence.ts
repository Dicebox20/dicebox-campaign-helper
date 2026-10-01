import {
  bridgeProjectCreateRedoToTerminalHistory,
  projectCreateRedoTerminalHistoryReceiptSchema,
} from "./project-create-terminal-history";

export const PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M778_BRIDGE_RECEIPT = "outputs/m778-stage11-project-create-redo-terminal-history-bridge-closure-receipt.json" as const;
const M904_SEMANTIC_RECEIPT = "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json" as const;
const M929_AGGREGATE_SEMANTIC_RECEIPT = "outputs/m929-stage11-create-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectCreateRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.create";
  operation: "dicebox.project.create.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectCreateRedoToTerminalHistory";
  matchedRereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  targetIdentityPreserved: true;
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  generationAdvanced: true;
  firstGenerationContentIdentityPreserved: true;
  scenesPreserved: true;
  assetCollectionPreserved: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m778RedoBridge: "preserved-out-of-scope";
  m904SemanticEvidence: "preserved-out-of-scope";
  m929AggregateSemanticEvidence: "preserved-out-of-scope";
  byteHashRotation: "not-claimed";
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
  source: "project-create-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-project-create-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.create",
  operation: "dicebox.project.create.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectCreateRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectCreateRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectCreateRedoHandlerClassifierEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function includes(value: unknown, expected: string, label: string): void {
  if (typeof value !== "string" || !value.includes(expected)) blocked(`${label} must contain ${expected}.`);
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) blocked(`${label} contains unknown or missing fields.`);
}

function validateM778BridgeReceipt(input: unknown): void {
  const source = record(input, "M778 bridge receipt");
  exact(source.milestone, "M778", "M778.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY; STAGE 11 NOT ACCEPTED", "M778.status");
  const sources = record(source.sources, "M778.sources");
  exact(sources.bridge, "apps/campaign-helper-desktop/src/project-create-terminal-history.ts", "M778.sources.bridge");
  exact(sources.test, "tests/project-create-terminal-history.test.ts", "M778.sources.test");
  includes(source.result, "pure bridge accepts only a canonical redone project.create proposal history", "M778.result");
  includes(source.result, "matched post-redo reread", "M778.result");
  includes(source.result, "fails closed", "M778.result");
  const authority = record(source.authority, "M778.authority");
  exact(authority.target, "local-project", "M778.authority.target");
  exact(authority.apply, "operation-specific", "M778.authority.apply");
  exact(authority.aggregate, "not-granted", "M778.authority.aggregate");
  exact(authority.execution, "not-implemented", "M778.authority.execution");
  exact(authority.transitionInvocation, "not-invoked", "M778.authority.transitionInvocation");
  exact(authority.rereadInvocation, "not-invoked", "M778.authority.rereadInvocation");
  exact(authority.genericExecutor, false, "M778.authority.genericExecutor");
  const preservation = record(source.preservation, "M778.preservation");
  for (const field of ["projectOrFixtureWrite", "browserOrRuntimeAction", "foundryWrite", "accountOrPasswordAction", "providerOrCredentialAction", "stage11Accepted", "stage12Started"] as const) exact(preservation[field], false, `M778.preservation.${field}`);
}

function validateM904SemanticReceipt(input: unknown): void {
  const source = record(input, "M904 semantic receipt");
  exact(source.milestone, "M904", "M904.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M904.status");
  const evidence = record(source.evidence, "M904.evidence");
  exact(evidence.operation, "project.create.redo", "M904.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.create.redo", "M904.evidence.strictProducerReceipt");
  includes(evidence.targetIdentity, "exact targetProjectId preserved", "M904.evidence.targetIdentity");
  for (const field of ["targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "scenesIdentityPreserved", "assetCollectionIdentityPreserved", "matchedReread"] as const) exact(evidence[field], true, `M904.evidence.${field}`);
  const historyTransitions = evidence.historyTransitions;
  if (!Array.isArray(historyTransitions) || historyTransitions.join("|") !== "preview|approve|begin-apply|commit-after-reread|undo|redo") blocked("M904.evidence.historyTransitions must retain the exact create redo lifecycle.");
  includes(evidence.byteLevelEnvelopeRotation, "NOT_CLAIMED", "M904.evidence.byteLevelEnvelopeRotation");
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M904.evidence.backupPromotion");
  const boundary = record(source.boundary, "M904.boundary");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved", "providerOrCredentialActivity", "playerPasswordsGenerated", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "stage12Started", "readyClaim"] as const) exact(boundary[field], field === "providerOrCredentialActivity" || field === "playerPasswordsGenerated" || field === "aggregateSemanticAttachment" || field === "aggregateCountsChanged" || field === "runtimeLaneReopened" || field === "stage12Started" || field === "readyClaim" ? false : true, `M904.boundary.${field}`);
  exact(boundary.stage11AcceptanceStatus, "blocked", "M904.boundary.stage11AcceptanceStatus");
  const reconciliation = record(source.reconciliation, "M904.reconciliation");
  exact(reconciliation.producerFamilies, 11, "M904.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M904.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M904.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M904.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M904.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAuthority, "PARTIAL", "M904.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M904.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M904.reconciliation.countScopePreserved");
}

function validateM929AggregateSemanticReceipt(input: unknown): void {
  const source = record(input, "M929 aggregate semantic receipt");
  exact(source.milestone, "M929", "M929.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M929.status");
  const evidence = record(source.evidence, "M929.evidence");
  exact(evidence.sourceMilestone, "M904", "M929.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, M904_SEMANTIC_RECEIPT, "M929.evidence.sourceReceipt");
  exact(evidence.operation, "project.create.redo", "M929.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M929.evidence.semantic");
  for (const field of ["targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "matchedReread", "scenesPreserved", "assetCollectionPreserved"] as const) exact(evidence[field], true, `M929.evidence.${field}`);
  includes(evidence.byteHashRotation, "NOT_CLAIMED", "M929.evidence.byteHashRotation");
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M929.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M929.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "countsChanged", "stage12Started", "readyClaim"] as const) exact(boundary[field], field === "runtimeLaneReopened" || field === "providerOrCredentialActivity" || field === "playerPasswordsGenerated" || field === "countsChanged" || field === "stage12Started" || field === "readyClaim" ? false : true, `M929.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M929.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M929.boundary.stage11AcceptanceStatus");
}

function validateSources(input: unknown): void {
  const value = record(input, "M984 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt", "aggregateSemanticReceipt"], "M984 source bundle");
  validateM778BridgeReceipt(value.bridgeReceipt);
  validateM904SemanticReceipt(value.semanticReceipt);
  validateM929AggregateSemanticReceipt(value.aggregateSemanticReceipt);
}

export const TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectCreateRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.create",
  operation: "dicebox.project.create.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectCreateRedoToTerminalHistory",
  matchedRereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  exactTargetRequired: true,
  generationAndHashRequired: true,
  targetIdentityPreserved: true,
  targetAbsentBeforeRedo: true,
  targetPresentAfterRedo: true,
  generationAdvanced: true,
  firstGenerationContentIdentityPreserved: true,
  scenesPreserved: true,
  assetCollectionPreserved: true,
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m778RedoBridge: "preserved-out-of-scope",
  m904SemanticEvidence: "preserved-out-of-scope",
  m929AggregateSemanticEvidence: "preserved-out-of-scope",
  byteHashRotation: "not-claimed",
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
  source: "project-create-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-project-create-handler-classifier-binding",
  remainingGap: "Complete project.create proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectCreateRedoHandlerClassifierEvidence {
  const value = record(input, "M984 project.create handler/classifier evidence");
  exactKeys(value, Object.keys(TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!), "M984 project.create handler/classifier evidence");
  const expected = TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectCreateRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M984 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M984 evidence.remainingGap must be non-empty.");
  return value as ProjectCreateRedoHandlerClassifierEvidence;
}

export function createProjectCreateRedoHandlerClassifierEvidence(input: unknown): readonly ProjectCreateRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectCreateRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectCreateRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M984 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectCreateRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectCreateRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectCreateRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectCreateRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M984_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M778_BRIDGE_RECEIPT,
  semantic: M904_SEMANTIC_RECEIPT,
  aggregateSemantic: M929_AGGREGATE_SEMANTIC_RECEIPT,
  bridgeFunction: bridgeProjectCreateRedoToTerminalHistory,
  rereadClassifier: projectCreateRedoTerminalHistoryReceiptSchema,
});
