import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";
import { createM1172CurrentFoundryArtifactSpecReceipt } from "../tools/write-m1172-current-foundry-artifact-spec.js";

describe("M1172 current Foundry artifact specification refresh", () => {
  it("derives a current five-artifact verifier after the candidate diagnostic identity refresh", async () => {
    const receipt = await createM1172CurrentFoundryArtifactSpecReceipt({ observedAt: "2026-09-06T00:00:00.000Z" });
    const byKind = new Map(receipt.canonicalSpecification.artifacts.map((artifact) => [artifact.kind, artifact]));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_SUCCESSOR");
    expect(receipt.milestone).toBe("M1172");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1172");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1172");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("installer")?.sha256).toHaveLength(64);
    expect(receipt.installerTransition.previousSha256).toBe("68c84f18c7ec0450a55e836b74ab7cd7516da7878dfe83def72bfa40bac79c74");
    expect(receipt.installerTransition.currentSha256).toBe(byKind.get("installer")?.sha256);
    expect(receipt.successorOf.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1165");
    expect(receipt.provenance.stagedServed).toContain("pre-M1172");
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noInstall).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.foreignStatePreserved).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
