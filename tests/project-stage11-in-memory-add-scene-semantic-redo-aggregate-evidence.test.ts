import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence,
  projectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-in-memory-add-scene-semantic-redo-aggregate-evidence.js";

const receiptPath = "../outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json";

function closureReceipt(): any {
  return JSON.parse(readFileSync(new URL(receiptPath, import.meta.url), "utf8"));
}

describe("M931 Stage 11 in-memory add-Scene semantic-redo aggregate evidence", () => {
  it("attaches the exact M906 receipt as non-certifying producer-scoped evidence", () => {
    const result = createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(closureReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M931",
      sourceMilestone: "M906",
      evidenceLabel: "local",
      receipt: "outputs/m906-stage11-in-memory-add-scene-semantic-redo-composition-closure-receipt.json",
      operation: "project.add-scene.commit-in-memory.redo",
      semantic: "redo-post-state",
      exactProjectIdentity: true,
      matchedBeforeAndAfterRedoRereads: true,
      laterInMemoryRevision: true,
      orderedSceneSetPreserved: true,
      addedSceneAppended: true,
      activeSceneSelected: true,
      nonPersistencePreserved: true,
      assetPreservation: true,
      sceneSetIdentityChanged: true,
      byteHashRotation: "not-claimed",
      driftRejected: "persistence-write/Scene-set/active-Scene/matched-reread/authority drift",
      producerScopedOnly: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      readOnly: true,
      nonCertifying: true,
      noAuthorityGrant: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(projectStage11InMemoryAddSceneSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for wrong source identity, persistence drift, or incomplete boundary evidence", () => {
    const wrongMilestone = closureReceipt();
    wrongMilestone.milestone = "M907";
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(wrongMilestone)).toThrow(/milestone/i);

    const persistenceDrift = closureReceipt();
    persistenceDrift.evidence.nonPersistencePreserved = false;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(persistenceDrift)).toThrow(/nonPersistencePreserved/i);

    const incompleteBoundary = closureReceipt();
    delete incompleteBoundary.boundary.noGenericExecutor;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(incompleteBoundary)).toThrow(/boundary/i);
  });

  it("fails closed for byte-hash overclaim, authority promotion, count change, or aggregate drift", () => {
    const byteHashOverclaim = closureReceipt();
    byteHashOverclaim.evidence.byteLevelEnvelopeRotation = "CLAIMED";
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(byteHashOverclaim)).toThrow(/byteLevelEnvelopeRotation/i);

    const authorityPromotion = closureReceipt();
    authorityPromotion.boundary.noExecutionAuthority = false;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(authorityPromotion)).toThrow(/noExecutionAuthority/i);

    const aggregateCountChange = closureReceipt();
    aggregateCountChange.boundary.aggregateCountsChanged = true;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(aggregateCountChange)).toThrow(/aggregateCountsChanged/i);

    const aggregateDrift = closureReceipt();
    aggregateDrift.boundary.aggregateSemanticAttachment = true;
    expect(() => createProjectStage11InMemoryAddSceneSemanticRedoAggregateEvidence(aggregateDrift)).toThrow(/aggregateSemanticAttachment/i);
  });
});
