import { z } from "zod";
import { createAscendancySignalRuneFreshSceneCandidatePreview } from "./ascendancy-signal-rune-fresh-scene-candidate-preview.js";

const planId = "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview" as const;

export const ascendancySignalRuneFreshSceneApprovalEnvelopeSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.fresh-scene-candidate.approval"),
  planId: z.literal(planId),
  status: z.literal("APPROVAL_REQUIRED"),
  candidateRoomIds: z.tuple([
    z.literal("dbx:room:signal-frequency-chamber"),
    z.literal("dbx:room:rune-mechanism-chamber"),
  ]),
  excludedRoomIds: z.tuple([
    z.literal("dbx:room:ascendancy-tram-depot"),
    z.literal("dbx:room:central-core-control-chamber"),
  ]),
  candidateOperationCount: z.literal(20),
  approvalRequired: z.literal(true),
  authoritativeRereadRequired: z.literal(true),
  foreignStatePreservationRequired: z.literal(true),
  noWrite: z.literal(true),
  apply: z.literal(false),
  runtimeBinding: z.literal("not-created"),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  readyClaim: z.literal(false),
}).strict();

export type AscendancySignalRuneFreshSceneApprovalEnvelope = z.infer<typeof ascendancySignalRuneFreshSceneApprovalEnvelopeSchema>;

/**
 * Replays the reviewed M1141 preview into a fixed approval boundary.
 * This records what still requires approval; it never applies the preview,
 * creates a RuntimeBinding, materializes payload, or calls Foundry.
 */
export function createAscendancySignalRuneFreshSceneApprovalEnvelope(): AscendancySignalRuneFreshSceneApprovalEnvelope {
  const preview = createAscendancySignalRuneFreshSceneCandidatePreview();
  const candidateOperationCount = preview.rooms.reduce((total, room) => total + room.operations.length, 0);
  return ascendancySignalRuneFreshSceneApprovalEnvelopeSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.fresh-scene-candidate.approval",
    planId,
    status: "APPROVAL_REQUIRED",
    candidateRoomIds: preview.rooms.map((room) => room.roomId),
    excludedRoomIds: preview.excludedRooms,
    candidateOperationCount,
    approvalRequired: preview.approvalRequired,
    authoritativeRereadRequired: preview.authoritativeRereadRequired,
    foreignStatePreservationRequired: preview.foreignState === "preserve",
    noWrite: preview.noWrite,
    apply: preview.apply,
    runtimeBinding: preview.runtimeBinding,
    payload: preview.payload,
    dispatch: preview.dispatch,
    mutation: preview.mutation,
    readyClaim: preview.readyClaim,
  });
}
