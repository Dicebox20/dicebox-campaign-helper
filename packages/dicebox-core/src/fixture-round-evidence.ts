import { z } from "zod";
import {
  HarnessArtifactSchema,
  HarnessLaneReceiptSchema,
  type HarnessArtifact,
  type HarnessLaneReceipt,
} from "./harness-evidence.js";
import {
  createFoundryFixturePlan,
  FoundryFixturePlanSchema,
  type FoundryFixturePlan,
} from "./fixture-plan.js";
import {
  FoundryFixtureObservationReceiptSchema,
  type FoundryFixtureObservationReceipt,
} from "./fixture-observation.js";
import {
  RuntimeProfileSchema,
  type RuntimeProfile,
} from "./capability.js";
import { createRuntimeFingerprint } from "./runtime-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";
import { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION } from "./version.js";

const contexts = ["GM", "Player3"] as const;
const artifactKinds = ["html-report", "trace", "screenshot", "video", "redacted-json", "console", "runtime-receipt"] as const;

const targetSchema = z.object({
  fingerprintId: StableDiceBoxIdSchema,
  foundryVersion: z.string().min(1).nullable(),
  systemId: z.string().min(1).nullable(),
  systemVersion: z.string().min(1).nullable(),
  worldId: z.literal("dbx-test-world"),
}).strict();

const artifactBindingSchema = z.object({
  receiptId: StableDiceBoxIdSchema,
  context: z.enum(contexts),
  artifactIds: z.array(StableDiceBoxIdSchema).max(20),
}).strict();

const coverageCheckSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,63}$/),
  foundryApi: z.string().min(1).max(240),
  requiredContexts: z.array(z.enum(contexts)).min(1).max(2),
  requiredArtifactKinds: z.array(z.enum(artifactKinds)).min(1).max(4),
  observedContexts: z.array(z.enum(contexts)).max(2),
  observedArtifactKinds: z.array(z.enum(artifactKinds)).max(7),
  status: z.enum(["pass", "blocked", "unknown"]),
  reason: z.string().min(1).max(500),
}).strict();

const fixtureRoundEvidenceSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("foundry.fixture.round.evidence.audit"),
  status: z.enum(["reviewable", "blocked"]),
  evidenceClass: z.enum(["deterministic", "blocked"]),
  readyClaim: z.literal(false),
  noWrite: z.literal(true),
  noRawData: z.literal(true),
  target: targetSchema,
  fixturePlanId: StableDiceBoxIdSchema,
  receiptIds: z.array(StableDiceBoxIdSchema).max(2),
  contexts: z.array(z.enum(contexts)).max(2),
  artifacts: z.array(HarnessArtifactSchema).max(40),
  artifactBindings: z.array(artifactBindingSchema).max(2),
  checks: z.array(coverageCheckSchema).max(20),
  blockers: z.array(z.string().min(1).max(500)).max(30),
  notes: z.array(z.string().min(1).max(500)).max(12),
}).strict();

export type FoundryFixtureRoundEvidence = z.infer<typeof fixtureRoundEvidenceSchema>;
export const FoundryFixtureRoundEvidenceSchema = fixtureRoundEvidenceSchema;

const fixtureRoundHarnessAuditSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  operation: z.literal("foundry.fixture.round.harness.audit"),
  status: z.literal("blocked"),
  evidenceClass: z.literal("blocked"),
  readyClaim: z.literal(false),
  noWrite: z.literal(true),
  noRawData: z.literal(true),
  laneReceipt: HarnessLaneReceiptSchema,
  blockers: z.array(z.string().min(1).max(500)).max(20),
  notes: z.array(z.string().min(1).max(500)).max(12),
}).strict();

export type FoundryFixtureRoundHarnessAudit = z.infer<typeof fixtureRoundHarnessAuditSchema>;
export const FoundryFixtureRoundHarnessAuditSchema = fixtureRoundHarnessAuditSchema;

export interface FoundryFixtureRoundEvidenceInput {
  readonly profile: RuntimeProfile;
  readonly receipts: readonly unknown[];
  readonly artifacts: readonly unknown[];
  readonly artifactBindings: readonly unknown[];
}

export interface FoundryFixtureRoundHarnessInput {
  readonly profile: RuntimeProfile;
  readonly evidence: unknown;
}

function blockedFallback(reason: string): FoundryFixtureRoundEvidence {
  const fingerprintId = createStableDiceBoxId("fingerprint", "unknown");
  return fixtureRoundEvidenceSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.fixture.round.evidence.audit",
    status: "blocked",
    evidenceClass: "blocked",
    readyClaim: false,
    noWrite: true,
    noRawData: true,
    target: {
      fingerprintId,
      foundryVersion: null,
      systemId: null,
      systemVersion: null,
      worldId: "dbx-test-world",
    },
    fixturePlanId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
    receiptIds: [],
    contexts: [],
    artifacts: [],
    artifactBindings: [],
    checks: [],
    blockers: [reason.slice(0, 500)],
    notes: ["Malformed or incomplete evidence was discarded without echoing input or claiming live Foundry coverage."],
  });
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function targetFromProfile(profile: RuntimeProfile) {
  const fingerprint = createRuntimeFingerprint(profile);
  return {
    fingerprintId: fingerprint.fingerprintId,
    foundryVersion: profile.foundryVersion,
    systemId: profile.systemId,
    systemVersion: profile.systemVersion,
    worldId: "dbx-test-world" as const,
  };
}

function receiptCheck(
  receipt: FoundryFixtureObservationReceipt,
  apiCheck: FoundryFixturePlan["apiChecks"][number],
): { readonly status: "pass" | "blocked"; readonly reason: string } {
  const observed = receipt.checks.find((check) => check.id === apiCheck.id);
  if (!observed) return { status: "blocked", reason: `Required check ${apiCheck.id} has no receipt evidence.` };
  if (observed.foundryApi !== apiCheck.foundryApi) {
    return { status: "blocked", reason: `Check ${apiCheck.id} names ${observed.foundryApi}, not the planned Foundry API ${apiCheck.foundryApi}.` };
  }
  if (observed.status !== "pass") return { status: "blocked", reason: `Required check ${apiCheck.id} is ${observed.status}.` };
  if (receipt.status !== "observed") return { status: "blocked", reason: `Receipt ${receipt.receiptId} is ${receipt.status}, not observed.` };
  return { status: "pass", reason: `Receipt ${receipt.receiptId} reports the planned Foundry API check.` };
}

/**
 * Audit the evidence package required by the M21 exact Foundry fixture plan.
 * This is a coverage and artifact handoff boundary, not a readiness or
 * mutation boundary. It accepts only redacted receipts and artifact metadata.
 */
export function auditFoundryFixtureRoundEvidence(
  input: FoundryFixtureRoundEvidenceInput,
): FoundryFixtureRoundEvidence {
  try {
    const profile = RuntimeProfileSchema.parse(input.profile);
    const plan = createFoundryFixturePlan();
    return buildFixtureRoundEvidence(profile, plan, input);
  } catch {
    return blockedFallback("Fixture round evidence failed schema validation.");
  }
}

function buildFixtureRoundEvidence(
  profile: RuntimeProfile,
  plan: FoundryFixturePlan,
  input: FoundryFixtureRoundEvidenceInput,
): FoundryFixtureRoundEvidence {
  const receipts = input.receipts.map((receipt) => FoundryFixtureObservationReceiptSchema.parse(receipt));
  const artifacts = input.artifacts.map((artifact) => HarnessArtifactSchema.parse(artifact));
  const artifactBindings = input.artifactBindings.map((binding) => artifactBindingSchema.parse(binding));
  const target = targetFromProfile(profile);
  const fingerprint = createRuntimeFingerprint(profile);
  const blockers: string[] = [];
  const receiptIds = receipts.map((receipt) => receipt.receiptId);
  const receiptById = new Map(receipts.map((receipt) => [receipt.receiptId, receipt]));
  const artifactById = new Map(artifacts.map((artifact) => [artifact.artifactId, artifact]));

  if (receipts.length < 1 || receipts.length > 2) blockers.push("The first-round package requires one or two target-bound observation receipts.");
  if (new Set(receiptIds).size !== receiptIds.length) blockers.push("Duplicate observation receipt IDs are not permitted.");
  if (new Set(artifacts.map((artifact) => artifact.artifactId)).size !== artifacts.length) blockers.push("Duplicate artifact IDs are not permitted.");
  if (new Set(artifactBindings.map((binding) => binding.receiptId)).size !== artifactBindings.length) blockers.push("Duplicate receipt artifact bindings are not permitted.");
  if (fingerprint.foundryVersion !== TARGET_FOUNDRY_VERSION
    || fingerprint.systemId !== "dnd5e"
    || fingerprint.systemVersion !== TARGET_DND5E_VERSION
    || !fingerprint.exactTargetMatch) blockers.push("The supplied runtime profile is not the exact Foundry 14.367 / D&D5e 5.3.3 target.");
  if (artifactBindings.length !== receipts.length) blockers.push("Every observation receipt must have one explicit artifact binding record.");

  const contexts = unique(receipts.map((receipt) => receipt.context)) as Array<"GM" | "Player3">;
  if (!contexts.includes("GM") || !contexts.includes("Player3")) blockers.push("The first-round package requires distinct GM and Player3 observation contexts.");

  for (const receipt of receipts) {
    if (receipt.fixturePlanId !== plan.planId) blockers.push(`Receipt ${receipt.receiptId} is not bound to the M21 fixture plan.`);
    if (receipt.runtimeFingerprint.fingerprintId !== fingerprint.fingerprintId) blockers.push(`Receipt ${receipt.receiptId} is not bound to the supplied runtime fingerprint.`);
    if (receipt.target.foundryVersion !== profile.foundryVersion
      || receipt.target.systemId !== profile.systemId
      || receipt.target.systemVersion !== profile.systemVersion) blockers.push(`Receipt ${receipt.receiptId} target metadata does not match the supplied runtime profile.`);
  }

  for (const binding of artifactBindings) {
    const receipt = receiptById.get(binding.receiptId);
    if (!receipt) {
      blockers.push(`Artifact binding references an unknown receipt ${binding.receiptId}.`);
      continue;
    }
    if (binding.context !== receipt.context) blockers.push(`Artifact binding context does not match receipt ${binding.receiptId}.`);
    for (const artifactId of binding.artifactIds) if (!artifactById.has(artifactId)) blockers.push(`Artifact binding references an unknown artifact ${artifactId}.`);
  }

  const artifactKindsByContext = new Map<string, Set<typeof artifactKinds[number]>>();
  for (const binding of artifactBindings) {
    const kinds = artifactKindsByContext.get(binding.context) ?? new Set<typeof artifactKinds[number]>();
    for (const artifactId of binding.artifactIds) {
      const kind = artifactById.get(artifactId)?.kind;
      if (kind) kinds.add(kind);
    }
    artifactKindsByContext.set(binding.context, kinds);
  }

  const checks = plan.apiChecks.map((apiCheck) => {
    const observedContexts = contexts.filter((context) => {
      const receipt = receipts.find((candidate) => candidate.context === context);
      return receipt ? receiptCheck(receipt, apiCheck).status === "pass" : false;
    });
    const observedArtifactKinds = unique(observedContexts.flatMap((context) => [...(artifactKindsByContext.get(context) ?? new Set())])) as Array<typeof artifactKinds[number]>;
    const missingContexts = apiCheck.requiredContexts.filter((context) => !observedContexts.includes(context));
    const missingKinds = apiCheck.requiredArtifactKinds.filter((kind) => !observedArtifactKinds.includes(kind));
    const status = missingContexts.length === 0 && missingKinds.length === 0 ? "pass" as const : "blocked" as const;
    if (status !== "pass") {
      const missing = [
        ...missingContexts.map((context) => `context ${context}`),
        ...missingKinds.map((kind) => `artifact ${kind}`),
      ].join(", ");
      blockers.push(`${apiCheck.id} is missing ${missing}.`);
    }
    return {
      id: apiCheck.id,
      foundryApi: apiCheck.foundryApi,
      requiredContexts: apiCheck.requiredContexts,
      requiredArtifactKinds: apiCheck.requiredArtifactKinds,
      observedContexts,
      observedArtifactKinds,
      status,
      reason: status === "pass" ? "The planned Foundry API check and required artifact coverage are present." : "The planned Foundry API check or required artifact coverage is incomplete.",
    };
  });

  return fixtureRoundEvidenceSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.fixture.round.evidence.audit",
    status: blockers.length === 0 ? "reviewable" : "blocked",
    evidenceClass: blockers.length === 0 ? "deterministic" : "blocked",
    readyClaim: false,
    noWrite: true,
    noRawData: true,
    target,
    fixturePlanId: plan.planId,
    receiptIds,
    contexts,
    artifacts,
    artifactBindings,
    checks,
    blockers: unique(blockers).slice(0, 30),
    notes: [
      "This manifest audits coverage and artifact metadata only; it never invokes a Foundry API or certifies live behavior.",
      "A reviewable package still requires the separate HarnessLaneReceiptSchema and M11 readiness certificate gates.",
    ],
  });
}

export function createBlockedFoundryFixtureRoundEvidence(reason: string): FoundryFixtureRoundEvidence {
  return blockedFallback(reason);
}

const harnessFoundryApi = "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread";
const harnessCheckApis = {
  "ready-lifecycle": "Hooks.once(\"ready\")",
  "target-fingerprint": "game.version + game.system.id + game.system.version",
  authority: "game.users.activeGM / User permissions",
  "native-operation": "native Foundry Document/embedded-document APIs",
  "authoritative-reread": "fromUuid / document collections / embedded-document getters",
  recovery: "transaction journal + authoritative reread",
  "cross-client": "User permissions + visible GM/Player3 clients",
} as const;

function roundHarnessFallback(reason: string): FoundryFixtureRoundHarnessAudit {
  const target = {
    fingerprintId: createStableDiceBoxId("fingerprint", "unknown"),
    foundryVersion: null,
    systemId: null,
    systemVersion: null,
  };
  const laneReceipt = HarnessLaneReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: createStableDiceBoxId("receipt", "fixture-round-harness-invalid"),
    laneId: "exact-runtime",
    status: "blocked",
    evidenceClass: "blocked",
    scope: "disposable-fixture",
    foundryApi: harnessFoundryApi,
    target,
    contexts: [],
    artifacts: [],
    checks: Object.entries(harnessCheckApis).map(([id, foundryApi]) => ({ id, status: "blocked" as const, foundryApi, reason })),
    noRawData: true,
    observedAt: new Date(0).toISOString(),
  });
  return fixtureRoundHarnessAuditSchema.parse({
    schemaVersion: "0.1.0",
    operation: "foundry.fixture.round.harness.audit",
    status: "blocked",
    evidenceClass: "blocked",
    readyClaim: false,
    noWrite: true,
    noRawData: true,
    laneReceipt,
    blockers: [reason.slice(0, 500)],
    notes: ["The M24 package was rejected before harness composition; no runtime claim or mutation was attempted."],
  });
}

function mappedHarnessCheck(
  evidence: FoundryFixtureRoundEvidence,
  id: keyof typeof harnessCheckApis,
  fallbackStatus: "blocked" | "unknown",
  fallbackReason: string,
): { readonly id: string; readonly status: "pass" | "blocked" | "unknown"; readonly foundryApi: string; readonly reason: string } {
  const coverageId = id === "authority" ? "active-gm" : id === "recovery" ? "timeout-recovery" : id;
  const coverage = evidence.checks.find((check) => check.id === coverageId);
  if (!coverage || coverage.status !== "pass") return { id, status: "blocked", foundryApi: harnessCheckApis[id], reason: fallbackReason };
  if (id === "authority" || id === "recovery" || id === "cross-client") {
    return { id, status: fallbackStatus, foundryApi: harnessCheckApis[id], reason: fallbackReason };
  }
  return { id, status: "pass", foundryApi: harnessCheckApis[id], reason: "The M24 coverage audit reports the planned Foundry API check and artifact coverage." };
}

/**
 * Carry an M24 coverage package into the canonical M14 exact-runtime lane.
 * The conversion is intentionally non-promoting: M24 is metadata/coverage
 * evidence, so authority, recovery, cross-client, and native operation cannot
 * become passing runtime checks here.
 */
export function createFixtureRoundHarnessAudit(
  input: FoundryFixtureRoundHarnessInput,
): FoundryFixtureRoundHarnessAudit {
  try {
    const profile = RuntimeProfileSchema.parse(input.profile);
    const evidence = fixtureRoundEvidenceSchema.parse(input.evidence);
    const fingerprint = createRuntimeFingerprint(profile);
    if (evidence.target.fingerprintId !== fingerprint.fingerprintId
      || evidence.target.foundryVersion !== profile.foundryVersion
      || evidence.target.systemId !== profile.systemId
      || evidence.target.systemVersion !== profile.systemVersion) {
      return roundHarnessFallback("M24 evidence target does not match the supplied runtime profile.");
    }
    if (evidence.artifacts.length > 20) return roundHarnessFallback("M24 evidence contains more than the M14 exact-runtime lane artifact limit.");
    const blockers = [
      "M24 coverage metadata cannot establish native Foundry operation or Activity.use execution.",
      "M24 coverage metadata cannot establish execution-time GM authority recheck or sender semantics.",
      "M24 coverage metadata cannot establish timeout recovery and authoritative post-operation reread.",
      "M24 coverage metadata cannot establish visible GM/Player3 cross-client delivery.",
      ...evidence.blockers,
    ];
    const checks = [
      mappedHarnessCheck(evidence, "ready-lifecycle", "blocked", "The ready lifecycle is not promoted from coverage metadata."),
      mappedHarnessCheck(evidence, "target-fingerprint", "blocked", "The target fingerprint is not promoted from incomplete coverage."),
      mappedHarnessCheck(evidence, "authority", "unknown", "Active-GM coverage is present only as metadata; execution-time authority recheck remains unknown."),
      { id: "native-operation", status: "blocked" as const, foundryApi: harnessCheckApis["native-operation"], reason: "M24 does not execute or certify a native Foundry operation." },
      mappedHarnessCheck(evidence, "authoritative-reread", "blocked", "Reread coverage is not promoted beyond the M24 metadata boundary."),
      mappedHarnessCheck(evidence, "recovery", "unknown", "Recovery coverage is present only as metadata; timeout outcome and transaction reread remain unknown."),
      mappedHarnessCheck(evidence, "cross-client", "unknown", "Cross-client coverage is present only as metadata; visible client delivery remains unknown."),
    ];
    const laneReceipt: HarnessLaneReceipt = HarnessLaneReceiptSchema.parse({
      schemaVersion: "0.1.0",
      receiptId: createStableDiceBoxId("receipt", `fixture-round-harness-${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}`),
      laneId: "exact-runtime",
      status: "blocked",
      evidenceClass: "blocked",
      scope: "disposable-fixture",
      foundryApi: harnessFoundryApi,
      target: {
        fingerprintId: fingerprint.fingerprintId,
        foundryVersion: profile.foundryVersion,
        systemId: profile.systemId,
        systemVersion: profile.systemVersion,
      },
      contexts: evidence.contexts,
      artifacts: evidence.artifacts,
      checks,
      noRawData: true,
      observedAt: profile.observedAt,
    });
    return fixtureRoundHarnessAuditSchema.parse({
      schemaVersion: "0.1.0",
      operation: "foundry.fixture.round.harness.audit",
      status: "blocked",
      evidenceClass: "blocked",
      readyClaim: false,
      noWrite: true,
      noRawData: true,
      laneReceipt,
      blockers: unique(blockers).slice(0, 20),
      notes: [
        "M24 artifact metadata is carried into the M14 lane without treating coverage as executed Foundry behavior.",
        "The exact-runtime receipt remains blocked by construction until a separate live full-function receipt proves operation, authority, reread, recovery, and cross-client behavior.",
      ],
    });
  } catch {
    return roundHarnessFallback("M24 evidence failed schema or target-binding validation.");
  }
}

function createPlan(): FoundryFixturePlan {
  return FoundryFixturePlanSchema.parse({
    schemaVersion: "0.1.0",
    planId: createStableDiceBoxId("plan", "foundry-fixture-m21"),
    operation: "foundry.fixture.plan",
    status: "blocked",
    evidenceClass: "deterministic",
    noWrite: true,
    mutation: "disabled",
    target: {
      foundryVersion: TARGET_FOUNDRY_VERSION,
      systemId: "dnd5e",
      systemVersion: TARGET_DND5E_VERSION,
      worldId: "dbx-test-world",
    },
    contexts: ["GM", "Player3"],
    resetPolicy: "owned-fixture-only",
    seeds: [
      { fixtureId: createStableDiceBoxId("fixture", "journal-observation"), semanticKind: "journal", purpose: "M21 JournalEntry observation seed.", foundryApis: ["Hooks.once(\"ready\")", "fromUuid", "game.journal.get"], rawPayload: false, mutation: "deferred-until-exact-runtime" },
      { fixtureId: createStableDiceBoxId("fixture", "activity-observation"), semanticKind: "item", purpose: "M21 D&D5e Activity observation seed.", foundryApis: ["fromUuid", "item.getEmbeddedDocument(\"Activity\", id)", "activity.use(usage, dialog, message)"], rawPayload: false, mutation: "deferred-until-exact-runtime" },
      { fixtureId: createStableDiceBoxId("fixture", "region-observation"), semanticKind: "region", purpose: "M21 Region/RegionBehavior observation seed.", foundryApis: ["fromUuid", "scene.getEmbeddedDocument(\"Region\", id)", "region.getEmbeddedCollection(\"RegionBehavior\")"], rawPayload: false, mutation: "deferred-until-exact-runtime" },
    ],
    apiChecks: [
      { id: "ready-lifecycle", foundryApi: "Hooks.once(\"ready\")", purpose: "Confirm ready lifecycle.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt"], status: "required", noWrite: true },
      { id: "target-fingerprint", foundryApi: "game.version + game.system.id + game.system.version", purpose: "Bind target fingerprint.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "active-gm", foundryApi: "game.users.activeGM / User permissions", purpose: "Observe authority.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "runtime-evidence-query", foundryApi: "game.diceboxCampaignHelper.query({ kind: \"runtime-evidence\" })", purpose: "Capture canonical runtime evidence.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "journal-observation", foundryApi: "fromUuid / game.journal.get / game.journal.contents", purpose: "Read JournalEntry state.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "journal-schema", foundryApi: "JournalEntry.create / entry.createEmbeddedDocuments(\"JournalEntryPage\", ...)", purpose: "Observe page schema presence.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "activity-observation", foundryApi: "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\", id)", purpose: "Read Activity state.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "activity-hooks", foundryApi: "dnd5e.preUseActivity / dnd5e.postUseActivity / Hooks", purpose: "Observe Activity hook surface.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt", "console"], status: "required", noWrite: true },
      { id: "active-effect-observation", foundryApi: "parent.getEmbeddedCollection(\"ActiveEffect\") / parent.getEmbeddedDocument(\"ActiveEffect\", id)", purpose: "Read ActiveEffect state.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "region-observation", foundryApi: "fromUuid / game.scenes.get / RegionDocument.shapes / RegionDocument.behaviors", purpose: "Read Region state.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "region-behavior-observation", foundryApi: "region.getEmbeddedCollection(\"RegionBehavior\") / CONFIG.RegionBehavior.dataModels / RegionBehaviorType.events", purpose: "Observe RegionBehavior surface.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "authoritative-reread", foundryApi: "fromUuid / document collections / embedded-document getters", purpose: "Reread bindings.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
      { id: "cross-client", foundryApi: "User permissions + visible GM/Player3 clients", purpose: "Compare two clients.", requiredContexts: ["GM", "Player3"], requiredArtifactKinds: ["runtime-receipt", "screenshot", "redacted-json"], status: "required", noWrite: true },
      { id: "timeout-recovery", foundryApi: "transaction journal + authoritative reread", purpose: "Recover unknown outcomes.", requiredContexts: ["GM"], requiredArtifactKinds: ["runtime-receipt", "redacted-json"], status: "required", noWrite: true },
    ],
    blockers: [{ id: "exact-foundry-installation", foundryApi: "game.version + game.system.id + game.system.version", reason: "Exact fixture evidence is externally gated." }],
    nextGates: ["Run the exact disposable fixture and retain target-bound redacted artifacts."] ,
  });
}

export { TARGET_DND5E_VERSION, TARGET_FOUNDRY_VERSION };
