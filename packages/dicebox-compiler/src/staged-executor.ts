import { z } from "zod";
import {
  RuntimeBindingSchema,
  StableDiceBoxIdSchema,
  createStableDiceBoxId,
  type Result,
  type RuntimeBinding,
  type StableDiceBoxId,
} from "@dicebox/core";
import {
  canonicalizeFoundryIr,
  validateFoundryIrPlan,
  verifyFoundryIrPlanHash,
  type FoundryIrDocument,
  type FoundryIrPlan,
} from "./foundry-ir.js";

const documentTypes = ["Scene", "Level", "Wall", "Region", "Tile", "JournalEntry"] as const;
const operations = ["create", "update"] as const;
const stages = ["previewed", "approved", "apply-ready", "applying", "unknown-outcome", "committed", "recovered"] as const;
const resolutions = ["pending", "committed", "not-committed", "conflict"] as const;
const readbackStatuses = ["matched", "not-found", "conflict", "unknown"] as const;

const stableHashSchema = z.string().regex(/^[0-9a-f]{64}$/);
const datetimeSchema = z.string().datetime({ offset: true });

export const stagedBindingRecordSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  stableId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  planSha256: stableHashSchema,
  documentType: z.enum(documentTypes),
  binding: RuntimeBindingSchema,
  committedAt: datetimeSchema,
}).strict();

export type StagedBindingRecord = z.infer<typeof stagedBindingRecordSchema>;

export const stagedBindingTableSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  entries: z.array(stagedBindingRecordSchema).max(500),
}).strict();

export type StagedBindingTable = z.infer<typeof stagedBindingTableSchema>;

export const stagedExecutionEntrySchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  transactionId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  recoveryKey: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  planSha256: stableHashSchema,
  stableId: StableDiceBoxIdSchema,
  documentType: z.enum(documentTypes),
  operation: z.enum(operations),
  dependencies: z.array(StableDiceBoxIdSchema).max(500),
  stage: z.enum(stages),
  resolution: z.enum(resolutions),
  attempt: z.number().int().nonnegative(),
  binding: RuntimeBindingSchema.nullable(),
  approvedByUserId: z.string().trim().min(1).max(100).nullable(),
  observedAt: datetimeSchema,
  notes: z.array(z.string()),
}).strict();

export type StagedExecutionEntry = z.infer<typeof stagedExecutionEntrySchema>;

export const stagedReadbackSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  stableId: StableDiceBoxIdSchema,
  planId: StableDiceBoxIdSchema,
  planSha256: stableHashSchema,
  status: z.enum(readbackStatuses),
  binding: RuntimeBindingSchema.nullable(),
  observedAt: datetimeSchema,
  foreignStatePreserved: z.literal(true),
}).strict();

export type StagedReadback = z.infer<typeof stagedReadbackSchema>;

export interface StagedExecutionAdapter {
  readonly adapterId: string;
  create(
    document: FoundryIrDocument,
    dependencyBindings: readonly StagedBindingRecord[],
    idempotencyKey: string,
  ): Promise<Result<RuntimeBinding>>;
  update(
    document: FoundryIrDocument,
    binding: RuntimeBinding,
    dependencyBindings: readonly StagedBindingRecord[],
    idempotencyKey: string,
  ): Promise<Result<RuntimeBinding>>;
  read(document: FoundryIrDocument, binding: RuntimeBinding | null): Promise<Result<StagedReadback>>;
}

export const stagedExecutionReceiptSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  receiptId: StableDiceBoxIdSchema,
  operation: z.enum(["staged-foundry-ir.execute", "staged-foundry-ir.recover"]),
  status: z.enum(["committed", "unknown", "blocked", "recovered"]),
  planId: StableDiceBoxIdSchema,
  planSha256: stableHashSchema,
  committedStableIds: z.array(StableDiceBoxIdSchema).max(500),
  unresolvedStableIds: z.array(StableDiceBoxIdSchema).max(500),
  idempotencyKeys: z.array(StableDiceBoxIdSchema).max(500),
  recoveryKeys: z.array(StableDiceBoxIdSchema).max(500),
  blockers: z.array(z.string().min(1)).max(100),
  adapterBoundary: z.literal("injected-adapter-only"),
  noSameBatchReferences: z.literal(true),
  authoritativeReread: z.boolean(),
  unknownOutcome: z.boolean(),
  foreignStatePreserved: z.literal(true),
  readyClaim: z.literal(false),
  observedAt: datetimeSchema,
  notes: z.array(z.string()),
}).strict();

export type StagedExecutionReceipt = z.infer<typeof stagedExecutionReceiptSchema>;

export interface BindingTablePersistence {
  read(): Promise<string>;
  write(serialized: string): Promise<void>;
}

export interface StagedBindingTableStore {
  load(): Promise<Result<StagedBindingTableHandle>>;
  get(stableId: string): Promise<Result<StagedBindingRecord | null>>;
  entries(): Promise<Result<readonly StagedBindingRecord[]>>;
  upsert(input: unknown): Promise<Result<StagedBindingRecord>>;
}

export interface StagedBindingTableHandle {
  readonly table: StagedBindingTable;
  get(stableId: string): StagedBindingRecord | null;
  entries(): readonly StagedBindingRecord[];
  upsert(input: unknown): Result<StagedBindingRecord>;
  toJSON(): string;
}

function failure(code: "INVALID_INPUT" | "FORBIDDEN" | "NOT_READY" | "UNAVAILABLE" | "UNKNOWN_OUTCOME", message: string, retry: "never" | "after-reread" | "safe-to-retry" = "never"): Result<never> {
  return { ok: false, error: { code, message, retry } };
}

function success<T>(value: T): Result<T> {
  return { ok: true, value };
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sortedUnique(values: readonly string[], label: string): string[] {
  if (new Set(values).size !== values.length) throw new Error(`${label} must contain unique values.`);
  return [...values].sort(compareStrings);
}

function assertCanonicalTable(table: StagedBindingTable): void {
  const ids = table.entries.map((entry) => entry.stableId);
  if (ids.some((value, index) => index > 0 && compareStrings(ids[index - 1]!, value) >= 0)) {
    throw new Error("Staged binding table entries must be sorted uniquely by stable ID.");
  }
  for (const entry of table.entries) {
    if (entry.binding.semantic.id !== entry.stableId) throw new Error("Staged binding semantic and runtime binding IDs must match.");
    if (entry.binding.documentType !== entry.documentType) throw new Error("Staged binding and document types must match.");
  }
}

function parseTable(input: unknown): StagedBindingTable {
  const parsed = stagedBindingTableSchema.parse(input);
  assertCanonicalTable(parsed);
  return parsed;
}

export function serializeStagedBindingTable(input: unknown): string {
  return canonicalizeFoundryIr(parseTable(input));
}

class InMemoryStagedBindingTable implements StagedBindingTableHandle {
  private readonly byStableId = new Map<string, StagedBindingRecord>();

  constructor(input: unknown = { schemaVersion: "0.1.0", entries: [] }) {
    const table = parseTable(input);
    for (const entry of table.entries) this.byStableId.set(entry.stableId, entry);
  }

  get table(): StagedBindingTable {
    return {
      schemaVersion: "0.1.0",
      entries: [...this.entries()],
    };
  }

  get(stableId: string): StagedBindingRecord | null {
    return this.byStableId.get(stableId) ?? null;
  }

  entries(): readonly StagedBindingRecord[] {
    return Object.freeze([...this.byStableId.values()].sort((left, right) => compareStrings(left.stableId, right.stableId)));
  }

  upsert(input: unknown): Result<StagedBindingRecord> {
    const parsed = stagedBindingRecordSchema.safeParse(input);
    if (!parsed.success) return failure("INVALID_INPUT", "Staged binding does not match the strict schema.");
    if (parsed.data.binding.semantic.id !== parsed.data.stableId || parsed.data.binding.documentType !== parsed.data.documentType) {
      return failure("FORBIDDEN", "Staged binding identity does not match its stable ID and document type.");
    }
    const existing = this.byStableId.get(parsed.data.stableId);
    if (existing && (existing.binding.uuid !== parsed.data.binding.uuid || existing.binding.documentId !== parsed.data.binding.documentId)) {
      return failure("FORBIDDEN", "A different runtime binding already owns this stable ID; foreign state is preserved.");
    }
    this.byStableId.set(parsed.data.stableId, parsed.data);
    return success(parsed.data);
  }

  toJSON(): string {
    return serializeStagedBindingTable(this.table);
  }
}

export function createStagedBindingTable(input: unknown = { schemaVersion: "0.1.0", entries: [] }): StagedBindingTableHandle {
  return new InMemoryStagedBindingTable(input);
}

export function createStagedBindingTableStore(persistence: BindingTablePersistence): StagedBindingTableStore {
  let cached: InMemoryStagedBindingTable | undefined;
  let queue: Promise<unknown> = Promise.resolve();

  function serialized<T>(operation: () => Promise<Result<T>>): Promise<Result<T>> {
    const next = queue.then(operation, operation);
    queue = next.then(() => undefined, () => undefined);
    return next;
  }

  async function loadUnlocked(): Promise<Result<StagedBindingTableHandle>> {
    if (cached) return success(cached);
    let raw: string;
    try {
      raw = await persistence.read();
    } catch {
      return failure("UNAVAILABLE", "Staged binding table could not be read; no binding was promoted.", "after-reread");
    }
    try {
      cached = new InMemoryStagedBindingTable(raw ? JSON.parse(raw) : undefined);
      return success(cached);
    } catch {
      return failure("INVALID_INPUT", "Staged binding table is malformed; no binding was exposed.");
    }
  }

  return {
    load: () => serialized(loadUnlocked),
    get: (stableId) => serialized(async () => {
      const loaded = await loadUnlocked();
      return loaded.ok ? success(loaded.value.get(stableId)) : loaded;
    }),
    entries: () => serialized(async () => {
      const loaded = await loadUnlocked();
      return loaded.ok ? success(loaded.value.entries()) : loaded;
    }),
    upsert: (input) => serialized(async () => {
      const loaded = await loadUnlocked();
      if (!loaded.ok) return loaded;
      const candidate = new InMemoryStagedBindingTable(loaded.value.table);
      const updated = candidate.upsert(input);
      if (!updated.ok) return updated;
      try {
        await persistence.write(candidate.toJSON());
      } catch {
        cached = undefined;
        return failure("UNKNOWN_OUTCOME", "Binding-table persistence may have committed; reread before retry.", "after-reread");
      }
      cached = candidate;
      return updated;
    }),
  };
}

const transitions: Readonly<Record<StagedExecutionEntry["stage"], readonly StagedExecutionEntry["stage"][]>> = {
  previewed: ["approved"],
  approved: ["apply-ready"],
  "apply-ready": ["applying"],
  applying: ["unknown-outcome", "committed"],
  "unknown-outcome": ["unknown-outcome", "committed", "recovered"],
  committed: [],
  recovered: [],
};

function sameTransaction(left: StagedExecutionEntry, right: StagedExecutionEntry): boolean {
  return left.transactionId === right.transactionId
    && left.idempotencyKey === right.idempotencyKey
    && left.recoveryKey === right.recoveryKey
    && left.planId === right.planId
    && left.planSha256 === right.planSha256
    && left.stableId === right.stableId
    && left.documentType === right.documentType
    && left.operation === right.operation
    && canonicalizeFoundryIr(left.dependencies) === canonicalizeFoundryIr(right.dependencies);
}

export class StagedExecutionJournal {
  private readonly histories = new Map<string, StagedExecutionEntry[]>();

  append(input: unknown): Result<{ readonly entry: StagedExecutionEntry; readonly inserted: boolean }> {
    const parsed = stagedExecutionEntrySchema.safeParse(input);
    if (!parsed.success) return failure("INVALID_INPUT", "Staged execution journal entry does not match the strict schema.");
    const entry = parsed.data;
    const history = this.histories.get(entry.transactionId) ?? [];
    const previous = history.at(-1);
    if (!previous) {
      if (entry.stage !== "previewed") return failure("FORBIDDEN", "A staged execution journal must begin in previewed state.");
      this.histories.set(entry.transactionId, [entry]);
      return success({ entry, inserted: true });
    }
    if (!sameTransaction(previous, entry)) return failure("FORBIDDEN", "Staged transaction identity cannot change within a history.");
    if (canonicalizeFoundryIr(previous) === canonicalizeFoundryIr(entry)) return success({ entry: previous, inserted: false });
    if (!transitions[previous.stage].includes(entry.stage)) return failure("FORBIDDEN", `Invalid staged transaction transition: ${previous.stage} → ${entry.stage}.`);
    history.push(entry);
    this.histories.set(entry.transactionId, history);
    return success({ entry, inserted: true });
  }

  latest(transactionId: string): StagedExecutionEntry | null {
    return this.histories.get(transactionId)?.at(-1) ?? null;
  }

  history(transactionId: string): readonly StagedExecutionEntry[] {
    return Object.freeze([...(this.histories.get(transactionId) ?? [])]);
  }

  entries(): readonly StagedExecutionEntry[] {
    return Object.freeze([...this.histories.values()].flat().sort((left, right) =>
      compareStrings(left.transactionId, right.transactionId)
      || left.attempt - right.attempt
      || compareStrings(left.observedAt, right.observedAt)));
  }

  toJSON(): string {
    return canonicalizeFoundryIr(this.entries());
  }

  static fromJSON(input: string): Result<StagedExecutionJournal> {
    let decoded: unknown;
    try {
      decoded = JSON.parse(input);
    } catch {
      return failure("INVALID_INPUT", "Staged execution journal JSON could not be parsed.");
    }
    if (!Array.isArray(decoded)) return failure("INVALID_INPUT", "Staged execution journal JSON must be an array.");
    const journal = new StagedExecutionJournal();
    for (const entry of decoded) {
      const appended = journal.append(entry);
      if (!appended.ok) return appended;
    }
    return success(journal);
  }
}

function localPart(id: string): string {
  return id.replaceAll(":", "-");
}

function executionKeys(planId: string, stableId: string): { transactionId: StableDiceBoxId; idempotencyKey: StableDiceBoxId; recoveryKey: StableDiceBoxId } {
  const suffix = `${localPart(planId)}-${localPart(stableId)}`;
  return {
    transactionId: createStableDiceBoxId("staged-transaction", suffix),
    idempotencyKey: createStableDiceBoxId("staged-idempotency", suffix),
    recoveryKey: createStableDiceBoxId("staged-recovery", suffix),
  };
}

function bindingMatchesDocument(binding: RuntimeBinding, document: FoundryIrDocument): boolean {
  return binding.semantic.id === document.stableId && binding.documentType === document.documentType;
}

function asRuntimeBinding(input: unknown): RuntimeBinding {
  return RuntimeBindingSchema.parse(input) as RuntimeBinding;
}

function exactReadback(readback: StagedReadback, plan: FoundryIrPlan, document: FoundryIrDocument, binding: RuntimeBinding): boolean {
  return readback.status === "matched"
    && readback.stableId === document.stableId
    && readback.planId === plan.planId
    && readback.planSha256 === plan.planSha256
    && readback.binding !== null
    && canonicalizeFoundryIr(readback.binding) === canonicalizeFoundryIr(binding)
    && bindingMatchesDocument(asRuntimeBinding(readback.binding), document);
}

function planDocumentMap(plan: FoundryIrPlan): Map<string, FoundryIrDocument> {
  return new Map(plan.documents.map((document) => [document.stableId, document]));
}

function parsePlan(input: unknown): Result<FoundryIrPlan> {
  try {
    return success(validateFoundryIrPlan(input));
  } catch {
    return failure("INVALID_INPUT", "Foundry IR plan is invalid or its dependency order is not canonical.");
  }
}

function receiptId(planId: string, operation: "staged-foundry-ir.execute" | "staged-foundry-ir.recover", status: "committed" | "unknown" | "blocked" | "recovered", stableId?: string): string {
  const suffix = `${localPart(planId)}-${operation.endsWith("recover") ? "recover" : status}${stableId ? `-${localPart(stableId)}` : ""}`;
  return createStableDiceBoxId("staged-receipt", suffix);
}

function makeReceipt(input: {
  readonly plan: FoundryIrPlan;
  readonly operation: "staged-foundry-ir.execute" | "staged-foundry-ir.recover";
  readonly status: "committed" | "unknown" | "blocked" | "recovered";
  readonly committedStableIds: readonly string[];
  readonly unresolvedStableIds: readonly string[];
  readonly idempotencyKeys: readonly string[];
  readonly recoveryKeys: readonly string[];
  readonly blockers: readonly string[];
  readonly authoritativeReread: boolean;
  readonly unknownOutcome: boolean;
  readonly observedAt: string;
  readonly notes: readonly string[];
  readonly stableId?: string;
}): StagedExecutionReceipt {
  return stagedExecutionReceiptSchema.parse({
    schemaVersion: "0.1.0",
    receiptId: receiptId(input.plan.planId, input.operation, input.status, input.stableId),
    operation: input.operation,
    status: input.status,
    planId: input.plan.planId,
    planSha256: input.plan.planSha256,
    committedStableIds: [...input.committedStableIds],
    unresolvedStableIds: [...input.unresolvedStableIds],
    idempotencyKeys: [...input.idempotencyKeys],
    recoveryKeys: [...input.recoveryKeys],
    blockers: [...input.blockers],
    adapterBoundary: "injected-adapter-only",
    noSameBatchReferences: true,
    authoritativeReread: input.authoritativeReread,
    unknownOutcome: input.unknownOutcome,
    foreignStatePreserved: true,
    readyClaim: false,
    observedAt: input.observedAt,
    notes: [...input.notes],
  });
}

export interface StagedExecutionResult {
  readonly state: "committed" | "unknown-outcome" | "blocked";
  readonly planId: string;
  readonly committedStableIds: readonly string[];
  readonly unresolvedStableIds: readonly string[];
  readonly receipt: StagedExecutionReceipt;
}

export interface ExecuteStagedPlanInput {
  readonly plan: unknown;
  readonly approvedPlanSha256: string;
  readonly approvedByUserId: string;
  readonly activeGmUserId: string;
  readonly observedAt: string;
  readonly adapter: StagedExecutionAdapter;
  readonly bindings: StagedBindingTableStore;
  readonly journal: StagedExecutionJournal;
}

function blockedResult(plan: FoundryIrPlan, input: ExecuteStagedPlanInput, blockers: readonly string[], committedStableIds: readonly string[] = [], unresolvedStableIds: readonly string[] = plan.dependencyOrder): Result<StagedExecutionResult> {
  const keys = plan.dependencyOrder.map((stableId) => executionKeys(plan.planId, stableId));
  return success({
    state: "blocked",
    planId: plan.planId,
    committedStableIds,
    unresolvedStableIds,
    receipt: makeReceipt({
      plan,
      operation: "staged-foundry-ir.execute",
      status: "blocked",
      committedStableIds,
      unresolvedStableIds,
      idempotencyKeys: keys.map((key) => key.idempotencyKey),
      recoveryKeys: keys.map((key) => key.recoveryKey),
      blockers,
      authoritativeReread: false,
      unknownOutcome: false,
      observedAt: input.observedAt,
      notes: [`Adapter boundary ${input.adapter.adapterId} was not invoked.`],
    }),
  });
}

function appendEntry(journal: StagedExecutionJournal, input: Omit<StagedExecutionEntry, "schemaVersion">): Result<StagedExecutionEntry> {
  const appended = journal.append({ schemaVersion: "0.1.0", ...input });
  return appended.ok ? success(appended.value.entry) : appended;
}

function commonEntry(plan: FoundryIrPlan, document: FoundryIrDocument, observedAt: string): Omit<StagedExecutionEntry, "schemaVersion" | "stage" | "resolution"> {
  const keys = executionKeys(plan.planId, document.stableId);
  return {
    transactionId: keys.transactionId,
    idempotencyKey: keys.idempotencyKey,
    recoveryKey: keys.recoveryKey,
    planId: plan.planId,
    planSha256: plan.planSha256,
    stableId: document.stableId,
    documentType: document.documentType,
    operation: document.operation,
    dependencies: [...document.dependencies].sort(compareStrings),
    attempt: 0,
    binding: null,
    approvedByUserId: null,
    observedAt,
    notes: [],
  };
}

function unknownExecutionResult(input: ExecuteStagedPlanInput, plan: FoundryIrPlan, committed: readonly string[], unresolved: readonly string[], document: FoundryIrDocument, blockers: readonly string[], authoritativeReread: boolean): Result<StagedExecutionResult> {
  const keys = plan.dependencyOrder.map((stableId) => executionKeys(plan.planId, stableId));
  return success({
    state: "unknown-outcome",
    planId: plan.planId,
    committedStableIds: committed,
    unresolvedStableIds: unresolved,
    receipt: makeReceipt({
      plan,
      operation: "staged-foundry-ir.execute",
      status: "unknown",
      committedStableIds: committed,
      unresolvedStableIds: unresolved,
      idempotencyKeys: keys.map((key) => key.idempotencyKey),
      recoveryKeys: keys.map((key) => key.recoveryKey),
      blockers,
      authoritativeReread,
      unknownOutcome: true,
      observedAt: input.observedAt,
      notes: [`Stopped before dispatching any later dependency after ${document.stableId}; explicit reread recovery is required.`],
    }),
  });
}

export async function executeStagedPlan(input: ExecuteStagedPlanInput): Promise<Result<StagedExecutionResult>> {
  const parsedPlan = parsePlan(input.plan);
  if (!parsedPlan.ok) return parsedPlan;
  const plan = parsedPlan.value;
  if (!(await verifyFoundryIrPlanHash(plan))) return failure("FORBIDDEN", "Foundry IR plan hash is invalid; stale or tampered plans cannot execute.");
  if (!/^[0-9a-f]{64}$/.test(input.approvedPlanSha256) || input.approvedPlanSha256 !== plan.planSha256) {
    return blockedResult(plan, input, ["Approved plan hash does not match the exact current Foundry IR plan."]);
  }
  if (!input.approvedByUserId.trim() || input.approvedByUserId !== input.activeGmUserId) {
    return blockedResult(plan, input, ["Approved GM identity does not match the current active GM."]);
  }
  const loaded = await input.bindings.load();
  if (!loaded.ok) return loaded;

  const documents = planDocumentMap(plan);
  const committed: string[] = [];
  for (const stableId of plan.dependencyOrder) {
    const document = documents.get(stableId);
    if (!document) return blockedResult(plan, input, [`Dependency order references missing document ${stableId}.`], committed, plan.dependencyOrder.slice(committed.length));
    const latest = input.journal.latest(executionKeys(plan.planId, stableId).transactionId);
    if (latest?.stage === "unknown-outcome") {
      return blockedResult(plan, input, [`${stableId} has an unresolved unknown outcome; explicit recovery is required before retry.`], committed, plan.dependencyOrder.slice(committed.length));
    }
    if (latest?.stage === "recovered") {
      return blockedResult(plan, input, [`${stableId} has a recovered terminal outcome; create a new reviewed transaction before retry.`], committed, plan.dependencyOrder.slice(committed.length));
    }

    const dependencyBindings: StagedBindingRecord[] = [];
    for (const dependencyId of document.dependencies) {
      const dependency = await input.bindings.get(dependencyId);
      if (!dependency.ok) return dependency;
      if (!dependency.value) return blockedResult(plan, input, [`Missing persisted dependency binding ${dependencyId} before dispatch of ${stableId}.`], committed, plan.dependencyOrder.slice(committed.length));
      dependencyBindings.push(dependency.value);
    }

    const existingResult = await input.bindings.get(stableId);
    if (!existingResult.ok) return existingResult;
    const existing = existingResult.value;
    if (existing && existing.documentType !== document.documentType) {
      return blockedResult(plan, input, [`Persisted binding ${stableId} has a different document type; foreign state is preserved.`], committed, plan.dependencyOrder.slice(committed.length));
    }
    if (existing && document.operation === "create" && (existing.planId !== plan.planId || existing.planSha256 !== plan.planSha256)) {
      return blockedResult(plan, input, [`Create ${stableId} already has a binding from another plan; explicit update is required.`], committed, plan.dependencyOrder.slice(committed.length));
    }

    if (existing && existing.planId === plan.planId && existing.planSha256 === plan.planSha256) {
      const reread = await input.adapter.read(document, asRuntimeBinding(existing.binding));
      if (!reread.ok) return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, [reread.error.message], true);
      if (exactReadback(reread.value, plan, document, asRuntimeBinding(existing.binding))) {
        committed.push(stableId);
        continue;
      }
      if (reread.value.status === "conflict") return blockedResult(plan, input, [`Foreign or conflicting state was observed for ${stableId}; it was preserved and no retry was authorized.`], committed, plan.dependencyOrder.slice(committed.length));
      return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, [`Persisted binding ${stableId} did not receive an exact authoritative reread.`], true);
    }

    if (document.operation === "update" && !existing) {
      return blockedResult(plan, input, [`Update ${stableId} requires a persisted reviewed binding.`], committed, plan.dependencyOrder.slice(committed.length));
    }

    const base = commonEntry(plan, document, input.observedAt);
    const previewed = appendEntry(input.journal, { ...base, stage: "previewed", resolution: "pending" });
    if (!previewed.ok) return previewed;
    const approved = appendEntry(input.journal, { ...base, stage: "approved", resolution: "pending", approvedByUserId: input.approvedByUserId, notes: ["Exact approved plan hash and active-GM identity were rechecked."] });
    if (!approved.ok) return approved;
    const applyReady = appendEntry(input.journal, { ...base, stage: "apply-ready", resolution: "pending", approvedByUserId: input.approvedByUserId, notes: ["All dependency bindings were persisted before dispatch."] });
    if (!applyReady.ok) return applyReady;
    const applying = appendEntry(input.journal, { ...base, stage: "applying", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: ["Dispatch is bounded to one document and its already persisted dependencies."] });
    if (!applying.ok) return applying;

    const dispatched = document.operation === "create"
      ? await input.adapter.create(document, dependencyBindings, base.idempotencyKey)
      : await input.adapter.update(document, asRuntimeBinding(existing!.binding), dependencyBindings, base.idempotencyKey);
    if (!dispatched.ok) {
      if (dispatched.error.code === "UNKNOWN_OUTCOME") {
        const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: [dispatched.error.message, "Timeout or transport uncertainty is outcome-unknown; automatic retry is forbidden."] });
        if (!unknown.ok) return unknown;
        return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, [dispatched.error.message], false);
      }
      return blockedResult(plan, input, [`Adapter ${input.adapter.adapterId} rejected ${stableId}: ${dispatched.error.message}`], committed, plan.dependencyOrder.slice(committed.length));
    }
    if (!bindingMatchesDocument(dispatched.value, document)) {
      const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: ["Adapter returned a binding whose semantic or document identity did not match the reviewed document."] });
      if (!unknown.ok) return unknown;
      return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, ["Adapter binding identity did not match the reviewed stable ID and document type."], false);
    }
    const reread = await input.adapter.read(document, dispatched.value);
    if (!reread.ok) {
      const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: [reread.error.message, "Authoritative reread failed; retry is forbidden until recovery."] });
      if (!unknown.ok) return unknown;
      return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, [reread.error.message], false);
    }
    if (!exactReadback(reread.value, plan, document, dispatched.value)) {
      const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: ["Authoritative reread did not match the reviewed stable binding and plan identity."] });
      if (!unknown.ok) return unknown;
      if (reread.value.status === "conflict") return blockedResult(plan, input, [`Foreign or conflicting state was observed for ${stableId}; it was preserved and no retry was authorized.`], committed, plan.dependencyOrder.slice(committed.length));
      return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, ["Authoritative reread did not match the reviewed record."], true);
    }

    const persisted = await input.bindings.upsert({
      schemaVersion: "0.1.0",
      stableId,
      planId: plan.planId,
      planSha256: plan.planSha256,
      documentType: document.documentType,
      binding: dispatched.value,
      committedAt: input.observedAt,
    });
    if (!persisted.ok) {
      const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", attempt: 1, approvedByUserId: input.approvedByUserId, notes: [persisted.error.message, "Binding persistence is uncertain; reread before retry."] });
      if (!unknown.ok) return unknown;
      return unknownExecutionResult(input, plan, committed, plan.dependencyOrder.slice(committed.length), document, [persisted.error.message], true);
    }
    const committedEntry = appendEntry(input.journal, { ...base, stage: "committed", resolution: "committed", attempt: 1, binding: dispatched.value, approvedByUserId: input.approvedByUserId, notes: ["Authoritative reread matched; binding table persisted before the next dependency was dispatched."] });
    if (!committedEntry.ok) return committedEntry;
    committed.push(stableId);
  }

  const keys = plan.dependencyOrder.map((stableId) => executionKeys(plan.planId, stableId));
  return success({
    state: "committed",
    planId: plan.planId,
    committedStableIds: committed,
    unresolvedStableIds: [],
    receipt: makeReceipt({
      plan,
      operation: "staged-foundry-ir.execute",
      status: "committed",
      committedStableIds: committed,
      unresolvedStableIds: [],
      idempotencyKeys: keys.map((key) => key.idempotencyKey),
      recoveryKeys: keys.map((key) => key.recoveryKey),
      blockers: [],
      authoritativeReread: true,
      unknownOutcome: false,
      observedAt: input.observedAt,
      notes: [`Adapter ${input.adapter.adapterId} was used only through the injected boundary; no same-batch runtime reference was used.`],
    }),
  });
}

export interface RecoverStagedUnknownInput {
  readonly plan: unknown;
  readonly stableId: string;
  readonly approvedByUserId: string;
  readonly activeGmUserId: string;
  readonly observedAt: string;
  readonly adapter: StagedExecutionAdapter;
  readonly bindings: StagedBindingTableStore;
  readonly journal: StagedExecutionJournal;
}

export interface RecoverStagedUnknownResult {
  readonly state: "committed" | "unknown-outcome" | "recovered" | "blocked";
  readonly receipt: StagedExecutionReceipt;
}

export async function recoverStagedUnknown(input: RecoverStagedUnknownInput): Promise<Result<RecoverStagedUnknownResult>> {
  const parsedPlan = parsePlan(input.plan);
  if (!parsedPlan.ok) return parsedPlan;
  const plan = parsedPlan.value;
  if (!(await verifyFoundryIrPlanHash(plan))) return failure("FORBIDDEN", "Foundry IR plan hash is invalid; recovery cannot run against a tampered plan.");
  if (!input.approvedByUserId.trim() || input.approvedByUserId !== input.activeGmUserId) return failure("FORBIDDEN", "Recovery requires the approved GM to remain the active GM.");
  const document = plan.documents.find((candidate) => candidate.stableId === input.stableId);
  if (!document) return failure("INVALID_INPUT", "Recovery stable ID is not present in the reviewed plan.");
  const keys = executionKeys(plan.planId, document.stableId);
  const latest = input.journal.latest(keys.transactionId);
  if (!latest || latest.stage !== "unknown-outcome") return failure("FORBIDDEN", "Only an unresolved unknown staged transaction can be recovered.");
  const loaded = await input.bindings.load();
  if (!loaded.ok) return loaded;
  const existingResult = await input.bindings.get(document.stableId);
  if (!existingResult.ok) return existingResult;
  const existing = existingResult.value;
  const reread = await input.adapter.read(document, existing ? asRuntimeBinding(existing.binding) : latest.binding ? asRuntimeBinding(latest.binding) : null);
  const base = {
    transactionId: latest.transactionId,
    idempotencyKey: latest.idempotencyKey,
    recoveryKey: latest.recoveryKey,
    planId: latest.planId,
    planSha256: latest.planSha256,
    stableId: latest.stableId,
    documentType: latest.documentType,
    operation: latest.operation,
    dependencies: latest.dependencies,
    attempt: latest.attempt + 1,
    approvedByUserId: input.approvedByUserId,
    observedAt: input.observedAt,
  } as const;
  if (!reread.ok) {
    const unknown = appendEntry(input.journal, { ...base, stage: "unknown-outcome", resolution: "pending", binding: latest.binding, notes: [reread.error.message, "Recovery reread remains unknown; retry is still forbidden."] });
    if (!unknown.ok) return unknown;
    return success({
      state: "unknown-outcome",
      receipt: makeReceipt({
        plan,
        operation: "staged-foundry-ir.recover",
        status: "unknown",
        committedStableIds: [],
        unresolvedStableIds: [document.stableId],
        idempotencyKeys: [keys.idempotencyKey],
        recoveryKeys: [keys.recoveryKey],
        blockers: [reread.error.message],
        authoritativeReread: true,
        unknownOutcome: true,
        observedAt: input.observedAt,
        notes: ["No automatic retry was attempted."],
        stableId: document.stableId,
      }),
    });
  }

  if (reread.value.binding !== null && exactReadback(reread.value, plan, document, asRuntimeBinding(reread.value.binding))) {
    const persisted = await input.bindings.upsert({
      schemaVersion: "0.1.0",
      stableId: document.stableId,
      planId: plan.planId,
      planSha256: plan.planSha256,
      documentType: document.documentType,
      binding: reread.value.binding,
      committedAt: input.observedAt,
    });
    if (!persisted.ok) return persisted;
    const committed = appendEntry(input.journal, { ...base, stage: "committed", resolution: "committed", binding: reread.value.binding, notes: ["Explicit authoritative reread confirmed the exact binding after the unknown outcome."] });
    if (!committed.ok) return committed;
    return success({
      state: "committed",
      receipt: makeReceipt({
        plan,
        operation: "staged-foundry-ir.recover",
        status: "committed",
        committedStableIds: [document.stableId],
        unresolvedStableIds: [],
        idempotencyKeys: [keys.idempotencyKey],
        recoveryKeys: [keys.recoveryKey],
        blockers: [],
        authoritativeReread: true,
        unknownOutcome: false,
        observedAt: input.observedAt,
        notes: ["Recovery committed only after exact readback and binding persistence; no create/update retry was attempted."],
        stableId: document.stableId,
      }),
    });
  }

  const resolution = reread.value.status === "not-found" ? "not-committed" : "conflict";
  const recovered = appendEntry(input.journal, { ...base, stage: "recovered", resolution, binding: reread.value.binding, notes: [
    reread.value.status === "not-found"
      ? "Authoritative reread found no committed binding; a new reviewed transaction is required before retry."
      : "Foreign or conflicting state was observed and preserved; retry is not authorized.",
  ] });
  if (!recovered.ok) return recovered;
  return success({
    state: "recovered",
    receipt: makeReceipt({
      plan,
      operation: "staged-foundry-ir.recover",
      status: "recovered",
      committedStableIds: [],
      unresolvedStableIds: [document.stableId],
      idempotencyKeys: [keys.idempotencyKey],
      recoveryKeys: [keys.recoveryKey],
      blockers: [reread.value.status === "not-found" ? "No committed binding was found; automatic retry is forbidden." : "Foreign or conflicting state was preserved; automatic retry is forbidden."],
      authoritativeReread: true,
      unknownOutcome: false,
      observedAt: input.observedAt,
      notes: ["Recovery resolved the uncertainty without changing foreign state."],
      stableId: document.stableId,
    }),
  });
}
