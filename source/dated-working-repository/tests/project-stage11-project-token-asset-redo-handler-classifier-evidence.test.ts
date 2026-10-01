import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectTokenAssetRedoHandlerClassifierEvidence,
  projectTokenAssetRedoHandlerClassifierEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-token-asset-redo-handler-classifier-evidence";

const sourceBundle = () => ({
  bridgeReceipt: JSON.parse(readFileSync(new URL("../outputs/m764-stage11-project-token-asset-register-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  semanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  aggregateSemanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m920-stage11-token-asset-semantic-redo-aggregate-attachment-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
});

describe("M997 token asset redo handler/classifier evidence", () => {
  it("binds one exact producer-scoped non-certifying token redo projection", () => {
    const result = createProjectTokenAssetRedoHandlerClassifierEvidence(sourceBundle());
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.asset.register-token",
      operation: "dicebox.project.asset.register-token.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectTokenAssetRegistrationRedoToTerminalHistory",
      matchedRereadClassifier: "projectTokenAssetRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      exactTargetRequired: true,
      generationAndHashRequired: true,
      tokenAssetIdentityPreserved: true,
      contentAddressedTokenRegistrationPreserved: true,
      assetTreePreserved: true,
      scenePreserved: true,
      generationAdvanced: true,
      contentHashChanged: true,
      envelopeRotated: true,
      byteHashAndEnvelopeEvidence: "source-receipt-only",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m764BridgeEvidence: "preserved-out-of-scope",
      m900SemanticEvidence: "preserved-out-of-scope",
      m920AggregateSemanticEvidence: "preserved-out-of-scope",
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
      source: "project-token-asset-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-project-token-asset-handler-classifier-binding",
      remainingGap: "Complete token-asset proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
  });

  it("fails closed for source provenance, semantic, authority, and shape drift", () => {
    const bundle = sourceBundle();
    const implementation = bundle.bridgeReceipt.implementation as Record<string, unknown>;
    expect(() => createProjectTokenAssetRedoHandlerClassifierEvidence({
      ...bundle,
      bridgeReceipt: { ...bundle.bridgeReceipt, implementation: { ...implementation, source: "foreign-source.ts" } },
    })).toThrow(/M764\.implementation\.source/);

    const composition = bundle.semanticReceipt.composition as Record<string, unknown>;
    expect(() => createProjectTokenAssetRedoHandlerClassifierEvidence({
      ...bundle,
      semanticReceipt: { ...bundle.semanticReceipt, composition: { ...composition, operation: "foreign.operation.redo" } },
    })).toThrow(/M900\.composition\.operation/);

    const boundary = bundle.aggregateSemanticReceipt.boundary as Record<string, unknown>;
    expect(() => createProjectTokenAssetRedoHandlerClassifierEvidence({
      ...bundle,
      aggregateSemanticReceipt: { ...bundle.aggregateSemanticReceipt, boundary: { ...boundary, aggregateAuthority: "granted" } },
    })).toThrow(/M920\.boundary\.aggregateAuthority/);

    const evidence = createProjectTokenAssetRedoHandlerClassifierEvidence(bundle);
    expect(projectTokenAssetRedoHandlerClassifierEvidenceSchema.safeParse([]).success).toBe(false);
    expect(projectTokenAssetRedoHandlerClassifierEvidenceSchema.safeParse([{
      ...evidence[0],
      redoHandler: "foreign-handler",
    }]).success).toBe(false);
  });
});
