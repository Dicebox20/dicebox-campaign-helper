import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error Browser-only Foundry adapter is deliberately untyped in Node.
import { TramCalibrationInstaller } from "../packages/dicebox-foundry/src/tram-calibration-installer.js";

const plan = JSON.parse(readFileSync(resolve(import.meta.dirname, "../packages/dicebox-foundry/tram-calibration-package.json"), "utf8"));

function documentFrom(data: Record<string, unknown>, kind: string, index: number) {
  return { id: `${kind}-${index}`, ...data };
}

function fixtureRuntime() {
  const scene: Record<string, any> = {
    id: "fixture-scene",
    initialLevel: { background: {}, update: async (data: any) => { scene.initialLevel.background = data.background; } },
    walls: { contents: [] },
    tiles: { contents: [{ id: "foreign-tile", flags: { other: { kept: true } } }] },
    regions: { contents: [] },
  };
  scene.createEmbeddedDocuments = async (kind: string, data: Record<string, unknown>[]) => {
    const plural = kind === "Wall" ? "walls" : kind === "Tile" ? "tiles" : "regions";
    const contents: Record<string, unknown>[] = scene[plural].contents;
    contents.push(...data.map((entry, index) => documentFrom(entry, kind, contents.length + index)));
    return contents;
  };
  const runtime = {
    game: {
      version: "14.367",
      world: { id: "dbx-test-world" },
      system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm", isGM: true },
      users: { activeGM: { id: "gm" } },
      scenes: { contents: [] as Record<string, any>[], get: (id: string) => runtime.game.scenes.contents.find((entry: any) => entry.id === id) ?? null },
    },
    Scene: { create: async (data: Record<string, unknown>) => { Object.assign(scene, data); runtime.game.scenes.contents.push(scene); return scene; } },
  };
  return { runtime, scene };
}

describe("Tram fixture coordinate calibration installer", () => {
  it("fails closed outside the disposable fixture", () => {
    const { runtime } = fixtureRuntime();
    runtime.game.world.id = "the-ballad-of-chauser-bill";
    const installer = new TramCalibrationInstaller({ runtime, plan, now: () => 100 });
    expect(installer.preview()).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(runtime.game.scenes.contents).toHaveLength(0);
  });

  it("projects the exact Tile and Region bounds after Walls and the empty renderer", async () => {
    const { runtime, scene } = fixtureRuntime();
    const installer = new TramCalibrationInstaller({ runtime, plan, now: () => 100 });
    const preview = installer.preview();
    expect(preview).toMatchObject({ status: "PASS", noWrite: true, counts: { walls: 11, doors: 3, tiles: 1, regions: 1 } });
    const receipt = await installer.apply({ approved: true, planToken: preview.planToken });
    expect(receipt).toMatchObject({ status: "PASS", sceneCreated: true, authoritativeReread: true, foreignStatePreserved: true });
    expect(scene.walls.contents).toHaveLength(14);
    expect(scene.tiles.contents).toHaveLength(2);
    expect(scene.regions.contents).toHaveLength(1);
    expect(receipt.readback.tile.bounds).toEqual({ x: 530, y: 400, width: 220, height: 95 });
    expect(receipt.readback.region.bounds).toEqual({ x: 530, y: 400, width: 220, height: 95 });
    expect(scene.tiles.contents[0].flags).toEqual({ other: { kept: true } });
    const secondPreview = installer.preview();
    const second = await installer.apply({ approved: true, planToken: secondPreview.planToken });
    expect(second).toMatchObject({ status: "PASS", noWrite: true, alreadyApplied: true });
    expect(scene.walls.contents).toHaveLength(14);
  });
});
