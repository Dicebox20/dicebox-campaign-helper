import { describe, expect, it } from "vitest";
import {
  createFoundryIrPlan,
  createStagedBindingTableStore,
  executeStagedPlan,
  recoverStagedUnknown,
  StagedExecutionJournal,
  type StagedExecutionAdapter,
} from "@dicebox/compiler";
import {
  createStableDiceBoxId,
  type Result,
  type RuntimeBinding,
  type RuntimeProfile,
} from "@dicebox/core";

const observedAt = "2026-08-27T12:00:00.000Z";
const approvedByUserId = "gm-fixture";

function runtime(): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene", "Region"],
    capabilities: [
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.document.write", state: "available", reason: "injected fixture only" },
    ],
  };
}

async function plan() {
  const sceneId = createStableDiceBoxId("scene", "staged-executor");
  const regionId = createStableDiceBoxId("region", "staged-executor");
  return createFoundryIrPlan({
    planId: createStableDiceBoxId("plan", "staged-executor"),
    target: {
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      adapterId: "fixture.staged-executor",
      adapterVersion: "0.1.0",
    },
    runtimeProfile: runtime(),
    documents: [
      {
        stableId: regionId,
        documentType: "Region",
        operation: "create",
        parentStableId: sceneId,
        dependencies: [sceneId],
        foundryApi: "scene.createEmbeddedDocuments(Region)",
        ownership: { moduleId: "dicebox-campaign-helper", stableId: regionId, mode: "managed" },
        payload: { documentType: "Region", fields: { name: "Fixture region", polygonPoints: [0, 0, 100, 0, 100, 100], hole: false } },
      },
      {
        stableId: sceneId,
        documentType: "Scene",
        operation: "create",
        parentStableId: null,
        dependencies: [],
        foundryApi: "Scene.create",
        ownership: { moduleId: "dicebox-campaign-helper", stableId: sceneId, mode: "managed" },
        payload: { documentType: "Scene", fields: { name: "Fixture scene", width: 1000, height: 1000, gridSize: 100 } },
      },
    ],
  });
}

function semanticKind(documentType: string): "scene" | "region" | "journal" {
  return documentType === "Scene" ? "scene" : documentType === "Region" ? "region" : "journal";
}

type FixtureMode = "success" | "timeout" | "unknown-read" | "conflict" | "not-found";

function fixtureAdapter(mode: FixtureMode, currentPlan: Awaited<ReturnType<typeof plan>>) {
  const records = new Map<string, RuntimeBinding>();
  const calls: Array<{ operation: string; stableId: string; dependencies: readonly string[]; idempotencyKey: string }> = [];
  let reads = 0;
  const adapter: StagedExecutionAdapter = {
    adapterId: "fixture.staged-executor@0.1.0",
    async create(document, dependencies, idempotencyKey): Promise<Result<RuntimeBinding>> {
      calls.push({ operation: "create", stableId: document.stableId, dependencies: dependencies.map(({ stableId }) => stableId), idempotencyKey });
      const existing = records.get(document.stableId);
      if (existing) return { ok: true, value: existing };
      const binding: RuntimeBinding = {
        semantic: { id: document.stableId, kind: semanticKind(document.documentType) },
        runtime: "foundry",
        documentType: document.documentType,
        documentId: `${document.documentType.toLowerCase()}-fixture`,
        uuid: `${document.documentType}.world.${document.stableId.split(":").at(-1)}`,
        generation: 1,
      };
      if (mode !== "timeout") records.set(document.stableId, binding);
      if (mode === "timeout") return { ok: false, error: { code: "UNKNOWN_OUTCOME", message: "fixture transport timeout", retry: "after-reread" } };
      return { ok: true, value: binding };
    },
    async update(document, binding, dependencies, idempotencyKey): Promise<Result<RuntimeBinding>> {
      calls.push({ operation: "update", stableId: document.stableId, dependencies: dependencies.map(({ stableId }) => stableId), idempotencyKey });
      records.set(document.stableId, binding);
      return { ok: true, value: binding };
    },
    async read(document, binding): Promise<Result<import("@dicebox/compiler").StagedReadback>> {
      reads += 1;
      if (mode === "unknown-read" && reads === 1) return { ok: false, error: { code: "UNKNOWN_OUTCOME", message: "fixture reread timeout", retry: "after-reread" } };
      if (mode === "not-found") return {
        ok: true,
        value: { schemaVersion: "0.1.0", stableId: document.stableId, planId: currentPlan.planId, planSha256: currentPlan.planSha256, status: "not-found", binding: null, observedAt, foreignStatePreserved: true },
      };
      if (mode === "conflict") return {
        ok: true,
        value: { schemaVersion: "0.1.0", stableId: document.stableId, planId: currentPlan.planId, planSha256: currentPlan.planSha256, status: "conflict", binding, observedAt, foreignStatePreserved: true },
      };
      const observed = records.get(document.stableId) ?? binding;
      if (!observed) return {
        ok: true,
        value: { schemaVersion: "0.1.0", stableId: document.stableId, planId: currentPlan.planId, planSha256: currentPlan.planSha256, status: "not-found", binding: null, observedAt, foreignStatePreserved: true },
      };
      return {
        ok: true,
        value: { schemaVersion: "0.1.0", stableId: document.stableId, planId: currentPlan.planId, planSha256: currentPlan.planSha256, status: "matched", binding: observed, observedAt, foreignStatePreserved: true },
      };
    },
  };
  return { adapter, calls, records };
}

function memoryBindings() {
  let text = "";
  const store = createStagedBindingTableStore({
    read: async () => text,
    write: async (serialized) => { text = serialized; },
  });
  return { store, text: () => text };
}

function executeInput(currentPlan: Awaited<ReturnType<typeof plan>>, adapter: StagedExecutionAdapter, bindings: ReturnType<typeof memoryBindings>["store"], journal = new StagedExecutionJournal()) {
  return {
    plan: currentPlan,
    approvedPlanSha256: currentPlan.planSha256,
    approvedByUserId,
    activeGmUserId: approvedByUserId,
    observedAt,
    adapter,
    bindings,
    journal,
  };
}

describe("runtime-neutral staged Foundry IR executor", () => {
  it("dispatches one dependency at a time and persists the binding before the child", async () => {
    const currentPlan = await plan();
    const fixture = fixtureAdapter("success", currentPlan);
    const bindings = memoryBindings();
    const result = await executeStagedPlan(executeInput(currentPlan, fixture.adapter, bindings.store));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.state).toBe("committed");
      expect(result.value.committedStableIds).toEqual(currentPlan.dependencyOrder);
      expect(result.value.receipt.noSameBatchReferences).toBe(true);
      expect(result.value.receipt.authoritativeReread).toBe(true);
      expect(result.value.receipt.readyClaim).toBe(false);
    }
    expect(fixture.calls.map(({ stableId }) => stableId)).toEqual(currentPlan.dependencyOrder);
    expect(fixture.calls[0]?.dependencies).toEqual([]);
    expect(fixture.calls[1]?.dependencies).toEqual([currentPlan.dependencyOrder[0]]);
    const restarted = createStagedBindingTableStore({ read: async () => bindings.text(), write: async () => undefined });
    const stored = await restarted.entries();
    expect(stored.ok).toBe(true);
    if (stored.ok) expect(stored.value.map(({ stableId }) => stableId)).toEqual([...currentPlan.dependencyOrder].sort());
  });

  it("rejects stale plans and active-GM drift before adapter dispatch", async () => {
    const currentPlan = await plan();
    const fixture = fixtureAdapter("success", currentPlan);
    const bindings = memoryBindings();
    const stale = await executeStagedPlan({ ...executeInput(currentPlan, fixture.adapter, bindings.store), approvedPlanSha256: "f".repeat(64) });
    const wrongGm = await executeStagedPlan({ ...executeInput(currentPlan, fixture.adapter, bindings.store), activeGmUserId: "other-gm" });
    expect(stale.ok && stale.value.state).toBe("blocked");
    expect(wrongGm.ok && wrongGm.value.state).toBe("blocked");
    expect(fixture.calls).toHaveLength(0);
  });

  it("replays idempotently from persisted bindings without a duplicate create", async () => {
    const currentPlan = await plan();
    const firstFixture = fixtureAdapter("success", currentPlan);
    const bindings = memoryBindings();
    const first = await executeStagedPlan(executeInput(currentPlan, firstFixture.adapter, bindings.store));
    expect(first.ok && first.value.state).toBe("committed");
    const secondFixture = fixtureAdapter("success", currentPlan);
    for (const [stableId, binding] of firstFixture.records) secondFixture.records.set(stableId, binding);
    const second = await executeStagedPlan(executeInput(currentPlan, secondFixture.adapter, bindings.store));
    expect(second.ok && second.value.state).toBe("committed");
    expect(secondFixture.calls).toHaveLength(0);
    expect(second.ok && second.value.receipt).toEqual(first.ok && first.value.receipt);
  });

  it("stops on a timeout as unknown and recovery does not retry automatically", async () => {
    const currentPlan = await plan();
    const fixture = fixtureAdapter("timeout", currentPlan);
    const bindings = memoryBindings();
    const journal = new StagedExecutionJournal();
    const result = await executeStagedPlan(executeInput(currentPlan, fixture.adapter, bindings.store, journal));
    expect(result.ok && result.value.state).toBe("unknown-outcome");
    expect(result.ok && result.value.receipt.unknownOutcome).toBe(true);
    const recovered = await recoverStagedUnknown({
      plan: currentPlan,
      stableId: currentPlan.dependencyOrder[0]!,
      approvedByUserId,
      activeGmUserId: approvedByUserId,
      observedAt,
      adapter: fixture.adapter,
      bindings: bindings.store,
      journal,
    });
    expect(recovered.ok && recovered.value.state).toBe("recovered");
    expect(fixture.calls).toHaveLength(1);
    expect(journal.entries().at(-1)?.resolution).toBe("not-committed");
  });

  it("recovers a failed authoritative reread into a committed binding", async () => {
    const currentPlan = await plan();
    const fixture = fixtureAdapter("unknown-read", currentPlan);
    const bindings = memoryBindings();
    const journal = new StagedExecutionJournal();
    const result = await executeStagedPlan(executeInput(currentPlan, fixture.adapter, bindings.store, journal));
    expect(result.ok && result.value.state).toBe("unknown-outcome");
    const recovered = await recoverStagedUnknown({
      plan: currentPlan,
      stableId: currentPlan.dependencyOrder[0]!,
      approvedByUserId,
      activeGmUserId: approvedByUserId,
      observedAt,
      adapter: fixture.adapter,
      bindings: bindings.store,
      journal,
    });
    expect(recovered.ok && recovered.value.state).toBe("committed");
    expect(fixture.calls).toHaveLength(1);
    const stored = await bindings.store.entries();
    expect(stored.ok && stored.value).toHaveLength(1);
  });

  it("preserves foreign conflict and rejects malformed binding-table state", async () => {
    const currentPlan = await plan();
    const conflictFixture = fixtureAdapter("conflict", currentPlan);
    const conflictBindings = memoryBindings();
    const conflict = await executeStagedPlan(executeInput(currentPlan, conflictFixture.adapter, conflictBindings.store));
    expect(conflict.ok && conflict.value.state).toBe("blocked");
    expect(conflict.ok && conflict.value.receipt.foreignStatePreserved).toBe(true);
    const malformed = createStagedBindingTableStore({ read: async () => "{bad", write: async () => undefined });
    expect((await malformed.load()).ok).toBe(false);
  });
});
