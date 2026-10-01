import { describe, expect, it } from "vitest";
import {
  createFoundryScenePlaceableReadAdapter,
  type FoundryEmbeddedPlaceableDocument,
  type FoundryScenePlaceableDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const sceneBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("scene", "placeable-room"), kind: "scene" },
  runtime: "foundry",
  documentType: "Scene",
  documentId: "scene-1",
  uuid: "Scene.world.scene-1",
  generation: 1,
};

const tileBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("asset", "floor-tile"), kind: "asset" },
  runtime: "foundry",
  documentType: "Tile",
  documentId: "tile-1",
  uuid: "Scene.world.scene-1.Tile.tile-1",
  generation: 1,
};

const tile: FoundryEmbeddedPlaceableDocument = {
  id: tileBinding.documentId,
  uuid: tileBinding.uuid,
  documentName: "Tile",
  name: "Floor Tile",
  x: 100,
  y: 200,
  width: 500,
  height: 400,
  rotation: 15,
  texture: { src: "assets/floor.png" },
};

const token: FoundryEmbeddedPlaceableDocument = {
  id: "token-2",
  uuid: "Scene.world.scene-1.Token.token-2",
  documentName: "Token",
  name: "Guard",
  x: 300,
  y: 400,
  width: 100,
  height: 100,
  rotation: 0,
};

function makeScene(
  overrides: Partial<FoundryScenePlaceableDocument> = {},
): FoundryScenePlaceableDocument {
  return {
    id: sceneBinding.documentId,
    uuid: sceneBinding.uuid,
    documentName: "Scene",
    getEmbeddedCollection(documentType) {
      if (documentType === "Tile") return { contents: [tile] };
      if (documentType === "Token") return { contents: [token] };
      return { contents: [] };
    },
    getEmbeddedDocument(documentType, documentId) {
      if (documentType === "Tile" && documentId === tileBinding.documentId) return tile;
      if (documentType === "Token" && documentId === token.id) return token;
      return null;
    },
    ...overrides,
  };
}

describe("read-only Foundry embedded placeable observation adapter", () => {
  it("reads an exact Tile through Scene.getEmbeddedDocument", async () => {
    let calls = 0;
    const adapter = createFoundryScenePlaceableReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === sceneBinding.uuid ? makeScene() : null;
      },
    });

    const result = await adapter.read({ sceneBinding, placeableBinding: tileBinding });

    expect(adapter.adapterId).toBe("foundry.scene-placeable.read@14.367");
    expect(adapter.foundryApi).toEqual({
      sceneResolve: "fromUuid",
      embeddedCollection: "scene.getEmbeddedCollection",
      embeddedDocument: "scene.getEmbeddedDocument",
    });
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        documentType: "Tile",
        documentId: tileBinding.documentId,
        uuid: tileBinding.uuid,
        displayName: "Floor Tile",
        binding: tileBinding,
        position: { x: 100, y: 200 },
        dimensions: { width: 500, height: 400 },
        rotation: 15,
        mediaReferencePresent: true,
      },
    });
  });

  it("lists a typed embedded collection through the exact game.scenes fallback", async () => {
    let calls = 0;
    const adapter = createFoundryScenePlaceableReadAdapter({
      game: {
        scenes: {
          get: (id) => {
            calls += 1;
            return id === sceneBinding.documentId ? makeScene() : null;
          },
        },
      },
    });

    const result = await adapter.list(sceneBinding, "Token");

    expect(adapter.foundryApi.sceneResolve).toBe("game.scenes.get");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        sceneBinding,
        documentType: "Token",
        count: 1,
        entries: [{
          documentType: "Token",
          documentId: "token-2",
          uuid: "Scene.world.scene-1.Token.token-2",
          displayName: "Guard",
        }],
      },
    });
  });

  it("returns null for missing documents and rejects foreign or unauthorized bindings", async () => {
    const adapter = createFoundryScenePlaceableReadAdapter({ fromUuid: async () => makeScene() });
    const missingBinding: RuntimeBinding = { ...tileBinding, documentId: "tile-missing", uuid: "Scene.world.scene-1.Tile.tile-missing" };
    const foreignSceneBinding: RuntimeBinding = { ...sceneBinding, uuid: "Scene.world.other" };
    const nonSceneBinding: RuntimeBinding = { ...sceneBinding, documentType: "JournalEntry" };
    const nonPlaceableBinding: RuntimeBinding = { ...tileBinding, documentType: "Region" };

    expect(await adapter.read({ sceneBinding, placeableBinding: missingBinding })).toEqual({ ok: true, value: null });
    const foreignResult = await adapter.read({ sceneBinding: foreignSceneBinding, placeableBinding: tileBinding });
    expect(foreignResult.ok).toBe(false);
    if (!foreignResult.ok) expect(foreignResult.error.code).toBe("UNKNOWN_OUTCOME");
    for (const result of [
      await adapter.read({ sceneBinding: nonSceneBinding, placeableBinding: tileBinding }),
      await adapter.read({ sceneBinding, placeableBinding: nonPlaceableBinding }),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
    }
  });

  it("fails closed on malformed collections and runtime resolution failures", async () => {
    const malformedCollection = createFoundryScenePlaceableReadAdapter({
      fromUuid: async () => makeScene({ getEmbeddedCollection: () => ({}) }),
    });
    const malformedIdentity = createFoundryScenePlaceableReadAdapter({
      fromUuid: async () => makeScene({ getEmbeddedDocument: () => ({ documentName: "Tile" }) }),
    });
    const throwing = createFoundryScenePlaceableReadAdapter({
      fromUuid: async () => { throw new Error("placeable timeout"); },
    });
    const unavailable = createFoundryScenePlaceableReadAdapter({});

    const collectionResult = await malformedCollection.list(sceneBinding, "Tile");
    const identityResult = await malformedIdentity.read({ sceneBinding, placeableBinding: tileBinding });
    const unknownResult = await throwing.read({ sceneBinding, placeableBinding: tileBinding });
    const unavailableResult = await unavailable.read({ sceneBinding, placeableBinding: tileBinding });

    expect(collectionResult.ok).toBe(false);
    if (!collectionResult.ok) expect(collectionResult.error.code).toBe("UNKNOWN_OUTCOME");
    expect(identityResult.ok).toBe(false);
    if (!identityResult.ok) expect(identityResult.error.code).toBe("UNKNOWN_OUTCOME");
    expect(unknownResult.ok).toBe(false);
    if (!unknownResult.ok) {
      expect(unknownResult.error.code).toBe("UNKNOWN_OUTCOME");
      expect(unknownResult.error.retry).toBe("after-reread");
    }
    expect(unavailableResult.ok).toBe(false);
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
  });

  it("exposes only read methods and never mutation surfaces", async () => {
    const adapter = createFoundryScenePlaceableReadAdapter({ fromUuid: async () => makeScene() });

    expect("createEmbeddedDocuments" in adapter).toBe(false);
    expect("updateEmbeddedDocuments" in adapter).toBe(false);
    expect("deleteEmbeddedDocuments" in adapter).toBe(false);
    expect("create" in adapter).toBe(false);
    expect("update" in adapter).toBe(false);
    expect("delete" in adapter).toBe(false);
  });
});
