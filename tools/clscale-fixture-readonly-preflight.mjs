// Repeatable, offline-only acceptance gate for the migrated Central Lodge fixture.
// NEVER launches Foundry, runs Region scripts, or touches production world data.
import { createRequire } from "node:module";
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { ClassicLevel } = require("C:/Program Files/Foundry Virtual Tabletop/resources/app/node_modules/classic-level");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fixture = join(repo, "work", "foundry-fixture-data-permanent");
const target = join(fixture, "Data", "worlds", "dbx-test-world");
const stage = join(repo, "work", "clscale-central-lodge-migration-v001");
const savedPath = join(stage, "fixture-readonly-preflight-latest.json");
const historyPath = join(stage, "fixture-readonly-preflight-history.jsonl");
const result = { gate: "CLScale Central Lodge fixture offline preflight", checkedAt: new Date().toISOString(),
  status: "UNKNOWN", targetWorld: "dbx-test-world", checks: {}, failures: [],
  guarantees: { productionWrites: false, fixtureWorldWrites: false, regionScriptExecuted: false,
    noFirewallChanges: true, committedTeleportAttempted: false } };
const expect = (ok, name, details = "") => {
  result.checks[name] = { pass: !!ok, ...(details ? { details } : {}) };
  if (!ok) result.failures.push(name + (details ? ": " + details : ""));
};
const digest = b => createHash("sha256").update(b).digest("hex");
async function records(name) {
  const db = new ClassicLevel(join(target, "data", name), { keyEncoding: "utf8", valueEncoding: "utf8" });
  const out = [];
  await db.open();
  try { for await (const [k, v] of db.iterator()) out.push([String(k), String(v)]); }
  finally { await db.close(); }
  return out;
}
async function loadJson(name) { return JSON.parse(await readFile(join(stage, name), "utf8")); }
const checkAssetGroup = async (receipt, root, subpathField) => {
  const missing = [], mismatch = [];
  for (const f of receipt) {
    const sub = f[subpathField];
    if (!sub || sub.includes("..") || sub.startsWith("/") || sub.includes("\\")) {
      mismatch.push("invalid path"); continue;
    }
    try {
      const file = await readFile(join(root, ...sub.split("/")));
      if (file.length !== f.bytes || digest(file) !== f.sha256) mismatch.push(sub);
    } catch { missing.push(sub); }
  }
  return { total: receipt.length, missing, mismatch };
};
try {
  const world = JSON.parse(await readFile(join(target, "world.json"), "utf8"));
  expect(world.id === "dbx-test-world" && world.coreVersion === "14.367" &&
    world.system === "dnd5e" && world.systemVersion === "5.3.3", "targetIdentityAndVersions");
  const net = spawnSync("netstat", ["-ano", "-p", "tcp"], { encoding: "utf8", windowsHide: true, timeout: 8000 });
  const listening = net.status === 0 && /^\s*TCP\s+\S+:30005\s+\S+\s+LISTENING\s+/im.test(net.stdout);
  expect(net.status === 0 && !listening, "fixturePort30005Stopped", net.status === 0 ? "Listener: " + listening : "netstat failed");
  // Fail CLOSED before opening any LevelDB handle: do not race a running Foundry server.
  if (net.status !== 0 || listening) throw new Error("FIXTURE_PORT_ACTIVE_OR_UNKNOWN_ABORT_BEFORE_DATABASE_OPEN");
  const sourceState = await loadJson("central-scene-dependency-audit-v001.json");
  const closure = await loadJson("actor-folder-dependency-audit-v001.json");
  const moduleRows = await records("settings");
  let moduleConfig = null;
  for (const [k, v] of moduleRows) {
    if (!/^!settings![^!]+$/.test(k)) continue;
    const doc = JSON.parse(v);
    if (doc.key === "core.moduleConfiguration") moduleConfig = JSON.parse(doc.value);
  }
  const compatibilityReceipt = await loadJson("simple-calendar-fixture-compat-receipt-v001.json");
  expect(compatibilityReceipt.status === "DISPOSABLE_FIXTURE_CALENDAR_DISABLED_ONLY" &&
    compatibilityReceipt.targetWorld === "dbx-test-world" &&
    compatibilityReceipt.module === "foundryvtt-simple-calendar" &&
    compatibilityReceipt.beforeCount === 39 && compatibilityReceipt.afterCount === 38 &&
    compatibilityReceipt.requiredDependents === 0, "calendarQuarantineDocumented",
    "fixture-only reversible compatibility exception");
  const enabled = Object.entries(moduleConfig ?? {}).filter(([, on]) => on === true).map(([id]) => id);
  expect(enabled.length === 38 && moduleConfig?.["rest-recovery"] === false &&
    moduleConfig?.["foundryvtt-simple-calendar"] === false &&
    enabled.includes("dicebox-campaign-helper") && enabled.includes("regionwright"), "moduleEnableConfiguration",
    "enabled=" + enabled.length + ", excluded=Simple Calendar 2.4.18 (v14 runtime errors)");
  const moduleDir = join(fixture, "Data", "modules");
  const missingModules = [], moduleManifests = new Map();
  for (const id of enabled) {
    try {
      const json = JSON.parse(await readFile(join(moduleDir, id, "module.json"), "utf8"));
      if (json.id !== id) missingModules.push(id + " id-mismatch");
      else moduleManifests.set(id, json);
    } catch { missingModules.push(id); }
  }
  expect(missingModules.length === 0, "enabledModuleManifests", "missing=" + missingModules.join(","));
  // Foundry v14 declares required packages under relationships.requires and relationships.systems.
  const requiredFailures = [];
  let declaredRequired = 0;
  for (const [id, json] of moduleManifests) {
    const links = json.relationships ?? {};
    const deps = [...(links.requires ?? []).map(d => ({...d, type: d.type ?? "module"})),
      ...(links.systems ?? []).map(d => ({...d, type: d.type ?? "system"}))];
    for (const dep of deps) {
      declaredRequired++;
      if (dep.type === "system" ? dep.id !== world.system : !moduleManifests.has(dep.id)) {
        requiredFailures.push(id + " -> " + dep.type + ":" + dep.id);
      }
    }
    const min = parseInt(json.compatibility?.minimum ?? "", 10);
    const max = parseInt(json.compatibility?.maximum ?? "", 10);
    if (Number.isInteger(min) && min > 14) requiredFailures.push(id + " core minimum " + min);
    if (Number.isInteger(max) && max < 14) requiredFailures.push(id + " core maximum " + max);
  }
  expect(requiredFailures.length === 0, "declaredRequiredModuleDependencies",
    "required=" + declaredRequired + "; blocked=" + requiredFailures.join(","));
  const sceneIds = new Set(sourceState.sceneNames.map(s => s.id));
  const actorIds = new Set(closure.requestedActors);
  const sceneRows = await records("scenes");
  const roots = new Set(), families = {}, observedActors = new Set();
  let enabledBehaviors = 0, codeSyntaxErrors = 0, teleportSources = 0;
  for (const [k, v] of sceneRows) {
    const m = /^!([^!]+)!([^!]+)$/.exec(k);
    if (!m) { result.failures.push("malformed-scene-key"); continue; }
    const fam = m[1], sceneId = m[2].split(".")[0];
    if (!sceneIds.has(sceneId)) result.failures.push("unexpected-scene-id:" + sceneId);
    families[fam] = (families[fam] ?? 0) + 1;
    const obj = JSON.parse(v);
    if (fam === "scenes") roots.add(sceneId);
    if (fam === "scenes.tokens" && obj.actorId) observedActors.add(obj.actorId);
    if (fam === "scenes.regions.behaviors") {
      if (!obj.disabled) enabledBehaviors++;
      const script = obj.system?.source;
      if (typeof script !== "string" || !script) codeSyntaxErrors++;
      else {
        try { new AsyncFunction(script); } catch { codeSyntaxErrors++; }
        if (/\.teleportToken\s*\(/.test(script)) teleportSources++;
      }
    }
  }
  expect(roots.size === 21 && sceneRows.length === 928 &&
    sceneIds.size === 21 && [...roots].every(id => sceneIds.has(id)), "sceneIdsAndRecordCount",
    "scenes=" + roots.size + ", records=" + sceneRows.length);
  expect(families["scenes.regions"] === 202 &&
    families["scenes.regions.behaviors"] === 120 &&
    families["scenes.walls"] === 444 && families["scenes.tokens"] === 22,
    "sceneWiringCounts", JSON.stringify(families));
  expect(codeSyntaxErrors === 0 && enabledBehaviors === 118, "regionScriptSyntaxAndEnabledCount",
    "syntax errors=" + codeSyntaxErrors + ", enabled=" + enabledBehaviors);
  expect(teleportSources === 4, "knownTeleportScriptCount", "scripts=" + teleportSources);
  expect(observedActors.size === actorIds.size &&
    [...observedActors].every(id => actorIds.has(id)), "sceneTokenActorClosure");
  const actorRows = await records("actors");
  const observedActorRoots = new Set(actorRows
    .filter(([k]) => /^!actors![^!]+$/.test(k)).map(([k]) => k.split("!")[2]));
  expect(actorRows.length === 882 && observedActorRoots.size === 6 &&
    [...actorIds].every(id => observedActorRoots.has(id)), "actorDocumentClosure");
  const sceneAssetReceipt = await loadJson("scene-asset-alias-receipt-v001.json");
  const tokenAssetReceipt = await loadJson("actor-token-image-copy-receipt-v001.json");
  const sceneAssets = await checkAssetGroup(sceneAssetReceipt.files,
    join(fixture, "Data", "worlds", "the-lost-mine-of-phandalin"), "sub");
  const tokenAssets = await checkAssetGroup(tokenAssetReceipt.images,
    join(fixture, "Data"), "path");
  expect(sceneAssets.total === 28 && sceneAssets.missing.length === 0 && sceneAssets.mismatch.length === 0,
    "sceneArtIntegrity", JSON.stringify({ missing: sceneAssets.missing, mismatched: sceneAssets.mismatch }));
  expect(tokenAssets.total === 12 && tokenAssets.missing.length === 0 && tokenAssets.mismatch.length === 0,
    "actorTokenImageIntegrity", JSON.stringify({ missing: tokenAssets.missing, mismatched: tokenAssets.mismatch }));
  const importedClosure = await loadJson("clscale-runtime-closure-install-receipt-v001.json");
  const itemRows = (await records("items")).filter(([k]) => /^!items![^!]+$/.test(k));
  const journalRows = (await records("journal")).filter(([k]) => /^!journal![^!]+$/.test(k));
  const macroRows = (await records("macros")).filter(([k]) => /^!macros![^!]+$/.test(k));
  const stable = o => o.flags?.world?.dicebox?.stableId;
  const importedItems = itemRows.map(([,v]) => JSON.parse(v)).filter(d =>
    stable(d)?.startsWith("dbx:central-lodge:item:"));
  const liveKernels = macroRows.map(([,v]) => JSON.parse(v)).filter(d =>
    stable(d) === "dbx:central-lodge:macro:runtime");
  const liveLedgers = journalRows.map(([,v]) => JSON.parse(v)).filter(d =>
    stable(d) === "dbx:central-lodge:state");
  const ledgerItemStable = Object.values(liveLedgers[0]?.flags?.world?.dicebox?.state?.items ?? {})
    .map(x => x.stableId);
  const kernelCode = String(liveKernels[0]?.command ?? "");
  let kernelSyntaxValid = false;
  try { new AsyncFunction(kernelCode); kernelSyntaxValid = true; } catch {}
  expect(importedClosure.status === "DISPOSABLE_RUNTIME_CLOSURE_IMPORTED_AND_REREAD" &&
    importedItems.length === 33 && new Set(importedItems.map(stable)).size === 33 &&
    liveKernels.length === 1 && liveLedgers.length === 1 &&
    ledgerItemStable.length === 33 &&
    ledgerItemStable.every(x => importedItems.some(d => stable(d) === x)) &&
    kernelSyntaxValid &&
    kernelCode.includes("DISPOSABLE_FIXTURE_TRANSITION_LOCKED_PENDING_VERIFIED_BATCH") &&
    !/case\\s+"transition"\\s*:\\s*return\\s+await\\s+runTransition/.test(kernelCode),
    "runtimeKernelLedgerAndItemsClosure", "items="+importedItems.length+
      "; kernel="+liveKernels.length+"; ledger="+liveLedgers.length+"; executableTransitions=false");
  const menuReceipt = await loadJson("clscale-depot-native-reconciliation-v001.json");
  const previewData = await loadJson("clscale-depot-menu-preview-v002.json");
  const menuBehaviorStable = "dbx:central-lodge:n3:behavior:depot-menu-preview";
  const installedMenus = sceneRows
    .filter(([k]) => k.startsWith("!scenes.regions.behaviors!"))
    .map(([k,v]) => ({key:k,doc:JSON.parse(v)}))
    .filter(x => stable(x.doc) === menuBehaviorStable);
  const menu = installedMenus[0];
  const menuScript = String(menu?.doc?.system?.source ?? "");
  expect(menuReceipt.status === "NATIVE_REGION_DEPOT_MENU_RECONCILED" &&
    menuReceipt.worldId === "dbx-test-world" &&
    menuReceipt.preservedOriginalBehaviors === 119 &&
    menuReceipt.remainingMenuDuplicates === 0 &&
    installedMenus.length === 1 && menu?.doc?.disabled === true &&
    menu?.doc?.type === "executeScript" &&
    menu?.key === "!scenes.regions.behaviors!pHQvDUDlyWZFuNrX.tsRjZiiXw0qmktQS."+
      menuReceipt.nativeBehaviorId &&
    menu?.doc?.system?.events?.length === 1 &&
    menu?.doc?.system?.events?.[0] === "tokenEnter" &&
    digest(previewData.regionBehavior.system.source) === menuReceipt.sourceSha256 &&
    menuScript === previewData.regionBehavior.system.source.trimEnd() &&
    !/\.teleportToken\s*\(|createEmbeddedDocuments|deleteEmbeddedDocuments/.test(menuScript),
    "depotPreviewInstalledButDisabled", "exactly one inert menu; original behavior count=119");
  result.statistics = { scenes: roots.size, sceneRecords: sceneRows.length, regions: 202,
    regionBehaviors: 120, disabledDepotPreview: installedMenus.length,
    enabledRegionBehaviors: enabledBehaviors, teleportSourceScripts: teleportSources,
    referencedActors: observedActors.size, installedAndEnabledModules: enabled.length,
    sceneArtFiles: sceneAssets.total, actorTokenArtFiles: tokenAssets.total };
} catch (error) { result.failures.push(error.message || String(error)); }
result.status = result.failures.length === 0 ? "OFFLINE_PREFLIGHT_PASS" : "OFFLINE_PREFLIGHT_FAILED";
result.runtimePermission = "NOT_AUTHORIZED_BY_THIS_CHECK";
if (process.argv.includes("--save")) {
  await writeFile(savedPath, JSON.stringify(result, null, 2) + "\n");
  await appendFile(historyPath, JSON.stringify({ checkedAt: result.checkedAt, status: result.status,
    failures: result.failures, checks: Object.keys(result.checks).length }) + "\n");
}
console.log(JSON.stringify(result, null, 2));
if (result.failures.length) process.exitCode = 1;
