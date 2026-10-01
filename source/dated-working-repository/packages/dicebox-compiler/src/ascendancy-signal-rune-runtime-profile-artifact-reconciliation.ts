import { z } from "zod";
import { RuntimeProfileSchema, type RuntimeProfile } from "@dicebox/core";
import {
  foundryArtifactSpecSchema,
  foundryVerifierExpectationSchema,
  type FoundryArtifactSpec,
  type FoundryVerifierExpectation,
} from "./foundry-artifact-spec.js";

const sha256Schema = z.string().regex(/^[0-9a-f]{64}$/);

const artifactDescriptorSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  source: z.literal("package-owned-static-descriptor"),
  packageId: z.literal("dicebox-campaign-helper"),
  packageVersion: z.literal("0.1.15"),
  specId: z.string().min(1),
  verifierId: z.string().min(1),
  specSha256: sha256Schema,
  artifacts: z.array(z.object({
    artifactId: z.string().min(1),
    kind: z.enum(["package", "installer", "worker", "adapter", "runtime"]),
    version: z.string().min(1),
    sha256: sha256Schema,
  }).strict()).length(5),
  loadedByteHash: z.literal("not-claimed-by-runtime-profile"),
}).strict();

const targetSchema = z.object({
  packageId: z.literal("dicebox-campaign-helper"),
  packageVersion: z.literal("0.1.15"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
  adapterId: z.string().min(1),
  adapterVersion: z.string().min(1),
}).strict();

export const ascendancySignalRuneRuntimeProfileArtifactReconciliationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.runtime-profile-artifact.reconciliation"),
  milestone: z.literal("M1182"),
  status: z.enum(["PASS", "BLOCKED"]),
  evidenceClass: z.literal("local"),
  target: targetSchema,
  runtimeProfile: z.object({
    phase: z.enum(["m0", "runtime-probe", "ready"]),
    foundryVersion: z.string().min(1),
    systemId: z.string().min(1),
    systemVersion: z.string().min(1),
    profileFingerprint: z.string().regex(/^dbx:fingerprint:[0-9a-f]{8}$/),
    activeGmObserved: z.boolean(),
    currentUserMatchesActiveGm: z.boolean(),
    artifactBoundFields: z.literal("descriptor-bound-separate-from-core-profile"),
  }).strict(),
  artifactIdentity: z.object({
    specId: z.string().min(1),
    verifierId: z.string().min(1),
    specSha256: sha256Schema,
    descriptorStatus: z.enum(["PASS_CURRENT_ARTIFACT_DESCRIPTOR", "BLOCKED_ARTIFACT_DESCRIPTOR_DRIFT"]),
    artifactCount: z.number().int().min(0).max(5),
    artifactMatches: z.number().int().min(0).max(5),
    loadedByteHashClaimed: z.literal(false),
  }).strict(),
  profileDiff: z.object({
    status: z.enum(["PASS_EXACT_TARGET_AND_ARTIFACT_DESCRIPTOR", "BLOCKED_PROFILE_OR_ARTIFACT_DRIFT"]),
    targetMatch: z.boolean(),
    artifactIdentityMatch: z.boolean(),
    identityInferred: z.literal(false),
    unknownAndUnavailablePreserved: z.literal(true),
  }).strict(),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  proposal: z.literal("not-created"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
  blockers: z.array(z.string()).max(20),
}).strict();

export type AscendancySignalRuneRuntimeProfileArtifactReconciliation = z.infer<typeof ascendancySignalRuneRuntimeProfileArtifactReconciliationSchema>;

export type CreateAscendancySignalRuneRuntimeProfileArtifactReconciliationInput = {
  readonly artifactSpec: unknown;
  readonly artifactVerifier: unknown;
  readonly artifactDescriptor: unknown;
  readonly runtimeProfile: unknown;
  readonly runtimeFingerprint: string;
  readonly activeGmObserved: boolean;
  readonly currentUserMatchesActiveGm: boolean;
};

function artifactMap(artifacts: readonly { artifactId: string; kind: string; version: string; sha256: string }[]): Map<string, string> {
  return new Map(artifacts.map((artifact) => [artifact.artifactId, `${artifact.kind}|${artifact.version}|${artifact.sha256}`]));
}

function exactArtifactMatch(spec: FoundryArtifactSpec, verifier: FoundryVerifierExpectation, descriptor: z.infer<typeof artifactDescriptorSchema>): boolean {
  if (descriptor.specId !== spec.specId || descriptor.verifierId !== verifier.verifierId || descriptor.specSha256 !== spec.specSha256) return false;
  const expected = artifactMap(spec.artifacts);
  const observed = artifactMap(descriptor.artifacts);
  if (expected.size !== observed.size) return false;
  return [...expected.entries()].every(([artifactId, identity]) => observed.get(artifactId) === identity)
    && verifier.expectedArtifacts.every((artifact) => observed.get(artifact.artifactId) === `${artifact.kind}|${artifact.version}|${artifact.sha256}`);
}

export function createAscendancySignalRuneRuntimeProfileArtifactReconciliation(
  input: CreateAscendancySignalRuneRuntimeProfileArtifactReconciliationInput,
): AscendancySignalRuneRuntimeProfileArtifactReconciliation {
  const spec = foundryArtifactSpecSchema.parse(input.artifactSpec);
  const verifier = foundryVerifierExpectationSchema.parse(input.artifactVerifier);
  const descriptor = artifactDescriptorSchema.parse(input.artifactDescriptor);
  const profile = RuntimeProfileSchema.parse(input.runtimeProfile) as RuntimeProfile;
  const target = targetSchema.parse(spec.target);
  const targetMatch = profile.phase === "runtime-probe"
    && profile.foundryVersion === target.foundryVersion
    && profile.systemId === target.systemId
    && profile.systemVersion === target.systemVersion;
  const artifactMatch = exactArtifactMatch(spec, verifier, descriptor);
  const profileFingerprint = z.string().regex(/^dbx:fingerprint:[0-9a-f]{8}$/).parse(input.runtimeFingerprint);
  const status = targetMatch && artifactMatch && input.activeGmObserved && input.currentUserMatchesActiveGm ? "PASS" : "BLOCKED";
  return ascendancySignalRuneRuntimeProfileArtifactReconciliationSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.runtime-profile-artifact.reconciliation",
    milestone: "M1182",
    status,
    evidenceClass: "local",
    target,
    runtimeProfile: {
      phase: profile.phase,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      profileFingerprint,
      activeGmObserved: input.activeGmObserved,
      currentUserMatchesActiveGm: input.currentUserMatchesActiveGm,
      artifactBoundFields: "descriptor-bound-separate-from-core-profile",
    },
    artifactIdentity: {
      specId: descriptor.specId,
      verifierId: descriptor.verifierId,
      specSha256: descriptor.specSha256,
      descriptorStatus: artifactMatch ? "PASS_CURRENT_ARTIFACT_DESCRIPTOR" : "BLOCKED_ARTIFACT_DESCRIPTOR_DRIFT",
      artifactCount: descriptor.artifacts.length,
      artifactMatches: artifactMatch ? 5 : 0,
      loadedByteHashClaimed: false,
    },
    profileDiff: {
      status: status === "PASS" ? "PASS_EXACT_TARGET_AND_ARTIFACT_DESCRIPTOR" : "BLOCKED_PROFILE_OR_ARTIFACT_DRIFT",
      targetMatch,
      artifactIdentityMatch: artifactMatch,
      identityInferred: false,
      unknownAndUnavailablePreserved: true,
    },
    noWrite: true,
    apply: false,
    runtimeBinding: "not-created",
    payload: "not-materialized",
    proposal: "not-created",
    dispatch: "disabled",
    readyClaim: false,
    blockers: status === "PASS" ? [] : [
      ...(!targetMatch ? ["RuntimeProfile target does not match the canonical artifact target."] : []),
      ...(!artifactMatch ? ["Package-owned artifact descriptor does not match the canonical spec/verifier."] : []),
      ...(!input.activeGmObserved || !input.currentUserMatchesActiveGm ? ["Current active-GM evidence is incomplete."] : []),
    ],
  });
}
