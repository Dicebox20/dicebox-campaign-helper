import { describe, expect, it } from "vitest";
import {
  createAscendancySignalRuneNativeOperationAllowlist,
  issueAscendancySignalRuneApprovalEnvelope,
} from "@dicebox/compiler";

const runtime = {
  foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true,
  sceneBindings: { signal: "AneddhKAAfk5HlsA", rune: "p9Mbi0CJWe9KvJhH" },
} as const;

describe("M1119 fixed Signal/Rune native-operation allowlist", () => {
  it("declares only the eighteen fixed intent/API categories", () => {
    const approvalEnvelope = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
    const result = createAscendancySignalRuneNativeOperationAllowlist({ runtime, approvalEnvelope, now: 1001 });
    expect(result).toMatchObject({
      planId: "dbx:plan:m1115-signal-rune-native-document-preview", previewToken: approvalEnvelope.previewToken,
      approvalRequired: true, noWrite: true, apply: false, dispatch: "disabled", payload: "not-materialized",
      excluded: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"], runtimeState: "not-modeled",
    });
    expect(result.operations).toHaveLength(18);
    expect(result.operations.filter((entry) => entry.kind === "wall").map((entry) => entry.foundryApi)).toEqual([
      'scene.createEmbeddedDocuments("Wall", adapter-owned-schema)',
      'scene.createEmbeddedDocuments("Wall", adapter-owned-schema)',
    ]);
    expect(result.operations.filter((entry) => entry.kind === "scene-renderer").map((entry) => entry.foundryApi)).toEqual([
      "scene.initialLevel.update(background.src)", "scene.initialLevel.update(background.src)",
    ]);
    expect(result.operations.every((entry) => entry.payload === "not-materialized" && entry.dispatch === "disabled" && entry.retryAfterUnknown === false)).toBe(true);
  });

  it("fails closed for expired approval, envelope drift, or runtime drift", () => {
    const approvalEnvelope = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
    expect(() => createAscendancySignalRuneNativeOperationAllowlist({ runtime, approvalEnvelope, now: approvalEnvelope.expiresAtEpochMs })).toThrow(/expired/);
    expect(() => createAscendancySignalRuneNativeOperationAllowlist({ runtime, approvalEnvelope: { ...approvalEnvelope, planId: "dbx:plan:other" } as never, now: 1001 })).toThrow();
    expect(() => createAscendancySignalRuneNativeOperationAllowlist({ runtime: { ...runtime, activeGm: false } as never, approvalEnvelope, now: 1001 })).toThrow();
  });
});
