import { MODULE_ID, ORE_CATALOG, ORE_ORDER, createOreItemSource, getOre, oreItemFlag } from "./catalog.js";

export const MINING_REGION_FLAG = "miningVein";
export const MINING_SOCKET = `module.${MODULE_ID}`;
export const MINING_VERSION = 1;
export const DEFAULT_PICK_NAMES = Object.freeze(["Miner's Pick", "Mining Pick", "Pickaxe"]);
export const MAX_ATTEMPTS = 5;

const waiting = new Map();
const regionLocks = new Map();
const pointerInstalled = new WeakSet();
const layerStates = new WeakMap();
let socketInstalled = false;
let interactionInstalled = false;
let layerHooksInstalled = false;

const docs = c => c?.values ? Array.from(c.values()) : Array.from(c ?? []);
const randomId = () => globalThis.foundry?.utils?.randomID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const clone = v => globalThis.foundry?.utils?.deepClone?.(v) ?? structuredClone(v);

function itemQuantity(item) {
  const raw = item?.system?.quantity ?? item?.quantity;
  return raw === undefined || raw === null ? 1 : Math.max(0, Number(raw) || 0);
}

function actorItems(actor) { return docs(actor?.items); }

export function hasMiningPick(actor, names = DEFAULT_PICK_NAMES) {
  if (!actor) return false;
  const exact = new Set(names.map(n => String(n).trim().toLowerCase()));
  return actorItems(actor).some(item => {
    if (itemQuantity(item) < 1) return false;
    if (item?.getFlag?.(MODULE_ID, "tool")?.kind === "pickaxe") return true;
    const name = String(item?.name ?? "").trim().toLowerCase();
    if (exact.has(name)) return true;
    return /\b(pickaxe|mining pick|miner['’]?s pick)\b/i.test(name);
  });
}

export function yieldForAthletics(total) {
  const value = Math.floor(Number(total) || 0);
  if (value < 10) return 0;
  if (value < 15) return 1;
  if (value < 20) return 2;
  if (value < 25) return 3;
  if (value < 30) return 4;
  return 5;
}

export function miningRegionData(region) {
  return region?.getFlag?.(MODULE_ID, MINING_REGION_FLAG)
    ?? region?.flags?.[MODULE_ID]?.[MINING_REGION_FLAG]
    ?? region?._source?.flags?.[MODULE_ID]?.[MINING_REGION_FLAG]
    ?? null;
}

export function isMiningRegion(region) {
  const config = miningRegionData(region);
  return Boolean(config?.enabled && getOre(config.oreId));
}

async function resolveUuid(uuid) {
  return globalThis.fromUuidSync?.(uuid) ?? await globalThis.fromUuid?.(uuid) ?? null;
}

async function resolveRegion(regionOrUuid) {
  if (regionOrUuid?.documentName === "Region") return regionOrUuid;
  if (regionOrUuid) {
    const doc = await resolveUuid(regionOrUuid);
    if (doc?.documentName === "Region") return doc;
  }
  const selected = globalThis.canvas?.regions?.controlled?.[0]?.document
    ?? globalThis.canvas?.regions?.placeables?.find(p => p.controlled)?.document;
  if (selected?.documentName === "Region") return selected;
  throw new Error("Select one Region on the Regions layer first.");
}

function selectedActor() {
  return globalThis.canvas?.tokens?.controlled?.[0]?.actor
    ?? globalThis.game?.user?.character
    ?? null;
}

export async function configureMiningRegion({ region: regionOrUuid, oreId, maxAttempts = MAX_ATTEMPTS } = {}) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can configure mining Regions.");
  const region = await resolveRegion(regionOrUuid);
  const ore = getOre(oreId);
  if (!ore) throw new Error(`Unknown ore type: ${oreId}.`);
  const previous = miningRegionData(region);
  const config = {
    version: MINING_VERSION,
    enabled: true,
    oreId: ore.id,
    maxAttempts: Math.max(1, Math.min(20, Math.floor(Number(maxAttempts) || MAX_ATTEMPTS))),
    attemptsUsed: previous?.oreId === ore.id ? Math.max(0, Number(previous.attemptsUsed) || 0) : 0,
    pickaxeNames: [...DEFAULT_PICK_NAMES]
  };
  await region.update({ [`flags.${MODULE_ID}.${MINING_REGION_FLAG}`]: config });
  return { region, config, ore };
}

export async function configureSelectedMiningRegion(oreId) {
  return configureMiningRegion({ oreId });
}

export async function clearMiningRegion(regionOrUuid) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can clear mining Regions.");
  const region = await resolveRegion(regionOrUuid);
  await region.update({ [`flags.${MODULE_ID}.${MINING_REGION_FLAG}`]: null });
  return region;
}

export async function resetMiningRegion(regionOrUuid) {
  if (!globalThis.game?.user?.isGM) throw new Error("Only a GM can reset mining Regions.");
  const region = await resolveRegion(regionOrUuid);
  const config = miningRegionData(region);
  if (!config) throw new Error("This Region is not configured as a mining vein.");
  await region.update({ [`flags.${MODULE_ID}.${MINING_REGION_FLAG}.attemptsUsed`]: 0 });
  return { region, attemptsUsed: 0, attemptsRemaining: Number(config.maxAttempts ?? MAX_ATTEMPTS) };
}

function activeGM() {
  return globalThis.game?.user?.isGM && globalThis.game?.users?.activeGM?.id === globalThis.game?.user?.id;
}

function send(payload) { globalThis.game?.socket?.emit?.(MINING_SOCKET, payload); }

async function awardOre(actor, ore, quantity) {
  if (quantity <= 0) return { success: true, awarded: 0, itemName: ore.name };
  const existing = actorItems(actor).find(item => oreItemFlag(item)?.oreId === ore.id);
  if (existing) {
    const next = itemQuantity(existing) + quantity;
    await existing.update({ "system.quantity": next });
    return { success: true, awarded: quantity, itemName: ore.name, totalQuantity: next, stacked: true };
  }
  const created = await actor.createEmbeddedDocuments("Item", [createOreItemSource(ore, quantity)]);
  return { success: true, awarded: quantity, itemName: ore.name, totalQuantity: quantity, item: created?.[0] ?? null };
}

function withRegionLock(key, task) {
  const prior = regionLocks.get(key) ?? Promise.resolve();
  const run = prior.catch(() => {}).then(task);
  regionLocks.set(key, run.finally(() => {
    if (regionLocks.get(key) === run) regionLocks.delete(key);
  }));
  return run;
}

async function resolveExtraction(payload, senderId) {
  const actor = await resolveUuid(payload.actorUuid);
  const region = await resolveUuid(payload.regionUuid);
  const sender = globalThis.game?.users?.get?.(senderId) ?? docs(globalThis.game?.users).find(u => u?.id === senderId);
  if (!actor || actor.documentName !== "Actor" || !region || region.documentName !== "Region" || !sender) {
    return { success: false, message: "Mining request could not be validated." };
  }
  if (!actor.testUserPermission?.(sender, "OWNER")) return { success: false, message: "You do not own that mining character." };
  return withRegionLock(region.uuid, async () => {
    const config = miningRegionData(region);
    const ore = getOre(config?.oreId);
    if (!config?.enabled || !ore) return { success: false, message: "This deposit is not configured for mining." };
    if (!hasMiningPick(actor, config.pickaxeNames ?? DEFAULT_PICK_NAMES)) return { success: false, message: "You need a mining pick or pickaxe in your inventory." };
    const used = Math.max(0, Math.floor(Number(config.attemptsUsed) || 0));
    const max = Math.max(1, Math.floor(Number(config.maxAttempts) || MAX_ATTEMPTS));
    if (used >= max) return { success: false, depleted: true, message: `${ore.name} vein is depleted.` };
    const total = Math.floor(Number(payload.athleticsTotal) || 0);
    if (!Number.isFinite(total)) return { success: false, message: "The Athletics result was invalid." };
    const yieldQty = yieldForAthletics(total);
    const nextUsed = used + 1;
    await region.update({ [`flags.${MODULE_ID}.${MINING_REGION_FLAG}.attemptsUsed`]: nextUsed });
    const reward = await awardOre(actor, ore, yieldQty);
    return {
      success: true,
      oreId: ore.id,
      oreName: ore.name,
      athleticsTotal: total,
      awarded: reward.awarded,
      attemptsUsed: nextUsed,
      attemptsRemaining: Math.max(0, max - nextUsed),
      depleted: nextUsed >= max
    };
  });
}

async function socketHandler(payload, senderId) {
  if (!payload || typeof payload !== "object") return;
  if (payload.action === "mining-result") {
    if (payload.recipientId && payload.recipientId !== globalThis.game?.user?.id) return;
    const pending = waiting.get(payload.requestId);
    if (!pending) return;
    waiting.delete(payload.requestId);
    pending.resolve(payload.result);
    return;
  }
  if (!activeGM() || payload.action !== "mining-extract") return;
  let result;
  try { result = await resolveExtraction(payload, senderId); }
  catch (error) { result = { success: false, message: error?.message ?? String(error) }; }
  send({ action: "mining-result", requestId: payload.requestId, recipientId: payload.userId ?? senderId, result });
}

export function installMiningSocket() {
  if (socketInstalled || !globalThis.game?.socket?.on) return false;
  globalThis.game.socket.on(MINING_SOCKET, (payload, senderId) => { void socketHandler(payload, senderId); });
  socketInstalled = true;
  return true;
}

function requestExtraction(actor, region, athleticsTotal) {
  if (!globalThis.game?.users?.activeGM) return Promise.resolve({ success: false, message: "A GM must be connected to resolve mining." });
  installMiningSocket();
  const requestId = randomId();
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      waiting.delete(requestId);
      resolve({ success: false, message: "The active GM did not respond to the mining request." });
    }, 8000);
    waiting.set(requestId, { resolve: result => { clearTimeout(timer); resolve(result); } });
    send({ action: "mining-extract", requestId, actorUuid: actor.uuid, regionUuid: region.uuid, athleticsTotal, userId: globalThis.game?.user?.id });
  });
}

export async function mineRegion({ region: regionOrUuid, actor: actorOrUuid } = {}) {
  const region = await resolveRegion(regionOrUuid);
  const config = miningRegionData(region);
  const ore = getOre(config?.oreId);
  if (!config?.enabled || !ore) throw new Error("This Region is not configured as an ore vein.");
  const actor = actorOrUuid?.documentName === "Actor" ? actorOrUuid : actorOrUuid ? await resolveUuid(actorOrUuid) : selectedActor();
  if (!actor) throw new Error("Select a token or assign a character before mining.");
  if (!actor.isOwner && !actor.testUserPermission?.(globalThis.game?.user, "OWNER")) throw new Error("You do not own that character.");
  if (!hasMiningPick(actor, config.pickaxeNames ?? DEFAULT_PICK_NAMES)) throw new Error("You need a mining pick or pickaxe in your inventory.");

  const used = Math.max(0, Number(config.attemptsUsed) || 0);
  const max = Math.max(1, Number(config.maxAttempts) || MAX_ATTEMPTS);
  if (used >= max) throw new Error(`${ore.name} vein is depleted.`);

  const rolls = await actor.rollSkill({ skill: "ath" });
  const roll = rolls?.[0] ?? null;
  if (!roll) return { success: false, cancelled: true, message: "Mining check cancelled." };
  const total = Number(roll.total);
  if (!Number.isFinite(total)) throw new Error("Could not read the Athletics roll total.");

  const result = globalThis.game?.user?.isGM
    ? await resolveExtraction({ actorUuid: actor.uuid, regionUuid: region.uuid, athleticsTotal: total }, globalThis.game.user.id)
    : await requestExtraction(actor, region, total);

  if (!result?.success) throw new Error(result?.message ?? "Mining failed.");
  const text = result.awarded > 0
    ? `${actor.name} extracts ${result.awarded} lb. of ${ore.name} (Athletics ${result.athleticsTotal}). ${result.attemptsRemaining} swing${result.attemptsRemaining === 1 ? "" : "s"} remain.`
    : `${actor.name}'s swing produces no usable ${ore.name} (Athletics ${result.athleticsTotal}). ${result.attemptsRemaining} swing${result.attemptsRemaining === 1 ? "" : "s"} remain.`;
  globalThis.ui?.notifications?.info?.(text);
  return result;
}

function shouldHandle() {
  if (globalThis.canvas?.regions?._placementContext) return false;
  const layer = String(globalThis.canvas?.activeLayer?.name ?? "").toLowerCase();
  return ["tokens", "tokenlayer"].includes(layer);
}

function canClick(placeable) {
  const region = placeable?.document ?? placeable;
  if (!region || !isMiningRegion(region) || !shouldHandle()) return false;
  if (placeable?.isPreview || region?.locked) return false;
  return region.testUserPermission?.(globalThis.game?.user, "OBSERVER") ?? true;
}

function handleClick(region, event) {
  if (!isMiningRegion(region) || !shouldHandle()) return false;
  const actor = selectedActor();
  event?.stopPropagation?.();
  void mineRegion({ region, actor }).catch(error => globalThis.ui?.notifications?.warn?.(error?.message ?? String(error)));
  return true;
}

function installPointer(placeable) {
  if (!placeable || pointerInstalled.has(placeable)) return;
  placeable.on?.("pointertap", event => {
    if (canClick(placeable)) handleClick(placeable.document, event);
  });
  pointerInstalled.add(placeable);
}

function refreshPlaceables() {
  for (const placeable of globalThis.canvas?.regions?.placeables ?? []) {
    if (isMiningRegion(placeable.document)) {
      installPointer(placeable);
      placeable._refreshVisibility?.();
      placeable._refreshState?.();
      if (canClick(placeable)) placeable.alpha = 0.001;
    }
  }
}

function enableInactiveRegionLayer() {
  const layer = globalThis.canvas?.regions;
  if (!layer || layer.active || !shouldHandle()) return;
  if (!layerStates.has(layer)) {
    layerStates.set(layer, {
      objects: layer.objects,
      objectsEventMode: layer.objects?.eventMode,
      objectsInteractiveChildren: layer.objects?.interactiveChildren,
      layerInteractiveChildren: layer.interactiveChildren
    });
  }
  if (layer.objects) {
    layer.objects.eventMode = "static";
    layer.objects.interactiveChildren = true;
  }
  layer.interactiveChildren = true;
  refreshPlaceables();
}

function restoreLayer() {
  const layer = globalThis.canvas?.regions;
  const state = layerStates.get(layer);
  if (!layer || !state) return;
  if (state.objects && state.objects === layer.objects) {
    state.objects.eventMode = state.objectsEventMode;
    state.objects.interactiveChildren = state.objectsInteractiveChildren;
  }
  if (!layer.active) layer.interactiveChildren = state.layerInteractiveChildren;
  layerStates.delete(layer);
}

function installLayerHooks() {
  if (layerHooksInstalled || !globalThis.Hooks?.on) return;
  const refresh = () => {
    if (shouldHandle()) enableInactiveRegionLayer();
    else restoreLayer();
    refreshPlaceables();
  };
  globalThis.Hooks.on("activateCanvasLayer", refresh);
  globalThis.Hooks.on("deactivateCanvasLayer", refresh);
  globalThis.Hooks.on("canvasReady", refresh);
  globalThis.Hooks.on("createRegion", refresh);
  globalThis.Hooks.on("updateRegion", refresh);
  globalThis.Hooks.on("deleteRegion", refresh);
  layerHooksInstalled = true;
  refresh();
}

export function installMiningRegionInteraction() {
  installLayerHooks();
  if (interactionInstalled) return true;
  const RegionClass = globalThis.CONFIG?.Region?.objectClass;
  if (!RegionClass) return false;
  class RegionwrightMiningRegion extends RegionClass {
    get isVisible() { return canClick(this) ? true : super.isVisible; }
    get isInteractable() { return canClick(this) ? true : super.isInteractable; }
    _refreshState() {
      super._refreshState();
      if (canClick(this)) this.alpha = 0.001;
    }
    _onClickLeft(event) {
      if (handleClick(this.document, event)) return false;
      return super._onClickLeft(event);
    }
  }
  Object.defineProperty(RegionwrightMiningRegion, "name", { value: "RegionwrightMiningRegion" });
  globalThis.CONFIG.Region.objectClass = RegionwrightMiningRegion;
  interactionInstalled = true;
  refreshPlaceables();
  return true;
}
