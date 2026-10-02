import type { AscendancyRegionPlan } from "./ascendancy-region-plan.js";
import type { SpatialAnchor, SpatialBlueprint, SpatialPoint } from "./spatial-blueprint.js";

/**
 * Universal VTT is an interchange format, not DiceBox geometry authority.
 * It carries a flattened background plus walls and portals for Universal
 * Battlemap Importer. Regions and their stable IDs are emitted separately so
 * an import cannot silently erase DiceBox ownership or coordinate semantics.
 */
export const UNIVERSAL_VTT_FORMAT = 0.2 as const;

export interface UniversalVttPoint {
  readonly x: number;
  readonly y: number;
}

export interface UniversalVttPortal {
  readonly position: UniversalVttPoint;
  readonly bounds: readonly [UniversalVttPoint, UniversalVttPoint];
  readonly closed: true;
}

export interface UniversalVttGeometry {
  readonly format: typeof UNIVERSAL_VTT_FORMAT;
  readonly resolution: {
    readonly map_origin: UniversalVttPoint;
    readonly map_size: UniversalVttPoint;
    readonly pixels_per_grid: number;
  };
  readonly line_of_sight: readonly (readonly [UniversalVttPoint, UniversalVttPoint])[];
  readonly portals: readonly UniversalVttPortal[];
  readonly lights: readonly [];
}

export interface DiceBoxUniversalBattlemapSidecar {
  readonly schemaVersion: "0.1.0";
  readonly kind: "dicebox-universal-battlemap-region-sidecar";
  readonly geometryOwner: "spatial-blueprint";
  readonly source: {
    readonly blueprintId: string;
    readonly regionPlanId: string;
    readonly roomId: string;
    readonly sceneId: string;
    readonly rendererPath: string;
    readonly rendererSha256: string;
    readonly width: number;
    readonly height: number;
  };
  readonly regions: readonly {
    readonly regionId: string;
    readonly label: string;
    readonly bounds: Readonly<{ x: number; y: number; width: number; height: number }>;
    readonly interaction: string;
    readonly owner: string;
    readonly behaviorBinding: string | null;
  }[];
  readonly importBoundary: "Universal VTT does not carry DiceBox Regions, RegionBehaviors, puzzle state, or Foundry UUID bindings.";
}

export interface UniversalBattlemapExport {
  readonly uvtt: UniversalVttGeometry;
  readonly regionSidecar: DiceBoxUniversalBattlemapSidecar;
}

function samePoint(a: SpatialPoint, b: SpatialPoint) {
  return a.x === b.x && a.y === b.y;
}

function toGrid(point: SpatialPoint, blueprint: SpatialBlueprint): UniversalVttPoint {
  return {
    x: (point.x - blueprint.origin.x) / blueprint.grid.size,
    y: (point.y - blueprint.origin.y) / blueprint.grid.size,
  };
}

function isHorizontalDoor(anchor: SpatialAnchor, blueprint: SpatialBlueprint) {
  const adjacentWallIsHorizontal = blueprint.walls.some((wall) =>
    wall.a.y === anchor.position.y && wall.b.y === anchor.position.y,
  );
  const adjacentWallIsVertical = blueprint.walls.some((wall) =>
    wall.a.x === anchor.position.x && wall.b.x === anchor.position.x,
  );
  if (adjacentWallIsHorizontal === adjacentWallIsVertical) {
    throw new Error(`Cannot determine portal orientation for ${anchor.anchorId} from ${blueprint.blueprintId} walls.`);
  }
  return adjacentWallIsHorizontal;
}

function portal(anchor: SpatialAnchor, blueprint: SpatialBlueprint): UniversalVttPortal {
  const center = toGrid(anchor.position, blueprint);
  const clearance = anchor.clearance / blueprint.grid.size;
  const bounds: readonly [UniversalVttPoint, UniversalVttPoint] = isHorizontalDoor(anchor, blueprint)
    ? [{ x: center.x - clearance, y: center.y }, { x: center.x + clearance, y: center.y }]
    : [{ x: center.x, y: center.y - clearance }, { x: center.x, y: center.y + clearance }];
  return { position: center, bounds, closed: true };
}

function assertMatchingPlan(blueprint: SpatialBlueprint, regionPlan: AscendancyRegionPlan) {
  const blueprintKey = blueprint.blueprintId.replace("dbx:blueprint:", "");
  const roomKey = regionPlan.roomId.replace("dbx:room:", "");
  if (blueprintKey !== roomKey) {
    throw new Error(`Universal VTT export requires matching Blueprint and Region plan rooms; got ${blueprint.blueprintId} and ${regionPlan.roomId}.`);
  }
  if (blueprint.bounds.width !== regionPlan.canvas.width || blueprint.bounds.height !== regionPlan.canvas.height) {
    throw new Error(`Universal VTT export requires matching canvas dimensions for ${blueprint.blueprintId}.`);
  }
}

export function createUniversalBattlemapExport(
  blueprint: SpatialBlueprint,
  regionPlan: AscendancyRegionPlan,
  renderer: Readonly<{ path: string; sha256: string; width: number; height: number }>,
): UniversalBattlemapExport {
  assertMatchingPlan(blueprint, regionPlan);
  if (renderer.width !== blueprint.bounds.width || renderer.height !== blueprint.bounds.height) {
    throw new Error(`Renderer dimensions ${renderer.width}x${renderer.height} do not match ${blueprint.blueprintId} (${blueprint.bounds.width}x${blueprint.bounds.height}).`);
  }
  const doors = blueprint.anchors.filter((anchor) => anchor.kind === "door");
  const uvtt: UniversalVttGeometry = {
    format: UNIVERSAL_VTT_FORMAT,
    resolution: {
      map_origin: { x: 0, y: 0 },
      map_size: {
        x: blueprint.bounds.width / blueprint.grid.size,
        y: blueprint.bounds.height / blueprint.grid.size,
      },
      pixels_per_grid: blueprint.grid.size,
    },
    line_of_sight: blueprint.walls.map((wall) => [toGrid(wall.a, blueprint), toGrid(wall.b, blueprint)] as const),
    portals: doors.map((anchor) => portal(anchor, blueprint)),
    lights: [],
  };
  return {
    uvtt,
    regionSidecar: {
      schemaVersion: "0.1.0",
      kind: "dicebox-universal-battlemap-region-sidecar",
      geometryOwner: "spatial-blueprint",
      source: {
        blueprintId: blueprint.blueprintId,
        regionPlanId: regionPlan.planId,
        roomId: regionPlan.roomId,
        sceneId: regionPlan.sceneId,
        rendererPath: renderer.path,
        rendererSha256: renderer.sha256,
        width: renderer.width,
        height: renderer.height,
      },
      regions: regionPlan.regions.map((region) => ({
        regionId: region.regionId,
        label: region.label,
        bounds: region.bounds,
        interaction: region.interaction,
        owner: region.owner,
        behaviorBinding: region.behaviorBinding,
      })),
      importBoundary: "Universal VTT does not carry DiceBox Regions, RegionBehaviors, puzzle state, or Foundry UUID bindings.",
    },
  };
}

export function assertUniversalVttRoundTrip(
  blueprint: SpatialBlueprint,
  uvtt: UniversalVttGeometry,
) {
  const expectedWalls = blueprint.walls.map((wall) => [toGrid(wall.a, blueprint), toGrid(wall.b, blueprint)] as const);
  if (uvtt.format !== UNIVERSAL_VTT_FORMAT || uvtt.line_of_sight.length !== expectedWalls.length) {
    throw new Error(`Universal VTT wall count drift for ${blueprint.blueprintId}.`);
  }
  for (const [index, expected] of expectedWalls.entries()) {
    const actual = uvtt.line_of_sight[index];
    if (actual === undefined || !samePoint(actual[0], expected[0]) || !samePoint(actual[1], expected[1])) {
      throw new Error(`Universal VTT wall drift at index ${index} for ${blueprint.blueprintId}.`);
    }
  }
  const expectedDoors = blueprint.anchors.filter((anchor) => anchor.kind === "door").map((anchor) => portal(anchor, blueprint));
  if (uvtt.portals.length !== expectedDoors.length) throw new Error(`Universal VTT portal count drift for ${blueprint.blueprintId}.`);
  for (const [index, expected] of expectedDoors.entries()) {
    const actual = uvtt.portals[index];
    if (actual === undefined || !samePoint(actual.position, expected.position)
      || !samePoint(actual.bounds[0], expected.bounds[0]) || !samePoint(actual.bounds[1], expected.bounds[1])) {
      throw new Error(`Universal VTT portal drift at index ${index} for ${blueprint.blueprintId}.`);
    }
  }
}
