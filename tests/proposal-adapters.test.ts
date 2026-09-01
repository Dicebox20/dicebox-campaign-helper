import { describe, expect, it } from "vitest";
import { createTechnicalBuilderProposalBatch, type CodexTechnicalJobReceipt } from "@dicebox/codex-adapter";
import { createFoundryIrPlan, createFoundryIrProposalBatch } from "@dicebox/compiler";
import { validateProposalBatch, type RuntimeProfile } from "@dicebox/core";
import { createCampaignDirectorProposalBatch, reviewCampaignDirectorFunctionCall } from "@dicebox/director";
import { createHumanSceneProposalBatch, type SceneCommand } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";

const observedAt = "2026-08-27T21:00:00.000Z";
const hashA = "a".repeat(64);

const humanCommand: SceneCommand = {
  schemaVersion: "0.1.0",
  kind: "translate-entity",
  commandId: "human-adapter-1",
  baseRevision: fixtureScene.revision,
  entityId: "dbx:apparatus:core",
  deltaX: 8,
  deltaY: 0,
  origin: { kind: "human", principalId: "desktop-user", reason: "Move right" },
};

function directorReceipt() {
  return reviewCampaignDirectorFunctionCall(fixtureScene, {
    id: "director-call-1",
    type: "function_call",
    name: "propose_scene_command",
    arguments: JSON.stringify({
      commandId: "director-adapter-1",
      baseRevision: fixtureScene.revision,
      entityId: "dbx:apparatus:core",
      deltaX: 8,
      deltaY: 0,
      reason: "Move right",
    }),
  });
}

function technicalReceipt(overrides: Partial<CodexTechnicalJobReceipt> = {}): CodexTechnicalJobReceipt {
  return {
    operation: "dicebox.codex.technical-job.readback",
    status: "PASS",
    schemaVersion: "0.2.0",
    jobId: "technical-job-1",
    threadId: "thread-1",
    turnId: "turn-1",
    auth: { mode: "chatgpt", planType: "plus" },
    patchItems: [{ path: "src/example.ts", diff: "+PASS" }],
    messages: [],
    errors: [],
    approvalsRequired: [],
    readback: {
      expectedPath: "src/example.ts",
      changedPaths: ["src/example.ts"],
      beforeSha256: "b".repeat(64),
      afterSha256: "c".repeat(64),
      expectedChecksPassed: true,
    },
    implicitExecution: false,
    runtimeAuthority: false,
    reviewRequired: true,
    ...overrides,
  };
}

function profile(): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene"],
    capabilities: [
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.document.write", state: "available", reason: "fixture" },
    ],
  };
}

async function foundryPlan() {
  return createFoundryIrPlan({
    planId: "dbx:plan:proposal-adapter",
    target: {
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      adapterId: "foundry-document-plan",
      adapterVersion: "0.1.0",
    },
    runtimeProfile: profile(),
    documents: [{
      stableId: "dbx:scene:proposal-adapter",
      documentType: "Scene",
      operation: "create",
      parentStableId: null,
      dependencies: [],
      foundryApi: "Scene.create(data)",
      ownership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:scene:proposal-adapter", mode: "managed" },
      payload: { documentType: "Scene", fields: { name: "Adapter", width: 1000, height: 800, gridSize: 50 } },
    }],
  });
}

describe("cross-producer proposal adapters", () => {
  it("normalizes four producers into the same inspectable batch vocabulary without sharing authority", async () => {
    const director = directorReceipt();
    if (director.status !== "PASS") throw new Error(director.reason);
    const batches = [
      await createHumanSceneProposalBatch({ batchId: "dbx:proposal:human-adapter", document: fixtureScene, documentSha256: hashA, command: humanCommand, createdAt: observedAt }),
      await createCampaignDirectorProposalBatch({ batchId: "dbx:proposal:director-adapter", receipt: director, documentSha256: hashA, provider: "chatgpt-subscription", createdAt: observedAt }),
      await createTechnicalBuilderProposalBatch({ batchId: "dbx:proposal:technical-adapter", receipt: technicalReceipt(), repositoryId: "dbx:repository:campaign-helper", repositoryRevision: 12, createdAt: observedAt }),
      await createFoundryIrProposalBatch({ plan: await foundryPlan(), createdAt: observedAt }),
    ];

    await Promise.all(batches.map((batch) => validateProposalBatch(batch)));
    expect(batches.map((batch) => batch.producer.kind)).toEqual(["human", "campaign-director", "technical-builder", "foundry"]);
    expect(batches.map((batch) => batch.reviewAuthority.domain)).toEqual(["human-review", "human-review", "repository-integration", "foundry-runtime"]);
    expect(batches.map((batch) => batch.targetAuthority.domain)).toEqual(["local-project", "local-project", "repository", "foundry-active-gm"]);
    expect(batches.map((batch) => batch.targetAuthority.requiredActiveGm)).toEqual([false, false, false, true]);
    expect(batches.every((batch) => batch.commands.length > 0 && batch.batchSha256.length === 64)).toBe(true);
    expect(batches[0]?.commands[0]?.payload).toMatchObject({ commandId: "human-adapter-1", origin: { kind: "human" } });
    expect(batches[1]?.producer.provider).toBe("chatgpt-subscription");
    expect(batches[2]?.commands[0]?.kind).toBe("repository.patch-item");
    expect(batches[3]).toMatchObject({ risk: "high", reviewAuthority: { requiredRole: "gm" }, targetAuthority: { requiredActiveGm: true } });
  });

  it("preserves Foundry dependency order in generic command dependencies", async () => {
    const root = await foundryPlan();
    const dependent = await createFoundryIrPlan({
      planId: "dbx:plan:proposal-dependencies",
      target: root.target,
      runtimeProfile: profile(),
      documents: [
        ...root.documents,
        {
          stableId: "dbx:journal:proposal-adapter",
          documentType: "JournalEntry",
          operation: "create",
          parentStableId: "dbx:scene:proposal-adapter",
          dependencies: ["dbx:scene:proposal-adapter"],
          foundryApi: "JournalEntry.create(data)",
          ownership: { moduleId: "dicebox-campaign-helper", stableId: "dbx:journal:proposal-adapter", mode: "managed" },
          payload: { documentType: "JournalEntry", fields: { name: "Adapter", content: "No write" } },
        },
      ],
    });
    const batch = await createFoundryIrProposalBatch({ plan: dependent, createdAt: observedAt });
    expect(batch.commands[1]?.dependsOn).toEqual([batch.commands[0]?.commandId]);
  });

  it("rejects unsupported, blocked, incomplete, and tampered producer inputs", async () => {
    await expect(createHumanSceneProposalBatch({
      batchId: "dbx:proposal:bad-human",
      document: fixtureScene,
      documentSha256: hashA,
      command: { ...humanCommand, origin: { ...humanCommand.origin, kind: "ai-fixture" } },
      createdAt: observedAt,
    })).rejects.toThrow("only human-origin");

    const blocked = reviewCampaignDirectorFunctionCall(fixtureScene, {
      id: "blocked-call",
      type: "function_call",
      name: "execute_foundry",
      arguments: "{}",
    });
    await expect(createCampaignDirectorProposalBatch({ batchId: "dbx:proposal:blocked-director", receipt: blocked, documentSha256: hashA, provider: "offline", createdAt: observedAt })).rejects.toThrow("Blocked Campaign Director");

    await expect(createTechnicalBuilderProposalBatch({
      batchId: "dbx:proposal:blocked-technical",
      receipt: technicalReceipt({ status: "BLOCKED", readback: null }),
      repositoryId: "dbx:repository:campaign-helper",
      repositoryRevision: 12,
      createdAt: observedAt,
    })).rejects.toThrow("complete PASS");

    const plan = await foundryPlan();
    await expect(createFoundryIrProposalBatch({ plan: { ...plan, planSha256: "f".repeat(64) }, createdAt: observedAt })).rejects.toThrow("Tampered Foundry IR");
  });

  it("keeps normalization no-write", async () => {
    const before = JSON.stringify(fixtureScene);
    await createHumanSceneProposalBatch({ batchId: "dbx:proposal:no-write", document: fixtureScene, documentSha256: hashA, command: humanCommand, createdAt: observedAt });
    expect(JSON.stringify(fixtureScene)).toBe(before);
  });
});
