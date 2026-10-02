import { describe, expect, it } from "vitest";
import { beginCampaignDirectorTurn } from "../packages/dicebox-director/src/index";
import {
  DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID,
  desktopConversationStorageKey,
  desktopSceneCitation,
  desktopSceneContextBudget,
  loadDesktopCampaignDirectorConversation,
  saveDesktopCampaignDirectorConversation,
  type CampaignDirectorConversationStorage,
} from "../apps/campaign-helper-desktop/src/campaign-director-conversation";

function memoryStorage(initial: Readonly<Record<string, string>> = {}): CampaignDirectorConversationStorage & { values: Map<string, string>; writes: string[] } {
  const values = new Map(Object.entries(initial));
  const writes: string[] = [];
  return {
    values,
    writes,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { writes.push(key); values.set(key, value); },
  };
}

const projectId = "dbx:project:desktop-test";

describe("desktop Campaign Director conversation persistence", () => {
  it("creates a missing exact-key conversation and round-trips it without a project-content write", () => {
    const storage = memoryStorage();
    const missing = loadDesktopCampaignDirectorConversation(storage, projectId);
    expect(missing).toMatchObject({ status: "MISSING", projectContentWrite: false, conversation: { projectId, conversationId: DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID } });
    if (missing.status === "BLOCKED") throw new Error(missing.reason);
    const conversation = beginCampaignDirectorTurn(missing.conversation, {
      turnId: "dbx:turn:desktop-one",
      userMessageId: "dbx:message:desktop-user-one",
      content: "Inspect the current Scene",
      contextBudget: desktopSceneContextBudget({ id: "dbx:scene:test", revision: 0 }),
    });
    expect(saveDesktopCampaignDirectorConversation(storage, projectId, conversation)).toMatchObject({ status: "PASS", revision: 1, projectContentWrite: false });
    expect(loadDesktopCampaignDirectorConversation(storage, projectId)).toMatchObject({ status: "PASS", conversation });
  });

  it("blocks malformed stored state without overwriting it", () => {
    const key = desktopConversationStorageKey(projectId);
    const storage = memoryStorage({ [key]: "{not-json" });
    expect(loadDesktopCampaignDirectorConversation(storage, projectId)).toMatchObject({ status: "BLOCKED", code: "MALFORMED_CONVERSATION", conversation: null, projectContentWrite: false });
    expect(storage.writes).toEqual([]);
    expect(storage.values.get(key)).toBe("{not-json");
  });

  it("blocks a valid but foreign conversation and refuses cross-project saves", () => {
    const foreignId = "dbx:project:foreign";
    const foreign = loadDesktopCampaignDirectorConversation(memoryStorage(), foreignId);
    if (foreign.status === "BLOCKED") throw new Error(foreign.reason);
    const key = desktopConversationStorageKey(projectId);
    const storage = memoryStorage({ [key]: JSON.stringify(foreign.conversation) });
    expect(loadDesktopCampaignDirectorConversation(storage, projectId)).toMatchObject({ status: "BLOCKED", code: "FOREIGN_CONVERSATION" });
    expect(() => saveDesktopCampaignDirectorConversation(storage, projectId, foreign.conversation)).toThrow(/foreign/);
    expect(storage.writes).toEqual([]);
  });

  it("accounts a bounded context and emits source-tagged stable citations", () => {
    expect(desktopSceneContextBudget({ text: "x".repeat(20_000) })).toMatchObject({ requestedChars: 12_000, usedChars: 12_000, recordCount: 1, truncated: true });
    expect(desktopSceneCitation(7, "dbx:scene:test")).toEqual([{ citationId: "dbx:citation:desktop-7", recordId: "dbx:scene:test", sourceId: "desktop-current-scene", label: "Current Scene dbx:scene:test" }]);
  });
});
