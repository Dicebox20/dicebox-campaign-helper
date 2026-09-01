import {
  TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP,
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  type ProposalBatchHistory,
  type ProposalBatchReceipt,
  type ProposalBatchReread,
} from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
  type TypedLocalProjectReviewApplyCommandKind,
} from "./project-review-apply-coverage";

export const TYPED_RECOVERY_RESULT_REREAD_STATUSES = ["matched", "not-committed", "conflict", "unknown"] as const;

export type TypedRecoveryResultRereadStatus = typeof TYPED_RECOVERY_RESULT_REREAD_STATUSES[number];
type RecoveryResultStatus = "committed" | "recovered" | "unknown-outcome";

type RecoveryResultEvidenceDetail = Readonly<{
  rereadInvocation: "not-invoked";
  rereadRequirement: "resolved-exact-target-with-revision-and-hash" | "unknown-exact-target-without-revision-or-hash";
}>;

const RECOVERY_RESULT_EVIDENCE_DETAILS: Readonly<Record<TypedRecoveryResultRereadStatus, RecoveryResultEvidenceDetail>> = {
  matched: {
    rereadInvocation: "not-invoked",
    rereadRequirement: "resolved-exact-target-with-revision-and-hash",
  },
  "not-committed": {
    rereadInvocation: "not-invoked",
    rereadRequirement: "resolved-exact-target-with-revision-and-hash",
  },
  conflict: {
    rereadInvocation: "not-invoked",
    rereadRequirement: "resolved-exact-target-with-revision-and-hash",
  },
  unknown: {
    rereadInvocation: "not-invoked",
    rereadRequirement: "unknown-exact-target-without-revision-or-hash",
  },
};

export type TypedLocalProjectRecoveryResultEvidence = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  operationAuthority: "not-granted";
  applyHandler: string;
  rereadStatus: TypedRecoveryResultRereadStatus;
  sourceStatus: "unknown-outcome";
  transition: "recover-after-reread";
  resultStatus: RecoveryResultStatus;
  allowedSourceStatuses: readonly ProposalBatchHistory["status"][];
  allowedTransitionsAfter: readonly ProposalBatchReceipt["transition"][];
  rereadRequirement: RecoveryResultEvidenceDetail["rereadRequirement"];
  exactTargetRequired: true;
  retryPolicy: "same-history-execution-retry-forbidden";
  sameHistoryExecutionRetryAllowed: false;
  recoveryResultProjection: "contract-mapped-not-invoked";
  transitionInvocation: "not-invoked";
  rereadInvocation: "not-invoked";
  foreignStateMutation: "none";
  liveBehavior: "unproven";
  stage11Ready: false;
  stage12Started: false;
  noTransitionAuthority: true;
  executionAuthority: "none";
  source: "core-recovery-mapping-and-operation-contract";
  evidenceStatus: "bounded-recovery-result-projection";
  remainingLifecycleGap: string;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE: readonly TypedLocalProjectRecoveryResultEvidence[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.flatMap((commandKind) =>
    TYPED_RECOVERY_RESULT_REREAD_STATUSES.map((rereadStatus) => {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
      const detail = RECOVERY_RESULT_EVIDENCE_DETAILS[rereadStatus];
      const canonicalResult = TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP[rereadStatus];
      const allowedSourceStatuses = (Object.keys(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS) as ProposalBatchHistory["status"][]).filter((status) =>
        TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[status].includes("recover-after-reread"),
      );
      if (allowedSourceStatuses.length !== 1 || allowedSourceStatuses[0] !== "unknown-outcome") {
        throw new Error("Core recovery transition source mismatch.");
      }
      return {
        commandKind,
        reviewAuthority: operation.reviewAuthority,
        targetAuthority: operation.targetAuthority,
        applyAuthority: operation.applyAuthority,
        operationAuthority: "not-granted",
        applyHandler: operation.applyHandler,
        rereadStatus,
        sourceStatus: "unknown-outcome",
        transition: "recover-after-reread",
        resultStatus: canonicalResult.resultStatus as RecoveryResultStatus,
        allowedSourceStatuses,
        allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[canonicalResult.resultStatus],
        rereadRequirement: detail.rereadRequirement,
        exactTargetRequired: true,
        retryPolicy: "same-history-execution-retry-forbidden",
        sameHistoryExecutionRetryAllowed: canonicalResult.sameHistoryExecutionRetryAllowed,
        recoveryResultProjection: "contract-mapped-not-invoked",
        transitionInvocation: "not-invoked",
        rereadInvocation: detail.rereadInvocation,
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        stage11Ready: false,
        stage12Started: false,
        noTransitionAuthority: true,
        executionAuthority: "none",
        source: "core-recovery-mapping-and-operation-contract",
        evidenceStatus: "bounded-recovery-result-projection",
        remainingLifecycleGap: "Undo and redo evidence, aggregate current authority, packaged/runtime authority, and live active-GM/Foundry behavior remain outside this bounded recovery-result projection.",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: operation.noGenericExecutor,
      };
    }),
  );

export const TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY = {
  commandKindCount: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length,
  rereadStatusCount: TYPED_RECOVERY_RESULT_REREAD_STATUSES.length,
  evidenceCount: TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE.length,
  rereadStatuses: TYPED_RECOVERY_RESULT_REREAD_STATUSES,
  sameHistoryExecutionRetryAllowed: false as const,
  transition: "recover-after-reread" as const,
  recoveryResultProjection: "contract-mapped-not-invoked" as const,
  transitionInvocation: "not-invoked" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  remainingLifecycleGap: "Undo/redo and aggregate current/package/runtime authority remain outside this bounded projection.",
};
