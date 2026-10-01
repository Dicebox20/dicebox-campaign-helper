import {
  stagedInversePermitClaimPersistenceResolutionSchema,
  type StagedInversePermitClaimState,
} from "@dicebox/compiler";

export function matchedStagedInversePermitClaimResolution(
  state: StagedInversePermitClaimState,
  observedAt: string,
) {
  const claimed = { ...state, state: "claimed" as const, observedAt, authoritativeReread: true as const };
  return stagedInversePermitClaimPersistenceResolutionSchema.parse({
    schemaVersion: "0.1.0",
    status: "matched",
    writeOutcome: "committed",
    candidate: claimed,
    reread: claimed,
    observedAt,
    authoritativeReread: true,
    retryAfter: "never",
    foreignStatePreserved: true,
    execution: "not-implemented",
    readyClaim: false,
  });
}
