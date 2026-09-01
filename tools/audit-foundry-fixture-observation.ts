import { readFileSync } from "node:fs";
import {
  auditFoundryFixtureObservation,
  createBlockedFoundryFixtureObservation,
} from "@dicebox/core";

const raw = process.stdin.isTTY ? "" : readFileSync(0, "utf8");
let audit;
try {
  audit = auditFoundryFixtureObservation(JSON.parse(raw));
} catch {
  audit = createBlockedFoundryFixtureObservation("The input was not a schema-valid read-only Foundry fixture observation receipt.");
}

process.stdout.write(`${JSON.stringify(audit, null, 2)}\n`);
if (audit.status !== "reviewable") process.exitCode = 2;
