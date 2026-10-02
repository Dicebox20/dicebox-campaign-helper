import { TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS, type ProposalBatchHistory } from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
  type TypedLocalProjectReviewApplyCommandKind,
} from "./project-review-apply-coverage";

export const TYPED_REVIEW_TERMINAL_HISTORY_STATES = ["rejected", "cancelled", "stale"] as const;

export type TypedReviewTerminalHistoryState = typeof TYPED_REVIEW_TERMINAL_HISTORY_STATES[number];
type ReviewTerminalTransition = "reject" | "cancel" | "invalidate-stale";

type ReviewTerminalEvidenceDetail = Readonly<{
  transition: ReviewTerminalTransition;
  allowedSourceStatuses: readonly ProposalBatchHistory["status"][];
}>;

const REVIEW_TERMINAL_EVIDENCE_DETAILS: Readonly<Record<TypedReviewTerminalHistoryState, ReviewTerminalEvidenceDetail>> = {
  rejected: { transition: "reject", allowedSourceStatuses: ["previewed"] },
  cancelled: { transition: "cancel", allowedSourceStatuses: ["previewed", "approved"] },
  stale: { transition: "invalidate-stale", allowedSourceStatuses: ["previewed", "approved"] },
};

export type TypedLocalProjectReviewTerminalStateEvidence = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  applyHandler: string;
  reviewTerminalState: TypedReviewTerminalHistoryState;
  transition: ReviewTerminalTransition;
  allowedSourceStatuses: readonly ProposalBatchHistory["status"][];
  allowedTransitionsAfter: readonly ProposalBatchHistory["receipts"][number]["transition"][];
  terminalNoApply: true;
  executionAuthority: "none";
  transitionInvocation: "not-invoked";
  source: "operation-contract-and-core-allowed-transitions";
  evidenceStatus: "bounded-review-terminal-projection";
  remainingLifecycleGap: string;
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

function sourceStatusesFor(transition: ReviewTerminalTransition): readonly ProposalBatchHistory["status"][] {
  return (Object.keys(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS) as ProposalBatchHistory["status"][]).filter((status) =>
    (TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[status] as readonly string[]).includes(transition),
  );
}

export const TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE: readonly TypedLocalProjectReviewTerminalStateEvidence[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.flatMap((commandKind) =>
    TYPED_REVIEW_TERMINAL_HISTORY_STATES.map((reviewTerminalState) => {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
      const detail = REVIEW_TERMINAL_EVIDENCE_DETAILS[reviewTerminalState];
      const allowedSourceStatuses = sourceStatusesFor(detail.transition);
      if (allowedSourceStatuses.join(",") !== detail.allowedSourceStatuses.join(",")) {
        throw new Error(`Core transition source mismatch for ${detail.transition}.`);
      }
      return {
        commandKind,
        applyHandler: operation.applyHandler,
        reviewTerminalState,
        transition: detail.transition,
        allowedSourceStatuses,
        allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[reviewTerminalState],
        terminalNoApply: true,
        executionAuthority: "none",
        transitionInvocation: "not-invoked",
        source: "operation-contract-and-core-allowed-transitions",
        evidenceStatus: "bounded-review-terminal-projection",
        remainingLifecycleGap: "Applying, unknown-outcome, committed, recovered, undone, and redone require separate operation-specific lifecycle and authoritative-reread evidence.",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: operation.noGenericExecutor,
      };
    }),
  );

export const TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY = {
  commandKindCount: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.length,
  terminalStateCount: TYPED_REVIEW_TERMINAL_HISTORY_STATES.length,
  evidenceCount: TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE.length,
  terminalStates: TYPED_REVIEW_TERMINAL_HISTORY_STATES,
  transitionInvocation: "not-invoked" as const,
  readOnly: true as const,
  nonCertifying: true as const,
  noExecutionAuthority: true as const,
  noGenericExecutor: true as const,
  remainingLifecycleGap: "Later applying, unknown-outcome, committed, recovered, undone, and redone states remain outside this bounded review-terminal slice.",
};
