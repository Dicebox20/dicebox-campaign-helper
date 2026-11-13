#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile, access } from "node:fs/promises";
import { createConnection } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BRIDGE_PORT, EXPECTED_WORLD_ID } from "./dicebox-foundry-live-bridge.mjs";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const moduleId = "dicebox-campaign-helper";

async function sourceIdentity(root) {
  const manifestBytes = await readFile(resolve(root, "packages/dicebox-foundry/module.json"));
  const manifest = JSON.parse(manifestBytes.toString("utf8"));
  if (manifest.id !== moduleId) throw new Error("Module ID is not the DCH Foundry package.");
  if (!Array.isArray(manifest.esmodules) || manifest.esmodules.length !== 1) {
    throw new Error("DCH module entrypoint is not uniquely specified.");
  }
  const entrypoint = manifest.esmodules[0];
  if (typeof entrypoint !== "string" || !entrypoint.startsWith("src/")) {
    throw new Error("DCH module entrypoint is not confined to the package.");
  }
  const entryBytes = await readFile(resolve(root, "packages/dicebox-foundry", entrypoint));
  const entry = entryBytes.toString("utf8");
  const importsModule = /^\s*import\s+["']\.\/module\.js(?:\?[^"']*)?["'];?\s*$/.test(entry);
  const hostPath = resolve(root, "tools/dicebox-foundry-live-bridge.mjs");
  const clientPath = resolve(root, "packages/dicebox-foundry/src/foundry-live-bridge.js");
  const host = await readFile(hostPath);
  const client = await readFile(clientPath);
  let optionalRemoteSourcePresent = false;
  try { await access(resolve(root, "tools/dicebox-foundry-remote-gateway.mjs")); optionalRemoteSourcePresent = true; } catch {}
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  return Object.freeze({
    moduleId,
    moduleVersion: String(manifest.version ?? "unknown"),
    entrypoint,
    entryImportsDchModule: importsModule,
    manifestSha256: hash(manifestBytes),
    entrySha256: hash(entryBytes),
    localMcpBridgeHostSha256: hash(host),
    moduleBridgeClientSha256: hash(client),
    optionalRemoteGatewaySourcePresent: optionalRemoteSourcePresent,
    optionalRemoteGatewayIsRequiredForLocalMcp: false,
  });
}

async function probeLocalTcp(port, timeoutMs) {
  return new Promise((done) => {
    let settled = false;
    const socket = createConnection({ host: "127.0.0.1", port });
    function finish(value) {
      if (settled) return;
      settled = true;
      socket.destroy();
      done(value);
    }
    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish({ reachable: true }));
    socket.once("timeout", () => finish({ reachable: false, reason: "TIMEOUT" }));
    socket.once("error", (e) => finish({ reachable: false, reason: e.code ?? "CONNECT_FAILED" }));
  });
}

export function classifyLocalBridge({ source, tcp, expectedWorldId, port }) {
  return Object.freeze({
    schemaVersion: "1.0.0",
    operation: "dch.m0.local-module-bootstrap-boundary",
    status: "BLOCKED_AUTHENTICATED_RUNTIME_NOT_PROVEN",
    evidenceClass: "clean-DCH-source-and-local-TCP-connectivity-only",
    source,
    localBridge: {
      status: tcp.reachable ? "PORT_REACHABLE_NO_GM_PROOF" : "OFFLINE",
      port,
      expectedWorldId,
      loopbackOnly: true,
      authenticatedMcpRequest: false,
      authenticatedFoundryGm: "NOT_OBSERVED",
      sourceClientCompatible: source.entryImportsDchModule,
    },
    authenticatedFoundryUsers: "NOT_OBSERVED",
    moduleEnabledInWorld: "NOT_OBSERVED",
    runtimeReadback: "NOT_OBSERVED",
    credentialsRead: false,
    noWorldMutation: true,
    m0Acceptance: "NOT_ACCEPTED",
    doesNotProve: [
      "ChatGPT MCP attachment or current-caller identity",
      "active Foundry elected-GM session or User collection",
      "enabled module and loaded script identity in exact world",
      "actual desktop-to-module operation or write reread",
      "M0 self-development acceptance",
    ],
  });
}

export async function checkM0DchRuntimeBoundary({ root = sourceRoot, port = BRIDGE_PORT, expectedWorldId = EXPECTED_WORLD_ID, timeoutMs = 1200 } = {}) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid local TCP port.");
  const source = await sourceIdentity(root);
  const tcp = await probeLocalTcp(port, timeoutMs);
  return classifyLocalBridge({ source, tcp, expectedWorldId, port });
}

const invoked = process.argv[1] ? resolve(process.argv[1]) : null;
if (invoked === fileURLToPath(import.meta.url)) {
  checkM0DchRuntimeBoundary().then((report) => {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
    process.exitCode = 2; // no authenticated GM evidence: success must never be inferred from an open port
  }).catch((error) => {
    process.stderr.write("DCH M0 bootstrap preflight cannot run: " + error.message + "\n");
    process.exitCode = 1;
  });
}