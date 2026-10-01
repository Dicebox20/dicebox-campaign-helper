import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11CreateSemanticRedoAggregateEvidence,
  projectStage11CreateSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-create-semantic-redo-aggregate-evidence.js";

const receiptPath = "../outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json";

function closureReceipt(): any {
  return JSON.parse(readFileSync(new URL(receiptPath, import.meta.url), "utf8"));
}

describe("M929 Stage 11 create semantic-redo aggregate evidence", () => {
  it("attaches the exact M904 receipt as non-certifying producer-scoped evidence", () => {
    const result = createProjectStage11CreateSemanticRedoAggregateEvidence(closureReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M929",
      sourceMilestone: "M904",
      evidenceLabel: "local",
      receipt: "outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json",
      operation: "project.create.redo",
      semantic: "redo-post-state",
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      generationAdvanced: true,
      firstGenerationContentIdentityPreserved: true,
      matchedReread: true,
      scenesPreserved: true,
      assetCollectionPreserved: true,
      byteHashRotation: "not-claimed",
      driftRejected: "target/content/scenes/assets/reread identity drift",
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
    expect(projectStage11CreateSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for wrong source identity, target drift, or incomplete boundary evidence", () => {
    const wrongMilestone = closureReceipt();
    wrongMilestone.milestone = "M905";
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(wrongMilestone)).toThrow(/milestone/i);

    const targetDrift = closureReceipt();
    targetDrift.evidence.targetPresentAfterRedo = false;
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(targetDrift)).toThrow(/targetPresentAfterRedo/i);

    const incompleteBoundary = closureReceipt();
    delete incompleteBoundary.boundary.noGenericExecutor;
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(incompleteBoundary)).toThrow(/boundary/i);
  });

  it("fails closed for byte-hash overclaim, authority promotion, count change, or aggregate drift", () => {
    const byteHashOverclaim = closureReceipt();
    byteHashOverclaim.evidence.byteLevelEnvelopeRotation = "CLAIMED";
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(byteHashOverclaim)).toThrow(/byteLevelEnvelopeRotation/i);

    const authorityPromotion = closureReceipt();
    authorityPromotion.boundary.noExecutionAuthority = false;
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(authorityPromotion)).toThrow(/noExecutionAuthority/i);

    const aggregateCountChange = closureReceipt();
    aggregateCountChange.boundary.aggregateCountsChanged = true;
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(aggregateCountChange)).toThrow(/aggregateCountsChanged/i);

    const aggregateDrift = closureReceipt();
    aggregateDrift.boundary.aggregateSemanticAttachment = true;
    expect(() => createProjectStage11CreateSemanticRedoAggregateEvidence(aggregateDrift)).toThrow(/aggregateSemanticAttachment/i);
  });
});
