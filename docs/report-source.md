# AI Map Creation for Foundry and VTTs — Evidence Notes

Date: 2026-08-22  
Audience: DiceBox Campaign Helper implementation and Regionwright integration

## Scope and answer

This research resolves one operational question: how DiceBox should turn an AI-created map image into a playable Foundry Scene without treating the image as a source of game geometry.

The answer is: freeze the authoritative blueprint first, generate and approve a **background-only** map asset, then create native Foundry documents in layers. In this workflow, a Foundry **Tile** means an individually controllable Tile document, not a raster map tile. The Tram renderer therefore contains no cars and no movable blocking props; both are later functional Tiles.

## Evidence-led workflow

1. Consult the DiceBox KB and freeze the Spatial Blueprint, canvas, doorway/gate centers, story route, and acceptance criteria. This is the only geometry authority.
2. Generate a clean, top-down, gridless, fixed-architecture background at the declared canvas dimensions. Do not bake movable objects, blockers, tokens, doors with state, or puzzle state into it.
3. Review the rendered asset against a deterministic coordinate overlay. Record its version/hash, dimensions, stable asset ID, coordinate assumptions, and explicit accept/reject result. Reject it if it changes the frozen route.
4. Bind the accepted image as the Scene background and set final image dimensions/grid configuration before placing functional documents. Foundry warns that resizing later may displace placed objects, and recommends deciding grid setup before details are added.
5. Create native Walls and doors from the Blueprint, not from image recognition. Verify movement and vision behavior with Foundry's native documents.
6. Create functional Foundry Tile documents for movable cars and physical blocking props. Their locations and movement are driven by canonical puzzle state, never by pixels.
7. Create Regions/RegionBehaviors only after the background, Walls/doors, and Tiles have authoritative rereads. Preserve foreign state and record the target-bound receipt.

## Foundry-specific conclusions

- A Scene background is a lowest-layer visual backdrop; Tiles are separate artwork documents above it. This directly supports treating the empty Tram renderer and tram/prop Tiles as distinct objects. [Foundry Canvas Layers](https://foundryvtt.com/article/canvas-layers/)
- Foundry cautions that changing scene dimensions can reposition Tiles, Walls, lights, and other placeables; it separately recommends finalizing grid setup before details. [Foundry Scenes](https://foundryvtt.com/article/scenes/)
- Native Walls, including doors, control movement and vision. They must represent the declared route even if art is imperfect. [Foundry Walls](https://foundryvtt.com/article/walls/)
- Foundry's map guidance favors gridless final images when a VTT grid will be used and establishes that asset resolution—not DPI—is relevant. [Foundry Media Guide](https://foundryvtt.com/article/media/), [Foundry Content Creation Guide](https://foundryvtt.com/article/content-creation-guide/)

## Cross-VTT and community findings

- Universal VTT export formats carry a flattened image plus separate map metadata such as walls, portals, and lights. They demonstrate a portable visual-versus-geometry separation, but are not a DiceBox geometry authority. [Arkenforge UVTT explanation](https://arkenforge.com/universal-vtt-files/)
- Foundry's Universal Battlemap Importer supports v14 and imports Dungeondraft, DungeonFog, and Arkenforge export files. It is an optional import workflow, not an acceptable substitute for DiceBox's versioned compiler contract. [Universal Battlemap Importer](https://foundryvtt.com/packages/dd-import)
- Dungeon Alchemist's Foundry workflow starts with an empty Scene, imports wall/light data, and then assigns the visual background. It validates the need for separate map-media and native-document stages, although DiceBox will retain its own compiler and reread gates. [Dungeon Alchemist Foundry import guide](https://www.dungeonalchemist.com/import-to-foundry)
- Community experience warns that automatic wall/grid detection and imports still need a player-view review; they are aids, not verification. [Foundry Hub Universal Battlemap Importer notes](https://www.foundryvtt-hub.com/package/dd-import/), [Foundry community discussion](https://www.reddit.com/r/FoundryVTT/comments/yjhcga/)

## DiceBox Tram application

The current accepted source plan fixes the empty six-by-six rail yard at `(420,210)` with `110×95` cells, yard entry/exit at `(420,447.5)` and `(1080,447.5)`, and an outward Core rail to `(1512,447.5)`. The v4 background must visibly make that eastbound rail the sole player route to the Core while containing **zero** trams and **zero** movable props. Functional tram and blockade Tiles are a later, separate implementation pass.

## Limitations

AI image tools do not provide reliable document geometry, stable wall semantics, or proof of Foundry placement. UVTT/export tools can carry geometry, but their imported fields are still external input and must be reconciled against the authoritative DiceBox plan before use.
