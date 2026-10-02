import { createTramCalibrationPlan } from "@dicebox/compiler";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(".");
const plan = createTramCalibrationPlan();
const sha256 = async (relativePath: string) => createHash("sha256").update(await readFile(join(root, relativePath))).digest("hex");
const receipt = {
  operation: "tram-calibration.plan",
  status: "STATIC_REVIEW",
  evidenceClass: "deterministic",
  noWrite: true,
  plan,
  sourceVersion: "calibration-injection:v1",
  sourceHashes: {
    plan: await sha256("packages/dicebox-compiler/src/tram-calibration-plan.ts"),
    renderer: await sha256(plan.scene.rendererPath),
  },
  coordinateAssumptions: {
    canvas: plan.scene.canvas,
    tileAndRegionBounds: plan.tile.bounds,
    tramBoard: { origin: { x: 420, y: 210 }, cellWidth: 110, cellHeight: 95, columns: 6, rows: 6 },
    tramCoreAdjacency: { tramDoor: { x: 1512, y: 447.5 }, coreDoor: { x: 24, y: 447.5 } },
  },
  foundryApis: [plan.walls.api, plan.tile.api, plan.region.api, plan.reread.scene, plan.reread.tile, plan.reread.region],
  preservationScope: plan.preservationScope,
  notes: [
    "Static plan/asset receipt only; no Foundry Document API was invoked.",
    "The calibration is restricted to dbx-test-world and cannot target Ballad.",
    "Exact-runtime active-GM preview, apply, and authoritative reread remain required before injection.",
  ],
};
const outputDirectory = join(root, "outputs");
const output = join(outputDirectory, "m117-tram-calibration-static-receipt.json");
await mkdir(outputDirectory, { recursive: true });
await writeFile(output, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({ output, noWrite: true, status: receipt.status })}\n`);
