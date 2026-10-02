import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  FIXED_TEST_WORLD_ID,
  StdioTransportReceiptSchema,
  createStdioTransportReceipt,
  stdioServerReportSchema,
  bridgeTransportResponseSchema,
} from "@dicebox/bridge";
import { createSafeModeRuntimeProfile } from "@dicebox/bridge";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const launcher = resolve(root, "tools/dbx-test-bridge.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");
const request = JSON.stringify({
  schemaVersion: "0.1.0",
  requestId: "dbx:request:stdio-receipt",
  worldId: FIXED_TEST_WORLD_ID,
  operation: "status",
});

const outputArgumentIndex = process.argv.indexOf("--output");
const outputArgument = outputArgumentIndex >= 0 ? process.argv[outputArgumentIndex + 1] : undefined;
if (outputArgumentIndex >= 0 && (!outputArgument || outputArgument.startsWith("--"))) {
  process.stderr.write("--output requires a path.\n");
  process.exit(2);
}

const result = spawnSync(process.execPath, [tsxCli, launcher], {
  cwd: root,
  input: `${request}\n`,
  encoding: "utf8",
  windowsHide: true,
});

const responseLines = result.stdout.trim().length === 0
  ? []
  : result.stdout.trim().split(/\r?\n/);
let responses: unknown[] = [];
let responseParsingFailed = false;
try {
  responses = responseLines.map((line) => bridgeTransportResponseSchema.parse(JSON.parse(line)));
} catch {
  responseParsingFailed = true;
}

let report = parseReport(result.stderr);
if (responseParsingFailed || result.error || result.status !== 0) {
  report = stdioServerReportSchema.parse({
    schemaVersion: "0.1.0",
    transport: "stdio",
    worldId: FIXED_TEST_WORLD_ID,
    status: "unknown",
    requests: report?.requests ?? 0,
    responses: responses.length,
    readOnly: true,
    mutationEnabled: false,
    networkEnabled: false,
    notes: ["The launcher process or protocol output could not be parsed; transport outcome is unknown."],
  });
}

const receipt = StdioTransportReceiptSchema.parse(createStdioTransportReceipt({
  profile: createSafeModeRuntimeProfile(),
  report,
  responses,
}));
const serialized = `${JSON.stringify(receipt, null, 2)}\n`;

if (outputArgument) {
  const outputPath = resolve(root, outputArgument);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, serialized, { encoding: "utf8", flag: "wx" });
}

process.stdout.write(serialized);
if (receipt.status !== "pass") process.exitCode = 2;

function parseReport(stderr: string) {
  try {
    return stdioServerReportSchema.parse(JSON.parse(stderr.trim()));
  } catch {
    return stdioServerReportSchema.parse({
      schemaVersion: "0.1.0",
      transport: "stdio",
      worldId: FIXED_TEST_WORLD_ID,
      status: "unknown",
      requests: 0,
      responses: 0,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
      notes: ["The launcher report was missing or invalid; transport outcome is unknown."],
    });
  }
}
