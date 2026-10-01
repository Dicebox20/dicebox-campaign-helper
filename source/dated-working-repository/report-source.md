# Coordinate-Locked Foundry Scene Composition Research

**Audience:** DiceBox Campaign Helper implementers

**Date:** 2026-08-22

## Decision

For the Ascendancy Tram and Core scenes, use a geometry-neutral raster renderer as the Scene background, then project every coordinate-critical fixed environmental or puzzle apparatus as a stable Background Object after native Walls and doors are in place. This includes the fixed Tram rails, sealed gates, Core doors, control stations, and the central core presentation. A native Foundry `Tile`/`TileDocument` is reserved for an object that needs separate runtime positioning, visibility, movement, or state; dynamic tram cars therefore remain distinct native Tile projections. Walls, door anchors, Regions, and puzzle state stay authoritative in the Spatial Blueprint and runtime documents.

This directly implements the project’s locked pipeline: `Blueprint → Walls/doors → empty renderer → Background Objects/Regions → authoritative reread`.

## Why

- Foundry describes a Scene background as the lowest-layer backdrop and native TileDocuments as independently positioned artwork placed above it. The helper workflow calls the fixed visible environmental/puzzle apparatus after the renderer Background Objects; native Foundry Tiles remain for separately positioned, visible, movable, or stateful objects. Paired Walls supply movement, sight, sound, and light blocking. [Canvas Layers](https://foundryvtt.com/article/canvas-layers/), [Tiles](https://foundryvtt.com/article/tiles/)
- Foundry’s Tile tooling supports independently setting TileDocument position and dimensions, and the Tile document is a native embedded Scene document. That native document surface is used only where separate runtime positioning, visibility, movement, or state is required; fixed apparatus remains a Background Object category after the renderer. [Tiles](https://foundryvtt.com/article/tiles/), [TileDocument v14](https://foundryvtt.com/api/v14/classes/foundry.documents.TileDocument.html)
- Foundry warns that changing Scene grid size can shift Walls, lights, Notes, and Tiles. Therefore the Scene dimensions and coordinate contract must be frozen before authored Tiles are added; our non-square Tram cells are project-owned pixel geometry, not a claim that Foundry’s square grid owns the puzzle. [Scenes](https://foundryvtt.com/article/scenes/)
- Foundry’s content guidance says tile-based Scenes need zero padding and dimensions large enough to contain all Tile content. [Content Creation Style Guide](https://foundryvtt.com/article/content-creation-guide/)
- Community VTT practice independently supports exporting movable content separately and adding it as individual Tiles rather than baking it into a map image. This is corroboration only, not the authority boundary. [Foundry community discussion](https://www.reddit.com/r/FoundryVTT/comments/1u404is/system_agnostic_how_to_import_dungeondraft_maps/)

## Candidate failure lesson

The first generated Tram and Core candidates looked stylistically plausible but failed measured-fit review: the Tram did not prove the locked six-row yard/east rail/no-bypass topology, and the Core’s visible west corridor was roughly 65 px below the locked west entry and obstructed station rectangles. Generated imagery must not be repaired by changing the locked Blueprint merely to fit pixels.

## Required implementation receipt

For each renderer/Background Object candidate, record the source path, SHA-256, 1536×1024 dimensions, stable DiceBox ID, exact `x/y/width/height`, planned ownership, preservation scope, and preview result. If the object requires a native Foundry TileDocument, also record the exact API, approval identity, and post-write Scene reread. The renderer remains candidate-only until the overlay and Background Object matrix prove the full coordinate contract.

## Research limitation

The first-pass web search returned current official Foundry sources and relevant community corroboration. Opening the result pages through the research connector returned a persistent 500 error twice; the URLs above are direct primary/community sources, and the decision is additionally grounded in the project KB’s F-188, D-153, and F-211.
