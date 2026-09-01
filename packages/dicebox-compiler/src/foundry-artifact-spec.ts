import { z } from "zod";
import {
  DICEBOX_PACKAGE_ID,
  StableDiceBoxIdSchema,
} from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";

const sha256Pattern = /^[0-9a-f]{64}$/;
const artifactKinds = ["package", "installer", "worker", "adapter", "runtime"] as const;
const artifactStatuses = ["matched", "missing", "kind-drift", "version-drift", "hash-drift"] as const;

export type FoundryArtifactKind = (typeof artifactKinds)[number];

const artifactSchema = z.object({
  artifactId: StableDiceBoxIdSchema,
  kind: z.enum(artifactKinds),
  version: z.string().min(1),
  sha256: z.string().regex(sha256Pattern),
  source: z.string().min(1),
}).strict();

const targetSchema = z.object({
  packageId: z.literal(DICEBOX_PACKAGE_ID),
  packageVersion: z.string().min(1),
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  adapterId: z.string().min(1),
  adapterVersion: z.string().min(1),
}).strict();

function compareIds(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function assertCanonicalArtifacts(artifacts: readonly { artifactId: string; kind: FoundryArtifactKind }[]): void {
  const ids = artifacts.map((artifact) => artifact.artifactId);
  if (!ids.every((value, index) => index === 0 || compareIds(ids[index - 1]!, value) <= 0)) {
    throw new Error("Foundry artifact expectations must be sorted by stable artifact ID.");
  }
  if (new Set(ids).size !== ids.length) throw new Error("Foundry artifact IDs must be unique.");
  const kinds = artifacts.map((artifact) => artifact.kind);
  if (new Set(kinds).size !== artifactKinds.length || artifactKinds.some((kind) => !kinds.includes(kind))) {
    throw new Error("Foundry artifact expectations must contain exactly one package, installer, worker, adapter, and runtime artifact.");
  }
}

export const foundryArtifactSpecSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  specId: StableDiceBoxIdSchema,
  target: targetSchema,
  artifacts: z.array(artifactSchema).length(artifactKinds.length),
  specSha256: z.string().regex(sha256Pattern),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  noWrite: z.literal(true),
}).strict();

export type FoundryArtifactSpec = z.infer<typeof foundryArtifactSpecSchema>;

export const foundryVerifierExpectationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  verifierId: StableDiceBoxIdSchema,
  sourceSpecId: StableDiceBoxIdSchema,
  sourceSpecSha256: z.string().regex(sha256Pattern),
  target: targetSchema,
  expectedArtifacts: z.array(artifactSchema).length(artifactKinds.length),
  generatedFromCanonicalSpec: z.literal(true),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  noWrite: z.literal(true),
}).strict();

export type FoundryVerifierExpectation = z.infer<typeof foundryVerifierExpectationSchema>;

export const installedFoundryArtifactObservationSchema = z.object({
  target: targetSchema,
  artifacts: z.array(artifactSchema).max(100),
}).strict();

export type InstalledFoundryArtifactObservation = z.infer<typeof installedFoundryArtifactObservationSchema>;

const artifactComparisonSchema = z.object({
  artifactId: StableDiceBoxIdSchema,
  expectedKind: z.enum(artifactKinds),
  observedKind: z.enum(artifactKinds).nullable(),
  expectedVersion: z.string().min(1),
  observedVersion: z.string().min(1).nullable(),
  expectedSha256: z.string().regex(sha256Pattern),
  observedSha256: z.string().regex(sha256Pattern).nullable(),
  status: z.enum(artifactStatuses),
  blockers: z.array(z.string().min(1)).max(8),
}).strict();

export const foundryArtifactDriftReportSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  specId: StableDiceBoxIdSchema,
  specSha256: z.string().regex(sha256Pattern),
  status: z.enum(["pass", "blocked"]),
  targetMatch: z.boolean(),
  comparisons: z.array(artifactComparisonSchema).length(artifactKinds.length),
  unexpectedArtifactIds: z.array(StableDiceBoxIdSchema).max(100),
  blockers: z.array(z.string().min(1)).max(200),
  promotion: z.enum(["eligible", "blocked"]),
  noWrite: z.literal(true),
  foreignArtifactsPreserved: z.literal(true),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

export type FoundryArtifactDriftReport = z.infer<typeof foundryArtifactDriftReportSchema>;

export type CreateFoundryArtifactSpecInput = {
  readonly specId: string;
  readonly target: {
    readonly packageVersion: string;
    readonly foundryVersion: string;
    readonly systemId: string;
    readonly systemVersion: string;
    readonly adapterId: string;
    readonly adapterVersion: string;
  };
  readonly artifacts: readonly {
    readonly artifactId: string;
    readonly kind: FoundryArtifactKind;
    readonly version: string;
    readonly sha256: string;
    readonly source: string;
  }[];
};

export type CreateFoundryVerifierExpectationInput = {
  readonly verifierId: string;
  readonly spec: unknown;
};

function unsignedSpec(spec: FoundryArtifactSpec): Omit<FoundryArtifactSpec, "specSha256"> {
  const { specSha256: _specSha256, ...withoutHash } = spec;
  return withoutHash;
}

function normalizeArtifacts(input: readonly CreateFoundryArtifactSpecInput["artifacts"][number][]): FoundryArtifactSpec["artifacts"] {
  const artifacts = input.map((artifact) => artifactSchema.parse(artifact)).sort((left, right) => compareIds(left.artifactId, right.artifactId));
  assertCanonicalArtifacts(artifacts);
  return artifacts;
}

function assertObservationIdsUnique(artifacts: readonly { artifactId: string }[]): void {
  if (new Set(artifacts.map((artifact) => artifact.artifactId)).size !== artifacts.length) {
    throw new Error("Installed Foundry artifact observations must contain unique stable artifact IDs.");
  }
}

export function validateFoundryArtifactSpec(input: unknown): FoundryArtifactSpec {
  const spec = foundryArtifactSpecSchema.parse(input);
  assertCanonicalArtifacts(spec.artifacts);
  return spec;
}

export async function createFoundryArtifactSpec(input: CreateFoundryArtifactSpecInput): Promise<FoundryArtifactSpec> {
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    specId: StableDiceBoxIdSchema.parse(input.specId),
    target: targetSchema.parse({ ...input.target, packageId: DICEBOX_PACKAGE_ID }),
    artifacts: normalizeArtifacts(input.artifacts),
    mutation: "disabled-until-exact-runtime-gate" as const,
    noWrite: true as const,
  };
  const specSha256 = await sha256FoundryIr(canonicalizeFoundryIr(unsigned));
  return validateFoundryArtifactSpec({ ...unsigned, specSha256 });
}

export async function verifyFoundryArtifactSpecHash(input: unknown): Promise<boolean> {
  try {
    const spec = validateFoundryArtifactSpec(input);
    return (await sha256FoundryIr(canonicalizeFoundryIr(unsignedSpec(spec)))) === spec.specSha256;
  } catch {
    return false;
  }
}

export async function createFoundryVerifierExpectation(input: CreateFoundryVerifierExpectationInput): Promise<FoundryVerifierExpectation> {
  const spec = validateFoundryArtifactSpec(input.spec);
  if (!(await verifyFoundryArtifactSpecHash(spec))) throw new Error("Cannot derive verifier expectations from a tampered artifact specification.");
  return foundryVerifierExpectationSchema.parse({
    schemaVersion: "0.1.0",
    verifierId: StableDiceBoxIdSchema.parse(input.verifierId),
    sourceSpecId: spec.specId,
    sourceSpecSha256: spec.specSha256,
    target: spec.target,
    expectedArtifacts: spec.artifacts,
    generatedFromCanonicalSpec: true,
    mutation: "disabled-until-exact-runtime-gate",
    noWrite: true,
  });
}

function targetMatches(expected: FoundryArtifactSpec["target"], observed: InstalledFoundryArtifactObservation["target"]): boolean {
  return canonicalizeFoundryIr(expected) === canonicalizeFoundryIr(observed);
}

function comparisonFor(expected: FoundryArtifactSpec["artifacts"][number], observed: InstalledFoundryArtifactObservation["artifacts"][number] | undefined): FoundryArtifactDriftReport["comparisons"][number] {
  if (!observed) {
    return {
      artifactId: expected.artifactId,
      expectedKind: expected.kind,
      observedKind: null,
      expectedVersion: expected.version,
      observedVersion: null,
      expectedSha256: expected.sha256,
      observedSha256: null,
      status: "missing",
      blockers: [`Missing installed ${expected.kind} artifact ${expected.artifactId}.`],
    };
  }
  const blockers: string[] = [];
  if (observed.kind !== expected.kind) blockers.push(`Artifact ${expected.artifactId} kind drift: expected ${expected.kind}, observed ${observed.kind}.`);
  if (observed.version !== expected.version) blockers.push(`Artifact ${expected.artifactId} version drift: expected ${expected.version}, observed ${observed.version}.`);
  if (observed.sha256 !== expected.sha256) blockers.push(`Artifact ${expected.artifactId} SHA-256 drift: expected ${expected.sha256}, observed ${observed.sha256}.`);
  const status = observed.kind !== expected.kind
    ? "kind-drift"
    : observed.version !== expected.version
      ? "version-drift"
      : observed.sha256 !== expected.sha256
        ? "hash-drift"
        : "matched";
  return {
    artifactId: expected.artifactId,
    expectedKind: expected.kind,
    observedKind: observed.kind,
    expectedVersion: expected.version,
    observedVersion: observed.version,
    expectedSha256: expected.sha256,
    observedSha256: observed.sha256,
    status,
    blockers,
  };
}

export async function compareFoundryArtifactHashes(
  specInput: unknown,
  observationInput: unknown,
): Promise<FoundryArtifactDriftReport> {
  const spec = validateFoundryArtifactSpec(specInput);
  if (!(await verifyFoundryArtifactSpecHash(spec))) throw new Error("Cannot compare installed artifacts against a tampered artifact specification.");
  const observation = installedFoundryArtifactObservationSchema.parse(observationInput);
  assertObservationIdsUnique(observation.artifacts);
  const expectedById = new Map(spec.artifacts.map((artifact) => [artifact.artifactId, artifact]));
  const observedById = new Map(observation.artifacts.map((artifact) => [artifact.artifactId, artifact]));
  const comparisons = spec.artifacts.map((artifact) => comparisonFor(artifact, observedById.get(artifact.artifactId)));
  const unexpectedArtifactIds = [...observedById.keys()].filter((artifactId) => !expectedById.has(artifactId)).sort(compareIds) as FoundryArtifactDriftReport["unexpectedArtifactIds"];
  const blockers = comparisons.flatMap((comparison) => comparison.blockers);
  const targetMatchResult = targetMatches(spec.target, observation.target);
  if (!targetMatchResult) blockers.unshift("Installed observation target does not exactly match the canonical specification target.");
  for (const artifactId of unexpectedArtifactIds) blockers.push(`Unexpected installed artifact ${artifactId}; preserve it as foreign and block promotion.`);
  const status = targetMatchResult && blockers.length === 0 ? "pass" : "blocked";
  return foundryArtifactDriftReportSchema.parse({
    schemaVersion: "0.1.0",
    specId: spec.specId,
    specSha256: spec.specSha256,
    status,
    targetMatch: targetMatchResult,
    comparisons,
    unexpectedArtifactIds,
    blockers,
    promotion: status === "pass" ? "eligible" : "blocked",
    noWrite: true,
    foreignArtifactsPreserved: true,
    mutation: "disabled-until-exact-runtime-gate",
  });
}

export function serializeFoundryArtifactSpec(input: unknown): string {
  return canonicalizeFoundryIr(validateFoundryArtifactSpec(input));
}

export function serializeFoundryVerifierExpectation(input: unknown): string {
  return canonicalizeFoundryIr(foundryVerifierExpectationSchema.parse(input));
}

export function serializeFoundryArtifactDriftReport(input: unknown): string {
  return canonicalizeFoundryIr(foundryArtifactDriftReportSchema.parse(input));
}
