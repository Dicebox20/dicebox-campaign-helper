import { describe, expect, it } from "vitest";
import {
  createProjectStage11SemanticRedoEvidence,
  projectStage11SemanticRedoEvidenceSchema,
} from "../apps/campaign-helper-desktop/src/project-stage11-semantic-redo-evidence.js";

const valid = () => createProjectStage11SemanticRedoEvidence({
  schemaVersion: "0.1.0",
  milestone: "M890",
  evidenceLabel: "local",
  receipt: "outputs/m890-stage11-operation-specific-semantic-redo-composition-closure-receipt.json",
  status: "bounded-local",
  operationSemantics: [
    { operation: "project.save", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, envelopeRotated: true, semanticHashChangedInFixture: true, semanticHashValidation: "shape-only", driftRejected: "content-hash/redo-receipt identity drift" },
    { operation: "project.add-scene.persist", semantic: "redo-post-state", matchedReread: true, generationAdvanced: true, envelopeRotated: true, sceneAppended: true, activeSceneSelected: true, assetsPreserved: true, driftRejected: "Scene-set/readback identity drift" },
  ],
  saveSemanticHash: "shape-only",
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

describe("M892 aggregate semantic redo evidence", () => {
  it("creates and schema-validates the exact non-certifying M890 sidecar", () => {
    const result = valid();
    expect(result).toMatchObject({
      milestone: "M890",
      receipt: "outputs/m890-stage11-operation-specific-semantic-redo-composition-closure-receipt.json",
      saveSemanticHash: "shape-only",
      backupPromotionUndoRedo: "not-applicable-one-way",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
    expect(projectStage11SemanticRedoEvidenceSchema.parse(result)).toEqual(result);
  });

  it("rejects foreign, authority-promoting, and semantic overclaiming drift", () => {
    const base = valid();
    expect(() => projectStage11SemanticRedoEvidenceSchema.parse({ ...base, receipt: "outputs/foreign-receipt.json" })).toThrow(/receipt/i);
    expect(() => projectStage11SemanticRedoEvidenceSchema.parse({ ...base, saveSemanticHash: "strict" })).toThrow(/saveSemanticHash/i);
    expect(() => projectStage11SemanticRedoEvidenceSchema.parse({ ...base, noExecutionAuthority: false })).toThrow(/noExecutionAuthority/i);
    expect(() => projectStage11SemanticRedoEvidenceSchema.parse({ ...base, backupPromotionUndoRedo: "supported" })).toThrow(/backupPromotionUndoRedo/i);
    expect(() => projectStage11SemanticRedoEvidenceSchema.parse({ ...base, operationSemantics: [{ ...base.operationSemantics[0], operation: "project.foreign" }, base.operationSemantics[1]] })).toThrow(/operation|semantic/i);
  });
});
