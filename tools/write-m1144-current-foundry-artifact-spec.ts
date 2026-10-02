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
const DEFAULT_OUTPUT_PATH = resolve(repoRoot, "outputs/m1144-current-foundry-artifact-spec-receipt.json");
const DEFAULT_RUNTIME_PATH = "C:/Program Files/Foundry Virtual Tabletop/Foundry Virtual Tabletop.exe";
const SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1144";
const VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1144";

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

export async function createM1144CurrentFoundryArtifactSpecReceipt({
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
    throw new Error("The current Foundry artifact target identity drifted from the M1144 authorization.");
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
  if (!(await verifyFoundryArtifactSpecHash(canonicalSpecification))) throw new Error("M1144 successor specification failed its integrity reread.");
  const verifierExpectation = await createFoundryVerifierExpectation({ verifierId: VERIFIER_ID, spec: canonicalSpecification });
  return Object.freeze({
    receiptVersion: 1,
    receiptId: "dbx:receipt:m1144-current-foundry-artifact-spec",
    operation: "compiler.current-foundry-artifact-spec.successor",
    stageId: "foundry-execution-evidence-foundation",
    milestone: "M1144",
    status: "PASS_SOURCE_ONLY_SUCCESSOR",
    evidenceLabel: "local",
    observedAt,
    successorOf: Object.freeze({
      receipt: "outputs/m269-current-foundry-artifact-spec-receipt.json",
      specId: "dbx:foundry-spec:current-product-0.1.15",
      verifierId: "dbx:foundry-verifier:current-product-0.1.15",
    }),
    canonicalSpecification,
    verifierExpectation,
    provenance: Object.freeze({
      package: Object.freeze({
        receipt: "outputs/m1058-stage12-campaign-package-background-object-preview-closure-receipt.json",
        receiptSha256: "D84358BE6658BEA3E6C2D04513CDB1FD3693EE9E606D21E440D8413109B12425",
        scope: "current package includes the intentional 29-entry staticBackgroundObjectPreview; source bytes are observed, not edited by M1144",
      }),
      adapter: Object.freeze({
        sourceReceipt: "outputs/m850-stage11-owned-scene-witness-reread-diagnostic-closure-receipt.json",
        stagedReceipt: "outputs/m852-stage11-witness-reread-diagnostic-staging-closure-receipt.json",
        sourceReceiptSha256: "6FA1D386A58D67C097253871A5A2EAFCE1292E3C2A2487BD5E9FF394ABE4F903",
        stagedReceiptSha256: "CB1BD4FEA1D662F4CB1CC584771B48D546A5437C28FFCB5646EF73C2B034013B",
        scope: "current adapter source and stopped-fixture parity are provenance inputs; source bytes are not edited by M1144",
      }),
      candidateScope: "M1141 remains Signal/Rune-only; the installed package/stage path remains four-room and is not narrowed or promoted here.",
    }),
    runtimeEvidence: Object.freeze({
      staticRuntimeHashOnly: true,
      currentRuntimeProfile: "not-observed",
      servedPackageParity: "not-observed",
      activeGm: "not-claimed",
    }),
    noFoundryLaunch: true,
    noFixtureWrite: true,
    noInstall: true,
    noUpload: true,
    foreignStatePreserved: true,
    readyClaim: false,
    doesNotProve: Object.freeze([
      "fresh staged-package byte parity",
      "loaded DiceBox or optional-module behavior",
      "current RuntimeProfile/profile-diff or active-GM authority",
      "bindings, execution, recovery, or campaign-document reread",
      "Stage 9 acceptance, Stage 12 acceptance, alpha readiness, or Ready-to-Play",
    ]),
  });
}

async function main() {
  const outputPath = resolve(process.env.DICEBOX_M1144_ARTIFACT_SPEC_RECEIPT ?? DEFAULT_OUTPUT_PATH);
  const receipt = await createM1144CurrentFoundryArtifactSpecReceipt();
  await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  console.log(JSON.stringify(receipt, null, 2));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === resolve(fileURLToPath(import.meta.url))) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
