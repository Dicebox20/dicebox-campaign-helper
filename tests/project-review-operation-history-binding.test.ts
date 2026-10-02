import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE,
  TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE,
  TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING,
  TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
  TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";

const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M617 typed operation-to-proposal-history evidence binding", () => {
  it("binds exactly the existing 14 operation kinds to the existing state vocabulary", () => {
    expect(TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING).toHaveLength(14);
    expect(TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.map((entry) => entry.commandKind)).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    for (const entry of TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING) {
      const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      expect(entry.proposalHistoryStates).toEqual([...TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY]);
      expect(entry.boundedHistoryStates).toEqual(["previewed", "approved"]);
      expect(entry).toMatchObject({
        applyHandler: contract.applyHandler,
        historyCoverage: "review-and-approval-only",
        nonCertifying: true,
        readOnly: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      expect(entry.remainingHistoryGap.length).toBeGreaterThan(0);
    }
  });

  it("stays metadata-only in the proposal review surface", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_OPERATION_PROPOSAL_HISTORY_BINDING.map");
    expect(appSource).toContain("Typed operation-to-proposal-history evidence binding:");
    expect(appSource).toContain("read-only, non-certifying metadata binding");
    expect(appSource).toContain('data-testid="typed-operation-to-proposal-history-evidence-binding"');
    expect(appSource).toContain("does not transition history");
    expect(appSource).not.toContain("executeGenericProposalHistory");
    expect(appSource).not.toContain("applyGenericProposalHistory");
  });

  it("exposes an exact 14-by-11 lifecycle coverage matrix without adding execution", () => {
    expect(TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE).toHaveLength(14);
    expect(TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE.map((entry) => entry.commandKind)).toEqual([
      ...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
    ]);
    for (const entry of TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE) {
      expect(entry.historyStates).toEqual([...TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY]);
      expect(entry.observedHistoryStates).toEqual(["previewed", "approved"]);
      expect(entry.unobservedHistoryStates).toEqual([
        "rejected",
        "cancelled",
        "stale",
        "applying",
        "unknown-outcome",
        "committed",
        "recovered",
        "undone",
        "redone",
      ]);
      expect(entry).toMatchObject({
        coverage: "preview-and-approval-only",
        nonCertifying: true,
        readOnly: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      expect(entry.remainingLifecycleGap.length).toBeGreaterThan(0);
    }
  });

  it("renders the matrix as explicit non-certifying disclosure", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_OPERATION_HISTORY_LIFECYCLE_COVERAGE.map");
    expect(appSource).toContain("Typed operation/history lifecycle coverage matrix:");
    expect(appSource).toContain('data-testid="typed-operation-history-lifecycle-coverage-matrix"');
    expect(appSource).toContain("does not transition history");
    expect(appSource).not.toContain("executeGenericProposalHistory");
    expect(appSource).not.toContain("applyGenericProposalHistory");
  });

  it("projects the exact core transition vocabulary without changing it", async () => {
    const { TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS } = await import("@dicebox/core");
    expect(TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION).toHaveLength(11);
    expect(TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION.map((entry) => entry.historyState)).toEqual([
      ...TYPED_PROPOSAL_HISTORY_STATE_VOCABULARY,
    ]);
    for (const entry of TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION) {
      expect(entry.allowedTransitions).toEqual(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.historyState]);
      expect(entry).toMatchObject({
        source: "core-allowed-transitions",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
      });
    }
  });

  it("renders the core transition projection as a non-executing disclosure", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION.map");
    expect(appSource).toContain("Typed proposal-history transition projection:");
    expect(appSource).toContain('data-testid="typed-proposal-history-transition-projection"');
    expect(appSource).toContain("existing core allowed-transition vocabulary");
    expect(appSource).not.toContain("executeGenericProposalHistory");
    expect(appSource).not.toContain("applyGenericProposalHistory");
  });

  it("binds every operation handler to the exact core transition projection", () => {
    expect(TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE).toHaveLength(14);
    expect(TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE.map((entry) => entry.commandKind)).toEqual([
      ...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
    ]);
    for (const entry of TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE) {
      const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      expect(entry.applyHandler).toBe(contract.applyHandler);
      expect(entry.transitionProjection).toEqual(TYPED_LOCAL_PROJECT_PROPOSAL_HISTORY_TRANSITION_PROJECTION);
      expect(entry.transitionProjection).toHaveLength(11);
      expect(entry).toMatchObject({
        source: "operation-handler-and-core-allowed-transitions",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
    }
  });

  it("renders operation-specific transition coverage as a non-executing disclosure", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_OPERATION_HISTORY_TRANSITION_COVERAGE.map");
    expect(appSource).toContain("Typed operation-to-history-transition coverage:");
    expect(appSource).toContain('data-testid="typed-operation-history-transition-coverage"');
    expect(appSource).toContain("cross-binding of each existing operation-specific handler");
    expect(appSource).not.toContain("executeGenericProposalHistory");
    expect(appSource).not.toContain("applyGenericProposalHistory");
  });
});
