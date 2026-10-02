import {
  proposalRereadSchema,
  validateProposalBatch,
  type ProposalBatch,
  type ProposalBatchReread,
} from "@dicebox/core";
import { stagedExecutionReceiptSchema, type StagedExecutionReceipt } from "./staged-executor.js";

export interface FoundryTerminalProposalHistoryEvidence {
  readonly schemaVersion: "0.1.0";
  readonly batchId: string;
  readonly batchRevision: number;
  readonly batchSha256: string;
  readonly transition: "commit-after-reread" | "recover-after-reread";
  readonly status: "committed" | "recovered";
  readonly targetAuthority: "foundry-active-gm";
  readonly requiredActiveGm: true;
  readonly stagedReceiptId: string;
  readonly planId: string;
  readonly planSha256: string;
  readonly authoritativeReread: true;
  readonly foreignStatePreserved: true;
  readonly executionAuthority: "staged-executor-only";
  readonly undoRedo: "not-implemented";
}

function assertFoundryBatch(batch: ProposalBatch): void {
  if (batch.producer.kind !== "foundry"
    || batch.reviewAuthority.domain !== "foundry-runtime"
    || batch.targetAuthority.domain !== "foundry-active-gm"
    || !batch.targetAuthority.requiredActiveGm) {
    throw new Error("Only a current-active-GM Foundry proposal batch can receive staged execution evidence.");
  }
}

function assertTerminalReceipt(receipt: StagedExecutionReceipt): asserts receipt is StagedExecutionReceipt & {
  readonly status: "committed" | "recovered";
  readonly authoritativeReread: true;
  readonly unknownOutcome: false;
  readonly foreignStatePreserved: true;
} {
  if ((receipt.status !== "committed" && receipt.status !== "recovered")
    || !receipt.authoritativeReread
    || receipt.unknownOutcome
    || !receipt.foreignStatePreserved) {
    throw new Error("Only terminal, matched-reread staged execution evidence can enter generic history metadata.");
  }
}

function assertMatchedReread(batch: ProposalBatch, receipt: StagedExecutionReceipt, reread: ProposalBatchReread): void {
  if (receipt.planId !== batch.base.targetId || receipt.planSha256 !== batch.base.sha256) {
    throw new Error("Staged execution evidence does not match the reviewed Foundry proposal target or hash.");
  }
  if (reread.status !== "matched" || reread.targetId !== batch.base.targetId || reread.sha256 !== batch.base.sha256) {
    throw new Error("Generic history metadata requires a matched reread of the exact reviewed Foundry plan.");
  }
}

/**
 * Converts already-terminal staged-executor evidence into inspectable generic
 * proposal-history metadata. It does not preview, approve, dispatch, persist,
 * or grant active-GM authority; the staged executor remains the sole executor.
 */
export async function createFoundryTerminalProposalHistoryEvidence(input: {
  readonly batch: unknown;
  readonly receipt: unknown;
  readonly reread: unknown;
}): Promise<FoundryTerminalProposalHistoryEvidence> {
  const batch = await validateProposalBatch(input.batch);
  const receipt = stagedExecutionReceiptSchema.parse(input.receipt);
  const reread = proposalRereadSchema.parse(input.reread);
  assertFoundryBatch(batch);
  assertTerminalReceipt(receipt);
  assertMatchedReread(batch, receipt, reread);
  return {
    schemaVersion: "0.1.0",
    batchId: batch.batchId,
    batchRevision: batch.revision,
    batchSha256: batch.batchSha256,
    transition: receipt.status === "committed" ? "commit-after-reread" : "recover-after-reread",
    status: receipt.status,
    targetAuthority: "foundry-active-gm",
    requiredActiveGm: true,
    stagedReceiptId: receipt.receiptId,
    planId: receipt.planId,
    planSha256: receipt.planSha256,
    authoritativeReread: true,
    foreignStatePreserved: true,
    executionAuthority: "staged-executor-only",
    undoRedo: "not-implemented",
  };
}
