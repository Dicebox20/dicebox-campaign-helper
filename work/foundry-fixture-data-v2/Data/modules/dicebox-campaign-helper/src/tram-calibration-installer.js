/**
 * Fixture-only Tram coordinate calibration adapter.
 *
 * It is intentionally separate from the Ballad installer and from puzzle
 * progression. The compiled calibration package is its only geometry input.
 * The adapter creates a dedicated disposable Scene, writes declared Walls and
 * doors, sets the empty renderer, then projects one functional Tile and one
 * Region from the same rectangle. It never deletes or rewrites foreign data.
 */

const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_ID = "dbx:package:fixture-tram-coordinate-calibration";
const EXACT_FOUNDRY_VERSION = "14.367";
const SYSTEM_ID = "dnd5e";
const SYSTEM_VERSION = "5.3.3";
const WALL_NORMAL = 20;
const PLAN_TTL_MS = 5 * 60 * 1000;
const MARKER_PATH = `modules/${MODULE_ID}/assets/maps/ascendancy-tram-calibration-marker-v1.svg`;

function marker(kind, semanticId, planId) {
  return {
    flags: {
      [MODULE_ID]: {
        managed: {
          owner: MODULE_ID,
          packageId: PACKAGE_ID,
          planId,
          kind,
          semanticId,
          schemaVersion: "0.1.0",
        },
      },
    },
  };
}

function isOwned(document, kind, semanticId, planId) {
  const value = document?.flags?.[MODULE_ID]?.managed;
  return value?.owner === MODULE_ID
    && value.packageId === PACKAGE_ID
    && value.planId === planId
    && value.kind === kind
    && value.semanticId === semanticId;
}

function activeGm(runtime) {
  return Boolean(runtime.game?.user?.isGM
    && runtime.game?.user?.id
    && runtime.game?.users?.activeGM?.id === runtime.game.user.id);
}

function runtimeGate(runtime, plan) {
  const game = runtime.game;
  const system = game?.system;
  const checks = [
    [game?.world?.id === plan.target.worldId, `Calibration is restricted to ${plan.target.worldId}.`],
    [game?.version === EXACT_FOUNDRY_VERSION, `Foundry ${EXACT_FOUNDRY_VERSION} is required; observed ${game?.version ?? "unknown"}.`],
    [system?.id === SYSTEM_ID && system?.version === SYSTEM_VERSION, `D&D5e ${SYSTEM_VERSION} is required; observed ${system?.id ?? "unknown"} ${system?.version ?? "unknown"}.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [typeof runtime.Scene?.create === "function", "Scene.create is available."],
    [typeof game?.scenes?.get === "function" && Array.isArray(game?.scenes?.contents), "Scene collection readback is available."],
  ];
  const failed = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: failed.length === 0, checks: Object.freeze(checks.map(([pass, reason]) => ({ pass, reason }))), failed: Object.freeze(failed) });
}

function validatePlan(plan) {
  const bounds = plan?.tile?.bounds;
  const regionBounds = plan?.region?.bounds;
  const valid = plan?.schemaVersion === "0.1.0"
    && plan?.planId === "dbx:plan:fixture-tram-coordinate-calibration"
    && plan?.target?.worldId === "dbx-test-world"
    && plan?.target?.foundryVersion === EXACT_FOUNDRY_VERSION
    && plan?.target?.systemId === SYSTEM_ID
    && plan?.target?.systemVersion === SYSTEM_VERSION
    && plan?.scene?.canvas?.width === 1536
    && plan?.scene?.canvas?.height === 1024
    && Array.isArray(plan?.walls?.segments) && plan.walls.segments.length === 11
    && Array.isArray(plan?.walls?.doors) && plan.walls.doors.length === 3
    && bounds?.x === regionBounds?.x && bounds?.y === regionBounds?.y
    && bounds?.width === regionBounds?.width && bounds?.height === regionBounds?.height;
  if (!valid) throw new Error("The reviewed Tram calibration package is incomplete or has coordinate drift.");
  return plan;
}

function collectionContents(collection) {
  return Array.isArray(collection?.contents) ? collection.contents : [];
}

function findOwned(collection, kind, semanticId, planId) {
  return collectionContents(collection).find((document) => isOwned(document, kind, semanticId, planId)) ?? null;
}

function initialLevel(scene) {
  if (scene?.initialLevel) return scene.initialLevel;
  if (scene?.firstLevel) return scene.firstLevel;
  const levels = collectionContents(scene?.levels);
  return levels.length === 1 ? levels[0] : null;
}

function rendererPath(plan) {
  return `modules/${MODULE_ID}/assets/maps/${plan.scene.rendererPath.split("/").at(-1)}`;
}

async function rereadScene(runtime, scene) {
  const current = runtime.game?.scenes?.get?.(scene?.id);
  if (current) return current;
  if (typeof runtime.fromUuid === "function" && scene?.uuid) {
    const resolved = await runtime.fromUuid(scene.uuid);
    if (resolved) return resolved;
  }
  return null;
}

function sceneData(plan) {
  return {
    name: plan.scene.label,
    width: plan.scene.canvas.width,
    height: plan.scene.canvas.height,
    padding: 0,
    backgroundColor: "#080b10",
    grid: { type: 0, size: 64, distance: 5, units: "grid-unit" },
    ...marker("scene", plan.scene.sceneId, plan.planId),
  };
}

function wallData(segment, plan) {
  return {
    c: [segment.a.x, segment.a.y, segment.b.x, segment.b.y],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 0,
    ds: 0,
    ...marker("wall", segment.wallId, plan.planId),
  };
}

function doorData(anchor, plan) {
  return {
    c: [anchor.position.x, anchor.position.y - anchor.clearance, anchor.position.x, anchor.position.y + anchor.clearance],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 1,
    ds: 0,
    ...marker("door", anchor.anchorId, plan.planId),
  };
}

function tileData(plan) {
  const { bounds } = plan.tile;
  return {
    name: plan.tile.label,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    alpha: 1,
    hidden: false,
    locked: true,
    texture: { src: MARKER_PATH },
    ...marker("tile", plan.tile.tileId, plan.planId),
  };
}

function regionData(plan) {
  const { bounds } = plan.region;
  return {
    name: plan.region.label,
    shapes: [{ type: "rectangle", x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height, rotation: 0 }],
    color: "#e1a634",
    locked: true,
    ...marker("region", plan.region.regionId, plan.planId),
  };
}

function boundsEqual(actual, expected) {
  return actual?.x === expected.x && actual?.y === expected.y
    && actual?.width === expected.width && actual?.height === expected.height;
}

function ownedChildren(scene, kind, planId) {
  const collection = kind === "tile" ? scene?.tiles : kind === "region" ? scene?.regions : scene?.walls;
  return collectionContents(collection).filter((document) => {
    const value = document?.flags?.[MODULE_ID]?.managed;
    return value?.owner === MODULE_ID && value.packageId === PACKAGE_ID && value.planId === planId && value.kind === kind;
  });
}

function existingScene(runtime, plan) {
  const matches = collectionContents(runtime.game?.scenes)
    .filter((scene) => isOwned(scene, "scene", plan.scene.sceneId, plan.planId));
  if (matches.length > 1) throw new Error("Multiple owned calibration Scenes were found; refusing ambiguous recovery.");
  return matches[0] ?? null;
}

function describeReadback(scene, plan) {
  const tile = findOwned(scene?.tiles, "tile", plan.tile.tileId, plan.planId);
  const region = findOwned(scene?.regions, "region", plan.region.regionId, plan.planId);
  const shape = region?.shapes?.[0] ?? null;
  const walls = ownedChildren(scene, "wall", plan.planId);
  const doors = ownedChildren(scene, "door", plan.planId);
  return Object.freeze({
    sceneBound: Boolean(scene?.id),
    renderer: initialLevel(scene)?.background?.src ?? null,
    wallCount: walls.length,
    doorCount: doors.length,
    tile: tile ? { semanticId: plan.tile.tileId, bounds: { x: tile.x, y: tile.y, width: tile.width, height: tile.height }, texture: tile.texture?.src ?? null } : null,
    region: region ? { semanticId: plan.region.regionId, bounds: shape ? { x: shape.x, y: shape.y, width: shape.width, height: shape.height } : null } : null,
  });
}

function completeReadback(scene, plan) {
  const result = describeReadback(scene, plan);
  return result.renderer === rendererPath(plan)
    && result.wallCount === plan.walls.segments.length
    && result.doorCount === plan.walls.doors.length
    && result.tile?.texture === MARKER_PATH
    && boundsEqual(result.tile?.bounds, plan.tile.bounds)
    && boundsEqual(result.region?.bounds, plan.region.bounds);
}

function ownedCalibrationCount(scene, planId) {
  return ["wall", "door", "tile", "region"]
    .reduce((count, kind) => count + ownedChildren(scene, kind, planId).length, 0);
}

function foreignCounts(scene, planId) {
  const countForeign = (collection) => collectionContents(collection)
    .filter((document) => {
      const value = document?.flags?.[MODULE_ID]?.managed;
      return !(value?.owner === MODULE_ID && value.packageId === PACKAGE_ID && value.planId === planId);
    }).length;
  return Object.freeze({
    walls: countForeign(scene?.walls),
    tiles: countForeign(scene?.tiles),
    regions: countForeign(scene?.regions),
  });
}

function foreignCountsEqual(left, right) {
  return left.walls === right.walls && left.tiles === right.tiles && left.regions === right.regions;
}

export class TramCalibrationInstaller {
  constructor({ runtime = globalThis, plan, now = () => Date.now() } = {}) {
    this.runtime = runtime;
    this.plan = validatePlan(plan);
    this.now = now;
    this.previewToken = null;
  }

  preview() {
    const gate = runtimeGate(this.runtime, this.plan);
    if (!gate.pass) return Object.freeze({ operation: "tram-calibration.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: gate.failed, gate });
    try {
      const existing = existingScene(this.runtime, this.plan);
      if (existing && !completeReadback(existing, this.plan) && ownedCalibrationCount(existing, this.plan.planId) > 0) {
        return Object.freeze({ operation: "tram-calibration.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Owned calibration documents are partial or drifted; reread/recovery is required before any write."], gate });
      }
      const token = `${this.now().toString(36)}-tram-calibration`;
      this.previewToken = { token, expiresAt: this.now() + PLAN_TTL_MS };
      return Object.freeze({ operation: "tram-calibration.preview", status: "PASS", evidenceClass: "deterministic", noWrite: true, planToken: token, expiresAt: new Date(this.previewToken.expiresAt).toISOString(), existing: Boolean(existing), planId: this.plan.planId, sceneId: this.plan.scene.sceneId, tileId: this.plan.tile.tileId, regionId: this.plan.region.regionId, counts: { walls: 11, doors: 3, tiles: 1, regions: 1 }, preservationScope: this.plan.preservationScope, gate });
    } catch (error) {
      return Object.freeze({ operation: "tram-calibration.preview", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true, gate });
    }
  }

  async apply({ approved = false, planToken } = {}) {
    const gate = runtimeGate(this.runtime, this.plan);
    if (!gate.pass) return Object.freeze({ operation: "tram-calibration.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: gate.failed, gate });
    if (!approved || planToken !== this.previewToken?.token || this.previewToken.expiresAt <= this.now()) return Object.freeze({ operation: "tram-calibration.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Apply requires approved: true and the current calibration preview token."], gate });
    this.previewToken = null;
    let scene = null;
    let sceneCreated = false;
    try {
      scene = existingScene(this.runtime, this.plan);
      if (scene && completeReadback(scene, this.plan)) {
        return Object.freeze({ operation: "tram-calibration.apply", status: "PASS", evidenceClass: "observed", noWrite: true, planId: this.plan.planId, sceneCreated: false, alreadyApplied: true, readback: describeReadback(scene, this.plan), preservationScope: this.plan.preservationScope, foreignStatePreserved: true, authoritativeReread: true });
      }
      if (scene && ownedCalibrationCount(scene, this.plan.planId) > 0) {
        return Object.freeze({ operation: "tram-calibration.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Owned calibration documents are partial or drifted; apply refuses a write until authoritative recovery review."], preservationScope: this.plan.preservationScope });
      }
      if (!scene) {
        scene = await this.runtime.Scene.create(sceneData(this.plan));
        sceneCreated = true;
      }
      scene = await rereadScene(this.runtime, scene);
      if (!scene || typeof scene.createEmbeddedDocuments !== "function") throw new Error("The calibration Scene cannot be reread or create embedded documents.");
      const beforeForeign = foreignCounts(scene, this.plan.planId);
      const level = initialLevel(scene);
      if (!level || typeof level.update !== "function") throw new Error("Foundry 14 initialLevel is unavailable or ambiguous for the calibration Scene.");
      if (level.background?.src && level.background.src !== rendererPath(this.plan)) throw new Error("The owned calibration Scene has a renderer mismatch; refusing replacement.");

      const wallPayload = this.plan.walls.segments.filter((wall) => !findOwned(scene.walls, "wall", wall.wallId, this.plan.planId)).map((wall) => wallData(wall, this.plan));
      const doorPayload = this.plan.walls.doors.filter((door) => !findOwned(scene.walls, "door", door.anchorId, this.plan.planId)).map((door) => doorData(door, this.plan));
      if (wallPayload.length || doorPayload.length) await scene.createEmbeddedDocuments("Wall", [...wallPayload, ...doorPayload]);

      if (level.background?.src !== rendererPath(this.plan)) await level.update({ background: { ...(level.background?.toObject?.() ?? level.background ?? {}), src: rendererPath(this.plan) } });
      scene = await rereadScene(this.runtime, scene);
      if (!scene || initialLevel(scene)?.background?.src !== rendererPath(this.plan)) throw new Error("Renderer reread failed before Tile/Region projection.");

      if (!findOwned(scene.tiles, "tile", this.plan.tile.tileId, this.plan.planId)) await scene.createEmbeddedDocuments("Tile", [tileData(this.plan)]);
      if (!findOwned(scene.regions, "region", this.plan.region.regionId, this.plan.planId)) await scene.createEmbeddedDocuments("Region", [regionData(this.plan)]);
      scene = await rereadScene(this.runtime, scene);
      if (!scene || !completeReadback(scene, this.plan)) throw new Error("Authoritative calibration readback did not match the frozen plan.");
      const preserved = foreignCountsEqual(beforeForeign, foreignCounts(scene, this.plan.planId));
      if (!preserved) throw new Error("Foreign Scene child counts changed during calibration; refusing certification.");
      return Object.freeze({ operation: "tram-calibration.apply", status: "PASS", evidenceClass: "created_document", noWrite: false, planId: this.plan.planId, sceneCreated, readback: describeReadback(scene, this.plan), preservationScope: this.plan.preservationScope, foreignStatePreserved: preserved, authoritativeReread: true });
    } catch (error) {
      const reread = scene ? await rereadScene(this.runtime, scene).catch(() => null) : null;
      return Object.freeze({ operation: "tram-calibration.apply", status: "UNKNOWN", evidenceClass: "unknown", noWrite: !sceneCreated, error: String(error?.message ?? error), sceneCreated, partialReadback: reread ? describeReadback(reread, this.plan) : null, recovery: "Do not retry blindly. Authoritatively reread the owned fixture Scene, then preview the current state before any recovery.", preservationScope: this.plan.preservationScope });
    }
  }
}

export async function loadTramCalibrationPlan(fetcher = globalThis.fetch) {
  if (typeof fetcher !== "function") throw new Error("The Foundry fetch surface is unavailable for the reviewed calibration package.");
  const response = await fetcher(`modules/${MODULE_ID}/tram-calibration-package.json`, { cache: "no-store" });
  if (!response?.ok) throw new Error("The reviewed Tram calibration package could not be loaded.");
  return validatePlan(await response.json());
}

export async function bootstrapTramCalibration(runtime = globalThis) {
  if (!runtime.game || Object.prototype.hasOwnProperty.call(runtime.game, "diceboxTramCalibration")) return false;
  try {
    const plan = await loadTramCalibrationPlan(runtime.fetch ?? globalThis.fetch);
    const installer = new TramCalibrationInstaller({ runtime, plan });
    Object.defineProperty(runtime.game, "diceboxTramCalibration", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Object.freeze({
        status: () => installer.preview(),
        preview: () => installer.preview(),
        apply: (approval) => installer.apply(approval),
      }),
    });
    return true;
  } catch (error) {
    Object.defineProperty(runtime.game, "diceboxTramCalibration", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Object.freeze({
        status: () => Object.freeze({ operation: "tram-calibration.status", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: [String(error?.message ?? error)] }),
      }),
    });
    return false;
  }
}

if (typeof globalThis.Hooks?.once === "function") {
  globalThis.Hooks.once("ready", () => void bootstrapTramCalibration(globalThis));
}

export { MARKER_PATH, PACKAGE_ID, rendererPath, validatePlan };
