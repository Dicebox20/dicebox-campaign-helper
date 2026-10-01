import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectSaveAsRedoHandlerClassifierEvidence,
  projectSaveAsRedoHandlerClassifierEvidenceSchema,
  TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_BINDING,
  TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE,
  TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-save-as-redo-handler-classifier-evidence.js";
import {
  bridgeProjectSaveAsRedoToTerminalHistory,
  projectSaveAsTerminalHistoryReceiptSchema as projectSaveAsRedoTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-save-as-terminal-history.js";

const bridgeReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m782-stage11-project-save-as-redo-terminal-history-closure-receipt.json", import.meta.url), "utf8"));
const semanticReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m910-stage11-project-save-as-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8"));
const sourceBundle = () => ({ bridgeReceipt: bridgeReceipt(), semanticReceipt: semanticReceipt() });

describe("M979 project.save-as redo handler/classifier evidence", () => {
  it("binds the exact redo operation without invocation", () => {
    expect(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY).toMatchObject({
      schemaVersion: "0.1.0",
      commandKind: "project.save-as",
      operationKindCount: 1,
      evidenceCount: 1,
      sourceStatus: "undone",
      redoHandler: "bridgeProjectSaveAsRedoToTerminalHistory",
      redoRereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
      rereadRequirement: "matched-post-transition-exact-source-and-target-with-generation-and-hash",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m782RedoBridge: "preserved-out-of-scope",
      m910SemanticEvidence: "preserved-out-of-scope",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      stage11Ready: false,
      stage12Started: false,
    });
    expect(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE).toHaveLength(1);
  });

  it("binds the existing redo bridge and exact source/target reread boundary", () => {
    expect(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_BINDING.handler).toBe(bridgeProjectSaveAsRedoToTerminalHistory);
    expect(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_BINDING.rereadClassifier).toBe(projectSaveAsRedoTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE[0]).toMatchObject({
      commandKind: "project.save-as",
      operation: "dicebox.project.save-as",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      redoHandler: "bridgeProjectSaveAsRedoToTerminalHistory",
      matchedRereadClassifier: "projectSaveAsRedoTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
      rereadStatus: "matched",
      exactSourceAndTargetRequired: true,
      generationAndHashRequired: true,
      targetAbsentBeforeRedoRequired: true,
      targetPresentAfterRedoRequired: true,
      sourcePreserved: true,
      contentPreserved: true,
      sceneCollectionPreserved: true,
      assetCollectionPreserved: true,
      targetCreationIntegrityPreserved: true,
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      foreignStateMutation: "none",
      liveBehavior: "unproven",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      stage11Ready: false,
      stage12Started: false,
    });
  });

  it("validates the exact source bundle and rejects source, semantic, authority, or shape drift", () => {
    expect(createProjectSaveAsRedoHandlerClassifierEvidence(sourceBundle())).toEqual(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE);
    expect(projectSaveAsRedoHandlerClassifierEvidenceSchema.parse(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE)).toEqual(TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE);

    const alteredBridge = sourceBundle();
    alteredBridge.bridgeReceipt.result = "foreign bridge";
    expect(() => createProjectSaveAsRedoHandlerClassifierEvidence(alteredBridge)).toThrow(/bridge provenance/i);

    const alteredSemantic = sourceBundle();
    alteredSemantic.semanticReceipt.evidence.operation = "foreign.operation";
    expect(() => createProjectSaveAsRedoHandlerClassifierEvidence(alteredSemantic)).toThrow(/operation/i);

    const alteredTarget = sourceBundle();
    alteredTarget.semanticReceipt.evidence.targetPresentAfterRedo = false;
    expect(() => createProjectSaveAsRedoHandlerClassifierEvidence(alteredTarget)).toThrow(/targetPresentAfterRedo/i);

    const result = createProjectSaveAsRedoHandlerClassifierEvidence(sourceBundle());
    expect(() => projectSaveAsRedoHandlerClassifierEvidenceSchema.parse(result.map((entry) => ({ ...entry, operationAuthority: "granted" })))).toThrow(/operationAuthority/i);
    expect(() => projectSaveAsRedoHandlerClassifierEvidenceSchema.parse([])).toThrow(/exactly one/i);
  });

  it("exposes the binding as read-only UI evidence without invoking the source bridge", () => {
    const evidenceSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/project-stage11-project-save-as-redo-handler-classifier-evidence.ts", import.meta.url), "utf8");
    const appSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/App.tsx", import.meta.url), "utf8");
    expect(evidenceSource).toContain("bridgeProjectSaveAsRedoToTerminalHistory");
    expect(evidenceSource).toContain("projectSaveAsRedoTerminalHistoryReceiptSchema");
    expect(evidenceSource).not.toContain("bridgeProjectSaveAsRedoToTerminalHistory(");
    expect(evidenceSource).not.toContain("projectSaveAsRedoTerminalHistoryReceiptSchema.parse(");
    expect(evidenceSource).not.toContain("localStorage");
    expect(appSource).toContain("TYPED_PROJECT_SAVE_AS_REDO_HANDLER_CLASSIFIER_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying project.save-as handler/classifier binding");
    expect(appSource).toContain('data-testid="project-save-as-redo-handler-classifier-evidence"');
    expect(appSource).toContain("does not invoke project.save-as redo");
  });
});
