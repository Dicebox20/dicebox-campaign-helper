import { describe, expect, it } from "vitest";
import { createAscendancySignalRuneFreshSceneCandidatePreview } from "@dicebox/compiler";

describe("M1141 foreign-Scene-preserving fresh-Scene candidate preview", () => {
  it("describes only fresh Signal/Rune candidates and preserves existing foreign Scenes", () => {
    const result = createAscendancySignalRuneFreshSceneCandidatePreview();
    expect(result).toMatchObject({
      operation: "dicebox.ascendancy.signal-rune.fresh-scene-candidate.preview",
      status: "PREVIEWED",
      noWrite: true,
      apply: false,
      approvalRequired: true,
      authoritativeRereadRequired: true,
      foreignState: "preserve",
      runtimeBinding: "not-created",
      payload: "not-materialized",
      dispatch: "disabled",
      readyClaim: false,
      excludedRooms: ["dbx:room:ascendancy-tram-depot", "dbx:room:central-core-control-chamber"],
    });
    expect(result.rooms.map((room) => room.roomId)).toEqual([
      "dbx:room:signal-frequency-chamber",
      "dbx:room:rune-mechanism-chamber",
    ]);
    expect(result.rooms.map((room) => room.existingRuntimeScene)).toEqual([
      { sceneIdRuntime: "AneddhKAAfk5HlsA", disposition: "foreign-existing-scene-preserved", adoption: "excluded" },
      { sceneIdRuntime: "p9Mbi0CJWe9KvJhH", disposition: "foreign-existing-scene-preserved", adoption: "excluded" },
    ]);
    expect(result.rooms.every((room) => room.operations.length === 10)).toBe(true);
    expect(result.rooms.flatMap((room) => room.operations).every((operation) => (
      operation.previewOnly
      && operation.approvalRequired
      && operation.authoritativeRereadRequired
      && operation.runtimeBinding === "not-created"
      && operation.payload === "not-materialized"
      && operation.dispatch === "disabled"
    ))).toBe(true);
  });

  it("uses reviewed blueprint/region/furnishing counts without materializing native payload", () => {
    const result = createAscendancySignalRuneFreshSceneCandidatePreview();
    for (const room of result.rooms) {
      expect(room.operations.find((operation) => operation.documentType === "Scene")).toMatchObject({ count: 1, operation: "create-candidate" });
      expect(room.operations.find((operation) => operation.documentType === "Level")).toMatchObject({ count: 1, operation: "update-candidate" });
      expect(room.operations.find((operation) => operation.documentType === "Wall")?.count).toBe(6);
      expect(room.operations.find((operation) => operation.documentType === "Region")?.count).toBe(6);
      expect(room.operations.filter((operation) => ["Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note"].includes(operation.documentType)).map((operation) => operation.documentType)).toEqual([
        "Tile", "Token", "AmbientLight", "AmbientSound", "Drawing", "Note",
      ]);
    }
    expect(JSON.stringify(result)).not.toContain('"uuid"');
    expect(JSON.stringify(result)).not.toContain('"documentId"');
    expect(JSON.stringify(result)).not.toContain('"generation"');
  });

  it("has no Tram/Core candidate rooms or caller-selected runtime target input", () => {
    const source = createAscendancySignalRuneFreshSceneCandidatePreview.toString();
    expect(source).not.toContain("game.");
    expect(source).not.toContain("fromUuid");
    expect(source).not.toContain("createEmbeddedDocuments");
    expect(source).not.toContain("updateEmbeddedDocuments");
    const result = createAscendancySignalRuneFreshSceneCandidatePreview();
    expect(result.rooms.map((room) => room.roomId)).not.toContain("dbx:room:ascendancy-tram-depot");
    expect(result.rooms.map((room) => room.roomId)).not.toContain("dbx:room:central-core-control-chamber");
  });
});
