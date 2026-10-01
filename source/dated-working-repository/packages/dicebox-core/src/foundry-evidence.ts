import { z } from "zod";
import { RuntimeProfileSchema } from "./capability.js";
import {
  ActiveEffectApiEvidenceSchema,
  ActiveGmEvidenceSchema,
  ActivityApiEvidenceSchema,
  JournalApiEvidenceSchema,
  ManagedJournalSnapshotSchema,
  OptionalModuleApiEvidenceSchema,
  RegionBehaviorApiEvidenceSchema,
  RuntimeFingerprintSchema,
  RuntimeProbeReceiptSchema,
} from "./runtime-evidence.js";
import { StateStoreSelectionPlanSchema } from "./state-store.js";
import { ReadinessReportSchema } from "./readiness.js";
import { ReadinessCertificateSchema } from "./certificate.js";
import { EvidenceReceiptSchema } from "./receipt.js";
import { createRuntimeFingerprint } from "./runtime-evidence.js";
import { createStableDiceBoxId } from "./identity.js";

const readinessCertificateResultSchema = z.object({
  certificate: ReadinessCertificateSchema,
  receipt: EvidenceReceiptSchema,
}).strict();

/**
 * Canonical wire shape for the installed Foundry module's read-only
 * `runtime-evidence` query. Keeping this shape in core prevents the module,
 * program bridge, and harness from silently assigning different meanings to
 * the runtime profile or its receipts.
 */
export const FoundryRuntimeEvidenceSchema = z.object({
  profile: RuntimeProfileSchema,
  runtimeFingerprint: RuntimeFingerprintSchema,
  probeReceipt: RuntimeProbeReceiptSchema,
  activeGm: ActiveGmEvidenceSchema,
  managedJournalSnapshot: ManagedJournalSnapshotSchema,
  journalApi: JournalApiEvidenceSchema,
  activityApi: ActivityApiEvidenceSchema,
  activeEffectApi: ActiveEffectApiEvidenceSchema,
  regionBehaviorApi: RegionBehaviorApiEvidenceSchema,
  optionalModuleApi: OptionalModuleApiEvidenceSchema,
  stateStorePlan: StateStoreSelectionPlanSchema,
  readinessReport: ReadinessReportSchema,
  readinessCertificate: readinessCertificateResultSchema,
}).strict();

export type FoundryRuntimeEvidence = z.infer<typeof FoundryRuntimeEvidenceSchema>;

const reviewedApiTokens = [
  "Hooks.once(\"ready\")",
  "game.version",
  "game.system",
  "game.users.activeGM",
  "fromUuid",
  "game.journal.get",
  "Document",
  "authoritative reread",
] as const;

const auditBlockerSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

const foundryRuntimeEvidenceAuditSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("foundry.runtime-evidence.audit"),
  status: z.enum(["reviewable", "blocked"]),
  evidenceClass: z.literal("deterministic"),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
  inputReadinessStatus: z.enum(["blocked", "ready"]),
  targetFingerprintId: z.string().min(1),
  exactTargetMatch: z.boolean(),
  foundryApiEvidence: z.literal("structured-only"),
  blockers: z.array(auditBlockerSchema).max(40),
  notes: z.array(z.string().min(1)).max(12),
}).strict();

export type FoundryRuntimeEvidenceAudit = z.infer<typeof foundryRuntimeEvidenceAuditSchema>;
export const FoundryRuntimeEvidenceAuditSchema = foundryRuntimeEvidenceAuditSchema;

export function createBlockedFoundryRuntimeEvidenceAudit(reason: string): FoundryRuntimeEvidenceAudit {
  return foundryRuntimeEvidenceAuditSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.runtime-evidence.audit",
    status: "blocked",
    evidenceClass: "deterministic",
    noWrite: true,
    readyClaim: false,
    inputReadinessStatus: "blocked",
    targetFingerprintId: createStableDiceBoxId("fingerprint", "unknown"),
    exactTargetMatch: false,
    foundryApiEvidence: "structured-only",
    blockers: [{
      id: "invalid-evidence",
      foundryApi: "Hooks.once(\"ready\") + game.version + game.system + native Document APIs",
      reason,
    }],
    notes: [
      "The evidence payload was rejected before any runtime claim could be composed.",
      "readyClaim is permanently false; exact-runtime receipts remain a separate evidence gate.",
    ],
  });
}

function apiText(evidence: FoundryRuntimeEvidence): string {
  return [
    ...evidence.readinessReport.checks.map((check) => check.foundryApi),
    ...evidence.readinessCertificate.certificate.lanes.map((lane) => lane.foundryApi),
  ].join(" | ");
}

function uniqueBlockers(blockers: readonly z.infer<typeof auditBlockerSchema>[]) {
  return [...new Map(blockers.map((blocker) => [`${blocker.id}:${blocker.reason}`, blocker])).values()];
}

/**
 * Validate a runtime-evidence payload without promoting it to live
 * certification. The returned audit can be attached to a test receipt, but
 * `readyClaim` is permanently false and API presence is only structured
 * evidence until the exact Foundry lane supplies its own receipt.
 */
export function auditFoundryRuntimeEvidence(input: unknown): FoundryRuntimeEvidenceAudit {
  const evidence = FoundryRuntimeEvidenceSchema.parse(input);
  const fingerprint = createRuntimeFingerprint(evidence.profile);
  const blockers: z.infer<typeof auditBlockerSchema>[] = [];
  if (evidence.runtimeFingerprint.fingerprintId !== fingerprint.fingerprintId) {
    blockers.push({
      id: "fingerprint-integrity",
      foundryApi: "game.version + game.system.id + game.system.version",
      reason: "The runtime fingerprint does not match the canonical fingerprint of the supplied profile.",
    });
  }
  if (evidence.probeReceipt.fingerprintId !== evidence.runtimeFingerprint.fingerprintId) {
    blockers.push({
      id: "probe-fingerprint-binding",
      foundryApi: "Hooks.once(\"ready\") + read-only runtime registries",
      reason: "The runtime probe receipt is not bound to the supplied runtime fingerprint.",
    });
  }
  const target = evidence.runtimeFingerprint;
  const reportTarget = evidence.readinessReport.target;
  const certificateTarget = evidence.readinessCertificate.certificate.target;
  for (const [field, expected, observed] of [
    ["foundryVersion", target.foundryVersion, reportTarget.foundryVersion],
    ["systemId", target.systemId, reportTarget.systemId],
    ["systemVersion", target.systemVersion, reportTarget.systemVersion],
    ["exactTargetMatch", target.exactTargetMatch, reportTarget.exactTargetMatch],
  ] as const) {
    if (expected !== observed) blockers.push({
      id: `report-target-${field.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
      foundryApi: "game.version + game.system.id + game.system.version",
      reason: `The readiness report target field ${field} does not match the runtime fingerprint.`,
    });
  }
  if (certificateTarget.foundryVersion !== target.foundryVersion
    || certificateTarget.systemId !== target.systemId
    || certificateTarget.systemVersion !== target.systemVersion
    || certificateTarget.exactTargetMatch !== target.exactTargetMatch) {
    blockers.push({
      id: "certificate-target-binding",
      foundryApi: "Hooks.once(\"ready\") + game.version + game.system",
      reason: "The readiness certificate target does not match the runtime fingerprint.",
    });
  }
  const surfaceText = apiText(evidence);
  for (const token of reviewedApiTokens) {
    if (!surfaceText.includes(token)) blockers.push({
      id: `missing-api-${token.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, "")}`,
      foundryApi: token,
      reason: "The structured evidence does not name the required reviewed Foundry API boundary.",
    });
  }
  const finalBlockers = uniqueBlockers(blockers);
  return foundryRuntimeEvidenceAuditSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.runtime-evidence.audit",
    status: finalBlockers.length === 0 ? "reviewable" : "blocked",
    evidenceClass: "deterministic",
    noWrite: true,
    readyClaim: false,
    inputReadinessStatus: evidence.readinessReport.status,
    targetFingerprintId: evidence.runtimeFingerprint.fingerprintId,
    exactTargetMatch: evidence.runtimeFingerprint.exactTargetMatch,
    foundryApiEvidence: "structured-only",
    blockers: finalBlockers,
    notes: [
      "This audit validates shape, fingerprint bindings, target consistency, and named Foundry API boundaries only.",
      "It cannot prove that a Foundry lifecycle, permission, authority, native operation, socket, or authoritative reread occurred.",
      "readyClaim is permanently false; exact-runtime receipts remain a separate evidence gate.",
    ],
  });
}
