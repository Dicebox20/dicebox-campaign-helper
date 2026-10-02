import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11AudioAssetSemanticRedoAggregateEvidence,
  projectStage11AudioAssetSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-audio-asset-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m896-stage11-audio-asset-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M916 audio-asset semantic-redo aggregate attachment", () => {
  it("accepts only the exact M896 producer-scoped closure receipt", () => {
    const result = createProjectStage11AudioAssetSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({ schemaVersion: "0.1.0", milestone: "M916", sourceMilestone: "M896", evidenceLabel: "local", receipt: receiptPath, operation: "project.asset.register-audio.redo", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, contentHashChanged: true, assetTreePreserved: true, approvedAudioRegistrationPreserved: true, scenePreserved: true, envelopeRotated: true, producerScopedOnly: true, aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(projectStage11AudioAssetSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence({ ...receipt(), milestone: "foreign" })).toThrow(/milestone/i);
    const altered = receipt();
    altered.composition = { ...(altered.composition as Record<string, unknown>), approvedAudioRegistrationPreserved: false };
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence(altered)).toThrow(/approvedAudioRegistrationPreserved/i);
    const incomplete = receipt();
    delete incomplete.safety;
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects semantic, safety, and boundary drift", () => {
    const semanticDrift = receipt();
    semanticDrift.composition = { ...(semanticDrift.composition as Record<string, unknown>), driftRejected: "foreign" };
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/driftRejected/i);
    const safetyDrift = receipt();
    safetyDrift.safety = { ...(safetyDrift.safety as Record<string, unknown>), noExecutionAuthority: false };
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence(safetyDrift)).toThrow(/noExecutionAuthority/i);
    const boundaryDrift = receipt();
    boundaryDrift.limits = { ...(boundaryDrift.limits as Record<string, unknown>), aggregateCountsChanged: true };
    expect(() => createProjectStage11AudioAssetSemanticRedoAggregateEvidence(boundaryDrift)).toThrow(/aggregateCountsChanged/i);
  });
});
