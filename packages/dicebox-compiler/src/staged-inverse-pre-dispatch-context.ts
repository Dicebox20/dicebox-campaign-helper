import { z } from "zod";
import { StableDiceBoxIdSchema } from "@dicebox/core";
import {
  selectNextStagedInverseOperation,
  stagedInverseOperationSelectionSchema,
  validateExactStagedInverseExecutionManifest,
  type StagedInverseOperationSelectionResult,
} from "./staged-inverse-dispatch-state.js";
import { stagedInverseExecutionManifestSchema, type StagedInverseExecutionManifest } from "./staged-inverse-execution-manifest.js";
import { stagedInverseExecutionPermitSchema, verifyStagedInverseExecutionPermit } from "./staged-inverse-execution-permit.js";
import { stagedInverseExecutionInputSchema, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";
import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  stagedInversePermitClaimStateSchema,
} from "./staged-inverse-permit-claim.js";
import { canonicalizeFoundryIr } from "./foundry-ir.js";
import {
  stagedInverseReceiptLedgerPersistenceStateSchema,
  stagedInverseReceiptLedgerSnapshotSchema,
  validateStagedInverseReceiptLedgerSnapshot,
} from "./staged-inverse-receipt-ledger.js";

const at = z.string().datetime({ offset: true });
const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

export const stagedInverseClaimRereadSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  source: z.literal("claim-store-load"),
  status: z.enum(["claimed", "missing", "unknown", "conflict"]),
  claim: stagedInversePermitClaimStateSchema.nullable(),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.status === "claimed" && (value.claim === null || value.claim.state !== "claimed")) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A claimed inverse permit reread must expose the exact claimed state." });
  }
  if (value.status === "missing" && value.claim !== null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A missing inverse permit reread cannot expose a claim." });
  }
  if (value.status === "conflict" && value.claim === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A conflicting inverse permit reread must preserve the observed claim identity." });
  }
  if (value.status === "unknown" && value.claim !== null && value.claim.state !== "unknown") {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "An uncertain inverse permit reread may expose only an unknown claim state." });
  }
});

export const stagedInverseCurrentGmRereadSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  purpose: z.literal("execution-time-active-gm-recheck"),
  userId: z.string().trim().min(1).max(100),
  observedAt: at,
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

/** @deprecated M679 supersedes the old caller-attested receipt snapshot with a store-enumerated ledger. */
export const stagedInverseTerminalReceiptSnapshotSchema = stagedInverseReceiptLedgerSnapshotSchema;

export const stagedInversePreDispatchContextInputSchema = z.object({
  request: stagedInverseExecutionInputSchema,
  manifest: stagedInverseExecutionManifestSchema,
  permit: stagedInverseExecutionPermitSchema,
  receiptSnapshot: stagedInverseReceiptLedgerSnapshotSchema,
  claimReread: stagedInverseClaimRereadSchema,
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
  currentGmReread: stagedInverseCurrentGmRereadSchema,
  receiptPersistence: stagedInverseReceiptLedgerPersistenceStateSchema.nullable(),
}).strict();

const identity = {
  inversePlanId: StableDiceBoxIdSchema,
  inversePlanSha256: sha256,
  authorizationId: StableDiceBoxIdSchema,
  manifestId: StableDiceBoxIdSchema,
  manifestSha256: sha256,
  permitId: StableDiceBoxIdSchema,
  claimId: StableDiceBoxIdSchema,
  adapterId: z.string().trim().min(1).max(200),
  activeGmUserId: z.string().trim().min(1).max(100),
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
} as const;

export const stagedInversePreDispatchContextResultSchema = z.union([
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("selected"),
    ...identity,
    selection: stagedInverseOperationSelectionSchema,
    precedingStableIds: z.array(StableDiceBoxIdSchema),
    claimReread: z.literal("claimed"),
    claimObservedAt: at,
    claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
    gmObservedAt: at,
    receiptSnapshotObservedAt: at,
  receiptPersistence: stagedInverseReceiptLedgerPersistenceStateSchema,
  }).strict(),
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("complete"),
    ...identity,
    claimReread: z.literal("claimed"),
    claimObservedAt: at,
    claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
    gmObservedAt: at,
    receiptSnapshotObservedAt: at,
  }).strict(),
  z.object({
    schemaVersion: z.literal("0.1.0"),
    status: z.literal("blocked"),
    blockers: z.array(z.string().min(1)).min(1).max(100),
    authoritativeReread: z.boolean(),
    foreignStatePreserved: z.literal(true),
    adapterDispatch: z.literal("not-authorized-by-this-contract"),
    execution: z.literal("not-implemented"),
    readyClaim: z.literal(false),
  }).strict(),
]);

export type StagedInverseClaimReread = z.infer<typeof stagedInverseClaimRereadSchema>;
export type StagedInverseCurrentGmReread = z.infer<typeof stagedInverseCurrentGmRereadSchema>;
export type StagedInversePreDispatchContextInput = z.infer<typeof stagedInversePreDispatchContextInputSchema>;
export type StagedInversePreDispatchContextResult = z.infer<typeof stagedInversePreDispatchContextResultSchema>;

function blocked(blockers: string[], authoritativeReread: boolean): StagedInversePreDispatchContextResult {
  return {
    schemaVersion: "0.1.0",
    status: "blocked",
    blockers: blockers.length > 0 ? blockers.slice(0, 100) : ["Inverse pre-dispatch context is invalid."],
    authoritativeReread,
    foreignStatePreserved: true,
    adapterDispatch: "not-authorized-by-this-contract",
    execution: "not-implemented",
    readyClaim: false,
  };
}

function identityMatches(
  request: StagedInverseExecutionInput,
  manifest: StagedInverseExecutionManifest,
  permit: z.infer<typeof stagedInverseExecutionPermitSchema>,
  claim: z.infer<typeof stagedInversePermitClaimStateSchema>,
): string[] {
  const blockers: string[] = [];
  if (permit.inversePlanId !== request.inversePlan.inversePlanId || permit.inversePlanId !== manifest.inversePlanId) blockers.push("Inverse permit is bound to a different plan.");
  if (permit.authorizationId !== request.authorization.authorizationId || permit.authorizationId !== manifest.authorizationId) blockers.push("Inverse permit is bound to a different authorization.");
  if (permit.manifestId !== manifest.manifestId || permit.manifestSha256 !== manifest.manifestSha256) blockers.push("Inverse permit is bound to a different manifest.");
  if (permit.approvedByUserId !== request.approvedByUserId || permit.issuedByActiveGmUserId !== request.activeGmUserId) blockers.push("Inverse permit is bound to a different approving or active GM identity.");
  if (claim.permitId !== permit.permitId || claim.permitSha256 !== permit.permitSha256 || claim.manifestId !== manifest.manifestId || claim.activeGmUserId !== request.activeGmUserId) blockers.push("Persisted inverse claim does not match the exact permit, manifest, and active GM.");
  if (claim.idempotencyKey !== request.idempotencyKey) blockers.push("Persisted inverse claim does not match the exact reviewed request idempotency key.");
  return blockers;
}

/**
 * Pure composition boundary for one future inverse operation. All persistence
 * and current-GM values are authoritative snapshots supplied by callers; this
 * function invokes no store, adapter, executor, or Foundry operation.
 */
export async function prepareStagedInversePreDispatchContext(input: unknown): Promise<StagedInversePreDispatchContextResult> {
  const parsed = stagedInversePreDispatchContextInputSchema.safeParse(input);
  if (!parsed.success) return blocked(["Inverse pre-dispatch context input is malformed; no dispatch is authorized."], false);
  const value = parsed.data;
  try {
    const { request, manifest } = await validateExactInputs(value.request, value.manifest);
    if (!await verifyStagedInverseExecutionPermit(value.permit, request, manifest)) {
      return blocked(["Inverse permit digest or identity is invalid; no dispatch is authorized."], false);
    }
    if (value.currentGmReread.userId !== request.activeGmUserId) {
      return blocked(["Execution-time active GM reread does not match the approved active GM."], true);
    }
    if (value.claimReread.status !== "claimed" || value.claimReread.claim === null) {
      return blocked([`Persisted inverse claim reread is ${value.claimReread.status}; authoritative claimed-state reread is required.`], true);
    }
    if (value.claimPersistenceResolution.status !== "matched"
      || value.claimPersistenceResolution.reread === null
      || canonicalizeFoundryIr(value.claimPersistenceResolution.reread) !== canonicalizeFoundryIr(value.claimReread.claim)) {
      return blocked(["Pre-dispatch requires an exact matched claim persistence-resolution witness whose reread equals the claimed state."], true);
    }
    const claimBlockers = identityMatches(request, manifest, value.permit, value.claimReread.claim);
    if (claimBlockers.length > 0) return blocked(claimBlockers, true);
    let terminalReceipts = [] as Array<z.infer<typeof stagedInverseReceiptLedgerSnapshotSchema>["operations"][number]["receipts"][number]["receipt"]>;
    try {
      const ledger = await validateStagedInverseReceiptLedgerSnapshot(request, manifest, value.permit, value.claimReread.claim, value.receiptSnapshot);
      for (const operation of ledger.snapshot.operations) {
        if (operation.state === "unknown" || operation.state === "conflict") {
          return blocked([`Inverse receipt ledger operation ${operation.stableId} is ${operation.state}; recovery or conflict review is required.`], true);
        }
        if (operation.state === "persisted") {
          const head = operation.receipts.at(-1);
          if (!head) return blocked(["Persisted inverse receipt ledger operation has no terminal head."], true);
          terminalReceipts.push(head.receipt);
        }
      }
    } catch (error) {
      return blocked([error instanceof Error ? error.message : "Inverse receipt ledger validation failed; no dispatch is authorized."], true);
    }

    const selection = await selectNextStagedInverseOperation(request, manifest, terminalReceipts);
    if (selection.status === "blocked") return blocked(selection.blockers, true);
    const common = {
      schemaVersion: "0.1.0" as const,
      inversePlanId: request.inversePlan.inversePlanId,
      inversePlanSha256: request.authorization.inversePlanSha256,
      authorizationId: request.authorization.authorizationId,
      manifestId: manifest.manifestId,
      manifestSha256: manifest.manifestSha256,
      permitId: value.permit.permitId,
      claimId: value.claimReread.claim.claimId,
      adapterId: manifest.adapterId,
      activeGmUserId: request.activeGmUserId,
      authoritativeReread: true as const,
      foreignStatePreserved: true as const,
      adapterDispatch: "not-authorized-by-this-contract" as const,
      execution: "not-implemented" as const,
      readyClaim: false as const,
      claimReread: "claimed" as const,
      claimObservedAt: value.claimReread.observedAt,
      claimPersistenceResolution: value.claimPersistenceResolution,
      gmObservedAt: value.currentGmReread.observedAt,
      receiptSnapshotObservedAt: value.receiptSnapshot.observedAt,
    };
    if (selection.status === "complete") {
      if (value.receiptPersistence !== null) return blocked(["A complete inverse plan cannot carry a pending-operation persistence state."], true);
      return stagedInversePreDispatchContextResultSchema.parse({ ...common, status: "complete" });
    }
    if (value.receiptPersistence === null) return blocked(["Selected inverse operation requires an authoritative receipt persistence snapshot."], true);
    if (value.receiptPersistence.manifestId !== manifest.manifestId
      || value.receiptPersistence.stableId !== selection.selection.stableId
      || value.receiptPersistence.idempotencyKey !== selection.selection.idempotencyKey
      || value.receiptPersistence.permitId !== value.permit.permitId
      || value.receiptPersistence.claimId !== value.claimReread.claim.claimId) {
      return blocked(["Inverse receipt persistence state does not match the exact selected operation."], true);
    }
    if (value.receiptPersistence.state !== "pending" || !value.receiptPersistence.authoritativeReread) {
      return blocked([`Inverse receipt persistence state is ${value.receiptPersistence.state}; only an authoritative pending state may enter pre-dispatch composition.`], true);
    }
    return stagedInversePreDispatchContextResultSchema.parse({
      ...common,
      status: "selected",
      selection: selection.selection,
      precedingStableIds: selection.precedingStableIds,
      receiptPersistence: value.receiptPersistence,
    });
  } catch (error) {
    return blocked([error instanceof Error ? error.message : "Inverse pre-dispatch validation failed; no dispatch is authorized."], false);
  }
}

async function validateExactInputs(
  requestInput: unknown,
  manifestInput: unknown,
): Promise<{ readonly request: StagedInverseExecutionInput; readonly manifest: StagedInverseExecutionManifest }> {
  return validateExactStagedInverseExecutionManifest(requestInput, manifestInput);
}
