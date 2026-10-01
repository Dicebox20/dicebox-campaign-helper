import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-audio-asset-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M995 audio asset redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M995",
      sourceMilestone: "M993",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m993-stage11-project-audio-asset-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.asset.register-audio",
      operation: "project.asset.register-audio.redo",
      handler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory",
      rereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      audioAssetIdentityPreserved: true,
      approvedAudioRegistrationPreserved: true,
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
    expect(() => createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, redoClassifier: "foreign-classifier" },
    })).toThrow(/M993\.implementation\.redoClassifier/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, handlerClassifierAggregateAttachments: 5 },
    })).toThrow(/M993\.aggregateBoundary\.handlerClassifierAggregateAttachments/);

    expect(projectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11ProjectAudioAssetRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
