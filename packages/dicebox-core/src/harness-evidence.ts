import { z } from "zod";
import {
  RuntimeProfileSchema,
  type RuntimeProfile,
} from "./capability.js";
import { createRuntimeFingerprint } from "./runtime-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import {
  createReadinessCertificate,
  ReadinessCertificateSchema,
  type ReadinessCertificate,
  type ReadinessCertificateResult,
} from "./certificate.js";
import { EvidenceReceiptSchema, type EvidenceReceipt } from "./receipt.js";

const harnessLaneIds = ["isolated-browser", "visible-browser", "exact-runtime"] as const;
const harnessContexts = ["GM", "Player3"] as const;
const artifactKinds = ["html-report", "trace", "screenshot", "video", "redacted-json", "console", "runtime-receipt"] as const;
const laneSources = {
  "isolated-browser": "utility-harness",
  "visible-browser": "visible-chrome",
  "exact-runtime": "foundry-exact",
} as const;
const laneApis = {
  "isolated-browser": "Foundry client DOM/canvas plus module diagnostics surface",
  "visible-browser": "Foundry client, Hooks, game.users, document collections, and console evidence",
  "exact-runtime": "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread",
} as const;
const checkApis: Readonly<Record<string, string>> = {
  "ready-lifecycle": "Hooks.once(\"ready\")",
  "target-fingerprint": "game.version + game.system.id + game.system.version",
  authority: "game.users.activeGM / User permissions",
  "native-operation": "native Foundry Document/embedded-document APIs",
  "authoritative-reread": "fromUuid / document collections / embedded-document getters",
  recovery: "transaction journal + authoritative reread",
  "cross-client": "User permissions + visible GM/Player3 clients",
};
const exactRequiredChecks = [
  "ready-lifecycle",
  "target-fingerprint",
  "authority",
  "native-operation",
  "authoritative-reread",
  "recovery",
  "cross-client",
] as const;

const artifactSchema = z.object({
  artifactId: StableDiceBoxIdSchema,
  kind: z.enum(artifactKinds),
  sha256: z.string().regex(/^[0-9a-f]{64}$/),
  label: z.string().min(1).max(120),
}).strict();

const harnessCheckSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  status: z.enum(["pass", "blocked", "unknown"]),
  foundryApi: z.string().min(1),
  reason: z.string().min(1),
}).strict();

const harnessLaneReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  laneId: z.enum(harnessLaneIds),
  status: z.enum(["pass", "blocked", "unknown"]),
  evidenceClass: z.enum(["deterministic", "full_function", "blocked"]),
  scope: z.enum(["read-only", "disposable-fixture"]),
  foundryApi: z.string().min(1),
  target: z.object({
    fingerprintId: StableDiceBoxIdSchema,
    foundryVersion: z.string().min(1).nullable(),
    systemId: z.string().min(1).nullable(),
    systemVersion: z.string().min(1).nullable(),
  }).strict(),
  contexts: z.array(z.enum(harnessContexts)).max(2),
  artifacts: z.array(artifactSchema).max(20),
  checks: z.array(harnessCheckSchema).max(20),
  noRawData: z.literal(true),
  observedAt: z.string().datetime({ offset: true }),
}).strict();

export type HarnessArtifact = z.infer<typeof artifactSchema>;
export const HarnessArtifactSchema = artifactSchema;
export type HarnessCheck = z.infer<typeof harnessCheckSchema>;
export const HarnessCheckSchema = harnessCheckSchema;
export type HarnessLaneReceipt = z.infer<typeof harnessLaneReceiptSchema>;
export const HarnessLaneReceiptSchema = harnessLaneReceiptSchema;

const harnessEvidenceBundleSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  bundleId: StableDiceBoxIdSchema,
  status: z.enum(["blocked", "ready"]),
  evidenceClass: z.enum(["deterministic", "full_function"]),
  noWrite: z.literal(true),
  targetFingerprintId: StableDiceBoxIdSchema,
  observedAt: z.string().datetime({ offset: true }).nullable(),
  receipts: z.array(harnessLaneReceiptSchema).max(harnessLaneIds.length),
  certificate: ReadinessCertificateSchema,
}).strict();

export type HarnessEvidenceBundle = z.infer<typeof harnessEvidenceBundleSchema>;
export const HarnessEvidenceBundleSchema = harnessEvidenceBundleSchema;

export interface HarnessEvidenceInput {
  readonly profile: RuntimeProfile;
  readonly receipts: readonly unknown[];
}

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${label} is not permitted.`);
}

function assertReceiptAgainstProfile(receipt: HarnessLaneReceipt, profile: RuntimeProfile): void {
  const fingerprint = createRuntimeFingerprint(profile);
  if (receipt.target.fingerprintId !== fingerprint.fingerprintId) {
    throw new Error(`Harness ${receipt.laneId} receipt fingerprint does not match the supplied runtime profile.`);
  }
  if (receipt.target.foundryVersion !== profile.foundryVersion
    || receipt.target.systemId !== profile.systemId
    || receipt.target.systemVersion !== profile.systemVersion) {
    throw new Error(`Harness ${receipt.laneId} receipt target metadata does not match the supplied runtime profile.`);
  }
  if (receipt.foundryApi !== laneApis[receipt.laneId]) {
    throw new Error(`Harness ${receipt.laneId} receipt must name its reviewed Foundry API boundary.`);
  }
  assertUnique(receipt.contexts, `${receipt.laneId} context`);
  assertUnique(receipt.artifacts.map((artifact) => artifact.artifactId), `${receipt.laneId} artifact ID`);
  assertUnique(receipt.checks.map((check) => check.id), `${receipt.laneId} check ID`);
  for (const check of receipt.checks) {
    const expectedApi = checkApis[check.id];
    if (expectedApi && check.foundryApi !== expectedApi) {
      throw new Error(`Harness check ${check.id} must name its reviewed Foundry API boundary.`);
    }
  }
  if (receipt.status !== "pass") {
    if (receipt.evidenceClass !== "blocked") throw new Error(`Non-passing ${receipt.laneId} evidence must be classified as blocked.`);
    return;
  }

  const kinds = new Set(receipt.artifacts.map((artifact) => artifact.kind));
  if (receipt.laneId === "isolated-browser" && (!kinds.has("html-report") || !kinds.has("redacted-json"))) {
    throw new Error("A passing Utility Harness receipt requires an HTML report and redacted JSON receipt.");
  }
  if (receipt.laneId === "visible-browser"
    && (!kinds.has("screenshot") || !kinds.has("redacted-json")
      || !receipt.contexts.includes("GM") || !receipt.contexts.includes("Player3"))) {
    throw new Error("A passing visible Chrome receipt requires screenshot/redacted evidence and GM/Player3 contexts.");
  }
  if (receipt.laneId === "exact-runtime") {
    if (receipt.evidenceClass !== "full_function" || receipt.scope !== "disposable-fixture") {
      throw new Error("A passing exact-runtime receipt requires full-function disposable-fixture evidence.");
    }
    if (!receipt.contexts.includes("GM") || !receipt.contexts.includes("Player3")) {
      throw new Error("A passing exact-runtime receipt requires both GM and Player3 contexts.");
    }
    if (!kinds.has("runtime-receipt") || !kinds.has("redacted-json")) {
      throw new Error("A passing exact-runtime receipt requires runtime and redacted JSON receipts.");
    }
    const checks = new Map(receipt.checks.map((check) => [check.id, check]));
    for (const checkId of exactRequiredChecks) {
      if (checks.get(checkId)?.status !== "pass") {
        throw new Error(`A passing exact-runtime receipt requires passing ${checkId} evidence.`);
      }
    }
  }
}

function laneFromReceipt(receipt: HarnessLaneReceipt): {
  readonly id: typeof harnessLaneIds[number];
  readonly title: string;
  readonly status: HarnessLaneReceipt["status"];
  readonly source: typeof laneSources[typeof receipt.laneId];
  readonly evidenceClass: HarnessLaneReceipt["evidenceClass"];
  readonly foundryApi: string;
  readonly receiptIds: readonly string[];
  readonly reason: string;
} {
  return {
    id: receipt.laneId,
    title: receipt.laneId === "isolated-browser" ? "Utility Harness lane" : receipt.laneId === "visible-browser" ? "Visible Chrome lane" : "Exact Foundry lane",
    status: receipt.status,
    source: laneSources[receipt.laneId],
    evidenceClass: receipt.evidenceClass,
    foundryApi: laneApis[receipt.laneId],
    receiptIds: [receipt.receiptId],
    reason: receipt.checks.map((check) => check.reason).join(" ") || `Harness lane reported ${receipt.status}.`,
  };
}

function baselineLanes() {
  return [
    { id: "contract", title: "Contract evidence lane", status: "pass", source: "contract", evidenceClass: "static", foundryApi: "No runtime call; DiceBox ownership and safety contracts", receiptIds: [], reason: "DiceBox ownership and safety contracts are loaded." },
    { id: "static", title: "Static package lane", status: "pass", source: "static-tooling", evidenceClass: "static", foundryApi: "Foundry module.json + ES module syntax boundary", receiptIds: [], reason: "The reviewed Foundry package boundary is present." },
    { id: "deterministic", title: "Deterministic fixture lane", status: "pass", source: "deterministic-fixture", evidenceClass: "deterministic", foundryApi: "Versioned Foundry adapters, receipts, and read-back contracts", receiptIds: [], reason: "Versioned adapter and receipt contracts are available." },
  ] as const;
}

function createBundleReceipt(bundle: HarnessEvidenceBundle): EvidenceReceipt {
  return EvidenceReceiptSchema.parse({
    receiptId: createStableDiceBoxId("receipt", `${bundle.bundleId.split(":").at(-1) ?? "harness"}-compose`),
    operation: "harness-evidence.bundle",
    status: "observed",
    evidenceClass: bundle.evidenceClass,
    authority: "none",
    semanticRefs: [],
    observedAt: bundle.observedAt ?? new Date(0).toISOString(),
    notes: [
      "Harness evidence is validated and composed without invoking Foundry operations.",
      "A passing browser or exact-runtime receipt remains evidence for its declared scope only.",
    ],
  });
}

export interface HarnessEvidenceBundleResult {
  readonly bundle: HarnessEvidenceBundle;
  readonly certificateReceipt: EvidenceReceipt;
  readonly bundleReceipt: EvidenceReceipt;
}

export function createHarnessEvidenceBundle(input: HarnessEvidenceInput): HarnessEvidenceBundleResult {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const receipts = input.receipts.map((receipt) => harnessLaneReceiptSchema.parse(receipt));
  assertUnique(receipts.map((receipt) => receipt.receiptId), "harness receipt ID");
  assertUnique(receipts.map((receipt) => receipt.laneId), "harness lane");
  receipts.forEach((receipt) => assertReceiptAgainstProfile(receipt, profile));
  const fingerprint = createRuntimeFingerprint(profile);
  const lanes = [
    ...baselineLanes(),
    ...harnessLaneIds.map((laneId) => {
      const receipt = receipts.find((candidate) => candidate.laneId === laneId);
      return receipt ? laneFromReceipt(receipt) : undefined;
    }).filter((lane): lane is ReturnType<typeof laneFromReceipt> => Boolean(lane)),
  ];
  const certificateResult: ReadinessCertificateResult = createReadinessCertificate({
    profile,
    lanes,
    observedAt: profile.observedAt,
  });
  const bundle = harnessEvidenceBundleSchema.parse({
    schemaVersion: "0.1.0",
    bundleId: createStableDiceBoxId("bundle", `${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}-harness`),
    status: certificateResult.certificate.status,
    evidenceClass: certificateResult.certificate.evidenceClass,
    noWrite: true,
    targetFingerprintId: fingerprint.fingerprintId,
    observedAt: profile.observedAt,
    receipts,
    certificate: certificateResult.certificate,
  });
  return {
    bundle,
    certificateReceipt: certificateResult.receipt,
    bundleReceipt: createBundleReceipt(bundle),
  };
}
