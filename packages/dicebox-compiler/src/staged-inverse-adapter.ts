import { z } from "zod";
import { type Result } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { foundryInverseOperationSchema, type FoundryInverseOperation } from "./foundry-inverse-plan.js";
import {
  stagedInverseDeleteReadbackSchema,
  stagedInverseOperationSelectionSchema,
  stagedInverseRestoreReadbackSchema,
  validateStagedInverseOperationReadback,
  type StagedInverseDeleteReadback,
  type StagedInverseOperationSelection,
  type StagedInverseRestoreReadback,
} from "./staged-inverse-dispatch-state.js";

/** Exact manifest operation and its already-validated reverse-order selection. */
export const stagedInverseAdapterOperationSchema = z.object({
  selection: stagedInverseOperationSelectionSchema,
  operation: foundryInverseOperationSchema,
}).strict();

export type StagedInverseAdapterOperation = z.infer<typeof stagedInverseAdapterOperationSchema>;
export type StagedInverseDeleteAdapterOperation = {
  readonly selection: StagedInverseOperationSelection;
  readonly operation: Extract<FoundryInverseOperation, { readonly kind: "delete-owned-create" }>;
};
export type StagedInverseRestoreAdapterOperation = {
  readonly selection: StagedInverseOperationSelection;
  readonly operation: Extract<FoundryInverseOperation, { readonly kind: "restore-update-preimage" }>;
};

/**
 * Separate future execution boundary for reviewed inverse plans. The methods
 * return operation-specific authoritative evidence and expose no generic
 * RuntimeBinding/StagedReadback result or execution implementation.
 */
export interface StagedInverseAdapter {
  readonly adapterId: string;
  deleteOwnedCreate(operation: StagedInverseDeleteAdapterOperation): Promise<Result<StagedInverseDeleteReadback>>;
  restoreUpdatePreimage(operation: StagedInverseRestoreAdapterOperation): Promise<Result<StagedInverseRestoreReadback>>;
}

/** Validates exact selection/operation identity and recomputes the operation hash. */
export async function validateStagedInverseAdapterOperation(input: unknown): Promise<StagedInverseAdapterOperation> {
  const value = stagedInverseAdapterOperationSchema.parse(input);
  if (value.selection.stableId !== value.operation.stableId || value.selection.kind !== value.operation.kind) {
    throw new Error("Inverse adapter operation selection must bind the exact operation stable ID and kind.");
  }
  const operationSha256 = await sha256FoundryIr(canonicalizeFoundryIr(value.operation));
  if (value.selection.operationSha256 !== operationSha256) {
    throw new Error("Inverse adapter operation selection must carry the canonical operation digest.");
  }
  return value;
}

/** Validates delete-owned absence evidence against one exact adapter operation. */
export async function validateStagedInverseDeleteReadback(
  input: unknown,
  adapterOperationInput: unknown,
  inversePlanId: string,
  inversePlanSha256: string,
): Promise<StagedInverseDeleteReadback> {
  const adapterOperation = await validateStagedInverseAdapterOperation(adapterOperationInput);
  if (adapterOperation.operation.kind !== "delete-owned-create") throw new Error("Inverse delete readback must bind a delete-owned-create operation.");
  const readback = validateStagedInverseOperationReadback(input, adapterOperation.operation, inversePlanId, inversePlanSha256, {
    manifestId: adapterOperation.selection.manifestId,
    sequence: adapterOperation.selection.sequence,
    stableId: adapterOperation.selection.stableId,
    idempotencyKey: adapterOperation.selection.idempotencyKey,
    operationSha256: adapterOperation.selection.operationSha256,
  });
  return stagedInverseDeleteReadbackSchema.parse(readback);
}

/** Validates restore-preimage evidence against one exact adapter operation. */
export async function validateStagedInverseRestoreReadback(
  input: unknown,
  adapterOperationInput: unknown,
  inversePlanId: string,
  inversePlanSha256: string,
): Promise<StagedInverseRestoreReadback> {
  const adapterOperation = await validateStagedInverseAdapterOperation(adapterOperationInput);
  if (adapterOperation.operation.kind !== "restore-update-preimage") throw new Error("Inverse restore readback must bind a restore-update-preimage operation.");
  const readback = validateStagedInverseOperationReadback(input, adapterOperation.operation, inversePlanId, inversePlanSha256, {
    manifestId: adapterOperation.selection.manifestId,
    sequence: adapterOperation.selection.sequence,
    stableId: adapterOperation.selection.stableId,
    idempotencyKey: adapterOperation.selection.idempotencyKey,
    operationSha256: adapterOperation.selection.operationSha256,
  });
  return stagedInverseRestoreReadbackSchema.parse(readback);
}
