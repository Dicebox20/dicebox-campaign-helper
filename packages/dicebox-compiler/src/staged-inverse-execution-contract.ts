import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { foundryInversePlanSchema } from "./foundry-inverse-plan.js";
import { stagedInverseExecutionAuthorizationSchema, verifyStagedInverseExecutionAuthorization } from "./staged-inverse-execution-authorization.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
export const stagedInverseExecutionInputSchema = z.object({
  inversePlan: foundryInversePlanSchema,
  authorization: stagedInverseExecutionAuthorizationSchema,
  approvedInversePlanId: StableDiceBoxIdSchema,
  approvedByUserId: z.string().trim().min(1).max(100),
  activeGmUserId: z.string().trim().min(1).max(100),
  idempotencyKey: StableDiceBoxIdSchema,
}).strict().superRefine((value, context) => {
  if (value.inversePlan.inversePlanId !== value.approvedInversePlanId) context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved inverse plan ID must match the exact reviewed plan." });
  if (value.inversePlan.approvedByUserId !== value.approvedByUserId || value.approvedByUserId !== value.activeGmUserId) context.addIssue({ code: z.ZodIssueCode.custom, message: "Approved GM must match the current active GM." });
  if (value.authorization.inversePlanId !== value.inversePlan.inversePlanId || value.authorization.approvedByUserId !== value.approvedByUserId || value.authorization.authorizedByActiveGmUserId !== value.activeGmUserId || !value.authorization.requiredCurrentActiveGmRecheck) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse execution authorization must bind the exact approved plan and current active GM." });
  }
});
export const stagedInverseExecutionReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"), receiptId: StableDiceBoxIdSchema, inversePlanId: StableDiceBoxIdSchema, inversePlanSha256: sha256,
  status: z.enum(["blocked", "unknown", "committed", "recovered"]), authoritativeReread: z.boolean(), foreignStatePreserved: z.literal(true), readyClaim: z.literal(false), execution: z.literal("not-implemented"),
}).strict();
export type StagedInverseExecutionInput = z.infer<typeof stagedInverseExecutionInputSchema>;
export type StagedInverseExecutionReceipt = z.infer<typeof stagedInverseExecutionReceiptSchema>;
export function validateStagedInverseExecutionInput(input: unknown): StagedInverseExecutionInput { return stagedInverseExecutionInputSchema.parse(input); }
/** Pure request validation only: verifies the authorization digest before any future executor may consider dispatch. */
export async function validateAuthorizedStagedInverseExecutionInput(input: unknown): Promise<StagedInverseExecutionInput> {
  const parsed = stagedInverseExecutionInputSchema.parse(input);
  if (!await verifyStagedInverseExecutionAuthorization(parsed.authorization, parsed.inversePlan)) {
    throw new Error("Inverse execution authorization digest does not match the exact reviewed inverse plan.");
  }
  return parsed;
}
