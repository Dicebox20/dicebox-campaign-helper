export interface FoundryPreflightOptions {
  readonly dataPath?: string;
  readonly worldId?: string;
}

export interface FoundryPreflightReport {
  readonly receiptVersion: 1;
  readonly receiptId: string;
  readonly operation: "foundry.fixture.preflight";
  readonly status: "PASS" | "BLOCKED";
  readonly evidenceClass: "deterministic";
  readonly noWrite: true;
  readonly target: {
    readonly foundry: "14.367";
    readonly system: "dnd5e";
    readonly systemVersion: "5.3.3";
  };
  readonly selected: { readonly worldId: string; readonly dataPathConfigured: boolean };
  readonly observed: Record<string, string | null>;
  readonly checks: readonly {
    readonly id: string;
    readonly status: "PASS" | "BLOCKED" | "UNKNOWN" | "NOT_TESTED";
    readonly title: string;
    readonly foundryApi: string;
    readonly reason: string;
  }[];
  readonly notes: readonly string[];
}

export function createPreflightReport(options?: FoundryPreflightOptions): FoundryPreflightReport;
