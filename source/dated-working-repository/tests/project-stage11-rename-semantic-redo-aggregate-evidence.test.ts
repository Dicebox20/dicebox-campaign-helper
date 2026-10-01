import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11RenameSemanticRedoAggregateEvidence,
  projectStage11RenameSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-rename-semantic-redo-aggregate-evidence.js";

const receiptPath = "../outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json";

function closureReceipt(): any {
  return JSON.parse(readFileSync(new URL(receiptPath, import.meta.url), "utf8"));
}

describe("M927 Stage 11 rename semantic-redo aggregate evidence", () => {
  it("attaches the exact M902 receipt as non-certifying producer-scoped evidence", () => {
    const result = createProjectStage11RenameSemanticRedoAggregateEvidence(closureReceipt());

    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M927",
      sourceMilestone: "M902",
      evidenceLabel: "local",
      receipt: "outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json",
      operation: "project.rename.redo",
      semantic: "redo-post-state",
      matchedReread: true,
      generationAdvanced: true,
      displayNameChanged: true,
      contentPreserved: true,
      metadataEnvelopePreserved: true,
      byteHashRotation: "not-claimed",
      driftRejected: "display-name/content/metadata-envelope/readback identity drift",
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
    expect(projectStage11RenameSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for wrong source identity, incomplete safety, or drifted semantic proof", () => {
    const wrongMilestone = closureReceipt();
    wrongMilestone.milestone = "M903";
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(wrongMilestone)).toThrow(/milestone/i);

    const incompleteSafety = closureReceipt();
    delete incompleteSafety.safety.noTransitionAuthority;
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(incompleteSafety)).toThrow(/safety/i);

    const semanticDrift = closureReceipt();
    semanticDrift.composition.displayNameChanged = false;
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(semanticDrift)).toThrow(/displayNameChanged/i);
  });

  it("fails closed for byte-hash overclaim, authority promotion, count change, or aggregate drift", () => {
    const byteHashOverclaim = closureReceipt();
    byteHashOverclaim.composition.byteHashRotation = "CLAIMED";
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(byteHashOverclaim)).toThrow(/byteHashRotation/i);

    const authorityPromotion = closureReceipt();
    authorityPromotion.safety.noExecutionAuthority = false;
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(authorityPromotion)).toThrow(/noExecutionAuthority/i);

    const aggregateCountChange = closureReceipt();
    aggregateCountChange.limits.aggregateCountsChanged = true;
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(aggregateCountChange)).toThrow(/aggregateCountsChanged/i);

    const aggregateDrift = closureReceipt();
    aggregateDrift.limits.aggregateSemanticAttachment = true;
    expect(() => createProjectStage11RenameSemanticRedoAggregateEvidence(aggregateDrift)).toThrow(/aggregateSemanticAttachment/i);
  });
});
