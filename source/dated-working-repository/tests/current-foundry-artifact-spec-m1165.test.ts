import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const root = resolve(process.cwd());

describe("M1165 current Foundry artifact specification refresh", () => {
  it("derives a current five-artifact verifier after the M1164 installer source rotation", async () => {
    const receipt = JSON.parse(readFileSync(resolve(root, "outputs/m1165-current-foundry-artifact-spec-receipt.json"), "utf8"));
    const byKind = new Map<string, { kind: string; sha256: string }>(receipt.canonicalSpecification.artifacts.map((artifact: { kind: string; sha256: string }) => [artifact.kind, artifact] as [string, { kind: string; sha256: string }]));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_SUCCESSOR");
    expect(receipt.milestone).toBe("M1165");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1165");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1165");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("installer")?.sha256).toBe("6ec6ee9c59d586e8b0a9c12330a453d946ac183fdd24adddcae08c9b7773259e");
    expect(receipt.installerTransition.previousSha256).toBe("8fb30437e0195fc07552ae0b8575a0f8a25e4d822ca205c29a25da860113a0b5");
    expect(receipt.installerTransition.currentSha256).toBe("6ec6ee9c59d586e8b0a9c12330a453d946ac183fdd24adddcae08c9b7773259e");
    expect(receipt.successorOf.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1159");
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noInstall).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.foreignStatePreserved).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
