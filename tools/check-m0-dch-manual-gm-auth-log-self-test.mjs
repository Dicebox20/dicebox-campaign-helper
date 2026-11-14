import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { classifyManualGmLog } from "./check-m0-dch-manual-gm-auth-log.mjs";

const script = fileURLToPath(new URL("./check-m0-dch-manual-gm-auth-log.mjs", import.meta.url));
const jsonline = (time, message, extras = {}) =>
  JSON.stringify({ level: "info", timestamp: time, message, ...extras });
const historic = jsonline("2026-08-27 09:50:43",
  "[::ffff:127.0.0.1] User authentication successful for user Gamemaster",
  { session: "private-session-token-NEVER-SHARE", ip: "::ffff:127.0.0.1" });
const other = jsonline("2026-11-13 13:44:29", "Foundry Virtual Tabletop - Version 14 Build 367");
const expectedPrivate = ["private-session-token", "::ffff:127.0.0.1", "private-user"];

function noPromotion(result) {
  assert.equal(result.evidenceClass, "UNTRUSTED_HISTORICAL_LOG_EVENT_ONLY");
  assert.equal(result.authenticatedGmSessionNowVerified, false);
  assert.equal(result.electedActiveGmVerified, false);
  assert.equal(result.loadedDchModuleVerified, false);
  assert.equal(result.chatGptCallerAuthenticated, false);
  assert.equal(result.verifiedM0Criteria, 0);
  assert.equal(result.m0Acceptance, "NOT_ACCEPTED");
  assert.equal(result.credentialsOrSessionIdsReported, false);
  assert.equal(result.noFoundryWrite, true);
  for (const secret of expectedPrivate) {
    assert.equal(JSON.stringify(result).includes(secret), false);
  }
}

test("historical v3 Gamemaster authenticated log is retained as LOG ONLY", () => {
  const result = classifyManualGmLog(historic, "2026-08-27 00:00:00");
  assert.equal(result.status, "HISTORICAL_GM_AUTH_EVENT_LOGGED");
  assert.equal(result.eventCountAfterServerLocalCutoff, 1);
  assert.equal(result.latestEventServerLocalTime, "2026-08-27 09:50:43");
  noPromotion(result);
});
test("current window after prior authentication event shows zero, not absence of GM account", () => {
  const result = classifyManualGmLog(historic + "\n" + other, "2026-11-13 00:00:00");
  assert.equal(result.status, "NO_GM_AUTH_EVENT_IN_SELECTED_LOG");
  assert.equal(result.eventCountAfterServerLocalCutoff, 0);
  noPromotion(result);
});
test("other usernames are not Gamemaster", () => {
  const result = classifyManualGmLog(
    jsonline("2026-11-13 10:00:00", "User authentication successful for user Assistant"),
    "2026-11-13 00:00:00");
  assert.equal(result.status, "NO_GM_AUTH_EVENT_IN_SELECTED_LOG");
  noPromotion(result);
});
test("failed authentication is never promoted", () => {
  const result = classifyManualGmLog(
    jsonline("2026-11-13 10:00:00", "User authentication failed for user Gamemaster"),
    "2026-11-13 00:00:00");
  assert.equal(result.status, "NO_GM_AUTH_EVENT_IN_SELECTED_LOG");
  noPromotion(result);
});
test("text resembling success in an unrelated message is not counted", () => {
  const result = classifyManualGmLog(
    jsonline("2026-11-13 10:00:00",
      "Mock: User authentication successful for user Gamemaster"),
    "2026-11-13 00:00:00");
  assert.equal(result.status, "NO_GM_AUTH_EVENT_IN_SELECTED_LOG");
  noPromotion(result);
});
test("two matched events count and last timestamp reported only", () => {
  const result = classifyManualGmLog([
    historic,
    jsonline("2026-11-13 11:00:00",
      "[::ffff:127.0.0.1] User authentication successful for user Gamemaster",
      { token: "private-user-auth-token" }),
  ].join("\n"), "2026-08-01 00:00:00");
  assert.equal(result.eventCountAfterServerLocalCutoff, 2);
  assert.equal(result.latestEventServerLocalTime, "2026-11-13 11:00:00");
  noPromotion(result);
});
test("bad JSONL line blocks rather than ignoring unknown text", () => {
  const result = classifyManualGmLog(historic + "\n{bad token}\n", "2026-08-01 00:00:00");
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.reason, "MALFORMED_JSONL_ROWS_PRESENT");
  noPromotion(result);
});
test("invalid server-local cutoff blocks instead of comparing an ambiguous time zone", () => {
  for (const time of ["", "2026-11-13T00:00:00Z", "2026-11-13", 0, null]) {
    const result = classifyManualGmLog(historic, time);
    assert.equal(result.status, "BLOCKED");
    noPromotion(result);
  }
});
test("no input text or unbounded text blocks", () => {
  assert.equal(classifyManualGmLog(null, "2026-11-13 00:00:00").status, "BLOCKED");
  assert.equal(classifyManualGmLog("a".repeat(12 * 1024 * 1024 + 1),
    "2026-11-13 00:00:00").status, "BLOCKED");
});
test("empty log does not establish an account", () => {
  const result = classifyManualGmLog("", "2026-11-13 00:00:00");
  assert.equal(result.status, "NO_GM_AUTH_EVENT_IN_SELECTED_LOG");
  noPromotion(result);
});
test("CLI refuses missing input file path and returns redacted, nonzero JSON", () => {
  const run = spawnSync(process.execPath, [script], { encoding: "utf8", timeout: 3000 });
  assert.equal(run.status, 2);
  const result = JSON.parse(run.stdout);
  assert.equal(result.status, "BLOCKED");
  assert.equal(result.reason, "EXPLICIT_ABSOLUTE_FOUNDRY_DEBUG_LOG_REQUIRED");
  noPromotion(result);
});
test("CLI reads local bounded JSONL and emits no secret", () => {
  const dir = mkdtempSync(join(tmpdir(), "dch-m0-log-"));
  try {
    const file = join(dir, "debug.2026-08-27.log");
    writeFileSync(file, historic, "utf8");
    const run = spawnSync(process.execPath,
      [script, "--log", file, "--since-local", "2026-08-01 00:00:00"],
      { encoding: "utf8", timeout: 3000 });
    assert.equal(run.status, 0);
    const value = JSON.parse(run.stdout);
    assert.equal(value.status, "HISTORICAL_GM_AUTH_EVENT_LOGGED");
    noPromotion(value);
    assert.equal(run.stdout.includes("private-session-token"), false);
    assert.equal(run.stdout.includes(file), false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
