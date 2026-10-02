import { describe, expect, it } from "vitest";
import {
  compareFoundryArtifactHashes,
  createFoundryArtifactSpec,
  createIggwilvLegacyFixtureEvidence,
  serializeIggwilvLegacyFixtureEvidence,
  verifyIggwilvLegacyFixtureEvidenceHash,
  type CreateFoundryArtifactSpecInput,
} from "@dicebox/compiler";

const workerExpected = "460f79b11ea457ec9efc3dcbe2c8d2c534516054d8247944f26096245df5cf35";
const workerInstalled = "60be1aa71386c3457bd313e319e7133724e752e1077f396050a056e69e4425a2";
const artifact = (kind: CreateFoundryArtifactSpecInput["artifacts"][number]["kind"], suffix: string, sha256: string) => ({
  artifactId: `dbx:foundry-artifact:${suffix}`,
  kind,
  version: kind === "runtime" ? "14.367" : "0.1.15",
  sha256,
  source: `fixture/${suffix}`,
});

const specInput: CreateFoundryArtifactSpecInput = {
  specId: "dbx:foundry-spec:iggwilv-final-chamber",
  target: {
    packageVersion: "0.1.15",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    adapterId: "program-scene-vertical-slice",
    adapterVersion: "0.1.15",
  },
  artifacts: [
    artifact("worker", "worker", workerExpected),
    artifact("runtime", "runtime", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"),
    artifact("adapter", "adapter", "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"),
    artifact("package", "package", "cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"),
    artifact("installer", "installer", "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"),
  ],
};

async function makeParity(observedWorker = workerExpected) {
  const spec = await createFoundryArtifactSpec(specInput);
  const artifacts = spec.artifacts.map((expected) => expected.kind === "worker"
    ? { ...expected, sha256: observedWorker }
    : expected);
  return {
    spec,
    report: await compareFoundryArtifactHashes(spec, { target: spec.target, artifacts }),
  };
}

function source() {
  return {
    chat: {
      conversationId: "6a8d229e-48d4-83e8-bb79-defa7247e0ff",
      manifestSha256: "f15bd45ff3b600778b44d31d271c68521ac832c94a6e03ab66db883998f072dd",
      sourceReceipt: "outputs/m218-iggwilv-chat-runtime-reconciliation-receipt.json",
    },
    runtime: {
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      worldId: "the-lost-mine-of-phandalin",
      sceneId: "qn2AcIJc8oCKymiI",
      sceneUuid: "Scene.qn2AcIJc8oCKymiI",
      sceneExportSha256: "c0e43faec47235ae1420c5ef4d8e5b2bb45c5bc46b56d86f1dbce72783ae3d88",
      sceneExportBytes: 44942,
      canvas: { width: 1250, height: 1250 },
      gridSize: 50,
      walls: 62,
      regions: 8,
      levels: 1,
      tiles: 0,
      tokens: 0,
      lights: 0,
      anchorBehaviors: 6,
      behaviorEvent: "tokenEnter",
    },
    renderer: {
      path: "Puzzles/CastleOfDreams_IggwilvTower_Map_FinalChamber_Anchors_f96c1d5270.webp",
      sha256: "f96c1d527002f758695e1095a273b85fb62d6b0c20827c1ec191ee9d7e33ae2e",
      byteLength: 136816,
      dimensions: { width: 1250, height: 1250 },
      source: "outputs/m218-iggwilv-chat-runtime-reconciliation-receipt.json",
    },
  };
}

function observedBounds(space: "image-pixels" | "scene-pixels", reviewedBy: string | null) {
  return {
    status: "observed" as const,
    source: "fixture-only supplied Region overlay observation",
    reviewedBy,
    objects: Array.from({ length: 8 }, (_, index) => ({
      label: `region-${index + 1}`,
      coordinateSpace: space,
      x: index * 50,
      y: index * 50,
      width: 50,
      height: 50,
      confidence: reviewedBy ? null : 0.95,
      padding: 0,
    })),
  };
}

async function completeInput() {
  const { spec, report } = await makeParity();
  return {
    schemaVersion: "0.1.0" as const,
    fixtureId: "dbx:fixture:iggwilv-final-chamber",
    fixtureKind: "iggwilv-final-chamber" as const,
    evidenceLabel: "fixture" as const,
    source: source(),
    transform: {
      status: "observed" as const,
      image: { width: 1250, height: 1250 },
      scene: { width: 1250, height: 1250 },
      gridSize: 50,
      scale: { x: 1, y: 1 },
      offset: { x: 0, y: 0 },
      coordinateSpace: "scene-pixels" as const,
      source: "fixture-only explicit image-to-Scene transform",
    },
    proposedBounds: observedBounds("image-pixels", null),
    acceptedBounds: observedBounds("scene-pixels", "GM fixture reviewer"),
    digests: {
      prediction: { status: "observed" as const, sha256: "1111111111111111111111111111111111111111111111111111111111111111", source: "fixture-only prediction observation" },
      blueprint: { status: "observed" as const, sha256: "2222222222222222222222222222222222222222222222222222222222222222", source: "fixture-only Spatial Blueprint observation" },
    },
    artifactParity: {
      status: report.status === "pass" ? "pass" as const : "blocked" as const,
      specId: spec.specId,
      specSha256: spec.specSha256,
      report,
      source: "M249 canonical artifact specification fixture",
      blockers: report.blockers,
      noWrite: true as const,
      foreignArtifactsPreserved: true as const,
    },
    authoritativeRegionReread: {
      status: "authoritative" as const,
      source: "fixture-only supplied reread observation",
      foundryApi: "fromUuid + scene.getEmbeddedCollection(\"Region\")",
      sceneUuid: "Scene.qn2AcIJc8oCKymiI",
      regionCount: 8,
      regionRuntimeIds: Array.from({ length: 8 }, (_, index) => `Region.fixture-${index + 1}`),
      exactTargetMatch: true as const,
      matchesAcceptedBounds: true as const,
      readbackSha256: "3333333333333333333333333333333333333333333333333333333333333333",
    },
    geometryAuthority: "spatial-blueprint" as const,
    rendererRole: "renderer-only" as const,
    macroRole: "legacy-transport-only" as const,
    noWrite: true as const,
    readyClaim: false as const,
  };
}

describe("Iggwilv legacy fixture evidence envelope", () => {
  it("preserves the supplied M218 facts and blocks missing evidence without invention", async () => {
    const { spec, report } = await makeParity(workerInstalled);
    const evidence = await createIggwilvLegacyFixtureEvidence({
      ...(await completeInput()),
      transform: { status: "unavailable", source: "M218 reconciliation receipt", reason: "Exact scale and offset were not supplied." },
      proposedBounds: { status: "unavailable", source: "M218 reconciliation receipt", reason: "Object bounds were not supplied." },
      acceptedBounds: { status: "unavailable", source: "M218 reconciliation receipt", reason: "GM-approved bounds were not supplied." },
      digests: {
        prediction: { status: "unavailable", source: "M218 reconciliation receipt", reason: "Prediction digest was not supplied." },
        blueprint: { status: "unavailable", source: "M218 reconciliation receipt", reason: "Spatial Blueprint digest was not supplied." },
      },
      artifactParity: {
        status: "blocked",
        specId: spec.specId,
        specSha256: spec.specSha256,
        report,
        source: "M249 known Iggwilv worker drift",
        blockers: report.blockers,
        noWrite: true,
        foreignArtifactsPreserved: true,
      },
      authoritativeRegionReread: { status: "unavailable", source: "M218 reconciliation receipt", reason: "No current authoritative Region reread was supplied." },
    });

    expect(evidence.promotion).toBe("blocked");
    expect(evidence.source.renderer.dimensions).toEqual({ width: 1250, height: 1250 });
    expect(evidence.source.runtime.gridSize).toBe(50);
    expect(evidence.geometryAuthority).toBe("spatial-blueprint");
    expect(evidence.macroRole).toBe("legacy-transport-only");
    expect(evidence.noWrite).toBe(true);
    expect(evidence.readyClaim).toBe(false);
    expect(evidence.blockers.some((blocker) => blocker.includes("scale and offset"))).toBe(true);
    expect(evidence.blockers.some((blocker) => blocker.includes("worker"))).toBe(true);
    expect(await verifyIggwilvLegacyFixtureEvidenceHash(evidence)).toBe(true);
  });

  it("accepts a complete supplied fixture observation only when every gate is present", async () => {
    const evidence = await createIggwilvLegacyFixtureEvidence(await completeInput());

    expect(evidence.promotion).toBe("eligible");
    expect(evidence.blockers).toEqual([]);
    expect(evidence.artifactParity.status).toBe("pass");
    expect(evidence.authoritativeRegionReread.status).toBe("authoritative");
    expect(await verifyIggwilvLegacyFixtureEvidenceHash(evidence)).toBe(true);
    expect(serializeIggwilvLegacyFixtureEvidence(evidence)).toBe(serializeIggwilvLegacyFixtureEvidence({ ...evidence }));
  });

  it("blocks renderer drift and rejects tampered or authority-changing evidence", async () => {
    const evidence = await createIggwilvLegacyFixtureEvidence(await completeInput());
    const drifted = await createIggwilvLegacyFixtureEvidence({
      ...(await completeInput()),
      source: { ...(await completeInput()).source, renderer: { ...(await completeInput()).source.renderer, dimensions: { width: 1200, height: 1250 } } },
    });
    expect(drifted.promotion).toBe("blocked");
    expect(drifted.blockers.some((blocker) => blocker.includes("dimensions"))).toBe(true);
    expect(await verifyIggwilvLegacyFixtureEvidenceHash({ ...evidence, geometryAuthority: "renderer" })).toBe(false);
    expect(await verifyIggwilvLegacyFixtureEvidenceHash({ ...evidence, evidenceSha256: "0".repeat(64) })).toBe(false);
  });
});
