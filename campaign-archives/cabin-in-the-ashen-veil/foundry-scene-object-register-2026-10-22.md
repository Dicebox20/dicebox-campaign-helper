> **OWNER HOUSE / GROVE / MAZE / BATHHOUSE V2 OVERRIDE — 2026-10-22:** This historical ~43-scene register is **not current build or Scene PREPARE authority**. Latest owner-directed architecture moved Studio/Candle upstairs, removed separate Spine Room, added rear Family Room/Deck, Basement Supply Closet, separated Sune's **square-path nine scenes** from the **northwest Forest Maze**, and approved a compact expanded seven-surface-room Bathhouse with Herbal replacing Soap Room label. See [53-card all-scene PREPARE](./all-scene-preparation-register-v2-2026-10-22.md) and [preflight](./all-map-preparation-preflight-v2-2026-10-22.md). Keep this file intact beneath this notice as versioned historical Foundry requirement evidence; do not inject its old door coordinates or deprecated SG-07 Well location.

> **HOUSE V2 OWNER OVERRIDE — 2026-10-22:** This was a pre-v2 feature register. **Do not implement `H-U06` as a room/scene.** Sophia's (`H-U05`) Spine Mosaic opens a concealed, non-traversable **bookshelf compartment** with one Gond emblem half. Use in-scene Tile/interaction/item pickup and persistent claim, not a Wall-door/Region teleport. The separately hidden Candle Workshop moves upstairs with Dahlia's Studio. Remaining house locations, connections and map counts must be reconciled to [House Layout v2](./blueprints/house-layout-revision-v2-2026-10-22.md) before building. [Binding correction](./blueprints/spine-mosaic-compartment-owner-correction-2026-10-22.md).


# Cabin in the Ashen Veil — Scene Object and Feature Register (Foundry planning)

**Date:** 2026-10-22. **Scope:** one draft implementation checklist for all approximately 43 logical locations, reconciled from the historical 31-scene rough atlas, five House Master V1 story rooms, and replacement of the old single Grove + single Maze entries with **nine SG scenes**. **Not a frozen count, not Foundry scene IDs, not installed documents**. See [Puzzle audit P01–P31](./foundry-puzzle-requirements-audit-2026-10-22.md) for interaction/state contracts.

**Abbreviations:** W = native Foundry Wall/physical boundary; D = door/lock; R = paired transit or gated interaction Region (actual interaction via verified adapter); T = stateful Tile/overhead layer; I = explicit player use/pickup UI + Item; J = Journal/Note/inspect content; L = Ambient Light; S = Ambient Sound/playlist; A = Actor/Token; V = coordinated scene variant. These are **object classes likely needed**, not promises that each marked object is already available or a fixed quantity. Typical scenes also need a configured Scene, logical scale, background and safe token arrival. **P** identifiers below reference the puzzle audit.

## House ground floor — 8 logical scenes

| ID / room | Required permanent visual anchors | Foundry placement/actions to author | State / puzzle IDs |
|---|---|---|---|
| H-G01 Dining | Family table, seating, sideboard, ordinary door to Foyer | W, D/R Foyer, optional domestic J or S | Story only; no invented mandatory puzzle |
| H-G02 Foyer | South porch entry, north Great Room door, west Dining, east Kitchen; grandfather clock, entry rug/coat bench; visibly different up/down stairs | W, four D/R, upward R to Upper Gallery, Weathered-Key D/R down to basement, clock T/I, optional ticking S | P05 P12; clock open / Hour Hand claim / basement gate |
| H-G03 Kitchen | Cooking hearth, preparation surfaces, family kitchen, pantry door | W, D/R to Foyer and Pantry; optional unlit hearth fixture L later | No required collectible |
| H-G04 Pantry | Shelves, food stores, modest interior doorway | W, D/R Kitchen; optional J | Story only |
| H-G05 Allen's Study | Locked entrance, workbench, drawings and 587 journal; preserved Rufus with **two** empty eye sockets | W, Brass Study Key D/R, J note 587, two eye-slot T/I, jaw/button/body T/I, uncharged source Item | P08 P22; no early source |
| H-G06 Great Room | North hearth, family furnishings/portraits, blueprint drafting table at center, distinct 027 lockbox, doors Foyer/Study/Studio | W, three D/R, separate player-readable **BP-3** house blueprint J, 027 inspect/lockbox T/I, pellet Item; atmospheric L/S later | P07; hearth remains area is delegated non-gory story staging |
| H-G07 Dahlia's Art Studio | Early doorway; vanity/mirror fitting; 027 clue **painting**; artist furnishings; Sune shrine; intact concealed east wall | W, D/R Great, J painting, vanity mirror T/I and keys, shrine I, secret east Wall/Tile and R to Candle Workshop | P02 P07 P19 P27; second prayer different reward |
| H-G08 Candle Workshop | Candle-making furnishings and Wick fixture; concealed door | W, initially unavailable secret D/R from Studio, Wick pickup, optional clue J | P19 P20; scene hidden until prayer |

## House upper floor, attic, roof, basement — 10 logical scenes

| ID / room | Required permanent visual anchors | Foundry objects / actions | State / puzzle IDs |
|---|---|---|---|
| H-U01 Unused Nursery | Preserved dusty crib/furnishings, family-loss story | W, D/R Gallery, optional J | No invented living child or combat |
| H-U02 Upper Gallery | True overlook/central Great Room void; landings and distinct Parents/Sophia/Nursery/Guest thresholds; hatch | W/railing LOS, five D/R incl upstairs Foyer arrival, attic hatch T/I/R; token-fall/level safety | P04; void not traversable |
| H-U03 Guest Bedroom | Guest bed, storage, household continuity | W, D/R Gallery | Story only |
| H-U04 Parents' Bedroom | Coat, nightstand, Hope Chest, windows/roof route | W, D/R Gallery, Old Iron Key I, nightstand repair T/I and Gate Handle, Silver-key chest T/I, Music Box + Prayer J/I, roof escape R | P12 P18 P21 |
| H-U05 Sophia's Bedroom | Bed, torn bear, two existing storybooks, six-book Spine Mosaic bookcase | W, Old Iron Key D/R, bear/eye I, six book/bed spawn T/I, puzzle J/UI, secret bookcase Wall/T and R | P21 P24; sixth book Veil-only |
| H-U06 Spine Hidden Room | Post-puzzle hidden chamber; Gond emblem half fixture | W, hidden bookcase D/R, emblem reward I | P24; room not visible early |
| H-AT Attic (working key) | Hatch arrival, storage, Minute Hand, Winder, storybook | W, R Upper Gallery, 3 separate item pickups, optional sound | P04 P05 P06 P24 |
| H-RF Roof and chimney (working key) | Traversable roof, distinct chimney clock and flue book, Parents' window entrance | W/edge safety, R Parents, clock dial/insert T/I, button/Gear I, flue book I | P05 P24 |
| H-B01 Basement Workshop | Foyer locked descent, invention workbench, repair-tool spot and Vault gate | W, R Foyer, I tool, Vault four-gate Wall/door/R | P12 P28 |
| H-B02 Secured Vault | Four-part Gond/Sune mechanical actuator, Keystone plinth | W, gated D/R Workshop, four prerequisite I/state checks, Keystone I/T | P28; no Bowl |

## Sune's Grove — exactly 9 separately planned connected maps

**Correction:** Sune's Grove is the whole nine-map woodland maze; **SG-05 alone is central Memorial Clearing**. Do not merge SG-05 with every other scene or add a separate tenth memorial. Each scene needs matched R entry/exit pairs and grounded tree-base W (overhead canopy T only when tokens can go beneath it). Use distinct landmark assets, modest atmosphere L/S, no automatic discovery clutter.

| ID / scene | Visual anchors and neighboring routes | Foundry-specific requirements |
|---|---|---|
| SG-01 Ash-Bark Switchbacks | Distinct crooked ash trail and split stone, SG-02/04 | W, two R, optional shadow T/J P31 |
| SG-02 Old Processional Path | Mossed stepping stones, SG-01/03/05 | W, three R, optional early Sune-order hint J only if canon clue chosen P06 |
| SG-03 Iron Gate Thicket | Wrought-iron gate, Yard northwest gate, SG-02/06 | W, scene-portals, gate lock/open-from-inside state D/T; preserve reversibility P13 |
| SG-04 Mossbound Orchard | Old orchard/bench, SG-01/05/07 | W, three R, optional family J |
| SG-05 **Memorial Clearing** | Sune statue cupped empty hands, four separate busts SW/NE/NW/SE, base stone sliding relief, coin bag hiding Brass Study Key, one unborn-child grave; SG-02/04/06/08 | W, four R, many **specific** I anchors, bust order, relief puzzle T/UI, reward I, dormant↔activated V with water/undercroft access, NW chase A/R on **both variants**. P06 P17 P29 |
| SG-06 Western Shrine Approach | Distinct wooded shrine entrance/stone path; Yard west trail, SG-03/05/09 | W, four paired R, keep early Study route reachable P06 |
| SG-07 Rootbound Well | Stone well and underground connection, SG-04/08 | W, two forest R + reversible Aqueduct R, chase-safe landing P13 P14 |
| SG-08 Briar Crossroads | Recognizable path junction, SG-05/07/09, Gazebo spur | W, four R; gazebo scene separate P20 |
| SG-09 Glasshouse Approach | Old horticultural path/pipes, SG-06/08, Greenhouse door | W, three R, Greenhouse sprinkler ambiance linked to pressure state P15 |

## Other estate exterior/outbuilding maps — 7

| ID / scene | Required visible features | Foundry objects / state |
|---|---|---|
| EXT-01 Carriage Yard / Cabin Exterior | **OWNER-ACCEPTED PAINTED ART**: cabin front porch/door, open circular turning yard, locked carriage southwest, NW wrought iron gate along trail, Shack route, Shrine west trail, Privy approach, pond bank/dock, south arrival road | W on physical fences/rock/trunks only; all paired R; carriage lock and content J/T, Ladder Hook I; ambience L/S; gate D from SG-03 and world state. **Art APPROVED, geometry/runtime NOT VERIFIED**. P03 |
| EXT-02 Pond and Shorelines | Full/drained/refilled banks, sluice, hollow log book, Old Fishing Rod, boat/older boat with Mirror, near/far shore/Boathouse route, hidden Aqueduct threshold | W for banks/terrain, multiple R, full/drained V, sluice I, Oars/boat transport, unique Mirror/Book/Fishing Rod/Weathered Key I; conditional far-dock vegetation T. P01 P09 P10 P13 P24 P26 |
| EXT-03 Donovan's Shack | Groundskeeper furnishings, 587 lockbox, oil, Oars, personal clues | W/D/R, 587 code UI and Sluice Crank I, Oars/Oil I, Journal clues. P01 P08 P20 |
| EXT-04 Privy | Humble privy, small fishing/retrieval anchor | W/D/R locked till Veil, Regionwright mini-game or alternative I, Copper Tiny Key I, optional odor S. P25 |
| EXT-05 Forgotten Gazebo | Pristine carved stone picnic base with decayed canopy, lantern, cobwebbed hidden Eye #2 and optional picnic-table motifs | W/trunk semantics, R SG-08, Oil+Wick I, web T/FX, Eye #2 I; optional Surveyor's Rule puzzle I/T. P20 |
| EXT-06 Greenhouse | Greenhouse walls/sprinklers, recipe/mixing bench, planters/ingredients | W/D/R SG-09, water/sprinkler T/L/S, recipe I/UI, mix item, restore from Utility state, advanced greenhouses Shadow story overlay optional. P15 P26 |
| EXT-07 Boathouse | Far dock structure and Prayer of Devotion fixture | W/D/R Pond, Prayer J/I, blocked shoreline entrance conditional vegetation T elsewhere. P26 |

## Bathhouse cluster — 4

| ID / room | Visual anchors | Foundry objects / state |
|---|---|---|
| BATH-01 Bathing Hall | Family pool, rim and stairs, discreet drain, towels/bench/copper pipes; dried pool mosaic and Screwdriver under water | W, external/Soap/Boiler D/R; full/drained V, full-hot atmosphere effects; Screwdriver I, three rotatable ring UI/T, sealed hatch and Reliquary R; explicit heal action gated by all conditions. P09 P10 P11 P16 |
| BATH-02 Soap-Making Room | Soap bench, jars and **glass lye case** | W/D/R Bathing Hall, Copper key case lock/T, lye I, story recipe J optional. P26 |
| BATH-03 Boiler Room | Boiler, pressure machinery, valves, heat plumbing, discreet dry service exit | W/D/R Bathing Hall, Boiler puzzle UI, L/S/steam T, Reliquary service door D/R operable from inside. P11 P16 |
| BATH-04 Rosewater Reliquary | Dry devotional Bowl plinth, stone rose ornament, safe stair arrival, dry service egress | W, R drained Bath hatch and Boiler, inside-unbolt D; Bowl I/T, bowl removed state. P11 P29 |

## Aqueduct and waterworks — 2

| ID / scene | Visual anchors | Foundry objects / state |
|---|---|---|
| AQ-01 Main Aqueduct and Charger | Gear + Handle gate, engineered tunnels/chase route, Gondian charger, utility side door, forest-well approach | W/D, travel R Pond↔SG-07 and Utility, gate slots I, one-time chase A/R, source charger I and Veil trigger, water S. P13 P14 P23 |
| AQ-02 Waterworks Utility | Three valve/gauge sets; rock/earth debris in Greenhouse-line inlet, small maintenance compartment | W/D/R AQ-01, blocked intake I/check, pressure puzzle I/UI, compartment T + Allen warning Journal and Collar I, supply-state integration. P15 |

## Undercroft and finale — 3

| ID / scene | Visual anchors | Foundry objects / state |
|---|---|---|
| UD-01 Undercroft Approach | Sune activated stair arrival; visible sealed **ornate Keystone door** | W, R SG-05, inspectable door J and Keystone use I, gated R to Refuge with controlled Wall. P29 P30 |
| UD-02 Sealed Refuge | Donovan + Sophia dry remains, **scratches on inner face** of thick door, protected resting nook, farther hall | W, R from UD-01 only after Keystone, inspectable story J, door return, R toward Ritual later. P30 |
| UD-03 Ritual Chamber | Beyond-refuge final destination, currently **DEFERRED by owner** | Reserve scene key and return R; ritual NPC/FX/lighting, encounter design OPEN. Never assign geometry/combat until finale design. P30 |

## Required scene bundle / compiler fields

Every scene spec should carry:
- logical location ID + stage ID (if applicable), controlling canon/provenance, asset hash, physical bounds, coordinate frame/scale, authoritative obstacle/roof/floor feature manifest;
- **exact bidirectional exit** list with map-local geometry, logical destination (and active-stage resolver), fallback/GM recovery, expected arrival footprint;
- Walls including types and occlusion direction; explicit Door IDs and unlock prerequisites; separate overhead Tiles and token-cover visibility tests;
- critical fixture manifest: stable semantic ID, visible image anchor, fixture/use Item requirements, Journals, independent visual states, one-time rewards, authoritative shared state, Region geometry or click provider;
- ambient lighting/weather/sound specification (even for scenes where the correct count is **zero**);
- actor/event/encounter slots, per-player discovery cap, save/restore, approval and runtime test evidence;
- object-count-by-type **estimated at PREPARE**, **actual only after authoritative Foundry reread**. Inventing blank filler Regions or lights to satisfy a quantity is forbidden.

## Hard implementation constraints

1. The latest owner “Good Enough” rule affects **art acceptance**, not Wall collision, Region routing, puzzle guards or story integrity.
2. 43 is a **working logical map count**; multiple Pond, Bath and Memorial stage Scene assets may increase the installed count. Every real separately explorable house room still receives a separate scene.
3. Regionwright integration responsibilities remain **unverified** until an exact runtime/probe. Do not assume generic clickable Regions, non-native puzzle UIs, active-GM execution or party-wide stage swaps from native Foundry API documentation.
4. Native scene player permissions, privacy, state rehydration, token and item access must be tested. All clues and pickups need idempotency and anti-softlock safeguards.
5. Discovery regions follow existing Sparse Discovery Standard: 0–1 per ordinary scene, maximum 2 unless explicit special-scene exception. Ordinary visible, already-known quest fixtures should use purposeful interaction rather than auto-discovery rolls.
6. Separately count **scene transition Regions** and **exploration discovery Regions**; discovery density limits do not count normal doorway Regions as discoveries.
7. EXT-01 art was approved visually but has no verified pixel-to-foot Scene scale/region mapping; its former proposed extent has a different aspect ratio from the approved 1536×1024 art. **Reconcile geometry before injection**.

**Primary sources:** [Puzzle audit](./foundry-puzzle-requirements-audit-2026-10-22.md); [House Master](./blueprints/house-master-v1-2026-10-22.md); [Decision catalogue](./campaign-decision-catalogue-2026-10-20.md); [Nine Grove](./grove-nine-scene-and-estate-refinement-plan-2026-10-22.md); [Bathhouse PREPARE](./bathhouse-map-prepare-cluster-v1-2026-10-21.md); [Batch 01 PREPARE](./ashen-veil-fast-batch-01-prepare-cards-2026-10-22.md).
