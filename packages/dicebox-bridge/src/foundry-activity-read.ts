import {
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

/** The D&D5e system-owned Activity document shape needed for observation only. */
export interface FoundryDnd5eActivityDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly name?: string;
  readonly type?: string;
  readonly canUse?: unknown;
  readonly isOwner?: unknown;
  readonly item?: { readonly uuid?: string | null };
}

export interface FoundryDnd5eActivityCollection {
  readonly contents?: readonly unknown[];
}

export interface FoundryDnd5eItemDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly system?: {
    readonly activities?: FoundryDnd5eActivityCollection | readonly unknown[] | null;
  };
  getEmbeddedDocument?(
    embeddedName: string,
    id: string,
    options?: { readonly invalid?: boolean; readonly strict?: boolean },
  ): FoundryDnd5eActivityDocument | null | undefined;
}

export interface FoundryDnd5eActivityReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryDnd5eItemDocument | null> | FoundryDnd5eItemDocument | null;
  readonly game?: {
    readonly items?: {
      get(id: string): FoundryDnd5eItemDocument | null | undefined;
    };
  };
}

export interface FoundryDnd5eActivityIdentity {
  readonly activityId: string;
  readonly activityUuid: string;
  readonly activityType: string;
  readonly displayName?: string;
}

export interface FoundryDnd5eActivityObservation extends FoundryDnd5eActivityIdentity {
  readonly itemBinding: RuntimeBinding;
  readonly canUse: boolean | null;
  readonly isOwner: boolean | null;
  readonly parentItemUuid: string | null;
}

export interface FoundryDnd5eActivityCollectionObservation {
  readonly itemBinding: RuntimeBinding;
  readonly count: number;
  readonly entries: readonly FoundryDnd5eActivityIdentity[];
}

export interface FoundryDnd5eActivityReadAdapter {
  readonly adapterId: "foundry.dnd5e-activity.read@14.367-5.3.3";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly itemResolve: "fromUuid" | "game.items.get";
    readonly activityRead: 'item.getEmbeddedDocument("Activity", id)';
    readonly activityCollection: "item.system.activities.contents";
  };
  read(itemBinding: RuntimeBinding, activityId: string): Promise<Result<FoundryDnd5eActivityObservation | null>>;
  list(itemBinding: RuntimeBinding): Promise<Result<FoundryDnd5eActivityCollectionObservation>>;
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

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isItemBinding(binding: RuntimeBinding): boolean {
  return binding.documentType === "Item" && binding.semantic.kind === "item";
}

function collectionEntries(
  value: FoundryDnd5eActivityCollection | readonly unknown[] | null | undefined,
): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const contents = (value as FoundryDnd5eActivityCollection).contents;
    if (Array.isArray(contents)) return contents;
  }
  return null;
}

function identity(
  activity: FoundryDnd5eActivityDocument,
): Result<FoundryDnd5eActivityIdentity> {
  const activityId = nonEmptyString(activity.id) ?? nonEmptyString(activity._id);
  const activityUuid = nonEmptyString(activity.uuid);
  const activityType = nonEmptyString(activity.type);
  if (!activityId || !activityUuid || !activityType) {
    return fail("UNKNOWN_OUTCOME", "D&D5e returned an Activity without complete identity metadata.", "after-reread");
  }
  const displayName = nonEmptyString(activity.name);
  return {
    ok: true,
    value: {
      activityId,
      activityUuid,
      activityType,
      ...(displayName ? { displayName } : {}),
    },
  };
}

function verifyItem(item: FoundryDnd5eItemDocument, binding: RuntimeBinding): Result<true> {
  if (item.documentName !== "Item") {
    return fail("FORBIDDEN", "The resolved parent is not a Foundry Item.", "never");
  }
  const itemId = nonEmptyString(item.id) ?? nonEmptyString(item._id);
  const itemUuid = nonEmptyString(item.uuid);
  if (!itemId || !itemUuid || itemId !== binding.documentId || itemUuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved Item identity does not match the reviewed binding.", "after-reread");
  }
  return { ok: true, value: true };
}

function validateItemBinding(binding: RuntimeBinding): Result<true> {
  return isItemBinding(binding)
    ? { ok: true, value: true }
    : fail("FORBIDDEN", "D&D5e Activity observation requires an Item parent binding.", "never");
}

function observe(
  activity: FoundryDnd5eActivityDocument,
  itemBinding: RuntimeBinding,
): Result<FoundryDnd5eActivityObservation> {
  const base = identity(activity);
  if (!base.ok) return base;
  const parentItemUuid = nonEmptyString(activity.item?.uuid);
  if (parentItemUuid !== null && parentItemUuid !== itemBinding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The Activity parent UUID does not match the reviewed Item binding.", "after-reread");
  }
  return {
    ok: true,
    value: {
      ...base.value,
      itemBinding,
      canUse: typeof activity.canUse === "boolean" ? activity.canUse : null,
      isOwner: typeof activity.isOwner === "boolean" ? activity.isOwner : null,
      parentItemUuid,
    },
  };
}

export function createFoundryDnd5eActivityReadAdapter(
  options: FoundryDnd5eActivityReadAdapterOptions,
): FoundryDnd5eActivityReadAdapter {
  const itemResolve = options.fromUuid ? "fromUuid" : "game.items.get";
  const resolveItem = async (binding: RuntimeBinding): Promise<Result<FoundryDnd5eItemDocument | null>> => {
    const valid = validateItemBinding(binding);
    if (!valid.ok) return valid;
    try {
      if (options.fromUuid) return { ok: true, value: await options.fromUuid(binding.uuid) };
      if (options.game?.items) return { ok: true, value: options.game.items.get(binding.documentId) ?? null };
      return fail("UNAVAILABLE", "No exact Foundry Item resolution surface was observed.", "never");
    } catch {
      return fail("UNKNOWN_OUTCOME", "Foundry Item resolution failed; outcome is unknown.", "after-reread");
    }
  };

  const verifyAndResolve = async (
    binding: RuntimeBinding,
  ): Promise<Result<FoundryDnd5eItemDocument | null>> => {
    const resolved = await resolveItem(binding);
    if (!resolved.ok || !resolved.value) return resolved;
    const verified = verifyItem(resolved.value, binding);
    if (!verified.ok) return verified;
    return resolved;
  };

  return {
    adapterId: "foundry.dnd5e-activity.read@14.367-5.3.3",
    runtime: "foundry",
    foundryApi: {
      itemResolve,
      activityRead: 'item.getEmbeddedDocument("Activity", id)',
      activityCollection: "item.system.activities.contents",
    },
    async read(itemBinding, activityId) {
      const valid = validateItemBinding(itemBinding);
      if (!valid.ok) return valid;
      if (!nonEmptyString(activityId)) {
        return fail("INVALID_INPUT", "Activity ID must be a non-empty runtime identifier.", "never");
      }
      const itemResult = await verifyAndResolve(itemBinding);
      if (!itemResult.ok) return itemResult;
      if (!itemResult.value) return { ok: true, value: null };
      if (typeof itemResult.value.getEmbeddedDocument !== "function") {
        return fail("UNAVAILABLE", "Item.getEmbeddedDocument was not observed in the exact runtime.", "never");
      }
      let activity: FoundryDnd5eActivityDocument | null | undefined;
      try {
        activity = itemResult.value.getEmbeddedDocument("Activity", activityId, { strict: false });
      } catch {
        return fail("UNKNOWN_OUTCOME", "D&D5e Activity resolution failed; outcome is unknown.", "after-reread");
      }
      if (!activity) return { ok: true, value: null };
      return observe(activity, itemBinding);
    },
    async list(itemBinding) {
      const valid = validateItemBinding(itemBinding);
      if (!valid.ok) return valid;
      const itemResult = await verifyAndResolve(itemBinding);
      if (!itemResult.ok) return itemResult;
      if (!itemResult.value) {
        return fail("UNKNOWN_OUTCOME", "The reviewed Item is missing during Activity reread.", "after-reread");
      }
      const values = collectionEntries(itemResult.value.system?.activities);
      if (!values) {
        return fail("UNKNOWN_OUTCOME", "The D&D5e Item Activity collection shape is unknown.", "after-reread");
      }
      const entries: FoundryDnd5eActivityIdentity[] = [];
      for (const value of values) {
        if (!value || typeof value !== "object") {
          return fail("UNKNOWN_OUTCOME", "The D&D5e Activity collection contains an unknown entry.", "after-reread");
        }
        const entry = identity(value as FoundryDnd5eActivityDocument);
        if (!entry.ok) return entry;
        entries.push(entry.value);
      }
      entries.sort((left, right) => left.activityId.localeCompare(right.activityId));
      return {
        ok: true,
        value: {
          itemBinding,
          count: entries.length,
          entries,
        },
      };
    },
  };
}
