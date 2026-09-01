import { describe, expect, it } from "vitest";
import {
  createFoundryDnd5eActivityReadAdapter,
  type FoundryDnd5eActivityDocument,
  type FoundryDnd5eItemDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const itemBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("item", "guard-strike"), kind: "item" },
  runtime: "foundry",
  documentType: "Item",
  documentId: "item-1",
  uuid: "Item.item-1",
  generation: 2,
};

const attack: FoundryDnd5eActivityDocument = {
  id: "activity-2",
  uuid: "Item.item-1.Activity.activity-2",
  name: "Guard Strike",
  type: "attack",
  canUse: true,
  isOwner: true,
  item: { uuid: itemBinding.uuid },
};

const utility: FoundryDnd5eActivityDocument = {
  id: "activity-1",
  uuid: "Item.item-1.Activity.activity-1",
  name: "Call Out",
  type: "utility",
  canUse: false,
  isOwner: true,
  item: { uuid: itemBinding.uuid },
};

function makeItem(overrides: Partial<FoundryDnd5eItemDocument> = {}): FoundryDnd5eItemDocument {
  return {
    id: itemBinding.documentId,
    uuid: itemBinding.uuid,
    documentName: "Item",
    system: { activities: { contents: [attack, utility] } },
    getEmbeddedDocument(documentType, activityId) {
      if (documentType !== "Activity") return null;
      if (activityId === attack.id) return attack;
      if (activityId === utility.id) return utility;
      return null;
    },
    ...overrides,
  };
}

describe("read-only D&D5e Activity observation adapter", () => {
  it("reads an exact Activity through Item.getEmbeddedDocument", async () => {
    let calls = 0;
    const adapter = createFoundryDnd5eActivityReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === itemBinding.uuid ? makeItem() : null;
      },
    });

    const result = await adapter.read(itemBinding, attack.id!);

    expect(adapter.adapterId).toBe("foundry.dnd5e-activity.read@14.367-5.3.3");
    expect(adapter.foundryApi).toEqual({
      itemResolve: "fromUuid",
      activityRead: 'item.getEmbeddedDocument("Activity", id)',
      activityCollection: "item.system.activities.contents",
    });
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        activityId: "activity-2",
        activityUuid: "Item.item-1.Activity.activity-2",
        activityType: "attack",
        displayName: "Guard Strike",
        itemBinding,
        canUse: true,
        isOwner: true,
        parentItemUuid: itemBinding.uuid,
      },
    });
  });

  it("lists the D&D5e Item Activity collection through game.items.get", async () => {
    let calls = 0;
    const adapter = createFoundryDnd5eActivityReadAdapter({
      game: {
        items: {
          get: (id) => {
            calls += 1;
            return id === itemBinding.documentId ? makeItem() : null;
          },
        },
      },
    });

    const result = await adapter.list(itemBinding);

    expect(adapter.foundryApi.itemResolve).toBe("game.items.get");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        itemBinding,
        count: 2,
        entries: [
          { activityId: "activity-1", activityUuid: "Item.item-1.Activity.activity-1", activityType: "utility", displayName: "Call Out" },
          { activityId: "activity-2", activityUuid: "Item.item-1.Activity.activity-2", activityType: "attack", displayName: "Guard Strike" },
        ],
      },
    });
  });

  it("returns null for a missing Activity and rejects non-Item bindings", async () => {
    const adapter = createFoundryDnd5eActivityReadAdapter({ fromUuid: async () => makeItem() });
    const missing = await adapter.read(itemBinding, "activity-missing");
    const nonItem: RuntimeBinding = { ...itemBinding, documentType: "Actor" };
    const forbidden = await adapter.read(nonItem, "activity-2");

    expect(missing).toEqual({ ok: true, value: null });
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) expect(forbidden.error.code).toBe("FORBIDDEN");
  });

  it("preserves foreign identity, malformed collection, and resolution failures", async () => {
    const foreign = createFoundryDnd5eActivityReadAdapter({
      fromUuid: async () => ({ ...makeItem(), uuid: "Item.foreign" }),
    });
    const malformed = createFoundryDnd5eActivityReadAdapter({
      fromUuid: async () => makeItem({ system: { activities: { contents: [{}] } } }),
    });
    const throwing = createFoundryDnd5eActivityReadAdapter({
      fromUuid: async () => { throw new Error("activity timeout"); },
    });

    for (const result of [
      await foreign.read(itemBinding, "activity-2"),
      await malformed.list(itemBinding),
      await throwing.read(itemBinding, "activity-2"),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("UNKNOWN_OUTCOME");
        expect(result.error.retry).toBe("after-reread");
      }
    }
  });

  it("fails closed when the exact Activity read surface is absent and exposes no use method", async () => {
    const { getEmbeddedDocument: _read, ...itemWithoutRead } = makeItem();
    const unavailable = createFoundryDnd5eActivityReadAdapter({
      fromUuid: async () => itemWithoutRead,
    });
    const result = await unavailable.read(itemBinding, "activity-2");

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("UNAVAILABLE");
    expect("use" in unavailable).toBe(false);
    expect("create" in unavailable).toBe(false);
    expect("update" in unavailable).toBe(false);
    expect("delete" in unavailable).toBe(false);
  });
});
