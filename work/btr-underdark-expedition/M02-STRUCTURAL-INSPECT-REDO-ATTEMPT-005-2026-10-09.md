# M02 — Tallcap Forest | Grayscale Structural Inspection #5

**Status:** `STRUCTURAL_INSPECT: REDO` — **NOT approved for Feature Manifest lock, painterly rendering, or Injector BUILD**.  
**Date:** 2026-10-09 (campaign project chronology); tool receipt recorded after generation.  
**Generation:** independent `gen_id=03d4569f-9f95-4a87-907f-651726cbed75`, `parent_gen_id=null`, `edit_op=null`.  
**Visible image:** `grayscale_mushroom_cavern_map.png`; RGB 1536 × 1024; **3,984,274 bytes**; SHA-256 **`878b465fde2c7e823e20bdd4f020e95abe0cd49740cb60e133f34c443a096bdf`**. This is a ChatGPT image attachment, not a committed image-asset file in the repository.  
**Authoritative requirements:** [M02 PREPARE draft](M02-TALLCAP-FOREST-PREPARE-draft-2026-10-09.md), particularly 36 × 24 logical 5-foot cells (180 × 120 feet), minimum 15-foot main route and 10-foot branching loops, roadside milestone, traversable flat forest floor, strict top-down grayscale; [permanent image clean-restart rule](../../docs/DICEBOX-IMAGE-PROMPT-CLEAN-RESTART-RULE-2026-10-09.md).  
**Prior inspection context:** Attempt 004 was visually accepted, but later v002 blueprint reconciliation found that collision-free southern detours left the visible trail; do not promote visually attractive geometry without traversability evidence. Attempt 005 is assessed on PREPARE, not as an edited or preserved earlier composition.

## Inspection table

| Requirement | Result | Evidence |
|---|---|---|
| Orthographic 90-degree grayscale, no tactical grid or tokens | PASS | No oblique horizon, text overlay, or map grid |
| Road spans west/east borders | PASS TOPOLOGY | Continuous large central band |
| Northern branch/rejoin | PASS TOPOLOGY | Upper traversal loop connects at road junctions |
| Southern branch/rejoin | PASS TOPOLOGY | Lower road-side trail rejoins the center-east roadway |
| Roadside milestone | PASS | Standing stone on north shoulder near x ≈638, y ≈402; not the center of lane |
| Recognizable tallcap trunk bases, caps, rocks, cave edges | PASS FOR CLASSIFICATION | Tallcaps, cliff rock and low fungal decoration visually distinguishable; individual collision footprints untraced |
| Northern fungi and southern habitat accessible in principle | PASS FOR PLACEMENT | Fungus clusters and southern grove/spire floor visible; exact Region mechanics not tested |
| No unapproved interior chasm/causeway network | PASS | Ground is predominantly level cavern floor |
| Minimum 15-foot main road clearance | **FAIL** | Multiple portions of the visible central travel band are narrower than the 128-source-pixel required full corridor width |
| Minimum 10-foot north and south loop width | **FAIL / NOT CERTIFIED** | Several wooded/stony bends pinch near grounded rocks and tallcap stems; visually available floor cannot support a reliable 85.33-source-pixel full clearance |
| Foundry wall/Region/lighting readiness | NOT ASSESSED | Structural image is not a gameplay Blueprint or installed Foundry Scene |

## Dimensional evidence

PREPARE's proposed 36 × 24 five-foot-space layout is 180 × 120 feet. At a 1536 × 1024 grayscale preview, a uniform image-to-logical projection gives `1536/36 = 1024/24 = 42.6667` source pixels per 5-foot space.

- Required main-road minimum: `3 cells × 42.6667 = 128` source pixels of clear width.
- Required side-trail minimum: `2 cells × 42.6667 = 85.3333` source pixels.
- Visual checking of the road at several stations across its center shows a roughly **80–110-pixel-wide** clear band, with its boundaries at times falling inside a 128-pixel vertical calibration bar centered at roadway y≈482.
- Some side-loop segments may be wide enough individually, but the critical tight arcs around stone and mushroom trunks are not verified to maintain 85.33px throughout. This is not a pixel segmentation/collision certificate; the failure can be established from obvious bottlenecks.
- A temporary visual measurement overlay was produced in the chat container: `M02_attempt5_road_clearance_calibration.png`; calibration markers indicate 128px, not wall geometry authority. Source image itself was **not edited or replaced**.

## Artifact semantics

Solid cavern boundaries and trunk/rock ground footprints remain candidates for full movement/LOS walls. Elevated mushroom caps and their shadows are **not** walls. Decorative fungus, road edge stones and skeletal remains are not automatically blocking collision geometry. The stone marker is an interaction anchor candidate, not an active discovery without approved content.

New visible skeletal debris in the southern grove is **not** independently approved lore/reward; should be classified or removed through accepted design stages, not promoted to active mechanic. No fishing/mining content is inferred.

## Decision

**`REDO`**. Do not paint this image, compile Foundry walls or route mechanics against it, or pretend that merely enlarging from 1536×1024 to the 4320×2880 target creates physical clearance. Reprojection scales both obstacles and roads equally.

Preserve the accepted M02 PREPARE requirements. Under the permanent clean-restart rule, abandon attempt 005's image prompt, seed and composition. A new grayscale render must be an independent creative formulation from accepted PREPARE and NOT a patch/variant of this or any earlier failed attempt.

**Next:** `GRAYSCALE REDO #6`, then `STRUCTURAL INSPECT`. Because multiple attempts have struggled to demonstrate corridor clearance, consider starting from a measurement-locked spatial plan/graybox footprint before fresh image generation, without borrowing the previous rejected image or prompt.

**Writes to live Foundry:** none. **GitHub status:** historical inspection evidence, not approved layout geometry.
