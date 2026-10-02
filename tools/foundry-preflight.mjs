import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TARGET = Object.freeze({ foundry: "14.367", system: "dnd5e", systemVersion: "5.3.3" });
const PACKAGE_ID = "dicebox-campaign-helper";

function readJson(filePath) {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function check(id, status, title, api, reason) {
  return { id, status, title, foundryApi: api, reason };
}

export function createPreflightReport(options = {}) {
  const dataPath = typeof options.dataPath === "string" ? resolve(options.dataPath) : null;
  // Match Foundry's Node/desktop contract: --dataPath is the application
  // root, while package and world data live beneath its Data/ directory.
  // Keeping this normalization here prevents a preflight PASS from being
  // produced for a different tree than the launch guard will actually use.
  const foundryDataPath = dataPath ? join(dataPath, "Data") : null;
  const worldId = typeof options.worldId === "string" && options.worldId.length > 0
    ? options.worldId
    : "dbx-test-world";
  const world = foundryDataPath ? readJson(join(foundryDataPath, "worlds", worldId, "world.json")) : null;
  const systemId = typeof world?.system === "string" ? world.system : null;
  const system = foundryDataPath && systemId ? readJson(join(foundryDataPath, "systems", systemId, "system.json")) : null;
  const module = foundryDataPath ? readJson(join(foundryDataPath, "modules", PACKAGE_ID, "module.json")) : null;
  const midi = foundryDataPath ? readJson(join(foundryDataPath, "modules", "midi-qol", "module.json")) : null;
  const dae = foundryDataPath ? readJson(join(foundryDataPath, "modules", "dae", "module.json")) : null;
  const baseChecks = [
    check(
      "data-path",
      dataPath && existsSync(dataPath) ? "PASS" : "BLOCKED",
      "Foundry data path is configured",
      "Foundry --dataPath",
      foundryDataPath && existsSync(foundryDataPath) ? "The preflight can inspect the configured application root and its Data/ directory." : "Set DICEBOX_FOUNDRY_DATA_PATH to a readable Foundry application root containing Data/.",
    ),
    check(
      "world-manifest",
      world ? "PASS" : "BLOCKED",
      "Requested world manifest is readable",
      "world.json",
      world ? `World ${worldId} has a readable world.json manifest.` : `World ${worldId} was not found or its world.json is malformed.`,
    ),
    check(
      "world-id",
      world?.id === worldId ? "PASS" : "BLOCKED",
      "World identity matches the selected fixture",
      "world.json.id",
      world?.id === worldId ? "The manifest ID matches the bounded fixture identity." : "The world manifest ID does not match the requested fixture identity.",
    ),
    check(
      "foundry-target",
      world?.coreVersion === TARGET.foundry ? "PASS" : "BLOCKED",
      "World core version matches the DiceBox target",
      "world.json.coreVersion / Foundry runtime game.version",
      world?.coreVersion === TARGET.foundry ? `World metadata targets Foundry ${TARGET.foundry}.` : `Observed world coreVersion=${world?.coreVersion ?? "unknown"}; target is Foundry ${TARGET.foundry}.`,
    ),
    check(
      "system-target",
      systemId === TARGET.system && system?.version === TARGET.systemVersion && world?.systemVersion === TARGET.systemVersion ? "PASS" : "BLOCKED",
      "World system matches the DiceBox target",
      "world.json.system / world.json.systemVersion / systems/dnd5e/system.json.version",
      systemId === TARGET.system && system?.version === TARGET.systemVersion && world?.systemVersion === TARGET.systemVersion
        ? `World and installed system metadata match ${TARGET.system}@${TARGET.systemVersion}.`
        : `Observed world/system=${systemId ?? "unknown"}@${world?.systemVersion ?? "unknown"}/${system?.version ?? "unknown"}; target is ${TARGET.system}@${TARGET.systemVersion}.`,
    ),
    check(
      "dicebox-module-package",
      module?.id === PACKAGE_ID ? "PASS" : "BLOCKED",
      "DiceBox module package is installed in the selected data path",
      "modules/dicebox-campaign-helper/module.json",
      module?.id === PACKAGE_ID ? "The installed module manifest has the canonical DiceBox package ID." : "Install the reviewed module package into the selected Foundry data path before the live probe.",
    ),
    check(
      "optional-module-manifests",
      midi || dae ? "PASS" : "UNKNOWN",
      "Optional module manifests are observable",
      "modules/midi-qol/module.json / modules/dae/module.json",
      midi || dae ? `Optional manifest evidence: Midi-QOL=${midi?.version ?? "absent"}, DAE=${dae?.version ?? "absent"}.` : "Midi-QOL and DAE manifests were not observed; optional behavior remains unknown.",
    ),
    check(
      "live-runtime-probe",
      "NOT_TESTED",
      "Exact Foundry runtime probe has executed",
      "Hooks.once(\"ready\") + game.version/game.system + game.diceboxCampaignHelper.readiness-report",
      "This command reads fixture manifests only; it never launches Foundry and cannot certify live API behavior, permissions, authority, or read-back.",
    ),
  ];
  const blocking = baseChecks.filter((entry) => entry.status !== "PASS");
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:foundry-preflight-${worldId}`,
    operation: "foundry.fixture.preflight",
    status: blocking.length === 0 ? "PASS" : "BLOCKED",
    evidenceClass: "deterministic",
    noWrite: true,
    target: TARGET,
    selected: { worldId, dataPathConfigured: Boolean(dataPath) },
    observed: {
      worldCoreVersion: world?.coreVersion ?? null,
      worldSystem: systemId,
      worldSystemVersion: world?.systemVersion ?? null,
      installedSystemVersion: system?.version ?? null,
      diceboxModuleVersion: module?.version ?? null,
      midiQolVersion: midi?.version ?? null,
      daeVersion: dae?.version ?? null,
    },
    checks: Object.freeze(baseChecks),
    notes: Object.freeze([
      "This is a read-only filesystem preflight; it does not launch Foundry, load a world, invoke a Foundry API, or change fixture state.",
      "A PASS here would establish manifest compatibility only; the installed module readiness report and exact Foundry behavior remain separate evidence gates.",
    ]),
  });
}

function main() {
  const report = createPreflightReport({
    dataPath: process.env.DICEBOX_FOUNDRY_DATA_PATH,
    worldId: process.env.DICEBOX_FOUNDRY_WORLD_ID,
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== "PASS") process.exitCode = 2;
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath === fileURLToPath(import.meta.url)) main();
