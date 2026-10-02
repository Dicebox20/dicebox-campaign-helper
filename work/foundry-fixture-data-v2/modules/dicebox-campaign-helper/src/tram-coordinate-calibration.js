/**
 * No-write, fixture-only Tram coordinate calibration overlay.
 *
 * The compiled Tram routing package remains geometry authority. This adapter
 * reads the owned fixture Scene, compares every reviewed Wall/door/Tile/Region
 * projection to that package, and uses Foundry's native canvas conversion for
 * the browser overlay. It never creates, updates, or deletes a Foundry
 * Document and it never rescales the Scene to fit renderer pixels.
 */
const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_ID = "dbx:package:fixture-tram-routing-projection";
const PLAN_ID = "dbx:plan:fixture-tram-routing-projection";
const OVERLAY_ID = "dicebox-tram-coordinate-calibration-overlay";
const AUTO_HIDE_MS = 10000;
const EXACT_TARGET = Object.freeze({ worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
const COORDINATE_TOLERANCE = Object.freeze({ wall: 0.5, default: 0 });

function contents(collection) { return Array.isArray(collection?.contents) ? collection.contents : []; }
function activeGm(runtime) { return Boolean(runtime.game?.user?.isGM && runtime.game?.user?.id && runtime.game?.users?.activeGM?.id === runtime.game.user.id); }
function marker(document) { return document?.flags?.[MODULE_ID]?.managed ?? null; }
function isOwned(document, kind, semanticId) {
  const value = marker(document);
  return value?.owner === MODULE_ID && value.packageId === PACKAGE_ID && value.planId === PLAN_ID && value.kind === kind && value.semanticId === semanticId;
}
function findOwned(collection, kind, semanticId) { return contents(collection).find((document) => isOwned(document, kind, semanticId)) ?? null; }
function ownedScene(runtime, plan) {
  const matches = contents(runtime.game?.scenes).filter((scene) => isOwned(scene, "scene", plan.scene.sceneId));
  if (matches.length !== 1) return { scene: null, blocker: matches.length ? "Multiple owned Tram routing fixture Scenes were found." : "The owned Tram routing fixture Scene was not found." };
  return { scene: matches[0], blocker: null };
}
function initialLevel(scene) { return scene?.initialLevel ?? scene?.firstLevel ?? (contents(scene?.levels).length === 1 ? contents(scene.levels)[0] : null); }
function rendererPath(plan) { return `modules/${MODULE_ID}/assets/maps/${plan.scene.rendererPath.split("/").at(-1)}`; }
function rect(document) { return document ? { x: document.x, y: document.y, width: document.width, height: document.height } : null; }
function tileAnchor(document) { return document ? { x: document.texture?.anchorX ?? 0.5, y: document.texture?.anchorY ?? 0.5 } : null; }
function renderedTileRect(document) {
  if (!document) return null;
  const canvasBounds = document.object?.bounds;
  if (validRect(canvasBounds)) return { x: canvasBounds.x, y: canvasBounds.y, width: canvasBounds.width, height: canvasBounds.height, source: "canvas-placeable-bounds" };
  const anchor = tileAnchor(document);
  return { x: document.x - (anchor.x * document.width), y: document.y - (anchor.y * document.height), width: document.width, height: document.height, source: "foundry-v14-anchor-derivation" };
}
function regionRect(document) { const shape = document?.shapes?.[0]; return shape ? { x: shape.x, y: shape.y, width: shape.width, height: shape.height } : null; }
function finite(value) { return typeof value === "number" && Number.isFinite(value); }
function validRect(value) { return value && [value.x, value.y, value.width, value.height].every(finite); }
function maxDelta(expected, observed) {
  if (Array.isArray(expected)) return Math.max(...expected.map((value, index) => Math.abs(value - observed[index])));
  return Math.max(...["x", "y", "width", "height"].map((key) => Math.abs(expected[key] - observed[key])));
}
function compare(id, kind, expected, observed) {
  if (!observed || (Array.isArray(expected) ? !Array.isArray(observed) || observed.length !== expected.length : !validRect(observed))) {
    return Object.freeze({ id, kind, status: "MISSING", expected, observed: observed ?? null, maxDelta: null });
  }
  const delta = maxDelta(expected, observed);
  const tolerance = COORDINATE_TOLERANCE[kind] ?? COORDINATE_TOLERANCE.default;
  return Object.freeze({ id, kind, status: delta <= tolerance ? "MATCH" : "DRIFT", expected, observed, maxDelta: delta, tolerance });
}
function validatePlan(plan) {
  const valid = plan?.schemaVersion === "0.1.0" && plan?.planId === PLAN_ID
    && plan?.target?.worldId === EXACT_TARGET.worldId
    && plan?.scene?.canvas?.width === 1536 && plan?.scene?.canvas?.height === 1024
    && plan?.walls?.segments?.length === 11 && plan?.walls?.doors?.length === 3
    && plan?.staticVisualTiles?.length === 5 && plan?.staticRegions?.length === 39
    && plan?.initialProjections?.length === 6;
  if (!valid) throw new Error("The reviewed Tram routing package is incomplete or has coordinate drift.");
  return plan;
}

export function createTramCoordinateManifest(input) {
  const plan = validatePlan(input);
  return Object.freeze({
    schemaVersion: "1.0.0",
    manifestId: "dbx:manifest:fixture-tram-coordinate-calibration-v1",
    planId: plan.planId,
    scene: Object.freeze({ semanticId: plan.scene.sceneId, width: plan.scene.canvas.width, height: plan.scene.canvas.height, renderer: rendererPath(plan) }),
    board: Object.freeze({ x: 420, y: 210, width: 660, height: 570, columns: 6, rows: 6, cellWidth: 110, cellHeight: 95 }),
    rail: Object.freeze({ from: Object.freeze({ x: 1080, y: 447.5 }), to: Object.freeze({ x: 1512, y: 447.5 }) }),
    landmarks: Object.freeze([
      Object.freeze({ id: "board-northwest", label: "Board NW (420,210)", x: 420, y: 210 }),
      Object.freeze({ id: "board-southeast", label: "Board SE (1080,780)", x: 1080, y: 780 }),
      Object.freeze({ id: "core-door-center", label: "Core door (1512,447.5)", x: 1512, y: 447.5 }),
    ]),
    tolerance: Object.freeze({ documentPixels: 0, visualReviewPixels: 2 }),
    coordinateOwner: "compiled-spatial-blueprint",
    browserProjection: "canvas.clientCoordinatesFromCanvas",
    mutation: "none",
  });
}

function runtimeGate(runtime, plan) {
  const checks = [
    [runtime.game?.world?.id === EXACT_TARGET.worldId, `Calibration is restricted to ${EXACT_TARGET.worldId}.`],
    [runtime.game?.version === EXACT_TARGET.foundryVersion, `Foundry ${EXACT_TARGET.foundryVersion} is required.`],
    [runtime.game?.system?.id === EXACT_TARGET.systemId && runtime.game?.system?.version === EXACT_TARGET.systemVersion, `D&D5e ${EXACT_TARGET.systemVersion} is required.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [plan?.planId === PLAN_ID, "The reviewed Tram routing package must be loaded."],
  ];
  const blockers = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: blockers.length === 0, checks: Object.freeze(checks.map(([pass, reason]) => Object.freeze({ pass, reason }))), blockers: Object.freeze(blockers) });
}

function expectedCarProjection(plan, scene, projection) {
  const state = scene?.flags?.[MODULE_ID]?.tramRouting;
  return state?.phase === "moved" && projection.pieceId === plan.approvedMoveProjection?.pieceId ? plan.approvedMoveProjection : projection;
}

export function inspectTramCoordinates({ runtime = globalThis, plan } = {}) {
  const reviewedPlan = validatePlan(plan);
  const manifest = createTramCoordinateManifest(reviewedPlan);
  const gate = runtimeGate(runtime, reviewedPlan);
  if (!gate.pass) return Object.freeze({ operation: "tram-routing.fixture.coordinate-calibration.inspect", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: gate.blockers, gate, manifest });
  const resolved = ownedScene(runtime, reviewedPlan);
  if (!resolved.scene) return Object.freeze({ operation: "tram-routing.fixture.coordinate-calibration.inspect", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: Object.freeze([resolved.blocker]), gate, manifest });
  const scene = resolved.scene;
  const checks = [];
  checks.push(compare("scene-canvas", "scene", { x: 0, y: 0, width: manifest.scene.width, height: manifest.scene.height }, { x: 0, y: 0, width: scene.width, height: scene.height }));
  for (const wall of reviewedPlan.walls.segments) {
    const document = findOwned(scene.walls, "wall", wall.wallId);
    checks.push(compare(wall.wallId, "wall", [wall.a.x, wall.a.y, wall.b.x, wall.b.y], document?.c ?? null));
  }
  for (const door of reviewedPlan.walls.doors) {
    const document = findOwned(scene.walls, "door", door.anchorId);
    checks.push(compare(door.anchorId, "door", [door.position.x, door.position.y - door.clearance, door.position.x, door.position.y + door.clearance], document?.c ?? null));
  }
  for (const tile of reviewedPlan.staticVisualTiles) {
    const document = findOwned(scene.tiles, "tile", tile.tileId);
    const anchor = tileAnchor(document);
    checks.push(compare(tile.tileId, "static-tile", tile, rect(document)));
    checks.push(compare(`${tile.tileId}:anchor`, "tile-anchor", [0, 0], anchor ? [anchor.x, anchor.y] : null));
    checks.push(compare(`${tile.tileId}:rendered`, "rendered-tile", tile, renderedTileRect(document)));
  }
  for (const region of reviewedPlan.staticRegions) checks.push(compare(region.regionId, "static-region", region, regionRect(findOwned(scene.regions, "region", region.regionId))));
  for (const projection of reviewedPlan.initialProjections) {
    const expected = expectedCarProjection(reviewedPlan, scene, projection);
    const document = findOwned(scene.tiles, "tile", projection.tileId);
    const anchor = tileAnchor(document);
    checks.push(compare(projection.tileId, "car-tile", expected, rect(document)));
    checks.push(compare(`${projection.tileId}:anchor`, "tile-anchor", [0, 0], anchor ? [anchor.x, anchor.y] : null));
    checks.push(compare(`${projection.tileId}:rendered`, "rendered-tile", expected, renderedTileRect(document)));
    checks.push(compare(projection.footprintRegionId, "car-footprint-region", expected.footprintRegion, regionRect(findOwned(scene.regions, "region", projection.footprintRegionId))));
  }
  const renderer = initialLevel(scene)?.background?.src ?? null;
  const rendererCheck = Object.freeze({ id: "initial-level-renderer", kind: "renderer", status: renderer === manifest.scene.renderer ? "MATCH" : "DRIFT", expected: manifest.scene.renderer, observed: renderer, maxDelta: null });
  checks.unshift(rendererCheck);
  const drifted = checks.filter((check) => check.status !== "MATCH");
  const allOwned = [
    ...contents(scene.walls).filter((document) => marker(document)?.packageId === PACKAGE_ID),
    ...contents(scene.tiles).filter((document) => marker(document)?.packageId === PACKAGE_ID),
    ...contents(scene.regions).filter((document) => marker(document)?.packageId === PACKAGE_ID),
  ];
  return Object.freeze({
    operation: "tram-routing.fixture.coordinate-calibration.inspect",
    status: "PASS",
    evidenceClass: "observed",
    noWrite: true,
    worldId: runtime.game.world.id,
    sceneId: scene.id,
    sceneUuid: scene.uuid ?? `Scene.${scene.id}`,
    activeCanvasScene: runtime.canvas?.scene?.id === scene.id,
    nativeCoordinateApiAvailable: typeof runtime.canvas?.clientCoordinatesFromCanvas === "function",
    manifest,
    geometryStatus: drifted.length ? "DRIFT" : "MATCH",
    checks: Object.freeze(checks),
    drifted: Object.freeze(drifted),
    ownedDocumentCount: allOwned.length,
    foreignDocumentCounts: Object.freeze({
      walls: contents(scene.walls).filter((document) => marker(document)?.packageId !== PACKAGE_ID).length,
      tiles: contents(scene.tiles).filter((document) => marker(document)?.packageId !== PACKAGE_ID).length,
      regions: contents(scene.regions).filter((document) => marker(document)?.packageId !== PACKAGE_ID).length,
    }),
    authoritativeReread: true,
    foreignStatePreserved: true,
    foundryDocumentMutations: 0,
    gate,
  });
}

function project(runtime, point) {
  const projected = runtime.canvas.clientCoordinatesFromCanvas({ x: point.x, y: point.y });
  if (!finite(projected?.x) || !finite(projected?.y)) throw new Error("Foundry native canvas coordinate conversion returned an invalid point.");
  return { x: projected.x, y: projected.y };
}
function projectedRect(runtime, value) {
  const a = project(runtime, { x: value.x, y: value.y });
  const b = project(runtime, { x: value.x + value.width, y: value.y + value.height });
  return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
}
function line(x1, y1, x2, y2, color, width = 2, dash = "") { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`; }

export function renderTramCoordinateOverlay({ runtime = globalThis, receipt } = {}) {
  if (receipt?.status !== "PASS") throw new Error("A successful calibration inspection receipt is required.");
  if (!receipt.activeCanvasScene) throw new Error("Open the owned DiceBox Tram Routing Projection Scene before showing its calibration overlay.");
  if (typeof runtime.canvas?.clientCoordinatesFromCanvas !== "function") throw new Error("Foundry canvas.clientCoordinatesFromCanvas is unavailable.");
  if (!runtime.document?.body || typeof runtime.document.createElement !== "function") throw new Error("The browser document overlay surface is unavailable.");
  runtime.document.getElementById?.(OVERLAY_ID)?.remove?.();
  const host = runtime.document.createElement("div");
  host.id = OVERLAY_ID;
  host.dataset.calibrationReceipt = JSON.stringify(receipt);
  Object.assign(host.style, { position: "fixed", inset: "0", zIndex: "100000", pointerEvents: "none" });
  const refresh = () => {
    const board = projectedRect(runtime, receipt.manifest.board);
    const railFrom = project(runtime, receipt.manifest.rail.from);
    const railTo = project(runtime, receipt.manifest.rail.to);
    const landmarks = receipt.manifest.landmarks.map((landmark) => ({ ...landmark, client: project(runtime, landmark) }));
    const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="overflow:visible;font-family:Arial,sans-serif">`];
    parts.push(`<rect x="${board.x}" y="${board.y}" width="${board.width}" height="${board.height}" fill="rgba(0,220,255,0.08)" stroke="#00dcff" stroke-width="3"/>`);
    for (let column = 1; column < receipt.manifest.board.columns; column += 1) parts.push(line(board.x + board.width * column / receipt.manifest.board.columns, board.y, board.x + board.width * column / receipt.manifest.board.columns, board.y + board.height, "#00dcff", 1, "6 5"));
    for (let row = 1; row < receipt.manifest.board.rows; row += 1) parts.push(line(board.x, board.y + board.height * row / receipt.manifest.board.rows, board.x + board.width, board.y + board.height * row / receipt.manifest.board.rows, "#00dcff", 1, "6 5"));
    parts.push(line(railFrom.x, railFrom.y, railTo.x, railTo.y, "#ffcf33", 4));
    for (const landmark of landmarks) {
      parts.push(`<circle cx="${landmark.client.x}" cy="${landmark.client.y}" r="8" fill="#ffcf33" stroke="#101820" stroke-width="2"/>`);
      parts.push(`<text x="${landmark.client.x + 12}" y="${landmark.client.y - 12}" fill="#ffffff" stroke="#101820" stroke-width="4" paint-order="stroke" font-size="15" font-weight="700">${landmark.label}</text>`);
    }
    const color = receipt.geometryStatus === "MATCH" ? "#45e36f" : "#ff4f64";
    const driftLabels = receipt.drifted.map((check) => check.id).join(" | ") || "none";
    parts.push(`<rect x="18" y="185" width="520" height="88" rx="8" fill="rgba(8,11,16,.9)" stroke="${color}" stroke-width="2"/>`);
    parts.push(`<text x="32" y="210" fill="${color}" font-size="17" font-weight="700">TRAM COORDINATES: ${receipt.geometryStatus}</text>`);
    parts.push(`<text x="32" y="235" fill="#ffffff" font-size="13">${receipt.drifted.length} drifted checks · no Foundry writes</text>`);
    parts.push(`<text x="32" y="257" fill="#ffffff" font-size="12">${driftLabels}</text>`);
    parts.push(`</svg>`);
    host.innerHTML = parts.join("");
  };
  runtime.document.body.appendChild(host);
  refresh();
  const subscriptions = [];
  if (typeof runtime.Hooks?.on === "function") {
    for (const hook of ["canvasPan", "canvasReady"]) { const id = runtime.Hooks.on(hook, refresh); subscriptions.push([hook, id]); }
  }
  runtime.addEventListener?.("resize", refresh);
  return Object.freeze({
    operation: "tram-routing.fixture.coordinate-calibration.overlay.show",
    status: "PASS",
    evidenceClass: "observed",
    noWrite: true,
    geometryStatus: receipt.geometryStatus,
    nativeCoordinateApi: "canvas.clientCoordinatesFromCanvas",
    overlayId: OVERLAY_ID,
    hide: () => {
      host.remove?.();
      for (const [hook, id] of subscriptions) runtime.Hooks?.off?.(hook, id);
      runtime.removeEventListener?.("resize", refresh);
      return Object.freeze({ operation: "tram-routing.fixture.coordinate-calibration.overlay.hide", status: "PASS", noWrite: true });
    },
  });
}

export class TramCoordinateCalibration {
  constructor({ runtime = globalThis, plan } = {}) { this.runtime = runtime; this.plan = validatePlan(plan); this.overlay = null; }
  inspect() { return inspectTramCoordinates({ runtime: this.runtime, plan: this.plan }); }
  show() {
    this.overlay?.hide?.();
    const receipt = this.inspect();
    if (receipt.status !== "PASS") return receipt;
    try { this.overlay = renderTramCoordinateOverlay({ runtime: this.runtime, receipt }); return Object.freeze({ ...receipt, overlay: Object.freeze({ status: "VISIBLE", overlayId: OVERLAY_ID, nativeCoordinateApi: "canvas.clientCoordinatesFromCanvas" }) }); }
    catch (error) { return Object.freeze({ operation: "tram-routing.fixture.coordinate-calibration.overlay.show", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: Object.freeze([String(error?.message ?? error)]), inspection: receipt }); }
  }
  hide() { const result = this.overlay?.hide?.() ?? Object.freeze({ operation: "tram-routing.fixture.coordinate-calibration.overlay.hide", status: "PASS", noWrite: true, alreadyHidden: true }); this.overlay = null; return result; }
  manifest() { return createTramCoordinateManifest(this.plan); }
}

export async function loadTramCoordinatePlan(fetcher = globalThis.fetch) {
  const response = await fetcher(`modules/${MODULE_ID}/tram-routing-fixture-package.json`, { cache: "no-store" });
  if (!response?.ok) throw new Error("The reviewed fixture Tram routing package could not be loaded.");
  return validatePlan(await response.json());
}
export async function bootstrapTramCoordinateCalibration(runtime = globalThis) {
  if (!runtime.game || Object.hasOwn(runtime.game, "diceboxTramCoordinateCalibration")) return false;
  try {
    const calibration = new TramCoordinateCalibration({ runtime, plan: await loadTramCoordinatePlan(runtime.fetch ?? globalThis.fetch) });
    Object.defineProperty(runtime.game, "diceboxTramCoordinateCalibration", { configurable: false, enumerable: false, writable: false, value: Object.freeze({ inspect: () => calibration.inspect(), show: () => calibration.show(), hide: () => calibration.hide(), manifest: () => calibration.manifest() }) });
    if (typeof runtime.Hooks?.on === "function") {
      runtime.Hooks.on("canvasReady", () => {
        const receipt = calibration.inspect();
        if (receipt.status === "PASS" && receipt.activeCanvasScene) {
          calibration.show();
          runtime.setTimeout?.(() => calibration.hide(), AUTO_HIDE_MS);
        }
        else calibration.hide();
      });
      runtime.Hooks.on("canvasTearDown", () => calibration.hide());
    }
    const resolved = ownedScene(runtime, calibration.plan);
    if (resolved.scene && runtime.canvas?.scene?.id !== resolved.scene.id && typeof resolved.scene.view === "function") {
      await resolved.scene.view();
    }
    return true;
  } catch { return false; }
}
if (typeof globalThis.Hooks?.once === "function") globalThis.Hooks.once("ready", () => void bootstrapTramCoordinateCalibration(globalThis));

export { AUTO_HIDE_MS, OVERLAY_ID };
