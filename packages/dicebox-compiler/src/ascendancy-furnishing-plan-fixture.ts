import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";
import { createApprovedAsset, createApprovedAssetManifest } from "./media-registry.js";
import {
  createFurnishingProjectionPlan,
  validateFurnishingProjectionPlan,
  type FurnishingItemIntent,
  type FurnishingProjectionPlan,
} from "./furnishing-projection-plan.js";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";

type FurnishingFixtureProfile = Readonly<{
  milestone: "M1064" | "M1070" | "M1074" | "M1078";
  localKey: string;
  sceneKey: string;
  anchorKey: string;
  documentId: string;
  planKey: string;
}>;

const centralCoreProfile: FurnishingFixtureProfile = {
  milestone: "M1064",
  localKey: "m1064",
  sceneKey: "central-core-control-chamber",
  anchorKey: "core-aleister-station",
  documentId: "m1064-central-core-control-chamber",
  planKey: "m1064-ascendancy-furnishing-fixture",
};

const signalProfile: FurnishingFixtureProfile = {
  milestone: "M1070",
  localKey: "m1070-signal",
  sceneKey: "signal-frequency-chamber",
  anchorKey: "signal-aleister-frequency",
  documentId: "m1070-signal-frequency-chamber",
  planKey: "m1070-signal-furnishing-fixture",
};

const runeProfile: FurnishingFixtureProfile = {
  milestone: "M1074",
  localKey: "m1074-rune",
  sceneKey: "rune-mechanism-chamber",
  anchorKey: "rune-lawson-memory",
  documentId: "m1074-rune-mechanism-chamber",
  planKey: "m1074-rune-furnishing-fixture",
};

const tramProfile: FurnishingFixtureProfile = {
  milestone: "M1078",
  localKey: "m1078-tram",
  sceneKey: "ascendancy-tram-depot",
  anchorKey: "tram-dalton-repair",
  documentId: "m1078-ascendancy-tram-depot",
  planKey: "m1078-tram-furnishing-fixture",
};

function fixtureAssets(profile: FurnishingFixtureProfile) {
  return createApprovedAssetManifest({
    manifestId: createStableDiceBoxId("manifest", `ascendancy-${profile.localKey}-furnishing-fixture`),
    assets: [
      createApprovedAsset({
        assetId: createStableDiceBoxId("asset", `${profile.localKey}-furnishing-texture`),
        role: "texture",
        label: `${profile.milestone} fixture texture`,
        locator: `fixture://${profile.localKey}/texture.png`,
        mimeType: "image/png",
        sha256: "d".repeat(64),
        byteLength: 1024,
        width: 512,
        height: 512,
        provenance: `${profile.milestone} deterministic compiler fixture only`,
      }),
      createApprovedAsset({
        assetId: createStableDiceBoxId("asset", `${profile.localKey}-furnishing-token`),
        role: "token",
        label: `${profile.milestone} fixture token`,
        locator: `fixture://${profile.localKey}/token.png`,
        mimeType: "image/png",
        sha256: "e".repeat(64),
        byteLength: 512,
        width: 128,
        height: 128,
        provenance: `${profile.milestone} deterministic compiler fixture only`,
      }),
      createApprovedAsset({
        assetId: createStableDiceBoxId("asset", `${profile.localKey}-furnishing-audio`),
        role: "audio",
        label: `${profile.milestone} fixture ambience`,
        locator: `fixture://${profile.localKey}/ambience.ogg`,
        mimeType: "audio/ogg",
        sha256: "f".repeat(64),
        byteLength: 2048,
        provenance: `${profile.milestone} deterministic compiler fixture only`,
      }),
    ],
  });
}

function fixtureSceneBinding(profile: FurnishingFixtureProfile): RuntimeBinding {
  return {
    semantic: { id: createStableDiceBoxId("scene", profile.sceneKey), kind: "scene" },
    runtime: "foundry",
    documentType: "Scene",
    documentId: profile.documentId,
    uuid: `Scene.${profile.documentId}`,
    generation: 1,
  };
}

function createFurnishingPlanFixture(profile: FurnishingFixtureProfile): FurnishingProjectionPlan {
  const sceneId = createStableDiceBoxId("scene", profile.sceneKey);
  const blueprintId = createStableDiceBoxId("blueprint", profile.sceneKey);
  const levelId = createStableDiceBoxId("level", "ascendancy-ground");
  const anchorId = createStableDiceBoxId("anchor", profile.anchorKey);
  const blueprint = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === blueprintId);
  if (!blueprint) throw new Error(`${profile.milestone} fixture Blueprint is missing.`);
  const level = blueprint.levels.find((candidate) => candidate.levelId === levelId);
  const anchor = blueprint.anchors.find((candidate) => candidate.anchorId === anchorId);
  if (!level || !anchor) throw new Error(`${profile.milestone} fixture level or anchor is missing.`);

  const assets = fixtureAssets(profile);
  const textureAssetId = createStableDiceBoxId("asset", `${profile.localKey}-furnishing-texture`);
  const tokenAssetId = createStableDiceBoxId("asset", `${profile.localKey}-furnishing-token`);
  const audioAssetId = createStableDiceBoxId("asset", `${profile.localKey}-furnishing-audio`);
  const items: FurnishingItemIntent[] = [
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-floor`),
      label: `${profile.milestone} fixture floor`,
      kind: "tile",
      levelId: level.levelId,
      position: { x: 96, y: 96 },
      footprint: { width: 512, height: 256, clearance: 8 },
      assetRef: { assetId: textureAssetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-station-token`),
      label: `${profile.milestone} fixture station token`,
      kind: "token",
      levelId: level.levelId,
      position: { x: anchor.position.x, y: anchor.position.y },
      footprint: { width: 64, height: 64, clearance: 8 },
      anchorId: anchor.anchorId,
      assetRef: { assetId: tokenAssetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-lamp`),
      label: `${profile.milestone} fixture lamp`,
      kind: "ambientLight",
      levelId: level.levelId,
      position: { x: 600, y: 300 },
      footprint: { width: 64, height: 64, clearance: 8 },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-ambience`),
      label: `${profile.milestone} fixture ambience`,
      kind: "ambientSound",
      levelId: level.levelId,
      position: { x: 800, y: 300 },
      footprint: { width: 96, height: 96, clearance: 8 },
      assetRef: { assetId: audioAssetId },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-drawing`),
      label: `${profile.milestone} fixture drawing`,
      kind: "drawing",
      levelId: level.levelId,
      position: { x: 600, y: 600 },
      footprint: { width: 128, height: 64, clearance: 8 },
    },
    {
      furnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-note`),
      label: `${profile.milestone} fixture note`,
      kind: "note",
      levelId: level.levelId,
      position: { x: 960, y: 600 },
      footprint: { width: 64, height: 64, clearance: 8 },
    },
  ];

  return createFurnishingProjectionPlan({
    planId: createStableDiceBoxId("plan", profile.planKey),
    sceneBinding: fixtureSceneBinding(profile),
    blueprint,
    assetManifest: assets,
    items,
    relations: [{
      relationId: createStableDiceBoxId("relation", `${profile.localKey}-station-anchor`),
      kind: "near-anchor",
      fromFurnishingId: createStableDiceBoxId("furnishing", `${profile.localKey}-station-token`),
      anchorId: anchor.anchorId,
      maxDistance: 1,
    }],
  });
}

/** Build the existing Central Core M7 compiler-only fixture. */
export function createAscendancyFurnishingPlanFixture(): FurnishingProjectionPlan {
  return createFurnishingPlanFixture(centralCoreProfile);
}

/** Build the M1070 Signal M7 compiler-only fixture. */
export function createAscendancySignalFurnishingPlanFixture(): FurnishingProjectionPlan {
  return validateAscendancySignalFurnishingPlanFixture(createFurnishingPlanFixture(signalProfile));
}

/** Build the M1074 Rune M7 compiler-only fixture. */
export function createAscendancyRuneFurnishingPlanFixture(): FurnishingProjectionPlan {
  return validateAscendancyRuneFurnishingPlanFixture(createFurnishingPlanFixture(runeProfile));
}

/** Build the M1078 Tram M7 compiler-only fixture. */
export function createAscendancyTramFurnishingPlanFixture(): FurnishingProjectionPlan {
  return validateAscendancyTramFurnishingPlanFixture(createFurnishingPlanFixture(tramProfile));
}

function validateFixturePlan(input: unknown, profile: FurnishingFixtureProfile): FurnishingProjectionPlan {
  const plan = validateFurnishingProjectionPlan(input);
  const expectedSceneId = createStableDiceBoxId("scene", profile.sceneKey);
  const expectedBlueprintId = createStableDiceBoxId("blueprint", profile.sceneKey);
  const expectedPlanId = createStableDiceBoxId("plan", profile.planKey);
  const expectedAnchorId = createStableDiceBoxId("anchor", profile.anchorKey);
  const sourceBlueprint = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === expectedBlueprintId);
  if (!sourceBlueprint
    || plan.sceneBinding.semantic.id !== expectedSceneId
    || plan.sceneBinding.documentId !== profile.documentId
    || plan.sceneBinding.uuid !== `Scene.${profile.documentId}`
    || plan.planId !== expectedPlanId
    || plan.blueprint.blueprintId !== expectedBlueprintId
    || JSON.stringify(plan.blueprint) !== JSON.stringify(sourceBlueprint)
    || JSON.stringify(plan.items.map((item) => item.kind)) !== JSON.stringify(["tile", "token", "ambientLight", "ambientSound", "drawing", "note"])
    || plan.relations.length !== 1
    || plan.relations[0]?.kind !== "near-anchor"
    || plan.relations[0]?.anchorId !== expectedAnchorId
    || plan.mutation !== "disabled-until-exact-runtime-gate") {
    throw new Error(`${profile.milestone} furnishing fixture identity or authority drifted.`);
  }
  return plan;
}

export function validateAscendancySignalFurnishingPlanFixture(input: unknown): FurnishingProjectionPlan {
  return validateFixturePlan(input, signalProfile);
}

export function validateAscendancyRuneFurnishingPlanFixture(input: unknown): FurnishingProjectionPlan {
  return validateFixturePlan(input, runeProfile);
}

export function validateAscendancyTramFurnishingPlanFixture(input: unknown): FurnishingProjectionPlan {
  return validateFixturePlan(input, tramProfile);
}
