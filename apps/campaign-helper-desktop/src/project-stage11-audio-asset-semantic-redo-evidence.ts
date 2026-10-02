import {
  projectAudioAssetRedoTerminalHistoryReceiptSchema,
  type ProjectAudioAssetRedoTerminalHistoryReceipt,
} from "./project-audio-asset-terminal-history";

export const PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M896_RECEIPT = "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11AudioAssetSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M896";
  evidenceLabel: "local";
  receipt: typeof M896_RECEIPT;
  status: "bounded-local";
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
  sourceReceipt: ProjectAudioAssetRedoTerminalHistoryReceipt;
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

export class ProjectStage11AudioAssetSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_AUDIO_ASSET_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11AudioAssetSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11AudioAssetSemanticRedoEvidenceValidationError(message);
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

function bridgeReceipt(input: unknown): ProjectAudioAssetRedoTerminalHistoryReceipt {
  let receipt: ProjectAudioAssetRedoTerminalHistoryReceipt;
  try {
    receipt = projectAudioAssetRedoTerminalHistoryReceiptSchema.parse(input);
  } catch (error) {
    blocked(`M896 audio-asset redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(receipt.operation, "dicebox.project.asset.register-audio.redo", "M896 source receipt.operation");
  exact(receipt.matchedReread.status, "matched", "M896 source receipt.matchedReread.status");
  exact(receipt.matchedReread.targetId, receipt.projectId, "M896 source receipt.matchedReread.targetId");
  if (receipt.matchedReread.revision !== receipt.authoritativeRereads.afterRedo.generation || receipt.matchedReread.sha256 !== receipt.authoritativeRereads.afterRedo.contentSha256) {
    blocked("M896 source receipt matched reread does not match the authoritative afterRedo state.");
  }
  return receipt;
}

export function createProjectStage11AudioAssetSemanticRedoEvidence(input: unknown): ProjectStage11AudioAssetSemanticRedoEvidence {
  const sourceReceipt = bridgeReceipt(input);
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("M896 audio-asset redo does not prove one monotonic generation advance.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256) blocked("M896 audio-asset redo does not prove a changed project content hash.");
  if (afterRedo.assetCount !== beforeRedo.assetCount || afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256) blocked("M896 audio-asset redo does not preserve the registered asset tree summary.");
  if (afterRedo.sceneContentSha256 !== beforeRedo.sceneContentSha256 || afterRedo.sceneCount !== beforeRedo.sceneCount || afterRedo.activeSceneId !== beforeRedo.activeSceneId) blocked("M896 audio-asset redo does not preserve the Scene summary.");
  if (afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256 || afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256) blocked("M896 audio-asset redo does not prove byte-envelope rotation.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_AUDIO_ASSET_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M896",
    evidenceLabel: "local",
    receipt: M896_RECEIPT,
    status: "bounded-local",
    operation: "project.asset.register-audio.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    contentHashChanged: true,
    assetTreePreserved: sourceReceipt.assetTreePreserved,
    approvedAudioRegistrationPreserved: true,
    scenePreserved: true,
    envelopeRotated: true,
    driftRejected: "audio-asset/content/Scene/envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11AudioAssetSemanticRedoEvidence {
  const value = record(input, "M896 audio-asset semantic redo evidence");
  exactKeys(value, [
    "approvedAudioRegistrationPreserved", "assetTreePreserved", "contentHashChanged", "driftRejected", "evidenceLabel", "envelopeRotated", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "scenePreserved", "schemaVersion", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "M896 audio-asset semantic redo evidence");
  const expected = createProjectStage11AudioAssetSemanticRedoEvidence(value.sourceReceipt);
  const sourceReceipt = expected.sourceReceipt;
  exact(value.schemaVersion, expected.schemaVersion, "M896 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M896 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M896 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M896 evidence.receipt");
  exact(value.status, expected.status, "M896 evidence.status");
  exact(value.operation, expected.operation, "M896 evidence.operation");
  exact(value.semantic, expected.semantic, "M896 evidence.semantic");
  exact(value.matchedReread, expected.matchedReread, "M896 evidence.matchedReread");
  exact(value.generationAdvanced, expected.generationAdvanced, "M896 evidence.generationAdvanced");
  exact(value.contentHashChanged, expected.contentHashChanged, "M896 evidence.contentHashChanged");
  exact(value.assetTreePreserved, expected.assetTreePreserved, "M896 evidence.assetTreePreserved");
  exact(value.approvedAudioRegistrationPreserved, expected.approvedAudioRegistrationPreserved, "M896 evidence.approvedAudioRegistrationPreserved");
  exact(value.scenePreserved, expected.scenePreserved, "M896 evidence.scenePreserved");
  exact(value.envelopeRotated, expected.envelopeRotated, "M896 evidence.envelopeRotated");
  exact(value.driftRejected, expected.driftRejected, "M896 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], expected[field], `M896 evidence.${field}`);
  exact(value.readyClaim, false, "M896 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M896 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M896 evidence.stage12Started");
  return { ...expected, sourceReceipt };
}

export const projectStage11AudioAssetSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11AudioAssetSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11AudioAssetSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11AudioAssetSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11AudioAssetSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11AudioAssetSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
