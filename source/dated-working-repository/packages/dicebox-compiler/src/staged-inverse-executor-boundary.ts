import { z } from "zod";
import { StableDiceBoxIdSchema, type Result } from "@dicebox/core";
import { stagedInverseExecutionManifestSchema, verifyStagedInverseExecutionManifest, type StagedInverseExecutionManifest, type StagedInverseOperationReceipt } from "./staged-inverse-execution-manifest.js";
import { stagedInverseExecutionPermitSchema, verifyStagedInverseExecutionPermit, type StagedInverseExecutionPermit } from "./staged-inverse-execution-permit.js";
import { stagedInverseExecutionInputSchema, validateAuthorizedStagedInverseExecutionInput, type StagedInverseExecutionInput } from "./staged-inverse-execution-contract.js";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import { type FoundryInverseOperation } from "./foundry-inverse-plan.js";
import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  stagedInversePermitClaimStateSchema,
  type StagedInversePermitClaimPersistenceResolution,
  type StagedInversePermitClaimState,
} from "./staged-inverse-permit-claim.js";
import { type StagedInversePermitClaimStore } from "./staged-inverse-permit-claim-store.js";
import {
  validateStagedInverseAdapterOperation,
  validateStagedInverseDeleteReadback,
  validateStagedInverseRestoreReadback,
  type StagedInverseAdapter,
} from "./staged-inverse-adapter.js";
import {
  bridgeStagedInverseProofToComposition,
} from "./staged-inverse-proof-composition-bridge.js";
import {
  stagedInverseExecutorCompositionResultSchema,
  type StagedInverseExecutorCompositionResult,
} from "./staged-inverse-executor-composition.js";
import {
  stagedInversePrePersistenceProofResultSchema,
  type StagedInversePrePersistenceProofResult,
} from "./staged-inverse-pre-persistence-proof.js";
import {
  stagedInversePreflightResultSchema,
  type StagedInversePreflightResult,
} from "./staged-inverse-preflight-orchestration.js";
import {
  classifyStagedInverseRetryState,
  stagedInverseOperationReadbackSchema,
  stagedInverseTerminalReceiptSchema,
  type StagedInverseOperationReadback,
  type StagedInverseOperationSelection,
} from "./staged-inverse-dispatch-state.js";
import {
  stagedInverseCurrentGmRereadSchema,
} from "./staged-inverse-pre-dispatch-context.js";
import {
  deriveStagedInverseTerminalReceiptId,
  stagedInverseReceiptLedgerEntrySchema,
  stagedInverseReceiptPersistenceResolutionSchema,
  type StagedInverseReceiptStore,
  type StagedInverseReceiptPersistenceResolution,
} from "./staged-inverse-receipt-ledger.js";

const at = z.string().datetime({ offset: true });

export const stagedInverseExecutorBoundaryInputSchema = z.object({
  request: stagedInverseExecutionInputSchema,
  manifest: stagedInverseExecutionManifestSchema,
  permit: stagedInverseExecutionPermitSchema,
  claimState: stagedInversePermitClaimStateSchema,
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema,
  observedAt: at,
}).strict().superRefine((value, context) => {
  if (value.request.inversePlan.inversePlanId !== value.manifest.inversePlanId
    || value.request.authorization.authorizationId !== value.manifest.authorizationId
    || value.permit.manifestId !== value.manifest.manifestId
    || value.permit.manifestSha256 !== value.manifest.manifestSha256
    || value.claimState.permitId !== value.permit.permitId
    || value.claimState.manifestId !== value.manifest.manifestId
    || value.claimState.activeGmUserId !== value.request.activeGmUserId) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "Inverse executor boundary inputs must share exact plan, authorization, manifest, permit, and GM identities." });
  }
  if (value.claimState.state !== "claimed") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["claimState", "state"], message: "Inverse dispatch requires a persisted claimed permit state." });
  }
  if (!value.claimState.authoritativeReread) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["claimState", "authoritativeReread"], message: "Inverse dispatch requires an authoritative reread of the claimed permit state." });
  }
  if (value.claimState.idempotencyKey !== value.request.idempotencyKey) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["claimState", "idempotencyKey"], message: "Inverse claim idempotency identity must exactly match the execution request." });
  }
  if (value.claimPersistenceResolution.status !== "matched" || value.claimPersistenceResolution.reread === null) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["claimPersistenceResolution"], message: "Inverse dispatch requires an exact matched claim persistence-resolution witness." });
  } else if (canonicalizeFoundryIr(value.claimPersistenceResolution.reread) !== canonicalizeFoundryIr(value.claimState)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["claimPersistenceResolution", "reread"], message: "Inverse claim persistence-resolution reread must canonically equal the claimed executor-boundary state." });
  }
});

export const stagedInverseExecutorBoundaryResultSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  status: z.enum(["blocked", "unknown", "committed", "recovered"]),
  inversePlanId: z.string().regex(/^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/),
  permitId: z.string().regex(/^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/),
  claimId: z.string().regex(/^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/),
  operationReceipts: z.array(z.unknown()).max(500),
  blockers: z.array(z.string().min(1)).max(100),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  authoritativeReread: z.boolean(),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseExecutorBoundaryInput = z.infer<typeof stagedInverseExecutorBoundaryInputSchema>;
export type StagedInverseExecutorBoundaryResult = z.infer<typeof stagedInverseExecutorBoundaryResultSchema>;

/**
 * Runtime-neutral evidence supplied to the legacy inverse boundary. The
 * boundary consumes already-observed dependency results; it does not invoke
 * those dependencies or turn evidence into dispatch authority.
 */
export const stagedInverseExecutorOrchestrationInputSchema = z.object({
  boundary: stagedInverseExecutorBoundaryInputSchema,
  preflight: stagedInversePreflightResultSchema,
  proof: stagedInversePrePersistenceProofResultSchema,
  persistence: stagedInverseReceiptPersistenceResolutionSchema,
}).strict();

const orchestrationIdentitySchema = {
  schemaVersion: z.literal("0.1.0"),
  adapterDispatch: z.literal("not-authorized-by-this-contract"),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
  dependencyInvocation: z.literal("not-invoked"),
  executorContinuation: z.literal("not-authorized-by-this-contract"),
} as const;

const orchestrationIdentity = {
  schemaVersion: "0.1.0" as const,
  adapterDispatch: "not-authorized-by-this-contract" as const,
  foreignStatePreserved: true as const,
  execution: "not-implemented" as const,
  readyClaim: false as const,
  dependencyInvocation: "not-invoked" as const,
  executorContinuation: "not-authorized-by-this-contract" as const,
};

export const stagedInverseExecutorOrchestrationResultSchema = z.object({
  ...orchestrationIdentitySchema,
  status: z.enum(["blocked", "prepared"]),
  boundaryStatus: z.enum(["blocked", "verified"]),
  composition: stagedInverseExecutorCompositionResultSchema.nullable(),
  blockers: z.array(z.string().min(1)).max(100),
  authoritativeReread: z.boolean(),
}).strict();

export type StagedInverseExecutorOrchestrationInput = z.infer<typeof stagedInverseExecutorOrchestrationInputSchema>;
export type StagedInverseExecutorOrchestrationResult = z.infer<typeof stagedInverseExecutorOrchestrationResultSchema>;

export interface StagedInverseCurrentGmReader {
  read(): Promise<Result<{ readonly userId: string; readonly observedAt: string }>>;
}

export interface StagedInverseOperationReceiptSink {
  append(receipt: StagedInverseOperationReceipt): Promise<Result<void>>;
}

export interface StagedInverseExecutorDependencies {
  readonly currentGm: StagedInverseCurrentGmReader;
  readonly claims: StagedInversePermitClaimStore;
  readonly adapter: StagedInverseAdapter;
  readonly receipts: StagedInverseOperationReceiptSink;
}

export const stagedInverseExecutorLifecycleInputSchema = z.object({
  orchestration: stagedInverseExecutorOrchestrationInputSchema,
  observedAt: at,
}).strict();

const lifecycleStatusSchema = z.enum(["blocked", "unknown", "committed"]);

export const stagedInverseExecutorLifecycleResultSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  status: lifecycleStatusSchema,
  operationStatus: lifecycleStatusSchema.nullable(),
  manifestId: StableDiceBoxIdSchema.nullable(),
  stableId: StableDiceBoxIdSchema.nullable(),
  currentGmObservation: stagedInverseCurrentGmRereadSchema.nullable(),
  claimPersistenceResolution: stagedInversePermitClaimPersistenceResolutionSchema.nullable(),
  terminalReceipt: stagedInverseTerminalReceiptSchema.nullable(),
  persistence: stagedInverseReceiptPersistenceResolutionSchema.nullable(),
  persistenceError: z.string().nullable(),
  blockers: z.array(z.string().min(1)).max(100),
  dependencyInvocation: z.array(z.enum(["current-gm-read", "claim-store-claim", "adapter", "terminal-receipt-store"])).max(4),
  adapterDispatch: z.enum(["not-invoked", "invoked"]),
  receiptPersistence: z.enum(["not-invoked", "invoked"]),
  authoritativeReread: z.boolean(),
  foreignStatePreserved: z.literal(true),
  execution: z.literal("not-implemented"),
  readyClaim: z.literal(false),
}).strict();

export type StagedInverseExecutorLifecycleInput = z.infer<typeof stagedInverseExecutorLifecycleInputSchema>;
export type StagedInverseExecutorLifecycleResult = z.infer<typeof stagedInverseExecutorLifecycleResultSchema>;

export interface StagedInverseExecutorLifecycleDependencies {
  readonly currentGm: StagedInverseCurrentGmReader;
  readonly claims: Pick<StagedInversePermitClaimStore, "claim">;
  readonly adapter: StagedInverseAdapter;
  readonly terminalReceipts: StagedInverseReceiptStore;
}

/** Contract-only validator: no executor method is exposed and no dependency is invoked. */
export function validateStagedInverseExecutorBoundaryInput(input: unknown): StagedInverseExecutorBoundaryInput {
  return stagedInverseExecutorBoundaryInputSchema.parse(input);
}

/** Verifies every canonical digest and cross-record identity before a future executor can consider dispatch. */
export async function validateVerifiedStagedInverseExecutorBoundaryInput(input: unknown): Promise<StagedInverseExecutorBoundaryInput> {
  const parsed = stagedInverseExecutorBoundaryInputSchema.parse(input);
  if (parsed.claimState.permitSha256 !== parsed.permit.permitSha256) throw new Error("Inverse claim permit digest does not match the exact permit.");
  const request = await validateAuthorizedStagedInverseExecutionInput(parsed.request);
  if (!await verifyStagedInverseExecutionManifest(parsed.manifest)) throw new Error("Inverse executor manifest digest is invalid.");
  if (!await verifyStagedInverseExecutionPermit(parsed.permit, request, parsed.manifest)) throw new Error("Inverse executor permit digest is invalid.");
  return parsed;
}

function blockedOrchestration(
  blockers: readonly string[],
  authoritativeReread = false,
  boundaryStatus: "blocked" | "verified" = "blocked",
  composition: StagedInverseExecutorCompositionResult | null = null,
): StagedInverseExecutorOrchestrationResult {
  return stagedInverseExecutorOrchestrationResultSchema.parse({
    ...orchestrationIdentity,
    status: "blocked",
    boundaryStatus,
    composition,
    blockers: blockers.length > 0 ? [...blockers].slice(0, 100) : ["Inverse executor orchestration is blocked; no dependency invocation or dispatch is authorized."],
    authoritativeReread,
  });
}

function exactOrchestrationIdentity(
  value: StagedInverseExecutorOrchestrationInput,
): string[] {
  const blockers: string[] = [];
  const request = value.proof.persistenceRequest;
  if (value.proof.status !== "proved" || request === null) {
    return ["Inverse executor orchestration requires one complete M688 proof with an exact persistence request."];
  }
  if (canonicalizeFoundryIr(value.boundary.request) !== canonicalizeFoundryIr(request.request)
    || canonicalizeFoundryIr(value.boundary.manifest) !== canonicalizeFoundryIr(request.manifest)
    || canonicalizeFoundryIr(value.boundary.permit) !== canonicalizeFoundryIr(request.permit)
    || canonicalizeFoundryIr(value.boundary.claimState) !== canonicalizeFoundryIr(request.claim)
    || canonicalizeFoundryIr(value.boundary.claimPersistenceResolution) !== canonicalizeFoundryIr(request.claimPersistenceResolution)) {
    blockers.push("Legacy executor boundary does not bind the exact M688 request, manifest, permit, claim, and persistence witness.");
  }
  if (value.preflight.claimPersistenceResolution === null
    || canonicalizeFoundryIr(value.preflight.claimPersistenceResolution) !== canonicalizeFoundryIr(request.claimPersistenceResolution)) {
    blockers.push("Legacy executor boundary does not bind the exact M681/M688 claim persistence witness.");
  }
  if (value.preflight.claimObservation?.claim === null
    || value.preflight.claimObservation?.claim === undefined
    || canonicalizeFoundryIr(value.preflight.claimObservation.claim) !== canonicalizeFoundryIr(request.claim)) {
    blockers.push("Legacy executor boundary does not bind the exact authoritative claimed reread consumed by M681/M688.");
  }
  return blockers;
}

/**
 * Composes the validated legacy inverse boundary with the pure M681/M688/M690/
 * M686 evidence chain. This is intentionally a preparation boundary: supplied
 * evidence is validated and mapped, but no claim, receipt, adapter, executor,
 * Foundry, or runtime dependency is invoked.
 */
export async function prepareStagedInverseExecutorOrchestration(
  input: unknown,
): Promise<StagedInverseExecutorOrchestrationResult> {
  const parsed = stagedInverseExecutorOrchestrationInputSchema.safeParse(input);
  if (!parsed.success) return blockedOrchestration(["Inverse executor orchestration input is malformed; no dependency invocation or dispatch is authorized."]);
  const value = parsed.data;

  try {
    await validateVerifiedStagedInverseExecutorBoundaryInput(value.boundary);
  } catch (error) {
    return blockedOrchestration([error instanceof Error ? error.message : "Inverse executor boundary validation failed; no dependency invocation or dispatch is authorized."]);
  }

  const identityBlockers = exactOrchestrationIdentity(value);
  if (identityBlockers.length > 0) return blockedOrchestration(identityBlockers, value.preflight.authoritativeReread, "verified");

  const composition = await bridgeStagedInverseProofToComposition({
    proof: value.proof,
    preflight: value.preflight,
    persistence: value.persistence,
  });
  return stagedInverseExecutorOrchestrationResultSchema.parse({
    ...orchestrationIdentity,
    status: composition.status === "blocked" ? "blocked" : "prepared",
    boundaryStatus: "verified",
    composition,
    blockers: composition.blockers,
    authoritativeReread: value.preflight.authoritativeReread,
  });
}

type LifecycleStatus = z.infer<typeof lifecycleStatusSchema>;

function lifecycleResult(input: {
  status: LifecycleStatus;
  operationStatus: LifecycleStatus | null;
  manifestId: string | null;
  stableId: string | null;
  currentGmObservation: z.infer<typeof stagedInverseCurrentGmRereadSchema> | null;
  claimPersistenceResolution: StagedInversePermitClaimPersistenceResolution | null;
  terminalReceipt: z.infer<typeof stagedInverseTerminalReceiptSchema> | null;
  persistence: StagedInverseReceiptPersistenceResolution | null;
  persistenceError: string | null;
  blockers: readonly string[];
  dependencyInvocation: readonly ("current-gm-read" | "claim-store-claim" | "adapter" | "terminal-receipt-store")[];
  adapterDispatch: "not-invoked" | "invoked";
  receiptPersistence: "not-invoked" | "invoked";
  authoritativeReread: boolean;
}): StagedInverseExecutorLifecycleResult {
  return stagedInverseExecutorLifecycleResultSchema.parse({
    schemaVersion: "0.1.0",
    ...input,
    blockers: [...input.blockers].slice(0, 100),
    dependencyInvocation: [...input.dependencyInvocation],
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}

function blockedLifecycle(
  blockers: readonly string[],
  input: Partial<Parameters<typeof lifecycleResult>[0]> = {},
): StagedInverseExecutorLifecycleResult {
  return lifecycleResult({
    status: "blocked",
    operationStatus: null,
    manifestId: null,
    stableId: null,
    currentGmObservation: null,
    claimPersistenceResolution: null,
    terminalReceipt: null,
    persistence: null,
    persistenceError: null,
    dependencyInvocation: [],
    adapterDispatch: "not-invoked",
    receiptPersistence: "not-invoked",
    authoritativeReread: false,
    ...input,
    blockers,
  });
}

function unknownInverseReadback(
  operation: FoundryInverseOperation,
  selection: StagedInverseOperationSelection,
  inversePlanSha256: string,
  observedAt: string,
): StagedInverseOperationReadback {
  const common = {
    schemaVersion: "0.1.0" as const,
    inversePlanId: selection.inversePlanId,
    inversePlanSha256,
    manifestId: selection.manifestId,
    sequence: selection.sequence,
    stableId: selection.stableId,
    idempotencyKey: selection.idempotencyKey,
    operationSha256: selection.operationSha256,
    observedAt,
    authoritativeReread: true as const,
    foreignStatePreserved: true as const,
  };
  return operation.kind === "delete-owned-create"
    ? stagedInverseOperationReadbackSchema.parse({ ...common, operationKind: operation.kind, status: "unknown", binding: null })
    : stagedInverseOperationReadbackSchema.parse({
      ...common,
      operationKind: operation.kind,
      status: "unknown",
      binding: null,
      expectedPreimageSha256: operation.preimageSha256,
      observedPayloadSha256: null,
    });
}

function lifecycleOperationStatus(readback: StagedInverseOperationReadback): LifecycleStatus {
  if (readback.status === "owned-absent" || readback.status === "preimage-matched") return "committed";
  if (readback.status === "unknown") return "unknown";
  return "blocked";
}

function lifecycleReadbackBlockers(readback: StagedInverseOperationReadback): string[] {
  if (readback.status === "unknown") return ["Inverse adapter returned an authoritative unknown outcome; recovery requires a later authoritative reread."];
  if (readback.status === "foreign-conflict") return ["Inverse adapter reread found foreign or conflicting runtime state; the exact foreign state is preserved."];
  if (readback.status === "not-found") return ["Inverse adapter reread found no exact target for the requested restore operation."];
  return [];
}

/**
 * M711's one-operation fixture-bound lifecycle boundary. It rechecks the
 * active GM, resolves the exact claimed permit, dispatches only an injected
 * adapter, validates its authoritative readback, and persists one terminal
 * receipt through the injected receipt store. It never calls Foundry itself
 * and remains execution:not-implemented for the live product boundary.
 */
export async function executeStagedInverseExecutorLifecycle(
  input: unknown,
  dependencies: StagedInverseExecutorLifecycleDependencies,
): Promise<StagedInverseExecutorLifecycleResult> {
  const parsed = stagedInverseExecutorLifecycleInputSchema.safeParse(input);
  if (!parsed.success) return blockedLifecycle(["M711 lifecycle input is malformed; no dependency invocation or dispatch is authorized."]);

  const orchestrationInput = parsed.data.orchestration;
  const boundary = orchestrationInput.boundary;
  const manifestId = boundary.manifest.manifestId;
  const orchestration = await prepareStagedInverseExecutorOrchestration(orchestrationInput);
  if (orchestration.status !== "prepared" || orchestration.composition === null) {
    return blockedLifecycle(orchestration.blockers, { manifestId, authoritativeReread: orchestration.authoritativeReread });
  }

  const preDispatch = orchestrationInput.preflight.preDispatch;
  if (preDispatch.status !== "selected") {
    return blockedLifecycle(["M711 requires one exact selected inverse operation from the verified M681 preflight."], { manifestId, authoritativeReread: true });
  }
  const selection = preDispatch.selection;
  const operation = boundary.request.inversePlan.operations.find((candidate) => candidate.stableId === selection.stableId);
  if (!operation || selection.manifestId !== manifestId || selection.inversePlanId !== boundary.request.inversePlan.inversePlanId || selection.kind !== operation.kind) {
    return blockedLifecycle(["M711 selected operation is not the exact authorized manifest operation."], { manifestId, stableId: selection.stableId, authoritativeReread: true });
  }
  if (dependencies.adapter.adapterId !== boundary.manifest.adapterId) {
    return blockedLifecycle(["M711 adapter identity does not match the exact authorized manifest; no adapter invocation is authorized."], { manifestId, stableId: selection.stableId, authoritativeReread: true });
  }

  const dependencyInvocation: ("current-gm-read" | "claim-store-claim" | "adapter" | "terminal-receipt-store")[] = ["current-gm-read"];
  let gmLoaded: Result<{ readonly userId: string; readonly observedAt: string }>;
  try {
    gmLoaded = await dependencies.currentGm.read();
  } catch (error) {
    return blockedLifecycle([error instanceof Error ? error.message : "Execution-time active GM reread failed; no inverse dispatch is authorized."], { manifestId, stableId: selection.stableId, dependencyInvocation, authoritativeReread: true });
  }
  if (!gmLoaded.ok) return blockedLifecycle([`${gmLoaded.error.message} No inverse dispatch is authorized.`], { manifestId, stableId: selection.stableId, dependencyInvocation, authoritativeReread: true });

  let currentGmObservation: z.infer<typeof stagedInverseCurrentGmRereadSchema>;
  try {
    currentGmObservation = stagedInverseCurrentGmRereadSchema.parse({
      schemaVersion: "0.1.0",
      purpose: "execution-time-active-gm-recheck",
      userId: gmLoaded.value.userId,
      observedAt: gmLoaded.value.observedAt,
      authoritativeReread: true,
      foreignStatePreserved: true,
      execution: "not-implemented",
      readyClaim: false,
    });
  } catch (error) {
    return blockedLifecycle([error instanceof Error ? error.message : "Execution-time active GM reread is malformed; no inverse dispatch is authorized."], { manifestId, stableId: selection.stableId, dependencyInvocation, authoritativeReread: true });
  }
  if (currentGmObservation.userId !== boundary.request.activeGmUserId) {
    return blockedLifecycle(["Execution-time active GM reread does not match the exact approved active GM."], { manifestId, stableId: selection.stableId, currentGmObservation, dependencyInvocation, authoritativeReread: true });
  }

  dependencyInvocation.push("claim-store-claim");
  let claimResult: Result<StagedInversePermitClaimPersistenceResolution>;
  try {
    claimResult = await dependencies.claims.claim(boundary.claimState);
  } catch (error) {
    return blockedLifecycle([error instanceof Error ? error.message : "Inverse claim-store resolution failed; no adapter dispatch is authorized."], { manifestId, stableId: selection.stableId, currentGmObservation, dependencyInvocation, authoritativeReread: true });
  }
  if (!claimResult.ok) return blockedLifecycle([`${claimResult.error.message} No adapter dispatch is authorized.`], { manifestId, stableId: selection.stableId, currentGmObservation, dependencyInvocation, authoritativeReread: true });
  const claimPersistenceResolution = stagedInversePermitClaimPersistenceResolutionSchema.parse(claimResult.value);
  if (claimPersistenceResolution.status !== "matched"
    || claimPersistenceResolution.reread === null
    || canonicalizeFoundryIr(claimPersistenceResolution.reread) !== canonicalizeFoundryIr(boundary.claimState)) {
    return blockedLifecycle(["M711 claim-store reread does not match the exact claimed permit witness; no adapter dispatch is authorized."], { manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, dependencyInvocation, authoritativeReread: true });
  }
  const claim = claimPersistenceResolution.reread;

  const adapterOperation = await validateStagedInverseAdapterOperation({ selection, operation });
  dependencyInvocation.push("adapter");
  let adapterResult: Result<unknown>;
  try {
    adapterResult = operation.kind === "delete-owned-create"
      ? await dependencies.adapter.deleteOwnedCreate({ selection: adapterOperation.selection, operation })
      : await dependencies.adapter.restoreUpdatePreimage({ selection: adapterOperation.selection, operation });
  } catch (error) {
    return blockedLifecycle([error instanceof Error ? error.message : "Inverse adapter invocation failed without authoritative readback; no terminal receipt is persisted."], { manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, dependencyInvocation, adapterDispatch: "invoked", authoritativeReread: true });
  }
  if (!adapterResult.ok) {
    return blockedLifecycle([`${adapterResult.error.message} No authoritative inverse readback was returned; terminal receipt persistence is blocked.`], { manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, dependencyInvocation, adapterDispatch: "invoked", authoritativeReread: true });
  }

  let readback: StagedInverseOperationReadback;
  try {
    readback = operation.kind === "delete-owned-create"
      ? await validateStagedInverseDeleteReadback(adapterResult.value, adapterOperation, boundary.request.inversePlan.inversePlanId, boundary.request.authorization.inversePlanSha256)
      : await validateStagedInverseRestoreReadback(adapterResult.value, adapterOperation, boundary.request.inversePlan.inversePlanId, boundary.request.authorization.inversePlanSha256);
  } catch (error) {
    return blockedLifecycle([error instanceof Error ? error.message : "Inverse adapter readback is invalid; no terminal receipt is persisted."], { manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, dependencyInvocation, adapterDispatch: "invoked", authoritativeReread: true });
  }

  const operationStatus = lifecycleOperationStatus(readback);
  const blockers = lifecycleReadbackBlockers(readback);
  const terminalReceipt = stagedInverseTerminalReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: deriveStagedInverseTerminalReceiptId(manifestId, selection.stableId, selection.idempotencyKey),
    manifestId,
    inversePlanId: boundary.request.inversePlan.inversePlanId,
    inversePlanSha256: boundary.request.authorization.inversePlanSha256,
    permitId: boundary.permit.permitId,
    claimId: claim.claimId,
    sequence: selection.sequence,
    stableId: selection.stableId,
    operationKind: operation.kind,
    idempotencyKey: selection.idempotencyKey,
    dispatchStatus: readback.status === "unknown" ? "unknown" : "accepted",
    status: operationStatus,
    recoveredFromUnknown: false,
    recoveredFromReceiptId: null,
    recoveredFromReceiptSha256: null,
    readback,
    retryState: classifyStagedInverseRetryState(readback),
    blockers,
    receiptPersistence: "terminal",
    authoritativeReread: true,
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
    observedAt: readback.observedAt,
  });
  const candidate = stagedInverseReceiptLedgerEntrySchema.parse({
    receipt: terminalReceipt,
    receiptSha256: await sha256FoundryIr(canonicalizeFoundryIr(terminalReceipt)),
  });

  dependencyInvocation.push("terminal-receipt-store");
  let persistenceResult: Result<StagedInverseReceiptPersistenceResolution>;
  try {
    persistenceResult = await dependencies.terminalReceipts.persistTerminalReceipt(boundary.request, boundary.manifest, boundary.permit, claim, candidate);
  } catch (error) {
    return lifecycleResult({ status: "unknown", operationStatus, manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, terminalReceipt, persistence: null, persistenceError: error instanceof Error ? error.message : "Terminal receipt persistence failed without a known outcome.", blockers: [...blockers, "Terminal receipt persistence outcome is unknown; authoritative reread is required before retry."], dependencyInvocation, adapterDispatch: "invoked", receiptPersistence: "invoked", authoritativeReread: true });
  }
  if (!persistenceResult.ok) {
    return lifecycleResult({ status: "unknown", operationStatus, manifestId, stableId: selection.stableId, currentGmObservation, claimPersistenceResolution, terminalReceipt, persistence: null, persistenceError: persistenceResult.error.message, blockers: [...blockers, `${persistenceResult.error.message} Terminal receipt persistence outcome is unknown; authoritative reread is required before retry.`], dependencyInvocation, adapterDispatch: "invoked", receiptPersistence: "invoked", authoritativeReread: true });
  }

  const persistence = persistenceResult.value;
  const status: LifecycleStatus = persistence.status === "persisted"
    ? operationStatus
    : persistence.status === "conflict"
      ? "blocked"
      : "unknown";
  const persistenceBlocker = persistence.status === "persisted" ? [] : [`Terminal receipt persistence is ${persistence.status}; no automatic retry is authorized.`];
  return lifecycleResult({
    status,
    operationStatus,
    manifestId,
    stableId: selection.stableId,
    currentGmObservation,
    claimPersistenceResolution,
    terminalReceipt,
    persistence,
    persistenceError: null,
    blockers: [...blockers, ...persistenceBlocker],
    dependencyInvocation,
    adapterDispatch: "invoked",
    receiptPersistence: "invoked",
    authoritativeReread: true,
  });
}

/** Contract-only result validator: this shape cannot claim that inverse dispatch occurred. */
export function validateStagedInverseExecutorBoundaryResult(input: unknown): StagedInverseExecutorBoundaryResult {
  return stagedInverseExecutorBoundaryResultSchema.parse(input);
}
