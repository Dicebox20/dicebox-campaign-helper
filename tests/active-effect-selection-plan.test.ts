import { describe, expect, it } from "vitest";
import {
  createActiveEffectSelectionPlan,
  validateActiveEffectSelectionPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const actorId = createStableDiceBoxId("actor", "guard");
const effectId = createStableDiceBoxId("effect", "blessed-guard");
const actorBinding: RuntimeBinding = {
  semantic: { id: actorId, kind: "actor" },
  runtime: "foundry",
  documentType: "Actor",
  documentId: "actor-1",
  uuid: "Actor.actor-1",
  generation: 3,
};

const input = {
  planId: createStableDiceBoxId("effect-plan", "blessed-guard"),
  parent: { id: actorId, kind: "actor" as const },
  effectId,
  parentBinding: actorBinding,
  effectBinding: {
    effectId: "effect-1",
    effectUuid: "Actor.actor-1.ActiveEffect.effect-1",
    generation: 3,
  },
  observed: {
    effectId: "effect-1",
    effectUuid: "Actor.actor-1.ActiveEffect.effect-1",
    displayName: "Blessed Guard",
    disabled: false,
    isSuppressed: false,
    active: true,
    changeCount: 1,
    iconPresent: true,
  },
  parentResolve: "fromUuid" as const,
};

describe("deterministic native ActiveEffect selection plan", () => {
  it("names native Foundry APIs and keeps effect execution disabled", () => {
    const plan = createActiveEffectSelectionPlan(input);

    expect(plan).toMatchObject({
      kind: "foundry-active-effect-selection",
      foundryApi: {
        parentResolve: "fromUuid",
        embeddedCollection: 'parent.getEmbeddedCollection("ActiveEffect")',
        embeddedDocument: 'parent.getEmbeddedDocument("ActiveEffect", id)',
        futureCreate: 'parent.createEmbeddedDocuments("ActiveEffect", data)',
        futureUpdate: "effect.update(changed)",
        futureDelete: "effect.delete()",
      },
      capabilityGate: ["foundry.document.read", "foundry.document.write", "foundry.users.active-gm"],
      mechanicOwner: "native-active-effect",
      optionalOwners: ["dae", "midi"],
      authority: "active-gm",
      execution: {
        status: "disabled",
        reason: "exact-runtime-effect-schema-permission-and-authority-gate-required",
      },
    });
    expect(validateActiveEffectSelectionPlan(plan)).toEqual(plan);
    expect("execute" in plan).toBe(false);
  });

  it("rejects identity, parent, and generation mismatches", () => {
    expect(() => createActiveEffectSelectionPlan({
      ...input,
      effectBinding: { ...input.effectBinding, effectUuid: "Actor.other.ActiveEffect.effect-1" },
    })).toThrow();
    expect(() => createActiveEffectSelectionPlan({
      ...input,
      parent: { id: actorId, kind: "item" },
    })).toThrow();
    expect(() => createActiveEffectSelectionPlan({
      ...input,
      effectBinding: { ...input.effectBinding, generation: 2 },
    })).toThrow();
  });

  it("rejects a foreign parent document and raw effect payloads", () => {
    expect(() => createActiveEffectSelectionPlan({
      ...input,
      parentBinding: { ...input.parentBinding, documentType: "JournalEntry" },
    })).toThrow();
    expect(() => createActiveEffectSelectionPlan({
      ...input,
      observed: { ...input.observed, changes: [{ key: "system.hp.value", value: "999" }] } as typeof input.observed,
    })).toThrow();
  });

  it("does not make DAE or Midi an implicit owner", () => {
    const plan = createActiveEffectSelectionPlan(input);
    expect(plan.mechanicOwner).toBe("native-active-effect");
    expect(plan.execution.status).toBe("disabled");
  });
});
