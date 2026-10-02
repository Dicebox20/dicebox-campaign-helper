import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "@dicebox/core";
import { ASCENDANCY_TRAM_CORE_ADJACENCY, createTramSceneProjectionPlan } from "./tram-scene-plan.js";

const rectangleSchema = z.object({
  x: z.number().finite().nonnegative(),
  y: z.number().finite().nonnegative(),
  width: z.number().finite().positive(),
  height: z.number().finite().positive(),
}).strict();

const macroBindingSchema = z.object({
  macroId: StableDiceBoxIdSchema,
  commandBinding: z.enum(["regionwright-hook", "dicebox-scene-engine"]),
  intendedRole: StableDiceBoxIdSchema,
  ownership: z.literal("explicit-player-owner"),
  ownershipField: z.literal("ownership.default"),
  readback: z.literal("required"),
}).strict();

const regionSchema = z.object({
  regionId: StableDiceBoxIdSchema,
  label: z.string().min(1),
  shape: z.literal("rectangle"),
  bounds: rectangleSchema,
  interaction: z.enum(["popup-personal", "physical-cooperative", "scene-controller", "final-station", "teleport-entry", "teleport-exit", "tram-anchor"]),
  owner: z.enum(["regionwright-popup", "dicebox-foundry-region", "dicebox-scene-engine"]),
  popup: z.boolean(),
  behaviorBinding: z.string().min(1).nullable(),
  macroBinding: macroBindingSchema.nullable(),
}).strict();

const teleportSchema = z.object({
  teleportId: StableDiceBoxIdSchema,
  fromRegionId: StableDiceBoxIdSchema,
  toRegionId: StableDiceBoxIdSchema,
  mode: z.enum(["scene-local", "cross-scene"]),
  owner: z.literal("dicebox-foundry-region"),
  activeGMRequired: z.literal(true),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export const ascendancyRegionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  roomId: StableDiceBoxIdSchema,
  sceneId: StableDiceBoxIdSchema,
  canvas: z.object({ width: z.literal(1536), height: z.literal(1024) }).strict(),
  regions: z.array(regionSchema).min(6),
  teleports: z.array(teleportSchema).min(1),
  geometryOwner: z.literal("spatial-blueprint"),
  coordinateSource: z.literal("campaign-helper-orthogonal-coordinate-plan"),
  foundryApis: z.array(z.string().min(1)).min(8),
  macroPolicy: z.object({
    mode: z.literal("none-in-current-campaign"),
    playerFacingMacroIds: z.array(StableDiceBoxIdSchema).length(0),
    explicitPlayerOwnershipRequiredIfAdded: z.literal(true),
    inheritedPermissionsAccepted: z.literal(false),
    readbackRequired: z.literal(true),
  }).strict(),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict().superRefine((value, context) => {
  const ids = new Set<string>();
  for (const [index, region] of value.regions.entries()) {
    if (ids.has(region.regionId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", index, "regionId"], message: "Region IDs must be unique within a Scene plan." });
    ids.add(region.regionId);
    if (region.bounds.x + region.bounds.width > value.canvas.width || region.bounds.y + region.bounds.height > value.canvas.height) context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", index, "bounds"], message: "Region bounds must remain inside the declared Scene canvas." });
    if (region.interaction === "popup-personal" && (!region.popup || region.owner !== "regionwright-popup")) context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", index], message: "Popup personal Regions must be Regionwright-owned popup Regions." });
    if (region.interaction !== "popup-personal" && region.popup) context.addIssue({ code: z.ZodIssueCode.custom, path: ["regions", index, "popup"], message: "Physical and Scene Regions cannot be popup interactions." });
  }
  for (const [index, teleport] of value.teleports.entries()) {
    if (!ids.has(teleport.fromRegionId) || (teleport.mode === "scene-local" && !ids.has(teleport.toRegionId))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["teleports", index], message: "Teleport origins must be declared; scene-local destinations must be declared in the same coordinate plan." });
  }
});

export type AscendancyRegionPlan = z.infer<typeof ascendancyRegionPlanSchema>;

const foundryApis = [
  "Hooks.once(\"ready\")",
  "game.version + game.system.id + game.system.version",
  "game.users.activeGM / User permissions",
  "fromUuid | game.scenes.get",
  "scene.getEmbeddedCollection(\"Region\")",
  "scene.getEmbeddedDocument(\"Region\", id)",
  "RegionDocument.shapes | RegionDocument.behaviors",
  "region.getEmbeddedCollection(\"RegionBehavior\")",
  "authoritative reread through fromUuid / embedded-document getters",
] as const;

const id = (namespace: string, localKey: string) => createStableDiceBoxId(namespace, localKey);
const sceneFor = (room: string) => id("scene", room);
const roomFor = (room: string) => id("room", room);
const rect = (regionId: string, label: string, bounds: { x: number; y: number; width: number; height: number }, interaction: z.infer<typeof regionSchema>["interaction"], owner: z.infer<typeof regionSchema>["owner"], popup: boolean, behaviorBinding: string | null) => ({ regionId: id("region", regionId), label, shape: "rectangle" as const, bounds, interaction, owner, popup, behaviorBinding, macroBinding: null });
const teleport = (teleportId: string, fromRegionId: string, toRegionId: string, mode: "scene-local" | "cross-scene") => ({ teleportId: id("teleport", teleportId), fromRegionId: id("region", fromRegionId), toRegionId: id("region", toRegionId), mode, owner: "dicebox-foundry-region" as const, activeGMRequired: true as const, mutation: "disabled-until-exact-runtime-gate" as const });

function plan(planKey: string, roomKey: string, regions: ReturnType<typeof rect>[], teleports: ReturnType<typeof teleport>[]): AscendancyRegionPlan {
  return ascendancyRegionPlanSchema.parse({ schemaVersion: "0.1.0", planId: id("plan", `${planKey}-regions`), roomId: roomFor(roomKey), sceneId: sceneFor(roomKey), canvas: { width: 1536, height: 1024 }, regions, teleports, geometryOwner: "spatial-blueprint", coordinateSource: "campaign-helper-orthogonal-coordinate-plan", foundryApis: [...foundryApis], macroPolicy: { mode: "none-in-current-campaign", playerFacingMacroIds: [], explicitPlayerOwnershipRequiredIfAdded: true, inheritedPermissionsAccepted: false, readbackRequired: true }, mutation: "disabled-until-exact-runtime-gate" });
}

export function createAscendancyRegionPlans(): readonly AscendancyRegionPlan[] {
  const signal = plan("signal-frequency-chamber", "signal-frequency-chamber", [
    rect("signal-aleister-frequency", "Aleister frequency station", { x: 120, y: 120, width: 300, height: 230 }, "popup-personal", "regionwright-popup", true, "dbx:puzzle:aleister-frequency"),
    rect("signal-sprocket-circuit", "Sprocket circuit station", { x: 1116, y: 120, width: 300, height: 230 }, "popup-personal", "regionwright-popup", true, "dbx:puzzle:sprocket-circuit"),
    rect("signal-cooperative-left", "Physical frequency circuit left", { x: 180, y: 500, width: 360, height: 220 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:cooperative:aleister-sprocket-frequency-circuit"),
    rect("signal-cooperative-right", "Physical frequency circuit right", { x: 996, y: 500, width: 360, height: 220 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:cooperative:aleister-sprocket-frequency-circuit"),
    rect("signal-entry", "Signal chamber entry", { x: 680, y: 24, width: 176, height: 72 }, "teleport-entry", "dicebox-foundry-region", false, null),
    rect("signal-exit", "Signal chamber exit", { x: 680, y: 928, width: 176, height: 72 }, "teleport-exit", "dicebox-foundry-region", false, null),
  ], [teleport("signal-to-core", "signal-exit", "core-entry", "cross-scene")]);
  const rune = plan("rune-mechanism-chamber", "rune-mechanism-chamber", [
    rect("rune-lawson-memory", "Lawson rune memory station", { x: 120, y: 120, width: 360, height: 240 }, "popup-personal", "regionwright-popup", true, "dbx:puzzle:lawson-rune-memory"),
    rect("rune-tactal-slotting", "Tactal heavy rune station", { x: 1056, y: 120, width: 360, height: 240 }, "popup-personal", "regionwright-popup", true, "dbx:puzzle:tactal-rune-slotting"),
    rect("rune-order-left", "Physical rune order left", { x: 180, y: 500, width: 360, height: 220 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:cooperative:lawson-tactal-rune-order"),
    rect("rune-order-right", "Physical rune order right", { x: 996, y: 500, width: 360, height: 220 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:cooperative:lawson-tactal-rune-order"),
    rect("rune-entry", "Rune chamber entry", { x: 680, y: 24, width: 176, height: 72 }, "teleport-entry", "dicebox-foundry-region", false, null),
    rect("rune-exit", "Rune chamber exit", { x: 680, y: 928, width: 176, height: 72 }, "teleport-exit", "dicebox-foundry-region", false, null),
  ], [teleport("rune-to-core", "rune-exit", "core-entry", "cross-scene")]);
  const core = plan("central-core-control-chamber", "central-core-control-chamber", [
    rect("core-aleister-station", "Aleister final activation", { x: 234, y: 275, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:aleister"),
    rect("core-sprocket-station", "Sprocket final activation", { x: 618, y: 275, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:sprocket"),
    rect("core-dalton-station", "Dalton final activation", { x: 1002, y: 275, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:dalton"),
    rect("core-andrew-station", "Andrew final activation", { x: 234, y: 580, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:andrew-mcconaughey"),
    rect("core-lawson-station", "Lawson final activation", { x: 618, y: 580, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:lawson-burnheart"),
    rect("core-tactal-station", "Tactal final activation", { x: 1002, y: 580, width: 300, height: 180 }, "final-station", "dicebox-foundry-region", false, "dbx:actor:tactal"),
    rect("core-security-room", "Core Security Room", { x: 500, y: 410, width: 536, height: 200 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:stage:six-person-simultaneous-activation"),
    rect("core-entry", "Core chamber north entry", { x: 680, y: 24, width: 176, height: 72 }, "teleport-entry", "dicebox-foundry-region", false, null),
    rect("core-entry-west", "Core chamber west rail entry", { x: ASCENDANCY_TRAM_CORE_ADJACENCY.coreDoor.position.x, y: ASCENDANCY_TRAM_CORE_ADJACENCY.coreDoor.position.y - 47.5, width: 176, height: 95 }, "teleport-entry", "dicebox-foundry-region", false, "dbx:tram:core-rail-access"),
    rect("core-exit", "Core chamber exit", { x: 680, y: 928, width: 176, height: 72 }, "teleport-exit", "dicebox-foundry-region", false, null),
  ], [teleport("core-to-signal", "core-exit", "signal-entry", "cross-scene"), teleport("core-to-rune", "core-exit", "rune-entry", "cross-scene")]);
  const tramProjection = createTramSceneProjectionPlan({ scene: { id: sceneFor("ascendancy-tram-depot"), kind: "scene" }, backgroundAsset: { id: id("asset", "map-ascendancy-tram-depot"), kind: "asset" } });
  const tramRegions = tramProjection.anchors.map((anchor) => rect(anchor.regionId.split(":").at(-1) ?? "tram-anchor", `Tram anchor ${anchor.row + 1},${anchor.column + 1}`, { x: anchor.center.x - tramProjection.logicalBoard.cellWidth / 2, y: anchor.center.y - tramProjection.logicalBoard.cellHeight / 2, width: tramProjection.logicalBoard.cellWidth, height: tramProjection.logicalBoard.cellHeight }, "tram-anchor", "dicebox-scene-engine", false, anchor.anchorId));
  tramRegions.push(rect("tram-dalton-repair", "Dalton tram repair station", { x: 1120, y: 120, width: 300, height: 220 }, "popup-personal", "regionwright-popup", true, "dbx:puzzle:dalton-tram-repair"));
  tramRegions.push(rect("tram-cooperative", "Physical tram troubleshooting station", { x: 1120, y: 640, width: 300, height: 220 }, "physical-cooperative", "dicebox-foundry-region", false, "dbx:cooperative:dalton-andrew-tram-troubleshooting"));
  // The only path onward is the rail corridor released when tram-X clears
  // the routing yard. It is deliberately narrow and aligned with row three.
  tramRegions.push(rect("tram-exit", "Tram rail to Core controls", { x: 1080, y: 400, width: 390, height: 95 }, "teleport-exit", "dicebox-foundry-region", false, "dbx:tram:core-rail-access"));
  const tram = plan("ascendancy-tram-depot", "ascendancy-tram-depot", tramRegions, [teleport("tram-to-core", "tram-exit", "core-entry-west", "cross-scene")]);
  return [signal, tram, rune, core];
}

export function validateAscendancyRegionPlan(input: unknown): AscendancyRegionPlan {
  return ascendancyRegionPlanSchema.parse(input);
}
