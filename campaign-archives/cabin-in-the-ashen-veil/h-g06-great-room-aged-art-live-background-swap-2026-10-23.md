# H-G06 Great Room — owner-approved aged background swapped live

**Date:** 2026-10-23 Pacific / 2026-10-24 UTC
**Authority:** Explicit owner instruction “replace the map in the greatroom with that one real quick”, referring to the immediately prior 50-year-aged render edited from the clean approved Great Room layout.
**Status:** `UPDATED_VERIFIED` — exact native Level background replacement; **no Scene recreation and no changes to Walls/Regions**.

## Source art
- Approved replacement user-facing PNG source: ChatGPT current-turn file `abandoned_manor_great_room_map.png`, generation ID `602b78d7-a171-4bc4-a5ed-02ada4f82be8`.
- PNG pixels: `1199 × 1312`. Byte count: `3,239,365`.
- Exact SHA-256: `1835cc734ad75fb7d4b0eb8ca441f5d3f78d6f075d9797a4e2b33a412db2ddbe`.
- Deployed through temporary private connected Drive staging and bounded Dicebox Bridge PowerShell into Foundry Data, as a **separately versioned, never-overwritten** file:
  `C:\Users\rujie\AppData\Local\FoundryVTT\Data\Maps\cabin-in-the-ashen-veil\h-g06-great-room-aged-fifty-years-approved-2026-10-23.png`.
- Foundry-relative: `Maps/cabin-in-the-ashen-veil/h-g06-great-room-aged-fifty-years-approved-2026-10-23.png`.
- Transfer receipt: `cav-hg06-transfer-aged-approved-art-20261023-v1`; checksum/dimensions/byte count all PASS, `HTTP 200 image/png`.
- Previous approved image preserved unchanged:
  `Maps/cabin-in-the-ashen-veil/h-g06-great-room-owner-approved.png` SHA-256 `c7e5305718d5aea1ddbcd374d0374f51b714bf6d860adf0cc0aabb3a29a4f0ee`.

## Exact native live update
- Target: `Scene.CAVHG06GreatRoom`, world `cabin-in-the-ashen-veil`, elected active `Gamemaster 2`, Foundry `14.367` / dnd5e `5.3.3`.
- Level: `defaultLevel0000` only; mutation: `level.update({"background.src": newApprovedAssetPath})` in existing authorized Foundry browser context.
- Preflight checked elected GM, origin, world, old exact background, manual owner `H-G06 - Grandfather Clock` Region, and exact SHA-256/image metadata for served new background.
- First attempted execution `cav-hg06-apply-aged-art-level-only-20261023-v1` returned **BLOCKED** before any mutation due diagnostic `s.grid.toObject is not a function`. No Scene changes occurred in that attempt.
- Corrected once-only run `cav-hg06-apply-aged-art-level-only-20261023-v2` returned **UPDATED_VERIFIED**, successfully committed the new Level background and compared full native pre/post `Wall.toObject()` and `Region.toObject()` arrays, Scene Flags, grid settings and dimensions. All unchanged (`preserved=true`).
- Scene dimensions remain **840 × 960** Foundry pixels, gridless `120px / 5ft`; **12 Walls**, **6 Regions**, **0 RegionBehaviors**, `H-G06 - Grandfather Clock` owner-created Region preserved.
- Canvas remained on `CAVHG06GreatRoom`.
- **Caution:** New pixel aspect `1199:1312` differs slightly from old `1173:1341`. Retaining Scene dimensions preserves native Wall coordinates but owner should visually inspect door/window/stair alignment before considering geometry finalized.
- No other Scenes, region behaviors, stage flags, walls, doors, actors, items or scripts intentionally modified.
- This is an owner-authorized *visual asset replacement*, not visual INSPECT PASS of the revised wall alignment.

## Rollback
The exact previous asset remains in Foundry Data. A future owner-directed rollback can change only `defaultLevel0000.background.src` back to the prior relative path after normal world/elected-GM/safe-use gates, preserving the owner-created geometry and data. Do not overwrite or delete either PNG.
