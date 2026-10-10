# M02 Tallcap Forest — Attempt #5 Northern Ground-Boundary Review v002

**Outcome:** **NEEDS_RECONCILIATION**. Northern swept clearance against the **current provisional model** passes after a non-destructive route correction and addition of a real grounded rock cluster. **The overall Blueprint is NOT LOCKED and PAINTERLY RENDER is NOT authorized** because wall-ground edge precision is not certified and the southern draft centerline still intersects one drafted solid barrier.

**Current canonical rule:** `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` (v0.1). Source `grayscale_mushroom_cavern_map.png` exact SHA-256 `878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`, 1536×1024. **No image modifications, new generations, Foundry writes, or edits to previous historical receipts.**

## Files

- [v002 candidate Spatial Blueprint](M02-ATTEMPT5-SPATIAL-BLUEPRINT-CANDIDATE-v002.json) — **203** provisional Walls, six Regions, six anchors, one declared semantic default Level; validates against canonical `spatialBlueprintSchema` v0.1.0.
- [v002 Feature Manifest](M02-ATTEMPT5-FEATURE-MANIFEST-CANDIDATE-v002.json) — preserves all former classifications/Regions; adds **one** previously missed upper-crest grounded rock and ten closed-wall segments; revises **only northern route** waypoints.
- [v002 geometry audit source](M02-ATTEMPT5-GEOMETRY-AUDIT-v002.ts) — reproducible TS/Node/tsx geometry checker for **all three** candidate routes and canonical geometry-tolerance guard. Run from repo root with `node node_modules/tsx/dist/cli.mjs work/btr-underdark-expedition/M02-ATTEMPT5-GEOMETRY-AUDIT-v002.ts`.
- [v002 QA receipt](M02-ATTEMPT5-NORTH-GROUND-REVIEW-QA-RECEIPT-v002.json) — exact metrics and stage decision.
- Visual inspection overlay: `M02_North_Loop_v002_candidate_fullmap.png`, SHA-256 `bb82ada5495a39362c7e6057f0376df53e9140b843478a504947efd23a6739d1`, **held as a chat artifact**, not embedded in the repo. The artifact is a transparent inspection layer composited for inspection and is **not** a modified authoritative grayscale scene asset.

## Source-observed semantics

### Western passage — x423,y282 → x510,y162

The original straight trace cuts dangerously close to real protruding grounded stone in the north-central rock cluster. In the previous authored solids the centerline approached `N-L-03 dense tall stones` by only **17.67 source px**, less than the Medium token radius **21.333 px**. A visibly winding road bends left of the stone; the route now follows source-image waypoints `(423,282) → (413,251) → (418,226) → (433,206) → (458,182) → (486,163) → (510,162)`. This moves only the *proposed centerline*, never the actual rocks. The revised western segment's modeled minimum solid separation is **34.25px**.

### Northeastern upper bend — x894,y173 → x988,y115

The original model omitted a grounded **stone mound/spire group** in the upper forest floor around source **x897–979, y99–157**. On tracing this object as solid rock, the former straight proposed line **intersects** the obstacle; the previously reported raster brightness route must not be treated as a collision certificate.

Add one closed solid-rock polygon with ten native-source vertices; append ten Walls. Keep elevated mushroom caps and their shadows decorative/no full wall. Correct northern waypoints by tracing around the rock's **upper** side toward the east rather than crossing it, with a five-foot swept-token preview. The path is a candidate, not a guaranteed traversable narrow trail: stone/cliff boundary confidence near the upper cavern rim still needs tighter survey.

## Five-foot swept geometry QA

Source scale: 36×24 logical 5ft spaces gives **8.533333px/ft**; Medium token radius **21.333px**. Use a provisional **6px** edge-location uncertainty (approximately **0.703ft**, exceeding the preferred 0.5ft wall-alignment target), giving **27.333px** required center-to-model-obstacle separation. This is a conservative buffer around *hand-drafted polygons*, **not independent proof that all rock/ground boundaries are positioned correctly**.

| Candidate route | Nearest modeled solid / center distance | Nearest authored cliff line | Margin after radius and 6px edge uncertainty | Geometric model |
|---|---|---:|---:|---|
| Main | southwest rock, **48.926px** | 375.139px | **+21.592px** | PASS *draft only* |
| North (revised) | newly added upper-crest stone, **31.391px** | 34.814px | **+4.058px** | PASS *draft only*, fragile source edge confidence |
| South (unchanged) | southeastern ridge, **0px — centerline intersects solid** | 58.309px | **−27.333px** | **FAIL draft geometry** |

**Southern conflict:** existing centerline section source `(1132,827)→(1248,728)` intersects `m02-005-southeast-ridge` (a real modeled solid rock barrier). This is an **error in the candidate spatial route**; it is **not evidence that the painting or source image must be rejected**. Preserve the rock; retrace the actual walkway around it in a later scoped reconciliation pass. The tolerance calculator appropriately returned `REDO_REQUIRED` for that *draft route*; the overall map decision is **geometry reconciliation**, not unconditional creative image REDO.

## Canonical validator results

On a **separate Windows QA worktree** containing the unchanged v002 GitHub JSON, the canonical `validateSpatialBlueprint` returned **PASS**: 203 Walls, six Regions, six anchors, one Level. The source-owned geometry-audit TS script completed successfully and produced exact solid polygon/ellipse and cliff-polyline distances, including closed-polygon interior crossings. Original 193 walls, first 22 obstacle groups, six Region shapes, and six anchors were **byte-for-byte identical** in v001 versus the v002 prefix; only northern route waypoint data changed.

`assessRouteClearance` returns `NEEDS_RECONCILIATION` for north and main because actual walkable-floor source boundaries and the true mechanical token sweep in Foundry are **not independently confirmed**. The southern *draft line* returns a geometric `FAIL`. `assessWallAlignment` returns **REVIEW / ALIGNMENT_UNVERIFIED**: estimated rock/ground contour uncertainty **0.703ft** is above the preferred **0.5ft** alignment target, and no exact deviation from approved source pixels was measured. A projected Full Wall around an overhanging mushroom cap remains prohibited.

The prior 80/85/90/95 luminance-threshold sensitivity is **explained but not fully eliminated**. Image brightness is not the same as walkable ground: northern shadows can darken playable floor, while light mushroom caps/rock tops can mislead a pixel-only classifier. New geometry is source-informed, but more precise contour review is still needed to move from proxy PASS to game-ready PASS.

## Stage decision and next bounded action

**NO PAINTERLY RENDER YET.** Preserve current grayscale, all historical records and original v001 candidate. Keep the v002 files explicitly `CANDIDATE_NOT_LOCKED`.

**Next: SOUTH LOOP WALKABLE-GROUND RECONCILIATION + CRITICAL WALL ALIGNMENT REVIEW.** On attempt #5 only, review southern ridge at `(1132,827)→(1248,728)`; route around it along demonstrably traversable terrain without deleting the barrier. Re-measure upper cavern rim and new crest rock ground boundaries to ≤0.5ft alignment confidence or explicitly approve a documented exception, verify all routes' contiguous five-foot Medium swept footprints on **actual floor**, and reconfirm Region entrances/forage/hunt anchors. Then rerun official Blueprint/tolerance QA. A painterly lock needs a new evidence-backed structural PASS, not simply mathematically clear routes.

**Runtime Foundry actions:** none. **Foundry writes:** **0**. **M02 images regenerated/edited:** **0**.
