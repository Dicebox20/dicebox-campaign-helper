import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ID = "dicebox-campaign-helper";
const FILES = [
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

async function hash(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

export async function updateFoundryModule({ sourceRoot, destinationRoot } = {}) {
  const source = resolve(sourceRoot ?? fileURLToPath(new URL("..", import.meta.url)));
  const destination = typeof destinationRoot === "string" && destinationRoot.trim().length > 0 ? resolve(destinationRoot) : null;
  if (!destination) throw new Error("An explicit destinationRoot is required.");
  const sourceRootModule = join(source, "packages", "dicebox-foundry");
  const destinationModule = join(destination, "modules", PACKAGE_ID);
  if (!existsSync(destinationModule)) throw new Error("The existing DiceBox module directory was not found; use foundry:stage for first installation.");
  const existingManifest = JSON.parse(await readFile(join(destinationModule, "module.json"), "utf8"));
  if (existingManifest.id !== PACKAGE_ID) throw new Error("Refusing to overwrite a module directory whose manifest is not DiceBox-owned.");
  await mkdir(join(destinationModule, "src"), { recursive: true });
  await mkdir(join(destinationModule, "assets", "maps"), { recursive: true });
  await mkdir(join(destinationModule, "assets", "tiles"), { recursive: true });
  for (const relativePath of FILES) {
    const sourcePath = relativePath.startsWith("assets/") ? join(source, relativePath) : join(sourceRootModule, relativePath);
    await copyFile(sourcePath, join(destinationModule, relativePath));
  }
  const files = [];
  for (const relativePath of FILES) {
    const target = join(destinationModule, relativePath);
    files.push({ relativePath, bytes: (await stat(target)).size, sha256: await hash(target) });
  }
  return { receiptVersion: 1, receiptId: `dbx:receipt:foundry-update-${PACKAGE_ID}`, operation: "foundry.module.update", status: "PASS", evidenceClass: "deterministic", noWorldMutation: true, destinationRoot: destination, packageId: PACKAGE_ID, files };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  updateFoundryModule({ sourceRoot: fileURLToPath(new URL("..", import.meta.url)), destinationRoot: process.env.DICEBOX_FOUNDRY_STAGE_PATH }).then((receipt) => console.log(JSON.stringify(receipt, null, 2))).catch((error) => { console.error(error.message); process.exitCode = 2; });
}
