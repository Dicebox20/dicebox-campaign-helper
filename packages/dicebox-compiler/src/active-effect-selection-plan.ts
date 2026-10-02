import {
  RuntimeBindingSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type RuntimeBinding,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { z } from "zod";

const effectBindingSchema = z.object({
  effectId: z.string().min(1),
  effectUuid: z.string().min(1),
  generation: z.number().int().nonnegative(),
}).strict();

const effectObservationSchema = z.object({
  effectId: z.string().min(1),
  effectUuid: z.string().min(1),
  displayName: z.string().min(1).optional(),
  disabled: z.boolean().nullable(),
  isSuppressed: z.boolean().nullable(),
  active: z.boolean().nullable(),
  changeCount: z.number().int().nonnegative().nullable(),
  iconPresent: z.boolean().nullable(),
}).strict();

export const activeEffectSelectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  kind: z.literal("foundry-active-effect-selection"),
  parent: SemanticRefSchema,
  effectId: StableDiceBoxIdSchema,
  parentBinding: RuntimeBindingSchema,
  effectBinding: effectBindingSchema,
  observed: effectObservationSchema,
  foundryApi: z.object({
    parentResolve: z.enum(["fromUuid", "game.actors.get", "game.items.get"]),
    embeddedCollection: z.literal('parent.getEmbeddedCollection("ActiveEffect")'),
    embeddedDocument: z.literal('parent.getEmbeddedDocument("ActiveEffect", id)'),
    futureCreate: z.literal('parent.createEmbeddedDocuments("ActiveEffect", data)'),
    futureUpdate: z.literal("effect.update(changed)"),
    futureDelete: z.literal("effect.delete()"),
  }).strict(),
  capabilityGate: z.tuple([
    z.literal("foundry.document.read"),
    z.literal("foundry.document.write"),
    z.literal("foundry.users.active-gm"),
  ]),
  mechanicOwner: z.literal("native-active-effect"),
  optionalOwners: z.tuple([z.literal("dae"), z.literal("midi")]),
  authority: z.literal("active-gm"),
  execution: z.object({
    status: z.literal("disabled"),
    reason: z.literal("exact-runtime-effect-schema-permission-and-authority-gate-required"),
  }).strict(),
  readBack: z.literal('parent.getEmbeddedDocument("ActiveEffect", id)'),
}).strict().superRefine((value, context) => {
  const parentKindMatches = (value.parent.kind === "actor" && value.parentBinding.documentType === "Actor")
    || (value.parent.kind === "item" && value.parentBinding.documentType === "Item");
  if (!parentKindMatches
    || value.parentBinding.semantic.id !== value.parent.id
    || value.parentBinding.semantic.kind !== value.parent.kind) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["parentBinding"],
      message: "The ActiveEffect plan must bind an exact Actor or Item parent semantic identity.",
    });
  }
  if (value.effectBinding.generation !== value.parentBinding.generation) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effectBinding", "generation"],
      message: "ActiveEffect and parent bindings must share the reviewed binding generation.",
    });
  }
  if (value.observed.effectId !== value.effectBinding.effectId
    || value.observed.effectUuid !== value.effectBinding.effectUuid) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed"],
      message: "The observed ActiveEffect identity must match the reviewed runtime binding.",
    });
  }
});

export type ActiveEffectSelectionPlan = z.infer<typeof activeEffectSelectionPlanSchema>;
export type ActiveEffectObservationInput = z.infer<typeof effectObservationSchema>;

export interface CreateActiveEffectSelectionPlanInput {
  readonly planId: StableDiceBoxId;
  readonly parent: SemanticRef;
  readonly effectId: StableDiceBoxId;
  readonly parentBinding: RuntimeBinding;
  readonly effectBinding: {
    readonly effectId: string;
    readonly effectUuid: string;
    readonly generation: number;
  };
  readonly observed: ActiveEffectObservationInput;
  readonly parentResolve: "fromUuid" | "game.actors.get" | "game.items.get";
}

export function createActiveEffectSelectionPlan(
  input: CreateActiveEffectSelectionPlanInput,
): ActiveEffectSelectionPlan {
  return activeEffectSelectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: input.planId,
    kind: "foundry-active-effect-selection",
    parent: input.parent,
    effectId: input.effectId,
    parentBinding: input.parentBinding,
    effectBinding: input.effectBinding,
    observed: input.observed,
    foundryApi: {
      parentResolve: input.parentResolve,
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
    readBack: 'parent.getEmbeddedDocument("ActiveEffect", id)',
  });
}

export function validateActiveEffectSelectionPlan(input: unknown): ActiveEffectSelectionPlan {
  return activeEffectSelectionPlanSchema.parse(input);
}
