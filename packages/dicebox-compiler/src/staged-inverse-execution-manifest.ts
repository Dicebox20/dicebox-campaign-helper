import { z } from "zod";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { stagedInverseExecutionReceiptSchema, validateAuthorizedStagedInverseExecutionInput, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);
const at = z.string().datetime({ offset: true });

export const stagedInverseManifestOperationSchema = z.object({
  sequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  kind: z.enum(["delete-owned-create", "restore-update-preimage"]),
  idempotencyKey: StableDiceBoxIdSchema,
  operationSha256: sha256,
}).strict();

export const stagedInverseExecutionManifestSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  manifestId: StableDiceBoxIdSchema,
  inversePlanId: StableDiceBoxIdSchema,
  authorizationId: StableDiceBoxIdSchema,
  adapterId: z.string().trim().min(1).max(200),
  operationOrder: z.literal("stable-id-ascending-observation-only"),
  reverseDependencyOrder: z.array(StableDiceBoxIdSchema).min(1).max(500),
  operations: z.array(stagedInverseManifestOperationSchema).min(1).max(500),
  manifestSha256: sha256,
  createdAt: at,
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  const expectedSequences = value.operations.map((_, index) => index);
  if (!value.operations.every((operation, index) => operation.sequence === expectedSequences[index])) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse manifest sequences must be contiguous from zero." });
  }
  const ids = value.operations.map((operation) => operation.stableId);
  if (new Set(ids).size !== ids.length || !ids.every((id, index) => index === 0 || ids[index - 1]! < id)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse manifest operations must be unique and sorted by stable ID." });
  }
  if (value.reverseDependencyOrder.length !== ids.length
    || new Set(value.reverseDependencyOrder).size !== value.reverseDependencyOrder.length
    || value.reverseDependencyOrder.some((stableId) => !ids.includes(stableId))) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse manifest reverse dependency order must cover each exact operation once." });
  }
});

export const stagedInverseOperationReceiptSchema = stagedInverseExecutionReceiptSchema.extend({
  manifestId: StableDiceBoxIdSchema,
  adapterId: z.string().trim().min(1).max(200),
  sequence: z.number().int().nonnegative(),
  stableId: StableDiceBoxIdSchema,
  kind: z.enum(["delete-owned-create", "restore-update-preimage"]),
  idempotencyKey: StableDiceBoxIdSchema,
  rereadStatus: z.enum(["matched", "not-found", "conflict", "unknown"]),
}).strict();

export type StagedInverseExecutionManifest = z.infer<typeof stagedInverseExecutionManifestSchema>;
export type StagedInverseOperationReceipt = z.infer<typeof stagedInverseOperationReceiptSchema>;

function unsignedManifest(manifest: StagedInverseExecutionManifest): Omit<StagedInverseExecutionManifest, "manifestSha256"> {
  const { manifestSha256: _manifestSha256, ...unsigned } = manifest;
  return unsigned;
}

async function canonicalOperations(input: StagedInverseExecutionInput): Promise<z.infer<typeof stagedInverseManifestOperationSchema>[]> {
  const operations = [...input.inversePlan.operations]
    .sort((left, right) => left.stableId.localeCompare(right.stableId))
    .map(async (operation, sequence) => ({
      sequence,
      stableId: operation.stableId,
      kind: operation.kind,
      idempotencyKey: createStableDiceBoxId("inverse-idempotency", `${input.inversePlan.inversePlanId.split(":").at(-1)}-${String(sequence).padStart(3, "0")}`),
      operationSha256: await sha256FoundryIr(canonicalizeFoundryIr(operation)),
    }));
  return Promise.all(operations);
}

/** Pure scheduling and evidence contract only. Its lexical order is observability order, never a claim of safe dispatch dependency order. */
export async function createStagedInverseExecutionManifest(input: unknown, manifestId: string, adapterId: string, createdAt: string): Promise<StagedInverseExecutionManifest> {
  const request = await validateAuthorizedStagedInverseExecutionInput(input);
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    manifestId: StableDiceBoxIdSchema.parse(manifestId),
    inversePlanId: request.inversePlan.inversePlanId,
    authorizationId: request.authorization.authorizationId,
    adapterId: z.string().trim().min(1).max(200).parse(adapterId),
    operationOrder: "stable-id-ascending-observation-only" as const,
    reverseDependencyOrder: request.inversePlan.reverseDependencyOrder,
    operations: await canonicalOperations(request),
    createdAt: at.parse(createdAt),
    execution: "not-implemented" as const,
    readyClaim: false as const,
  };
  return stagedInverseExecutionManifestSchema.parse({ ...unsigned, manifestSha256: await sha256FoundryIr(canonicalizeFoundryIr(unsigned)) });
}

export async function verifyStagedInverseExecutionManifest(input: unknown): Promise<boolean> {
  try {
    const manifest = stagedInverseExecutionManifestSchema.parse(input);
    return manifest.manifestSha256 === await sha256FoundryIr(canonicalizeFoundryIr(unsignedManifest(manifest)));
  } catch {
    return false;
  }
}

export function validateStagedInverseOperationReceipt(input: unknown, manifest: unknown): StagedInverseOperationReceipt {
  const receipt = stagedInverseOperationReceiptSchema.parse(input);
  const parsedManifest = stagedInverseExecutionManifestSchema.parse(manifest);
  const operation = parsedManifest.operations[receipt.sequence];
  if (!operation || receipt.manifestId !== parsedManifest.manifestId || receipt.inversePlanId !== parsedManifest.inversePlanId
    || receipt.adapterId !== parsedManifest.adapterId || receipt.stableId !== operation.stableId || receipt.kind !== operation.kind
    || receipt.idempotencyKey !== operation.idempotencyKey) throw new Error("Inverse operation receipt must match one exact manifest operation.");
  if (receipt.rereadStatus === "conflict" && receipt.status !== "blocked") throw new Error("Foreign conflict must produce a blocked inverse receipt.");
  if (receipt.rereadStatus === "unknown" && receipt.status !== "unknown") throw new Error("Unknown inverse reread must preserve an unknown outcome.");
  return receipt;
}
