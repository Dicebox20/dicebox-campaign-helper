import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-create-redo-handler-classifier-aggregate-evidence";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M986 project.create redo handler/classifier aggregate evidence", () => {
  it("attaches one exact producer-scoped non-certifying aggregate field", () => {
    const result = createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M986",
      sourceMilestone: "M984",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m984-stage11-project-create-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.create",
      operation: "project.create.redo",
      handler: "bridgeProjectCreateRedoToTerminalHistory",
      rereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      targetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      generationAdvanced: true,
      firstGenerationContentIdentityPreserved: true,
      scenesPreserved: true,
      assetCollectionPreserved: true,
      sourceInvocation: false,
      rereadInvocation: false,
      byteHashRotation: "not-claimed",
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

  it("fails closed for source or boundary drift", () => {
    const receipt = sourceReceipt();
    const implementation = receipt.implementation as Record<string, unknown>;
    expect(() => createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      implementation: { ...implementation, redoHandler: "foreign-handler" },
    })).toThrow(/M984\.implementation\.redoHandler/);

    const boundary = receipt.aggregateBoundary as Record<string, unknown>;
    expect(() => createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence({
      ...receipt,
      aggregateBoundary: { ...boundary, operationCount: 15 },
    })).toThrow(/M984\.aggregateBoundary\.operationCount/);

    expect(projectStage11ProjectCreateRedoHandlerClassifierAggregateEvidenceSchema.safeParse({
      ...createProjectStage11ProjectCreateRedoHandlerClassifierAggregateEvidence(receipt),
      aggregateAuthority: "granted",
    }).success).toBe(false);
  });
});
