# M02 — Tallcap Forest | Feature Manifest & Spatial Blueprint Reconciliation v001

**Stage:** `FEATURE_MANIFEST_BLUEPRINT_RECONCILIATION`  
**Outcome:** `DRAFT / NOT LOCKED` — the approved grayscale is preserved, but two trial route-clearance checks need reconciliation before painterly rendering.  
**Prepared:** 2026-10-09 project-local date  
**Map:** M02 — Tallcap Forest (`dbx:scene:m02-tallcap`)  
**Immutable grayscale:** `monochrome_mushroom_cavern_map.png` | 1536×1024 RGB PNG | generation `5be5a710-5a14-412f-bfd3-b7006efc7b8c` | SHA-256 `d8b171a6e697f279ef0d9d4cb51be7b0060fc3170554ae70d8de8af0e9838956`  
**Source requirement:** M02 PREPARE candidate 36×24 at 5ft per cell (180×120ft), default DiceBox Gridless 120px / 5ft; source-to-Foundry uniform scale factor **2.8125** (1536×1024 → 4320×2880).  
**Canonical machine-shaped deliverables:**
- [M02 candidate Spatial Blueprint](M02-SPATIAL-BLUEPRINT-CANDIDATE-v001.json) — schema `0.1.0` shape; 161 authored wall line segments, seven area Regions, six interaction/arrival anchors, one DiceBox-semantic Level for mapping to Foundry's default Level.
- [M02 candidate Feature Manifest](M02-FEATURE-MANIFEST-CANDIDATE-v001.json) — 30 semantic entries, map-sourced wall intent, annotated Region status, provisional route centerlines, and explicitly pending mechanics.

**No Foundry Scene, Wall, Region, lighting, or other runtime write has been performed.** Source art and earlier failed prompts/images are not used to derive a new generation prompt; they remain historical evidence. This document interprets the *approved* grayscale as an authoring reference as required by the creative workflow.

## Key authored semantics

| Feature | Source-image indication | Planned Foundry projection | Disposition |
|---|---|---|---|
| Main west–east road | Horizontally continuous cleared band through the center | Traversable; no Wall at road edge | Required >=15ft walkable clearance |
| Northern circuit | Trail winding through upper grove, rejoining central road at east | Traversable, no automatic terrain cost | **Clearance unresolved** at rock spires and cap/trunk bases |
| Southern circuit | Trail looping around southern stalks and rock rubble | Traversable, no automatic terrain cost | **Clearance unresolved**; preliminary centerline intersects 2 provisional obstacle polygons |
| Cavern north/south perimeter | High rock cliffs around playable clearing with west/east corridor apertures | Full Wall, movement/vision/light/sound block | 21 perimeter candidate segments; ends deliberately open |
| Tallcap mushroom stalks | Grounded woody trunk cores, not overhead cap silhouettes | Full Wall around stalk footprints **only** | 10 provisional trunk footprints, 100 small line segments |
| Hard interior rock/stalagmite forms | Recognizable steep/sheer stone masses | Full Wall only for grounded solid mass | 4 provisional rock groups, 40 line segments |
| Giant mushroom canopy | Radial cap tops above ground, cast shadow | **No full movement/vision Wall on cap rim** | Locked classification |
| Roadside loose stones and fungi | Low fieldstone borders, small mushroom frills | Background-only, no full Wall | Locked classification |
| Roadside milestone | Standing stone on north shoulder (~source x794, y400) | Interaction Region, optional Note | Mechanical lore/DC/reward **not approved** |
| Northern mushroom hollow | Upper central clusters/clear forest-floor pocket | Forage Region with Regionwright adapter | Module API/configuration **not yet verified** |
| Southern habitat | Open southern trail with fungal clusters | Habitat Region, **manual GM hunting start** | No token-enter automatic hunt |
| Northern glow bed | Local pale fungal clusters (~x844, y220) | Low-output AmbientLight candidate | Range/intensity not approved |
| Southern loose rubble | Around the east-central south boulder field | Terrain Region candidate | Distinguish solid rocks from difficult scree before enabling |
| West arrival | Main road west edge (~x66, y475) | Arrival Region, connect to M01 when target resolves | Live binding pending, no guessed UUID |
| Eastward transition | Main road east edge (~x1485, y475) | Exit/arrival Region | M03 target unresolved; don't install false teleport |

**Absent by PREPARE:** fishing/water and mining/ore deposits. Do not invent Regions for them. Original PREPARE proposes approximately three torches, but the grayscale does **not** prove the number and placement of distinct fixtures; leave torch dynamic lights pending until recognized or explicitly authored. Ambient fungal lights also require conservative calibration.

## Draft geometry and QA

### Coordinate contract

```text
Coordinate origin: image northwest (0,0)
Positive X: east | Positive Y: south
Structural source image space: 1536 × 1024 px
Foundry target scene space: 4320 × 2880 px
x_foundry = x_source × 2.8125
y_foundry = y_source × 2.8125
Grid type = Gridless; grid pixel size = 120; distance = 5 ft
```

Sample transformed anchors:

| Semantic anchor | Source x, y | Foundry x, y |
|---|---:|---:|
| Western spawn | (66, 475) | (185.625, 1335.9375) |
| Roadside milestone | (794, 400) | (2233.125, 1125) |
| Northern forage | (775, 190) | (2179.6875, 534.375) |
| Southern GM hunt | (618, 811) | (1738.125, 2280.9375) |
| Eastern exit | (1485, 475) | (4176.5625, 1335.9375) |

### Deterministic basic schema checks already completed

- 161 Wall segments are in target bounds and nonzero-length; globally distinct DiceBox semantic IDs.
- Seven geometrically positive Regions and six anchors are within bounds; each anchor links to a Region and its location lies inside the linked Region.
- Exactly one semantic cavern-floor Level is declared for later mapping to Foundry's existing `defaultLevel0000`; **do not create a second runtime Level**.
- Main-road *authored centerline* avoids the drafted wall obstacles with 98.5 source pixels minimum centerline-to-obstacle distance (required half-width 64). This is **not sufficient proof** that all visible roadway edges satisfy 15ft.
- Northern loop: minimum drafted centerline-to-solid-obstacle gap is **8.0 source pixels**, below 42.67 needed for 10ft width.
- Southern loop: drafted centerline intersects **two** obstacle footprints (minimum gap 0), failing even a collision-free centerline.
- These checks use human-authored approximate blocker polygons and route lines, **not** a pixel-derived collision certificate or Foundry movement canary. The grayscale visual `STRUCTURAL_INSPECT: PASS` remains historical art approval, not proof of final Wall/Region clearances.

### Required reconciliation actions

1. Review **northern** rock spire and stalk ground footprints against the approved image. Decide whether the draft Wall proxies are too large/off-center, or the trail centerline needs to trace the actual traversable band elsewhere. Preserve realistic geometry: do not erase a solid rock classification just to game the clearance test.
2. Review **southern** spire and large stalk footprints intersecting the drafted loop. Redraw centerline and solid footprints against visible structural evidence; require no intersections plus 10ft local clearance. A narrower real trail would require explicit PREPARE route-width amendment or independent structural REDO under the clean-prompt rule; never silently relax clearance.
3. Check that interaction Regions are on accessible floor and not buried in impassable stalk/rock areas.
4. Distinguish the southern **solid rock pile** from **loose difficult scree**; enable only approved Region mechanics.
5. Reconfirm any exact torches as visible fixtures or new approved infrastructure; don't infer dynamic flame from grayscale glow.
6. Review Regionwright gathering/hunting adapter contracts and user-approved discovery content. Region shapes without mechanics are not `READY`.
7. **Schema validator completed:** the current candidate passed the canonical `validateSpatialBlueprint` (`spatialBlueprintSchema` v0.1.0): 161 Walls, seven Regions, six anchors, one semantic Level. This validates structure/identities/bounds, **not** walkable clearance, adapter correctness or playability. Rerun this schema validator and an appropriate clearance/visibility test after geometry corrections; no Foundry installation has occurred.

## Stage decision

**Hold at `FEATURE_MANIFEST + SPATIAL BLUEPRINT — RECONCILE`.** Do **not** promote this candidate geometry to a locked Spatial Blueprint or to PAINT_RENDER until mechanical route widths and ground-footprint intersections are resolved. Do not undo the successful grayscale visual inspection without new structural evidence; attempt blueprint-level corrections first.

**Next step:** `BLUEPRINT RECONCILIATION` — resolve draft wall/trail overlap, rerun geometry QA, then, on PASS, `PAINTERLY RENDER`.
