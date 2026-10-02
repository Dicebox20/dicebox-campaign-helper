import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import process from "node:process";

const root = resolve(import.meta.dirname, "..");
const codexEntry = resolve(root, "node_modules", "@openai", "codex", "bin", "codex.js");
const receiptPath = resolve(root, "outputs", "m202-managed-account-metadata-receipt.json");
const child = spawn(process.execPath, [codexEntry, "app-server", "--stdio"], {
  cwd: root,
  stdio: ["pipe", "pipe", "pipe"],
  windowsHide: true,
});

let nextId = 0;
const pending = new Map();
const stderr = [];
const stdout = createInterface({ input: child.stdout });

function redact(value) {
  return String(value)
    .replace(/\bsk-[A-Za-z0-9_-]{8,}\b/g, "[REDACTED]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]{8,}\b/gi, "[REDACTED]")
    .replace(/\b(access[_-]?token|refresh[_-]?token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, "$1=[REDACTED]");
}

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

stdout.on("line", (line) => {
  let message;
  try { message = JSON.parse(line); } catch { return; }
  if (message.id === undefined) return;
  const waiter = pending.get(message.id);
  if (!waiter) return;
  clearTimeout(waiter.timer);
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(`${message.error.code}: ${message.error.message}`));
  else waiter.resolve(message.result);
});

child.stderr.setEncoding("utf8");
child.stderr.on("data", (chunk) => stderr.push(redact(chunk)));

function safeInteger(value) {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function safeString(value) {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function safeWindow(value) {
  if (!value || typeof value !== "object" || typeof value.usedPercent !== "number" || !Number.isFinite(value.usedPercent)) return null;
  return {
    usedPercent: value.usedPercent,
    windowDurationMins: safeInteger(value.windowDurationMins),
    resetsAt: safeInteger(value.resetsAt),
  };
}

function safeMetadata(accountResult, rateLimitsResult, usageResult) {
  const account = accountResult?.account ?? accountResult ?? {};
  const rateLimits = rateLimitsResult?.rateLimits ?? null;
  const summary = usageResult?.summary ?? null;
  return {
    account: {
      authMode: safeString(account.authMode) ?? safeString(account.type),
      planType: safeString(account.planType) ?? safeString(rateLimits?.planType),
      emailPresent: safeString(account.email) !== null,
    },
    rateLimitMetadata: rateLimits ? {
      limitId: safeString(rateLimits.limitId),
      limitName: safeString(rateLimits.limitName),
      planType: safeString(rateLimits.planType),
      primary: safeWindow(rateLimits.primary),
      secondary: safeWindow(rateLimits.secondary),
      rateLimitReachedType: safeString(rateLimits.rateLimitReachedType),
      spendControlReached: typeof rateLimits.spendControlReached === "boolean" ? rateLimits.spendControlReached : null,
    } : null,
    usageMetadata: summary ? {
      lifetimeTokens: safeInteger(summary.lifetimeTokens),
      peakDailyTokens: safeInteger(summary.peakDailyTokens),
      longestRunningTurnSec: safeInteger(summary.longestRunningTurnSec),
      currentStreakDays: safeInteger(summary.currentStreakDays),
      longestStreakDays: safeInteger(summary.longestStreakDays),
      dailyBucketCount: Array.isArray(usageResult.dailyUsageBuckets) ? usageResult.dailyUsageBuckets.length : 0,
    } : null,
  };
}

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
  const initialized = await request("initialize", {
    clientInfo: { name: "dicebox_campaign_helper", title: "DiceBox Campaign Helper", version: "0.2.0" },
  });
  write({ method: "initialized", params: {} });
  const [accountResult, rateLimitsResult, usageResult] = await Promise.all([
    request("account/read", { refreshToken: false }),
    request("account/rateLimits/read", {}),
    request("account/usage/read", {}),
  ]);
  const metadata = safeMetadata(accountResult, rateLimitsResult, usageResult);
  const receipt = {
    operation: "dicebox.codex.app-server.account-metadata.live",
    status: metadata.account.authMode ? "PASS" : "BLOCKED",
    provider: "chatgpt-subscription",
    server: {
      initialized: Boolean(initialized),
      userAgent: safeString(initialized?.userAgent),
      platformFamily: safeString(initialized?.platformFamily),
      platformOs: safeString(initialized?.platformOs),
    },
    ...metadata,
    requestMethods: ["account/read", "account/rateLimits/read", "account/usage/read"],
    unsupportedMetadataIsNonFatal: true,
    apiKeyRequired: false,
    implicitExecution: false,
    projectWrite: false,
    foundryWrite: false,
    secretsReturned: false,
    noWrite: true,
    stderr: stderr.slice(-10),
  };
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  return receipt;
}

try {
  const receipt = await main();
  process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
  await shutdown();
  process.exit(receipt.status === "PASS" ? 0 : 2);
} catch (error) {
  process.stderr.write(`${redact(error instanceof Error ? error.stack : String(error))}\n`);
  await shutdown();
  process.exit(1);
}
