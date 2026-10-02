import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS } from "../apps/campaign-helper-desktop/src/project-review-apply-coverage";
import { createProjectAggregateCurrentAuthorityEvidence } from "../apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence";
import { createProjectStage11CurrentAuthorityLinkageEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-current-authority-linkage-evidence";
import { createProjectStage11FreshExactRuntimeEvidenceAttachment } from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-evidence-attachment";
import { createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment } from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-current-authority-linkage-attachment";
import { createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-cross-producer-lifecycle-continuity-boundary-evidence";
import {
  createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge,
  ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError,
  projectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-lifecycle-continuity-index-bridge";

const handlerFields = ["projectSaveRedoHandlerClassifierAggregateEvidence", "projectPersistentAddSceneRedoHandlerClassifierAggregateEvidence", "projectRenameRedoHandlerClassifierAggregateEvidence", "projectSaveAsRedoHandlerClassifierAggregateEvidence", "projectCreateRedoHandlerClassifierAggregateEvidence", "projectHandoutAssetRedoHandlerClassifierAggregateEvidence", "projectAudioAssetRedoHandlerClassifierAggregateEvidence", "projectTokenAssetRedoHandlerClassifierAggregateEvidence", "projectAssetBindRedoHandlerClassifierAggregateEvidence", "projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence"] as const;
const semanticFields = ["persistentAddSceneSemanticRedoEvidence", "audioAssetSemanticRedoEvidence", "handoutAssetSemanticRedoEvidence", "tokenAssetSemanticRedoEvidence", "assetBindSemanticRedoEvidence", "saveAsSemanticRedoEvidence", "renameSemanticRedoEvidence", "createSemanticRedoEvidence", "inMemoryAddSceneSemanticRedoEvidence"] as const;

const aggregateLedger = () => {
  const handlerEvidence = () => ({ aggregateAttachment: "one-producer-scoped-non-certifying", operationCount: 14, operationCountChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
  const semanticEvidence = () => ({ aggregateAttachment: "one-producer-scoped-non-certifying", countsChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
  return {
    schemaVersion: "0.1.0", status: "PASS", disposition: "aggregate-stage11-partial", currentAuthority: { authority: { aggregate: "not-granted" } }, lifecycleContinuity: { stage11AcceptanceStatus: "blocked" }, operationCount: 14,
    readOnly: true, nonCertifying: true, noPermissionAuthority: true, noExecutionAuthority: true, noTransitionAuthority: true, noRecoveryAuthority: true, noFoundryWrite: true, noProjectMutation: true, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false,
    ...Object.fromEntries(handlerFields.map((field) => [field, handlerEvidence()])),
    ...Object.fromEntries(semanticFields.map((field) => [field, semanticEvidence()])),
  };
};

const continuityReceipt = () => ({
  schemaVersion: "0.1.0", status: "PASS", disposition: "modeled-cross-producer-partial", operationCount: 14, terminalHistoryIndexCount: 14, reviewTerminalEvidenceCount: 42, applyingUnknownEvidenceCount: 42, recoveryResultEvidenceCount: 56, undoRedoEvidenceCount: 28,
  operations: TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map((commandKind) => ({ commandKind, reviewTerminalStates: ["rejected", "cancelled", "stale"], applyingUnknownCheckpoints: ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"], recoveryRereadStatuses: ["matched", "not-committed", "conflict", "unknown"], undoRedoSourceStatuses: ["committed", "undone"], terminalHistoryIndexed: true })),
  directFoundryObservation: { observedLifecycleCount: 1, producerScopedOnly: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noExecutionAuthority: true, noRecoveryAuthority: true, noFoundryAuthority: true, noProjectMutation: true, foreignStatePreserved: true, authoritativeReread: true, noRetry: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false, observations: [{ producer: "foundry.program-scene.inverse", milestone: "M802", lifecycle: "preview-confirm-apply-authoritative-reread" }] },
  directFoundryForwardObservation: { observedLifecycleCount: 1, producerScopedOnly: true, readOnly: true, nonCertifying: true, noAuthorityGrant: true, noExecutionAuthority: true, noRecoveryAuthority: true, noFoundryAuthority: true, noProjectMutation: true, foreignStatePreserved: true, authoritativeReread: true, noRetry: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false, observations: [{ producer: "foundry.program-scene.forward", milestone: "M830", lifecycle: "preview-approved-create-unknown-authoritative-recovery-reread" }] },
  modeledOnly: true, readOnly: true, nonCertifying: true, noExecutionAuthority: true, noTransitionAuthority: true, noRecoveryAuthority: true, noGenericExecutor: true, noFoundryWrite: true, noProjectMutation: true, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false,
});

const lifecycleBoundary = () => createProjectStage11CrossProducerLifecycleContinuityBoundaryEvidence({
  continuityReceipt: continuityReceipt(),
  stage11Context: { handlerClassifierAggregateAttachments: 10, semanticAggregateAttachments: 9, currentAuthorityRedoEntries: 9, stage11MatrixRedoBindings: 8, aggregateDirectStrands: 9, currentAuthority: "PARTIAL", aggregateAuthority: "NOT_GRANTED" },
});

const freshRuntimeLinkage = () => {
  const currentAuthorityLinkage = createProjectStage11CurrentAuthorityLinkageEvidence({ aggregateLedger: aggregateLedger(), currentAuthority: createProjectAggregateCurrentAuthorityEvidence() });
  const freshRuntimeAttachment = createProjectStage11FreshExactRuntimeEvidenceAttachment(JSON.parse(readFileSync(new URL("../outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", import.meta.url), "utf8")) as unknown);
  return createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment({ currentAuthorityLinkage, freshExactRuntimeAttachment: freshRuntimeAttachment });
};

const bridge = () => createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge({ freshRuntimeCurrentAuthorityLinkage: freshRuntimeLinkage(), lifecycleBoundary: lifecycleBoundary() });

describe("M1024 fresh exact-runtime lifecycle-continuity index bridge", () => {
  it("binds current-authority runtime provenance to the modeled lifecycle boundary without a continuity claim", () => {
    const result = bridge();
    expect(result).toMatchObject({
      schemaVersion: "0.1.0", milestone: "M1024", sourceMilestone: "M1022", lifecycleBoundaryMilestone: "M1012", bridgeStatus: "bound-strict-typed-non-certifying", freshRuntimeLinkageStatus: "bound-to-current-authority-index-non-certifying", lifecycleBoundaryStatus: "modeled-cross-producer-partial", currentAuthorityStatus: "partial", aggregateAuthority: "not-granted", modeledOnly: true, crossProducerContinuity: "unproven", committedRecoveredContinuity: "not-proven",
      modeledOperationCount: 14, terminalHistoryIndexCount: 14, reviewTerminalEvidenceCount: 42, applyingUnknownEvidenceCount: 42, recoveryResultEvidenceCount: 56, undoRedoEvidenceCount: 28, currentAuthorityRedoBindingCount: 9, stage11MatrixRedoBindingCount: 8, aggregateDirectStrandCount: 9, directProjectionCount: 16, countScopeStatus: "preserved-explicit-8-9-9",
      indexEntry: { runtimeMilestone: "M1018", aggregateMilestone: "M1020", currentAuthorityLinkageMilestone: "M1022", lifecycleBoundaryMilestone: "M1012", receiptSha256: "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C", lifecycleDisposition: "modeled-cross-producer-partial", modeledOnly: true, committedRecoveredContinuity: "not-proven", nonCertifying: true, noAuthorityGrant: true },
      readOnly: true, nonCertifying: true, noAuthorityGrant: true, noExecutionAuthority: true, noTransitionAuthority: true, noRecoveryAuthority: true, noGenericExecutor: true, noFoundryWrite: true, noProjectMutation: true, stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false,
    });
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.indexEntry)).toBe(true);
    expect(projectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeSchema.safeParse(result).success).toBe(true);
  });

  it("fails closed for source drift, continuity promotion, and count collapse", () => {
    const validLinkage = freshRuntimeLinkage();
    const validBoundary = lifecycleBoundary();
    expect(() => createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge({ freshRuntimeCurrentAuthorityLinkage: validLinkage, lifecycleBoundary: validBoundary, extra: true })).toThrow(ProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeValidationError);
    expect(() => createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge({ freshRuntimeCurrentAuthorityLinkage: { ...validLinkage, currentAuthorityRedoBindingCount: 8 }, lifecycleBoundary: validBoundary })).toThrow(/currentAuthorityRedoBindingCount/);
    expect(() => createProjectStage11FreshExactRuntimeLifecycleContinuityIndexBridge({ freshRuntimeCurrentAuthorityLinkage: validLinkage, lifecycleBoundary: { ...validBoundary, committedRecoveredContinuity: "proven" } })).toThrow(/committedRecoveredContinuity/);
    expect(projectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeSchema.safeParse({ ...bridge(), crossProducerContinuity: "proven" }).success).toBe(false);
    const parsed = projectStage11FreshExactRuntimeLifecycleContinuityIndexBridgeSchema.safeParse({ ...bridge(), lifecycleBoundaryStatus: "complete" });
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.retryAllowed).toBe(false);
  });
});
