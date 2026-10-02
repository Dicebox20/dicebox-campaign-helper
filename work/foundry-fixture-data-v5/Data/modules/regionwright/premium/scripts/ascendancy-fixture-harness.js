import { MODULE_ID } from "./constants.js";
import { ASCENDANCY_FLAG } from "./ascendancy.js?rw-0.1.5-20260822-minigames-3";
import { createAscendancyState, validateAscendancyState } from "./ascendancy-engine.js";
import { claimPremiumStage } from "../../scripts/premium-runtime-guard.js";

export const ASCENDANCY_FIXTURE_HARNESS_VERSION = "1.1.0";
export const ASCENDANCY_FIXTURE_WORLD_ID = "dbx-test-world";
export const ASCENDANCY_FIXTURE_TARGET = Object.freeze({ foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
export const ASCENDANCY_FIXTURE_OPERATIONS = Object.freeze({
  STATUS: "status",
  PREVIEW_FULL_RESET: "preview-full-owned-reset",
  APPLY_FULL_RESET: "apply-full-owned-reset"
});

const HELPER_MODULE_ID = "dicebox-campaign-helper";
const HELPER_FLAG = "managed";
const HELPER_PACKAGE_ID = "dbx:package:chauser-bill-prime-arachnid-aftermath";
const RESET_PLAN_TTL_MS = 5 * 60 * 1000;
const RESET_DIAGNOSTIC_STORAGE_KEY = "regionwright.ascendancy.fixture.reset.v1";
const ROOM_IDS = Object.freeze([
  "dbx:room:signal-frequency-chamber",
  "dbx:room:ascendancy-tram-depot",
  "dbx:room:rune-mechanism-chamber",
  "dbx:room:central-core-control-chamber"
]);
const STATE_KEYS = new Set(["version", "sceneUuid", "seed", "puzzles", "pairs", "trams", "data", "finalActivation"]);
const clone = value => structuredClone(value);
const contents = collection => Array.isArray(collection) ? collection : Array.isArray(collection?.contents) ? collection.contents : collection?.values ? [...collection.values()] : [];
const now = runtime => Number(runtime?.Date?.now?.() ?? Date.now());
const randomId = runtime => runtime?.foundry?.utils?.randomID?.() ?? `${now(runtime)}-${Math.random().toString(36).slice(2)}`;
const helperMarker = scene => scene?.getFlag?.(HELPER_MODULE_ID, HELPER_FLAG) ?? scene?.flags?.[HELPER_MODULE_ID]?.[HELPER_FLAG] ?? null;
const stateFlag = scene => scene?.getFlag?.(MODULE_ID, ASCENDANCY_FLAG) ?? scene?.flags?.[MODULE_ID]?.[ASCENDANCY_FLAG] ?? null;
const activeGM = runtime => Boolean(runtime?.game?.user?.isGM && runtime?.game?.users?.activeGM?.id === runtime.game.user.id);

function target(runtime) {
  return {
    worldId: runtime?.game?.world?.id ?? null,
    foundryVersion: runtime?.game?.version ?? null,
    systemId: runtime?.game?.system?.id ?? null,
    systemVersion: runtime?.game?.system?.version ?? null,
    activeGm: activeGM(runtime)
  };
}

function gate(runtime) {
  const observed = target(runtime);
  const failed = [];
  if (observed.worldId !== ASCENDANCY_FIXTURE_WORLD_ID) failed.push(`fixture harness requires world ${ASCENDANCY_FIXTURE_WORLD_ID}`);
  if (observed.foundryVersion !== ASCENDANCY_FIXTURE_TARGET.foundryVersion) failed.push(`fixture harness requires Foundry ${ASCENDANCY_FIXTURE_TARGET.foundryVersion}`);
  if (observed.systemId !== ASCENDANCY_FIXTURE_TARGET.systemId || observed.systemVersion !== ASCENDANCY_FIXTURE_TARGET.systemVersion) failed.push("fixture harness requires dnd5e 5.3.3");
  if (!observed.activeGm) failed.push("fixture harness requires the elected active GM");
  return { pass: failed.length === 0, failed, observed };
}

function fixtureScenes(runtime) {
  const scenes = contents(runtime?.game?.scenes).filter(scene => ROOM_IDS.includes(helperMarker(scene)?.semanticId));
  if (scenes.length !== ROOM_IDS.length) throw new Error("Fixture harness requires exactly four helper-owned Ascendancy Scenes.");
  const seen = new Set();
  for (const scene of scenes) {
    const marker = helperMarker(scene);
    if (seen.has(marker.semanticId) || marker.owner !== HELPER_MODULE_ID || marker.packageId !== HELPER_PACKAGE_ID) throw new Error("Fixture Scene markers are missing, duplicated, or not the exact helper package.");
    seen.add(marker.semanticId);
  }
  return ROOM_IDS.map(roomId => scenes.find(scene => helperMarker(scene)?.semanticId === roomId));
}

function unknownStateKeys(state) {
  return Object.keys(state ?? {}).filter(key => !STATE_KEYS.has(key));
}

function stateSummary(scene, state) {
  const puzzles = Object.fromEntries(Object.entries(state?.puzzles ?? {}).map(([id, puzzle]) => [id, { state: puzzle.state, complete: puzzle.complete, openedAt: puzzle.openedAt, completedAt: puzzle.completedAt }]));
  const pairs = Object.fromEntries(Object.entries(state?.pairs ?? {}).map(([id, pair]) => [id, { complete: pair.complete, completedAt: pair.completedAt, cooperativeComplete: pair.cooperativeComplete === true }]));
  return {
    sceneUuid: scene?.uuid ?? null,
    sceneUuidInState: state?.sceneUuid ?? null,
    seed: state?.seed ?? null,
    puzzles,
    pairs,
    finalActivation: clone(state?.finalActivation ?? null),
    runtimeKeys: Object.keys(state?.data ?? {}).sort(),
    tramIds: Object.keys(state?.trams ?? {}).sort()
  };
}

function protectedSnapshot(scene) {
  const flags = clone(scene?.flags ?? {});
  if (flags[MODULE_ID] && typeof flags[MODULE_ID] === "object") delete flags[MODULE_ID][ASCENDANCY_FLAG];
  const regions = contents(scene?.regions).map(region => ({ id: region.id ?? null, uuid: region.uuid ?? null, flags: clone(region.flags ?? {}) }));
  const walls = contents(scene?.walls).map(wall => ({ id: wall.id ?? null, uuid: wall.uuid ?? null, flags: clone(wall.flags ?? {}) }));
  const tiles = contents(scene?.tiles).map(tile => ({ id: tile.id ?? null, uuid: tile.uuid ?? null, flags: clone(tile.flags ?? {}) }));
  const tokens = contents(scene?.tokens).map(token => ({ id: token.id ?? null, uuid: token.uuid ?? null, flags: clone(token.flags ?? {}) }));
  return { flags, regions, walls, tiles, tokens };
}

function readScene(scene) {
  const state = stateFlag(scene);
  if (state && state.sceneUuid !== scene?.uuid) throw new Error(`Regionwright Ascendancy state sceneUuid drifted for ${helperMarker(scene)?.semanticId ?? scene?.uuid}.`);
  if (state) validateAscendancyState(state);
  const unknownKeys = unknownStateKeys(state);
  return {
    roomId: helperMarker(scene)?.semanticId ?? null,
    sceneUuid: scene?.uuid ?? null,
    helperMarker: clone(helperMarker(scene)),
    statePresent: Boolean(state),
    state: state ? clone(state) : null,
    stateSummary: state ? stateSummary(scene, state) : null,
    unknownStateKeys: unknownKeys,
    protected: protectedSnapshot(scene)
  };
}

function contract(targetValue, operation, status, noWrite, extra = {}) {
  return Object.freeze({ harnessVersion: ASCENDANCY_FIXTURE_HARNESS_VERSION, operation, status, evidenceClass: "fixture-only", readyClaim: false, noWrite, target: targetValue, allowedWorldId: ASCENDANCY_FIXTURE_WORLD_ID, allowedOperations: Object.values(ASCENDANCY_FIXTURE_OPERATIONS), ...extra });
}

const plans = new Map();
const FIXTURE_CONTROL_NAMES = Object.freeze({
  audit: `${MODULE_ID}-ascendancy-fixture-audit`,
  preview: `${MODULE_ID}-ascendancy-fixture-preview-reset`,
  apply: `${MODULE_ID}-ascendancy-fixture-apply-reset`
});
const FIXTURE_CONTROL_TITLES = Object.freeze({
  audit: "Audit Ascendancy fixture state",
  preview: "Preview full fixture reset",
  apply: "Apply approved fixture reset"
});
let latestResetPreview = null;

const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const receiptContent = receipt => `<pre style="max-height:60vh;overflow:auto;white-space:pre-wrap">${escapeHTML(JSON.stringify(receipt, null, 2))}</pre>`;

function persistResetDiagnostic(runtime, diagnostic) {
  try {
    const serialized = JSON.stringify({ recordedAt: now(runtime), ...diagnostic });
    runtime?.sessionStorage?.setItem?.(RESET_DIAGNOSTIC_STORAGE_KEY, serialized);
    if (runtime && typeof runtime === "object") runtime.__regionwrightAscendancyFixtureResetDiagnostic = JSON.parse(serialized);
  } catch (error) {
    console.error(`${MODULE_ID} could not persist fixture reset diagnostic.`, error);
  }
}

function readResetDiagnostic(runtime) {
  try {
    const stored = runtime?.sessionStorage?.getItem?.(RESET_DIAGNOSTIC_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error(`${MODULE_ID} could not read fixture reset diagnostic.`, error);
  }
  return runtime?.__regionwrightAscendancyFixtureResetDiagnostic ?? null;
}

function showReceipt(title, receipt, buttons = [{ action: "close", label: "Close", default: true }]) {
  console.info(`${MODULE_ID} ${title}`, receipt);
  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (DialogV2) {
    try {
      const rendered = new DialogV2({ window: { title, icon: "fa-solid fa-clipboard-check" }, content: receiptContent(receipt), buttons }).render({ force: true });
      rendered?.catch?.(error => {
        console.error(`${MODULE_ID} ${title} dialog failed.`, error);
        globalThis.ui?.notifications?.error?.(`${title} could not be displayed; use the read-only audit and console diagnostic.`);
      });
      return rendered;
    } catch (error) {
      console.error(`${MODULE_ID} ${title} dialog failed.`, error);
    }
  }
  globalThis.ui?.notifications?.info?.(`${title}: ${receipt.status}`);
  return receipt;
}

function reportFixtureControlError(operation, error) {
  const receipt = contract(target(globalThis), operation, "UNKNOWN", false, {
    blockers: [error?.message ?? String(error)],
    recoveryRequired: true,
    recoveryPolicy: "Do not retry. Use the read-only fixture recovery status and authoritative audit."
  });
  persistResetDiagnostic(globalThis, receipt);
  console.error(`${MODULE_ID} ${operation} control failed.`, error);
  globalThis.ui?.notifications?.error?.(`${operation} failed; recovery diagnostic recorded.`);
  return receipt;
}

function blockedControlReceipt(runtime, operation, blocker) {
  return contract(target(runtime), operation, "BLOCKED", true, { blockers: [blocker] });
}

export async function openAscendancyFixtureAudit() {
  const receipt = fixtureAscendancyStatus();
  showReceipt("Ascendancy fixture state readback", receipt);
  return receipt;
}

export async function openAscendancyFixtureResetPreview() {
  const receipt = previewFixtureFullOwnedReset();
  latestResetPreview = receipt.status === "PREVIEW" ? { planToken: receipt.planToken, expiresAt: receipt.expiresAt } : null;
  showReceipt("Ascendancy fixture reset preview", receipt);
  return receipt;
}

export async function openAscendancyFixtureResetApply() {
  try {
    const checked = gate(globalThis);
    if (!checked.pass) {
      const receipt = contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: checked.failed });
      showReceipt("Ascendancy fixture reset", receipt);
      return receipt;
    }
    const preview = latestResetPreview;
    if (!preview) {
      const receipt = blockedControlReceipt(globalThis, "ascendancy.fixture.apply-full-owned-reset", "Create an approved preview first; no reset token is available in this GM client.");
      showReceipt("Ascendancy fixture reset", receipt);
      return receipt;
    }
    const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
    if (!DialogV2) throw new Error("Foundry's dialog system is unavailable.");
    const confirmation = await new Promise((resolve, reject) => {
      const dialog = new DialogV2({
        window: { title: "Confirm full fixture reset", icon: "fa-solid fa-rotate-left" },
        content: `<p>This will replace only Regionwright Ascendancy state on the four helper-owned Scenes in <code>${ASCENDANCY_FIXTURE_WORLD_ID}</code>.</p><p><strong>Preview token:</strong> <code>${escapeHTML(preview.planToken)}</code><br><strong>Expires:</strong> ${escapeHTML(preview.expiresAt)}</p><p>No Scenes, Walls, Regions, Region Behaviors, Macros, helper flags, foreign state, actors, or campaign geometry will be created, removed, or changed.</p>`,
        buttons: [
          { action: "apply", label: "Apply approved fixture reset", default: true, callback: () => resolve(true) },
          { action: "cancel", label: "Cancel", callback: () => resolve(false) }
        ],
        close: () => resolve(false)
      });
      const rendered = dialog.render({ force: true });
      rendered?.catch?.(reject);
    });
    if (!confirmation) return { status: "CANCELLED", operation: "ascendancy.fixture.apply-full-owned-reset", noWrite: true, evidenceClass: "fixture-only" };
    const receipt = await applyFixtureFullOwnedReset({ approved: true, planToken: preview.planToken });
    latestResetPreview = null;
    showReceipt("Ascendancy fixture reset readback", receipt);
    return receipt;
  } catch (error) {
    const receipt = contract(target(globalThis), "ascendancy.fixture.apply-full-owned-reset", "UNKNOWN", false, {
      blockers: [error.message ?? String(error)],
      recoveryRequired: true,
      recoveryPolicy: "Do not retry. Use the read-only fixture recovery status and authoritative audit before any further operation."
    });
    persistResetDiagnostic(globalThis, receipt);
    showReceipt("Ascendancy fixture reset recovery diagnostic", receipt);
    return receipt;
  }
}

function addFixtureTool(regions, tool) {
  if (!regions) return false;
  regions.tools ??= Array.isArray(regions.tools) ? [] : {};
  if (Array.isArray(regions.tools)) {
    if (regions.tools.some(entry => entry?.name === tool.name)) return false;
    regions.tools.push(tool);
    return true;
  }
  if (regions.tools[tool.name]) return false;
  regions.tools[tool.name] = tool;
  return true;
}

export function registerAscendancyFixtureControls(controls, { runtime = globalThis } = {}) {
  if (!gate(runtime).pass) return false;
  const regions = Array.isArray(controls)
    ? controls.find(entry => ["region", "regions"].includes(entry?.name))
    : controls?.regions;
  if (!regions) return false;
  const baseOrder = Array.isArray(regions.tools) ? regions.tools.length : Object.keys(regions.tools ?? {}).length;
  const tools = [
    { name: FIXTURE_CONTROL_NAMES.audit, title: FIXTURE_CONTROL_TITLES.audit, icon: "fa-solid fa-clipboard-check", order: baseOrder, button: true, visible: true, onChange: () => { void Promise.resolve(openAscendancyFixtureAudit()).catch(error => reportFixtureControlError("ascendancy.fixture.status", error)); } },
    { name: FIXTURE_CONTROL_NAMES.preview, title: FIXTURE_CONTROL_TITLES.preview, icon: "fa-solid fa-eye", order: baseOrder + 1, button: true, visible: true, onChange: () => { void Promise.resolve(openAscendancyFixtureResetPreview()).catch(error => reportFixtureControlError("ascendancy.fixture.preview-full-owned-reset", error)); } },
    { name: FIXTURE_CONTROL_NAMES.apply, title: FIXTURE_CONTROL_TITLES.apply, icon: "fa-solid fa-rotate-left", order: baseOrder + 2, button: true, visible: true, onChange: () => { void Promise.resolve(openAscendancyFixtureResetApply()).catch(error => reportFixtureControlError("ascendancy.fixture.apply-full-owned-reset", error)); } }
  ];
  tools.forEach(tool => addFixtureTool(regions, tool));
  return true;
}

export function installAscendancyFixtureControls() {
  if (!globalThis.Hooks || !claimPremiumStage("fixtureControls")) return;
  Hooks.on("getSceneControlButtons", controls => registerAscendancyFixtureControls(controls));
}

export function fixtureAscendancyStatus({ runtime = globalThis } = {}) {
  const checked = gate(runtime);
  if (!checked.pass) return contract(checked.observed, "ascendancy.fixture.status", "BLOCKED", true, { blockers: checked.failed });
  let scenes;
  try { scenes = fixtureScenes(runtime).map(readScene); } catch (error) { return contract(checked.observed, "ascendancy.fixture.status", "BLOCKED", true, { blockers: [error.message], resetDiagnostic: readResetDiagnostic(runtime) }); }
  return contract(checked.observed, "ascendancy.fixture.status", "OBSERVED", true, { authoritativeReread: true, scenes, resetDiagnostic: readResetDiagnostic(runtime) });
}

export function fixtureAscendancyRecoveryStatus({ runtime = globalThis } = {}) {
  const checked = gate(runtime);
  if (!checked.pass) return contract(checked.observed, "ascendancy.fixture.recovery-status", "BLOCKED", true, { blockers: checked.failed });
  const diagnostic = readResetDiagnostic(runtime);
  const authoritative = fixtureAscendancyStatus({ runtime });
  const uncertain = ["IN_PROGRESS", "UNKNOWN"].includes(diagnostic?.status) || authoritative.status === "BLOCKED";
  return contract(checked.observed, "ascendancy.fixture.recovery-status", uncertain ? "UNKNOWN" : "OBSERVED", true, {
    authoritativeReread: authoritative.authoritativeReread === true,
    diagnostic,
    authoritative,
    recoveryRequired: uncertain,
    recoveryPolicy: uncertain ? "Read-only audit only; reset plan is invalidated and no retry is permitted." : "No pending reset recovery is recorded."
  });
}

export function previewFixtureFullOwnedReset({ runtime = globalThis } = {}) {
  const checked = gate(runtime);
  if (!checked.pass) return contract(checked.observed, "ascendancy.fixture.preview-full-owned-reset", "BLOCKED", true, { blockers: checked.failed });
  let snapshots;
  try { snapshots = fixtureScenes(runtime).map(readScene); } catch (error) { return contract(checked.observed, "ascendancy.fixture.preview-full-owned-reset", "BLOCKED", true, { blockers: [error.message] }); }
  const blockers = snapshots.flatMap(snapshot => snapshot.unknownStateKeys.map(key => `${snapshot.roomId} contains unknown Regionwright Ascendancy state key ${key}`));
  const planToken = randomId(runtime);
  if (blockers.length) return contract(checked.observed, "ascendancy.fixture.preview-full-owned-reset", "BLOCKED", true, { blockers, mutationPlan: null });
  const plan = { planToken, createdAt: now(runtime), operation: ASCENDANCY_FIXTURE_OPERATIONS.APPLY_FULL_RESET, snapshots };
  plans.set(planToken, plan);
  return contract(checked.observed, "ascendancy.fixture.preview-full-owned-reset", "PREVIEW", true, {
    planToken,
    expiresAt: new Date(plan.createdAt + RESET_PLAN_TTL_MS).toISOString(),
    authoritativeReread: true,
    mutationPlan: {
      sceneCount: snapshots.length,
      writes: snapshots.map(snapshot => ({ sceneUuid: snapshot.sceneUuid, path: `flags.${MODULE_ID}.${ASCENDANCY_FLAG}`, kind: "owned-ascendancy-state" })),
      creates: { scenes: 0, walls: 0, regions: 0, regionBehaviors: 0, macros: 0 },
      preserves: ["helper-managed Scene/Wall/Region markers", "foreign Scene/Wall/Region/Tile/Token flags", "Scene UUID and seed"]
    },
    snapshots
  });
}

function assertApproval(options) {
  if (!options || typeof options !== "object" || Array.isArray(options) || Object.keys(options).some(key => !["approved", "planToken"].includes(key)) || options.approved !== true || typeof options.planToken !== "string") throw new Error("Fixture reset requires approved: true and the current planToken only.");
}

export async function applyFixtureFullOwnedReset({ runtime = globalThis, ...approval } = {}) {
  const checked = gate(runtime);
  if (!checked.pass) return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: checked.failed });
  try { assertApproval(approval); } catch (error) { return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: [error.message] }); }
  const { planToken } = approval;
  const plan = plans.get(planToken);
  if (!plan || plan.operation !== ASCENDANCY_FIXTURE_OPERATIONS.APPLY_FULL_RESET || plan.createdAt + RESET_PLAN_TTL_MS <= now(runtime)) return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: ["Fixture reset plan is missing, expired, or has the wrong fixed operation."] });
  let scenes;
  try {
    scenes = fixtureScenes(runtime);
  } catch (error) {
    plans.delete(planToken);
    return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: [error.message], authoritativeReread: false });
  }
  let before;
  try {
    before = scenes.map(readScene);
  } catch (error) {
    plans.delete(planToken);
    return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: [error.message], authoritativeReread: false });
  }
  const drift = before.flatMap(snapshot => {
    const planned = plan.snapshots.find(candidate => candidate.sceneUuid === snapshot.sceneUuid);
    return !planned || JSON.stringify(planned.protected) !== JSON.stringify(snapshot.protected) || JSON.stringify(planned.state) !== JSON.stringify(snapshot.state) ? [`Fixture Scene reread drifted before reset for ${snapshot.roomId}.`] : [];
  });
  if (drift.length) {
    plans.delete(planToken);
    return contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "BLOCKED", true, { blockers: drift, authoritativeReread: true });
  }
  const writes = [];
  const recoveryPolicy = "No blind retry. Stop and require an elected-GM authoritative audit before any further fixture operation.";
  persistResetDiagnostic(runtime, {
    operation: "ascendancy.fixture.apply-full-owned-reset",
    status: "IN_PROGRESS",
    planToken,
    completedWrites: 0,
    attemptedSceneCount: scenes.length,
    recoveryPolicy
  });
  const rereadAll = () => scenes.map(scene => {
    try {
      const snapshot = readScene(scene);
      return { sceneUuid: snapshot.sceneUuid, roomId: snapshot.roomId, status: "OBSERVED", stateSummary: snapshot.stateSummary, protected: snapshot.protected };
    } catch (error) {
      return { sceneUuid: scene?.uuid ?? null, roomId: helperMarker(scene)?.semanticId ?? null, status: "READBACK_ERROR", error: error.message };
    }
  });
  try {
    for (const scene of scenes) {
      const current = stateFlag(scene);
      const next = createAscendancyState({ sceneUuid: scene.uuid, seed: current?.seed ?? scene.uuid });
      persistResetDiagnostic(runtime, { operation: "ascendancy.fixture.apply-full-owned-reset", status: "IN_PROGRESS", planToken, completedWrites: writes.length, nextSceneUuid: scene.uuid, attemptedSceneCount: scenes.length, recoveryPolicy });
      await scene.update({ [`flags.${MODULE_ID}.${ASCENDANCY_FLAG}`]: next });
      const after = readScene(scene);
      if (!after.state || after.unknownStateKeys.length || JSON.stringify(after.state) !== JSON.stringify(next)) throw new Error(`Fixture reset reread drifted for ${after.roomId}.`);
      const planned = plan.snapshots.find(candidate => candidate.sceneUuid === after.sceneUuid);
      if (JSON.stringify(planned.protected) !== JSON.stringify(after.protected)) throw new Error(`Foreign or helper state drifted for ${after.roomId}.`);
      writes.push({ sceneUuid: after.sceneUuid, roomId: after.roomId, reread: true, state: after.stateSummary });
      persistResetDiagnostic(runtime, { operation: "ascendancy.fixture.apply-full-owned-reset", status: "IN_PROGRESS", planToken, completedWrites: writes.length, attemptedSceneCount: scenes.length, recoveryPolicy });
    }
  } catch (error) {
    const receipt = contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "UNKNOWN", false, {
      authoritativeReread: true,
      blockers: [error.message],
      writes,
      partialOutcome: {
        completedWrites: writes.length,
        attemptedSceneCount: scenes.length,
        outcome: writes.length === 0 ? "NO_WRITE_CONFIRMED" : "PARTIAL_WRITE_UNKNOWN",
        recoveryPolicy,
        reread: rereadAll()
      },
      creates: { scenes: 0, walls: 0, regions: 0, regionBehaviors: 0, macros: 0 },
      foreignStatePreserved: false
    });
    persistResetDiagnostic(runtime, receipt);
    return receipt;
  } finally {
    plans.delete(planToken);
  }
  const receipt = contract(checked.observed, "ascendancy.fixture.apply-full-owned-reset", "PASS", false, { authoritativeReread: true, writes, creates: { scenes: 0, walls: 0, regions: 0, regionBehaviors: 0, macros: 0 }, foreignStatePreserved: true });
  persistResetDiagnostic(runtime, receipt);
  return receipt;
}

export const ascendancyFixtureHarness = Object.freeze({
  version: ASCENDANCY_FIXTURE_HARNESS_VERSION,
  target: ASCENDANCY_FIXTURE_TARGET,
  operations: ASCENDANCY_FIXTURE_OPERATIONS,
  status: fixtureAscendancyStatus,
  recoveryStatus: fixtureAscendancyRecoveryStatus,
  previewFullOwnedReset: previewFixtureFullOwnedReset,
  applyFullOwnedReset: applyFixtureFullOwnedReset
});
