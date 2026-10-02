import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS,
  TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS,
} from "../apps/campaign-helper-desktop/src/project-review-apply-coverage.js";

const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M613 typed operation-lifecycle evidence envelope", () => {
  it("derives exactly one read-only, non-certifying entry from every existing operation contract", () => {
    expect(TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE).toHaveLength(14);
    expect(TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.map((entry) => entry.commandKind)).toEqual([...TYPED_LOCAL_PROJECT_REVIEW_APPLY_COMMAND_KINDS]);
    expect(new Set(TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.map((entry) => entry.commandKind)).size).toBe(14);
    for (const entry of TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE) {
      const contract = TYPED_LOCAL_PROJECT_REVIEW_APPLY_OPERATION_CONTRACTS[entry.commandKind];
      expect(entry).toMatchObject({
        reviewAuthority: "human-review",
        targetAuthority: "local-project",
        applyAuthority: "operation-specific",
        applyHandler: contract.applyHandler,
        nonCertifying: true,
        readOnly: true,
        noExecutionAuthority: true,
        noGenericExecutor: true,
      });
      expect(entry.boundedEvidence.length).toBeGreaterThan(0);
      expect(entry.remainingGap.length).toBeGreaterThan(0);
    }
  });

  it("stays metadata-only in the proposal review surface", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_OPERATION_LIFECYCLE_EVIDENCE_ENVELOPE.map");
    expect(appSource).toContain("Typed operation-lifecycle evidence envelope:");
    expect(appSource).toContain("read-only, non-certifying metadata envelope");
    expect(appSource).toContain('data-testid="typed-operation-lifecycle-evidence-envelope"');
    expect(appSource).toContain("no execution authority");
    expect(appSource).not.toContain("executeGenericProjectOperationLifecycleEvidence");
    expect(appSource).not.toContain("applyGenericProjectOperationLifecycleEvidence");
  });
});
