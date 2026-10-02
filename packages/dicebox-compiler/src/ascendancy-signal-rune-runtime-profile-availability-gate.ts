import { z } from "zod";

const sourceSurfaceSchema = z.object({
  status: z.literal("present"),
  sourcePath: z.literal("packages/dicebox-foundry/src/module.js"),
  queryKind: z.literal("runtime-profile"),
  apiPath: z.literal("game.diceboxCampaignHelper.query"),
  schemaContract: z.literal("packages/dicebox-core/src/capability.ts:RuntimeProfileSchema"),
  readOnly: z.literal(true),
  sourceOnly: z.literal(true),
}).strict();

const observationSchema = z.object({
  status: z.literal("unobserved"),
  sourceReceiptScope: z.literal("M1145-redacted-diagnostic-only"),
  fullRuntimeProfileObserved: z.literal(false),
  runtimeFingerprintObserved: z.literal(false),
  profileDiffObserved: z.literal(false),
  authoritativeRereadObserved: z.literal(false),
}).strict();

const m1148ContextSchema = z.object({
  receiptId: z.literal("dbx:receipt:m1148-served-parity-gate-refresh"),
  status: z.literal("BLOCKED_SERVED_PARITY_REFRESH"),
  servedGate: z.literal("pass"),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
}).strict();

const blockerSchema = z.enum([
  "runtime-profile-observation-unavailable",
  "runtime-profile-diff-unavailable",
  "authoritative-reread-unobserved",
]);

export const ascendancySignalRuneRuntimeProfileAvailabilityGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.runtime-profile-availability.gate"),
  milestone: z.literal("M1149"),
  status: z.literal("BLOCKED"),
  evidenceClass: z.literal("local"),
  m1148Context: m1148ContextSchema,
  sourceSurface: sourceSurfaceSchema,
  observation: observationSchema,
  gates: z.object({
    sourceSurface: z.literal("pass"),
    runtimeProfile: z.literal("blocked-source-surface-present-runtime-observation-unavailable"),
    profileDiff: z.literal("blocked-no-runtime-profile"),
    authoritativeReread: z.literal("blocked-unobserved"),
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

export type AscendancySignalRuneRuntimeProfileAvailabilityGate = z.infer<typeof ascendancySignalRuneRuntimeProfileAvailabilityGateSchema>;

export type CreateAscendancySignalRuneRuntimeProfileAvailabilityGateInput = {
  readonly m1148Context: unknown;
  readonly sourceSurface: unknown;
  readonly observation: unknown;
};

/**
 * Distinguishes a source-declared read-only profile query from an observed
 * schema-valid profile. Source/API presence never becomes runtime evidence.
 */
export function createAscendancySignalRuneRuntimeProfileAvailabilityGate(
  input: CreateAscendancySignalRuneRuntimeProfileAvailabilityGateInput,
): AscendancySignalRuneRuntimeProfileAvailabilityGate {
  return ascendancySignalRuneRuntimeProfileAvailabilityGateSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.runtime-profile-availability.gate",
    milestone: "M1149",
    status: "BLOCKED",
    evidenceClass: "local",
    m1148Context: m1148ContextSchema.parse(input.m1148Context),
    sourceSurface: sourceSurfaceSchema.parse(input.sourceSurface),
    observation: observationSchema.parse(input.observation),
    gates: {
      sourceSurface: "pass",
      runtimeProfile: "blocked-source-surface-present-runtime-observation-unavailable",
      profileDiff: "blocked-no-runtime-profile",
      authoritativeReread: "blocked-unobserved",
    },
    blockers: [
      "runtime-profile-observation-unavailable",
      "runtime-profile-diff-unavailable",
      "authoritative-reread-unobserved",
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
