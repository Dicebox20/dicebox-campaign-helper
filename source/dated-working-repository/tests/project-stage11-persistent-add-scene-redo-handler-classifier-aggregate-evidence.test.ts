import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence,
  projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-redo-handler-classifier-aggregate-evidence.js";

const sourceReceiptPath = "../outputs/m971-stage11-persistent-add-scene-redo-handler-classifier-evidence-closure-receipt.json";

function sourceReceipt(): any {
  return JSON.parse(readFileSync(new URL(sourceReceiptPath, import.meta.url), "utf8"));
}

describe("M973 Stage 11 project.add-scene.persist redo aggregate evidence", () => {
  it("attaches the exact M971 binding without authority or count promotion", () => {
    const result = createProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence(sourceReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M973",
      sourceMilestone: "M971",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m971-stage11-persistent-add-scene-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.add-scene.persist",
      operation: "project.add-scene.persist.redo",
      handler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory",
      rereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      orderedSceneSetRequired: true,
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
    expect(projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for altered source, authority, count, and shape evidence", () => {
    const alteredSource = sourceReceipt();
    alteredSource.implementation.redoHandler = "foreignHandler";
    expect(() => createProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence(alteredSource)).toThrow(/redoHandler/i);

    const result = createProjectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(() => projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, aggregateAuthority: "granted" })).toThrow(/aggregateAuthority/i);
    expect(() => projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, operationCount: 15 })).toThrow(/operationCount/i);
    expect(() => projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, orderedSceneSetRequired: false })).toThrow(/orderedSceneSetRequired/i);
    expect(() => projectStage11PersistentAddSceneRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, extra: true })).toThrow(/unknown or missing fields/i);
  });
});
