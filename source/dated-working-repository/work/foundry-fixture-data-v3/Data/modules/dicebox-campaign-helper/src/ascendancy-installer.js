/**
 * DiceBox Ascendancy spatial installer.
 *
 * The compiled campaign package is the source of truth. This adapter owns
 * only Scene, Wall, and base Region creation; Regionwright owns popup and
 * native RegionBehavior wiring, while the Scene engine owns tram movement.
 * The write path is active-GM-only, exact-runtime-gated, idempotent for
 * DiceBox-owned documents, and rereads every created document before it can
 * report success. Foreign documents are never updated or deleted.
 */

const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_URL = `modules/${MODULE_ID}/ascendancy-campaign-package.json`;
const EXACT_FOUNDRY_VERSION = "14.367";
const SYSTEM_ID = "dnd5e";
const SYSTEM_VERSION = "5.3.3";
const FLAG_SCOPE = MODULE_ID;
const FLAG_KEY = "managed";
const INSTALLER_KEY = "diceboxCampaignHelperInstall";
const WALL_NORMAL = 20;

function clone(value) {
  return structuredClone(value);
}

function flagFor(kind, semanticId, packageId) {
  return {
    flags: {
      [FLAG_SCOPE]: {
        [FLAG_KEY]: {
          packageId,
          kind,
          semanticId,
          schemaVersion: "0.1.0",
          owner: "dicebox-campaign-helper",
        },
      },
    },
  };
}

function ownedDocument(document, kind, semanticId, packageId) {
  const marker = document?.flags?.[FLAG_SCOPE]?.[FLAG_KEY];
  return marker?.owner === "dicebox-campaign-helper"
    && marker?.packageId === packageId
    && marker?.kind === kind
    && marker?.semanticId === semanticId;
}

function activeGm(runtime) {
  const user = runtime.game?.user;
  const elected = runtime.game?.users?.activeGM;
  return Boolean(user?.isGM && elected?.id && user.id === elected.id);
}

function runtimeGate(runtime) {
  const game = runtime.game;
  const system = game?.system;
  const checks = [
    [game?.version === EXACT_FOUNDRY_VERSION, `Foundry ${EXACT_FOUNDRY_VERSION} is required for native writes; observed ${game?.version ?? "unknown"}.`],
    [system?.id === SYSTEM_ID && system?.version === SYSTEM_VERSION, `D&D5e ${SYSTEM_VERSION} is required; observed ${system?.id ?? "unknown"} ${system?.version ?? "unknown"}.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [typeof runtime.Scene?.create === "function", "Scene.create was not observed."],
    [typeof runtime.game?.scenes?.contents !== "undefined", "game.scenes.contents was not observed."],
  ];
  const failed = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: failed.length === 0, checks: Object.freeze(checks.map(([pass, reason]) => ({ pass, reason }))), failed: Object.freeze(failed) });
}

function assetPath(asset) {
  const filename = String(asset.path ?? "").split(/[\\/]/).at(-1);
  if (!filename) throw new Error(`Asset ${asset.assetId} has no filename.`);
  return `modules/${MODULE_ID}/assets/maps/${filename}`;
}

function tileAssetPath(tile) {
  const filename = String(tile.assetPath ?? "").split(/[\\/]/).at(-1);
  if (!filename) throw new Error(`Static Tile ${tile.tileId} has no filename.`);
  return `modules/${MODULE_ID}/assets/tiles/${filename}`;
}

function levelContents(scene) {
  const levels = scene?.levels;
  if (Array.isArray(levels?.contents)) return levels.contents;
  if (typeof levels?.values === "function") return Array.from(levels.values());
  return [];
}

/** Foundry 14 stores a Scene renderer on its initial embedded Level. */
function initialLevel(scene) {
  if (scene?.initialLevel) return scene.initialLevel;
  if (scene?.firstLevel) return scene.firstLevel;
  const levels = levelContents(scene);
  return levels.length === 1 ? levels[0] : null;
}

function rendererSource(scene) {
  return initialLevel(scene)?.background?.src ?? null;
}

async function ensureRenderer(scene, expectedBackground, roomId) {
  const level = initialLevel(scene);
  if (!level || typeof level.update !== "function") throw new Error(`Foundry 14 initial Level renderer is unavailable for ${roomId}.`);
  if (level.background?.src !== expectedBackground) {
    await level.update({ background: { ...(level.background?.toObject?.() ?? level.background ?? {}), src: expectedBackground } });
  }
}

async function rendererPreflight(runtime, room, asset, packageId) {
  const scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  if (!scene) throw new Error(`Cannot repair ${room.roomId}: its DiceBox-owned Scene was not found.`);
  const reread = await rereadScene(runtime, scene);
  const level = initialLevel(reread);
  if (!level || typeof level.update !== "function") throw new Error(`Cannot repair ${room.roomId}: the official Foundry 14 Scene.initialLevel renderer is unavailable or ambiguous.`);
  return Object.freeze({ room, asset, scene: reread, expectedBackground: assetPath(asset) });
}

function sceneData(room, asset, packageId, folderId) {
  return {
    name: room.label,
    folder: folderId ?? null,
    width: 1536,
    height: 1024,
    padding: 0,
    backgroundColor: "#080b10",
    grid: { type: 0, size: 64, distance: 5, units: "grid-unit" },
    ...flagFor("scene", room.roomId, packageId),
  };
}

function wallData(wall, packageId) {
  return {
    c: [wall.a.x, wall.a.y, wall.b.x, wall.b.y],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 0,
    ds: 0,
    ...flagFor("wall", wall.wallId, packageId),
  };
}

function doorWallData(anchor, packageId) {
  const { x, y } = anchor.position;
  const clearance = anchor.clearance;
  const horizontal = anchor.anchorId.endsWith("-north") || anchor.anchorId.endsWith("-south");
  return {
    c: horizontal ? [x - clearance, y, x + clearance, y] : [x, y - clearance, x, y + clearance],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 1,
    ds: 0,
    ...flagFor("door", anchor.anchorId, packageId),
  };
}

function regionData(region, packageId, teleports) {
  const destination = teleports.find((teleport) => teleport.fromRegionId === region.regionId);
  return {
    name: region.label,
    shapes: [{ type: "rectangle", x: region.bounds.x, y: region.bounds.y, width: region.bounds.width, height: region.bounds.height, rotation: 0 }],
    elevation: { bottom: null, top: null },
    color: "#2a9d8f",
    ...flagFor("region", region.regionId, packageId),
    flags: {
      [FLAG_SCOPE]: {
        [FLAG_KEY]: {
          packageId,
          kind: "region",
          semanticId: region.regionId,
          owner: "dicebox-campaign-helper",
          interaction: region.interaction,
          ownerContract: region.owner,
          popup: region.popup,
          behaviorBinding: region.behaviorBinding,
          teleport: destination ? clone(destination) : null,
          regionwrightHandoff: region.owner === "regionwright-popup",
        },
      },
    },
  };
}

function staticTileData(tile, packageId) {
  return {
    x: tile.bounds.x, y: tile.bounds.y, width: tile.bounds.width, height: tile.bounds.height,
    rotation: 0, sort: tile.sort, hidden: false, overhead: false,
    texture: { src: tileAssetPath(tile) },
    ...flagFor("tile", tile.tileId, packageId),
  };
}

function findOwned(collection, kind, semanticId, packageId) {
  return collection?.find?.((document) => ownedDocument(document, kind, semanticId, packageId)) ?? null;
}

function expectedWallDocuments(blueprint, packageId) {
  return [
    ...blueprint.walls.map((wall) => ({ kind: "wall", semanticId: wall.wallId, data: wallData(wall, packageId) })),
    ...blueprint.anchors.filter((anchor) => anchor.kind === "door").map((anchor) => ({ kind: "door", semanticId: anchor.anchorId, data: doorWallData(anchor, packageId) })),
  ];
}

function ownedWalls(scene, packageId) {
  return (scene?.walls?.contents ?? []).filter((wall) => {
    const marker = wall?.flags?.[FLAG_SCOPE]?.[FLAG_KEY];
    return marker?.owner === MODULE_ID && marker?.packageId === packageId && (marker.kind === "wall" || marker.kind === "door");
  });
}

function expectedWallReadback(scene, expected, packageId) {
  const walls = ownedWalls(scene, packageId);
  return walls.length === expected.length && expected.every(({ kind, semanticId }) => findOwned(walls, kind, semanticId, packageId));
}

async function rereadScene(runtime, scene) {
  const current = runtime.game?.scenes?.get?.(scene?.id);
  if (current) return current;
  if (typeof runtime.fromUuid === "function" && scene?.uuid) {
    const reread = await Promise.resolve(runtime.fromUuid(scene.uuid));
    if (reread) return reread;
  }
  return runtime.game?.scenes?.get?.(scene?.id) ?? scene;
}

function findRecoverableScene(runtime, room, regionPlan, packageId) {
  const candidates = (runtime.game?.scenes?.contents ?? []).filter((scene) => {
    if (scene?.name !== room.label || scene?.width !== 1536 || scene?.height !== 1024) return false;
    const regions = scene?.regions?.contents ?? [];
    return regionPlan.regions.every((region) => findOwned(regions, "region", region.regionId, packageId));
  });
  if (candidates.length > 1) throw new Error(`Multiple recoverable DiceBox scenes matched ${room.roomId}; refusing ambiguous repair.`);
  return candidates[0] ?? null;
}

async function installScene(runtime, room, blueprint, regionPlan, staticTilePlan, asset, packageId, folderId) {
  let scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  let sceneRecovered = false;
  if (!scene) {
    scene = findRecoverableScene(runtime, room, regionPlan, packageId);
    if (scene) {
      await scene.update(flagFor("scene", room.roomId, packageId));
      sceneRecovered = true;
    }
  }
  let sceneCreated = false;
  if (!scene) {
    scene = await runtime.Scene.create(sceneData(room, asset, packageId, folderId));
    sceneCreated = true;
  }
  if (!scene) throw new Error(`Scene creation returned no document for ${room.roomId}.`);
  let rereadBeforeChildren = await rereadScene(runtime, scene);
  if (!rereadBeforeChildren) throw new Error(`Scene reread failed for ${room.roomId}.`);
  await ensureRenderer(rereadBeforeChildren, assetPath(asset), room.roomId);
  rereadBeforeChildren = await rereadScene(runtime, rereadBeforeChildren);
  if (!rereadBeforeChildren || rendererSource(rereadBeforeChildren) !== assetPath(asset)) throw new Error(`Foundry 14 initial Level renderer reread failed for ${room.roomId}.`);
  const wallCollection = rereadBeforeChildren.walls?.contents ?? [];
  const regionCollection = rereadBeforeChildren.regions?.contents ?? [];
  const tileCollection = rereadBeforeChildren.tiles?.contents ?? [];
  const doors = blueprint.anchors.filter((anchor) => anchor.kind === "door");
  const wallPayload = blueprint.walls
    .filter((wall) => !findOwned(wallCollection, "wall", wall.wallId, packageId))
    .map((wall) => wallData(wall, packageId));
  const doorPayload = doors
    .filter((anchor) => !findOwned(wallCollection, "door", anchor.anchorId, packageId))
    .map((anchor) => doorWallData(anchor, packageId));
  if (wallPayload.length + doorPayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Wall", [...wallPayload, ...doorPayload]);
  }
  const regionPayload = regionPlan.regions
    .filter((region) => !findOwned(regionCollection, "region", region.regionId, packageId))
    .map((region) => regionData(region, packageId, regionPlan.teleports));
  if (regionPayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Region embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Region", regionPayload);
  }
  const staticTiles = staticTilePlan.tiles.filter((tile) => tile.sceneId === room.sceneId);
  const tilePayload = staticTiles
    .filter((tile) => !findOwned(tileCollection, "tile", tile.tileId, packageId))
    .map((tile) => staticTileData(tile, packageId));
  if (tilePayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Tile embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Tile", tilePayload);
  }
  const reread = await rereadScene(runtime, rereadBeforeChildren);
  const walls = reread?.walls?.contents ?? [];
  const regions = reread?.regions?.contents ?? [];
  const tiles = reread?.tiles?.contents ?? [];
  const expectedWallCount = blueprint.walls.length + doors.length;
  const expectedRegionCount = regionPlan.regions.length;
  const expectedTileCount = staticTiles.length;
  const wallReadback = blueprint.walls.every((wall) => findOwned(walls, "wall", wall.wallId, packageId))
    && doors.every((door) => findOwned(walls, "door", door.anchorId, packageId));
  const regionReadback = regionPlan.regions.every((region) => findOwned(regions, "region", region.regionId, packageId));
  const tileReadback = staticTiles.every((tile) => findOwned(tiles, "tile", tile.tileId, packageId));
  if (!wallReadback || !regionReadback || !tileReadback || walls.filter((wall) => wall.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId).length !== expectedWallCount || regions.filter((region) => region.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId).length !== expectedRegionCount || tiles.filter((tile) => tile.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId && tile.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.kind === "tile").length !== expectedTileCount) {
    throw new Error(`Authoritative reread did not match the expected owned Wall/Region/Tile set for ${room.roomId}.`);
  }
  return Object.freeze({ roomId: room.roomId, sceneId: room.sceneId, sceneUuid: reread.uuid ?? scene.uuid ?? null, sceneCreated, sceneRecovered, wallCount: expectedWallCount, regionCount: expectedRegionCount, tileCount: expectedTileCount, reread: true });
}

/**
 * Explicit migration for the discovered renderer/staging defect. It updates
 * only DiceBox-owned scene backgrounds and boundary Wall documents. It never
 * creates Scenes, Regions, Macros, or RegionBehaviors, and it rereads every
 * changed document before returning a receipt.
 */
async function repairSceneRendererAndGeometry(runtime, room, blueprint, regionPlan, asset, packageId) {
  const scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  if (!scene) throw new Error(`Cannot repair ${room.roomId}: its DiceBox-owned Scene was not found.`);
  let reread = await rereadScene(runtime, scene);
  if (!reread) throw new Error(`Cannot repair ${room.roomId}: Scene reread failed.`);
  const expected = expectedWallDocuments(blueprint, packageId);
  const expectedBackground = assetPath(asset);
  await ensureRenderer(reread, expectedBackground, room.roomId);
  reread = await rereadScene(runtime, reread);
  if (!reread) throw new Error(`Cannot repair ${room.roomId}: Scene reread after renderer update failed.`);
  if (rendererSource(reread) !== expectedBackground) throw new Error(`Cannot repair ${room.roomId}: Foundry 14 initial Level renderer reread failed.`);
  const priorOwnedWalls = ownedWalls(reread, packageId);
  if (priorOwnedWalls.length > 0) {
    if (typeof reread.deleteEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document deletion is unavailable for ${room.roomId}.`);
    await reread.deleteEmbeddedDocuments("Wall", priorOwnedWalls.map((wall) => wall.id));
  }
  if (expected.length > 0) {
    if (typeof reread.createEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document creation is unavailable for ${room.roomId}.`);
    await reread.createEmbeddedDocuments("Wall", expected.map(({ data }) => data));
  }
  const finalScene = await rereadScene(runtime, reread);
  const expectedRegions = regionPlan.regions;
  const regionReadback = expectedRegions.every((region) => findOwned(finalScene?.regions?.contents, "region", region.regionId, packageId));
  if (!finalScene || rendererSource(finalScene) !== expectedBackground || !expectedWallReadback(finalScene, expected, packageId) || !regionReadback) {
    throw new Error(`Authoritative reread did not match the expected renderer, Wall set, and Region set for ${room.roomId}.`);
  }
  return Object.freeze({
    roomId: room.roomId,
    sceneId: room.sceneId,
    sceneUuid: finalScene.uuid ?? null,
    background: expectedBackground,
    wallsRemoved: priorOwnedWalls.length,
    wallsCreated: expected.length,
    wallCount: expected.length,
    regionCount: expectedRegions.length,
    reread: true,
  });
}

async function loadPackage(runtime) {
  if (runtime.__diceboxAscendancyPackage) return runtime.__diceboxAscendancyPackage;
  if (typeof runtime.fetch !== "function") throw new Error("Fetch is unavailable for the compiled campaign package.");
  const response = await runtime.fetch(`${PACKAGE_URL}?v=0.1.0`);
  if (!response.ok) throw new Error(`Campaign package fetch failed with HTTP ${response.status}.`);
  const packageData = await response.json();
  if (packageData.mutation !== "disabled-until-exact-runtime-gate" || packageData.spatialBlueprints?.length !== 4 || packageData.regionPlans?.length !== 4) throw new Error("Compiled campaign package failed the install contract.");
  const incompleteAssets = packageData.assets?.bound?.filter?.((asset) => asset?.status !== "scene-bound" || typeof asset?.path !== "string" || asset.path.length === 0) ?? [];
  if (incompleteAssets.length > 0) throw new Error("Compiled campaign package has no reviewed renderer for every Scene; installation is blocked before any Foundry write.");
  runtime.__diceboxAscendancyPackage = packageData;
  return packageData;
}

export async function installAscendancyCampaign(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.install", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const packageData = await loadPackage(runtime);
  const folder = runtime.game?.folders?.find?.((candidate) => candidate.type === "Scene" && candidate.name === "The Ascendancy");
  const results = [];
  for (const room of packageData.campaign.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = packageData.assets.bound.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Campaign package is incomplete for ${room.roomId}.`);
    results.push(await installScene(runtime, room, blueprint, regionPlan, packageData.staticVisualTileProjection, asset, packageData.packageId, folder?.id ?? null));
  }
  const receipt = Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.install",
    status: "PASS",
    evidenceClass: "deterministic",
    readyClaim: false,
    noWrite: false,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
    notes: Object.freeze([
      "Scenes, blueprint-defined boundary and door Wall segments per Scene, and base Regions were created or reread through Foundry APIs.",
      "Regionwright popup/native RegionBehavior wiring and Scene-owned tram logic remain separate owners and require their own target-bound receipt.",
    ]),
  });
  runtime.ui?.notifications?.info?.("DiceBox Ascendancy base scenes are installed and reread.");
  return receipt;
}

export async function repairAscendancyCampaignRenderersAndGeometry(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.repair", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const packageData = await loadPackage(runtime);
  const repairs = [];
  for (const room of packageData.campaign.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = packageData.assets.bound.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Campaign package is incomplete for ${room.roomId}.`);
    repairs.push({ room, blueprint, regionPlan, asset });
  }
  // Read every target before any owned Wall replacement. A missing/ambiguous
  // Foundry 14 Level blocks the whole repair without changing geometry.
  await Promise.all(repairs.map(({ room, asset }) => rendererPreflight(runtime, room, asset, packageData.packageId)));
  const results = [];
  for (const repair of repairs) results.push(await repairSceneRendererAndGeometry(runtime, repair.room, repair.blueprint, repair.regionPlan, repair.asset, packageData.packageId));
  return Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.repair",
    status: "PASS",
    evidenceClass: "full_function",
    readyClaim: false,
    noWrite: false,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
    notes: Object.freeze([
      "Only existing DiceBox-owned Scene backgrounds and boundary Wall documents were reconciled to the compiled package.",
      "No Scene, Region, Macro, RegionBehavior, foreign document, or puzzle state was created, deleted, or updated.",
    ]),
  });
}

function expose(runtime) {
  if (!runtime.game || Object.prototype.hasOwnProperty.call(runtime.game, INSTALLER_KEY)) return;
  const api = Object.freeze({
    describe: () => Object.freeze({ packageId: MODULE_ID, exactFoundryVersion: EXACT_FOUNDRY_VERSION, system: `${SYSTEM_ID}@${SYSTEM_VERSION}`, owner: "Scene/Wall/base-Region only", readyClaim: false }),
    preview: () => runtimeGate(runtime),
    install: () => installAscendancyCampaign(runtime),
    repair: () => repairAscendancyCampaignRenderersAndGeometry(runtime),
  });
  Object.defineProperty(runtime.game, INSTALLER_KEY, { configurable: false, enumerable: false, value: api, writable: false });
}

function registerControl(runtime) {
  if (typeof runtime.Hooks?.on !== "function") return;
  runtime.Hooks.on("getSceneControlButtons", (controls) => {
    if (!runtime.game?.user?.isGM) return;
    const tools = controls?.tokens?.tools;
    if (!tools || typeof tools !== "object" || Array.isArray(tools)) return;
    const nextOrder = Object.keys(tools).length;
    if (!tools["dicebox-ascendancy-install"]) tools["dicebox-ascendancy-install"] = {
      name: "dicebox-ascendancy-install", title: "Prepare DiceBox Ascendancy", icon: "fa-solid fa-dungeon", order: nextOrder,
      button: true, visible: true, onChange: () => installAscendancyCampaign(runtime).catch((error) => runtime.ui?.notifications?.error?.(`DiceBox install blocked: ${error.message}`)),
    };
    if (!tools["dicebox-ascendancy-repair"]) tools["dicebox-ascendancy-repair"] = {
      name: "dicebox-ascendancy-repair", title: "Repair DiceBox Ascendancy maps and geometry", icon: "fa-solid fa-hammer", order: nextOrder + 1,
      button: true, visible: true, onChange: () => repairAscendancyCampaignRenderersAndGeometry(runtime).catch((error) => runtime.ui?.notifications?.error?.(`DiceBox repair blocked: ${error.message}`)),
    };
  });
}

if (typeof globalThis.Hooks?.once === "function") {
  // Foundry v14 constructs Scene Controls before the ready hook. Register
  // the callback at init so the first control render can include these
  // GM-only actions; each action remains independently exact-runtime gated.
  globalThis.Hooks.once("init", () => registerControl(globalThis));
  globalThis.Hooks.once("ready", () => {
    expose(globalThis);
    if (globalThis.game?.user?.isGM && globalThis.ui?.notifications) globalThis.ui.notifications.info("DiceBox Campaign Helper loaded. The Ascendancy installer is GM-only and exact-runtime-gated.");
  });
}
