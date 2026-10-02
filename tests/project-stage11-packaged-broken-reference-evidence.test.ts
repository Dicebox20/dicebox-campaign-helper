import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createProjectStage11PackagedBrokenReferenceEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-packaged-broken-reference-evidence";

const m552 = () => JSON.parse(readFileSync(new URL("../outputs/m552-stage11-broken-reference-ui-v4-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as Record<string, any>;

describe("M866 Stage 11 packaged broken-reference evidence", () => {
  it("binds the exact packaged lifecycle and authoritative preservation reread", () => expect(createProjectStage11PackagedBrokenReferenceEvidence(m552())).toMatchObject({ status: "PASS", observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, preservationObserved: true, noFoundryWrite: true, noAuthorityGrant: true, stage11AcceptanceStatus: "blocked", stage12Started: false }));
  it("fails closed for target, lifecycle, reread, preservation, and promotion drift", () => {
    expect(() => createProjectStage11PackagedBrokenReferenceEvidence({ ...m552(), goalId: "foreign" })).toThrow(/goalId/);
    expect(() => createProjectStage11PackagedBrokenReferenceEvidence({ ...m552(), trace: { ...m552().trace, applied: false } })).toThrow(/applied/);
    expect(() => createProjectStage11PackagedBrokenReferenceEvidence({ ...m552(), authoritativeReread: { ...m552().authoritativeReread, v4Generation: 3 } })).toThrow(/v4Generation/);
    expect(() => createProjectStage11PackagedBrokenReferenceEvidence({ ...m552(), preservation: { ...m552().preservation, foundryWrite: true } })).toThrow(/foundryWrite/);
    expect(() => createProjectStage11PackagedBrokenReferenceEvidence({ ...m552(), readyToPlay: true })).toThrow(/readyToPlay/);
  });
});
