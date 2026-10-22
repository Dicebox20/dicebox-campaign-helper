# Cabin in the Ashen Veil — Rosewater Reliquary / Scrying Bowl (Owner-Delegated Design Decision)

**Date:** 2026-10-21. **Scope:** side-campaign narrative, scene placement, deterministic item chain and map PREPARE planning.
**Decision authority:** Owner explicitly delegated the placement and retrieval design to the assistant (“I'd like you to decide where to place the scrying bow, and what they should have to do to retrieve it”). This is an **ASSISTANT-SELECTED, OWNER-DELEGATED campaign design decision**, not a claim of verbatim prior owner-approved specifics or project-wide workflow policy. All older owner-established puzzle chains remain authoritative where not modified below.
**Implementation stage:** Design locked for continuity; specific map geometry/visual art and Foundry interfaces are PREPARE drafts, not approved rendered scenes. No Foundry/Regionwright modification or verified test.

## A. Chosen physical location and reason

**The Rosewater Reliquary** is a **standalone underground scene beneath the Bathhouse bathing hall**. The entry is uncovered when the **sluice is opened and the Bathhouse pool drains**—the same preexisting mid-game event that reveals the **Screwdriver** on the bath floor and drains the pond. The Bowl is **not** in Allen's four-prerequisite final Vault; that Vault still contains the **Keystone** for Donovan and Sophia's ornate Undercroft door.

**Historical/environmental purpose:** Allen built a concealed, dry stone water-maintenance and devotional chamber beneath the Bathhouse for Dahlia, combining Gondian practical construction with Sune's motifs. Its architecture should show that the family lovingly made the estate rather than simply laying sinister traps. The Bowl is protected on a deliberately dry, sheltered devotional plinth. The precise story of who deposited the Bowl and at what moment during the original ash-zombie attack is **not fabricated**; its presence is compatible with the established idea of protecting a sacred object during the disaster, but the exact final hiding incident remains open. Environmental storytelling is gentle and restrained, not an early lore dump or ritual reveal.

## B. Required player sequence and puzzle solution

1. **Use the existing Sluice Crank** obtained from Donovan's Shack combination lockbox `587`. Opening the sluice drains the pond and Bathhouse pool together, globally.
2. **Visit emptied Bathhouse bathing hall.** The established Screwdriver appears on exposed pool floor, independently recoverable without special rolls. Also visible on the pool floor is a distinctive **12–15-foot stone rosewater mosaic** made of *three concentric independently rotatable rings* with engravings of water-channel segments. The emblem is not a trapdoor glyph or magic sigil, but a physical engineered mechanism.
3. **Examine mosaic visually.** Water-channel segments on each ring are misaligned. A carved water/wave inlet at the exterior rim and a small Sune rose at the center reveal intended start/end, so the actual puzzle can be solved from map fixtures without random Perception DCs, cryptic extra numbers, or requiring Allen's Study or later Grove knowledge.
4. **Player rotates each ring** through cardinal quarter-turns (0/90/180/270 degrees) until one continuous physically plausible groove leads inward from wave inlet to rose center. All turns are reversible, progress is not randomly reset, and a completed state is recognized deterministically from exact ring orientations. Use a local narrow Regionwright puzzle UI or stateful image tiles, after runtime capabilities are verified. No new collectible or one-use tool is needed to turn the rings, and the separately collectible Screwdriver stays available for the parents' drawer repair.
5. **On exact correct alignment,** a catch releases and the mosaic's central hatch retracts, exposing safe stone stairs under the empty pool into the **separate Rosewater Reliquary Foundry scene**. Correct alignment is persistent; the mechanism cannot repeatedly award another Bowl. This is a *new puzzle outcome* distinct from simply obtaining the Screwdriver.
6. **Descend and examine the room.** Sune's Scrying Bowl rests visibly on a dry stone plinth with an overhead stone canopy to protect it from moisture. Players deliberately take it; Item acquisition is separate from puzzle solution and is idempotent.
7. **Exit by the dry maintenance service route** connected to the existing **Bathhouse Boiler Room**, in addition to the temporarily available bath-bottom stair while drained. The discreet door can be unbolted **from the Reliquary side without using the boiler puzzle**, and remains accessible for escape and later return. Its sealed/watertight masonry ensures refilling the Bathhouse cannot drown or trap a party still in the reliquary. This route is a short service passage represented as transition anchors in the already distinct Boiler Room / Reliquary scenes, **not automatically another full playable map**. Exact wall geometry awaits PREPARE.
8. **Close sluice and refill Bathhouse later.** The pool is full again, submerged hatch is safely closed to water, and the independent service exit remains usable. Healing becomes enabled *only* with sluice CLOSED, pool FILLED, Aqueduct Waterworks RESTORED, boiler puzzle COMPLETE, and water HEATED. Retrieving the Bowl does not require solving Waterworks, boiler, or refilling; its availability precedes the late Groves/Crimson Veil chain.
9. **Take the Bowl to Sune's Memorial Clearing** together with the preexisting filled Dust of Dryness pellet from Great Room `027`; placement and slow-release channel mechanism reveal the **outer Undercroft access** so players can see the **ornate Keystone door** early. The four-condition Vault later yields Keystone, which opens the barrier Donovan dug against; his and Sophia's bones are behind it, followed by passage to Voss's ritual.

## C. Explicit puzzle triggers / cross-scene state (logical names only)

| Trigger and location | Required precondition | Persistent effect | Player-visible cue |
|---|---|---|---|
| `sluice:toggle-open` at Pond/Carriage Yard | Sluice Crank installed | Pond and bath pool become empty | Draining water, exposed pool floor and old rowing site |
| `bath:rosewater-mosaic-interact` | Pool empty and actor reachable | No global state until solved; 3 local ring positions | Carved discontinuous grooves, ring rotation |
| `bath:rosewater-aligned` | All 3 exact correct orientations | `rosewaterHatchOpen=true` | Central 12–15-ft mosaic catches disengage, stairs appear |
| `bath:stair-traverse` | Pool empty, hatch opened | Transfer token to new Reliquary scene entry | Safe visible stair portal |
| `reliquary:bowl-recover` | Bowl not yet taken | `scryingBowlTaken=true` and valid Item acquisition | Bowl disappears from plinth once taken |
| `reliquary:service-door-unbolt` | Reach service door from Reliquary | `serviceDoorUnlocked=true` | Mechanical latch visibly opens; return to Boiler Room possible regardless of water/boiler stage |
| `sluice:toggle-closed` | Existing sluice operation; no special bowl prerequisite | Bathhouse pool fills; healing availability recalculated | Pool water and entrance-cover visuals update; service door remains safe |
| `grove:statue-bowl-place` | Scrying Bowl acquired | Bowl installed as persistent visual/item state | Statue holds Bowl |
| `grove:pellet-insert` | Bowl installed; filled pellet acquired | `groveActivated=true`; outer Undercroft entrance accessible | Water channels activate / activated Grove scene variant |

**Puzzle render detail:** Wave inlet → three continuous grooved rings → central rose. The icon shapes, number of ring positions and geometric endpoints must be directly legible at 120px per five-foot map scale. If the actual inspection finds the mechanism is too small, enlarge the floor device/fixture footprint rather than adding invisible hit zones.

## D. Anti-softlock and narrative constraints

- Both Screwdriver and Bowl are obtainable after **one drain**; no double-drain gate, additional valve logic, invented password, and no need for water pressure while the sluice is open.
- The bowl path must be usable **before** Waterworks restored, boiler heated, both emblems acquired, or final Vault opened.
- **Bath filled** must never be interpreted as **healing available** unless sluice closed, pressure restored, boiler operational and water heated.
- A single-use/irreversible water-state change cannot trap anyone below. The dry exit to Boiler Room opens manually from inside at any time. Incoming travel after refilling can use service route after it has been opened.
- Regionwright rotation interface **and** native Foundry teleport mechanics are not presumed implemented; bind only to verified APIs under exact-world active-GM safety and deterministic receipts.
- Keep original third-person horror narration and portrait/notes in correct places. No ritual-spoiling or modern Voss artifacts in this mid-game family room, and no blood/gore in pre-ritual materials.
- No retroactive use of the old retired 29-map roster.

## E. What gets rendered (narrative fixtures)

**Bathing hall:** tiled bathing pool with visibly fitted rim; low water/wet and drained floor versions; 12–15-ft concentric rosewater mosaic in the floor; clearly separate Screwdriver visual anchor; bath bench/towel storage, intact family domestic details; main entrance and distinct Soap/Boiler doorways. Filled-state underwater mosaic must remain a subtle visual foreshadowing, not an instantly legible solved puzzle. Drained state reveals each grooved ring and safely traversable stair/hatch area.

**Reliquary:** modest dry masonry (no generic crypt/coffins), Allen-like robust stone/copper engineering, Dahlia Sune rose decoration, dry stone Bowl plinth, waterproof low reliefs suggesting careful preservation, first-arrival stairs from Bathing Hall, **dry service route to Boiler Room**. Bowl appears on a separate independently recoverable prop/tile, not permanently painted as an always-present pickup.

**Boiler Room compatibility:** visible discreet one-way service hatch on its rear/southwestern masonry or similar seam; no need to repair boiler or restore pressure for emergency egress. Its stage-specific healing dependency remains unchanged.

## F. Source and workflow contract

- [Historical Bowl / Undercroft and healing v3](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md)
- [Questline scene count / Bathhouse](./questline-map-inventory-2026-10-21.md)
- [Owner continuity catalogue](./campaign-decision-catalogue-2026-10-20.md)
- Project source standard: `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md` and `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`.

The workflow remains **PREPARE → STRUCTURAL_RENDER → STRUCTURAL_INSPECT → FEATURE_MANIFEST / BLUEPRINT_RECONCILIATION → PAINT_RENDER → FINAL_INSPECT(PASS = APPROVED) → BUILD → STAGE → INJECT → VERIFY → RECEIPT**. This decision locks narrative/puzzle logic and item placement, **not** render approval, blueprint coordinates, click adapter code or Foundry install. The separate Map PREPARE draft will record the rooms and placement requirements; exact room dimensions remain reviewable until spatial inspection.
