// CAV H-G06 FIREPLACE — PLAYER CLICK BEHAVIOR (Foundry 14.367), v001
// Embedded Region Execute Script. No Macro document, no player Macro permission.
// Execute Script behavior fires this source on: behaviorActivated, behaviorViewed,
// behaviorUnviewed, behaviorDeactivated. Click events are registered on the canvas.
// All Foundry document mutations are performed only on the elected active GM.
const KEY = "__CAV_HG06_FIREPLACE_SCRIPT_V001__";
const CHANNEL = "module.dicebox-campaign-helper";
const PROTOCOL = "cav.hg06.fireplace.v001";
const SCENE_ID = "CAVHG06GreatRoom";
const REGION_ID = "G0HM92QQtEfyZcFi";
const LIGHT_ID = "fuWonmPqjJX2SIVG";
const current = globalThis[KEY] ?? (globalThis[KEY] = {
  socketHandler: null, clickHandler: null, clickStage: null,
  modalOpen: false, busy: false, seen: new Map()
});
const evt = event?.name ?? "";
const removeClick = () => {
  if (current.clickHandler && current.clickStage) {
    current.clickStage.off("pointertap", current.clickHandler);
  }
  current.clickHandler = null;
  current.clickStage = null;
};
if (evt === "behaviorUnviewed" || evt === "behaviorDeactivated") {
  removeClick();
  if (evt === "behaviorDeactivated" && current.socketHandler) {
    game.socket.off(CHANNEL, current.socketHandler);
    current.socketHandler = null;
    delete globalThis[KEY];
  }
  return;
}
if (!["behaviorActivated", "behaviorViewed"].includes(evt)) return;
if (!game.ready || game.world?.id !== "cabin-in-the-ashen-veil") return;
if (scene?.id !== SCENE_ID || region?.id !== REGION_ID) return;
if (!game.modules.get("dicebox-campaign-helper")?.active) return;

const getScene = () => game.scenes.get(SCENE_ID);
const isActiveGM = () => Boolean(game.user?.isGM && game.users.activeGM?.id === game.user.id);
const hasTinderbox = actor => Boolean(actor?.items?.contents?.some(item =>
  /^tinder[\s-]*box(?:\b|$)/i.test(item.name?.trim() ?? "") &&
  Number(item.system?.quantity ?? 1) > 0
));
const actorForToken = (tokenId, user) => {
  const t = getScene()?.tokens.get(tokenId);
  const a = t?.actor;
  if (!a || a.type !== "character" || !a.testUserPermission(user, "OWNER")) return null;
  return a;
};
// The GM socket listener persists while visiting another Scene and is installed
// whenever this behavior is activated/viewed in the currently open world.
if (!current.socketHandler) {
  current.socketHandler = async (data) => {
    if (!data || data.protocol !== PROTOCOL || data.kind !== "request" || !isActiveGM()) return;
    if (current.busy) return;
    if (typeof data.nonce !== "string" || !/^[A-Za-z0-9]{8,40}$/.test(data.nonce)) return;
    if (data.sceneId !== SCENE_ID || data.regionId !== REGION_ID ||
        data.lightId !== LIGHT_ID || !["light", "extinguish"].includes(data.action)) return;
    const user = game.users.get(data.userId);
    if (!user?.active || !data.tokenId || typeof data.tokenId !== "string") return;
    const actor = actorForToken(data.tokenId, user);
    if (!actor) return;
    const key = data.userId + ":" + data.nonce;
    if (current.seen.has(key)) return;
    current.seen.set(key, Date.now());
    if (current.seen.size > 80) {
      const oldest = current.seen.keys().next().value;
      current.seen.delete(oldest);
    }
    const reply = (success, message, nowLit) =>
      game.socket.emit(CHANNEL, {
        protocol: PROTOCOL, kind: "result", nonce: data.nonce,
        userId: user.id, success, message, nowLit
      });
    const light = getScene()?.lights.get(LIGHT_ID);
    if (!light) return void reply(false, "The fireplace light is unavailable.", null);
    const lit = !light.hidden;
    if (data.action === "light" && lit) return void reply(false, "The fireplace is already lit.", true);
    if (data.action === "extinguish" && !lit) return void reply(false, "The fireplace is already out.", false);
    // Lighting requires a carried, nonzero-quantity Tinderbox. Not consumed.
    if (data.action === "light" && !hasTinderbox(actor)) {
      return void reply(false, "Requires Tinderbox in your character's inventory.", false);
    }
    current.busy = true;
    try {
      await light.update({hidden: data.action === "extinguish"});
      const live = getScene()?.lights.get(LIGHT_ID);
      const nowLit = live ? !live.hidden : null;
      if (nowLit !== (data.action === "light")) {
        await reply(false, "The fireplace state could not be verified.", nowLit);
      } else {
        await reply(true, nowLit ? "You light the old wood. The hearth catches fire." :
          "You put out the fireplace.", nowLit);
      }
    } catch (err) {
      console.error("[CAV Fireplace] Light toggle failed", err);
      await reply(false, "The fire could not be changed. Ask the GM to check the light.", !light.hidden);
    } finally {
      current.busy = false;
    }
  };
  game.socket.on(CHANNEL, current.socketHandler);
}
// No click registration when this Scene isn't currently viewed.
if (canvas.scene?.id !== SCENE_ID || !canvas.stage) return;
if (current.clickHandler && current.clickStage !== canvas.stage) removeClick();
if (current.clickHandler) return;
current.clickHandler = async (pointer) => {
  if (current.modalOpen || canvas.scene?.id !== SCENE_ID) return;
  const r = getScene()?.regions.get(REGION_ID);
  const light = getScene()?.lights.get(LIGHT_ID);
  if (!r || !light || !pointer?.global) return;
  const pos = canvas.stage.toLocal(pointer.global);
  if (!Number.isFinite(pos.x) || !Number.isFinite(pos.y)) return;
  // Geometric hit-test is independent of Region-outline visibility, token
  // vision, fog and which canvas tool/layer is active.
  if (!r.testPoint({x:pos.x, y:pos.y, elevation:0})) return;
  current.modalOpen = true;
  try {
    const lit = !light.hidden;
    const description = lit ?
      "The old wood is burning in the fireplace." :
      "The wood in the fireplace is old and dry, but it should still burn.";
    const question = lit ?
      "Do you wish to put out the fire?" :
      "Do you wish to light the fire?";
    const requirement = lit ? "" :
      '<p style="font-size:0.85em"><strong>Required: Tinderbox</strong></p>';
    const approved = await foundry.applications.api.DialogV2.confirm({
      window: {title: "Great Room Fireplace"},
      content: "<p>" + description + "</p><p>" + question + "</p>" + requirement,
      yes: {label: lit ? "Put Out Fire" : "Light Fire"},
      no: {label: "Cancel"}
    });
    if (!approved) return;
    // The acting character must have a Token in this same Scene. Controlled
    // owned token takes priority; fall back to the user's assigned character.
    const user = game.user;
    const tokens = getScene().tokens.contents.filter(t =>
      t.actor?.type === "character" && t.actor.testUserPermission(user, "OWNER"));
    let token = canvas.tokens.controlled.map(t => t.document).find(t =>
      tokens.some(candidate => candidate.id === t.id));
    token ??= tokens.find(t => t.actor?.id === user.character?.id);
    token ??= tokens.length === 1 ? tokens[0] : null;
    if (!token) {
      ui.notifications.warn("Select your character token in this Scene to use the fireplace.");
      return;
    }
    if (!lit && !hasTinderbox(token.actor)) {
      ui.notifications.warn("Required: Tinderbox in your character's inventory.");
      return;
    }
    const nonce = foundry.utils.randomID(16);
    const resultHandler = (msg) => {
      if (msg?.protocol !== PROTOCOL || msg?.kind !== "result" ||
          msg.userId !== user.id || msg.nonce !== nonce) return;
      game.socket.off(CHANNEL, resultHandler);
      ui.notifications[msg.success ? "info" : "warn"](msg.message);
    };
    game.socket.on(CHANNEL, resultHandler);
    await game.socket.emit(CHANNEL, {
      protocol: PROTOCOL, kind:"request", nonce, userId:user.id,
      sceneId:SCENE_ID, regionId:REGION_ID, lightId:LIGHT_ID,
      tokenId:token.id, action:lit ? "extinguish" : "light"
    });
  } catch(err) {
    console.error("[CAV Fireplace] Click interaction failed", err);
    ui.notifications.warn("The fireplace interaction could not open.");
  } finally {
    current.modalOpen = false;
  }
};
current.clickStage = canvas.stage;
current.clickStage.on("pointertap", current.clickHandler);
console.info("[CAV Fireplace] Region click behavior registered for user", game.user.id);
