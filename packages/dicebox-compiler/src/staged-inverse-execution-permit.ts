import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { stagedInverseExecutionManifestSchema, verifyStagedInverseExecutionManifest, type StagedInverseExecutionManifest } from "./staged-inverse-execution-manifest.js";
import { validateAuthorizedStagedInverseExecutionInput, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const at = z.string().datetime({ offset: true });

export const stagedInverseExecutionPermitSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  permitId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  authorizationId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  manifestSha256: sha256,
  adapterId: z.string().trim().min(1).max(200),
  approvedByUserId: z.string().trim().min(1).max(100),
  issuedByActiveGmUserId: z.string().trim().min(1).max(100),
  requiredExecutionTimeActiveGmRecheck: z.literal(true),
  singleUse: z.literal(true),
  permitStatus: z.literal("issued"),
  issuedAt: at,
  permitSha256: sha256,
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseExecutionPermit = z.infer<typeof stagedInverseExecutionPermitSchema>;

function unsignedPermit(permit: StagedInverseExecutionPermit): Omit<StagedInverseExecutionPermit, "permitSha256"> {
  const { permitSha256: _permitSha256, ...unsigned } = permit;
  return unsigned;
}

function matchPermit(permit: StagedInverseExecutionPermit, request: StagedInverseExecutionInput, manifest: StagedInverseExecutionManifest): void {
  if (permit.inversePlanId !== request.inversePlan.inversePlanId
    || permit.inversePlanId !== manifest.inversePlanId
    || permit.authorizationId !== request.authorization.authorizationId
    || permit.authorizationId !== manifest.authorizationId
    || permit.manifestId !== manifest.manifestId
    || permit.manifestSha256 !== manifest.manifestSha256
    || permit.adapterId !== manifest.adapterId
    || permit.approvedByUserId !== request.approvedByUserId
    || permit.issuedByActiveGmUserId !== request.activeGmUserId
    || !permit.requiredExecutionTimeActiveGmRecheck
    || !permit.singleUse) {
    throw new Error("Inverse execution permit must bind the exact authorized request, manifest, adapter, and active GM.");
  }
}

/** Pure permit record only: issuance grants no dispatch and does not consume the permit. */
export async function createStagedInverseExecutionPermit(
  requestInput: unknown,
  manifestInput: unknown,
  permitId: string,
  issuedAt: string,
): Promise<StagedInverseExecutionPermit> {
  const request = await validateAuthorizedStagedInverseExecutionInput(requestInput);
  const manifest = stagedInverseExecutionManifestSchema.parse(manifestInput);
  if (!await verifyStagedInverseExecutionManifest(manifest)) throw new Error("Inverse execution permit requires an untampered manifest.");
  const issuedByActiveGmUserId = request.activeGmUserId;
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    permitId: StableDiceBoxIdSchema.parse(permitId),
    inversePlanId: request.inversePlan.inversePlanId,
    authorizationId: request.authorization.authorizationId,
    manifestId: manifest.manifestId,
    manifestSha256: manifest.manifestSha256,
    adapterId: manifest.adapterId,
    approvedByUserId: request.approvedByUserId,
    issuedByActiveGmUserId,
    requiredExecutionTimeActiveGmRecheck: true as const,
    singleUse: true as const,
    permitStatus: "issued" as const,
    issuedAt: at.parse(issuedAt),
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  const permit = stagedInverseExecutionPermitSchema.parse({
    ...unsigned,
    permitSha256: await sha256FoundryIr(canonicalizeFoundryIr(unsigned)),
  });
  matchPermit(permit, request, manifest);
  return permit;
}

export async function verifyStagedInverseExecutionPermit(
  permitInput: unknown,
  requestInput: unknown,
  manifestInput: unknown,
): Promise<boolean> {
  try {
    const permit = stagedInverseExecutionPermitSchema.parse(permitInput);
    const request = await validateAuthorizedStagedInverseExecutionInput(requestInput);
    const manifest = stagedInverseExecutionManifestSchema.parse(manifestInput);
    if (!await verifyStagedInverseExecutionManifest(manifest)) return false;
    matchPermit(permit, request, manifest);
    return permit.permitSha256 === await sha256FoundryIr(canonicalizeFoundryIr(unsignedPermit(permit)));
  } catch {
    return false;
  }
}
