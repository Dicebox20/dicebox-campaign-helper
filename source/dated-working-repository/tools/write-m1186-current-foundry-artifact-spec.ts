import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createFoundryArtifactSpec, createFoundryVerifierExpectation, verifyFoundryArtifactSpecHash } from "@dicebox/compiler";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT_PATH = resolve(repoRoot, "outputs/m1186-current-foundry-artifact-spec-receipt.json");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1186";
const VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1186";

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

export async function createM1186CurrentFoundryArtifactSpecReceipt({ runtimePath = DEFAULT_RUNTIME_PATH, observedAt = "2026-09-06" }: { runtimePath?: string; observedAt?: string } = {}) {
  const manifest = JSON.parse(await readFile(resolve(repoRoot, "packages/dicebox-foundry/module.json"), "utf8"));
  const packageVersion = String(manifest.version);
  const foundryVersion = String(manifest.compatibility?.verified);
  const system = manifest.relationships?.systems?.find((entry: { id?: string }) => entry.id === "dnd5e");
  const systemVersion = String(system?.compatibility?.verified);
  if (packageVersion !== "0.1.15" || foundryVersion !== "14.367" || systemVersion !== "5.3.3") throw new Error("The current Foundry artifact target identity drifted from M1186.");
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
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("M1186 current specification failed its integrity reread.");
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId: VERIFIER_ID, spec: canonicalSpecification });
  const supportingArtifacts = Object.freeze({
    persistentWorldWriteAccounting: Object.freeze({ path: "packages/dicebox-foundry/src/persistent-world-write-accounting.js", sha256: sha256(await readFile(resolve(repoRoot, "packages/dicebox-foundry/src/persistent-world-write-accounting.js"))) }),
  });
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1186-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.m1186",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1186",
    status: "PASS_SOURCE_ONLY_SUCCESSOR",
    evidenceLabel: "local",
    observedAt,
    successorOf: Object.freeze({ receipt: "outputs/m1178-current-foundry-artifact-spec-receipt.json", specId: "dbx:foundry-spec:current-product-0.1.15-m1178", verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1178" }),
    installerTransition: Object.freeze({ previousSha256: "482b955526aabe9724c218c939723932c87380b207ebc18713c2292da5e59ad8", currentSha256: artifacts.find((artifact) => artifact.kind === "installer")?.sha256, changedBy: "M1186 fixed native-write accounting and post-restart owned reread boundary" }),
    canonicalSpecification,
    verifierExpectation,
    supportingArtifacts,
    provenance: Object.freeze({
      package: "M1058 package provenance preserved; package bytes were not edited by M1186",
      adapter: "M850/M852 adapter provenance preserved; adapter bytes were not edited by M1186",
      candidateTransport: "M1186 adds only fixed native-write accounting and owned post-restart reread evidence around the existing m1141-signal-rune boundary",
      stagedServed: "M1186 is source-only until separately authorized nested-Data staging and served parity",
      runtimeProfile: "M1183 exact descriptor observation preserved; loaded-byte hash remains unclaimed",
    }),
    runtimeEvidence: Object.freeze({ staticRuntimeHashOnly: true, currentRuntimeProfile: "preserved-m1183-descriptor-observation", servedPackageParity: "requires-post-m1186-staging-and-served-attestation", activeGm: "preserved-m1183-exact-gamemaster-observation" }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze(["staged or served parity after M1186 source changes", "loaded byte identity or permission beyond exact fixture evidence", "persistent-world commit before post-restart fixture reread", "Tram/Core, player behavior, Stage 12 acceptance, or Ready-to-Play"]),
  });
}

async function main() {
  const outputPath = resolve(process.env.DICEBOX_M1186_ARTIFACT_SPEC_RECEIPT ?? DEFAULT_OUTPUT_PATH);
  const receipt = await createM1186CurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main().catch((error) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
