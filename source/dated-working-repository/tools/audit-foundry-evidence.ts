import { readFileSync } from "node:fs";
import {
  auditFoundryRuntimeEvidence,
  createBlockedFoundryRuntimeEvidenceAudit,
} from "@dicebox/core";

const raw = await readStdin();
let audit;
try {
  audit = auditFoundryRuntimeEvidence(JSON.parse(raw));
} catch {
  audit = createBlockedFoundryRuntimeEvidenceAudit("The input was not a schema-valid read-only Foundry runtime-evidence payload.");
}

process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
if (audit.status !== "reviewable") process.exitCode = 2;

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return "";
  return readFileSync(0, "utf8");
}
