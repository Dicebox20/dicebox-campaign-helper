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

const supervisorSchema = z.object({
  pid: z.literal(25108),
  port: z.literal(30001),
  worldDocumentWrites: z.literal(0),
  balladTouched: z.literal(false),
}).strict();

const identityValueSchema = z.union([z.literal("unresolved"), z.string().min(1)]);
const generationSchema = z.union([z.literal("unresolved"), z.number().int().nonnegative()]);
const ownershipSchema = z.enum(["owned", "foreign", "unknown", "unresolved"]);

const childIdentitySchema = z.object({
  documentType: z.enum(["Level", "Wall", "Region", "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"]),
  documentId: z.string().min(1),
  uuid: z.string().min(1),
  generation: z.number().int().nonnegative(),
  ownership: ownershipSchema,
}).strict();

const childrenSchema = z.object({
  status: z.enum(["observed", "unresolved"]),
  entries: z.union([z.literal("unresolved"), z.array(childIdentitySchema).max(500)]),
  reason: z.string().min(1),
}).strict().superRefine((value, context) => {
  if (value.status === "unresolved" && value.entries !== "unresolved") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "unresolved children must retain entries as unresolved" });
  }
  if (value.status === "observed" && value.entries === "unresolved") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "observed children require complete identity entries" });
  }
});

const parentSchema = z.object({
  documentType: z.literal("Scene"),
  documentId: z.string().min(1),
  uuid: identityValueSchema,
  generation: generationSchema,
  status: z.enum(["observed", "partial", "unresolved"]),
  ownership: ownershipSchema,
}).strict().superRefine((value, context) => {
  const complete = value.uuid !== "unresolved" && value.generation !== "unresolved";
  if (value.status === "observed" && !complete) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "observed parent identity requires UUID and generation" });
  }
  if (value.status === "partial" && complete) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "partial parent identity cannot claim complete UUID and generation" });
  }
});

const sceneInputSchema = z.object({
  roomId: z.union([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  sceneIdRuntime: z.union([z.literal("AneddhKAAfk5HlsA"), z.literal("p9Mbi0CJWe9KvJhH")]),
  asset: assetSchema,
  parent: parentSchema,
  children: childrenSchema,
}).strict();

const inputSchema = z.object({
  target: targetSchema,
  supervisor: supervisorSchema,
  scenes: z.object({ signal: sceneInputSchema, rune: sceneInputSchema }).strict(),
}).strict();

const sceneOutputSchema = z.object({
  roomId: z.union([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  sceneIdRuntime: z.union([z.literal("AneddhKAAfk5HlsA"), z.literal("p9Mbi0CJWe9KvJhH")]),
  documentType: z.literal("Scene"),
  asset: assetSchema,
  parent: parentSchema,
  children: childrenSchema,
}).strict();

export const ascendancySignalRuneIdentityObservationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.native-document.identity-observation"),
  status: z.literal("OBSERVATION_ONLY"),
  planId: z.literal("dbx:plan:m1115-signal-rune-native-document-preview"),
  target: targetSchema,
  supervisor: supervisorSchema,
  scenes: z.tuple([sceneOutputSchema, sceneOutputSchema]),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  noWrite: z.literal(true),
  apply: z.literal(false),
  payload: z.literal("not-materialized"),
  promotion: z.literal("disabled"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneIdentityObservation = z.infer<typeof ascendancySignalRuneIdentityObservationSchema>;
export type AscendancySignalRuneIdentityObservationInput = z.input<typeof inputSchema>;

/**
 * Preserves exact identity observations without promoting them to bindings.
 * Complete identity entries are observations only; this function never creates
 * RuntimeBinding values or an execution-shaped artifact.
 */
export function createAscendancySignalRuneIdentityObservation(
  input: AscendancySignalRuneIdentityObservationInput,
): AscendancySignalRuneIdentityObservation {
  const observation = inputSchema.parse(input);
  const signal = observation.scenes.signal;
  const rune = observation.scenes.rune;
  if (signal.roomId !== "dbx:room:signal-frequency-chamber" || signal.sceneIdRuntime !== "AneddhKAAfk5HlsA") {
    throw new Error("M1129 signal identity observation must use the exact M1124 parent Scene");
  }
  if (rune.roomId !== "dbx:room:rune-mechanism-chamber" || rune.sceneIdRuntime !== "p9Mbi0CJWe9KvJhH") {
    throw new Error("M1129 rune identity observation must use the exact M1124 parent Scene");
  }
  return ascendancySignalRuneIdentityObservationSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.native-document.identity-observation",
    status: "OBSERVATION_ONLY",
    planId: "dbx:plan:m1115-signal-rune-native-document-preview",
    target: observation.target,
    supervisor: observation.supervisor,
    scenes: [
      { ...signal, documentType: "Scene" },
      { ...rune, documentType: "Scene" },
    ],
    foreignState: "preserve",
    retryAfterUnknown: false,
    runtimeBinding: "not-created",
    noWrite: true,
    apply: false,
    payload: "not-materialized",
    promotion: "disabled",
    dispatch: "disabled",
    readyClaim: false,
  });
}
