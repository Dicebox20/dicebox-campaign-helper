import {
  type DiceBoxError,
  type FoundryDocumentType,
  type Result,
} from "@dicebox/core";

export interface FoundryCompendiumIndexEntry {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly name?: string;
  /** Foundry index entries commonly expose the document type as `type`. */
  readonly type?: string;
  readonly documentName?: string;
}

export interface FoundryCompendiumIndexCollection {
  get(id: string): FoundryCompendiumIndexEntry | null | undefined;
  getName?(name: string): FoundryCompendiumIndexEntry | null | undefined;
}

export interface FoundryCompendiumPack {
  readonly index?: FoundryCompendiumIndexCollection;
  getIndex?(): Promise<FoundryCompendiumIndexCollection | null | undefined>;
}

export interface FoundryCompendiumIndexOptions {
  readonly game?: {
    readonly packs?: {
      get(packId: string): FoundryCompendiumPack | null | undefined;
    };
  };
}

export interface FoundryCompendiumIndexQuery {
  readonly packId: string;
  readonly documentType: FoundryDocumentType;
  readonly entryId?: string;
  readonly exactName?: string;
}

export interface FoundryCompendiumIndexRecord {
  readonly packId: string;
  readonly entryId: string;
  readonly uuid: string;
  readonly documentType: FoundryDocumentType;
  readonly displayName: string;
}

export interface FoundryCompendiumIndexReadAdapter {
  readonly adapterId: "foundry.compendium.index.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly pack: "game.packs.get";
    readonly index: "pack.index.get | pack.index.getName | pack.getIndex";
  };
  lookup(query: FoundryCompendiumIndexQuery): Promise<Result<FoundryCompendiumIndexRecord | null>>;
}

const documentTypes = new Set<FoundryDocumentType>([
  "Folder",
  "JournalEntry",
  "Actor",
  "Item",
  "Scene",
  "Region",
]);

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

function validateQuery(query: FoundryCompendiumIndexQuery): Result<FoundryCompendiumIndexQuery> {
  const selectorCount = Number(query.entryId !== undefined) + Number(query.exactName !== undefined);
  if (!nonEmptyString(query.packId)
    || !documentTypes.has(query.documentType)
    || selectorCount !== 1
    || (query.entryId !== undefined && !nonEmptyString(query.entryId))
    || (query.exactName !== undefined && !nonEmptyString(query.exactName))) {
    return fail(
      "INVALID_INPUT",
      "A compendium lookup requires one non-empty exact entry ID or exact name selector.",
      "never",
    );
  }
  return { ok: true, value: query };
}

function recordFromEntry(
  query: FoundryCompendiumIndexQuery,
  entry: FoundryCompendiumIndexEntry,
): Result<FoundryCompendiumIndexRecord> {
  const entryId = nonEmptyString(entry.id) ?? nonEmptyString(entry._id);
  const uuid = nonEmptyString(entry.uuid);
  const displayName = nonEmptyString(entry.name);
  const documentType = nonEmptyString(entry.documentName) ?? nonEmptyString(entry.type);

  if (!entryId || !uuid || !displayName || !documentType) {
    return fail(
      "UNKNOWN_OUTCOME",
      "Foundry returned a compendium index entry without complete identity metadata.",
      "after-reread",
    );
  }
  if (documentType !== query.documentType) {
    return fail(
      "FORBIDDEN",
      `The compendium entry type ${documentType} does not match ${query.documentType}.`,
      "never",
    );
  }
  if (query.entryId !== undefined && entryId !== query.entryId) {
    return fail(
      "UNKNOWN_OUTCOME",
      "The compendium index returned a different entry than the reviewed ID.",
      "after-reread",
    );
  }
  if (query.exactName !== undefined && displayName !== query.exactName) {
    return fail(
      "UNKNOWN_OUTCOME",
      "The compendium index returned a different entry than the reviewed exact name.",
      "after-reread",
    );
  }

  const expectedUuid = `Compendium.${query.packId}.${query.documentType}.${entryId}`;
  if (uuid !== expectedUuid) {
    return fail(
      "UNKNOWN_OUTCOME",
      "The compendium index UUID does not match the reviewed pack, type, and entry identity.",
      "after-reread",
    );
  }

  return {
    ok: true,
    value: {
      packId: query.packId,
      entryId,
      uuid,
      documentType: query.documentType,
      displayName,
    },
  };
}

export function createFoundryCompendiumIndexReadAdapter(
  options: FoundryCompendiumIndexOptions,
): FoundryCompendiumIndexReadAdapter {
  return {
    adapterId: "foundry.compendium.index.read@14.367",
    runtime: "foundry",
    foundryApi: {
      pack: "game.packs.get",
      index: "pack.index.get | pack.index.getName | pack.getIndex",
    },
    async lookup(input) {
      const parsed = validateQuery(input);
      if (!parsed.ok) return parsed;
      const query = parsed.value;

      if (!options.game?.packs) {
        return fail("UNAVAILABLE", "Foundry game.packs was not observed.", "never");
      }

      let pack: FoundryCompendiumPack | null | undefined;
      try {
        pack = options.game.packs.get(query.packId);
      } catch {
        return fail("UNKNOWN_OUTCOME", "Compendium pack resolution failed; outcome is unknown.", "after-reread");
      }
      if (!pack) return { ok: true, value: null };

      let index: FoundryCompendiumIndexCollection | null | undefined = pack.index;
      if (!index && pack.getIndex) {
        try {
          index = await pack.getIndex();
        } catch {
          return fail("UNKNOWN_OUTCOME", "Compendium index loading failed; outcome is unknown.", "after-reread");
        }
      }
      if (!index) {
        return fail("UNAVAILABLE", "The compendium index read surface was not observed.", "never");
      }

      let entry: FoundryCompendiumIndexEntry | null | undefined;
      try {
        if (query.entryId !== undefined) {
          entry = index.get(query.entryId);
        } else if (index.getName && query.exactName !== undefined) {
          entry = index.getName(query.exactName);
        } else {
          return fail("UNAVAILABLE", "The exact compendium index selector is not available.", "never");
        }
      } catch {
        return fail("UNKNOWN_OUTCOME", "Compendium index lookup failed; outcome is unknown.", "after-reread");
      }
      if (!entry) return { ok: true, value: null };
      return recordFromEntry(query, entry);
    },
  };
}
