import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";
import { createCurrentFoundryArtifactSpecReceipt } from "../tools/write-current-foundry-artifact-spec.js";

describe("current Foundry artifact specification", () => {
  it("derives one canonical verifier source from exact reviewed bytes and preserves legacy drift", async () => {
    const receipt = await createCurrentFoundryArtifactSpecReceipt({ observedAt: "2026-08-27T17:00:00.000Z" });
    const byKind = new Map(receipt.canonicalSpecification.artifacts.map((artifact) => [artifact.kind, artifact]));
    expect(receipt.status).toBe("PASS");
    expect(receipt.readyClaim).toBe(false);
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.sourceSpecSha256).toBe(receipt.canonicalSpecification.specSha256);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(byKind.get("package")?.sha256).toBe("a9047d7810dbb0c286ea874c53112d38680dd2da1fe366dd4cd76f16b69f16fd");
    expect(byKind.get("installer")?.sha256).toBe("fffb439942619c5affc10e5ab74b43ef9aa3107c989f1551ff5cfce2e7c5bc83");
    expect(byKind.get("worker")?.sha256).toBe("2b4f79997cab9c963c7f3826bfd2baf2b3dec256f630970a8d7cdd983743aa87");
    expect(byKind.get("adapter")?.sha256).toBe("3a063c2dec5a4bf7ad7b6b13ce602ff4edcf32071c419e3ad7c5d265274113ab");
    expect(byKind.get("runtime")?.sha256).toBe("31d9655e77eed5e0e94dab33421e63537a14251df994296c3c039ce019192a1b");
    expect(receipt.legacyEvidence).toMatchObject({
      status: "preserved-blocked",
      expectedWorkerSha256: "460f79b11ea457ec9efc3dcbe2c8d2c534516054d8247944f26096245df5cf35",
      installedWorkerSha256: "60be1aa71386c3457bd313e319e7133724e752e1077f396050a056e69e4425a2",
    });
    const historical = JSON.parse(await readFile("outputs/m249-foundry-artifact-spec-receipt.json", "utf8"));
    expect(historical.canonicalSpecification.artifacts.find((artifact: { kind: string }) => artifact.kind === "worker")?.sha256)
      .toBe(receipt.legacyEvidence.expectedWorkerSha256);
  });
});
