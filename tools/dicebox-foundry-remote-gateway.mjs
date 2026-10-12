#!/usr/bin/env node

/*
 * Remote MCP gateway for the fixed DiceBox Foundry bridge.
 *
 * The gateway uses the official MCP Streamable HTTP transport. It keeps the
 * Foundry WebSocket as the runtime authority, exposes only the reviewed recipe
 * registry, and requires an injected bearer verifier for non-loopback hosting.
 * A static token is deliberately limited to local development and test use.
 */

import { randomUUID, timingSafeEqual } from "node:crypto";
import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod/v4";
import {
  BRIDGE_PORT,
  EXPECTED_WORLD_ID,
  RECIPE_REGISTRY,
  createBridgeServer,
  handleMcpMessage,
} from "./dicebox-foundry-live-bridge.mjs";
import {
  CONNECTOR_PROTOCOL,
  RECIPE_REGISTRY_VERSION,
  createConnectorAttestation,
  createConnectorProfile,
} from "./dicebox-foundry-connector-contract.mjs";
import { createOidcBearerVerifier } from "./dicebox-foundry-remote-auth.mjs";

const REMOTE_HOST = process.env.DICEBOX_REMOTE_BRIDGE_HOST ?? "127.0.0.1";
const REMOTE_PORT = Number(process.env.DICEBOX_REMOTE_BRIDGE_PORT ?? 8798);
const REMOTE_TOKEN = String(process.env.DICEBOX_REMOTE_BRIDGE_TOKEN ?? "").trim();
const REMOTE_PUBLIC_BASE_URL = String(process.env.DICEBOX_REMOTE_PUBLIC_BASE_URL ?? "").trim();
const REMOTE_OAUTH_ISSUER = String(process.env.DICEBOX_REMOTE_OAUTH_ISSUER ?? "").trim();
const REMOTE_OAUTH_AUDIENCE = String(process.env.DICEBOX_REMOTE_OAUTH_AUDIENCE ?? "").trim();
const REMOTE_OAUTH_JWKS_URL = String(process.env.DICEBOX_REMOTE_OAUTH_JWKS_URL ?? "").trim();
const REMOTE_OAUTH_SCOPE = String(process.env.DICEBOX_REMOTE_OAUTH_SCOPE ?? "dicebox.foundry").trim();
const REMOTE_AUTH_MODE = String(process.env.DICEBOX_REMOTE_AUTH_MODE ?? "static-token").trim();
const REMOTE_TLS_TERMINATED = /^(1|true|yes)$/i.test(String(process.env.DICEBOX_REMOTE_TLS_TERMINATED ?? "false"));
const FOUNDRY_CLIENT_TOKEN = String(process.env.DICEBOX_FOUNDRY_CLIENT_TOKEN ?? "").trim();
const FOUNDRY_ORIGIN_HOSTS = String(process.env.DICEBOX_FOUNDRY_ORIGIN_HOSTS ?? "localhost,127.0.0.1,[::1],::1")
  .split(",").map(value => value.trim()).filter(Boolean);
const CORS_ORIGIN = process.env.DICEBOX_REMOTE_CORS_ORIGIN ?? "*";
const MAX_BODY_BYTES = 64 * 1024;
const NO_CONNECTION = Object.freeze({ request: () => Promise.reject(new Error("No eligible active-GM Foundry client is connected.")) });
const CHATGPT_PLUGIN_INSTRUCTIONS = "Use this plugin to inspect or propose bounded operations in the connected Foundry world. Start with bridge.status, harness.status, helper.readiness, connector.profile, and connector.attestation. Treat transport success as uncommitted. Writes require a current preview, explicit approval token, active-GM authority, and authoritative reread. Never request or execute arbitrary macros, scripts, shell, documents, or generic execute-as-GM actions.";

function isObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function errorText(error) { return String(error?.message ?? error ?? "Bridge request failed.").replace(/[\r\n]+/g, " ").trim().slice(0, 480) || "Bridge request failed."; }
function rpcError(id, code, message) { return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }; }

function isLoopbackHost(host) {
  const normalized = String(host).replace(/^\[|\]$/g, "");
  return ["localhost", "127.0.0.1", "::1"].includes(normalized);
}

function isOidcAuthMode(authMode) { return authMode === "oauth" || authMode === "oidc"; }

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": CORS_ORIGIN,
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Last-Event-ID, Mcp-Protocol-Version, Mcp-Session-Id",
    "Access-Control-Allow-Methods": "DELETE, GET, OPTIONS, POST",
    "Access-Control-Expose-Headers": "Mcp-Session-Id, WWW-Authenticate",
    Vary: "Origin",
  };
}

function bearerValue(authorization) {
  if (typeof authorization !== "string") return "";
  const match = /^Bearer\s+(.+)$/i.exec(authorization.trim());
  return match?.[1]?.trim() ?? "";
}

function authorizedBearer(authorization, expectedToken) {
  const supplied = bearerValue(authorization);
  const expected = String(expectedToken ?? "");
  if (!supplied || !expected) return false;
  const suppliedBytes = Buffer.from(supplied, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

function validateRemoteDeployment({ host = REMOTE_HOST, token = REMOTE_TOKEN, foundryClientToken = FOUNDRY_CLIENT_TOKEN, publicBaseUrl = REMOTE_PUBLIC_BASE_URL, oauthIssuer = REMOTE_OAUTH_ISSUER, oauthAudience = REMOTE_OAUTH_AUDIENCE, oauthJwksUrl = REMOTE_OAUTH_JWKS_URL, authMode = REMOTE_AUTH_MODE, tlsTerminated = REMOTE_TLS_TERMINATED, verifyBearerToken } = {}) {
  if (!token && !foundryClientToken && typeof verifyBearerToken !== "function") throw new Error("Configure a static token for local development or an explicit OIDC verifier plus a Foundry client pairing token.");
  if (publicBaseUrl && !/^https:\/\//i.test(publicBaseUrl)) throw new Error("DICEBOX_REMOTE_PUBLIC_BASE_URL must use https://.");
  if (isOidcAuthMode(authMode) && (!oauthIssuer || !oauthAudience || !oauthJwksUrl || typeof verifyBearerToken !== "function")) throw new Error("OIDC mode requires issuer, audience, JWKS URL, and a bearer-token verifier.");
  if (!isLoopbackHost(host)) {
    if (!/^https:\/\//i.test(publicBaseUrl)) throw new Error("Non-loopback gateway hosting requires an HTTPS public base URL.");
    if (!tlsTerminated) throw new Error("Non-loopback gateway hosting requires TLS termination to be declared.");
    if (!isOidcAuthMode(authMode) || typeof verifyBearerToken !== "function") throw new Error("Non-loopback gateway hosting requires OIDC verifier mode; static bearer tokens are local-only.");
    if (!foundryClientToken) throw new Error("Non-loopback gateway hosting requires a separate Foundry client pairing token.");
  }
  return true;
}

function metadataBaseUrl(request, publicBaseUrl) {
  if (publicBaseUrl) return publicBaseUrl.replace(/\/$/, "");
  const host = request.headers.host ?? "127.0.0.1";
  return `http://${host}/mcp`;
}

function protectedResourceMetadata(request, { publicBaseUrl = REMOTE_PUBLIC_BASE_URL, oauthIssuer = REMOTE_OAUTH_ISSUER, scope = REMOTE_OAUTH_SCOPE } = {}) {
  const resource = metadataBaseUrl(request, publicBaseUrl);
  return {
    resource,
    authorization_servers: oauthIssuer ? [oauthIssuer] : [],
    scopes_supported: scope ? [scope] : [],
    bearer_methods_supported: ["header"],
  };
}

function protectedResourceMetadataUrl(request, options) {
  const base = metadataBaseUrl(request, options.publicBaseUrl);
  const origin = new URL(base).origin;
  return `${origin}/.well-known/oauth-protected-resource/mcp`;
}

async function verifyRequestAuthorization(request, { expectedToken, verifyBearerToken } = {}) {
  const token = bearerValue(request.headers.authorization);
  if (!token) return null;
  if (typeof verifyBearerToken === "function") {
    let verified;
    try { verified = await verifyBearerToken(token); } catch { verified = null; }
    return verified === true ? { clientId: "verified-bearer", scopes: [REMOTE_OAUTH_SCOPE] } : verified || null;
  }
  return authorizedBearer(request.headers.authorization, expectedToken)
    ? { clientId: "local-static-token", scopes: [REMOTE_OAUTH_SCOPE] }
    : null;
}

function sendJson(response, status, value, extraHeaders = {}) {
  response.writeHead(status, { ...corsHeaders(), ...extraHeaders, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  response.end(JSON.stringify(value));
}

function setTransportHeaders(response) {
  for (const [name, value] of Object.entries(corsHeaders())) response.setHeader(name, value);
}

function zodInputSchema(recipe) {
  if (recipe.operation === "ascendancy.install" || recipe.operation === "ascendancy.repair") {
    return z.object({ planToken: z.string().min(1), approved: z.literal(true) }).strict();
  }
  return z.object({}).strict();
}

function toolResult(value) {
  const result = isObject(value) ? value : { value };
  return { structuredContent: result, content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}

async function connectorSnapshot({ getConnection, profileOptions }) {
  const connection = getConnection() ?? NO_CONNECTION;
  const runtimeObservation = await connection.request("connector.profile", {});
  const profile = createConnectorProfile({ ...profileOptions, runtimeObservation });
  return Object.freeze({ ...profile, runtime: runtimeObservation });
}

function createOperationInvoker({ getConnection, profileOptions = {} } = {}) {
  return async (operation, args = {}) => {
    if (operation === "connector.profile") return connectorSnapshot({ getConnection, profileOptions });
    if (operation === "connector.attestation") {
      const snapshot = await connectorSnapshot({ getConnection, profileOptions });
      return createConnectorAttestation({ profile: snapshot, runtimeObservation: snapshot.runtime });
    }
    return (getConnection() ?? NO_CONNECTION).request(operation, args);
  };
}

function createMcpServer({ invokeOperation, serverName = "dicebox-foundry-connector", serverVersion = "1.0.0", instructions = CHATGPT_PLUGIN_INSTRUCTIONS } = {}) {
  const server = new McpServer({ name: serverName, version: serverVersion }, { maxToolInputElements: 16, instructions });
  for (const recipe of RECIPE_REGISTRY) {
    server.registerTool(recipe.name, {
      title: recipe.name,
      description: recipe.description,
      inputSchema: zodInputSchema(recipe),
      outputSchema: z.object({}).passthrough(),
      annotations: recipe.annotations,
      _meta: {
        "dicebox/connectorProtocol": CONNECTOR_PROTOCOL,
        "dicebox/recipeId": `dbx:connector-recipe:${recipe.operation}`,
        "dicebox/recipeVersion": RECIPE_REGISTRY_VERSION,
        "dicebox/authority": recipe.authority,
        "dicebox/readWrite": recipe.readWrite,
        "dicebox/requiresPreviewApproval": recipe.requiresPreviewApproval,
      },
    }, async args => toolResult(await invokeOperation(recipe.operation, args)));
  }
  return server;
}

async function handleRemoteMcpMessage(message, { authorization, expectedToken, connection = NO_CONNECTION } = {}) {
  if (!isObject(message) || typeof message.method !== "string") return rpcError(null, -32600, "Invalid MCP request.");
  if (!authorizedBearer(authorization, expectedToken)) return rpcError(message.id, -32001, "Remote bridge authentication failed.");
  return handleMcpMessage(message, connection);
}

function createRemoteGatewayRequestHandler({
  getConnection,
  expectedToken,
  verifyBearerToken,
  publicBaseUrl = REMOTE_PUBLIC_BASE_URL,
  oauthIssuer = REMOTE_OAUTH_ISSUER,
  oauthScope = REMOTE_OAUTH_SCOPE,
  profileOptions = {},
} = {}) {
  const sessions = new Map();
  const invokeOperation = createOperationInvoker({ getConnection, profileOptions });

  function sessionFor(id) { return id ? sessions.get(id) : null; }

  async function createSession() {
    const server = createMcpServer({ invokeOperation });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: true,
      maxRequestBodySize: MAX_BODY_BYTES,
    });
    const session = { server, transport };
    transport.onclose = () => {
      if (transport.sessionId) sessions.delete(transport.sessionId);
      void server.close().catch(() => {});
    };
    await server.connect(transport);
    return session;
  }

  return async (request, response) => {
    const pathname = new URL(request.url ?? "/", "http://dicebox.local").pathname;
    if (request.method === "OPTIONS") { response.writeHead(204, corsHeaders()); response.end(); return; }
    if (request.method === "GET" && pathname === "/healthz") { sendJson(response, 200, { status: "ok", connectorProtocol: CONNECTOR_PROTOCOL, recipeRegistryVersion: RECIPE_REGISTRY_VERSION }); return; }
    if (request.method === "GET" && pathname === "/.well-known/oauth-protected-resource/mcp") {
      sendJson(response, 200, protectedResourceMetadata(request, { publicBaseUrl, oauthIssuer, scope: oauthScope }));
      return;
    }
    if (pathname !== "/mcp") { response.writeHead(404, corsHeaders()); response.end("Not found."); return; }

    const authInfo = await verifyRequestAuthorization(request, { expectedToken, verifyBearerToken });
    if (!authInfo) {
      const metadataUrl = protectedResourceMetadataUrl(request, { publicBaseUrl });
      sendJson(response, 401, { error: "unauthorized", error_description: "A valid bearer token is required." }, { "WWW-Authenticate": `Bearer resource_metadata="${metadataUrl}", error="invalid_token"` });
      return;
    }

    const sessionId = typeof request.headers["mcp-session-id"] === "string" ? request.headers["mcp-session-id"] : "";
    let session = sessionFor(sessionId);
    if (sessionId && !session) { sendJson(response, 404, { error: "unknown_mcp_session" }); return; }
    if (!session) {
      if (request.method !== "POST") { sendJson(response, 400, { error: "an MCP session is required" }); return; }
      session = await createSession();
    }
    setTransportHeaders(response);
    request.auth = authInfo;
    await session.transport.handleRequest(request, response);
    if (session.transport.sessionId) sessions.set(session.transport.sessionId, session);
  };
}

function createRemoteGatewayServer({
  host = REMOTE_HOST,
  port = REMOTE_PORT,
  token = REMOTE_TOKEN,
  foundryClientToken = FOUNDRY_CLIENT_TOKEN || (isLoopbackHost(host) ? token : ""),
  expectedWorldId = EXPECTED_WORLD_ID,
  foundryOriginHosts = FOUNDRY_ORIGIN_HOSTS,
  publicBaseUrl = REMOTE_PUBLIC_BASE_URL,
  oauthIssuer = REMOTE_OAUTH_ISSUER,
  oauthAudience = REMOTE_OAUTH_AUDIENCE,
  oauthJwksUrl = REMOTE_OAUTH_JWKS_URL,
  oauthScope = REMOTE_OAUTH_SCOPE,
  authMode = REMOTE_AUTH_MODE,
  tlsTerminated = REMOTE_TLS_TERMINATED,
  verifyBearerToken,
  profileOptions = {},
} = {}) {
  const resolvedVerifier = verifyBearerToken ?? (isOidcAuthMode(authMode) ? createOidcBearerVerifier({ issuer: oauthIssuer, audience: oauthAudience, jwksUrl: oauthJwksUrl }) : undefined);
  validateRemoteDeployment({ host, token, foundryClientToken, publicBaseUrl, oauthIssuer, oauthAudience, oauthJwksUrl, authMode, tlsTerminated, verifyBearerToken: resolvedVerifier });
  let gateway;
  const requestHandler = createRemoteGatewayRequestHandler({
    expectedToken: token,
    verifyBearerToken: resolvedVerifier,
    publicBaseUrl,
    oauthIssuer,
    oauthScope,
    profileOptions: { expectedWorldId, ...profileOptions },
    getConnection: () => gateway?.connection(),
  });
  gateway = createBridgeServer({ host, port, expectedWorldId, expectedToken: foundryClientToken, allowedOriginHosts: foundryOriginHosts, requestHandler });
  return gateway;
}

async function runRemoteGateway() {
  const gateway = createRemoteGatewayServer();
  const address = await gateway.listen();
  process.stderr.write(`DiceBox remote gateway listening in ${REMOTE_AUTH_MODE} mode at ${JSON.stringify(address)}; Foundry path /dicebox-foundry; MCP path /mcp; connector ${CONNECTOR_PROTOCOL}.\n`);
  const close = async () => { await gateway.close(); process.exit(0); };
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runRemoteGateway().catch(error => { process.stderr.write(`DiceBox remote gateway failed: ${errorText(error)}\n`); process.exit(1); });

export {
  CONNECTOR_PROTOCOL,
  CHATGPT_PLUGIN_INSTRUCTIONS,
  MAX_BODY_BYTES,
  authorizedBearer,
  bearerValue,
  createConnectorAttestation,
  createConnectorProfile,
  createMcpServer,
  createOperationInvoker,
  createRemoteGatewayRequestHandler,
  createRemoteGatewayServer,
  handleRemoteMcpMessage,
  isOidcAuthMode,
  protectedResourceMetadata,
  validateRemoteDeployment,
};
