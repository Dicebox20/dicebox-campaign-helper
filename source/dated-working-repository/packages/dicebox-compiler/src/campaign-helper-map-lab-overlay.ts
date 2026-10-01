import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import {
  campaignHelperMapLabPlanSchema,
  createCampaignHelperMapLabPlan,
  type CampaignHelperMapLabPlan,
} from "./campaign-helper-map-lab.js";
import {
  spatialBlueprintSchema,
  type SpatialBlueprint,
} from "./spatial-blueprint.js";

const sha256Schema = z.string().regex(/^[0-9a-f]{64}$/);
const pointSchema = z.object({ x: z.number().finite(), y: z.number().finite() }).strict();
const dimensionsSchema = z.object({ width: z.number().int().positive(), height: z.number().int().positive() }).strict();
const boundsSchema = z.object({
  x: z.number().finite(),
  y: z.number().finite(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
}).strict();

export const CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET = Object.freeze({
  assetId: "dbx:asset:campaign-helper-map-lab-background-v1",
  assetPath: "assets/testing/campaign-helper-map-lab-v1.svg",
  sha256: "36112ad4894d01fbe04a1a9bfaa7ea09f69f978c6730695cec8d2637cbfd1a82",
  byteLength: 2240,
  dimensions: { width: 1536, height: 1024 },
} as const);

const transformSchema = z.object({
  image: dimensionsSchema,
  scene: dimensionsSchema,
  scale: pointSchema,
  offset: pointSchema,
  grid: z.object({ size: z.number().finite().positive(), unitsPerCell: z.number().finite().positive() }).strict(),
  coordinateSpace: z.literal("scene-pixels"),
  source: z.literal("known-size-map-lab-fixture"),
}).strict();

const rendererSchema = z.object({
  assetId: StableDiceBoxIdSchema,
  assetPath: z.string().min(1),
  sha256: sha256Schema,
  byteLength: z.number().int().positive(),
  dimensions: dimensionsSchema,
}).strict();

const predictionSchema = z.object({
  anchorId: StableDiceBoxIdSchema,
  targetRegionId: StableDiceBoxIdSchema,
  confidence: z.enum(["high", "medium", "low"]),
  imageBounds: boundsSchema,
  proposedSceneBounds: boundsSchema,
  proposedScenePosition: pointSchema,
  source: z.literal("known-size-map-lab-proposal"),
}).strict();

const correctionSchema = z.object({
  anchorId: StableDiceBoxIdSchema,
  targetRegionId: StableDiceBoxIdSchema,
  sceneBounds: boundsSchema,
  scenePosition: pointSchema,
  reviewedBy: z.string().min(1),
}).strict();

const authoritySchema = z.object({
  geometry: z.literal("spatial-blueprint-owns-geometry"),
  renderer: z.literal("background-renderer-only"),
  predictions: z.literal("proposal-only"),
  runtime: z.literal("not-modeled"),
  persistence: z.literal("in-memory-only"),
  mutation: z.literal("disabled"),
}).strict();

export const campaignHelperMapLabOverlayReviewSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("campaign-helper.map-lab.overlay-review"),
  evidenceClass: z.literal("local"),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
  mapId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema,
  sourceRenderer: rendererSchema,
  transform: transformSchema,
  sourceBlueprint: spatialBlueprintSchema,
  sourceBlueprintDigest: sha256Schema,
  predictions: z.array(predictionSchema).length(4),
  predictionDigest: sha256Schema,
  corrections: z.array(correctionSchema).max(4),
  reviewStatus: z.enum(["needs-review", "ready-for-approval"]),
  blockers: z.array(z.string().min(1)).max(20),
  approvalGranted: z.literal(false),
  authority: authoritySchema,
}).strict();

export type CampaignHelperMapLabOverlayReview = z.infer<typeof campaignHelperMapLabOverlayReviewSchema>;
export type CampaignHelperMapLabOverlayCorrection = z.infer<typeof correctionSchema>;

const approvalSchema = z.object({
  approved: z.literal(true),
  approvedBy: z.string().min(1),
  approvedAt: z.string().min(1),
}).strict();

export const campaignHelperMapLabOverlayPromotionSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("campaign-helper.map-lab.overlay-promotion"),
  evidenceClass: z.literal("local"),
  status: z.literal("promoted-local"),
  mapId: StableDiceBoxIdSchema,
  sourceBlueprintId: StableDiceBoxIdSchema,
  sourceBlueprintDigest: sha256Schema,
  predictionDigest: sha256Schema,
  blueprint: spatialBlueprintSchema,
  blueprintDigest: sha256Schema,
  approval: approvalSchema,
  noWrite: z.literal(true),
  persistence: z.literal("in-memory-only"),
  runtime: z.literal("not-modeled"),
  foreignState: z.literal("preserved-unknown-foreign-runtime-state"),
  readyClaim: z.literal(false),
}).strict();

export type CampaignHelperMapLabOverlayPromotion = z.infer<typeof campaignHelperMapLabOverlayPromotionSchema>;

const authority = {
  geometry: "spatial-blueprint-owns-geometry" as const,
  renderer: "background-renderer-only" as const,
  predictions: "proposal-only" as const,
  runtime: "not-modeled" as const,
  persistence: "in-memory-only" as const,
  mutation: "disabled" as const,
};

const exactTransform = {
  image: { width: 1536, height: 1024 },
  scene: { width: 1536, height: 1024 },
  scale: { x: 1, y: 1 },
  offset: { x: 0, y: 0 },
  grid: { size: 64, unitsPerCell: 5 },
  coordinateSpace: "scene-pixels" as const,
  source: "known-size-map-lab-fixture" as const,
};

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedCorrections(corrections: readonly CampaignHelperMapLabOverlayCorrection[]): CampaignHelperMapLabOverlayCorrection[] {
  return [...corrections].sort((left, right) => compareStrings(left.anchorId, right.anchorId));
}

async function digest(value: unknown): Promise<string> {
  return sha256FoundryIr(canonicalizeFoundryIr(value));
}

async function blueprintDigest(blueprint: SpatialBlueprint): Promise<string> {
  return digest(blueprint);
}

function exactRenderer(input: unknown): typeof CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET {
  const renderer = rendererSchema.parse(input);
  if (JSON.stringify(renderer) !== JSON.stringify(CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET)) {
    throw new Error("Campaign Helper Map Lab overlay renderer identity is stale or does not match the attested M1193 asset.");
  }
  return CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET;
}

function assertExactTransform(transform: unknown): void {
  if (JSON.stringify(transformSchema.parse(transform)) !== JSON.stringify(exactTransform)) {
    throw new Error("Campaign Helper Map Lab overlay transform is not the exact known-size image-to-Scene transform.");
  }
}

function assertBounds(bounds: { x: number; y: number; width: number; height: number }, blueprint: SpatialBlueprint, label: string): void {
  if (bounds.x < 0 || bounds.y < 0 || bounds.x + bounds.width > blueprint.bounds.width || bounds.y + bounds.height > blueprint.bounds.height) {
    throw new Error(`${label} must remain inside the Spatial Blueprint bounds.`);
  }
}

function rectangleForRegion(blueprint: SpatialBlueprint, regionId: string): { shapeId: string; x: number; y: number; width: number; height: number } {
  const region = blueprint.regions.find((candidate) => candidate.regionId === regionId);
  if (!region) throw new Error(`Overlay target Region ${regionId} is missing from the Spatial Blueprint.`);
  if (region.shapes.length !== 1 || region.shapes[0]?.kind !== "rectangle" || region.shapes[0].hole) {
    throw new Error(`Overlay target Region ${regionId} must contain exactly one positive rectangle.`);
  }
  const shape = region.shapes[0];
  return { shapeId: shape.shapeId, x: shape.x, y: shape.y, width: shape.width, height: shape.height };
}

function inputAnchors(plan: CampaignHelperMapLabPlan) {
  const anchors = plan.sequenceGate.inputAnchorIds.map((anchorId) => plan.blueprint.anchors.find((anchor) => anchor.anchorId === anchorId));
  if (anchors.some((anchor) => !anchor?.targetRegionId) || anchors.length !== 4) {
    throw new Error("Campaign Helper Map Lab overlay requires the four sequence input anchors and their target Regions.");
  }
  return anchors as Array<NonNullable<(typeof anchors)[number]>>;
}

function deriveBlockers(review: Pick<CampaignHelperMapLabOverlayReview, "predictions" | "corrections">): string[] {
  const predicted = new Set(review.predictions.map((prediction) => prediction.anchorId));
  const corrected = new Set(review.corrections.map((correction) => correction.anchorId));
  const blockers: string[] = [];
  if (review.corrections.length !== corrected.size) blockers.push("Duplicate overlay corrections are not allowed.");
  if ([...corrected].some((anchorId) => !predicted.has(anchorId))) blockers.push("Overlay corrections must target a proposed anchor.");
  if (corrected.size !== predicted.size) blockers.push("All proposed overlay anchors require explicit human correction before promotion.");
  blockers.push("Explicit approval is required before Blueprint promotion.");
  return blockers;
}

function unsignedPredictionSet(review: Pick<CampaignHelperMapLabOverlayReview, "mapId" | "blueprintId" | "transform" | "predictions">) {
  return {
    mapId: review.mapId,
    blueprintId: review.blueprintId,
    transform: review.transform,
    predictions: review.predictions,
  };
}

async function assertReviewIntegrity(review: CampaignHelperMapLabOverlayReview): Promise<void> {
  exactRenderer(review.sourceRenderer);
  assertExactTransform(review.transform);
  const plan = createCampaignHelperMapLabPlan();
  if (review.mapId !== plan.mapId || review.blueprintId !== plan.blueprint.blueprintId || review.sourceBlueprint.blueprintId !== plan.blueprint.blueprintId) {
    throw new Error("Campaign Helper Map Lab overlay map/Blueprint identity drifted from M1193.");
  }
  const expectedSourceDigest = await blueprintDigest(review.sourceBlueprint);
  if (expectedSourceDigest !== review.sourceBlueprintDigest) throw new Error("Overlay source Blueprint digest drifted.");
  const expectedPredictionDigest = await digest(unsignedPredictionSet(review));
  if (expectedPredictionDigest !== review.predictionDigest) throw new Error("Overlay prediction digest drifted.");
  const expectedBlockers = deriveBlockers(review);
  if (JSON.stringify(expectedBlockers) !== JSON.stringify(review.blockers)) throw new Error("Overlay blocker state drifted from its corrections.");
  if (review.reviewStatus !== (expectedBlockers.length === 1 ? "ready-for-approval" : "needs-review")) {
    throw new Error("Overlay review status does not match the correction state.");
  }
  for (const prediction of review.predictions) {
    assertBounds(prediction.imageBounds, review.sourceBlueprint, "Proposed image bounds");
    assertBounds(prediction.proposedSceneBounds, review.sourceBlueprint, "Proposed Scene bounds");
    if (prediction.proposedScenePosition.x < 0 || prediction.proposedScenePosition.y < 0
      || prediction.proposedScenePosition.x > review.sourceBlueprint.bounds.width
      || prediction.proposedScenePosition.y > review.sourceBlueprint.bounds.height) {
      throw new Error("Proposed Scene position must remain inside the Spatial Blueprint bounds.");
    }
  }
  for (const correction of review.corrections) {
    assertBounds(correction.sceneBounds, review.sourceBlueprint, "Corrected Scene bounds");
    if (correction.scenePosition.x < 0 || correction.scenePosition.y < 0
      || correction.scenePosition.x > review.sourceBlueprint.bounds.width
      || correction.scenePosition.y > review.sourceBlueprint.bounds.height) {
      throw new Error("Corrected Scene position must remain inside the Spatial Blueprint bounds.");
    }
  }
}

export async function createCampaignHelperMapLabOverlayReview(input: {
  readonly plan?: unknown;
  readonly renderer?: unknown;
} = {}): Promise<CampaignHelperMapLabOverlayReview> {
  const plan = campaignHelperMapLabPlanSchema.parse(input.plan ?? createCampaignHelperMapLabPlan());
  const renderer = exactRenderer(input.renderer ?? CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET);
  const anchors = inputAnchors(plan);
  const predictions = anchors.map((anchor) => {
    const regionId = anchor.targetRegionId!;
    const regionBounds = rectangleForRegion(plan.blueprint, regionId);
    return {
      anchorId: anchor.anchorId,
      targetRegionId: regionId,
      confidence: "high" as const,
      imageBounds: { x: regionBounds.x, y: regionBounds.y, width: regionBounds.width, height: regionBounds.height },
      proposedSceneBounds: { x: regionBounds.x, y: regionBounds.y, width: regionBounds.width, height: regionBounds.height },
      proposedScenePosition: { ...anchor.position },
      source: "known-size-map-lab-proposal" as const,
    };
  });
  const sourceBlueprintDigest = await blueprintDigest(plan.blueprint);
  const predictionDigest = await digest({
    mapId: plan.mapId,
    blueprintId: plan.blueprint.blueprintId,
    transform: exactTransform,
    predictions,
  });
  const review = campaignHelperMapLabOverlayReviewSchema.parse({
    schemaVersion: "0.1.0",
    operation: "campaign-helper.map-lab.overlay-review",
    evidenceClass: "local",
    noWrite: true,
    readyClaim: false,
    mapId: plan.mapId,
    blueprintId: plan.blueprint.blueprintId,
    sourceRenderer: renderer,
    transform: exactTransform,
    sourceBlueprint: plan.blueprint,
    sourceBlueprintDigest,
    predictions,
    predictionDigest,
    corrections: [],
    reviewStatus: "needs-review",
    blockers: [
      "All proposed overlay anchors require explicit human correction before promotion.",
      "Explicit approval is required before Blueprint promotion.",
    ],
    approvalGranted: false,
    authority,
  });
  await assertReviewIntegrity(review);
  return review;
}

export async function correctCampaignHelperMapLabOverlay(
  input: unknown,
  correctionInput: unknown,
): Promise<CampaignHelperMapLabOverlayReview> {
  const review = campaignHelperMapLabOverlayReviewSchema.parse(input);
  await assertReviewIntegrity(review);
  const correction = correctionSchema.parse(correctionInput);
  const prediction = review.predictions.find((candidate) => candidate.anchorId === correction.anchorId);
  if (!prediction || prediction.targetRegionId !== correction.targetRegionId) {
    throw new Error("Overlay correction must target one of the exact proposed anchor/Region pairs.");
  }
  if (review.corrections.some((candidate) => candidate.anchorId === correction.anchorId)) {
    throw new Error("Each proposed overlay anchor may be corrected only once.");
  }
  const corrections = sortedCorrections([...review.corrections, correction]);
  const blockers = deriveBlockers({ predictions: review.predictions, corrections });
  const next = campaignHelperMapLabOverlayReviewSchema.parse({
    ...review,
    corrections,
    reviewStatus: blockers.length === 1 ? "ready-for-approval" : "needs-review",
    blockers,
  });
  await assertReviewIntegrity(next);
  return next;
}

function correctedBlueprint(review: CampaignHelperMapLabOverlayReview): SpatialBlueprint {
  const corrections = new Map(review.corrections.map((correction) => [correction.anchorId, correction]));
  const targetRegions = new Map(review.predictions.map((prediction) => [prediction.targetRegionId, prediction.anchorId]));
  const blueprint = {
    ...review.sourceBlueprint,
    anchors: review.sourceBlueprint.anchors.map((anchor) => {
      const correction = corrections.get(anchor.anchorId);
      return correction ? { ...anchor, position: correction.scenePosition } : anchor;
    }),
    regions: review.sourceBlueprint.regions.map((region) => {
      const anchorId = targetRegions.get(region.regionId);
      const correction = anchorId ? corrections.get(anchorId) : undefined;
      if (!correction) return region;
      if (region.shapes.length !== 1 || region.shapes[0]?.kind !== "rectangle" || region.shapes[0].hole) {
        throw new Error("Overlay promotion supports only one positive rectangle per target Region.");
      }
      const shape = region.shapes[0];
      return { ...region, shapes: [{ ...shape, ...correction.sceneBounds }] };
    }),
  };
  return spatialBlueprintSchema.parse(blueprint);
}

export async function promoteCampaignHelperMapLabOverlay(
  input: unknown,
  approvalInput: unknown,
): Promise<CampaignHelperMapLabOverlayPromotion> {
  const review = campaignHelperMapLabOverlayReviewSchema.parse(input);
  await assertReviewIntegrity(review);
  if (review.blockers.length !== 1 || review.reviewStatus !== "ready-for-approval") {
    throw new Error("Overlay promotion requires explicit correction of every proposed anchor and Region.");
  }
  const approval = approvalSchema.parse(approvalInput);
  const blueprint = correctedBlueprint(review);
  const promoted = campaignHelperMapLabOverlayPromotionSchema.parse({
    schemaVersion: "0.1.0",
    operation: "campaign-helper.map-lab.overlay-promotion",
    evidenceClass: "local",
    status: "promoted-local",
    mapId: review.mapId,
    sourceBlueprintId: review.blueprintId,
    sourceBlueprintDigest: review.sourceBlueprintDigest,
    predictionDigest: review.predictionDigest,
    blueprint,
    blueprintDigest: await blueprintDigest(blueprint),
    approval,
    noWrite: true,
    persistence: "in-memory-only",
    runtime: "not-modeled",
    foreignState: "preserved-unknown-foreign-runtime-state",
    readyClaim: false,
  });
  return promoted;
}

export async function verifyCampaignHelperMapLabOverlayReview(input: unknown): Promise<boolean> {
  try {
    const review = campaignHelperMapLabOverlayReviewSchema.parse(input);
    await assertReviewIntegrity(review);
    return true;
  } catch {
    return false;
  }
}

export async function verifyCampaignHelperMapLabOverlayPromotion(input: unknown): Promise<boolean> {
  try {
    const promotion = campaignHelperMapLabOverlayPromotionSchema.parse(input);
    return await blueprintDigest(promotion.blueprint) === promotion.blueprintDigest
      && promotion.noWrite
      && promotion.persistence === "in-memory-only"
      && promotion.runtime === "not-modeled"
      && promotion.readyClaim === false;
  } catch {
    return false;
  }
}
