# Cabin in the Ashen Veil — Basement Layout & Content Design v1

**Date:** 2026-10-22  
**Status:** **OWNER-ACCEPTED ARCHITECTURAL ROOM PROGRAM**, based on owner reply “sounds good” to the preceding basement design proposal. Precise room outlines, wall/door measurements, orientation of subzones, and Gondian blueprint artwork are **not yet drawn or owner-approved**. No Foundry documents or Items have been created or changed.

## 1. Design objective

The basement is Allen's **practical Gondian engineering workspace**, not a second dungeon or an arbitrary puzzle labyrinth. It reveals the boundary between mechanical inventiveness, care for Sophia, and increasingly inappropriate efforts to “fix” irreversible losses. Make navigation plain, with one physically separate high-security vault. The mood is sorrowful and uncanny through architecture, documents and remnants of work, rather than gratuitous gore.

**Logical playable spaces, exactly two:**
1. **H-B01 — Allen's Workshop** (large principal space)
2. **H-B02 — Secured Vault** (a single distinct room adjoining Workshop)

**Transition area only:** Enclosed basement stairwell, including its upper locked **literal door inside the Foyer (H-G02)**, stair flight behind Foundry Walls, and lower arrival landing opening to Workshop. The stairwell is not an additional logical room map unless a later approved physical map requires it. The upper entrance is secured with the **Weathered Key**, already recovered from the drained Pond.

**Unidirectional room graph (both normal routes reversible once unlocked):**

```text
Ground-Floor Foyer (H-G02)
    → [Weathered-Key locked literal door]
    → enclosed stair flight DOWN
    → safe lower landing
    → Allen's Workshop (H-B01)
    → [four-predicate secured Vault door]
    → Secured Vault (H-B02)
```

There is **no basement→Undercroft bypass**, second exterior stair, disguised tunnel, additional secret chamber, or separate side-cellar scene.

## 2. Blueprint shape — irregular but legible

Designer-selected composition consistent with the owner's positive response:

- The staircase approaches the **southern edge** of Allen's Workshop through a narrow, walled entry neck; the staircase itself begins behind Foyer's distinct basement door.
- A broad, mostly rectangular central Workshop chamber has **two shallow offsets/alcoves** in its wall silhouette: a western mechanical-storage recess and a northern reinforced test bay. These are subzones of the **same** room, not doors to additional rooms.
- The **Secured Vault** attaches along the Workshop's **eastern / northeast wall** by one recognizable reinforced door. The Vault's footprint should be deliberately regular and tightly engineered, contrasting with the expanded and modified Workshop floor.
- Remaining unexcavated earth surrounds the two actual basement rooms; roof/home exterior footprint does not imply a full-sized subterranean plan.
- The final measured blueprint should dimension all safe walking space, doorway widths, wall thicknesses, vault clearance and stair/landing footprints. These are **PREPARE geometry outputs**, not measurements invented from a decorative image.

## 3. H-B01 Allen's Workshop — permanent features and interactive fixtures

| Zone | Visible architectural/fixed fixture | Mechanics or narrative behavior |
|---|---|---|
| Arrival / south | Walled lower stair landing and readable threshold into workshop | Paired Foyer↔Workshop Scene Region travel, safe return; no auto-interaction |
| Center | Main engineering bench / drafting surface | Static representative art; optional inspect Journal with normal family-invention sketches |
| West wall offset | Gears, springs, brass fittings, tools, unfinished mechanisms | Nonessential mechanical storage; **General Repair Kit** as a single recoverable optional Item |
| North wall offset | Reinforced device testing pad, mechanical mounts, partly disassembled frames | Unsettling but non-gory traces of Allen's attempts to turn affection/grief into machines; no required encounter or new quest gate |
| Wall near test area | Engineering log rack / Blueprint Note | Readable optional Journal, potentially hints at Allen's care for Sophia without prematurely revealing Study's Rufus mechanism |
| East / northeast | Secured Vault reinforced doorway with Gond-and-Sune joined-rose-and-gear motif | Explicit intentional Vault interactions and independent persistent door state; no bare Region-enter solving |
| Peripheral | Support columns, vents, pipes, storage niches and realistic stone/timber structure | Physical Wall placement only on genuine solid obstacles; technical/ambient sounds and lighting later |

**Separation of tools and required quest logic:** The *Bath-floor Screwdriver* remains the actual necessary tool for repairing the **Parents' Bedroom nightstand**. The **General Repair Kit** is optional useful flavor/equipment from the Workshop, **not another prerequisite** to the Gate Handle, Aqueduct gear, or Vault. Earlier puzzle decisions control item identities.

## 4. H-B02 Secured Vault — exactly the established four prerequisites

**Architectural format:** Compact, thick-walled, single-door sanctum. Fixed receiving mechanism at entrance, stone/brass plinth inside. The Vault is devoted to protecting one powerful artifact, **the Keystone**.

The **four and only four readiness conditions** are:
1. Legitimate access to the Basement from the Foyer using the Weathered Key — represented by location/progression state, **not a fourth physical socket**.
2. **Charged Gondian Power Source** (Rufus Study mechanism → Aqueduct charger) presented to the Vault receiver.
3. **Gond emblem half** from Sophia's bookshelf Spine Mosaic **compartment within Sophia's Bedroom** — *no separate Spine Room*.
4. **Sune emblem half** from Dahlia's upstairs Art Studio, after Prayer of Devotion.

**Action:** Insert/acknowledge charged source and two emblem halves; use explicit **Turn Joined Emblem** actuator. Unlock the one Vault door; keep the opened state persistent and idempotent. Enter room; independently **take the Keystone once** from its plinth. The **Scrying Bowl is in the Bathhouse Rosewater Reliquary, not this Vault**. There is no secret link from this room to the Undercroft.

Puzzle UI/visual states are separate Foundry fixtures/overlays, with descriptive feedback if an item is missing. Critical items should not be prematurely destroyed or duplicated by retries.

## 5. Scene art vs Foundry object responsibility

- **Painted permanent geometry:** basement walls, stairs/landing footprint, floor, support features, fixed workbenches, shelves, immovable test pad, Vault envelope and closed doorframe.
- **Separate stateful elements:** actual locked/unlocked Foyer basement door and Vault door, optional General Repair Kit pickup, Vault source/emblem placement states, actuator state, Keystone Item, active lights and ambient sound.
- **Relevant Foundry documents:** `Scene`, `Wall`/door, paired safe landing `Region`, optional `Tile` state overlays, `JournalEntry`/`Note`, `Item`, `AmbientLight`, `AmbientSound`; engine-controlled rewards via narrow explicit action UI, not a generic Region-enter loot.
- **Lighting:** even neutral baked illumination in art; actual amber work lights, low side alcove visibility and suspense effects from Foundry.
- **Scale:** use established gridless battlemap-120 (24 px/ft) and exact image alignment after the measured House Master v2 geometry is finished. The existing BP1 polygons are historic and are NOT the current installation target.

## 6. Hard requirements for future floor plan and map inspection

- Upstairs Foyer: a real lockable basement **door**, with enclosed stair visible only beyond the door; no public foyer floor hatch.
- Basement landing has a clear, returnable arrival footprint.
- Workshop and Vault are **exactly two distinct logical Scenes**, no additional hidden scene added for alcoves or test equipment.
- The irregular Workshop remains navigable with clear access to its **only** Vault door.
- The Vault diagram has a receiving mechanism for the charged source and two emblem halves (Basement access is the fourth predicate, not another item).
- Source has the right physical shape, but the exact pixel/foot coordinates are measured, not image-model guesses; Good Enough art acceptance never waives Wall/Region/door validity.
- Keystone is behind the Vault lock; Bowl elsewhere; dedicated Gond/Sune halves retain the owner-corrected compartment and Art Studio locations.
- Player-facing altered house blueprint and GM blueprint may differ only in intentionally erased secret-wing marks, not in real circulation/door coordinates.

## 7. Authority and next step

House Layout v2 controls Foyer, Great Room and upper-floor connections; canonical puzzle design v1 with later owner Spine-compartment override controls Vault requirements. **Owner's “sounds good” adopts the two-room basement program and optional flavor palette**, not an image or measured geometry. Next artifact is the accurate **Gondian Basement Floor Plan** based on this approved program, using the same navy-and-gold room-only drafting grammar as other accepted house sheets; only then can precise Wall/door/Region geometry be reconciled. No live Foundry installation/gameplay testing claim follows.
