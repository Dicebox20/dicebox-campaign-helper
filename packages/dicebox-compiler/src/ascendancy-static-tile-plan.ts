import { createStableDiceBoxId, StableDiceBoxIdSchema } from "@dicebox/core";
import { z } from "zod";

const boundsSchema = z.object({ x: z.number(), y: z.number(), width: z.number().positive(), height: z.number().positive() }).strict();

export const ascendancyStaticTilePlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  rendererPolicy: z.literal("geometry-neutral-backgrounds-only"),
  tiles: z.array(z.object({
    tileId: StableDiceBoxIdSchema,
    sceneId: StableDiceBoxIdSchema,
    label: z.string().min(1),
    bounds: boundsSchema,
    sort: z.number().int(),
    visibility: z.literal("always-visible"),
    assetRole: z.string().min(1),
    assetPath: z.string().startsWith("assets/tiles/"),
    nativeCorrespondence: z.array(StableDiceBoxIdSchema).min(1),
  }).strict()).length(29),
}).strict();

export type AscendancyStaticTilePlan = z.infer<typeof ascendancyStaticTilePlanSchema>;

const tramSceneId = createStableDiceBoxId("scene", "ascendancy-tram-depot");
const signalSceneId = createStableDiceBoxId("scene", "signal-frequency-chamber");
const runeSceneId = createStableDiceBoxId("scene", "rune-mechanism-chamber");
const coreSceneId = createStableDiceBoxId("scene", "central-core-control-chamber");
const staticTile = (sceneId: string, key: string, label: string, x: number, y: number, width: number, height: number, sort: number, assetRole: string, assetPath: string, nativeCorrespondence: readonly string[]) => ({
  tileId: createStableDiceBoxId("tile", key), sceneId, label, bounds: { x, y, width, height }, sort,
  visibility: "always-visible" as const, assetRole, assetPath, nativeCorrespondence: [...nativeCorrespondence],
});

/** Visual-only Tile projections. Walls, doors, Regions, and dynamic tram cars retain ownership. */
export function createAscendancyStaticTilePlan(): AscendancyStaticTilePlan {
  return ascendancyStaticTilePlanSchema.parse({
    schemaVersion: "0.1.0",
    rendererPolicy: "geometry-neutral-backgrounds-only",
    tiles: [
      // These objects use native TileDocuments only because each must be independently
      // positioned over a neutral renderer. Their stable IDs and bounds are M151-owned.
      staticTile(signalSceneId, "signal-door-north", "Signal north door", 680, 24, 176, 72, 30, "signal-door", "assets/tiles/ascendancy-core-door.svg", [createStableDiceBoxId("region", "signal-entry")]),
      staticTile(signalSceneId, "signal-door-south", "Signal south door", 680, 928, 176, 72, 30, "signal-door", "assets/tiles/ascendancy-core-door.svg", [createStableDiceBoxId("region", "signal-exit")]),
      staticTile(signalSceneId, "signal-central-resonator", "Signal central resonator", 568, 330, 400, 300, 10, "signal-central-resonator", "assets/tiles/ascendancy-signal-resonator.svg", [createStableDiceBoxId("blueprint", "signal-frequency-chamber")]),
      staticTile(signalSceneId, "signal-aleister-console", "Aleister frequency console", 180, 175, 180, 120, 20, "signal-frequency-console", "assets/tiles/ascendancy-signal-console.svg", [createStableDiceBoxId("region", "signal-aleister-frequency")]),
      staticTile(signalSceneId, "signal-sprocket-console", "Sprocket circuit console", 1176, 175, 180, 120, 20, "signal-circuit-console", "assets/tiles/ascendancy-signal-console.svg", [createStableDiceBoxId("region", "signal-sprocket-circuit")]),
      staticTile(signalSceneId, "signal-cooperative-left-console", "Signal cooperative left relay", 270, 560, 180, 100, 20, "signal-cooperative-relay", "assets/tiles/ascendancy-signal-relay.svg", [createStableDiceBoxId("region", "signal-cooperative-left")]),
      staticTile(signalSceneId, "signal-cooperative-right-console", "Signal cooperative right relay", 1086, 560, 180, 100, 20, "signal-cooperative-relay", "assets/tiles/ascendancy-signal-relay.svg", [createStableDiceBoxId("region", "signal-cooperative-right")]),
      staticTile(runeSceneId, "rune-door-north", "Rune north door", 680, 24, 176, 72, 30, "rune-door", "assets/tiles/ascendancy-core-door.svg", [createStableDiceBoxId("region", "rune-entry")]),
      staticTile(runeSceneId, "rune-door-south", "Rune south door", 680, 928, 176, 72, 30, "rune-door", "assets/tiles/ascendancy-core-door.svg", [createStableDiceBoxId("region", "rune-exit")]),
      staticTile(runeSceneId, "rune-central-engine", "Rune central engine", 568, 330, 400, 300, 10, "rune-central-engine", "assets/tiles/ascendancy-rune-engine.svg", [createStableDiceBoxId("blueprint", "rune-mechanism-chamber")]),
      staticTile(runeSceneId, "rune-lawson-archive", "Lawson rune archive", 210, 180, 180, 120, 20, "rune-memory-archive", "assets/tiles/ascendancy-rune-archive.svg", [createStableDiceBoxId("region", "rune-lawson-memory")]),
      staticTile(runeSceneId, "rune-tactal-forge", "Tactal rune forge", 1146, 180, 180, 120, 20, "rune-slotting-forge", "assets/tiles/ascendancy-rune-forge.svg", [createStableDiceBoxId("region", "rune-tactal-slotting")]),
      staticTile(runeSceneId, "rune-order-left-plinth", "Rune cooperative left plinth", 270, 560, 180, 100, 20, "rune-order-plinth", "assets/tiles/ascendancy-rune-plinth.svg", [createStableDiceBoxId("region", "rune-order-left")]),
      staticTile(runeSceneId, "rune-order-right-plinth", "Rune cooperative right plinth", 1086, 560, 180, 100, 20, "rune-order-plinth", "assets/tiles/ascendancy-rune-plinth.svg", [createStableDiceBoxId("region", "rune-order-right")]),
      staticTile(tramSceneId, "tram-rail-grid", "Tram fixed rail grid", 420, 210, 660, 570, 10, "tram-fixed-rail-grid", "assets/tiles/ascendancy-tram-rail-grid.svg", [createStableDiceBoxId("blueprint", "ascendancy-tram-depot")]),
      staticTile(tramSceneId, "tram-core-rail", "Tram eastbound Core rail", 1080, 400, 432, 95, 11, "tram-eastbound-core-rail", "assets/tiles/ascendancy-tram-core-rail.svg", [createStableDiceBoxId("region", "tram-exit"), createStableDiceBoxId("anchor", "tram-door-east")]),
      ...["ingress", "yard-exit", "core-door"].map((key) => staticTile(tramSceneId, `tram-gate-${key}`, `Tram ${key} gate`, key === "ingress" ? 408 : key === "yard-exit" ? 1068 : 1500, 400, 24, 95, 20, "tram-gate", "assets/tiles/ascendancy-tram-gate.svg", [createStableDiceBoxId("anchor", key === "ingress" ? "tram-yard-ingress" : key === "yard-exit" ? "tram-yard-exit" : "tram-door-east")])),
      staticTile(coreSceneId, "core-west-rail-gate", "Core west rail gate", 24, 400, 176, 95, 30, "core-west-rail-gate", "assets/tiles/ascendancy-core-west-rail-gate.svg", [createStableDiceBoxId("anchor", "core-door-west"), createStableDiceBoxId("region", "core-entry-west")]),
      ...["north", "south"].map((key) => staticTile(coreSceneId, `core-door-${key}`, `Core ${key} door`, 680, key === "north" ? 24 : 928, 176, 72, 30, "core-door", "assets/tiles/ascendancy-core-door.svg", [createStableDiceBoxId("anchor", `core-door-${key}`), createStableDiceBoxId("region", key === "north" ? "core-entry" : "core-exit")])),
      staticTile(coreSceneId, "core-central-surface", "Core central security surface", 500, 410, 536, 200, 10, "core-central-surface", "assets/tiles/ascendancy-core-central-surface.svg", [createStableDiceBoxId("region", "core-security-room")]),
      ...[
        ["aleister", 294, 320], ["sprocket", 678, 320], ["dalton", 1062, 320],
        ["andrew", 294, 625], ["lawson", 678, 625], ["tactal", 1062, 625],
      ].map(([key, x, y]) => staticTile(coreSceneId, `core-station-${key}`, `Core ${key} activation pad`, Number(x), Number(y), 180, 90, 20, "core-final-station-pad", "assets/tiles/ascendancy-core-station-pad.svg", [createStableDiceBoxId("region", `core-${key}-station`)])),
    ],
  });
}
