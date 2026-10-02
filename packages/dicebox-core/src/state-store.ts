import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { RuntimeFingerprintSchema } from "./runtime-evidence.js";

const stateStoreDomains = ["semantic-campaign", "runtime-projection", "transaction-recovery"] as const;
const stateStoreKinds = ["program-json", "foundry-document-native", "foundry-settings", "foundry-document-flags", "foundry-journal"] as const;
const evidenceClasses = ["static", "deterministic", "exact-runtime"] as const;

export const StateStoreDomainSchema = z.enum(stateStoreDomains);
export const StateStoreKindSchema = z.enum(stateStoreKinds);
export const StateStoreEvidenceClassSchema = z.enum(evidenceClasses);

export type StateStoreDomain = z.infer<typeof StateStoreDomainSchema>;
export type StateStoreKind = z.infer<typeof StateStoreKindSchema>;
export type StateStoreEvidenceClass = z.infer<typeof StateStoreEvidenceClassSchema>;

export const stateStoreApiCatalog = Object.freeze({
  settings: Object.freeze([
    "Hooks.once(\"init\")",
    "game.settings.register",
    "game.settings.get",
    "game.settings.set",
  ]),
  documentFlags: Object.freeze([
    "Document.getFlag",
    "Document.setFlag",
    "Document.unsetFlag",
    "fromUuid",
  ]),
  journal: Object.freeze([
    "JournalEntry.create",
    "JournalEntry.update",
    "entry.createEmbeddedDocuments(\"JournalEntryPage\", ...)",
    "fromUuid",
    "game.journal.get",
  ]),
} as const);

const stateStoreObservationSchema = z.object({
  evidenceClass: StateStoreEvidenceClassSchema,
  settings: z.object({
    initHook: z.boolean(),
    register: z.boolean(),
    get: z.boolean(),
    set: z.boolean(),
    worldScope: z.boolean(),
    authoritativeReread: z.boolean(),
  }).strict(),
  documentFlags: z.object({
    getFlag: z.boolean(),
    setFlag: z.boolean(),
    unsetFlag: z.boolean(),
    ownerDocumentBound: z.boolean(),
    authoritativeReread: z.boolean(),
  }).strict(),
  journal: z.object({
    create: z.boolean(),
    update: z.boolean(),
    embeddedPageCreate: z.boolean(),
    fromUuid: z.boolean(),
    collectionGet: z.boolean(),
    authoritativeReread: z.boolean(),
  }).strict(),
  activeGm: z.enum(["observed", "unknown", "unavailable"]),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export const StateStoreObservationSchema = stateStoreObservationSchema;
export type StateStoreObservation = z.infer<typeof stateStoreObservationSchema>;

export function createUnavailableStateStoreObservation(
  evidenceClass: StateStoreEvidenceClass = "deterministic",
): StateStoreObservation {
  return stateStoreObservationSchema.parse({
    evidenceClass,
    settings: {
      initHook: false,
      register: false,
      get: false,
      set: false,
      worldScope: false,
      authoritativeReread: false,
    },
    documentFlags: {
      getFlag: false,
      setFlag: false,
      unsetFlag: false,
      ownerDocumentBound: false,
      authoritativeReread: false,
    },
    journal: {
      create: false,
      update: false,
      embeddedPageCreate: false,
      fromUuid: false,
      collectionGet: false,
      authoritativeReread: false,
    },
    activeGm: "unknown",
    notes: ["Exact Foundry StateStore surfaces have not been observed; all Foundry-backed candidates remain gated."],
  });
}

const stateStoreCandidateSchema = z.object({
  kind: StateStoreKindSchema,
  domain: StateStoreDomainSchema,
  status: z.enum(["selected", "candidate", "blocked", "not-selected"]),
  authoritativeOwner: z.enum(["program", "foundry-runtime", "deferred"]),
  foundryApis: z.array(z.string().min(1)).max(8),
  reason: z.string().min(1),
  blockers: z.array(z.string().min(1)).max(8),
}).strict();

export const StateStoreCandidateSchema = stateStoreCandidateSchema;
export type StateStoreCandidate = z.infer<typeof stateStoreCandidateSchema>;

const stateMigrationEntrySchema = z.object({
  fieldId: z.string().regex(/^[a-z][a-z0-9._-]{2,80}$/),
  source: StateStoreKindSchema,
  target: StateStoreKindSchema,
  operation: z.enum(["retain", "copy-binding", "replay-journal", "preserve-unknown", "defer"]),
  foundryApis: z.array(z.string().min(1)).max(8),
  requiresAuthoritativeReread: z.boolean(),
  reason: z.string().min(1),
}).strict();

export const StateMigrationEntrySchema = stateMigrationEntrySchema;
export type StateMigrationEntry = z.infer<typeof stateMigrationEntrySchema>;

const stateMigrationPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  status: z.enum(["preview-only", "blocked"]),
  noWrite: z.literal(true),
  entries: z.array(stateMigrationEntrySchema).min(1).max(20),
  blockers: z.array(z.string().min(1)).max(12),
}).strict();

export const StateMigrationPlanSchema = stateMigrationPlanSchema;
export type StateMigrationPlan = z.infer<typeof stateMigrationPlanSchema>;

const stateStoreSelectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  status: z.enum(["ready", "blocked"]),
  evidenceClass: StateStoreEvidenceClassSchema,
  noWrite: z.literal(true),
  targetFingerprintId: StableDiceBoxIdSchema,
  candidates: z.array(stateStoreCandidateSchema).length(5),
  migration: stateMigrationPlanSchema,
  blockers: z.array(z.string().min(1)).max(16),
  nextGates: z.array(z.string().min(1)).max(12),
}).strict();

export const StateStoreSelectionPlanSchema = stateStoreSelectionPlanSchema;
export type StateStoreSelectionPlan = z.infer<typeof stateStoreSelectionPlanSchema>;

export interface StateStoreSelectionInput {
  readonly target: z.infer<typeof RuntimeFingerprintSchema>;
  readonly observation: StateStoreObservation;
}

function stablePlanId(targetFingerprintId: string): string {
  return createStableDiceBoxId("state-store-plan", targetFingerprintId.split(":").at(-1) ?? "unknown");
}

function all(values: readonly boolean[]): boolean {
  return values.every(Boolean);
}

function candidate(
  kind: StateStoreKind,
  domain: StateStoreDomain,
  status: StateStoreCandidate["status"],
  authoritativeOwner: StateStoreCandidate["authoritativeOwner"],
  foundryApis: readonly string[],
  reason: string,
  blockers: readonly string[] = [],
): StateStoreCandidate {
  return stateStoreCandidateSchema.parse({
    kind,
    domain,
    status,
    authoritativeOwner,
    foundryApis: [...foundryApis],
    reason,
    blockers: [...blockers],
  });
}

/**
 * Produce a review-only StateStore choice and migration plan.
 *
 * The program remains authoritative for semantic campaign state. Foundry
 * documents remain authoritative for runtime projections. Foundry settings
 * are only a candidate for transaction recovery after exact-world evidence;
 * this function never calls a Foundry API or emits raw state values.
 */
export function createStateStoreSelectionPlan(input: StateStoreSelectionInput): StateStoreSelectionPlan {
  const target = RuntimeFingerprintSchema.parse(input.target);
  const observation = stateStoreObservationSchema.parse(input.observation);
  const exactEvidence = observation.evidenceClass === "exact-runtime"
    && target.exactTargetMatch
    && target.phase === "ready";

  const settingsReady = exactEvidence
    && all([
      observation.settings.initHook,
      observation.settings.register,
      observation.settings.get,
      observation.settings.set,
      observation.settings.worldScope,
      observation.settings.authoritativeReread,
      observation.activeGm === "observed",
    ]);
  const flagsReady = exactEvidence
    && all([
      observation.documentFlags.getFlag,
      observation.documentFlags.setFlag,
      observation.documentFlags.unsetFlag,
      observation.documentFlags.ownerDocumentBound,
      observation.documentFlags.authoritativeReread,
      observation.activeGm === "observed",
    ]);
  const journalReady = exactEvidence
    && all([
      observation.journal.create,
      observation.journal.update,
      observation.journal.embeddedPageCreate,
      observation.journal.fromUuid,
      observation.journal.collectionGet,
      observation.journal.authoritativeReread,
      observation.activeGm === "observed",
    ]);

  const blockers: string[] = [];
  if (!exactEvidence) blockers.push("Exact Foundry 14.367 / D&D5e 5.3.3 evidence is required before selecting a live Foundry persistence driver.");
  if (!settingsReady) blockers.push("Foundry settings registration, world scope, active-GM authority, and reread evidence are incomplete.");
  if (!flagsReady) blockers.push("A stable owning Foundry Document, flag permissions, and flag reread behavior are not proven.");
  if (!journalReady) blockers.push("JournalEntry persistence shape, permissions, page binding, and authoritative reread are not proven.");

  const candidates = [
    candidate(
      "program-json",
      "semantic-campaign",
      "selected",
      "program",
      [],
      "The program owns canonical semantic campaign state; this driver is not a substitute for Foundry runtime truth.",
    ),
    candidate(
      "foundry-document-native",
      "runtime-projection",
      "selected",
      "foundry-runtime",
      ["fromUuid", "game.journal.get", "Document.getFlag"],
      "Native Foundry Documents remain the runtime authority; DiceBox stores only stable IDs and reviewed managed bindings.",
    ),
    candidate(
      "foundry-settings",
      "transaction-recovery",
      settingsReady ? "selected" : "blocked",
      settingsReady ? "foundry-runtime" : "deferred",
      stateStoreApiCatalog.settings,
      settingsReady ? "Exact settings evidence supports a bounded world-scoped recovery journal." : "Settings remain a gated candidate; no write is authorized.",
      settingsReady ? [] : ["exact settings and reread evidence"],
    ),
    candidate(
      "foundry-document-flags",
      "runtime-projection",
      flagsReady ? "candidate" : "blocked",
      flagsReady ? "foundry-runtime" : "deferred",
      stateStoreApiCatalog.documentFlags,
      flagsReady ? "A flag-backed auxiliary binding may be reviewed for a specific owning Document." : "Flags cannot become campaign truth without an exact owning Document and reread proof.",
      flagsReady ? [] : ["exact owner, permission, and flag reread evidence"],
    ),
    candidate(
      "foundry-journal",
      "semantic-campaign",
      journalReady ? "candidate" : "blocked",
      journalReady ? "foundry-runtime" : "deferred",
      stateStoreApiCatalog.journal,
      journalReady ? "A JournalEntry-backed semantic mirror may be reviewed, but it does not supersede program truth." : "JournalEntry storage remains a migration candidate until page schema and recovery behavior are proven.",
      journalReady ? [] : ["exact JournalEntry schema, permission, and read-back evidence"],
    ),
  ];

  const migrationBlockers = blockers.length === 0 ? [] : [...blockers];
  const migration = stateMigrationPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("state-migration", target.fingerprintId.split(":").at(-1) ?? "unknown"),
    status: migrationBlockers.length === 0 ? "preview-only" : "blocked",
    noWrite: true,
    entries: [
      {
        fieldId: "campaign.semantic-state",
        source: "program-json",
        target: "program-json",
        operation: "retain",
        foundryApis: [],
        requiresAuthoritativeReread: false,
        reason: "Canonical semantic state stays in the program store; no Foundry copy is authoritative.",
      },
      {
        fieldId: "projection.runtime-binding",
        source: "program-json",
        target: "foundry-document-native",
        operation: "copy-binding",
        foundryApis: ["fromUuid", "game.journal.get", "Document.getFlag"],
        requiresAuthoritativeReread: true,
        reason: "Only reviewed stable-ID-to-Foundry bindings may be projected, then reread from Foundry.",
      },
      {
        fieldId: "transaction.recovery-journal",
        source: "program-json",
        target: "foundry-settings",
        operation: "replay-journal",
        foundryApis: stateStoreApiCatalog.settings,
        requiresAuthoritativeReread: true,
        reason: "Recovery history may be replayed into a bounded world setting only after exact evidence and GM recheck.",
      },
      {
        fieldId: "foreign.runtime-state",
        source: "foundry-document-native",
        target: "foundry-document-native",
        operation: "preserve-unknown",
        foundryApis: ["fromUuid", "Document.getFlag"],
        requiresAuthoritativeReread: true,
        reason: "Unknown, foreign, and runtime-owned state is preserved and never migrated by omission.",
      },
    ],
    blockers: migrationBlockers,
  });

  return stateStoreSelectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: stablePlanId(target.fingerprintId),
    status: blockers.length === 0 ? "ready" : "blocked",
    evidenceClass: observation.evidenceClass,
    noWrite: true,
    targetFingerprintId: target.fingerprintId,
    candidates,
    migration,
    blockers,
    nextGates: [
      "Capture exact Foundry 14.367 settings, flag, JournalEntry, authority, and authoritative reread receipts.",
      "Select one bounded transaction-recovery driver only after active-GM and restart/recovery evidence.",
      "Run a migration preview against redacted stable IDs and preserve foreign or unknown runtime state.",
      "Keep campaign compilation and broad mutation disabled until the M0/M15 review gates pass.",
    ],
  });
}
