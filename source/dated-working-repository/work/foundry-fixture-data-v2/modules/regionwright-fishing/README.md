# Regionwright Fishing Biomes

Regionwright Fishing Biomes is a small optional Foundry VTT injection module. It depends on the main `regionwright` module and adds an environment catalog to the existing fishing minigame.

## Install and use

1. Install or copy this folder as `Data/modules/regionwright-fishing`.
2. Enable both **Regionwright: Puzzles & Traps** and **Regionwright Fishing Biomes**.
3. On the Regions layer, select a water Region and choose **Inject Fishing Biome**, or run `macros/inject-fishing-biome.js`.
4. Pick an environment and bait. The injection configures the Region's fish table and the exact bait item name required to cast.

The public API is available at `game.modules.get("regionwright-fishing").api`:

```js
await game.modules.get("regionwright-fishing").api.injectSelected({ biome: "swamp", bait: "leeches" });
await game.modules.get("regionwright-fishing").api.createBaitForActor({ bait: "leeches", quantity: 3 });
```

The catalog has entries for Arctic, Coastal, Desert, Forest, Grassland, Hill, Mountain, Swamp, Underdark, Urban, and Underwater. `waterborne` is accepted as an alias for `underwater` because the 2024 travel rules use Waterborne while older encounter tables use Underwater.

## Design boundary

The environment categories are based on official D&D terrain and habitat labels. The ordinary fish names, bait, purposes, and eating notes are proposed homebrew. Normal fish are rations with no automatic stat effect; unusual catches are tagged as materials or utility catches and are described for trade, bait, crafting, or quest use. The module does not invent automatic ability-score bonuses or poison rules.

