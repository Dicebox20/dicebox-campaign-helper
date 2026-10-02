import { z } from "zod";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";
import { createAscendancyMapBlueprints } from "./ascendancy-map-blueprints.js";
import { createAscendancyRegionPlans } from "./ascendancy-region-plan.js";
import { createAscendancyRuneFurnishingPlanFixture, createAscendancySignalFurnishingPlanFixture } from "./ascendancy-furnishing-plan-fixture.js";

const exactRuntimeSchema = z.object({
  foundryVersion: z.literal("14.367"), systemId: z.literal("dnd5e"), systemVersion: z.literal("5.3.3"),
  activeGm: z.literal(true), sceneBindings: z.object({
    signal: z.literal("AneddhKAAfk5HlsA"), rune: z.literal("p9Mbi0CJWe9KvJhH"),
  }).strict(),
}).strict();

const documentIntentSchema = z.object({
  intentId: StableDiceBoxIdSchema, kind: z.enum(["scene-renderer", "wall", "region", "tile", "token", "ambientLight", "ambientSound", "drawing", "note"]),
  count: z.number().int().positive(), previewOnly: z.literal(true), approvalRequired: z.literal(true), authoritativeRereadRequired: z.literal(true),
}).strict();

const roomPreviewSchema = z.object({
  roomId: StableDiceBoxIdSchema, sceneId: StableDiceBoxIdSchema, sceneIdRuntime: z.string().min(1), assetId: StableDiceBoxIdSchema,
  blueprintId: StableDiceBoxIdSchema, regionPlanId: StableDiceBoxIdSchema, furnishingPlanId: StableDiceBoxIdSchema,
  documents: z.array(documentIntentSchema).length(9), foreignState: z.literal("preserve"),
}).strict();

export const ascendancySignalRuneNativeDocumentPreviewSchema = z.object({
  schemaVersion: z.literal("0.1.0"), planId: StableDiceBoxIdSchema, evidenceClass: z.literal("local"), operation: z.literal("dicebox.ascendancy.signal-rune.native-document.preview"),
  noWrite: z.literal(true), apply: z.literal(false), approvalRequired: z.literal(true), authoritativeRereadRequired: z.literal(true),
  rooms: z.array(roomPreviewSchema).length(2), excluded: z.tuple([z.literal("dbx:room:ascendancy-tram-depot"), z.literal("dbx:room:central-core-control-chamber")]),
  mutation: z.literal("disabled-until-exact-runtime-gate"), runtimeState: z.literal("not-modeled"),
}).strict();

export type AscendancySignalRuneNativeDocumentPreview = z.infer<typeof ascendancySignalRuneNativeDocumentPreviewSchema>;
export type SignalRuneNativeDocumentPreviewRuntime = z.infer<typeof exactRuntimeSchema>;

function room(key: "signal" | "rune", runtimeId: string): z.infer<typeof roomPreviewSchema> {
  const sceneKey = key === "signal" ? "signal-frequency-chamber" : "rune-mechanism-chamber";
  const roomId = createStableDiceBoxId("room", sceneKey);
  const sceneId = createStableDiceBoxId("scene", sceneKey);
  const blueprint = createAscendancyMapBlueprints().find((item) => item.blueprintId === createStableDiceBoxId("blueprint", sceneKey));
  const regionPlan = createAscendancyRegionPlans().find((item) => item.sceneId === sceneId);
  const furnishing = key === "signal" ? createAscendancySignalFurnishingPlanFixture() : createAscendancyRuneFurnishingPlanFixture();
  if (!blueprint || !regionPlan) throw new Error(`M1115 ${key} source plan is unavailable.`);
  const kinds = ["tile", "token", "ambientLight", "ambientSound", "drawing", "note"] as const;
  return {
    roomId, sceneId, sceneIdRuntime: runtimeId,
    assetId: createStableDiceBoxId("asset", key === "signal" ? "map-signal-frequency-chamber" : "map-rune-mechanism-chamber"),
    blueprintId: blueprint.blueprintId, regionPlanId: regionPlan.planId, furnishingPlanId: furnishing.planId,
    documents: [
      { intentId: createStableDiceBoxId("intent", `m1115-${key}-renderer`), kind: "scene-renderer", count: 1, previewOnly: true, approvalRequired: true, authoritativeRereadRequired: true },
      { intentId: createStableDiceBoxId("intent", `m1115-${key}-walls`), kind: "wall", count: blueprint.walls.length, previewOnly: true, approvalRequired: true, authoritativeRereadRequired: true },
      { intentId: createStableDiceBoxId("intent", `m1115-${key}-regions`), kind: "region", count: regionPlan.regions.length, previewOnly: true, approvalRequired: true, authoritativeRereadRequired: true },
      ...kinds.map((kind) => ({ intentId: createStableDiceBoxId("intent", `m1115-${key}-${kind}`), kind, count: 1, previewOnly: true as const, approvalRequired: true as const, authoritativeRereadRequired: true as const })),
    ], foreignState: "preserve",
  };
}

/** Fixed, non-mutating two-room document-intent preview. It exposes no payload or apply operation. */
export function createAscendancySignalRuneNativeDocumentPreview(input: SignalRuneNativeDocumentPreviewRuntime): AscendancySignalRuneNativeDocumentPreview {
  const runtime = exactRuntimeSchema.parse(input);
  return ascendancySignalRuneNativeDocumentPreviewSchema.parse({
    schemaVersion: "0.1.0", planId: createStableDiceBoxId("plan", "m1115-signal-rune-native-document-preview"), evidenceClass: "local",
    operation: "dicebox.ascendancy.signal-rune.native-document.preview", noWrite: true, apply: false, approvalRequired: true, authoritativeRereadRequired: true,
    rooms: [room("signal", runtime.sceneBindings.signal), room("rune", runtime.sceneBindings.rune)],
    excluded: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"], mutation: "disabled-until-exact-runtime-gate", runtimeState: "not-modeled",
  });
}
