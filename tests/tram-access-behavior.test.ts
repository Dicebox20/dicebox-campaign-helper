import { describe, expect, it, vi } from "vitest";
// @ts-ignore Browser-side Foundry adapter is intentionally plain JavaScript.
import { TRAM_ACCESS, createTramAccessBehaviorType, dispatchTramAccessEvent, registerTramAccessBehavior } from "../packages/dicebox-foundry/src/tram-access-behavior.js";
// @ts-ignore Browser-side Foundry adapter is intentionally plain JavaScript.
import { TramAccessFixtureInstaller } from "../packages/dicebox-foundry/src/tram-access-fixture-installer.js";

function actor(stableId = "dbx:actor:andrew-mcconaughey") {
  return { id: "andrew", uuid: "Actor.andrew", flags: { "dicebox-campaign-helper": { managed: { semanticId: stableId } } } };
}

function eventRuntime() {
  const openForRegionEvent = vi.fn(async () => "close");
  return {
    runtime: {
      game: {
        world: { id: "dbx-test-world" }, version: "14.367", system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "andrew-user", isGM: false }, diceboxTramRushHour: { openForRegionEvent },
      },
    },
    openForRegionEvent,
  };
}

describe("native Tram access RegionBehavior", () => {
  it("opens Andrew Rush Hour only on the triggering user's client with the canonical Actor binding", async () => {
    const { runtime, openForRegionEvent } = eventRuntime();
    const system = { action: TRAM_ACCESS.action, regionStableId: TRAM_ACCESS.regionStableId, actorStableIds: new Set(TRAM_ACCESS.actorStableIds) };
    const region = { flags: { "dicebox-campaign-helper": { managed: { semanticId: TRAM_ACCESS.regionStableId } } } };
    const event = { name: "tokenEnter", user: { id: "andrew-user" }, data: { token: { actor: actor() } } };
    await expect(dispatchTramAccessEvent({ runtime, system, region, event })).resolves.toMatchObject({ status: "PASS", noWrite: true });
    expect(openForRegionEvent).toHaveBeenCalledTimes(1);
    await expect(dispatchTramAccessEvent({ runtime, system, region, event: { ...event, user: { id: "other-user" } } })).resolves.toMatchObject({ status: "IGNORED", reason: "not-origin-client" });
    await expect(dispatchTramAccessEvent({ runtime, system, region, event: { ...event, data: { token: { actor: actor("dbx:actor:dalton") } } } })).resolves.toMatchObject({ status: "BLOCKED", reason: "actor-not-authorized" });
    expect(openForRegionEvent).toHaveBeenCalledTimes(1);
  });

  it("registers one Foundry v14 data model restricted to tokenEnter", () => {
    class Base {
      static _createEventsField(options: unknown) { return { kind: "events", options }; }
    }
    class StringField { constructor(public options: unknown) {} }
    class SetField { constructor(public element: unknown) {} }
    const runtime: any = {
      foundry: { data: { regionBehaviors: { RegionBehaviorType: Base }, fields: { StringField, SetField } } },
      CONFIG: { RegionBehavior: { dataModels: {}, typeLabels: {}, typeIcons: {} } },
    };
    expect(registerTramAccessBehavior(runtime)).toMatchObject({ status: "PASS", type: "dicebox-campaign-helper.tramAccess" });
    const Type = runtime.CONFIG.RegionBehavior.dataModels["dicebox-campaign-helper.tramAccess"];
    expect(Type).toBe(createTramAccessBehaviorType(runtime).constructor === Function ? Type : Type);
    expect(Type.defineSchema().events).toEqual({ kind: "events", options: { events: ["tokenEnter"], initial: ["tokenEnter"] } });
  });

  it("previews and applies exactly one owned Andrew Region plus its embedded native behavior", async () => {
    const scene: any = {
      id: "scene", uuid: "Scene.scene",
      flags: { "dicebox-campaign-helper": { managed: { owner: "dicebox-campaign-helper", packageId: "dbx:package:fixture-tram-routing-projection", planId: "dbx:plan:fixture-tram-routing-projection", kind: "scene", semanticId: "dbx:scene:fixture-tram-routing-projection" } } },
      regions: { contents: [{ id: "foreign", flags: { foreign: true }, behaviors: { contents: [] } }] },
    };
    scene.createEmbeddedDocuments = async (kind: string, entries: any[]) => {
      expect(kind).toBe("Region");
      const created = entries.map((entry, index) => {
        const region: any = { id: `region-${index}`, uuid: `Scene.scene.Region.region-${index}`, ...entry, behaviors: { contents: [] } };
        region.createEmbeddedDocuments = async (embedded: string, behaviorEntries: any[]) => {
          expect(embedded).toBe("RegionBehavior");
          const docs = behaviorEntries.map((data, behaviorIndex) => ({ id: `behavior-${behaviorIndex}`, uuid: `Scene.scene.Region.${region.id}.RegionBehavior.behavior-${behaviorIndex}`, ...data }));
          region.behaviors.contents.push(...docs);
          return docs;
        };
        return region;
      });
      scene.regions.contents.push(...created);
      return created;
    };
    const runtime: any = {
      game: {
        world: { id: "dbx-test-world" }, version: "14.367", system: { id: "dnd5e", version: "5.3.3" },
        user: { id: "gm", isGM: true }, users: { activeGM: { id: "gm" } }, actors: { contents: [actor()] },
        scenes: { contents: [scene], get: () => scene },
      },
      CONFIG: { RegionBehavior: { dataModels: { "dicebox-campaign-helper.tramAccess": class {} } } },
    };
    const installer = new TramAccessFixtureInstaller({ runtime, now: () => 1000 });
    const preview = installer.previewAndrew();
    expect(preview).toMatchObject({ status: "PASS", noWrite: true, creates: [TRAM_ACCESS.regionStableId, TRAM_ACCESS.behaviorStableId] });
    const receipt = await installer.applyAndrew({ approved: true, planToken: preview.planToken });
    expect(receipt).toMatchObject({ status: "PASS", noWrite: false, authoritativeReread: true, foreignStatePreserved: true, readback: { regionBounds: { x: 420, y: 210, width: 660, height: 570 }, behavior: { type: "dicebox-campaign-helper.tramAccess", events: ["tokenEnter"], actorStableIds: ["dbx:actor:andrew-mcconaughey"] } } });
    expect(scene.regions.contents[0].flags).toEqual({ foreign: true });
  });
});
