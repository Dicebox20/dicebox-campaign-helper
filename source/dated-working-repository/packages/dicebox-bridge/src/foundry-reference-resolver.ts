import {
  type DiceBoxError,
  type FoundryDocumentType,
  type Result,
  type RuntimeBinding,
} from "@dicebox/core";

/**
 * The M4 resolver exposes only identity metadata. It deliberately does not
 * return a raw Foundry Document, which keeps arbitrary runtime state out of
 * the program-side link compiler and makes the read-only boundary explicit.
 */
export interface FoundryReferenceDocument {
  readonly id?: string;
  readonly _id?: string;
  readonly uuid?: string | null;
  readonly documentName?: string;
  readonly name?: string;
}

export interface FoundryReferenceResolverOptions {
  /** Official Foundry UUID resolution surface. */
  readonly fromUuid?: (
    uuid: string,
  ) => Promise<FoundryReferenceDocument | null> | FoundryReferenceDocument | null;
  /** Official world Journal collection fallback for a JournalEntry binding. */
  readonly game?: {
    readonly journal?: {
      get(id: string): FoundryReferenceDocument | null | undefined;
    };
  };
}

export interface ResolvedFoundryReference {
  readonly binding: RuntimeBinding;
  readonly documentType: FoundryDocumentType;
  readonly documentId: string;
  readonly uuid: string;
  readonly displayName?: string;
}

export interface FoundryReferenceReadAdapter {
  readonly adapterId: "foundry.reference.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly read: "fromUuid" | "game.journal.get";
  };
  resolve(binding: RuntimeBinding): Promise<Result<ResolvedFoundryReference | null>>;
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

function documentId(document: FoundryReferenceDocument): string | null {
  return nonEmptyString(document.id) ?? nonEmptyString(document._id);
}

function readMetadata(
  document: FoundryReferenceDocument,
  binding: RuntimeBinding,
): Result<ResolvedFoundryReference> {
  const type = nonEmptyString(document.documentName);
  const id = documentId(document);
  const uuid = nonEmptyString(document.uuid);

  if (!type || !id || !uuid) {
    return fail(
      "UNKNOWN_OUTCOME",
      "Foundry returned a reference without complete document identity metadata.",
      "after-reread",
    );
  }
  if (type !== binding.documentType) {
    return fail(
      "FORBIDDEN",
      `The resolved document type ${type} does not match ${binding.documentType}.`,
      "never",
    );
  }
  if (id !== binding.documentId || uuid !== binding.uuid) {
    return fail(
      "UNKNOWN_OUTCOME",
      "The resolved document identity does not match the reviewed binding.",
      "after-reread",
    );
  }

  const displayName = nonEmptyString(document.name);
  return {
    ok: true,
    value: {
      binding,
      documentType: binding.documentType,
      documentId: id,
      uuid,
      ...(displayName ? { displayName } : {}),
    },
  };
}

export function createFoundryReferenceReadAdapter(
  options: FoundryReferenceResolverOptions,
): FoundryReferenceReadAdapter {
  const readApi = options.fromUuid
    ? "fromUuid"
    : "game.journal.get";

  return {
    adapterId: "foundry.reference.read@14.367",
    runtime: "foundry",
    foundryApi: { read: readApi },
    async resolve(binding) {
      let document: FoundryReferenceDocument | null | undefined;
      try {
        if (options.fromUuid) {
          document = await options.fromUuid(binding.uuid);
        } else if (binding.documentType === "JournalEntry" && options.game?.journal) {
          document = options.game.journal.get(binding.documentId);
        } else {
          return fail(
            "UNAVAILABLE",
            "No exact Foundry reference read surface is available for this document type.",
            "never",
          );
        }
      } catch {
        return fail(
          "UNKNOWN_OUTCOME",
          "Foundry reference resolution failed; the link state is unknown.",
          "after-reread",
        );
      }

      if (!document) return { ok: true, value: null };
      return readMetadata(document, binding);
    },
  };
}
