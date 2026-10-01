import { describe, expect, it } from "vitest";
import {
  createRuntimeProfileExpectation,
  diffRuntimeProfile,
  scanRuntimeProfile,
  serializeRuntimeProfileScan,
  validateRuntimeProfileScan,
  type RuntimeProfileScanInput,
} from "@dicebox/core";

const packageEvidence = { id: "dicebox-campaign-helper" as const, version: "0.1.15", sha256: "a".repeat(64) };
const adapterEvidence = { id: "program-scene-vertical-slice", version: "0.1.15", sha256: "b".repeat(64) };

function input(overrides: Partial<RuntimeProfileScanInput> = {}): RuntimeProfileScanInput {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt: "2026-08-27T12:00:00.000Z",
    activeModuleIds: ["regionwright", "dicebox-campaign-helper"],
    documentTypes: ["Scene", "Region", "Wall"],
    capabilities: [
      { id: "foundry.runtime.probe", state: "available", reason: "read-only observation" },
      { id: "foundry.document.write", state: "unavailable", reason: "mutation gate remains closed" },
    ],
    package: packageEvidence,
    adapter: adapterEvidence,
    activeGm: { status: "observed", source: "game.users.activeGM", userFingerprint: "redacted:deadbeef", isCurrentUser: true },
    ...overrides,
  };
}

function expectation(scan: ReturnType<typeof scanRuntimeProfile>) {
  return createRuntimeProfileExpectation({
    expectationId: "dbx:runtime-expectation:fixture-14367",
    target: {
      foundryVersion: scan.profile.foundryVersion!,
      systemId: scan.profile.systemId!,
      systemVersion: scan.profile.systemVersion!,
      package: scan.package,
      adapter: scan.adapter,
      activeModuleIds: scan.profile.activeModuleIds,
      documentTypes: scan.profile.documentTypes,
      activeGm: { status: scan.activeGm.status, source: scan.activeGm.source, isCurrentUser: scan.activeGm.isCurrentUser },
      capabilities: scan.profile.capabilities.map(({ id, state }) => ({ id, state })),
    },
  });
}

describe("RuntimeProfile scan and target-bound diff", () => {
  it("normalizes supplied observations and preserves canonical fingerprint integrity", () => {
    const scan = scanRuntimeProfile(input({ activeModuleIds: ["dicebox-campaign-helper", "regionwright"], documentTypes: ["Wall", "Scene", "Region"] }));
    expect(scan.status).toBe("observed");
    expect(scan.profile.activeModuleIds).toEqual(["dicebox-campaign-helper", "regionwright"]);
    expect(scan.profile.documentTypes).toEqual(["Region", "Scene", "Wall"]);
    expect(scan.profile.capabilities.map(({ id }) => id)).toEqual(["foundry.document.write", "foundry.runtime.probe"]);
    expect(scan.noWrite).toBe(true);
    expect(scan.readyClaim).toBe(false);
    expect(() => validateRuntimeProfileScan(scan)).not.toThrow();
  });

  it("produces a deterministic exact-parity diff and serialization", () => {
    const scan = scanRuntimeProfile(input());
    const target = expectation(scan);
    const second = scanRuntimeProfile(input({ activeModuleIds: [...input().activeModuleIds].reverse(), documentTypes: [...input().documentTypes].reverse() }));
    expect(second.runtimeFingerprint.fingerprintId).toBe(scan.runtimeFingerprint.fingerprintId);
    expect(diffRuntimeProfile(target, scan)).toMatchObject({ status: "pass", promotion: "eligible", exactTargetMatch: true, readyClaim: false, preserveUnknown: true });
    expect(serializeRuntimeProfileScan(scan)).toBe(serializeRuntimeProfileScan(second));
  });

  it("blocks Foundry, system, package, adapter, module, document, active-GM, and capability drift", () => {
    const scan = scanRuntimeProfile(input());
    const target = expectation(scan);
    const drifted = scanRuntimeProfile(input({
      foundryVersion: "14.365",
      systemVersion: "5.2.0",
      package: { ...packageEvidence, sha256: "c".repeat(64) },
      adapter: { ...adapterEvidence, version: "0.1.99" },
      activeModuleIds: ["dicebox-campaign-helper", "other-module"],
      documentTypes: ["Scene"],
      activeGm: { status: "unknown", source: "none", userFingerprint: null, isCurrentUser: null },
      capabilities: [{ id: "foundry.runtime.probe", state: "unknown", reason: "not observed" }],
    }));
    const report = diffRuntimeProfile(target, drifted);
    expect(report.status).toBe("blocked");
    expect(report.promotion).toBe("blocked");
    expect(report.differences.map(({ field }) => field)).toEqual(expect.arrayContaining([
      "foundryVersion", "systemVersion", "package", "adapter", "activeModuleIds", "documentTypes", "activeGm.status", "capabilities", "runtimeFingerprint.exactTargetMatch",
    ]));
    expect(report.readyClaim).toBe(false);
    expect(report.preserveUnknown).toBe(true);
  });

  it("fails closed for m0/unknown target state and duplicate canonical entries", () => {
    const m0 = scanRuntimeProfile(input({ phase: "m0", foundryVersion: null, systemId: null, systemVersion: null, activeModuleIds: [], documentTypes: [], capabilities: [], activeGm: { status: "unknown", source: "fixture", userFingerprint: null, isCurrentUser: null } }));
    expect(m0.status).toBe("blocked");
    const target = expectation(scanRuntimeProfile(input()));
    expect(diffRuntimeProfile(target, m0).promotion).toBe("blocked");
    expect(() => scanRuntimeProfile(input({ activeModuleIds: ["regionwright", "regionwright"] }))).toThrow(/unique values/);
    expect(() => scanRuntimeProfile(input({ capabilities: [{ id: "foundry.runtime.probe", state: "available", reason: "one" }, { id: "foundry.runtime.probe", state: "available", reason: "two" }] }))).toThrow(/unique IDs/);
  });

  it("rejects a tampered fingerprint rather than treating it as a valid scan", () => {
    const scan = scanRuntimeProfile(input());
    const tampered = { ...scan, runtimeFingerprint: { ...scan.runtimeFingerprint, exactTargetMatch: false } };
    expect(() => validateRuntimeProfileScan(tampered)).toThrow(/fingerprint/);
  });
});
