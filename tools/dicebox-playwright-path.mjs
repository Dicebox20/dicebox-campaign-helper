#!/usr/bin/env node

/*
 * Local policy/launch contract for the optional Playwright MCP browser path.
 *
 * This file does not install or start Playwright MCP and never opens a browser.
 * It validates the checked-in template so a later operator setup keeps the
 * browser path separate from the typed DiceBox Foundry relay.
 */

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const PLAYWRIGHT_PATH_PROTOCOL = "dicebox-playwright-browser-path/1";
export const PLAYWRIGHT_MCP_PACKAGE = "@playwright/mcp@latest";
export const PLAYWRIGHT_CONFIG_PATH = "deploy/sqyre-relay/playwright-mcp.config.example.json";
export const PLAYWRIGHT_SERVER_HOST = "127.0.0.1";
export const PLAYWRIGHT_SERVER_PORT = 8931;

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isLoopback(host) {
  return LOOPBACK_HOSTS.has(String(host).replace(/^\[|\]$/g, ""));
}

export function normalizeAllowedOrigin(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "*") throw new Error("Playwright allowed origins must contain an exact origin.");
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error("Playwright allowed origins must be valid URLs.");
  }
  if (!((parsed.protocol === "https:") || (parsed.protocol === "http:" && isLoopback(parsed.hostname)))) {
    throw new Error("Playwright browser targets must use https://, except loopback http:// fixtures.");
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") {
    throw new Error("Playwright browser targets must be origin-only URLs without credentials, paths, queries, or fragments.");
  }
  return `${parsed.protocol}//${parsed.host}`;
}

export function validatePlaywrightPathConfig(config = {}) {
  const failures = [];
  const server = config.server ?? {};
  const network = config.network ?? {};
  const allowedOrigins = Array.isArray(network.allowedOrigins) ? network.allowedOrigins : [];

  if (config.extension !== true) failures.push("extension mode must be enabled for an existing operator-selected browser session");
  if (!isLoopback(server.host)) failures.push("the Playwright MCP HTTP server must bind to loopback");
  if (Number(server.port) !== PLAYWRIGHT_SERVER_PORT) failures.push(`the Playwright MCP HTTP server must use port ${PLAYWRIGHT_SERVER_PORT}`);
  if (allowedOrigins.length === 0) failures.push("at least one exact browser origin is required");
  if (allowedOrigins.some(origin => String(origin).trim() === "*")) failures.push("wildcard browser origins are forbidden");
  for (const origin of allowedOrigins) {
    try { normalizeAllowedOrigin(origin); } catch (error) { failures.push(error.message); }
  }
  if (config.allowUnrestrictedFileAccess !== false) failures.push("unrestricted file access must remain disabled");
  if (!Array.isArray(config.capabilities) || config.capabilities.length !== 1 || config.capabilities[0] !== "core") failures.push("only the core Playwright capability is allowed by this template");
  if (config.sharedBrowserContext !== false) failures.push("shared browser context must remain disabled");
  if (config.browser?.cdpEndpoint || config.browser?.remoteEndpoint || config.browser?.userDataDir) failures.push("the template must not embed a remote browser endpoint or persistent credential path");

  return Object.freeze({
    protocol: PLAYWRIGHT_PATH_PROTOCOL,
    status: failures.length === 0 ? "PASS_LOCAL" : "BLOCKED",
    valid: failures.length === 0,
    server: Object.freeze({ host: server.host ?? null, port: Number(server.port ?? 0) }),
    allowedOrigins: Object.freeze(allowedOrigins.map(origin => {
      try { return normalizeAllowedOrigin(origin); } catch { return String(origin); }
    })),
    browserMode: config.extension === true ? "existing-browser-extension" : "unconfigured",
    noAutomaticAuthentication: true,
    noModuleMutationAuthority: true,
    readyClaim: false,
    blockers: Object.freeze([...new Set(failures)]),
  });
}

export function readPlaywrightPathConfig(path = PLAYWRIGHT_CONFIG_PATH) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function createPlaywrightLaunchPlan({ configPath = PLAYWRIGHT_CONFIG_PATH } = {}) {
  return Object.freeze({
    command: "npx",
    args: [PLAYWRIGHT_MCP_PACKAGE, "--config", configPath],
    transport: "MCP HTTP",
    noInstallPerformed: true,
    noBrowserAttached: true,
    requiresAuthenticatedTunnelForRemoteChatGPT: true,
  });
}

export function checkPlaywrightPathTemplate(path = PLAYWRIGHT_CONFIG_PATH) {
  const config = readPlaywrightPathConfig(path);
  return Object.freeze({
    ...validatePlaywrightPathConfig(config),
    configPath: path,
    launchPlan: createPlaywrightLaunchPlan({ configPath: path }),
  });
}

async function main() {
  const report = checkPlaywrightPathTemplate();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!report.valid) process.exitCode = 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch(error => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}

