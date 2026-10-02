import {
  bridgeProjectAddSceneInMemoryRedoToTerminalHistory,
  projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema,
  type ProjectAddSceneInMemoryRedoTerminalHistoryReceipt,
} from "./project-add-scene-in-memory-terminal-history";

export const PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M906_RECEIPT = "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11InMemoryAddSceneSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M906";
  evidenceLabel: "local";
  receipt: typeof M906_RECEIPT;
  status: "bounded-local";
  operation: "project.add-scene.commit-in-memory.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  revisionAdvanced: true;
  orderedSceneSetPreserved: true;
  sceneAppended: true;
  activeSceneSelected: true;
  nonPersistencePreserved: true;
  assetsPreserved: true;
  driftRejected: "project/Scene-set/matched-reread/persistence/authority drift";
  sourceReceipt: ProjectAddSceneInMemoryRedoTerminalHistoryReceipt;
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

export class ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function strictSource(input: unknown): ProjectAddSceneInMemoryRedoTerminalHistoryReceipt {
  const candidate = record(input, "M906 in-memory add-Scene redo source receipt");
  try {
    return candidate.disposition === "terminal-redone"
      ? projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema.parse(candidate)
      : bridgeProjectAddSceneInMemoryRedoToTerminalHistory(candidate);
  } catch (error) {
    blocked(`M906 in-memory add-Scene redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function createProjectStage11InMemoryAddSceneSemanticRedoEvidence(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  exact(sourceReceipt.operation, "dicebox.project.add-scene.commit-in-memory.redo", "M906 source receipt.operation");
  exact(sourceReceipt.matchedReread.status, "matched", "M906 source receipt.matchedReread.status");
  exact(sourceReceipt.matchedReread.targetId, sourceReceipt.projectId, "M906 source receipt.matchedReread.targetId");
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  const expectedSceneIds = [...beforeRedo.sceneIds];
  expectedSceneIds.splice(sourceReceipt.addedOrdinal - 1, 0, sourceReceipt.addedSceneId);
  if (afterRedo.sceneCount !== beforeRedo.sceneCount + 1) blocked("M906 in-memory add-Scene redo does not prove a later revision with one added Scene.");
  if (!sameStrings(afterRedo.sceneIds, expectedSceneIds) || afterRedo.activeSceneId !== sourceReceipt.addedSceneId) blocked("M906 in-memory add-Scene redo does not preserve the exact ordered Scene-set and active Scene transition.");
  if (afterRedo.scenesSha256 === beforeRedo.scenesSha256) blocked("M906 in-memory add-Scene redo does not prove a changed Scene-set identity.");
  if (sourceReceipt.projectContentWrite !== false || sourceReceipt.projectPersistenceWrite !== false || sourceReceipt.sceneContentRestored !== false || sourceReceipt.assetsPreserved !== true) blocked("M906 in-memory add-Scene redo does not preserve non-persistence and asset semantics.");
  if (beforeRedo.noWrite !== true || beforeRedo.noPersistenceWrite !== true || beforeRedo.noFoundryWrite !== true || afterRedo.noWrite !== true || afterRedo.noPersistenceWrite !== true || afterRedo.noFoundryWrite !== true) blocked("M906 in-memory add-Scene redo does not preserve no-write rereads.");
  if (sourceReceipt.authoritativeRereads.afterRedo.sceneCount !== sourceReceipt.matchedReread.revision || sourceReceipt.authoritativeRereads.afterRedo.scenesSha256 !== sourceReceipt.matchedReread.sha256) blocked("M906 matched reread does not match the authoritative afterRedo read.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_IN_MEMORY_ADD_SCENE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M906",
    evidenceLabel: "local",
    receipt: M906_RECEIPT,
    status: "bounded-local",
    operation: "project.add-scene.commit-in-memory.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    revisionAdvanced: true,
    orderedSceneSetPreserved: true,
    sceneAppended: true,
    activeSceneSelected: true,
    nonPersistencePreserved: true,
    assetsPreserved: true,
    driftRejected: "project/Scene-set/matched-reread/persistence/authority drift",
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

function parseEvidence(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoEvidence {
  const value = record(input, "M906 in-memory add-Scene semantic redo evidence");
  const expectedKeys = [
    "activeSceneSelected", "assetsPreserved", "driftRejected", "evidenceLabel", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "nonPersistencePreserved", "operation", "orderedSceneSetPreserved", "readOnly", "receipt", "readyClaim", "revisionAdvanced", "sceneAppended", "schemaVersion", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ] as const;
  const actualKeys = Object.keys(value).sort();
  const wantedKeys = [...expectedKeys].sort();
  if (actualKeys.length !== wantedKeys.length || actualKeys.some((key, index) => key !== wantedKeys[index])) blocked("M906 in-memory add-Scene semantic redo evidence contains unknown or missing fields.");
  const expected = createProjectStage11InMemoryAddSceneSemanticRedoEvidence(value.sourceReceipt);
  exact(value.schemaVersion, expected.schemaVersion, "M906 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M906 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M906 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M906 evidence.receipt");
  exact(value.status, expected.status, "M906 evidence.status");
  exact(value.operation, expected.operation, "M906 evidence.operation");
  exact(value.semantic, expected.semantic, "M906 evidence.semantic");
  for (const field of ["matchedReread", "revisionAdvanced", "orderedSceneSetPreserved", "sceneAppended", "activeSceneSelected", "nonPersistencePreserved", "assetsPreserved"] as const) exact(value[field], true, `M906 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M906 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M906 evidence.${field}`);
  exact(value.readyClaim, false, "M906 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M906 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M906 evidence.stage12Started");
  return { ...expected, sourceReceipt: expected.sourceReceipt };
}

export const projectStage11InMemoryAddSceneSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11InMemoryAddSceneSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11InMemoryAddSceneSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11InMemoryAddSceneSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
