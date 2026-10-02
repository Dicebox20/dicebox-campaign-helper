#!/usr/bin/env node

/*
 * Loopback MCP host for the DiceBox page-main Foundry bridge.
 *
 * The host exposes only the eight fixed operations below. It never receives a
 * script, macro body, arbitrary Document payload, world ID, or execute-as-GM
 * request. Foundry remains the authority for active-GM checks, preview-token
 * validation, native writes, and authoritative reread.
 */

import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const BRIDGE_PROTOCOL = "dicebox-foundry-live-bridge/1";
const BRIDGE_PATH = "/dicebox-foundry";
const BRIDGE_HOST = "127.0.0.1";
const BRIDGE_PORT = Number(process.env.DICEBOX_MCP_BRIDGE_PORT ?? 8797);
const EXPECTED_WORLD_ID = process.env.DICEBOX_MCP_WORLD_ID ?? "the-ballad-of-chauser-bill";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_FRAME_BYTES = 64 * 1024;

const TOOL_DEFINITIONS = Object.freeze([
  { name: "dbx_foundry_bridge_status", description: "Read DiceBox loopback bridge status.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "bridge.status" },
  { name: "dbx_foundry_harness_status", description: "Read the exact-world and elected-GM harness boundary.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "harness.status" },
  { name: "dbx_foundry_helper_readiness", description: "Read the redacted Campaign Helper readiness report.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "helper.readiness" },
  { name: "dbx_foundry_ascendancy_preview", description: "Validate the exact-runtime Ascendancy installer without writing and receive a short-lived approval token.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "ascendancy.preview" },
  { name: "dbx_foundry_ascendancy_install", description: "Apply one current approved Ascendancy preview through native Foundry APIs and return the installer reread receipt.", inputSchema: { type: "object", additionalProperties: false, required: ["planToken", "approved"], properties: { planToken: { type: "string", minLength: 1 }, approved: { type: "boolean", const: true } } }, operation: "ascendancy.install" },
  { name: "dbx_foundry_ascendancy_repair_preview", description: "Validate the exact-runtime owned Ascendancy renderer and boundary-Wall repair without writing and receive a short-lived approval token.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "ascendancy.repair.preview" },
  { name: "dbx_foundry_ascendancy_repair", description: "Apply one current approved Ascendancy renderer and owned boundary-Wall repair through native Foundry APIs and return the reread receipt.", inputSchema: { type: "object", additionalProperties: false, required: ["planToken", "approved"], properties: { planToken: { type: "string", minLength: 1 }, approved: { type: "boolean", const: true } } }, operation: "ascendancy.repair" },
  { name: "dbx_foundry_ascendancy_snapshot", description: "Read a redacted DiceBox-owned Scene/Wall/Region snapshot after installation.", inputSchema: { type: "object", additionalProperties: false, properties: {} }, operation: "ascendancy.snapshot" }
]);

function errorText(error) { return String(error?.message ?? error ?? "Bridge request failed.").replace(/[\r\n]+/g, " ").trim().slice(0, 480) || "Bridge request failed."; }
function isObject(value) { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function allowedOrigin(origin) {
  if (!origin) return false;
  try { return ["localhost", "127.0.0.1", "[::1]", "::1"].includes(new URL(origin).hostname); } catch { return false; }
}
function encodeFrame(text) {
  const payload = Buffer.from(text, "utf8");
  if (payload.length > MAX_FRAME_BYTES) throw new Error("Bridge response exceeds the local frame limit.");
  const header = payload.length < 126 ? Buffer.from([0x81, payload.length]) : Buffer.from([0x81, 126, payload.length >> 8, payload.length & 0xff]);
  return Buffer.concat([header, payload]);
}
function decodeFrames(buffer) {
  const messages = [];
  let offset = 0;
  while (offset + 2 <= buffer.length) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const fin = (first & 0x80) !== 0;
    const opcode = first & 0x0f;
    const masked = (second & 0x80) !== 0;
    let length = second & 0x7f;
    let cursor = offset + 2;
    if (!fin || length === 127) throw new Error("Unsupported fragmented or oversized WebSocket frame.");
    if (length === 126) { if (cursor + 2 > buffer.length) break; length = buffer.readUInt16BE(cursor); cursor += 2; }
    if (length > MAX_FRAME_BYTES || !masked || cursor + 4 + length > buffer.length) { if (cursor + 4 + length > buffer.length) break; throw new Error("Invalid local WebSocket frame."); }
    const mask = buffer.subarray(cursor, cursor + 4); cursor += 4;
    const payload = Buffer.from(buffer.subarray(cursor, cursor + length));
    for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index % 4];
    offset = cursor + length;
    if (opcode === 0x8) return { messages, remaining: buffer.subarray(offset), closed: true };
    if (opcode === 0x9) continue;
    if (opcode !== 0x1) throw new Error("The local bridge accepts text frames only.");
    messages.push(payload.toString("utf8"));
  }
  return { messages, remaining: buffer.subarray(offset), closed: false };
}
function rpcResponse(id, result) { return { jsonrpc: "2.0", id, result }; }
function rpcError(id, code, message) { return { jsonrpc: "2.0", id: id ?? null, error: { code, message } }; }
function toolResult(value, isError = false) { return { content: [{ type: "text", text: JSON.stringify(value, null, 2) }], ...(isError ? { isError: true } : {}) }; }
function validateToolArguments(tool, input) {
  const args = input ?? {};
  if (!isObject(args)) throw new Error("Tool arguments must be an object.");
  const allowed = new Set(Object.keys(tool.inputSchema.properties ?? {}));
  const unknown = Object.keys(args).find(key => !allowed.has(key));
  if (unknown) throw new Error(`Unsupported tool argument \"${unknown}\".`);
  for (const name of tool.inputSchema.required ?? []) if (!(name in args)) throw new Error(`Missing required tool argument \"${name}\".`);
  if (["dbx_foundry_ascendancy_install", "dbx_foundry_ascendancy_repair"].includes(tool.name) && (args.approved !== true || typeof args.planToken !== "string" || !args.planToken)) throw new Error("approved must be true and planToken must be non-empty.");
  return args;
}

class FoundryConnection {
  constructor(socket) { this.socket = socket; this.buffer = Buffer.alloc(0); this.ready = false; this.pending = new Map(); }
  send(value) { if (this.socket.destroyed) throw new Error("Foundry bridge is not connected."); this.socket.write(encodeFrame(JSON.stringify(value))); }
  close(reason = "Bridge connection closed.") { for (const { reject, timer } of this.pending.values()) { clearTimeout(timer); reject(new Error(reason)); } this.pending.clear(); }
  receive(chunk, onHello) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    const parsed = decodeFrames(this.buffer); this.buffer = parsed.remaining;
    if (parsed.closed) this.socket.end();
    for (const text of parsed.messages) {
      const message = JSON.parse(text);
      if (message?.type === "hello") { onHello(message); continue; }
      if (message?.type !== "response" || typeof message.id !== "string") continue;
      const pending = this.pending.get(message.id); if (!pending) continue;
      this.pending.delete(message.id); clearTimeout(pending.timer);
      if (message.ok === true) pending.resolve(message.result); else pending.reject(new Error(errorText(message.error)));
    }
  }
  request(operation, args) {
    if (!this.ready) throw new Error("The Foundry client has not completed the private bridge handshake.");
    const id = randomUUID();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(new Error("The Foundry bridge did not respond within 15 seconds.")); }, REQUEST_TIMEOUT_MS);
      this.pending.set(id, { resolve, reject, timer });
      try { this.send({ type: "request", id, operation, args }); } catch (error) { this.pending.delete(id); clearTimeout(timer); reject(error); }
    });
  }
}

function createBridgeServer({ host = BRIDGE_HOST, port = BRIDGE_PORT, expectedWorldId = EXPECTED_WORLD_ID } = {}) {
  let connection = null;
  let handshaking = false;
  const server = createServer((_, response) => { response.writeHead(404, { "Content-Type": "text/plain" }); response.end("DiceBox Foundry live bridge."); });
  server.on("upgrade", (request, socket, head) => {
    if (request.url !== BRIDGE_PATH || !allowedOrigin(request.headers.origin) || connection || handshaking) { socket.write("HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n"); socket.destroy(); return; }
    const key = request.headers["sec-websocket-key"];
    if (typeof key !== "string") { socket.write("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"); socket.destroy(); return; }
    const accept = createHash("sha1").update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest("base64");
    socket.write(["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${accept}`, "\r\n"].join("\r\n"));
    handshaking = true;
    const candidate = new FoundryConnection(socket);
    const receive = chunk => { try { candidate.receive(chunk, hello => { if (candidate.ready || hello?.protocol !== BRIDGE_PROTOCOL || hello?.moduleId !== "dicebox-campaign-helper" || hello?.worldId !== expectedWorldId || hello?.isGM !== true) throw new Error("The Foundry client did not satisfy the private bridge boundary."); candidate.ready = true; connection = candidate; handshaking = false; candidate.send({ type: "ready", protocol: BRIDGE_PROTOCOL }); }); } catch { handshaking = false; socket.destroy(); } };
    socket.on("data", receive); if (head?.length) receive(head);
    socket.on("close", () => { handshaking = false; candidate.close(); if (connection === candidate) connection = null; });
    socket.on("error", () => { handshaking = false; candidate.close(); if (connection === candidate) connection = null; });
  });
  return { server, listen: () => new Promise((resolve, reject) => { server.once("error", reject); server.listen(port, host, () => { server.off("error", reject); resolve(server.address()); }); }), close: () => new Promise(resolve => server.close(() => resolve())), connection: () => connection };
}

async function handleMcpMessage(message, bridge) {
  if (message.method === "notifications/initialized") return null;
  if (message.method === "initialize") return rpcResponse(message.id, { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "dicebox-foundry-live-bridge", version: "1.0.0" } });
  if (message.method === "tools/list") return rpcResponse(message.id, { tools: TOOL_DEFINITIONS.map(({ operation: _operation, ...tool }) => tool) });
  if (message.method === "tools/call") {
    try { const name = String(message.params?.name ?? ""); const tool = TOOL_DEFINITIONS.find(entry => entry.name === name); if (!tool) throw new Error("Unknown MCP tool."); const args = validateToolArguments(tool, message.params?.arguments); const result = await bridge.request(tool.operation, args); return rpcResponse(message.id, toolResult(result)); }
    catch (error) { return rpcResponse(message.id, toolResult({ error: errorText(error) }, true)); }
  }
  return rpcError(message.id, -32601, "Method not found.");
}

async function runStdioServer() {
  const bridgeServer = createBridgeServer();
  await bridgeServer.listen();
  let buffer = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", async chunk => { buffer += chunk; let newline; while ((newline = buffer.indexOf("\n")) >= 0) { const line = buffer.slice(0, newline).trim(); buffer = buffer.slice(newline + 1); if (!line) continue; try { const response = await handleMcpMessage(JSON.parse(line), bridgeServer.connection() ?? { request: () => Promise.reject(new Error("No eligible Ballad Gamemaster client is connected.")) }); if (response) process.stdout.write(`${JSON.stringify(response)}\n`); } catch (error) { process.stdout.write(`${JSON.stringify(rpcError(null, -32700, errorText(error)))}\n`); } } });
  const close = async () => { await bridgeServer.close(); process.exit(0); };
  process.once("SIGINT", close); process.once("SIGTERM", close);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runStdioServer().catch(error => { process.stderr.write(`DiceBox Foundry bridge failed: ${errorText(error)}\n`); process.exit(1); });

export { BRIDGE_HOST, BRIDGE_PATH, BRIDGE_PORT, BRIDGE_PROTOCOL, EXPECTED_WORLD_ID, TOOL_DEFINITIONS, allowedOrigin, createBridgeServer, decodeFrames, encodeFrame, handleMcpMessage, validateToolArguments };
