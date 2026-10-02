import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createTramCalibrationPlan } from "../packages/dicebox-compiler/src/tram-calibration-plan.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "packages/dicebox-foundry/tram-calibration-package.json");

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(createTramCalibrationPlan(), null, 2)}\n`, "utf8");
console.log(JSON.stringify({ operation: "tram-calibration.package", status: "STATIC_REVIEW", output, noWrite: true }));
