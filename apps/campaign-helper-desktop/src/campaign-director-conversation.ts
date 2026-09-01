import {
  CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
  createCampaignDirectorConversation,
  parseCampaignDirectorConversation,
  serializeCampaignDirectorConversation,
  type CampaignDirectorCitation,
  type CampaignDirectorContextBudget,
  type CampaignDirectorConversation,
} from "@dicebox/director";

export const DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID = "dbx:conversation:campaign-director";
export const DESKTOP_CAMPAIGN_DIRECTOR_FIXTURE_PROJECT_ID = "dbx:project:desktop-fixture";

export type CampaignDirectorConversationStorage = Readonly<{
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}>;

export function browserCampaignDirectorConversationStorage(): CampaignDirectorConversationStorage {
  if (typeof window === "undefined") throw new Error("Browser conversation storage is unavailable.");
  return window.localStorage;
}

export type DesktopConversationLoad = Readonly<{
  status: "PASS" | "MISSING";
  key: string;
  conversation: CampaignDirectorConversation;
  projectContentWrite: false;
}> | Readonly<{
  status: "BLOCKED";
  key: string;
  code: "MALFORMED_CONVERSATION" | "FOREIGN_CONVERSATION" | "STORAGE_UNAVAILABLE";
  reason: string;
  conversation: null;
  projectContentWrite: false;
}>;

export function desktopConversationStorageKey(projectId: string, conversationId = DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID): string {
  if (!projectId.startsWith("dbx:") || !conversationId.startsWith("dbx:")) throw new Error("Desktop Campaign Director persistence requires stable DiceBox IDs.");
  return `dicebox.campaign-director.conversation.v1:${encodeURIComponent(projectId)}:${encodeURIComponent(conversationId)}`;
}

export function loadDesktopCampaignDirectorConversation(
  storage: CampaignDirectorConversationStorage,
  projectId: string,
  conversationId = DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID,
): DesktopConversationLoad {
  const key = desktopConversationStorageKey(projectId, conversationId);
  let serialized: string | null;
  try {
    serialized = storage.getItem(key);
  } catch {
    return { status: "BLOCKED", key, code: "STORAGE_UNAVAILABLE", reason: "Conversation storage is unavailable; no state was overwritten.", conversation: null, projectContentWrite: false };
  }
  if (serialized === null) {
    return { status: "MISSING", key, conversation: createCampaignDirectorConversation({ conversationId, projectId }), projectContentWrite: false };
  }
  try {
    const conversation = parseCampaignDirectorConversation(serialized);
    if (conversation.projectId !== projectId || conversation.conversationId !== conversationId) {
      return { status: "BLOCKED", key, code: "FOREIGN_CONVERSATION", reason: "Stored conversation identity does not match the active project; no state was overwritten.", conversation: null, projectContentWrite: false };
    }
    return { status: "PASS", key, conversation, projectContentWrite: false };
  } catch {
    return { status: "BLOCKED", key, code: "MALFORMED_CONVERSATION", reason: "Stored conversation failed validation; no state was overwritten.", conversation: null, projectContentWrite: false };
  }
}

export function saveDesktopCampaignDirectorConversation(
  storage: CampaignDirectorConversationStorage,
  projectId: string,
  conversation: CampaignDirectorConversation,
): Readonly<{ status: "PASS"; key: string; revision: number; projectContentWrite: false }> {
  if (conversation.projectId !== projectId || conversation.conversationId !== DESKTOP_CAMPAIGN_DIRECTOR_CONVERSATION_ID) {
    throw new Error("Refusing to persist a foreign Campaign Director conversation.");
  }
  const key = desktopConversationStorageKey(projectId, conversation.conversationId);
  storage.setItem(key, serializeCampaignDirectorConversation(conversation));
  return { status: "PASS", key, revision: conversation.revision, projectContentWrite: false };
}

export function desktopSceneContextBudget(sceneSummary: unknown): CampaignDirectorContextBudget {
  const usedChars = Math.min(JSON.stringify(sceneSummary).length, CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS);
  return {
    requestedChars: CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
    usedChars,
    recordCount: 1,
    truncated: usedChars === CAMPAIGN_DIRECTOR_MAX_CONTEXT_CHARS,
  };
}

export function desktopSceneCitation(sequence: number, documentId: string): readonly CampaignDirectorCitation[] {
  if (!Number.isSafeInteger(sequence) || sequence < 1) throw new Error("Citation sequence must be a positive integer.");
  return [{
    citationId: `dbx:citation:desktop-${sequence}`,
    recordId: documentId,
    sourceId: "desktop-current-scene",
    label: `Current Scene ${documentId}`,
  }];
}
