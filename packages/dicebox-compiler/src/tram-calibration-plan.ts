import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "@dicebox/core";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import { ASCENDANCY_TRAM_BOARD } from "./tram-scene-plan.js";

const rectangleSchema = z.object({
  x: z.number().finite().nonnegative(),
  y: z.number().finite().nonnegative(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
}).strict();

const pointSchema = z.object({ x: z.number().finite(), y: z.number().finite() }).strict();

const calibrationPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  operation: z.literal("tram-calibration.preview"),
  target: z.object({
    worldId: z.literal("dbx-test-world"),
    foundryVersion: z.literal("14.367"),
    systemId: z.literal("dnd5e"),
    systemVersion: z.literal("5.3.3"),
  }).strict(),
  scene: z.object({
    sceneId: StableDiceBoxIdSchema,
    label: z.literal("DiceBox Tram Coordinate Calibration"),
    canvas: z.object({ width: z.literal(1536), height: z.literal(1024) }).strict(),
    rendererPath: z.literal("assets/maps/ascendancy-tram-calibration-graybox-v1.png"),
    blueprintId: StableDiceBoxIdSchema,
    geometrySource: z.literal("ascendancy-tram-v4-spatial-blueprint"),
  }).strict(),
  walls: z.object({
    segments: z.array(z.object({
      wallId: StableDiceBoxIdSchema,
      a: pointSchema,
      b: pointSchema,
      thickness: z.number().finite().positive(),
    }).strict()).length(11),
    doors: z.array(z.object({
      anchorId: StableDiceBoxIdSchema,
      position: pointSchema,
      clearance: z.number().finite().positive(),
    }).strict()).length(3),
    api: z.literal('scene.createEmbeddedDocuments("Wall", ...)'),
  }).strict(),
  tile: z.object({
    tileId: StableDiceBoxIdSchema,
    label: z.literal("Tram projection calibration marker"),
    bounds: rectangleSchema,
    source: z.literal("canonical-tram-board-cell-projection"),
    api: z.literal('scene.createEmbeddedDocuments("Tile", ...)'),
  }).strict(),
  region: z.object({
    regionId: StableDiceBoxIdSchema,
    label: z.literal("Tram projection calibration Region"),
    bounds: rectangleSchema,
    source: z.literal("same-rectangle-as-calibration-tile"),
    shape: z.literal("rectangle"),
    api: z.literal('scene.createEmbeddedDocuments("Region", ...)'),
  }).strict(),
  reread: z.object({
    scene: z.literal("fromUuid | game.scenes.get"),
    tile: z.literal('scene.getEmbeddedDocument("Tile", id)'),
    region: z.literal('scene.getEmbeddedDocument("Region", id)'),
    comparison: z.literal("exact-x-y-width-height"),
  }).strict(),
  preservationScope: z.literal("fixture-owned-scene-and-children-only; preserve-foreign-state"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const { bounds } = value.tile;
  if (JSON.stringify(bounds) !== JSON.stringify(value.region.bounds)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["region", "bounds"], message: "Calibration Region bounds must exactly equal the functional Tile bounds." });
  }
  const boardRight = ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns;
  const boardBottom = ASCENDANCY_TRAM_BOARD.origin.y + ASCENDANCY_TRAM_BOARD.cellHeight * ASCENDANCY_TRAM_BOARD.rows;
  if (bounds.x < ASCENDANCY_TRAM_BOARD.origin.x || bounds.y < ASCENDANCY_TRAM_BOARD.origin.y
    || bounds.x + bounds.width > boardRight || bounds.y + bounds.height > boardBottom) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["tile", "bounds"], message: "Calibration Tile must remain inside the canonical 6x6 Tram board." });
  }
});

export type TramCalibrationPlan = z.infer<typeof calibrationPlanSchema>;
export const TramCalibrationPlanSchema = calibrationPlanSchema;

/** Fixture-only rehearsal: one functional Tile and one Region share exact bounds. */
export function createTramCalibrationPlan(): TramCalibrationPlan {
  const blueprint = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === createStableDiceBoxId("blueprint", "ascendancy-tram-depot"));
  if (!blueprint) throw new Error("The frozen Tram Spatial Blueprint is unavailable.");
  const bounds = {
    x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth,
    y: ASCENDANCY_TRAM_BOARD.origin.y + 2 * ASCENDANCY_TRAM_BOARD.cellHeight,
    width: 2 * ASCENDANCY_TRAM_BOARD.cellWidth,
    height: ASCENDANCY_TRAM_BOARD.cellHeight,
  };
  return calibrationPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "fixture-tram-coordinate-calibration"),
    operation: "tram-calibration.preview",
    target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
    scene: {
      sceneId: createStableDiceBoxId("scene", "fixture-tram-coordinate-calibration"),
      label: "DiceBox Tram Coordinate Calibration",
      canvas: { width: 1536, height: 1024 },
      rendererPath: "assets/maps/ascendancy-tram-calibration-graybox-v1.png",
      blueprintId: blueprint.blueprintId,
      geometrySource: "ascendancy-tram-v4-spatial-blueprint",
    },
    walls: {
      segments: blueprint.walls.map((wall) => ({ wallId: wall.wallId, a: wall.a, b: wall.b, thickness: wall.thickness })),
      doors: blueprint.anchors.filter((anchor) => anchor.kind === "door").map((anchor) => ({ anchorId: anchor.anchorId, position: anchor.position, clearance: anchor.clearance })),
      api: 'scene.createEmbeddedDocuments("Wall", ...)',
    },
    tile: {
      tileId: createStableDiceBoxId("tile", "fixture-tram-coordinate-calibration-marker"),
      label: "Tram projection calibration marker",
      bounds,
      source: "canonical-tram-board-cell-projection",
      api: 'scene.createEmbeddedDocuments("Tile", ...)',
    },
    region: {
      regionId: createStableDiceBoxId("region", "fixture-tram-coordinate-calibration-marker"),
      label: "Tram projection calibration Region",
      bounds,
      source: "same-rectangle-as-calibration-tile",
      shape: "rectangle",
      api: 'scene.createEmbeddedDocuments("Region", ...)',
    },
    reread: {
      scene: "fromUuid | game.scenes.get",
      tile: 'scene.getEmbeddedDocument("Tile", id)',
      region: 'scene.getEmbeddedDocument("Region", id)',
      comparison: "exact-x-y-width-height",
    },
    preservationScope: "fixture-owned-scene-and-children-only; preserve-foreign-state",
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateTramCalibrationPlan(input: unknown): TramCalibrationPlan {
  return calibrationPlanSchema.parse(input);
}
