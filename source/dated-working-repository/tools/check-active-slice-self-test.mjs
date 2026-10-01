import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { evaluateActiveSlice } from "./check-active-slice.mjs";

const source = JSON.parse(await readFile("docs/ACTIVE-PROGRAM-SLICE.json", "utf8"));

function evaluate(mutator = () => {}) {
  const card = structuredClone(source);
  mutator(card);
  return evaluateActiveSlice(card);
}

assert.equal(evaluate().status, "PASS", "The current active card must pass.");

assert.equal(evaluate((card) => {
  card.acceptedWorkflowChange.developmentWorkflow.version = "drift";
}).status, "FAIL", "A drifted workflow version must fail.");

assert.equal(evaluate((card) => {
  card.acceptedWorkflowChange.communicationRepository.visibility = "public";
}).status, "FAIL", "A public communication repository must fail.");

assert.equal(evaluate((card) => {
  card.steps[8].id = "utility-harness";
}).status, "FAIL", "Stage-order drift and a standalone Utility Harness must fail.");

const contractDrift = evaluate((card) => {
  const foundation = card.steps[8];
  foundation.allowedScope = "Typed Foundry IR only.";
  foundation.deterministicCheck = "IR tests pass.";
  foundation.liveCheck = "Run one fixture.";
  foundation.stopCondition = "Stop on failure.";
});
assert.equal(contractDrift.status, "FAIL", "A weakened Stage 9 evidence contract must fail.");
for (const violation of [
  "Stage 9 must require asset attestation before dependent document creation.",
  "Stage 9 must derive installer and verifier expectations from one canonical specification.",
  "Stage 9 must block promotion on installed-versus-expected hash drift.",
  "Stage 9 must require GM/player authority and behavior observations.",
]) {
  assert.ok(contractDrift.violations.includes(violation), `Missing expected violation: ${violation}`);
}

process.stdout.write(`${JSON.stringify({ operation: "dicebox.workflow.active-slice.self-test", status: "PASS", cases: 5 })}\n`);
