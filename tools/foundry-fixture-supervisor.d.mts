export interface FixtureSupervisorConfig {
  dataPath: string;
  worldId: string;
  foundryEntry: string;
  nodePath: string;
  port: number;
  adminPassword?: string | null;
  controlDirectory: string;
  statePath: string;
  receiptPath: string;
  operationLockPath: string;
  operationQuarantineDirectory: string;
  stdoutPath: string;
  stderrPath: string;
  lockPath: string;
  quarantineDirectory: string;
}

export interface FixtureLaunchIdentity {
  entryPath: string;
  dataPath: string;
  worldId: string;
  port: number;
  adminPasswordConfigured?: boolean;
}

export interface FixtureSupervisorReceipt {
  status: string;
  evidenceClass: string;
  blockers: string[];
  [key: string]: unknown;
}

export function commandLineMatchesLaunch(commandLine: unknown, launch: FixtureLaunchIdentity): boolean;
export function defaultFixtureSupervisorConfig(environment?: NodeJS.ProcessEnv): Readonly<FixtureSupervisorConfig>;
export function redactLaunchArgs(args: readonly unknown[]): readonly unknown[];
export function createFixtureSupervisor(
  config?: FixtureSupervisorConfig,
  runtimeOverrides?: Record<string, unknown>,
): Readonly<{
  status(): Promise<FixtureSupervisorReceipt>;
  start(options?: { recoverOwnedStaleLock?: boolean }): Promise<FixtureSupervisorReceipt>;
  stop(): Promise<FixtureSupervisorReceipt>;
  restart(): Promise<FixtureSupervisorReceipt>;
  recoverLock(options?: { reason?: string }): Promise<FixtureSupervisorReceipt>;
}>;
