import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { applySceneCommand, projectScene, validateSceneDocument } from "@dicebox/scene";
import { fixtureScene } from "../apps/campaign-helper-desktop/src/fixture-scene";
import { inspectDesktopAlignmentRelationship, type DesktopProposalSession } from "../apps/campaign-helper-desktop/src/proposal-session";

describe("Campaign Helper desktop semantic fixture", () => {
  it("projects one valid stable-ID document into both renderer views", () => {
    expect(validateSceneDocument(fixtureScene)).toEqual([]);
    const mainProjection = projectScene(fixtureScene);
    const previewProjection = projectScene(fixtureScene);
    expect(previewProjection).toEqual(mainProjection);
    expect(mainProjection.every((entity) => entity.layer === "semantic")).toBe(true);
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
    expect(source).toContain('id="semantic-entity-create"');
    expect(source).toContain('id="semantic-entity-id"');
    expect(source).toContain('id="semantic-entity-layer"');
    expect(source).toContain('layer: layerValue as SceneLayer');
    expect(source).toContain('kind: "create-entity"');
    expect(source).toContain('createHumanDesktopProposalSession');
    expect(source).toContain('id="semantic-entity-rename"');
    expect(source).toContain('id="semantic-entity-rename-name"');
    expect(source).toContain('kind: "rename-entity"');
    expect(source).toContain('id="semantic-entity-layer-set"');
    expect(source).toContain('kind: "set-layer"');
    expect(source).toContain('Human semantic layer reassignment preview persisted; Scene content unchanged until explicit approval and Apply.');
    expect(source).toContain('id="semantic-entity-color-set"');
    expect(source).toContain('kind: "set-display-color"');
    expect(source).toContain('Human semantic display-color reassignment preview persisted; Scene content unchanged until explicit approval and Apply.');
    expect(source).toContain('id="semantic-relationship-create"');
    expect(source).toContain('id="semantic-relationship-from"');
    expect(source).toContain('id="semantic-relationship-to"');
    expect(source).toContain('id="semantic-relationship-axis"');
    expect(source).toContain('kind: "add-relationship"');
    expect(source).toContain('Human semantic alignment relationship preview persisted; Scene content unchanged until explicit approval and Apply.');
    expect(source).toContain('id="semantic-relationship-remove"');
    expect(source).toContain('kind: "remove-relationship"');
    expect(source).toContain('Human semantic align relationship removal preview persisted; Scene content unchanged until explicit approval and Apply.');
    expect(source).toContain('aria-label="Semantic alignment relationship review details"');
    expect(source).toContain('directorAlignmentRelationshipReview.relationId');
    expect(source).toContain('id="scene-relationships-heading"');
    expect(source).toContain('aria-label="Current Scene relationships"');
    expect(source).toContain('id="scene-relationships-empty"');
    expect(source).toContain('relationship.fromEntityId} → {relationship.toEntityId');
    expect(source).toContain('document.relationships.map((relationship)');
    expect(source).toContain('window.addEventListener("keydown"');
  });

  it("fails closed unless the reviewed payload is one exact align relationship", () => {
    const sessionFor = (payload: Record<string, unknown>, kind = "scene.add-relationship") => ({
      batch: { commands: [{ kind, payload }] },
    } as unknown as DesktopProposalSession);
    expect(inspectDesktopAlignmentRelationship(sessionFor({
      kind: "add-relationship",
      relationship: {
        relationId: "dbx:relation:core-puzzle-align",
        kind: "align",
        fromEntityId: "dbx:apparatus:core",
        toEntityId: "dbx:region:puzzle",
        axis: "center",
      },
    }))).toEqual({
      relationId: "dbx:relation:core-puzzle-align",
      fromEntityId: "dbx:apparatus:core",
      toEntityId: "dbx:region:puzzle",
      axis: "center",
    });
    expect(inspectDesktopAlignmentRelationship(sessionFor({
      kind: "add-relationship",
      relationship: {
        relationId: "dbx:relation:invalid",
        kind: "align",
        fromEntityId: "dbx:region:puzzle",
        toEntityId: "dbx:region:puzzle",
        axis: "center",
      },
    }))).toBeNull();
    expect(inspectDesktopAlignmentRelationship(sessionFor({ kind: "rename-entity" }, "scene.rename-entity"))).toBeNull();
  });
});
