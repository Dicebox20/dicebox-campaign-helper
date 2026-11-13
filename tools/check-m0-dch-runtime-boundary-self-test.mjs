#!/usr/bin/env node
import assert from "node:assert/strict";
import { createServer } from "node:net";
import { test } from "node:test";
import { checkM0DchRuntimeBoundary, classifyLocalBridge } from "./check-m0-dch-runtime-boundary.mjs";

async function withLocalPort(run) {
  const server = createServer((socket) => socket.destroy());
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  try { await run(server.address().port); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
const source = { moduleId: "dicebox-campaign-helper", entryImportsDchModule: true };

test("closed local bridge never implies active GM or module activation", () => {
  const r = classifyLocalBridge({ source, tcp: { reachable: false }, expectedWorldId: "dbx-test-world", port: 8797 });
  assert.equal(r.localBridge.status, "OFFLINE");
  assert.equal(r.localBridge.authenticatedFoundryGm, "NOT_OBSERVED");
  assert.equal(r.authenticatedFoundryUsers, "NOT_OBSERVED");
  assert.equal(r.m0Acceptance, "NOT_ACCEPTED");
  assert.equal(r.noWorldMutation, true);
});
test("listening port never implies authenticated M0 runtime", () => {
  const r = classifyLocalBridge({ source, tcp: { reachable: true }, expectedWorldId: "dbx-test-world", port: 8797 });
  assert.equal(r.localBridge.status, "PORT_REACHABLE_NO_GM_PROOF");
  assert.equal(r.status, "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN");
  assert.equal(r.localBridge.authenticatedMcpRequest, false);
  assert.equal(r.m0Acceptance, "NOT_ACCEPTED");
});
test("mismatched source entry cannot be marked client-compatible", () => {
  const r = classifyLocalBridge({ source: { ...source, entryImportsDchModule: false }, tcp: { reachable: true }, expectedWorldId: "dbx-test-world", port: 8797 });
  assert.equal(r.localBridge.sourceClientCompatible, false);
  assert.equal(r.m0Acceptance, "NOT_ACCEPTED");
});
test("live local TCP probe records transport but not GM identity", async () => {
  await withLocalPort(async (port) => {
    const r = await checkM0DchRuntimeBoundary({ port, expectedWorldId: "dbx-test-world" });
    assert.equal(r.source.moduleId, "dicebox-campaign-helper");
    assert.match(r.source.manifestSha256, /^[0-9a-f]{64}$/);
    assert.equal(r.source.entryImportsDchModule, true);
    assert.equal(r.localBridge.status, "PORT_REACHABLE_NO_GM_PROOF");
    assert.equal(r.localBridge.expectedWorldId, "dbx-test-world");
    assert.equal(r.runtimeReadback, "NOT_OBSERVED");
    assert.equal(r.m0Acceptance, "NOT_ACCEPTED");
  });
});
test("local source probe distinguishes optional remote gateway from tracked local bridge", async () => {
  await withLocalPort(async (port) => {
    const r = await checkM0DchRuntimeBoundary({ port });
    assert.equal(r.source.optionalRemoteGatewaySourcePresent, false);
    assert.equal(r.source.optionalRemoteGatewayIsRequiredForLocalMcp, false);
    assert.match(r.source.localMcpBridgeHostSha256, /^[0-9a-f]{64}$/);
    assert.match(r.source.moduleBridgeClientSha256, /^[0-9a-f]{64}$/);
  });
});