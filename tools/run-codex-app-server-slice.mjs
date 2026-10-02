import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const codexEntry = resolve(root, "node_modules", "@openai", "codex", "bin", "codex.js");
const mode = process.argv[2] ?? "probe";
const isolatedCwd = resolve(root, "work", "dicebox-codex-job-m192");
const expectedPath = resolve(isolatedCwd, "fixture-note.txt");
const receiptPath = resolve(root, "outputs", "m192-codex-technical-job-receipt.json");
const child = spawn(process.execPath, [codexEntry, "app-server", "--stdio"], {
  cwd: root,
  stdio: ["pipe", "pipe", "pipe"],
  windowsHide: true,
});

let nextId = 0;
const pending = new Map();
const events = [];
let completedResolve;
const completed = new Promise((resolvePromise) => { completedResolve = resolvePromise; });

function write(message) {
  child.stdin.write(`${JSON.stringify(message)}\n`);
}

function request(method, params) {
  const id = nextId++;
  write({ method, id, params });
  return new Promise((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      rejectPromise(new Error(`${method} timed out.`));
    }, 30_000);
    pending.set(id, { resolve: resolvePromise, reject: rejectPromise, timer });
  });
}

function safeAccount(result) {
  const account = result?.account ?? result ?? {};
  return {
    authMode: account.authMode ?? account.type ?? result?.authMode ?? null,
    planType: account.planType ?? result?.planType ?? null,
    emailPresent: typeof account.email === "string" && account.email.length > 0,
    requiresOpenaiAuth: result?.requiresOpenaiAuth ?? null,
  };
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function snapshotDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const snapshot = new Map();
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (!entry.isFile()) throw new Error(`Unexpected non-file artifact in isolated job directory: ${entry.name}`);
    const path = resolve(directory, entry.name);
    snapshot.set(path, sha256(await readFile(path)));
  }
  return snapshot;
}

function diffSnapshots(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()]);
  return [...paths].filter((path) => before.get(path) !== after.get(path)).sort();
}

function approvalWithinJob(message) {
  const params = message.params ?? {};
  const serialized = JSON.stringify(params);
  if (/foundry|localhost:3000[01]|ballad/i.test(serialized)) return false;
  if (message.method === "item/fileChange/requestApproval") {
    const grantRoot = typeof params.grantRoot === "string" ? resolve(params.grantRoot) : isolatedCwd;
    return grantRoot === isolatedCwd;
  }
  if (message.method === "item/commandExecution/requestApproval") {
    const cwd = typeof params.cwd === "string" ? resolve(params.cwd) : "";
    return cwd === isolatedCwd;
  }
  return false;
}

const stdout = createInterface({ input: child.stdout });
stdout.on("line", (line) => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (message.id !== undefined && (message.result !== undefined || message.error !== undefined)) {
    const waiter = pending.get(message.id);
    if (waiter) {
      clearTimeout(waiter.timer);
      pending.delete(message.id);
      if (message.error) waiter.reject(new Error(`${message.error.code}: ${message.error.message}`));
      else waiter.resolve(message.result);
      return;
    }
  }
  events.push(message);
  if (typeof message.method === "string" && message.method.endsWith("requestApproval") && message.id !== undefined) {
    const decision = mode === "job" && approvalWithinJob(message) ? "accept" : "decline";
    write({ id: message.id, result: { decision } });
  }
  if (message.method === "turn/completed") completedResolve(message.params ?? {});
});

const stderr = [];
const stderrReader = createInterface({ input: child.stderr });
stderrReader.on("line", (line) => stderr.push(line));

function shutdown() {
  stdout.close();
  stderrReader.close();
  child.stdin.end();
  if (!child.killed) child.kill();
}

async function main() {
  const initialize = await request("initialize", {
    clientInfo: { name: "dicebox_campaign_helper", title: "DiceBox Campaign Helper", version: "0.1.0" },
  });
  write({ method: "initialized", params: {} });
  const account = await request("account/read", { refreshToken: false });
  if (mode === "probe") {
    return {
      operation: "dicebox.codex.app-server.probe",
      status: "PASS",
      initialized: true,
      server: {
        userAgent: initialize?.userAgent ?? null,
        platformFamily: initialize?.platformFamily ?? null,
        platformOs: initialize?.platformOs ?? null,
      },
      account: safeAccount(account),
      secretsReturned: false,
      noWrite: true,
    };
  }
  if (mode !== "job") throw new Error(`Unknown mode: ${mode}`);
  const accountSummary = safeAccount(account);
  if (!accountSummary.authMode) throw new Error("Codex App Server has no authenticated account.");
  await mkdir(isolatedCwd, { recursive: true });
  await writeFile(expectedPath, "PENDING\n", "utf8");
  const before = await snapshotDirectory(isolatedCwd);
  if (before.size !== 1 || !before.has(expectedPath)) throw new Error("Isolated job setup contains unexpected artifacts.");
  const threadResult = await request("thread/start", {
    cwd: isolatedCwd,
    approvalPolicy: "on-request",
    sandbox: "workspace-write",
    serviceName: "dicebox_campaign_helper",
    ephemeral: true,
  });
  const threadId = threadResult?.thread?.id;
  if (typeof threadId !== "string") throw new Error("Codex App Server did not return a thread ID.");
  const turnResult = await request("turn/start", {
    threadId,
    cwd: isolatedCwd,
    approvalPolicy: "on-request",
    sandboxPolicy: {
      type: "workspaceWrite",
      writableRoots: [isolatedCwd],
      networkAccess: false,
      excludeTmpdirEnvVar: false,
      excludeSlashTmp: false,
    },
    input: [{
      type: "text",
      text: [
        "This is a bounded DiceBox technical-builder acceptance job.",
        `Edit only ${expectedPath} and replace its sole word PENDING with PASS.`,
        "Do not create, delete, or modify any other file. Do not access Foundry, the network, credentials, or parent directories.",
        "After the edit, report the changed path. Do not integrate this patch into any other workspace.",
      ].join("\n"),
    }],
  });
  const turnId = turnResult?.turn?.id ?? turnResult?.turnId ?? null;
  const turnCompletion = await Promise.race([
    completed,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Codex technical job timed out.")), 180_000)),
  ]);
  const fileEvents = events.filter((entry) => entry?.method === "item/completed" && entry?.params?.item?.type === "fileChange");
  const approvals = events.filter((entry) => typeof entry?.method === "string" && entry.method.endsWith("requestApproval"));
  const completionStatus = turnCompletion?.status ?? turnCompletion?.turn?.status ?? null;
  const after = await snapshotDirectory(isolatedCwd);
  const changedPaths = diffSnapshots(before, after);
  const afterText = await readFile(expectedPath, "utf8");
  const readback = {
    expectedPath,
    changedPaths,
    beforeSha256: before.get(expectedPath),
    afterSha256: after.get(expectedPath),
    expectedChecksPassed: afterText.trim() === "PASS" && changedPaths.length === 1 && changedPaths[0] === expectedPath,
  };
  const patchItems = fileEvents.map((entry) => ({
    type: "fileChange",
    status: entry.params.item.status ?? null,
    changes: Array.isArray(entry.params.item.changes)
      ? entry.params.item.changes.map((change) => ({ path: change?.path ?? null, kind: change?.kind ?? null }))
      : [],
  }));
  return {
    operation: "dicebox.codex.technical-job.live",
    status: completionStatus === "completed" && fileEvents.length > 0 && readback.expectedChecksPassed ? "PASS" : "BLOCKED",
    schemaVersion: "0.2.0",
    account: accountSummary,
    threadId,
    turnId,
    target: { isolatedCwd, expectedPath },
    approvals: approvals.map((entry) => ({ method: entry.method, decision: approvalWithinJob(entry) ? "accept" : "decline" })),
    fileChanges: patchItems,
    completionStatus,
    readback,
    implicitIntegration: false,
    runtimeAuthority: false,
    secretsReturned: false,
    stderr: stderr.filter((line) => !/token|key|authorization/i.test(line)).slice(-20),
  };
}

try {
  const receipt = await main();
  if (mode === "job") {
    await mkdir(resolve(root, "outputs"), { recursive: true });
    await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  }
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  shutdown();
  process.exitCode = receipt.status === "PASS" ? 0 : 2;
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  shutdown();
  process.exitCode = 1;
}
