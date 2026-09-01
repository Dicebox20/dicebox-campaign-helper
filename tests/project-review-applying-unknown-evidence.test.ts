import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS } from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";
import {
  TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS,
  TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE,
  TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY,
} from "../apps/campaign-helper-desktop/src/project-review-applying-unknown-evidence.js";

const evidenceSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "project-review-applying-unknown-evidence.ts"), "utf8");
const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M746 applying/unknown-outcome lifecycle evidence", () => {
  it("binds the three checkpoints to every existing typed operation", () => {
    expect(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE_SUMMARY).toMatchObject({
      commandKindCount: 14,
      checkpointCount: 3,
      evidenceCount: 42,
      checkpoints: ["approved-to-applying", "applying-to-unknown-outcome", "unknown-outcome-reread-gate"],
      transitionInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
    });
    expect(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE).toHaveLength(42);
    expect([...new Set(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE.map((entry) => entry.commandKind))]).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    expect([...new Set(TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE.map((entry) => entry.checkpoint))]).toEqual([...TYPED_APPLYING_UNKNOWN_EVIDENCE_CHECKPOINTS]);
  });

  it("derives exact core transition semantics and makes reread-before-retry explicit", () => {
    for (const entry of TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE) {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      expect(entry.applyHandler).toBe(operation.applyHandler);
      expect(entry.allowedSourceStatuses).toEqual([entry.sourceStatus]);
      expect(entry.allowedTransitionsAfter).toEqual(
        TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[
          entry.destinationStatus === "recovery-result-unprojected" ? "unknown-outcome" : entry.destinationStatus
        ],
      );
      expect(entry).toMatchObject({
        source: "operation-contract-and-core-allowed-transitions",
        evidenceStatus: "bounded-applying-unknown-projection",
        transitionInvocation: "not-invoked",
        noTransitionAuthority: true,
        executionAuthority: "none",
        recoveryResults: "unprojected",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      if (entry.checkpoint === "approved-to-applying") {
        expect(entry).toMatchObject({ sourceStatus: "approved", transition: "begin-apply", destinationStatus: "applying", rereadRequired: false, retryPolicy: "not-applicable-before-unknown" });
        expect(entry.rereadStatuses).toEqual([]);
      } else if (entry.checkpoint === "applying-to-unknown-outcome") {
        expect(entry).toMatchObject({ sourceStatus: "applying", transition: "mark-unknown", destinationStatus: "unknown-outcome", rereadRequired: true, retryPolicy: "forbidden-until-authoritative-reread" });
        expect(entry.rereadStatuses).toEqual(["matched", "not-committed", "conflict", "unknown"]);
      } else {
        expect(entry).toMatchObject({ sourceStatus: "unknown-outcome", transition: "recover-after-reread", destinationStatus: "recovery-result-unprojected", rereadRequired: true, retryPolicy: "forbidden-until-authoritative-reread" });
        expect(entry.rereadStatuses).toEqual(["matched", "not-committed", "conflict", "unknown"]);
      }
    }
  });

  it("stays metadata-only, disjoint from M745, and is disclosed without invocation", () => {
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS");
    expect(evidenceSource).toContain("TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS");
    expect(evidenceSource).not.toContain("project-review-terminal-state-evidence");
    expect(evidenceSource).not.toContain("beginProposalApply(");
    expect(evidenceSource).not.toContain("markProposalOutcomeUnknown(");
    expect(evidenceSource).not.toContain("recoverProposalAfterReread(");
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_APPLYING_UNKNOWN_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying applying/unknown-outcome lifecycle projection");
    expect(appSource).toContain('data-testid="applying-unknown-lifecycle-evidence"');
    expect(appSource).toContain("does not invoke transitions");
    expect(appSource).not.toContain("executeGenericApplyingUnknownEvidence");
    expect(appSource).not.toContain("applyGenericApplyingUnknownEvidence");
  });
});
