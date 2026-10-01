import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CAMPAIGN_HELPER_MAP_LAB_ASSET_BYTE_LENGTH,
  CAMPAIGN_HELPER_MAP_LAB_ASSET_SHA256,
  createCampaignHelperMapLabDesktopPreview,
} from "../apps/campaign-helper-desktop/src/campaign-helper-map-lab-preview";
import { createCampaignHelperMapLabPlan } from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const assetBytes = readFileSync(resolve(root, "assets/testing/campaign-helper-map-lab-v1.svg"));

describe("Campaign Helper Map Lab desktop preview", () => {
  it("binds the exact M1193 package geometry and renderer identity without write authority", () => {
    const preview = createCampaignHelperMapLabDesktopPreview();
    expect(preview).toMatchObject({
      operation: "campaign-helper.map-lab.desktop-preview",
      evidenceClass: "local",
      noWrite: true,
      assetPath: "assets/testing/campaign-helper-map-lab-v1.svg",
      assetByteLength: CAMPAIGN_HELPER_MAP_LAB_ASSET_BYTE_LENGTH,
      assetSha256: CAMPAIGN_HELPER_MAP_LAB_ASSET_SHA256,
      canvas: { width: 1536, height: 1024 },
      grid: { size: 64, unitsPerCell: 5 },
      authority: { geometry: "spatial-blueprint-owns-geometry", renderer: "background-renderer-only", runtime: "not-modeled", mutation: "disabled" },
    });
    expect(preview.walls).toHaveLength(6);
    expect(preview.regions).toHaveLength(5);
    expect(preview.anchors).toHaveLength(6);
    expect(preview.sequenceGate.inputAnchorIds).toHaveLength(4);
    expect(new Set(preview.anchors.map((anchor) => anchor.anchorId)).size).toBe(6);
  });

  it("derives overlay geometry from the Blueprint rather than renderer pixels", () => {
    const plan = createCampaignHelperMapLabPlan();
    const preview = createCampaignHelperMapLabDesktopPreview(plan);
    const sourceRegion = plan.blueprint.regions[0]!;
    const sourceShape = sourceRegion.shapes[0]!;
    const projectedRegion = preview.regions[0]!;
    expect(projectedRegion).toMatchObject({
      regionId: sourceRegion.regionId,
      shapeId: sourceShape.shapeId,
      x: sourceShape.kind === "rectangle" ? sourceShape.x : -1,
      y: sourceShape.kind === "rectangle" ? sourceShape.y : -1,
    });
    expect(preview.walls[0]).toMatchObject({ wallId: plan.blueprint.walls[0]?.wallId, x1: 24, y1: 24, x2: 1512, y2: 24 });
  });

  it("fails closed if a future Map Lab region is not one positive rectangle", () => {
    const plan = createCampaignHelperMapLabPlan();
    const region = plan.blueprint.regions[0]!;
    const shape = region.shapes[0]!;
    const drifted = {
      ...plan,
      blueprint: {
        ...plan.blueprint,
        regions: plan.blueprint.regions.map((candidate, index) => index === 0
          ? { ...candidate, shapes: [{ shapeId: shape.shapeId, kind: "polygon" as const, levelId: shape.levelId, points: [{ x: 280, y: 412 }, { x: 440, y: 412 }, { x: 360, y: 612 }] }] }
          : candidate),
      },
    };
    expect(() => createCampaignHelperMapLabDesktopPreview(drifted)).toThrow(/positive rectangle/);
  });

  it("confirms the desktop preview asset bytes still match M1193", () => {
    expect(assetBytes.byteLength).toBe(CAMPAIGN_HELPER_MAP_LAB_ASSET_BYTE_LENGTH);
    expect(createHash("sha256").update(assetBytes).digest("hex")).toBe(CAMPAIGN_HELPER_MAP_LAB_ASSET_SHA256);
  });
});
