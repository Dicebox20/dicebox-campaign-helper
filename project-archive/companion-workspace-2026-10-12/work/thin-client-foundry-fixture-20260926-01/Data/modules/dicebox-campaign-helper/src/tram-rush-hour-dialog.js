/**
 * Local-only Tram Rush Hour smoke kit.
 *
 * This adapter deliberately owns no Foundry Documents and no campaign state.
 * It is a small visual proof that the canonical six-piece puzzle can be opened
 * and played before it is ever connected to a Region, Scene, player, or macro.
 */

const WIDTH = 6;
const HEIGHT = 6;
const EXIT_PIECE_ID = "dbx:tram:x";

const PIECE_SPECS = Object.freeze([
  Object.freeze({ pieceId: "dbx:tram:x", label: "Exit tram X", orientation: "horizontal", length: 2, row: 2, column: 1, color: "#bd5b42" }),
  Object.freeze({ pieceId: "dbx:tram:o", label: "Car O", orientation: "vertical", length: 3, row: 0, column: 5, color: "#4f8aad" }),
  Object.freeze({ pieceId: "dbx:tram:q", label: "Car Q", orientation: "vertical", length: 3, row: 1, column: 3, color: "#a77a3f" }),
  Object.freeze({ pieceId: "dbx:tram:b", label: "Car B", orientation: "vertical", length: 2, row: 4, column: 0, color: "#7063a5" }),
  Object.freeze({ pieceId: "dbx:tram:c", label: "Car C", orientation: "horizontal", length: 2, row: 4, column: 4, color: "#4f986c" }),
  Object.freeze({ pieceId: "dbx:tram:r", label: "Car R", orientation: "horizontal", length: 3, row: 5, column: 2, color: "#a55384" }),
]);

const solution = Object.freeze([
  Object.freeze({ pieceId: "dbx:tram:b", delta: -1 }),
  Object.freeze({ pieceId: "dbx:tram:c", delta: -3 }),
  Object.freeze({ pieceId: "dbx:tram:o", delta: 3 }),
  Object.freeze({ pieceId: "dbx:tram:r", delta: -2 }),
  Object.freeze({ pieceId: "dbx:tram:q", delta: 2 }),
  Object.freeze({ pieceId: "dbx:tram:x", delta: 3 }),
]);

function clonePiece(piece) {
  return { ...piece, repaired: true, operational: true };
}

export function createTramRushHourSession() {
  return {
    schemaVersion: "0.1.0",
    puzzleId: "dbx:puzzle:andrew-tram-routing",
    width: WIDTH,
    height: HEIGHT,
    exitPieceId: EXIT_PIECE_ID,
    pieces: PIECE_SPECS.map(clonePiece),
    moveCount: 0,
    status: "active",
  };
}

function occupies(piece, row, column) {
  return piece.orientation === "horizontal"
    ? piece.row === row && column >= piece.column && column < piece.column + piece.length
    : piece.column === column && row >= piece.row && row < piece.row + piece.length;
}

function canMove(session, piece, delta) {
  if (!Number.isInteger(delta) || delta === 0 || piece.operational !== true) return false;
  const row = piece.orientation === "vertical" ? piece.row + delta : piece.row;
  const column = piece.orientation === "horizontal" ? piece.column + delta : piece.column;
  if (row < 0 || column < 0 || row + (piece.orientation === "vertical" ? piece.length : 1) > session.height || column + (piece.orientation === "horizontal" ? piece.length : 1) > session.width) return false;
  const moved = { ...piece, row, column };
  return !session.pieces.some((other) => {
    if (other.pieceId === piece.pieceId) return false;
    for (let currentRow = 0; currentRow < session.height; currentRow += 1) {
      for (let currentColumn = 0; currentColumn < session.width; currentColumn += 1) {
        if (occupies(moved, currentRow, currentColumn) && occupies(other, currentRow, currentColumn)) return true;
      }
    }
    return false;
  });
}

export function legalTramRushHourMoves(session) {
  const moves = [];
  for (const piece of session.pieces) {
    for (const direction of [-1, 1]) {
      let delta = direction;
      while (canMove(session, piece, delta)) {
        moves.push({ pieceId: piece.pieceId, delta });
        delta += direction;
      }
    }
  }
  return moves;
}

export function applyTramRushHourMove(session, move) {
  const piece = session.pieces.find((candidate) => candidate.pieceId === move?.pieceId);
  if (!piece) throw new Error("Unknown Tram Rush Hour vehicle.");
  if (!canMove(session, piece, move.delta)) throw new Error("Illegal Tram Rush Hour move.");
  const pieces = session.pieces.map((candidate) => candidate.pieceId === piece.pieceId
    ? {
      ...candidate,
      row: candidate.orientation === "vertical" ? candidate.row + move.delta : candidate.row,
      column: candidate.orientation === "horizontal" ? candidate.column + move.delta : candidate.column,
    }
    : { ...candidate });
  const exitPiece = pieces.find((candidate) => candidate.pieceId === session.exitPieceId);
  const complete = exitPiece?.orientation === "horizontal" && exitPiece.column + exitPiece.length === session.width;
  return { ...session, pieces, moveCount: session.moveCount + 1, status: complete ? "complete" : "active" };
}

function cellPiece(session, row, column) {
  return session.pieces.find((piece) => occupies(piece, row, column));
}

function moveLabel(piece, delta) {
  const direction = piece.orientation === "horizontal"
    ? delta < 0 ? "left" : "right"
    : delta < 0 ? "up" : "down";
  return `${piece.label} ${direction} ${Math.abs(delta)}`;
}

function renderBoard(session) {
  const cells = [];
  for (let row = 0; row < session.height; row += 1) {
    for (let column = 0; column < session.width; column += 1) {
      const piece = cellPiece(session, row, column);
      const label = piece ? piece.label : "Open track";
      const content = piece ? piece.pieceId.split(":").at(-1).toUpperCase() : "";
      const style = piece ? `background:${piece.color};border-color:${piece.color};` : "";
      cells.push(`<div aria-label="${label}" title="${label}" style="${style}min-height:44px;border:1px solid #777;display:grid;place-items:center;font-weight:700;">${content}</div>`);
    }
  }
  return `<div aria-label="Six by six Tram Rush Hour board" style="display:grid;grid-template-columns:repeat(6,1fr);gap:2px;padding:8px;background:#17191d;border:2px solid #b58438;">${cells.join("")}</div>`;
}

export function renderTramRushHourHtml(session) {
  const legal = legalTramRushHourMoves(session);
  const moves = legal.length === 0
    ? "<p>No legal moves remain.</p>"
    : `<div style="display:flex;flex-wrap:wrap;gap:6px;">${legal.map((move) => {
      const piece = session.pieces.find((candidate) => candidate.pieceId === move.pieceId);
      return `<button type="button" data-dbx-tram-action="move" data-piece-id="${move.pieceId}" data-delta="${move.delta}">${moveLabel(piece, move.delta)}</button>`;
    }).join("")}</div>`;
  const result = session.status === "complete"
    ? "<p style=\"font-weight:700;color:#59c36a;\">Route clear — the exit tram reached the Core line.</p>"
    : "<p>Clear the exit lane for tram X. This session is local to this dialog and does not change the Scene.</p>";
  return `<section data-dbx-tram-root><p><strong>Moves:</strong> ${session.moveCount}</p>${result}${renderBoard(session)}<h3 style="margin-top:12px;">Legal moves</h3>${moves}<p><button type="button" data-dbx-tram-action="reset">Reset board</button></p></section>`;
}

function installControls(dialog, controller) {
  const content = dialog.element?.querySelector?.(".dialog-content");
  if (!content || content.dataset.dbxTramBound === "true") return;
  content.dataset.dbxTramBound = "true";
  const render = () => { content.innerHTML = renderTramRushHourHtml(controller.getSession()); };
  content.addEventListener("click", (event) => {
    const button = event.target.closest?.("button[data-dbx-tram-action]");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    if (button.dataset.dbxTramAction === "reset") controller.reset();
    if (button.dataset.dbxTramAction === "move") controller.move({ pieceId: button.dataset.pieceId, delta: Number(button.dataset.delta) });
    render();
  });
}

export function createTramRushHourDialogController() {
  let session = createTramRushHourSession();
  const controller = {
    getSession: () => session,
    move: (move) => {
      session = applyTramRushHourMove(session, move);
      return session;
    },
    reset: () => {
      session = createTramRushHourSession();
      return session;
    },
  };
  return Object.freeze(controller);
}

export function createTramRushHourDialogConfig() {
  const controller = createTramRushHourDialogController();
  return {
    window: { title: "DiceBox Tram Rush Hour" },
    position: { width: 680 },
    modal: false,
    content: renderTramRushHourHtml(controller.getSession()),
    buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }],
    render: (_event, dialog) => installControls(dialog, controller),
  };
}

export async function openTramRushHourDialog(runtime = globalThis, { regionEvent = false } = {}) {
  if (!runtime.game?.user?.isGM && !regionEvent) throw new Error("Only a GM can open the local Tram Rush Hour smoke test directly.");
  const DialogV2 = runtime.foundry?.applications?.api?.DialogV2;
  if (typeof DialogV2?.wait !== "function") throw new Error("Foundry v14 DialogV2.wait is unavailable.");
  return DialogV2.wait(createTramRushHourDialogConfig());
}

export function installTramRushHourApi(runtime = globalThis) {
  if (!runtime.game || "diceboxTramRushHour" in runtime.game) return runtime.game?.diceboxTramRushHour ?? null;
  const api = Object.freeze({
    open: () => openTramRushHourDialog(runtime),
    openForRegionEvent: () => openTramRushHourDialog(runtime, { regionEvent: true }),
    createSession: createTramRushHourSession,
    legalMoves: legalTramRushHourMoves,
    solution,
  });
  Object.defineProperty(runtime.game, "diceboxTramRushHour", { configurable: false, enumerable: false, writable: false, value: api });
  return api;
}

export function registerTramRushHourApi(runtime = globalThis) {
  if (typeof runtime.Hooks?.once !== "function") return { scheduled: false };
  runtime.Hooks.once("ready", () => installTramRushHourApi(runtime));
  return { scheduled: true };
}

registerTramRushHourApi();
