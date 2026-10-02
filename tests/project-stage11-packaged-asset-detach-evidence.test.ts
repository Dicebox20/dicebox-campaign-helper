import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createProjectStage11PackagedAssetDetachEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-packaged-asset-detach-evidence";

const m582 = () => JSON.parse(readFileSync(new URL("../outputs/m582-stage11-selected-missing-asset-detach-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as Record<string, any>;

describe("M861 Stage 11 packaged asset-detach evidence", () => {
  it("binds the exact packaged lifecycle and authoritative preservation reread", () => expect(createProjectStage11PackagedAssetDetachEvidence(m582())).toMatchObject({ status: "PASS", observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, preservationObserved: true, noFoundryWrite: true, noAuthorityGrant: true, stage11AcceptanceStatus: "blocked", stage12Started: false }));
  it("fails closed for target, apply, reread, preservation, and promotion drift", () => {
    expect(() => createProjectStage11PackagedAssetDetachEvidence({ ...m582(), goalId: "foreign" })).toThrow(/goalId/);
    expect(() => createProjectStage11PackagedAssetDetachEvidence({ ...m582(), runner: { ...m582().runner, timedOut: true } })).toThrow(/timedOut/);
    expect(() => createProjectStage11PackagedAssetDetachEvidence({ ...m582(), directReread: { ...m582().directReread, currentGeneration: 3 } })).toThrow(/currentGeneration/);
    expect(() => createProjectStage11PackagedAssetDetachEvidence({ ...m582(), preservation: { ...m582().preservation, foundryWrite: true } })).toThrow(/foundryWrite/);
    expect(() => createProjectStage11PackagedAssetDetachEvidence({ ...m582(), readyToPlay: true })).toThrow(/readyToPlay/);
  });
});
