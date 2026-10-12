#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createOidcBearerVerifier } from "./dicebox-foundry-remote-auth.mjs";
import { validateRemoteDeployment } from "./dicebox-foundry-remote-gateway.mjs";
import { BRIDGE_PROTOCOL, allowedOrigin, validateFoundryHello } from "./dicebox-foundry-live-bridge.mjs";
import { validateRemoteBridgeUrl } from "../packages/dicebox-foundry/src/foundry-live-bridge.js";

const receiptPath = resolve("outputs/sqyre-remote-relay-smoke-receipt-2026-10-07.json");
const verifier = createOidcBearerVerifier({
  issuer: "https://auth.example",
  audience: "dicebox-relay",
  jwksUrl: "https://auth.example/.well-known/jwks.json",
  createRemoteJWKSetImpl: () => ({ local: true }),
  jwtVerifyImpl: async token => token === "good-token"
    ? { payload: { sub: "desktop-commander", iss: "https://auth.example", aud: "dicebox-relay", exp: 1900000000 } }
    : (() => { throw new Error("invalid token"); })(),
});
const verified = await verifier("good-token");
const rejected = await verifier("bad-token");
validateRemoteDeployment({
  host: "0.0.0.0",
  foundryClientToken: "foundry-pairing-token",
  publicBaseUrl: "https://relay.example.com/mcp",
  tlsTerminated: true,
  authMode: "oidc",
  oauthIssuer: "https://auth.example",
  oauthAudience: "dicebox-relay",
  oauthJwksUrl: "https://auth.example/.well-known/jwks.json",
  verifyBearerToken: verifier,
});
if (!verified || rejected !== null) throw new Error("OIDC smoke did not produce the expected redacted authorization boundary.");
if (validateRemoteBridgeUrl("wss://relay.example.com/dicebox-foundry") !== "") throw new Error("Secure remote bridge URL was rejected.");
if (validateRemoteBridgeUrl("ws://relay.example.com/dicebox-foundry") === "") throw new Error("Insecure remote bridge URL was accepted.");
if (!allowedOrigin("https://www.sqyre.app", ["www.sqyre.app"])) throw new Error("Sqyre origin allowlist did not accept the configured exact origin.");
if (allowedOrigin("https://evil.example", ["www.sqyre.app"])) throw new Error("Unexpected origin passed the exact allowlist.");
validateFoundryHello({ protocol: BRIDGE_PROTOCOL, moduleId: "dicebox-campaign-helper", worldId: "the-ballad-of-chauser-bill", isGM: true, token: "foundry-pairing-token" }, { expectedWorldId: "the-ballad-of-chauser-bill", expectedToken: "foundry-pairing-token" });

const receipt = {
  schemaVersion: "1.0.0",
  status: "PASS_LOCAL",
  evidenceClass: "local",
  topology: "Sqyre browser -> outbound wss:// relay -> HTTPS MCP /mcp",
  oidc: "issuer/audience/JWKS verifier accepted a valid fixture and rejected an invalid fixture",
  foundryPairing: "separate client token and exact world/GM handshake passed",
  originAllowlist: "exact configured Sqyre origin passed; unexpected origin rejected",
  secureUrl: "wss:// remote URL accepted; ws:// non-loopback URL rejected",
  noLive: true,
  noSqyreLogin: true,
  noSecrets: true,
  doesNotProve: ["public DNS/TLS", "OIDC provider configuration", "Desktop Commander account binding", "Sqyre module upload", "live Foundry connection", "Foundry mutation"],
};
writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
process.stdout.write(`${JSON.stringify({ receiptPath, status: receipt.status, topology: receipt.topology })}\n`);
