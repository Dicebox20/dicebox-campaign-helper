import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const repoRoot = resolve(import.meta.dirname, "..");

describe("M1214 current Foundry artifact specification", () => {
  it("preserves the immutable M1214 source descriptor receipt after later source changes", async () => {
    const receipt = JSON.parse(await readFile(resolve(repoRoot, "outputs/m1214-current-foundry-artifact-spec-receipt.json"), "utf8"));
    const byKind = new Map<string, { kind: string; sha256?: string }>(receipt.canonicalSpecification.artifacts.map((artifact: { kind: string; sha256?: string }) => [artifact.kind, artifact] as const));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_CURRENT");
    expect(receipt.milestone).toBe("M1214");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1214");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1214");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.sourceSpecSha256).toBe(receipt.canonicalSpecification.specSha256);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(receipt.canonicalSpecification.specSha256).toBe("35e6b5c1583f7bdc84c4f017654e68b770f60f353438cb1605bc7708ee239a5e");
    expect(byKind.get("package")?.sha256).toBe("1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5");
    expect(byKind.get("installer")?.sha256).toBe("6d3c6ee7955c18adea1f3b690de6808b4a187c53bec215d02928d10ba148adff");
    expect(byKind.get("adapter")?.sha256).toBe("3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab");
    expect(byKind.get("worker")?.sha256).toBe("2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87");
    expect(receipt.descriptorTransition).toEqual({ previousM1211InstallerSha256: "1bc06bbb7f6f779afdcb0b7dbd5f4b9c5aae335748d0ea9f698dc4a25f946add", currentInstallerSha256: "6d3c6ee7955c18adea1f3b690de6808b4a187c53bec215d02928d10ba148adff", descriptorDriftReconciled: true });
    expect(receipt.packageTransition).toEqual({ previousM1211PackageSha256: "1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5", currentPackageSha256: "1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5", packageUnchanged: true });
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
