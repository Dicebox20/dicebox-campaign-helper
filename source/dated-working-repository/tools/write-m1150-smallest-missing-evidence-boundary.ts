import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createAscendancySignalRuneSmallestMissingEvidenceBoundary } from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "outputs/m1150-stage12-smallest-missing-evidence-boundary-receipt.json");

async function readJson(relativePath: string): Promise<any> {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

const m1149 = await readJson("outputs/m1149-stage12-runtime-profile-availability-gate-receipt.json");
const moduleSource = await readFile(resolve(root, "packages/dicebox-foundry/src/module.js"), "utf8");
const capabilitySource = await readFile(resolve(root, "packages/dicebox-core/src/capability.ts"), "utf8");
const releaseDiffSource = await readFile(resolve(root, "packages/dicebox-compiler/src/release-diff.ts"), "utf8");
if (m1149.receiptId !== "dbx:receipt:m1149-runtime-profile-availability-gate"
  || m1149.status !== "BLOCKED_RUNTIME_PROFILE_UNOBSERVED"
  || m1149.gate?.gates?.sourceSurface !== "pass"
  || m1149.gate?.noWrite !== true) {
  throw new Error("M1150 requires the exact M1149 availability-gate context.");
}
if (!moduleSource.includes('query?.kind === "runtime-profile"')
  || !moduleSource.includes("readRuntimeEvidenceDiagnostic")
  || !capabilitySource.includes("RuntimeProfileSchema")
  || !releaseDiffSource.includes("RuntimeProfileSchema")
  || moduleSource.includes("profileDiff")) {
  throw new Error("M1150 source inventory drifted from the reviewed profile/diff boundary.");
}

const gate = createAscendancySignalRuneSmallestMissingEvidenceBoundary({
  m1149Context: {
    receiptId: m1149.receiptId,
    status: m1149.status,
    sourceSurface: m1149.gate.gates.sourceSurface,
    runtimeProfile: m1149.gate.gates.runtimeProfile,
    noWrite: m1149.gate.noWrite,
    readyClaim: m1149.gate.readyClaim,
  },
  sourceInventory: {
    runtimeProfileQuerySurface: "present",
    runtimeEvidenceDiagnosticSurface: "redacted-only",
    runtimeProfileDiffSurface: "not-present",
    authoritativeRereadObservation: "not-observed",
    sourceProfileIsRuntimeEvidence: false,
  },
});

const receipt = {
  receiptVersion: 1,
  receiptId: "dbx:receipt:m1150-smallest-missing-evidence-boundary",
  milestone: "M1150",
  status: "BLOCKED_RUNTIME_OBSERVATION_REQUIRED",
  evidenceClass: "local",
  operation: "dicebox.stage12.smallest-missing-evidence-boundary.reconcile",
  gate,
  sourceReceipts: {
    m1149: "outputs/m1149-stage12-runtime-profile-availability-gate-receipt.json",
    m1149Closure: "outputs/m1149-stage12-runtime-profile-availability-gate-closure-receipt.json",
  },
  sourceInventory: {
    runtimeProfileQuerySurface: "packages/dicebox-foundry/src/module.js -> game.diceboxCampaignHelper.query({ kind: \"runtime-profile\" })",
    runtimeEvidenceDiagnosticSurface: "packages/dicebox-foundry/src/module.js -> readRuntimeEvidenceDiagnostic -> redacted diagnostic only",
    runtimeProfileSchema: "packages/dicebox-core/src/capability.ts -> RuntimeProfileSchema",
    offlineProfileDiffSurface: "packages/dicebox-compiler/src/release-diff.ts -> supplied-profile comparison only",
    runtimeProfileDiffSurface: "not-present in current Foundry module source",
    authoritativeRereadObservation: "not-observed in accepted M1145/M1149 evidence",
  },
  validation: {
    sourceInventory: "PASS exact source strings and absence of runtime profileDiff surface",
    completeRuntimeProfile: "BLOCKED runtime observation required",
    profileDiff: "BLOCKED no runtime-side profile-diff surface or current profile input",
    authoritativeReread: "BLOCKED not observed",
    noWrite: true,
    readyClaim: false,
  },
  nextBoundary: "M1151: authorize one exact read-only runtime-profile observation only if the active checklist separately permits a fixture reopen; require schema-valid RuntimeProfile, exact target, current active-GM identity, profile-diff input/result, and authoritative stopped-state reread. Do not create or mutate documents.",
};
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, status: receipt.status, disposition: gate.disposition, blockers: gate.blockers }, null, 2));
