import { mkdir, mkdtemp, readdir, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { commandLineMatchesLaunch, createFixtureSupervisor, defaultFixtureSupervisorConfig, redactLaunchArgs } from "../tools/foundry-fixture-supervisor.mjs";

const config = {
  dataPath: "C:\\fixture",
  worldId: "dbx-test-world",
  foundryEntry: "C:\\Foundry\\main.js",
  nodePath: "C:\\Node\\node.exe",
  port: 30001,
  controlDirectory: "C:\\fixture\\.dicebox-supervisor",
  statePath: "C:\\fixture\\.dicebox-supervisor\\state.json",
  receiptPath: "C:\\fixture\\receipt.json",
  operationLockPath: "C:\\fixture\\.dicebox-supervisor\\operation.json",
  operationQuarantineDirectory: "C:\\fixture\\.dicebox-supervisor\\operation-quarantine",
  stdoutPath: "C:\\fixture\\stdout.log",
  stderrPath: "C:\\fixture\\stderr.log",
  lockPath: "C:\\fixture\\Config\\options.json.lock",
  quarantineDirectory: "C:\\fixture\\Config\\quarantine",
};

function launchFingerprint() {
  return createHash("sha256").update(JSON.stringify({
    nodePath: config.nodePath,
    args: [config.foundryEntry, `--dataPath=${config.dataPath}`, `--world=${config.worldId}`, `--port=${config.port}`],
  })).digest("hex").toUpperCase();
}

function harness(initial: { state?: any; alive?: boolean; listeners?: number[]; httpOk?: boolean; commandLine?: string | null; processIdentity?: any | null; processPath?: string; processStartedAt?: string; operationLease?: any; listenerDrainReads?: number } = {}, supervisorConfig = config) {
  let state = initial.state ?? null;
  let alive = initial.alive ?? false;
  let listeners = initial.listeners ?? [];
  let listenerDrainReads = initial.listenerDrainReads ?? null;
  let operationLease = initial.operationLease ?? null;
  const receipts: any[] = [];
  const runtime = {
    now: () => new Date("2026-08-24T12:00:00.000Z"),
    sleep: async () => {},
    pidAlive: () => alive,
    listeningPids: () => {
      if (listenerDrainReads !== null && !alive) {
        if (listenerDrainReads > 0) {
          listenerDrainReads -= 1;
          return listeners;
        }
        listeners = [];
      }
      return listeners;
    },
    processCommandLine: () => initial.commandLine === undefined ? `node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001` : initial.commandLine,
    processIdentity: () => initial.processIdentity === null ? null : ({ path: initial.processPath ?? config.nodePath, startedAt: initial.processStartedAt ?? "2026-08-24T11:59:59.000Z" }),
    httpProbe: async () => ({ ok: initial.httpOk ?? true, status: 302, location: "/join" }),
    readState: async () => state,
    readOperationLease: async () => operationLease,
    writeState: async (_config: unknown, next: any) => { state = next; },
    writeReceipt: async (_config: unknown, receipt: any) => { receipts.push(receipt); },
    acquireOperationLease: async (_config: unknown, action: string) => {
      if (operationLease) return { acquired: false, lease: operationLease };
      operationLease = { token: "test-lease", ownerPid: 100, action, acquiredAt: "2026-08-24T12:00:00.000Z" };
      return { acquired: true, lease: operationLease, recoveredLease: null };
    },
    releaseOperationLease: async (_config: unknown, lease: any) => {
      if (operationLease?.token !== lease.token) return { released: false };
      operationLease = null;
      return { released: true };
    },
    spawnDetached: () => { alive = true; listeners = [4242]; return 4242; },
    terminate: () => {
      alive = false;
      if (listenerDrainReads === null) listeners = [];
      return { ok: true, status: 0, stdout: "", stderr: "" };
    },
  };
  return { supervisor: createFixtureSupervisor(supervisorConfig, runtime), receipts, getState: () => state };
}

describe("Foundry fixture supervisor", () => {
  it("uses Foundry's root Config directory for the runtime lock", () => {
    const resolved = defaultFixtureSupervisorConfig({ DICEBOX_FIXTURE_DATA_PATH: "C:\\fixture-root" } as NodeJS.ProcessEnv);
    expect(resolved.lockPath).toBe("C:\\fixture-root\\Config\\options.json.lock");
    expect(resolved.lockPath).not.toContain("\\Data\\Config\\");
  });

  it("matches only the exact target launch identity", () => {
    const launch = { entryPath: config.foundryEntry, dataPath: config.dataPath, worldId: config.worldId, port: config.port };
    expect(commandLineMatchesLaunch(`node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001`, launch)).toBe(true);
    expect(commandLineMatchesLaunch(`node C:\\Foundry\\main.js --dataPath=C:\\live --world=the-ballad-of-chauser-bill --port=30000`, launch)).toBe(false);
  });

  it("matches setup-only identity only when the world argument is absent", () => {
    const launch = { entryPath: config.foundryEntry, dataPath: config.dataPath, worldId: config.worldId, port: config.port, setupOnly: true };
    expect(commandLineMatchesLaunch(`node C:\\Foundry\\main.js --dataPath=C:\\fixture --port=30001`, launch)).toBe(true);
    expect(commandLineMatchesLaunch(`node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001`, launch)).toBe(false);
  });

  it("requires an administrator marker when the fixture launch is configured for local bootstrap", () => {
    const launch = { entryPath: config.foundryEntry, dataPath: config.dataPath, worldId: config.worldId, port: config.port, adminPasswordConfigured: true };
    expect(commandLineMatchesLaunch("node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001", launch)).toBe(false);
    expect(commandLineMatchesLaunch("node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001 --adminPassword=fixture-secret", launch)).toBe(true);
  });

  it("redacts the administrator argument before it enters supervisor state", () => {
    expect(redactLaunchArgs(["main.js", "--adminPassword=fixture-secret"])).toEqual(["main.js", "--adminPassword=[redacted]"]);
  });

  it("reports stopped when no supervisor state or listener exists", async () => {
    const { supervisor } = harness();
    expect((await supervisor.status()).status).toBe("STOPPED");
  });

  it("keeps an intentionally stopped supervisor state distinct from stale state", async () => {
    const state = { pid: 4242, status: "stopped", supervisorVersion: "1.0.0" };
    const { supervisor, getState } = harness({ state, alive: false, listeners: [] });
    expect((await supervisor.status()).status).toBe("STOPPED");
    expect((await supervisor.stop()).status).toBe("PASS");
    expect(getState().supervisorVersion).toBe("1.1.0");
  });

  it("keeps a stopped fixture stopped when its recorded PID was reused and no listener remains", async () => {
    const state = { pid: 4242, status: "stopped", supervisorVersion: "1.1.0" };
    const { supervisor } = harness({ state, alive: true, listeners: [] });
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("STOPPED");
    expect(receipt.evidenceClass).toBe("process-state");
    expect(receipt.blockers).toEqual([]);
  });

  it("keeps a stopped fixture fail-closed when a listener remains", async () => {
    const state = { pid: 4242, status: "stopped", supervisorVersion: "1.1.0" };
    const { supervisor } = harness({ state, alive: true, listeners: [9999] });
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("BLOCKED");
    expect(receipt.evidenceClass).toBe("ownership-mismatch");
    expect(receipt.checks).toMatchObject({ stoppedState: true, listenerMatches: false });
  });

  it("blocks an unmanaged listener instead of adopting or terminating it", async () => {
    const { supervisor } = harness({ listeners: [9999] });
    const status = await supervisor.status();
    expect(status.status).toBe("BLOCKED");
    expect(status.evidenceClass).toBe("unmanaged-listener");
  });

  it("returns an idempotent start for an already-ready exact fixture", async () => {
    const state = { pid: 4242, status: "running" };
    const { supervisor } = harness({ state, alive: true, listeners: [4242] });
    const receipt = await supervisor.start();
    expect(receipt.status).toBe("PASS");
    expect(receipt.idempotent).toBe(true);
    expect(receipt.pid).toBe(4242);
  });

  it("blocks a competing lifecycle command before any process action", async () => {
    const operationLease = { token: "other", ownerPid: 9999, action: "restart", acquiredAt: "2026-08-24T11:59:00.000Z" };
    const { supervisor } = harness({ operationLease });
    const receipt = await supervisor.start();
    expect(receipt.status).toBe("BLOCKED");
    expect(receipt.evidenceClass).toBe("concurrent-lifecycle-operation");
    expect(receipt.lifecycleOperation).toEqual(operationLease);
  });

  it("uses the supervisor fingerprint plus OS process identity when CIM command-line access is unavailable", async () => {
    const processStartedAt = "2026-08-24T11:59:59.000Z";
    const state = {
      pid: 4242,
      status: "running",
      supervisorVersion: "1.1.0",
      dataPath: config.dataPath,
      worldId: config.worldId,
      port: config.port,
      commandFingerprint: launchFingerprint(),
      processStartedAt,
    };
    const { supervisor } = harness({ state, alive: true, listeners: [4242], commandLine: null, processStartedAt });
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("PASS");
    expect(receipt.checks).toMatchObject({ commandMatches: null, fallbackIdentityMatches: true, processPathMatches: true, processStartMatches: true });
  });

  it("refuses the CIM fallback when the executable identity differs", async () => {
    const processStartedAt = "2026-08-24T11:59:59.000Z";
    const state = {
      pid: 4242,
      status: "running",
      supervisorVersion: "1.1.0",
      dataPath: config.dataPath,
      worldId: config.worldId,
      port: config.port,
      commandFingerprint: launchFingerprint(),
      processStartedAt,
    };
    const { supervisor } = harness({ state, alive: true, listeners: [4242], commandLine: null, processStartedAt, processPath: "C:\\Other\\node.exe" });
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("BLOCKED");
    expect((receipt.checks as any).processPathMatches).toBe(false);
  });

  it("classifies an exact owned process as starting before its listener binds", async () => {
    const state = { pid: 4242, status: "starting" };
    const { supervisor } = harness({ state, alive: true, listeners: [] });
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("STARTING");
    expect(receipt.blockers).toEqual([]);
  });

  it("classifies a configured launch as starting using redacted state before its listener binds", async () => {
    const configuredConfig = { ...config, adminPassword: "fixture-secret" };
    const state = {
      pid: 4242,
      status: "starting",
      supervisorVersion: "1.1.0",
      dataPath: config.dataPath,
      worldId: config.worldId,
      port: config.port,
      args: [config.foundryEntry, "--dataPath=C:\\fixture", "--world=dbx-test-world", "--port=30001", "--adminPassword=[redacted]"],
      commandFingerprint: "legacy-secret-bearing-fingerprint",
    };
    const { supervisor } = harness({
      state,
      alive: true,
      listeners: [],
      commandLine: "node C:\\Foundry\\main.js --dataPath=C:\\fixture --world=dbx-test-world --port=30001 --adminPassword=fixture-secret",
    }, configuredConfig);
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("STARTING");
    expect(receipt.checks).toMatchObject({ stateTargetMatches: true, commandMatches: true });
  });

  it("waits when a starting exact listener is visible before Windows exposes process identity", async () => {
    const configuredConfig = { ...config, adminPassword: "fixture-secret" };
    const state = {
      pid: 4242,
      status: "starting",
      supervisorVersion: "1.1.0",
      dataPath: config.dataPath,
      worldId: config.worldId,
      port: config.port,
      args: [config.foundryEntry, "--dataPath=C:\\fixture", "--world=dbx-test-world", "--port=30001", "--adminPassword=[redacted]"],
      commandFingerprint: "legacy-secret-bearing-fingerprint",
    };
    const { supervisor } = harness({ state, alive: true, listeners: [4242], commandLine: null, processIdentity: null }, configuredConfig);
    const receipt = await supervisor.status();
    expect(receipt.status).toBe("STARTING");
    expect(receipt.evidenceClass).toBe("process-starting");
    expect(receipt.checks).toMatchObject({ stateTargetMatches: true, listenerMatches: true, commandMatches: null });
  });

  it("stops only a supervisor-owned exact listener and rereads stopped state", async () => {
    const state = { pid: 4242, status: "running" };
    const { supervisor, getState } = harness({ state, alive: true, listeners: [4242] });
    const receipt = await supervisor.stop();
    expect(receipt.status).toBe("PASS");
    expect(receipt.idempotent).toBe(false);
    expect(getState().status).toBe("stopped");
  });

  it("stops an exact-owned process when HTTP readiness is UNKNOWN", async () => {
    const state = {
      pid: 4242,
      status: "running",
      supervisorVersion: "1.1.0",
      dataPath: config.dataPath,
      worldId: config.worldId,
      port: config.port,
      commandFingerprint: launchFingerprint(),
      processStartedAt: "2026-08-24T11:59:59.000Z",
    };
    const { supervisor, getState } = harness({ state, alive: true, listeners: [4242], httpOk: false, processStartedAt: "2026-08-24T11:59:59.000Z" });
    const receipt = await supervisor.stop();
    expect(receipt.status).toBe("PASS");
    expect(receipt.preStopReadiness).toBe("UNKNOWN");
    expect(receipt.ownershipEvidence).toBe("exact-process-and-exclusive-port");
    expect(getState().status).toBe("stopped");
  });

  it("waits for a terminated PID to drain from the Windows listener table", async () => {
    const state = { pid: 4242, status: "running" };
    const { supervisor } = harness({ state, alive: true, listeners: [4242], listenerDrainReads: 2 });
    const receipt = await supervisor.stop();
    expect(receipt.status).toBe("PASS");
    expect(receipt.listenerDrain).toMatchObject({ polls: 2, remainingListeners: [] });
  });

  it("quarantines only an empty lock after proving no fixture owner", async () => {
    const root = await mkdtemp(join(tmpdir(), "dbx-supervisor-lock-"));
    const lockPath = join(root, "Config", "options.json.lock");
    await mkdir(lockPath, { recursive: true });
    const tempConfig = {
      ...config,
      dataPath: root,
      controlDirectory: join(root, ".dicebox-supervisor"),
      operationLockPath: join(root, ".dicebox-supervisor", "operation.json"),
      operationQuarantineDirectory: join(root, ".dicebox-supervisor", "operation-quarantine"),
      lockPath,
      quarantineDirectory: join(root, "Config", "quarantine"),
      statePath: join(root, "state.json"),
      receiptPath: join(root, "receipt.json"),
    };
    const isolated = createFixtureSupervisor(tempConfig, {
      now: () => new Date("2026-08-24T12:00:00.000Z"),
      pidAlive: () => false,
      listeningPids: () => [],
      readState: async () => null,
      writeReceipt: async () => {},
    });
    const receipt = await isolated.recoverLock();
    expect(receipt.status).toBe("PASS");
    expect(receipt.recovered).toBe(true);
    await expect(stat(receipt.quarantinePath as string)).resolves.toBeDefined();
  });

  it("recovers a dead supervisor-operation lease without touching a live process", async () => {
    const root = await mkdtemp(join(tmpdir(), "dbx-supervisor-operation-"));
    const controlDirectory = join(root, ".dicebox-supervisor");
    const operationLockPath = join(controlDirectory, "operation.json");
    const operationQuarantineDirectory = join(controlDirectory, "operation-quarantine");
    await mkdir(controlDirectory, { recursive: true });
    await writeFile(operationLockPath, JSON.stringify({ token: "stale", ownerPid: 2147483000, action: "start", acquiredAt: "2026-08-24T11:00:00.000Z" }));
    const tempConfig = {
      ...config,
      dataPath: root,
      port: 39999,
      controlDirectory,
      statePath: join(controlDirectory, "state.json"),
      receiptPath: join(root, "receipt.json"),
      operationLockPath,
      operationQuarantineDirectory,
      lockPath: join(root, "Config", "options.json.lock"),
      quarantineDirectory: join(root, "Config", "quarantine"),
    };
    const isolated = createFixtureSupervisor(tempConfig, {
      listeningPids: () => [],
      processCommandLine: () => null,
      processIdentity: () => null,
    });
    const receipt = await isolated.recoverLock();
    expect(receipt.status).toBe("PASS");
    expect((receipt.lifecycleLease as any).recoveredLease).toMatchObject({ token: "stale", action: "start" });
    expect(await readdir(operationQuarantineDirectory)).toHaveLength(1);
  });
});
