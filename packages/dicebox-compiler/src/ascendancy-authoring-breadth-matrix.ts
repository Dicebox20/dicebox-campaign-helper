import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId, type StableDiceBoxId } from "@dicebox/core";
import {
  createSpatialProjectionPlan,
  type SpatialProjectionPlan,
} from "./spatial-projection-plan.js";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import { createAscendancyRegionPlans } from "./ascendancy-region-plan.js";
import { createAscendancyStaticBackgroundObjectPreview } from "./ascendancy-static-tile-plan.js";
import { createAscendancyCentralCoreSceneAuthoringFixture } from "./ascendancy-scene-authoring-fixture.js";
import {
  createAscendancyRuneFurnishingPlanFixture,
  createAscendancySignalFurnishingPlanFixture,
  createAscendancyTramFurnishingPlanFixture,
} from "./ascendancy-furnishing-plan-fixture.js";

const coverageStatusSchema = z.enum(["COMPOSED", "PARTIAL"]);
const blockerSchema = z.enum(["m7-furnishing-plan-missing"]);

const authoritySchema = z.object({
  semanticScene: z.literal("renderer-neutral-scene-semantics"),
  spatial: z.literal("spatial-blueprint-owns-geometry"),
  regions: z.literal("region-plan-owns-region-and-teleport-intent"),
  backgroundObjects: z.literal("visual-workflow-projection"),
  furnishing: z.literal("m7-native-placeable-plan"),
  runtime: z.literal("not-modeled"),
}).strict();

const sceneRowSchema = z.object({
  sceneId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema,
  spatialPlanId: StableDiceBoxIdSchema,
  regionPlanId: StableDiceBoxIdSchema,
  spatialProjectionSourceCounts: z.tuple([
    z.number().int().nonnegative(),
    z.number().int().nonnegative(),
    z.number().int().nonnegative(),
  ]),
  wallCount: z.number().int().nonnegative(),
  anchorCount: z.number().int().nonnegative(),
  regionCount: z.number().int().nonnegative(),
  teleportCount: z.number().int().nonnegative(),
  backgroundObjectCount: z.number().int().nonnegative(),
  furnishingPlanId: StableDiceBoxIdSchema.nullable(),
  m7ItemCount: z.number().int().nonnegative(),
  m7StepCount: z.number().int().nonnegative(),
  status: coverageStatusSchema,
  blockers: z.array(blockerSchema),
}).strict().superRefine((value, context) => {
  const sceneSuffix = value.sceneId.split(":").at(-1);
  const blueprintSuffix = value.blueprintId.split(":").at(-1);
  if (sceneSuffix === undefined || sceneSuffix !== blueprintSuffix) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["blueprintId"], message: "Scene and Blueprint stable IDs must share the same local key." });
  }
  if (value.status === "COMPOSED" && value.blockers.length > 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["blockers"], message: "A composed row cannot carry missing-plan blockers." });
  }
  if (value.status === "PARTIAL" && value.blockers.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["blockers"], message: "A partial row must state its blocker." });
  }
  if (value.furnishingPlanId === null && (value.m7ItemCount !== 0 || value.m7StepCount !== 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["furnishingPlanId"], message: "Missing furnishing plans cannot report M7 items or steps." });
  }
  if (value.furnishingPlanId !== null && (value.m7ItemCount === 0 || value.m7StepCount === 0)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["m7ItemCount"], message: "A furnishing plan must report its M7 items and steps." });
  }
});

export const ascendancyAuthoringBreadthMatrixSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  matrixId: StableDiceBoxIdSchema,
  evidenceClass: z.literal("local"),
  scenes: z.array(sceneRowSchema).length(4),
  authority: authoritySchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  runtimeState: z.literal("not-modeled"),
}).strict().superRefine((value, context) => {
  const sceneIds = new Set<string>();
  const blueprintIds = new Set<string>();
  value.scenes.forEach((row, index) => {
    if (sceneIds.has(row.sceneId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "sceneId"], message: "Scene IDs must be unique in the breadth matrix." });
    if (blueprintIds.has(row.blueprintId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["scenes", index, "blueprintId"], message: "Blueprint IDs must be unique in the breadth matrix." });
    sceneIds.add(row.sceneId);
    blueprintIds.add(row.blueprintId);
  });
});

export type AscendancyAuthoringBreadthMatrix = z.infer<typeof ascendancyAuthoringBreadthMatrixSchema>;

const matrixAuthority = {
  semanticScene: "renderer-neutral-scene-semantics" as const,
  spatial: "spatial-blueprint-owns-geometry" as const,
  regions: "region-plan-owns-region-and-teleport-intent" as const,
  backgroundObjects: "visual-workflow-projection" as const,
  furnishing: "m7-native-placeable-plan" as const,
  runtime: "not-modeled" as const,
};

function spatialPlanFor(sceneId: StableDiceBoxId, suffix: string, blueprint: Parameters<typeof createSpatialProjectionPlan>[0]["blueprint"]): SpatialProjectionPlan {
  return createSpatialProjectionPlan({
    planId: createStableDiceBoxId("plan", `m1068-${suffix}-spatial`),
    scene: { id: sceneId, kind: "scene" },
    blueprint,
  });
}

function expectedRows(): AscendancyAuthoringBreadthMatrix["scenes"] {
  const blueprints = createAscendancyMapBlueprints();
  const regionPlans = createAscendancyRegionPlans();
  const backgroundObjects = createAscendancyStaticBackgroundObjectPreview();
  const centralCore = createAscendancyCentralCoreSceneAuthoringFixture();
  const signal = createAscendancySignalFurnishingPlanFixture();
  const rune = createAscendancyRuneFurnishingPlanFixture();
  const tram = createAscendancyTramFurnishingPlanFixture();

  return blueprints.map((blueprint) => {
    const suffix = blueprint.blueprintId.split(":").at(-1);
    if (!suffix) throw new Error("M1068 Blueprint stable ID is missing its local key.");
    const sceneId = createStableDiceBoxId("scene", suffix);
    const regionPlan = regionPlans.find((candidate) => candidate.sceneId === sceneId);
    if (!regionPlan) throw new Error(`M1068 Region plan is missing for ${sceneId}.`);
    const spatialProjection = spatialPlanFor(sceneId, suffix, blueprint);
    const sceneBackgroundObjects = backgroundObjects.objects.filter((object) => object.sceneId === sceneId);
    const furnishingPlan = sceneId === centralCore.scene.sceneId
      ? centralCore.furnishingPlan
      : sceneId === signal.sceneBinding.semantic.id ? signal
        : sceneId === rune.sceneBinding.semantic.id ? rune
          : sceneId === tram.sceneBinding.semantic.id ? tram : null;
    return {
      sceneId,
      blueprintId: blueprint.blueprintId,
      spatialPlanId: spatialProjection.planId,
      regionPlanId: regionPlan.planId,
      spatialProjectionSourceCounts: spatialProjection.steps.map((step) => step.sourceCount) as [number, number, number],
      wallCount: blueprint.walls.length,
      anchorCount: blueprint.anchors.length,
      regionCount: regionPlan.regions.length,
      teleportCount: regionPlan.teleports.length,
      backgroundObjectCount: sceneBackgroundObjects.length,
      furnishingPlanId: furnishingPlan?.planId ?? null,
      m7ItemCount: furnishingPlan?.items.length ?? 0,
      m7StepCount: furnishingPlan?.steps.length ?? 0,
      status: furnishingPlan ? "COMPOSED" as const : "PARTIAL" as const,
      blockers: furnishingPlan ? [] : ["m7-furnishing-plan-missing" as const],
    };
  });
}

function expectedMatrixScenes(input: AscendancyAuthoringBreadthMatrix["scenes"]): void {
  const expected = expectedRows();
  if (JSON.stringify(input) !== JSON.stringify(expected)) {
    throw new Error("M1068 authoring-breadth matrix drifted from the existing four-Scene compiler sources.");
  }
}

/**
 * Report compiler-owned authoring breadth without inventing plans for Scenes
 * whose M7 furnishing evidence does not exist. This is evidence only: it
 * exposes no raw Foundry documents, native operation, or execution path.
 */
export function createAscendancyAuthoringBreadthMatrix(): AscendancyAuthoringBreadthMatrix {
  return validateAscendancyAuthoringBreadthMatrix({
    schemaVersion: "0.1.0",
    matrixId: createStableDiceBoxId("matrix", "m1068-campaign-authoring-breadth"),
    evidenceClass: "local",
    scenes: expectedRows(),
    authority: matrixAuthority,
    mutation: "disabled-until-exact-runtime-gate",
    runtimeState: "not-modeled",
  });
}

export function validateAscendancyAuthoringBreadthMatrix(input: unknown): AscendancyAuthoringBreadthMatrix {
  const matrix = ascendancyAuthoringBreadthMatrixSchema.parse(input);
  expectedMatrixScenes(matrix.scenes);
  return matrix;
}
