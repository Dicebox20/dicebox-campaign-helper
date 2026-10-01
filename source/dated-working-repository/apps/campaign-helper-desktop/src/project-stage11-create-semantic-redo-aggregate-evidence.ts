export const PROJECT_STAGE11_CREATE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M904_RECEIPT = "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11CreateSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_CREATE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M929";
  sourceMilestone: "M904";
  evidenceLabel: "local";
  receipt: typeof M904_RECEIPT;
  operation: "project.create.redo";
  semantic: "redo-post-state";
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  generationAdvanced: true;
  firstGenerationContentIdentityPreserved: true;
  matchedReread: true;
  scenesPreserved: true;
  assetCollectionPreserved: true;
  byteHashRotation: "not-claimed";
  driftRejected: "target/content/scenes/assets/reread identity drift";
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

export class ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_CREATE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM904Receipt(input: unknown): void {
  const receipt = record(input, "M929 M904 closure receipt");
  exactKeys(receipt, ["artifacts", "boundary", "doesNotProve", "evidence", "evidenceClass", "inputs", "milestone", "next", "reconciliation", "scope", "stage", "status", "validation"], "M929 M904 closure receipt");
  exact(receipt.milestone, "M904", "M929 M904 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M929 M904 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M929 M904 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M929 M904 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.create redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M929 M904 closure receipt.scope");
  exact(receipt.next, "Perform only the authorized M905 post-create-semantic-redo read-only reconciliation against the complete Stage 11 matrix; retain all count scopes, authority locks, runtime parking, byte-hash non-claims, and Stage 11/Stage 12 non-certification.", "M929 M904 closure receipt.next");
  exactStrings(receipt.inputs, [
    "apps/campaign-helper-desktop/src/project-create-terminal-history.ts",
    "tests/project-create-terminal-history.test.ts",
    "apps/campaign-helper-desktop/src/project-stage11-create-semantic-redo-evidence.ts",
    "tests/project-stage11-create-semantic-redo-evidence.test.ts",
    "outputs/m903-stage11-post-rename-semantic-redo-reconciliation-receipt.json",
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "database/dicebox_campaign_helper_knowledge.sqlite",
  ], "M929 M904 closure receipt.inputs");

  const evidence = record(receipt.evidence, "M929 M904 closure receipt.evidence");
  exactKeys(evidence, ["assetCollectionIdentityPreserved", "backupPromotion", "byteLevelEnvelopeRotation", "driftRejected", "firstGenerationContentIdentityPreserved", "generationAdvanced", "historyTransitions", "matchedReread", "operation", "scenesIdentityPreserved", "strictProducerReceipt", "targetAbsentBeforeRedo", "targetIdentity", "targetPresentAfterRedo"], "M929 M904 closure receipt.evidence");
  exact(evidence.operation, "project.create.redo", "M929 M904 closure receipt.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.create.redo", "M929 M904 closure receipt.evidence.strictProducerReceipt");
  exact(evidence.targetIdentity, "exact targetProjectId preserved through source receipt, authoritative rereads, matched reread, and terminal bridge", "M929 M904 closure receipt.evidence.targetIdentity");
  for (const field of ["targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "scenesIdentityPreserved", "assetCollectionIdentityPreserved", "matchedReread"] as const) exact(evidence[field], true, `M929 M904 closure receipt.evidence.${field}`);
  exactStrings(evidence.historyTransitions, ["preview", "approve", "begin-apply", "commit-after-reread", "undo", "redo"], "M929 M904 closure receipt.evidence.historyTransitions");
  exactStrings(evidence.driftRejected, ["target absence/presence drift", "target identity drift", "content hash drift", "Scene hash drift", "asset-collection hash drift", "matched reread drift", "execution-authority drift"], "M929 M904 closure receipt.evidence.driftRejected");
  exact(evidence.byteLevelEnvelopeRotation, "NOT_CLAIMED; the project.create bridge exposes semantic and metadata integrity but no byte-hash rotation contract", "M929 M904 closure receipt.evidence.byteLevelEnvelopeRotation");
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M929 M904 closure receipt.evidence.backupPromotion");

  const boundary = record(receipt.boundary, "M929 M904 closure receipt.boundary");
  exactKeys(boundary, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "playerPasswordsGenerated", "providerOrCredentialActivity", "readOnly", "readyClaim", "runtimeLaneReopened", "semanticEvidence", "stage11AcceptanceStatus", "stage12Started"], "M929 M904 closure receipt.boundary");
  exact(boundary.semanticEvidence, "typed producer-scoped local evidence", "M929 M904 closure receipt.boundary.semanticEvidence");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(boundary[field], true, `M929 M904 closure receipt.boundary.${field}`);
  for (const field of ["providerOrCredentialActivity", "playerPasswordsGenerated", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "stage12Started"] as const) exact(boundary[field], false, `M929 M904 closure receipt.boundary.${field}`);
  exact(boundary.readyClaim, false, "M929 M904 closure receipt.boundary.readyClaim");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M929 M904 closure receipt.boundary.stage11AcceptanceStatus");

  const reconciliation = record(receipt.reconciliation, "M929 M904 closure receipt.reconciliation");
  exactKeys(reconciliation, ["acceptanceClauses", "aggregateAuthority", "aggregateDirectStrands", "countScopeNote", "countScopePreserved", "currentAggregateAuthorityIndexedRedoBindings", "currentAuthority", "directProjections", "modeledOperations", "producerFamilies", "stage11MatrixRedoBindings"], "M929 M904 closure receipt.reconciliation");
  const acceptanceClauses = record(reconciliation.acceptanceClauses, "M929 M904 closure receipt.reconciliation.acceptanceClauses");
  exactKeys(acceptanceClauses, ["approval", "history", "proposal", "recovery"], "M929 M904 closure receipt.reconciliation.acceptanceClauses");
  for (const field of ["proposal", "approval", "history", "recovery"] as const) exact(acceptanceClauses[field], "PARTIAL", `M929 M904 closure receipt.reconciliation.acceptanceClauses.${field}`);
  exact(reconciliation.producerFamilies, 11, "M929 M904 closure receipt.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M929 M904 closure receipt.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M929 M904 closure receipt.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M929 M904 closure receipt.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M929 M904 closure receipt.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M929 M904 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
  exact(reconciliation.currentAuthority, "PARTIAL", "M929 M904 closure receipt.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M929 M904 closure receipt.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M929 M904 closure receipt.reconciliation.countScopePreserved");
  exact(reconciliation.countScopeNote, "The Stage 11 matrix retains 8 redo bindings and the aggregate direct-strand field retains 9. The current aggregate-authority source/test separately indexes 9 redo entries, including project.add-scene.commit-in-memory; these are not collapsed into one measure.", "M929 M904 closure receipt.reconciliation.countScopeNote");

  const validation = record(receipt.validation, "M929 M904 closure receipt.validation");
  exactKeys(validation, ["databaseRebuildAndVerifyBeforeClosure", "diffCheck", "focusedEvidenceSuite", "fullRepositorySuite", "negativeCoverage", "packageTypeCheck", "relatedStage11EvidenceSuite", "workflowCheck"], "M929 M904 closure receipt.validation");
  exact(validation.focusedEvidenceSuite, "PASS: 2 files; 6 tests", "M929 M904 closure receipt.validation.focusedEvidenceSuite");
  exact(validation.relatedStage11EvidenceSuite, "PASS: 9 files; 26 tests", "M929 M904 closure receipt.validation.relatedStage11EvidenceSuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M929 M904 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheck, "PASS: score 63; 10/16 gates; activeStage proposal-approval-history; build lane only; failures 0; violations 0; readyClaim false", "M929 M904 closure receipt.validation.workflowCheck");
  exact(validation.fullRepositorySuite, "PASS: 204 files; 930 tests", "M929 M904 closure receipt.validation.fullRepositorySuite");
  exact(validation.databaseRebuildAndVerifyBeforeClosure, "PASS: sources 1371, facts 1158, decisions 1011, open items 135, trials 788, research subjects 40, milestones 26", "M929 M904 closure receipt.validation.databaseRebuildAndVerifyBeforeClosure");
  exact(validation.negativeCoverage, "PASS: target, content, Scene, asset-collection, matched-reread, and authority drift fail closed", "M929 M904 closure receipt.validation.negativeCoverage");
  exact(validation.diffCheck, "PASS: git diff --check after documentation and KB updates", "M929 M904 closure receipt.validation.diffCheck");

  const artifacts = record(receipt.artifacts, "M929 M904 closure receipt.artifacts");
  exactKeys(artifacts, ["focusedTest", "priorReconciliationReceipt", "semanticLayer", "strictCreateFocusedTest", "strictCreateRedoBridge"], "M929 M904 closure receipt.artifacts");
  const artifactValues = {
    semanticLayer: ["apps/campaign-helper-desktop/src/project-stage11-create-semantic-redo-evidence.ts", "BAB0BDC8A67E1AD7042B94F73D1F63C3E7A4C1D85DA7031239D412D3B92174E9"],
    focusedTest: ["tests/project-stage11-create-semantic-redo-evidence.test.ts", "CE7961605990FD61CC63DC9276CDFDEBE0A3E6CD9118C45A650429F003F81DA6"],
    strictCreateRedoBridge: ["apps/campaign-helper-desktop/src/project-create-terminal-history.ts", "A9F7F8A6308386BADB853C8F2931B24435C9EA02093808FF939E9C3D681CC297"],
    strictCreateFocusedTest: ["tests/project-create-terminal-history.test.ts", "B5FE278ECF15A556AC8068BE99898940260AF6F7750E55204469940A5017C40B"],
    priorReconciliationReceipt: ["outputs/m903-stage11-post-rename-semantic-redo-reconciliation-receipt.json", "56EA97581923742BE64565A7BD63330BEADE272FEA279AE80B0F96040205BE99"],
  } as const;
  for (const field of ["semanticLayer", "focusedTest", "strictCreateRedoBridge", "strictCreateFocusedTest", "priorReconciliationReceipt"] as const) {
    const artifact = record(artifacts[field], `M929 M904 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M929 M904 closure receipt.artifacts.${field}`);
    exact(artifact.path, artifactValues[field][0], `M929 M904 closure receipt.artifacts.${field}.path`);
    exact(artifact.sha256, artifactValues[field][1], `M929 M904 closure receipt.artifacts.${field}.sha256`);
  }

  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "byte-level envelope rotation for project.create",
    "backup-promotion undo/redo support",
    "generic execution, project mutation, or provider/credential integration",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M929 M904 closure receipt.doesNotProve");
}

export function createProjectStage11CreateSemanticRedoAggregateEvidence(input: unknown): ProjectStage11CreateSemanticRedoAggregateEvidence {
  validateM904Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_CREATE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M929",
    sourceMilestone: "M904",
    evidenceLabel: "local",
    receipt: M904_RECEIPT,
    operation: "project.create.redo",
    semantic: "redo-post-state",
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    generationAdvanced: true,
    firstGenerationContentIdentityPreserved: true,
    matchedReread: true,
    scenesPreserved: true,
    assetCollectionPreserved: true,
    byteHashRotation: "not-claimed",
    driftRejected: "target/content/scenes/assets/reread identity drift",
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

function parseEvidence(input: unknown): ProjectStage11CreateSemanticRedoAggregateEvidence {
  const value = record(input, "M929 create semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "assetCollectionPreserved", "byteHashRotation", "countsChanged", "driftRejected", "evidenceLabel", "firstGenerationContentIdentityPreserved", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "schemaVersion", "scenesPreserved", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started", "targetAbsentBeforeRedo", "targetPresentAfterRedo"], "M929 aggregate evidence");
  for (const [field, expected] of Object.entries({
    schemaVersion: PROJECT_STAGE11_CREATE_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M929",
    sourceMilestone: "M904",
    evidenceLabel: "local",
    receipt: M904_RECEIPT,
    operation: "project.create.redo",
    semantic: "redo-post-state",
    byteHashRotation: "not-claimed",
    driftRejected: "target/content/scenes/assets/reread identity drift",
    aggregateAttachment: "one-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    stage11AcceptanceStatus: "blocked",
  } as const)) exact(value[field], expected, `M929 aggregate evidence.${field}`);
  for (const field of ["targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "matchedReread", "scenesPreserved", "assetCollectionPreserved", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M929 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M929 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M929 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M929 aggregate evidence.stage12Started");
  return value as ProjectStage11CreateSemanticRedoAggregateEvidence;
}

export const projectStage11CreateSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11CreateSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11CreateSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11CreateSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
