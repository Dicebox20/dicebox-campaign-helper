import {
  projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema,
} from "./project-stage11-cross-producer-lifecycle-continuity-boundary-evidence";

export const PROJECT_STAGE11_DIRECT_COMMITTED_RECOVERED_CROSS_PRODUCER_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

export type ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_DIRECT_COMMITTED_RECOVERED_CROSS_PRODUCER_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION;
  milestone: "M1014";
  evidenceLabel: "local";
  sourceReceiptKind: "ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence";
  sourceBoundaryMilestone: "M1012";
  disposition: "direct-committed-recovered-continuity-not-proven";
  operationCount: 14;
  terminalHistoryIndexCount: 14;
  reviewTerminalEvidenceCount: 42;
  applyingUnknownEvidenceCount: 42;
  recoveryResultEvidenceCount: 56;
  undoRedoEvidenceCount: 28;
  handlerClassifierAggregateAttachments: 10;
  semanticAggregateAttachments: 9;
  currentAuthorityRedoEntries: 9;
  stage11MatrixRedoBindings: 8;
  aggregateDirectStrandCount: 9;
  currentAuthority: "PARTIAL";
  aggregateAuthority: "NOT_GRANTED";
  directObservationKinds: readonly ["program-scene.inverse", "program-scene.forward"];
  modeledOnly: true;
  crossProducerContinuity: "unproven";
  committedRecoveredContinuity: "not-proven";
  directCommittedRecoveredEvidence: "not-directly-observed";
  provenanceStatus: "exact-m1012-boundary";
  readOnly: true;
  nonCertifying: true;
  noAuthorityGrant: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noRecoveryAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  readyClaim: false;
}>;

export class ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError extends Error {
  readonly code = "STAGE11_DIRECT_COMMITTED_RECOVERED_CROSS_PRODUCER_CONTINUITY_BOUNDARY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function exactStrings(value: unknown, expected: readonly string[], label: string): void {
  if (!Array.isArray(value) || value.length !== expected.length || value.some((entry, index) => entry !== expected[index])) blocked(`${label} must match the exact approved ordered list.`);
}

function validateM1012Boundary(input: unknown): void {
  const boundary = projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema.parse(input);
  exact(boundary.milestone, "M1012", "M1012 boundary.milestone");
  exact(boundary.sourceReceiptKind, "ProjectCrossProducerLifecycleContinuityEvidenceReceipt", "M1012 boundary.sourceReceiptKind");
  exact(boundary.disposition, "modeled-cross-producer-partial", "M1012 boundary.disposition");
  for (const [field, expected] of [
    ["operationCount", 14],
    ["terminalHistoryIndexCount", 14],
    ["reviewTerminalEvidenceCount", 42],
    ["applyingUnknownEvidenceCount", 42],
    ["recoveryResultEvidenceCount", 56],
    ["undoRedoEvidenceCount", 28],
    ["handlerClassifierAggregateAttachments", 10],
    ["semanticAggregateAttachments", 9],
    ["currentAuthorityRedoEntries", 9],
    ["stage11MatrixRedoBindings", 8],
    ["aggregateDirectStrandCount", 9],
  ] as const) exact(boundary[field], expected, `M1012 boundary.${field}`);
  exact(boundary.currentAuthority, "PARTIAL", "M1012 boundary.currentAuthority");
  exact(boundary.aggregateAuthority, "NOT_GRANTED", "M1012 boundary.aggregateAuthority");
  exactStrings(boundary.directObservationKinds, ["program-scene.inverse", "program-scene.forward"], "M1012 boundary.directObservationKinds");
  exact(boundary.modeledOnly, true, "M1012 boundary.modeledOnly");
  exact(boundary.crossProducerContinuity, "unproven", "M1012 boundary.crossProducerContinuity");
  exact(boundary.committedRecoveredContinuity, "not-proven", "M1012 boundary.committedRecoveredContinuity");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(boundary[field], true, `M1012 boundary.${field}`);
  exact(boundary.stage11AcceptanceStatus, "blocked", "M1012 boundary.stage11AcceptanceStatus");
  exact(boundary.stage12Started, false, "M1012 boundary.stage12Started");
  exact(boundary.readyClaim, false, "M1012 boundary.readyClaim");
}

function parseEvidence(input: unknown): ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence {
  const value = record(input, "M1014 direct continuity boundary evidence");
  const expectedKeys = [
    "aggregateAuthority", "aggregateDirectStrandCount", "applyingUnknownEvidenceCount", "committedRecoveredContinuity", "crossProducerContinuity", "currentAuthority", "currentAuthorityRedoEntries", "directCommittedRecoveredEvidence", "directObservationKinds", "disposition", "evidenceLabel", "handlerClassifierAggregateAttachments", "linkageStatus", "milestone", "modeledOnly", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noRecoveryAuthority", "noTransitionAuthority", "nonCertifying", "operationCount", "provenanceStatus", "readOnly", "readyClaim", "recoveryResultEvidenceCount", "reviewTerminalEvidenceCount", "schemaVersion", "semanticAggregateAttachments", "sourceBoundaryMilestone", "sourceReceiptKind", "stage11AcceptanceStatus", "stage11MatrixRedoBindings", "stage12Started", "terminalHistoryIndexCount", "undoRedoEvidenceCount"
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1014 direct continuity boundary evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_DIRECT_COMMITTED_RECOVERED_CROSS_PRODUCER_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION, "M1014.schemaVersion");
  exact(value.milestone, "M1014", "M1014.milestone");
  exact(value.evidenceLabel, "local", "M1014.evidenceLabel");
  exact(value.sourceReceiptKind, "ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence", "M1014.sourceReceiptKind");
  exact(value.sourceBoundaryMilestone, "M1012", "M1014.sourceBoundaryMilestone");
  exact(value.disposition, "direct-committed-recovered-continuity-not-proven", "M1014.disposition");
  for (const [field, expected] of [
    ["operationCount", 14],
    ["terminalHistoryIndexCount", 14],
    ["reviewTerminalEvidenceCount", 42],
    ["applyingUnknownEvidenceCount", 42],
    ["recoveryResultEvidenceCount", 56],
    ["undoRedoEvidenceCount", 28],
    ["handlerClassifierAggregateAttachments", 10],
    ["semanticAggregateAttachments", 9],
    ["currentAuthorityRedoEntries", 9],
    ["stage11MatrixRedoBindings", 8],
    ["aggregateDirectStrandCount", 9],
  ] as const) exact(value[field], expected, `M1014.${field}`);
  exact(value.currentAuthority, "PARTIAL", "M1014.currentAuthority");
  exact(value.aggregateAuthority, "NOT_GRANTED", "M1014.aggregateAuthority");
  exactStrings(value.directObservationKinds, ["program-scene.inverse", "program-scene.forward"], "M1014.directObservationKinds");
  exact(value.modeledOnly, true, "M1014.modeledOnly");
  exact(value.crossProducerContinuity, "unproven", "M1014.crossProducerContinuity");
  exact(value.committedRecoveredContinuity, "not-proven", "M1014.committedRecoveredContinuity");
  exact(value.directCommittedRecoveredEvidence, "not-directly-observed", "M1014.directCommittedRecoveredEvidence");
  exact(value.provenanceStatus, "exact-m1012-boundary", "M1014.provenanceStatus");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M1014.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1014.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1014.stage12Started");
  exact(value.readyClaim, false, "M1014.readyClaim");
  return value as ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence;
}

export function createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence(input: unknown): ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence {
  const value = record(input, "M1014 source bundle");
  if (Object.keys(value).sort().join(",") !== "m1012Boundary") blocked("M1014 source bundle contains unknown or missing fields.");
  validateM1012Boundary(value.m1012Boundary);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_DIRECT_COMMITTED_RECOVERED_CROSS_PRODUCER_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION,
    milestone: "M1014",
    evidenceLabel: "local",
    sourceReceiptKind: "ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence",
    sourceBoundaryMilestone: "M1012",
    disposition: "direct-committed-recovered-continuity-not-proven",
    operationCount: 14,
    terminalHistoryIndexCount: 14,
    reviewTerminalEvidenceCount: 42,
    applyingUnknownEvidenceCount: 42,
    recoveryResultEvidenceCount: 56,
    undoRedoEvidenceCount: 28,
    handlerClassifierAggregateAttachments: 10,
    semanticAggregateAttachments: 9,
    currentAuthorityRedoEntries: 9,
    stage11MatrixRedoBindings: 8,
    aggregateDirectStrandCount: 9,
    currentAuthority: "PARTIAL",
    aggregateAuthority: "NOT_GRANTED",
    directObservationKinds: ["program-scene.inverse", "program-scene.forward"] as const,
    modeledOnly: true,
    crossProducerContinuity: "unproven",
    committedRecoveredContinuity: "not-proven",
    directCommittedRecoveredEvidence: "not-directly-observed",
    provenanceStatus: "exact-m1012-boundary",
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noRecoveryAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
  });
}

export const projectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence }>
    | Readonly<{ success: false; error: ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError
        ? error
        : new ProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
