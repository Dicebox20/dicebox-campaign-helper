import { describe, expect, it } from "vitest";
import {
  createReleaseBundle,
  createReleaseDiffPlan,
  previewReleaseDiff,
  validateReleaseDiffPlan,
  type ReleaseBundleInput,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T11:30:00.000Z";
const bindingFingerprint = "a".repeat(64);

function input(): ReleaseBundleInput {
  return {
    releaseId: createStableDiceBoxId("release", "diff-fixture"),
    releaseVersion: "0.1.0",
    campaign: { id: createStableDiceBoxId("campaign", "diff"), kind: "campaign" },
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
      {
        componentId: createStableDiceBoxId("component", "activity"),
        planId: createStableDiceBoxId("plan", "activity"),
        semantic: { id: createStableDiceBoxId("item", "strike"), kind: "item" },
        kind: "activity",
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
    documentTypes: ["JournalEntry", "Scene", "Item"],
    capabilities: ([
      "foundry.document.read",
      "foundry.document.write",
      "foundry.scene.read",
      "foundry.scene.write",
      "foundry.region.read",
      "foundry.region.write",
      "foundry.users.active-gm",
      "dnd5e.activities",
      "dnd5e.activity-hooks",
    ] as const).map((id) => ({ id, state: "available" as const, reason: "exact fixture" })),
    ...overrides,
  };
}

describe("M9 release diff and sovereignty planner", () => {
  it("classifies explicit missing/managed states and preserves runtime-only foreign state", () => {
    const bundle = createReleaseBundle(input());
    const plan = createReleaseDiffPlan({
      bundle,
      observations: [
        {
          componentId: createStableDiceBoxId("component", "journal"),
          semantic: { id: createStableDiceBoxId("journal", "intro"), kind: "journal" },
          state: "missing",
        },
        {
          componentId: createStableDiceBoxId("component", "spatial"),
          semantic: { id: createStableDiceBoxId("scene", "room"), kind: "scene" },
          state: "managed",
          bindingGeneration: 3,
          bindingFingerprint,
        },
        {
          componentId: createStableDiceBoxId("component", "old-foreign"),
          semantic: { id: createStableDiceBoxId("scene", "old-room"), kind: "scene" },
          state: "foreign",
        },
      ],
    });

    expect(plan.entries).toEqual(expect.arrayContaining([
      expect.objectContaining({
        componentId: "dbx:component:journal",
        observedState: "missing",
        action: "create-candidate",
        foundryApi: "JournalEntry.create",
      }),
      expect.objectContaining({
        componentId: "dbx:component:spatial",
        observedState: "managed",
        action: "reread-managed",
        foundryApi: "fromUuid | game.scenes.get",
        bindingGeneration: 3,
      }),
      expect.objectContaining({
        componentId: "dbx:component:activity",
        observedState: "unknown",
        action: "preserve-unknown",
        foundryApi: null,
      }),
    ]));
    expect(plan.runtimeOnly).toEqual([expect.objectContaining({
      componentId: "dbx:component:old-foreign",
      action: "preserve-runtime-only",
      observedState: "foreign",
    })]);
    expect(plan.cleanup).toBe("disabled");
    expect(JSON.stringify(plan)).not.toContain("delete");
  });

  it("never infers absence from an omitted observation", () => {
    const bundle = createReleaseBundle(input());
    const plan = createReleaseDiffPlan({ bundle, observations: [] });

    expect(plan.entries.every((entry) => entry.action === "preserve-unknown")).toBe(true);
    expect(plan.entries.every((entry) => entry.foundryApi === null)).toBe(true);
  });

  it("keeps a diff preview blocked at the native apply boundary", () => {
    const bundle = createReleaseBundle(input());
    const plan = createReleaseDiffPlan({
      bundle,
      observations: [{
        componentId: createStableDiceBoxId("component", "journal"),
        semantic: { id: createStableDiceBoxId("journal", "intro"), kind: "journal" },
        state: "missing",
      }],
    });
    const preview = previewReleaseDiff(plan, bundle, runtimeProfile(), { authority: "gm", observedAt });

    expect(preview.review).toMatchObject({ status: "blocked", exactTargetMatch: true, noWrite: true });
    expect(preview.review.findings.map((finding) => finding.code)).toContain("CREATE_CANDIDATE_DISABLED");
    expect(preview.receipt).toMatchObject({ operation: "release-diff.preview", evidenceClass: "deterministic" });
  });

  it("rejects incomplete managed evidence, identity drift, duplicate observations, and tampering", () => {
    const bundle = createReleaseBundle(input());
    const journalId = createStableDiceBoxId("component", "journal");
    const journalSemantic = { id: createStableDiceBoxId("journal", "intro"), kind: "journal" as const };
    expect(() => createReleaseDiffPlan({
      bundle,
      observations: [{ componentId: journalId, semantic: journalSemantic, state: "managed" }],
    })).toThrow(/managed runtime observation/);
    expect(() => createReleaseDiffPlan({
      bundle,
      observations: [
        { componentId: journalId, semantic: { id: createStableDiceBoxId("item", "wrong"), kind: "item" }, state: "missing" },
      ],
    })).toThrow(/does not match/);
    expect(() => createReleaseDiffPlan({
      bundle,
      observations: [
        { componentId: journalId, semantic: journalSemantic, state: "missing" },
        { componentId: journalId, semantic: journalSemantic, state: "missing" },
      ],
    })).toThrow(/Duplicate runtime observation/);

    const plan = createReleaseDiffPlan({ bundle, observations: [] });
    const tampered = {
      ...plan,
      cleanup: "enabled" as const,
    };
    expect(() => validateReleaseDiffPlan(tampered, bundle)).toThrow();
  });
});
