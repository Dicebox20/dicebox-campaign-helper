import { describe, expect, it } from "vitest";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS } from "../apps/campaign-helper-desktop/src/project-review-apply-coverage";
import {
  createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-cross-producer-lifecycle-continuity-boundary-evidence";
import {
  createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence,
  projectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-direct-committed-recovered-cross-producer-continuity-boundary-evidence";

const m1012Boundary = () => createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({
  continuityReceipt: {
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
  }, stage11Context: {
    handlerClassifierAggregateAttachments: 10,
    semanticAggregateAttachments: 9,
    currentAuthorityRedoEntries: 9,
    stage11MatrixRedoBindings: 8,
    aggregateDirectStrands: 9,
    currentAuthority: "PARTIAL",
    aggregateAuthority: "NOT_GRANTED",
  },
});

describe("M1014 direct committed/recovered cross-producer continuity boundary evidence", () => {
  it("preserves exact M1012 provenance while recording continuity as not directly observed", () => {
    const result = createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence({ m1012Boundary: m1012Boundary() });
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M1014",
      evidenceLabel: "local",
      sourceReceiptKind: "ProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence",
      sourceBoundaryMilestone: "M1012",
      disposition: "direct-committed-recovered-continuity-not-proven",
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
      directCommittedRecoveredEvidence: "not-directly-observed",
      provenanceStatus: "exact-m1012-boundary",
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

  it("fails closed for provenance, lifecycle, authority, or continuity drift", () => {
    const boundary = m1012Boundary();
    expect(() => createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence({
      m1012Boundary: { ...boundary, operationCount: 13 },
    })).toThrow(/operationCount/);

    expect(() => createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence({
      m1012Boundary: { ...boundary, aggregateAuthority: "granted" },
    })).toThrow(/aggregateAuthority/);

    expect(() => createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence({
      m1012Boundary: { ...boundary, crossProducerContinuity: "proven" },
    })).toThrow(/crossProducerContinuity/);

    expect(projectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidenceSchema.safeParse({
      ...createProjectStage11DirectCommittedRecoveredCrossProducerContinuityBoundaryEvidence({ m1012Boundary: boundary }),
      committedRecoveredContinuity: "proven",
    }).success).toBe(false);
  });
});
