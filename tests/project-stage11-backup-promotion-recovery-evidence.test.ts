import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createProjectStage11BackupPromotionRecoveryEvidence } from "../apps/campaign-helper-desktop/src/project-stage11-backup-promotion-recovery-evidence";

const m466 = () => JSON.parse(readFileSync(new URL("../outputs/m466-stage11-backup-promotion-closure-receipt.json", import.meta.url), "utf8")) as Record<string, any>;

describe("M868 Stage 11 backup-promotion recovery evidence", () => {
  it("binds the exact approved recovery and authoritative preservation reread", () => expect(createProjectStage11BackupPromotionRecoveryEvidence(m466())).toMatchObject({ status: "PASS", observedLifecycleCount: 1, producerScopedOnly: true, recoveryObserved: true, authoritativeReread: true, preservationObserved: true, noFoundryWrite: true, noAuthorityGrant: true, stage11AcceptanceStatus: "blocked", stage12Started: false }));
  it("fails closed for target, recovery, preservation, and promotion drift", () => {
    expect(() => createProjectStage11BackupPromotionRecoveryEvidence({ ...m466(), projectId: "foreign" })).toThrow(/projectId/);
    expect(() => createProjectStage11BackupPromotionRecoveryEvidence({ ...m466(), primaryRestored: false })).toThrow(/primaryRestored/);
    expect(() => createProjectStage11BackupPromotionRecoveryEvidence({ ...m466(), backupUnchanged: false })).toThrow(/backupUnchanged/);
    expect(() => createProjectStage11BackupPromotionRecoveryEvidence({ ...m466(), foundryWrite: true })).toThrow(/foundryWrite/);
    expect(() => createProjectStage11BackupPromotionRecoveryEvidence({ ...m466(), doesNotProve: ["generic Stage 11 acceptance"] })).toThrow(/doesNotProve/);
  });
});
