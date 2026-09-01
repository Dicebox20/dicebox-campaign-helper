export interface StageFixtureLicenseOptions {
  readonly sourceRoot?: string;
  readonly destinationRoot?: string;
  readonly now?: () => Date;
}

export interface StageFixtureLicenseReceipt {
  readonly receiptVersion: 1;
  readonly receiptId: string;
  readonly operation: "foundry.fixture.stage-license";
  readonly timestamp?: string;
  readonly status: "PASS" | "BLOCKED";
  readonly evidenceClass: "fixture" | "blocked";
  readonly readyClaim: false;
  readonly noWrite: boolean;
  readonly worldDocumentWrites: 0;
  readonly balladTouched: false;
  readonly target: Record<string, unknown>;
  readonly blockers: readonly string[];
  readonly [key: string]: unknown;
}

export function stageFixtureLicense(options?: StageFixtureLicenseOptions): Promise<StageFixtureLicenseReceipt>;
