import { z } from "zod";
import {
  createCapabilityRegistry,
  EvidenceReceiptSchema,
  RuntimeProfileSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  createStableDiceBoxId,
  type EvidenceReceipt,
  type CapabilityId,
  type RuntimeProfile,
  type SemanticRef,
} from "@dicebox/core";
import {
  spatialBlueprintSchema,
  type SpatialBlueprint,
} from "./spatial-blueprint.js";

/**
 * These are the only Foundry operation names a spatial plan may contain.
 * The plan is an intent/preview artifact; no function or raw Foundry data is
 * accepted here. Exact document field mapping remains an adapter concern.
 */
export const spatialFoundryApi = Object.freeze({
  sceneCreate: "Scene.create",
  sceneUpdate: "scene.update",
  sceneRead: "fromUuid | game.scenes.get",
  wallCreate: 'scene.createEmbeddedDocuments("Wall", ...)',
  regionCreate: 'scene.createEmbeddedDocuments("Region", ...)',
  sceneReread: "fromUuid | game.scenes.get",
  wallReread: "scene.walls",
  regionReread: "scene.regions",
  regionDocument: "RegionDocument",
} as const);

const spatialFoundryApiSchema = z.object({
  sceneCreate: z.literal("Scene.create"),
  sceneUpdate: z.literal("scene.update"),
  sceneRead: z.literal("fromUuid | game.scenes.get"),
  wallCreate: z.literal('scene.createEmbeddedDocuments("Wall", ...)'),
  regionCreate: z.literal('scene.createEmbeddedDocuments("Region", ...)'),
  sceneReread: z.literal("fromUuid | game.scenes.get"),
  wallReread: z.literal("scene.walls"),
  regionReread: z.literal("scene.regions"),
  regionDocument: z.literal("RegionDocument"),
}).strict();

const projectionStepSchema = z.object({
  stepId: StableDiceBoxIdSchema,
  order: z.number().int().positive(),
  kind: z.enum(["scene", "walls", "regions"]),
  api: z.enum([
    "Scene.create",
    'scene.createEmbeddedDocuments("Wall", ...)',
    'scene.createEmbeddedDocuments("Region", ...)',
  ]),
  sourceCount: z.number().int().nonnegative(),
}).strict();

const sceneTargetSchema = z.object({
  semantic: SemanticRefSchema,
  expectedBindingGeneration: z.literal(0),
}).strict().superRefine((value, context) => {
  if (value.semantic.kind !== "scene") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["semantic", "kind"],
      message: "A Spatial Projection Plan must target a Scene semantic reference.",
    });
  }
});

export const spatialProjectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  operation: z.literal("create"),
  scene: sceneTargetSchema,
  blueprint: spatialBlueprintSchema,
  steps: z.array(projectionStepSchema).length(3),
  anchorIntents: z.array(z.object({
    anchorId: StableDiceBoxIdSchema,
    kind: z.enum(["door", "entrance", "interaction", "spawn"]),
    levelId: StableDiceBoxIdSchema,
    x: z.number().finite(),
    y: z.number().finite(),
    clearance: z.number().finite().positive(),
    targetRegionId: StableDiceBoxIdSchema.optional(),
  }).strict()),
  foundryApi: spatialFoundryApiSchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  if (value.blueprint.blueprintId === value.scene.semantic.id) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scene", "semantic", "id"],
      message: "The Scene semantic ID must be distinct from the Blueprint ID.",
    });
  }
  const expected = [
    { kind: "scene" as const, api: spatialFoundryApi.sceneCreate, count: 1 },
    { kind: "walls" as const, api: spatialFoundryApi.wallCreate, count: value.blueprint.walls.length },
    { kind: "regions" as const, api: spatialFoundryApi.regionCreate, count: value.blueprint.regions.length },
  ];
  value.steps.forEach((step, index) => {
    const expectedStep = expected[index];
    if (!expectedStep) return;
    if (step.order !== index + 1 || step.kind !== expectedStep.kind
      || step.api !== expectedStep.api || step.sourceCount !== expectedStep.count) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["steps", index],
        message: "Projection steps must preserve the deterministic Scene → Wall → Region order.",
      });
    }
  });
});

export type SpatialProjectionPlan = z.infer<typeof spatialProjectionPlanSchema>;

export interface SpatialProjectionPlanReview {
  readonly status: "ready" | "blocked";
  readonly findings: readonly {
    readonly code: string;
    readonly severity: "blocker" | "warning";
    readonly message: string;
  }[];
  readonly checkedCapabilities: readonly string[];
  readonly checkedAuthority: "none" | "gm";
  readonly checkedRuntime: RuntimeProfile;
}

export interface SpatialProjectionPlanPreview {
  readonly plan: SpatialProjectionPlan;
  readonly review: SpatialProjectionPlanReview;
  readonly receipt: EvidenceReceipt;
}

function createStep(planId: string, localKey: string, order: number, kind: SpatialProjectionPlan["steps"][number]["kind"], api: SpatialProjectionPlan["steps"][number]["api"], sourceCount: number) {
  return {
    stepId: createStableDiceBoxId("step", `${planId.split(":").at(-1) ?? "spatial"}-${localKey}`),
    order,
    kind,
    api,
    sourceCount,
  };
}

export function createSpatialProjectionPlan(input: {
  readonly planId: SpatialProjectionPlan["planId"];
  readonly scene: SemanticRef;
  readonly blueprint: SpatialBlueprint;
}): SpatialProjectionPlan {
  const blueprint = spatialBlueprintSchema.parse(input.blueprint);
  return spatialProjectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: input.planId,
    operation: "create",
    scene: {
      semantic: input.scene,
      expectedBindingGeneration: 0,
    },
    blueprint,
    steps: [
      createStep(input.planId, "scene", 1, "scene", spatialFoundryApi.sceneCreate, 1),
      createStep(input.planId, "walls", 2, "walls", spatialFoundryApi.wallCreate, blueprint.walls.length),
      createStep(input.planId, "regions", 3, "regions", spatialFoundryApi.regionCreate, blueprint.regions.length),
    ],
    anchorIntents: blueprint.anchors.map((anchor) => ({
      anchorId: anchor.anchorId,
      kind: anchor.kind,
      levelId: anchor.levelId,
      x: anchor.position.x,
      y: anchor.position.y,
      clearance: anchor.clearance,
      ...(anchor.targetRegionId === undefined ? {} : { targetRegionId: anchor.targetRegionId }),
    })),
    foundryApi: spatialFoundryApi,
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateSpatialProjectionPlan(input: unknown): SpatialProjectionPlan {
  return spatialProjectionPlanSchema.parse(input);
}

function finding(code: string, severity: "blocker" | "warning", message: string) {
  return { code, severity, message } as const;
}

function createPreviewReceipt(plan: SpatialProjectionPlan, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${plan.planId.split(":").at(-1) ?? "spatial"}-preview`),
    operation: "spatial-plan.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [plan.scene.semantic],
    observedAt,
    notes: [
      "Preview only; no Scene.create, scene.update, or createEmbeddedDocuments call was attempted.",
      "Wall and Region payload mapping remains behind exact Foundry Scene/Region shape and permission probes.",
    ],
  });
}

export function previewSpatialProjectionPlan(
  input: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): SpatialProjectionPlanPreview {
  const plan = validateSpatialProjectionPlan(input);
  const parsedRuntime = RuntimeProfileSchema.parse(runtime);
  const authority = options.authority ?? "none";
  const registry = createCapabilityRegistry(parsedRuntime);
  const findings: ReturnType<typeof finding>[] = [];

  if (parsedRuntime.phase !== "ready") {
    findings.push(finding("RUNTIME_NOT_READY", "blocker", "The exact Foundry runtime has not reached the ready phase."));
  }
  if (parsedRuntime.foundryVersion !== TARGET_FOUNDRY_VERSION) {
    findings.push(finding("FOUNDRY_VERSION_MISMATCH", "blocker", `Expected Foundry ${TARGET_FOUNDRY_VERSION}.`));
  }
  if (parsedRuntime.systemId !== "dnd5e" || parsedRuntime.systemVersion !== TARGET_DND5E_VERSION) {
    findings.push(finding("SYSTEM_VERSION_MISMATCH", "blocker", `Expected dnd5e ${TARGET_DND5E_VERSION}.`));
  }

  const requiredCapabilities: CapabilityId[] = [
    "foundry.scene.read",
    "foundry.scene.write",
    "foundry.users.active-gm",
  ];
  if (plan.blueprint.regions.length > 0) {
    requiredCapabilities.push("foundry.region.read", "foundry.region.write");
  }
  for (const capabilityId of requiredCapabilities) {
    const support = registry.supports(capabilityId);
    if (support.state !== "available") {
      findings.push(finding(
        `${capabilityId.toUpperCase().replaceAll(".", "_")}_UNAVAILABLE`,
        "blocker",
        support.reason,
      ));
    }
  }
  if (authority !== "gm") {
    findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "Spatial projection requires an active authorized GM."));
  }

  return {
    plan,
    review: {
      status: findings.some((item) => item.severity === "blocker") ? "blocked" : "ready",
      findings,
      checkedCapabilities: [...requiredCapabilities],
      checkedAuthority: authority,
      checkedRuntime: parsedRuntime,
    },
    receipt: createPreviewReceipt(plan, authority, options.observedAt),
  };
}
