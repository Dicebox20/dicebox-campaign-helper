import { describe, expect, it } from "vitest";
import { compileSceneFoundryPreview, serializeSceneFoundryPreview } from "@dicebox/compiler";
import type { SceneDocument } from "@dicebox/scene";

const scene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 3,
  id: "dbx:scene:compiler-fixture",
  name: "Compiler Fixture",
  width: 1536,
  height: 1024,
  background: { color: 0x101820, gridSize: 64, assetId: "dbx:asset:map-background" },
  entities: [
    { id: "dbx:room:main", kind: "room", name: "Main Room", x: 96, y: 80, width: 1344, height: 864, color: 1, locked: true },
    { id: "dbx:door:east", kind: "door", name: "East Door", x: 1408, y: 448, width: 32, height: 96, color: 2, locked: false },
    { id: "dbx:region:station", kind: "region", name: "Station", x: 560, y: 352, width: 256, height: 192, color: 3, locked: false },
    { id: "dbx:apparatus:console", kind: "apparatus", name: "Console", x: 600, y: 384, width: 176, height: 112, color: 4, locked: false },
  ],
};

const asset = {
  sha256: "a".repeat(64),
  mediaType: "image/png",
  byteLength: 8,
  relativePath: `assets/sha256/${"a".repeat(64)}`,
  registration: { assetId: "dbx:asset:map-background", role: "background" as const, label: "Map background", provenance: "fixture", approval: "approved" as const },
};

describe("semantic Scene to Foundry no-write preview", () => {
  it("emits exact stable-ID candidates, initial Level background, and preservation rules", async () => {
    const preview = await compileSceneFoundryPreview({
      projectId: "dbx:project:compiler-fixture",
      scene,
      assets: [asset],
    });
    expect(preview).toMatchObject({
      operation: "dicebox.scene.compile-foundry-preview",
      sceneId: scene.id,
      sourceRevision: 3,
      mutation: "disabled-until-exact-runtime-gate",
      noWrite: true,
      blockers: [],
      preservation: { foreign: "preserve", unknown: "preserve", runtimeOwned: "preserve", cleanup: "disabled" },
    });
    expect(preview.documents.filter((document) => document.documentType === "Wall")).toHaveLength(5);
    expect(preview.documents.filter((document) => document.documentType === "Region")).toHaveLength(1);
    expect(preview.documents.filter((document) => document.documentType === "Tile")).toHaveLength(1);
    expect(preview.documents.find((document) => document.documentType === "Level")).toMatchObject({
      foundryApi: "scene.initialLevel.update(data)",
      data: { background: { src: asset.relativePath } },
    });
    expect(preview.documents.every((document) => document.runtimeId === null)).toBe(true);
    expect(preview.planSha256).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is byte-stable across asset input order and preserves an unbound renderer as a blocker", async () => {
    const secondAsset = { ...asset, sha256: "b".repeat(64), relativePath: `assets/sha256/${"b".repeat(64)}`, registration: { ...asset.registration, assetId: "dbx:asset:other-background", label: "Other background" } };
    const first = await compileSceneFoundryPreview({ projectId: "dbx:project:compiler-fixture", scene, assets: [secondAsset, asset] });
    const second = await compileSceneFoundryPreview({ projectId: "dbx:project:compiler-fixture", scene, assets: [asset, secondAsset] });
    expect(serializeSceneFoundryPreview(first)).toBe(serializeSceneFoundryPreview(second));
    const unbound = await compileSceneFoundryPreview({ projectId: "dbx:project:compiler-fixture", scene: { ...scene, background: { color: scene.background.color, gridSize: scene.background.gridSize } }, assets: [] });
    expect(unbound.blockers).toEqual(["BACKGROUND_ASSET_UNBOUND"]);
    expect(unbound.noWrite).toBe(true);
  });

  it("accepts a non-scene handout asset while keeping it out of the Scene background projection", async () => {
    const handout = {
      ...asset,
      sha256: "c".repeat(64),
      relativePath: `assets/sha256/${"c".repeat(64)}`,
      registration: { ...asset.registration, assetId: "dbx:asset:handout", role: "handout" as const, label: "Handout" },
    };
    const preview = await compileSceneFoundryPreview({ projectId: "dbx:project:compiler-fixture", scene, assets: [handout, asset] });
    expect(preview.blockers).toEqual([]);
    expect(preview.documents.find((document) => document.documentType === "Level")).toMatchObject({
      data: { background: { src: asset.relativePath } },
    });
  });

  it("rejects invalid semantic geometry and non-content-addressed assets", async () => {
    await expect(compileSceneFoundryPreview({
      projectId: "dbx:project:compiler-fixture",
      scene: { ...scene, entities: [...scene.entities, { ...scene.entities[0]!, id: "dbx:room:main" }] },
      assets: [],
    })).rejects.toThrow(/Duplicate entity ID/);
    await expect(compileSceneFoundryPreview({ projectId: "dbx:project:compiler-fixture", scene, assets: [{ ...asset, sha256: "bad" }] })).rejects.toThrow(/content-addressed/);
  });
});
