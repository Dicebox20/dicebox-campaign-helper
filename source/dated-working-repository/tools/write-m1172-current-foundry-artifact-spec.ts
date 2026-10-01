import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createFoundryArtifactSpec,
  createFoundryVerifierExpectation,
  verifyFoundryArtifactSpecHash,
} from "@dicebox/compiler";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT_PATH = resolve(repoRoot, "outputs/m1172-current-foundry-artifact-spec-receipt.json");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1172";
const VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1172";

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

export async function createM1172CurrentFoundryArtifactSpecReceipt({
  runtimePath = DEFAULT_RUNTIME_PATH,
  observedAt = "2026-09-06",
}: {
  runtimePath?: string;
  observedAt?: string;
} = {}) {
  const moduleManifest = JSON.parse(await readFile(resolve(repoRoot, "packages/dicebox-foundry/module.json"), "utf8"));
  const packageVersion = String(moduleManifest.version);
  const foundryVersion = String(moduleManifest.compatibility?.verified);
  const system = moduleManifest.relationships?.systems?.find((entry: { id?: string }) => entry.id === "dnd5e");
  const systemVersion = String(system?.compatibility?.verified);
  if (packageVersion !== "0.1.15" || foundryVersion !== "14.367" || systemVersion !== "5.3.3") {
    throw new Error("The current Foundry artifact target identity drifted from the M1172 authorization.");
  }

  const artifacts = await Promise.all(artifactSources.map(async (artifact) => {
    const bytes = await readFile(sourcePath(artifact.source, runtimePath));
    return {
      artifactId: artifact.artifactId,
      kind: artifact.kind,
      version: artifact.kind === "runtime" ? foundryVersion : packageVersion,
      sha256: sha256(bytes),
      source: artifact.source,
    };
  }));
  const canonicalSpecification = await createFoundryArtifactSpec({
    specId: SPEC_ID,
    target: {
      packageVersion,
      foundryVersion,
      systemId: "dnd5e",
      systemVersion,
      adapterId: "program-scene-vertical-slice",
      adapterVersion: packageVersion,
    },
    artifacts,
  });
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("M1172 current specification failed its integrity reread.");
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId: VERIFIER_ID, spec: canonicalSpecification });
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1172-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.m1172",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1172",
    status: "PASS_SOURCE_ONLY_SUCCESSOR",
    evidenceLabel: "local",
    observedAt,
    successorOf: Object.freeze({
      receipt: "outputs/m1165-current-foundry-artifact-spec-receipt.json",
      specId: "dbx:foundry-spec:current-product-0.1.15-m1165",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1165",
    }),
    installerTransition: Object.freeze({
      previousSha256: "68c84f18c7ec0450a55e836b74ab7cd7516da7878dfe83def72bfa40bac79c74",
      currentSha256: artifacts.find((artifact) => artifact.kind === "installer")?.sha256,
      changedBy: "M1172 candidate diagnostic artifact identity refresh",
    }),
    canonicalSpecification,
    verifierExpectation,
    provenance: Object.freeze({
      package: "M1058 package provenance preserved; package bytes were not edited by M1172",
      adapter: "M850/M852 adapter provenance preserved; adapter bytes were not edited by M1172",
      candidateTransport: "M1170 fixed GM-only diagnostic remains read-only; M1172 refreshed only its artifact identity refs",
      stagedServed: "M1166/M1167 remain immutable pre-M1172 staged/served evidence; parity after the M1172 source change requires a later separately authorized stage/serve slice",
      runtimeProfile: "M1153 exact RuntimeProfile and M1154 profile-diff evidence preserved; no new runtime observation claimed",
    }),
    runtimeEvidence: Object.freeze({
      staticRuntimeHashOnly: true,
      currentRuntimeProfile: "preserved-m1153-not-refreshed",
      servedPackageParity: "requires-post-m1172-staging-and-served-attestation",
      activeGm: "preserved-m1153-not-refreshed",
    }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze([
      "staged or served installer parity after the M1172 source change",
      "loaded DiceBox or optional-module behavior after M1172",
      "current RuntimeProfile/profile-diff or active-GM authority beyond M1153 evidence",
      "candidate installer execution, document creation, or campaign reread",
      "Stage 9 acceptance, Stage 12 acceptance, alpha readiness, or Ready-to-Play",
    ]),
  });
}

async function main() {
  const outputPath = resolve(process.env.DICEBOX_M1172_ARTIFACT_SPEC_RECEIPT ?? DEFAULT_OUTPUT_PATH);
  const receipt = await createM1172CurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
