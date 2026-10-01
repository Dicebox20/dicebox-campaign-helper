export interface CanonicalWorkerExpectation {
  readonly artifactId: string | null;
  readonly version: string | null;
  readonly sha256: string;
  readonly source: string | null;
}

export interface ServedWorkerTarget {
  readonly dataRoot: string;
  readonly worldId: string;
  readonly foundryVersion: string;
  readonly systemId: string;
  readonly systemVersion: string;
  readonly port: number;
}

export interface ServedWorkerAuditResult {
  readonly status: "PASS" | "BLOCKED";
  readonly target: ServedWorkerTarget;
  readonly request: {
    readonly method: "GET";
    readonly url: string;
    readonly path: "/modules/dicebox-campaign-helper/src/foundry-live-bridge.js";
    readonly allowlisted: true;
    readonly requestCount: 1;
  };
  readonly canonical: CanonicalWorkerExpectation;
  readonly served: {
    readonly status: number | null;
    readonly contentType: string | null;
    readonly sha256: string | null;
    readonly byteLength: number | null;
    readonly sourceServedParity: boolean;
    readonly canonicalParity: boolean;
  };
  readonly blockers: readonly string[];
  readonly noWrite: true;
  readonly readyClaim: false;
}

export declare function readCanonicalWorkerExpectation(specPath?: string): Promise<CanonicalWorkerExpectation>;

export declare function auditServedWorker(options?: {
  readonly baseUrl?: string;
  readonly sourcePath?: string;
  readonly specPath?: string;
  readonly target?: ServedWorkerTarget;
  readonly fetchImpl?: typeof fetch;
  readonly observedAt?: string;
}): Promise<ServedWorkerAuditResult>;
