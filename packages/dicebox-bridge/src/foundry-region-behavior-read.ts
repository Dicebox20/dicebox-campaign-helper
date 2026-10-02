import {
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

/** Read-only Region parent surface required to observe embedded RegionBehavior documents. */
export interface FoundryRegionBehaviorParentDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  getEmbeddedCollection?(embeddedName: string): { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined;
  getEmbeddedDocument?(
    embeddedName: string,
    id: string,
    options?: { readonly invalid?: boolean; readonly strict?: boolean },
  ): FoundryRegionBehaviorDocument | null | undefined;
}

/** Structural RegionBehavior fields; raw system/configuration data is intentionally excluded. */
export interface FoundryRegionBehaviorDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
  readonly type?: string;
  readonly disabled?: unknown;
  readonly active?: unknown;
  readonly parent?: { readonly uuid?: string | null } | null;
  readonly region?: { readonly uuid?: string | null } | null;
}

export interface FoundryRegionBehaviorReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryRegionBehaviorParentDocument | null>
    | FoundryRegionBehaviorParentDocument
    | null;
}

export interface FoundryRegionBehaviorIdentity {
  readonly behaviorId: string;
  readonly behaviorUuid: string;
  readonly behaviorType: string;
  readonly displayName?: string;
}

export interface FoundryRegionBehaviorObservation extends FoundryRegionBehaviorIdentity {
  readonly regionBinding: RuntimeBinding;
  readonly disabled: boolean | null;
  readonly active: boolean | null;
  readonly parentRegionUuid: string | null;
}

export interface FoundryRegionBehaviorCollectionObservation {
  readonly regionBinding: RuntimeBinding;
  readonly count: number;
  readonly entries: readonly FoundryRegionBehaviorIdentity[];
}

export interface FoundryRegionBehaviorReadAdapter {
  readonly adapterId: "foundry.region-behavior.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly regionResolve: "fromUuid";
    readonly embeddedCollection: 'region.getEmbeddedCollection("RegionBehavior")';
    readonly embeddedDocument: 'region.getEmbeddedDocument("RegionBehavior", id)';
  };
  read(regionBinding: RuntimeBinding, behaviorId: string): Promise<Result<FoundryRegionBehaviorObservation | null>>;
  list(regionBinding: RuntimeBinding): Promise<Result<FoundryRegionBehaviorCollectionObservation>>;
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

function isRegionBinding(binding: RuntimeBinding): boolean {
  return binding.documentType === "Region" && binding.semantic.kind === "region";
}

function collectionEntries(
  value: { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined,
): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const contents = (value as { readonly contents?: readonly unknown[] }).contents;
    if (Array.isArray(contents)) return contents;
  }
  return null;
}

function identity(document: FoundryRegionBehaviorDocument): Result<FoundryRegionBehaviorIdentity> {
  const behaviorId = nonEmptyString(document.id) ?? nonEmptyString(document._id);
  const behaviorUuid = nonEmptyString(document.uuid);
  const behaviorType = nonEmptyString(document.type);
  if (!behaviorId || !behaviorUuid || document.documentName !== "RegionBehavior" || !behaviorType) {
    return fail("UNKNOWN_OUTCOME", "Foundry returned a RegionBehavior without complete identity metadata.", "after-reread");
  }
  const displayName = nonEmptyString(document.name);
  return {
    ok: true,
    value: {
      behaviorId,
      behaviorUuid,
      behaviorType,
      ...(displayName ? { displayName } : {}),
    },
  };
}

function validateRegionBinding(binding: RuntimeBinding): Result<true> {
  return isRegionBinding(binding)
    ? { ok: true, value: true }
    : fail("FORBIDDEN", "RegionBehavior observation requires a Region binding.", "never");
}

function verifyRegion(parent: FoundryRegionBehaviorParentDocument, binding: RuntimeBinding): Result<true> {
  if (parent.documentName !== "Region") {
    return fail("FORBIDDEN", "The resolved RegionBehavior parent is not a Foundry Region.", "never");
  }
  const documentId = nonEmptyString(parent.id) ?? nonEmptyString(parent._id);
  const uuid = nonEmptyString(parent.uuid);
  if (!documentId || !uuid || documentId !== binding.documentId || uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved Region identity does not match the reviewed binding.", "after-reread");
  }
  return { ok: true, value: true };
}

function observe(
  document: FoundryRegionBehaviorDocument,
  regionBinding: RuntimeBinding,
): Result<FoundryRegionBehaviorObservation> {
  const base = identity(document);
  if (!base.ok) return base;
  const parentRegionUuid = nonEmptyString(document.parent?.uuid) ?? nonEmptyString(document.region?.uuid);
  if (parentRegionUuid !== null && parentRegionUuid !== regionBinding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The RegionBehavior parent UUID does not match the reviewed Region binding.", "after-reread");
  }
  return {
    ok: true,
    value: {
      ...base.value,
      regionBinding,
      disabled: typeof document.disabled === "boolean" ? document.disabled : null,
      active: typeof document.active === "boolean" ? document.active : null,
      parentRegionUuid,
    },
  };
}

export function createFoundryRegionBehaviorReadAdapter(
  options: FoundryRegionBehaviorReadAdapterOptions,
): FoundryRegionBehaviorReadAdapter {
  return {
    adapterId: "foundry.region-behavior.read@14.367",
    runtime: "foundry",
    foundryApi: {
      regionResolve: "fromUuid",
      embeddedCollection: 'region.getEmbeddedCollection("RegionBehavior")',
      embeddedDocument: 'region.getEmbeddedDocument("RegionBehavior", id)',
    },
    async read(regionBinding, behaviorId) {
      const valid = validateRegionBinding(regionBinding);
      if (!valid.ok) return valid;
      if (!nonEmptyString(behaviorId)) {
        return fail("INVALID_INPUT", "RegionBehavior ID must be a non-empty runtime identifier.", "never");
      }
      if (!options.fromUuid) {
        return fail("UNAVAILABLE", "No exact Foundry Region resolution surface was observed.", "never");
      }
      let region: FoundryRegionBehaviorParentDocument | null;
      try {
        region = await options.fromUuid(regionBinding.uuid);
      } catch {
        return fail("UNKNOWN_OUTCOME", "Foundry Region resolution failed; outcome is unknown.", "after-reread");
      }
      if (!region) return { ok: true, value: null };
      const verified = verifyRegion(region, regionBinding);
      if (!verified.ok) return verified;
      if (typeof region.getEmbeddedDocument !== "function") {
        return fail("UNAVAILABLE", "Region.getEmbeddedDocument was not observed in the exact runtime.", "never");
      }
      let behavior: FoundryRegionBehaviorDocument | null | undefined;
      try {
        behavior = region.getEmbeddedDocument("RegionBehavior", behaviorId, { strict: false });
      } catch {
        return fail("UNKNOWN_OUTCOME", "RegionBehavior resolution failed; outcome is unknown.", "after-reread");
      }
      if (!behavior) return { ok: true, value: null };
      return observe(behavior, regionBinding);
    },
    async list(regionBinding) {
      const valid = validateRegionBinding(regionBinding);
      if (!valid.ok) return valid;
      if (!options.fromUuid) {
        return fail("UNAVAILABLE", "No exact Foundry Region resolution surface was observed.", "never");
      }
      let region: FoundryRegionBehaviorParentDocument | null;
      try {
        region = await options.fromUuid(regionBinding.uuid);
      } catch {
        return fail("UNKNOWN_OUTCOME", "Foundry Region resolution failed; outcome is unknown.", "after-reread");
      }
      if (!region) return fail("UNKNOWN_OUTCOME", "The reviewed Region is missing during reread.", "after-reread");
      const verified = verifyRegion(region, regionBinding);
      if (!verified.ok) return verified;
      if (typeof region.getEmbeddedCollection !== "function") {
        return fail("UNAVAILABLE", "Region.getEmbeddedCollection was not observed in the exact runtime.", "never");
      }
      let collection: { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined;
      try {
        collection = region.getEmbeddedCollection("RegionBehavior");
      } catch {
        return fail("UNKNOWN_OUTCOME", "RegionBehavior collection resolution failed; outcome is unknown.", "after-reread");
      }
      const values = collectionEntries(collection);
      if (!values) return fail("UNKNOWN_OUTCOME", "The RegionBehavior collection shape is unknown.", "after-reread");
      const entries: FoundryRegionBehaviorIdentity[] = [];
      for (const value of values) {
        if (!value || typeof value !== "object") {
          return fail("UNKNOWN_OUTCOME", "The RegionBehavior collection contains an unknown entry.", "after-reread");
        }
        const entry = identity(value as FoundryRegionBehaviorDocument);
        if (!entry.ok) return entry;
        entries.push(entry.value);
      }
      entries.sort((left, right) => left.behaviorId.localeCompare(right.behaviorId));
      return { ok: true, value: { regionBinding, count: entries.length, entries } };
    },
  };
}
