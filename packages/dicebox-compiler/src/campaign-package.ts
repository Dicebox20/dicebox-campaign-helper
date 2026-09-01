import { z } from "zod";
import {
  ascendancyRegionwrightHandoffSchema,
  createAscendancyRegionwrightHandoff,
  createCurrentCampaignTest,
  createStableDiceBoxId,
  currentCampaignTestSchema,
} from "@dicebox/core";
import { createTramSceneProjectionPlan, tramSceneProjectionPlanSchema } from "./tram-scene-plan.js";
import { ascendancyRegionPlanSchema, createAscendancyRegionPlans } from "./ascendancy-region-plan.js";
import { createAscendancyMapBlueprints, validateAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import { spatialBlueprintSchema } from "./spatial-blueprint.js";
import { ascendancyStaticTilePlanSchema, createAscendancyStaticTilePlan } from "./ascendancy-static-tile-plan.js";

const campaignAssetSchema = z.object({
  assetId: z.string().min(1),
  roomId: z.string().min(1),
  status: z.enum(["scene-bound", "final-map-required"]),
  path: z.string().min(1).nullable(),
  renderer: z.literal("scene-background"),
  geometryOwner: z.literal("spatial-blueprint"),
}).strict();

export const campaignPackageSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  packageId: z.string().min(1),
  campaign: currentCampaignTestSchema,
  regionwrightHandoff: ascendancyRegionwrightHandoffSchema,
  tramSceneProjection: tramSceneProjectionPlanSchema,
  spatialBlueprints: z.array(spatialBlueprintSchema).length(4),
  regionPlans: z.array(ascendancyRegionPlanSchema).length(4),
  staticVisualTileProjection: ascendancyStaticTilePlanSchema,
  assets: z.object({
    bound: z.array(campaignAssetSchema).length(4),
    unbound: z.array(campaignAssetSchema).length(0),
  }).strict(),
  blockers: z.array(z.object({
    blockerId: z.string().min(1),
    status: z.literal("open"),
    reason: z.string().min(1),
    prevents: z.array(z.string().min(1)).min(1),
  }).strict()).min(2),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export type CampaignPackage = z.infer<typeof campaignPackageSchema>;

export function createCurrentCampaignPackage(): CampaignPackage {
  const campaign = createCurrentCampaignTest();
  const regionwrightHandoff = createAscendancyRegionwrightHandoff();
  const tramRoom = campaign.rooms.find((room) => room.roomId === createStableDiceBoxId("room", "ascendancy-tram-depot"));
  if (!tramRoom) throw new Error("Campaign fixture is missing the tram room.");
  const tramSceneProjection = createTramSceneProjectionPlan({
    scene: { id: createStableDiceBoxId("scene", "ascendancy-tram-depot"), kind: "scene" },
    backgroundAsset: { id: tramRoom.assetId, kind: "asset" },
  });
  const regionPlans = createAscendancyRegionPlans();
  const spatialBlueprints = createAscendancyMapBlueprints();
  const staticVisualTileProjection = createAscendancyStaticTilePlan();
  return campaignPackageSchema.parse({
    schemaVersion: "0.1.0",
    packageId: createStableDiceBoxId("package", "chauser-bill-prime-arachnid-aftermath"),
    campaign,
    regionwrightHandoff,
    tramSceneProjection,
    spatialBlueprints: validateAscendancyMapBlueprints(spatialBlueprints),
    regionPlans,
    staticVisualTileProjection,
    assets: {
      bound: [
        // v3 depicts open lanes and is intentionally withdrawn. The package
        // cannot be installed until a reviewed empty-track renderer is bound.
        { assetId: tramRoom.assetId, roomId: tramRoom.roomId, status: "final-map-required", path: null, renderer: "scene-background", geometryOwner: "spatial-blueprint" },
        { assetId: createStableDiceBoxId("asset", "map-signal-frequency-chamber"), roomId: createStableDiceBoxId("room", "signal-frequency-chamber"), status: "scene-bound", path: "assets/maps/ascendancy-signal-frequency-chamber-v2.png", renderer: "scene-background", geometryOwner: "spatial-blueprint" },
        { assetId: createStableDiceBoxId("asset", "map-rune-mechanism-chamber"), roomId: createStableDiceBoxId("room", "rune-mechanism-chamber"), status: "scene-bound", path: "assets/maps/ascendancy-rune-mechanism-chamber-v2.png", renderer: "scene-background", geometryOwner: "spatial-blueprint" },
        // The Core renderer lacks the newly frozen west rail entry. It cannot
        // be bound until its background is reviewed against the topology.
        { assetId: createStableDiceBoxId("asset", "map-central-core-control-chamber"), roomId: createStableDiceBoxId("room", "central-core-control-chamber"), status: "final-map-required", path: null, renderer: "scene-background", geometryOwner: "spatial-blueprint" },
      ],
      unbound: [],
    },
    blockers: [
      { blockerId: createStableDiceBoxId("blocker", "exact-foundry-runtime"), status: "open", reason: "The exact Foundry/D&D5e runtime, active-GM authority, native Region behavior, and authoritative reread have not been exercised for this package.", prevents: ["live-world-mutation", "ready-to-play-claim"] },
      { blockerId: createStableDiceBoxId("blocker", "regionwright-integration-receipt"), status: "open", reason: "The Region Editor task has not yet returned a target-bound receipt proving the four region plans, Regionwright entry hooks, teleports, and behavior bindings were connected in the intended world.", prevents: ["live-world-mutation", "ready-to-play-claim"] },
      { blockerId: createStableDiceBoxId("blocker", "reviewed-map-renderers"), status: "open", reason: "The Tram routing-yard and Core west-entry renderer backgrounds require review against the frozen Spatial Blueprint before any scene installation.", prevents: ["live-world-mutation", "ready-to-play-claim"] },
    ],
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateCampaignPackage(input: unknown): CampaignPackage {
  return campaignPackageSchema.parse(input);
}
