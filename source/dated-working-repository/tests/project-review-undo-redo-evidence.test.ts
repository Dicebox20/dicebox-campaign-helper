import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS,
} from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";
import {
  TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE,
  TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY,
} from "../apps/campaign-helper-desktop/src/project-review-undo-redo-evidence.js";

const root = resolve(import.meta.dirname, "..");
const coreSource = readFileSync(resolve(root, "packages", "dicebox-core", "src", "proposal-batch.ts"), "utf8");
const evidenceSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-review-undo-redo-evidence.ts"), "utf8");
const appSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M748 committed-undone-redone lifecycle evidence", () => {
  it("binds both canonical undo/redo transitions to every existing typed operation", () => {
    expect(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE_SUMMARY).toMatchObject({
      commandKindCount: 14,
      sourceStatusCount: 2,
      evidenceCount: 28,
      sourceStatuses: ["committed", "undone"],
      rereadStatus: "matched",
      rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
      transitionInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
    });
    expect(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE).toHaveLength(28);
    expect(new Set(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.map((entry) => `${entry.commandKind}-${entry.sourceStatus}`)).size).toBe(28);
    expect([...new Set(TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.map((entry) => entry.commandKind))]).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
  });

  it("derives exact core transitions and preserves the matched reread boundary", () => {
    const committedEntries = TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.filter((entry) => entry.sourceStatus === "committed");
    const undoneEntries = TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.filter((entry) => entry.sourceStatus === "undone");
    expect(committedEntries.map((entry) => ({ commandKind: entry.commandKind, sourceStatus: entry.sourceStatus, transition: entry.transition, destinationStatus: entry.destinationStatus, allowedTransitionsBefore: entry.allowedTransitionsBefore, allowedTransitionsAfter: entry.allowedTransitionsAfter }))).toEqual(
      TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map((commandKind) => ({ commandKind, sourceStatus: "committed", transition: "undo", destinationStatus: "undone", allowedTransitionsBefore: ["undo"], allowedTransitionsAfter: ["redo"] })),
    );
    expect(undoneEntries.map((entry) => ({ commandKind: entry.commandKind, sourceStatus: entry.sourceStatus, transition: entry.transition, destinationStatus: entry.destinationStatus, allowedTransitionsBefore: entry.allowedTransitionsBefore, allowedTransitionsAfter: entry.allowedTransitionsAfter }))).toEqual(
      TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS.map((commandKind) => ({ commandKind, sourceStatus: "undone", transition: "redo", destinationStatus: "redone", allowedTransitionsBefore: ["redo"], allowedTransitionsAfter: ["undo"] })),
    );
    for (const entry of TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE) {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS[entry.sourceStatus];
      expect(entry).toMatchObject({
        reviewAuthority: operation.reviewAuthority,
        targetAuthority: operation.targetAuthority,
        applyAuthority: operation.applyAuthority,
        operationAuthority: "not-granted",
        applyHandler: operation.applyHandler,
        sourceStatus: entry.sourceStatus,
        transition: transition.transition,
        destinationStatus: transition.destinationStatus,
        allowedTransitionsBefore: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.sourceStatus],
        allowedTransitionsAfter: TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.destinationStatus],
        rereadStatus: transition.rereadStatus,
        rereadRequirement: "matched-post-transition-exact-target-with-revision-and-hash",
        exactTargetRequired: true,
        revisionAndHashRequired: true,
        rereadInvocation: "not-invoked",
        transitionInvocation: "not-invoked",
        undoRedoProjection: "contract-mapped-not-invoked",
        operationSpecificUndoRedoHandler: "unprojected",
        operationSpecificRereadClassifier: "unproven",
        m747RecoveryResultProjection: "preserved-out-of-scope",
        noTransitionAuthority: true,
        executionAuthority: "none",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        stage11Ready: false,
        stage12Started: false,
        source: "core-undo-redo-transition-and-operation-contract",
        evidenceStatus: "bounded-undo-redo-lifecycle-projection",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      expect(entry.remainingLifecycleGap.length).toBeGreaterThan(0);
    }
  });

  it("stays read-only and is disclosed without invoking transition wrappers", () => {
    expect(coreSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS");
    expect(coreSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed");
    expect(coreSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone");
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS");
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS");
    expect(evidenceSource).toContain("operationSpecificUndoRedoHandler: \"unprojected\"");
    expect(evidenceSource).toContain("operationSpecificRereadClassifier: \"unproven\"");
    expect(evidenceSource).toContain("m747RecoveryResultProjection: \"preserved-out-of-scope\"");
    expect(evidenceSource).not.toContain("project-review-recovery-result-evidence");
    expect(evidenceSource).not.toContain("undoProposalBatch(");
    expect(evidenceSource).not.toContain("redoProposalBatch(");
    expect(evidenceSource).not.toContain("executeGeneric");
    expect(evidenceSource).not.toContain("localStorage");
    expect(evidenceSource).not.toContain("sessionStorage");
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_UNDO_REDO_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying undo/redo projection");
    expect(appSource).toContain('data-testid="undo-redo-lifecycle-evidence"');
    expect(appSource).toContain("does not invoke undo, redo");
    expect(appSource).toContain("M747 recovery-result projection is preserved out of scope");
  });
});
