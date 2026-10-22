# Cabin in the Ashen Veil — Master House Blueprint V1

**Date:** 2026-10-22. **Authority:** Assistant-authored, owner-requested first measured ARCHITECTURAL PROPOSAL. **Not** an owner-approved floorplan, Foundry Scene, full structural engineer's blueprint, map render, or product KB sync. It supersedes the undimensioned nine-square zoning *only as a proposed design*, while owner-established quest items, real exterior orientation, and one-room-per-scene policy remain authoritative.

## Structural idea: real linked home rather than a square of independent rooms

**Central, double-height Great Room with an upstairs gallery.** The family blueprint is displayed on a sturdy drafting table in the Great Room. The Great Room branches west to Allen's locked Study, east to Dahlia's accessible Art Studio, and south to the Foyer/Carriage Yard. Family mementos and the separate `027` puzzle lockbox share the hub without visually merging.

**Irregular shell:** main structural core 76 ft wide east–west × 52 ft deep north–south. A west bay extends another 10 ft from the Study; a north 5 ft hearth/chimney bay projects from the Great Room; an east 14 ft pantry wing projects at the southern end, while a separate east 14 ft secret wing projects alongside the Art Studio (and directly above, alongside Sophia's Bedroom). A south-facing 20 × 7 ft porch faces the approved Carriage Yard. **These are new candidate dimensions, not the retired 90 × 60 ft inventory specification.**

**Coordinate contract:** North up. Origin (0,0) at southwest corner of rectangular core; x increases east and y increases north, feet. Proposed exterior walls 1 ft thick, interior walls 0.6 ft; inset wall solids, door clearances, actual stairs/sections and tolerances need blueprint reconciliation before PREPARE acceptance. Exact editable room rectangles/polygons, door centers, vertical portals and puzzle-feature requirements are preserved in [Blueprint V1 structured coordinates](./house-master-v1-2026-10-22.json). No native Foundry UUID is claimed.

## Proposed ground floor

| Room/space | Real footprint in feet (x from/to, y from/to) | Canon/purpose |
|---|---|---|
| Dining Room | x0..24, y0..16 | **Proposed story room**; family meals |
| Foyer | x24..52, y0..16 | Grandfather clock; downstairs Weathered-Key stair and separate stair up |
| Kitchen | x52..76, y0..16 | **Proposed story room**; family domestic evidence |
| Pantry | x76..90, y0..16 | **Proposed story room**; south east wing |
| Study | x0..24, y16..52 plus west bay x−10..0, y26..46 | Brass Key; two-eyed Rufus, note `587` |
| **Great Room** | x24..52, y16..52 plus hearth bay x28..48, y52..57 | **Central player hub**; architectural handout table, `027` box, portrait clues, double-height fireplace |
| Art Studio | x52..76, y16..52 | Ornate Mirror at vanity, `027` painting, Sune altar, hidden east doorway |
| **Candle Workshop** | x76..90, y30..52 | Separate secret room behind Studio altar; Wick; intentionally missing/erased from player handout |

**Door centers and gates (feet):** yard/foyer (38,0), foyer/Great (38,16), Great/Study (24,34) **Brass Key**, Great/Studio (52,34) **early available**, Studio/Candle (76,41) **Prayer of Protection**, Foyer/Dining (24,8), Foyer/Kitchen (52,8), Kitchen/Pantry (76,8). Final door widths, wall clearances and hinge sides pending visual structural inspection.

## Proposed upper floor

| Room/space | Physical footprint | Canon/purpose |
|---|---|---|
| Upper Gallery / Landing | Entry x24..52, y0..16, 5ft walkways around central Great Room void, north cross-gallery y47..52 | Attic hatch, room access, overlook of Great Room; a **genuine walkable gallery**, not a floor covering the Great Room |
| Parents' Bedroom | x0..24, y16..52 plus same west bay as Study | Coat **Old Iron Key**, broken nightstand **Gate Handle**, Hope Chest **Music Box** |
| Sophia's Bedroom | x52..76, y16..52 | Old Iron Key gate; bear **Rufus eye 1**, two original storybooks, six-book Spine Mosaic, late book appears on bed in Veil |
| **Spine Hidden Room** | x76..90, y30..52 | Directly ABOVE Candle Workshop; accessible through Sophia bookcase only after all six books; Gond emblem half |
| Unused Nursery | x0..24, y0..16 | **Proposed story room** — visible family loss, preserved furnishings, no invented newborn history |
| Guest Bedroom | x52..76, y0..16 | **Proposed story room**, ordinary living home |

The upper gallery's missing central section x29..47, y16..47 is **OPEN TO BELOW**. The gallery reaches Parents at (24,34), Sophia at (52,34) **Old Iron Key**, Nursery at (24,8), Guest at (52,8), and the hidden Spine Room through Sophia's east bookcase wall at (76,41). The upstairs Foyer stair arrives at (43,8); the ladder-to-Attic hatch is at (38,49). Proposed roof access comes from **Parents' north window (12,52)**, not an obstructed central window directly behind the Great Room chimney.

## Proposed basement / attic / roof

The basement is **partial**, not an automatic full basement under every ground room. It contains **Allen's Workshop** at x24..52, y0..52, entered by the separate locked Foyer-down stair (31,8), and a **Secured Vault** at x52..76, y26..52, with a four-input mechanical door center (52,38). The Vault prize remains **Keystone**, NOT Scrying Bowl. Areas beneath other parts of the house remain unexcavated; do not invent extra traversable cellar maps. There is **no** basement-to-Undercroft passage.

The Attic is reached via Upper Gallery pull-down hatch once the Ladder Hook is recovered, containing Clockwork Winder, Minute Hand and its storybook. Roof transit comes from an **upper window**, with the chimney clock located above the central Great Room hearth on the north projection; separately placed book in flue, clock 12:00 hands and Gear reward are kept distinct. Precise roof pitch, beam supports and safe token landings remain a 3D/elevation planning gate.

## Why this also works as the Great Room player blueprint

The **GM/building blueprint** contains both eastern hidden rooms at the same x76..90, y30..52 *plan coordinates* on different floors, with floor/ceiling separation and no implied inter-floor door. These eastern wings are architecturally real even before a party finds their doors.

The **player-facing version**, prepared *after* this blueprint is accepted, would still depict the real normal rooms and navigation, but Allen's pencil strokes beside **the Studio east wall** show rubbed-out eastward lines, altered foundation measurements and a heavier straight wall drawn over the narrower wing. On the upper-floor inset, Sophia's room appears to end at the false east face, concealing the identical upper void. The inconsistency should reward comparing measured outer walls, interior distances, and the altered plan, without saying `SECRET ROOM`. Art, searchable handout detail and active Foundry walls must agree with the **true** blueprint; only the intentional erasures on the handout may mislead.

**Player plan placement:** Great Room drafting/display table at proposed (38,25.5) ft. The `027` lockbox has its own nearby yet distinct physical anchor at about (27,26) ft. Blueprint/handout detail belongs in an inspectable journal or equivalent, not microscopic illegible markings painted on battlemap.

## Route / geometry verification (conceptual)

A bounded coordinate check of this proposal found:
- **8 ground, 6 upper, 2 basement interior room polygons**, none overlapping positively on its own level. Upper gallery has a true 18×31 ft central void rather than a duplicate floor.
- Paired horizontal door centers lie on both intended adjoining room boundaries; Study, Sophia's door, Candle Room, Spine Room and Vault each retain their established independent gates.
- Foyer → Great Room → Studio is reachable before the Study Key; Study remains locked.
- Basement Workshop is gated by Weathered Key; Vault additionally gates on four accepted inputs; Candle Room by Prayer of Protection; Spine Room by six-book solution.
- The two vertically aligned secret wings and the Parents/Study west bay have coherent floor-over-floor footprints.
- Stair rises, window egress and roof route, foundation load paths, wall endpoints and actual Foundry Scene transitions are **unverified until real Spatial Blueprint and structural inspection**.

## Separate room-count scope

The earlier **31 questline logical locations** remain a working questline census, not a total of all rooms in a believable house. This architectural proposal introduces five separately navigable narrative rooms as **proposals only**: Dining Room, Kitchen, Pantry, Nursery and Guest Bedroom. If all become real independently accessible scenes, the **logical** location count becomes about **36** before any later additions; alternate Sune/Bath/Pond stage scene *assets* are counted separately. No historical 29-map roster has been reintroduced.

## Next bounded work

1. Confirm the *direction* of asymmetrical house shell + double-height Great Room + stack of hidden east rooms; this proposal is not canon until owner accepts it.
2. Reconcile the actual exterior footprint against the **owner-approved estate reference** (south-facing porch, house north of yard).
3. Decide whether five story-only rooms are kept and include their scenes (especially unused Nursery). Revise full room inventory.
4. Compute door widths, wall thickness insets, stair rise/run, attic/roof access and stable Semantic Feature Manifest/Spatial Blueprint.
5. Produce the actual **BP-3 player handout** from an approved BP-1, with controlled erasure/drafting-over clues, then build separate player room maps through Dicebox `PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST/BLUEPRINT_RECONCILIATION → PAINT_RENDER → FINAL_INSPECT → BUILD → STAGE → INJECT → VERIFY → RECEIPT`.

**No house layout has been owner-approved; no Foundry/Regionwright writes, product KB promotion, map rendering or Scene install occurred here.**