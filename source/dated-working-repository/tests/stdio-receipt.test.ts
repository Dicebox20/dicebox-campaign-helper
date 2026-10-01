import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FIXED_TEST_WORLD_ID,
  StdioTransportReceiptSchema,
  bridgeTransportResponseSchema,
  createFixedOperationBridge,
  createFixedOperationStdioServer,
  createSafeModeRuntimeProfile,
  createStdioTransportReceipt,
  stdioServerReportSchema,
} from "@dicebox/bridge";
import { createStableDiceBoxId } from "@dicebox/core";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const collector = resolve(root, "tools/collect-stdio-receipt.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");

function statusLine() {
  return JSON.stringify({
    schemaVersion: "0.1.0",
    requestId: createStableDiceBoxId("request", "receipt-test"),
    worldId: FIXED_TEST_WORLD_ID,
    operation: "status",
  });
}

async function runInProcess(lines: readonly string[]) {
  const output: string[] = [];
  const server = createFixedOperationStdioServer({
    bridge: createFixedOperationBridge({ runtime: createSafeModeRuntimeProfile() }),
    input: { lines, writeLine: (line) => { output.push(line); } },
  });
  const report = await server.run();
  return { report, output };
}

describe("redacted stdio transport receipts", () => {
  it("binds a completed process result to the safe-mode fingerprint and Foundry API boundary", async () => {
    const result = await runInProcess([statusLine()]);
    const receipt = createStdioTransportReceipt({
      profile: createSafeModeRuntimeProfile(),
      report: result.report,
      responses: result.output.map((line) => JSON.parse(line)),
    });

    expect(StdioTransportReceiptSchema.parse(receipt)).toMatchObject({
      status: "pass",
      evidenceClass: "deterministic",
      scope: "local-safe-mode",
      foundryApiEvidence: "not-exercised",
      requests: 1,
      responses: 1,
      protocolErrors: 0,
      operations: ["status"],
      noWrite: true,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
      noRawData: true,
    });
    expect(JSON.stringify(receipt)).not.toContain("allowedOperations");
  });

  it("counts protocol errors without copying malformed or raw response data", async () => {
    const result = await runInProcess(["{not-json"]);
    const receipt = createStdioTransportReceipt({
      profile: createSafeModeRuntimeProfile(),
      report: result.report,
      responses: result.output.map((line) => JSON.parse(line)),
    });

    expect(receipt.status).toBe("pass");
    expect(receipt.protocolErrors).toBe(1);
    expect(receipt.operations).toEqual([]);
    expect(JSON.stringify(receipt)).not.toContain("not-json");
  });

  it("preserves an unknown transport outcome as blocked evidence", () => {
    const report = stdioServerReportSchema.parse({
      schemaVersion: "0.1.0",
      transport: "stdio",
      worldId: FIXED_TEST_WORLD_ID,
      status: "unknown",
      requests: 1,
      responses: 0,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
      notes: ["stream failed"],
    });
    const receipt = createStdioTransportReceipt({
      profile: createSafeModeRuntimeProfile(),
      report,
      responses: [],
    });

    expect(receipt).toMatchObject({ status: "unknown", evidenceClass: "blocked", requests: 1, responses: 0 });
    expect(receipt.notes.join(" ")).toContain("reread");
  });

  it("runs the receipt collector as a real process and emits only the redacted receipt", () => {
    const result = spawnSync(process.execPath, [tsxCli, collector], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const receipt = StdioTransportReceiptSchema.parse(JSON.parse(result.stdout.trim()));
    expect(receipt).toMatchObject({
      operation: "bridge.stdio",
      status: "pass",
      evidenceClass: "deterministic",
      foundryApiEvidence: "not-exercised",
      target: { exactTargetMatch: false },
      noRawData: true,
    });
    expect(result.stdout).not.toContain("runtimeFingerprint");
    expect(result.stderr).toBe("");
  }, 30_000);
});
