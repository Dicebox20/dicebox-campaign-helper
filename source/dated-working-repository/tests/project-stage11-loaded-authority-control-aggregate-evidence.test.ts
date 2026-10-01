import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  createProjectStage11LoadedAuthorityControlAggregateEvidence,
} from "../apps/campaign-helper-desktop/src/project-stage11-loaded-authority-control-aggregate-evidence";

const receipt = JSON.parse(readFileSync("outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json", "utf8")) as Record<string, any>;

describe("M953 loaded authority-control aggregate evidence", () => {
  it("attaches the exact M952 loaded-control observation without authority promotion", () => {
    expect(createProjectStage11LoadedAuthorityControlAggregateEvidence(receipt)).toEqual({
      schemaVersion: "0.1.0",
      milestone: "M953",
      sourceMilestone: "M952",
      evidenceLabel: "local",
      receipt: "outputs/m952-stage11-exact-v4-loaded-module-authority-control-observation-closure-receipt.json",
      operation: "dicebox.foundry.loaded-authority-controls",
      target: {
        worldId: "dbx-test-world",
        foundryVersion: "14.367",
        systemId: "dnd5e",
        systemVersion: "5.3.3",
        port: 30003,
      },
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
      foreignStatePreserved: true,
      readOnly: true,
      nonCertifying: true,
      aggregateAttachment: "one-loaded-authority-control-producer-scoped-non-certifying",
      aggregateAuthority: "not-granted",
      cleanShutdown: true,
      countsChanged: false,
      playerPasswordEntered: false,
      readyClaim: false,
      stage11AcceptanceStatus: "blocked",
      stage12Started: false,
    });
  });

  it("rejects altered runtime facts, targets, and unknown fields", () => {
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      diagnostics: {
        ...receipt.diagnostics,
        currentActiveGm: { ...receipt.diagnostics.currentActiveGm, currentUserIsGm: false },
      },
    })).toThrow(/currentActiveGm diagnostic\.currentUserIsGm/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      diagnostics: {
        ...receipt.diagnostics,
        ownedScenePermission: { ...receipt.diagnostics.ownedScenePermission, ownedSceneCanUpdate: false },
      },
    })).toThrow(/ownedScenePermission diagnostic\.ownedSceneCanUpdate/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      target: { ...receipt.target, worldId: "foreign-world" },
    })).toThrow(/target\.worldId/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({ ...receipt, foreignField: true })).toThrow(/unknown or missing/);
  });

  it("rejects writes, passwords, authority promotion, count changes, and readiness claims", () => {
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, documentUpdateInvoked: true },
    })).toThrow(/documentUpdateInvoked/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, playerPasswordEntered: true },
    })).toThrow(/playerPasswordEntered/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, authorityPromoted: true },
    })).toThrow(/authorityPromoted/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, readyClaim: true },
    })).toThrow(/readyClaim/);
    expect(() => createProjectStage11LoadedAuthorityControlAggregateEvidence({
      ...receipt,
      limits: { ...receipt.limits, stage12Started: true },
    })).toThrow(/stage12Started/);
  });
});
