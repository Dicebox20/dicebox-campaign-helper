import {
  projectCreateRedoTerminalHistoryReceiptSchema,
  type ProjectCreateRedoTerminalHistoryReceipt,
} from "./project-create-terminal-history";

export const PROJECT_STAGE11_CREATE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M904_RECEIPT = "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11CreateSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_CREATE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M904";
  evidenceLabel: "local";
  receipt: typeof M904_RECEIPT;
  status: "bounded-local";
  operation: "project.create.redo";
  semantic: "redo-post-state";
  targetAbsentBeforeRedo: true;
  targetPresentAfterRedo: true;
  generationAdvanced: true;
  firstGenerationContentIdentityPreserved: true;
  matchedReread: true;
  scenesPreserved: true;
  assetCollectionPreserved: true;
  driftRejected: "target/content/scenes/assets/reread identity drift";
  sourceReceipt: ProjectCreateRedoTerminalHistoryReceipt;
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

export class ProjectStage11CreateSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_CREATE_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11CreateSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11CreateSemanticRedoEvidenceValidationError(message);
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

function strictSource(input: unknown): ProjectCreateRedoTerminalHistoryReceipt {
  const candidate = record(input, "M904 project.create redo source receipt");
  const terminalKeys = [
    "applyAuthority", "authoritativeReread", "authoritativeRereadRequired", "authoritativeRereads", "authority", "batchId", "blocker", "bridgeOnly", "commandKind", "disposition", "execution", "foreignStatePreserved", "history", "historyStatus", "historyTransitions", "matchedReread", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "operation", "outcomeUnknown", "readyClaim", "rereadClassifier", "rereadInvocation", "retryAllowed", "schemaVersion", "sourceProjectContentWrite", "sourceReceipt", "status", "targetAuthority", "targetProjectId", "transitionInvocation",
  ] as const;
  if (candidate.disposition === "terminal-redone") {
    exactKeys(candidate, terminalKeys, "M904 terminal project.create redo receipt");
    input = {
      operation: candidate.operation,
      status: "PASS",
      targetProjectId: candidate.targetProjectId,
      batchId: candidate.batchId,
      beforeRedo: candidate.authoritativeRereads && record(candidate.authoritativeRereads, "M904 terminal authoritativeRereads").beforeRedo,
      afterRedo: candidate.authoritativeRereads && record(candidate.authoritativeRereads, "M904 terminal authoritativeRereads").afterRedo,
      matchedReread: candidate.matchedReread,
      history: candidate.history,
      sourceReceipt: candidate.sourceReceipt,
      noProjectMutation: candidate.noProjectMutation,
      noFoundryWrite: candidate.noFoundryWrite,
    };
  }
  let receipt: ProjectCreateRedoTerminalHistoryReceipt;
  try {
    receipt = projectCreateRedoTerminalHistoryReceiptSchema.parse(input);
  } catch (error) {
    blocked(`M904 project.create redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(receipt.operation, "dicebox.project.create.redo", "M904 source receipt.operation");
  exact(receipt.matchedReread.status, "matched", "M904 source receipt.matchedReread.status");
  exact(receipt.matchedReread.targetId, receipt.targetProjectId, "M904 source receipt.matchedReread.targetId");
  const afterRedo = receipt.authoritativeRereads.afterRedo.target;
  if (!afterRedo || receipt.matchedReread.revision !== afterRedo.generation || receipt.matchedReread.sha256 !== afterRedo.contentSha256) {
    blocked("M904 source receipt matched reread does not match the authoritative redone target.");
  }
  return receipt;
}

export function createProjectStage11CreateSemanticRedoEvidence(input: unknown): ProjectStage11CreateSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  const originalTarget = sourceReceipt.sourceReceipt.afterApply.target;
  const redoneTarget = afterRedo.target;
  if (beforeRedo.target !== null || beforeRedo.targetAbsent !== true) blocked("M904 project.create redo does not prove target absence before redo.");
  if (!redoneTarget || afterRedo.targetAbsent !== false || redoneTarget.projectId !== sourceReceipt.targetProjectId) blocked("M904 project.create redo does not prove target presence after redo.");
  if (!originalTarget || redoneTarget.generation <= originalTarget.generation) blocked("M904 project.create redo does not prove a later target generation.");
  if (redoneTarget.contentSha256 !== originalTarget.contentSha256 || redoneTarget.scenesSha256 !== originalTarget.scenesSha256 || redoneTarget.assetCollectionSha256 !== originalTarget.assetCollectionSha256) blocked("M904 project.create redo does not preserve first-generation content, Scene, and asset-collection identity.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_CREATE_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M904",
    evidenceLabel: "local",
    receipt: M904_RECEIPT,
    status: "bounded-local",
    operation: "project.create.redo",
    semantic: "redo-post-state",
    targetAbsentBeforeRedo: true,
    targetPresentAfterRedo: true,
    generationAdvanced: true,
    firstGenerationContentIdentityPreserved: true,
    matchedReread: true,
    scenesPreserved: true,
    assetCollectionPreserved: true,
    driftRejected: "target/content/scenes/assets/reread identity drift",
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

function parseEvidence(input: unknown): ProjectStage11CreateSemanticRedoEvidence {
  const value = record(input, "M904 project.create semantic redo evidence");
  exactKeys(value, [
    "assetCollectionPreserved", "driftRejected", "evidenceLabel", "firstGenerationContentIdentityPreserved", "generationAdvanced", "matchedReread", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "schemaVersion", "scenesPreserved", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status", "targetAbsentBeforeRedo", "targetPresentAfterRedo",
  ], "M904 project.create semantic redo evidence");
  const expected = createProjectStage11CreateSemanticRedoEvidence(value.sourceReceipt);
  const sourceReceipt = expected.sourceReceipt;
  exact(value.schemaVersion, expected.schemaVersion, "M904 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M904 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M904 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M904 evidence.receipt");
  exact(value.status, expected.status, "M904 evidence.status");
  exact(value.operation, expected.operation, "M904 evidence.operation");
  exact(value.semantic, expected.semantic, "M904 evidence.semantic");
  for (const field of ["targetAbsentBeforeRedo", "targetPresentAfterRedo", "generationAdvanced", "firstGenerationContentIdentityPreserved", "matchedReread", "scenesPreserved", "assetCollectionPreserved"] as const) exact(value[field], expected[field], `M904 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M904 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M904 evidence.${field}`);
  exact(value.readyClaim, false, "M904 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M904 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M904 evidence.stage12Started");
  return { ...expected, sourceReceipt };
}

export const projectStage11CreateSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11CreateSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11CreateSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11CreateSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11CreateSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11CreateSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
