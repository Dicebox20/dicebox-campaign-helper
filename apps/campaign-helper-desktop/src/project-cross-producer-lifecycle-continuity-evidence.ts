import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  type TypedLocalProjectReviewApplyCommandKind,
} from "./project-review-apply-coverage";
import {
  TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE,
  TYPED_REVIEW_TERMINAL_HISTORY_STATES,
} from "./project-review-terminal-state-evidence";
import {
  TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS,
  TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE,
} from "./project-review-applying-unknown-evidence";
import {
  TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE,
  TYPED_RECOVERY_RESULT_REREAD_STATUSES,
} from "./project-review-recovery-result-evidence";
import {
  TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE,
} from "./project-review-undo-redo-evidence";
import { PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX } from "./project-terminal-history-evidence-index";
import {
  createProjectStage11FoundryInverseEvidence,
  type ProjectStage11FoundryInverseEvidenceReceipt,
} from "./project-stage11-foundry-inverse-evidence";
import {
  createProjectStage11FoundryForwardRecoveryEvidence,
  type ProjectStage11FoundryForwardRecoveryEvidenceReceipt,
} from "./project-stage11-foundry-forward-recovery-evidence";

export const PROJECT_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

type Coverage = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  reviewTerminalStates: readonly ["rejected", "cancelled", "stale"];
  applyingUnknownCheckpoints: readonly ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"];
  recoveryRereadStatuses: readonly ["matched", "not-committed", "conflict", "unknown"];
  undoRedoSourceStatuses: readonly ["committed", "undone"];
  terminalHistoryIndexed: true;
}>;

export type ProjectCrossProducerLifecycleContinuityEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "modeled-cross-producer-partial";
  operationCount: 14;
  terminalHistoryIndexCount: 14;
  reviewTerminalEvidenceCount: 42;
  applyingUnknownEvidenceCount: 42;
  recoveryResultEvidenceCount: 56;
  undoRedoEvidenceCount: 28;
  operations: readonly Coverage[];
  directFoundryObservation: ProjectStage11FoundryInverseEvidenceReceipt;
  directFoundryForwardObservation: ProjectStage11FoundryForwardRecoveryEvidenceReceipt;
  modeledOnly: true;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noRecoveryAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  readyClaim: false;
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  remainingBlockers: readonly string[];
}>;

export class ProjectCrossProducerLifecycleContinuityEvidenceValidationError extends Error {
  readonly code = "CROSS_PRODUCER_LIFECYCLE_CONTINUITY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;
  constructor(message: string) { super(message); this.name = "ProjectCrossProducerLifecycleContinuityEvidenceValidationError"; }
}

function blocked(message: string): never { throw new ProjectCrossProducerLifecycleContinuityEvidenceValidationError(message); }
function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}
function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}
function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort(); const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) blocked(`${label} contains unknown or missing fields.`);
}
function exactArray(value: unknown, expected: readonly string[], label: string): void {
  if (!Array.isArray(value) || value.length !== expected.length || value.some((item, index) => item !== expected[index])) blocked(`${label} must retain exact ordered coverage.`);
}

function validateDirectFoundryObservation(input: unknown): ProjectStage11FoundryInverseEvidenceReceipt {
  const receipt = record(input, "direct Foundry observation");
  exactKeys(receipt, [
    "authoritativeReread", "disposition", "foundryMutationObserved", "foreignStatePreserved", "noAuthorityGrant", "noCoverageClaim",
    "noExecutionAuthority", "noFoundryAuthority", "noProjectMutation", "noRecoveryAuthority", "noRetry", "nonCertifying", "observations",
    "observedLifecycleCount", "producerScopedOnly", "readOnly", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status", "readyClaim",
  ], "direct Foundry observation");
  exact(receipt.schemaVersion, "0.1.0", "direct Foundry observation.schemaVersion");
  exact(receipt.status, "PASS", "direct Foundry observation.status");
  exact(receipt.disposition, "one-producer-scoped-foundry-fixture-observation", "direct Foundry observation.disposition");
  exact(receipt.observedLifecycleCount, 1, "direct Foundry observation.observedLifecycleCount");
  for (const field of ["producerScopedOnly", "foundryMutationObserved", "foreignStatePreserved", "authoritativeReread", "noRetry", "readOnly", "nonCertifying", "noAuthorityGrant", "noCoverageClaim", "noFoundryAuthority", "noExecutionAuthority", "noRecoveryAuthority", "noProjectMutation"] as const) exact(receipt[field], true, `direct Foundry observation.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "direct Foundry observation.stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "direct Foundry observation.stage12Started");
  exact(receipt.readyClaim, false, "direct Foundry observation.readyClaim");
  const observations = receipt.observations;
  if (!Array.isArray(observations) || observations.length !== 1) blocked("direct Foundry observation must contain one observation.");
  const observation = record(observations[0], "direct Foundry observation.observations[0]");
  exactKeys(observation, ["lifecycle", "milestone", "producer"], "direct Foundry observation.observations[0]");
  exact(observation.milestone, "M802", "direct Foundry observation.observations[0].milestone");
  exact(observation.producer, "foundry.program-scene.inverse", "direct Foundry observation.observations[0].producer");
  exact(observation.lifecycle, "preview-confirm-apply-authoritative-reread", "direct Foundry observation.observations[0].lifecycle");
  return receipt as ProjectStage11FoundryInverseEvidenceReceipt;
}

function validateDirectFoundryForwardObservation(input: unknown): ProjectStage11FoundryForwardRecoveryEvidenceReceipt {
  const receipt = record(input, "direct Foundry forward observation");
  exactKeys(receipt, [
    "authoritativeReread", "disposition", "foreignStatePreserved", "foundryMutationObserved", "noAuthorityGrant", "noCoverageClaim",
    "noExecutionAuthority", "noFoundryAuthority", "noProjectMutation", "noRecoveryAuthority", "noRetry", "nonCertifying", "observations",
    "observedLifecycleCount", "producerScopedOnly", "readOnly", "readyClaim", "recoveredFromUnknown", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status",
  ], "direct Foundry forward observation");
  exact(receipt.schemaVersion, "0.1.0", "direct Foundry forward observation.schemaVersion"); exact(receipt.status, "PASS", "direct Foundry forward observation.status");
  exact(receipt.disposition, "one-producer-scoped-foundry-fixture-forward-recovery-observation", "direct Foundry forward observation.disposition"); exact(receipt.observedLifecycleCount, 1, "direct Foundry forward observation.observedLifecycleCount");
  for (const field of ["producerScopedOnly", "foundryMutationObserved", "authoritativeReread", "recoveredFromUnknown", "noRetry", "foreignStatePreserved", "readOnly", "nonCertifying", "noAuthorityGrant", "noCoverageClaim", "noFoundryAuthority", "noExecutionAuthority", "noRecoveryAuthority", "noProjectMutation"] as const) exact(receipt[field], true, `direct Foundry forward observation.${field}`);
  exact(receipt.stage11AcceptanceStatus, "blocked", "direct Foundry forward observation.stage11AcceptanceStatus"); exact(receipt.stage12Started, false, "direct Foundry forward observation.stage12Started"); exact(receipt.readyClaim, false, "direct Foundry forward observation.readyClaim");
  if (!Array.isArray(receipt.observations) || receipt.observations.length !== 1) blocked("direct Foundry forward observation must contain one observation.");
  const observation = record(receipt.observations[0], "direct Foundry forward observation.observations[0]");
  exactKeys(observation, ["lifecycle", "milestone", "producer"], "direct Foundry forward observation.observations[0]");
  exact(observation.milestone, "M830", "direct Foundry forward observation.observations[0].milestone"); exact(observation.producer, "foundry.program-scene.forward", "direct Foundry forward observation.observations[0].producer"); exact(observation.lifecycle, "preview-approved-create-unknown-authoritative-recovery-reread", "direct Foundry forward observation.observations[0].lifecycle");
  return receipt as ProjectStage11FoundryForwardRecoveryEvidenceReceipt;
}

function entriesFor<T extends Readonly<{ commandKind: string }>>(entries: readonly T[], commandKind: string): readonly T[] {
  return entries.filter((entry) => entry.commandKind === commandKind);
}

function createOperations(): readonly Coverage[] {
  const expectedKinds = [...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS];
  if (PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length !== expectedKinds.length) blocked("terminal-history index must cover every typed operation exactly once.");
  return Object.freeze(expectedKinds.map((commandKind) => {
    const terminal = entriesFor(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE, commandKind);
    const applyingUnknown = entriesFor(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE, commandKind);
    const recovery = entriesFor(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE, commandKind);
    const undoRedo = entriesFor(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE, commandKind);
    const indexed = PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.filter((entry) => entry.commandKind === commandKind);
    if (indexed.length !== 1) blocked(`${commandKind} must have exactly one terminal-history index entry.`);
    exactArray(terminal.map((entry) => entry.reviewTerminalState), TYPED_REVIEW_TERMINAL_HISTORY_STATES, `${commandKind} review-terminal states`);
    exactArray(applyingUnknown.map((entry) => entry.checkpoint), TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS, `${commandKind} applying/unknown checkpoints`);
    exactArray(recovery.map((entry) => entry.rereadStatus), TYPED_RECOVERY_RESULT_REREAD_STATUSES, `${commandKind} recovery reread statuses`);
    exactArray(undoRedo.map((entry) => entry.sourceStatus), ["committed", "undone"], `${commandKind} undo/redo source statuses`);
    return Object.freeze({ commandKind, reviewTerminalStates: ["rejected", "cancelled", "stale"] as const, applyingUnknownCheckpoints: ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"] as const, recoveryRereadStatuses: ["matched", "not-committed", "conflict", "unknown"] as const, undoRedoSourceStatuses: ["committed", "undone"] as const, terminalHistoryIndexed: true as const });
  }));
}

export function createProjectCrossProducerLifecycleContinuityEvidence(foundryInverseInput: unknown, foundryForwardInput: unknown): ProjectCrossProducerLifecycleContinuityEvidenceReceipt {
  const operations = createOperations();
  const directFoundryObservation = createProjectStage11FoundryInverseEvidence(foundryInverseInput);
  const directFoundryForwardObservation = createProjectStage11FoundryForwardRecoveryEvidence(foundryForwardInput);
  return Object.freeze({
    schemaVersion: PROJECT_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_EVIDENCE_SCHEMA_VERSION,
    status: "PASS", disposition: "modeled-cross-producer-partial", operationCount: 14, terminalHistoryIndexCount: 14,
    reviewTerminalEvidenceCount: 42, applyingUnknownEvidenceCount: 42, recoveryResultEvidenceCount: 56, undoRedoEvidenceCount: 28,
    operations, directFoundryObservation, directFoundryForwardObservation, modeledOnly: true, readOnly: true, nonCertifying: true, noExecutionAuthority: true, noTransitionAuthority: true, noRecoveryAuthority: true, noGenericExecutor: true, noFoundryWrite: true, noProjectMutation: true,
    readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false,
    remainingBlockers: Object.freeze(["This validates only modeled lifecycle-matrix continuity; it does not invoke a transition, execution, reread, or recovery.", "Operation-specific committed/recovered behavior remains bounded evidence, not aggregate authority.", "Packaged/runtime authority, direct current-dialog evidence, Stage 11 acceptance, and Stage 12 remain blocked."]),
  });
}

export function bridgeProjectCrossProducerLifecycleContinuityEvidence(input: unknown, foundryInverseInput: unknown): ProjectCrossProducerLifecycleContinuityEvidenceReceipt {
  const receipt = record(input, "cross-producer lifecycle continuity evidence");
  exactKeys(receipt, ["applyingUnknownEvidenceCount", "directFoundryForwardObservation", "directFoundryObservation", "disposition", "modeledOnly", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation", "noRecoveryAuthority", "noTransitionAuthority", "nonCertifying", "operationCount", "operations", "readyClaim", "recoveryResultEvidenceCount", "remainingBlockers", "reviewTerminalEvidenceCount", "schemaVersion", "stage11AcceptanceStatus", "stage12Started", "status", "terminalHistoryIndexCount", "undoRedoEvidenceCount", "readOnly"], "cross-producer lifecycle continuity evidence");
  exact(receipt.schemaVersion, PROJECT_CROSS_PRODUCER_LIFECYCLE_CONTINUITY_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  exact(receipt.status, "PASS", "status"); exact(receipt.disposition, "modeled-cross-producer-partial", "disposition");
  exact(receipt.operationCount, 14, "operationCount"); exact(receipt.terminalHistoryIndexCount, 14, "terminalHistoryIndexCount"); exact(receipt.reviewTerminalEvidenceCount, 42, "reviewTerminalEvidenceCount"); exact(receipt.applyingUnknownEvidenceCount, 42, "applyingUnknownEvidenceCount"); exact(receipt.recoveryResultEvidenceCount, 56, "recoveryResultEvidenceCount"); exact(receipt.undoRedoEvidenceCount, 28, "undoRedoEvidenceCount");
  for (const field of ["modeledOnly", "readOnly", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noRecoveryAuthority", "noGenericExecutor", "noFoundryWrite", "noProjectMutation"] as const) exact(receipt[field], true, field);
  exact(receipt.readyClaim, false, "readyClaim"); exact(receipt.stage11AcceptanceStatus, "blocked", "stage11AcceptanceStatus"); exact(receipt.stage12Started, false, "stage12Started");
  const directFoundryObservation = validateDirectFoundryObservation(receipt.directFoundryObservation);
  const directFoundryForwardObservation = validateDirectFoundryForwardObservation(receipt.directFoundryForwardObservation);
  const expectedDirectFoundryObservation = createProjectStage11FoundryInverseEvidence(foundryInverseInput);
  if (directFoundryObservation.observations[0]!.producer !== expectedDirectFoundryObservation.observations[0]!.producer || directFoundryObservation.observations[0]!.lifecycle !== expectedDirectFoundryObservation.observations[0]!.lifecycle) blocked("direct Foundry observation does not match the exact M803 producer/lifecycle.");
  if (directFoundryForwardObservation.observations[0]!.milestone !== "M830" || directFoundryForwardObservation.observations[0]!.producer !== "foundry.program-scene.forward") blocked("direct Foundry forward observation must retain exact M836 provenance.");
  const expected = createOperations();
  if (!Array.isArray(receipt.operations) || receipt.operations.length !== expected.length) blocked("operations must contain every typed operation exactly once.");
  receipt.operations.forEach((operation, index) => {
    const item = record(operation, `operations[${index}]`); const wanted = expected[index]!;
    exactKeys(item, ["applyingUnknownCheckpoints", "commandKind", "recoveryRereadStatuses", "reviewTerminalStates", "terminalHistoryIndexed", "undoRedoSourceStatuses"], `operations[${index}]`);
    exact(item.commandKind, wanted.commandKind, `operations[${index}].commandKind`); exactArray(item.reviewTerminalStates, wanted.reviewTerminalStates, `operations[${index}].reviewTerminalStates`); exactArray(item.applyingUnknownCheckpoints, wanted.applyingUnknownCheckpoints, `operations[${index}].applyingUnknownCheckpoints`); exactArray(item.recoveryRereadStatuses, wanted.recoveryRereadStatuses, `operations[${index}].recoveryRereadStatuses`); exactArray(item.undoRedoSourceStatuses, wanted.undoRedoSourceStatuses, `operations[${index}].undoRedoSourceStatuses`); exact(item.terminalHistoryIndexed, true, `operations[${index}].terminalHistoryIndexed`);
  });
  return receipt as ProjectCrossProducerLifecycleContinuityEvidenceReceipt;
}
