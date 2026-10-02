import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ascendancySignalRuneCandidateScopeGateSchema,
  createAscendancySignalRuneCandidateScopeGate,
  createAscendancySignalRuneFreshSceneCandidatePreview,
} from "@dicebox/compiler";

const packageObservation = {
  packageSha256: "2F257477F02AAC0A60B01D6C0AEFEF738484BE5C437A708BD293945CCF90645F",
  installerSha256: "FFFB439942619C5AFFC10E5AB74B43EF9AA3107C989F1551FF5CFCE2E7C5BC83",
  campaignRooms: [
    "dbx:room:signal-frequency-chamber",
    "dbx:room:ascendancy-tram-depot",
    "dbx:room:rune-mechanism-chamber",
    "dbx:room:central-core-control-chamber",
  ],
  assetStates: {
    "dbx:room:signal-frequency-chamber": "scene-bound/path-present",
    "dbx:room:rune-mechanism-chamber": "scene-bound/path-present",
    "dbx:room:ascendancy-tram-depot": "final-map-required/path-null",
    "dbx:room:central-core-control-chamber": "final-map-required/path-null",
  },
  mutation: "disabled-until-exact-runtime-gate",
} as const;

const installerObservation = {
  currentScope: "four-room-campaign-path",
  loadPackage: "rejects any incomplete asset before installation",
  installOperation: "loops over packageData.campaign.rooms with no candidate selector",
  repairOperation: "loops over packageData.campaign.rooms with no candidate selector",
  candidateSpecificTransport: "absent",
} as const;

function input() {
  return {
    candidatePreview: createAscendancySignalRuneFreshSceneCandidatePreview(),
    packageObservation,
    installerObservation,
  } as const;
}

describe("M1156 strict Signal/Rune candidate-scope gate", () => {
  it("accepts the exact candidate and fail-closes the four-room transport mismatch", () => {
    const gate = createAscendancySignalRuneCandidateScopeGate(input());
    expect(gate).toMatchObject({
      status: "BLOCKED",
      evidenceClass: "local",
      candidateScope: {
        candidatePlanId: "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview",
        candidateRooms: ["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"],
        excludedRooms: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
        excludedRuntimeScenes: ["AneddhKAAfk5HlsA", "p9Mbi0CJWe9KvJhH"],
        foreignState: "preserve",
        candidateSpecificTransport: "required",
      },
      gates: {
        candidateIdentity: "pass",
        foreignScenePreservation: "pass",
        packageScope: "blocked-four-room-campaign-path",
        candidateSpecificTransport: "blocked-absent",
        incompleteExcludedRoomAssets: "blocking-current-loader",
      },
      blockers: [
        "candidate-specific-installer-transport-absent",
        "incomplete-excluded-room-assets-block-current-loader",
        "four-room-installer-scope-not-narrowable",
      ],
      preserveUnknown: true,
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      proposal: "not-created",
      dispatch: "disabled",
      readyClaim: false,
    });
    expect(ascendancySignalRuneCandidateScopeGateSchema.parse(gate)).toEqual(gate);
  });

  it("rejects candidate, room-order, and foreign-scene drift before producing a gate", () => {
    const base = input();
    expect(() => createAscendancySignalRuneCandidateScopeGate({
      ...base,
      candidatePreview: { ...base.candidatePreview, planId: "dbx:plan:foreign" },
    })).toThrow();
    expect(() => createAscendancySignalRuneCandidateScopeGate({
      ...base,
      candidatePreview: { ...base.candidatePreview, rooms: [...base.candidatePreview.rooms].reverse() },
    })).toThrow();
    expect(() => createAscendancySignalRuneCandidateScopeGate({
      ...base,
      candidatePreview: {
        ...base.candidatePreview,
        excludedRuntimeScenes: [base.candidatePreview.excludedRuntimeScenes[0]!, { ...base.candidatePreview.excludedRuntimeScenes[1]!, sceneIdRuntime: "foreign" }],
      },
    })).toThrow();
  });

  it("rejects package or installer evidence drift instead of widening scope", () => {
    const base = input();
    expect(() => createAscendancySignalRuneCandidateScopeGate({
      ...base,
      packageObservation: { ...base.packageObservation, campaignRooms: [...base.packageObservation.campaignRooms].slice(0, 2) },
    })).toThrow();
    expect(() => createAscendancySignalRuneCandidateScopeGate({
      ...base,
      installerObservation: { ...base.installerObservation, candidateSpecificTransport: "selector-present" },
    })).toThrow();
  });

  it("has no runtime or native-payload surface", () => {
    const source = readFileSync(resolve(import.meta.dirname, "../packages/dicebox-compiler/src/ascendancy-signal-rune-candidate-scope-gate.ts"), "utf8");
    expect(source).not.toContain("game.");
    expect(source).not.toContain("fromUuid");
    expect(source).not.toContain("createEmbeddedDocuments");
    expect(source).not.toContain("updateEmbeddedDocuments");
    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("RuntimeBinding");
  });
});
