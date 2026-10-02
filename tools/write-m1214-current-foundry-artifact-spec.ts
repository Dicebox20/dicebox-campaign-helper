import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createFoundryArtifactSpec, createFoundryVerifierExpectation, verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1214";
const VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1214";

const artifactSources = Object.freeze([
  { artifactId: "dbx:foundry-artifact:adapter", kind: "adapter" as const, source: "packages/dicebox-foundry/src/program-scene-vertical-slice.js" },
  { artifactId: "dbx:foundry-artifact:installer", kind: "installer" as const, source: "packages/dicebox-foundry/src/ascendancy-installer.js" },
  { artifactId: "dbx:foundry-artifact:package", kind: "package" as const, source: "packages/dicebox-foundry/ascendancy-campaign-package.json" },
  { artifactId: "dbx:foundry-artifact:runtime", kind: "runtime" as const, source: DEFAULT_RUNTIME_PATH },
  { artifactId: "dbx:foundry-artifact:worker", kind: "worker" as const, source: "packages/dicebox-foundry/src/foundry-live-bridge.js" },
]);

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function sourcePath(source: string, runtimePath: string): string {
  return source === DEFAULT_RUNTIME_PATH ? runtimePath : resolve(repoRoot, source);
}

export async function createM1214CurrentFoundryArtifactSpecReceipt({
  runtimePath = DEFAULT_RUNTIME_PATH,
  observedAt = "2026-09-07",
}: { runtimePath?: string; observedAt?: string } = {}) {
  const manifest = JSON.parse(await readFile(resolve(repoRoot, "packages/dicebox-foundry/module.json"), "utf8"));
  const packageVersion = String(manifest.version);
  const foundryVersion = String(manifest.compatibility?.verified);
  const system = manifest.relationships?.systems?.find((entry: { id?: string }) => entry.id === "dnd5e");
  const systemVersion = String(system?.compatibility?.verified);
  if (packageVersion !== "0.1.15" || foundryVersion !== "14.367" || systemVersion !== "5.3.3") {
    throw new Error("M1214 artifact target identity drifted.");
  }
  const artifacts = await Promise.all(artifactSources.map(async (artifact) => ({
    artifactId: artifact.artifactId,
    kind: artifact.kind,
    version: artifact.kind === "runtime" ? foundryVersion : packageVersion,
    sha256: sha256(await readFile(sourcePath(artifact.source, runtimePath))),
    source: artifact.source,
  })));
  const canonicalSpecification = await createFoundryArtifactSpec({
    specId: SPEC_ID,
    target: { packageVersion, foundryVersion, systemId: "dnd5e", systemVersion, adapterId: "program-scene-vertical-slice", adapterVersion: packageVersion },
    artifacts,
  });
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) {
    throw new Error("M1214 canonical artifact specification integrity reread failed.");
  }
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId: VERIFIER_ID, spec: canonicalSpecification });
  const previousInstallerSha256 = "1bc06bbb7f6f779afdcb0b7dbd5f4b9c5aae335748d0ea9f698dc4a25f946add";
  const previousPackageSha256 = "1dd01cd3391a9c0687e64e5d2f7311efe09d1e614ac9b5737355f3b42135dbe5";
  const currentInstallerSha256 = artifacts.find((artifact) => artifact.kind === "installer")?.sha256;
  const currentPackageSha256 = artifacts.find((artifact) => artifact.kind === "package")?.sha256;
  if (currentInstallerSha256 === previousInstallerSha256) throw new Error("M1214 expected the installer descriptor hash to differ from M1211.");
  if (currentPackageSha256 !== previousPackageSha256) throw new Error("M1214 package hash drifted unexpectedly from M1211.");
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1214-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.m1214",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1214",
    status: "PASS_SOURCE_ONLY_CURRENT",
    evidenceLabel: "local",
    observedAt,
    successorOf: Object.freeze({ receipt: "outputs/m1211-current-foundry-artifact-spec-receipt.json", specId: "dbx:foundry-spec:current-product-0.1.15-m1211", verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1211" }),
    historicalPredecessors: Object.freeze({ receipt: "outputs/m1188-current-foundry-artifact-spec-receipt.json", specId: "dbx:foundry-spec:current-product-0.1.15-m1188", verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1188" }),
    change: "M1214 aligns package-owned current runtime descriptors and regenerates the source-only canonical artifact specification after the installer descriptor hash changed.",
    canonicalSpecification,
    verifierExpectation,
    descriptorTransition: Object.freeze({ previousM1211InstallerSha256: previousInstallerSha256, currentInstallerSha256, descriptorDriftReconciled: true }),
    packageTransition: Object.freeze({ previousM1211PackageSha256: previousPackageSha256, currentPackageSha256, packageUnchanged: true }),
    runtimeEvidence: Object.freeze({ staticRuntimeHashOnly: true, currentRuntimeProfile: "not-observed", servedPackageParity: "not-observed", activeGm: "not-claimed" }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: ["staged or served parity after M1214", "loaded DiceBox or optional-module behavior", "current RuntimeProfile or active-GM authority", "native bindings, execution, recovery, or campaign-document reread", "Stage 12 acceptance or Ready-to-Play"],
  });
}

async function main() {
  const outputPath = resolve(repoRoot, "outputs/m1214-current-foundry-artifact-spec-receipt.json");
  const receipt = await createM1214CurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify({ operation: receipt.operation, status: receipt.status, output: outputPath, installerSha256: receipt.descriptorTransition.currentInstallerSha256, packageSha256: receipt.packageTransition.currentPackageSha256, specSha256: receipt.canonicalSpecification.specSha256 }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
}
