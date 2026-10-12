import { describe, expect, it } from "vitest";

// @ts-expect-error The fixed bridge tools are intentionally plain Node ESM utilities.
import { BRIDGE_PROTOCOL, allowedOrigin, validateFoundryHello } from "../tools/dicebox-foundry-live-bridge.mjs";
// @ts-expect-error The remote gateway is intentionally a plain Node ESM utility.
import { authorizedBearer, CHATGPT_PLUGIN_INSTRUCTIONS, createRemoteGatewayServer, handleRemoteMcpMessage, protectedResourceMetadata, validateRemoteDeployment } from "../tools/dicebox-foundry-remote-gateway.mjs";

describe("DiceBox remote Foundry / Desktop Commander prototype", () => {
  it("requires a configured bearer token and never accepts an empty token", () => {
    expect(authorizedBearer("Bearer prototype-secret", "prototype-secret")).toBe(true);
    expect(authorizedBearer("Bearer wrong", "prototype-secret")).toBe(false);
    expect(authorizedBearer(undefined, "prototype-secret")).toBe(false);
    expect(authorizedBearer("Bearer prototype-secret", "")).toBe(false);
  });

  it("keeps the Foundry handshake exact and token-gated when configured", () => {
    const hello = { protocol: BRIDGE_PROTOCOL, moduleId: "dicebox-campaign-helper", worldId: "the-ballad-of-chauser-bill", isGM: true, token: "prototype-secret" };
    expect(validateFoundryHello(hello, { expectedWorldId: hello.worldId, expectedToken: "prototype-secret" })).toBe(true);
    expect(() => validateFoundryHello({ ...hello, isGM: false }, { expectedWorldId: hello.worldId, expectedToken: "prototype-secret" })).toThrow();
    expect(() => validateFoundryHello({ ...hello, token: "wrong" }, { expectedWorldId: hello.worldId, expectedToken: "prototype-secret" })).toThrow();
  });

  it("forwards only a fixed readiness tool through an authenticated fake Foundry connection", async () => {
    const calls: Array<{ operation: string; args: unknown }> = [];
    const response = await handleRemoteMcpMessage({ jsonrpc: "2.0", id: "1", method: "tools/call", params: { name: "dbx_foundry_helper_readiness", arguments: {} } }, {
      authorization: "Bearer prototype-secret",
      expectedToken: "prototype-secret",
      connection: { request: async (operation: string, args: unknown) => { calls.push({ operation, args }); return { status: "ready", noWrite: true }; } }
    });
    expect(response).toMatchObject({ jsonrpc: "2.0", id: "1", result: { content: [{ type: "text" }] } });
    expect(JSON.parse(response.result.content[0].text)).toEqual({ status: "ready", noWrite: true });
    expect(calls).toEqual([{ operation: "helper.readiness", args: {} }]);
  });

  it("rejects unauthorized and unknown tool requests", async () => {
    const unauthorized = await handleRemoteMcpMessage({ jsonrpc: "2.0", id: "2", method: "tools/list" }, { authorization: "Bearer wrong", expectedToken: "prototype-secret" });
    expect(unauthorized.error.code).toBe(-32001);
    const unknown = await handleRemoteMcpMessage({ jsonrpc: "2.0", id: "3", method: "tools/call", params: { name: "arbitrary_script", arguments: {} } }, { authorization: "Bearer prototype-secret", expectedToken: "prototype-secret", connection: { request: async () => ({}) } });
    expect(unknown.result.isError).toBe(true);
  });

  it("serves the same fixed tool registry over authenticated HTTP", async () => {
    const gateway = createRemoteGatewayServer({ host: "127.0.0.1", port: 0, token: "prototype-secret" });
    const address = await gateway.listen();
    const port = typeof address === "object" && address ? address.port : 0;
    try {
      const denied = await fetch(`http://127.0.0.1:${port}/mcp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: "denied", method: "tools/list" }) });
      expect(denied.status).toBe(401);
      const headers = { Authorization: "Bearer prototype-secret", Accept: "application/json, text/event-stream", "Content-Type": "application/json" };
      const initialize = await fetch(`http://127.0.0.1:${port}/mcp`, { method: "POST", headers, body: JSON.stringify({ jsonrpc: "2.0", id: "init", method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "DiceBox test", version: "1.0.0" } } }) });
      expect(initialize.status).toBe(200);
      const initializePayload = await initialize.json();
      expect(initializePayload.result.instructions).toBe(CHATGPT_PLUGIN_INSTRUCTIONS);
      const sessionId = initialize.headers.get("mcp-session-id");
      expect(sessionId).toBeTruthy();
      const response = await fetch(`http://127.0.0.1:${port}/mcp`, { method: "POST", headers: { ...headers, "Mcp-Session-Id": sessionId!, "Mcp-Protocol-Version": "2025-03-26" }, body: JSON.stringify({ jsonrpc: "2.0", id: "list", method: "tools/list" }) });
      const payload = await response.json();
      expect(response.status).toBe(200);
      expect(payload.result.tools.map((tool: { name: string }) => tool.name)).toContain("dbx_foundry_helper_readiness");
      expect(payload.result.tools.map((tool: { name: string }) => tool.name)).toContain("dbx_foundry_connector_attestation");
      expect(payload.result.tools.find((tool: { name: string }) => tool.name === "dbx_foundry_connector_attestation")).toMatchObject({ annotations: { readOnlyHint: true, destructiveHint: false }, outputSchema: { type: "object" } });
      expect(payload.result.tools.map((tool: { name: string }) => tool.name)).not.toContain("arbitrary_script");
    } finally {
      await gateway.close();
    }
  });

  it("allows local origins by default and only explicitly configured remote origins", () => {
    expect(allowedOrigin("http://127.0.0.1:30000")).toBe(true);
    expect(allowedOrigin("https://foundry.example", ["foundry.example"])).toBe(true);
    expect(allowedOrigin("https://unexpected.example", ["foundry.example"])).toBe(false);
  });

  it("publishes protected-resource metadata and rejects unsafe non-loopback static-token hosting", () => {
    expect(protectedResourceMetadata({ headers: { host: "127.0.0.1:8798" } } as never, { publicBaseUrl: "https://foundry.example/mcp", oauthIssuer: "https://auth.example", scope: "dicebox.foundry" })).toEqual({
      resource: "https://foundry.example/mcp",
      authorization_servers: ["https://auth.example"],
      scopes_supported: ["dicebox.foundry"],
      bearer_methods_supported: ["header"],
    });
    expect(() => validateRemoteDeployment({ host: "0.0.0.0", token: "prototype-secret", publicBaseUrl: "https://foundry.example/mcp", tlsTerminated: true })).toThrow(/OIDC verifier mode/);
    expect(() => validateRemoteDeployment({ host: "0.0.0.0", token: "prototype-secret", publicBaseUrl: "http://foundry.example/mcp", tlsTerminated: true })).toThrow(/https/);
  });
});
