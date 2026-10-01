import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence,
  projectStage11PersistentAddSceneSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M914 persistent add-Scene semantic-redo aggregate attachment", () => {
  it("accepts only the exact M912 producer-scoped closure receipt", () => {
    const result = createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({ schemaVersion: "0.1.0", milestone: "M914", sourceMilestone: "M912", evidenceLabel: "local", receipt: receiptPath, operation: "project.add-scene.persist.redo", semantic: "redo-post-state", sceneAppended: true, orderedSceneSetPreserved: true, activeSceneSelected: true, generationAdvanced: true, semanticContentChanged: true, assetCountPreserved: true, assetTreePreserved: true, byteEnvelopeRotated: true, matchedReread: true, producerScopedOnly: true, aggregateAttachment: "one-producer-scoped-non-certifying", aggregateAuthority: "not-granted", countsChanged: false, readyClaim: false, stage11AcceptanceStatus: "blocked", stage12Started: false });
    expect(projectStage11PersistentAddSceneSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence({ ...receipt(), milestone: "foreign" })).toThrow(/milestone/i);
    const altered = receipt();
    altered.evidence = { ...(altered.evidence as Record<string, unknown>), activeSceneSelected: false };
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(altered)).toThrow(/activeSceneSelected/i);
    const incomplete = receipt();
    delete incomplete.boundary;
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects count, authority, and semantic drift", () => {
    const countDrift = receipt();
    countDrift.reconciliation = { ...(countDrift.reconciliation as Record<string, unknown>), aggregateDirectStrands: 10 };
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(countDrift)).toThrow(/aggregateDirectStrands/i);
    const authorityDrift = receipt();
    authorityDrift.boundary = { ...(authorityDrift.boundary as Record<string, unknown>), noProjectMutation: false };
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(authorityDrift)).toThrow(/noProjectMutation/i);
    const semanticDrift = receipt();
    semanticDrift.evidence = { ...(semanticDrift.evidence as Record<string, unknown>), driftRejected: ["foreign"] };
    expect(() => createProjectStage11PersistentAddSceneSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/driftRejected/i);
  });
});
