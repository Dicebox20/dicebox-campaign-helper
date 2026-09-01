import { describe, expect, it } from "vitest";
// @ts-ignore Browser-side Foundry adapter is intentionally plain JavaScript.
import { applyTramRushHourMove, createTramRushHourDialogConfig, createTramRushHourSession, legalTramRushHourMoves, openTramRushHourDialog } from "../packages/dicebox-foundry/src/tram-rush-hour-dialog.js";

const canonicalSolution = [
  { pieceId: "dbx:tram:b", delta: -1 },
  { pieceId: "dbx:tram:c", delta: -3 },
  { pieceId: "dbx:tram:o", delta: 3 },
  { pieceId: "dbx:tram:r", delta: -2 },
  { pieceId: "dbx:tram:q", delta: 2 },
  { pieceId: "dbx:tram:x", delta: 3 },
];

describe("Tram Rush Hour local dialog smoke kit", () => {
  it("keeps the known six-move solution playable from a fresh in-memory session", () => {
    let session = createTramRushHourSession();
    expect(session.pieces).toHaveLength(6);
    expect(session.pieces.every((piece: { operational: boolean; repaired: boolean }) => piece.operational && piece.repaired)).toBe(true);
    for (const move of canonicalSolution) {
      expect(legalTramRushHourMoves(session)).toContainEqual(move);
      session = applyTramRushHourMove(session, move);
    }
    expect(session).toMatchObject({ moveCount: 6, status: "complete" });
  });

  it("rejects invalid moves without changing the fresh board", () => {
    const session = createTramRushHourSession();
    expect(() => applyTramRushHourMove(session, { pieceId: "dbx:tram:x", delta: 1 })).toThrow("Illegal Tram Rush Hour move");
    expect(createTramRushHourSession()).toMatchObject({ moveCount: 0, status: "active" });
  });

  it("builds a DialogV2 configuration that has no Scene, Region, player, or document dependency", () => {
    const config = createTramRushHourDialogConfig();
    expect(config.window.title).toBe("DiceBox Tram Rush Hour");
    expect(config.content).toContain("Six by six Tram Rush Hour board");
    expect(config.content).toContain("data-dbx-tram-action=\"move\"");
    expect(config.buttons).toEqual([{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }]);
    expect(typeof config.render).toBe("function");
  });

  it("opens only through the documented DialogV2.wait surface for a GM", async () => {
    let received: unknown;
    const runtime = {
      game: { user: { isGM: true } },
      foundry: { applications: { api: { DialogV2: { wait: async (config: unknown) => { received = config; return "close"; } } } } },
    };
    await expect(openTramRushHourDialog(runtime)).resolves.toBe("close");
    expect(received).toMatchObject({ window: { title: "DiceBox Tram Rush Hour" } });
    await expect(openTramRushHourDialog({ ...runtime, game: { user: { isGM: false } } })).rejects.toThrow("Only a GM");
    await expect(openTramRushHourDialog({ ...runtime, game: { user: { isGM: false } } }, { regionEvent: true })).resolves.toBe("close");
  });
});
