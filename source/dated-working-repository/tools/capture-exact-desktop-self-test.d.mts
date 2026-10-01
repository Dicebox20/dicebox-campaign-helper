export type BoundedCaptureReceipt = {
  readonly operation: string;
  readonly status: string;
  readonly executable: string;
  readonly executableName: string;
  readonly exitCode: number | null;
  readonly signal: string | null;
  readonly stdout: { readonly text: string; readonly truncated: boolean };
  readonly stderr: { readonly text: string; readonly truncated: boolean };
  readonly timeout: {
    readonly timedOut: boolean;
    readonly timeoutMs: number;
    readonly graceMs: number | null;
    readonly killRequested: boolean;
    readonly childExitObserved: boolean;
    readonly killError: string | null;
    readonly childError: string | null;
  };
  readonly noProjectOrSessionInspection: true;
  readonly noRecoveryInvocationByRunner: true;
};

export function captureBoundedChild(options: {
  readonly executable: string;
  readonly args?: readonly string[];
  readonly outputPath: string;
  readonly cwd?: string;
  readonly timeoutMs?: number;
  readonly timeoutGraceMs?: number;
  readonly spawnImpl?: (...args: any[]) => any;
}): Promise<BoundedCaptureReceipt>;

export function assertExactDesktopSelfTestCaptureTarget(executableInput: string, outputInput: string): {
  readonly executable: string;
  readonly outputPath: string;
};
