import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename, dirname, join, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { stageFoundryModule } from "./stage-foundry-module.mjs";

const WORLD_ID = "dbx-test-world";
const TARGET = Object.freeze({ foundry: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
const REQUIRED_PACKAGE_IDS = Object.freeze({ system: "dnd5e", regionwright: "regionwright" });
const TRANSIENT_LEVELDB_FILENAMES = new Set(["LOCK"]);

function blocked(reason, destinationRoot = null) {
  return Object.freeze({
    receiptVersion: 1,
    operation: "foundry.fixture.provision",
    status: "BLOCKED",
    evidenceClass: "blocked",
    noBalladWorldAccess: true,
    noWorldMutation: true,
    worldId: WORLD_ID,
    destinationRoot,
    packages: [],
    notes: Object.freeze([reason]),
  });
}

async function json(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function fingerprint(path) {
  const bytes = await readFile(path);
  return Object.freeze({ bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}

function pathIsRoot(path) {
  return parse(path).root === path;
}

function pathContains(parent, child) {
  const normalizedParent = parent.endsWith("\\") || parent.endsWith("/") ? parent : `${parent}${process.platform === "win32" ? "\\" : "/"}`;
  return child === parent || child.startsWith(normalizedParent);
}

/**
 * Create a fresh, isolated Foundry fixture data path. This intentionally does
 * not read any world directory: package directories are the only copied inputs.
 */
export async function provisionDisposableFixture(options = {}) {
  const sourceDataPath = typeof options.sourceDataPath === "string" && options.sourceDataPath.trim()
    ? resolve(options.sourceDataPath)
    : null;
  const destinationRoot = typeof options.destinationRoot === "string" && options.destinationRoot.trim()
    ? resolve(options.destinationRoot)
    : null;
  const sourceRoot = typeof options.sourceRoot === "string" && options.sourceRoot.trim()
    ? resolve(options.sourceRoot)
    : resolve(dirname(fileURLToPath(import.meta.url)), "..");
  if (!sourceDataPath || !existsSync(sourceDataPath)) return blocked("An explicit readable source data path is required for reviewed system/module packages.");
  if (!destinationRoot || pathIsRoot(destinationRoot)) return blocked("An explicit non-root destinationRoot is required.", destinationRoot);
  if (pathContains(sourceDataPath, destinationRoot) || pathContains(destinationRoot, sourceDataPath)) {
    return blocked("The disposable destinationRoot and source data path may not overlap or contain one another.", destinationRoot);
  }
  if (existsSync(destinationRoot)) return blocked("The destinationRoot already exists; provisioning refuses to overwrite or merge a fixture.", destinationRoot);

  const systemSource = join(sourceDataPath, "systems", REQUIRED_PACKAGE_IDS.system);
  const regionwrightSource = join(sourceDataPath, "modules", REQUIRED_PACKAGE_IDS.regionwright);
  const systemManifest = await json(join(systemSource, "system.json"));
  const regionwrightManifest = await json(join(regionwrightSource, "module.json"));
  if (systemManifest?.id !== TARGET.systemId || systemManifest?.version !== TARGET.systemVersion) {
    return blocked(`Source system must be ${TARGET.systemId}@${TARGET.systemVersion}.`, destinationRoot);
  }
  if (regionwrightManifest?.id !== REQUIRED_PACKAGE_IDS.regionwright) {
    return blocked("The reviewed Regionwright package manifest is missing or mismatched.", destinationRoot);
  }

  let createdDestinationRoot = false;
  try {
    await mkdir(dirname(destinationRoot), { recursive: true });
    await mkdir(destinationRoot, { recursive: false });
    createdDestinationRoot = true;
  // Desktop Foundry treats --dataPath as its user-data root. Content packages
  // and worlds live below its Data directory, alongside Config and Logs.
  const dataPath = join(destinationRoot, "Data");
  const worldRoot = join(dataPath, "worlds", WORLD_ID);
  await mkdir(worldRoot, { recursive: true });
    const copyOptions = {
      recursive: true,
      errorOnExist: true,
      force: false,
      // Foundry keeps LevelDB lock sentinels open while a package is in use.
      // They are runtime-only and must be recreated by the isolated fixture.
      filter: (source) => !TRANSIENT_LEVELDB_FILENAMES.has(basename(source)),
    };
  await cp(systemSource, join(dataPath, "systems", TARGET.systemId), copyOptions);
  await cp(regionwrightSource, join(dataPath, "modules", REQUIRED_PACKAGE_IDS.regionwright), copyOptions);
    const world = {
      id: WORLD_ID,
      title: "DiceBox Disposable Ascendancy Fixture",
      system: TARGET.systemId,
      systemVersion: TARGET.systemVersion,
      coreVersion: TARGET.foundry,
      compatibility: { minimum: "14", verified: TARGET.foundry },
      safeMode: false,
      flags: {
        diceboxCampaignHelper: {
          fixture: true,
          sourceWorldCopied: false,
          resetScope: "owned-fixture-only",
        },
      },
    };
    await writeFile(join(worldRoot, "world.json"), `${JSON.stringify(world, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  const dicebox = await stageFoundryModule({ sourceRoot, destinationRoot: dataPath });
    if (dicebox.status !== "PASS") throw new Error(`DiceBox module staging failed: ${dicebox.notes.join(" ")}`);

    const copied = await Promise.all([
    packageReceipt("system", systemSource, join(dataPath, "systems", TARGET.systemId), "system.json"),
    packageReceipt("module", regionwrightSource, join(dataPath, "modules", REQUIRED_PACKAGE_IDS.regionwright), "module.json"),
    ]);
    const worldManifest = join(worldRoot, "world.json");
    const worldReceipt = await fingerprint(worldManifest);
  const forbiddenBalladPath = join(dataPath, "worlds", "the-ballad-of-chauser-bill");
    const noBalladWorldAccess = !existsSync(forbiddenBalladPath);
    return Object.freeze({
      receiptVersion: 1,
      operation: "foundry.fixture.provision",
      status: noBalladWorldAccess ? "PASS" : "BLOCKED",
      evidenceClass: "created_document",
      noBalladWorldAccess,
      noWorldMutation: true,
    worldId: WORLD_ID,
    destinationRoot,
    dataPath,
      sourceDataPath,
      packages: Object.freeze(copied),
      diceboxStageReceipt: Object.freeze({ receiptId: dicebox.receiptId, packageId: dicebox.packageId, files: dicebox.files }),
      worldManifest: Object.freeze({ path: worldManifest, ...worldReceipt }),
      notes: Object.freeze([
      "Only reviewed dnd5e, Regionwright, and DiceBox package directories were copied into the fresh isolated desktop-Foundry Data path.",
        "No world directory, user collection, asset, setting, actor, scene, or LevelDB collection was read from or copied from the Ballad campaign.",
        "The fixture is not launched or module-activated by provisioning; runtime authority, behavior, and reset evidence remain separate gates.",
      ]),
    });
  } catch (error) {
    let cleanup = "not-needed";
    if (createdDestinationRoot) {
      try {
        await rm(destinationRoot, { recursive: true, force: true });
        cleanup = "created destination removed";
      } catch (cleanupError) {
        cleanup = `cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : String(cleanupError)}`;
      }
    }
    return Object.freeze({
      ...blocked(`Fixture provisioning failed: ${error instanceof Error ? error.message : String(error)}`, destinationRoot),
      status: "UNKNOWN",
      evidenceClass: "blocked",
      cleanup,
      notes: Object.freeze([
        `Fixture provisioning failed: ${error instanceof Error ? error.message : String(error)}`,
        `Recovery cleanup: ${cleanup}.`,
        "No retry or runtime launch is implied by an outcome-unknown provisioning result.",
      ]),
    });
  }
}

async function packageReceipt(kind, sourceRoot, destinationRoot, manifestFile) {
  const sourceManifest = join(sourceRoot, manifestFile);
  const destinationManifest = join(destinationRoot, manifestFile);
  const [source, destination] = await Promise.all([fingerprint(sourceManifest), fingerprint(destinationManifest)]);
  if (source.sha256 !== destination.sha256 || source.bytes !== destination.bytes) throw new Error(`${kind} manifest copy fingerprint mismatch.`);
  return Object.freeze({ kind, sourceManifest, destinationManifest, ...source });
}

async function main() {
  const report = await provisionDisposableFixture({
    sourceDataPath: process.env.DICEBOX_FIXTURE_SOURCE_DATA_PATH,
    destinationRoot: process.env.DICEBOX_FIXTURE_ROOT ?? process.env.DICEBOX_FIXTURE_DATA_PATH,
    sourceRoot: resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main();
