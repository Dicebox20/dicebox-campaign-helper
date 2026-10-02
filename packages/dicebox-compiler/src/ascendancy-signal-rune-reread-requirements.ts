import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import {
  ascendancySignalRuneNativeOperationAllowlistSchema,
  type AscendancySignalRuneNativeOperationAllowlist,
} from "./ascendancy-signal-rune-native-operation-allowlist.js";

const requirementByKind = {
  "scene-renderer": { documentType: "Level", readerCategory: "scene.initialLevel-reread-required" },
  wall: { documentType: "Wall", readerCategory: "scene.embedded-wall-reread-required" },
  region: { documentType: "Region", readerCategory: "scene.embedded-region-reread-required" },
  tile: { documentType: "Tile", readerCategory: "foundry.scene-placeable.read@14.367" },
  token: { documentType: "Token", readerCategory: "foundry.scene-placeable.read@14.367" },
  ambientLight: { documentType: "AmbientLight", readerCategory: "foundry.scene-placeable.read@14.367" },
  ambientSound: { documentType: "AmbientSound", readerCategory: "foundry.scene-placeable.read@14.367" },
  drawing: { documentType: "Drawing", readerCategory: "foundry.scene-placeable.read@14.367" },
  note: { documentType: "Note", readerCategory: "foundry.scene-placeable.read@14.367" },
} as const;

const requirementSchema = z.object({
  roomId: StableDiceBoxIdSchema,
  sceneId: StableDiceBoxIdSchema,
  sceneIdRuntime: z.string().min(1),
  intentId: StableDiceBoxIdSchema,
  kind: z.enum(["scene-renderer", "wall", "region", "tile", "token", "ambientLight", "ambientSound", "drawing", "note"]),
  count: z.number().int().positive(),
  foundryApi: z.string().min(1),
  parentBinding: z.literal("Scene-runtime-id-known-uuid-unresolved"),
  childBinding: z.literal("unresolved-until-exact-authoritative-reread"),
  documentType: z.enum(["Level", "Wall", "Region", "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"]),
  readerCategory: z.enum([
    "scene.initialLevel-reread-required",
    "scene.embedded-wall-reread-required",
    "scene.embedded-region-reread-required",
    "foundry.scene-placeable.read@14.367",
  ]),
  authoritativeReread: z.literal("required-before-and-after-future-operation"),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
}).strict();

export const ascendancySignalRuneRereadRequirementsSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.native-document.reread-requirements"),
  planId: z.literal("dbx:plan:m1115-signal-rune-native-document-preview"),
  previewToken: z.string().min(1),
  noWrite: z.literal(true),
  apply: z.literal(false),
  dispatch: z.literal("disabled"),
  requirements: z.array(requirementSchema).length(18),
  unresolvedRuntimeChildBindings: z.literal(true),
  excluded: z.tuple([z.literal("dbx:room:ascendancy-tram-depot"), z.literal("dbx:room:central-core-control-chamber")]),
  runtimeState: z.literal("not-modeled"),
}).strict();

export type AscendancySignalRuneRereadRequirements = z.infer<typeof ascendancySignalRuneRereadRequirementsSchema>;

/** Declares future readback requirements; it neither creates bindings nor calls an adapter. */
export function createAscendancySignalRuneRereadRequirements(
  input: { readonly allowlist: AscendancySignalRuneNativeOperationAllowlist },
): AscendancySignalRuneRereadRequirements {
  const allowlist = ascendancySignalRuneNativeOperationAllowlistSchema.parse(input.allowlist);
  return ascendancySignalRuneRereadRequirementsSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.native-document.reread-requirements",
    planId: allowlist.planId,
    previewToken: allowlist.previewToken,
    noWrite: true,
    apply: false,
    dispatch: "disabled",
    requirements: allowlist.operations.map((entry) => ({
      roomId: entry.roomId,
      sceneId: entry.sceneId,
      sceneIdRuntime: entry.sceneIdRuntime,
      intentId: entry.intentId,
      kind: entry.kind,
      count: entry.count,
      foundryApi: entry.foundryApi,
      parentBinding: "Scene-runtime-id-known-uuid-unresolved",
      childBinding: "unresolved-until-exact-authoritative-reread",
      ...requirementByKind[entry.kind],
      authoritativeReread: entry.authoritativeReread,
      foreignState: entry.foreignState,
      retryAfterUnknown: entry.retryAfterUnknown,
      payload: entry.payload,
      dispatch: entry.dispatch,
    })),
    unresolvedRuntimeChildBindings: true,
    excluded: allowlist.excluded,
    runtimeState: allowlist.runtimeState,
  });
}
