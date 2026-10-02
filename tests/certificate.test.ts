import { describe, expect, it } from "vitest";
import { createReadinessCertificate, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T13:00:00.000Z";
const foundryApi: Record<string, string> = {
  contract: "No runtime call; DiceBox ownership and safety contracts",
  static: "Foundry module.json + ES module syntax boundary",
  deterministic: "Versioned Foundry adapters, receipts, and read-back contracts",
  "isolated-browser": "Foundry client DOM/canvas plus module diagnostics surface",
  "visible-browser": "Foundry client, Hooks, game.users, document collections, and console evidence",
  "exact-runtime": "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread",
};
const source: Record<string, string> = {
  contract: "contract",
  static: "static-tooling",
  deterministic: "deterministic-fixture",
  "isolated-browser": "utility-harness",
  "visible-browser": "visible-chrome",
  "exact-runtime": "foundry-exact",
};

function lanes(exactStatus: "pass" | "blocked" | "unknown" = "blocked", exactEvidenceClass: "deterministic" | "full_function" | "blocked" = "blocked") {
  return ["contract", "static", "deterministic", "isolated-browser", "visible-browser", "exact-runtime"].map((id) => ({
    id,
    title: `${id} lane`,
    status: id === "exact-runtime" ? exactStatus : "pass" as const,
    source: source[id],
    evidenceClass: id === "exact-runtime" ? exactEvidenceClass : id === "static" ? "static" as const : "deterministic" as const,
    foundryApi: foundryApi[id],
    receiptIds: [],
    reason: id === "exact-runtime" && exactStatus !== "pass" ? "Exact-world evidence is unavailable." : "Fixture evidence supplied.",
  }));
}

function runtime(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry", "Scene"],
    capabilities: [],
    ...overrides,
  };
}

describe("blocker-based M11 readiness certificate", () => {
  it("keeps static and deterministic evidence blocked without exact runtime proof", () => {
    const result = createReadinessCertificate({ profile: runtime(), lanes: lanes(), observedAt });

    expect(result.certificate).toMatchObject({ status: "blocked", evidenceClass: "deterministic", noWrite: true });
    expect(result.certificate.summary).toEqual({ pass: 5, blocked: 1, unknown: 0, total: 6 });
    expect(result.certificate.blockers.some((blocker) => blocker.laneId === "exact-runtime")).toBe(true);
    expect(result.receipt).toMatchObject({ operation: "readiness-certificate.compose", status: "observed", evidenceClass: "deterministic" });
  });

  it("fills missing lanes as unknown and blocks a non-target profile", () => {
    const result = createReadinessCertificate({
      profile: runtime({ phase: "m0", foundryVersion: null, systemId: null, systemVersion: null, observedAt: null }),
      lanes: [],
      observedAt,
    });

    expect(result.certificate.status).toBe("blocked");
    expect(result.certificate.summary).toEqual({ pass: 0, blocked: 0, unknown: 6, total: 6 });
    expect(result.certificate.target.exactTargetMatch).toBe(false);
    expect(result.certificate.blockers.map((blocker) => blocker.laneId)).toContain("exact-runtime");
  });

  it("does not allow a visible-browser lane to substitute for exact Foundry evidence", () => {
    const supplied = lanes("pass", "deterministic").map((lane) => lane.id === "exact-runtime"
      ? { ...lane, source: "visible-chrome" as const, evidenceClass: "deterministic" as const }
      : lane);
    const result = createReadinessCertificate({ profile: runtime(), lanes: supplied, observedAt });

    expect(result.certificate.status).toBe("blocked");
    expect(result.certificate.blockers.some((blocker) => blocker.reason.includes("static/API evidence"))).toBe(true);
  });

  it("can represent a future fully proven exact stack without changing the evidence rules", () => {
    const result = createReadinessCertificate({
      profile: runtime(),
      lanes: lanes("pass", "full_function"),
      observedAt,
    });

    expect(result.certificate).toMatchObject({ status: "ready", evidenceClass: "full_function" });
    expect(result.certificate.blockers).toEqual([]);
    expect(result.receipt.evidenceClass).toBe("full_function");
  });

  it("rejects duplicate lanes and unreviewed API labels", () => {
    const canonical = lanes();
    expect(() => createReadinessCertificate({ profile: runtime(), lanes: [...canonical, canonical[0]], observedAt })).toThrow(/Duplicate certificate lane/);
    const tampered = canonical.map((lane) => lane.id === "contract" ? { ...lane, foundryApi: "arbitrary api" } : lane);
    expect(() => createReadinessCertificate({ profile: runtime(), lanes: tampered, observedAt })).toThrow(/reviewed Foundry API boundary/);
  });
});
