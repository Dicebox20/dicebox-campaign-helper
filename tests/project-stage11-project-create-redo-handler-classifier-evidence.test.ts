import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectCreateRedoHandlerClassifierEvidence,
  projectCreateRedoHandlerClassifierEvidenceSchema,
  TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-create-redo-handler-classifier-evidence.js";

const bridgeReceiptPath = "../outputs/m778-stage11-project-create-redo-terminal-history-bridge-closure-receipt.json";
const semanticReceiptPath = "../outputs/m904-stage11-project-create-semantic-redo-composition-closure-receipt.json";
const aggregateSemanticReceiptPath = "../outputs/m929-stage11-create-semantic-redo-aggregate-attachment-closure-receipt.json";

function sourceBundle(): any {
  return {
    bridgeReceipt: JSON.parse(readFileSync(new URL(bridgeReceiptPath, import.meta.url), "utf8")),
    semanticReceipt: JSON.parse(readFileSync(new URL(semanticReceiptPath, import.meta.url), "utf8")),
    aggregateSemanticReceipt: JSON.parse(readFileSync(new URL(aggregateSemanticReceiptPath, import.meta.url), "utf8")),
  };
}

describe("M984 Stage 11 project.create redo handler/classifier evidence", () => {
  it("binds the existing bridge and matched reread without authority or byte-hash promotion", () => {
    const result = createProjectCreateRedoHandlerClassifierEvidence(sourceBundle());

    expect(TYPED_PROJECT_CREATE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY).toMatchObject({ evidenceCount: 1, commandKind: "project.create", operation: "dicebox.project.create.redo" });
    expect(result).toEqual([{
      schemaVersion: "0.1.0",
      commandKind: "project.create",
      operation: "dicebox.project.create.redo",
      reviewAuthority: "human-review",
      targetAuthority: "local-project",
      applyAuthority: "operation-specific",
      operationAuthority: "not-granted",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectCreateRedoToTerminalHistory",
      matchedRereadClassifier: "projectCreateRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      exactTargetRequired: true,
      generationAndHashRequired: true,
      targetIdentityPreserved: true,
      targetAbsentBeforeRedo: true,
      targetPresentAfterRedo: true,
      generationAdvanced: true,
      firstGenerationContentIdentityPreserved: true,
      scenesPreserved: true,
      assetCollectionPreserved: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m778RedoBridge: "preserved-out-of-scope",
      m904SemanticEvidence: "preserved-out-of-scope",
      m929AggregateSemanticEvidence: "preserved-out-of-scope",
      byteHashRotation: "not-claimed",
      noTransitionAuthority: true,
      executionAuthority: "none",
      foreignStateMutation: "none",
      liveBehavior: "unproven",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      noProjectMutation: true,
      stage11Ready: false,
      stage12Started: false,
      readyClaim: false,
      source: "project-create-terminal-history-and-stage11-semantic-redo-contract",
      evidenceStatus: "bounded-project-create-handler-classifier-binding",
      remainingGap: "Complete project.create proposal, approval, history, recovery, runtime, and cross-producer authority remain unproven; this projection is not Stage 11 acceptance.",
    }]);
    expect(projectCreateRedoHandlerClassifierEvidenceSchema.parse(result)).toEqual(result);
  });

  it("fails closed for altered provenance, semantic boundaries, authority, and shape", () => {
    const alteredBridge = sourceBundle();
    alteredBridge.bridgeReceipt.sources.bridge = "foreign.ts";
    expect(() => createProjectCreateRedoHandlerClassifierEvidence(alteredBridge)).toThrow(/M778.sources.bridge/i);

    const alteredSemantic = sourceBundle();
    alteredSemantic.semanticReceipt.evidence.targetIdentity = "foreign target";
    expect(() => createProjectCreateRedoHandlerClassifierEvidence(alteredSemantic)).toThrow(/targetIdentity/i);

    const alteredAggregate = sourceBundle();
    alteredAggregate.aggregateSemanticReceipt.boundary.aggregateAuthority = "granted";
    expect(() => createProjectCreateRedoHandlerClassifierEvidence(alteredAggregate)).toThrow(/aggregateAuthority/i);

    const result = createProjectCreateRedoHandlerClassifierEvidence(sourceBundle());
    expect(() => projectCreateRedoHandlerClassifierEvidenceSchema.parse([{ ...result[0], operationAuthority: "granted" }])).toThrow(/operationAuthority/i);
    expect(() => projectCreateRedoHandlerClassifierEvidenceSchema.parse([{ ...result[0], byteHashRotation: "strict" }])).toThrow(/byteHashRotation/i);
    expect(() => projectCreateRedoHandlerClassifierEvidenceSchema.parse([{ ...result[0], extra: true }])).toThrow(/unknown or missing fields/i);
    expect(() => projectCreateRedoHandlerClassifierEvidenceSchema.parse([])).toThrow(/exactly one/i);
  });
});
