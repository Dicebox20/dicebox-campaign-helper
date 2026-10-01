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

const intentSchema = z.object({
  intentId: StableDiceBoxIdSchema,
  intentFingerprint: z.string().min(1),
  expectedChangeCount: z.number().int().nonnegative(),
}).strict();

const activeEffectOperationInputSchema = z.object({
  planId: StableDiceBoxIdSchema,
  operation: z.enum(["create", "update", "delete"]),
  parent: SemanticRefSchema,
  effectId: StableDiceBoxIdSchema,
  parentBinding: RuntimeBindingSchema,
  effectBinding: effectBindingSchema.optional(),
  observed: effectObservationSchema.optional(),
  intent: intentSchema.optional(),
  parentResolve: z.enum(["fromUuid", "game.actors.get", "game.items.get"]),
}).strict();

export const activeEffectOperationPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  kind: z.literal("foundry-active-effect-operation"),
  operation: z.enum(["create", "update", "delete"]),
  parent: SemanticRefSchema,
  effectId: StableDiceBoxIdSchema,
  parentBinding: RuntimeBindingSchema,
  effectBinding: effectBindingSchema.nullable(),
  observed: effectObservationSchema.nullable(),
  intent: intentSchema.nullable(),
  foundryApi: z.object({
    parentResolve: z.enum(["fromUuid", "game.actors.get", "game.items.get"]),
    collectionRead: z.literal('parent.getEmbeddedCollection("ActiveEffect")'),
    documentRead: z.literal('parent.getEmbeddedDocument("ActiveEffect", id)'),
    create: z.literal('parent.createEmbeddedDocuments("ActiveEffect", data)'),
    update: z.literal("effect.update(changed)"),
    delete: z.literal("effect.delete()"),
  }).strict(),
  payloadBoundary: z.literal("adapter-owned-native-schema-no-raw-foundry-payload"),
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
      message: "The ActiveEffect operation must bind an exact Actor or Item parent semantic identity.",
    });
  }

  const requiresExistingEffect = value.operation === "update" || value.operation === "delete";
  if (requiresExistingEffect && (!value.effectBinding || !value.observed)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effectBinding"],
      message: "Update and delete operations require an exact observed ActiveEffect binding.",
    });
  }
  if (!requiresExistingEffect && (value.effectBinding !== null || value.observed !== null)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effectBinding"],
      message: "Create operations cannot claim an existing ActiveEffect binding.",
    });
  }
  if (value.effectBinding && value.effectBinding.generation !== value.parentBinding.generation) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["effectBinding", "generation"],
      message: "ActiveEffect and parent bindings must share the reviewed binding generation.",
    });
  }
  if (value.effectBinding && value.observed
    && (value.observed.effectId !== value.effectBinding.effectId
      || value.observed.effectUuid !== value.effectBinding.effectUuid)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed"],
      message: "The observed ActiveEffect identity must match the reviewed runtime binding.",
    });
  }
  const requiresIntent = value.operation === "create" || value.operation === "update";
  if (requiresIntent && value.intent === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intent"],
      message: "Create and update operations require a stable DiceBox effect intent reference.",
    });
  }
  if (!requiresIntent && value.intent !== null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intent"],
      message: "Delete operations cannot carry a new effect definition intent.",
    });
  }
});

export type ActiveEffectOperationPlan = z.infer<typeof activeEffectOperationPlanSchema>;
export type ActiveEffectOperation = ActiveEffectOperationPlan["operation"];
export type ActiveEffectOperationIntent = z.infer<typeof intentSchema>;
export type ActiveEffectOperationObservation = z.infer<typeof effectObservationSchema>;

export interface CreateActiveEffectOperationPlanInput {
  readonly planId: StableDiceBoxId;
  readonly operation: ActiveEffectOperation;
  readonly parent: SemanticRef;
  readonly effectId: StableDiceBoxId;
  readonly parentBinding: RuntimeBinding;
  readonly effectBinding?: {
    readonly effectId: string;
    readonly effectUuid: string;
    readonly generation: number;
  };
  readonly observed?: ActiveEffectOperationObservation;
  readonly intent?: ActiveEffectOperationIntent;
  readonly parentResolve: "fromUuid" | "game.actors.get" | "game.items.get";
}

export function createActiveEffectOperationPlan(
  input: CreateActiveEffectOperationPlanInput,
): ActiveEffectOperationPlan {
  const parsed = activeEffectOperationInputSchema.parse(input);
  return activeEffectOperationPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: parsed.planId,
    kind: "foundry-active-effect-operation",
    operation: parsed.operation,
    parent: parsed.parent,
    effectId: parsed.effectId,
    parentBinding: parsed.parentBinding,
    effectBinding: parsed.effectBinding ?? null,
    observed: parsed.observed ?? null,
    intent: parsed.intent ?? null,
    foundryApi: {
      parentResolve: parsed.parentResolve,
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
    execution: {
      status: "disabled",
      reason: "exact-runtime-effect-schema-permission-and-authority-gate-required",
    },
    readBack: 'parent.getEmbeddedDocument("ActiveEffect", id)',
  });
}

export function validateActiveEffectOperationPlan(input: unknown): ActiveEffectOperationPlan {
  return activeEffectOperationPlanSchema.parse(input);
}
