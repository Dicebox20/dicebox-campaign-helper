import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-save-as-redo-handler-classifier-aggregate-evidence.js";

const sourceReceiptPath = "../outputs/m979-stage11-project-save-as-redo-handler-classifier-evidence-closure-receipt.json";

function sourceReceipt(): any {
  return JSON.parse(readFileSync(new URL(sourceReceiptPath, import.meta.url), "utf8"));
}

describe("M981 Stage 11 project.save-as redo aggregate evidence", () => {
  it("attaches the exact M979 binding without authority or count promotion", () => {
    const result = createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(sourceReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M981",
      sourceMilestone: "M979",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m979-stage11-project-save-as-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.save-as",
      operation: "project.save-as.redo",
      handler: "bridgeProjectSaveAsRedoToTerminalHistory",
      rereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
      canonicalClassifierSurface: "projectSaveAsTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      sourceAndTargetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      sourcePreserved: true,
      contentPreserved: true,
      sceneCollectionPreserved: true,
      assetCollectionPreserved: true,
      targetCreationIntegrityPreserved: true,
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
    expect(projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for altered source, target, authority, count, and shape evidence", () => {
    const alteredSource = sourceReceipt();
    alteredSource.implementation.redoHandler = "foreignHandler";
    expect(() => createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(alteredSource)).toThrow(/redoHandler/i);

    const alteredTarget = sourceReceipt();
    alteredTarget.implementation.targetCreationIntegrityPreserved = false;
    expect(() => createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(alteredTarget)).toThrow(/targetCreationIntegrityPreserved/i);

    const alteredClassifier = sourceReceipt();
    alteredClassifier.implementation.canonicalClassifierSurface = "foreignSchema";
    expect(() => createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(alteredClassifier)).toThrow(/canonicalClassifierSurface/i);

    const result = createProjectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(() => projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, aggregateAuthority: "granted" })).toThrow(/aggregateAuthority/i);
    expect(() => projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, operationCount: 15 })).toThrow(/operationCount/i);
    expect(() => projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, sourceAndTargetIdentityPreserved: false })).toThrow(/sourceAndTargetIdentityPreserved/i);
    expect(() => projectStage11ProjectSaveAsRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, extra: true })).toThrow(/unknown or missing fields/i);
  });
});
