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
const DEFAULT_OUTPUT_PATH = resolve(repoRoot, "outputs/m269-current-foundry-artifact-spec-receipt.json");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";

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

export async function createCurrentFoundryArtifactSpecReceipt({
  runtimePath = DEFAULT_RUNTIME_PATH,
  observedAt = "2026-08-27",
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
    throw new Error("The current Foundry artifact target identity drifted from the reviewed M269 boundary.");
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
    specId: "dbx:foundry-spec:current-product-0.1.15",
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
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("Generated current artifact specification failed its integrity reread.");
  const verifierExpectation = await createFoundryVerifierExpectation({
    verifierId: "dbx:foundry-verifier:current-product-0.1.15",
    spec: canonicalSpecification,
  });
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m269-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M269",
    status: "PASS",
    evidenceLabel: "local",
    observedAt,
    canonicalSpecification,
    verifierExpectation,
    legacyEvidence: Object.freeze({
      receipt: "outputs/m249-foundry-artifact-spec-receipt.json",
      expectedWorkerSha256: "460f79b11ea457ec9efc3dcbe2c8d2c534516054d8247944f26096245df5cf35",
      installedWorkerSha256: "60be1aa71386c3457bd313e319e7133724e752e1077f396050a056e69e4425a2",
      status: "preserved-blocked",
    }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze([
      "fresh HTTP-served byte parity",
      "loaded DiceBox or optional-module behavior",
      "active-GM authority, bindings, execution, or recovery",
      "GM/player behavior or authoritative campaign-document reread",
      "Stage 9 acceptance, alpha readiness, or Ready-to-Play",
    ]),
  });
}

async function main() {
  const outputPath = resolve(process.env.DICEBOX_CURRENT_ARTIFACT_SPEC_RECEIPT ?? DEFAULT_OUTPUT_PATH);
  const receipt = await createCurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
