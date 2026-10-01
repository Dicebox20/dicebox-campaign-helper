import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectPersistentAddSceneRedoHandlerClassifierEvidence,
  projectPersistentAddSceneRedoHandlerClassifierEvidenceSchema,
  TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE,
  TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY,
  TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS,
} from "../apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-redo-handler-classifier-evidence.js";
import {
  bridgeProjectPersistentAddSceneExecutionToTerminalHistory,
  bridgeProjectPersistentAddSceneRedoToTerminalHistory,
  projectPersistentAddSceneRedoTerminalHistoryReceiptSchema,
  projectPersistentAddSceneTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-add-scene-terminal-history.js";

const sourceReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m756-stage11-project-add-scene-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8"));
const semanticReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m912-stage11-persistent-add-scene-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8"));
const sourceBundle = () => ({ bridgeReceipt: sourceReceipt(), semanticReceipt: semanticReceipt() });

describe("M971 project.add-scene.persist redo handler/classifier evidence", () => {
  it("binds exactly one operation across undo and redo without invocation", () => {
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY).toMatchObject({
      schemaVersion: "0.1.0",
      commandKind: "project.add-scene.persist",
      operationKindCount: 1,
      sourceStatusCount: 2,
      evidenceCount: 2,
      sourceStatuses: ["committed", "undone"],
      undoHandler: "bridgeProjectPersistentAddSceneExecutionToTerminalHistory",
      undoRereadClassifier: "projectPersistentAddSceneTerminalHistoryReceiptSchema",
      redoHandler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory",
      redoRereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m756RedoBridge: "preserved-out-of-scope",
      m912SemanticEvidence: "preserved-out-of-scope",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      stage11Ready: false,
      stage12Started: false,
    });
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE).toHaveLength(2);
    expect(new Set(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => `${entry.commandKind}-${entry.sourceStatus}`)).size).toBe(2);
  });

  it("binds the existing bridges and exact matched Scene reread boundary", () => {
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS.undo.handler).toBe(bridgeProjectPersistentAddSceneExecutionToTerminalHistory);
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS.undo.rereadClassifier).toBe(projectPersistentAddSceneTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS.redo.handler).toBe(bridgeProjectPersistentAddSceneRedoToTerminalHistory);
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_BINDINGS.redo.rereadClassifier).toBe(projectPersistentAddSceneRedoTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE).toMatchObject([
      {
        commandKind: "project.add-scene.persist",
        sourceStatus: "committed",
        transition: "undo",
        destinationStatus: "undone",
        undoRedoHandler: "bridgeProjectPersistentAddSceneExecutionToTerminalHistory",
        matchedRereadClassifier: "projectPersistentAddSceneTerminalHistoryReceiptSchema",
        handlerBindingStatus: "bound-operation-specific",
      },
      {
        commandKind: "project.add-scene.persist",
        sourceStatus: "undone",
        transition: "redo",
        destinationStatus: "redone",
        undoRedoHandler: "bridgeProjectPersistentAddSceneRedoToTerminalHistory",
        matchedRereadClassifier: "projectPersistentAddSceneRedoTerminalHistoryReceiptSchema",
        handlerBindingStatus: "bound-operation-specific",
      },
    ]);
    for (const entry of TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE) {
      expect(entry.allowedTransitionsBefore.length).toBeGreaterThan(0);
      expect(entry.allowedTransitionsAfter.length).toBeGreaterThan(0);
      expect(entry).toMatchObject({
        reviewAuthority: "human-review",
        targetAuthority: "local-project",
        applyAuthority: "operation-specific",
        operationAuthority: "not-granted",
        rereadStatus: "matched",
        rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
        exactTargetRequired: true,
        generationAndHashRequired: true,
        orderedSceneSetRequired: true,
        transitionInvocation: "not-invoked",
        rereadInvocation: "not-invoked",
        noTransitionAuthority: true,
        executionAuthority: "none",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        m756RedoBridge: "preserved-out-of-scope",
        m912SemanticEvidence: "preserved-out-of-scope",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
        stage11Ready: false,
        stage12Started: false,
      });
      expect(entry.remainingGap.length).toBeGreaterThan(0);
    }
  });

  it("validates the exact source bundle and rejects source, authority, or shape drift", () => {
    expect(createProjectPersistentAddSceneRedoHandlerClassifierEvidence(sourceBundle())).toEqual(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE);
    expect(projectPersistentAddSceneRedoHandlerClassifierEvidenceSchema.parse(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE)).toEqual(TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE);

    const alteredBridge = sourceBundle();
    alteredBridge.bridgeReceipt.implementation.bridge = "foreign bridge";
    expect(() => createProjectPersistentAddSceneRedoHandlerClassifierEvidence(alteredBridge)).toThrow(/bridge identity/i);

    const alteredSemantic = sourceBundle();
    alteredSemantic.semanticReceipt.evidence.operation = "foreign.operation";
    expect(() => createProjectPersistentAddSceneRedoHandlerClassifierEvidence(alteredSemantic)).toThrow(/operation/i);

    const result = createProjectPersistentAddSceneRedoHandlerClassifierEvidence(sourceBundle());
    expect(() => projectPersistentAddSceneRedoHandlerClassifierEvidenceSchema.parse(result.map((entry) => ({ ...entry, operationAuthority: "granted" })))).toThrow(/operationAuthority/i);
    expect(() => projectPersistentAddSceneRedoHandlerClassifierEvidenceSchema.parse(result.slice(0, 1))).toThrow(/exactly two/i);
  });

  it("exposes the binding as read-only UI evidence without invoking the source bridge", () => {
    const evidenceSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/project-stage11-persistent-add-scene-redo-handler-classifier-evidence.ts", import.meta.url), "utf8");
    const appSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/App.tsx", import.meta.url), "utf8");
    expect(evidenceSource).toContain("bridgeProjectPersistentAddSceneRedoToTerminalHistory");
    expect(evidenceSource).toContain("projectPersistentAddSceneRedoTerminalHistoryReceiptSchema");
    expect(evidenceSource).not.toContain("bridgeProjectPersistentAddSceneRedoToTerminalHistory(");
    expect(evidenceSource).not.toContain("projectPersistentAddSceneRedoTerminalHistoryReceiptSchema.parse(");
    expect(evidenceSource).not.toContain("undoProposalBatch");
    expect(evidenceSource).not.toContain("redoProposalBatch");
    expect(evidenceSource).not.toContain("localStorage");
    expect(appSource).toContain("TYPED_PROJECT_PERSISTENT_ADD_SCENE_REDO_HANDLER_CLASSIFIER_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying project.add-scene.persist handler/classifier binding");
    expect(appSource).toContain('data-testid="project-persistent-add-scene-redo-handler-classifier-evidence"');
    expect(appSource).toContain("does not invoke project.add-scene.persist undo, redo");
  });
});
