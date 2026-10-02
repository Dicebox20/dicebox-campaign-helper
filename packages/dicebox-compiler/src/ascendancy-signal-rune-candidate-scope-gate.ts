import { z } from "zod";
import { ascendancySignalRuneFreshSceneCandidatePreviewSchema } from "./ascendancy-signal-rune-fresh-scene-candidate-preview.js";

const sha256Schema = z.string().regex(/^[0-9a-fA-F]{64}$/);

const packageObservationSchema = z.object({
  packageSha256: z.literal("2F257477F02AAC0A60B01D6C0AEFEF738484BE5C437A708BD293945CCF90645F"),
  installerSha256: z.literal("FFFB439942619C5AFFC10E5AB74B43EF9AA3107C989F1551FF5CFCE2E7C5BC83"),
  campaignRooms: z.tuple([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:ascendancy-tram-depot"),
    z.literal("dbx:room:rune-mechanism-chamber"),
    z.literal("dbx:room:central-core-control-chamber"),
  ]),
  assetStates: z.object({
    "dbx:room:signal-frequency-chamber": z.literal("scene-bound/path-present"),
    "dbx:room:rune-mechanism-chamber": z.literal("scene-bound/path-present"),
    "dbx:room:ascendancy-tram-depot": z.literal("final-map-required/path-null"),
    "dbx:room:central-core-control-chamber": z.literal("final-map-required/path-null"),
  }).strict(),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
}).strict();

const installerObservationSchema = z.object({
  currentScope: z.literal("four-room-campaign-path"),
  loadPackage: z.literal("rejects any incomplete asset before installation"),
  installOperation: z.literal("loops over packageData.campaign.rooms with no candidate selector"),
  repairOperation: z.literal("loops over packageData.campaign.rooms with no candidate selector"),
  candidateSpecificTransport: z.literal("absent"),
}).strict();

const candidateScopeSchema = z.object({
  candidatePlanId: z.literal("dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview"),
  candidateRooms: z.tuple([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  excludedRooms: z.tuple([
    z.literal("dbx:room:ascendancy-tram-depot"),
    z.literal("dbx:room:central-core-control-chamber"),
  ]),
  excludedRuntimeScenes: z.tuple([
    z.literal("AneddhKAAfk5HlsA"),
    z.literal("p9Mbi0CJWe9KvJhH"),
  ]),
  foreignState: z.literal("preserve"),
  candidateSpecificTransport: z.literal("required"),
}).strict();

export const ascendancySignalRuneCandidateScopeGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.candidate-scope.gate"),
  milestone: z.literal("M1156"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  candidateScope: candidateScopeSchema,
  packageObservation: packageObservationSchema,
  installerObservation: installerObservationSchema,
  gates: z.object({
    candidateIdentity: z.literal("pass"),
    foreignScenePreservation: z.literal("pass"),
    packageScope: z.literal("blocked-four-room-campaign-path"),
    candidateSpecificTransport: z.literal("blocked-absent"),
    incompleteExcludedRoomAssets: z.literal("blocking-current-loader"),
  }).strict(),
  blockers: z.array(z.enum([
    "candidate-specific-installer-transport-absent",
    "incomplete-excluded-room-assets-block-current-loader",
    "four-room-installer-scope-not-narrowable",
  ])).min(1).max(10),
  preserveUnknown: z.literal(true),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  proposal: z.literal("not-created"),
  dispatch: z.literal("disabled"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneCandidateScopeGate = z.infer<typeof ascendancySignalRuneCandidateScopeGateSchema>;

export type CreateAscendancySignalRuneCandidateScopeGateInput = {
  readonly candidatePreview: unknown;
  readonly packageObservation: unknown;
  readonly installerObservation: unknown;
};

/**
 * Produces a strict no-write candidate-scope preview. This gate never calls
 * Foundry, selects a runtime Scene, invokes the installer, or materializes a
 * native document payload.
 */
export function createAscendancySignalRuneCandidateScopeGate(
  input: CreateAscendancySignalRuneCandidateScopeGateInput,
): AscendancySignalRuneCandidateScopeGate {
  const candidatePreview = ascendancySignalRuneFreshSceneCandidatePreviewSchema.parse(input.candidatePreview);
  const packageObservation = packageObservationSchema.parse(input.packageObservation);
  const installerObservation = installerObservationSchema.parse(input.installerObservation);

  const candidateRooms = candidatePreview.rooms.map((room) => room.roomId) as [
    "dbx:room:signal-frequency-chamber",
    "dbx:room:rune-mechanism-chamber",
  ];
  const excludedRuntimeScenes = candidatePreview.excludedRuntimeScenes.map((scene) => scene.sceneIdRuntime) as [
    "AneddhKAAfk5HlsA",
    "p9Mbi0CJWe9KvJhH",
  ];

  return ascendancySignalRuneCandidateScopeGateSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.candidate-scope.gate",
    milestone: "M1156",
    status: "BLOCKED",
    evidenceClass: "local",
    candidateScope: {
      candidatePlanId: candidatePreview.planId,
      candidateRooms,
      excludedRooms: candidatePreview.excludedRooms,
      excludedRuntimeScenes,
      foreignState: candidatePreview.foreignState,
      candidateSpecificTransport: "required",
    },
    packageObservation,
    installerObservation,
    gates: {
      candidateIdentity: "pass",
      foreignScenePreservation: "pass",
      packageScope: "blocked-four-room-campaign-path",
      candidateSpecificTransport: "blocked-absent",
      incompleteExcludedRoomAssets: "blocking-current-loader",
    },
    blockers: [
      "candidate-specific-installer-transport-absent",
      "incomplete-excluded-room-assets-block-current-loader",
      "four-room-installer-scope-not-narrowable",
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
