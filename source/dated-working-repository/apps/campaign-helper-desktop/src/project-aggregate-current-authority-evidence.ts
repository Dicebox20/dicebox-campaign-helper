import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
} from "./project-review-apply-coverage";
import {
  PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX,
  PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS,
} from "./project-terminal-history-evidence-index";
import { TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY } from "./project-review-producer-evidence";

export const PROJECT_AGGREGATE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const expectedRedoBindings = [
  { commandKind: "project.create", receipt: "outputs/m778-stage11-project-create-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.save", receipt: "outputs/m752-stage11-project-save-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.rename", receipt: "outputs/m754-stage11-project-rename-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.add-scene.persist", receipt: "outputs/m756-stage11-project-add-scene-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.asset.bind", receipt: "outputs/m758-stage11-project-asset-bind-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.asset.register-audio", receipt: "outputs/m760-stage11-project-audio-asset-register-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.asset.register-handout", receipt: "outputs/m762-stage11-project-handout-asset-register-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.asset.register-token", receipt: "outputs/m764-stage11-project-token-asset-register-redo-terminal-history-bridge-closure-receipt.json" },
  { commandKind: "project.add-scene.commit-in-memory", receipt: "outputs/m766-stage11-project-add-scene-in-memory-redo-terminal-history-bridge-closure-receipt.json" },
] as const satisfies readonly Readonly<{ commandKind: string; receipt: string }>[];

const expectedBlockers = [
  "Aggregate current authority is not proven by the bounded operation-specific evidence.",
  "Cross-producer lifecycle and recovery continuity remains incomplete.",
  "Packaged/runtime authority and direct active-GM/Foundry evidence remain incomplete.",
  "The aggregate Stage 11 acceptance claim is not supported; Stage 12 remains locked.",
] as const;

type OperationEvidence = Readonly<{
  commandKind: string;
  bridgeSource: string;
  focusedTest: string;
  receipt: string;
}>;

type ProducerEvidence = Readonly<{
  familyId: string;
  evidenceStatus: string;
  nonCertifying: true;
}>;

type RedoBinding = Readonly<{
  commandKind: string;
  receipt: string;
  evidenceKind: "operation-specific-redo-terminal-history";
  status: "bounded-local";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
}>;

export type ProjectAggregateCurrentAuthorityEvidenceReceipt = Readonly<{
  schemaVersion: typeof PROJECT_AGGREGATE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION;
  status: "PASS";
  disposition: "aggregate-partial";
  currentAuthorityStatus: "partial";
  stage11AcceptanceStatus: "blocked";
  stage12Started: false;
  typedOperationKindCount: number;
  indexedOperationCount: number;
  directProjectionCount: number;
  supplementalProjectionCount: number;
  operationEvidence: readonly OperationEvidence[];
  supplementalProjectionIds: readonly string[];
  producerFamilyCount: number;
  producerFamilies: readonly ProducerEvidence[];
  redoBindingCount: number;
  redoBindings: readonly RedoBinding[];
  remainingBlockers: readonly string[];
  authority: Readonly<{
    target: "local-project";
    apply: "operation-specific";
    aggregate: "not-granted";
  }>;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noTransitionAuthority: true;
  noGenericExecutor: true;
  noFoundryWrite: true;
  noProjectMutation: true;
  foreignStatePreserved: true;
  execution: "not-implemented";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  readyClaim: false;
}>;

export class ProjectAggregateCurrentAuthorityEvidenceValidationError extends Error {
  readonly code = "AGGREGATE_CURRENT_AUTHORITY_EVIDENCE_VALIDATION_FAILED" as const;
  readonly outcomeUnknown = false;
  readonly authoritativeRereadRequired = true;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectAggregateCurrentAuthorityEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectAggregateCurrentAuthorityEvidenceValidationError(message);
}

function record(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) blocked(`${label} must be an object.`);
  return value as Record<string, unknown>;
}

function array(value: unknown, label: string): readonly unknown[] {
  if (!Array.isArray(value)) blocked(`${label} must be an array.`);
  return value;
}

function stringValue(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) blocked(`${label} must be a non-empty string.`);
  return value;
}

function exact(value: unknown, expected: string | number | boolean, label: string): void {
  if (value !== expected) blocked(`${label} must be ${String(expected)}.`);
}

function exactKeys(value: Record<string, unknown>, expected: readonly string[], label: string): void {
  const actual = Object.keys(value).sort();
  const required = [...expected].sort();
  if (actual.length !== required.length || actual.some((key, index) => key !== required[index])) {
    blocked(`${label} contains unknown or missing fields.`);
  }
}

function exactStringArray(value: unknown, expected: readonly string[], label: string): readonly string[] {
  const actual = array(value, label).map((entry, index) => stringValue(entry, `${label}[${index}]`));
  if (actual.length !== expected.length || actual.some((entry, index) => entry !== expected[index])) blocked(`${label} does not retain exact ordered coverage.`);
  return actual;
}

function expectedOperationEvidence(): readonly OperationEvidence[] {
  return PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.map(({ commandKind, bridgeSource, focusedTest, receipt }) => ({ commandKind, bridgeSource, focusedTest, receipt }));
}

function expectedProducerEvidence(): readonly ProducerEvidence[] {
  return TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.map(({ familyId, evidenceStatus, nonCertifying }) => ({ familyId, evidenceStatus, nonCertifying }));
}

function expectedRedoEvidence(): readonly RedoBinding[] {
  return expectedRedoBindings.map(({ commandKind, receipt }) => ({
    commandKind,
    receipt,
    evidenceKind: "operation-specific-redo-terminal-history",
    status: "bounded-local",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
  }));
}

function validateOperationEvidence(value: unknown): readonly OperationEvidence[] {
  const actual = array(value, "operationEvidence").map((entry, index) => {
    const item = record(entry, `operationEvidence[${index}]`);
    exactKeys(item, ["bridgeSource", "commandKind", "focusedTest", "receipt"], `operationEvidence[${index}]`);
    return {
      commandKind: stringValue(item.commandKind, `operationEvidence[${index}].commandKind`),
      bridgeSource: stringValue(item.bridgeSource, `operationEvidence[${index}].bridgeSource`),
      focusedTest: stringValue(item.focusedTest, `operationEvidence[${index}].focusedTest`),
      receipt: stringValue(item.receipt, `operationEvidence[${index}].receipt`),
    };
  });
  const expected = expectedOperationEvidence();
  if (actual.length !== expected.length || actual.some((entry, index) => {
    const wanted = expected[index]!;
    return entry.commandKind !== wanted.commandKind || entry.bridgeSource !== wanted.bridgeSource || entry.focusedTest !== wanted.focusedTest || entry.receipt !== wanted.receipt;
  })) blocked("operationEvidence must exactly bind every typed operation once to its indexed source, test, and receipt.");
  return actual;
}

function validateProducerEvidence(value: unknown): readonly ProducerEvidence[] {
  const actual = array(value, "producerFamilies").map((entry, index) => {
    const item = record(entry, `producerFamilies[${index}]`);
    exactKeys(item, ["evidenceStatus", "familyId", "nonCertifying"], `producerFamilies[${index}]`);
    exact(item.nonCertifying, true, `producerFamilies[${index}].nonCertifying`);
    return {
      familyId: stringValue(item.familyId, `producerFamilies[${index}].familyId`),
      evidenceStatus: stringValue(item.evidenceStatus, `producerFamilies[${index}].evidenceStatus`),
      nonCertifying: true as const,
    };
  });
  const expected = expectedProducerEvidence();
  if (actual.length !== expected.length || actual.some((entry, index) => {
    const wanted = expected[index]!;
    return entry.familyId !== wanted.familyId || entry.evidenceStatus !== wanted.evidenceStatus || entry.nonCertifying !== wanted.nonCertifying;
  })) blocked("producerFamilies must exactly bind the eleven current producer-family dispositions.");
  return actual;
}

function validateRedoEvidence(value: unknown): readonly RedoBinding[] {
  const actual = array(value, "redoBindings").map((entry, index) => {
    const item = record(entry, `redoBindings[${index}]`);
    exactKeys(item, ["commandKind", "evidenceKind", "noExecutionAuthority", "noTransitionAuthority", "nonCertifying", "readOnly", "receipt", "status"], `redoBindings[${index}]`);
    exact(item.evidenceKind, "operation-specific-redo-terminal-history", `redoBindings[${index}].evidenceKind`);
    exact(item.status, "bounded-local", `redoBindings[${index}].status`);
    exact(item.readOnly, true, `redoBindings[${index}].readOnly`);
    exact(item.nonCertifying, true, `redoBindings[${index}].nonCertifying`);
    exact(item.noExecutionAuthority, true, `redoBindings[${index}].noExecutionAuthority`);
    exact(item.noTransitionAuthority, true, `redoBindings[${index}].noTransitionAuthority`);
    return {
      commandKind: stringValue(item.commandKind, `redoBindings[${index}].commandKind`),
      receipt: stringValue(item.receipt, `redoBindings[${index}].receipt`),
      evidenceKind: "operation-specific-redo-terminal-history" as const,
      status: "bounded-local" as const,
      readOnly: true as const,
      nonCertifying: true as const,
      noExecutionAuthority: true as const,
      noTransitionAuthority: true as const,
    };
  });
  const expected = expectedRedoEvidence();
  if (actual.length !== expected.length || actual.some((entry, index) => {
    const wanted = expected[index]!;
    return entry.commandKind !== wanted.commandKind || entry.receipt !== wanted.receipt;
  })) blocked("redoBindings must exactly bind the nine applicable bounded redo receipts once each.");
  return actual;
}

export function createProjectAggregateCurrentAuthorityEvidence(): ProjectAggregateCurrentAuthorityEvidenceReceipt {
  const operationEvidence = expectedOperationEvidence();
  const producerFamilies = expectedProducerEvidence();
  const redoBindings = expectedRedoEvidence();
  return {
    schemaVersion: PROJECT_AGGREGATE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION,
    status: "PASS",
    disposition: "aggregate-partial",
    currentAuthorityStatus: "partial",
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    typedOperationKindCount: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length,
    indexedOperationCount: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length,
    directProjectionCount: PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length + PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length,
    supplementalProjectionCount: PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length,
    operationEvidence,
    supplementalProjectionIds: PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.map(({ projectionId }) => projectionId),
    producerFamilyCount: producerFamilies.length,
    producerFamilies,
    redoBindingCount: redoBindings.length,
    redoBindings,
    remainingBlockers: expectedBlockers,
    authority: { target: "local-project", apply: "operation-specific", aggregate: "not-granted" },
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noGenericExecutor: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    readyClaim: false,
  };
}

export function bridgeProjectAggregateCurrentAuthorityEvidence(input: unknown): ProjectAggregateCurrentAuthorityEvidenceReceipt {
  const receipt = record(input, "aggregate current-authority evidence");
  exactKeys(receipt, [
    "authority", "currentAuthorityStatus", "directProjectionCount", "disposition", "execution", "foreignStatePreserved",
    "indexedOperationCount", "noExecutionAuthority", "noFoundryWrite", "noGenericExecutor", "noProjectMutation",
    "noTransitionAuthority", "nonCertifying", "operationEvidence", "producerFamilies", "producerFamilyCount",
    "readyClaim", "readOnly", "redoBindingCount", "redoBindings", "remainingBlockers", "rereadInvocation", "schemaVersion", "stage11AcceptanceStatus",
    "stage12Started", "status", "supplementalProjectionCount", "supplementalProjectionIds", "transitionInvocation", "typedOperationKindCount",
  ], "aggregate current-authority evidence");
  exact(receipt.schemaVersion, PROJECT_AGGREGATE_CURRENT_AUTHORITY_EVIDENCE_SCHEMA_VERSION, "schemaVersion");
  exact(receipt.status, "PASS", "status");
  exact(receipt.disposition, "aggregate-partial", "disposition");
  exact(receipt.currentAuthorityStatus, "partial", "currentAuthorityStatus");
  exact(receipt.stage11AcceptanceStatus, "blocked", "stage11AcceptanceStatus");
  exact(receipt.stage12Started, false, "stage12Started");
  exact(receipt.typedOperationKindCount, TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length, "typedOperationKindCount");
  exact(receipt.indexedOperationCount, PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length, "indexedOperationCount");
  exact(receipt.directProjectionCount, PROJECT_TERMINAL_HISTORY_EVIDENCE_INDEX.length + PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length, "directProjectionCount");
  exact(receipt.supplementalProjectionCount, PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.length, "supplementalProjectionCount");
  exact(receipt.producerFamilyCount, TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.length, "producerFamilyCount");
  exact(receipt.redoBindingCount, expectedRedoBindings.length, "redoBindingCount");
  exactStringArray(receipt.supplementalProjectionIds, PROJECT_TERMINAL_HISTORY_SUPPLEMENTAL_PROJECTIONS.map(({ projectionId }) => projectionId), "supplementalProjectionIds");
  validateOperationEvidence(receipt.operationEvidence);
  validateProducerEvidence(receipt.producerFamilies);
  validateRedoEvidence(receipt.redoBindings);
  exactStringArray(receipt.remainingBlockers, expectedBlockers, "remainingBlockers");
  exact(receipt.readOnly, true, "readOnly");
  exact(receipt.nonCertifying, true, "nonCertifying");
  exact(receipt.noExecutionAuthority, true, "noExecutionAuthority");
  exact(receipt.noTransitionAuthority, true, "noTransitionAuthority");
  exact(receipt.noGenericExecutor, true, "noGenericExecutor");
  exact(receipt.noFoundryWrite, true, "noFoundryWrite");
  exact(receipt.noProjectMutation, true, "noProjectMutation");
  exact(receipt.foreignStatePreserved, true, "foreignStatePreserved");
  exact(receipt.execution, "not-implemented", "execution");
  exact(receipt.transitionInvocation, "not-invoked", "transitionInvocation");
  exact(receipt.rereadInvocation, "not-invoked", "rereadInvocation");
  exact(receipt.readyClaim, false, "readyClaim");
  const authority = record(receipt.authority, "authority");
  exactKeys(authority, ["aggregate", "apply", "target"], "authority");
  exact(authority.target, "local-project", "authority.target");
  exact(authority.apply, "operation-specific", "authority.apply");
  exact(authority.aggregate, "not-granted", "authority.aggregate");
  return receipt as ProjectAggregateCurrentAuthorityEvidenceReceipt;
}

export const projectAggregateCurrentAuthorityEvidenceSchema = Object.freeze({
  parse(input: unknown): ProjectAggregateCurrentAuthorityEvidenceReceipt {
    return bridgeProjectAggregateCurrentAuthorityEvidence(input);
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: ProjectAggregateCurrentAuthorityEvidenceReceipt }>
    | Readonly<{ success: false; error: ProjectAggregateCurrentAuthorityEvidenceValidationError }> {
    try {
      return { success: true, data: bridgeProjectAggregateCurrentAuthorityEvidence(input) };
    } catch (error) {
      const validationError = error instanceof ProjectAggregateCurrentAuthorityEvidenceValidationError
        ? error
        : new ProjectAggregateCurrentAuthorityEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});
