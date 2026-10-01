export const PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M900_RECEIPT = "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11TokenAssetSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M920";
  sourceMilestone: "M900";
  evidenceLabel: "local";
  receipt: typeof M900_RECEIPT;
  operation: "project.asset.register-token.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  contentHashChanged: true;
  assetTreePreserved: true;
  contentAddressedTokenRegistrationPreserved: true;
  scenePreserved: true;
  envelopeRotated: true;
  driftRejected: "token-asset/content/Scene/envelope/readback identity drift";
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

export class ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_TOKEN_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM900Receipt(input: unknown): void {
  const receipt = record(input, "M920 M900 closure receipt");
  exactKeys(receipt, ["artifacts", "composition", "doesNotProve", "evidenceClass", "limits", "milestone", "next", "safety", "scope", "stage", "status", "validation"], "M920 M900 closure receipt");
  exact(receipt.milestone, "M900", "M920 M900 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M920 M900 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M920 M900 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M920 M900 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.asset.register-token redo bridge with a typed semantic receipt using a deterministic in-memory fixture.", "M920 M900 closure receipt.scope");
  exact(receipt.next, "Perform one read-only reconciliation of M900 against the complete Stage 11 matrix; retain all counts and authority locks, then select at most one directly evidenced next gap.", "M920 M900 closure receipt.next");
  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M920 M900 closure receipt.doesNotProve");

  const composition = record(receipt.composition, "M920 M900 closure receipt.composition");
  exactKeys(composition, ["assetTreePreserved", "bridge", "contentAddressedTokenRegistrationPreserved", "contentHashChanged", "driftRejected", "envelopeRotated", "fixture", "generationAdvanced", "matchedReread", "operation", "scenePreserved", "semantic", "semanticLayer", "sourceReceiptStrictlyParsed"], "M920 M900 closure receipt.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-token-asset-terminal-history.ts", "M920 M900 closure receipt.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-token-asset-semantic-redo-evidence.ts", "M920 M900 closure receipt.composition.semanticLayer");
  exact(composition.fixture, "tests/project-stage11-token-asset-semantic-redo-evidence.test.ts", "M920 M900 closure receipt.composition.fixture");
  exact(composition.operation, "project.asset.register-token.redo", "M920 M900 closure receipt.composition.operation");
  exact(composition.semantic, "redo-post-state", "M920 M900 closure receipt.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(composition[field], true, `M920 M900 closure receipt.composition.${field}`);
  exact(composition.driftRejected, "token-asset/content/Scene/envelope/readback identity drift", "M920 M900 closure receipt.composition.driftRejected");

  const safety = record(receipt.safety, "M920 M900 closure receipt.safety");
  exactKeys(safety, ["backupPromotionUndoRedo", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "readOnlyEvidence", "readyClaim", "stage11AcceptanceStatus", "stage12Started"], "M920 M900 closure receipt.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M920 M900 closure receipt.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M920 M900 closure receipt.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M920 M900 closure receipt.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M920 M900 closure receipt.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M920 M900 closure receipt.safety.stage12Started");

  const limits = record(receipt.limits, "M920 M900 closure receipt.limits");
  exactKeys(limits, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStateTouched", "playerPasswordsGenerated", "providerOrCredentialActivity", "readyClaim", "runtimeLaneReopened", "runtimeOrFoundryAction", "stage11AcceptanceStatus", "stage12Started"], "M920 M900 closure receipt.limits");
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "foreignStateTouched", "aggregateCountsChanged", "aggregateSemanticAttachment", "runtimeLaneReopened", "stage12Started"] as const) exact(limits[field], false, `M920 M900 closure receipt.limits.${field}`);
  exact(limits.readyClaim, false, "M920 M900 closure receipt.limits.readyClaim");
  exact(limits.stage11AcceptanceStatus, "blocked", "M920 M900 closure receipt.limits.stage11AcceptanceStatus");

  const artifacts = record(receipt.artifacts, "M920 M900 closure receipt.artifacts");
  exactKeys(artifacts, ["bridge", "bridgeTest", "focusedTest", "semanticLayer"], "M920 M900 closure receipt.artifacts");
  const artifactValues = {
    semanticLayer: ["apps/campaign-helper-desktop/src/project-stage11-token-asset-semantic-redo-evidence.ts", "3A65C813160E90B1E1E78221FDC5C7A25B1E6BADA59BC1AFDCD15D7D704A9F9F"],
    focusedTest: ["tests/project-stage11-token-asset-semantic-redo-evidence.test.ts", "141CC0556387ED6024D449DC9389EC0A8213E8F20215934B237C28422891737C"],
    bridge: ["apps/campaign-helper-desktop/src/project-token-asset-terminal-history.ts", "16AB5C2618F7D208626A1C47BA1B7BAC8F713BBF0274DEBA1F466D4AFCC46847"],
    bridgeTest: ["tests/project-token-asset-terminal-history.test.ts", "9D942E6F0E0F6A0DB6B0CC1B106D420AC7CEA879F2A2F231C1D9D212A696ABB5"],
  } as const;
  for (const field of ["semanticLayer", "focusedTest", "bridge", "bridgeTest"] as const) {
    const artifact = record(artifacts[field], `M920 M900 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M920 M900 closure receipt.artifacts.${field}`);
    exact(artifact.path, artifactValues[field][0], `M920 M900 closure receipt.artifacts.${field}.path`);
    exact(artifact.sha256, artifactValues[field][1], `M920 M900 closure receipt.artifacts.${field}.sha256`);
  }

  const validation = record(receipt.validation, "M920 M900 closure receipt.validation");
  exactKeys(validation, ["diffCheck", "focused", "fullRepositorySuite", "packageTypeCheck", "semanticNegativeCoverage", "workflowCheckBeforeClosure"], "M920 M900 closure receipt.validation");
  exact(validation.focused, "PASS: 2 files; 6 tests", "M920 M900 closure receipt.validation.focused");
  exact(validation.fullRepositorySuite, "PASS: 202 files; 926 tests", "M920 M900 closure receipt.validation.fullRepositorySuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M920 M900 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheckBeforeClosure, "PASS: 10/16; violations 0", "M920 M900 closure receipt.validation.workflowCheckBeforeClosure");
  exact(validation.diffCheck, "PASS: git diff --check", "M920 M900 closure receipt.validation.diffCheck");
  exactStrings(validation.semanticNegativeCoverage, ["equal content hash or semantic post-state drift", "foreign token descriptor drift", "Scene serialization/identity drift", "transition-authority drift"], "M920 M900 closure receipt.validation.semanticNegativeCoverage");
}

export function createProjectStage11TokenAssetSemanticRedoAggregateEvidence(input: unknown): ProjectStage11TokenAssetSemanticRedoAggregateEvidence {
  validateM900Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M920",
    sourceMilestone: "M900",
    evidenceLabel: "local",
    receipt: M900_RECEIPT,
    operation: "project.asset.register-token.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    contentHashChanged: true,
    assetTreePreserved: true,
    contentAddressedTokenRegistrationPreserved: true,
    scenePreserved: true,
    envelopeRotated: true,
    driftRejected: "token-asset/content/Scene/envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11TokenAssetSemanticRedoAggregateEvidence {
  const value = record(input, "M920 token-asset semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "contentHashChanged", "countsChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M920 aggregate evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION, "M920 aggregate evidence.schemaVersion");
  exact(value.milestone, "M920", "M920 aggregate evidence.milestone");
  exact(value.sourceMilestone, "M900", "M920 aggregate evidence.sourceMilestone");
  exact(value.evidenceLabel, "local", "M920 aggregate evidence.evidenceLabel");
  exact(value.receipt, M900_RECEIPT, "M920 aggregate evidence.receipt");
  exact(value.operation, "project.asset.register-token.redo", "M920 aggregate evidence.operation");
  exact(value.semantic, "redo-post-state", "M920 aggregate evidence.semantic");
  exact(value.driftRejected, "token-asset/content/Scene/envelope/readback identity drift", "M920 aggregate evidence.driftRejected");
  exact(value.aggregateAttachment, "one-producer-scoped-non-certifying", "M920 aggregate evidence.aggregateAttachment");
  exact(value.aggregateAuthority, "not-granted", "M920 aggregate evidence.aggregateAuthority");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "scenePreserved", "envelopeRotated", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M920 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M920 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M920 aggregate evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M920 aggregate evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M920 aggregate evidence.stage12Started");
  return value as ProjectStage11TokenAssetSemanticRedoAggregateEvidence;
}

export const projectStage11TokenAssetSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11TokenAssetSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11TokenAssetSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11TokenAssetSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
