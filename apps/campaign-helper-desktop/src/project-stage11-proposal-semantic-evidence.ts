export const PROJECT_STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const M886_RECEIPT = "outputs/m886-stage11-operation-specific-undo-redo-semantic-composition-closure-receipt.json" as const;

type OperationSemantic = Readonly<{
  operation: "project.asset.bind.redo" | "project.recovery.backup-promote";
  semantic: "redo-post-state" | "committed-one-way";
  matchedReread: true;
  semanticDriftRejected: true;
}>;

export type ProjectStage11ProposalSemanticEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_SCHEMA_VERSION;
  milestone: "M886";
  evidenceLabel: "local";
  receipt: typeof M886_RECEIPT;
  status: "bounded-local";
  operationSemantics: readonly [OperationSemantic, OperationSemantic];
  assetBindingRedoSemantic: true;
  backupPromotionCommittedOneWay: true;
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

export class ProjectStage11ProposalSemanticEvidenceValidationError extends Error {
  readonly code = "STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11ProposalSemanticEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11ProposalSemanticEvidenceValidationError(message);
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
  exactKeys(item, ["matchedReread", "operation", "semantic", "semanticDriftRejected"], `operationSemantics[${index}]`);
  exact(item.matchedReread, true, `operationSemantics[${index}].matchedReread`);
  exact(item.semanticDriftRejected, true, `operationSemantics[${index}].semanticDriftRejected`);
  const operation = item.operation;
  const semantic = item.semantic;
  if (operation !== "project.asset.bind.redo" && operation !== "project.recovery.backup-promote") blocked(`operationSemantics[${index}].operation is not an M886 operation.`);
  if (semantic !== "redo-post-state" && semantic !== "committed-one-way") blocked(`operationSemantics[${index}].semantic is invalid.`);
  const expected: OperationSemantic = index === 0
    ? { operation: "project.asset.bind.redo", semantic: "redo-post-state", matchedReread: true, semanticDriftRejected: true }
    : { operation: "project.recovery.backup-promote", semantic: "committed-one-way", matchedReread: true, semanticDriftRejected: true };
  if (operation !== expected.operation || semantic !== expected.semantic) blocked(`operationSemantics[${index}] does not retain exact M886 operation semantics.`);
  return expected;
}

export function createProjectStage11ProposalSemanticEvidence(input?: unknown): ProjectStage11ProposalSemanticEvidence {
  if (input === undefined) {
    return Object.freeze({
      schemaVersion: PROJECT_STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_SCHEMA_VERSION,
      milestone: "M886",
      evidenceLabel: "local",
      receipt: M886_RECEIPT,
      status: "bounded-local",
      operationSemantics: [
        { operation: "project.asset.bind.redo", semantic: "redo-post-state", matchedReread: true, semanticDriftRejected: true },
        { operation: "project.recovery.backup-promote", semantic: "committed-one-way", matchedReread: true, semanticDriftRejected: true },
      ] as const,
      assetBindingRedoSemantic: true,
      backupPromotionCommittedOneWay: true,
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
  const value = record(input, "proposal semantic evidence");
  exactKeys(value, [
    "assetBindingRedoSemantic", "backupPromotionCommittedOneWay", "backupPromotionUndoRedo", "evidenceLabel", "milestone", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noTransitionAuthority", "nonCertifying", "operationSemantics", "receipt", "readOnly", "readyClaim", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "proposal semantic evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_SCHEMA_VERSION, "proposal semantic evidence.schemaVersion");
  exact(value.milestone, "M886", "proposal semantic evidence.milestone");
  exact(value.evidenceLabel, "local", "proposal semantic evidence.evidenceLabel");
  exact(value.receipt, M886_RECEIPT, "proposal semantic evidence.receipt");
  exact(value.status, "bounded-local", "proposal semantic evidence.status");
  exact(value.assetBindingRedoSemantic, true, "proposal semantic evidence.assetBindingRedoSemantic");
  exact(value.backupPromotionCommittedOneWay, true, "proposal semantic evidence.backupPromotionCommittedOneWay");
  exact(value.backupPromotionUndoRedo, "not-applicable-one-way", "proposal semantic evidence.backupPromotionUndoRedo");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `proposal semantic evidence.${field}`);
  exact(value.readyClaim, false, "proposal semantic evidence.readyClaim");
  exact(value.stage11AcceptanceStatus, "blocked", "proposal semantic evidence.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "proposal semantic evidence.stage12Started");
  if (!Array.isArray(value.operationSemantics) || value.operationSemantics.length !== 2) blocked("proposal semantic evidence.operationSemantics must contain exactly two entries.");
  const operationSemantics = value.operationSemantics.map(operationSemantic) as [OperationSemantic, OperationSemantic];
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_PROPOSAL_SEMANTIC_EVIDENCE_SCHEMA_VERSION,
    milestone: "M886",
    evidenceLabel: "local",
    receipt: M886_RECEIPT,
    status: "bounded-local",
    operationSemantics,
    assetBindingRedoSemantic: true,
    backupPromotionCommittedOneWay: true,
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

export const projectStage11ProposalSemanticEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11ProposalSemanticEvidence {
    return createProjectStage11ProposalSemanticEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11ProposalSemanticEvidence }>
    | Readonly<{ success: false; error: ProjectStage11ProposalSemanticEvidenceValidationError }> {
    try {
      return { success: true, data: createProjectStage11ProposalSemanticEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11ProposalSemanticEvidenceValidationError
        ? error
        : new ProjectStage11ProposalSemanticEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
