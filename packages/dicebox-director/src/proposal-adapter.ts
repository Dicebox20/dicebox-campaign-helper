import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import type { DirectorReviewReceipt } from "./index.js";

export interface CampaignDirectorProposalBatchInput {
  readonly batchId: ProposalBatchInput["batchId"];
  readonly receipt: DirectorReviewReceipt;
  readonly documentSha256: string;
  readonly provider: string;
  readonly createdAt: string;
}

function localPart(id: string): string {
  return id.split(":").at(-1) ?? "batch";
}

export async function createCampaignDirectorProposalBatch(input: CampaignDirectorProposalBatchInput): Promise<ProposalBatch> {
  if (input.receipt.status !== "PASS") throw new Error(`Blocked Campaign Director review cannot become a proposal batch: ${input.receipt.code}.`);
  if (!input.receipt.noWrite || !input.receipt.approvalRequired) throw new Error("Campaign Director proposals must remain no-write and approval-required.");
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "campaign-director", sourceId: input.receipt.callId, provider: input.provider },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: "medium",
    base: { targetId: input.receipt.documentId, revision: input.receipt.baseRevision, sha256: input.documentSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart(input.batchId)}-000`,
      kind: `scene.${input.receipt.command.kind}`,
      dependsOn: [],
      payload: JSON.parse(JSON.stringify(input.receipt.command)) as Record<string, unknown>,
    }],
    createdAt: input.createdAt,
  });
}
