import { z } from "zod";
import {
  ascendancySignalRuneCandidateScopeGateSchema,
  type AscendancySignalRuneCandidateScopeGate,
} from "./ascendancy-signal-rune-candidate-scope-gate.js";

const candidateTransportDesignSchema = z.object({
  selector: z.literal("fixed-candidate-id:m1141-signal-rune"),
  allowedRoomIds: z.tuple([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  rejectedRoomIds: z.tuple([
    z.literal("dbx:room:ascendancy-tram-depot"),
    z.literal("dbx:room:central-core-control-chamber"),
  ]),
  selectionPolicy: z.literal("filter-before-loader-and-install-loop"),
  loaderPrecondition: z.literal("validate-selected-assets-only-after-exact-selector"),
  currentLoaderDisposition: z.literal("rejects-incomplete-assets-before-selection"),
  installLoopPolicy: z.literal("iterate-selected-room-set-only"),
  repairLoopPolicy: z.literal("preflight-and-iterate-selected-room-set-only"),
  foreignScenePolicy: z.literal("preserve-and-never-adopt"),
  unknownRoomPolicy: z.literal("reject-before-runtime"),
  implementationStatus: z.literal("specified-not-implemented"),
}).strict();

export const ascendancySignalRuneCandidateTransportDesignSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.candidate-transport.design"),
  milestone: z.literal("M1157"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  candidateScope: z.object({
    candidatePlanId: z.literal("dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview"),
    candidateRooms: z.tuple([
      z.literal("dbx:room:signal-frequency-chamber"),
      z.literal("dbx:room:rune-mechanism-chamber"),
    ]),
    excludedRuntimeScenes: z.tuple([
      z.literal("AneddhKAAfk5HlsA"),
      z.literal("p9Mbi0CJWe9KvJhH"),
    ]),
    foreignState: z.literal("preserve"),
  }).strict(),
  currentArtifacts: z.object({
    packageSha256: z.literal("2F257477F02AAC0A60B01D6C0AEFEF738484BE5C437A708BD293945CCF90645F"),
    installerSha256: z.literal("FFFB439942619C5AFFC10E5AB74B43EF9AA3107C989F1551FF5CFCE2E7C5BC83"),
  }).strict(),
  transportDesign: candidateTransportDesignSchema,
  blockers: z.array(z.enum([
    "transport-design-not-implemented",
    "current-loader-rejects-incomplete-assets-before-selection",
    "current-installer-loops-all-four-rooms",
  ])).min(1).max(8),
  preserveUnknown: z.literal(true),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  proposal: z.literal("not-created"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneCandidateTransportDesign = z.infer<typeof ascendancySignalRuneCandidateTransportDesignSchema>;

export type CreateAscendancySignalRuneCandidateTransportDesignInput = {
  readonly candidateGate: unknown;
};

/**
 * Records the smallest safe transport contract without changing the Foundry
 * installer. The contract is intentionally not executable transport.
 */
export function createAscendancySignalRuneCandidateTransportDesign(
  input: CreateAscendancySignalRuneCandidateTransportDesignInput,
): AscendancySignalRuneCandidateTransportDesign {
  const candidateGate: AscendancySignalRuneCandidateScopeGate = ascendancySignalRuneCandidateScopeGateSchema.parse(input.candidateGate);
  if (candidateGate.candidateScope.candidateSpecificTransport !== "required"
    || candidateGate.installerObservation.candidateSpecificTransport !== "absent") {
    throw new Error("M1157 requires the M1156 required-but-absent candidate transport boundary.");
  }
  return ascendancySignalRuneCandidateTransportDesignSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.candidate-transport.design",
    milestone: "M1157",
    status: "BLOCKED",
    evidenceClass: "local",
    candidateScope: {
      candidatePlanId: candidateGate.candidateScope.candidatePlanId,
      candidateRooms: candidateGate.candidateScope.candidateRooms,
      excludedRuntimeScenes: candidateGate.candidateScope.excludedRuntimeScenes,
      foreignState: candidateGate.candidateScope.foreignState,
    },
    currentArtifacts: {
      packageSha256: candidateGate.packageObservation.packageSha256,
      installerSha256: candidateGate.packageObservation.installerSha256,
    },
    transportDesign: {
      selector: "fixed-candidate-id:m1141-signal-rune",
      allowedRoomIds: candidateGate.candidateScope.candidateRooms,
      rejectedRoomIds: candidateGate.candidateScope.excludedRooms,
      selectionPolicy: "filter-before-loader-and-install-loop",
      loaderPrecondition: "validate-selected-assets-only-after-exact-selector",
      currentLoaderDisposition: "rejects-incomplete-assets-before-selection",
      installLoopPolicy: "iterate-selected-room-set-only",
      repairLoopPolicy: "preflight-and-iterate-selected-room-set-only",
      foreignScenePolicy: "preserve-and-never-adopt",
      unknownRoomPolicy: "reject-before-runtime",
      implementationStatus: "specified-not-implemented",
    },
    blockers: [
      "transport-design-not-implemented",
      "current-loader-rejects-incomplete-assets-before-selection",
      "current-installer-loops-all-four-rooms",
    ],
    preserveUnknown: true,
    noWrite: true,
    apply: false,
    runtimeBinding: "not-created",
    payload: "not-materialized",
    proposal: "not-created",
    dispatch: "disabled",
    readyClaim: false,
  });
}
