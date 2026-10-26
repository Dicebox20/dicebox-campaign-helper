# Cabin in the Ashen Veil — Chat A Study/587 Crank → Sluice Stage Safety Handoff

**Date:** 2026-10-26 Pacific, ~16:05–16:15. **Owner:** "Lets continue."
**Workstream:** Chat A owns early/midgame, source integrations and live Foundry. Chat B independently owns isolated late-game source/tests and must not edit Chat A's Crank/Sluice/Waterworld files.
**Classification:** source FIX BUILT, installed source SHA verified, **95/95 tests PASS**, live GM world state read-only verified, **new event-handler runtime NOT YET RELOADED** at low free system RAM. No actual ordinary-player gameplay testing or campaign story-state write.

## Latest authoritative decision and status
Owner approved **Rose, Sun, Moth, Thorn** for the three original Skyrim-inspired Rosewater rings. Canon answer outer 90°, middle 270°, inner 180°, i.e. [1,3,2]. One existing unified Bathhouse filled/drained Scene pair, not old separate BATH-03/04 Scenes. Native Rosewater Region Behavior `Scene.8yLMRDvxyw58dydh.Region.CAVBROSEWATER001.RegionBehavior.CAVROSEWATERSCR1` stays **DISABLED** until genuine original Crank fit and synchronized Pond+Bath drainage. The original Sune's Scrying Bowl world Item `Item.1n5LONw3nYIy61O9` remains unique and final on-map pickup site undecided. Crooked Man actor/first chase and ordinary-player acceptance still owner-deferred.

Current source project branch: `Dicebox20/regionwright` **`codex/cav-sune-integration-20261026`**. This turn's pushed exact commit **`bd9969f6f5d99922db7fc86348c7ba1297af9c32`**, read back via origin ls-remote. Prior Chat A HEAD `0a0a2896c096d8e4159fbb1af479bda581cfe2f1`. Chat B must use independent late-game worktree/branch and discuss merges, not write the shared source checkout or live Foundry.

## Original progression and INSPECT finding
Read original `modules/regionwright/scripts/studio-cav-587.js` (GM Study note and one-time Donovan 587 lockbox award), `studio-cav-sluice.js` (native viewed closeup and original Crank fitting), `studio-cav-water-controller.js` (GM-water synchronized Pond/Bath open/close), and `studio-cav-water-state.js` (strict two-body stage reducer). Original Crank source UUID `Item.g3VYdgc1qkgkHGvn`. Real Study Key → 587 note → Donovan's 587 box → player-owned authentic Crank → physical fit → safe open stage has NOT happened in current world.

**Discovered a second player-facing contract bug:** after previous turn's Crank client/GM reach correction, the client offered **Open/Close Sluice** whenever a selected character was within original **400px** of the Sluice rectangle center, but the elected-GM water controller independently REQUIRED its center to satisfy `region.testPoint`, i.e. **inside the smaller native original x1843,y2655,w435,h325 rectangle**. A player near-but-outside could see Open/Close but be denied. Importantly, expanding GM water eligibility to 400px would also widen the Pond's hazard-exempt safe zone and introduce drowning/water safety risk. Do not expand it.

## SOURCE BUILD: match stage authorization, preserve original safety
Changes in `modules/regionwright/scripts/studio-cav-sluice.js`:
- Added `export function isSluiceStageTokenAtControl({token,scene,region}={})` returning true only if the prior exact 400px valid-proximity guard **AND** the original native Region `testPoint({x,y,elevation:0})===true` pass. Missing Region/shape, invalid grid/token or absent testPoint fails closed. This does not write world state.
- Player closeup now distinguishes **Crank fitting within 400px** from **OPEN/CLOSE only while actually inside the small native control Region**. If a Crank is installed and a selected character is near but outside the Region, the popup gives an instruction to move inside the control area and offers only Close instead of misleading Open/Close. Remote closeup inspection remains allowed; original first-click Crank offer/reward is unchanged.

Change in **Chat A-owned shared** `modules/regionwright/scripts/studio-cav-water-controller.js`:
- Imports the same `isSluiceStageTokenAtControl`. Both elected GM open/close authorization and the safe Pond token list now use EXACTLY that same stage predicate. Preserves conservative Pond-hazard occupancy, original Crank/587 owner provenance, synchronized visuals, Trail↔Bath safe return and AQ/Forest Well route interlock.
- No new GM flags, Item, Region, Scene or native Behavior. Original Sluice Behavior `CAVEXT02SLCBEH01` stays enabled, Rosewater Behavior `CAVROSEWATERSCR1` stays disabled.

Added **four source-only tests** `tests/cav-sluice-stage-control-parity.test.mjs`: 400px fit allowed outside original Region but stage denied; inside Region accepted; missing/rejecting native Region and invalid token denied; static code contract requires GM authorization, Pond safe token list and client popup use the same helper. **Full source regression suite 95 PASS / 0 FAIL**, up from 91. `node --check` passes. Both revised installed `regionwright` module scripts SHA256 match the respective tracked sources:
- Sluice JS `F196016EDDA9679669974271BE525D2131EBEA511509EA7319B34C50C059748E`.
- Water controller JS `533AA2C6483C8E8898250EFF5F47DFA418D67111F39B9B9CA7DF1B64F05AF6CA`.

## Live GM world state after source copy — NOT a post-code reload
Host free physical memory was only ~**1.0 GiB** during this turn, after prior Dev Chrome stability issues. Deliberately **did not issue a Foundry game page reload** to avoid closing user's browser. A **read-only** CDP call to current game tab confirmed `game.ready=true`, world `cabin-in-the-ashen-veil`, Foundry 14.367, elected Gamemaster 1; actual Sluice Crank install flag `null`, water state `null`, synchronized Sluice transaction `null`, original Sluice native `CAVEXT02SLCBEH01` enabled, original Rosewater `CAVROSEWATERSCR1` disabled, owner symbols `rose,sun,moth,thorn`, ring session null and exact ChatMessage count 54. Receipt: `C:\Users\rujie\AppData\Local\Programs\Chrome for Testing Dev\utility-harness\artifacts\cav-chat-a-water-stage-client-gm-contract-native-state-20261026.json`.

**Do NOT claim the NEW client or GM registered event-handler code is currently reloaded/PLAYTESTED.** It is verified on disk and the prior active elected GM session was read-only inspected. When resources allow, one bounded guarded page reload is needed to verify the updated source in runtime; do not create or simulate actual Player tokens or force water-state flags.

## Next intended Chat A task
After one stable elected-GM reload, prepare/verify negative/reconciliation scenarios for authentic original Story Key→587→Crank→Sluice:
- Client standing just outside rectangle but within 400px with genuine Crank: **Install** allowed; after fitting, **Open/Close** not offered until in original Region; Stage GM and safe token set share exact predicate.
- Inside native Region and all legitimate approvals: stage can proceed only if no Pond hazard tokens outside original safe area, no Bath/AQ occupants, original full/dry map/Trail return routes verified, no reserved Crank/water transaction. Preserve once-only Item receipt and original source `Item.g3VYdgc1qkgkHGvn`.
- Real player Study/587 note and lockbox requires original Brass Study Key, proximity and ownership, and the one-time GM reserved→done grant. Never manufacture `cavStudy587Learned`, `cavDonovan587LockboxClaim`, `cavSluiceCrankInstall`, `cavPondBathWaterState` or `cavSluiceStageTransaction` to skip real story.
- Continue source-only inspections until owner authorizes eventual ordinary-player full acceptance. Crooked Man actor / first chase / Rosewater activation remain pending original prerequisites.
- Current evidence and owner rule require appending separate Chat A chronological checkpoint/handoff after bounded ~25-minute turns, avoiding Chat B shared-file collision.

## Durable sources
Regionwright commit **`bd9969f6f5d99922db7fc86348c7ba1297af9c32`** scoped 6 files: `studio-cav-sluice.js`, `studio-cav-water-controller.js`, new test, report `docs/cabin-ashen-veil/chat-a-sluice-stage-control-parity-2026-10-26.md`, JSON manifest counterpart, `regionwright-puzzle-update-log-2026-10-26.md`. No unrelated files staged or source history rebased. Git origin exact head verified. The repository includes personal-local untracked files; do not mass-add them.

**Chat B integration update:** Base your late-game upstream water receipt contracts on actual original Sluice authority, not a broad 400px safe radius. This is a shared API contract correction; Chat B is NOT authorized to edit or deploy live Sluice/Water components.
