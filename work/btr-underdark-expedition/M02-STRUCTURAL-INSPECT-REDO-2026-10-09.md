# M02 — Tallcap Forest · Grayscale Structural Inspection

**Status:** `STRUCTURAL_INSPECT: REDO` — **NOT APPROVED FOR PAINTERLY RENDER OR BUILD**  
**Inspection date:** 2026-10-09 (project-local chronology)  
**Attempt:** structural grayscale render 001  
**Image generation identity:** `5dd4ea6b-878a-4382-83ab-a6fb98553397`  
**Image captured filename:** `grayscale_mushroom_cavern_battlemap.png` (user-visible ChatGPT render, not yet a GitHub art asset)  
**Source raster:** 1536×1024 PNG · 3:2 · 3,549,868 bytes  
**SHA-256:** `a741782c94a2cf2af34979b73243fdee8b02f73474db1be0bacc0e85dab62a9b`  
**Reference spec:** `M02-TALLCAP-FOREST-PREPARE-draft-2026-10-09.md`, draft subsequently advanced to grayscale by user.  
**Authority:** PREPARE topological constraints and explicit passage clearance, not unverified visual pixels.

## Pass observations

- Grayscale orthographic-style overhead presentation; no visible game grid or text labels.
- M02 is clearly an Underdark giant mushroom forest with recognizable tall caps, stalks, rubble and rock cliffs.
- West–east paved main road enters/exits image edges coherently.
- Secondary north and south trails connect to the central road at both ends in general topology.
- Northern luminous fungal cluster/clearing and southern giant-mushroom habitat can be visually localized.
- Torch fixtures are identifiable for *future* Foundry light anchor extraction; painted emission does not equal an installed dynamic light.
- Raised stalk footprints and most rocky barriers appear distinct enough for a future semantic classification, once reapproved.

## Fail / review observations

1. **Main route clearance — FAIL.** At a proposed 36×24 cells mapped onto this 1536×1024 structural source, each logical 5-foot cell spans 42.67 source pixels. PREPARE's minimum 15-foot main road requires approximately 128 unobstructed source pixels. Several road segments visually have substantially less clear width. These are inspection estimates, **not** approved measured wall endpoints.
2. **Milestone placement — FAIL.** The proposed `M02-MILESTONE-01` near the center of the roadway appears as a blocking stone monolith on the traffic line. PREPARE requires the marker *beside* the road, not a central obstruction. Both pass-around channels are much narrower than the intended three-cell roadway. Move milestone to a road shoulder **in a brand-new grayscale composition** rather than image-editing this failed attempt.
3. **Side-route clearance — FAIL.** Secondary loops are legible and connected but have constricted sections among cap bases/rock outcrops. PREPARE requires at least 10-foot usable widths (two logical cells / approx. 85.33 source pixels at this source density), especially where Large creatures should maneuver. Verify with actual Blueprint geometry after REDO.
4. **New interior chasm/causeway topology — REVIEW/FAIL pending accepted PREPARE amendment.** Deep black voids and steep cliff edges appear repeatedly between the road and elevated forest trails. This creates potential fall hazards, restricted shortcuts, and route hierarchy not explicitly authored in PREPARE, which specifies navigable mushroom forest with rock obstruction primarily at cavern boundaries. Reject them for the next grayscale unless the user explicitly revises PREPARE to authorize this raised-causeway encounter.
5. **Obstacle semantics — REVIEW.** Large overhead mushroom caps extend across some ground paths, while fallen trunks/rock masses complicate wall intent. After a structurally accepted redraw, distinguish trunk-base movement+vision blockers from elevated caps (visual canopy only), smaller decorative frills, and true high rock cliffs in the Feature Manifest.

## Determination

**`REDO`**, rather than `PASS`, because movement clearances and milestone placement conflict with PREPARE and the proposed cliff topology changes gameplay without approval. A good-looking grayscale image is not sufficient for structural acceptance.

### Correct workflow recovery

- **Discard the failed structural render prompt.** Do not instruct generation to edit, repair, preserve, or reuse this image's composition.
- Produce an **independent new grayscale structural prompt** strictly from the accepted M02 PREPARE: continuous 15-foot west–east main road; at least 10-foot northern and southern return loops; milestone beside road; giant mushroom bases outside all required clearances; recognized northern forage and southern manual hunt areas; enclosed but navigable cavern-floor paths; no unapproved interior chasms.
- Keep a strict 90° overhead camera, no labels/grids/tokens, clear graybox semantics, and a physically legible level floor.
- Run STRUCTURAL_INSPECT on the new image. Only `PASS` authorizes Feature Manifest / Spatial Blueprint reconciliation and then PAINT_RENDER.
- Do not stage artwork or Foundry macro while the structural stage is REDO.

### Notes on source resolution

M02 PREPARE proposes 36×24 logical cells and a final `battlemap-120` Scene size of 4320×2880. A 1536×1024 **grayscale inspection render** can be reviewed for structural topology, but simply upscaling it does not create missing original detail. Final approved paint and injection must separately certify effective source resolution, uniform geometry transform, token clearances and installed scene dimensions.

**Live Foundry writes associated with this inspection:** 0.
