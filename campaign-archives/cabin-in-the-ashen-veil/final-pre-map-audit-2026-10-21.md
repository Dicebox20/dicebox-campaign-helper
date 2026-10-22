# Cabin in the Ashen Veil — Final Pre-Map Creation Audit (2026-10-21)

**Classification:** Side-campaign, design/continuity + procedural gate audit. **Not** a Foundry/Regionwright runtime test, approved render, compiled Scene, product KB rebuild, or final owner signoff. Audit reflects sources already preserved in the `codex/cabin-ashen-veil-recovery` campaign recovery branch; historical documents are preserved intact except optional supersession notices.
**User request:** “that works for me, do one more audit to make sure we have no loose ends.”
**Current authoritative Bowl placement:** explicitly owner-delegated and later accepted Rosewater Reliquary design, not the earlier uncertain Bathhouse proposal and not the historical Vault prize.

## 1. Scope and source precedence

Reviewed:
- [Rosewater Reliquary / Bowl location and retrieval](./rosewater-reliquary-bowl-decision-2026-10-21.md)
- [Bathhouse four-map PREPARE draft](./bathhouse-map-prepare-cluster-v1-2026-10-21.md)
- [Undercroft / Keystone / Bathhouse heating v3](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md)
- [Sune Shrine and staged location v2](./sune-memorial-clearing-puzzle-design-v2-2026-10-21.md)
- [Staged scene transition contract](./staged-map-transition-design-2026-10-21.md)
- [Questline-only scene census](./questline-map-inventory-2026-10-21.md)
- [Decision chronology catalogue](./campaign-decision-catalogue-2026-10-20.md)
- [Original recovered 1,321-message transcript](./campaign-chat-transcript.md) via earlier cited provenance, plus [October 20 puzzle audit](./artifacts/library-files/Cabin_in_the_Ashen_Veil_Puzzle_Chain_Audit_2026-10-20.md) and [October 19 conflict audit](./artifacts/library-files/CONFLICTS-AND-DEPENDENCY-AUDIT-2026-10-19.md)
- Canonical project SOP in `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`, `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`, `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`, `docs/DICEBOX-EXPLORATION-DISCOVERY-STANDARD-2026-10-05.md`, and `docs/NEW-DATA-IMPLEMENTATION-RULE-2026-10-07.md`.

Older references to Chauntea, Bowl inside Allen's Vault, 29-map roster, Gazebo sixth book, one Rufus eye, lye inside Candle Workshop or Basin screwdriver inside workshop, are historical superseded evidence only.

## 2. Prerequisite graph audit — PASS as a design-level abstraction

A bounded logical dependency/reachability model of **57 quest action/item/state nodes** was checked by topological sorting. The graph had **zero unresolved nodes / no cycles** under established starting access, confirmed acquired-items and stipulated state transitions. The test is **not** a complete game simulator and assumes the later Grove cue and return passages can actually be used; these remain explicit below.

**Verified ordering / correctness statements within conceptual graph:**
1. Oars -> old rowboat mirror -> Studio vanity -> Carriage Key / Brass Tiny Key -> carriage hook -> attic -> Clockwork Winder -> four busts SW→NE→NW→SE -> stone relief -> Brass Study Key -> Study 587 -> Shack lockbox -> Sluice Crank.
2. Sluice open -> pond and Bathhouse drain. Pond reveals Weathered Basement Key; bath floor reveals Screwdriver **and** accessible three-ring Rosewater mosaic. Each reward independent; there is **no** need to sacrifice the Screwdriver to turn the rings.
3. Rotated rosewater rings (wave groove→central Sune rose) -> hatch -> independent dry **Rosewater Reliquary** -> Scrying Bowl. Its source requires **no** Aqueduct Waterworks, boiler, Emblem, Keystone or Crimson Veil completion.
4. Separate Brass Tiny Key / Hour Hand plus attic Minute Hand -> roof clock noon -> Replacement Gear; Screwdriver repairs Parents' nightstand -> Gate Handle; Gear + Handle open Aqueduct.
5. First chase -> maze / well; **sluice closed** then allows first Waterworks pressure puzzle, restoring Greenhouse water **and** boiler supply. Separate second Boiler puzzle restores heat. Heal **only** with sluice closed + filled bath + Waterworks restored + boiler solved + warm water; a prior boiler-success flag alone is insufficient.
6. First Waterworks puzzle -> warning / Rufus collar -> later NW-bust chase -> Silver Tiny Key -> Hope Chest Music Box -> Prayer of Protection -> Candle Workshop Wick -> oil-lantern Gazebo -> second Rufus eye; first eye from Sophia's bear; Rufus mechanism -> source; Aqueduct charger -> Crimson Veil.
7. Veil -> sixth book on Sophia's **bed** -> complete six-storybook chronology -> Gond half. Veil -> privy Copper Tiny Key -> Bathhouse Soap Room lye -> Greenhouse plant killer -> far Boathouse Prayer of Devotion -> Sune half.
8. **Bowl + Great Room 027 pellet** at Sune shrine independently opens *outer* Undercroft and visibly sealed ornate door. Four unchanged Vault prerequisites (basement access, charged source, Gond/Sune halves) award **Keystone**, which opens Donovan/Sophia's **inner** ornate door. The skeleton refuge and hall lead to ritual with Voss/Vharzagul. Keystone is **not** a fifth Vault-input collectible.
9. Bathhouse/Reliquary standalone geography is included in previous **provisional 31 logical questline scenes**; Sune dormant/activated and Bath full/drained are **asset/stage variants**, not separately counted story locations. The count remains **planning-only**, not a quota or resurrection of retired 29-map proposal.

### Important limits of this PASS

The 57-node graph verifies only **proposed rule ordering**. It does NOT prove visual discoverability of the bust clue, navigability of real Foundry scene transitions, time/phase gating, uniqueness of ring puzzle solution, a safe ability to shut sluice, or actual synchronized world state. Those issues are still live open items.

## 3. Readiness ledger — precise blockers and lower-priority choices

| ID | Priority / point of work | Remaining issue | Recommended resolution / owner |
|---|---|---|---|
| **MAP-01** | **BEFORE BATHHOUSE STRUCTURAL_RENDER** | Bathhouse bathing hall, Rosewater Reliquary, and Boiler Room must form *physically coherent two-level geometry*: bath-floor staircase down and an always-escapable DRY service stair/hall up to Boiler Room. The draft's `SE` boiler doorway and reliquary's east-side service door are not yet measured. | Treat four Bathhouse rooms as an adjacency cluster; lock cross-room entry/exit coordinates, elevation shifts, geometry and one-way latch. A short non-explorable service passage can be represented by two teleport anchors only if the building layout makes sense. Do not render disjoint conflicting routes. |
| **MAP-02** | **BEFORE BATHHOUSE STRUCTURAL_RENDER** | The three-ring rosewater mosaic has visual rule but **no physical ring artwork, exact start/solution orientations, entrance-to-rose endpoints, or proven solvable/unique state**. Rings must not intersect the newly opening center stair footprint. | Establish a ring-by-ring coordinate/angle solution table and one deterministic legal turn sequence; ensure every potential wrong state remains recoverable. Structural render must show recognizable segment geometry, with UI enlarged as needed. Regionwright runtime code may follow. |
| **MAP-03** | **BEFORE BATHHOUSE STRUCTURAL_RENDER** | Filled/drained/heated rendering ownership and full-to-drained token movement: deep pool versus walkable floor, sealed hatch, hidden Screwdriver, rotation tiles and healing hot water are not yet in a concrete Spatial Blueprint. | Lock one shared pool outline/coordinate system; render filled and drained states consistently (two variant Scenes or equivalent proven backgrounds). Hot water as optional overlays; ensure objects only visible in correct states, no false traversability. Stage change safety for tokens in water/pool is required before live application. |
| **MAP-04** | **BEFORE BATHHOUSE STRUCTURAL_RENDER** | Exact exterior placement and door orientation are not yet reconciled to owner's authoritative estate picture with southwest Bathhouse fork; 60×50/30×25/35×30/40×30 ft are **composition targets** only. | Fix logical geometry, entrances and camera/scale to the existing estate reference; check reasonable fit/clearance and overhead artifact legibility. Preserve one map per independent room. |
| **TRANS-01** | **BEFORE FOUNDY INJECT / MULTI-STAGE GO-LIVE** | Closing sluice may refill Bathhouse while a player is inside the Reliquary, using bath floor stair, or inside a drained pool. Service exit prevents narrative softlock but does **not** alone prove multi-token safe scene replacement. | Make reliquary dry exit work without Waterworks/boiler completion, reserve safe re-entry to Boiler after unlatching, require safe token relocation and read-back during filled/drained swaps; define handling for disconnected users. Never consume/duplicate Bowl/Screwdriver on retries. |
| **TRANS-02** | **BEFORE Sune multi-stage INJECT** | Party can obtain Bowl+pellet and activate **Stage B Grove early**, BEFORE late-game NW Crooked Man chase. If the NW Region exists only in dormant Stage A, the Silver Tiny Key sequence softlocks. | Stage B MUST implement the same conditional NW approach trigger and key drop, or route both variants into a canonical encounter adapter keyed on world phase; stage A/B state and travel links must preserve late chase readiness. **Never gate early Bowl use solely to avoid this.** |
| **TRANS-03** | **BEFORE MULTI-SCENE INJECT** | Logical-location destination rerouting and full-party transfers are *proposed adapter contracts*, not verified behavior for current Foundry/Regionwright stack. | Prototype one two-scene staged transition with active GM, exact Scene IDs, authoritative permissions, idempotent transfer and recovery, including edge cases before applying to Grove/Bathhouse/Pond. Record valid target labels and reverse links. |
| **PUZ-01** | **BEFORE GROVE RENDER** | Bust-order clue available *before* Study remains unapproved. Four rose-life-cycle pedestal carvings are a working design proposal only. | Confirm a clear environmental cue for SW→NE→NW→SE and decide incorrect-bust response; art must support it without requiring a post-Study journal. Sliding portrait/relief grid implementation remains Regionwright-owned. |
| **PUZ-02** | **BEFORE GROVE LATE-CHASE IMPLEMENTATION** | The specific condition arming second Crooked Man chase at late NW bust is not exact. If tied solely to 'Waterworks solved', players might accidentally trigger too soon; if tied to 'read journal', they might miss it. | Explicit late milestone + time/return window, accessible journal clue and fallback; ensure both Scene variants have trigger, event/drop once, no early encounter and no post-Veil player chase. |
| **STORY-01** | **BEFORE UNDERCROFT RENDER** | How Voss is conducting an active ritual **behind an ancient sealed Keystone door** if estate-side players cannot enter yet; room transitions/hall lengths and whether the hall is an independent map are undecided. | Choose consistent ritual access/lore and place it in final Undercroft topology; render inner-face Donovan digging marks and both skeletons only **behind** the locked door, with boss deeper beyond remains. |
| **STORY-02** | **BEFORE REST OF HOUSE/GROVE FINAL MAP ROSTER** | Grove vs Memorial naming/footprint equivalence, one-room-per-scene house floorplan, and narrative-only rooms such as unused nursery remain unsettled. | Reconcile against approved exterior rough map and individual room inventory, preserving story legibility. Do not prematurely lock the number of maps. |
| **PUZ-03** | **BEFORE SPINE MOSAIC BUILD** | Exact six storybooks' formal publication order and player-facing clues not finalized; don't accidentally restore superseded Gazebo/Boathouse placements. | Determine publication order and cover/spine visual assets before rendering Sophia bookcase puzzle. Sixth book must appear on bed only with Crimson Veil. |
| **PUZ-04** | **BEFORE GREENHOUSE / WATERWORKS BUILD** | Waterworks valve solution, debris skill DC and Greenhouse recipe/mixing solution are delegated to Regionwright and not built/tested. | Coordinate visuals/controls with Regionwright design specification; no arbitrary DC until approved environmental features and Discovery standard checks. |
| **SYSTEM-01** | **BEFORE HEALING BEHAVIOR BUILD** | Optional bathing heal amount, frequency/eligibility, short-rest equivalence and safety during Veil still undefined. | Keep water, steam, bench and interaction anchors visual now; author healing balancing separately before implementation. The five existing mechanical eligibility checks are locked. |
| **SYSTEM-02** | **BEFORE UNDERCROFT FINALE BUILD** | Voss/Vharzagul encounter phases, cosmological explanation (yugoloth vs invading demons), player escape/retreat and ally haunt scripting remain OPEN. | Finish battle/ritual contract after spatial layout, preserving separate Voss and Vharzagul; no boss mechanics inferred from art. |
| **SYSTEM-03** | **BEFORE ANY IMPLEMENTATION** | The four Bathhouse briefs are design PREPARE inputs, not durable `PREPARED` state: **stable Foundry Scene IDs, arrival Region IDs, exact runtime fingerprint and approved Spatial Blueprint** are missing. Read-only reproducible KB/runtime certification and active slice were not executed by this archive audit. | At real PREPARE check active program slice, approved read-only KB and source precedence, assign stable scene/region IDs and geometry, issue approved local durable PREPARE state and hashes; then normal structural inspect/feature manifest/paint inspect/BUILD validator/GM stage/verify flow. |
| **DOC-01** | **DOCUMENT HYGIENE** | Historical Oct-19/Oct-20 audits and older v2 docs say Bowl is in Vault or source is OPEN. These are **superseded snapshots**, not current decisions; readers may misread search snippets. | Retain originals for chronology, but add supersession banners/crossrefs to current Bowl / Keystone design. The current catalogue and newest decision must win. |

## 4. Explicit Bathhouse state matrix (scope boundary)

| Sluice | Pool | Main Waterworks | Boiler pressure/heating | Bath visual | Healing permitted? | Rosewater pool-hatch travel? |
|---|---|---|---|---|---|---|
| OPEN | EMPTY | unsolved/solved | any | Drained; Screwdriver and mosaic visible | **NO** | YES if mosaic solved, safe passage |
| CLOSED | FULL | NOT restored | unavailable | Full and cold | **NO** | NO; watertight hatch; use dry service route |
| CLOSED | FULL | restored | unsolved | Full and cold | **NO** | NO; service route |
| CLOSED | FULL | restored | solved and water heated | Full and hot | **YES**, subject to later healing rules | NO; service route |

The world must derive actual water level from the sluice system; `boilerSolved` is not synonymous with `healingAllowed`. Reopening sluice while hot instantly invalidates healing eligibility, regardless of whether boiler puzzle's solved flag persists.

## 5. Render-first acceptance criteria for the four Bathhouse scenes

- **Bathing Hall:** four narrative/functional anchors clearly legible: fully framed family bathing pool, dry/grimy copper heat plumbing, separate Screwdriver, and **drained** three-ring rosewater mosaic + central wave-to-rose path. Separate exterior/Soap/Boiler door openings with exact exit anchors. Initial full water hides both Screwdriver and playable rotation interface; marks under water may subtly foreshadow it.
- **Rosewater Reliquary:** Bowl visible as removable separate object on dry Sune plinth; preserve care/protection aesthetics (rose and engineering motifs), not a cult burial site. Safe landing from bath, distinct always-unboltable route out to Boiler; no flood when bath pool fills.
- **Soap Room:** practical soapmaking, secured Copper Tiny Key lye case visible as case but item visually contained until key acquired; no false Bowl placement.
- **Boiler Room:** supply pressure manifold and hot-water path, a separate **second** pressure puzzle, and discrete emergency service-door geometry that cannot be mistaken for early bypass of the Rosewater mosaic.

Do not assign generic Notice dice checks to mandatory visible quest fixtures; the established separate Notice→Interpret→Recover policy applies to additional real discoveries after approved art.

## 6. Final audit verdict and near-term next step

**PASS:** Key quest DAG / Bowl-to-Keystone change / one-drain Bathhouse discovery / three-stage water-healing dependency / item reward locations and current canon at design level.

**PASS WITH BLOCKERS, not a claim of “nothing left”:** Bathhouse **MAP-01–04** remain necessary before structural rendering; older puzzle/campaign systems have clearly scoped later gates listed above. None requires reopening the Bowl placement decision or creating a new game engine.

**Recommended immediate bounded work:** Build a single **four-room architectural coordination/Spatial Blueprint PREPARE sheet**, confirm the 12–15-ft rotatable mosaic as a **solvable geometry**, and mark both return routes/elevation. Then start **Bathing Hall structural grayscale render first** under existing Dicebox SOP. Do not begin multi-scene Foundry mutation or declare stage variants operational until a read-only KB query, adapter capability check and test/recovery receipt exist.

**No changes made to any Foundry world, Regionwright repository, active product slice or production KB as part of this audit.**
