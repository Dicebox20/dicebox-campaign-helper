import { describe, expect, it } from "vitest";
import {
  createFoundryIrPlan,
  serializeFoundryIrPlan,
  validateFoundryIrPlan,
  verifyFoundryIrPlanHash,
  type FoundryIrDocumentInput,
} from "@dicebox/compiler";
import type { RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-27T01:00:00.000Z";

function runtimeProfile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["Scene", "Level", "Wall", "Region", "Tile", "JournalEntry"],
    capabilities: [
      { id: "foundry.document.read", state: "available", reason: "fixture" },
      { id: "foundry.document.write", state: "available", reason: "fixture" },
    ],
    ...overrides,
  };
}

function documentInput(input: Partial<FoundryIrDocumentInput> & Pick<FoundryIrDocumentInput, "stableId" | "documentType" | "payload">): FoundryIrDocumentInput {
  return {
    operation: "create",
    parentStableId: null,
    dependencies: [],
    foundryApi: `${input.documentType}.create(data)`,
    ownership: { moduleId: "dicebox-campaign-helper", stableId: input.stableId, mode: "managed" },
    ...input,
  };
}

const sceneId = "dbx:scene:ir-root";

const documents: FoundryIrDocumentInput[] = [
  documentInput({
    stableId: "dbx:journal:briefing",
    documentType: "JournalEntry",
    dependencies: [sceneId],
    parentStableId: sceneId,
    payload: { documentType: "JournalEntry", fields: { name: "Briefing", content: "Fixture briefing" } },
  }),
  documentInput({
    stableId: "dbx:tile:background",
    documentType: "Tile",
    dependencies: ["dbx:level:initial"],
    parentStableId: "dbx:level:initial",
    payload: { documentType: "Tile", fields: { x: 0, y: 0, width: 1250, height: 1250, textureSrc: "assets/sha256/map.webp" } },
  }),
  documentInput({
    stableId: "dbx:wall:door",
    documentType: "Wall",
    dependencies: [sceneId],
    parentStableId: sceneId,
    payload: { documentType: "Wall", fields: { coordinates: [100, 200, 150, 200], door: 1 } },
  }),
  documentInput({
    stableId: "dbx:scene:ir-root",
    documentType: "Scene",
    payload: { documentType: "Scene", fields: { name: "IR Fixture", width: 1250, height: 1250, gridSize: 50 } },
  }),
  documentInput({
    stableId: "dbx:region:overlay",
    documentType: "Region",
    dependencies: [sceneId],
    parentStableId: sceneId,
    payload: { documentType: "Region", fields: { name: "Overlay", polygonPoints: [0, 0, 100, 0, 100, 100, 0, 100], hole: false } },
  }),
  documentInput({
    stableId: "dbx:level:initial",
    documentType: "Level",
    dependencies: [sceneId],
    parentStableId: sceneId,
    payload: { documentType: "Level", fields: { backgroundSrc: "assets/sha256/map.webp" } },
  }),
];

async function createPlan(inputDocuments: readonly FoundryIrDocumentInput[] = documents, profile: RuntimeProfile = runtimeProfile()) {
  return createFoundryIrPlan({
    planId: "dbx:plan:typed-foundry-ir",
    target: {
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
      adapterId: "foundry-document-plan",
      adapterVersion: "0.1.0",
    },
    runtimeProfile: profile,
    documents: inputDocuments,
  });
}

describe("typed runtime-neutral Foundry IR", () => {
  it("covers the existing candidate families with managed identity and canonical dependency order", async () => {
    const plan = await createPlan();

    expect(plan.documents.map((document) => document.stableId)).toEqual([
      sceneId,
      "dbx:journal:briefing",
      "dbx:level:initial",
      "dbx:region:overlay",
      "dbx:tile:background",
      "dbx:wall:door",
    ]);
    expect(plan.documents.every((document) => document.ownership.moduleId === "dicebox-campaign-helper")).toBe(true);
    expect(plan.documents.every((document) => document.ownership.stableId === document.stableId)).toBe(true);
    expect(plan.documents.every((document) => document.payload.documentType === document.documentType)).toBe(true);
    expect(plan.target).toMatchObject({
      packageId: "dicebox-campaign-helper",
      foundryVersion: "14.367",
      systemId: "dnd5e",
      systemVersion: "5.3.3",
    });
    expect(plan.target.profileFingerprintId).toBe(plan.runtimeFingerprint.fingerprintId);
    expect(plan.planSha256).toMatch(/^[0-9a-f]{64}$/);
    await expect(verifyFoundryIrPlanHash(plan)).resolves.toBe(true);
  });

  it("is stable across input document order and profile array order", async () => {
    const first = await createPlan(documents, runtimeProfile());
    const second = await createPlan([...documents].reverse(), runtimeProfile({
      activeModuleIds: ["dicebox-campaign-helper"],
      documentTypes: ["JournalEntry", "Tile", "Region", "Wall", "Level", "Scene"],
      capabilities: [...runtimeProfile().capabilities].reverse(),
    }));

    expect(serializeFoundryIrPlan(first)).toBe(serializeFoundryIrPlan(second));
    expect(second.planSha256).toBe(first.planSha256);
  });

  it("rejects duplicate, missing, cyclic, and parent-mismatched dependencies", async () => {
    const duplicate = [...documents, documents[0]!];
    await expect(createPlan(duplicate)).rejects.toThrow(/duplicate document ID/);

    const missing = documents.map((document) => document.stableId === "dbx:wall:door"
      ? { ...document, dependencies: ["dbx:scene:missing"] }
      : document);
    await expect(createPlan(missing)).rejects.toThrow(/missing document/);

    const parentMismatch = documents.map((document) => document.stableId === "dbx:wall:door"
      ? { ...document, parentStableId: "dbx:scene:missing" }
      : document);
    await expect(createPlan(parentMismatch)).rejects.toThrow(/must depend on its parent/);

    const cyclic = documents.map((document) => document.stableId === sceneId
      ? { ...document, dependencies: ["dbx:level:initial"] }
      : document);
    await expect(createPlan(cyclic)).rejects.toThrow(/cycle/);
  });

  it("rejects foreign ownership, payload drift, unsupported fields, and target/profile mismatch", async () => {
    await expect(createPlan(documents.map((document) => document.stableId === "dbx:wall:door"
      ? { ...document, ownership: { ...document.ownership, stableId: "dbx:wall:foreign" } }
      : document))).rejects.toThrow(/mismatched managed ownership/);

    await expect(createPlan(documents.map((document) => document.stableId === "dbx:wall:door"
      ? { ...document, payload: { documentType: "Tile", fields: { x: 0, y: 0, width: 1, height: 1, textureSrc: null } } }
      : document))).rejects.toThrow();

    await expect(createPlan(documents.map((document) => document.stableId === "dbx:wall:door"
      ? { ...document, payload: { documentType: "Wall", fields: { coordinates: [100, 200, 150, 200], door: 1, arbitrary: "foreign" } } }
      : document))).rejects.toThrow();

    await expect(createPlan(documents, runtimeProfile({ foundryVersion: "14.365" }))).rejects.toThrow(/target identity/);
  });

  it("detects tampered hashes and non-canonical order", async () => {
    const plan = await createPlan();
    const tampered = { ...plan, planSha256: "0".repeat(64) };
    await expect(verifyFoundryIrPlanHash(tampered)).resolves.toBe(false);

    const reordered = { ...plan, dependencyOrder: [...plan.dependencyOrder].reverse() };
    expect(() => validateFoundryIrPlan(reordered)).toThrow(/canonical topological order/);
  });
});
