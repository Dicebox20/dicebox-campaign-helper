import { describe, expect, it } from "vitest";
import {
  createRuntimeFingerprint,
  createStateStoreSelectionPlan,
  createUnavailableStateStoreObservation,
  StateStoreSelectionPlanSchema,
  type RuntimeProfile,
  type StateStoreObservation,
} from "@dicebox/core";

function profile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt: "2026-08-21T12:00:00.000Z",
    activeModuleIds: [],
    documentTypes: ["JournalEntry", "Scene"],
    capabilities: [],
    ...overrides,
  };
}

function observation(overrides: Partial<StateStoreObservation> = {}): StateStoreObservation {
  return {
    evidenceClass: "deterministic",
    settings: {
      initHook: false,
      register: false,
      get: false,
      set: false,
      worldScope: false,
      authoritativeReread: false,
    },
    documentFlags: {
      getFlag: false,
      setFlag: false,
      unsetFlag: false,
      ownerDocumentBound: false,
      authoritativeReread: false,
    },
    journal: {
      create: false,
      update: false,
      embeddedPageCreate: false,
      fromUuid: false,
      collectionGet: false,
      authoritativeReread: false,
    },
    activeGm: "unknown",
    notes: [],
    ...overrides,
  };
}

function completeObservation(): StateStoreObservation {
  return {
    evidenceClass: "exact-runtime",
    settings: {
      initHook: true,
      register: true,
      get: true,
      set: true,
      worldScope: true,
      authoritativeReread: true,
    },
    documentFlags: {
      getFlag: true,
      setFlag: true,
      unsetFlag: true,
      ownerDocumentBound: true,
      authoritativeReread: true,
    },
    journal: {
      create: true,
      update: true,
      embeddedPageCreate: true,
      fromUuid: true,
      collectionGet: true,
      authoritativeReread: true,
    },
    activeGm: "observed",
    notes: ["Disposable exact-world fixture observation."],
  };
}

describe("StateStore selection and migration preview", () => {
  it("keeps the program as semantic owner and blocks Foundry persistence without exact evidence", () => {
    const target = createRuntimeFingerprint(profile({ foundryVersion: "14.365" }));
    const plan = createStateStoreSelectionPlan({ target, observation: observation() });

    expect(plan.status).toBe("blocked");
    expect(plan.noWrite).toBe(true);
    expect(plan.candidates.find((entry) => entry.kind === "program-json")?.status).toBe("selected");
    expect(plan.candidates.find((entry) => entry.kind === "foundry-settings")?.status).toBe("blocked");
    expect(plan.migration.status).toBe("blocked");
    expect(plan.migration.entries.find((entry) => entry.fieldId === "foreign.runtime-state")?.operation)
      .toBe("preserve-unknown");
  });

  it("does not promote API presence or a matching fingerprint without exact-runtime evidence", () => {
    const target = createRuntimeFingerprint(profile());
    const plan = createStateStoreSelectionPlan({
      target,
      observation: observation({
        settings: {
          initHook: true,
          register: true,
          get: true,
          set: true,
          worldScope: true,
          authoritativeReread: true,
        },
        activeGm: "observed",
      }),
    });

    expect(target.exactTargetMatch).toBe(true);
    expect(plan.evidenceClass).toBe("deterministic");
    expect(plan.status).toBe("blocked");
    expect(plan.blockers.some((blocker) => blocker.includes("Exact Foundry"))).toBe(true);
  });

  it("selects bounded Foundry candidates only for complete exact-runtime observations", () => {
    const target = createRuntimeFingerprint(profile());
    const plan = createStateStoreSelectionPlan({ target, observation: completeObservation() });

    expect(plan.status).toBe("ready");
    expect(plan.migration.status).toBe("preview-only");
    expect(plan.candidates.find((entry) => entry.kind === "foundry-settings")?.status).toBe("selected");
    expect(plan.candidates.find((entry) => entry.kind === "foundry-document-flags")?.status).toBe("candidate");
    expect(plan.candidates.find((entry) => entry.kind === "foundry-journal")?.status).toBe("candidate");
    expect(plan.candidates.flatMap((entry) => entry.foundryApis)).toContain("game.settings.set");
    expect(StateStoreSelectionPlanSchema.parse(plan)).toEqual(plan);
  });

  it("provides an unavailable observation that cannot authorize writes", () => {
    const target = createRuntimeFingerprint(profile({ phase: "runtime-probe" }));
    const plan = createStateStoreSelectionPlan({
      target,
      observation: createUnavailableStateStoreObservation(),
    });

    expect(plan.status).toBe("blocked");
    expect(plan.noWrite).toBe(true);
    expect(plan.nextGates.join(" ")).toContain("active-GM");
  });
});
