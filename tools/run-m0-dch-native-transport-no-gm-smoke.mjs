#!/usr/bin/env node
/**
 * DCH-only: real native Windows Desktop button against the tracked MCP host.
 * Bounded owner-controlled transport test, NO authenticated GM/module claim.
 * Requires exact reviewed EXE path and SHA; never logs into Foundry or writes.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createConnection } from "node:net";
import { createInterface } from "node:readline";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hostFile = resolve(root, "tools/dicebox-foundry-live-bridge.mjs");
const port = 8797;
const cdpPort = 9249;
const world = "dbx-test-world";
const delay = (milliseconds) => new Promise((done) => setTimeout(done, milliseconds));

function args(values) {
  if (values.length !== 4 || values[0] !== "--exe" || values[2] !== "--sha256" ||
    !/^[a-fA-F0-9]{64}$/.test(values[3] ?? "") ||
    !/^[a-zA-Z]:[\\/]/.test(values[1] ?? "") || !/\.exe$/i.test(values[1])) {
    throw Error("Require --exe <absolute-windows-review-exe> --sha256 <64-hex>.");
  }
  return { path: resolve(values[1]), sha: values[3].toUpperCase() };
}
function tcp(portNumber) {
  return new Promise((done, reject) => {
    const socket = createConnection({ host: "127.0.0.1", port: portNumber });
    let settled = false;
    function finish(value, error) {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else done(value);
    }
    socket.setTimeout(800, () => finish(false, Error("PROBE_TIMEOUT")));
    socket.once("connect", () => finish(true));
    socket.once("error", (error) => error?.code === "ECONNREFUSED" ?
      finish(false) : finish(false, error));
  });
}
async function poll(predicate, attempts = 40, intervalMs = 180) {
  for (let i = 0; i < attempts; i++) {
    if (await predicate()) return true;
    await delay(intervalMs);
  }
  return false;
}
async function stopOwned(child) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([new Promise((done) => child.once("exit", done)), delay(1100)]);
  if (child.exitCode === null && child.signalCode === null && process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      windowsHide: true, timeout: 2800, stdio: "ignore",
    });
    await delay(350);
  }
  if (child.exitCode === null && child.signalCode === null) throw Error("OWNED_CHILD_CLEANUP_UNVERIFIED");
}
async function openCdp() {
  let target;
  const ready = await poll(async () => {
    try {
      const response = await fetch("http://127.0.0.1:" + cdpPort + "/json/list", {
        signal: AbortSignal.timeout(700),
      });
      if (!response.ok) return false;
      const pages = await response.json();
      target = pages.find((page) => page.type === "page" &&
        page.url?.startsWith("http://tauri.localhost/") && page.webSocketDebuggerUrl);
      return Boolean(target);
    } catch { return false; }
  }, 50, 150);
  if (!ready) throw Error("TAURI_WEBVIEW_PAGE_NOT_OBSERVED");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 0;
  ws.addEventListener("message", (event) => {
    try {
      const response = JSON.parse(event.data);
      if (pending.has(response.id)) {
        const callback = pending.get(response.id);
        pending.delete(response.id);
        callback(response);
      }
    } catch {}
  });
  await new Promise((done, reject) => {
    const timer = setTimeout(() => reject(Error("CDP_CONNECTION_TIMEOUT")), 4000);
    ws.addEventListener("open", () => { clearTimeout(timer); done(); }, { once: true });
    ws.addEventListener("error", () => { clearTimeout(timer); reject(Error("CDP_CONNECTION_ERROR")); }, { once: true });
  });
  async function invoke(method, params = {}) {
    const id = ++nextId;
    const result = new Promise((done, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(Error("CDP_CALL_TIMEOUT")); }, 5500);
      pending.set(id, (value) => { clearTimeout(timer); done(value); });
    });
    ws.send(JSON.stringify({ id, method, params }));
    return await result;
  }
  async function evaluate(fn) {
    const response = await invoke("Runtime.evaluate", {
      expression: "(" + fn.toString() + ")()", returnByValue: true,
      awaitPromise: true,
    });
    if (response.error || response.result?.exceptionDetails) throw Error("NATIVE_DOM_EVALUATION_ERROR");
    return response.result?.result?.value;
  }
  await invoke("Runtime.enable");
  return { ws, evaluate };
}
function state() {
  const section = document.querySelector('section[aria-labelledby="dch-foundry-transport-heading"]');
  const button = section && Array.from(section.querySelectorAll("button"))
    .find((item) => item.textContent.includes("Check local DCH MCP port"));
  return {
    origin: location.origin,
    href: location.href,
    native: typeof window.__TAURI_INTERNALS__ === "object",
    panel: Boolean(section),
    button: Boolean(button),
    enabled: button?.disabled === false,
    output: section?.querySelector("output")?.textContent ?? "",
  };
}
function click() {
  const section = document.querySelector('section[aria-labelledby="dch-foundry-transport-heading"]');
  const button = Array.from(section.querySelectorAll("button"))
    .find((item) => item.textContent.includes("Check local DCH MCP port"));
  if (!button || button.disabled) throw Error("DISABLED_OR_MISSING_BUTTON");
  button.click();
  return true;
}
async function run() {
  const executable = args(process.argv.slice(2));
  const binary = await readFile(executable.path);
  assert.equal(createHash("sha256").update(binary).digest("hex").toUpperCase(),
    executable.sha, "EXE_SHA_NOT_MATCHED");
  assert.equal(await tcp(port), false, "LOCAL_HOST_ALREADY_RUNNING_HOLD");
  assert.equal(await tcp(cdpPort), false, "CDP_PORT_ALREADY_USED_HOLD");
  const host = spawn(process.execPath, [hostFile], {
    cwd: root,
    env: {
      ...process.env,
      DICEBOX_MCP_WORLD_ID: world,
      DICEBOX_MCP_BRIDGE_PORT: String(port),
    },
    stdio: ["pipe", "pipe", "pipe"], windowsHide: true,
  });
  let app, cdp;
  const input = createInterface({ input: host.stdout, crlfDelay: Infinity });
  const pendingRpc = new Map();
  const bufferedRpc = new Map();
  input.on("line", (line) => {
    try {
      const reply = JSON.parse(line);
      const callback = pendingRpc.get(reply.id);
      if (callback) {
        pendingRpc.delete(reply.id);
        callback(reply);
      } else bufferedRpc.set(reply.id, reply);
    } catch {}
  });
  function mcp(id, method, params = {}) {
    return new Promise((done, reject) => {
      if (bufferedRpc.has(id)) {
        const prior = bufferedRpc.get(id);
        bufferedRpc.delete(id);
        done(prior);
        return;
      }
      const timer = setTimeout(() => {
        pendingRpc.delete(id);
        reject(Error("MCP_RESPONSE_TIMEOUT"));
      }, 5000);
      pendingRpc.set(id, (reply) => {
        clearTimeout(timer);
        done(reply);
      });
      host.stdin.write(JSON.stringify({
        jsonrpc: "2.0", id, method, params,
      }) + "\n");
    });
  }
  let errors = "";
  host.stderr.on("data", (chunk) => { errors = (errors + chunk).slice(-300); });
  try {
    assert.equal(await poll(() => tcp(port), 40, 150), true,
      "TRACKED_HOST_NEVER_LISTENED_" + errors);
    const initialized = await mcp(1, "initialize", {
      protocolVersion: "2024-11-05", capabilities: {},
      clientInfo: { name: "dch-native-transport-no-gm-smoke", version: "1.0" },
    });
    assert.equal(initialized.result?.serverInfo?.name, "dicebox-foundry-live-bridge");
    const listed = await mcp(2, "tools/list");
    assert.equal(listed.result?.tools?.length, 8);
    const denied = await mcp(3, "tools/call", {
      name: "dbx_foundry_bridge_status", arguments: {},
    });
    assert.equal(denied.result?.isError, true);
    assert.match(JSON.stringify(denied), /No eligible Ballad Gamemaster client is connected/);
    app = spawn(executable.path, [], {
      cwd: dirname(executable.path),
      env: { ...process.env,
        WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS:
          "--remote-debugging-port=" + cdpPort + " --force-renderer-accessibility" },
      stdio: "ignore", windowsHide: false,
    });
    cdp = await openCdp();
    let before;
    const uiReady = await poll(async () => {
      before = await cdp.evaluate(state);
      return before.panel && before.button && before.enabled && before.native;
    }, 45, 190);
    process.stderr.write("DCH native page preflight: " + JSON.stringify(before) + "\n");
    assert.equal(uiReady, true, "NATIVE_DCH_UI_NOT_READY");
    assert.ok(before.href?.startsWith("http://tauri.localhost/"), "Native page href changed.");
    assert.equal(before.native, true);
    assert.equal(before.panel, true);
    assert.equal(before.button, true);
    assert.equal(before.enabled, true);
    assert.match(before.output, /Not checked.*transport-only/);
    assert.equal(await cdp.evaluate(click), true);
    let after;
    const observed = await poll(async () => {
      after = await cdp.evaluate(state);
      return after.output.includes("Default local MCP port responds to TCP") &&
        after.output.includes("NOT VERIFIED") &&
        after.output.includes("no Foundry write");
    }, 35, 200);
    assert.equal(observed, true, "REACHABLE_BUT_UNVERIFIED_UI_RESULT_NOT_OBSERVED");
    assert.equal(await tcp(port), true);
    process.stdout.write(JSON.stringify({
      schemaVersion: "1.0.0",
      operation: "dch.m0.native-desktop-tracked-mcp-transport-no-gm",
      status: "PASS_REACHABLE_TRANSPORT_GM_UNVERIFIED",
      sourceCommit: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
        encoding: "utf8", timeout: 4000, windowsHide: true,
      }).trim(),
      nativeExeSha256: executable.sha,
      exactWorldConfigured: world,
      nativeWebviewDocumentUrl: before.href,
      actualDesktopButtonClicked: true,
      mcpInitialize: "PASS",
      reviewedToolsCount: 8,
      mcpCallWithoutActiveGm: "DENIED",
      nativeDesktopResult: after.output,
      localMcpTcp8797ReachableDuringTest: true,
      authenticatedActiveGmObserved: false,
      chatGptCallerAuthenticated: false,
      loadedDchModuleObserved: false,
      worldWrites: 0,
      m0Acceptance: "NOT_ACCEPTED",
    }) + "\n");
  } finally {
    try { cdp?.ws.close(); } catch {}
    try { if (app) await stopOwned(app); } finally {
      try { host.stdin.end(); } catch {}
      await stopOwned(host);
      input.close();
    }
    const cleaned = await poll(async () => !(await tcp(port)) && !(await tcp(cdpPort)), 25, 140);
    if (!cleaned) throw Error("OWNED_TEST_PORT_LEFT_BOUND");
  }
}
run().catch((error) => {
  process.stderr.write("DCH native tracked-host transport smoke BLOCKED: " +
    String(error?.message ?? error).slice(0,330) + "\n");
  process.exitCode = 1;
});
