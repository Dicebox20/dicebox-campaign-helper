export const PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M906_RECEIPT = "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M931";
  sourceMilestone: "M906";
  evidenceLabel: "local";
  receipt: typeof M906_RECEIPT;
  operation: "project.add-scene.commit-in-memory.redo";
  semantic: "redo-post-state";
  exactProjectIdentity: true;
  matchedBeforeAndAfterRedoRereads: true;
  laterInMemoryRevision: true;
  orderedSceneSetPreserved: true;
  addedSceneAppended: true;
  activeSceneSelected: true;
  nonPersistencePreserved: true;
  assetPreservation: true;
  sceneSetIdentityChanged: true;
  byteHashRotation: "not-claimed";
  driftRejected: "persistence-write/Scene-set/active-Scene/matched-reread/authority drift";
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

export class ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM906Receipt(input: unknown): void {
  const receipt = record(input, "M931 M906 closure receipt");
  exactKeys(receipt, ["artifacts", "boundary", "doesNotProve", "evidence", "evidenceClass", "inputs", "milestone", "next", "reconciliation", "scope", "stage", "status", "validation"], "M931 M906 closure receipt");
  exact(receipt.milestone, "M906", "M931 M906 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M931 M906 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M931 M906 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M931 M906 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.add-scene.commit-in-memory redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M931 M906 closure receipt.scope");
  exact(receipt.next, "Perform only the authorized M907 post-in-memory-add-Scene-semantic-redo read-only reconciliation against the complete Stage 11 matrix; retain all count scopes, authority locks, runtime parking, byte-hash non-claims, and Stage 11/Stage 12 non-certification.", "M931 M906 closure receipt.next");
  exactStrings(receipt.inputs, [
    "apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history.ts",
    "tests/project-add-scene-in-memory-terminal-history.test.ts",
    "apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-semantic-redo-evidence.ts",
    "tests/project-stage11-in-memory-add-scene-semantic-redo-evidence.test.ts",
    "outputs/m905-stage11-post-create-semantic-redo-reconciliation-receipt.json",
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "database/dicebox_campaign_helper_knowledge.sqlite",
  ], "M931 M906 closure receipt.inputs");

  const evidence = record(receipt.evidence, "M931 M906 closure receipt.evidence");
  exactKeys(evidence, ["activeSceneSelected", "addedSceneAppended", "assetPreservation", "backupPromotion", "byteLevelEnvelopeRotation", "driftRejected", "exactProjectIdentity", "historyTransitions", "laterInMemoryRevision", "matchedBeforeAndAfterRedoRereads", "nonPersistencePreserved", "operation", "orderedSceneSetPreserved", "sceneSetIdentityChanged", "strictProducerReceipt"], "M931 M906 closure receipt.evidence");
  exact(evidence.operation, "project.add-scene.commit-in-memory.redo", "M931 M906 closure receipt.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.add-scene.commit-in-memory.redo", "M931 M906 closure receipt.evidence.strictProducerReceipt");
  for (const field of ["exactProjectIdentity", "matchedBeforeAndAfterRedoRereads", "laterInMemoryRevision", "orderedSceneSetPreserved", "addedSceneAppended", "activeSceneSelected", "nonPersistencePreserved", "assetPreservation", "sceneSetIdentityChanged"] as const) exact(evidence[field], true, `M931 M906 closure receipt.evidence.${field}`);
  exactStrings(evidence.historyTransitions, ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"], "M931 M906 closure receipt.evidence.historyTransitions");
  exactStrings(evidence.driftRejected, ["persistence-write drift", "Scene-set/active-Scene drift", "matched-reread drift", "authority drift"], "M931 M906 closure receipt.evidence.driftRejected");
  exact(evidence.byteLevelEnvelopeRotation, "NOT_CLAIMED; in-memory add-Scene evidence is non-persistent and the bridge exposes no byte-hash rotation contract", "M931 M906 closure receipt.evidence.byteLevelEnvelopeRotation");
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M931 M906 closure receipt.evidence.backupPromotion");

  const boundary = record(receipt.boundary, "M931 M906 closure receipt.boundary");
  exactKeys(boundary, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "playerPasswordsGenerated", "projectContentWrite", "projectPersistenceWrite", "providerOrCredentialActivity", "readOnly", "readyClaim", "runtimeLaneReopened", "semanticEvidence", "stage11AcceptanceStatus", "stage12Started"], "M931 M906 closure receipt.boundary");
  exact(boundary.semanticEvidence, "typed producer-scoped local evidence", "M931 M906 closure receipt.boundary.semanticEvidence");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(boundary[field], true, `M931 M906 closure receipt.boundary.${field}`);
  for (const field of ["projectContentWrite", "projectPersistenceWrite", "providerOrCredentialActivity", "playerPasswordsGenerated", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "stage12Started"] as const) exact(boundary[field], false, `M931 M906 closure receipt.boundary.${field}`);
  exact(boundary.readyClaim, false, "M931 M906 closure receipt.boundary.readyClaim");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M931 M906 closure receipt.boundary.stage11AcceptanceStatus");

  const reconciliation = record(receipt.reconciliation, "M931 M906 closure receipt.reconciliation");
  exactKeys(reconciliation, ["acceptanceClauses", "aggregateAuthority", "aggregateDirectStrands", "countScopeNote", "countScopePreserved", "currentAggregateAuthorityIndexedRedoBindings", "currentAuthority", "directProjections", "modeledOperations", "producerFamilies", "stage11MatrixRedoBindings"], "M931 M906 closure receipt.reconciliation");
  const acceptanceClauses = record(reconciliation.acceptanceClauses, "M931 M906 closure receipt.reconciliation.acceptanceClauses");
  exactKeys(acceptanceClauses, ["approval", "history", "proposal", "recovery"], "M931 M906 closure receipt.reconciliation.acceptanceClauses");
  for (const field of ["proposal", "approval", "history", "recovery"] as const) exact(acceptanceClauses[field], "PARTIAL", `M931 M906 closure receipt.reconciliation.acceptanceClauses.${field}`);
  exact(reconciliation.producerFamilies, 11, "M931 M906 closure receipt.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M931 M906 closure receipt.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M931 M906 closure receipt.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M931 M906 closure receipt.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M931 M906 closure receipt.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M931 M906 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
  exact(reconciliation.currentAuthority, "PARTIAL", "M931 M906 closure receipt.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M931 M906 closure receipt.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M931 M906 closure receipt.reconciliation.countScopePreserved");
  exact(reconciliation.countScopeNote, "The Stage 11 matrix retains 8 redo bindings and the aggregate direct-strand field retains 9. The current aggregate-authority source/test separately indexes 9 redo entries, including the supplemental project.add-scene.commit-in-memory row; these are not collapsed into one measure.", "M931 M906 closure receipt.reconciliation.countScopeNote");

  const validation = record(receipt.validation, "M931 M906 closure receipt.validation");
  exactKeys(validation, ["databaseRebuildAndVerifyBeforeClosure", "diffCheck", "focusedEvidenceSuite", "fullRepositorySuite", "negativeCoverage", "packageTypeCheck", "relatedStage11EvidenceSuite", "workflowCheck"], "M931 M906 closure receipt.validation");
  exact(validation.focusedEvidenceSuite, "PASS: 2 files; 6 tests", "M931 M906 closure receipt.validation.focusedEvidenceSuite");
  exact(validation.relatedStage11EvidenceSuite, "PASS: 11 files; 32 tests", "M931 M906 closure receipt.validation.relatedStage11EvidenceSuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M931 M906 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheck, "PASS: score 63; 10/16 gates; activeStage proposal-approval-history; build lane only; failures 0; violations 0; readyClaim false", "M931 M906 closure receipt.validation.workflowCheck");
  exact(validation.fullRepositorySuite, "PASS: 205 files; 932 tests", "M931 M906 closure receipt.validation.fullRepositorySuite");
  exact(validation.databaseRebuildAndVerifyBeforeClosure, "PASS: sources 1375, facts 1160, decisions 1015, open items 135, trials 788, research subjects 40, milestones 26", "M931 M906 closure receipt.validation.databaseRebuildAndVerifyBeforeClosure");
  exact(validation.negativeCoverage, "PASS: persistence, Scene-set, matched-reread, and authority drift fail closed", "M931 M906 closure receipt.validation.negativeCoverage");
  exact(validation.diffCheck, "PASS: git diff --check after documentation and KB updates", "M931 M906 closure receipt.validation.diffCheck");

  const artifacts = record(receipt.artifacts, "M931 M906 closure receipt.artifacts");
  exactKeys(artifacts, ["focusedTest", "semanticLayer", "strictInMemoryFocusedTest", "strictInMemoryRedoBridge"], "M931 M906 closure receipt.artifacts");
  const artifactValues = {
    semanticLayer: ["apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-semantic-redo-evidence.ts", "FAACF6ABB37A6AB790A69C6A475ABF95CF4FA30C7CE705D7E93141BC15E519D3"],
    focusedTest: ["tests/project-stage11-in-memory-add-scene-semantic-redo-evidence.test.ts", "F8BC1F0F5494CDFEF299CF626D69AB3ABC22B93826C0CD64D72CA423A1D96B8"],
    strictInMemoryRedoBridge: ["apps/campaign-helper-desktop/src/project-add-scene-in-memory-terminal-history.ts", "1B3D1272F0D59C0C36072CDA78B7D0A6692DE43C47FAB8C471F642C9FA3F0C71"],
    strictInMemoryFocusedTest: ["tests/project-add-scene-in-memory-terminal-history.test.ts", "F9425CD28F2BF4F0DA9A1CA66E254CBDC51A9A60984B3F34C83B3D2AB0054251"],
  } as const;
  for (const field of ["semanticLayer", "focusedTest", "strictInMemoryRedoBridge", "strictInMemoryFocusedTest"] as const) {
    const artifact = record(artifacts[field], `M931 M906 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M931 M906 closure receipt.artifacts.${field}`);
    exact(artifact.path, artifactValues[field][0], `M931 M906 closure receipt.artifacts.${field}.path`);
    exact(artifact.sha256, artifactValues[field][1], `M931 M906 closure receipt.artifacts.${field}.sha256`);
  }

  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "byte-level envelope rotation for in-memory add-Scene",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M931 M906 closure receipt.doesNotProve");
}

export function createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence {
  validateM906Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M931",
    sourceMilestone: "M906",
    evidenceLabel: "local",
    receipt: M906_RECEIPT,
    operation: "project.add-scene.commit-in-memory.redo",
    semantic: "redo-post-state",
    exactProjectIdentity: true,
    matchedBeforeAndAfterRedoRereads: true,
    laterInMemoryRevision: true,
    orderedSceneSetPreserved: true,
    addedSceneAppended: true,
    activeSceneSelected: true,
    nonPersistencePreserved: true,
    assetPreservation: true,
    sceneSetIdentityChanged: true,
    byteHashRotation: "not-claimed",
    driftRejected: "persistence-write/Scene-set/active-Scene/matched-reread/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence {
  const value = record(input, "M931 in-memory add-Scene semantic-redo aggregate evidence");
  exactKeys(value, ["activeSceneSelected", "addedSceneAppended", "aggregateAttachment", "aggregateAuthority", "assetPreservation", "byteHashRotation", "countsChanged", "driftRejected", "evidenceLabel", "exactProjectIdentity", "laterInMemoryRevision", "matchedBeforeAndAfterRedoRereads", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "nonPersistencePreserved", "operation", "orderedSceneSetPreserved", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "schemaVersion", "sceneSetIdentityChanged", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M931 aggregate evidence");
  for (const [field, expected] of Object.entries({
    schemaVersion: PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M931",
    sourceMilestone: "M906",
    evidenceLabel: "local",
    receipt: M906_RECEIPT,
    operation: "project.add-scene.commit-in-memory.redo",
    semantic: "redo-post-state",
    byteHashRotation: "not-claimed",
    driftRejected: "persistence-write/Scene-set/active-Scene/matched-reread/authority drift",
    aggregateAttachment: "one-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    stage11AcceptanceStatus: "blocked",
  } as const)) exact(value[field], expected, `M931 aggregate evidence.${field}`);
  for (const field of ["exactProjectIdentity", "matchedBeforeAndAfterRedoRereads", "laterInMemoryRevision", "orderedSceneSetPreserved", "addedSceneAppended", "activeSceneSelected", "nonPersistencePreserved", "assetPreservation", "sceneSetIdentityChanged", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M931 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M931 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M931 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M931 aggregate evidence.stage12Started");
  return value as ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence;
}

export const projectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
