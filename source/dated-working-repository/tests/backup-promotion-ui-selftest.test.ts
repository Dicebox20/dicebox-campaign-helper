import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { formatProjectStoreFailure, isAssetRestoreUiTerminalInspection, type ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";

const appSource = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");
const modeStart = appSource.indexOf('mode !== "backup-promotion-ui-execute"');
const modeEnd = appSource.indexOf('if (mode !== "cross-producer-commit-recovery-ui-execute"', modeStart);
const selfTestSource = appSource.slice(modeStart, modeEnd);

describe("M418 backup-promotion UI self-test diagnostic", () => {
  it("is explicit, exact-fixture gated, and advances only after observed state transitions", () => {
    expect(modeStart).toBeGreaterThanOrEqual(0);
    expect(selfTestSource).toContain('"dbx:project:desktop-backup-authoritative-recovery-promotion-self-test"');
    expect(selfTestSource).toContain("prepareBackupAuthoritativeRecoveryPromotionFixture()");
    expect(selfTestSource).toContain('backupPromotionUiSelfTestStage.current = "fixture"');
    expect(selfTestSource).toContain('backupPromotionUiSelfTestStage.current = "previewed"');
    expect(selfTestSource).toContain('backupPromotionUiSelfTestStage.current = "approved"');
    expect(selfTestSource).toContain('backupPromotionUiSelfTestStage.current = "applied"');
    expect(selfTestSource).toContain('backupPromotionUiSelfTestStage.current = "executing"');
    expect(selfTestSource).toContain("await previewSelectedBackupPromotion(expectedProjectId)");
    expect(selfTestSource).toContain("await previewSelectedBackupPromotionProposal(backupPromotionPreview)");
    expect(selfTestSource).toContain("await approveSelectedProjectProposal(projectProposalSession)");
    expect(selfTestSource).toContain("await applySelectedBackupPromotionProposal(backupPromotionPreview, projectProposalSession)");
    expect(selfTestSource).toContain('projectProposalSession.history.status !== "previewed"');
    expect(selfTestSource).toContain('projectProposalSession.history.status !== "approved"');
    expect(selfTestSource).toContain('projectProposalSession.batch.commands[0]?.kind !== "project.recovery.backup-promote"');
    expect(selfTestSource).toContain("authoritative recovery reread");
    expect(selfTestSource).toContain("no session was replaced");
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("loaded", "backup-promotion-fixture")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("previewed", "backup-promotion-preview")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("previewed", "backup-promotion-proposal")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("approved", "backup-promotion-review")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("applied", "backup-promotion-apply")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("pass", "backup-promotion-committed")');
    expect(selfTestSource).toContain('recordProjectUiSelfTestProgress("blocked", reason.slice(0, 512))');
    expect(selfTestSource).not.toContain("await previewSelectedBackupPromotion(fixture.projectId)");
    expect(selfTestSource).not.toContain("await previewSelectedBackupPromotionProposal(preview)");
    expect(selfTestSource).not.toContain("await approveSelectedProjectProposal(proposal)");
    expect(selfTestSource).not.toContain("await applySelectedBackupPromotionProposal(preview, approved)");
    expect(selfTestSource).not.toContain("promoteBackupAuthoritativeRecovery(");
  });

  it("has an exact test-gated reset route with observed cancel/clear stages and a terminal outcome", () => {
    const start = appSource.indexOf('mode !== "backup-promotion-ui-session-reset"');
    const end = appSource.indexOf('mode !== "backup-promotion-ui-execute"', start);
    const reset = appSource.slice(start, end);
    expect(reset).toContain('"dbx:project:desktop-backup-authoritative-recovery-promotion-self-test"');
    expect(reset).toContain('loaded.session.history.status !== "previewed"');
    expect(reset).toContain('backupPromotionUiSessionResetStage.current = "loading"');
    expect(reset).toContain('backupPromotionUiSessionResetStage.current = "cancelling"');
    expect(reset).toContain('backupPromotionUiSessionResetStage.current = "clearing"');
    expect(reset).toContain('backupPromotionUiSessionResetStage.current = "cleared"');
    expect(reset).toContain('backupPromotionUiSessionResetStage.current = "verifying"');
    expect(reset).toContain("cancelSelectedProjectProposal()");
    expect(reset).toContain("clearSelectedTerminalProjectProposal()");
    expect(reset).toContain('recordProjectUiSelfTestProgress("loaded", "backup-promotion-session-reset-load")');
    expect(reset).toContain('recordProjectUiSelfTestProgress("previewed", "backup-promotion-session-reset-cancel")');
    expect(reset).toContain('recordProjectUiSelfTestProgress("applied", "backup-promotion-session-reset-clear")');
    expect(reset).toContain('recordProjectUiSelfTestProgress("applied", "backup-promotion-session-reset-reread")');
    expect(reset).toContain('loaded.status !== "MISSING"');
    expect(reset).toContain('terminal-cleared and reread MISSING; no recovery apply');
    expect(reset).toContain('finishProjectSelfTest(status)');
    expect(reset).toContain('exact previewed session was cancelled then terminal-cleared and reread MISSING; no recovery apply');
    expect(reset).not.toContain("promoteBackupAuthoritativeRecovery(");
  });

  it("has an exact read-only inspector that accepts only a missing current key", () => {
    const start = appSource.indexOf('mode !== "backup-promotion-ui-session-inspect"');
    const end = appSource.indexOf('mode !== "backup-promotion-ui-session-reset"', start);
    const inspector = appSource.slice(start, end);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(inspector).toContain('"dbx:project:desktop-backup-authoritative-recovery-promotion-self-test"');
    expect(inspector).toContain("loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId)");
    expect(inspector).toContain('loaded.status !== "MISSING"');
    expect(inspector).toContain("exact key reread MISSING · no state changed");
    expect(inspector).toContain('finishProjectSelfTest("PASS")');
    expect(inspector).toContain('finishProjectSelfTest("BLOCKED")');
    expect(inspector).not.toContain("cancelSelectedProjectProposal(");
    expect(inspector).not.toContain("clearSelectedTerminalProjectProposal(");
    expect(inspector).not.toContain("promoteBackupAuthoritativeRecovery(");
  });

  it("has a separate exact-target metadata-only session-status inspector", () => {
    const start = appSource.indexOf('mode !== "backup-promotion-ui-session-status-inspect"');
    const end = appSource.indexOf('mode !== "backup-promotion-ui-session-inspect"', start);
    const inspector = appSource.slice(start, end);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(inspector).toContain('"dbx:project:desktop-backup-authoritative-recovery-promotion-self-test"');
    expect(inspector).toContain("loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId)");
    expect(inspector).toContain("inspectDesktopProjectProposalSession(loaded.session)");
    expect(inspector).toContain('commandKind === "project.recovery.backup-promote"');
    expect(inspector).toContain('commandKind === "project.recovery.backup-promotion"');
    expect(inspector).toContain('commandIdentity === null');
    expect(inspector).toContain('"repaired"');
    expect(inspector).toContain('"legacy"');
    expect(inspector).toContain("backup-promotion-session-status:");
    expect(inspector).toContain("no state changed");
    expect(inspector).not.toContain("saveDesktopProjectProposalSession(");
    expect(inspector).not.toContain("clearTerminalDesktopProjectProposalSession(");
    expect(inspector).not.toContain("promoteBackupAuthoritativeRecovery(");
  });

  it("uses the existing exact terminal-session preflight without replacing nonterminal or blocked sessions", () => {
    const handlerStart = appSource.indexOf("const previewSelectedBackupPromotionProposal");
    const handlerEnd = appSource.indexOf("const previewSelectedProjectRenameProposal", handlerStart);
    if (handlerStart < 0 || handlerEnd < 0) throw new Error("M399 backup-promotion proposal handler is missing.");
    const handler = appSource.slice(handlerStart, handlerEnd);
    expect(handler).toContain("loadDesktopProjectProposalSession(proposalStorage, preview.projectId)");
    expect(handler).toContain('existingProposal.status === "BLOCKED"');
    expect(handler).toContain('existingProposal.status === "PASS"');
    expect(handler).toContain("terminalStatuses.includes(existingProposal.session.history.status)");
    expect(handler).toContain("clearTerminalDesktopProjectProposalSession(proposalStorage, preview.projectId)");
    expect(handler).toContain("must reach a terminal state and be cleared before replacement");
    expect(handler.indexOf("clearTerminalDesktopProjectProposalSession")).toBeGreaterThan(handler.indexOf("terminalStatuses.includes"));
  });

  it("retains bounded structured blocker detail in the exact state-driver trace", () => {
    const error = {
      code: "FIXTURE_CONFLICT",
      message: "The exact test-owned fixture is not in its required missing-primary state.",
      retry: "reread before any retry",
    };
    expect(formatProjectStoreFailure(error)).toBe("FIXTURE_CONFLICT: The exact test-owned fixture is not in its required missing-primary state. · retry reread before any retry");
    expect(selfTestSource).toContain("block(formatProjectStoreFailure(error))");
    expect(selfTestSource).not.toContain("block(error instanceof Error ? error.message : String(error))");
  });

  it("drives the exact asset-restore UI route through selection, review, approval, apply, and reread", () => {
    const start = appSource.indexOf('mode !== "asset-restore-ui-execute"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const restore = appSource.slice(start, end);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(restore).toContain("prepareAssetRestoreTraceFixtureV3()");
    expect(restore).toContain("DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_PROJECT_ID");
    expect(restore).toContain("DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE");
    expect(restore).toContain("loadDesktopAssetRestoreUiV3SelfTestProposalSession(storage)");
    expect(restore).toContain("clearTerminalDesktopAssetRestoreUiV3SelfTestProposalSession(storage)");
    expect(restore).toContain("projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_RESTORE_UI_SELF_TEST_V3_SCOPE");
    expect(restore).toContain("ASSET_RESTORE_TRACE_WEBP_ASSET_ID");
    expect(restore).toContain("ASSET_RESTORE_TRACE_PNG_ASSET_ID");
    expect(restore).toContain("ASSET_RESTORE_TRACE_WEBP_BYTES");
    expect(restore).toContain('asset-restore-trace:');
    expect(restore).toContain('progress("loaded", "isolated-fixture-reread")');
    expect(restore).toContain('progress("previewed", "exact-webp-preview")');
    expect(restore).toContain('progress("approved", "reviewer-approved")');
    expect(restore).toContain('progress("applied", "typed-apply")');
    expect(restore).toContain('progress("pass", "authoritative-reread")');
    expect(restore).toContain("previewSelectedProjectAssetRestore(");
    expect(restore).toContain("project.asset.restore");
    expect(restore).toContain("approveSelectedProjectProposal()");
    expect(restore).toContain("applySelectedProjectAssetRestoreProposal()");
    expect(restore).toContain("isAssetRestoreUiTerminalInspection");
    expect(restore).toContain("isAssetRestoreUiTerminalInspection(recoveryInspection, projectId, ASSET_RESTORE_TRACE_WEBP_ASSET_ID, [ASSET_RESTORE_TRACE_PNG_ASSET_ID])");
    expect(restore).not.toContain("recoveryInspection?.status === \"PASS\"");
    expect(restore).toContain("no Foundry write");
    expect(restore).not.toContain("prepareAssetRestoreTraceFixture()");
    expect(restore).not.toContain("loadDesktopProjectProposalSession(storage, projectId)");
    expect(restore).not.toContain("restoreMissingAsset(");
    const applyStart = appSource.indexOf("const applySelectedProjectAssetRestoreProposal");
    const applyEnd = appSource.indexOf("const cancelSelectedProjectAssetRestore", applyStart);
    const apply = appSource.slice(applyStart, applyEnd);
    expect(applyStart).toBeGreaterThanOrEqual(0);
    expect(apply).toContain("isAssetRestoreUiTerminalInspection(inspection, receipt.projectId, recoveryPreview.assetId, expectedRemainingAssetIds)");
  });

  it("provides a separate read-only post-restore asset inspection path for the consumed trace fixture", () => {
    const start = appSource.indexOf('mode !== "asset-restore-ui-reread"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const reread = appSource.slice(start, end);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(reread).toContain("inspectProjectRecovery(projectId)");
    expect(reread).toContain("ASSET_RESTORE_TRACE_WEBP_ASSET_ID");
    expect(reread).toContain("ASSET_RESTORE_TRACE_PNG_ASSET_ID");
    expect(reread).toContain('inspection.status === "BLOCKED"');
    expect(reread).toContain('inspection.blockerCode === "REGISTERED_ASSET_BLOB_MISSING"');
    expect(reread).toContain('selectedRestored?.disposition === "PRESENT_VALID"');
    expect(reread).toContain('unselectedPreserved?.disposition === "MISSING"');
    expect(reread).toContain("remainingEligible.length === 1");
    expect(reread).toContain('progress("pass", "authoritative-post-restore-reread")');
    expect(reread).not.toContain("prepareAssetRestoreTraceFixture()");
    expect(reread).not.toContain("applySelectedProjectAssetRestoreProposal()");
  });

  it("accepts only the exact selected-restored/unselected-preserved asset topology", () => {
    const projectId = "dbx:project:restore-predicate-test";
    const selectedAssetId = "dbx:asset:sha256-selected";
    const remainingAssetId = "dbx:asset:sha256-remaining";
    const baseInspection = (overrides: Partial<ProjectRecoveryInspectionReceipt> = {}): ProjectRecoveryInspectionReceipt => ({
      operation: "dicebox.project.recovery.inspect",
      status: "BLOCKED",
      projectId,
      generation: 1,
      contentSha256: "a".repeat(64),
      scenes: [],
      primary: { relativePath: "projects/restore-predicate-test/project.json", status: "VALID" },
      backup: { relativePath: "projects/restore-predicate-test/project.backup.json", status: "MISSING" },
      registeredAssets: [
        { assetId: selectedAssetId, role: "background", sha256: "b".repeat(64), mediaType: "image/webp", byteLength: 14, relativePath: "assets/sha256/selected", affectedSceneIds: [], disposition: "PRESENT_VALID", restoreEligible: false },
        { assetId: remainingAssetId, role: "background", sha256: "c".repeat(64), mediaType: "image/png", byteLength: 9, relativePath: "assets/sha256/remaining", affectedSceneIds: [], disposition: "MISSING", blockerCode: "REGISTERED_ASSET_BLOB_MISSING", restoreEligible: true },
      ],
      pendingArtifacts: [{ artifactKind: "workspace-index-pending", relativePath: "workspace.pending", status: "PRESENT_VALID", retry: "recovery-required-after-reread" }],
      brokenSceneReferences: [],
      blockerCode: "REGISTERED_ASSET_BLOB_MISSING",
      retry: "after-exact-byte-preview",
      restoreEligible: true,
      noWrite: true,
      noFoundryWrite: true,
      ...overrides,
    });

    expect(isAssetRestoreUiTerminalInspection(baseInspection(), projectId, selectedAssetId, [remainingAssetId])).toBe(true);
    expect(isAssetRestoreUiTerminalInspection(baseInspection({ blockerCode: "OTHER_BLOCKER" }), projectId, selectedAssetId, [remainingAssetId])).toBe(false);
    expect(isAssetRestoreUiTerminalInspection(baseInspection({ registeredAssets: [...baseInspection().registeredAssets, { ...baseInspection().registeredAssets[1]!, assetId: "dbx:asset:sha256-unexpected", sha256: "d".repeat(64) }] }), projectId, selectedAssetId, [remainingAssetId])).toBe(false);
    expect(isAssetRestoreUiTerminalInspection(baseInspection({ pendingArtifacts: [{ artifactKind: "workspace-index-pending", relativePath: "workspace.pending", status: "BLOCKED", blockerCode: "PENDING_ARTIFACT_INVALID", retry: "never" }] }), projectId, selectedAssetId, [remainingAssetId])).toBe(false);
  });
});
