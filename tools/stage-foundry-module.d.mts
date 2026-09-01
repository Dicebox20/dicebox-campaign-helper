export interface StageFoundryModuleOptions {
  readonly sourceRoot?: string;
  readonly destinationRoot?: string;
}

export interface StageFoundryModuleReport {
  readonly receiptVersion: 1;
  readonly receiptId: string;
  readonly operation: "foundry.module.stage";
  readonly status: "PASS" | "BLOCKED";
  readonly evidenceClass: "deterministic" | "blocked";
  readonly noWorldMutation: true;
  readonly destinationRoot: string | null;
  readonly packageId: "dicebox-campaign-helper";
  readonly files: readonly { readonly relativePath: string; readonly bytes: number; readonly sha256: string }[];
  readonly notes: readonly string[];
}

export function stageFoundryModule(options?: StageFoundryModuleOptions): Promise<StageFoundryModuleReport>;
