import { z } from "zod";

const targetSchema = z.object({
  worldId: z.literal("dbx-test-world"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
  activeGmName: z.literal("Gamemaster"),
}).strict();

const supervisorSchema = z.object({
  status: z.literal("PASS"),
  pid: z.number().int().positive(),
  port: z.literal(30001),
  worldId: z.literal("dbx-test-world"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
  activeGmName: z.literal("Gamemaster"),
  worldDocumentWrites: z.literal(0),
  balladTouched: z.literal(false),
}).strict();

const booleanFieldPresenceSchema = z.object({
  documentName: z.boolean(),
  id: z.boolean(),
  uuid: z.boolean(),
  generation: z.boolean(),
}).strict();

const ownershipPresenceSchema = z.object({
  owned: z.boolean(),
  foreign: z.boolean(),
  unknown: z.boolean(),
}).strict();

const shapeSchema = z.object({
  count: z.number().int().nonnegative(),
  fieldPresence: booleanFieldPresenceSchema,
  fieldCompleteness: booleanFieldPresenceSchema,
  ownershipPresence: ownershipPresenceSchema,
}).strict();

const shapeSummarySchema = z.object({
  Level: shapeSchema,
  Wall: shapeSchema,
  Region: shapeSchema,
  Tile: shapeSchema,
  Token: shapeSchema,
  AmbientLight: shapeSchema,
  AmbientSound: shapeSchema,
  Drawing: shapeSchema,
  Note: shapeSchema,
}).strict();

const sceneEvidenceSchema = z.object({
  roomId: z.enum(["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"]),
  sceneIdRuntime: z.enum(["AneddhKAAfk5HlsA", "p9Mbi0CJWe9KvJhH"]),
  parentUuid: z.enum(["Scene.AneddhKAAfk5HlsA", "Scene.p9Mbi0CJWe9KvJhH"]),
  parentGeneration: z.literal("unresolved"),
  parentOwnership: z.literal("foreign"),
  childrenStatus: z.literal("unresolved"),
  childrenReason: z.literal("embedded Level identity incomplete"),
  shapeSummary: shapeSummarySchema,
}).strict();

const sourceEvidenceSchema = z.object({
  milestone: z.literal("M1138"),
  target: targetSchema,
  supervisor: supervisorSchema,
  scenes: z.tuple([sceneEvidenceSchema, sceneEvidenceSchema]),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

const blockerSchema = z.enum([
  "runtime-parent-generation-unresolved",
  "runtime-parent-ownership-foreign",
  "runtime-child-identity-unresolved",
  "embedded-level-generation-unresolved",
  "embedded-level-ownership-unknown",
  "embedded-wall-ownership-foreign",
  "embedded-region-ownership-foreign",
]);

const sceneDecisionSchema = z.object({
  roomId: sceneEvidenceSchema.shape.roomId,
  sceneIdRuntime: sceneEvidenceSchema.shape.sceneIdRuntime,
  parentUuid: sceneEvidenceSchema.shape.parentUuid,
  shapeSummary: shapeSummarySchema,
  blockers: z.array(blockerSchema).min(1),
  ownershipDecision: z.literal("preserve-foreign-or-unknown"),
  runtimeBinding: z.literal("not-created"),
}).strict();

export const ascendancySignalRuneShapeAwareIdentityReconciliationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.shape-aware-identity.reconciliation"),
  sourceMilestone: z.literal("M1138"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  target: targetSchema,
  sourceSupervisorPid: z.number().int().positive(),
  currentSupervisorPid: z.number().int().positive(),
  currentSupervisorMatch: z.literal(true),
  scenes: z.tuple([sceneDecisionSchema, sceneDecisionSchema]),
  blockers: z.array(blockerSchema).min(1),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  foundryIr: z.literal("not-created"),
  proposal: z.literal("not-created"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneShapeAwareIdentityReconciliation = z.infer<typeof ascendancySignalRuneShapeAwareIdentityReconciliationSchema>;
export type AscendancySignalRuneShapeAwareIdentitySource = Omit<z.input<typeof sourceEvidenceSchema>, "scenes"> & {
  readonly scenes: readonly [z.input<typeof sceneEvidenceSchema>, z.input<typeof sceneEvidenceSchema>];
};

function sceneBlockers(scene: z.infer<typeof sceneEvidenceSchema>): z.infer<typeof blockerSchema>[] {
  const blockers: z.infer<typeof blockerSchema>[] = [
    "runtime-parent-generation-unresolved",
    "runtime-parent-ownership-foreign",
    "runtime-child-identity-unresolved",
  ];
  const nonempty = (documentType: keyof z.infer<typeof shapeSummarySchema>) => scene.shapeSummary[documentType].count > 0;
  if (nonempty("Level") && !scene.shapeSummary.Level.fieldCompleteness.generation) blockers.push("embedded-level-generation-unresolved");
  if (nonempty("Level") && scene.shapeSummary.Level.ownershipPresence.unknown) blockers.push("embedded-level-ownership-unknown");
  if (nonempty("Wall") && scene.shapeSummary.Wall.ownershipPresence.foreign) blockers.push("embedded-wall-ownership-foreign");
  if (nonempty("Region") && scene.shapeSummary.Region.ownershipPresence.foreign) blockers.push("embedded-region-ownership-foreign");
  return [...new Set(blockers)];
}

/**
 * Reconciles the current redacted M1138 evidence without creating promotion state.
 * A supervisor mismatch is stale evidence, so the function fails closed before
 * returning a preview decision. No runtime API or native document is referenced.
 */
export function createAscendancySignalRuneShapeAwareIdentityReconciliation(input: {
  readonly source: AscendancySignalRuneShapeAwareIdentitySource;
  readonly currentSupervisor: z.input<typeof supervisorSchema>;
}): AscendancySignalRuneShapeAwareIdentityReconciliation {
  const source = sourceEvidenceSchema.parse(input.source);
  const currentSupervisor = supervisorSchema.parse(input.currentSupervisor);
  if (source.supervisor.pid !== currentSupervisor.pid) {
    throw new Error("M1140 rejected stale supervisor evidence before preview reconciliation.");
  }
  if (source.target.worldId !== currentSupervisor.worldId
    || source.target.foundryVersion !== currentSupervisor.foundryVersion
    || source.target.systemId !== currentSupervisor.systemId
    || source.target.systemVersion !== currentSupervisor.systemVersion
    || source.target.activeGmName !== currentSupervisor.activeGmName) {
    throw new Error("M1140 rejected target or active-Gamemaster drift before preview reconciliation.");
  }
  const scenes = source.scenes.map((scene) => ({
    roomId: scene.roomId,
    sceneIdRuntime: scene.sceneIdRuntime,
    parentUuid: scene.parentUuid,
    shapeSummary: scene.shapeSummary,
    blockers: sceneBlockers(scene),
    ownershipDecision: "preserve-foreign-or-unknown" as const,
    runtimeBinding: "not-created" as const,
  })) as [z.infer<typeof sceneDecisionSchema>, z.infer<typeof sceneDecisionSchema>];
  const blockers = [...new Set(scenes.flatMap((scene) => scene.blockers))];
  return ascendancySignalRuneShapeAwareIdentityReconciliationSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.shape-aware-identity.reconciliation",
    sourceMilestone: "M1138",
    status: "BLOCKED",
    evidenceClass: "local",
    target: source.target,
    sourceSupervisorPid: source.supervisor.pid,
    currentSupervisorPid: currentSupervisor.pid,
    currentSupervisorMatch: true,
    scenes,
    blockers,
    foreignState: "preserve",
    retryAfterUnknown: false,
    noWrite: true,
    apply: false,
    runtimeBinding: "not-created",
    payload: "not-materialized",
    foundryIr: "not-created",
    proposal: "not-created",
    dispatch: "disabled",
    readyClaim: false,
  });
}
