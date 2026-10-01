import { describe, expect, it } from "vitest";
import {
  createReleaseBundle,
  createSyncConflictPlan,
  previewSyncConflictPlan,
  validateSyncConflictPlan,
  type ReleaseBundleInput,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T12:00:00.000Z";
const desiredFingerprint = "b".repeat(64);
const observedFingerprint = "c".repeat(64);

function input(): ReleaseBundleInput {
  return {
    releaseId: createStableDiceBoxId("release", "sync-fixture"),
    releaseVersion: "0.1.0",
    campaign: { id: createStableDiceBoxId("campaign", "sync"), kind: "campaign" },
    components: [
      {
        componentId: createStableDiceBoxId("component", "journal"),
        planId: createStableDiceBoxId("plan", "journal"),
        semantic: { id: createStableDiceBoxId("journal", "intro"), kind: "journal" },
        kind: "journal",
      },
      {
        componentId: createStableDiceBoxId("component", "spatial"),
        planId: createStableDiceBoxId("plan", "spatial"),
        semantic: { id: createStableDiceBoxId("scene", "room"), kind: "scene" },
        kind: "spatial",
      },
    ],
  };
}

function runtimeProfile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry", "Scene"],
    capabilities: ([
      "foundry.document.read",
      "foundry.document.write",
      "foundry.scene.read",
      "foundry.scene.write",
      "foundry.region.read",
      "foundry.region.write",
      "foundry.users.active-gm",
    ] as const).map((id) => ({ id, state: "available" as const, reason: "exact fixture" })),
    ...overrides,
  };
}

function fields() {
  return [
    {
      fieldId: createStableDiceBoxId("field", "journal-title"),
      componentId: createStableDiceBoxId("component", "journal"),
      owner: "dicebox" as const,
      repairPolicy: "managed-only" as const,
    },
    {
      fieldId: createStableDiceBoxId("field", "scene-position"),
      componentId: createStableDiceBoxId("component", "spatial"),
      owner: "dicebox" as const,
      repairPolicy: "observe-only" as const,
    },
    {
      fieldId: createStableDiceBoxId("field", "scene-foreign"),
      componentId: createStableDiceBoxId("component", "spatial"),
      owner: "dicebox" as const,
      repairPolicy: "managed-only" as const,
    },
  ];
}

describe("M10 deterministic sync conflict planner", () => {
  it("classifies equal, managed drift, foreign, and omitted fields without raw patches", () => {
    const bundle = createReleaseBundle(input());
    const plan = createSyncConflictPlan({
      bundle,
      fields: fields(),
      observations: [
        {
          fieldId: createStableDiceBoxId("field", "journal-title"),
          state: "equal",
          desiredFingerprint,
          observedFingerprint: desiredFingerprint,
        },
        {
          fieldId: createStableDiceBoxId("field", "scene-position"),
          state: "managed-drift",
          desiredFingerprint,
          observedFingerprint,
        },
        {
          fieldId: createStableDiceBoxId("field", "scene-foreign"),
          state: "foreign",
        },
      ],
    });

    expect(plan.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({ fieldId: "dbx:field:journal-title", action: "no-op", foundryApi: null }),
      expect.objectContaining({ fieldId: "dbx:field:scene-position", action: "preserve-managed-drift", foundryApi: null }),
      expect.objectContaining({ fieldId: "dbx:field:scene-foreign", action: "preserve-foreign", foundryApi: null }),
    ]));
    expect(JSON.stringify(plan)).not.toContain("desiredFingerprint");
    expect(plan.rawPayload).toBe("absent");
  });

  it("emits a native update-bound repair candidate only for managed-only drift", () => {
    const bundle = createReleaseBundle(input());
    const managedOnly = [fields()[0]];
    const plan = createSyncConflictPlan({
      bundle,
      fields: managedOnly,
      observations: [{
        fieldId: managedOnly[0]?.fieldId,
        state: "managed-drift",
        desiredFingerprint,
        observedFingerprint,
      }],
    });

    expect(plan.entries[0]).toMatchObject({
      action: "repair-candidate",
      foundryApi: "JournalEntry.update",
    });
    const preview = previewSyncConflictPlan(plan, bundle, runtimeProfile(), { authority: "gm", observedAt });
    expect(preview.review.status).toBe("blocked");
    expect(preview.review.findings.map((finding) => finding.code)).toContain("REPAIR_CANDIDATE_DISABLED");
    expect(preview.receipt.operation).toBe("sync-conflict.preview");
  });

  it("preserves omitted state and rejects invalid fingerprints, identity drift, and tampering", () => {
    const bundle = createReleaseBundle(input());
    const journalField = fields()[0];
    expect(journalField).toBeDefined();
    if (!journalField) throw new Error("fixture field missing");

    const omitted = createSyncConflictPlan({ bundle, fields: [journalField], observations: [] });
    expect(omitted.entries[0]).toMatchObject({ action: "preserve-unknown", foundryApi: null });

    expect(() => createSyncConflictPlan({
      bundle,
      fields: [journalField],
      observations: [{ fieldId: journalField.fieldId, state: "equal", desiredFingerprint, observedFingerprint }],
    })).toThrow(/matching fingerprints/);
    expect(() => createSyncConflictPlan({
      bundle,
      fields: [journalField],
      observations: [{ fieldId: journalField.fieldId, state: "managed-drift", desiredFingerprint: "bad", observedFingerprint }],
    })).toThrow();

    const tampered = { ...omitted, rawPayload: "present" as const };
    expect(() => validateSyncConflictPlan(tampered, bundle)).toThrow();
  });

  it("blocks unresolved fields and mismatched runtime profiles", () => {
    const bundle = createReleaseBundle(input());
    const plan = createSyncConflictPlan({ bundle, fields: fields(), observations: [] });
    const preview = previewSyncConflictPlan(plan, bundle, runtimeProfile({
      phase: "m0",
      foundryVersion: null,
      systemId: null,
      systemVersion: null,
      observedAt: null,
      capabilities: [],
    }), { authority: "none", observedAt });

    expect(preview.review.status).toBe("blocked");
    expect(preview.review.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining([
      "RUNTIME_NOT_READY",
      "FOUNDRY_VERSION_MISMATCH",
      "SYSTEM_VERSION_MISMATCH",
      "UNRESOLVED_FIELD_STATE",
    ]));
  });
});
