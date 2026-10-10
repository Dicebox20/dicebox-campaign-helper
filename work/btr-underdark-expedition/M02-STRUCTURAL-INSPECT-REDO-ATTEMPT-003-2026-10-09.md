# M02 — Tallcap Forest · Grayscale Structural Inspection — Attempt 003

**Status:** `STRUCTURAL_INSPECT: REDO` — no authorization for PAINT_RENDER, final Blueprint lock or BUILD.  
**Date:** 2026-10-09 (project-local chronology)  
**Image attempt:** 003; standalone grayscale generation; `gen_id=3654c8be-b14d-4ade-add3-c500cbf35e37`, no parent edit ID.  
**Observed file:** `grayscale_mushroom_cavern_roadmap.png` (ChatGPT artifact, not yet an archived GitHub art asset)  
**File identity:** RGB PNG, 1536×1024, 3,807,512 bytes; SHA-256 `b587beb314412feddb580c0b497c0b20ffc5a4048507a37efa67fa44499fb9aa`.  
**Canonical inputs:** `M02-TALLCAP-FOREST-PREPARE-draft-2026-10-09.md`, current DiceBox image-prompt clean-restart rule (merged in main by PR #8), and the 36×24 / 5-foot working map footprint. PREPARE is still titled draft; this structural decision does not itself constitute blanket approval of unresolved specifications.  
**Earlier attempts:** 001 and 002 retained as historical REDO evidence only, never new generation inputs.  
**Nature of inspection:** human-readable visual review of image including center, north, south and edge enlargements; geometric pixel-width estimates, **not** exact traced wall/collision profiles.

## Requirement readback

| Requirement | Verdict | Evidence |
|---|---|---|
| Strict 90° overhead grayscale, no baked grid or token | PASS | Consistent largely orthographic overhead depiction, monochrome ground and fungal features |
| Main west→east road continuity | PASS | Clear road band crosses both image edges without obstruction or dead end |
| Northern branching/rejoining alternate loop | PASS topology only | North upper trail connects to the central road at left and right |
| Southern branching/rejoining alternate loop | PASS topology only | South lower trail connects at two separate road junctions |
| Milestone beside roadway | **PASS** | Marker stands on north shoulder near image center, visibly outside the primary road band |
| Northern forage opening and southern habitat | PASS for placement/access | Fungal pockets and giant-mushroom southern area visible and connected by paths, but not mechanically certified |
| Giant mushroom trunks vs overhead caps | PASS WITH MANIFEST REVIEW | Trunks grounded and identifiable. Caps overlap scenery; must not be promoted automatically to LOS/movement-blocking Foundry Walls |
| Rocky boundary / no unwarranted chasm network | PASS | Rock perimeter remains legible and interior is primarily level, traversable forest floor |
| West/east entrances | PASS for playable exits | Road exits image at both lateral boundaries; final travel/landing Regions still require Blueprint |
| Main route **at least 15 feet unobstructed** | **FAIL** | The central road band and several edges appear narrower than the required physical corridor |
| Side-route paths **at least 10 feet unobstructed** | **FAIL** | Multiple narrow bends around northern mushrooms and southern rock/trunk footprints |
| Exact geometry & light placement | NOT CERTIFIED | Structural raster alone cannot define final movement/LOS geometry; identify accepted torch/glow anchors only after structural PASS |

## Scale computation for inspection (derived from working PREPARE, not a pixel-based inference of physical size)

Working logical plan: `36×24` spaces of `5 ft` each = `180×120 ft`. Structural raster `1536×1024` is 3:2. Uniform preview density would be **42.6667 source pixels per logical cell**.

- Three-cell main road (15 feet) needs **128 source pixels** of unobstructed width.
- Two-cell branch trail (10 feet) needs **85.33 source pixels** of unobstructed width.
- Selected visible bands around the middle of the main road appear approximately 80–110 pixels wide, and several trail bends roughly 60–80 pixels. These are *visual approximations*, not calibrated segmentation or measured Foundry geometry. Exact clearances are not yet certified.

## Why REDO rather than PASS

The milestone placement issue from the two earlier drafts is satisfactorily resolved in this particular raster. However the core gameplay requirement is a stable, passable primary road with clearance for the intended creature footprints. The road and loop widths appear insufficient in several sections. Accepting and scaling a 1536px raster to the `4320×2880` 120px grid would **not** change the underlying logical-width ratios or create usable traversal space.

## Mandatory recovery under the permanent image prompt rule

1. Archive this attempt, its hash/identity and verdict as historical evidence; **do not use its prompt, seed, reference image or composition as an input for the next generation**.
2. Abandon the previous prompt entirely. Create an **independent structural grayscale prompt from the accepted M02 PREPARE specifications** and a new composition plan. Do not write a corrected/patched/negated version of this image prompt, and do not ask the image model to preserve a previous attempt.
3. Preserve *requirements*: 90° overhead monochrome, wide west–east traffic artery, accessible branch/rejoin paths, shoulder-side milestone, separate northern foraging and southern habitat areas, grounded mushrooms and rock boundary, no unapproved chasms.
4. Next generation remains **STRUCTURAL_RENDER attempt 004**; repeat STRUCTURAL_INSPECT and check corridor physical clearances against the accepted logical footprint. Do not proceed to painterly coloring or Scene Injector BUILD while inspection is REDO.

**Foundry/Regionwright live writes:** none.  
**Stage:** `INSPECTED_REDO` (structural substage).
