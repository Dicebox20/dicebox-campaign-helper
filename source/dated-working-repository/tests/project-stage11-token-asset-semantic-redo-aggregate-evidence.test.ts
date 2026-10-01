import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11TokenAssetSemanticRedoAggregateEvidence,
  projectStage11TokenAssetSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-token-asset-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m900-stage11-token-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M920 token-asset semantic-redo aggregate attachment", () => {
  it("accepts only the exact M900 producer-scoped closure receipt", () => {
    const result = createProjectStage11TokenAssetSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({ schemaVersion: "0.1.0", milestone: "M920", sourceMilestone: "M900", evidenceLabel: "local", receipt: receiptPath, operation: "project.asset.register-token.redo", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, contentHashChanged: true, assetTreePreserved: true, contentAddressedTokenRegistrationPreserved: true, scenePreserved: true, envelopeRotated: true, producerScopedOnly: true, aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(projectStage11TokenAssetSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence({ ...receipt(), milestone: "foreign" })).toThrow(/milestone/i);
    const altered = receipt();
    altered.composition = { ...(altered.composition as Record<string, unknown>), contentAddressedTokenRegistrationPreserved: false };
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence(altered)).toThrow(/contentAddressedTokenRegistrationPreserved/i);
    const incomplete = receipt();
    delete incomplete.safety;
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects semantic, safety, and boundary drift", () => {
    const semanticDrift = receipt();
    semanticDrift.composition = { ...(semanticDrift.composition as Record<string, unknown>), driftRejected: "foreign" };
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/driftRejected/i);
    const safetyDrift = receipt();
    safetyDrift.safety = { ...(safetyDrift.safety as Record<string, unknown>), noExecutionAuthority: false };
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence(safetyDrift)).toThrow(/noExecutionAuthority/i);
    const boundaryDrift = receipt();
    boundaryDrift.limits = { ...(boundaryDrift.limits as Record<string, unknown>), aggregateSemanticAttachment: true };
    expect(() => createProjectStage11TokenAssetSemanticRedoAggregateEvidence(boundaryDrift)).toThrow(/aggregateSemanticAttachment/i);
  });
});
