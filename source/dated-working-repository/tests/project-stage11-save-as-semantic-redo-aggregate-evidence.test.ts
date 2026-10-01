import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import {
  createProjectStage11SaveAsSemanticRedoAggregateEvidence,
  projectStage11SaveAsSemanticRedoAggregateEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-save-as-semantic-redo-aggregate-evidence.js";

const receiptPath = "outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json";
const receipt = () => JSON.parse(readFileSync(new URL("../outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8")) as Record<string, unknown>;

describe("M925 save-as semantic-redo aggregate attachment", () => {
  it("accepts only the exact M910 producer-scoped closure receipt", () => {
    const result = createProjectStage11SaveAsSemanticRedoAggregateEvidence(receipt());
    expect(result).toMatchObject({
      schemaVersion: "0.1.0",
      milestone: "M925",
      sourceMilestone: "M910",
      evidenceLabel: "local",
      receipt: receiptPath,
      operation: "project.save-as.redo",
      semantic: "redo-post-state",
      sourceAndTargetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      sourcePreserved: true,
      generationAdvanced: true,
      contentPreserved: true,
      sceneCollectionPreserved: true,
      assetCollectionPreserved: true,
      matchedReread: true,
      targetCreationIntegrityPreserved: true,
      producerScopedOnly: true,
      aggregateAttachment: "one-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(projectStage11SaveAsSemanticRedoAggregateEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, altered, or incomplete source receipts", () => {
    const foreign = receipt();
    foreign.milestone = "foreign";
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(foreign)).toThrow(/milestone/i);

    const altered = receipt();
    altered.evidence = { ...(altered.evidence as Record<string, unknown>), targetCreationIntegrityPreserved: false };
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(altered)).toThrow(/targetCreationIntegrityPreserved/i);

    const incomplete = receipt();
    delete incomplete.reconciliation;
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(incomplete)).toThrow(/closure receipt/i);
  });

  it("rejects source-target, boundary, count, and authority drift", () => {
    const sourceTargetDrift = receipt();
    sourceTargetDrift.evidence = { ...(sourceTargetDrift.evidence as Record<string, unknown>), sourceAndTargetIdentityPreserved: false };
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(sourceTargetDrift)).toThrow(/sourceAndTargetIdentityPreserved/i);

    const boundaryDrift = receipt();
    boundaryDrift.boundary = { ...(boundaryDrift.boundary as Record<string, unknown>), aggregateSemanticAttachment: true };
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(boundaryDrift)).toThrow(/aggregateSemanticAttachment/i);

    const countDrift = receipt();
    countDrift.reconciliation = { ...(countDrift.reconciliation as Record<string, unknown>), aggregateDirectStrands: 8 };
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(countDrift)).toThrow(/aggregateDirectStrands/i);

    const authorityDrift = receipt();
    authorityDrift.boundary = { ...(authorityDrift.boundary as Record<string, unknown>), noExecutionAuthority: false };
    expect(() => createProjectStage11SaveAsSemanticRedoAggregateEvidence(authorityDrift)).toThrow(/noExecutionAuthority/i);
  });
});
