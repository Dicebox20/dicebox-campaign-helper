import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  assertAssetAttestationForDependentDocuments,
  attestAscendancyRendererBytes,
  createAscendancySignalRuneDependentDocumentEligibilityGate,
  createAscendancyRendererApprovedAssetManifest,
  validateAscendancyRendererApprovedAssetManifest,
} from "@dicebox/compiler";

const signalPath = new URL("../assets/maps/ascendancy-signal-frequency-chamber-v2.png", import.meta.url);
const runePath = new URL("../assets/maps/ascendancy-rune-mechanism-chamber-v2.png", import.meta.url);
const observedAt = "2026-09-05T23:00:00+00:00";

describe("M1086 Signal/Rune provided-byte attestation", () => {
  it("creates exact approved metadata for the two current scene-bound renderers", () => {
    const manifest = createAscendancyRendererApprovedAssetManifest();
    expect(manifest.manifestId).toBe("dbx:manifest:m1086-signal-rune-renderers");
    expect(manifest.assets.map((asset) => asset.assetId)).toEqual([
      "dbx:asset:map-rune-mechanism-chamber",
      "dbx:asset:map-signal-frequency-chamber",
    ]);
    expect(manifest.assets.map((asset) => [asset.locator, asset.mimeType, asset.width, asset.height, asset.byteLength])).toEqual([
      ["assets/maps/ascendancy-rune-mechanism-chamber-v2.png", "image/png", 1536, 1024, 2748729],
      ["assets/maps/ascendancy-signal-frequency-chamber-v2.png", "image/png", 1536, 1024, 2935616],
    ]);
    expect(validateAscendancyRendererApprovedAssetManifest(manifest)).toEqual(manifest);
  });

  it("attests supplied local bytes exactly and keeps dependent-document scope empty", async () => {
    const gate = await attestAscendancyRendererBytes({
      signalBytes: readFileSync(signalPath),
      runeBytes: readFileSync(runePath),
      observedAt,
    });
    expect(gate.status).toBe("ready");
    expect(gate.requiredAssetIds).toEqual([
      "dbx:asset:map-rune-mechanism-chamber",
      "dbx:asset:map-signal-frequency-chamber",
    ]);
    expect(gate.dependentDocumentIds).toEqual([]);
    expect(gate.attestations.every((attestation) => attestation.status === "attested")).toBe(true);
    expect(gate.attestations.every((attestation) => attestation.source === "provided-bytes")).toBe(true);
    expect(gate.attestations.every((attestation) => attestation.noWrite)).toBe(true);
  });

  it("fails closed on manifest drift and mismatched supplied bytes", async () => {
    const manifest = createAscendancyRendererApprovedAssetManifest();
    expect(() => validateAscendancyRendererApprovedAssetManifest({
      ...manifest,
      assets: manifest.assets.map((asset, index) => index === 0
        ? { ...asset, byteLength: asset.byteLength + 1 }
        : asset),
    })).toThrow(/drifted/);
    const blocked = await attestAscendancyRendererBytes({
      signalBytes: new Uint8Array([1, 2, 3]),
      runeBytes: readFileSync(runePath),
      observedAt,
    });
    expect(blocked.status).toBe("blocked");
    expect(blocked.attestations.find((attestation) => attestation.assetId === "dbx:asset:map-signal-frequency-chamber")?.status).toBe("mismatch");
    expect(blocked.dependentDocumentIds).toEqual([]);
  });

  it("scopes future eligibility to the exact Signal and Rune Scenes without creating documents", async () => {
    const gate = await createAscendancySignalRuneDependentDocumentEligibilityGate({
      signalBytes: readFileSync(signalPath),
      runeBytes: readFileSync(runePath),
      observedAt,
    });
    expect(gate.status).toBe("ready");
    expect(gate.dependentDocumentIds).toEqual([
      "dbx:scene:rune-mechanism-chamber",
      "dbx:scene:signal-frequency-chamber",
    ]);
    expect(assertAssetAttestationForDependentDocuments(
      createAscendancyRendererApprovedAssetManifest(),
      gate,
      gate.dependentDocumentIds,
    )).toBe(true);
    expect(() => assertAssetAttestationForDependentDocuments(
      createAscendancyRendererApprovedAssetManifest(),
      gate,
      ["dbx:scene:ascendancy-tram-depot"],
    )).toThrow(/outside the attested gate scope/);
    expect(gate).not.toHaveProperty("create");
    expect(gate).not.toHaveProperty("documents");
    expect(gate).not.toHaveProperty("foundryDocuments");
  });
});
