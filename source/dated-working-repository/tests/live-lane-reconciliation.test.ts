import { describe, expect, it } from "vitest";
import {
  createFoundryArtifactSpec,
  createLiveLaneReconciliationId,
  reconcileLiveLane,
  verifyLiveLaneReconciliationHash,
} from "@dicebox/compiler";
import {
  createRuntimeProfileExpectation,
  diffRuntimeProfile,
  scanRuntimeProfile,
  type RuntimeProfileScanInput,
} from "@dicebox/core";

const hash = (letter: string) => letter.repeat(64);
const target = {
  worldId: "dbx-test-world",
  foundryVersion: "14.367",
  systemId: "dnd5e",
  systemVersion: "5.3.3",
  packageId: "dicebox-campaign-helper" as const,
  packageVersion: "0.1.15",
  adapterId: "program-scene-vertical-slice",
  adapterVersion: "0.1.15",
};
const artifactTarget = {
  packageId: target.packageId,
  packageVersion: target.packageVersion,
  foundryVersion: target.foundryVersion,
  systemId: target.systemId,
  systemVersion: target.systemVersion,
  adapterId: target.adapterId,
  adapterVersion: target.adapterVersion,
};

async function fixture() {
  const spec = await createFoundryArtifactSpec({
    specId: "dbx:foundry-spec:live-lane-test",
    target: artifactTarget,
    artifacts: [
      { artifactId: "dbx:foundry-artifact:adapter", kind: "adapter", version: "0.1.15", sha256: hash("a"), source: "adapter" },
      { artifactId: "dbx:foundry-artifact:installer", kind: "installer", version: "0.1.15", sha256: hash("b"), source: "installer" },
      { artifactId: "dbx:foundry-artifact:package", kind: "package", version: "0.1.15", sha256: hash("c"), source: "package" },
      { artifactId: "dbx:foundry-artifact:runtime", kind: "runtime", version: "14.367", sha256: hash("d"), source: "runtime" },
      { artifactId: "dbx:foundry-artifact:worker", kind: "worker", version: "0.1.15", sha256: hash("e"), source: "worker" },
    ],
  });
  const scanInput: RuntimeProfileScanInput = {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt: "2026-08-27T20:00:00.000Z",
    activeModuleIds: ["regionwright", "dicebox-campaign-helper"],
    documentTypes: ["Scene", "Region", "Wall"],
    capabilities: [
      { id: "foundry.runtime.probe", state: "available", reason: "read-only probe" },
      { id: "foundry.document.write", state: "unavailable", reason: "not authorized" },
    ],
    package: { id: "dicebox-campaign-helper", version: "0.1.15", sha256: hash("c") },
    adapter: { id: "program-scene-vertical-slice", version: "0.1.15", sha256: hash("a") },
    activeGm: { status: "observed", source: "game.users.activeGM", userFingerprint: "redacted:deadbeef", isCurrentUser: true },
  };
  const scan = scanRuntimeProfile(scanInput);
  const profileExpectation = createRuntimeProfileExpectation({
    expectationId: "dbx:runtime-expectation:live-lane-test",
    target: {
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      package: scan.package,
      adapter: scan.adapter,
      activeModuleIds: scan.profile.activeModuleIds,
      documentTypes: scan.profile.documentTypes,
      activeGm: { status: scan.activeGm.status, source: scan.activeGm.source, isCurrentUser: scan.activeGm.isCurrentUser },
      capabilities: scan.profile.capabilities.map(({ id, state }) => ({ id, state })),
    },
  });
  const artifactObservation = {
    target: spec.target,
    artifacts: spec.artifacts,
  };
  const audit = {
    schemaVersion: "0.1.0" as const,
    operation: "foundry.fixture.observation.audit" as const,
    status: "reviewable" as const,
    evidenceClass: "full_function" as const,
    exactTargetMatch: true,
    readyClaim: false as const,
    noWrite: true as const,
    noRawData: true as const,
    foundryApiEvidence: "read-only-exercised" as const,
    receiptId: "dbx:receipt:fixture-observation-test",
    fixturePlanId: "dbx:plan:foundry-fixture-m21",
    blockers: [],
    notes: ["Read-only fixture audit."],
  };
  const base = {
    schemaVersion: "0.1.0" as const,
    reconciliationId: createLiveLaneReconciliationId("live-lane-test"),
    target,
    servedFiles: [{ relativePath: "module.json", sourceSha256: hash("f"), servedSha256: hash("f"), sourceBytes: 684, servedBytes: 684 }],
    artifactSpec: spec,
    artifactObservation,
    profileExpectation,
    profileScan: scan,
    supervisor: { status: "pass" as const, worldId: "dbx-test-world", port: 30001, worldDocumentWrites: 0, balladTouched: false, listenerMatches: true, noWrite: true as const },
    preflight: { status: "pass" as const, foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", moduleVersion: "0.1.15", checks: [{ id: "live-runtime-probe", status: "pass" as const }], noWrite: true as const },
    clients: [
      { context: "GM" as const, ready: true, exactTargetMatch: true, fingerprintId: scan.runtimeFingerprint.fingerprintId, isGM: true, activeGmStatus: "observed" as const, activeGmIsCurrentUser: true, noWrite: true as const },
      { context: "Player3" as const, ready: true, exactTargetMatch: true, fingerprintId: scan.runtimeFingerprint.fingerprintId, isGM: false, activeGmStatus: "observed" as const, activeGmIsCurrentUser: false, noWrite: true as const },
    ],
    fixtureAudits: [{ context: "GM" as const, audit }, { context: "Player3" as const, audit: { ...audit, receiptId: "dbx:receipt:fixture-observation-player-test" } }],
    programScenePreview: { status: "pass" as const, noWrite: true as const, applied: false as const, existingComplete: false, planSha256: hash("f"), blockers: [] },
  };
  return { base, scan, profileExpectation, spec };
}

describe("Stage 9 live-lane reconciliation", () => {
  it("composes a deterministic no-write pass only when every supplied lane passes", async () => {
    const { base } = await fixture();
    const result = await reconcileLiveLane(base);
    expect(result).toMatchObject({
      status: "pass",
      evidenceClass: "full_function",
      sourceServedStatus: "matched",
      promotion: "eligible",
      noWrite: true,
      readyClaim: false,
      foreignStatePreserved: true,
    });
    expect(await verifyLiveLaneReconciliationHash(result)).toBe(true);
    expect(diffRuntimeProfile(base.profileExpectation, base.profileScan)).toMatchObject({ status: "pass", promotion: "eligible" });
  });

  it("preserves artifact, fixture, supervisor, preflight, and preview blockers without authorizing apply", async () => {
    const { base, spec } = await fixture();
    const result = await reconcileLiveLane({
      ...base,
      servedFiles: [{ ...base.servedFiles[0], servedSha256: hash("9") }],
      artifactObservation: { target: spec.target, artifacts: spec.artifacts.map((artifact) => artifact.kind === "worker" ? { ...artifact, sha256: hash("9") } : artifact) },
      preflight: { ...base.preflight, status: "blocked", checks: [{ id: "live-runtime-probe", status: "not-tested" as const }] },
      supervisor: { ...base.supervisor, worldDocumentWrites: 1 },
      fixtureAudits: base.fixtureAudits.map(({ context, audit }) => ({ context, audit: { ...audit, status: "blocked" as const, evidenceClass: "blocked" as const, exactTargetMatch: false, blockers: ["seeded binding missing"] } })),
      programScenePreview: { ...base.programScenePreview, status: "blocked", blockers: ["existing fixture Scene is partial or drifted"] },
    });
    expect(result.status).toBe("blocked");
    expect(result.promotion).toBe("blocked");
    expect(result.noWrite).toBe(true);
    expect(result.readyClaim).toBe(false);
    expect(result.blockers.join(" ")).toMatch(/SHA-256 drift|live-runtime probe|world document writes|seeded binding missing|Program-Scene preview/);
    const tampered = { ...result, canonicalSha256: hash("0") };
    expect(await verifyLiveLaneReconciliationHash(tampered)).toBe(false);
  });

  it("requires distinct GM and Player3 contexts", async () => {
    const { base } = await fixture();
    await expect(reconcileLiveLane({ ...base, clients: [base.clients[0], { ...base.clients[1], context: "GM" }] })).rejects.toThrow(/exactly one GM and one Player3/);
  });
});
