import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ID = "dicebox-campaign-helper";
const REQUIRED_FILES = [
  "module.json",
  "src/entry-20260823-program-scene-v2.js",
  "src/module.js",
  "src/module-byte-attestation.json",
  "src/persistent-world-write-accounting.js",
  "src/signal-rune-identity-observation.js",
  "src/ascendancy-installer.js",
  "src/foundry-live-bridge.js",
  "src/tram-calibration-installer.js",
  "src/tram-routing-fixture-installer.js",
  "src/tram-rush-hour-dialog.js",
  "src/tram-coordinate-calibration.js",
  "src/tram-access-behavior.js",
  "src/tram-access-fixture-installer.js",
  "src/program-scene-vertical-slice.js",
  "src/signal-rune-furnishing-preview.js",
  "src/signal-rune-partial-install-preview.js",
  "ascendancy-campaign-package.json",
  "tram-calibration-package.json",
  "tram-routing-fixture-package.json",
  "program-scene-vertical-slice-package.json",
  "assets/maps/ascendancy-tram-depot-v3.png",
  "assets/maps/ascendancy-signal-frequency-chamber-v2.png",
  "assets/maps/ascendancy-rune-mechanism-chamber-v2.png",
  "assets/maps/ascendancy-central-core-control-chamber-v2.png",
  "assets/maps/manual-central-core-control-chamber-v5-neutral.png",
  "assets/maps/ascendancy-tram-calibration-graybox-v1.png",
  "assets/maps/ascendancy-tram-calibration-marker-v1.svg",
  "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
  "assets/tiles/ascendancy-tram-rail-grid-v2.svg",
  "assets/tiles/ascendancy-tram-rail-grid-v3.svg",
  "assets/tiles/ascendancy-tram-core-rail-v2.svg",
  "assets/tiles/ascendancy-tram-gate-v2.svg",
  "assets/tiles/ascendancy-tram-car-horizontal-v1.svg",
  "assets/tiles/ascendancy-tram-car-vertical-v1.svg",
];

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash("sha256").update(bytes).digest("hex");
}

function blocked(reason, destinationRoot) {
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:foundry-stage-${PACKAGE_ID}`,
    operation: "foundry.module.stage",
    status: "BLOCKED",
    evidenceClass: "blocked",
    noWorldMutation: true,
    destinationRoot: destinationRoot ? resolve(destinationRoot) : null,
    packageId: PACKAGE_ID,
    files: [],
    notes: Object.freeze([reason, "No existing world, module installation, or unrelated file was removed or overwritten."]),
  });
}

export async function stageFoundryModule(options = {}) {
  const sourceRoot = typeof options.sourceRoot === "string" && options.sourceRoot.length > 0
    ? resolve(options.sourceRoot)
    : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const destinationRoot = typeof options.destinationRoot === "string" && options.destinationRoot.length > 0
    ? resolve(options.destinationRoot)
    : null;
  if (!destinationRoot) return blocked("An explicit disposable destinationRoot is required.", null);

  const sourceModuleRoot = join(sourceRoot, "packages", "dicebox-foundry");
  const sourceManifest = join(sourceModuleRoot, "module.json");
  const sourceBootstrap = join(sourceModuleRoot, "src", "entry-20260823-program-scene-v2.js");
  const sourceEntry = join(sourceModuleRoot, "src", "module.js");
  const sourceModuleByteAttestation = join(sourceModuleRoot, "src", "module-byte-attestation.json");
  const sourcePersistentWorldWriteAccounting = join(sourceModuleRoot, "src", "persistent-world-write-accounting.js");
  const sourceIdentityObservation = join(sourceModuleRoot, "src", "signal-rune-identity-observation.js");
  const sourceInstaller = join(sourceModuleRoot, "src", "ascendancy-installer.js");
  const sourceLiveBridge = join(sourceModuleRoot, "src", "foundry-live-bridge.js");
  const sourceCalibration = join(sourceModuleRoot, "src", "tram-calibration-installer.js");
  const sourceRouting = join(sourceModuleRoot, "src", "tram-routing-fixture-installer.js");
  const sourceTramRushHour = join(sourceModuleRoot, "src", "tram-rush-hour-dialog.js");
  const sourceCoordinateCalibration = join(sourceModuleRoot, "src", "tram-coordinate-calibration.js");
  const sourceTramAccessBehavior = join(sourceModuleRoot, "src", "tram-access-behavior.js");
  const sourceTramAccessInstaller = join(sourceModuleRoot, "src", "tram-access-fixture-installer.js");
  const sourceProgramSceneAdapter = join(sourceModuleRoot, "src", "program-scene-vertical-slice.js");
  const sourceSignalRunePreview = join(sourceModuleRoot, "src", "signal-rune-furnishing-preview.js");
  const sourceSignalRunePartialPreview = join(sourceModuleRoot, "src", "signal-rune-partial-install-preview.js");
  const sourcePackage = join(sourceModuleRoot, "ascendancy-campaign-package.json");
  const sourceCalibrationPackage = join(sourceModuleRoot, "tram-calibration-package.json");
  const sourceRoutingPackage = join(sourceModuleRoot, "tram-routing-fixture-package.json");
  const sourceProgramScenePackage = join(sourceModuleRoot, "program-scene-vertical-slice-package.json");
  const sourceAssets = REQUIRED_FILES.filter((relativePath) => relativePath.startsWith("assets/")).map((relativePath) => join(sourceRoot, relativePath));
  if (!existsSync(sourceManifest) || !existsSync(sourceBootstrap) || !existsSync(sourceEntry) || !existsSync(sourceModuleByteAttestation) || !existsSync(sourcePersistentWorldWriteAccounting) || !existsSync(sourceIdentityObservation) || !existsSync(sourceInstaller) || !existsSync(sourceLiveBridge) || !existsSync(sourceCalibration) || !existsSync(sourceRouting) || !existsSync(sourceTramRushHour) || !existsSync(sourceCoordinateCalibration) || !existsSync(sourceTramAccessBehavior) || !existsSync(sourceTramAccessInstaller) || !existsSync(sourceProgramSceneAdapter) || !existsSync(sourceSignalRunePreview) || !existsSync(sourceSignalRunePartialPreview) || !existsSync(sourcePackage) || !existsSync(sourceCalibrationPackage) || !existsSync(sourceRoutingPackage) || !existsSync(sourceProgramScenePackage) || sourceAssets.some((asset) => !existsSync(asset))) {
    return blocked("The reviewed Foundry package is missing one or more required module, installer, or compiled campaign files.", destinationRoot);
  }
  let manifest;
  try {
    manifest = JSON.parse(await readFile(sourceManifest, "utf8"));
  } catch {
    return blocked("The reviewed Foundry module manifest is not valid JSON.", destinationRoot);
  }
  if (manifest.id !== PACKAGE_ID || manifest.version !== "0.1.15" || !Array.isArray(manifest.esmodules) || manifest.esmodules.length !== 1 || manifest.esmodules[0] !== "src/entry-20260823-program-scene-v2.js") {
    return blocked("The reviewed module manifest does not have the canonical package identity and ES module entry.", destinationRoot);
  }

  const destinationModuleRoot = join(destinationRoot, "modules", PACKAGE_ID);
  if (existsSync(destinationModuleRoot)) {
    return blocked("The destination module directory already exists; staging refuses to overwrite it.", destinationRoot);
  }

  await mkdir(join(destinationModuleRoot, "src"), { recursive: true });
  await mkdir(join(destinationModuleRoot, "assets", "maps"), { recursive: true });
  await mkdir(join(destinationModuleRoot, "assets", "tiles"), { recursive: true });
  await writeFile(join(destinationModuleRoot, "module.json"), await readFile(sourceManifest));
  await writeFile(join(destinationModuleRoot, "src", "entry-20260823-program-scene-v2.js"), await readFile(sourceBootstrap));
  await writeFile(join(destinationModuleRoot, "src", "module.js"), await readFile(sourceEntry));
  await writeFile(join(destinationModuleRoot, "src", "module-byte-attestation.json"), await readFile(sourceModuleByteAttestation));
  await writeFile(join(destinationModuleRoot, "src", "persistent-world-write-accounting.js"), await readFile(sourcePersistentWorldWriteAccounting));
  await writeFile(join(destinationModuleRoot, "src", "signal-rune-identity-observation.js"), await readFile(sourceIdentityObservation));
  await writeFile(join(destinationModuleRoot, "src", "ascendancy-installer.js"), await readFile(sourceInstaller));
  await writeFile(join(destinationModuleRoot, "src", "foundry-live-bridge.js"), await readFile(sourceLiveBridge));
  await writeFile(join(destinationModuleRoot, "src", "tram-calibration-installer.js"), await readFile(sourceCalibration));
  await writeFile(join(destinationModuleRoot, "src", "tram-routing-fixture-installer.js"), await readFile(sourceRouting));
  await writeFile(join(destinationModuleRoot, "src", "tram-rush-hour-dialog.js"), await readFile(sourceTramRushHour));
  await writeFile(join(destinationModuleRoot, "src", "tram-coordinate-calibration.js"), await readFile(sourceCoordinateCalibration));
  await writeFile(join(destinationModuleRoot, "src", "tram-access-behavior.js"), await readFile(sourceTramAccessBehavior));
  await writeFile(join(destinationModuleRoot, "src", "tram-access-fixture-installer.js"), await readFile(sourceTramAccessInstaller));
  await writeFile(join(destinationModuleRoot, "src", "program-scene-vertical-slice.js"), await readFile(sourceProgramSceneAdapter));
  await writeFile(join(destinationModuleRoot, "src", "signal-rune-furnishing-preview.js"), await readFile(sourceSignalRunePreview));
  await writeFile(join(destinationModuleRoot, "src", "signal-rune-partial-install-preview.js"), await readFile(sourceSignalRunePartialPreview));
  await writeFile(join(destinationModuleRoot, "ascendancy-campaign-package.json"), await readFile(sourcePackage));
  await writeFile(join(destinationModuleRoot, "tram-calibration-package.json"), await readFile(sourceCalibrationPackage));
  await writeFile(join(destinationModuleRoot, "tram-routing-fixture-package.json"), await readFile(sourceRoutingPackage));
  await writeFile(join(destinationModuleRoot, "program-scene-vertical-slice-package.json"), await readFile(sourceProgramScenePackage));
  await Promise.all(sourceAssets.map((asset) => copyFile(asset, join(destinationModuleRoot, relative(sourceRoot, asset)))));
  const files = await Promise.all(REQUIRED_FILES.map(async (relativePath) => {
    const stagedPath = join(destinationModuleRoot, relativePath);
    const metadata = await stat(stagedPath);
    return Object.freeze({ relativePath, bytes: metadata.size, sha256: await sha256(stagedPath) });
  }));
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:foundry-stage-${PACKAGE_ID}`,
    operation: "foundry.module.stage",
    status: "PASS",
    evidenceClass: "deterministic",
    noWorldMutation: true,
    destinationRoot,
    packageId: PACKAGE_ID,
    files: Object.freeze(files),
    notes: Object.freeze([
      "The reviewed module, compiled package, and renderer candidates were copied beneath the explicit destinationRoot/modules/dicebox-campaign-helper path. The campaign package remains authoritative for binding: all four neutral room renderers are scene-bound locally, while exact geometry remains Blueprint-owned and native/runtime evidence remains separate.",
      "Staging is not a live Foundry load and does not establish game.version, permissions, authority, behavior, or read-back evidence.",
    ]),
  });
}

async function main() {
  const report = await stageFoundryModule({
    sourceRoot: resolve(dirname(fileURLToPath(import.meta.url)), ".."),
    destinationRoot: process.env.DICEBOX_FOUNDRY_STAGE_PATH,
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main();
