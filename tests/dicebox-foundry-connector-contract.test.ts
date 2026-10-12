import { describe, expect, it } from "vitest";
import { resolve } from "node:path";

// @ts-expect-error The connector contract is intentionally a plain Node ESM utility.
import { RECIPE_REGISTRY, createConnectorAttestation, createConnectorProfile } from "../tools/dicebox-foundry-connector-contract.mjs";
// @ts-expect-error The remote gateway is intentionally a plain Node ESM utility.
import { createOperationInvoker } from "../tools/dicebox-foundry-remote-gateway.mjs";

const moduleRoot = resolve(process.cwd(), "packages/dicebox-foundry");

describe("DiceBox Foundry connector hardening contract", () => {
  it("creates a stable source manifest/entry identity without claiming loaded bytes", () => {
    const profile = createConnectorProfile({ moduleRoot, expectedWorldId: "dbx-test-world" });
    expect(profile.connectorProtocol).toBe("dicebox-foundry-connector/1");
    expect(profile.target).toMatchObject({ worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3" });
    expect(profile.module.manifest.sha256).toMatch(/^[A-F0-9]{64}$/);
    expect(profile.module.entry.sha256).toMatch(/^[A-F0-9]{64}$/);
    expect(profile.module.loadedByteHashClaimed).toBe(false);
    expect(profile.identityHash).toMatch(/^[A-F0-9]{64}$/);
  });

  it("keeps the recipe registry reviewed and forces write recipes through preview approval", () => {
    expect(RECIPE_REGISTRY.map((recipe: { operation: string }) => recipe.operation)).toContain("connector.profile");
    expect(RECIPE_REGISTRY.map((recipe: { operation: string }) => recipe.operation)).toContain("connector.attestation");
    expect(RECIPE_REGISTRY.some((recipe: { operation: string }) => /eval|script|shell|document|socket/i.test(recipe.operation))).toBe(false);
    expect(RECIPE_REGISTRY.filter((recipe: { readWrite: string }) => recipe.readWrite === "write").every((recipe: { requiresPreviewApproval: boolean; annotations: { destructiveHint: boolean } }) => recipe.requiresPreviewApproval && recipe.annotations.destructiveHint)).toBe(true);
  });

  it("joins a fixed runtime profile to the connector attestation", async () => {
    const runtime = {
      schemaVersion: "0.1.0",
      operation: "connector.profile",
      status: "OBSERVED",
      noWrite: true,
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", exactTargetMatch: true },
      activeGm: { status: "observed", currentUserMatchesActiveGm: true, noPermissionClaim: true, noExecutionAuthority: true },
      profile: { phase: "runtime-probe", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", observedAt: "2026-10-07T00:00:00.000Z", activeModuleIds: ["dicebox-campaign-helper"], documentTypes: [], capabilities: [] },
    };
    const invoker = createOperationInvoker({ getConnection: () => ({ request: async () => runtime }), profileOptions: { moduleRoot, expectedWorldId: "dbx-test-world" } });
    const snapshot = await invoker("connector.profile", {});
    const attestation = await invoker("connector.attestation", {});
    expect(snapshot.runtime).toEqual(runtime);
    expect(attestation).toMatchObject({ status: "PASS_SOURCE_AND_RUNTIME_PROFILE", targetMatch: true, noWrite: true, readyClaim: false });
    expect(createConnectorAttestation({ profile: snapshot, runtimeObservation: runtime }).status).toBe("PASS_SOURCE_AND_RUNTIME_PROFILE");
  });
});
