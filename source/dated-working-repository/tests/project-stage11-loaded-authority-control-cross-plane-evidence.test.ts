import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11LoadedAuthorityControlCrossPlaneEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-loaded-authority-control-cross-plane-evidence";

const receipt = JSON.parse(readFileSync("outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json", "utf8")) as Record<string, any>;

describe("M955 loaded authority-control cross-plane evidence", () => {
  it("binds M952 through M953 as supplemental current-authority evidence", () => {
    expect(createProjectStage11LoadedAuthorityControlCrossPlaneEvidence(receipt)).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M955",
      sourceMilestone: "M952",
      sourceAggregateMilestone: "M953",
      evidenceLabel: "local",
      receipt: "outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json",
      operation: "dicebox.foundry.loaded-authority-controls",
      target: { worldId: "dbx-test-world", foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", port: 30003 },
      currentUserIsGm: true,
      currentUserMatchesActiveGm: true,
      ownedSceneCanUpdate: true,
      controlsObserved: 2,
      moduleExecutionObserved: true,
      noWrite: true,
      noUpdateInvoked: true,
      noGenericAuthorityClaim: true,
      noExecutionAuthority: true,
      noAuthorityGrant: true,
      noFoundryWrite: true,
      producerScopedOnly: true,
      supplementalOnly: true,
      preservesExistingAuthorityPlanes: true,
      foreignStatePreserved: true,
      readOnly: true,
      nonCertifying: true,
      aggregateAttachment: "supplemental-loaded-authority-control-cross-plane-binding",
      currentAuthority: "partial",
      aggregateAuthority: "not-granted",
      countsChanged: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
  });

  it("fails closed through the exact M952 validator and preserves the no-authority boundary", () => {
    expect(() => createProjectStage11LoadedAuthorityControlCrossPlaneEvidence({
      ...receipt,
      diagnostics: { ...receipt.diagnostics, ownedScenePermission: { ...receipt.diagnostics.ownedScenePermission, noUpdateInvoked: false } },
    })).toThrow(/noUpdateInvoked/);
    expect(() => createProjectStage11LoadedAuthorityControlCrossPlaneEvidence({
      ...receipt,
      limits: { ...receipt.limits, authorityPromoted: true },
    })).toThrow(/authorityPromoted/);
    expect(() => createProjectStage11LoadedAuthorityControlCrossPlaneEvidence({
      ...receipt,
      limits: { ...receipt.limits, playerPasswordEntered: true },
    })).toThrow(/playerPasswordEntered/);
  });
});
