export interface ProvisionDisposableFixtureOptions {
  readonly sourceDataPath?: string;
  readonly destinationRoot?: string;
  readonly sourceRoot?: string;
}

export interface FixturePackageReceipt {
  readonly kind: "system" | "module";
  readonly sourceManifest: string;
  readonly destinationManifest: string;
  readonly bytes: number;
  readonly sha256: string;
}

export interface DisposableFixtureProvisionReceipt {
  readonly receiptVersion: 1;
  readonly operation: "foundry.fixture.provision";
  readonly status: "PASS" | "BLOCKED" | "UNKNOWN";
  readonly evidenceClass: "created_document" | "blocked";
  readonly noBalladWorldAccess: true;
  readonly noWorldMutation: true;
  readonly worldId: "dbx-test-world";
  readonly destinationRoot: string | null;
  readonly dataPath?: string;
  readonly sourceDataPath?: string;
  readonly packages: readonly FixturePackageReceipt[];
  readonly cleanup?: string;
  readonly notes: readonly string[];
}

export function provisionDisposableFixture(options?: ProvisionDisposableFixtureOptions): Promise<DisposableFixtureProvisionReceipt>;
