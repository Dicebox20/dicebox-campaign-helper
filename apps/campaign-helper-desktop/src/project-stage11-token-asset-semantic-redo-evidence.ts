import {
  projectTokenAssetRedoTerminalHistoryReceiptSchema,
  type ProjectTokenAssetRedoTerminalHistoryReceipt,
} from "./project-token-asset-terminal-history";

export const PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M900_RECEIPT = "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11TokenAssetSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M900";
  evidenceLabel: "local";
  receipt: typeof M900_RECEIPT;
  status: "bounded-local";
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
  sourceReceipt: ProjectTokenAssetRedoTerminalHistoryReceipt;
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

export class ProjectStage11TokenAssetSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_TOKEN_ASSET_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11TokenAssetSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11TokenAssetSemanticRedoEvidenceValidationError(message);
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

function bridgeReceipt(input: unknown): ProjectTokenAssetRedoTerminalHistoryReceipt {
  let receipt: ProjectTokenAssetRedoTerminalHistoryReceipt;
  try {
    receipt = projectTokenAssetRedoTerminalHistoryReceiptSchema.parse(input);
  } catch (error) {
    blocked(`M900 token-asset redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(receipt.operation, "dicebox.project.asset.register-token.redo", "M900 source receipt.operation");
  exact(receipt.matchedReread.status, "matched", "M900 source receipt.matchedReread.status");
  exact(receipt.matchedReread.targetId, receipt.projectId, "M900 source receipt.matchedReread.targetId");
  if (receipt.matchedReread.revision !== receipt.authoritativeRereads.afterRedo.generation || receipt.matchedReread.sha256 !== receipt.authoritativeRereads.afterRedo.contentSha256) {
    blocked("M900 source receipt matched reread does not match the authoritative afterRedo state.");
  }
  return receipt;
}

export function createProjectStage11TokenAssetSemanticRedoEvidence(input: unknown): ProjectStage11TokenAssetSemanticRedoEvidence {
  const sourceReceipt = bridgeReceipt(input);
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("M900 token-asset redo does not prove one monotonic generation advance.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256) blocked("M900 token-asset redo does not prove a changed project content hash.");
  if (afterRedo.assetCount !== beforeRedo.assetCount || afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256) blocked("M900 token-asset redo does not preserve the registered asset tree summary.");
  if (afterRedo.sceneContentSha256 !== beforeRedo.sceneContentSha256 || afterRedo.sceneCount !== beforeRedo.sceneCount || afterRedo.activeSceneId !== beforeRedo.activeSceneId || JSON.stringify(afterRedo.project.scenesJson) !== JSON.stringify(beforeRedo.project.scenesJson)) blocked("M900 token-asset redo does not preserve the exact Scene collection and active selection.");
  const beforeAsset = beforeRedo.assets.find((asset) => asset.sha256 === sourceReceipt.asset.assetSha256);
  const afterAsset = afterRedo.assets.find((asset) => asset.sha256 === sourceReceipt.asset.assetSha256);
  if (!beforeAsset || !afterAsset || beforeAsset.mediaType !== sourceReceipt.asset.mediaType || afterAsset.mediaType !== sourceReceipt.asset.mediaType || beforeAsset.relativePath !== afterAsset.relativePath || beforeAsset.registration?.assetId !== sourceReceipt.asset.assetId || afterAsset.registration?.assetId !== sourceReceipt.asset.assetId || beforeAsset.registration?.role !== "token" || afterAsset.registration?.role !== "token" || beforeAsset.registration?.label !== sourceReceipt.asset.label || afterAsset.registration?.label !== sourceReceipt.asset.label || beforeAsset.registration?.provenance !== sourceReceipt.asset.provenance || afterAsset.registration?.provenance !== sourceReceipt.asset.provenance) blocked("M900 token-asset redo does not preserve the exact content-addressed token registration.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("M900 token-asset redo does not prove byte-envelope rotation.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_TOKEN_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M900",
    evidenceLabel: "local",
    receipt: M900_RECEIPT,
    status: "bounded-local",
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

function parseEvidence(input: unknown): ProjectStage11TokenAssetSemanticRedoEvidence {
  const value = record(input, "M900 token-asset semantic redo evidence");
  exactKeys(value, [
    "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "contentHashChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "M900 token-asset semantic redo evidence");
  const expected = createProjectStage11TokenAssetSemanticRedoEvidence(value.sourceReceipt);
  const sourceReceipt = expected.sourceReceipt;
  exact(value.schemaVersion, expected.schemaVersion, "M900 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M900 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M900 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M900 evidence.receipt");
  exact(value.status, expected.status, "M900 evidence.status");
  exact(value.operation, expected.operation, "M900 evidence.operation");
  exact(value.semantic, expected.semantic, "M900 evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "contentHashChanged", "assetTreePreserved", "contentAddressedTokenRegistrationPreserved", "scenePreserved", "envelopeRotated"] as const) exact(value[field], expected[field], `M900 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M900 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], expected[field], `M900 evidence.${field}`);
  exact(value.readyClaim, false, "M900 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M900 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M900 evidence.stage12Started");
  return { ...expected, sourceReceipt };
}

export const projectStage11TokenAssetSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11TokenAssetSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11TokenAssetSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11TokenAssetSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11TokenAssetSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11TokenAssetSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
