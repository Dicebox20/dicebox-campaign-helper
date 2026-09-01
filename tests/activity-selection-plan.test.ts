import { describe, expect, it } from "vitest";
import {
  createActivitySelectionPlan,
  validateActivitySelectionPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const itemId = createStableDiceBoxId("item", "guard-strike");
const activityId = createStableDiceBoxId("activity", "guard-strike");
const itemBinding: RuntimeBinding = {
  semantic: { id: itemId, kind: "item" },
  runtime: "foundry",
  documentType: "Item",
  documentId: "item-1",
  uuid: "Item.item-1",
  generation: 2,
};

const input = {
  planId: createStableDiceBoxId("activity-plan", "guard-strike"),
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
  itemResolve: "fromUuid" as const,
};

describe("deterministic D&D5e Activity selection plan", () => {
  it("emits official API bindings and keeps execution disabled", () => {
    const plan = createActivitySelectionPlan(input);

    expect(plan).toMatchObject({
      schemaVersion: "0.1.0",
      kind: "dnd5e-activity-selection",
      foundryApi: {
        itemResolve: "fromUuid",
        activityRead: 'item.getEmbeddedDocument("Activity", id)',
        activityCollection: "item.system.activities.contents",
        activityUse: "activity.use(usage, dialog, message)",
        preUseHook: "dnd5e.preUseActivity",
        postUseHook: "dnd5e.postUseActivity",
      },
      capabilityGate: ["dnd5e.activities", "dnd5e.activity-hooks", "foundry.users.active-gm"],
      authority: "active-gm",
      execution: {
        status: "disabled",
        reason: "exact-runtime-activity-hook-and-authority-gate-required",
      },
    });
    expect(validateActivitySelectionPlan(plan)).toEqual(plan);
    expect("execute" in plan).toBe(false);
  });

  it("rejects activity identity, parent, and generation mismatches", () => {
    expect(() => createActivitySelectionPlan({
      ...input,
      activityBinding: { ...input.activityBinding, activityUuid: "Item.item-1.Activity.foreign" },
    })).toThrow();
    expect(() => createActivitySelectionPlan({
      ...input,
      observed: { ...input.observed, parentItemUuid: "Item.other" },
    })).toThrow();
    expect(() => createActivitySelectionPlan({
      ...input,
      activityBinding: { ...input.activityBinding, generation: 1 },
    })).toThrow();
  });

  it("rejects an Item binding with the wrong document or semantic kind", () => {
    expect(() => createActivitySelectionPlan({
      ...input,
      itemBinding: { ...input.itemBinding, documentType: "Actor" },
    })).toThrow();
    expect(() => createActivitySelectionPlan({
      ...input,
      item: { id: itemId, kind: "actor" },
    })).toThrow();
  });

  it("does not accept raw Foundry payloads or optional-module ownership", () => {
    expect(() => createActivitySelectionPlan({
      ...input,
      observed: { ...input.observed, raw: { system: { activities: {} } } } as typeof input.observed,
    })).toThrow();
    const plan = createActivitySelectionPlan(input);
    expect(JSON.stringify(plan)).not.toContain("Midi");
    expect(JSON.stringify(plan)).not.toContain("DAE");
  });
});
