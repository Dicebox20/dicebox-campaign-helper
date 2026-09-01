import { describe, expect, it } from "vitest";
import {
  FIXED_TEST_WORLD_ID,
  bridgeTransportResponseSchema,
  createFixedOperationBridge,
  createFixedOperationStdioServer,
  stdioServerReportSchema,
} from "@dicebox/bridge";
import { createStableDiceBoxId } from "@dicebox/core";

const observedAt = "2026-08-21T08:00:00.000Z";

function runtime() {
  return {
    phase: "ready" as const,
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry"],
    capabilities: [],
  };
}

function statusLine(key: string) {
  return JSON.stringify({
    schemaVersion: "0.1.0",
    requestId: createStableDiceBoxId("request", key),
    worldId: FIXED_TEST_WORLD_ID,
    operation: "status",
  });
}

describe("fixed-operation stdio server", () => {
  it("forwards one response per line with no network or mutation authority", async () => {
    const output: string[] = [];
    const server = createFixedOperationStdioServer({
      bridge: createFixedOperationBridge({ runtime: runtime() }),
      input: { lines: [statusLine("one"), statusLine("two")], writeLine: (line) => { output.push(line); } },
    });

    const report = await server.run();
    expect(stdioServerReportSchema.parse(report)).toMatchObject({
      status: "completed",
      requests: 2,
      responses: 2,
      readOnly: true,
      mutationEnabled: false,
      networkEnabled: false,
    });
    expect(output).toHaveLength(2);
    expect(output.every((line) => bridgeTransportResponseSchema.parse(JSON.parse(line)).ok)).toBe(true);
  });

  it("keeps malformed input inside the versioned error envelope", async () => {
    const output: string[] = [];
    const server = createFixedOperationStdioServer({
      bridge: createFixedOperationBridge({ runtime: runtime() }),
      input: { lines: ["{not-json"], writeLine: (line) => { output.push(line); } },
    });

    const report = await server.run();
    expect(report.status).toBe("completed");
    const response = bridgeTransportResponseSchema.parse(JSON.parse(output[0] ?? "{}"));
    expect(response.ok).toBe(false);
    if (!response.ok) expect(response.error.code).toBe("INVALID_INPUT");
  });

  it("reports an output failure as unknown without retrying", async () => {
    let writes = 0;
    const server = createFixedOperationStdioServer({
      bridge: createFixedOperationBridge({ runtime: runtime() }),
      input: { lines: [statusLine("output-failure")], writeLine: () => { writes += 1; throw new Error("closed"); } },
    });

    const report = await server.run();
    expect(report).toMatchObject({ status: "unknown", requests: 1, responses: 0 });
    expect(writes).toBe(1);
    expect(report.notes.join(" ")).toContain("reread");
  });

  it("reports an input-stream failure as unknown", async () => {
    async function* failingLines() {
      yield statusLine("before-failure");
      throw new Error("stream closed");
    }
    const output: string[] = [];
    const server = createFixedOperationStdioServer({
      bridge: createFixedOperationBridge({ runtime: runtime() }),
      input: { lines: failingLines(), writeLine: (line) => { output.push(line); } },
    });

    const report = await server.run();
    expect(report.status).toBe("unknown");
    expect(report.requests).toBe(1);
    expect(report.responses).toBe(1);
  });
});
