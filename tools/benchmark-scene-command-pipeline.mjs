import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { performance } from "node:perf_hooks";

const ENTITY_COUNT = 10_000;
const RELATIONSHIP_COUNT = 4_000;
const COMMAND_COUNT = 500;

function createScene() {
  const entities = {};
  for (let index = 0; index < ENTITY_COUNT; index += 1) {
    entities[`dbx:entity:${index}`] = {
      id: `dbx:entity:${index}`,
      kind: index % 5 === 0 ? "region" : index % 5 === 1 ? "door" : index % 5 === 2 ? "wall" : "background-object",
      bounds: { x: (index * 73) % 6000, y: (index * 151) % 4000, width: 32 + (index % 5), height: 32 + (index % 7) },
      revision: 1
    };
  }
  const relationships = {};
  for (let index = 0; index < RELATIONSHIP_COUNT; index += 1) {
    relationships[`dbx:relationship:${index}`] = {
      id: `dbx:relationship:${index}`,
      kind: "offset-from",
      subjectId: `dbx:entity:${index + 1}`,
      anchorId: `dbx:entity:${index}`,
      offset: { x: 16 + (index % 3), y: 8 + (index % 5) }
    };
  }
  return { schemaVersion: "0.1.0-spike", sceneId: "dbx:scene:m184-representative", revision: 1, entities, relationships };
}

function buildDependencyIndex(scene) {
  const index = new Map();
  for (const relationship of Object.values(scene.relationships)) {
    const dependents = index.get(relationship.anchorId) ?? [];
    dependents.push(relationship);
    index.set(relationship.anchorId, dependents);
  }
  return index;
}

function applyCommandBatch(scene, commands, dependencyIndex) {
  const changed = new Set();
  for (const command of commands) {
    if (command.type !== "scene.entity.move") throw new Error(`Unsupported command ${command.type}`);
    const entity = scene.entities[command.entityId];
    if (!entity) throw new Error(`Missing entity ${command.entityId}`);
    entity.bounds.x = command.x;
    entity.bounds.y = command.y;
    entity.revision += 1;
    changed.add(entity.id);
  }
  const queue = [...changed];
  while (queue.length) {
    const anchorId = queue.shift();
    for (const relationship of dependencyIndex.get(anchorId) ?? []) {
      const anchor = scene.entities[relationship.anchorId];
      const subject = scene.entities[relationship.subjectId];
      const nextX = anchor.bounds.x + relationship.offset.x;
      const nextY = anchor.bounds.y + relationship.offset.y;
      if (subject.bounds.x === nextX && subject.bounds.y === nextY) continue;
      subject.bounds.x = nextX;
      subject.bounds.y = nextY;
      subject.revision += 1;
      changed.add(subject.id);
      queue.push(subject.id);
    }
  }
  scene.revision += 1;
  return changed;
}

function validateScene(scene) {
  const errors = [];
  for (const entity of Object.values(scene.entities)) {
    const { x, y, width, height } = entity.bounds;
    if (![x, y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) errors.push({ entityId: entity.id, code: "INVALID_BOUNDS" });
  }
  for (const relationship of Object.values(scene.relationships)) {
    if (!scene.entities[relationship.anchorId] || !scene.entities[relationship.subjectId]) errors.push({ relationshipId: relationship.id, code: "DANGLING_RELATIONSHIP" });
  }
  return errors;
}

const scene = createScene();
const commands = Array.from({ length: COMMAND_COUNT }, (_, index) => ({
  type: "scene.entity.move",
  commandId: `dbx:command:m184:${index}`,
  actor: index % 2 ? "human" : "ai",
  entityId: `dbx:entity:${index * 8}`,
  x: 1000 + index * 2,
  y: 500 + index
}));

const indexStart = performance.now();
const dependencyIndex = buildDependencyIndex(scene);
const indexMs = performance.now() - indexStart;
const commitStart = performance.now();
const changed = applyCommandBatch(scene, commands, dependencyIndex);
const commitMs = performance.now() - commitStart;
const validateStart = performance.now();
const validationErrors = validateScene(scene);
const validateMs = performance.now() - validateStart;
const serializeStart = performance.now();
const serialized = JSON.stringify(scene);
const serializeMs = performance.now() - serializeStart;
const parseStart = performance.now();
const reread = JSON.parse(serialized);
const parseMs = performance.now() - parseStart;
const digest = createHash("sha256").update(serialized).digest("hex").toUpperCase();

const receipt = {
  operation: "m184.scene-command-pipeline-benchmark",
  status: validationErrors.length === 0 && reread.revision === 2 ? "PASS" : "FAIL",
  evidenceClass: "local-benchmark",
  workload: { entityCount: ENTITY_COUNT, relationshipCount: RELATIONSHIP_COUNT, typedCommandCount: COMMAND_COUNT, humanCommandCount: 250, aiCommandCount: 250 },
  results: { indexMs, commitMs, validateMs, serializeMs, parseMs, changedEntityCount: changed.size, serializedBytes: Buffer.byteLength(serialized), sha256: digest, validationErrorCount: validationErrors.length },
  conclusionBoundary: "Validates one deterministic shared command/relationship/serialization model in Node.js; does not prove Rust IPC, polygon Boolean robustness, renderer performance, or target desktop behavior.",
  timestamp: new Date().toISOString()
};

const outputPath = resolve("outputs", "m184-scene-command-pipeline-benchmark.json");
await writeFile(outputPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (receipt.status !== "PASS") process.exitCode = 1;
