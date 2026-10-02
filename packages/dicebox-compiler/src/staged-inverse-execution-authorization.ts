import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { foundryInversePlanSchema, type FoundryInversePlan } from "./foundry-inverse-plan.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const at = z.string().datetime({ offset: true });

export const stagedInverseExecutionAuthorizationSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  authorizationId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  approvedByUserId: z.string().trim().min(1).max(100),
  authorizedByActiveGmUserId: z.string().trim().min(1).max(100),
  requiredCurrentActiveGmRecheck: z.literal(true),
  authorizedAt: at,
  authorizationSha256: sha256,
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseExecutionAuthorization = z.infer<typeof stagedInverseExecutionAuthorizationSchema>;

export type CreateStagedInverseExecutionAuthorizationInput = {
  readonly authorizationId: string;
  readonly inversePlan: unknown;
  readonly authorizedByActiveGmUserId: string;
  readonly authorizedAt: string;
};

function unsignedAuthorization(authorization: StagedInverseExecutionAuthorization): Omit<StagedInverseExecutionAuthorization, "authorizationSha256"> {
  const { authorizationSha256: _authorizationSha256, ...unsigned } = authorization;
  return unsigned;
}

async function inversePlanSha256(plan: FoundryInversePlan): Promise<string> {
  return sha256FoundryIr(canonicalizeFoundryIr(plan));
}

/** Pure authorization record only: it grants no dispatch path and requires a future current-GM recheck. */
export async function createStagedInverseExecutionAuthorization(
  input: CreateStagedInverseExecutionAuthorizationInput,
): Promise<StagedInverseExecutionAuthorization> {
  const inversePlan = foundryInversePlanSchema.parse(input.inversePlan);
  const authorizedByActiveGmUserId = z.string().trim().min(1).max(100).parse(input.authorizedByActiveGmUserId);
  if (inversePlan.approvedByUserId !== authorizedByActiveGmUserId) {
    throw new Error("Inverse execution authorization requires the approved GM to be the active GM at authorization time.");
  }
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    authorizationId: StableDiceBoxIdSchema.parse(input.authorizationId),
    inversePlanId: inversePlan.inversePlanId,
    inversePlanSha256: await inversePlanSha256(inversePlan),
    approvedByUserId: inversePlan.approvedByUserId,
    authorizedByActiveGmUserId,
    requiredCurrentActiveGmRecheck: true as const,
    authorizedAt: at.parse(input.authorizedAt),
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  return stagedInverseExecutionAuthorizationSchema.parse({
    ...unsigned,
    authorizationSha256: await sha256FoundryIr(canonicalizeFoundryIr(unsigned)),
  });
}

export async function verifyStagedInverseExecutionAuthorization(
  input: unknown,
  inversePlan: unknown,
): Promise<boolean> {
  try {
    const authorization = stagedInverseExecutionAuthorizationSchema.parse(input);
    const plan = foundryInversePlanSchema.parse(inversePlan);
    if (authorization.inversePlanId !== plan.inversePlanId
      || authorization.inversePlanSha256 !== await inversePlanSha256(plan)
      || authorization.approvedByUserId !== plan.approvedByUserId
      || authorization.authorizedByActiveGmUserId !== plan.approvedByUserId) return false;
    return authorization.authorizationSha256 === await sha256FoundryIr(canonicalizeFoundryIr(unsignedAuthorization(authorization)));
  } catch {
    return false;
  }
}
