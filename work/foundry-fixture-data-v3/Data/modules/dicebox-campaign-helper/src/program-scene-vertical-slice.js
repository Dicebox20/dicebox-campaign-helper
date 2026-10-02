/**
 * Exact fixture adapter for the first Campaign Helper-authored Foundry Scene.
 *
 * The generated package is the only plan input. This adapter is create-only:
 * it never deletes, cleans up, accepts arbitrary payloads, or targets Ballad.
 */

const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_PATH = `modules/${MODULE_ID}/program-scene-vertical-slice-package.json`;
const PACKAGE_ID = "dbx:package:program-scene-vertical-slice-v1";
const ADAPTER_VERSION = "0.1.0";
const EXACT_WORLD_ID = "dbx-test-world";
const EXACT_FOUNDRY_VERSION = "14.367";
const EXACT_SYSTEM_ID = "dnd5e";
const EXACT_SYSTEM_VERSION = "5.3.3";
const PLAN_TTL_MS = 5 * 60 * 1000;
const TILE_MARKER_PATH = `modules/${MODULE_ID}/assets/maps/ascendancy-tram-calibration-marker-v1.svg`;

function canonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
}

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function contents(collection) {
  if (Array.isArray(collection?.contents)) return collection.contents;
  if (Array.isArray(collection)) return collection;
  if (collection && typeof collection.values === "function") return [...collection.values()];
  return [];
}

function managedMarker(document) {
  return document?.flags?.[MODULE_ID]?.managed ?? null;
}

function stableId(document) {
  return document?.flags?.[MODULE_ID]?.stableId
    ?? managedMarker(document)?.stableId
    ?? null;
}

function isOwned(document, packageData, kind, expectedStableId) {
  const marker = managedMarker(document);
  return marker?.owner === MODULE_ID
    && marker.packageId === PACKAGE_ID
    && marker.planSha256 === packageData.plan.planSha256
    && marker.adapterVersion === ADAPTER_VERSION
    && marker.kind === kind
    && marker.stableId === expectedStableId;
}

function marker(packageData, candidate, kind) {
  return {
    flags: {
      [MODULE_ID]: {
        ...(candidate.data?.flags?.[MODULE_ID] ?? {}),
        managed: {
          owner: MODULE_ID,
          packageId: PACKAGE_ID,
          planSha256: packageData.plan.planSha256,
          adapterVersion: ADAPTER_VERSION,
          kind,
          stableId: candidate.stableId,
          sourceRevision: packageData.plan.sourceRevision,
        },
      },
    },
  };
}

function mergeCandidateData(packageData, candidate, kind) {
  return {
    ...candidate.data,
    ...marker(packageData, candidate, kind),
  };
}

function documentKind(candidate) {
  return candidate.documentType.toLowerCase();
}

function candidateOf(packageData, documentType) {
  const matches = packageData.plan.documents.filter((candidate) => candidate.documentType === documentType);
  if (matches.length !== 1) throw new Error(`Expected exactly one ${documentType} candidate.`);
  return matches[0];
}

function candidatesOf(packageData, documentType) {
  return packageData.plan.documents.filter((candidate) => candidate.documentType === documentType);
}

function activeGm(runtime) {
  return Boolean(runtime.game?.user?.isGM
    && runtime.game?.user?.id
    && runtime.game?.users?.activeGM?.id === runtime.game.user.id);
}

function runtimeGate(runtime, packageData) {
  const checks = [
    [runtime.game?.world?.id === EXACT_WORLD_ID, `World must be ${EXACT_WORLD_ID}.`],
    [runtime.game?.version === EXACT_FOUNDRY_VERSION, `Foundry must be ${EXACT_FOUNDRY_VERSION}.`],
    [runtime.game?.system?.id === EXACT_SYSTEM_ID && runtime.game?.system?.version === EXACT_SYSTEM_VERSION, `System must be ${EXACT_SYSTEM_ID} ${EXACT_SYSTEM_VERSION}.`],
    [packageData.target.worldId === EXACT_WORLD_ID, "Package world target is exact."],
    [activeGm(runtime), "Current user must be the elected active GM."],
    [typeof runtime.Scene?.create === "function", "Scene.create must be available."],
    [Array.isArray(runtime.game?.scenes?.contents) && typeof runtime.game?.scenes?.get === "function", "Scene collection reread must be available."],
  ].map(([pass, reason]) => ({ pass: Boolean(pass), reason }));
  return Object.freeze({ pass: checks.every((check) => check.pass), checks: Object.freeze(checks), failed: Object.freeze(checks.filter((check) => !check.pass).map((check) => check.reason)) });
}

function initialLevel(scene) {
  if (scene?.initialLevel) return scene.initialLevel;
  if (scene?.firstLevel) return scene.firstLevel;
  const levels = contents(scene?.levels);
  return levels.length === 1 ? levels[0] : null;
}

function findStable(collection, expectedStableId) {
  return contents(collection).filter((document) => stableId(document) === expectedStableId);
}

function findOwnedScene(runtime, packageData) {
  const sceneCandidate = candidateOf(packageData, "Scene");
  const matches = contents(runtime.game?.scenes).filter((scene) => isOwned(scene, packageData, "scene", sceneCandidate.stableId));
  const collisions = contents(runtime.game?.scenes).filter((scene) => stableId(scene) === sceneCandidate.stableId && !isOwned(scene, packageData, "scene", sceneCandidate.stableId));
  if (matches.length > 1) throw new Error("Duplicate helper-owned fixture Scenes were found.");
  if (collisions.length > 0) throw new Error("A Scene stable-ID collision exists outside this exact package/plan.");
  return matches[0] ?? null;
}

function collectionFor(scene, documentType) {
  if (documentType === "Wall") return scene?.walls;
  if (documentType === "Region") return scene?.regions;
  if (documentType === "Tile") return scene?.tiles;
  return null;
}

function runtimeIdentity(document) {
  return typeof document?.uuid === "string" ? document.uuid : typeof document?.id === "string" ? document.id : null;
}

function expectedRenderer(packageData) {
  return packageData.assetDeployment.foundryPath;
}

function childReadback(scene, packageData, candidate) {
  const matches = findStable(collectionFor(scene, candidate.documentType), candidate.stableId);
  const owned = matches.filter((document) => isOwned(document, packageData, documentKind(candidate), candidate.stableId));
  return {
    stableId: candidate.stableId,
    documentType: candidate.documentType,
    matches: matches.length,
    ownedMatches: owned.length,
    runtimeId: owned.length === 1 ? runtimeIdentity(owned[0]) : null,
  };
}

function foreignCounts(scene, packageData) {
  const count = (collection) => contents(collection).filter((document) => managedMarker(document)?.packageId !== PACKAGE_ID
    || managedMarker(document)?.planSha256 !== packageData.plan.planSha256).length;
  return Object.freeze({ walls: count(scene?.walls), regions: count(scene?.regions), tiles: count(scene?.tiles) });
}

function sameCounts(left, right) {
  return left.walls === right.walls && left.regions === right.regions && left.tiles === right.tiles;
}

function snapshot(scene, packageData) {
  const children = packageData.plan.documents
    .filter((candidate) => ["Wall", "Region", "Tile"].includes(candidate.documentType))
    .map((candidate) => childReadback(scene, packageData, candidate));
  const sceneCandidate = candidateOf(packageData, "Scene");
  const levelCandidate = candidateOf(packageData, "Level");
  const level = initialLevel(scene);
  const renderer = level?.background?.src ?? null;
  const sceneOwned = Boolean(scene && isOwned(scene, packageData, "scene", sceneCandidate.stableId));
  const levelOwned = Boolean(level && isOwned(level, packageData, "level", levelCandidate.stableId));
  const complete = sceneOwned
    && levelOwned
    && renderer === expectedRenderer(packageData)
    && children.every((child) => child.matches === 1 && child.ownedMatches === 1);
  return Object.freeze({
    scene: scene ? { stableId: sceneCandidate.stableId, runtimeId: runtimeIdentity(scene), owned: sceneOwned } : null,
    initialLevel: level ? { stableId: levelCandidate.stableId, runtimeId: runtimeIdentity(level), owned: levelOwned, renderer } : null,
    children: Object.freeze(children),
    counts: Object.freeze({
      walls: children.filter((child) => child.documentType === "Wall" && child.ownedMatches === 1).length,
      regions: children.filter((child) => child.documentType === "Region" && child.ownedMatches === 1).length,
      tiles: children.filter((child) => child.documentType === "Tile" && child.ownedMatches === 1).length,
    }),
    complete,
  });
}

async function rereadScene(runtime, scene) {
  const current = runtime.game?.scenes?.get?.(scene?.id);
  if (current) return current;
  if (typeof runtime.fromUuid === "function" && scene?.uuid) return runtime.fromUuid(scene.uuid);
  return null;
}

async function validatePackage(packageData) {
  if (packageData?.schemaVersion !== "0.1.0"
    || packageData.packageId !== PACKAGE_ID
    || packageData.adapterVersion !== ADAPTER_VERSION
    || packageData.target?.worldId !== EXACT_WORLD_ID
    || packageData.target?.foundryVersion !== EXACT_FOUNDRY_VERSION
    || packageData.target?.systemId !== EXACT_SYSTEM_ID
    || packageData.target?.systemVersion !== EXACT_SYSTEM_VERSION
    || packageData.plan?.schemaVersion !== "0.1.0"
    || packageData.plan?.target?.foundryVersion !== EXACT_FOUNDRY_VERSION
    || packageData.plan?.target?.systemId !== EXACT_SYSTEM_ID
    || packageData.plan?.target?.systemVersion !== EXACT_SYSTEM_VERSION
    || packageData.plan?.mutation !== "disabled-until-exact-runtime-gate"
    || packageData.plan?.noWrite !== true
    || packageData.plan?.preservation?.foreign !== "preserve"
    || packageData.plan?.preservation?.unknown !== "preserve"
    || packageData.plan?.preservation?.runtimeOwned !== "preserve"
    || packageData.plan?.preservation?.cleanup !== "disabled"
    || packageData.assetDeployment?.foundryPath !== `modules/${MODULE_ID}/assets/maps/ascendancy-tram-calibration-graybox-v1.png`
    || !/^[0-9a-f]{64}$/.test(packageData.assetDeployment?.sourceSha256 ?? "")) {
    throw new Error("Program Scene package identity, target, preservation, or asset deployment is invalid.");
  }
  const allowedTypes = new Set(["Scene", "Level", "Wall", "Region", "Tile"]);
  const stableIds = new Set();
  for (const candidate of packageData.plan.documents ?? []) {
    if (!allowedTypes.has(candidate.documentType)
      || !["create-candidate", "update-candidate"].includes(candidate.operation)
      || typeof candidate.stableId !== "string"
      || stableIds.has(candidate.stableId)
      || candidate.runtimeId !== null
      || candidate.ownership?.moduleId !== MODULE_ID
      || candidate.ownership?.stableId !== candidate.stableId) throw new Error("Program Scene candidate contract is invalid or ambiguous.");
    stableIds.add(candidate.stableId);
  }
  if ((packageData.plan.documents ?? []).length !== 10
    || candidatesOf(packageData, "Wall").length !== 5
    || candidatesOf(packageData, "Region").length !== 2
    || candidatesOf(packageData, "Tile").length !== 1) throw new Error("Program Scene candidate count has drifted.");
  const unsigned = { ...packageData.plan };
  delete unsigned.planSha256;
  if (await sha256(canonicalJson(unsigned)) !== packageData.plan.planSha256) throw new Error("Program Scene plan SHA-256 does not match its canonical content.");
  return packageData;
}

function scenePayload(packageData) {
  const candidate = candidateOf(packageData, "Scene");
  return mergeCandidateData(packageData, candidate, "scene");
}

function childPayload(packageData, candidate) {
  const data = mergeCandidateData(packageData, candidate, documentKind(candidate));
  if (candidate.documentType === "Tile") return { ...data, texture: { ...(data.texture ?? {}), src: TILE_MARKER_PATH }, locked: true };
  return data;
}

function levelPayload(packageData) {
  const candidate = candidateOf(packageData, "Level");
  return { ...mergeCandidateData(packageData, candidate, "level"), background: { ...(candidate.data.background ?? {}), src: expectedRenderer(packageData) } };
}

export class ProgramSceneVerticalSliceAdapter {
  constructor({ runtime = globalThis, packageData, now = () => Date.now() } = {}) {
    this.runtime = runtime;
    this.packageData = packageData;
    this.now = now;
    this.previewToken = null;
    this.lastOperationReceipt = null;
  }

  static async create(options = {}) {
    return new ProgramSceneVerticalSliceAdapter({ ...options, packageData: await validatePackage(options.packageData) });
  }

  status() {
    const gate = runtimeGate(this.runtime, this.packageData);
    try {
      const scene = findOwnedScene(this.runtime, this.packageData);
      const readback = scene ? snapshot(scene, this.packageData) : null;
      return Object.freeze({ operation: "program-scene.status", status: gate.pass ? "OBSERVED" : "BLOCKED", evidenceClass: gate.pass ? "fixture" : "blocked", noWrite: true, gate, planSha256: this.packageData.plan.planSha256, readback });
    } catch (error) {
      return Object.freeze({ operation: "program-scene.status", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true, gate });
    }
  }

  lastReceipt() {
    return this.lastOperationReceipt;
  }

  preview() {
    const gate = runtimeGate(this.runtime, this.packageData);
    if (!gate.pass) return Object.freeze({ operation: "program-scene.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: gate.failed, gate });
    try {
      const scene = findOwnedScene(this.runtime, this.packageData);
      const readback = scene ? snapshot(scene, this.packageData) : null;
      if (scene && !readback.complete) return Object.freeze({ operation: "program-scene.preview", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["The helper-owned fixture Scene is partial or drifted. Recovery requires authoritative review; apply will not retry."], gate, readback });
      const token = `${this.now().toString(36)}-${this.packageData.plan.planSha256.slice(0, 12)}`;
      this.previewToken = { token, expiresAt: this.now() + PLAN_TTL_MS };
      const receipt = Object.freeze({ operation: "program-scene.preview", status: "PASS", evidenceClass: "deterministic", noWrite: true, planToken: token, expiresAt: new Date(this.previewToken.expiresAt).toISOString(), planSha256: this.packageData.plan.planSha256, existingComplete: Boolean(readback?.complete), candidates: Object.freeze(this.packageData.plan.documents.map((candidate) => ({ stableId: candidate.stableId, documentType: candidate.documentType, foundryApi: candidate.foundryApi }))), preservation: this.packageData.plan.preservation, gate });
      this.lastOperationReceipt = receipt;
      return receipt;
    } catch (error) {
      return Object.freeze({ operation: "program-scene.preview", status: "UNKNOWN", evidenceClass: "unknown", noWrite: true, error: String(error?.message ?? error), rereadRequired: true, gate });
    }
  }

  async apply({ approved = false, planToken } = {}) {
    const gate = runtimeGate(this.runtime, this.packageData);
    if (!gate.pass) return Object.freeze({ operation: "program-scene.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: gate.failed, gate });
    if (!approved || planToken !== this.previewToken?.token || this.previewToken.expiresAt <= this.now()) return Object.freeze({ operation: "program-scene.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["Apply requires approved: true and the unexpired token from the current exact preview."], gate });
    this.previewToken = null;
    let scene = null;
    let sceneCreated = false;
    try {
      scene = findOwnedScene(this.runtime, this.packageData);
      if (scene) {
        const existing = snapshot(scene, this.packageData);
        if (existing.complete) {
          const receipt = Object.freeze({ operation: "program-scene.apply", status: "PASS", evidenceClass: "fixture", noWrite: true, alreadyApplied: true, authoritativeReread: true, foreignStatePreserved: true, planSha256: this.packageData.plan.planSha256, readback: existing });
          this.lastOperationReceipt = receipt;
          return receipt;
        }
        return Object.freeze({ operation: "program-scene.apply", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: ["The helper-owned fixture Scene is partial or drifted. No retry was attempted."], readback: existing });
      }

      scene = await this.runtime.Scene.create(scenePayload(this.packageData));
      sceneCreated = true;
      scene = await rereadScene(this.runtime, scene);
      if (!scene || typeof scene.createEmbeddedDocuments !== "function") throw new Error("Created Scene could not be authoritatively reread.");
      const beforeForeign = foreignCounts(scene, this.packageData);

      const walls = candidatesOf(this.packageData, "Wall");
      await scene.createEmbeddedDocuments("Wall", walls.map((candidate) => childPayload(this.packageData, candidate)));

      const level = initialLevel(scene);
      if (!level || typeof level.update !== "function") throw new Error("Foundry 14 initial Level is missing or ambiguous.");
      if (level.background?.src && level.background.src !== expectedRenderer(this.packageData)) throw new Error("Initial Level already has an unexpected renderer; refusing replacement.");
      const payload = levelPayload(this.packageData);
      await level.update({ ...payload, background: { ...(level.background?.toObject?.() ?? level.background ?? {}), ...payload.background } });
      scene = await rereadScene(this.runtime, scene);
      if (!scene || initialLevel(scene)?.background?.src !== expectedRenderer(this.packageData)) throw new Error("Initial-Level renderer reread failed before Tile/Region projection.");

      const tile = candidateOf(this.packageData, "Tile");
      await scene.createEmbeddedDocuments("Tile", [childPayload(this.packageData, tile)]);
      const regions = candidatesOf(this.packageData, "Region");
      await scene.createEmbeddedDocuments("Region", regions.map((candidate) => childPayload(this.packageData, candidate)));

      scene = await rereadScene(this.runtime, scene);
      const readback = scene ? snapshot(scene, this.packageData) : null;
      if (!readback?.complete) throw new Error("Authoritative post-write Scene reread does not match the reviewed package.");
      const preserved = sameCounts(beforeForeign, foreignCounts(scene, this.packageData));
      if (!preserved) throw new Error("Foreign child counts changed during the bounded operation.");
      const receipt = Object.freeze({ operation: "program-scene.apply", status: "PASS", evidenceClass: "created_document", noWrite: false, sceneCreated, planSha256: this.packageData.plan.planSha256, assetSha256: this.packageData.assetDeployment.sourceSha256, authoritativeReread: true, foreignStatePreserved: true, readback });
      this.lastOperationReceipt = receipt;
      return receipt;
    } catch (error) {
      const reread = scene ? await rereadScene(this.runtime, scene).catch(() => null) : null;
      const receipt = Object.freeze({ operation: "program-scene.apply", status: "UNKNOWN", evidenceClass: "unknown", noWrite: !sceneCreated, sceneCreated, error: String(error?.message ?? error), partialReadback: reread ? snapshot(reread, this.packageData) : null, authoritativeReread: Boolean(reread), recovery: "Do not retry. Review this authoritative partial reread and create an explicit recovery plan.", planSha256: this.packageData.plan.planSha256 });
      this.lastOperationReceipt = receipt;
      return receipt;
    }
  }
}

export async function loadProgramSceneVerticalSlicePackage(fetcher = globalThis.fetch) {
  if (typeof fetcher !== "function") throw new Error("Foundry fetch is unavailable.");
  const response = await fetcher(PACKAGE_PATH, { cache: "no-store" });
  if (!response?.ok) throw new Error("Program Scene package could not be loaded.");
  return validatePackage(await response.json());
}

export async function bootstrapProgramSceneVerticalSlice(runtime = globalThis) {
  if (!runtime.game || Object.prototype.hasOwnProperty.call(runtime.game, "diceboxProgramSceneVerticalSlice")) return false;
  try {
    const packageData = await loadProgramSceneVerticalSlicePackage(runtime.fetch ?? globalThis.fetch);
    const adapter = await ProgramSceneVerticalSliceAdapter.create({ runtime, packageData });
    Object.defineProperty(runtime.game, "diceboxProgramSceneVerticalSlice", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Object.freeze({ status: () => adapter.status(), preview: () => adapter.preview(), apply: (approval) => adapter.apply(approval), lastReceipt: () => adapter.lastReceipt() }),
    });
    return true;
  } catch (error) {
    Object.defineProperty(runtime.game, "diceboxProgramSceneVerticalSlice", {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Object.freeze({ status: () => Object.freeze({ operation: "program-scene.status", status: "BLOCKED", evidenceClass: "blocked", noWrite: true, blockers: [String(error?.message ?? error)] }) }),
    });
    return false;
  }
}

function receiptHtml(runtime, receipt) {
  const escape = runtime.foundry?.utils?.escapeHTML ?? ((value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  return `<pre style="white-space:pre-wrap;max-height:60vh;overflow:auto">${escape(JSON.stringify(receipt, null, 2))}</pre>`;
}

export async function openProgramSceneVerticalSliceControl(runtime = globalThis) {
  const api = runtime.game?.diceboxProgramSceneVerticalSlice;
  const DialogV2 = runtime.foundry?.applications?.api?.DialogV2;
  if (!api?.preview || !api?.apply || !DialogV2?.confirm || !DialogV2?.wait) throw new Error("Program Scene adapter or Foundry DialogV2 is unavailable.");
  const preview = api.preview();
  if (preview.status !== "PASS") {
    await DialogV2.wait({ window: { title: "DiceBox Program Scene Preview" }, content: receiptHtml(runtime, preview), buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }] });
    return preview;
  }
  const approved = await DialogV2.confirm({
    window: { title: "Apply DiceBox Program Scene Vertical Slice" },
    content: `${receiptHtml(runtime, preview)}<p>This creates exactly one helper-owned Scene in <strong>dbx-test-world</strong>: five Walls, one initial-Level renderer, one Tile, and two Regions. It never targets Ballad or deletes data.</p>`,
    yes: { label: "Apply reviewed Scene", icon: "fa-solid fa-check" },
    no: { label: "Cancel", icon: "fa-solid fa-xmark" },
  });
  if (!approved) return Object.freeze({ ...preview, status: "CANCELLED" });
  const receipt = await api.apply({ approved: true, planToken: preview.planToken });
  await DialogV2.wait({ window: { title: "DiceBox Program Scene Receipt" }, content: receiptHtml(runtime, receipt), buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }] });
  return receipt;
}

export function registerProgramSceneVerticalSliceControl(runtime = globalThis) {
  if (typeof runtime.Hooks?.on !== "function") return false;
  runtime.Hooks.on("getSceneControlButtons", (controls) => {
    if (!runtime.game?.user?.isGM) return;
    const tools = controls?.tokens?.tools;
    if (!tools || typeof tools !== "object" || Array.isArray(tools) || tools["dicebox-program-scene-slice"]) return;
    tools["dicebox-program-scene-slice"] = {
      name: "dicebox-program-scene-slice",
      title: "Apply DiceBox Program Scene vertical slice",
      icon: "fa-solid fa-cubes-stacked",
      order: Object.keys(tools).length,
      button: true,
      visible: true,
      onChange: () => openProgramSceneVerticalSliceControl(runtime).catch((error) => runtime.ui?.notifications?.error?.(`DiceBox Program Scene blocked: ${error.message}`)),
    };
  });
  return true;
}

if (typeof globalThis.Hooks?.once === "function") {
  globalThis.Hooks.once("init", () => registerProgramSceneVerticalSliceControl(globalThis));
  globalThis.Hooks.once("ready", () => void bootstrapProgramSceneVerticalSlice(globalThis));
}

export { PACKAGE_ID, PACKAGE_PATH, TILE_MARKER_PATH, validatePackage };
