import { closeSync, existsSync, mkdirSync, openSync } from "node:fs";
import { mkdir, open, readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { spawn, spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import { inspectFoundryLaunch, buildFoundryNodeLaunch } from "./foundry-server.mjs";

const TOOL_VERSION = "1.1.0";
const POLL_MS = 500;
const START_TIMEOUT_MS = 60_000;
const STOP_TIMEOUT_MS = 20_000;
const FORCE_TIMEOUT_MS = 10_000;
const POST_STOP_SETTLE_MS = 2_500;
const LISTENER_DRAIN_TIMEOUT_MS = 10_000;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function sha256(value) {
  return createHash("sha256").update(value).digest("hex").toUpperCase();
}

function isoForPath(value) {
  return value.replaceAll(":", "-").replaceAll(".", "-");
}

function sleep(milliseconds) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
}

function normalizeCommandLine(value) {
  return String(value ?? "").replaceAll("/", "\\").replace(/\s+/g, " ").toLowerCase();
}

export function commandLineMatchesLaunch(commandLine, launch) {
  const normalized = normalizeCommandLine(commandLine);
  if (launch.adminPasswordConfigured === true && !/(^|\s)--adminpassword=\S+/.test(normalized)) return false;
  const required = [
    launch.entryPath,
    `--dataPath=${launch.dataPath}`,
    `--port=${launch.port}`,
  ].map(normalizeCommandLine);
  if (!required.every((part) => normalized.includes(part))) return false;
  if (launch.setupOnly === true) return !/(^|\s)--world=\S+/.test(normalized);
  return normalized.includes(normalizeCommandLine(`--world=${launch.worldId}`));
}

export function defaultFixtureSupervisorConfig(environment = process.env) {
  const dataPath = resolve(environment.DICEBOX_FIXTURE_DATA_PATH ?? join(repoRoot, "work", "foundry-fixture-data-v2"));
  const foundryEntry = resolve(environment.DICEBOX_FOUNDRY_NODE_ENTRY ?? "C:\\Program Files\\Foundry Virtual Tabletop\\resources\\app\\main.js");
  const preferredNode = "C:\\Program Files\\nodejs\\node.exe";
  const nodePath = resolve(environment.DICEBOX_FOUNDRY_NODE_PATH ?? (existsSync(preferredNode) ? preferredNode : process.execPath));
  const controlDirectory = join(dataPath, ".dicebox-supervisor");
  return Object.freeze({
    dataPath,
    worldId: environment.DICEBOX_FIXTURE_WORLD_ID ?? "dbx-test-world",
    setupOnly: environment.DICEBOX_FIXTURE_SETUP_ONLY === "1",
    foundryEntry,
    nodePath,
    port: Number(environment.DICEBOX_FIXTURE_PORT ?? 30001),
    adminPassword: environment.DICEBOX_FIXTURE_ADMIN_PASSWORD ?? null,
    controlDirectory,
    statePath: join(controlDirectory, "state.json"),
    receiptPath: resolve(environment.DICEBOX_FIXTURE_RECEIPT_PATH ?? join(repoRoot, "outputs", "foundry-fixture-supervisor-last-receipt.json")),
    operationLockPath: join(controlDirectory, "operation.json"),
    operationQuarantineDirectory: join(controlDirectory, "operation-quarantine"),
    stdoutPath: join(dataPath, "Logs", "dicebox-fixture-supervisor.stdout.log"),
    stderrPath: join(dataPath, "Logs", "dicebox-fixture-supervisor.stderr.log"),
    lockPath: join(dataPath, "Config", "options.json.lock"),
    quarantineDirectory: join(dataPath, "Config", "dicebox-lock-quarantine"),
  });
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function atomicWriteJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporaryPath, path);
}

function pidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function listeningPids(port) {
  const result = spawnSync("netstat", ["-ano", "-p", "tcp"], { encoding: "utf8", windowsHide: true });
  if (result.status !== 0) return [];
  const matcher = new RegExp(`^\\s*TCP\\s+[^\\s]*:${port}\\s+[^\\s]+\\s+LISTENING\\s+(\\d+)\\s*$`, "i");
  return [...new Set(result.stdout.split(/\r?\n/).map((line) => line.match(matcher)?.[1]).filter(Boolean).map(Number))];
}

function processCommandLine(pid) {
  if (process.platform !== "win32") return null;
  const script = `$p=Get-CimInstance Win32_Process -Filter \"ProcessId = ${pid}\" -ErrorAction Stop; $p.CommandLine | ConvertTo-Json -Compress`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0 || !result.stdout.trim()) return null;
  try {
    return JSON.parse(result.stdout.trim());
  } catch {
    return null;
  }
}

function processIdentity(pid) {
  if (process.platform !== "win32") return null;
  const script = `$p=Get-Process -Id ${pid} -ErrorAction Stop; [pscustomobject]@{path=$p.Path;startedAt=$p.StartTime.ToUniversalTime().ToString('o')} | ConvertTo-Json -Compress`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0 || !result.stdout.trim()) return null;
  try {
    const value = JSON.parse(result.stdout.trim());
    return Object.freeze({
      path: typeof value.path === "string" ? resolve(value.path) : null,
      startedAt: typeof value.startedAt === "string" ? value.startedAt : null,
    });
  } catch {
    return null;
  }
}

function sameTimestamp(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftMs = Date.parse(left);
  const rightMs = Date.parse(right);
  return Number.isFinite(leftMs) && Number.isFinite(rightMs) && leftMs === rightMs;
}

function exactProcessOwnership(receipt) {
  const checks = receipt?.checks;
  return Boolean(
    receipt?.pid
    && checks?.pidAlive === true
    && checks?.stateTargetMatches === true
    && checks?.listenerMatches === true
    && (checks?.commandMatches === true || checks?.fallbackIdentityMatches === true),
  );
}

async function acquireOperationLease(config, action, now) {
  await mkdir(config.controlDirectory, { recursive: true });
  const create = async (recoveredLease = null) => {
    const lease = {
      schemaVersion: 1,
      supervisorVersion: TOOL_VERSION,
      token: randomUUID(),
      ownerPid: process.pid,
      action,
      acquiredAt: now.toISOString(),
    };
    let handle;
    try {
      handle = await open(config.operationLockPath, "wx");
      await handle.writeFile(`${JSON.stringify(lease, null, 2)}\n`, "utf8");
      await handle.sync();
      return { acquired: true, lease, recoveredLease };
    } catch (error) {
      if (error?.code !== "EEXIST") throw error;
      return { acquired: false, lease: await readJson(config.operationLockPath), recoveredLease };
    } finally {
      await handle?.close();
    }
  };

  const first = await create();
  if (first.acquired) return first;
  const holder = first.lease;
  if (!holder || pidAlive(Number(holder.ownerPid))) return first;

  await mkdir(config.operationQuarantineDirectory, { recursive: true });
  const quarantinePath = join(config.operationQuarantineDirectory, `operation-${isoForPath(now.toISOString())}-${holder.token ?? "unknown"}.json`);
  try {
    await rename(config.operationLockPath, quarantinePath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const second = await create({ ...holder, quarantinePath });
  return second;
}

async function releaseOperationLease(config, lease) {
  const current = await readJson(config.operationLockPath);
  if (!current || current.token !== lease.token) return { released: false, reason: "lease-token-mismatch" };
  await unlink(config.operationLockPath);
  return { released: true };
}

async function httpProbe(port, setupOnly = false) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3_000);
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`, { redirect: "manual", signal: controller.signal });
    return Object.freeze({
      ok: response.status === 200 || (response.status === 302 && ["/join", ...(setupOnly ? ["/setup"] : [])].includes(response.headers.get("location"))),
      status: response.status,
      location: response.headers.get("location"),
    });
  } catch (error) {
    return Object.freeze({ ok: false, status: null, location: null, error: error instanceof Error ? error.message : String(error) });
  } finally {
    clearTimeout(timeout);
  }
}

function defaultRuntime() {
  return {
    now: () => new Date(),
    sleep,
    pidAlive,
    listeningPids,
    processCommandLine,
    processIdentity,
    httpProbe,
    readState: (config) => readJson(config.statePath),
    readOperationLease: (config) => readJson(config.operationLockPath),
    writeState: (config, state) => atomicWriteJson(config.statePath, state),
    writeReceipt: (config, receipt) => atomicWriteJson(config.receiptPath, receipt),
    acquireOperationLease,
    releaseOperationLease,
    spawnDetached(config, launch) {
      mkdirSync(dirname(config.stdoutPath), { recursive: true });
      const stdout = openSync(config.stdoutPath, "a");
      const stderr = openSync(config.stderrPath, "a");
      try {
        const child = spawn(launch.nodePath, launch.args, {
          cwd: launch.cwd,
          detached: true,
          windowsHide: true,
          stdio: ["ignore", stdout, stderr],
        });
        child.unref();
        return child.pid;
      } finally {
        closeSync(stdout);
        closeSync(stderr);
      }
    },
    terminate(pid, force = false) {
      if (process.platform === "win32") {
        const args = ["/PID", String(pid), "/T"];
        if (force) args.push("/F");
        const result = spawnSync("taskkill.exe", args, { encoding: "utf8", windowsHide: true });
        return { ok: result.status === 0, status: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim() };
      }
      try {
        process.kill(pid, force ? "SIGKILL" : "SIGTERM");
        return { ok: true, status: 0, stdout: "", stderr: "" };
      } catch (error) {
        return { ok: false, status: 1, stdout: "", stderr: error instanceof Error ? error.message : String(error) };
      }
    },
  };
}

function launchIdentity(config, validate = true) {
  const built = validate ? buildFoundryNodeLaunch(config) : {
    nodePath: resolve(config.nodePath),
    entryPath: resolve(config.foundryEntry),
    cwd: dirname(resolve(config.foundryEntry)),
    args: [
      resolve(config.foundryEntry),
      `--dataPath=${resolve(config.dataPath)}`,
      ...(config.setupOnly ? [] : [`--world=${config.worldId}`]),
      `--port=${config.port}`,
    ],
  };
  return Object.freeze({
    ...built,
    adminPasswordConfigured: typeof config.adminPassword === "string" && config.adminPassword.length > 0,
    dataPath: resolve(config.dataPath),
    worldId: config.worldId,
    setupOnly: config.setupOnly === true,
    port: config.port,
    commandFingerprint: sha256(JSON.stringify({ nodePath: built.nodePath, args: redactLaunchArgs(built.args) })),
  });
}

export function redactLaunchArgs(args) {
  return Object.freeze((Array.isArray(args) ? args : []).map((arg) =>
    typeof arg === "string" && arg.toLowerCase().startsWith("--adminpassword=")
      ? "--adminPassword=[redacted]"
      : arg,
  ));
}

function baseReceipt(operation, config, now) {
  return {
    receiptVersion: 1,
    supervisorVersion: TOOL_VERSION,
    operation,
    target: "disposable-fixture",
    worldId: config.worldId,
    setupOnly: config.setupOnly === true,
    dataPath: config.dataPath,
    port: config.port,
    timestamp: now.toISOString(),
    worldDocumentWrites: 0,
    balladTouched: false,
  };
}

export function createFixtureSupervisor(config = defaultFixtureSupervisorConfig(), runtimeOverrides = {}) {
  const runtime = { ...defaultRuntime(), ...runtimeOverrides };

  async function status() {
    const now = runtime.now();
    const state = await runtime.readState(config);
    const lifecycleOperation = await runtime.readOperationLease(config);
    const listeners = runtime.listeningPids(config.port);
    const receipt = { ...baseReceipt("foundry.fixture.status", config, now), lifecycleOperation };
    if (!state) {
      if (listeners.length > 0) return { ...receipt, status: "BLOCKED", evidenceClass: "unmanaged-listener", listeners, blockers: ["Port is owned by a process not recorded by this supervisor."] };
      return { ...receipt, status: "STOPPED", evidenceClass: "process-state", listeners: [], blockers: [] };
    }
    const pid = Number(state.pid);
    const alive = runtime.pidAlive(pid);
    if (!alive) {
      if (listeners.length > 0) return { ...receipt, status: "BLOCKED", evidenceClass: "pid-mismatch", pid, listeners, state, blockers: ["Recorded PID is dead while another process owns the fixture port."] };
      if (state.status === "stopped") return { ...receipt, status: "STOPPED", evidenceClass: "process-state", pid, listeners: [], state, blockers: [] };
      return { ...receipt, status: "STALE", evidenceClass: "stale-state", pid, listeners: [], state, blockers: [] };
    }
    const commandLine = runtime.processCommandLine(pid);
    const identity = runtime.processIdentity(pid);
    const launch = launchIdentity(config, false);
    const stateAdminPasswordConfigured = state.adminPasswordConfigured === true
      || (Array.isArray(state.args) && state.args.some((arg) => typeof arg === "string" && arg.toLowerCase().startsWith("--adminpassword=")));
    const commandLaunch = { ...launch, adminPasswordConfigured: stateAdminPasswordConfigured };
    const expectedStateArgs = [
      ...launch.args,
      ...(stateAdminPasswordConfigured ? ["--adminPassword=[redacted]"] : []),
    ];
    const stateArgsMatch = Array.isArray(state.args)
      && JSON.stringify(redactLaunchArgs(state.args)) === JSON.stringify(expectedStateArgs);
    const stateFingerprintMatches = state.commandFingerprint === sha256(JSON.stringify({
      nodePath: launch.nodePath,
      args: expectedStateArgs,
    }));
    const stateTargetMatches = state.supervisorVersion === TOOL_VERSION
      && resolve(state.dataPath ?? "") === resolve(config.dataPath)
      && state.worldId === config.worldId
      && (config.setupOnly ? state.setupOnly === true : state.setupOnly !== true)
      && state.port === config.port
      && (stateFingerprintMatches || stateArgsMatch);
    const commandMatches = typeof commandLine === "string" ? commandLineMatchesLaunch(commandLine, commandLaunch) : null;
    const processPathMatches = typeof identity?.path === "string"
      && normalizeCommandLine(identity.path) === normalizeCommandLine(launch.nodePath);
    const processStartMatches = sameTimestamp(identity?.startedAt, state.processStartedAt);
    const fallbackIdentityMatches = commandLine === null && stateTargetMatches && processPathMatches && processStartMatches;
    const processIdentityMatches = commandMatches === true || fallbackIdentityMatches;
    const listenerMatches = listeners.length === 1 && listeners[0] === pid;
    const identityObservationPending = commandLine === null
      && identity === null
      && state.status === "starting"
      && stateTargetMatches
      && listenerMatches;
    if (identityObservationPending) {
      return {
        ...receipt,
        status: "STARTING",
        evidenceClass: "process-starting",
        pid,
        listeners,
        state,
        checks: { pidAlive: alive, commandObserved: false, commandMatches: null, fallbackIdentityMatches: false, stateTargetMatches, processPathMatches: false, processStartMatches: false, listenerMatches },
        blockers: [],
      };
    }
    if (state.status === "starting" && listeners.length === 0 && (commandMatches === true || (commandLine === null && stateTargetMatches && (identity === null || fallbackIdentityMatches)))) {
      return {
        ...receipt,
        status: "STARTING",
        evidenceClass: "process-starting",
        pid,
        listeners,
        state,
        checks: { pidAlive: alive, commandObserved: commandLine !== null, commandMatches, fallbackIdentityMatches, stateTargetMatches, processPathMatches, processStartMatches, listenerMatches: false },
        blockers: [],
      };
    }
    if (!processIdentityMatches || !listenerMatches) {
      return {
        ...receipt,
        status: "BLOCKED",
        evidenceClass: "ownership-mismatch",
        pid,
        listeners,
        state,
        checks: { pidAlive: alive, commandMatches, fallbackIdentityMatches, stateTargetMatches, processPathMatches, processStartMatches, listenerMatches },
        blockers: [!processIdentityMatches ? "Recorded PID cannot be proven as the exact supervisor-created fixture process." : "Recorded PID does not exclusively own the fixture port."],
      };
    }
    const http = await runtime.httpProbe(config.port, config.setupOnly === true);
    if (!http.ok) {
      return { ...receipt, status: "UNKNOWN", evidenceClass: "process-outcome-unknown", pid, listeners, state, http, checks: { pidAlive: alive, commandMatches, fallbackIdentityMatches, stateTargetMatches, processPathMatches, processStartMatches, listenerMatches }, blockers: ["Exact process owns the port but the HTTP readiness probe failed."] };
    }
    return {
      ...receipt,
      status: "PASS",
      evidenceClass: "process-ready",
      pid,
      listeners,
      state,
      http,
      checks: { pidAlive: alive, commandMatches, fallbackIdentityMatches, stateTargetMatches, processPathMatches, processStartMatches, listenerMatches, httpReady: true },
      blockers: [],
    };
  }

  async function persist(receipt) {
    await runtime.writeReceipt(config, receipt);
    return receipt;
  }

  async function withOperation(action, execute) {
    const operationReceipt = baseReceipt(`foundry.fixture.${action}`, config, runtime.now());
    let acquired;
    try {
      acquired = await runtime.acquireOperationLease(config, action, runtime.now());
    } catch (error) {
      return persist({
        ...operationReceipt,
        status: "BLOCKED",
        evidenceClass: "lifecycle-operation-lock-error",
        blockers: [`The fixture lifecycle lease could not be acquired: ${error instanceof Error ? error.message : String(error)}`],
      });
    }
    if (!acquired.acquired) {
      return persist({
        ...operationReceipt,
        status: "BLOCKED",
        evidenceClass: "concurrent-lifecycle-operation",
        lifecycleOperation: acquired.lease,
        blockers: ["Another fixture lifecycle operation owns the supervisor lease; no process action was attempted."],
      });
    }
    let outcome;
    try {
      outcome = await execute();
    } finally {
      let released;
      try {
        released = await runtime.releaseOperationLease(config, acquired.lease);
      } catch (error) {
        released = { released: false, reason: error instanceof Error ? error.message : String(error) };
      }
      if (outcome && !released.released) {
        outcome = {
          ...outcome,
          status: "UNKNOWN",
          evidenceClass: "lifecycle-operation-unknown",
          operationOutcome: outcome.status,
          blockers: [...(outcome.blockers ?? []), "The process action completed, but its supervisor operation lease could not be released."],
        };
      }
      if (outcome) {
        outcome = {
          ...outcome,
          lifecycleLease: {
            action,
            ownerPid: acquired.lease.ownerPid,
            acquiredAt: acquired.lease.acquiredAt,
            recoveredLease: acquired.recoveredLease,
            released: released.released,
          },
        };
      }
    }
    return persist(outcome);
  }

  async function recoverLockUnlocked({ reason = "explicit-recovery" } = {}) {
    const now = runtime.now();
    const current = await status();
    const receipt = baseReceipt("foundry.fixture.recover-lock", config, now);
    if (current.status === "PASS" || current.status === "UNKNOWN" || current.status === "BLOCKED") {
      return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", blockers: ["Lock recovery requires no live or ambiguous fixture owner."], observedStatus: current });
    }
    if (!existsSync(config.lockPath)) return persist({ ...receipt, status: "PASS", evidenceClass: "recovery", recovered: false, blockers: [] });
    const entries = await readdir(config.lockPath);
    if (entries.length > 0) return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", blockers: ["The Foundry lock is not empty and cannot be quarantined automatically."], lockEntries: entries });
    await mkdir(config.quarantineDirectory, { recursive: true });
    const quarantinePath = join(config.quarantineDirectory, `options.json.lock-${isoForPath(now.toISOString())}`);
    await rename(config.lockPath, quarantinePath);
    return persist({ ...receipt, status: "PASS", evidenceClass: "recovery", recovered: true, reason, quarantinePath, blockers: [] });
  }

  async function startUnlocked({ recoverOwnedStaleLock = true } = {}) {
    const before = await status();
    const now = runtime.now();
    const receipt = baseReceipt("foundry.fixture.start", config, now);
    if (before.status === "PASS") {
      if (before.state?.status !== "running") await runtime.writeState(config, { ...before.state, status: "running", readyAt: now.toISOString() });
      return persist({ ...receipt, status: "PASS", evidenceClass: "process-ready", idempotent: true, pid: before.pid, before, blockers: [] });
    }
    if (before.status === "BLOCKED" || before.status === "UNKNOWN") return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", before, blockers: ["Existing fixture ownership/readiness is ambiguous; no launch was attempted."] });

    let recovery = null;
    if (recoverOwnedStaleLock && before.state && (before.status === "STOPPED" || before.status === "STALE")) await runtime.sleep(POST_STOP_SETTLE_MS);
    let guard = inspectFoundryLaunch(config);
    const exactOwnedState = before.state?.supervisorVersion === TOOL_VERSION
      && resolve(before.state?.dataPath ?? "") === resolve(config.dataPath)
      && before.state?.worldId === config.worldId
      && before.state?.port === config.port;
    if (guard.status !== "PASS" && recoverOwnedStaleLock && exactOwnedState && guard.checks?.configLock === "BLOCKED") {
      recovery = await recoverLockUnlocked({ reason: "verified-supervisor-restart" });
      if (recovery.status !== "PASS") return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", before, guard, recovery, blockers: recovery.blockers });
      guard = inspectFoundryLaunch(config);
    }
    if (guard.status !== "PASS") return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", before, guard, recovery, blockers: guard.blockers });

    const launch = launchIdentity(config);
    const pid = runtime.spawnDetached(config, launch);
    let spawnedIdentity = runtime.processIdentity(pid);
    if (!spawnedIdentity) {
      await runtime.sleep(POLL_MS);
      spawnedIdentity = runtime.processIdentity(pid);
    }
    const state = {
      schemaVersion: 1,
      supervisorVersion: TOOL_VERSION,
      status: "starting",
      pid,
      startedAt: now.toISOString(),
      dataPath: config.dataPath,
      worldId: config.worldId,
      setupOnly: config.setupOnly === true,
      port: config.port,
      nodePath: launch.nodePath,
      entryPath: launch.entryPath,
      args: redactLaunchArgs(launch.args),
      adminPasswordConfigured: launch.adminPasswordConfigured,
      commandFingerprint: launch.commandFingerprint,
      processStartedAt: spawnedIdentity?.startedAt ?? null,
      processPath: spawnedIdentity?.path ?? null,
    };
    await runtime.writeState(config, state);
    const deadline = Date.now() + START_TIMEOUT_MS;
    let observed = await status();
    while (observed.status !== "PASS" && Date.now() < deadline) {
      if (observed.status === "BLOCKED" || observed.status === "STALE" || observed.status === "STOPPED") break;
      await runtime.sleep(POLL_MS);
      observed = await status();
    }
    if (observed.status !== "PASS") return persist({ ...receipt, status: "UNKNOWN", evidenceClass: "process-outcome-unknown", idempotent: false, pid, guard, recovery, observed, blockers: ["Launch did not reach an authoritative process-ready reread; inspect status before retry."] });
    const runningState = { ...state, status: "running", readyAt: runtime.now().toISOString() };
    await runtime.writeState(config, runningState);
    return persist({ ...receipt, status: "PASS", evidenceClass: "process-ready", idempotent: false, pid, guard, recovery, observed, blockers: [] });
  }

  async function stopUnlocked() {
    const before = await status();
    const now = runtime.now();
    const receipt = baseReceipt("foundry.fixture.stop", config, now);
    if (before.status === "STOPPED" || before.status === "STALE") {
      if (before.state) await runtime.writeState(config, { ...before.state, supervisorVersion: TOOL_VERSION, status: "stopped", stoppedAt: now.toISOString() });
      return persist({ ...receipt, status: "PASS", evidenceClass: "process-stopped", idempotent: true, before, blockers: [] });
    }
    const exactOwner = before.status === "PASS" || (before.status === "UNKNOWN" && exactProcessOwnership(before));
    if (!exactOwner) return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", before, blockers: ["Exact supervisor ownership was not proven; no process was terminated."] });

    const normal = runtime.terminate(before.pid, false);
    let forced = null;
    const forceRequired = normal.ok === false && /only be terminated forcefully/i.test(normal.stderr ?? "");
    let deadline = Date.now() + (forceRequired ? 0 : STOP_TIMEOUT_MS);
    while (!forceRequired && runtime.pidAlive(before.pid) && Date.now() < deadline) await runtime.sleep(POLL_MS);
    if (runtime.pidAlive(before.pid)) {
      const reread = await status();
      if (!exactProcessOwnership(reread) || reread.pid !== before.pid) return persist({ ...receipt, status: "UNKNOWN", evidenceClass: "process-outcome-unknown", before, normal, reread, blockers: ["Process remained after stop and exact ownership could not be reconfirmed; force stop was refused."] });
      forced = runtime.terminate(before.pid, true);
      deadline = Date.now() + FORCE_TIMEOUT_MS;
      while (runtime.pidAlive(before.pid) && Date.now() < deadline) await runtime.sleep(POLL_MS);
    }
    const listenerDrainStartedAt = Date.now();
    let listenerDrainPolls = 0;
    let remainingListeners = runtime.listeningPids(config.port);
    while (remainingListeners.includes(before.pid) && Date.now() - listenerDrainStartedAt < LISTENER_DRAIN_TIMEOUT_MS) {
      listenerDrainPolls += 1;
      await runtime.sleep(POLL_MS);
      remainingListeners = runtime.listeningPids(config.port);
    }
    const listenerDrain = {
      polls: listenerDrainPolls,
      elapsedMs: Date.now() - listenerDrainStartedAt,
      remainingListeners,
    };
    const after = await status();
    if (runtime.pidAlive(before.pid) || after.status === "BLOCKED" || after.status === "UNKNOWN" || after.status === "PASS") {
      return persist({ ...receipt, status: "UNKNOWN", evidenceClass: "process-outcome-unknown", before, normal, forced, listenerDrain, after, blockers: ["Stop did not produce a clean authoritative stopped reread."] });
    }
    await runtime.writeState(config, { ...before.state, supervisorVersion: TOOL_VERSION, status: "stopped", stoppedAt: runtime.now().toISOString() });
    return persist({ ...receipt, status: "PASS", evidenceClass: "process-stopped", idempotent: false, pid: before.pid, preStopReadiness: before.status, ownershipEvidence: "exact-process-and-exclusive-port", normal, forced, listenerDrain, after, blockers: [] });
  }

  async function restartUnlocked() {
    const stopped = await stopUnlocked();
    const receipt = baseReceipt("foundry.fixture.restart", config, runtime.now());
    if (stopped.status !== "PASS") return persist({ ...receipt, status: "BLOCKED", evidenceClass: "blocked", stopped, blockers: ["Restart stopped because the existing process did not close cleanly."] });
    const started = await startUnlocked({ recoverOwnedStaleLock: true });
    if (started.status !== "PASS") return persist({ ...receipt, status: started.status, evidenceClass: started.evidenceClass, stopped, started, blockers: started.blockers });
    return persist({ ...receipt, status: "PASS", evidenceClass: "process-ready", stopped, started, blockers: [] });
  }

  const start = (options) => withOperation("start", () => startUnlocked(options));
  const stop = () => withOperation("stop", () => stopUnlocked());
  const restart = () => withOperation("restart", () => restartUnlocked());
  const recoverLock = (options) => withOperation("recover-lock", () => recoverLockUnlocked(options));

  return Object.freeze({ status, start, stop, restart, recoverLock });
}

async function main() {
  const action = process.argv[2] ?? "status";
  const config = defaultFixtureSupervisorConfig();
  const supervisor = createFixtureSupervisor(config);
  const method = {
    status: supervisor.status,
    start: supervisor.start,
    open: supervisor.start,
    stop: supervisor.stop,
    close: supervisor.stop,
    restart: supervisor.restart,
    "recover-lock": supervisor.recoverLock,
  }[action];
  if (!method) throw new Error(`Unknown action ${action}. Use open, start, status, close, stop, restart, or recover-lock.`);
  const receipt = await method();
  if (action === "status") await atomicWriteJson(config.receiptPath, receipt);
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status === "BLOCKED") process.exitCode = 2;
  else if (receipt.status === "UNKNOWN") process.exitCode = 3;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
