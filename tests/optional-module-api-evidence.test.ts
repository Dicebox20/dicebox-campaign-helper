import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import {
  OptionalModuleApiEvidenceSchema,
  createUnavailableOptionalModuleApiEvidence,
} from "@dicebox/core";

const packageRoot = fileURLToPath(new URL("../packages/dicebox-foundry/", import.meta.url));

function runtimeFixture(): any {
  const midiGlobal = {
    completeItemUse: () => { throw new Error("must not invoke MidiQOL.completeItemUse during evidence"); },
    applyTokenDamage: () => { throw new Error("must not invoke MidiQOL.applyTokenDamage during evidence"); },
  };
  const modules = new Map([
    ["midi-qol", { id: "midi-qol", active: true, version: "12.0.0", api: {} }],
    ["dae", { id: "dae", active: false, version: "11.3.0", api: {} }],
  ]);
  const scenes = { contents: [], get: () => null };
  return {
    Hooks: { on: () => 1, callAll: () => undefined, once: () => 1 },
    MidiQOL: midiGlobal,
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      modules,
      documentTypes: {},
      actors: {},
      items: {},
      scenes,
      journal: {},
      folders: {},
      users: { getDesignatedUser: () => null },
    },
  };
}

describe("optional module API evidence", () => {
  it("provides a schema-valid unavailable bridge fallback", () => {
    expect(OptionalModuleApiEvidenceSchema.parse(createUnavailableOptionalModuleApiEvidence())).toMatchObject({
      status: "unavailable",
      resolutionApi: "game.modules.get",
      midiQol: { installed: false, globalPresent: false, completeItemUse: false, applyTokenDamage: false },
      dae: { installed: false, moduleApiPresent: false },
      surfaces: { moduleCollectionGet: false, hookFramework: false },
    });
  });

  it("observes module metadata and documented Midi-QOL surfaces without invoking them", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const evidence = OptionalModuleApiEvidenceSchema.parse(module.probeRuntime(runtimeFixture()).optionalModuleApi);

    expect(evidence).toMatchObject({
      status: "observed",
      resolutionApi: "game.modules.get",
      midiQol: {
        installed: true,
        active: true,
        version: "12.0.0",
        moduleApiPresent: true,
        globalPresent: true,
        completeItemUse: true,
        applyTokenDamage: true,
      },
      dae: { installed: true, active: false, version: "11.3.0", moduleApiPresent: true },
      surfaces: { moduleCollectionGet: true, hookFramework: true },
    });
  });

  it("records an observed empty module collection without inventing installed capabilities", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const runtime = runtimeFixture();
    runtime.game.modules = new Map();
    delete runtime.MidiQOL;
    const evidence = OptionalModuleApiEvidenceSchema.parse(module.probeRuntime(runtime).optionalModuleApi);

    expect(evidence.status).toBe("observed");
    expect(evidence.midiQol).toMatchObject({ installed: false, globalPresent: false, completeItemUse: false, applyTokenDamage: false });
    expect(evidence.dae).toMatchObject({ installed: false, active: null, version: null, moduleApiPresent: false });
  });

  it("routes the exact read-only query through the installed namespace", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let ready: (() => unknown) | undefined;
    const runtime = runtimeFixture();
    runtime.Hooks.once = (_name: string, callback: () => unknown) => { ready = callback; return 1; };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    ready?.();
    const evidence = runtime.game.diceboxCampaignHelper.query({ kind: "optional-module-api-evidence" });
    expect(OptionalModuleApiEvidenceSchema.parse(evidence)).toMatchObject({ status: "observed" });
    expect(runtime.game.diceboxCampaignHelper.describe().mutationEnabled).toBe(false);
  });
});
