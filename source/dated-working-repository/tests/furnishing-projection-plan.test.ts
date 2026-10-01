import { describe, expect, it } from "vitest";
import {
  createApprovedAsset,
  createApprovedAssetManifest,
  createFurnishingProjectionPlan,
  previewFurnishingProjectionPlan,
  validateFurnishingProjectionPlan,
  createSpatialBlueprint,
  type FurnishingItemIntent,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T01:00:00.000Z";
const levelId = createStableDiceBoxId("level", "ground-furnishing");
const regionId = createStableDiceBoxId("region", "entry-furnishing");
const anchorId = createStableDiceBoxId("anchor", "spawn-furnishing");

function blueprint() {
  return createSpatialBlueprint({
    blueprintId: createStableDiceBoxId("blueprint", "furnishing-room"),
    name: "Furnishing Room",
    origin: { x: 0, y: 0 },
    bounds: { width: 20, height: 12 },
    grid: { size: 100, unitsPerCell: 5 },
    scale: { pixelsPerUnit: 20, unit: "feet" },
    levels: [{ levelId, label: "Ground", elevation: 0 }],
    walls: [],
    regions: [{
      regionId,
      label: "Entry",
      shapes: [{
        shapeId: createStableDiceBoxId("shape", "furnishing-entry"),
        kind: "rectangle",
        levelId,
        x: 1,
        y: 1,
        width: 6,
        height: 4,
      }],
    }],
    anchors: [{
      anchorId,
      kind: "spawn",
      levelId,
      position: { x: 3, y: 3 },
      clearance: 1,
      targetRegionId: regionId,
    }],
  });
}

const tileAsset = createApprovedAsset({
  assetId: createStableDiceBoxId("asset", "floor"),
  role: "texture",
  label: "Floor texture",
  locator: "assets/floor.png",
  mimeType: "image/png",
  sha256: "a".repeat(64),
  byteLength: 1200,
  width: 512,
  height: 512,
  provenance: "fixture floor source",
});
const tokenAsset = createApprovedAsset({
  assetId: createStableDiceBoxId("asset", "crate"),
  role: "token",
  label: "Crate token",
  locator: "assets/crate.png",
  mimeType: "image/png",
  sha256: "b".repeat(64),
  byteLength: 800,
  width: 128,
  height: 128,
  provenance: "fixture crate source",
});
const audioAsset = createApprovedAsset({
  assetId: createStableDiceBoxId("asset", "water"),
  role: "audio",
  label: "Water ambience",
  locator: "assets/water.ogg",
  mimeType: "audio/ogg",
  sha256: "c".repeat(64),
  byteLength: 3000,
  provenance: "fixture water source",
});

const manifest = createApprovedAssetManifest({
  manifestId: createStableDiceBoxId("manifest", "furnishing-assets"),
  assets: [tileAsset, tokenAsset, audioAsset],
});

const sceneBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("scene", "furnishing-room"), kind: "scene" },
  runtime: "foundry",
  documentType: "Scene",
  documentId: "scene-furnishing",
  uuid: "Scene.world.scene-furnishing",
  generation: 1,
};

function runtimeProfile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene", "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"],
    capabilities: [
      { id: "foundry.scene.read", state: "available", reason: "fixture" },
      { id: "foundry.scene.placeable.read", state: "available", reason: "fixture" },
      { id: "foundry.scene.placeable.write", state: "available", reason: "fixture" },
      { id: "foundry.media.deploy", state: "available", reason: "fixture" },
      { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
    ],
    ...overrides,
  };
}

function planItems(): FurnishingItemIntent[] {
  return [
    {
      furnishingId: createStableDiceBoxId("furnishing", "floor"),
      label: "Floor",
      kind: "tile",
      levelId,
      position: { x: 1, y: 1 },
      footprint: { width: 18, height: 10, clearance: 1 },
      assetRef: { assetId: tileAsset.assetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", "crate"),
      label: "Crate",
      kind: "token",
      levelId,
      position: { x: 5, y: 5 },
      footprint: { width: 1, height: 1, clearance: 0.5 },
      anchorId,
      assetRef: { assetId: tokenAsset.assetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", "lamp"),
      label: "Lamp",
      kind: "ambientLight",
      levelId,
      position: { x: 8, y: 5 },
      footprint: { width: 1, height: 1, clearance: 0.5 },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", "water"),
      label: "Water",
      kind: "ambientSound",
      levelId,
      position: { x: 10, y: 5 },
      footprint: { width: 2, height: 2, clearance: 0.5 },
      targetRegionId: regionId,
      assetRef: { assetId: audioAsset.assetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", "sketch"),
      label: "GM sketch",
      kind: "drawing",
      levelId,
      position: { x: 12, y: 5 },
      footprint: { width: 2, height: 1, clearance: 0.5 },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", "note"),
      label: "Map note",
      kind: "note",
      levelId,
      position: { x: 15, y: 5 },
      footprint: { width: 1, height: 1, clearance: 0.5 },
    },
  ];
}

describe("geometry-preserving furnishing projection plan", () => {
  it("resolves approved asset identities and emits official embedded API steps", () => {
    const plan = createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "furnishing-room"),
      sceneBinding,
      blueprint: blueprint(),
      assetManifest: manifest,
      items: planItems(),
      relations: [{
        relationId: createStableDiceBoxId("relation", "crate-spawn"),
        kind: "near-anchor",
        fromFurnishingId: createStableDiceBoxId("furnishing", "crate"),
        anchorId,
        maxDistance: 5,
      }, {
        relationId: createStableDiceBoxId("relation", "water-entry"),
        kind: "inside-region",
        fromFurnishingId: createStableDiceBoxId("furnishing", "water"),
        regionId,
      }],
    });

    expect(plan.items.map((item) => item.kind)).toEqual([
      "tile", "token", "ambientLight", "ambientSound", "drawing", "note",
    ]);
    expect(plan.items[0]?.asset).toMatchObject({ assetId: tileAsset.assetId, role: "texture", sha256: "a".repeat(64) });
    expect(plan.items[0]).not.toHaveProperty("asset.locator");
    expect(plan.steps.map((step) => step.api)).toEqual([
      'scene.createEmbeddedDocuments("Tile", ...)',
      'scene.createEmbeddedDocuments("Token", ...)',
      'scene.createEmbeddedDocuments("AmbientLight", ...)',
      'scene.createEmbeddedDocuments("AmbientSound", ...)',
      'scene.createEmbeddedDocuments("Drawing", ...)',
      'scene.createEmbeddedDocuments("Note", ...)',
    ]);
    expect(plan.foundryApi.embeddedReread).toBe("scene.getEmbeddedCollection");
    expect(plan.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(validateFurnishingProjectionPlan(plan)).toEqual(plan);
  });

  it("preserves blueprint geometry while rejecting out-of-bounds footprints and invalid references", () => {
    const source = blueprint();
    const original = JSON.stringify(source);
    expect(() => createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "bad-footprint"),
      sceneBinding,
      blueprint: source,
      assetManifest: manifest,
      items: [{
        ...planItems()[1]!,
        position: { x: 19.5, y: 5 },
        footprint: { width: 2, height: 1, clearance: 1 },
      }],
    })).toThrow(/bounds/);
    expect(() => createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "bad-reference"),
      sceneBinding,
      blueprint: source,
      assetManifest: manifest,
      items: [{
        ...planItems()[1]!,
        anchorId: createStableDiceBoxId("anchor", "missing"),
      }],
    })).toThrow(/anchorId/);
    expect(JSON.stringify(source)).toBe(original);
  });

  it("requires role-compatible approved assets and rejects locators or raw Foundry fields", () => {
    const badRole = { ...planItems()[1]!, assetRef: { assetId: tileAsset.assetId } };
    expect(() => createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "bad-role"),
      sceneBinding,
      blueprint: blueprint(),
      assetManifest: manifest,
      items: [badRole],
    })).toThrow(/approved token/);

    const plan = createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "strict-fields"),
      sceneBinding,
      blueprint: blueprint(),
      assetManifest: manifest,
      items: [planItems()[1]!],
    });
    expect(() => validateFurnishingProjectionPlan({ ...plan, foundryPayload: { locator: "assets/crate.png" } })).toThrow();
  });

  it("previews only with exact placeable/media capabilities and GM authority", () => {
    const plan = createFurnishingProjectionPlan({
      planId: createStableDiceBoxId("plan", "furnishing-preview"),
      sceneBinding,
      blueprint: blueprint(),
      assetManifest: manifest,
      items: [planItems()[1]!],
    });
    const ready = previewFurnishingProjectionPlan(plan, runtimeProfile(), { authority: "gm", observedAt });
    expect(ready.review.status).toBe("ready");
    expect(ready.review.findings).toEqual([]);
    expect(ready.receipt).toMatchObject({ operation: "furnishing-plan.preview", status: "previewed", authority: "gm" });
    expect(ready.receipt.notes.join(" ")).toContain("no Scene embedded-document");

    const blocked = previewFurnishingProjectionPlan(plan, runtimeProfile({
      capabilities: [
        { id: "foundry.scene.read", state: "available", reason: "read" },
        { id: "foundry.scene.placeable.read", state: "unknown", reason: "placeable probe pending" },
        { id: "foundry.scene.placeable.write", state: "unavailable", reason: "write disabled" },
        { id: "foundry.media.deploy", state: "unavailable", reason: "deployment disabled" },
        { id: "foundry.users.active-gm", state: "available", reason: "fixture" },
      ],
    }), { authority: "none", observedAt });
    expect(blocked.review.status).toBe("blocked");
    expect(blocked.review.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining([
      "FOUNDRY_SCENE_PLACEABLE_READ_UNAVAILABLE",
      "FOUNDRY_SCENE_PLACEABLE_WRITE_UNAVAILABLE",
      "FOUNDRY_MEDIA_DEPLOY_UNAVAILABLE",
      "GM_AUTHORITY_REQUIRED",
    ]));
  });
});
