import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  attestApprovedAssetBytes,
  createAssetAttestationGate,
  createCampaignHelperMapLabPlan,
  validateCampaignHelperMapLabPackage,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const packagePath = resolve(root, "packages/dicebox-compiler/campaign-helper-map-lab-package.json");
const assetPath = resolve(root, "assets/testing/campaign-helper-map-lab-v1.svg");
const packageData = validateCampaignHelperMapLabPackage(JSON.parse(readFileSync(packagePath, "utf8")));
const assetBytes = readFileSync(assetPath);

describe("Campaign Helper Map Lab", () => {
  it("uses the Campaign Helper blueprint and attestation surfaces for a local no-write package", () => {
    const plan = createCampaignHelperMapLabPlan();
    expect(packageData.plan).toEqual(plan);
    expect(packageData).toMatchObject({
      operation: "campaign-helper.map-lab.package",
      status: "ready-local",
      evidenceClass: "local",
      noWrite: true,
      mutation: "disabled",
      preservation: { foreignState: "preserve-unknown-foreign-runtime-state", nativeDocuments: "not-created" },
    });
    expect(packageData.assetAttestationGate).toMatchObject({ status: "ready", noWrite: true, dependentDocumentIds: [] });
    expect(packageData.assetManifest.assets).toHaveLength(1);
    expect(packageData.provenance.copiedRuntimeCode).toBe(false);
  });

  it("keeps blueprint geometry authoritative and renderer bytes exactly attested", () => {
    const { blueprint, sequenceGate, visual } = packageData.plan;
    expect(blueprint.bounds).toEqual({ width: 1536, height: 1024 });
    expect(blueprint.grid).toEqual({ size: 64, unitsPerCell: 5 });
    expect(blueprint.walls).toHaveLength(6);
    expect(blueprint.regions).toHaveLength(5);
    expect(blueprint.anchors).toHaveLength(6);
    expect(sequenceGate.inputAnchorIds).toHaveLength(4);
    expect(sequenceGate.requiredSequence).toEqual(sequenceGate.inputAnchorIds);
    expect(sequenceGate.state).toBe("locked");
    expect(sequenceGate.solved).toBe(false);
    expect(visual.rendererOnly).toBe(true);
    expect(visual.noBakedGrid).toBe(true);

    const asset = packageData.assetManifest.assets[0]!;
    expect(asset.byteLength).toBe(assetBytes.byteLength);
    expect(asset.sha256).toBe(createHash("sha256").update(assetBytes).digest("hex"));
    expect(packageData.assetAttestationGate.attestations[0]?.status).toBe("attested");
  });

  it("fails closed when the renderer bytes drift", async () => {
    const asset = packageData.assetManifest.assets[0]!;
    const drift = Buffer.from(`${assetBytes.toString("utf8")}drift`, "utf8");
    const attestation = await attestApprovedAssetBytes(asset, drift, { observedAt: "2026-09-06T00:00:00.000Z" });
    expect(attestation.status).toBe("mismatch");
    const gate = createAssetAttestationGate({
      manifest: packageData.assetManifest,
      requiredAssetIds: [asset.assetId],
      dependentDocumentIds: [],
      attestations: [attestation],
      observedAt: "2026-09-06T00:00:00.000Z",
    });
    expect(gate).toMatchObject({ status: "blocked", noWrite: true });
  });

  it("does not smuggle the retired Tram fixture or runtime mutation surface into the package", () => {
    const serialized = JSON.stringify(packageData).toLowerCase();
    expect(serialized).not.toContain("tram");
    expect(serialized).not.toContain("foundrydocuments");
    expect(serialized).not.toContain("runtimebinding");
    expect(serialized).not.toContain("execute");
    expect(serialized).not.toContain("eval");
  });
});
