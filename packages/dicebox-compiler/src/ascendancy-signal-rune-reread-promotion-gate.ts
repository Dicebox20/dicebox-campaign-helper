import { z } from "zod";
import {
  ascendancySignalRuneRereadRequirementsSchema,
  type AscendancySignalRuneRereadRequirements,
} from "./ascendancy-signal-rune-reread-requirements.js";

const blockerEntrySchema = z.object({
  roomId: z.string().min(1),
  sceneId: z.string().min(1),
  intentId: z.string().min(1),
  binding: z.literal("blocked-unresolved-runtime-child-binding"),
  payload: z.literal("blocked-not-materialized"),
  foundryIr: z.literal("blocked-requires-bound-payload-plan"),
  proposalBatch: z.literal("blocked-requires-bound-payload-plan"),
  bridgeResolution: z.literal("blocked-unavailable"),
  terminalHistory: z.literal("blocked-requires-terminal-staged-executor-evidence"),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
}).strict();

export const ascendancySignalRuneRereadPromotionGateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("dicebox.ascendancy.signal-rune.native-document.reread-promotion-gate"),
  status: z.literal("BLOCKED"),
  planId: z.literal("dbx:plan:m1115-signal-rune-native-document-preview"),
  previewToken: z.string().min(1),
  requirements: z.literal(18),
  noWrite: z.literal(true),
  apply: z.literal(false),
  payload: z.literal("not-materialized"),
  dispatch: z.literal("disabled"),
  blockers: z.tuple([
    z.literal("runtime-child-bindings-unresolved"),
    z.literal("native-payload-not-materialized"),
    z.literal("foundry-ir-promotion-blocked"),
    z.literal("proposal-batch-promotion-blocked"),
    z.literal("bridge-resolution-unavailable"),
    z.literal("terminal-history-requires-staged-executor-evidence"),
  ]),
  entries: z.array(blockerEntrySchema).length(18),
  foreignState: z.literal("preserve"),
  retryAfterUnknown: z.literal(false),
  runtimeState: z.literal("not-modeled"),
}).strict();

export type AscendancySignalRuneRereadPromotionGate = z.infer<typeof ascendancySignalRuneRereadPromotionGateSchema>;

/** Reports why unresolved requirements cannot be promoted; it creates no promotion artifact. */
export function createAscendancySignalRuneRereadPromotionGate(
  input: { readonly requirements: AscendancySignalRuneRereadRequirements },
): AscendancySignalRuneRereadPromotionGate {
  const requirements = ascendancySignalRuneRereadRequirementsSchema.parse(input.requirements);
  return ascendancySignalRuneRereadPromotionGateSchema.parse({
    schemaVersion: "0.1.0",
    operation: "dicebox.ascendancy.signal-rune.native-document.reread-promotion-gate",
    status: "BLOCKED",
    planId: requirements.planId,
    previewToken: requirements.previewToken,
    requirements: requirements.requirements.length,
    noWrite: true,
    apply: false,
    payload: "not-materialized",
    dispatch: "disabled",
    blockers: [
      "runtime-child-bindings-unresolved",
      "native-payload-not-materialized",
      "foundry-ir-promotion-blocked",
      "proposal-batch-promotion-blocked",
      "bridge-resolution-unavailable",
      "terminal-history-requires-staged-executor-evidence",
    ],
    entries: requirements.requirements.map((entry) => ({
      roomId: entry.roomId,
      sceneId: entry.sceneId,
      intentId: entry.intentId,
      binding: "blocked-unresolved-runtime-child-binding",
      payload: "blocked-not-materialized",
      foundryIr: "blocked-requires-bound-payload-plan",
      proposalBatch: "blocked-requires-bound-payload-plan",
      bridgeResolution: "blocked-unavailable",
      terminalHistory: "blocked-requires-terminal-staged-executor-evidence",
      foreignState: entry.foreignState,
      retryAfterUnknown: entry.retryAfterUnknown,
    })),
    foreignState: "preserve",
    retryAfterUnknown: false,
    runtimeState: requirements.runtimeState,
  });
}
