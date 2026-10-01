import { describe, expect, it } from "vitest";
import {
  ascendancySignalRuneIdentityReadAdapterId,
  createFoundryAscendancySignalRuneIdentityReadAdapter,
  type FoundryIdentityReadDocument,
  type FoundryIdentityReadRuntime,
} from "@dicebox/bridge";

const ownedFlags: Record<string, unknown> = { "dicebox-campaign-helper": { managed: true, owner: "dicebox-campaign-helper", packageId: "dicebox-campaign-helper", generation: 3 } };
const foreignFlags: Record<string, unknown> = { "dicebox-campaign-helper": { managed: false, generation: 4 }, "other-module": { managed: true } };

function child(documentName: string, id: string, flags = ownedFlags): FoundryIdentityReadDocument {
  return { documentName, id, uuid: `Scene.world.parent.${documentName}.${id}`, flags };
}

function scene(id: string, uuid: string | null, flags = ownedFlags, incompleteChild = false): FoundryIdentityReadDocument {
  return {
    documentName: "Scene", id, uuid, flags,
    getEmbeddedCollection(documentType) {
      if (documentType === "Tile") return { contents: [child("Tile", "tile-1"), child("Tile", "foreign-tile", foreignFlags)] };
      if (documentType === "Wall") return { contents: incompleteChild ? [{ documentName: "Wall", id: "wall-1" }] : [child("Wall", "wall-1")] };
      return { contents: [] };
    },
  };
}

function runtime(overrides: Partial<FoundryIdentityReadRuntime> = {}): FoundryIdentityReadRuntime {
  const scenes = new Map([
    ["AneddhKAAfk5HlsA", scene("AneddhKAAfk5HlsA", "Scene.world.signal")],
    ["p9Mbi0CJWe9KvJhH", scene("p9Mbi0CJWe9KvJhH", "Scene.world.rune")],
  ]);
  return {
    version: "14.367", system: { id: "dnd5e", version: "5.3.3" },
    user: { id: "gm-1", name: "Gamemaster", isGM: true }, users: { activeGM: { id: "gm-1" } },
    game: { scenes: { get: (id) => scenes.get(id) } },
    ...overrides,
  };
}

describe("M1130 versioned Foundry identity read adapter", () => {
  it("reads fixed parent and embedded identity while preserving foreign state", async () => {
    const adapter = createFoundryAscendancySignalRuneIdentityReadAdapter(runtime());
    const result = await adapter.read();
    expect(adapter.adapterId).toBe(ascendancySignalRuneIdentityReadAdapterId);
    expect(adapter.foundryApi).toEqual({ target: "game.version / game.system / game.user / game.users.activeGM", parent: "game.scenes.get", children: "scene.getEmbeddedCollection" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toMatchObject({ runtime: "foundry", runtimeBinding: "not-created", noWrite: true, apply: false, payload: "not-materialized", dispatch: "disabled", foreignState: "preserve", retryAfterUnknown: false });
    expect(result.value.scenes[0].parent).toMatchObject({ documentId: "AneddhKAAfk5HlsA", uuid: "Scene.world.signal", generation: 3, status: "observed", ownership: "owned" });
    expect(result.value.scenes[0].children.status).toBe("observed");
    if (result.value.scenes[0].children.entries === "unresolved") return;
    expect(result.value.scenes[0].children.entries.find((entry) => entry.documentId === "foreign-tile")?.ownership).toBe("foreign");
  });

  it("returns explicit partial/unresolved observations without inventing identity", async () => {
    const partial = runtime({ game: { scenes: { get: (id) => id === "AneddhKAAfk5HlsA" ? scene(id, null, {}, true) : null } } });
    const result = await createFoundryAscendancySignalRuneIdentityReadAdapter(partial).read();
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.scenes[0].parent).toMatchObject({ uuid: "unresolved", generation: "unresolved", status: "partial", ownership: "unknown" });
    expect(result.value.scenes[0].children).toMatchObject({ status: "unresolved", entries: "unresolved" });
    expect(result.value.scenes[1].parent.status).toBe("unresolved");
  });

  it("fails closed for exact target/GM drift and unknown runtime outcomes", async () => {
    const wrongVersion = await createFoundryAscendancySignalRuneIdentityReadAdapter(runtime({ version: "14.366" })).read();
    const wrongGm = await createFoundryAscendancySignalRuneIdentityReadAdapter(runtime({ user: { id: "player-1", name: "Player", isGM: false } })).read();
    const throwing = await createFoundryAscendancySignalRuneIdentityReadAdapter(runtime({ game: { scenes: { get: () => { throw new Error("timeout"); } } } })).read();
    expect(wrongVersion).toMatchObject({ ok: false, error: { code: "FORBIDDEN", retry: "never" } });
    expect(wrongGm).toMatchObject({ ok: false, error: { code: "FORBIDDEN", retry: "never" } });
    expect(throwing).toMatchObject({ ok: false, error: { code: "UNKNOWN_OUTCOME", retry: "after-reread" } });
  });

  it("exposes no mutation or binding-promotion methods", () => {
    const adapter = createFoundryAscendancySignalRuneIdentityReadAdapter(runtime());
    expect("create" in adapter).toBe(false);
    expect("update" in adapter).toBe(false);
    expect("delete" in adapter).toBe(false);
    expect("execute" in adapter).toBe(false);
    expect("resolve" in adapter).toBe(false);
  });
});
