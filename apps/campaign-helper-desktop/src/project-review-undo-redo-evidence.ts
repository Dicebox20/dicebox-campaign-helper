import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
  type ProposalBatchHistory,
  type ProposalBatchReceipt,
} from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
  type TypedLocalProjectReviewApplyCommandKind,
} from "./project-review-apply-coverage";

const TYPED_UNDO_REDO_SOURCE_STATUSES = ["committed", "undone"] as const satisfies readonly (keyof typeof TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS)[];

type UndoRedoSourceStatus = typeof TYPED_UNDO_REDO_SOURCE_STATUSES[number];
type UndoRedoTransition = typeof TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[UndoRedoSourceStatus]["transition"];
type UndoRedoDestinationStatus = typeof TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[UndoRedoSourceStatus]["destinationStatus"];

export type TypedLocalProjectUndoRedoEvidence = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  applyHandler: string;
  sourceStatus: UndoRedoSourceStatus;
  transition: UndoRedoTransition;
  destinationStatus: UndoRedoDestinationStatus;
  allowedTransitionsBefore: readonly ProposalBatchReceipt["transition"][];
  allowedTransitionsAfter: readonly ProposalBatchReceipt["transition"][];
  rereadStatus: "matched";
  rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash";
  exactTargetRequired: true;
  revisionAndHashRequired: true;
  rereadInvocation: "not-invoked";
  transitionInvocation: "not-invoked";
  undoRedoProjection: "contract-mapped-not-invoked";
  operationSpecificUndoRedoHandler: "unprojected";
  operationSpecificRereadClassifier: "unproven";
  m747RecoveryResultProjection: "preserved-out-of-scope";
  noTransitionAuthority: true;
  executionAuthority: "none";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  stage11Ready: false;
  stage12Started: false;
  source: "core-undo-redo-transition-and-operation-contract";
  evidenceStatus: "bounded-undo-redo-lifecycle-projection";
  remainingLifecycleGap: string;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE: readonly TypedLocalProjectUndoRedoEvidence[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.flatMap((commandKind) =>
    TYPED_UNDO_REDO_SOURCE_STATUSES.map((sourceStatus) => {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
      const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[sourceStatus];
      const destinationStatus = transition.destinationStatus;
      if (!TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[sourceStatus].includes(transition.transition)) {
        throw new Error("Core undo/redo transition source mismatch.");
      }
      return {
        commandKind,
        reviewAuthority: operation.reviewAuthority,
        targetAuthority: operation.targetAuthority,
        applyAuthority: operation.applyAuthority,
        operationAuthority: "not-granted",
        applyHandler: operation.applyHandler,
        sourceStatus,
        transition: transition.transition,
        destinationStatus,
        allowedTransitionsBefore: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[sourceStatus],
        allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[destinationStatus],
        rereadStatus: transition.rereadStatus,
        rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
        exactTargetRequired: true,
        revisionAndHashRequired: true,
        rereadInvocation: "not-invoked",
        transitionInvocation: "not-invoked",
        undoRedoProjection: "contract-mapped-not-invoked",
        operationSpecificUndoRedoHandler: "unprojected",
        operationSpecificRereadClassifier: "unproven",
        m747RecoveryResultProjection: "preserved-out-of-scope",
        noTransitionAuthority: true,
        executionAuthority: "none",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        stage11Ready: false,
        stage12Started: false,
        source: "core-undo-redo-transition-and-operation-contract",
        evidenceStatus: "bounded-undo-redo-lifecycle-projection",
        remainingLifecycleGap: "Aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded undo/redo projection.",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: operation.noGenericExecutor,
      };
    }),
  );

export const TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY = {
  commandKindCount: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length,
  sourceStatusCount: TYPED_UNDO_REDO_SOURCE_STATUSES.length,
  evidenceCount: TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.length,
  sourceStatuses: TYPED_UNDO_REDO_SOURCE_STATUSES,
  rereadStatus: "matched" as const,
  rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash" as const,
  transitionInvocation: "not-invoked" as const,
  operationSpecificUndoRedoHandler: "unprojected" as const,
  operationSpecificRereadClassifier: "unproven" as const,
  m747RecoveryResultProjection: "preserved-out-of-scope" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  remainingLifecycleGap: "Aggregate current/package/runtime authority and live active-GM/Foundry behavior remain outside this bounded projection.",
};
