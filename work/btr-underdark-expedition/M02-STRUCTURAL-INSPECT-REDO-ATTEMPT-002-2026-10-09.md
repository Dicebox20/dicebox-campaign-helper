# M02 — Tallcap Forest · Grayscale Structural Inspection, Attempt 002

**Status:** `STRUCTURAL_INSPECT: REDO` — **NOT APPROVED FOR PAINTERLY RENDER, BLUEPRINT LOCK OR BUILD**  
**Project-local date:** 2026-10-09  
**Attempt:** grayscale structural render 002 (fresh prompt after previous structural REDO)  
**Generation ID:** `821bc5d8-f9ff-4a7f-912a-3bc733a8dc08`  
**Source image at inspection:** `a_top_down_grayscale_fantasy_map_battlemap_styl.png` (ChatGPT generation; not yet committed as a repo art asset)  
**Source image format/raster:** RGB PNG, **1536 × 1024 pixels**, 3:2, **3,637,558 bytes**  
**Source image SHA-256:** `0eea66cb1adfb206fccfd036b6858b4b865c728e8fcc297bfd352ddcdd2fdc1c`  
**Reference requirements:** `M02-TALLCAP-FOREST-PREPARE-draft-2026-10-09.md`, including proposal of 36 × 24 five-foot spaces, Gridless battlemap-120, main road >=15ft and side trails >=10ft.  
**Prior evidence:** `M02-STRUCTURAL-INSPECT-REDO-2026-10-09.md` (attempt 001).  
**Source category:** human visual structural review of grayscale render, **not measured Foundry geometry**.

## Inspection comparison

| PREPARE requirement | Determination | Observation |
|---|---|---|
| Strict overhead grayscale, no labels/grid/tokens | PASS | Clear mostly orthographic overhead structural presentation and grayscale stone/fungi |
| West/east main-route continuity | PASS | Road enters/exits at correct edges without dead end |
| Northern loop | PASS | Distinct upper arc diverges and rejoins main roadway |
| Southern loop | PASS | Distinct lower arc diverges and rejoins main roadway |
| Northern forage opening + southern habitat | PASS for location only | Northern fungus clearing and southern mushroom habitat are visible; no Region mechanic certified |
| Cavern-floor topology | PASS | Prior excessive interior chasms substantially reduced; trail/rubble/trunk hierarchy more plausible |
| Rock boundary and large mushroom classification | CONDITIONAL | Grounded trunks often identifiable, but caps/fallen trunks/stone edgings still require semantic separation in an accepted Feature Manifest |
| Western/eastern access | PASS | Openings align with the paved route at both image edges |
| Milestone is beside the main road | **FAIL** | Standing stone/cairn remains near the road center rather than on a clear shoulder; a blocker in intended movement envelope |
| Main >=15ft and side trails >=10ft | **FAIL** | Several clear trail widths appear below spec near center stone, rock-edged bends and thick mushroom trunks |
| Torch-light anchors | REVIEW | Existing road/tunnel features are visible, but approximately three distinct roadway torch fixtures cannot confidently be counted at their proposed anchors |

## Geometry scaling and evidence limits

PREPARE's proposed physical map is 36 × 24 five-foot logical cells (180 × 120 ft). At 1536 × 1024 structural raster this implies exactly **42.6667 source pixels per five-foot cell** if the canvas is mapped uniformly and without cropping.

Thus a 15ft clear main road corresponds to **128 source pixels**; a 10ft clear side trail corresponds to **85.33 source pixels**. At several bends and the central milestone, visually clear ground appears narrower than those widths. The image is not an approved collision blueprint; we cannot certify exact clearance from pixels alone. Nevertheless, the conflicts are visibly substantial enough to fail STRUCTURAL_INSPECT rather than defer them to injection.

## Improvement over attempt 001

- No longer dominated by large interior black chasms or elevated causeway topology.
- Mushrooms, roadway, loops and cave boundaries are more coherent.
- Still repeats the **central-road milestone** issue from attempt 001 and the underwidth passages. Do not approve simply because other defects improved.

## Outcome and deterministic recovery

**`REDO`**, with hard stops on painterly colorization, Feature Manifest lock and Foundry BUILD.

A new render must be generated from an **independent grayscale structural prompt**, authored from accepted PREPARE—not by editing, referencing, preserving or patching this failed attempt. A fresh render must satisfy:

1. A stone marker **off the 15-foot minimum clear main-road corridor**, positioned visibly on one shoulder.
2. Continuous unobstructed main travel lanes >= 15ft across the full west-to-east route.
3. Both northern and southern branch/rejoin loops with >=10ft clear passages around trunk bases, rubble and rocky bends.
4. Level, traversable forest floor with no invented chasm/causeway network; giant mushroom trunks remain distinguishable from elevated decorative canopies and logs.
5. Distinct northern fungus gathering clearing and southern manual-GM-hunting habitat, both accessible without crossing solid obstacle footprints.
6. Rock-boundary openings and light-fixture candidates recognizable for later Feature Manifest/Blueprint reconciliation.
7. Strict 90-degree overhead orthographic grayscale and no baked tactical grid, labels, UI or tokens.

For the next INSPECT, repeat the width calculations and use the M02 physical footprint rather than infer scale from the raster. A successful structural review authorizes Feature Manifest + Spatial Blueprint reconciliation, **not** painting until those structure semantics have been reconciled.

**Live Foundry scene/Level/wall/Region writes during this inspection:** **NONE**.  
**GitHub record status:** review-branch inspection result, not a new active project-wide rule.
