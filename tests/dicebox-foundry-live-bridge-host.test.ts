import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";

// The entrypoint has a Node shebang. Import through native Node rather than
// the Vitest transformed dynamic-import path, which rejects the hashbang.
const bridgeModuleUrl = pathToFileURL(resolve("tools/dicebox-foundry-live-bridge.mjs")).href;

function inspectNativeBridge<T>(statements: string): T {
  const script = "const bridge = await import(" + JSON.stringify(bridgeModuleUrl) + ");\n" + statements;
  return JSON.parse(execFileSync(process.execPath, ["--input-type=module", "--eval", script], {
    encoding: "utf8",
    timeout: 10_000,
  })) as T;
}

describe("DiceBox Foundry live bridge host", () => {
  it("uses loopback-only MCP tools and bounded operation arguments", () => {
    const actual = inspectNativeBridge<{
      bridgePath: string;
      localOriginAllowed: boolean;
      remoteOriginAllowed: boolean;
      operations: string[];
      unsupportedArgumentError: string | null;
      unapprovedError: string | null;
    }>(`
      const install = bridge.TOOL_DEFINITIONS.find((tool) => tool.name === "dbx_foundry_ascendancy_install");
      const thrown = (operation) => {
        try { operation(); return null; }
        catch (error) { return String(error.message ?? error); }
      };
      process.stdout.write(JSON.stringify({
        bridgePath: bridge.BRIDGE_PATH,
        localOriginAllowed: bridge.allowedOrigin("http://127.0.0.1:30000"),
        remoteOriginAllowed: bridge.allowedOrigin("https://evil.example"),
        operations: bridge.TOOL_DEFINITIONS.map((tool) => tool.operation),
        unsupportedArgumentError: thrown(() => bridge.validateToolArguments(install, { approved: true, planToken: "token", script: "new Function()" })),
        unapprovedError: thrown(() => bridge.validateToolArguments(install, { approved: false, planToken: "token" })),
      }));
    `);

    expect(actual.bridgePath).toBe("/dicebox-foundry");
    expect(actual.localOriginAllowed).toBe(true);
    expect(actual.remoteOriginAllowed).toBe(false);
    expect(actual.operations).toEqual([
      "bridge.status", "harness.status", "helper.readiness", "ascendancy.preview", "ascendancy.install",
      "ascendancy.repair.preview", "ascendancy.repair", "ascendancy.snapshot",
    ]);
    expect(actual.unsupportedArgumentError).toMatch(/Unsupported tool argument/);
    expect(actual.unapprovedError).toMatch(/approved/);
  });

  it("round-trips bounded text WebSocket frames", () => {
    const actual = inspectNativeBridge<{ messages: string[]; firstServerByte: number }>(`
      const frame = bridge.encodeFrame("hello");
      const mask = Buffer.from([1, 2, 3, 4]);
      const payload = Buffer.from("hello");
      const masked = Buffer.from(payload.map((byte, index) => byte ^ mask[index % 4]));
      const clientFrame = Buffer.concat([Buffer.from([0x81, 0x80 | payload.length]), mask, masked]);
      process.stdout.write(JSON.stringify({
        messages: bridge.decodeFrames(clientFrame).messages,
        firstServerByte: frame[0],
      }));
    `);

    expect(actual.messages).toEqual(["hello"]);
    expect(actual.firstServerByte).toBe(0x81);
  });
});