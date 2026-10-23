# Unified Bathhouse — attempt 5 inspection: REDO

**Date:** 2026-10-23. **Authority:** owner-directed REDO with single-surface-map exception continuing.
**Gate:** PREPARE_RECHECK_PASS; exact approved Gondian BWE-032A original source visually inspected in active local workspace, current BATH-01…08 register and previous failed receipt re-read before rendering. [Gate record](./bathhouse-single-map-geometry-control-pre-render-2026-10-23.md).

**Geometry control:** `bathhouse_geometry_control_v5.png`, 1536×1024, SHA-256 `d2bf3698096c57692b183f70027092cdf042ac6842b5ecdffd162642aca3964f`. This is independently drafted architecture guidance reflecting the approved floorplan, **not** a playable map or painted artwork, and not asserted to be uploaded as image bytes to GitHub.

**One new generated candidate:** `overhead_isometric_top_down_fantasy_map_illustrati.png` 1536×1024, SHA-256 `756a955defdcea2747d108c0c2fc88ca1ec7bb4259b63f918d5621c6114db461`, image generation ID `9960f03e-0cbb-41dc-8f3f-9d2d00cec938`. Neither image byte payload is committed to GitHub. This attempt used a new external technical geometry-guide strategy, but the resulting generator artwork visibly reverted toward the previous generic bathhouse arrangement and did **not** preserve the explicit architecture.

## Honest visual findings

| Requirement | Finding | Verdict |
|---|---|---|
| North Changing, NW Herbal, W Boiler, SW Mechanical, central Main, NE Warm and SE Cold positions | General zones occupy expected cardinal sides | PASS |
| Public entrance north through Changing | Present | PASS |
| Direct Boiler→Mechanical door | Apparent opening through shared wall | PASS VISUAL |
| Mechanical's sole connection through Boiler | Additional visible Mechanical→Main opening at east wall | **FAIL** |
| NE walkable Aqueduct entry at Warm Bath | Adjacent aqueduct waterway and sealed warm-room exterior wall, no credible pedestrian threshold | **FAIL** |
| Exactly two exterior entrance portals | Prominent SOUTH exterior stairs from Main Bath | **FAIL** |
| Exactly seven enclosed surface rooms | Additional linen/utility room between Warm and Cold | **FAIL** |
| Dormant unlit boiler / neutral base light | Lit burner in Boiler is baked into artwork | **FAIL** |
| Main pool / later three-ring Rosewater mechanism | Filled pool visible; drain/rotating ring/Screwdriver remain future staged Foundry UI | CONDITIONAL PASS |
| Lower Reliquary | Not visible on single surface raster; must be accessed through controlled underfloor stage with independent dry Boiler exit | UNIMPLEMENTED; do not silently discard |

**Disposition:** `RENDERED_INSPECT_REDO`; not owner-approved, not an approved map; no Foundry writes or stage changes. Exactly ONE candidate image rendered and inspected; no automatic retry.

## Workflow learning

A simplified zone diagram and independent positive-only prompt were insufficient to constrain the current renderer. Before another permitted attempt, investigate a deterministic fixed-wall/fixed-door layer derived from actual approved architectural blueprint pixels, with painting/texture added in *bounded regions only*. Do not let image rendering redraw topology or prompt language drift. The owner controls authorization of any changed production technique. The rejected candidate remains evidence, not input to future art generation.
