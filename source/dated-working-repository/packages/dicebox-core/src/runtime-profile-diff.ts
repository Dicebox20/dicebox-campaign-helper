import { z } from "zod";
import {
  CapabilitySupportSchema,
  RuntimeProfileSchema,
  type CapabilitySupport,
  type RuntimeProfile,
} from "./capability.js";
import {
  ActiveGmEvidenceSchema,
  RuntimeFingerprintSchema,
  createRuntimeFingerprint,
  type ActiveGmEvidence,
  type RuntimeFingerprint,
} from "./runtime-evidence.js";
import { DICEBOX_PACKAGE_ID } from "./version.js";
import { StableDiceBoxIdSchema, createStableDiceBoxId } from "./identity.js";

const sha256Pattern = /^[0-9a-f]{64}$/;
const runtimeArtifactSchema = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  sha256: z.string().regex(sha256Pattern),
}).strict();
const packageArtifactSchema = runtimeArtifactSchema.extend({ id: z.literal(DICEBOX_PACKAGE_ID) }).strict();
const activeGmExpectationSchema = z.object({
  status: ActiveGmEvidenceSchema.shape.status,
  source: ActiveGmEvidenceSchema.shape.source,
  isCurrentUser: z.boolean().nullable(),
}).strict();
const normalizedCapabilitySchema = z.object({
  id: CapabilitySupportSchema.shape.id,
  state: CapabilitySupportSchema.shape.state,
}).strict();

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedUniqueStrings(values: readonly string[], label: string): string[] {
  const normalized = [...values];
  if (new Set(normalized).size !== normalized.length) throw new Error(`${label} must contain unique values.`);
  return normalized.sort(compareStrings);
}

function normalizeCapabilities(values: readonly unknown[]): CapabilitySupport[] {
  const capabilities = values.map((value) => CapabilitySupportSchema.parse(value));
  if (new Set(capabilities.map((capability) => capability.id)).size !== capabilities.length) {
    throw new Error("RuntimeProfile capabilities must contain unique IDs.");
  }
  return capabilities.sort((left, right) => compareStrings(left.id, right.id));
}

function normalizeCapabilityStates(values: readonly unknown[]): Array<z.infer<typeof normalizedCapabilitySchema>> {
  const capabilities = values.map((value) => normalizedCapabilitySchema.parse(value));
  if (new Set(capabilities.map((capability) => capability.id)).size !== capabilities.length) {
    throw new Error("RuntimeProfile expectation capabilities must contain unique IDs.");
  }
  return capabilities.sort((left, right) => compareStrings(left.id, right.id));
}

function assertSortedUniqueStrings(values: readonly string[], label: string): void {
  if (!values.every((value, index) => index === 0 || compareStrings(values[index - 1]!, value) <= 0)) {
    throw new Error(`${label} must be sorted canonically.`);
  }
  if (new Set(values).size !== values.length) throw new Error(`${label} must contain unique values.`);
}

function assertSortedCapabilities(values: readonly { id: string }[], label: string): void {
  if (!values.every((value, index) => index === 0 || compareStrings(values[index - 1]!.id, value.id) <= 0)) {
    throw new Error(`${label} must be sorted canonically.`);
  }
  if (new Set(values.map((value) => value.id)).size !== values.length) throw new Error(`${label} must contain unique IDs.`);
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error("Cannot canonicalize an undefined runtime-profile value.");
    return encoded;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalize(entry)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

export const runtimeProfileScanInputSchema = z.object({
  phase: RuntimeProfileSchema.shape.phase,
  foundryVersion: RuntimeProfileSchema.shape.foundryVersion,
  systemId: RuntimeProfileSchema.shape.systemId,
  systemVersion: RuntimeProfileSchema.shape.systemVersion,
  observedAt: RuntimeProfileSchema.shape.observedAt,
  activeModuleIds: z.array(z.string()).max(1000),
  documentTypes: z.array(z.string()).max(500),
  capabilities: z.array(CapabilitySupportSchema).max(100),
  package: packageArtifactSchema,
  adapter: runtimeArtifactSchema,
  activeGm: ActiveGmEvidenceSchema,
}).strict();

export type RuntimeProfileScanInput = z.input<typeof runtimeProfileScanInputSchema>;

export const runtimeProfileScanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  scanId: StableDiceBoxIdSchema,
  source: z.literal("supplied-read-only-observation"),
  status: z.enum(["observed", "blocked"]),
  profile: RuntimeProfileSchema,
  runtimeFingerprint: RuntimeFingerprintSchema,
  package: packageArtifactSchema,
  adapter: runtimeArtifactSchema,
  activeGm: ActiveGmEvidenceSchema,
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
}).strict();

export type RuntimeProfileScan = z.infer<typeof runtimeProfileScanSchema>;

const runtimeProfileExpectationTargetSchema = z.object({
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  package: packageArtifactSchema,
  adapter: runtimeArtifactSchema,
  activeModuleIds: z.array(z.string()).max(1000),
  documentTypes: z.array(z.string()).max(500),
  activeGm: activeGmExpectationSchema,
  capabilities: z.array(normalizedCapabilitySchema).max(100),
}).strict();

export const runtimeProfileExpectationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  expectationId: StableDiceBoxIdSchema,
  target: runtimeProfileExpectationTargetSchema,
  noWrite: z.literal(true),
}).strict();

export type RuntimeProfileExpectation = z.infer<typeof runtimeProfileExpectationSchema>;

const profileDifferenceSchema = z.object({
  field: z.string().regex(/^[a-z][a-zA-Z0-9_.-]{1,127}$/),
  expectedValue: z.string().min(1),
  observedValue: z.string().min(1),
  reason: z.string().min(1),
}).strict();

export const runtimeProfileDiffSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  expectationId: StableDiceBoxIdSchema,
  scanId: StableDiceBoxIdSchema,
  observedFingerprintId: StableDiceBoxIdSchema,
  status: z.enum(["pass", "blocked"]),
  exactTargetMatch: z.boolean(),
  differences: z.array(profileDifferenceSchema).max(100),
  blockers: z.array(z.string().min(1)).max(100),
  promotion: z.enum(["eligible", "blocked"]),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
  preserveUnknown: z.literal(true),
}).strict();

export type RuntimeProfileDiff = z.infer<typeof runtimeProfileDiffSchema>;

export type CreateRuntimeProfileExpectationInput = {
  readonly expectationId: string;
  readonly target: {
    readonly foundryVersion: string;
    readonly systemId: string;
    readonly systemVersion: string;
    readonly package: { readonly id: string; readonly version: string; readonly sha256: string };
    readonly adapter: { readonly id: string; readonly version: string; readonly sha256: string };
    readonly activeModuleIds: readonly string[];
    readonly documentTypes: readonly string[];
    readonly activeGm: { readonly status: ActiveGmEvidence["status"]; readonly source: ActiveGmEvidence["source"]; readonly isCurrentUser: boolean | null };
    readonly capabilities: readonly { readonly id: CapabilitySupport["id"]; readonly state: CapabilitySupport["state"] }[];
  };
};

function normalizeProfile(input: RuntimeProfileScanInput): RuntimeProfile {
  return RuntimeProfileSchema.parse({
    phase: input.phase,
    foundryVersion: input.foundryVersion,
    systemId: input.systemId,
    systemVersion: input.systemVersion,
    observedAt: input.observedAt,
    activeModuleIds: sortedUniqueStrings(input.activeModuleIds, "RuntimeProfile active module IDs"),
    documentTypes: sortedUniqueStrings(input.documentTypes, "RuntimeProfile document types"),
    capabilities: normalizeCapabilities(input.capabilities),
  });
}

export function validateRuntimeProfileScan(input: unknown): RuntimeProfileScan {
  const scan = runtimeProfileScanSchema.parse(input);
  assertSortedUniqueStrings(scan.profile.activeModuleIds, "RuntimeProfile active module IDs");
  assertSortedUniqueStrings(scan.profile.documentTypes, "RuntimeProfile document types");
  assertSortedCapabilities(scan.profile.capabilities, "RuntimeProfile capabilities");
  const fingerprint = createRuntimeFingerprint(scan.profile);
  if (canonicalize(scan.runtimeFingerprint) !== canonicalize(fingerprint)) {
    throw new Error("RuntimeProfile scan fingerprint does not match the canonical supplied profile.");
  }
  return scan;
}

export function scanRuntimeProfile(input: unknown): RuntimeProfileScan {
  const parsed = runtimeProfileScanInputSchema.parse(input);
  const profile = normalizeProfile(parsed);
  const runtimeFingerprint = createRuntimeFingerprint(profile);
  return validateRuntimeProfileScan({
    schemaVersion: "0.1.0",
    scanId: createStableDiceBoxId("runtime-scan", runtimeFingerprint.fingerprintId.split(":").at(-1) ?? "unknown"),
    source: "supplied-read-only-observation",
    status: runtimeFingerprint.exactTargetMatch ? "observed" : "blocked",
    profile,
    runtimeFingerprint,
    package: packageArtifactSchema.parse(parsed.package),
    adapter: runtimeArtifactSchema.parse(parsed.adapter),
    activeGm: ActiveGmEvidenceSchema.parse(parsed.activeGm),
    noWrite: true,
    readyClaim: false,
  });
}

export function validateRuntimeProfileExpectation(input: unknown): RuntimeProfileExpectation {
  const expectation = runtimeProfileExpectationSchema.parse(input);
  assertSortedUniqueStrings(expectation.target.activeModuleIds, "RuntimeProfile expectation active module IDs");
  assertSortedUniqueStrings(expectation.target.documentTypes, "RuntimeProfile expectation document types");
  assertSortedCapabilities(expectation.target.capabilities, "RuntimeProfile expectation capabilities");
  return expectation;
}

export function createRuntimeProfileExpectation(input: CreateRuntimeProfileExpectationInput): RuntimeProfileExpectation {
  return validateRuntimeProfileExpectation({
    schemaVersion: "0.1.0",
    expectationId: StableDiceBoxIdSchema.parse(input.expectationId),
    target: {
      ...input.target,
      package: packageArtifactSchema.parse(input.target.package),
      adapter: runtimeArtifactSchema.parse(input.target.adapter),
      activeModuleIds: sortedUniqueStrings(input.target.activeModuleIds, "RuntimeProfile expectation active module IDs"),
      documentTypes: sortedUniqueStrings(input.target.documentTypes, "RuntimeProfile expectation document types"),
      activeGm: activeGmExpectationSchema.parse(input.target.activeGm),
      capabilities: normalizeCapabilityStates(input.target.capabilities),
    },
    noWrite: true,
  });
}

function valueFor(value: unknown): string {
  return canonicalize(value);
}

export function diffRuntimeProfile(expectationInput: unknown, scanInput: unknown): RuntimeProfileDiff {
  const expectation = validateRuntimeProfileExpectation(expectationInput);
  const scan = validateRuntimeProfileScan(scanInput);
  const differences: Array<z.infer<typeof profileDifferenceSchema>> = [];
  const compare = (field: string, expected: unknown, observed: unknown, reason: string) => {
    if (valueFor(expected) !== valueFor(observed)) differences.push({ field, expectedValue: valueFor(expected), observedValue: valueFor(observed), reason });
  };
  const target = expectation.target;
  compare("foundryVersion", target.foundryVersion, scan.profile.foundryVersion, "Foundry version differs from the exact profile expectation.");
  compare("systemId", target.systemId, scan.profile.systemId, "System ID differs from the exact profile expectation.");
  compare("systemVersion", target.systemVersion, scan.profile.systemVersion, "System version differs from the exact profile expectation.");
  compare("package", target.package, scan.package, "Package identity, version, or hash differs from the exact profile expectation.");
  compare("adapter", target.adapter, scan.adapter, "Adapter identity, version, or hash differs from the exact profile expectation.");
  compare("activeModuleIds", target.activeModuleIds, scan.profile.activeModuleIds, "Active module set differs from the exact profile expectation.");
  compare("documentTypes", target.documentTypes, scan.profile.documentTypes, "Observed document types differ from the exact profile expectation.");
  compare("activeGm.status", target.activeGm.status, scan.activeGm.status, "Active-GM status differs from the exact profile expectation.");
  compare("activeGm.source", target.activeGm.source, scan.activeGm.source, "Active-GM evidence source differs from the exact profile expectation.");
  compare("activeGm.isCurrentUser", target.activeGm.isCurrentUser, scan.activeGm.isCurrentUser, "Current-user active-GM state differs from the exact profile expectation.");
  compare("capabilities", target.capabilities, scan.profile.capabilities.map(({ id, state }) => ({ id, state })), "Capability ID/state set differs from the exact profile expectation.");
  compare("runtimeFingerprint.exactTargetMatch", true, scan.runtimeFingerprint.exactTargetMatch, "The canonical runtime fingerprint does not establish the configured exact target.");
  if (scan.status !== "observed") differences.push({
    field: "scan.status",
    expectedValue: valueFor("observed"),
    observedValue: valueFor(scan.status),
    reason: "The supplied RuntimeProfile scan is blocked and cannot promote a dependent operation.",
  });
  const blockers = differences.map((difference) => `${difference.field}: ${difference.reason}`);
  const status = differences.length === 0 ? "pass" : "blocked";
  return runtimeProfileDiffSchema.parse({
    schemaVersion: "0.1.0",
    expectationId: expectation.expectationId,
    scanId: scan.scanId,
    observedFingerprintId: scan.runtimeFingerprint.fingerprintId,
    status,
    exactTargetMatch: differences.length === 0,
    differences,
    blockers,
    promotion: status === "pass" ? "eligible" : "blocked",
    noWrite: true,
    readyClaim: false,
    preserveUnknown: true,
  });
}

export function serializeRuntimeProfileScan(input: unknown): string {
  return canonicalize(validateRuntimeProfileScan(input));
}

export function serializeRuntimeProfileExpectation(input: unknown): string {
  return canonicalize(validateRuntimeProfileExpectation(input));
}

export function serializeRuntimeProfileDiff(input: unknown): string {
  return canonicalize(runtimeProfileDiffSchema.parse(input));
}
