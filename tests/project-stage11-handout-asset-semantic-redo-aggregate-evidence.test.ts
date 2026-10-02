import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11HandoutAssetSemanticRedoAggregateEvidence,
  projectStage11HandoutAssetSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-handout-asset-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m898-stage11-handout-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M918 handout-asset semantic-redo aggregate attachment", () => {
  it("accepts only the exact M898 producer-scoped closure receipt", () => {
    const result = createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({ schemaVersion: "0.1.0", milestone: "M918", sourceMilestone: "M898", evidenceLabel: "local", receipt: receiptPath, operation: "project.asset.register-handout.redo", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, contentHashChanged: true, assetTreePreserved: true, contentAddressedHandoutRegistrationPreserved: true, scenePreserved: true, envelopeRotated: true, producerScopedOnly: true, aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(projectStage11HandoutAssetSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence({ ...receipt(), milestone: "foreign" })).toThrow(/milestone/i);
    const altered = receipt();
    altered.composition = { ...(altered.composition as Record<string, unknown>), contentAddressedHandoutRegistrationPreserved: false };
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(altered)).toThrow(/contentAddressedHandoutRegistrationPreserved/i);
    const incomplete = receipt();
    delete incomplete.safety;
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects semantic, safety, and boundary drift", () => {
    const semanticDrift = receipt();
    semanticDrift.composition = { ...(semanticDrift.composition as Record<string, unknown>), driftRejected: "foreign" };
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/driftRejected/i);
    const safetyDrift = receipt();
    safetyDrift.safety = { ...(safetyDrift.safety as Record<string, unknown>), noExecutionAuthority: false };
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(safetyDrift)).toThrow(/noExecutionAuthority/i);
    const boundaryDrift = receipt();
    boundaryDrift.limits = { ...(boundaryDrift.limits as Record<string, unknown>), aggregateCountsChanged: true };
    expect(() => createProjectStage11HandoutAssetSemanticRedoAggregateEvidence(boundaryDrift)).toThrow(/aggregateCountsChanged/i);
  });
});
