import { describe, expect, it } from "vitest";
import {
  createHarnessEvidenceBundle,
  createRuntimeFingerprint,
  createStableDiceBoxId,
  type HarnessLaneReceipt,
  type RuntimeProfile,
} from "@dicebox/core";

const observedAt = "2026-08-21T14:00:00.000Z";
const digest = "a".repeat(64);

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

const laneApis = {
  "isolated-browser": "Foundry client DOM/canvas plus module diagnostics surface",
  "visible-browser": "Foundry client, Hooks, game.users, document collections, and console evidence",
  "exact-runtime": "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread",
} as const;

function artifact(kind: "html-report" | "screenshot" | "redacted-json" | "runtime-receipt", name: string) {
  return {
    artifactId: createStableDiceBoxId("artifact", name),
    kind,
    sha256: digest,
    label: name,
  };
}

function checks() {
  const checkPairs = [
    ["ready-lifecycle", "Hooks.once(\"ready\")"],
    ["target-fingerprint", "game.version + game.system.id + game.system.version"],
    ["authority", "game.users.activeGM / User permissions"],
    ["native-operation", "native Foundry Document/embedded-document APIs"],
    ["authoritative-reread", "fromUuid / document collections / embedded-document getters"],
    ["recovery", "transaction journal + authoritative reread"],
    ["cross-client", "User permissions + visible GM/Player3 clients"],
  ] as const;
  return checkPairs.map(([id, foundryApi]) => ({ id, status: "pass" as const, foundryApi, reason: "Exact evidence check passed in the disposable fixture." }));
}

function receipt(
  profile: RuntimeProfile,
  laneId: "isolated-browser" | "visible-browser" | "exact-runtime",
  overrides: Partial<HarnessLaneReceipt> = {},
): HarnessLaneReceipt {
  const fingerprint = createRuntimeFingerprint(profile);
  const defaults = laneId === "isolated-browser"
    ? {
      status: "pass" as const,
      evidenceClass: "deterministic" as const,
      scope: "read-only" as const,
      contexts: [] as const,
      artifacts: [artifact("html-report", "utility-report"), artifact("redacted-json", "utility-receipt")],
      checks: [] as const,
    }
    : laneId === "visible-browser"
      ? {
        status: "pass" as const,
        evidenceClass: "deterministic" as const,
        scope: "read-only" as const,
        contexts: ["GM", "Player3"] as const,
        artifacts: [artifact("screenshot", "chrome-screenshot"), artifact("redacted-json", "chrome-receipt")],
        checks: [] as const,
      }
      : {
        status: "pass" as const,
        evidenceClass: "full_function" as const,
        scope: "disposable-fixture" as const,
        contexts: ["GM", "Player3"] as const,
        artifacts: [artifact("runtime-receipt", "exact-runtime"), artifact("redacted-json", "exact-receipt")],
        checks: checks(),
      };
  return {
    schemaVersion: "0.1.0",
    receiptId: createStableDiceBoxId("receipt", `${laneId}-evidence`),
    laneId,
    foundryApi: laneApis[laneId],
    target: {
      fingerprintId: fingerprint.fingerprintId,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
    },
    noRawData: true,
    observedAt,
    ...defaults,
    ...overrides,
  } as HarnessLaneReceipt;
}

describe("M14 fail-closed harness evidence bundle", () => {
  it("composes a blocked certificate when live lane receipts are absent", () => {
    const result = createHarnessEvidenceBundle({ profile: runtime(), receipts: [] });

    expect(result.bundle).toMatchObject({ status: "blocked", evidenceClass: "deterministic", noWrite: true });
    expect(result.bundle.certificate.summary).toEqual({ pass: 3, blocked: 0, unknown: 3, total: 6 });
    expect(result.bundle.certificate.blockers.some((entry) => entry.laneId === "exact-runtime")).toBe(true);
    expect(result.bundleReceipt.operation).toBe("harness-evidence.bundle");
  });

  it("accepts Utility Harness and visible Chrome receipts but keeps exact runtime blocked", () => {
    const profile = runtime();
    const result = createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(profile, "isolated-browser"), receipt(profile, "visible-browser")],
    });

    expect(result.bundle.certificate).toMatchObject({ status: "blocked", evidenceClass: "deterministic" });
    expect(result.bundle.certificate.summary).toEqual({ pass: 5, blocked: 0, unknown: 1, total: 6 });
    expect(result.bundle.certificate.blockers.some((entry) => entry.laneId === "exact-runtime")).toBe(true);
  });

  it("can represent a future complete exact fixture without promoting weaker evidence", () => {
    const profile = runtime();
    const result = createHarnessEvidenceBundle({
      profile,
      receipts: [
        receipt(profile, "isolated-browser"),
        receipt(profile, "visible-browser"),
        receipt(profile, "exact-runtime"),
      ],
    });

    expect(result.bundle).toMatchObject({ status: "ready", evidenceClass: "full_function" });
    expect(result.bundle.certificate.blockers).toEqual([]);
    expect(result.certificateReceipt.evidenceClass).toBe("full_function");
  });

  it("rejects exact receipts without GM/Player3 and required native checks", () => {
    const profile = runtime();
    expect(() => createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(profile, "exact-runtime", { contexts: ["GM"] })],
    })).toThrow(/GM and Player3/);
    expect(() => createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(profile, "exact-runtime", { checks: checks().slice(0, 2) })],
    })).toThrow(/requires passing authority/);
  });

  it("rejects mismatched fingerprints, duplicate lanes, and malformed artifact digests", () => {
    const profile = runtime();
    expect(() => createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(runtime({ systemVersion: "5.3.2" }), "visible-browser")],
    })).toThrow(/fingerprint does not match/);
    expect(() => createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(profile, "visible-browser"), { ...receipt(profile, "visible-browser"), receiptId: createStableDiceBoxId("receipt", "visible-duplicate") }],
    })).toThrow(/Duplicate harness lane/);
    expect(() => createHarnessEvidenceBundle({
      profile,
      receipts: [receipt(profile, "isolated-browser", { artifacts: [{ ...artifact("redacted-json", "bad-digest"), sha256: "not-a-digest" }] })],
    })).toThrow();
  });
});
