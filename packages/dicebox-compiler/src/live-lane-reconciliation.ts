import { z } from "zod";
import {
  FoundryFixtureObservationAuditSchema,
  diffRuntimeProfile,
  type RuntimeProfileDiff,
} from "@dicebox/core";
import { canonicalizeFoundryIr, sha256FoundryIr } from "./foundry-ir.js";
import {
  compareFoundryArtifactHashes,
  type FoundryArtifactDriftReport,
} from "./foundry-artifact-spec.js";
import { DICEBOX_PACKAGE_ID, StableDiceBoxIdSchema, createStableDiceBoxId } from "@dicebox/core";

const sha256Pattern = /^[0-9a-f]{64}$/;
const contexts = ["GM", "Player3"] as const;

const targetSchema = z.object({
  worldId: z.string().min(1),
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  packageId: z.literal(DICEBOX_PACKAGE_ID),
  packageVersion: z.string().min(1),
  adapterId: z.string().min(1),
  adapterVersion: z.string().min(1),
}).strict();

const servedFileSchema = z.object({
  relativePath: z.string().min(1).max(240).regex(/^[^\\/:*?"<>|\u0000-\u001f]+(?:[\\/][^\\/:*?"<>|\u0000-\u001f]+)*$/),
  sourceSha256: z.string().regex(sha256Pattern),
  servedSha256: z.string().regex(sha256Pattern),
  sourceBytes: z.number().int().nonnegative(),
  servedBytes: z.number().int().nonnegative(),
}).strict();

const supervisorSchema = z.object({
  status: z.enum(["pass", "blocked", "unknown"]),
  worldId: z.string().min(1),
  port: z.number().int().positive(),
  worldDocumentWrites: z.number().int().nonnegative(),
  balladTouched: z.boolean(),
  listenerMatches: z.boolean(),
  noWrite: z.literal(true),
}).strict();

const preflightCheckSchema = z.object({
  id: z.string().min(1).max(80),
  status: z.enum(["pass", "blocked", "unknown", "not-tested"]),
}).strict();

const preflightSchema = z.object({
  status: z.enum(["pass", "blocked", "unknown"]),
  foundryVersion: z.string().min(1).nullable(),
  systemId: z.string().min(1).nullable(),
  systemVersion: z.string().min(1).nullable(),
  moduleVersion: z.string().min(1).nullable(),
  checks: z.array(preflightCheckSchema).max(40),
  noWrite: z.literal(true),
}).strict();

const clientSchema = z.object({
  context: z.enum(contexts),
  ready: z.boolean(),
  exactTargetMatch: z.boolean(),
  fingerprintId: StableDiceBoxIdSchema,
  isGM: z.boolean(),
  activeGmStatus: z.enum(["observed", "unknown", "unavailable"]),
  activeGmIsCurrentUser: z.boolean().nullable(),
  noWrite: z.literal(true),
}).strict();

const fixtureAuditSchema = z.object({
  context: z.enum(contexts),
  audit: FoundryFixtureObservationAuditSchema,
}).strict();

const previewSchema = z.object({
  status: z.enum(["pass", "blocked", "unknown"]),
  noWrite: z.literal(true),
  applied: z.literal(false),
  existingComplete: z.boolean().nullable(),
  planSha256: z.string().regex(sha256Pattern).nullable(),
  blockers: z.array(z.string().min(1).max(500)).max(20),
}).strict();

const inputSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  reconciliationId: StableDiceBoxIdSchema,
  target: targetSchema,
  servedFiles: z.array(servedFileSchema).min(1).max(100),
  artifactSpec: z.unknown(),
  artifactObservation: z.unknown(),
  profileExpectation: z.unknown(),
  profileScan: z.unknown(),
  supervisor: supervisorSchema,
  preflight: preflightSchema,
  clients: z.array(clientSchema).length(2),
  fixtureAudits: z.array(fixtureAuditSchema).length(2),
  programScenePreview: previewSchema,
}).strict();

const outputSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  reconciliationId: StableDiceBoxIdSchema,
  operation: z.literal("foundry.live-lane.reconciliation"),
  status: z.enum(["pass", "blocked"]),
  evidenceClass: z.enum(["full_function", "blocked"]),
  target: targetSchema,
  sourceServedStatus: z.enum(["matched", "blocked"]),
  sourceServedFiles: z.array(servedFileSchema).max(100),
  artifactDrift: z.object({
    status: z.enum(["pass", "blocked"]),
    promotion: z.enum(["eligible", "blocked"]),
    targetMatch: z.boolean(),
    blockerCount: z.number().int().nonnegative(),
  }).strict(),
  profileDiff: z.object({
    status: z.enum(["pass", "blocked"]),
    promotion: z.enum(["eligible", "blocked"]),
    exactTargetMatch: z.boolean(),
    blockerCount: z.number().int().nonnegative(),
  }).strict(),
  supervisor: supervisorSchema,
  preflight: preflightSchema,
  clients: z.array(clientSchema).length(2),
  fixtureContexts: z.array(z.enum(contexts)).length(2),
  programScenePreview: previewSchema,
  blockers: z.array(z.string().min(1).max(500)).max(100),
  promotion: z.enum(["eligible", "blocked"]),
  noWrite: z.literal(true),
  readyClaim: z.literal(false),
  preserveUnknown: z.literal(true),
  foreignStatePreserved: z.literal(true),
  canonicalSha256: z.string().regex(sha256Pattern),
}).strict();

export type LiveLaneReconciliationInput = z.input<typeof inputSchema>;
export type LiveLaneReconciliation = z.infer<typeof outputSchema>;
export const LiveLaneReconciliationInputSchema = inputSchema;
export const LiveLaneReconciliationSchema = outputSchema;

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function unsignedOutput(output: LiveLaneReconciliation): Omit<LiveLaneReconciliation, "canonicalSha256"> {
  const { canonicalSha256: _canonicalSha256, ...unsigned } = output;
  return unsigned;
}

function assertContexts(clients: readonly z.infer<typeof clientSchema>[], audits: readonly z.infer<typeof fixtureAuditSchema>[]): void {
  const clientContexts = clients.map((client) => client.context);
  const auditContexts = audits.map((audit) => audit.context);
  if (new Set(clientContexts).size !== contexts.length || !contexts.every((context) => clientContexts.includes(context))) {
    throw new Error("Live-lane reconciliation requires exactly one GM and one Player3 client.");
  }
  if (new Set(auditContexts).size !== contexts.length || !contexts.every((context) => auditContexts.includes(context))) {
    throw new Error("Live-lane reconciliation requires exactly one GM and one Player3 fixture audit.");
  }
}

function sourceServedBlockers(files: readonly z.infer<typeof servedFileSchema>[]): string[] {
  return files.flatMap((file) => {
    const blockers: string[] = [];
    if (file.sourceSha256 !== file.servedSha256) blockers.push(`Source/served SHA-256 drift for ${file.relativePath}.`);
    if (file.sourceBytes !== file.servedBytes) blockers.push(`Source/served byte-length drift for ${file.relativePath}.`);
    return blockers;
  });
}

function supervisorBlockers(supervisor: z.infer<typeof supervisorSchema>, target: z.infer<typeof targetSchema>): string[] {
  const blockers: string[] = [];
  if (supervisor.status !== "pass") blockers.push("Fixture supervisor is not in PASS state.");
  if (supervisor.worldId !== target.worldId) blockers.push("Fixture supervisor world does not match the exact reconciliation target.");
  if (supervisor.worldDocumentWrites !== 0) blockers.push("Fixture supervisor reports one or more world document writes during the read-only reconciliation.");
  if (supervisor.balladTouched) blockers.push("Ballad state was touched during the reconciliation.");
  if (!supervisor.listenerMatches) blockers.push("Fixture supervisor listener identity does not match the exact target process.");
  return blockers;
}

function preflightBlockers(preflight: z.infer<typeof preflightSchema>, target: z.infer<typeof targetSchema>): string[] {
  const blockers: string[] = [];
  if (preflight.status !== "pass") blockers.push("Exact preflight is blocked or unknown.");
  if (preflight.foundryVersion !== target.foundryVersion) blockers.push("Preflight Foundry version does not match the exact target.");
  if (preflight.systemId !== target.systemId) blockers.push("Preflight system ID does not match the exact target.");
  if (preflight.systemVersion !== target.systemVersion) blockers.push("Preflight system version does not match the exact target.");
  if (preflight.moduleVersion !== target.packageVersion) blockers.push("Preflight module version does not match the exact package version.");
  const checkMap = new Map(preflight.checks.map((check) => [check.id, check.status]));
  if (checkMap.get("live-runtime-probe") !== "pass") blockers.push("The exact live-runtime probe is not a passing preflight check.");
  return blockers;
}

function clientBlockers(clients: readonly z.infer<typeof clientSchema>[]): string[] {
  return clients.flatMap((client) => {
    const blockers: string[] = [];
    if (!client.ready) blockers.push(`${client.context} client did not reach ready state.`);
    if (!client.exactTargetMatch) blockers.push(`${client.context} client did not establish the exact target.`);
    if (client.context === "GM" && !client.isGM) blockers.push("The GM context is not a GM user.");
    if (client.context === "Player3" && client.isGM) blockers.push("The Player3 context is unexpectedly a GM user.");
    if (client.activeGmStatus !== "observed") blockers.push(`${client.context} client lacks observed active-GM evidence.`);
    return blockers;
  });
}

function fixtureBlockers(audits: readonly z.infer<typeof fixtureAuditSchema>[]): string[] {
  return audits.flatMap(({ context, audit }) => audit.status === "reviewable"
    ? []
    : [`${context} fixture observation audit is blocked: ${audit.blockers.join(" ")}`]);
}

function previewBlockers(preview: z.infer<typeof previewSchema>): string[] {
  if (preview.status === "pass") return [];
  return preview.blockers.length > 0 ? preview.blockers.map((blocker) => `Program-Scene preview: ${blocker}`) : ["Program-Scene preview did not pass."];
}

/**
 * Compose a redacted exact-runtime reconciliation from supplied observations.
 * This function never contacts Foundry and never authorizes or performs a
 * write; it exists to make the read-only Stage 9 gate deterministic.
 */
export async function reconcileLiveLane(input: unknown): Promise<LiveLaneReconciliation> {
  const parsed = inputSchema.parse(input);
  assertContexts(parsed.clients, parsed.fixtureAudits);
  const servedFiles = parsed.servedFiles.map((file) => servedFileSchema.parse(file));
  const servedBlockers = sourceServedBlockers(servedFiles);
  const artifactDrift: FoundryArtifactDriftReport = await compareFoundryArtifactHashes(parsed.artifactSpec, parsed.artifactObservation);
  const profileDiff: RuntimeProfileDiff = diffRuntimeProfile(parsed.profileExpectation, parsed.profileScan);
  const blockers = unique([
    ...servedBlockers,
    ...artifactDrift.blockers,
    ...profileDiff.blockers,
    ...supervisorBlockers(parsed.supervisor, parsed.target),
    ...preflightBlockers(parsed.preflight, parsed.target),
    ...clientBlockers(parsed.clients),
    ...fixtureBlockers(parsed.fixtureAudits),
    ...previewBlockers(parsed.programScenePreview),
  ]);
  const status = blockers.length === 0 ? "pass" : "blocked";
  const unsigned = {
    schemaVersion: "0.1.0" as const,
    reconciliationId: parsed.reconciliationId,
    operation: "foundry.live-lane.reconciliation" as const,
    status,
    evidenceClass: status === "pass" ? "full_function" as const : "blocked" as const,
    target: parsed.target,
    sourceServedStatus: servedBlockers.length === 0 ? "matched" as const : "blocked" as const,
    sourceServedFiles: servedFiles,
    artifactDrift: {
      status: artifactDrift.status,
      promotion: artifactDrift.promotion,
      targetMatch: artifactDrift.targetMatch,
      blockerCount: artifactDrift.blockers.length,
    },
    profileDiff: {
      status: profileDiff.status,
      promotion: profileDiff.promotion,
      exactTargetMatch: profileDiff.exactTargetMatch,
      blockerCount: profileDiff.blockers.length,
    },
    supervisor: parsed.supervisor,
    preflight: parsed.preflight,
    clients: parsed.clients,
    fixtureContexts: parsed.fixtureAudits.map(({ context }) => context),
    programScenePreview: parsed.programScenePreview,
    blockers,
    promotion: status === "pass" ? "eligible" as const : "blocked" as const,
    noWrite: true as const,
    readyClaim: false as const,
    preserveUnknown: true as const,
    foreignStatePreserved: true as const,
  };
  const canonicalSha256 = await sha256FoundryIr(canonicalizeFoundryIr(unsigned));
  return outputSchema.parse({ ...unsigned, canonicalSha256 });
}

export async function verifyLiveLaneReconciliationHash(input: unknown): Promise<boolean> {
  try {
    const parsed = outputSchema.parse(input);
    return (await sha256FoundryIr(canonicalizeFoundryIr(unsignedOutput(parsed)))) === parsed.canonicalSha256;
  } catch {
    return false;
  }
}

export function createLiveLaneReconciliationId(localKey: string) {
  return createStableDiceBoxId("reconciliation", localKey);
}
