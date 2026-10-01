import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

describe("current Foundry artifact specification", () => {
  it("derives one canonical verifier source from exact reviewed bytes and preserves legacy drift", async () => {
    const receipt = JSON.parse(await readFile("outputs/m1144-current-foundry-artifact-spec-receipt.json", "utf8"));
    const byKind = new Map<string, { kind: string; sha256?: string }>(receipt.canonicalSpecification.artifacts.map((artifact: { kind: string; sha256?: string }) => [artifact.kind, artifact] as const));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_SUCCESSOR");
    expect(receipt.milestone).toBe("M1144");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1144");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1144");
    expect(receipt.readyClaim).toBe(false);
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.sourceSpecSha256).toBe(receipt.canonicalSpecification.specSha256);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("package")?.sha256).toBe("2f257477f02aac0a60b01d6c0aefef738484be5c437a708bd293945ccf90645f");
    expect(byKind.get("installer")?.sha256).toBe("fffb439942619c5affc10e5ab74b43ef9aa3107c989f1551ff5cfce2e7c5bc83");
    expect(byKind.get("worker")?.sha256).toBe("2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87");
    expect(byKind.get("adapter")?.sha256).toBe("3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab");
    expect(byKind.get("runtime")?.sha256).toBe("31d9655e77eed5e0e94dab33421e63537a14251df994296c3c039ce019192a1b");
    expect(receipt.successorOf.specId).toBe("dbx:foundry-spec:current-product-0.1.15");
    expect(receipt.provenance.package.receipt).toBe("outputs/m1058-stage12-campaign-package-background-object-preview-closure-receipt.json");
    expect(receipt.runtimeEvidence.currentRuntimeProfile).toBe("not-observed");
    const historical = JSON.parse(await readFile("outputs/m249-foundry-artifact-spec-receipt.json", "utf8"));
    expect(historical.canonicalSpecification.artifacts.find((artifact: { kind: string }) => artifact.kind === "worker")?.sha256)
      .toBe("460f79b11ea457ec9efc3dcbe2c8d2c534516054d8247944f26096245df5cf35");
  });
});
