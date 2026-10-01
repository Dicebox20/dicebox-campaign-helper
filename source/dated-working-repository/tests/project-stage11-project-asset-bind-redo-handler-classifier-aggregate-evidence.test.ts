import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-asset-bind-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M1003 asset-bind redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M1003",
      sourceMilestone: "M1001",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m1001-stage11-project-asset-bind-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.bind",
      operation: "project.asset.bind.redo",
      handler: "bridgeProjectAssetBindingRedoToTerminalHistory",
      rereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      assetDescriptorPreserved: true,
      contentAddressedAssetIdentityPreserved: true,
      bindingTransitionPreserved: true,
      assetTreePreserved: true,
      sceneCollectionPreserved: true,
      activeScenePreserved: true,
      generationAdvanced: true,
      assetCountPreserved: true,
      semanticContentChanged: true,
      envelopeRotated: true,
      byteHashAndEnvelopeEvidence: "source-receipt-only",
      sourceInvocation: false,
      rereadInvocation: false,
      operationCount: 14,
      operationCountChanged: false,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      currentAuthority: "partial",
      aggregateAuthority: "not-granted",
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noProjectMutation: true,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
      readyClaim: false,
    });
  });

  it("fails closed for source or aggregate-boundary drift", () => {
    const receipt = sourceReceipt();
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, handler: "foreign-handler" },
    })).toThrow(/M1001\.implementation\.handler/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, handlerClassifierAggregateAttachmentsAfter: 7 },
    })).toThrow(/M1001\.aggregateBoundary\.handlerClassifierAggregateAttachmentsAfter/);

    expect(projectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11ProjectAssetBindRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
