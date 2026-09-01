import { describe, expect, it } from "vitest";
import {
  createFoundryRegionBehaviorReadAdapter,
  type FoundryRegionBehaviorDocument,
  type FoundryRegionBehaviorParentDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const regionBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("region", "pressure-plate"), kind: "region" },
  runtime: "foundry",
  documentType: "Region",
  documentId: "region-1",
  uuid: "Scene.world.scene-1.Region.region-1",
  generation: 4,
};

const behavior: FoundryRegionBehaviorDocument = {
  id: "behavior-1",
  uuid: "Scene.world.scene-1.Region.region-1.RegionBehavior.behavior-1",
  documentName: "RegionBehavior",
  name: "Pause on Entry",
  type: "pause-game",
  disabled: false,
  active: true,
  parent: { uuid: regionBinding.uuid },
};

const secondBehavior: FoundryRegionBehaviorDocument = {
  id: "behavior-2",
  uuid: "Scene.world.scene-1.Region.region-1.RegionBehavior.behavior-2",
  documentName: "RegionBehavior",
  name: "Display Warning",
  type: "display-scrolling-text",
  disabled: true,
  active: false,
  region: { uuid: regionBinding.uuid },
};

function makeRegion(overrides: Partial<FoundryRegionBehaviorParentDocument> = {}): FoundryRegionBehaviorParentDocument {
  return {
    id: regionBinding.documentId,
    uuid: regionBinding.uuid,
    documentName: "Region",
    getEmbeddedCollection(documentType) {
      return documentType === "RegionBehavior" ? { contents: [secondBehavior, behavior] } : { contents: [] };
    },
    getEmbeddedDocument(documentType, behaviorId) {
      if (documentType !== "RegionBehavior") return null;
      if (behaviorId === behavior.id) return behavior;
      if (behaviorId === secondBehavior.id) return secondBehavior;
      return null;
    },
    ...overrides,
  };
}

describe("read-only Foundry RegionBehavior observation adapter", () => {
  it("reads exact identity and safe state through the parent embedded-document API", async () => {
    let calls = 0;
    const adapter = createFoundryRegionBehaviorReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === regionBinding.uuid ? makeRegion() : null;
      },
    });

    const result = await adapter.read(regionBinding, "behavior-1");

    expect(adapter.adapterId).toBe("foundry.region-behavior.read@14.367");
    expect(adapter.foundryApi).toEqual({
      regionResolve: "fromUuid",
      embeddedCollection: 'region.getEmbeddedCollection("RegionBehavior")',
      embeddedDocument: 'region.getEmbeddedDocument("RegionBehavior", id)',
    });
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        behaviorId: "behavior-1",
        behaviorUuid: behavior.uuid,
        behaviorType: "pause-game",
        displayName: "Pause on Entry",
        regionBinding,
        disabled: false,
        active: true,
        parentRegionUuid: regionBinding.uuid,
      },
    });
  });

  it("lists typed RegionBehaviors and returns null for a missing behavior", async () => {
    const adapter = createFoundryRegionBehaviorReadAdapter({ fromUuid: async () => makeRegion() });

    expect(await adapter.read(regionBinding, "behavior-missing")).toEqual({ ok: true, value: null });
    expect(await adapter.list(regionBinding)).toEqual({
      ok: true,
      value: {
        regionBinding,
        count: 2,
        entries: [
          { behaviorId: "behavior-1", behaviorUuid: behavior.uuid, behaviorType: "pause-game", displayName: "Pause on Entry" },
          { behaviorId: "behavior-2", behaviorUuid: secondBehavior.uuid, behaviorType: "display-scrolling-text", displayName: "Display Warning" },
        ],
      },
    });
  });

  it("fails closed on foreign identity, malformed entries, and unavailable surfaces", async () => {
    const foreign = createFoundryRegionBehaviorReadAdapter({
      fromUuid: async () => ({ ...makeRegion(), uuid: "Scene.world.foreign.Region.other" }),
    });
    const malformed = createFoundryRegionBehaviorReadAdapter({
      fromUuid: async () => makeRegion({ getEmbeddedCollection: () => ({ contents: [{ documentName: "RegionBehavior" }] }) }),
    });
    const { getEmbeddedDocument: _read, ...regionWithoutRead } = makeRegion();
    const unavailable = createFoundryRegionBehaviorReadAdapter({ fromUuid: async () => regionWithoutRead });

    const foreignResult = await foreign.read(regionBinding, "behavior-1");
    const malformedResult = await malformed.list(regionBinding);
    const unavailableResult = await unavailable.read(regionBinding, "behavior-1");
    expect(foreignResult.ok).toBe(false);
    expect(malformedResult.ok).toBe(false);
    expect(unavailableResult.ok).toBe(false);
    if (!foreignResult.ok) expect(foreignResult.error.code).toBe("UNKNOWN_OUTCOME");
    if (!malformedResult.ok) expect(malformedResult.error.code).toBe("UNKNOWN_OUTCOME");
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
  });

  it("preserves timeout-unknown and exposes no RegionBehavior mutation methods", async () => {
    const throwing = createFoundryRegionBehaviorReadAdapter({ fromUuid: async () => { throw new Error("region timeout"); } });
    const result = await throwing.read(regionBinding, "behavior-1");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_OUTCOME");
      expect(result.error.retry).toBe("after-reread");
    }
    expect("createEmbeddedDocuments" in throwing).toBe(false);
    expect("updateEmbeddedDocuments" in throwing).toBe(false);
    expect("deleteEmbeddedDocuments" in throwing).toBe(false);
    expect("create" in throwing).toBe(false);
    expect("update" in throwing).toBe(false);
    expect("delete" in throwing).toBe(false);
  });
});
