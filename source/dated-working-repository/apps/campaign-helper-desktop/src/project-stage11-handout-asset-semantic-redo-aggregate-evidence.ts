export const PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M898_RECEIPT = "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11HandoutAssetSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M918";
  sourceMilestone: "M898";
  evidenceLabel: "local";
  receipt: typeof M898_RECEIPT;
  operation: "project.asset.register-handout.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  contentHashChanged: true;
  assetTreePreserved: true;
  contentAddressedHandoutRegistrationPreserved: true;
  scenePreserved: true;
  envelopeRotated: true;
  driftRejected: "handout-asset/content/Scene/envelope/readback identity drift";
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

export class ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM898Receipt(input: unknown): void {
  const receipt = record(input, "M918 M898 closure receipt");
  exactKeys(receipt, ["artifacts", "composition", "doesNotProve", "evidenceClass", "limits", "milestone", "next", "safety", "scope", "stage", "status", "validation"], "M918 M898 closure receipt");
  exact(receipt.milestone, "M898", "M918 M898 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M918 M898 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M918 M898 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M918 M898 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.asset.register-handout redo bridge with a typed semantic receipt using a deterministic in-memory fixture.", "M918 M898 closure receipt.scope");
  exact(receipt.next, "Perform one read-only reconciliation of M898 against the complete Stage 11 matrix; retain all counts and authority locks, then select at most one directly evidenced next gap.", "M918 M898 closure receipt.next");
  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M918 M898 closure receipt.doesNotProve");

  const composition = record(receipt.composition, "M918 M898 closure receipt.composition");
  exactKeys(composition, ["assetTreePreserved", "bridge", "contentAddressedHandoutRegistrationPreserved", "contentHashChanged", "driftRejected", "envelopeRotated", "fixture", "generationAdvanced", "matchedReread", "operation", "scenePreserved", "semantic", "semanticLayer", "sourceReceiptStrictlyParsed"], "M918 M898 closure receipt.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-handout-asset-terminal-history.ts", "M918 M898 closure receipt.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-handout-asset-semantic-redo-evidence.ts", "M918 M898 closure receipt.composition.semanticLayer");
  exact(composition.fixture, "tests/project-handout-asset-semantic-redo-fixtures.ts", "M918 M898 closure receipt.composition.fixture");
  exact(composition.operation, "project.asset.register-handout.redo", "M918 M898 closure receipt.composition.operation");
  exact(composition.semantic, "redo-post-state", "M918 M898 closure receipt.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M918 M898 closure receipt.composition.${field}`);
  exact(composition.driftRejected, "handout-asset/content/Scene/envelope/readback identity drift", "M918 M898 closure receipt.composition.driftRejected");

  const safety = record(receipt.safety, "M918 M898 closure receipt.safety");
  exactKeys(safety, ["backupPromotionUndoRedo", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "readOnlyEvidence", "readyClaim", "stage11AcceptanceStatus", "stage12Started"], "M918 M898 closure receipt.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M918 M898 closure receipt.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M918 M898 closure receipt.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M918 M898 closure receipt.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M918 M898 closure receipt.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M918 M898 closure receipt.safety.stage12Started");

  const limits = record(receipt.limits, "M918 M898 closure receipt.limits");
  exactKeys(limits, ["aggregateCountsChanged", "foreignStateTouched", "playerPasswordsGenerated", "providerOrCredentialActivity", "readyClaim", "runtimeLaneReopened", "runtimeOrFoundryAction", "stage11AcceptanceStatus", "stage12Started"], "M918 M898 closure receipt.limits");
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "foreignStateTouched", "aggregateCountsChanged", "runtimeLaneReopened", "stage12Started"] as const) exact(limits[field], false, `M918 M898 closure receipt.limits.${field}`);
  exact(limits.readyClaim, false, "M918 M898 closure receipt.limits.readyClaim");
  exact(limits.stage11AcceptanceStatus, "blocked", "M918 M898 closure receipt.limits.stage11AcceptanceStatus");

  const artifacts = record(receipt.artifacts, "M918 M898 closure receipt.artifacts");
  exactKeys(artifacts, ["fixture", "focusedTest", "semanticLayer"], "M918 M898 closure receipt.artifacts");
  for (const field of ["fixture", "focusedTest", "semanticLayer"] as const) {
    const artifact = record(artifacts[field], `M918 M898 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M918 M898 closure receipt.artifacts.${field}`);
    exact(artifact.sha256, field === "semanticLayer" ? "AE71AA7672C3C3EEB7A8AE2DAAA0B6B2C6C24AF8A43C4E8218A635F7984367E6" : field === "focusedTest" ? "2F96E22A44F94FE0A6EB13487A1028F4118BAD2BE5EE1AF2C0197CBB5BF78066" : "57EB6BFBEF647B8A7CD4084847BE5BD954DD96AA5255399C28B05F6BF870C3BB", `M918 M898 closure receipt.artifacts.${field}.sha256`);
  }
  exact((artifacts.semanticLayer as Record<string, unknown>).path, "apps/campaign-helper-desktop/src/project-stage11-handout-asset-semantic-redo-evidence.ts", "M918 M898 closure receipt.artifacts.semanticLayer.path");
  exact((artifacts.focusedTest as Record<string, unknown>).path, "tests/project-stage11-handout-asset-semantic-redo-evidence.test.ts", "M918 M898 closure receipt.artifacts.focusedTest.path");
  exact((artifacts.fixture as Record<string, unknown>).path, "tests/project-handout-asset-semantic-redo-fixtures.ts", "M918 M898 closure receipt.artifacts.fixture.path");

  const validation = record(receipt.validation, "M918 M898 closure receipt.validation");
  exactKeys(validation, ["focused", "fullRepositorySuite", "packageTypeCheck", "semanticNegativeCoverage", "workflowCheckBeforeClosure"], "M918 M898 closure receipt.validation");
  exact(validation.focused, "PASS: 2 files; 6 tests", "M918 M898 closure receipt.validation.focused");
  exact(validation.fullRepositorySuite, "PASS: 201 files; 924 tests", "M918 M898 closure receipt.validation.fullRepositorySuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M918 M898 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheckBeforeClosure, "PASS: 10/16; violations 0", "M918 M898 closure receipt.validation.workflowCheckBeforeClosure");
  exactStrings(validation.semanticNegativeCoverage, ["equal content hash or semantic post-state drift", "foreign handout descriptor drift", "Scene serialization/identity drift", "transition-authority drift"], "M918 M898 closure receipt.validation.semanticNegativeCoverage");
}

export function createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(input: unknown): ProjectStage11HandoutAssetSemanticRedoAggregateEvidence {
  validateM898Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M918",
    sourceMilestone: "M898",
    evidenceLabel: "local",
    receipt: M898_RECEIPT,
    operation: "project.asset.register-handout.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    contentHashChanged: true,
    assetTreePreserved: true,
    contentAddressedHandoutRegistrationPreserved: true,
    scenePreserved: true,
    envelopeRotated: true,
    driftRejected: "handout-asset/content/Scene/envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11HandoutAssetSemanticRedoAggregateEvidence {
  const value = record(input, "M918 handout-asset semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "contentHashChanged", "countsChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M918 aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M918 aggregate evidence.schemaVersion");
  exact(value.milestone, "M918", "M918 aggregate evidence.milestone");
  exact(value.sourceMilestone, "M898", "M918 aggregate evidence.sourceMilestone");
  exact(value.evidenceLabel, "local", "M918 aggregate evidence.evidenceLabel");
  exact(value.receipt, M898_RECEIPT, "M918 aggregate evidence.receipt");
  exact(value.operation, "project.asset.register-handout.redo", "M918 aggregate evidence.operation");
  exact(value.semantic, "redo-post-state", "M918 aggregate evidence.semantic");
  exact(value.driftRejected, "handout-asset/content/Scene/envelope/readback identity drift", "M918 aggregate evidence.driftRejected");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M918 aggregate evidence.aggregateAttachment");
  exact(value.aggregateAuthority, "not-granted", "M918 aggregate evidence.aggregateAuthority");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "scenePreserved", "envelopeRotated", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M918 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M918 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M918 aggregate evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M918 aggregate evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M918 aggregate evidence.stage12Started");
  return value as ProjectStage11HandoutAssetSemanticRedoAggregateEvidence;
}

export const projectStage11HandoutAssetSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11HandoutAssetSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11HandoutAssetSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11HandoutAssetSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
