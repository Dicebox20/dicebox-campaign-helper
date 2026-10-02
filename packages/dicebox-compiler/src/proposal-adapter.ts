import { createProposalBatch, type ProposalBatch } from "@dicebox/core";
import { validateFoundryIrPlan, verifyFoundryIrPlanHash, type FoundryIrPlan } from "./foundry-ir.js";

export interface FoundryIrProposalBatchInput {
  readonly plan: unknown;
  readonly createdAt: string;
}

function localPart(id: string): string {
  return id.split(":").at(-1) ?? "plan";
}

export async function createFoundryIrProposalBatch(input: FoundryIrProposalBatchInput): Promise<ProposalBatch> {
  const plan: FoundryIrPlan = validateFoundryIrPlan(input.plan);
  if (!(await verifyFoundryIrPlanHash(plan))) throw new Error("Tampered Foundry IR plans cannot become proposal batches.");
  const local = localPart(plan.planId);
  const commandIdByDocument = new Map(plan.dependencyOrder.map((stableId, index) => [stableId, `dbx:proposal-command:${local}-${String(index).padStart(3, "0")}`]));
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: `dbx:proposal:${local}`,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "foundry", sourceId: plan.planId, provider: `foundry-${plan.target.foundryVersion}` },
    reviewAuthority: { domain: "foundry-runtime", requiredRole: "gm" },
    targetAuthority: { domain: "foundry-active-gm", requiredActiveGm: true },
    risk: plan.documents.some((document) => document.operation === "update") ? "critical" : "high",
    base: { targetId: plan.planId, revision: 0, sha256: plan.planSha256 },
    commands: plan.documents.map((document) => ({
      commandId: commandIdByDocument.get(document.stableId)!,
      kind: `foundry.${document.operation}.${document.documentType.toLowerCase()}`,
      dependsOn: document.dependencies.map((dependency) => commandIdByDocument.get(dependency)!).sort(),
      payload: JSON.parse(JSON.stringify(document)) as Record<string, unknown>,
    })),
    createdAt: input.createdAt,
  });
}
