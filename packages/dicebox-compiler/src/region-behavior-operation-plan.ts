import {
  RuntimeBindingSchema,
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type RuntimeBinding,
  type SemanticRef,
  type StableDiceBoxId,
} from "@dicebox/core";
import { z } from "zod";

const behaviorBindingSchema = z.object({
  behaviorId: z.string().min(1),
  behaviorUuid: z.string().min(1),
  generation: z.number().int().nonnegative(),
}).strict();

const behaviorObservationSchema = z.object({
  behaviorId: z.string().min(1),
  behaviorUuid: z.string().min(1),
  behaviorType: z.string().min(1),
  displayName: z.string().min(1).optional(),
  disabled: z.boolean().nullable(),
  active: z.boolean().nullable(),
  parentRegionUuid: z.string().min(1).nullable(),
}).strict();

const behaviorIntentSchema = z.object({
  intentId: StableDiceBoxIdSchema,
  intentFingerprint: z.string().min(1),
  behaviorType: z.string().min(1),
  eventTypes: z.array(z.string().min(1)).max(32),
  enabled: z.boolean(),
}).strict();

const regionBehaviorOperationInputSchema = z.object({
  planId: StableDiceBoxIdSchema,
  operation: z.enum(["create", "update", "delete"]),
  region: SemanticRefSchema,
  behaviorId: StableDiceBoxIdSchema,
  regionBinding: RuntimeBindingSchema,
  behaviorBinding: behaviorBindingSchema.optional(),
  observed: behaviorObservationSchema.optional(),
  intent: behaviorIntentSchema.optional(),
  regionResolve: z.enum(["fromUuid", "game.scenes.get"]),
}).strict();

export const regionBehaviorOperationPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  planId: StableDiceBoxIdSchema,
  kind: z.literal("foundry-region-behavior-operation"),
  operation: z.enum(["create", "update", "delete"]),
  region: SemanticRefSchema,
  behaviorId: StableDiceBoxIdSchema,
  regionBinding: RuntimeBindingSchema,
  behaviorBinding: behaviorBindingSchema.nullable(),
  observed: behaviorObservationSchema.nullable(),
  intent: behaviorIntentSchema.nullable(),
  foundryApi: z.object({
    regionResolve: z.enum(["fromUuid", "game.scenes.get"]),
    behaviorRegistry: z.literal("CONFIG.RegionBehavior.dataModels"),
    behaviorCollection: z.literal('region.getEmbeddedCollection("RegionBehavior")'),
    behaviorRead: z.literal('region.getEmbeddedDocument("RegionBehavior", id)'),
    behaviorCreate: z.literal('region.createEmbeddedDocuments("RegionBehavior", data)'),
    behaviorUpdate: z.literal("behavior.update(changed)"),
    behaviorDelete: z.literal("behavior.delete()"),
    behaviorType: z.literal("behavior.type"),
    behaviorEvents: z.literal("RegionBehaviorType.events"),
    readBack: z.literal('region.getEmbeddedDocument("RegionBehavior", id)'),
  }).strict(),
  payloadBoundary: z.literal("adapter-owned-region-behavior-config-no-raw-foundry-payload"),
  capabilityGate: z.tuple([
    z.literal("foundry.region.read"),
    z.literal("foundry.region.write"),
    z.literal("foundry.users.active-gm"),
  ]),
  mechanicOwner: z.literal("native-region-behavior"),
  optionalOwners: z.tuple([z.literal("midi"), z.literal("dae")]),
  authority: z.literal("active-gm"),
  readBack: z.literal('region.getEmbeddedDocument("RegionBehavior", id)'),
  execution: z.object({
    status: z.literal("disabled"),
    reason: z.literal("exact-runtime-region-behavior-schema-permission-and-authority-gate-required"),
  }).strict(),
}).strict().superRefine((value, context) => {
  if (value.region.kind !== "region"
    || value.regionBinding.semantic.id !== value.region.id
    || value.regionBinding.semantic.kind !== "region"
    || value.regionBinding.documentType !== "Region") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["regionBinding"],
      message: "The Region behavior operation must bind an exact Region semantic identity.",
    });
  }

  const requiresExistingBehavior = value.operation === "update" || value.operation === "delete";
  if (requiresExistingBehavior && (!value.behaviorBinding || !value.observed)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["behaviorBinding"],
      message: "Update and delete operations require an exact observed RegionBehavior binding.",
    });
  }
  if (!requiresExistingBehavior && (value.behaviorBinding !== null || value.observed !== null)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["behaviorBinding"],
      message: "Create operations cannot claim an existing RegionBehavior binding.",
    });
  }
  if (value.behaviorBinding && value.behaviorBinding.generation !== value.regionBinding.generation) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["behaviorBinding", "generation"],
      message: "RegionBehavior and Region bindings must share the reviewed binding generation.",
    });
  }
  if (value.behaviorBinding && value.observed
    && (value.observed.behaviorId !== value.behaviorBinding.behaviorId
      || value.observed.behaviorUuid !== value.behaviorBinding.behaviorUuid)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed"],
      message: "The observed RegionBehavior identity must match the reviewed runtime binding.",
    });
  }
  if (value.behaviorBinding && value.observed
    && value.observed.parentRegionUuid !== null
    && value.observed.parentRegionUuid !== value.regionBinding.uuid) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["observed", "parentRegionUuid"],
      message: "The observed RegionBehavior parent UUID must match the reviewed Region binding.",
    });
  }
  const requiresIntent = value.operation === "create" || value.operation === "update";
  if (requiresIntent && value.intent === null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intent"],
      message: "Create and update operations require a stable DiceBox RegionBehavior intent reference.",
    });
  }
  if (!requiresIntent && value.intent !== null) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intent"],
      message: "Delete operations cannot carry a new RegionBehavior definition intent.",
    });
  }
  if (value.intent && value.observed && value.operation === "update"
    && value.intent.behaviorType !== value.observed.behaviorType) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["intent", "behaviorType"],
      message: "An update intent must preserve the observed native RegionBehavior type.",
    });
  }
});

export type RegionBehaviorOperationPlan = z.infer<typeof regionBehaviorOperationPlanSchema>;
export type RegionBehaviorOperation = RegionBehaviorOperationPlan["operation"];
export type RegionBehaviorOperationIntent = z.infer<typeof behaviorIntentSchema>;
export type RegionBehaviorOperationObservation = z.infer<typeof behaviorObservationSchema>;

export interface CreateRegionBehaviorOperationPlanInput {
  readonly planId: StableDiceBoxId;
  readonly operation: RegionBehaviorOperation;
  readonly region: SemanticRef;
  readonly behaviorId: StableDiceBoxId;
  readonly regionBinding: RuntimeBinding;
  readonly behaviorBinding?: {
    readonly behaviorId: string;
    readonly behaviorUuid: string;
    readonly generation: number;
  };
  readonly observed?: RegionBehaviorOperationObservation;
  readonly intent?: RegionBehaviorOperationIntent;
  readonly regionResolve: "fromUuid" | "game.scenes.get";
}

export function createRegionBehaviorOperationPlan(
  input: CreateRegionBehaviorOperationPlanInput,
): RegionBehaviorOperationPlan {
  const parsed = regionBehaviorOperationInputSchema.parse(input);
  return regionBehaviorOperationPlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: parsed.planId,
    kind: "foundry-region-behavior-operation",
    operation: parsed.operation,
    region: parsed.region,
    behaviorId: parsed.behaviorId,
    regionBinding: parsed.regionBinding,
    behaviorBinding: parsed.behaviorBinding ?? null,
    observed: parsed.observed ?? null,
    intent: parsed.intent ?? null,
    foundryApi: {
      regionResolve: parsed.regionResolve,
      behaviorRegistry: "CONFIG.RegionBehavior.dataModels",
      behaviorCollection: 'region.getEmbeddedCollection("RegionBehavior")',
      behaviorRead: 'region.getEmbeddedDocument("RegionBehavior", id)',
      behaviorCreate: 'region.createEmbeddedDocuments("RegionBehavior", data)',
      behaviorUpdate: "behavior.update(changed)",
      behaviorDelete: "behavior.delete()",
      behaviorType: "behavior.type",
      behaviorEvents: "RegionBehaviorType.events",
      readBack: 'region.getEmbeddedDocument("RegionBehavior", id)',
    },
    payloadBoundary: "adapter-owned-region-behavior-config-no-raw-foundry-payload",
    capabilityGate: ["foundry.region.read", "foundry.region.write", "foundry.users.active-gm"],
    mechanicOwner: "native-region-behavior",
    optionalOwners: ["midi", "dae"],
    authority: "active-gm",
    readBack: 'region.getEmbeddedDocument("RegionBehavior", id)',
    execution: {
      status: "disabled",
      reason: "exact-runtime-region-behavior-schema-permission-and-authority-gate-required",
    },
  });
}

export function validateRegionBehaviorOperationPlan(input: unknown): RegionBehaviorOperationPlan {
  return regionBehaviorOperationPlanSchema.parse(input);
}
