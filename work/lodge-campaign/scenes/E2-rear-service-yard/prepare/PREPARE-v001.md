# E2 PREPARE v001 — Rear Service Yard & Outbuildings

**Campaign:** central-lodge  
**Scene:** E2  
**Stable Scene ID:** `dbx:central-lodge:e2`  
**Workflow state:** PREPARE  
**Scale profile:** battlemap-120  
**Logical size:** 36 × 24 five-foot spaces  
**Scene pixels:** 4320 × 2880  
**Grid:** Gridless, logical 120 px = 5 ft  
**Time state:** day geometry authority; night must be an exact aligned reshade/edit

## Scene purpose

E2 is the practical rear-service side of the estate. It should feel less formal than the front grounds and more like a place servants, deliveries, and maintenance workers once used. Its puzzle role is to seed three concrete progression elements:

- the **Iron Hand Crank** is found in/at the woodshed and later operates the old well;
- the **Well Carving Pattern** is recovered at the well and later informs the fountain sequence elsewhere;
- the **Servant Bell Pull** is recovered here and later restores a hidden line on the interior Bell Board.

The Scene must also support subtle current-use evidence so the estate begins to feel less completely abandoned.

## Permanent visible background content

Only depict what is physically present on E2:

- rear service wall/edge of the abandoned Lodge along the upper side of the map, with back/service doors and small high windows;
- muddy service yard with wheel ruts, puddles, scattered leaves, and worn stone patches;
- one old stone well, clearly readable as an interactable landmark but not visually highlighted as a puzzle;
- one weathered woodshed or tool shed, partly open or visibly accessible;
- one small lean-to/storage structure or covered work area if composition benefits from it;
- stacked split firewood, old barrels, crates, handcart/wheelbarrow, broken tools, drainage channels, and service clutter;
- a simple servant/service bell fixture or pull housing mounted plausibly near the service-entry zone, but the removable Bell Pull itself is stateful and must not be permanently painted as installed;
- visible but **unlit** service-door and woodshed lantern/sconce fixtures for the later night state;
- dense wet woodland/estate boundary vegetation at the edges;
- at least two readable exit paths from the yard without depicting what lies beyond them;
- subtle recent-use traces: one cleaner wheel rut, shifted wood stack, recently disturbed mud, or a tool set down more recently than the surrounding decay.

## Stateful / BUILD-owned objects

Do not rely on the background renderer to encode these exact states:

- **Iron Hand Crank** pickup state at woodshed.
- **Well Carving Pattern** clue/recovery state.
- **Servant Bell Pull** pickup state.
- Any cover/compartment that opens after search.
- Any removable object state.
- Day/night light activation.
- Any ghost/apparition.
- Any puzzle feedback text.

## Lighting plan

Profile: **exterior-abandoned / very sparse**.

### Lighting Region A — Service Door
Stable ID: `dbx:central-lodge:e2:region:light:service-door`

- Anchor: visible unlit fixture beside primary service entrance.
- Day state: off.
- Night pacing group: **threshold**.
- Runtime: Foundry AmbientLight with restrained native torch-style animation.
- Purpose: establish first believable night response without making the yard comfortable.

### Lighting Region B — Woodshed
Stable ID: `dbx:central-lodge:e2:region:light:woodshed`

- Anchor: visible unlit lantern/sconce on or immediately beside woodshed.
- Day state: off.
- Night pacing group: **peripheral-response**.
- Runtime: Foundry AmbientLight with restrained native torch-style animation.
- Purpose: create an isolated pool of usable light after the yard has already darkened.

Most of the yard, the well, and the perimeter remain dark at night.

## Region Ownership Table

| Stable Region ID | Class | Physical anchor | Trigger/state | Player-facing effect | Day/night controlled | Owns light | Reset/cooldown | Dependency | VERIFY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `dbx:central-lodge:e2:region:puzzle:woodshed-crank` | puzzle | woodshed/tool storage | player search/recovery | recover Iron Hand Crank | no | no | persistent pickup | Well mechanism | pickup state persists |
| `dbx:central-lodge:e2:region:notice:well-carving` | notice | old well rim/interior stonework | first local inspection | hint unusual carved sequence | no | no | once/character until meaningful reset | Fountain sequence clue | notice does not auto-award clue |
| `dbx:central-lodge:e2:region:puzzle:well-carving` | puzzle | well carving | successful interpretation/search | recover/record Well Carving Pattern | no | no | persistent clue | E3 fountain | clue state persists |
| `dbx:central-lodge:e2:region:puzzle:bell-pull` | puzzle | service-entry bell hardware/storage | search/recovery | recover Servant Bell Pull | no | no | persistent pickup | M3 Bell Board | pickup state persists |
| `dbx:central-lodge:e2:region:story:recent-use` | story | disturbed service-yard evidence | examination | suggests recent maintenance/use without proving cult identity | optional night emphasis | no | once/character/visit | mystery ladder | no contradiction with old-abandoned read |
| `dbx:central-lodge:e2:region:light:service-door` | light | service-door fixture | `timeOfDay=night` | threshold torch light | yes | yes | state-owned | day/night event | day off, night on |
| `dbx:central-lodge:e2:region:light:woodshed` | light | woodshed fixture | `timeOfDay=night` after threshold phase | isolated peripheral torch light | yes | yes | state-owned | day/night event | day off, staged night on |
| `dbx:central-lodge:e2:region:transition:yard-exit-a` | transition | first edge path | deliberate movement | travel anchor | no | no | n/a | campaign traversal | anchor remains readable |
| `dbx:central-lodge:e2:region:transition:yard-exit-b` | transition | second edge path | deliberate movement | travel anchor | no | no | n/a | campaign traversal | anchor remains readable |

## Hidden Notice / interpretation intent

The Well Carving Pattern follows the campaign discovery model but is **not random treasure**. Stage 1 should use a private environmental notice, then direct the player toward a fitting Stage 2 skill such as Investigation or History depending on final carving treatment. Failure must not permanently remove access to a progression-critical clue; alternate deliberate examination remains possible.

The recent-use Story Region should not identify the cult. It should only create the unsettling contradiction: the yard is old and rotting, but something here has been handled recently.

## Walls / geometry expectations

- Foundry Walls trace only meaningful building/solid-boundary geometry, not every prop.
- Service doors are explicit door segments.
- Woodshed walls should allow entry if visually accessible.
- Well itself does not need a vision-blocking wall unless its drawn geometry warrants one.
- Exterior tree/brush boundaries use efficient long walls only where needed to keep players in the intended playable area.
- Region placement is forgiving and locally sensible rather than pixel-perfect.

## Day/night state

The approved **day renderer** becomes geometry authority.

Night state must be produced by editing/reshading that exact renderer:
- identical dimensions;
- identical geometry;
- identical prop placement;
- identical exits;
- identical fixture anchors;
- no new buildings or paths;
- no baked active flames or glowing halos.

Foundry handles darkness and the two authored torch lights.

## Horror pacing

E2 remains primarily **Abandoned**, not fully Haunted.

Allowed horror:
- unsettling recent-use evidence;
- an isolated sound or movement implication;
- stronger darkness once night activates.

Do not use a major ghost manifestation here unless later campaign pacing explicitly reassigns one.

## Render capsule

Create a strict 90-degree overhead orthographic fantasy-horror battlemap, camera perpendicular to the ground plane, no perspective tilt, no horizon. Show an abandoned rear service yard in overcast daytime: the weathered rear service edge of an old lodge along the upper side; a muddy yard with puddles and wheel ruts; one old stone well; one accessible weathered woodshed/tool shed; modest service clutter such as stacked firewood, barrels, crates, an old handcart, broken tools, and drainage; dense wet woodland and estate vegetation at the edges; two readable edge paths; visible but unlit lantern/sconce fixtures at the service entrance and woodshed; subtle recent-use traces among years of neglect. Dark windows, damp materials, muted daylight, readable tactical silhouettes. No people, monsters, ghost figures, active fire, glowing windows, grid, labels, text, UI, Region markers, puzzle-state text, or neighboring/off-map structures. Do not infer or depict what lies beyond any exit.

## INSPECT acceptance checklist

PASS only if:
- strict overhead orthographic camera;
- rear service-yard identity is immediately readable;
- one well and one woodshed are clear landmarks;
- service-door and woodshed light fixtures are visibly plausible and unlit;
- no active flame/glow is baked into day art;
- exits are readable without showing destinations;
- recent-use traces are subtle rather than obvious exposition;
- no text/grid/UI;
- no people/creatures;
- no major off-map architecture;
- tactical movement space remains usable;
- no puzzle solution is visually spotlighted.

Small exact pickup-object details may be supplied in BUILD and do not require REDO.
