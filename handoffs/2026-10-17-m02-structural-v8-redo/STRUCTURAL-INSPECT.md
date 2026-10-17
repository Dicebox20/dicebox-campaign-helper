# M02 structural render — inspection receipt

**Date:** 2026-10-17  
**Verdict:** **REDO REQUIRED** — artwork attractive but geometry not aligned.  
**Approved geometry:** calibrated v7 `f3bdcfb3c8ed73648e1a7f98c59e09e94c19a5b76ad208f88b35716f382b3add`.  
**Grayscale candidate SHA256:** `a86c545d5ae9abb2ebd07f7e5af01c7e4f535321a7af7b08c80bfe0a39668a53`, size **1619 × 971**.  

## Interpretation of user feedback

User said the image “looks pretty good.” This is positive visual feedback, **not** explicit approval to replace the accepted blueprint. As required, structural inspection tests precise registered geometry, not only artistic appearance.

## Visual passes

Strict overhead grayscale, bridge and hoist, upper terrace and stairs, lower dock and switchback, reception rooms, no grid, labels, NPCs or tokens. These are qualitative structural observations, not Foundry functionality tests.

## Blocking differences

| Required feature | Approved v7 in 40×24 logical scene | Canvas projection, 1619×971 | Observed candidate | Result |
|---|---|---|---|---|
| Tower west facade | x = 29.39215 | **x = 1190 px** | Near x = 830–845 px on main section | FAIL |
| Only exterior entrance D01 | x = 29.39215; y = 20–23 | **x = 1190; y = 809–931** | No corresponding facade/door at expected location | FAIL |
| Secure partition | x = 36.07463 | **x = 1460 px** | Main interior line closer to x = 1250–1270 px | FAIL |
| M01 art registration | seam x = 19.85911 | seam ≈ 804 px | Art redraw, not demonstrated exact pixel registration | UNVERIFIED |

Overlay: `V8-blueprint-overlay.png`, with **red expected solid Walls**, **cyan Doors** and **gold art-source boundary**. Pixel positions are projected for review, not used to author runtime walls. Approximate observed feature positions reflect visual inspection, not an OCR/pixel-tracing replacement for accepted geometry.

The three route clearance tests passed on the v7 **typed blueprint**. They cannot be claimed to pass on the current grayscale architecture because its facade and security partitions are in different places. Stair elevation numbers remain source-authored only (+31 ft terrace, +18 ft court, −8 ft dock), not runtime certified.

## Required recovery

Keep the v7 blueprint as authority; do **not** redraw its walls from this unreviewed image. Generate a fresh grayscale structural render based on the accepted geometry and original M01 registration, explicitly positioning the tower facade, lower door, and security wall before adding furnishings. Only if the user explicitly accepts this *different* image layout should GEOMETRY AUTHOR / INSPECT be reopened to propose new coordinates.

**No Foundry mutation**. No structural BUILD, painterly RENDER, STAGE or INJECT authorized by this candidate. Final-inspect is not reached.