export const PROJECT_STAGE11_RENAME_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M902_RECEIPT = "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11RenameSemanticRedoAggregateEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_RENAME_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION;
  milestone: "M927";
  sourceMilestone: "M902";
  evidenceLabel: "local";
  receipt: typeof M902_RECEIPT;
  operation: "project.rename.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  displayNameChanged: true;
  contentPreserved: true;
  metadataEnvelopePreserved: true;
  byteHashRotation: "not-claimed";
  driftRejected: "display-name/content/metadata-envelope/readback identity drift";
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

export class ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError extends Error {
  readonly code = "STAGE11_RENAME_SEMANTIC_REDO_AGGREGATE_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError(message);
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

function validateM902Receipt(input: unknown): void {
  const receipt = record(input, "M927 M902 closure receipt");
  exactKeys(receipt, ["artifacts", "composition", "doesNotProve", "evidenceClass", "limits", "milestone", "next", "safety", "scope", "stage", "status", "validation"], "M927 M902 closure receipt");
  exact(receipt.milestone, "M902", "M927 M902 closure receipt.milestone");
  exact(receipt.stage, "proposal-approval-history", "M927 M902 closure receipt.stage");
  exact(receipt.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M927 M902 closure receipt.status");
  exact(receipt.evidenceClass, "local", "M927 M902 closure receipt.evidenceClass");
  exact(receipt.scope, "Compose the existing strict project.rename redo bridge with a typed semantic receipt using a deterministic in-memory fixture, limited to display-name, project-content, metadata-envelope, reread, and authority boundaries directly exposed by the bridge.", "M927 M902 closure receipt.scope");
  exact(receipt.next, "Perform one read-only reconciliation of M902 against the complete Stage 11 matrix; retain all counts and authority locks, then select at most one directly evidenced next gap.", "M927 M902 closure receipt.next");

  const composition = record(receipt.composition, "M927 M902 closure receipt.composition");
  exactKeys(composition, ["bridge", "byteHashRotation", "contentPreserved", "displayNameChanged", "driftRejected", "fixture", "generationAdvanced", "matchedReread", "metadataEnvelopePreserved", "operation", "semantic", "semanticLayer", "sourceReceiptStrictlyParsed"], "M927 M902 closure receipt.composition");
  exact(composition.bridge, "apps/campaign-helper-desktop/src/project-rename-terminal-history.ts", "M927 M902 closure receipt.composition.bridge");
  exact(composition.semanticLayer, "apps/campaign-helper-desktop/src/project-stage11-rename-semantic-redo-evidence.ts", "M927 M902 closure receipt.composition.semanticLayer");
  exact(composition.fixture, "tests/project-stage11-rename-semantic-redo-evidence.test.ts", "M927 M902 closure receipt.composition.fixture");
  exact(composition.operation, "project.rename.redo", "M927 M902 closure receipt.composition.operation");
  exact(composition.semantic, "redo-post-state", "M927 M902 closure receipt.composition.semantic");
  for (const field of ["sourceReceiptStrictlyParsed", "matchedReread", "generationAdvanced", "displayNameChanged", "contentPreserved", "metadataEnvelopePreserved"] as const) exact(composition[field], true, `M927 M902 closure receipt.composition.${field}`);
  exact(composition.driftRejected, "display-name/content/metadata-envelope/readback identity drift", "M927 M902 closure receipt.composition.driftRejected");
  exact(composition.byteHashRotation, "NOT_CLAIMED; rename bridge exposes metadata integrity flags but no byte hashes", "M927 M902 closure receipt.composition.byteHashRotation");

  const safety = record(receipt.safety, "M927 M902 closure receipt.safety");
  exactKeys(safety, ["backupPromotionUndoRedo", "foreignStatePreserved", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "readOnlyEvidence", "readyClaim", "stage11AcceptanceStatus", "stage12Started"], "M927 M902 closure receipt.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite", "foreignStatePreserved"] as const) exact(safety[field], true, `M927 M902 closure receipt.safety.${field}`);
  exact(safety.backupPromotionUndoRedo, "NOT_APPLICABLE_ONE_WAY", "M927 M902 closure receipt.safety.backupPromotionUndoRedo");
  exact(safety.readyClaim, false, "M927 M902 closure receipt.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M927 M902 closure receipt.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M927 M902 closure receipt.safety.stage12Started");

  const validation = record(receipt.validation, "M927 M902 closure receipt.validation");
  exactKeys(validation, ["diffCheck", "focused", "fullRepositorySuite", "packageTypeCheck", "relatedStage11EvidenceSuite", "semanticNegativeCoverage", "workflowCheckBeforeClosure"], "M927 M902 closure receipt.validation");
  exact(validation.focused, "PASS: 2 files; 6 tests", "M927 M902 closure receipt.validation.focused");
  exact(validation.relatedStage11EvidenceSuite, "PASS: 7 files; 20 tests", "M927 M902 closure receipt.validation.relatedStage11EvidenceSuite");
  exact(validation.fullRepositorySuite, "PASS: 203 files; 928 tests", "M927 M902 closure receipt.validation.fullRepositorySuite");
  exact(validation.packageTypeCheck, "PASS: npm run build:packages", "M927 M902 closure receipt.validation.packageTypeCheck");
  exact(validation.workflowCheckBeforeClosure, "PASS: 10/16; violations 0", "M927 M902 closure receipt.validation.workflowCheckBeforeClosure");
  exact(validation.diffCheck, "PASS: git diff --check", "M927 M902 closure receipt.validation.diffCheck");
  exactStrings(validation.semanticNegativeCoverage, ["authoritative metadata hash drift", "display-name/catalog identity drift", "metadata atomic-replace/directory-sync/backup-preservation drift", "transition-authority drift"], "M927 M902 closure receipt.validation.semanticNegativeCoverage");

  const artifacts = record(receipt.artifacts, "M927 M902 closure receipt.artifacts");
  exactKeys(artifacts, ["bridge", "bridgeTest", "focusedTest", "semanticLayer"], "M927 M902 closure receipt.artifacts");
  const artifactValues = {
    semanticLayer: ["apps/campaign-helper-desktop/src/project-stage11-rename-semantic-redo-evidence.ts", "40B65B735CE0060CF4C41944227945BEC6046619D76D21E43DD28A7DE3486420"],
    focusedTest: ["tests/project-stage11-rename-semantic-redo-evidence.test.ts", "D91AA229F43D894ED6A140C2CF2393A085EE2505933166A8D6572C15E6AE89E9"],
    bridge: ["apps/campaign-helper-desktop/src/project-rename-terminal-history.ts", "110BDFD74C2109AAA48DFC9F5BAEC38CEC0D3E5614317CEBB505422B6A18DFC9"],
    bridgeTest: ["tests/project-rename-terminal-history.test.ts", "C4B47668EE9BD36096A20BD86035C56CDD8B5D4C680D697ACFAB57656DDC9D9B"],
  } as const;
  for (const field of ["semanticLayer", "focusedTest", "bridge", "bridgeTest"] as const) {
    const artifact = record(artifacts[field], `M927 M902 closure receipt.artifacts.${field}`);
    exactKeys(artifact, ["path", "sha256"], `M927 M902 closure receipt.artifacts.${field}`);
    exact(artifact.path, artifactValues[field][0], `M927 M902 closure receipt.artifacts.${field}.path`);
    exact(artifact.sha256, artifactValues[field][1], `M927 M902 closure receipt.artifacts.${field}.sha256`);
  }

  const limits = record(receipt.limits, "M927 M902 closure receipt.limits");
  exactKeys(limits, ["aggregateCountsChanged", "aggregateSemanticAttachment", "foreignStateTouched", "playerPasswordsGenerated", "providerOrCredentialActivity", "readyClaim", "runtimeLaneReopened", "runtimeOrFoundryAction", "stage11AcceptanceStatus", "stage12Started"], "M927 M902 closure receipt.limits");
  for (const field of ["runtimeOrFoundryAction", "providerOrCredentialActivity", "playerPasswordsGenerated", "foreignStateTouched", "aggregateCountsChanged", "aggregateSemanticAttachment", "runtimeLaneReopened", "stage12Started", "readyClaim"] as const) exact(limits[field], false, `M927 M902 closure receipt.limits.${field}`);
  exact(limits.stage11AcceptanceStatus, "blocked", "M927 M902 closure receipt.limits.stage11AcceptanceStatus");

  exactStrings(receipt.doesNotProve, [
    "complete proposal, approval, history, or recovery authority across all producer families",
    "cross-producer aggregate authority or Stage 11 acceptance",
    "packaged/runtime, Foundry, GM, or player behavior",
    "byte-level envelope rotation for project.rename",
    "backup-promotion undo/redo support",
    "generic execution or project mutation",
    "Stage 12 entry",
    "Ready-to-Play",
  ], "M927 M902 closure receipt.doesNotProve");
}

export function createProjectStage11RenameSemanticRedoAggregateEvidence(input: unknown): ProjectStage11RenameSemanticRedoAggregateEvidence {
  validateM902Receipt(input);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_RENAME_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M927",
    sourceMilestone: "M902",
    evidenceLabel: "local",
    receipt: M902_RECEIPT,
    operation: "project.rename.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    displayNameChanged: true,
    contentPreserved: true,
    metadataEnvelopePreserved: true,
    byteHashRotation: "not-claimed",
    driftRejected: "display-name/content/metadata-envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11RenameSemanticRedoAggregateEvidence {
  const value = record(input, "M927 rename semantic-redo aggregate evidence");
  exactKeys(value, ["aggregateAttachment", "aggregateAuthority", "byteHashRotation", "contentPreserved", "countsChanged", "displayNameChanged", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "metadataEnvelopePreserved", "milestone", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "producerScopedOnly", "readOnly", "receipt", "readyClaim", "schemaVersion", "semantic", "sourceMilestone", "stage11AcceptanceStatus", "stage12Started"], "M927 aggregate evidence");
  for (const [field, expected] of Object.entries({
    schemaVersion: PROJECT_STAGE11_RENAME_SEMANTIC_REDO_AGGREGATE_EVIDENCE_SCHEMA_VERSION,
    milestone: "M927",
    sourceMilestone: "M902",
    evidenceLabel: "local",
    receipt: M902_RECEIPT,
    operation: "project.rename.redo",
    semantic: "redo-post-state",
    byteHashRotation: "not-claimed",
    driftRejected: "display-name/content/metadata-envelope/readback identity drift",
    aggregateAttachment: "one-producer-scoped-non-certifying",
    aggregateAuthority: "not-granted",
    stage11AcceptanceStatus: "blocked",
  } as const)) exact(value[field], expected, `M927 aggregate evidence.${field}`);
  for (const field of ["matchedReread", "generationAdvanced", "displayNameChanged", "contentPreserved", "metadataEnvelopePreserved", "producerScopedOnly", "readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M927 aggregate evidence.${field}`);
  exact(value.countsChanged, false, "M927 aggregate evidence.countsChanged");
  exact(value.readyClaim, false, "M927 aggregate evidence.readyClaim");
  exact(value.stage12Started, false, "M927 aggregate evidence.stage12Started");
  return value as ProjectStage11RenameSemanticRedoAggregateEvidence;
}

export const projectStage11RenameSemanticRedoAggregateEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11RenameSemanticRedoAggregateEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11RenameSemanticRedoAggregateEvidence }>
    | Readonly<{ success: false; error: ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError
        ? error
        : new ProjectStage11RenameSemanticRedoAggregateEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
