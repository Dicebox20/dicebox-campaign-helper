import { z } from "zod";
import { RuntimeProfileSchema, type RuntimeProfile } from "./capability.js";
import { createRuntimeFingerprint } from "./runtime-evidence.js";
import { HarnessArtifactSchema, type HarnessArtifact } from "./harness-evidence.js";
import { createStableDiceBoxId, StableDiceBoxIdSchema } from "./identity.js";

const stableHashSchema = z.string().regex(/^[0-9a-f]{64}$/);
const datetimeSchema = z.string().datetime({ offset: true });
const harnessContexts = ["system", "GM", "Player3"] as const;
const eventKinds = [
  "reset-owned-fixture",
  "profile-read",
  "gm-observe",
  "player3-observe",
  "apply-simulated",
  "binding-reread",
  "induce-unknown",
  "recovery-reread",
  "artifact-capture",
  "support-bundle",
] as const;
const eventStatuses = ["pass", "blocked", "unknown", "recovered"] as const;

export const disposableHarnessEventSchema = z.object({
  eventId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  kind: z.enum(eventKinds),
  context: z.enum(harnessContexts),
  operation: z.string().regex(/^[a-z][a-z0-9.-]{2,99}$/),
}).strict();

export type DisposableHarnessEvent = z.infer<typeof disposableHarnessEventSchema>;
export const DisposableHarnessEventSchema = disposableHarnessEventSchema;

const disposableHarnessTargetSchema = z.object({
  foundryVersion: z.string().min(1),
  systemId: z.string().min(1),
  systemVersion: z.string().min(1),
  worldId: StableDiceBoxIdSchema,
  profileFingerprintId: StableDiceBoxIdSchema,
}).strict();

export const disposableHarnessPlanSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  sessionId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  target: disposableHarnessTargetSchema,
  documentStableIds: z.array(StableDiceBoxIdSchema).max(500),
  resetPolicy: z.literal("owned-fixture-only"),
  foreignStatePolicy: z.literal("preserve"),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  noWrite: z.literal(true),
  events: z.array(disposableHarnessEventSchema).length(eventKinds.length),
}).strict().superRefine((plan, context) => {
  const sequences = plan.events.map((event) => event.sequence);
  if (sequences.some((sequence, index) => sequence !== index)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["events"], message: "Harness events must use contiguous canonical sequence numbers." });
  }
  if (new Set(plan.events.map((event) => event.eventId)).size !== plan.events.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["events"], message: "Harness event IDs must be unique." });
  }
  if (new Set(plan.documentStableIds).size !== plan.documentStableIds.length) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["documentStableIds"], message: "Harness document stable IDs must be unique." });
  }
  const kinds = plan.events.map((event) => event.kind);
  if (kinds.some((kind, index) => kind !== eventKinds[index])) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["events"], message: "Harness events must remain in the governed lifecycle order." });
  }
  const requiredContexts: readonly [number, DisposableHarnessEvent["context"]][] = [
    [0, "system"], [1, "system"], [2, "GM"], [3, "Player3"], [4, "system"],
    [5, "system"], [6, "system"], [7, "system"], [8, "system"], [9, "system"],
  ];
  for (const [index, expected] of requiredContexts) {
    if (plan.events[index]?.context !== expected) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["events", index, "context"], message: `Harness ${eventKinds[index]} event has the wrong context.` });
    }
  }
});

export type DisposableHarnessPlan = z.infer<typeof disposableHarnessPlanSchema>;
export const DisposableHarnessPlanSchema = disposableHarnessPlanSchema;

const resetObservationSchema = z.object({
  status: z.enum(["reset", "blocked"]),
  fixtureId: StableDiceBoxIdSchema,
  ownedOnly: z.literal(true),
  foreignStatePreserved: z.literal(true),
  noWrite: z.literal(true),
  source: z.string().min(1).max(160),
}).strict();

const profileObservationSchema = z.object({
  status: z.enum(["observed", "blocked", "unknown"]),
  fingerprintId: StableDiceBoxIdSchema,
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const contextObservationSchema = z.object({
  status: z.enum(["observed", "blocked", "unknown"]),
  context: z.enum(["GM", "Player3"]),
  fingerprintId: StableDiceBoxIdSchema,
  authority: z.enum(["observed", "unknown", "not-applicable"]),
  stableBindingIds: z.array(StableDiceBoxIdSchema).max(500),
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const applyObservationSchema = z.object({
  status: z.enum(["simulated-committed", "blocked", "unknown"]),
  appliedStableIds: z.array(StableDiceBoxIdSchema).max(500),
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const bindingObservationSchema = z.object({
  status: z.enum(["matched", "blocked", "unknown"]),
  bindingStableIds: z.array(StableDiceBoxIdSchema).max(500),
  bindingDigest: stableHashSchema.nullable(),
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const unknownObservationSchema = z.object({
  status: z.literal("unknown"),
  operationId: StableDiceBoxIdSchema,
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const recoveryObservationSchema = z.object({
  status: z.enum(["recovered", "not-found", "conflict", "blocked", "unknown"]),
  noRetry: z.literal(true),
  bindingDigest: stableHashSchema.nullable(),
  source: z.string().min(1).max(160),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
}).strict();

const eventReceiptSchema = z.object({
  eventId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  kind: z.enum(eventKinds),
  context: z.enum(harnessContexts),
  status: z.enum(eventStatuses),
}).strict();

const supportBundleSchema = z.object({
  artifactIds: z.array(StableDiceBoxIdSchema).max(20),
  sha256: stableHashSchema,
}).strict();

export const disposableHarnessSessionReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  sessionId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  planSha256: stableHashSchema,
  target: disposableHarnessTargetSchema,
  status: z.enum(["pass-local-foundation", "blocked"]),
  evidenceClass: z.enum(["deterministic", "blocked"]),
  events: z.array(eventReceiptSchema).length(eventKinds.length),
  contexts: z.array(z.enum(["GM", "Player3"])).max(2),
  artifacts: z.array(HarnessArtifactSchema).max(20),
  supportBundle: supportBundleSchema,
  blockers: z.array(z.string().min(1).max(500)).max(30),
  redacted: z.literal(true),
  noWrite: z.literal(true),
  foreignStatePreserved: z.literal(true),
  mutation: z.literal("disabled-until-exact-runtime-gate"),
  readyClaim: z.literal(false),
  observedAt: datetimeSchema,
  sessionSha256: stableHashSchema,
}).strict();

export type DisposableHarnessSessionReceipt = z.infer<typeof disposableHarnessSessionReceiptSchema>;
export const DisposableHarnessSessionReceiptSchema = disposableHarnessSessionReceiptSchema;

export interface DisposableHarnessSessionAdapter {
  resetOwnedFixture(plan: DisposableHarnessPlan): Promise<unknown>;
  readProfile(plan: DisposableHarnessPlan): Promise<unknown>;
  observeContext(context: "GM" | "Player3", plan: DisposableHarnessPlan): Promise<unknown>;
  applyRepresentativeSlice(plan: DisposableHarnessPlan): Promise<unknown>;
  rereadBindings(phase: "before-unknown" | "after-recovery", plan: DisposableHarnessPlan): Promise<unknown>;
  induceUnknownOutcome(plan: DisposableHarnessPlan): Promise<unknown>;
  recoverUnknownOutcome(plan: DisposableHarnessPlan): Promise<unknown>;
  captureArtifacts(plan: DisposableHarnessPlan): Promise<unknown>;
}

export interface CreateDisposableHarnessPlanInput {
  readonly sessionId: string;
  readonly planId: string;
  readonly worldId: string;
  readonly profile: RuntimeProfile;
  readonly documentStableIds?: readonly string[];
}

export interface CreateDisposableHarnessSessionInput {
  readonly profile: RuntimeProfile;
  readonly plan: DisposableHarnessPlan;
  readonly adapter: DisposableHarnessSessionAdapter;
  readonly observedAt?: string;
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error("Cannot canonicalize an undefined disposable-harness value.");
    return encoded;
  }
  if (Array.isArray(value)) return `[${value.map((entry) => canonicalize(entry)).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

async function sha256Text(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function sessionLocalPart(id: string): string {
  return id.replaceAll(":", "-");
}

function eventFor(sessionId: string, sequence: number, kind: typeof eventKinds[number], context: DisposableHarnessEvent["context"], operation: string): DisposableHarnessEvent {
  return disposableHarnessEventSchema.parse({
    eventId: createStableDiceBoxId("harness-event", `${sessionLocalPart(sessionId)}-${sequence}-${kind}`),
    sequence,
    kind,
    context,
    operation,
  });
}

export function createDisposableHarnessPlan(input: CreateDisposableHarnessPlanInput): DisposableHarnessPlan {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const fingerprint = createRuntimeFingerprint(profile);
  const documentStableIds = [...(input.documentStableIds ?? [])]
    .map((value) => StableDiceBoxIdSchema.parse(value))
    .sort(compareStrings);
  if (new Set(documentStableIds).size !== documentStableIds.length) throw new Error("Harness document stable IDs must be unique.");
  return disposableHarnessPlanSchema.parse({
    schemaVersion: "0.1.0",
    sessionId: StableDiceBoxIdSchema.parse(input.sessionId),
    planId: StableDiceBoxIdSchema.parse(input.planId),
    target: {
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      worldId: StableDiceBoxIdSchema.parse(input.worldId),
      profileFingerprintId: fingerprint.fingerprintId,
    },
    documentStableIds,
    resetPolicy: "owned-fixture-only",
    foreignStatePolicy: "preserve",
    mutation: "disabled-until-exact-runtime-gate",
    noWrite: true,
    events: [
      eventFor(input.sessionId, 0, "reset-owned-fixture", "system", "foundry.fixture.reset.owned"),
      eventFor(input.sessionId, 1, "profile-read", "system", "foundry.runtime.probe"),
      eventFor(input.sessionId, 2, "gm-observe", "GM", "foundry.context.observe"),
      eventFor(input.sessionId, 3, "player3-observe", "Player3", "foundry.context.observe"),
      eventFor(input.sessionId, 4, "apply-simulated", "system", "foundry.document.apply.simulated"),
      eventFor(input.sessionId, 5, "binding-reread", "system", "foundry.binding.reread"),
      eventFor(input.sessionId, 6, "induce-unknown", "system", "foundry.operation.unknown"),
      eventFor(input.sessionId, 7, "recovery-reread", "system", "foundry.operation.recover"),
      eventFor(input.sessionId, 8, "artifact-capture", "system", "harness.artifact.capture"),
      eventFor(input.sessionId, 9, "support-bundle", "system", "harness.support-bundle.compose"),
    ],
  });
}

export function serializeDisposableHarnessPlan(input: unknown): string {
  return canonicalize(disposableHarnessPlanSchema.parse(input));
}

function eventReceipt(event: DisposableHarnessEvent, status: DisposableHarnessSessionReceipt["events"][number]["status"]): DisposableHarnessSessionReceipt["events"][number] {
  return { eventId: event.eventId, sequence: event.sequence, kind: event.kind, context: event.context, status };
}

function blocker(blockers: string[], message: string): void {
  if (!blockers.includes(message)) blockers.push(message);
}

function bindingIdsMatch(observed: readonly string[], expected: readonly string[]): boolean {
  return canonicalize([...observed].sort(compareStrings)) === canonicalize([...expected].sort(compareStrings));
}

function redactedArtifacts(input: unknown, blockers: string[]): HarnessArtifact[] {
  if (!Array.isArray(input)) {
    blocker(blockers, "Artifact capture did not return a list of redacted artifact metadata.");
    return [];
  }
  const artifacts: HarnessArtifact[] = [];
  for (const [index, value] of input.entries()) {
    try {
      const parsed = HarnessArtifactSchema.parse(value);
      artifacts.push({
        artifactId: parsed.artifactId,
        kind: parsed.kind,
        sha256: parsed.sha256,
        label: `artifact-${parsed.kind}-${index + 1}`,
      });
    } catch {
      blocker(blockers, "Artifact capture contained invalid or non-redacted metadata.");
    }
  }
  if (artifacts.length === 0) blocker(blockers, "Disposable harness support requires at least one redacted artifact.");
  if (!artifacts.some((artifact) => artifact.kind === "redacted-json")) blocker(blockers, "Disposable harness support requires redacted JSON metadata.");
  return artifacts;
}

function unsignedReceipt(receipt: Omit<DisposableHarnessSessionReceipt, "sessionSha256">): Omit<DisposableHarnessSessionReceipt, "sessionSha256"> {
  return receipt;
}

export async function createDisposableHarnessSession(input: CreateDisposableHarnessSessionInput): Promise<DisposableHarnessSessionReceipt> {
  const profile = RuntimeProfileSchema.parse(input.profile);
  const plan = disposableHarnessPlanSchema.parse(input.plan);
  const observedAt = input.observedAt ?? profile.observedAt ?? new Date(0).toISOString();
  datetimeSchema.parse(observedAt);
  const fingerprint = createRuntimeFingerprint(profile);
  const planSha256 = await sha256Text(serializeDisposableHarnessPlan(plan));
  const blockers: string[] = [];
  if (plan.target.profileFingerprintId !== fingerprint.fingerprintId) blocker(blockers, "Disposable harness plan fingerprint does not match the supplied runtime profile.");
  if (plan.target.foundryVersion !== profile.foundryVersion || plan.target.systemId !== profile.systemId || plan.target.systemVersion !== profile.systemVersion) {
    blocker(blockers, "Disposable harness plan target does not match the supplied runtime profile.");
  }
  if (!fingerprint.exactTargetMatch) blocker(blockers, "The supplied profile is not the exact Foundry 14.367 / D&D5e 5.3.3 target.");

  const events: DisposableHarnessSessionReceipt["events"] = [];
  const record = (event: DisposableHarnessEvent, status: DisposableHarnessSessionReceipt["events"][number]["status"]) => events.push(eventReceipt(event, status));
  const call = async (event: DisposableHarnessEvent, action: () => Promise<unknown>): Promise<unknown | null> => {
    try {
      return await action();
    } catch {
      blocker(blockers, `Disposable harness ${event.kind} adapter call failed; outcome is not promoted.`);
      return null;
    }
  };

  const reset = resetObservationSchema.safeParse(await call(plan.events[0]!, () => input.adapter.resetOwnedFixture(plan)));
  if (!reset.success) {
    record(plan.events[0]!, "blocked");
    blocker(blockers, "Owned-fixture reset observation was invalid or unavailable.");
  } else if (reset.data.status !== "reset") {
    record(plan.events[0]!, "blocked");
    blocker(blockers, "Owned-fixture reset did not report reset status.");
  } else record(plan.events[0]!, "pass");

  const profileRead = profileObservationSchema.safeParse(await call(plan.events[1]!, () => input.adapter.readProfile(plan)));
  if (!profileRead.success || profileRead.data.status !== "observed") {
    record(plan.events[1]!, profileRead.success && profileRead.data.status === "unknown" ? "unknown" : "blocked");
    blocker(blockers, "Runtime profile read was not observed.");
  } else {
    if (profileRead.data.fingerprintId !== fingerprint.fingerprintId) blocker(blockers, "Runtime profile read fingerprint did not match the canonical profile.");
    record(plan.events[1]!, "pass");
  }

  const contexts: Array<"GM" | "Player3"> = [];
  for (const [index, context] of [[2, "GM"], [3, "Player3"]] as const) {
    const observation = contextObservationSchema.safeParse(await call(plan.events[index]!, () => input.adapter.observeContext(context, plan)));
    if (!observation.success || observation.data.status !== "observed" || observation.data.context !== context) {
      record(plan.events[index]!, observation.success && observation.data.status === "unknown" ? "unknown" : "blocked");
      blocker(blockers, `${context} context observation was not valid and current state is not promoted.`);
      continue;
    }
    if (observation.data.fingerprintId !== fingerprint.fingerprintId) blocker(blockers, `${context} context fingerprint did not match the canonical profile.`);
    if (context === "GM" && observation.data.authority !== "observed") blocker(blockers, "GM authority was not observed at the harness context boundary.");
    if (context === "Player3" && observation.data.authority !== "not-applicable") blocker(blockers, "Player3 observation must not be treated as execution authority.");
    if (!bindingIdsMatch(observation.data.stableBindingIds, plan.documentStableIds)) blocker(blockers, `${context} context stable bindings did not match the plan scope.`);
    contexts.push(context);
    record(plan.events[index]!, "pass");
  }

  const applied = applyObservationSchema.safeParse(await call(plan.events[4]!, () => input.adapter.applyRepresentativeSlice(plan)));
  if (!applied.success || applied.data.status !== "simulated-committed") {
    record(plan.events[4]!, applied.success && applied.data.status === "unknown" ? "unknown" : "blocked");
    blocker(blockers, "The representative slice was not recorded as a no-write simulated application.");
  } else {
    if (!bindingIdsMatch(applied.data.appliedStableIds, plan.documentStableIds)) blocker(blockers, "The simulated application did not cover the exact plan stable-ID scope.");
    record(plan.events[4]!, "pass");
  }

  const beforeRecovery = bindingObservationSchema.safeParse(await call(plan.events[5]!, () => input.adapter.rereadBindings("before-unknown", plan)));
  if (!beforeRecovery.success || beforeRecovery.data.status !== "matched") {
    record(plan.events[5]!, beforeRecovery.success && beforeRecovery.data.status === "unknown" ? "unknown" : "blocked");
    blocker(blockers, "Binding reread before the induced unknown outcome did not match.");
  } else {
    if (!bindingIdsMatch(beforeRecovery.data.bindingStableIds, plan.documentStableIds)) blocker(blockers, "Binding reread before the induced unknown outcome did not cover the plan scope.");
    record(plan.events[5]!, "pass");
  }

  const unknown = unknownObservationSchema.safeParse(await call(plan.events[6]!, () => input.adapter.induceUnknownOutcome(plan)));
  if (!unknown.success) {
    record(plan.events[6]!, "blocked");
    blocker(blockers, "The harness did not produce an explicit unknown-outcome observation.");
  } else record(plan.events[6]!, "unknown");

  const recovery = recoveryObservationSchema.safeParse(await call(plan.events[7]!, () => input.adapter.recoverUnknownOutcome(plan)));
  if (!recovery.success || recovery.data.status !== "recovered") {
    record(plan.events[7]!, recovery.success && recovery.data.status === "unknown" ? "unknown" : "blocked");
    blocker(blockers, "Unknown-outcome recovery did not complete as a no-retry authoritative reread.");
  } else {
    if (beforeRecovery.success && beforeRecovery.data.bindingDigest !== null
      && recovery.data.bindingDigest !== beforeRecovery.data.bindingDigest) {
      blocker(blockers, "Unknown-outcome recovery reread did not match the pre-unknown binding digest.");
    }
    record(plan.events[7]!, "recovered");
  }

  const artifacts = redactedArtifacts(await call(plan.events[8]!, () => input.adapter.captureArtifacts(plan)), blockers);
  record(plan.events[8]!, artifacts.length > 0 ? "pass" : "blocked");

  const supportBundleSha256 = await sha256Text(canonicalize({
    sessionId: plan.sessionId,
    planId: plan.planId,
    planSha256,
    events,
    artifacts,
  }));
  const supportBundle = { artifactIds: artifacts.map((artifact) => artifact.artifactId), sha256: supportBundleSha256 };
  record(plan.events[9]!, "pass");
  const status = blockers.length === 0 ? "pass-local-foundation" as const : "blocked" as const;
  const base = disposableHarnessSessionReceiptSchema.omit({ sessionSha256: true }).parse({
    schemaVersion: "0.1.0",
    sessionId: plan.sessionId,
    planId: plan.planId,
    planSha256,
    target: plan.target,
    status,
    evidenceClass: status === "blocked" ? "blocked" : "deterministic",
    events,
    contexts,
    artifacts,
    supportBundle,
    blockers,
    redacted: true,
    noWrite: true,
    foreignStatePreserved: true,
    mutation: "disabled-until-exact-runtime-gate",
    readyClaim: false,
    observedAt,
  });
  const sessionSha256 = await sha256Text(canonicalize(unsignedReceipt(base)));
  return disposableHarnessSessionReceiptSchema.parse({ ...base, sessionSha256 });
}

export async function verifyDisposableHarnessSessionReceipt(input: unknown): Promise<boolean> {
  const receipt = disposableHarnessSessionReceiptSchema.parse(input);
  const { sessionSha256: _sessionSha256, ...base } = receipt;
  const expected = await sha256Text(canonicalize(base));
  if (expected !== receipt.sessionSha256) throw new Error("Disposable harness session receipt hash does not match its canonical contents.");
  if (receipt.events.some((event, index) => event.sequence !== index || event.kind !== eventKinds[index])) throw new Error("Disposable harness session receipt events are not in canonical order.");
  if (new Set(receipt.events.map((event) => event.eventId)).size !== receipt.events.length) throw new Error("Disposable harness session receipt event IDs are not unique.");
  if (receipt.status === "pass-local-foundation" && receipt.blockers.length > 0) throw new Error("A passing disposable harness session cannot carry blockers.");
  if (receipt.status === "pass-local-foundation" && receipt.evidenceClass !== "deterministic") throw new Error("A passing disposable harness session must remain deterministic evidence.");
  return true;
}

export function serializeDisposableHarnessSessionReceipt(input: unknown): string {
  return canonicalize(disposableHarnessSessionReceiptSchema.parse(input));
}
