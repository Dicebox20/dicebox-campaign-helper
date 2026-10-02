import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectRenameRedoHandlerClassifierEvidence,
  projectRenameRedoHandlerClassifierEvidenceSchema,
  TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE,
  TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY,
  TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS,
} from "../apps/campaign-helper-desktop/src/project-stage11-project-rename-redo-handler-classifier-evidence.js";
import {
  bridgeProjectRenameExecutionToTerminalHistory,
  bridgeProjectRenameRedoToTerminalHistory,
  projectRenameRedoTerminalHistoryReceiptSchema,
  projectRenameTerminalHistoryReceiptSchema,
} from "../apps/campaign-helper-desktop/src/project-rename-terminal-history.js";

const bridgeReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m754-stage11-project-rename-redo-terminal-history-bridge-closure-receipt.json", import.meta.url), "utf8"));
const semanticReceipt = () => JSON.parse(readFileSync(new URL("../outputs/m902-stage11-project-rename-semantic-redo-composition-closure-receipt.json", import.meta.url), "utf8"));
const sourceBundle = () => ({ bridgeReceipt: bridgeReceipt(), semanticReceipt: semanticReceipt() });

describe("M975 project.rename redo handler/classifier evidence", () => {
  it("binds exactly one operation across undo and redo without invocation", () => {
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE_SUMMARY).toMatchObject({
      schemaVersion: "0.1.0",
      commandKind: "project.rename",
      operationKindCount: 1,
      sourceStatusCount: 2,
      evidenceCount: 2,
      sourceStatuses: ["committed", "undone"],
      undoHandler: "bridgeProjectRenameExecutionToTerminalHistory",
      undoRereadClassifier: "projectRenameTerminalHistoryReceiptSchema",
      redoHandler: "bridgeProjectRenameRedoToTerminalHistory",
      redoRereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
      rereadRequirement: "matched-post-transition-exact-target-with-generation-and-hash",
      transitionInvocation: "not-invoked",
      rereadInvocation: "not-invoked",
      m754RedoBridge: "preserved-out-of-scope",
      m902SemanticEvidence: "preserved-out-of-scope",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      stage11Ready: false,
      stage12Started: false,
    });
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE).toHaveLength(2);
    expect(new Set(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE.map((entry) => `${entry.commandKind}-${entry.sourceStatus}`)).size).toBe(2);
  });

  it("binds the existing bridges and exact metadata-only reread boundary", () => {
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS.undo.handler).toBe(bridgeProjectRenameExecutionToTerminalHistory);
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS.undo.rereadClassifier).toBe(projectRenameTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS.redo.handler).toBe(bridgeProjectRenameRedoToTerminalHistory);
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_BINDINGS.redo.rereadClassifier).toBe(projectRenameRedoTerminalHistoryReceiptSchema);
    expect(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE).toMatchObject([
      {
        commandKind: "project.rename",
        sourceStatus: "committed",
        transition: "undo",
        destinationStatus: "undone",
        undoRedoHandler: "bridgeProjectRenameExecutionToTerminalHistory",
        matchedRereadClassifier: "projectRenameTerminalHistoryReceiptSchema",
        handlerBindingStatus: "bound-operation-specific",
      },
      {
        commandKind: "project.rename",
        sourceStatus: "undone",
        transition: "redo",
        destinationStatus: "redone",
        undoRedoHandler: "bridgeProjectRenameRedoToTerminalHistory",
        matchedRereadClassifier: "projectRenameRedoTerminalHistoryReceiptSchema",
        handlerBindingStatus: "bound-operation-specific",
      },
    ]);
    for (const entry of TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE) {
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
        metadataOnlyRenameRequired: true,
        projectContentPreserved: true,
        transitionInvocation: "not-invoked",
        rereadInvocation: "not-invoked",
        noTransitionAuthority: true,
        executionAuthority: "none",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        m754RedoBridge: "preserved-out-of-scope",
        m902SemanticEvidence: "preserved-out-of-scope",
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

  it("validates the exact source bundle and rejects source, semantic, authority, or shape drift", () => {
    expect(createProjectRenameRedoHandlerClassifierEvidence(sourceBundle())).toEqual(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE);
    expect(projectRenameRedoHandlerClassifierEvidenceSchema.parse(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE)).toEqual(TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE);

    const alteredBridge = sourceBundle();
    alteredBridge.bridgeReceipt.implementation.bridge = "foreign bridge";
    expect(() => createProjectRenameRedoHandlerClassifierEvidence(alteredBridge)).toThrow(/bridge identity/i);

    const alteredSemantic = sourceBundle();
    alteredSemantic.semanticReceipt.composition.operation = "foreign.operation";
    expect(() => createProjectRenameRedoHandlerClassifierEvidence(alteredSemantic)).toThrow(/operation/i);

    const alteredMetadata = sourceBundle();
    alteredMetadata.semanticReceipt.composition.metadataEnvelopePreserved = false;
    expect(() => createProjectRenameRedoHandlerClassifierEvidence(alteredMetadata)).toThrow(/metadata/i);

    const result = createProjectRenameRedoHandlerClassifierEvidence(sourceBundle());
    expect(() => projectRenameRedoHandlerClassifierEvidenceSchema.parse(result.map((entry) => ({ ...entry, operationAuthority: "granted" })))).toThrow(/operationAuthority/i);
    expect(() => projectRenameRedoHandlerClassifierEvidenceSchema.parse(result.slice(0, 1))).toThrow(/exactly two/i);
  });

  it("exposes the binding as read-only UI evidence without invoking the source bridge", () => {
    const evidenceSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/project-stage11-project-rename-redo-handler-classifier-evidence.ts", import.meta.url), "utf8");
    const appSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/App.tsx", import.meta.url), "utf8");
    expect(evidenceSource).toContain("bridgeProjectRenameRedoToTerminalHistory");
    expect(evidenceSource).toContain("projectRenameRedoTerminalHistoryReceiptSchema");
    expect(evidenceSource).not.toContain("bridgeProjectRenameRedoToTerminalHistory(");
    expect(evidenceSource).not.toContain("projectRenameRedoTerminalHistoryReceiptSchema.parse(");
    expect(evidenceSource).not.toContain("undoProposalBatch");
    expect(evidenceSource).not.toContain("redoProposalBatch");
    expect(evidenceSource).not.toContain("localStorage");
    expect(appSource).toContain("TYPED_PROJECT_RENAME_REDO_HANDLER_CLASSIFIER_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying project.rename handler/classifier binding");
    expect(appSource).toContain('data-testid="project-rename-redo-handler-classifier-evidence"');
    expect(appSource).toContain("does not invoke project.rename undo, redo");
  });
});
