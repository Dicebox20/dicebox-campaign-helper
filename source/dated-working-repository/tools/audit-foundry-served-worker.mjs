import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WORKER_PATH = "/modules/dicebox-campaign-helper/src/foundry-live-bridge.js";
const DEFAULT_BASE_URL = "http://127.0.0.1:30002";
const DEFAULT_SOURCE_PATH = resolve(repoRoot, "packages/dicebox-foundry/src/foundry-live-bridge.js");
const DEFAULT_SPEC_PATH = resolve(repoRoot, "outputs/m269-current-foundry-artifact-spec-receipt.json");
const DEFAULT_TARGET = Object.freeze({
  dataRoot: "work/foundry-fixture-data-v3",
  worldId: "dbx-test-world",
  foundryVersion: "14.367",
  systemId: "dnd5e",
  systemVersion: "5.3.3",
  port: 30002,
});
const V4_TARGET = Object.freeze({
  dataRoot: "work/foundry-fixture-data-v4",
  worldId: "dbx-test-world",
  foundryVersion: "14.367",
  systemId: "dnd5e",
  systemVersion: "5.3.3",
  port: 30003,
});

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

function blocker(blockers, message) {
  if (!blockers.includes(message)) blockers.push(message);
}

export async function readCanonicalWorkerExpectation(specPath = DEFAULT_SPEC_PATH) {
  const receipt = JSON.parse(await readFile(specPath, "utf8"));
  const artifact = receipt?.canonicalSpecification?.artifacts?.find((entry) => entry?.kind === "worker");
  if (!artifact || typeof artifact.sha256 !== "string") throw new Error("The canonical artifact receipt has no worker SHA-256 expectation.");
  return Object.freeze({
    artifactId: artifact.artifactId ?? null,
    version: artifact.version ?? null,
    sha256: artifact.sha256.toUpperCase(),
    source: artifact.source ?? null,
  });
}

export async function auditServedWorker({
  baseUrl = DEFAULT_BASE_URL,
  sourcePath = DEFAULT_SOURCE_PATH,
  specPath = DEFAULT_SPEC_PATH,
  target = DEFAULT_TARGET,
  fetchImpl = globalThis.fetch,
  observedAt = new Date().toISOString(),
} = {}) {
  if (typeof fetchImpl !== "function") throw new Error("A read-only fetch implementation is required.");
  const normalizedBaseUrl = String(baseUrl).replace(/\/$/, "");
  if (!target || !Number.isInteger(target.port) || target.port <= 0) throw new Error("The served-worker audit requires an exact target port.");
  const expectedBaseUrl = `http://127.0.0.1:${target.port}`;
  if (normalizedBaseUrl !== expectedBaseUrl) throw new Error(`The served-worker audit is restricted to ${expectedBaseUrl}.`);
  const canonical = await readCanonicalWorkerExpectation(specPath);
  const sourceBytes = await readFile(sourcePath);
  const sourceSha256 = sha256(sourceBytes);
  const url = `${normalizedBaseUrl}${WORKER_PATH}`;
  const blockers = [];
  let response = null;
  let servedBytes = null;
  let fetchError = null;
  try {
    response = await fetchImpl(url, { method: "GET", redirect: "manual" });
    servedBytes = new Uint8Array(await response.arrayBuffer());
  } catch (error) {
    fetchError = error instanceof Error ? error.message : String(error);
  }
  if (fetchError) blocker(blockers, `The allowlisted worker request failed: ${fetchError}`);
  const servedSha256 = servedBytes ? sha256(servedBytes) : null;
  const servedByteLength = servedBytes?.byteLength ?? null;
  const sourceServedParity = servedSha256 !== null && servedSha256 === sourceSha256;
  const canonicalParity = servedSha256 !== null && servedSha256 === canonical.sha256;
  if (response && response.status !== 200) blocker(blockers, `The allowlisted worker request returned HTTP ${response.status}, not 200.`);
  if (response && response.status === 200 && !sourceServedParity) blocker(blockers, `Served worker SHA-256 ${servedSha256} differs from source SHA-256 ${sourceSha256}.`);
  if (!canonicalParity) blocker(blockers, `Served worker SHA-256 ${servedSha256 ?? "UNAVAILABLE"} differs from canonical expectation ${canonical.sha256}.`);
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `m262-served-worker-${observedAt.replaceAll(/[^0-9A-Za-z]/g, "")}`,
    operation: "foundry.fixture.served-worker-parity-audit",
    status: blockers.length === 0 ? "PASS" : "BLOCKED",
    evidenceClass: "fixture",
    evidenceLabel: "fixture",
    observedAt,
    target: Object.freeze({
      dataRoot: target.dataRoot,
      worldId: target.worldId,
      foundryVersion: target.foundryVersion,
      systemId: target.systemId,
      systemVersion: target.systemVersion,
      port: target.port,
    }),
    request: Object.freeze({ method: "GET", url, path: WORKER_PATH, allowlisted: true, requestCount: 1 }),
    canonical: Object.freeze(canonical),
    source: Object.freeze({ path: sourcePath, sha256: sourceSha256, byteLength: sourceBytes.byteLength }),
    served: Object.freeze({
      status: response?.status ?? null,
      contentType: response?.headers?.get?.("content-type") ?? null,
      sha256: servedSha256,
      byteLength: servedByteLength,
      sourceServedParity,
      canonicalParity,
    }),
    blockers: Object.freeze(blockers),
    noWrite: true,
    noBrowser: true,
    credentialsEntered: false,
    clientSession: "not-observed",
    moduleExecution: "not-observed",
    activeGm: "not-observed",
    worldDocumentWrites: 0,
    balladTouched: false,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze(["loaded-module-execution", "client-session", "active-gm-authority", "bindings", "behavior", "authoritative-reread", "Stage 9 acceptance"]),
  });
}

async function main() {
  const target = process.env.DICEBOX_SERVED_WORKER_FIXTURE === "v4" ? V4_TARGET : DEFAULT_TARGET;
  const receipt = await auditServedWorker({
    baseUrl: process.env.DICEBOX_SERVED_WORKER_BASE_URL ?? `http://127.0.0.1:${target.port}`,
    target,
    observedAt: process.env.DICEBOX_SERVED_WORKER_OBSERVED_AT ?? new Date().toISOString(),
  });
  const receiptPath = process.env.DICEBOX_SERVED_WORKER_RECEIPT;
  if (receiptPath) await writeFile(resolve(receiptPath), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
