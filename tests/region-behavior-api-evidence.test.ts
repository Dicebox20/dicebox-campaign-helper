import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import {
  RegionBehaviorApiEvidenceSchema,
  createUnavailableRegionBehaviorApiEvidence,
} from "@dicebox/core";

const packageRoot = fileURLToPath(new URL("../packages/dicebox-foundry/", import.meta.url));

class FixtureRegionBehavior {
  static documentName = "RegionBehavior";
  static schema = { fields: { type: {}, disabled: {} } };
  get active() { return true; }
  update() { throw new Error("must not invoke RegionBehavior.update during evidence"); }
  delete() { throw new Error("must not invoke RegionBehavior.delete during evidence"); }
}

class FixtureRegion {
  static documentName = "Region";
  getEmbeddedCollection() { throw new Error("must not invoke Region embedded reads during evidence"); }
  getEmbeddedDocument() { throw new Error("must not invoke Region embedded reads during evidence"); }
  createEmbeddedDocuments() { throw new Error("must not invoke Region embedded writes during evidence"); }
}

class FixtureBehaviorType {
  static events = { tokenEnter: () => undefined };
}

function runtimeFixture(): any {
  const scene = { regions: { contents: [new FixtureRegion()] } };
  const scenes = { contents: [scene], get: () => null };
  return {
    Hooks: { on: () => 1, callAll: () => undefined, once: () => 1 },
    RegionDocument: FixtureRegion,
    RegionBehavior: FixtureRegionBehavior,
    CONFIG: { RegionBehavior: { dataModels: { "pause-game": FixtureBehaviorType } } },
    fromUuid: () => null,
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      modules: new Map(),
      documentTypes: { Region: ["base"] },
      actors: {},
      items: {},
      scenes,
      journal: {},
      folders: {},
      users: { getDesignatedUser: () => null },
    },
  };
}

describe("installed RegionBehavior API evidence", () => {
  it("provides a schema-valid unavailable bridge fallback", () => {
    expect(RegionBehaviorApiEvidenceSchema.parse(createUnavailableRegionBehaviorApiEvidence())).toMatchObject({
      status: "unavailable",
      regionDocumentName: null,
      regionBehaviorDocumentName: null,
      registeredBehaviorTypes: [],
      surfaces: {
        fromUuid: false,
        regionEmbeddedCollectionRead: false,
        regionEmbeddedDocumentRead: false,
        regionBehaviorClass: false,
        behaviorRegistry: false,
        behaviorEvents: false,
      },
    });
  });

  it("observes official Region/RegionBehavior surfaces without invoking them", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const evidence = RegionBehaviorApiEvidenceSchema.parse(module.probeRuntime(runtimeFixture()).regionBehaviorApi);

    expect(evidence).toMatchObject({
      status: "observed",
      regionDocumentName: "Region",
      regionBehaviorDocumentName: "RegionBehavior",
      registeredBehaviorTypes: ["pause-game"],
      surfaces: {
        fromUuid: true,
        sceneCollectionGet: true,
        regionEmbeddedCollectionRead: true,
        regionEmbeddedDocumentRead: true,
        regionDocumentClass: true,
        regionBehaviorClass: true,
        behaviorTypeSchemaField: true,
        behaviorActiveAccessor: true,
        behaviorDisabledSchemaField: true,
        behaviorRegistry: true,
        behaviorEvents: true,
        regionEmbeddedCreate: true,
        regionBehaviorUpdate: true,
        regionBehaviorDelete: true,
      },
    });
  });

  it("classifies incomplete registry evidence as partial", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const runtime = runtimeFixture();
    runtime.CONFIG.RegionBehavior.dataModels = {};
    const evidence = RegionBehaviorApiEvidenceSchema.parse(module.probeRuntime(runtime).regionBehaviorApi);
    expect(evidence.status).toBe("partial");
    expect(evidence.surfaces.regionEmbeddedDocumentRead).toBe(true);
    expect(evidence.surfaces.behaviorRegistry).toBe(false);
  });

  it("routes the exact read-only query through the installed namespace", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let ready: (() => unknown) | undefined;
    const runtime = runtimeFixture();
    runtime.Hooks.once = (_name: string, callback: () => unknown) => { ready = callback; return 1; };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    ready?.();
    const evidence = runtime.game.diceboxCampaignHelper.query({ kind: "region-behavior-api-evidence" });
    expect(RegionBehaviorApiEvidenceSchema.parse(evidence)).toMatchObject({ status: "observed" });
    expect(runtime.game.diceboxCampaignHelper.describe().mutationEnabled).toBe(false);
  });
});
