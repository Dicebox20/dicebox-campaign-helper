# Codex Ascendancy map style studies

These are original, versioned visual assets. All four campaign rooms have reviewed 1536×1024 gridless renderer candidates. Their artwork is subordinate to the orthogonal Spatial Blueprint and Region coordinate plans; asset existence or visual review does not by itself make an image package-bound.

| Asset | Narrative use | Foundry/Regionwright handoff intent |
| --- | --- | --- |
| `manual-central-core-control-chamber-v5-neutral.png` | Measured neutral Central Core Control Chamber renderer | Six station Regions and the Core west rail entry remain Blueprint-owned; the neutral background is package-bound while native/runtime proof remains separate |
| `ascendancy-signal-frequency-chamber-v2.png` | Final Signal / Frequency Chamber renderer | Four personal/cooperative zones are coordinate-bound by the Campaign Helper |
| `ascendancy-rune-mechanism-chamber-v2.png` | Final Rune Mechanism Chamber renderer | Memory, physical order, and slotting zones are coordinate-bound by the Campaign Helper |
| `ascendancy-tram-depot-routing-yard-v6-neutral.png` | Measured neutral Tram Depot renderer | Scene background only; exact empty board/eastbound rail/gates are Blueprint-owned static projections through the Foundry Tile/Region plan |

All assets are neutral image renderers, not Foundry Scenes, walls, Regions, RegionBehaviors, or executable puzzle content. The current campaign package binds all four room backgrounds after M1210 source-byte and measured-overlay review; exact Tram/Core topology remains owned by the Spatial Blueprint and static Background Object/Tile projections. The tram map's Scene projection contract records its exact 1536×1024 canvas and derives all six-by-six anchors from that canvas. Region rectangles remain defined in `packages/dicebox-compiler/src/ascendancy-region-plan.ts`.

## Rendering gate

All four room backgrounds have static orthographic review and measured 1536×1024 source-byte evidence. Static review does not establish native mapping or runtime play: the current machine-readable package marks all four neutral renderers `scene-bound`, while the exact six-by-six track topology and Tram-east/Core-west relation remain the deterministic Blueprint and Scene plan. The machine-readable gate is `tramSceneProjection.rendererRequirements` and the wall/door source is `createAscendancyMapBlueprints()`.

The earlier `v1` room studies and `v2` tram study remain in the folder as historical assets and are not package-bound. They must not be installed as the current campaign renderers.

## Provenance

- Source context: linked `Ballad of Chauser Bill` chat, original four-room campaign brief and tram-routing requirements.
- Excluded context: slideshow/video generation, creative dialogue, and rough tram-map drafts.
- Generation mode: built-in image generation with the earlier industrial style studies used only as style reference; the four current layouts were newly composed for the orthogonal Scene and Region plans.
- Verification: SHA-256, dimensions, visual gate, and blueprint counts for the current four renderers are recorded in `outputs/m35-ascendancy-campaign-package-static-receipt.json` and `outputs/m34-map-renderer-research-static-receipt.json`. Older `m25`, `m32`, and `m33` receipts remain historical.
