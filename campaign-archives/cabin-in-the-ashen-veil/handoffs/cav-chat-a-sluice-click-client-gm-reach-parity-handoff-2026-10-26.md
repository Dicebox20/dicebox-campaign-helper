# Cabin in the Ashen Veil — Chat A Original Sluice Click and Client/GM Reach Parity Handoff

**Date:** 2026-10-26 Pacific, approx. 15:49–16:01. **Owner:** "next please." **Role:** Chat A continues early/midgame and live Foundry; Chat B independently develops late-game source only.

## Executive receipt
Live elected Gamemaster 1 on Foundry 14.367 world `cabin-in-the-ashen-veil` verified Pond original Sluice control is installed, accessible for region-based static inspection, and visually separate from other Pond Regions. Original native `Scene.CAVEXT02Scene001.Region.CAVEXT02SLUICE01.RegionBehavior.CAVEXT02SLCBEH01` remains **ENABLED** with expected viewed/unviewed/deactivated events and original Regionwright handler. Sluice native Region rectangle **x1843,y2655,w435,h325**, center **(2060.5,2817.5)**, default owner visibility 2. All 7 other Pond Regions have **zero positive-area overlap** with this hotspot.

Original owner-approved static closeup `worlds/cabin-in-the-ashen-veil/assets/puzzle-closeups/ext02-sluice-gate-approved-crop-v001.png` exists on the owner machine, size **1,820,836 bytes**, SHA256 `6DEBD9622B021F1DFAE3091BFDB0C7343C94BD45BDB91CDE22DC99E03BBDF124`. No new art, Region, Item or duplicate Sluice handler needed. Evidence in utility harness `artifacts/cav-chat-a-sluice-click-overlap-live-readonly-20261026.json`.

## Source defect and exact fix
Original client-side `studio-cav-sluice.js` popup offered Install Original Crank/Open/Close based on inventory and current water state even if the selected owned character was far away, whereas original elected GM rejected real `install-crank` requests beyond **400px** of the Region center. This was a **misleading player preview**, not an actual GM authentication bypass.

In existing **Chat A-owned** `modules/regionwright/scripts/studio-cav-sluice.js`, added exported pure `isSluiceCharacterNearControl({token,scene,region})`, preserving original 400px selected-token-center reach/rectangle and enforcing finite positive token and grid/shape inputs. Both GM `playerAtControl` and player UI now use this same helper. A player may still inspect the static Sluice closeup remotely, but the modal only offers **Close** and tells them to select a nearby character until the distance rule is met. No changes to original Study/587→Donovan Crank provenance, item consumption, one-time ledger, water-stage authority or teleport logic.

New `tests/cav-sluice-client-proximity.test.mjs`: 4 focused tests (center and exact 400px boundary, 401px/remote rejection, malformed/absent token/shape/grid, nearby but outside the small rectangle) all pass. Full Cabin nonbrowser suite **91 PASS / 0 FAIL** (87 prior). Updated source+installed module match SHA256 **`3ADEA8FD254EEF7DF0BCFED0A787E359681549F72E2C5B0B67CCA8B454D6AEC5`**.

## Actual elected GM runtime readback
Performed ONE guarded Foundry page reload to pick up updated JS. Navigation reached exact `/game` but Playwright's DOMContentLoaded wait timed out; **did not replay**. Read-only independent check confirmed Foundry 30000 ON, Dev Chrome CDP 9224 ON, matching source/installed JS. A second **no-reload read-only** CDP call confirmed actual active elected GM `game.ready=true` on exact world and dynamic import of updated `isSluiceCharacterNearControl`: center token accepted; center+401px denied; original Sluice Behavior enabled, native Rosewater Behavior `CAVROSEWATERSCR1` still disabled and native symbol approval `rose/sun/moth/thorn` intact; Crank install `null`, water `null`, Sluice transaction `null`; original chat count 54 unchanged. The source is **LOADED AND GM RUNTIME VERIFIED**, though no real player-side closeup click test was executed. Receipt `utility-harness/artifacts/cav-chat-a-sluice-runtime-after-timeout-readonly-20261026.json`.

## Current authorized campaign barriers (unchanged)
- Study Key → Study 587 note → Donovan's 587 lockbox → original `Item.g3VYdgc1qkgkHGvn` Crank → physically fitted once → elected GM commits synchronized `cavPondBathWaterState` and `cavSluiceStageTransaction`. **All actual fitting/drain flags still NULL. No hand-set completed puzzle or fake player token.**
- Pending actual drained proof: Rosewater `CAVBROSEWATER001` remains native DISABLED, canonical [1,3,2] and owner-approved Rose/Sun/Moth/Thorn saved; original Sune Bowl `Item.1n5LONw3nYIy61O9` unique, its exact pickup fixture undecided.
- AQ gate/first Crooked Man chase/Forest Well remain staged disabled and original Crooked Man Actor/token + full ordinary-player gameplay testing were deferred by owner. Chat A cannot silently accelerate those.
- Chat B should remain isolated on its own Regionwright branch/worktree and never edit Chat A water, Sluice, first-chase or module registry code nor live Foundry. **New Chat A source integration HEAD `0a0a2896c096d8e4159fbb1af479bda581cfe2f1`**, pushed and remote branch readback verified. If Chat B branched earlier, explicit reviewed integration only.

## Next Chat A step / QA readiness
**Prepare genuine non-GM early/midgame acceptance, but do not execute until owner lifts the deferred player-test restriction.** Detailed planned assertions in source `docs/cabin-ashen-veil/chat-a-sluice-click-proximity-and-future-player-qa-2026-10-26.md`: remote closeup must not emit mutation requests, near token without original Item cannot Install, authenticated 587 provenance must consume only original Crank exactly once, safe open must synchronously switch both Pond/Bath and Trail, missing return/occupied scenes must fail closed, reload/GM handoff must retain unique state, then Pond/Bath pickups and Boiler/Rosewater QA. This is a **checklist**, not evidence that a player has done it.

## Durability and provenance
Regionwright source `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, exact pushed commit `0a0a2896c096d8e4159fbb1af479bda581cfe2f1`, five scoped files: `studio-cav-sluice.js`, new test, the source checkpoint and JSON manifest, dated project log. Local unrelated untracked files preserved.
- Source report: `docs/cabin-ashen-veil/chat-a-sluice-click-proximity-and-future-player-qa-2026-10-26.md`
- Machine JSON: `docs/cabin-ashen-veil/chat-a-sluice-click-proximity-and-future-player-qa-2026-10-26.json`
- Chronology: `docs/cabin-ashen-veil/regionwright-puzzle-update-log-2026-10-26.md`.

**Classification:** native hotspot geometry + GM click service INSPECTED, source client authorization UX FIXED, live GM readback VERIFIED, 91/91 pure tests PASS; real non-GM gameplay NOT EXECUTED.
