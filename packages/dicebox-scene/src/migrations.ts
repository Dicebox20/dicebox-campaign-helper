import { SCENE_SCHEMA_VERSION, validateSceneDocument, type SceneDocument, type SceneEntity } from "./model.js";

export type LegacySceneDocumentV001 = Readonly<{
  schemaVersion: "0.0.1";
  id: string;
  name: string;
  width: number;
  height: number;
  background: Readonly<{ color: number; gridSize: number }>;
  entities: readonly (Omit<SceneEntity, "locked"> & Readonly<{ locked?: boolean }>)[];
}>;

export type MigratableSceneDocument = LegacySceneDocumentV001 | SceneDocument;

export function migrateSceneDocument(input: MigratableSceneDocument): SceneDocument {
  const migrated: SceneDocument = input.schemaVersion === SCENE_SCHEMA_VERSION
    ? input
    : {
        ...input,
        schemaVersion: SCENE_SCHEMA_VERSION,
        revision: 0,
        entities: input.entities.map((entity) => ({ ...entity, locked: entity.locked ?? false })),
      };
  const errors = validateSceneDocument(migrated);
  if (errors.length > 0) throw new Error(`Migrated Scene is invalid: ${errors.join(" ")}`);
  return migrated;
}
