import {
  RuntimeBindingSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type RuntimeBinding,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { z } from "zod";

const runtimeActivityBindingSchema = z.object({
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

export const activitySelectionPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  kind: z.literal("dnd5e-activity-selection"),
  item: SemanticRefSchema,
  activityId: StableDiceBoxIdSchema,
  itemBinding: RuntimeBindingSchema,
  activityBinding: runtimeActivityBindingSchema,
  observed: activityObservationSchema,
  foundryApi: z.object({
    itemResolve: z.enum(["fromUuid", "game.items.get"]),
    activityRead: z.literal('item.getEmbeddedDocument("Activity", id)'),
    activityCollection: z.literal("item.system.activities.contents"),
    activityUse: z.literal("activity.use(usage, dialog, message)"),
    preUseHook: z.literal("dnd5e.preUseActivity"),
    postUseHook: z.literal("dnd5e.postUseActivity"),
  }).strict(),
  capabilityGate: z.tuple([
    z.literal("dnd5e.activities"),
    z.literal("dnd5e.activity-hooks"),
    z.literal("foundry.users.active-gm"),
  ]),
  authority: z.literal("active-gm"),
  execution: z.object({
    status: z.literal("disabled"),
    reason: z.literal("exact-runtime-activity-hook-and-authority-gate-required"),
  }).strict(),
  readBack: z.literal('item.getEmbeddedDocument("Activity", id)'),
}).strict().superRefine((value, context) => {
  if (value.item.kind !== "item"
    || value.itemBinding.semantic.id !== value.item.id
    || value.itemBinding.semantic.kind !== "item"
    || value.itemBinding.documentType !== "Item") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["itemBinding"],
      message: "The Activity plan must bind an Item with the exact reviewed semantic identity.",
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
});

export type ActivitySelectionPlan = z.infer<typeof activitySelectionPlanSchema>;
export type ActivityObservationInput = z.infer<typeof activityObservationSchema>;

export interface CreateActivitySelectionPlanInput {
  readonly planId: StableDiceBoxId;
  readonly item: SemanticRef;
  readonly activityId: StableDiceBoxId;
  readonly itemBinding: RuntimeBinding;
  readonly activityBinding: {
    readonly activityId: string;
    readonly activityUuid: string;
    readonly generation: number;
  };
  readonly observed: ActivityObservationInput;
  readonly itemResolve: "fromUuid" | "game.items.get";
}

export function createActivitySelectionPlan(
  input: CreateActivitySelectionPlanInput,
): ActivitySelectionPlan {
  return activitySelectionPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: input.planId,
    kind: "dnd5e-activity-selection",
    item: input.item,
    activityId: input.activityId,
    itemBinding: input.itemBinding,
    activityBinding: input.activityBinding,
    observed: input.observed,
    foundryApi: {
      itemResolve: input.itemResolve,
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
    readBack: 'item.getEmbeddedDocument("Activity", id)',
  });
}

export function validateActivitySelectionPlan(input: unknown): ActivitySelectionPlan {
  return activitySelectionPlanSchema.parse(input);
}
