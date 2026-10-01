import { createHash } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createAscendancyMapBlueprints,
  createAscendancyRegionPlans,
  createAscendancyStaticTilePlan,
  createUniversalBattlemapExport,
} from "../packages/dicebox-compiler/src/index.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const reviewedManualCandidates = {
  "ascendancy-tram-depot": "assets/maps/ascendancy-tram-depot-routing-yard-v6-neutral.png",
  "signal-frequency-chamber": "assets/maps/manual-signal-frequency-chamber-v5-neutral.png",
  "rune-mechanism-chamber": "assets/maps/manual-rune-mechanism-chamber-v5-neutral.png",
  "central-core-control-chamber": "assets/maps/manual-central-core-control-chamber-v5-neutral.png",
} as const;

type ExportableRoom = keyof typeof reviewedManualCandidates;

function usage(): never {
  throw new Error(
    `Usage: tsx tools/write-universal-battlemap-export.ts --room <${Object.keys(reviewedManualCandidates).join("|")}> [--out-dir <workspace-relative-path>]`,
  );
}

function option(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function assertWorkspaceRelative(path: string) {
  const resolved = resolve(root, path);
  const rel = relative(root, resolved);
  if (rel === "" || rel.startsWith(`..${sep}`) || rel === "..") {
    throw new Error(`Output path must stay inside this workspace: ${path}`);
  }
  return resolved;
}

function pngDimensions(bytes: Buffer) {
  const signature = "89504e470d0a1a0a";
  if (bytes.subarray(0, 8).toString("hex") !== signature || bytes.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error("Renderer must be a valid PNG with an IHDR header.");
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function placementGuide(
  room: string,
  sidecar: ReturnType<typeof createUniversalBattlemapExport>["regionSidecar"],
) {
  const rows = sidecar.regions.map((region) =>
    `| ${region.label} | \`${region.regionId}\` | ${region.bounds.x} | ${region.bounds.y} | ${region.bounds.width} | ${region.bounds.height} | ${region.interaction} |`,
  ).join("\n");
  return `# ${room} — DiceBox Region Placement\n\n`
    + "Create one rectangular Foundry Region for each row. Set its **name** to the exact\n"
    + "Region name below, then position it using these Scene-pixel coordinates. Record the\n"
    + "new Foundry Region UUID next to its stable DiceBox ID for the Regionwright handoff.\n\n"
    + "This file is a sidecar instruction sheet: Universal VTT imports walls and doors, not\n"
    + "DiceBox Regions, RegionBehaviors, puzzle state, or UUID bindings. Do not use this\n"
    + "candidate export as proof of a live Foundry Scene.\n\n"
    + "| Foundry Region name | Stable DiceBox ID | x | y | width | height | Purpose |\n"
    + "| --- | --- | ---: | ---: | ---: | ---: | --- |\n"
    + `${rows}\n`;
}

function backgroundObjectGuide(room: string, sceneId: string) {
  const objects = createAscendancyStaticTilePlan().tiles.filter((tile) => tile.sceneId === sceneId);
  if (objects.length === 0) return undefined;
  const rows = objects.map((tile) =>
    `| ${tile.label} | \`${tile.tileId}\` | ${tile.bounds.x} | ${tile.bounds.y} | ${tile.bounds.width} | ${tile.bounds.height} | \`${tile.assetPath}\` |`,
  ).join("\n");
  return `# ${room} — Background Object Placement\n\n`
    + "After importing the UVTT, create the following native Foundry Tiles as visual\n"
    + "Background Objects. Use the exact name, stable ID, source asset, and rectangle.\n"
    + "They are fixed visual apparatus only; they do not replace Walls, doors, Regions,\n"
    + "or RegionBehaviors. They must be reread as separate Foundry TileDocuments.\n\n"
    + "| Foundry Tile name | Stable DiceBox ID | x | y | width | height | Texture asset |\n"
    + "| --- | --- | ---: | ---: | ---: | ---: | --- |\n"
    + `${rows}\n`;
}

const room = option("--room") as ExportableRoom | undefined;
if (room === undefined || !(room in reviewedManualCandidates)) usage();
const outputRoot = assertWorkspaceRelative(option("--out-dir") ?? "outputs/universal-battlemap-candidates");
const rendererRelativePath = reviewedManualCandidates[room];
const rendererPath = assertWorkspaceRelative(rendererRelativePath);
const rendererBytes = await readFile(rendererPath);
const dimensions = pngDimensions(rendererBytes);
const rendererSha256 = createHash("sha256").update(rendererBytes).digest("hex");
const blueprint = createAscendancyMapBlueprints().find((candidate) => candidate.blueprintId === `dbx:blueprint:${room}`);
const regionPlan = createAscendancyRegionPlans().find((candidate) => candidate.roomId === `dbx:room:${room}`);
if (blueprint === undefined || regionPlan === undefined) throw new Error(`Missing Ascendancy geometry for ${room}.`);

const exported = createUniversalBattlemapExport(blueprint, regionPlan, {
  path: rendererRelativePath,
  sha256: rendererSha256,
  ...dimensions,
});
const outputDirectory = resolve(outputRoot, room);
await mkdir(outputRoot, { recursive: true });
let createdOutputDirectory = false;
try {
  await mkdir(outputDirectory);
  createdOutputDirectory = true;
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === "EEXIST") {
    throw new Error(`Refusing to replace an existing Universal Battlemap candidate bundle: ${outputDirectory}`);
  }
  throw error;
}
const uvttPath = resolve(outputDirectory, `${room}.uvtt`);
const sidecarPath = resolve(outputDirectory, `${room}.dicebox-regions.json`);
const placementPath = resolve(outputDirectory, `${room}.REGION-PLACEMENT.md`);
const backgroundObjectPath = resolve(outputDirectory, `${room}.BACKGROUND-OBJECT-PLACEMENT.md`);
const receiptPath = resolve(outputDirectory, `${room}.receipt.json`);
const backgroundObjects = backgroundObjectGuide(room, regionPlan.sceneId);
const uvtt = { ...exported.uvtt, image: rendererBytes.toString("base64"), environment: {} };
const receipt = {
  operation: "universal-battlemap.candidate-export",
  status: "CANDIDATE_WRITTEN",
  noFoundryWrite: true,
  readyClaim: false,
  roomId: regionPlan.roomId,
  blueprintId: blueprint.blueprintId,
  renderer: {
    path: rendererRelativePath,
    sha256: rendererSha256,
    width: dimensions.width,
    height: dimensions.height,
  },
  uvtt: { path: relative(root, uvttPath), wallCount: uvtt.line_of_sight.length, doorCount: uvtt.portals.length },
  sidecar: { path: relative(root, sidecarPath), regionCount: exported.regionSidecar.regions.length },
  placementGuide: relative(root, placementPath),
  backgroundObjectGuide: backgroundObjects === undefined ? null : relative(root, backgroundObjectPath),
  importBoundary: exported.regionSidecar.importBoundary,
  preservationScope: "No Foundry Scene, Wall, Region, Tile, Macro, RegionBehavior, or foreign document was read or changed.",
};

try {
  for (const [path, content] of [
    [uvttPath, `${JSON.stringify(uvtt, null, 2)}\n`],
    [sidecarPath, `${JSON.stringify(exported.regionSidecar, null, 2)}\n`],
    [placementPath, placementGuide(room, exported.regionSidecar)],
    ...(backgroundObjects === undefined ? [] : [[backgroundObjectPath, backgroundObjects] as const]),
    [receiptPath, `${JSON.stringify(receipt, null, 2)}\n`],
  ] as const) {
    await writeFile(path, content, { encoding: "utf8", flag: "wx" });
  }
} catch (error) {
  if (createdOutputDirectory) await rm(outputDirectory, { recursive: true, force: true });
  throw error;
}

console.log(JSON.stringify(receipt, null, 2));
