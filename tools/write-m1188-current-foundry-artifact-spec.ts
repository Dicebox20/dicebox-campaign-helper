import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createFoundryArtifactSpec, createFoundryVerifierExpectation, verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(repoRoot, "outputs/m1188-current-foundry-artifact-spec-receipt.json");
const runtimePath = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const specId = "dbx:foundry-spec:current-product-0.1.15-m1188";
const verifierId = "dbx:foundry-verifier:current-product-0.1.15-m1188";
const artifactSources = [
  ["dbx:foundry-artifact:adapter", "adapter", "packages/dicebox-foundry/src/program-scene-vertical-slice.js"],
  ["dbx:foundry-artifact:installer", "installer", "packages/dicebox-foundry/src/ascendancy-installer.js"],
  ["dbx:foundry-artifact:package", "package", "packages/dicebox-foundry/ascendancy-campaign-package.json"],
  ["dbx:foundry-artifact:runtime", "runtime", runtimePath],
  ["dbx:foundry-artifact:worker", "worker", "packages/dicebox-foundry/src/foundry-live-bridge.js"],
] as const;

const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const sourcePath = (source: string) => source === runtimePath ? source : resolve(repoRoot, source);

async function main() {
  const manifest = JSON.parse(await readFile(resolve(repoRoot, "packages/dicebox-foundry/module.json"), "utf8"));
  const packageVersion = String(manifest.version);
  const foundryVersion = String(manifest.compatibility?.verified);
  const systemVersion = String(manifest.relationships?.systems?.find((entry: { id?: string }) => entry.id === "dnd5e")?.compatibility?.verified);
  if (packageVersion !== "0.1.15" || foundryVersion !== "14.367" || systemVersion !== "5.3.3") throw new Error("M1188 artifact target drifted.");
  const artifacts = await Promise.all(artifactSources.map(async ([artifactId, kind, source]) => ({
    artifactId, kind, version: kind === "runtime" ? foundryVersion : packageVersion, sha256: hash(await readFile(sourcePath(source))), source,
  })));
  const canonicalSpecification = await createFoundryArtifactSpec({
    specId,
    target: { packageVersion, foundryVersion, systemId: "dnd5e", systemVersion, adapterId: "program-scene-vertical-slice", adapterVersion: packageVersion },
    artifacts,
  });
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("M1188 artifact specification integrity reread failed.");
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId, spec: canonicalSpecification });
  const receipt = {
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1188-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.m1188",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1188",
    status: "PASS_SOURCE_ONLY_SUCCESSOR",
    evidenceLabel: "local",
    observedAt: "2026-09-06",
    successorOf: { receipt: "outputs/m1186-current-foundry-artifact-spec-receipt.json", specId: "dbx:foundry-spec:current-product-0.1.15-m1186", verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1186" },
    change: "Narrow Region-plan Scene identity and staticVisualTileProjection.tiles correction; no runtime or staging action.",
    canonicalSpecification,
    verifierExpectation,
    supportingArtifacts: { persistentWorldWriteAccounting: { path: "packages/dicebox-foundry/src/persistent-world-write-accounting.js", sha256: hash(await readFile(resolve(repoRoot, "packages/dicebox-foundry/src/persistent-world-write-accounting.js"))) } },
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: ["staged or served parity after M1188", "loaded byte identity", "persistent-world commit or post-restart completeness", "Tram/Core, player behavior, Stage 12 acceptance, or Ready-to-Play"],
  };
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
