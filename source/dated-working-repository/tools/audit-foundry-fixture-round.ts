import { readFileSync } from "node:fs";
import {
  auditFoundryFixtureRoundEvidence,
  createBlockedFoundryFixtureRoundEvidence,
} from "@dicebox/core";

const raw = process.stdin.isTTY ? "" : readFileSync(0, "utf8");
let result;
try {
  const input = JSON.parse(raw) as {
    profile: unknown;
    receipts: readonly unknown[];
    artifacts: readonly unknown[];
    artifactBindings: readonly unknown[];
  };
  result = auditFoundryFixtureRoundEvidence(input);
} catch {
  result = createBlockedFoundryFixtureRoundEvidence("The input was not a schema-valid Foundry fixture evidence package.");
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (result.status !== "reviewable") process.exitCode = 2;
