import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditFoundryFixtureObservation,
  auditFoundryFixtureRoundEvidence,
  createFixtureObservationBundle,
  createFixtureRoundHarnessAudit,
  createHarnessEvidenceBundle,
  FoundryFixtureObservationBundleAuditSchema,
  FoundryFixtureObservationRequestSchema,
  FoundryFixtureObservationReceiptSchema,
  FoundryFixtureRoundEvidenceSchema,
  FoundryFixtureRoundHarnessAuditSchema,
} from "@dicebox/core";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const observationAuditCli = resolve(root, "tools/audit-foundry-fixture-observation.ts");
const observationBundleAuditCli = resolve(root, "tools/audit-foundry-fixture-observation-bundle.ts");
const fixtureRoundEvidenceAuditCli = resolve(root, "tools/audit-foundry-fixture-round.ts");
const tsxCli = resolve(root, "node_modules/tsx/dist/cli.mjs");

function createExactRuntime() {
  let readyCallback: (() => unknown) | undefined;
  let activityUseCalls = 0;
  const journal = {
    id: "journal-1",
    uuid: "JournalEntry.world.journal-1",
    pages: [{ type: "text", text: { content: "secret fixture content" } }],
    flags: { "dicebox-campaign-helper": { schemaVersion: "0.1.0", semanticId: "dbx:journal:fixture", planId: "dbx:plan:foundry-fixture-m21" } },
  };
  const activity = {
    id: "activity-1",
    canUse: true,
    isOwner: true,
    use: () => { activityUseCalls += 1; },
  };
  const item = {
    id: "item-1",
    uuid: "Item.world.item-1",
    flags: { "dicebox-campaign-helper": { schemaVersion: "0.1.0", semanticId: "dbx:activity:fixture", planId: "dbx:plan:foundry-fixture-m21" } },
    system: { activities: { contents: [activity] } },
    getEmbeddedDocument: (type: string, id: string) => type === "Activity" && id === "activity-1" ? activity : undefined,
  };
  const behavior = { type: "teleport", active: true, disabled: false };
  const region = {
    id: "region-1",
    uuid: "Region.world.region-1",
    shapes: [{ type: "rectangle" }],
    flags: { "dicebox-campaign-helper": { schemaVersion: "0.1.0", semanticId: "dbx:region:fixture", planId: "dbx:plan:foundry-fixture-m21" } },
    getEmbeddedCollection: (type: string) => type === "RegionBehavior" ? { contents: [behavior] } : { contents: [] },
  };
  const scene = {
    id: "scene-1",
    uuid: "Scene.world.scene-1",
    regions: { contents: [region], get: (id: string) => id === "region-1" ? region : undefined },
    getEmbeddedDocument: (type: string, id: string) => type === "Region" && id === "region-1" ? region : undefined,
  };
  const byUuid = new Map<string, any>([
    [journal.uuid, journal],
    [item.uuid, item],
    [scene.uuid, scene],
  ]);
  const runtime: any = {
    Hooks: {
      on: () => 1,
      once: (_name: string, callback: () => unknown) => { readyCallback = callback; return 1; },
      call: () => true,
      callAll: () => undefined,
    },
    CONFIG: {
      DND5E: { activityTypes: { utility: { documentClass: { prototype: { use: () => undefined } } } } },
      JournalEntryPage: { defaultType: "text" },
      RegionBehavior: { dataModels: { teleport: { events: ["enter"] } } },
    },
    CONST: { JOURNAL_ENTRY_PAGE_FORMATS: { TEXT: 1 } },
    JournalEntry: { create: () => undefined, prototype: { update: () => undefined, createEmbeddedDocuments: () => undefined } },
    RegionDocument: class RegionDocument { static documentName = "Region"; },
    RegionBehavior: class RegionBehavior { static documentName = "RegionBehavior"; },
    fromUuid: async (uuid: string) => byUuid.get(uuid),
    foundry: { documents: { Actor: class Actor {}, Item: class Item {} }, abstract: { Document: class Document {} } },
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      modules: new Map([["dicebox-campaign-helper", { id: "dicebox-campaign-helper", active: true }]]),
      documentTypes: { JournalEntry: ["base"], Item: ["base"], Scene: ["base"] },
      actors: { contents: [], get: () => undefined },
      items: { contents: [item], get: (id: string) => id === item.id ? item : undefined },
      scenes: { contents: [scene], get: (id: string) => id === scene.id ? scene : undefined },
      journal: { contents: [journal], get: (id: string) => id === journal.id ? journal : undefined },
      folders: {},
      users: { activeGM: { id: "gm-fixture" }, getDesignatedUser: () => undefined },
      user: { id: "gm-fixture", isGM: true },
    },
  };
  return { runtime, getReady: () => readyCallback, getActivityUseCalls: () => activityUseCalls };
}

describe("Foundry fixture observation boundary", () => {
  it("runs the M21 Journal, Activity, and Region reads with rereads and no mutation", async () => {
    const modulePath = fileURLToPath(new URL("../packages/dicebox-foundry/src/module.js", import.meta.url));
    const module = await import(modulePath);
    const { runtime, getReady, getActivityUseCalls } = createExactRuntime();
    module.bootstrapDiceBoxCampaignHelper(runtime);
    getReady()?.();
    const request = {
      kind: "fixture-observation",
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
      context: "GM",
      fixtures: [
        { semanticId: "dbx:journal:fixture", kind: "journal", uuid: "JournalEntry.world.journal-1" },
        { semanticId: "dbx:activity:fixture", kind: "activity", parentUuid: "Item.world.item-1", activityId: "activity-1" },
        { semanticId: "dbx:region:fixture", kind: "region", sceneUuid: "Scene.world.scene-1", regionId: "region-1" },
      ],
    } as const;
    expect(FoundryFixtureObservationRequestSchema.parse(request).fixtures).toHaveLength(3);
    const receipt = await runtime.game.diceboxCampaignHelper.query(request);
    const parsed = FoundryFixtureObservationReceiptSchema.parse(receipt);
    expect(parsed.status).toBe("observed");
    expect(parsed.evidenceClass).toBe("full_function");
    expect(parsed.noWrite).toBe(true);
    expect(parsed.noRawData).toBe(true);
    expect(parsed.observations.map((entry) => entry.status)).toEqual(["observed", "observed", "observed"]);
    expect(parsed.observations.find((entry) => entry.kind === "activity")?.readiness).toEqual({ canUse: true, isOwner: true });
    expect(parsed.observations.find((entry) => entry.kind === "region")?.behaviorTypes).toEqual(["teleport"]);
    expect(JSON.stringify(parsed)).not.toContain("secret fixture content");
    expect(JSON.stringify(parsed)).not.toContain("JournalEntry.world.journal-1");
    expect(getActivityUseCalls()).toBe(0);
    const audit = auditFoundryFixtureObservation(parsed);
    expect(audit).toMatchObject({ status: "reviewable", exactTargetMatch: true, readyClaim: false, foundryApiEvidence: "read-only-exercised" });
    const processResult = spawnSync(process.execPath, [tsxCli, observationAuditCli], {
      cwd: root,
      input: JSON.stringify(parsed),
      encoding: "utf8",
      windowsHide: true,
    });
    expect(processResult.status).toBe(0);
    expect(JSON.parse(processResult.stdout)).toMatchObject({ status: "reviewable", readyClaim: false, noWrite: true });
    expect(processResult.stderr).toBe("");
  });

  it("blocks invalid requests and never echoes untrusted references", async () => {
    const modulePath = fileURLToPath(new URL("../packages/dicebox-foundry/src/module.js", import.meta.url));
    const module = await import(modulePath);
    const { runtime, getReady } = createExactRuntime();
    module.bootstrapDiceBoxCampaignHelper(runtime);
    getReady()?.();
    const receipt = await runtime.game.diceboxCampaignHelper.query({
      kind: "fixture-observation",
      fixturePlanId: "dbx:plan:wrong",
      context: "GM",
      fixtures: [{ semanticId: "dbx:journal:fixture", kind: "journal", uuid: "JournalEntry.world.secret" }],
    });
    const parsed = FoundryFixtureObservationReceiptSchema.parse(receipt);
    expect(parsed.status).toBe("blocked");
    expect(JSON.stringify(parsed)).not.toContain("JournalEntry.world.secret");
    expect(auditFoundryFixtureObservation(parsed)).toMatchObject({ status: "blocked", readyClaim: false, noWrite: true });
  });

  it("blocks a tampered Foundry API check without repairing the receipt", () => {
    const { runtime } = createExactRuntime();
    void runtime;
    const audit = auditFoundryFixtureObservation({
      schemaVersion: "0.1.0",
      receiptId: "dbx:receipt:fixture-observation-test",
      operation: "foundry.fixture.observation",
      status: "observed",
      evidenceClass: "full_function",
      source: "foundry-ready-hook",
      target: { fingerprintId: "dbx:fingerprint:test", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" },
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
      context: "GM",
      activeGm: { status: "observed", source: "game.users.activeGM", userFingerprint: "redacted:12345678", isCurrentUser: true },
      observations: [{ semanticId: "dbx:journal:fixture", kind: "journal", status: "observed", bindingFingerprint: "redacted:12345678", childCount: 1, shapeCount: null, behaviorTypes: [], readiness: null, notes: ["read"] }],
      checks: [
        { id: "ready-lifecycle", status: "pass", foundryApi: "Hooks.once(\"ready\")", reason: "pass" },
        { id: "target-fingerprint", status: "pass", foundryApi: "game.version + game.system.id + game.system.version", reason: "pass" },
        { id: "active-gm", status: "pass", foundryApi: "game.users.activeGM / User permissions", reason: "pass" },
        { id: "context", status: "pass", foundryApi: "game.user / User.isGM", reason: "pass" },
        { id: "journal-observation", status: "pass", foundryApi: "tampered", reason: "pass" },
        { id: "activity-observation", status: "pass", foundryApi: "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\", id)", reason: "pass" },
        { id: "region-observation", status: "pass", foundryApi: "game.scenes.get / scene.getEmbeddedDocument(\"Region\", id) / RegionDocument.shapes", reason: "pass" },
        { id: "authoritative-reread", status: "pass", foundryApi: "fromUuid / document collections / embedded-document getters", reason: "pass" },
        { id: "no-write", status: "pass", foundryApi: "no Foundry create/update/delete or Activity.use invocation", reason: "pass" },
      ],
      noWrite: true,
      noRawData: true,
      mutation: "disabled",
      observedAt: "2026-08-21T12:00:00.000Z",
    });
    expect(audit.status).toBe("blocked");
    expect(audit.readyClaim).toBe(false);
  });

  it("normalizes GM and Player3 observations into the existing blocked exact-runtime lane", async () => {
    const modulePath = fileURLToPath(new URL("../packages/dicebox-foundry/src/module.js", import.meta.url));
    const module = await import(modulePath);
    const { runtime, getReady } = createExactRuntime();
    module.bootstrapDiceBoxCampaignHelper(runtime);
    getReady()?.();
    const request = {
      kind: "fixture-observation",
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
      context: "GM",
      fixtures: [
        { semanticId: "dbx:journal:fixture", kind: "journal", uuid: "JournalEntry.world.journal-1" },
        { semanticId: "dbx:activity:fixture", kind: "activity", parentUuid: "Item.world.item-1", activityId: "activity-1" },
        { semanticId: "dbx:region:fixture", kind: "region", sceneUuid: "Scene.world.scene-1", regionId: "region-1" },
      ],
    } as const;
    const gmReceipt = await runtime.game.diceboxCampaignHelper.query(request);
    runtime.game.user.isGM = false;
    const playerReceipt = await runtime.game.diceboxCampaignHelper.query({ ...request, context: "Player3" });
    const profile = runtime.game.diceboxCampaignHelper.query({ kind: "runtime-profile" });
    const normalized = createFixtureObservationBundle({ profile, receipts: [gmReceipt, playerReceipt] });
    expect(FoundryFixtureObservationBundleAuditSchema.parse(normalized.audit)).toMatchObject({
      status: "reviewable",
      readyClaim: false,
      noWrite: true,
      contexts: ["GM", "Player3"],
    });
    expect(normalized.laneReceipt).toMatchObject({ laneId: "exact-runtime", status: "blocked", evidenceClass: "blocked", contexts: ["GM", "Player3"] });
    expect(normalized.laneReceipt.checks.find((entry) => entry.id === "native-operation")).toMatchObject({ status: "blocked" });
    const bundle = createHarnessEvidenceBundle({ profile, receipts: [normalized.laneReceipt] });
    expect(bundle.bundle.certificate.status).toBe("blocked");
    expect(bundle.bundle.certificate.blockers.some((entry: { laneId: string }) => entry.laneId === "exact-runtime")).toBe(true);
    const processResult = spawnSync(process.execPath, [tsxCli, observationBundleAuditCli], {
      cwd: root,
      input: JSON.stringify({ profile, receipts: [gmReceipt, playerReceipt] }),
      encoding: "utf8",
      windowsHide: true,
    });
    expect(processResult.status).toBe(0);
    expect(JSON.parse(processResult.stdout)).toMatchObject({ status: "reviewable", readyClaim: false, noWrite: true });
    expect(processResult.stderr).toBe("");
  });

  it("audits M21 Foundry API and artifact coverage without promoting the round", async () => {
    const modulePath = fileURLToPath(new URL("../packages/dicebox-foundry/src/module.js", import.meta.url));
    const module = await import(modulePath);
    const { runtime, getReady } = createExactRuntime();
    module.bootstrapDiceBoxCampaignHelper(runtime);
    getReady()?.();
    const fixtures = [
      { semanticId: "dbx:journal:fixture", kind: "journal", uuid: "JournalEntry.world.journal-1" },
      { semanticId: "dbx:activity:fixture", kind: "activity", parentUuid: "Item.world.item-1", activityId: "activity-1" },
      { semanticId: "dbx:region:fixture", kind: "region", sceneUuid: "Scene.world.scene-1", regionId: "region-1" },
    ] as const;
    const gmReceipt = await runtime.game.diceboxCampaignHelper.query({
      kind: "fixture-observation",
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
      context: "GM",
      fixtures,
    });
    runtime.game.user.isGM = false;
    const playerReceipt = await runtime.game.diceboxCampaignHelper.query({
      kind: "fixture-observation",
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
      context: "Player3",
      fixtures,
    });
    const profile = runtime.game.diceboxCampaignHelper.query({ kind: "runtime-profile" });
    const report = auditFoundryFixtureRoundEvidence({
      profile,
      receipts: [gmReceipt, playerReceipt],
      artifacts: [],
      artifactBindings: [],
    });
    expect(FoundryFixtureRoundEvidenceSchema.parse(report)).toMatchObject({
      operation: "foundry.fixture.round.evidence.audit",
      status: "blocked",
      readyClaim: false,
      noWrite: true,
      noRawData: true,
      contexts: ["GM", "Player3"],
      fixturePlanId: "dbx:plan:foundry-fixture-m21",
    });
    expect(report.checks).toHaveLength(14);
    expect(report.checks.every((check) => check.status === "blocked")).toBe(true);
    expect(report.blockers.some((reason) => reason.includes("runtime-evidence-query"))).toBe(true);
    const harnessAudit = createFixtureRoundHarnessAudit({ profile, evidence: report });
    expect(FoundryFixtureRoundHarnessAuditSchema.parse(harnessAudit)).toMatchObject({
      operation: "foundry.fixture.round.harness.audit",
      status: "blocked",
      readyClaim: false,
      noWrite: true,
    });
    expect(harnessAudit.laneReceipt).toMatchObject({ laneId: "exact-runtime", status: "blocked", evidenceClass: "blocked", contexts: ["GM", "Player3"] });
    expect(harnessAudit.laneReceipt.checks.find((check) => check.id === "native-operation")).toMatchObject({ status: "blocked" });
    expect(harnessAudit.laneReceipt.checks.find((check) => check.id === "authority")).toMatchObject({ status: "blocked" });
    expect(createHarnessEvidenceBundle({ profile, receipts: [harnessAudit.laneReceipt] }).bundle.certificate.status).toBe("blocked");
    const processResult = spawnSync(process.execPath, [tsxCli, fixtureRoundEvidenceAuditCli], {
      cwd: root,
      input: JSON.stringify({ profile, receipts: [gmReceipt, playerReceipt], artifacts: [], artifactBindings: [] }),
      encoding: "utf8",
      windowsHide: true,
    });
    expect(processResult.status).toBe(2);
    expect(JSON.parse(processResult.stdout)).toMatchObject({ operation: "foundry.fixture.round.evidence.audit", status: "blocked", readyClaim: false });
    expect(processResult.stdout).not.toContain("JournalEntry.world.journal-1");
    expect(processResult.stderr).toBe("");
  });
});
