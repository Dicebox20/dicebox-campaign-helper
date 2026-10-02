import { z } from "zod";
import {
  type ActiveEffectApiEvidence,
  type ActiveGmEvidence,
  type ActivityApiEvidence,
  type JournalApiEvidence,
  type ManagedJournalSnapshot,
  type OptionalModuleApiEvidence,
  type RegionBehaviorApiEvidence,
  type RuntimeFingerprint,
  type RuntimeProbeReceipt,
} from "./runtime-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { RuntimeProfileSchema, type RuntimeProfile } from "./capability.js";

const readinessCheckSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["pass", "blocked", "unknown"]),
  required: z.literal(true),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

const readinessBlockerSchema = z.object({
  checkId: z.string().min(1),
  title: z.string().min(1),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const readinessReportSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  reportId: StableDiceBoxIdSchema,
  status: z.enum(["blocked", "ready"]),
  evidenceClass: z.enum(["static", "deterministic"]),
  source: z.enum(["fixture", "foundry-ready-hook"]),
  noWrite: z.literal(true),
  observedAt: z.string().datetime({ offset: true }).nullable(),
  target: z.object({
    foundryVersion: z.string().min(1).nullable(),
    systemId: z.string().min(1).nullable(),
    systemVersion: z.string().min(1).nullable(),
    exactTargetMatch: z.boolean(),
  }).strict(),
  summary: z.object({
    pass: z.number().int().nonnegative(),
    blocked: z.number().int().nonnegative(),
    unknown: z.number().int().nonnegative(),
    total: z.number().int().positive(),
  }).strict(),
  checks: z.array(readinessCheckSchema).min(1).max(40),
  blockers: z.array(readinessBlockerSchema).max(40),
  nextGates: z.array(z.string().min(1)).max(12),
}).strict();

export type ReadinessCheck = z.infer<typeof readinessCheckSchema>;
export type ReadinessBlocker = z.infer<typeof readinessBlockerSchema>;
export type ReadinessReport = z.infer<typeof readinessReportSchema>;
export const ReadinessCheckSchema = readinessCheckSchema;
export const ReadinessBlockerSchema = readinessBlockerSchema;
export const ReadinessReportSchema = readinessReportSchema;

export interface ReadinessReportInput {
  readonly profile: RuntimeProfile;
  readonly runtimeFingerprint: RuntimeFingerprint;
  readonly probeReceipt: RuntimeProbeReceipt;
  readonly activeGm: ActiveGmEvidence;
  readonly managedJournalSnapshot: ManagedJournalSnapshot;
  readonly journalApi: JournalApiEvidence;
  readonly activityApi: ActivityApiEvidence;
  readonly activeEffectApi: ActiveEffectApiEvidence;
  readonly regionBehaviorApi: RegionBehaviorApiEvidence;
  readonly optionalModuleApi: OptionalModuleApiEvidence;
}

function surfaceStatus(status: "observed" | "partial" | "unavailable"): ReadinessCheck["status"] {
  return status === "observed" ? "pass" : status === "partial" ? "unknown" : "blocked";
}

function check(
  id: string,
  title: string,
  foundryApi: string,
  status: ReadinessCheck["status"],
  reason: string,
): ReadinessCheck {
  return { id, title, status, required: true, foundryApi, reason };
}

export function createReadinessReport(input: ReadinessReportInput): ReadinessReport {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const fingerprint = input.runtimeFingerprint;
  const probeReceipt = input.probeReceipt;
  const checks: ReadinessCheck[] = [
    check(
      "foundry-target-fingerprint",
      "Exact Foundry and D&D5e target fingerprint",
      "game.version + game.system.id + game.system.version",
      fingerprint.exactTargetMatch ? "pass" : "blocked",
      fingerprint.exactTargetMatch
        ? "The observed profile matches Foundry 14.367 and D&D5e 5.3.3."
        : "The exact Foundry 14.367 / D&D5e 5.3.3 target was not observed; runtime promotion is blocked.",
    ),
    check(
      "probe-no-write",
      "Read-only ready-lifecycle probe",
      "Hooks.once(\"ready\") + read-only runtime registries",
      probeReceipt.noWrite ? "pass" : "blocked",
      probeReceipt.noWrite
        ? "The runtime probe records metadata and registries without mutation."
        : "The probe receipt does not prove a no-write boundary.",
    ),
    check(
      "active-gm-observation",
      "Active GM observation",
      "game.users.activeGM / game.users.getDesignatedUser",
      input.activeGm.status === "observed" ? "pass" : input.activeGm.status === "unknown" ? "unknown" : "blocked",
      input.activeGm.status === "observed"
        ? "An active-GM observation exists; execution authority still requires an immediate reread."
        : "Active-GM identity/election is not sufficiently observed for an execution boundary.",
    ),
    check(
      "journal-api-surface",
      "Managed JournalEntry API surface",
      "JournalEntry.create / fromUuid / game.journal.get / JournalEntry.update / createEmbeddedDocuments(\"JournalEntryPage\")",
      surfaceStatus(input.journalApi.status),
      input.journalApi.status === "observed"
        ? "The named JournalEntry surfaces and page schema were observed; behavior and permission still require exact-runtime proof."
        : "The JournalEntry surface or page schema is incomplete.",
    ),
    check(
      "managed-journal-readback",
      "Managed JournalEntry authoritative read-back",
      "fromUuid / game.journal.get / game.journal.contents",
      input.managedJournalSnapshot.status === "observed" ? "pass" : "unknown",
      input.managedJournalSnapshot.status === "observed"
        ? "Owned JournalEntry observations are available; a live create/update/read-back proof is still required."
        : "A managed JournalEntry collection snapshot was not observed.",
    ),
    check(
      "activity-api-surface",
      "D&D5e Activity API surface",
      "fromUuid / game.items.get / Item5e.getEmbeddedDocument(\"Activity\") / dnd5e.dataModels.fields.ActivityCollection / activity.use / dnd5e.preUseActivity / dnd5e.postUseActivity",
      surfaceStatus(input.activityApi.status),
      input.activityApi.status === "observed"
        ? "Activity surfaces were observed without invocation; hook behavior, permission, and use outcomes remain unproven."
        : "The D&D5e Activity surface is incomplete.",
    ),
    check(
      "active-effect-api-surface",
      "Native ActiveEffect API surface",
      "parent.getEmbeddedCollection(\"ActiveEffect\") / parent.getEmbeddedDocument(\"ActiveEffect\")",
      surfaceStatus(input.activeEffectApi.status),
      input.activeEffectApi.status === "observed"
        ? "Native ActiveEffect surfaces were observed without invocation; schema, permission, and read-back remain unproven."
        : "The native ActiveEffect surface is incomplete.",
    ),
    check(
      "region-behavior-api-surface",
      "RegionBehavior API and registry surface",
      "region.getEmbeddedCollection(\"RegionBehavior\") / RegionBehavior.schema.fields / CONFIG.RegionBehavior.dataModels / RegionBehaviorType.events",
      surfaceStatus(input.regionBehaviorApi.status),
      input.regionBehaviorApi.status === "observed"
        ? "RegionBehavior surfaces were observed without invocation; subtype schema, event behavior, permission, and read-back remain unproven."
        : "The RegionBehavior surface or registry is incomplete.",
    ),
    check(
      "optional-module-boundary",
      "Optional-module ownership boundary",
      "game.modules.get(\"midi-qol\") / game.modules.get(\"dae\") / MidiQOL documented methods",
      input.optionalModuleApi.status !== "observed"
        ? surfaceStatus(input.optionalModuleApi.status)
        : input.optionalModuleApi.midiQol.active === true || input.optionalModuleApi.dae.active === true
          ? "unknown"
          : "pass",
      input.optionalModuleApi.midiQol.active === true || input.optionalModuleApi.dae.active === true
        ? "Optional modules are active; exact behavior, ownership, authority, and read-back adapters are required."
        : "Optional-module presence is bounded to evidence and does not displace native mechanic ownership.",
    ),
    check(
      "native-mutation-disabled",
      "Mutation remains disabled until exact gates pass",
      "Foundry Document factory/update/delete APIs behind exact-version adapters",
      "pass",
      "The current module and program bridge expose no executable world mutation path.",
    ),
    check(
      "exact-runtime-behavior",
      "Exact-runtime behavior and permission proof",
      "Foundry document lifecycle, User permissions, Hooks, and authoritative reread APIs",
      "blocked",
      "Static API presence and deterministic fixtures do not certify live behavior, permissions, sender semantics, or read-back.",
    ),
  ];
  const blockers = checks
    .filter((entry) => entry.status !== "pass")
    .map((entry) => ({
      checkId: entry.id,
      title: entry.title,
      foundryApi: entry.foundryApi,
      reason: entry.reason,
    }));
  const summary = {
    pass: checks.filter((entry) => entry.status === "pass").length,
    blocked: checks.filter((entry) => entry.status === "blocked").length,
    unknown: checks.filter((entry) => entry.status === "unknown").length,
    total: checks.length,
  };
  const nextGates = [
    "Run the installed diagnostics queries in the exact Foundry 14.367 / D&D5e 5.3.3 disposable world.",
    "Prove active-GM election, sender semantics, and immediate authority reread with GM and player clients.",
    "Exercise each selected native Foundry/D&D5e operation through its exact adapter and verify authoritative read-back.",
    "Bind optional Midi-QOL/DAE adapters only after behavior, ownership, permissions, hooks, and recovery are proven.",
  ];
  return readinessReportSchema.parse({
    schemaVersion: "0.1.0",
    reportId: createStableDiceBoxId("readiness", `${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}-${profile.phase}`),
    status: blockers.length === 0 ? "ready" : "blocked",
    evidenceClass: profile.phase === "m0" ? "static" : "deterministic",
    source: probeReceipt.source,
    noWrite: true,
    observedAt: profile.observedAt,
    target: {
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      exactTargetMatch: fingerprint.exactTargetMatch,
    },
    summary,
    checks,
    blockers,
    nextGates,
  });
}
