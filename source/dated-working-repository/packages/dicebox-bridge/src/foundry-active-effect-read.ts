import {
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

export const foundryActiveEffectParentTypes = ["Actor", "Item"] as const;
export type FoundryActiveEffectParentType = (typeof foundryActiveEffectParentTypes)[number];

export interface FoundryActiveEffectDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
  readonly disabled?: unknown;
  readonly isSuppressed?: unknown;
  readonly active?: unknown;
  readonly icon?: unknown;
  readonly changes?: readonly unknown[] | { readonly contents?: readonly unknown[] };
}

export interface FoundryActiveEffectCollection {
  readonly contents?: readonly unknown[];
}

export interface FoundryActiveEffectParentDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  getEmbeddedCollection?(embeddedName: string): FoundryActiveEffectCollection | readonly unknown[] | null | undefined;
  getEmbeddedDocument?(
    embeddedName: string,
    id: string,
    options?: { readonly invalid?: boolean; readonly strict?: boolean },
  ): FoundryActiveEffectDocument | null | undefined;
}

export interface FoundryActiveEffectReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryActiveEffectParentDocument | null> | FoundryActiveEffectParentDocument | null;
  readonly game?: {
    readonly actors?: { get(id: string): FoundryActiveEffectParentDocument | null | undefined };
    readonly items?: { get(id: string): FoundryActiveEffectParentDocument | null | undefined };
  };
}

export interface FoundryActiveEffectIdentity {
  readonly effectId: string;
  readonly effectUuid: string;
  readonly displayName?: string;
}

export interface FoundryActiveEffectObservation extends FoundryActiveEffectIdentity {
  readonly parentBinding: RuntimeBinding;
  readonly disabled: boolean | null;
  readonly isSuppressed: boolean | null;
  readonly active: boolean | null;
  readonly changeCount: number | null;
  /** The icon path itself is never returned. */
  readonly iconPresent: boolean | null;
}

export interface FoundryActiveEffectCollectionObservation {
  readonly parentBinding: RuntimeBinding;
  readonly count: number;
  readonly entries: readonly FoundryActiveEffectIdentity[];
}

export interface FoundryActiveEffectReadAdapter {
  readonly adapterId: "foundry.active-effect.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly parentResolve: "fromUuid" | "game.actors.get" | "game.items.get";
    readonly embeddedCollection: 'parent.getEmbeddedCollection("ActiveEffect")';
    readonly embeddedDocument: 'parent.getEmbeddedDocument("ActiveEffect", id)';
  };
  read(parentBinding: RuntimeBinding, effectId: string): Promise<Result<FoundryActiveEffectObservation | null>>;
  list(parentBinding: RuntimeBinding): Promise<Result<FoundryActiveEffectCollectionObservation>>;
}

function error(code: DiceBoxError["code"], message: string, retry: DiceBoxError["retry"]): DiceBoxError {
  return { code, message, retry };
}

function fail<T>(code: DiceBoxError["code"], message: string, retry: DiceBoxError["retry"]): Result<T> {
  return { ok: false, error: error(code, message, retry) };
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isParentBinding(binding: RuntimeBinding): binding is RuntimeBinding & {
  readonly documentType: FoundryActiveEffectParentType;
} {
  return (foundryActiveEffectParentTypes as readonly string[]).includes(binding.documentType)
    && binding.semantic.kind === (binding.documentType === "Actor" ? "actor" : "item");
}

function collectionEntries(value: FoundryActiveEffectCollection | readonly unknown[] | null | undefined): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const contents = (value as FoundryActiveEffectCollection).contents;
    if (Array.isArray(contents)) return contents;
  }
  return null;
}

function changeCount(value: FoundryActiveEffectDocument): number | null {
  if (Array.isArray(value.changes)) return value.changes.length;
  if (value.changes && typeof value.changes === "object" && !Array.isArray(value.changes)) {
    const contents = (value.changes as { readonly contents?: readonly unknown[] }).contents;
    if (Array.isArray(contents)) return contents.length;
  }
  return null;
}

function identity(effect: FoundryActiveEffectDocument): Result<FoundryActiveEffectIdentity> {
  const effectId = nonEmptyString(effect.id) ?? nonEmptyString(effect._id);
  const effectUuid = nonEmptyString(effect.uuid);
  if (!effectId || !effectUuid || effect.documentName !== "ActiveEffect") {
    return fail("UNKNOWN_OUTCOME", "Foundry returned an ActiveEffect without complete identity metadata.", "after-reread");
  }
  const displayName = nonEmptyString(effect.name);
  return {
    ok: true,
    value: {
      effectId,
      effectUuid,
      ...(displayName ? { displayName } : {}),
    },
  };
}

function validateParentBinding(binding: RuntimeBinding): Result<true> {
  return isParentBinding(binding)
    ? { ok: true, value: true }
    : fail("FORBIDDEN", "ActiveEffect observation requires an Actor or Item parent binding.", "never");
}

function verifyParent(parent: FoundryActiveEffectParentDocument, binding: RuntimeBinding): Result<true> {
  if (parent.documentName !== binding.documentType) {
    return fail("FORBIDDEN", "The resolved ActiveEffect parent has the wrong Foundry document type.", "never");
  }
  const id = nonEmptyString(parent.id) ?? nonEmptyString(parent._id);
  const uuid = nonEmptyString(parent.uuid);
  if (!id || !uuid || id !== binding.documentId || uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved ActiveEffect parent identity does not match the reviewed binding.", "after-reread");
  }
  return { ok: true, value: true };
}

function observe(effect: FoundryActiveEffectDocument, parentBinding: RuntimeBinding): Result<FoundryActiveEffectObservation> {
  const base = identity(effect);
  if (!base.ok) return base;
  return {
    ok: true,
    value: {
      ...base.value,
      parentBinding,
      disabled: typeof effect.disabled === "boolean" ? effect.disabled : null,
      isSuppressed: typeof effect.isSuppressed === "boolean" ? effect.isSuppressed : null,
      active: typeof effect.active === "boolean" ? effect.active : null,
      changeCount: changeCount(effect),
      iconPresent: effect.icon === undefined ? null : typeof effect.icon === "string" && effect.icon.length > 0,
    },
  };
}

export function createFoundryActiveEffectReadAdapter(
  options: FoundryActiveEffectReadAdapterOptions,
): FoundryActiveEffectReadAdapter {
  const parentResolve = options.fromUuid
    ? "fromUuid"
    : options.game?.actors ? "game.actors.get" : "game.items.get";
  const resolveParent = async (binding: RuntimeBinding): Promise<Result<FoundryActiveEffectParentDocument | null>> => {
    const valid = validateParentBinding(binding);
    if (!valid.ok) return valid;
    try {
      if (options.fromUuid) return { ok: true, value: await options.fromUuid(binding.uuid) };
      const collection = binding.documentType === "Actor" ? options.game?.actors : options.game?.items;
      if (collection) return { ok: true, value: collection.get(binding.documentId) ?? null };
      return fail("UNAVAILABLE", "No exact Foundry Actor or Item resolution surface was observed.", "never");
    } catch {
      return fail("UNKNOWN_OUTCOME", "Foundry ActiveEffect parent resolution failed; outcome is unknown.", "after-reread");
    }
  };
  const resolveAndVerify = async (binding: RuntimeBinding): Promise<Result<FoundryActiveEffectParentDocument | null>> => {
    const resolved = await resolveParent(binding);
    if (!resolved.ok || !resolved.value) return resolved;
    const verified = verifyParent(resolved.value, binding);
    if (!verified.ok) return verified;
    return resolved;
  };

  return {
    adapterId: "foundry.active-effect.read@14.367",
    runtime: "foundry",
    foundryApi: {
      parentResolve,
      embeddedCollection: 'parent.getEmbeddedCollection("ActiveEffect")',
      embeddedDocument: 'parent.getEmbeddedDocument("ActiveEffect", id)',
    },
    async read(parentBinding, effectId) {
      const valid = validateParentBinding(parentBinding);
      if (!valid.ok) return valid;
      if (!nonEmptyString(effectId)) return fail("INVALID_INPUT", "ActiveEffect ID must be a non-empty runtime identifier.", "never");
      const parentResult = await resolveAndVerify(parentBinding);
      if (!parentResult.ok) return parentResult;
      if (!parentResult.value) return { ok: true, value: null };
      if (typeof parentResult.value.getEmbeddedDocument !== "function") {
        return fail("UNAVAILABLE", "Parent.getEmbeddedDocument was not observed in the exact runtime.", "never");
      }
      let effect: FoundryActiveEffectDocument | null | undefined;
      try {
        effect = parentResult.value.getEmbeddedDocument("ActiveEffect", effectId, { strict: false });
      } catch {
        return fail("UNKNOWN_OUTCOME", "ActiveEffect resolution failed; outcome is unknown.", "after-reread");
      }
      if (!effect) return { ok: true, value: null };
      return observe(effect, parentBinding);
    },
    async list(parentBinding) {
      const valid = validateParentBinding(parentBinding);
      if (!valid.ok) return valid;
      const parentResult = await resolveAndVerify(parentBinding);
      if (!parentResult.ok) return parentResult;
      if (!parentResult.value) return fail("UNKNOWN_OUTCOME", "The reviewed ActiveEffect parent is missing during reread.", "after-reread");
      if (typeof parentResult.value.getEmbeddedCollection !== "function") {
        return fail("UNAVAILABLE", "Parent.getEmbeddedCollection was not observed in the exact runtime.", "never");
      }
      let collection: FoundryActiveEffectCollection | readonly unknown[] | null | undefined;
      try {
        collection = parentResult.value.getEmbeddedCollection("ActiveEffect");
      } catch {
        return fail("UNKNOWN_OUTCOME", "ActiveEffect collection resolution failed; outcome is unknown.", "after-reread");
      }
      const values = collectionEntries(collection);
      if (!values) return fail("UNKNOWN_OUTCOME", "The ActiveEffect collection shape is unknown.", "after-reread");
      const entries: FoundryActiveEffectIdentity[] = [];
      for (const value of values) {
        if (!value || typeof value !== "object") return fail("UNKNOWN_OUTCOME", "The ActiveEffect collection contains an unknown entry.", "after-reread");
        const entry = identity(value as FoundryActiveEffectDocument);
        if (!entry.ok) return entry;
        entries.push(entry.value);
      }
      entries.sort((left, right) => left.effectId.localeCompare(right.effectId));
      return { ok: true, value: { parentBinding, count: entries.length, entries } };
    },
  };
}
