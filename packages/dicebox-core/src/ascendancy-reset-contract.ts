import { z } from "zod";
import { StableDiceBoxIdSchema, type StableDiceBoxId } from "./identity.js";

const nullableTimestamp = z.string().min(1).nullable();
const runtimeData = z.record(z.unknown());

export const ascendancyResetStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleStates: z.array(z.object({ puzzleId: StableDiceBoxIdSchema, pairId: StableDiceBoxIdSchema, status: z.enum(["available", "complete"]), openedAt: nullableTimestamp, runtime: runtimeData }).strict()).min(1),
  pairStates: z.array(z.object({ pairId: StableDiceBoxIdSchema, complete: z.boolean(), cooperativeComplete: z.boolean(), completedAt: nullableTimestamp }).strict()).min(1),
  finalActivation: z.object({ activationRound: nullableTimestamp, activatedStationIds: z.array(StableDiceBoxIdSchema), complete: z.boolean() }).strict(),
  foreignState: z.record(z.unknown()),
}).strict();

export type AscendancyResetState = z.infer<typeof ascendancyResetStateSchema>;

export const ascendancyResetPreviewSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("ascendancy.reset.preview"),
  status: z.literal("PREVIEW"),
  selectedPuzzleId: StableDiceBoxIdSchema,
  selectedPairId: StableDiceBoxIdSchema,
  changedOwnedPaths: z.array(z.string().min(1)).min(4),
  foreignStatePreserved: z.literal(true),
  noWrite: z.literal(true),
  runtime: z.literal("not-invoked"),
}).strict();

export type AscendancyResetPreview = z.infer<typeof ascendancyResetPreviewSchema>;

export const ascendancyResetResultSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("ascendancy.reset.apply"),
  status: z.literal("PASS"),
  selectedPuzzleId: StableDiceBoxIdSchema,
  selectedPairId: StableDiceBoxIdSchema,
  state: ascendancyResetStateSchema,
  foreignStatePreserved: z.literal(true),
  mutation: z.literal("in-memory-only"),
  runtimeWrite: z.literal(false),
  idempotent: z.literal(true),
}).strict();

export type AscendancyResetResult = z.infer<typeof ascendancyResetResultSchema>;

function locate(state: AscendancyResetState, puzzleId: StableDiceBoxId) {
  const puzzle = state.puzzleStates.find((candidate) => candidate.puzzleId === puzzleId);
  if (!puzzle) throw new Error(`Unknown Ascendancy puzzle: ${puzzleId}`);
  const pair = state.pairStates.find((candidate) => candidate.pairId === puzzle.pairId);
  if (!pair) throw new Error(`Missing derived pair for Ascendancy puzzle: ${puzzleId}`);
  return { puzzle, pair };
}

export function previewAscendancyReset(input: unknown, puzzleId: StableDiceBoxId): AscendancyResetPreview {
  const state = ascendancyResetStateSchema.parse(input);
  const { puzzle, pair } = locate(state, puzzleId);
  return ascendancyResetPreviewSchema.parse({
    schemaVersion: "0.1.0",
    operation: "ascendancy.reset.preview",
    status: "PREVIEW",
    selectedPuzzleId: puzzle.puzzleId,
    selectedPairId: pair.pairId,
    changedOwnedPaths: ["puzzle.status", "puzzle.openedAt", "puzzle.runtime", "pair.complete", "pair.cooperativeComplete", "pair.completedAt", "finalActivation"],
    foreignStatePreserved: true,
    noWrite: true,
    runtime: "not-invoked",
  });
}

export function applyAscendancyReset(input: unknown, puzzleId: StableDiceBoxId): AscendancyResetResult {
  const state = ascendancyResetStateSchema.parse(input);
  const { puzzle, pair } = locate(state, puzzleId);
  const next = ascendancyResetStateSchema.parse({
    ...state,
    puzzleStates: state.puzzleStates.map((candidate) => candidate.puzzleId === puzzle.puzzleId ? { ...candidate, status: "available", openedAt: null, runtime: {} } : candidate),
    pairStates: state.pairStates.map((candidate) => candidate.pairId === pair.pairId ? { ...candidate, complete: false, cooperativeComplete: false, completedAt: null } : candidate),
    finalActivation: { activationRound: null, activatedStationIds: [], complete: false },
  });
  return ascendancyResetResultSchema.parse({ schemaVersion: "0.1.0", operation: "ascendancy.reset.apply", status: "PASS", selectedPuzzleId: puzzle.puzzleId, selectedPairId: pair.pairId, state: next, foreignStatePreserved: true, mutation: "in-memory-only", runtimeWrite: false, idempotent: true });
}
