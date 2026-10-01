import { describe, expect, it } from "vitest";
import {
  createActivityOperationPlan,
  validateActivityOperationPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const itemId = createStableDiceBoxId("item", "guard-strike");
const activityId = createStableDiceBoxId("activity", "guard-strike");
const intentId = createStableDiceBoxId("activity-intent", "guard-strike");
const itemBinding: RuntimeBinding = {
  semantic: { id: itemId, kind: "item" },
  runtime: "foundry",
  documentType: "Item",
  documentId: "item-1",
  uuid: "Item.item-1",
  generation: 2,
};

const input = {
  planId: createStableDiceBoxId("activity-plan", "use-guard-strike"),
  item: { id: itemId, kind: "item" as const },
  activityId,
  itemBinding,
  activityBinding: {
    activityId: "activity-2",
    activityUuid: "Item.item-1.Activity.activity-2",
    generation: 2,
  },
  observed: {
    activityId: "activity-2",
    activityUuid: "Item.item-1.Activity.activity-2",
    activityType: "attack",
    displayName: "Guard Strike",
    canUse: true,
    isOwner: true,
    parentItemUuid: itemBinding.uuid,
  },
  intent: {
    intentId,
    intentFingerprint: "sha256:activity-use-fixture",
    dialogPolicy: "adapter-default" as const,
    messagePolicy: "create" as const,
    subsequentActions: true,
  },
  itemResolve: "fromUuid" as const,
};

describe("review-first native D&D5e Activity operation plan", () => {
  it("binds the official Activity.use lifecycle and keeps execution disabled", () => {
    const plan = createActivityOperationPlan(input);

    expect(plan).toMatchObject({
      kind: "dnd5e-activity-operation",
      operation: "use",
      foundryApi: {
        itemResolve: "fromUuid",
        activityRead: 'item.getEmbeddedDocument("Activity", id)',
        activityCollection: "item.system.activities.contents",
        preUseHook: "dnd5e.preUseActivity",
        activityUse: "activity.use(usage, dialog, message)",
        postUseHook: "dnd5e.postUseActivity",
        readBack: 'item.getEmbeddedDocument("Activity", id)',
      },
      payloadBoundary: "adapter-owned-activity-use-config-no-raw-foundry-payload",
      capabilityGate: ["dnd5e.activities", "dnd5e.activity-hooks", "foundry.users.active-gm"],
      mechanicOwner: "native-activity",
      optionalOwners: ["midi", "dae"],
      authority: "active-gm",
      execution: {
        status: "disabled",
        reason: "exact-runtime-activity-hook-and-authority-gate-required",
      },
    });
    expect(validateActivityOperationPlan(plan)).toEqual(plan);
    expect("usage" in plan).toBe(false);
    expect("dialog" in plan).toBe(false);
    expect("message" in plan).toBe(false);
  });

  it("requires positive ownership and canUse observations before use", () => {
    expect(() => createActivityOperationPlan({
      ...input,
      observed: { ...input.observed, canUse: false },
    })).toThrow();
    expect(() => createActivityOperationPlan({
      ...input,
      observed: { ...input.observed, isOwner: null },
    })).toThrow();
  });

  it("rejects stale or foreign Item/Activity identity", () => {
    expect(() => createActivityOperationPlan({
      ...input,
      item: { id: itemId, kind: "actor" },
    })).toThrow();
    expect(() => createActivityOperationPlan({
      ...input,
      activityBinding: { ...input.activityBinding, generation: 1 },
    })).toThrow();
    expect(() => createActivityOperationPlan({
      ...input,
      observed: { ...input.observed, parentItemUuid: "Item.foreign" },
    })).toThrow();
  });

  it("rejects raw Activity.use payloads and preserves native ownership", () => {
    expect(() => createActivityOperationPlan({
      ...input,
      usage: { targets: ["raw-token"] },
      dialog: { configure: true },
      message: { data: { flags: { arbitrary: true } } },
    } as never)).toThrow();

    const plan = createActivityOperationPlan(input);
    expect(plan.mechanicOwner).toBe("native-activity");
    expect(plan.optionalOwners).toEqual(["midi", "dae"]);
    expect(plan.execution.status).toBe("disabled");
  });
});
