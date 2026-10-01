import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";
import {
  createSpatialProjectionPlan,
  spatialProjectionPlanSchema,
  type SpatialProjectionPlan,
} from "./spatial-projection-plan.js";
import {
  ascendancyRegionPlanSchema,
  createAscendancyRegionPlans,
  type AscendancyRegionPlan,
} from "./ascendancy-region-plan.js";
import {
  ascendancyStaticBackgroundObjectPreviewSchema,
  createAscendancyStaticBackgroundObjectPreview,
  type AscendancyStaticBackgroundObjectPreview,
} from "./ascendancy-static-tile-plan.js";
import {
  createAscendancyFurnishingPlanFixture,
} from "./ascendancy-furnishing-plan-fixture.js";
import {
  furnishingProjectionPlanSchema,
  type FurnishingProjectionPlan,
} from "./furnishing-projection-plan.js";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import type { SpatialBlueprint } from "./spatial-blueprint.js";

const coreSceneId = createStableDiceBoxId("scene", "central-core-control-chamber");
const coreBlueprintId = createStableDiceBoxId("blueprint", "central-core-control-chamber");
const coreRegionPlanId = createStableDiceBoxId("plan", "central-core-control-chamber-regions");
const coreSpatialPlanId = createStableDiceBoxId("plan", "m1066-central-core-spatial");

const authoritySchema = z.object({
  semanticScene: z.literal("renderer-neutral-scene-semantics"),
  spatial: z.literal("spatial-blueprint-owns-geometry"),
  regions: z.literal("region-plan-owns-region-and-teleport-intent"),
  backgroundObjects: z.literal("visual-workflow-projection"),
  furnishing: z.literal("m7-native-placeable-plan"),
  runtime: z.literal("not-modeled"),
}).strict();

export const ascendancySceneAuthoringFixtureSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  fixtureId: StableDiceBoxIdSchema,
  scene: z.object({
    sceneId: StableDiceBoxIdSchema,
    blueprintId: StableDiceBoxIdSchema,
    spatialPlanId: StableDiceBoxIdSchema,
    regionPlanId: StableDiceBoxIdSchema,
    furnishingPlanId: StableDiceBoxIdSchema,
  }).strict(),
  spatialProjection: spatialProjectionPlanSchema,
  regionPlan: ascendancyRegionPlanSchema,
  backgroundObjectPreview: ascendancyStaticBackgroundObjectPreviewSchema,
  backgroundObjectSceneIds: z.array(StableDiceBoxIdSchema).length(10),
  furnishingPlan: furnishingProjectionPlanSchema,
  authority: authoritySchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  if (value.scene.sceneId !== coreSceneId || value.scene.blueprintId !== coreBlueprintId) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["scene"], message: "M1066 must target the Central Core Scene and Blueprint." });
  }
  if (value.spatialProjection.scene.semantic.id !== value.scene.sceneId
    || value.spatialProjection.blueprint.blueprintId !== value.scene.blueprintId
    || value.spatialProjection.planId !== value.scene.spatialPlanId) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["spatialProjection"], message: "Spatial Projection identity must match the composed Scene fixture." });
  }
  if (value.regionPlan.sceneId !== value.scene.sceneId || value.regionPlan.planId !== value.scene.regionPlanId) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["regionPlan"], message: "Region plan identity must match the composed Scene fixture." });
  }
  if (value.furnishingPlan.sceneBinding.semantic.id !== value.scene.sceneId
    || value.furnishingPlan.blueprint.blueprintId !== value.scene.blueprintId
    || value.furnishingPlan.planId !== value.scene.furnishingPlanId) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["furnishingPlan"], message: "M7 furnishing identity must match the composed Scene fixture." });
  }
  const coreObjectIds = value.backgroundObjectPreview.objects
    .filter((object) => object.sceneId === value.scene.sceneId)
    .map((object) => object.sourceProjectionId);
  if (coreObjectIds.length !== 10 || JSON.stringify(coreObjectIds) !== JSON.stringify(value.backgroundObjectSceneIds)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["backgroundObjectSceneIds"], message: "Background Object IDs must be the ten deterministic Central Core projections." });
  }
  if (new Set(value.furnishingPlan.items.map((item) => item.kind)).size !== 6) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["furnishingPlan", "items"], message: "The composed M7 fixture must retain all six placeable kinds." });
  }
});

export type AscendancySceneAuthoringFixture = z.infer<typeof ascendancySceneAuthoringFixtureSchema>;

function centralCoreBlueprint(): SpatialBlueprint {
  const blueprint = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === coreBlueprintId);
  if (!blueprint) throw new Error("M1066 Central Core Blueprint is missing.");
  return blueprint;
}

function centralCoreRegionPlan(): AscendancyRegionPlan {
  const plan = createAscendancyRegionPlans().find((candidate) => candidate.planId === coreRegionPlanId);
  if (!plan) throw new Error("M1066 Central Core Region plan is missing.");
  return plan;
}

/**
 * Compose existing compiler plans for one Scene without merging their
 * authority or producing raw Foundry documents or an execution path.
 */
export function createAscendancyCentralCoreSceneAuthoringFixture(): AscendancySceneAuthoringFixture {
  const blueprint = centralCoreBlueprint();
  const regionPlan = centralCoreRegionPlan();
  const spatialProjection = createSpatialProjectionPlan({
    planId: coreSpatialPlanId,
    scene: { id: coreSceneId, kind: "scene" },
    blueprint,
  });
  const backgroundObjectPreview = createAscendancyStaticBackgroundObjectPreview();
  const backgroundObjectSceneIds = backgroundObjectPreview.objects
    .filter((object) => object.sceneId === coreSceneId)
    .map((object) => object.sourceProjectionId);
  const furnishingPlan = createAscendancyFurnishingPlanFixture();
  return ascendancySceneAuthoringFixtureSchema.parse({
    schemaVersion: "0.1.0",
    fixtureId: createStableDiceBoxId("fixture", "m1066-central-core-scene-authoring"),
    scene: {
      sceneId: coreSceneId,
      blueprintId: coreBlueprintId,
      spatialPlanId: spatialProjection.planId,
      regionPlanId: regionPlan.planId,
      furnishingPlanId: furnishingPlan.planId,
    },
    spatialProjection,
    regionPlan,
    backgroundObjectPreview,
    backgroundObjectSceneIds,
    furnishingPlan,
    authority: {
      semanticScene: "renderer-neutral-scene-semantics",
      spatial: "spatial-blueprint-owns-geometry",
      regions: "region-plan-owns-region-and-teleport-intent",
      backgroundObjects: "visual-workflow-projection",
      furnishing: "m7-native-placeable-plan",
      runtime: "not-modeled",
    },
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateAscendancySceneAuthoringFixture(input: unknown): AscendancySceneAuthoringFixture {
  return ascendancySceneAuthoringFixtureSchema.parse(input);
}
