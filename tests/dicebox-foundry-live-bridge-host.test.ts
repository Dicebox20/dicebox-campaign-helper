import { describe, expect, it } from "vitest";

describe("DiceBox Foundry live bridge host", () => {
  it("uses loopback-only MCP tools and bounded operation arguments", async () => {
    // @ts-expect-error The local MCP host is a JavaScript executable.
    const bridge = await import("../tools/dicebox-foundry-live-bridge.mjs");
    expect(bridge.BRIDGE_PATH).toBe("/dicebox-foundry");
    expect(bridge.allowedOrigin("http://127.0.0.1:30000")).toBe(true);
    expect(bridge.allowedOrigin("https://evil.example")).toBe(false);
    expect(bridge.TOOL_DEFINITIONS.map((tool: { operation: string }) => tool.operation)).toEqual([
      "bridge.status", "harness.status", "helper.readiness", "connector.profile", "connector.attestation", "ascendancy.preview", "ascendancy.install", "ascendancy.repair.preview", "ascendancy.repair", "ascendancy.snapshot",
    ]);
    const install = bridge.TOOL_DEFINITIONS.find((tool: { name: string }) => tool.name === "dbx_foundry_ascendancy_install");
    expect(() => bridge.validateToolArguments(install, { approved: true, planToken: "token", script: "new Function()" })).toThrow(/Unsupported tool argument/);
    expect(() => bridge.validateToolArguments(install, { approved: false, planToken: "token" })).toThrow(/approved/);
  });

  it("round-trips bounded text WebSocket frames", async () => {
    // @ts-expect-error The local MCP host is a JavaScript executable.
    const { encodeFrame, decodeFrames } = await import("../tools/dicebox-foundry-live-bridge.mjs");
    const frame = encodeFrame("hello");
    const mask = Buffer.from([1, 2, 3, 4]);
    const payload = Buffer.from("hello");
    const masked = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]!));
    const clientFrame = Buffer.concat([Buffer.from([0x81, 0x80 | payload.length]), mask, masked]);
    expect(decodeFrames(clientFrame).messages).toEqual(["hello"]);
    expect(frame[0]!).toBe(0x81);
  });
});
