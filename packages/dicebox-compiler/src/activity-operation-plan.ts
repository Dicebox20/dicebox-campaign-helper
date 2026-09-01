import {
  RuntimeBindingSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type RuntimeBinding,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { z } from "zod";

const activityBindingSchema = z.object({
  activityId: z.string().min(1),
  activityUuid: z.string().min(1),
  generation: z.number().int().nonnegative(),
}).strict();

const activityObservationSchema = z.object({
  activityId: z.string().min(1),
  activityUuid: z.string().min(1),
  activityType: z.string().min(1),
  displayName: z.string().min(1).optional(),
  canUse: z.boolean().nullable(),
  isOwner: z.boolean().nullable(),
  parentItemUuid: z.string().min(1).nullable(),
}).strict();

const useIntentSchema = z.object({
  intentId: StableDiceBoxIdSchema,
  intentFingerprint: z.string().min(1),
  dialogPolicy: z.enum(["adapter-default", "required", "skip"]),
  messagePolicy: z.enum(["adapter-default", "create", "suppress"]),
  subsequentActions: z.boolean(),
}).strict();

const activityOperationInputSchema = z.object({
  planId: StableDiceBoxIdSchema,
  item: SemanticRefSchema,
  activityId: StableDiceBoxIdSchema,
  itemBinding: RuntimeBindingSchema,
  activityBinding: activityBindingSchema,
  observed: activityObservationSchema,
  intent: useIntentSchema,
  itemResolve: z.enum(["fromUuid", "game.items.get"]),
}).strict();

export const activityOperationPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  kind: z.literal("dnd5e-activity-operation"),
  operation: z.literal("use"),
  item: SemanticRefSchema,
  activityId: StableDiceBoxIdSchema,
  itemBinding: RuntimeBindingSchema,
  activityBinding: activityBindingSchema,
  observed: activityObservationSchema,
  intent: useIntentSchema,
  foundryApi: z.object({
    itemResolve: z.enum(["fromUuid", "game.items.get"]),
    activityRead: z.literal('item.getEmbeddedDocument("Activity", id)'),
    activityCollection: z.literal("item.system.activities.contents"),
    preUseHook: z.literal("dnd5e.preUseActivity"),
    activityUse: z.literal("activity.use(usage, dialog, message)"),
    postUseHook: z.literal("dnd5e.postUseActivity"),
    readBack: z.literal('item.getEmbeddedDocument("Activity", id)'),
  }).strict(),
  payloadBoundary: z.literal("adapter-owned-activity-use-config-no-raw-foundry-payload"),
  capabilityGate: z.tuple([
    z.literal("dnd5e.activities"),
    z.literal("dnd5e.activity-hooks"),
    z.literal("foundry.users.active-gm"),
  ]),
  mechanicOwner: z.literal("native-activity"),
  optionalOwners: z.tuple([z.literal("midi"), z.literal("dae")]),
  authority: z.literal("active-gm"),
  execution: z.object({
    status: z.literal("disabled"),
    reason: z.literal("exact-runtime-activity-hook-and-authority-gate-required"),
  }).strict(),
}).strict().superRefine((value, context) => {
  if (value.item.kind !== "item"
    || value.itemBinding.semantic.id !== value.item.id
    || value.itemBinding.semantic.kind !== "item"
    || value.itemBinding.documentType !== "Item") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["itemBinding"],
      message: "The Activity operation must bind an Item with the exact reviewed semantic identity.",
    });
  }
  if (value.activityBinding.generation !== value.itemBinding.generation) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["activityBinding", "generation"],
      message: "Activity and Item bindings must share the reviewed binding generation.",
    });
  }
  if (value.observed.activityId !== value.activityBinding.activityId
    || value.observed.activityUuid !== value.activityBinding.activityUuid) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed"],
      message: "The observed Activity identity must match the reviewed runtime binding.",
    });
  }
  if (value.observed.parentItemUuid !== null && value.observed.parentItemUuid !== value.itemBinding.uuid) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed", "parentItemUuid"],
      message: "The observed Activity parent UUID must match the reviewed Item binding.",
    });
  }
  if (value.observed.canUse !== true) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed", "canUse"],
      message: "Activity.use requires a positive observed canUse result.",
    });
  }
  if (value.observed.isOwner !== true) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed", "isOwner"],
      message: "Activity.use requires a positive observed ownership result.",
    });
  }
});

export type ActivityOperationPlan = z.infer<typeof activityOperationPlanSchema>;
export type ActivityUseIntent = z.infer<typeof useIntentSchema>;
export type ActivityOperationObservation = z.infer<typeof activityObservationSchema>;

export interface CreateActivityOperationPlanInput {
  readonly planId: StableDiceBoxId;
  readonly item: SemanticRef;
  readonly activityId: StableDiceBoxId;
  readonly itemBinding: RuntimeBinding;
  readonly activityBinding: {
    readonly activityId: string;
    readonly activityUuid: string;
    readonly generation: number;
  };
  readonly observed: ActivityOperationObservation;
  readonly intent: ActivityUseIntent;
  readonly itemResolve: "fromUuid" | "game.items.get";
}

export function createActivityOperationPlan(
  input: CreateActivityOperationPlanInput,
): ActivityOperationPlan {
  const parsed = activityOperationInputSchema.parse(input);
  return activityOperationPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: parsed.planId,
    kind: "dnd5e-activity-operation",
    operation: "use",
    item: parsed.item,
    activityId: parsed.activityId,
    itemBinding: parsed.itemBinding,
    activityBinding: parsed.activityBinding,
    observed: parsed.observed,
    intent: parsed.intent,
    foundryApi: {
      itemResolve: parsed.itemResolve,
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
}

export function validateActivityOperationPlan(input: unknown): ActivityOperationPlan {
  return activityOperationPlanSchema.parse(input);
}
