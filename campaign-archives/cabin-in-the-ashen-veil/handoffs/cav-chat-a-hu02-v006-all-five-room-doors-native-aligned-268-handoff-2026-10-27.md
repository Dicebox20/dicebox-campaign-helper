# Cabin in the Ashen Veil — Chat A completes original five-door H-U02 navigation geometry

**Date:** October 27, 2026 Pacific afternoon. Owner instruction: “Lets continue”. **Workstream:** Chat A early/midgame. Chat B late-game/Undercroft and SG-01 Silver Tiny Key untouched. Cabin owner has delegated creative/technical approval to assistant. Crooked Man/checkpoint haunt encounters last and owner personally roleplays. Full combined compatibility and non-GM player testing AFTER installation.

## Current remotely verified source checkpoint

Regionwright repo `Dicebox20/regionwright`, branch `codex/cav-sune-integration-20261026`, verified HEAD **`c3b35b0c0f6ade862c55993f91fad14adb242b8e`**, previous `8f2cac8cea2c20305bc99472f6b644186761d4d4`. **268/268 Cabin source regressions PASS**, zero failures across 50 files; three new side-door geometry/canon tests. This turn changed only a new test file, technical report + JSON metadata, chronological source log, and **four native shape rectangles in existing original Foundry Scene**. No JavaScript runtime/Foundry module code edits, no reload, no new scenes/regions/behaviors or player progress.

[Full source/installation report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-hu02-v006-nursery-guest-side-doors-native-2026-10-27.md).

## Critical correction to stale H-U02 plan

The owner-approved V006 Upper Gallery artwork **DOES contain five physical doors**. An enlarged **read-only crop of the WEST and EAST wall panel details** revealed dark wooden side-door leafs and jambs missed by previous whole-image summary. Original H-U02 PREPARE v003 explicitly places **Nursery to WEST/SW** and **Guest Bedroom to EAST/SE**. The previous Chat A `8f2cac8` handoff saying Nursery and Guest had no visibly compatible doors is **superseded**. Approved V006 map asset, Scene and all existing Region IDs remain unchanged.

Original Scene `gGgUHlHdI7RFrbUh` is 1440×1800, grid 220, 14 original Regions, zero native walls. With 10 original Regions relocated in previous `8f2cac8` turn and 4 more this turn, all five room-door routes, Great Room stairs, concealed Attic Hook, and reciprocal landing Regions now match visible/approved player-facing features at **native-configuration** level.

## Four actual original native Regions corrected in place

| Region | Before (x,y,w,h) | Now (x,y,w,h) |
|---|---|---|
| Nursery WEST source `aZ8eagmbvZUcPJ0g` | 1503,815,150,145 | **80,530,230,210** |
| Nursery return landing `GOxaHb5OuQwPj6IC` | 1396,945,120,120 | **360,560,220,200** |
| Guest EAST source `M2fZhuvFmw1yZQS9` | 642,773,150,145 | **1110,535,235,205** |
| Guest return landing `dMdq36QOZUhvttza` | 708,863,120,120 | **850,550,220,200** |

Original Nursery outgoing enabled Behavior `nTpDUuUliqNzcwRs` and original destination `Scene.CAVHU01Scene0001.Region.CAVB1656B3C61F9A` intact. Original Guest outgoing enabled Behavior `jB3CaIKquyf29FwX` and destination `Scene.CAVHU03Scene0001.Region.CAVB1B94A45D7219` intact. Original Nursery return `uGz9xpoIXm9mTvvf` and Guest return `zoYviwvwVSJ1kMZ4` remain enabled and target the original preserved H-U02 landing UUIDs. Previous Sophia locked and Attic Hook-gated travel remain deliberately disabled until genuine progression.

## Exact native verification

- One tightly bounded elected-GM `Scene.updateEmbeddedDocuments("Region")` update after preflight verified original world/GM, artwork, original IDs/shapes/behaviors/room return destinations, no other Region collisions, original two PC token positions, active player viewing Yard not Upper Gallery.
- Same-call native write/readback **`native-four-original-side-doors-pass`**. Receipt `utility-harness/artifacts/cav-chat-a-hu02-v006-side-nursery-guest-four-region-guarded-native-install-20261027.json`.
- Independent second read-only elected-GM postread **PASS**. Original 14 H-U02 Regions, **ZERO out-of-scene Regions** (was 8 before previous and current repair), no overlaps on new triggers, exact original outgoing + incoming teleport source/destinations and character token positions, no changed Behaviors/flags. Shared world 47 Scenes / 250 Regions / 140 Behaviors (other additions were Chat B; Chat A added zero). Receipt `utility-harness/artifacts/cav-chat-a-hu02-v006-nursery-guest-independent-gm-postread-20261027.json`.
- The first read-only independent-check script had a JS syntax mistake before execution (missing close of outer reduce), corrected; independent proof PASS. No world write tied to that error.

## Further work / safety

H-U02 **native doorway/return Region geometry fully aligned**. Do NOT rerun older H-U02 V005 installer, delete/recreate the original Regions, or reset their positions to previous out-of-scene rectangles. Historical `artStage=PROVISIONAL` flags remain original preserved metadata and do not supersede current receipts. Original owner-approved PNG unchanged.

**NOT yet player-tested:** actual non-GM click/token transition, landing, collision/line-of-sight and cross-module integration will be tested when owner says all content installed. H-U02 still has **zero walls**, which is a separate established Scene feature-installation workflow affecting many other scenes. Owner may authorize that separately as part of remaining installation; do not invent walls by assuming geometry from teleport Regions. The Forest Well installed JS handler remains pending safe coordinated reload with Chat B, unlike these shape-only H-U02 edits.

Next Chat A work should move to a different confirmed missing early/midgame installation item or properly plan H-U02 wall/collision processing after feature inspection; do not circle back to completed H-U02 doors.

**End state:** H-U02 owner-approved five door physical access geometry + original landing routes ready for later player test; 268/268 source PASS; native + independent GM verification PASS; no fake story flags or player Items.


## LATER OWNER-DELEGATED STRUCTURAL INSTALLATION — six Walls installed; shell still partial

**October 27, 2026 Pacific.** Chat A installed **SIX native ordinary blocking Wall documents** (original stable IDs `CAVHU02WALL00001`–`00006`) in H-U02 on the owner-approved V006 background, leaving the five original room-door routes and all 14 Regions untouched. **273/273 source PASS**, original elected-GM native write/readback **PASS**, independent second read-only elected-GM readback **PASS**. Regionwright remote verified head: **`b136fb9fd64e2a16cfbafd3cd12d235dfe1aa778`**. World now has **61 Walls total**, of which six belong to H-U02 (formerly zero).

This **supersedes the earlier statement that H-U02 has zero Walls**, but it does NOT mean a complete perimeter. The **lower/south wall and north diagonal frame remain intentionally pending** because two existing H-U02 PCs have center coordinates south of the painted lower boundary and could be trapped by full closure. Existing characters were NOT moved. No new Door Wall was installed through original portal Regions; all five original teleport routes remain as previously aligned; original Sophia and Attic gates remain intact.

Read [current authoritative partial structural handoff](./cav-chat-a-hu02-v006-six-partial-walls-273-verified-handoff-2026-10-27.md), [source report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-hu02-v006-six-structural-walls-native-install-2026-10-27.md). Final wall completion, genuine non-GM movement/vision testing and global compatibility diagnostic are not yet completed and remain separately gated by owner install-first sequencing.

