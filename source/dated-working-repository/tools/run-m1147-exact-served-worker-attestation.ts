import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { auditServedWorker } from "./audit-foundry-served-worker.mjs";

const root = resolve(import.meta.dirname, "..");
const outputPath = resolve(root, "outputs/m1147-stage12-exact-served-worker-attestation-receipt.json");
const receipt = await auditServedWorker({
  baseUrl: "http://127.0.0.1:30001",
  sourcePath: resolve(root, "packages/dicebox-foundry/src/foundry-live-bridge.js"),
  specPath: resolve(root, "outputs/m1144-current-foundry-artifact-spec-receipt.json"),
  target: {
    dataRoot: "work/foundry-fixture-data-v2",
    worldId: "dbx-test-world",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    port: 30001,
  },
});
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ outputPath, status: receipt.status, served: receipt.served, blockers: receipt.blockers }, null, 2));
if (receipt.status !== "PASS") process.exitCode = 2;
