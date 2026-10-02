import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error Foundry browser adapter is tested against a narrow fixture runtime.
import { TramRoutingFixtureInstaller } from "../packages/dicebox-foundry/src/tram-routing-fixture-installer.js";

const plan = JSON.parse(readFileSync(resolve(import.meta.dirname, "../packages/dicebox-foundry/tram-routing-fixture-package.json"), "utf8"));

function fixtureRuntime() {
  const scene: Record<string, any> = {
    id: "fixture-routing-scene",
    flags: {},
    initialLevel: { background: {}, update: async (data: any) => { scene.initialLevel.background = data.background; } },
    walls: { contents: [{ id: "foreign-wall", flags: { foreign: true } }] },
    tiles: { contents: [{ id: "foreign-tile", flags: { foreign: true } }] },
    regions: { contents: [{ id: "foreign-region", flags: { foreign: true } }] },
  };
  const plural = (kind: string) => kind === "Wall" ? "walls" : kind === "Tile" ? "tiles" : "regions";
  scene.createEmbeddedDocuments = async (kind: string, entries: Record<string, unknown>[]) => {
    const collection = scene[plural(kind)].contents;
    collection.push(...entries.map((entry, index) => ({ id: `${kind}-${collection.length + index}`, ...entry })));
    return collection;
  };
  scene.updateEmbeddedDocuments = async (kind: string, updates: Record<string, any>[]) => {
    const collection = scene[plural(kind)].contents;
    for (const update of updates) {
      const document = collection.find((entry: any) => entry.id === update._id);
      if (!document) throw new Error("missing owned document");
      Object.assign(document, update);
      if (typeof update["texture.src"] === "string") document.texture = { ...(document.texture ?? {}), src: update["texture.src"] };
      if (typeof update["texture.anchorX"] === "number") document.texture = { ...(document.texture ?? {}), anchorX: update["texture.anchorX"] };
      if (typeof update["texture.anchorY"] === "number") document.texture = { ...(document.texture ?? {}), anchorY: update["texture.anchorY"] };
      if (typeof update["texture.fit"] === "string") document.texture = { ...(document.texture ?? {}), fit: update["texture.fit"] };
    }
    return collection;
  };
  scene.update = async (update: Record<string, any>) => {
    const value = update["flags.dicebox-campaign-helper.tramRouting"];
    if (value) scene.flags["dicebox-campaign-helper"] = { ...(scene.flags["dicebox-campaign-helper"] ?? {}), tramRouting: value };
  };
  const runtime: Record<string, any> = {
    game: {
      version: "14.367", world: { id: "dbx-test-world" }, system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } },
      scenes: { contents: [] as Record<string, any>[], get: (id: string) => runtime.game.scenes.contents.find((candidate: any) => candidate.id === id) ?? null },
    },
    Scene: { create: async (data: Record<string, unknown>) => { Object.assign(scene, data); runtime.game.scenes.contents.push(scene); return scene; } },
  };
  return { runtime, scene };
}

describe("fixture Tram routing projection adapter", () => {
  it("creates fixed visual and controller projections plus six paired car Tiles/Regions, then batches only the approved solver move", async () => {
    const { runtime, scene } = fixtureRuntime();
    const installer = new TramRoutingFixtureInstaller({ runtime, plan, now: () => 1000 });
    const installPreview = installer.previewInstall();
    expect(installPreview).toMatchObject({ status: "PASS", noWrite: true, counts: { walls: 11, doors: 3, staticTiles: 5, dynamicTiles: 6, staticRegions: 39, footprintRegions: 6 } });
    expect(installPreview.gate.checks.map((check: any) => check.reason)).toContain("Scene.create must be available.");
    expect(installPreview.gate.checks.map((check: any) => check.reason)).toContain("Scene collection reread must be available.");
    const install = await installer.applyInstall({ approved: true, planToken: installPreview.planToken });
    expect(install).toMatchObject({ status: "PASS", noWrite: false, authoritativeReread: true, foreignStatePreserved: true });
    expect(scene.walls.contents).toHaveLength(15);
    expect(scene.tiles.contents).toHaveLength(12);
    expect(scene.regions.contents).toHaveLength(46);
    expect(scene.tiles.contents.find((tile: any) => tile.name === "dbx:tile:tram-rail-grid")).toMatchObject({ x: 420, y: 210, width: 660, height: 570, texture: { src: expect.stringContaining("ascendancy-tram-rail-grid-v3.svg"), anchorX: 0, anchorY: 0, fit: "fill" } });
    expect(scene.tiles.contents.find((tile: any) => tile.name === "dbx:tile:tram-x").texture.src).toContain("ascendancy-tram-car-horizontal-v1.svg");
    expect(scene.tiles.contents.find((tile: any) => tile.name === "dbx:tile:tram-b").texture.src).toContain("ascendancy-tram-car-vertical-v1.svg");
    expect(scene.regions.contents.find((region: any) => region.name === "dbx:region:tram-exit").shapes[0]).toMatchObject({ x: 1080, y: 400, width: 390, height: 95 });
    const movePreview = installer.previewApprovedMove();
    expect(movePreview).toMatchObject({ status: "PASS", noWrite: true, move: { pieceId: "dbx:tram:b", delta: -1 } });
    const moved = await installer.applyApprovedMove({ approved: true, planToken: movePreview.planToken });
    expect(moved).toMatchObject({ status: "PASS", noWrite: false, authoritativeReread: true, foreignStatePreserved: true });
    const b = moved.readback.cars.find((car: any) => car.tramId === "dbx:tram:b");
    expect(b.tile).toEqual({ x: 420, y: 495, width: 110, height: 190 });
    expect(b.region).toEqual(b.tile);
    expect(scene.tiles.contents[0].flags).toEqual({ foreign: true });
    expect(scene.regions.contents[0].flags).toEqual({ foreign: true });
  });

  it("refreshes only owned visual Tile textures after a source-art revision and preserves fixture geometry", async () => {
    const { runtime, scene } = fixtureRuntime();
    const installer = new TramRoutingFixtureInstaller({ runtime, plan, now: () => 1000 });
    const installPreview = installer.previewInstall();
    await installer.applyInstall({ approved: true, planToken: installPreview.planToken });
    for (const tile of scene.tiles.contents.filter((entry: any) => entry.flags?.["dicebox-campaign-helper"]?.managed?.kind === "tile")) {
      tile.texture.src = "modules/dicebox-campaign-helper/assets/maps/ascendancy-tram-calibration-marker-v1.svg";
      tile.texture.anchorX = 0.5;
      tile.texture.anchorY = 0.5;
    }
    const preview = installer.previewVisualRefresh();
    expect(preview).toMatchObject({ status: "PASS", noWrite: true, updates: expect.arrayContaining([expect.objectContaining({ semanticId: "dbx:tile:tram-x" }), expect.objectContaining({ semanticId: "dbx:tile:tram-rail-grid" })]) });
    const applied = await installer.applyVisualRefresh({ approved: true, planToken: preview.planToken });
    expect(applied).toMatchObject({ status: "PASS", noWrite: false, authoritativeReread: true, foreignStatePreserved: true });
    expect(scene.tiles.contents.find((tile: any) => tile.name === "dbx:tile:tram-x").texture.src).toContain("ascendancy-tram-car-horizontal-v1.svg");
    const xTile = scene.tiles.contents.find((tile: any) => tile.name === "dbx:tile:tram-x");
    expect(xTile.texture).toMatchObject({ anchorX: 0, anchorY: 0, fit: "fill" });
    const xFootprint = scene.regions.contents.find((region: any) => region.name === "dbx:region:tram-x-footprint").shapes[0];
    expect(xFootprint).toMatchObject({ x: xTile.x, y: xTile.y, width: xTile.width, height: xTile.height });
    expect(scene.tiles.contents[0].flags).toEqual({ foreign: true });
  });

  it("fails closed outside the disposable fixture", () => {
    const { runtime } = fixtureRuntime();
    runtime.game.world.id = "the-ballad-of-chauser-bill";
    expect(new TramRoutingFixtureInstaller({ runtime, plan, now: () => 1000 }).previewInstall()).toMatchObject({ status: "BLOCKED", noWrite: true });
  });
});
