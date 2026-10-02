import { createHash } from "node:crypto";
import { cp, lstat, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET = Object.freeze({ foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", worldId: "dbx-test-world" });
const ALLOWED = Object.freeze({
  dae: Object.freeze({ version: "14.0.13" }),
  "midi-qol": Object.freeze({ version: "14.0.11" }),
});

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

function isWithin(parent, child) {
  const rel = relative(resolve(parent), resolve(child));
  return rel === "" || (!rel.startsWith("..") && !rel.includes(`..${process.platform === "win32" ? "\\" : "/"}`));
}

function blocked(blockers, sourceDataPath, destinationDataPath) {
  return Object.freeze({
    receiptVersion: 1,
    operation: "foundry.fixture.optional-module-stage",
    status: "BLOCKED",
    evidenceClass: "fixture",
    evidenceLabel: "fixture",
    target: TARGET,
    sourceDataPath: sourceDataPath ?? null,
    destinationDataPath: destinationDataPath ?? null,
    packages: [],
    blockers: Object.freeze([...blockers]),
    worldRead: false,
    worldCopied: false,
    normalDataLaunched: false,
    normalDataMutated: false,
    overwrite: false,
    noWriteOutsideIsolatedDestination: true,
    readyClaim: false,
  });
}

async function inventory(root) {
  const files = [];
  async function visit(current, prefix = "") {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const path = join(current, entry.name);
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) throw new Error(`Symbolic links are not allowed in an optional module: ${rel}`);
      if (entry.isDirectory()) await visit(path, rel);
      else if (entry.isFile()) {
        const bytes = await readFile(path);
        files.push(Object.freeze({ path: rel, bytes: bytes.byteLength, sha256: sha256(bytes) }));
      } else throw new Error(`Unsupported filesystem entry in optional module: ${rel}`);
    }
  }
  await visit(root);
  return Object.freeze({ files: Object.freeze(files), fileCount: files.length, byteLength: files.reduce((sum, file) => sum + file.bytes, 0) });
}

async function readManifest(moduleRoot) {
  const manifestPath = join(moduleRoot, "module.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  return Object.freeze({ path: manifestPath, id: manifest.id ?? null, version: manifest.version ?? null, sha256: sha256(await readFile(manifestPath)), byteLength: (await lstat(manifestPath)).size });
}

function inventoryMatches(left, right) {
  if (left.fileCount !== right.fileCount || left.byteLength !== right.byteLength || left.files.length !== right.files.length) return false;
  return left.files.every((file, index) => file.path === right.files[index].path && file.bytes === right.files[index].bytes && file.sha256 === right.files[index].sha256);
}

export async function stageOptionalFoundryModules({
  sourceDataPath,
  destinationDataPath,
  observedAt = new Date().toISOString(),
} = {}) {
  const sourceData = typeof sourceDataPath === "string" && sourceDataPath.trim() ? resolve(sourceDataPath) : null;
  const destinationData = typeof destinationDataPath === "string" && destinationDataPath.trim() ? resolve(destinationDataPath) : null;
  if (!sourceData || !destinationData) return blocked(["An explicit source and destination Data path are required."], sourceData, destinationData);
  const sourceModules = join(sourceData, "modules");
  const destinationModules = join(destinationData, "modules");
  if (isWithin(sourceData, destinationData) || isWithin(destinationData, sourceData)) return blocked(["Source and destination Data paths may not overlap."], sourceData, destinationData);
  const blockers = [];
  const packageReceipts = [];
  for (const [id, expected] of Object.entries(ALLOWED)) {
    const sourceRoot = join(sourceModules, id);
    const destinationRoot = join(destinationModules, id);
    try {
      const sourceStat = await lstat(sourceRoot);
      if (!sourceStat.isDirectory()) blockers.push(`The reviewed optional module source is not a directory: ${id}.`);
      if (await lstat(destinationRoot).then(() => true).catch(() => false)) blockers.push(`The isolated destination already exists and will not be overwritten: ${id}.`);
      const manifest = await readManifest(sourceRoot);
      if (manifest.id !== id || manifest.version !== expected.version) blockers.push(`Optional module ${id} manifest identity/version does not match the approved ${id}@${expected.version}.`);
      const sourceInventory = await inventory(sourceRoot);
      packageReceipts.push({ id, expectedVersion: expected.version, sourceRoot, destinationRoot, sourceManifest: manifest, sourceInventory });
    } catch (error) {
      blockers.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (blockers.length > 0) return blocked(blockers, sourceData, destinationData);
  await mkdir(destinationModules, { recursive: true });
  for (const receipt of packageReceipts) await cp(receipt.sourceRoot, receipt.destinationRoot, { recursive: true, force: false, errorOnExist: true });
  const verifiedPackages = [];
  const verificationBlockers = [];
  for (const receipt of packageReceipts) {
    try {
      const destinationManifest = await readManifest(receipt.destinationRoot);
      const destinationInventory = await inventory(receipt.destinationRoot);
      if (destinationManifest.id !== receipt.id || destinationManifest.version !== receipt.expectedVersion) verificationBlockers.push(`Destination manifest drifted for ${receipt.id}.`);
      if (!inventoryMatches(receipt.sourceInventory, destinationInventory)) verificationBlockers.push(`Destination inventory drifted for ${receipt.id}.`);
      verifiedPackages.push(Object.freeze({
        id: receipt.id,
        version: receipt.expectedVersion,
        sourceRoot: receipt.sourceRoot,
        destinationRoot: receipt.destinationRoot,
        sourceManifest: receipt.sourceManifest,
        destinationManifest,
        sourceInventory: receipt.sourceInventory,
        destinationInventory,
        inventoryParity: inventoryMatches(receipt.sourceInventory, destinationInventory),
      }));
    } catch (error) {
      verificationBlockers.push(error instanceof Error ? error.message : String(error));
    }
  }
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `m264-optional-modules-${observedAt.replaceAll(/[^0-9A-Za-z]/g, "")}`,
    operation: "foundry.fixture.optional-module-stage",
    status: verificationBlockers.length === 0 ? "PASS" : "BLOCKED",
    evidenceClass: "fixture",
    evidenceLabel: "fixture",
    observedAt,
    target: TARGET,
    sourceDataPath: sourceData,
    destinationDataPath: destinationData,
    allowedPackages: Object.freeze(Object.entries(ALLOWED).map(([id, value]) => Object.freeze({ id, version: value.version }))),
    packages: Object.freeze(verifiedPackages),
    blockers: Object.freeze(verificationBlockers),
    worldRead: false,
    worldCopied: false,
    normalDataLaunched: false,
    normalDataMutated: false,
    overwrite: false,
    noWriteOutsideIsolatedDestination: true,
    supervisorState: "not-started-by-this-routine",
    loadedBehavior: "not-observed",
    activeGm: "not-observed",
    readyClaim: false,
    doesNotProve: Object.freeze(["loaded-optional-module-behavior", "permissions", "active-gm-authority", "client-session", "bindings", "document-mutation", "Stage 9 acceptance"]),
  });
}

async function main() {
  const sourceDataPath = process.env.DICEBOX_OPTIONAL_SOURCE_DATA_PATH ?? (process.env.LOCALAPPDATA ? resolve(process.env.LOCALAPPDATA, "FoundryVTT", "Data") : null);
  const destinationDataPath = process.env.DICEBOX_OPTIONAL_DEST_DATA_PATH ?? resolve(repoRoot, "work", "foundry-fixture-data-v3", "Data");
  const receipt = await stageOptionalFoundryModules({
    sourceDataPath,
    destinationDataPath,
    observedAt: process.env.DICEBOX_OPTIONAL_OBSERVED_AT ?? new Date().toISOString(),
  });
  if (process.env.DICEBOX_OPTIONAL_RECEIPT) await writeFile(resolve(process.env.DICEBOX_OPTIONAL_RECEIPT), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
