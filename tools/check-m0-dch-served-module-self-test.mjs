#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { checkM0DchServedModule } from "./check-m0-dch-served-module.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const paths = [
  "src/module-byte-attestation.json",
  "src/module.js",
  "src/foundry-live-bridge.js",
];
const prefix = "http://127.0.0.1:30002/modules/dicebox-campaign-helper/";

async function sourceMap() {
  const files = new Map();
  for (const path of paths) {
    files.set(path, await readFile(resolve(root, "packages/dicebox-foundry", path)));
  }
  return files;
}

function fetcher(files, override = {}) {
  return async (url, opts) => {
    assert.equal(opts.method, "GET");
    assert.equal(opts.redirect, "manual");
    assert.equal(url.startsWith(prefix), true);
    assert.equal("headers" in opts, false);
    const path = url.slice(prefix.length);
    assert.ok(paths.includes(path));
    const change = override[path];
    if (change instanceof Error) throw change;
    if (change?.status) return new Response(null, { status: change.status, headers: change.headers });
    const body = change?.body ?? files.get(path);
    return new Response(body, { status: 200, headers: change?.headers ?? {} });
  };
}

test("exact 3 source-pinned served bytes PASS only as static HTTP evidence", async () => {
  const files = await sourceMap();
  const result = await checkM0DchServedModule({ fetchImpl: fetcher(files) });
  assert.equal(result.status, "PASS_STATIC_BYTES_ONLY");
  assert.equal(result.moduleMatchesPinnedSidecar, true);
  assert.equal(result.requestCount, 3);
  assert.deepEqual(result.observations.map(x => x.path), paths);
  assert.ok(result.observations.every(x => x.sourceServedMatch && x.httpStatus === 200));
  assert.equal(result.authenticatedCurrentGm, "NOT_OBSERVED");
  assert.equal(result.loadedModuleExecution, "NOT_OBSERVED");
  assert.equal(result.authenticatedChatGptCaller, "NOT_OBSERVED");
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
  assert.equal(result.worldDocumentWrites, 0);
  assert.equal(result.cookieOrCredentialRead, false);
});

test("a changed served module byte is blocked, even if other files match", async () => {
  const files = await sourceMap();
  const changed = Buffer.from(files.get("src/module.js"));
  changed[0] ^= 1;
  const result = await checkM0DchServedModule({
    fetchImpl: fetcher(files, { "src/module.js": { body: changed } }),
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.moduleMatchesPinnedSidecar, false);
  assert.ok(result.blockers.some(x => x.includes("src/module.js")));
});

test("a changed served sidecar is blocked independently of the module", async () => {
  const files = await sourceMap();
  const changed = Buffer.from(files.get("src/module-byte-attestation.json"));
  changed[0] ^= 1;
  const result = await checkM0DchServedModule({
    fetchImpl: fetcher(files, { "src/module-byte-attestation.json": { body: changed } }),
  });
  assert.equal(result.status, "BLOCKED");
  assert.ok(result.blockers.some(x => x.includes("src/module-byte-attestation.json")));
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
});

test("HTTP redirects are not followed", async () => {
  const files = await sourceMap();
  const result = await checkM0DchServedModule({
    fetchImpl: fetcher(files, {
      "src/module.js": { status: 302, headers: { location: "https://example.net/surprise" } },
    }),
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.observations[1].httpStatus, 302);
  assert.equal(result.observations[1].fetchBlocked, "HTTP_NOT_200");
});

test("oversized responses fail closed", async () => {
  const files = await sourceMap();
  const result = await checkM0DchServedModule({
    fetchImpl: fetcher(files, { "src/module.js": { body: Buffer.alloc(524289) } }),
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.observations[1].fetchBlocked, "RESPONSE_SIZE_OVER_LIMIT");
});

test("offline disposable Foundry reports blocked, not false attestation", async () => {
  const result = await checkM0DchServedModule({
    fetchImpl: async () => { throw new Error("ECONNREFUSED"); },
  });
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.observations.length, 3);
  assert.equal(result.moduleMatchesPinnedSidecar, false);
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
});

test("external base URLs are rejected before any request", async () => {
  let requests = 0;
  await assert.rejects(
    checkM0DchServedModule({
      baseUrl: "http://0.0.0.0:30002",
      fetchImpl: async () => { requests++; throw new Error("unexpected"); },
    }),
    /exact local disposable fixture URL/,
  );
  assert.equal(requests, 0);
});
