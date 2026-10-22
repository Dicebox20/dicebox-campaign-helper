# Cabin in the Ashen Veil — Bathhouse Four-Scene Cluster — Map PREPARE Draft v1

> **PRE-RENDER AUDIT HOLD (2026-10-21):** The [final pre-map audit](./final-pre-map-audit-2026-10-21.md) confirms a logically consistent Bowl chain but requires four remaining PREPARE geometry/semantics locks before structural rendering: two-level service and staircase route, exact three-ring solvable artwork, filled/drained token-safe scene visual states, and Bathhouse footprint/door anchors against owner estate reference. These drafts are **not yet actual PREPARED automation state**.


**Date:** 2026-10-21. **Type:** Campaign-specific design / PREPARE draft; **not** durable `PREPARED` state in active Dicebox automation, not rendered, not accepted Foundry Scene IDs, not a working Regionwright implementation, not a runtime receipt.
**Design decision source:** [Rosewater Reliquary / Scrying Bowl](./rosewater-reliquary-bowl-decision-2026-10-21.md), chosen under explicit owner delegation. Owner's approved existing constraints: Bathhouse off southwest branch from path toward Sune's memorial; separate bathing hall, soap-making room, boiler room; drain Bathhouse with sluice to reveal screwdriver; heal only with sluice closed and pool full, after original Waterworks and boiler puzzle.

## 1. Required physical floorplan topology

```text
SOUTHWEST BRANCH OF PATH TOWARD SUNE SHRINE
                   |
             NE FRONT DOOR
                   |
       BATHHOUSE BATHING HALL  (BATH-01)
         /                  \
NW door to Soap Room      SE door to Boiler Room  (BATH-03)
(BATH-02)                       ^
         |                      |
      drained-pool               | service egress (inside-unbolts)
      rose mosaic                |
         |                       |
      hatch/stairs --> ROSEWATER RELIQUARY  (BATH-04)
```

This is an *adjacency specification* only, not a measured plan drawn from the owner-approved exterior. Do not relocate the Bathhouse road: it forks **southwest from the western shrine-bound road**, never directly off Carriage Yard. No extra physical corridor map implied by the short maintenance link unless later geometry requires a genuine explorable room.

### Proposed initial footprint (under PREPARE inspection)

| Logical scene key | Standalone room | Target logical size (5-ft spaces) | Physical target | Map pixels at default battlemap-120 | First access |
|---|---|---|---|---|---|
| `ashen-bath-bathing-hall` | Bathhouse bathing hall | **12×10** | **60×50 ft** | **1440×1200** | Exterior branch, early |
| `ashen-bath-soap-room` | Bathhouse soap-making room | **6×5** | **30×25 ft** | **720×600** | Via bathing hall; lye case late-key gated |
| `ashen-bath-boiler-room` | Bathhouse boiler room | **7×6** | **35×30 ft** | **840×720** | Via bathing hall; pressure controls unusable until Waterworks |
| `ashen-bath-rosewater-reliquary` | Rosewater Reliquary / Bowl recovery | **8×6** | **40×30 ft** | **960×720** | Hidden stair after drained-bath mosaic solved |

Sizes are **first composition targets**, not locked Spatial Blueprint dimensions. They should be measured against meaningful clear walkways, pool layout, reachable mechanisms and safe 1×1 player footprints during grayscale inspection. Increase footprint if necessary; do not solve geometry by token visual scaling. Gridless Foundry scene with logical grid size **120px per 5ft**, no painted grid; physical token footprints remain system-owned. Match existing Dicebox Map/Token Scale Standard.

## 2. BATH-01 — Bathing Hall: environment, puzzle and water states

**Narrative goal:** This was a genuinely comfortable family retreat. Carefully patterned rose mosaics and engineered hot-water channels show the marriage of Dahlia's devotional beauty and Allen's practical skill. Abandonment/age/overgrown grout contrasts with the possibility of restoring warmth, suggesting the house might be recoverable, not merely sinister.

**Must-have static visual elements:**
- Grand tiled but plausibly domestic bathing pool, **approximately 30×20 ft within 60×50 ft room** (composition target), with entry steps, raised edges, and walkable margin on all sides.
- Bath benches, folded decayed linens/towels, practical shelves, copper hot-water outlet/waterline, wall sconces or extinguished lamps, and a family-scale rather than public-bath grandeur.
- Exterior door on **northeast** approach side; distinct interior door anchors for Soap Room and Boiler Room. Do not blend these into same Foundry room.
- Rose motif and a faint concentric shape visible through the pool water as pre-drain environmental foreshadowing.
- Clearly legible **Screwdriver** resting on pool bottom in **drained state** as an independent pickup, not a permanently baked lost item.
- **Three-ring 12–15-ft concentric pool-floor water-channel mosaic** (carved wave inlet at rim, rose in center, three ring segments separated by visible rotating seams) exposed only by draining. The ring puzzle must be visible and click-reachable when empty, not hidden behind a random Notice roll.
- A concealed central hatch/stairwell under the medallion, covered until puzzle solved and water drained. The 12–15-ft mosaic diameter must have sufficient clear pool-floor footprint and player access.

**Visual states:**
- `bathFilledCold`: visually full pool, submerged floor and screwdriver hidden, rose motif partly visible, hatch closed and watertight, no healing.
- `bathDrained`: water removed; walkable pool floor reveals screwdriver and ring grooves; medallion (when solved) exposes safe stairs. Need exposed pool depth/steps, not a misleading flat floor.
- `bathFilledHot`: full water plus localized moving steam/warm highlights/operational supply fixtures after both Waterworks and boiler complete; heal interaction eligible. Prefer steam/light Tile overlays atop filled art (no entirely new room required).
- If sluice reopened after restoration, `bathDrained` supersedes visual hot state for the bath; no healing without actual filled water.

**Behavior and safety:** When water is restored, central mosaic hatch automatically re-seals **watertight** even if its three-ring alignment stays solved; the side exit via Boiler Room remains a dry route for those already below. On later drainage, puzzle remains solved and central hatch may reopen. Never physically flood the lower Reliquary scene via bath-state visuals.

**Interaction anchors (design identities, not Foundry IDs):**
`bath:pool-bottom-screwdriver`; `bath:rosewater-ring-outer`, `bath:rosewater-ring-mid`, `bath:rosewater-ring-inner`; `bath:rosewater-hatch`; `bath:rest-hot-water`; `bath:soap-door`; `bath:boiler-door`; `bath:exterior-door`.

**Initial puzzle rings:** all three rings initially show broken continuous water-channel design. Each click rotates a ring by 90°. Exact solved angles and clipping/cell art must be authored at renderer/Regionwright UI prototype; no incorrect “canonical” angle number is guessed now. Visible wave→rose continuous path is the sole success condition. No collection item prerequisite beyond existing sluice change; no consuming Screwdriver, no random required DC.

**Hard missing-elements check:** If final image fails to make the screwdriver and floor mosaic distinct on drained state, or hides the door anchors, render FAIL and redo from canonical PREPARE rather than paint over a failed prompt.

## 3. BATH-04 — Rosewater Reliquary / Bowl scene

**Narrative goal:** A small dry sanctuary and service recess built into foundation masonry; intimate beauty preserved below everyday family activity. Players should grasp that Allen's love of engineered protection served Dahlia's faith. Do not show Voss, cult symbols or apocalyptic gore here.

**Required architectural and storytelling props:**
- Stone stair arrival from bath pool medallion on room's **northwestern** edge, a safe unobstructed landing.
- Distinct devotional plinth at the **southern** end, set on a raised but accessible step and marked with Sune's rose. It holds an independent **Scrying Bowl** visual which disappears when collected.
- Thick water-resistant dressed stone, cleanly mapped drainage conduit edges, exposed copper water pipe but **no direct gameplay link to the later pressure-puzzle state**, beautifully worked Sune reliefs and small carved craftsman flourishes (Allen's signature ethos).
- Protective stone hood/canopy above plinth, explained by the desire to keep relic dry, not an impossible floating object.
- Dry **east-side emergency maintenance door** to a short utility passage connected to the existing Boiler Room scene. Its inside latch is always operable by ordinary interaction; it initially reads closed/bolted from Boiler Room side.
- Minimal optional narrative anchor: two artisans' signatures/marks or a simple balanced rose-and-gear motif in masonry. Do not require players to understand hidden family timeline or complete a new puzzle for Bowl access.

**Required transitions and flags:** `bowlTaken` controls pickup visibility, prevents duplicates; `serviceDoorUnlocked` persists after inside unbolting; `rosewaterMosaicSolved` controls pool hatch only when drained. Bowl pickup never directly awards the Keystone or opens the Undercroft itself.

**Scene success:** After mosaic opens, character enters, sees protected Bowl from readable overhead view, can take it, can leave via Boiler Room even if sluice is later closed/refill occurs. Players can return if they missed something.

## 4. BATH-02 — Soap-making room (existing late branch)

**Narrative goal:** Practical homemade soap and fragrant bathing oils, not horror laboratory. Workbench, soap molds, shelves, containers, storage notes, and glass-fronted locked **lye case** prominent enough to be recognizable at overhead scale.

**Trigger:** Copper Tiny Key obtained during Crimson Veil from Privy → case opens → recover lye. The lye is a **fictional, in-world quest ingredient** used at Greenhouse plant-killer station. No Bowl, Screwdriver or Boiler puzzle prize in this room. The case is an interactable, not static art with an already-open lid. No early lye access unless owner-approved alternate bypass.

## 5. BATH-03 — Boiler Room (existing second pressure puzzle)

**Narrative goal:** Allen's secondary heating system, built for home comfort. Furnace, gauges, steam relief, split pipe branches and a visibly understandable path toward the bathing hall. Include a discreet dry service door/bolt linked to Reliquary.

**Puzzle 2 prerequisites:** Waterworks Utility Room pressure puzzle 1 has restored supply pipes for **both** Greenhouse and Bathhouse boiler. Before that, controls are inoperable and player interaction gives visible/fictional unpressurized feedback; do not open unwinnable controls. After restoration, Regionwright/verified adapter provides a separate pressure/heating puzzle. Exact valve placements, values and puzzle solution still OPEN.

**Heating success:** Heat can become enabled, but **actual healing available only if** (a) sluice CLOSED; (b) Bathhouse pool FILLED; (c) Waterworks RESTORED; (d) Boiler puzzle SOLVED; (e) water HEATED. The chosen healing amount/frequency remains OPEN; do not invent hit-point totals or reset rules.

**Service egress safety:** Discreet door from Reliquary opens from inside without requiring boiler startup or sufficient water pressure; after first unlock, can work bidirectionally if appropriate. It is not a new boiler pressure-puzzle input.

## 6. Global placement and stage-transition requirements

- Preserve exact owner-approved exterior Bathhouse spur and Carriage Yard relative landmarks, without independently shifting geography.
- Four distinct rooms → four logical locations. Pool filled/drained art and local hot steam states may require **multiple Foundry scene variants for BATH-01 only**; count assets separately from locations, as per [staged scene transition design](./staged-map-transition-design-2026-10-21.md). Stage resolution is an *implementation hypothesis*, not verified.
- A globally consistent single sluice state controls pond/bath water levels; no contradictory per-scene water visuals or healing in drained version.
- If sluice state changes while any user occupies the Bathhouse or reliquary, source/target stage and destination anchors must transfer safely, handle disconnects, and preserve progress, as required by scene-transition proof; the dry escape hatch must always work even on partial failure.
- Scene transition graph: exterior ↔ Bathing Hall ↔ Soap; Bathing Hall ↔ Boiler; **Bathing Hall (drained+hatch solved) → Reliquary**; **Reliquary → Boiler** via initially inside-unboltable service door; optionally Boiler ↔ Reliquary afterward.
- Entry into Reliquary must not trigger an automatic Scrying Bowl Item award. The Bowl's valid pickup requires deliberate interaction and runtime-verified receipt.
- **Visible-anchor discovery standard** applies if adding supplementary hidden narrative discoveries after render; the mandatory screwdriver/mosaic are visually apparent in drain state and should not be gated behind arbitrary random Notice checks.

## 7. PREPARE blockers / acceptance criteria before structural render

1. Review physical outline: room proportions, bath size, medallion footprint, two interior doors, lower chamber footprint and passage geometry.
2. Confirm logical gridless `battlemap-120`, no baked grid, stable Foundry IDs and route/arrival anchors *before* BUILD. Do **not** invent product-slice stage or scene IDs here.
3. Art brief: strict overhead graybox first; visible walls/doors, mosaic grooves, exposed pool bottom and bath depth, props, no baked secrets/items that should disappear. Material paint after semantic inspection.
4. Check story visibility: domestic life, marriage of Sune+Gond design, precious object protected by loving craftsmanship, no early demon reveal.
5. Reconcile stage arts and feature manifest with spatial blueprint authority; use clean restart on failed image generation, no patching failed prompts.
6. Validate story puzzle is solvable with no Waterworks/boiler access, can deliver Bowl while pool drained, can escape and refill without party trapping.
7. Verify all logical map boundaries and return paths; no 29-map historical quota or merging Bathhouse's distinct rooms.
8. Only after grayscale/painterly inspection and BUILD validator, STAGE/INJECT with authorized active GM/world and authoritative reread. The current document is **PREPARE input**, not a staged build.

## 8. Related canonical sources

- [Owner delegation and selected Bowl retrieval](./rosewater-reliquary-bowl-decision-2026-10-21.md)
- [Undercroft / Keystone / Bathhouse heating v3](./undercroft-keystone-bathhouse-bowl-healing-design-v3-2026-10-21.md)
- [Campaign decisions and visual story requirement](./campaign-decision-catalogue-2026-10-20.md)
- Canonical project instructions: `docs/DICEBOX-MAP-TOKEN-SCALE-STANDARD-2026-10-05.md`, `docs/DICEBOX-SCENE-SEMANTIC-RENDER-WORKFLOW-2026-10-07.md`, `docs/DICEBOX-AUTOMATED-SCENE-WORKFLOW-2026-10-05.md`.
