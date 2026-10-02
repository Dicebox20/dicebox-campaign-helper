import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID, ASSET_DETACH_UI_LIFECYCLE_WEBP_BYTES } from "../apps/campaign-helper-desktop/src/project-store";

const root = resolve(import.meta.dirname, "..");
const appSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");
const storeSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-store.ts"), "utf8");
const sessionSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src", "project-proposal-session.ts"), "utf8");
const rustSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src-tauri", "crates", "dicebox-project-store", "src", "lib.rs"), "utf8");
const shellSource = readFileSync(resolve(root, "apps", "campaign-helper-desktop", "src-tauri", "src", "lib.rs"), "utf8");

describe("M498 selected asset-detach UI lifecycle seam", () => {
  it("uses a distinct fixture and the visible proposal-session lifecycle", () => {
    expect(appSource).toContain('mode !== "asset-detach-ui-execute"');
    expect(appSource).toContain("DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID");
    expect(appSource).toContain("prepareAssetDetachUiLifecycleFixture");
    expect(appSource).toContain("loadDesktopAssetDetachUiSelfTestProposalSession");
    expect(appSource).toContain("DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE");
    expect(appSource).toContain("previewSelectedProjectAssetDetach()");
    expect(appSource).toContain("approveSelectedProjectProposal()");
    expect(appSource).toContain("applySelectedProjectAssetDetachProposal()");
    expect(appSource).toContain('projectProposalSession?.history.status === "previewed"');
    expect(appSource).toContain('projectProposalSession?.history.status === "approved"');
    expect(appSource).toContain('projectProposalSession?.history.status === "committed"');
    expect(appSource).toContain('progress("loaded", "fixture-reread")');
    expect(appSource).toContain('progress("previewed", "recovery-proposal-session")');
    expect(appSource).toContain('await progress("previewed", "recovery-proposal-session")');
    expect(appSource).toContain("const approved = await approveSelectedProjectProposal(projectProposalSession)");
    expect(appSource).toContain("Selected-detach UI self-test approval handoff did not produce an approved session");
    expect(appSource).toContain('progress("approved", "reviewer-approval")');
    expect(appSource).toContain('await progress("approved", "reviewer-approval")');
    expect(appSource).toContain('progress("applied", "typed-detach-apply")');
    expect(appSource).toContain('await progress("applied", "typed-detach-apply")');
    expect(appSource).toContain("await applySelectedProjectAssetDetachProposal()");
    expect(appSource).toContain('progress("pass", "authoritative-reread-commit")');
    expect(appSource).toContain("no retry was attempted");
  });

  it("keeps fixture preparation refuse-to-overwrite and preserves exact authority boundaries", () => {
    expect(storeSource).toContain("ASSET_DETACH_UI_LIFECYCLE_PNG_ASSET_ID");
    expect(storeSource).toContain("ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID");
    expect(storeSource).toContain('prepare_asset_detach_ui_lifecycle_fixture');
    expect(rustSource).toContain("ASSET_DETACH_UI_LIFECYCLE_SELF_TEST_PROJECT_ID");
    expect(rustSource).toContain("The asset-detach UI lifecycle fixture will not overwrite");
    expect(rustSource).toContain("reuse_asset_detach_ui_lifecycle_fixture_at");
    expect(rustSource).toContain('"PROJECT_FIXTURE_EXISTS"');
    expect(rustSource).toContain("asset_detach_ui_lifecycle_fixture_creates_one_missing_and_one_preserved_asset");
    expect(shellSource).toContain("prepare_asset_detach_ui_lifecycle_fixture");
    expect(shellSource).toContain("prepare_asset_detach_ui_lifecycle_fixture,");
  });

  it("aligns the fixed WebP identity and preserves unrelated pending diagnostics", () => {
    const digest = createHash("sha256").update(Buffer.from(ASSET_DETACH_UI_LIFECYCLE_WEBP_BYTES)).digest("hex");
    expect(ASSET_DETACH_UI_LIFECYCLE_WEBP_ASSET_ID).toBe(`dbx:asset:sha256-${digest}`);
    expect(appSource).toContain("hasTargetProjectPendingArtifact(inspection, projectId)");
    expect(appSource).toContain("!hasTargetProjectPendingArtifact(recoveryInspection, projectId)");
    expect(rustSource).toContain('!inspection.pending_artifacts.iter().any(|artifact| artifact.artifact_kind == "project-pending")');
    expect(appSource).not.toContain("inspection.pendingArtifacts.length !== 0");
    expect(appSource).not.toContain("recoveryInspection.pendingArtifacts.length === 0");
  });

  it("does not add a direct self-test detach path or generic executor", () => {
    const start = appSource.indexOf('if (mode !== "asset-detach-ui-execute"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const route = appSource.slice(start, end);
    expect(route).not.toContain("detachMissingAsset(");
    expect(route).not.toContain("createProjectBundle(");
    expect(route).not.toContain("restoreMissingAsset(");
    expect(appSource).not.toContain("applyGenericProjectProposal");
    expect(appSource).not.toContain("executeGenericProjectProposal");
  });

  it("isolates the selected-detach self-test from the ordinary project session key", () => {
    expect(sessionSource).toContain('DESKTOP_ASSET_DETACH_UI_SELF_TEST_PROJECT_ID = "dbx:project:desktop-asset-detach-ui-lifecycle-self-test-v1"');
    expect(sessionSource).toContain('DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE = "asset-detach-ui-self-test"');
    expect(sessionSource).toContain('DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE = "asset-detach-ui-self-test-v2"');
    expect(sessionSource).toContain("desktopAssetDetachUiSelfTestSessionStorageKey");
    expect(sessionSource).toContain("desktopAssetDetachUiV2SelfTestSessionStorageKey");
    expect(sessionSource).toContain("loadDesktopAssetDetachUiSelfTestProposalSession");
    expect(sessionSource).toContain("loadDesktopAssetDetachUiV2SelfTestProposalSession");
    expect(sessionSource).toContain("saveDesktopAssetDetachUiSelfTestProposalSession");
    expect(sessionSource).toContain("saveDesktopAssetDetachUiV2SelfTestProposalSession");
    expect(appSource).toContain("saveDesktopAssetDetachUiSelfTestProposalSession(storage, session)");
    expect(appSource).toContain("saveDesktopAssetDetachUiV2SelfTestProposalSession(storage, session)");
    const start = appSource.indexOf('if (mode !== "asset-detach-ui-execute"');
    const end = appSource.indexOf("useEffect(() => {", start + 1);
    const route = appSource.slice(start, end);
    expect(route).toContain("projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_DETACH_UI_SELF_TEST_V2_SCOPE");
    expect(route).not.toContain("projectProposalSessionPersistenceScope.current = DESKTOP_ASSET_DETACH_UI_SELF_TEST_SCOPE");
    expect(route).toContain("loadDesktopAssetDetachUiV2SelfTestProposalSession(browserDesktopProjectProposalSessionStorage())");
    expect(route).not.toContain('loadDesktopProjectProposalSession(browserDesktopProjectProposalSessionStorage(), projectId);');
    expect(route).not.toContain('projectProposalSession !== null) { block("an existing project proposal session must be absent');
  });
});
