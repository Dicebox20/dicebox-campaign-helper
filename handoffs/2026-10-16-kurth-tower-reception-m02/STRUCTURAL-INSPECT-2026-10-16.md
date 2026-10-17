# M02 — Kurth Tower Reception — Structural Grayscale Inspection

**Date:** 2026-10-16. **Verdict:** **NEEDS_RECONCILIATION** (not approved for painterly art or BUILD).  
**Source:** user-approved refined M02 typed blueprint (local canonical JSON SHA256 `fa747cb3c8e71eb79492eebaf33cba099fcc9dfaf9adf535014595e2333726a6`), preview `M02-geometry-preview.png` and rendered 1619×971 grayscale PNG SHA256 `38a4e1ef6e9e5e2b233c7059492b76a3707a595149bb3f11f61fa24663bc2e3c`. Source render/image exists in ChatGPT conversation assets, not copied into repository by this text receipt.

## Passed visual checks

- Overhead embossed grayscale, faceted tower perimeter, grand hall and reception counter, northern permit registry, central guarded checkpoint and eastern stair/lift are discernible.
- The candidate does not visibly bake NPCs, tokens or labels. Render source is 1619×971; the final battlemap still requires the accepted 40×24 logical / 4800×2880 Foundry scale (120px/5ft).

## Blocking / review findings

**B1 — D06 and D09 south staff bypass unclear / apparently blocked:** Both the delivery→staff threshold and staff→secured-side crossing appear as continuous wall/pilaster segments in the southern grayscale. Unlike the approved typed model, the physical south bypass cannot be visually traced end-to-end to the M03-secured-side vestibule. This fails structural proof despite previous *mathematical* route canaries. Native Walls must not be inferred from these unreviewed pixels.

**B2 — Pre-existing source Blueprint prop overlap (P01/P08):** The authored counter bounding box `[18.5,8.4,26.5,10.2]` intersects the northeast column `[23.5,9.2,24.5,10.2]` across a `1×1` logical-cell area = **5×5 ft**. The render embeds a circular column-like element within the counter. The previous offline geometry Inspector did not test prop-to-prop overlap; a LOCAL_PASS is therefore insufficient for structural approval. Reconcile the *typed* source before requesting another grayscale render.

**Review note:** Some additional left-hall partitions/alcove enclosure differ from the explicitly authored barrier trace. Audit all ten intended door/opening planes and preserve intended independent staff, public and inspector routes. The regular square masonry tile seams resemble a visible grid; treat as decorative masonry, not a Foundry grid, and keep the final art gridless.

## Recovery gate

Return to **GEOMETRY RECONCILIATION**: correct P01/P08 overlap, explicitly preserve and test D06/D09 openings, independently rerun route sweeps and 10-door trace checks, review 4 distinct column footprints, then request a **new, independently authored** grayscale generation prompt **from accepted requirements only**. Per clean-restart rule, this rejected candidate image or its prompt must not be reused as generation input.

No painted render, Foundry injection, runtime mutation or Ready-to-Play certification is authorized by this receipt. No active product stage promotion is claimed. The user-requested one-handed progression control can initiate this geometry reconciliation on the next conversation turn.
