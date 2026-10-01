import { z } from "zod";

const sourceInventorySchema = z.object({
  runtimeProfileQuerySurface: z.literal("present"),
  runtimeEvidenceDiagnosticSurface: z.literal("redacted-only"),
  runtimeProfileDiffSurface: z.literal("not-present"),
  authoritativeRereadObservation: z.literal("not-observed"),
  sourceProfileIsRuntimeEvidence: z.literal(false),
}).strict();

const m1149ContextSchema = z.object({
  receiptId: z.literal("dbx:receipt:m1149-runtime-profile-availability-gate"),
  status: z.literal("BLOCKED_RUNTIME_PROFILE_UNOBSERVED"),
  sourceSurface: z.literal("pass"),
  runtimeProfile: z.literal("blocked-source-surface-present-runtime-observation-unavailable"),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
}).strict();

const blockerSchema = z.enum([
  "runtime-observation-required-for-complete-profile",
  "runtime-profile-diff-surface-not-present",
  "authoritative-reread-not-observed",
]);

export const ascendancySignalRuneSmallestMissingEvidenceBoundarySchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.smallest-missing-evidence-boundary.gate"),
  milestone: z.literal("M1150"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  m1149Context: m1149ContextSchema,
  sourceInventory: sourceInventorySchema,
  disposition: z.literal("runtime-observation-required"),
  gates: z.object({
    sourceInventory: z.literal("pass"),
    completeRuntimeProfile: z.literal("blocked-runtime-observation-required"),
    profileDiff: z.literal("blocked-runtime-profile-diff-surface-not-present"),
    authoritativeReread: z.literal("blocked-runtime-reread-unobserved"),
  }).strict(),
  blockers: z.array(blockerSchema).length(3),
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

export type AscendancySignalRuneSmallestMissingEvidenceBoundary = z.infer<typeof ascendancySignalRuneSmallestMissingEvidenceBoundarySchema>;

export type CreateAscendancySignalRuneSmallestMissingEvidenceBoundaryInput = {
  readonly m1149Context: unknown;
  readonly sourceInventory: unknown;
};

/** Records source-surface inventory without treating source/API presence as a live observation. */
export function createAscendancySignalRuneSmallestMissingEvidenceBoundary(
  input: CreateAscendancySignalRuneSmallestMissingEvidenceBoundaryInput,
): AscendancySignalRuneSmallestMissingEvidenceBoundary {
  return ascendancySignalRuneSmallestMissingEvidenceBoundarySchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.smallest-missing-evidence-boundary.gate",
    milestone: "M1150",
    status: "BLOCKED",
    evidenceClass: "local",
    m1149Context: m1149ContextSchema.parse(input.m1149Context),
    sourceInventory: sourceInventorySchema.parse(input.sourceInventory),
    disposition: "runtime-observation-required",
    gates: {
      sourceInventory: "pass",
      completeRuntimeProfile: "blocked-runtime-observation-required",
      profileDiff: "blocked-runtime-profile-diff-surface-not-present",
      authoritativeReread: "blocked-runtime-reread-unobserved",
    },
    blockers: [
      "runtime-observation-required-for-complete-profile",
      "runtime-profile-diff-surface-not-present",
      "authoritative-reread-not-observed",
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
  });
}
