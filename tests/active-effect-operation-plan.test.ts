import { describe, expect, it } from "vitest";
import {
  createActiveEffectOperationPlan,
  validateActiveEffectOperationPlan,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeBinding } from "@dicebox/core";

const actorId = createStableDiceBoxId("actor", "guard");
const effectId = createStableDiceBoxId("effect", "blessed-guard");
const effectIntentId = createStableDiceBoxId("effect-intent", "blessed-guard");
const actorBinding: RuntimeBinding = {
  semantic: { id: actorId, kind: "actor" },
  runtime: "foundry",
  documentType: "Actor",
  documentId: "actor-1",
  uuid: "Actor.actor-1",
  generation: 3,
};

const observed = {
  effectId: "effect-1",
  effectUuid: "Actor.actor-1.ActiveEffect.effect-1",
  displayName: "Blessed Guard",
  disabled: false,
  isSuppressed: false,
  active: true,
  changeCount: 1,
  iconPresent: true,
};

const effectBinding = {
  effectId: "effect-1",
  effectUuid: "Actor.actor-1.ActiveEffect.effect-1",
  generation: 3,
};

const intent = {
  intentId: effectIntentId,
  intentFingerprint: "sha256:effect-definition-fixture",
  expectedChangeCount: 1,
};

describe("review-first native ActiveEffect operation plan", () => {
  it("creates a native API-bound create plan without raw Foundry data", () => {
    const plan = createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "create-blessed-guard"),
      operation: "create",
      parent: { id: actorId, kind: "actor" },
      effectId,
      parentBinding: actorBinding,
      intent,
      parentResolve: "fromUuid",
    });

    expect(plan).toMatchObject({
      kind: "foundry-active-effect-operation",
      operation: "create",
      foundryApi: {
        parentResolve: "fromUuid",
        collectionRead: 'parent.getEmbeddedCollection("ActiveEffect")',
        documentRead: 'parent.getEmbeddedDocument("ActiveEffect", id)',
        create: 'parent.createEmbeddedDocuments("ActiveEffect", data)',
        update: "effect.update(changed)",
        delete: "effect.delete()",
      },
      payloadBoundary: "adapter-owned-native-schema-no-raw-foundry-payload",
      capabilityGate: ["foundry.document.read", "foundry.document.write", "foundry.users.active-gm"],
      mechanicOwner: "native-active-effect",
      optionalOwners: ["dae", "midi"],
      authority: "active-gm",
      execution: { status: "disabled" },
    });
    expect(plan.effectBinding).toBeNull();
    expect(plan.observed).toBeNull();
    expect(validateActiveEffectOperationPlan(plan)).toEqual(plan);
    expect("data" in plan).toBe(false);
    expect("changed" in plan).toBe(false);
  });

  it("requires an exact observed binding for update and delete", () => {
    const common = {
      planId: createStableDiceBoxId("effect-plan", "update-blessed-guard"),
      parent: { id: actorId, kind: "actor" as const },
      effectId,
      parentBinding: actorBinding,
      effectBinding,
      observed,
      parentResolve: "game.actors.get" as const,
    };

    const update = createActiveEffectOperationPlan({
      ...common,
      operation: "update",
      intent,
    });
    const deletion = createActiveEffectOperationPlan({
      ...common,
      operation: "delete",
    });

    expect(update.operation).toBe("update");
    expect(update.effectBinding).toEqual(effectBinding);
    expect(deletion.operation).toBe("delete");
    expect(deletion.intent).toBeNull();
    expect(deletion.readBack).toBe('parent.getEmbeddedDocument("ActiveEffect", id)');
  });

  it("rejects missing, foreign, or generation-stale bindings", () => {
    expect(() => createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "missing-update-binding"),
      operation: "update",
      parent: { id: actorId, kind: "actor" },
      effectId,
      parentBinding: actorBinding,
      intent,
      parentResolve: "fromUuid",
    })).toThrow();

    expect(() => createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "foreign-create-binding"),
      operation: "create",
      parent: { id: actorId, kind: "item" },
      effectId,
      parentBinding: actorBinding,
      intent,
      parentResolve: "fromUuid",
    })).toThrow();

    expect(() => createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "stale-update-binding"),
      operation: "update",
      parent: { id: actorId, kind: "actor" },
      effectId,
      parentBinding: actorBinding,
      effectBinding: { ...effectBinding, generation: 2 },
      observed,
      intent,
      parentResolve: "fromUuid",
    })).toThrow();
  });

  it("rejects raw Foundry payloads and keeps optional modules non-owning", () => {
    expect(() => createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "raw-payload"),
      operation: "create",
      parent: { id: actorId, kind: "actor" },
      effectId,
      parentBinding: actorBinding,
      intent,
      parentResolve: "fromUuid",
      data: { changes: [{ key: "system.attributes.ac.bonus", value: "1" }] },
    } as never)).toThrow();

    const plan = createActiveEffectOperationPlan({
      planId: createStableDiceBoxId("effect-plan", "owner-check"),
      operation: "create",
      parent: { id: actorId, kind: "actor" },
      effectId,
      parentBinding: actorBinding,
      intent,
      parentResolve: "fromUuid",
    });
    expect(plan.mechanicOwner).toBe("native-active-effect");
    expect(plan.optionalOwners).toEqual(["dae", "midi"]);
    expect(plan.execution.status).toBe("disabled");
  });
});
