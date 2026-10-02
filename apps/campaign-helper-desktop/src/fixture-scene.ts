import type { SceneDocument } from "@dicebox/scene";

export const fixtureScene: SceneDocument = {
  schemaVersion: "0.1.0",
  revision: 0,
  id: "dbx:scene:desktop-shell-fixture",
  name: "Semantic Scene Fixture",
  width: 1536,
  height: 1024,
  background: { color: 0x111827, gridSize: 64 },
  entities: [
    { id: "dbx:room:main", kind: "room", name: "Main chamber", x: 120, y: 100, width: 1296, height: 824, color: 0x263448, locked: true },
    { id: "dbx:door:north", kind: "door", name: "North entrance", x: 688, y: 72, width: 160, height: 56, color: 0xf59e0b, locked: true },
    { id: "dbx:apparatus:core", kind: "apparatus", name: "Puzzle apparatus", x: 608, y: 376, width: 320, height: 272, color: 0x7c3aed, locked: false },
    { id: "dbx:region:entry", kind: "region", name: "Entry Region", x: 608, y: 128, width: 320, height: 144, color: 0x22d3ee, locked: false },
    { id: "dbx:region:puzzle", kind: "region", name: "Puzzle Region", x: 544, y: 312, width: 448, height: 400, color: 0xf472b6, locked: false },
  ],
};
