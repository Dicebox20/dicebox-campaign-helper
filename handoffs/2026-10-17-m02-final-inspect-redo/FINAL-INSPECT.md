# DiceBox Campaign Helper — M02 Kurth Tower Reception — FINAL INSPECT

**Verdict: REDO.** **Date:** 2026-10-17. **Authority:** user-approved calibrated v7 Spatial Blueprint, SHA256 `f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add`.

**Important correction to prior assistant:** The earlier grayscale `STRUCTURAL_INSPECT: PASS` was premature. It checked general visual composition, not registered wall/door locations against v7. The colorized render is an exact-resolution *color transformation* of that grayscale, but inheriting a structural mismatch does **not** make it a final approved map. No final-art approval, STRUCTURAL BUILD stage advance, or Foundry installation is granted.

## Exact assets and source chronology

| Asset | SHA256 | Scope |
|---|---|---|
| Approved v7 Spatial Blueprint canonical sorted JSON | `f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add` | **geometry authority** |
| Approved M01 painterly source | `02cdd354371721961ce277f00b8bfe2a322d2678000f7c44d8596800194cab61` | Continuity artwork; not a pixel-derived Wall source |
| Grayscale source rendered for M02 | `418df8bb3431db1984d0d9def8655ad882074f8d6fdbcce373ef20ab67d921be` | Structural render that was incorrectly accepted earlier |
| Colorized M02 candidate in Library | `82096aaa2f5783a5b0b8ec21d2b5acef5acc1a8fb51b005fcc4621319fafbff7` | **rejected final candidate** |

The candidate bytes were independently materialized from the ChatGPT Library and verified **identical** to the local inspected candidate. Both M02 raster images are exactly **1619×971**. The colorization script never resampled or spatially translated the image; correlation between grayscale and colored luminance is **0.996823**, and **97.3154%** of the grayscale Canny edge pixels remain detected under identical thresholds. Minor changed edge detectability comes from tint/lighting; there is no geometric displacement induced by the color pass.

## Fatal failures against v7 typed geometry

1. **M01 heritage: original bridge registration is not honored.** The v7 expected inherited M01 gate plane is at map x≈394 px, but the new grayscale depicts a gate visually much farther to the right. The existing bridge-end is **recreated**, not a pixel-registered continuation of the approved M01 artwork. This is an art-provenance/topology mismatch; no Foundry runtime wall is inferred from the screenshot.
2. **Only tower exterior entrance D01 is displaced.** The approved tower west face is at map x≈1190 px (logical x=29.39215) with D01 at x≈1190, y≈809–931 px (logical y=20–23). The image places a visible arched entrance considerably farther **left and above** this interval. A blueprint overlay puts D01 in the wrong part of the painted architecture, and the approved west wall lies in visible reception floor.
3. **Three interior checkpoint openings are not where required.** The accepted security partition is at x≈1460 px (logical x=36.07463), with gaps D02 y≈174–275, D03 y≈486–607, and D04 y≈809–910 px. The image instead presents an open reception floor and furniture through the planned blocking wall planes. A Foundry injection using approved Walls would create invisible barriers across visually open floor.
4. **Three-route circulation is therefore not visually verified.** Prior local route-swept tests certify the **typed geometry**, not the new art. Reusing those results to claim painted doors align would be a category error.

**Illustration:** `BLUEPRINT-OVERLAY-REJECTED-CANDIDATE.png` overlays approved coordinates onto the *unmodified source candidate pixels*. **Magenta** = original image art join; **yellow** = inherited M01 gate; **red** = authored exterior/security walls; **cyan** = approved door planes. This is for discrepancy inspection only; it is NOT a revised painted map and is not geometry authority.

## What remains valid

- Grayscale → color preserved all pixel positions, room shapes, stairs, dock, furniture, and scenery **relative to that grayscale**.
- Strict orthographic composition, zero visible text/grid/token/NPC content.
- The v7 geometry/route mathematics, scale (40×24, 4800×2880 target), provenance and M01 elevations remain the accepted *geometry authority*; no redesign of those documents is authorized by a rejected render.
- User-defined exterior path around cliff, single low west entrance, three interior methods and security segmentation remain requirements.
- **No Foundry modifications or runtime certification** were attempted.

## Stage and corrective action

**FINAL_INSPECT = REDO.** The earlier structural PASS should be treated as superseded for this grayscale/image pair. Return to **STRUCTURAL_RENDER → STRUCTURAL_INSPECT** with a fresh prompt assembled from the accepted v7 blueprint and source references, not from the rejected generated prompt or final image. Use exact-image compositing of the approved M01 portion where continuity requires original pixels; the new portion should be checked *before color* by overlaying the v7 exterior wall and door planes at their specified coordinates. Avoid generating arbitrary new architectural openings and avoid adjusting approved typed geometry to justify drifted artwork.

**No install, STAGE, INJECT, or Ready-to-Play claim.** Real Foundry geometry and stair/elevation behavior remain unverified until later authorized runtime testing.

**Evidence files:** `FINAL-INSPECT-RECEIPT.json`, `BLUEPRINT-OVERLAY-REJECTED-CANDIDATE.png`, and reproducible `audit_final_inspect.py`.