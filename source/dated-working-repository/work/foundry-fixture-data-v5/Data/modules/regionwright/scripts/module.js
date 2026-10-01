import { DIAGNOSTIC_SETTING, MODULE_ID, PREVIEW_SETTING, PUZZLE_WRITE_SETTING, STUDIO_DRAFT_SETTING, STUDIO_FACTS_SETTING, WRITE_SETTING } from "./constants.js";
import { createAPI } from "./api.js";
import { installLockpickDoorControl, installLockpickSocket } from "./lockpicking.js";
import { installPitfallSocket } from "./pitfall-trap.js";
import { installSceneMomentSocket } from "./studio-scene-moment.js";
import { installStoryFactSocket } from "./studio-story-fact.js";
import { installHubUnlockSocket } from "./studio-hub-unlock.js";
import { installBossEngine } from "./boss-engine.js";
import { PREMIUM_RUNTIME_CACHE_KEY, requestPremiumCompanion } from "./premium-runtime-guard.js?rw-0.1.5-20260907-identity-1";
import { invokeBalladControl } from "./ballad-control-dispatch.mjs";

const api = createAPI();

/** Foundry installations that evaluate only the first legacy esmodule still
 * need the companion runtime when the Studio manifest is installed. */
function loadPremiumCompanion() {
  const module = globalThis.game?.modules?.get?.(MODULE_ID);
  if (module?.title !== "Regionwright: Studio") return;
  if (!requestPremiumCompanion()) return;
  void import(`../premium/scripts/premium-module.js?${PREMIUM_RUNTIME_CACHE_KEY}`).catch(error => console.error(`${MODULE_ID} premium companion failed to load.`, error));
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
  const regionControls = controls.regions;
  if (!regionControls?.tools) return;
  if (!regionControls.tools[MODULE_ID]) {
    regionControls.tools[MODULE_ID] = {
      name: MODULE_ID,
      title: "Regionwright: Puzzles & Traps",
      icon: "fa-solid fa-puzzle-piece",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => api.openBuilder()
    };
  }
  const bossToolName = `${MODULE_ID}-boss-engine`;
  if (!regionControls.tools[bossToolName]) {
    regionControls.tools[bossToolName] = {
      name: bossToolName,
      title: "Prime Arachnid Boss Engine",
      icon: "fa-solid fa-spider",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => api.boss.open()
    };
  }
  const ascendancyToolName = `${MODULE_ID}-ascendancy-handoff`;
  if (!regionControls.tools[ascendancyToolName]) {
    regionControls.tools[ascendancyToolName] = {
      name: ascendancyToolName,
      title: "Install Ascendancy Regionwright handoff",
      icon: "fa-solid fa-link",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => api.premium?.ascendancy?.handoff?.open?.()
    };
  }
  const ascendancyAuditToolName = `${MODULE_ID}-ascendancy-audit`;
  if (!regionControls.tools[ascendancyAuditToolName]) {
    regionControls.tools[ascendancyAuditToolName] = {
      name: ascendancyAuditToolName,
      title: "Audit Ascendancy Regionwright handoff",
      icon: "fa-solid fa-clipboard-check",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => api.premium?.ascendancy?.handoff?.audit?.()
    };
  }
  const ascendancyIdentityToolName = `${MODULE_ID}-ascendancy-identity`;
  if (!regionControls.tools[ascendancyIdentityToolName]) {
    regionControls.tools[ascendancyIdentityToolName] = {
      name: ascendancyIdentityToolName,
      title: "Audit Regionwright premium loaded identity",
      icon: "fa-solid fa-fingerprint",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => api.premium?.ascendancy?.handoff?.loadedIdentity?.open?.()
    };
  }
  const balladPreviewToolName = `${MODULE_ID}-ascendancy-ballad-preview`;
  if (!regionControls.tools[balladPreviewToolName]) {
    regionControls.tools[balladPreviewToolName] = {
      name: balladPreviewToolName,
      title: "Preview Ballad Ascendancy bindings",
      icon: "fa-solid fa-eye",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => invokeBalladControl(api, "openPreview")
    };
  }
  const balladAuditToolName = `${MODULE_ID}-ascendancy-ballad-audit`;
  if (!regionControls.tools[balladAuditToolName]) {
    regionControls.tools[balladAuditToolName] = {
      name: balladAuditToolName,
      title: "Audit Ballad Ascendancy bindings",
      icon: "fa-solid fa-clipboard-check",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => invokeBalladControl(api, "openAudit")
    };
  }
  const balladApplyToolName = `${MODULE_ID}-ascendancy-ballad-apply`;
  if (!regionControls.tools[balladApplyToolName]) {
    regionControls.tools[balladApplyToolName] = {
      name: balladApplyToolName,
      title: "Apply reviewed Ballad Ascendancy bindings",
      icon: "fa-solid fa-link",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => invokeBalladControl(api, "openApply")
    };
  }
  const balladMacroToolName = `${MODULE_ID}-ascendancy-ballad-macros`;
  if (!regionControls.tools[balladMacroToolName]) {
    regionControls.tools[balladMacroToolName] = {
      name: balladMacroToolName,
      title: "Install Ballad GM transport macros",
      icon: "fa-solid fa-scroll",
      order: Object.keys(regionControls.tools).length,
      button: true,
      visible: globalThis.game?.user?.isGM ?? false,
      onChange: () => invokeBalladControl(api, "openEnsureInjectionMacros")
    };
  }
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
