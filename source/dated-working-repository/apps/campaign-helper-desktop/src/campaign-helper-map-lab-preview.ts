import {
  campaignHelperMapLabPlanSchema,
  createCampaignHelperMapLabPlan,
  type CampaignHelperMapLabPlan,
} from "@dicebox/compiler";

export const CAMPAIGN_HELPER_MAP_LAB_ASSET_BYTE_LENGTH = 2240;
export const CAMPAIGN_HELPER_MAP_LAB_ASSET_SHA256 = "36112ad4894d01fbe04a1a9bfaa7ea09f69f978c6730695cec8d2637cbfd1a82";

export type CampaignHelperMapLabPreview = Readonly<{
  operation: "campaign-helper.map-lab.desktop-preview";
  evidenceClass: "local";
  noWrite: true;
  mapId: string;
  blueprintId: string;
  assetId: string;
  assetPath: "assets/testing/campaign-helper-map-lab-v1.svg";
  assetByteLength: 2240;
  assetSha256: string;
  canvas: Readonly<{ width: 1536; height: 1024 }>;
  grid: Readonly<{ size: 64; unitsPerCell: 5 }>;
  walls: readonly Readonly<{
    wallId: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    thickness: number;
  }>[];
  regions: readonly Readonly<{
    regionId: string;
    shapeId: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>[];
  anchors: readonly Readonly<{
    anchorId: string;
    kind: "door" | "entrance" | "interaction" | "spawn";
    x: number;
    y: number;
    clearance: number;
    targetRegionId?: string;
  }>[];
  sequenceGate: Readonly<{
    puzzleId: string;
    inputAnchorIds: readonly string[];
    gateAnchorId: string;
    state: "locked";
  }>;
  authority: Readonly<{
    geometry: "spatial-blueprint-owns-geometry";
    renderer: "background-renderer-only";
    runtime: "not-modeled";
    mutation: "disabled";
  }>;
}>;

function rectangleRegion(region: CampaignHelperMapLabPlan["blueprint"]["regions"][number]): CampaignHelperMapLabPreview["regions"][number] {
  if (region.shapes.length !== 1 || region.shapes[0]?.kind !== "rectangle" || region.shapes[0].hole === true) {
    throw new Error(`Campaign Helper Map Lab desktop preview requires exactly one positive rectangle for ${region.regionId}.`);
  }
  const shape = region.shapes[0];
  return {
    regionId: region.regionId,
    shapeId: shape.shapeId,
    label: region.label,
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
  };
}

export function createCampaignHelperMapLabDesktopPreview(input: unknown = createCampaignHelperMapLabPlan()): CampaignHelperMapLabPreview {
  const plan = campaignHelperMapLabPlanSchema.parse(input);
  const blueprint = plan.blueprint;
  if (blueprint.bounds.width !== 1536 || blueprint.bounds.height !== 1024) {
    throw new Error("Campaign Helper Map Lab desktop preview requires the exact 1536x1024 canvas.");
  }
  if (blueprint.grid.size !== 64 || blueprint.grid.unitsPerCell !== 5) {
    throw new Error("Campaign Helper Map Lab desktop preview requires the exact 64px/5-unit grid.");
  }
  return {
    operation: "campaign-helper.map-lab.desktop-preview",
    evidenceClass: "local",
    noWrite: true,
    mapId: plan.mapId,
    blueprintId: blueprint.blueprintId,
    assetId: plan.visual.assetId,
    assetPath: plan.visual.assetPath,
    assetByteLength: CAMPAIGN_HELPER_MAP_LAB_ASSET_BYTE_LENGTH,
    assetSha256: CAMPAIGN_HELPER_MAP_LAB_ASSET_SHA256,
    canvas: { width: blueprint.bounds.width, height: blueprint.bounds.height },
    grid: { size: blueprint.grid.size, unitsPerCell: blueprint.grid.unitsPerCell },
    walls: blueprint.walls.map((wall) => ({
      wallId: wall.wallId,
      x1: wall.a.x,
      y1: wall.a.y,
      x2: wall.b.x,
      y2: wall.b.y,
      thickness: wall.thickness,
    })),
    regions: blueprint.regions.map(rectangleRegion),
    anchors: blueprint.anchors.map((anchor) => ({
      anchorId: anchor.anchorId,
      kind: anchor.kind,
      x: anchor.position.x,
      y: anchor.position.y,
      clearance: anchor.clearance,
      ...(anchor.targetRegionId === undefined ? {} : { targetRegionId: anchor.targetRegionId }),
    })),
    sequenceGate: {
      puzzleId: plan.sequenceGate.puzzleId,
      inputAnchorIds: [...plan.sequenceGate.inputAnchorIds],
      gateAnchorId: plan.sequenceGate.gateAnchorId,
      state: plan.sequenceGate.state,
    },
    authority: {
      geometry: "spatial-blueprint-owns-geometry",
      renderer: "background-renderer-only",
      runtime: "not-modeled",
      mutation: "disabled",
    },
  };
}
