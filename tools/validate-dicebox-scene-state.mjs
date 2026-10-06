import { readFile } from "node:fs/promises";

export const STATE_CONTRACT = "dicebox-scene-automation-state/v1";

const STAGES = new Set([
  "PREPARED",
  "RENDERED",
  "INSPECTED_PASS",
  "INSPECTED_REDO",
  "APPROVED",
  "BUILT",
  "STAGED",
  "INJECTED",
  "VERIFIED",
  "COMPLETE",
  "BLOCKED",
  "FAILED"
]);

const SHA256 = /^[A-Fa-f0-9]{64}$/;
const STABLE_ID = /^[A-Za-z0-9]{16}$/;

function present(value) {
  return value !== null && value !== undefined && value !== "";
}

function requireSha(violations, value, label) {
  if (!present(value) || !SHA256.test(String(value))) {
    violations.push(`${label} must be a 64-character SHA-256.`);
  }
}

export function validateDiceboxSceneState(state) {
  const violations = [];

  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return { status: "FAIL", contract: STATE_CONTRACT, violations: ["State must be one JSON object."] };
  }

  if (state.contract !== STATE_CONTRACT) {
    violations.push(`contract must be ${STATE_CONTRACT}.`);
  }

  if (!present(state.sceneKey)) violations.push("sceneKey is required.");
  if (!present(state.sceneName)) violations.push("sceneName is required.");
  if (!STAGES.has(state.stage)) violations.push("stage is invalid.");

  if (!Number.isInteger(state.renderAttempt) || state.renderAttempt < 0) {
    violations.push("renderAttempt must be a non-negative integer.");
  }

  for (const [label, value] of [
    ["stableSceneId", state.stableSceneId],
    ["stableArrivalRegionId", state.stableArrivalRegionId]
  ]) {
    if (present(value) && !STABLE_ID.test(String(value))) {
      violations.push(`${label} must be a 16-character Foundry ID when present.`);
    }
  }

  const stage = state.stage;

  if (["RENDERED","INSPECTED_PASS","INSPECTED_REDO","APPROVED","BUILT","STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.render || typeof state.render !== "object") {
      violations.push(`${stage} requires render evidence.`);
    } else {
      if (!present(state.render.generationId) && !present(state.render.sha256)) {
        violations.push("Render evidence requires generationId or sha256.");
      }
      if (present(state.render.sha256) && !SHA256.test(String(state.render.sha256))) {
        violations.push("render.sha256 is invalid.");
      }
    }
  }

  if (["INSPECTED_PASS","INSPECTED_REDO","APPROVED","BUILT","STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.inspection || typeof state.inspection !== "object") {
      violations.push(`${stage} requires inspection evidence.`);
    } else {
      if (stage === "INSPECTED_REDO" && state.inspection.verdict !== "REDO") {
        violations.push("INSPECTED_REDO requires inspection.verdict REDO.");
      }
      if (["INSPECTED_PASS","APPROVED","BUILT","STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage) && state.inspection.verdict !== "PASS") {
        violations.push(`${stage} requires inspection.verdict PASS.`);
      }
      if (Number.isInteger(state.inspection.renderAttempt) && state.inspection.renderAttempt !== state.renderAttempt) {
        violations.push("inspection.renderAttempt must match renderAttempt.");
      }
      if (
        present(state.inspection.generationId) &&
        present(state.render?.generationId) &&
        state.inspection.generationId !== state.render.generationId
      ) {
        violations.push("inspection generationId must match the active render.");
      }
      if (
        present(state.inspection.sha256) &&
        present(state.render?.sha256) &&
        state.inspection.sha256.toLowerCase() !== state.render.sha256.toLowerCase()
      ) {
        violations.push("inspection sha256 must match the active render.");
      }
    }
  }

  if (["APPROVED","BUILT","STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.approval || typeof state.approval !== "object") {
      violations.push(`${stage} requires approval evidence.`);
    } else {
      if (
        present(state.approval.generationId) &&
        present(state.render?.generationId) &&
        state.approval.generationId !== state.render.generationId
      ) {
        violations.push("approval generationId must match the active render.");
      }
      if (
        present(state.approval.sha256) &&
        present(state.render?.sha256) &&
        state.approval.sha256.toLowerCase() !== state.render.sha256.toLowerCase()
      ) {
        violations.push("approval sha256 must match the active render.");
      }
    }
  }

  if (["BUILT","STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.build || typeof state.build !== "object") {
      violations.push(`${stage} requires build evidence.`);
    } else {
      requireSha(violations, state.build.sha256, "build.sha256");
      if (state.build.validatorStatus !== "PASS") {
        violations.push(`${stage} requires build.validatorStatus PASS.`);
      }
    }
  }

  if (["STAGED","INJECTED","VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.job || typeof state.job !== "object") {
      violations.push(`${stage} requires job evidence.`);
    } else {
      if (!present(state.job.jobId)) violations.push("job.jobId is required.");
      if (!present(state.job.requestId)) violations.push("job.requestId is required.");
    }
  }

  if (["VERIFIED","COMPLETE"].includes(stage)) {
    if (!state.receipt || typeof state.receipt !== "object") {
      violations.push(`${stage} requires a Foundry receipt.`);
    } else {
      if (!["READY","READY_WITH_WARNINGS"].includes(state.receipt.status)) {
        violations.push(`${stage} requires receipt.status READY or READY_WITH_WARNINGS.`);
      }
      requireSha(violations, state.receipt.buildSha256, "receipt.buildSha256");
      if (
        present(state.build?.sha256) &&
        present(state.receipt.buildSha256) &&
        state.build.sha256.toLowerCase() !== state.receipt.buildSha256.toLowerCase()
      ) {
        violations.push("receipt.buildSha256 must match build.sha256.");
      }
    }
  }

  if (stage === "COMPLETE" && Array.isArray(state.blockers) && state.blockers.length) {
    violations.push("COMPLETE state cannot contain blockers.");
  }

  if (!Array.isArray(state.history)) {
    violations.push("history must be an array.");
  }

  return {
    status: violations.length ? "FAIL" : "PASS",
    contract: STATE_CONTRACT,
    sceneKey: state.sceneKey ?? null,
    stage: state.stage ?? null,
    violations
  };
}

async function main() {
  const path = process.argv[2];
  if (!path) {
    process.stderr.write("Usage: node tools/validate-dicebox-scene-state.mjs <state.json>\n");
    process.exitCode = 2;
    return;
  }

  let state;
  try {
    state = JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 2;
    return;
  }

  const result = validateDiceboxSceneState(state);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  if (result.status !== "PASS") process.exitCode = 1;
}

if (process.argv[1]?.endsWith("validate-dicebox-scene-state.mjs")) {
  await main();
}
