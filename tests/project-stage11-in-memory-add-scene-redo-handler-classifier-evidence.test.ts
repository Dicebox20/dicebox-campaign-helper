import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createInMemoryAddSceneRedoHandlerClassifierEvidence,
  inMemoryAddSceneRedoHandlerClassifierEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-redo-handler-classifier-evidence";

const sourceBundle = () => ({
  bridgeReceipt: JSON.parse(readFileSync(new URL("../outputs/m766-stage11-project-add-scene-in-memory-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
  semanticAggregateReceipt: JSON.parse(readFileSync(new URL("../outputs/m931-stage11-in-memory-add-scene-semantic-redo-aggregate-attachment-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>,
});

describe("M1006 in-memory add-Scene redo handler/classifier evidence", () => {
  it("binds one exact producer-scoped non-certifying in-memory redo projection", () => {
    const result = createInMemoryAddSceneRedoHandlerClassifierEvidence(sourceBundle());
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.add-scene.commit-in-memory",
      operation: "dicebox.project.add-scene.commit-in-memory.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory",
      matchedRereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      orderedSceneSetPreserved: true,
      addedSceneAppended: true,
      activeSceneSelected: true,
      assetPreservation: true,
      nonPersistencePreserved: true,
      sceneSetIdentityChanged: true,
      byteHashRotation: "not-claimed",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m766BridgeEvidence: "preserved-out-of-scope",
      m931SemanticAggregateEvidence: "preserved-out-of-scope",
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
      source: "project-add-scene-in-memory-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-in-memory-add-scene-handler-classifier-binding",
      remainingGap: "Complete in-memory add-Scene proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
  });

  it("fails closed for bridge, semantic, authority, and shape drift", () => {
    const bundle = sourceBundle();
    const implementation = bundle.bridgeReceipt.implementation as Record<string, unknown>;
    expect(() => createInMemoryAddSceneRedoHandlerClassifierEvidence({
      ...bundle,
      bridgeReceipt: { ...bundle.bridgeReceipt, implementation: { ...implementation, source: "foreign-source.ts" } },
    })).toThrow(/M766\.implementation\.source/);

    const evidence = bundle.semanticAggregateReceipt.evidence as Record<string, unknown>;
    expect(() => createInMemoryAddSceneRedoHandlerClassifierEvidence({
      ...bundle,
      semanticAggregateReceipt: { ...bundle.semanticAggregateReceipt, evidence: { ...evidence, semantic: "committed-one-way" } },
    })).toThrow(/M931\.evidence\.semantic/);

    const boundary = bundle.semanticAggregateReceipt.boundary as Record<string, unknown>;
    expect(() => createInMemoryAddSceneRedoHandlerClassifierEvidence({
      ...bundle,
      semanticAggregateReceipt: { ...bundle.semanticAggregateReceipt, boundary: { ...boundary, aggregateAuthority: "granted" } },
    })).toThrow(/M931\.boundary\.aggregateAuthority/);

    const result = createInMemoryAddSceneRedoHandlerClassifierEvidence(bundle);
    expect(inMemoryAddSceneRedoHandlerClassifierEvidenceSchema.safeParse([]).success).toBe(false);
    expect(inMemoryAddSceneRedoHandlerClassifierEvidenceSchema.safeParse([{ ...result[0], byteHashRotation: "strict" }]).success).toBe(false);
  });
});
