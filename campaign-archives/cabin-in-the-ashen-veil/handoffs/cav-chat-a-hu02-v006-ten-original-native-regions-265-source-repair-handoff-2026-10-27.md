# Cabin in the Ashen Veil — Chat A H-U02 ten original Region native installation handoff

**Date:** October 27, 2026 Pacific. **Owner:** “resume”. Chat A owns early/midgame; Chat B owns late game/Undercroft and SG-01 Silver Key. Owner delegated Cabin creative/technical approval authority, Crooked Man/haunts last and personally GM roleplayed. Full integrated compatibility and real non-GM acceptance AFTER content installations.

## Verified Regionwright source and Foundry checkpoint

- Regionwright `Dicebox20/regionwright` branch `codex/cav-sune-integration-20261026` **remote-verified HEAD `8f2cac8cea2c20305bc99472f6b644186761d4d4`**, parent `5f7841418268410fa39bcd3fab8b5d39f8d884f2`.
- Full source regression **265/265 PASS**, zero failures, 49 Cabin test files; four new geometry/regression files, 12 new cases.
- Actual original elected-GM Foundry V14.367 in `cabin-in-the-ashen-veil`, **47 Scenes**, shared-world census **250 Regions/140 RegionBehaviors** (independent Chat B growth; Chat A **created zero new Regions or Behaviors**).
- Approved image **unchanged**: `Maps/cabin-in-the-ashen-veil/h-u02-upper-landing-owner-approved-textfree-v006-2026-10-24.png`, physical 1086×1448, SHA256 `89F276946506C45CE9F9D6AA6B08664A7029D8BAF90A18D9AECD6758DC06CB6C`; original H-U02 Scene `gGgUHlHdI7RFrbUh` is 1440×1800, grid 220, 14 original Regions, 0 walls.
- Original H-U02 had **eight Region rectangles off configured scene bounds**. This turn moved **ten original Regions in place** (some were on the map but misaligned). Now exactly **two remain off-bounds**: Nursery source `aZ8eagmbvZUcPJ0g` and Nursery return `GOxaHb5OuQwPj6IC`. Guest entrance/return are on the scene but not aligned to a visible V006 door.
- Full [technical implementation report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-hu02-v006-ten-original-regions-reprojected-2026-10-27.md), adjacent machine JSON and chronological source puzzle log.

## Actual in-place native geometry changes

| Original H-U02 Region ID | Existing role | New rectangle (x,y,w,h) |
|---|---|---|
| `QunJFtigwByZndFV` | Great Room stair descent, original enabled teleport | (185,1405,260,185) |
| `xPTEg7ce2Bliz9M0` | Great Room incoming arrival | (170,1140,245,170) |
| `JP0OmkgPCTtQXxpn` | North-center Parents door, original enabled teleport | (620,80,220,150) |
| `CAVHU02PARENTAR1` | Parents return landing | (620,265,220,150) |
| `UV4YAstBe0WCuLcM` | Northeast Sophia **locked** door, original scripts retained | (1120,115,235,170) |
| `CAVHU02SOPHAR001` | Sophia return landing | (1100,345,230,160) |
| `yXYWpil5Y5Avmy70` | Northwest Dahlia Art Studio enabled door | (155,135,250,185) |
| `pL0UiBSyEoINWzZQ` | Art Studio return landing | (165,360,250,165) |
| `UOudBnxOGVlAlPoa` | Concealed hatch over southeast loose boards, real Hook gated | (1090,1460,265,180) |
| `1DJ0FCse01r9J5P5` | Central Attic return landing | (1065,1230,250,170) |

Image/Scene/Region/Behavior/Item/actor/flags/portal destination UUIDs/character token coordinates **preserved**. Sofia's original disabled teleport plus enabled gate/rescue scripts unchanged; original attic entry/return remain **disabled** until authentic Ladder Hook from Family Carriage DONE; hatch native script SHA256 `6b673d12f662c0ea95570c048e32e5f0bd7da359ef1699d2931d6862b02547d0`. All five reciprocal link destinations unchanged.

Four guarded owner-delegated elected-GM batches modified 2 + 4 + 2 + 2 shapes. Source-only geometry tests cover bounds, disjoint entrances and no self-overlap. Native preflights checked exact original shapes, background, no overlaps with other Regions, original two character tokens not in target, and one active non-GM viewer in Yard (not H-U02).

## Attic write reconciliation — retain precise status

The original **attic native write DID occur** and the original same-call installer reported **`native-attic-reconcile`** because its test compared a before return-Behavior object containing `type` to an after object accidentally OMITTING `type`. That is a comparison schema defect. Assistant correctly stopped without repeating writes or rollback. A completely separate, independent read-only elected-GM verification inspected after coordinates, original source SHA and disabled portals, return UUID, unchanged other Regions and unchanged PC tokens: **PASS**. Preserve the uncertain original receipt and independent reconciliation evidence, rather than silently editing history.

Host artifact receipts under Chrome for Testing Dev `utility-harness/artifacts`: `cav-chat-a-hu02-v006-original-staircase-native-reprojection-20261027.json`, `cav-chat-a-hu02-v006-stairs-independent-gm-postread-20261027.json`, `cav-chat-a-hu02-v006-parent-sophia-four-native-region-update-20261027.json`, `cav-chat-a-hu02-v006-dahlia-studio-native-reprojection-20261027.json`, `cav-chat-a-hu02-v006-concealed-attic-native-reprojection-20261027.json`, `cav-chat-a-hu02-v006-attic-reconciliation-independent-gm-readback-20261027.json`, and final **`cav-chat-a-hu02-v006-ten-region-independent-final-readback-20261027.json` PASS**.

## Remaining H-U02 design/work boundary

**Do not call Upper Gallery fully finished yet.** Only 3 obvious V006 physical room doors exist; they now serve Parents, locked Sophia and Dahlia Studio. The original **Nursery** door/return remain off-scene, and the **Guest** door/return are misaligned to the latest approved artwork. Do not blindly move enabled Nursery or Guest teleports to bare floor, infer extra painted doors, copy superseded V005 installer or erase canonical destinations. Resolve using established PREPARE/RENDER/INSPECT/BUILD map workflow or a clearly documented, GM-approved haunted-house concealed door mechanism under the owner's existing delegation. Original 0 walls untouched, and actual player collision/teleport testing remains deferred per owner.

The previous Chat A Forest Well independent-from-Crooked-Man source/native installation remains available (original source commit `f8542fe`), with **active module cached handler pending coordinated reload with Chat B**. H-U02 Region-shape changes themselves do not require source/module reload. Do not touch Chat B Undercroft/Silver Key or launch any haunt.

**End state:** Ten original H-U02 Regions reprojected, fully separate final elected-GM readback PASS, **265 source PASS**, two Nursery Regions and Guest art mismatch outstanding; **no real player acceptance yet**.


## SUPERSEDING OCTOBER 27 UPDATE — V006 has two real side-wall doors; H-U02 navigation geometry complete

**Later actual native installation and owner-delegate artwork reinspection supersede the unresolved Nursery/Guest recommendation above.** Enlarged read-only inspection of the same unchanged owner-approved V006 PNG reveals dark wooden door panels in **both west and east side walls**. Original PREPARE v003 corroborates **Nursery WEST / Guest EAST**. Under delegated Cabin creative/technical authority Chat A relocated the four ORIGINAL Nursery and Guest Region shapes in place with unchanged IDs, Behaviors and reciprocal destination UUIDs. No extra art, fabricated bare-floor portal or new Region was created.

The new authoritative Regionwright remote-verified commit is **`c3b35b0c0f6ade862c55993f91fad14adb242b8e`**; full Cabin source **268/268 PASS**. Native guarded write PASS and independent elected-GM read-only postread PASS: all 14 original H-U02 Regions now inside the 1440×1800 scene (previously eight off-scene across both turns), and the four newly corrected door/return Regions do not collide with any other Region. The active two player character tokens were unmoved. Existing original Sophia and attic gates, scene artwork, other Behaviors and Chat B data preserved.

**Follow [new authoritative handoff](./cav-chat-a-hu02-v006-all-five-room-doors-native-aligned-268-handoff-2026-10-27.md).** H-U02 doorway/landing **configuration alignment complete**, **not player-tested**. Physical Foundry walls (zero in this scene), real player teleport/landing and global compatibility remain separate subsequent work. Do not repeat previous ten/four Region migrations, rerun V005 installer or revert to stale coordinates.

