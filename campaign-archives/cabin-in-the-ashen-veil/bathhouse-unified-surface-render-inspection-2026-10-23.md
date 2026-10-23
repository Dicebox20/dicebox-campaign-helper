# Bathhouse single-map exception — First Render and Inspection

**Date:** 2026-10-23
**Owner instruction:** "okay, lets do the bath house, we can make this one a bit easier and turn the entire thing into a single map."
**Exception:** Explicit owner authority replaces the usual per-room-map approach for the Bathhouse **surface layout**; preserve each interior room's established objects, geometry, quest and gated transitions. The below-floor Rosewater Reliquary must also be accommodated without assuming a separate playable map when the owner asked for one; its staging and safe return still need an agreed representation/interaction. Retain historical eight-BATH cards as feature and behavior zones until source IDs are migrated intentionally. Do not create eight distinct surface raster renders under outdated automatic assumptions.

**Image:** `mossy_stone_bathhouse_dungeon_map.png`, generation `4547eb8d-d3d9-4654-ac3b-c64a88c69707`, image inspected at 1448×1086 px.
**Status:** **RENDERED_INSPECT_REDO**; owner visual approval NOT given. Not added to approved-map archive; no Foundry writes or build verification.

## Compare to controlling approved BWE-032A blueprint + current feature cards

| Inspection subject | Source requirement | Observation | Verdict |
|---|---|---|---|
| Single battlemap surface rooms | Seven surface spaces in one map by owner exception | Changing NW/north, central Main, Herbal upper-left, Boiler mid-left, Mechanical lower-left, Warm NE, Cold SE | PASS |
| North public approach | Estate path enters Changing Room at north | Stair/entry at north | PASS |
| Main/left/right room adjacency | Changing → Main, Herbal adjacent, two east baths linked | Broadly depicted and recognizable | VISUAL PASS |
| Boiler↔Mechanical adjacency | Mechanical Room is reached from Boiler Room, not independently from main pool | Mechanical has a distinct door into central hall/Main while Boiler↔Mechanical dividing wall appears continuous | **FAIL** |
| NE Aqueduct service | Distinct walkable service tunnel/threshold enters from northeast, with compatible gated route | NE connection shows water-filled culvert and grate, with no safe personnel doorway/landing apparent | **FAIL** |
| Neutral baked lighting | Even neutral illumination; lights/steam/active heat state later in Foundry | Multiple glowing sconces, burning boiler and visibly steamed upper warm pool in base art | **FAIL** |
| Dormant/fill/drain stages | Main pool's filled cold → drained mosaic/screwdriver → filled hot states | Main pool full; ornamental rose-like mosaic faintly visible, but no explicit separate stages or clear three-ring mechanism | DESIGNABLE WITH TILES, NOT VERIFIED |
| Underbath Reliquary | Bowl recovered after pool-floor 3-ring puzzle; dry return via Boiler | No recognizable below-floor space, hatch transition or dry Boiler egress on same raster | **REPRESENTATION UNRESOLVED** under owner one-map exception |
| Story/theme | Old and creepy private bath, modest painterly details | Good materials, recognizable domestic/herbal/mechanical intent; map perhaps ornate but legible | PASS |

**Critical gameplay retention despite single map:** `BATH-02` Herbal Room retains Copper Tiny Key-later lye cabinet; `BATH-01` main bath retains Screwdriver visible only drained and Rosewater 3-ring UI/hatch; `BATH-03` Boiler wheel/gauges and supply/healing gates; `BATH-06` north-east Aqueduct route must obey AqueductOpened predicate; `BATH-04` underground protected Scrying Bowl plinth with dry service egress to Boiler remains protected from flooding and accessible without heating. A single surface raster cannot silently flatten mutually independent floor elevations or render the submerged state as always solved; implementation/staged Tile strategy to be selected under owner exception.

**Conservative next PREPARE before any replacement render:** retain the approved tight BWE-032A surface footprint; make Boiler→Mechanical direct personnel doorway, usable northeastern Aqueduct corridor with threshold and safe entry, source-equivalent room door positions, neutral diffuse lights and cold/full nonsteam water baseline. Use native/interactive layers for pool draining, heating, screwdriver, radial mosaic and altar state. Propose one staged/hidden Reliquary area compatible with single-map owner scope before implementation; do not revert to eight surface maps by default.

**One-render inspection policy:** this failure is recorded as evidence only. On next owner-directed REDO, reopen exact single-map exception, approved bathhouse plan and updated owner decisions; use brand-new positive-only generation prompt, render one map, inspect once, stop. Do not seed failed image.

**No map generation or image replacement occurred during inspection.**
