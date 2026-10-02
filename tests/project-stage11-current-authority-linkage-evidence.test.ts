import { describe, expect, it } from "vitest";
import { createProjectAggregateCurrentAuthorityEvidence } from "../apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence";
import {
  createProjectStage11CurrentAuthorityLinkageEvidence,
  projectStage11CurrentAuthorityLinkageEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-current-authority-linkage-evidence";

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

describe("M1010 current-authority linkage evidence", () => {
  it("binds aggregate and current-authority surfaces without promoting continuity or authority", () => {
    const result = createProjectStage11CurrentAuthorityLinkageEvidence({ aggregateLedger: aggregateLedger(), currentAuthority: createProjectAggregateCurrentAuthorityEvidence() });
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M1010",
      evidenceLabel: "local",
      aggregateLedgerSource: "apps/campaign-helper-desktop/src/project-stage11-aggregate-evidence-ledger.ts",
      currentAuthoritySource: "apps/campaign-helper-desktop/src/project-aggregate-current-authority-evidence.ts",
      aggregateLedgerStatus: "aggregate-stage11-partial",
      currentAuthorityStatus: "partial",
      aggregateAuthority: "not-granted",
      handlerClassifierAggregateAttachmentCount: 10,
      semanticAggregateAttachmentCount: 9,
      currentAuthorityRedoBindingCount: 9,
      currentAuthorityRedoBindingEntries: ["project.create", "project.save", "project.rename", "project.add-scene.persist", "project.asset.bind", "project.asset.register-audio", "project.asset.register-handout", "project.asset.register-token", "project.add-scene.commit-in-memory"],
      stage11MatrixRedoBindingCount: 8,
      aggregateDirectStrandCount: 9,
      modeledOperationCount: 14,
      directProjectionCount: 16,
      linkageStatus: "bound-strict-typed-non-certifying",
      countScopeStatus: "preserved-explicit-8-9-9",
      crossProducerContinuity: "unproven",
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

  it("fails closed for aggregate-field or current-authority drift", () => {
    const currentAuthority = createProjectAggregateCurrentAuthorityEvidence();
    const aggregate = aggregateLedger() as Record<string, unknown>;
    expect(() => createProjectStage11CurrentAuthorityLinkageEvidence({
      aggregateLedger: { ...aggregate, projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence: { ...(aggregate.projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence as object), aggregateAuthority: "granted" } },
      currentAuthority,
    })).toThrow(/aggregate ledger\.projectInMemoryAddSceneRedoHandlerClassifierAggregateEvidence\.aggregateAuthority/);

    expect(() => createProjectStage11CurrentAuthorityLinkageEvidence({
      aggregateLedger: aggregate,
      currentAuthority: { ...currentAuthority, redoBindingCount: 8 },
    })).toThrow(/current authority evidence is invalid/);

    expect(projectStage11CurrentAuthorityLinkageEvidenceSchema.safeParse({
      ...createProjectStage11CurrentAuthorityLinkageEvidence({ aggregateLedger: aggregateLedger(), currentAuthority }),
      crossProducerContinuity: "proven",
    }).success).toBe(false);
  });
});
