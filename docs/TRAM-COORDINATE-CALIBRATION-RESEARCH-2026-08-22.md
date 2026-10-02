# Tram Coordinate Calibration Research

Date: 2026-08-22

Evidence class: research only. This document does not authorize a Foundry write or select a final implementation.

## Question

Can DiceBox improve Tram map, Tile, Wall, door, and Region accuracy by coordinating the Campaign Helper's authoritative Blueprint with a Foundry-side calibration surface, instead of inferring document coordinates from browser screenshots?

## Existing project boundary

- Spatial Blueprint coordinates remain authoritative.
- The Tram Scene is 1536×1024. The Rush Hour board is `(420,210,660,570)`, with a 6×6 matrix of `110×95` cells and an eastbound rail centerline at `y=447.5`.
- Screen and screenshot coordinates are temporary viewport projections and cannot become stored geometry.
- The current fixture contains existing native documents, so any alignment process must preserve foreign state and must not silently rescale or reposition unrelated documents.

## External implementations and observed results

### Foundry v14 native coordinate conversion

Foundry v14 exposes `canvas.canvasCoordinatesFromClient(point)` and `canvas.clientCoordinatesFromCanvas(point)`, plus the current `canvas.dimensions`, Scene, Level, and grid. These APIs provide the supported boundary between browser-client coordinates and Scene canvas coordinates. SharedControl 1.6 reports that replacing manual coordinate conversion with `canvasCoordinatesFromClient` fixed erratic taps on HiDPI, Retina, and scaled displays. This directly matches the project's maximized-window and screenshot-coordinate failures.

Sources:

- https://foundryvtt.com/api/v14/classes/foundry.canvas.Canvas.html
- https://github.com/sgshryock/shared-control

### Precision Grid Aligner

Precision Grid Aligner uses two draggable diagonal anchors over a known 3×3 area, calculates horizontal and vertical fit independently, previews through a temporary DOM/SVG overlay, and applies only after confirmation. Its current source stores normalized points in the rendered background, rereads the rendered mesh after Scene updates, and iteratively corrects background scale and offset. The published result supports uniform X/Y distortion and fine translation adjustment.

Its limitations are decisive for DiceBox: it targets Foundry v13, cannot correct perspective or nonuniform local distortion, and does not reposition existing Walls, Tiles, Tokens, or other placeables. The author explicitly recommends alignment before those documents are created. DiceBox should therefore reuse the measurement and preview pattern, not install its Scene-mutating Apply operation over an already-populated Tram Scene.

Sources:

- https://foundryvtt.com/packages/precision-grid-aligner
- https://github.com/zooza121/precision-grid-aligner

### Universal Battlemap Importer

Universal Battlemap Importer 6.1.1 is verified for Foundry v14. Its source demonstrates a manifest-first geometry path: `resolution.map_origin`, `resolution.map_size`, and `resolution.pixels_per_grid` define the coordinate transform; `line_of_sight`, `portals`, and lights are converted into native Scene documents using the same scale. This produces reproducible alignment when the export metadata is correct and every generated document shares one transform.

The importer does not carry DiceBox stable IDs, Regions, RegionBehaviors, dynamic car state, or foreign-state reconciliation. Community reports also show that incorrect or changed pixels-per-grid metadata causes grid-size regressions even when image import succeeds. DiceBox should therefore borrow the single-manifest transform, but retain its own stable-ID diff and authoritative reread layer.

Sources:

- https://foundryvtt.com/packages/dd-import
- https://github.com/moo-man/FVTT-DD-Import
- https://www.reddit.com/r/FoundryVTT/comments/1spgwg4/universal_battlemap_importer_issue/

### Grid alignment and Region tooling

Grid Scaler's draw-a-square and 3×3 tools show the older common approach: infer grid size from a measured span, then adjust X/Y offsets. Community results repeatedly report edge drift when a raster has fractional cell dimensions, inconsistent scaling, or was resized after export. Precision Grid Aligner improves this by measuring both axes independently, but still cannot repair a non-affine image.

Terrain Mapper demonstrates a complementary Region approach: derive Region shapes from existing grid, wall, or line-of-sight topology rather than manually tracing screen pixels. For DiceBox's rectangular Rush Hour cells, generating Regions directly from board origin and cell dimensions is simpler and more deterministic than image-derived segmentation.

Sources:

- https://foundryvtt.com/packages/scaleGrid
- https://github.com/caewok/fvtt-terrain-mapper
- https://www.reddit.com/r/FoundryVTT/comments/wzebpr/how_to_easily_match_foundry_grid_to_preexisting/
- https://www.reddit.com/r/FoundryVTT/comments/ikrqhr/grid_alignment_problems_to_premade_maps/

## Candidate architecture

The strongest lead is a two-sided calibration handshake, not a general Scene rescaler.

### Campaign Helper side

Emit one versioned coordinate manifest containing:

- exact Scene and renderer dimensions and renderer SHA-256;
- Blueprint, board, rail, Wall, door, Tile, Region, and car stable IDs;
- expected native bounds and shared geometry references;
- allowed ownership scope and coordinate tolerances;
- source version and manifest hash.

Every derived object must reference one shared geometry record. A car Tile and its optional footprint Region must not calculate their bounds independently. The 36 board Regions must be generated from the board's four parameters rather than stored as manually edited rectangles.

### Foundry module side

Provide a versioned, GM-only calibration mode with four operations:

1. **Inspect:** convert pointer input with Foundry's native client-to-canvas API and read actual Scene, Level, Wall, Tile, and Region data.
2. **Preview:** draw expected geometry and actual geometry together without creating documents.
3. **Compare:** emit expected, observed, and delta values by stable ID; detect missing, duplicate, foreign, and ambiguous documents.
4. **Apply owned correction:** only after a separate approval, update explicitly owned runtime IDs and reread them. Background rescaling and document correction must be separate operations.

The overlay can follow the Precision Grid Aligner DOM/SVG pattern, but every visual point must be produced through Foundry's native canvas/client conversion. Alternatively, a versioned v14 CanvasLayer or InterfaceCanvasGroup adapter can draw world-bound graphics. The implementation should avoid storing viewport coordinates.

### Landmark fit

Use two diagonal visual landmarks to estimate independent X/Y scale and translation. Use a third landmark—the eastbound rail center—to validate the fit rather than to silently introduce a more flexible transform. If the third landmark exceeds tolerance, classify the raster as locally distorted and reject it; do not bend Blueprint geometry to match it.

For the Tram candidate:

- anchor A: northwest board corner `(420,210)`;
- anchor B: southeast board corner `(1080,780)`;
- validation anchor C: eastbound rail center `(1512,447.5)` or yard exit `(1080,447.5)`.

## Recommendation candidate

Do not install a general grid aligner and let it mutate the populated Tram Scene. Prototype a read-only DiceBox calibration overlay inside the existing Campaign Helper Foundry module, backed by a versioned manifest from the compiler. First prove native coordinate conversion and expected-versus-observed receipts in the isolated fixture. Only after that proof should an owned-only correction operation be considered.

This combines the strongest demonstrated results:

- native Foundry conversion avoids display-scale errors;
- two-anchor independent-axis measurement detects uniform raster drift;
- manifest-driven generation keeps Walls, doors, Tiles, and Regions on one transform;
- stable-ID comparison and authoritative reread preserve DiceBox ownership and recovery requirements.

## Remaining questions before implementation

- Confirm the exact Foundry v14 initial-Level background fields used for renderer scale and offset in the project's adapter.
- Decide whether the read-only overlay is DOM/SVG or a v14 world-bound CanvasLayer after a minimal fixture prototype.
- Define acceptance tolerance separately for document geometry (exact) and visual landmark fit (small measured tolerance).
- Decide whether the calibrator remains a development mode in Campaign Helper or is packaged as a separate fixture-only module.
