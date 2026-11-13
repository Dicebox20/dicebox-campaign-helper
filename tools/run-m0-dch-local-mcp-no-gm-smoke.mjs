#!/usr/bin/env node
/**
 * M0 negative proof against the TRACKED DCH local MCP host, not an optional
 * untracked remote gateway. Uses a fresh ephemeral loopback port and exact
 * disposable world binding; never authenticates a GM or mutates a Foundry world.
 * Transport readiness alone is intentionally non-certifying.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const host = resolve(root, "tools/dicebox-foundry-live-bridge.mjs");
const expectedWorldId = "dbx-test-world";
const timeoutMs = 8000;

async function run() {
  const child = spawn(process.execPath, [host], {
    cwd: root,
    env: {
      ...process.env,
      DICEBOX_MCP_WORLD_ID: expectedWorldId,
      DICEBOX_MCP_BRIDGE_PORT: "0",
    },
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
  });
  const input = createInterface({ input: child.stdout, crlfDelay: Infinity });
  const pending = new Map();
  const observed = new Map();
  let errorDetail = "";
  child.stderr.on("data", (chunk) => { errorDetail = (errorDetail + chunk).slice(-500); });
  input.on("line", (line) => {
    try {
      const value = JSON.parse(line);
      const callback = pending.get(value.id);
      if (callback) { pending.delete(value.id); callback(value); }
      else observed.set(value.id, value);
    } catch {}
  });

  function request(id, method, params = {}) {
    return new Promise((resolveResult, reject) => {
      const prior = observed.get(id);
      if (prior) { observed.delete(id); resolveResult(prior); return; }
      const timer = setTimeout(() => { pending.delete(id); reject(new Error("MCP_RESPONSE_TIMEOUT_" + id)); }, timeoutMs);
      pending.set(id, (result) => { clearTimeout(timer); resolveResult(result); });
      child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
    });
  }

  try {
    await new Promise((resolveResult) => setTimeout(resolveResult, 250));
    assert.equal(child.exitCode, null, "Tracked MCP host exited before initialize: " + errorDetail);
    const init = await request(1, "initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "dch-m0-negative-smoke", version: "1.0" },
    });
    assert.equal(init.result?.serverInfo?.name, "dicebox-foundry-live-bridge");
    const listed = await request(2, "tools/list");
    assert.ok(Array.isArray(listed.result?.tools), "DCH reviewed tools were not listed.");
    const names = listed.result.tools.map((entry) => entry.name);
    assert.equal(names.length, 8, "Unexpected reviewed DCH tool registry size.");
    assert.ok(names.includes("dbx_foundry_bridge_status"), "Read-only bridge status missing.");
    assert.ok(!names.some((name) => /eval|shell|script/i.test(name)), "Unbounded execution operation exposed.");
    const denied = await request(3, "tools/call", {
      name: "dbx_foundry_bridge_status", arguments: {},
    });
    assert.match(JSON.stringify(denied), /No eligible Ballad Gamemaster client is connected/);
    const result = {
      schemaVersion: "1.0.0",
      operation: "dch.m0.local-mcp-no-active-gm-negative-smoke",
      status: "PASS_NEGATIVE_GM_GUARD",
      evidenceClass: "local-stdio-process-ephemeral-loopback",
      expectedWorldId,
      ephemeralWebsocketPort: true,
      mcpInitialize: "PASS",
      reviewedToolsCount: names.length,
      unboundedExecutionToolsExposed: false,
      currentActiveGm: "NOT_OBSERVED",
      bridgeStatus: "BLOCKED_NO_ELIGIBLE_ACTIVE_GM",
      moduleWorldWrites: 0,
      m0Acceptance: "NOT_ACCEPTED",
      doesNotProve: [
        "ChatGPT first-party MCP binding",
        "Authenticated live GM",
        "Enabled DCH Foundry module",
        "GM User collection",
        "DCH development or install readback",
      ],
    };
    process.stdout.write(JSON.stringify(result) + "\n");
  } finally {
    child.stdin.end();
    child.kill("SIGTERM");
    await new Promise((resolveResult) => {
      if (child.exitCode !== null) return resolveResult();
      const timeout = setTimeout(resolveResult, 1600);
      child.once("exit", () => { clearTimeout(timeout); resolveResult(); });
    });
    input.close();
  }
}
run().catch((error) => {
  process.stderr.write("DCH M0 local MCP negative smoke blocked: " + error.message + "\n");
  process.exitCode = 1;
});