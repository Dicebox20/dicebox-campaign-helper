# DiceBox Map / Token Scale Standard — 2026-10-05

**Status:** user-accepted workflow hardening  
**Default profile:** `battlemap-120`  
**Scope:** DiceBox battle maps and Foundry Scene Injector BUILDs unless PREPARE explicitly records a user-approved exception.

## Why this exists

A map can look correct while still be scaled poorly in Foundry. Scene pixel dimensions, Foundry's logical grid size, the map's intended physical area, token footprint, and token artwork scale are separate concepts. Previous maze BUILDs used a 50px logical grid with 1800x1200 Scene dimensions. They worked, but the resulting canvas was smaller and lower-density than desired.

This standard makes map scale a first-class PREPARE/BUILD invariant rather than something inferred after the map is installed.

## Research basis

Foundry's current Scene documentation says:

- Foundry's default grid size is 100px and its minimum is 50px.
- Common map grid sizes include 70, 100, 140, and 200px.
- Even when a Scene is Gridless, the grid configuration remains the basis for token placement and distance measurement.
- Scene image dimensions, grid size, and intended grid-space count must agree.
- Padding creates extra canvas outside the background and is intended for staging/hidden space; it is not a substitute for correcting map scale.

Foundry's Content Creation Style Guide further recommends standardized pixels-per-grid-space, says map dimensions should be whole logical grid-space counts, and recommends at least 100px per grid for better precision. The Media Optimization Guide recommends gridless-ready map art without a baked grid and explains that token artwork should have substantially more source resolution than one displayed grid cell for zoom quality.

Foundry's Token documentation defines Token width/height in **grid units** and explicitly states that **Scale (Ratio) changes only the artwork, not the occupied token footprint**.

The official D&D5e system has `Sync Token Size` enabled by default and derives token width/height/depth from `CONFIG.DND5E.actorSizes`. Scene BUILD code must not fight that system behavior by resizing player/creature footprints merely to compensate for a map-scale problem.

Community Dungeondraft/Foundry practice commonly uses roughly 100–120 pixels per grid as a quality/file-size compromise. DiceBox standardizes on 120 because it matches the user's Dungeondraft working convention and remains safely above Foundry's minimum/default-quality range.

Reference sources:

- https://foundryvtt.com/article/scenes/
- https://foundryvtt.com/article/content-creation-guide/
- https://foundryvtt.com/article/tokens/
- https://foundryvtt.com/article/media/
- https://foundryvtt.com/article/dynamic-token-rings/
- https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/settings.mjs
- https://github.com/foundryvtt/dnd5e/blob/6.0.x/module/documents/actor/actor.mjs

## Canonical battle-map scale

Default DiceBox profile:

```text
profile: battlemap-120
grid type: Gridless
logical grid size: 120 pixels
logical distance: 5 ft
units: ft
padding: 0 unless PREPARE explicitly requires staging space
```

The grid is **logical only**. It is not rendered over the map.

### Geometry equation

PREPARE must lock the intended logical map dimensions before BUILD.

```text
scene width pixels  = logical columns × 120
scene height pixels = logical rows × 120
```

Example for the current 3:2 forest-maze footprint:

```text
logical size: 36 × 24 five-foot spaces
physical area: 180 ft × 120 ft
Scene pixels: 4320 × 2880
```

This preserves the gameplay footprint of the earlier 1800x1200 / 50px scenes while giving Foundry a substantially larger canvas and a consistent 120px token/grid scale.

Do **not** fix a too-small or too-large map by changing token Scale Ratio.

## Background renderer rules

- No baked visible grid.
- Prefer WebP for transport/file-size efficiency.
- The installed/verified background should match the Scene's final pixel dimensions whenever practical.
- Preserve the approved art composition while resampling to the canonical Scene dimensions if needed.
- Prefer staying below roughly 8000px on either axis for broad GPU compatibility; the standard 4320x2880 forest target is comfortably inside that envelope.
- Do not use Scene padding as a substitute for correct logical map dimensions. Padding may be added only when the scene specifically needs off-map staging/hidden workspace.
- PREPARE may choose a different logical footprint, but BUILD still derives the pixel dimensions mathematically from the selected scale profile.

## Token footprint rules

Token **footprint** is mechanical. Token **artwork scale** is visual.

### Mechanical footprint

For D&D5e creatures, prefer the system's size synchronization. Do not override prototype/placed token width or height in a Scene Injector merely to make tokens “look right” against a mis-scaled map.

Typical 5e battlefield footprints remain the system-defined result for Tiny/Small/Medium/Large/Huge/Gargantuan actors. If a specific actor intentionally needs a nonstandard footprint, that is an Actor/token decision and must be documented separately.

### Artwork resolution

DiceBox overhead-token source-art targets:

- Tiny: 256px square
- Small/Medium: 512px square
- Large: 1024px square
- Huge: 1024px square
- Gargantuan: 2048px square

Prefer transparent WebP for finished overhead tokens and maintain the existing DiceBox top-down orientation workflow.

### Scale Ratio

Scale Ratio is **not** a map-scale control.

- It only changes how large the token image is drawn inside/around its mechanical footprint.
- A value around 0.8 is a useful starting point for a 1x1 humanoid whose artwork fills its square, but it is not a mandatory global constant.
- Adjust visual scale only for crop, transparent margin, silhouette, or deliberate oversize art.
- Never use Scale Ratio to compensate for the wrong Scene grid size or wrong map dimensions.

## BUILD contract v2

All new Scene Injector BUILDs use:

```text
DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
DICEBOX_SCALE_PROFILE: battlemap-120
DICEBOX_GRID_TYPE: gridless
DICEBOX_GRID_SIZE: 120
DICEBOX_GRID_DISTANCE: 5
DICEBOX_GRID_UNITS: ft
DICEBOX_LOGICAL_SIZE: <columns>x<rows>
DICEBOX_SCENE_PIXELS: <width>x<height>
DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
```

The macro must define exactly one `DICEBOX_SCENE_SCALE` source-of-truth constant and use it for Scene width, height, and grid fields.

The BUILD validator fails closed when:

- the battlemap-120 profile does not use 120px / 5ft / Gridless;
- logical dimensions and Scene pixel dimensions do not satisfy the scale equation;
- the runtime Scene fields bypass the `DICEBOX_SCENE_SCALE` source of truth;
- token footprint/art-scale policy markers are missing.

## Exceptions

A nonstandard scale is allowed only when PREPARE explicitly records the reason and the user approves it. The BUILD must use `DICEBOX_SCALE_PROFILE: explicit-exception`, include `DICEBOX_SCALE_EXCEPTION_APPROVED: true`, and state the reason. Silent scale drift is invalid.

## Existing maze builds

L1-01 through L1-03 are legacy v1 BUILDs. Their successful runtime result remains valid evidence, but their 50px/1800x1200 scale is superseded for future BUILD work. Do not silently mutate those installed Scenes. If they are rebuilt or patched, convert them deliberately to the current scale profile and reread all Wall/Region coordinates after the change.


## Accepted 2026-10-09 Injector 2.0 scale preflight hardening

This is an **additive acceptance**, not a change to the existing `battlemap-120` values or token-art targets. It is grounded in the official Foundry scenes, token, media, and Content Creation Style Guide documentation recorded in `docs/DICEBOX-GRID-TOKEN-RESOLUTION-RESEARCH-2026-10-09.md`.

### PREPARE must lock five independent measurements

1. **Game-world footprint:** width and height in feet, with an explicit approval source.
2. **Logical cells:** integer columns and rows at 5 feet per cell, unless PREPARE explicitly approves a different distance.
3. **Logical pixel density:** Gridless and **120 scene pixels per 5-foot cell** by default.
4. **Approved source raster:** actual original image width/height, provenance and hash; never assume upscaling increases image detail.
5. **Final Scene canvas and coordinate mapping:** `cols × gridSize` by `rows × gridSize`, with an explicit single uniform source-image-to-Scene transform for all bound Walls, Regions, lights, sounds, notes, tiles and arrival anchors.

A scene's existing image dimensions, current grid value, and visual proportions are **not evidence of PREPARE-approved physical size**. If game-world feet or coordinate mapping are unresolved, `BUILD` cannot claim scale compliance. A novel default footprint must never be silently inferred from the source art's 3:2 aspect ratio.

### Mandatory quality gates

- Validate `physicalWidthFt = columns × distanceFt` and `physicalHeightFt = rows × distanceFt`.
- Reject a nonuniform source-to-scene transform unless PREPARE explicitly approves a documented crop or coordinate reprojection that is geometry-tested.
- Check corridor, door and walkable terrain clearance against **mechanical token footprint**. Keep D&D5e size synchronization as authority where applicable.
- Distinguish native image detail from upscaled display pixels; record compressed file bytes separately from decoded image width/height and GPU texture risk.
- For an existing Scene, **never change only the grid size**. Snapshot and reconcile the background, Level, Wall, Region, lighting, Tokens, and distances through one approved migration, and verify after mutation.
- The common 24×16, 36×24, 48×32 examples are optional layout tiers, not universal map dimensions.
- A default at 120px remains accepted; the optional 128px snapping threshold is not a reason to change the project's current Gridless default.
- Unknown approved footprint/scale is `BLOCKED`, not a warning and not a reason to fabricate an exception.

### Prototype evidence and limit

`tools/dicebox-injector-v2-core.mjs` and its regression tests demonstrate **no-write preflight behavior only**; they do not confer production install capability or runtime certification. The M01 live read-only observation on October 9 showed 1536×1024 with a 64px grid, implying 24×16 logical spaces mathematically; that implication does not approve a 120×80ft map. The installation remains unchanged until a scale migration is explicitly reconciled.
