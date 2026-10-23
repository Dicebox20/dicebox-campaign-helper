# Mandatory PREPARE Recheck Before Every Map Render

**Date:** 2026-10-22  
**Authority:** Explicit campaign owner instruction: “okay, make it a rule to recheck the prepare before each render”.  
**Status:** ACTIVE, BINDING for Cabin in the Ashen Veil map production; no Foundry execution implied.

## Hard pre-render gate — applies to every image, including REDO

Before calling any map image generator, **freshly retrieve and review** the exact scene's current [all-scene PREPARE register](./all-scene-preparation-register-v2-2026-10-22.json), matching accepted blueprint/scene source, puzzle feature decisions, later owner overrides, scene-neighbor/route contracts, art requirements and the previous inspection verdict. Do not rely on chat recollection, prior prompts, or a different scene's card.

1. Resolve scene ID, owner-approved image provenance and latest superseding design record.
2. List explicitly each **required edge exit** (north, south, east, west), total number of **actual border-crossing exits**, any on-map turning/junction geometry, adjacent scene destination, and protected blocked edges. Confirm all against owner corrections rather than trusting older IDs or a prompt.
3. Identify mandatory visible props/puzzle anchors, required separate interactive state and objects **not belonging on this map**. For square Grove corner maps, the appropriate bust is mandatory; perimeter path maps and center Memorial Clearing have their distinct roles.
4. Confirm source geometry and whether it's an interior (strict 90°) or outdoor (limited elevated roof/tree art allowed), neutral diffuse base lighting, aging/horror and moderate detail.
5. Prepare a short **pre-render gate receipt** with scene, authoritative PREPARE reference, exit-count/border-direction checklist, must-see anchors, lighting/camera style and previous failure mode. If any detail conflicts or cannot be resolved, **do not render** until the source plan/route is reconciled.
6. Compose a **fresh independently authored inclusion-only prompt from that verified PREPARE**, never from a rejected prompt or rejected image. Prompt only things desired visibly in art; keep unwanted/forbidden concepts only in inspection notes, never even as exclusions in the image-generation prompt.
7. Render **one** map, perform immediate honest inspection against the pre-render receipt, and report PASS/REDO. Stop after the inspection, with **no automatic second image**. User may authorize successive different scene maps, but each still gets its own fresh PREPARE recheck.

**Good Enough still applies to cosmetics**, not to cardinal topology, number of exits, quest busts, canonical geometry, or missing critical fixtures.

## Current corrective example — SG-03 NE Corner

Required **west border exit → SG-02** and **south border exit → SG-06**, forming a single 90° turn; **exactly two** map-edge exits; visibly present **northeast puzzle bust**, one of four located at square Grove corners. The most recent attempted SG-03 image `ad82ada4-b108-4188-9ff0-1c9a13248f47` failed because it presented four road exits and no bust. **SG-03 is REDO; do not render again without fresh PREPARE verification.**

### Reporting states

- `PREPARE_RECHECK_PASS`: design checked, render permitted.
- `PREPARE_RECHECK_BLOCKED`: contradictory or incomplete source prevents generation; say exactly what needs correcting.
- `RENDERED_INSPECT_PASS` or `RENDERED_INSPECT_REDO`: purely visual assessment; owner approval remains distinct.
- `OWNER_VISUAL_APPROVED`: owner accepts the exact image; this does not imply Foundry-installed gameplay verification.

Keep the recheck result in the map's receipt or campaign log. This rule strengthens existing PREPARE → RENDER → INSPECT flow rather than replacing it.
