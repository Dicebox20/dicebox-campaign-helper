import { describe, expect, it } from "vitest";
import {
  createAscendancySignalRuneNativeOperationAllowlist,
  createAscendancySignalRuneRereadPromotionGate,
  createAscendancySignalRuneRereadRequirements,
  issueAscendancySignalRuneApprovalEnvelope,
} from "@dicebox/compiler";

const runtime = {
  foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true,
  sceneBindings: { signal: "AneddhKAAfk5HlsA", rune: "p9Mbi0CJWe9KvJhH" },
} as const;

function requirements() {
  const approvalEnvelope = issueAscendancySignalRuneApprovalEnvelope({ runtime, issuedAt: 1000, nonce: "abcdefghijklmnop" });
  const allowlist = createAscendancySignalRuneNativeOperationAllowlist({ runtime, approvalEnvelope, now: 1001 });
  return createAscendancySignalRuneRereadRequirements({ allowlist });
}

describe("M1123 Signal/Rune reread-promotion compatibility gate", () => {
  it("blocks all eighteen unresolved requirements with explicit promotion reasons", () => {
    const result = createAscendancySignalRuneRereadPromotionGate({ requirements: requirements() });
    expect(result).toMatchObject({ status: "BLOCKED", requirements: 18, noWrite: true, apply: false, payload: "not-materialized", dispatch: "disabled", foreignState: "preserve", retryAfterUnknown: false, runtimeState: "not-modeled" });
    expect(result.blockers).toEqual([
      "runtime-child-bindings-unresolved", "native-payload-not-materialized", "foundry-ir-promotion-blocked",
      "proposal-batch-promotion-blocked", "bridge-resolution-unavailable", "terminal-history-requires-staged-executor-evidence",
    ]);
    expect(result.entries).toHaveLength(18);
    expect(result.entries.every((entry) => entry.binding.startsWith("blocked-") && entry.foundryIr.startsWith("blocked-") && entry.proposalBatch.startsWith("blocked-"))).toBe(true);
  });

  it("fails closed for malformed or execution-shaped reread requirements", () => {
    const fixed = requirements();
    expect(() => createAscendancySignalRuneRereadPromotionGate({ requirements: { ...fixed, requirements: fixed.requirements.slice(1) } as never })).toThrow();
    expect(() => createAscendancySignalRuneRereadPromotionGate({ requirements: { ...fixed, dispatch: "enabled" } as never })).toThrow();
    expect(() => createAscendancySignalRuneRereadPromotionGate({ requirements: { ...fixed, requirements: fixed.requirements.map((entry) => ({ ...entry, childBinding: "foundry-child" })) } as never })).toThrow();
  });
});
