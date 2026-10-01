import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS } from "./project-review-apply-coverage";
import {
  bridgeProjectRenameExecutionToTerminalHistory,
  bridgeProjectRenameRedoToTerminalHistory,
  projectRenameRedoTerminalHistoryReceiptSchema,
  projectRenameTerminalHistoryReceiptSchema,
} from "./project-rename-terminal-history";

export const PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const PROJECT_RENAME_COMMAND_KIND = "project.rename" as const;
const PROJECT_RENAME_OPERATION = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS["project.rename"];
const M754_SOURCE_RECEIPT = "outputs/m754-stage11-project-rename-redo-terminal-history-bridge-closure-receipt.json" as const;
const M902_SEMANTIC_RECEIPT = "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json" as const;
const SOURCE_STATUSES = ["committed", "undone"] as const;

type SourceStatus = typeof SOURCE_STATUSES[number];

type HandlerBinding = Readonly<{
  handler: typeof bridgeProjectRenameExecutionToTerminalHistory | typeof bridgeProjectRenameRedoToTerminalHistory;
  handlerName: string;
  rereadClassifier: typeof projectRenameTerminalHistoryReceiptSchema | typeof projectRenameRedoTerminalHistoryReceiptSchema;
  rereadClassifierName: string;
  status: "bound-operation-specific";
}>;

const HANDLER_BINDINGS: Readonly<Record<"undo" | "redo", HandlerBinding>> = {
  undo: {
    handler: bridgeProjectRenameExecutionToTerminalHistory,
    handlerName: "bridgeProjectRenameExecutionToTerminalHistory",
    rereadClassifier: projectRenameTerminalHistoryReceiptSchema,
    rereadClassifierName: "projectRenameTerminalHistoryReceiptSchema",
    status: "bound-operation-specific",
  },
  redo: {
    handler: bridgeProjectRenameRedoToTerminalHistory,
    handlerName: "bridgeProjectRenameRedoToTerminalHistory",
    rereadClassifier: projectRenameRedoTerminalHistoryReceiptSchema,
    rereadClassifierName: "projectRenameRedoTerminalHistoryReceiptSchema",
    status: "bound-operation-specific",
  },
};

export const TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS = HANDLER_BINDINGS;

export type ProjectRenameRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: typeof PROJECT_RENAME_COMMAND_KIND;
  operation: "dicebox.project.rename";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  applyHandler: string;
  sourceStatus: SourceStatus;
  transition: "undo" | "redo";
  destinationStatus: "undone" | "redone";
  allowedTransitionsBefore: readonly string[];
  allowedTransitionsAfter: readonly string[];
  undoRedoHandler: string;
  matchedRereadClassifier: string;
  handlerBindingStatus: "bound-operation-specific";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash";
  exactTargetRequired: true;
  generationAndHashRequired: true;
  metadataOnlyRenameRequired: true;
  projectContentPreserved: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m754RedoBridge: "preserved-out-of-scope";
  m902SemanticEvidence: "preserved-out-of-scope";
  noTransitionAuthority: true;
  executionAuthority: "none";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
  stage11Ready: false;
  stage12Started: false;
  source: "project-rename-terminal-history-and-core-undo-redo-contract";
  evidenceStatus: "bounded-project-rename-handler-classifier-binding";
  remainingGap: string;
}>;

export class ProjectRenameRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectRenameRedoHandlerClassifierEvidenceValidationError";
  }
}

function blocked(message: string): never {
  throw new ProjectRenameRedoHandlerClassifierEvidenceValidationError(message);
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

function validateM754BridgeReceipt(input: unknown): void {
  const source = record(input, "M754 source receipt");
  exact(source.milestone, "M754", "M754.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.RENAME REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M754.status");
  const implementation = record(source.implementation, "M754.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-rename-terminal-history.ts", "M754.implementation.source");
  exact(implementation.focusedTest, "tests/project-rename-terminal-history.test.ts", "M754.implementation.focusedTest");
  if (typeof implementation.bridge !== "string" || !implementation.bridge.includes("bridgeProjectRenameRedoToTerminalHistory validates one project.rename-only")) blocked("M754 bridge identity is not exact.");
  if (typeof implementation.classifier !== "string" || !implementation.classifier.includes("projectRenameRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output")) blocked("M754 classifier identity is not exact.");
  const acceptance = record(source.acceptance, "M754.acceptance");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M754.acceptance.stage11");
  exact(acceptance.stage12, "NOT STARTED", "M754.acceptance.stage12");
  if (typeof acceptance.decision !== "string" || !acceptance.decision.includes("project.rename redo terminal-history bridge/classifier gap")) blocked("M754 acceptance decision does not preserve the bounded bridge/classifier scope.");
}

function validateM902SemanticReceipt(input: unknown): void {
  const source = record(input, "M902 semantic receipt");
  exact(source.milestone, "M902", "M902.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M902.status");
  const evidence = record(source.composition, "M902.composition");
  exact(evidence.operation, "project.rename.redo", "M902.composition.operation");
  exact(evidence.sourceReceiptStrictlyParsed, true, "M902.composition.sourceReceiptStrictlyParsed");
  exact(evidence.matchedReread, true, "M902.composition.matchedReread");
  exact(evidence.generationAdvanced, true, "M902.composition.generationAdvanced");
  exact(evidence.displayNameChanged, true, "M902.composition.displayNameChanged");
  exact(evidence.contentPreserved, true, "M902.composition.contentPreserved");
  exact(evidence.metadataEnvelopePreserved, true, "M902.composition.metadataEnvelopePreserved");
  const safety = record(source.safety, "M902.safety");
  for (const field of ["readOnlyEvidence", "nonCertifying", "noExecutionAuthority", "noTransitionAuthority", "noGenericExecutor", "noProjectMutation", "noFoundryWrite"] as const) exact(safety[field], true, `M902.safety.${field}`);
  exact(safety.readyClaim, false, "M902.safety.readyClaim");
  exact(safety.stage11AcceptanceStatus, "blocked", "M902.safety.stage11AcceptanceStatus");
  exact(safety.stage12Started, false, "M902.safety.stage12Started");
}

function validateSources(input: unknown): void {
  const value = record(input, "M975 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt"], "M975 source bundle");
  validateM754BridgeReceipt(value.bridgeReceipt);
  validateM902SemanticReceipt(value.semanticReceipt);
}

export const TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectRenameRedoHandlerClassifierEvidence[] = SOURCE_STATUSES.map((sourceStatus) => {
  const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[sourceStatus];
  const binding = HANDLER_BINDINGS[transition.transition];
  return {
    schemaVersion: PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
    commandKind: PROJECT_RENAME_COMMAND_KIND,
    operation: "dicebox.project.rename",
    reviewAuthority: PROJECT_RENAME_OPERATION.reviewAuthority,
    targetAuthority: PROJECT_RENAME_OPERATION.targetAuthority,
    applyAuthority: PROJECT_RENAME_OPERATION.applyAuthority,
    operationAuthority: "not-granted",
    applyHandler: PROJECT_RENAME_OPERATION.applyHandler,
    sourceStatus,
    transition: transition.transition,
    destinationStatus: transition.destinationStatus,
    allowedTransitionsBefore: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[sourceStatus],
    allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[transition.destinationStatus],
    undoRedoHandler: binding.handlerName,
    matchedRereadClassifier: binding.rereadClassifierName,
    handlerBindingStatus: binding.status,
    rereadStatus: "matched",
    rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
    exactTargetRequired: true,
    generationAndHashRequired: true,
    metadataOnlyRenameRequired: true,
    projectContentPreserved: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    m754RedoBridge: "preserved-out-of-scope",
    m902SemanticEvidence: "preserved-out-of-scope",
    noTransitionAuthority: true,
    executionAuthority: "none",
    foreignStateMutation: "none",
    liveBehavior: "unproven",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noGenericExecutor: true,
    stage11Ready: false,
    stage12Started: false,
    source: "project-rename-terminal-history-and-core-undo-redo-contract",
    evidenceStatus: "bounded-project-rename-handler-classifier-binding",
    remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this operation-specific binding.",
  };
});

export const TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = {
  schemaVersion: PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: PROJECT_RENAME_COMMAND_KIND,
  operationKindCount: 1,
  sourceStatusCount: SOURCE_STATUSES.length,
  evidenceCount: TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE.length,
  sourceStatuses: SOURCE_STATUSES,
  undoHandler: "bridgeProjectRenameExecutionToTerminalHistory" as const,
  undoRereadClassifier: "projectRenameTerminalHistoryReceiptSchema" as const,
  redoHandler: "bridgeProjectRenameRedoToTerminalHistory" as const,
  redoRereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema" as const,
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash" as const,
  transitionInvocation: "not-invoked" as const,
  rereadInvocation: "not-invoked" as const,
  m754RedoBridge: "preserved-out-of-scope" as const,
  m902SemanticEvidence: "preserved-out-of-scope" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  stage11Ready: false as const,
  stage12Started: false as const,
  remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded project.rename projection.",
};

function parseEvidence(input: unknown): ProjectRenameRedoHandlerClassifierEvidence {
  const value = record(input, "M975 project.rename evidence");
  exactKeys(value, [
    "allowedTransitionsAfter", "allowedTransitionsBefore", "applyAuthority", "applyHandler", "commandKind", "destinationStatus", "evidenceStatus", "exactTargetRequired", "executionAuthority", "foreignStateMutation", "generationAndHashRequired", "handlerBindingStatus", "liveBehavior", "m754RedoBridge", "m902SemanticEvidence", "matchedRereadClassifier", "metadataOnlyRenameRequired", "noExecutionAuthority", "noGenericExecutor", "noTransitionAuthority", "nonCertifying", "operation", "operationAuthority", "projectContentPreserved", "readOnly", "remainingGap", "rereadInvocation", "rereadRequirement", "rereadStatus", "reviewAuthority", "schemaVersion", "source", "sourceStatus", "stage11Ready", "stage12Started", "targetAuthority", "transition", "transitionInvocation", "undoRedoHandler",
  ], "M975 project.rename evidence");
  exact(value.schemaVersion, PROJECT_STAGE11_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION, "M975.schemaVersion");
  exact(value.commandKind, PROJECT_RENAME_COMMAND_KIND, "M975.commandKind");
  exact(value.operation, "dicebox.project.rename", "M975.operation");
  exact(value.reviewAuthority, "human-review", "M975.reviewAuthority");
  exact(value.targetAuthority, "local-project", "M975.targetAuthority");
  exact(value.applyAuthority, "operation-specific", "M975.applyAuthority");
  exact(value.operationAuthority, "not-granted", "M975.operationAuthority");
  exact(value.handlerBindingStatus, "bound-operation-specific", "M975.handlerBindingStatus");
  exact(value.rereadStatus, "matched", "M975.rereadStatus");
  exact(value.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M975.rereadRequirement");
  for (const field of ["exactTargetRequired", "generationAndHashRequired", "metadataOnlyRenameRequired", "projectContentPreserved", "noTransitionAuthority", "readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor"] as const) exact(value[field], true, `M975.${field}`);
  exact(value.stage11Ready, false, "M975.stage11Ready");
  exact(value.stage12Started, false, "M975.stage12Started");
  exact(value.transitionInvocation, "not-invoked", "M975.transitionInvocation");
  exact(value.rereadInvocation, "not-invoked", "M975.rereadInvocation");
  exact(value.m754RedoBridge, "preserved-out-of-scope", "M975.m754RedoBridge");
  exact(value.m902SemanticEvidence, "preserved-out-of-scope", "M975.m902SemanticEvidence");
  exact(value.evidenceStatus, "bounded-project-rename-handler-classifier-binding", "M975.evidenceStatus");
  return value as ProjectRenameRedoHandlerClassifierEvidence;
}

export function createProjectRenameRedoHandlerClassifierEvidence(input: unknown): readonly ProjectRenameRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectRenameRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectRenameRedoHandlerClassifierEvidence[] {
    const value = input as unknown[];
    if (!Array.isArray(value) || value.length !== SOURCE_STATUSES.length) blocked("M975 evidence must contain exactly two projections.");
    return Object.freeze(value.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectRenameRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectRenameRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectRenameRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectRenameRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M975_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M754_SOURCE_RECEIPT,
  semantic: M902_SEMANTIC_RECEIPT,
});
