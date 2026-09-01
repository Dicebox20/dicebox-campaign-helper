export interface OptionalModuleStageReceipt {
  readonly status: "PASS" | "BLOCKED";
  readonly packages: readonly Array<{
    readonly id: string;
    readonly version: string;
    readonly inventoryParity?: boolean;
  }>;
  readonly blockers: readonly string[];
  readonly worldRead: false;
  readonly worldCopied: false;
  readonly normalDataLaunched: false;
  readonly normalDataMutated: false;
  readonly overwrite: false;
  readonly noWriteOutsideIsolatedDestination: true;
  readonly readyClaim: false;
}

export declare function stageOptionalFoundryModules(options?: {
  readonly sourceDataPath?: string;
  readonly destinationDataPath?: string;
  readonly observedAt?: string;
}): Promise<OptionalModuleStageReceipt>;
