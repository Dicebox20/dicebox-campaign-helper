import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createProjectStage11PackagedAssetRestoreEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-packaged-asset-restore-evidence";

const m593 = () => JSON.parse(readFileSync(new URL("../outputs/m593-stage11-asset-restore-fresh-v3-packaged-observation-closure-receipt.json", import.meta.url), "utf8")) as Record<string, any>;

describe("M864 Stage 11 packaged asset-restore evidence", () => {
  it("binds the exact packaged lifecycle and authoritative preservation reread", () => expect(createProjectStage11PackagedAssetRestoreEvidence(m593())).toMatchObject({ status: "PASS", observedLifecycleCount: 1, producerScopedOnly: true, packagedLifecycleObserved: true, authoritativeReread: true, preservationObserved: true, noFoundryWrite: true, noAuthorityGrant: true, stage11AcceptanceStatus: "blocked", stage12Started: false }));
  it("fails closed for lifecycle, target, reread, preservation, and promotion drift", () => {
    expect(() => createProjectStage11PackagedAssetRestoreEvidence({ ...m593(), operation: "foreign" })).toThrow(/operation/);
    expect(() => createProjectStage11PackagedAssetRestoreEvidence({ ...m593(), trace: { ...m593().trace, approved: false } })).toThrow(/approved/);
    expect(() => createProjectStage11PackagedAssetRestoreEvidence({ ...m593(), authoritativeReread: { ...m593().authoritativeReread, generation: 2 } })).toThrow(/generation/);
    expect(() => createProjectStage11PackagedAssetRestoreEvidence({ ...m593(), preservation: { ...m593().preservation, foundry: "write" } })).toThrow(/foundry/);
    expect(() => createProjectStage11PackagedAssetRestoreEvidence({ ...m593(), decision: { ...m593().decision, stage12: "STARTED" } })).toThrow(/stage12/);
  });
});
