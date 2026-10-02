import { createHash } from "node:crypto";
import { z } from "zod";
import {
  SemanticRefSchema,
  StableDiceBoxIdSchema,
  type Result,
} from "@dicebox/core";

type JsonValue = null | boolean | number | string | JsonValue[] | { readonly [key: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() => z.union([
  z.null(),
  z.boolean(),
  z.number().finite(),
  z.string(),
  z.array(jsonValueSchema),
  z.record(z.string(), jsonValueSchema),
]));

const operationSchema = z.enum(["upsert", "retire"]);

export const ProgramStateEntrySchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  entryId: StableDiceBoxIdSchema,
  idempotencyKey: StableDiceBoxIdSchema,
  operation: operationSchema,
  semantic: SemanticRefSchema,
  generation: z.number().int().nonnegative(),
  content: jsonValueSchema.nullable(),
  contentHash: z.string().regex(/^[0-9a-f]{64}$/),
  observedAt: z.string().datetime({ offset: true }),
  notes: z.array(z.string().min(1).max(500)).max(12),
}).strict();

export type ProgramStateEntry = z.infer<typeof ProgramStateEntrySchema>;
export type ProgramStateJson = JsonValue;

export const ProgramStateRecordSchema = z.object({
  semantic: SemanticRefSchema,
  generation: z.number().int().nonnegative(),
  status: z.enum(["active", "retired"]),
  content: jsonValueSchema.nullable(),
  contentHash: z.string().regex(/^[0-9a-f]{64}$/),
  updatedAt: z.string().datetime({ offset: true }),
}).strict();

export type ProgramStateRecord = z.infer<typeof ProgramStateRecordSchema>;

export const ProgramStateMigrationPreviewSchema = z.object({
  schemaVersion: z.literal("0.1.0"),
  previewId: StableDiceBoxIdSchema,
  sourceVersion: z.number().int().nonnegative(),
  targetVersion: z.literal(1),
  status: z.enum(["preview-only", "blocked"]),
  noWrite: z.literal(true),
  actions: z.array(z.object({
    semanticId: StableDiceBoxIdSchema.nullable(),
    operation: z.enum(["retain", "rewrite-envelope", "preserve-unknown", "defer"]),
    reason: z.string().min(1),
  }).strict()).min(1).max(100),
  blockers: z.array(z.string().min(1)).max(12),
}).strict();

export type ProgramStateMigrationPreview = z.infer<typeof ProgramStateMigrationPreviewSchema>;

export interface ProgramStateLog {
  /** Read the complete append-only log. Empty means a new program store. */
  read(): Promise<string>;
  /** Append exactly one validated JSON line. */
  append(line: string): Promise<void>;
}

export interface ProgramStateMutationOutcome {
  readonly entry: ProgramStateEntry;
  readonly record: ProgramStateRecord;
  readonly inserted: boolean;
}

export interface ProgramStateStore {
  load(): Promise<Result<ProgramStateLedger>>;
  append(input: unknown): Promise<Result<ProgramStateMutationOutcome>>;
  entries(): Promise<Result<readonly ProgramStateEntry[]>>;
  records(): Promise<Result<readonly ProgramStateRecord[]>>;
}

function invalid<T>(message: string): Result<T> {
  return { ok: false, error: { code: "INVALID_INPUT", message, retry: "never" } };
}

function forbidden<T>(message: string): Result<T> {
  return { ok: false, error: { code: "FORBIDDEN", message, retry: "never" } };
}

function unavailable<T>(message: string): Result<T> {
  return { ok: false, error: { code: "UNAVAILABLE", message, retry: "after-reread" } };
}

function unknownOutcome<T>(message: string): Result<T> {
  return { ok: false, error: { code: "UNKNOWN_OUTCOME", message, retry: "after-reread" } };
}

function canonicalJson(value: JsonValue): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key] as JsonValue)}`).join(",")}}`;
}

export function hashProgramState(value: JsonValue): string {
  return createHash("sha256").update(canonicalJson(value), "utf8").digest("hex");
}

export interface ProgramStateEntryInput {
  readonly entryId: string;
  readonly idempotencyKey: string;
  readonly operation: "upsert" | "retire";
  readonly semantic: unknown;
  readonly generation: number;
  readonly content?: JsonValue | null;
  readonly observedAt: string;
  readonly notes?: readonly string[];
}

export function createProgramStateEntry(input: ProgramStateEntryInput): Result<ProgramStateEntry> {
  const parsed = z.object({
    entryId: StableDiceBoxIdSchema,
    idempotencyKey: StableDiceBoxIdSchema,
    operation: operationSchema,
    semantic: SemanticRefSchema,
    generation: z.number().int().nonnegative(),
    content: jsonValueSchema.nullable().optional(),
    observedAt: z.string().datetime({ offset: true }),
    notes: z.array(z.string().min(1).max(500)).max(12).optional(),
  }).strict().safeParse(input);
  if (!parsed.success) return invalid("Program StateStore entry does not match the input schema.");
  if (parsed.data.operation === "upsert" && parsed.data.content === undefined) {
    return invalid("An upsert StateStore entry must include content.");
  }
  const content = parsed.data.operation === "retire" ? null : parsed.data.content ?? null;
  return {
    ok: true,
    value: ProgramStateEntrySchema.parse({
      schemaVersion: "0.1.0",
      entryId: parsed.data.entryId,
      idempotencyKey: parsed.data.idempotencyKey,
      operation: parsed.data.operation,
      semantic: parsed.data.semantic,
      generation: parsed.data.generation,
      content,
      contentHash: hashProgramState(content),
      observedAt: parsed.data.observedAt,
      notes: [...(parsed.data.notes ?? [])],
    }),
  };
}

function sameJson(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export class ProgramStateLedger {
  private readonly histories = new Map<string, ProgramStateEntry[]>();
  private readonly byIdempotency = new Map<string, ProgramStateEntry>();

  append(input: unknown): Result<ProgramStateMutationOutcome> {
    const parsed = ProgramStateEntrySchema.safeParse(input);
    if (!parsed.success) return invalid("Program StateStore entry does not match the strict schema.");
    const entry = parsed.data;
    if (entry.contentHash !== hashProgramState(entry.content)) {
      return invalid("Program StateStore content hash does not match canonical content.");
    }
    const existingIdempotency = this.byIdempotency.get(entry.idempotencyKey);
    if (existingIdempotency) {
      if (!sameJson(existingIdempotency, entry)) return forbidden("A reused idempotency key cannot change StateStore content or identity.");
      const record = this.recordFor(entry);
      return { ok: true, value: { entry: existingIdempotency, record, inserted: false } };
    }
    const history = this.histories.get(entry.semantic.id) ?? [];
    const previous = history.at(-1);
    if (previous && entry.generation <= previous.generation) {
      return forbidden("A StateStore generation must increase monotonically for each semantic ID.");
    }
    const record = this.recordFor(entry);
    history.push(entry);
    this.histories.set(entry.semantic.id, history);
    this.byIdempotency.set(entry.idempotencyKey, entry);
    return { ok: true, value: { entry, record, inserted: true } };
  }

  private recordFor(entry: ProgramStateEntry): ProgramStateRecord {
    return ProgramStateRecordSchema.parse({
      semantic: entry.semantic,
      generation: entry.generation,
      status: entry.operation === "retire" ? "retired" : "active",
      content: entry.content,
      contentHash: entry.contentHash,
      updatedAt: entry.observedAt,
    });
  }

  latest(semanticId: string): ProgramStateRecord | null {
    const entry = this.histories.get(semanticId)?.at(-1);
    return entry ? this.recordFor(entry) : null;
  }

  entries(): readonly ProgramStateEntry[] {
    return Object.freeze([...this.histories.values()].flat().sort((left, right) =>
      left.semantic.id.localeCompare(right.semantic.id)
      || left.generation - right.generation
      || left.observedAt.localeCompare(right.observedAt)));
  }

  records(): readonly ProgramStateRecord[] {
    return Object.freeze([...this.histories.keys()].sort().map((semanticId) => this.latest(semanticId)).filter((record): record is ProgramStateRecord => record !== null));
  }

  toJSON(): string {
    return JSON.stringify(this.entries());
  }

  static fromJSON(input: string): Result<ProgramStateLedger> {
    let decoded: unknown;
    try {
      decoded = JSON.parse(input);
    } catch {
      return invalid("Program StateStore JSON could not be parsed.");
    }
    const parsed = z.array(ProgramStateEntrySchema).safeParse(decoded);
    if (!parsed.success) return invalid("Program StateStore JSON does not match the strict entry schema.");
    const ledger = new ProgramStateLedger();
    for (const entry of parsed.data) {
      const appended = ledger.append(entry);
      if (!appended.ok) return appended;
    }
    return { ok: true, value: ledger };
  }
}

function replayLog(input: string): Result<ProgramStateLedger> {
  const ledger = new ProgramStateLedger();
  for (const [lineNumber, line] of input.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    let decoded: unknown;
    try {
      decoded = JSON.parse(line);
    } catch {
      return invalid(`Program StateStore line ${lineNumber + 1} is not valid JSON.`);
    }
    const appended = ledger.append(decoded);
    if (!appended.ok) return invalid(`Program StateStore line ${lineNumber + 1} failed validation: ${appended.error.message}`);
  }
  return { ok: true, value: ledger };
}

function serialized<T>(queue: { value: Promise<unknown> }, operation: () => Promise<Result<T>>): Promise<Result<T>> {
  const next = queue.value.then(operation, operation);
  queue.value = next.then(() => undefined, () => undefined);
  return next;
}

export function createProgramStateStore(log: ProgramStateLog): ProgramStateStore {
  let ledger: ProgramStateLedger | undefined;
  const queue = { value: Promise.resolve() as Promise<unknown> };

  async function loadUnlocked(): Promise<Result<ProgramStateLedger>> {
    if (ledger) return { ok: true, value: ledger };
    let text: string;
    try {
      text = await log.read();
    } catch {
      return unavailable("Program StateStore could not be read; no state was promoted.");
    }
    const restored = text.trim() ? replayLog(text) : { ok: true as const, value: new ProgramStateLedger() };
    if (restored.ok) ledger = restored.value;
    return restored;
  }

  return {
    load: () => serialized(queue, loadUnlocked),
    append: (input) => serialized(queue, async () => {
      const loaded = await loadUnlocked();
      if (!loaded.ok) return loaded;
      const candidate = ProgramStateLedger.fromJSON(loaded.value.toJSON());
      if (!candidate.ok) return candidate;
      const appended = candidate.value.append(input);
      if (!appended.ok) return appended;
      if (!appended.value.inserted) return appended;
      try {
        await log.append(`${JSON.stringify(appended.value.entry)}\n`);
      } catch {
        ledger = undefined;
        return unknownOutcome("Program StateStore append may have committed; reread before retry.");
      }
      ledger = candidate.value;
      return appended;
    }),
    entries: () => serialized(queue, async () => {
      const loaded = await loadUnlocked();
      return loaded.ok ? { ok: true, value: loaded.value.entries() } : loaded;
    }),
    records: () => serialized(queue, async () => {
      const loaded = await loadUnlocked();
      return loaded.ok ? { ok: true, value: loaded.value.records() } : loaded;
    }),
  };
}

export function createProgramStateMigrationPreview(input: unknown): ProgramStateMigrationPreview {
  const parsed = z.object({
    sourceVersion: z.number().int().nonnegative(),
    semanticIds: z.array(StableDiceBoxIdSchema).max(100).default([]),
  }).strict().parse(input);
  const unsupported = parsed.sourceVersion > 1;
  return ProgramStateMigrationPreviewSchema.parse({
    schemaVersion: "0.1.0",
    previewId: `dbx:state-migration:program-v${parsed.sourceVersion}-to-v1` as ProgramStateMigrationPreview["previewId"],
    sourceVersion: parsed.sourceVersion,
    targetVersion: 1,
    status: unsupported ? "blocked" : "preview-only",
    noWrite: true,
    actions: unsupported
      ? [{ semanticId: null, operation: "preserve-unknown", reason: "A newer StateStore schema cannot be rewritten by an older engine." }]
      : parsed.semanticIds.length > 0
        ? parsed.semanticIds.map((semanticId) => ({ semanticId, operation: parsed.sourceVersion === 1 ? "retain" as const : "rewrite-envelope" as const, reason: parsed.sourceVersion === 1 ? "Current envelope is retained without rewriting content." : "Only the versioned envelope may be migrated; semantic content remains unchanged." }))
        : [{ semanticId: null, operation: parsed.sourceVersion === 1 ? "retain" as const : "rewrite-envelope" as const, reason: "No semantic values were supplied to the preview." }],
    blockers: unsupported ? ["Source StateStore schema is newer than the supported target schema."] : [],
  });
}
