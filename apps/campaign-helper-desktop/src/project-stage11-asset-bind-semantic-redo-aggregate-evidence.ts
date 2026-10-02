export const PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M908_RECEIPT = "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11AssetBindSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M923";
  sourceMilestone: "M908";
  evidenceLabel: "local";
  receipt: typeof M908_RECEIPT;
  operation: "project.asset.bind.redo";
  semantic: "redo-post-state";
  assetDescriptorPreserved: true;
  contentAddressedAssetIdentityPreserved: true;
  bindingTransitionPreserved: true;
  matchedReread: true;
  generationAdvanced: true;
  assetCountPreserved: true;
  sceneCollectionPreserved: true;
  activeScenePreserved: true;
  assetTreePreserved: true;
  assetBytesNonPersistentOnRedo: true;
  semanticContentChanged: true;
  envelopeRotated: true;
  driftRejected: "asset descriptor/binding/content/Scene/asset-tree/reread/authority drift";
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

export class ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_ASSET_BIND_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM908Receipt(input: unknown): void {
  const receipt = record(input, "M923 M908 closure receipt");
  exactKeys(receipt, ["artifacts", "boundary", "doesNotProve", "evidence", "evidenceClass", "inputs", "milestone", "next", "reconciliation", "scope", "stage", "status", "validation"], "M923 M908 closure receipt");
  exact(receipt.milestone, "M908", "M923 M908 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M923 M908 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M923 M908 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M923 M908 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.asset.bind redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M923 M908 closure receipt.scope");
  exact(receipt.next, "Perform only the authorized M909 post-asset-bind-semantic-redo read-only reconciliation against the complete Stage 11 matrix; retain all count scopes, authority locks, runtime parking, and Stage 11/Stage 12 non-certification.", "M923 M908 closure receipt.next");
  exactStrings(receipt.inputs, [
    "apps/campaign-helper-desktop/src/project-asset-binding-terminal-history.ts",
    "tests/project-asset-binding-terminal-history.test.ts",
    "apps/campaign-helper-desktop/src/project-stage11-asset-bind-semantic-redo-evidence.ts",
    "tests/project-stage11-asset-bind-semantic-redo-evidence.test.ts",
    "outputs/m907-stage11-post-in-memory-add-scene-semantic-redo-reconciliation-receipt.json",
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "database/dicebox_campaign_helper_knowledge.sqlite",
  ], "M923 M908 closure receipt.inputs");

  const evidence = record(receipt.evidence, "M923 M908 closure receipt.evidence");
  exactKeys(evidence, ["SceneCollectionPreserved", "activeScenePreserved", "assetBytesNonPersistentOnRedo", "assetCountPreserved", "assetDescriptorPreserved", "assetTreePreserved", "backupPromotion", "bindingTransitionPreserved", "byteEnvelopeRotated", "contentAddressedAssetIdentity", "driftRejected", "generationAdvanced", "historyTransitions", "matchedBeforeAndAfterRedoRereads", "operation", "semanticContentChanged", "strictProducerReceipt"], "M923 M908 closure receipt.evidence");
  exact(evidence.operation, "project.asset.bind.redo", "M923 M908 closure receipt.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.asset.bind.redo", "M923 M908 closure receipt.evidence.strictProducerReceipt");
  for (const field of ["assetDescriptorPreserved", "contentAddressedAssetIdentity", "bindingTransitionPreserved", "matchedBeforeAndAfterRedoRereads", "generationAdvanced", "assetCountPreserved", "SceneCollectionPreserved", "activeScenePreserved", "assetTreePreserved", "assetBytesNonPersistentOnRedo", "semanticContentChanged", "byteEnvelopeRotated"] as const) exact(evidence[field], true, `M923 M908 closure receipt.evidence.${field}`);
  exactStrings(evidence.historyTransitions, ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"], "M923 M908 closure receipt.evidence.historyTransitions");
  exactStrings(evidence.driftRejected, ["asset descriptor drift", "Scene binding transition drift", "semantic content/generation drift", "Scene/active-selection drift", "asset-tree drift", "matched-reread drift", "authority drift"], "M923 M908 closure receipt.evidence.driftRejected");
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M923 M908 closure receipt.evidence.backupPromotion");

  const boundary = record(receipt.boundary, "M923 M908 closure receipt.boundary");
  exactKeys(boundary, ["aggregateCountsChanged", "aggregateSemanticAttachment", "assetBytesPersisted", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "playerPasswordsGenerated", "projectContentWrite", "providerOrCredentialActivity", "readOnly", "readyClaim", "runtimeLaneReopened", "semanticEvidence", "stage11AcceptanceStatus", "stage12Started"], "M923 M908 closure receipt.boundary");
  exact(boundary.semanticEvidence, "typed producer-scoped local evidence", "M923 M908 closure receipt.boundary.semanticEvidence");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M923 M908 closure receipt.boundary.${field}`);
  for (const field of ["projectContentWrite", "assetBytesPersisted", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started"] as const) exact(boundary[field], false, `M923 M908 closure receipt.boundary.${field}`);
  exact(boundary.readyClaim, false, "M923 M908 closure receipt.boundary.readyClaim");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M923 M908 closure receipt.boundary.stage11AcceptanceStatus");

  const reconciliation = record(receipt.reconciliation, "M923 M908 closure receipt.reconciliation");
  exactKeys(reconciliation, ["acceptanceClauses", "aggregateAuthority", "aggregateDirectStrands", "countScopeNote", "countScopePreserved", "currentAggregateAuthorityIndexedRedoBindings", "currentAuthority", "directProjections", "modeledOperations", "producerFamilies", "stage11MatrixRedoBindings"], "M923 M908 closure receipt.reconciliation");
  const acceptanceClauses = record(reconciliation.acceptanceClauses, "M923 M908 closure receipt.reconciliation.acceptanceClauses");
  exactKeys(acceptanceClauses, ["approval", "history", "proposal", "recovery"], "M923 M908 closure receipt.reconciliation.acceptanceClauses");
  for (const field of ["approval", "history", "proposal", "recovery"] as const) exact(acceptanceClauses[field], "PARTIAL", `M923 M908 closure receipt.reconciliation.acceptanceClauses.${field}`);
  exact(reconciliation.producerFamilies, 11, "M923 M908 closure receipt.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M923 M908 closure receipt.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M923 M908 closure receipt.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M923 M908 closure receipt.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M923 M908 closure receipt.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M923 M908 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
  exact(reconciliation.currentAuthority, "PARTIAL", "M923 M908 closure receipt.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M923 M908 closure receipt.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M923 M908 closure receipt.reconciliation.countScopePreserved");
  exact(reconciliation.countScopeNote, "The Stage 11 matrix retains 8 redo bindings and the aggregate direct-strand field retains 9. The current aggregate-authority source/test separately indexes 9 redo entries, including the supplemental project.add-scene.commit-in-memory row; these are not collapsed into one measure.", "M923 M908 closure receipt.reconciliation.countScopeNote");

  const validation = record(receipt.validation, "M923 M908 closure receipt.validation");
  exactKeys(validation, ["databaseRebuildAndVerifyBeforeClosure", "diffCheck", "focusedEvidenceSuite", "fullRepositorySuite", "negativeCoverage", "packageTypeCheck", "relatedStage11EvidenceSuite", "workflowCheck"], "M923 M908 closure receipt.validation");
  exact(validation.focusedEvidenceSuite, "PASS: 2 files; 6 tests", "M923 M908 closure receipt.validation.focusedEvidenceSuite");
  exact(validation.relatedStage11EvidenceSuite, "PASS: 13 files; 38 tests", "M923 M908 closure receipt.validation.relatedStage11EvidenceSuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M923 M908 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheck, "PASS: score 63; 10/16 gates; activeStage proposal-approval-history; build lane only; failures 0; violations 0; readyClaim false", "M923 M908 closure receipt.validation.workflowCheck");
  exact(validation.fullRepositorySuite, "PASS: 206 files; 934 tests", "M923 M908 closure receipt.validation.fullRepositorySuite");
  exact(validation.databaseRebuildAndVerifyBeforeClosure, "PASS: sources 1377, facts 1161, decisions 1017, open items 135, trials 788, research subjects 40, milestones 26", "M923 M908 closure receipt.validation.databaseRebuildAndVerifyBeforeClosure");
  exact(validation.negativeCoverage, "PASS: descriptor, binding, content, Scene, asset-tree, matched-reread, and authority drift fail closed", "M923 M908 closure receipt.validation.negativeCoverage");
  exact(validation.diffCheck, "PASS: git diff --check after documentation and KB updates", "M923 M908 closure receipt.validation.diffCheck");

  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M923 M908 closure receipt.doesNotProve");
}

export function createProjectStage11AssetBindSemanticRedoAggregateEvidence(input: unknown): ProjectStage11AssetBindSemanticRedoAggregateEvidence {
  validateM908Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M923",
    sourceMilestone: "M908",
    evidenceLabel: "local",
    receipt: M908_RECEIPT,
    operation: "project.asset.bind.redo",
    semantic: "redo-post-state",
    assetDescriptorPreserved: true,
    contentAddressedAssetIdentityPreserved: true,
    bindingTransitionPreserved: true,
    matchedReread: true,
    generationAdvanced: true,
    assetCountPreserved: true,
    sceneCollectionPreserved: true,
    activeScenePreserved: true,
    assetTreePreserved: true,
    assetBytesNonPersistentOnRedo: true,
    semanticContentChanged: true,
    envelopeRotated: true,
    driftRejected: "asset descriptor/binding/content/Scene/asset-tree/reread/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11AssetBindSemanticRedoAggregateEvidence {
  const value = record(input, "M923 asset-bind semantic-redo aggregate evidence");
  exactKeys(value, ["activeScenePreserved", "aggregateAttachment", "aggregateAuthority", "assetBytesNonPersistentOnRedo", "assetCountPreserved", "assetDescriptorPreserved", "assetTreePreserved", "bindingTransitionPreserved", "contentAddressedAssetIdentityPreserved", "countsChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "schemaVersion", "sceneCollectionPreserved", "semantic", "semanticContentChanged", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M923 aggregate evidence");
  for (const [field, expected] of Object.entries({
    schemaVersion: PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M923",
    sourceMilestone: "M908",
    evidenceLabel: "local",
    receipt: "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json",
    operation: "project.asset.bind.redo",
    semantic: "redo-post-state",
    driftRejected: "asset descriptor/binding/content/Scene/asset-tree/reread/authority drift",
    aggregateAttachment: "one-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    stage11AcceptanceStatus: "blocked",
  } as const)) exact(value[field], expected, `M923 aggregate evidence.${field}`);
  for (const field of ["activeScenePreserved", "matchedReread", "generationAdvanced", "assetCountPreserved", "assetDescriptorPreserved", "assetTreePreserved", "bindingTransitionPreserved", "contentAddressedAssetIdentityPreserved", "assetBytesNonPersistentOnRedo", "semanticContentChanged", "envelopeRotated", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority"] as const) exact(value[field], true, `M923 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M923 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M923 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M923 aggregate evidence.stage12Started");
  return value as ProjectStage11AssetBindSemanticRedoAggregateEvidence;
}

export const projectStage11AssetBindSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11AssetBindSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11AssetBindSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11AssetBindSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
