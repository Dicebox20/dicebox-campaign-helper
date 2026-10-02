import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  buildCodexAccountReadRequest,
  buildCodexAccountRateLimitsReadRequest,
  buildCodexAccountUsageReadRequest,
  buildCodexDirectorThreadStartRequest,
  buildCodexDirectorTurnStartRequest,
  consumeCodexDirectorMessage,
  createCodexDirectorAccumulator,
  buildCodexInitializeRequest,
  buildCodexInitializedNotification,
  buildCodexThreadStartRequest,
  buildCodexTurnStartRequest,
  consumeCodexAppServerMessage,
  createCodexJobAccumulator,
  createCodexTechnicalJob,
  finalizeCodexTechnicalJob,
  normalizeCodexAccountMetadata,
} from "../packages/dicebox-codex-adapter/src/index";

const root = resolve(import.meta.dirname, "..");
const isolated = resolve(root, "work", "dicebox-codex-job-test");
const job = createCodexTechnicalJob({
  jobId: "job-1",
  objective: "Add one deterministic fixture note.",
  workspaceRoot: root,
  isolatedCwd: isolated,
  allowedWritePaths: [resolve(isolated, "fixture-note.txt")],
  baseFingerprint: "abc123",
  expectedChecks: ["fixture-note contains PASS"],
});

describe("Codex App Server compatibility adapter", () => {
  it("builds a read-only managed Director turn and captures streamed redacted output", () => {
    const job = {
      jobId: "director-test",
      isolatedCwd: resolve(root, "work", "dicebox-codex-job-director-test"),
      userIntent: "Move the apparatus",
      documentJson: JSON.stringify({ id: "dbx:scene:test", revision: 4 }),
      knowledgeJson: "[]",
    } as const;
    expect(buildCodexDirectorThreadStartRequest(job)).toMatchObject({
      method: "thread/start",
      params: { approvalPolicy: "on-request", sandbox: "read-only", ephemeral: true },
    });
    expect(buildCodexDirectorTurnStartRequest(job, "thr-1")).toMatchObject({
      method: "turn/start",
      params: { approvalPolicy: "on-request", sandboxPolicy: { type: "readOnly", networkAccess: false } },
    });
    let state = createCodexDirectorAccumulator();
    state = consumeCodexDirectorMessage(state, { id: 1, result: { account: { authMode: "chatgpt", planType: "plus" } } });
    state = consumeCodexDirectorMessage(state, { method: "item/agentMessage/delta", params: { delta: "Bearer very-secret-token" } });
    state = consumeCodexDirectorMessage(state, { method: "item/completed", params: { item: { type: "agentMessage", text: "{\"deltaX\":8}" } } });
    state = consumeCodexDirectorMessage(state, { method: "turn/completed", params: { status: "completed" } });
    expect(state).toMatchObject({ authMode: "chatgpt", planType: "plus", completed: true, deltas: ["[REDACTED]"] });
    expect(JSON.stringify(state)).not.toContain("very-secret-token");
  });

  it("builds the required initialize handshake and exact read-only account metadata sequence", () => {
    expect(buildCodexInitializeRequest()).toMatchObject({ method: "initialize", id: 0 });
    expect(buildCodexInitializedNotification()).toEqual({ method: "initialized", params: {} });
    expect(buildCodexAccountReadRequest()).toEqual({ method: "account/read", id: 1, params: { refreshToken: false } });
    expect(buildCodexAccountRateLimitsReadRequest()).toEqual({ method: "account/rateLimits/read", id: 2, params: {} });
    expect(buildCodexAccountUsageReadRequest()).toEqual({ method: "account/usage/read", id: 3, params: {} });
  });

  it("normalizes only allowlisted account, rate-window, and aggregate usage metadata", () => {
    const metadata = normalizeCodexAccountMetadata(
      { account: { type: "chatgpt", planType: "plus", email: "private@example.test", accessToken: "very-secret-token" } },
      {
        rateLimits: {
          limitId: "codex",
          limitName: "Codex",
          planType: "plus",
          primary: { usedPercent: 4, windowDurationMins: 10080, resetsAt: 1788198196 },
          secondary: null,
          credits: { balance: "private-balance", hasCredits: false },
          spendControlReached: false,
          rateLimitReachedType: null,
        },
        rateLimitResetCredits: [{ id: "opaque-reset-credit" }],
      },
      {
        summary: {
          lifetimeTokens: 4_593_145_022,
          peakDailyTokens: 852_980_032,
          longestRunningTurnSec: 120,
          currentStreakDays: 0,
          longestStreakDays: 7,
        },
        dailyUsageBuckets: [{ startDate: "2026-08-24", tokens: 10 }],
        threadUsage: { tokenBreakdown: "private-thread-usage" },
      },
    );
    expect(metadata).toEqual({
      authMode: "chatgpt",
      planType: "plus",
      emailPresent: true,
      rateLimitMetadata: {
        limitId: "codex",
        limitName: "Codex",
        planType: "plus",
        primary: { usedPercent: 4, windowDurationMins: 10080, resetsAt: 1788198196 },
        secondary: null,
        rateLimitReachedType: null,
        spendControlReached: false,
      },
      usageMetadata: {
        lifetimeTokens: 4_593_145_022,
        peakDailyTokens: 852_980_032,
        longestRunningTurnSec: 120,
        currentStreakDays: 0,
        longestStreakDays: 7,
        dailyBucketCount: 1,
      },
      secretsReturned: false,
      noWrite: true,
    });
    const serialized = JSON.stringify(metadata);
    expect(serialized).not.toContain("private@example.test");
    expect(serialized).not.toContain("very-secret-token");
    expect(serialized).not.toContain("private-balance");
    expect(serialized).not.toContain("opaque-reset-credit");
    expect(serialized).not.toContain("private-thread-usage");
    expect(normalizeCodexAccountMetadata({}, {}, {})).toMatchObject({
      authMode: null,
      rateLimitMetadata: null,
      usageMetadata: null,
      secretsReturned: false,
      noWrite: true,
    });
  });

  it("pins isolated workspaceWrite with explicit approvals and no runtime authority", () => {
    expect(job.runtimeAuthority).toBe(false);
    expect(buildCodexThreadStartRequest(job)).toMatchObject({
      method: "thread/start",
      params: { cwd: isolated, approvalPolicy: "on-request", sandbox: "workspace-write", ephemeral: true },
    });
    expect(buildCodexTurnStartRequest(job, "thr-1").params).toMatchObject({
      cwd: isolated,
      approvalPolicy: "on-request",
      sandboxPolicy: {
        type: "workspaceWrite",
        writableRoots: [isolated],
        networkAccess: false,
        excludeTmpdirEnvVar: false,
        excludeSlashTmp: false,
      },
    });
  });

  it("rejects write paths outside the isolated job directory", () => {
    expect(() => createCodexTechnicalJob({ ...job, allowedWritePaths: [resolve(root, "package.json")] })).toThrow(/leaves the isolated job/);
  });

  it("captures ChatGPT account mode, approval requests, and a reviewable patch without auto-approval", () => {
    const state = createCodexJobAccumulator();
    consumeCodexAppServerMessage(state, { id: 1, result: { account: { authMode: "chatgpt", planType: "plus" } } });
    consumeCodexAppServerMessage(state, { id: 3, result: { thread: { id: "thr-1" } } });
    consumeCodexAppServerMessage(state, { method: "turn/started", params: { turnId: "turn-1" } });
    consumeCodexAppServerMessage(state, { method: "item/fileChange/requestApproval", id: 44, params: { threadId: "thr-1", turnId: "turn-1" } });
    consumeCodexAppServerMessage(state, { method: "item/completed", params: { item: { type: "fileChange", status: "completed", changes: [{ path: "fixture-note.txt", kind: "add" }] } } });
    consumeCodexAppServerMessage(state, { method: "item/completed", params: { item: { type: "agentMessage", text: "Bearer very-secret-token completed" } } });
    consumeCodexAppServerMessage(state, { method: "turn/completed", params: { status: "completed" } });
    const readback = {
      expectedPath: resolve(isolated, "fixture-note.txt"),
      changedPaths: [resolve(isolated, "fixture-note.txt")],
      beforeSha256: createHash("sha256").update("PENDING\n").digest("hex"),
      afterSha256: createHash("sha256").update("PASS\n").digest("hex"),
      expectedChecksPassed: true,
    };
    expect(finalizeCodexTechnicalJob(job, state, readback)).toMatchObject({
      status: "PASS",
      auth: { mode: "chatgpt", planType: "plus" },
      implicitExecution: false,
      runtimeAuthority: false,
      reviewRequired: true,
      approvalsRequired: [{ method: "item/fileChange/requestApproval", requestId: 44 }],
      messages: ["[REDACTED] completed"],
      readback,
    });
  });

  it("stays blocked when no completed patch is independently reread", () => {
    expect(finalizeCodexTechnicalJob(job, createCodexJobAccumulator())).toMatchObject({ status: "BLOCKED", implicitExecution: false });
    const state = createCodexJobAccumulator();
    consumeCodexAppServerMessage(state, { method: "item/completed", params: { item: { type: "fileChange", status: "completed", changes: [{ path: "fixture-note.txt", kind: "update", patch: "secret contents" }] } } });
    consumeCodexAppServerMessage(state, { method: "turn/completed", params: { turn: { id: "turn-1", status: "completed" } } });
    expect(finalizeCodexTechnicalJob(job, state)).toMatchObject({ status: "BLOCKED", readback: null });
    expect(JSON.stringify(state.patchItems)).not.toContain("secret contents");
  });

  it("captures current account and nested turn event shapes and redacts errors", () => {
    const state = createCodexJobAccumulator();
    consumeCodexAppServerMessage(state, { id: 1, result: { account: { type: "chatgpt", planType: "plus" } } });
    consumeCodexAppServerMessage(state, { method: "turn/started", params: { turn: { id: "turn-current" } } });
    expect(state).toMatchObject({ authMode: "chatgpt", planType: "plus", turnId: "turn-current" });
    consumeCodexAppServerMessage(state, { method: "error", params: { error: { message: "Bearer very-secret-token failed" } } });
    expect(state.errors).toEqual(["[REDACTED] failed"]);
  });

  it("keeps the live runner on the current App Server protocol and authoritative disk reread", () => {
    const source = readFileSync(resolve(root, "tools", "run-codex-app-server-slice.mjs"), "utf8");
    expect(source).toContain('approvalPolicy: "on-request"');
    expect(source).toContain('sandbox: "workspace-write"');
    expect(source).toContain('type: "workspaceWrite"');
    expect(source).toContain("snapshotDirectory");
    expect(source).toContain("expectedChecksPassed");
    expect(source).not.toContain('approvalPolicy: "onRequest"');
    expect(source).not.toContain('sandbox: "workspaceWrite"');
  });

  it("keeps the live account metadata probe fixed, read-only, and allowlisted", () => {
    const source = readFileSync(resolve(root, "tools", "run-codex-account-metadata-probe.mjs"), "utf8");
    expect(source).toContain('request("account/read", { refreshToken: false })');
    expect(source).toContain('request("account/rateLimits/read", {})');
    expect(source).toContain('request("account/usage/read", {})');
    expect(source).toContain("apiKeyRequired: false");
    expect(source).toContain("implicitExecution: false");
    expect(source).toContain("projectWrite: false");
    expect(source).toContain("foundryWrite: false");
    expect(source).toContain("secretsReturned: false");
    expect(source).not.toContain("rateLimitResetCredits:");
    expect(source).not.toContain("credits:");
    expect(source).not.toContain("balance:");
  });

  it("keeps the managed Director runner read-only and receipt-driven", () => {
    const source = readFileSync(resolve(root, "tools", "run-campaign-director-app-server-slice.mjs"), "utf8");
    expect(source).toContain('sandbox: "read-only"');
    expect(source).toContain('type: "readOnly"');
    expect(source).toContain("noWrite: true");
    expect(source).toContain("approvalRequired: true");
    expect(source).toContain("implicitExecution: false");
    expect(source).not.toContain("OPENAI_API_KEY");
    expect(source).not.toContain("fileChange");
  });
});
