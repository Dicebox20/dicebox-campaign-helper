import {
  projectRenameRedoTerminalHistoryReceiptSchema,
  type ProjectRenameRedoTerminalHistoryReceipt,
} from "./project-rename-terminal-history";

export const PROJECT_STAGE11_RENAME_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M902_RECEIPT = "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json" as const;

export type ProjectStage11RenameSemanticRedoEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_RENAME_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION;
  milestone: "M902";
  evidenceLabel: "local";
  receipt: typeof M902_RECEIPT;
  status: "bounded-local";
  operation: "project.rename.redo";
  semantic: "redo-post-state";
  matchedReread: true;
  generationAdvanced: true;
  displayNameChanged: true;
  contentPreserved: true;
  metadataEnvelopePreserved: true;
  driftRejected: "display-name/content/metadata-envelope/readback identity drift";
  sourceReceipt: ProjectRenameRedoTerminalHistoryReceipt;
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

export class ProjectStage11RenameSemanticRedoEvidenceValidationError extends Error {
  readonly code = "STAGE11_RENAME_SEMANTIC_REDO_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11RenameSemanticRedoEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11RenameSemanticRedoEvidenceValidationError(message);
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

function strictSource(input: unknown): ProjectRenameRedoTerminalHistoryReceipt {
  let receipt: ProjectRenameRedoTerminalHistoryReceipt;
  try {
    receipt = projectRenameRedoTerminalHistoryReceiptSchema.parse(input);
  } catch (error) {
    blocked(`M902 project.rename redo source receipt is not strict terminal-history evidence: ${error instanceof Error ? error.message : String(error)}`);
  }
  exact(receipt.operation, "dicebox.project.rename.redo", "M902 source receipt.operation");
  exact(receipt.matchedReread.status, "matched", "M902 source receipt.matchedReread.status");
  exact(receipt.matchedReread.targetId, receipt.projectId, "M902 source receipt.matchedReread.targetId");
  if (receipt.matchedReread.revision !== receipt.authoritativeRereads.afterRedo.workspaceIndexGeneration || receipt.matchedReread.sha256 !== receipt.authoritativeRereads.afterRedo.authoritativeStateSha256) {
    blocked("M902 source receipt matched reread does not match the authoritative afterRedo state.");
  }
  return receipt;
}

export function createProjectStage11RenameSemanticRedoEvidence(input: unknown): ProjectStage11RenameSemanticRedoEvidence {
  const sourceReceipt = strictSource(input);
  const beforeRedo = sourceReceipt.authoritativeRereads.beforeRedo;
  const afterRedo = sourceReceipt.authoritativeRereads.afterRedo;
  if (beforeRedo.displayName === afterRedo.displayName || beforeRedo.displayName !== sourceReceipt.currentDisplayName || afterRedo.displayName !== sourceReceipt.proposedDisplayName) {
    blocked("M902 project.rename redo does not prove the exact display-name transition.");
  }
  if (afterRedo.workspaceIndexGeneration !== beforeRedo.workspaceIndexGeneration + 1) blocked("M902 project.rename redo does not prove one monotonic metadata-generation advance.");
  if (afterRedo.generation !== beforeRedo.generation || afterRedo.contentSha256 !== beforeRedo.contentSha256) blocked("M902 project.rename redo does not preserve project content generation and hash.");
  if (afterRedo.authoritativeStateSha256 === beforeRedo.authoritativeStateSha256) blocked("M902 project.rename redo does not prove a distinct authoritative metadata state.");
  const redoReceipt = sourceReceipt.redoReceipt;
  if (redoReceipt.atomicReplace !== true || redoReceipt.directoryEntrySync !== true || redoReceipt.backupPreserved !== true) blocked("M902 project.rename redo does not preserve the strict metadata-envelope integrity flags.");

  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_RENAME_SEMANTIC_REDO_EVIDENCE_SCHEMA_VERSION,
    milestone: "M902",
    evidenceLabel: "local",
    receipt: M902_RECEIPT,
    status: "bounded-local",
    operation: "project.rename.redo",
    semantic: "redo-post-state",
    matchedReread: true,
    generationAdvanced: true,
    displayNameChanged: true,
    contentPreserved: true,
    metadataEnvelopePreserved: true,
    driftRejected: "display-name/content/metadata-envelope/readback identity drift",
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

function parseEvidence(input: unknown): ProjectStage11RenameSemanticRedoEvidence {
  const value = record(input, "M902 project.rename semantic redo evidence");
  exactKeys(value, [
    "contentPreserved", "displayNameChanged", "driftRejected", "evidenceLabel", "generationAdvanced", "matchedReread", "metadataEnvelopePreserved", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operation", "readOnly", "receipt", "readyClaim", "schemaVersion", "semantic", "sourceReceipt", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "M902 project.rename semantic redo evidence");
  const expected = createProjectStage11RenameSemanticRedoEvidence(value.sourceReceipt);
  const sourceReceipt = expected.sourceReceipt;
  exact(value.schemaVersion, expected.schemaVersion, "M902 evidence.schemaVersion");
  exact(value.milestone, expected.milestone, "M902 evidence.milestone");
  exact(value.evidenceLabel, expected.evidenceLabel, "M902 evidence.evidenceLabel");
  exact(value.receipt, expected.receipt, "M902 evidence.receipt");
  exact(value.status, expected.status, "M902 evidence.status");
  exact(value.operation, expected.operation, "M902 evidence.operation");
  exact(value.semantic, expected.semantic, "M902 evidence.semantic");
  for (const field of ["matchedReread", "generationAdvanced", "displayNameChanged", "contentPreserved", "metadataEnvelopePreserved"] as const) exact(value[field], expected[field], `M902 evidence.${field}`);
  exact(value.driftRejected, expected.driftRejected, "M902 evidence.driftRejected");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M902 evidence.${field}`);
  exact(value.readyClaim, false, "M902 evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "M902 evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M902 evidence.stage12Started");
  return { ...expected, sourceReceipt };
}

export const projectStage11RenameSemanticRedoEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11RenameSemanticRedoEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11RenameSemanticRedoEvidence }>
    | Readonly<{ success: false; error: ProjectStage11RenameSemanticRedoEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11RenameSemanticRedoEvidenceValidationError
        ? error
        : new ProjectStage11RenameSemanticRedoEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
