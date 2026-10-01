/* Regionwright Fishing Biomes GM macro.
 * Select a Region on the Regions layer, then run this macro to choose a
 * biome and bait from the injection catalog.
 */
const fishingBiomes = game.modules.get("regionwright-fishing")?.api;
if (typeof fishingBiomes?.openSetup !== "function") {
  ui.notifications.error("Enable Regionwright and Regionwright Fishing Biomes first.");
} else {
  await fishingBiomes.openSetup();
}

