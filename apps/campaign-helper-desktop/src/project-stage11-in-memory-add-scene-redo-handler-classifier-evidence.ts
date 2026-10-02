export const PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M766_BRIDGE_RECEIPT = "outputs/m766-stage11-project-add-scene-in-memory-redo-terminal-history-bridge-closure-receipt.json" as const;
const M931_SEMANTIC_AGGREGATE_RECEIPT = "outputs/m931-stage11-in-memory-add-scene-semantic-redo-aggregate-attachment-closure-receipt.json" as const;

export type ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: "project.add-scene.commit-in-memory";
  operation: "dicebox.project.add-scene.commit-in-memory.redo";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  sourceStatus: "undone";
  transition: "redo";
  destinationStatus: "redone";
  redoHandler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory";
  matchedRereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema";
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  orderedSceneSetPreserved: true;
  addedSceneAppended: true;
  activeSceneSelected: true;
  assetPreservation: true;
  nonPersistencePreserved: true;
  sceneSetIdentityChanged: true;
  byteHashRotation: "not-claimed";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m766BridgeEvidence: "preserved-out-of-scope";
  m931SemanticAggregateEvidence: "preserved-out-of-scope";
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
  source: "project-add-scene-in-memory-terminal-history-and-stage11-semantic-redo-contract";
  evidenceStatus: "bounded-in-memory-add-scene-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = Object.freeze({
  evidenceCount: 1,
  commandKind: "project.add-scene.commit-in-memory",
  operation: "project.add-scene.commit-in-memory.redo",
  status: "read-only · non-certifying · no execution or transition authority",
});

export class ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function validateM766BridgeReceipt(input: unknown): void {
  const source = record(input, "M766 bridge receipt");
  exact(source.milestone, "M766", "M766.milestone");
  exact(source.stage, "proposal-approval-history", "M766.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ADD-SCENE.COMMIT-IN-MEMORY REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M766.status");
  exact(source.scope, "Add one disjoint project.add-scene.commit-in-memory-only read-only redo terminal-history receipt bridge and matched-reread classifier for undone-to-redo-to-redone.", "M766.scope");
  const implementation = record(source.implementation, "M766.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history.ts", "M766.implementation.source");
  exact(implementation.bridge, "bridgeProjectAddSceneInMemoryRedoToTerminalHistory validates one project.add-scene.commit-in-memory-only undone-to-redo-to-redone receipt, exact ordered Scene-set and active-Scene transition, non-persistence/no-write semantics, asset preservation, and the six-receipt history.", "M766.implementation.bridge");
  exact(implementation.classifier, "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output and requires matched post-redo target/revision/hash evidence.", "M766.implementation.classifier");
  const acceptance = record(source.acceptance, "M766.acceptance");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M766.acceptance.stage11");
  exact(acceptance.stage12, "NOT STARTED", "M766.acceptance.stage12");
}

function validateM931SemanticAggregateReceipt(input: unknown): void {
  const source = record(input, "M931 semantic aggregate receipt");
  exact(source.milestone, "M931", "M931.milestone");
  exact(source.stage, "proposal-approval-history", "M931.stage");
  exact(source.status, "PASS LOCAL CODE-ONLY AGGREGATE ATTACHMENT; STAGE 11 NOT ACCEPTED", "M931.status");
  exact(source.evidenceClass, "local", "M931.evidenceClass");
  const evidence = record(source.evidence, "M931.evidence");
  exact(evidence.sourceMilestone, "M906", "M931.evidence.sourceMilestone");
  exact(evidence.sourceReceipt, "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json", "M931.evidence.sourceReceipt");
  exact(evidence.operation, "project.add-scene.commit-in-memory.redo", "M931.evidence.operation");
  exact(evidence.semantic, "redo-post-state", "M931.evidence.semantic");
  for (const field of ["exactProjectIdentity", "matchedBeforeAndAfterRedoRereads", "laterInMemoryRevision", "orderedSceneSetPreserved", "addedSceneAppended", "activeSceneSelected", "assetPreservation", "nonPersistencePreserved", "sceneSetIdentityChanged"] as const) exact(evidence[field], true, `M931.evidence.${field}`);
  exact(evidence.byteHashRotation, "NOT_CLAIMED; in-memory add-Scene evidence is non-persistent and the bridge exposes no byte-hash rotation contract", "M931.evidence.byteHashRotation");
  exact(evidence.aggregateAttachment, "one-producer-scoped-non-certifying", "M931.evidence.aggregateAttachment");
  const boundary = record(source.boundary, "M931.boundary");
  for (const field of ["producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M931.boundary.${field}`);
  for (const field of ["countsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started", "readyClaim"] as const) exact(boundary[field], false, `M931.boundary.${field}`);
  exact(boundary.aggregateAuthority, "not-granted", "M931.boundary.aggregateAuthority");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M931.boundary.stage11AcceptanceStatus");
  const reconciliation = record(source.reconciliation, "M931.reconciliation");
  exact(reconciliation.producerFamilies, 11, "M931.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M931.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M931.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M931.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M931.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M931.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
}

function validateSources(input: unknown): void {
  const value = record(input, "M1006 source bundle");
  const keys = Object.keys(value).sort();
  if (keys.join(",") !== "bridgeReceipt,semanticAggregateReceipt") blocked("M1006 source bundle contains unknown or missing fields.");
  validateM766BridgeReceipt(value.bridgeReceipt);
  validateM931SemanticAggregateReceipt(value.semanticAggregateReceipt);
}

export const TYPED_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence[] = Object.freeze([Object.freeze({
  schemaVersion: PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: "project.add-scene.commit-in-memory",
  operation: "dicebox.project.add-scene.commit-in-memory.redo",
  reviewAuthority: "human-review",
  targetAuthority: "local-project",
  applyAuthority: "operation-specific",
  operationAuthority: "not-granted",
  sourceStatus: "undone",
  transition: "redo",
  destinationStatus: "redone",
  redoHandler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory",
  matchedRereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
  handlerBindingStatus: "bound-operation-specific",
  rereadStatus: "matched",
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
  orderedSceneSetPreserved: true,
  addedSceneAppended: true,
  activeSceneSelected: true,
  assetPreservation: true,
  nonPersistencePreserved: true,
  sceneSetIdentityChanged: true,
  byteHashRotation: "not-claimed",
  transitionInvocation: "not-invoked",
  rereadInvocation: "not-invoked",
  m766BridgeEvidence: "preserved-out-of-scope",
  m931SemanticAggregateEvidence: "preserved-out-of-scope",
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
  source: "project-add-scene-in-memory-terminal-history-and-stage11-semantic-redo-contract",
  evidenceStatus: "bounded-in-memory-add-scene-handler-classifier-binding",
  remainingGap: "Complete in-memory add-Scene proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
})]);

function parseEvidence(input: unknown): ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence {
  const value = record(input, "M1006 in-memory add-Scene handler/classifier evidence");
  const expectedKeys = Object.keys(TYPED_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!).sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1006 in-memory add-Scene handler/classifier evidence contains unknown or missing fields.");
  const expected = TYPED_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]!;
  for (const key of Object.keys(expected) as (keyof ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence)[]) {
    if (key === "remainingGap") continue;
    exact(value[key], expected[key] as string | number | boolean, `M1006 evidence.${key}`);
  }
  if (typeof value.remainingGap !== "string" || value.remainingGap.length === 0) blocked("M1006 evidence.remainingGap must be non-empty.");
  return value as ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence;
}

export function createInMemoryAddSceneRedoHandlerClassifierEvidence(input: unknown): readonly ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const inMemoryAddSceneRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence[] {
    if (!Array.isArray(input) || input.length !== 1) blocked("M1006 evidence must contain exactly one redo projection.");
    return Object.freeze(input.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectStage11InMemoryAddSceneRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M1006_IN_MEMORY_ADD_SCENE_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M766_BRIDGE_RECEIPT,
  semanticAggregate: M931_SEMANTIC_AGGREGATE_RECEIPT,
});
