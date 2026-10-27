# Cabin in the Ashen Veil — Chat A H-U02 approved artwork vs native Region geometry handoff

**Date:** October 27, 2026 Pacific morning. **Owner:** “resume.” Chat A early/midgame exclusive; Chat B late-game/Undercroft and SG-01 Silver Tiny Key remain untouched. The owner's new delegated Cabin creative/technical authority remains operative. Crooked Man haunts are GM-roleplayed checkpoints **last**, not puzzle gates. Final compatibility and actual non-GM playtesting occur only **after all campaign installations**.

## Latest Regionwright checkpoint

- Source repo `Dicebox20/regionwright` branch `codex/cav-sune-integration-20261026`; **verified pushed HEAD `5f7841418268410fa39bcd3fab8b5d39f8d884f2`**, parent `f8542fec3fcab9a1f84a6c015fec9cd4d33730cb`.
- Latest code regression checkpoint **253/253 source PASS** from preceding Forest Well installation; tests were **not rerun** during this read-only inspection-only turn.
- Original Forest Well source and new original native north RegionBehavior remain installed per prior `f8542fe` checkpoint; **active Regionwright module API reload still pending**. No forced browser/page refresh during shared-world Chat B work.

## Key new factual finding: stale geometry on an already installed H-U02 map

Original Foundry 14.367, elected Gamemaster 1, world `cabin-in-the-ashen-veil`: scene `gGgUHlHdI7RFrbUh`, **H-U02 Upper Gallery and Landing**. Scene is configured **1440 × 1800**, has **14 native Regions and zero walls**. Crucially the most recent approved V006 image **is already live**, despite an older October 24 doc saying owner-approved H-U02 art was not installed. Current image `Maps/cabin-in-the-ashen-veil/h-u02-upper-landing-owner-approved-textfree-v006-2026-10-24.png`, physical dimensions 1086×1448, SHA256 `89F276946506C45CE9F9D6AA6B08664A7029D8BAF90A18D9AECD6758DC06CB6C`.

**Eight of the fourteen original Region rectangles extend beyond the configured scene image rectangle** (not proof that padded-canvas player traversal was attempted):
- Stair Down to Great Room `QunJFtigwByZndFV` (630,2092,200,125), enabled native teleport.
- Arrival from Great Room `xPTEg7ce2Bliz9M0` (632,1968,200,120).
- Nursery entrance `aZ8eagmbvZUcPJ0g` (1503,815,150,145), enabled native teleport.
- Attic hatch `UOudBnxOGVlAlPoa` (1484,1988,165,145), original disabled teleport plus enabled hook safety script.
- Art Studio entrance `yXYWpil5Y5Avmy70` (1581,1174,240,240), enabled native teleport.
- Arrival from Art Studio `pL0UiBSyEoINWzZQ` (1458,1238,120,120).
- Arrival from Nursery `GOxaHb5OuQwPj6IC` (1396,945,120,120).
- Arrival from Central Attic `1DJ0FCse01r9J5P5` (1505,1862,120,120).

Global READ-ONLY native census across **47 Scenes, 244 Regions** flagged **nine total off-configured-scene rectangle shapes** in only two Scenes: eight in H-U02 plus **one 5-pixel overhang** on EXT-TRAIL `vOwnKQFQnVUnBymL` rectangle (2473,2640,350,245) against 4320×2880 scene. Only **five of the 47 Scenes have any walls**. Wall absence is a much broader implementation-stage feature, not necessarily an H-U02-only omission.

## Visual / original design conflict requiring full scene workflow

Actually inspected newest owner-approved V006 image by read-only thumbnail. It shows **three clearly visible upper door openings and a southwest stair**, but *not* the previous upper-gallery structural reference showing **four bedroom doors, a north door, central void, attic hatch and southern descending steps**. The original `h-u02-apply-owner-approved-map-v005-gm-macro.js` is for an **older superseded** map, relies on 16 existing walls and older Region positions; **DO NOT rerun on V006**. Automatic uniform Region scaling/translation would put important story-gated teleports on visually unsupported thresholds.

The owner has delegated enough authority for a deliberate architectural redesign, but established scene workflow still requires PREPARE → STRUCTURAL_INSPECT → FEATURE_MANIFEST → PAINT_RENDER/FINAL_INSPECT as applicable → BUILD/STAGE/INJECT → VERIFY/CATALOGUE. **Do not blindly relocate** Sophia locked entry, original attic hook and its safe return, Great Room staircase, or other existing one-time puzzle locks. Use current owner-approved art if it can support the actual routes, or resolve approved player-facing topology in a separate bounded design decision before writing.

No Foundry wall, Region, Scene, Item, portal, script, actor, token, puzzle flag or late-game content was modified. This turn is a source-backed **installation-defect discovery and evidence catalogue**, not a newly installed feature or real player test.

## Evidence and next actions

- [Regionwright audit/report](https://github.com/Dicebox20/regionwright/blob/codex/cav-sune-integration-20261026/docs/cabin-ashen-veil/chat-a-upper-gallery-native-bounds-artwork-reconciliation-2026-10-27.md), adjacent structured JSON and appended chronology.
- Host authoritative read-only receipt `utility-harness/artifacts/cav-chat-a-original-scene-rect-bounds-geo-audit-20261027.json`.
- Live original GM query showed H-U02 Region IDs, shapes, destinations and enabled states; owner-approved artwork visually examined from the installed PNG. No outside image-generation/edit decision was made.
- Next Chat A: resolve H-U02 exit geometry/visual art feature manifest and repair original Regions in-place under owner-delegated Cabin authority, with strict source UUID pinning and separate elected-GM postread; continue other genuine early/midgame installation where safe. Do not touch Chat B Undercroft.


## SUPERSEDING STATUS — ten native Regions repaired (October 27)

**Later verified installation supersedes the eight-off-bounds repair backlog in this handoff.** Chat A used owner-delegated Cabin creative/technical authority to reproject **ten ORIGINAL H-U02 Region rectangles** to the live approved V006 image, preserving the existing staircase/Parents/Sophia/Studio/attic native UUIDs and original locks. The source checkpoint is Regionwright **`8f2cac8cea2c20305bc99472f6b644186761d4d4`**, **265/265 source PASS**, and a separate elected-GM consolidated readback **PASS**. No new Region, Actor or player Item was created; no Chat B Undercroft edits.

**Exactly two Region rectangles remain off the configured scene:** Nursery outgoing `aZ8eagmbvZUcPJ0g` and Nursery return `GOxaHb5OuQwPj6IC`. Guest entry/return are on-scene but their position lacks a matching V006 physical door. Do not rerun the obsolete V005 installer, undo the ten in-place changes, or falsely call the visual topology fully complete. [Authoritative new handoff](./cav-chat-a-hu02-v006-ten-original-native-regions-265-source-repair-handoff-2026-10-27.md).

The attic native write had an initial **receipt JSON comparison mistake** (after object omitted return `type`); the actual geometry/source/flags were independently re-verified **PASS** without replay. Original uncertain receipt and independent reconciliation are preserved. No player acceptance test was run.

