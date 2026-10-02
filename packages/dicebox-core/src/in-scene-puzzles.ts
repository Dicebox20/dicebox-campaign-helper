import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema, type StableDiceBoxId } from "./identity.js";

const frequencyStationSchema = z.object({
  stationId: StableDiceBoxIdSchema,
  signature: z.string().min(1),
}).strict();

const circuitBoardSchema = z.object({ boardId: StableDiceBoxIdSchema }).strict();

const frequencyPairSchema = z.object({
  stationId: StableDiceBoxIdSchema,
  boardId: StableDiceBoxIdSchema,
}).strict();

export const frequencyCircuitStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleId: StableDiceBoxIdSchema,
  stations: z.array(frequencyStationSchema).min(1).max(16),
  boards: z.array(circuitBoardSchema).min(1).max(16),
  solution: z.array(frequencyPairSchema).min(1).max(16),
  solved: z.array(frequencyPairSchema).max(16),
  wrongAttempts: z.number().int().nonnegative(),
  status: z.enum(["active", "complete"]),
}).strict().superRefine((value, context) => {
  const stationIds = new Set(value.stations.map((station) => station.stationId));
  const boardIds = new Set(value.boards.map((board) => board.boardId));
  const solutionStations = new Set<string>();
  const solutionBoards = new Set<string>();
  for (const [index, pair] of value.solution.entries()) {
    if (!stationIds.has(pair.stationId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["solution", index, "stationId"], message: "Solution station must be declared." });
    if (!boardIds.has(pair.boardId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["solution", index, "boardId"], message: "Solution board must be declared." });
    if (solutionStations.has(pair.stationId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["solution", index], message: "A station may have only one solution board." });
    if (solutionBoards.has(pair.boardId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["solution", index], message: "A board may have only one solution station." });
    solutionStations.add(pair.stationId);
    solutionBoards.add(pair.boardId);
  }
  for (const [index, pair] of value.solved.entries()) {
    if (!solutionStations.has(pair.stationId) || !solutionBoards.has(pair.boardId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["solved", index], message: "Solved pair must be part of the solution." });
  }
  if (value.status === "complete" && value.solved.length !== value.solution.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "A complete matching puzzle must contain every solution pair." });
});

export type FrequencyCircuitState = z.infer<typeof frequencyCircuitStateSchema>;
export type FrequencyCircuitAttempt = {
  readonly state: FrequencyCircuitState;
  readonly outcome: "connected" | "wrong-connection" | "already-solved";
  readonly consequence: "none" | "catastrophic-feedback-near-lethal-nonlethal";
};

export function attemptFrequencyCircuitConnection(
  input: FrequencyCircuitState,
  stationId: StableDiceBoxId,
  boardId: StableDiceBoxId,
): FrequencyCircuitAttempt {
  const state = frequencyCircuitStateSchema.parse(input);
  const solved = state.solved.some((pair) => pair.stationId === stationId);
  if (solved) return { state, outcome: "already-solved", consequence: "none" };
  const expected = state.solution.find((pair) => pair.stationId === stationId);
  if (!expected || expected.boardId !== boardId) {
    return {
      state: frequencyCircuitStateSchema.parse({ ...state, wrongAttempts: state.wrongAttempts + 1 }),
      outcome: "wrong-connection",
      consequence: "catastrophic-feedback-near-lethal-nonlethal",
    };
  }
  const nextSolved = [...state.solved, { stationId, boardId }];
  return {
    state: frequencyCircuitStateSchema.parse({ ...state, solved: nextSolved, status: nextSolved.length === state.solution.length ? "complete" : "active" }),
    outcome: "connected",
    consequence: "none",
  };
}

const tramPieceSchema = z.object({
  pieceId: StableDiceBoxIdSchema,
  orientation: z.enum(["horizontal", "vertical"]),
  length: z.number().int().min(2).max(3),
  row: z.number().int().min(0).max(5),
  column: z.number().int().min(0).max(5),
  repaired: z.boolean(),
  operational: z.boolean(),
}).strict();

export const tramBoardStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleId: StableDiceBoxIdSchema,
  width: z.literal(6),
  height: z.literal(6),
  exitPieceId: StableDiceBoxIdSchema,
  pieces: z.array(tramPieceSchema).length(6),
  moveCount: z.number().int().nonnegative(),
  status: z.enum(["active", "complete"]),
}).strict().superRefine((value, context) => {
  const ids = new Set<string>();
  for (const [index, piece] of value.pieces.entries()) {
    if (ids.has(piece.pieceId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["pieces", index, "pieceId"], message: "Tram piece IDs must be unique." });
    ids.add(piece.pieceId);
    if (piece.orientation === "horizontal" && piece.column + piece.length > value.width) context.addIssue({ code: z.ZodIssueCode.custom, path: ["pieces", index], message: "Horizontal tram must remain inside the board." });
    if (piece.orientation === "vertical" && piece.row + piece.length > value.height) context.addIssue({ code: z.ZodIssueCode.custom, path: ["pieces", index], message: "Vertical tram must remain inside the board." });
  }
  if (!ids.has(value.exitPieceId)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["exitPieceId"], message: "Exit piece must be declared." });
});

export type TramPiece = z.infer<typeof tramPieceSchema>;
export type TramBoardState = z.infer<typeof tramBoardStateSchema>;
/** The chat-authored sequence is retained as provenance; it is not accepted as verified until legal on the board. */
export const chatAuthoredTramSolution: readonly TramMove[] = Object.freeze([
  { pieceId: createStableDiceBoxId("tram", "b"), delta: -1 },
  { pieceId: createStableDiceBoxId("tram", "c"), delta: -3 },
  { pieceId: createStableDiceBoxId("tram", "o"), delta: 3 },
  { pieceId: createStableDiceBoxId("tram", "r"), delta: -1 },
  { pieceId: createStableDiceBoxId("tram", "q"), delta: 2 },
  { pieceId: createStableDiceBoxId("tram", "x"), delta: 3 },
]);
export type TramMove = { readonly pieceId: StableDiceBoxId; readonly delta: number };

const tram = (pieceId: string, orientation: TramPiece["orientation"], length: 2 | 3, row: number, column: number): TramPiece => ({
  pieceId: createStableDiceBoxId("tram", pieceId), orientation, length, row, column, repaired: false, operational: false,
});

export function createCanonicalTramBoard(): TramBoardState {
  return tramBoardStateSchema.parse({
    schemaVersion: "0.1.0",
    puzzleId: createStableDiceBoxId("puzzle", "andrew-tram-routing"),
    width: 6,
    height: 6,
    exitPieceId: createStableDiceBoxId("tram", "x"),
    pieces: [
      tram("x", "horizontal", 2, 2, 1),
      tram("o", "vertical", 3, 0, 5),
      tram("q", "vertical", 3, 1, 3),
      tram("b", "vertical", 2, 4, 0),
      tram("c", "horizontal", 2, 4, 4),
      tram("r", "horizontal", 3, 5, 2),
    ],
    moveCount: 0,
    status: "active",
  });
}

function occupies(piece: TramPiece, row: number, column: number): boolean {
  if (piece.orientation === "horizontal") return piece.row === row && column >= piece.column && column < piece.column + piece.length;
  return piece.column === column && row >= piece.row && row < piece.row + piece.length;
}

function canMove(state: TramBoardState, piece: TramPiece, delta: number): boolean {
  if (delta === 0 || !Number.isInteger(delta) || !piece.operational) return false;
  const nextRow = piece.orientation === "vertical" ? piece.row + delta : piece.row;
  const nextColumn = piece.orientation === "horizontal" ? piece.column + delta : piece.column;
  if (nextRow < 0 || nextColumn < 0 || nextRow + (piece.orientation === "vertical" ? piece.length : 1) > state.height || nextColumn + (piece.orientation === "horizontal" ? piece.length : 1) > state.width) return false;
  const moved = { ...piece, row: nextRow, column: nextColumn };
  for (const other of state.pieces) {
    if (other.pieceId === piece.pieceId) continue;
    for (let row = 0; row < state.height; row += 1) {
      for (let column = 0; column < state.width; column += 1) {
        if (occupies(moved, row, column) && occupies(other, row, column)) return false;
      }
    }
  }
  return true;
}

export function legalTramMoves(input: TramBoardState): TramMove[] {
  const state = tramBoardStateSchema.parse(input);
  const moves: TramMove[] = [];
  for (const piece of state.pieces) {
    if (!piece.operational) continue;
    for (const direction of [-1, 1]) {
      let distance = direction;
      while (canMove(state, piece, distance)) {
        moves.push({ pieceId: piece.pieceId, delta: distance });
        distance += direction;
      }
    }
  }
  return moves;
}

export function applyTramMove(input: TramBoardState, move: TramMove): TramBoardState {
  const state = tramBoardStateSchema.parse(input);
  const piece = state.pieces.find((candidate) => candidate.pieceId === move.pieceId);
  if (!piece) throw new Error("Unknown tram piece.");
  if (!canMove(state, piece, move.delta)) throw new Error("Illegal tram move.");
  const nextPieces = state.pieces.map((candidate) => candidate.pieceId === piece.pieceId
    ? { ...candidate, row: candidate.orientation === "vertical" ? candidate.row + move.delta : candidate.row, column: candidate.orientation === "horizontal" ? candidate.column + move.delta : candidate.column }
    : candidate);
  const moved = nextPieces.find((candidate) => candidate.pieceId === piece.pieceId);
  const complete = moved !== undefined && moved.pieceId === state.exitPieceId && moved.orientation === "horizontal" && moved.column + moved.length === state.width;
  return tramBoardStateSchema.parse({ ...state, pieces: nextPieces, moveCount: state.moveCount + 1, status: complete ? "complete" : "active" });
}

function encodeTramState(state: TramBoardState): string {
  return state.pieces.map((piece) => `${piece.row},${piece.column}`).join(";");
}

export function solveCanonicalTramBoard(): { readonly moves: TramMove[]; readonly minimumMoves: number; readonly verified: boolean } {
  const initial = createCanonicalTramBoard();
  const operational = tramBoardStateSchema.parse({ ...initial, pieces: initial.pieces.map((piece) => ({ ...piece, repaired: true, operational: true })) });
  const queue: Array<{ state: TramBoardState; moves: TramMove[] }> = [{ state: operational, moves: [] }];
  const seen = new Set([encodeTramState(operational)]);
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (current.state.status === "complete") return { moves: current.moves, minimumMoves: current.moves.length, verified: current.moves.length === 6 };
    for (const move of legalTramMoves(current.state)) {
      const next = applyTramMove(current.state, move);
      const key = encodeTramState(next);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ state: next, moves: [...current.moves, move] });
    }
  }
  return { moves: [], minimumMoves: -1, verified: false };
}

export const runeOrderStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleId: StableDiceBoxIdSchema,
  expectedOrder: z.array(StableDiceBoxIdSchema).length(5),
  placed: z.array(StableDiceBoxIdSchema).max(5),
  status: z.enum(["active", "complete"]),
}).strict();

export type RuneOrderState = z.infer<typeof runeOrderStateSchema>;

export function advanceRuneOrder(input: RuneOrderState, runeId: StableDiceBoxId): { readonly state: RuneOrderState; readonly outcome: "placed" | "wrong-rune" | "complete" } {
  const state = runeOrderStateSchema.parse(input);
  const expected = state.expectedOrder[state.placed.length];
  if (expected !== runeId) return { state, outcome: "wrong-rune" };
  const placed = [...state.placed, runeId];
  const next = runeOrderStateSchema.parse({ ...state, placed, status: placed.length === state.expectedOrder.length ? "complete" : "active" });
  return { state: next, outcome: next.status === "complete" ? "complete" : "placed" };
}

export const sixStationActivationStateSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  puzzleId: StableDiceBoxIdSchema,
  stations: z.array(z.object({ stationId: StableDiceBoxIdSchema, actorId: StableDiceBoxIdSchema }).strict()).length(6),
  activationRound: z.string().min(1).nullable(),
  activatedStationIds: z.array(StableDiceBoxIdSchema).max(6),
  status: z.enum(["locked", "available", "complete"]),
}).strict();

export type SixStationActivationState = z.infer<typeof sixStationActivationStateSchema>;

export function activateSixStation(
  input: SixStationActivationState,
  stationId: StableDiceBoxId,
  actorId: StableDiceBoxId,
  roundId: string,
): { readonly state: SixStationActivationState; readonly outcome: "activated" | "wrong-actor" | "stale-round" | "complete" } {
  const state = sixStationActivationStateSchema.parse(input);
  const station = state.stations.find((candidate) => candidate.stationId === stationId);
  if (!station || station.actorId !== actorId) return { state, outcome: "wrong-actor" };
  if (state.activationRound !== null && state.activationRound !== roundId) return { state, outcome: "stale-round" };
  if (state.activatedStationIds.includes(stationId)) return { state, outcome: state.status === "complete" ? "complete" : "activated" };
  const activated = [...state.activatedStationIds, stationId];
  const next = sixStationActivationStateSchema.parse({ ...state, activationRound: roundId, activatedStationIds: activated, status: activated.length === 6 ? "complete" : "available" });
  return { state: next, outcome: next.status === "complete" ? "complete" : "activated" };
}
