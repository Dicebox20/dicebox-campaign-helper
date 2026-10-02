import { z } from "zod";
import {
  applyTramSceneMove,
  createTramSceneProjectionPlan,
  projectTramPieceToScene,
  type TramSceneProjectionPlan,
} from "./tram-scene-plan.js";
import { createTramCalibrationPlan } from "./tram-calibration-plan.js";
import { createCanonicalTramBoard, createStableDiceBoxId, tramBoardStateSchema } from "@dicebox/core";

const targetSchema = z.object({
  worldId: z.literal("dbx-test-world"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
}).strict();

const fixturePlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: z.literal("dbx:plan:fixture-tram-routing-projection"),
  operation: z.literal("tram-routing.fixture.preview"),
  target: targetSchema,
  scene: z.object({
    sceneId: z.literal("dbx:scene:fixture-tram-routing-projection"),
    label: z.literal("DiceBox Tram Routing Projection"),
    canvas: z.object({ width: z.literal(1536), height: z.literal(1024) }).strict(),
    rendererPath: z.literal("assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png"),
    blueprintId: z.string().startsWith("dbx:blueprint:"),
  }).strict(),
  walls: z.object({
    segments: z.array(z.object({ wallId: z.string().startsWith("dbx:wall:"), a: z.object({ x: z.number(), y: z.number() }).strict(), b: z.object({ x: z.number(), y: z.number() }).strict(), thickness: z.number().positive() }).strict()).length(11),
    doors: z.array(z.object({ anchorId: z.string().startsWith("dbx:anchor:"), position: z.object({ x: z.number(), y: z.number() }).strict(), clearance: z.number().positive() }).strict()).length(3),
    api: z.literal('scene.createEmbeddedDocuments("Wall", ...)'),
  }).strict(),
  staticVisualTiles: z.array(z.object({
    tileId: z.string().startsWith("dbx:tile:"), assetPath: z.string().startsWith("assets/tiles/"),
    x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(),
  }).strict()).length(5),
  staticRegions: z.array(z.object({
    regionId: z.string().startsWith("dbx:region:"), x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(),
  }).strict()).length(39),
  projection: z.custom<TramSceneProjectionPlan>(),
  initialBoard: tramBoardStateSchema,
  approvedFixtureMove: z.object({ pieceId: z.literal("dbx:tram:b"), delta: z.literal(-1) }).strict(),
  initialProjections: z.array(z.object({
    pieceId: z.string().startsWith("dbx:tram:"), tileId: z.string().startsWith("dbx:tile:"), footprintRegionId: z.string().startsWith("dbx:region:"),
    x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(),
    footprintRegion: z.object({ shape: z.literal("rectangle"), x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(), rotation: z.literal(0) }).strict(),
    occupiedRegionIds: z.array(z.string().startsWith("dbx:region:")).min(2).max(3),
    source: z.literal("logical-board"),
    foundryApis: z.tuple([z.literal('scene.updateEmbeddedDocuments("Tile", ...)'), z.literal('scene.updateEmbeddedDocuments("Region", ...)')]),
  }).strict()).length(6),
  approvedMoveProjection: z.object({
    pieceId: z.literal("dbx:tram:b"), tileId: z.literal("dbx:tile:tram-b"), footprintRegionId: z.literal("dbx:region:tram-b-footprint"),
    x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(),
    footprintRegion: z.object({ shape: z.literal("rectangle"), x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive(), rotation: z.literal(0) }).strict(),
    occupiedRegionIds: z.array(z.string().startsWith("dbx:region:")).min(2).max(3),
    source: z.literal("logical-board"),
    foundryApis: z.tuple([z.literal('scene.updateEmbeddedDocuments("Tile", ...)'), z.literal('scene.updateEmbeddedDocuments("Region", ...)')]),
  }).strict(),
  preservationScope: z.literal("fixture-owned-scene-and-children-only; preserve-foreign-state; no-ballad; no-regionwright"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  for (const projection of value.initialProjections) {
    const bounds = projection.footprintRegion;
    if (projection.x !== bounds.x || projection.y !== bounds.y || projection.width !== bounds.width || projection.height !== bounds.height) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["initialProjections"], message: "Every functional Tile and paired Region must use identical bounds." });
    }
  }
  const staticRegionIds = new Set(value.staticRegions.map((region) => region.regionId));
  if (staticRegionIds.size !== 39) context.addIssue({ code: z.ZodIssueCode.custom, path: ["staticRegions"], message: "Every fixed Tram Region must have a unique stable ID." });
  const moved = value.approvedMoveProjection.footprintRegion;
  if (value.approvedMoveProjection.x !== moved.x || value.approvedMoveProjection.y !== moved.y || value.approvedMoveProjection.width !== moved.width || value.approvedMoveProjection.height !== moved.height) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["approvedMoveProjection"], message: "The moved functional Tile and paired Region must use identical bounds." });
  }
});

export type TramRoutingFixturePlan = z.infer<typeof fixturePlanSchema>;

/**
 * A fixed, disposable-world rehearsal package. It deliberately stores one
 * solver-approved move rather than reproducing Rush Hour rules in a browser
 * adapter. The shared core solver remains the owner of legal move semantics.
 */
export function createTramRoutingFixturePlan(): TramRoutingFixturePlan {
  const calibration = createTramCalibrationPlan();
  const projection = createTramSceneProjectionPlan({
    scene: { id: createStableDiceBoxId("scene", "fixture-tram-routing-projection"), kind: "scene" },
    backgroundAsset: { id: createStableDiceBoxId("asset", "fixture-tram-routing-v6"), kind: "asset" },
  });
  const initialBoard = tramBoardStateSchema.parse({
    ...createCanonicalTramBoard(),
    pieces: createCanonicalTramBoard().pieces.map((piece) => ({ ...piece, repaired: true, operational: true })),
  });
  const initialProjections = initialBoard.pieces.map((piece) => {
    return projectTramPieceToScene(projection, initialBoard, piece.pieceId);
  });
  const approvedFixtureMove = { pieceId: createStableDiceBoxId("tram", "b"), delta: -1 } as const;
  const approvedMoveProjection = applyTramSceneMove(projection, initialBoard, approvedFixtureMove).projection;
  return fixturePlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: "dbx:plan:fixture-tram-routing-projection",
    operation: "tram-routing.fixture.preview",
    target: calibration.target,
    scene: {
      sceneId: "dbx:scene:fixture-tram-routing-projection",
      label: "DiceBox Tram Routing Projection",
      canvas: calibration.scene.canvas,
      rendererPath: "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
      blueprintId: calibration.scene.blueprintId,
    },
    walls: calibration.walls,
    staticVisualTiles: [
      { tileId: "dbx:tile:tram-rail-grid", assetPath: "assets/tiles/ascendancy-tram-rail-grid-v3.svg", x: 420, y: 210, width: 660, height: 570 },
      { tileId: "dbx:tile:tram-core-rail", assetPath: "assets/tiles/ascendancy-tram-core-rail-v2.svg", x: 1080, y: 400, width: 432, height: 95 },
      { tileId: "dbx:tile:tram-gate-ingress", assetPath: "assets/tiles/ascendancy-tram-gate-v2.svg", x: 408, y: 400, width: 24, height: 95 },
      { tileId: "dbx:tile:tram-gate-yard-exit", assetPath: "assets/tiles/ascendancy-tram-gate-v2.svg", x: 1068, y: 400, width: 24, height: 95 },
      { tileId: "dbx:tile:tram-gate-core-door", assetPath: "assets/tiles/ascendancy-tram-gate-v2.svg", x: 1500, y: 400, width: 24, height: 95 },
    ],
    staticRegions: [
      ...projection.anchors.map((anchor) => ({
        regionId: anchor.regionId,
        x: projection.logicalBoard.origin.x + anchor.column * projection.logicalBoard.cellWidth,
        y: projection.logicalBoard.origin.y + anchor.row * projection.logicalBoard.cellHeight,
        width: projection.logicalBoard.cellWidth,
        height: projection.logicalBoard.cellHeight,
      })),
      { regionId: "dbx:region:tram-dalton-repair", x: 1120, y: 120, width: 300, height: 220 },
      { regionId: "dbx:region:tram-cooperative", x: 1120, y: 640, width: 300, height: 220 },
      { regionId: "dbx:region:tram-exit", x: 1080, y: 400, width: 390, height: 95 },
    ],
    projection,
    initialBoard,
    approvedFixtureMove,
    initialProjections,
    approvedMoveProjection,
    preservationScope: "fixture-owned-scene-and-children-only; preserve-foreign-state; no-ballad; no-regionwright",
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function validateTramRoutingFixturePlan(input: unknown): TramRoutingFixturePlan {
  return fixturePlanSchema.parse(input);
}
