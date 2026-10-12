import { describe, expect, it } from "vitest";

// @ts-expect-error The relay utilities are intentionally plain Node ESM utilities.
import { createOidcBearerVerifier } from "../tools/dicebox-foundry-remote-auth.mjs";
// @ts-expect-error The relay gateway is intentionally a plain Node ESM utility.
import { validateRemoteDeployment } from "../tools/dicebox-foundry-remote-gateway.mjs";
// @ts-expect-error The Foundry entry is intentionally a plain JavaScript module.
import { validateRemoteBridgeUrl } from "../packages/dicebox-foundry/src/foundry-live-bridge.js";

describe("Sqyre-compatible remote relay", () => {
  it("verifies OIDC issuer/audience through a JWKS verifier and returns redacted auth context", async () => {
    const calls: unknown[] = [];
    const verifier = createOidcBearerVerifier({
      issuer: "https://auth.example",
      audience: "dicebox-relay",
      jwksUrl: "https://auth.example/.well-known/jwks.json",
      createRemoteJWKSetImpl: (url: URL) => { calls.push(url.href); return { keySet: true }; },
      jwtVerifyImpl: async (token: string, keySet: unknown, options: unknown) => {
        calls.push({ token, keySet, options });
        if (token !== "good-token") throw new Error("invalid token");
        return { payload: { sub: "desktop-commander", iss: "https://auth.example", aud: "dicebox-relay", scope: "dicebox.foundry profile", exp: 1900000000 } };
      },
    });
    await expect(verifier("bad-token")).resolves.toBeNull();
    await expect(verifier("good-token")).resolves.toMatchObject({ clientId: "desktop-commander", scopes: ["dicebox.foundry", "profile"], claims: { issuer: "https://auth.example", audience: "dicebox-relay" } });
    expect(calls[0]).toBe("https://auth.example/.well-known/jwks.json");
    expect(JSON.stringify(await verifier("good-token"))).not.toContain("good-token");
  });

  it("requires separate OIDC and Foundry-client credentials for public relay mode", () => {
    const base = {
      host: "0.0.0.0",
      publicBaseUrl: "https://relay.example/mcp",
      tlsTerminated: true,
      authMode: "oidc",
      oauthIssuer: "https://auth.example",
      oauthAudience: "dicebox-relay",
      oauthJwksUrl: "https://auth.example/.well-known/jwks.json",
      verifyBearerToken: async () => ({ clientId: "desktop-commander", scopes: [] }),
    };
    expect(validateRemoteDeployment({ ...base, foundryClientToken: "foundry-pairing-token" })).toBe(true);
    expect(() => validateRemoteDeployment({ ...base })).toThrow(/pairing token/);
  });

  it("requires secure remote module URLs and the fixed relay path", () => {
    expect(validateRemoteBridgeUrl("wss://relay.example/dicebox-foundry")).toBe("");
    expect(validateRemoteBridgeUrl("ws://127.0.0.1:8797/dicebox-foundry")).toBe("");
    expect(validateRemoteBridgeUrl("ws://relay.example/dicebox-foundry")).toMatch(/wss/);
    expect(validateRemoteBridgeUrl("wss://relay.example/other")).toMatch(/end with/);
    expect(validateRemoteBridgeUrl("https://relay.example/dicebox-foundry")).toMatch(/wss/);
  });
});
