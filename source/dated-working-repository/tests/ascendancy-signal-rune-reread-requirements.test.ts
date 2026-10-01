import { describe, expect, it } from "vitest";
import {
  createAscendancySignalRuneNativeOperationAllowlist,
  createAscendancySignalRuneRereadRequirements,
  issueAscendancySignalRuneApprovalEnvelope,
} from "@dicebox/compiler";

const runtime = {
  foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true,
  sceneBindings: { signal: "AneddhKAAfk5HlsA", rune: "p9Mbi0CJWe9KvJhH" },
} as const;

function allowlist() {
  const approvalEnvelope = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
  return createAscendancySignalRuneNativeOperationAllowlist({ runtime, approvalEnvelope, now: 1001 });
}

describe("M1121 fixed Signal/Rune authoritative reread requirements", () => {
  it("keeps all child bindings unresolved while declaring every readback category", () => {
    const result = createAscendancySignalRuneRereadRequirements({ allowlist: allowlist() });
    expect(result).toMatchObject({
      planId: "dbx:plan:m1115-signal-rune-native-document-preview", noWrite: true, apply: false, dispatch: "disabled",
      unresolvedRuntimeChildBindings: true, runtimeState: "not-modeled",
    });
    expect(result.requirements).toHaveLength(18);
    expect(result.requirements.every((entry) => entry.childBinding === "unresolved-until-exact-authoritative-reread" && entry.payload === "not-materialized")).toBe(true);
    expect(result.requirements.filter((entry) => entry.kind === "scene-renderer").map((entry) => entry.documentType)).toEqual(["Level", "Level"]);
    expect(result.requirements.filter((entry) => entry.kind === "wall").map((entry) => entry.readerCategory)).toEqual(["scene.embedded-wall-reread-required", "scene.embedded-wall-reread-required"]);
    expect(result.requirements.filter((entry) => entry.kind === "tile").map((entry) => entry.readerCategory)).toEqual(["foundry.scene-placeable.read@14.367", "foundry.scene-placeable.read@14.367"]);
  });

  it("fails closed for malformed or execution-shaped allowlist drift", () => {
    const fixed = allowlist();
    expect(() => createAscendancySignalRuneRereadRequirements({ allowlist: { ...fixed, operations: fixed.operations.slice(1) } as never })).toThrow();
    expect(() => createAscendancySignalRuneRereadRequirements({ allowlist: { ...fixed, dispatch: "enabled" } as never })).toThrow();
    expect(() => createAscendancySignalRuneRereadRequirements({ allowlist: { ...fixed, operations: fixed.operations.map((entry) => ({ ...entry, payload: "data" })) } as never })).toThrow();
  });
});
