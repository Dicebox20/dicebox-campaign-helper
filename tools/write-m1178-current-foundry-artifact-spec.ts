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
const DEFAULT_OUTPUT_PATH = resolve(repoRoot, "outputs/m1178-current-foundry-artifact-spec-receipt.json");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1178";
const VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1178";

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

export async function createM1178CurrentFoundryArtifactSpecReceipt({
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
    throw new Error("The current Foundry artifact target identity drifted from the M1178 authorization.");
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
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("M1178 current specification failed its integrity reread.");
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId: VERIFIER_ID, spec: canonicalSpecification });
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1178-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.m1178",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1178",
    status: "PASS_SOURCE_ONLY_SUCCESSOR",
    evidenceLabel: "local",
    observedAt,
    successorOf: Object.freeze({
      receipt: "outputs/m1172-current-foundry-artifact-spec-receipt.json",
      specId: "dbx:foundry-spec:current-product-0.1.15-m1172",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15-m1172",
    }),
    installerTransition: Object.freeze({
      previousSha256: "600f24da6339b2557c9969391085e0950a02e63008f290cecb2bf89f4f916e53",
      currentSha256: artifacts.find((artifact) => artifact.kind === "installer")?.sha256,
      changedBy: "M1178 fixed Signal/Rune candidate-specific preview/approval/write boundary",
    }),
    canonicalSpecification,
    verifierExpectation,
    provenance: Object.freeze({
      package: "M1058 package provenance preserved; package bytes were not edited by M1178",
      adapter: "M850/M852 adapter provenance preserved; adapter bytes were not edited by M1178",
      candidateTransport: "M1177 fixed preview approval envelope remains no-apply; M1178 adds only a fixed candidate-specific approval/write boundary",
      stagedServed: "M1178 is source-only local evidence; staging and served parity remain separately authorized and unattested",
      runtimeProfile: "M1175 exact RuntimeProfile observation and M1176 typed reconciliation remain preserved; no new runtime observation claimed",
    }),
    runtimeEvidence: Object.freeze({
      staticRuntimeHashOnly: true,
      currentRuntimeProfile: "preserved-m1175-observed-m1176-reconciled",
      servedPackageParity: "requires-post-m1178-staging-and-served-attestation",
      activeGm: "preserved-m1175-exact-gamemaster-observation",
    }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze([
      "staged or served installer parity after the M1178 source change",
      "loaded DiceBox or optional-module behavior after M1178",
      "current RuntimeProfile/profile-diff or active-GM authority beyond preserved M1175/M1176 evidence",
      "candidate installer invocation, document creation, or campaign reread",
      "Stage 9 acceptance, Stage 12 acceptance, alpha readiness, or Ready-to-Play",
    ]),
  });
}

async function main() {
  const outputPath = resolve(process.env.DICEBOX_M1178_ARTIFACT_SPEC_RECEIPT ?? DEFAULT_OUTPUT_PATH);
  const receipt = await createM1178CurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
