import { z } from "zod";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import {
  stagedInverseOperationOutcomeSchema,
  type StagedInverseOperationOutcome,
} from "./staged-inverse-executor-composition.js";
import {
  stagedInverseOperationReadbackSchema,
  stagedInverseTerminalReceiptSchema,
  classifyStagedInverseRetryState,
  type StagedInverseOperationReadback,
  type StagedInverseTerminalReceipt,
} from "./staged-inverse-dispatch-state.js";
import {
  stagedInverseAdapterOperationSchema,
  validateStagedInverseAdapterOperation,
  validateStagedInverseDeleteReadback,
  validateStagedInverseRestoreReadback,
  type StagedInverseAdapterOperation,
} from "./staged-inverse-adapter.js";
import {
  stagedInverseExecutionManifestSchema,
  type StagedInverseExecutionManifest,
} from "./staged-inverse-execution-manifest.js";
import {
  stagedInverseExecutionPermitSchema,
  verifyStagedInverseExecutionPermit,
  type StagedInverseExecutionPermit,
} from "./staged-inverse-execution-permit.js";
import {
  stagedInverseExecutionInputSchema,
  type StagedInverseExecutionInput,
} from "./staged-inverse-execution-contract.js";
import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  stagedInversePermitClaimStateSchema,
  type StagedInversePermitClaimPersistenceResolution,
  type StagedInversePermitClaimState,
} from "./staged-inverse-permit-claim.js";
import {
  deriveStagedInverseTerminalReceiptId,
  stagedInverseReceiptLedgerEntrySchema,
  validateStagedInverseReceiptLedgerSnapshot,
  type StagedInverseReceiptLedgerEntry,
} from "./staged-inverse-receipt-ledger.js";
import {
  stagedInversePreflightResultSchema,
  type StagedInversePreflightResult,
} from "./staged-inverse-preflight-orchestration.js";
import { validateExactStagedInverseExecutionManifest } from "./staged-inverse-dispatch-state.js";

const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

const proofIdentitySchema = {
  schemaVersion: z.literal("0.1.0"),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
} as const;

const proofIdentity = {
  schemaVersion: "0.1.0" as const,
  adapterDispatch: "not-authorized-by-this-contract" as const,
  authoritativeReread: true as const,
  foreignStatePreserved: true as const,
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

/**
 * Raw inputs for the pure pre-persistence proof. The adapter operation and
 * readback are evidence supplied by a caller; this function validates them
 * but never invokes the adapter or any runtime dependency.
 */
export const stagedInversePrePersistenceProofInputSchema = z.object({
  request: stagedInverseExecutionInputSchema,
  manifest: stagedInverseExecutionManifestSchema,
  permit: stagedInverseExecutionPermitSchema,
  claim: stagedInversePermitClaimStateSchema,
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
  preflight: stagedInversePreflightResultSchema,
  adapterOperation: stagedInverseAdapterOperationSchema,
  readback: z.unknown(),
  outcome: stagedInverseOperationOutcomeSchema,
}).strict();

export const stagedInverseReceiptPersistenceRequestSchema = z.object({
  request: stagedInverseExecutionInputSchema,
  manifest: stagedInverseExecutionManifestSchema,
  permit: stagedInverseExecutionPermitSchema,
  claim: stagedInversePermitClaimStateSchema,
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
  candidate: stagedInverseReceiptLedgerEntrySchema,
}).strict();

export const stagedInversePrePersistenceProofResultSchema = z.object({
  ...proofIdentitySchema,
  status: z.enum(["blocked", "proved"]),
  adapterOperation: stagedInverseAdapterOperationSchema.nullable(),
  readback: stagedInverseOperationReadbackSchema.nullable(),
  outcome: stagedInverseOperationOutcomeSchema.nullable(),
  candidate: stagedInverseReceiptLedgerEntrySchema.nullable(),
  persistenceRequest: stagedInverseReceiptPersistenceRequestSchema.nullable(),
  blockers: z.array(z.string().min(1)).max(100),
}).strict().superRefine((value, context) => {
  const complete = value.adapterOperation !== null
    && value.readback !== null
    && value.outcome !== null
    && value.candidate !== null
    && value.persistenceRequest !== null;
  if (value.status === "proved" && !complete) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A proved inverse pre-persistence result requires exact operation evidence and an M684 persistence request." });
  }
  if (value.status === "blocked" && value.blockers.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A blocked inverse pre-persistence result requires a blocker." });
  }
});

export type StagedInversePrePersistenceProofInput = z.infer<typeof stagedInversePrePersistenceProofInputSchema>;
export type StagedInverseReceiptPersistenceRequest = z.infer<typeof stagedInverseReceiptPersistenceRequestSchema>;
export type StagedInversePrePersistenceProofResult = z.infer<typeof stagedInversePrePersistenceProofResultSchema>;

function blocked(blockers: string[]): StagedInversePrePersistenceProofResult {
  return stagedInversePrePersistenceProofResultSchema.parse({
    ...proofIdentity,
    status: "blocked",
    adapterOperation: null,
    readback: null,
    outcome: null,
    candidate: null,
    persistenceRequest: null,
    blockers: blockers.length > 0 ? blockers.slice(0, 100) : ["Inverse pre-persistence proof is blocked; no dispatch is authorized."],
  });
}

function sameSelection(
  left: StagedInverseAdapterOperation["selection"],
  right: StagedInverseAdapterOperation["selection"],
): boolean {
  return left.manifestId === right.manifestId
    && left.inversePlanId === right.inversePlanId
    && left.sequence === right.sequence
    && left.stableId === right.stableId
    && left.kind === right.kind
    && left.idempotencyKey === right.idempotencyKey
    && left.operationSha256 === right.operationSha256;
}

function selectedPreflightMatches(
  preflight: StagedInversePreflightResult,
  request: StagedInverseExecutionInput,
  manifest: StagedInverseExecutionManifest,
  permit: StagedInverseExecutionPermit,
  claim: StagedInversePermitClaimState,
  claimPersistenceResolution: StagedInversePermitClaimPersistenceResolution,
): string[] {
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") {
    return ["M681 preflight must be selected before an M684 persistence request can be proved."];
  }
  const context = preflight.preDispatch;
  const blockers: string[] = [];
  if (context.inversePlanId !== request.inversePlan.inversePlanId
    || context.inversePlanSha256 !== request.authorization.inversePlanSha256
    || context.authorizationId !== request.authorization.authorizationId
    || context.manifestId !== manifest.manifestId
    || context.manifestSha256 !== manifest.manifestSha256
    || context.permitId !== permit.permitId
    || context.claimId !== claim.claimId
    || context.adapterId !== manifest.adapterId
    || context.activeGmUserId !== request.activeGmUserId) {
    blockers.push("M681 preflight does not bind the exact request, manifest, permit, claim, adapter, and active GM.");
  }
  if (preflight.claimObservation?.status !== "claimed"
    || preflight.claimObservation.claim === null
    || canonicalizeFoundryIr(preflight.claimObservation.claim) !== canonicalizeFoundryIr(claim)) {
    blockers.push("M681 preflight claim reread does not equal the exact claimed permit state.");
  }
  if (preflight.claimPersistenceResolution === null
    || canonicalizeFoundryIr(preflight.claimPersistenceResolution) !== canonicalizeFoundryIr(claimPersistenceResolution)
    || claimPersistenceResolution.status !== "matched"
    || claimPersistenceResolution.reread === null
    || canonicalizeFoundryIr(claimPersistenceResolution.reread) !== canonicalizeFoundryIr(claim)) {
    blockers.push("M681 preflight does not preserve the exact matched claim persistence-resolution witness.");
  }
  if (preflight.currentGmObservation?.userId !== request.activeGmUserId) {
    blockers.push("M681 preflight active-GM reread does not equal the exact approved active GM.");
  }
  if (preflight.receiptLedgerObservation === null) {
    blockers.push("M681 preflight does not expose an authoritative receipt-ledger reread.");
  }
  if (context.receiptPersistence.state !== "pending"
    || context.receiptPersistence.receiptId !== deriveStagedInverseTerminalReceiptId(context.manifestId, context.selection.stableId, context.selection.idempotencyKey)
    || context.receiptPersistence.manifestId !== context.manifestId
    || context.receiptPersistence.stableId !== context.selection.stableId
    || context.receiptPersistence.idempotencyKey !== context.selection.idempotencyKey
    || context.receiptPersistence.permitId !== context.permitId
    || context.receiptPersistence.claimId !== context.claimId) {
    blockers.push("M681 preflight does not expose the exact pending M684 receipt identity for the selected operation.");
  }
  return blockers;
}

function terminalReceipt(
  context: Extract<StagedInversePreflightResult["preDispatch"], { status: "selected" }>,
  readback: StagedInverseOperationReadback,
  outcome: StagedInverseOperationOutcome,
): StagedInverseTerminalReceipt {
  return stagedInverseTerminalReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: deriveStagedInverseTerminalReceiptId(context.manifestId, context.selection.stableId, context.selection.idempotencyKey),
    manifestId: context.manifestId,
    inversePlanId: context.inversePlanId,
    inversePlanSha256: context.inversePlanSha256,
    permitId: context.permitId,
    claimId: context.claimId,
    sequence: context.selection.sequence,
    stableId: context.selection.stableId,
    operationKind: context.selection.kind,
    idempotencyKey: context.selection.idempotencyKey,
    dispatchStatus: outcome.dispatchStatus,
    status: outcome.status,
    recoveredFromUnknown: outcome.recoveredFromUnknown,
    recoveredFromReceiptId: outcome.recoveredFromReceiptId,
    recoveredFromReceiptSha256: outcome.recoveredFromReceiptSha256,
    readback,
    retryState: classifyStagedInverseRetryState(readback),
    blockers: outcome.blockers,
    receiptPersistence: "terminal",
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
    observedAt: outcome.observedAt,
  });
}

/**
 * Proves the exact pre-persistence tuple consumed by M684. This is a pure
 * validation and construction seam: it does not call the adapter, persistence
 * store, executor, Foundry, or runtime.
 */
export async function proveStagedInversePrePersistence(input: unknown): Promise<StagedInversePrePersistenceProofResult> {
  const parsed = stagedInversePrePersistenceProofInputSchema.safeParse(input);
  if (!parsed.success) return blocked(["Inverse pre-persistence proof input is malformed; no dispatch is authorized."]);
  const value = parsed.data;

  try {
    const exact = await validateExactStagedInverseExecutionManifest(value.request, value.manifest);
    const permit = stagedInverseExecutionPermitSchema.parse(value.permit);
    if (!await verifyStagedInverseExecutionPermit(permit, exact.request, exact.manifest)) {
      return blocked(["Inverse pre-persistence proof permit digest or identity is invalid; no dispatch is authorized."]);
    }
    const claim = stagedInversePermitClaimStateSchema.parse(value.claim);
    if (claim.state !== "claimed" || !claim.authoritativeReread
      || claim.permitId !== permit.permitId
      || claim.permitSha256 !== permit.permitSha256
      || claim.manifestId !== exact.manifest.manifestId
      || claim.idempotencyKey !== exact.request.idempotencyKey
      || claim.activeGmUserId !== exact.request.activeGmUserId) {
      return blocked(["Inverse pre-persistence proof requires the exact authoritative claimed permit state."]);
    }
    const claimPersistenceResolution = stagedInversePermitClaimPersistenceResolutionSchema.parse(value.claimPersistenceResolution);
    if (claimPersistenceResolution.status !== "matched"
      || claimPersistenceResolution.reread === null
      || canonicalizeFoundryIr(claimPersistenceResolution.reread) !== canonicalizeFoundryIr(claim)) {
      return blocked(["Inverse pre-persistence proof requires the exact matched claim persistence-resolution witness."]);
    }
    const preflight = stagedInversePreflightResultSchema.parse(value.preflight);
    const preflightBlockers = selectedPreflightMatches(preflight, exact.request, exact.manifest, permit, claim, claimPersistenceResolution);
    if (preflightBlockers.length > 0) return blocked(preflightBlockers);
    if (preflight.receiptLedgerObservation === null) return blocked(["M681 preflight receipt-ledger reread is missing; no dispatch is authorized."]);
    await validateStagedInverseReceiptLedgerSnapshot(exact.request, exact.manifest, permit, claim, preflight.receiptLedgerObservation);

    const adapterOperation = await validateStagedInverseAdapterOperation(value.adapterOperation);
    const selectedContext = preflight.preDispatch as Extract<StagedInversePreflightResult["preDispatch"], { status: "selected" }>;
    const selected = selectedContext.selection;
    if (!sameSelection(adapterOperation.selection, selected)) {
      return blocked(["M683 adapter operation does not bind the exact M681 selected operation."]);
    }
    const planOperation = exact.request.inversePlan.operations.find((operation) => operation.stableId === adapterOperation.operation.stableId);
    if (!planOperation || canonicalizeFoundryIr(planOperation) !== canonicalizeFoundryIr(adapterOperation.operation)) {
      return blocked(["M683 adapter operation does not equal the exact authorized inverse-plan operation."]);
    }

    const readback = adapterOperation.operation.kind === "delete-owned-create"
      ? await validateStagedInverseDeleteReadback(value.readback, adapterOperation, exact.request.inversePlan.inversePlanId, exact.request.authorization.inversePlanSha256)
      : await validateStagedInverseRestoreReadback(value.readback, adapterOperation, exact.request.inversePlan.inversePlanId, exact.request.authorization.inversePlanSha256);
    const outcome = stagedInverseOperationOutcomeSchema.parse(value.outcome);
    const receipt = terminalReceipt(selectedContext, readback, outcome);
    const receiptSha256 = await sha256FoundryIr(canonicalizeFoundryIr(receipt));
    const candidate: StagedInverseReceiptLedgerEntry = stagedInverseReceiptLedgerEntrySchema.parse({ receipt, receiptSha256 });
    const persistenceRequest = stagedInverseReceiptPersistenceRequestSchema.parse({
      request: exact.request,
      manifest: exact.manifest,
      permit,
      claim,
      claimPersistenceResolution,
      candidate,
    });
    return stagedInversePrePersistenceProofResultSchema.parse({
      ...proofIdentity,
      status: "proved",
      adapterOperation,
      readback,
      outcome,
      candidate,
      persistenceRequest,
      blockers: [],
    });
  } catch (error) {
    return blocked([error instanceof Error ? error.message : "Inverse pre-persistence proof failed; no dispatch is authorized."]);
  }
}
