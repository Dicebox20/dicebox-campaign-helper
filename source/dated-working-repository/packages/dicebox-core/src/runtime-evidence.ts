import { z } from "zod";
import {
  CapabilityIdSchema,
  RuntimeProfileSchema,
  capabilityStates,
  type RuntimeProfile,
} from "./capability.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

const runtimePhases = ["m0", "runtime-probe", "ready"] as const;

export const runtimeFingerprintSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  fingerprintId: StableDiceBoxIdSchema,
  phase: z.enum(runtimePhases),
  foundryVersion: z.string().min(1).nullable(),
  systemId: z.string().min(1).nullable(),
  systemVersion: z.string().min(1).nullable(),
  observedAt: z.string().datetime({ offset: true }).nullable(),
  exactTargetMatch: z.boolean(),
  capabilities: z.array(z.object({
    id: CapabilityIdSchema,
    state: z.enum(capabilityStates),
  }).strict()),
}).strict();

export type RuntimeFingerprint = z.infer<typeof runtimeFingerprintSchema>;

export const runtimeProbeReceiptSchema = z.object({
  receiptVersion: z.literal(1),
  receiptId: StableDiceBoxIdSchema,
  operation: z.literal("foundry.runtime.probe"),
  status: z.enum(["observed", "mismatch", "not-tested"]),
  evidenceClass: z.enum(["static", "deterministic", "blocked"]),
  source: z.enum(["foundry-ready-hook", "fixture"]),
  fingerprintId: StableDiceBoxIdSchema,
  observedAt: z.string().datetime({ offset: true }).nullable(),
  noWrite: z.literal(true),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type RuntimeProbeReceipt = z.infer<typeof runtimeProbeReceiptSchema>;

export const RuntimeFingerprintSchema = runtimeFingerprintSchema;
export const RuntimeProbeReceiptSchema = runtimeProbeReceiptSchema;

export const activeGmEvidenceSchema = z.object({
  status: z.enum(["observed", "unknown", "unavailable"]),
  source: z.enum(["game.users.activeGM", "game.users.getDesignatedUser", "fixture", "none"]),
  userFingerprint: z.string().regex(/^redacted:[0-9a-f]{8}$/).nullable(),
  isCurrentUser: z.boolean().nullable(),
}).strict();

export type ActiveGmEvidence = z.infer<typeof activeGmEvidenceSchema>;
export const ActiveGmEvidenceSchema = activeGmEvidenceSchema;

export function createUnobservedActiveGmEvidence(): ActiveGmEvidence {
  return activeGmEvidenceSchema.parse({
    status: "unknown",
    source: "fixture",
    userFingerprint: null,
    isCurrentUser: null,
  });
}

export const managedJournalSnapshotEntrySchema = z.object({
  semanticId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  documentType: z.literal("JournalEntry"),
  pageCount: z.number().int().nonnegative(),
  bindingFingerprint: z.string().regex(/^redacted:[0-9a-f]{8}$/),
}).strict();

export const managedJournalSnapshotSchema = z.object({
  status: z.enum(["observed", "unavailable"]),
  documents: z.array(managedJournalSnapshotEntrySchema).max(500),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type ManagedJournalSnapshot = z.infer<typeof managedJournalSnapshotSchema>;
export const ManagedJournalSnapshotSchema = managedJournalSnapshotSchema;

export function createUnavailableManagedJournalSnapshot(): ManagedJournalSnapshot {
  return managedJournalSnapshotSchema.parse({
    status: "unavailable",
    documents: [],
    notes: ["The Foundry Journal collection was not observed in this runtime profile."],
  });
}

export const journalApiEvidenceSchema = z.object({
  status: z.enum(["observed", "partial", "unavailable"]),
  surfaces: z.object({
    journalEntryCreate: z.boolean(),
    fromUuid: z.boolean(),
    journalCollectionGet: z.boolean(),
    journalEntryUpdate: z.boolean(),
    embeddedPageCreate: z.boolean(),
  }).strict(),
  page: z.object({
    defaultType: z.string().min(1).nullable(),
    textFormats: z.array(z.number().int().nonnegative()).max(50),
  }).strict(),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type JournalApiEvidence = z.infer<typeof journalApiEvidenceSchema>;
export const JournalApiEvidenceSchema = journalApiEvidenceSchema;

export function createUnavailableJournalApiEvidence(): JournalApiEvidence {
  return journalApiEvidenceSchema.parse({
    status: "unavailable",
    surfaces: {
      journalEntryCreate: false,
      fromUuid: false,
      journalCollectionGet: false,
      journalEntryUpdate: false,
      embeddedPageCreate: false,
    },
    page: { defaultType: null, textFormats: [] },
    notes: ["JournalEntry factory, binding, collection, or page schema surfaces were not observed in this runtime profile."],
  });
}

export const activityApiEvidenceSchema = z.object({
  status: z.enum(["observed", "partial", "unavailable"]),
  systemId: z.string().min(1).nullable(),
  registeredActivityTypes: z.array(z.string().min(1)).max(100),
  surfaces: z.object({
    fromUuid: z.boolean(),
    itemCollectionGet: z.boolean(),
    itemGetEmbeddedDocument: z.boolean(),
    activityFieldClass: z.boolean(),
    activityCollectionClass: z.boolean(),
    activityCollectionGet: z.boolean(),
    itemActivityCollectionInstance: z.boolean(),
    activityUse: z.boolean(),
    hookFramework: z.boolean(),
    preUseActivityNamed: z.boolean(),
    postUseActivityNamed: z.boolean(),
  }).strict(),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type ActivityApiEvidence = z.infer<typeof activityApiEvidenceSchema>;
export const ActivityApiEvidenceSchema = activityApiEvidenceSchema;

export function createUnavailableActivityApiEvidence(): ActivityApiEvidence {
  return activityApiEvidenceSchema.parse({
    status: "unavailable",
    systemId: null,
    registeredActivityTypes: [],
    surfaces: {
      fromUuid: false,
      itemCollectionGet: false,
      itemGetEmbeddedDocument: false,
      activityFieldClass: false,
      activityCollectionClass: false,
      activityCollectionGet: false,
      itemActivityCollectionInstance: false,
      activityUse: false,
      hookFramework: false,
      preUseActivityNamed: false,
      postUseActivityNamed: false,
    },
    notes: ["D&D5e Activity registry, Item Activity collection, Activity.use, or lifecycle hook surfaces were not observed in this runtime profile."],
  });
}

export const activeEffectApiEvidenceSchema = z.object({
  status: z.enum(["observed", "partial", "unavailable"]),
  parentDocumentTypes: z.array(z.enum(["Actor", "Item"])).max(2),
  activeEffectDocumentName: z.literal("ActiveEffect").nullable(),
  surfaces: z.object({
    fromUuid: z.boolean(),
    actorCollectionGet: z.boolean(),
    itemCollectionGet: z.boolean(),
    actorEmbeddedCollectionRead: z.boolean(),
    itemEmbeddedCollectionRead: z.boolean(),
    actorEmbeddedDocumentRead: z.boolean(),
    itemEmbeddedDocumentRead: z.boolean(),
    activeEffectClass: z.boolean(),
    activeEffectIdAccessor: z.boolean(),
    activeEffectUuidAccessor: z.boolean(),
    activeEffectActiveAccessor: z.boolean(),
    activeEffectSuppressedAccessor: z.boolean(),
    hookFramework: z.boolean(),
    applyActiveEffectNamed: z.boolean(),
    actorEmbeddedCreate: z.boolean(),
    itemEmbeddedCreate: z.boolean(),
    activeEffectUpdate: z.boolean(),
    activeEffectDelete: z.boolean(),
  }).strict(),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type ActiveEffectApiEvidence = z.infer<typeof activeEffectApiEvidenceSchema>;
export const ActiveEffectApiEvidenceSchema = activeEffectApiEvidenceSchema;

export function createUnavailableActiveEffectApiEvidence(): ActiveEffectApiEvidence {
  return activeEffectApiEvidenceSchema.parse({
    status: "unavailable",
    parentDocumentTypes: [],
    activeEffectDocumentName: null,
    surfaces: {
      fromUuid: false,
      actorCollectionGet: false,
      itemCollectionGet: false,
      actorEmbeddedCollectionRead: false,
      itemEmbeddedCollectionRead: false,
      actorEmbeddedDocumentRead: false,
      itemEmbeddedDocumentRead: false,
      activeEffectClass: false,
      activeEffectIdAccessor: false,
      activeEffectUuidAccessor: false,
      activeEffectActiveAccessor: false,
      activeEffectSuppressedAccessor: false,
      hookFramework: false,
      applyActiveEffectNamed: false,
      actorEmbeddedCreate: false,
      itemEmbeddedCreate: false,
      activeEffectUpdate: false,
      activeEffectDelete: false,
    },
    notes: ["Actor/Item ActiveEffect parent collections, embedded-document reads, or ActiveEffect document surfaces were not observed in this runtime profile."],
  });
}

export const regionBehaviorApiEvidenceSchema = z.object({
  status: z.enum(["observed", "partial", "unavailable"]),
  regionDocumentName: z.literal("Region").nullable(),
  regionBehaviorDocumentName: z.literal("RegionBehavior").nullable(),
  registeredBehaviorTypes: z.array(z.string().min(1)).max(100),
  surfaces: z.object({
    fromUuid: z.boolean(),
    sceneCollectionGet: z.boolean(),
    regionEmbeddedCollectionRead: z.boolean(),
    regionEmbeddedDocumentRead: z.boolean(),
    regionDocumentClass: z.boolean(),
    regionBehaviorClass: z.boolean(),
    behaviorTypeSchemaField: z.boolean(),
    behaviorActiveAccessor: z.boolean(),
    behaviorDisabledSchemaField: z.boolean(),
    behaviorRegistry: z.boolean(),
    behaviorEvents: z.boolean(),
    regionEmbeddedCreate: z.boolean(),
    regionBehaviorUpdate: z.boolean(),
    regionBehaviorDelete: z.boolean(),
  }).strict(),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type RegionBehaviorApiEvidence = z.infer<typeof regionBehaviorApiEvidenceSchema>;
export const RegionBehaviorApiEvidenceSchema = regionBehaviorApiEvidenceSchema;

export function createUnavailableRegionBehaviorApiEvidence(): RegionBehaviorApiEvidence {
  return regionBehaviorApiEvidenceSchema.parse({
    status: "unavailable",
    regionDocumentName: null,
    regionBehaviorDocumentName: null,
    registeredBehaviorTypes: [],
    surfaces: {
      fromUuid: false,
      sceneCollectionGet: false,
      regionEmbeddedCollectionRead: false,
      regionEmbeddedDocumentRead: false,
      regionDocumentClass: false,
      regionBehaviorClass: false,
      behaviorTypeSchemaField: false,
      behaviorActiveAccessor: false,
      behaviorDisabledSchemaField: false,
      behaviorRegistry: false,
      behaviorEvents: false,
      regionEmbeddedCreate: false,
      regionBehaviorUpdate: false,
      regionBehaviorDelete: false,
    },
    notes: ["Foundry Region/RegionBehavior resolution, registry, embedded-document, or subtype event surfaces were not observed in this runtime profile."],
  });
}

const optionalModuleEvidenceSchema = z.object({
  status: z.enum(["observed", "partial", "unavailable"]),
  resolutionApi: z.literal("game.modules.get"),
  midiQol: z.object({
    installed: z.boolean(),
    active: z.boolean().nullable(),
    version: z.string().min(1).nullable(),
    moduleApiPresent: z.boolean(),
    globalPresent: z.boolean(),
    completeItemUse: z.boolean(),
    applyTokenDamage: z.boolean(),
  }).strict(),
  dae: z.object({
    installed: z.boolean(),
    active: z.boolean().nullable(),
    version: z.string().min(1).nullable(),
    moduleApiPresent: z.boolean(),
  }).strict(),
  surfaces: z.object({
    moduleCollectionGet: z.boolean(),
    hookFramework: z.boolean(),
  }).strict(),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type OptionalModuleApiEvidence = z.infer<typeof optionalModuleEvidenceSchema>;
export const OptionalModuleApiEvidenceSchema = optionalModuleEvidenceSchema;

export function createUnavailableOptionalModuleApiEvidence(): OptionalModuleApiEvidence {
  return optionalModuleEvidenceSchema.parse({
    status: "unavailable",
    resolutionApi: "game.modules.get",
    midiQol: {
      installed: false,
      active: null,
      version: null,
      moduleApiPresent: false,
      globalPresent: false,
      completeItemUse: false,
      applyTokenDamage: false,
    },
    dae: {
      installed: false,
      active: null,
      version: null,
      moduleApiPresent: false,
    },
    surfaces: {
      moduleCollectionGet: false,
      hookFramework: false,
    },
    notes: ["Foundry game.modules.get or the optional Midi-QOL/DAE module records were not observed in this runtime profile."],
  });
}

function fnv1a(input: string): string {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function createRuntimeFingerprint(input: RuntimeProfile): RuntimeFingerprint {
  const profile = RuntimeProfileSchema.parse(input);
  const capabilities = [...profile.capabilities]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => ({ id: entry.id, state: entry.state }));
  const canonical = JSON.stringify({
    phase: profile.phase,
    foundryVersion: profile.foundryVersion,
    systemId: profile.systemId,
    systemVersion: profile.systemVersion,
    activeModuleIds: [...profile.activeModuleIds].sort(),
    documentTypes: [...profile.documentTypes].sort(),
    capabilities,
  });
  return runtimeFingerprintSchema.parse({
    schemaVersion: "0.1.0",
    fingerprintId: createStableDiceBoxId("fingerprint", fnv1a(canonical)),
    phase: profile.phase,
    foundryVersion: profile.foundryVersion,
    systemId: profile.systemId,
    systemVersion: profile.systemVersion,
    observedAt: profile.observedAt,
    exactTargetMatch: profile.phase !== "m0"
      && profile.foundryVersion === TARGET_FOUNDRY_VERSION
      && profile.systemId === "dnd5e"
      && profile.systemVersion === TARGET_DND5E_VERSION,
    capabilities,
  });
}

export function createRuntimeProbeReceipt(
  input: RuntimeProfile,
  source: RuntimeProbeReceipt["source"] = "fixture",
): RuntimeProbeReceipt {
  const fingerprint = createRuntimeFingerprint(input);
  const status = fingerprint.phase === "m0"
    ? "not-tested"
    : fingerprint.exactTargetMatch ? "observed" : "mismatch";
  return runtimeProbeReceiptSchema.parse({
    receiptVersion: 1,
    receiptId: createStableDiceBoxId("receipt", `runtime-probe-${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}`),
    operation: "foundry.runtime.probe",
    status,
    evidenceClass: status === "observed" ? "deterministic" : status === "mismatch" ? "blocked" : "static",
    source,
    fingerprintId: fingerprint.fingerprintId,
    observedAt: fingerprint.observedAt,
    noWrite: true,
    notes: [
      "The probe reads runtime metadata and registries only; no Document, setting, socket, or authority mutation was attempted.",
      status === "observed" ? "The profile matches the configured Foundry 14.367 / D&D5e 5.3.3 target." : "This receipt is not live certification; exact behavior and permissions remain separate gates.",
    ],
  });
}
