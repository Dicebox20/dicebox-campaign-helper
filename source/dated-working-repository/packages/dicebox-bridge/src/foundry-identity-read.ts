import {
  DICEBOX_PACKAGE_ID,
  type DiceBoxError,
  type Result,
} from "@dicebox/core";

export const ascendancySignalRuneIdentityReadAdapterId = "foundry.scene-identity.read@14.367" as const;

const sceneTargets = [
  { roomId: "dbx:room:signal-frequency-chamber", sceneIdRuntime: "AneddhKAAfk5HlsA" },
  { roomId: "dbx:room:rune-mechanism-chamber", sceneIdRuntime: "p9Mbi0CJWe9KvJhH" },
] as const;

const embeddedDocumentTypes = ["Level", "Wall", "Region", "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"] as const;
type EmbeddedDocumentType = (typeof embeddedDocumentTypes)[number];
type IdentityStatus = "observed" | "partial" | "unresolved";
type Ownership = "owned" | "foreign" | "unknown";

export interface FoundryIdentityReadDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly flags?: Record<string, unknown>;
  readonly getEmbeddedCollection?: (documentType: EmbeddedDocumentType) => { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined;
}

export interface FoundryIdentityReadRuntime {
  readonly version?: unknown;
  readonly system?: { readonly id?: unknown; readonly version?: unknown };
  readonly user?: { readonly id?: unknown; readonly name?: unknown; readonly isGM?: unknown };
  readonly users?: { readonly activeGM?: { readonly id?: unknown } | null };
  readonly game?: { readonly scenes?: { readonly get: (id: string) => FoundryIdentityReadDocument | null | undefined } };
}

export interface FoundryIdentityReadParent {
  readonly documentType: "Scene";
  readonly documentId: string;
  readonly uuid: string | "unresolved";
  readonly generation: number | "unresolved";
  readonly status: IdentityStatus;
  readonly ownership: Ownership;
}

export interface FoundryIdentityReadChild {
  readonly documentType: EmbeddedDocumentType;
  readonly documentId: string;
  readonly uuid: string;
  readonly generation: number;
  readonly ownership: Ownership;
}

export interface FoundryIdentityReadChildren {
  readonly status: "observed" | "unresolved";
  readonly entries: readonly FoundryIdentityReadChild[] | "unresolved";
  readonly reason: string;
}

export interface FoundryIdentityReadScene {
  readonly roomId: (typeof sceneTargets)[number]["roomId"];
  readonly sceneIdRuntime: (typeof sceneTargets)[number]["sceneIdRuntime"];
  readonly parent: FoundryIdentityReadParent;
  readonly children: FoundryIdentityReadChildren;
}

export interface FoundryIdentityReadObservation {
  readonly adapterId: typeof ascendancySignalRuneIdentityReadAdapterId;
  readonly runtime: "foundry";
  readonly target: { readonly foundryVersion: "14.367"; readonly systemId: "dnd5e"; readonly systemVersion: "5.3.3" };
  readonly activeGm: { readonly userId: string; readonly userName: "Gamemaster" };
  readonly scenes: readonly [FoundryIdentityReadScene, FoundryIdentityReadScene];
  readonly foreignState: "preserve";
  readonly retryAfterUnknown: false;
  readonly runtimeBinding: "not-created";
  readonly noWrite: true;
  readonly apply: false;
  readonly payload: "not-materialized";
  readonly dispatch: "disabled";
}

export interface FoundryIdentityReadAdapter {
  readonly adapterId: typeof ascendancySignalRuneIdentityReadAdapterId;
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly target: "game.version / game.system / game.user / game.users.activeGM";
    readonly parent: "game.scenes.get";
    readonly children: "scene.getEmbeddedCollection";
  };
  read(): Promise<Result<FoundryIdentityReadObservation>>;
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

function ownership(document: FoundryIdentityReadDocument): Ownership {
  const marker = document.flags?.[DICEBOX_PACKAGE_ID];
  if (!marker || typeof marker !== "object" || Array.isArray(marker)) return "unknown";
  const record = marker as Record<string, unknown>;
  return record.owner === DICEBOX_PACKAGE_ID && record.packageId === DICEBOX_PACKAGE_ID && record.managed === true
    ? "owned"
    : "foreign";
}

function generation(document: FoundryIdentityReadDocument): number | "unresolved" {
  const marker = document.flags?.[DICEBOX_PACKAGE_ID];
  if (!marker || typeof marker !== "object" || Array.isArray(marker)) return "unresolved";
  const value = (marker as Record<string, unknown>).generation;
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : "unresolved";
}

function observeParent(document: FoundryIdentityReadDocument, sceneIdRuntime: string): Result<FoundryIdentityReadParent> {
  const documentType = nonEmptyString(document.documentName);
  const documentId = nonEmptyString(document.id) ?? nonEmptyString(document._id);
  if (documentType !== "Scene") return fail("FORBIDDEN", "The exact identity reader resolved a non-Scene parent.", "never");
  if (!documentId || documentId !== sceneIdRuntime) return fail("UNKNOWN_OUTCOME", "The resolved parent Scene ID does not match the reviewed exact target.", "after-reread");
  const uuid = nonEmptyString(document.uuid) ?? "unresolved";
  const observedGeneration = generation(document);
  return {
    ok: true,
    value: {
      documentType: "Scene",
      documentId,
      uuid,
      generation: observedGeneration,
      status: uuid !== "unresolved" && observedGeneration !== "unresolved" ? "observed" : "partial",
      ownership: ownership(document),
    },
  };
}

function collectionEntries(value: { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined): readonly unknown[] | null {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const contents = (value as { readonly contents?: readonly unknown[] }).contents;
    if (Array.isArray(contents)) return contents;
  }
  return null;
}

function observeChildren(document: FoundryIdentityReadDocument): FoundryIdentityReadChildren {
  if (typeof document.getEmbeddedCollection !== "function") {
    return { status: "unresolved", entries: "unresolved", reason: "scene.getEmbeddedCollection was not observed" };
  }
  const entries: FoundryIdentityReadChild[] = [];
  for (const documentType of embeddedDocumentTypes) {
    let collection: { readonly contents?: readonly unknown[] } | readonly unknown[] | null | undefined;
    try {
      collection = document.getEmbeddedCollection(documentType);
    } catch {
      return { status: "unresolved", entries: "unresolved", reason: `embedded collection read for ${documentType} had an unknown outcome` };
    }
    const values = collectionEntries(collection);
    if (!values) return { status: "unresolved", entries: "unresolved", reason: `embedded collection shape for ${documentType} was unknown` };
    for (const value of values) {
      if (!value || typeof value !== "object") return { status: "unresolved", entries: "unresolved", reason: `embedded ${documentType} entry was unknown` };
      const child = value as FoundryIdentityReadDocument;
      const childType = nonEmptyString(child.documentName);
      const documentId = nonEmptyString(child.id) ?? nonEmptyString(child._id);
      const uuid = nonEmptyString(child.uuid);
      const childGeneration = generation(child);
      if (childType !== documentType || !documentId || !uuid || childGeneration === "unresolved") {
        return { status: "unresolved", entries: "unresolved", reason: `embedded ${documentType} identity was incomplete` };
      }
      entries.push({ documentType, documentId, uuid, generation: childGeneration, ownership: ownership(child) });
    }
  }
  entries.sort((left, right) => `${left.documentType}:${left.documentId}`.localeCompare(`${right.documentType}:${right.documentId}`));
  return { status: "observed", entries, reason: "all allowlisted embedded identity fields were observed" };
}

function validateRuntime(runtime: FoundryIdentityReadRuntime): Result<{ readonly userId: string; readonly userName: "Gamemaster" }> {
  if (runtime.version !== "14.367" || runtime.system?.id !== "dnd5e" || runtime.system?.version !== "5.3.3") {
    return fail("FORBIDDEN", "The runtime does not match exact Foundry 14.367 / dnd5e 5.3.3.", "never");
  }
  const userId = nonEmptyString(runtime.user?.id);
  const userName = runtime.user?.name;
  const activeGmId = nonEmptyString(runtime.users?.activeGM?.id);
  if (!userId || userName !== "Gamemaster" || runtime.user?.isGM !== true || !activeGmId || activeGmId !== userId) {
    return fail("FORBIDDEN", "The current user is not the exact active Gamemaster authority.", "never");
  }
  return { ok: true, value: { userId, userName: "Gamemaster" } };
}

export function createFoundryAscendancySignalRuneIdentityReadAdapter(
  runtime: FoundryIdentityReadRuntime,
): FoundryIdentityReadAdapter {
  return {
    adapterId: ascendancySignalRuneIdentityReadAdapterId,
    runtime: "foundry",
    foundryApi: {
      target: "game.version / game.system / game.user / game.users.activeGM",
      parent: "game.scenes.get",
      children: "scene.getEmbeddedCollection",
    },
    async read() {
      const authority = validateRuntime(runtime);
      if (!authority.ok) return authority;
      const getScene = runtime.game?.scenes?.get;
      if (typeof getScene !== "function") return fail("UNAVAILABLE", "No exact game.scenes.get read surface was observed.", "never");
      const scenes: FoundryIdentityReadScene[] = [];
      for (const target of sceneTargets) {
        let document: FoundryIdentityReadDocument | null | undefined;
        try {
          document = getScene(target.sceneIdRuntime);
        } catch {
          return fail("UNKNOWN_OUTCOME", `Parent Scene ${target.sceneIdRuntime} resolution failed.`, "after-reread");
        }
        if (!document) {
          scenes.push({
            ...target,
            parent: { documentType: "Scene", documentId: target.sceneIdRuntime, uuid: "unresolved", generation: "unresolved", status: "unresolved", ownership: "unknown" },
            children: { status: "unresolved", entries: "unresolved", reason: "parent Scene was not found" },
          });
          continue;
        }
        const parent = observeParent(document, target.sceneIdRuntime);
        if (!parent.ok) return parent;
        scenes.push({ ...target, parent: parent.value, children: observeChildren(document) });
      }
      return {
        ok: true,
        value: {
          adapterId: ascendancySignalRuneIdentityReadAdapterId,
          runtime: "foundry",
          target: { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
          activeGm: authority.value,
          scenes: [scenes[0]!, scenes[1]!],
          foreignState: "preserve",
          retryAfterUnknown: false,
          runtimeBinding: "not-created",
          noWrite: true,
          apply: false,
          payload: "not-materialized",
          dispatch: "disabled",
        },
      };
    },
  };
}
