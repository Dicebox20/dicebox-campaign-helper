export const PROJECT_STAGE11_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M890_RECEIPT = "outputs/m890-stage11-operation-specific-semantic-redo-composition-closure-receipt.json" as const;

type OperationSemantic = Readonly<{
  operation: "project.save" | "project.add-scene.persist";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  envelopeRotated: true;
  driftRejected: "content-hash/redo-receipt identity drift" | "Scene-set/readback identity drift";
  semanticHashChangedInFixture?: true;
  semanticHashValidation?: "shape-only";
  sceneAppended?: true;
  activeSceneSelected?: true;
  assetsPreserved?: true;
}>;

export type ProjectStage11SemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M890";
  evidenceLabel: "local";
  receipt: typeof M890_RECEIPT;
  status: "bounded-local";
  operationSemantics: readonly [OperationSemantic, OperationSemantic];
  saveSemanticHash: "shape-only";
  backupPromotionUndoRedo: "not-applicable-one-way";
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

export class ProjectStage11SemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11SemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11SemanticRedoEvidenceValidationError(message);
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

function operationSemantic(value: unknown, index: number): OperationSemantic {
  const item = record(value, `operationSemantics[${index}]`);
  if (index === 0) {
    exactKeys(item, ["driftRejected", "envelopeRotated", "generationAdvanced", "matchedReread", "operation", "semantic", "semanticHashChangedInFixture", "semanticHashValidation"], `operationSemantics[${index}]`);
    exact(item.operation, "project.save", `operationSemantics[${index}].operation`);
    exact(item.semantic, "redo-post-state", `operationSemantics[${index}].semantic`);
    exact(item.matchedReread, true, `operationSemantics[${index}].matchedReread`);
    exact(item.generationAdvanced, true, `operationSemantics[${index}].generationAdvanced`);
    exact(item.envelopeRotated, true, `operationSemantics[${index}].envelopeRotated`);
    exact(item.semanticHashChangedInFixture, true, `operationSemantics[${index}].semanticHashChangedInFixture`);
    exact(item.semanticHashValidation, "shape-only", `operationSemantics[${index}].semanticHashValidation`);
    exact(item.driftRejected, "content-hash/redo-receipt identity drift", `operationSemantics[${index}].driftRejected`);
    return {
      operation: "project.save",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      envelopeRotated: true,
      semanticHashChangedInFixture: true,
      semanticHashValidation: "shape-only",
      driftRejected: "content-hash/redo-receipt identity drift",
    };
  }
  exactKeys(item, ["activeSceneSelected", "assetsPreserved", "driftRejected", "envelopeRotated", "generationAdvanced", "matchedReread", "operation", "sceneAppended", "semantic"], `operationSemantics[${index}]`);
  exact(item.operation, "project.add-scene.persist", `operationSemantics[${index}].operation`);
  exact(item.semantic, "redo-post-state", `operationSemantics[${index}].semantic`);
  exact(item.matchedReread, true, `operationSemantics[${index}].matchedReread`);
  exact(item.generationAdvanced, true, `operationSemantics[${index}].generationAdvanced`);
  exact(item.envelopeRotated, true, `operationSemantics[${index}].envelopeRotated`);
  exact(item.sceneAppended, true, `operationSemantics[${index}].sceneAppended`);
  exact(item.activeSceneSelected, true, `operationSemantics[${index}].activeSceneSelected`);
  exact(item.assetsPreserved, true, `operationSemantics[${index}].assetsPreserved`);
  exact(item.driftRejected, "Scene-set/readback identity drift", `operationSemantics[${index}].driftRejected`);
  return {
    operation: "project.add-scene.persist",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    envelopeRotated: true,
    sceneAppended: true,
    activeSceneSelected: true,
    assetsPreserved: true,
    driftRejected: "Scene-set/readback identity drift",
  };
}

export function createProjectStage11SemanticRedoEvidence(input: unknown): ProjectStage11SemanticRedoEvidence {
  const value = record(input, "semantic redo evidence");
  exactKeys(value, [
    "backupPromotionUndoRedo", "evidenceLabel", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operationSemantics", "readOnly", "receipt", "readyClaim", "saveSemanticHash", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "semantic redo evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION, "semantic redo evidence.schemaVersion");
  exact(value.milestone, "M890", "semantic redo evidence.milestone");
  exact(value.evidenceLabel, "local", "semantic redo evidence.evidenceLabel");
  exact(value.receipt, M890_RECEIPT, "semantic redo evidence.receipt");
  exact(value.status, "bounded-local", "semantic redo evidence.status");
  exact(value.saveSemanticHash, "shape-only", "semantic redo evidence.saveSemanticHash");
  exact(value.backupPromotionUndoRedo, "not-applicable-one-way", "semantic redo evidence.backupPromotionUndoRedo");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `semantic redo evidence.${field}`);
  exact(value.readyClaim, false, "semantic redo evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "semantic redo evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "semantic redo evidence.stage12Started");
  if (!Array.isArray(value.operationSemantics) || value.operationSemantics.length !== 2) blocked("semantic redo evidence.operationSemantics must contain exactly two entries.");
  const operationSemantics = value.operationSemantics.map(operationSemantic) as [OperationSemantic, OperationSemantic];
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M890",
    evidenceLabel: "local",
    receipt: M890_RECEIPT,
    status: "bounded-local",
    operationSemantics,
    saveSemanticHash: "shape-only",
    backupPromotionUndoRedo: "not-applicable-one-way",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
  });
}

export const projectStage11SemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11SemanticRedoEvidence {
    return createProjectStage11SemanticRedoEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11SemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11SemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: createProjectStage11SemanticRedoEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11SemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11SemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
