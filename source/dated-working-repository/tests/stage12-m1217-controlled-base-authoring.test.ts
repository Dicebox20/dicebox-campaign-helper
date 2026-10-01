import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error The Foundry browser entry intentionally has no local Foundry type dependency.
import { openAscendancyBaseAuthoringControl, previewAscendancyBaseAuthoring, readAscendancyBaseAuthoringPersistentWorldReread } from "../packages/dicebox-foundry/src/ascendancy-installer.js";
// @ts-expect-error The browser-only accounting module intentionally has no local Foundry type dependency.
import { clearPersistentWorldWriteAccounting } from "../packages/dicebox-foundry/src/persistent-world-write-accounting.js";

const root = resolve(import.meta.dirname, "..");
const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));

function makeRuntime(options: { approve?: boolean; foreign?: boolean; failEmbedded?: boolean } = {}) {
  let sequence = 0;
  let sceneCreateCalls = 0;
  let embeddedCreateCalls = 0;
  const waits: any[] = [];
  let confirmConfig: any;
  const scenes: any = {
    contents: options.foreign ? [{
      id: "foreign-scene",
      name: "Foreign Signal",
      flags: { "dicebox-campaign-helper": { managed: { owner: "foreign-module", packageId: "foreign", kind: "scene", semanticId: "dbx:room:signal-frequency-chamber" } } },
    }] : [],
    get: (id: string) => scenes.contents.find((scene: any) => scene.id === id),
  };
  const createScene = async (data: any) => {
    sceneCreateCalls += 1;
    sequence += 1;
    const level: any = { background: { src: null }, update: async (changes: any) => { level.background = changes.background; } };
    const scene: any = {
      id: `scene-${sequence}`,
      uuid: `Scene.scene-${sequence}`,
      name: data.name,
      width: data.width,
      height: data.height,
      flags: data.flags,
      initialLevel: level,
      walls: { contents: [] },
      regions: { contents: [] },
      tiles: { contents: [] },
      createEmbeddedDocuments: async (type: string, payload: any[]) => {
        embeddedCreateCalls += 1;
        if (options.failEmbedded && type === "Wall") throw new Error("fixture embedded write failed");
        const collection = type === "Wall" ? scene.walls : type === "Region" ? scene.regions : scene.tiles;
        const documents = payload.map((entry, index) => ({ id: `${type}-${sequence}-${index}`, ...entry }));
        collection.contents.push(...documents);
        return documents;
      },
    };
    scenes.contents.push(scene);
    return scene;
  };
  const runtime: any = {
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm", isGM: true },
      users: { activeGM: { id: "gm" } },
      scenes,
      folders: [],
    },
    foundry: {
      documents: { Scene: { create: createScene } },
      applications: { api: {
        DialogV2: {
          wait: async (config: any) => { waits.push(config); return "close"; },
          confirm: async (config: any) => { confirmConfig = config; return options.approve ?? true; },
        },
      } },
    },
    __diceboxAscendancyPackage: packageData,
  };
  return { runtime, scenes, waits, get confirmConfig() { return confirmConfig; }, get sceneCreateCalls() { return sceneCreateCalls; }, get embeddedCreateCalls() { return embeddedCreateCalls; } };
}

describe("M1217 controlled native four-Scene base authoring", () => {
  it("previews the exact four-room scope without mutation or approval", async () => {
    const fixture = makeRuntime();
    const preview = await previewAscendancyBaseAuthoring(fixture.runtime);
    expect(preview).toMatchObject({
      operation: "ascendancy.base-four-scenes.write-preview",
      status: "PREVIEWED",
      noWrite: true,
      apply: false,
      approvalRequired: true,
      approvalGranted: false,
      authoritativeRereadRequired: true,
      readyClaim: false,
      baseAuthoring: { roomIds: [
        "dbx:room:signal-frequency-chamber",
        "dbx:room:ascendancy-tram-depot",
        "dbx:room:rune-mechanism-chamber",
        "dbx:room:central-core-control-chamber",
      ] },
    });
    expect(fixture.sceneCreateCalls).toBe(0);
  });

  it("requires one explicit approval and rereads exactly four owned Scenes and base children", async () => {
    const fixture = makeRuntime({ approve: true });
    const receipt = await openAscendancyBaseAuthoringControl(fixture.runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.base-four-scenes.create",
      status: "PASS",
      evidenceClass: "fixture",
      noWrite: false,
      apply: true,
      approvalRequired: true,
      approvalGranted: true,
      authoritativeReread: true,
      retryAllowed: false,
      readyClaim: false,
      postReread: { status: "OBSERVED", rooms: [{ status: "observed" }, { status: "observed" }, { status: "observed" }, { status: "observed" }] },
      nativeWriteAccounting: { status: "OBSERVED", scope: "m1217-four-scene-base-authoring", nativeWriteCallsResolved: expect.any(Number), nativeWriteCallsUnknown: 0 },
    });
    expect(fixture.confirmConfig.window.title).toBe("Create DiceBox Ascendancy Base Scenes");
    expect(fixture.confirmConfig.yes.label).toContain("Approve fixed four-Scene base write");
    expect(fixture.confirmConfig.no.label).toBe("Cancel");
    expect(fixture.sceneCreateCalls).toBe(4);
    expect(fixture.scenes.contents.filter((scene: any) => scene.flags?.["dicebox-campaign-helper"]?.managed?.owner === "dicebox-campaign-helper")).toHaveLength(4);
    expect(fixture.embeddedCreateCalls).toBeGreaterThan(0);
    clearPersistentWorldWriteAccounting(fixture.runtime);
  });

  it("cancels before any native write and preserves foreign semantic conflicts", async () => {
    const cancelled = makeRuntime({ approve: false });
    const cancelReceipt = await openAscendancyBaseAuthoringControl(cancelled.runtime);
    expect(cancelReceipt).toMatchObject({ status: "CANCELLED", noWrite: true, approvalGranted: false, readyClaim: false });
    expect(cancelled.sceneCreateCalls).toBe(0);

    const foreign = makeRuntime({ foreign: true });
    const foreignReceipt = await openAscendancyBaseAuthoringControl(foreign.runtime);
    expect(foreignReceipt).toMatchObject({ status: "BLOCKED", noWrite: true, readyClaim: false, foreignStatePreserved: true });
    expect(foreignReceipt.blockers.join(" ")).toContain("foreign Scene");
    expect(foreign.sceneCreateCalls).toBe(0);
    expect(foreign.waits).toHaveLength(1);
  });

  it("stops without retry when a native child write has an unknown outcome", async () => {
    const fixture = makeRuntime({ approve: true, failEmbedded: true });
    const receipt = await openAscendancyBaseAuthoringControl(fixture.runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.base-four-scenes.create",
      status: "UNKNOWN",
      evidenceClass: "unknown",
      noWrite: false,
      apply: true,
      authoritativeReread: false,
      retryAllowed: false,
      nativeWriteAccounting: { status: "UNKNOWN", nativeWriteCallsUnknown: 1 },
      readyClaim: false,
    });
    expect(receipt.blockers.join(" ")).toContain("fixture embedded write failed");
    clearPersistentWorldWriteAccounting(fixture.runtime);
  });

  it("surfaces all four owned child sets as a no-write persistent reread", async () => {
    const fixture = makeRuntime({ approve: true });
    await openAscendancyBaseAuthoringControl(fixture.runtime);
    const sceneCreatesBefore = fixture.sceneCreateCalls;
    const embeddedCreatesBefore = fixture.embeddedCreateCalls;
    const receipt = await readAscendancyBaseAuthoringPersistentWorldReread(fixture.runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.base-four-scenes.persistent-world-reread",
      status: "OBSERVED",
      evidenceClass: "fixture-post-restart-reread",
      noWrite: true,
      apply: false,
      approvalRequired: false,
      approvalGranted: false,
      authoritativeReread: true,
      retryAllowed: false,
      readyClaim: false,
      persistence: { rawStorageInspected: false, postRestartAuthoritativeReread: true },
      baseAuthoring: { rooms: [
        { roomId: "dbx:room:signal-frequency-chamber", status: "observed", children: { walls: 8, regions: 6, tiles: 7, complete: true } },
        { roomId: "dbx:room:ascendancy-tram-depot", status: "observed", children: { walls: 14, regions: 39, tiles: 5, complete: true } },
        { roomId: "dbx:room:rune-mechanism-chamber", status: "observed", children: { walls: 8, regions: 6, tiles: 7, complete: true } },
        { roomId: "dbx:room:central-core-control-chamber", status: "observed", children: { walls: 10, regions: 10, tiles: 10, complete: true } },
      ] },
    });
    expect(fixture.sceneCreateCalls).toBe(sceneCreatesBefore);
    expect(fixture.embeddedCreateCalls).toBe(embeddedCreatesBefore);
    clearPersistentWorldWriteAccounting(fixture.runtime);
  });
});
