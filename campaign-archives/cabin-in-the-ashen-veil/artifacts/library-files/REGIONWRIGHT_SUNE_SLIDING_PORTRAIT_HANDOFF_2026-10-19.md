# Regionwright Handoff — Sune Sliding-Portrait Puzzle

**Project:** DiceBox Campaign Helper / *Cabin in the Ashen Veil*
**Prepared:** 2026-10-19
**Status:** Design handoff for a bounded Regionwright prototype. **Not** a claim of Foundry installation, tested runtime behavior, or repository/KB synchronization.

## 1. Objective

Build a reusable browser-based **3×3 sliding-picture puzzle** prototype (eight movable image tiles, one empty cell), styled as an **embossed portrait of Sune Firehair**. It is a secondary puzzle in the **Memorial Clearing**, separate from the central Sune statue and its endgame Scrying Bowl mechanism. This prototype should be usable as a potential DiceBox Campaign Helper puzzle component and be suitable for future Foundry integration.

The user supplied a reference image of a 3×3 portrait sliding puzzle with one black/empty square. The requested game is JavaScript/browser-based (user colloquially called it a “JAVA game”). The user also supplied `index.html` for **Regionwright Point Board** to investigate whether its pixel-cell artwork can be reused as a display asset or source.

## 2. Approved design constraints

1. **Location:** A separate stone memorial/panel within the **Memorial Clearing**; do **not** replace or merge with the statue's ultimate water-mechanism puzzle.
2. **Visual subject:** An embossed portrait of **Sune Firehair**, fitting a weathered memorial stone in a fantasy woodland shrine. Preserve the overall 3×3 sliding-picture concept of the example image.
3. **Interaction:** A classic eight-tile sliding puzzle with **one empty position**. Players slide adjacent tiles into the gap and ultimately reassemble the recognizable image.
4. **Gameplay relevance:** An early-to-mid-campaign activity contributing to exploration and the Study unlock progression. The **Brass Key** (player-facing item name) unlocking the Study is the **proposed** reward, not yet independently finalized by the user; keep reward behavior configurable and do not prematurely create the key in Foundry.
5. **Storytelling:** No UI, item label, or flavor text should disclose the key's eventual destination. The main Sune statue retains its missing Scrying Bowl, Dust of Dryness pellet, water channels, and Undercroft entry sequence.
6. **Skill checks:** Do **not** prescribe Investigation/Perception DCs or exploration checks yet; the user expressly deferred them until map contents are established.

## 3. Browser-game functional acceptance criteria (prototype)

- Render one visually contiguous 3×3 image divided into eight numbered-internally tiles and a visible blank cell; **player-facing tiles should depict image fragments, not numbers**.
- Permit only orthogonally adjacent tile moves into the blank; ignore nonadjacent selection.
- Create scrambles by valid random moves from a solved state so each shuffle is mathematically solvable (or verify inversion parity if another shuffling method is used).
- Detect solved state by exact ordered tile identity, not approximate image matching; report completion once and disable duplicate award events.
- Allow reset/restart for prototype testing and maintain no reliance on network calls.
- Support mouse and touch/pointer interactions; provide keyboard-accessible controls if feasible.
- Provide a static image fallback if Pixel Board integration isn't ready. Do not block the engine on that integration.
- Keep art source separate from puzzle state and render logic. Define a minimal state schema (tile permutation, blank position, solved flag, version), and validate loaded state.
- Do not bake a reward or a Foundry mutation into UI code; emit or expose a controlled `solved` event/callback as a later adapter seam.
- Test a known solved state, legal move, illegal move, solvability of many shuffles, solve detection, reset, and a full simulated solve path. Provide exact test outputs and version information.

## 4. Point Board evidence / integration boundary

Attached `index.html` is an **art editor**, not a puzzle engine. Its front-end data uses `format: "regionwright.point-board"`, `formatVersion: 1`, board `width`/`height`, up to 16 palette entries, and layers with frames of `[x, y, paletteIndex]` active cells. It provides canvas rendering, drawing/erasing, animation preview, JSON import/export, and PNG frame export. It has no verified built-in drag/slide puzzle, shuffle solver, lock/reward adapter, or Foundry synchronization.

**Suggested exploration, not accepted integration architecture:** Export a composed Sune portrait as PNG from the Point Board; slice it into nine equal visual regions at render time. Keep a plain image option for early prototyping. If using point-cell data directly, first document image-to-tile clipping or rendering strategy and performance constraints. Do not replace the existing Point Board editor or change its file format without a separate compatibility review.

## 5. Scope limits / safety

- Prototype and test **locally**, with reversible files. No live Foundry Scene/Item/Region/Module modification or claim of Ready-to-Play without exact authorized runtime, approved adapter, GM checks, test receipts, and authoritative reread.
- Repository `main`, `AGENTS.md`, active program slice, and reproducible knowledge database retain governance. Consult relevant accepted rules before implementation or promotion.
- Avoid modifying the canonical module, active roadmap, or existing editor during initial prototype unless the accepted workflow/active stage permits that step. Report proposed interface changes separately.
- Preserve source history and precise file paths/hashes in the work receipt.

## 6. Requested deliverables from Regionwright

1. A self-contained interactive HTML/JavaScript proof-of-concept (or appropriately modular local source) with an embossed Sune portrait placeholder/asset and the 3×3 puzzle.
2. A small functional test harness/results demonstrating deterministic valid moves, valid scramble, success detection, and duplicate-completion prevention.
3. A short Point Board feasibility note: recommended asset export path, constraints, and whether the existing editor can be reused unmodified.
4. A compact receipt: changed files, source/version, validation evidence, unresolved Foundry adapter requirements, and next recommended integration step.

## 7. Campaign dependencies to preserve

- **Study gate:** Brass Key → Study. The Study contains the note with code **587** for Donovan's Shack lockbox; unlocking it gives access to the sluice hand crank, allowing the pond to drain.
- **Other Study reward:** Tiny Key → grandfather clock face → oversized chimney-clock hour hand.
- **Pond branch:** Drain pond → spare Weathered Key (basement) → father's workshop → aqueduct handle.
- **Clock branch:** Hour hand + attic minute hand → climb through upstairs windows to roof → set chimney clock to **12:00 noon** and press center button → replacement aqueduct gear.
- **Aqueduct door:** Shattered gear fragments at foot of door; insert replacement gear and workshop handle to open.
- **Final shrine:** Restore late-acquired Sune Scrying Bowl and match Dust of Dryness pellet; opens Undercroft. The sliding portrait must not bypass this final gate.

## 8. Open decisions requiring user/Foreman review

- Exact placement, size and physical presentation of sliding portrait within Memorial Clearing.
- Final portrait asset, rendering technology (ordinary texture or Point Board), and tile materials/lighting.
- Whether **Brass Key** is definitively the sliding puzzle's reward; what physical compartment opens on success.
- Whether game state persists across players/reconnects and exactly who receives a reward.
- Foundry bridge/adapter integration and GM-only visibility/authority design.

**Design principle:** A charming, discoverable mid-game mechanical puzzle that subtly fits Sune's memorial space while never spoiling the endgame statue puzzle.
