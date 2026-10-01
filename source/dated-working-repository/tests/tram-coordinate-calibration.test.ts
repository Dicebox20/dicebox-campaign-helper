import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
// @ts-expect-error Foundry browser adapter is tested against a narrow fixture runtime.
import { AUTO_HIDE_MS, TramCoordinateCalibration, bootstrapTramCoordinateCalibration, createTramCoordinateManifest } from "../packages/dicebox-foundry/src/tram-coordinate-calibration.js";

const plan = JSON.parse(readFileSync(resolve(import.meta.dirname, "../packages/dicebox-foundry/tram-routing-fixture-package.json"), "utf8"));
const adapterSource = readFileSync(resolve(import.meta.dirname, "../packages/dicebox-foundry/src/tram-coordinate-calibration.js"), "utf8");
const managed = (kind: string, semanticId: string) => ({ "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:fixture-tram-routing-projection", planId: plan.planId, kind, semanticId } } });

function runtimeFixture() {
  let host: any = null;
  const forbidden = vi.fn(() => { throw new Error("Foundry document mutation was attempted"); });
  const walls = [
    ...plan.walls.segments.map((wall: any, index: number) => ({ id: `w${index}`, c: [wall.a.x, wall.a.y, wall.b.x, wall.b.y], flags: managed("wall", wall.wallId) })),
    ...plan.walls.doors.map((door: any, index: number) => ({ id: `d${index}`, c: [door.position.x, door.position.y - door.clearance, door.position.x, door.position.y + door.clearance], flags: managed("door", door.anchorId) })),
    { id: "foreign-wall", c: [0, 0, 1, 1], flags: { foreign: true } },
  ];
  const tileDocument = (id: string, value: any, flags: any) => ({ id, x: value.x, y: value.y, width: value.width, height: value.height, texture: { anchorX: 0, anchorY: 0 }, object: { bounds: { x: value.x, y: value.y, width: value.width, height: value.height } }, flags });
  const tiles = [
    ...plan.staticVisualTiles.map((tile: any, index: number) => tileDocument(`s${index}`, tile, managed("tile", tile.tileId))),
    ...plan.initialProjections.map((projection: any, index: number) => tileDocument(`t${index}`, projection, managed("tile", projection.tileId))),
    { id: "foreign-tile", x: 0, y: 0, width: 1, height: 1, flags: { foreign: true } },
  ];
  const regions = [
    ...plan.staticRegions.map((region: any, index: number) => ({ id: `r${index}`, shapes: [{ x: region.x, y: region.y, width: region.width, height: region.height }], flags: managed("region", region.regionId) })),
    ...plan.initialProjections.map((projection: any, index: number) => ({ id: `f${index}`, shapes: [{ ...projection.footprintRegion }], flags: managed("region", projection.footprintRegionId) })),
    { id: "foreign-region", shapes: [{ x: 0, y: 0, width: 1, height: 1 }], flags: { foreign: true } },
  ];
  const scene: any = {
    id: "fixture-routing-scene", uuid: "Scene.fixture-routing-scene", width: 1536, height: 1024,
    initialLevel: { background: { src: "modules/dicebox-campaign-helper/assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png" } },
    walls: { contents: walls }, tiles: { contents: tiles }, regions: { contents: regions },
    flags: { ...managed("scene", plan.scene.sceneId), "dicebox-campaign-helper": { ...managed("scene", plan.scene.sceneId)["dicebox-campaign-helper"], tramRouting: { phase: "initial" } } },
    createEmbeddedDocuments: forbidden, updateEmbeddedDocuments: forbidden, update: forbidden,
  };
  const runtime: any = {
    game: { version: "14.367", world: { id: "dbx-test-world" }, system: { id: "dnd5e", version: "5.3.3" }, user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } }, scenes: { contents: [scene] } },
    canvas: { scene, clientCoordinatesFromCanvas: vi.fn(({ x, y }) => ({ x: x * 2 + 10, y: y * 2 + 20 })) },
    document: {
      body: { appendChild: (value: any) => { host = value; } },
      createElement: () => ({ id: "", style: {}, dataset: {}, innerHTML: "", remove: vi.fn() }),
      getElementById: () => host,
    },
    Hooks: { on: vi.fn(() => 1), off: vi.fn() }, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  };
  return { runtime, scene, forbidden, getHost: () => host };
}

describe("fixture Tram coordinate calibration overlay", () => {
  it("automatically renders only after the owned fixture canvas becomes ready", () => {
    expect(adapterSource).toContain('runtime.Hooks.on("canvasReady"');
    expect(adapterSource).toContain('receipt.status === "PASS" && receipt.activeCanvasScene');
    expect(adapterSource).toContain('runtime.Hooks.on("canvasTearDown"');
  });

  it("uses the owned Scene.view client API as the bounded recovery and then renders automatically", async () => {
    const { runtime, scene, forbidden, getHost } = runtimeFixture();
    const callbacks: Record<string, () => void> = {};
    runtime.Hooks = { on: vi.fn((name: string, callback: () => void) => { callbacks[name] = callback; return 1; }), off: vi.fn() };
    runtime.setTimeout = vi.fn();
    runtime.canvas.scene = { id: "default-scene" };
    scene.view = vi.fn(async () => { runtime.canvas.scene = scene; callbacks.canvasReady?.(); });
    runtime.fetch = vi.fn(async () => ({ ok: true, json: async () => plan }));
    await expect(bootstrapTramCoordinateCalibration(runtime)).resolves.toBe(true);
    expect(scene.view).toHaveBeenCalledOnce();
    expect(getHost().innerHTML).toContain("TRAM COORDINATES: MATCH");
    expect(runtime.setTimeout).toHaveBeenCalledWith(expect.any(Function), AUTO_HIDE_MS);
    expect(forbidden).not.toHaveBeenCalled();
  });

  it("derives a fixed two-anchor board and cross-scene rail landmark manifest", () => {
    expect(createTramCoordinateManifest(plan)).toMatchObject({
      board: { x: 420, y: 210, width: 660, height: 570, columns: 6, rows: 6, cellWidth: 110, cellHeight: 95 },
      rail: { from: { x: 1080, y: 447.5 }, to: { x: 1512, y: 447.5 } },
      landmarks: [{ id: "board-northwest" }, { id: "board-southeast" }, { id: "core-door-center" }],
      mutation: "none",
    });
  });

  it("rereads every owned geometry projection, uses Foundry native conversion, and never calls document mutation APIs", () => {
    const { runtime, forbidden, getHost } = runtimeFixture();
    const calibration = new TramCoordinateCalibration({ runtime, plan });
    const receipt = calibration.inspect();
    expect(receipt).toMatchObject({ status: "PASS", noWrite: true, geometryStatus: "MATCH", authoritativeReread: true, foreignStatePreserved: true, foundryDocumentMutations: 0 });
    expect(receipt.checks).toHaveLength(1 + 1 + 11 + 3 + (5 * 3) + 39 + (6 * 3) + 6);
    expect(receipt.checks).toContainEqual(expect.objectContaining({ id: "dbx:tile:tram-rail-grid:rendered", status: "MATCH", observed: expect.objectContaining({ source: "canvas-placeable-bounds" }) }));
    expect(receipt.foreignDocumentCounts).toEqual({ walls: 1, tiles: 1, regions: 1 });
    const shown = calibration.show();
    expect(shown).toMatchObject({ status: "PASS", overlay: { status: "VISIBLE", nativeCoordinateApi: "canvas.clientCoordinatesFromCanvas" } });
    expect(runtime.canvas.clientCoordinatesFromCanvas).toHaveBeenCalled();
    expect(getHost().innerHTML).toContain("TRAM COORDINATES: MATCH");
    expect(getHost().innerHTML).toContain("Core door (1512,447.5)");
    expect(JSON.parse(getHost().dataset.calibrationReceipt)).toMatchObject({ geometryStatus: "MATCH", noWrite: true });
    expect(calibration.hide()).toMatchObject({ status: "PASS", noWrite: true });
    expect(forbidden).not.toHaveBeenCalled();
  });

  it("reports exact owned-document drift without compensating Scene geometry", () => {
    const { runtime, scene, forbidden } = runtimeFixture();
    scene.tiles.contents.find((tile: any) => tile.flags?.["dicebox-campaign-helper"]?.managed?.semanticId === "dbx:tile:tram-rail-grid").x += 3;
    const receipt = new TramCoordinateCalibration({ runtime, plan }).inspect();
    expect(receipt.geometryStatus).toBe("DRIFT");
    expect(receipt.drifted).toContainEqual(expect.objectContaining({ id: "dbx:tile:tram-rail-grid", status: "DRIFT", maxDelta: 3 }));
    expect(forbidden).not.toHaveBeenCalled();
  });

  it("detects Foundry v14 default center anchors even when stored Tile fields match the plan", () => {
    const { runtime, scene, forbidden } = runtimeFixture();
    const tile = scene.tiles.contents.find((entry: any) => entry.flags?.["dicebox-campaign-helper"]?.managed?.semanticId === "dbx:tile:tram-rail-grid");
    tile.texture.anchorX = 0.5;
    tile.texture.anchorY = 0.5;
    tile.object.bounds = { x: tile.x - (tile.width / 2), y: tile.y - (tile.height / 2), width: tile.width, height: tile.height };
    const receipt = new TramCoordinateCalibration({ runtime, plan }).inspect();
    expect(receipt.geometryStatus).toBe("DRIFT");
    expect(receipt.drifted).toContainEqual(expect.objectContaining({ id: "dbx:tile:tram-rail-grid:anchor", kind: "tile-anchor", status: "DRIFT", observed: [0.5, 0.5] }));
    expect(receipt.drifted).toContainEqual(expect.objectContaining({ id: "dbx:tile:tram-rail-grid:rendered", kind: "rendered-tile", status: "DRIFT" }));
    expect(forbidden).not.toHaveBeenCalled();
  });

  it("accepts Foundry's half-pixel Wall endpoint serialization without moving the Blueprint", () => {
    const { runtime, scene, forbidden } = runtimeFixture();
    const north = scene.walls.contents.find((wall: any) => wall.flags?.["dicebox-campaign-helper"]?.managed?.semanticId === "dbx:wall:ascendancy-tram-depot-east-north");
    const south = scene.walls.contents.find((wall: any) => wall.flags?.["dicebox-campaign-helper"]?.managed?.semanticId === "dbx:wall:ascendancy-tram-depot-east-south");
    north.c[3] = 368;
    south.c[1] = 528;
    const receipt = new TramCoordinateCalibration({ runtime, plan }).inspect();
    expect(receipt.geometryStatus).toBe("MATCH");
    expect(receipt.checks).toContainEqual(expect.objectContaining({ id: "dbx:wall:ascendancy-tram-depot-east-north", status: "MATCH", maxDelta: 0.5, tolerance: 0.5 }));
    expect(receipt.checks).toContainEqual(expect.objectContaining({ id: "dbx:wall:ascendancy-tram-depot-east-south", status: "MATCH", maxDelta: 0.5, tolerance: 0.5 }));
    expect(forbidden).not.toHaveBeenCalled();
  });
});
