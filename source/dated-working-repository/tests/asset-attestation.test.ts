import { describe, expect, it } from "vitest";
import {
  assertAssetAttestationForDependentDocuments,
  attestApprovedAssetBytes,
  attestApprovedAssetFromReadOnlyFetch,
  createAssetAttestationGate,
  serializeAssetAttestationGate,
  validateAssetAttestationGate,
} from "@dicebox/compiler";
import { createApprovedAsset, createApprovedAssetManifest } from "@dicebox/compiler";
import { createStableDiceBoxId } from "@dicebox/core";

const observedAt = "2026-08-27T02:00:00.000Z";
const firstBytes = new TextEncoder().encode("dicebox asset fixture");
const secondBytes = new TextEncoder().encode("second dicebox asset");

const firstAsset = createApprovedAsset({
  assetId: createStableDiceBoxId("asset", "attestation-first"),
  role: "background",
  label: "First attestation asset",
  locator: "assets/maps/attestation-first.webp",
  mimeType: "image/webp",
  sha256: "b8293cb2e3eceed41ec5c31b836afb8a173d5b9f772111dc363baf7c10236e57",
  byteLength: firstBytes.byteLength,
  provenance: "M248 fixture",
});

const secondAsset = createApprovedAsset({
  assetId: createStableDiceBoxId("asset", "attestation-second"),
  role: "token",
  label: "Second attestation asset",
  locator: "assets/tokens/attestation-second.png",
  mimeType: "image/png",
  sha256: "1ea738ba4fb29d8fa1f57f42a3e70bbc4d12d3f0fe1644b1a1d0b0432beff8a5",
  byteLength: secondBytes.byteLength,
  provenance: "M248 fixture",
});

const manifest = createApprovedAssetManifest({
  manifestId: createStableDiceBoxId("manifest", "attestation"),
  assets: [firstAsset, secondAsset],
});

describe("no-write asset-byte attestation gate", () => {
  it("attests exact supplied bytes and blocks mismatches", async () => {
    const matching = await attestApprovedAssetBytes(firstAsset, firstBytes, { observedAt });
    expect(matching).toMatchObject({
      assetId: firstAsset.assetId,
      expectedSha256: firstAsset.sha256,
      observedSha256: firstAsset.sha256,
      expectedByteLength: firstBytes.byteLength,
      observedByteLength: firstBytes.byteLength,
      source: "provided-bytes",
      status: "attested",
      noWrite: true,
    });

    const mismatch = await attestApprovedAssetBytes(firstAsset, secondBytes, { observedAt });
    expect(mismatch.status).toBe("mismatch");
    expect(mismatch.noWrite).toBe(true);
  });

  it("supports an injected read-only fetch boundary and fails closed when it is unavailable", async () => {
    let requestedLocator = "";
    let requestedAssetId = "";
    const fetched = await attestApprovedAssetFromReadOnlyFetch(firstAsset, async (locator, assetId) => {
      requestedLocator = locator;
      requestedAssetId = assetId;
      return firstBytes.buffer;
    }, { observedAt });
    expect(fetched.status).toBe("attested");
    expect(fetched.source).toBe("read-only-fetch");
    expect(requestedLocator).toBe(firstAsset.locator);
    expect(requestedAssetId).toBe(firstAsset.assetId);

    const unavailable = await attestApprovedAssetFromReadOnlyFetch(secondAsset, async () => {
      throw new Error("fetch failure must not escape the boundary");
    }, { observedAt });
    expect(unavailable).toMatchObject({ status: "unavailable", source: "read-only-fetch", observedSha256: null, observedByteLength: null, noWrite: true });
  });

  it("releases dependent-document eligibility only for a complete exact gate", async () => {
    const firstAttestation = await attestApprovedAssetBytes(firstAsset, firstBytes, { observedAt });
    const secondAttestation = await attestApprovedAssetBytes(secondAsset, secondBytes, { observedAt });
    const ready = createAssetAttestationGate({
      manifest,
      requiredAssetIds: [secondAsset.assetId, firstAsset.assetId],
      dependentDocumentIds: ["dbx:tile:attested", "dbx:scene:attested"],
      attestations: [secondAttestation, firstAttestation],
      observedAt,
    });
    expect(ready.status).toBe("ready");
    expect(assertAssetAttestationForDependentDocuments(manifest, ready, ["dbx:scene:attested"])).toBe(true);
    expect(() => assertAssetAttestationForDependentDocuments(manifest, ready, ["dbx:journal:outside"])).toThrow(/outside the attested gate scope/);

    const blocked = createAssetAttestationGate({
      manifest,
      requiredAssetIds: [firstAsset.assetId, secondAsset.assetId],
      dependentDocumentIds: ["dbx:scene:blocked"],
      attestations: [firstAttestation],
      observedAt,
    });
    expect(blocked.status).toBe("blocked");
    expect(blocked.attestations.find((attestation) => attestation.assetId === secondAsset.assetId)?.status).toBe("missing");
    expect(() => assertAssetAttestationForDependentDocuments(manifest, blocked, ["dbx:scene:blocked"])).toThrow(/gate is blocked/);
  });

  it("is canonical and rejects duplicates, unknown assets, manifest drift, and malformed state", async () => {
    const firstAttestation = await attestApprovedAssetBytes(firstAsset, firstBytes, { observedAt });
    const secondAttestation = await attestApprovedAssetBytes(secondAsset, secondBytes, { observedAt });
    const first = createAssetAttestationGate({
      manifest,
      requiredAssetIds: [firstAsset.assetId, secondAsset.assetId],
      dependentDocumentIds: ["dbx:scene:canonical", "dbx:tile:canonical"],
      attestations: [firstAttestation, secondAttestation],
      observedAt,
    });
    const second = createAssetAttestationGate({
      manifest,
      requiredAssetIds: [secondAsset.assetId, firstAsset.assetId],
      dependentDocumentIds: ["dbx:tile:canonical", "dbx:scene:canonical"],
      attestations: [secondAttestation, firstAttestation],
      observedAt,
    });
    expect(serializeAssetAttestationGate(first)).toBe(serializeAssetAttestationGate(second));
    expect(validateAssetAttestationGate(manifest, first)).toEqual(first);

    expect(() => createAssetAttestationGate({
      manifest,
      requiredAssetIds: [firstAsset.assetId, firstAsset.assetId],
      dependentDocumentIds: [],
      observedAt,
    })).toThrow(/unique stable IDs/);
    expect(() => createAssetAttestationGate({
      manifest,
      requiredAssetIds: ["dbx:asset:unknown"],
      dependentDocumentIds: [],
      observedAt,
    })).toThrow(/not present in manifest/);

    const changedManifest = createApprovedAssetManifest({
      manifestId: manifest.manifestId,
      assets: [{ ...firstAsset, sha256: secondAsset.sha256, byteLength: secondAsset.byteLength }, secondAsset],
    });
    expect(() => validateAssetAttestationGate(changedManifest, first)).toThrow(/does not match the current approved manifest/);
    expect(() => validateAssetAttestationGate(manifest, {
      ...first,
      attestations: [{ ...first.attestations[0], execute: "foreign" }, ...first.attestations.slice(1)],
    })).toThrow();
  });
});
