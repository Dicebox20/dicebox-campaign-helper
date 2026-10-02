import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const sourcePath = fileURLToPath(new URL("../packages/dicebox-foundry/src/signal-rune-identity-observation.js", import.meta.url));

function child(documentName: string, id: string, flags: Record<string, unknown> = { "dicebox-campaign-helper": { managed: true, owner: "dicebox-campaign-helper", packageId: "dicebox-campaign-helper", generation: 2 } }) {
  return { documentName, id, uuid: `Scene.world.parent.${documentName}.${id}`, flags };
}

function scene(id: string, uuid: string | null) {
  return {
    documentName: "Scene", id, uuid,
    flags: { "dicebox-campaign-helper": { managed: true, owner: "dicebox-campaign-helper", packageId: "dicebox-campaign-helper", generation: 2 } },
    getEmbeddedCollection(documentName: string) {
      return { contents: documentName === "Tile" ? [child("Tile", "tile-1"), child("Tile", "foreign-tile", { "dicebox-campaign-helper": { managed: false, generation: 2 } })] : [] };
    },
  };
}

function runtime() {
  const scenes = new Map([["AneddhKAAfk5HlsA", scene("AneddhKAAfk5HlsA", "Scene.world.signal")], ["p9Mbi0CJWe9KvJhH", scene("p9Mbi0CJWe9KvJhH", "Scene.world.rune")] ]);
  return {
    game: {
      world: { id: "dbx-test-world" }, version: "14.367", system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm-1", name: "Gamemaster", isGM: true }, users: { activeGM: { id: "gm-1" } }, scenes: { get: (id: string) => scenes.get(id) },
    },
  };
}

describe("M1132 fixed Foundry identity observation transport", () => {
  it("reads fixed parents and child identity through a redacted no-write receipt", async () => {
    const module = await import(sourcePath);
    const result = module.readSignalRuneIdentityObservation(runtime());
    expect(result).toMatchObject({ operation: "dicebox.ascendancy.signal-rune.native-document.identity-observation", status: "OBSERVED", redacted: true, noWrite: true, apply: false, runtimeBinding: "not-created", payload: "not-materialized", dispatch: "disabled", readyClaim: false });
    expect(result.scenes).toHaveLength(2);
    expect(result.scenes[0].parent).toMatchObject({ documentId: "AneddhKAAfk5HlsA", uuid: "Scene.world.signal", generation: 2, status: "observed", ownership: "owned" });
    expect(result.scenes[0].children.status).toBe("observed");
    expect(result.scenes[0].children.entries.find((entry: any) => entry.documentId === "foreign-tile").ownership).toBe("foreign");
    expect(result.scenes[0].children.shapeSummary.find((entry: any) => entry.documentType === "Tile")).toMatchObject({ count: 2, fieldPresence: { documentName: true, id: true, uuid: true, generation: true }, fieldCompleteness: { documentName: true, id: true, uuid: true, generation: true }, ownershipPresence: { owned: true, foreign: true, unknown: false } });
  });

  it("fails closed on world/GM drift and keeps incomplete identity unresolved", async () => {
    const module = await import(sourcePath);
    expect(module.readSignalRuneIdentityObservation({ ...runtime(), game: { ...runtime().game, world: { id: "foreign-world" } } })).toMatchObject({ status: "BLOCKED", noWrite: true, apply: false });
    expect(module.readSignalRuneIdentityObservation({ ...runtime(), game: { ...runtime().game, user: { id: "player", name: "Player", isGM: false } } })).toMatchObject({ status: "BLOCKED", noWrite: true });
    const incomplete = { ...runtime(), game: { ...runtime().game, scenes: { get: (id: string) => id === "AneddhKAAfk5HlsA" ? { documentName: "Scene", id, uuid: null } : null } } };
    const result = module.readSignalRuneIdentityObservation(incomplete);
    expect(result.status).toBe("OBSERVED");
    expect(result.scenes[0].parent).toMatchObject({ uuid: "unresolved", generation: "unresolved", status: "partial" });
    expect(result.scenes[0].children).toMatchObject({ status: "unresolved", entries: "unresolved" });
    expect(result.scenes[0].children.shapeSummary).toBe("unresolved");
  });

  it("registers only a GM close-only control and contains no unrestricted execution", async () => {
    const source = await readFile(sourcePath, "utf8");
    expect(source).toContain('globalThis.Hooks.once("ready"');
    expect(source).not.toContain('globalThis.Hooks.once("init"');
    expect(source).toContain("buttons: [{ action: \"close\"");
    expect(source).not.toContain("eval(");
    expect(source).not.toContain("new Function");
    expect(source).not.toContain("createEmbeddedDocuments");
    expect(source).not.toContain("updateEmbeddedDocuments");
    expect(source).not.toContain("deleteEmbeddedDocuments");
  });

  it("registers the fixed control when the ready-time current GM is available", async () => {
    const module = await import(sourcePath);
    const listeners: Record<string, (controls: any) => void> = {};
    const liveRuntime = { ...runtime(), Hooks: { on: (name: string, listener: (controls: any) => void) => { listeners[name] = listener; } } };
    expect(module.registerSignalRuneIdentityObservationControl(liveRuntime)).toBe(true);
    const controls = { tokens: { tools: {} as Record<string, unknown> } };
    const readyListener = listeners.getSceneControlButtons;
    expect(readyListener).toBeTypeOf("function");
    readyListener?.(controls);
    expect(controls.tokens.tools["dicebox-signal-rune-identity-observation"]).toMatchObject({ button: true, visible: true });
  });
});
