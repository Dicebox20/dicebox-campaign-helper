export const PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M896_RECEIPT = "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11AudioAssetSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M916";
  sourceMilestone: "M896";
  evidenceLabel: "local";
  receipt: typeof M896_RECEIPT;
  operation: "project.asset.register-audio.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  contentHashChanged: true;
  assetTreePreserved: true;
  approvedAudioRegistrationPreserved: true;
  scenePreserved: true;
  envelopeRotated: true;
  driftRejected: "audio-asset/content/Scene/envelope/readback identity drift";
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

export class ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_AUDIO_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM896Receipt(input: unknown): void {
  const receipt = record(input, "M916 M896 closure receipt");
  exactKeys(receipt, ["artifacts", "composition", "doesNotProve", "evidenceClass", "limits", "milestone", "next", "safety", "scope", "stage", "status", "validation"], "M916 M896 closure receipt");
  exact(receipt.milestone, "M896", "M916 M896 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M916 M896 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M916 M896 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M916 M896 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.asset.register-audio redo bridge with a typed semantic receipt using a deterministic in-memory fixture.", "M916 M896 closure receipt.scope");

  const composition = record(receipt.composition, "M916 M896 closure receipt.composition");
  exactKeys(composition, ["approvedAudioRegistrationPreserved", "assetTreePreserved", "bridge", "contentHashChanged", "driftRejected", "envelopeRotated", "fixture", "generationAdvanced", "matchedReread", "operation", "scenePreserved", "semantic", "semanticLayer", "sourceReceiptStrictlyParsed"], "M916 M896 closure receipt.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.ts", "M916 M896 closure receipt.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-audio-asset-semantic-redo-evidence.ts", "M916 M896 closure receipt.composition.semanticLayer");
  exact(composition.fixture, "tests/project-audio-asset-semantic-redo-fixtures.ts", "M916 M896 closure receipt.composition.fixture");
  exact(composition.operation, "project.asset.register-audio.redo", "M916 M896 closure receipt.composition.operation");
  exact(composition.semantic, "redo-post-state", "M916 M896 closure receipt.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "approvedAudioRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M916 M896 closure receipt.composition.${field}`);
  exact(composition.driftRejected, "audio-asset/content/Scene/envelope/readback identity drift", "M916 M896 closure receipt.composition.driftRejected");

  const safety = record(receipt.safety, "M916 M896 closure receipt.safety");
  exactKeys(safety, ["backupPromotionUndoRedo", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "readOnlyEvidence", "readyClaim", "stage11AcceptanceStatus", "stage12Started"], "M916 M896 closure receipt.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M916 M896 closure receipt.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M916 M896 closure receipt.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M916 M896 closure receipt.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M916 M896 closure receipt.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M916 M896 closure receipt.safety.stage12Started");

  const limits = record(receipt.limits, "M916 M896 closure receipt.limits");
  exactKeys(limits, ["aggregateCountsChanged", "foreignStateTouched", "playerPasswordsGenerated", "providerOrCredentialActivity", "readyClaim", "runtimeLaneReopened", "runtimeOrFoundryAction", "stage11AcceptanceStatus", "stage12Started"], "M916 M896 closure receipt.limits");
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "foreignStateTouched", "aggregateCountsChanged", "runtimeLaneReopened", "stage12Started"] as const) exact(limits[field], false, `M916 M896 closure receipt.limits.${field}`);
  exact(limits.readyClaim, false, "M916 M896 closure receipt.limits.readyClaim");
  exact(limits.stage11AcceptanceStatus, "blocked", "M916 M896 closure receipt.limits.stage11AcceptanceStatus");
  const validation = record(receipt.validation, "M916 M896 closure receipt.validation");
  exact(validation.focused, "PASS: 2 files; 6 tests", "M916 M896 closure receipt.validation.focused");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M916 M896 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheckBeforeClosure, "PASS: 10/16; violations 0", "M916 M896 closure receipt.validation.workflowCheckBeforeClosure");
  exactStrings(validation.semanticNegativeCoverage, ["equal content hash or semantic post-state drift", "foreign audio descriptor drift", "Scene serialization drift", "generic-executor authority drift"], "M916 M896 closure receipt.validation.semanticNegativeCoverage");
}

export function createProjectStage11AudioAssetSemanticRedoAggregateEvidence(input: unknown): ProjectStage11AudioAssetSemanticRedoAggregateEvidence {
  validateM896Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M916",
    sourceMilestone: "M896",
    evidenceLabel: "local",
    receipt: M896_RECEIPT,
    operation: "project.asset.register-audio.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    contentHashChanged: true,
    assetTreePreserved: true,
    approvedAudioRegistrationPreserved: true,
    scenePreserved: true,
    envelopeRotated: true,
    driftRejected: "audio-asset/content/Scene/envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11AudioAssetSemanticRedoAggregateEvidence {
  const value = record(input, "M916 audio-asset semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "approvedAudioRegistrationPreserved", "assetTreePreserved", "contentHashChanged", "countsChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M916 aggregate evidence");
  const expected = createProjectStage11AudioAssetSemanticRedoAggregateEvidence({
    milestone: "M896",
    stage: "proposal-approval-history",
    status: "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED",
    evidenceClass: "local",
    scope: "Compose the existing strict project.asset.register-audio redo bridge with a typed semantic receipt using a deterministic in-memory fixture.",
    composition: {
      bridge: "apps/campaign-helper-desktop/src/project-audio-asset-terminal-history.ts",
      semanticLayer: "apps/campaign-helper-desktop/src/project-stage11-audio-asset-semantic-redo-evidence.ts",
      fixture: "tests/project-audio-asset-semantic-redo-fixtures.ts",
      operation: "project.asset.register-audio.redo",
      semantic: "redo-post-state",
      sourceReceiptStrictlyParsed: true,
      matchedReread: true,
      generationAdvanced: true,
      contentHashChanged: true,
      assetTreePreserved: true,
      approvedAudioRegistrationPreserved: true,
      scenePreserved: true,
      envelopeRotated: true,
      driftRejected: "audio-asset/content/Scene/envelope/readback identity drift",
    },
    safety: { readOnlyEvidence: true, nonCertifying: true, noExecutionAuthority: true, noTransitionAuthority: true, noGenericExecutor: true, noProjectMutation: true, noFoundryWrite: true, foreignStatePreserved: true, backupPromotionUndoRedo: "NOT_APPLICABLE_ONE_WAY", readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false },
    validation: { focused: "PASS: 2 files; 6 tests", packageTypeCheck: "PASS: npm run build:packages", workflowCheckBeforeClosure: "PASS: 10/16; violations 0", semanticNegativeCoverage: ["equal content hash or semantic post-state drift", "foreign audio descriptor drift", "Scene serialization drift", "generic-executor authority drift"] },
    limits: { runtimeOrFoundryAction: false, providerOrCredentialActivity: false, playerPasswordsGenerated: false, foreignStateTouched: false, aggregateCountsChanged: false, runtimeLaneReopened: false, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false },
    artifacts: { semanticLayer: { path: "apps/project-stage11-audio-asset-semantic-redo-evidence.ts", sha256: "fixture" }, focusedTest: { path: "tests/project-stage11-audio-asset-semantic-redo-evidence.test.ts", sha256: "fixture" }, fixture: { path: "tests/project-audio-asset-semantic-redo-fixtures.ts", sha256: "fixture" } },
    doesNotProve: [],
    next: "fixture",
  });
  for (const field of ["schemaVersion", "milestone", "sourceMilestone", "evidenceLabel", "receipt", "operation", "semantic", "driftRejected", "aggregateAttachment", "aggregateAuthority", "stage11AcceptanceStatus"] as const) exact(value[field], expected[field], `M916 aggregate evidence.${field}`);
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "approvedAudioRegistrationPreserved", "scenePreserved", "envelopeRotated", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M916 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M916 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M916 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M916 aggregate evidence.stage12Started");
  return value as ProjectStage11AudioAssetSemanticRedoAggregateEvidence;
}

export const projectStage11AudioAssetSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11AudioAssetSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11AudioAssetSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11AudioAssetSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
