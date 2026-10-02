import { describe, expect, it } from "vitest";
// @ts-expect-error The Foundry browser entry intentionally has no local Foundry type dependency.
import { beginPersistentWorldWriteAccounting, endPersistentWorldWriteAccounting, failPersistentWorldNativeWrite, finishPersistentWorldNativeWrite, readPersistentWorldWriteAccounting, startPersistentWorldNativeWrite } from "../packages/dicebox-foundry/src/persistent-world-write-accounting.js";

function runtime() {
  return {
    game: {
      version: "14.367",
      system: { id: "dnd5e", version: "5.3.3" },
      user: { id: "gm", isGM: true },
      users: { activeGM: { id: "gm" } },
    },
  };
}

describe("M1186 persistent-world native-write accounting", () => {
  it("opens only for the exact target and elected active GM", () => {
    const exact = runtime();
    expect(beginPersistentWorldWriteAccounting(exact)).toMatchObject({ status: "OPEN", candidateId: "m1141-signal-rune" });
    expect(endPersistentWorldWriteAccounting(exact)).toMatchObject({ status: "BLOCKED", nativeWriteCalls: 0 });

    const wrongTarget = runtime();
    wrongTarget.game.version = "14.366";
    expect(beginPersistentWorldWriteAccounting(wrongTarget)).toMatchObject({ status: "BLOCKED", noWrite: true, observedMutation: false });

    const nonActiveGm = runtime();
    nonActiveGm.game.user.id = "other";
    expect(beginPersistentWorldWriteAccounting(nonActiveGm)).toMatchObject({ status: "BLOCKED", noWrite: true, observedMutation: false });
  });

  it("records only the fixed adapter-owned native calls and keeps persistence unclaimed", () => {
    const target = runtime();
    expect(beginPersistentWorldWriteAccounting(target).status).toBe("OPEN");
    const scene = startPersistentWorldNativeWrite(target, { method: "Scene.create", documentType: "Scene", semanticId: "dbx:room:signal-frequency-chamber" });
    finishPersistentWorldNativeWrite(target, scene);
    const walls = startPersistentWorldNativeWrite(target, { method: "Scene.createEmbeddedDocuments", documentType: "Wall", semanticId: "dbx:room:signal-frequency-chamber" });
    finishPersistentWorldNativeWrite(target, walls, { count: 6 });
    const receipt = endPersistentWorldWriteAccounting(target, { operationPhase: "ascendancy.signal-rune-candidate.create" });
    expect(receipt).toMatchObject({
      status: "OBSERVED",
      noWrite: true,
      observedMutation: true,
      nativeWriteCalls: 2,
      nativeWriteCallsResolved: 2,
      persistenceClaim: "not-claimed-by-write-accounting",
      readyClaim: false,
    });
    expect(receipt.records[1]).toMatchObject({ documentType: "Wall", documentCount: 6, outcome: "resolved" });
    expect(readPersistentWorldWriteAccounting(target)).toEqual(receipt);
  });

  it("stops with unknown status when a native outcome fails", () => {
    const target = runtime();
    beginPersistentWorldWriteAccounting(target);
    const record = startPersistentWorldNativeWrite(target, { method: "Scene.create", documentType: "Scene", semanticId: "dbx:room:rune-mechanism-chamber" });
    failPersistentWorldNativeWrite(target, record, new Error("native result unavailable"));
    const receipt = endPersistentWorldWriteAccounting(target);
    expect(receipt).toMatchObject({ status: "UNKNOWN", nativeWriteCallsUnknown: 1, readyClaim: false });
    expect(receipt.records[0]).toMatchObject({ outcome: "unknown", error: "native result unavailable" });
  });
});
