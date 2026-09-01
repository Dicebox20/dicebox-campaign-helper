import { describe, expect, it } from "vitest";
import {
  compareFoundryArtifactHashes,
  createFoundryArtifactSpec,
  createFoundryVerifierExpectation,
  serializeFoundryArtifactSpec,
  verifyFoundryArtifactSpecHash,
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

const input: CreateFoundryArtifactSpecInput = {
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

async function makeSpec() {
  return createFoundryArtifactSpec(input);
}

describe("canonical Foundry installer/verifier artifact expectations", () => {
  it("normalizes the five exact artifact classes and hashes equivalent input deterministically", async () => {
    const first = await makeSpec();
    const second = await createFoundryArtifactSpec({ ...input, artifacts: [...input.artifacts].reverse() });
    expect(first.artifacts.map((artifact) => artifact.kind)).toEqual(["adapter", "installer", "package", "runtime", "worker"]);
    expect(second.specSha256).toBe(first.specSha256);
    expect(serializeFoundryArtifactSpec(first)).toBe(serializeFoundryArtifactSpec(second));
    expect(await verifyFoundryArtifactSpecHash(first)).toBe(true);
  });

  it("derives verifier expectations from the same canonical specification", async () => {
    const spec = await makeSpec();
    const verifier = await createFoundryVerifierExpectation({
      verifierId: "dbx:foundry-verifier:iggwilv-final-chamber",
      spec,
    });
    expect(verifier.sourceSpecId).toBe(spec.specId);
    expect(verifier.sourceSpecSha256).toBe(spec.specSha256);
    expect(verifier.expectedArtifacts).toEqual(spec.artifacts);
    expect(verifier.generatedFromCanonicalSpec).toBe(true);
    expect(verifier.noWrite).toBe(true);
  });

  it("passes only exact target and five-artifact parity", async () => {
    const spec = await makeSpec();
    const report = await compareFoundryArtifactHashes(spec, { target: spec.target, artifacts: spec.artifacts });
    expect(report.status).toBe("pass");
    expect(report.promotion).toBe("eligible");
    expect(report.blockers).toEqual([]);
    expect(report.comparisons.every((comparison) => comparison.status === "matched")).toBe(true);
  });

  it("blocks the known Iggwilv worker hash drift without mutation", async () => {
    const spec = await makeSpec();
    const installed = spec.artifacts.map((expected) => expected.kind === "worker" ? { ...expected, sha256: workerInstalled } : expected);
    const report = await compareFoundryArtifactHashes(spec, { target: spec.target, artifacts: installed });
    expect(report.status).toBe("blocked");
    expect(report.promotion).toBe("blocked");
    expect(report.comparisons.find((comparison) => comparison.expectedKind === "worker")?.status).toBe("hash-drift");
    expect(report.blockers.some((blocker) => blocker.includes(workerExpected) && blocker.includes(workerInstalled))).toBe(true);
    expect(report.noWrite).toBe(true);
  });

  it("blocks missing, version, target, and unexpected artifacts while preserving foreign IDs", async () => {
    const spec = await makeSpec();
    const withoutRuntime = spec.artifacts.filter((artifact) => artifact.kind !== "runtime");
    const installed = [
      ...withoutRuntime.map((artifact) => artifact.kind === "adapter" ? { ...artifact, version: "0.1.99" } : artifact),
      { ...spec.artifacts[0]!, artifactId: "dbx:foreign-artifact:kept" },
    ];
    const report = await compareFoundryArtifactHashes(spec, {
      target: { ...spec.target, foundryVersion: "14.365" },
      artifacts: installed,
    });
    expect(report.status).toBe("blocked");
    expect(report.targetMatch).toBe(false);
    expect(report.comparisons.find((comparison) => comparison.expectedKind === "runtime")?.status).toBe("missing");
    expect(report.comparisons.find((comparison) => comparison.expectedKind === "adapter")?.status).toBe("version-drift");
    expect(report.unexpectedArtifactIds).toEqual(["dbx:foreign-artifact:kept"]);
    expect(report.foreignArtifactsPreserved).toBe(true);
  });

  it("rejects duplicate observations and tampered canonical specifications", async () => {
    const spec = await makeSpec();
    await expect(compareFoundryArtifactHashes(spec, { target: spec.target, artifacts: [...spec.artifacts, spec.artifacts[0]] })).rejects.toThrow("unique stable artifact IDs");
    const tampered = { ...spec, artifacts: spec.artifacts.map((artifact) => artifact.kind === "worker" ? { ...artifact, sha256: workerInstalled } : artifact) };
    expect(await verifyFoundryArtifactSpecHash(tampered)).toBe(false);
    await expect(createFoundryVerifierExpectation({ verifierId: "dbx:foundry-verifier:tampered", spec: tampered })).rejects.toThrow("tampered artifact specification");
  });
});
