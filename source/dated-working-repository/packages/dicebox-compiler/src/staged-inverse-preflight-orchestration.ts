import { z } from "zod";
import { type Result } from "@dicebox/core";
import {
  prepareStagedInversePreDispatchContext,
  stagedInverseClaimRereadSchema,
  stagedInverseCurrentGmRereadSchema,
  stagedInversePreDispatchContextResultSchema,
  type StagedInverseClaimReread,
  type StagedInverseCurrentGmReread,
  type StagedInversePreDispatchContextResult,
} from "./staged-inverse-pre-dispatch-context.js";
import { validateExactStagedInverseExecutionManifest } from "./staged-inverse-dispatch-state.js";
import { stagedInverseExecutionManifestSchema, type StagedInverseExecutionManifest } from "./staged-inverse-execution-manifest.js";
import { stagedInverseExecutionPermitSchema, verifyStagedInverseExecutionPermit, type StagedInverseExecutionPermit } from "./staged-inverse-execution-permit.js";
import { stagedInverseExecutionInputSchema, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";
import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  stagedInversePermitClaimStateSchema,
  type StagedInversePermitClaimPersistenceResolution,
  type StagedInversePermitClaimState,
} from "./staged-inverse-permit-claim.js";
import { canonicalizeFoundryIr } from "./foundry-ir.js";
import { type StagedInversePermitClaimStore } from "./staged-inverse-permit-claim-store.js";
import {
  deriveStagedInverseReceiptLedgerId,
  deriveStagedInverseReceiptQueryId,
  deriveStagedInverseTerminalReceiptId,
  stagedInverseReceiptLedgerPersistenceStateSchema,
  stagedInverseReceiptLedgerSnapshotSchema,
  validateStagedInverseReceiptLedgerSnapshot,
  type StagedInverseReceiptLedgerSnapshot,
} from "./staged-inverse-receipt-ledger.js";
import { selectNextStagedInverseOperation } from "./staged-inverse-dispatch-state.js";

const at = z.string().datetime({ offset: true });

export const stagedInversePreflightInputSchema = z.object({
  request: stagedInverseExecutionInputSchema,
  manifest: stagedInverseExecutionManifestSchema,
  permit: stagedInverseExecutionPermitSchema,
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
  observedAt: at,
}).strict();

export type StagedInversePreflightInput = z.infer<typeof stagedInversePreflightInputSchema>;

/**
 * M681 intentionally exposes only read capabilities. In particular, this
 * surface has no adapter, claim, receipt-append, or Foundry mutation method.
 */
export interface StagedInversePreflightCurrentGmReader {
  read(): Promise<Result<{ readonly userId: string; readonly observedAt: string }>>;
}

export interface StagedInversePreflightDependencies {
  readonly currentGm: StagedInversePreflightCurrentGmReader;
  readonly claims: Pick<StagedInversePermitClaimStore, "load">;
  readonly receipts: {
    enumerate(identity: {
      readonly ledgerId: string;
      readonly queryId: string;
      readonly manifestId: string;
      readonly permitId: string;
      readonly claimId: string;
    }): Promise<Result<unknown>>;
  };
}

export const stagedInversePreflightResultSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  status: z.enum(["blocked", "selected", "complete"]),
  preDispatch: stagedInversePreDispatchContextResultSchema,
  claimObservation: stagedInverseClaimRereadSchema.nullable(),
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema.nullable(),
  currentGmObservation: stagedInverseCurrentGmRereadSchema.nullable(),
  receiptLedgerObservation: stagedInverseReceiptLedgerSnapshotSchema.nullable(),
  authoritativeReread: z.boolean(),
  foreignStatePreserved: z.literal(true),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict().superRefine((value, context) => {
  if (value.status !== value.preDispatch.status) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse preflight status must equal its composed pre-dispatch result." });
  }
  if (value.status !== "blocked" && value.claimPersistenceResolution === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A selected or complete inverse preflight must preserve the matched claim persistence-resolution witness." });
  }
  if (value.status !== "blocked" && value.preDispatch.status !== "blocked" && value.claimPersistenceResolution !== null
    && canonicalizeFoundryIr(value.preDispatch.claimPersistenceResolution) !== canonicalizeFoundryIr(value.claimPersistenceResolution)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse preflight and pre-dispatch must preserve the same claim persistence-resolution witness." });
  }
});

export type StagedInversePreflightResult = z.infer<typeof stagedInversePreflightResultSchema>;

function blockedResult(
  blockers: string[],
  authoritativeReread: boolean,
  claimObservation: StagedInverseClaimReread | null = null,
  claimPersistenceResolution: StagedInversePermitClaimPersistenceResolution | null = null,
  currentGmObservation: StagedInverseCurrentGmReread | null = null,
  receiptLedgerObservation: StagedInverseReceiptLedgerSnapshot | null = null,
): StagedInversePreflightResult {
  const preDispatch = stagedInversePreDispatchContextResultSchema.parse({
    schemaVersion: "0.1.0",
    status: "blocked",
    blockers: blockers.length > 0 ? blockers.slice(0, 100) : ["Inverse preflight is blocked; no dispatch is authorized."],
    authoritativeReread,
    foreignStatePreserved: true,
    adapterDispatch: "not-authorized-by-this-contract",
    execution: "not-implemented",
    readyClaim: false,
  });
  return stagedInversePreflightResultSchema.parse({
    schemaVersion: "0.1.0",
    status: "blocked",
    preDispatch,
    claimObservation,
    claimPersistenceResolution,
    currentGmObservation,
    receiptLedgerObservation,
    authoritativeReread,
    foreignStatePreserved: true,
    adapterDispatch: "not-authorized-by-this-contract",
    execution: "not-implemented",
    readyClaim: false,
  });
}

function completedResult(
  preDispatch: StagedInversePreDispatchContextResult,
  claimObservation: StagedInverseClaimReread,
  claimPersistenceResolution: StagedInversePermitClaimPersistenceResolution,
  currentGmObservation: StagedInverseCurrentGmReread,
  receiptLedgerObservation: StagedInverseReceiptLedgerSnapshot,
): StagedInversePreflightResult {
  return stagedInversePreflightResultSchema.parse({
    schemaVersion: "0.1.0",
    status: preDispatch.status,
    preDispatch,
    claimObservation,
    claimPersistenceResolution,
    currentGmObservation,
    receiptLedgerObservation,
    authoritativeReread: true,
    foreignStatePreserved: true,
    adapterDispatch: "not-authorized-by-this-contract",
    execution: "not-implemented",
    readyClaim: false,
  });
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function claimObservation(
  claim: StagedInversePermitClaimState,
  observedAt: string,
): StagedInverseClaimReread {
  const status = claim.state === "unknown" ? "unknown" : claim.state === "claimed" ? "claimed" : "missing";
  return stagedInverseClaimRereadSchema.parse({
    schemaVersion: "0.1.0",
    source: "claim-store-load",
    status,
    claim,
    observedAt,
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

function pendingReceiptPersistence(
  manifest: StagedInverseExecutionManifest,
  permit: StagedInverseExecutionPermit,
  claim: StagedInversePermitClaimState,
  stableId: string,
  idempotencyKey: string,
) {
  return stagedInverseReceiptLedgerPersistenceStateSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: deriveStagedInverseTerminalReceiptId(manifest.manifestId, stableId, idempotencyKey),
    manifestId: manifest.manifestId,
    stableId,
    idempotencyKey,
    permitId: permit.permitId,
    claimId: claim.claimId,
    candidateReceiptSha256: null,
    observedReceiptSha256: null,
    state: "pending",
    authoritativeReread: true,
    retryAfter: "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

function terminalReceipts(snapshot: StagedInverseReceiptLedgerSnapshot) {
  return snapshot.operations.flatMap((operation) => {
    if (operation.state !== "persisted") return [];
    const head = operation.receipts.at(-1);
    return head ? [head.receipt] : [];
  });
}

/**
 * Performs the M681 authoritative-read composition and then invokes the pure
 * M679 pre-dispatch function. It cannot dispatch an adapter or mutate runtime
 * state, and dependency failures become explicit blocked results.
 */
export async function prepareStagedInversePreflight(
  input: unknown,
  dependencies: StagedInversePreflightDependencies,
): Promise<StagedInversePreflightResult> {
  const parsed = stagedInversePreflightInputSchema.safeParse(input);
  if (!parsed.success) return blockedResult(["Inverse preflight input is malformed; no dispatch is authorized."], false);
  const value = parsed.data;

  let exact: { readonly request: StagedInverseExecutionInput; readonly manifest: StagedInverseExecutionManifest };
  try {
    exact = await validateExactStagedInverseExecutionManifest(value.request, value.manifest);
    if (!await verifyStagedInverseExecutionPermit(value.permit, exact.request, exact.manifest)) {
      return blockedResult(["Inverse permit digest or identity is invalid; no dispatch is authorized."], false);
    }
  } catch (error) {
    return blockedResult([errorMessage(error, "Inverse preflight validation failed; no dispatch is authorized.")], false);
  }

  let claimLoaded: Result<StagedInversePermitClaimState | null>;
  try {
    claimLoaded = await dependencies.claims.load();
  } catch (error) {
    return blockedResult([`${errorMessage(error, "Inverse claim store load failed; no dispatch is authorized.")} No inverse dispatch is authorized.`], false);
  }
  if (!claimLoaded.ok) return blockedResult([`${claimLoaded.error.message} No inverse dispatch is authorized.`], false);
  if (claimLoaded.value === null) return blockedResult(["Authoritative inverse claim reread is missing; no dispatch is authorized."], true);
  const claim = claimLoaded.value;
  if (claim.state === "unknown") {
    return blockedResult(["Authoritative inverse claim reread is unknown; reread recovery is required before dispatch."], true, claimObservation(claim, value.observedAt));
  }
  if (claim.state !== "claimed") return blockedResult([`Authoritative inverse claim reread is ${claim.state}; a claimed state is required before dispatch.`], true);
  const claimReread = claimObservation(claim, value.observedAt);
  const claimPersistenceResolution = value.claimPersistenceResolution;
  if (claimPersistenceResolution.status !== "matched"
    || claimPersistenceResolution.reread === null
    || canonicalizeFoundryIr(claimPersistenceResolution.reread) !== canonicalizeFoundryIr(claim)) {
    return blockedResult(["Authoritative inverse claim reread does not match the exact claim persistence-resolution witness."], true, claimReread, claimPersistenceResolution);
  }

  let currentGmLoaded: Result<{ readonly userId: string; readonly observedAt: string }>;
  try {
    currentGmLoaded = await dependencies.currentGm.read();
  } catch (error) {
    return blockedResult([`${errorMessage(error, "Active GM reread failed; no dispatch is authorized.")} No inverse dispatch is authorized.`], true, claimReread, claimPersistenceResolution);
  }
  if (!currentGmLoaded.ok) return blockedResult([`${currentGmLoaded.error.message} No inverse dispatch is authorized.`], true, claimReread, claimPersistenceResolution);
  let currentGmObservation: StagedInverseCurrentGmReread;
  try {
    currentGmObservation = stagedInverseCurrentGmRereadSchema.parse({
      schemaVersion: "0.1.0",
      purpose: "execution-time-active-gm-recheck",
      userId: currentGmLoaded.value.userId,
      observedAt: currentGmLoaded.value.observedAt,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
    });
  } catch (error) {
    return blockedResult([errorMessage(error, "Active GM reread is malformed; no dispatch is authorized.")], true, claimReread, claimPersistenceResolution);
  }
  if (currentGmObservation.userId !== exact.request.activeGmUserId) {
    return blockedResult(["Execution-time active GM reread does not match the approved active GM."], true, claimReread, claimPersistenceResolution, currentGmObservation);
  }

  let ledgerLoaded: Result<unknown>;
  try {
    ledgerLoaded = await dependencies.receipts.enumerate({
      ledgerId: deriveStagedInverseReceiptLedgerId(exact.manifest.manifestId, value.permit.permitId, claim.claimId),
      queryId: deriveStagedInverseReceiptQueryId(exact.manifest.manifestId, value.permit.permitId, claim.claimId),
      manifestId: exact.manifest.manifestId,
      permitId: value.permit.permitId,
      claimId: claim.claimId,
    });
  } catch (error) {
    return blockedResult([`${errorMessage(error, "Inverse receipt ledger enumeration failed; no dispatch is authorized.")} No inverse dispatch is authorized.`], true, claimReread, claimPersistenceResolution, currentGmObservation);
  }
  if (!ledgerLoaded.ok) return blockedResult([`${ledgerLoaded.error.message} No inverse dispatch is authorized.`], true, claimReread, claimPersistenceResolution, currentGmObservation);

  let ledger: { readonly snapshot: StagedInverseReceiptLedgerSnapshot };
  try {
    ledger = await validateStagedInverseReceiptLedgerSnapshot(exact.request, exact.manifest, value.permit, claim, ledgerLoaded.value);
  } catch (error) {
    return blockedResult([errorMessage(error, "Inverse receipt ledger observation is invalid; no dispatch is authorized.")], true, claimReread, claimPersistenceResolution, currentGmObservation);
  }
  const receiptLedgerObservation = ledger.snapshot;
  let selection;
  try {
    selection = await selectNextStagedInverseOperation(exact.request, exact.manifest, terminalReceipts(receiptLedgerObservation));
  } catch (error) {
    return blockedResult([errorMessage(error, "Inverse operation selection failed; no dispatch is authorized.")], true, claimReread, claimPersistenceResolution, currentGmObservation, receiptLedgerObservation);
  }
  if (selection.status === "blocked") {
    return blockedResult(selection.blockers, true, claimReread, claimPersistenceResolution, currentGmObservation, receiptLedgerObservation);
  }

  const receiptPersistence = selection.status === "complete"
    ? null
    : (() => {
      const operation = receiptLedgerObservation.operations.find((candidate) => candidate.stableId === selection.selection.stableId);
      if (!operation || operation.state !== "absent") return null;
      return pendingReceiptPersistence(exact.manifest, value.permit, claim, selection.selection.stableId, selection.selection.idempotencyKey);
    })();
  if (selection.status === "selected" && receiptPersistence === null) {
    return blockedResult(["Selected inverse operation lacks an exact absent ledger entry from which pending persistence can be derived."], true, claimReread, claimPersistenceResolution, currentGmObservation, receiptLedgerObservation);
  }

  const preDispatch = await prepareStagedInversePreDispatchContext({
    request: exact.request,
    manifest: exact.manifest,
    permit: value.permit,
    receiptSnapshot: receiptLedgerObservation,
    claimReread,
    claimPersistenceResolution,
    currentGmReread: currentGmObservation,
    receiptPersistence,
  });
  return completedResult(preDispatch, claimReread, claimPersistenceResolution, currentGmObservation, receiptLedgerObservation);
}
