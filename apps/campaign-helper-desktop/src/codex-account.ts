import { invoke } from "@tauri-apps/api/core";

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

export type CodexAccountProbe = Readonly<{
  operation: "dicebox.codex.app-server.account-probe";
  status: "PASS" | "BLOCKED";
  initialized: boolean;
  userAgent: string | null;
  platformFamily: string | null;
  platformOs: string | null;
  authMode: string | null;
  planType: string | null;
  rateLimitMetadata: CodexRateLimitMetadata | null;
  usageMetadata: CodexUsageMetadata | null;
  emailPresent: boolean;
  campaignDirectorApiKeyConfigured: boolean;
  campaignDirectorCredentialSource: "os-keyring" | "environment" | "none";
  secretsReturned: false;
  noWrite: true;
}>;

export type CodexTechnicalJobReceipt = Readonly<{
  operation: "dicebox.codex.technical-job.live";
  status: "PASS" | "BLOCKED";
  account: Readonly<{ authMode: string | null; planType: string | null }>;
  threadId: string | null;
  turnId: string | null;
  readback: Readonly<{ expectedPath: string; changedPaths: readonly string[]; expectedChecksPassed: boolean }>;
  implicitIntegration: false;
  runtimeAuthority: false;
  secretsReturned: false;
}>;

export function isNativeCodexProbeAvailable(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function probeCodexAccount(): Promise<CodexAccountProbe> {
  return invoke<CodexAccountProbe>("probe_codex_app_server");
}

export function runCodexTechnicalJob(): Promise<CodexTechnicalJobReceipt> {
  return invoke<CodexTechnicalJobReceipt>("run_codex_technical_job");
}
