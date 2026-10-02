import { describe, expect, it } from "vitest";
import {
  beginProposalApply,
  createProposalBatch,
  previewProposalBatch,
} from "@dicebox/core";
import { createHumanSceneProposalBatch, type SceneCommand } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";
import {
  approveDesktopProposalSession,
  cancelDesktopProposalSession,
  clearTerminalDesktopProposalSession,
  createDesktopProposalSession,
  desktopProposalRecoveryView,
  desktopProposalSessionStorageKey,
  editDesktopProposalSession,
  inspectDesktopProposalSession,
  invalidateStaleDesktopProposalSession,
  loadDesktopProposalSession,
  markDesktopProposalOutcomeUnknown,
  recoverDesktopProposalSession,
  rejectDesktopProposalSession,
  saveDesktopProposalSession,
  validateDesktopProposalSession,
  type DesktopProposalSessionStorage,
} from "../apps/campaign-helper-desktop/src/proposal-session";

const projectId = "dbx:project:proposal-session";
const sceneId = fixtureScene.id;
const baseHash = "a".repeat(64);
const reviewer = { actorId: "reviewer-1", role: "reviewer" as const };
const requester = { actorId: "requester-1", role: "requester" as const };
const at = (minute: number) => `2026-08-27T22:${String(minute).padStart(2, "0")}:00.000Z`;

function storage(seed: Record<string, string> = {}) {
  const values = new Map(Object.entries(seed));
  const adapter: DesktopProposalSessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
    removeItem: (key) => { values.delete(key); },
  };
  return { adapter, values };
}

function command(): SceneCommand {
  return {
    schemaVersion: "0.1.0",
    kind: "translate-entity",
    commandId: "desktop-session-command",
    baseRevision: fixtureScene.revision,
    entityId: "dbx:apparatus:core",
    deltaX: 8,
    deltaY: 0,
    origin: { kind: "human", principalId: "desktop-user", reason: "Session fixture" },
  };
}

async function session() {
  const batch = await createHumanSceneProposalBatch({
    batchId: "dbx:proposal:desktop-session",
    document: fixtureScene,
    documentSha256: baseHash,
    command: command(),
    createdAt: at(0),
  });
  const history = await previewProposalBatch(batch, requester, at(1));
  return createDesktopProposalSession({ projectId, sceneId, batch, history });
}

describe("desktop proposal-session persistence", () => {
  it("round-trips one exact project/Scene session without changing project content", async () => {
    const memory = storage();
    const current = await session();
    const before = JSON.stringify(fixtureScene);
    const saved = await saveDesktopProposalSession(memory.adapter, projectId, sceneId, current);
    const loaded = await loadDesktopProposalSession(memory.adapter, projectId, sceneId);

    expect(saved).toMatchObject({ status: "PASS", historyLength: 1, projectContentWrite: false });
    expect(loaded).toMatchObject({ status: "PASS", projectContentWrite: false });
    if (loaded.status !== "PASS") throw new Error(loaded.status === "BLOCKED" ? loaded.reason : "Proposal session was missing after save.");
    expect(loaded.session).toEqual(current);
    expect(inspectDesktopProposalSession(loaded.session)).toMatchObject({
      projectId,
      sceneId,
      producer: { kind: "human" },
      targetAuthority: { domain: "local-project", requiredActiveGm: false },
      status: "previewed",
      noWrite: true,
    });
    expect(JSON.stringify(fixtureScene)).toBe(before);
  });

  it("persists approve, edit, reject, cancel, and stale histories across reload", async () => {
    const memory = storage();
    const initial = await session();
    const approved = await approveDesktopProposalSession(initial, reviewer, initial.batch.base, at(2));
    expect(approved.history.status).toBe("approved");

    const edited = await editDesktopProposalSession(initial, reviewer, [{
      ...initial.batch.commands[0]!,
      payload: { ...initial.batch.commands[0]!.payload, deltaX: 16 },
    }], at(2), "medium");
    expect(edited).toMatchObject({ batch: { revision: 1, risk: "medium" }, history: { status: "previewed" } });
    expect(edited.batch.previousBatchSha256).toBe(initial.batch.batchSha256);

    const states = [
      await rejectDesktopProposalSession(initial, reviewer, at(2)),
      await cancelDesktopProposalSession(initial, requester, at(2)),
      await invalidateStaleDesktopProposalSession(initial, reviewer, at(2)),
    ];
    expect(states.map((entry) => entry.history.status)).toEqual(["rejected", "cancelled", "stale"]);

    await saveDesktopProposalSession(memory.adapter, projectId, sceneId, edited);
    const loaded = await loadDesktopProposalSession(memory.adapter, projectId, sceneId);
    expect(loaded.status === "PASS" ? loaded.session.history.receipts.map((receipt) => receipt.transition) : []).toEqual(["preview", "edit"]);
  });

  it("represents unknown outcome as no-retry until authoritative reread recovery", async () => {
    const initial = await session();
    const approved = await approveDesktopProposalSession(initial, reviewer, initial.batch.base, at(2));
    const applyingHistory = await beginProposalApply(approved.history, approved.batch, reviewer, approved.batch.base, at(3));
    const applying = await validateDesktopProposalSession({ ...approved, history: applyingHistory });
    const unknown = await markDesktopProposalOutcomeUnknown(applying, reviewer, at(4));

    expect(desktopProposalRecoveryView(unknown)).toEqual({ outcomeUnknown: true, authoritativeRereadRequired: true, retryAllowed: false, latestRereadStatus: null });
    const unresolved = await recoverDesktopProposalSession(unknown, reviewer, { status: "unknown", targetId: unknown.batch.base.targetId, revision: null, sha256: null }, at(5));
    expect(desktopProposalRecoveryView(unresolved)).toMatchObject({ outcomeUnknown: true, retryAllowed: false, latestRereadStatus: "unknown" });
    const recovered = await recoverDesktopProposalSession(unresolved, reviewer, { status: "not-committed", targetId: unresolved.batch.base.targetId, revision: 0, sha256: baseHash }, at(6));
    expect(recovered.history.status).toBe("recovered");
    expect(desktopProposalRecoveryView(recovered)).toMatchObject({ outcomeUnknown: false, retryAllowed: true, latestRereadStatus: "not-committed" });
  });

  it("blocks malformed, foreign, tampered, credential-bearing, repository, and active-GM sessions without overwrite", async () => {
    const key = desktopProposalSessionStorageKey(projectId, sceneId);
    const valid = await session();
    const cases: Array<[string, unknown, string]> = [
      ["malformed", { broken: true }, "MALFORMED_SESSION"],
      ["foreign", { ...valid, projectId: "dbx:project:foreign" }, "FOREIGN_SESSION"],
      ["tampered", { ...valid, batch: { ...valid.batch, risk: "critical" } }, "MALFORMED_SESSION"],
    ];
    for (const [name, value, code] of cases) {
      const serialized = JSON.stringify(value);
      const memory = storage({ [key]: serialized });
      const loaded = await loadDesktopProposalSession(memory.adapter, projectId, sceneId);
      expect(loaded, name).toMatchObject({ status: "BLOCKED", code });
      expect(memory.values.get(key), name).toBe(serialized);
    }

    const repositoryBatch = await createProposalBatch({
      schemaVersion: "0.1.0",
      batchId: "dbx:proposal:repository-session",
      revision: 0,
      previousBatchSha256: null,
      producer: { kind: "technical-builder", sourceId: "job-1", provider: "chatgpt" },
      reviewAuthority: { domain: "repository-integration", requiredRole: "reviewer" },
      targetAuthority: { domain: "repository", requiredActiveGm: false },
      risk: "high",
      base: { targetId: sceneId, revision: 0, sha256: baseHash },
      commands: valid.batch.commands,
      createdAt: at(0),
    });
    const repositoryHistory = await previewProposalBatch(repositoryBatch, requester, at(1));
    await expect(createDesktopProposalSession({ projectId, sceneId, batch: repositoryBatch, history: repositoryHistory })).rejects.toThrow("local-project batches only");

    const credentialBatch = await createProposalBatch({
      schemaVersion: "0.1.0",
      batchId: "dbx:proposal:credential-session",
      revision: 0,
      previousBatchSha256: null,
      producer: valid.batch.producer,
      reviewAuthority: valid.batch.reviewAuthority,
      targetAuthority: valid.batch.targetAuthority,
      risk: valid.batch.risk,
      base: valid.batch.base,
      commands: [{ ...valid.batch.commands[0]!, payload: { password: "not-allowed" } }],
      createdAt: at(0),
    });
    const credentialHistory = await previewProposalBatch(credentialBatch, requester, at(1));
    const credentialSerialized = JSON.stringify({ ...valid, batch: credentialBatch, history: credentialHistory });
    const credentialMemory = storage({ [key]: credentialSerialized });
    expect(await loadDesktopProposalSession(credentialMemory.adapter, projectId, sceneId)).toMatchObject({ status: "BLOCKED", code: "CREDENTIAL_MATERIAL" });
    expect(credentialMemory.values.get(key)).toBe(credentialSerialized);

    const foundryBatch = await createProposalBatch({
      schemaVersion: "0.1.0",
      batchId: "dbx:proposal:foundry-session",
      revision: 0,
      previousBatchSha256: null,
      producer: { kind: "foundry", sourceId: "plan-1", provider: "foundry-14.367" },
      reviewAuthority: { domain: "foundry-runtime", requiredRole: "gm" },
      targetAuthority: { domain: "foundry-active-gm", requiredActiveGm: true },
      risk: "critical",
      base: repositoryBatch.base,
      commands: repositoryBatch.commands,
      createdAt: at(0),
    });
    const foundryHistory = await previewProposalBatch(foundryBatch, requester, at(1));
    await expect(createDesktopProposalSession({ projectId, sceneId, batch: foundryBatch, history: foundryHistory })).rejects.toThrow("local-project batches only");
  });

  it("clears only an exact terminal session and preserves other project/Scene keys", async () => {
    const memory = storage();
    const initial = await session();
    const terminal = await rejectDesktopProposalSession(initial, reviewer, at(2));
    const otherKey = desktopProposalSessionStorageKey("dbx:project:other", "dbx:scene:other");
    memory.values.set(otherKey, "foreign-preserved");
    await saveDesktopProposalSession(memory.adapter, projectId, sceneId, terminal);

    expect(await clearTerminalDesktopProposalSession(memory.adapter, projectId, sceneId)).toMatchObject({ status: "PASS", cleared: true, projectContentWrite: false });
    expect(memory.values.has(desktopProposalSessionStorageKey(projectId, sceneId))).toBe(false);
    expect(memory.values.get(otherKey)).toBe("foreign-preserved");
    await expect(clearTerminalDesktopProposalSession(memory.adapter, projectId, sceneId)).rejects.toThrow("existing valid exact");

    await saveDesktopProposalSession(memory.adapter, projectId, sceneId, initial);
    await expect(clearTerminalDesktopProposalSession(memory.adapter, projectId, sceneId)).rejects.toThrow("terminal");
  });
});
