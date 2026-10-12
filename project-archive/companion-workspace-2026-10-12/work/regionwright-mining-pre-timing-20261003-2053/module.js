import { MODULE_ID, ORE_CATALOG, ORE_ORDER, installOreItems } from "./catalog.js";
import {
  MINING_REGION_FLAG,
  clearMiningRegion,
  configureMiningRegion,
  configureSelectedMiningRegion,
  hasMiningPick,
  installMiningRegionInteraction,
  installMiningSocket,
  isMiningRegion,
  mineRegion,
  miningRegionData,
  resetMiningRegion,
  yieldForAthletics
} from "./mining.js";

function selectedRegion() {
  return globalThis.canvas?.regions?.controlled?.[0]?.document
    ?? globalThis.canvas?.regions?.placeables?.find(placeable => placeable.controlled)?.document
    ?? null;
}

async function chooseOreForSelectedRegion() {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can configure mining Regions.");
  const region = selectedRegion();
  if (!region) throw new Error("Select a Region on the Regions layer first.");

  const current = miningRegionData(region);
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.wait) {
    const oreId = globalThis.prompt?.(`Ore id (${ORE_ORDER.join(", ")}):`, current?.oreId ?? "iron");
    if (!oreId) return null;
    return configureMiningRegion({ region, oreId });
  }

  const options = ORE_ORDER.map(id => {
    const ore = ORE_CATALOG[id];
    return `<option value="${id}" ${current?.oreId === id ? "selected" : ""}>${ore.name} — ${ore.value} ${ore.denomination}/lb</option>`;
  }).join("");

  const result = await DialogV2.wait({
    window: { title: `Mining Vein — ${region.name}` },
    content: `<form class="rw-mining-setup">
      <p>Choose the ore represented by the visible deposit beneath this Region.</p>
      <label>Ore type <select name="oreId">${options}</select></label>
      <p>Each vein has <strong>5 swings</strong>. The miner's final Athletics total determines pounds extracted per swing.</p>
    </form>`,
    buttons: [
      {
        action: "configure",
        label: "Configure Vein",
        icon: "fa-solid fa-hammer",
        default: true,
        callback: (_event, button) => ({ action: "configure", oreId: button.form.elements.oreId.value })
      },
      { action: "reset", label: "Reset Depletion", callback: () => ({ action: "reset" }) },
      { action: "clear", label: "Clear Mining", callback: () => ({ action: "clear" }) },
      { action: "cancel", label: "Cancel", callback: () => null }
    ]
  });

  if (!result) return null;
  if (result.action === "reset") return resetMiningRegion(region);
  if (result.action === "clear") return clearMiningRegion(region);
  return configureMiningRegion({ region, oreId: result.oreId });
}

function addMiningTool(controls) {
  if (!globalThis.game?.user?.isGM) return false;
  const group = Array.isArray(controls)
    ? controls.find(control => ["region", "regions"].includes(control?.name))
    : controls?.regions ?? controls?.region;
  const tools = group?.tools;
  if (!tools) return false;

  const tool = {
    name: `${MODULE_ID}-configure`,
    title: "Mining Veins",
    icon: "fa-solid fa-hammer",
    button: true,
    visible: true,
    onChange: () => void chooseOreForSelectedRegion().catch(error => {
      globalThis.ui?.notifications?.warn?.(error?.message ?? String(error));
    })
  };

  if (Array.isArray(tools)) {
    if (tools.some(entry => entry?.name === tool.name)) return false;
    tools.push({ ...tool, order: tools.length });
    return true;
  }
  if (tools[tool.name]) return false;
  tools[tool.name] = { ...tool, order: Object.keys(tools).length };
  return true;
}

export const api = Object.freeze({
  version: "0.1.0",
  catalog: ORE_CATALOG,
  order: ORE_ORDER,
  installOreItems,
  configureRegion: configureMiningRegion,
  configureSelectedRegion: configureSelectedMiningRegion,
  clearRegion: clearMiningRegion,
  resetRegion: resetMiningRegion,
  isMiningRegion,
  miningRegionData,
  hasMiningPick,
  mineRegion,
  yieldForAthletics,
  openSetup: chooseOreForSelectedRegion,
  regionFlag: MINING_REGION_FLAG
});

Hooks.on("getSceneControlButtons", addMiningTool);

Hooks.once("setup", () => {
  installMiningRegionInteraction();
});

Hooks.once("init", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
});

Hooks.once("ready", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  installMiningSocket();
  installMiningRegionInteraction();

  void installOreItems().then(result => {
    if (result.created) {
      globalThis.ui?.notifications?.info?.(
        `Mining catalog installed: ${result.created} ore item${result.created === 1 ? "" : "s"} added to the Items directory.`
      );
    }
  }).catch(error => {
    console.error(`[${MODULE_ID}] Unable to install mining ore catalog.`, error);
    globalThis.ui?.notifications?.error?.("Mining ore items could not be installed.");
  });

  Hooks.callAll(`${MODULE_ID}.ready`, api);
});

Hooks.on("canvasReady", () => {
  installMiningRegionInteraction();
});
