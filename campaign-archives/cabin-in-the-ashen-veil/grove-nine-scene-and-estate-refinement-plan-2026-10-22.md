# Cabin in the Ashen Veil — Nine-Scene Sune's Grove & Estate Refinement

**Date:** 2026-10-22  
**Authority:** Latest direct owner correction and design delegation: “Sune’s Grove is the 9 map area, the memorial clearing is the center map, forest maze” and the supplied *Cabin in the Ashen Veil — Exterior Layout (Rough Draft)*, followed by “that image is a rough layout, you can change whatever you need.” The owner specifically delegates the Forest Maze/well topology, Greenhouse/Waterworks utility sub-placement, optional Gazebo extra puzzle/equipment, and chronology-sensitive remains dressing; leave the final ritual chamber design until last.

**Scope:** Side-campaign creative layout and feature planning, not Foundry installation or universal workflow alteration. **Status:** OWNER-GROUNDED TOPOLOGY + DESIGNER-SELECTED DETAILED PLAN; TECHNICAL GEOMETRY / RUNTIME UNVERIFIED. Preserve provenance of assistant-selected solutions rather than presenting all as the owner's words.

## 1. Controlling relationship and original sketch status

- **Sune's Grove is a nine-map connected woodland / haunted forest maze region**. Exactly **one center scene is the Memorial Clearing**, containing the Sune statue, four busts, one grave, sliding relief, and Undercroft activation. The eight surrounding Grove scenes are distinct forest maze scenes. **Memorial Clearing is not the name of all nine**; the former single-scene equivalence in older rough atlas/count is superseded.
- The uploaded exterior illustration is **conceptual visual evidence, not a scaled or irreversible geometry blueprint**. Do not derive pixel-to-foot Wall locations from it. Retain as broadly useful: cabin north of main Carriage Yard, westward shrine approach, maze gate north/northwest of cabin, shack northwest, privy northeast, pond/sluice east, road from south; Bathhouse branches southwest from westward trail, and Boathouse lies beyond pond. The owner has authorized relocating, scaling, and reshaping these for navigable maps while honoring accepted puzzle relationships.
- House **BP-1 dimensional geometry remains separately owner-approved**; the exterior rough-layout flexibility does not automatically rewrite interior room polygons, door centers, or puzzle gates. A changed exterior facade must match the house's south-facing porch.
- **Nine replaces two provisional logical scenes** in the old working inventory (“Sune Memorial Clearing/Grove” and “Forest Maze”). Other scenes (Gazebo, Greenhouse) remain separate. The 36-location *former working estimate* becomes **approximately 43 planned logical locations** (36 − 2 + 9 = 43), conditional on existing room split assumptions and before new measured scene inventory. This is **not a quota** or an installed Foundry scene count; stage variants add physical scene assets.

## 2. Grove topology — 3 × 3 navigable domain

All slots are logical neighboring scenes, not fixed square-world dimensions. North is up; every named connection below must align with an eventual paired landing/portal anchor. Stable scene IDs are proposed `SG-01` to `SG-09`, with `SG-05` the center.

| NW | N | NE |
|---|---|---|
| **SG-01 Ash-Bark Switchbacks** | **SG-02 Old Processional Path** | **SG-03 Iron Gate Thicket** |
| **SG-04 Mossbound Orchard** | **SG-05 Memorial Clearing** | **SG-06 Western Shrine Approach** |
| **SG-07 Rootbound Well** | **SG-08 Briar Crossroads** | **SG-09 Glasshouse Approach** |
| SW | S | SE |

**Direct connections / planned route graph:**
- `SG-01` ↔ `SG-02`, `SG-04`; `SG-02` ↔ `SG-03`, `SG-05`; `SG-03` ↔ `SG-06`.
- `SG-04` ↔ `SG-05`, `SG-07`; `SG-05` ↔ `SG-06`, `SG-08`; `SG-06` ↔ `SG-09`.
- `SG-07` ↔ `SG-08`; `SG-08` ↔ `SG-09`.
- **Exterior portals:** Carriage Yard **western trail** ↔ `SG-06`; Carriage Yard **northwestern iron maze gate** ↔ `SG-03`; `SG-07` **stone forest well** ↔ **Aqueduct Main**; `SG-08` ↔ **Forgotten Gazebo** (separate scene); `SG-09` ↔ **Greenhouse** (separate scene). Bathhouse spur belongs on the westward Yard-to-SG-06 approach, not inside the memorial puzzle footprint.

This graph gives a direct early, unlocked Yard → SG-06 → SG-05 shrine route, while the Aqueduct chase emerges much farther away at SG-07. From SG-07 players can traverse SG-04 → SG-01 → SG-02 → SG-03 and reach the Iron Gate, or return through SG-08/SG-09/SG-06. The nine-map maze can feel disorienting without requiring random teleports or irreversible one-way traps.

**Gate policy (new delegated topology choice):** From the yard, the SG-03 iron gate initially resists inward entry; when first reached from within the maze after Aqueduct/well route it is openable from the inside and stays available for later two-way backtracking. Do not give this gate the same reward/role as the Study, Sune or Vault keys. The early shrine path via SG-06 stays open; no essential Brass Study Key dependency may require first opening the Aqueduct.

**Chase policy:** First Crooked Man chase is triggered in **Aqueduct Main** and drives characters toward the **SG-07 well ascent**. The well is a transition **within SG-07**, not its own tenth Grove scene. The route remains reopenable to Aqueduct after the pond refills. The later **second chase** starts only when the established late-progress condition and approach to the **NW bust in SG-05** both hold, in dormant or activated shrine stages; Silver Tiny Key reward/drop belongs to that chase, not a new maze puzzle. No collectible Region is placed on every maze bend.

### Nine map-specific PREPARE content cards

| ID | Player-readable permanent art / must-see | Separate interaction/state or build owner |
|---|---|---|
| **SG-01 Ash-Bark Switchbacks** | Narrow, twisting but token-clear forest trail, twisted ash bark, landmark split stone, old boundary wall cap, west-to-north switchback | Optional faint Shadow That Sees manifestation as separate discoverable overlay; safe route signs |
| **SG-02 Old Processional Path** | Mossy family-laid stepping stones, carved floral masonry remnants, procession trail approaching center, distinct junction east/west/south | Inspectable wayfinding relief may support shrine discovery but must not replace still-open four-bust order clue |
| **SG-03 Iron Gate Thicket** | Wrought-iron estate maze gate within stonework, north-yard-side transition, forest track west/south, mechanically readable latch housing | One-way-initially / two-way-after-inside-open Wall/door state; stable yard return route |
| **SG-04 Mossbound Orchard** | Overgrown old fruit-tree grove, low stone garden edges, readable north/center/south bends, a small abandoned household bench | Optional nonblocking family storytelling; no unapproved main-path key |
| **SG-05 Memorial Clearing** | Center Sune statue with empty hands, SW/NE/NW/SE busts, ornate concealed embossed sliding-relief housing, one unborn-child grave, family-made bench and drainage seams | Bust sequence; sliding puzzle, 1,000 gp / Brass Study Key reveal, Bowl and filled-pellet assets, active-undercroft stair stage, **NW late-chase** Region on both stage variants. New map structure must not pre-reveal undercroft |
| **SG-06 Western Shrine Approach** | Widely readable forest entry path from Yard, stone verge and Sune-themed family boundary details, west to shrine, north and south detours | Normal Yard ↔ shrine access at campaign start; Bathhouse fork on approach before entry |
| **SG-07 Rootbound Well** | Ancient lined well / masonry stair throat inside tangled roots, forest egress, distinct north/east paths, stable clearance for chase arrivals | Aqueduct ↔ well transition and chase arrival; reversible, not a separate scene |
| **SG-08 Briar Crossroads** | Three-branch forest intersection, abandoned picnic trail stones, south-to-Gazebo route, narrow canopy breaks marking orientation | Separate Gazebo transition, readable retrace route; no new indispensable reward here |
| **SG-09 Glasshouse Approach** | Remnants of horticultural estate path, paved approach to distinct Greenhouse doorway, visible old irrigation conduits, west/north travel | Separate Greenhouse entrance and restored line environmental overlay; greenhouse puzzle stays *inside Greenhouse* |

The forest should evoke persistent navigation anxiety through distinctive but confusing environment signatures, **not nine visually interchangeable thickets**. Transit anchors for paired edges will be measured during spatial PREPARE. Each map remains a 90° overhead gridless painterly tactical scene with low representative physical-wall footprints, neutral base illumination and independent active effects.

## 3. Exact delegated split: Waterworks vs Greenhouse

**Aqueduct Main (existing separate map):** Holds the gate needing roof replacement gear + nightstand handle; physical first chase course; recognizable **Gondian charging station** visible during that chase and accessible for return later; Waterworks Utility Room side door; forest-well route. The recovered source charges here **without introducing a further charging minigame**; this triggers Crimson Veil and later stage logic. Maintain Aqueduct entry via SG-07 well even when the pond refills.

**Waterworks Utility Room (existing separate map):** Mechanical **three valve + three gauge pressure puzzle**, with branches **Pond**, **Bathhouse/Boiler**, and **Greenhouse**. The player may operate pressure controls only meaningfully while the estate **sluice is CLOSED**. A clogged **Greenhouse supply intake** is physically obstructed by **old rocks, dirt and debris**, explicitly owner-selected in the original conversation; players may clear it with hands or available tools, with Athletics / Sleight of Hand / Acrobatics or appropriate physical alternatives. **No DC is assigned here.** Both Bathhouse boiler feed and Greenhouse irrigation/mixing feed are restored by this first pressure puzzle. Solving it unlocks a **small inner maintenance compartment on the same map** containing Allen's warning about Sophia avoiding the memorial at night and **Rufus's Collar** (psychic immunity while worn; balancing remains open). Do not fabricate an extra independent utility map for a closet.

**Greenhouse (separate map reached from SG-09):** Old conservatory with planter benches, pipes and sprinkler fixtures, recipe/work bench and visually distinct ingredient jars. At first visit no running supply/mixing water; after Waterworks, sprinklers and mixing station work. **Lye remains in the separate Bathhouse soap-room glass case and is progression gated by Crimson Veil privy Copper Tiny Key**; greenhouse does not grant lye early. The garden mixture created here is the established fictional plant killer used at far Pond/Boathouse dock. Keep greenhouse water-status/sprinklers in Foundry effects or overlays rather than permanent directional glowing paint. Do not mistakenly put the Waterworks pressure puzzle or its reward compartment in the Greenhouse.

## 4. Extra Gazebo puzzle and optional equipment — designer-selected

**Separate Forgotten Gazebo scene (from SG-08).** Preserve the owner's original image-story requirement: once a beloved picnic place, carved stone/masonry by Allen remains precise while **wooden canopy and roof lattice decay in vines**. A freestanding **garden lantern** is its late chain: oil freely from Donovan's Shack plus the **Wick from Candle Workshop** ignite the lantern and clear a cobweb covering, dropping **Rufus eye #2**. Its state is a separate controlled asset (web/reward/lantern states), not permanent eye in painted background.

**New OPTIONAL independent picnic-table puzzle:** The surviving fixed stone picnic table has **three shallow, rotatable stone place-markers** bearing a rose, a small cog and a tactile star—Dahlia, Allen and Sophia's family motifs. The table's decorative inlay outlines indicate the matching alignment. Align all three to release a non-critical drawer. **Optional equipment reward:** `Allen's Folding Surveyor's Rule`, a nonmagical hinged metal measuring rule with careful foot/inch marks, helpful for players comparing BP-3 erased house dimensions to their explored rooms. It gives a concrete investigative affordance but **does not gate** the Study, Wick, Rufus eye, Scrying Bowl, aqueduct, emblems or finale; no extra required DC. Add a subdued family picnic sketch as an optional readable inspect asset, not microscopic permanent text. State-based markers/latch/reward are managed outside permanent background. No earlier independent puzzle is overwritten; this resolves the formerly OPEN gazebo extra reward under the owner's current design delegation.

## 5. Family death chronology and environment placements — designer-selected staging

**Unchanged owner canon:** During the 1451 DR Ash Zombie attack, **Donovan leads Sophia to refuge in the Undercroft**; Allen is killed defending the family after Dahlia cannot save him by healing; **Dahlia dies in the locked family carriage, last casualty of the assault**. Donovan and Sophia survive the assault and **later die of dehydration/starvation behind the thick Keystone door**; interior digging/scratching is visible only from their trapped side. Five sentient haunts remain the house/family phenomena independent of Voss. **Pre-ritual horror is psychological, not gore-centered.**

**New staged locations within that canon:**
- **Allen:** Stage his dry, long-settled remains in the **Great Room, toward the north hearth rather than on the central blueprint/circulation lane**. A collapsed household tool pouch / modest masonry chisel and nearby carefully mended furniture communicate a last stand and a builder's personality. This is a **new assistant selection permitted by owner's delegated dressing authority**, not a claim older transcripts explicitly located his remains at the hearth. No exposed gore. Keep blueprint table, distinct 027 lockbox and routes unobstructed. If remains are used as an inspectable clue, retain human-scale readability and nonblocking access.
- **Dahlia:** Remains are **within the locked carriage**, not exposed on the Yard background. Show an aged, worn interior upon using Carriage Key via an independent inspect/journal/interior-state asset, with Ladder Hook separately collectible. No fixed dried-blood spectacle on permanent exterior art.
- **Donovan and Sophia:** Their distinct remains lie **in the Sealed Refuge beyond the ornate inner Keystone door**. Donovan is nearest the **interior face** of the door with chipped masonry and exhausted tools, and Sophia rests farther inside a modest protected resting nook, leaving the last evidence of his protective intention to visual deduction. No gouges rendered on outer Undercroft door face. They died later than Dahlia; do not imply they were killed by the assault or by Voss.
- **Unborn child:** Exactly one small grave at **SG-05 Memorial Clearing**, with gentle Sune devotional/flowers and no invented lived newborn timeline. Preserve nursery as loss/storytelling room, not a child deathbed.
- **Voss and summoning:** Do not expose present-day ritual tracks/effects on the domestic map or shrine as if they belonged to the old 1451 deaths. **Ritual Chamber detailed design remains deferred** under owner's direction. The unresolved means by which Voss reached the chamber beyond the sealed Keystone door is still OPEN.

**Visual layer note:** Burial/remains story content is legitimate in relevant *visible* map background if permanent, subject to framing and age-rating intent. If deliberately revealed only by door unlock or scene transition, source scene cannot show it prematurely.

## 6. Required next map/workflow steps

1. Register this as a **later supersession to the single Grove / Maze census and grove-clearing ambiguity**. Preserve older historic records rather than silently rewriting their initial assumptions. Update current registry totals as *working estimates* only.
2. Build a paired-portals **BP-2 estate route graph**, with nine SG scene IDs and explicit outside links; define shared coordinates/landings before any per-room paint. Structural sketches are deterministic evidence, not AI painterly artefacts.
3. Before **Foyer H-G02** render, validate its four approved horizontal doors, two separate vertical stair paths and grandfather clock placement; Foyer remains the first map in existing owner-approved Batch 01 order. Do not opportunistically reorder batches because Grove design has been refined.
4. Positive image style reference is available in repo `artifacts/library-files/Artwork/Overgrown Forest Shrine Clearing.png` but must be visually checked before usage. Rejected full-house, cutaway or earlier wrong-style painterly outputs remain negative historical evidence only and are forbidden as generation references.
5. Preserve all global prompt rules: one fresh independently authored **positive-only** painterly prompt per attempt, only intended visible contents, 90° overhead plan view, low representative wall caps, neutral baked illumination, separate runtime light/mood and puzzle/item states. Independent final inspection and normal Foundry BUILD/STAGE/INJECT/VERIFY/RECEIPT gates remain.
6. No production artwork, Foundry live scene, Regionwright behavior, complete technical maze footprint, or final ritual chamber has been created/verified by this file.

## Provenance

- Owner-provided estate rough image in project chat and repo `artifacts/library-files/Artwork/Cabin in the Ashen Veil Map.png`.
- [Part 1 of 2](./campaign-chat-transcript.md): original player/owner comments on gazebo family picnic, first chase, greenhouse, Waterworks stone/dirt debris, mother/Allen/Donovan/Sophia tragedy and psychological horror.
- [Part 2 of 2](./map-creation-conversation-transcript-2026-10-22.md): BP-1 owner approval, FAST mapmaking exception, visually strict representative-wall style and failed-render isolation.
- [Current decision catalogue](./campaign-decision-catalogue-2026-10-20.md), [old provisional 31 location inventory](./questline-map-inventory-2026-10-21.md), [rough atlas](./rough-layout-atlas-v1-2026-10-21.md), [House Master BP-1](./blueprints/house-master-v1-2026-10-22.md), [Rosewater Bowl source](./rosewater-reliquary-bowl-decision-2026-10-21.md), [map production locks](./ashen-veil-map-production-locks-v1-2026-10-22.md), and [clean-room handoff](./map-rendering-clean-room-handoff-2026-10-22.md).
