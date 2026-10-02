/**
 * DiceBox page-main live bridge.
 *
 * This follows the bounded Dungeon Master's Forge harness pattern: one
 * loopback WebSocket, an exact world/GM boundary, fixed operations only, and
 * a short-lived preview token before the one approved installer operation.
 * It is deliberately opt-in and never accepts scripts, macros, arbitrary
 * document requests, or caller-supplied world identifiers.
 */

const MODULE_ID = "dicebox-campaign-helper";
const INSTALLER_KEY = "diceboxCampaignHelperInstall";
const BRIDGE_PROTOCOL = "dicebox-foundry-live-bridge/1";
const BRIDGE_URL = "ws://127.0.0.1:8797/dicebox-foundry";
const DEFAULT_WORLD_ID = "the-ballad-of-chauser-bill";
const PLAN_TTL_MS = 5 * 60 * 1000;
const RECONNECT_MS = 3 * 1000;
const ALLOWED_OPERATIONS = Object.freeze([
  "bridge.status",
  "helper.readiness",
  "ascendancy.preview",
  "ascendancy.install",
  "ascendancy.repair.preview",
  "ascendancy.repair",
  "ascendancy.snapshot",
  "harness.status"
]);

function shortError(error) {
  return String(error?.message ?? error ?? "Bridge request failed.")
    .replace(/[\r\n]+/g, " ").trim().slice(0, 480) || "Bridge request failed.";
}

function plainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function randomId() {
  if (typeof globalThis.foundry?.utils?.randomID === "function") return foundry.utils.randomID(20);
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

function activeGm(game) {
  const user = game?.user;
  const elected = game?.users?.activeGM;
  return Boolean(user?.isGM && user?.id && elected?.id && user.id === elected.id);
}

function options(game) {
  const settings = game?.settings;
  return {
    enabled: settings?.get?.(MODULE_ID, "enableMcpTestBridge") === true,
    harnessEnabled: settings?.get?.(MODULE_ID, "enableVerificationHarness") === true,
    isGM: game?.user?.isGM === true,
    activeGM: activeGm(game),
    worldId: String(game?.world?.id ?? ""),
    expectedWorldId: String(settings?.get?.(MODULE_ID, "verificationWorldId") ?? DEFAULT_WORLD_ID)
  };
}

function boundary(game) {
  const state = options(game);
  if (!state.enabled) return "Enable the DiceBox private bridge in the world settings.";
  if (!state.harnessEnabled) return "Enable the DiceBox verification harness before using the private bridge.";
  if (!state.isGM || !state.activeGM) return "Only the elected active GM may use the DiceBox private bridge.";
  if (state.worldId !== state.expectedWorldId) return `The bridge is restricted to world \"${state.expectedWorldId}\".`;
  return "";
}

function parseMessage(raw) {
  if (typeof raw !== "string") throw new Error("The bridge received a non-text request.");
  const value = JSON.parse(raw);
  if (!plainObject(value)) throw new Error("The bridge received an invalid request.");
  return value;
}

function summarizeSnapshot(game) {
  const scenes = Array.from(game?.scenes?.contents ?? []).flatMap(scene => {
    const marker = scene?.flags?.[MODULE_ID]?.managed;
    const packageId = marker?.packageId;
    if (marker?.owner !== MODULE_ID || typeof packageId !== "string" || !packageId.startsWith("dbx:package:")) return [];
    const owned = (collection, kind) => Array.from(collection?.contents ?? [])
      .filter(document => {
        const childMarker = document?.flags?.[MODULE_ID]?.managed;
        return childMarker?.owner === MODULE_ID && childMarker?.packageId === packageId;
      })
      .map(document => ({
        kind,
        semanticId: document.flags[MODULE_ID].managed.semanticId,
        binding: typeof document.uuid === "string" ? `redacted:${document.uuid.split(".").at(-1)}` : null
      }));
    return [{
      semanticId: marker.semanticId,
      binding: typeof scene.uuid === "string" ? `redacted:${scene.uuid.split(".").at(-1)}` : null,
      renderer: typeof scene.initialLevel?.background?.src === "string" ? scene.initialLevel.background.src : null,
      walls: owned(scene.walls, "wall"),
      regions: owned(scene.regions, "region")
    }];
  });
  return { status: "observed", packageId: MODULE_ID, scenes };
}

class DiceBoxFoundryLiveBridge {
  constructor({ gameState = globalThis.game, WebSocketClass = globalThis.WebSocket, now = () => Date.now() } = {}) {
    this.game = gameState;
    this.WebSocketClass = WebSocketClass;
    this.now = now;
    this.socket = null;
    this.started = false;
    this.state = "stopped";
    this.reason = "";
    this.retryTimer = null;
    this.plan = null;
  }

  status() {
    const state = options(this.game);
    return {
      protocol: BRIDGE_PROTOCOL,
      connected: this.socket?.readyState === this.WebSocketClass?.OPEN,
      state: this.state,
      reason: this.reason || boundary(this.game),
      worldId: state.worldId,
      expectedWorldId: state.expectedWorldId,
      activeGM: state.activeGM,
      pendingPreview: Boolean(this.plan && this.plan.expiresAt > this.now())
    };
  }

  start() {
    this.started = true;
    const blocked = boundary(this.game);
    if (blocked) {
      this.state = "blocked";
      this.reason = blocked;
      return this.status();
    }
    if (typeof this.WebSocketClass !== "function") {
      this.state = "blocked";
      this.reason = "This Foundry client does not provide WebSocket support.";
      return this.status();
    }
    if (this.socket && [this.WebSocketClass.CONNECTING, this.WebSocketClass.OPEN].includes(this.socket.readyState)) return this.status();
    this.state = "connecting";
    this.reason = "";
    try {
      const socket = new this.WebSocketClass(BRIDGE_URL);
      this.socket = socket;
      socket.addEventListener("open", () => this.#onOpen(socket));
      socket.addEventListener("message", event => void this.#onMessage(socket, event));
      socket.addEventListener("error", () => this.#onError(socket, "The local DiceBox bridge is unavailable."));
      socket.addEventListener("close", () => this.#onClose(socket));
    } catch (error) { this.#onError(null, shortError(error)); }
    return this.status();
  }

  stop() {
    this.started = false;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = null;
    const socket = this.socket;
    this.socket = null;
    if (socket && socket.readyState < this.WebSocketClass.CLOSING) socket.close(1000, "DiceBox bridge stopped");
    this.plan = null;
    this.state = "stopped";
    this.reason = "";
    return this.status();
  }

  restart() { this.stop(); return this.start(); }

  #onOpen(socket) {
    if (socket !== this.socket) return;
    const state = options(this.game);
    socket.send(JSON.stringify({ type: "hello", protocol: BRIDGE_PROTOCOL, moduleId: MODULE_ID, worldId: state.worldId, isGM: state.isGM }));
    this.state = "connected";
    this.reason = "";
  }

  #onError(socket, reason) {
    if (socket && socket !== this.socket) return;
    this.state = "disconnected";
    this.reason = reason;
  }

  #onClose(socket) {
    if (socket !== this.socket) return;
    this.socket = null;
    if (this.state !== "blocked" && this.state !== "stopped") {
      this.state = "disconnected";
      this.reason ||= "The local DiceBox bridge disconnected.";
    }
    if (this.started && !this.retryTimer && !boundary(this.game)) {
      this.retryTimer = setTimeout(() => { this.retryTimer = null; this.start(); }, RECONNECT_MS);
    }
  }

  async #onMessage(socket, event) {
    if (socket !== this.socket) return;
    let request;
    try {
      request = parseMessage(event.data);
      if (request.type !== "request" || !ALLOWED_OPERATIONS.includes(request.operation) || typeof request.id !== "string") throw new Error("The bridge rejected an unsupported request.");
      const result = await this.#dispatch(request.operation, request.args);
      socket.send(JSON.stringify({ type: "response", id: request.id, ok: true, result }));
    } catch (error) {
      socket.send(JSON.stringify({ type: "response", id: typeof request?.id === "string" ? request.id : "", ok: false, error: shortError(error) }));
    }
  }

  #assertBoundary() {
    const blocked = boundary(this.game);
    if (blocked) throw new Error(blocked);
  }

  #installer() {
    const installer = this.game?.[INSTALLER_KEY];
    if (!installer) throw new Error("The DiceBox Ascendancy installer is not ready in this Foundry client.");
    return installer;
  }

  async #dispatch(operation, args) {
    this.#assertBoundary();
    if (operation === "bridge.status") return this.status();
    if (operation === "harness.status") return { ...options(this.game), ready: !boundary(this.game), bridge: this.status() };
    if (operation === "helper.readiness") return this.game?.diceboxCampaignHelper?.query?.({ kind: "readiness-report" }) ?? { status: "unavailable" };
    if (operation === "ascendancy.preview" || operation === "ascendancy.repair.preview") {
      const gate = this.#installer().preview();
      if (!gate.pass) throw new Error(gate.failed.join(" "));
      const token = randomId();
      this.plan = { token, operation: operation === "ascendancy.repair.preview" ? "ascendancy.repair" : "ascendancy.install", expiresAt: this.now() + PLAN_TTL_MS };
      return { noWrite: true, operation, planToken: token, expiresAt: new Date(this.plan.expiresAt).toISOString(), gate };
    }
    if (operation === "ascendancy.install" || operation === "ascendancy.repair") {
      if (!plainObject(args) || args.approved !== true || args.planToken !== this.plan?.token || this.plan.operation !== operation || this.plan.expiresAt <= this.now()) throw new Error(`${operation} requires approved: true and the current matching preview token.`);
      this.plan = null;
      return operation === "ascendancy.repair" ? this.#installer().repair() : this.#installer().install();
    }
    if (operation === "ascendancy.snapshot") return summarizeSnapshot(this.game);
    throw new Error("The bridge rejected an unsupported operation.");
  }
}

function registerSettings(runtime) {
  if (typeof runtime.game?.settings?.register !== "function") return;
  const restart = () => { if (runtime.game?.ready) getBridge(runtime).restart(); };
  runtime.game.settings.register(MODULE_ID, "enableVerificationHarness", { name: "Enable DiceBox verification harness", hint: "Enables the bounded Campaign Helper live harness. It is limited to the configured world and elected GM.", scope: "world", config: true, type: Boolean, default: false, onChange: restart });
  runtime.game.settings.register(MODULE_ID, "enableMcpTestBridge", { name: "Enable DiceBox private MCP bridge", hint: "Connects this GM client only to the loopback DiceBox bridge. It accepts fixed preview/install/readback operations only; no scripts or arbitrary documents.", scope: "world", config: true, type: Boolean, default: false, onChange: restart });
  runtime.game.settings.register(MODULE_ID, "verificationWorldId", { name: "DiceBox verification world ID", hint: "The bridge refuses to run unless the active world ID exactly matches this value.", scope: "world", config: true, type: String, default: DEFAULT_WORLD_ID, onChange: restart });
}

const bridges = new WeakMap();
function getBridge(runtime = globalThis) {
  if (!bridges.has(runtime)) bridges.set(runtime, new DiceBoxFoundryLiveBridge({ gameState: runtime.game, WebSocketClass: runtime.WebSocket }));
  return bridges.get(runtime);
}

function expose(runtime) {
  if (!runtime.game || Object.prototype.hasOwnProperty.call(runtime.game, "diceboxCampaignHelperHarness")) return;
  Object.defineProperty(runtime.game, "diceboxCampaignHelperHarness", { configurable: false, enumerable: false, writable: false, value: Object.freeze({ status: () => getBridge(runtime).status(), start: () => getBridge(runtime).start(), stop: () => getBridge(runtime).stop(), restart: () => getBridge(runtime).restart() }) });
}

if (typeof globalThis.Hooks?.once === "function") {
  globalThis.Hooks.once("init", () => registerSettings(globalThis));
  globalThis.Hooks.once("ready", () => { expose(globalThis); if (boundary(globalThis.game)) getBridge(globalThis).state = "blocked"; else getBridge(globalThis).start(); });
}

export {
  ALLOWED_OPERATIONS,
  BRIDGE_PROTOCOL,
  BRIDGE_URL,
  DEFAULT_WORLD_ID,
  DiceBoxFoundryLiveBridge,
  boundary,
  options,
  summarizeSnapshot
};
