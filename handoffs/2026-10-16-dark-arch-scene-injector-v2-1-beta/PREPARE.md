# The Dark Arch — Map 1 / 6 — PREPARE Restart

**Status:** PREPARED (workflow: DiceBox Scene Injector V2.1 Beta). **Date:** 2026-10-16.
**Scene identity:** `dbx.heist.kurth.m01.dark-arch`
**Source baseline:** canonical repository `main` @ `1137241a7df431a5cc4bc775ab56dcd283e1db29`, plus the accepted V2.1 Beta review branch changes recorded separately.
**Gates completed:** PREPARE content reconciliation only. No geometric Blueprint, grayscale render, painterly render, native Foundry Scene, approval or runtime certification.

## Mission and continuity

Map 1 is a freeform ingress across **the Dark Arch**, the short, controlled bridge from Luskan's South Bank to Closeguard Island, toward Kurth Tower (Map 2 of the Acquisitions Incorporated comedy heist). The six players improvise how to cross. Jim Darkmagic accompanies them as a witty, non-mechanical guide. The GM places and controls all guards later. There is **no required puzzle, mandatory guard defeat or scripted success condition** on M01. Lore route/location is sourced from the previous accepted PREPARE, but rope equipment, winches, docks and bypasses are heist-fixture additions, not claims about official maps.

## Locked scale and renderer constraints

| Item | PREPARE requirement |
|---|---|
| Canvas / physical space | **40 × 24** five-foot logical spaces; **200 × 120 feet** |
| Battlemap scale | Gridless, 120 px / 5 ft; **4800 × 2880 px**, padding 0 |
| Camera | Strict 90° overhead orthographic; no perspective tilt/horizon |
| Orientation | Left: Luskan South Bank; center: bridge; right: island. Scene-local only |
| Bridge | Main crossing supports 20-ft clear lane plus parapets; normal Large (10-ft) access |
| Gate | A securable approximately 15-ft opening, not a puzzle gate |
| Elevation | Bridge deck over water, reachable city lower quay and island dock; visible stairs/climbing anchors |
| Labels/tokens/grid | No baked measurement grid, narrative labels, character tokens or preplaced guards |
| Watercraft | Empty boat berth in art; small skiff is a separate movable placeable, never baked into the backdrop |

## Required geometric connectivity — to be proven at GEOMETRY stage

The gatehouse forms a discernible division between public bridge approach and the inner tower approach. **The two alternative routes must end on the inner/post-gate side**, not return to the bridge exterior.

```text
South Bank staging -- Main Bridge -- Outer Gate [open/force/bluff] -- INNER APPROACH --> M02
       |
       +-- lower city quay -- water/skiff -- island dock -- stairs -- INNER APPROACH
       |
       +-- bridge-side hoist anchor -- rope/swing -- upper island terrace -- INNER APPROACH
```

Both alternatives should remain understandable physical options rather than mandatory automated puzzles. Stable physical openings, traversal endpoints, landing zones and elevations are mandatory; climb/leap difficulty remains GM adjudication. A visible reachable back-of-gate landing is necessary even if the alternative is dangerous. **Do not infer a missing door from painted textures.**

## Required areas and encounter props

- **City bank:** 6-PC start area, compact checkpoint booth, cargo/wagon staging, cover/crates, city quay stairs and lower mooring; alarm bell reachable from the bridge or checkpoint.
- **Bridge center:** Stone parapets, passing platform, some cover and freight equipment; fixed rope/hoist with a credible anchored trajectory to the island terrace.
- **Island side:** Guarded gatehouse/portcullis, lookout, inner court/approach to M02, lower island dock with stairs that emerge past the gate, upper rope service terrace with a walkable post-gate connection.
- **Separate runtime prop:** The skiff is planned as one movable Foundry Tile / owned placeable, not a colored or grayscale background object.
- **No authored enemy placement:** No tokens, guards, Jim miniature, enemy actors or forced initiative; the GM chooses patrols and methods.

## Spatial intent and IDs

Keep the already accepted stable scene key and conceptual relative placement. Early logical envelopes from the original PREPARE (including South Bank x0–10, bridge x10–31, island gate x32–37, exit at x37–40) are **starting envelopes only**. The geometry author may redesign internal shapes, including different bridge bends and terraces, to meet functionality. The precise typed Spatial Blueprint coordinates, ground-surface polygons, elevations, bridge and parapet Wall traces, switchback stair routes, and rope attachment/landing footprints are **not accepted yet**.

Arrival Region candidate: `dbx.heist.m01.arrival.south-bank`.
M02 departure Region candidate: `dbx.heist.m01.transition.kurth-reception`.
Actual Foundry UUIDs, destination links, World, Module and active GM are unresolved until future authorized runtime staging.

## GEOMETRY acceptance checklist (new v2.1 Beta gate)

1. Author a **program-owned** typed geometric model with stable feature IDs and explicit walkable polygons, gates, stairs, elevations, swing endpoints and water/boat boarding surfaces.
2. Prove that each of the three listed routes independently reaches a continuous post-gate approach to the M02 exit. Prove the alternate arrivals lie past the fortified gate wall.
3. Verify **20-ft bridge** and **15-ft gate** intended widths plus real Medium/Large swept-footprint access along the normal route. Optional risky routes may have explicitly approved movement/skill requirements.
4. Distinguish solid Wall boundaries, parapets, water/low decks, native door opening and separate movable skiff (no baked duplicate).
5. Generate an annotated *geometry preview* for verification only, separate from Image 2.5/grayscale artwork. Do not consider geometry preview itself painted map authority.
6. Persist Geometry Inspect PASS with typed model ID/hash and route receipts before invoking artistic image generation.

## Future artistic gates (not started)

Embossed grayscale artwork will render only approved structural geometry, recognizable raised walls and floor boundaries, and overhead readability. It must not mention a subsequent paint stage in the grayscale image prompt. After structural inspection and Feature Manifest reconciliation, painterly art adds Luskan wet stone, aged timber, rusted iron and cold river color, without topological drift. Only FINAL_INSPECT PASS approves final art. BUILD remains one Markdown with one self-contained JS macro under unchanged validator v2.

## Clean restart / rejection history

All earlier prompt/images, through the repeated failures and independent graybox attempt #011, are **archival history only**. They are not geometry authority or future image-generation input. The earlier geometrical scaffold #011 is not approved and is excluded from the new Geometry authoring pass. Generate new geometry from this PREPARE; any rejected artistic prompt must be replaced by an independently composed prompt based only on accepted source, never patched.

## Status and recovery

- **PREPARE RESTARTED, await GEOMETRY.** This document and `spec.json` are a review-branch handoff, not an implementation on `main` until integrated.
- The authoritative active product stage is not advanced, and baseline active-slice checker violations remain a separate integration blocker.
- No new imagery, Walls, Regions, actors, placeables or live Foundry state were created by this restart.
