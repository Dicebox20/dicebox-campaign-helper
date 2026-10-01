import {
  BAIT_CATALOG,
  BIOME_ORDER,
  FISHING_BIOMES,
  createBaitItemSource,
  getBiomeBait,
  getFishingBiome,
  normalizeBiomeId
} from "./catalog.js";

const MODULE_ID = "regionwright-fishing";
const CORE_MODULE_ID = "regionwright";
const INJECTION_FLAG = "injection";
const INJECTION_VERSION = 1;

const rootFor = application => application?.element?.[0] ?? application?.element ?? null;
const escapeHTML = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function coreFishing() {
  const api = globalThis.game?.modules?.get?.(CORE_MODULE_ID)?.api?.fishing;
  if (!api?.configureRegion || !api?.open) throw new Error("Enable the Regionwright core module before using Fishing Biomes.");
  return api;
}

async function resolveRegion(regionOrUuid) {
  if (regionOrUuid?.documentName === "Region") return regionOrUuid;
  if (regionOrUuid) {
    const region = globalThis.fromUuidSync?.(regionOrUuid) ?? await globalThis.fromUuid?.(regionOrUuid);
    if (region?.documentName === "Region") return region;
  }
  const selected = globalThis.canvas?.regions?.controlled?.[0]?.document
    ?? globalThis.canvas?.regions?.placeables?.find(placeable => placeable.controlled)?.document;
  if (selected?.documentName === "Region") return selected;
  throw new Error("Select one Region on the Regions layer first.");
}

async function resolveActor(actorOrUuid) {
  if (actorOrUuid?.documentName === "Actor") return actorOrUuid;
  if (actorOrUuid) {
    const actor = globalThis.fromUuidSync?.(actorOrUuid) ?? await globalThis.fromUuid?.(actorOrUuid);
    if (actor?.documentName === "Actor") return actor;
  }
  return globalThis.canvas?.tokens?.controlled?.[0]?.actor
    ?? globalThis.game?.user?.character
    ?? null;
}

function selectedRegion() {
  return globalThis.canvas?.regions?.controlled?.[0]?.document
    ?? globalThis.canvas?.regions?.placeables?.find(placeable => placeable.controlled)?.document
    ?? null;
}

function injectionData(region) {
  return region?.getFlag?.(MODULE_ID, INJECTION_FLAG)
    ?? region?.flags?.[MODULE_ID]?.[INJECTION_FLAG]
    ?? region?._source?.flags?.[MODULE_ID]?.[INJECTION_FLAG]
    ?? null;
}

function biomeOptions(selectedId = "forest") {
  return BIOME_ORDER.map(id => `<option value="${id}" ${id === selectedId ? "selected" : ""}>${escapeHTML(FISHING_BIOMES[id].label)}</option>`).join("");
}

function baitOptions(biomeId, selectedId = null) {
  const definition = getFishingBiome(biomeId);
  return (definition?.baitIds ?? []).map(id => {
    const bait = BAIT_CATALOG[id];
    return `<option value="${id}" ${id === selectedId ? "selected" : ""}>${escapeHTML(bait?.name ?? id)}</option>`;
  }).join("");
}

function setupMarkup({ biomeId = "forest", baitId = null } = {}) {
  const definition = getFishingBiome(biomeId) ?? FISHING_BIOMES.forest;
  const selectedBait = baitId && definition.baitIds.includes(baitId) ? baitId : definition.baitIds[0];
  return `<form class="rw-fishing-injection-form">
    <p class="rw-fishing-injection-note">Choose an environment catalog, then inject its fish and preferred bait into the selected Region.</p>
    <label>Environment<select data-fishing-injection="biome">${biomeOptions(definition.id)}</select></label>
    <label>Bait<select data-fishing-injection="bait">${baitOptions(definition.id, selectedBait)}</select></label>
    <p class="rw-fishing-injection-summary" data-fishing-injection="summary">${escapeHTML(definition.summary)}</p>
  </form>`;
}

async function injectRegion({ region: regionOrUuid, biome = "forest", bait = null, poleItemName = "Fishing Pole" } = {}) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can inject a fishing biome into a Region.");
  const region = await resolveRegion(regionOrUuid);
  const definition = getFishingBiome(biome);
  if (!definition) throw new Error(`Unknown fishing environment: ${biome}.`);
  const baitDefinition = getBiomeBait(definition, bait);
  if (!baitDefinition) throw new Error(`No bait is configured for ${definition.label}.`);
  const core = coreFishing();
  const configured = await core.configureRegion({
    region,
    poleItemName,
    baitItemName: baitDefinition.name,
    fish: definition.fish
  });
  const injection = {
    version: INJECTION_VERSION,
    biomeId: definition.id,
    baitId: baitDefinition.id,
    baitItemName: baitDefinition.name
  };
  await region.setFlag(MODULE_ID, INJECTION_FLAG, injection);
  return { ...configured, definition, bait: baitDefinition, injection };
}

async function injectSelectedRegion(options = {}) {
  return injectRegion({ ...options, region: options.region ?? selectedRegion() });
}

async function clearRegion(regionOrUuid) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can clear an injected fishing Region.");
  const region = await resolveRegion(regionOrUuid);
  await coreFishing().clearRegion(region);
  await region.unsetFlag(MODULE_ID, INJECTION_FLAG);
  return region;
}

async function createBaitForActor({ actor: actorOrUuid, bait: baitOrId, quantity = 3 } = {}) {
  const actor = await resolveActor(actorOrUuid);
  if (!actor) throw new Error("Select a token or assign a character before creating bait.");
  if (!globalThis.game?.user?.isGM && actor.isOwner !== true && !actor.testUserPermission?.(globalThis.game?.user, "OWNER")) {
    throw new Error("You do not have permission to add bait to this actor.");
  }
  const baitDefinition = typeof baitOrId === "object" ? baitOrId : BAIT_CATALOG[String(baitOrId ?? "")];
  if (!baitDefinition) throw new Error("Choose a bait from the fishing catalog.");
  const items = Array.from(actor.items?.values?.() ?? actor.items ?? []);
  const existing = items.find(item => item?.getFlag?.(MODULE_ID, "bait")?.baitId === baitDefinition.id)
    ?? items.find(item => item?.name?.toLocaleLowerCase?.() === baitDefinition.name.toLocaleLowerCase());
  const amount = Math.max(1, Math.floor(Number(quantity) || 1));
  if (existing) {
    const current = Math.max(0, Number(existing.system?.quantity ?? 1) || 0);
    await existing.update({ "system.quantity": current + amount });
    return { actor, bait: baitDefinition, quantity: current + amount, item: existing };
  }
  const created = await actor.createEmbeddedDocuments("Item", [createBaitItemSource(baitDefinition, amount)]);
  return { actor, bait: baitDefinition, quantity: amount, item: created?.[0] ?? null };
}

async function openSetup() {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can inject a fishing biome into a Region.");
  const region = selectedRegion();
  if (!region) throw new Error("Select one Region on the Regions layer first.");
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (!DialogV2) throw new Error("Foundry's dialog system is unavailable.");
  const current = injectionData(region);
  const startingBiome = getFishingBiome(current?.biomeId)?.id ?? "forest";
  const startingBait = current?.baitId ?? null;
  return new Promise((resolve, reject) => {
    let dialog;
    dialog = new DialogV2({
      classes: ["regionwright", "rw-fishing-injection-dialog"],
      window: { title: "Inject Fishing Biome", icon: "fa-solid fa-fish", resizable: false },
      position: { width: 440, height: 390 },
      content: setupMarkup({ biomeId: startingBiome, baitId: startingBait }),
      buttons: [
        {
          action: "inject",
          label: "Inject Biome",
          icon: "fa-solid fa-syringe",
          default: true,
          callback: async () => {
            try {
              const root = rootFor(dialog);
              const biome = root?.querySelector?.('[data-fishing-injection="biome"]')?.value;
              const bait = root?.querySelector?.('[data-fishing-injection="bait"]')?.value;
              const result = await injectRegion({ region, biome, bait });
              globalThis.ui?.notifications?.info?.(`${result.definition.label} fishing injected with ${result.bait.name}.`);
              resolve(result);
              await dialog.close();
            } catch (error) {
              globalThis.ui?.notifications?.error?.(error.message ?? "Unable to inject the fishing biome.");
              reject(error);
            }
          }
        },
        { action: "close", label: "Cancel", icon: "fa-solid fa-xmark", callback: () => resolve(null) }
      ],
      close: () => resolve(null)
    });
    dialog._onRender = function(context, options) {
      DialogV2.prototype._onRender?.call(this, context, options);
      const root = rootFor(this);
      root?.addEventListener?.("change", event => {
        const control = event.target?.closest?.('[data-fishing-injection="biome"]');
        if (!control) return;
        const baitSelect = root.querySelector('[data-fishing-injection="bait"]');
        const summary = root.querySelector('[data-fishing-injection="summary"]');
        const definition = getFishingBiome(control.value);
        if (baitSelect && definition) baitSelect.innerHTML = baitOptions(definition.id);
        if (summary && definition) summary.textContent = definition.summary;
      });
    };
    const rendered = dialog.render({ force: true });
    rendered?.catch?.(reject);
  });
}

function findRegionControlGroup(controls) {
  return Array.isArray(controls)
    ? controls.find(entry => ["region", "regions"].includes(entry?.name))
    : controls?.regions ?? controls?.region;
}

function addControl(controls, tool) {
  const regionControls = findRegionControlGroup(controls);
  if (!regionControls?.tools) return;
  const tools = regionControls.tools;
  const exists = Array.isArray(tools) ? tools.some(entry => entry?.name === tool.name) : Boolean(tools[tool.name]);
  if (exists) return;
  const ordered = { ...tool, order: Array.isArray(tools) ? tools.length : Object.keys(tools).length };
  if (Array.isArray(tools)) tools.push(ordered);
  else tools[tool.name] = ordered;
}

export const api = Object.freeze({
  version: "0.1.0",
  catalog: Object.freeze({ biomes: FISHING_BIOMES, bait: BAIT_CATALOG, order: BIOME_ORDER, get: getFishingBiome, normalize: normalizeBiomeId }),
  inject: injectRegion,
  injectSelected: injectSelectedRegion,
  clear: clearRegion,
  read: injectionData,
  createBaitForActor,
  createBaitItemSource,
  openSetup
});

Hooks.once("init", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
});

Hooks.once("ready", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) module.api = api;
  Hooks.callAll(`${MODULE_ID}.ready`, api);
});

Hooks.on("getSceneControlButtons", controls => {
  if (!game.user?.isGM) return;
  addControl(controls, {
    name: `${MODULE_ID}-inject`,
    title: "Inject Fishing Biome",
    icon: "fa-solid fa-fish",
    button: true,
    visible: true,
    onChange: () => openSetup().catch(error => globalThis.ui?.notifications?.error?.(error.message ?? "Unable to open fishing injection."))
  });
});
