import {
  createAppendOnlyTransactionJournalStore,
  type TransactionJournalStore,
} from "@dicebox/compiler";
import type { Result } from "@dicebox/core";

export const FOUNDRY_SETTINGS_NAMESPACE = "dicebox-campaign-helper" as const;
export const FOUNDRY_SETTINGS_KEY = "transaction-journal" as const;

export interface FoundrySettingConfig {
  readonly name: string;
  readonly hint: string;
  readonly scope: "world";
  readonly config: false;
  readonly type: StringConstructor;
  readonly default: string;
  readonly restricted: true;
}

export interface FoundrySettingsApi {
  register(namespace: string, key: string, data: FoundrySettingConfig): void;
  get(namespace: string, key: string): unknown;
  set(namespace: string, key: string, value: string): Promise<unknown>;
}

export interface FoundrySettingsJournalOptions {
  readonly settings: FoundrySettingsApi;
  /** Remains false until exact runtime and module persistence review pass. */
  readonly writeEnabled?: boolean;
  /** Read immediately before set; this is not a cached role claim. */
  readonly currentActiveGmUserId?: () => string | null;
  readonly authorizedGmUserId?: string;
}

export const foundrySettingsJournalApi = {
  register: "game.settings.register",
  read: "game.settings.get",
  write: "game.settings.set",
} as const;

function failure<T>(code: "NOT_READY" | "FORBIDDEN", message: string): Result<T> {
  return { ok: false, error: { code, message, retry: "never" } };
}

export function registerTransactionJournalSetting(settings: FoundrySettingsApi): Result<true> {
  try {
    settings.register(FOUNDRY_SETTINGS_NAMESPACE, FOUNDRY_SETTINGS_KEY, {
      name: "DiceBox transaction journal",
      hint: "Internal recovery history for DiceBox-owned operations; not campaign truth.",
      scope: "world",
      config: false,
      type: String,
      default: "",
      restricted: true,
    });
    return { ok: true, value: true };
  } catch {
    return failure("NOT_READY", "Foundry transaction-journal setting registration failed.");
  }
}

/**
 * Settings-backed logical append log. The setting value is replaced with the
 * prior JSON-lines history plus one new line; no history compaction or hidden
 * cleanup is performed. This driver is deliberately not installed by the
 * read-only module bootstrap.
 */
export function createFoundrySettingsTransactionJournalStore(
  options: FoundrySettingsJournalOptions,
): TransactionJournalStore {
  const log = createAppendOnlyTransactionJournalStore({
    async read() {
      const value = options.settings.get(FOUNDRY_SETTINGS_NAMESPACE, FOUNDRY_SETTINGS_KEY);
      if (value === undefined || value === null || value === "") return "";
      if (typeof value !== "string") throw new Error("Foundry transaction-journal setting is not a string.");
      return value;
    },
    async append(line) {
      const value = options.settings.get(FOUNDRY_SETTINGS_NAMESPACE, FOUNDRY_SETTINGS_KEY);
      if (value !== undefined && value !== null && typeof value !== "string") {
        throw new Error("Foundry transaction-journal setting is not a string.");
      }
      await options.settings.set(
        FOUNDRY_SETTINGS_NAMESPACE,
        FOUNDRY_SETTINGS_KEY,
        `${typeof value === "string" ? value : ""}${line}`,
      );
    },
  });

  return {
    load: () => log.load(),
    entries: () => log.entries(),
    append: async (input) => {
      if (!options.writeEnabled) {
        return failure("NOT_READY", "Foundry settings journal writes are disabled until exact-runtime review.");
      }
      const currentActiveGmUserId = options.currentActiveGmUserId?.() ?? null;
      if (!options.authorizedGmUserId || currentActiveGmUserId !== options.authorizedGmUserId) {
        return failure("FORBIDDEN", "The active GM identity is missing or changed; settings write was not attempted.");
      }
      return log.append(input);
    },
  };
}
