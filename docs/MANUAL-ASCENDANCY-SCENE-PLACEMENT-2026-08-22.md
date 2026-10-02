# Manual Ascendancy Scene Placement

## Terminology

This guide deliberately uses **Background Objects** for the visual-prop stage
of map creation. It does **not** mean native Foundry `TileDocument` objects.

- **Background Objects** are the fixed apparatus visibly rendered in the map:
  consoles, resonators, plinths, socket arrays, the central core, bulkhead
  doors, rails, pipes, and floor machinery.
- A **Foundry Tile** is a separate native document. Use one only when an
  object must move, change visibility, or otherwise carry independent runtime
  state. Do not create one merely because the renderer depicts a fixed object.
- Regions, Walls, and doors still use the helper coordinates below. The image
  gives players visual context; it never replaces the Spatial Blueprint.

The reviewed renderer candidates are 1536×1024. Import them as Scene
backgrounds without rescaling, then place the listed Background Objects and
Regions at their exact Scene-pixel coordinates. They are manual-review
candidates and do not change the campaign package or any live Foundry Scene.

| Scene | Renderer candidate | SHA-256 |
| --- | --- | --- |
| Signal / Frequency Chamber | `assets/maps/manual-signal-frequency-chamber-v5-neutral.png` | Candidate background — see its Universal Battlemap bundle receipt |
| Rune Mechanism Chamber | `assets/maps/manual-rune-mechanism-chamber-v5-neutral.png` | Candidate background — see its Universal Battlemap bundle receipt |
| Central Core Control Chamber | `assets/maps/manual-central-core-control-chamber-v5-neutral.png` | Candidate background — see its Universal Battlemap bundle receipt |
| Ascendancy Tram Depot | `assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png` | Candidate only — add the exact rail, gate, Wall, and dynamic-car projections before play |

## Ascendancy Tram Depot — 39 fixed Regions

The Tram background deliberately contains **no baked tram cars or routing
tracks**. The actual routing lattice, gates, and cars are separate Foundry
projections so that the Rush Hour state is exact and players cannot bypass the
puzzle. Do not resize the Scene background: the locked board is a 6×6
rectangle from `(420,210)` to `(1080,780)`, with cells of `110×95` pixels.

Create the following **39 fixed Regions**. Name the visible Region after the
human label below, and record the paired stable DiceBox ID alongside the
Foundry Region UUID for the Regionwright handoff. Do not replace the stable ID
with the UUID.

### 36 controller-anchor Regions

Each controller-anchor Region is exactly `110×95`. Its name is `Tram anchor
r#,c#`; its stable ID is `dbx:region:tram-slot-r#-c#`. The table gives its
top-left coordinate. These are fixed board cells, not tram-car footprints.

| Row / y | c1 / x=420 | c2 / x=530 | c3 / x=640 | c4 / x=750 | c5 / x=860 | c6 / x=970 |
| --- | --- | --- | --- | --- | --- | --- |
| r1 / y=210 | `r1,c1` | `r1,c2` | `r1,c3` | `r1,c4` | `r1,c5` | `r1,c6` |
| r2 / y=305 | `r2,c1` | `r2,c2` | `r2,c3` | `r2,c4` | `r2,c5` | `r2,c6` |
| r3 / y=400 | `r3,c1` | `r3,c2` | `r3,c3` | `r3,c4` | `r3,c5` | `r3,c6` |
| r4 / y=495 | `r4,c1` | `r4,c2` | `r4,c3` | `r4,c4` | `r4,c5` | `r4,c6` |
| r5 / y=590 | `r5,c1` | `r5,c2` | `r5,c3` | `r5,c4` | `r5,c5` | `r5,c6` |
| r6 / y=685 | `r6,c1` | `r6,c2` | `r6,c3` | `r6,c4` | `r6,c5` | `r6,c6` |

For example, `Tram anchor r3,c1` uses
`dbx:region:tram-slot-r3-c1` at `(420,400,110,95)`; `Tram anchor r6,c6` uses
`dbx:region:tram-slot-r6-c6` at `(970,685,110,95)`.

### Three non-cell Regions

| Foundry Region name | Stable ID | x | y | width | height | Placement purpose |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| Dalton tram repair station | `dbx:region:tram-dalton-repair` | 1120 | 120 | 300 | 220 | Upper-right repair machinery bay; Dalton puzzle identity remains canonical even when Andrew operates it this session. |
| Physical tram troubleshooting station | `dbx:region:tram-cooperative` | 1120 | 640 | 300 | 220 | Lower-right two-person physical troubleshooting platform. |
| Tram rail to Core controls | `dbx:region:tram-exit` | 1080 | 400 | 390 | 95 | The single eastbound rail corridor released by the solved routing board. It must align with the Core west entry. |

The eastbound rail centerline is locked to `y=447.5`: Tram exit/door `(1512,
447.5)` corresponds to Core west entry `(24,447.5)`. Keep the board fully
enclosed by its approved 11 Walls and three gate/door openings; do not create a
walkable side path around it.

### Do not manually pre-create these dynamic footprint Regions

The six physical cars are one native Foundry Tile each:
`dbx:tile:tram-x`, `-o`, `-q`, `-b`, `-c`, and `-r`. If the engine later needs
footprint Regions, it creates/moves only one matching rectangle per car:
`dbx:region:tram-x-footprint`, `-o-footprint`, `-q-footprint`,
`-b-footprint`, `-c-footprint`, and `-r-footprint`. Each must use the exact
same bounds as its car Tile. They are dynamic state, not part of the 39 fixed
manual Regions.

## Signal / Frequency Chamber — 6 Regions

The Signal renderer is deliberately geometry-neutral. After importing it,
place the Signal Background Objects from the paired
`BACKGROUND-OBJECT-PLACEMENT.md`: north/south doors, central fixed frequency
resonator, upper frequency/circuit consoles, and lower cooperative relays.
The central resonator is scenery, not a Region.

| Foundry Region name | Stable ID | x | y | width | height |
| --- | ---: | ---: | ---: | ---: |
| Aleister frequency station | `dbx:region:signal-aleister-frequency` | 120 | 120 | 300 | 230 |
| Sprocket circuit station | `dbx:region:signal-sprocket-circuit` | 1116 | 120 | 300 | 230 |
| Physical frequency circuit left | `dbx:region:signal-cooperative-left` | 180 | 500 | 360 | 220 |
| Physical frequency circuit right | `dbx:region:signal-cooperative-right` | 996 | 500 | 360 | 220 |
| Signal chamber entry | `dbx:region:signal-entry` | 680 | 24 | 176 | 72 |
| Signal chamber exit | `dbx:region:signal-exit` | 680 | 928 | 176 | 72 |

## Rune Mechanism Chamber — 6 Regions

The Rune renderer is deliberately geometry-neutral. After importing it, place
the Rune Background Objects from the paired
`BACKGROUND-OBJECT-PLACEMENT.md`: north/south doors, central multi-ring rune
engine, upper archive and empty socket forge, and lower cooperative plinths.
The empty sockets and pads are visual cues; any movable rune piece remains a
separate runtime object.

| Foundry Region name | Stable ID | x | y | width | height |
| --- | ---: | ---: | ---: | ---: |
| Lawson rune memory station | `dbx:region:rune-lawson-memory` | 120 | 120 | 360 | 240 |
| Tactal heavy rune station | `dbx:region:rune-tactal-slotting` | 1056 | 120 | 360 | 240 |
| Physical rune order left | `dbx:region:rune-order-left` | 180 | 500 | 360 | 220 |
| Physical rune order right | `dbx:region:rune-order-right` | 996 | 500 | 360 | 220 |
| Rune chamber entry | `dbx:region:rune-entry` | 680 | 24 | 176 | 72 |
| Rune chamber exit | `dbx:region:rune-exit` | 680 | 928 | 176 | 72 |

## Central Core Control Chamber — 10 Regions

The Core renderer is deliberately geometry-neutral. After importing it, place
the Core Background Objects from the paired `BACKGROUND-OBJECT-PLACEMENT.md`:
fixed central violet energy core and command dais; six distinct final-control
consoles; the west rail blast gate; and centered north/south bulkheads. The
core and consoles are fixed scenery. Do not replace the six station Regions
with the visible console art.

| Foundry Region name | Stable ID | x | y | width | height |
| --- | ---: | ---: | ---: | ---: |
| Aleister final activation | `dbx:region:core-aleister-station` | 234 | 275 | 300 | 180 |
| Sprocket final activation | `dbx:region:core-sprocket-station` | 618 | 275 | 300 | 180 |
| Dalton final activation | `dbx:region:core-dalton-station` | 1002 | 275 | 300 | 180 |
| Andrew final activation | `dbx:region:core-andrew-station` | 234 | 580 | 300 | 180 |
| Lawson final activation | `dbx:region:core-lawson-station` | 618 | 580 | 300 | 180 |
| Tactal final activation | `dbx:region:core-tactal-station` | 1002 | 580 | 300 | 180 |
| Core Security Room | `dbx:region:core-security-room` | 500 | 410 | 536 | 200 |
| Core chamber north entry | `dbx:region:core-entry` | 680 | 24 | 176 | 72 |
| Core chamber west rail entry | `dbx:region:core-entry-west` | 24 | 400 | 176 | 95 |
| Core chamber exit | `dbx:region:core-exit` | 680 | 928 | 176 | 72 |

Core west entry is the Tram relation: `(24,447.5)` must align with Tram’s
outer east door `(1512,447.5)`. After creating Regions, hand Regionwright the
Foundry Region UUID plus its stable DiceBox ID; do not replace the stable ID
with the UUID.
