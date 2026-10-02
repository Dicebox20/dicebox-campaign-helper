import {
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

export const TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS = [
  "approved-to-applying",
  "applying-to-unknown-outcome",
  "unknown-outcome-reread-gate",
] as const;

export type TypedApplyingUnknownEvidenceCheckpoint = typeof TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS[number];
type ApplyUnknownTransition = "begin-apply" | "mark-unknown" | "recover-after-reread";

type ApplyingUnknownEvidenceDetail = Readonly<{
  sourceStatus: ProposalBatchHistory["status"];
  transition: ApplyUnknownTransition;
  destinationStatus: ProposalBatchHistory["status"] | "recovery-result-unprojected";
  retryPolicy: "not-applicable-before-unknown" | "forbidden-until-authoritative-reread";
  rereadRequired: boolean;
  rereadStatuses: readonly ProposalBatchReread["status"][];
}>;

const APPLYING_UNKNOWN_EVIDENCE_DETAILS: Readonly<Record<TypedApplyingUnknownEvidenceCheckpoint, ApplyingUnknownEvidenceDetail>> = {
  "approved-to-applying": {
    sourceStatus: "approved",
    transition: "begin-apply",
    destinationStatus: "applying",
    retryPolicy: "not-applicable-before-unknown",
    rereadRequired: false,
    rereadStatuses: [],
  },
  "applying-to-unknown-outcome": {
    sourceStatus: "applying",
    transition: "mark-unknown",
    destinationStatus: "unknown-outcome",
    retryPolicy: "forbidden-until-authoritative-reread",
    rereadRequired: true,
    rereadStatuses: ["matched", "not-committed", "conflict", "unknown"],
  },
  "unknown-outcome-reread-gate": {
    sourceStatus: "unknown-outcome",
    transition: "recover-after-reread",
    destinationStatus: "recovery-result-unprojected",
    retryPolicy: "forbidden-until-authoritative-reread",
    rereadRequired: true,
    rereadStatuses: ["matched", "not-committed", "conflict", "unknown"],
  },
};

export type TypedLocalProjectApplyingUnknownEvidence = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  applyHandler: string;
  checkpoint: TypedApplyingUnknownEvidenceCheckpoint;
  sourceStatus: ProposalBatchHistory["status"];
  transition: ApplyUnknownTransition;
  destinationStatus: ProposalBatchHistory["status"] | "recovery-result-unprojected";
  allowedSourceStatuses: readonly ProposalBatchHistory["status"][];
  allowedTransitionsAfter: readonly ProposalBatchReceipt["transition"][];
  rereadRequired: boolean;
  rereadStatuses: readonly ProposalBatchReread["status"][];
  retryPolicy: ApplyingUnknownEvidenceDetail["retryPolicy"];
  recoveryResults: "unprojected";
  transitionInvocation: "not-invoked";
  noTransitionAuthority: true;
  executionAuthority: "none";
  source: "operation-contract-and-core-allowed-transitions";
  evidenceStatus: "bounded-applying-unknown-projection";
  remainingLifecycleGap: string;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

function sourceStatusesFor(transition: ApplyUnknownTransition): readonly ProposalBatchHistory["status"][] {
  return (Object.keys(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS) as ProposalBatchHistory["status"][]).filter((status) =>
    (TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[status] as readonly string[]).includes(transition),
  );
}

export const TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE: readonly TypedLocalProjectApplyingUnknownEvidence[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.flatMap((commandKind) =>
    TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS.map((checkpoint) => {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
      const detail = APPLYING_UNKNOWN_EVIDENCE_DETAILS[checkpoint];
      const allowedSourceStatuses = sourceStatusesFor(detail.transition);
      if (allowedSourceStatuses.join(",") !== detail.sourceStatus || allowedSourceStatuses.length !== 1) {
        throw new Error(`Core transition source mismatch for ${detail.transition}.`);
      }
      return {
        commandKind,
        applyHandler: operation.applyHandler,
        checkpoint,
        sourceStatus: detail.sourceStatus,
        transition: detail.transition,
        destinationStatus: detail.destinationStatus,
        allowedSourceStatuses,
        allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[detail.destinationStatus === "recovery-result-unprojected" ? "unknown-outcome" : detail.destinationStatus],
        rereadRequired: detail.rereadRequired,
        rereadStatuses: detail.rereadStatuses,
        retryPolicy: detail.retryPolicy,
        recoveryResults: "unprojected",
        transitionInvocation: "not-invoked",
        noTransitionAuthority: true,
        executionAuthority: "none",
        source: "operation-contract-and-core-allowed-transitions",
        evidenceStatus: "bounded-applying-unknown-projection",
        remainingLifecycleGap: "Committed, recovered, undone, and redone results remain outside this bounded applying/unknown-outcome projection and still require operation-specific authoritative-reread evidence.",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: operation.noGenericExecutor,
      };
    }),
  );

export const TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY = {
  commandKindCount: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length,
  checkpointCount: TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS.length,
  evidenceCount: TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE.length,
  checkpoints: TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS,
  transitionInvocation: "not-invoked" as const,
  noTransitionAuthority: true as const,
  executionAuthority: "none" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  remainingLifecycleGap: "Recovery result states and live/package/runtime authority remain outside this bounded slice.",
};
