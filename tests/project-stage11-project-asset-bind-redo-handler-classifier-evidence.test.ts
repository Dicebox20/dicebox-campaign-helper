import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectAssetBindRedoHandlerClassifierEvidence,
  projectAssetBindRedoHandlerClassifierEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-asset-bind-redo-handler-classifier-evidence";

const sourceBundle = () => ({
  bridgeReceipt: JSON.parse(readFileSync(new URL("../outputs/m758-stage11-project-asset-bind-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  semanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  aggregateSemanticReceipt: JSON.parse(readFileSync(new URL("../outputs/m923-stage11-asset-bind-semantic-redo-aggregate-attachment-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
});

describe("M1001 project.asset.bind redo handler/classifier evidence", () => {
  it("binds one exact producer-scoped non-certifying asset-bind redo projection", () => {
    const result = createProjectAssetBindRedoHandlerClassifierEvidence(sourceBundle());
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.asset.bind",
      operation: "dicebox.project.asset.bind.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectAssetBindingRedoToTerminalHistory",
      matchedRereadClassifier: "projectAssetBindingRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      exactTargetRequired: true,
      generationAndHashRequired: true,
      assetDescriptorPreserved: true,
      contentAddressedAssetIdentityPreserved: true,
      bindingTransitionPreserved: true,
      assetTreePreserved: true,
      assetBytesNonPersistentOnRedo: true,
      generationAdvanced: true,
      assetCountPreserved: true,
      sceneCollectionPreserved: true,
      activeScenePreserved: true,
      semanticContentChanged: true,
      envelopeRotated: true,
      byteHashAndEnvelopeEvidence: "source-receipt-only",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m758BridgeEvidence: "preserved-out-of-scope",
      m908SemanticEvidence: "preserved-out-of-scope",
      m923AggregateSemanticEvidence: "preserved-out-of-scope",
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
      source: "project-asset-binding-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-project-asset-bind-handler-classifier-binding",
      remainingGap: "Complete asset-bind proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
  });

  it("fails closed for source provenance, binding semantics, authority, and shape drift", () => {
    const bundle = sourceBundle();
    const implementation = bundle.bridgeReceipt.implementation as Record<string, unknown>;
    expect(() => createProjectAssetBindRedoHandlerClassifierEvidence({
      ...bundle,
      bridgeReceipt: { ...bundle.bridgeReceipt, implementation: { ...implementation, source: "foreign-source.ts" } },
    })).toThrow(/M758\.implementation\.source/);

    const evidence = bundle.semanticReceipt.evidence as Record<string, unknown>;
    expect(() => createProjectAssetBindRedoHandlerClassifierEvidence({
      ...bundle,
      semanticReceipt: { ...bundle.semanticReceipt, evidence: { ...evidence, operation: "foreign.operation.redo" } },
    })).toThrow(/M908\.evidence\.operation/);

    const boundary = bundle.aggregateSemanticReceipt.boundary as Record<string, unknown>;
    expect(() => createProjectAssetBindRedoHandlerClassifierEvidence({
      ...bundle,
      aggregateSemanticReceipt: { ...bundle.aggregateSemanticReceipt, boundary: { ...boundary, aggregateAuthority: "granted" } },
    })).toThrow(/M923\.boundary\.aggregateAuthority/);

    const result = createProjectAssetBindRedoHandlerClassifierEvidence(bundle);
    expect(projectAssetBindRedoHandlerClassifierEvidenceSchema.safeParse([]).success).toBe(false);
    expect(projectAssetBindRedoHandlerClassifierEvidenceSchema.safeParse([{
      ...result[0],
      redoHandler: "foreign-handler",
    }]).success).toBe(false);
  });
});
