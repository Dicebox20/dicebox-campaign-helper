import { validateSceneDocument, type SceneDocument, type SceneEntity } from "@dicebox/scene";

export type ProjectAssetReference = Readonly<{
  sha256: string;
  mediaType: string;
  byteLength: number;
  relativePath: string;
  registration?: Readonly<{
    assetId: string;
    role: "background" | "handout" | "audio" | "token";
    label: string;
    provenance: string;
    approval: "approved";
  }>;
}>;

export type FoundryDocumentCandidate = Readonly<{
  stableId: string;
  documentType: "Scene" | "Level" | "Wall" | "Region" | "Tile";
  operation: "create-candidate" | "update-candidate";
  parentStableId: string | null;
  foundryApi: string;
  runtimeId: null;
  data: Readonly<Record<string, unknown>>;
  ownership: Readonly<{
    moduleId: "dicebox-campaign-helper";
    stableId: string;
  }>;
}>;

export type SceneFoundryPreview = Readonly<{
  schemaVersion: "0.1.0";
  operation: "dicebox.scene.compile-foundry-preview";
  projectId: string;
  sceneId: string;
  sourceRevision: number;
  target: Readonly<{
    foundryVersion: "14.367";
    systemId: "dnd5e";
    systemVersion: "5.3.3";
  }>;
  documents: readonly FoundryDocumentCandidate[];
  preservation: Readonly<{
    foreign: "preserve";
    unknown: "preserve";
    runtimeOwned: "preserve";
    cleanup: "disabled";
  }>;
  mutation: "disabled-until-exact-runtime-gate";
  noWrite: true;
  blockers: readonly string[];
  planSha256: string;
}>;

function candidate(
  stableId: string,
  documentType: FoundryDocumentCandidate["documentType"],
  operation: FoundryDocumentCandidate["operation"],
  parentStableId: string | null,
  foundryApi: string,
  data: Readonly<Record<string, unknown>>,
): FoundryDocumentCandidate {
  return {
    stableId,
    documentType,
    operation,
    parentStableId,
    foundryApi,
    runtimeId: null,
    data,
    ownership: { moduleId: "dicebox-campaign-helper", stableId },
  };
}

function localKey(entity: SceneEntity): string {
  return entity.id.split(":").slice(2).join("-").replaceAll(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
}

function rectanglePoints(entity: SceneEntity): readonly (readonly [number, number])[] {
  return [
    [entity.x, entity.y],
    [entity.x + entity.width, entity.y],
    [entity.x + entity.width, entity.y + entity.height],
    [entity.x, entity.y + entity.height],
    [entity.x, entity.y],
  ];
}

function roomWalls(scene: SceneDocument, room: SceneEntity): FoundryDocumentCandidate[] {
  const key = localKey(room);
  const x1 = room.x;
  const y1 = room.y;
  const x2 = room.x + room.width;
  const y2 = room.y + room.height;
  return [
    ["north", [x1, y1, x2, y1]],
    ["east", [x2, y1, x2, y2]],
    ["south", [x2, y2, x1, y2]],
    ["west", [x1, y2, x1, y1]],
  ].map(([side, coordinates]) => {
    const stableId = `dbx:wall:${key}-${side as string}`;
    return candidate(stableId, "Wall", "create-candidate", scene.id, "scene.createEmbeddedDocuments(\"Wall\", data)", {
      c: coordinates,
      door: 0,
      move: 20,
      sight: 20,
      flags: { "dicebox-campaign-helper": { stableId } },
    });
  });
}

function entityCandidate(scene: SceneDocument, entity: SceneEntity): FoundryDocumentCandidate[] {
  const key = localKey(entity);
  if (entity.kind === "room") return roomWalls(scene, entity);
  if (entity.kind === "door") {
    const stableId = `dbx:wall:${key}`;
    const horizontal = entity.width >= entity.height;
    const coordinates = horizontal
      ? [entity.x, entity.y + entity.height / 2, entity.x + entity.width, entity.y + entity.height / 2]
      : [entity.x + entity.width / 2, entity.y, entity.x + entity.width / 2, entity.y + entity.height];
    return [candidate(stableId, "Wall", "create-candidate", scene.id, "scene.createEmbeddedDocuments(\"Wall\", data)", {
      c: coordinates,
      door: 1,
      ds: 0,
      move: 20,
      sight: 20,
      flags: { "dicebox-campaign-helper": { stableId, sourceEntityId: entity.id } },
    })];
  }
  if (entity.kind === "region") {
    const stableId = entity.id;
    return [candidate(stableId, "Region", "create-candidate", scene.id, "scene.createEmbeddedDocuments(\"Region\", data)", {
      name: entity.name,
      shapes: [{ type: "polygon", points: rectanglePoints(entity).flat(), hole: false }],
      flags: { "dicebox-campaign-helper": { stableId } },
    })];
  }
  const stableId = `dbx:tile:${key}`;
  return [candidate(stableId, "Tile", "create-candidate", scene.id, "scene.createEmbeddedDocuments(\"Tile\", data)", {
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height,
    texture: { src: null },
    flags: { "dicebox-campaign-helper": { stableId, sourceEntityId: entity.id } },
  })];
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function compileSceneFoundryPreview(input: {
  readonly projectId: string;
  readonly scene: SceneDocument;
  readonly assets: readonly ProjectAssetReference[];
}): Promise<SceneFoundryPreview> {
  if (!/^dbx:project:[a-z0-9-]+$/.test(input.projectId)) throw new Error("Project ID must use the canonical dbx:project namespace.");
  const errors = validateSceneDocument(input.scene);
  if (errors.length > 0) throw new Error(`Scene cannot compile: ${errors.join(" ")}`);
  const assets = [...input.assets].sort((left, right) => (left.registration?.assetId ?? left.sha256).localeCompare(right.registration?.assetId ?? right.sha256));
  const assetIds = new Set<string>();
  for (const asset of assets) {
    if (!/^[0-9a-f]{64}$/.test(asset.sha256) || asset.byteLength <= 0 || asset.relativePath !== `assets/sha256/${asset.sha256}`) {
      throw new Error("Project asset reference is not content-addressed.");
    }
    if (asset.registration) {
      if (!/^dbx:asset:[a-z0-9][a-z0-9._-]*$/.test(asset.registration.assetId)
        || !["background", "handout", "audio", "token"].includes(asset.registration.role)
        || asset.registration.approval !== "approved"
        || !asset.registration.label
        || !asset.registration.provenance
        || !assetIds.add(asset.registration.assetId)) {
        throw new Error("Project asset registration is invalid or duplicated.");
      }
    }
  }
  const backgroundAssetId = input.scene.background.assetId;
  const background = backgroundAssetId
    ? assets.find((asset) => asset.registration?.assetId === backgroundAssetId && asset.registration.role === "background")
    : undefined;
  const blockers: string[] = [];
  if (backgroundAssetId && !background) blockers.push("BACKGROUND_ASSET_MISSING");
  if (!backgroundAssetId) blockers.push("BACKGROUND_ASSET_UNBOUND");
  const sceneCandidate = candidate(input.scene.id, "Scene", "create-candidate", null, "Scene.create(data)", {
    name: input.scene.name,
    width: input.scene.width,
    height: input.scene.height,
    grid: { type: 1, size: input.scene.background.gridSize },
    backgroundColor: `#${input.scene.background.color.toString(16).padStart(6, "0")}`,
    flags: { "dicebox-campaign-helper": { stableId: input.scene.id, sourceRevision: input.scene.revision } },
  });
  const levelStableId = `${input.scene.id}:initial-level`;
  const levelCandidate = candidate(levelStableId, "Level", "update-candidate", input.scene.id, "scene.initialLevel.update(data)", {
    background: { src: background?.relativePath ?? null },
    flags: { "dicebox-campaign-helper": { stableId: levelStableId, sourceAssetId: background?.registration?.assetId ?? null, sourceAssetSha256: background?.sha256 ?? null } },
  });
  const documents = [sceneCandidate, levelCandidate, ...input.scene.entities.flatMap((entity) => entityCandidate(input.scene, entity))]
    .sort((left, right) => left.stableId.localeCompare(right.stableId));
  const withoutHash = {
    schemaVersion: "0.1.0" as const,
    operation: "dicebox.scene.compile-foundry-preview" as const,
    projectId: input.projectId,
    sceneId: input.scene.id,
    sourceRevision: input.scene.revision,
    target: { foundryVersion: "14.367" as const, systemId: "dnd5e" as const, systemVersion: "5.3.3" as const },
    documents,
    preservation: { foreign: "preserve" as const, unknown: "preserve" as const, runtimeOwned: "preserve" as const, cleanup: "disabled" as const },
    mutation: "disabled-until-exact-runtime-gate" as const,
    noWrite: true as const,
    blockers: blockers.sort(),
  };
  return { ...withoutHash, planSha256: await sha256(canonicalJson(withoutHash)) };
}

export function serializeSceneFoundryPreview(preview: SceneFoundryPreview): string {
  return canonicalJson(preview);
}
