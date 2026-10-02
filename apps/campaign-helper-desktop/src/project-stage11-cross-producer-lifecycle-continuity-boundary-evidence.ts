import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS } from "./project-review-apply-coverage";

export const PROJECT_STAGE11_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const REVIEW_TERMINAL_STATES = ["rejected", "cancelled", "stale"] as const;
const APPLYING_UNKNOWN_CHECKPOINTS = ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"] as const;
const RECOVERY_REREAD_STATUSES = ["matched", "not-committed", "conflict", "unknown"] as const;
const UNDO_REDO_SOURCE_STATUSES = ["committed", "undone"] as const;

type Stage11Context = Readonly<{
  handlerClassifierAggregateAttachments: 10;
  semanticAggregateAttachments: 9;
  currentAuthorityRedoEntries: 9;
  stage11MatrixRedoBindings: 8;
  aggregateDirectStrands: 9;
  currentAuthority: "PARTIAL";
  aggregateAuthority: "NOT_GRANTED";
}>;

export type ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION;
  milestone: "M1012";
  evidenceLabel: "local";
  sourceReceiptKind: "ProjectCrossProducerLifecycleContinuityEvidenceReceipt";
  disposition: "modeled-cross-producer-partial";
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
  linkageStatus: "bound-strict-typed-non-certifying";
  countScopeStatus: "preserved-explicit-8-9-9";
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

export class ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError extends Error {
  readonly code = "STAGE11_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_BOUNDARY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError(message);
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

function validateDirectObservation(input: unknown, label: string, expectedProducer: string, expectedMilestone: string, expectedLifecycle: string): void {
  const observation = record(input, label);
  exact(observation.observedLifecycleCount, 1, `${label}.observedLifecycleCount`);
  exact(observation.producerScopedOnly, true, `${label}.producerScopedOnly`);
  exact(observation.readOnly, true, `${label}.readOnly`);
  exact(observation.nonCertifying, true, `${label}.nonCertifying`);
  exact(observation.noAuthorityGrant, true, `${label}.noAuthorityGrant`);
  exact(observation.noExecutionAuthority, true, `${label}.noExecutionAuthority`);
  exact(observation.noRecoveryAuthority, true, `${label}.noRecoveryAuthority`);
  exact(observation.noFoundryAuthority, true, `${label}.noFoundryAuthority`);
  exact(observation.noProjectMutation, true, `${label}.noProjectMutation`);
  exact(observation.foreignStatePreserved, true, `${label}.foreignStatePreserved`);
  exact(observation.authoritativeReread, true, `${label}.authoritativeReread`);
  exact(observation.noRetry, true, `${label}.noRetry`);
  exact(observation.stage11AcceptanceStatus, "blocked", `${label}.stage11AcceptanceStatus`);
  exact(observation.stage12Started, false, `${label}.stage12Started`);
  exact(observation.readyClaim, false, `${label}.readyClaim`);
  const observations = observation.observations;
  if (!Array.isArray(observations) || observations.length !== 1) blocked(`${label}.observations must contain one observation.`);
  const item = record(observations[0], `${label}.observations[0]`);
  exact(item.producer, expectedProducer, `${label}.observations[0].producer`);
  exact(item.milestone, expectedMilestone, `${label}.observations[0].milestone`);
  exact(item.lifecycle, expectedLifecycle, `${label}.observations[0].lifecycle`);
}

function validateContinuityReceipt(input: unknown): void {
  const receipt = record(input, "cross-producer lifecycle continuity receipt");
  exact(receipt.schemaVersion, "0.1.0", "cross-producer lifecycle continuity receipt.schemaVersion");
  exact(receipt.status, "PASS", "cross-producer lifecycle continuity receipt.status");
  exact(receipt.disposition, "modeled-cross-producer-partial", "cross-producer lifecycle continuity receipt.disposition");
  exact(receipt.operationCount, 14, "cross-producer lifecycle continuity receipt.operationCount");
  exact(receipt.terminalHistoryIndexCount, 14, "cross-producer lifecycle continuity receipt.terminalHistoryIndexCount");
  exact(receipt.reviewTerminalEvidenceCount, 42, "cross-producer lifecycle continuity receipt.reviewTerminalEvidenceCount");
  exact(receipt.applyingUnknownEvidenceCount, 42, "cross-producer lifecycle continuity receipt.applyingUnknownEvidenceCount");
  exact(receipt.recoveryResultEvidenceCount, 56, "cross-producer lifecycle continuity receipt.recoveryResultEvidenceCount");
  exact(receipt.undoRedoEvidenceCount, 28, "cross-producer lifecycle continuity receipt.undoRedoEvidenceCount");
  exact(receipt.modeledOnly, true, "cross-producer lifecycle continuity receipt.modeledOnly");
  for (const field of ["readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(receipt[field], true, `cross-producer lifecycle continuity receipt.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "cross-producer lifecycle continuity receipt.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "cross-producer lifecycle continuity receipt.stage12Started");
  exact(receipt.readyClaim, false, "cross-producer lifecycle continuity receipt.readyClaim");
  const operations = receipt.operations;
  if (!Array.isArray(operations) || operations.length !== 14) blocked("cross-producer lifecycle continuity receipt.operations must contain fourteen operations.");
  operations.forEach((entry, index) => {
    const operation = record(entry, `cross-producer lifecycle continuity receipt.operations[${index}]`);
    const expectedCommandKind = TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS[index];
    if (expectedCommandKind === undefined) blocked(`cross-producer lifecycle continuity receipt.operations[${index}].commandKind has no approved typed command kind.`);
    exact(operation.commandKind, expectedCommandKind, `cross-producer lifecycle continuity receipt.operations[${index}].commandKind`);
    exactStrings(operation.reviewTerminalStates, REVIEW_TERMINAL_STATES, `cross-producer lifecycle continuity receipt.operations[${index}].reviewTerminalStates`);
    exactStrings(operation.applyingUnknownCheckpoints, APPLYING_UNKNOWN_CHECKPOINTS, `cross-producer lifecycle continuity receipt.operations[${index}].applyingUnknownCheckpoints`);
    exactStrings(operation.recoveryRereadStatuses, RECOVERY_REREAD_STATUSES, `cross-producer lifecycle continuity receipt.operations[${index}].recoveryRereadStatuses`);
    exactStrings(operation.undoRedoSourceStatuses, UNDO_REDO_SOURCE_STATUSES, `cross-producer lifecycle continuity receipt.operations[${index}].undoRedoSourceStatuses`);
    exact(operation.terminalHistoryIndexed, true, `cross-producer lifecycle continuity receipt.operations[${index}].terminalHistoryIndexed`);
  });
  validateDirectObservation(receipt.directFoundryObservation, "cross-producer lifecycle continuity receipt.directFoundryObservation", "foundry.program-scene.inverse", "M802", "preview-confirm-apply-authoritative-reread");
  validateDirectObservation(receipt.directFoundryForwardObservation, "cross-producer lifecycle continuity receipt.directFoundryForwardObservation", "foundry.program-scene.forward", "M830", "preview-approved-create-unknown-authoritative-recovery-reread");
}

function validateContext(input: unknown): Stage11Context {
  const context = record(input, "M1012 Stage 11 context");
  const expectedKeys = ["aggregateDirectStrands", "aggregateAuthority", "currentAuthority", "currentAuthorityRedoEntries", "handlerClassifierAggregateAttachments", "semanticAggregateAttachments", "stage11MatrixRedoBindings"];
  const actualKeys = Object.keys(context).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys.sort()[index])) blocked("M1012 Stage 11 context contains unknown or missing fields.");
  exact(context.handlerClassifierAggregateAttachments, 10, "M1012 Stage 11 context.handlerClassifierAggregateAttachments");
  exact(context.semanticAggregateAttachments, 9, "M1012 Stage 11 context.semanticAggregateAttachments");
  exact(context.currentAuthorityRedoEntries, 9, "M1012 Stage 11 context.currentAuthorityRedoEntries");
  exact(context.stage11MatrixRedoBindings, 8, "M1012 Stage 11 context.stage11MatrixRedoBindings");
  exact(context.aggregateDirectStrands, 9, "M1012 Stage 11 context.aggregateDirectStrands");
  exact(context.currentAuthority, "PARTIAL", "M1012 Stage 11 context.currentAuthority");
  exact(context.aggregateAuthority, "NOT_GRANTED", "M1012 Stage 11 context.aggregateAuthority");
  return context as Stage11Context;
}

function parseEvidence(input: unknown): ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence {
  const value = record(input, "M1012 cross-producer lifecycle continuity boundary evidence");
  const expectedKeys = [
    "aggregateAuthority", "aggregateDirectStrandCount", "committedRecoveredContinuity", "countScopeStatus", "crossProducerContinuity", "currentAuthority", "currentAuthorityRedoEntries", "directObservationKinds", "disposition", "evidenceLabel", "handlerClassifierAggregateAttachments", "linkageStatus", "milestone", "modeledOnly", "noAuthorityGrant", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noRecoveryAuthority", "noTransitionAuthority", "nonCertifying", "operationCount", "readOnly", "readyClaim", "recoveryResultEvidenceCount", "reviewTerminalEvidenceCount", "schemaVersion", "semanticAggregateAttachments", "stage11AcceptanceStatus", "stage11MatrixRedoBindings", "stage12Started", "sourceReceiptKind", "terminalHistoryIndexCount", "undoRedoEvidenceCount", "applyingUnknownEvidenceCount",
  ].sort();
  const actualKeys = Object.keys(value).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) blocked("M1012 cross-producer lifecycle continuity boundary evidence contains unknown or missing fields.");
  exact(value.schemaVersion, PROJECT_STAGE11_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION, "M1012.schemaVersion");
  exact(value.milestone, "M1012", "M1012.milestone");
  exact(value.evidenceLabel, "local", "M1012.evidenceLabel");
  exact(value.sourceReceiptKind, "ProjectCrossProducerLifecycleContinuityEvidenceReceipt", "M1012.sourceReceiptKind");
  exact(value.disposition, "modeled-cross-producer-partial", "M1012.disposition");
  exact(value.operationCount, 14, "M1012.operationCount");
  exact(value.terminalHistoryIndexCount, 14, "M1012.terminalHistoryIndexCount");
  exact(value.reviewTerminalEvidenceCount, 42, "M1012.reviewTerminalEvidenceCount");
  exact(value.applyingUnknownEvidenceCount, 42, "M1012.applyingUnknownEvidenceCount");
  exact(value.recoveryResultEvidenceCount, 56, "M1012.recoveryResultEvidenceCount");
  exact(value.undoRedoEvidenceCount, 28, "M1012.undoRedoEvidenceCount");
  exact(value.handlerClassifierAggregateAttachments, 10, "M1012.handlerClassifierAggregateAttachments");
  exact(value.semanticAggregateAttachments, 9, "M1012.semanticAggregateAttachments");
  exact(value.currentAuthorityRedoEntries, 9, "M1012.currentAuthorityRedoEntries");
  exact(value.stage11MatrixRedoBindings, 8, "M1012.stage11MatrixRedoBindings");
  exact(value.aggregateDirectStrandCount, 9, "M1012.aggregateDirectStrandCount");
  exact(value.currentAuthority, "PARTIAL", "M1012.currentAuthority");
  exact(value.aggregateAuthority, "NOT_GRANTED", "M1012.aggregateAuthority");
  exactStrings(value.directObservationKinds, ["program-scene.inverse", "program-scene.forward"], "M1012.directObservationKinds");
  exact(value.modeledOnly, true, "M1012.modeledOnly");
  exact(value.crossProducerContinuity, "unproven", "M1012.crossProducerContinuity");
  exact(value.committedRecoveredContinuity, "not-proven", "M1012.committedRecoveredContinuity");
  exact(value.linkageStatus, "bound-strict-typed-non-certifying", "M1012.linkageStatus");
  exact(value.countScopeStatus, "preserved-explicit-8-9-9", "M1012.countScopeStatus");
  for (const field of ["readOnly", "nonCertifying", "noAuthorityGrant", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(value[field], true, `M1012.${field}`);
  exact(value.stage11AcceptanceStatus, "blocked", "M1012.stage11AcceptanceStatus");
  exact(value.stage12Started, false, "M1012.stage12Started");
  exact(value.readyClaim, false, "M1012.readyClaim");
  return value as ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence;
}

export function createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence(input: unknown): ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence {
  const value = record(input, "M1012 source bundle");
  const keys = Object.keys(value).sort();
  if (keys.join(",") !== "continuityReceipt,stage11Context") blocked("M1012 source bundle contains unknown or missing fields.");
  validateContinuityReceipt(value.continuityReceipt);
  const context = validateContext(value.stage11Context);
  return Object.freeze({
    schemaVersion: PROJECT_STAGE11_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_BOUNDARY_EVIDENCE_SCHEMA_VERSION,
    milestone: "M1012",
    evidenceLabel: "local",
    sourceReceiptKind: "ProjectCrossProducerLifecycleContinuityEvidenceReceipt",
    disposition: "modeled-cross-producer-partial",
    operationCount: 14,
    terminalHistoryIndexCount: 14,
    reviewTerminalEvidenceCount: 42,
    applyingUnknownEvidenceCount: 42,
    recoveryResultEvidenceCount: 56,
    undoRedoEvidenceCount: 28,
    handlerClassifierAggregateAttachments: context.handlerClassifierAggregateAttachments,
    semanticAggregateAttachments: context.semanticAggregateAttachments,
    currentAuthorityRedoEntries: context.currentAuthorityRedoEntries,
    stage11MatrixRedoBindings: context.stage11MatrixRedoBindings,
    aggregateDirectStrandCount: context.aggregateDirectStrands,
    currentAuthority: context.currentAuthority,
    aggregateAuthority: context.aggregateAuthority,
    directObservationKinds: ["program-scene.inverse", "program-scene.forward"] as const,
    modeledOnly: true,
    crossProducerContinuity: "unproven",
    committedRecoveredContinuity: "not-proven",
    linkageStatus: "bound-strict-typed-non-certifying",
    countScopeStatus: "preserved-explicit-8-9-9",
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

export const projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence {
    return parseEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence }>
    | Readonly<{ success: false; error: ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError }> {
    try {
      return { success: true, data: parseEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError
        ? error
        : new ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
