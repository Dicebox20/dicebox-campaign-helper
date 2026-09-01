export interface FoundryLaunchInput {
  readonly dataPath?: string;
  readonly worldId?: string;
  readonly foundryEntry?: string;
  readonly nodePath?: string;
  readonly port?: number | string;
  readonly adminPassword?: string;
  readonly setupOnly?: boolean;
}

export interface FoundryLaunchReport {
  readonly receiptVersion: 1;
  readonly operation: "foundry.server.launch-guard";
  readonly status: "PASS" | "BLOCKED";
  readonly evidenceClass: "deterministic" | "blocked";
  readonly noDefaultDataPath: true;
  readonly dataPath: string | null;
  readonly foundryDataPath?: string | null;
  readonly worldId: string | null;
  readonly foundryEntry: string | null;
  readonly port: number | null;
  readonly setupOnly: boolean;
  readonly checks: Readonly<Record<string, string>>;
  readonly blockers: readonly string[];
  readonly nextGate: string;
  readonly observedWorld?: {
    readonly id: string;
    readonly coreVersion: string | null;
    readonly system: string | null;
    readonly systemVersion: string | null;
  };
}

export function inspectFoundryLaunch(input?: FoundryLaunchInput): FoundryLaunchReport;
export function buildFoundryNodeLaunch(input: FoundryLaunchInput): {
  readonly nodePath: string;
  readonly entryPath: string;
  readonly cwd: string;
  readonly args: readonly string[];
  readonly adminPasswordConfigured: boolean;
  readonly setupOnly: boolean;
};
