import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-token-asset-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m997-stage11-project-token-asset-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M999 token asset redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M999",
      sourceMilestone: "M997",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m997-stage11-project-token-asset-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.register-token",
      operation: "project.asset.register-token.redo",
      handler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory",
      rereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      tokenAssetIdentityPreserved: true,
      contentAddressedTokenRegistrationPreserved: true,
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
    expect(() => createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, redoClassifier: "foreign-classifier" },
    })).toThrow(/M997\.implementation\.redoClassifier/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, handlerClassifierAggregateAttachments: 6 },
    })).toThrow(/M997\.aggregateBoundary\.handlerClassifierAggregateAttachments/);

    expect(projectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11ProjectTokenAssetRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
