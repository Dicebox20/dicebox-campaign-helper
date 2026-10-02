import { describe, expect, it } from "vitest";
import {
  createReleaseBundle,
  previewReleaseBundle,
  validateReleaseBundle,
  type ReleaseBundleInput,
} from "@dicebox/compiler";
import { createStableDiceBoxId, type RuntimeProfile } from "@dicebox/core";

const observedAt = "2026-08-21T10:30:00.000Z";

function runtimeProfile(overrides: Partial<RuntimeProfile> = {}): RuntimeProfile {
  return {
    phase: "ready",
    foundryVersion: "14.367",
    systemId: "dnd5e",
    systemVersion: "5.3.3",
    observedAt,
    activeModuleIds: ["dicebox-campaign-helper"],
    documentTypes: ["JournalEntry", "Scene", "Region", "Item", "Actor"],
    capabilities: ([
      "foundry.document.read",
      "foundry.document.write",
      "foundry.scene.read",
      "foundry.scene.write",
      "foundry.region.read",
      "foundry.region.write",
      "foundry.scene.placeable.read",
      "foundry.scene.placeable.write",
      "foundry.media.deploy",
      "foundry.users.active-gm",
      "dnd5e.activities",
      "dnd5e.activity-hooks",
    ] as const).map((id) => ({ id, state: "available" as const, reason: "exact fixture" })),
    ...overrides,
  };
}

function input(): ReleaseBundleInput {
  return {
    releaseId: createStableDiceBoxId("release", "tower-alpha"),
    releaseVersion: "0.1.0",
    campaign: { id: createStableDiceBoxId("campaign", "demo"), kind: "campaign" as const },
    components: [
      {
        componentId: createStableDiceBoxId("component", "spatial-room"),
        planId: createStableDiceBoxId("plan", "spatial-room"),
        semantic: { id: createStableDiceBoxId("scene", "room"), kind: "scene" as const },
        kind: "spatial" as const,
      },
      {
        componentId: createStableDiceBoxId("component", "journal-intro"),
        planId: createStableDiceBoxId("plan", "journal-intro"),
        semantic: { id: createStableDiceBoxId("journal", "intro"), kind: "journal" as const },
        kind: "journal" as const,
      },
      {
        componentId: createStableDiceBoxId("component", "activity-strike"),
        planId: createStableDiceBoxId("plan", "activity-strike"),
        semantic: { id: createStableDiceBoxId("item", "strike"), kind: "item" as const },
        kind: "activity" as const,
      },
    ],
  };
}

describe("deterministic M9 release/bootstrap manifest", () => {
  it("sorts components and binds each family to official Foundry APIs", () => {
    const bundle = createReleaseBundle(input());

    expect(bundle.components.map((component) => component.componentId)).toEqual([
      "dbx:component:activity-strike",
      "dbx:component:journal-intro",
      "dbx:component:spatial-room",
    ]);
    expect(bundle.bootstrap).toMatchObject({
      lifecycleHook: 'Hooks.once("ready")',
      moduleNamespace: "game.diceboxCampaignHelper",
      mutation: "disabled-until-exact-runtime-gate",
    });
    expect(bundle.components.find((component) => component.kind === "activity")?.foundryApiBindings)
      .toEqual(expect.arrayContaining([
        { role: "read", api: 'item.getEmbeddedDocument("Activity", id)' },
        { role: "update", api: "activity.use(usage, dialog, message)" },
        { role: "lifecycle", api: "dnd5e.preUseActivity | dnd5e.postUseActivity" },
      ]));
    expect(JSON.stringify(bundle)).not.toContain("foundryPayload");
    expect(JSON.stringify(bundle)).not.toContain("new Function");
    expect(bundle.closure).toEqual({
      semantic: "closed",
      runtimeBindings: "deferred",
      unresolved: ["foundry-runtime-bindings", "component-payloads"],
    });
  });

  it("is byte-stable for equivalent component input order", () => {
    const first = createReleaseBundle(input());
    const second = createReleaseBundle({ ...input(), components: [...input().components].reverse() });
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it("keeps the exact-runtime release preview blocked even with all static capabilities", () => {
    const preview = previewReleaseBundle(createReleaseBundle(input()), runtimeProfile(), {
      authority: "gm",
      observedAt,
    });

    expect(preview.review).toMatchObject({
      status: "blocked",
      exactTargetMatch: true,
      noWrite: true,
      checkedAuthority: "gm",
    });
    expect(preview.review.findings.map((finding) => finding.code)).toEqual(expect.arrayContaining([
      "RUNTIME_BINDINGS_DEFERRED",
      "RELEASE_CLOSURE_INCOMPLETE",
    ]));
    expect(preview.receipt).toMatchObject({
      operation: "release-bundle.preview",
      status: "previewed",
      evidenceClass: "deterministic",
      authority: "gm",
    });
    expect(preview.receipt.notes.join(" ")).toContain("no Hooks.once");
  });

  it("blocks the safe-mode profile and records missing authority", () => {
    const preview = previewReleaseBundle(createReleaseBundle(input()), runtimeProfile({
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
      "FOUNDRY_DOCUMENT_READ_UNAVAILABLE",
      "GM_AUTHORITY_REQUIRED",
    ]));
  });

  it("rejects semantic mismatches, duplicate IDs, and tampered API names", () => {
    const mismatch = input();
    const mismatchComponent = mismatch.components[0];
    expect(mismatchComponent).toBeDefined();
    if (!mismatchComponent) throw new Error("fixture component missing");
    expect(() => createReleaseBundle({
      ...input(),
      components: [{ ...mismatchComponent, semantic: { id: createStableDiceBoxId("journal", "wrong"), kind: "journal" as const } }],
    })).toThrow(/requires semantic kind/);

    const duplicate = input();
    const first = duplicate.components[0];
    const second = duplicate.components[1];
    expect(first).toBeDefined();
    expect(second).toBeDefined();
    if (!first || !second) throw new Error("fixture component missing");
    expect(() => createReleaseBundle({
      ...duplicate,
      components: [{ ...first }, { ...second, componentId: first.componentId }, ...duplicate.components.slice(2)],
    })).toThrow(/unique/);

    const bundle = createReleaseBundle(input());
    const tampered = {
      ...bundle,
      components: bundle.components.map((component) => component.kind === "journal"
        ? { ...component, foundryApiBindings: [{ role: "create" as const, api: "eval" }] }
        : component),
    };
    expect(() => validateReleaseBundle(tampered)).toThrow();

    const weakened = {
      ...bundle,
      components: bundle.components.map((component) => component.kind === "journal"
        ? { ...component, requiredCapabilities: [] }
        : component),
    };
    expect(() => validateReleaseBundle(weakened)).toThrow(/capability contract/);
  });
});
