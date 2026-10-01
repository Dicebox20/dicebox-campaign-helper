import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
  "package.json",
  "packages/dicebox-foundry/src/module.js",
  "packages/dicebox-foundry/module.json",
  "tools/harness-manifest.json",
  "tools/foundry-preflight.mjs",
  "tests/foundry-preflight.test.ts",
  "tools/stage-foundry-module.mjs",
  "tests/stage-foundry-module.test.ts",
  "tools/foundry-server.mjs",
  "tests/foundry-server-guard.test.ts",
  "database/query_knowledge.py",
  "tests/knowledge-base-query.test.ts",
  "packages/dicebox-compiler/src/release-plan.ts",
  "packages/dicebox-compiler/src/release-diff.ts",
  "packages/dicebox-compiler/src/sync-conflict.ts",
  "packages/dicebox-core/src/certificate.ts",
  "packages/dicebox-core/src/harness-evidence.ts",
  "packages/dicebox-core/src/state-store.ts",
  "packages/dicebox-storage/src/program-state-store.ts",
  "tests/release-plan.test.ts",
  "tests/release-diff.test.ts",
  "tests/sync-conflict.test.ts",
  "tests/certificate.test.ts",
  "tests/harness-evidence.test.ts",
  "tests/state-store.test.ts",
  "tests/program-state-store.test.ts",
  "docs/DEVELOPMENT-AND-TOOLING-PLAN-2026-08-21.md",
  "docs/FOUNDRY-API-BINDING-MATRIX-2026-08-21.md",
  "docs/FIRST-ROUND-TESTING-2026-08-21.md",
  "outputs/harness-static-receipt.json",
  "outputs/m3-preview-static-receipt.json",
  "outputs/m3-transaction-static-receipt.json",
  "outputs/foundry-api-audit-static-receipt.json",
  "outputs/m3-native-mapper-static-receipt.json",
  "outputs/m3-executor-static-receipt.json",
  "outputs/m3-ledger-static-receipt.json",
  "outputs/m3-foundry-adapter-static-receipt.json",
  "outputs/m3-persistence-static-receipt.json",
  "outputs/m3-test-bridge-static-receipt.json",
  "outputs/m3-runtime-fingerprint-static-receipt.json",
  "outputs/m3-foundry-settings-static-receipt.json",
  "outputs/m3-test-bridge-transport-static-receipt.json",
  "outputs/m2-runtime-evidence-api-static-receipt.json",
  "outputs/m2-active-gm-evidence-static-receipt.json",
  "outputs/m2-managed-journal-snapshot-static-receipt.json",
  "outputs/m1-journal-api-probe-static-receipt.json",
  "outputs/m3-foundry-read-adapter-static-receipt.json",
  "outputs/m4-exact-link-static-receipt.json",
  "outputs/m4-compendium-index-static-receipt.json",
  "outputs/m5-media-static-receipt.json",
  "outputs/m6-spatial-static-receipt.json",
  "outputs/m6-spatial-projection-static-receipt.json",
  "outputs/m6-region-read-static-receipt.json",
  "outputs/m7-furnishing-static-receipt.json",
  "outputs/m7-placeable-read-static-receipt.json",
  "outputs/m8-activity-static-receipt.json",
  "outputs/m8-active-effect-static-receipt.json",
  "outputs/m8-active-effect-evidence-static-receipt.json",
  "outputs/m8-active-effect-operation-static-receipt.json",
  "outputs/m8-activity-operation-static-receipt.json",
  "outputs/m8-region-behavior-operation-static-receipt.json",
  "outputs/m8-region-behavior-read-static-receipt.json",
  "outputs/m8-region-behavior-evidence-static-receipt.json",
  "outputs/m8-optional-module-evidence-static-receipt.json",
  "outputs/m2-readiness-report-static-receipt.json",
  "outputs/foundry-fixture-preflight-14.365-static-receipt.json",
  "outputs/foundry-module-stage-static-receipt.json",
  "outputs/foundry-smoke-14.365-static-receipt.json",
  "outputs/m9-release-bundle-static-receipt.json",
  "outputs/m9-release-diff-static-receipt.json",
  "outputs/m10-sync-conflict-static-receipt.json",
  "outputs/m11-certificate-static-receipt.json",
  "outputs/m13-evidence-parity-static-receipt.json",
  "outputs/m14-harness-evidence-static-receipt.json",
  "outputs/m15-state-store-static-receipt.json",
  "outputs/m16-program-state-store-static-receipt.json",
  "outputs/m17-stdio-bridge-static-receipt.json",
  "outputs/m18-stdio-launcher-static-receipt.json",
  "outputs/m19-stdio-receipt-static-receipt.json",
  "outputs/m20-foundry-evidence-audit-static-receipt.json",
  "outputs/m21-foundry-fixture-plan-static-receipt.json",
  "outputs/m22-foundry-fixture-observation-static-receipt.json",
  "outputs/m23-foundry-observation-bundle-static-receipt.json",
  "outputs/m24-foundry-fixture-round-evidence-static-receipt.json",
  "packages/dicebox-core/src/fixture-observation-bundle.ts",
  "packages/dicebox-core/src/fixture-round-evidence.ts",
  "packages/dicebox-bridge/src/test-bridge.ts",
  "packages/dicebox-bridge/src/test-bridge-transport.ts",
  "packages/dicebox-bridge/src/stdio-server.ts",
  "packages/dicebox-bridge/src/stdio-receipt.ts",
  "packages/dicebox-core/src/foundry-evidence.ts",
  "packages/dicebox-core/src/fixture-plan.ts",
  "packages/dicebox-core/src/fixture-observation.ts",
  "tests/test-bridge.test.ts",
  "tests/test-bridge-transport.test.ts",
  "tests/stdio-server.test.ts",
  "tools/dbx-test-bridge.ts",
  "tests/stdio-launcher.test.ts",
  "tools/collect-stdio-receipt.ts",
  "tests/stdio-receipt.test.ts",
  "tools/audit-foundry-evidence.ts",
  "tests/foundry-evidence.test.ts",
  "tools/print-foundry-fixture-plan.ts",
  "tests/fixture-plan.test.ts",
  "tools/audit-foundry-fixture-observation.ts",
  "tools/audit-foundry-fixture-observation-bundle.ts",
  "tools/audit-foundry-fixture-round.ts",
  "tests/fixture-observation.test.ts",
  "packages/dicebox-bridge/src/foundry-journal-adapter.ts",
  "packages/dicebox-storage/src/index.ts",
  "tests/foundry-journal-adapter.test.ts",
  "tests/foundry-settings-journal.test.ts",
  "database/schema.sql",
  "database/seed.sql",
  "database/dicebox_campaign_helper_knowledge.sqlite"
];

const failures = [];
const checked = [];
const check = (name, ok, detail) => {
  checked.push({ name, status: ok ? "PASS" : "FAIL", detail });
  if (!ok) failures.push({ name, detail });
};

for (const relativePath of requiredFiles) {
  check(`file:${relativePath}`, existsSync(resolve(root, relativePath)), "required project artifact");
}

const packageJson = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
const manifest = JSON.parse(readFileSync(resolve(root, "tools/harness-manifest.json"), "utf8"));
const moduleManifest = JSON.parse(readFileSync(resolve(root, "packages/dicebox-foundry/module.json"), "utf8"));
check("package:verify-script", packageJson.scripts?.["verify:tooling"] === "node tools/verify-tooling.mjs", "npm script is wired");
check("package:first-round-script", packageJson.scripts?.["test:first-round"] === "npm run check:full", "first-round test script is wired");
check("package:bridge-stdio-script", packageJson.scripts?.["bridge:stdio"] === "tsx tools/dbx-test-bridge.ts", "safe-mode stdio launcher is wired");
check("package:bridge-stdio-receipt-script", packageJson.scripts?.["bridge:stdio:receipt"] === "tsx tools/collect-stdio-receipt.ts", "redacted stdio receipt collector is wired");
check("package:foundry-evidence-audit-script", packageJson.scripts?.["foundry:evidence-audit"] === "tsx tools/audit-foundry-evidence.ts", "non-certifying Foundry evidence audit is wired");
check("package:foundry-fixture-observation-audit-script", packageJson.scripts?.["foundry:fixture-observation-audit"] === "tsx tools/audit-foundry-fixture-observation.ts", "read-only Foundry fixture observation audit is wired");
check("package:foundry-fixture-observation-bundle-audit-script", packageJson.scripts?.["foundry:fixture-observation-bundle-audit"] === "tsx tools/audit-foundry-fixture-observation-bundle.ts", "blocked exact-runtime lane normalization audit is wired");
check("package:foundry-fixture-round-audit-script", packageJson.scripts?.["foundry:fixture-round-audit"] === "tsx tools/audit-foundry-fixture-round.ts", "first-round Foundry API/artifact coverage audit is wired");
check("package:foundry-fixture-plan-script", packageJson.scripts?.["foundry:fixture-plan"] === "tsx tools/print-foundry-fixture-plan.ts", "exact Foundry fixture plan is wired");
check("package:foundry-preflight-script", packageJson.scripts?.["foundry:preflight"] === "node tools/foundry-preflight.mjs", "read-only Foundry fixture preflight is wired");
check("package:foundry-stage-script", packageJson.scripts?.["foundry:stage"] === "node tools/stage-foundry-module.mjs", "collision-safe Foundry module staging is wired");
check("package:foundry-launch-guard-script", packageJson.scripts?.["foundry:launch-guard"] === "node tools/foundry-server.mjs", "fail-closed Foundry Node launch guard is wired");
check("package:kb-query-script", packageJson.scripts?.["kb:query"] === "python database/query_knowledge.py", "read-only bounded KB query service is wired");
check("manifest:identity", moduleManifest.id === "dicebox-campaign-helper", `module id=${moduleManifest.id}`);
check("manifest:esmodules", moduleManifest.version === "0.1.15" && Array.isArray(moduleManifest.esmodules) && moduleManifest.esmodules.length === 1 && moduleManifest.esmodules[0] === "src/entry-20260823-program-scene-v2.js", "single cache-busted ES module entry is present");
check("harness:schema", manifest.schemaVersion === 1 && Array.isArray(manifest.lanes) && manifest.lanes.length >= 5, "lane contract is present");
check("harness:mcp-policy", manifest.mcpPolicy?.readOnlyDefault === true && manifest.mcpPolicy?.forbidden?.includes("eval"), "MCP policy fails closed");
check("harness:evidence-receipt-schema", manifest.lanes.filter((lane) => ["utility-e2e", "visible-chrome", "live-foundry"].includes(lane.id)).every((lane) => lane.receiptSchema === "HarnessLaneReceiptSchema" && Array.isArray(lane.requiredArtifactKinds)), "live lanes name the validated receipt schema and required artifact kinds");
check("harness:runtime-evidence-audit", manifest.lanes.find((lane) => lane.id === "live-foundry")?.runtimeEvidenceSchema === "FoundryRuntimeEvidenceSchema" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.runtimeEvidenceAuditCommand === "npm run foundry:evidence-audit", "live Foundry lane names the canonical runtime-evidence schema and non-certifying audit command");
check("harness:fixture-plan", manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixturePlanSchema === "FoundryFixturePlanSchema" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixturePlanCommand === "npm run foundry:fixture-plan", "live Foundry lane names the exact blocked fixture-plan schema and command");
check("harness:fixture-observation", manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureObservationSchema === "FoundryFixtureObservationReceiptSchema" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureObservationAuditCommand === "npm run foundry:fixture-observation-audit", "live Foundry lane names the read-only fixture-observation receipt and audit command");
check("harness:fixture-observation-bundle", manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureObservationBundleSchema === "FoundryFixtureObservationBundleAuditSchema" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureObservationBundleAuditCommand === "npm run foundry:fixture-observation-bundle-audit", "live Foundry lane names the blocked exact-runtime lane normalization and audit command");
check("harness:fixture-round-evidence", manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureRoundEvidenceSchema === "FoundryFixtureRoundEvidenceSchema" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureRoundEvidenceAuditCommand === "npm run foundry:fixture-round-audit" && manifest.lanes.find((lane) => lane.id === "live-foundry")?.fixtureRoundHarnessSchema === "FoundryFixtureRoundHarnessAuditSchema", "live Foundry lane names the first-round API/artifact coverage audit and blocked harness handoff");
check("harness:stdio-boundary", manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.stdioAdapter === "createFixedOperationStdioServer" && manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.receiptSchema === "StdioTransportReceiptSchema" && manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.receiptCommand === "npm run bridge:stdio:receipt" && manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.foundryApiBoundary?.includes('Hooks.once("ready")') && manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.networkEnabledByDefault === false && manifest.lanes.find((lane) => lane.id === "mcp-loopback")?.mutationEnabledByDefault === false, "MCP loopback declares the guarded no-network/read-only stdio adapter, redacted receipt handoff, and Foundry API boundary");
const launcherSource = readFileSync(resolve(root, "tools/dbx-test-bridge.ts"), "utf8");
check("bridge:stdio-launcher", launcherSource.includes("createSafeModeRuntimeProfile") && launcherSource.includes("createFixedOperationStdioServer") && launcherSource.includes("process.stdin") && launcherSource.includes("process.stdout"), "local launcher uses the fixed safe-mode stdio adapter");
const receiptSource = readFileSync(resolve(root, "packages/dicebox-bridge/src/stdio-receipt.ts"), "utf8");
check("bridge:stdio-receipt", receiptSource.includes("STDIO_RECEIPT_FOUNDRY_API") && receiptSource.includes("foundryApiEvidence") && receiptSource.includes("noRawData"), "stdio receipts name the Foundry API boundary and omit raw payloads");
const evidenceSource = readFileSync(resolve(root, "packages/dicebox-core/src/foundry-evidence.ts"), "utf8");
check("foundry:evidence-audit", evidenceSource.includes("FoundryRuntimeEvidenceSchema") && evidenceSource.includes("readyClaim") && evidenceSource.includes("Hooks.once(\\\"ready\\\")"), "Foundry runtime evidence is schema-validated and permanently non-certifying");
const fixturePlanSource = readFileSync(resolve(root, "packages/dicebox-core/src/fixture-plan.ts"), "utf8");
check("foundry:fixture-plan", fixturePlanSource.includes("FoundryFixturePlanSchema") && fixturePlanSource.includes("dbx-test-world") && fixturePlanSource.includes("mutation: z.literal(\"disabled\")"), "exact Foundry fixture plan is target-bound, API-named, and no-write");
const fixtureObservationSource = readFileSync(resolve(root, "packages/dicebox-core/src/fixture-observation.ts"), "utf8");
check("foundry:fixture-observation", fixtureObservationSource.includes("FoundryFixtureObservationReceiptSchema") && fixtureObservationSource.includes("readyClaim: z.literal(false)") && fixtureObservationSource.includes("noRawData: z.literal(true)"), "exact Foundry fixture observations are schema-validated, redacted, and permanently non-certifying");
const fixtureObservationBundleSource = readFileSync(resolve(root, "packages/dicebox-core/src/fixture-observation-bundle.ts"), "utf8");
check("foundry:fixture-observation-bundle", fixtureObservationBundleSource.includes("FoundryFixtureObservationBundleAuditSchema") && fixtureObservationBundleSource.includes('laneId: "exact-runtime"') && fixtureObservationBundleSource.includes('status: "blocked"'), "fixture observations normalize into the existing exact-runtime harness shape without enabling certification");
const fixtureRoundEvidenceSource = readFileSync(resolve(root, "packages/dicebox-core/src/fixture-round-evidence.ts"), "utf8");
check("foundry:fixture-round-evidence", fixtureRoundEvidenceSource.includes("FoundryFixtureRoundEvidenceSchema") && fixtureRoundEvidenceSource.includes("FoundryFixtureRoundHarnessAuditSchema") && fixtureRoundEvidenceSource.includes("game.version + game.system.id + game.system.version") && fixtureRoundEvidenceSource.includes("noRawData: z.literal(true)"), "first-round evidence audit names the Foundry target boundary, blocked harness handoff, and redaction/non-certification");

try {
  execFileSync(process.execPath, ["--check", resolve(root, "packages/dicebox-foundry/src/module.js")], { cwd: root, stdio: "pipe" });
  check("syntax:foundry-module", true, "node --check");
} catch (error) {
  check("syntax:foundry-module", false, error.stderr?.toString() || error.message);
}

const foundrySource = readFileSync(resolve(root, "packages/dicebox-foundry/src/module.js"), "utf8");
check("module:readiness-certificate-query", foundrySource.includes('query?.kind === "readiness-certificate"'), "installed Foundry module exposes the read-only readiness certificate query");
check("module:state-store-query", foundrySource.includes('query?.kind === "state-store-plan"') && foundrySource.includes("game.settings.get") && foundrySource.includes("Document.getFlag"), "installed Foundry module exposes the read-only StateStore plan and named Foundry API bindings");
check("module:fixture-observation-query", foundrySource.includes('query?.kind === "fixture-observation"') && foundrySource.includes('getEmbeddedDocument("Activity"') && foundrySource.includes('getEmbeddedDocument("Region"') && foundrySource.includes("getEmbeddedCollection(\"RegionBehavior\")"), "installed Foundry module exposes the fixed read-only fixture observation query and named native APIs");
const storageSource = readFileSync(resolve(root, "packages/dicebox-storage/src/program-state-store.ts"), "utf8");
check("program:state-store-boundary", storageSource.includes("createProgramStateStore") && storageSource.includes("UNKNOWN_OUTCOME") && storageSource.includes("preserve-unknown"), "program StateStore is versioned, append-only, recovery-aware, and migration-preserving");
const forbiddenPatterns = [
  /\b(?:Document\.)?(?:create|createDocuments|update|updateDocuments|delete|deleteDocuments)\s*\(/,
  /\bsettings\.register\s*\(/,
  /\beval\s*\(/,
  /\bnew\s+Function\s*\(/
];
const mutationMatches = forbiddenPatterns.flatMap((pattern) => foundrySource.match(pattern) ?? []);
check("boundary:read-only-module", mutationMatches.length === 0, mutationMatches.length ? mutationMatches.join(", ") : "no forbidden mutation surface found");

try {
  const python = process.env.DICEBOX_PYTHON ?? "python";
  const output = execFileSync(python, ["database/verify_database.py"], { cwd: root, stdio: "pipe" }).toString().trim();
  check("database:integrity", true, output);
} catch (error) {
  check("database:integrity", false, error.stderr?.toString() || error.message);
}

const result = { status: failures.length === 0 ? "PASS" : "FAIL", checked, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
