import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneNativeDocumentPreview } from "@dicebox/compiler";

const runtime = { foundryVersion: "14.367", systemId: "dnd5e", systemVersion: "5.3.3", activeGm: true, sceneBindings: { signal: "AneddhKAAfk5HlsA", rune: "p9Mbi0CJWe9KvJhH" } } as const;
describe("M1115 fixed Signal/Rune native-document preview", () => {
  it("exposes only two approval-required no-write room intents", () => {
    const plan = createAscendancySignalRuneNativeDocumentPreview(runtime);
    expect(plan).toMatchObject({ noWrite: true, apply: false, approvalRequired: true, authoritativeRereadRequired: true });
    expect(plan.rooms.map((room) => room.roomId)).toEqual(["dbx:room:signal-frequency-chamber", "dbx:room:rune-mechanism-chamber"]);
    expect(plan.rooms.flatMap((room) => room.documents.map((document) => document.kind))).toEqual(["scene-renderer", "wall", "region", "tile", "token", "ambientLight", "ambientSound", "drawing", "note", "scene-renderer", "wall", "region", "tile", "token", "ambientLight", "ambientSound", "drawing", "note"]);
    expect(plan.excluded).toHaveLength(2);
    expect(plan).not.toHaveProperty("applyPlan");
  });
  it("fails closed on target, active-GM, or binding drift", () => {
    expect(() => createAscendancySignalRuneNativeDocumentPreview({ ...runtime, foundryVersion: "14.366" } as never)).toThrow();
    expect(() => createAscendancySignalRuneNativeDocumentPreview({ ...runtime, activeGm: false } as never)).toThrow();
    expect(() => createAscendancySignalRuneNativeDocumentPreview({ ...runtime, sceneBindings: { ...runtime.sceneBindings, signal: "other" } } as never)).toThrow();
  });
});
