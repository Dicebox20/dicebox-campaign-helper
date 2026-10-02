import { copyFile, mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { constants, existsSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import { dirname, isAbsolute, join, parse, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LICENSE_RELATIVE_PATH = join("Config", "license.json");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

function pathWithin(parent, child) {
  const comparison = relative(resolve(parent), resolve(child));
  return comparison === "" || (!comparison.startsWith("..") && !isAbsolute(comparison));
}

function blocked(blockers, details = {}) {
  return {
    receiptVersion: 1,
    receiptId: `dbx:receipt:fixture-license-${randomUUID()}`,
    operation: "foundry.fixture.stage-license",
    status: "BLOCKED",
    evidenceClass: "blocked",
    readyClaim: false,
    noWrite: true,
    worldDocumentWrites: 0,
    balladTouched: false,
    blockers: [...blockers],
    ...details,
  };
}

function targetReceipt(sourceRoot, destinationRoot) {
  return {
    sourceRoot: resolve(sourceRoot),
    destinationRoot: resolve(destinationRoot),
    sourcePath: resolve(sourceRoot, LICENSE_RELATIVE_PATH),
    destinationPath: resolve(destinationRoot, LICENSE_RELATIVE_PATH),
    relativePath: LICENSE_RELATIVE_PATH.replaceAll("\\", "/"),
  };
}

export async function stageFixtureLicense({ sourceRoot, destinationRoot, now = () => new Date() } = {}) {
  const source = typeof sourceRoot === "string" && sourceRoot.trim() ? resolve(sourceRoot) : null;
  const destination = typeof destinationRoot === "string" && destinationRoot.trim() ? resolve(destinationRoot) : null;
  const target = source && destination ? targetReceipt(source, destination) : { sourceRoot: source, destinationRoot: destination };
  const base = {
    receiptVersion: 1,
    receiptId: "dbx:receipt:fixture-license-stage",
    operation: "foundry.fixture.stage-license",
    timestamp: now().toISOString(),
    evidenceClass: "fixture",
    readyClaim: false,
    noWrite: false,
    worldDocumentWrites: 0,
    balladTouched: false,
    target,
  };
  const blockers = [];
  if (!source || !destination) blockers.push("Explicit sourceRoot and destinationRoot are required.");
  if (source && parse(source).root === source) blockers.push("A filesystem root cannot be used as a license source root.");
  if (destination && parse(destination).root === destination) blockers.push("A filesystem root cannot be used as a license destination root.");
  if (source && destination && (source.toLowerCase() === destination.toLowerCase() || pathWithin(source, destination) || pathWithin(destination, source))) {
    blockers.push("Source and destination roots must be distinct and non-overlapping.");
  }
  if (blockers.length > 0) return { ...base, ...blocked(blockers, { target }) };

  const sourcePath = resolve(source, LICENSE_RELATIVE_PATH);
  const destinationPath = resolve(destination, LICENSE_RELATIVE_PATH);
  const temporaryPath = `${destinationPath}.${process.pid}.${Date.now()}.tmp`;
  let sourceBytes;
  try {
    const sourceStats = await stat(sourcePath);
    if (!sourceStats.isFile()) return { ...base, ...blocked(["The source Config/license.json is not a regular file."], { target }) };
    sourceBytes = await readFile(sourcePath);
  } catch (error) {
    return { ...base, ...blocked([`The source Config/license.json could not be read: ${error instanceof Error ? error.message : String(error)}`], { target }) };
  }
  if (existsSync(destinationPath)) return { ...base, ...blocked(["The destination Config/license.json already exists; overwrite is refused."], { target }) };
  if (!existsSync(dirname(destinationPath))) return { ...base, ...blocked(["The destination Config directory does not exist; no directory creation is authorized."], { target }) };

  const sourceSha256 = sha256(sourceBytes);
  try {
    await copyFile(sourcePath, temporaryPath, constants.COPYFILE_EXCL);
    const temporaryBytes = await readFile(temporaryPath);
    const temporarySha256 = sha256(temporaryBytes);
    if (temporaryBytes.length !== sourceBytes.length || temporarySha256 !== sourceSha256) {
      await unlink(temporaryPath).catch(() => {});
      return { ...base, ...blocked(["The staged temporary license bytes did not match the source attestation; destination was not promoted."], { target, sourceBytes: sourceBytes.length, sourceSha256, temporaryBytes: temporaryBytes.length, temporarySha256 }) };
    }
    await rename(temporaryPath, destinationPath);
    const destinationBytes = await readFile(destinationPath);
    const destinationSha256 = sha256(destinationBytes);
    if (destinationBytes.length !== sourceBytes.length || destinationSha256 !== sourceSha256) {
      return { ...base, ...blocked(["The destination license reread did not match the source attestation; outcome is unknown and no retry is authorized."], { target, sourceBytes: sourceBytes.length, sourceSha256, destinationBytes: destinationBytes.length, destinationSha256 }) };
    }
    return {
      ...base,
      status: "PASS",
      source: { bytes: sourceBytes.length, sha256: sourceSha256 },
      destination: { bytes: destinationBytes.length, sha256: destinationSha256 },
      copyScope: [LICENSE_RELATIVE_PATH.replaceAll("\\", "/")],
      worldCopied: false,
      balladTouched: false,
      temporaryArtifact: false,
      blockers: [],
    };
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    return { ...base, ...blocked([`License staging failed before a verified destination reread: ${error instanceof Error ? error.message : String(error)}`], { target, source: { bytes: sourceBytes.length, sha256: sourceSha256 }, outcomeUnknown: true }) };
  }
}

async function main() {
  const sourceRoot = process.env.DICEBOX_FIXTURE_LICENSE_SOURCE_ROOT;
  const destinationRoot = process.env.DICEBOX_FIXTURE_LICENSE_DESTINATION_ROOT;
  const receiptPath = process.env.DICEBOX_FIXTURE_LICENSE_RECEIPT_PATH
    ? resolve(process.env.DICEBOX_FIXTURE_LICENSE_RECEIPT_PATH)
    : null;
  const receipt = await stageFixtureLicense({ sourceRoot, destinationRoot });
  if (receiptPath) {
    await mkdir(dirname(receiptPath), { recursive: true });
    await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  }
  console.log(JSON.stringify(receipt, null, 2));
  if (receipt.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
