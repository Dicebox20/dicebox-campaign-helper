import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

describe("M1159 current Foundry artifact specification receipt", () => {
  it("retains the immutable verifier that preceded the M1164 installer source rotation", async () => {
    const receipt = JSON.parse(await readFile("outputs/m1159-current-foundry-artifact-spec-receipt.json", "utf8"));
    const artifacts: Array<{ kind: string; sha256: string }> = receipt.canonicalSpecification.artifacts;
    const byKind = new Map(artifacts.map((artifact) => [artifact.kind, artifact]));
    expect(receipt.status).toBe("PASS_SOURCE_ONLY_SUCCESSOR");
    expect(receipt.milestone).toBe("M1159");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1159");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1159");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("installer")?.sha256).toBe("8fb30437e0195fc07552ae0b8575a0f8a25e4d822ca205c29a25da860113a0b5");
    expect(receipt.installerTransition.previousSha256).toBe("fffb439942619c5affc10e5ab74b43ef9aa3107c989f1551ff5cfce2e7c5bc83");
    expect(receipt.installerTransition.currentSha256).toBe("8fb30437e0195fc07552ae0b8575a0f8a25e4d822ca205c29a25da860113a0b5");
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noInstall).toBe(true);
    expect(receipt.foreignStatePreserved).toBe(true);
    expect(receipt.readyClaim).toBe(false);
    expect(JSON.parse(await readFile("outputs/m1144-current-foundry-artifact-spec-receipt.json", "utf8")).canonicalSpecification.artifacts.find((artifact: { kind: string }) => artifact.kind === "installer")?.sha256)
      .toBe("fffb439942619c5affc10e5ab74b43ef9aa3107c989f1551ff5cfce2e7c5bc83");
  });
});
