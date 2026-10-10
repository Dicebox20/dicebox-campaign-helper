# Beyond the Realms — M02 Tallcap Forest

**Stage:** PREPARE / DRAFT — user review required before grayscale structural render  
**Chronology:** drafted 2026-10-09; no art or Foundry writes  
**Scope:** proposed second main-road scene after `M01 — The Forgotten Road`, within `Beyond the Realms — Underdark Expedition`.  
**Provenance:** M02 name/connection from the active conversation; M01 original BUILD manifest `M01_build_manifest.json`; current DiceBox scale and Scene Injector workflow. Repository/local KB searches yielded no prior detailed authoritative M02 geometry. All new M02 creative details in this document are **proposals**, not existing campaign canon.

## 1. Scene intent

**Scene title:** `M02 — Tallcap Forest`  
**Semantic scene key:** `btr-expedition-m02-tallcap-forest`  
**Experience:** uncanny but explorable Underdark forest. The old west-east road cuts through a grove of enormous mushroom columns under overlapping caps. Characters can take the obvious roadway or explore two interconnecting side paths. Low ambient bioluminescence and scattered maintained torch fixtures preserve the underground atmosphere.  
**Goals:** main-route continuity; navigable exploration under cover; two optional branching loops that reconverge; visual mushroom harvesting candidate; southern GM-directed hunting habitat; one subtle environmental clue candidate. No fishing or mining invented on this scene.

### Art direction
- Strict 90-degree orthographic straight-down camera, no horizon or perspective, no baked grid, no labels/compass, no tokens.
- Structural grayscale pass must make canopy silhouettes, raised cap/trunk relationships, ground-level blocking trunks, open trail clearances and inaccessible rocky cavern edges unambiguous.
- Painterly pass: bruised indigo, stone charcoal, desaturated purple/blue fungal caps, some warm amber from existing roadway torch fixtures; modest aqua/green fungal luminescence. Retain a dark, tense Underdark palette.
- No visible full forest canopy flattening all paths; reveal enough forest floor and road for Foundry movement planning. Caps may cast shadow but are not automatically blocking walls.

## 2. Proposed PREPARE scale (must be accepted separately)

- Logical size **36 columns × 24 rows**, each **5 ft**: physical 180 × 120 ft.
- DiceBox default **Gridless**, **120 px per five-foot cell**.
- Final intended Foundry Scene/background target **4320 × 2880 px**, 3:2.
- Scene padding 0; no token-footprint overrides; D&D5e owns actor width/height.
- Candidate native grayscale/paint source should target final dimensions when feasible. If generated smaller, record native source raster and use one uniform reprojection for geometry; do not claim enlargement adds real texture detail.
- Unlike M01, do **not** reverse-infer logical footprint from a low-resolution image.

## 3. Mandatory monospaced schematic (topological, not to scale)

```text
                                  N ↑
            WEST ←                             → EAST
    +--------------------------------------------------+
    |  #####      TTTT       G / F      TTT    #####  |
    |  ###       TTT      .----L----.   TTT     ####  |
    |             T       .          .   T            |
    |                     .          .                |
    |                   .              .              |
W --> A======B=========C=====S=========D====E====X --> E
    |         \         \           /       /         |
    |          .         .         .       .          |
    |     T     .         H .-----.       .     T     |
    |   TTT      .---H-----.             .    TTT     |
    |    TTT        L              T     .     T      |
    |  ####           ^ ^          TTT         ####   |
    |  ########     ^ rubble ^     TTT      #######   |
    +--------------------------------------------------+
                                  S ↓
```

**Legend:** `W/E` outer west arrival/east exit; `=` maintained main road; `.` side trails/loop connections; `A,B,C,D,E` navigable route anchors; `S` half-buried stone milestone; `T` large raised tallcap trunks/ground footprints; `G` softly glowing fungal canopy; `F` foraging candidate; `H` southern hunting habitat (manual GM encounter); `L` bioluminescent low-emission fungus; `#` high cavern edge/rock obstruction; `^` loose rubble/difficult terrain candidate.

This diagram is a communication aid. It is **not** an approved Spatial Blueprint or wall-coordinate dataset. In particular, some side-trail lines are abbreviated; the intended loop relationships are described explicitly below.

## 4. Proposed topology and coordinate anchors (36×24 logical units)

Coordinates are logical cells measured **from the northwest upper-left**, x increasing east, y increasing south; they are anchors only, not a final collision geometry.

| Stable provisional key | Candidate logical (x, y) | Geometry / purpose |
|---|---:|---|
| `M02-ARRIVAL-WEST` | (1, 13) | Safe western landing, clear of trunks; connects from M01 eastern exit |
| `M02-ROAD-SPLIT-WEST` | (8, 13) | Main/alternate south trail junction |
| `M02-ROAD-SPLIT-NORTH` | (13, 12) | Main/alternate north trail junction |
| `M02-MILESTONE-01` | (19, 13) | Weathered marker beside road; proposed discovery anchor, not yet active |
| `M02-ROAD-REJOIN-NORTH` | (27, 13) | Rejoin from north clearing |
| `M02-ROAD-REJOIN-SOUTH` | (31, 13) | Rejoin from southern habitat loop |
| `M02-EXIT-EAST` | (35, 13) | Safe outgoing eastern landing, destination M03 not yet identified |
| `M02-FORAGE-NORTH` | (20, 5) | Fungal harvest candidate in open northern clearing |
| `M02-GLOW-HOLLOW` | (20, 7) | Bioluminescent mushroom bed/light anchor, low intensity |
| `M02-HABITAT-SOUTH` | (15, 19) | GM-manual hunting scene/habitat; no automatic encounter trigger |
| `M02-SOUTH-RUBBLE` | (23, 20) | Loose stone/difficult ground if its traversal classification is accepted |

**Route topology**:
- Main roadway runs west edge → west split → north split → milestone → north rejoin → south rejoin → east edge. Proposed road clearance **at least 3 logical cells (15 ft)** for Medium/Large creature maneuvering.
- North alternate loop: branches near `(13,12)`, passes `(15,7) → (20,5) → (25,8)`, then rejoins near `(27,13)`; proposal **at least 2 logical cells (10 ft)** walkable clearance, no dead-end.
- South alternate loop: branches near `(8,13)`, passes `(9,19) → (15,19) → (23,18)`, then rejoins near `(31,13)`; proposal **at least 2 logical cells (10 ft)** clearance, with hunt-capable habitat separated from the main road by giant trunks.
- Keep both trail loops connected and visibly legible in the structural render; no false shortcuts through trunk bases or perimeter cliffs.
- The eastern route's eventual destination must be resolved by semantic scene/arrival names at runtime, never a guessed UUID.

## 5. Proposed physical classification

- **Full height movement/LOS walls:** rocky cavern boundary, opaque mushroom trunks with actual grounded footprints, and only genuinely solid major rockfall masses.
- **Terrain/conditional blockers:** loose debris and thick spore beds only after their gameplay classification is approved. Mushroom caps/canopies can create cover and shadow but are **not automatically full-height ground collision walls**.
- **Decorative only:** fungal frills, small mushrooms, cap texture, floating spores, worn stone edging, moss.
- **Lighting anchors:** low teal-green fungal beds, subtle cold mushroom glow, approximately three dim roadway torch fixtures with warm light. Avoid doubling painted bloom in Foundry.
- **No water:** no pond, river or fishing Region in the proposal.
- **No visible mineable ore:** no mining Regions.
- **No automatic hunting:** habitat Region may support **manual Gamemaster-triggered** monster hunts only.
- **Forage candidate:** needs real Regionwright hunting/gathering module contract readback before declared ACTIVE. A Region name alone does not prove a mechanic.
- **Milestone candidate:** use the DiceBox discovery 3-stage Notice → Interpret/Search → Recover contract only if the user approves a specific discovery/reward.

## 6. Required acceptance checks before structural render

1. User confirms **M02 name and continuity** from M01; no unrelated canon has been invented.
2. User accepts **180×120 ft**, `36×24`, `120px/5ft`, `4320×2880` as this map's logical and physical footprint.
3. Main road plus north/south loops are topologically coherent; clearances support intended party token footprints and branch/rejoin routes.
4. Northern harvest clearing and southern manual habitat are accessible and do not lie inside a blocking mushroom footprint.
5. The cavern border remains clearly separable from raised mushroom caps and their shadows.
6. A proper Spatial Blueprint with fixed world-coordinate geometry, opening widths, wall/Region semantics and stable references is drafted and reconciled with this diagram **before any scene BUILD**.
7. Grayscale INSPECT evaluates all of the above. If it fails, **discard failed render prompt** and create an independent fresh grayscale prompt from accepted PREPARE and Blueprint; do not patch the failed prompt.
8. Final painterly map must preserve approved grayscale topology and semantic features, with a separate FINAL_INSPECT PASS.

## 7. Workflow / installation boundary

After approval and FINAL_INSPECT, generate a single canonical `.md` BUILD containing **one self-contained Foundry JavaScript macro**. The macro installs or reconciles artwork/Scene/default Level/walls/lights/Regions/behaviors/routes and emits a complete reread receipt. Injector 2.0 remains prototype-only preflight until full runtime certification.

**Status now:** `PREPARE_DRAFT`. No final art, approved Spatial Blueprint, Foundry scene, or macro has been created by this file. A design proposal is not player-tested evidence.

## 8. Discovered M01 scale evidence (not an M02 design approval)

The earlier on-disk `M01_build_manifest.json` includes a `canvas.scale_note` stating **“PREPARE says 36x24 5ft cells”** even though M01's existing Scene reads `1536×1024` at `64px/5ft`. This is stronger historical evidence for M01's intended dimensions than inferring `24×16` from the installed grid. The original M01 PREPARE itself still needs provenance checking before a live migration is authorized. Do not resize M01 automatically.

## 9. Next action

Review the proposed Tallcap Forest PREPARE in chat. On approval, lock the Spatial Blueprint, then proceed to grayscale STRUCTURAL_RENDER, structural semantic inspection, painterly rendering and final inspection. Do not bypass these gates or split final installation into multiple macros.
