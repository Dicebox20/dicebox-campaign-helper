import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createProjectAggregateCurrentAuthorityEvidence } from "../apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence";
import {
  createProjectStage11CurrentAuthorityLinkageEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-current-authority-linkage-evidence";
import {
  createProjectStage11FreshExactRuntimeEvidenceAttachment,
} from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-evidence-attachment";
import {
  createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment,
  ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError,
  projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-fresh-exact-runtime-current-authority-linkage-attachment";

const handlerFields = [
  "projectSaveRedoHandlerClassifierAggregateEvidence",
  "projectPersistentAddSceneRedoHandlerClassifierAggregateEvidence",
  "projectRenameRedoHandlerClassifierAggregateEvidence",
  "projectSaveAsRedoHandlerClassifierAggregateEvidence",
  "projectCreateRedoHandlerClassifierAggregateEvidence",
  "projectHandoutAssetRedoHandlerClassifierAggregateEvidence",
  "projectAudioAssetRedoHandlerClassifierAggregateEvidence",
  "projectTokenAssetRedoHandlerClassifierAggregateEvidence",
  "projectAssetBindRedoHandlerClassifierAggregateEvidence",
  "projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence",
] as const;

const semanticFields = [
  "persistentAddSceneSemanticRedoEvidence",
  "audioAssetSemanticRedoEvidence",
  "handoutAssetSemanticRedoEvidence",
  "tokenAssetSemanticRedoEvidence",
  "assetBindSemanticRedoEvidence",
  "saveAsSemanticRedoEvidence",
  "renameSemanticRedoEvidence",
  "createSemanticRedoEvidence",
  "inMemoryAddSceneSemanticRedoEvidence",
] as const;

const aggregateLedger = () => {
  const handlerEvidence = () => ({ aggregateAttachment: "one-producer-scoped-non-certifying", operationCount: 14, operationCountChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
  const semanticEvidence = () => ({ aggregateAttachment: "one-producer-scoped-non-certifying", countsChanged: false, aggregateAuthority: "not-granted", stage11AcceptanceStatus: "blocked", stage12Started: false, readyClaim: false });
  return {
    schemaVersion: "0.1.0",
    status: "PASS",
    disposition: "aggregate-stage11-partial",
    currentAuthority: { authority: { aggregate: "not-granted" } },
    lifecycleContinuity: { stage11AcceptanceStatus: "blocked" },
    operationCount: 14,
    readOnly: true,
    nonCertifying: true,
    noPermissionAuthority: true,
    noExecutionAuthority: true,
    noTransitionAuthority: true,
    noRecoveryAuthority: true,
    noFoundryWrite: true,
    noProjectMutation: true,
    readyClaim: false,
    stage11AcceptanceStatus: "blocked",
    stage12Started: false,
    ...Object.fromEntries(handlerFields.map((field) => [field, handlerEvidence()])),
    ...Object.fromEntries(semanticFields.map((field) => [field, semanticEvidence()])),
  };
};

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json", import.meta.url), "utf8")) as unknown;

const createAttachment = () => {
  const linkage = createProjectStage11CurrentAuthorityLinkageEvidence({ aggregateLedger: aggregateLedger(), currentAuthority: createProjectAggregateCurrentAuthorityEvidence() });
  const freshRuntime = createProjectStage11FreshExactRuntimeEvidenceAttachment(sourceReceipt());
  return createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment({ currentAuthorityLinkage: linkage, freshExactRuntimeAttachment: freshRuntime });
};

describe("M1022 fresh exact-runtime current-authority linkage attachment", () => {
  it("binds the M1020 attachment to the current-authority index without collapsing evidence scopes", () => {
    const result = createAttachment();
    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M1022",
      sourceMilestone: "M1020",
      currentAuthorityLinkageStatus: "bound-strict-typed-non-certifying",
      freshRuntimeAttachmentStatus: "bound-to-current-authority-index-non-certifying",
      currentAuthorityStatus: "partial",
      aggregateAuthority: "not-granted",
      currentAuthorityRedoBindingCount: 9,
      stage11MatrixRedoBindingCount: 8,
      aggregateDirectStrandCount: 9,
      modeledOperationCount: 14,
      directProjectionCount: 16,
      countScopeStatus: "preserved-explicit-8-9-9",
      crossProducerContinuity: "unproven",
      indexEntry: {
        sourceMilestone: "M1018",
        aggregateMilestone: "M1020",
        operation: "dicebox.foundry.fresh-exact-runtime-current-authority",
        receipt: "outputs/m1018-stage11-host-window-recovery-and-final-exact-runtime-reread-receipt.json",
        receiptSha256: "C64E7137308D211BAE4B7C0DD72E239C317C06EE26CE17690205934FA88B4D7C",
        viewport: "1920x863",
        currentUser: "Gamemaster [GM]",
        activeScene: "DiceBox Tram Routing Projection",
        nonCertifying: true,
        noAuthorityGrant: true,
      },
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
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.indexEntry)).toBe(true);
    expect(projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema.safeParse(result).success).toBe(true);
  });

  it("fails closed for source drift, count collapse, and unsupported authority claims", () => {
    const linkage = createProjectStage11CurrentAuthorityLinkageEvidence({ aggregateLedger: aggregateLedger(), currentAuthority: createProjectAggregateCurrentAuthorityEvidence() });
    const freshRuntime = createProjectStage11FreshExactRuntimeEvidenceAttachment(sourceReceipt());
    const bundle = { currentAuthorityLinkage: linkage, freshExactRuntimeAttachment: freshRuntime };

    expect(() => createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment({ ...bundle, extra: true })).toThrow(ProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentValidationError);
    expect(() => createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment({
      ...bundle,
      currentAuthorityLinkage: { ...linkage, stage11MatrixRedoBindingCount: 9 },
    })).toThrow(/stage11MatrixRedoBindingCount/);
    expect(() => createProjectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachment({
      ...bundle,
      freshExactRuntimeAttachment: { ...freshRuntime, aggregateAuthority: "granted" },
    })).toThrow(/aggregateAuthority/);
    expect(projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema.safeParse({ ...createAttachment(), crossProducerContinuity: "proven" }).success).toBe(false);
    const error = projectStage11FreshExactRuntimeCurrentAuthorityLinkageAttachmentSchema.safeParse({ ...createAttachment(), currentAuthorityStatus: "granted" });
    expect(error.success).toBe(false);
    if (!error.success) expect(error.error.retryAllowed).toBe(false);
  });
});
