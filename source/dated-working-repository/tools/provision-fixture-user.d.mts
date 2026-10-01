export interface FixtureUserPreflightInput {
  dataPath?: string;
  worldId?: string;
  port?: number;
  userName?: string;
  role?: number;
  roleName?: string;
  payload?: Record<string, unknown>;
  runtimeStatus?: Record<string, unknown>;
  launchGuard?: Record<string, unknown>;
  manifestPreflight?: Record<string, unknown>;
  authority?: Record<string, unknown>;
  existingUsers?: unknown;
  [key: string]: unknown;
}

export interface FixtureUserPreflightReceipt {
  receiptVersion: number;
  receiptId: string;
  operation: string;
  status: string;
  evidenceClass: string;
  readyClaim: boolean;
  mutationPerformed: boolean;
  noCredentialsEntered: boolean;
  noSecretRecorded: boolean;
  noRawLevelDbAccess: boolean;
  noWorldDocumentMutation: boolean;
  noBalladAccess: boolean;
  worldDocumentWrites: number;
  balladTouched: boolean;
  target: Record<string, unknown>;
  blockers: readonly string[];
  [key: string]: unknown;
}

export const TARGET: Readonly<{
  dataPath: string;
  worldId: string;
  port: number;
  userName: string;
  role: number;
  roleName: string;
}>;

export function provisionFixtureUser(
  input?: FixtureUserPreflightInput,
): Promise<FixtureUserPreflightReceipt>;
