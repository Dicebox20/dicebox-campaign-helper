import { z } from "zod";
import { RuntimeProfileSchema, type RuntimeProfile } from "./capability.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { EvidenceReceiptSchema, type EvidenceReceipt } from "./receipt.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

const certificateLaneIds = [
  "contract",
  "static",
  "deterministic",
  "isolated-browser",
  "visible-browser",
  "exact-runtime",
] as const;

const certificateLaneSources = [
  "contract",
  "static-tooling",
  "deterministic-fixture",
  "utility-harness",
  "visible-chrome",
  "foundry-exact",
] as const;

const certificateLaneSchema = z.object({
  id: z.enum(certificateLaneIds),
  title: z.string().min(1),
  status: z.enum(["pass", "blocked", "unknown"]),
  source: z.enum(certificateLaneSources),
  evidenceClass: z.enum(["static", "deterministic", "full_function", "blocked"]),
  foundryApi: z.string().min(1),
  receiptIds: z.array(StableDiceBoxIdSchema).max(20),
  reason: z.string().min(1),
}).strict();

export type CertificateLane = z.infer<typeof certificateLaneSchema>;
export const CertificateLaneSchema = certificateLaneSchema;

const certificateBlockerSchema = z.object({
  laneId: z.enum(certificateLaneIds),
  title: z.string().min(1),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export type CertificateBlocker = z.infer<typeof certificateBlockerSchema>;
export const CertificateBlockerSchema = certificateBlockerSchema;

export const readinessCertificateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  certificateId: StableDiceBoxIdSchema,
  status: z.enum(["blocked", "ready"]),
  evidenceClass: z.enum(["deterministic", "full_function"]),
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
    total: z.literal(certificateLaneIds.length),
  }).strict(),
  lanes: z.array(certificateLaneSchema).length(certificateLaneIds.length),
  blockers: z.array(certificateBlockerSchema).max(20),
  nextGates: z.array(z.string().min(1)).max(12),
}).strict();

export type ReadinessCertificate = z.infer<typeof readinessCertificateSchema>;
export const ReadinessCertificateSchema = readinessCertificateSchema;

export interface ReadinessCertificateInput {
  readonly profile: RuntimeProfile;
  readonly lanes: readonly unknown[];
  readonly observedAt?: string | null;
}

const laneApiDefaults: Readonly<Record<(typeof certificateLaneIds)[number], string>> = {
  contract: "No runtime call; DiceBox ownership and safety contracts",
  static: "Foundry module.json + ES module syntax boundary",
  deterministic: "Versioned Foundry adapters, receipts, and read-back contracts",
  "isolated-browser": "Foundry client DOM/canvas plus module diagnostics surface",
  "visible-browser": "Foundry client, Hooks, game.users, document collections, and console evidence",
  "exact-runtime": "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread",
};

function laneFor(input: unknown): CertificateLane {
  const lane = certificateLaneSchema.parse(input);
  if (lane.foundryApi !== laneApiDefaults[lane.id]) {
    throw new Error(`Certificate lane ${lane.id} must name its reviewed Foundry API boundary.`);
  }
  return lane;
}

function blocker(lane: CertificateLane): CertificateBlocker {
  return {
    laneId: lane.id,
    title: lane.title,
    foundryApi: lane.foundryApi,
    reason: lane.reason,
  };
}

function createCertificateReceipt(certificate: ReadinessCertificate): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${certificate.certificateId.split(":").at(-1) ?? "readiness"}-compose`),
    operation: "readiness-certificate.compose",
    status: "observed",
    evidenceClass: certificate.evidenceClass,
    authority: "none",
    semanticRefs: [],
    observedAt: certificate.observedAt ?? new Date(0).toISOString(),
    notes: [
      "Certificate composition is read-only and does not certify a Foundry world by itself.",
      certificate.status === "ready"
        ? "All required evidence lanes passed under the exact target fingerprint; preserve the lane receipts for release review."
        : "The certificate remains blocked until every required evidence lane and exact-runtime gate passes.",
    ],
  });
}

export interface ReadinessCertificateResult {
  readonly certificate: ReadinessCertificate;
  readonly receipt: EvidenceReceipt;
}

export function createReadinessCertificate(input: ReadinessCertificateInput): ReadinessCertificateResult {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const suppliedLanes = input.lanes.map(laneFor);
  const byId = new Map<string, CertificateLane>();
  for (const lane of suppliedLanes) {
    if (byId.has(lane.id)) throw new Error(`Duplicate certificate lane ${lane.id}.`);
    byId.set(lane.id, lane);
  }
  const lanes = certificateLaneIds.map((id) => byId.get(id) ?? laneFor({
    id,
    title: `${id} evidence lane`,
    status: "unknown",
    source: id === "contract" ? "contract" : id === "static" ? "static-tooling" : id === "deterministic" ? "deterministic-fixture" : id === "isolated-browser" ? "utility-harness" : id === "visible-browser" ? "visible-chrome" : "foundry-exact",
    evidenceClass: "blocked",
    foundryApi: laneApiDefaults[id],
    receiptIds: [],
    reason: "Required evidence lane was not supplied.",
  })) as CertificateLane[];
  const exactTargetMatch = profile.phase === "ready"
    && profile.foundryVersion === TARGET_FOUNDRY_VERSION
    && profile.systemId === "dnd5e"
    && profile.systemVersion === TARGET_DND5E_VERSION;
  const blockers = lanes.filter((lane) => lane.status !== "pass").map(blocker);
  if (!exactTargetMatch) {
    blockers.push({
      laneId: "exact-runtime",
      title: "Exact target fingerprint",
      foundryApi: laneApiDefaults["exact-runtime"],
      reason: `Expected Foundry ${TARGET_FOUNDRY_VERSION} / D&D5e ${TARGET_DND5E_VERSION} at ready; the supplied runtime profile does not match.`,
    });
  }
  const exactLane = lanes.find((lane) => lane.id === "exact-runtime");
  if (!exactLane || exactLane.status !== "pass" || exactLane.source !== "foundry-exact" || exactLane.evidenceClass !== "full_function") {
    blockers.push({
      laneId: "exact-runtime",
      title: "Exact runtime behavior and authority evidence",
      foundryApi: laneApiDefaults["exact-runtime"],
      reason: "Ready-to-Play requires exact Foundry behavior, permissions, cross-client authority, recovery, and authoritative reread evidence; static/API evidence is insufficient.",
    });
  }
  const uniqueBlockers = [...new Map(blockers.map((entry) => [`${entry.laneId}:${entry.title}`, entry])).values()];
  const summary = {
    pass: lanes.filter((lane) => lane.status === "pass").length,
    blocked: lanes.filter((lane) => lane.status === "blocked").length,
    unknown: lanes.filter((lane) => lane.status === "unknown").length,
    total: certificateLaneIds.length,
  };
  const status = uniqueBlockers.length === 0 ? "ready" : "blocked";
  const certificate = readinessCertificateSchema.parse({
    schemaVersion: "0.1.0",
    certificateId: createStableDiceBoxId("certificate", `${profile.phase}-${profile.observedAt?.replaceAll(/[^0-9a-z]/gi, "").toLowerCase() ?? "unobserved"}`),
    status,
    evidenceClass: status === "ready" ? "full_function" : "deterministic",
    noWrite: true,
    observedAt: input.observedAt ?? profile.observedAt,
    target: {
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      exactTargetMatch,
    },
    summary,
    lanes,
    blockers: uniqueBlockers,
    nextGates: [
      "Complete the exact Foundry 14.367 / D&D5e 5.3.3 runtime lane with a frozen fingerprint.",
      "Prove GM/player authority, permission, update-hook, native operation, authoritative reread, timeout recovery, and foreign-state preservation.",
      "Retain Utility Harness and visible Chrome traces/screenshots plus exact-world receipts alongside the certificate.",
    ],
  });
  return { certificate, receipt: createCertificateReceipt(certificate) };
}
