/**
 * Runtime registry for optional puzzle libraries. Definitions are deliberately
 * small: the companion owns its implementation while the free core only
 * provides a discoverable launch point.
 */
const definitions = new Map();

function immutableDefinition(definition) {
  if (!definition || typeof definition !== "object") throw new Error("A puzzle definition is required.");
  const id = String(definition.id ?? "").trim();
  if (!/^[a-z0-9-]+$/i.test(id)) throw new Error("Puzzle definitions need a stable id.");
  if (typeof definition.openSetup !== "function") throw new Error(`Puzzle ${id} needs an openSetup function.`);
  return Object.freeze({
    id,
    title: String(definition.title ?? id),
    hint: String(definition.hint ?? ""),
    icon: String(definition.icon ?? "fa-puzzle-piece"),
    edition: definition.edition === "premium" ? "premium" : "free",
    requiredType: String(definition.requiredType ?? "door"),
    openSetup: definition.openSetup
  });
}

export function registerPuzzleDefinition(definition) {
  const stored = immutableDefinition(definition);
  if (definitions.has(stored.id)) throw new Error(`Puzzle definition ${stored.id} is already registered.`);
  definitions.set(stored.id, stored);
  return () => definitions.delete(stored.id);
}

export function puzzleDefinitions() {
  return Object.freeze([...definitions.values()]);
}

export async function openRegisteredPuzzleSetup(id, context = {}) {
  const definition = definitions.get(String(id ?? ""));
  if (!definition) throw new Error("That puzzle library is not available.");
  return definition.openSetup(context);
}
