import { z } from "zod";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import {
  classifyStagedInverseRetryState,
  stagedInverseOperationReadbackSchema,
  stagedInverseTerminalReceiptSchema,
  type StagedInverseOperationReadback,
  type StagedInverseTerminalReceipt,
} from "./staged-inverse-dispatch-state.js";
import {
  stagedInversePreflightResultSchema,
  type StagedInversePreflightResult,
} from "./staged-inverse-preflight-orchestration.js";
import {
  deriveStagedInverseTerminalReceiptId,
  stagedInverseReceiptPersistenceResolutionSchema,
  type StagedInverseReceiptPersistenceResolution,
} from "./staged-inverse-receipt-ledger.js";

const at = z.string().datetime({ offset: true });
const sha256 = z.string().regex(/^[0-9a-f]{64}$/);

export const stagedInverseOperationOutcomeSchema = z.object({
  dispatchStatus: z.enum(["accepted", "unknown", "blocked"]),
  status: z.enum(["blocked", "unknown", "committed"]),
  recoveredFromUnknown: z.literal(false),
  recoveredFromReceiptId: z.string().regex(/^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/).nullable(),
  recoveredFromReceiptSha256: sha256.nullable(),
  blockers: z.array(z.string().min(1)).max(100),
  observedAt: at,
}).strict().superRefine((value, context) => {
  if (value.status === "blocked" && value.blockers.length === 0) context.addIssue({ code: z.ZodIssueCode.custom, message: "A blocked inverse operation outcome requires a blocker." });
  if (value.recoveredFromReceiptId !== null || value.recoveredFromReceiptSha256 !== null) context.addIssue({ code: z.ZodIssueCode.custom, message: "M686 does not construct recovery-lineage receipts." });
});

export const stagedInverseExecutorCompositionInputSchema = z.object({
  preflight: stagedInversePreflightResultSchema,
  readback: stagedInverseOperationReadbackSchema,
  outcome: stagedInverseOperationOutcomeSchema,
  persistence: stagedInverseReceiptPersistenceResolutionSchema,
}).strict();

const compositionIdentitySchema = {
  schemaVersion: z.literal("0.1.0"),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  authoritativeReread: z.literal(true),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
} as const;

const compositionIdentityValues = {
  schemaVersion: "0.1.0" as const,
  adapterDispatch: "not-authorized-by-this-contract" as const,
  authoritativeReread: true as const,
  foreignStatePreserved: true as const,
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

export const stagedInverseExecutorCompositionResultSchema = z.object({
  ...compositionIdentitySchema,
  status: z.enum(["blocked", "persisted", "missing", "unknown", "conflict"]),
  preflightStatus: z.enum(["blocked", "selected", "complete"]),
  persistenceStatus: z.enum(["persisted", "missing", "unknown", "conflict"]).nullable(),
  terminalReceipt: stagedInverseTerminalReceiptSchema.nullable(),
  persistence: stagedInverseReceiptPersistenceResolutionSchema.nullable(),
  blockers: z.array(z.string().min(1)).max(100),
}).strict();

export type StagedInverseOperationOutcome = z.infer<typeof stagedInverseOperationOutcomeSchema>;
export type StagedInverseExecutorCompositionInput = z.infer<typeof stagedInverseExecutorCompositionInputSchema>;
export type StagedInverseExecutorCompositionResult = z.infer<typeof stagedInverseExecutorCompositionResultSchema>;

function blocked(
  preflightStatus: "blocked" | "selected" | "complete",
  blockers: string[],
  persistence: StagedInverseReceiptPersistenceResolution | null = null,
): StagedInverseExecutorCompositionResult {
  return stagedInverseExecutorCompositionResultSchema.parse({
    ...compositionIdentityValues,
    status: "blocked",
    preflightStatus,
    persistenceStatus: persistence?.status ?? null,
    terminalReceipt: null,
    persistence,
    blockers: blockers.length > 0 ? blockers.slice(0, 100) : ["Inverse executor composition is blocked; no dispatch is authorized."],
  });
}

function selectedContext(preflight: StagedInversePreflightResult) {
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") return null;
  return {
    preflight,
    context: preflight.preDispatch,
    selection: preflight.preDispatch.selection,
    persistence: preflight.preDispatch.receiptPersistence,
  };
}

function exactClaimPersistenceWitness(preflight: StagedInversePreflightResult): string[] {
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") return [];
  const witness = preflight.claimPersistenceResolution;
  const claim = preflight.claimObservation?.claim ?? null;
  if (preflight.claimObservation?.status !== "claimed"
    || witness === null
    || witness.status !== "matched"
    || witness.reread === null
    || claim === null
    || canonicalizeFoundryIr(witness) !== canonicalizeFoundryIr(preflight.preDispatch.claimPersistenceResolution)
    || canonicalizeFoundryIr(witness.reread) !== canonicalizeFoundryIr(claim)
    || witness.observedAt !== claim.observedAt) {
    return ["M686 requires one exact matched claim persistence-resolution witness across the selected preflight and authoritative claimed reread."];
  }
  return [];
}

type SelectedPreflightContext = Extract<StagedInversePreflightResult["preDispatch"], { status: "selected" }>;
type SelectedOperation = SelectedPreflightContext["selection"];

function exactReadbackIdentity(readback: StagedInverseOperationReadback, selected: SelectedOperation, context: SelectedPreflightContext): string[] {
  const blockers: string[] = [];
  if (readback.inversePlanId !== context.inversePlanId || readback.manifestId !== context.manifestId || readback.sequence !== selected.sequence || readback.stableId !== selected.stableId || readback.idempotencyKey !== selected.idempotencyKey || readback.operationSha256 !== selected.operationSha256 || readback.operationKind !== selected.kind) {
    blockers.push("Inverse outcome readback does not bind the exact selected preflight operation and digest.");
  }
  return blockers;
}

function deriveReceipt(
  context: SelectedPreflightContext,
  readback: StagedInverseOperationReadback,
  outcome: StagedInverseOperationOutcome,
): StagedInverseTerminalReceipt {
  const receiptId = deriveStagedInverseTerminalReceiptId(context.manifestId, context.selection.stableId, context.selection.idempotencyKey, "outcome");
  return stagedInverseTerminalReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId,
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
 * Pure non-dispatching handoff from verified preflight and operation evidence to
 * M684 receipt persistence. It only derives and validates a candidate; it does
 * not call the adapter, executor, receipt store, Foundry, or runtime.
 */
export async function composeStagedInverseExecutorHandoff(input: unknown): Promise<StagedInverseExecutorCompositionResult> {
  const parsed = stagedInverseExecutorCompositionInputSchema.safeParse(input);
  if (!parsed.success) return blocked("blocked", ["Inverse executor composition input is malformed; no dispatch is authorized."]);
  const value = parsed.data;
  const selected = selectedContext(value.preflight);
  if (!selected) return blocked(value.preflight.status, ["Inverse executor composition requires one selected, authoritative preflight operation; no dispatch is authorized."], value.persistence);
  const claimWitnessBlockers = exactClaimPersistenceWitness(value.preflight);
  if (claimWitnessBlockers.length > 0) return blocked("selected", claimWitnessBlockers, value.persistence);
  if (selected.persistence.state !== "pending"
    || selected.persistence.receiptId !== deriveStagedInverseTerminalReceiptId(selected.context.manifestId, selected.selection.stableId, selected.selection.idempotencyKey)
    || selected.persistence.manifestId !== selected.context.manifestId
    || selected.persistence.stableId !== selected.selection.stableId
    || selected.persistence.idempotencyKey !== selected.selection.idempotencyKey
    || selected.persistence.permitId !== selected.context.permitId
    || selected.persistence.claimId !== selected.context.claimId) {
    return blocked("selected", ["M681 preflight does not expose the exact pending receipt identity for the selected operation."], value.persistence);
  }
  const readbackBlockers = exactReadbackIdentity(value.readback, selected.selection, selected.context);
  if (readbackBlockers.length > 0) return blocked("selected", readbackBlockers, value.persistence);

  let receipt: StagedInverseTerminalReceipt;
  try {
    receipt = deriveReceipt(selected.context, value.readback, value.outcome);
  } catch (error) {
    return blocked("selected", [error instanceof Error ? error.message : "Inverse terminal receipt candidate is invalid; no dispatch is authorized."], value.persistence);
  }
  const candidate = value.persistence.candidate;
  const receiptSha256 = await sha256FoundryIr(canonicalizeFoundryIr(receipt));
  if (candidate.receipt.receiptId !== receipt.receiptId
    || canonicalizeFoundryIr(candidate.receipt) !== canonicalizeFoundryIr(receipt)
    || candidate.receiptSha256 !== receiptSha256
    || value.persistence.persistence.candidateReceiptSha256 !== receiptSha256) {
    return blocked("selected", ["M684 persistence candidate does not equal the exact derived terminal receipt and canonical digest."], value.persistence);
  }
  if (value.persistence.reread !== null
    && await sha256FoundryIr(canonicalizeFoundryIr(value.persistence.reread.receipt)) !== value.persistence.reread.receiptSha256) {
    return blocked("selected", ["M684 persistence reread digest does not match its canonical observed receipt."], value.persistence);
  }
  return stagedInverseExecutorCompositionResultSchema.parse({
    ...compositionIdentityValues,
    status: value.persistence.status,
    preflightStatus: "selected",
    persistenceStatus: value.persistence.status,
    terminalReceipt: receipt,
    persistence: value.persistence,
    blockers: value.persistence.status === "persisted" ? [] : [`Terminal receipt persistence is ${value.persistence.status}; no executor continuation is authorized.`],
  });
}
