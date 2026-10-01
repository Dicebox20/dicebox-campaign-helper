import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectHandoutAssetRedoHandlerClassifierEvidence,
  projectHandoutAssetRedoHandlerClassifierEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-handout-asset-redo-handler-classifier-evidence";

const sourceBundle = () => ({
  bridgeReceipt: JSON.parse(readFileSync(new URL("../outputs/m725-stage11-project-handout-asset-terminal-history-bridge-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  semanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  aggregateSemanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m918-stage11-handout-asset-semantic-redo-aggregate-attachment-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
});

describe("M989 project.asset.register-handout redo handler/classifier evidence", () => {
  it("binds the existing handout redo handler and matched-reread classifier", () => {
    const result = createProjectHandoutAssetRedoHandlerClassifierEvidence(sourceBundle());
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.asset.register-handout",
      operation: "dicebox.project.asset.register-handout.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectHandoutAssetRegistrationRedoToTerminalHistory",
      matchedRereadClassifier: "projectHandoutAssetRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      exactTargetRequired: true,
      generationAndHashRequired: true,
      handoutAssetIdentityPreserved: true,
      contentAddressedRegistrationPreserved: true,
      assetTreePreserved: true,
      scenePreserved: true,
      generationAdvanced: true,
      contentHashChanged: true,
      envelopeRotated: true,
      byteHashAndEnvelopeEvidence: "source-receipt-only",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m725BridgeEvidence: "preserved-out-of-scope",
      m898SemanticEvidence: "preserved-out-of-scope",
      m918AggregateSemanticEvidence: "preserved-out-of-scope",
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
      source: "project-handout-asset-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-project-handout-asset-handler-classifier-binding",
      remainingGap: "Complete handout-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
  });

  it("fails closed for altered provenance, semantic, and authority boundaries", () => {
    const bundle = sourceBundle();
    const bridge = { ...bundle.bridgeReceipt, implementation: { ...(bundle.bridgeReceipt.implementation as Record<string, unknown>), acceptedOperation: "foreign.operation" } };
    expect(() => createProjectHandoutAssetRedoHandlerClassifierEvidence({ ...bundle, bridgeReceipt: bridge })).toThrow(/M725\.implementation\.acceptedOperation/);

    const composition = { ...(bundle.semanticReceipt.composition as Record<string, unknown>), contentHashChanged: false };
    expect(() => createProjectHandoutAssetRedoHandlerClassifierEvidence({ ...bundle, semanticReceipt: { ...bundle.semanticReceipt, composition } })).toThrow(/M898\.composition\.contentHashChanged/);

    const boundary = { ...(bundle.aggregateSemanticReceipt.boundary as Record<string, unknown>), aggregateAuthority: "granted" };
    expect(() => createProjectHandoutAssetRedoHandlerClassifierEvidence({ ...bundle, aggregateSemanticReceipt: { ...bundle.aggregateSemanticReceipt, boundary } })).toThrow(/M918\.boundary\.aggregateAuthority/);

    expect(projectHandoutAssetRedoHandlerClassifierEvidenceSchema.safeParse([]).success).toBe(false);
  });
});
