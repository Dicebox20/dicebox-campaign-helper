import { describe, expect, it } from "vitest";
import {
  activateSixStation,
  advanceRuneOrder,
  applyTramMove,
  attemptFrequencyCircuitConnection,
  createCanonicalTramBoard,
  legalTramMoves,
  solveCanonicalTramBoard,
  sixStationActivationStateSchema,
  tramBoardStateSchema,
} from "@dicebox/core";
import { createStableDiceBoxId } from "@dicebox/core";

const id = (namespace: string, value: string) => createStableDiceBoxId(namespace, value);

describe("non-Regionwright in-scene puzzle engines", () => {
  it("makes wrong frequency connections dangerous without allowing a hidden brute-force success", () => {
    const station = id("station", "frequency-1");
    const board = id("board", "circuit-a");
    const wrong = id("board", "circuit-b");
    const base = {
      schemaVersion: "0.1.0" as const,
      puzzleId: id("puzzle", "frequency-circuit-matching"),
      stations: [{ stationId: station, signature: "sig-a" }],
      boards: [{ boardId: board }, { boardId: wrong }],
      solution: [{ stationId: station, boardId: board }],
      solved: [],
      wrongAttempts: 0,
      status: "active" as const,
    };
    const failed = attemptFrequencyCircuitConnection(base, station, wrong);
    expect(failed.outcome).toBe("wrong-connection");
    expect(failed.consequence).toBe("catastrophic-feedback-near-lethal-nonlethal");
    expect(failed.state.solved).toHaveLength(0);
    expect(attemptFrequencyCircuitConnection(failed.state, station, board).outcome).toBe("connected");
  });

  it("keeps the canonical tram board authoritative and verifies its six-move minimum", () => {
    const solved = solveCanonicalTramBoard();
    expect(solved.verified).toBe(true);
    expect(solved.minimumMoves).toBe(6);
    expect(solved.moves.map((move) => `${move.pieceId}:${move.delta}`)).toEqual([
      "dbx:tram:b:-1",
      "dbx:tram:c:-3",
      "dbx:tram:o:3",
      "dbx:tram:r:-2",
      "dbx:tram:q:2",
      "dbx:tram:x:3",
    ]);
    const operational = tramBoardStateSchema.parse({
      ...createCanonicalTramBoard(),
      pieces: createCanonicalTramBoard().pieces.map((piece) => ({ ...piece, repaired: true, operational: true })),
    });
    expect(legalTramMoves(operational).some((move) => move.pieceId === id("tram", "b") && move.delta === -1)).toBe(true);
    expect(() => applyTramMove(createCanonicalTramBoard(), { pieceId: id("tram", "x"), delta: 1 })).toThrow("Illegal tram move");
  });

  it("progresses rune order in-scene without resetting completed pieces", () => {
    const runes = ["a", "d", "f", "k", "m"].map((value) => id("rune", value));
    const base = { schemaVersion: "0.1.0" as const, puzzleId: id("puzzle", "rune-order"), expectedOrder: runes, placed: [], status: "active" as const };
    const wrong = advanceRuneOrder(base, runes[1]!);
    expect(wrong.outcome).toBe("wrong-rune");
    const first = advanceRuneOrder(base, runes[0]!);
    const second = advanceRuneOrder(first.state, runes[1]!);
    expect(second.state.placed).toEqual(runes.slice(0, 2));
  });

  it("requires six authorized stations in one activation round", () => {
    const stations = ["aleister", "sprocket", "dalton", "andrew", "lawson", "tactal"].map((name) => ({ stationId: id("station", name), actorId: id("actor", name) }));
    let state = sixStationActivationStateSchema.parse({ schemaVersion: "0.1.0", puzzleId: id("puzzle", "six-station-activation"), stations, activationRound: null, activatedStationIds: [], status: "locked" });
    expect(activateSixStation(state, stations[0]!.stationId, id("actor", "wrong"), "round-1").outcome).toBe("wrong-actor");
    for (const station of stations) state = activateSixStation(state, station.stationId, station.actorId, "round-1").state;
    expect(state.status).toBe("complete");
    expect(activateSixStation(state, stations[0]!.stationId, stations[0]!.actorId, "round-2").outcome).toBe("stale-round");
  });
});
