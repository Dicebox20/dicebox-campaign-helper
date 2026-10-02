import { describe, expect, it } from "vitest";
import {
  createFoundrySettingsTransactionJournalStore,
  FOUNDRY_SETTINGS_KEY,
  FOUNDRY_SETTINGS_NAMESPACE,
  foundrySettingsJournalApi,
  registerTransactionJournalSetting,
  type FoundrySettingsApi,
} from "@dicebox/bridge";
import { createStableDiceBoxId } from "@dicebox/core";

const transactionId = createStableDiceBoxId("transaction", "settings");
const idempotencyKey = createStableDiceBoxId("idempotency", "settings");
const planId = createStableDiceBoxId("plan", "settings");
const semanticId = createStableDiceBoxId("journal", "settings");
const receiptId = createStableDiceBoxId("receipt", "settings");

function entry(stage: "previewed" | "approved") {
  return {
    schemaVersion: "0.1.0" as const,
    transactionId,
    idempotencyKey,
    planId,
    semanticId,
    documentType: "JournalEntry" as const,
    operation: "create" as const,
    stage,
    resolution: "pending" as const,
    attempt: 0,
    previewReceiptId: receiptId,
    approvalTokenId: null,
    approvedByUserId: null,
    binding: null,
    observedAt: stage === "previewed" ? "2026-08-21T07:00:00.000Z" : "2026-08-21T07:01:00.000Z",
    notes: [stage],
  };
}

function fakeSettings() {
  let value = "";
  let registerCalls = 0;
  let setCalls = 0;
  let throwOnSet = false;
  const settings: FoundrySettingsApi = {
    register(namespace, key, config) {
      expect(namespace).toBe(FOUNDRY_SETTINGS_NAMESPACE);
      expect(key).toBe(FOUNDRY_SETTINGS_KEY);
      expect(config.scope).toBe("world");
      expect(config.config).toBe(false);
      expect(config.restricted).toBe(true);
      registerCalls += 1;
    },
    get(namespace, key) {
      expect(namespace).toBe(FOUNDRY_SETTINGS_NAMESPACE);
      expect(key).toBe(FOUNDRY_SETTINGS_KEY);
      return value;
    },
    async set(namespace, key, nextValue) {
      expect(namespace).toBe(FOUNDRY_SETTINGS_NAMESPACE);
      expect(key).toBe(FOUNDRY_SETTINGS_KEY);
      setCalls += 1;
      value = nextValue;
      if (throwOnSet) throw new Error("response lost");
      return nextValue;
    },
  };
  return {
    settings,
    getValue: () => value,
    getRegisterCalls: () => registerCalls,
    getSetCalls: () => setCalls,
    setThrowOnSet: (next: boolean) => { throwOnSet = next; },
  };
}

describe("Foundry settings-backed transaction journal adapter", () => {
  it("names the official register/get/set surfaces and registers a hidden world setting", () => {
    const fake = fakeSettings();
    expect(foundrySettingsJournalApi).toEqual({
      register: "game.settings.register",
      read: "game.settings.get",
      write: "game.settings.set",
    });
    expect(registerTransactionJournalSetting(fake.settings)).toEqual({ ok: true, value: true });
    expect(fake.getRegisterCalls()).toBe(1);
  });

  it("allows reads but blocks writes by default", async () => {
    const fake = fakeSettings();
    const store = createFoundrySettingsTransactionJournalStore({ settings: fake.settings });
    expect((await store.load()).ok).toBe(true);
    const result = await store.append(entry("previewed"));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NOT_READY");
    expect(fake.getSetCalls()).toBe(0);
  });

  it("persists and replays logical append-only history only for the current authorized GM", async () => {
    const fake = fakeSettings();
    const store = createFoundrySettingsTransactionJournalStore({
      settings: fake.settings,
      writeEnabled: true,
      currentActiveGmUserId: () => "gm-1",
      authorizedGmUserId: "gm-1",
    });
    expect((await store.append(entry("previewed"))).ok).toBe(true);
    expect((await store.append(entry("approved"))).ok).toBe(true);
    expect(fake.getValue().trim().split("\n")).toHaveLength(2);

    const restarted = createFoundrySettingsTransactionJournalStore({ settings: fake.settings });
    const loaded = await restarted.entries();
    expect(loaded.ok).toBe(true);
    if (loaded.ok) expect(loaded.value).toHaveLength(2);
  });

  it("rechecks active GM identity and does not call game.settings.set after authority changes", async () => {
    const fake = fakeSettings();
    const store = createFoundrySettingsTransactionJournalStore({
      settings: fake.settings,
      writeEnabled: true,
      currentActiveGmUserId: () => "gm-2",
      authorizedGmUserId: "gm-1",
    });
    const result = await store.append(entry("previewed"));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("FORBIDDEN");
    expect(fake.getSetCalls()).toBe(0);
  });

  it("preserves unknown outcome when settings.set may have committed before response loss", async () => {
    const fake = fakeSettings();
    fake.setThrowOnSet(true);
    const store = createFoundrySettingsTransactionJournalStore({
      settings: fake.settings,
      writeEnabled: true,
      currentActiveGmUserId: () => "gm-1",
      authorizedGmUserId: "gm-1",
    });
    const result = await store.append(entry("previewed"));

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("UNKNOWN_OUTCOME");
    const reread = await createFoundrySettingsTransactionJournalStore({ settings: fake.settings }).load();
    expect(reread.ok).toBe(true);
    if (reread.ok) expect(reread.value.entries()).toHaveLength(1);
  });
});
