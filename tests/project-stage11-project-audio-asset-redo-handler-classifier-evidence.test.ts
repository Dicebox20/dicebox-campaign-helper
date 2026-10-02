import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectAudioAssetRedoHandlerClassifierEvidence,
  projectAudioAssetRedoHandlerClassifierEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-audio-asset-redo-handler-classifier-evidence";

const sourceBundle = () => ({
  bridgeReceipt: JSON.parse(readFileSync(new URL("../outputs/m760-stage11-project-audio-asset-register-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  semanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  aggregateSemanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m916-stage11-audio-asset-semantic-redo-aggregate-attachment-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
});

describe("M993 audio asset redo handler/classifier evidence", () => {
  it("binds one exact producer-scoped non-certifying audio redo projection", () => {
    const result = createProjectAudioAssetRedoHandlerClassifierEvidence(sourceBundle());
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.asset.register-audio",
      operation: "dicebox.project.asset.register-audio.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectAudioAssetRegistrationRedoToTerminalHistory",
      matchedRereadClassifier: "projectAudioAssetRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      exactTargetRequired: true,
      generationAndHashRequired: true,
      audioAssetIdentityPreserved: true,
      approvedAudioRegistrationPreserved: true,
      assetTreePreserved: true,
      scenePreserved: true,
      generationAdvanced: true,
      contentHashChanged: true,
      envelopeRotated: true,
      byteHashAndEnvelopeEvidence: "source-receipt-only",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m760BridgeEvidence: "preserved-out-of-scope",
      m896SemanticEvidence: "preserved-out-of-scope",
      m916AggregateSemanticEvidence: "preserved-out-of-scope",
      noTransitionAuthority: true,
      executionAuthority: "none",
      foreignStateMutation: "none",
      liveBehavior: "unproven",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      noProjectMutation: true,
      stage11Ready: false,
      stage12Started: false,
      readyClaim: false,
      source: "project-audio-asset-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-project-audio-asset-handler-classifier-binding",
      remainingGap: "Complete audio-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
  });

  it("fails closed for source provenance, handler, authority, and shape drift", () => {
    const bundle = sourceBundle();
    const implementation = bundle.bridgeReceipt.implementation as Record<string, unknown>;
    expect(() => createProjectAudioAssetRedoHandlerClassifierEvidence({
      ...bundle,
      bridgeReceipt: { ...bundle.bridgeReceipt, implementation: { ...implementation, source: "foreign-source.ts" } },
    })).toThrow(/M760\.implementation\.source/);

    const composition = bundle.semanticReceipt.composition as Record<string, unknown>;
    expect(() => createProjectAudioAssetRedoHandlerClassifierEvidence({
      ...bundle,
      semanticReceipt: { ...bundle.semanticReceipt, composition: { ...composition, operation: "foreign.operation.redo" } },
    })).toThrow(/M896\.composition\.operation/);

    const boundary = bundle.aggregateSemanticReceipt.boundary as Record<string, unknown>;
    expect(() => createProjectAudioAssetRedoHandlerClassifierEvidence({
      ...bundle,
      aggregateSemanticReceipt: { ...bundle.aggregateSemanticReceipt, boundary: { ...boundary, aggregateAuthority: "granted" } },
    })).toThrow(/M916\.boundary\.aggregateAuthority/);

    const evidence = createProjectAudioAssetRedoHandlerClassifierEvidence(bundle);
    expect(projectAudioAssetRedoHandlerClassifierEvidenceSchema.safeParse([...evidence, ...evidence]).success).toBe(false);
    expect(projectAudioAssetRedoHandlerClassifierEvidenceSchema.safeParse([{
      ...evidence[0],
      redoHandler: "foreign-handler",
    }]).success).toBe(false);
  });
});
