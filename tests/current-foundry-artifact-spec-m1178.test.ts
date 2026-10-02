import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";
import { createM1178CurrentFoundryArtifactSpecReceipt } from "../tools/write-m1178-current-foundry-artifact-spec.js";

const root = resolve(import.meta.dirname, "..");

describe("M1178 current Foundry artifact specification refresh", () => {
  it("derives a source-only five-artifact verifier after the fixed candidate write boundary", async () => {
    const receipt = await createM1178CurrentFoundryArtifactSpecReceipt({ observedAt: "2026-09-06T00:00:00.000Z" });
    const installerSource = readFileSync(resolve(root, "packages/dicebox-foundry/src/ascendancy-installer.js"), "utf8");
    const byKind = new Map(receipt.canonicalSpecification.artifacts.map((artifact) => [artifact.kind, artifact]));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_SUCCESSOR");
    expect(receipt.milestone).toBe("M1178");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1178");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1178");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("installer")?.sha256).toHaveLength(64);
    expect(receipt.installerTransition.previousSha256).toBe("600f24da6339b2557c9969391085e0950a02e63008f290cecb2bf89f4f916e53");
    expect(receipt.installerTransition.currentSha256).toBe(byKind.get("installer")?.sha256);
    expect(installerSource).toContain("CANDIDATE_WRITE_CONTROL_ID");
    expect(receipt.successorOf.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1172");
    expect(receipt.provenance.stagedServed).toContain("source-only");
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noInstall).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.foreignStatePreserved).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
