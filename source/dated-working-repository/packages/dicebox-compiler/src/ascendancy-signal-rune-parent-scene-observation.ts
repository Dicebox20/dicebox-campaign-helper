import { z } from "zod";

const targetSchema = z.object({
  worldId: z.literal("dbx-test-world"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
  activeGm: z.literal(true),
  user: z.literal("Gamemaster"),
}).strict();

const assetSchema = z.object({
  assetId: z.string().min(1),
  byteLength: z.number().int().positive(),
  sha256: z.string().regex(/^[A-F0-9]{64}$/),
}).strict();

const paritySchema = z.object({
  sourceSha256: z.string().regex(/^[A-F0-9]{64}$/),
  stagedSha256: z.string().regex(/^[A-F0-9]{64}$/),
  equal: z.literal(true),
}).strict().refine((value) => value.sourceSha256 === value.stagedSha256, {
  message: "source and staged hashes must match",
});

const observedSceneInputSchema = z.object({
  roomId: z.union([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  sceneIdRuntime: z.union([z.literal("AneddhKAAfk5HlsA"), z.literal("p9Mbi0CJWe9KvJhH")]),
  asset: assetSchema,
}).strict();

const m1124ObservationInputSchema = z.object({
  target: targetSchema,
  supervisor: z.object({
    pid: z.literal(25108),
    port: z.literal(30001),
    worldDocumentWrites: z.literal(0),
    balladTouched: z.literal(false),
  }).strict(),
  scenes: z.object({
    signal: observedSceneInputSchema,
    rune: observedSceneInputSchema,
  }).strict(),
  sourceStaged: z.object({
    module: paritySchema,
    partialPreviewAdapter: paritySchema,
  }).strict(),
}).strict();

const observedSceneSchema = z.object({
  roomId: z.union([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  sceneIdRuntime: z.union([z.literal("AneddhKAAfk5HlsA"), z.literal("p9Mbi0CJWe9KvJhH")]),
  documentType: z.literal("Scene"),
  asset: assetSchema,
  uuid: z.literal("unresolved"),
  generation: z.literal("unresolved"),
  childBindings: z.literal("unresolved"),
}).strict();

export const ascendancySignalRuneParentSceneObservationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.native-document.parent-scene-observation"),
  status: z.literal("OBSERVED"),
  planId: z.literal("dbx:plan:m1115-signal-rune-native-document-preview"),
  target: targetSchema,
  supervisor: z.object({
    pid: z.literal(25108),
    port: z.literal(30001),
    worldDocumentWrites: z.literal(0),
    balladTouched: z.literal(false),
  }).strict(),
  scenes: z.tuple([observedSceneSchema, observedSceneSchema]),
  sourceStaged: z.object({
    module: paritySchema,
    partialPreviewAdapter: paritySchema,
  }).strict(),
  excluded: z.tuple([
    z.literal("dbx:room:ascendancy-tram-depot"),
    z.literal("dbx:room:central-core-control-chamber"),
  ]),
  parentSceneIdsObserved: z.literal(true),
  childUuidGenerationBindings: z.literal(false),
  childBindings: z.literal("unresolved"),
  noWrite: z.literal(true),
  apply: z.literal(false),
  payload: z.literal("not-materialized"),
  promotion: z.literal("disabled"),
  dispatch: z.literal("disabled"),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  runtimeState: z.literal("observed-parent-only"),
}).strict();

export type AscendancySignalRuneParentSceneObservation = z.infer<typeof ascendancySignalRuneParentSceneObservationSchema>;
export type AscendancySignalRuneParentSceneObservationInput = z.input<typeof m1124ObservationInputSchema>;

/**
 * Records only the two exact M1124 parent Scene observations. It deliberately
 * does not create RuntimeBinding values, payloads, IR/proposals, or dispatch.
 */
export function createAscendancySignalRuneParentSceneObservation(
  input: AscendancySignalRuneParentSceneObservationInput,
): AscendancySignalRuneParentSceneObservation {
  const observation = m1124ObservationInputSchema.parse(input);
  const signal = observation.scenes.signal;
  const rune = observation.scenes.rune;
  if (signal.roomId !== "dbx:room:signal-frequency-chamber" || signal.sceneIdRuntime !== "AneddhKAAfk5HlsA") {
    throw new Error("M1125 signal parent Scene observation must use the exact M1124 binding");
  }
  if (rune.roomId !== "dbx:room:rune-mechanism-chamber" || rune.sceneIdRuntime !== "p9Mbi0CJWe9KvJhH") {
    throw new Error("M1125 rune parent Scene observation must use the exact M1124 binding");
  }
  return ascendancySignalRuneParentSceneObservationSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.native-document.parent-scene-observation",
    status: "OBSERVED",
    planId: "dbx:plan:m1115-signal-rune-native-document-preview",
    target: observation.target,
    supervisor: observation.supervisor,
    scenes: [
      { ...signal, documentType: "Scene", uuid: "unresolved", generation: "unresolved", childBindings: "unresolved" },
      { ...rune, documentType: "Scene", uuid: "unresolved", generation: "unresolved", childBindings: "unresolved" },
    ],
    sourceStaged: observation.sourceStaged,
    excluded: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
    parentSceneIdsObserved: true,
    childUuidGenerationBindings: false,
    childBindings: "unresolved",
    noWrite: true,
    apply: false,
    payload: "not-materialized",
    promotion: "disabled",
    dispatch: "disabled",
    foreignState: "preserve",
    retryAfterUnknown: false,
    runtimeState: "observed-parent-only",
  });
}
