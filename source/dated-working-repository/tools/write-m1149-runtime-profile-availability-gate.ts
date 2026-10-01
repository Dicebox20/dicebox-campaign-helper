import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createAscendancySignalRuneRuntimeProfileAvailabilityGate } from "@dicebox/compiler";

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "outputs/m1149-stage12-runtime-profile-availability-gate-receipt.json");

async function readJson(relativePath: string): Promise<any> {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

const m1148 = await readJson("outputs/m1148-stage12-served-parity-gate-refresh-receipt.json");
const m1145 = await readJson("outputs/m1145-stage12-exact-fixture-runtime-profile-active-gm-reread-closure-receipt.json");
if (m1148.receiptId !== "dbx:receipt:m1148-served-parity-gate-refresh"
  || m1148.status !== "BLOCKED_SERVED_PARITY_REFRESH"
  || m1148.gate?.gates?.served !== "pass"
  || m1148.gate?.noWrite !== true
  || m1148.gate?.readyClaim !== false) {
  throw new Error("M1149 requires the exact M1148 served-parity gate context.");
}
if (m1145.readOnlyRuntimeDiagnostic?.diagnosticId !== "dbx:diagnostic:cbea3468"
  || m1145.readOnlyRuntimeDiagnostic?.readiness?.status !== "blocked"
  || m1145.activeGmDiagnostic?.noWrite !== true) {
  throw new Error("M1149 requires the exact M1145 redacted diagnostic boundary.");
}

const gate = createAscendancySignalRuneRuntimeProfileAvailabilityGate({
  m1148Context: {
    receiptId: m1148.receiptId,
    status: m1148.status,
    servedGate: m1148.gate.gates.served,
    noWrite: m1148.gate.noWrite,
    readyClaim: m1148.gate.readyClaim,
  },
  sourceSurface: {
    status: "present",
    sourcePath: "packages/dicebox-foundry/src/module.js",
    queryKind: "runtime-profile",
    apiPath: "game.diceboxCampaignHelper.query",
    schemaContract: "packages/dicebox-core/src/capability.ts:RuntimeProfileSchema",
    readOnly: true,
    sourceOnly: true,
  },
  observation: {
    status: "unobserved",
    sourceReceiptScope: "M1145-redacted-diagnostic-only",
    fullRuntimeProfileObserved: false,
    runtimeFingerprintObserved: false,
    profileDiffObserved: false,
    authoritativeRereadObserved: false,
  },
});

const receipt = {
  receiptVersion: 1,
  receiptId: "dbx:receipt:m1149-runtime-profile-availability-gate",
  milestone: "M1149",
  status: "BLOCKED_RUNTIME_PROFILE_UNOBSERVED",
  evidenceClass: "local",
  operation: "dicebox.stage12.runtime-profile-availability.reconcile",
  gate,
  sourceReceipts: {
    m1148: "outputs/m1148-stage12-served-parity-gate-refresh-receipt.json",
    m1145: "outputs/m1145-stage12-exact-fixture-runtime-profile-active-gm-reread-closure-receipt.json",
  },
  validation: {
    sourceSurface: "PASS_SOURCE_DECLARED_READ_ONLY_RUNTIME_PROFILE_QUERY",
    fullRuntimeProfile: "BLOCKED_UNOBSERVED_M1145_CAPTURED_REDACTED_DIAGNOSTIC_ONLY",
    profileDiff: "BLOCKED_NO_CURRENT_RUNTIME_PROFILE",
    authoritativeReread: "BLOCKED_UNOBSERVED",
    noWrite: true,
    readyClaim: false,
  },
  nextBoundary: "No staging or creation approval. M1150 must address the smallest remaining blocker only after this source/runtime evidence boundary is reread; do not infer a live RuntimeProfile or authoritative reread from source/API presence.",
};
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, status: receipt.status, gates: gate.gates, blockers: gate.blockers }, null, 2));
