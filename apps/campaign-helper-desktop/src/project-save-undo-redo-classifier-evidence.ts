import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "./project-review-apply-coverage";
import {
  bridgeProjectSaveExecutionToTerminalHistory,
  projectSaveTerminalHistoryReceiptSchema,
} from "./project-save-terminal-history";

export const PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SCHEMA_VERSION = "0.1.0" as const;

const PROJECT_SAVE_COMMAND_KIND = "project.save" as const;
const PROJECT_SAVE_OPERATION = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[PROJECT_SAVE_COMMAND_KIND];
const PROJECT_SAVE_UNDO_REDO_SOURCE_STATUSES = ["committed", "undone"] as const;

type ProjectSaveUndoRedoSourceStatus = typeof PROJECT_SAVE_UNDO_REDO_SOURCE_STATUSES[number];

type ProjectSaveUndoRedoHandlerBinding = Readonly<{
  handler: typeof bridgeProjectSaveExecutionToTerminalHistory | null;
  handlerName: string;
  rereadClassifier: typeof projectSaveTerminalHistoryReceiptSchema | null;
  rereadClassifierName: string;
  status: "bound-operation-specific" | "unprojected";
}>;

const PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS: Readonly<Record<"undo" | "redo", ProjectSaveUndoRedoHandlerBinding>> = {
  undo: {
    handler: bridgeProjectSaveExecutionToTerminalHistory,
    handlerName: "bridgeProjectSaveExecutionToTerminalHistory",
    rereadClassifier: projectSaveTerminalHistoryReceiptSchema,
    rereadClassifierName: "projectSaveTerminalHistoryReceiptSchema",
    status: "bound-operation-specific",
  },
  redo: {
    handler: null,
    handlerName: "unprojected",
    rereadClassifier: null,
    rereadClassifierName: "unproven",
    status: "unprojected",
  },
};

export const TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS = PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS;

export type ProjectSaveUndoRedoClassifierEvidence = Readonly<{
  schemaVersion: typeof PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SCHEMA_VERSION;
  commandKind: typeof PROJECT_SAVE_COMMAND_KIND;
  operation: "dicebox.project.save";
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  applyHandler: string;
  sourceStatus: ProjectSaveUndoRedoSourceStatus;
  transition: "undo" | "redo";
  destinationStatus: "undone" | "redone";
  allowedTransitionsBefore: readonly string[];
  allowedTransitionsAfter: readonly string[];
  undoRedoHandler: string;
  matchedRereadClassifier: string;
  handlerBindingStatus: "bound-operation-specific" | "unprojected";
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash";
  exactTargetRequired: true;
  revisionAndHashRequired: true;
  postTransitionClassification: "required";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  noTransitionAuthority: true;
  executionAuthority: "none";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  m748UndoRedoProjection: "preserved-out-of-scope";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
  stage11Ready: false;
  stage12Started: false;
  source: "project-save-terminal-history-and-core-undo-redo-contract";
  evidenceStatus: "bounded-project-save-handler-classifier-binding";
  remainingGap: string;
}>;

export const TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE: readonly ProjectSaveUndoRedoClassifierEvidence[] =
  PROJECT_SAVE_UNDO_REDO_SOURCE_STATUSES.map((sourceStatus) => {
    const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[sourceStatus];
    const handlerBinding = PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS[transition.transition];
    return {
      schemaVersion: PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
      commandKind: PROJECT_SAVE_COMMAND_KIND,
      operation: "dicebox.project.save",
      reviewAuthority: PROJECT_SAVE_OPERATION.reviewAuthority,
      targetAuthority: PROJECT_SAVE_OPERATION.targetAuthority,
      applyAuthority: PROJECT_SAVE_OPERATION.applyAuthority,
      operationAuthority: "not-granted",
      applyHandler: PROJECT_SAVE_OPERATION.applyHandler,
      sourceStatus,
      transition: transition.transition,
      destinationStatus: transition.destinationStatus,
      allowedTransitionsBefore: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[sourceStatus],
      allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[transition.destinationStatus],
      undoRedoHandler: handlerBinding.handlerName,
      matchedRereadClassifier: handlerBinding.rereadClassifierName,
      handlerBindingStatus: handlerBinding.status,
      rereadStatus: transition.rereadStatus,
      rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
      exactTargetRequired: true,
      revisionAndHashRequired: true,
      postTransitionClassification: "required",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      foreignStateMutation: "none",
      liveBehavior: "unproven",
      m748UndoRedoProjection: "preserved-out-of-scope",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: PROJECT_SAVE_OPERATION.noGenericExecutor,
      stage11Ready: false,
      stage12Started: false,
      source: "project-save-terminal-history-and-core-undo-redo-contract",
      evidenceStatus: "bounded-project-save-handler-classifier-binding",
      remainingGap: "A project.save-specific redo handler and redo reread classifier are not present in the current operation surface; aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this projection.",
    };
  });

export const TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY = {
  schemaVersion: PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SCHEMA_VERSION,
  commandKind: PROJECT_SAVE_COMMAND_KIND,
  operationKindCount: 1,
  sourceStatusCount: PROJECT_SAVE_UNDO_REDO_SOURCE_STATUSES.length,
  evidenceCount: TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.length,
  sourceStatuses: PROJECT_SAVE_UNDO_REDO_SOURCE_STATUSES,
  undoHandler: "bridgeProjectSaveExecutionToTerminalHistory" as const,
  undoRereadClassifier: "projectSaveTerminalHistoryReceiptSchema" as const,
  redoHandler: "unprojected" as const,
  redoRereadClassifier: "unproven" as const,
  rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash" as const,
  transitionInvocation: "not-invoked" as const,
  rereadInvocation: "not-invoked" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  m748UndoRedoProjection: "preserved-out-of-scope" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  stage11Ready: false as const,
  stage12Started: false as const,
  remainingGap: "Redo operation-specific handler/classifier, aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded project.save projection.",
};
