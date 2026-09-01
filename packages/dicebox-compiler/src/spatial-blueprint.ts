import { z } from "zod";
import {
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type StableDiceBoxId,
} from "@dicebox/core";

const finiteNumber = z.number().finite();

export const spatialPointSchema = z.object({
  x: finiteNumber,
  y: finiteNumber,
}).strict();

const levelSchema = z.object({
  levelId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  elevation: finiteNumber,
  bottom: finiteNumber.optional(),
  top: finiteNumber.optional(),
}).strict().superRefine((value, context) => {
  if (value.bottom !== undefined && value.top !== undefined && value.bottom >= value.top) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["bottom"],
      message: "A level bottom must be below its top.",
    });
  }
});

const commonShapeFields = {
  shapeId: StableDiceBoxIdSchema,
  hole: z.boolean().default(false),
  levelId: StableDiceBoxIdSchema,
  elevation: finiteNumber.optional(),
};

const rectangleShapeSchema = z.object({
  ...commonShapeFields,
  kind: z.literal("rectangle"),
  x: finiteNumber,
  y: finiteNumber,
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
}).strict();

const ellipseShapeSchema = z.object({
  ...commonShapeFields,
  kind: z.literal("ellipse"),
  x: finiteNumber,
  y: finiteNumber,
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
}).strict();

const polygonShapeSchema = z.object({
  ...commonShapeFields,
  kind: z.literal("polygon"),
  points: z.array(spatialPointSchema).min(3).max(4096),
}).strict();

export const spatialShapeSchema = z.discriminatedUnion("kind", [
  rectangleShapeSchema,
  ellipseShapeSchema,
  polygonShapeSchema,
]);

export const spatialWallSchema = z.object({
  wallId: StableDiceBoxIdSchema,
  levelId: StableDiceBoxIdSchema,
  a: spatialPointSchema,
  b: spatialPointSchema,
  thickness: z.number().finite().positive(),
}).strict();

export const spatialRegionSchema = z.object({
  regionId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  shapes: z.array(spatialShapeSchema).min(1).max(256),
}).strict().superRefine((value, context) => {
  if (value.shapes.every((shape) => shape.hole)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["shapes"],
      message: "A Region must contain at least one positive shape before holes are applied.",
    });
  }
});

export const spatialAnchorSchema = z.object({
  anchorId: StableDiceBoxIdSchema,
  kind: z.enum(["door", "entrance", "interaction", "spawn"]),
  levelId: StableDiceBoxIdSchema,
  position: spatialPointSchema,
  clearance: z.number().finite().positive(),
  targetRegionId: StableDiceBoxIdSchema.optional(),
}).strict();

export const spatialBlueprintSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  blueprintId: StableDiceBoxIdSchema,
  name: z.string().min(1),
  origin: spatialPointSchema,
  bounds: z.object({
    width: z.number().finite().positive(),
    height: z.number().finite().positive(),
  }).strict(),
  grid: z.object({
    size: z.number().finite().positive(),
    unitsPerCell: z.number().finite().positive(),
  }).strict(),
  scale: z.object({
    pixelsPerUnit: z.number().finite().positive(),
    unit: z.string().min(1),
  }).strict(),
  levels: z.array(levelSchema).min(1).max(64),
  walls: z.array(spatialWallSchema).max(5000),
  regions: z.array(spatialRegionSchema).max(2000),
  anchors: z.array(spatialAnchorSchema).max(5000),
}).strict().superRefine((value, context) => {
  const levelIds = new Set<string>();
  const ownedIds = new Set<string>();
  for (const [index, level] of value.levels.entries()) {
    if (levelIds.has(level.levelId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["levels", index, "levelId"], message: "Level identities must be unique." });
    }
    levelIds.add(level.levelId);
    if (ownedIds.has(level.levelId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["levels", index, "levelId"], message: "Blueprint identities must be globally unique." });
    }
    ownedIds.add(level.levelId);
  }

  const claimId = (id: string, path: (string | number)[]) => {
    if (ownedIds.has(id)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path, message: "Blueprint identities must be globally unique." });
    }
    ownedIds.add(id);
  };
  const inBounds = (point: { x: number; y: number }) =>
    point.x >= 0 && point.y >= 0 && point.x <= value.bounds.width && point.y <= value.bounds.height;
  const polygonArea = (points: readonly { x: number; y: number }[]) => {
    let area = 0;
    for (let index = 0; index < points.length; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % points.length];
      if (current && next) area += current.x * next.y - next.x * current.y;
    }
    return Math.abs(area) / 2;
  };

  const checkLevel = (levelId: string, path: (string | number)[]) => {
    if (!levelIds.has(levelId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path, message: "Geometry must reference a declared level." });
    }
  };
  const checkPoint = (point: { x: number; y: number }, path: (string | number)[]) => {
    if (!inBounds(point)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path, message: "Geometry must remain within blueprint bounds." });
    }
  };

  for (const [index, wall] of value.walls.entries()) {
    claimId(wall.wallId, ["walls", index, "wallId"]);
    checkLevel(wall.levelId, ["walls", index, "levelId"]);
    checkPoint(wall.a, ["walls", index, "a"]);
    checkPoint(wall.b, ["walls", index, "b"]);
    if (wall.a.x === wall.b.x && wall.a.y === wall.b.y) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["walls", index], message: "A wall segment must have non-zero length." });
    }
  }

  const regionIds = new Set<string>();
  for (const [regionIndex, region] of value.regions.entries()) {
    claimId(region.regionId, ["regions", regionIndex, "regionId"]);
    regionIds.add(region.regionId);
    for (const [shapeIndex, shape] of region.shapes.entries()) {
      claimId(shape.shapeId, ["regions", regionIndex, "shapes", shapeIndex, "shapeId"]);
      checkLevel(shape.levelId, ["regions", regionIndex, "shapes", shapeIndex, "levelId"]);
      if (shape.kind === "rectangle" || shape.kind === "ellipse") {
        if (shape.x < 0 || shape.y < 0
          || shape.x + shape.width > value.bounds.width
          || shape.y + shape.height > value.bounds.height) {
          context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", regionIndex, "shapes", shapeIndex], message: "Shape bounds must remain within the blueprint." });
        }
      } else {
        for (const [pointIndex, point] of shape.points.entries()) {
          checkPoint(point, ["regions", regionIndex, "shapes", shapeIndex, "points", pointIndex]);
        }
        if (polygonArea(shape.points) === 0) {
          context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", regionIndex, "shapes", shapeIndex, "points"], message: "A polygon must enclose non-zero area." });
        }
      }
    }
  }

  for (const [index, anchor] of value.anchors.entries()) {
    claimId(anchor.anchorId, ["anchors", index, "anchorId"]);
    checkLevel(anchor.levelId, ["anchors", index, "levelId"]);
    checkPoint(anchor.position, ["anchors", index, "position"]);
    if (anchor.targetRegionId !== undefined && !regionIds.has(anchor.targetRegionId)) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["anchors", index, "targetRegionId"], message: "Anchor targetRegionId must reference a declared Region." });
    }
  }
});

export type SpatialPoint = z.infer<typeof spatialPointSchema>;
export type SpatialShape = z.infer<typeof spatialShapeSchema>;
export type SpatialWall = z.infer<typeof spatialWallSchema>;
export type SpatialRegion = z.infer<typeof spatialRegionSchema>;
export type SpatialAnchor = z.infer<typeof spatialAnchorSchema>;
export type SpatialBlueprint = z.infer<typeof spatialBlueprintSchema>;

export function createSpatialBlueprint(
  input: Omit<z.input<typeof spatialBlueprintSchema>, "schemaVersion">,
): SpatialBlueprint {
  return spatialBlueprintSchema.parse({ schemaVersion: "0.1.0", ...input });
}

export function validateSpatialBlueprint(input: unknown): SpatialBlueprint {
  return spatialBlueprintSchema.parse(input);
}
