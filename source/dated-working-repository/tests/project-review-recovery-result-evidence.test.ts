import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS,
  TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP,
} from "@dicebox/core";
import {
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";
import {
  TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE,
  TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY,
  TYPED_RECOVERY_RESULT_REREAD_STATUSES,
} from "../apps/campaign-helper-desktop/src/project-review-recovery-result-evidence.js";

const evidenceSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "project-review-recovery-result-evidence.ts"), "utf8");
const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M747 authoritative-reread recovery-result evidence", () => {
  it("binds four reread outcomes to every existing typed operation", () => {
    expect(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE_SUMMARY).toMatchObject({
      commandKindCount: 14,
      rereadStatusCount: 4,
      evidenceCount: 56,
      rereadStatuses: ["matched", "not-committed", "conflict", "unknown"],
      transition: "recover-after-reread",
      recoveryResultProjection: "contract-mapped-not-invoked",
      transitionInvocation: "not-invoked",
      noTransitionAuthority: true,
      executionAuthority: "none",
      readOnly: true,
      nonCertifying: true,
      noExecutionAuthority: true,
      noGenericExecutor: true,
      sameHistoryExecutionRetryAllowed: false,
    });
    expect(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE).toHaveLength(56);
    expect([...new Set(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE.map((entry) => entry.commandKind))]).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    expect([...new Set(TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE.map((entry) => entry.rereadStatus))]).toEqual([...TYPED_RECOVERY_RESULT_REREAD_STATUSES]);
  });

  it("derives exact result mapping and preserves unknown/retry/reread semantics", () => {
    for (const entry of TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE) {
      const operation = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      const canonicalResult = TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP[entry.rereadStatus];
      expect(entry.reviewAuthority).toBe(operation.reviewAuthority);
      expect(entry.targetAuthority).toBe(operation.targetAuthority);
      expect(entry.applyAuthority).toBe(operation.applyAuthority);
      expect(entry.operationAuthority).toBe("not-granted");
      expect(entry.applyHandler).toBe(operation.applyHandler);
      expect(entry.resultStatus).toBe(canonicalResult.resultStatus);
      expect(entry.sameHistoryExecutionRetryAllowed).toBe(canonicalResult.sameHistoryExecutionRetryAllowed);
      expect(entry.allowedSourceStatuses).toEqual(["unknown-outcome"]);
      expect(entry.allowedTransitionsAfter).toEqual(TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS[entry.resultStatus]);
      expect(entry).toMatchObject({
        sourceStatus: "unknown-outcome",
        transition: "recover-after-reread",
        exactTargetRequired: true,
        recoveryResultProjection: "contract-mapped-not-invoked",
        transitionInvocation: "not-invoked",
        rereadInvocation: "not-invoked",
        foreignStateMutation: "none",
        liveBehavior: "unproven",
        stage11Ready: false,
        stage12Started: false,
        noTransitionAuthority: true,
        executionAuthority: "none",
        source: "core-recovery-mapping-and-operation-contract",
        evidenceStatus: "bounded-recovery-result-projection",
        readOnly: true,
        nonCertifying: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      if (entry.rereadStatus === "matched") {
        expect(entry).toMatchObject({ resultStatus: "committed", rereadRequirement: "resolved-exact-target-with-revision-and-hash", retryPolicy: "same-history-execution-retry-forbidden" });
      } else if (entry.rereadStatus === "not-committed" || entry.rereadStatus === "conflict") {
        expect(entry).toMatchObject({ resultStatus: "recovered", rereadRequirement: "resolved-exact-target-with-revision-and-hash", retryPolicy: "same-history-execution-retry-forbidden" });
      } else {
        expect(entry).toMatchObject({ resultStatus: "unknown-outcome", rereadRequirement: "unknown-exact-target-without-revision-or-hash", retryPolicy: "same-history-execution-retry-forbidden" });
      }
      expect(entry.remainingLifecycleGap.length).toBeGreaterThan(0);
    }
  });

  it("stays disjoint from earlier slices and is disclosed without invoking recovery", () => {
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS");
    expect(evidenceSource).toContain("TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP");
    expect(evidenceSource).toContain("TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS");
    expect(evidenceSource).not.toContain("project-review-applying-unknown-evidence");
    expect(evidenceSource).not.toContain("project-review-terminal-state-evidence");
    expect(evidenceSource).not.toContain("recoverProposalAfterReread(");
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_RECOVERY_RESULT_EVIDENCE.map");
    expect(appSource).toContain("read-only, non-certifying recovery-result projection");
    expect(appSource).toContain('data-testid="recovery-result-lifecycle-evidence"');
    expect(appSource).toContain("does not invoke recovery");
    expect(appSource).not.toContain("executeGenericRecoveryResultEvidence");
    expect(appSource).not.toContain("applyGenericRecoveryResultEvidence");
  });
});
