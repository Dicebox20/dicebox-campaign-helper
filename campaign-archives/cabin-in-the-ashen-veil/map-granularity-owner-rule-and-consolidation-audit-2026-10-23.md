# Cabin in the Ashen Veil — Owner Map Granularity Rule and Exterior Consolidation Audit
**Date:** 2026-10-23
**Owner clarified:** “I want to be clear that the cabin's rooms are all seperate. Only the areas outside of the cabin use full areas.” Then: “now that I think about it, that probably reduces the maps by a lot.”
**Authority:** Current direct owner rule. Supersedes inconsistent assistant suggestions that would combine cabin rooms. **This is map-art / Foundry-scene granularity, not deletion of logical location/puzzle design cards.**

## Binding default for all later PREPARE, RENDER, INSPECT and BUILD
- **Inside Blackwood Cabin: ONE separate battlemap and one scene for EACH individual room.** Keep all nineteen current `H-*` logical scene cards as independent render/scene targets. This includes Foyer, Great Room, bedrooms, attic/roof and basement rooms: `H-G01…H-G09` (7 actual), `H-U*` (7 actual), Attic `H-A01`, Roof `H-R01`, and Basement `H-B01…03` (3). No full-floor mansion battlemaps. The Attic card currently combines walkable attic plus three internal storage alcoves per approved attic plan: **the three attic storage rooms are specifically part of the one approved attic design**, rather than newly inventing separate destinations; this is a source-specific exception until owner says otherwise. Likewise Sophia's spine mosaic is a hidden **compartment**, not a new room/scene.
- **Outside the Cabin: use larger full-area battlemaps as the default**, rather than splitting every contained room, tunnel segment, piece of garden, or utility chamber into a new image. Distinct quest zones/puzzles remain independent Regions, Tiles, journal/interaction IDs on the applicable area map; stage overlays may depict time-dependent changes.
- **Previously approved explicit exceptions are not undone:** `SG-01..SG-09` are **nine independent square-loop Grove maps**, despite being outdoors. `BATH-01..BATH-08` are **eight logical feature cards on ONE unified Bathhouse base map**, with below-pool Rosewater Reliquary as a protected conditional/sublevel feature, not silently erased. `AQ-01` and `AQ-02` share **ONE accepted large Aqueduct base map**, with two distinct semantic/puzzle zones. Separate Greenhouse, Gazebo and Well *destinations* remain in story and must not be deleted by reducing map backgrounds. Existing independent user-approved map assets are preserved verbatim.
- No puzzle/portal, direction, scene floor transition, sealed door, reward or safe-return requirement may be dropped just to reduce the art count.

## Confirmed arithmetic — not guesswork
- Legacy PREPARE logical-location cards: **53**.
- Already accepted 8 Bathhouse logical cards → 1 combined rendered base map: `53 - 7 = 46` targets.
- **Owner accepted broad Aqueduct image** combines 2 AQ cards into 1: `46 - 1 = 45` *confirmed* base-map targets.
- Owner-approved art covering target maps: **12/45** = 9 Grove + 1 Carriage Yard + 1 Bathhouse + 1 Aqueduct.
- **33 base-map targets remain**, if every other grouping remains as most recently registered. The separate approved Grove/Bathhouse trail fork does not map to one of these 53 original ID records.

## Further reduction via exterior area grouping — DESIGN CANDIDATES, NOT YET LOCKED
- **Northwestern Forest Maze** `FM-01..04` could be ONE navigable, spacious maze background instead of four subscene backgrounds. This would reduce targets by **3**, preserving Iron Gate entrance, switchbacks, northern forks, Well and portal as region/encounter anchors. **Owner earlier requested independent Well/Gazebo/Greenhouse destinations**, so merging *their physical spaces into this single maze* requires separate geometry/art review; this is a possibility, not automatic replacement of that requirement.
- **Pond + Boathouse / two shorelines** `EXT-02` and `EXT-07` could be ONE shore-to-shore map if actual crossing, boat launch and sluice/puzzle paths fit. This would reduce targets by **1** without eliminating the boathouse experience.
- Other estate outbuildings `EXT-03` Shack, `EXT-04` Privy, `EXT-05` Gazebo, `EXT-06` Greenhouse and rear `EXT-08` grounds may be *within* larger exterior scenes where spatial continuity and visible interiors are sound. Do not force them into already approved Carriage Yard art or lose explicit scene-stage details. Count after grouping cards and physical portal routes are reconciled.
- `UND-01..03` are outside the cabin but currently different **story-gated physical levels/destinations**; especially the final ritual chamber is intentionally deferred. Do not silently flatten it into one undifferentiated map before final design.

**Illustrative lower target** after **both** proposed Maze(4→1) and Pond/Boathouse(2→1) merge: `45 - 3 - 1 = 41` backgrounds; `41 - 12 = 29` remain. This is an **example only**, not current approved target count. There may be further justified consolidation once detailed exterior PREPARE geography is reconciled.

## Approved Aqueduct artifact and semantic roles
Original accepted large candidate `the_brasswater_aqueduct_complex.png`, generated image ID `0a42e944-445b-435a-8821-9aa5a66aa30a`, **1448×1086px**, SHA-256 `8b91c5c941a0b37231a83b062fb62adfc501c6c33401e9a1d6c2cab75444842c`. Owner explicitly judged it Gondian-consistent and PASS. It hosts AQ-01 Charger/first chase/Well/Pond entrance and AQ-02 SW maintenance/pressure controls as separately interactive regions. Artwork acceptance is **not** proof all canonical routes, gate logic, collar reward, obstruction and Foundry scene placement have been verified.

## Implementation policy
At each future area: review latest owner plan and map topology, decide one or more **physical background groups** as needed, retain exact unique logical feature IDs, recheck PREPARE immediately before each render, produce one image and inspect once. When a new grouping is *actually approved*, update map-target census and document before claiming count reductions. No Foundry writes under this documentation task.
