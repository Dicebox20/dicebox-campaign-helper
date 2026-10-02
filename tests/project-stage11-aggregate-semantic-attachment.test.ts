import { describe, expect, it } from "vitest";
import {
  createProjectStage11ProposalSemanticEvidence,
  projectStage11ProposalSemanticEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-proposal-semantic-evidence.js";

const receipt = "outputs/m886-stage11-operation-specific-undo-redo-semantic-composition-closure-receipt.json";

describe("M888 aggregate semantic attachment", () => {
  it("creates the exact non-certifying M886 attachment", () => {
    const result = createProjectStage11ProposalSemanticEvidence();
    expect(result).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M886",
      evidenceLabel: "local",
      receipt,
      status: "bounded-local",
      operationSemantics: [
        { operation: "project.asset.bind.redo", semantic: "redo-post-state", matchedReread: true, semanticDriftRejected: true },
        { operation: "project.recovery.backup-promote", semantic: "committed-one-way", matchedReread: true, semanticDriftRejected: true },
      ],
      assetBindingRedoSemantic: true,
      backupPromotionCommittedOneWay: true,
      backupPromotionUndoRedo: "not-applicable-one-way",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noTransitionAuthority: true,
      noGenericExecutor: true,
      noFoundryWrite: true,
      noProjectMutation: true,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(projectStage11ProposalSemanticEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects altered identity, semantics, and authority claims", () => {
    const base = createProjectStage11ProposalSemanticEvidence();
    expect(() => projectStage11ProposalSemanticEvidenceSchema.parse({ ...base, receipt: "outputs/foreign-receipt.json" })).toThrow(/receipt/i);
    expect(() => projectStage11ProposalSemanticEvidenceSchema.parse({ ...base, operationSemantics: [{ ...base.operationSemantics[0], semantic: "committed-one-way" }, base.operationSemantics[1]] })).toThrow(/operationSemantics|semantic/i);
    expect(() => projectStage11ProposalSemanticEvidenceSchema.parse({ ...base, noExecutionAuthority: false })).toThrow(/noExecutionAuthority/i);
    expect(() => projectStage11ProposalSemanticEvidenceSchema.parse({ ...base, backupPromotionUndoRedo: "supported" })).toThrow(/backupPromotionUndoRedo/i);
  });
});
