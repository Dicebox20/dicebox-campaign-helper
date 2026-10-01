import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/App.tsx", import.meta.url), "utf8");
const nativeSource = readFileSync(new URL("../apps/campaign-helper-desktop/src-tauri/crates/dicebox-project-store/src/lib.rs", import.meta.url), "utf8");

describe("M872 cross-producer self-test target contract", () => {
  it("keeps the UI targets and native exact-target allowlist on the preserved v3 and additive v4/v5 projects", () => {
    const v3Target = "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3";
    const v4Target = "dbx:project:desktop-cross-producer-commit-recovery-self-test-v4";
    const v5Target = "dbx:project:desktop-cross-producer-commit-recovery-self-test-v5";
    expect(appSource).toContain(`: "${v3Target}"`);
    expect(appSource).toContain(`? "${v4Target}"`);
    expect(appSource).toContain(`? "${v5Target}"`);
    expect(nativeSource).toContain(`"${v3Target}"`);
    expect(nativeSource).toContain(`"${v4Target}"`);
    expect(nativeSource).toContain(`"${v5Target}"`);
    expect(nativeSource).toContain("PROJECT_TARGET_NOT_ALLOWED");
  });

  it("does not broaden the self-test beyond the exact test-owned v3/v4/v5 allowlist", () => {
    expect(nativeSource).toContain("if project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID");
    expect(nativeSource).toContain("&& project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V4_PROJECT_ID");
    expect(nativeSource).toContain("&& project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_V5_PROJECT_ID");
    expect(appSource).toContain('mode !== "cross-producer-commit-recovery-ui-v4-execute"');
    expect(appSource).toContain('mode !== "cross-producer-commit-recovery-ui-v5-execute"');
    expect(appSource).toContain("M870 requires an absent exact test-owned target and will not overwrite or clean up an existing project.");
  });
});
