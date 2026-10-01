import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const WORLD_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const DEFAULT_PORT = 30000;

function blocked(blockers, input = {}, checkOverrides = {}) {
  return Object.freeze({
    receiptVersion: 1,
    operation: "foundry.server.launch-guard",
    status: "BLOCKED",
    evidenceClass: "blocked",
    noDefaultDataPath: true,
    dataPath: typeof input.dataPath === "string" ? resolve(input.dataPath) : null,
    worldId: typeof input.worldId === "string" ? input.worldId : null,
    foundryEntry: typeof input.foundryEntry === "string" ? resolve(input.foundryEntry) : null,
    port: Number.isInteger(input.port) ? input.port : null,
    checks: Object.freeze({
      dataPath: "BLOCKED",
      worldManifest: "NOT_TESTED",
      foundryEntry: "NOT_TESTED",
      port: "NOT_TESTED",
      configLock: "NOT_TESTED",
      ...checkOverrides,
    }),
    blockers: Object.freeze([...blockers]),
    nextGate: "Provide an explicit disposable Foundry data path, world ID, and Node entrypoint; then rerun the guard before launching.",
  });
}

function parseJson(path, label) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(`${label} is not valid JSON.`);
  }
}

function defaultDataPath() {
  const localAppData = process.env.LOCALAPPDATA;
  return localAppData ? resolve(localAppData, "FoundryVTT", "Data") : null;
}

function normalizePort(value) {
  const port = typeof value === "number" ? value : Number(value ?? DEFAULT_PORT);
  return Number.isInteger(port) && port >= 1024 && port <= 65535 ? port : null;
}

/**
 * Validate a Foundry Node-server launch without starting a process.
 * The guard intentionally requires an explicit data path and refuses the
 * normal local Foundry data path so a smoke run cannot silently open a user world.
 */
export function inspectFoundryLaunch(input = {}) {
  const setupOnly = input.setupOnly === true;
  const dataPath = typeof input.dataPath === "string" && input.dataPath.trim().length > 0
    ? resolve(input.dataPath)
    : null;
  const worldId = typeof input.worldId === "string" && WORLD_ID_PATTERN.test(input.worldId)
    ? input.worldId
    : null;
  const foundryEntry = typeof input.foundryEntry === "string" && input.foundryEntry.trim().length > 0
    ? resolve(input.foundryEntry)
    : null;
  const port = normalizePort(input.port);
  const blockers = [];
  const expectedDefault = defaultDataPath();

  if (!dataPath) blockers.push("An explicit disposable dataPath is required.");
  if (dataPath && expectedDefault && dataPath.toLowerCase() === expectedDefault.toLowerCase()) {
    blockers.push("The normal local Foundry data path is forbidden for this launch guard.");
  }
  if (dataPath && parse(dataPath).root === dataPath) blockers.push("A filesystem root cannot be used as a fixture data path.");
  if (!worldId && !setupOnly) blockers.push("A lowercase bounded worldId is required.");
  if (!foundryEntry || !existsSync(foundryEntry)) blockers.push("An existing Foundry Node entrypoint is required.");
  if (!port) blockers.push("The port must be an integer between 1024 and 65535.");

  // Foundry's --dataPath identifies its application-data root. In the
  // desktop layout, package/world user data is stored beneath Data/.
  // Keep this explicit: passing the nested Data directory to Foundry creates
  // a second Data/Data tree and makes an otherwise valid fixture invisible.
  const foundryDataPath = dataPath ? join(dataPath, "Data") : null;
  const worldManifestPath = foundryDataPath && worldId && !setupOnly ? join(foundryDataPath, "worlds", worldId, "world.json") : null;
  // --dataPath is Foundry's application-data root. Runtime configuration and
  // its proper-lockfile directory live directly under <dataPath>/Config,
  // while packages and worlds live beneath <dataPath>/Data.
  const configLockPath = dataPath ? join(dataPath, "Config", "options.json.lock") : null;
  let configLock = "NOT_TESTED";
  if (configLockPath) {
    configLock = existsSync(configLockPath) ? "BLOCKED" : "PASS";
    if (configLock === "BLOCKED") {
      blockers.push(`Foundry configuration lock exists at ${configLockPath}; confirm no active owner and quarantine it before launch.`);
    }
  }
  let worldManifest = null;
  if (worldManifestPath && existsSync(worldManifestPath)) {
    try {
      worldManifest = parseJson(worldManifestPath, "World manifest");
      if (worldManifest.id !== worldId) blockers.push("World manifest identity does not match the requested worldId.");
    } catch (error) {
      blockers.push(error instanceof Error ? error.message : "World manifest is not valid JSON.");
    }
  } else if (worldManifestPath) {
    blockers.push("The selected world manifest does not exist beneath the explicit dataPath.");
  }

  if (blockers.length > 0) return blocked(blockers, input, { configLock });
  return Object.freeze({
    receiptVersion: 1,
    operation: "foundry.server.launch-guard",
    status: "PASS",
    evidenceClass: "deterministic",
    noDefaultDataPath: true,
    dataPath,
    foundryDataPath,
    worldId,
    foundryEntry,
    port,
    setupOnly,
    checks: Object.freeze({ dataPath: "PASS", worldManifest: setupOnly ? "NOT_APPLICABLE" : "PASS", foundryEntry: "PASS", port: "PASS", configLock: "PASS" }),
    observedWorld: worldManifest ? Object.freeze({
      id: worldManifest.id,
      coreVersion: typeof worldManifest.coreVersion === "string" ? worldManifest.coreVersion : null,
      system: typeof worldManifest.system === "string" ? worldManifest.system : null,
      systemVersion: typeof worldManifest.systemVersion === "string" ? worldManifest.systemVersion : null,
    }) : null,
    blockers: Object.freeze([]),
    nextGate: setupOnly
      ? "If a setup-only observation is authorized, launch only with the returned explicit arguments and capture the exact runtime fingerprint."
      : "If a live smoke run is authorized, launch only with the returned explicit arguments and capture the exact runtime fingerprint.",
  });
}

/**
 * @param {{
 *   dataPath?: string;
 *   worldId?: string;
 *   foundryEntry?: string;
 *   nodePath?: string;
 *   port?: number | string;
 *   adminPassword?: string;
 *   setupOnly?: boolean;
 * }} input
 */
export function buildFoundryNodeLaunch(input) {
  const report = inspectFoundryLaunch(input);
  if (report.status !== "PASS") throw new Error(report.blockers.join(" "));
  return Object.freeze({
    nodePath: typeof input.nodePath === "string" && input.nodePath.length > 0 ? resolve(input.nodePath) : process.execPath,
    entryPath: report.foundryEntry,
    cwd: dirname(report.foundryEntry),
    args: Object.freeze([
      report.foundryEntry,
      `--dataPath=${report.dataPath}`,
      ...(report.setupOnly ? [] : [`--world=${report.worldId}`]),
      `--port=${report.port}`,
      ...(typeof input.adminPassword === "string" && input.adminPassword.length > 0 ? ["--adminPassword=" + input.adminPassword] : []),
    ]),
    adminPasswordConfigured: typeof input.adminPassword === "string" && input.adminPassword.length > 0,
    setupOnly: report.setupOnly,
  });
}

export function launchFoundryNode(input) {
  const launch = buildFoundryNodeLaunch(input);
  return spawn(launch.nodePath, launch.args, { cwd: launch.cwd, stdio: "inherit", windowsHide: true });
}

async function main() {
  const input = {
    dataPath: process.env.DICEBOX_FOUNDRY_DATA_PATH,
    worldId: process.env.DICEBOX_FOUNDRY_WORLD_ID,
    foundryEntry: process.env.DICEBOX_FOUNDRY_NODE_ENTRY,
    nodePath: process.env.DICEBOX_FOUNDRY_NODE_PATH,
    port: process.env.DICEBOX_FOUNDRY_PORT ?? DEFAULT_PORT,
    setupOnly: process.env.DICEBOX_FOUNDRY_SETUP_ONLY === "1",
  };
  const report = inspectFoundryLaunch(input);
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "PASS") {
    process.exitCode = 2;
    return;
  }
  if (process.env.DICEBOX_FOUNDRY_LAUNCH_EXECUTE !== "1") return;
  const child = launchFoundryNode(input);
  child.on("exit", (code, signal) => {
    if (signal) process.exitCode = 1;
    else if (typeof code === "number") process.exitCode = code;
  });
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main();
