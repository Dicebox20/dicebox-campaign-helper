import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compileSceneFoundryPreview } from "@dicebox/compiler";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene.js";

const root = resolve(import.meta.dirname, "..");
const assetPath = resolve(root, "assets/maps/ascendancy-tram-calibration-graybox-v1.png");
const assetBytes = await readFile(assetPath);
const assetSha256 = createHash("sha256").update(assetBytes).digest("hex");
const asset = {
  sha256: assetSha256,
  mediaType: "image/png",
  byteLength: assetBytes.byteLength,
  relativePath: `assets/sha256/${assetSha256}`,
};
const plan = await compileSceneFoundryPreview({
  projectId: "dbx:project:desktop-foundation",
  scene: fixtureScene,
  assets: [asset],
  backgroundAssetSha256: assetSha256,
});
const output = {
  schemaVersion: "0.1.0",
  packageId: "dbx:package:program-scene-vertical-slice-v1",
  adapterVersion: "0.1.0",
  target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
  assetDeployment: {
    sourceSha256: assetSha256,
    sourceBytes: assetBytes.byteLength,
    sourcePath: "assets/maps/ascendancy-tram-calibration-graybox-v1.png",
    foundryPath: "modules/dicebox-campaign-helper/assets/maps/ascendancy-tram-calibration-graybox-v1.png",
  },
  plan,
};
const outputPath = resolve(root, "packages/dicebox-foundry/program-scene-vertical-slice-package.json");
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  operation: "dicebox.program-scene-vertical-slice.write",
  status: "PASS",
  outputPath,
  planSha256: plan.planSha256,
  candidateCount: plan.documents.length,
  sourceAssetSha256: assetSha256,
  noFoundryWrite: true,
}, null, 2));
