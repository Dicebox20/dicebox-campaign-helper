# M02 Tallcap Forest — Attempt #5 Southern Loop and Final Wall Alignment Review v003

**Status: `NEEDS_RECONCILIATION` — modeled 5ft routes PASS; structural wall-placement/floor certification remains HOLD.**  
**Decision: `PAINTERLY_RENDER = NOT_AUTHORIZED`.**  
**Evidence date:** 2026-10-09 (project chronological record).  
**Source:** Original attempt #5 `grayscale_mushroom_cavern_map.png`, exact SHA-256 `878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`, 3,984,274 bytes, 1536×1024. Source unchanged. Earlier attempt #4 geometry and all historical v001/v002 and REDO receipts preserved. No live Foundry writes or new images.

**Normative project policy:** `docs/DICEBOX-GEOMETRY-TOLERANCE-STANDARD-2026-10-09.md` (v0.1); exact Gridless `battlemap-120`. Logical grid 36×24 at 5ft = 180×120ft, final Foundry 4320×2880, uniform source → scene multiplier **2.8125**. Mechanical Medium token diameter **5ft = 42.667 source px**; radius **21.333 source px**.

## New v003 artifacts

- [Feature Manifest v003](M02-ATTEMPT5-FEATURE-MANIFEST-CANDIDATE-v003.json): 23 grounded obstacle groups; main road unchanged; non-self-crossing north/south loop route metadata and conservative QA.
- [Spatial Blueprint v003](M02-ATTEMPT5-SPATIAL-BLUEPRINT-CANDIDATE-v003.json): **203** provisional Wall segments, **six** Region polygons, **six** anchors, one existing-default semantic Level. Every original v002 Wall/Region/anchor and solid-ground polygon is **identical** in v003; only two route waypoint lists were changed in the Manifest. No real obstacle deleted, widened, scaled or relabeled.
- [Reproducible v003 TypeScript geometry audit](M02-ATTEMPT5-GEOMETRY-AUDIT-v003.ts): canonical `validateSpatialBlueprint`, polygon/ellipse/segment clearance, non-self-intersection, Region anchor-circle enclosure and `assessRouteClearance` + `assessWallAlignment` checks. Run from repo root: `node node_modules/tsx/dist/cli.mjs work/btr-underdark-expedition/M02-ATTEMPT5-GEOMETRY-AUDIT-v003.ts`.
- [QA receipt v003](M02-ATTEMPT5-SOUTH-LOOP-AND-WALL-ALIGNMENT-QA-RECEIPT-v003.json).
- Review-only annotated overlay: `M02_attempt5_south_v003_geometry_overlay.png`, 1536×1024, SHA-256 `82b260cc2992b3baadfd8a2aad74e23e1ba0c036273628d61a8c5d9e1e16143b`. This is a *local chat-review visualization* and **not** the authoritative source image or a committed repo binary.

## 1. Southern loop correction — real ridge preserved

The previous v002 southern candidate ran source `(1132,827)→(1248,728)` and **intersected** the solid southeastern standing-rock ridge (the v002 model correctly assigned its footprint around x1187–1239, y650–752). It failed even zero-radius passage at the intersection.

The source grayscale visibly shows a separate trail curving **east** of that grounded ridge. Re-traced it instead of moving a wall. In the x1005–1260 bend, a 5ft-radius-safe pixel-proxy corridor was found at **brightness thresholds 70, 80, 90, 100, 110** after Gaussian smoothing, with the ridge/rock collision masks always applied. The search used a **30 source-pixel center-to-solid buffer** before simplifying waypoints to retain the swept radius. The resulting visible-floor candidate bends through `(1005,880)→(1127,858)→(1182,824)→(1234,774)→(1267,755)→(1270,742)→(1270,675)→(1260,649)` with intervening points specified exactly in the v003 manifest.

This is a **supporting brightness test**, not a magical light-color-to-walkability equation. Dark floor beneath overhanging mushroom caps may also be walkable. The final independent geometry check compares each route centerline segment to **all** authored solid shapes and the cavern boundary polylines, not just bright painted trail pixels.

## 2. Northern correction found by full-route audit

The saved v002 northern candidate had a previously missed line **self-intersection** at source approximately `(863.86,157.60)`. It arose when `(845,184)→(865,156)` crossed the backward leg `(894,173)→(849,150)`. That flaw was missed because earlier collision checks focused on distance to rock rather than line simplicity.

The v003 route removes only redundant waypoints `(865,156)` and `(894,173)`, connecting `(845,184)→(849,150)→(851,120)` on the existing upper trail. The grounded north-crest rock remains a full Wall, and the original v002 ground solid inventory is unchanged. The v003 route has **29** non-self-intersecting vertices, with a larger modeled solid reserve than v002.

## 3. Complete modeled five-foot route and Region QA

A five-foot Medium token is tested as a **radius 21.333px disk** around every continuous line segment. In addition, a **provisional six-pixel visual boundary uncertainty** is subtracted from the nearest modeled solid/cliff center distance (total reserved radius **27.333px**). The uncertainty is a **conservative estimate, not a measured maximum wall-placement error against independently verified ground truth**.

| Route | Vertices | Closest drafted solid center distance | Closest drafted cavern wall | Radius + 6px allowance reserve | Geometric assessment |
|---|---:|---:|---:|---:|---|
| West-east main road | 7 | **48.926px** | 375.139px | **+21.592px** | PASS — provisional geometry only |
| North loop, v003 | 29 | **34.253px** | 34.814px | **+6.920px** | PASS — provisional geometry only |
| South loop, v003 | 27 | **30.431px** | 58.309px | **+3.098px** | PASS — provisional geometry only |

All three route centerlines are now **non-self-intersecting**. Four short branch-to-main-road connector segments were tested and likewise have positive provisional clearance margins: approximately **+55.43, +33.89, +51.01, +45.01 source px**. All **six** Region-anchor clearance circles fit fully inside their draft Regions; their anchor points do not lie inside any drafted blocker. The official `spatialBlueprintSchema` v0.1.0 passes with 203 Walls, six Regions, six anchors, one semantic Level.

The TypeScript geometry tolerance assessments **correctly return `NEEDS_RECONCILIATION` on all three routes**, because their drawn rock polygons, cliff walkable surfaces and stage-appropriate movement evidence remain visually provisional; the sweep is against the *authored model* rather than an independently certified actual-floor mask. No Foundry movement test has occurred or been claimed.

## 4. Final ground-wall alignment review — cannot certify yet

The accepted wall-alignment preference is **≤0.5ft**, which at this raster is **≤4.267 source pixels**, with a **0.5–1.0ft REVIEW band**. The hand-authored outlines still carry an **estimated ±6 source-pixel ground-edge location uncertainty** = **0.703125ft**. Neither the original source nor the grayscale's dense rock textures establishes an independently measured *true ground boundary* precise enough to assert deviation ≤0.5ft across critical contours. `assessWallAlignment` therefore returns **`REVIEW / ALIGNMENT_UNVERIFIED`**, not PASS. Do not reduce the estimate merely to meet the policy.

Critical remaining checks:
- **North-upper crest rock and nearby upper cavern rim:** at closest parts the north route centerline is 34.253px from modeled solid and 34.814px from drafted cavern edge. The margin is positive under the proposed 6px buffer, but the true solid-floor boundary must be traced with stronger independent confidence.
- **South-east ridge bend:** the v003 line follows the visible road and clears the proposed rock polygon with only ~3.10px *remaining* after conservative allowance. A source-rock outline discrepancy greater than the assumed allowance could invalidate the clearance; conduct targeted 2–3× independent boundary review.
- **Far south-eastern `m02-005-southeast-cavern-rock` candidate** (source x1273–1370, y776–873): its projected solid-rock polygon overlaps the visible edge of a very large mushroom cap. The image does not conclusively certify the *whole projected footprint* is grounded rock. Preserve as a **candidate**, but verify canopy-vs-trunk/rock semantics before any actual full-blocking Wall projection. No obstacle was silently deleted.
- **Stage mechanics:** Regionwright foraging, manual hunting, milestone discovery and eastward travel target remain uninstalled/unbound and should not be fabricated as ready.

No intentional sub-10ft main-road bottleneck has been confirmed, localized or explicitly authored. The earlier bright-road samples of ~9.4–12.9ft remain **sampled painted texture**, not an end-to-end physical constriction measurement. No invented bottleneck metadata is promoted to canon.

## 5. Decision and handoff

**`FEATURE_MANIFEST / SPATIAL_BLUEPRINT v003: MODELED_ROUTE_GEOMETRY PASS; WALL_GROUND_ALIGNMENT NEEDS_RECONCILIATION; NOT LOCKED.`**

**PAINTERLY RENDER cannot begin yet** because the wall boundary uncertainty is in the REVIEW band and north/southeast critical walkable-floor classifications lack independently certified precision. This is **not a structural image REDO order**: the existing grayscale is retained, and no real obstacles are changed. Do not use a route-proxy PASS to claim actual player collision PASS.

**Next bounded task:** Independently certify the **three critical ground contours** (north crest, north rim and southern ridge), distinguishing the far-southeast cap silhouette from solid rock. Re-trace only provably inaccurate Wall vertices, retaining true obstacles, or explicitly record any user-approved documented wall-tolerance exception. Rerun the full candidate swept movement and Region QA; only then issue a separate `STRUCTURAL_PASS_WITH_DOCUMENTED_VARIANCE`/Blueprint lock receipt and authorize PAINTERLY RENDER. Foundry tests remain subsequent safe-stage work.

**Historical M02 reports overwritten:** 0. **Art image edits:** 0. **Live Foundry writes:** 0.
