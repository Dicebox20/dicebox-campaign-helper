# Ascendancy map rendering gate

The Campaign Helper treats the Spatial Blueprint as the authoritative map source. A PNG is a renderer only and cannot define topology, scale, walls, doors, anchors, track state, Region behavior, or puzzle rules.

## Required preflight

- Query the local knowledge base for map, Spatial Blueprint, Foundry Scene, Wall, door-anchor, Region, and renderer guidance before creating or changing a map.
- Freeze the 1536×1024 Scene canvas, orthogonal coordinate plan, origin, scale, wall centerlines, door anchors, Regions, and clearances first.
- Validate the deterministic blueprint and projection plan before generating artwork.
- Reject isometric, diagonal, perspective-distorted, or unlabeled/ambiguous artwork as a Foundry-ready renderer.
- Require visible perimeter walls and door openings in the approved renderer, while keeping actual Wall/door data in the blueprint.
- For the tram, require an empty, enclosed, orthogonal six-by-six routing yard at the frozen logical-board footprint. Fixed walls, ingress/egress gates, and the one eastbound rail to the Core must be visible; the six movable tram cars are separate Foundry Tile projections from the canonical board and must never be baked into the renderer.
- Record the approved file hash, dimensions, visual review, source provenance, and remaining runtime blockers.

## Current campaign result

All four renderer candidates are 1536×1024 and received static visual review as strict top-down orthographic room backgrounds. The current package binds only Signal and Rune; Tram and Core remain `final-map-required` until the revised renderer/topology review is complete:

- `assets/maps/ascendancy-tram-depot-v3.png`
- `assets/maps/ascendancy-signal-frequency-chamber-v2.png`
- `assets/maps/ascendancy-rune-mechanism-chamber-v2.png`
- `assets/maps/ascendancy-central-core-control-chamber-v2.png`

The package carries deterministic Blueprints and Region plans. The tram's frozen board is x=420..1080, y=210..780 (six 110x95 cells); its fixed enclosure has a west ingress, an east egress aligned to logical row three, and an outer east door on the same Core rail. The Tram is west of Core, so the Core west rail entry must share the y=447.5 centerline. The tram blueprint carries 36 board interaction anchors plus Dalton repair and cooperative station anchors. Region Editor must create the Scene and native Walls/Regions from these data structures; it must not infer them from pixels or treat an unbound renderer candidate as installed.

This is static deterministic evidence only. Exact Foundry version, permissions, active-GM authority, native document creation, authoritative reread, teleport behavior, and cross-client play remain separate blockers.
