# M02 — Tallcap Forest | Attempt #5 tolerance re-inspection (2026-10-09)

**Inspection operation:** `M02.structural-attempt-005.reinspect.geometry-tolerance-v0.1`  
**New internal verdict:** `NEEDS_RECONCILIATION`; **previous blanket width-based REDO no longer justified**.  
**Outer workflow:** HOLD in structural/Feature Manifest reconciliation; **no paint lock**, **no BUILD**, **no new grayscale required at this point**.  
**Source image (unaltered):** `grayscale_mushroom_cavern_map.png`; **1536 × 1024 RGB PNG**, **3,984,274 bytes**, SHA-256 **`878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`**. Generation `03d4569f-9f95-4a87-907f-651726cbed75`, original no-edit independent prompt attempt #5. Original `M02-STRUCTURAL-INSPECT-REDO-ATTEMPT-005-2026-10-09.md` retained byte-for-byte unchanged in this branch.  
**Policy:** Accepted `dicebox-geometry-tolerance/v0.1` (GitHub main PR #9, 2026-10-09); M02 `M02-PREPARE-GEOMETRY-TOLERANCE-ADDENDUM-2026-10-09.md`.  
**Evidence category:** read-only visual reinspection of the exact PNG and earlier calibration crops; not a certified complete raster contour trace or a Foundry movement canary.

## Re-evaluation table

| Requirement | New assessment | Observations / evidence limit |
|---|---|---|
| Strict 90° overhead grayscale, no baked grid, no tokens | VISUAL PASS | Image fully top-down with identifiable graybox floor/rock/mushroom features |
| East-west road continuity and entry/exit openings | VISUAL PASS | Continuous central ground band traverses left and right edges |
| Northern exploration loop with branch/rejoin | VISUAL PASS, PATH WIDTH UNVERIFIED | Clearly visible winding upper return circuit and open ground; ground-edge bounds at critical turns not yet traced |
| Southern exploration loop with branch/rejoin | VISUAL PASS, PATH WIDTH UNVERIFIED | Clearly visible lower return circuit, broad clear middle section, narrow rock/mushroom bends need floor-vs-solid trace |
| Milestone off road | VISUAL PASS | Standing stone on upper shoulder; no obvious direct lane obstruction |
| Northern foraging and southern habitat location | VISUAL PASS for placement | Both visual pockets appear accessible in principle, but Region polygons and module mechanics not tested |
| Grounded stalk/rock versus overhead cap classification | RECONCILE | Stalks/rock are identifiable; cap shadows/frills cannot be full collision Walls, and solid footprint boundaries need manual tracing |
| Main-road **15ft** target | **PREFERENCE VARIANCE, NOT HARD FAILURE** | Former ~80–110 source-pixel bright-road estimates correspond ~9.38–12.89ft (under new 10–20ft preferred band only at some samples); target 15ft is no longer a mandatory minimum |
| Main-road **5ft** Medium passage | VISUALLY PLAUSIBLE, NOT CERTIFIED | Sample road bands exceed 42.67 source px, but no end-to-end swept footprint or meaningful uncertainty-certified minimum yet |
| Northern/southern trail **5ft** Medium passage | **NEEDS_RECONCILIATION** | Previous evidence only said trails did not reliably maintain 10ft; no grounded path-width sweep proving >=5ft along all bends |
| Intentional main-road constriction documentation | **PENDING** | Apparent sub-10ft width stations require a reviewed bottleneck entry or evidence that the complete walkable ground is actually wider than the bright road marking |
| Blueprint and Foundry collision/Region functionality | NOT CERTIFIED | Current 161-wall v002 Blueprint was tied to a **different attempt #4 image**. Its wall coordinates and historical proxy QA cannot be reused or counted as #5 movement evidence |

## Dimensional interpretation (not a precise raster segmentation)

M02's PREPARE design is 36×24 five-foot cells (180×120ft), and this source is 1536×1024: **42.6667 source pixels per 5ft**. Therefore 5ft token footprint corresponds to **42.67 source px**, main 10ft appearance preference begins near **85.33px**, and target 15ft near **128px**. Earlier visual samples estimated 80–110px bright roadway, or **9.375–12.891ft**. These *sampled painted travel-band widths* are neither proof of a minimum along the entire road nor a reliable complete-footprint measurement. Rock-free *walkable floor* may extend beyond the brightest band.

Previously, the visual inspection marked this entire otherwise coherent image REDO solely because some bright road spans missed 15ft and the loops did not demonstrate the old mandatory 10ft. The accepted tolerance standard invalidates that specific automatic-rejection rationale. It does **not** automatically prove the new, separate minimum: uninterrupted 5ft Medium movement on actual navigable ground.

## Result and actions

**Outcome: `NEEDS_RECONCILIATION` (internal hold).** Do **not** order a sixth grayscale render merely because the target-width preference varies. Keep the *original* attempt #5 structural REDO report unchanged as history, and preserve this separate reinspection. The image is reusable for **candidate** semantic geometry analysis; it is **not yet approved for painterly painting or installed Foundry execution**.

Next bounded work unit:
1. Start a new attempt-005 **Feature Manifest/Spatial Blueprint** aligned to SHA-256 `878b...`; do not reuse attempt #4's 161-wall trace or Region coordinates without retracing.
2. Identify true grounded solid trunk/rock boundaries, cavern edge, and walkable floor; no canopy/rim full walls.
3. Map the west–east road and two side-return routes; measure critical bend widths with stated uncertainty, and test a 5ft Medium swept disk along each centerline in the actual approved ground areas.
4. Document any intentional ~5–<10ft main-route chokepoint (position, length, reason); if not intentional, determine whether free forest-floor width actually exceeds painted road width before classifying failure.
5. Place M02 arrival/exit/forage/hunting anchors on real accessible ground, then rerun canonical spatial schema and geometry tolerance checks.
6. If those checks PASS, mark structural acceptance `PASS_WITH_DOCUMENTED_VARIANCE` in a **new** receipt and proceed to PAINTERLY RENDER. If authentic ground reveals a truly impassable Medium route that cannot be resolved, only then use GRAYSCALE REDO with a wholly independent prompt (per locked clean-restart rule).

**Foundry writes:** **0**. **New image generations:** **0**. **Original 2026-10-09 REDO receipt modified:** **NO**.
