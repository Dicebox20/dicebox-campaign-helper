import { z } from "zod";
import { createStableDiceBoxId } from "@dicebox/core";
import {
  approvedAssetManifestSchema,
  type ApprovedAssetManifest,
} from "./media-registry.js";
import {
  assetAttestationGateSchema,
  createAssetAttestationGate,
  validateAssetAttestationGate,
  type AssetAttestationGate,
} from "./asset-attestation.js";
import {
  createSpatialBlueprint,
  spatialBlueprintSchema,
  type SpatialBlueprint,
} from "./spatial-blueprint.js";

const canvas = { width: 1536, height: 1024 } as const;
const levelId = createStableDiceBoxId("level", "campaign-helper-map-lab-ground");
const mapId = createStableDiceBoxId("map", "campaign-helper-map-lab-v1");
const blueprintId = createStableDiceBoxId("blueprint", "campaign-helper-map-lab-v1");
const assetId = createStableDiceBoxId("asset", "campaign-helper-map-lab-background-v1");
const puzzleId = createStableDiceBoxId("puzzle", "campaign-helper-map-lab-sequence-gate");
const entryAnchorId = createStableDiceBoxId("anchor", "campaign-helper-map-lab-entry");
const gateAnchorId = createStableDiceBoxId("anchor", "campaign-helper-map-lab-gate");

const inputAnchorIds = [
  createStableDiceBoxId("anchor", "campaign-helper-map-lab-input-a"),
  createStableDiceBoxId("anchor", "campaign-helper-map-lab-input-b"),
  createStableDiceBoxId("anchor", "campaign-helper-map-lab-input-c"),
  createStableDiceBoxId("anchor", "campaign-helper-map-lab-input-d"),
] as const;

const inputRegionIds = [
  createStableDiceBoxId("region", "campaign-helper-map-lab-input-a"),
  createStableDiceBoxId("region", "campaign-helper-map-lab-input-b"),
  createStableDiceBoxId("region", "campaign-helper-map-lab-input-c"),
  createStableDiceBoxId("region", "campaign-helper-map-lab-input-d"),
] as const;
const gateRegionId = createStableDiceBoxId("region", "campaign-helper-map-lab-gate");

function wall(id: string, a: { x: number; y: number }, b: { x: number; y: number }) {
  return {
    wallId: createStableDiceBoxId("wall", `campaign-helper-map-lab-${id}`),
    levelId,
    a,
    b,
    thickness: 8,
  };
}

function rectangleRegion(id: string, label: string, x: number, y: number, width: number, height: number) {
  const regionId = createStableDiceBoxId("region", `campaign-helper-map-lab-${id}`);
  return {
    regionId,
    label,
    shapes: [{
      shapeId: createStableDiceBoxId("shape", `campaign-helper-map-lab-${id}`),
      kind: "rectangle" as const,
      levelId,
      x,
      y,
      width,
      height,
    }],
  };
}

export const campaignHelperMapLabSequenceGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleId: z.string().regex(/^dbx:puzzle:[a-z0-9][a-z0-9._-]*$/),
  inputAnchorIds: z.array(z.string().regex(/^dbx:anchor:[a-z0-9][a-z0-9._-]*$/)).length(4),
  requiredSequence: z.array(z.string().regex(/^dbx:anchor:[a-z0-9][a-z0-9._-]*$/)).length(4),
  gateAnchorId: z.string().regex(/^dbx:anchor:[a-z0-9][a-z0-9._-]*$/),
  state: z.literal("locked"),
  solved: z.literal(false),
  noWrite: z.literal(true),
}).strict().superRefine((value, context) => {
  if (new Set(value.inputAnchorIds).size !== value.inputAnchorIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["inputAnchorIds"], message: "Input anchors must be unique." });
  }
  if (JSON.stringify(value.requiredSequence) !== JSON.stringify(value.inputAnchorIds)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["requiredSequence"], message: "The local test sequence must cover each input anchor exactly once in declared order." });
  }
  if (value.inputAnchorIds.includes(value.gateAnchorId)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["gateAnchorId"], message: "The gate anchor must be distinct from input anchors." });
  }
});

export type CampaignHelperMapLabSequenceGate = z.infer<typeof campaignHelperMapLabSequenceGateSchema>;

export const campaignHelperMapLabPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("campaign-helper.map-lab.plan"),
  status: z.literal("ready-local"),
  evidenceClass: z.literal("local"),
  noWrite: z.literal(true),
  mutation: z.literal("disabled"),
  mapId: z.string().regex(/^dbx:map:[a-z0-9][a-z0-9._-]*$/),
  blueprint: spatialBlueprintSchema,
  sequenceGate: campaignHelperMapLabSequenceGateSchema,
  visual: z.object({
    assetId: z.string().regex(/^dbx:asset:[a-z0-9][a-z0-9._-]*$/),
    assetPath: z.literal("assets/testing/campaign-helper-map-lab-v1.svg"),
    width: z.literal(canvas.width),
    height: z.literal(canvas.height),
    mimeType: z.literal("image/svg+xml"),
    rendererOnly: z.literal(true),
    noBakedGrid: z.literal(true),
  }).strict(),
  authority: z.object({
    geometry: z.literal("spatial-blueprint-owns-geometry"),
    renderer: z.literal("background-renderer-only"),
    runtime: z.literal("not-modeled"),
    mutation: z.literal("disabled"),
  }).strict(),
}).strict().superRefine((value, context) => {
  if (value.mapId !== mapId) context.addIssue({ code: z.ZodIssueCode.custom, path: ["mapId"], message: "The Map Lab map ID is fixed." });
  if (value.blueprint.blueprintId !== blueprintId) context.addIssue({ code: z.ZodIssueCode.custom, path: ["blueprint", "blueprintId"], message: "The Map Lab blueprint ID is fixed." });
  if (value.visual.assetId !== assetId) context.addIssue({ code: z.ZodIssueCode.custom, path: ["visual", "assetId"], message: "The Map Lab renderer asset ID is fixed." });
  const anchorIds = new Set<string>(value.blueprint.anchors.map((anchor) => anchor.anchorId));
  for (const [index, inputId] of value.sequenceGate.inputAnchorIds.entries()) {
    if (!anchorIds.has(inputId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sequenceGate", "inputAnchorIds", index], message: "Each sequence input must reference a blueprint anchor." });
  }
  if (!anchorIds.has(value.sequenceGate.gateAnchorId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sequenceGate", "gateAnchorId"], message: "The sequence gate must reference a blueprint anchor." });
});

export type CampaignHelperMapLabPlan = z.infer<typeof campaignHelperMapLabPlanSchema>;

export const campaignHelperMapLabPackageSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("campaign-helper.map-lab.package"),
  status: z.literal("ready-local"),
  evidenceClass: z.literal("local"),
  noWrite: z.literal(true),
  mutation: z.literal("disabled"),
  packageId: z.string().regex(/^dbx:package:[a-z0-9][a-z0-9._-]*$/),
  generatedBy: z.literal("tools/write-campaign-helper-map-lab-package.ts"),
  plan: campaignHelperMapLabPlanSchema,
  assetManifest: approvedAssetManifestSchema,
  assetAttestationGate: assetAttestationGateSchema,
  preservation: z.object({
    foreignState: z.literal("preserve-unknown-foreign-runtime-state"),
    runtimeState: z.literal("not-modeled"),
    nativeDocuments: z.literal("not-created"),
  }).strict(),
  provenance: z.object({
    implementation: z.literal("Campaign Helper typed Spatial Blueprint and asset-attestation surfaces"),
    externalGuidance: z.array(z.string().url()).min(1).max(8),
    copiedRuntimeCode: z.literal(false),
  }).strict(),
}).strict().superRefine((value, context) => {
  const asset = value.assetManifest.assets.find((candidate) => candidate.assetId === value.plan.visual.assetId);
  if (!asset) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["assetManifest", "assets"], message: "The plan renderer asset must be present in the approved manifest." });
    return;
  }
  if (asset.locator !== value.plan.visual.assetPath || asset.mimeType !== value.plan.visual.mimeType) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["assetManifest", "assets"], message: "The renderer asset manifest must match the plan visual descriptor." });
  }
});

export type CampaignHelperMapLabPackage = z.infer<typeof campaignHelperMapLabPackageSchema>;

export function createCampaignHelperMapLabBlueprint(): SpatialBlueprint {
  const regions = [
    rectangleRegion("input-a", "Sequence Input A", 280, 412, 160, 200),
    rectangleRegion("input-b", "Sequence Input B", 520, 412, 160, 200),
    rectangleRegion("input-c", "Sequence Input C", 760, 412, 160, 200),
    rectangleRegion("input-d", "Sequence Input D", 1000, 412, 160, 200),
    rectangleRegion("gate", "Locked Exit Gate", 1360, 360, 120, 304),
  ];
  const walls = [
    wall("north", { x: 24, y: 24 }, { x: 1512, y: 24 }),
    wall("south", { x: 24, y: 1000 }, { x: 1512, y: 1000 }),
    wall("west-north", { x: 24, y: 24 }, { x: 24, y: 464 }),
    wall("west-south", { x: 24, y: 560 }, { x: 24, y: 1000 }),
    wall("east-north", { x: 1512, y: 24 }, { x: 1512, y: 448 }),
    wall("east-south", { x: 1512, y: 576 }, { x: 1512, y: 1000 }),
  ];
  const anchors = [
    { anchorId: entryAnchorId, kind: "entrance" as const, levelId, position: { x: 24, y: 512 }, clearance: 48 },
    ...inputAnchorIds.map((anchorId, index) => ({
      anchorId,
      kind: "interaction" as const,
      levelId,
      position: { x: 360 + index * 240, y: 512 },
      clearance: 56,
      targetRegionId: inputRegionIds[index],
    })),
    { anchorId: gateAnchorId, kind: "door" as const, levelId, position: { x: 1512, y: 512 }, clearance: 48, targetRegionId: gateRegionId },
  ];
  return createSpatialBlueprint({
    blueprintId,
    name: "Campaign Helper Map Lab",
    origin: { x: 0, y: 0 },
    bounds: canvas,
    grid: { size: 64, unitsPerCell: 5 },
    scale: { pixelsPerUnit: 12.8, unit: "grid-unit" },
    levels: [{ levelId, label: "Ground", elevation: 0 }],
    walls,
    regions,
    anchors,
  });
}

export function createCampaignHelperMapLabPlan(): CampaignHelperMapLabPlan {
  const blueprint = createCampaignHelperMapLabBlueprint();
  return campaignHelperMapLabPlanSchema.parse({
    schemaVersion: "0.1.0",
    operation: "campaign-helper.map-lab.plan",
    status: "ready-local",
    evidenceClass: "local",
    noWrite: true,
    mutation: "disabled",
    mapId,
    blueprint,
    sequenceGate: {
      schemaVersion: "0.1.0",
      puzzleId,
      inputAnchorIds: [...inputAnchorIds],
      requiredSequence: [...inputAnchorIds],
      gateAnchorId,
      state: "locked",
      solved: false,
      noWrite: true,
    },
    visual: {
      assetId,
      assetPath: "assets/testing/campaign-helper-map-lab-v1.svg",
      width: canvas.width,
      height: canvas.height,
      mimeType: "image/svg+xml",
      rendererOnly: true,
      noBakedGrid: true,
    },
    authority: {
      geometry: "spatial-blueprint-owns-geometry",
      renderer: "background-renderer-only",
      runtime: "not-modeled",
      mutation: "disabled",
    },
  });
}

export function createCampaignHelperMapLabPackage(input: {
  readonly plan: unknown;
  readonly assetManifest: ApprovedAssetManifest;
  readonly assetAttestationGate: AssetAttestationGate;
}): CampaignHelperMapLabPackage {
  const packageData = campaignHelperMapLabPackageSchema.parse({
    schemaVersion: "0.1.0",
    operation: "campaign-helper.map-lab.package",
    status: "ready-local",
    evidenceClass: "local",
    noWrite: true,
    mutation: "disabled",
    packageId: createStableDiceBoxId("package", "campaign-helper-map-lab-v1"),
    generatedBy: "tools/write-campaign-helper-map-lab-package.ts",
    plan: campaignHelperMapLabPlanSchema.parse(input.plan),
    assetManifest: approvedAssetManifestSchema.parse(input.assetManifest),
    assetAttestationGate: assetAttestationGateSchema.parse(input.assetAttestationGate),
    preservation: {
      foreignState: "preserve-unknown-foreign-runtime-state",
      runtimeState: "not-modeled",
      nativeDocuments: "not-created",
    },
    provenance: {
      implementation: "Campaign Helper typed Spatial Blueprint and asset-attestation surfaces",
      externalGuidance: [
        "https://foundryvtt.com/article/scenes/",
        "https://foundryvtt.com/article/content-creation-guide/",
        "https://github.com/Saibot393/LocknKey",
      ],
      copiedRuntimeCode: false,
    },
  });
  validateAssetAttestationGate(packageData.assetManifest, packageData.assetAttestationGate);
  return packageData;
}

export function validateCampaignHelperMapLabPackage(input: unknown): CampaignHelperMapLabPackage {
  const packageData = campaignHelperMapLabPackageSchema.parse(input);
  validateAssetAttestationGate(packageData.assetManifest, packageData.assetAttestationGate);
  return packageData;
}

export { assetId as campaignHelperMapLabAssetId, gateAnchorId as campaignHelperMapLabGateAnchorId, mapId as campaignHelperMapLabMapId };
