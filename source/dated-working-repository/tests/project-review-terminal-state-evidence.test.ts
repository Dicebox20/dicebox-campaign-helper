import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS } from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";
import {
  TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE,
  TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY,
  TYPED_REVIEW_TERMINAL_HISTORY_STATES,
} from "../apps/campaign-helper-desktop/src/project-review-terminal-state-evidence.js";

const evidenceSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "project-review-terminal-state-evidence.ts"), "utf8");
const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M745 rejected/cancelled/stale review-terminal lifecycle evidence", () => {
  it("binds exactly three terminal review outcomes to every existing typed operation", () => {
    expect(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE_SUMMARY).toMatchObject({
      commandKindCount: 14,
      terminalStateCount: 3,
      evidenceCount: 42,
      terminalStates: ["rejected", "cancelled", "stale"],
      transitionInvocation: "not-invoked",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
    });
    expect(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE).toHaveLength(42);
    expect([...new Set(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE.map((entry) => entry.commandKind))]).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    expect([...new Set(TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE.map((entry) => entry.reviewTerminalState))]).toEqual([...TYPED_REVIEW_TERMINAL_HISTORY_STATES]);
  });

  it("derives exact core source and terminal transition semantics without apply authority", () => {
    for (const entry of TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE) {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      expect(entry.applyHandler).toBe(operation.applyHandler);
      expect(entry.allowedTransitionsAfter).toEqual(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.reviewTerminalState]);
      expect(entry.allowedTransitionsAfter).toEqual([]);
      expect(entry.allowedSourceStatuses).toEqual(
        entry.reviewTerminalState === "rejected" ? ["previewed"] : ["previewed", "approved"],
      );
      expect(entry).toMatchObject({
        terminalNoApply: true,
        executionAuthority: "none",
        transitionInvocation: "not-invoked",
        source: "operation-contract-and-core-allowed-transitions",
        evidenceStatus: "bounded-review-terminal-projection",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      expect(entry.remainingLifecycleGap.length).toBeGreaterThan(0);
    }
  });

  it("stays disjoint from the M743 artifact index and is disclosed as read-only metadata", () => {
    expect(evidenceSource).toContain("TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS");
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS");
    expect(evidenceSource).not.toContain("inspectProjectTerminalHistoryEvidenceIndex");
    expect(evidenceSource).not.toContain("rejectProposalBatch(");
    expect(evidenceSource).not.toContain("cancelProposalBatch(");
    expect(evidenceSource).not.toContain("invalidateStaleProposalBatch(");
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_REVIEW_TERMINAL_STATE_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying review-terminal lifecycle projection");
    expect(appSource).toContain('data-testid="review-terminal-lifecycle-evidence"');
    expect(appSource).toContain("does not invoke transitions");
    expect(appSource).not.toContain("executeGenericReviewTerminalState");
    expect(appSource).not.toContain("applyGenericReviewTerminalState");
  });
});
