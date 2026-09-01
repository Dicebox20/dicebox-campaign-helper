import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import {
  TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE,
  TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY,
  TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS,
} from "../apps/campaign-helper-desktop/src/project-save-undo-redo-classifier-evidence.js";
import {
  bridgeProjectSaveExecutionToTerminalHistory,
  projectSaveTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-save-terminal-history.js";

const root = resolve(import.meta.dirname, "..");
const coreSource = readFileSync(resolve(root, "packages", "dicebox-core", "src", "proposal-batch.ts"), "utf8");
const evidenceSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-save-undo-redo-classifier-evidence.ts"), "utf8");
const terminalHistorySource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-save-terminal-history.ts"), "utf8");
const appSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M750 project.save undo/redo-handler and reread-classifier evidence", () => {
  it("projects exactly one operation across the two selected lifecycle edges", () => {
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE_SUMMARY).toMatchObject({
      schemaVersion: "0.1.0",
      commandKind: "project.save",
      operationKindCount: 1,
      sourceStatusCount: 2,
      evidenceCount: 2,
      sourceStatuses: ["committed", "undone"],
      undoHandler: "bridgeProjectSaveExecutionToTerminalHistory",
      undoRereadClassifier: "projectSaveTerminalHistoryReceiptSchema",
      redoHandler: "unprojected",
      redoRereadClassifier: "unproven",
      rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      m748UndoRedoProjection: "preserved-out-of-scope",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      stage11Ready: false,
      stage12Started: false,
    });
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE).toHaveLength(2);
    expect(new Set(TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.map((entry) => `${entry.commandKind}-${entry.sourceStatus}`)).size).toBe(2);
  });

  it("binds exact core edges and the matched post-transition reread contract", () => {
    const committed = TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.find((entry) => entry.sourceStatus === "committed");
    const undone = TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.find((entry) => entry.sourceStatus === "undone");
    expect(committed).toMatchObject({
      commandKind: "project.save",
      sourceStatus: "committed",
      transition: "undo",
      destinationStatus: "undone",
      allowedTransitionsBefore: ["undo"],
      allowedTransitionsAfter: ["redo"],
      undoRedoHandler: "bridgeProjectSaveExecutionToTerminalHistory",
      matchedRereadClassifier: "projectSaveTerminalHistoryReceiptSchema",
      handlerBindingStatus: "bound-operation-specific",
    });
    expect(undone).toMatchObject({
      commandKind: "project.save",
      sourceStatus: "undone",
      transition: "redo",
      destinationStatus: "redone",
      allowedTransitionsBefore: ["redo"],
      allowedTransitionsAfter: ["undo"],
      undoRedoHandler: "unprojected",
      matchedRereadClassifier: "unproven",
      handlerBindingStatus: "unprojected",
    });
    for (const entry of TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE) {
      const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[entry.sourceStatus];
      expect(entry.transition).toBe(transition.transition);
      expect(entry.destinationStatus).toBe(transition.destinationStatus);
      expect(entry.allowedTransitionsBefore).toEqual(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.sourceStatus]);
      expect(entry.allowedTransitionsAfter).toEqual(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.destinationStatus]);
      expect(entry).toMatchObject({
        reviewAuthority: "human-review",
        targetAuthority: "local-project",
        applyAuthority: "operation-specific",
        operationAuthority: "not-granted",
        rereadStatus: "matched",
        rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
        exactTargetRequired: true,
        revisionAndHashRequired: true,
        postTransitionClassification: "required",
        transitionInvocation: "not-invoked",
        rereadInvocation: "not-invoked",
        noTransitionAuthority: true,
        executionAuthority: "none",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        m748UndoRedoProjection: "preserved-out-of-scope",
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

  it("binds the claimed undo handler and reread classifier to the existing operation surface", () => {
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.undo.handler).toBe(bridgeProjectSaveExecutionToTerminalHistory);
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.undo.rereadClassifier).toBe(projectSaveTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.undo.status).toBe("bound-operation-specific");
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.redo.handler).toBeNull();
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.redo.rereadClassifier).toBeNull();
    expect(TYPED_PROJECT_SAVE_UNDO_REDO_HANDLER_BINDINGS.redo.status).toBe("unprojected");
  });

  it("binds existing project.save evidence without invoking handlers or rereads", () => {
    expect(coreSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS");
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS");
    expect(evidenceSource).toContain("project.save");
    expect(evidenceSource).toContain("bridgeProjectSaveExecutionToTerminalHistory");
    expect(evidenceSource).toContain("projectSaveTerminalHistoryReceiptSchema");
    expect(evidenceSource).toContain("m748UndoRedoProjection: \"preserved-out-of-scope\"");
    expect(evidenceSource).not.toContain("bridgeProjectSaveExecutionToTerminalHistory(");
    expect(evidenceSource).not.toContain("projectSaveTerminalHistoryReceiptSchema.parse(");
    expect(evidenceSource).not.toContain("undoProposalBatch(");
    expect(evidenceSource).not.toContain("redoProposalBatch(");
    expect(evidenceSource).not.toContain("executeGeneric");
    expect(evidenceSource).not.toContain("localStorage");
    expect(evidenceSource).not.toContain("sessionStorage");
    expect(terminalHistorySource).toContain("export function bridgeProjectSaveExecutionToTerminalHistory");
    expect(terminalHistorySource).toContain("export const projectSaveTerminalHistoryReceiptSchema");
    expect(appSource).toContain("TYPED_PROJECT_SAVE_UNDO_REDO_CLASSIFIER_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying project.save handler/classifier binding");
    expect(appSource).toContain('data-testid="project-save-undo-redo-classifier-evidence"');
    expect(appSource).toContain("does not invoke project.save undo, redo");
  });
});
