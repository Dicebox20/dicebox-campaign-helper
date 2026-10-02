import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error Browser-only Foundry adapter is deliberately untyped in Node.
import { ProgramSceneVerticalSliceAdapter, registerProgramSceneVerticalSliceControl } from "../packages/dicebox-foundry/src/program-scene-vertical-slice.js";

const packageData = JSON.parse(readFileSync(resolve(import.meta.dirname, "../packages/dicebox-foundry/program-scene-vertical-slice-package.json"), "utf8"));
const rendererBytes = readFileSync(resolve(import.meta.dirname, "../assets/maps/ascendancy-tram-calibration-graybox-v1.png"));
const rendererFetch = async () => ({
  ok: true,
  status: 200,
  arrayBuffer: async () => rendererBytes.buffer.slice(rendererBytes.byteOffset, rendererBytes.byteOffset + rendererBytes.byteLength),
});

function fixtureRuntime() {
  let nextId = 1;
  const collectionDocument = (data: Record<string, any>, kind: string) => ({ id: `${kind.toLowerCase()}-${nextId++}`, uuid: `Scene.fixture.${kind}.${nextId}`, ...structuredClone(data) });
  const scene: Record<string, any> = {
    id: "scene-fixture",
    uuid: "Scene.scene-fixture",
    initialLevel: {
      id: "level-fixture",
      uuid: "Scene.scene-fixture.Level.level-fixture",
      background: {},
      flags: {},
      update: async (data: Record<string, any>) => {
        Object.assign(scene.initialLevel, structuredClone(data));
        return scene.initialLevel;
      },
    },
    walls: { contents: [] as Record<string, any>[] },
    regions: { contents: [{ id: "foreign-region", uuid: "Region.foreign", flags: { foreign: { preserved: true } } }] },
    tiles: { contents: [] as Record<string, any>[] },
  };
  scene.createEmbeddedDocuments = async (kind: "Wall" | "Region" | "Tile", payloads: Record<string, any>[]) => {
    const collection = kind === "Wall" ? scene.walls : kind === "Region" ? scene.regions : scene.tiles;
    const created = payloads.map((payload) => collectionDocument(payload, kind));
    collection.contents.push(...created);
    return created;
  };
  const runtime: Record<string, any> = {
    fetch: rendererFetch,
    game: {
      version: "14.367",
      world: { id: "dbx-test-world" },
      system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm-fixture", isGM: true },
      users: { activeGM: { id: "gm-fixture" } },
      scenes: {
        contents: [] as Record<string, any>[],
        get: (id: string) => runtime.game.scenes.contents.find((candidate: Record<string, any>) => candidate.id === id) ?? null,
      },
    },
    Scene: {
      create: async (data: Record<string, any>) => {
        Object.assign(scene, structuredClone(data));
        scene.id = "scene-fixture";
        scene.uuid = "Scene.scene-fixture";
        runtime.game.scenes.contents.push(scene);
        return scene;
      },
    },
  };
  scene.delete = async () => {
    const index = runtime.game.scenes.contents.indexOf(scene);
    if (index >= 0) runtime.game.scenes.contents.splice(index, 1);
    return scene;
  };
  scene.update = async (data: Record<string, any>) => { Object.assign(scene, structuredClone(data)); return scene; };
  scene.unsetFlag = async (scope: string, key: string) => { if (scope !== "dicebox-campaign-helper") throw new Error("unexpected scope"); delete scene.flags?.[scope]?.[key]; return scene; };
  return { runtime, scene };
}

describe("program-authored Foundry Scene vertical slice", () => {
  it("registers one fixed GM control during the pre-render lifecycle", () => {
    let callback: ((controls: Record<string, any>) => void) | undefined;
    const runtime: Record<string, any> = {
      Hooks: { on: (name: string, handler: (controls: Record<string, any>) => void) => { expect(name).toBe("getSceneControlButtons"); callback = handler; } },
      game: { user: { isGM: true } },
    };
    expect(registerProgramSceneVerticalSliceControl(runtime)).toBe(true);
    const controls = { tokens: { tools: {} as Record<string, any> } };
    callback?.(controls);
    expect(controls.tokens.tools["dicebox-program-scene-slice"]).toMatchObject({
      name: "dicebox-program-scene-slice",
      title: "Apply DiceBox Program Scene vertical slice",
      button: true,
      visible: true,
    });
    expect(controls.tokens.tools["dicebox-program-scene-inverse"]).toMatchObject({
      name: "dicebox-program-scene-inverse",
      title: "Review and reverse DiceBox Program Scene vertical slice",
      button: true,
      visible: true,
    });
    expect(controls.tokens.tools["dicebox-program-scene-update-witness"]).toMatchObject({
      name: "dicebox-program-scene-update-witness",
      title: "Run DiceBox owned-Scene update witness",
      button: true,
      visible: true,
    });
    expect(controls.tokens.tools["dicebox-program-scene-update-witness-reread"]).toMatchObject({
      name: "dicebox-program-scene-update-witness-reread",
      title: "Show DiceBox owned-Scene witness reread",
      button: true,
      visible: true,
    });
    callback?.(controls);
    expect(Object.keys(controls.tokens.tools)).toEqual(["dicebox-program-scene-slice", "dicebox-program-scene-inverse", "dicebox-program-scene-update-witness", "dicebox-program-scene-update-witness-reread"]);
  });

  it("fails closed outside the exact fixture and rejects package drift", async () => {
    const { runtime } = fixtureRuntime();
    runtime.game.world.id = "the-ballad-of-chauser-bill";
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    expect(adapter.preview()).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(runtime.game.scenes.contents).toHaveLength(0);

    const tampered = structuredClone(packageData);
    tampered.plan.documents.find((candidate: any) => candidate.documentType === "Scene").data.name = "Tampered";
    await expect(ProgramSceneVerticalSliceAdapter.create({ runtime, packageData: tampered })).rejects.toThrow("SHA-256");
  });

  it("attests exact served renderer bytes before any Scene creation", async () => {
    const { runtime } = fixtureRuntime();
    let creates = 0;
    const originalCreate = runtime.Scene.create;
    runtime.Scene.create = async (...args: any[]) => { creates += 1; return originalCreate(...args); };
    const adapter = await ProgramSceneVerticalSliceAdapter.create({
      runtime,
      packageData,
      fetcher: async () => ({ ok: true, status: 200, arrayBuffer: async () => new TextEncoder().encode("drift").buffer }),
    });
    const preview = adapter.preview();
    expect(preview).toMatchObject({ status: "BLOCKED", noWrite: true, assetAttestation: { status: "BLOCKED" } });
    const result = await adapter.apply({ approved: true, planToken: "not-issued" });
    expect(result).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(creates).toBe(0);
    expect(runtime.game.scenes.contents).toHaveLength(0);
  });

  it("previews, creates in order, rereads exact IDs, and preserves foreign state", async () => {
    const { runtime, scene } = fixtureRuntime();
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    expect(preview).toMatchObject({ status: "PASS", noWrite: true, planSha256: packageData.plan.planSha256, existingComplete: false });
    expect(preview.candidates).toHaveLength(10);

    const receipt = await adapter.apply({ approved: true, planToken: preview.planToken });
    expect(receipt).toMatchObject({
      status: "PASS",
      evidenceClass: "created_document",
      noWrite: false,
      sceneCreated: true,
      authoritativeReread: true,
      foreignStatePreserved: true,
      assetAttestation: { status: "PASS", observed: { bytes: 20655, sha256: packageData.assetDeployment.sourceSha256 } },
      readback: { complete: true, counts: { walls: 5, regions: 2, tiles: 1 } },
    });
    expect(scene.initialLevel.background.src).toBe("modules/dicebox-campaign-helper/assets/maps/ascendancy-tram-calibration-graybox-v1.png");
    expect(scene.initialLevel.flags["dicebox-campaign-helper"].managed.kind).toBe("level");
    expect(scene.walls.contents).toHaveLength(5);
    expect(scene.regions.contents).toHaveLength(3);
    expect(scene.regions.contents[0].flags).toEqual({ foreign: { preserved: true } });
    expect(scene.tiles.contents[0].texture.src).toContain("ascendancy-tram-calibration-marker-v1.svg");
    expect(scene.navigation).toBe(true);
    expect(scene.ownership).toEqual({ default: 2 });
    expect(receipt.readback.children.every((child: any) => child.runtimeId)).toBe(true);

    const secondPreview = adapter.preview();
    const second = await adapter.apply({ approved: true, planToken: secondPreview.planToken });
    expect(second).toMatchObject({ status: "PASS", noWrite: true, alreadyApplied: true, authoritativeReread: true });
    expect(scene.walls.contents).toHaveLength(5);
    expect(scene.regions.contents).toHaveLength(3);
    expect(scene.tiles.contents).toHaveLength(1);
  });

  it("allows redacted Player3 inspection while denying mutation authority", async () => {
    const { runtime } = fixtureRuntime();
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    await adapter.apply({ approved: true, planToken: preview.planToken });
    runtime.game.user = { id: "player3-fixture", isGM: false };
    const status = adapter.status();
    expect(status).toMatchObject({ status: "OBSERVED", noWrite: true, authority: { context: "Player3", isGm: false, isActiveGm: false }, readback: { complete: true } });
    expect(adapter.preview()).toMatchObject({ status: "BLOCKED", noWrite: true, blockers: expect.arrayContaining(["Current user must be the elected active GM."]) });
    expect(adapter.previewInverse()).toMatchObject({ status: "BLOCKED", noWrite: true, blockers: expect.arrayContaining(["Current user must be the elected active GM."]) });
  });

  it("reverses only the complete helper-owned Scene after a fresh inverse preview and reread", async () => {
    const { runtime } = fixtureRuntime();
    const foreignScene = { id: "foreign-scene", flags: { foreign: { preserved: true } } };
    runtime.game.scenes.contents.push(foreignScene);
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    await adapter.apply({ approved: true, planToken: preview.planToken });
    const inversePreview = adapter.previewInverse();
    expect(inversePreview).toMatchObject({ status: "PASS", noWrite: true, authoritativeReread: true, foreignWorldScenesBefore: 1, readback: { complete: true } });
    expect(await adapter.applyInverse({ approved: true, inverseToken: "wrong-token" })).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(runtime.game.scenes.contents).toHaveLength(2);
    expect(await adapter.applyInverse({ approved: true, inverseToken: inversePreview.inverseToken })).toMatchObject({ status: "PASS", noWrite: false, sceneDeleted: true, authoritativeReread: true, foreignStatePreserved: true, foreignWorldScenesBefore: 1, foreignWorldScenesAfter: 1 });
    expect(runtime.game.scenes.contents).toEqual([foreignScene]);
    expect(adapter.previewInverse()).toMatchObject({ status: "BLOCKED", noWrite: true });
  });

  it("blocks an inverse when the helper-owned Scene lacks the exact delete surface", async () => {
    const { runtime, scene } = fixtureRuntime();
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    await adapter.apply({ approved: true, planToken: preview.planToken });
    delete scene.delete;
    expect(adapter.previewInverse()).toMatchObject({ status: "BLOCKED", noWrite: true, blockers: expect.arrayContaining(["The exact helper-owned Scene does not expose an instance delete method."]) });
  });

  it("classifies a committed fixture drill as UNKNOWN and recovers only by reread without retry", async () => {
    const { runtime } = fixtureRuntime();
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    const unknown = await adapter.applyForRecoveryDrill({ approved: true, planToken: preview.planToken });
    expect(unknown).toMatchObject({ status: "UNKNOWN", noWrite: false, sceneCreated: true, responseDisposition: "intentionally-discarded-after-commit", retryAllowed: false });
    expect(runtime.game.scenes.contents).toHaveLength(1);
    const recovery = adapter.recoverUnknown({ planSha256: unknown.planSha256 });
    expect(recovery).toMatchObject({ status: "PASS", noWrite: true, recoveredFromUnknown: true, authoritativeReread: true, retryPerformed: false, foreignStatePreserved: true, readback: { complete: true } });
    expect(runtime.game.scenes.contents).toHaveLength(1);
    expect(adapter.recoverUnknown({ planSha256: unknown.planSha256 })).toMatchObject({ status: "BLOCKED", noWrite: true });
  });

  it("updates and restores only the exact owned Scene managed witness after preview and approval", async () => {
    const { runtime, scene } = fixtureRuntime();
    runtime.game.scenes.contents.push({ id: "foreign-scene", flags: { foreign: { preserved: true } } });
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const createPreview = adapter.preview();
    await adapter.apply({ approved: true, planToken: createPreview.planToken });
    const preview = adapter.previewUpdateWitness();
    expect(preview).toMatchObject({ status: "PASS", noWrite: true, stableId: "dbx:scene:desktop-shell-fixture", baseline: "absent" });
    expect(await adapter.applyUpdateWitness({ approved: true, updateWitnessToken: "wrong" })).toMatchObject({ status: "BLOCKED", noWrite: true });
    const result = await adapter.applyUpdateWitness({ approved: true, updateWitnessToken: preview.updateWitnessToken });
    expect(result).toMatchObject({ status: "PASS", noWrite: false, updateInvoked: true, authoritativeReread: true, restorationReread: true, foreignStatePreserved: true, retryPerformed: false, stage11Accepted: false, stage12Started: false });
    expect(Object.hasOwn(scene.flags["dicebox-campaign-helper"], "stage11UpdateWitness")).toBe(false);
    expect(await adapter.rereadUpdateWitnessState()).toMatchObject({ status: "OBSERVED", noWrite: true, stableId: "dbx:scene:desktop-shell-fixture", complete: true, counts: { walls: 5, regions: 2, tiles: 1 }, updateWitnessBaseline: "absent", foreignWorldScenes: 1, authoritativeReread: true, noGenericQuery: true, noUpdateInvoked: true, retryPerformed: false, stage11Accepted: false, stage12Started: false });
    runtime.game.user = { id: "player3-fixture", isGM: false };
    expect(await adapter.rereadUpdateWitnessState()).toMatchObject({ status: "BLOCKED", noWrite: true, stage11Accepted: false, stage12Started: false });
  });

  it("blocks partial owned state and never retries blindly", async () => {
    const { runtime, scene } = fixtureRuntime();
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData, now: () => 100 });
    const preview = adapter.preview();
    const original = scene.createEmbeddedDocuments;
    scene.createEmbeddedDocuments = async (kind: string, payloads: Record<string, any>[]) => {
      if (kind === "Tile") throw new Error("simulated Tile write failure");
      return original(kind, payloads);
    };
    const failed = await adapter.apply({ approved: true, planToken: preview.planToken });
    expect(failed).toMatchObject({ status: "UNKNOWN", sceneCreated: true, authoritativeReread: true, recovery: expect.stringContaining("Do not retry") });
    const nextPreview = adapter.preview();
    expect(nextPreview).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(nextPreview.blockers[0]).toContain("partial or drifted");
  });
});
