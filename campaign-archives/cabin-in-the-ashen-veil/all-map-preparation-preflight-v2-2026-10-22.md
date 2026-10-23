# Cabin in the Ashen Veil — Campaign-Wide PREPARE Preflight and Gates v2

**Date:** 2026-10-22  
**Status:** Planning input and evidence-bound route gate schedule. 53 map feature cards are authored in [human atlas](./all-scene-preparation-register-v2-2026-10-22.md) and [structured register](./all-scene-preparation-register-v2-2026-10-22.json); no claim of measured complete Wall/pixel coordinates, code build, or runtime PASS.

## Why a new preparation baseline

The previous 43-scene, 49-route snapshot predates owner changes: foyer floor correction, upstairs Studio, north Study exit, one-room Spine compartment, rear Family Room and Back Deck, Basement Supply Closet, separate NW Forest Maze vs square-path nine-map Sune Grove, detailed seven-surface-room Bathhouse with independent below-bath Reliquary. It is a **historical baseline only**. Do not simply update its numeric count or reuse its coordinate anchors: maintain logical ID migration and redraw compatible spatial objects from the latest accepted images.

**Authority scope:** Source image and direct owner topology approve relationships, not microscopic door center pixels, scaled room dimensions, live Foundry Scene identifiers, or a bypass to any quest gate. Designer map splitting is provisional until preflight of actual accepted sheets.

## Accepted image provenance (active local workspace; SHA-256 checked)

| Source | Verified local filename | Pixels | SHA-256 (prefix) | Use and special correction |
|---|---|---|---|---|
| Gondian ground floor | `blackwood_estate_ground_floor_north_study_exit.png` | 1145×1374 | `21bdb61444b7` | Foyer→Great, Study inner + north exterior, main stair in Great; approved planning layout |
| Gondian upper floor **FIRST** version | `a_detailed_architectural_blueprint_plan_image_in_t.png` | 1145×1374 | `3331e10e8af2` | Southern “Spine Mosaic Hidden Room” art label is explicitly invalid geometry; use the in-Sophia-bedroom compartment |
| Approved Basement with closet | `blackwood_estate_basement_blueprint.png` | 1149×1369 | `d180592aa1ee` | Workshop, Vault, enclosed stair, added western Supply Closet |
| Northwestern Forest Maze | `forest_maze_estate_map.png` | 1448×1086 | `a0550e42c700` | Southern gate; Gazebo NW; Greenhouse NE; central Well; its 4-sector split is designer PREPARE plan |
| Owner-corrected Aqueduct technical sheet | `blackwood_estate_aqueducts_west_well_southwest_service_blueprint.png` | 3600×2400 | `62a493aed03b` | Well west, maintenance SW, Pond gear-gate and charger must be made explicit; multiple drawn terminal labels require semantic reconciliation |
| Compact Bathhouse | `bathhouse_approved_gondian_floorplan_2026-10-22.png` | 1536×1024 | `23d431a5e9b3` | North public path, northeast service corridor, Herbal late lye, Main Bath lower Reliquary |
| Whole-estate overview | `cabin_in_the_ashen_veil_estate_map.png` | 1672×941 | `9fddc40b3ef0` | Broad estate positioning, not scene-level scale or exact boundary |

**Attic caution:** The owner specifically chose the **first** cross-shaped “ATTIC PLAN” showing central attic + North/West/East Storage; another similarly named generated file in the local workspace depicts the later **rejected alternate attic** with a front lookout and unfinished crawlspace. The exact first attic PNG is identifiable from its owner-attached chat image but **not yet independently verified under a unique file path in this workspace**. Do not mistake the later alternate image for the approved original. Recover original bytes before final spatial PREPARE.

**Bathhouse source hash** was verified against the accepted exact PNG; source hashes are evidence identities and not proof of architectural measurement. Local files are not automatically GitHub binary commits.

## Locked and provisional pair-gate contracts

| Planned connection | Gate / meaning | Proof still needed |
|---|---|---|
| `H-G02 ↔ H-B01` | Real Foyer basement door uses **Weathered Key**; enclosed descending stairs beyond | Distinct threshold, descent and safe workshop return |
| `H-G06 ↔ H-G05` | Original Study interior door requires **Brass Study Key** | Study wall and paired portal |
| `H-G05 ↔ EXT-08` | Same Brass Study Key opens Study **north exterior door** | Actual rear landing on deck/yard; no false Family Room door |
| `H-G06 ↔ H-U02` | Ordinary main stair rises from Great Room | Exact stair geometry paired upstairs |
| `H-U02 ↔ H-U05` | Sophia bedroom's existing **Old Iron Key** lock where applicable | Confirm door/puzzle timing in stage route manifest |
| `H-U02 ↔ H-A01` | **Carriage Ladder Hook** unlocks the attic ceiling hatch and deploys pull-down ladder | Genuine ceiling hatch, not permanent staircase |
| `H-U04 ↔ H-R01` | Parents' roof window/exit, safe walkable roof arrival | Geometric footing and backtrack safety |
| `H-U07 ↔ H-U08` | **Prayer of Protection** reveals hidden Candle Workshop passage | Separate Scene, concealed visible art till activated |
| `H-B01 ↔ H-B02` | Four and only four Vault readiness predicates; insert charged source + Gond/Sune emblem halves and turn combined actuator | No extra inserted fourth item, bowl not inside |
| `EXT-01 ↔ FM-01` | Wrought iron maze gate: accessible then interior-side open state per existing gate contract | Gate visibly at Yard NW actual forest boundary |
| `EXT-01 ↔ SG-04` | West Grove path approach | The west Bathhouse fork remains outside square loop |
| `EXT-02 ↔ EXT-07` | Oars/boat transport and later vegetation blockade at far landing | Safe near/far dock staging; no premature Prayer |
| `EXT-01 ↔ EXT-04` | Privy late access / Copper Tiny Key under Crimson Veil as previously established | One-time claim and no false automatic popup |
| `EXT-02 ↔ AQ-01` | Pond must drain to expose gate; Gear+Handle unlock Aqueduct entry | Portal availability aligned with water states |
| `FM-04 ↔ AQ-01` | Forest Well ↔ Aqueduct; reverse route survives Pond refill **after lawful Aqueduct access** | Prevent bypassing entry gate progression or trapping during chase |
| `AQ-01 ↔ AQ-02` | Main→Waterworks internal door on SW maintenance branch | Ensure charger in AQ-01, three-gauge puzzle only AQ-02 |
| `AQ-02 ↔ BATH-06` | NE Bathhouse service corridor reaches SW Aqueduct maintenance; **designer gate proposal** reuse AqueductOpened state to prevent early bypass | Exact Bathhouse NE landing and gate-state authority; no new item |
| `BATH-01 ↔ BATH-04` | Main Bath drained + three-ring Rosewater mosaic solved → hatch/stairs | Close/return safety on refill |
| `BATH-04 ↔ BATH-03` | Inside-unboltable dry Reliquary↔Boiler service exit (independent of boiler completion) | Always-available route for safety even when pool full |
| `SG-05 ↔ UND-01` | Bowl placed in Sune's empty hands + filled 027 pellet → Undercroft Approach | Stage swap before and after unlock |
| `UND-01 ↔ UND-02` | Recovered Vault **Keystone** plus stone lever opens ornate barrier | Preserve initial barrier opacity and aftermath on inner side |
| `UND-02 ↔ UND-03` | Refuge hall continues to final ritual space | Detailed ritual chamber design intentionally reserved for last |

All other design neighbors are ordinary paired portals, subject to spatial anchoring, ability to return, Foundry permissions and local gate checks. **No new bypass is authorized solely because an art drawing has a water channel or service arrow.**

## Fixed item ownership and non-baked stages

- **Clock Hour Hand:** Grandfather Clock in Great Room, behind Brass Tiny Key. **Minute Hand + Clockwork Winder + one storybook:** independent Attic required items; optional three-part Mini-Robo Rufus does not gate them.
- **Studio** upstairs: mirror with two keys, 027 painting, late Prayer of Devotion gives Sune half; Prayer of Protection opens upstairs Candle Workshop to reach Wick.
- **Rufus** taxidermied in Study: two separate eyes from Sophia bear and Gazebo lantern/cobweb release; source only after both. **Gondian charger in AQ-01** has no extra minigame, starts Veil upon charging.
- **Scrying Bowl** is in separate below-bath Reliquary, not Vault. **Vault** provides Keystone only. **Spine Mosaic** is a compartment reward within Sophia bedroom.
- **Pond/Bath** share sluice water state. Pool-floor Screwdriver and Rosewater rings appear when drained. Solved rings persist; hatch safely reseals at refill; dry Boiler route remains.
- **Greenhouse pressure intake blockage** (rocks, dirt, debris) is physically in **AQ-02**; recipe mixing occurs inside separate Greenhouse; lye from Bathhouse **Herbal Room** at late stage.
- **Sune Grove** has nine distinct maps forming square perimeter and central Memorial map; NW Forest Maze has its own gate and actual Well/Gazebo/Greenhouse destinations.

## Completion criteria and explicit scope boundary

**Achieved:** every proposed logical location has a seven-field card, 3–7 consequential visual anchors, density tier and true 90°/neutral art contract, expected transition partners, gameplay state separation, and hard inspection requirement. Programmatic validation found 53 distinct card IDs, 62 unique planned undirected links, and zero missing/asymmetric references.

**Not achieved by this evidence-only pass:** 53 precisely dimensioned structural blueprints with per-portal pixel anchors, missing original selected attic raster bytes, all needed stage-specific painterly render files, actual compiler schema compatibility, live Foundry Scene installation, Region creation, token travel verification or gameplay testing. Final arena encounter design is intentionally deferred by owner instruction; its high-level card is already present. Those tasks are **not grounds to call the current design register empty**, and they may be executed after the campaign-wide preflight without revisiting all creative decisions.

**Next execution:** rebuild House Master v2 measured geometry from accepted images, resolve the handful of explicitly flagged map-connection image contradictions, then work the cards into validated STRUCTURAL PREPARE outputs. Generate maps only after the relevant room's card/anchor check passes. Approved Carriage Yard painted art may be reused only if it remains compatible with these routes.
