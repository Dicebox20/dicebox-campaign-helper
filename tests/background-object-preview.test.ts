import { describe, expect, it } from "vitest";
import { createStableDiceBoxId } from "@dicebox/core";
import {
  ascendancyFixtureBackgroundObjectObservationSchema,
  ascendancyStaticBackgroundObjectPreviewSchema,
  createAscendancyStaticBackgroundObjectPreview,
  createAscendancyStaticTilePlan,
  reconcileAscendancyFixtureBackgroundObjectProjection,
} from "@dicebox/compiler";

describe("static Background Object workflow preview", () => {
  it("derives exactly 29 deterministic source-preserving previews", () => {
    const source = createAscendancyStaticTilePlan();
    const before = JSON.stringify(source);
    const first = createAscendancyStaticBackgroundObjectPreview(source);
    const second = createAscendancyStaticBackgroundObjectPreview(source);

    expect(first).toEqual(second);
    expect(JSON.stringify(source)).toBe(before);
    expect(first).toMatchObject({
      schemaVersion: "0.1.0",
      rendererPolicy: "geometry-neutral-backgrounds-only",
      authority: "visual-workflow-projection",
      geometryOwner: "spatial-blueprint",
      runtimeState: "not-modeled",
      mutation: "disabled-until-exact-runtime-gate",
    });
    expect(first.objects).toHaveLength(29);
    expect(first.objects.map((object) => ({
      sourceProjectionId: object.sourceProjectionId,
      sceneId: object.sceneId,
      label: object.label,
      bounds: object.bounds,
      sort: object.sort,
      visibility: object.visibility,
      assetRole: object.assetRole,
      assetPath: object.assetPath,
      nativeCorrespondence: object.nativeCorrespondence,
    }))).toEqual(source.tiles.map((tile) => ({
      sourceProjectionId: tile.tileId,
      sceneId: tile.sceneId,
      label: tile.label,
      bounds: tile.bounds,
      sort: tile.sort,
      visibility: tile.visibility,
      assetRole: tile.assetRole,
      assetPath: tile.assetPath,
      nativeCorrespondence: tile.nativeCorrespondence,
    })));
  });

  it("rejects count drift and native/execute-shaped additions", () => {
    const preview = createAscendancyStaticBackgroundObjectPreview();
    expect(preview.objects[0]).not.toHaveProperty("documentType");
    expect(preview).not.toHaveProperty("execute");
    expect(() => ascendancyStaticBackgroundObjectPreviewSchema.parse({
      ...preview,
      objects: preview.objects.slice(0, 28),
    })).toThrow();
    expect(() => ascendancyStaticBackgroundObjectPreviewSchema.parse({
      ...preview,
      objects: preview.objects.map((object, index) => index === 0
        ? { ...object, documentType: "Tile" }
        : object),
    })).toThrow();
  });

  it("reports exact fixture/package gaps without inferring installation", () => {
    const result = reconcileAscendancyFixtureBackgroundObjectProjection({
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      scene: {
        sceneName: "Semantic Scene Fixture",
        tiles: [
          "tram-b", "tram-c", "tram-core-rail", "tram-gate-core-door", "tram-gate-ingress",
          "tram-gate-yard-exit", "tram-o", "tram-q", "tram-r", "tram-rail-grid", "tram-x",
        ].map((key) => ({ tileId: createStableDiceBoxId("tile", key) })),
      },
    });

    expect(result).toMatchObject({
      status: "BLOCKED",
      evidenceClass: "local",
      authority: "read-only-reconciliation",
      geometryOwner: "spatial-blueprint",
      runtimeState: "not-modeled",
      mutation: "disabled",
      packageProjectionCount: 29,
      packageSceneProjectionCount: 29,
      observedTileCount: 11,
      scene: { sceneId: null, sceneName: "Semantic Scene Fixture", sceneIdMatchesPackage: false },
    });
    expect(result.overlapIds).toHaveLength(5);
    expect(result.fixtureOnlyIds).toHaveLength(6);
    expect(result.packageOnlyIds).toHaveLength(24);
    expect(result.missingReadback).toHaveLength(11);
    expect(result.blockers).toEqual([
      "scene-identity-missing",
      "fixture-only-tiles",
      "package-only-projections",
      "missing-bounds-readback",
      "missing-assets-readback",
    ]);
    expect(result).not.toHaveProperty("execute");
    expect(result).not.toHaveProperty("documentType");
  });

  it("can observe a complete exact package Scene while remaining read-only", () => {
    const preview = createAscendancyStaticBackgroundObjectPreview();
    const sceneId = createStableDiceBoxId("scene", "ascendancy-tram-depot");
    const tiles = preview.objects.filter((object) => object.sceneId === sceneId).map((object) => ({
      tileId: object.sourceProjectionId,
      bounds: object.bounds,
      assetPath: object.assetPath,
    }));
    const result = reconcileAscendancyFixtureBackgroundObjectProjection({
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      scene: { sceneId, sceneName: "Ascendancy Tram Depot", tiles },
    });

    expect(result).toMatchObject({
      status: "OBSERVED",
      packageProjectionCount: 29,
      packageSceneProjectionCount: 5,
      observedTileCount: 5,
      scene: { sceneId, sceneIdMatchesPackage: true },
      overlapIds: tiles.map((tile) => tile.tileId),
      fixtureOnlyIds: [],
      packageOnlyIds: [],
      missingReadback: [],
      boundsMismatches: [],
      assetMismatches: [],
      blockers: [],
    });
    expect(result).not.toHaveProperty("execute");
  });

  it("rejects target drift, duplicate fixture IDs, and execute-shaped observations", () => {
    const base = {
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      scene: { sceneName: "Semantic Scene Fixture", tiles: [{ tileId: createStableDiceBoxId("tile", "tram-b") }] },
    };
    expect(() => ascendancyFixtureBackgroundObjectObservationSchema.parse({
      ...base,
      target: { ...base.target, foundryVersion: "14.365" },
    })).toThrow();
    expect(() => ascendancyFixtureBackgroundObjectObservationSchema.parse({
      ...base,
      scene: { ...base.scene, tiles: [base.scene.tiles[0], base.scene.tiles[0]] },
    })).toThrow();
    expect(() => ascendancyFixtureBackgroundObjectObservationSchema.parse({ ...base, execute: true })).toThrow();
  });
});
