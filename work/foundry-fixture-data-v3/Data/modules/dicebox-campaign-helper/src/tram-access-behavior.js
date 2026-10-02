/**
 * Native Foundry v14 Tram access behavior.
 *
 * Region events are broadcast to every connected client. This subtype opens
 * the local Rush Hour dialog only on the client whose user caused tokenEnter.
 * It owns no puzzle state and performs no document mutation while handling an
 * event.
 */
const MODULE_ID = "dicebox-campaign-helper";
const TYPE = `${MODULE_ID}.tramAccess`;
const EXACT_WORLD_ID = "dbx-test-world";
const EXACT_FOUNDRY_VERSION = "14.367";
const EXACT_SYSTEM_ID = "dnd5e";
const EXACT_SYSTEM_VERSION = "5.3.3";
const TOKEN_ENTER = "tokenEnter";

export const TRAM_ACCESS = Object.freeze({
  type: TYPE,
  action: "andrew-routing",
  regionStableId: "dbx:region:tram-andrew-routing",
  behaviorStableId: "dbx:behavior:tram-andrew-routing",
  actorStableIds: Object.freeze(["dbx:actor:andrew-mcconaughey"]),
});

function managedSemanticId(document) {
  return document?.flags?.[MODULE_ID]?.managed?.semanticId
    ?? document?.flags?.[MODULE_ID]?.semanticId
    ?? null;
}

export function resolveActorStableId(actor) {
  const semanticId = managedSemanticId(actor);
  return typeof semanticId === "string" && semanticId.startsWith("dbx:actor:") ? semanticId : null;
}

function exactRuntime(runtime) {
  return runtime.game?.world?.id === EXACT_WORLD_ID
    && runtime.game?.version === EXACT_FOUNDRY_VERSION
    && runtime.game?.system?.id === EXACT_SYSTEM_ID
    && runtime.game?.system?.version === EXACT_SYSTEM_VERSION;
}

export async function dispatchTramAccessEvent({ runtime = globalThis, system, region, event } = {}) {
  if (!exactRuntime(runtime)) return Object.freeze({ status: "BLOCKED", reason: "wrong-runtime" });
  if (event?.name !== TOKEN_ENTER) return Object.freeze({ status: "IGNORED", reason: "event-not-allowed" });
  if (!event?.user?.id || event.user.id !== runtime.game?.user?.id) return Object.freeze({ status: "IGNORED", reason: "not-origin-client" });
  if (system?.action !== TRAM_ACCESS.action || system?.regionStableId !== TRAM_ACCESS.regionStableId) return Object.freeze({ status: "BLOCKED", reason: "binding-not-allowlisted" });
  if (managedSemanticId(region) !== TRAM_ACCESS.regionStableId) return Object.freeze({ status: "BLOCKED", reason: "region-marker-mismatch" });
  const actorStableId = resolveActorStableId(event?.data?.token?.actor);
  const allowed = new Set(system?.actorStableIds ?? []);
  if (!actorStableId || !allowed.has(actorStableId) || !TRAM_ACCESS.actorStableIds.includes(actorStableId)) {
    return Object.freeze({ status: "BLOCKED", reason: "actor-not-authorized", actorStableId });
  }
  const open = runtime.game?.diceboxTramRushHour?.openForRegionEvent;
  if (typeof open !== "function") return Object.freeze({ status: "BLOCKED", reason: "rush-hour-api-unavailable" });
  await open();
  return Object.freeze({ status: "PASS", action: TRAM_ACCESS.action, actorStableId, noWrite: true });
}

export function createTramAccessBehaviorType(runtime = globalThis) {
  const Base = runtime.foundry?.data?.regionBehaviors?.RegionBehaviorType;
  const fields = runtime.foundry?.data?.fields;
  if (typeof Base !== "function" || !fields?.StringField || !fields?.SetField) return null;
  return class TramAccessRegionBehaviorType extends Base {
    static LOCALIZATION_PREFIXES = ["DICEBOX.TramAccess"];
    static defineSchema() {
      return {
        events: this._createEventsField({ events: [TOKEN_ENTER], initial: [TOKEN_ENTER] }),
        action: new fields.StringField({ required: true, blank: false, choices: { [TRAM_ACCESS.action]: "Andrew Rush Hour routing" } }),
        regionStableId: new fields.StringField({ required: true, blank: false }),
        actorStableIds: new fields.SetField(new fields.StringField({ required: true, blank: false })),
      };
    }
    async _handleRegionEvent(event) {
      try {
        return await dispatchTramAccessEvent({ runtime, system: this, region: this.region, event });
      } catch (error) {
        runtime.console?.error?.("DiceBox Tram access rejected", error);
        runtime.ui?.notifications?.error?.("DiceBox Tram Rush Hour could not open. Check the browser console.");
        return Object.freeze({ status: "UNKNOWN", reason: String(error?.message ?? error) });
      }
    }
  };
}

export function registerTramAccessBehavior(runtime = globalThis) {
  const BehaviorType = createTramAccessBehaviorType(runtime);
  const registry = runtime.CONFIG?.RegionBehavior?.dataModels;
  if (!BehaviorType || !registry) return Object.freeze({ status: "BLOCKED", type: TYPE });
  if (registry[TYPE] && registry[TYPE] !== BehaviorType) return Object.freeze({ status: "BLOCKED", type: TYPE, reason: "duplicate-registration" });
  registry[TYPE] = BehaviorType;
  runtime.CONFIG.RegionBehavior.typeLabels ??= {};
  runtime.CONFIG.RegionBehavior.typeIcons ??= {};
  runtime.CONFIG.RegionBehavior.typeLabels[TYPE] = "DiceBox Tram access";
  runtime.CONFIG.RegionBehavior.typeIcons[TYPE] = "fa-solid fa-train-tram";
  return Object.freeze({ status: "PASS", type: TYPE });
}

if (typeof globalThis.Hooks?.once === "function") {
  globalThis.Hooks.once("init", () => registerTramAccessBehavior(globalThis));
}

export { MODULE_ID, TYPE };
