export interface WorldLaunchFixtureReport {
  readonly operation: "dicebox.browser-driver.world-launch-repro.inspect";
  readonly status: "PASS";
  readonly evidenceClass: "deterministic";
  readonly host: "127.0.0.1";
  readonly persistentWrite: false;
  readonly foundryLaunch: false;
  readonly contract: {
    readonly selector: "a[data-action=worldLaunch]";
    readonly visibleText: "Launch World";
    readonly enabled: true;
    readonly delegated: true;
    readonly primaryButtonOnly: true;
    readonly navigationPrevented: true;
    readonly initialReceipt: "NOT_DISPATCHED";
    readonly dispatchedReceipt: "DISPATCHED_PRIMARY_WORLD_LAUNCH";
  };
  readonly blockers: readonly [];
  readonly readyClaim: false;
}

export interface WorldLaunchFixtureServer {
  readonly url: string;
  readonly report: WorldLaunchFixtureReport;
  close(): Promise<void>;
}

export function renderWorldLaunchFixture(): string;
export function inspectWorldLaunchFixture(): WorldLaunchFixtureReport;
export function startWorldLaunchFixture(options?: { readonly port?: number }): Promise<WorldLaunchFixtureServer>;
