import {
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

/** Read-only structural view of the v14 RegionDocument fields used by M6. */
export interface FoundryRegionDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
  readonly parent?: { readonly uuid?: string | null } | null;
  readonly shapes?: readonly {
    readonly type?: unknown;
    readonly hole?: unknown;
  }[] | { readonly contents?: readonly unknown[] };
  readonly behaviors?: readonly {
    readonly type?: unknown;
  }[] | { readonly contents?: readonly unknown[] };
}

export interface FoundryRegionReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryRegionDocument | null> | FoundryRegionDocument | null;
}

export interface FoundryRegionObservation {
  readonly binding: RuntimeBinding;
  readonly documentId: string;
  readonly uuid: string;
  readonly displayName?: string;
  readonly parentSceneUuid?: string;
  readonly shapeCount: number;
  readonly shapeKinds: readonly string[];
  readonly holeCount: number;
  readonly behaviorCount: number;
  readonly behaviorTypes: readonly string[];
}

export interface FoundryRegionReadAdapter {
  readonly adapterId: "foundry.region.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly read: "fromUuid";
    readonly document: "RegionDocument";
    readonly shapes: "RegionDocument.shapes";
    readonly behaviors: "RegionDocument.behaviors";
  };
  read(binding: RuntimeBinding): Promise<Result<FoundryRegionObservation | null>>;
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

function entries(value: FoundryRegionDocument["shapes"]): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && "contents" in value) {
    const contents = value.contents;
    return Array.isArray(contents) ? contents : null;
  }
  return null;
}

function summarizeShapes(value: FoundryRegionDocument["shapes"]): {
  readonly count: number;
  readonly kinds: readonly string[];
  readonly holeCount: number;
} | null {
  const values = entries(value);
  if (!values) return null;
  const kinds: string[] = [];
  let holeCount = 0;
  for (const shape of values) {
    if (!shape || typeof shape !== "object") return null;
    const record = shape as Record<string, unknown>;
    const type = nonEmptyString(record.type);
    if (!type) return null;
    kinds.push(type);
    if ("hole" in record && typeof record.hole !== "boolean") return null;
    if (record.hole === true) holeCount += 1;
  }
  return {
    count: values.length,
    kinds: [...new Set(kinds)].sort(),
    holeCount,
  };
}

function summarizeBehaviors(value: FoundryRegionDocument["behaviors"]): {
  readonly count: number;
  readonly types: readonly string[];
} | null {
  const values = entries(value);
  if (!values) return null;
  const types: string[] = [];
  for (const behavior of values) {
    if (!behavior || typeof behavior !== "object") return null;
    const type = nonEmptyString("type" in behavior ? behavior.type : undefined);
    if (!type) return null;
    types.push(type);
  }
  return { count: values.length, types: [...new Set(types)].sort() };
}

function observe(
  document: FoundryRegionDocument,
  binding: RuntimeBinding,
): Result<FoundryRegionObservation> {
  const type = nonEmptyString(document.documentName);
  const documentId = nonEmptyString(document.id) ?? nonEmptyString(document._id);
  const uuid = nonEmptyString(document.uuid);
  if (!type || !documentId || !uuid) {
    return fail("UNKNOWN_OUTCOME", "Foundry returned a Region without complete identity metadata.", "after-reread");
  }
  if (type !== "Region" || binding.documentType !== "Region") {
    return fail("FORBIDDEN", "The Region adapter accepts only the reviewed Foundry Region type.", "never");
  }
  if (documentId !== binding.documentId || uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved Region identity does not match the reviewed binding.", "after-reread");
  }
  const shapes = summarizeShapes(document.shapes);
  const behaviors = summarizeBehaviors(document.behaviors);
  if (!shapes || !behaviors) {
    return fail("UNKNOWN_OUTCOME", "The Region shapes or behaviors collection shape is unknown.", "after-reread");
  }
  const displayName = nonEmptyString(document.name);
  const parentSceneUuid = nonEmptyString(document.parent?.uuid);
  return {
    ok: true,
    value: {
      binding,
      documentId,
      uuid,
      ...(displayName ? { displayName } : {}),
      ...(parentSceneUuid ? { parentSceneUuid } : {}),
      shapeCount: shapes.count,
      shapeKinds: shapes.kinds,
      holeCount: shapes.holeCount,
      behaviorCount: behaviors.count,
      behaviorTypes: behaviors.types,
    },
  };
}

export function createFoundryRegionReadAdapter(
  options: FoundryRegionReadAdapterOptions,
): FoundryRegionReadAdapter {
  return {
    adapterId: "foundry.region.read@14.367",
    runtime: "foundry",
    foundryApi: {
      read: "fromUuid",
      document: "RegionDocument",
      shapes: "RegionDocument.shapes",
      behaviors: "RegionDocument.behaviors",
    },
    async read(binding) {
      if (binding.documentType !== "Region") {
        return fail("FORBIDDEN", "The Region adapter accepts only Region bindings.", "never");
      }
      if (!options.fromUuid) {
        return fail("UNAVAILABLE", "No exact Foundry Region read surface was observed.", "never");
      }
      let document: FoundryRegionDocument | null;
      try {
        document = await options.fromUuid(binding.uuid);
      } catch {
        return fail("UNKNOWN_OUTCOME", "Foundry Region resolution failed; outcome is unknown.", "after-reread");
      }
      if (!document) return { ok: true, value: null };
      return observe(document, binding);
    },
  };
}
