import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-rename-redo-handler-classifier-aggregate-evidence.js";

const sourceReceiptPath = "../outputs/m975-stage11-project-rename-redo-handler-classifier-evidence-closure-receipt.json";

function sourceReceipt(): any {
  return JSON.parse(readFileSync(new URL(sourceReceiptPath, import.meta.url), "utf8"));
}

describe("M977 Stage 11 project.rename redo aggregate evidence", () => {
  it("attaches the exact M975 binding without authority or count promotion", () => {
    const result = createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence(sourceReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M977",
      sourceMilestone: "M975",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m975-stage11-project-rename-redo-handler-classifier-evidence-closure-receipt.json",
      producer: "project.rename",
      operation: "project.rename.redo",
      handler: "bridgeProjectRenameRedoToTerminalHistory",
      rereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
      metadataOnlyRenameRequired: true,
      projectContentPreserved: true,
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
    expect(projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for altered source, metadata, authority, count, and shape evidence", () => {
    const alteredSource = sourceReceipt();
    alteredSource.implementation.redoHandler = "foreignHandler";
    expect(() => createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence(alteredSource)).toThrow(/redoHandler/i);

    const alteredMetadata = sourceReceipt();
    alteredMetadata.implementation.metadataOnlyRename = false;
    expect(() => createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence(alteredMetadata)).toThrow(/metadataOnlyRename/i);

    const result = createProjectStage11ProjectRenameRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(() => projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, aggregateAuthority: "granted" })).toThrow(/aggregateAuthority/i);
    expect(() => projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, operationCount: 15 })).toThrow(/operationCount/i);
    expect(() => projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, projectContentPreserved: false })).toThrow(/projectContentPreserved/i);
    expect(() => projectStage11ProjectRenameRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, extra: true })).toThrow(/unknown or missing fields/i);
  });
});
