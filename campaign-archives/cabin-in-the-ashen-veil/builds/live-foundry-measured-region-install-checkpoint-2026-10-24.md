# Cabin in the Ashen Veil — Measured Live Region Install Checkpoint

Date 2026-10-24. Foundry 14.367, dnd5e 5.3.3. Authenticated GM / exact world `cabin-in-the-ashen-veil`. Applied under owner's direction to measure and add missing Regions via GM Macros; existing owner Regions preserved.

## Baseline
32 live Scenes, 15 preexisting Regions and 1 preexisting behavior across EXT-01 (8) and H-G06 (7). 30 existing scenes initially had zero Regions. More campaign art targets are not yet installed as native scenes; do not silently assume all 45 are present.

## Authenticated measurable installations
1. `SG-05 - Memorial Clearing` native ID `CAVSG05Scene0001`, 4320×2880, inspected owner-approved background `sg-05_memorial-clearing_dormant_owner-pass.png`. New `SG-05 - Mosaic Discovery - North Statue` id `L15BdSqcbCOLPnIN`, north statue behind-plinth polygon `[2000,720,2320,720,2320,825,2000,825]`; created and readback matched via GM script Macro `Macro.AVW228oYajM2e2pc`. This is **geometry only**; no active Region behavior. Puzzle appears only after four correct busts and separate actual clickable mosaic Tile. Script still must implement once-only player notification.
2. Four corner-bust Region footprints, measured on actual approved images, installed with GM Macro `Macro.Ivh7g6fyaPQnVDLj`, each with metadata keys and **no active behaviors**, unique readback confirmed:
   - SG-07 Southwest Rose `CAVSG07Scene0001` (2880×2880), Region `0JAM9urrHnAxVUgM`, polygon `[1440,700,1780,700,1780,1030,1440,1030]`.
   - SG-03 Northeast Star `CAVSG03Scene0001` (4320×2880), Region `BfKhb34dSEfVTf2e`, polygon `[2920,350,3320,350,3320,820,2920,820]`.
   - SG-01 Northwest Moon `CAVSG01Scene0001` (4320×2880), Region `gksvZIqj8jWdqzn7`, polygon `[1290,680,1860,680,1860,1410,1290,1410]`.
   - SG-09 Southeast Sun `CAVSG09Scene0001` (2880×2880), Region `BrugKqcQyDImUvwt`, polygon `[1800,1360,2210,1360,2210,1840,1800,1840]`.
   - Stage `GEOMETRY_ONLY`; use explicit verified Clockwork Winder interactions SW→NE→NW→SE; no auto-award or trigger on Region entry.

## Current count
20 Regions across 32 Scenes, still 1 preexisting behavior. Newly placed five Regions were independently inspected / read back from live Foundry after Macro execution. This does **not** certify all needed Regions, geometry collisions, scripts, player testing or travel. Existing scene bounds/sprite art verification done for five footprints; further native area coverage and opening-to-midgame routes remain.

## Next build units
- Measure all remaining approved maps in world (background dims and fixture coordinates); install navigation Regions only after verified portal geometry and paired safe destination, not by scene-name guesses.
- Add guarded native RegionBehavior script and state/tile logic to corner busts and SG-05 with active-GM, permissions, reconnect and player tests; do not conflate walk-in notice with player puzzle completion.
- Build all existing 32 and other missing native scenes to match canon; preserves owner Walls and Region IDs. Prioritize initial playable route then late-game.

Status: PARTIAL PHYSICAL BUILD / GEOMETRY VERIFIED only. Zero new behaviors implemented or playtested.