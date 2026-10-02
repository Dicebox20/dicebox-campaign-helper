import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  FIXED_TEST_WORLD_ID,
  bridgeTransportResponseSchema,
  stdioServerReportSchema,
} from "@dicebox/bridge";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const launcher = resolve(root, "tools/dbx-test-bridge.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");

function runLauncher(input: string) {
  return spawnSync(process.execPath, [tsxCli, launcher], {
    cwd: root,
    input,
    encoding: "utf8",
    windowsHide: true,
  });
}

function statusRequest() {
  return JSON.stringify({
    schemaVersion: "0.1.0",
    requestId: "dbx:request:launcher-test",
    worldId: FIXED_TEST_WORLD_ID,
    operation: "status",
  });
}

describe("safe-mode stdio launcher", () => {
  it("runs as a real process and keeps the first-round boundary read-only", () => {
    const result = runLauncher(`${statusRequest()}\n`);

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const response = bridgeTransportResponseSchema.parse(JSON.parse(result.stdout.trim()));
    const report = stdioServerReportSchema.parse(JSON.parse(result.stderr.trim()));
    expect(response).toMatchObject({ ok: true });
    if (response.ok) {
      const value = response.value as {
        status: string;
        payload: {
          worldId: string;
          readOnly: boolean;
          mutationEnabled: boolean;
          runtimePhase: string;
          runtimeFingerprint: { exactTargetMatch: boolean };
        };
      };
      expect(value).toMatchObject({ status: "PASS" });
      expect(value.payload).toMatchObject({
        worldId: FIXED_TEST_WORLD_ID,
        readOnly: true,
        mutationEnabled: false,
        runtimePhase: "m0",
      });
      expect(value.payload.runtimeFingerprint).toMatchObject({ exactTargetMatch: false });
    }
    expect(report).toMatchObject({
      status: "completed",
      transport: "stdio",
      requests: 1,
      responses: 1,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
    });
  });

  it("returns protocol errors for malformed input without opening a second channel", () => {
    const result = runLauncher("{not-json\n");

    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    const response = bridgeTransportResponseSchema.parse(JSON.parse(result.stdout.trim()));
    const report = stdioServerReportSchema.parse(JSON.parse(result.stderr.trim()));
    expect(response.ok).toBe(false);
    if (!response.ok) expect(response.error.code).toBe("INVALID_INPUT");
    expect(report).toMatchObject({
      status: "completed",
      requests: 1,
      responses: 1,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
    });
  });
});
