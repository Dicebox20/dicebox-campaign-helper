import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const codexEntry = resolve(root, "node_modules", "@openai", "codex", "bin", "codex.js");
const desktopRequestMode = process.argv[2] === "--desktop";
const isolatedCwd = resolve(root, "work", desktopRequestMode ? "dicebox-codex-director-desktop" : "dicebox-codex-director-m197");
const receiptPath = desktopRequestMode ? null : resolve(root, "outputs", "m197-managed-director-no-write-receipt.json");
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
    secretsReturned: false,
  };
}

function redacted(value) {
  return String(value).replace(/\b(sk-[A-Za-z0-9_-]{8,}|Bearer\s+[A-Za-z0-9._~+/=-]{8,})\b/gi, "[REDACTED]");
}

function desktopRequest() {
  if (!desktopRequestMode) return null;
  let value;
  try { value = JSON.parse(process.argv[3] ?? ""); } catch { throw new Error("Managed Director desktop request is not valid JSON."); }
  if (!value || typeof value !== "object" || Array.isArray(value)
    || typeof value.userIntent !== "string" || value.userIntent.trim() === ""
    || !value.document || typeof value.document !== "object" || Array.isArray(value.document)
    || !Array.isArray(value.document.entities) || !Array.isArray(value.knowledge ?? [])) {
    throw new Error("Managed Director desktop request violates the fixed read-only request contract.");
  }
  return value;
}

function extractProposal(text) {
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first < 0 || last <= first) return { refusal: "The managed Campaign Director returned no JSON proposal." };
  try {
    const value = JSON.parse(text.slice(first, last + 1));
    if (value && typeof value.refusal === "string") return { refusal: redacted(value.refusal) };
    const required = ["commandId", "baseRevision", "entityId", "deltaX", "deltaY", "reason"];
    if (!value || typeof value !== "object" || required.some((key) => !(key in value))) {
      return { refusal: "The managed Campaign Director JSON did not match the typed proposal shape." };
    }
    if (typeof value.commandId !== "string" || typeof value.baseRevision !== "number" || typeof value.entityId !== "string"
      || typeof value.deltaX !== "number" || typeof value.deltaY !== "number" || typeof value.reason !== "string") {
      return { refusal: "The managed Campaign Director proposal contained invalid field types." };
    }
    return value;
  } catch {
    return { refusal: "The managed Campaign Director returned invalid JSON." };
  }
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
  if (message.method === "turn/completed") completedResolve(message);
});

const stderr = [];
child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => stderr.push(redacted(chunk)));

async function shutdown() {
  for (const waiter of pending.values()) {
    clearTimeout(waiter.timer);
    waiter.reject(new Error("Codex App Server closed."));
  }
  pending.clear();
  stdout.close();
  try { child.stdin.destroy(); } catch { /* already closed */ }
  try { child.stdout.destroy(); } catch { /* already closed */ }
  try { child.stderr.destroy(); } catch { /* already closed */ }
  try { child.kill("SIGKILL"); } catch { /* already exited */ }
}

async function main() {
  const requestPayload = desktopRequest();
  await mkdir(isolatedCwd, { recursive: true });
  const initialized = await request("initialize", {
    clientInfo: { name: "dicebox_campaign_helper", title: "DiceBox Campaign Helper", version: "0.2.0" },
  });
  write({ method: "initialized", params: {} });
  const account = safeAccount(await request("account/read", { refreshToken: false }));
  if (!account.authMode) throw new Error("Codex App Server has no authenticated managed account.");
  const thread = await request("thread/start", {
    cwd: isolatedCwd,
    approvalPolicy: "on-request",
    sandbox: "read-only",
    serviceName: "dicebox_campaign_helper_director",
    ephemeral: true,
  });
  const threadId = thread?.thread?.id;
  if (typeof threadId !== "string") throw new Error("Codex App Server did not return a Director thread ID.");
  const turn = await request("turn/start", {
    threadId,
    cwd: isolatedCwd,
    approvalPolicy: "on-request",
    sandboxPolicy: { type: "readOnly", networkAccess: false, excludeTmpdirEnvVar: false, excludeSlashTmp: false },
    input: [{
      type: "text",
      text: requestPayload
        ? [
          "DiceBox Campaign Director desktop no-write proposal.",
          "Return exactly one JSON object and no markdown with commandId, baseRevision, entityId, deltaX, deltaY, and reason; or exactly {\"refusal\":\"reason\"}.",
          "Propose only. Do not execute, claim approval, claim committed state, access Foundry, access the network, or write files.",
          `User intent: ${redacted(requestPayload.userIntent)}.`,
          `Scene document context: ${redacted(JSON.stringify(requestPayload.document))}.`,
          `Read-only knowledge context: ${redacted(JSON.stringify(requestPayload.knowledge ?? []))}.`,
        ].join("\n")
        : [
          "DiceBox Campaign Director no-write acceptance probe.",
          "Return exactly one JSON object and no markdown.",
          "The object must contain commandId=managed-director-m197, baseRevision=4, entityId=dbx:apparatus:core, deltaX=8, deltaY=0, and a short reason.",
          "Propose only. Do not execute, claim approval, claim committed state, access Foundry, access the network, or write files.",
          "If you cannot comply safely, return exactly {\"refusal\":\"reason\"}.",
        ].join("\n"),
    }],
  });
  const turnId = turn?.turn?.id ?? turn?.turnId ?? null;
  const completion = await Promise.race([
    completed,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Managed Director turn timed out.")), 120_000)),
  ]);
  const messages = events
    .filter((entry) => entry?.method === "item/completed" && entry?.params?.item?.type === "agentMessage")
    .map((entry) => entry.params.item.text)
    .filter((value) => typeof value === "string");
  const deltas = events
    .filter((entry) => entry?.method === "item/agentMessage/delta" && typeof entry?.params?.delta === "string")
    .map((entry) => entry.params.delta);
  const text = messages.at(-1) ?? deltas.join("");
  const proposal = extractProposal(text);
  const response = "refusal" in proposal
    ? { id: `managed-${threadId}`, status: "completed", output: [{ type: "message", content: [{ type: "refusal", refusal: proposal.refusal }] }] }
    : { id: `managed-${threadId}`, status: "completed", output: [{ type: "function_call", call_id: `managed-${threadId}-call`, name: "propose_scene_command", arguments: JSON.stringify(proposal) }] };
  const receipt = {
    operation: "dicebox.campaign-director.app-server.live",
    status: "refusal" in proposal ? "BLOCKED" : "PASS",
    provider: "chatgpt-subscription",
    account,
    initialized: Boolean(initialized),
    threadId,
    turnId,
    completionObserved: Boolean(completion),
    completionStatus: completion?.status ?? completion?.params?.status ?? completion?.turn?.status ?? completion?.params?.turn?.status ?? "completed",
    response,
    noWrite: true,
    approvalRequired: true,
    implicitExecution: false,
    runtimeAuthority: false,
    secretsReturned: false,
    approvals: events.filter((entry) => typeof entry?.method === "string" && entry.method.endsWith("requestApproval")).map((entry) => ({ method: entry.method, decision: "decline" })),
    stderr: stderr.slice(-20),
  };
  if (receiptPath) await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  return receipt;
}

try {
  const receipt = await main();
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  await shutdown();
  process.exit(receipt.status === "PASS" ? 0 : 2);
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  await shutdown();
  process.exit(1);
}
