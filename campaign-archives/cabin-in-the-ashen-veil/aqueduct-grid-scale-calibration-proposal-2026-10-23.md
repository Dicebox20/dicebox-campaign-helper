# Aqueduct — scene-specific grid-scale calibration (proposal)

**Date:** 2026-10-23
**User observation:** “This map is supposed to be a lot larger, maybe just change the grid size.”
**Status:** **CALIBRATION PROPOSAL / RENDER NOT APPROVED / FOUNDRY NOT CHANGED**. This is a scene-specific exception to the default Dicebox `battlemap-120 = 120px/5ft` art-planning convention if accepted by the owner. Does **not** revise all map scales.

## Current art identity
- Original single image: `underground_waterworks_cistern_complex.png` (generated image id `4529faa6-73c6-41e4-946a-e6c4236ef53c`).
- Exact source dimensions verified in active file workspace: **1536×1024 px**.
- Exact SHA-256: `acb7f5ce44d38b4943b10f61f15a3375a89d658dc90cd79faa69ad3aae2e1aed`.
- This image is a candidate **not yet declared owner-approved**. No new raster, no redraw, no upscaling and no image transformations during calibration.

## Candidate Foundry Scene settings

| Value | Standard | Proposed Aqueduct |
|---|---:|---:|
| Background pixels W×H | 1536×1024 | 1536×1024 |
| Grid type | gridless per Dicebox convention | **gridless** |
| `grid.size` | 120 px | **60 px** |
| `grid.distance` | 5 | **5** |
| `grid.units` | ft | **ft** |
| Approx. scaled full scene | 64×42.67 ft | **128×85.33 ft** |

**How it works:** shrinking a logical five-foot cell from 120px to 60px makes a given 1536px width measure twice as many in-game feet; Medium actor tokens that occupy 5ft become 60px wide rather than 120px, leaving the original background pixels unchanged. Camera zoom/image file dimensions are independent of rules measurement, and this choice is reversible **before** any Wall/Region/Tile placement.

**Checks before owner acceptance or runtime installation:**
1. Visually verify tokens fit every traversable walkway, gate and stair at 60px/5ft.
2. Walkability and room distances must make sense; scaling changes *measurements*, not physical painted geometry.
3. Reconfirm that the west Well route, southwest Waterworks chamber, Pond gate, north branch and other Aqueduct endpoints match the **owner-approved 1312×1199 BWE-031 source**; the picture above has not undergone a complete route/quest inspection.
4. The two logical Aqueduct cards `AQ-01` and `AQ-02` are still separate feature zones in master PREPARE. Treat the large image as a candidate composite until the owner explicitly adopts any scene consolidation. Avoid silently creating a bypass to AqueductOpened/Bathhouse access.
5. Recheck runtime state and safety: charging station, first Crooked Man chase, pressure controls, obstruction, and key access are separate Foundry assets; changing grid size doesn't implement them.
6. If the owner wants genuinely **more explorable artwork** (longer corridors, larger rooms or side chambers) rather than larger *in-game measured distances*, a new image composition is still necessary.

**Foundry UI:** scene configuration → Grid → Grid Type `Gridless`; Size (pixels) `60`; Scale `5 ft`; keep background pixel dimensions unchanged. Use this *before* injecting Walls/Regions. Official [Scenes guide](https://foundryvtt.com/article/scenes/) confirms grid controls change distances/token space and warns that adjusting after placeable setup can move alignment.

## Design conclusion
First test the 60px/5ft Aqueduct grid only; the owner can approve this stage-specific scale once token-to-door proportion and narrative length feel credible. No image generation or Foundry world editing was undertaken.
