# Unified Bathhouse — Attempt 6 REDO inspection

**Date:** 2026-10-23  
**Owner request:** REDO. Single surface Bathhouse map exception remains active.  
**Pre-render evidence freshly reread:** current machine 53-card PREPARE / BATH-01..08, accepted BWE-032A floorplan image in local project workspace, prior [Attempt 5 rejection](./bathhouse-unified-render-inspection-attempt5-2026-10-23.md), [mandatory PREPARE recheck](./mandatory-pre-render-prepare-recheck-rule-2026-10-22.md).  
**One new image:** generation `a6f6934e-ae10-435d-bc91-3eb269855d69`, output `top_down_detailed_isometric_battlemat_style_archi.png`, **1536×1024**, SHA-256 `5b7ed2f37976df751322d1c5260016d7b40fdc45f4b5c9cbb019e05a1bb21891`, hash/size independently verified from original file bytes in ChatGPT artifact workspace. GitHub contains this text receipt, not the image bytes.  
**Result:** `RENDERED_INSPECT_REDO`. Owner approval pending; do not archive as approved; no Foundry work.

## Inspection
- PASS: appropriate cardinal placement of NW Herbal, north Changing Room and main entrance, W Boiler, SW Mechanical, central filled Main pool, NE Warm Bath, SE Cold Bath.
- FAIL: Mechanical→Main hall extra door in addition to Boiler→Mechanical doorway; violates sole intended Mechanical access via Boiler.
- FAIL: northeast channel is filled water behind Warm Bath wall; a dry walkable human access to Aqueduct AQ-02 is still missing.
- FAIL: large southern staircase and public exterior road directly from Main Bath; source blueprint has only north estate public entrance and separate northeast Aqueduct service.
- FAIL: extra distinct east-side middle linen/utility room makes eight functional surface rooms where owner approved seven.
- FAIL: boiler aperture emits baked orange flame despite neutral dormant base art.
- PENDING ENGINEERING: late sluice/drained bath Screwdriver, three-ring mosaic, below-floor Rosewater Reliquary and safe independent Boiler dry egress are stateful and not validated by a single static surface image.

## Workflow conclusion
The image generator has repeatedly ignored cardinal door/architecture constraints despite source-image reference and geometry-first planning. **Do not use this REDO raster or any old generated bathhouse raster as a new prompt reference or patch.** Next refinement should fix permanent wall caps, door apertures and portals as *deterministic locked geometry*, and confine creative image treatment to floor texture/room props/foliage under the existing PREPARE–RENDER–INSPECT contract. A fresh freeform repaint has demonstrated structural unreliability six times. Preserve the owner's one-map surface decision.

**One render and one inspection only. No automatic new generation.**
