import {
  capabilityIds,
  createCapabilityRegistry,
  notReady,
  type CapabilityId,
  type CapabilitySupport,
  type Result,
  type RuntimeProfile,
  type SemanticRef,
  createRuntimeFingerprint,
  createRuntimeProbeReceipt,
  type RuntimeFingerprint,
  type RuntimeProbeReceipt,
  createUnobservedActiveGmEvidence,
  type ActiveGmEvidence,
  createUnavailableManagedJournalSnapshot,
  type ManagedJournalSnapshot,
  createUnavailableJournalApiEvidence,
  type JournalApiEvidence,
  createUnavailableActivityApiEvidence,
  type ActivityApiEvidence,
  createUnavailableActiveEffectApiEvidence,
  type ActiveEffectApiEvidence,
  createUnavailableRegionBehaviorApiEvidence,
  type RegionBehaviorApiEvidence,
  createUnavailableOptionalModuleApiEvidence,
  type OptionalModuleApiEvidence,
  createReadinessReport,
  type ReadinessReport,
  createReadinessCertificate,
  type ReadinessCertificateResult,
  createStateStoreSelectionPlan,
  createUnavailableStateStoreObservation,
  type StateStoreSelectionPlan,
} from "@dicebox/core";
import {
  previewManagedJournalEntry,
  type DocumentPlanPreview,
} from "@dicebox/compiler";

export interface ApiDescription {
  readonly packageId: "dicebox-campaign-helper";
  readonly contractVersion: "0.1.0";
  readonly phase: "m0" | "runtime-probe";
  readonly mutationEnabled: false;
}

export interface HealthStatus {
  readonly status: "safe-mode";
  readonly ready: false;
  readonly reason: string;
}

export type ReadonlyQuery =
  | { readonly kind: "health" }
  | { readonly kind: "capabilities" }
  | { readonly kind: "runtime-profile" }
  | { readonly kind: "runtime-evidence" }
  | { readonly kind: "managed-journal-snapshot" }
  | { readonly kind: "journal-api-evidence" }
  | { readonly kind: "activity-api-evidence" }
  | { readonly kind: "active-effect-api-evidence" }
  | { readonly kind: "region-behavior-api-evidence" }
  | { readonly kind: "optional-module-api-evidence" }
  | { readonly kind: "readiness-report" }
  | { readonly kind: "readiness-certificate" }
  | { readonly kind: "state-store-plan" };

export interface RuntimeEvidence {
  readonly profile: RuntimeProfile;
  readonly runtimeFingerprint: RuntimeFingerprint;
  readonly probeReceipt: RuntimeProbeReceipt;
  readonly activeGm: ActiveGmEvidence;
  readonly managedJournalSnapshot: ManagedJournalSnapshot;
  readonly journalApi: JournalApiEvidence;
  readonly activityApi: ActivityApiEvidence;
  readonly activeEffectApi: ActiveEffectApiEvidence;
  readonly regionBehaviorApi: RegionBehaviorApiEvidence;
  readonly optionalModuleApi: OptionalModuleApiEvidence;
  readonly stateStorePlan: StateStoreSelectionPlan;
  readonly readinessReport: ReadinessReport;
  readonly readinessCertificate: ReadinessCertificateResult;
}

function createBridgeCertificate(profile: RuntimeProfile): ReadinessCertificateResult {
  const lanes = [
    { id: "contract", title: "Contract evidence lane", status: "pass", source: "contract", evidenceClass: "static", foundryApi: "No runtime call; DiceBox ownership and safety contracts", receiptIds: [], reason: "DiceBox safety and ownership contracts are loaded." },
    { id: "static", title: "Static package lane", status: "pass", source: "static-tooling", evidenceClass: "static", foundryApi: "Foundry module.json + ES module syntax boundary", receiptIds: [], reason: "The program bridge is bounded to the reviewed Foundry package contract." },
    { id: "deterministic", title: "Deterministic fixture lane", status: "pass", source: "deterministic-fixture", evidenceClass: "deterministic", foundryApi: "Versioned Foundry adapters, receipts, and read-back contracts", receiptIds: [], reason: "Versioned adapter and receipt contracts are available." },
    { id: "isolated-browser", title: "Utility Harness lane", status: "unknown", source: "utility-harness", evidenceClass: "blocked", foundryApi: "Foundry client DOM/canvas plus module diagnostics surface", receiptIds: [], reason: "No reviewed exact-world Utility Harness receipt is attached." },
    { id: "visible-browser", title: "Visible Chrome lane", status: "unknown", source: "visible-chrome", evidenceClass: "blocked", foundryApi: "Foundry client, Hooks, game.users, document collections, and console evidence", receiptIds: [], reason: "No exact-world visible Chrome receipt is attached." },
    { id: "exact-runtime", title: "Exact Foundry lane", status: "blocked", source: "foundry-exact", evidenceClass: "blocked", foundryApi: "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread", receiptIds: [], reason: "Exact Foundry behavior, authority, operation, recovery, and reread evidence is unavailable." },
  ] as const;
  return createReadinessCertificate({ profile, lanes, observedAt: profile.observedAt });
}

export type M0Command = { readonly kind: "noop" };

export interface BridgeApi {
  describe(): ApiDescription;
  supports(capabilityId: CapabilityId): CapabilitySupport;
  previewDocument(input: unknown, options: { readonly authority?: "none" | "gm"; readonly observedAt: string }): DocumentPlanPreview;
  execute(command: M0Command): Promise<Result<never>>;
  query(query: ReadonlyQuery): Promise<Result<HealthStatus | RuntimeProfile | RuntimeEvidence | ManagedJournalSnapshot | JournalApiEvidence | ActivityApiEvidence | ActiveEffectApiEvidence | RegionBehaviorApiEvidence | OptionalModuleApiEvidence | StateStoreSelectionPlan | ReadinessReport | ReadinessCertificateResult | readonly CapabilitySupport[]>>;
  resolve(reference: SemanticRef): Result<never>;
  health(): HealthStatus;
}

export function createSafeModeRuntimeProfile(): RuntimeProfile {
  return {
  phase: "m0",
  foundryVersion: null,
  systemId: null,
  systemVersion: null,
  observedAt: null,
  activeModuleIds: [],
  documentTypes: [],
  capabilities: capabilityIds.map((id) => ({
    id,
    state: id === "bridge.describe" || id === "bridge.health" || id === "bridge.query" ? "available" : "unavailable",
    reason: "M0 exposes contracts only; exact runtime discovery is deferred to M1.",
  })),
  };
}

export function createBridgeApi(inputProfile: RuntimeProfile = createSafeModeRuntimeProfile()): BridgeApi {
  const profile = inputProfile;
  const registry = createCapabilityRegistry(profile);
  const baseEvidence = {
    profile,
    runtimeFingerprint: createRuntimeFingerprint(profile),
    probeReceipt: createRuntimeProbeReceipt(profile, "fixture"),
    activeGm: createUnobservedActiveGmEvidence(),
    managedJournalSnapshot: createUnavailableManagedJournalSnapshot(),
    journalApi: createUnavailableJournalApiEvidence(),
    activityApi: createUnavailableActivityApiEvidence(),
    activeEffectApi: createUnavailableActiveEffectApiEvidence(),
    regionBehaviorApi: createUnavailableRegionBehaviorApiEvidence(),
    optionalModuleApi: createUnavailableOptionalModuleApiEvidence(),
  };
  const stateStorePlan = createStateStoreSelectionPlan({
    target: baseEvidence.runtimeFingerprint,
    observation: createUnavailableStateStoreObservation(),
  });
  const readinessCertificate = createBridgeCertificate(profile);
  const runtimeEvidence: RuntimeEvidence = {
    ...baseEvidence,
    stateStorePlan,
    readinessReport: createReadinessReport(baseEvidence),
    readinessCertificate,
  };
  const health = (): HealthStatus => ({
    status: "safe-mode",
    ready: false,
    reason: profile.phase === "runtime-probe"
      ? "Exact runtime metadata was observed; mutation readiness is not enabled."
      : "Foundry runtime has not been probed.",
  });
  return {
    describe: () => ({
      packageId: "dicebox-campaign-helper",
      contractVersion: "0.1.0",
      phase: profile.phase === "m0" ? "m0" : "runtime-probe",
      mutationEnabled: false,
    }),
    supports: (capabilityId) => registry.supports(capabilityId),
    previewDocument: (input, options) => previewManagedJournalEntry(input, profile, options),
    execute: async (_command) => ({ ok: false, error: notReady("The M0 bridge is readiness-gated and has no executable runtime commands.") }),
    query: async (query) => query.kind === "health"
      ? { ok: true, value: health() }
      : query.kind === "runtime-profile"
        ? { ok: true, value: profile }
        : query.kind === "runtime-evidence"
          ? { ok: true, value: runtimeEvidence }
          : query.kind === "managed-journal-snapshot"
            ? { ok: true, value: runtimeEvidence.managedJournalSnapshot }
            : query.kind === "journal-api-evidence"
              ? { ok: true, value: runtimeEvidence.journalApi }
              : query.kind === "activity-api-evidence"
                ? { ok: true, value: runtimeEvidence.activityApi }
              : query.kind === "active-effect-api-evidence"
                ? { ok: true, value: runtimeEvidence.activeEffectApi }
                : query.kind === "region-behavior-api-evidence"
                  ? { ok: true, value: runtimeEvidence.regionBehaviorApi }
              : query.kind === "optional-module-api-evidence"
                    ? { ok: true, value: runtimeEvidence.optionalModuleApi }
                : query.kind === "state-store-plan"
                  ? { ok: true, value: runtimeEvidence.stateStorePlan }
                : query.kind === "readiness-report"
                  ? { ok: true, value: runtimeEvidence.readinessReport }
              : query.kind === "readiness-certificate"
                ? { ok: true, value: runtimeEvidence.readinessCertificate }
              : { ok: true, value: registry.all() },
    resolve: (_reference) => ({ ok: false, error: notReady("Runtime bindings are unavailable until the exact Foundry runtime is probed.") }),
    health,
  };
}
