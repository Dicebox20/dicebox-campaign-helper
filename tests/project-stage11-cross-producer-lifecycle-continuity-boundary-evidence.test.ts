import { describe, expect, it } from "vitest";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS } from "../apps/campaign-helper-desktop/src/project-review-apply-coverage";
import {
  createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence,
  projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-cross-producer-lifecycle-continuity-boundary-evidence";

const continuityReceipt = () => ({
  schemaVersion: "0.1.0",
  status: "PASS",
  disposition: "modeled-cross-producer-partial",
  operationCount: 14,
  terminalHistoryIndexCount: 14,
  reviewTerminalEvidenceCount: 42,
  applyingUnknownEvidenceCount: 42,
  recoveryResultEvidenceCount: 56,
  undoRedoEvidenceCount: 28,
  operations: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map((commandKind) => ({
    commandKind,
    reviewTerminalStates: ["rejected", "cancelled", "stale"],
    applyingUnknownCheckpoints: ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"],
    recoveryRereadStatuses: ["matched", "not-committed", "conflict", "unknown"],
    undoRedoSourceStatuses: ["committed", "undone"],
    terminalHistoryIndexed: true,
  })),
  directFoundryObservation: {
    observedLifecycleCount: 1,
    producerScopedOnly: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noRecoveryAuthority: true,
    noFoundryAuthority: true,
    noProjectMutation: true,
    foreignStatePreserved: true,
    authoritativeReread: true,
    noRetry: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
    observations: [{ producer: "foundry.program-scene.inverse", milestone: "M802", lifecycle: "preview-confirm-apply-authoritative-reread" }],
  },
  directFoundryForwardObservation: {
    observedLifecycleCount: 1,
    producerScopedOnly: true,
    readOnly: true,
    nonCertifying: true,
    noAuthorityGrant: true,
    noExecutionAuthority: true,
    noRecoveryAuthority: true,
    noFoundryAuthority: true,
    noProjectMutation: true,
    foreignStatePreserved: true,
    authoritativeReread: true,
    noRetry: true,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    readyClaim: false,
    observations: [{ producer: "foundry.program-scene.forward", milestone: "M830", lifecycle: "preview-approved-create-unknown-authoritative-recovery-reread" }],
  },
  modeledOnly: true,
  readOnly: true,
  nonCertifying: true,
  noExecutionAuthority: true,
  noTransitionAuthority: true,
  noRecoveryAuthority: true,
  noGenericExecutor: true,
  noFoundryWrite: true,
  noProjectMutation: true,
  readyClaim: false,
  stage11AcceptanceStatus: "blocked",
  stage12Started: false,
});

const stage11Context = () => ({
  handlerClassifierAggregateAttachments: 10,
  semanticAggregateAttachments: 9,
  currentAuthorityRedoEntries: 9,
  stage11MatrixRedoBindings: 8,
  aggregateDirectStrands: 9,
  currentAuthority: "PARTIAL",
  aggregateAuthority: "NOT_GRANTED",
});

describe("M1012 cross-producer lifecycle continuity boundary evidence", () => {
  it("binds modeled lifecycle coverage and scoped observations without claiming continuity", () => {
    const result = createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({ continuityReceipt: continuityReceipt(), stage11Context: stage11Context() });
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M1012",
      evidenceLabel: "local",
      sourceReceiptKind: "ProjectCrossProducerLifecycleContinuityEvidenceReceipt",
      disposition: "modeled-cross-producer-partial",
      operationCount: 14,
      terminalHistoryIndexCount: 14,
      reviewTerminalEvidenceCount: 42,
      applyingUnknownEvidenceCount: 42,
      recoveryResultEvidenceCount: 56,
      undoRedoEvidenceCount: 28,
      handlerClassifierAggregateAttachments: 10,
      semanticAggregateAttachments: 9,
      currentAuthorityRedoEntries: 9,
      stage11MatrixRedoBindings: 8,
      aggregateDirectStrandCount: 9,
      currentAuthority: "PARTIAL",
      aggregateAuthority: "NOT_GRANTED",
      directObservationKinds: ["program-scene.inverse", "program-scene.forward"],
      modeledOnly: true,
      crossProducerContinuity: "unproven",
      committedRecoveredContinuity: "not-proven",
      linkageStatus: "bound-strict-typed-non-certifying",
      countScopeStatus: "preserved-explicit-8-9-9",
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noRecoveryAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
  });

  it("fails closed for lifecycle count, observation, context, or continuity drift", () => {
    const receipt = continuityReceipt();
    const boundary = createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({ continuityReceipt: receipt, stage11Context: stage11Context() });
    expect(projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema.safeParse(boundary).success).toBe(true);
    expect(() => createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({
      continuityReceipt: { ...receipt, operationCount: 13 },
      stage11Context: stage11Context(),
    })).toThrow(/operationCount/);

    expect(() => createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({
      continuityReceipt: { ...receipt, directFoundryObservation: { ...receipt.directFoundryObservation, authoritativeReread: false } },
      stage11Context: stage11Context(),
    })).toThrow(/authoritativeReread/);

    expect(() => createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({
      continuityReceipt: receipt,
      stage11Context: { ...stage11Context(), aggregateAuthority: "granted" },
    })).toThrow(/aggregateAuthority/);

    expect(projectStage11CrossProducerLifecycleContinuityBoundaryEvidenceSchema.safeParse({
      ...createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({ continuityReceipt: receipt, stage11Context: stage11Context() }),
      crossProducerContinuity: "proven",
    }).success).toBe(false);
  });
});
