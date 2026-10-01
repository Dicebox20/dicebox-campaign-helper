# Playable Ascendancy Foundry Scenes Plan

Status: `planned` — source and geometry plan only. This document does not
authorize a fixture or Ballad write.

Authority: `SRC-M139-PLAYABLE-ASCENDANCY-FOUNDRY-SCENES`, `F-215`, `D-181`,
and the database-first contract. It reconciles M133–M138. In particular,
M133 is stale-fixture migration evidence; M137 is a source-only import repair;
and M138 is a source-only controller correction.

## Scope and ownership

The deliverable is four playable Foundry **Scenes**. Raster images are only
background renderers. Each Scene's Spatial Blueprint owns its coordinates;
native Foundry Scene documents own Levels, Walls, and Regions at runtime.
Background Objects are the workflow category for visible fixed environmental
or puzzle apparatus after the renderer. Use a native Foundry `Tile`/
`TileDocument` only when an object needs separate runtime positioning,
visibility, movement, or state. Pixels never establish or compensate for
geometry.

The required sequence for each Scene is:

`Blueprint → Walls/doors → empty initial-Level renderer → Background Objects/Regions → authoritative reread`

The only approved mutation surface for an existing Scene is a reviewed,
owned-ID adapter using the Foundry 14 native API
`scene.updateEmbeddedDocuments(type, updates)`. Every update includes the
observed runtime `_id`; arrays use explicit replacement semantics; foreign and
unknown documents are preserved. A timeout or partial result is
outcome-unknown and must be reread before any recovery action.

## Frozen Scene matrix

| Scene | Scene / blueprint / plan IDs | Geometry | Renderer status |
| --- | --- | --- | --- |
| Signal / Frequency Chamber | `dbx:scene:signal-frequency-chamber` / `dbx:blueprint:signal-frequency-chamber` / `dbx:plan:signal-frequency-chamber-regions` | 1536×1024; 6 fixed wall segments; north/south doors `(768,24)` and `(768,1000)`; 6 Regions | `dbx:asset:map-signal-frequency-chamber`; scene-bound `assets/maps/ascendancy-signal-frequency-chamber-v2.png`; SHA-256 `DB9307932865B0D3A23C5A8AA61082D520206443318658DE7E03C773A1A9972E` |
| Ascendancy Tram Depot | `dbx:scene:ascendancy-tram-depot` / `dbx:blueprint:ascendancy-tram-depot` / `dbx:plan:ascendancy-tram-depot-regions` | 1536×1024; 11 fixed Walls including 3 doors; six-by-six board origin `(420,210)`, cell `(110,95)`, 36 static controller Regions; Dalton/cooperative/exit Regions | `dbx:asset:map-ascendancy-tram-depot`; scene-bound neutral `assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png`; SHA-256 `591DB926FF0A733282CC047BCF5094B9057449D00D168EF751C0991107F1B988` |
| Rune Mechanism Chamber | `dbx:scene:rune-mechanism-chamber` / `dbx:blueprint:rune-mechanism-chamber` / `dbx:plan:rune-mechanism-chamber-regions` | 1536×1024; 6 fixed wall segments; north/south doors `(768,24)` and `(768,1000)`; 6 Regions | `dbx:asset:map-rune-mechanism-chamber`; scene-bound `assets/maps/ascendancy-rune-mechanism-chamber-v2.png`; SHA-256 `F45922E219A12FBA6B79A26AD0D6B5EBBAF51ADD86C025E9B676DA24707D507B` |
| Central Core Control Chamber | `dbx:scene:central-core-control-chamber` / `dbx:blueprint:central-core-control-chamber` / `dbx:plan:central-core-control-chamber-regions` | 1536×1024; 7 fixed wall segments; north `(768,24)`, south `(768,1000)`, west rail entry `(24,447.5)`; 10 Regions | `dbx:asset:map-central-core-control-chamber`; scene-bound neutral `assets/maps/manual-central-core-control-chamber-v5-neutral.png`; SHA-256 `8BA721E5B8499323BDCC868284DBF20C53A2BA07EC919F1BF9E923D89238EF11` |

## Tram and Core topology

Tram is west of Core. The only permitted cross-Scene rail relation is:

`Tram outer east door (1512,447.5) → Core west entry (24,447.5)`

Tram's three door anchors are ingress `(420,447.5)`, yard exit
`(1080,447.5)`, and outer east `(1512,447.5)`, each with a 47.5 clearance.
The locked centerline is `y=447.5`. Any renderer candidate must be measured
against this one coordinate system; a fit correction applies coherently to the
Blueprint-derived projections or is rejected. It must never be hidden by
distorting art independently.

The background renderer contains no tram cars. Canonical movable projections
are separate Foundry Tiles:

`dbx:tram:x`, `dbx:tram:o`, `dbx:tram:q`, `dbx:tram:b`, `dbx:tram:c`,
`dbx:tram:r`

with Tile IDs `dbx:tile:tram-x/o/q/b/c/r` and optional equal-bounds mirrored
footprint Regions `dbx:region:tram-{x|o|q|b|c|r}-footprint`. These never
replace the 36 static controller Regions.

## Static visual Background Object projection preview

M141 adopts geometry-neutral backgrounds for Tram and Core. M1210 binds the
measured neutral backgrounds in the local package only; they remain subject to
compiled matrix, staging, fixture, and runtime reread gates. Static visual Background Objects are
visual-only and never own Wall, Region, teleport, or puzzle behavior. The
existing `dbx:tile:*` entries are stable projection keys; they do not by
themselves assert creation of native Foundry TileDocuments. A native Foundry
Tile is reserved for a separately positioned, visible, movable, or stateful
runtime object.

| Scene | Proposed static Tile IDs | Bounds / correspondence |
| --- | --- | --- |
| Tram | `dbx:tile:tram-rail-grid`, `dbx:tile:tram-core-rail` | `(420,210,660,570)` board grid; `(1080,400,432,95)` sole eastbound rail to the outer east door |
| Tram | `dbx:tile:tram-gate-ingress`, `dbx:tile:tram-gate-yard-exit`, `dbx:tile:tram-gate-core-door` | `(408,400,24,95)`, `(1068,400,24,95)`, `(1500,400,24,95)`; each aligns to its corresponding 47.5-clearance native door anchor |
| Core | `dbx:tile:core-west-rail-gate`, `dbx:tile:core-door-north`, `dbx:tile:core-door-south` | `(24,400,176,95)`, `(680,24,176,72)`, `(680,928,176,72)`; align to the west, north, and south native doors |
| Core | `dbx:tile:core-central-surface` | `(500,410,536,200)`; visual-only counterpart of `dbx:region:core-security-room` |
| Core | `dbx:tile:core-station-aleister/sprocket/dalton/andrew/lawson/tactal` | six 180×90 pads centered in their respective final-station Regions; no RegionBehavior ownership |

Static Tiles render below the existing dynamic tram-car Tiles; fixed gates are
visible without state toggles. The only dynamic Tile state is the existing
canonical six-car projection.

## Required evidence before promotion

1. Source/stage manifest and import-graph parity:
   `module.json → entry-20260825.js → module.js?dbx=0.1.5 → one URL identity per adapter`.
2. For each renderer: source path, 1536×1024 dimensions, SHA-256, binding
   status, and measured overlay covering Blueprint Walls, door anchors, Region
   rectangles, and Tram grid where relevant.
3. Fixture-only: exact target, active GM, module graph, control/console status,
   owned-only preview, explicit approval, authoritative reread, and foreign
   preservation. M133's stale geometry must be migrated only through this
   previewed path.
4. Ballad: immediate active-GM gate, a current no-write Scene/initial-Level
   snapshot before each preview, per-write preview/approval/reread receipt, and
   a separate GM and Assistant/player-compatible visual audit.

No source test, generated package, fixture receipt, historical four-map claim,
or successful transport can satisfy a target-bound Ballad Scene requirement.
