#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const CONNECTOR_PROTOCOL = "dicebox-foundry-connector/1";
const RECIPE_REGISTRY_VERSION = "1.0.0";
const PACKAGE_ID = "dicebox-campaign-helper";
const DEFAULT_MODULE_ROOT = resolve(new URL("../packages/dicebox-foundry", import.meta.url).pathname);

const EMPTY_INPUT_SCHEMA = Object.freeze({ type: "object", additionalProperties: false, properties: {} });
const INSTALL_INPUT_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  required: ["planToken", "approved"],
  properties: { planToken: { type: "string", minLength: 1 }, approved: { type: "boolean", const: true } },
});
const OPEN_OUTPUT_SCHEMA = Object.freeze({ type: "object", additionalProperties: true, properties: {} });

const READ_ONLY_ANNOTATIONS = Object.freeze({ readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false });
const PREVIEW_ANNOTATIONS = Object.freeze({ readOnlyHint: true, destructiveHint: false, idempotentHint: false, openWorldHint: false });
const WRITE_ANNOTATIONS = Object.freeze({ readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: false });

const RECIPE_REGISTRY = Object.freeze([
  { name: "dbx_foundry_bridge_status", operation: "bridge.status", description: "Read DiceBox bridge status.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
  { name: "dbx_foundry_harness_status", operation: "harness.status", description: "Read the exact-world and elected-GM harness boundary.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
  { name: "dbx_foundry_helper_readiness", operation: "helper.readiness", description: "Read the redacted Campaign Helper readiness report.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
  { name: "dbx_foundry_connector_profile", operation: "connector.profile", description: "Read the exact Foundry runtime profile and connector target identity.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
  { name: "dbx_foundry_connector_attestation", operation: "connector.attestation", description: "Compare the connector build identity with the exact Foundry runtime profile.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
  { name: "dbx_foundry_ascendancy_preview", operation: "ascendancy.preview", description: "Validate the exact-runtime Ascendancy installer without writing and receive a short-lived approval token.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: PREVIEW_ANNOTATIONS, authority: "active-gm-preview", readWrite: "preview", requiresPreviewApproval: false },
  { name: "dbx_foundry_ascendancy_install", operation: "ascendancy.install", description: "Apply one current approved Ascendancy preview through native Foundry APIs and return the installer reread receipt.", inputSchema: INSTALL_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: WRITE_ANNOTATIONS, authority: "active-gm-approved-write", readWrite: "write", requiresPreviewApproval: true },
  { name: "dbx_foundry_ascendancy_repair_preview", operation: "ascendancy.repair.preview", description: "Validate the exact-runtime owned Ascendancy renderer and boundary-Wall repair without writing and receive a short-lived approval token.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: PREVIEW_ANNOTATIONS, authority: "active-gm-preview", readWrite: "preview", requiresPreviewApproval: false },
  { name: "dbx_foundry_ascendancy_repair", operation: "ascendancy.repair", description: "Apply one current approved Ascendancy renderer and owned boundary-Wall repair through native Foundry APIs and return the reread receipt.", inputSchema: INSTALL_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: WRITE_ANNOTATIONS, authority: "active-gm-approved-write", readWrite: "write", requiresPreviewApproval: true },
  { name: "dbx_foundry_ascendancy_snapshot", operation: "ascendancy.snapshot", description: "Read a redacted DiceBox-owned Scene/Wall/Region snapshot after installation.", inputSchema: EMPTY_INPUT_SCHEMA, outputSchema: OPEN_OUTPUT_SCHEMA, annotations: READ_ONLY_ANNOTATIONS, authority: "active-gm-read", readWrite: "read", requiresPreviewApproval: false },
]);

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex").toUpperCase();
}

function stableJson(value) {
  return JSON.stringify(value, Object.keys(value).sort());
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function readArtifact(root, path) {
  const absolutePath = join(root, path);
  const bytes = readFileSync(absolutePath);
  return Object.freeze({
    path: relative(root, absolutePath).replaceAll("\\", "/"),
    bytes: bytes.byteLength,
    sha256: sha256(bytes),
  });
}

function recipeIdentity(recipe) {
  return Object.freeze({
    name: recipe.name,
    operation: recipe.operation,
    recipeId: `dbx:connector-recipe:${recipe.operation}`,
    version: RECIPE_REGISTRY_VERSION,
    readWrite: recipe.readWrite,
    requiresPreviewApproval: recipe.requiresPreviewApproval,
  });
}

function createConnectorProfile({
  moduleRoot = DEFAULT_MODULE_ROOT,
  expectedWorldId = process.env.DICEBOX_MCP_WORLD_ID ?? "the-ballad-of-chauser-bill",
  expectedFoundryVersion,
  expectedSystemId,
  expectedSystemVersion,
  remoteHost = process.env.DICEBOX_REMOTE_BRIDGE_HOST ?? "127.0.0.1",
  authMode = "static-token",
  tlsTerminated = false,
  publicBaseUrl = "",
  runtimeObservation = null,
} = {}) {
  const root = resolve(moduleRoot);
  const manifestPath = join(root, "module.json");
  const manifest = readJson(manifestPath);
  const entryPath = manifest.esmodules?.[0];
  if (manifest.id !== PACKAGE_ID || typeof manifest.version !== "string" || typeof entryPath !== "string") {
    throw new Error("The connector module manifest is missing the fixed package identity or ES module entry.");
  }
  const manifestArtifact = readArtifact(root, "module.json");
  const entryArtifact = readArtifact(root, entryPath);
  const target = Object.freeze({
    worldId: String(expectedWorldId),
    foundryVersion: String(expectedFoundryVersion ?? manifest.compatibility?.verified ?? ""),
    systemId: String(expectedSystemId ?? manifest.relationships?.systems?.[0]?.id ?? ""),
    systemVersion: String(expectedSystemVersion ?? manifest.relationships?.systems?.[0]?.compatibility?.verified ?? ""),
  });
  const recipes = Object.freeze(RECIPE_REGISTRY.map(recipeIdentity));
  const identity = Object.freeze({
    packageId: manifest.id,
    moduleVersion: manifest.version,
    manifest: manifestArtifact,
    entry: entryArtifact,
    target,
    connectorProtocol: CONNECTOR_PROTOCOL,
    recipeRegistryVersion: RECIPE_REGISTRY_VERSION,
  });
  const identityHash = sha256(Buffer.from(stableJson(identity), "utf8"));
  return Object.freeze({
    schemaVersion: "0.1.0",
    connectorProtocol: CONNECTOR_PROTOCOL,
    recipeRegistryVersion: RECIPE_REGISTRY_VERSION,
    target,
    module: Object.freeze({
      packageId: manifest.id,
      version: manifest.version,
      manifest: manifestArtifact,
      entry: entryArtifact,
      loadedByteHashClaimed: false,
    }),
    transport: Object.freeze({
      mcp: "streamable-http",
      foundry: "websocket",
      authMode,
      remoteHost,
      publicBaseUrl: publicBaseUrl || null,
      tlsTerminated: Boolean(tlsTerminated),
      tlsRequiredForNonLoopback: true,
    }),
    authority: Object.freeze({
      runtimeAuthority: "elected-active-gm",
      mutationDefault: "disabled",
      arbitraryExecution: false,
      publicExecuteAsGm: false,
    }),
    recipes,
    runtime: runtimeObservation,
    identityHash,
  });
}

function createConnectorAttestation({ profile, runtimeObservation = profile?.runtime ?? null } = {}) {
  if (!profile) throw new Error("A connector profile is required for attestation.");
  const runtimeTarget = runtimeObservation?.target ?? null;
  const expected = profile.target;
  const targetMatch = Boolean(runtimeObservation?.status === "OBSERVED"
    && runtimeObservation?.noWrite === true
    && runtimeObservation?.activeGm?.currentUserMatchesActiveGm === true
    && runtimeTarget?.worldId === expected.worldId
    && runtimeTarget?.foundryVersion === expected.foundryVersion
    && runtimeTarget?.systemId === expected.systemId
    && runtimeTarget?.systemVersion === expected.systemVersion
    && runtimeTarget?.exactTargetMatch === true);
  return Object.freeze({
    schemaVersion: "0.1.0",
    operation: "connector.attestation",
    status: targetMatch ? "PASS_SOURCE_AND_RUNTIME_PROFILE" : runtimeObservation ? "BLOCKED_TARGET_OR_RUNTIME_PROFILE" : "BLOCKED_RUNTIME_PROFILE_UNOBSERVED",
    noWrite: true,
    readyClaim: false,
    targetMatch,
    sourceIdentity: Object.freeze({
      packageId: profile.module.packageId,
      moduleVersion: profile.module.version,
      manifestSha256: profile.module.manifest.sha256,
      entrySha256: profile.module.entry.sha256,
      loadedByteHashClaimed: false,
      identityHash: profile.identityHash,
    }),
    expectedTarget: expected,
    observedTarget: runtimeTarget,
    runtimeStatus: runtimeObservation?.status ?? "UNOBSERVED",
    blockers: targetMatch ? [] : [runtimeObservation ? "The exact active-GM runtime profile does not match the connector target." : "No current Foundry runtime profile was observed."],
  });
}

function recipeByName(name) {
  return RECIPE_REGISTRY.find(recipe => recipe.name === name) ?? null;
}

function recipeByOperation(operation) {
  return RECIPE_REGISTRY.find(recipe => recipe.operation === operation) ?? null;
}

export {
  CONNECTOR_PROTOCOL,
  DEFAULT_MODULE_ROOT,
  PACKAGE_ID,
  RECIPE_REGISTRY,
  RECIPE_REGISTRY_VERSION,
  createConnectorAttestation,
  createConnectorProfile,
  recipeByName,
  recipeByOperation,
};
