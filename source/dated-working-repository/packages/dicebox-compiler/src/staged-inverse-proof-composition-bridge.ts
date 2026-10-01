import { canonicalizeFoundryIr } from "./foundry-ir.js";
import {
  composeStagedInverseExecutorHandoff,
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
  stagedInverseReceiptPersistenceResolutionSchema,
  type StagedInverseReceiptPersistenceResolution,
} from "./staged-inverse-receipt-ledger.js";
import { z } from "zod";

export const stagedInverseProofCompositionBridgeInputSchema = z.object({
  proof: stagedInversePrePersistenceProofResultSchema,
  preflight: stagedInversePreflightResultSchema,
  persistence: stagedInverseReceiptPersistenceResolutionSchema,
}).strict();

export type StagedInverseProofCompositionBridgeInput = z.infer<typeof stagedInverseProofCompositionBridgeInputSchema>;

const bridgeIdentity = {
  schemaVersion: "0.1.0" as const,
  adapterDispatch: "not-authorized-by-this-contract" as const,
  authoritativeReread: true as const,
  foreignStatePreserved: true as const,
  execution: "not-implemented" as const,
  readyClaim: false as const,
};

function blocked(
  preflightStatus: "blocked" | "selected" | "complete",
  blockers: string[],
  persistence: StagedInverseReceiptPersistenceResolution | null = null,
): StagedInverseExecutorCompositionResult {
  return stagedInverseExecutorCompositionResultSchema.parse({
    ...bridgeIdentity,
    status: "blocked",
    preflightStatus,
    persistenceStatus: persistence?.status ?? null,
    terminalReceipt: null,
    persistence,
    blockers,
  });
}

function exactProofRequestIdentity(
  proof: StagedInversePrePersistenceProofResult,
  preflight: StagedInversePreflightResult,
): string[] {
  if (proof.status !== "proved"
    || proof.adapterOperation === null
    || proof.readback === null
    || proof.outcome === null
    || proof.candidate === null
    || proof.persistenceRequest === null) {
    return ["M690 requires one complete proved M688 pre-persistence result."];
  }
  if (preflight.status !== "selected" || preflight.preDispatch.status !== "selected") {
    return ["M690 requires the exact selected M681 preflight consumed by the M688 proof."];
  }

  const request = proof.persistenceRequest.request;
  const manifest = proof.persistenceRequest.manifest;
  const permit = proof.persistenceRequest.permit;
  const claim = proof.persistenceRequest.claim;
  const context = preflight.preDispatch;
  const selection = context.selection;
  const operation = proof.adapterOperation.selection;
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
    blockers.push("M688 persistence request does not bind the exact selected M681 preflight context.");
  }
  if (selection.manifestId !== operation.manifestId
    || selection.inversePlanId !== operation.inversePlanId
    || selection.sequence !== operation.sequence
    || selection.stableId !== operation.stableId
    || selection.kind !== operation.kind
    || selection.idempotencyKey !== operation.idempotencyKey
    || selection.operationSha256 !== operation.operationSha256) {
    blockers.push("M688 proof operation does not equal the exact selected M681 operation.");
  }
  if (canonicalizeFoundryIr(proof.candidate) !== canonicalizeFoundryIr(proof.persistenceRequest.candidate)) {
    blockers.push("M688 proof candidate does not equal its exact M684 persistence-request candidate.");
  }
  const proofWitness = proof.persistenceRequest.claimPersistenceResolution;
  const preflightWitness = preflight.claimPersistenceResolution;
  if (preflightWitness === null
    || proofWitness.status !== "matched"
    || proofWitness.reread === null
    || canonicalizeFoundryIr(proofWitness) !== canonicalizeFoundryIr(preflightWitness)
    || canonicalizeFoundryIr(proofWitness.reread) !== canonicalizeFoundryIr(claim)
    || proofWitness.observedAt !== claim.observedAt) {
    blockers.push("M688 proof does not preserve the exact matched claim persistence-resolution witness selected by M681 preflight.");
  }
  return blockers;
}

function exactPersistenceIdentity(
  proof: StagedInversePrePersistenceProofResult,
  persistence: StagedInverseReceiptPersistenceResolution,
): string[] {
  if (proof.status !== "proved" || proof.candidate === null || proof.persistenceRequest === null) {
    return ["M688 proof does not contain the exact M684 persistence candidate and request."];
  }
  const candidate = proof.candidate;
  const state = persistence.persistence;
  const blockers: string[] = [];
  if (canonicalizeFoundryIr(persistence.candidate) !== canonicalizeFoundryIr(candidate)) {
    blockers.push("M684 persistence resolution candidate does not equal the exact proved M688 candidate.");
  }
  if (state.receiptId !== candidate.receipt.receiptId
    || state.manifestId !== candidate.receipt.manifestId
    || state.stableId !== candidate.receipt.stableId
    || state.idempotencyKey !== candidate.receipt.idempotencyKey
    || state.permitId !== candidate.receipt.permitId
    || state.claimId !== candidate.receipt.claimId
    || state.candidateReceiptSha256 !== candidate.receiptSha256) {
    blockers.push("M684 persistence state does not bind the exact proved M688 receipt identity and digest.");
  }
  return blockers;
}

/**
 * Pure M690 bridge from a proved M688 tuple and exact M684 resolution into
 * M686's pure composition mapper. It does not invoke a store, adapter,
 * executor, Foundry, runtime, or any mutable dependency.
 */
export async function bridgeStagedInverseProofToComposition(input: unknown): Promise<StagedInverseExecutorCompositionResult> {
  const parsed = stagedInverseProofCompositionBridgeInputSchema.safeParse(input);
  if (!parsed.success) return blocked("blocked", ["M690 proof-to-composition bridge input is malformed; no dispatch is authorized."]);
  const { proof, preflight, persistence } = parsed.data;
  const requestBlockers = exactProofRequestIdentity(proof, preflight);
  if (requestBlockers.length > 0) return blocked(preflight.status, requestBlockers, persistence);
  if (proof.status !== "proved" || proof.readback === null || proof.outcome === null) {
    return blocked(preflight.status, ["M690 requires complete proved operation evidence."], persistence);
  }
  const persistenceBlockers = exactPersistenceIdentity(proof, persistence);
  if (persistenceBlockers.length > 0) return blocked(preflight.status, persistenceBlockers, persistence);

  return composeStagedInverseExecutorHandoff({
    preflight,
    readback: proof.readback,
    outcome: proof.outcome,
    persistence,
  });
}
