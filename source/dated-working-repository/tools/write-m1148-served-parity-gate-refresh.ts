import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  createAscendancySignalRuneFreshSceneCandidatePreview,
  createAscendancySignalRuneSourceStagedServedProfileGate,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "outputs/m1148-stage12-served-parity-gate-refresh-receipt.json");

async function readJson(relativePath: string): Promise<any> {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

const m1146Gate = await readJson("outputs/m1146-stage12-source-staged-served-profile-gate-receipt.json");
const m1147 = await readJson("outputs/m1147-stage12-exact-served-worker-attestation-receipt.json");
const m1144 = await readJson("outputs/m1144-current-foundry-artifact-spec-receipt.json");
const workerSha256 = m1147.served.sha256;
if (m1147.status !== "PASS" || !workerSha256 || !m1147.served.sourceServedParity || !m1147.served.canonicalParity) {
  throw new Error("M1148 requires a passing M1147 served-worker parity receipt.");
}

const gate = createAscendancySignalRuneSourceStagedServedProfileGate({
  candidatePreview: createAscendancySignalRuneFreshSceneCandidatePreview(),
  sourceHashes: m1146Gate.sourceHashes,
  artifactIdentity: { spec: m1144.canonicalSpecification, verifier: m1144.verifierExpectation },
  runtimeObservation: { ...m1146Gate.runtimeObservation, servedByteHash: workerSha256 },
  servedWorkerObservation: {
    status: m1147.status,
    httpStatus: m1147.served.status,
    requestCount: m1147.request.requestCount,
    byteLength: m1147.served.byteLength,
    sourceSha256: m1147.source.sha256,
    servedSha256: m1147.served.sha256,
    canonicalSha256: m1147.canonical.sha256,
    sourceServedParity: m1147.served.sourceServedParity,
    canonicalParity: m1147.served.canonicalParity,
  },
});

const receipt = {
  receiptVersion: 1,
  receiptId: "dbx:receipt:m1148-served-parity-gate-refresh",
  milestone: "M1148",
  status: "BLOCKED_SERVED_PARITY_REFRESH",
  evidenceClass: "local",
  operation: "dicebox.stage12.served-parity-gate.refresh",
  gate,
  sourceReceipts: {
    m1146: "outputs/m1146-stage12-source-staged-served-profile-gate-receipt.json",
    m1147: "outputs/m1147-stage12-exact-served-worker-attestation-receipt.json",
    m1144: "outputs/m1144-current-foundry-artifact-spec-receipt.json",
  },
  validation: {
    servedGate: "PASS_M1147_SOURCE_SERVED_M1144_CANONICAL_PARITY",
    stagedGate: "BLOCKED_UNOBSERVED",
    runtimeProfileGate: "BLOCKED_INCOMPLETE",
    profileDiffGate: "BLOCKED_UNAVAILABLE",
    installerScopeGate: "BLOCKED_CANDIDATE_SPECIFIC_BOUNDARY_UNRESOLVED",
    authorityGate: "BLOCKED_LIVE_WRITE_EXECUTION_UNPROVEN",
    noWrite: true,
    readyClaim: false,
  },
  nextBoundary: "No staging or creation approval until staged package parity, complete RuntimeProfile/profile-diff, candidate-specific installer transport, live authority, and authoritative reread are separately established.",
};
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, status: receipt.status, gates: gate.gates, blockers: gate.blockers }, null, 2));
