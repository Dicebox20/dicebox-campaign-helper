import { describe, expect, it } from "vitest";
import { createBridgeApi } from "@dicebox/bridge";
import { createManagedJournalEntrySpec } from "@dicebox/compiler";
import { ActiveEffectApiEvidenceSchema, ActivityApiEvidenceSchema, JournalApiEvidenceSchema, OptionalModuleApiEvidenceSchema, ReadinessCertificateSchema, RegionBehaviorApiEvidenceSchema, StateStoreSelectionPlanSchema, createStableDiceBoxId } from "@dicebox/core";

describe("M0 bridge readiness gate", () => {
  it("exposes only a safe-mode contract before runtime probing", async () => {
    const api = createBridgeApi();

    expect(api.describe()).toMatchObject({
      packageId: "dicebox-campaign-helper",
      phase: "m0",
      mutationEnabled: false,
    });
    expect(api.health()).toMatchObject({ status: "safe-mode", ready: false });
    expect(api.supports("foundry.document.write").state).toBe("unavailable");
    const execution = await api.execute({ kind: "noop" });
    expect(execution.ok).toBe(false);
    if (!execution.ok) expect(execution.error.code).toBe("NOT_READY");
  });

  it("permits read-only health and capability queries", async () => {
    const api = createBridgeApi();
    const health = await api.query({ kind: "health" });
    const capabilities = await api.query({ kind: "capabilities" });
    const profile = await api.query({ kind: "runtime-profile" });
    const evidence = await api.query({ kind: "runtime-evidence" });
    const snapshot = await api.query({ kind: "managed-journal-snapshot" });
    const journalApi = await api.query({ kind: "journal-api-evidence" });
    const activityApi = await api.query({ kind: "activity-api-evidence" });
    const activeEffectApi = await api.query({ kind: "active-effect-api-evidence" });
    const regionBehaviorApi = await api.query({ kind: "region-behavior-api-evidence" });
    const optionalModuleApi = await api.query({ kind: "optional-module-api-evidence" });
    const stateStorePlan = await api.query({ kind: "state-store-plan" });
    const certificate = await api.query({ kind: "readiness-certificate" });

    expect(health.ok).toBe(true);
    expect(capabilities.ok).toBe(true);
    if (health.ok && "ready" in health.value) expect(health.value.ready).toBe(false);
    if (capabilities.ok && Array.isArray(capabilities.value)) expect(capabilities.value.length).toBeGreaterThan(0);
    expect(profile.ok).toBe(true);
    if (profile.ok && "phase" in profile.value) expect(profile.value.phase).toBe("m0");
    expect(evidence.ok).toBe(true);
    if (evidence.ok && "runtimeFingerprint" in evidence.value) {
      expect(evidence.value.runtimeFingerprint.exactTargetMatch).toBe(false);
      expect(evidence.value.probeReceipt.noWrite).toBe(true);
      expect(evidence.value.probeReceipt.source).toBe("fixture");
      expect(evidence.value.activeGm).toMatchObject({ status: "unknown", source: "fixture" });
      expect(evidence.value.managedJournalSnapshot).toMatchObject({ status: "unavailable", documents: [] });
    }
    expect(snapshot.ok).toBe(true);
    if (snapshot.ok && "status" in snapshot.value) {
      expect(snapshot.value).toMatchObject({ status: "unavailable", documents: [] });
    }
    expect(journalApi.ok).toBe(true);
    if (journalApi.ok && "surfaces" in journalApi.value) {
      expect(JournalApiEvidenceSchema.parse(journalApi.value).status).toBe("unavailable");
    }
    expect(activityApi.ok).toBe(true);
    if (activityApi.ok && "surfaces" in activityApi.value) {
      expect(ActivityApiEvidenceSchema.parse(activityApi.value).status).toBe("unavailable");
    }
    expect(activeEffectApi.ok).toBe(true);
    if (activeEffectApi.ok && "surfaces" in activeEffectApi.value) {
      expect(ActiveEffectApiEvidenceSchema.parse(activeEffectApi.value).status).toBe("unavailable");
    }
    expect(regionBehaviorApi.ok).toBe(true);
    if (regionBehaviorApi.ok && "surfaces" in regionBehaviorApi.value) {
      expect(RegionBehaviorApiEvidenceSchema.parse(regionBehaviorApi.value).status).toBe("unavailable");
    }
    expect(optionalModuleApi.ok).toBe(true);
    if (optionalModuleApi.ok && "surfaces" in optionalModuleApi.value) {
      expect(OptionalModuleApiEvidenceSchema.parse(optionalModuleApi.value).status).toBe("unavailable");
    }
    expect(stateStorePlan.ok).toBe(true);
    if (stateStorePlan.ok && "migration" in stateStorePlan.value) {
      expect(StateStoreSelectionPlanSchema.parse(stateStorePlan.value)).toMatchObject({
        status: "blocked",
        noWrite: true,
        migration: { status: "blocked", noWrite: true },
      });
    }
    expect(certificate.ok).toBe(true);
    if (certificate.ok && "certificate" in certificate.value) {
      expect(ReadinessCertificateSchema.parse(certificate.value.certificate)).toMatchObject({
        status: "blocked",
        evidenceClass: "deterministic",
        noWrite: true,
        summary: { total: 6 },
      });
      expect(certificate.value.certificate.blockers.some((entry) => entry.laneId === "exact-runtime")).toBe(true);
    }
  });

  it("exposes a blocked, read-only document preview through the program bridge", () => {
    const api = createBridgeApi();
    const preview = api.previewDocument(createManagedJournalEntrySpec({
      planId: createStableDiceBoxId("plan", "bridge-preview"),
      semantic: { id: createStableDiceBoxId("journal", "bridge-preview"), kind: "journal" },
      operation: "create",
      title: "Bridge preview",
      content: "Preview only",
    }), { authority: "gm", observedAt: "2026-08-21T01:00:00.000Z" });

    expect(preview.review.status).toBe("blocked");
    expect(preview.receipt.status).toBe("previewed");
  });
});
