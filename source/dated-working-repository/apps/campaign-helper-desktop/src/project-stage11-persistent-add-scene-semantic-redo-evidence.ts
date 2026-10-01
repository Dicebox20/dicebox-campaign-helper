import {
  bridgeProjectPersistentAddSceneRedoToTerminalHistory,
  projectPersistentAddSceneRedoTerminalHistoryReceiptSchema,
  type ProjectPersistentAddSceneRedoTerminalHistoryReceipt,
} from "./project-add-scene-terminal-history";

export const PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M912_RECEIPT = "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11PersistentAddSceneSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M912";
  evidenceLabel: "local";
  receipt: typeof M912_RECEIPT;
  status: "bounded-local";
  operation: "project.add-scene.persist.redo";
  semantic: "redo-post-state";
  sceneAppended: true;
  orderedSceneSetPreserved: true;
  activeSceneSelected: true;
  generationAdvanced: true;
  semanticContentChanged: true;
  assetCountPreserved: true;
  assetTreePreserved: true;
  byteEnvelopeRotated: true;
  matchedReread: true;
  driftRejected: "project/Scene-order/active-Scene/content/assets/byte-envelope/reread/authority drift";
  sourceReceipt: ProjectPersistentAddSceneRedoTerminalHistoryReceipt;
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

export class ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function strictSource(input: unknown): ProjectPersistentAddSceneRedoTerminalHistoryReceipt {
  const candidate = record(input, "M912 project.add-scene.persist redo source receipt");
  try {
    return candidate.disposition === "terminal-redone"
      ? projectPersistentAddSceneRedoTerminalHistoryReceiptSchema.parse(candidate)
      : bridgeProjectPersistentAddSceneRedoToTerminalHistory(candidate);
  } catch (error) {
    blocked(`M912 project.add-scene.persist redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function createProjectStage11PersistentAddSceneSemanticRedoEvidence(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  exact(sourceReceipt.operation, "dicebox.project.add-scene.persist.redo", "M912 source receipt.operation");
  exact(sourceReceipt.matchedReread.status, "matched", "M912 source receipt.matchedReread.status");
  exact(sourceReceipt.matchedReread.targetId, sourceReceipt.projectId, "M912 source receipt.matchedReread.targetId");

  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  if (sourceReceipt.addedOrdinal !== beforeRedo.sceneCount + 1) blocked("M912 redo does not preserve the exact one-based append ordinal.");
  if (afterRedo.generation !== beforeRedo.generation + 1) blocked("M912 redo does not prove one monotonic generation advance.");
  if (afterRedo.sceneCount !== beforeRedo.sceneCount + 1 || !sameStrings(afterRedo.sceneIds, [...beforeRedo.sceneIds, sourceReceipt.addedSceneId]) || afterRedo.activeSceneId !== sourceReceipt.addedSceneId) {
    blocked("M912 redo does not prove one ordered appended Scene with exact active-Scene selection.");
  }
  if (afterRedo.contentSha256 === beforeRedo.contentSha256 || afterRedo.scenesSha256 === beforeRedo.scenesSha256) blocked("M912 redo does not prove changed persisted Scene/content semantics.");
  if (afterRedo.assetCollectionSha256 !== beforeRedo.assetCollectionSha256 || JSON.stringify(afterRedo.assets) !== JSON.stringify(beforeRedo.assets)) blocked("M912 redo does not preserve the exact asset collection and tree.");
  if (afterRedo.primaryByteSha256 === beforeRedo.primaryByteSha256 || afterRedo.backupByteSha256 !== beforeRedo.primaryByteSha256) blocked("M912 redo does not prove the exact backup-preserving byte-envelope rotation.");
  if (sourceReceipt.projectContentWrite !== false || sourceReceipt.projectPersistenceWrite !== false || sourceReceipt.sceneContentRestored !== false || sourceReceipt.assetsPreserved !== true) blocked("M912 redo does not preserve non-mutation and asset semantics.");
  if (sourceReceipt.matchedReread.revision !== afterRedo.generation || sourceReceipt.matchedReread.sha256 !== afterRedo.contentSha256) blocked("M912 matched reread does not match the authoritative afterRedo read.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PERSISTENT_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M912",
    evidenceLabel: "local",
    receipt: M912_RECEIPT,
    status: "bounded-local",
    operation: "project.add-scene.persist.redo",
    semantic: "redo-post-state",
    sceneAppended: true,
    orderedSceneSetPreserved: true,
    activeSceneSelected: true,
    generationAdvanced: true,
    semanticContentChanged: true,
    assetCountPreserved: true,
    assetTreePreserved: true,
    byteEnvelopeRotated: true,
    matchedReread: true,
    driftRejected: "project/Scene-order/active-Scene/content/assets/byte-envelope/reread/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoEvidence {
  const value = record(input, "M912 project.add-scene.persist semantic redo evidence");
  const expectedKeys = [
    "activeSceneSelected", "assetCountPreserved", "assetTreePreserved", "byteEnvelopeRotated", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "orderedSceneSetPreserved", "readOnly", "receipt", "readyClaim", "sceneAppended", "schemaVersion", "semantic", "semanticContentChanged", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ] as const;
  const actualKeys = Object.keys(value).sort();
  const wantedKeys = [...expectedKeys].sort();
  if (actualKeys.length !== wantedKeys.length || actualKeys.some((key, index) => key !== wantedKeys[index])) blocked("M912 project.add-scene.persist semantic redo evidence contains unknown or missing fields.");
  const expected = createProjectStage11PersistentAddSceneSemanticRedoEvidence(value.sourceReceipt);
  exact(value.schemaVersion, expected.schemaVersion, "M912 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M912 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M912 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M912 evidence.receipt");
  exact(value.status, expected.status, "M912 evidence.status");
  exact(value.operation, expected.operation, "M912 evidence.operation");
  exact(value.semantic, expected.semantic, "M912 evidence.semantic");
  for (const field of ["sceneAppended", "orderedSceneSetPreserved", "activeSceneSelected", "generationAdvanced", "semanticContentChanged", "assetCountPreserved", "assetTreePreserved", "byteEnvelopeRotated", "matchedReread"] as const) exact(value[field], true, `M912 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M912 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M912 evidence.${field}`);
  exact(value.readyClaim, false, "M912 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M912 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M912 evidence.stage12Started");
  return { ...expected, sourceReceipt: expected.sourceReceipt };
}

export const projectStage11PersistentAddSceneSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11PersistentAddSceneSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11PersistentAddSceneSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11PersistentAddSceneSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
