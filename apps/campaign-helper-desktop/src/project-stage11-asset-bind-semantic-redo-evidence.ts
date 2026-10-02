import {
  bridgeProjectAssetBindingRedoToTerminalHistory,
  projectAssetBindingRedoTerminalHistoryReceiptSchema,
  type ProjectAssetBindingRedoTerminalHistoryReceipt,
} from "./project-asset-binding-terminal-history";

export const PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M908_RECEIPT = "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11AssetBindSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M908";
  evidenceLabel: "local";
  receipt: typeof M908_RECEIPT;
  status: "bounded-local";
  operation: "project.asset.bind.redo";
  semantic: "redo-post-state";
  assetDescriptorPreserved: true;
  bindingTransitionPreserved: true;
  matchedReread: true;
  generationAdvanced: true;
  assetCountPreserved: true;
  sceneCollectionPreserved: true;
  assetTreePreserved: true;
  assetBytesNonPersistentOnRedo: true;
  semanticContentChanged: true;
  byteEnvelopeRotated: true;
  driftRejected: "asset-descriptor/binding/content/Scene/asset-tree/reread/authority drift";
  sourceReceipt: ProjectAssetBindingRedoTerminalHistoryReceipt;
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

export class ProjectStage11AssetBindSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_ASSET_BIND_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11AssetBindSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11AssetBindSemanticRedoEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function strictSource(input: unknown): ProjectAssetBindingRedoTerminalHistoryReceipt {
  const candidate = record(input, "M908 project.asset.bind redo source receipt");
  try {
    return candidate.disposition === "terminal-redone"
      ? projectAssetBindingRedoTerminalHistoryReceiptSchema.parse(candidate)
      : bridgeProjectAssetBindingRedoToTerminalHistory(candidate);
  } catch (error) {
    blocked(`M908 project.asset.bind redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function createProjectStage11AssetBindSemanticRedoEvidence(input: unknown): ProjectStage11AssetBindSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  exact(sourceReceipt.operation, "dicebox.project.asset.bind.redo", "M908 source receipt.operation");
  exact(sourceReceipt.matchedReread.status, "matched", "M908 source receipt.matchedReread.status");
  exact(sourceReceipt.matchedReread.targetId, sourceReceipt.projectId, "M908 source receipt.matchedReread.targetId");
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  const beforeBinding = beforeRedo.backgroundBindings.find((binding) => binding.sceneId === sourceReceipt.asset.sceneId);
  const afterBinding = afterRedo.backgroundBindings.find((binding) => binding.sceneId === sourceReceipt.asset.sceneId);
  if (!beforeBinding || beforeBinding.assetId === sourceReceipt.asset.assetId || afterBinding?.assetId !== sourceReceipt.asset.assetId) blocked("M908 project.asset.bind redo does not preserve the exact content-addressed binding transition.");
  if (afterRedo.generation !== beforeRedo.generation + 1 || afterRedo.assetCount !== beforeRedo.assetCount) blocked("M908 project.asset.bind redo does not prove monotonic generation with a preserved asset count.");
  if (afterRedo.sceneCount !== beforeRedo.sceneCount || afterRedo.activeSceneId !== beforeRedo.activeSceneId) blocked("M908 project.asset.bind redo does not preserve the exact Scene collection and active selection.");
  if (afterRedo.contentSha256 === beforeRedo.contentSha256 || afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256) blocked("M908 project.asset.bind redo does not prove changed semantic content with a preserved asset collection.");
  if (sourceReceipt.projectContentWrite !== false || sourceReceipt.assetBytesPersisted !== false || sourceReceipt.sceneContentRestored !== false || sourceReceipt.assetTreePreserved !== true) blocked("M908 project.asset.bind redo does not preserve non-persistence, asset-tree, and Scene semantics.");
  if (afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256 || afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256) blocked("M908 project.asset.bind redo does not prove the exact backup-preserving byte-envelope rotation.");
  if (afterRedo.contentSha256 !== sourceReceipt.matchedReread.sha256 || afterRedo.generation !== sourceReceipt.matchedReread.revision) blocked("M908 matched reread does not match the authoritative afterRedo read.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_ASSET_BIND_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M908",
    evidenceLabel: "local",
    receipt: M908_RECEIPT,
    status: "bounded-local",
    operation: "project.asset.bind.redo",
    semantic: "redo-post-state",
    assetDescriptorPreserved: true,
    bindingTransitionPreserved: true,
    matchedReread: true,
    generationAdvanced: true,
    assetCountPreserved: true,
    sceneCollectionPreserved: true,
    assetTreePreserved: true,
    assetBytesNonPersistentOnRedo: true,
    semanticContentChanged: true,
    byteEnvelopeRotated: true,
    driftRejected: "asset-descriptor/binding/content/Scene/asset-tree/reread/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11AssetBindSemanticRedoEvidence {
  const value = record(input, "M908 project.asset.bind semantic redo evidence");
  const expectedKeys = [
    "assetBytesNonPersistentOnRedo", "assetCountPreserved", "assetDescriptorPreserved", "assetTreePreserved", "bindingTransitionPreserved", "byteEnvelopeRotated", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "schemaVersion", "sceneCollectionPreserved", "semantic", "semanticContentChanged", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ] as const;
  const actualKeys = Object.keys(value).sort();
  const wantedKeys = [...expectedKeys].sort();
  if (actualKeys.length !== wantedKeys.length || actualKeys.some((key, index) => key !== wantedKeys[index])) blocked("M908 project.asset.bind semantic redo evidence contains unknown or missing fields.");
  const expected = createProjectStage11AssetBindSemanticRedoEvidence(value.sourceReceipt);
  exact(value.schemaVersion, expected.schemaVersion, "M908 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M908 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M908 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M908 evidence.receipt");
  exact(value.status, expected.status, "M908 evidence.status");
  exact(value.operation, expected.operation, "M908 evidence.operation");
  exact(value.semantic, expected.semantic, "M908 evidence.semantic");
  for (const field of ["assetDescriptorPreserved", "bindingTransitionPreserved", "matchedReread", "generationAdvanced", "assetCountPreserved", "sceneCollectionPreserved", "assetTreePreserved", "assetBytesNonPersistentOnRedo", "semanticContentChanged", "byteEnvelopeRotated"] as const) exact(value[field], true, `M908 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M908 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M908 evidence.${field}`);
  exact(value.readyClaim, false, "M908 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M908 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M908 evidence.stage12Started");
  return { ...expected, sourceReceipt: expected.sourceReceipt };
}

export const projectStage11AssetBindSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11AssetBindSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11AssetBindSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11AssetBindSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11AssetBindSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11AssetBindSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
