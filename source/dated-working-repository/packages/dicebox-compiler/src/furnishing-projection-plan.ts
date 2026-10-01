import { z } from "zod";
import {
  createCapabilityRegistry,
  EvidenceReceiptSchema,
  RuntimeBindingSchema,
  RuntimeProfileSchema,
  StableDiceBoxIdSchema,
  TARGET_DND5E_VERSION,
  TARGET_FOUNDRY_VERSION,
  createStableDiceBoxId,
  type CapabilityId,
  type EvidenceReceipt,
  type RuntimeBinding,
  type RuntimeProfile,
} from "@dicebox/core";
import {
  approvedAssetManifestSchema,
  type ApprovedAssetManifest,
} from "./media-registry.js";
import {
  spatialBlueprintSchema,
  type SpatialBlueprint,
} from "./spatial-blueprint.js";

/**
 * M7 is a plan and preview boundary. It contains semantic furnishing intent
 * and approved asset identities, never runtime file paths or raw Foundry
 * document data. The later adapter must call these exact Scene APIs.
 */
export const furnishingFoundryApi = Object.freeze({
  sceneRead: "fromUuid | game.scenes.get",
  tileCreate: 'scene.createEmbeddedDocuments("Tile", ...)',
  tokenCreate: 'scene.createEmbeddedDocuments("Token", ...)',
  ambientLightCreate: 'scene.createEmbeddedDocuments("AmbientLight", ...)',
  ambientSoundCreate: 'scene.createEmbeddedDocuments("AmbientSound", ...)',
  drawingCreate: 'scene.createEmbeddedDocuments("Drawing", ...)',
  noteCreate: 'scene.createEmbeddedDocuments("Note", ...)',
  sceneReread: "fromUuid | game.scenes.get",
  embeddedReread: "scene.getEmbeddedCollection",
} as const);

const furnishingFoundryApiSchema = z.object({
  sceneRead: z.literal("fromUuid | game.scenes.get"),
  tileCreate: z.literal('scene.createEmbeddedDocuments("Tile", ...)'),
  tokenCreate: z.literal('scene.createEmbeddedDocuments("Token", ...)'),
  ambientLightCreate: z.literal('scene.createEmbeddedDocuments("AmbientLight", ...)'),
  ambientSoundCreate: z.literal('scene.createEmbeddedDocuments("AmbientSound", ...)'),
  drawingCreate: z.literal('scene.createEmbeddedDocuments("Drawing", ...)'),
  noteCreate: z.literal('scene.createEmbeddedDocuments("Note", ...)'),
  sceneReread: z.literal("fromUuid | game.scenes.get"),
  embeddedReread: z.literal("scene.getEmbeddedCollection"),
}).strict();

const sceneBindingSchema = RuntimeBindingSchema.superRefine((value, context) => {
  if (value.documentType !== "Scene" || value.semantic.kind !== "scene") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["documentType"],
      message: "M7 furnishing plans require a known Scene runtime binding.",
    });
  }
  if (value.generation < 1) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["generation"],
      message: "Furnishing projection requires an existing Scene binding generation.",
    });
  }
});

const assetRefSchema = z.object({
  assetId: StableDiceBoxIdSchema,
  variantId: StableDiceBoxIdSchema.optional(),
}).strict();

const resolvedAssetSchema = z.object({
  assetId: StableDiceBoxIdSchema,
  variantId: StableDiceBoxIdSchema.optional(),
  role: z.enum(["background", "token", "handout", "audio", "font", "texture", "ui"]),
  mimeType: z.string().regex(/^[^/\s]+\/[^/\s]+$/),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  byteLength: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
}).strict();

const furnishingKinds = [
  "tile",
  "token",
  "ambientLight",
  "ambientSound",
  "drawing",
  "note",
] as const;

const furnishingFootprintSchema = z.object({
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
  clearance: z.number().finite().positive(),
}).strict();

const furnishingPlacementFields = {
  furnishingId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  kind: z.enum(furnishingKinds),
  levelId: StableDiceBoxIdSchema,
  position: z.object({ x: z.number().finite(), y: z.number().finite() }).strict(),
  footprint: furnishingFootprintSchema,
  rotation: z.number().finite().default(0),
  anchorId: StableDiceBoxIdSchema.optional(),
  targetRegionId: StableDiceBoxIdSchema.optional(),
};

/** Input form before an approved asset identity is resolved. */
export const furnishingItemIntentSchema = z.object({
  ...furnishingPlacementFields,
  assetRef: assetRefSchema.optional(),
}).strict();

const furnishingItemSchema = z.object({
  ...furnishingPlacementFields,
  asset: resolvedAssetSchema.optional(),
}).strict();

const relationSchema = z.discriminatedUnion("kind", [
  z.object({
    relationId: StableDiceBoxIdSchema,
    kind: z.literal("near"),
    fromFurnishingId: StableDiceBoxIdSchema,
    toFurnishingId: StableDiceBoxIdSchema,
    maxDistance: z.number().finite().positive(),
  }).strict(),
  z.object({
    relationId: StableDiceBoxIdSchema,
    kind: z.literal("align"),
    fromFurnishingId: StableDiceBoxIdSchema,
    toFurnishingId: StableDiceBoxIdSchema,
    axis: z.enum(["x", "y", "center"]),
  }).strict(),
  z.object({
    relationId: StableDiceBoxIdSchema,
    kind: z.literal("near-anchor"),
    fromFurnishingId: StableDiceBoxIdSchema,
    anchorId: StableDiceBoxIdSchema,
    maxDistance: z.number().finite().positive(),
  }).strict(),
  z.object({
    relationId: StableDiceBoxIdSchema,
    kind: z.literal("inside-region"),
    fromFurnishingId: StableDiceBoxIdSchema,
    regionId: StableDiceBoxIdSchema,
  }).strict(),
]);

const placeableApiByKind = {
  tile: furnishingFoundryApi.tileCreate,
  token: furnishingFoundryApi.tokenCreate,
  ambientLight: furnishingFoundryApi.ambientLightCreate,
  ambientSound: furnishingFoundryApi.ambientSoundCreate,
  drawing: furnishingFoundryApi.drawingCreate,
  note: furnishingFoundryApi.noteCreate,
} as const;

const placeableOrder = ["tile", "token", "ambientLight", "ambientSound", "drawing", "note"] as const;

const furnishingStepSchema = z.object({
  stepId: StableDiceBoxIdSchema,
  order: z.number().int().positive(),
  furnishingId: StableDiceBoxIdSchema,
  kind: z.enum(furnishingKinds),
  api: z.enum([
    'scene.createEmbeddedDocuments("Tile", ...)',
    'scene.createEmbeddedDocuments("Token", ...)',
    'scene.createEmbeddedDocuments("AmbientLight", ...)',
    'scene.createEmbeddedDocuments("AmbientSound", ...)',
    'scene.createEmbeddedDocuments("Drawing", ...)',
    'scene.createEmbeddedDocuments("Note", ...)',
  ]),
}).strict();

export const furnishingProjectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  sceneBinding: sceneBindingSchema,
  blueprint: spatialBlueprintSchema,
  assetManifestId: StableDiceBoxIdSchema,
  items: z.array(furnishingItemSchema).max(5000),
  relations: z.array(relationSchema).max(10000),
  steps: z.array(furnishingStepSchema).max(5000),
  foundryApi: furnishingFoundryApiSchema,
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const levelIds = new Set(value.blueprint.levels.map((level) => level.levelId));
  const anchorIds = new Set(value.blueprint.anchors.map((anchor) => anchor.anchorId));
  const regionIds = new Set(value.blueprint.regions.map((region) => region.regionId));
  const furnishingIds = new Set<string>();

  for (const [index, item] of value.items.entries()) {
    if (furnishingIds.has(item.furnishingId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "furnishingId"], message: "Furnishing identities must be unique." });
    }
    furnishingIds.add(item.furnishingId);
    if (!levelIds.has(item.levelId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "levelId"], message: "Furnishing must reference a declared Blueprint level." });
    }
    const { x, y } = item.position;
    const { width, height, clearance } = item.footprint;
    if (x - clearance < 0 || y - clearance < 0
      || x + width + clearance > value.blueprint.bounds.width
      || y + height + clearance > value.blueprint.bounds.height) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "footprint"], message: "Furnishing footprint and clearance must remain within Blueprint bounds." });
    }
    if (item.anchorId !== undefined && !anchorIds.has(item.anchorId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "anchorId"], message: "Furnishing anchorId must reference a declared Blueprint anchor." });
    }
    if (item.targetRegionId !== undefined && !regionIds.has(item.targetRegionId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "targetRegionId"], message: "Furnishing targetRegionId must reference a declared Region." });
    }
    const requiredRole = item.kind === "tile"
      ? ["background", "texture"]
      : item.kind === "token" ? ["token"]
        : item.kind === "ambientSound" ? ["audio"] : [];
    if (requiredRole.length > 0) {
      if (!item.asset || !requiredRole.includes(item.asset.role)) {
        context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "asset"], message: `Furnishing kind ${item.kind} requires an approved ${requiredRole.join(" or ")} asset.` });
      }
    } else if (item.asset !== undefined) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["items", index, "asset"], message: `Furnishing kind ${item.kind} does not accept an asset in this projection slice.` });
    }
  }

  const relationIds = new Set<string>();
  for (const [index, relation] of value.relations.entries()) {
    if (relationIds.has(relation.relationId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["relations", index, "relationId"], message: "Furnishing relation identities must be unique." });
    }
    relationIds.add(relation.relationId);
    if (!furnishingIds.has(relation.fromFurnishingId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["relations", index, "fromFurnishingId"], message: "Relation source must reference a declared furnishing." });
    }
    if ("toFurnishingId" in relation && !furnishingIds.has(relation.toFurnishingId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["relations", index, "toFurnishingId"], message: "Relation target must reference a declared furnishing." });
    }
    if ("anchorId" in relation && !anchorIds.has(relation.anchorId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["relations", index, "anchorId"], message: "Relation anchor must reference a declared Blueprint anchor." });
    }
    if ("regionId" in relation && !regionIds.has(relation.regionId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["relations", index, "regionId"], message: "Relation region must reference a declared Region." });
    }
  }

  if (value.steps.length !== value.items.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["steps"], message: "Every placeable furnishing must have exactly one owned embedded-document step." });
  }
  value.steps.forEach((step, index) => {
    const item = value.items[index];
    if (!item || step.order !== index + 1 || step.furnishingId !== item.furnishingId
      || step.kind !== item.kind || step.api !== placeableApiByKind[item.kind]) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["steps", index], message: "Furnishing steps must preserve canonical order and API ownership." });
    }
  });
});

export type FurnishingItemIntent = z.input<typeof furnishingItemIntentSchema>;
export type FurnishingProjectionPlan = z.infer<typeof furnishingProjectionPlanSchema>;
export type FurnishingRelation = z.infer<typeof relationSchema>;

export interface FurnishingProjectionPlanReview {
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

export interface FurnishingProjectionPlanPreview {
  readonly plan: FurnishingProjectionPlan;
  readonly review: FurnishingProjectionPlanReview;
  readonly receipt: EvidenceReceipt;
}

function assetDescriptor(
  manifest: ApprovedAssetManifest,
  ref: z.infer<typeof assetRefSchema>,
): z.infer<typeof resolvedAssetSchema> {
  const asset = manifest.assets.find((candidate) => candidate.assetId === ref.assetId);
  if (!asset) throw new Error(`Approved asset ${ref.assetId} was not found in manifest ${manifest.manifestId}.`);
  const variant = ref.variantId === undefined
    ? undefined
    : asset.variants.find((candidate) => candidate.variantId === ref.variantId);
  if (ref.variantId !== undefined && !variant) {
    throw new Error(`Approved asset variant ${ref.variantId} was not found under ${ref.assetId}.`);
  }
  const descriptor = variant ?? asset;
  return resolvedAssetSchema.parse({
    assetId: asset.assetId,
    ...(variant ? { variantId: variant.variantId } : {}),
    role: asset.role,
    mimeType: descriptor.mimeType,
    sha256: descriptor.sha256,
    byteLength: descriptor.byteLength,
    ...(descriptor.width === undefined ? {} : { width: descriptor.width }),
    ...(descriptor.height === undefined ? {} : { height: descriptor.height }),
  });
}

function furnishingApi(kind: FurnishingProjectionPlan["items"][number]["kind"]): FurnishingProjectionPlan["steps"][number]["api"] {
  return placeableApiByKind[kind];
}

function stepId(planId: string, furnishingId: string): FurnishingProjectionPlan["steps"][number]["stepId"] {
  return createStableDiceBoxId("step", `${planId.split(":").at(-1) ?? "furnishing"}-${furnishingId.split(":").at(-1) ?? "item"}`);
}

export function createFurnishingProjectionPlan(input: {
  readonly planId: FurnishingProjectionPlan["planId"];
  readonly sceneBinding: RuntimeBinding;
  readonly blueprint: SpatialBlueprint;
  readonly assetManifest: ApprovedAssetManifest;
  readonly items: readonly FurnishingItemIntent[];
  readonly relations?: readonly FurnishingRelation[];
}): FurnishingProjectionPlan {
  const blueprint = spatialBlueprintSchema.parse(input.blueprint);
  const manifest = approvedAssetManifestSchema.parse(input.assetManifest);
  const sceneBinding = sceneBindingSchema.parse(input.sceneBinding);
  const materialized = input.items.map((item) => {
    const parsed = furnishingItemIntentSchema.parse(item);
    const asset = parsed.assetRef === undefined ? undefined : assetDescriptor(manifest, parsed.assetRef);
    const { assetRef: _assetRef, ...placement } = parsed;
    return furnishingItemSchema.parse({
      ...placement,
      ...(asset ? { asset } : {}),
    });
  }).sort((left, right) => {
    const kindOrder = placeableOrder.indexOf(left.kind) - placeableOrder.indexOf(right.kind);
    return kindOrder || left.furnishingId.localeCompare(right.furnishingId);
  });
  const relations = [...(input.relations ?? [])].map((relation) => relationSchema.parse(relation))
    .sort((left, right) => left.relationId.localeCompare(right.relationId));
  return furnishingProjectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: input.planId,
    sceneBinding,
    blueprint,
    assetManifestId: manifest.manifestId,
    items: materialized,
    relations,
    steps: materialized.map((item, index) => ({
      stepId: stepId(input.planId, item.furnishingId),
      order: index + 1,
      furnishingId: item.furnishingId,
      kind: item.kind,
      api: furnishingApi(item.kind),
    })),
    foundryApi: furnishingFoundryApi,
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateFurnishingProjectionPlan(input: unknown): FurnishingProjectionPlan {
  return furnishingProjectionPlanSchema.parse(input);
}

function finding(code: string, severity: "blocker" | "warning", message: string) {
  return { code, severity, message } as const;
}

function createPreviewReceipt(plan: FurnishingProjectionPlan, authority: "none" | "gm", observedAt: string): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${plan.planId.split(":").at(-1) ?? "furnishing"}-preview`),
    operation: "furnishing-plan.preview",
    status: "previewed",
    evidenceClass: "deterministic",
    authority,
    semanticRefs: [plan.sceneBinding.semantic],
    observedAt,
    notes: [
      "Preview only; no Scene embedded-document create or update call was attempted.",
      "Approved asset paths remain outside the plan; deployment and placeable payload mapping require exact Foundry gates.",
      "The Spatial Blueprint remains authoritative; furnishing cannot alter its geometry.",
    ],
  });
}

export function previewFurnishingProjectionPlan(
  input: unknown,
  runtime: RuntimeProfile,
  options: { readonly authority?: "none" | "gm"; readonly observedAt: string },
): FurnishingProjectionPlanPreview {
  const plan = validateFurnishingProjectionPlan(input);
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
    "foundry.scene.placeable.read",
    "foundry.scene.placeable.write",
    "foundry.users.active-gm",
  ];
  if (plan.items.some((item) => item.asset !== undefined)) requiredCapabilities.push("foundry.media.deploy");
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
    findings.push(finding("GM_AUTHORITY_REQUIRED", "blocker", "Furnishing projection requires an active authorized GM."));
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
