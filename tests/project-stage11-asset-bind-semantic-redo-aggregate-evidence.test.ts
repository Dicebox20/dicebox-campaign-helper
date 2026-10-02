import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11AssetBindSemanticRedoAggregateEvidence,
  projectStage11AssetBindSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-asset-bind-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m908-stage11-project-asset-bind-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M923 asset-bind semantic-redo aggregate attachment", () => {
  it("accepts only the exact M908 producer-scoped closure receipt", () => {
    const result = createProjectStage11AssetBindSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M923",
      sourceMilestone: "M908",
      evidenceLabel: "local",
      receipt: receiptPath,
      operation: "project.asset.bind.redo",
      semantic: "redo-post-state",
      assetDescriptorPreserved: true,
      contentAddressedAssetIdentityPreserved: true,
      bindingTransitionPreserved: true,
      matchedReread: true,
      generationAdvanced: true,
      assetCountPreserved: true,
      sceneCollectionPreserved: true,
      activeScenePreserved: true,
      assetTreePreserved: true,
      assetBytesNonPersistentOnRedo: true,
      semanticContentChanged: true,
      envelopeRotated: true,
      producerScopedOnly: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(projectStage11AssetBindSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    const foreign = receipt();
    foreign.milestone = "foreign";
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(foreign)).toThrow(/milestone/i);

    const altered = receipt();
    altered.evidence = { ...(altered.evidence as Record<string, unknown>), bindingTransitionPreserved: false };
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(altered)).toThrow(/bindingTransitionPreserved/i);

    const incomplete = receipt();
    delete incomplete.boundary;
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects semantic, boundary, count, and authority drift", () => {
    const semanticDrift = receipt();
    semanticDrift.evidence = { ...(semanticDrift.evidence as Record<string, unknown>), driftRejected: ["foreign"] };
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/driftRejected/i);

    const boundaryDrift = receipt();
    boundaryDrift.boundary = { ...(boundaryDrift.boundary as Record<string, unknown>), aggregateSemanticAttachment: true };
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(boundaryDrift)).toThrow(/aggregateSemanticAttachment/i);

    const countDrift = receipt();
    countDrift.reconciliation = { ...(countDrift.reconciliation as Record<string, unknown>), stage11MatrixRedoBindings: 9 };
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(countDrift)).toThrow(/stage11MatrixRedoBindings/i);

    const authorityDrift = receipt();
    authorityDrift.boundary = { ...(authorityDrift.boundary as Record<string, unknown>), noExecutionAuthority: false };
    expect(() => createProjectStage11AssetBindSemanticRedoAggregateEvidence(authorityDrift)).toThrow(/noExecutionAuthority/i);
  });
});
