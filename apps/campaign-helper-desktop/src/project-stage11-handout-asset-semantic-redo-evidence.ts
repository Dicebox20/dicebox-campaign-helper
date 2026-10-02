import {
  projectHandoutAssetRedoTerminalHistoryReceiptSchema,
  type ProjectHandoutAssetRedoTerminalHistoryReceipt,
} from "./project-handout-asset-terminal-history";

export const PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M898_RECEIPT = "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11HandoutAssetSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M898";
  evidenceLabel: "local";
  receipt: typeof M898_RECEIPT;
  status: "bounded-local";
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
  sourceReceipt: ProjectHandoutAssetRedoTerminalHistoryReceipt;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
}>;

export class ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError(message);
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

function strictSource(input: unknown): ProjectHandoutAssetRedoTerminalHistoryReceipt {
  let receipt: ProjectHandoutAssetRedoTerminalHistoryReceipt;
  try {
    receipt = projectHandoutAssetRedoTerminalHistoryReceiptSchema.parse(input);
  } catch (error) {
    blocked(`M898 handout-asset redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(receipt.operation, "dicebox.project.asset.register-handout.redo", "M898 source receipt.operation");
  exact(receipt.matchedReread.status, "matched", "M898 source receipt.matchedReread.status");
  exact(receipt.matchedReread.targetId, receipt.projectId, "M898 source receipt.matchedReread.targetId");
  if (receipt.matchedReread.revision !== receipt.authoritativeRereads.afterRedo.generation || receipt.matchedReread.sha256 !== receipt.authoritativeRereads.afterRedo.contentSha256) {
    blocked("M898 source receipt matched reread does not match the authoritative afterRedo state.");
  }
  return receipt;
}

export function createProjectStage11HandoutAssetSemanticRedoEvidence(input: unknown): ProjectStage11HandoutAssetSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("M898 handout-asset redo does not prove one monotonic generation advance.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256) blocked("M898 handout-asset redo does not prove a changed project content hash.");
  if (afterRedo.assetCount !== beforeRedo.assetCount || afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256) blocked("M898 handout-asset redo does not preserve the registered asset tree summary.");
  if (afterRedo.sceneContentSha256 !== beforeRedo.sceneContentSha256 || afterRedo.sceneCount !== beforeRedo.sceneCount || afterRedo.activeSceneId !== beforeRedo.activeSceneId) blocked("M898 handout-asset redo does not preserve the Scene summary.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("M898 handout-asset redo does not prove byte-envelope rotation.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_HANDOUT_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M898",
    evidenceLabel: "local",
    receipt: M898_RECEIPT,
    status: "bounded-local",
    operation: "project.asset.register-handout.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    contentHashChanged: true,
    assetTreePreserved: sourceReceipt.assetTreePreserved,
    contentAddressedHandoutRegistrationPreserved: true,
    scenePreserved: true,
    envelopeRotated: true,
    driftRejected: "handout-asset/content/Scene/envelope/readback identity drift",
    sourceReceipt,
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: sourceReceipt.noExecutionAuthority,
    noTransitionAuthority: sourceReceipt.noTransitionAuthority,
    noGenericExecutor: sourceReceipt.noGenericExecutor,
    noFoundryWrite: sourceReceipt.noFoundryWrite,
    noProjectMutation: sourceReceipt.noProjectMutation,
    readyClaim: sourceReceipt.readyClaim,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}

function parseEvidence(input: unknown): ProjectStage11HandoutAssetSemanticRedoEvidence {
  const value = record(input, "M898 handout-asset semantic redo evidence");
  exactKeys(value, [
    "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "contentHashChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "M898 handout-asset semantic redo evidence");
  const expected = createProjectStage11HandoutAssetSemanticRedoEvidence(value.sourceReceipt);
  const sourceReceipt = expected.sourceReceipt;
  exact(value.schemaVersion, expected.schemaVersion, "M898 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M898 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M898 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M898 evidence.receipt");
  exact(value.status, expected.status, "M898 evidence.status");
  exact(value.operation, expected.operation, "M898 evidence.operation");
  exact(value.semantic, expected.semantic, "M898 evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedHandoutRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(value[field], expected[field], `M898 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M898 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], expected[field], `M898 evidence.${field}`);
  exact(value.readyClaim, false, "M898 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M898 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M898 evidence.stage12Started");
  return { ...expected, sourceReceipt };
}

export const projectStage11HandoutAssetSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11HandoutAssetSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11HandoutAssetSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11HandoutAssetSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
