#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ARTIFACTS = Object.freeze({
  adapter: "packages/dicebox-foundry/src/program-scene-vertical-slice.js",
  installer: "packages/dicebox-foundry/src/ascendancy-installer.js",
  package: "packages/dicebox-foundry/ascendancy-campaign-package.json",
  worker: "packages/dicebox-foundry/src/foundry-live-bridge.js",
  module: "packages/dicebox-foundry/src/module.js",
});
const RECEIPTS = Object.freeze({
  m1217: "outputs/m1217-current-foundry-artifact-spec-receipt.json",
  m1259: "outputs/m1259-current-foundry-artifact-spec-receipt.json",
  sidecar: "packages/dicebox-foundry/src/module-byte-attestation.json",
});

export function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

export function assessPinConsistency({ m1217, m1259, sidecar, observed }) {
  const checks = [];
  const add = (id, expected, actual, source) => {
    const pass = typeof expected === "string" && expected.length > 0 && typeof actual === "string" && actual === expected;
    checks.push({ id, source, status: pass ? "PASS" : "DRIFT", expected: expected ?? null, observed: actual ?? null });
  };
  const pin = (receipt, kind) => receipt?.canonicalSpecification?.artifacts?.find((a) => a.kind === kind)?.sha256;
  for (const kind of ["adapter", "installer", "package", "worker"]) {
    add(kind + "-hash-vs-m1259", pin(m1259, kind), observed[kind]?.sha256, ARTIFACTS[kind]);
  }
  add("module-hash-vs-sidecar", sidecar?.moduleSha256, observed.module?.sha256, ARTIFACTS.module);
  add("module-byte-length-vs-sidecar", String(sidecar?.moduleBytes ?? ""), String(observed.module?.bytes ?? ""), ARTIFACTS.module);
  add("sidecar-spec-vs-m1259", m1259?.canonicalSpecification?.specId, sidecar?.specId, RECEIPTS.sidecar);
  add("sidecar-verifier-vs-m1259", m1259?.verifierExpectation?.verifierId, sidecar?.verifierId, RECEIPTS.sidecar);
  add("m1217-to-m1259-package-unchanged", pin(m1217, "package"), pin(m1259, "package"), RECEIPTS.m1259);
  const previousInstaller = pin(m1217, "installer");
  const currentInstaller = pin(m1259, "installer");
  const expectedInstallerRefresh = typeof previousInstaller === "string" && typeof currentInstaller === "string" && previousInstaller !== currentInstaller;
  checks.push({ id: "m1259-installer-refresh-vs-m1217", source: RECEIPTS.m1259, status: expectedInstallerRefresh ? "PASS" : "DRIFT", expected: "distinct predecessor and successor hashes", observed: expectedInstallerRefresh ? "distinct" : "equal-or-missing" });
  const driftCount = checks.filter((check) => check.status === "DRIFT").length;
  return {
    schemaVersion: "1.0.0",
    operation: "dicebox.m0.foundry-pin-consistency",
    status: driftCount ? "BLOCKED" : "CONSISTENT_WITH_SAVED_PINS",
    evidenceClass: "local-source-and-stored-receipts",
    noWrite: true,
    readyClaim: false,
    milestoneAcceptance: "NOT_ACCEPTED",
    doesNotProve: ["historical source intent", "runtime loaded identity", "GM authorization", "disposable Foundry activation", "M0 acceptance"],
    driftCount,
    checks,
  };
}

export async function auditCurrentPinConsistency(root = DEFAULT_ROOT) {
  const readJson = async (path) => JSON.parse(await readFile(resolve(root, path), "utf8"));
  const [m1217, m1259, sidecar] = await Promise.all([
    readJson(RECEIPTS.m1217), readJson(RECEIPTS.m1259), readJson(RECEIPTS.sidecar),
  ]);
  const observed = {};
  for (const [kind, path] of Object.entries(ARTIFACTS)) {
    const bytes = await readFile(resolve(root, path));
    observed[kind] = { sha256: sha256(bytes), bytes: bytes.length };
  }
  return assessPinConsistency({ m1217, m1259, sidecar, observed });
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : null;
if (invoked === fileURLToPath(import.meta.url)) {
  auditCurrentPinConsistency().then((result) => {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    if (result.status !== "CONSISTENT_WITH_SAVED_PINS") process.exitCode = 2;
  }).catch((error) => {
    process.stderr.write("Foundry pin audit could not complete: " + error.message + "\n");
    process.exitCode = 1;
  });
}