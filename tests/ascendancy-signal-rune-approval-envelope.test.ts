import { describe, expect, it } from "vitest";
import { issueAscendancySignalRuneApprovalEnvelope, validateAscendancySignalRuneApprovalEnvelope } from "@dicebox/compiler";
const runtime = { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true, sceneBindings: { signal: "AneddhKAAfk5HlsA", rune: "p9Mbi0CJWe9KvJhH" } } as const;
describe("M1117 fixed Signal/Rune approval envelope", () => {
  it("binds a unique expiring token to only the M1115 plan", () => {
    const first = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
    const second = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnopq" });
    expect(first).toMatchObject({ planId: "dbx:plan:m1115-signal-rune-native-document-preview", approvalRequired: true, authoritativeRereadRequired: true, foreignStatePreservationRequired: true, retryAfterUnknown: false, noWrite: true, apply: false });
    expect(first.previewToken).not.toBe(second.previewToken);
    expect(validateAscendancySignalRuneApprovalEnvelope(first, 1001)).toEqual(first);
    expect(first.apply).toBe(false);
  });
  it("fails closed for expired, malformed, or runtime-drift requests", () => {
    const envelope = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
    expect(() => validateAscendancySignalRuneApprovalEnvelope(envelope, envelope.expiresAtEpochMs)).toThrow(/expired/);
    expect(() => issueAscendancySignalRuneApprovalEnvelope({ runtime: { ...runtime, activeGm: false }, issuedAt: 1, nonce: "abcdefghijklmnop" } as never)).toThrow();
    expect(() => issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1, nonce: "bad" })).toThrow();
  });
});
