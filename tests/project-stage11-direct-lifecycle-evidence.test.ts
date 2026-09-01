import { describe, expect, it } from "vitest";
import { createProjectStage11DirectLifecycleEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-direct-lifecycle-evidence";

const m466 = () => ({ milestone: "M466", status: "PASS_LOCAL_BOUNDED_RECOVERY", trace: "fixture→preview→proposal→approval→apply→authoritative reread→pass", primaryRestored: true, backupUnchanged: true, foundryWrite: false, evidenceLabel: "local", doesNotProve: ["generic Stage 11 acceptance", "Foundry authority", "Ready-to-Play"] });
const m645 = () => ({ milestone: "M645", status: "PASS LOCAL BOUNDED OBSERVATION", stage: "proposal-approval-history", scope: "One exact M644 exit=0 packaged desktop launch, one accessibility read, explicit exact-process stop, and one exact target/process reread. preview→approval→save→reread→inverse-restore", accessibilityObservation: { projectId: "dbx:project:desktop-multiscene-self-test", foundryWrite: false }, authoritativeReread: { primarySha256: "primary", backupSha256: "backup", remainingExactTargetPids: [] }, preservation: { foundryAction: false, playerPasswordAction: false }, limits: "This is producer-scoped local packaged evidence only. It does not accept aggregate Stage 11, begin Stage 12, or certify Ready-to-Play." });

describe("M797 Stage 11 direct local lifecycle evidence", () => {
  it("classifies only the two direct local observations without promotion", () => {
    expect(createProjectStage11DirectLifecycleEvidence(m466(), m645())).toMatchObject({ status: "PASS", disposition: "two-producer-scoped-local-observations", observedLifecycleCount: 2, producerScopedOnly: true, noAuthorityGrant: true, noCoverageClaim: true, noFoundryAuthority: true, noExecutionAuthority: true, noRecoveryAuthority: true, noFoundryWrite: true, stage11AcceptanceStatus: "blocked", stage12Started: false });
  });

  it("fails closed for a receipt write claim, missing reread, or promotion-shaped drift", () => {
    expect(() => createProjectStage11DirectLifecycleEvidence({ ...m466(), foundryWrite: true }, m645())).toThrow(/foundryWrite/);
    expect(() => createProjectStage11DirectLifecycleEvidence(m466(), { ...m645(), authoritativeReread: { primarySha256: "primary", backupSha256: "backup", remainingExactTargetPids: [12] } })).toThrow(/authoritative reread/);
    expect(() => createProjectStage11DirectLifecycleEvidence({ ...m466(), doesNotProve: ["Foundry authority"] }, m645())).toThrow(/non-certification/);
  });
});
