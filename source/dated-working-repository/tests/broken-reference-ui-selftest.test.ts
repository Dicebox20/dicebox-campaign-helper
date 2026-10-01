import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isBrokenReferenceUiTerminalInspection, type ProjectRecoveryInspectionReceipt } from "../apps/campaign-helper-desktop/src/project-store";

const root = resolve(import.meta.dirname, "..");
const appSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");
const sessionSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-proposal-session.ts"), "utf8");
const storeSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-store.ts"), "utf8");
const rustSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src-tauri", "crates", "dicebox-project-store", "src", "lib.rs"), "utf8");
const shellSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src-tauri", "src", "lib.rs"), "utf8");

describe("M500 broken-reference UI lifecycle seam", () => {
  it("uses a distinct role-mismatch fixture and the current visible session handlers", () => {
    expect(appSource).toContain('mode !== "broken-reference-detach-ui-execute"');
    expect(appSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID');
    expect(appSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V3_PROJECT_ID');
    expect(appSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID');
    expect(sessionSource).toContain('dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v2');
    expect(sessionSource).toContain('dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v3');
    expect(sessionSource).toContain('dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v4');
    expect(appSource).toContain("prepareBrokenReferenceUiLifecycleFixture");
    expect(appSource).toContain("prepareBrokenReferenceUiLifecycleFixtureV3");
    expect(appSource).toContain("prepareBrokenReferenceUiLifecycleFixtureV4");
    expect(appSource).toContain("previewSelectedBrokenReferenceDetach(projectBrokenReferenceUiSelfTestOwnershipToken.current, selfTestScope)");
    expect(appSource).toContain("const approved = await approveSelectedProjectProposal(projectProposalSession)");
    expect(appSource).toContain("if (approved === null) throw");
    expect(appSource).toContain("applySelectedBrokenReferenceDetachProposal()");
    expect(appSource).toContain('"BACKGROUND_ASSET_ROLE_MISMATCH"');
    expect(appSource).toContain('progress("loaded", "fixture-reread")');
    expect(appSource).toContain('progress("previewed", "recovery-proposal-session")');
    expect(appSource).toContain('progress("approved", "reviewer-approval")');
    expect(appSource).toContain('progress("applied", "typed-detach-apply")');
    expect(appSource).toContain('progress("pass", "authoritative-reread-commit")');
    expect(appSource).toContain("no retry was attempted");
    const start = appSource.indexOf('if ((mode !== "broken-reference-detach-ui-execute"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const route = appSource.slice(start, end);
    expect(route).toContain('inspection.primary.status !== "BLOCKED"');
    expect(route).toContain("inspection.generation !== undefined");
    expect(route).not.toContain("inspection.generation !== null");
    expect(route).toContain("hasTargetProjectPendingArtifact(inspection, projectId)");
    expect(route).toContain("summarizeDesktopProjectProposalSessionLoad(stored)");
    expect(route).toContain("classifyDesktopBrokenReferenceUiSessionOwnership");
    expect(route).toContain("createDesktopBrokenReferenceUiOwnershipToken");
    expect(appSource).toContain("createDesktopBrokenReferenceUiOwnedProposalBatch");
    expect(route).toContain("projectBrokenReferenceUiSelfTestOwnershipToken.current");
    expect(route).toContain("projectBrokenReferenceUiSelfTestExpectedBatch.current");
    expect(route).toContain('ownership?.disposition !== "TEST_OWNED_EXACT"');
    expect(route).toContain('ownership?.disposition === "TEST_OWNED_EXACT"');
    expect(route).toContain("createProjectRecoveryProposalBatch");
    expect(route).toContain("previewBrokenReferenceDetach(selected, projectId)");
    expect(route).toContain("ownership=${ownership.disposition}");
    expect(route).toContain("exactBatchSemantics=${ownership.exactBatchSemantics}");
    expect(route).toContain("exactIdentity=${ownership.exactIdentity}");
    expect(route).toContain("ownershipToken=${ownership.ownershipToken}");
    expect(route).toContain("ownership.disposition");
    expect(route).toContain('await progress("previewed", "recovery-proposal-session")');
    expect(route).toContain('await progress("approved", "reviewer-approval")');
    expect(route).toContain('await progress("applied", "typed-detach-apply")');
    expect(route).toContain("if (approved === null) throw");
    expect(route).toContain("block(formatProjectStoreFailure(error))");
    expect(route).not.toContain('projectBrokenReferenceUiSelfTestStage.current === "previewed" &&');
    expect(route).not.toContain('projectBrokenReferenceUiSelfTestStage.current === "approved" &&');
    expect(route.match(/const approved = await approveSelectedProjectProposal\(projectProposalSession\)/g) ?? []).toHaveLength(1);
    expect(route.match(/await applySelectedBrokenReferenceDetachProposal\(\)/g) ?? []).toHaveLength(1);
    expect(route.indexOf('await progress("previewed", "recovery-proposal-session")')).toBeLessThan(route.indexOf("const approved = await approveSelectedProjectProposal(projectProposalSession)"));
    expect(route.indexOf('await progress("approved", "reviewer-approval")')).toBeLessThan(route.indexOf('await progress("applied", "typed-detach-apply")'));
    expect(route.indexOf('await progress("applied", "typed-detach-apply")')).toBeLessThan(route.indexOf("await applySelectedBrokenReferenceDetachProposal()"));
    expect(route).not.toContain("session.batch");
    expect(route).toContain("session-preflight=");
    expect(route).toContain('sessionPreflight !== "MISSING"');
    expect(route).toContain("session-preflight:${sessionPreflight};fixture-reread");
    expect(route).toContain("loadDesktopBrokenReferenceUiSelfTestProposalSession");
    expect(route).toContain("loadDesktopBrokenReferenceUiV3SelfTestProposalSession");
    expect(route).toContain("loadDesktopBrokenReferenceUiV4SelfTestProposalSession");
    expect(route).toContain('broken-reference-detach-ui-v4-execute');
    expect(route).toContain("useV3SelfTest");
    expect(route).toContain("prepareSelfTestFixture");
    expect(route).toContain("loadSelfTestProposalSession");
    expect(route).toContain("selfTestScope");
    expect(route).not.toContain("loadDesktopProjectProposalSession(");
    expect(route).not.toContain("projectProposalSession !== null");
    expect(route).not.toContain("stored.key");
    expect(route).not.toContain("stored.reason");
    expect(route).not.toContain("clearTerminalDesktopProjectProposalSession");
    expect(route).toContain("target-owned pending state");
    expect(route).not.toContain('inspection.primary.status !== "VALID"');
    expect(route).not.toContain("inspection.pendingArtifacts.length !== 0");
    expect(route).toContain("isBrokenReferenceUiTerminalInspection(recoveryInspection, projectId)");
    expect(route).not.toContain("recoveryInspection.pendingArtifacts.length !== 0");
  });

  it("accepts clean current state with preserved backup diagnostics without weakening pending gates", () => {
    expect(storeSource).toContain("isBrokenReferenceUiTerminalInspection");
    expect(storeSource).toContain("primaryReferences.length === 0");
    expect(storeSource).toContain("preservedBackupDiagnostics");
    expect(storeSource).toContain('reference.blockerCode === "BACKGROUND_ASSET_ROLE_MISMATCH"');
    expect(storeSource).toContain("hasAnyProjectPendingArtifact");
    expect(storeSource).toContain("hasBlockedPendingArtifact");
    expect(appSource).toContain("isBrokenReferenceUiTerminalInspection(recoveryInspection, projectId)");
  });

  it("exercises the acceptance helper against preserved and unsafe rereads", () => {
    const projectId = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v3";
    const assetId = "dbx:asset:sha256-3ae001fc27b1a7a8e0ba5995a9d94d89ec20ec110c9dceaa017c86a128702011";
    const primarySource = "projects/desktop-broken-reference-ui-lifecycle-self-test-v3/project.json" as const;
    const backupSource = "projects/desktop-broken-reference-ui-lifecycle-self-test-v3/project.backup.json" as const;
    const backupDiagnostic = {
      source: backupSource,
      sceneId: "dbx:scene:desktop-broken-reference-ui-lifecycle-self-test-v3-target",
      assetId,
      blockerCode: "BACKGROUND_ASSET_ROLE_MISMATCH" as const,
      blockerMessage: "Preserved backup diagnostic",
      retry: "never",
    };
    const baseInspection = (overrides: Partial<ProjectRecoveryInspectionReceipt> = {}): ProjectRecoveryInspectionReceipt => ({
      operation: "dicebox.project.recovery.inspect",
      status: "BLOCKED",
      projectId,
      generation: 2,
      contentSha256: "c".repeat(64),
      activeSceneId: "dbx:scene:desktop-broken-reference-ui-lifecycle-self-test-v3-target",
      scenes: [],
      primary: { relativePath: primarySource, status: "VALID", byteSha256: "a".repeat(64) },
      backup: { relativePath: backupSource, status: "VALID", byteSha256: "b".repeat(64) },
      registeredAssets: [{
        assetId,
        role: "handout",
        sha256: assetId.slice("dbx:asset:sha256-".length),
        mediaType: "image/webp",
        byteLength: 14,
        relativePath: `assets/sha256/${assetId.slice("dbx:asset:sha256-".length)}`,
        affectedSceneIds: [],
        disposition: "PRESENT_VALID",
        restoreEligible: false,
      }],
      pendingArtifacts: [],
      brokenSceneReferences: [backupDiagnostic],
      retry: "never",
      restoreEligible: false,
      noWrite: true,
      noFoundryWrite: true,
      ...overrides,
    });

    expect(isBrokenReferenceUiTerminalInspection(baseInspection(), projectId)).toBe(true);
    expect(isBrokenReferenceUiTerminalInspection(baseInspection({
      pendingArtifacts: [{
        artifactKind: "workspace-index-pending",
        relativePath: "./workspace-index.example.pending",
        status: "PRESENT_VALID",
        stagedContentSha256: "d".repeat(64),
        byteSha256: "e".repeat(64),
        retry: "recovery-required-after-reread",
      }],
    }), projectId)).toBe(true);
    expect(isBrokenReferenceUiTerminalInspection(baseInspection({
      pendingArtifacts: [{
        artifactKind: "project-pending",
        relativePath: "projects/desktop-broken-reference-ui-lifecycle-self-test-v3/project.example.pending",
        status: "PRESENT_VALID",
        stagedContentSha256: "d".repeat(64),
        byteSha256: "e".repeat(64),
        retry: "recovery-required-after-reread",
      }],
    }), projectId)).toBe(false);
    expect(isBrokenReferenceUiTerminalInspection(baseInspection({
      brokenSceneReferences: [{ ...backupDiagnostic, source: primarySource }],
    }), projectId)).toBe(false);
    expect(isBrokenReferenceUiTerminalInspection(baseInspection({
      pendingArtifacts: [{
        artifactKind: "workspace-index-pending",
        relativePath: "./workspace-index.example.pending",
        status: "BLOCKED",
        blockerCode: "PENDING_ARTIFACT_INVALID",
        retry: "never",
      }],
    }), projectId)).toBe(false);
    expect(isBrokenReferenceUiTerminalInspection(baseInspection({ status: "PASS", brokenSceneReferences: [] }), projectId)).toBe(true);
  });

  it("keeps the self-test namespace closed and ordinary session APIs isolated", () => {
    expect(sessionSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_SCOPE = "broken-reference-ui-self-test"');
    expect(sessionSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v2"');
    expect(sessionSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_PROJECT_ID = "dbx:project:desktop-broken-reference-ui-lifecycle-self-test-v4"');
    expect(sessionSource).toContain('DESKTOP_BROKEN_REFERENCE_UI_SELF_TEST_V4_SCOPE = "broken-reference-ui-self-test-v4"');
    expect(sessionSource).toContain("desktopBrokenReferenceUiV4SelfTestSessionStorageKey");
    expect(sessionSource).toContain("loadDesktopBrokenReferenceUiV4SelfTestProposalSession");
    expect(sessionSource).toContain("saveDesktopBrokenReferenceUiV4SelfTestProposalSession");
    expect(sessionSource).toContain("clearTerminalDesktopBrokenReferenceUiV4SelfTestProposalSession");
    expect(sessionSource).toContain("desktopBrokenReferenceUiSelfTestSessionStorageKey");
    expect(sessionSource).toContain("loadDesktopBrokenReferenceUiSelfTestProposalSession");
    expect(sessionSource).toContain("saveDesktopBrokenReferenceUiSelfTestProposalSession");
    expect(sessionSource).toContain("clearTerminalDesktopBrokenReferenceUiSelfTestProposalSession");
    expect(sessionSource).toContain("assertBrokenReferenceUiSelfTestBatch");
    expect(sessionSource).toContain("The broken-reference UI self-test target requires its closed typed session namespace.");
    expect(sessionSource).toContain("The broken-reference UI self-test namespace requires its exact fixed test-owned project identity.");
  });

  it("keeps the new fixture refuse-to-overwrite and outside direct engine/generic paths", () => {
    expect(storeSource).toContain("prepareBrokenReferenceUiLifecycleFixture");
    expect(rustSource).toContain("BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_PROJECT_ID");
    expect(rustSource).toContain("BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V3_PROJECT_ID");
    expect(rustSource).toContain("BROKEN_REFERENCE_UI_LIFECYCLE_SELF_TEST_V4_PROJECT_ID");
    expect(rustSource).toContain("The broken-reference UI lifecycle fixture will not overwrite");
    expect(rustSource).toContain("reuse_broken_reference_ui_lifecycle_fixture_at");
    expect(rustSource).toContain("The broken-reference UI lifecycle fixture will not overwrite an existing project unless it matches the exact reusable test topology.");
    expect(rustSource).toContain('ensure_not_reparse(primary, "Broken-reference UI lifecycle fixture primary")');
    expect(rustSource).toContain('ensure_not_reparse(&asset_path, "Broken-reference UI lifecycle fixture asset")');
    expect(rustSource).toContain("M500 broken-reference UI lifecycle fixture");
    expect(rustSource).toContain("broken_reference_ui_lifecycle_fixture_is_distinct_and_refuses_overwrite");
    expect(shellSource).toContain("prepare_broken_reference_ui_lifecycle_fixture");
    expect(shellSource).toContain("prepare_broken_reference_ui_lifecycle_fixture_v3");
    expect(shellSource).toContain("prepare_broken_reference_ui_lifecycle_fixture_v4");
    expect(shellSource).toContain("prepare_broken_reference_ui_lifecycle_fixture,");
    expect(shellSource).toContain("BrokenReferenceUiLifecycleFixtureReceipt");
    const start = appSource.indexOf('if ((mode !== "broken-reference-detach-ui-execute"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const route = appSource.slice(start, end);
    expect(route).not.toContain("detachBrokenReference(");
    expect(route).not.toContain("prepareBrokenReferenceDetachFixture(");
    expect(route).not.toContain("createProjectBundle(");
  });

  it("requires committed session history and authoritative preservation checks", () => {
    expect(appSource).toContain('projectProposalSession?.history.status === "committed"');
    expect(appSource).toContain("assetDescriptorPreserved === true");
    expect(appSource).toContain("unrelatedReferencesUnchanged === true");
    expect(appSource).toContain("isBrokenReferenceUiTerminalInspection(recoveryInspection, projectId)");
    expect(appSource).toContain("recoveryInspection.noFoundryWrite === true");
  });
});
