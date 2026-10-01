import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence,
  projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-save-redo-handler-classifier-aggregate-evidence.js";

const sourceReceiptPath = "../outputs/m966-stage11-project-save-redo-handler-classifier-evidence-bridge-closure-receipt.json";

function sourceReceipt(): any {
  return JSON.parse(readFileSync(new URL(sourceReceiptPath, import.meta.url), "utf8"));
}

describe("M968 Stage 11 project.save redo aggregate evidence", () => {
  it("attaches the exact M966 redo binding without promotion or count change", () => {
    const result = createProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence(sourceReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M968",
      sourceMilestone: "M966",
      evidenceLabel: "local",
      sourceReceipt: "outputs/m966-stage11-project-save-redo-handler-classifier-evidence-bridge-closure-receipt.json",
      producer: "project.save",
      operation: "project.save.redo",
      handler: "bridgeProjectSaveRedoToTerminalHistory",
      rereadClassifier: "projectSaveRedoTerminalHistoryReceiptSchema",
      bindingStatus: "bound-operation-specific",
      matchedRereadRequired: true,
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
    expect(projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema.parse(result)).toEqual(result);
    const closureReceipt = JSON.parse(readFileSync(new URL("../outputs/m968-stage11-project-save-redo-aggregate-ledger-attachment-closure-receipt.json", import.meta.url), "utf8")) as unknown;
    expect(projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema.parse(closureReceipt)).toEqual(result);
  });

  it("fails closed for altered binding, authority, and count evidence", () => {
    const source = sourceReceipt();
    source.implementation.redoHandler = "foreignHandler";
    expect(() => createProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence(source)).toThrow(/redoHandler/i);

    const result = createProjectStage11ProjectSaveRedoHandlerClassifierAggregateEvidence(sourceReceipt());
    expect(() => projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, aggregateAuthority: "granted" })).toThrow(/aggregateAuthority/i);
    expect(() => projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, operationCount: 15 })).toThrow(/operationCount/i);
    expect(() => projectStage11ProjectSaveRedoHandlerClassifierAggregateEvidenceSchema.parse({ ...result, noGenericExecutor: false })).toThrow(/noGenericExecutor/i);
  });
});
