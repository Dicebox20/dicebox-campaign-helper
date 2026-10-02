import { z } from "zod";
import {
  HarnessLaneReceiptSchema,
  type HarnessLaneReceipt,
} from "./harness-evidence.js";
import {
  FoundryFixtureObservationReceiptSchema,
  auditFoundryFixtureObservation,
  type FoundryFixtureObservationReceipt,
} from "./fixture-observation.js";
import {
  RuntimeProfileSchema,
  type RuntimeProfile,
} from "./capability.js";
import { createRuntimeFingerprint } from "./runtime-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

type HarnessReceiptTarget = HarnessLaneReceipt["target"];

const exactFoundryApi = "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread";
const exactCheckApis: Readonly<Record<string, string>> = {
  "ready-lifecycle": "Hooks.once(\"ready\")",
  "target-fingerprint": "game.version + game.system.id + game.system.version",
  authority: "game.users.activeGM / User permissions",
  "native-operation": "native Foundry Document/embedded-document APIs",
  "authoritative-reread": "fromUuid / document collections / embedded-document getters",
  recovery: "transaction journal + authoritative reread",
  "cross-client": "User permissions + visible GM/Player3 clients",
};
const exactCheckIds = Object.keys(exactCheckApis);

const bundleAuditSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("foundry.fixture.observation.bundle.audit"),
  status: z.enum(["reviewable", "blocked"]),
  evidenceClass: z.enum(["deterministic", "blocked"]),
  readyClaim: z.literal(false),
  noWrite: z.literal(true),
  noRawData: z.literal(true),
  targetFingerprintId: StableDiceBoxIdSchema,
  fixturePlanId: StableDiceBoxIdSchema,
  contexts: z.array(z.enum(["GM", "Player3"])).max(2),
  laneReceipt: HarnessLaneReceiptSchema,
  blockers: z.array(z.string().min(1).max(500)).max(20),
  notes: z.array(z.string().min(1).max(500)).max(12),
}).strict();

export type FoundryFixtureObservationBundleAudit = z.infer<typeof bundleAuditSchema>;
export const FoundryFixtureObservationBundleAuditSchema = bundleAuditSchema;

export interface FoundryFixtureObservationBundleInput {
  readonly profile: RuntimeProfile;
  readonly receipts: readonly unknown[];
}

export interface FoundryFixtureObservationBundleResult {
  readonly laneReceipt: HarnessLaneReceipt;
  readonly audit: FoundryFixtureObservationBundleAudit;
}

function check(id: string, status: "pass" | "blocked" | "unknown", reason: string) {
  return { id, status, foundryApi: exactCheckApis[id], reason };
}

function makeBlockedLaneReceipt(
  target: HarnessReceiptTarget,
  contexts: readonly ("GM" | "Player3")[],
  checks: readonly ReturnType<typeof check>[],
  observedAt: string,
): HarnessLaneReceipt {
  return HarnessLaneReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: createStableDiceBoxId("receipt", `fixture-observation-lane-${target.fingerprintId.split(":").at(-1) ?? "unknown"}`),
    laneId: "exact-runtime",
    status: "blocked",
    evidenceClass: "blocked",
    scope: "disposable-fixture",
    foundryApi: exactFoundryApi,
    target,
    contexts,
    artifacts: [],
    checks,
    noRawData: true,
    observedAt,
  });
}

function blockedFallback(reason: string): FoundryFixtureObservationBundleResult {
  const target = {
    fingerprintId: createStableDiceBoxId("fingerprint", "unknown"),
    foundryVersion: null,
    systemId: null,
    systemVersion: null,
  };
  const observedAt = new Date(0).toISOString();
  const checks = exactCheckIds.map((id) => check(id, "blocked", reason));
  const laneReceipt = makeBlockedLaneReceipt(target, [], checks, observedAt);
  return {
    laneReceipt,
    audit: bundleAuditSchema.parse({
      schemaVersion: "0.1.0",
      operation: "foundry.fixture.observation.bundle.audit",
      status: "blocked",
      evidenceClass: "blocked",
      readyClaim: false,
      noWrite: true,
      noRawData: true,
      targetFingerprintId: target.fingerprintId,
      fixturePlanId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
      contexts: [],
      laneReceipt,
      blockers: [reason.slice(0, 500)],
      notes: ["Malformed or incomplete fixture observations were discarded without echoing input or promoting the exact-runtime lane."],
    }),
  };
}

function allReceiptChecksPass(receipts: readonly FoundryFixtureObservationReceipt[], id: string): boolean {
  return receipts.length > 0 && receipts.every((receipt) => receipt.checks.some((entry) => entry.id === id && entry.status === "pass"));
}

/**
 * Normalize M22 read-only fixture receipts into the existing exact-runtime
 * harness lane. This adapter is deliberately unable to produce a passing
 * exact-runtime lane: M22 does not exercise native mutation, recovery, or
 * cross-client delivery, so the certificate remains blocked by construction.
 */
export function createFixtureObservationBundle(
  input: FoundryFixtureObservationBundleInput,
): FoundryFixtureObservationBundleResult {
  try {
    const profile = RuntimeProfileSchema.parse(input.profile);
    const receipts = input.receipts.map((receipt) => FoundryFixtureObservationReceiptSchema.parse(receipt));
    const fingerprint = createRuntimeFingerprint(profile);
    if (receipts.length < 1 || receipts.length > 2) return blockedFallback("Fixture observation bundle requires one GM or Player3 receipt per supplied context.");
    const contexts = receipts.map((receipt) => receipt.context);
    if (new Set(contexts).size !== contexts.length) return blockedFallback("Fixture observation bundle cannot contain duplicate client contexts.");
    const fixturePlanIds = new Set(receipts.map((receipt) => receipt.fixturePlanId));
    if (fixturePlanIds.size !== 1 || !fixturePlanIds.has(createStableDiceBoxId("plan", "foundry-fixture-m21"))) return blockedFallback("Fixture observations must share the exact M21 fixture-plan binding.");
    const blockers: string[] = [];
    for (const receipt of receipts) {
      const audit = auditFoundryFixtureObservation(receipt);
      if (audit.status !== "reviewable") blockers.push(...audit.blockers);
      if (receipt.runtimeFingerprint.fingerprintId !== fingerprint.fingerprintId) blockers.push("Fixture observation fingerprint does not match the supplied runtime profile.");
      if (receipt.target.foundryVersion !== profile.foundryVersion
        || receipt.target.systemId !== profile.systemId
        || receipt.target.systemVersion !== profile.systemVersion) blockers.push("Fixture observation target metadata does not match the supplied runtime profile.");
    }
    if (!fingerprint.exactTargetMatch) blockers.push("The supplied runtime profile is not the exact Foundry 14.367 / D&D5e 5.3.3 target.");

    const observedAt = receipts.map((receipt) => receipt.observedAt).sort().at(-1) ?? new Date(0).toISOString();
    const checks = [
      check("ready-lifecycle", allReceiptChecksPass(receipts, "ready-lifecycle") ? "pass" : "blocked", "M22 read-only receipts must establish the ready lifecycle before their observations are accepted."),
      check("target-fingerprint", allReceiptChecksPass(receipts, "target-fingerprint") ? "pass" : "blocked", "M22 receipts must bind to the exact Foundry and D&D5e target."),
      check("authority", allReceiptChecksPass(receipts, "active-gm") && receipts.every((receipt) => receipt.activeGm.status === "observed") ? "unknown" : "blocked", "Active-GM presence is observed, but sender authority and execution-time recheck remain unproven."),
      check("native-operation", "blocked", "M22 intentionally performs no native create/update/delete or Activity.use operation."),
      check("authoritative-reread", allReceiptChecksPass(receipts, "authoritative-reread") ? "pass" : "blocked", "Read-only fixture rereads are accepted only when every supplied receipt reports the reread check."),
      check("recovery", "blocked", "Timeout/unknown-outcome recovery and transaction-journal persistence are not exercised by M22."),
      check("cross-client", contexts.includes("GM") && contexts.includes("Player3") ? "blocked" : "unknown", "M22 contexts are observation labels; cross-client delivery and sender semantics require the visible two-client lane."),
    ];
    const laneReceipt = makeBlockedLaneReceipt({
      fingerprintId: fingerprint.fingerprintId,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
    }, contexts, checks, observedAt);
    const audit = bundleAuditSchema.parse({
      schemaVersion: "0.1.0",
      operation: "foundry.fixture.observation.bundle.audit",
      status: blockers.length === 0 ? "reviewable" : "blocked",
      evidenceClass: blockers.length === 0 ? "deterministic" : "blocked",
      readyClaim: false,
      noWrite: true,
      noRawData: true,
      targetFingerprintId: fingerprint.fingerprintId,
      fixturePlanId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
      contexts,
      laneReceipt,
      blockers: [...blockers, "Exact-runtime lane remains blocked until native operation, recovery, and cross-client evidence are separately captured."],
      notes: [
        "M22 fixture observations are normalized into the M14 harness shape without promoting them to a passing exact-runtime lane.",
        "The normalized receipt contains no raw runtime IDs, document content, Activity configuration, Region geometry, or provider payloads.",
      ],
    });
    return { laneReceipt, audit };
  } catch {
    return blockedFallback("Fixture observation bundle failed schema or target-binding validation.");
  }
}

export function createBlockedFixtureObservationBundle(reason: string): FoundryFixtureObservationBundleResult {
  return blockedFallback(reason);
}

export { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION };
