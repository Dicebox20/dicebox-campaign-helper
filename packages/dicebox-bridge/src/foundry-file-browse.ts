import {
  type DiceBoxError,
  type Result,
} from "@dicebox/core";

export const foundryFileSources = ["data", "public", "s3"] as const;
export type FoundryFileSource = (typeof foundryFileSources)[number];

export interface FoundryFilePickerBrowseOptions {
  browse(
    source: FoundryFileSource,
    target: string,
    options?: {
      readonly bucket?: string;
      readonly extensions?: readonly string[];
      readonly wildcard?: boolean;
    },
  ): Promise<unknown>;
}

export interface FoundryFileBrowseAdapterOptions {
  readonly FilePicker?: FoundryFilePickerBrowseOptions;
}

export interface FoundryFileBrowseQuery {
  readonly source: FoundryFileSource;
  readonly ownedRoot: string;
  readonly target: string;
  readonly bucket?: string;
  readonly extensions?: readonly string[];
}

export interface FoundryFileBrowseResult {
  readonly source: FoundryFileSource;
  readonly target: string;
  readonly files: readonly string[];
  readonly directories: readonly string[];
}

export interface FoundryFileBrowseReadAdapter {
  readonly adapterId: "foundry.file-browse.read@14.367";
  readonly runtime: "foundry";
  readonly foundryApi: {
    readonly browse: "FilePicker.browse";
  };
  browse(query: FoundryFileBrowseQuery): Promise<Result<FoundryFileBrowseResult>>;
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

function normalizePath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
}

function isWithinRoot(root: string, target: string): boolean {
  return target === root || target.startsWith(`${root}/`);
}

function hasTraversal(path: string): boolean {
  return path.split("/").some((segment) => segment === ".." || segment === ".");
}

function validateQuery(query: FoundryFileBrowseQuery): Result<FoundryFileBrowseQuery> {
  const root = normalizePath(query.ownedRoot);
  const target = normalizePath(query.target);
  const extensions = query.extensions ?? [];
  if (!foundryFileSources.includes(query.source)
    || !root
    || !target
    || hasTraversal(root)
    || hasTraversal(target)
    || !isWithinRoot(root, target)
    || extensions.length > 32
    || extensions.some((extension) => !/^\.[a-z0-9][a-z0-9.+-]*$/i.test(extension))) {
    return fail(
      "INVALID_INPUT",
      "File browsing must use one approved source and a target contained by the reviewed asset root.",
      "never",
    );
  }
  return {
    ok: true,
    value: {
      ...query,
      ownedRoot: root,
      target,
      ...(query.extensions ? { extensions: [...query.extensions] } : {}),
    },
  };
}

function parseBrowseResponse(
  query: FoundryFileBrowseQuery,
  response: unknown,
): Result<FoundryFileBrowseResult> {
  if (typeof response !== "object" || response === null) {
    return fail("UNKNOWN_OUTCOME", "FilePicker.browse returned an unknown response shape.", "after-reread");
  }
  const files = (response as { files?: unknown }).files;
  const directories = (response as { dirs?: unknown; directories?: unknown }).dirs
    ?? (response as { directories?: unknown }).directories;
  if (!Array.isArray(files) || !Array.isArray(directories)
    || !files.every((value) => typeof value === "string")
    || !directories.every((value) => typeof value === "string")) {
    return fail("UNKNOWN_OUTCOME", "FilePicker.browse returned malformed file metadata.", "after-reread");
  }
  return {
    ok: true,
    value: {
      source: query.source,
      target: query.target,
      files: [...new Set(files)].sort(),
      directories: [...new Set(directories)].sort(),
    },
  };
}

export function createFoundryFileBrowseReadAdapter(
  options: FoundryFileBrowseAdapterOptions,
): FoundryFileBrowseReadAdapter {
  return {
    adapterId: "foundry.file-browse.read@14.367",
    runtime: "foundry",
    foundryApi: { browse: "FilePicker.browse" },
    async browse(input) {
      const parsed = validateQuery(input);
      if (!parsed.ok) return parsed;
      if (!options.FilePicker) {
        return fail("UNAVAILABLE", "Foundry FilePicker.browse was not observed.", "never");
      }
      try {
        const response = await options.FilePicker.browse(parsed.value.source, parsed.value.target, {
          ...(parsed.value.bucket ? { bucket: parsed.value.bucket } : {}),
          ...(parsed.value.extensions ? { extensions: parsed.value.extensions } : {}),
        });
        return parseBrowseResponse(parsed.value, response);
      } catch {
        return fail("UNKNOWN_OUTCOME", "FilePicker.browse failed; file state is unknown.", "after-reread");
      }
    },
  };
}
