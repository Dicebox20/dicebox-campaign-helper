#!/usr/bin/env node

import { mkdtemp, mkdir, rm, writeFile, copyFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  RECIPE_REGISTRY,
  createConnectorProfile,
} from "./dicebox-foundry-connector-contract.mjs";
import { createOperationInvoker } from "./dicebox-foundry-remote-gateway.mjs";

const repoRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const moduleRoot = resolve(repoRoot, "packages/dicebox-foundry");
const outputPath = resolve(process.env.DICEBOX_CONNECTOR_SMOKE_RECEIPT ?? "outputs/remote-foundry-connector-hardening-smoke-receipt-2026-10-07.json");

function sha256(bytes) { return createHash("sha256").update(bytes).digest("hex").toUpperCase(); }
function assert(condition, message) { if (!condition) throw new Error(message); }

async function main() {
  const sourceProfile = createConnectorProfile({ moduleRoot, expectedWorldId: "dbx-test-world" });
  const stagedRoot = await mkdtemp(join(repoRoot, ".dicebox-connector-stage-"));
  const stagedSrc = join(stagedRoot, "src");
  await mkdir(stagedSrc, { recursive: true });
  try {
    await copyFile(join(moduleRoot, "module.json"), join(stagedRoot, "module.json"));
    await copyFile(join(moduleRoot, sourceProfile.module.entry.path), join(stagedRoot, sourceProfile.module.entry.path));
    const stagedManifest = await readFile(join(stagedRoot, "module.json"));
    const stagedEntry = await readFile(join(stagedRoot, sourceProfile.module.entry.path));
    const stage = {
      status: "PASS",
      manifest: { bytes: stagedManifest.byteLength, sha256: sha256(stagedManifest) },
      entry: { bytes: stagedEntry.byteLength, sha256: sha256(stagedEntry) },
      sourceStageParity: sourceProfile.module.manifest.sha256 === sha256(stagedManifest) && sourceProfile.module.entry.sha256 === sha256(stagedEntry),
    };
    assert(stage.sourceStageParity, "Staged connector artifacts do not match source hashes.");

    const runtimeObservation = Object.freeze({
      schemaVersion: "0.1.0",
      operation: "connector.profile",
      status: "OBSERVED",
      noWrite: true,
      target: { worldId: "dbx-test-world", foundryVersion: sourceProfile.target.foundryVersion, systemId: sourceProfile.target.systemId, systemVersion: sourceProfile.target.systemVersion, exactTargetMatch: true },
      activeGm: { status: "observed", currentUserMatchesActiveGm: true, noPermissionClaim: true, noExecutionAuthority: true },
      profile: { phase: "runtime-probe", foundryVersion: sourceProfile.target.foundryVersion, systemId: sourceProfile.target.systemId, systemVersion: sourceProfile.target.systemVersion, observedAt: "2026-10-07T00:00:00.000Z", activeModuleIds: ["dicebox-campaign-helper"], documentTypes: [], capabilities: [] },
    });
    const invoker = createOperationInvoker({
      getConnection: () => ({ request: async operation => { assert(operation === "connector.profile", `Unexpected fake runtime operation: ${operation}`); return runtimeObservation; } }),
      profileOptions: { moduleRoot, expectedWorldId: "dbx-test-world" },
    });
    const profile = await invoker("connector.profile", {});
    const attestation = await invoker("connector.attestation", {});
    assert(profile.runtime.status === "OBSERVED", "Profile probe did not return the observed runtime profile.");
    assert(attestation.status === "PASS_SOURCE_AND_RUNTIME_PROFILE", "Connector attestation did not pass against the fake exact target.");

    const allowedOperations = new Set(RECIPE_REGISTRY.map(recipe => recipe.operation));
    assert(![...allowedOperations].some(operation => /eval|script|shell|document|socket/i.test(operation)), "Recipe registry contains a broad execution operation.");
    assert(RECIPE_REGISTRY.filter(recipe => recipe.readWrite === "write").every(recipe => recipe.requiresPreviewApproval && recipe.annotations.destructiveHint === true), "Write recipes must require preview approval and carry destructive metadata.");

    const receipt = {
      schemaVersion: "0.1.0",
      operation: "dicebox.connector.build-stage-profile-probe",
      status: "PASS_LOCAL",
      evidenceClass: "local",
      noWrite: true,
      noLiveRuntime: true,
      noPublicDeployment: true,
      source: sourceProfile.module,
      stage,
      profile,
      attestation,
      recipeRegistry: { version: sourceProfile.recipeRegistryVersion, count: RECIPE_REGISTRY.length, operations: [...allowedOperations].sort(), broadExecutionRejected: true, writeRecipesRequirePreviewApproval: true },
      doesNotProve: ["live Foundry connectivity", "browser authentication", "Desktop Commander account binding", "public TLS/OAuth deployment", "native document mutation", "Ready-to-Play"],
    };
    await mkdir(resolve(outputPath, ".."), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    process.stdout.write(`${JSON.stringify({ receiptPath: outputPath, status: receipt.status, sourceStageParity: stage.sourceStageParity, attestation: attestation.status, recipeCount: RECIPE_REGISTRY.length })}\n`);
  } finally {
    await rm(stagedRoot, { recursive: true, force: true });
  }
}

main().catch(error => { process.stderr.write(`Connector smoke failed: ${error.message}\n`); process.exitCode = 1; });
