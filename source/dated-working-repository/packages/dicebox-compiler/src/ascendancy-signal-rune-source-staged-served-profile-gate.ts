import { z } from "zod";
import { ascendancySignalRuneFreshSceneCandidatePreviewSchema } from "./ascendancy-signal-rune-fresh-scene-candidate-preview.js";
import { foundryArtifactSpecSchema, foundryVerifierExpectationSchema } from "./foundry-artifact-spec.js";

const sha256Schema = z.string().regex(/^[0-9a-fA-F]{64}$/);

const sourceHashSchema = z.object({
  path: z.string().min(1),
  sha256: sha256Schema,
}).strict();

const artifactIdentitySchema = z.object({
  specId: z.literal("dbx:foundry-spec:current-product-0.1.15-m1144"),
  verifierId: z.literal("dbx:foundry-verifier:current-product-0.1.15-m1144"),
  specSha256: sha256Schema,
  packageSha256: sha256Schema,
  adapterSha256: sha256Schema,
  installerSha256: sha256Schema,
  workerSha256: sha256Schema,
  staticRuntimeSha256: sha256Schema,
}).strict();

const runtimeObservationSchema = z.object({
  worldId: z.literal("dbx-test-world"),
  foundryVersion: z.literal("14.367"),
  systemId: z.literal("dnd5e"),
  systemVersion: z.literal("5.3.3"),
  activeGmName: z.literal("Gamemaster"),
  activeGmObserved: z.literal(true),
  currentUserMatchesActiveGm: z.literal(true),
  exactTargetMatch: z.literal(true),
  moduleLoad: z.literal("dicebox-campaign-helper@dbx=0.1.18"),
  runtimeFingerprint: z.literal("dbx:fingerprint:cbea3468"),
  servedByteHash: z.union([z.literal("not-observed"), sha256Schema]),
  runtimeProfile: z.literal("incomplete"),
  profileDiff: z.literal("unavailable"),
}).strict();

const servedWorkerObservationSchema = z.object({
  status: z.literal("PASS"),
  httpStatus: z.literal(200),
  requestCount: z.literal(1),
  byteLength: z.literal(12288),
  sourceSha256: sha256Schema,
  servedSha256: sha256Schema,
  canonicalSha256: sha256Schema,
  sourceServedParity: z.literal(true),
  canonicalParity: z.literal(true),
}).strict();

const scopeObservationSchema = z.object({
  candidatePlanId: z.literal("dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview"),
  candidateRooms: z.tuple([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  excludedRuntimeScenes: z.tuple([
    z.literal("AneddhKAAfk5HlsA"),
    z.literal("p9Mbi0CJWe9KvJhH"),
  ]),
  installerScope: z.literal("four-room-campaign-path"),
  candidateSpecificTransport: z.literal("unresolved"),
}).strict();

const gateBlockerSchema = z.enum([
  "staged-package-byte-parity-unobserved",
  "served-byte-hash-unobserved",
  "runtime-profile-incomplete",
  "runtime-profile-diff-unavailable",
  "candidate-specific-installer-boundary-unresolved",
  "live-write-and-execution-authority-unproven",
]);

export const ascendancySignalRuneSourceStagedServedProfileGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.source-staged-served-profile.gate"),
  milestone: z.literal("M1146"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  sourceHashes: z.array(sourceHashSchema).length(3),
  candidateScope: scopeObservationSchema,
  artifactIdentity: artifactIdentitySchema,
  runtimeObservation: runtimeObservationSchema,
  servedWorkerObservation: servedWorkerObservationSchema.optional(),
  gates: z.object({
    source: z.literal("pass"),
    staged: z.literal("blocked-unobserved"),
    served: z.enum(["blocked-unobserved", "pass"]),
    runtimeProfile: z.literal("blocked-incomplete"),
    profileDiff: z.literal("blocked-unavailable"),
    installerScope: z.literal("blocked-candidate-specific-boundary-unresolved"),
    authority: z.literal("blocked-live-write-execution-unproven"),
  }).strict(),
  blockers: z.array(gateBlockerSchema).min(1).max(20),
  foreignState: z.literal("preserve"),
  preserveUnknown: z.literal(true),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  proposal: z.literal("not-created"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneSourceStagedServedProfileGate = z.infer<typeof ascendancySignalRuneSourceStagedServedProfileGateSchema>;

export type CreateAscendancySignalRuneSourceStagedServedProfileGateInput = {
  readonly candidatePreview: unknown;
  readonly sourceHashes: readonly { readonly path: string; readonly sha256: string }[];
  readonly artifactIdentity: {
    readonly spec: unknown;
    readonly verifier: unknown;
  };
  readonly runtimeObservation: z.input<typeof runtimeObservationSchema>;
  readonly servedWorkerObservation?: unknown;
};

function lowercase(value: string): string {
  return value.toLowerCase();
}

/**
 * Composes current source, artifact, and exact-fixture observations into a
 * non-promoting gate. Missing served/profile evidence is represented as a
 * blocker instead of being inferred from a successful login or module load.
 */
export function createAscendancySignalRuneSourceStagedServedProfileGate(
  input: CreateAscendancySignalRuneSourceStagedServedProfileGateInput,
): AscendancySignalRuneSourceStagedServedProfileGate {
  const candidatePreview = ascendancySignalRuneFreshSceneCandidatePreviewSchema.parse(input.candidatePreview);
  const spec = foundryArtifactSpecSchema.parse(input.artifactIdentity.spec);
  const verifier = foundryVerifierExpectationSchema.parse(input.artifactIdentity.verifier);
  if (verifier.sourceSpecId !== spec.specId || verifier.sourceSpecSha256 !== spec.specSha256) {
    throw new Error("M1146 rejected verifier drift from the current canonical artifact specification.");
  }
  if (spec.specId !== "dbx:foundry-spec:current-product-0.1.15-m1144"
    || verifier.verifierId !== "dbx:foundry-verifier:current-product-0.1.15-m1144") {
    throw new Error("M1146 requires the M1144 immutable artifact identity.");
  }
  if (candidatePreview.planId !== "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview"
    || candidatePreview.excludedRuntimeScenes[0]?.sceneIdRuntime !== "AneddhKAAfk5HlsA"
    || candidatePreview.excludedRuntimeScenes[1]?.sceneIdRuntime !== "p9Mbi0CJWe9KvJhH") {
    throw new Error("M1146 rejected candidate scope or foreign-Scene drift.");
  }
  const sourceHashes = input.sourceHashes.map((entry) => ({ path: entry.path, sha256: lowercase(entry.sha256) }));
  if (new Set(sourceHashes.map((entry) => entry.path)).size !== sourceHashes.length) {
    throw new Error("M1146 source hashes must identify each candidate source exactly once.");
  }
  const target = spec.target;
  const runtimeObservation = runtimeObservationSchema.parse(input.runtimeObservation);
  const servedWorkerObservation = input.servedWorkerObservation === undefined
    ? undefined
    : servedWorkerObservationSchema.parse(input.servedWorkerObservation);
  if (target.foundryVersion !== runtimeObservation.foundryVersion
    || target.systemId !== runtimeObservation.systemId
    || target.systemVersion !== runtimeObservation.systemVersion) {
    throw new Error("M1146 rejected artifact/runtime target drift.");
  }
  if (servedWorkerObservation) {
    const expectedWorkerSha256 = spec.artifacts.find((artifact) => artifact.kind === "worker")?.sha256;
    if (!expectedWorkerSha256
      || lowercase(servedWorkerObservation.sourceSha256) !== lowercase(servedWorkerObservation.servedSha256)
      || lowercase(servedWorkerObservation.servedSha256) !== lowercase(servedWorkerObservation.canonicalSha256)
      || lowercase(servedWorkerObservation.canonicalSha256) !== lowercase(expectedWorkerSha256)) {
      throw new Error("M1148 rejected served-worker parity drift from the M1144 worker expectation.");
    }
  }
  const artifactByKind = new Map(spec.artifacts.map((artifact) => [artifact.kind, artifact]));
  const servedPass = servedWorkerObservation !== undefined;
  return ascendancySignalRuneSourceStagedServedProfileGateSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.source-staged-served-profile.gate",
    milestone: "M1146",
    status: "BLOCKED",
    evidenceClass: "local",
    sourceHashes,
    candidateScope: {
      candidatePlanId: candidatePreview.planId,
      candidateRooms: [candidatePreview.rooms[0].roomId, candidatePreview.rooms[1].roomId],
      excludedRuntimeScenes: [candidatePreview.excludedRuntimeScenes[0].sceneIdRuntime, candidatePreview.excludedRuntimeScenes[1].sceneIdRuntime],
      installerScope: "four-room-campaign-path",
      candidateSpecificTransport: "unresolved",
    },
    artifactIdentity: {
      specId: spec.specId,
      verifierId: verifier.verifierId,
      specSha256: spec.specSha256,
      packageSha256: artifactByKind.get("package")!.sha256,
      adapterSha256: artifactByKind.get("adapter")!.sha256,
      installerSha256: artifactByKind.get("installer")!.sha256,
      workerSha256: artifactByKind.get("worker")!.sha256,
      staticRuntimeSha256: artifactByKind.get("runtime")!.sha256,
    },
    runtimeObservation,
    gates: {
      source: "pass",
      staged: "blocked-unobserved",
      served: servedPass ? "pass" : "blocked-unobserved",
      runtimeProfile: "blocked-incomplete",
      profileDiff: "blocked-unavailable",
      installerScope: "blocked-candidate-specific-boundary-unresolved",
      authority: "blocked-live-write-execution-unproven",
    },
    blockers: [
      "staged-package-byte-parity-unobserved",
      ...(servedPass ? [] : ["served-byte-hash-unobserved" as const]),
      "runtime-profile-incomplete",
      "runtime-profile-diff-unavailable",
      "candidate-specific-installer-boundary-unresolved",
      "live-write-and-execution-authority-unproven",
    ],
    foreignState: "preserve",
    preserveUnknown: true,
    noWrite: true,
    apply: false,
    runtimeBinding: "not-created",
    payload: "not-materialized",
    proposal: "not-created",
    dispatch: "disabled",
    readyClaim: false,
    ...(servedWorkerObservation ? { servedWorkerObservation } : {}),
  });
}
