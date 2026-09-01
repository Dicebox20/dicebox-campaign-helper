import { describe, expect, it } from "vitest";
import {
  createRegionBehaviorOperationPlan,
  validateRegionBehaviorOperationPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const regionId = createStableDiceBoxId("region", "pressure-plate");
const behaviorId = createStableDiceBoxId("region-behavior", "pause-on-entry");
const intentId = createStableDiceBoxId("region-behavior-intent", "pause-on-entry");
const regionBinding: RuntimeBinding = {
  semantic: { id: regionId, kind: "region" },
  runtime: "foundry",
  documentType: "Region",
  documentId: "region-1",
  uuid: "Scene.world.scene-1.Region.region-1",
  generation: 4,
};
const behaviorBinding = {
  behaviorId: "behavior-1",
  behaviorUuid: "Scene.world.scene-1.Region.region-1.RegionBehavior.behavior-1",
  generation: 4,
};
const observed = {
  behaviorId: "behavior-1",
  behaviorUuid: behaviorBinding.behaviorUuid,
  behaviorType: "pause-game",
  displayName: "Pause on Entry",
  disabled: false,
  active: true,
  parentRegionUuid: regionBinding.uuid,
};
const intent = {
  intentId,
  intentFingerprint: "sha256:region-behavior-fixture",
  behaviorType: "pause-game",
  eventTypes: ["tokenEnter"],
  enabled: true,
};

describe("review-first native Foundry RegionBehavior operation plan", () => {
  it("binds the official RegionBehavior APIs and keeps execution disabled", () => {
    const plan = createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "create-pause-on-entry"),
      operation: "create",
      region: { id: regionId, kind: "region" },
      behaviorId,
      regionBinding,
      intent,
      regionResolve: "fromUuid",
    });

    expect(plan).toMatchObject({
      kind: "foundry-region-behavior-operation",
      operation: "create",
      foundryApi: {
        regionResolve: "fromUuid",
        behaviorRegistry: "CONFIG.RegionBehavior.dataModels",
        behaviorCollection: 'region.getEmbeddedCollection("RegionBehavior")',
        behaviorRead: 'region.getEmbeddedDocument("RegionBehavior", id)',
        behaviorCreate: 'region.createEmbeddedDocuments("RegionBehavior", data)',
        behaviorUpdate: "behavior.update(changed)",
        behaviorDelete: "behavior.delete()",
        behaviorType: "behavior.type",
        behaviorEvents: "RegionBehaviorType.events",
        readBack: 'region.getEmbeddedDocument("RegionBehavior", id)',
      },
      payloadBoundary: "adapter-owned-region-behavior-config-no-raw-foundry-payload",
      capabilityGate: ["foundry.region.read", "foundry.region.write", "foundry.users.active-gm"],
      mechanicOwner: "native-region-behavior",
      optionalOwners: ["midi", "dae"],
      authority: "active-gm",
      execution: { status: "disabled" },
    });
    expect(plan.behaviorBinding).toBeNull();
    expect(plan.observed).toBeNull();
    expect(validateRegionBehaviorOperationPlan(plan)).toEqual(plan);
    expect("data" in plan).toBe(false);
    expect("changed" in plan).toBe(false);
    expect("config" in plan).toBe(false);
  });

  it("requires an exact observed behavior for update/delete and preserves native type", () => {
    const common = {
      planId: createStableDiceBoxId("region-behavior-plan", "update-pause-on-entry"),
      region: { id: regionId, kind: "region" as const },
      behaviorId,
      regionBinding,
      behaviorBinding,
      observed,
      regionResolve: "game.scenes.get" as const,
    };
    const update = createRegionBehaviorOperationPlan({ ...common, operation: "update", intent });
    const deletion = createRegionBehaviorOperationPlan({ ...common, operation: "delete" });

    expect(update.behaviorBinding).toEqual(behaviorBinding);
    expect(update.intent?.behaviorType).toBe("pause-game");
    expect(deletion.intent).toBeNull();
    expect(deletion.readBack).toBe('region.getEmbeddedDocument("RegionBehavior", id)');

    expect(() => createRegionBehaviorOperationPlan({
      ...common,
      operation: "update",
      intent: { ...intent, behaviorType: "teleport-token" },
    })).toThrow();
    const { behaviorBinding: _behaviorBinding, observed: _observed, ...withoutExisting } = common;
    expect(() => createRegionBehaviorOperationPlan({
      ...withoutExisting,
      operation: "update",
      intent,
    })).toThrow();
  });

  it("rejects stale, foreign, and parent-mismatched identities", () => {
    expect(() => createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "foreign-region"),
      operation: "create",
      region: { id: regionId, kind: "scene" },
      behaviorId,
      regionBinding,
      intent,
      regionResolve: "fromUuid",
    })).toThrow();
    expect(() => createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "stale-behavior"),
      operation: "update",
      region: { id: regionId, kind: "region" },
      behaviorId,
      regionBinding,
      behaviorBinding: { ...behaviorBinding, generation: 3 },
      observed,
      intent,
      regionResolve: "fromUuid",
    })).toThrow();
    expect(() => createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "foreign-parent"),
      operation: "update",
      region: { id: regionId, kind: "region" },
      behaviorId,
      regionBinding,
      behaviorBinding,
      observed: { ...observed, parentRegionUuid: "Scene.world.foreign.Region.other" },
      intent,
      regionResolve: "fromUuid",
    })).toThrow();
  });

  it("rejects raw RegionBehavior payloads and keeps optional modules non-owning", () => {
    expect(() => createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "raw-payload"),
      operation: "create",
      region: { id: regionId, kind: "region" },
      behaviorId,
      regionBinding,
      intent,
      regionResolve: "fromUuid",
      data: { type: "pause-game", system: { events: ["tokenEnter"] } },
      changed: { disabled: false },
      config: { arbitrary: true },
    } as never)).toThrow();

    const plan = createRegionBehaviorOperationPlan({
      planId: createStableDiceBoxId("region-behavior-plan", "owner-check"),
      operation: "create",
      region: { id: regionId, kind: "region" },
      behaviorId,
      regionBinding,
      intent,
      regionResolve: "fromUuid",
    });
    expect(plan.mechanicOwner).toBe("native-region-behavior");
    expect(plan.optionalOwners).toEqual(["midi", "dae"]);
    expect(plan.execution.status).toBe("disabled");
  });
});
