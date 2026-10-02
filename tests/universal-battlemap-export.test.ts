import { describe, expect, it } from "vitest";
import {
  assertUniversalVttRoundTrip,
  createAscendancyMapBlueprints,
  createAscendancyRegionPlans,
  createUniversalBattlemapExport,
} from "@dicebox/compiler";

const renderer = {
  path: "assets/maps/review-only.png",
  sha256: "A".repeat(64),
  width: 1536,
  height: 1024,
};

function blueprint(key: string) {
  const result = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === `dbx:blueprint:${key}`);
  if (result === undefined) throw new Error(`Missing test blueprint ${key}`);
  return result;
}

function regionPlan(key: string) {
  const result = createAscendancyRegionPlans().find((candidate) => candidate.roomId === `dbx:room:${key}`);
  if (result === undefined) throw new Error(`Missing test Region plan ${key}`);
  return result;
}

describe("Universal Battlemap Importer export", () => {
  it("converts Signal geometry to UVTT units while retaining DiceBox Regions in a sidecar", () => {
    const signal = blueprint("signal-frequency-chamber");
    const { uvtt, regionSidecar } = createUniversalBattlemapExport(signal, regionPlan("signal-frequency-chamber"), renderer);

    expect(uvtt).toMatchObject({
      format: 0.2,
      resolution: { map_origin: { x: 0, y: 0 }, map_size: { x: 24, y: 16 }, pixels_per_grid: 64 },
    });
    expect(uvtt.line_of_sight).toHaveLength(6);
    expect(uvtt.portals).toEqual([
      { position: { x: 12, y: 0.375 }, bounds: [{ x: 10.75, y: 0.375 }, { x: 13.25, y: 0.375 }], closed: true },
      { position: { x: 12, y: 15.625 }, bounds: [{ x: 10.75, y: 15.625 }, { x: 13.25, y: 15.625 }], closed: true },
    ]);
    expect(regionSidecar).toMatchObject({
      geometryOwner: "spatial-blueprint",
      source: { blueprintId: "dbx:blueprint:signal-frequency-chamber", rendererPath: renderer.path },
      importBoundary: "Universal VTT does not carry DiceBox Regions, RegionBehaviors, puzzle state, or Foundry UUID bindings.",
    });
    expect(regionSidecar.regions.map((region) => region.regionId)).toEqual([
      "dbx:region:signal-aleister-frequency",
      "dbx:region:signal-sprocket-circuit",
      "dbx:region:signal-cooperative-left",
      "dbx:region:signal-cooperative-right",
      "dbx:region:signal-entry",
      "dbx:region:signal-exit",
    ]);
    expect(regionSidecar.regions.map((region) => region.label)).toEqual([
      "Aleister frequency station",
      "Sprocket circuit station",
      "Physical frequency circuit left",
      "Physical frequency circuit right",
      "Signal chamber entry",
      "Signal chamber exit",
    ]);
    assertUniversalVttRoundTrip(signal, uvtt);
  });

  it("retains the Tram-to-Core shared y=447.5 door centerline in UVTT portal units", () => {
    const tram = createUniversalBattlemapExport(blueprint("ascendancy-tram-depot"), regionPlan("ascendancy-tram-depot"), renderer);
    const core = createUniversalBattlemapExport(blueprint("central-core-control-chamber"), regionPlan("central-core-control-chamber"), renderer);

    expect(tram.uvtt.line_of_sight).toHaveLength(11);
    expect(tram.uvtt.portals).toHaveLength(3);
    expect(core.uvtt.line_of_sight).toHaveLength(7);
    expect(core.uvtt.portals).toHaveLength(3);
    expect(tram.uvtt.portals[0]?.position).toEqual({ x: 23.625, y: 447.5 / 64 });
    expect(core.uvtt.portals[2]?.position).toEqual({ x: 0.375, y: 447.5 / 64 });
    assertUniversalVttRoundTrip(blueprint("ascendancy-tram-depot"), tram.uvtt);
    assertUniversalVttRoundTrip(blueprint("central-core-control-chamber"), core.uvtt);
  });

  it("fails closed when a Region plan, Blueprint, or renderer cannot share one coordinate system", () => {
    expect(() => createUniversalBattlemapExport(blueprint("signal-frequency-chamber"), regionPlan("rune-mechanism-chamber"), renderer)).toThrow("matching Blueprint and Region plan rooms");
    expect(() => createUniversalBattlemapExport(blueprint("signal-frequency-chamber"), regionPlan("signal-frequency-chamber"), { ...renderer, width: 1500 })).toThrow("Renderer dimensions");
  });
});
