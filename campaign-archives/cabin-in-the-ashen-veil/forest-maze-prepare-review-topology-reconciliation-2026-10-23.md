# Northwestern Forest Maze — PREPARE Review and Topology Reconciliation

**Date:** 2026-10-23  
**Owner request:** “review the prepared notes for the maze”  
**Scope:** Read/reconciliation only: no new map generation, no existing owner-approved art change, no Foundry writes, no master PREPARE mutation or automatic consolidation/census change.  
**Status:** `PREPARE_REVIEW_COMPLETE_WITH_CORRECTIONS_PROPOSED`. The previous one-shot render `93f86008-3310-4aba-a87a-4b01272d519f` (ruined cottage instead of maze) remains `RENDERED_INSPECT_REDO`.

## Records reviewed

1. [Current 56-card structured master PREPARE](./all-scene-preparation-register-v2-2026-10-22.json) and [human PREPARE lines covering FM-01–04 and SG-07](./all-scene-preparation-register-v2-2026-10-22.md).
2. [2026-10-23 consolidated maze first-render PREPARE](./forest-maze-unified-first-render-prepare-2026-10-23.md) created before failed attempt.
3. Exact owner-selected original *Forest Maze* aerial plan, `forest_maze_estate_map.png` (**1448×1086**), locally viewed: gazebo structure NW **inside maze enclosure**, greenhouse structure NE **inside maze enclosure**, circular old well center, wrought-iron **south boundary gate**; ample spirals, forks, dead ends and clear enclosed hedge corridor network.
4. [Latest owner exterior full-area default](./map-granularity-owner-rule-and-consolidation-audit-2026-10-23.md), which permits proposing one large forest maze background while preserving separate gameplay locations.
5. [Older Sune's Grove and estate refinement](./grove-nine-scene-and-estate-refinement-plan-2026-10-22.md), [9/9 visually approved Grove](./grove-nine-map-visual-completion-receipt-2026-10-23.md), [Estate preflight](./all-map-preparation-preflight-v2-2026-10-22.md) and the mandatory [PREPARE reread rule](./mandatory-pre-render-prepare-recheck-rule-2026-10-22.md).

## Authoritative versus superseded

**CURRENT:** Northwestern Forest Maze is separate from **Sune's Grove's nine already-approved maps**. Four maze logical feature cards: `FM-01` southern iron gate, `FM-02` lower spirals/switchbacks, `FM-03` northern forks toward Gazebo/Greenhouse, `FM-04` central Rootbound Well and Aqueduct passage. These remain stable logical feature IDs even if ONE large image becomes a Foundry scene.

**SUPERSEDED:** The older Grove refinement plan names `SG-07` as the Rootbound Well, `SG-03` as the maze iron gate, and `SG-08/SG-09` as the Gazebo/Greenhouse connectors. The newer 56-card master PREPARE and accepted SG-07 Southwest Rose bust / SG-03 Northeast Star bust artwork explicitly replace that plan. Do not draw another Well in the Grove or alter its nine accepted images. The **Well is FM-04**.

**TO RECONCILE BEFORE NEXT RENDER:** The 2026-10-23 consolidated render PREPARE describes NW/EAST Gazebo and Greenhouse as **two external maze-border exits with only threshold fragments in the art**. This conflicts with the selected owner's original blueprint which **depicts both buildings clearly inside the maze's enclosed northern corners**. The sensible source-fidelity implementation is to paint their static exterior **roof/silhouette/footprint at NW and NE** as recognizable landmarks and add *scene transitions at their entrance footprints*, keeping `EXT-05` Gazebo and `EXT-06` Greenhouse independent playable destinations for their established puzzle interiors. The original reference has only **one obvious outer hedge-boundary pedestrian exit: SOUTH wrought iron gate**. Gazebo/Greenhouse entrances and the Well are **internal Region thresholds** rather than 2 additional cuts through the enclosing hedge perimeter. This distinction is a **proposed documentation correction**; map scene topology awaits visual render approval and final paired Region coordinates.

## Canonical gameplay gates
- `FM-01`: iron gate accessible from Carriage Yard NW boundary, held shut for early inward crossing, openable from within after lawful Well/Aqueduct chase progression, then persistent bidirectional travel. Gate state via Foundry Walls/Regions, not baked art.
- `FM-04` ↔ `AQ-01`: one central Well with safe accessible landing in maze after first Crooked Man chase; return to Aqueduct still works when the pond is refilled following legitimate access. Avoid bypass or hard trap.
- `EXT-05` Gazebo: oil + Candle Workshop Wick activate garden lantern and release Rufus eye #2; optional three-symbol picnic-table prize remains separate; no prize or triggered magic permanently painted.
- `EXT-06` Greenhouse: Waterworks-fed irrigation, recipe sequence + late Soap Room lye create Plant-Killer; actual supply, puzzle content and pickup remain in its separate destination scene.
- No additional mandatory item or puzzle added to generic maze bends.

## Proposed fresh image geometry

Large coherent, owner-source-relative **orthographic overhead navigable hedge maze** with substantial distinct looping lanes, multiple dead ends, isolated hedge obstacles and realistic token-clear crossings; densely enclosed continuous old hedge/stone boundaries; unmistakable **south iron entry gate**, **center Well**, **NW Gazebo roof/landmark**, **NE Greenhouse glass roof/landmark** in their enclosing northern clearings. One connected maze network between them. Art: dilapidated autumn garden, muted neutral daytime diffuse illumination, historical stone borders, dark hedge foliage and no painted permanent rewards. Source image is a *planning layout* with labels and ornaments; production art itself remains gridless and label-free. Strictly one image then inspector PASS/REDO and owner consent.

## Map count

Four FM logical cards → ONE image remains **proposed** and has not been approved by the owner as a specific rendered artifact; do not deduct 3 from the published **48 target / 14 approved / 34 remaining** count until a valid single-maze visual is accepted, without changing Gazette/Greenhouse separate target counts.

## Evidence and limitations

Source photo is visually verified in local workspace. The first failed render showed a ruined roofless cottage instead of a maze: hard `REDO` with essentially all structural gates missed. There was no runtime Foundry test and no valid new unified Forest Maze render. This audit avoids asserting pixel-perfect maze corridor walkability from the planning image.
