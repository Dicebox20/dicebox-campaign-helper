import { z } from "zod";
import { StableDiceBoxIdSchema, type StableDiceBoxId } from "./identity.js";

export const PROPOSAL_BATCH_SCHEMA_VERSION = "0.1.0" as const;

const sha256Schema = z.string().regex(/^[0-9a-f]{64}$/);
const datetimeSchema = z.string().datetime({ offset: true });
const producerKinds = ["human", "campaign-director", "technical-builder", "project-store", "compiler", "foundry"] as const;
const reviewDomains = ["human-review", "repository-integration", "project-write", "foundry-runtime"] as const;
const targetAuthorityDomains = ["none", "local-project", "repository", "foundry-active-gm"] as const;
const actorRoles = ["requester", "reviewer", "gm", "system"] as const;
const riskLevels = ["low", "medium", "high", "critical"] as const;
const lifecycleStatuses = ["previewed", "approved", "rejected", "cancelled", "stale", "applying", "unknown-outcome", "committed", "recovered", "undone", "redone"] as const;
const transitions = ["preview", "approve", "reject", "edit", "cancel", "invalidate-stale", "begin-apply", "mark-unknown", "commit-after-reread", "recover-after-reread", "undo", "redo"] as const;

const jsonValueSchema: z.ZodType<unknown> = z.lazy(() => z.union([
  z.null(),
  z.string(),
  z.boolean(),
  z.number().finite(),
  z.array(jsonValueSchema),
  z.record(jsonValueSchema),
]));

export const proposalProducerSchema = z.object({
  kind: z.enum(producerKinds),
  sourceId: z.string().trim().min(1).max(240),
  provider: z.string().trim().min(1).max(120).nullable(),
}).strict();

export const proposalReviewAuthoritySchema = z.object({
  domain: z.enum(reviewDomains),
  requiredRole: z.enum(actorRoles),
}).strict();

export const proposalTargetAuthoritySchema = z.object({
  domain: z.enum(targetAuthorityDomains),
  requiredActiveGm: z.boolean(),
}).strict().superRefine((value, context) => {
  if (value.requiredActiveGm !== (value.domain === "foundry-active-gm")) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["requiredActiveGm"], message: "Active-GM requirement must agree with the target authority domain." });
  }
});

export const proposalBaseSchema = z.object({
  targetId: StableDiceBoxIdSchema,
  revision: z.number().int().nonnegative(),
  sha256: sha256Schema,
}).strict();

export const proposalCommandSchema = z.object({
  commandId: StableDiceBoxIdSchema,
  kind: z.string().trim().min(1).max(120),
  dependsOn: z.array(StableDiceBoxIdSchema).max(500),
  payload: z.record(jsonValueSchema),
}).strict();

const unsignedProposalBatchSchema = z.object({
  schemaVersion: z.literal(PROPOSAL_BATCH_SCHEMA_VERSION),
  batchId: StableDiceBoxIdSchema,
  revision: z.number().int().nonnegative(),
  previousBatchSha256: sha256Schema.nullable(),
  producer: proposalProducerSchema,
  reviewAuthority: proposalReviewAuthoritySchema,
  targetAuthority: proposalTargetAuthoritySchema,
  risk: z.enum(riskLevels),
  base: proposalBaseSchema,
  commands: z.array(proposalCommandSchema).min(1).max(500),
  createdAt: datetimeSchema,
}).strict();

export const proposalBatchSchema = unsignedProposalBatchSchema.extend({
  batchSha256: sha256Schema,
}).strict();

export const proposalActorSchema = z.object({
  actorId: z.string().trim().min(1).max(120),
  role: z.enum(actorRoles),
}).strict();

export const proposalRereadSchema = z.object({
  status: z.enum(["matched", "not-committed", "conflict", "unknown"]),
  targetId: StableDiceBoxIdSchema,
  revision: z.number().int().nonnegative().nullable(),
  sha256: sha256Schema.nullable(),
}).strict().superRefine((value, context) => {
  if (value.status === "unknown" && (value.revision !== null || value.sha256 !== null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "An unknown reread cannot claim revision or hash evidence." });
  }
  if (value.status !== "unknown" && (value.revision === null || value.sha256 === null)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: "A resolved reread requires revision and hash evidence." });
  }
});

export const proposalBatchReceiptSchema = z.object({
  schemaVersion: z.literal(PROPOSAL_BATCH_SCHEMA_VERSION),
  receiptId: StableDiceBoxIdSchema,
  sequence: z.number().int().nonnegative(),
  transition: z.enum(transitions),
  fromStatus: z.enum(lifecycleStatuses).nullable(),
  toStatus: z.enum(lifecycleStatuses),
  batchId: StableDiceBoxIdSchema,
  batchRevision: z.number().int().nonnegative(),
  batchSha256: sha256Schema,
  actor: proposalActorSchema,
  observedAt: datetimeSchema,
  reread: proposalRereadSchema.nullable(),
  notes: z.array(z.string().trim().min(1).max(500)).max(20),
}).strict();

export const proposalBatchHistorySchema = z.object({
  schemaVersion: z.literal(PROPOSAL_BATCH_SCHEMA_VERSION),
  batchId: StableDiceBoxIdSchema,
  status: z.enum(lifecycleStatuses),
  receipts: z.array(proposalBatchReceiptSchema).min(1).max(5000),
}).strict();

export type ProposalBatch = z.infer<typeof proposalBatchSchema>;
export type ProposalBatchInput = z.input<typeof unsignedProposalBatchSchema>;
export type ProposalBatchActor = z.infer<typeof proposalActorSchema>;
export type ProposalBatchHistory = z.infer<typeof proposalBatchHistorySchema>;
export type ProposalBatchReread = z.infer<typeof proposalRereadSchema>;
export type ProposalBatchReceipt = z.infer<typeof proposalBatchReceiptSchema>;

export class ProposalBatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProposalBatchError";
  }
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function canonicalize(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new ProposalBatchError("Proposal batches cannot contain non-finite numbers.");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  if (typeof value !== "object") throw new ProposalBatchError("Proposal batches must contain only JSON values.");
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort(compareStrings).map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`).join(",")}}`;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function canonicalCommandOrder(commands: readonly z.infer<typeof proposalCommandSchema>[]): string[] {
  const byId = new Map<string, z.infer<typeof proposalCommandSchema>>();
  for (const command of commands) {
    if (byId.has(command.commandId)) throw new ProposalBatchError(`Duplicate proposal command ${command.commandId}.`);
    if (command.dependsOn.some((dependency, index) => index > 0 && compareStrings(command.dependsOn[index - 1]!, dependency) >= 0)) {
      throw new ProposalBatchError(`Dependencies for ${command.commandId} must be unique and lexically ordered.`);
    }
    byId.set(command.commandId, command);
  }
  for (const command of commands) {
    for (const dependency of command.dependsOn) {
      if (!byId.has(dependency)) throw new ProposalBatchError(`Proposal command ${command.commandId} has missing dependency ${dependency}.`);
      if (dependency === command.commandId) throw new ProposalBatchError(`Proposal command ${command.commandId} cannot depend on itself.`);
    }
  }
  const remaining = new Set(byId.keys());
  const emitted = new Set<string>();
  const order: string[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining].filter((id) => byId.get(id)!.dependsOn.every((dependency) => emitted.has(dependency))).sort(compareStrings);
    if (ready.length === 0) throw new ProposalBatchError("Proposal command dependencies contain a cycle.");
    for (const id of ready) {
      remaining.delete(id);
      emitted.add(id);
      order.push(id);
    }
  }
  return order;
}

function assertCanonicalCommands(commands: readonly z.infer<typeof proposalCommandSchema>[]): void {
  const expected = canonicalCommandOrder(commands);
  if (commands.some((command, index) => command.commandId !== expected[index])) {
    throw new ProposalBatchError("Proposal commands must use canonical topological order with lexical tie-breaking.");
  }
}

function unsigned(batch: ProposalBatch): z.infer<typeof unsignedProposalBatchSchema> {
  const { batchSha256: _batchSha256, ...value } = batch;
  return value;
}

export function serializeProposalBatch(input: unknown): string {
  const batch = proposalBatchSchema.parse(input);
  assertCanonicalCommands(batch.commands);
  return canonicalize(batch);
}

export async function createProposalBatch(input: ProposalBatchInput): Promise<ProposalBatch> {
  const parsed = unsignedProposalBatchSchema.parse(input);
  if (parsed.revision === 0 && parsed.previousBatchSha256 !== null) throw new ProposalBatchError("An initial proposal batch cannot have a previous hash.");
  if (parsed.revision > 0 && parsed.previousBatchSha256 === null) throw new ProposalBatchError("An edited proposal batch must bind its previous hash.");
  assertCanonicalCommands(parsed.commands);
  return proposalBatchSchema.parse({ ...parsed, batchSha256: await sha256(canonicalize(parsed)) });
}

export async function validateProposalBatch(input: unknown): Promise<ProposalBatch> {
  const batch = proposalBatchSchema.parse(input);
  if (batch.revision === 0 && batch.previousBatchSha256 !== null) throw new ProposalBatchError("An initial proposal batch cannot have a previous hash.");
  if (batch.revision > 0 && batch.previousBatchSha256 === null) throw new ProposalBatchError("An edited proposal batch must bind its previous hash.");
  assertCanonicalCommands(batch.commands);
  const expected = await sha256(canonicalize(unsigned(batch)));
  if (expected !== batch.batchSha256) throw new ProposalBatchError("Proposal batch hash does not match its canonical contents.");
  return batch;
}

function receiptId(batchId: string, sequence: number): StableDiceBoxId {
  const local = batchId.split(":").at(-1) ?? "batch";
  return `dbx:proposal-receipt:${local}-${sequence}` as StableDiceBoxId;
}

function makeReceipt(input: {
  batch: ProposalBatch;
  history?: ProposalBatchHistory;
  transition: ProposalBatchReceipt["transition"];
  fromStatus: ProposalBatchReceipt["fromStatus"];
  toStatus: ProposalBatchReceipt["toStatus"];
  actor: ProposalBatchActor;
  observedAt: string;
  reread?: ProposalBatchReread | null;
  notes?: readonly string[];
}): ProposalBatchReceipt {
  return proposalBatchReceiptSchema.parse({
    schemaVersion: PROPOSAL_BATCH_SCHEMA_VERSION,
    receiptId: receiptId(input.batch.batchId, input.history?.receipts.length ?? 0),
    sequence: input.history?.receipts.length ?? 0,
    transition: input.transition,
    fromStatus: input.fromStatus,
    toStatus: input.toStatus,
    batchId: input.batch.batchId,
    batchRevision: input.batch.revision,
    batchSha256: input.batch.batchSha256,
    actor: input.actor,
    observedAt: input.observedAt,
    reread: input.reread ?? null,
    notes: [...(input.notes ?? [])],
  });
}

export async function previewProposalBatch(batchInput: unknown, actorInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const actor = proposalActorSchema.parse(actorInput);
  const receipt = makeReceipt({ batch, transition: "preview", fromStatus: null, toStatus: "previewed", actor, observedAt, notes: ["Preview is no-write and grants no target authority."] });
  return proposalBatchHistorySchema.parse({ schemaVersion: PROPOSAL_BATCH_SCHEMA_VERSION, batchId: batch.batchId, status: "previewed", receipts: [receipt] });
}

export const TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS: Readonly<Record<ProposalBatchHistory["status"], readonly ProposalBatchReceipt["transition"][]>> = {
  previewed: ["approve", "reject", "edit", "cancel", "invalidate-stale"],
  approved: ["cancel", "invalidate-stale", "begin-apply"],
  rejected: [],
  cancelled: [],
  stale: [],
  applying: ["mark-unknown", "commit-after-reread"],
  "unknown-outcome": ["recover-after-reread"],
  committed: ["undo"],
  recovered: [],
  undone: ["redo"],
  redone: ["undo"],
};

export const TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP = {
  matched: { resultStatus: "committed", sameHistoryExecutionRetryAllowed: false },
  "not-committed": { resultStatus: "recovered", sameHistoryExecutionRetryAllowed: false },
  conflict: { resultStatus: "recovered", sameHistoryExecutionRetryAllowed: false },
  unknown: { resultStatus: "unknown-outcome", sameHistoryExecutionRetryAllowed: false },
} as const satisfies Readonly<Record<ProposalBatchReread["status"], Readonly<{
  resultStatus: ProposalBatchHistory["status"];
  sameHistoryExecutionRetryAllowed: false;
}>>>;

export const TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS = {
  committed: { transition: "undo", destinationStatus: "undone", rereadStatus: "matched" },
  undone: { transition: "redo", destinationStatus: "redone", rereadStatus: "matched" },
} as const satisfies Readonly<Record<"committed" | "undone", Readonly<{
  transition: "undo" | "redo";
  destinationStatus: "undone" | "redone";
  rereadStatus: ProposalBatchReread["status"];
}>>>;

const allowedTransitions = TYPED_PROPOSAL_BATCH_ALLOWED_TRANSITIONS;

function assertCurrent(history: ProposalBatchHistory, batch: ProposalBatch): void {
  validateProposalBatchHistory(history, batch);
  const latest = history.receipts.at(-1)!;
  if (latest.batchRevision !== batch.revision || latest.batchSha256 !== batch.batchSha256) {
    throw new ProposalBatchError("Proposal history is bound to a different batch revision or hash.");
  }
}

function append(input: {
  history: ProposalBatchHistory;
  batch: ProposalBatch;
  transition: ProposalBatchReceipt["transition"];
  toStatus: ProposalBatchHistory["status"];
  actor: ProposalBatchActor;
  observedAt: string;
  reread?: ProposalBatchReread | null;
  notes?: readonly string[];
}): ProposalBatchHistory {
  assertCurrent(input.history, input.batch);
  if (!allowedTransitions[input.history.status].includes(input.transition)) {
    throw new ProposalBatchError(`Transition ${input.transition} is not allowed from ${input.history.status}.`);
  }
  const receipt = makeReceipt({
    batch: input.batch,
    history: input.history,
    transition: input.transition,
    fromStatus: input.history.status,
    toStatus: input.toStatus,
    actor: input.actor,
    observedAt: input.observedAt,
    reread: input.reread ?? null,
    notes: input.notes ?? [],
  });
  return proposalBatchHistorySchema.parse({ ...input.history, status: input.toStatus, receipts: [...input.history.receipts, receipt] });
}

function actor(input: unknown): ProposalBatchActor {
  return proposalActorSchema.parse(input);
}

function assertReviewer(batch: ProposalBatch, value: ProposalBatchActor): void {
  if (value.role !== batch.reviewAuthority.requiredRole) {
    throw new ProposalBatchError(`Review requires role ${batch.reviewAuthority.requiredRole}; ${value.role} cannot approve this batch.`);
  }
}

function assertFresh(batch: ProposalBatch, currentBaseInput: unknown): void {
  const current = proposalBaseSchema.parse(currentBaseInput);
  if (canonicalize(current) !== canonicalize(batch.base)) throw new ProposalBatchError("Proposal base is stale; invalidate it before further review or execution.");
}

export async function approveProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, currentBaseInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const history = proposalBatchHistorySchema.parse(historyInput);
  const reviewer = actor(actorInput);
  assertReviewer(batch, reviewer);
  assertFresh(batch, currentBaseInput);
  return append({ history, batch, transition: "approve", toStatus: "approved", actor: reviewer, observedAt, notes: ["Review approval does not grant target execution authority."] });
}

export async function rejectProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const history = proposalBatchHistorySchema.parse(historyInput);
  const reviewer = actor(actorInput);
  assertReviewer(batch, reviewer);
  return append({ history, batch, transition: "reject", toStatus: "rejected", actor: reviewer, observedAt });
}

export async function cancelProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "cancel", toStatus: "cancelled", actor: actor(actorInput), observedAt });
}

export async function invalidateStaleProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "invalidate-stale", toStatus: "stale", actor: actor(actorInput), observedAt, notes: ["The reviewed base no longer matches current authoritative state."] });
}

export async function editProposalBatch(input: {
  readonly history: unknown;
  readonly batch: unknown;
  readonly actor: unknown;
  readonly observedAt: string;
  readonly commands: ProposalBatchInput["commands"];
  readonly risk?: ProposalBatchInput["risk"];
}): Promise<{ readonly batch: ProposalBatch; readonly history: ProposalBatchHistory }> {
  const prior = await validateProposalBatch(input.batch);
  const history = proposalBatchHistorySchema.parse(input.history);
  const editor = actor(input.actor);
  assertCurrent(history, prior);
  if (!allowedTransitions[history.status].includes("edit")) throw new ProposalBatchError(`Transition edit is not allowed from ${history.status}.`);
  assertReviewer(prior, editor);
  const next = await createProposalBatch({ ...unsigned(prior), revision: prior.revision + 1, previousBatchSha256: prior.batchSha256, commands: input.commands, risk: input.risk ?? prior.risk, createdAt: input.observedAt });
  const receipt = makeReceipt({ batch: next, history, transition: "edit", fromStatus: history.status, toStatus: "previewed", actor: editor, observedAt: input.observedAt, notes: ["Editing creates a new hash-bound revision and invalidates approval of the prior revision."] });
  return { batch: next, history: proposalBatchHistorySchema.parse({ ...history, status: "previewed", receipts: [...history.receipts, receipt] }) };
}

export async function beginProposalApply(historyInput: unknown, batchInput: unknown, actorInput: unknown, currentBaseInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const executor = actor(actorInput);
  if (batch.targetAuthority.requiredActiveGm && executor.role !== "gm") throw new ProposalBatchError("Foundry execution requires the current active-GM role to be rechecked by the adapter.");
  assertFresh(batch, currentBaseInput);
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "begin-apply", toStatus: "applying", actor: executor, observedAt, notes: ["The producer adapter must recheck exact target authority before dispatch."] });
}

export async function markProposalOutcomeUnknown(historyInput: unknown, batchInput: unknown, actorInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "mark-unknown", toStatus: "unknown-outcome", actor: actor(actorInput), observedAt, notes: ["Timeout or transport uncertainty is outcome-unknown; retry is forbidden until authoritative reread."] });
}

function assertRereadTarget(batch: ProposalBatch, reread: ProposalBatchReread): void {
  if (reread.targetId !== batch.base.targetId) throw new ProposalBatchError("Authoritative reread target does not match the reviewed batch target.");
}

export async function commitProposalAfterReread(historyInput: unknown, batchInput: unknown, actorInput: unknown, rereadInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const reread = proposalRereadSchema.parse(rereadInput);
  assertRereadTarget(batch, reread);
  if (reread.status !== "matched") throw new ProposalBatchError("Commit requires an authoritative matched reread.");
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "commit-after-reread", toStatus: "committed", actor: actor(actorInput), observedAt, reread });
}

export async function recoverProposalAfterReread(historyInput: unknown, batchInput: unknown, actorInput: unknown, rereadInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const reread = proposalRereadSchema.parse(rereadInput);
  assertRereadTarget(batch, reread);
  const toStatus = TYPED_PROPOSAL_BATCH_RECOVERY_REREAD_RESULT_MAP[reread.status].resultStatus;
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: "recover-after-reread", toStatus, actor: actor(actorInput), observedAt, reread, notes: reread.status === "unknown" ? ["Authoritative reread remains unknown; retry is still forbidden."] : [] });
}

export async function undoProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, rereadInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const reread = proposalRereadSchema.parse(rereadInput);
  assertRereadTarget(batch, reread);
  if (reread.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed.rereadStatus) throw new ProposalBatchError("Undo history requires a matched post-undo authoritative reread.");
  const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.committed;
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: transition.transition, toStatus: transition.destinationStatus, actor: actor(actorInput), observedAt, reread });
}

export async function redoProposalBatch(historyInput: unknown, batchInput: unknown, actorInput: unknown, rereadInput: unknown, observedAt: string): Promise<ProposalBatchHistory> {
  const batch = await validateProposalBatch(batchInput);
  const reread = proposalRereadSchema.parse(rereadInput);
  assertRereadTarget(batch, reread);
  if (reread.status !== TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone.rereadStatus) throw new ProposalBatchError("Redo history requires a matched post-redo authoritative reread.");
  const transition = TYPED_PROPOSAL_BATCH_UNDO_REDO_TRANSITIONS.undone;
  return append({ history: proposalBatchHistorySchema.parse(historyInput), batch, transition: transition.transition, toStatus: transition.destinationStatus, actor: actor(actorInput), observedAt, reread });
}

export function validateProposalBatchHistory(historyInput: unknown, batchInput?: ProposalBatch): ProposalBatchHistory {
  const history = proposalBatchHistorySchema.parse(historyInput);
  let priorStatus: ProposalBatchReceipt["toStatus"] | null = null;
  let priorTime = Number.NEGATIVE_INFINITY;
  for (const [index, receipt] of history.receipts.entries()) {
    if (receipt.sequence !== index || receipt.receiptId !== receiptId(history.batchId, index)) throw new ProposalBatchError("Proposal history receipt sequence or identity drifted.");
    if (receipt.batchId !== history.batchId) throw new ProposalBatchError("Proposal history contains a foreign batch receipt.");
    if (receipt.fromStatus !== priorStatus) throw new ProposalBatchError("Proposal history status chain drifted.");
    if (index === 0 && receipt.transition !== "preview") throw new ProposalBatchError("Proposal history must begin with preview.");
    if (index > 0 && !allowedTransitions[receipt.fromStatus!].includes(receipt.transition)) throw new ProposalBatchError("Proposal history contains an illegal transition.");
    const observed = Date.parse(receipt.observedAt);
    if (observed < priorTime) throw new ProposalBatchError("Proposal history timestamps must be monotonic.");
    priorTime = observed;
    priorStatus = receipt.toStatus;
  }
  if (history.status !== priorStatus) throw new ProposalBatchError("Proposal history summary status does not match its final receipt.");
  if (batchInput) {
    const latest = history.receipts.at(-1)!;
    if (history.batchId !== batchInput.batchId || latest.batchRevision !== batchInput.revision || latest.batchSha256 !== batchInput.batchSha256) {
      throw new ProposalBatchError("Proposal history does not bind the supplied batch revision and hash.");
    }
  }
  return history;
}
