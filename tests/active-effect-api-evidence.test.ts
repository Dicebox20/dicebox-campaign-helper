import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { ActiveEffectApiEvidenceSchema, createUnavailableActiveEffectApiEvidence } from "@dicebox/core";

const packageRoot = fileURLToPath(new URL("../packages/dicebox-foundry/", import.meta.url));

class FixtureActiveEffect {
  static documentName = "ActiveEffect";
  get id() { return "effect-1"; }
  get uuid() { return "Actor.actor-1.ActiveEffect.effect-1"; }
  get active() { return true; }
  get isSuppressed() { return false; }
  update() { throw new Error("must not invoke ActiveEffect.update during evidence"); }
  delete() { throw new Error("must not invoke ActiveEffect.delete during evidence"); }
}

class FixtureActor {
  getEmbeddedCollection() { throw new Error("must not invoke Actor embedded reads during evidence"); }
  getEmbeddedDocument() { throw new Error("must not invoke Actor embedded reads during evidence"); }
  createEmbeddedDocuments() { throw new Error("must not invoke Actor embedded writes during evidence"); }
}

class FixtureItem {
  getEmbeddedCollection() { throw new Error("must not invoke Item embedded reads during evidence"); }
  getEmbeddedDocument() { throw new Error("must not invoke Item embedded reads during evidence"); }
  createEmbeddedDocuments() { throw new Error("must not invoke Item embedded writes during evidence"); }
}

function runtimeFixture(): any {
  const actors = { contents: [new FixtureActor()], get: () => null };
  const items = { contents: [new FixtureItem()], get: () => null };
  return {
    Hooks: { on: () => 1, callAll: () => undefined, once: () => 1 },
    ActiveEffect: FixtureActiveEffect,
    fromUuid: () => null,
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      modules: new Map(),
      documentTypes: { Actor: ["base"], Item: ["base"] },
      actors,
      items,
      scenes: {},
      journal: {},
      folders: {},
      users: { getDesignatedUser: () => null },
    },
  };
}

describe("installed ActiveEffect API evidence", () => {
  it("provides a schema-valid unavailable bridge fallback", () => {
    expect(ActiveEffectApiEvidenceSchema.parse(createUnavailableActiveEffectApiEvidence())).toMatchObject({
      status: "unavailable",
      parentDocumentTypes: [],
      activeEffectDocumentName: null,
      surfaces: {
        fromUuid: false,
        actorEmbeddedCollectionRead: false,
        itemEmbeddedDocumentRead: false,
        activeEffectClass: false,
        activeEffectUpdate: false,
        activeEffectDelete: false,
      },
    });
  });

  it("observes official Actor/Item and ActiveEffect surfaces without invoking them", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const evidence = ActiveEffectApiEvidenceSchema.parse(module.probeRuntime(runtimeFixture()).activeEffectApi);

    expect(evidence).toMatchObject({
      status: "observed",
      parentDocumentTypes: ["Actor", "Item"],
      activeEffectDocumentName: "ActiveEffect",
      surfaces: {
        fromUuid: true,
        actorCollectionGet: true,
        itemCollectionGet: true,
        actorEmbeddedCollectionRead: true,
        itemEmbeddedCollectionRead: true,
        actorEmbeddedDocumentRead: true,
        itemEmbeddedDocumentRead: true,
        activeEffectClass: true,
        activeEffectIdAccessor: true,
        activeEffectUuidAccessor: true,
        activeEffectActiveAccessor: true,
        activeEffectSuppressedAccessor: true,
        hookFramework: true,
        applyActiveEffectNamed: true,
        actorEmbeddedCreate: true,
        itemEmbeddedCreate: true,
        activeEffectUpdate: true,
        activeEffectDelete: true,
      },
    });
  });

  it("classifies missing parent reads as partial and never upgrades them to ready", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    const runtime = runtimeFixture();
    runtime.game.actors.contents = [];
    runtime.game.items.contents = [];
    runtime.game.actors.get = undefined as never;
    runtime.game.items.get = undefined as never;
    const evidence = ActiveEffectApiEvidenceSchema.parse(module.probeRuntime(runtime).activeEffectApi);

    expect(evidence.status).toBe("partial");
    expect(evidence.surfaces.activeEffectClass).toBe(true);
    expect(evidence.surfaces.actorEmbeddedCollectionRead).toBe(false);
    expect(evidence.surfaces.itemEmbeddedDocumentRead).toBe(false);
    expect(evidence.surfaces.activeEffectUpdate).toBe(true);
    expect(evidence.surfaces.activeEffectDelete).toBe(true);
  });

  it("routes the exact read-only query through the installed namespace", async () => {
    const module = await import(`${packageRoot}/src/module.js`);
    let ready: (() => unknown) | undefined;
    const runtime = runtimeFixture();
    runtime.Hooks.once = (_name: string, callback: () => unknown) => { ready = callback; return 1; };
    module.bootstrapDiceBoxCampaignHelper(runtime);
    ready?.();
    const evidence = runtime.game.diceboxCampaignHelper.query({ kind: "active-effect-api-evidence" });
    expect(ActiveEffectApiEvidenceSchema.parse(evidence)).toMatchObject({ status: "observed" });
    expect(runtime.game.diceboxCampaignHelper.describe().mutationEnabled).toBe(false);
  });
});
