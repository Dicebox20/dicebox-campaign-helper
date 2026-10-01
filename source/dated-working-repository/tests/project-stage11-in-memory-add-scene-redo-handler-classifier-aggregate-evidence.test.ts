import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence,
  projectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M1008 in-memory add-Scene redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M1008",
      sourceMilestone: "M1006",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m1006-stage11-in-memory-add-scene-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.add-scene.commit-in-memory",
      operation: "project.add-scene.commit-in-memory.redo",
      handler: "bridgeProjectAddSceneInMemoryRedoToTerminalHistory",
      rereadClassifier: "projectAddSceneInMemoryRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      orderedSceneSetPreserved: true,
      addedSceneAppended: true,
      activeSceneSelected: true,
      assetPreservation: true,
      nonPersistencePreserved: true,
      sceneSetIdentityChanged: true,
      byteHashRotation: "not-claimed",
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
    expect(() => createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, handler: "foreign-handler" },
    })).toThrow(/M1006\.implementation\.handler/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, handlerClassifierAggregateAttachmentsAfter: 8 },
    })).toThrow(/M1006\.aggregateBoundary\.handlerClassifierAggregateAttachmentsAfter/);

    expect(projectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11InMemoryAddSceneRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
