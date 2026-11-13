#!/usr/bin/env node
/**
 * DCH M0 STATIC served-byte boundary only. This is NOT an active-GM,
 * loaded-module, or ChatGPT authentication verifier. Fixed local fixture URL,
 * three allowlisted GET requests, no cookies, no credentials, no writes.
 */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const base = "http://127.0.0.1:30002";
const prefix = "/modules/dicebox-campaign-helper/";
const entries = Object.freeze([
  { path: "src/module-byte-attestation.json", maxBytes: 16384 },
  { path: "src/module.js", maxBytes: 524288 },
  { path: "src/foundry-live-bridge.js", maxBytes: 262144 },
]);

const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function readBounded(response, maxBytes) {
  if (response.status !== 200) return null;
  const length = response.headers.get("content-length");
  if (length !== null && (Number(length) > maxBytes || Number(length) < 0)) {
    throw new Error("RESPONSE_SIZE_OVER_LIMIT");
  }
  if (!response.body) throw new Error("RESPONSE_BODY_MISSING");
  const chunks = [];
  let size = 0;
  const reader = response.body.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) throw new Error("RESPONSE_SIZE_OVER_LIMIT");
      chunks.push(value);
    }
  } finally {
    reader.cancel().catch(() => {});
  }
  return Buffer.concat(chunks, size);
}

function parsePinnedSidecar(bytes) {
  const value = JSON.parse(bytes.toString("utf8"));
  if (
    value?.packageId !== "dicebox-campaign-helper" ||
    value?.modulePath !== "src/module.js" ||
    !/^[0-9a-f]{64}$/.test(value.moduleSha256) ||
    !Number.isSafeInteger(value.moduleBytes) ||
    value.moduleBytes <= 0
  ) throw new Error("SOURCE_SIDECAR_INVALID");
  return { moduleSha256: value.moduleSha256, moduleBytes: value.moduleBytes };
}

export async function checkM0DchServedModule({
  fetchImpl = globalThis.fetch,
  baseUrl = base,
  sourceRoot = root,
} = {}) {
  if (baseUrl !== base) throw new Error("DCH M0 probe allows only the exact local disposable fixture URL.");
  if (typeof fetchImpl !== "function") throw new Error("Read-only fetch implementation required.");
  const source = new Map();
  for (const entry of entries) {
    source.set(entry.path, await readFile(resolve(sourceRoot, "packages/dicebox-foundry", entry.path)));
  }
  const pinned = parsePinnedSidecar(source.get("src/module-byte-attestation.json"));
  const moduleSource = source.get("src/module.js");
  const sourcePinned = moduleSource.byteLength === pinned.moduleBytes && hash(moduleSource) === pinned.moduleSha256;

  const observations = [];
  const blockers = [];
  if (!sourcePinned) blockers.push("SOURCE_MODULE_DOES_NOT_MATCH_FIXED_SIDECAR");

  for (const entry of entries) {
    const url = base + prefix + entry.path;
    const expected = source.get(entry.path);
    let status = null;
    let servedBytes = null;
    let fetchBlocked = null;
    try {
      const response = await fetchImpl(url, {
        method: "GET", redirect: "manual", signal: AbortSignal.timeout(6000),
      });
      status = response.status;
      if (status === 200) servedBytes = await readBounded(response, entry.maxBytes);
      else fetchBlocked = "HTTP_NOT_200";
    } catch (error) {
      fetchBlocked = error?.message === "RESPONSE_SIZE_OVER_LIMIT" ? "RESPONSE_SIZE_OVER_LIMIT" : "FETCH_UNAVAILABLE";
    }
    const sourceSha256 = hash(expected);
    const servedSha256 = servedBytes ? hash(servedBytes) : null;
    const matchesSource = servedSha256 !== null && servedSha256 === sourceSha256;
    if (!matchesSource) blockers.push("SERVED_SOURCE_MISMATCH_OR_UNAVAILABLE:" + entry.path);
    observations.push(Object.freeze({
      path: entry.path,
      requestMethod: "GET",
      httpStatus: status,
      byteLength: servedBytes?.byteLength ?? null,
      servedSha256,
      sourceSha256,
      sourceServedMatch: matchesSource,
      fetchBlocked,
    }));
  }
  const servedModule = observations.find((o) => o.path === "src/module.js");
  const servedPinned = sourcePinned
    && servedModule?.servedSha256 === pinned.moduleSha256
    && servedModule?.byteLength === pinned.moduleBytes;
  if (!servedPinned) blockers.push("SERVED_MODULE_PINNED_SIDECAR_UNVERIFIED");

  return Object.freeze({
    schemaVersion: "1.0.0",
    operation: "dch.m0.disposable-v3.static-served-byte-check",
    status: blockers.length === 0 ? "PASS_STATIC_BYTES_ONLY" : "BLOCKED",
    evidenceClass: "local-HTTP-static-artifact",
    target: { url: base, expectedWorldId: "dbx-test-world", worldIdentityObserved: false },
    sourceSidecar: { ...pinned, matchesSource: sourcePinned },
    moduleMatchesPinnedSidecar: servedPinned,
    observations,
    blockers,
    requestCount: 3,
    requestScope: "three-allowlisted-loopback-GET",
    cookieOrCredentialRead: false,
    worldDocumentWrites: 0,
    authenticatedCurrentGm: "NOT_OBSERVED",
    loadedModuleExecution: "NOT_OBSERVED",
    authenticatedChatGptCaller: "NOT_OBSERVED",
    m0Acceptance: "NOT_ACCEPTED",
    doesNotProve: [
      "browser-loaded module or elected GM session",
      "Foundry User id/name/role collection",
      "active exact-world GM role or WebSocket caller authority",
      "ChatGPT-bound authenticated MCP tool execution",
      "DCH desktop-to-module runtime interaction",
      "M0 self-development acceptance",
    ],
  });
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : null;
if (invoked === fileURLToPath(import.meta.url)) {
  checkM0DchServedModule().then((result) => {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    if (result.status !== "PASS_STATIC_BYTES_ONLY") process.exitCode = 2;
  }).catch((error) => {
    process.stderr.write("DCH static served-module check unavailable: " + error.message + "\n");
    process.exitCode = 1;
  });
}
