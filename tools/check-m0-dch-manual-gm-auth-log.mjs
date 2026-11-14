#!/usr/bin/env node
/**
 * Read-only, bounded, redacted Foundry JSONL log event checker for DCH M0.
 * Parses a manually selected log; it DOES NOT authenticate, log in, call
 * Foundry APIs, verify an active/elected GM, or inspect credential fields.
 */
import { readFile, stat } from "node:fs/promises";
import { basename, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const operation = "dch.m0.disposable-fixture-manual-gm-auth-log-observation";
const maxBytes = 12 * 1024 * 1024;
const maxRows = 120_000;
const localStamp = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const gmSuccess = /^\[[^\]\r\n]{3,70}\] User authentication successful for user Gamemaster$/;
function base() {
  return {
    schemaVersion: "1.0.0",
    operation,
    evidenceClass: "UNTRUSTED_HISTORICAL_LOG_EVENT_ONLY",
    sourceWorldAndRuntimeUnverified: true,
    authenticatedGmSessionNowVerified: false,
    electedActiveGmVerified: false,
    loadedDchModuleVerified: false,
    chatGptCallerAuthenticated: false,
    credentialsOrSessionIdsReported: false,
    noFoundryWrite: true,
    m0Acceptance: "NOT_ACCEPTED",
    verifiedM0Criteria: 0,
  };
}
export function classifyManualGmLog(text, sinceLocal) {
  if (typeof text !== "string" || text.length > maxBytes ||
      typeof sinceLocal !== "string" || !localStamp.test(sinceLocal)) {
    return { ...base(), status: "BLOCKED", reason: "INVALID_LOG_OR_SERVER_LOCAL_CUTOFF" };
  }
  const lines = text.split(/\r?\n/);
  if (lines.length > maxRows) return { ...base(), status: "BLOCKED", reason: "LOG_ROW_LIMIT_EXCEEDED" };
  let successes = 0, latestLocalTimestamp = null, malformedRows = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    let item;
    try { item = JSON.parse(line); } catch { malformedRows++; continue; }
    if (!item || typeof item !== "object" || Array.isArray(item) ||
        typeof item.timestamp !== "string" ||
        !localStamp.test(item.timestamp) ||
        typeof item.message !== "string") continue;
    if (item.timestamp < sinceLocal || !gmSuccess.test(item.message)) continue;
    successes++;
    if (!latestLocalTimestamp || item.timestamp > latestLocalTimestamp)
      latestLocalTimestamp = item.timestamp;
  }
  if (malformedRows) return {
    ...base(), status: "BLOCKED", reason: "MALFORMED_JSONL_ROWS_PRESENT",
  };
  return {
    ...base(),
    status: successes ? "HISTORICAL_GM_AUTH_EVENT_LOGGED" : "NO_GM_AUTH_EVENT_IN_SELECTED_LOG",
    eventCountAfterServerLocalCutoff: successes,
    latestEventServerLocalTime: latestLocalTimestamp,
    note: successes
      ? "A log line claims Gamemaster authenticated; live session, elected GM and active module remain UNVERIFIED."
      : "No matching line in this selected log; this does not prove no GM account or other session exists.",
  };
}
async function cli() {
  const args = process.argv.slice(2);
  const logIndex = args.indexOf("--log");
  const sinceIndex = args.indexOf("--since-local");
  if (args.length !== 4 || logIndex === -1 || sinceIndex === -1 ||
      logIndex + 1 >= args.length || sinceIndex + 1 >= args.length ||
      logIndex === sinceIndex || !isAbsolute(args[logIndex + 1]) ||
      !/^debug\.\d{4}-\d{2}-\d{2}\.log$/i.test(basename(args[logIndex + 1]))) {
    process.stdout.write(JSON.stringify({
      ...base(), status: "BLOCKED", reason: "EXPLICIT_ABSOLUTE_FOUNDRY_DEBUG_LOG_REQUIRED",
    }) + "\n");
    process.exitCode = 2;
    return;
  }
  let output;
  try {
    const file = resolve(args[logIndex + 1]);
    const fileStat = await stat(file);
    if (!fileStat.isFile() || fileStat.size > maxBytes) throw Error("invalid log");
    output = classifyManualGmLog(await readFile(file, "utf8"), args[sinceIndex + 1]);
  } catch {
    output = { ...base(), status: "BLOCKED", reason: "LOG_NOT_READABLE_OR_OVER_LIMIT" };
  }
  process.stdout.write(JSON.stringify(output) + "\n");
  process.exitCode = output.status === "BLOCKED" ? 2 : 0;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  cli().catch(() => {
    process.stdout.write(JSON.stringify({
      ...base(), status: "BLOCKED", reason: "READ_ONLY_LOG_CHECK_UNAVAILABLE",
    }) + "\n");
    process.exitCode = 2;
  });
}
