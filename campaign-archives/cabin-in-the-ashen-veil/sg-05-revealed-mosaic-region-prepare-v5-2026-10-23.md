# SG-05 — Sune's Memorial Clearing | Mosaic Reveal and Discovery Region PREPARE v5

**Date:** 2026-10-23  
**Authority:** Owner-directed refinement: “we'll make it so it's clearly visible to the players once the four statues have been activated. After the statues we'll have a region behind it activate saying ‘A mosiac was revealed on the back of the statue’ or something similar.”  
**Status:** **OWNER-SELECTED DESIGN / PREPARE ONLY** — no Foundry write, no map render, no runtime test.
**Supersedes only** earlier v4 suggestions for how to signal the discovery. Keep the upright standing Sune figure, devotional memorial stone rather than bench, child grave, rear/NORTH stone panel, four cardinal paths, and all established state/item gates unchanged. Source: [SG-05 PREPARE v4](./sg-05-memorial-clearing-prepare-v4-standing-sune-2026-10-23.md).

## Two coordinated pieces: visible artwork + player-facing Region

**Trigger:** fourth correctly wound corner bust advances shared sequence to completion (SW `SG-07` Rose → NE `SG-03` Star → NW `SG-01` Moon → SE `SG-09` Sun). Call semantic transition `grove.bustsSolved=true`. Completion remains permanent and repeat-safe.

**First effect — visibly reveal the mosaic:** Swap/activate a **separate mosaic Tile/visual overlay** covering the closed rear/NORTH panel on Sune's pedestal. The exposed **3×3 stone relief** is unmistakably distinct from the dormant seam stonework and readable at VTT zoom. This state persists to players visiting or re-entering SG-05. The entire statue stays upright on a low plinth with clear ground space to circle around behind it; the relief is on its **rear pedestal**, not in a freestanding bench or displaced grave.

**Second effect — reveal-notification Region:** Enable a *native Foundry Region* in the token-accessible strip **directly behind/north of Sune's pedestal**, outside collision; this Region becomes eligible only when `grove.bustsSolved=true` (and ideally `!grove.reliefSolved` while discovery remains meaningful). On **player-controlled token entry into that rear examination space**, display a concise **player-facing** popup or dialogue, not GM-only output:

> **“Behind Sune's statue, a concealed stone panel has shifted, revealing an intricate sliding mosaic.”**

The message is a **discovery cue**, not the puzzle itself; players approach the now-visible Tile and explicitly interact to open the 3×3 sliding UI. No Perception check is required.

## Region contract for later Foundry implementation

| Aspect | Planned requirement |
|---|---|
| Semantic zone | `SG-05.region.mosaic-discovery` behind/north of pedestal |
| Activation | Global persistent `grove.bustsSolved=true` after final correct corner Winder action |
| Region enter | A player-controlled token moves into rear examination band; explicit intent to inspect can also trigger a manual discovery fallback |
| Visibility | Revealed mosaic Tile visible to everyone regardless of notification |
| Notification target | Player clients controlling the entering token, not exclusively GM |
| Anti-spam | Show initial announcement once per **player/user**; preserve independently of token shuffling/scene re-entry; optionally allow re-inspection via normal puzzle Tile/Journal |
| Already standing behind statue | If token occupies region when puzzle changes state, image visibly changes; direct inspection also communicates discovery, avoiding a missed notification from a missing enter event |
| Duplication/runtime | Guard on actual gameplay movement, suppress scene-load/Region-registration/import activation and stage-swap triggers; no reward grant or puzzle auto-solve from entering |
| Puzzle interaction | Clicking revealed Tile opens LOCK-02 3×3 slide UI, with existing deterministic initial/goal layout and separate 1,000 gp / Brass Study Key claims |
| Stage swap | Dormant and activated SG-05 scene variants, if used, share the same global solved state and consistent Region conditions; don't reset discovery |
| Accessibility | Tile inspectable manually even if the player missed the brief popup, and a Journal/Note can restate what appeared |

### Why this arrangement works

- The **visible overlay** is the reliable clue; the **Region text** reinforces it when players go behind the statue.
- The fourth Winder activation need not issue a surprise global spoiler/dialogue while players are still at the SE corner. On returning to SG-05 the artwork shows the change.
- A Region **alone** would not make the mosaic graphically visible; the changed Tile is part of the mandatory build.
- Sune's empty cupped hands and later Bowl+pellet activation are an **independent puzzle chain** and must not be enabled/solved by discovering the mosaic.

## PREPARE-to-render and VERIFY hooks

**Base map paint:** standing Sune on low plinth, rear pedestal panel with closed subtle stone seams, accessible stone strip north of plinth, old memorial dedication stone west, one child grave southeast, four N/W/E/S paths, dry dormant channels and neutral lighting. The **revealed relief** is planned as a **separate foreground/state Tile** (or distinctly approved post-activation background variant only if required by geometry), not permanently painted open on the base map.

**In future Scene BUILD/Regionwright workflow:** verify script behavior schema and event authority against the actual installed Foundry v14/module versions before writing. Expected tests: pre-solve hidden overlay+inert Region; all four correct activates visible mosaic; incorrect order resets with no reward; entering rear zone alerts only controlling player and once; GM not sole recipient; already-standing token still can inspect; repeated entry quiet; later returns preserve state; solving puzzle opens correct single-use rewards; bowl/pellet remains independent. Record independent BUILD/VERIFY receipts at implementation time.

**One-map discipline unchanged:** reopen this v5 and latest scene register before each paint render; generate one independent inclusion-only map prompt; immediate honest inspection; stop for owner PASS/REDO. No render requested by this design-only turn.
