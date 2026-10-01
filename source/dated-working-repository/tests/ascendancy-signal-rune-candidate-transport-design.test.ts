import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  ascendancySignalRuneCandidateTransportDesignSchema,
  createAscendancySignalRuneCandidateScopeGate,
  createAscendancySignalRuneCandidateTransportDesign,
  createAscendancySignalRuneFreshSceneCandidatePreview,
} from "@dicebox/compiler";

const packageObservation = {
  packageSha256: "2F257477F02AAC0A60B01D6C0AEFEF738484BE5C437A708BD293945CCF90645F",
  installerSha256: "FFFB439942619C5AFFC10E5AB74B43EF9AA3107C989F1551FF5CFCE2E7C5BC83",
  campaignRooms: ["dbx:room:signal-frequency-chamber", "dbx:room:ascendancy-tram-depot", "dbx:room:rune-mechanism-chamber", "dbx:room:central-core-control-chamber"],
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

function gate() {
  return createAscendancySignalRuneCandidateScopeGate({
    candidatePreview: createAscendancySignalRuneFreshSceneCandidatePreview(),
    packageObservation,
    installerObservation,
  });
}

describe("M1157 Signal/Rune candidate transport design", () => {
  it("specifies fixed allowlisted selection before loader and install loops", () => {
    const design = createAscendancySignalRuneCandidateTransportDesign({ candidateGate: gate() });
    expect(design).toMatchObject({
      status: "BLOCKED",
      candidateScope: {
        candidatePlanId: "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview",
        candidateRooms: ["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"],
        excludedRuntimeScenes: ["AneddhKAAfk5HlsA", "p9Mbi0CJWe9KvJhH"],
        foreignState: "preserve",
      },
      transportDesign: {
        selector: "fixed-candidate-id:m1141-signal-rune",
        selectionPolicy: "filter-before-loader-and-install-loop",
        loaderPrecondition: "validate-selected-assets-only-after-exact-selector",
        currentLoaderDisposition: "rejects-incomplete-assets-before-selection",
        installLoopPolicy: "iterate-selected-room-set-only",
        repairLoopPolicy: "preflight-and-iterate-selected-room-set-only",
        foreignScenePolicy: "preserve-and-never-adopt",
        unknownRoomPolicy: "reject-before-runtime",
        implementationStatus: "specified-not-implemented",
      },
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      proposal: "not-created",
      dispatch: "disabled",
      readyClaim: false,
    });
    expect(ascendancySignalRuneCandidateTransportDesignSchema.parse(design)).toEqual(design);
  });

  it("rejects a non-M1156 gate or any widened selector contract", () => {
    expect(() => createAscendancySignalRuneCandidateTransportDesign({
      candidateGate: { ...gate(), candidateScope: { ...gate().candidateScope, candidateSpecificTransport: "available" } },
    })).toThrow();
    const source = readFileSync(resolve(import.meta.dirname, "../packages/dicebox-compiler/src/ascendancy-signal-rune-candidate-transport-design.ts"), "utf8");
    expect(source).not.toContain("installAscendancyCampaign");
    expect(source).not.toContain("repairAscendancyCampaign");
    expect(source).not.toContain("game.");
    expect(source).not.toContain("fetch(");
  });
});
