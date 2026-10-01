// Keep the adapter URLs in lockstep with the cache-busted manifest entry.
// Foundry/Chrome caches ES modules by URL, so a new entry alone is not
// sufficient when these exact-version adapters change during a live repair.
import "./ascendancy-installer.js?dbx=0.1.16";
import "./foundry-live-bridge.js?dbx=0.1.16";
import "./tram-calibration-installer.js?dbx=0.1.16";
import "./tram-routing-fixture-installer.js?dbx=0.1.16";
import "./tram-rush-hour-dialog.js?dbx=0.1.16";
import "./tram-coordinate-calibration.js?dbx=0.1.16";
import "./tram-access-behavior.js?dbx=0.1.16";
import "./tram-access-fixture-installer.js?dbx=0.1.16";
import "./program-scene-vertical-slice.js?dbx=0.1.16";

/**
 * DiceBox runtime probe and read-only Foundry bridge shell.
 *
 * Foundry receives this package as browser-loadable ES modules, so this file
 * is deliberately self-contained. The probe reads runtime metadata and
 * registries only. It never creates, updates, or deletes a Document,
 * registers a setting, opens a socket, or elevates authority. The separate
 * installer and page-main live bridge are imported explicitly so Foundry
 * cannot omit their ready/settings registrations when loading multiple
 * manifest entries.
 */

const PACKAGE_ID = "dicebox-campaign-helper";
const CONTRACT_VERSION = "0.1.0";

const CAPABILITY_IDS = [
  "bridge.describe",
  "bridge.health",
  "bridge.query",
  "bridge.execute.readonly",
  "foundry.runtime.probe",
  "foundry.document.read",
  "foundry.scene.read",
  "foundry.scene.write",
  "foundry.scene.placeable.read",
  "foundry.scene.placeable.write",
  "foundry.region.read",
  "foundry.region.write",
  "foundry.media.deploy",
  "foundry.users.active-gm",
  "dnd5e.activities",
  "dnd5e.activity-hooks",
  "foundry.document.write",
];

function capability(id, state, reason) {
  return Object.freeze({ id, state, reason });
}

function readSystem(runtime) {
  const system = runtime.game?.system;
  return {
    id: typeof system?.id === "string" ? system.id : null,
    version: typeof system?.version === "string" ? system.version : null,
  };
}

function readActiveModuleIds(runtime) {
  const modules = runtime.game?.modules;
  if (!modules || typeof modules.values !== "function") return [];
  return [...modules.values()]
    .filter((module) => module?.active === true && typeof module.id === "string")
    .map((module) => module.id)
    .sort();
}

function readDocumentTypes(runtime) {
  const types = runtime.game?.documentTypes;
  if (types && typeof types === "object") return Object.keys(types).sort();
  const documents = runtime.foundry?.documents;
  if (!documents || typeof documents !== "object") return [];
  return Object.keys(documents)
    .filter((key) => typeof documents[key] === "function")
    .sort();
}

function hasCoreHooks(runtime) {
  return typeof runtime.Hooks?.on === "function"
    && typeof runtime.Hooks?.once === "function"
    && typeof runtime.Hooks?.callAll === "function";
}

function hasDocumentReadSurface(runtime) {
  const game = runtime.game;
  return Boolean(game?.actors && game?.items && game?.scenes && game?.journal && game?.folders);
}

function hasSceneReadSurface(runtime) {
  const scenes = runtime.game?.scenes;
  return Boolean(scenes && typeof scenes.get === "function")
    || typeof runtime.fromUuid === "function";
}

function hasRegionReadSurface(runtime) {
  return hasSceneReadSurface(runtime)
    && Array.isArray(runtime.game?.scenes?.contents)
    && runtime.game.scenes.contents.some((scene) => scene && ("regions" in scene));
}

function hasActivityRegistry(runtime) {
  const activityTypes = runtime.CONFIG?.DND5E?.activityTypes;
  return Boolean(activityTypes && typeof activityTypes === "object" && Object.keys(activityTypes).length > 0);
}

function fnv1a(input) {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function createRuntimeFingerprint(profile) {
  const capabilities = [...profile.capabilities]
    .sort((left, right) => left.id.localeCompare(right.id))
    .map((entry) => ({ id: entry.id, state: entry.state }));
  const canonical = JSON.stringify({
    phase: profile.phase,
    foundryVersion: profile.foundryVersion,
    systemId: profile.systemId,
    systemVersion: profile.systemVersion,
    activeModuleIds: [...profile.activeModuleIds].sort(),
    documentTypes: [...profile.documentTypes].sort(),
    capabilities,
  });
  const fingerprintId = `dbx:fingerprint:${fnv1a(canonical)}`;
  return Object.freeze({
    schemaVersion: "0.1.0",
    fingerprintId,
    phase: profile.phase,
    foundryVersion: profile.foundryVersion,
    systemId: profile.systemId,
    systemVersion: profile.systemVersion,
    observedAt: profile.observedAt,
    exactTargetMatch: profile.phase !== "m0"
      && profile.foundryVersion === "14.367"
      && profile.systemId === "dnd5e"
      && profile.systemVersion === "5.3.3",
    capabilities: Object.freeze(capabilities),
  });
}

function createRuntimeProbeReceipt(profile, fingerprint) {
  const status = profile.phase === "m0"
    ? "not-tested"
    : fingerprint.exactTargetMatch ? "observed" : "mismatch";
  return Object.freeze({
    receiptVersion: 1,
    receiptId: `dbx:receipt:runtime-probe-${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}`,
    operation: "foundry.runtime.probe",
    status,
    evidenceClass: status === "observed" ? "deterministic" : status === "mismatch" ? "blocked" : "static",
    source: "foundry-ready-hook",
    fingerprintId: fingerprint.fingerprintId,
    observedAt: fingerprint.observedAt,
    noWrite: true,
    notes: Object.freeze([
      "The probe reads runtime metadata and registries only; no Document, setting, socket, or authority mutation was attempted.",
      status === "observed" ? "The profile matches the configured Foundry 14.367 / D&D5e 5.3.3 target." : "This receipt is not live certification; exact behavior and permissions remain separate gates.",
    ]),
  });
}

function createActiveGmEvidence(runtime) {
  const users = runtime.game?.users;
  const activeGm = users?.activeGM;
  if (activeGm && typeof activeGm.id === "string" && activeGm.id.length > 0) {
    return Object.freeze({
      status: "observed",
      source: "game.users.activeGM",
      userFingerprint: `redacted:${fnv1a(activeGm.id)}`,
      isCurrentUser: typeof runtime.game?.user?.id === "string"
        ? runtime.game.user.id === activeGm.id
        : null,
    });
  }
  if (typeof users?.getDesignatedUser === "function") {
    return Object.freeze({
      status: "unknown",
      source: "game.users.getDesignatedUser",
      userFingerprint: null,
      isCurrentUser: null,
    });
  }
  return Object.freeze({
    status: "unavailable",
    source: "none",
    userFingerprint: null,
    isCurrentUser: null,
  });
}

const stableDiceBoxIdPattern = /^dbx:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;

function readManagedJournalSnapshot(runtime) {
  const contents = runtime.game?.journal?.contents;
  if (!Array.isArray(contents)) {
    return Object.freeze({
      status: "unavailable",
      documents: Object.freeze([]),
      notes: Object.freeze(["The Foundry Journal collection was not observed in this runtime profile."]),
    });
  }
  const documents = contents.flatMap((document) => {
    const marker = document?.flags?.[PACKAGE_ID];
    if (!marker || marker.schemaVersion !== "0.1.0"
      || typeof marker.semanticId !== "string"
      || !stableDiceBoxIdPattern.test(marker.semanticId)
      || typeof marker.planId !== "string"
      || !stableDiceBoxIdPattern.test(marker.planId)) return [];
    const runtimeIdentity = typeof document.uuid === "string" && document.uuid.length > 0
      ? document.uuid
      : typeof document.id === "string" ? document.id : null;
    if (!runtimeIdentity) return [];
    return [{
      semanticId: marker.semanticId,
      planId: marker.planId,
      documentType: "JournalEntry",
      pageCount: Array.isArray(document.pages) ? document.pages.length : 0,
      bindingFingerprint: `redacted:${fnv1a(runtimeIdentity)}`,
    }];
  });
  return Object.freeze({
    status: "observed",
    documents: Object.freeze(documents),
    notes: Object.freeze(["Only DiceBox-owned semantic IDs, plan IDs, page counts, and hashed runtime bindings are exposed; foreign and unknown documents are preserved and omitted."]),
  });
}

function readJournalApiEvidence(runtime) {
  const journalEntry = runtime.JournalEntry;
  const journal = runtime.game?.journal;
  const sample = Array.isArray(journal?.contents) ? journal.contents[0] : undefined;
  const prototype = journalEntry?.prototype;
  const surfaces = {
    journalEntryCreate: typeof journalEntry?.create === "function",
    fromUuid: typeof runtime.fromUuid === "function",
    journalCollectionGet: typeof journal?.get === "function",
    journalEntryUpdate: typeof sample?.update === "function" || typeof prototype?.update === "function",
    embeddedPageCreate: typeof sample?.createEmbeddedDocuments === "function"
      || typeof prototype?.createEmbeddedDocuments === "function",
  };
  const formats = runtime.CONST?.JOURNAL_ENTRY_PAGE_FORMATS;
  const textFormats = formats && typeof formats === "object"
    ? Object.values(formats)
      .filter((value) => Number.isInteger(value) && value >= 0)
      .sort((left, right) => left - right)
    : [];
  const defaultType = typeof runtime.CONFIG?.JournalEntryPage?.defaultType === "string"
    ? runtime.CONFIG.JournalEntryPage.defaultType
    : null;
  const surfaceCount = Object.values(surfaces).filter(Boolean).length;
  const status = surfaceCount === 0 && defaultType === null && textFormats.length === 0
    ? "unavailable"
    : surfaceCount === Object.keys(surfaces).length && defaultType !== null && textFormats.length > 0
      ? "observed"
      : "partial";
  return Object.freeze({
    status,
    surfaces: Object.freeze(surfaces),
    page: Object.freeze({ defaultType, textFormats: Object.freeze(textFormats) }),
    notes: Object.freeze(["Only API presence and page schema constants were read; no JournalEntry factory, update, embedded-document, or binding method was invoked."]),
  });
}

function readActivityApiEvidence(runtime) {
  const systemId = typeof runtime.game?.system?.id === "string" ? runtime.game.system.id : null;
  const activityTypes = runtime.CONFIG?.DND5E?.activityTypes;
  const registeredActivityTypes = activityTypes && typeof activityTypes === "object"
    ? Object.keys(activityTypes).sort()
    : [];
  const items = runtime.game?.items;
  const sampleItem = Array.isArray(items?.contents) ? items.contents[0] : undefined;
  const itemPrototype = runtime.Item?.prototype
    || runtime.foundry?.documents?.Item?.prototype;
  const activities = sampleItem?.system?.activities;
  const activityEntries = Array.isArray(activities)
    ? activities
    : Array.isArray(activities?.contents) ? activities.contents : [];
  const sampleActivity = activityEntries[0];
  const registryActivityUse = Object.values(activityTypes ?? {})
    .some((entry) => typeof entry?.documentClass?.prototype?.use === "function");
  const surfaces = {
    fromUuid: typeof runtime.fromUuid === "function",
    itemCollectionGet: typeof items?.get === "function",
    itemGetEmbeddedDocument: typeof sampleItem?.getEmbeddedDocument === "function"
      || typeof itemPrototype?.getEmbeddedDocument === "function",
    itemActivityCollection: Boolean(activities && (Array.isArray(activities) || Array.isArray(activities.contents))),
    activityUse: typeof sampleActivity?.use === "function" || registryActivityUse,
    hookFramework: typeof runtime.Hooks?.on === "function" && typeof runtime.Hooks?.call === "function",
    preUseActivityNamed: systemId === "dnd5e"
      && typeof runtime.Hooks?.on === "function"
      && typeof runtime.Hooks?.call === "function",
    postUseActivityNamed: systemId === "dnd5e"
      && typeof runtime.Hooks?.on === "function"
      && typeof runtime.Hooks?.call === "function",
  };
  const resolutionObserved = surfaces.fromUuid || surfaces.itemCollectionGet;
  const required = [
    resolutionObserved,
    surfaces.itemGetEmbeddedDocument,
    surfaces.itemActivityCollection,
    surfaces.activityUse,
    surfaces.hookFramework,
  ];
  const status = required.every(Boolean) && systemId === "dnd5e"
    ? "observed"
    : required.some(Boolean) || registeredActivityTypes.length > 0 ? "partial" : "unavailable";
  return Object.freeze({
    status,
    systemId,
    registeredActivityTypes: Object.freeze(registeredActivityTypes),
    surfaces: Object.freeze(surfaces),
    notes: Object.freeze([
      "Only Activity registry names, Item/Activity read-surface presence, and expected hook names were inspected; Item.getEmbeddedDocument and Activity.use were not invoked.",
      "Named preUseActivity/postUseActivity events and API presence do not prove hook ordering, cancellation, permissions, sender semantics, or successful execution.",
    ]),
  });
}

function hasProperty(target, property) {
  return Boolean(target && (typeof target === "object" || typeof target === "function") && property in target);
}

function hasMethod(sample, prototype, method) {
  return typeof sample?.[method] === "function" || typeof prototype?.[method] === "function";
}

function firstDocument(collection) {
  return Array.isArray(collection?.contents) ? collection.contents[0] : undefined;
}

function readActiveEffectApiEvidence(runtime) {
  const actors = runtime.game?.actors;
  const items = runtime.game?.items;
  const actorSample = firstDocument(actors);
  const itemSample = firstDocument(items);
  const actorPrototype = runtime.Actor?.prototype || runtime.foundry?.documents?.Actor?.prototype;
  const itemPrototype = runtime.Item?.prototype || runtime.foundry?.documents?.Item?.prototype;
  const activeEffectClass = runtime.ActiveEffect || runtime.foundry?.documents?.ActiveEffect;
  const activeEffectPrototype = activeEffectClass?.prototype;
  const activeEffectDocumentName = typeof activeEffectClass?.documentName === "string"
    ? activeEffectClass.documentName
    : typeof activeEffectPrototype?.documentName === "string" ? activeEffectPrototype.documentName : null;
  const hookFramework = typeof runtime.Hooks?.on === "function"
    && (typeof runtime.Hooks?.callAll === "function" || typeof runtime.Hooks?.call === "function");
  const surfaces = {
    fromUuid: typeof runtime.fromUuid === "function",
    actorCollectionGet: typeof actors?.get === "function",
    itemCollectionGet: typeof items?.get === "function",
    actorEmbeddedCollectionRead: hasMethod(actorSample, actorPrototype, "getEmbeddedCollection"),
    itemEmbeddedCollectionRead: hasMethod(itemSample, itemPrototype, "getEmbeddedCollection"),
    actorEmbeddedDocumentRead: hasMethod(actorSample, actorPrototype, "getEmbeddedDocument"),
    itemEmbeddedDocumentRead: hasMethod(itemSample, itemPrototype, "getEmbeddedDocument"),
    activeEffectClass: typeof activeEffectClass === "function" && activeEffectDocumentName === "ActiveEffect",
    activeEffectIdAccessor: hasProperty(activeEffectPrototype, "id"),
    activeEffectUuidAccessor: hasProperty(activeEffectPrototype, "uuid"),
    activeEffectActiveAccessor: hasProperty(activeEffectPrototype, "active"),
    activeEffectSuppressedAccessor: hasProperty(activeEffectPrototype, "isSuppressed"),
    hookFramework,
    applyActiveEffectNamed: hookFramework && activeEffectDocumentName === "ActiveEffect",
    actorEmbeddedCreate: hasMethod(actorSample, actorPrototype, "createEmbeddedDocuments"),
    itemEmbeddedCreate: hasMethod(itemSample, itemPrototype, "createEmbeddedDocuments"),
    activeEffectUpdate: hasMethod(undefined, activeEffectPrototype, "update"),
    activeEffectDelete: hasMethod(undefined, activeEffectPrototype, "delete"),
  };
  const parentDocumentTypes = [
    surfaces.actorCollectionGet || surfaces.actorEmbeddedCollectionRead || surfaces.actorEmbeddedDocumentRead ? "Actor" : null,
    surfaces.itemCollectionGet || surfaces.itemEmbeddedCollectionRead || surfaces.itemEmbeddedDocumentRead ? "Item" : null,
  ].filter(Boolean);
  const parentReadObserved = (surfaces.actorEmbeddedCollectionRead && surfaces.actorEmbeddedDocumentRead)
    || (surfaces.itemEmbeddedCollectionRead && surfaces.itemEmbeddedDocumentRead);
  const required = [
    surfaces.fromUuid || surfaces.actorCollectionGet || surfaces.itemCollectionGet,
    parentReadObserved,
    surfaces.activeEffectClass,
    surfaces.activeEffectIdAccessor,
    surfaces.activeEffectUuidAccessor,
  ];
  const anySurface = Object.values(surfaces).some(Boolean) || parentDocumentTypes.length > 0;
  const status = required.every(Boolean)
    ? "observed"
    : anySurface ? "partial" : "unavailable";
  return Object.freeze({
    status,
    parentDocumentTypes: Object.freeze(parentDocumentTypes),
    activeEffectDocumentName,
    surfaces: Object.freeze(surfaces),
    notes: Object.freeze([
      "Only official ActiveEffect class/accessor and Actor/Item embedded-document surface presence was inspected; no ActiveEffect document or parent method was invoked.",
      "Native createEmbeddedDocuments, update, delete, and applyActiveEffect hook names are evidence of available surfaces only; schema, permissions, authority, hook behavior, and read-back remain unproven.",
    ]),
  });
}

function readRegionBehaviorApiEvidence(runtime) {
  const scenes = runtime.game?.scenes;
  const sampleScene = firstDocument(scenes);
  const sceneRegions = sampleScene?.regions;
  const regionEntries = Array.isArray(sceneRegions)
    ? sceneRegions
    : Array.isArray(sceneRegions?.contents) ? sceneRegions.contents : [];
  const sampleRegion = regionEntries[0];
  const regionClass = runtime.RegionDocument || runtime.foundry?.documents?.RegionDocument;
  const regionPrototype = regionClass?.prototype;
  const behaviorClass = runtime.RegionBehavior || runtime.foundry?.documents?.RegionBehavior;
  const behaviorPrototype = behaviorClass?.prototype;
  const behaviorRegistry = runtime.CONFIG?.RegionBehavior?.dataModels;
  const registeredBehaviorTypes = behaviorRegistry && typeof behaviorRegistry === "object"
    ? Object.keys(behaviorRegistry).sort()
    : [];
  const behaviorEvents = Object.values(behaviorRegistry ?? {}).some((model) =>
    hasProperty(model, "events") || hasProperty(model?.prototype, "events"));
  const regionDocumentName = typeof regionClass?.documentName === "string"
    ? regionClass.documentName
    : typeof regionPrototype?.documentName === "string" ? regionPrototype.documentName : null;
  const regionBehaviorDocumentName = typeof behaviorClass?.documentName === "string"
    ? behaviorClass.documentName
    : typeof behaviorPrototype?.documentName === "string" ? behaviorPrototype.documentName : null;
  const surfaces = {
    fromUuid: typeof runtime.fromUuid === "function",
    sceneCollectionGet: typeof scenes?.get === "function",
    regionEmbeddedCollectionRead: hasMethod(sampleRegion, regionPrototype, "getEmbeddedCollection"),
    regionEmbeddedDocumentRead: hasMethod(sampleRegion, regionPrototype, "getEmbeddedDocument"),
    regionDocumentClass: typeof regionClass === "function" && regionDocumentName === "Region",
    regionBehaviorClass: typeof behaviorClass === "function" && regionBehaviorDocumentName === "RegionBehavior",
    behaviorTypeAccessor: hasProperty(behaviorPrototype, "type"),
    behaviorActiveAccessor: hasProperty(behaviorPrototype, "active"),
    behaviorDisabledAccessor: hasProperty(behaviorPrototype, "disabled"),
    behaviorRegistry: registeredBehaviorTypes.length > 0,
    behaviorEvents,
    regionEmbeddedCreate: hasMethod(sampleRegion, regionPrototype, "createEmbeddedDocuments"),
    regionBehaviorUpdate: hasMethod(undefined, behaviorPrototype, "update"),
    regionBehaviorDelete: hasMethod(undefined, behaviorPrototype, "delete"),
  };
  const required = [
    surfaces.fromUuid || surfaces.sceneCollectionGet,
    surfaces.regionEmbeddedCollectionRead,
    surfaces.regionEmbeddedDocumentRead,
    surfaces.regionDocumentClass,
    surfaces.regionBehaviorClass,
    surfaces.behaviorTypeAccessor,
    surfaces.behaviorRegistry,
    surfaces.behaviorEvents,
  ];
  const anySurface = Object.values(surfaces).some(Boolean) || registeredBehaviorTypes.length > 0;
  const status = required.every(Boolean)
    ? "observed"
    : anySurface ? "partial" : "unavailable";
  return Object.freeze({
    status,
    regionDocumentName,
    regionBehaviorDocumentName,
    registeredBehaviorTypes: Object.freeze(registeredBehaviorTypes),
    surfaces: Object.freeze(surfaces),
    notes: Object.freeze([
      "Only Region/RegionBehavior class, registry, accessor, embedded-document, and subtype event surface presence was inspected; no RegionBehavior method or document read was invoked.",
      "Native createEmbeddedDocuments, update, delete, and RegionBehaviorType event surfaces are static evidence only; subtype schema, event ordering, permissions, authority, and read-back remain unproven.",
    ]),
  });
}

function readOptionalModuleApiEvidence(runtime) {
  const modules = runtime.game?.modules;
  const moduleCollectionGet = typeof modules?.get === "function";
  const hookFramework = typeof runtime.Hooks?.on === "function"
    && (typeof runtime.Hooks?.call === "function" || typeof runtime.Hooks?.callAll === "function");
  const unavailable = () => Object.freeze({
    status: "unavailable",
    resolutionApi: "game.modules.get",
    midiQol: Object.freeze({
      installed: false,
      active: null,
      version: null,
      moduleApiPresent: false,
      globalPresent: false,
      completeItemUse: false,
      applyTokenDamage: false,
    }),
    dae: Object.freeze({
      installed: false,
      active: null,
      version: null,
      moduleApiPresent: false,
    }),
    surfaces: Object.freeze({ moduleCollectionGet, hookFramework }),
    notes: Object.freeze([
      "Foundry game.modules.get was not observed; optional module records and documented Midi-QOL surfaces were not inspected.",
      "DAE public callable API and optional-module behavior remain unproven.",
    ]),
  });
  if (!moduleCollectionGet) return unavailable();

  const readRecord = (record) => Object.freeze({
    installed: Boolean(record),
    active: typeof record?.active === "boolean" ? record.active : null,
    version: typeof record?.version === "string" && record.version.length > 0 ? record.version : null,
    moduleApiPresent: Boolean(record?.api && (typeof record.api === "object" || typeof record.api === "function")),
  });
  const midiRecord = readRecord(modules.get("midi-qol"));
  const daeRecord = readRecord(modules.get("dae"));
  const midiGlobal = runtime.MidiQOL;
  return Object.freeze({
    status: "observed",
    resolutionApi: "game.modules.get",
    midiQol: Object.freeze({
      ...midiRecord,
      globalPresent: Boolean(midiGlobal && (typeof midiGlobal === "object" || typeof midiGlobal === "function")),
      completeItemUse: typeof midiGlobal?.completeItemUse === "function",
      applyTokenDamage: typeof midiGlobal?.applyTokenDamage === "function",
    }),
    dae: daeRecord,
    surfaces: Object.freeze({ moduleCollectionGet, hookFramework }),
    notes: Object.freeze([
      "Only Foundry game.modules.get metadata, optional module API presence, documented MidiQOL method presence, and core Hook presence were inspected; no module method or workflow was invoked.",
      "DAE public callable API and Midi-QOL behavior, permissions, active-GM routing, hook ordering, and read-back remain unproven.",
    ]),
  });
}

const FIXTURE_PLAN_ID = "dbx:plan:foundry-fixture-m21";
const FIXTURE_CONTEXTS = new Set(["GM", "Player3"]);
const FIXTURE_KINDS = new Set(["journal", "activity", "region"]);

function validRuntimeReference(value) {
  return typeof value === "string"
    && value.length > 0
    && value.length <= 240
    && !/[\u0000-\u001f\u007f]/u.test(value);
}

function validFixtureRequest(request) {
  if (!request || typeof request !== "object"
    || request.kind !== "fixture-observation"
    || request.fixturePlanId !== FIXTURE_PLAN_ID
    || !FIXTURE_CONTEXTS.has(request.context)
    || !Array.isArray(request.fixtures)
    || request.fixtures.length !== 3
    || Object.keys(request).some((key) => !["kind", "fixturePlanId", "context", "fixtures"].includes(key))) return false;
  const semanticIds = new Set();
  const kinds = new Set();
  return request.fixtures.every((fixture) => {
    if (!fixture || typeof fixture !== "object"
      || !stableDiceBoxIdPattern.test(fixture.semanticId)
      || !FIXTURE_KINDS.has(fixture.kind)
      || semanticIds.has(fixture.semanticId)
      || kinds.has(fixture.kind)) return false;
    semanticIds.add(fixture.semanticId);
    kinds.add(fixture.kind);
    if (fixture.kind === "journal") {
      if (Object.keys(fixture).some((key) => !["semanticId", "kind", "uuid", "id"].includes(key))) return false;
      return (validRuntimeReference(fixture.uuid) && fixture.uuid.startsWith("JournalEntry.")) || validRuntimeReference(fixture.id);
    }
    if (fixture.kind === "activity") {
      if (Object.keys(fixture).some((key) => !["semanticId", "kind", "parentUuid", "parentId", "activityId"].includes(key))) return false;
      return ((validRuntimeReference(fixture.parentUuid) && fixture.parentUuid.startsWith("Item.")) || validRuntimeReference(fixture.parentId))
        && validRuntimeReference(fixture.activityId);
    }
    if (Object.keys(fixture).some((key) => !["semanticId", "kind", "sceneUuid", "sceneId", "regionId"].includes(key))) return false;
    return ((validRuntimeReference(fixture.sceneUuid) && fixture.sceneUuid.startsWith("Scene.")) || validRuntimeReference(fixture.sceneId))
      && validRuntimeReference(fixture.regionId);
  });
}

function redactedBinding(value) {
  return typeof value === "string" && value.length > 0 ? `redacted:${fnv1a(value)}` : null;
}

function documentBinding(document, suffix = "") {
  const identity = typeof document?.uuid === "string" && document.uuid.length > 0
    ? document.uuid
    : typeof document?.id === "string" && document.id.length > 0 ? document.id : null;
  return redactedBinding(identity ? `${identity}${suffix}` : null);
}

async function resolveFixtureDocument(runtime, collectionName, uuid, id) {
  const collection = runtime.game?.[collectionName];
  if (validRuntimeReference(uuid) && typeof runtime.fromUuid === "function") {
    try {
      const boundDocument = await Promise.resolve(runtime.fromUuid(uuid));
      let document = boundDocument;
      let collectionRead = false;
      if (boundDocument && typeof collection?.get === "function" && validRuntimeReference(boundDocument.id)) {
        collectionRead = true;
        document = collection.get(boundDocument.id) || boundDocument;
      }
      return { document, api: "fromUuid", collection, collectionRead, unknown: false };
    } catch {
      return { document: null, api: "fromUuid", collection, collectionRead: false, unknown: true };
    }
  }
  if (validRuntimeReference(id) && typeof collection?.get === "function") {
    try {
      return { document: collection.get(id), api: `${collectionName}.get`, collection, collectionRead: true, unknown: false };
    } catch {
      return { document: null, api: `${collectionName}.get`, collection, collectionRead: false, unknown: true };
    }
  }
  return { document: null, api: null, collection, collectionRead: false, unknown: true };
}

async function authoritativeFixtureReread(runtime, resolved) {
  const document = resolved?.document;
  if (!document) return { document: null, attempted: false };
  if (typeof runtime.fromUuid === "function" && validRuntimeReference(document.uuid)) {
    try {
      return { document: await Promise.resolve(runtime.fromUuid(document.uuid)), attempted: true };
    } catch {
      return { document: null, attempted: true };
    }
  }
  if (typeof resolved.collection?.get === "function" && validRuntimeReference(document.id)) {
    try {
      return { document: resolved.collection.get(document.id), attempted: true };
    } catch {
      return { document: null, attempted: true };
    }
  }
  return { document, attempted: false };
}

function ownedSemanticMarker(document) {
  const marker = document?.flags?.[PACKAGE_ID];
  return marker && typeof marker.semanticId === "string" && stableDiceBoxIdPattern.test(marker.semanticId)
    ? marker
    : null;
}

function baseFixtureObservation(semanticId, kind, status, document, notes = []) {
  return {
    semanticId,
    kind,
    status,
    bindingFingerprint: documentBinding(document),
    childCount: null,
    shapeCount: null,
    behaviorTypes: [],
    readiness: null,
    notes,
  };
}

async function observeJournalFixture(runtime, fixture) {
  const resolved = await resolveFixtureDocument(runtime, "journal", fixture.uuid, fixture.id);
  if (resolved.unknown) return { observation: baseFixtureObservation(fixture.semanticId, "journal", "unknown", null, ["JournalEntry resolution was uncertain; no retry or mutation was attempted."]), apiUsed: Boolean(resolved.api), reread: false };
  if (!resolved.document) return { observation: baseFixtureObservation(fixture.semanticId, "journal", "missing", null, ["The reviewed JournalEntry binding was not found."]), apiUsed: Boolean(resolved.api), reread: false };
  const reread = await authoritativeFixtureReread(runtime, resolved);
  const document = reread.document || resolved.document;
  const marker = ownedSemanticMarker(document);
  const owned = marker?.semanticId === fixture.semanticId;
  return {
    observation: {
      ...baseFixtureObservation(fixture.semanticId, "journal", owned ? "observed" : "foreign", document, owned
        ? ["Only the owned JournalEntry marker, page count, and redacted binding were read."]
        : ["The resolved JournalEntry was not proven DiceBox-owned and was preserved without exposing content."]),
      childCount: Array.isArray(document?.pages) ? document.pages.length : null,
    },
    apiUsed: Boolean(resolved.api) && resolved.collectionRead && typeof runtime.game?.journal?.get === "function",
    reread: reread.attempted && Boolean(document),
  };
}

async function observeActivityFixture(runtime, fixture) {
  const resolved = await resolveFixtureDocument(runtime, "items", fixture.parentUuid, fixture.parentId);
  if (resolved.unknown) return { observation: baseFixtureObservation(fixture.semanticId, "activity", "unknown", null, ["Item resolution was uncertain; no retry or mutation was attempted."]), apiUsed: Boolean(resolved.api), reread: false };
  if (!resolved.document) return { observation: baseFixtureObservation(fixture.semanticId, "activity", "missing", null, ["The reviewed Item binding was not found."]), apiUsed: Boolean(resolved.api), reread: false };
  const parent = resolved.document;
  if (typeof parent.getEmbeddedDocument !== "function") {
    return { observation: baseFixtureObservation(fixture.semanticId, "activity", "blocked", parent, ["Item.getEmbeddedDocument was not available; Activity.use was not invoked."]), apiUsed: false, reread: false };
  }
  let activity;
  try {
    activity = await Promise.resolve(parent.getEmbeddedDocument("Activity", fixture.activityId));
  } catch {
    return { observation: baseFixtureObservation(fixture.semanticId, "activity", "unknown", parent, ["Activity read outcome was uncertain; no retry was attempted."]), apiUsed: true, reread: false };
  }
  const reread = await authoritativeFixtureReread(runtime, resolved);
  let rereadActivity = reread.document;
  if (rereadActivity && typeof rereadActivity.getEmbeddedDocument === "function") {
    try { rereadActivity = await Promise.resolve(rereadActivity.getEmbeddedDocument("Activity", fixture.activityId)); } catch { rereadActivity = null; }
  }
  const marker = ownedSemanticMarker(parent);
  const owned = marker?.semanticId === fixture.semanticId;
  return {
    observation: {
      ...baseFixtureObservation(fixture.semanticId, "activity", !activity ? "missing" : owned ? "observed" : "foreign", parent, owned
        ? ["The Item Activity was read through getEmbeddedDocument and reread; Activity.use was not invoked."]
        : ["The parent Item was not proven DiceBox-owned; Activity content and configuration were omitted."]),
      childCount: Array.isArray(parent.system?.activities?.contents) ? parent.system.activities.contents.length : null,
      bindingFingerprint: documentBinding(parent, `:activity:${fixture.activityId}`),
      readiness: activity ? {
        canUse: typeof activity.canUse === "boolean" ? activity.canUse : null,
        isOwner: typeof activity.isOwner === "boolean" ? activity.isOwner : null,
      } : null,
    },
    apiUsed: true && resolved.collectionRead,
    reread: reread.attempted && Boolean(rereadActivity),
  };
}

async function observeRegionFixture(runtime, fixture) {
  const resolved = await resolveFixtureDocument(runtime, "scenes", fixture.sceneUuid, fixture.sceneId);
  if (resolved.unknown) return { observation: baseFixtureObservation(fixture.semanticId, "region", "unknown", null, ["Scene resolution was uncertain; no retry or mutation was attempted."]), apiUsed: Boolean(resolved.api), reread: false };
  if (!resolved.document) return { observation: baseFixtureObservation(fixture.semanticId, "region", "missing", null, ["The reviewed Scene binding was not found."]), apiUsed: Boolean(resolved.api), reread: false };
  const scene = resolved.document;
  let region;
  try {
    if (typeof scene.getEmbeddedDocument === "function") region = await Promise.resolve(scene.getEmbeddedDocument("Region", fixture.regionId));
    else if (typeof scene.regions?.get === "function") region = scene.regions.get(fixture.regionId);
  } catch {
    return { observation: baseFixtureObservation(fixture.semanticId, "region", "unknown", scene, ["Region read outcome was uncertain; no retry was attempted."]), apiUsed: true, reread: false };
  }
  if (!region) return { observation: baseFixtureObservation(fixture.semanticId, "region", "missing", scene, ["The reviewed Region binding was not found."]), apiUsed: true, reread: false };
  const reread = await authoritativeFixtureReread(runtime, resolved);
  let rereadRegion = reread.document;
  if (rereadRegion && typeof rereadRegion.getEmbeddedDocument === "function") {
    try { rereadRegion = await Promise.resolve(rereadRegion.getEmbeddedDocument("Region", fixture.regionId)); } catch { rereadRegion = null; }
  }
  const marker = ownedSemanticMarker(region);
  const owned = marker?.semanticId === fixture.semanticId;
  let behaviors = null;
  if (typeof region.getEmbeddedCollection === "function") {
    try { behaviors = region.getEmbeddedCollection("RegionBehavior"); } catch { behaviors = null; }
  }
  const behaviorContents = Array.isArray(behaviors?.contents) ? behaviors.contents : Array.isArray(behaviors) ? behaviors : [];
  const shapeCount = Array.isArray(region.shapes) ? region.shapes.length : null;
  return {
    observation: {
      ...baseFixtureObservation(fixture.semanticId, "region", owned ? "observed" : "foreign", region, owned
        ? ["The Region shape count and RegionBehavior type summaries were read and the parent was reread."]
        : ["The resolved Region was not proven DiceBox-owned; geometry and behavior state were omitted."]),
      childCount: behaviorContents.length,
      shapeCount,
      behaviorTypes: behaviorContents.map((behavior) => typeof behavior?.type === "string" ? behavior.type : null).filter(Boolean).sort(),
    },
    apiUsed: resolved.collectionRead && Boolean(typeof scene.getEmbeddedDocument === "function" || typeof scene.regions?.get === "function")
      && typeof region.getEmbeddedCollection === "function",
    reread: reread.attempted && Boolean(rereadRegion),
  };
}

function fixtureObservationCheck(id, status, reason) {
  const apis = {
    "ready-lifecycle": "Hooks.once(\"ready\")",
    "target-fingerprint": "game.version + game.system.id + game.system.version",
    "active-gm": "game.users.activeGM / User permissions",
    context: "game.user / User.isGM",
    "journal-observation": "fromUuid / game.journal.get / JournalEntry.pages",
    "activity-observation": "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\", id)",
    "region-observation": "game.scenes.get / scene.getEmbeddedDocument(\"Region\", id) / RegionDocument.shapes",
    "authoritative-reread": "fromUuid / document collections / embedded-document getters",
    "no-write": "no Foundry create/update/delete or Activity.use invocation",
  };
  return { id, status, foundryApi: apis[id], reason };
}

function blockedFixtureObservationReceipt(runtime, request, reason) {
  const profile = probeRuntime(runtime);
  const now = new Date().toISOString();
  return Object.freeze({
    schemaVersion: "0.1.0",
    receiptId: `dbx:receipt:fixture-observation-${fnv1a(`${profile.runtimeFingerprint.fingerprintId}:${request?.context ?? "unknown"}`)}`,
    operation: "foundry.fixture.observation",
    status: "blocked",
    evidenceClass: "blocked",
    source: "foundry-ready-hook",
    target: {
      fingerprintId: profile.runtimeFingerprint.fingerprintId,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
    },
    runtimeFingerprint: profile.runtimeFingerprint,
    fixturePlanId: FIXTURE_PLAN_ID,
    context: FIXTURE_CONTEXTS.has(request?.context) ? request.context : "GM",
    activeGm: profile.activeGm,
    observations: [],
    checks: [fixtureObservationCheck("ready-lifecycle", "blocked", reason), fixtureObservationCheck("no-write", "pass", "No Foundry mutation or Activity.use invocation was attempted.")],
    noWrite: true,
    noRawData: true,
    mutation: "disabled",
    observedAt: now,
  });
}

async function observeFixture(runtime, request) {
  if (!validFixtureRequest(request)) return blockedFixtureObservationReceipt(runtime, request, "The fixture observation request failed the fixed M21 shape or exact plan binding.");
  const profile = probeRuntime(runtime);
  const now = new Date().toISOString();
  const exactTarget = profile.runtimeFingerprint.exactTargetMatch;
  if (!exactTarget) return blockedFixtureObservationReceipt(runtime, request, "The runtime fingerprint does not match Foundry 14.367 / D&D5e 5.3.3; no fixture document was read.");

  const activeGm = profile.activeGm;
  const currentIsGm = typeof runtime.game?.user?.isGM === "boolean" ? runtime.game.user.isGM : null;
  const contextMatches = currentIsGm === null ? null : request.context === "GM" ? currentIsGm : !currentIsGm;
  const results = [];
  for (const fixture of request.fixtures) {
    if (fixture.kind === "journal") results.push(await observeJournalFixture(runtime, fixture));
    else if (fixture.kind === "activity") results.push(await observeActivityFixture(runtime, fixture));
    else results.push(await observeRegionFixture(runtime, fixture));
  }
  const byKind = new Map(results.map((result) => [result.observation.kind, result]));
  const kindCheck = (kind) => {
    const result = byKind.get(kind);
    if (!result) return ["unknown", `No ${kind} seed was supplied for this observation context.`];
    if (!result.apiUsed) return ["blocked", `${kind} observation did not reach all required read APIs.`];
    return ["pass", `${kind} read APIs executed without mutation.`];
  };
  const rereadPass = results.length > 0 && results.every((result) => result.reread);
  const checks = [
    fixtureObservationCheck("ready-lifecycle", "pass", "The query is installed and invoked only after the module ready lifecycle."),
    fixtureObservationCheck("target-fingerprint", "pass", "The runtime matches the exact configured target."),
    fixtureObservationCheck("active-gm", activeGm.status === "observed" ? "pass" : "unknown", activeGm.status === "observed" ? "game.users.activeGM was observed in redacted form." : "Active-GM observation is not yet established."),
    fixtureObservationCheck("context", contextMatches === true ? "pass" : contextMatches === false ? "blocked" : "unknown", contextMatches === true ? "The supplied GM/Player3 context matches User.isGM." : "The supplied client context could not be proven from User.isGM."),
    fixtureObservationCheck("journal-observation", ...kindCheck("journal")),
    fixtureObservationCheck("activity-observation", ...kindCheck("activity")),
    fixtureObservationCheck("region-observation", ...kindCheck("region")),
    fixtureObservationCheck("authoritative-reread", rereadPass ? "pass" : "blocked", rereadPass ? "Every supplied fixture was reread through a Foundry binding/collection path." : "At least one fixture did not produce an authoritative reread."),
    fixtureObservationCheck("no-write", "pass", "No create/update/delete API or Activity.use call is present in this observation path."),
  ];
  return Object.freeze({
    schemaVersion: "0.1.0",
    receiptId: `dbx:receipt:fixture-observation-${fnv1a(`${profile.runtimeFingerprint.fingerprintId}:${request.context}`)}`,
    operation: "foundry.fixture.observation",
    status: "observed",
    evidenceClass: "full_function",
    source: "foundry-ready-hook",
    target: {
      fingerprintId: profile.runtimeFingerprint.fingerprintId,
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
    },
    runtimeFingerprint: profile.runtimeFingerprint,
    fixturePlanId: request.fixturePlanId,
    context: request.context,
    activeGm,
    observations: Object.freeze(results.map((result) => result.observation)),
    checks: Object.freeze(checks),
    noWrite: true,
    noRawData: true,
    mutation: "disabled",
    observedAt: now,
  });
}

function readStateStorePlan(runtime, fingerprint, activeGm) {
  const settings = runtime.game?.settings;
  const journal = runtime.game?.journal;
  const documentPrototype = runtime.foundry?.abstract?.Document?.prototype ?? runtime.Document?.prototype;
  const journalPrototype = runtime.JournalEntry?.prototype;
  const exactEvidence = false;
  const settingsObserved = Object.freeze({
    initHook: hasCoreHooks(runtime),
    register: typeof settings?.register === "function",
    get: typeof settings?.get === "function",
    set: typeof settings?.set === "function",
    worldScope: false,
    authoritativeReread: false,
  });
  const flagsObserved = Object.freeze({
    getFlag: typeof documentPrototype?.getFlag === "function",
    setFlag: typeof documentPrototype?.setFlag === "function",
    unsetFlag: typeof documentPrototype?.unsetFlag === "function",
    ownerDocumentBound: false,
    authoritativeReread: false,
  });
  const journalObserved = Object.freeze({
    create: typeof runtime.JournalEntry?.create === "function",
    update: typeof journalPrototype?.update === "function",
    embeddedPageCreate: typeof journalPrototype?.createEmbeddedDocuments === "function",
    fromUuid: typeof runtime.fromUuid === "function",
    collectionGet: typeof journal?.get === "function",
    authoritativeReread: false,
  });
  const blocker = "Exact Foundry 14.367 / D&D5e 5.3.3 behavior, authority, permission, and authoritative reread evidence is not attached.";
  const settingsBlocker = "Foundry settings registration, world scope, active-GM authority, and reread evidence are incomplete.";
  const flagsBlocker = "A stable owning Foundry Document, flag permissions, and flag reread behavior are not proven.";
  const journalBlocker = "JournalEntry persistence shape, permissions, page binding, and authoritative reread are not proven.";
  const candidates = Object.freeze([
    Object.freeze({
      kind: "program-json",
      domain: "semantic-campaign",
      status: "selected",
      authoritativeOwner: "program",
      foundryApis: Object.freeze([]),
      reason: "The program owns canonical semantic campaign state; this driver is not a substitute for Foundry runtime truth.",
      blockers: Object.freeze([]),
    }),
    Object.freeze({
      kind: "foundry-document-native",
      domain: "runtime-projection",
      status: "selected",
      authoritativeOwner: "foundry-runtime",
      foundryApis: Object.freeze(["fromUuid", "game.journal.get", "Document.getFlag"]),
      reason: "Native Foundry Documents remain the runtime authority; DiceBox stores only stable IDs and reviewed managed bindings.",
      blockers: Object.freeze([]),
    }),
    Object.freeze({
      kind: "foundry-settings",
      domain: "transaction-recovery",
      status: "blocked",
      authoritativeOwner: "deferred",
      foundryApis: Object.freeze(["Hooks.once(\"init\")", "game.settings.register", "game.settings.get", "game.settings.set"]),
      reason: "Settings remain a gated candidate; no write is authorized.",
      blockers: Object.freeze([settingsBlocker]),
    }),
    Object.freeze({
      kind: "foundry-document-flags",
      domain: "runtime-projection",
      status: "blocked",
      authoritativeOwner: "deferred",
      foundryApis: Object.freeze(["Document.getFlag", "Document.setFlag", "Document.unsetFlag", "fromUuid"]),
      reason: "Flags cannot become campaign truth without an exact owning Document and reread proof.",
      blockers: Object.freeze([flagsBlocker]),
    }),
    Object.freeze({
      kind: "foundry-journal",
      domain: "semantic-campaign",
      status: "blocked",
      authoritativeOwner: "deferred",
      foundryApis: Object.freeze(["JournalEntry.create", "JournalEntry.update", "entry.createEmbeddedDocuments(\"JournalEntryPage\", ...)", "fromUuid", "game.journal.get"]),
      reason: "JournalEntry storage remains a migration candidate until page schema and recovery behavior are proven.",
      blockers: Object.freeze([journalBlocker]),
    }),
  ]);
  const blockers = Object.freeze([blocker, settingsBlocker, flagsBlocker, journalBlocker]);
  const migration = Object.freeze({
    schemaVersion: "0.1.0",
    planId: `dbx:state-migration:${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}`,
    status: "blocked",
    noWrite: true,
    entries: Object.freeze([
      Object.freeze({ fieldId: "campaign.semantic-state", source: "program-json", target: "program-json", operation: "retain", foundryApis: Object.freeze([]), requiresAuthoritativeReread: false, reason: "Canonical semantic state stays in the program store; no Foundry copy is authoritative." }),
      Object.freeze({ fieldId: "projection.runtime-binding", source: "program-json", target: "foundry-document-native", operation: "copy-binding", foundryApis: Object.freeze(["fromUuid", "game.journal.get", "Document.getFlag"]), requiresAuthoritativeReread: true, reason: "Only reviewed stable-ID-to-Foundry bindings may be projected, then reread from Foundry." }),
      Object.freeze({ fieldId: "transaction.recovery-journal", source: "program-json", target: "foundry-settings", operation: "replay-journal", foundryApis: Object.freeze(["Hooks.once(\"init\")", "game.settings.register", "game.settings.get", "game.settings.set"]), requiresAuthoritativeReread: true, reason: "Recovery history may be replayed into a bounded world setting only after exact evidence and GM recheck." }),
      Object.freeze({ fieldId: "foreign.runtime-state", source: "foundry-document-native", target: "foundry-document-native", operation: "preserve-unknown", foundryApis: Object.freeze(["fromUuid", "Document.getFlag"]), requiresAuthoritativeReread: true, reason: "Unknown, foreign, and runtime-owned state is preserved and never migrated by omission." }),
    ]),
    blockers,
  });
  return Object.freeze({
    schemaVersion: "0.1.0",
    planId: `dbx:state-store-plan:${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}`,
    status: "blocked",
    evidenceClass: "deterministic",
    noWrite: true,
    targetFingerprintId: fingerprint.fingerprintId,
    candidates,
    migration,
    blockers,
    nextGates: Object.freeze([
      "Capture exact Foundry 14.367 settings, flag, JournalEntry, authority, and authoritative reread receipts.",
      "Select one bounded transaction-recovery driver only after active-GM and restart/recovery evidence.",
      "Run a migration preview against redacted stable IDs and preserve foreign or unknown runtime state.",
      "Keep campaign compilation and broad mutation disabled until the M0/M15 review gates pass.",
    ]),
  });
}

function readinessSurfaceStatus(status) {
  return status === "observed" ? "pass" : status === "partial" ? "unknown" : "blocked";
}

function readinessCheck(id, title, foundryApi, status, reason) {
  return Object.freeze({ id, title, status, required: true, foundryApi, reason });
}

const CERTIFICATE_LANE_APIS = Object.freeze({
  contract: "No runtime call; DiceBox ownership and safety contracts",
  static: "Foundry module.json + ES module syntax boundary",
  deterministic: "Versioned Foundry adapters, receipts, and read-back contracts",
  "isolated-browser": "Foundry client DOM/canvas plus module diagnostics surface",
  "visible-browser": "Foundry client, Hooks, game.users, document collections, and console evidence",
  "exact-runtime": "Hooks.once(\"ready\"), game.version, game.system, native Document APIs, User permissions, and authoritative reread",
});

function certificateLane(id, title, status, source, evidenceClass, reason, receiptIds = []) {
  return Object.freeze({
    id,
    title,
    status,
    source,
    evidenceClass,
    foundryApi: CERTIFICATE_LANE_APIS[id],
    receiptIds: Object.freeze(receiptIds),
    reason,
  });
}

function readReadinessCertificate(evidence) {
  const profile = evidence.profile ?? evidence;
  const fingerprint = evidence.runtimeFingerprint;
  const probeReceipt = evidence.probeReceipt;
  const lanes = Object.freeze([
    certificateLane("contract", "Contract evidence lane", "pass", "contract", "static", "DiceBox ownership and safety contracts are loaded."),
    certificateLane("static", "Static package lane", "pass", "static-tooling", "static", "The installed module is loaded through the reviewed Foundry ES module boundary."),
    certificateLane("deterministic", "Deterministic fixture lane", "pass", "deterministic-fixture", "deterministic", "The read-only Foundry probe and reviewed adapter receipts are composed without mutation.", [probeReceipt.receiptId]),
    certificateLane("isolated-browser", "Utility Harness lane", "unknown", "utility-harness", "blocked", "No reviewed exact-world Utility Harness receipt is attached."),
    certificateLane("visible-browser", "Visible Chrome lane", "unknown", "visible-chrome", "blocked", "No exact-world visible Chrome receipt is attached."),
    certificateLane("exact-runtime", "Exact Foundry lane", "blocked", "foundry-exact", "blocked", "Exact Foundry behavior, authority, operation, recovery, and authoritative reread evidence is unavailable."),
  ]);
  const exactTargetMatch = Boolean(fingerprint?.exactTargetMatch);
  const blockers = lanes.filter((lane) => lane.status !== "pass").map((lane) => ({
    laneId: lane.id,
    title: lane.title,
    foundryApi: lane.foundryApi,
    reason: lane.reason,
  }));
  if (!exactTargetMatch) blockers.push({
    laneId: "exact-runtime",
    title: "Exact target fingerprint",
    foundryApi: CERTIFICATE_LANE_APIS["exact-runtime"],
    reason: "Expected Foundry 14.367 / D&D5e 5.3.3 was not observed in the runtime fingerprint.",
  });
  const uniqueBlockers = [...new Map(blockers.map((entry) => [`${entry.laneId}:${entry.title}`, entry])).values()];
  const summary = Object.freeze({
    pass: lanes.filter((lane) => lane.status === "pass").length,
    blocked: lanes.filter((lane) => lane.status === "blocked").length,
    unknown: lanes.filter((lane) => lane.status === "unknown").length,
    total: lanes.length,
  });
  const certificateId = `dbx:certificate:${profile.phase}-${fingerprint?.fingerprintId?.split(":").at(-1) ?? "unknown"}`;
  const status = uniqueBlockers.length === 0 ? "ready" : "blocked";
  return Object.freeze({
    certificate: Object.freeze({
      schemaVersion: "0.1.0",
      certificateId,
      status,
      evidenceClass: status === "ready" ? "full_function" : "deterministic",
      noWrite: true,
      observedAt: profile.observedAt ?? null,
      target: Object.freeze({
        foundryVersion: profile.foundryVersion ?? null,
        systemId: profile.systemId ?? null,
        systemVersion: profile.systemVersion ?? null,
        exactTargetMatch,
      }),
      summary,
      lanes,
      blockers: Object.freeze(uniqueBlockers),
      nextGates: Object.freeze([
        "Complete the exact Foundry 14.367 / D&D5e 5.3.3 runtime lane with a frozen fingerprint.",
        "Prove GM/player authority, permission, update-hook, native operation, authoritative reread, timeout recovery, and foreign-state preservation.",
        "Retain Utility Harness and visible Chrome traces/screenshots plus exact-world receipts alongside the certificate.",
      ]),
    }),
    receipt: Object.freeze({
      receiptVersion: 1,
      receiptId: `dbx:receipt:readiness-certificate-${fingerprint?.fingerprintId?.split(":").at(-1) ?? "unknown"}`,
      operation: "readiness-certificate.compose",
      status: "observed",
      evidenceClass: status === "ready" ? "full_function" : "deterministic",
      authority: "none",
      semanticRefs: [],
      observedAt: profile.observedAt ?? new Date(0).toISOString(),
      notes: Object.freeze(["Certificate composition is read-only and does not certify a Foundry world by itself."]),
    }),
  });
}

function readReadinessReport(evidence) {
  const profile = evidence.profile ?? evidence;
  const { runtimeFingerprint: fingerprint, probeReceipt } = evidence;
  const activeGm = evidence.activeGm;
  const optional = evidence.optionalModuleApi;
  const checks = [
    readinessCheck(
      "foundry-target-fingerprint",
      "Exact Foundry and D&D5e target fingerprint",
      "game.version + game.system.id + game.system.version",
      fingerprint.exactTargetMatch ? "pass" : "blocked",
      fingerprint.exactTargetMatch
        ? "The observed profile matches Foundry 14.367 and D&D5e 5.3.3."
        : "The exact Foundry 14.367 / D&D5e 5.3.3 target was not observed; runtime promotion is blocked.",
    ),
    readinessCheck(
      "probe-no-write",
      "Read-only ready-lifecycle probe",
      "Hooks.once(\"ready\") + read-only runtime registries",
      probeReceipt.noWrite ? "pass" : "blocked",
      probeReceipt.noWrite
        ? "The runtime probe records metadata and registries without mutation."
        : "The probe receipt does not prove a no-write boundary.",
    ),
    readinessCheck(
      "active-gm-observation",
      "Active GM observation",
      "game.users.activeGM / game.users.getDesignatedUser",
      activeGm.status === "observed" ? "pass" : activeGm.status === "unknown" ? "unknown" : "blocked",
      activeGm.status === "observed"
        ? "An active-GM observation exists; execution authority still requires an immediate reread."
        : "Active-GM identity/election is not sufficiently observed for an execution boundary.",
    ),
    readinessCheck(
      "journal-api-surface",
      "Managed JournalEntry API surface",
      "JournalEntry.create / fromUuid / game.journal.get / JournalEntry.update / createEmbeddedDocuments(\"JournalEntryPage\")",
      readinessSurfaceStatus(evidence.journalApi.status),
      evidence.journalApi.status === "observed"
        ? "The named JournalEntry surfaces and page schema were observed; behavior and permission still require exact-runtime proof."
        : "The JournalEntry surface or page schema is incomplete.",
    ),
    readinessCheck(
      "managed-journal-readback",
      "Managed JournalEntry authoritative read-back",
      "fromUuid / game.journal.get / game.journal.contents",
      evidence.managedJournalSnapshot.status === "observed" ? "pass" : "unknown",
      evidence.managedJournalSnapshot.status === "observed"
        ? "Owned JournalEntry observations are available; a live create/update/read-back proof is still required."
        : "A managed JournalEntry collection snapshot was not observed.",
    ),
    readinessCheck(
      "activity-api-surface",
      "D&D5e Activity API surface",
      "fromUuid / game.items.get / item.getEmbeddedDocument(\"Activity\") / activity.use / dnd5e.preUseActivity / dnd5e.postUseActivity",
      readinessSurfaceStatus(evidence.activityApi.status),
      evidence.activityApi.status === "observed"
        ? "Activity surfaces were observed without invocation; hook behavior, permission, and use outcomes remain unproven."
        : "The D&D5e Activity surface is incomplete.",
    ),
    readinessCheck(
      "active-effect-api-surface",
      "Native ActiveEffect API surface",
      "parent.getEmbeddedCollection(\"ActiveEffect\") / parent.getEmbeddedDocument(\"ActiveEffect\")",
      readinessSurfaceStatus(evidence.activeEffectApi.status),
      evidence.activeEffectApi.status === "observed"
        ? "Native ActiveEffect surfaces were observed without invocation; schema, permission, and read-back remain unproven."
        : "The native ActiveEffect surface is incomplete.",
    ),
    readinessCheck(
      "region-behavior-api-surface",
      "RegionBehavior API and registry surface",
      "region.getEmbeddedCollection(\"RegionBehavior\") / CONFIG.RegionBehavior.dataModels / RegionBehaviorType.events",
      readinessSurfaceStatus(evidence.regionBehaviorApi.status),
      evidence.regionBehaviorApi.status === "observed"
        ? "RegionBehavior surfaces were observed without invocation; subtype schema, event behavior, permission, and read-back remain unproven."
        : "The RegionBehavior surface or registry is incomplete.",
    ),
    readinessCheck(
      "optional-module-boundary",
      "Optional-module ownership boundary",
      "game.modules.get(\"midi-qol\") / game.modules.get(\"dae\") / MidiQOL documented methods",
      optional.status !== "observed"
        ? readinessSurfaceStatus(optional.status)
        : optional.midiQol.active === true || optional.dae.active === true ? "unknown" : "pass",
      optional.midiQol.active === true || optional.dae.active === true
        ? "Optional modules are active; exact behavior, ownership, authority, and read-back adapters are required."
        : "Optional-module presence is bounded to evidence and does not displace native mechanic ownership.",
    ),
    readinessCheck(
      "native-mutation-disabled",
      "Mutation remains disabled until exact gates pass",
      "Foundry Document factory/update/delete APIs behind exact-version adapters",
      "pass",
      "The current module and program bridge expose no executable world mutation path.",
    ),
    readinessCheck(
      "exact-runtime-behavior",
      "Exact-runtime behavior and permission proof",
      "Foundry document lifecycle, User permissions, Hooks, and authoritative reread APIs",
      "blocked",
      "Static API presence and deterministic fixtures do not certify live behavior, permissions, sender semantics, or read-back.",
    ),
  ];
  const blockers = checks.filter((entry) => entry.status !== "pass").map((entry) => Object.freeze({
    checkId: entry.id,
    title: entry.title,
    foundryApi: entry.foundryApi,
    reason: entry.reason,
  }));
  const summary = Object.freeze({
    pass: checks.filter((entry) => entry.status === "pass").length,
    blocked: checks.filter((entry) => entry.status === "blocked").length,
    unknown: checks.filter((entry) => entry.status === "unknown").length,
    total: checks.length,
  });
  return Object.freeze({
    schemaVersion: "0.1.0",
    reportId: `dbx:readiness:${fingerprint.fingerprintId.split(":").at(-1) ?? "unknown"}-${profile.phase}`,
    status: blockers.length === 0 ? "ready" : "blocked",
    evidenceClass: profile.phase === "m0" ? "static" : "deterministic",
    source: probeReceipt.source,
    noWrite: true,
    observedAt: profile.observedAt,
    target: Object.freeze({
      foundryVersion: profile.foundryVersion,
      systemId: profile.systemId,
      systemVersion: profile.systemVersion,
      exactTargetMatch: fingerprint.exactTargetMatch,
    }),
    summary,
    checks: Object.freeze(checks),
    blockers: Object.freeze(blockers),
    nextGates: Object.freeze([
      "Run the installed diagnostics queries in the exact Foundry 14.367 / D&D5e 5.3.3 disposable world.",
      "Prove active-GM election, sender semantics, and immediate authority reread with GM and player clients.",
      "Exercise each selected native Foundry/D&D5e operation through its exact adapter and verify authoritative read-back.",
      "Bind optional Midi-QOL/DAE adapters only after behavior, ownership, permissions, hooks, and recovery are proven.",
    ]),
  });
}

/** Produce a serializable snapshot without rewriting unknown or foreign state. */
export function probeRuntime(runtime = globalThis) {
  const game = runtime.game;
  const system = readSystem(runtime);
  const foundryVersion = typeof game?.version === "string" ? game.version : null;
  const hasGame = Boolean(game);
  const hasHooks = hasCoreHooks(runtime);
  const documentTypes = readDocumentTypes(runtime);
  const activeModuleIds = readActiveModuleIds(runtime);
  const users = game?.users;
  const hasActiveGmSurface = Boolean(users && typeof users === "object")
    && ("activeGM" in users || typeof users.getDesignatedUser === "function");

  const capabilities = [
    capability("bridge.describe", "available", "Read-only package description is local to DiceBox."),
    capability("bridge.health", "available", "Read-only health is local to DiceBox."),
    capability("bridge.query", "available", "Read-only runtime snapshot queries are available."),
    capability("bridge.execute.readonly", hasGame ? "available" : "unavailable",
      hasGame ? "The module can expose read-only observations." : "Foundry game state is not initialized."),
    capability("foundry.runtime.probe", hasGame && hasHooks ? "available" : "unavailable",
      hasGame && hasHooks ? "Foundry game and lifecycle hook surfaces were observed." : "Foundry game or Hooks surface is unavailable."),
    capability("foundry.document.read", hasDocumentReadSurface(runtime) ? "available" : "unavailable",
      hasDocumentReadSurface(runtime) ? "World document collections were observed." : "Required world document collections were not observed."),
    capability("foundry.scene.read", hasSceneReadSurface(runtime) ? "available" : "unavailable",
      hasSceneReadSurface(runtime) ? "Foundry Scene resolution through game.scenes.get or fromUuid was observed." : "No reviewed Foundry Scene read surface was observed."),
    capability("foundry.scene.write", "unavailable",
      "No Scene projection adapter is installed in the runtime-probe slice; Scene.create/update remain gated."),
    capability("foundry.scene.placeable.read", hasSceneReadSurface(runtime) ? "unknown" : "unavailable",
      hasSceneReadSurface(runtime) ? "Scene resolution exists; exact embedded placeable collection shape still requires a dedicated probe." : "No Scene read surface exists from which placeables can be observed."),
    capability("foundry.scene.placeable.write", "unavailable",
      "No placeable projection adapter is installed; Scene embedded document writes remain gated."),
    capability("foundry.region.read", hasRegionReadSurface(runtime) ? "unknown" : hasSceneReadSurface(runtime) ? "unknown" : "unavailable",
      hasRegionReadSurface(runtime) ? "A Scene embedded Region property was observed; exact Region shape still requires a dedicated probe." : hasSceneReadSurface(runtime) ? "Scene resolution exists; exact embedded Region shape still requires a dedicated probe." : "No Scene read surface exists from which Regions can be observed."),
    capability("foundry.region.write", "unavailable",
      "No Region projection adapter is installed in the runtime-probe slice; createEmbeddedDocuments(\"Region\", ...) remains gated."),
    capability("foundry.media.deploy", "unavailable",
      "No approved media deployment adapter is installed; FilePicker browse does not authorize upload, replacement, or deployment."),
    capability("foundry.users.active-gm", hasActiveGmSurface ? "unknown" : "unavailable",
      hasActiveGmSurface ? "Foundry activeGM/designated-user API exists; exact sender semantics still require a live two-client probe." : "User activeGM/designation API was not observed."),
    capability("dnd5e.activities", system.id === "dnd5e" && hasActivityRegistry(runtime) ? "available" : "unknown",
      system.id === "dnd5e" && hasActivityRegistry(runtime) ? "D&D5e Activity registry was observed." : "D&D5e Activity capability requires an exact system/runtime inspection."),
    capability("dnd5e.activity-hooks", system.id === "dnd5e" && hasHooks ? "unknown" : "unavailable",
      system.id === "dnd5e" && hasHooks ? "Hook framework exists; Activity hook behavior still requires a live fixture." : "D&D5e or the core Hook surface was not observed."),
    capability("foundry.document.write", "unavailable",
      "No write adapter is installed in the runtime-probe slice; document mutation remains gated."),
  ];

  const profile = {
    phase: hasGame ? "runtime-probe" : "m0",
    foundryVersion,
    systemId: system.id,
    systemVersion: system.version,
    observedAt: hasGame ? new Date().toISOString() : null,
    activeModuleIds: Object.freeze(activeModuleIds),
    documentTypes: Object.freeze(documentTypes),
    capabilities: Object.freeze(capabilities),
  };
  const fingerprint = createRuntimeFingerprint(profile);
  const baseEvidence = {
    ...profile,
    fingerprintId: fingerprint.fingerprintId,
    runtimeFingerprint: fingerprint,
    probeReceipt: createRuntimeProbeReceipt(profile, fingerprint),
    activeGm: createActiveGmEvidence(runtime),
    managedJournalSnapshot: readManagedJournalSnapshot(runtime),
    journalApi: readJournalApiEvidence(runtime),
    activityApi: readActivityApiEvidence(runtime),
    activeEffectApi: readActiveEffectApiEvidence(runtime),
    regionBehaviorApi: readRegionBehaviorApiEvidence(runtime),
    optionalModuleApi: readOptionalModuleApiEvidence(runtime),
  };
  const stateStorePlan = readStateStorePlan(runtime, fingerprint, baseEvidence.activeGm);
  return Object.freeze({ ...baseEvidence, stateStorePlan, readinessReport: readReadinessReport({ ...baseEvidence, stateStorePlan }), readinessCertificate: readReadinessCertificate({ ...baseEvidence, stateStorePlan }) });
}

function createReadOnlyApi(evidence, runtime) {
  const profile = Object.freeze({
    phase: evidence.phase,
    foundryVersion: evidence.foundryVersion,
    systemId: evidence.systemId,
    systemVersion: evidence.systemVersion,
    observedAt: evidence.observedAt,
    activeModuleIds: evidence.activeModuleIds,
    documentTypes: evidence.documentTypes,
    capabilities: evidence.capabilities,
  });
  const byId = new Map(profile.capabilities.map((entry) => [entry.id, entry]));
  const api = {
    describe: () => Object.freeze({
      packageId: PACKAGE_ID,
      contractVersion: CONTRACT_VERSION,
      phase: profile.phase,
      mutationEnabled: false,
    }),
    supports: (id) => byId.get(id) ?? capability(id, "unknown", "Capability is not present in this runtime snapshot."),
    query: (query) => query?.kind === "runtime-profile"
      ? profile
      : query?.kind === "runtime-evidence"
        ? Object.freeze({
          profile,
          runtimeFingerprint: evidence.runtimeFingerprint,
          probeReceipt: evidence.probeReceipt,
          activeGm: evidence.activeGm,
          managedJournalSnapshot: evidence.managedJournalSnapshot,
          journalApi: evidence.journalApi,
          activityApi: evidence.activityApi,
          activeEffectApi: evidence.activeEffectApi,
          regionBehaviorApi: evidence.regionBehaviorApi,
          optionalModuleApi: evidence.optionalModuleApi,
          stateStorePlan: evidence.stateStorePlan,
          readinessReport: evidence.readinessReport,
          readinessCertificate: evidence.readinessCertificate,
        })
        : query?.kind === "managed-journal-snapshot"
          ? evidence.managedJournalSnapshot
        : query?.kind === "journal-api-evidence"
          ? evidence.journalApi
        : query?.kind === "activity-api-evidence"
          ? evidence.activityApi
        : query?.kind === "active-effect-api-evidence"
          ? evidence.activeEffectApi
        : query?.kind === "region-behavior-api-evidence"
          ? evidence.regionBehaviorApi
        : query?.kind === "optional-module-api-evidence"
          ? evidence.optionalModuleApi
        : query?.kind === "state-store-plan"
          ? evidence.stateStorePlan
        : query?.kind === "readiness-report"
          ? evidence.readinessReport
          : query?.kind === "readiness-certificate"
          ? evidence.readinessCertificate
        : query?.kind === "fixture-observation"
          ? observeFixture(runtime, query)
        : Object.freeze(profile.capabilities),
    health: () => Object.freeze({
      status: "safe-mode",
      ready: false,
      reason: profile.phase === "runtime-probe" ? "Runtime is observed but mutation readiness is not enabled." : "Foundry runtime has not been probed.",
    }),
    resolve: () => ({ ok: false, error: Object.freeze({
      code: "NOT_READY",
      message: "Runtime binding resolution is unavailable until the exact runtime gate is passed.",
      retry: "never",
    }) }),
    execute: async () => ({ ok: false, error: Object.freeze({
      code: "NOT_READY",
      message: "The read-only bridge has no executable runtime commands.",
      retry: "never",
    }) }),
  };
  return Object.freeze(api);
}

function installApi(runtime, api) {
  const game = runtime.game;
  if (!game || Object.prototype.hasOwnProperty.call(game, "diceboxCampaignHelper")) return false;
  Object.defineProperty(game, "diceboxCampaignHelper", {
    configurable: false,
    enumerable: false,
    value: api,
    writable: false,
  });
  return true;
}

export function bootstrapDiceBoxCampaignHelper(runtime = globalThis) {
  const install = () => {
    const api = createReadOnlyApi(probeRuntime(runtime), runtime);
    installApi(runtime, api);
    return api;
  };

  if (typeof runtime.Hooks?.once === "function") {
    runtime.Hooks.once("ready", install);
    return Object.freeze({ packageId: PACKAGE_ID, phase: "runtime-probe", mutationEnabled: false, installScheduled: true });
  }

  const profile = probeRuntime(runtime);
  return Object.freeze({ packageId: PACKAGE_ID, phase: profile.phase, mutationEnabled: false, installScheduled: false });
}

bootstrapDiceBoxCampaignHelper();
