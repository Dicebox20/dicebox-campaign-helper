import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";
import { applySceneCommand, type SceneCommand } from "./commands.js";
import type { SceneDocument } from "./model.js";

export interface HumanSceneProposalInput {
  readonly batchId: ProposalBatchInput["batchId"];
  readonly document: SceneDocument;
  readonly documentSha256: string;
  readonly command: SceneCommand;
  readonly createdAt: string;
  readonly risk?: ProposalBatchInput["risk"];
}

function payload(command: SceneCommand): Record<string, unknown> {
  return JSON.parse(JSON.stringify(command)) as Record<string, unknown>;
}

function localPart(id: string): string {
  return id.split(":").at(-1) ?? "batch";
}

export async function createHumanSceneProposalBatch(input: HumanSceneProposalInput): Promise<ProposalBatch> {
  if (input.command.origin.kind !== "human") throw new Error("The human Scene adapter accepts only human-origin commands.");
  applySceneCommand(input.document, input.command);
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "human", sourceId: input.command.origin.principalId, provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: input.risk ?? "low",
    base: { targetId: input.document.id, revision: input.document.revision, sha256: input.documentSha256 },
    commands: [{
      commandId: `dbx:proposal-command:${localPart(input.batchId)}-000`,
      kind: `scene.${input.command.kind}`,
      dependsOn: [],
      payload: payload(input.command),
    }],
    createdAt: input.createdAt,
  });
}
