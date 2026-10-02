# Tram Rush Hour Smoke Kit — 2026-08-22

## Change card

| Field | Current slice |
| --- | --- |
| Outcome | A GM can open and play the canonical six-move Tram Rush Hour board in one local dialog. |
| Acceptance observation | The board renders; only legal moves are offered; the known six-move route reaches the exit; reset starts a fresh session. |
| Owner | DiceBox Campaign Helper Foreman. |
| Target / authority | Local source only. No Foundry world, Scene, Region, TileDocument, Macro, socket, or player authority is involved. |
| Allowed scope | A pure browser-safe board model, a `DialogV2.wait` adapter, focused tests, and the DiceBox module import. |
| Deterministic check | Canonical solver stays six moves; dialog configuration exposes no Scene/Region dependency and uses the official Foundry v14 `DialogV2.wait` render callback. |
| Live check | Deferred until the local slice passes and the user selects a single GM smoke test. |
| Stop / recovery | If the dialog throws twice in the same Foundry runtime class, stop staging and macros; capture the exception, reproduce it with the standalone adapter, consult the KB and Foundry v14 DialogV2 documentation, then patch only that reproduction. |

## Non-goals

- No Ballad or fixture staging, reload, macro creation, or Foundry document mutation.
- No RegionBehavior, player dispatch, Scene activation, map geometry, Tiles, or campaign progression.
- No claim that this local slice makes the Tram Scene playable.

## Model contract

The session is derived from the canonical `@dicebox/core` Tram board with all six vehicles operational. It is memory-only and resettable. The exit vehicle is `dbx:tram:x`; the verified minimum route remains six moves:

`b -1`, `c -3`, `o +3`, `r -2`, `q +2`, `x +3`.

The adapter must not subclass `ApplicationV2` or write `state` / `options` instance properties. It uses the documented Foundry v14 `DialogV2.wait` factory and its render callback for interactive controls.
