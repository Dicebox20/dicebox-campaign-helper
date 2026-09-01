import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../apps/campaign-helper-desktop/src/App.tsx", import.meta.url), "utf8");
const nativeSource = readFileSync(new URL("../apps/campaign-helper-desktop/src-tauri/crates/dicebox-project-store/src/lib.rs", import.meta.url), "utf8");

describe("M872 cross-producer self-test target contract", () => {
  it("keeps the UI target and native exact-target allowlist on the same v3 project", () => {
    const target = "dbx:project:desktop-cross-producer-commit-recovery-self-test-v3";
    expect(appSource).toContain(`const projectId = "${target}"`);
    expect(nativeSource).toContain(`"${target}"`);
    expect(nativeSource).toContain("PROJECT_TARGET_NOT_ALLOWED");
  });

  it("does not broaden the self-test beyond the exact test-owned target", () => {
    expect(nativeSource).toContain("if project_id != CROSS_PRODUCER_COMMIT_RECOVERY_SELF_TEST_PROJECT_ID");
    expect(appSource).toContain("M870 requires an absent exact test-owned target and will not overwrite or clean up an existing project.");
  });
});
