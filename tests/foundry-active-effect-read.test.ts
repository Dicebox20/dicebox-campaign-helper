import { describe, expect, it } from "vitest";
import {
  createFoundryActiveEffectReadAdapter,
  type FoundryActiveEffectDocument,
  type FoundryActiveEffectParentDocument,
} from "@dicebox/bridge";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const actorBinding: RuntimeBinding = {
  semantic: { id: createStableDiceBoxId("actor", "guard"), kind: "actor" },
  runtime: "foundry",
  documentType: "Actor",
  documentId: "actor-1",
  uuid: "Actor.actor-1",
  generation: 3,
};

const effect: FoundryActiveEffectDocument = {
  id: "effect-1",
  uuid: "Actor.actor-1.ActiveEffect.effect-1",
  documentName: "ActiveEffect",
  name: "Blessed Guard",
  disabled: false,
  isSuppressed: false,
  active: true,
  icon: "icons/svg/aura.svg",
  changes: [{ key: "system.attributes.ac.bonus", mode: 2, value: "1" }],
};

const secondEffect: FoundryActiveEffectDocument = {
  id: "effect-2",
  uuid: "Actor.actor-1.ActiveEffect.effect-2",
  documentName: "ActiveEffect",
  name: "Suppressed Guard",
  disabled: true,
  isSuppressed: true,
  active: false,
};

function makeActor(overrides: Partial<FoundryActiveEffectParentDocument> = {}): FoundryActiveEffectParentDocument {
  return {
    id: actorBinding.documentId,
    uuid: actorBinding.uuid,
    documentName: "Actor",
    getEmbeddedCollection(documentType) {
      return documentType === "ActiveEffect" ? { contents: [secondEffect, effect] } : { contents: [] };
    },
    getEmbeddedDocument(documentType, effectId) {
      if (documentType !== "ActiveEffect") return null;
      if (effectId === effect.id) return effect;
      if (effectId === secondEffect.id) return secondEffect;
      return null;
    },
    ...overrides,
  };
}

describe("read-only Foundry ActiveEffect observation adapter", () => {
  it("reads an exact ActiveEffect through the parent embedded-document API", async () => {
    let calls = 0;
    const adapter = createFoundryActiveEffectReadAdapter({
      fromUuid: async (uuid) => {
        calls += 1;
        return uuid === actorBinding.uuid ? makeActor() : null;
      },
    });

    const result = await adapter.read(actorBinding, "effect-1");

    expect(adapter.adapterId).toBe("foundry.active-effect.read@14.367");
    expect(adapter.foundryApi).toEqual({
      parentResolve: "fromUuid",
      embeddedCollection: 'parent.getEmbeddedCollection("ActiveEffect")',
      embeddedDocument: 'parent.getEmbeddedDocument("ActiveEffect", id)',
    });
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        effectId: "effect-1",
        effectUuid: "Actor.actor-1.ActiveEffect.effect-1",
        displayName: "Blessed Guard",
        parentBinding: actorBinding,
        disabled: false,
        isSuppressed: false,
        active: true,
        changeCount: 1,
        iconPresent: true,
      },
    });
  });

  it("lists typed ActiveEffects through the exact game.actors collection fallback", async () => {
    let calls = 0;
    const adapter = createFoundryActiveEffectReadAdapter({
      game: {
        actors: {
          get: (id) => {
            calls += 1;
            return id === actorBinding.documentId ? makeActor() : null;
          },
        },
      },
    });

    const result = await adapter.list(actorBinding);

    expect(adapter.foundryApi.parentResolve).toBe("game.actors.get");
    expect(calls).toBe(1);
    expect(result).toEqual({
      ok: true,
      value: {
        parentBinding: actorBinding,
        count: 2,
        entries: [
          { effectId: "effect-1", effectUuid: "Actor.actor-1.ActiveEffect.effect-1", displayName: "Blessed Guard" },
          { effectId: "effect-2", effectUuid: "Actor.actor-1.ActiveEffect.effect-2", displayName: "Suppressed Guard" },
        ],
      },
    });
  });

  it("returns null for a missing effect and rejects a non-Actor/Item parent", async () => {
    const adapter = createFoundryActiveEffectReadAdapter({ fromUuid: async () => makeActor() });
    const missing = await adapter.read(actorBinding, "effect-missing");
    const nonParent: RuntimeBinding = { ...actorBinding, documentType: "Scene" };
    const forbidden = await adapter.read(nonParent, "effect-1");

    expect(missing).toEqual({ ok: true, value: null });
    expect(forbidden.ok).toBe(false);
    if (!forbidden.ok) expect(forbidden.error.code).toBe("FORBIDDEN");
  });

  it("fails closed on foreign identity, malformed entries, and unavailable surfaces", async () => {
    const foreign = createFoundryActiveEffectReadAdapter({
      fromUuid: async () => ({ ...makeActor(), uuid: "Actor.foreign" }),
    });
    const malformed = createFoundryActiveEffectReadAdapter({
      fromUuid: async () => makeActor({ getEmbeddedCollection: () => ({ contents: [{ documentName: "ActiveEffect" }] }) }),
    });
    const { getEmbeddedDocument: _read, ...actorWithoutRead } = makeActor();
    const unavailable = createFoundryActiveEffectReadAdapter({ fromUuid: async () => actorWithoutRead });

    for (const result of [
      await foreign.read(actorBinding, "effect-1"),
      await malformed.list(actorBinding),
      await unavailable.read(actorBinding, "effect-1"),
    ]) {
      expect(result.ok).toBe(false);
    }
    const foreignResult = await foreign.read(actorBinding, "effect-1");
    if (!foreignResult.ok) expect(foreignResult.error.code).toBe("UNKNOWN_OUTCOME");
    const malformedResult = await malformed.list(actorBinding);
    if (!malformedResult.ok) expect(malformedResult.error.code).toBe("UNKNOWN_OUTCOME");
    const unavailableResult = await unavailable.read(actorBinding, "effect-1");
    if (!unavailableResult.ok) expect(unavailableResult.error.code).toBe("UNAVAILABLE");
  });

  it("exposes no ActiveEffect mutation methods", async () => {
    const adapter = createFoundryActiveEffectReadAdapter({ fromUuid: async () => makeActor() });

    expect("createEmbeddedDocuments" in adapter).toBe(false);
    expect("updateEmbeddedDocuments" in adapter).toBe(false);
    expect("deleteEmbeddedDocuments" in adapter).toBe(false);
    expect("create" in adapter).toBe(false);
    expect("update" in adapter).toBe(false);
    expect("delete" in adapter).toBe(false);
  });
});
