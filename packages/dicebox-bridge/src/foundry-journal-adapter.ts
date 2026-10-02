import {
  RuntimeBindingSchema,
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
  type StableDiceBoxId,
} from "@dicebox/core";
import {
  managedJournalEntrySpecSchema,
  type ManagedJournalEntrySpec,
} from "@dicebox/compiler";
import {
  DICEBOX_JOURNAL_FLAG_SCOPE,
  foundryJournalEntryCreateDataSchema,
  mapManagedJournalEntryCreateData,
  managedJournalEntryFlagSchema,
  type FoundryJournalEntryCreateData,
} from "./journal-data.js";
import type {
  JournalEntryAdapter,
  ManagedJournalEntryRecord,
} from "./journal-port.js";

/**
 * The adapter consumes only the exact Foundry surfaces named in the API
 * matrix. The structural types keep this package independent of Foundry's
 * browser globals while making the runtime calls explicit and testable.
 */
export interface FoundryJournalEntryDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string;
  readonly documentName?: string;
  readonly name?: string;
  readonly pages?: unknown;
  readonly flags?: unknown;
  readonly update?: (
    changed: Record<string, unknown>,
  ) => Promise<FoundryJournalEntryDocument>;
  readonly toObject?: () => Record<string, unknown>;
}

export interface FoundryJournalCollection {
  readonly contents?: readonly FoundryJournalEntryDocument[];
  get(id: string): FoundryJournalEntryDocument | null;
}

export interface FoundryJournalEntryAdapterOptions {
  readonly JournalEntry: {
    create(
      data: FoundryJournalEntryCreateData,
    ): Promise<FoundryJournalEntryDocument | null>;
  };
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryJournalEntryDocument | null> | FoundryJournalEntryDocument | null;
  readonly game?: {
    readonly journal?: FoundryJournalCollection;
  };
  /** Values observed from the exact target runtime, never guessed here. */
  readonly pageType: string;
  readonly textFormat: number;
}

/**
 * Read-only adapter boundary for authoritative JournalEntry rereads. It does
 * not accept a JournalEntry factory, page creator, or update function, so a
 * caller cannot accidentally turn a diagnostic/read-back path into a write.
 */
export interface FoundryJournalEntryReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryJournalEntryDocument | null> | FoundryJournalEntryDocument | null;
  readonly game?: {
    readonly journal?: FoundryJournalCollection;
  };
}

export interface FoundryJournalEntryReadAdapter {
  readonly adapterId: "foundry.journal-entry.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly read: "fromUuid" | "game.journal.get";
  };
  read(binding: RuntimeBinding): Promise<Result<ManagedJournalEntryRecord | null>>;
}

function error(
  code: DiceBoxError["code"],
  message: string,
  retry: DiceBoxError["retry"],
): DiceBoxError {
  return { code, message, retry };
}

function fail<T>(
  code: DiceBoxError["code"],
  message: string,
  retry: DiceBoxError["retry"],
): Result<T> {
  return { ok: false, error: error(code, message, retry) };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringField(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function pagesOf(document: FoundryJournalEntryDocument): readonly unknown[] | null {
  if (Array.isArray(document.pages)) return document.pages;
  if (isRecord(document.pages) && Array.isArray(document.pages.contents)) {
    return document.pages.contents;
  }
  return null;
}

function pageId(page: unknown): string | null {
  if (!isRecord(page)) return null;
  return stringField(page.id) ?? stringField(page._id);
}

function plainObject(page: unknown): Record<string, unknown> | null {
  if (!isRecord(page)) return null;
  const toObject = page.toObject;
  if (typeof toObject === "function") {
    const value = toObject.call(page);
    return isRecord(value) ? { ...value } : null;
  }
  return { ...page };
}

function managedFlag(document: FoundryJournalEntryDocument) {
  const flags = isRecord(document.flags) ? document.flags[DICEBOX_JOURNAL_FLAG_SCOPE] : undefined;
  return managedJournalEntryFlagSchema.safeParse(flags);
}

function documentIdentity(
  document: FoundryJournalEntryDocument,
): { readonly documentId: string; readonly uuid: string } | null {
  const documentId = stringField(document.id) ?? stringField(document._id);
  const uuid = stringField(document.uuid);
  return documentId && uuid ? { documentId, uuid } : null;
}

function bindingFromDocument(
  document: FoundryJournalEntryDocument,
  semantic: ManagedJournalEntrySpec["semantic"],
  generation: number,
): Result<RuntimeBinding> {
  if (document.documentName && document.documentName !== "JournalEntry") {
    return fail("FORBIDDEN", "The resolved document is not a JournalEntry.", "never");
  }
  const identity = documentIdentity(document);
  const pages = pagesOf(document);
  const embeddedDocumentId = pages && pages.length === 1 ? pageId(pages[0]) : null;
  if (!identity || !embeddedDocumentId) {
    return fail(
      "UNKNOWN_OUTCOME",
      "Foundry returned a JournalEntry without a stable parent or embedded page binding.",
      "after-reread",
    );
  }
  const bindingData = {
    semantic,
    runtime: "foundry" as const,
    documentType: "JournalEntry" as const,
    documentId: identity.documentId,
    uuid: identity.uuid,
    generation,
    embeddedDocumentId,
    ...(document.name ? { displayName: document.name } : {}),
  };
  return {
    ok: true,
    value: RuntimeBindingSchema.parse(bindingData) as RuntimeBinding,
  };
}

function recordFromDocument(
  document: FoundryJournalEntryDocument,
  binding: RuntimeBinding,
): Result<ManagedJournalEntryRecord> {
  if (document.documentName && document.documentName !== "JournalEntry") {
    return fail("FORBIDDEN", "The resolved document is not a JournalEntry.", "never");
  }
  const identity = documentIdentity(document);
  if (!identity || identity.documentId !== binding.documentId || identity.uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved document does not match the requested binding.", "after-reread");
  }
  const flag = managedFlag(document);
  if (!flag.success || flag.data.semanticId !== binding.semantic.id) {
    return fail(
      "FORBIDDEN",
      "The resolved JournalEntry is foreign or lacks the DiceBox ownership marker.",
      "never",
    );
  }
  const pages = pagesOf(document);
  const page = pages?.find((candidate) => pageId(candidate) === binding.embeddedDocumentId);
  if (!isRecord(page) || !isRecord(page.text)) {
    return fail(
      "UNKNOWN_OUTCOME",
      "The managed JournalEntryPage binding is missing or has an unknown shape.",
      "after-reread",
    );
  }
  const title = stringField(document.name);
  const content = typeof page.text.content === "string" ? page.text.content : null;
  if (!title || content === null) {
    return fail("UNKNOWN_OUTCOME", "The managed JournalEntry read-back is incomplete.", "after-reread");
  }
  return {
    ok: true,
    value: {
      semantic: binding.semantic,
      planId: flag.data.planId,
      binding,
      title,
      content,
    },
  };
}

function createData(
  plan: ManagedJournalEntrySpec,
  pageType: string,
  textFormat: number,
): Result<FoundryJournalEntryCreateData> {
  try {
    return {
      ok: true,
      value: foundryJournalEntryCreateDataSchema.parse(
        mapManagedJournalEntryCreateData({ plan, pageType, textFormat }),
      ),
    };
  } catch (cause) {
    return fail(
      "INVALID_INPUT",
      cause instanceof Error ? cause.message : "The reviewed JournalEntry data was invalid.",
      "never",
    );
  }
}

function parsePlan(input: unknown): Result<ManagedJournalEntrySpec> {
  const parsed = managedJournalEntrySpecSchema.safeParse(input);
  return parsed.success
    ? { ok: true, value: parsed.data }
    : fail("INVALID_INPUT", "The reviewed JournalEntry plan failed schema validation.", "never");
}

export function createFoundryJournalEntryReadAdapter(
  options: FoundryJournalEntryReadAdapterOptions,
): FoundryJournalEntryReadAdapter {
  const readApi = options.fromUuid ? "fromUuid" : "game.journal.get";
  const resolve = async (
    binding: RuntimeBinding,
  ): Promise<Result<FoundryJournalEntryDocument | null>> => {
    try {
      if (options.fromUuid) {
        return { ok: true, value: await options.fromUuid(binding.uuid) };
      }
      if (!options.game?.journal) {
        return fail("UNAVAILABLE", "No exact Foundry JournalEntry read surface was provided.", "never");
      }
      return { ok: true, value: options.game.journal.get(binding.documentId) };
    } catch {
      return fail("UNKNOWN_OUTCOME", "Foundry binding resolution failed; outcome is unknown.", "after-reread");
    }
  };

  return {
    adapterId: "foundry.journal-entry.read@14.367",
    runtime: "foundry",
    foundryApi: { read: readApi },
    async read(binding) {
      const resolved = await resolve(binding);
      if (!resolved.ok) return resolved;
      if (!resolved.value) return { ok: true, value: null };
      return recordFromDocument(resolved.value, binding);
    },
  };
}

export function createFoundryJournalEntryAdapter(
  options: FoundryJournalEntryAdapterOptions,
): JournalEntryAdapter {
  const resolve = async (
    binding: RuntimeBinding,
  ): Promise<Result<FoundryJournalEntryDocument | null>> => {
    try {
      if (options.fromUuid) {
        return { ok: true, value: await options.fromUuid(binding.uuid) };
      }
      const document = options.game?.journal?.get(binding.documentId) ?? null;
      return { ok: true, value: document };
    } catch {
      return fail("UNKNOWN_OUTCOME", "Foundry binding resolution failed; outcome is unknown.", "after-reread");
    }
  };

  const findExisting = (plan: ManagedJournalEntrySpec): FoundryJournalEntryDocument | null => {
    const contents = options.game?.journal?.contents;
    if (!contents) return null;
    return contents.find((document) => {
      const flag = managedFlag(document);
      return flag.success
        && flag.data.semanticId === plan.semantic.id
        && flag.data.planId === plan.planId;
    }) ?? null;
  };

  return {
    adapterId: "foundry.journal-entry@14.367",
    runtime: "foundry",
    foundryApi: {
      read: options.fromUuid ? "fromUuid" : "game.journal.get",
      create: "JournalEntry.create",
      createPage: "entry.createEmbeddedDocuments",
      update: "JournalEntry.update",
    },
    async read(binding) {
      const resolved = await resolve(binding);
      if (!resolved.ok) return resolved;
      if (!resolved.value) return { ok: true, value: null };
      return recordFromDocument(resolved.value, binding);
    },
    async create(inputPlan, _idempotencyKey) {
      const parsedPlan = parsePlan(inputPlan);
      if (!parsedPlan.ok) return parsedPlan;
      const plan = parsedPlan.value;
      if (plan.operation !== "create") {
        return fail("INVALID_INPUT", "The Foundry create adapter accepts only create plans.", "never");
      }
      const existing = findExisting(plan);
      if (existing) return bindingFromDocument(existing, plan.semantic, 1);
      const data = createData(plan, options.pageType, options.textFormat);
      if (!data.ok) return data;
      try {
        const created = await options.JournalEntry.create(data.value);
        if (!created) {
          return fail("UNKNOWN_OUTCOME", "Foundry returned no JournalEntry after create.", "after-reread");
        }
        return bindingFromDocument(created, plan.semantic, 1);
      } catch {
        return fail("UNKNOWN_OUTCOME", "JournalEntry.create may have committed before the response failed.", "after-reread");
      }
    },
    async update(inputPlan, binding) {
      const parsedPlan = parsePlan(inputPlan);
      if (!parsedPlan.ok) return parsedPlan;
      const plan = parsedPlan.value;
      if (plan.operation !== "update") {
        return fail("INVALID_INPUT", "The Foundry update adapter accepts only update plans.", "never");
      }
      if (binding.semantic.id !== plan.semantic.id || binding.documentType !== "JournalEntry") {
        return fail("FORBIDDEN", "The update plan does not match the reviewed JournalEntry binding.", "never");
      }
      if (!binding.embeddedDocumentId) {
        return fail("FORBIDDEN", "A managed JournalEntryPage binding is required before update.", "never");
      }
      const resolved = await resolve(binding);
      if (!resolved.ok) return resolved;
      if (!resolved.value) {
        return fail("UNKNOWN_OUTCOME", "The JournalEntry binding disappeared before update.", "after-reread");
      }
      const existing = recordFromDocument(resolved.value, binding);
      if (!existing.ok) return { ok: false, error: existing.error };
      const pages = pagesOf(resolved.value);
      if (!pages) return fail("UNKNOWN_OUTCOME", "Foundry returned no readable JournalEntry pages.", "after-reread");
      const updatedPages: Record<string, unknown>[] = [];
      let targetFound = false;
      for (const page of pages) {
        const object = plainObject(page);
        if (!object) return fail("UNKNOWN_OUTCOME", "A JournalEntryPage could not be preserved safely.", "after-reread");
        if (pageId(page) !== binding.embeddedDocumentId) {
          updatedPages.push(object);
          continue;
        }
        targetFound = true;
        const currentText = isRecord(object.text) ? object.text : {};
        updatedPages.push({
          ...object,
          name: plan.title,
          type: options.pageType,
          text: { ...currentText, content: plan.content, format: options.textFormat },
        });
      }
      if (!targetFound || typeof resolved.value.update !== "function") {
        return fail("FORBIDDEN", "The managed JournalEntryPage cannot be updated through the exact parent API.", "never");
      }
      try {
        await resolved.value.update({ name: plan.title, pages: updatedPages });
      } catch {
        return fail("UNKNOWN_OUTCOME", "JournalEntry.update may have committed before the response failed.", "after-reread");
      }
      const nextBinding = RuntimeBindingSchema.parse({
        semantic: binding.semantic,
        runtime: binding.runtime,
        documentType: binding.documentType,
        documentId: binding.documentId,
        uuid: binding.uuid,
        generation: binding.generation + 1,
        ...(binding.embeddedDocumentId ? { embeddedDocumentId: binding.embeddedDocumentId } : {}),
        displayName: plan.title,
      }) as RuntimeBinding;
      const reread = await resolve(nextBinding);
      if (!reread.ok || !reread.value) {
        return fail("UNKNOWN_OUTCOME", "Updated JournalEntry could not be read back.", "after-reread");
      }
      const verified = recordFromDocument(reread.value, nextBinding);
      if (!verified.ok || verified.value.title !== plan.title || verified.value.content !== plan.content) {
        return fail("UNKNOWN_OUTCOME", "Updated JournalEntry read-back did not match the reviewed plan.", "after-reread");
      }
      return { ok: true, value: nextBinding };
    },
  };
}
