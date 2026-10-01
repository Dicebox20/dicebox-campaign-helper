import { describe, expect, it } from "vitest";
import {
  createApprovedAsset,
  createApprovedAssetManifest,
  validateApprovedAssetManifest,
} from "@dicebox/compiler";
import { createStableDiceBoxId } from "@dicebox/core";

const sha = "a".repeat(64);
const variantSha = "b".repeat(64);

function asset() {
  return createApprovedAsset({
    assetId: createStableDiceBoxId("asset", "map-background"),
    role: "background",
    label: "Approved map background",
    locator: "assets/maps/approved-background.webp",
    mimeType: "image/webp",
    sha256: sha,
    byteLength: 1024,
    width: 2048,
    height: 1024,
    provenance: "SRC-ASSET-REVIEW-001",
    variants: [{
      variantId: createStableDiceBoxId("asset-variant", "map-background-small"),
      label: "Small variant",
      locator: "assets/maps/approved-background-small.webp",
      mimeType: "image/webp",
      sha256: variantSha,
      byteLength: 512,
      width: 1024,
      height: 512,
    }],
  });
}

describe("approved media registry", () => {
  it("records immutable hash, provenance, role, and approved variants", () => {
    const record = asset();
    const manifest = createApprovedAssetManifest({
      manifestId: createStableDiceBoxId("manifest", "assets"),
      assets: [record],
    });

    expect(manifest.assets[0]?.sha256).toBe(sha);
    expect(manifest.assets[0]?.approval).toBe("approved");
    expect(manifest.assets[0]?.variants[0]?.sha256).toBe(variantSha);
    expect(validateApprovedAssetManifest(manifest)).toEqual(manifest);
  });

  it("requires a valid SHA-256 hash and explicit approved construction", () => {
    expect(() => createApprovedAsset({
      assetId: createStableDiceBoxId("asset", "invalid-hash"),
      role: "token",
      label: "Invalid",
      locator: "assets/token.png",
      mimeType: "image/png",
      sha256: "not-a-hash",
      byteLength: 10,
      provenance: "review",
    })).toThrow();

    expect(() => validateApprovedAssetManifest({
      schemaVersion: "0.1.0",
      manifestId: createStableDiceBoxId("manifest", "unapproved"),
      assets: [{
        ...asset(),
        approval: "pending",
      }],
    })).toThrow();
  });

  it("rejects duplicate asset or variant identities", () => {
    const first = asset();
    expect(() => createApprovedAssetManifest({
      manifestId: createStableDiceBoxId("manifest", "duplicate-assets"),
      assets: [first, { ...first }],
    })).toThrow(/unique/);

    expect(() => validateApprovedAssetManifest({
      schemaVersion: "0.1.0",
      manifestId: createStableDiceBoxId("manifest", "duplicate-variants"),
      assets: [{
        ...first,
        variants: [first.variants[0], first.variants[0]],
      }],
    })).toThrow(/unique/);
  });

  it("rejects arbitrary fields and a variant that aliases its parent", () => {
    const first = asset();
    expect(() => validateApprovedAssetManifest({
      schemaVersion: "0.1.0",
      manifestId: createStableDiceBoxId("manifest", "unsafe"),
      assets: [{ ...first, execute: "new Function('return true')" }],
    })).toThrow();

    expect(() => validateApprovedAssetManifest({
      schemaVersion: "0.1.0",
      manifestId: createStableDiceBoxId("manifest", "alias"),
      assets: [{
        ...first,
        variants: [{ ...first.variants[0], variantId: first.assetId }],
      }],
    })).toThrow(/distinct/);
  });
});
