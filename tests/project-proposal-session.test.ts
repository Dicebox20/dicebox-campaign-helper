import { describe, expect, it } from "vitest";
import { beginProposalApply, createProposalBatch, previewProposalBatch } from "../packages/dicebox-core/src/proposal-batch.js";
import {
  approveDesktopProjectProposalSession,
  clearTerminalDesktopAssetRestoreUiV2SelfTestProposalSession,
  clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession,
  classifyDesktopBrokenReferenceUiSessionOwnership,
  cancelDesktopProjectProposalSession,
  clearTerminalDesktopBrokenReferenceUiSelfTestProposalSession,
  clearTerminalDesktopBrokenReferenceUiV3SelfTestProposalSession,
  clearTerminalDesktopBrokenReferenceUiV4SelfTestProposalSession,
  clearTerminalDesktopProjectProposalSession,
  clearTerminalDesktopProjectSaveUiSelfTestProposalSession,
  createDesktopBrokenReferenceUiOwnedProposalBatch,
  createDesktopBrokenReferenceUiOwnershipToken,
  createDesktopProjectProposalSession,
  desktopBrokenReferenceUiSelfTestSessionStorageKey,
  desktopBrokenReferenceUiV3SelfTestSessionStorageKey,
  desktopBrokenReferenceUiV4SelfTestSessionStorageKey,
  desktopAssetRestoreUiV2SelfTestSessionStorageKey,
  desktopAssetRestoreUiV3SelfTestSessionStorageKey,
  desktopProjectProposalRecoveryView,
  desktopProjectProposalSessionStorageKey,
  desktopProjectSaveUiSelfTestSessionStorageKey,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID,
  DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID,
  DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE,
  DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID,
  DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE,
  inspectDesktopProjectProposalSession,
  loadDesktopBrokenReferenceUiSelfTestProposalSession,
  loadDesktopBrokenReferenceUiV3SelfTestProposalSession,
  loadDesktopBrokenReferenceUiV4SelfTestProposalSession,
  loadDesktopAssetRestoreUiV2SelfTestProposalSession,
  loadDesktopAssetRestoreUiV3SelfTestProposalSession,
  loadDesktopProjectProposalSession,
  loadDesktopProjectSaveUiSelfTestProposalSession,
  markDesktopProjectProposalOutcomeUnknown,
  recoverDesktopProjectProposalSession,
  saveDesktopBrokenReferenceUiSelfTestProposalSession,
  saveDesktopBrokenReferenceUiV3SelfTestProposalSession,
  saveDesktopBrokenReferenceUiV4SelfTestProposalSession,
  saveDesktopAssetRestoreUiV2SelfTestProposalSession,
  saveDesktopAssetRestoreUiV3SelfTestProposalSession,
  saveDesktopProjectProposalSession,
  saveDesktopProjectSaveUiSelfTestProposalSession,
  serializeDesktopProjectProposalSession,
  summarizeDesktopProjectProposalSessionLoad,
  DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_TOKEN_PREFIX,
  type DesktopProjectProposalSessionStorage,
} from "../apps/campaign-helper-desktop/src/project-proposal-session.js";

const projectId = "dbx:project:proposal-session";
const batchInput = {
  schemaVersion: "0.1.0" as const,
  batchId: "dbx:proposal:project-session-1",
  revision: 0,
  previousBatchSha256: null,
  producer: { kind: "project-store" as const, sourceId: "project.recovery", provider: null },
  reviewAuthority: { domain: "human-review" as const, requiredRole: "reviewer" as const },
  targetAuthority: { domain: "local-project" as const, requiredActiveGm: false },
  risk: "high" as const,
  base: { targetId: projectId, revision: 2, sha256: "a".repeat(64) },
  commands: [{ commandId: "dbx:proposal-command:project-session-1-000", kind: "project.recovery.backup-promote", dependsOn: [], payload: { projectId, generation: 2, previewSha256: "b".repeat(64) } }],
  createdAt: "2026-08-27T21:00:00.000Z",
};

class MemoryStorage implements DesktopProjectProposalSessionStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  setItem(key: string, value: string): void { this.values.set(key, value); }
  removeItem(key: string): void { this.values.delete(key); }
}

async function sessionFixture(targetProjectId = projectId) {
  const batch = await createProposalBatch(targetProjectId === projectId ? batchInput : {
    ...batchInput,
    batchId: `${batchInput.batchId}-${targetProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}`,
    base: { ...batchInput.base, targetId: targetProjectId },
    commands: [{
      ...batchInput.commands[0]!,
      commandId: `${batchInput.commands[0]!.commandId}-${targetProjectId.replace(/[^a-z0-9._-]/gi, "-").toLowerCase()}`,
      payload: { ...(batchInput.commands[0]!.payload as Record<string, unknown>), projectId: targetProjectId },
    }],
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-27T21:00:01.000Z");
  return createDesktopProjectProposalSession({ projectId: targetProjectId, batch, history });
}

async function projectSaveUiSelfTestSessionFixture() {
  const batch = await createProposalBatch({
    ...batchInput,
    batchId: "dbx:proposal:desktop-project-save-ui-self-test-1",
    producer: { kind: "project-store" as const, sourceId: "desktop.project.save", provider: null },
    base: { ...batchInput.base, targetId: DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID },
    commands: [{
      commandId: "dbx:proposal-command:desktop-project-save-ui-self-test-1-000",
      kind: "project.save" as const,
      dependsOn: [],
      payload: { operation: "project.save", projectId: DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID },
    }],
  });
  const history = await previewProposalBatch(batch, { actorId: "requester", role: "requester" }, "2026-08-30T10:10:00.000Z");
  return createDesktopProjectProposalSession({ projectId: DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, batch, history });
}

async function brokenReferenceUiSelfTestSessionFixture(
  testProjectId: string = DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID,
  version = "v2",
) {
  const testBatch = await createProposalBatch({
    ...batchInput,
    batchId: `dbx:proposal:desktop-project-broken-reference-detach-dbx-project-desktop-broken-reference-ui-lifecycle-self-test-${version}-1`,
    producer: { kind: "project-store" as const, sourceId: "project.broken-reference.detach.ui-self-test", provider: null },
    base: { ...batchInput.base, targetId: testProjectId },
    commands: [{
      commandId: `dbx:proposal-command:desktop-broken-reference-ui-lifecycle-self-test-${version}-1-000`,
      kind: "project.broken-reference.detach" as const,
      dependsOn: [],
      payload: {
        operation: "project.broken-reference.detach",
        projectId: testProjectId,
        generation: 1,
        nextGeneration: 2,
        contentSha256: "a".repeat(64),
        resultingContentSha256: "b".repeat(64),
        sceneId: `dbx:scene:broken-reference-ui-lifecycle-self-test-${version}-target`,
        sceneSha256: "c".repeat(64),
        assetId: `dbx:asset:broken-reference-ui-lifecycle-self-test-${version}`,
        blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
        assetDescriptorPreserved: true,
        assetTreeSha256: "d".repeat(64),
        previewSha256: "e".repeat(64),
      },
    }],
  });
  const history = await previewProposalBatch(testBatch, { actorId: "requester", role: "requester" }, "2026-08-29T21:00:01.000Z");
  return createDesktopProjectProposalSession({ projectId: testProjectId, batch: testBatch, history });
}

describe("project-target proposal session", () => {
  it("classifies only exact broken-reference ownership metadata without exposing session data", async () => {
    const expectedBatch = await createProposalBatch({
      ...batchInput,
      batchId: "dbx:proposal:desktop-project-broken-reference-detach-dbx-project-proposal-session-1735500000000",
      producer: { kind: "project-store", sourceId: "project.broken-reference.detach", provider: null },
      commands: [{
        commandId: "dbx:proposal-command:desktop-project-broken-reference-detach-dbx-project-proposal-session-1735500000000-000",
        kind: "project.broken-reference.detach",
        dependsOn: [],
        payload: {
          operation: "project.broken-reference.detach",
          projectId,
          generation: 2,
          nextGeneration: 3,
          contentSha256: "a".repeat(64),
          resultingContentSha256: "b".repeat(64),
          sceneId: "dbx:scene:broken-reference",
          sceneSha256: "c".repeat(64),
          assetId: "dbx:asset:broken-reference",
          blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH",
          assetDescriptorPreserved: true,
          assetTreeSha256: "d".repeat(64),
          previewSha256: "e".repeat(64),
        },
      }],
    });
    const ownershipToken = createDesktopBrokenReferenceUiOwnershipToken();
    const owned = await createDesktopBrokenReferenceUiOwnedProposalBatch(expectedBatch, ownershipToken);
    const ownedBatch = owned.batch;
    expect(ownedBatch.commands[0]?.payload).not.toHaveProperty("ownershipToken");
    const session = await createDesktopProjectProposalSession({
      projectId,
      batch: ownedBatch,
      history: await previewProposalBatch(ownedBatch, { actorId: "requester", role: "requester" }, "2026-08-27T21:00:01.000Z"),
    });
    const ownershipExpectation = owned.ownership;
    const serializedOwnedSession = await serializeDesktopProjectProposalSession(session);
    expect(serializedOwnedSession).not.toContain("ownershipToken");
    const ownedSessionStorage = new MemoryStorage();
    await saveDesktopProjectProposalSession(ownedSessionStorage, projectId, session);
    expect(ownedSessionStorage.getItem(desktopProjectProposalSessionStorageKey(projectId))).not.toContain(ownershipToken);
    expect(classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch, ownershipExpectation)).toEqual({
      disposition: "TEST_OWNED_EXACT",
      exactProject: true,
      exactProducer: true,
      exactCommand: true,
      exactBase: true,
      exactFixture: true,
      exactAuthority: true,
      exactBatchSemantics: true,
      exactIdentity: true,
      ownershipToken: true,
      previewed: true,
    });
    const withoutCurrentToken = classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch);
    expect(withoutCurrentToken.disposition).toBe("OWNERSHIP_UNPROVEN");
    expect(withoutCurrentToken.ownershipToken).toBe(false);
    const genericSession = await sessionFixture();
    const genericClassification = classifyDesktopBrokenReferenceUiSessionOwnership(genericSession, expectedBatch, ownershipExpectation);
    expect(genericClassification.disposition).toBe("OWNERSHIP_UNPROVEN");
    expect(genericClassification.exactProducer).toBe(false);
    expect(genericClassification.exactCommand).toBe(false);
    const staticToken = `${DESKTOP_BROKEN_REFERENCE_UI_OWNERSHIP_TOKEN_PREFIX}test-token`;
    expect(classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch, {
      token: staticToken,
      batchId: ownedBatch.batchId,
      commandId: ownedBatch.commands[0]!.commandId,
    }).disposition).toBe("OWNERSHIP_UNPROVEN");
    const mismatched = classifyDesktopBrokenReferenceUiSessionOwnership({
      ...session,
      batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, kind: "project.asset.detach" }] },
    }, expectedBatch, ownershipExpectation);
    expect(mismatched.disposition).toBe("OWNERSHIP_UNPROVEN");
    expect(mismatched.exactCommand).toBe(false);
    expect(mismatched.exactFixture).toBe(false);
    const mismatches = [
      ["project", { projectId: "dbx:project:other" }, "exactProject"],
      ["producer", { batch: { ...session.batch, producer: { ...session.batch.producer, sourceId: "project.asset.detach" } } }, "exactProducer"],
      ["base", { batch: { ...session.batch, base: { ...session.batch.base, sha256: "f".repeat(64) } } }, "exactBase"],
      ["fixture", { batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: { ...(session.batch.commands[0]!.payload as Record<string, unknown>), sceneId: "dbx:scene:other" } }] } }, "exactFixture"],
      ["payload-extra", { batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: { ...(session.batch.commands[0]!.payload as Record<string, unknown>), unexpected: "foreign" } }] } }, "exactFixture"],
      ["payload-missing", { batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: Object.fromEntries(Object.entries(session.batch.commands[0]!.payload as Record<string, unknown>).filter(([key]) => key !== "assetId")) } ] } }, "exactFixture"],
      ["authority", { batch: { ...session.batch, targetAuthority: { domain: "none", requiredActiveGm: false } } }, "exactAuthority"],
      ["semantics", { batch: { ...session.batch, risk: "low" } }, "exactBatchSemantics"],
      ["dependencies", { batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, dependsOn: ["dbx:proposal:foreign"] }] } }, "exactBatchSemantics"],
      ["identity", { batch: { ...session.batch, batchId: "dbx:proposal:desktop-project-broken-reference-detach-dbx-project-proposal-session-1735500000001", commands: [{ ...session.batch.commands[0]!, commandId: "dbx:proposal-command:dbx-project-proposal-session-1735500000001-000" }] } }, "exactIdentity"],
      ["command-id", { batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, commandId: "dbx:proposal-command:foreign-000" }] } }, "exactIdentity"],
      ["status", { history: { ...session.history, status: "approved" } }, "previewed"],
      ["cardinality", { batch: { ...session.batch, commands: [...session.batch.commands, session.batch.commands[0]!] } }, "exactCommand"],
    ] as const;
    for (const [, delta, flag] of mismatches) {
      const candidate = { ...session, ...(delta as Record<string, unknown>), batch: { ...session.batch, ...((delta as { batch?: Record<string, unknown> }).batch ?? {}) } } as typeof session;
      expect(classifyDesktopBrokenReferenceUiSessionOwnership(candidate, expectedBatch, ownershipExpectation)[flag]).toBe(false);
    }
    const batchOnlyIdentity = classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch, {
      ...ownershipExpectation,
      batchId: "dbx:proposal:desktop-project-broken-reference-detach-dbx-project-proposal-session-1735500000001",
    });
    expect(batchOnlyIdentity.exactIdentity).toBe(false);
    const commandOnlyIdentity = classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch, {
      ...ownershipExpectation,
      commandId: "dbx:proposal-command:dbx-project-proposal-session-1735500000001-000",
    });
    expect(commandOnlyIdentity.exactIdentity).toBe(false);
    const mismatchedToken = classifyDesktopBrokenReferenceUiSessionOwnership(session, expectedBatch, {
      token: createDesktopBrokenReferenceUiOwnershipToken(),
      batchId: ownedBatch.batchId,
      commandId: ownedBatch.commands[0]!.commandId,
    });
    expect(mismatchedToken.ownershipToken).toBe(false);
    for (const result of [withoutCurrentToken, genericClassification, mismatched, batchOnlyIdentity, commandOnlyIdentity, mismatchedToken]) {
      expect(result).not.toHaveProperty("projectId");
      expect(result).not.toHaveProperty("batchId");
      expect(result).not.toHaveProperty("commandId");
      expect(result).not.toHaveProperty("payload");
      expect(result).not.toHaveProperty("reason");
      expect(result).not.toHaveProperty("ownershipTokenValue");
    }
  });

  it("redacts load dispositions to the exact status needed by a self-test", async () => {
    const storage = new MemoryStorage();
    const missing = await loadDesktopProjectProposalSession(storage, projectId);
    expect(summarizeDesktopProjectProposalSessionLoad(missing)).toBe("MISSING");

    const session = await sessionFixture();
    await saveDesktopProjectProposalSession(storage, projectId, session);
    const pass = await loadDesktopProjectProposalSession(storage, projectId);
    expect(summarizeDesktopProjectProposalSessionLoad(pass)).toBe("PASS:previewed");
    expect(summarizeDesktopProjectProposalSessionLoad(pass)).not.toContain(projectId);
    if (pass.status !== "PASS") throw new Error("Expected a valid project session.");

    const blockedStorage = new MemoryStorage();
    blockedStorage.setItem(desktopProjectProposalSessionStorageKey(projectId), JSON.stringify({ schemaVersion: "invalid" }));
    const blocked = await loadDesktopProjectProposalSession(blockedStorage, projectId);
    expect(blocked.status).toBe("BLOCKED");
    expect(summarizeDesktopProjectProposalSessionLoad(blocked)).toBe("BLOCKED:MALFORMED_SESSION");
    expect(summarizeDesktopProjectProposalSessionLoad(blocked)).not.toContain("Stored project proposal session");
  });

  it("isolates the closed self-test namespace and preserves ordinary project sessions", async () => {
    const storage = new MemoryStorage();
    const ordinary = await sessionFixture();
    const selfTest = await brokenReferenceUiSelfTestSessionFixture();
    const ordinaryKey = desktopProjectProposalSessionStorageKey(projectId);
    const selfTestKey = desktopBrokenReferenceUiSelfTestSessionStorageKey();
    expect(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE).toBe("broken-reference-ui-self-test");
    expect(selfTestKey).not.toBe(ordinaryKey);
    expect(() => desktopProjectProposalSessionStorageKey(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID)).toThrow(/closed typed session namespace/);
    await saveDesktopProjectProposalSession(storage, projectId, ordinary);
    await expect(saveDesktopProjectProposalSession(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID, selfTest)).rejects.toThrow(/closed typed session namespace/);
    await expect(clearTerminalDesktopProjectProposalSession(storage, DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID)).rejects.toThrow(/closed typed session namespace/);
    await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, selfTest);
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: selfTest });
    const { batchSha256: _foreignBatchSha256, ...unsignedForeignBatch } = selfTest.batch;
    const foreignBatch = await createProposalBatch({ ...unsignedForeignBatch, producer: { ...selfTest.batch.producer, sourceId: "project.broken-reference.detach" } });
    const foreignSession = await createDesktopProjectProposalSession({
      projectId: DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID,
      batch: foreignBatch,
      history: await previewProposalBatch(foreignBatch, { actorId: "requester", role: "requester" }, "2026-08-29T21:00:01.500Z"),
    });
    await expect(saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, foreignSession)).rejects.toThrow(/closed test-owned proposal/);
    storage.setItem(selfTestKey, JSON.stringify(ordinary));
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "BLOCKED", code: "FOREIGN_SESSION" });
    storage.removeItem(selfTestKey);
    await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, selfTest);
    await expect(clearTerminalDesktopBrokenReferenceUiSelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: selfTest });
    const cancelled = await cancelDesktopProjectProposalSession(selfTest, { actorId: "reviewer", role: "reviewer" }, "2026-08-29T21:00:02.000Z");
    await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopBrokenReferenceUiSelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: selfTestKey });
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: selfTestKey });
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
  });

  it("isolates the save-ui self-test namespace from an ordinary session on the same fixed project", async () => {
    const storage = new MemoryStorage();
    const ordinary = await sessionFixture(DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID);
    const selfTest = await projectSaveUiSelfTestSessionFixture();
    const ordinaryKey = desktopProjectProposalSessionStorageKey(DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID);
    const selfTestKey = desktopProjectSaveUiSelfTestSessionStorageKey();
    expect(DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE).toBe("project-save-ui-self-test");
    expect(selfTestKey).not.toBe(ordinaryKey);
    expect(selfTestKey).toContain(DESKTOP_PROJECT_SAVE_UI_SELF_TEST_SCOPE);
    await saveDesktopProjectProposalSession(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID, ordinary);
    await saveDesktopProjectSaveUiSelfTestProposalSession(storage, selfTest);
    expect(await loadDesktopProjectProposalSession(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID)).toMatchObject({ status: "PASS", session: ordinary });
    expect(await loadDesktopProjectSaveUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: selfTest });
    await expect(saveDesktopProjectSaveUiSelfTestProposalSession(storage, ordinary)).rejects.toThrow(/closed test-owned proposal/);
    await expect(clearTerminalDesktopProjectSaveUiSelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    const cancelled = await cancelDesktopProjectProposalSession(selfTest, { actorId: "reviewer", role: "reviewer" }, "2026-08-30T10:10:01.000Z");
    await saveDesktopProjectSaveUiSelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopProjectSaveUiSelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: selfTestKey, projectContentWrite: false });
    expect(await loadDesktopProjectSaveUiSelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: selfTestKey });
    expect(await loadDesktopProjectProposalSession(storage, DESKTOP_PROJECT_SAVE_UI_SELF_TEST_PROJECT_ID)).toMatchObject({ status: "PASS", session: ordinary });
  });

  it("isolates the v3 fresh identity from the preserved v2 namespace", async () => {
    const storage = new MemoryStorage();
    const v2 = await brokenReferenceUiSelfTestSessionFixture();
    const v3 = await brokenReferenceUiSelfTestSessionFixture(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, "v3");
    const v2Key = desktopBrokenReferenceUiSelfTestSessionStorageKey();
    const v3Key = desktopBrokenReferenceUiV3SelfTestSessionStorageKey();
    expect(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_SCOPE).toBe("broken-reference-ui-self-test-v3");
    expect(v3Key).not.toBe(v2Key);
    expect(v3Key).not.toContain(encodeURIComponent(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID));
    expect(() => desktopProjectProposalSessionStorageKey(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID)).toThrow(/closed typed session namespace/);
    await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, v2);
    await saveDesktopBrokenReferenceUiV3SelfTestProposalSession(storage, v3);
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
    expect(await loadDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v3 });
    await expect(clearTerminalDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    const cancelled = await cancelDesktopProjectProposalSession(v3, { actorId: "reviewer", role: "reviewer" }, "2026-08-29T21:00:03.000Z");
    await saveDesktopBrokenReferenceUiV3SelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: v3Key });
    expect(await loadDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: v3Key });
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
  });

  it("isolates the asset-restore v2 identity and session namespace from ordinary state", async () => {
    const storage = new MemoryStorage();
    const ordinary = await sessionFixture();
    const restore = await sessionFixture(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID);
    const ordinaryKey = desktopProjectProposalSessionStorageKey(projectId);
    const restoreKey = desktopAssetRestoreUiV2SelfTestSessionStorageKey();
    expect(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE).toBe("asset-restore-ui-self-test-v2");
    expect(restoreKey).not.toBe(ordinaryKey);
    expect(restoreKey).toContain(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V2_SCOPE);
    expect(() => desktopProjectProposalSessionStorageKey(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID)).toThrow(/closed typed session namespace/);
    await saveDesktopProjectProposalSession(storage, projectId, ordinary);
    await saveDesktopAssetRestoreUiV2SelfTestProposalSession(storage, restore);
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
    expect(await loadDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: restore });
    await expect(clearTerminalDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    const cancelled = await cancelDesktopProjectProposalSession(restore, { actorId: "reviewer", role: "reviewer" }, "2026-08-29T21:00:05.000Z");
    await saveDesktopAssetRestoreUiV2SelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: restoreKey });
    expect(await loadDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: restoreKey });
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
  });

  it("isolates the asset-restore v3 identity and session namespace from preserved v2 and ordinary state", async () => {
    const storage = new MemoryStorage();
    const ordinary = await sessionFixture();
    const v2 = await sessionFixture(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID);
    const v3 = await sessionFixture(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID);
    const ordinaryKey = desktopProjectProposalSessionStorageKey(projectId);
    const v2Key = desktopAssetRestoreUiV2SelfTestSessionStorageKey();
    const v3Key = desktopAssetRestoreUiV3SelfTestSessionStorageKey();
    expect(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE).toBe("asset-restore-ui-self-test-v3");
    expect(v3Key).not.toBe(ordinaryKey);
    expect(v3Key).not.toBe(v2Key);
    expect(v3Key).not.toContain(encodeURIComponent(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_PROJECT_ID));
    expect(() => desktopProjectProposalSessionStorageKey(DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID)).toThrow(/closed typed session namespace/);
    await saveDesktopProjectProposalSession(storage, projectId, ordinary);
    await saveDesktopAssetRestoreUiV2SelfTestProposalSession(storage, v2);
    await saveDesktopAssetRestoreUiV3SelfTestProposalSession(storage, v3);
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
    expect(await loadDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
    expect(await loadDesktopAssetRestoreUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v3 });
    await expect(clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    const cancelled = await cancelDesktopProjectProposalSession(v3, { actorId: "reviewer", role: "reviewer" }, "2026-08-29T21:00:06.000Z");
    await saveDesktopAssetRestoreUiV3SelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: v3Key });
    expect(await loadDesktopAssetRestoreUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: v3Key });
    expect(await loadDesktopAssetRestoreUiV2SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
    expect(await loadDesktopProjectProposalSession(storage, projectId)).toMatchObject({ status: "PASS", session: ordinary });
  });

  it("isolates the v4 fresh identity from preserved v3 and v2 namespaces", async () => {
    const storage = new MemoryStorage();
    const v2 = await brokenReferenceUiSelfTestSessionFixture();
    const v3 = await brokenReferenceUiSelfTestSessionFixture(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID, "v3");
    const v4 = await brokenReferenceUiSelfTestSessionFixture(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID, "v4");
    const v2Key = desktopBrokenReferenceUiSelfTestSessionStorageKey();
    const v3Key = desktopBrokenReferenceUiV3SelfTestSessionStorageKey();
    const v4Key = desktopBrokenReferenceUiV4SelfTestSessionStorageKey();
    expect(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE).toBe("broken-reference-ui-self-test-v4");
    expect(v4Key).not.toBe(v2Key);
    expect(v4Key).not.toBe(v3Key);
    expect(v4Key).not.toContain(encodeURIComponent(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID));
    expect(() => desktopProjectProposalSessionStorageKey(DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID)).toThrow(/closed typed session namespace/);
    await saveDesktopBrokenReferenceUiSelfTestProposalSession(storage, v2);
    await saveDesktopBrokenReferenceUiV3SelfTestProposalSession(storage, v3);
    await saveDesktopBrokenReferenceUiV4SelfTestProposalSession(storage, v4);
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
    expect(await loadDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v3 });
    expect(await loadDesktopBrokenReferenceUiV4SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v4 });
    await expect(clearTerminalDesktopBrokenReferenceUiV4SelfTestProposalSession(storage)).rejects.toThrow(/terminal/);
    const cancelled = await cancelDesktopProjectProposalSession(v4, { actorId: "reviewer", role: "reviewer" }, "2026-08-29T21:00:04.000Z");
    await saveDesktopBrokenReferenceUiV4SelfTestProposalSession(storage, cancelled);
    await expect(clearTerminalDesktopBrokenReferenceUiV4SelfTestProposalSession(storage)).resolves.toMatchObject({ cleared: true, key: v4Key });
    expect(await loadDesktopBrokenReferenceUiV4SelfTestProposalSession(storage)).toMatchObject({ status: "MISSING", key: v4Key });
    expect(await loadDesktopBrokenReferenceUiV3SelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v3 });
    expect(await loadDesktopBrokenReferenceUiSelfTestProposalSession(storage)).toMatchObject({ status: "PASS", session: v2 });
  });

  it("stores, reloads, inspects, and advances one exact project batch without project writes", async () => {
    const storage = new MemoryStorage();
    const session = await sessionFixture();
    const saved = await saveDesktopProjectProposalSession(storage, projectId, session);
    expect(saved).toMatchObject({ projectContentWrite: false, batchRevision: 0, historyLength: 1 });
    const loaded = await loadDesktopProjectProposalSession(storage, projectId);
    expect(loaded.status).toBe("PASS");
    if (loaded.status !== "PASS") throw new Error("Expected project session.");
    expect(inspectDesktopProjectProposalSession(loaded.session)).toMatchObject({ projectId, status: "previewed", commandCount: 1, noWrite: true });
    const approved = await approveDesktopProjectProposalSession(loaded.session, { actorId: "reviewer", role: "reviewer" }, loaded.session.batch.base, "2026-08-27T21:00:02.000Z");
    expect(approved.history.status).toBe("approved");
    expect(approved.history.receipts).toHaveLength(2);
    expect(await saveDesktopProjectProposalSession(storage, projectId, approved)).toMatchObject({ projectContentWrite: false, historyLength: 2 });
    expect((await loadDesktopProjectProposalSession(storage, projectId)).status).toBe("PASS");
  });

  it("keeps history append-only, blocks replacement, and clears only exact terminal state", async () => {
    const storage = new MemoryStorage();
    const session = await sessionFixture();
    await saveDesktopProjectProposalSession(storage, projectId, session);
    const cancelled = await cancelDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, "2026-08-27T21:00:02.000Z");
    await saveDesktopProjectProposalSession(storage, projectId, cancelled);
    await expect(saveDesktopProjectProposalSession(storage, projectId, session)).rejects.toThrow(/terminal state|truncated/);
    await expect(clearTerminalDesktopProjectProposalSession(storage, projectId)).resolves.toMatchObject({ cleared: true, projectContentWrite: false });
    expect((await loadDesktopProjectProposalSession(storage, projectId)).status).toBe("MISSING");
  });

  it("supports unknown/recovery views and forbids cross-key, Scene, raw-byte, and credential sessions", async () => {
    const session = await sessionFixture();
    const approved = await approveDesktopProjectProposalSession(session, { actorId: "reviewer", role: "reviewer" }, session.batch.base, "2026-08-27T21:00:02.000Z");
    const applying = await createDesktopProjectProposalSession({
      projectId,
      batch: approved.batch,
      history: await beginProposalApply(approved.history, approved.batch, { actorId: "reviewer", role: "reviewer" }, approved.batch.base, "2026-08-27T21:00:02.500Z"),
    });
    const unknown = await markDesktopProjectProposalOutcomeUnknown(applying, { actorId: "reviewer", role: "reviewer" }, "2026-08-27T21:00:03.000Z");
    expect(desktopProjectProposalRecoveryView(unknown)).toMatchObject({ outcomeUnknown: true, authoritativeRereadRequired: true, retryAllowed: false });
    const recovered = await recoverDesktopProjectProposalSession(unknown, { actorId: "reviewer", role: "reviewer" }, { status: "not-committed", targetId: session.batch.base.targetId, revision: 2, sha256: "c".repeat(64) }, "2026-08-27T21:00:04.000Z");
    expect(recovered.history.status).toBe("recovered");
    await expect(createDesktopProjectProposalSession({ projectId: "dbx:project:other", batch: session.batch, history: session.history })).rejects.toThrow(/target/);
    await expect(createDesktopProjectProposalSession({ projectId, batch: { ...session.batch, targetAuthority: { domain: "foundry-active-gm", requiredActiveGm: true } }, history: session.history })).rejects.toThrow(/authority|target|hash/);
    await expect(createDesktopProjectProposalSession({ projectId, batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: { bytes: [1, 2, 3] } }] }, history: session.history })).rejects.toThrow(/hash|forbidden|bytes/);
    await expect(createDesktopProjectProposalSession({ projectId, batch: { ...session.batch, commands: [{ ...session.batch.commands[0]!, payload: { password: "secret" } }] }, history: session.history })).rejects.toThrow(/hash|forbidden|password/);
    expect(desktopProjectProposalSessionStorageKey(projectId)).toContain(encodeURIComponent(projectId));
  });
});
