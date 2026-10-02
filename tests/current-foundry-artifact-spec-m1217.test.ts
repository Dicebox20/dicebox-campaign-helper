import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const repoRoot = resolve(import.meta.dirname, "..");

describe("historical M1217 Foundry artifact specification", () => {
  it("retains the predecessor receipt as immutable provenance after M1259 supersedes current identity", async () => {
    const receipt = JSON.parse(await readFile(resolve(repoRoot, "outputs/m1217-current-foundry-artifact-spec-receipt.json"), "utf8"));
    const byKind = new Map<string, { kind: string; sha256?: string }>(receipt.canonicalSpecification.artifacts.map((artifact: { kind: string; sha256?: string }) => [artifact.kind, artifact] as const));

    expect(receipt.status).toBe("PASS_SOURCE_ONLY_CURRENT");
    expect(receipt.milestone).toBe("M1217");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1217");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1217");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.sourceSpecSha256).toBe(receipt.canonicalSpecification.specSha256);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(receipt.canonicalSpecification.specSha256).toBe("7f3929bb9085a2036d9eb501071c470beafdfa37e8cbc673d9126fd2584a54fc");
    expect(byKind.get("installer")?.sha256).toBe("a63b40022301916e7f756946aa8191136c871d9757c71aa744b31a1990d46d7c");
    expect(byKind.get("package")?.sha256).toBe("1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5");
    expect(receipt.descriptorTransition).toEqual({ previousM1214InstallerSha256: "6d3c6ee7955c18adea1f3b690de6808b4a187c53bec215d02928d10ba148adff", currentInstallerSha256: "a63b40022301916e7f756946aa8191136c871d9757c71aa744b31a1990d46d7c", descriptorDriftReconciled: true });
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
