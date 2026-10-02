export const PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M912_RECEIPT = "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M914";
  sourceMilestone: "M912";
  evidenceLabel: "local";
  receipt: typeof M912_RECEIPT;
  operation: "project.add-scene.persist.redo";
  semantic: "redo-post-state";
  sceneAppended: true;
  orderedSceneSetPreserved: true;
  activeSceneSelected: true;
  generationAdvanced: true;
  semanticContentChanged: true;
  assetCountPreserved: true;
  assetTreePreserved: true;
  byteEnvelopeRotated: true;
  matchedReread: true;
  driftRejected: "project/Scene-order/active-Scene drift";
  producerScopedOnly: true;
  aggregateAttachment: "one-producer-scoped-non-certifying";
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  aggregateAuthority: "not-granted";
  countsChanged: false;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError(message);
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

function exactStrings(value: unknown, expected: readonly string[], label: string): void {
  if (!Array.isArray(value) || value.length !== expected.length || value.some((item, index) => item !== expected[index])) blocked(`${label} must match the exact approved list.`);
}

function validateM912Receipt(input: unknown): void {
  const receipt = record(input, "M914 M912 closure receipt");
  exactKeys(receipt, ["artifacts", "boundary", "doesNotProve", "evidence", "evidenceClass", "inputs", "milestone", "next", "reconciliation", "scope", "stage", "status", "validation"], "M914 M912 closure receipt");
  exact(receipt.milestone, "M912", "M914 M912 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M914 M912 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M914 M912 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M914 M912 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.add-scene.persist redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M914 M912 closure receipt.scope");
  exactStrings(receipt.inputs, [
    "apps/campaign-helper-desktop/src/project-add-scene-terminal-history.ts",
    "tests/project-add-scene-terminal-history.test.ts",
    "apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-semantic-redo-evidence.ts",
    "tests/project-stage11-persistent-add-scene-semantic-redo-evidence.test.ts",
    "outputs/m911-stage11-post-save-as-semantic-redo-reconciliation-receipt.json",
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "database/dicebox_campaign_helper_knowledge.sqlite",
  ], "M914 M912 closure receipt.inputs");

  const evidence = record(receipt.evidence, "M914 M912 closure receipt.evidence");
  exactKeys(evidence, ["activeSceneSelected", "assetCountPreserved", "assetTreePreserved", "backupPromotion", "byteEnvelopeRotated", "driftRejected", "generationAdvanced", "matchedReread", "operation", "orderedSceneSetPreserved", "sceneAppended", "semanticContentChanged", "strictProducerReceipt"], "M914 M912 closure receipt.evidence");
  exact(evidence.operation, "project.add-scene.persist.redo", "M914 M912 closure receipt.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.add-scene.persist.redo", "M914 M912 closure receipt.evidence.strictProducerReceipt");
  for (const field of ["sceneAppended", "orderedSceneSetPreserved", "activeSceneSelected", "generationAdvanced", "semanticContentChanged", "assetCountPreserved", "assetTreePreserved", "byteEnvelopeRotated", "matchedReread"] as const) exact(evidence[field], true, `M914 M912 closure receipt.evidence.${field}`);
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M914 M912 closure receipt.evidence.backupPromotion");
  exactStrings(evidence.driftRejected, ["project/Scene-order/active-Scene drift", "content/asset-tree drift", "byte-envelope drift", "matched-reread drift", "authority drift"], "M914 M912 closure receipt.evidence.driftRejected");

  const boundary = record(receipt.boundary, "M914 M912 closure receipt.boundary");
  exactKeys(boundary, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "playerPasswordsGenerated", "projectContentWrite", "projectPersistenceWrite", "providerOrCredentialActivity", "readOnly", "readyClaim", "runtimeLaneReopened", "sceneContentRestored", "semanticEvidence", "stage11AcceptanceStatus", "stage12Started"], "M914 M912 closure receipt.boundary");
  exact(boundary.semanticEvidence, "typed producer-scoped local evidence", "M914 M912 closure receipt.boundary.semanticEvidence");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M914 M912 closure receipt.boundary.${field}`);
  for (const field of ["projectContentWrite", "projectPersistenceWrite", "sceneContentRestored", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started"] as const) exact(boundary[field], false, `M914 M912 closure receipt.boundary.${field}`);
  exact(boundary.readyClaim, false, "M914 M912 closure receipt.boundary.readyClaim");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M914 M912 closure receipt.boundary.stage11AcceptanceStatus");

  const reconciliation = record(receipt.reconciliation, "M914 M912 closure receipt.reconciliation");
  exactKeys(reconciliation, ["acceptanceClauses", "aggregateDirectStrands", "aggregateAuthority", "countScopeNote", "countScopePreserved", "currentAggregateAuthorityIndexedRedoBindingEntries", "currentAggregateAuthorityIndexedRedoBindings", "currentAuthority", "directProjections", "modeledOperations", "producerFamilies", "stage11MatrixRedoBindings"], "M914 M912 closure receipt.reconciliation");
  const clauses = record(reconciliation.acceptanceClauses, "M914 M912 closure receipt.reconciliation.acceptanceClauses");
  exactKeys(clauses, ["approval", "history", "proposal", "recovery"], "M914 M912 closure receipt.reconciliation.acceptanceClauses");
  for (const field of ["approval", "history", "proposal", "recovery"] as const) exact(clauses[field], "PARTIAL", `M914 M912 closure receipt.reconciliation.acceptanceClauses.${field}`);
  exact(reconciliation.producerFamilies, 11, "M914 M912 closure receipt.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M914 M912 closure receipt.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M914 M912 closure receipt.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M914 M912 closure receipt.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M914 M912 closure receipt.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M914 M912 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
  exactStrings(reconciliation.currentAggregateAuthorityIndexedRedoBindingEntries, ["project.create", "project.save", "project.rename", "project.add-scene.persist", "project.asset.bind", "project.asset.register-audio", "project.asset.register-handout", "project.asset.register-token", "project.add-scene.commit-in-memory"], "M914 M912 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindingEntries");
  exact(reconciliation.currentAuthority, "PARTIAL", "M914 M912 closure receipt.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M914 M912 closure receipt.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M914 M912 closure receipt.reconciliation.countScopePreserved");
}

export function createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence {
  validateM912Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M914",
    sourceMilestone: "M912",
    evidenceLabel: "local",
    receipt: M912_RECEIPT,
    operation: "project.add-scene.persist.redo",
    semantic: "redo-post-state",
    sceneAppended: true,
    orderedSceneSetPreserved: true,
    activeSceneSelected: true,
    generationAdvanced: true,
    semanticContentChanged: true,
    assetCountPreserved: true,
    assetTreePreserved: true,
    byteEnvelopeRotated: true,
    matchedReread: true,
    driftRejected: "project/Scene-order/active-Scene drift",
    producerScopedOnly: true,
    aggregateAttachment: "one-producer-scoped-non-certifying",
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    aggregateAuthority: "not-granted",
    countsChanged: false,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}

function parseEvidence(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence {
  const value = record(input, "M914 persistent add-Scene semantic-redo aggregate evidence");
  exactKeys(value, ["activeSceneSelected", "aggregateAttachment", "aggregateAuthority", "assetCountPreserved", "assetTreePreserved", "byteEnvelopeRotated", "countsChanged", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "orderedSceneSetPreserved", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "sceneAppended", "schemaVersion", "semantic", "semanticContentChanged", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M914 aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M914 aggregate evidence.schemaVersion");
  exact(value.milestone, "M914", "M914 aggregate evidence.milestone");
  exact(value.sourceMilestone, "M912", "M914 aggregate evidence.sourceMilestone");
  exact(value.evidenceLabel, "local", "M914 aggregate evidence.evidenceLabel");
  exact(value.receipt, M912_RECEIPT, "M914 aggregate evidence.receipt");
  exact(value.operation, "project.add-scene.persist.redo", "M914 aggregate evidence.operation");
  exact(value.semantic, "redo-post-state", "M914 aggregate evidence.semantic");
  exact(value.driftRejected, "project/Scene-order/active-Scene drift", "M914 aggregate evidence.driftRejected");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M914 aggregate evidence.aggregateAttachment");
  exact(value.aggregateAuthority, "not-granted", "M914 aggregate evidence.aggregateAuthority");
  for (const field of ["sceneAppended", "orderedSceneSetPreserved", "activeSceneSelected", "generationAdvanced", "semanticContentChanged", "assetCountPreserved", "assetTreePreserved", "byteEnvelopeRotated", "matchedReread", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M914 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M914 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M914 aggregate evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M914 aggregate evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M914 aggregate evidence.stage12Started");
  return value as ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence;
}

export const projectStage11PersistentAddSceneSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11PersistentAddSceneSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
