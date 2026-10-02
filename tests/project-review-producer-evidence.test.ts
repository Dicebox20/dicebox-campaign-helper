import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY } from "../apps/campaign-helper-desktop/src/project-review-producer-evidence.js";

const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");

describe("M603 typed cross-producer lifecycle evidence summary", () => {
  it("enumerates exactly the eleven reconciled producer families", () => {
    expect(TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY).toHaveLength(11);
    expect(new Set(TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.map((entry) => entry.familyId)).size).toBe(11);
    expect(TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.every((entry) => entry.nonCertifying === true)).toBe(true);
    expect(TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.every((entry) => entry.remainingGap.length > 0)).toBe(true);
  });

  it("stays read-only and non-certifying in the proposal review surface", () => {
    expect(appSource).toContain("TYPED_LOCAL_PROJECT_PRODUCER_EVIDENCE_SUMMARY.map");
    expect(appSource).toContain("Cross-producer lifecycle evidence:");
    expect(appSource).toContain("aggregate Stage 11 acceptance remains partial");
    expect(appSource).toContain("<details open>");
    expect(appSource).toContain("This is a non-certifying, read-only evidence summary.");
    expect(appSource).toContain('data-testid="cross-producer-lifecycle-evidence-summary"');
    expect(appSource).toContain("non-certifying, read-only evidence summary");
    expect(appSource).not.toContain("executeGenericProjectProducerEvidence");
    expect(appSource).not.toContain("applyGenericProjectProducerEvidence");
  });
});
