import { isAbsolute, relative, resolve } from "node:path";

export const CODEX_ADAPTER_SCHEMA_VERSION = "0.2.0" as const;
export * from "./proposal-adapter.js";

export type CodexTechnicalJob = Readonly<{
  schemaVersion: typeof CODEX_ADAPTER_SCHEMA_VERSION;
  jobId: string;
  objective: string;
  workspaceRoot: string;
  isolatedCwd: string;
  allowedWritePaths: readonly string[];
  baseFingerprint: string;
  expectedChecks: readonly string[];
  runtimeAuthority: false;
}>;

export type JsonRpcRequest = Readonly<{ method: string; id: number; params: Readonly<Record<string, unknown>> }>;
export type JsonRpcNotification = Readonly<{ method: string; params: Readonly<Record<string, unknown>> }>;

export type CodexRateLimitWindowMetadata = Readonly<{
  usedPercent: number;
  windowDurationMins: number | null;
  resetsAt: number | null;
}>;

export type CodexRateLimitMetadata = Readonly<{
  limitId: string | null;
  limitName: string | null;
  planType: string | null;
  primary: CodexRateLimitWindowMetadata | null;
  secondary: CodexRateLimitWindowMetadata | null;
  rateLimitReachedType: string | null;
  spendControlReached: boolean | null;
}>;

export type CodexUsageMetadata = Readonly<{
  lifetimeTokens: number | null;
  peakDailyTokens: number | null;
  longestRunningTurnSec: number | null;
  currentStreakDays: number | null;
  longestStreakDays: number | null;
  dailyBucketCount: number;
}>;

export type CodexAccountMetadata = Readonly<{
  authMode: string | null;
  planType: string | null;
  emailPresent: boolean;
  rateLimitMetadata: CodexRateLimitMetadata | null;
  usageMetadata: CodexUsageMetadata | null;
  secretsReturned: false;
  noWrite: true;
}>;

const secretPatterns = [
  /\bsk-[A-Za-z0-9_-]{8,}\b/g,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}\b/gi,
  /\b(access[_-]?token|refresh[_-]?token|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi,
];

export function redactCodexText(value: string): string {
  return secretPatterns.reduce((current, pattern) => current.replace(pattern, "[REDACTED]"), value);
}

export function createCodexTechnicalJob(input: Omit<CodexTechnicalJob, "schemaVersion" | "runtimeAuthority">): CodexTechnicalJob {
  const workspaceRoot = resolve(input.workspaceRoot);
  const isolatedCwd = resolve(input.isolatedCwd);
  const cwdRelative = relative(workspaceRoot, isolatedCwd);
  if (!isAbsolute(workspaceRoot) || cwdRelative === "" || cwdRelative.startsWith("..") || isAbsolute(cwdRelative)) {
    throw new Error("Codex technical jobs require a distinct isolated directory inside the workspace root.");
  }
  if (!isolatedCwd.toLowerCase().includes("dicebox-codex-job")) {
    throw new Error("Codex technical jobs must use a clearly named dicebox-codex-job isolation directory.");
  }
  const allowedWritePaths = input.allowedWritePaths.map((path) => resolve(path));
  for (const path of allowedWritePaths) {
    const pathRelative = relative(isolatedCwd, path);
    if (pathRelative.startsWith("..") || isAbsolute(pathRelative)) throw new Error(`Write path leaves the isolated job directory: ${path}`);
  }
  if (input.jobId.trim() === "" || input.objective.trim() === "" || input.baseFingerprint.trim() === "" || input.expectedChecks.length === 0) {
    throw new Error("Codex technical job identity, objective, fingerprint, and checks are required.");
  }
  return {
    ...input,
    objective: redactCodexText(input.objective),
    workspaceRoot,
    isolatedCwd,
    allowedWritePaths,
    schemaVersion: CODEX_ADAPTER_SCHEMA_VERSION,
    runtimeAuthority: false,
  };
}

export function buildCodexInitializeRequest(id = 0): JsonRpcRequest {
  return {
    method: "initialize",
    id,
    params: { clientInfo: { name: "dicebox_campaign_helper", title: "DiceBox Campaign Helper", version: CODEX_ADAPTER_SCHEMA_VERSION } },
  };
}

export function buildCodexInitializedNotification(): JsonRpcNotification {
  return { method: "initialized", params: {} };
}

export function buildCodexAccountReadRequest(id = 1): JsonRpcRequest {
  return { method: "account/read", id, params: { refreshToken: false } };
}

export function buildCodexAccountRateLimitsReadRequest(id = 2): JsonRpcRequest {
  return { method: "account/rateLimits/read", id, params: {} };
}

export function buildCodexAccountUsageReadRequest(id = 3): JsonRpcRequest {
  return { method: "account/usage/read", id, params: {} };
}

function metadataRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function metadataString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function metadataNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

function rateLimitWindow(value: unknown): CodexRateLimitWindowMetadata | null {
  const record = metadataRecord(value);
  if (!record || typeof record.usedPercent !== "number" || !Number.isFinite(record.usedPercent)) return null;
  return {
    usedPercent: record.usedPercent,
    windowDurationMins: metadataNumber(record.windowDurationMins),
    resetsAt: metadataNumber(record.resetsAt),
  };
}

export function normalizeCodexAccountMetadata(
  accountResult: unknown,
  rateLimitsResult: unknown,
  usageResult: unknown,
): CodexAccountMetadata {
  const accountEnvelope = metadataRecord(accountResult);
  const account = metadataRecord(accountEnvelope?.account) ?? accountEnvelope;
  const rateEnvelope = metadataRecord(rateLimitsResult);
  const rateLimits = metadataRecord(rateEnvelope?.rateLimits);
  const usageEnvelope = metadataRecord(usageResult);
  const summary = metadataRecord(usageEnvelope?.summary);
  const dailyBuckets = Array.isArray(usageEnvelope?.dailyUsageBuckets) ? usageEnvelope.dailyUsageBuckets : [];
  return {
    authMode: metadataString(account?.authMode) ?? metadataString(account?.type),
    planType: metadataString(account?.planType) ?? metadataString(rateLimits?.planType),
    emailPresent: metadataString(account?.email) !== null,
    rateLimitMetadata: rateLimits ? {
      limitId: metadataString(rateLimits.limitId),
      limitName: metadataString(rateLimits.limitName),
      planType: metadataString(rateLimits.planType),
      primary: rateLimitWindow(rateLimits.primary),
      secondary: rateLimitWindow(rateLimits.secondary),
      rateLimitReachedType: metadataString(rateLimits.rateLimitReachedType),
      spendControlReached: typeof rateLimits.spendControlReached === "boolean" ? rateLimits.spendControlReached : null,
    } : null,
    usageMetadata: summary ? {
      lifetimeTokens: metadataNumber(summary.lifetimeTokens),
      peakDailyTokens: metadataNumber(summary.peakDailyTokens),
      longestRunningTurnSec: metadataNumber(summary.longestRunningTurnSec),
      currentStreakDays: metadataNumber(summary.currentStreakDays),
      longestStreakDays: metadataNumber(summary.longestStreakDays),
      dailyBucketCount: dailyBuckets.length,
    } : null,
    secretsReturned: false,
    noWrite: true,
  };
}

export function buildCodexChatGptLoginRequest(id = 2): JsonRpcRequest {
  return { method: "account/login/start", id, params: { type: "chatgpt" } };
}

export function buildCodexThreadStartRequest(job: CodexTechnicalJob, id = 3): JsonRpcRequest {
  return {
    method: "thread/start",
    id,
    params: {
      cwd: job.isolatedCwd,
      approvalPolicy: "on-request",
      sandbox: "workspace-write",
      serviceName: "dicebox_campaign_helper",
      ephemeral: true,
    },
  };
}

export function buildCodexTurnStartRequest(job: CodexTechnicalJob, threadId: string, id = 4): JsonRpcRequest {
  if (threadId.trim() === "") throw new Error("Codex thread ID is required.");
  return {
    method: "turn/start",
    id,
    params: {
      threadId,
      cwd: job.isolatedCwd,
      approvalPolicy: "on-request",
      sandboxPolicy: {
        type: "workspaceWrite",
        writableRoots: [job.isolatedCwd],
        networkAccess: false,
        excludeTmpdirEnvVar: false,
        excludeSlashTmp: false,
      },
      input: [{
        type: "text",
        text: [
          `DiceBox technical job ${job.jobId}.`,
          job.objective,
          `Write only within: ${job.allowedWritePaths.join(", ")}.`,
          `Base fingerprint: ${job.baseFingerprint}.`,
          `Required checks: ${job.expectedChecks.join("; ")}.`,
          "Return a reviewable patch and checks. Do not access Foundry, campaign runtime, credentials, or external systems.",
        ].join("\n"),
      }],
    },
  };
}

export type CodexDirectorProposalJob = Readonly<{
  jobId: string;
  isolatedCwd: string;
  userIntent: string;
  documentJson: string;
  knowledgeJson: string;
}>;

export function buildCodexDirectorThreadStartRequest(job: CodexDirectorProposalJob, id = 3): JsonRpcRequest {
  if (job.jobId.trim() === "" || job.userIntent.trim() === "" || job.documentJson.trim() === "") {
    throw new Error("Codex Director proposal jobs require identity, intent, and document context.");
  }
  return {
    method: "thread/start",
    id,
    params: {
      cwd: resolve(job.isolatedCwd),
      approvalPolicy: "on-request",
      sandbox: "read-only",
      serviceName: "dicebox_campaign_helper_director",
      ephemeral: true,
    },
  };
}

export function buildCodexDirectorTurnStartRequest(job: CodexDirectorProposalJob, threadId: string, id = 4): JsonRpcRequest {
  if (threadId.trim() === "") throw new Error("Codex Director thread ID is required.");
  return {
    method: "turn/start",
    id,
    params: {
      threadId,
      cwd: resolve(job.isolatedCwd),
      approvalPolicy: "on-request",
      sandboxPolicy: { type: "readOnly", networkAccess: false, excludeTmpdirEnvVar: false, excludeSlashTmp: false },
      input: [{
        type: "text",
        text: [
          `DiceBox Campaign Director proposal job ${job.jobId}.`,
          "Return exactly one JSON object and no markdown, with keys commandId, baseRevision, entityId, deltaX, deltaY, and reason.",
          "Propose only; never execute, claim approval, claim committed state, access Foundry, access the network, or write files.",
          `User intent: ${redactCodexText(job.userIntent)}.`,
          `Scene context JSON: ${job.documentJson}.`,
          `Read-only knowledge context JSON: ${job.knowledgeJson}.`,
          "If the request cannot be safely represented as one typed Scene translation, return exactly {\"refusal\":\"...\"}.",
        ].join("\n"),
      }],
    },
  };
}

export type CodexDirectorAccumulator = Readonly<{
  threadId: string | null;
  turnId: string | null;
  authMode: string | null;
  planType: string | null;
  messages: readonly string[];
  deltas: readonly string[];
  errors: readonly string[];
  completed: boolean;
  failed: boolean;
}>;

export function createCodexDirectorAccumulator(): CodexDirectorAccumulator {
  return { threadId: null, turnId: null, authMode: null, planType: null, messages: [], deltas: [], errors: [], completed: false, failed: false };
}

export function consumeCodexDirectorMessage(state: CodexDirectorAccumulator, message: unknown): CodexDirectorAccumulator {
  const record = asRecord(message);
  if (!record) return state;
  const result = asRecord(record.result);
  const params = asRecord(record.params);
  let next: CodexDirectorAccumulator = { ...state };
  if (result) {
    const thread = asRecord(result.thread);
    const account = asRecord(result.account);
    if (thread && typeof thread.id === "string") next = { ...next, threadId: thread.id };
    if (account) next = {
      ...next,
      authMode: typeof account.authMode === "string" ? account.authMode : next.authMode,
      planType: typeof account.planType === "string" ? account.planType : next.planType,
    };
  }
  if (record.method === "turn/started" && params) {
    const turn = asRecord(params.turn);
    next = { ...next, turnId: typeof params.turnId === "string" ? params.turnId : typeof turn?.id === "string" ? turn.id : next.turnId };
  }
  if (record.method === "item/agentMessage/delta" && params && typeof params.delta === "string") {
    next = { ...next, deltas: [...next.deltas, redactCodexText(params.delta)] };
  }
  if (record.method === "item/completed" && params) {
    const item = asRecord(params.item);
    if (item?.type === "agentMessage" && typeof item.text === "string") next = { ...next, messages: [...next.messages, redactCodexText(item.text)] };
  }
  if (record.method === "turn/completed" && params) {
    const turn = asRecord(params.turn);
    const status = typeof params.status === "string" ? params.status : typeof turn?.status === "string" ? turn.status : null;
    next = { ...next, completed: status === "completed", failed: status === "failed" || status === "cancelled" || status === "interrupted" };
  }
  if (record.method === "error" && params) {
    const error = asRecord(params.error);
    next = { ...next, errors: [...next.errors, redactCodexText(typeof error?.message === "string" ? error.message : "Codex App Server reported an error.")], failed: true };
  }
  return next;
}

export type CodexJobAccumulator = {
  threadId: string | null;
  turnId: string | null;
  authMode: string | null;
  planType: string | null;
  patchItems: Array<Readonly<Record<string, unknown>>>;
  messages: string[];
  approvals: Array<Readonly<{ method: string; requestId: string | number | null }>>;
  errors: string[];
  completed: boolean;
  failed: boolean;
};

export function createCodexJobAccumulator(): CodexJobAccumulator {
  return { threadId: null, turnId: null, authMode: null, planType: null, patchItems: [], messages: [], approvals: [], errors: [], completed: false, failed: false };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function consumeCodexAppServerMessage(state: CodexJobAccumulator, message: unknown): CodexJobAccumulator {
  const record = asRecord(message);
  if (!record) return state;
  const result = asRecord(record.result);
  const params = asRecord(record.params);
  if (result) {
    const thread = asRecord(result.thread);
    const account = asRecord(result.account);
    if (thread && typeof thread.id === "string") state.threadId = thread.id;
    if (account) {
      if (typeof account.authMode === "string") state.authMode = account.authMode;
      else if (typeof account.type === "string") state.authMode = account.type.toLowerCase() === "apikey" ? "apikey" : account.type;
      if (typeof account.planType === "string") state.planType = account.planType;
    }
  }
  if (typeof record.method === "string" && record.method.endsWith("requestApproval")) {
    state.approvals.push({ method: record.method, requestId: typeof record.id === "string" || typeof record.id === "number" ? record.id : null });
  }
  if (record.method === "item/completed" && params) {
    const item = asRecord(params.item);
    if (item?.type === "fileChange") {
      const changes = Array.isArray(item.changes)
        ? item.changes.map((change) => {
          const record = asRecord(change);
          return record ? {
            path: typeof record.path === "string" ? record.path : null,
            kind: typeof record.kind === "string" ? record.kind : null,
          } : { path: null, kind: null };
        })
        : [];
      state.patchItems.push({ type: "fileChange", status: typeof item.status === "string" ? item.status : null, changes });
    }
    if (item?.type === "agentMessage" && typeof item.text === "string") state.messages.push(redactCodexText(item.text));
  }
  if (record.method === "turn/started" && params) {
    const turn = asRecord(params.turn);
    if (typeof params.turnId === "string") state.turnId = params.turnId;
    else if (turn && typeof turn.id === "string") state.turnId = turn.id;
  }
  if (record.method === "turn/completed" && params) {
    const turn = asRecord(params.turn);
    const status = typeof params.status === "string" ? params.status : typeof turn?.status === "string" ? turn.status : null;
    state.completed = status === "completed";
    state.failed = status === "failed" || status === "cancelled" || status === "interrupted";
  }
  if (record.method === "error" && params) {
    const error = asRecord(params.error);
    state.errors.push(redactCodexText(typeof error?.message === "string" ? error.message : "Codex App Server reported an error."));
    state.failed = true;
  }
  return state;
}

export type CodexTechnicalJobReadback = Readonly<{
  expectedPath: string;
  changedPaths: readonly string[];
  beforeSha256: string;
  afterSha256: string;
  expectedChecksPassed: boolean;
}>;

export type CodexTechnicalJobReceipt = Readonly<{
  operation: "dicebox.codex.technical-job.readback";
  status: "PASS" | "BLOCKED";
  schemaVersion: typeof CODEX_ADAPTER_SCHEMA_VERSION;
  jobId: string;
  threadId: string | null;
  turnId: string | null;
  auth: Readonly<{ mode: string | null; planType: string | null }>;
  patchItems: readonly Readonly<Record<string, unknown>>[];
  messages: readonly string[];
  errors: readonly string[];
  approvalsRequired: readonly Readonly<{ method: string; requestId: string | number | null }>[];
  readback: CodexTechnicalJobReadback | null;
  implicitExecution: false;
  runtimeAuthority: false;
  reviewRequired: true;
}>;

export function finalizeCodexTechnicalJob(job: CodexTechnicalJob, state: CodexJobAccumulator, readback: CodexTechnicalJobReadback | null = null): CodexTechnicalJobReceipt {
  const allowedPaths = new Set(job.allowedWritePaths.map((path) => resolve(path)));
  const readbackValid = readback !== null
    && allowedPaths.has(resolve(readback.expectedPath))
    && readback.changedPaths.length > 0
    && readback.changedPaths.every((path) => allowedPaths.has(resolve(path)))
    && readback.beforeSha256 !== readback.afterSha256
    && readback.expectedChecksPassed;
  return {
    operation: "dicebox.codex.technical-job.readback",
    status: state.completed && !state.failed && state.errors.length === 0 && state.patchItems.length > 0 && readbackValid ? "PASS" : "BLOCKED",
    schemaVersion: CODEX_ADAPTER_SCHEMA_VERSION,
    jobId: job.jobId,
    threadId: state.threadId,
    turnId: state.turnId,
    auth: { mode: state.authMode, planType: state.planType },
    patchItems: state.patchItems,
    messages: state.messages,
    errors: state.errors,
    approvalsRequired: state.approvals,
    readback,
    implicitExecution: false,
    runtimeAuthority: false,
    reviewRequired: true,
  };
}
