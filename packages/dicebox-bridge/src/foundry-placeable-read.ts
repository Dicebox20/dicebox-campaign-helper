import {
  type DiceBoxError,
  type FoundryDocumentType,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

export const foundryPlaceableDocumentTypes = [
  "Tile",
  "Token",
  "AmbientLight",
  "AmbientSound",
  "Drawing",
  "Note",
] as const;

export type FoundryPlaceableDocumentType = (typeof foundryPlaceableDocumentTypes)[number];

export interface FoundryEmbeddedPlaceableDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
  readonly x?: unknown;
  readonly y?: unknown;
  readonly width?: unknown;
  readonly height?: unknown;
  readonly rotation?: unknown;
  readonly texture?: unknown;
  readonly img?: unknown;
  readonly sound?: unknown;
}

export interface FoundryEmbeddedCollection {
  readonly contents?: readonly unknown[];
}

export interface FoundryScenePlaceableDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  getEmbeddedCollection?(embeddedName: string): FoundryEmbeddedCollection | readonly unknown[] | null | undefined;
  getEmbeddedDocument?(
    embeddedName: string,
    id: string,
    options?: { readonly invalid?: boolean; readonly strict?: boolean },
  ): FoundryEmbeddedPlaceableDocument | null | undefined;
}

export interface FoundryScenePlaceableReadAdapterOptions {
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryScenePlaceableDocument | null> | FoundryScenePlaceableDocument | null;
  readonly game?: {
    readonly scenes?: {
      get(id: string): FoundryScenePlaceableDocument | null | undefined;
    };
  };
}

export interface FoundryEmbeddedPlaceableIdentity {
  readonly documentType: FoundryPlaceableDocumentType;
  readonly documentId: string;
  readonly uuid: string;
  readonly displayName?: string;
}

export interface FoundryPlaceableObservation extends FoundryEmbeddedPlaceableIdentity {
  readonly binding: RuntimeBinding;
  readonly position: { readonly x: number; readonly y: number } | null;
  readonly dimensions: { readonly width: number; readonly height: number } | null;
  readonly rotation: number | null;
  /** True/false only; the runtime locator itself is never returned. */
  readonly mediaReferencePresent: boolean | null;
}

export interface FoundryPlaceableCollectionObservation {
  readonly sceneBinding: RuntimeBinding;
  readonly documentType: FoundryPlaceableDocumentType;
  readonly count: number;
  readonly entries: readonly FoundryEmbeddedPlaceableIdentity[];
}

export interface FoundryPlaceableReadQuery {
  readonly sceneBinding: RuntimeBinding;
  readonly placeableBinding: RuntimeBinding;
}

export interface FoundryScenePlaceableReadAdapter {
  readonly adapterId: "foundry.scene-placeable.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly sceneResolve: "fromUuid" | "game.scenes.get";
    readonly embeddedCollection: "scene.getEmbeddedCollection";
    readonly embeddedDocument: "scene.getEmbeddedDocument";
  };
  read(query: FoundryPlaceableReadQuery): Promise<Result<FoundryPlaceableObservation | null>>;
  list(
    sceneBinding: RuntimeBinding,
    documentType: FoundryPlaceableDocumentType,
  ): Promise<Result<FoundryPlaceableCollectionObservation>>;
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

function finiteNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function positiveNumber(value: unknown): number | null {
  const number = finiteNumber(value);
  return number !== null && number > 0 ? number : null;
}

function isPlaceableDocumentType(value: FoundryDocumentType): value is FoundryPlaceableDocumentType {
  return (foundryPlaceableDocumentTypes as readonly string[]).includes(value);
}

function collectionEntries(value: FoundryEmbeddedCollection | readonly unknown[] | null | undefined): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const contents = (value as FoundryEmbeddedCollection).contents;
    if (Array.isArray(contents)) return contents;
  }
  return null;
}

function identity(
  document: FoundryEmbeddedPlaceableDocument,
  expectedType: FoundryPlaceableDocumentType,
): Result<FoundryEmbeddedPlaceableIdentity> {
  const documentType = nonEmptyString(document.documentName);
  const documentId = nonEmptyString(document.id) ?? nonEmptyString(document._id);
  const uuid = nonEmptyString(document.uuid);
  if (!documentType || !documentId || !uuid) {
    return fail("UNKNOWN_OUTCOME", "Foundry returned a placeable without complete identity metadata.", "after-reread");
  }
  if (documentType !== expectedType) {
    return fail("UNKNOWN_OUTCOME", "The embedded document type does not match the reviewed placeable binding.", "after-reread");
  }
  const displayName = nonEmptyString(document.name);
  return {
    ok: true,
    value: {
      documentType: expectedType,
      documentId,
      uuid,
      ...(displayName ? { displayName } : {}),
    },
  };
}

function mediaReferencePresent(document: FoundryEmbeddedPlaceableDocument): boolean | null {
  const record = document as unknown as Record<string, unknown>;
  const references = [record.texture, record.img, record.sound];
  let observed = false;
  for (const reference of references) {
    if (reference === undefined) continue;
    observed = true;
    if (typeof reference === "string" && reference.length > 0) return true;
    if (reference && typeof reference === "object") {
      const source = (reference as Record<string, unknown>).src;
      if (typeof source === "string" && source.length > 0) return true;
    }
  }
  return observed ? false : null;
}

function observe(
  document: FoundryEmbeddedPlaceableDocument,
  binding: RuntimeBinding,
): Result<FoundryPlaceableObservation> {
  if (!isPlaceableDocumentType(binding.documentType)) {
    return fail("FORBIDDEN", "The placeable adapter accepts only reviewed embedded placeable types.", "never");
  }
  const base = identity(document, binding.documentType);
  if (!base.ok) return base;
  if (base.value.documentId !== binding.documentId || base.value.uuid !== binding.uuid) {
    return fail("UNKNOWN_OUTCOME", "The resolved placeable identity does not match the reviewed binding.", "after-reread");
  }
  const x = finiteNumber(document.x);
  const y = finiteNumber(document.y);
  const position = x !== null && y !== null ? { x, y } : null;
  const width = positiveNumber(document.width);
  const height = positiveNumber(document.height);
  const dimensions = width !== null && height !== null ? { width, height } : null;
  const rotation = finiteNumber(document.rotation);
  return {
    ok: true,
    value: {
      ...base.value,
      binding,
      position,
      dimensions,
      rotation,
      mediaReferencePresent: mediaReferencePresent(document),
    },
  };
}

function validateSceneBinding(binding: RuntimeBinding): Result<true> {
  if (binding.documentType !== "Scene" || binding.semantic.kind !== "scene") {
    return fail("FORBIDDEN", "Placeable read-back requires a Scene parent binding.", "never");
  }
  return { ok: true, value: true };
}

function validatePlaceableBinding(binding: RuntimeBinding): Result<FoundryPlaceableDocumentType> {
  if (!isPlaceableDocumentType(binding.documentType)) {
    return fail("FORBIDDEN", "The binding is not an allowlisted Foundry embedded placeable type.", "never");
  }
  return { ok: true, value: binding.documentType };
}

export function createFoundryScenePlaceableReadAdapter(
  options: FoundryScenePlaceableReadAdapterOptions,
): FoundryScenePlaceableReadAdapter {
  const sceneResolve = options.fromUuid ? "fromUuid" : "game.scenes.get";
  const resolveScene = async (binding: RuntimeBinding): Promise<Result<FoundryScenePlaceableDocument | null>> => {
    const valid = validateSceneBinding(binding);
    if (!valid.ok) return valid;
    try {
      if (options.fromUuid) return { ok: true, value: await options.fromUuid(binding.uuid) };
      if (options.game?.scenes) return { ok: true, value: options.game.scenes.get(binding.documentId) ?? null };
      return fail("UNAVAILABLE", "No exact Foundry Scene resolution surface was observed.", "never");
    } catch {
      return fail("UNKNOWN_OUTCOME", "Foundry Scene resolution failed; outcome is unknown.", "after-reread");
    }
  };
  const verifyScene = (
    scene: FoundryScenePlaceableDocument,
    binding: RuntimeBinding,
  ): Result<true> => {
    if (scene.documentName !== "Scene") {
      return fail("FORBIDDEN", "The resolved parent is not a Foundry Scene.", "never");
    }
    const id = nonEmptyString(scene.id) ?? nonEmptyString(scene._id);
    const uuid = nonEmptyString(scene.uuid);
    if (!id || !uuid || id !== binding.documentId || uuid !== binding.uuid) {
      return fail("UNKNOWN_OUTCOME", "The resolved parent Scene identity does not match the reviewed binding.", "after-reread");
    }
    return { ok: true, value: true };
  };

  return {
    adapterId: "foundry.scene-placeable.read@14.367",
    runtime: "foundry",
    foundryApi: {
      sceneResolve,
      embeddedCollection: "scene.getEmbeddedCollection",
      embeddedDocument: "scene.getEmbeddedDocument",
    },
    async read(query) {
      const sceneBindingResult = validateSceneBinding(query.sceneBinding);
      if (!sceneBindingResult.ok) return sceneBindingResult;
      const placeableType = validatePlaceableBinding(query.placeableBinding);
      if (!placeableType.ok) return placeableType;
      const sceneResult = await resolveScene(query.sceneBinding);
      if (!sceneResult.ok) return sceneResult;
      if (!sceneResult.value) return { ok: true, value: null };
      const verified = verifyScene(sceneResult.value, query.sceneBinding);
      if (!verified.ok) return verified;
      if (typeof sceneResult.value.getEmbeddedDocument !== "function") {
        return fail("UNAVAILABLE", "Scene.getEmbeddedDocument was not observed in the exact runtime.", "never");
      }
      let document: FoundryEmbeddedPlaceableDocument | null | undefined;
      try {
        document = sceneResult.value.getEmbeddedDocument(placeableType.value, query.placeableBinding.documentId, { strict: false });
      } catch {
        return fail("UNKNOWN_OUTCOME", "Embedded placeable resolution failed; outcome is unknown.", "after-reread");
      }
      if (!document) return { ok: true, value: null };
      return observe(document, query.placeableBinding);
    },
    async list(sceneBinding, documentType) {
      const sceneBindingResult = validateSceneBinding(sceneBinding);
      if (!sceneBindingResult.ok) return sceneBindingResult;
      if (!isPlaceableDocumentType(documentType)) {
        return fail("FORBIDDEN", "The requested embedded collection is not an allowlisted placeable type.", "never");
      }
      const sceneResult = await resolveScene(sceneBinding);
      if (!sceneResult.ok) return sceneResult;
      if (!sceneResult.value) {
        return fail("UNKNOWN_OUTCOME", "The reviewed parent Scene is missing during placeable reread.", "after-reread");
      }
      const verified = verifyScene(sceneResult.value, sceneBinding);
      if (!verified.ok) return verified;
      if (typeof sceneResult.value.getEmbeddedCollection !== "function") {
        return fail("UNAVAILABLE", "Scene.getEmbeddedCollection was not observed in the exact runtime.", "never");
      }
      let collection: FoundryEmbeddedCollection | readonly unknown[] | null | undefined;
      try {
        collection = sceneResult.value.getEmbeddedCollection(documentType);
      } catch {
        return fail("UNKNOWN_OUTCOME", "Embedded placeable collection resolution failed; outcome is unknown.", "after-reread");
      }
      const values = collectionEntries(collection);
      if (!values) return fail("UNKNOWN_OUTCOME", "The embedded placeable collection shape is unknown.", "after-reread");
      const entries: FoundryEmbeddedPlaceableIdentity[] = [];
      for (const value of values) {
        if (!value || typeof value !== "object") {
          return fail("UNKNOWN_OUTCOME", "The embedded placeable collection contains an unknown entry.", "after-reread");
        }
        const entry = identity(value as FoundryEmbeddedPlaceableDocument, documentType);
        if (!entry.ok) return entry;
        entries.push(entry.value);
      }
      entries.sort((left, right) => left.documentId.localeCompare(right.documentId));
      return {
        ok: true,
        value: {
          sceneBinding,
          documentType,
          count: entries.length,
          entries,
        },
      };
    },
  };
}
