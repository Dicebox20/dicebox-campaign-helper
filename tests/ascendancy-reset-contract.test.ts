import { describe, expect, it } from "vitest";
import { applyAscendancyReset, previewAscendancyReset } from "@dicebox/core";
import { createStableDiceBoxId } from "@dicebox/core";

const id = (namespace: string, value: string) => createStableDiceBoxId(namespace, value);

describe("dependency-aware Ascendancy reset contract", () => {
  it("previews and cascades selected puzzle dependencies without runtime writes", () => {
    const selected = id("puzzle", "aleister-frequency");
    const other = id("puzzle", "lawson-memory");
    const selectedPair = id("pair", "aleister-sprocket");
    const otherPair = id("pair", "lawson-tactal");
    const foreign = { untouched: { owner: "foreign", value: 7 } };
    const state = { schemaVersion: "0.1.0" as const, puzzleStates: [
      { puzzleId: selected, pairId: selectedPair, status: "complete" as const, openedAt: "2026-09-06T00:00:00Z", runtime: { stage: "done" } },
      { puzzleId: other, pairId: otherPair, status: "complete" as const, openedAt: "2026-09-06T00:00:00Z", runtime: { stage: "other" } },
    ], pairStates: [
      { pairId: selectedPair, complete: true, cooperativeComplete: true, completedAt: "2026-09-06T00:00:00Z" },
      { pairId: otherPair, complete: true, cooperativeComplete: true, completedAt: "2026-09-06T00:00:00Z" },
    ], finalActivation: { activationRound: "round-1", activatedStationIds: [id("station", "a")], complete: true }, foreignState: foreign };
    const preview = previewAscendancyReset(state, selected);
    expect(preview).toMatchObject({ status: "PREVIEW", noWrite: true, runtime: "not-invoked", foreignStatePreserved: true });
    const result = applyAscendancyReset(state, selected);
    expect(result).toMatchObject({ status: "PASS", mutation: "in-memory-only", runtimeWrite: false, idempotent: true });
    expect(result.state.puzzleStates[0]).toMatchObject({ status: "available", openedAt: null, runtime: {} });
    expect(result.state.pairStates[0]).toMatchObject({ complete: false, cooperativeComplete: false, completedAt: null });
    expect(result.state.finalActivation).toEqual({ activationRound: null, activatedStationIds: [], complete: false });
    expect(result.state.puzzleStates[1]).toEqual(state.puzzleStates[1]);
    expect(result.state.pairStates[1]).toEqual(state.pairStates[1]);
    expect(result.state.foreignState).toEqual(foreign);
    expect(applyAscendancyReset(result.state, selected).state).toEqual(result.state);
  });

  it("rejects an unknown puzzle instead of inventing a dependency graph", () => {
    const state = { schemaVersion: "0.1.0" as const, puzzleStates: [{ puzzleId: id("puzzle", "known"), pairId: id("pair", "known"), status: "available" as const, openedAt: null, runtime: {} }], pairStates: [{ pairId: id("pair", "known"), complete: false, cooperativeComplete: false, completedAt: null }], finalActivation: { activationRound: null, activatedStationIds: [], complete: false }, foreignState: {} };
    expect(() => previewAscendancyReset(state, id("puzzle", "missing"))).toThrow("Unknown Ascendancy puzzle");
  });
});
