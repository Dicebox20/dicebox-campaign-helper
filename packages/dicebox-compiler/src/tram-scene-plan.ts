import { z } from "zod";
import {
  StableDiceBoxIdSchema,
  createStableDiceBoxId,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { applyTramMove, createCanonicalTramBoard, tramBoardStateSchema, type TramBoardState, type TramMove, type TramPiece } from "@dicebox/core";

const pointSchema = z.object({ x: z.number().finite(), y: z.number().finite() }).strict();
const canvasSchema = z.object({ width: z.literal(1536), height: z.literal(1024) }).strict();
const footprintSchema = z.object({
  origin: pointSchema,
  cellWidth: z.number().finite().positive(),
  cellHeight: z.number().finite().positive(),
  columns: z.literal(6),
  rows: z.literal(6),
}).strict().superRefine((value, context) => {
  if (value.origin.x + value.cellWidth * value.columns > 1536 || value.origin.y + value.cellHeight * value.rows > 1024) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["origin"], message: "The logical tram footprint must remain inside the generated 1536×1024 Scene canvas." });
  }
});

const anchorSchema = z.object({
  anchorId: StableDiceBoxIdSchema,
  regionId: StableDiceBoxIdSchema,
  row: z.number().int().min(0).max(5),
  column: z.number().int().min(0).max(5),
  center: pointSchema,
}).strict();

const rendererRequirementsSchema = z.object({
  projection: z.literal("orthographic-top-down"),
  noPerspective: z.literal(true),
  backgroundRole: z.literal("renderer-only"),
  visibleWalls: z.literal(true),
  visibleDoors: z.literal(true),
  trackLayout: z.object({
    kind: z.literal("enclosed-six-by-six-orthogonal-routing-yard"),
    rows: z.literal(6),
    columns: z.literal(6),
    boardOrigin: pointSchema,
    cellWidth: z.number().finite().positive(),
    cellHeight: z.number().finite().positive(),
    fixedTramCars: z.literal("tile-projection-only"),
    noFootBypass: z.literal(true),
    ingress: z.object({ anchorId: StableDiceBoxIdSchema, position: pointSchema }).strict(),
    exit: z.object({ anchorId: StableDiceBoxIdSchema, position: pointSchema, destination: z.literal("core-controls-rail") }).strict(),
    coreRail: z.object({ from: pointSchema, to: pointSchema }).strict(),
  }).strict(),
}).strict();

const tileProjectionSchema = z.object({
  owner: z.literal("foundry-scene-tile-projection"),
  source: z.literal("canonical-logical-board"),
  fixedTramCars: z.literal("tile-projection-only"),
  tileCreateApi: z.literal('scene.createEmbeddedDocuments("Tile", ...)'),
  regionCreateApi: z.literal('scene.createEmbeddedDocuments("Region", ...)'),
  tileMoveApi: z.literal('scene.updateEmbeddedDocuments("Tile", ...)'),
  regionMoveApi: z.literal('scene.updateEmbeddedDocuments("Region", ...)'),
  footprintOwner: z.literal("dicebox-scene-engine"),
  pieces: z.array(z.object({
    tileId: StableDiceBoxIdSchema,
    footprintRegionId: StableDiceBoxIdSchema,
    tramId: StableDiceBoxIdSchema,
    orientation: z.enum(["horizontal", "vertical"]),
    length: z.union([z.literal(2), z.literal(3)]),
  }).strict()).length(6),
}).strict().superRefine((value, context) => {
  const ids = new Set<string>();
  for (const [index, piece] of value.pieces.entries()) {
    for (const [field, stableId] of [["tileId", piece.tileId], ["footprintRegionId", piece.footprintRegionId], ["tramId", piece.tramId]] as const) {
      if (ids.has(stableId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["pieces", index, field], message: "Every Tram Tile, footprint Region, and solver piece must have a distinct stable ID." });
      ids.add(stableId);
    }
  }
});

export const tramSceneProjectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  operation: z.literal("tram-scene.projection.preview"),
  scene: z.object({ semantic: z.object({ id: StableDiceBoxIdSchema, kind: z.literal("scene") }).strict(), expectedBindingGeneration: z.literal(0) }).strict(),
  backgroundAsset: z.object({ semantic: z.object({ id: StableDiceBoxIdSchema, kind: z.literal("asset") }).strict(), expectedWidth: z.literal(1536), expectedHeight: z.literal(1024) }).strict(),
  canvas: canvasSchema,
  logicalBoard: footprintSchema,
  rendererRequirements: rendererRequirementsSchema,
  tileProjection: tileProjectionSchema,
  anchors: z.array(anchorSchema).length(36),
  exitRegionId: StableDiceBoxIdSchema,
  geometryOwner: z.literal("spatial-blueprint"),
  tileOwner: z.literal("foundry-scene-tile-projection"),
  foundryApis: z.array(z.string().min(1)).min(8).max(16),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const seen = new Set<string>();
  for (const [index, anchor] of value.anchors.entries()) {
    if (seen.has(anchor.anchorId) || seen.has(anchor.regionId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["anchors", index], message: "Tram anchors and Regions must be unique." });
    seen.add(anchor.anchorId);
    seen.add(anchor.regionId);
    const expectedX = value.logicalBoard.origin.x + (anchor.column + 0.5) * value.logicalBoard.cellWidth;
    const expectedY = value.logicalBoard.origin.y + (anchor.row + 0.5) * value.logicalBoard.cellHeight;
    if (anchor.center.x !== expectedX || anchor.center.y !== expectedY) context.addIssue({ code: z.ZodIssueCode.custom, path: ["anchors", index, "center"], message: "Anchor center must be derived from the logical board footprint." });
  }
});

export type TramSceneProjectionPlan = z.infer<typeof tramSceneProjectionPlanSchema>;

/**
 * The routing board is a frozen geometry contract. Renderer pixels, Tile
 * positions, Regions, and rail gates all derive from these values.
 */
export const ASCENDANCY_TRAM_BOARD = Object.freeze({
  origin: Object.freeze({ x: 420, y: 210 }),
  cellWidth: 110,
  cellHeight: 95,
  columns: 6 as const,
  rows: 6 as const,
});

/** X exits from logical row 3 (zero-based row 2) onto the Core rail. */
export const ASCENDANCY_TRAM_CORE_RAIL = Object.freeze({
  ingress: Object.freeze({ x: 420, y: 447.5 }),
  exit: Object.freeze({ x: 1080, y: 447.5 }),
  outerDoor: Object.freeze({ x: 1512, y: 447.5 }),
});

/**
 * Cross-scene topology is part of the Blueprint contract, not renderer art.
 * The Tram is west of Core: its eastward rail enters the Core west wall on
 * the same centerline.  Other Core routes retain separate evidence paths.
 */
export const ASCENDANCY_TRAM_CORE_ADJACENCY = Object.freeze({
  relation: "tram-west-of-core" as const,
  tramDoor: Object.freeze({ side: "east" as const, position: { ...ASCENDANCY_TRAM_CORE_RAIL.outerDoor } }),
  coreDoor: Object.freeze({ side: "west" as const, position: { x: 24, y: ASCENDANCY_TRAM_CORE_RAIL.outerDoor.y } }),
});

const foundryApis = [
  "Hooks.once(\"ready\")",
  "game.version + game.system.id + game.system.version",
  "game.users.activeGM / User permissions",
  "fromUuid | game.scenes.get",
  "scene.getEmbeddedCollection(\"Tile\")",
  "scene.getEmbeddedCollection(\"Region\")",
  "scene.getEmbeddedDocument(\"Region\", id)",
  "RegionDocument.shapes | RegionDocument.behaviors",
  "scene.createEmbeddedDocuments(\"Tile\", ...)",
  "scene.createEmbeddedDocuments(\"Region\", ...)",
  'scene.updateEmbeddedDocuments("Tile", ...)',
  'scene.updateEmbeddedDocuments("Region", ...)',
  "authoritative reread through fromUuid / embedded-document getters",
] as const;

export function createTramSceneProjectionPlan(input: {
  readonly scene: SemanticRef;
  readonly backgroundAsset: SemanticRef;
}): TramSceneProjectionPlan {
  if (input.scene.kind !== "scene") throw new Error("Tram Scene projection requires a Scene semantic reference.");
  if (input.backgroundAsset.kind !== "asset") throw new Error("Tram Scene projection requires an asset semantic reference.");
  const logicalBoard = {
    origin: { ...ASCENDANCY_TRAM_BOARD.origin },
    cellWidth: ASCENDANCY_TRAM_BOARD.cellWidth,
    cellHeight: ASCENDANCY_TRAM_BOARD.cellHeight,
    columns: ASCENDANCY_TRAM_BOARD.columns,
    rows: ASCENDANCY_TRAM_BOARD.rows,
  };
  const anchors = [];
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      anchors.push({
        anchorId: createStableDiceBoxId("anchor", `tram-slot-r${row + 1}-c${column + 1}`),
        regionId: createStableDiceBoxId("region", `tram-slot-r${row + 1}-c${column + 1}`),
        row,
        column,
        center: { x: logicalBoard.origin.x + (column + 0.5) * logicalBoard.cellWidth, y: logicalBoard.origin.y + (row + 0.5) * logicalBoard.cellHeight },
      });
    }
  }
  return tramSceneProjectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "tram-scene-projection"),
    operation: "tram-scene.projection.preview",
    scene: { semantic: input.scene, expectedBindingGeneration: 0 },
    backgroundAsset: { semantic: input.backgroundAsset, expectedWidth: 1536, expectedHeight: 1024 },
    canvas: { width: 1536, height: 1024 },
    logicalBoard,
    rendererRequirements: {
      projection: "orthographic-top-down",
      noPerspective: true,
      backgroundRole: "renderer-only",
      visibleWalls: true,
      visibleDoors: true,
      trackLayout: {
        kind: "enclosed-six-by-six-orthogonal-routing-yard",
        rows: logicalBoard.rows,
        columns: logicalBoard.columns,
        boardOrigin: logicalBoard.origin,
        cellWidth: logicalBoard.cellWidth,
        cellHeight: logicalBoard.cellHeight,
        fixedTramCars: "tile-projection-only",
        noFootBypass: true,
        ingress: { anchorId: createStableDiceBoxId("anchor", "tram-yard-ingress"), position: { ...ASCENDANCY_TRAM_CORE_RAIL.ingress } },
        exit: { anchorId: createStableDiceBoxId("anchor", "tram-yard-exit"), position: { ...ASCENDANCY_TRAM_CORE_RAIL.exit }, destination: "core-controls-rail" },
        coreRail: { from: { ...ASCENDANCY_TRAM_CORE_RAIL.exit }, to: { ...ASCENDANCY_TRAM_CORE_RAIL.outerDoor } },
      },
    },
    tileProjection: {
      owner: "foundry-scene-tile-projection",
      source: "canonical-logical-board",
      fixedTramCars: "tile-projection-only",
      tileCreateApi: 'scene.createEmbeddedDocuments("Tile", ...)',
      regionCreateApi: 'scene.createEmbeddedDocuments("Region", ...)',
      tileMoveApi: 'scene.updateEmbeddedDocuments("Tile", ...)',
      regionMoveApi: 'scene.updateEmbeddedDocuments("Region", ...)',
      footprintOwner: "dicebox-scene-engine",
      pieces: createCanonicalTramBoard().pieces.map((piece) => ({
        tileId: createStableDiceBoxId("tile", `tram-${piece.pieceId.split(":").at(-1)}`),
        footprintRegionId: createStableDiceBoxId("region", `tram-${piece.pieceId.split(":").at(-1)}-footprint`),
        tramId: piece.pieceId,
        orientation: piece.orientation,
        length: piece.length,
      })),
    },
    anchors,
    exitRegionId: createStableDiceBoxId("region", "tram-exit"),
    geometryOwner: "spatial-blueprint",
    tileOwner: "foundry-scene-tile-projection",
    foundryApis: [...foundryApis],
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function projectTramPieceToScene(planInput: TramSceneProjectionPlan, boardInput: TramBoardState, pieceId: TramPiece["pieceId"]): {
  readonly pieceId: TramPiece["pieceId"];
  readonly tileId: StableDiceBoxId;
  readonly footprintRegionId: StableDiceBoxId;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly footprintRegion: { readonly shape: "rectangle"; readonly x: number; readonly y: number; readonly width: number; readonly height: number; readonly rotation: 0 };
  readonly occupiedRegionIds: readonly StableDiceBoxId[];
  readonly source: "logical-board";
  readonly foundryApis: readonly ['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)'];
} {
  const plan = tramSceneProjectionPlanSchema.parse(planInput);
  const board = tramBoardStateSchema.parse(boardInput);
  const piece = board.pieces.find((candidate) => candidate.pieceId === pieceId);
  if (!piece) throw new Error("Cannot project an unknown tram piece.");
  const projectionPiece = plan.tileProjection.pieces.find((candidate) => candidate.tramId === pieceId);
  if (!projectionPiece) throw new Error("Cannot project a Tram piece without a paired Tile and footprint Region.");
  const occupiedRegionIds: StableDiceBoxId[] = [];
  for (let row = piece.row; row < piece.row + (piece.orientation === "vertical" ? piece.length : 1); row += 1) {
    for (let column = piece.column; column < piece.column + (piece.orientation === "horizontal" ? piece.length : 1); column += 1) {
      const anchor = plan.anchors.find((candidate) => candidate.row === row && candidate.column === column);
      if (!anchor) throw new Error("Tram piece projects outside the planned Scene anchors.");
      occupiedRegionIds.push(anchor.regionId);
    }
  }
  const x = plan.logicalBoard.origin.x + piece.column * plan.logicalBoard.cellWidth;
  const y = plan.logicalBoard.origin.y + piece.row * plan.logicalBoard.cellHeight;
  const width = piece.orientation === "horizontal" ? piece.length * plan.logicalBoard.cellWidth : plan.logicalBoard.cellWidth;
  const height = piece.orientation === "vertical" ? piece.length * plan.logicalBoard.cellHeight : plan.logicalBoard.cellHeight;
  return {
    pieceId,
    tileId: projectionPiece.tileId,
    footprintRegionId: projectionPiece.footprintRegionId,
    x,
    y,
    width,
    height,
    footprintRegion: { shape: "rectangle", x, y, width, height, rotation: 0 },
    occupiedRegionIds,
    source: "logical-board",
    foundryApis: ['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)'],
  };
}

export function applyTramSceneMove(planInput: TramSceneProjectionPlan, boardInput: TramBoardState, move: TramMove): { readonly board: TramBoardState; readonly projection: ReturnType<typeof projectTramPieceToScene>; readonly status: TramBoardState["status"]; readonly foundryApis: readonly ['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)'] } {
  const plan = tramSceneProjectionPlanSchema.parse(planInput);
  const board = tramBoardStateSchema.parse(boardInput);
  const nextBoard = applyTramMove(board, move);
  return {
    board: nextBoard,
    projection: projectTramPieceToScene(plan, nextBoard, move.pieceId),
    status: nextBoard.status,
    foundryApis: ['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)'],
  };
}

export function validateTramSceneProjectionPlan(input: unknown): TramSceneProjectionPlan {
  return tramSceneProjectionPlanSchema.parse(input);
}
