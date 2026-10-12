import { MODULE_ID, MINING_ORE_FLAG, yieldForAthletics } from "./mining-engine.js";
import { ORE_CATALOG, ORE_ORDER, createAllOreItemSources, createOreItemSource, formatOreValue, getOre } from "./catalog.js";
import {
  clearMiningRegion,
  configureMiningRegion,
  configureSelectedMiningRegion,
  findPickaxe,
  installMiningRegionInteraction,
  installMiningSocket,
  isMiningRegion,
  miningDepositData,
  openMining,
  refreshMiningRegionInteractivity,
  resetMiningRegion
} from "./mining.js";

const WORLD_FOLDER_NAME = "Mining Resources";
const SETUP_MACRO_NAME = "Configure Mining Deposit";
const SETUP_MACRO_FLAG = "setupMacro";
const RESET_SCENE_MACRO_NAME = "Reset Mining Deposits â€” Current Scene";
const RESET_SCENE_MACRO_FLAG = "resetSceneMacro";
const WORLD_ITEM_FLAG = "managedWorldOre";

function collectionDocuments(collection) {
  if (!collection) return [];
  if (Array.isArray(collection)) return collection;
  if (Array.isArray(collection.contents)) return collection.contents;
  try { return Array.from(collection); } catch (_error) { return []; }
}

function activeGM() {
  const gm = globalThis.game?.users?.activeGM;
  return Boolean(globalThis.game?.user?.isGM && (!gm || gm.id === globalThis.game.user.id));
}

async function ensureOreFolder() {
  let folder = collectionDocuments(globalThis.game?.folders).find(entry =>
    entry?.type === "Item" && entry?.name === WORLD_FOLDER_NAME && !entry?.folder
  );
  if (!folder) {
    folder = await globalThis.Folder?.create?.({ name: WORLD_FOLDER_NAME, type: "Item", sorting: "a" });
  }
  return folder ?? null;
}

async function installOreItems() {
  if (!activeGM()) return { created: 0, updated: 0, skipped: true };
  const folder = await ensureOreFolder();
  const worldItems = collectionDocuments(globalThis.game?.items);
  let created = 0;
  let updated = 0;

  for (const oreId of ORE_ORDER) {
    const source = createOreItemSource(oreId, 1);
    source.folder = folder?.id ?? null;
    source.flags[MODULE_ID][WORLD_ITEM_FLAG] = { version: 1, oreId };
    const existing = worldItems.find(item =>
      item?.flags?.[MODULE_ID]?.[MINING_ORE_FLAG]?.oreId === oreId
      && item?.flags?.[MODULE_ID]?.[WORLD_ITEM_FLAG]?.oreId === oreId
    );
    if (!existing) {
      await globalThis.Item.create(source, { renderSheet: false });
      created++;
      continue;
    }
    await existing.update({
      name: source.name,
      img: source.img,
      folder: source.folder,
      "system.weight": source.system.weight,
      "system.price": source.system.price,
      "system.description": source.system.description,
      [`flags.${MODULE_ID}.${MINING_ORE_FLAG}`]: source.flags[MODULE_ID][MINING_ORE_FLAG],
      [`flags.${MODULE_ID}.${WORLD_ITEM_FLAG}`]: source.flags[MODULE_ID][WORLD_ITEM_FLAG]
    });
    updated++;
  }
  return { created, updated, skipped: false };
}

function selectedRegion() {
  return globalThis.canvas?.regions?.controlled?.[0]?.document
    ?? globalThis.canvas?.regions?.placeables?.find(placeable => placeable.controlled)?.document
    ?? null;
}

function findRegionControlGroup(controls) {
  return Array.isArray(controls)
    ? controls.find(entry => ["region", "regions"].includes(entry?.name))
    : controls?.regions ?? controls?.region;
}

function addRegionControlTool(regionControls, tool) {
  const tools = regionControls?.tools;
  if (!tools || typeof tool?.name !== "string") return false;
  const exists = Array.isArray(tools)
    ? tools.some(entry => entry?.name === tool.name)
    : Boolean(tools[tool.name]);
  if (exists) return false;
  const orderedTool = { ...tool, order: Array.isArray(tools) ? tools.length : Object.keys(tools).length };
  if (Array.isArray(tools)) tools.push(orderedTool);
  else tools[tool.name] = orderedTool;
  return true;
}

export function registerMiningRegionControl(controls) {
  const regionControls = findRegionControlGroup(controls);
  if (!regionControls?.tools || !globalThis.game?.user?.isGM) return false;
  return addRegionControlTool(regionControls, {
    name: `${MODULE_ID}-region-control`,
    title: "Mining Deposits",
    icon: "fa-solid fa-pickaxe",
    button: true,
    visible: true,
    onChange: async () => {
      if (!selectedRegion()) {
        globalThis.ui?.notifications?.info?.("Select a Region before configuring a mining deposit.");
        return;
      }
      try {
        await showSetupDialog();
      } catch (error) {
        globalThis.ui?.notifications?.warn?.(error?.message ?? String(error));
      }
    }
  });
}
async function showSetupDialog() {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can configure mining deposits.");
  const region = selectedRegion();
  if (!region) throw new Error("Select one Region on the Regions layer first.");
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (!DialogV2) throw new Error("Foundry's dialog system is unavailable.");

  const current = miningDepositData(region);
  const options = ORE_ORDER.map(id => {
    const ore = getOre(id);
    const selected = current?.oreId === id ? " selected" : "";
    return `<option value="${id}"${selected}>${ore.name} â€” ${formatOreValue(ore)}/unit</option>`;
  }).join("");

  return DialogV2.wait({
    window: { title: "Configure Mining Deposit", icon: "fa-solid fa-hammer" },
    content: `<form class="rw-mining-setup">
      <p><strong>${region.name || "Selected Region"}</strong></p>
      <label>Ore type <select name="oreId">${options}</select></label>
      <p>Mining deposits have five shared extraction attempts by default.</p>
    </form>`,
    buttons: [
      {
        action: "configure",
        label: "Configure / Reset",
        icon: "fa-solid fa-hammer",
        default: true,
        callback: (_event, button, dialog) => {
          const oreId = dialog.element?.querySelector?.('select[name="oreId"]')?.value ?? ORE_ORDER[0];
          return { action: "configure", oreId };
        }
      },
      {
        action: "clear",
        label: "Clear Deposit",
        icon: "fa-solid fa-trash",
        callback: () => ({ action: "clear" })
      },
      {
        action: "cancel",
        label: "Cancel",
        icon: "fa-solid fa-xmark",
        callback: () => null
      }
    ],
    close: () => null
  }).then(async result => {
    if (!result) return null;
    if (result.action === "clear") return clearMiningRegion(region);
    return configureMiningRegion({ region, oreId: result.oreId });
  });
}

async function ensureSetupMacro() {
  if (!activeGM()) return { created: false, updated: false, skipped: true };
  const command = `(async () => {\n  const api = game.modules.get("${MODULE_ID}")?.api;\n  if (!api) return ui.notifications.error("Mining module is not ready.");\n  try { await api.openSetup(); } catch (error) { ui.notifications.warn(error.message ?? String(error)); }\n})();`;
  const macros = collectionDocuments(globalThis.game?.macros);
  let macro = macros.find(entry => entry?.flags?.[MODULE_ID]?.[SETUP_MACRO_FLAG]?.version === 1);
  if (!macro) {
    macro = macros.find(entry => entry?.name === SETUP_MACRO_NAME && entry?.flags?.[MODULE_ID]?.[SETUP_MACRO_FLAG]);
  }
  const data = {
    name: SETUP_MACRO_NAME,
    type: "script",
    scope: "global",
    command,
    img: "icons/tools/hand/pickaxe-steel-white.webp",
    flags: { [MODULE_ID]: { [SETUP_MACRO_FLAG]: { version: 1 } } }
  };
  if (macro) {
    await macro.update(data);
    return { created: false, updated: true, macro };
  }
  const created = await globalThis.Macro?.create?.(data, { renderSheet: false });
  return { created: Boolean(created), updated: false, macro: created ?? null };
}

async function ensureResetSceneMacro() {
  if (!activeGM()) return { created: false, updated: false, skipped: true };
  const command = `(async () => {\n  const api = game.modules.get("${MODULE_ID}")?.api;\n  if (!api) return ui.notifications.error("Mining module is not ready.");\n  try { const result = await api.resetScene(); ui.notifications.info("Reset " + result.reset + " mining deposit" + (result.reset === 1 ? "" : "s") + " on " + result.scene.name + "."); }\n  catch (error) { ui.notifications.warn(error.message ?? String(error)); }\n})();`;
  const macros = collectionDocuments(globalThis.game?.macros);
  let macro = macros.find(entry => entry?.flags?.[MODULE_ID]?.[RESET_SCENE_MACRO_FLAG]?.version === 1);
  if (!macro) macro = macros.find(entry => entry?.name === RESET_SCENE_MACRO_NAME && entry?.flags?.[MODULE_ID]?.[RESET_SCENE_MACRO_FLAG]);
  const data = {
    name: RESET_SCENE_MACRO_NAME,
    type: "script",
    scope: "global",
    command,
    img: "icons/tools/hand/pickaxe-steel-white.webp",
    flags: { [MODULE_ID]: { [RESET_SCENE_MACRO_FLAG]: { version: 1 } } }
  };
  if (macro) {
    await macro.update(data);
    return { created: false, updated: true, macro };
  }
  const created = await globalThis.Macro?.create?.(data, { renderSheet: false });
  return { created: Boolean(created), updated: false, macro: created ?? null };
}

async function resetMiningRegionsInScene(scene = globalThis.canvas?.scene) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can reset mining deposits.");
  if (!scene) throw new Error("No active Scene is available.");
  const regions = collectionDocuments(scene.regions).filter(isMiningRegion);
  let reset = 0;
  for (const region of regions) {
    await resetMiningRegion(region);
    reset++;
  }
  refreshMiningRegionInteractivity();
  return { scene, reset };
}

export const api = Object.freeze({
  version: "0.1.4",
  catalog: Object.freeze({
    ores: ORE_CATALOG,
    order: ORE_ORDER,
    get: getOre,
    value: formatOreValue,
    createItemSource: createOreItemSource
  }),
  yieldForAthletics,
  configureRegion: configureMiningRegion,
  configureSelected: configureSelectedMiningRegion,
  resetRegion: resetMiningRegion,
  resetScene: resetMiningRegionsInScene,
  clearRegion: clearMiningRegion,
  readRegion: miningDepositData,
  isRegion: isMiningRegion,
  open: openMining,
  findPickaxe,
  installItems: installOreItems,
  openSetup: showSetupDialog,
  refreshInteractions: refreshMiningRegionInteractivity
});

Hooks.on("getSceneControlButtons", registerMiningRegionControl);

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
  refreshMiningRegionInteractivity();

  if (activeGM()) {
    void Promise.all([installOreItems(), ensureSetupMacro(), ensureResetSceneMacro()]).then(([items, macro, resetMacro]) => {
      if (items.created) {
        globalThis.ui?.notifications?.info?.(`Mining resources installed: ${items.created} ore item${items.created === 1 ? "" : "s"} added.`);
      }
      if (macro.created) {
        globalThis.ui?.notifications?.info?.(`${SETUP_MACRO_NAME} added to the Macro directory.`);
      }
      if (resetMacro.created) {
        globalThis.ui?.notifications?.info?.(`${RESET_SCENE_MACRO_NAME} added to the Macro directory.`);
      }
    }).catch(error => {
      console.error(`[${MODULE_ID}] Unable to install mining resources.`, error);
      globalThis.ui?.notifications?.error?.("Mining resources could not be installed.");
    });
  }
  Hooks.callAll(`${MODULE_ID}.ready`, api);
});

Hooks.on("canvasReady", () => {
  installMiningRegionInteraction();
  refreshMiningRegionInteractivity();
});

