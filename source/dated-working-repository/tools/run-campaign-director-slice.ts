import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";
import {
  buildCampaignDirectorResponseRequest,
  reviewCampaignDirectorResponse,
  type DirectorKnowledgeRecord,
} from "../packages/dicebox-director/src/index";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";

const root = resolve(import.meta.dirname, "..");
const receiptPath = resolve(root, "outputs", "m192-campaign-director-live-proposal-receipt.json");
const apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
const model = process.env.DICEBOX_CAMPAIGN_DIRECTOR_MODEL?.trim() || "gpt-5.4-mini";
const python = process.env.DICEBOX_PYTHON?.trim() || "python";

function queryKnowledge(kind: "facts" | "decisions", term: string): DirectorKnowledgeRecord[] {
  const result = JSON.parse(execFileSync(python, [
    resolve(root, "database", "query_knowledge.py"),
    "--database", resolve(root, "database", "dicebox_campaign_helper_knowledge.sqlite"),
    "--kind", kind,
    "--term", term,
    "--limit", "6",
  ], { cwd: root, encoding: "utf8" })) as { rows?: Array<Record<string, unknown>> };
  return (result.rows ?? []).map((row) => ({
    id: String(row.fact_id ?? row.decision_id ?? "unknown"),
    kind: kind === "facts" ? "fact" : "decision",
    text: String(row.statement ?? row.decision ?? ""),
    sourceId: String(row.source_id ?? "unknown"),
  }));
}

async function persist(receipt: Record<string, unknown>, exitCode: number) {
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  process.exitCode = exitCode;
}

async function main() {
  if (!apiKey) {
    await persist({
      operation: "dicebox.campaign-director.live-proposal",
      status: "BLOCKED",
      code: "CREDENTIAL_REQUIRED",
      model,
      credentialConfigured: false,
      receiptPath,
      noWrite: true,
      implicitExecution: false,
      approvalRequired: true,
    }, 2);
    return;
  }

  const knowledge = [
    ...queryKnowledge("facts", "semantic Scene command"),
    ...queryKnowledge("decisions", "Campaign Director"),
  ];
  const intent = "Propose moving dbx:apparatus:core exactly 8 semantic units to the right and 0 vertically. Return exactly one typed Scene command and do not execute it.";
  const request = buildCampaignDirectorResponseRequest({ model, userIntent: intent, document: fixtureScene, knowledge });
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) {
    await persist({
      operation: "dicebox.campaign-director.live-proposal",
      status: "BLOCKED",
      code: "API_ERROR",
      httpStatus: response.status,
      model,
      credentialConfigured: true,
      responseErrorPresent: true,
      secretsReturned: false,
      noWrite: true,
      implicitExecution: false,
      approvalRequired: true,
    }, 2);
    return;
  }

  const review = reviewCampaignDirectorResponse(fixtureScene, payload);
  await persist({
    operation: "dicebox.campaign-director.live-proposal",
    status: review.status,
    model: typeof payload.model === "string" ? payload.model : model,
    responseId: typeof payload.id === "string" ? payload.id : null,
    knowledgeRecordIds: knowledge.map((record) => record.id),
    review,
    credentialConfigured: true,
    secretsReturned: false,
    noWrite: true,
    implicitExecution: false,
    approvalRequired: review.status === "PASS",
  }, review.status === "PASS" ? 0 : 2);
}

main().catch(async (error) => {
  await persist({
    operation: "dicebox.campaign-director.live-proposal",
    status: "BLOCKED",
    code: "CLIENT_ERROR",
    reason: error instanceof Error ? error.message.replace(/sk-[A-Za-z0-9_-]+/g, "[REDACTED]") : "Unknown client error.",
    model,
    credentialConfigured: Boolean(apiKey),
    secretsReturned: false,
    noWrite: true,
    implicitExecution: false,
    approvalRequired: true,
  }, 2);
});
