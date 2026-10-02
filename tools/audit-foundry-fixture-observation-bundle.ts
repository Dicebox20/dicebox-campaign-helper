import { readFileSync } from "node:fs";
import {
  createBlockedFixtureObservationBundle,
  createFixtureObservationBundle,
} from "@dicebox/core";

const raw = process.stdin.isTTY ? "" : readFileSync(0, "utf8");
let result;
try {
  const input = JSON.parse(raw) as { profile: unknown; receipts: readonly unknown[] };
  result = createFixtureObservationBundle(input);
} catch {
  result = createBlockedFixtureObservationBundle("The input was not a schema-valid fixture-observation bundle.");
}

process.stdout.write(`${JSON.stringify(result.audit, null, 2)}\n`);
if (result.audit.status !== "reviewable") process.exitCode = 2;
