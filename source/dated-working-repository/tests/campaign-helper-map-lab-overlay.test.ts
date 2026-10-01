import { describe, expect, it } from "vitest";
import {
  CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET,
  createCampaignHelperMapLabOverlayReview,
  correctCampaignHelperMapLabOverlay,
  promoteCampaignHelperMapLabOverlay,
  verifyCampaignHelperMapLabOverlayPromotion,
  verifyCampaignHelperMapLabOverlayReview,
} from "@dicebox/compiler";
import { createCampaignHelperMapLabPlan } from "@dicebox/compiler";

describe("Campaign Helper Map Lab known-size overlay review", () => {
  it("binds the exact asset and transform as proposal-only local evidence", async () => {
    const review = await createCampaignHelperMapLabOverlayReview();
    expect(review).toMatchObject({
      operation: "campaign-helper.map-lab.overlay-review",
      evidenceClass: "local",
      noWrite: true,
      readyClaim: false,
      sourceRenderer: CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET,
      transform: {
        image: { width: 1536, height: 1024 },
        scene: { width: 1536, height: 1024 },
        scale: { x: 1, y: 1 },
        offset: { x: 0, y: 0 },
        grid: { size: 64, unitsPerCell: 5 },
        coordinateSpace: "scene-pixels",
        source: "known-size-map-lab-fixture",
      },
      authority: {
        geometry: "spatial-blueprint-owns-geometry",
        renderer: "background-renderer-only",
        predictions: "proposal-only",
        runtime: "not-modeled",
        persistence: "in-memory-only",
        mutation: "disabled",
      },
      reviewStatus: "needs-review",
      approvalGranted: false,
    });
    expect(review.predictions).toHaveLength(4);
    expect(review.predictions.every((prediction) => prediction.confidence === "high")).toBe(true);
    expect(review.blockers).toEqual([
      "All proposed overlay anchors require explicit human correction before promotion.",
      "Explicit approval is required before Blueprint promotion.",
    ]);
    expect(await verifyCampaignHelperMapLabOverlayReview(review)).toBe(true);
  });

  it("requires explicit correction for every proposal and rejects stale or malformed input", async () => {
    const review = await createCampaignHelperMapLabOverlayReview();
    const first = review.predictions[0]!;
    const correction = {
      anchorId: first.anchorId,
      targetRegionId: first.targetRegionId,
      sceneBounds: first.proposedSceneBounds,
      scenePosition: { x: first.proposedScenePosition.x + 8, y: first.proposedScenePosition.y },
      reviewedBy: "local Map Lab reviewer",
    };
    const partial = await correctCampaignHelperMapLabOverlay(review, correction);
    expect(partial.reviewStatus).toBe("needs-review");
    expect(partial.blockers).toContain("All proposed overlay anchors require explicit human correction before promotion.");
    await expect(correctCampaignHelperMapLabOverlay(partial, correction)).rejects.toThrow(/only once/);
    await expect(correctCampaignHelperMapLabOverlay(review, {
      ...correction,
      anchorId: "dbx:anchor:unknown-map-lab-anchor",
    })).rejects.toThrow(/exact proposed/);
    await expect(correctCampaignHelperMapLabOverlay(review, {
      ...correction,
      sceneBounds: { ...correction.sceneBounds, x: 2000 },
    })).rejects.toThrow(/inside/);
    expect(await verifyCampaignHelperMapLabOverlayReview({ ...review, predictionDigest: "0".repeat(64) })).toBe(false);
    await expect(createCampaignHelperMapLabOverlayReview({
      renderer: { ...CAMPAIGN_HELPER_MAP_LAB_OVERLAY_ASSET, sha256: "0".repeat(64) },
    })).rejects.toThrow(/identity/);
  });

  it("promotes only a fully corrected, explicitly approved overlay into an in-memory Blueprint", async () => {
    let review = await createCampaignHelperMapLabOverlayReview();
    for (const [index, prediction] of review.predictions.entries()) {
      review = await correctCampaignHelperMapLabOverlay(review, {
        anchorId: prediction.anchorId,
        targetRegionId: prediction.targetRegionId,
        sceneBounds: {
          ...prediction.proposedSceneBounds,
          ...(index === 0 ? { x: prediction.proposedSceneBounds.x + 8 } : {}),
        },
        scenePosition: {
          ...prediction.proposedScenePosition,
          ...(index === 0 ? { x: prediction.proposedScenePosition.x + 8 } : {}),
        },
        reviewedBy: "local Map Lab reviewer",
      });
    }
    expect(review.reviewStatus).toBe("ready-for-approval");
    expect(review.blockers).toEqual(["Explicit approval is required before Blueprint promotion."]);
    await expect(promoteCampaignHelperMapLabOverlay(review, { approved: true, approvedBy: "" , approvedAt: "2026-09-06T00:00:00.000Z" })).rejects.toThrow();

    const promotion = await promoteCampaignHelperMapLabOverlay(review, {
      approved: true,
      approvedBy: "local Map Lab reviewer",
      approvedAt: "2026-09-06T00:00:00.000Z",
    });
    expect(promotion).toMatchObject({
      operation: "campaign-helper.map-lab.overlay-promotion",
      status: "promoted-local",
      noWrite: true,
      persistence: "in-memory-only",
      runtime: "not-modeled",
      readyClaim: false,
      sourceBlueprintId: review.blueprintId,
      predictionDigest: review.predictionDigest,
    });
    expect(promotion.blueprintDigest).not.toBe(review.sourceBlueprintDigest);
    expect(promotion.blueprint.anchors.find((anchor) => anchor.anchorId === review.predictions[0]?.anchorId)?.position.x)
      .toBe(review.predictions[0]!.proposedScenePosition.x + 8);
    expect(promotion.blueprint.regions.find((region) => region.regionId === review.predictions[0]?.targetRegionId)?.shapes[0]).toMatchObject({ x: 288 });
    expect(await verifyCampaignHelperMapLabOverlayPromotion(promotion)).toBe(true);
    expect(await verifyCampaignHelperMapLabOverlayPromotion({ ...promotion, blueprintDigest: "0".repeat(64) })).toBe(false);
  });

  it("fails closed when the Map Lab shape is no longer a positive rectangle", async () => {
    const plan = createCampaignHelperMapLabPlan();
    const region = plan.blueprint.regions[0]!;
    const shape = region.shapes[0]!;
    const drifted = {
      ...plan,
      blueprint: {
        ...plan.blueprint,
        regions: plan.blueprint.regions.map((candidate, index) => index === 0
          ? {
            ...candidate,
            shapes: [{
              shapeId: shape.shapeId,
              kind: "polygon" as const,
              levelId: shape.levelId,
              points: [{ x: 280, y: 412 }, { x: 440, y: 412 }, { x: 360, y: 612 }],
            }],
          }
          : candidate),
      },
    };
    await expect(createCampaignHelperMapLabOverlayReview({ plan: drifted })).rejects.toThrow(/positive rectangle/);
  });
});
