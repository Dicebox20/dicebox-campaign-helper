# Cabin in the Ashen Veil — Whole-House Blueprint Handoff / Preliminary Zoning v0

**2026-10-21. Classification:** Architectural **sketch input** after the [31-map rough-layout atlas](./rough-layout-atlas-v1-2026-10-21.md). This is the **first step toward the owner's requested real measured house blueprint**, not a finished dimensioned blueprint, approved wall topology, item relocation, room count or Foundry installation.

## Physical authority / approach

- **Owner-approved estate exterior:** Cabin north/north-center of Carriage Yard with **south-facing front porch**. Grounds main road approaches from south, Pond east, maze gate west/northwest. Do not reuse obsolete orientation diagrams.
- **House interior owner directions:** Individual independently traversable rooms each get their own Foundry scene. Great Room, Foyer clock, accessible Art Studio, Study locked with Brass Key, parents' upper bedroom, Sophia's upper bedroom, hall/landing, attic ladder, roof clock, basement Workshop and secured Vault, hidden Candle Workshop and Spine Mosaic room all need coherent physical positions.
- **Historical 90×60-ft lodge estimate** in discarded 29-map adjacency sketch is **not** accepted dimension authority; do not pretend it is. No exterior house envelope dimension accepted yet.
- **Story-first architectural review:** Kitchen, Dining Room, Pantry, Guest Room, Washroom, Mudroom, unused Nursery and potential supporting halls/closets were in the original draft but not in the 31 questline count. The unused Nursery and kitchen may be essential environmental history despite not giving quest items. Record them as **RESERVED / PROPOSED** until physically adopted, then update location count.

## Proposed floor zoning, north up — NOT TO SCALE

### Ground level (carriage-yard front door on SOUTH)

```text
                    NORTH / service side
+--------------------+-----------------------+----------------------+
| Kitchen/Pantry     | Rear/service zone     | HIDDEN CANDLE        |
| RESERVED           | optional circulation  | WORKSHOP (behind     |
|                    |                       | studio Sune altar)   |
+--------------------+-----------------------+----------------------+
| ALLEN'S STUDY      | GREAT ROOM            | DAHLIA'S ART STUDIO  |
| locked Brass Key   | hearth; 027 box;      | mirror vanity;       |
| Rufus + 587        | family seating        | 027 painting; shrine |
+--------------------+-----------------------+----------------------+
| Dining/utility     | FOYER / MAIN STAIRS   | service/guest        |
| RESERVED           | front porch SOUTH;    | frontage RESERVED    |
|                    | grandfather clock;    |                      |
|                    | basement Weathered    |                      |
+--------------------+-----------------------+----------------------+
                    SOUTH / CARRIAGE YARD
```

**Door graph:** Carriage Yard → Foyer → Great Room; Great Room ↔ Study (Brass-Key gated); Great Room ↔ Studio (early accessible); Studio shrine → concealed Candle room (Prayer Protection); Foyer staircase ↔ Upper Hall and Weathered-Key Basement Workshop. Service rooms may require actual corridor cells and doors; avoid inventing through-room cut-throughs as final architecture. Art Studio must be accessible *before* Brass Study Key; do not place it behind the Study.

### Upper level (floor above Foyer / Great)

```text
                          NORTH
+----------------------+----------------------+--------------------+
| PARENTS' BEDROOM     | GUEST/UTILITY        | SPINE HIDDEN ROOM  |
| coat: Old Iron Key   | RESERVED; optional   | behind Sophia      |
| nightstand + chest   | window/roof access   | bookcase           |
+----------------------+----------------------+--------------------+
| bedroom footprint    | UPPER HALL / LANDING | SOPHIA'S BEDROOM   |
| (distinct scene)     | attic hatch + hook   | bear, books, bed   |
|                      | stairs from foyer    | (locked Old Iron)  |
+----------------------+----------------------+--------------------+
| UNUSED NURSERY       | Stair head           | WASHROOM / LINEN   |
| RESERVED: important  | from Foyer           | RESERVED           |
| family storytelling  |                      |                    |
+----------------------+----------------------+--------------------+
                          SOUTH
```

**Door graph:** One separate main Hall/landing links Parents, Sophia, optional Guest/Nursery/Washrooms, hatch to Attic. Sophia bookcase → distinct Spine hidden room after six-storybook solved. Rooftop access from **upstairs windows**, not contingent on chimney clock. The nursery's floor location and whether it is a full scene are pending real envelope and storyline pass.

### Attic / roof

```text
ATTIC: Upper Hall pull-down ladder → safe attic arrival → Minute Hand,
       Clockwork Winder, storybook, family storage. Old sealed attic
       subdivision may be dropped unless architecture needs it.

ROOF: Upper window access → safe traversal to oversized chimney clock
      (Hour+Minute Hands, set noon, center button → Gate Gear);
      a separate chimney-flue book does NOT need clock activation.
```

### Basement

```text
                         NORTH
+---------------------+-----------------------+---------------------+
| SECURED VAULT       | Unassigned utility    | Service piping      |
| separate room       | / potential cellar    | (RESERVED)          |
| four unlock branches| (RESERVED)            |                     |
+---------------------+-----------------------+---------------------+
| Vault threshold     | ALLEN'S WORKSHOP      | Workshop annex /    |
| from Workshop       | repairs + tools       | bench work          |
+---------------------+-----------------------+---------------------+
| Fuel storage        | Locked stairs up to   | Storage / cellar    |
| RESERVED            | Foyer / main stairs   | RESERVED            |
+---------------------+-----------------------+---------------------+
                         SOUTH
```

**Door graph:** Foyer Weathered-Key basement access → Workshop. Workshop ↔ **Secured Vault** once four prerequisites met; Vault contains **Keystone**, never Bowl. Alternative basement landing, utility rooms and external underground tunnel are NOT approved; the diagram only reserves plausible building space. No link from house basement directly to Undercroft unless owner later adopts such geometry; undercroft is accessed by Sune's statue on GROVE side.

## Critical blueprint decisions and drafting sequence

1. Recover true front façade/proportions from owner's approved exterior illustration and pick **actual house envelope dimensions** and wall thickness, not historic 90×60 assumption.
2. Author complete list of physically existing rooms including **story-only spaces** (kitchen, dining, unused nursery); distinguish separately explorable rooms vs cabinets/alcoves. Recalculate locations only after decisions; historical 29-map roster remains entirely retired.
3. Draw ONE physical building shell per level, **reconcile level footprints**, floor slab/stairs alignment, shafts, outer windows, roof access and hidden-room volumes. No hidden room may overlap a visible room.
4. Assign exact room rectangles/polygons and corridor widths, then paired portal/door anchors (source+destination scene and arrival orientation) using stable semantic identifiers; do not invent live Foundry UUIDs.
5. Feature-manifest each critical object at a sufficiently large overhead footprint: Foyer clock, Great Room 027 box, Art Studio vanity/Sune altar and painting, Study Rufus, Parents' dresser/nightstand/Hope Chest, Sophia bear/bookcase, attic gear/book, roof clock and separate flue, basement Vault lock assembly/Keystone.
6. Verify stair and rooftop routes, accessible early Studio, locked Study/Sophia/Basement, late gated rooms and safe Crooked Man capture release.
7. **Story audit:** Each room answers what happened there, what remains visibly discoverable, how its meaning changes later, and how secrets remain hidden until appropriate stage. The **unused Nursery** is explicitly reviewed rather than silently omitted as flavor.
8. Only then produce each room's measured Spatial Blueprint in the accepted battlemap-120 scale, run structural graybox/inspection, reconcile feature manifest, and painterly render. Room-map dimensions and camera follow the envelope, not invented independently.

**State of this handoff:** Proposed zoning; no measured blueprint, drawing approval, source artwork hash, runtime scene ID, updated product knowledge DB, or Foundry mutation. Placeholders and reserved rooms are NOT guaranteed additional map creations until physically accepted.
