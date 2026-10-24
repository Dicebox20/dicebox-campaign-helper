# Cabin in the Ashen Veil — 18 newly installed background-only Foundry Scenes

**Date:** 2026-10-23 Pacific (batch performed at approximately 22:00 America/Los_Angeles).
**Owner request:** Install all currently approved, ready map backgrounds, explicitly leaving **every new Wall and door for the owner to place manually in Foundry**.
**Native execution outcome:** `COMPLETE_VERIFIED` — **18/18** new Scenes, **20** campaign Scenes total.

## Runtime and exclusions
- Target: `http://127.0.0.1:30000/game`, world `cabin-in-the-ashen-veil`, Foundry `14.367`, dnd5e `5.3.3`.
- User: elected active `Gamemaster 2`; both preflight and each Scene's macro validated current origin, world and active GM.
- Approved exact source PNGs were verified by byte count, PNG IHDR dimensions and browser WebCrypto SHA-256 against the shipped archival manifest prior to each Scene creation.
- All **18 Scenes have one explicit native Ground Level** with an owner-approved background, provisional aspect-preserving gridless `battlemap-120` footprint and `active:false`; **zero Walls, zero doors, zero Regions, zero RegionBehaviors** in each **at installation readback**.
- All 18 builds separately conformed to `dicebox-scene-injector-build/v2`, with exactly one JS macro per Markdown and validator PASS on all.
- Executed once in manifest-backed order. Single batch Bridge request `cav-create-18-owner-wall-empty-shell-scenes-20261023-v1`, status succeeded, 18 per-Scene receipts `READY_FOR_OWNER_WALLS`; aggregate `COMPLETE_VERIFIED`.
- **Never modified or overwrote** prior H-G06 Great Room (`CAVHG06GreatRoom`) or EXT-01 Carriage Yard (`CAVEXT01Yard0001`). Native preread verified manually added `H-G06 - Grandfather Clock` Region was present, and native final read confirmed it remained present. Preflight yard Wall count 21 had changed to 7 by final read, potentially due to independent owner edits; batch installer created no Walls or edits to that existing Scene. Do not infer the author/cause of that separate edit.
- Pond **EXT-02** is one Scene using approved FULL water art. DRAINED variant was verified and recorded in Scene metadata as an alternate path, not a separate Scene or activated dynamic change.
- Forest Maze FM-01..04 is one combined scene; Bathhouse BATH-01..08 surface is one Scene; Aqueduct AQ-01..02 is one Scene. Nine Sune Grove stages remain nine individual Scenes as approved.
- **No gameplay implementation:** no automatic scene transition, wall/door, Puzzle Region, loot, triggers, lights, actor placements, player activation, special tiles, or water-state scripts. The owner explicitly owns wall placement and visual inspection.
- Scene dimensions are **provisional** and subject to owner wall/scale inspection. Art approval is not approval of final physical house or landscape coordinates. The Great Room and Carriage Yard retain their prior provisional structures.

## Build and receipt artifacts
Full per-Scene BUILD macros, compiled asset hash/scale records, per-Scene state/verification receipts, and aggregate batch installation receipts committed atomically under:
`campaign-archives/cabin-in-the-ashen-veil/builds/background-only-batch-v001/`.

Keys in batch-index: AQ-01, BATH-UNIFIED, EXT-02, EXT-05, EXT-06, EXT-07, EXT-TRAIL, FM-UNIFIED, H-G02, SG-01 through SG-09.

**Result:** All approved background images presently ready are installed for user-led wall placement; no further scenes should be invented for combined site feature cards. Await owner inspection before final scale certification, Region drafting or the deferred puzzle pass.
