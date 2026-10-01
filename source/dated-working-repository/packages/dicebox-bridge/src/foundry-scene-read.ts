import {
  type DiceBoxError,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

export interface FoundrySceneDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
  readonly dimensions?: {
    readonly width?: unknown;
    readonly height?: unknown;
  };
  readonly grid?: {
    readonly size?: unknown;
    readonly type?: unknown;
  };
  readonly walls?: readonly unknown[] | { readonly contents?: readonly unknown[] };
  readonly regions?: readonly unknown[] | { readonly contents?: readonly unknown[] };
}

export interface FoundrySceneReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundrySceneDocument | null> | FoundrySceneDocument | null;
  readonly game?: {
    readonly scenes?: {
      get(id: string): FoundrySceneDocument | null | undefined;
    };
  };
}

export interface FoundrySceneObservation {
  readonly binding: RuntimeBinding;
  readonly documentId: string;
  readonly uuid: string;
  readonly displayName?: string;
  readonly width: number;
  readonly height: number;
  readonly gridSize: number;
  readonly gridType: string | number | null;
  readonly wallCount: number;
  readonly regionCount: number;
}

export interface FoundrySceneReadAdapter {
  readonly adapterId: "foundry.scene.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly read: "fromUuid" | "game.scenes.get";
  };
  read(binding: RuntimeBinding): Promise<Result<FoundrySceneObservation | null>>;
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

function positiveNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

function collectionCount(value: FoundrySceneDocument["walls"]): number | null {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === "object" && "contents" in value) {
    const contents = value.contents;
    if (Array.isArray(contents)) return contents.length;
  }
  return null;
}

function observe(
  document: FoundrySceneDocument,
  binding: RuntimeBinding,
): Result<FoundrySceneObservation> {
  const type = nonEmptyString(document.documentName);
  const documentId = nonEmptyString(document.id) ?? nonEmptyString(document._id);
  const uuid = nonEmptyString(document.uuid);
  if (!type || !documentId || !uuid) {
    return fail("UNKNOWN_OUTCOME", "Foundry returned a Scene without complete identity metadata.", "after-reread");
  }
  if (type !== "Scene" || binding.documentType !== "Scene") {
    return fail("FORBIDDEN", "The resolved document is not the reviewed Foundry Scene.", "never");
  }
  if (documentId !== binding.documentId || uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved Scene identity does not match the reviewed binding.", "after-reread");
  }

  const width = positiveNumber(document.dimensions?.width);
  const height = positiveNumber(document.dimensions?.height);
  const gridSize = positiveNumber(document.grid?.size);
  const wallCount = collectionCount(document.walls);
  const regionCount = collectionCount(document.regions);
  if (width === null || height === null || gridSize === null || wallCount === null || regionCount === null) {
    return fail("UNKNOWN_OUTCOME", "The Scene geometry or embedded collection shape is unknown.", "after-reread");
  }
  const gridType = typeof document.grid?.type === "string" || typeof document.grid?.type === "number"
    ? document.grid.type
    : null;
  const displayName = nonEmptyString(document.name);
  return {
    ok: true,
    value: {
      binding,
      documentId,
      uuid,
      ...(displayName ? { displayName } : {}),
      width,
      height,
      gridSize,
      gridType,
      wallCount,
      regionCount,
    },
  };
}

export function createFoundrySceneReadAdapter(
  options: FoundrySceneReadAdapterOptions,
): FoundrySceneReadAdapter {
  const readApi = options.fromUuid ? "fromUuid" : "game.scenes.get";
  return {
    adapterId: "foundry.scene.read@14.367",
    runtime: "foundry",
    foundryApi: { read: readApi },
    async read(binding) {
      if (binding.documentType !== "Scene") {
        return fail("FORBIDDEN", "The Scene adapter accepts only Scene bindings.", "never");
      }
      let document: FoundrySceneDocument | null | undefined;
      try {
        if (options.fromUuid) {
          document = await options.fromUuid(binding.uuid);
        } else if (options.game?.scenes) {
          document = options.game.scenes.get(binding.documentId);
        } else {
          return fail("UNAVAILABLE", "No exact Foundry Scene read surface was observed.", "never");
        }
      } catch {
        return fail("UNKNOWN_OUTCOME", "Foundry Scene resolution failed; outcome is unknown.", "after-reread");
      }
      if (!document) return { ok: true, value: null };
      return observe(document, binding);
    },
  };
}
