import { createProposalBatch, type ProposalBatch, type ProposalBatchInput } from "@dicebox/core";

type JsonRecord = Record<string, unknown>;

export type ProjectRecoveryProposalInput = Readonly<{
  batchId: ProposalBatchInput["batchId"];
  preview: unknown;
  createdAt: string;
}>;

const stableIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const commonKeys = ["noFoundryWrite", "noWrite", "operation", "previewSha256", "projectId", "requiresApproval", "status"];

const operationKeys: Readonly<Record<string, readonly string[]>> = {
  "dicebox.project.migration.persist.preview": [
    "actions", "activeSceneId", "assetCollectionSha256", "assetCount", "assetTreeSha256", "authoritativeSource",
    "generation", "nextGeneration", "persistedContentSha256", "primaryByteSha256", "protectedStateSha256",
    "resultingContentSha256", "scenes", "semanticStateSha256", "sourceSchemaVersion", "targetSchemaVersion",
  ],
  "dicebox.project.recovery.backup-promotion.preview": [
    "activeSceneId", "assetCollectionSha256", "assetCount", "assetTreeSha256", "backup", "backupByteSha256",
    "contentSha256", "generation", "primary", "protectedStateSha256", "scenes", "semanticStateSha256",
  ],
  "dicebox.project.asset.restore.preview": [
    "affectedSceneIds", "assetId", "assetSha256", "byteLength", "candidateByteLength", "candidateSha256",
    "contentSha256", "generation", "mediaType", "migrationStatus", "protectedStateSha256", "recoveredFrom", "registration",
    "targetRelativePath",
  ],
  "dicebox.project.asset.detach.preview": [
    "affectedScenes", "assetId", "assetSha256", "assetTreeSha256", "byteLength", "contentSha256", "generation",
    "mediaType", "migrationStatus", "nextGeneration", "primaryByteSha256", "protectedStateSha256",
    "registration", "resultingAssetCollectionSha256", "resultingAssetCount", "resultingContentSha256", "resultingScenes",
    "targetRelativePath",
  ],
  "dicebox.project.broken-reference.detach.preview": [
    "affectedScene", "assetDescriptorPreserved", "assetId", "assetSha256", "assetTreeSha256", "backupByteSha256",
    "blockerCode", "contentSha256", "generation", "nextGeneration", "primaryByteSha256", "protectedStateSha256",
    "resultingAssetCollectionSha256", "resultingAssetCount", "resultingContentSha256", "resultingScenes", "sceneId",
  ],
};

const operationOptionalKeys: Readonly<Record<string, readonly string[]>> = {
  "dicebox.project.broken-reference.detach.preview": ["assetSha256", "backupByteSha256"],
};

function record(value: unknown, label: string): JsonRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
  return value as JsonRecord;
}

function assertExactKeys(value: JsonRecord, expected: readonly string[]): void {
  const actual = Object.keys(value).sort().join("|");
  const canonical = [...expected].sort().join("|");
  if (actual !== canonical) throw new Error("Project recovery preview contains unknown or missing fields.");
}

function assertOperationKeys(value: JsonRecord, expected: readonly string[], optional: readonly string[]): void {
  const allowed = new Set(expected);
  for (const key of Object.keys(value)) if (!allowed.has(key)) throw new Error("Project recovery preview contains an unknown field.");
  const optionalSet = new Set(optional);
  for (const key of expected) if (!optionalSet.has(key) && !(key in value)) throw new Error("Project recovery preview is missing a required field.");
}

function text(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() !== value || value.length === 0) throw new Error(`${label} must be a non-empty trimmed string.`);
  return value;
}

function stableId(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!stableIdPattern.test(parsed)) throw new Error(`${label} must be a stable DiceBox ID.`);
  return parsed;
}

function hash(value: unknown, label: string): string {
  const parsed = text(value, label);
  if (!sha256Pattern.test(parsed)) throw new Error(`${label} must be a lowercase SHA-256 value.`);
  return parsed;
}

function integer(value: unknown, label: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
  return value as number;
}

function literal(value: unknown, expected: unknown, label: string): void {
  if (value !== expected) throw new Error(`${label} must be ${String(expected)}.`);
}

function stringArray(value: unknown, label: string, stable = false): string[] {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value.map((entry, index) => stable ? stableId(entry, `${label}[${index}]`) : text(entry, `${label}[${index}]`));
}

function sceneReceipts(value: unknown, label: string): Array<{ sceneId: string; sceneSha256: string }> {
  if (!Array.isArray(value)) throw new Error(`${label} must be an array.`);
  return value.map((entry, index) => {
    const scene = record(entry, `${label}[${index}]`);
    assertExactKeys(scene, ["sceneId", "sceneSha256"]);
    return { sceneId: stableId(scene.sceneId, `${label}[${index}].sceneId`), sceneSha256: hash(scene.sceneSha256, `${label}[${index}].sceneSha256`) };
  });
}

function fileDisposition(value: unknown, label: string): void {
  const disposition = record(value, label);
  const allowed = ["blockerCode", "blockerMessage", "byteSha256", "migrationStatus", "relativePath", "retry", "sourceSchemaVersion", "status"];
  for (const key of Object.keys(disposition)) if (!allowed.includes(key)) throw new Error(`${label} contains an unsupported field.`);
  text(disposition.relativePath, `${label}.relativePath`);
  text(disposition.status, `${label}.status`);
  if (disposition.byteSha256 !== undefined) hash(disposition.byteSha256, `${label}.byteSha256`);
}

function assetRegistration(value: unknown, assetId: string): { assetId: string; role: "background"; label: string; provenance: string; approval: "approved" } {
  const registration = record(value, "registration");
  assertExactKeys(registration, ["approval", "assetId", "label", "provenance", "role"]);
  if (stableId(registration.assetId, "registration.assetId") !== assetId) throw new Error("Restore preview registration asset identity does not agree.");
  literal(registration.role, "background", "registration.role");
  literal(registration.approval, "approved", "registration.approval");
  return { assetId, role: "background", label: text(registration.label, "registration.label"), provenance: text(registration.provenance, "registration.provenance"), approval: "approved" };
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const object = record(value, "Canonical value");
  return `{${Object.keys(object).sort().map((key) => `${JSON.stringify(key)}:${canonicalize(object[key])}`).join(",")}}`;
}

async function sha256(value: unknown): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonicalize(value)));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function commandId(batchId: string): string {
  return `dbx:proposal-command:${batchId.split(":").at(-1) ?? "project-recovery"}-000`;
}

function operationName(previewOperation: string): string {
  if (previewOperation === "dicebox.project.recovery.backup-promotion.preview") return "project.recovery.backup-promote";
  return previewOperation.replace(/^dicebox\./, "").replace(/\.preview$/, "");
}

function common(preview: JsonRecord): { operation: string; projectId: string; generation: number; previewSha256: string } {
  const operation = text(preview.operation, "operation");
  const specific = operationKeys[operation];
  if (!specific) throw new Error(`Unsupported project recovery preview operation ${operation}.`);
  assertOperationKeys(preview, [...commonKeys, ...specific], operationOptionalKeys[operation] ?? []);
  literal(preview.status, "PREVIEW", "status");
  literal(preview.requiresApproval, true, "requiresApproval");
  literal(preview.noWrite, true, "noWrite");
  literal(preview.noFoundryWrite, true, "noFoundryWrite");
  return {
    operation,
    projectId: stableId(preview.projectId, "projectId"),
    generation: integer(preview.generation, "generation"),
    previewSha256: hash(preview.previewSha256, "previewSha256"),
  };
}

async function normalize(preview: JsonRecord): Promise<{
  projectId: string;
  generation: number;
  baseSha256: string;
  operation: string;
  risk: ProposalBatchInput["risk"];
  payload: JsonRecord;
}> {
  const identity = common(preview);
  const protectedStateSha256 = hash(preview.protectedStateSha256, "protectedStateSha256");
  const contentSha256 = hash(preview.contentSha256 ?? preview.persistedContentSha256, "currentContentSha256");
  let risk: ProposalBatchInput["risk"] = "high";
  let payload: JsonRecord;

  switch (identity.operation) {
    case "dicebox.project.migration.persist.preview": {
      literal(preview.authoritativeSource, "project.json", "authoritativeSource");
      const sourceSchemaVersion = text(preview.sourceSchemaVersion, "sourceSchemaVersion");
      if (!new Set(["0.1.0", "0.2.0"]).has(sourceSchemaVersion)) throw new Error("Unsupported migration source schema version.");
      literal(preview.targetSchemaVersion, "0.3.0", "targetSchemaVersion");
      const nextGeneration = integer(preview.nextGeneration, "nextGeneration");
      if (nextGeneration !== identity.generation + 1) throw new Error("Migration preview next generation is not canonical.");
      sceneReceipts(preview.scenes, "scenes");
      stableId(preview.activeSceneId, "activeSceneId");
      stringArray(preview.actions, "actions");
      payload = {
        operation: "project.migration.persist",
        projectId: identity.projectId,
        sourceSchemaVersion,
        targetSchemaVersion: "0.3.0",
        generation: identity.generation,
        nextGeneration,
        persistedContentSha256: hash(preview.persistedContentSha256, "persistedContentSha256"),
        resultingContentSha256: hash(preview.resultingContentSha256, "resultingContentSha256"),
        semanticStateSha256: hash(preview.semanticStateSha256, "semanticStateSha256"),
        assetTreeSha256: hash(preview.assetTreeSha256, "assetTreeSha256"),
        previewSha256: identity.previewSha256,
      };
      risk = "medium";
      break;
    }
    case "dicebox.project.recovery.backup-promotion.preview": {
      fileDisposition(preview.primary, "primary");
      fileDisposition(preview.backup, "backup");
      sceneReceipts(preview.scenes, "scenes");
      stableId(preview.activeSceneId, "activeSceneId");
      payload = {
        operation: "project.recovery.backup-promote",
        projectId: identity.projectId,
        generation: identity.generation,
        contentSha256,
        backupByteSha256: hash(preview.backupByteSha256, "backupByteSha256"),
        semanticStateSha256: hash(preview.semanticStateSha256, "semanticStateSha256"),
        assetTreeSha256: hash(preview.assetTreeSha256, "assetTreeSha256"),
        previewSha256: identity.previewSha256,
      };
      break;
    }
    case "dicebox.project.asset.restore.preview": {
      const assetId = stableId(preview.assetId, "assetId");
      const assetSha256 = hash(preview.assetSha256, "assetSha256");
      const candidateSha256 = hash(preview.candidateSha256, "candidateSha256");
      if (!assetId.endsWith(assetSha256) || candidateSha256 !== assetSha256) throw new Error("Restore preview asset identity and candidate hash do not agree.");
      const registration = assetRegistration(preview.registration, assetId);
      const affectedSceneIds = stringArray(preview.affectedSceneIds, "affectedSceneIds", true);
      payload = {
        operation: "project.asset.restore",
        projectId: identity.projectId,
        generation: identity.generation,
        contentSha256,
        assetId,
        assetSha256,
        mediaType: text(preview.mediaType, "mediaType"),
        candidateByteLength: integer(preview.candidateByteLength, "candidateByteLength"),
        affectedSceneIds,
        registration,
        previewSha256: identity.previewSha256,
      };
      risk = "medium";
      break;
    }
    case "dicebox.project.asset.detach.preview": {
      const nextGeneration = integer(preview.nextGeneration, "nextGeneration");
      if (nextGeneration !== identity.generation + 1) throw new Error("Asset detach next generation is not canonical.");
      const affectedScenes = sceneReceipts(preview.affectedScenes, "affectedScenes");
      sceneReceipts(preview.resultingScenes, "resultingScenes");
      assetRegistration(preview.registration, stableId(preview.assetId, "assetId"));
      payload = {
        operation: "project.asset.detach",
        projectId: identity.projectId,
        generation: identity.generation,
        nextGeneration,
        contentSha256,
        resultingContentSha256: hash(preview.resultingContentSha256, "resultingContentSha256"),
        assetId: stableId(preview.assetId, "assetId"),
        assetSha256: hash(preview.assetSha256, "assetSha256"),
        affectedSceneIds: affectedScenes.map((scene) => scene.sceneId),
        assetTreeSha256: hash(preview.assetTreeSha256, "assetTreeSha256"),
        previewSha256: identity.previewSha256,
      };
      break;
    }
    case "dicebox.project.broken-reference.detach.preview": {
      const nextGeneration = integer(preview.nextGeneration, "nextGeneration");
      if (nextGeneration !== identity.generation + 1) throw new Error("Broken-reference detach next generation is not canonical.");
      const affectedScene = sceneReceipts([preview.affectedScene], "affectedScene")[0]!;
      sceneReceipts(preview.resultingScenes, "resultingScenes");
      const blockerCode = text(preview.blockerCode, "blockerCode");
      if (!new Set(["BACKGROUND_ASSET_MISSING", "BACKGROUND_ASSET_ROLE_MISMATCH"]).has(blockerCode)) throw new Error("Unsupported broken-reference blocker code.");
      payload = {
        operation: "project.broken-reference.detach",
        projectId: identity.projectId,
        generation: identity.generation,
        nextGeneration,
        contentSha256,
        resultingContentSha256: hash(preview.resultingContentSha256, "resultingContentSha256"),
        sceneId: stableId(preview.sceneId, "sceneId"),
        sceneSha256: affectedScene.sceneSha256,
        assetId: stableId(preview.assetId, "assetId"),
        blockerCode,
        assetDescriptorPreserved: preview.assetDescriptorPreserved === true,
        assetTreeSha256: hash(preview.assetTreeSha256, "assetTreeSha256"),
        previewSha256: identity.previewSha256,
      };
      break;
    }
    default:
      throw new Error("Unsupported project recovery preview operation.");
  }

  hash(preview.previewSha256, "previewSha256");
  hash(protectedStateSha256, "protectedStateSha256");
  return {
    projectId: identity.projectId,
    generation: identity.generation,
    baseSha256: await sha256({ projectId: identity.projectId, generation: identity.generation, contentSha256, protectedStateSha256, previewSha256: identity.previewSha256 }),
    operation: operationName(identity.operation),
    risk,
    payload,
  };
}

export async function createProjectRecoveryProposalBatch(input: ProjectRecoveryProposalInput): Promise<ProposalBatch> {
  const normalized = await normalize(record(input.preview, "Project recovery preview"));
  return createProposalBatch({
    schemaVersion: "0.1.0",
    batchId: input.batchId,
    revision: 0,
    previousBatchSha256: null,
    producer: { kind: "project-store", sourceId: normalized.operation, provider: null },
    reviewAuthority: { domain: "human-review", requiredRole: "reviewer" },
    targetAuthority: { domain: "local-project", requiredActiveGm: false },
    risk: normalized.risk,
    base: { targetId: normalized.projectId, revision: normalized.generation, sha256: normalized.baseSha256 },
    commands: [{
      commandId: commandId(input.batchId),
      kind: normalized.operation,
      dependsOn: [],
      payload: normalized.payload,
    }],
    createdAt: input.createdAt,
  });
}
