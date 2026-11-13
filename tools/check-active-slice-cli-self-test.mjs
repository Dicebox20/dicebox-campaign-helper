#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const checker = resolve(root, "tools/check-active-slice.mjs");
function check(args) {
  const result = spawnSync(process.execPath, [checker, ...args], {
    cwd: root, encoding: "utf8", timeout: 10_000,
  });
  if (result.error) throw result.error;
  assert.ok(result.stdout?.trim(), "Checker must print a JSON result");
  return { exit: result.status, report: JSON.parse(result.stdout) };
}

const defaultRun = check([]);
assert.equal(defaultRun.exit, 0, "No-arg invocation must select the active M0 program card.");
assert.equal(defaultRun.report.status, "PASS");
assert.equal(defaultRun.report.goalId, "O-116");
assert.equal(defaultRun.report.programPriority, "M0");
assert.equal(defaultRun.report.violations.length, 0);

const explicitProgram = check(["docs/ACTIVE-PROGRAM-SLICE.json"]);
assert.equal(explicitProgram.exit, 0);
assert.deepEqual(defaultRun.report, explicitProgram.report,
  "No-arg and explicit canonical program evaluations must agree exactly.");

const retiredTram = check(["docs/ACTIVE-TRAM-SLICE.json"]);
assert.equal(retiredTram.exit, 1);
assert.equal(retiredTram.report.goalId, "O-112");
assert.equal(retiredTram.report.status, "FAIL");
assert.ok(retiredTram.report.violations.length > 0,
  "Retired Tram remains historical and must not be silently promoted.");

process.stdout.write(JSON.stringify({
  operation: "dicebox.workflow.active-slice.cli-self-test",
  status: "PASS",
  cases: 3,
  noArgumentGoal: defaultRun.report.goalId,
  retiredExplicitGoal: retiredTram.report.goalId,
}) + "\n");