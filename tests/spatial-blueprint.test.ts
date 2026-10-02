import { describe, expect, it } from "vitest";
import {
  createSpatialBlueprint,
  validateSpatialBlueprint,
} from "@dicebox/compiler";
import { createStableDiceBoxId } from "@dicebox/core";

const levelId = createStableDiceBoxId("level", "ground");
const regionId = createStableDiceBoxId("region", "entry");

function blueprint() {
  return createSpatialBlueprint({
    blueprintId: createStableDiceBoxId("blueprint", "room"),
    name: "Entry Room",
    origin: { x: 100, y: 200 },
    bounds: { width: 20, height: 12 },
    grid: { size: 100, unitsPerCell: 5 },
    scale: { pixelsPerUnit: 20, unit: "feet" },
    levels: [{ levelId, label: "Ground", elevation: 0 }],
    walls: [{
      wallId: createStableDiceBoxId("wall", "north"),
      levelId,
      a: { x: 0, y: 0 },
      b: { x: 20, y: 0 },
      thickness: 0.2,
    }],
    regions: [{
      regionId,
      label: "Entry",
      shapes: [{
        shapeId: createStableDiceBoxId("shape", "entry-rectangle"),
        kind: "rectangle",
        levelId,
        x: 2,
        y: 2,
        width: 4,
        height: 3,
      }],
    }],
    anchors: [{
      anchorId: createStableDiceBoxId("anchor", "door"),
      kind: "door",
      levelId,
      position: { x: 2, y: 0 },
      clearance: 1,
      targetRegionId: regionId,
    }],
  });
}

describe("Spatial Blueprint validator", () => {
  it("preserves geometry authority, levels, regions, walls, and anchors", () => {
    const result = blueprint();

    expect(result.schemaVersion).toBe("0.1.0");
    expect(result.origin).toEqual({ x: 100, y: 200 });
    expect(result.walls).toHaveLength(1);
    expect(result.regions[0]?.shapes[0]?.kind).toBe("rectangle");
    expect(result.anchors[0]?.targetRegionId).toBe(regionId);
    expect(validateSpatialBlueprint(result)).toEqual(result);
  });

  it("accepts positive rectangles, ellipses, and non-degenerate polygons", () => {
    const base = blueprint();
    const result = createSpatialBlueprint({
      ...base,
      regions: [{
        regionId,
        label: "Mixed geometry",
        shapes: [
          { shapeId: createStableDiceBoxId("shape", "rect"), kind: "rectangle", levelId, x: 0, y: 0, width: 2, height: 2 },
          { shapeId: createStableDiceBoxId("shape", "ellipse"), kind: "ellipse", levelId, x: 3, y: 0, width: 2, height: 2 },
          { shapeId: createStableDiceBoxId("shape", "polygon"), kind: "polygon", levelId, points: [{ x: 6, y: 0 }, { x: 8, y: 0 }, { x: 7, y: 2 }] },
          { shapeId: createStableDiceBoxId("shape", "hole"), kind: "rectangle", levelId, x: 6.5, y: 0.5, width: 0.5, height: 0.5, hole: true },
        ],
      }],
    });

    expect(result.regions[0]?.shapes).toHaveLength(4);
  });

  it("rejects duplicate identities, missing levels, zero-length walls, and out-of-bounds geometry", () => {
    const base = blueprint();
    const baseWall = base.walls[0]!;
    const baseAnchor = base.anchors[0]!;
    const baseRegion = base.regions[0]!;
    const baseShape = baseRegion.shapes[0]!;
    expect(() => createSpatialBlueprint({
      ...base,
      walls: [{ ...baseWall, a: { x: 1, y: 1 }, b: { x: 1, y: 1 } }],
      anchors: [{ ...baseAnchor, levelId: createStableDiceBoxId("level", "missing") }],
    })).toThrow();

    expect(() => createSpatialBlueprint({
      ...base,
      regions: [{
        ...baseRegion,
        shapes: [{
          shapeId: baseShape.shapeId,
          kind: "rectangle",
          levelId: baseShape.levelId,
          x: 19,
          y: 10,
          width: 4,
          height: 4,
        }],
      }],
    })).toThrow(/bounds/);
  });

  it("requires a positive region shape and rejects degenerate polygons or invalid anchor targets", () => {
    const base = blueprint();
    const baseRegion = base.regions[0]!;
    const baseShape = baseRegion.shapes[0]!;
    const baseAnchor = base.anchors[0]!;
    expect(() => createSpatialBlueprint({
      ...base,
      regions: [{
        ...baseRegion,
        shapes: [{ ...baseShape, hole: true }],
      }],
    })).toThrow(/positive shape/);

    expect(() => createSpatialBlueprint({
      ...base,
      regions: [{
        ...baseRegion,
        shapes: [{ shapeId: createStableDiceBoxId("shape", "flat"), kind: "polygon", levelId, points: [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }] }],
      }],
      anchors: [{ ...baseAnchor, targetRegionId: createStableDiceBoxId("region", "missing") }],
    })).toThrow();
  });

  it("rejects arbitrary fields and non-positive clearances", () => {
    const base = blueprint();
    const baseAnchor = base.anchors[0]!;
    expect(() => validateSpatialBlueprint({ ...base, unsafeExecute: "new Function('return true')" })).toThrow();
    expect(() => createSpatialBlueprint({
      ...base,
      anchors: [{ ...baseAnchor, clearance: 0 }],
    })).toThrow();
  });
});
