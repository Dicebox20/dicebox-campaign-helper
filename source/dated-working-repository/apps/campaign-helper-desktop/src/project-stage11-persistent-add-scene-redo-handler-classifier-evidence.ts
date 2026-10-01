import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS } from "./project-review-apply-coverage";
import {
  bridgeProjectPersistentAddSceneExecutionToTerminalHistory,
  bridgeProjectPersistentAddSceneRedoToTerminalHistory,
  projectPersistentAddSceneRedoTerminalHistoryReceiptSchema,
  projectPersistentAddSceneTerminalHistoryReceiptSchema,
} from "./project-add-scene-terminal-history";

export const PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const PROJECT_PERSISTENT_ADD_SCENE_COMMAND_KIND = "project.add-scene.persist" as const;
const PROJECT_PERSISTENT_ADD_SCENE_OPERATION = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS["project.add-scene"];
const M756_SOURCE_RECEIPT = "outputs/m756-stage11-project-add-scene-redo-terminal-history-bridge-closure-receipt.json" as const;
const M912_SEMANTIC_RECEIPT = "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json" as const;
const SOURCE_STATUSES = ["committed", "undone"] as const;

type SourceStatus = typeof SOURCE_STATUSES[number];

type HandlerBinding = Readonly<{
  handler: typeof bridgeProjectPersistentAddSceneExecutionToTerminalHistory | typeof bridgeProjectPersistentAddSceneRedoToTerminalHistory;
  handlerName: string;
  rereadClassifier: typeof projectPersistentAddSceneTerminalHistoryReceiptSchema | typeof projectPersistentAddSceneRedoTerminalHistoryReceiptSchema;
  rereadClassifierName: string;
  status: "bound-operation-specific";
}>;

const HANDLER_BINDINGS: Readonly<Record<"undo" | "redo", HandlerBinding>> = {
  undo: {
    handler: bridgeProjectPersistentAddSceneExecutionToTerminalHistory,
    handlerName: "bridgeProjectPersistentAddSceneExecutionToTerminalHistory",
    rereadClassifier: projectPersistentAddSceneTerminalHistoryReceiptSchema,
    rereadClassifierName: "projectPersistentAddSceneTerminalHistoryReceiptSchema",
    status: "bound-operation-specific",
  },
  redo: {
    handler: bridgeProjectPersistentAddSceneRedoToTerminalHistory,
    handlerName: "bridgeProjectPersistentAddSceneRedoToTerminalHistory",
    rereadClassifier: projectPersistentAddSceneRedoTerminalHistoryReceiptSchema,
    rereadClassifierName: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
    status: "bound-operation-specific",
  },
};

export const TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS = HANDLER_BINDINGS;

export type ProjectPersistentAddSceneRedoHandlerClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: typeof PROJECT_PERSISTENT_ADD_SCENE_COMMAND_KIND;
  operation: "dicebox.project.add-scene.persist";
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
  orderedSceneSetRequired: true;
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  m756RedoBridge: "preserved-out-of-scope";
  m912SemanticEvidence: "preserved-out-of-scope";
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
  source: "project-add-scene-terminal-history-and-core-undo-redo-contract";
  evidenceStatus: "bounded-project-add-scene-persist-handler-classifier-binding";
  remainingGap: string;
}>;

function blocked(message: string): never {
  throw new ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError(message);
}

export class ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError extends Error {
  readonly code = "PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_VALIDATION_FAILED" as const;
  readonly retryAllowed = false;

  constructor(message: string) {
    super(message);
    this.name = "ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError";
  }
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

function validateM756BridgeReceipt(input: unknown): void {
  const source = record(input, "M756 source receipt");
  exact(source.milestone, "M756", "M756.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY PROJECT.ADD-SCENE.PERSIST REDO BRIDGE/CLASSIFIER; STAGE 11 NOT ACCEPTED", "M756.status");
  const implementation = record(source.implementation, "M756.implementation");
  exact(implementation.source, "apps/campaign-helper-desktop/src/project-add-scene-terminal-history.ts", "M756.implementation.source");
  exact(implementation.focusedTest, "tests/project-add-scene-terminal-history.test.ts", "M756.implementation.focusedTest");
  if (typeof implementation.bridge !== "string" || !implementation.bridge.includes("bridgeProjectPersistentAddSceneRedoToTerminalHistory validates one project.add-scene.persist-only")) blocked("M756 bridge identity is not exact.");
  if (typeof implementation.classifier !== "string" || !implementation.classifier.includes("projectPersistentAddSceneRedoTerminalHistoryReceiptSchema revalidates the terminal-redone bridge output")) blocked("M756 classifier identity is not exact.");
  const acceptance = record(source.acceptance, "M756.acceptance");
  exact(acceptance.stage11, "ACTIVE; 10/16 workflow gates passed; not accepted.", "M756.acceptance.stage11");
  exact(acceptance.stage12, "NOT STARTED", "M756.acceptance.stage12");
  if (typeof acceptance.decision !== "string" || !acceptance.decision.includes("project.add-scene.persist redo terminal-history bridge/classifier gap")) blocked("M756 acceptance decision does not preserve the bounded bridge/classifier scope.");
}

function validateM912SemanticReceipt(input: unknown): void {
  const source = record(input, "M912 semantic receipt");
  exact(source.milestone, "M912", "M912.milestone");
  exact(source.status, "PASS LOCAL CODE-ONLY COMPOSITION; STAGE 11 NOT ACCEPTED", "M912.status");
  const evidence = record(source.evidence, "M912.evidence");
  exact(evidence.operation, "project.add-scene.persist.redo", "M912.evidence.operation");
  exact(evidence.strictProducerReceipt, "dicebox.project.add-scene.persist.redo", "M912.evidence.strictProducerReceipt");
  exact(evidence.matchedReread, true, "M912.evidence.matchedReread");
  const boundary = record(source.boundary, "M912.boundary");
  exact(boundary.readOnly, true, "M912.boundary.readOnly");
  exact(boundary.nonCertifying, true, "M912.boundary.nonCertifying");
  exact(boundary.noExecutionAuthority, true, "M912.boundary.noExecutionAuthority");
  exact(boundary.noTransitionAuthority, true, "M912.boundary.noTransitionAuthority");
  exact(boundary.noProjectMutation, true, "M912.boundary.noProjectMutation");
  exact(boundary.aggregateSemanticAttachment, false, "M912.boundary.aggregateSemanticAttachment");
  exact(boundary.stage11AcceptanceStatus, "blocked", "M912.boundary.stage11AcceptanceStatus");
  exact(boundary.stage12Started, false, "M912.boundary.stage12Started");
  exact(boundary.readyClaim, false, "M912.boundary.readyClaim");
}

function validateSources(input: unknown): void {
  const value = record(input, "M971 source bundle");
  exactKeys(value, ["bridgeReceipt", "semanticReceipt"], "M971 source bundle");
  validateM756BridgeReceipt(value.bridgeReceipt);
  validateM912SemanticReceipt(value.semanticReceipt);
}

export const TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE: readonly ProjectPersistentAddSceneRedoHandlerClassifierEvidence[] = SOURCE_STATUSES.map((sourceStatus) => {
  const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[sourceStatus];
  const binding = HANDLER_BINDINGS[transition.transition];
  return {
    schemaVersion: PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
    commandKind: PROJECT_PERSISTENT_ADD_SCENE_COMMAND_KIND,
    operation: "dicebox.project.add-scene.persist",
    reviewAuthority: PROJECT_PERSISTENT_ADD_SCENE_OPERATION.reviewAuthority,
    targetAuthority: PROJECT_PERSISTENT_ADD_SCENE_OPERATION.targetAuthority,
    applyAuthority: PROJECT_PERSISTENT_ADD_SCENE_OPERATION.applyAuthority,
    operationAuthority: "not-granted",
    applyHandler: PROJECT_PERSISTENT_ADD_SCENE_OPERATION.applyHandler,
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
    orderedSceneSetRequired: true,
    transitionInvocation: "not-invoked",
    rereadInvocation: "not-invoked",
    m756RedoBridge: "preserved-out-of-scope",
    m912SemanticEvidence: "preserved-out-of-scope",
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
    source: "project-add-scene-terminal-history-and-core-undo-redo-contract",
    evidenceStatus: "bounded-project-add-scene-persist-handler-classifier-binding",
    remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this operation-specific binding.",
  };
});

export const TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY = {
  schemaVersion: PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: PROJECT_PERSISTENT_ADD_SCENE_COMMAND_KIND,
  operationKindCount: 1,
  sourceStatusCount: SOURCE_STATUSES.length,
  evidenceCount: TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE.length,
  sourceStatuses: SOURCE_STATUSES,
  undoHandler: "bridgeProjectPersistentAddSceneExecutionToTerminalHistory" as const,
  undoRereadClassifier: "projectPersistentAddSceneTerminalHistoryReceiptSchema" as const,
  redoHandler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory" as const,
  redoRereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema" as const,
  rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash" as const,
  transitionInvocation: "not-invoked" as const,
  rereadInvocation: "not-invoked" as const,
  m756RedoBridge: "preserved-out-of-scope" as const,
  m912SemanticEvidence: "preserved-out-of-scope" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  stage11Ready: false as const,
  stage12Started: false as const,
  remainingGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded project.add-scene.persist projection.",
};

function parseEvidence(input: unknown): ProjectPersistentAddSceneRedoHandlerClassifierEvidence {
  const value = record(input, "M971 project.add-scene.persist evidence");
  exactKeys(value, [
    "allowedTransitionsAfter", "allowedTransitionsBefore", "applyAuthority", "applyHandler", "commandKind", "destinationStatus", "evidenceStatus", "exactTargetRequired", "executionAuthority", "foreignStateMutation", "generationAndHashRequired", "handlerBindingStatus", "liveBehavior", "m756RedoBridge", "m912SemanticEvidence", "matchedRereadClassifier", "noExecutionAuthority", "noGenericExecutor", "noTransitionAuthority", "nonCertifying", "operation", "operationAuthority", "orderedSceneSetRequired", "readOnly", "remainingGap", "rereadInvocation", "rereadRequirement", "rereadStatus", "reviewAuthority", "schemaVersion", "source", "sourceStatus", "stage11Ready", "stage12Started", "targetAuthority", "transition", "transitionInvocation", "undoRedoHandler",
  ], "M971 project.add-scene.persist evidence");
  exact(value.schemaVersion, PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SCHEMA_VERSION, "M971.schemaVersion");
  exact(value.commandKind, PROJECT_PERSISTENT_ADD_SCENE_COMMAND_KIND, "M971.commandKind");
  exact(value.operation, "dicebox.project.add-scene.persist", "M971.operation");
  exact(value.reviewAuthority, "human-review", "M971.reviewAuthority");
  exact(value.targetAuthority, "local-project", "M971.targetAuthority");
  exact(value.applyAuthority, "operation-specific", "M971.applyAuthority");
  exact(value.operationAuthority, "not-granted", "M971.operationAuthority");
  exact(value.handlerBindingStatus, "bound-operation-specific", "M971.handlerBindingStatus");
  exact(value.rereadStatus, "matched", "M971.rereadStatus");
  exact(value.rereadRequirement, "matched-post-transition-exact-target-with-generation-and-hash", "M971.rereadRequirement");
  for (const field of ["exactTargetRequired", "generationAndHashRequired", "orderedSceneSetRequired", "noTransitionAuthority", "readOnly", "nonCertifying", "noExecutionAuthority", "noGenericExecutor", "stage11Ready", "stage12Started"] as const) {
    exact(value[field], field === "stage11Ready" || field === "stage12Started" ? false : true, `M971.${field}`);
  }
  exact(value.transitionInvocation, "not-invoked", "M971.transitionInvocation");
  exact(value.rereadInvocation, "not-invoked", "M971.rereadInvocation");
  exact(value.m756RedoBridge, "preserved-out-of-scope", "M971.m756RedoBridge");
  exact(value.m912SemanticEvidence, "preserved-out-of-scope", "M971.m912SemanticEvidence");
  exact(value.evidenceStatus, "bounded-project-add-scene-persist-handler-classifier-binding", "M971.evidenceStatus");
  return value as ProjectPersistentAddSceneRedoHandlerClassifierEvidence;
}

export function createProjectPersistentAddSceneRedoHandlerClassifierEvidence(input: unknown): readonly ProjectPersistentAddSceneRedoHandlerClassifierEvidence[] {
  validateSources(input);
  return Object.freeze(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => Object.freeze({ ...entry })));
}

export const projectPersistentAddSceneRedoHandlerClassifierEvidenceSchema = Object.freeze({
  parse(input: unknown): readonly ProjectPersistentAddSceneRedoHandlerClassifierEvidence[] {
    const value = input as unknown[];
    if (!Array.isArray(value) || value.length !== SOURCE_STATUSES.length) blocked("M971 evidence must contain exactly two projections.");
    return Object.freeze(value.map(parseEvidence));
  },
  safeParse(input: unknown):
    | Readonly<{ success: true; data: readonly ProjectPersistentAddSceneRedoHandlerClassifierEvidence[] }>
    | Readonly<{ success: false; error: ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError }> {
    try {
      return { success: true, data: this.parse(input) };
    } catch (error) {
      const validationError = error instanceof ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError
        ? error
        : new ProjectPersistentAddSceneRedoHandlerClassifierEvidenceValidationError(error instanceof Error ? error.message : String(error));
      return { success: false, error: validationError };
    }
  },
});

export const M971_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_SOURCE_RECEIPTS = Object.freeze({
  bridge: M756_SOURCE_RECEIPT,
  semantic: M912_SEMANTIC_RECEIPT,
});
