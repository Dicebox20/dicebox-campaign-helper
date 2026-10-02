import { createStableDiceBoxId } from "@dicebox/core";
import { createSpatialBlueprint, spatialBlueprintSchema, type SpatialBlueprint } from "./spatial-blueprint.js";
import { ASCENDANCY_TRAM_BOARD, ASCENDANCY_TRAM_CORE_ADJACENCY, ASCENDANCY_TRAM_CORE_RAIL } from "./tram-scene-plan.js";

const canvas = { width: 1536, height: 1024 } as const;
const levelId = createStableDiceBoxId("level", "ascendancy-ground");

function wall(id: string, a: { x: number; y: number }, b: { x: number; y: number }) {
  return { wallId: createStableDiceBoxId("wall", id), levelId, a, b, thickness: 8 };
}

function door(id: string, x: number, y: number, clearance = 80) {
  return {
    anchorId: createStableDiceBoxId("anchor", id),
    kind: "door" as const,
    levelId,
    position: { x, y },
    clearance,
  };
}

function interaction(id: string, x: number, y: number, clearance = 56) {
  return {
    anchorId: createStableDiceBoxId("anchor", id),
    kind: "interaction" as const,
    levelId,
    position: { x, y },
    clearance,
  };
}

type DoorSide = "north" | "south" | "west" | "east";

/**
 * Build only the perimeter gaps that the scene's route actually uses.
 *
 * The original campaign draft applied a four-door rectangle to every room.
 * That made unrelated rooms render as the same generic layout and contradicted
 * the package's explicit teleport topology.  A renderer never owns these
 * coordinates: the blueprint does.
 */
function perimeterWalls(key: string, doors: readonly DoorSide[], doorCenters: Partial<Record<DoorSide, number>> = {}) {
  const left = 24;
  const right = 1512;
  const top = 24;
  const bottom = 1000;
  const clearance = 80;
  const hasDoor = (side: DoorSide) => doors.includes(side);
  const horizontal = (side: "north" | "south", y: number) => hasDoor(side)
    ? [
      wall(`${key}-${side}-west`, { x: left, y }, { x: (doorCenters[side] ?? 768) - clearance, y }),
      wall(`${key}-${side}-east`, { x: (doorCenters[side] ?? 768) + clearance, y }, { x: right, y }),
    ]
    : [wall(`${key}-${side}`, { x: left, y }, { x: right, y })];
  const vertical = (side: "west" | "east", x: number) => hasDoor(side)
    ? [
      wall(`${key}-${side}-north`, { x, y: top }, { x, y: (doorCenters[side] ?? 512) - clearance }),
      wall(`${key}-${side}-south`, { x, y: (doorCenters[side] ?? 512) + clearance }, { x, y: bottom }),
    ]
    : [wall(`${key}-${side}`, { x, y: top }, { x, y: bottom })];
  return [...horizontal("north", top), ...horizontal("south", bottom), ...vertical("west", left), ...vertical("east", right)];
}

function baseBlueprint(
  key: string,
  name: string,
  doors: readonly DoorSide[],
  anchors: Array<ReturnType<typeof door> | ReturnType<typeof interaction>>,
  options: { readonly doorCenters?: Partial<Record<DoorSide, number>>; readonly interiorWalls?: ReturnType<typeof wall>[] } = {},
) {
  return createSpatialBlueprint({
    blueprintId: createStableDiceBoxId("blueprint", key),
    name,
    origin: { x: 0, y: 0 },
    bounds: canvas,
    grid: { size: 64, unitsPerCell: 5 },
    scale: { pixelsPerUnit: 12.8, unit: "grid-unit" },
    levels: [{ levelId, label: "Ground", elevation: 0 }],
    walls: [...perimeterWalls(key, doors, options.doorCenters), ...(options.interiorWalls ?? [])],
    regions: [],
    anchors,
  });
}

export function createAscendancyMapBlueprints(): readonly SpatialBlueprint[] {
  const signalAnchors = [
    door("signal-door-north", 768, 24), door("signal-door-south", 768, 1000),
    interaction("signal-aleister-frequency", 270, 235), interaction("signal-sprocket-circuit", 1266, 235),
  ];
  const tramAnchors: Array<ReturnType<typeof door> | ReturnType<typeof interaction>> = [
    // The X tram exits from row three (zero-based row two) onto the only rail
    // that reaches the Core. The board gates and outer door share that line.
    door("tram-door-east", ASCENDANCY_TRAM_CORE_RAIL.outerDoor.x, ASCENDANCY_TRAM_CORE_RAIL.outerDoor.y, 47.5),
    door("tram-yard-ingress", ASCENDANCY_TRAM_CORE_RAIL.ingress.x, ASCENDANCY_TRAM_CORE_RAIL.ingress.y, 47.5),
    door("tram-yard-exit", ASCENDANCY_TRAM_CORE_RAIL.exit.x, ASCENDANCY_TRAM_CORE_RAIL.exit.y, 47.5),
    interaction("tram-dalton-repair", 1270, 230, 72), interaction("tram-cooperative", 1270, 750, 72),
  ];
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 6; column += 1) {
      tramAnchors.push(interaction(`tram-slot-r${row + 1}-c${column + 1}`, 420 + (column + 0.5) * 110, 210 + (row + 0.5) * 95, 40));
    }
  }
  const runeAnchors = [
    door("rune-door-north", 768, 24), door("rune-door-south", 768, 1000),
    interaction("rune-lawson-memory", 300, 240), interaction("rune-tactal-slotting", 1236, 240),
  ];
  const coreAnchors = [
    door("core-door-north", 768, 24), door("core-door-south", 768, 1000),
    door("core-door-west", ASCENDANCY_TRAM_CORE_ADJACENCY.coreDoor.position.x, ASCENDANCY_TRAM_CORE_ADJACENCY.coreDoor.position.y, 47.5),
    interaction("core-aleister-station", 384, 365), interaction("core-sprocket-station", 768, 365), interaction("core-dalton-station", 1152, 365),
    interaction("core-andrew-station", 384, 670), interaction("core-lawson-station", 768, 670), interaction("core-tactal-station", 1152, 670),
  ];
  const tramYardWalls = [
    wall("tram-yard-north", { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_BOARD.origin.y }, { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_BOARD.origin.y }),
    wall("tram-yard-south", { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_BOARD.origin.y + ASCENDANCY_TRAM_BOARD.cellHeight * ASCENDANCY_TRAM_BOARD.rows }, { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_BOARD.origin.y + ASCENDANCY_TRAM_BOARD.cellHeight * ASCENDANCY_TRAM_BOARD.rows }),
    wall("tram-yard-west-north", { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_BOARD.origin.y }, { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_CORE_RAIL.ingress.y - 47.5 }),
    wall("tram-yard-west-south", { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_CORE_RAIL.ingress.y + 47.5 }, { x: ASCENDANCY_TRAM_BOARD.origin.x, y: ASCENDANCY_TRAM_BOARD.origin.y + ASCENDANCY_TRAM_BOARD.cellHeight * ASCENDANCY_TRAM_BOARD.rows }),
    wall("tram-yard-east-north", { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_BOARD.origin.y }, { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_CORE_RAIL.exit.y - 47.5 }),
    wall("tram-yard-east-south", { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_CORE_RAIL.exit.y + 47.5 }, { x: ASCENDANCY_TRAM_BOARD.origin.x + ASCENDANCY_TRAM_BOARD.cellWidth * ASCENDANCY_TRAM_BOARD.columns, y: ASCENDANCY_TRAM_BOARD.origin.y + ASCENDANCY_TRAM_BOARD.cellHeight * ASCENDANCY_TRAM_BOARD.rows }),
  ];
  return [
    baseBlueprint("signal-frequency-chamber", "Signal / Frequency Chamber", ["north", "south"], signalAnchors),
    baseBlueprint("ascendancy-tram-depot", "Ascendancy Tram Depot", ["east"], tramAnchors, { doorCenters: { east: ASCENDANCY_TRAM_CORE_RAIL.outerDoor.y }, interiorWalls: tramYardWalls }),
    baseBlueprint("rune-mechanism-chamber", "Rune Mechanism Chamber", ["north", "south"], runeAnchors),
    baseBlueprint("central-core-control-chamber", "Central Core Control Chamber", ["north", "south", "west"], coreAnchors, { doorCenters: { west: ASCENDANCY_TRAM_CORE_ADJACENCY.coreDoor.position.y } }),
  ];
}

export function validateAscendancyMapBlueprints(input: unknown): readonly SpatialBlueprint[] {
  if (!Array.isArray(input)) throw new Error("Ascendancy map blueprints must be an array.");
  return input.map((blueprint) => spatialBlueprintSchema.parse(blueprint));
}
