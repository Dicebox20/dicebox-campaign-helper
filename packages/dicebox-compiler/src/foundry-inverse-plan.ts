import { z } from "zod";
import { DICEBOX_PACKAGE_ID, RuntimeBindingSchema, StableDiceBoxIdSchema } from "@dicebox/core";
import { foundryIrPayloadSchema } from "./foundry-ir.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const at = z.string().datetime({ offset: true });

export const foundryInverseOperationSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("delete-owned-create"),
    stableId: StableDiceBoxIdSchema,
    binding: RuntimeBindingSchema,
    expectedOwnership: z.object({ moduleId: z.literal(DICEBOX_PACKAGE_ID), stableId: StableDiceBoxIdSchema, mode: z.literal("managed") }).strict(),
  }).strict(),
  z.object({
    kind: z.literal("restore-update-preimage"),
    stableId: StableDiceBoxIdSchema,
    binding: RuntimeBindingSchema,
    expectedOwnership: z.object({ moduleId: z.literal(DICEBOX_PACKAGE_ID), stableId: StableDiceBoxIdSchema, mode: z.literal("managed") }).strict(),
    preimage: foundryIrPayloadSchema,
    preimageSha256: sha256,
  }).strict(),
]);

export const foundryInversePlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  inversePlanId: StableDiceBoxIdSchema,
  originalPlanId: StableDiceBoxIdSchema,
  originalPlanSha256: sha256,
  approvedByUserId: z.string().trim().min(1).max(100),
  requiredActiveGm: z.literal(true),
  operations: z.array(foundryInverseOperationSchema).min(1).max(500),
  reverseDependencyOrder: z.array(StableDiceBoxIdSchema).min(1).max(500),
  createdAt: at,
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const ids = new Set<string>();
  for (const operation of value.operations) {
    if (operation.binding.semantic.id !== operation.stableId || operation.expectedOwnership.stableId !== operation.stableId) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse operation binding and ownership must match the exact stable ID." });
    }
    if (ids.has(operation.stableId)) context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse operations must be unique by stable ID." });
    ids.add(operation.stableId);
  }
  if (value.reverseDependencyOrder.length !== value.operations.length
    || new Set(value.reverseDependencyOrder).size !== value.reverseDependencyOrder.length
    || value.reverseDependencyOrder.some((stableId) => !ids.has(stableId))) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse reverse dependency order must cover each exact inverse operation once." });
  }
});

export type FoundryInversePlan = z.infer<typeof foundryInversePlanSchema>;
export type FoundryInverseOperation = z.infer<typeof foundryInverseOperationSchema>;

/** Pure contract only: no executor, adapter call, delete, restore, or runtime authority. */
export function defineFoundryInversePlan(input: unknown): FoundryInversePlan {
  return foundryInversePlanSchema.parse(input);
}
