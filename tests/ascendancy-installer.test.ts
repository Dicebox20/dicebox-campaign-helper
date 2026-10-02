import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error The Foundry browser entry intentionally has no local Foundry type dependency.
import { installAscendancyCampaign, installAscendancySignalRuneCandidate, openAscendancySignalRuneCandidateTransportDiagnosticControl, openAscendancySignalRuneCandidateWriteControl, previewAscendancySignalRuneCandidateWrite, readAscendancySignalRuneCandidateTransportDiagnostic, readAscendancySignalRunePersistentWorldReread, registerControl, selectAscendancySignalRuneCandidateScope } from "../packages/dicebox-foundry/src/ascendancy-installer.js";

const root = resolve(import.meta.dirname, "..");

describe("Ascendancy Foundry installer gate", () => {
  it("does not mutate the authorized 14.365 compatibility lane", async () => {
    let sceneCreateCalls = 0;
    const runtime = {
      game: {
        version: "14.365",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      Scene: { create: async () => { sceneCreateCalls += 1; } },
    };
    const receipt = await installAscendancyCampaign(runtime);
    expect(receipt.status).toBe("BLOCKED");
    expect(receipt.noWrite).toBe(true);
    expect(sceneCreateCalls).toBe(0);
    expect(receipt.blockers.join(" ")).toContain("14.367");
  });

  it("ships the compiled package beside the installer and keeps four spatial sources", () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    expect(packageData.mutation).toBe("disabled-until-exact-runtime-gate");
    expect(packageData.spatialBlueprints).toHaveLength(4);
    expect(packageData.regionPlans).toHaveLength(4);
    expect(packageData.assets.bound).toHaveLength(4);
    expect(packageData.assets.bound[0]).toMatchObject({
      assetId: "dbx:asset:map-ascendancy-tram-depot",
      status: "scene-bound",
      path: "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
    });
    expect(packageData.regionPlans.find((plan: { roomId: string }) => plan.roomId === "dbx:room:ascendancy-tram-depot").regions).toHaveLength(39);
  });

  it("uses nested Foundry flags and contains a provenance-bound recovery path", () => {
    const source = readFileSync(resolve(root, "packages/dicebox-foundry/src/ascendancy-installer.js"), "utf8");
    expect(source).toContain("flags: {");
    expect(source).toContain("findRecoverableScene");
    expect(source).toContain("Multiple recoverable DiceBox scenes matched");
    expect(source).toContain("sceneRecovered");
    expect(source).toContain("const WALL_NORMAL = 20;");
    expect(source).toContain("modules/${MODULE_ID}/assets/maps/${filename}");
    expect(source).toContain("Foundry 14 stores a Scene renderer on its initial embedded Level.");
    expect(source).toContain("scene?.initialLevel");
    expect(source).toContain("Scene.initialLevel renderer is unavailable or ambiguous");
    expect(source).toContain("Read every target before any owned Wall replacement.");
    expect(source).toContain("await ensureRenderer(runtime, reread, expectedBackground, room.roomId);");
    expect(source).toContain("rendererSource(reread) !== expectedBackground");
    expect(source).toContain("Compiled campaign package has no reviewed renderer for every Scene; installation is blocked before any Foundry write.");
    expect(source).toContain("repairAscendancyCampaignRenderersAndGeometry");
    expect(source).toContain('runtime.Hooks.on("getSceneControlButtons"');
    expect(source).toContain('globalThis.Hooks.once("init", () => registerControl(globalThis));');
    expect(source).not.toContain('globalThis.Hooks.once("ready", () => {\n    expose(globalThis);\n    registerControl(globalThis);');
    expect(source).toContain("const tools = controls?.tokens?.tools;");
    expect(source).toContain('tools["dicebox-ascendancy-repair"]');
    expect(source).toContain("Only existing DiceBox-owned Scene backgrounds and boundary Wall documents were reconciled");
    expect(source).toContain('evidenceClass: "full_function"');
    expect(source).not.toContain('evidenceClass: "target-bound"');
    expect(source).not.toContain("move: 1");
  });

  it("selects only the fixed M1141 Signal/Rune candidate before loader or loop use", () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    const selected = selectAscendancySignalRuneCandidateScope(packageData);
    expect(selected.candidateId).toBe("m1141-signal-rune");
    expect(selected.rooms.map((room: { roomId: string }) => room.roomId)).toEqual([
      "dbx:room:signal-frequency-chamber",
      "dbx:room:rune-mechanism-chamber",
    ]);
    expect(selected.assets.map((asset: { roomId: string; status: string }) => ({ roomId: asset.roomId, status: asset.status }))).toEqual([
      { roomId: "dbx:room:signal-frequency-chamber", status: "scene-bound" },
      { roomId: "dbx:room:rune-mechanism-chamber", status: "scene-bound" },
    ]);
    expect(selected.excludedRoomIds).toEqual([
      "dbx:room:ascendancy-tram-depot",
      "dbx:room:central-core-control-chamber",
    ]);
  });

  it("rejects unknown, excluded, duplicate, and incomplete candidate scope without widening it", () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    expect(() => selectAscendancySignalRuneCandidateScope(packageData, "all-rooms")).toThrow("Unknown candidate selector");
    expect(() => selectAscendancySignalRuneCandidateScope(packageData, "tram-core")).toThrow("Unknown candidate selector");
    expect(() => selectAscendancySignalRuneCandidateScope({
      ...packageData,
      campaign: { ...packageData.campaign, rooms: [...packageData.campaign.rooms, packageData.campaign.rooms[0]] },
    })).toThrow("duplicate campaign room IDs");
    expect(() => selectAscendancySignalRuneCandidateScope({
      ...packageData,
      assets: { ...packageData.assets, bound: packageData.assets.bound.map((asset: { roomId: string }) => asset.roomId === "dbx:room:signal-frequency-chamber" ? { ...asset, status: "final-map-required", path: null } : asset) },
    })).toThrow("complete selected Signal/Rune assets");
  });

  it("keeps candidate transport explicit and non-invoked in the local test surface", () => {
    const source = readFileSync(resolve(root, "packages/dicebox-foundry/src/ascendancy-installer.js"), "utf8");
    expect(source).toContain("loadPackage(runtime, SIGNAL_RUNE_CANDIDATE_ID)");
    expect(source).toContain("for (const room of candidateScope.rooms)");
    expect(source).toContain("installAscendancySignalRuneCandidate");
    expect(source).toContain("repairAscendancySignalRuneCandidate");
    expect(source).not.toContain("candidateId = packageData.campaign.rooms");
  });

  it("reports the fixed candidate transport without caching, binding, payload, proposal, or installer invocation", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      __diceboxAscendancyPackage: packageData,
    };
    const receipt = await readAscendancySignalRuneCandidateTransportDiagnostic(runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.signal-rune-candidate-transport.diagnostic",
      status: "OBSERVED",
      evidenceClass: "runtime-observation",
      noWrite: true,
      apply: false,
      dispatch: "disabled",
      candidateTransportImplemented: true,
      runtimeExposure: "diagnostic-only-candidate-install-repair-disabled",
      candidateInstallExposed: false,
      candidateRepairExposed: false,
      readyClaim: false,
      bindings: null,
      payload: null,
      proposal: null,
      candidate: {
        candidateId: "m1141-signal-rune",
        selectedRoomIds: ["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"],
        excludedRoomIds: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
        selectedAssetsComplete: true,
      },
    });
    expect(runtime.__diceboxAscendancyPackage).toBe(packageData);
    expect(receipt.artifactIdentity).toMatchObject({
      specId: "dbx:foundry-spec:current-product-0.1.15-m1259",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1259",
      source: { artifactId: "dbx:foundry-artifact:installer" },
      staged: { evidence: "m1259-not-attested-source-only" },
      served: { evidence: "m1259-not-attested-source-only" },
    });
  });

  it("previews only the fixed Signal/Rune write boundary without mutation or authority", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    let sceneCreateCalls = 0;
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      Scene: { create: async () => { sceneCreateCalls += 1; } },
      __diceboxAscendancyPackage: packageData,
    };
    const preview = await previewAscendancySignalRuneCandidateWrite(runtime);
    expect(preview).toMatchObject({
      operation: "ascendancy.signal-rune-candidate.write-preview",
      status: "PREVIEWED",
      noWrite: true,
      apply: false,
      approvalRequired: true,
      approvalGranted: false,
      authoritativeRereadRequired: true,
      readyClaim: false,
      candidateId: "m1141-signal-rune",
      candidate: {
        selectedRoomIds: ["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"],
        excludedRoomIds: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
        selectedAssetsComplete: true,
      },
    });
    expect(sceneCreateCalls).toBe(0);
  });

  it("uses the Foundry v14 foundry.documents.Scene factory when the legacy global is absent", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    let createCalls = 0;
    let sequence = 0;
    const scenes: any = {
      contents: [],
      get: (id: string) => scenes.contents.find((scene: any) => scene.id === id),
    };
    const createScene = async (data: any) => {
      createCalls += 1;
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
          const collection = type === "Wall" ? scene.walls : type === "Region" ? scene.regions : scene.tiles;
          const documents = payload.map((entry, index) => ({ id: `${type}-${sequence}-${index}`, flags: entry.flags }));
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
      },
      foundry: { documents: { Scene: { create: createScene } } },
      __diceboxAscendancyPackage: packageData,
    };
    const receipt = await installAscendancySignalRuneCandidate(runtime);
    expect(receipt).toMatchObject({ status: "PASS", readyClaim: false, playerFacingMacroCount: 0 });
    expect(createCalls).toBe(2);
    expect(scenes.contents).toHaveLength(2);
    expect(receipt.scenes.map((scene: { tileCount: number }) => scene.tileCount)).toEqual([7, 7]);
    expect(scenes.contents.map((scene: any) => scene.tiles.contents)).toHaveLength(2);
    expect(scenes.contents.every((scene: any) => Array.isArray(scene.tiles.contents))).toBe(true);
    expect(scenes.contents.map((scene: any) => scene.tiles.contents.length)).toEqual([7, 7]);
  });

  it("requires explicit approval and cancels without invoking the installer", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    let sceneCreateCalls = 0;
    let confirmConfig: any;
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      Scene: { create: async () => { sceneCreateCalls += 1; } },
      __diceboxAscendancyPackage: packageData,
      foundry: { applications: { api: {
        DialogV2: {
          confirm: async (config: any) => { confirmConfig = config; return false; },
          wait: async () => "close",
        },
      } } },
    };
    const receipt = await openAscendancySignalRuneCandidateWriteControl(runtime);
    expect(receipt).toMatchObject({ operation: "ascendancy.signal-rune-candidate.write-preview", status: "CANCELLED", noWrite: true, approvalGranted: false, readyClaim: false });
    expect(confirmConfig.window.title).toBe("Create DiceBox Signal/Rune Candidate");
    expect(confirmConfig.yes.label).toContain("Approve fixed Signal/Rune write");
    expect(confirmConfig.no.label).toBe("Cancel");
    expect(confirmConfig.content).toContain("m1141-signal-rune");
    expect(sceneCreateCalls).toBe(0);
  });

  it("fails closed for target, GM, and foreign semantic drift while preserving foreign Scenes", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    const fetch = async () => ({ ok: true, json: async () => packageData });
    const base: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [{ name: "Foreign Signal", flags: { "dicebox-campaign-helper": { managed: { owner: "other-module", packageId: "foreign", kind: "scene", semanticId: "dbx:room:signal-frequency-chamber" } } } }] },
      },
      fetch,
    };
    const foreign = await readAscendancySignalRuneCandidateTransportDiagnostic(base);
    expect(foreign).toMatchObject({ status: "BLOCKED", noWrite: true, readyClaim: false, candidate: { sceneObservation: { foreignStatePreserved: true } } });
    expect(foreign.blockers.join(" ")).toContain("foreign Scene");
    expect(await readAscendancySignalRuneCandidateTransportDiagnostic({ ...base, game: { ...base.game, version: "14.366" } })).toMatchObject({ status: "BLOCKED", noWrite: true });
    expect(await readAscendancySignalRuneCandidateTransportDiagnostic({ ...base, game: { ...base.game, user: { id: "player", isGM: false } } })).toMatchObject({ status: "BLOCKED", noWrite: true });
  });

  it("registers one fixed GM-only candidate diagnostic control without widening install or repair", () => {
    let callback: ((controls: any) => void) | undefined;
    const runtime: any = {
      game: { user: { isGM: true } },
      Hooks: { on: (_name: string, handler: (controls: any) => void) => { callback = handler; } },
    };
    registerControl(runtime);
    const controls = { tokens: { tools: {} } };
    callback?.(controls);
    expect(controls.tokens.tools).toMatchObject({
      "dicebox-ascendancy-install": { button: true, visible: true },
      "dicebox-ascendancy-repair": { button: true, visible: true },
      "dicebox-ascendancy-candidate-transport-diagnostic": {
        title: "Show DiceBox Signal/Rune Candidate Transport Diagnostic",
        button: true,
        visible: true,
      },
      "dicebox-ascendancy-signal-rune-create": {
        title: "Create DiceBox Signal/Rune Candidate",
        button: true,
        visible: true,
      },
      "dicebox-ascendancy-persistent-write-accounting": {
        title: "Show DiceBox Native Write Accounting",
        button: true,
        visible: true,
      },
      "dicebox-ascendancy-persistent-world-reread": {
        title: "Reread DiceBox Signal/Rune Persistent World",
        button: true,
        visible: true,
      },
    });
    expect(Object.keys(controls.tokens.tools)).toHaveLength(7);
  });

  it("keeps the post-restart persistence reread fixed, owned-only, and non-mutating", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      __diceboxAscendancyPackage: packageData,
    };
    const receipt = await readAscendancySignalRunePersistentWorldReread(runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.signal-rune-candidate.persistent-world-reread",
      status: "BLOCKED",
      noWrite: true,
      apply: false,
      dispatch: "disabled",
      readyClaim: false,
      persistence: { rawStorageInspected: false, postRestartAuthoritativeReread: false },
      candidate: { foreignStatePreserved: true },
    });
    expect(receipt.blockers.join(" ")).toContain("incomplete");
  });

  it("normalizes Foundry collection-like child surfaces during the post-restart reread", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    const room = packageData.campaign.rooms.find((candidate: { roomId: string }) => candidate.roomId === "dbx:room:signal-frequency-chamber");
    const scene: any = {
      id: "signal-scene",
      uuid: "Scene.signal-scene",
      flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: packageData.packageId, kind: "scene", semanticId: room.roomId } } },
      walls: { values: () => [] },
      regions: { values: () => [] },
      tiles: { values: () => [] },
    };
    const scenes: any = { contents: [scene], get: (id: string) => id === scene.id ? scene : undefined };
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes,
      },
      __diceboxAscendancyPackage: packageData,
    };
    const receipt = await readAscendancySignalRunePersistentWorldReread(runtime);
    expect(receipt).toMatchObject({ operation: "ascendancy.signal-rune-candidate.persistent-world-reread", status: "BLOCKED", noWrite: true, readyClaim: false });
    expect(receipt.candidate.rooms.find((candidate: { roomId: string }) => candidate.roomId === room.roomId)).toMatchObject({ status: "partial", children: { walls: 0, regions: 0, tiles: 0, expected: { tiles: 7 } } });
  });

  it("renders the fixed diagnostic receipt through DialogV2 without exposing mutation", async () => {
    const packageData = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/ascendancy-campaign-package.json"), "utf8"));
    let dialogConfig: any;
    const runtime: any = {
      game: {
        version: "14.367",
        system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true },
        users: { activeGM: { id: "gm" } },
        scenes: { contents: [] },
      },
      __diceboxAscendancyPackage: packageData,
      foundry: { applications: { api: { DialogV2: { wait: async (config: any) => { dialogConfig = config; } } } } },
    };
    const receipt = await openAscendancySignalRuneCandidateTransportDiagnosticControl(runtime);
    expect(receipt).toMatchObject({
      operation: "ascendancy.signal-rune-candidate-transport.diagnostic",
      noWrite: true,
      apply: false,
      dispatch: "disabled",
      candidateInstallExposed: false,
      candidateRepairExposed: false,
      bindings: null,
      payload: null,
      proposal: null,
    });
    expect(dialogConfig.window.title).toBe("Show DiceBox Signal/Rune Candidate Transport Diagnostic");
    expect(dialogConfig.content).toContain("ascendancy.signal-rune-candidate-transport.diagnostic");
    expect(dialogConfig.buttons).toEqual([{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }]);
  });
});
