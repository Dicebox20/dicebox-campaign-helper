export const PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M910_RECEIPT = "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11SaveAsSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M925";
  sourceMilestone: "M910";
  evidenceLabel: "local";
  receipt: typeof M910_RECEIPT;
  operation: "project.save-as.redo";
  semantic: "redo-post-state";
  sourceAndTargetIdentityPreserved: true;
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  sourcePreserved: true;
  generationAdvanced: true;
  contentPreserved: true;
  sceneCollectionPreserved: true;
  assetCollectionPreserved: true;
  matchedReread: true;
  targetCreationIntegrityPreserved: true;
  driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift";
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

export class ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_SAVE_AS_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM910Receipt(input: unknown): void {
  const receipt = record(input, "M925 M910 closure receipt");
  exactKeys(receipt, ["artifacts", "boundary", "doesNotProve", "evidence", "evidenceClass", "inputs", "milestone", "next", "reconciliation", "scope", "stage", "status", "validation"], "M925 M910 closure receipt");
  exact(receipt.milestone, "M910", "M925 M910 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M925 M910 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M925 M910 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M925 M910 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.save-as redo terminal-history bridge into typed producer-scoped semantic evidence using a deterministic local fixture, without expanding production, aggregate, runtime, or Foundry authority.", "M925 M910 closure receipt.scope");
  exact(receipt.next, "Perform only the authorized M911 post-save-as-semantic-redo read-only reconciliation against the complete Stage 11 matrix; retain all count scopes, authority locks, runtime parking, and Stage 11/Stage 12 non-certification.", "M925 M910 closure receipt.next");
  exactStrings(receipt.inputs, [
    "apps/campaign-helper-desktop/src/project-save-as-terminal-history.ts",
    "tests/project-save-as-terminal-history.test.ts",
    "apps/campaign-helper-desktop/src/project-stage11-save-as-semantic-redo-evidence.ts",
    "tests/project-stage11-save-as-semantic-redo-evidence.test.ts",
    "outputs/m909-stage11-post-asset-bind-semantic-redo-reconciliation-receipt.json",
    "docs/ACTIVE-PROGRAM-SLICE.json",
    "database/dicebox_campaign_helper_knowledge.sqlite",
  ], "M925 M910 closure receipt.inputs");

  const evidence = record(receipt.evidence, "M925 M910 closure receipt.evidence");
  exactKeys(evidence, ["assetCollectionPreserved", "backupPromotion", "contentPreserved", "driftRejected", "generationAdvanced", "matchedReread", "operation", "sceneCollectionPreserved", "sourceAndTargetIdentityPreserved", "sourcePreserved", "strictProducerReceipt", "targetAbsentBeforeRedo", "targetCreationIntegrityPreserved", "targetPresentAfterRedo"], "M925 M910 closure receipt.evidence");
  exact(evidence.operation, "project.save-as.redo", "M925 M910 closure receipt.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.save-as.redo", "M925 M910 closure receipt.evidence.strictProducerReceipt");
  for (const field of ["sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "generationAdvanced", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "matchedReread", "targetCreationIntegrityPreserved"] as const) exact(evidence[field], true, `M925 M910 closure receipt.evidence.${field}`);
  exactStrings(evidence.driftRejected, ["source identity or preservation drift", "target identity or absence/presence drift", "content/Scene/asset-collection drift", "matched-reread drift", "authority drift"], "M925 M910 closure receipt.evidence.driftRejected");
  exact(evidence.backupPromotion, "NOT_APPLICABLE_ONE_WAY", "M925 M910 closure receipt.evidence.backupPromotion");

  const boundary = record(receipt.boundary, "M925 M910 closure receipt.boundary");
  exactKeys(boundary, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "playerPasswordsGenerated", "providerOrCredentialActivity", "readOnly", "readyClaim", "runtimeLaneReopened", "semanticEvidence", "sourceProjectContentWrite", "stage11AcceptanceStatus", "stage12Started"], "M925 M910 closure receipt.boundary");
  exact(boundary.semanticEvidence, "typed producer-scoped local evidence", "M925 M910 closure receipt.boundary.semanticEvidence");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation", "foreignStatePreserved"] as const) exact(boundary[field], true, `M925 M910 closure receipt.boundary.${field}`);
  for (const field of ["sourceProjectContentWrite", "aggregateSemanticAttachment", "aggregateCountsChanged", "runtimeLaneReopened", "providerOrCredentialActivity", "playerPasswordsGenerated", "stage12Started"] as const) exact(boundary[field], false, `M925 M910 closure receipt.boundary.${field}`);
  exact(boundary.readyClaim, false, "M925 M910 closure receipt.boundary.readyClaim");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M925 M910 closure receipt.boundary.stage11AcceptanceStatus");

  const reconciliation = record(receipt.reconciliation, "M925 M910 closure receipt.reconciliation");
  exactKeys(reconciliation, ["acceptanceClauses", "aggregateAuthority", "aggregateDirectStrands", "countScopeNote", "countScopePreserved", "currentAggregateAuthorityIndexedRedoBindings", "currentAuthority", "directProjections", "modeledOperations", "producerFamilies", "stage11MatrixRedoBindings"], "M925 M910 closure receipt.reconciliation");
  const acceptanceClauses = record(reconciliation.acceptanceClauses, "M925 M910 closure receipt.reconciliation.acceptanceClauses");
  exactKeys(acceptanceClauses, ["approval", "history", "proposal", "recovery"], "M925 M910 closure receipt.reconciliation.acceptanceClauses");
  for (const field of ["approval", "history", "proposal", "recovery"] as const) exact(acceptanceClauses[field], "PARTIAL", `M925 M910 closure receipt.reconciliation.acceptanceClauses.${field}`);
  exact(reconciliation.producerFamilies, 11, "M925 M910 closure receipt.reconciliation.producerFamilies");
  exact(reconciliation.modeledOperations, 14, "M925 M910 closure receipt.reconciliation.modeledOperations");
  exact(reconciliation.directProjections, 16, "M925 M910 closure receipt.reconciliation.directProjections");
  exact(reconciliation.stage11MatrixRedoBindings, 8, "M925 M910 closure receipt.reconciliation.stage11MatrixRedoBindings");
  exact(reconciliation.aggregateDirectStrands, 9, "M925 M910 closure receipt.reconciliation.aggregateDirectStrands");
  exact(reconciliation.currentAggregateAuthorityIndexedRedoBindings, 9, "M925 M910 closure receipt.reconciliation.currentAggregateAuthorityIndexedRedoBindings");
  exact(reconciliation.currentAuthority, "PARTIAL", "M925 M910 closure receipt.reconciliation.currentAuthority");
  exact(reconciliation.aggregateAuthority, "NOT_GRANTED", "M925 M910 closure receipt.reconciliation.aggregateAuthority");
  exact(reconciliation.countScopePreserved, true, "M925 M910 closure receipt.reconciliation.countScopePreserved");
  exact(reconciliation.countScopeNote, "The Stage 11 matrix retains 8 redo bindings and the aggregate direct-strand field retains 9. The current aggregate-authority source/test separately indexes 9 redo entries, including the supplemental project.add-scene.commit-in-memory row; these are not collapsed into one measure.", "M925 M910 closure receipt.reconciliation.countScopeNote");

  const validation = record(receipt.validation, "M925 M910 closure receipt.validation");
  exactKeys(validation, ["databaseRebuildAndVerifyBeforeClosure", "diffCheck", "focusedEvidenceSuite", "fullRepositorySuite", "negativeCoverage", "packageTypeCheck", "relatedStage11EvidenceSuite", "workflowCheck"], "M925 M910 closure receipt.validation");
  exact(validation.focusedEvidenceSuite, "PASS: 2 files; 6 tests", "M925 M910 closure receipt.validation.focusedEvidenceSuite");
  exact(validation.relatedStage11EvidenceSuite, "PASS: 17 files; 50 tests", "M925 M910 closure receipt.validation.relatedStage11EvidenceSuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M925 M910 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheck, "PASS: score 63; 10/16 gates; activeStage proposal-approval-history; build lane only; failures 0; violations 0; readyClaim false", "M925 M910 closure receipt.validation.workflowCheck");
  exact(validation.fullRepositorySuite, "PASS: 207 files; 937 tests", "M925 M910 closure receipt.validation.fullRepositorySuite");
  exact(validation.databaseRebuildAndVerifyBeforeClosure, "PASS: sources 1383, facts 1164, decisions 1023, open items 135, trials 788, research subjects 40, milestones 26", "M925 M910 closure receipt.validation.databaseRebuildAndVerifyBeforeClosure");
  exact(validation.negativeCoverage, "PASS: source, target, absence/presence, content, Scene, asset-collection, matched-reread, and authority drift fail closed", "M925 M910 closure receipt.validation.negativeCoverage");
  exact(validation.diffCheck, "PENDING FINAL DOCUMENTATION PASS", "M925 M910 closure receipt.validation.diffCheck");

  const artifacts = record(receipt.artifacts, "M925 M910 closure receipt.artifacts");
  exactKeys(artifacts, ["focusedTest", "semanticLayer", "strictSaveAsFocusedTest", "strictSaveAsRedoBridge"], "M925 M910 closure receipt.artifacts");
  const artifactValues = {
    semanticLayer: ["apps/campaign-helper-desktop/src/project-stage11-save-as-semantic-redo-evidence.ts", "28AA2E38C54E0EB4CE5A6D94787F41F7231D89DA1EC54A383888575B8EA6EF0A"],
    focusedTest: ["tests/project-stage11-save-as-semantic-redo-evidence.test.ts", "6805827ECA8EB877770923240CFC9AAD27D21EFDA7A1E5947AAD6214259C26A6"],
    strictSaveAsRedoBridge: ["apps/campaign-helper-desktop/src/project-save-as-terminal-history.ts", "1FA3F7AEFB2A6538E4E0D5602D352BBA7A282A90A2C96F7EE2133768BC213640"],
    strictSaveAsFocusedTest: ["tests/project-save-as-terminal-history.test.ts", "0040A1FF857AA62C21D153295448BC4A76388C04C0F722923F188326CA4565C5"],
  } as const;
  for (const field of ["semanticLayer", "focusedTest", "strictSaveAsRedoBridge", "strictSaveAsFocusedTest"] as const) {
    const artifact = record(artifacts[field], `M925 M910 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M925 M910 closure receipt.artifacts.${field}`);
    exact(artifact.path, artifactValues[field][0], `M925 M910 closure receipt.artifacts.${field}.path`);
    exact(artifact.sha256, artifactValues[field][1], `M925 M910 closure receipt.artifacts.${field}.sha256`);
  }

  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "byte-level envelope rotation for project.rename or project.create",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M925 M910 closure receipt.doesNotProve");
}

export function createProjectStage11SaveAsSemanticRedoAggregateEvidence(input: unknown): ProjectStage11SaveAsSemanticRedoAggregateEvidence {
  validateM910Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M925",
    sourceMilestone: "M910",
    evidenceLabel: "local",
    receipt: M910_RECEIPT,
    operation: "project.save-as.redo",
    semantic: "redo-post-state",
    sourceAndTargetIdentityPreserved: true,
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    sourcePreserved: true,
    generationAdvanced: true,
    contentPreserved: true,
    sceneCollectionPreserved: true,
    assetCollectionPreserved: true,
    matchedReread: true,
    targetCreationIntegrityPreserved: true,
    driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11SaveAsSemanticRedoAggregateEvidence {
  const value = record(input, "M925 save-as semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "assetCollectionPreserved", "contentPreserved", "countsChanged", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "schemaVersion", "sceneCollectionPreserved", "semantic", "sourceAndTargetIdentityPreserved", "sourceMilestone", "sourcePreserved", "stage11AcceptanceStatus", "stage12Started", "targetAbsentBeforeRedo", "targetCreationIntegrityPreserved", "targetPresentAfterRedo"], "M925 aggregate evidence");
  for (const [field, expected] of Object.entries({
    schemaVersion: PROJECT_STAGE11_SAVE_AS_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M925",
    sourceMilestone: "M910",
    evidenceLabel: "local",
    receipt: M910_RECEIPT,
    operation: "project.save-as.redo",
    semantic: "redo-post-state",
    driftRejected: "source/target/absence-presence/content/Scene/assets/reread/authority drift",
    aggregateAttachment: "one-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    stage11AcceptanceStatus: "blocked",
  } as const)) exact(value[field], expected, `M925 aggregate evidence.${field}`);
  for (const field of ["sourceAndTargetIdentityPreserved", "targetAbsentBeforeRedo", "targetPresentAfterRedo", "sourcePreserved", "generationAdvanced", "contentPreserved", "sceneCollectionPreserved", "assetCollectionPreserved", "matchedReread", "targetCreationIntegrityPreserved", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M925 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M925 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M925 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M925 aggregate evidence.stage12Started");
  return value as ProjectStage11SaveAsSemanticRedoAggregateEvidence;
}

export const projectStage11SaveAsSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11SaveAsSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11SaveAsSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11SaveAsSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
