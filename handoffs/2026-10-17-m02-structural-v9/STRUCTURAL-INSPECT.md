# Kurth Tower M02 — Structural Render V9 Inspection

**Date:** 2026-10-17. **Stage:** EMBOSSED STRUCTURAL GRAYSCALE RENDER → STRICT STRUCTURAL INSPECT.  
**Verdict:** `PASS_LOCAL_TYPED_GEOMETRY`; **44 independent checks passed, 0 failed.**  
**Next gate:** User visual review, then FEATURE MANIFEST reconciliation and offline structural BUILD. **Not painterly render yet; no Foundry writes.**

## Accepted inputs and authority

- **Exact user-approved v7 typed blueprint:** SHA256 `f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add` (canonical sorted JSON). The original v7 file remains unchanged.
- **Accepted M01 painterly art:** SHA256 `02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61`, native 1619×971 pixels. V9 converts its registered right-hand crop to grayscale and copies it into the new scene via exactly the calibrated native-ratio affine mapping. This is source-image preservation, **not image-based authoritative Foundry wall detection**.
- Rejected v8 structural artwork and prior incompatible painterly candidate were not used in this rebuild.

## Image and geometry results

- **Full-resolution output:** `M02-v9-structural-grayscale.png`, 4800×2880, 8-bit grayscale, SHA256 `38f420ba72abed36a604a4292ae6b4a9f8b0323c0bde1f1cc727c62892309490`.
- No perspective tilt, painted map grid, NPC, labels, or tokens. Native structural floor textures, roof slate, fixed props and masonry are visible from overhead. (Stone tile joints are texture, not a Foundry grid.)
- **Art seam:** 19.85911 logical cells / pixel x=2383. Inherited M01 source-pixel identity: max error **0** after independent reconstruction of the subpixel transformation; no horizontal stretch.
- **Exterior façade:** logical x=29.39215 / pixel x=3527. One exterior D01 opening, y=20–23 logical (15 feet); no other exterior door.
- **Interior security partition:** logical x=36.07463 / pixel x=4329; exactly three typed door openings D02 4.3–6.8, D03 12–15 and D04 20–22.5. No solid-wall mask is drawn through those spans.
- **Three M01-to-interior route swept-token checks:** public 10ft Large, inspector 5ft Medium, staff 5ft Medium all pass against authored floor/wall/prop/hazard geometry. No new stair geometry invented.
- Upper terrace (+31ft), courtyard/tower ground (+18ft) and lower dock (−8ft) remain aligned to the M01 authored elevation intent, not invented visual height estimates.
- Native masks `M02-v9-structural-wall-mask.png` and `M02-v9-structural-door-mask.png` demonstrate that all six new solid Wall lines and four Door planes occupy precisely the v7 coordinates. The masks are *inspection evidence*, not extra delivered Foundry objects.

## Reproducibility

`render_structural_v9.py` in the v7 geometry source folder builds the exact native background using deterministic textures sampled from the accepted M01 reference for visual continuity. `inspect_structural_v9.py` independently reopens and tests the image and output masks. It also independently reconstructs the full inherited M01 source crop to confirm exact registered luminance pixel identity.

All inputs are read only. Script output includes `RENDER-MANIFEST.json`, `STRUCTURAL-INSPECTION-RECEIPT.json`, full structural PNG, mask PNGs and a lightweight preview. `M02-v9-INSPECT-OVERLAY.png` is optional visual inspection only and must **never** be injected as the background.

## Explicit limitations

- Accepted typed v7 logical geometry, registered v7 M01 macro-intent Walls, and the original M01 approved image form the source of this result. Exact currently-installed M01 Walls, portcullis and loaded asset were **not** reread from `world-template-2`.
- Upper and lower stair treads, Levels integration, token arrival coordinates and runtime wall collision remain unverified; M01 +31 → +18 and −8 → +18 elevations are authored-source intent only.
- This is a more restrained reproducible structural construction render; painterly texture and user creative acceptance are separate gates. Do not claim Ready-to-Play.
- No Desktop Commander, Foundry runtime, or external write was used to create or inspect V9. The developer turn preserves accepted canonical sequence: after STRUCTURAL_INSPECT → FEATURE_MANIFEST → STRUCTURAL_BUILD → PAINTERLY_RENDER → FINAL_INSPECT → final injection STAGE/INJECT/VERIFY/RECEIPT.
