/**
 * Disposable-world six-car Tram projection rehearsal.
 *
 * This adapter owns only its separately marked fixture Scene. Geometry comes
 * from the compiled fixture package; it never measures renderer pixels or
 * targets Ballad. The package contains one pure-solver-approved move so this
 * browser adapter does not duplicate Rush Hour legality rules.
 */
const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_ID = "dbx:package:fixture-tram-routing-projection";
const EXACT_FOUNDRY_VERSION = "14.367";
const SYSTEM_ID = "dnd5e";
const SYSTEM_VERSION = "5.3.3";
const WALL_NORMAL = 20;
const PLAN_TTL_MS = 5 * 60 * 1000;

function managed(kind, semanticId, plan) {
  return { flags: { [MODULE_ID]: { managed: { owner: MODULE_ID, packageId: PACKAGE_ID, planId: plan.planId, kind, semanticId, schemaVersion: plan.schemaVersion } } } };
}

function contents(collection) { return Array.isArray(collection?.contents) ? collection.contents : []; }
function activeGm(runtime) { return Boolean(runtime.game?.user?.isGM && runtime.game?.user?.id && runtime.game?.users?.activeGM?.id === runtime.game.user.id); }
function owned(document, kind, semanticId, plan) {
  const value = document?.flags?.[MODULE_ID]?.managed;
  return value?.owner === MODULE_ID && value.packageId === PACKAGE_ID && value.planId === plan.planId && value.kind === kind && value.semanticId === semanticId;
}
function gate(runtime, plan) {
  const checks = [
    [runtime.game?.world?.id === plan.target.worldId, `Routing rehearsal is restricted to ${plan.target.worldId}.`],
    [runtime.game?.version === EXACT_FOUNDRY_VERSION, `Foundry ${EXACT_FOUNDRY_VERSION} is required.`],
    [runtime.game?.system?.id === SYSTEM_ID && runtime.game?.system?.version === SYSTEM_VERSION, `D&D5e ${SYSTEM_VERSION} is required.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [typeof runtime.Scene?.create === "function", "Scene.create must be available."],
    [typeof runtime.game?.scenes?.get === "function", "Scene collection reread must be available."],
  ];
  const failed = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: failed.length === 0, failed: Object.freeze(failed), checks: Object.freeze(checks.map(([pass, reason]) => ({ pass, reason }))) });
}
function validatePlan(plan) {
  const valid = plan?.schemaVersion === "0.1.0"
    && plan?.planId === "dbx:plan:fixture-tram-routing-projection"
    && plan?.target?.worldId === "dbx-test-world"
    && plan?.scene?.canvas?.width === 1536 && plan?.scene?.canvas?.height === 1024
    && plan?.walls?.segments?.length === 11 && plan?.walls?.doors?.length === 3
    && plan?.staticVisualTiles?.length === 5 && plan?.staticRegions?.length === 39
    && plan?.initialProjections?.length === 6
    && plan?.approvedFixtureMove?.pieceId === "dbx:tram:b" && plan?.approvedFixtureMove?.delta === -1;
  if (!valid) throw new Error("The reviewed fixture Tram routing package is incomplete or has coordinate drift.");
  for (const projection of plan.initialProjections) {
    const footprint = projection.footprintRegion;
    if (projection.x !== footprint?.x || projection.y !== footprint?.y || projection.width !== footprint?.width || projection.height !== footprint?.height) throw new Error("A fixture Tram Tile and Region footprint differ.");
  }
  return plan;
}
function renderer(plan) { return `modules/${MODULE_ID}/assets/maps/${plan.scene.rendererPath.split("/").at(-1)}`; }
function initialLevel(scene) { return scene?.initialLevel ?? scene?.firstLevel ?? (contents(scene?.levels).length === 1 ? contents(scene?.levels)[0] : null); }
async function reread(runtime, scene) {
  return runtime.game?.scenes?.get?.(scene?.id) ?? (typeof runtime.fromUuid === "function" && scene?.uuid ? await runtime.fromUuid(scene.uuid) : null);
}
function sceneMarker(scene, plan) { return owned(scene, "scene", plan.scene.sceneId, plan); }
function existing(runtime, plan) {
  const matches = contents(runtime.game?.scenes).filter((scene) => sceneMarker(scene, plan));
  if (matches.length > 1) throw new Error("Multiple owned Tram routing fixture Scenes were found.");
  return matches[0] ?? null;
}
function find(collection, kind, semanticId, plan) { return contents(collection).find((document) => owned(document, kind, semanticId, plan)) ?? null; }
function bounds(tile) { return tile ? { x: tile.x, y: tile.y, width: tile.width, height: tile.height } : null; }
function textureSource(tile) { return tile?.texture?.src ?? null; }
function textureAnchor(tile) { return tile ? { x: tile.texture?.anchorX ?? 0.5, y: tile.texture?.anchorY ?? 0.5 } : null; }
function regionBounds(region) { const shape = region?.shapes?.[0]; return shape ? { x: shape.x, y: shape.y, width: shape.width, height: shape.height } : null; }
function same(left, right) { return Boolean(left && right && left.x === right.x && left.y === right.y && left.width === right.width && left.height === right.height); }
function state(scene) { return scene?.flags?.[MODULE_ID]?.tramRouting ?? null; }
function statePayload(plan, board, phase) { return { [`flags.${MODULE_ID}.tramRouting`]: { version: 1, planId: plan.planId, phase, board } }; }
function foreignCounts(scene, plan) {
  const foreign = (collection) => contents(collection).filter((document) => !["wall", "door", "tile", "region"].some((kind) => owned(document, kind, document?.flags?.[MODULE_ID]?.managed?.semanticId, plan))).length;
  return Object.freeze({ walls: foreign(scene?.walls), tiles: foreign(scene?.tiles), regions: foreign(scene?.regions) });
}
function equalCounts(a, b) { return a.walls === b.walls && a.tiles === b.tiles && a.regions === b.regions; }
function describe(scene, plan) {
  const cars = plan.initialProjections.map((projection) => ({
    tramId: projection.pieceId,
    tileId: projection.tileId,
    footprintRegionId: projection.footprintRegionId,
    tile: bounds(find(scene?.tiles, "tile", projection.tileId, plan)),
    region: regionBounds(find(scene?.regions, "region", projection.footprintRegionId, plan)),
  }));
  return Object.freeze({
    sceneBound: Boolean(scene?.id), renderer: initialLevel(scene)?.background?.src ?? null,
    walls: contents(scene?.walls).filter((document) => owned(document, "wall", document?.flags?.[MODULE_ID]?.managed?.semanticId, plan)).length,
    doors: contents(scene?.walls).filter((document) => owned(document, "door", document?.flags?.[MODULE_ID]?.managed?.semanticId, plan)).length,
    staticTiles: plan.staticVisualTiles.map((visual) => ({ tileId: visual.tileId, bounds: bounds(find(scene?.tiles, "tile", visual.tileId, plan)), texture: textureSource(find(scene?.tiles, "tile", visual.tileId, plan)), anchor: textureAnchor(find(scene?.tiles, "tile", visual.tileId, plan)) })),
    staticRegions: plan.staticRegions.map((region) => ({ regionId: region.regionId, bounds: regionBounds(find(scene?.regions, "region", region.regionId, plan)) })),
    cars, state: state(scene),
  });
}
function complete(scene, plan, phase = "initial") {
  const result = describe(scene, plan);
  const wanted = phase === "moved" ? plan.approvedMoveProjection : null;
  return result.renderer === renderer(plan) && result.walls === 11 && result.doors === 3 && result.cars.length === 6
    && result.staticTiles.length === 5 && result.staticTiles.every((tile) => {
      const expected = plan.staticVisualTiles.find((visual) => visual.tileId === tile.tileId);
      return expected && same(tile.bounds, expected) && tile.texture === visualAsset(expected) && tile.anchor?.x === 0 && tile.anchor?.y === 0;
    })
    && result.staticRegions.length === 39 && result.staticRegions.every((region) => {
      const expected = plan.staticRegions.find((candidate) => candidate.regionId === region.regionId);
      return expected && same(region.bounds, expected);
    })
    && result.cars.every((car) => {
      const expected = wanted && car.tramId === wanted.pieceId ? wanted : plan.initialProjections.find((p) => p.pieceId === car.tramId);
      const document = find(scene?.tiles, "tile", car.tileId, plan);
      const anchor = textureAnchor(document);
      return same(car.tile, expected) && same(car.region, expected?.footprintRegion) && same(car.tile, car.region) && anchor?.x === 0 && anchor?.y === 0;
    })
    && result.state?.planId === plan.planId && result.state?.phase === phase;
}
function wallData(wall, plan) { return { c: [wall.a.x, wall.a.y, wall.b.x, wall.b.y], move: WALL_NORMAL, sight: WALL_NORMAL, sound: WALL_NORMAL, light: WALL_NORMAL, dir: 0, door: 0, ds: 0, ...managed("wall", wall.wallId, plan) }; }
function doorData(door, plan) { return { c: [door.position.x, door.position.y - door.clearance, door.position.x, door.position.y + door.clearance], move: WALL_NORMAL, sight: WALL_NORMAL, sound: WALL_NORMAL, light: WALL_NORMAL, dir: 0, door: 1, ds: 0, ...managed("door", door.anchorId, plan) }; }
function visualAsset(tile) { return `modules/${MODULE_ID}/assets/tiles/${tile.assetPath.split("/").at(-1)}`; }
function staticTileData(tile, plan) { return { name: tile.tileId, x: tile.x, y: tile.y, width: tile.width, height: tile.height, texture: { src: visualAsset(tile), anchorX: 0, anchorY: 0, fit: "fill" }, locked: true, alpha: 1, hidden: false, ...managed("tile", tile.tileId, plan) }; }
function tramCarAsset(projection, plan) {
  const piece = plan.initialBoard.pieces.find((candidate) => candidate.pieceId === projection.pieceId);
  if (!piece) throw new Error(`Unknown Tram projection piece: ${projection.pieceId}`);
  const asset = piece.orientation === "vertical" ? "ascendancy-tram-car-vertical-v1.svg" : "ascendancy-tram-car-horizontal-v1.svg";
  return `modules/${MODULE_ID}/assets/tiles/${asset}`;
}
function tileData(projection, plan) { return { name: projection.tileId, x: projection.x, y: projection.y, width: projection.width, height: projection.height, texture: { src: tramCarAsset(projection, plan), anchorX: 0, anchorY: 0, fit: "fill" }, locked: true, alpha: 1, hidden: false, ...managed("tile", projection.tileId, plan) }; }
function regionData(projection, plan) { const b = projection.footprintRegion; return { name: projection.footprintRegionId, shapes: [{ type: "rectangle", x: b.x, y: b.y, width: b.width, height: b.height, rotation: 0 }], locked: true, color: "#e1a634", ...managed("region", projection.footprintRegionId, plan) }; }
function staticRegionData(region, plan) { return { name: region.regionId, shapes: [{ type: "rectangle", x: region.x, y: region.y, width: region.width, height: region.height, rotation: 0 }], locked: true, color: "#e1a634", ...managed("region", region.regionId, plan) }; }
function visualRefreshUpdates(scene, plan) {
  if (!scene || !sceneMarker(scene, plan)) throw new Error("The owned Tram routing fixture Scene is unavailable.");
  if (initialLevel(scene)?.background?.src !== renderer(plan)) throw new Error("The owned fixture renderer binding drifted; visual refresh will not compensate for geometry or renderer drift.");
  const expected = [
    ...plan.staticVisualTiles.map((tile) => ({ semanticId: tile.tileId, bounds: tile, source: visualAsset(tile) })),
    ...plan.initialProjections.map((projection) => ({ semanticId: projection.tileId, bounds: null, source: tramCarAsset(projection, plan), projection })),
  ];
  return expected.map((entry) => {
    const tile = find(scene.tiles, "tile", entry.semanticId, plan);
    if (!tile?.id) throw new Error(`Owned visual Tile is missing: ${entry.semanticId}`);
    if (entry.bounds && !same(bounds(tile), entry.bounds)) throw new Error(`Owned static visual Tile bounds drifted: ${entry.semanticId}`);
    if (entry.projection) {
      const footprint = find(scene.regions, "region", entry.projection.footprintRegionId, plan);
      if (!footprint || !same(bounds(tile), regionBounds(footprint))) throw new Error(`Owned Tram Tile and footprint Region no longer agree: ${entry.semanticId}`);
    }
    const anchor = textureAnchor(tile);
    return Object.freeze({ semanticId: entry.semanticId, tileId: tile.id, from: textureSource(tile), to: entry.source, fromAnchor: anchor, toAnchor: Object.freeze({ x: 0, y: 0 }), anchorDrift: anchor?.x !== 0 || anchor?.y !== 0 });
  });
}

export class TramRoutingFixtureInstaller {
  constructor({ runtime = globalThis, plan, now = () => Date.now() } = {}) { this.runtime = runtime; this.plan = validatePlan(plan); this.now = now; this.previewToken = null; }
  previewInstall() {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    try {
      const scene = existing(this.runtime, this.plan);
      if (scene && !complete(scene, this.plan) && (contents(scene.walls).length || contents(scene.tiles).length || contents(scene.regions).length)) return Object.freeze({ operation: "tram-routing.fixture.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Owned routing fixture is partial or drifted; reread/recovery is required."], gate: runtimeGate });
      const token = `${this.now().toString(36)}-tram-routing-install`;
      this.previewToken = { token, kind: "install", expiresAt: this.now() + PLAN_TTL_MS };
      return Object.freeze({ operation: "tram-routing.fixture.preview", status: "PASS", evidenceClass: "deterministic", noWrite: true, planToken: token, expiresAt: new Date(this.previewToken.expiresAt).toISOString(), counts: { walls: 11, doors: 3, staticTiles: 5, dynamicTiles: 6, staticRegions: 39, footprintRegions: 6 }, preservationScope: this.plan.preservationScope, gate: runtimeGate });
    } catch (error) { return Object.freeze({ operation: "tram-routing.fixture.preview", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true, gate: runtimeGate }); }
  }
  async applyInstall({ approved = false, planToken } = {}) {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    if (!approved || this.previewToken?.kind !== "install" || this.previewToken?.token !== planToken || this.previewToken.expiresAt <= this.now()) return Object.freeze({ operation: "tram-routing.fixture.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Apply requires the current reviewed install preview token."], gate: runtimeGate });
    this.previewToken = null;
    let scene = null; let sceneCreated = false;
    try {
      scene = existing(this.runtime, this.plan);
      if (scene && complete(scene, this.plan)) return Object.freeze({ operation: "tram-routing.fixture.apply", status: "PASS", evidenceClass: "observed", noWrite: true, alreadyApplied: true, readback: describe(scene, this.plan), authoritativeReread: true, foreignStatePreserved: true });
      if (scene) return Object.freeze({ operation: "tram-routing.fixture.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["The owned routing Scene already contains a partial or drifted projection."], rereadRequired: true });
      scene = await this.runtime.Scene.create({ name: this.plan.scene.label, width: 1536, height: 1024, padding: 0, backgroundColor: "#080b10", grid: { type: 0, size: 64, distance: 5, units: "grid-unit" }, ...managed("scene", this.plan.scene.sceneId, this.plan) }); sceneCreated = true;
      scene = await reread(this.runtime, scene);
      const before = foreignCounts(scene, this.plan);
      const level = initialLevel(scene);
      if (!scene || !level || typeof level.update !== "function" || typeof scene.createEmbeddedDocuments !== "function" || typeof scene.update !== "function") throw new Error("Required Foundry 14 Scene, Level, or embedded-document API is unavailable.");
      await scene.createEmbeddedDocuments("Wall", [...this.plan.walls.segments.map((wall) => wallData(wall, this.plan)), ...this.plan.walls.doors.map((door) => doorData(door, this.plan))]);
      await level.update({ background: { ...(level.background?.toObject?.() ?? level.background ?? {}), src: renderer(this.plan) } });
      scene = await reread(this.runtime, scene); if (!scene || initialLevel(scene)?.background?.src !== renderer(this.plan)) throw new Error("Renderer reread failed before Tile/Region projection.");
      await scene.createEmbeddedDocuments("Tile", [...this.plan.staticVisualTiles.map((tile) => staticTileData(tile, this.plan)), ...this.plan.initialProjections.map((projection) => tileData(projection, this.plan))]);
      await scene.createEmbeddedDocuments("Region", [...this.plan.staticRegions.map((region) => staticRegionData(region, this.plan)), ...this.plan.initialProjections.map((projection) => regionData(projection, this.plan))]);
      await scene.update(statePayload(this.plan, this.plan.initialBoard, "initial"));
      scene = await reread(this.runtime, scene);
      if (!scene || !complete(scene, this.plan) || !equalCounts(before, foreignCounts(scene, this.plan))) throw new Error("Routing fixture authoritative reread drifted or foreign state changed.");
      return Object.freeze({ operation: "tram-routing.fixture.apply", status: "PASS", evidenceClass: "created_document", noWrite: false, sceneCreated, readback: describe(scene, this.plan), authoritativeReread: true, foreignStatePreserved: true, preservationScope: this.plan.preservationScope });
    } catch (error) { const readback = scene ? await reread(this.runtime, scene).catch(() => null) : null; return Object.freeze({ operation: "tram-routing.fixture.apply", status: "UNKNOWN", evidenceClass: "unknown", noWrite: !sceneCreated, sceneCreated, error: String(error?.message ?? error), partialReadback: readback ? describe(readback, this.plan) : null, recovery: "Do not retry blindly. Reread the owned fixture Scene and preview its current state before recovery.", preservationScope: this.plan.preservationScope }); }
  }
  previewVisualRefresh() {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    try {
      const scene = existing(this.runtime, this.plan);
      const tiles = visualRefreshUpdates(scene, this.plan);
      const updates = tiles.filter((tile) => tile.from !== tile.to || tile.anchorDrift);
      const token = `${this.now().toString(36)}-tram-routing-visual-refresh`;
      this.previewToken = { token, kind: "visual-refresh", expiresAt: this.now() + PLAN_TTL_MS };
      return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.preview", status: "PASS", evidenceClass: "deterministic", noWrite: true, planToken: token, expiresAt: new Date(this.previewToken.expiresAt).toISOString(), sceneId: scene.id, updates, unchanged: tiles.length - updates.length, foundryApis: ['scene.updateEmbeddedDocuments("Tile", ...)'], preservationScope: this.plan.preservationScope, gate: runtimeGate });
    } catch (error) { return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.preview", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true, gate: runtimeGate }); }
  }
  async applyVisualRefresh({ approved = false, planToken } = {}) {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    if (!approved || this.previewToken?.kind !== "visual-refresh" || this.previewToken?.token !== planToken || this.previewToken.expiresAt <= this.now()) return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Apply requires the current reviewed visual-refresh preview token."], gate: runtimeGate });
    this.previewToken = null;
    let scene = null;
    try {
      scene = existing(this.runtime, this.plan);
      if (!scene || typeof scene.updateEmbeddedDocuments !== "function") throw new Error("Owned fixture Tile update surface is unavailable.");
      const before = foreignCounts(scene, this.plan);
      const refresh = visualRefreshUpdates(scene, this.plan);
      const updates = refresh.filter((tile) => tile.from !== tile.to || tile.anchorDrift).map((tile) => ({ _id: tile.tileId, "texture.src": tile.to, "texture.anchorX": 0, "texture.anchorY": 0, "texture.fit": "fill" }));
      if (updates.length) await scene.updateEmbeddedDocuments("Tile", updates);
      scene = await reread(this.runtime, scene);
      const after = visualRefreshUpdates(scene, this.plan);
      if (!scene || after.some((tile) => tile.from !== tile.to || tile.anchorDrift) || !equalCounts(before, foreignCounts(scene, this.plan))) throw new Error("Visual Tile refresh reread drifted or foreign state changed.");
      return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.apply", status: "PASS", evidenceClass: updates.length ? "updated_document" : "observed", noWrite: updates.length === 0, updatedTiles: updates.map((update) => update._id), readback: describe(scene, this.plan), authoritativeReread: true, foreignStatePreserved: true, preservationScope: this.plan.preservationScope });
    } catch (error) { const readback = scene ? await reread(this.runtime, scene).catch(() => null) : null; return Object.freeze({ operation: "tram-routing.fixture.visual-refresh.apply", status: "UNKNOWN", evidenceClass: "unknown", noWrite: false, error: String(error?.message ?? error), partialReadback: readback ? describe(readback, this.plan) : null, recovery: "Do not retry blindly. Reread the owned fixture Scene and preview the current visual Tile state before recovery.", preservationScope: this.plan.preservationScope }); }
  }
  previewApprovedMove() {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.move.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    try {
      const scene = existing(this.runtime, this.plan);
      if (!scene || !complete(scene, this.plan, "initial")) return Object.freeze({ operation: "tram-routing.fixture.move.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Initial routing fixture reread does not match the reviewed projection."], rereadRequired: true });
      const token = `${this.now().toString(36)}-tram-routing-move`;
      this.previewToken = { token, kind: "move", expiresAt: this.now() + PLAN_TTL_MS };
      return Object.freeze({ operation: "tram-routing.fixture.move.preview", status: "PASS", evidenceClass: "deterministic", noWrite: true, planToken: token, move: this.plan.approvedFixtureMove, projection: this.plan.approvedMoveProjection, foundryApis: ['scene.updateEmbeddedDocuments("Tile", ...)', 'scene.updateEmbeddedDocuments("Region", ...)'], authoritativeRereadBeforeCommit: true });
    } catch (error) { return Object.freeze({ operation: "tram-routing.fixture.move.preview", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true }); }
  }
  async applyApprovedMove({ approved = false, planToken } = {}) {
    const runtimeGate = gate(this.runtime, this.plan);
    if (!runtimeGate.pass) return Object.freeze({ operation: "tram-routing.fixture.move.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: runtimeGate.failed, gate: runtimeGate });
    if (!approved || this.previewToken?.kind !== "move" || this.previewToken?.token !== planToken || this.previewToken.expiresAt <= this.now()) return Object.freeze({ operation: "tram-routing.fixture.move.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Apply requires the current reviewed move preview token."], gate: runtimeGate });
    this.previewToken = null; let scene = null;
    try {
      scene = existing(this.runtime, this.plan);
      if (!scene || !complete(scene, this.plan, "initial") || typeof scene.updateEmbeddedDocuments !== "function" || typeof scene.update !== "function") throw new Error("Initial routing projection or batch-update surface is unavailable.");
      const before = foreignCounts(scene, this.plan); const moved = this.plan.approvedMoveProjection;
      const tile = find(scene.tiles, "tile", moved.tileId, this.plan); const region = find(scene.regions, "region", moved.footprintRegionId, this.plan);
      if (!tile?.id || !region?.id) throw new Error("The owned moved Tile or footprint Region is missing.");
      await scene.updateEmbeddedDocuments("Tile", [{ _id: tile.id, x: moved.x, y: moved.y, width: moved.width, height: moved.height }]);
      await scene.updateEmbeddedDocuments("Region", [{ _id: region.id, shapes: [{ type: "rectangle", ...moved.footprintRegion }] }]);
      await scene.update(statePayload(this.plan, { ...this.plan.initialBoard, moveCount: this.plan.initialBoard.moveCount + 1 }, "moved"));
      scene = await reread(this.runtime, scene);
      if (!scene || !complete(scene, this.plan, "moved") || !equalCounts(before, foreignCounts(scene, this.plan))) throw new Error("Moved routing fixture reread drifted or foreign state changed.");
      return Object.freeze({ operation: "tram-routing.fixture.move.apply", status: "PASS", evidenceClass: "updated_document", noWrite: false, move: this.plan.approvedFixtureMove, readback: describe(scene, this.plan), authoritativeReread: true, foreignStatePreserved: true, preservationScope: this.plan.preservationScope });
    } catch (error) { const readback = scene ? await reread(this.runtime, scene).catch(() => null) : null; return Object.freeze({ operation: "tram-routing.fixture.move.apply", status: "UNKNOWN", evidenceClass: "unknown", noWrite: false, error: String(error?.message ?? error), partialReadback: readback ? describe(readback, this.plan) : null, recovery: "Do not retry blindly. Reread the owned fixture Scene and preview the current state before recovery.", preservationScope: this.plan.preservationScope }); }
  }
}

export async function loadTramRoutingFixturePlan(fetcher = globalThis.fetch) {
  const response = await fetcher(`modules/${MODULE_ID}/tram-routing-fixture-package.json`, { cache: "no-store" });
  if (!response?.ok) throw new Error("The reviewed fixture Tram routing package could not be loaded.");
  return validatePlan(await response.json());
}
export async function bootstrapTramRoutingFixture(runtime = globalThis) {
  if (!runtime.game || Object.hasOwn(runtime.game, "diceboxTramRoutingFixture")) return false;
  try {
    const installer = new TramRoutingFixtureInstaller({ runtime, plan: await loadTramRoutingFixturePlan(runtime.fetch ?? globalThis.fetch) });
    Object.defineProperty(runtime.game, "diceboxTramRoutingFixture", { configurable: false, enumerable: false, writable: false, value: Object.freeze({ previewInstall: () => installer.previewInstall(), applyInstall: (approval) => installer.applyInstall(approval), previewVisualRefresh: () => installer.previewVisualRefresh(), applyVisualRefresh: (approval) => installer.applyVisualRefresh(approval), previewMove: () => installer.previewApprovedMove(), applyMove: (approval) => installer.applyApprovedMove(approval) }) });
    return true;
  } catch (error) { return false; }
}
if (typeof globalThis.Hooks?.once === "function") globalThis.Hooks.once("ready", () => void bootstrapTramRoutingFixture(globalThis));

export { PACKAGE_ID, validatePlan, tramCarAsset };
