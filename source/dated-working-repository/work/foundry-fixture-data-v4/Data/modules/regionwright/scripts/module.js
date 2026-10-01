import { DIAGNOSTIC_SETTING, MODULE_ID, PREVIEW_SETTING, PUZZLE_WRITE_SETTING, STUDIO_DRAFT_SETTING, STUDIO_FACTS_SETTING, WRITE_SETTING } from "./constants.js";
import { createAPI } from "./api.js";
import { installLockpickDoorControl, installLockpickSocket } from "./lockpicking.js";
import { installPitfallSocket } from "./pitfall-trap.js";
import { installSceneMomentSocket } from "./studio-scene-moment.js";
import { installStoryFactSocket } from "./studio-story-fact.js";
import { installHubUnlockSocket } from "./studio-hub-unlock.js";
import { installBossEngine } from "./boss-engine.js";
import { requestPremiumCompanion } from "./premium-runtime-guard.js";
import { findRegionControlGroup, addRegionControlTool } from "./scene-control-registration.js";

const api = createAPI();

/** Foundry installations that evaluate only the first legacy esmodule still
 * need the companion runtime when the Studio manifest is installed. */
function loadPremiumCompanion() {
  const module = globalThis.game?.modules?.get?.(MODULE_ID);
  if (module?.title !== "Regionwright: Studio") return;
  if (!requestPremiumCompanion()) return;
  void import("../premium/scripts/premium-module.js").catch(error => console.error(`${MODULE_ID} premium companion failed to load.`, error));
}

/**
 * Socket listeners are client-local. Install them at every safe point in the
 * Foundry lifecycle because a player can finish loading after the initial
 * ready hook and must still be able to ask the active GM to perform writes.
 */
function installRuntimeSockets() {
  installLockpickSocket();
  installPitfallSocket();
  installSceneMomentSocket();
  installStoryFactSocket();
  installHubUnlockSocket();
  installBossEngine();
}

/**
 * Add Regionwright's guided Region Assistant where GMs already work with
 * Regions, while the main Builder also provides Puzzles & Traps.
 */
Hooks.on("getSceneControlButtons", controls => {
  const regionControls = findRegionControlGroup(controls);
  if (!regionControls?.tools) return;
  const visible = globalThis.game?.user?.isGM ?? false;
  [
    { name: MODULE_ID, title: "Regionwright: Puzzles & Traps", icon: "fa-solid fa-puzzle-piece", button: true, visible, onChange: () => api.openBuilder() },
    { name: `${MODULE_ID}-boss-engine`, title: "Prime Arachnid Boss Engine", icon: "fa-solid fa-spider", button: true, visible, onChange: () => api.boss.open() },
    { name: `${MODULE_ID}-ascendancy-handoff`, title: "Install Ascendancy Regionwright handoff", icon: "fa-solid fa-link", button: true, visible, onChange: () => api.premium?.ascendancy?.handoff?.open?.() },
    { name: `${MODULE_ID}-ascendancy-audit`, title: "Audit Ascendancy Regionwright handoff", icon: "fa-solid fa-clipboard-check", button: true, visible, onChange: () => api.premium?.ascendancy?.handoff?.audit?.() },
    { name: `${MODULE_ID}-ascendancy-readback`, title: "Read Ascendancy Regionwright handoff state", icon: "fa-solid fa-clipboard-check", button: true, visible, onChange: () => api.premium?.ascendancy?.handoff?.openReadback?.() }
  ].forEach(tool => addRegionControlTool(regionControls, tool));
});

Hooks.once("init", () => {
  loadPremiumCompanion();
  game.settings.register(MODULE_ID, WRITE_SETTING, {
    name: "Regionwright.Enable Region writes",
    hint: "Allow approved plans to create, update, or remove only Region Behaviors owned by this module. Disabled by default.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, PUZZLE_WRITE_SETTING, {
    name: "Regionwright.Enable Puzzle writes",
    hint: "Allow a GM to add or remove Regionwright lockpicking puzzles on selected Doors. Disabled by default.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, DIAGNOSTIC_SETTING, {
    name: "Regionwright.Enable diagnostic logging",
    hint: "Show non-mutating capability and selection diagnostics in the browser console when requested from the Builder.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, PREVIEW_SETTING, {
    name: "Regionwright.Preview detail",
    hint: "Choose how much serialized plan detail the Builder shows during review.",
    scope: "client",
    config: true,
    type: String,
    choices: { compact: "Compact", detailed: "Detailed" },
    default: "detailed"
  });

  game.settings.register(MODULE_ID, STUDIO_DRAFT_SETTING, {
    name: "Regionwright.Studio draft",
    hint: "Module-owned Studio blueprint draft storage. This does not modify Regions or other Scene documents.",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  game.settings.register(MODULE_ID, STUDIO_FACTS_SETTING, {
    name: "Regionwright.Studio story facts",
    hint: "Module-owned progress facts for Studio activities. Only Regionwright changes this setting.",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  installRuntimeSockets();
  console.info(`${MODULE_ID} initialized. Region writes remain disabled until explicitly enabled by a GM.`);
});

Hooks.once("ready", () => {
  loadPremiumCompanion();
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  installRuntimeSockets();
  installLockpickDoorControl();
  Hooks.callAll(`${MODULE_ID}.ready`, api);
  console.info(`${MODULE_ID} ready.`, api.capabilities());
});

Hooks.on("canvasReady", () => {
  installRuntimeSockets();
  installLockpickDoorControl();
});
