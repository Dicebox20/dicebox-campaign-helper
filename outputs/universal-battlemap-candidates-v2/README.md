# Manual Ascendancy Map Bundles — v2

These are the current manual-setup candidates for the three non-Tram rooms.
They supersede the earlier v1 Signal/Rune bundles because the v2 renderers are
geometry-neutral and place their fixed puzzle apparatus afterward.

For each room:

1. Import the `.uvtt` file using Universal Battlemap Importer.
2. Use `BACKGROUND-OBJECT-PLACEMENT.md` to place the fixed visual doors and
   apparatus as exact native Foundry Tiles.
3. Use `REGION-PLACEMENT.md` to create exact rectangular Foundry Regions.
4. Save the generated Foundry Region UUID next to its stable DiceBox ID in the
   `.dicebox-regions.json` sidecar before handing the bindings to Regionwright.

The imported background is intentionally an approximate visual renderer. The
Spatial Blueprint, imported Walls/doors, Background Object rectangles, and
Region sidecar are the coordinate authority. These candidate files do not
create or alter any Foundry world content by themselves.

Tram is excluded from this manual bundle and remains the focused implementation
task because its rail layout and dynamic car puzzle require a separate,
measured Scene design.
