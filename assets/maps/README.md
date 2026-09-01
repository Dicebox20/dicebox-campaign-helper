# Codex Ascendancy map style studies

These are original, versioned visual assets. All four campaign rooms have reviewed 1536×1024 gridless renderer candidates. Their artwork is subordinate to the orthogonal Spatial Blueprint and Region coordinate plans; asset existence or visual review does not by itself make an image package-bound.

| Asset | Narrative use | Foundry/Regionwright handoff intent |
| --- | --- | --- |
| `ascendancy-central-core-control-chamber-v2.png` | Reviewed Central Core Control Chamber renderer candidate | Six station Regions and the Core west rail entry remain blueprint-owned; package binding is blocked pending the revised renderer review |
| `ascendancy-signal-frequency-chamber-v2.png` | Final Signal / Frequency Chamber renderer | Four personal/cooperative zones are coordinate-bound by the Campaign Helper |
| `ascendancy-rune-mechanism-chamber-v2.png` | Final Rune Mechanism Chamber renderer | Memory, physical order, and slotting zones are coordinate-bound by the Campaign Helper |
| `ascendancy-tram-depot-v3.png` | Reviewed Tram Depot renderer candidate | Scene background only; package binding is blocked pending the empty-yard/eastbound-Core review; the logical board is authoritative and projects through the Foundry Tile/Region plan |

All assets are gridless image renderers, not Foundry Scenes, walls, Regions, RegionBehaviors, or executable puzzle content. The current campaign package binds only Signal and Rune; Tram and Core remain `final-map-required` with no bound path until their current topology/rendering review is complete. The tram map's Scene projection contract records its exact 1536×1024 canvas and derives all six-by-six anchors from that canvas. Region rectangles remain defined in `packages/dicebox-compiler/src/ascendancy-region-plan.ts`.

## Rendering gate

All four candidates received static visual review for strict orthographic top-down projection, visible perimeter walls, visible door openings, no diagonal/isometric geometry, and puzzle-readable room composition. Static review is not package binding: the current machine-readable package marks Signal/Rune `scene-bound` and Tram/Core `final-map-required`. The tram candidate visibly presents six straight horizontal lanes, but the authoritative six-by-six track topology and Tram-east/Core-west relation remain the deterministic blueprint and Scene plan. The machine-readable gate is `tramSceneProjection.rendererRequirements` and the wall/door source is `createAscendancyMapBlueprints()`.

The earlier `v1` room studies and `v2` tram study remain in the folder as historical assets and are not package-bound. They must not be installed as the current campaign renderers.

## Provenance

- Source context: linked `Ballad of Chauser Bill` chat, original four-room campaign brief and tram-routing requirements.
- Excluded context: slideshow/video generation, creative dialogue, and rough tram-map drafts.
- Generation mode: built-in image generation with the earlier industrial style studies used only as style reference; the four current layouts were newly composed for the orthogonal Scene and Region plans.
- Verification: SHA-256, dimensions, visual gate, and blueprint counts for the current four renderers are recorded in `outputs/m35-ascendancy-campaign-package-static-receipt.json` and `outputs/m34-map-renderer-research-static-receipt.json`. Older `m25`, `m32`, and `m33` receipts remain historical.
