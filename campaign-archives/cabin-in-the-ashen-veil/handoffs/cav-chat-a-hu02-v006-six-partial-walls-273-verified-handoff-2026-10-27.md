# Cabin in the Ashen Veil — Chat A H-U02 six verified structural Walls, partial safe perimeter

**Date:** October 27, 2026 Pacific, ~12:56–13:08. **Latest owner:** “continue.” **Scope:** Chat A early/midgame. Chat B solely owns late-game Undercroft and SG-01 Silver Tiny Key. Owner delegated creative and technical authority for Cabin; GM personally roleplays Crooked Man/haunts at checkpoints, implemented **last** and not puzzle gates. Complete all installations, then perform owner-requested comprehensive compatibility and real non-GM player acceptance.

## Current verified source and shared-world checkpoint

- Regionwright `Dicebox20/regionwright` branch `codex/cav-sune-integration-20261026`, **remote-verified HEAD `b136fb9fd64e2a16cfbafd3cd12d235dfe1aa778`**, parent `c3b35b0c0f6ade862c55993f91fad14adb242b8e`.
- Latest **273/273 Cabin source tests PASS**, 0 failures, 51 test files, five new geometry/safety tests.
- Authenticated original Foundry 14.367 `cabin-in-the-ashen-veil` elected Gamemaster 1: **47 Scenes, 250 Regions, 140 RegionBehaviors, 61 total Walls**. H-U02 `gGgUHlHdI7RFrbUh` has original **14 Regions**, owner-approved original image, **six** verified native Walls (previously zero), 2 original character tokens unmoved. Shared world counts include Chat B changes; **Chat A only added six H-U02 native Walls** this turn.
- [Regionwright source report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-hu02-v006-six-structural-walls-native-install-2026-10-27.md), [exact six-segment manifest](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/h-u02-v006-conservative-side-shell-structural-wall-manifest-2026-10-27.json).

## What was installed and what was not

Owner-approved H-U02 V006 actual art `Maps/cabin-in-the-ashen-veil/h-u02-upper-landing-owner-approved-textfree-v006-2026-10-24.png` was visually inspected on a scene-coordinate grid. Original 14 room/stair/attic interactive and arrival Region rectangles had already been reprojected onto V006; all five physical room doors and return routes remain original. Existing Foundry wall patterns on other scenes confirm ordinary fixed Walls use movement/light/sight/sound=20, door=0, ds=0.

Under owner-delegated approval, installed **six new original native Wall documents, no new Regions**:

| ID | Art-aligned segment endpoints (scene x,y) |
|---|---|
| `CAVHU02WALL00001` | west upper: (100,340)–(100,510) |
| `CAVHU02WALL00002` | west lower: (100,770)–(100,1540) |
| `CAVHU02WALL00003` | east upper: (1365,340)–(1365,510) |
| `CAVHU02WALL00004` | east lower: (1365,770)–(1365,1540) |
| `CAVHU02WALL00005` | north frame: (415,65)–(580,65) |
| `CAVHU02WALL00006` | north frame: (875,65)–(1080,65) |

All are normal **blocking Walls** (move/sight/light/sound 20) and **NOT Foundry Door Walls**, leaving original Nursery WEST and Guest EAST side passages and original three north door Region triggers unobstructed. Specific `dicebox-campaign-helper` flags identify build `cav-hu02-v006-partial-perimeter-walls-2026-10-27`, native object identities, source art and owner-delegated partial structural phase.

**INTENTIONALLY PARTIAL**: No SOUTH outer-shell closure, no southwest stair enclosure and no speculative diagonal north jamb completion. Why: two REAL existing H-U02 PC tokens currently sit south of the painted lower boundary, Glow (604,1495) and X'ul (648,1654) top-left, grid 220, centers at (714,1605) and (758,1764). A closed south Wall could trap them outside playable floor. The owner may later arrange genuine token/player traffic clearance, then a separately inspected original wall-install batch can close the lower/diagonal perimeter. **Never claim walls fully installed** or move player tokens solely to pass a test.

## PREPARE / BUILD / VERIFY / evidence

1. Read original H-U02 V006 art enlarged with a scene-coordinate grid. Read-only inspected other installed Foundry normal Wall schemas and checked all 14 original Region rectangles and original token centers.
2. Authored machine source manifest above and 5 pure geometry tests, confirming all six stable 16-character IDs, no Region crossing, genuine doorway gaps, and no bottom closure; **273/273 complete source PASS** before world mutation.
3. One exact original elected-GM `Scene.createEmbeddedDocuments("Wall",six,{keepId:true})` batch; strict world/GM/map/14 Region/six-id/zero-existing-Wall/2-token/still-locked-Sophia+Attic/no-attic-reward/current player Yard preflight; native same-call six object readback `native-six-walls-gm-verified`; entire original Region documents SHA before/after identical and original tokens unchanged.
4. Independent **second connected elected-GM read-only postread PASS**, exact six physical Walls with all blocking properties and provenance; zero intersections with any of the original 14 Region rectangles; protected Sophia entry, Attic entry and Attic return all still DISABLED; player tokens unmoved, H-U02 non-GM viewer absent. No real movement/collision or broad compatibility acceptance performed.

Machine receipts on authorized host:
- `utility-harness/artifacts/cav-chat-a-hu02-owner-approved-six-partial-structural-walls-install-20261027.json` (native same-call).
- `utility-harness/artifacts/cav-chat-a-hu02-six-partial-structural-walls-independent-GM-postread-20261027.json` (independent PASS).

## Continuation

**Do not duplicate** `CAVHU02WALL00001`–`00006`, modify the original Region/Behavior identities, wall off Nursery/Guest, relabel original locked Sophia/Attic actions or force a Foundry reload during Chat B Undercroft installation.

Next safe Chat A priority: another genuinely missing early/midgame installation or a separately PREPARED structural plan for H-U02 lower shell/diagonal wall segments when player access can be preserved. Real non-GM wall collision and scene traversal test only during final owner-requested integrated campaign acceptance after all installations. Earlier Forest Well new handler remains cached in active module API until **coordinated reload with Chat B**, unlike these direct native Wall creations that do not require a reload.

**End state:** Six owner-delegated normal solid Walls installed and independently verified; **PARTIAL SHELL**, 273/273 source PASS, zero player rewards/haunts/late-game mutations, two protected PCs unmoved.
