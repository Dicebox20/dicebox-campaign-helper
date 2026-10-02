import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneFreshSceneApprovalEnvelope } from "@dicebox/compiler";

describe("M1177 fixed Signal/Rune fresh-Scene approval envelope", () => {
  it("replays only the reviewed M1141 candidates and keeps approval/apply separate", () => {
    const envelope = createAscendancySignalRuneFreshSceneApprovalEnvelope();
    expect(envelope).toEqual({
      schemaVersion: "0.1.0",
      operation: "dicebox.ascendancy.signal-rune.fresh-scene-candidate.approval",
      planId: "dbx:plan:m1141-signal-rune-fresh-scene-candidate-preview",
      status: "APPROVAL_REQUIRED",
      candidateRoomIds: ["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"],
      excludedRoomIds: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
      candidateOperationCount: 20,
      approvalRequired: true,
      authoritativeRereadRequired: true,
      foreignStatePreservationRequired: true,
      noWrite: true,
      apply: false,
      runtimeBinding: "not-created",
      payload: "not-materialized",
      dispatch: "disabled",
      mutation: "disabled-until-exact-runtime-gate",
      readyClaim: false,
    });
  });

  it("cannot silently expand into Tram/Core or an execution path", () => {
    const envelope = createAscendancySignalRuneFreshSceneApprovalEnvelope();
    expect(envelope.candidateRoomIds).not.toContain("dbx:room:ascendancy-tram-depot");
    expect(envelope.candidateRoomIds).not.toContain("dbx:room:central-core-control-chamber");
    expect(envelope.apply).toBe(false);
    expect(envelope.runtimeBinding).toBe("not-created");
    expect(envelope.payload).toBe("not-materialized");
    expect(envelope.dispatch).toBe("disabled");
  });
});
