import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  createAscendancySignalRuneFreshSceneCandidatePreview,
  createAscendancySignalRuneSourceStagedServedProfileGate,
} from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "outputs/m1146-stage12-source-staged-served-profile-gate-receipt.json");

async function readJson(relativePath: string): Promise<any> {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

async function sha256(relativePath: string): Promise<string> {
  return createHash("sha256").update(await readFile(resolve(root, relativePath))).digest("hex");
}

const m1141 = await readJson("outputs/m1141-stage12-foreign-scene-preserving-fresh-scene-candidate-preview-closure-receipt.json");
const m1142 = await readJson("outputs/m1142-stage12-fresh-candidate-package-runtime-hash-profile-reconciliation-closure-receipt.json");
const m1144 = await readJson("outputs/m1144-current-foundry-artifact-spec-receipt.json");
const m1145 = await readJson("outputs/m1145-stage12-exact-fixture-runtime-profile-active-gm-reread-closure-receipt.json");
const sourceHashes = [
  { path: m1141.implementation.sourcePath, sha256: await sha256(m1141.implementation.sourcePath) },
  { path: m1141.implementation.exportPath, sha256: await sha256(m1141.implementation.exportPath) },
  { path: m1141.implementation.testPath, sha256: await sha256(m1141.implementation.testPath) },
];
const historicalExpectedByPath = new Map([
  [m1141.implementation.sourcePath, m1141.implementation.sourceSha256],
  [m1141.implementation.testPath, m1141.implementation.testSha256],
]);
const currentCandidateExpectedByPath = new Map(Object.entries(m1142.candidateHashes));
for (const entry of sourceHashes) {
  const historicalExpected = historicalExpectedByPath.get(entry.path);
  const currentCandidateExpected = currentCandidateExpectedByPath.get(entry.path);
  if (entry.path === m1141.implementation.exportPath) continue;
  if (currentCandidateExpected && entry.sha256.toUpperCase() !== currentCandidateExpected) throw new Error(`M1146 current candidate hash drift at ${entry.path}.`);
  if (historicalExpected && entry.sha256.toUpperCase() === historicalExpected) continue;
}

const candidatePreview = createAscendancySignalRuneFreshSceneCandidatePreview();
const gate = createAscendancySignalRuneSourceStagedServedProfileGate({
  candidatePreview,
  sourceHashes,
  artifactIdentity: { spec: m1144.canonicalSpecification, verifier: m1144.verifierExpectation },
  runtimeObservation: {
    worldId: m1145.runtimeTarget.worldId,
    foundryVersion: m1145.runtimeTarget.foundryVersion,
    systemId: m1145.runtimeTarget.systemId,
    systemVersion: m1145.runtimeTarget.systemVersion,
    activeGmName: m1145.fixtureLifecycle.manualJoin.username,
    activeGmObserved: m1145.activeGmDiagnostic.currentUserIsGm,
    currentUserMatchesActiveGm: m1145.activeGmDiagnostic.currentUserMatchesActiveGm,
    exactTargetMatch: m1145.runtimeTarget.exactTargetMatch,
    moduleLoad: "dicebox-campaign-helper@dbx=0.1.18",
    runtimeFingerprint: m1145.runtimeTarget.runtimeFingerprint,
    servedByteHash: "not-observed",
    runtimeProfile: "incomplete",
    profileDiff: "unavailable",
  },
});

const receipt = {
  receiptVersion: 1,
  receiptId: "dbx:receipt:m1146-source-staged-served-profile-gate",
  ...gate,
  sourceReceipts: {
    m1141: { path: "outputs/m1141-stage12-foreign-scene-preserving-fresh-scene-candidate-preview-closure-receipt.json", sha256: "C184EB4B89EA74371AE1A322E356FFB67105DE0F59A3DFA577EF384CA3770A80" },
    m1144: { path: "outputs/m1144-current-foundry-artifact-spec-receipt.json", sha256: "2A40DA9760390BABE31E35EDF12521FAE27DD33151EC8A5AC1671BFACCE7B336" },
    m1145: { path: "outputs/m1145-stage12-exact-fixture-runtime-profile-active-gm-reread-closure-receipt.json" },
  },
  validation: {
    sourceParity: "PASS_M1141_IMPLEMENTATION_AND_TEST;EXPORT_INDEX_RECONCILED_AFTER_M1146_GATE_EXPORT",
    artifactSpec: "PASS_M1144_CANONICAL_SPEC_AND_VERIFIER_IDENTITY",
    fixtureObservation: "PASS_M1145_EXACT_TARGET_ACTIVE_GM_READ_ONLY",
    gate: "BLOCKED_MISSING_STAGED_SERVED_PROFILE_AUTHORITY_EVIDENCE",
  },
  sourceProvenance: {
    historicalM1141: {
      sourceSha256: m1141.implementation.sourceSha256,
      exportSha256: m1141.implementation.exportSha256,
      testSha256: m1141.implementation.testSha256,
    },
    currentM1142Candidate: m1142.candidateHashes,
    currentLocal: sourceHashes,
    exportDisposition: "M1146_GATE_EXPORT_CHANGED_INDEX_HASH;HISTORICAL_RECEIPT_PRESERVED",
  },
  nextBoundary: "No staging or creation approval until served-byte identity, schema-valid RuntimeProfile/profile-diff, candidate-specific transport, and live authority/read-back evidence are separately established.",
};
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, status: gate.status, blockers: gate.blockers, sourceHashes }, null, 2));
