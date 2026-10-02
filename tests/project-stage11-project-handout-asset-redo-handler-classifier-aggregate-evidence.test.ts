import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-handout-asset-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m989-stage11-project-handout-asset-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M991 handout asset redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M991",
      sourceMilestone: "M989",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m989-stage11-project-handout-asset-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.register-handout",
      operation: "project.asset.register-handout.redo",
      handler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory",
      rereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      handoutAssetIdentityPreserved: true,
      contentAddressedRegistrationPreserved: true,
      assetTreePreserved: true,
      scenePreserved: true,
      generationAdvanced: true,
      contentHashChanged: true,
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
    expect(() => createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, redoClassifier: "foreign-classifier" },
    })).toThrow(/M989\.implementation\.redoClassifier/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, handlerClassifierAggregateAttachments: 4 },
    })).toThrow(/M989\.aggregateBoundary\.handlerClassifierAggregateAttachments/);

    expect(projectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11ProjectHandoutAssetRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
