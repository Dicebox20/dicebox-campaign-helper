import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import type { CodexTechnicalJobReceipt } from "./index.js";

export interface TechnicalBuilderProposalBatchInput {
  readonly batchId: ProposalBatchInput["batchId"];
  readonly receipt: CodexTechnicalJobReceipt;
  readonly repositoryId: ProposalBatchInput["base"]["targetId"];
  readonly repositoryRevision: number;
  readonly createdAt: string;
}

function localPart(id: string): string {
  return id.split(":").at(-1) ?? "batch";
}

export async function createTechnicalBuilderProposalBatch(input: TechnicalBuilderProposalBatchInput): Promise<ProposalBatch> {
  const receipt = input.receipt;
  if (receipt.status !== "PASS" || receipt.readback === null || !receipt.readback.expectedChecksPassed || receipt.patchItems.length === 0 || receipt.readback.changedPaths.length === 0) {
    throw new Error("Only complete PASS Technical Builder readback receipts can become proposal batches.");
  }
  if (receipt.implicitExecution || receipt.runtimeAuthority || !receipt.reviewRequired) throw new Error("Technical Builder authority boundary is invalid.");
  const local = localPart(input.batchId);
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "technical-builder", sourceId: receipt.jobId, provider: receipt.auth.mode },
    reviewAuthority: { domain: "repository-integration", requiredRole: "reviewer" },
    targetAuthority: { domain: "repository", requiredActiveGm: false },
    risk: "high",
    base: { targetId: input.repositoryId, revision: input.repositoryRevision, sha256: receipt.readback.beforeSha256 },
    commands: receipt.patchItems.map((patchItem, index) => ({
      commandId: `dbx:proposal-command:${local}-${String(index).padStart(3, "0")}`,
      kind: "repository.patch-item",
      dependsOn: [],
      payload: JSON.parse(JSON.stringify(patchItem)) as Record<string, unknown>,
    })),
    createdAt: input.createdAt,
  });
}
