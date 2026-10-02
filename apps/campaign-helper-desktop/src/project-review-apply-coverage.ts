import type { DesktopProjectProposalSession } from "./project-proposal-session";
import { TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS, type ProposalBatchHistory } from "@dicebox/core";

export const TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS = [
  "project.add-scene",
  "project.recovery.backup-promote",
  "project.migration.persist",
  "project.create",
  "project.rename",
  "project.save",
  "project.save-as",
  "project.asset.register-handout",
  "project.asset.register-audio",
  "project.asset.register-token",
  "project.asset.bind",
  "project.broken-reference.detach",
  "project.asset.restore",
  "project.asset.detach",
] as const;

export type TypedLocalProjectReviewApplyCommandKind = typeof TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS[number];

export type TypedLocalProjectReviewApplyOperationContract = Readonly<{
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyHandler: string;
  applyAuthority: "operation-specific";
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS = {
  "project.add-scene": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedCommittedProjectAddScene", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.recovery.backup-promote": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedBackupPromotionProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.migration.persist": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectMigrationPersistProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.create": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectCreateProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.rename": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectRenameProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.save": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectSaveProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.save-as": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectSaveAsProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.register-handout": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectHandoutProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.register-audio": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectAudioProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.register-token": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectTokenProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.bind": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectBackgroundProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.broken-reference.detach": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedBrokenReferenceDetachProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.restore": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectAssetRestoreProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
  "project.asset.detach": { reviewAuthority: "human-review", targetAuthority: "local-project", applyHandler: "applySelectedProjectAssetDetachProposal", applyAuthority: "operation-specific", noGenericExecutor: true },
} as const satisfies Readonly<Record<TypedLocalProjectReviewApplyCommandKind, TypedLocalProjectReviewApplyOperationContract>>;

export type TypedLocalProjectReviewApplyVisibleMetadata = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  noGenericExecutor: true;
}>;

function toTypedLocalProjectReviewApplyVisibleMetadata(
  commandKind: TypedLocalProjectReviewApplyCommandKind,
): TypedLocalProjectReviewApplyVisibleMetadata {
  const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
  return {
    commandKind,
    reviewAuthority: operation.reviewAuthority,
    targetAuthority: operation.targetAuthority,
    applyAuthority: operation.applyAuthority,
    noGenericExecutor: operation.noGenericExecutor,
  };
}

export const TYPED_LOCAL_PROJECT_REVIEW_APPLY_VISIBLE_METADATA: readonly TypedLocalProjectReviewApplyVisibleMetadata[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map(toTypedLocalProjectReviewApplyVisibleMetadata);

export type TypedLocalProjectOperationLifecycleEvidenceStatus =
  | "bounded-operation-specific"
  | "aggregate-partial";

export type TypedLocalProjectOperationLifecycleEvidence = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  reviewAuthority: "human-review";
  targetAuthority: "local-project";
  applyAuthority: "operation-specific";
  applyHandler: string;
  evidenceStatus: TypedLocalProjectOperationLifecycleEvidenceStatus;
  boundedEvidence: string;
  remainingGap: string;
  nonCertifying: true;
  readOnly: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

type OperationLifecycleEvidenceDetail = Readonly<{
  evidenceStatus: TypedLocalProjectOperationLifecycleEvidenceStatus;
  boundedEvidence: string;
  remainingGap: string;
}>;

const TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_DETAILS: Readonly<Record<TypedLocalProjectReviewApplyCommandKind, OperationLifecycleEvidenceDetail>> = {
  "project.add-scene": { evidenceStatus: "aggregate-partial", boundedEvidence: "Add-Scene is covered by a bounded typed review/apply handler.", remainingGap: "Cross-producer history, authoritative reread, and recovery evidence remain distributed." },
  "project.recovery.backup-promote": { evidenceStatus: "aggregate-partial", boundedEvidence: "Backup-authoritative promotion has bounded packaged lifecycle and reread evidence.", remainingGap: "Broader recovery and cross-producer commit evidence remain partial." },
  "project.migration.persist": { evidenceStatus: "aggregate-partial", boundedEvidence: "Legacy migration persistence has a typed session and reread path.", remainingGap: "Cross-producer lifecycle and recovery acceptance remain partial." },
  "project.create": { evidenceStatus: "aggregate-partial", boundedEvidence: "Blank-project creation is covered by a bounded operation-specific path.", remainingGap: "Aggregate persistence history, reread, and recovery evidence remain partial." },
  "project.rename": { evidenceStatus: "aggregate-partial", boundedEvidence: "Metadata-only rename is covered by a bounded operation-specific path.", remainingGap: "Aggregate persistence history, reread, and recovery evidence remain partial." },
  "project.save": { evidenceStatus: "aggregate-partial", boundedEvidence: "Content-bearing save is covered by a bounded operation-specific path.", remainingGap: "Aggregate persistence history, reread, and recovery evidence remain partial." },
  "project.save-as": { evidenceStatus: "aggregate-partial", boundedEvidence: "Source-preserving save-as is covered by a bounded operation-specific path.", remainingGap: "Aggregate persistence history, reread, and recovery evidence remain partial." },
  "project.asset.register-handout": { evidenceStatus: "aggregate-partial", boundedEvidence: "Handout registration is covered by a role-specific operation handler.", remainingGap: "Cross-role asset lifecycle, undo/redo, and recovery evidence remain partial." },
  "project.asset.register-audio": { evidenceStatus: "aggregate-partial", boundedEvidence: "WAV audio registration is covered by a role-specific operation handler.", remainingGap: "Cross-role asset lifecycle, undo/redo, and recovery evidence remain partial." },
  "project.asset.register-token": { evidenceStatus: "aggregate-partial", boundedEvidence: "PNG/WebP token registration is covered by a role-specific operation handler.", remainingGap: "Cross-role asset lifecycle, undo/redo, and recovery evidence remain partial." },
  "project.asset.bind": { evidenceStatus: "aggregate-partial", boundedEvidence: "Selected-Scene background binding is covered by a role-specific operation handler.", remainingGap: "Cross-producer binding history and recovery evidence remain partial." },
  "project.broken-reference.detach": { evidenceStatus: "aggregate-partial", boundedEvidence: "Broken Scene-reference detach has current packaged lifecycle and reread evidence.", remainingGap: "Aggregate detach history and cross-producer recovery evidence remain partial." },
  "project.asset.restore": { evidenceStatus: "aggregate-partial", boundedEvidence: "Missing-asset restore has current packaged lifecycle and authoritative reread evidence.", remainingGap: "Aggregate restore history and cross-producer recovery evidence remain partial." },
  "project.asset.detach": { evidenceStatus: "aggregate-partial", boundedEvidence: "Missing-asset detach has current packaged lifecycle and authoritative reread evidence.", remainingGap: "Aggregate detach history and cross-producer recovery evidence remain partial." },
};

export const TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE: readonly TypedLocalProjectOperationLifecycleEvidence[] =
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map((commandKind) => {
    const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[commandKind];
    const detail = TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_DETAILS[commandKind];
    return {
      commandKind,
      reviewAuthority: contract.reviewAuthority,
      targetAuthority: contract.targetAuthority,
      applyAuthority: contract.applyAuthority,
      applyHandler: contract.applyHandler,
      evidenceStatus: detail.evidenceStatus,
      boundedEvidence: detail.boundedEvidence,
      remainingGap: detail.remainingGap,
      nonCertifying: true,
      readOnly: true,
      noExecutionAuthority: true,
      noGenericExecutor: contract.noGenericExecutor,
    };
  });

export const TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY = [
  "previewed",
  "approved",
  "rejected",
  "cancelled",
  "stale",
  "applying",
  "unknown-outcome",
  "committed",
  "recovered",
  "undone",
  "redone",
] as const satisfies readonly ProposalBatchHistory["status"][];

export type TypedLocalProjectOperationProposalHistoryBinding = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  applyHandler: string;
  proposalHistoryStates: typeof TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY;
  boundedHistoryStates: readonly ["previewed", "approved"];
  historyCoverage: "review-and-approval-only";
  remainingHistoryGap: string;
  nonCertifying: true;
  readOnly: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING: readonly TypedLocalProjectOperationProposalHistoryBinding[] =
  TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.map((operation) => ({
    commandKind: operation.commandKind,
    applyHandler: operation.applyHandler,
    proposalHistoryStates: TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY,
    boundedHistoryStates: ["previewed", "approved"],
    historyCoverage: "review-and-approval-only",
    remainingHistoryGap: "Applying, unknown-outcome, committed, recovered, undone, redone, stale, rejected, and cancelled outcomes still require operation-specific lifecycle and authoritative reread evidence.",
    nonCertifying: true,
    readOnly: true,
    noExecutionAuthority: true,
    noGenericExecutor: operation.noGenericExecutor,
  }));

export const TYPED_OBSERVED_PROPOSAL_HISTORY_STATES = ["previewed", "approved"] as const;

export type TypedLocalProjectOperationHistoryLifecycleCoverage = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  applyHandler: string;
  historyStates: typeof TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY;
  observedHistoryStates: typeof TYPED_OBSERVED_PROPOSAL_HISTORY_STATES;
  unobservedHistoryStates: readonly ProposalBatchHistory["status"][];
  coverage: "preview-and-approval-only";
  remainingLifecycleGap: string;
  nonCertifying: true;
  readOnly: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE: readonly TypedLocalProjectOperationHistoryLifecycleCoverage[] =
  TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.map((operation) => ({
    commandKind: operation.commandKind,
    applyHandler: operation.applyHandler,
    historyStates: operation.proposalHistoryStates,
    observedHistoryStates: TYPED_OBSERVED_PROPOSAL_HISTORY_STATES,
    unobservedHistoryStates: operation.proposalHistoryStates.filter(
      (state) => state !== "previewed" && state !== "approved",
    ),
    coverage: "preview-and-approval-only",
    remainingLifecycleGap:
      "Unobserved rejected, cancelled, stale, applying, unknown-outcome, committed, recovered, undone, and redone states require operation-specific lifecycle and authoritative reread evidence.",
    nonCertifying: true,
    readOnly: true,
    noExecutionAuthority: true,
    noGenericExecutor: true,
  }));

export type TypedLocalProjectProposalHistoryTransitionProjection = Readonly<{
  historyState: ProposalBatchHistory["status"];
  allowedTransitions: readonly string[];
  source: "core-allowed-transitions";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
}>;

export const TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION: readonly TypedLocalProjectProposalHistoryTransitionProjection[] =
  TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY.map((historyState) => ({
    historyState,
    allowedTransitions: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[historyState],
    source: "core-allowed-transitions",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
  }));

export type TypedLocalProjectOperationHistoryTransitionCoverage = Readonly<{
  commandKind: TypedLocalProjectReviewApplyCommandKind;
  applyHandler: string;
  transitionProjection: typeof TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION;
  source: "operation-handler-and-core-allowed-transitions";
  readOnly: true;
  nonCertifying: true;
  noExecutionAuthority: true;
  noGenericExecutor: true;
}>;

export const TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE: readonly TypedLocalProjectOperationHistoryTransitionCoverage[] =
  TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.map((operation) => ({
    commandKind: operation.commandKind,
    applyHandler: operation.applyHandler,
    transitionProjection: TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION,
    source: "operation-handler-and-core-allowed-transitions",
    readOnly: true,
    nonCertifying: true,
    noExecutionAuthority: true,
    noGenericExecutor: true,
  }));

const commandKindSet = new Set<string>(Object.keys(TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS));

export type TypedLocalProjectReviewApplyCoverage = Readonly<{
  status: "PASS" | "BLOCKED";
  commandKind: TypedLocalProjectReviewApplyCommandKind | null;
  commandCount: number;
  exactTarget: boolean;
  reviewerApprovalDispatchReady: boolean;
  operationSpecificApplyReady: boolean;
  applyHandler: string | null;
  reason: string | null;
  noNewExecutorAuthority: true;
}>;

export function inspectTypedLocalProjectReviewApplyCoverage(
  session: DesktopProjectProposalSession,
): TypedLocalProjectReviewApplyCoverage {
  const command = session.batch.commands[0];
  const exactTarget = session.projectId === session.batch.base.targetId;
  const common = {
    commandCount: session.batch.commands.length,
    exactTarget,
    reviewerApprovalDispatchReady: session.history.status === "previewed",
    operationSpecificApplyReady: session.history.status === "approved",
    applyHandler: null,
    noNewExecutorAuthority: true as const,
  };
  if (session.batch.targetAuthority.domain !== "local-project" || session.batch.targetAuthority.requiredActiveGm) {
    return { status: "BLOCKED", commandKind: null, reason: "Only exact local-project authority is covered.", ...common };
  }
  if (!exactTarget) return { status: "BLOCKED", commandKind: null, reason: "Project session and batch target do not match.", ...common };
  if (session.batch.commands.length !== 1 || !command) return { status: "BLOCKED", commandKind: null, reason: "Exactly one existing operation-specific command is required.", ...common };
  if (!commandKindSet.has(command.kind)) return { status: "BLOCKED", commandKind: null, reason: "Command kind is outside the typed local-project allowlist.", ...common };
  const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[command.kind as TypedLocalProjectReviewApplyCommandKind];
  if (!operation || operation.reviewAuthority !== "human-review" || operation.targetAuthority !== "local-project" || operation.applyAuthority !== "operation-specific" || operation.noGenericExecutor !== true) {
    return { status: "BLOCKED", commandKind: null, reason: "Operation-specific review contract is missing or authority-collapsed.", ...common };
  }
  return { ...common, status: "PASS", commandKind: command.kind as TypedLocalProjectReviewApplyCommandKind, applyHandler: operation.applyHandler, reason: null };
}
