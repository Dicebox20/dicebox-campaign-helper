import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { verifyFoundryArtifactSpecHash } from "@dicebox/compiler";
import { createM1259CurrentFoundryArtifactSpecReceipt } from "../tools/write-m1259-current-foundry-artifact-spec.js";

const repoRoot = resolve(import.meta.dirname, "..");

async function sha256(path: string): Promise<string> {
  return createHash("sha256").update(await readFile(resolve(repoRoot, path))).digest("hex");
}

describe("M1259 current Foundry artifact specification", () => {
  it("binds exact current source bytes to a coherent local spec, verifier, and embedded identity", async () => {
    const receipt = await createM1259CurrentFoundryArtifactSpecReceipt({ observedAt: "2026-09-07T00:00:00.000Z" });
    const byKind = new Map<string, { kind: string; sha256?: string }>(receipt.canonicalSpecification.artifacts.map((artifact: { kind: string; sha256?: string }) => [artifact.kind, artifact] as const));
    const moduleSource = await readFile(resolve(repoRoot, "packages/dicebox-foundry/src/module.js"), "utf8");
    const sidecar = JSON.parse(await readFile(resolve(repoRoot, "packages/dicebox-foundry/src/module-byte-attestation.json"), "utf8"));

    expect(receipt.status).toBe("PASS_LOCAL_CURRENT_IDENTITY");
    expect(receipt.milestone).toBe("M1259");
    expect(receipt.canonicalSpecification.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1259");
    expect(receipt.verifierExpectation.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1259");
    expect(await verifyFoundryArtifactSpecHash(receipt.canonicalSpecification)).toBe(true);
    expect(receipt.verifierExpectation.sourceSpecSha256).toBe(receipt.canonicalSpecification.specSha256);
    expect(receipt.verifierExpectation.expectedArtifacts).toEqual(receipt.canonicalSpecification.artifacts);
    expect(receipt.canonicalSpecification.specSha256).toBe("4891515e0b4a37cc180c5245991d218e79cca595146a1977b03b4cfb06e7095c");
    expect(byKind.get("installer")?.sha256).toBe("579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731");
    expect(byKind.get("package")?.sha256).toBe("1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5");
    expect(receipt.descriptorTransition).toEqual({ previousM1217InstallerSha256: "a63b40022301916e7f756946aa8191136c871d9757c71aa744b31a1990d46d7c", currentInstallerSha256: "579f96e4948bbfc7b508f29cbde57e2dd331ddee89c6be1f0464f9eaffbfe731", descriptorDriftReconciled: true });
    expect(moduleSource).toContain("dbx:foundry-spec:current-product-0.1.15-m1259");
    expect(sidecar.specId).toBe("dbx:foundry-spec:current-product-0.1.15-m1259");
    expect(sidecar.verifierId).toBe("dbx:foundry-verifier:current-product-0.1.15-m1259");
    expect(sidecar.moduleBytes).toBe(Buffer.byteLength(moduleSource, "utf8"));
    expect(sidecar.moduleSha256).toBe(await sha256("packages/dicebox-foundry/src/module.js"));
    expect(receipt.noFoundryLaunch).toBe(true);
    expect(receipt.noFixtureWrite).toBe(true);
    expect(receipt.noInstall).toBe(true);
    expect(receipt.readyClaim).toBe(false);
  });
});
