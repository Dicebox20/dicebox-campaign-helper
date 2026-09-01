import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { applySceneCommand, projectScene, validateSceneDocument } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";

describe("Campaign Helper desktop semantic fixture", () => {
  it("projects one valid stable-ID document into both renderer views", () => {
    expect(validateSceneDocument(fixtureScene)).toEqual([]);
    const mainProjection = projectScene(fixtureScene);
    const previewProjection = projectScene(fixtureScene);
    expect(previewProjection).toEqual(mainProjection);
    expect(new Set(mainProjection.map((entity) => entity.id)).size).toBe(mainProjection.length);
  });

  it("routes a human translation through the versioned typed command path", () => {
    const next = applySceneCommand(fixtureScene, {
      schemaVersion: "0.1.0",
      kind: "translate-entity",
      commandId: "test-human-1",
      baseRevision: 0,
      entityId: "dbx:apparatus:core",
      deltaX: 8,
      deltaY: -8,
      origin: { kind: "human", principalId: "test-user", reason: "Desktop nudge" },
    });
    expect(next.document.entities.find((entity) => entity.id === "dbx:apparatus:core")).toMatchObject({ x: 616, y: 368 });
    expect(fixtureScene.entities.find((entity) => entity.id === "dbx:apparatus:core")).toMatchObject({ x: 608, y: 376 });
    expect(next.receipt).toMatchObject({ beforeRevision: 0, afterRevision: 1, origin: { kind: "human" } });
  });

  it("rejects movement of fixture-locked geometry", () => {
    expect(() => applySceneCommand(fixtureScene, {
      schemaVersion: "0.1.0",
      kind: "translate-entity",
      commandId: "test-ai-locked",
      baseRevision: 0,
      entityId: "dbx:door:north",
      deltaX: 8,
      deltaY: 0,
      origin: { kind: "ai-fixture", principalId: "test-ai", reason: "Lock validation" },
    })).toThrow("locked by the Scene contract");
  });

  it("keeps an accessible DOM path beside the canvas", () => {
    const source = readFileSync(resolve(import.meta.dirname, "..", "apps", "campaign-helper-desktop", "src", "App.tsx"), "utf8");
    expect(source).toContain('aria-label="Scene inspector"');
    expect(source).toContain('aria-label="Preview moving selected object up"');
    expect(source).toContain('id="entity-select"');
    expect(source).toContain('window.addEventListener("keydown"');
  });
});
