import { z } from "zod";
import { ActiveGmEvidenceSchema, RuntimeFingerprintSchema, type ActiveGmEvidence } from "./runtime-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

const fixtureObservationKinds = ["journal", "activity", "region"] as const;
const fixtureContexts = ["GM", "Player3"] as const;
const fixtureStatuses = ["observed", "missing", "foreign", "unknown", "blocked"] as const;

const runtimeReference = z.string().min(1).max(240).regex(/^[^\u0000-\u001f\u007f]+$/);
const baseObservationRequest = z.object({
  semanticId: StableDiceBoxIdSchema,
}).strict();

const journalObservationRequestSchema = baseObservationRequest.extend({
  kind: z.literal("journal"),
  uuid: runtimeReference.regex(/^JournalEntry\./).optional(),
  id: runtimeReference.optional(),
}).refine((value) => Boolean(value.uuid || value.id), "Journal observation requires a UUID or collection ID.");

const activityObservationRequestSchema = baseObservationRequest.extend({
  kind: z.literal("activity"),
  parentUuid: runtimeReference.regex(/^Item\./).optional(),
  parentId: runtimeReference.optional(),
  activityId: runtimeReference,
}).refine((value) => Boolean(value.parentUuid || value.parentId), "Activity observation requires a parent UUID or collection ID.");

const regionObservationRequestSchema = baseObservationRequest.extend({
  kind: z.literal("region"),
  sceneUuid: runtimeReference.regex(/^Scene\./).optional(),
  sceneId: runtimeReference.optional(),
  regionId: runtimeReference,
}).refine((value) => Boolean(value.sceneUuid || value.sceneId), "Region observation requires a Scene UUID or collection ID.");

const fixtureObservationRequestSchema = z.object({
  kind: z.literal("fixture-observation"),
  fixturePlanId: StableDiceBoxIdSchema,
  context: z.enum(fixtureContexts),
  fixtures: z.array(z.union([
    journalObservationRequestSchema,
    activityObservationRequestSchema,
    regionObservationRequestSchema,
  ])).length(3),
}).strict().refine((value) => new Set(value.fixtures.map((fixture) => fixture.semanticId)).size === value.fixtures.length, "Fixture semantic IDs must be unique.").refine((value) => new Set(value.fixtures.map((fixture) => fixture.kind)).size === value.fixtures.length, "Fixture kinds must be unique.");

export type FoundryFixtureObservationRequest = z.infer<typeof fixtureObservationRequestSchema>;
export const FoundryFixtureObservationRequestSchema = fixtureObservationRequestSchema;

const fixtureObservationCheckSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  status: z.enum(["pass", "blocked", "unknown"]),
  foundryApi: z.string().min(1).max(240),
  reason: z.string().min(1).max(500),
}).strict();

const fixtureObservationSchema = z.object({
  semanticId: StableDiceBoxIdSchema,
  kind: z.enum(fixtureObservationKinds),
  status: z.enum(fixtureStatuses),
  bindingFingerprint: z.string().regex(/^redacted:[0-9a-f]{8}$/).nullable(),
  childCount: z.number().int().nonnegative().nullable(),
  shapeCount: z.number().int().nonnegative().nullable(),
  behaviorTypes: z.array(z.string().min(1).max(120)).max(100),
  readiness: z.object({
    canUse: z.boolean().nullable(),
    isOwner: z.boolean().nullable(),
  }).strict().nullable(),
  notes: z.array(z.string().min(1).max(500)).max(8),
}).strict();

const fixtureObservationTargetSchema = z.object({
  fingerprintId: StableDiceBoxIdSchema,
  foundryVersion: z.string().min(1).nullable(),
  systemId: z.string().min(1).nullable(),
  systemVersion: z.string().min(1).nullable(),
}).strict();

const fixtureObservationReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  operation: z.literal("foundry.fixture.observation"),
  status: z.enum(["observed", "blocked", "unknown"]),
  evidenceClass: z.enum(["full_function", "blocked"]),
  source: z.literal("foundry-ready-hook"),
  target: fixtureObservationTargetSchema,
  runtimeFingerprint: RuntimeFingerprintSchema,
  fixturePlanId: StableDiceBoxIdSchema,
  context: z.enum(fixtureContexts),
  activeGm: ActiveGmEvidenceSchema,
  observations: z.array(fixtureObservationSchema).max(20),
  checks: z.array(fixtureObservationCheckSchema).max(20),
  noWrite: z.literal(true),
  noRawData: z.literal(true),
  mutation: z.literal("disabled"),
  observedAt: z.string().datetime({ offset: true }),
}).strict();

export type FixtureObservation = z.infer<typeof fixtureObservationSchema>;
export const FixtureObservationSchema = fixtureObservationSchema;
export type FixtureObservationCheck = z.infer<typeof fixtureObservationCheckSchema>;
export const FixtureObservationCheckSchema = fixtureObservationCheckSchema;
export type FoundryFixtureObservationReceipt = z.infer<typeof fixtureObservationReceiptSchema>;
export const FoundryFixtureObservationReceiptSchema = fixtureObservationReceiptSchema;

const fixtureObservationAuditSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("foundry.fixture.observation.audit"),
  status: z.enum(["reviewable", "blocked"]),
  evidenceClass: z.enum(["full_function", "blocked"]),
  exactTargetMatch: z.boolean(),
  readyClaim: z.literal(false),
  noWrite: z.literal(true),
  noRawData: z.literal(true),
  foundryApiEvidence: z.enum(["read-only-exercised", "structured-only"]),
  receiptId: StableDiceBoxIdSchema,
  fixturePlanId: StableDiceBoxIdSchema,
  blockers: z.array(z.string().min(1).max(500)).max(20),
  notes: z.array(z.string().min(1).max(500)).max(12),
}).strict();

export type FoundryFixtureObservationAudit = z.infer<typeof fixtureObservationAuditSchema>;
export const FoundryFixtureObservationAuditSchema = fixtureObservationAuditSchema;

const requiredCheckApis: Readonly<Record<string, string>> = {
  "ready-lifecycle": "Hooks.once(\"ready\")",
  "target-fingerprint": "game.version + game.system.id + game.system.version",
  "active-gm": "game.users.activeGM / User permissions",
  context: "game.user / User.isGM",
  "journal-observation": "fromUuid / game.journal.get / JournalEntry.pages",
  "activity-observation": "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\", id)",
  "region-observation": "game.scenes.get / scene.getEmbeddedDocument(\"Region\", id) / RegionDocument.shapes",
  "authoritative-reread": "fromUuid / document collections / embedded-document getters",
  "no-write": "no Foundry create/update/delete or Activity.use invocation",
};

function expectedTarget(receipt: FoundryFixtureObservationReceipt): boolean {
  return receipt.target.foundryVersion === TARGET_FOUNDRY_VERSION
    && receipt.target.systemId === "dnd5e"
    && receipt.target.systemVersion === TARGET_DND5E_VERSION;
}

/**
 * Validate a read-only exact-runtime observation without turning it into a
 * readiness or mutation claim. The receipt may prove that a narrow API was
 * exercised, but the larger exact-runtime and recovery gates remain separate.
 */
export function auditFoundryFixtureObservation(
  input: unknown,
): FoundryFixtureObservationAudit {
  let receipt: FoundryFixtureObservationReceipt;
  try {
    receipt = fixtureObservationReceiptSchema.parse(input);
  } catch {
    return fixtureObservationAuditSchema.parse({
      schemaVersion: "0.1.0",
      operation: "foundry.fixture.observation.audit",
      status: "blocked",
      evidenceClass: "blocked",
      exactTargetMatch: false,
      readyClaim: false,
      noWrite: true,
      noRawData: true,
      foundryApiEvidence: "structured-only",
      receiptId: createStableDiceBoxId("receipt", "fixture-observation-invalid"),
      fixturePlanId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
      blockers: ["Fixture observation receipt failed schema validation."],
      notes: ["Malformed or untrusted observation input was discarded without echoing it."],
    });
  }

  const checkMap = new Map(receipt.checks.map((check) => [check.id, check]));
  const blockers: string[] = [];
  if (checkMap.size !== receipt.checks.length) blockers.push("Duplicate fixture observation check IDs are not permitted.");
  if (new Set(receipt.observations.map((observation) => observation.semanticId)).size !== receipt.observations.length) blockers.push("Duplicate fixture observation semantic IDs are not permitted.");
  for (const [id, foundryApi] of Object.entries(requiredCheckApis)) {
    const check = checkMap.get(id);
    if (!check) blockers.push(`Missing required check ${id} for ${foundryApi}.`);
    else if (check.foundryApi !== foundryApi) blockers.push(`Check ${id} names an unexpected Foundry API boundary.`);
    else if (check.status !== "pass") blockers.push(`Check ${id} is ${check.status}; exact behavior remains unresolved.`);
  }
  if (!expectedTarget(receipt)) blockers.push("Observation target does not match Foundry 14.367 / D&D5e 5.3.3.");
  if (receipt.runtimeFingerprint.fingerprintId !== receipt.target.fingerprintId) blockers.push("Runtime fingerprint and receipt target binding do not match.");
  if (receipt.runtimeFingerprint.foundryVersion !== receipt.target.foundryVersion
    || receipt.runtimeFingerprint.systemId !== receipt.target.systemId
    || receipt.runtimeFingerprint.systemVersion !== receipt.target.systemVersion) blockers.push("Runtime fingerprint metadata does not match the receipt target.");
  if (!receipt.runtimeFingerprint.exactTargetMatch) blockers.push("Runtime fingerprint does not establish the exact configured target.");
  if (receipt.status === "observed" && receipt.evidenceClass !== "full_function") blockers.push("Observed runtime evidence must be classified full_function.");
  if (receipt.status !== "observed" && receipt.evidenceClass !== "blocked") blockers.push("Non-observed runtime evidence must be classified blocked.");
  if (receipt.observations.length === 0) blockers.push("No semantic fixture observation was recorded.");

  return fixtureObservationAuditSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.fixture.observation.audit",
    status: blockers.length === 0 ? "reviewable" : "blocked",
    evidenceClass: blockers.length === 0 ? receipt.evidenceClass : "blocked",
    exactTargetMatch: expectedTarget(receipt),
    readyClaim: false,
    noWrite: true,
    noRawData: true,
    foundryApiEvidence: receipt.status === "observed" ? "read-only-exercised" : "structured-only",
    receiptId: receipt.receiptId,
    fixturePlanId: receipt.fixturePlanId,
    blockers,
    notes: [
      "This audit validates a narrow read-only observation receipt only; it does not certify permissions, authority, writes, recovery, cross-client behavior, or Ready-to-Play.",
      "Runtime IDs, document content, raw Activity configuration, raw Region geometry, and provider payloads must remain absent from the receipt.",
    ],
  });
}

export function createBlockedFoundryFixtureObservation(reason: string): FoundryFixtureObservationAudit {
  return fixtureObservationAuditSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.fixture.observation.audit",
    status: "blocked",
    evidenceClass: "blocked",
    exactTargetMatch: false,
    readyClaim: false,
    noWrite: true,
    noRawData: true,
    foundryApiEvidence: "structured-only",
    receiptId: createStableDiceBoxId("receipt", "fixture-observation-blocked"),
    fixturePlanId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
    blockers: [reason.slice(0, 500)],
    notes: ["No Foundry operation was attempted."],
  });
}

export type { ActiveGmEvidence };
