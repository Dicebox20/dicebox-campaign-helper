import { describe, expect, it } from "vitest";
import { hasTargetProjectPendingArtifact, type PendingArtifactRecoveryInspection } from "../apps/campaign-helper-desktop/src/project-store";

const targetProjectId = "dbx:project:broken-reference-ui-lifecycle";

function artifact(
  artifactKind: PendingArtifactRecoveryInspection["artifactKind"],
  relativePath: string,
): PendingArtifactRecoveryInspection {
  return { artifactKind, relativePath, status: "PRESENT_VALID", retry: "recovery-required-after-reread" };
}

describe("target project pending-artifact ownership", () => {
  it("blocks only target-owned project pending artifacts", () => {
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [
      artifact("project-pending", "projects/broken-reference-ui-lifecycle/project.deadbeef.pending"),
    ] }, targetProjectId)).toBe(true);
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [
      artifact("project-pending", "projects/other-project/project.deadbeef.pending"),
    ] }, targetProjectId)).toBe(false);
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [
      artifact("workspace-index-pending", "./workspace-index.deadbeef.pending"),
    ] }, targetProjectId)).toBe(false);
  });

  it("does not confuse near-prefix or malformed project IDs with the target", () => {
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [
      artifact("project-pending", "projects/broken-reference-ui-lifecycle-copy/project.deadbeef.pending"),
    ] }, targetProjectId)).toBe(false);
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [
      artifact("project-pending", "projects/broken-reference-ui-lifecycle/project.deadbeef.pending"),
    ] }, "dbx:project:../broken-reference-ui-lifecycle")).toBe(false);
    expect(hasTargetProjectPendingArtifact({ pendingArtifacts: [] }, targetProjectId)).toBe(false);
  });
});
