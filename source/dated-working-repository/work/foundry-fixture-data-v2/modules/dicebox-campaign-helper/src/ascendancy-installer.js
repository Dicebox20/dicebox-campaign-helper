/**
 * DiceBox Ascendancy spatial installer.
 *
 * The compiled campaign package is the source of truth. This adapter owns
 * only Scene, Wall, and base Region creation; Regionwright owns popup and
 * native RegionBehavior wiring, while the Scene engine owns tram movement.
 * The write path is active-GM-only, exact-runtime-gated, idempotent for
 * DiceBox-owned documents, and rereads every created document before it can
 * report success. Foreign documents are never updated or deleted.
 */

const MODULE_ID = "dicebox-campaign-helper";
const PACKAGE_URL = `modules/${MODULE_ID}/ascendancy-campaign-package.json`;
const EXACT_FOUNDRY_VERSION = "14.367";
const SYSTEM_ID = "dnd5e";
const SYSTEM_VERSION = "5.3.3";
const FLAG_SCOPE = MODULE_ID;
const FLAG_KEY = "managed";
const INSTALLER_KEY = "diceboxCampaignHelperInstall";
const WALL_NORMAL = 20;
const SIGNAL_RUNE_CANDIDATE_ID = "m1141-signal-rune";
const SIGNAL_RUNE_CANDIDATE_ROOM_IDS = Object.freeze([
  "dbx:room:signal-frequency-chamber",
  "dbx:room:rune-mechanism-chamber",
]);
const SIGNAL_RUNE_EXCLUDED_ROOM_IDS = Object.freeze([
  "dbx:room:ascendancy-tram-depot",
  "dbx:room:central-core-control-chamber",
]);
const CANDIDATE_TRANSPORT_DIAGNOSTIC_OPERATION = "ascendancy.signal-rune-candidate-transport.diagnostic";
const CANDIDATE_TRANSPORT_DIAGNOSTIC_CONTROL_ID = "dicebox-ascendancy-candidate-transport-diagnostic";
const CANDIDATE_TRANSPORT_DIAGNOSTIC_TITLE = "Show DiceBox Signal/Rune Candidate Transport Diagnostic";
const CANDIDATE_WRITE_PREVIEW_OPERATION = "ascendancy.signal-rune-candidate.write-preview";
const CANDIDATE_WRITE_OPERATION = "ascendancy.signal-rune-candidate.create";
const CANDIDATE_WRITE_CONTROL_ID = "dicebox-ascendancy-signal-rune-create";
const CANDIDATE_WRITE_TITLE = "Create DiceBox Signal/Rune Candidate";
const CURRENT_ARTIFACT_SPEC_ID = "dbx:foundry-spec:current-product-0.1.15-m1178";
const CURRENT_ARTIFACT_VERIFIER_ID = "dbx:foundry-verifier:current-product-0.1.15-m1178";
const CANDIDATE_ARTIFACT_REFS = Object.freeze({
  specId: CURRENT_ARTIFACT_SPEC_ID,
  verifierId: CURRENT_ARTIFACT_VERIFIER_ID,
  source: Object.freeze({ artifactId: "dbx:foundry-artifact:installer", path: "packages/dicebox-foundry/src/ascendancy-installer.js", evidence: "source" }),
  staged: Object.freeze({ artifactId: "dbx:foundry-artifact:installer", path: "Data/modules/dicebox-campaign-helper/src/ascendancy-installer.js", evidence: "m1178-not-attested-local-only" }),
  served: Object.freeze({ artifactId: "dbx:foundry-artifact:installer", path: "modules/dicebox-campaign-helper/src/ascendancy-installer.js", evidence: "m1178-not-attested-local-only" }),
});

function clone(value) {
  return structuredClone(value);
}

function flagFor(kind, semanticId, packageId) {
  return {
    flags: {
      [FLAG_SCOPE]: {
        [FLAG_KEY]: {
          packageId,
          kind,
          semanticId,
          schemaVersion: "0.1.0",
          owner: "dicebox-campaign-helper",
        },
      },
    },
  };
}

function ownedDocument(document, kind, semanticId, packageId) {
  const marker = document?.flags?.[FLAG_SCOPE]?.[FLAG_KEY];
  return marker?.owner === "dicebox-campaign-helper"
    && marker?.packageId === packageId
    && marker?.kind === kind
    && marker?.semanticId === semanticId;
}

function activeGm(runtime) {
  const user = runtime.game?.user;
  const elected = runtime.game?.users?.activeGM;
  return Boolean(user?.isGM && elected?.id && user.id === elected.id);
}

function runtimeGate(runtime) {
  const game = runtime.game;
  const system = game?.system;
  const checks = [
    [game?.version === EXACT_FOUNDRY_VERSION, `Foundry ${EXACT_FOUNDRY_VERSION} is required for native writes; observed ${game?.version ?? "unknown"}.`],
    [system?.id === SYSTEM_ID && system?.version === SYSTEM_VERSION, `D&D5e ${SYSTEM_VERSION} is required; observed ${system?.id ?? "unknown"} ${system?.version ?? "unknown"}.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [typeof runtime.Scene?.create === "function", "Scene.create was not observed."],
    [typeof runtime.game?.scenes?.contents !== "undefined", "game.scenes.contents was not observed."],
  ];
  const failed = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: failed.length === 0, checks: Object.freeze(checks.map(([pass, reason]) => ({ pass, reason }))), failed: Object.freeze(failed) });
}

function assetPath(asset) {
  const filename = String(asset.path ?? "").split(/[\\/]/).at(-1);
  if (!filename) throw new Error(`Asset ${asset.assetId} has no filename.`);
  return `modules/${MODULE_ID}/assets/maps/${filename}`;
}

function tileAssetPath(tile) {
  const filename = String(tile.assetPath ?? "").split(/[\\/]/).at(-1);
  if (!filename) throw new Error(`Static Tile ${tile.tileId} has no filename.`);
  return `modules/${MODULE_ID}/assets/tiles/${filename}`;
}

function levelContents(scene) {
  const levels = scene?.levels;
  if (Array.isArray(levels?.contents)) return levels.contents;
  if (typeof levels?.values === "function") return Array.from(levels.values());
  return [];
}

/** Foundry 14 stores a Scene renderer on its initial embedded Level. */
function initialLevel(scene) {
  if (scene?.initialLevel) return scene.initialLevel;
  if (scene?.firstLevel) return scene.firstLevel;
  const levels = levelContents(scene);
  return levels.length === 1 ? levels[0] : null;
}

function rendererSource(scene) {
  return initialLevel(scene)?.background?.src ?? null;
}

/**
 * Resolve the only currently authorized candidate transport. This is pure
 * package selection; it does not call Foundry or materialize native payload.
 */
export function selectAscendancySignalRuneCandidateScope(packageData, candidateId = SIGNAL_RUNE_CANDIDATE_ID) {
  if (candidateId !== SIGNAL_RUNE_CANDIDATE_ID) throw new Error(`Unknown candidate selector ${candidateId}; refusing installer scope.`);
  const rooms = packageData?.campaign?.rooms;
  if (!Array.isArray(rooms)) throw new Error("Candidate transport requires a compiled campaign room list.");
  const roomIds = rooms.map((room) => room?.roomId);
  if (new Set(roomIds).size !== roomIds.length) throw new Error("Candidate transport rejects duplicate campaign room IDs.");
  if (roomIds.length !== 4 || !roomIds.every((roomId) => [...SIGNAL_RUNE_CANDIDATE_ROOM_IDS, ...SIGNAL_RUNE_EXCLUDED_ROOM_IDS].includes(roomId))) {
    throw new Error("Candidate transport requires the exact four-room campaign package.");
  }
  const selectedRooms = SIGNAL_RUNE_CANDIDATE_ROOM_IDS.map((roomId) => rooms.find((room) => room?.roomId === roomId));
  if (selectedRooms.some((room) => !room)) throw new Error("Candidate transport could not resolve the exact Signal/Rune room set.");
  const assets = packageData?.assets?.bound;
  if (!Array.isArray(assets)) throw new Error("Candidate transport requires bound package assets.");
  const selectedAssets = selectedRooms.map((room) => assets.find((asset) => asset?.assetId === room.assetId));
  if (selectedAssets.some((asset) => !asset || asset.status !== "scene-bound" || typeof asset.path !== "string" || asset.path.length === 0)) {
    throw new Error("Candidate transport requires complete selected Signal/Rune assets.");
  }
  return Object.freeze({
    candidateId,
    rooms: Object.freeze(selectedRooms),
    assets: Object.freeze(selectedAssets),
    excludedRoomIds: SIGNAL_RUNE_EXCLUDED_ROOM_IDS,
  });
}

function candidateTransportRuntimeGate(runtime) {
  const game = runtime.game;
  const system = game?.system;
  const checks = [
    [game?.version === EXACT_FOUNDRY_VERSION, `Foundry ${EXACT_FOUNDRY_VERSION} is required; observed ${game?.version ?? "unknown"}.`],
    [system?.id === SYSTEM_ID && system?.version === SYSTEM_VERSION, `D&D5e ${SYSTEM_VERSION} is required; observed ${system?.id ?? "unknown"} ${system?.version ?? "unknown"}.`],
    [activeGm(runtime), "The current user must be the elected active GM."],
    [Array.isArray(game?.scenes?.contents), "The read-only Scene collection is unavailable."],
  ];
  const failed = checks.filter(([pass]) => !pass).map(([, reason]) => reason);
  return Object.freeze({ pass: failed.length === 0, failed: Object.freeze(failed) });
}

function blockedCandidateTransportDiagnostic(blockers) {
  return Object.freeze({
    receiptVersion: 1,
    operation: CANDIDATE_TRANSPORT_DIAGNOSTIC_OPERATION,
    status: "BLOCKED",
    evidenceClass: "blocked",
    readyClaim: false,
    noWrite: true,
    apply: false,
    dispatch: "disabled",
    candidateTransportImplemented: true,
    runtimeExposure: "diagnostic-only-candidate-install-repair-disabled",
    candidateInstallExposed: false,
    candidateRepairExposed: false,
    blockers: Object.freeze([...blockers]),
    bindings: null,
    payload: null,
    proposal: null,
    artifactIdentity: CANDIDATE_ARTIFACT_REFS,
  });
}

async function readPackageWithoutCaching(runtime) {
  if (runtime.__diceboxAscendancyPackage) return runtime.__diceboxAscendancyPackage;
  if (typeof runtime.fetch !== "function") throw new Error("Fetch is unavailable for the compiled campaign package.");
  const response = await runtime.fetch(`${PACKAGE_URL}?v=0.1.0`);
  if (!response.ok) throw new Error(`Campaign package fetch failed with HTTP ${response.status}.`);
  return response.json();
}

function candidateSceneObservation(runtime, candidateScope, packageId) {
  const scenes = runtime.game.scenes.contents;
  const selectedRoomIds = new Set(candidateScope.rooms.map((room) => room.roomId));
  const selectedLabels = new Set(candidateScope.rooms.map((room) => room.label));
  const ownedCounts = Object.fromEntries(candidateScope.rooms.map((room) => [room.roomId, 0]));
  const foreignSemanticConflicts = [];
  const unboundSameLabelScenes = [];
  for (const scene of scenes) {
    const marker = scene?.flags?.[FLAG_SCOPE]?.[FLAG_KEY];
    if (marker?.kind === "scene" && selectedRoomIds.has(marker.semanticId)) {
      if (marker.owner === MODULE_ID && marker.packageId === packageId) ownedCounts[marker.semanticId] += 1;
      else foreignSemanticConflicts.push(marker.semanticId);
    } else if (selectedLabels.has(scene?.name)) {
      unboundSameLabelScenes.push(scene.name);
    }
  }
  const ambiguousOwnedRooms = Object.entries(ownedCounts).filter(([, count]) => count > 1).map(([roomId]) => roomId);
  const missingOwnedRooms = Object.entries(ownedCounts).filter(([, count]) => count === 0).map(([roomId]) => roomId);
  return Object.freeze({
    selectedOwnedSceneCounts: Object.freeze(ownedCounts),
    ambiguousOwnedRooms: Object.freeze(ambiguousOwnedRooms),
    missingOwnedRooms: Object.freeze(missingOwnedRooms),
    foreignSemanticConflicts: Object.freeze([...new Set(foreignSemanticConflicts)]),
    unboundSameLabelSceneCount: unboundSameLabelScenes.length,
    foreignStatePreserved: true,
  });
}

/**
 * Read only the fixed M1141 candidate transport boundary. This method accepts
 * no selector and never loads the mutation path, creates a binding, or writes
 * the runtime package cache.
 */
export async function readAscendancySignalRuneCandidateTransportDiagnostic(runtime = globalThis) {
  const gate = candidateTransportRuntimeGate(runtime);
  if (!gate.pass) return blockedCandidateTransportDiagnostic(gate.failed);
  let packageData;
  let candidateScope;
  try {
    packageData = await readPackageWithoutCaching(runtime);
    candidateScope = selectAscendancySignalRuneCandidateScope(packageData);
  } catch (error) {
    return blockedCandidateTransportDiagnostic([error instanceof Error ? error.message : "Candidate package read failed; no transport scope was promoted."]);
  }
  const packageId = packageData?.packageId;
  if (typeof packageId !== "string" || packageId.length === 0) return blockedCandidateTransportDiagnostic(["Candidate package identity is absent; no transport scope was promoted."]);
  const sceneObservation = candidateSceneObservation(runtime, candidateScope, packageId);
  const drift = [
    ...sceneObservation.ambiguousOwnedRooms.map((roomId) => `Multiple DiceBox-owned candidate Scenes matched ${roomId}.`),
    ...sceneObservation.foreignSemanticConflicts.map((roomId) => `A foreign Scene claims candidate semantic identity ${roomId}; it is preserved and blocks transport readiness.`),
  ];
  const selectedAssets = candidateScope.assets.map((asset) => Object.freeze({
    assetId: asset.assetId,
    status: asset.status,
    pathPresent: typeof asset.path === "string" && asset.path.length > 0,
  }));
  return Object.freeze({
    receiptVersion: 1,
    operation: CANDIDATE_TRANSPORT_DIAGNOSTIC_OPERATION,
    status: drift.length === 0 ? "OBSERVED" : "BLOCKED",
    evidenceClass: drift.length === 0 ? "runtime-observation" : "blocked",
    readyClaim: false,
    noWrite: true,
    apply: false,
    dispatch: "disabled",
    candidateTransportImplemented: true,
    runtimeExposure: "diagnostic-only-candidate-install-repair-disabled",
    candidateInstallExposed: false,
    candidateRepairExposed: false,
    target: Object.freeze({ foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version, exactTargetMatch: true }),
    activeGm: Object.freeze({ currentUserIsGm: true, currentUserMatchesActiveGm: true, noExecutionAuthority: true }),
    candidate: Object.freeze({
      candidateId: SIGNAL_RUNE_CANDIDATE_ID,
      packageId,
      selectedRoomIds: Object.freeze(candidateScope.rooms.map((room) => room.roomId)),
      excludedRoomIds: Object.freeze([...candidateScope.excludedRoomIds]),
      selectedAssets: Object.freeze(selectedAssets),
      selectedAssetsComplete: selectedAssets.every((asset) => asset.pathPresent && asset.status === "scene-bound"),
      excludedForeignScenes: Object.freeze({ observedCount: sceneObservation.unboundSameLabelSceneCount, preserved: true }),
      sceneObservation,
    }),
    artifactIdentity: CANDIDATE_ARTIFACT_REFS,
    blockers: Object.freeze(drift),
    bindings: null,
    payload: null,
    proposal: null,
  });
}

function candidateTransportDiagnosticHtml(runtime, receipt) {
  const escape = runtime.foundry?.utils?.escapeHTML ?? ((value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  return "<pre style=\"white-space:pre-wrap;max-height:60vh;overflow:auto\">" + escape(JSON.stringify(receipt, null, 2)) + "</pre>";
}

export async function openAscendancySignalRuneCandidateTransportDiagnosticControl(runtime = globalThis) {
  const receipt = await readAscendancySignalRuneCandidateTransportDiagnostic(runtime);
  const DialogV2 = runtime.foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.wait) return blockedCandidateTransportDiagnostic(["Foundry DialogV2 is unavailable; no candidate transport diagnostic was rendered."]);
  await DialogV2.wait({
    window: { title: CANDIDATE_TRANSPORT_DIAGNOSTIC_TITLE },
    content: candidateTransportDiagnosticHtml(runtime, receipt),
    buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }],
  });
  return receipt;
}

function candidateWriteBlockers(sceneObservation) {
  return Object.freeze([
    ...sceneObservation.ambiguousOwnedRooms.map((roomId) => `Multiple DiceBox-owned candidate Scenes matched ${roomId}.`),
    ...sceneObservation.foreignSemanticConflicts.map((roomId) => `A foreign Scene claims candidate semantic identity ${roomId}; it is preserved and blocks candidate creation.`),
  ]);
}

async function readCandidateWriteState(runtime) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ gate, packageData: null, candidateScope: null, packageId: null, sceneObservation: null, blockers: Object.freeze([...gate.failed]) });
  let packageData;
  let candidateScope;
  try {
    packageData = await readPackageWithoutCaching(runtime);
    candidateScope = selectAscendancySignalRuneCandidateScope(packageData);
  } catch (error) {
    return Object.freeze({
      gate,
      packageData: null,
      candidateScope: null,
      packageId: null,
      sceneObservation: null,
      blockers: Object.freeze([error instanceof Error ? error.message : "Candidate package read failed; no write scope was promoted."]),
    });
  }
  const packageId = packageData?.packageId;
  if (typeof packageId !== "string" || packageId.length === 0) {
    return Object.freeze({ gate, packageData, candidateScope, packageId: null, sceneObservation: null, blockers: Object.freeze(["Candidate package identity is absent; no write scope was promoted."]) });
  }
  const sceneObservation = candidateSceneObservation(runtime, candidateScope, packageId);
  const incompleteAssets = candidateScope.assets.filter((asset) => asset?.status !== "scene-bound" || typeof asset.path !== "string" || asset.path.length === 0);
  return Object.freeze({
    gate,
    packageData,
    candidateScope,
    packageId,
    sceneObservation,
    blockers: Object.freeze([
      ...candidateWriteBlockers(sceneObservation),
      ...(incompleteAssets.length > 0 ? ["Selected Signal/Rune assets are incomplete; no candidate write was attempted."] : []),
    ]),
  });
}

function candidateWriteReceipt(state, status, extra = {}) {
  const candidateScope = state.candidateScope;
  const sceneObservation = state.sceneObservation;
  const selectedAssets = candidateScope?.assets?.map((asset) => Object.freeze({
    assetId: asset.assetId,
    status: asset.status,
    pathPresent: typeof asset.path === "string" && asset.path.length > 0,
  })) ?? [];
  return Object.freeze({
    receiptVersion: 1,
    operation: CANDIDATE_WRITE_PREVIEW_OPERATION,
    status,
    evidenceClass: status === "PREVIEWED" ? "local-preview" : "blocked",
    readyClaim: false,
    noWrite: true,
    apply: false,
    approvalRequired: true,
    approvalGranted: false,
    authoritativeRereadRequired: true,
    foreignStatePreserved: true,
    retryAllowed: false,
    candidateId: SIGNAL_RUNE_CANDIDATE_ID,
    packageId: state.packageId,
    target: state.gate ? Object.freeze({
      foundryVersion: state.gate.checks?.find?.((check) => check.reason?.includes("Foundry"))?.pass ? EXACT_FOUNDRY_VERSION : null,
      systemId: SYSTEM_ID,
      systemVersion: SYSTEM_VERSION,
      exactTargetMatch: state.gate.pass,
      activeGm: state.gate.checks?.find?.((check) => check.reason?.includes("active GM"))?.pass === true,
    }) : null,
    candidate: candidateScope ? Object.freeze({
      selectedRoomIds: Object.freeze(candidateScope.rooms.map((room) => room.roomId)),
      excludedRoomIds: Object.freeze([...candidateScope.excludedRoomIds]),
      selectedAssets: Object.freeze(selectedAssets),
      selectedAssetsComplete: selectedAssets.length === candidateScope.assets.length && selectedAssets.every((asset) => asset.status === "scene-bound" && asset.pathPresent),
      sceneObservation,
    }) : null,
    blockers: Object.freeze([...state.blockers]),
    artifactIdentity: CANDIDATE_ARTIFACT_REFS,
    ...extra,
  });
}

/** Build the fixed Signal/Rune write proposal without binding or mutating Foundry. */
export async function previewAscendancySignalRuneCandidateWrite(runtime = globalThis) {
  const state = await readCandidateWriteState(runtime);
  return candidateWriteReceipt(state, state.blockers.length === 0 ? "PREVIEWED" : "BLOCKED");
}

function candidateWriteReceiptHtml(runtime, receipt) {
  const escape = runtime.foundry?.utils?.escapeHTML ?? ((value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  return `<pre style="white-space:pre-wrap;max-height:60vh;overflow:auto">${escape(JSON.stringify(receipt, null, 2))}</pre><p>This fixed control targets only the Signal and Rune rooms. Approval is explicit; the control rereads the exact target before and after the write, preserves foreign Scenes, and stops without retry if the result is uncertain.</p>`;
}

/**
 * Open the only authorized candidate write boundary. The caller cannot supply
 * a selector, document ID, payload, or arbitrary execution input.
 */
export async function openAscendancySignalRuneCandidateWriteControl(runtime = globalThis) {
  const preview = await previewAscendancySignalRuneCandidateWrite(runtime);
  const DialogV2 = runtime.foundry?.applications?.api?.DialogV2;
  if (!DialogV2?.wait || !DialogV2?.confirm) {
    return Object.freeze({ ...preview, status: "BLOCKED", blockers: Object.freeze([...preview.blockers, "Foundry DialogV2.wait and DialogV2.confirm are required; no candidate write was attempted."]) });
  }
  if (preview.status !== "PREVIEWED") {
    await DialogV2.wait({ window: { title: `${CANDIDATE_WRITE_TITLE} — blocked` }, content: candidateWriteReceiptHtml(runtime, preview), buttons: [{ action: "close", label: "Close", icon: "fa-solid fa-xmark" }] });
    return preview;
  }
  const approved = await DialogV2.confirm({
    window: { title: CANDIDATE_WRITE_TITLE },
    content: candidateWriteReceiptHtml(runtime, preview),
    yes: { label: "Approve fixed Signal/Rune write", icon: "fa-solid fa-check" },
    no: { label: "Cancel", icon: "fa-solid fa-xmark" },
  });
  if (!approved) return Object.freeze({ ...preview, status: "CANCELLED" });

  const preState = await readCandidateWriteState(runtime);
  if (preState.blockers.length > 0) {
    return Object.freeze({ ...candidateWriteReceipt(preState, "BLOCKED", { phase: "pre-write-authoritative-reread" }), approvalGranted: true, approvalRequired: true });
  }

  let outcome;
  try {
    outcome = await installAscendancySignalRuneCandidate(runtime);
  } catch (error) {
    return Object.freeze({
      ...preview,
      operation: CANDIDATE_WRITE_OPERATION,
      status: "UNKNOWN",
      evidenceClass: "unknown",
      noWrite: false,
      apply: true,
      approvalGranted: true,
      mutationAttempted: true,
      authoritativeReread: false,
      retryAllowed: false,
      blockers: Object.freeze([error instanceof Error ? error.message : "Candidate write outcome is unknown; authoritative reread is required before any retry."]),
      preReread: preState.sceneObservation,
    });
  }
  if (outcome.status !== "PASS") return Object.freeze({ ...outcome, operation: CANDIDATE_WRITE_OPERATION, approvalGranted: true, authoritativeReread: false, retryAllowed: false });

  const postState = await readCandidateWriteState(runtime);
  const postBlockers = [
    ...postState.blockers,
    ...(postState.sceneObservation?.missingOwnedRooms ?? []).map((roomId) => `Authoritative reread did not find the created candidate Scene for ${roomId}.`),
  ];
  if (postBlockers.length > 0) {
    return Object.freeze({
      ...outcome,
      operation: CANDIDATE_WRITE_OPERATION,
      status: "UNKNOWN",
      evidenceClass: "unknown",
      approvalGranted: true,
      authoritativeReread: true,
      retryAllowed: false,
      blockers: Object.freeze(postBlockers),
      preReread: preState.sceneObservation,
      postReread: postState.sceneObservation,
      readyClaim: false,
    });
  }
  return Object.freeze({
    ...outcome,
    operation: CANDIDATE_WRITE_OPERATION,
    approvalGranted: true,
    approvalRequired: true,
    authoritativeReread: true,
    retryAllowed: false,
    foreignStatePreserved: true,
    preReread: preState.sceneObservation,
    postReread: postState.sceneObservation,
    readyClaim: false,
  });
}

async function ensureRenderer(scene, expectedBackground, roomId) {
  const level = initialLevel(scene);
  if (!level || typeof level.update !== "function") throw new Error(`Foundry 14 initial Level renderer is unavailable for ${roomId}.`);
  if (level.background?.src !== expectedBackground) {
    await level.update({ background: { ...(level.background?.toObject?.() ?? level.background ?? {}), src: expectedBackground } });
  }
}

async function rendererPreflight(runtime, room, asset, packageId) {
  const scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  if (!scene) throw new Error(`Cannot repair ${room.roomId}: its DiceBox-owned Scene was not found.`);
  const reread = await rereadScene(runtime, scene);
  const level = initialLevel(reread);
  if (!level || typeof level.update !== "function") throw new Error(`Cannot repair ${room.roomId}: the official Foundry 14 Scene.initialLevel renderer is unavailable or ambiguous.`);
  return Object.freeze({ room, asset, scene: reread, expectedBackground: assetPath(asset) });
}

function sceneData(room, asset, packageId, folderId) {
  return {
    name: room.label,
    folder: folderId ?? null,
    width: 1536,
    height: 1024,
    padding: 0,
    backgroundColor: "#080b10",
    grid: { type: 0, size: 64, distance: 5, units: "grid-unit" },
    ...flagFor("scene", room.roomId, packageId),
  };
}

function wallData(wall, packageId) {
  return {
    c: [wall.a.x, wall.a.y, wall.b.x, wall.b.y],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 0,
    ds: 0,
    ...flagFor("wall", wall.wallId, packageId),
  };
}

function doorWallData(anchor, packageId) {
  const { x, y } = anchor.position;
  const clearance = anchor.clearance;
  const horizontal = anchor.anchorId.endsWith("-north") || anchor.anchorId.endsWith("-south");
  return {
    c: horizontal ? [x - clearance, y, x + clearance, y] : [x, y - clearance, x, y + clearance],
    move: WALL_NORMAL,
    sight: WALL_NORMAL,
    sound: WALL_NORMAL,
    light: WALL_NORMAL,
    dir: 0,
    door: 1,
    ds: 0,
    ...flagFor("door", anchor.anchorId, packageId),
  };
}

function regionData(region, packageId, teleports) {
  const destination = teleports.find((teleport) => teleport.fromRegionId === region.regionId);
  return {
    name: region.label,
    shapes: [{ type: "rectangle", x: region.bounds.x, y: region.bounds.y, width: region.bounds.width, height: region.bounds.height, rotation: 0 }],
    elevation: { bottom: null, top: null },
    color: "#2a9d8f",
    ...flagFor("region", region.regionId, packageId),
    flags: {
      [FLAG_SCOPE]: {
        [FLAG_KEY]: {
          packageId,
          kind: "region",
          semanticId: region.regionId,
          owner: "dicebox-campaign-helper",
          interaction: region.interaction,
          ownerContract: region.owner,
          popup: region.popup,
          behaviorBinding: region.behaviorBinding,
          teleport: destination ? clone(destination) : null,
          regionwrightHandoff: region.owner === "regionwright-popup",
        },
      },
    },
  };
}

function staticTileData(tile, packageId) {
  return {
    x: tile.bounds.x, y: tile.bounds.y, width: tile.bounds.width, height: tile.bounds.height,
    rotation: 0, sort: tile.sort, hidden: false, overhead: false,
    texture: { src: tileAssetPath(tile) },
    ...flagFor("tile", tile.tileId, packageId),
  };
}

function findOwned(collection, kind, semanticId, packageId) {
  return collection?.find?.((document) => ownedDocument(document, kind, semanticId, packageId)) ?? null;
}

function expectedWallDocuments(blueprint, packageId) {
  return [
    ...blueprint.walls.map((wall) => ({ kind: "wall", semanticId: wall.wallId, data: wallData(wall, packageId) })),
    ...blueprint.anchors.filter((anchor) => anchor.kind === "door").map((anchor) => ({ kind: "door", semanticId: anchor.anchorId, data: doorWallData(anchor, packageId) })),
  ];
}

function ownedWalls(scene, packageId) {
  return (scene?.walls?.contents ?? []).filter((wall) => {
    const marker = wall?.flags?.[FLAG_SCOPE]?.[FLAG_KEY];
    return marker?.owner === MODULE_ID && marker?.packageId === packageId && (marker.kind === "wall" || marker.kind === "door");
  });
}

function expectedWallReadback(scene, expected, packageId) {
  const walls = ownedWalls(scene, packageId);
  return walls.length === expected.length && expected.every(({ kind, semanticId }) => findOwned(walls, kind, semanticId, packageId));
}

async function rereadScene(runtime, scene) {
  const current = runtime.game?.scenes?.get?.(scene?.id);
  if (current) return current;
  if (typeof runtime.fromUuid === "function" && scene?.uuid) {
    const reread = await Promise.resolve(runtime.fromUuid(scene.uuid));
    if (reread) return reread;
  }
  return runtime.game?.scenes?.get?.(scene?.id) ?? scene;
}

function findRecoverableScene(runtime, room, regionPlan, packageId) {
  const candidates = (runtime.game?.scenes?.contents ?? []).filter((scene) => {
    if (scene?.name !== room.label || scene?.width !== 1536 || scene?.height !== 1024) return false;
    const regions = scene?.regions?.contents ?? [];
    return regionPlan.regions.every((region) => findOwned(regions, "region", region.regionId, packageId));
  });
  if (candidates.length > 1) throw new Error(`Multiple recoverable DiceBox scenes matched ${room.roomId}; refusing ambiguous repair.`);
  return candidates[0] ?? null;
}

async function installScene(runtime, room, blueprint, regionPlan, staticTilePlan, asset, packageId, folderId) {
  let scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  let sceneRecovered = false;
  if (!scene) {
    scene = findRecoverableScene(runtime, room, regionPlan, packageId);
    if (scene) {
      await scene.update(flagFor("scene", room.roomId, packageId));
      sceneRecovered = true;
    }
  }
  let sceneCreated = false;
  if (!scene) {
    scene = await runtime.Scene.create(sceneData(room, asset, packageId, folderId));
    sceneCreated = true;
  }
  if (!scene) throw new Error(`Scene creation returned no document for ${room.roomId}.`);
  let rereadBeforeChildren = await rereadScene(runtime, scene);
  if (!rereadBeforeChildren) throw new Error(`Scene reread failed for ${room.roomId}.`);
  await ensureRenderer(rereadBeforeChildren, assetPath(asset), room.roomId);
  rereadBeforeChildren = await rereadScene(runtime, rereadBeforeChildren);
  if (!rereadBeforeChildren || rendererSource(rereadBeforeChildren) !== assetPath(asset)) throw new Error(`Foundry 14 initial Level renderer reread failed for ${room.roomId}.`);
  const wallCollection = rereadBeforeChildren.walls?.contents ?? [];
  const regionCollection = rereadBeforeChildren.regions?.contents ?? [];
  const tileCollection = rereadBeforeChildren.tiles?.contents ?? [];
  const doors = blueprint.anchors.filter((anchor) => anchor.kind === "door");
  const wallPayload = blueprint.walls
    .filter((wall) => !findOwned(wallCollection, "wall", wall.wallId, packageId))
    .map((wall) => wallData(wall, packageId));
  const doorPayload = doors
    .filter((anchor) => !findOwned(wallCollection, "door", anchor.anchorId, packageId))
    .map((anchor) => doorWallData(anchor, packageId));
  if (wallPayload.length + doorPayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Wall", [...wallPayload, ...doorPayload]);
  }
  const regionPayload = regionPlan.regions
    .filter((region) => !findOwned(regionCollection, "region", region.regionId, packageId))
    .map((region) => regionData(region, packageId, regionPlan.teleports));
  if (regionPayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Region embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Region", regionPayload);
  }
  const staticTiles = staticTilePlan.tiles.filter((tile) => tile.sceneId === room.sceneId);
  const tilePayload = staticTiles
    .filter((tile) => !findOwned(tileCollection, "tile", tile.tileId, packageId))
    .map((tile) => staticTileData(tile, packageId));
  if (tilePayload.length > 0) {
    if (typeof rereadBeforeChildren.createEmbeddedDocuments !== "function") throw new Error(`Tile embedded-document creation is unavailable for ${room.roomId}.`);
    await rereadBeforeChildren.createEmbeddedDocuments("Tile", tilePayload);
  }
  const reread = await rereadScene(runtime, rereadBeforeChildren);
  const walls = reread?.walls?.contents ?? [];
  const regions = reread?.regions?.contents ?? [];
  const tiles = reread?.tiles?.contents ?? [];
  const expectedWallCount = blueprint.walls.length + doors.length;
  const expectedRegionCount = regionPlan.regions.length;
  const expectedTileCount = staticTiles.length;
  const wallReadback = blueprint.walls.every((wall) => findOwned(walls, "wall", wall.wallId, packageId))
    && doors.every((door) => findOwned(walls, "door", door.anchorId, packageId));
  const regionReadback = regionPlan.regions.every((region) => findOwned(regions, "region", region.regionId, packageId));
  const tileReadback = staticTiles.every((tile) => findOwned(tiles, "tile", tile.tileId, packageId));
  if (!wallReadback || !regionReadback || !tileReadback || walls.filter((wall) => wall.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId).length !== expectedWallCount || regions.filter((region) => region.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId).length !== expectedRegionCount || tiles.filter((tile) => tile.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.packageId === packageId && tile.flags?.[FLAG_SCOPE]?.[FLAG_KEY]?.kind === "tile").length !== expectedTileCount) {
    throw new Error(`Authoritative reread did not match the expected owned Wall/Region/Tile set for ${room.roomId}.`);
  }
  return Object.freeze({ roomId: room.roomId, sceneId: room.sceneId, sceneUuid: reread.uuid ?? scene.uuid ?? null, sceneCreated, sceneRecovered, wallCount: expectedWallCount, regionCount: expectedRegionCount, tileCount: expectedTileCount, reread: true });
}

/**
 * Explicit migration for the discovered renderer/staging defect. It updates
 * only DiceBox-owned scene backgrounds and boundary Wall documents. It never
 * creates Scenes, Regions, Macros, or RegionBehaviors, and it rereads every
 * changed document before returning a receipt.
 */
async function repairSceneRendererAndGeometry(runtime, room, blueprint, regionPlan, asset, packageId) {
  const scene = findOwned(runtime.game?.scenes?.contents, "scene", room.roomId, packageId);
  if (!scene) throw new Error(`Cannot repair ${room.roomId}: its DiceBox-owned Scene was not found.`);
  let reread = await rereadScene(runtime, scene);
  if (!reread) throw new Error(`Cannot repair ${room.roomId}: Scene reread failed.`);
  const expected = expectedWallDocuments(blueprint, packageId);
  const expectedBackground = assetPath(asset);
  await ensureRenderer(reread, expectedBackground, room.roomId);
  reread = await rereadScene(runtime, reread);
  if (!reread) throw new Error(`Cannot repair ${room.roomId}: Scene reread after renderer update failed.`);
  if (rendererSource(reread) !== expectedBackground) throw new Error(`Cannot repair ${room.roomId}: Foundry 14 initial Level renderer reread failed.`);
  const priorOwnedWalls = ownedWalls(reread, packageId);
  if (priorOwnedWalls.length > 0) {
    if (typeof reread.deleteEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document deletion is unavailable for ${room.roomId}.`);
    await reread.deleteEmbeddedDocuments("Wall", priorOwnedWalls.map((wall) => wall.id));
  }
  if (expected.length > 0) {
    if (typeof reread.createEmbeddedDocuments !== "function") throw new Error(`Wall embedded-document creation is unavailable for ${room.roomId}.`);
    await reread.createEmbeddedDocuments("Wall", expected.map(({ data }) => data));
  }
  const finalScene = await rereadScene(runtime, reread);
  const expectedRegions = regionPlan.regions;
  const regionReadback = expectedRegions.every((region) => findOwned(finalScene?.regions?.contents, "region", region.regionId, packageId));
  if (!finalScene || rendererSource(finalScene) !== expectedBackground || !expectedWallReadback(finalScene, expected, packageId) || !regionReadback) {
    throw new Error(`Authoritative reread did not match the expected renderer, Wall set, and Region set for ${room.roomId}.`);
  }
  return Object.freeze({
    roomId: room.roomId,
    sceneId: room.sceneId,
    sceneUuid: finalScene.uuid ?? null,
    background: expectedBackground,
    wallsRemoved: priorOwnedWalls.length,
    wallsCreated: expected.length,
    wallCount: expected.length,
    regionCount: expectedRegions.length,
    reread: true,
  });
}

async function loadPackage(runtime, candidateId = null) {
  const packageData = runtime.__diceboxAscendancyPackage ?? await (async () => {
    if (typeof runtime.fetch !== "function") throw new Error("Fetch is unavailable for the compiled campaign package.");
    const response = await runtime.fetch(`${PACKAGE_URL}?v=0.1.0`);
    if (!response.ok) throw new Error(`Campaign package fetch failed with HTTP ${response.status}.`);
    return response.json();
  })();
  if (packageData.mutation !== "disabled-until-exact-runtime-gate" || packageData.spatialBlueprints?.length !== 4 || packageData.regionPlans?.length !== 4) throw new Error("Compiled campaign package failed the install contract.");
  const candidateScope = candidateId === null ? null : selectAscendancySignalRuneCandidateScope(packageData, candidateId);
  const assetsToValidate = candidateScope?.assets ?? (packageData.assets?.bound ?? []);
  const incompleteAssets = assetsToValidate.filter((asset) => asset?.status !== "scene-bound" || typeof asset?.path !== "string" || asset.path.length === 0);
  if (incompleteAssets.length > 0) {
    throw new Error(candidateScope
      ? "Selected candidate package assets are incomplete; candidate installation is blocked before any Foundry write."
      : "Compiled campaign package has no reviewed renderer for every Scene; installation is blocked before any Foundry write.");
  }
  runtime.__diceboxAscendancyPackage = packageData;
  return packageData;
}

async function loadSignalRuneCandidatePackage(runtime) {
  const packageData = await loadPackage(runtime, SIGNAL_RUNE_CANDIDATE_ID);
  return Object.freeze({ packageData, candidateScope: selectAscendancySignalRuneCandidateScope(packageData) });
}

export async function installAscendancyCampaign(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.install", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const packageData = await loadPackage(runtime);
  const folder = runtime.game?.folders?.find?.((candidate) => candidate.type === "Scene" && candidate.name === "The Ascendancy");
  const results = [];
  for (const room of packageData.campaign.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = packageData.assets.bound.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Campaign package is incomplete for ${room.roomId}.`);
    results.push(await installScene(runtime, room, blueprint, regionPlan, packageData.staticVisualTileProjection, asset, packageData.packageId, folder?.id ?? null));
  }
  const receipt = Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.install",
    status: "PASS",
    evidenceClass: "deterministic",
    readyClaim: false,
    noWrite: false,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
    notes: Object.freeze([
      "Scenes, blueprint-defined boundary and door Wall segments per Scene, and base Regions were created or reread through Foundry APIs.",
      "Regionwright popup/native RegionBehavior wiring and Scene-owned tram logic remain separate owners and require their own target-bound receipt.",
    ]),
  });
  runtime.ui?.notifications?.info?.("DiceBox Ascendancy base scenes are installed and reread.");
  return receipt;
}

export async function repairAscendancyCampaignRenderersAndGeometry(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.repair", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const packageData = await loadPackage(runtime);
  const repairs = [];
  for (const room of packageData.campaign.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = packageData.assets.bound.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Campaign package is incomplete for ${room.roomId}.`);
    repairs.push({ room, blueprint, regionPlan, asset });
  }
  // Read every target before any owned Wall replacement. A missing/ambiguous
  // Foundry 14 Level blocks the whole repair without changing geometry.
  await Promise.all(repairs.map(({ room, asset }) => rendererPreflight(runtime, room, asset, packageData.packageId)));
  const results = [];
  for (const repair of repairs) results.push(await repairSceneRendererAndGeometry(runtime, repair.room, repair.blueprint, repair.regionPlan, repair.asset, packageData.packageId));
  return Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.repair",
    status: "PASS",
    evidenceClass: "full_function",
    readyClaim: false,
    noWrite: false,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
    notes: Object.freeze([
      "Only existing DiceBox-owned Scene backgrounds and boundary Wall documents were reconciled to the compiled package.",
      "No Scene, Region, Macro, RegionBehavior, foreign document, or puzzle state was created, deleted, or updated.",
    ]),
  });
}

/** Install only the fixed M1141 Signal/Rune candidate set after exact runtime gates. */
export async function installAscendancySignalRuneCandidate(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.install.signal-rune-candidate", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const { packageData, candidateScope } = await loadSignalRuneCandidatePackage(runtime);
  const folder = runtime.game?.folders?.find?.((candidate) => candidate.type === "Scene" && candidate.name === "The Ascendancy");
  const results = [];
  for (const room of candidateScope.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = candidateScope.assets.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Candidate package is incomplete for ${room.roomId}.`);
    results.push(await installScene(runtime, room, blueprint, regionPlan, packageData.staticVisualTileProjection, asset, packageData.packageId, folder?.id ?? null));
  }
  return Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.install.signal-rune-candidate",
    status: "PASS",
    evidenceClass: "deterministic",
    readyClaim: false,
    noWrite: false,
    candidateId: SIGNAL_RUNE_CANDIDATE_ID,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
  });
}

/** Repair only the fixed M1141 Signal/Rune candidate set after exact runtime gates. */
export async function repairAscendancySignalRuneCandidate(runtime = globalThis) {
  const gate = runtimeGate(runtime);
  if (!gate.pass) return Object.freeze({ receiptVersion: 1, operation: "ascendancy.repair.signal-rune-candidate", status: "BLOCKED", evidenceClass: "blocked", readyClaim: false, noWrite: true, blockers: gate.failed, notes: ["No Scene, Wall, Region, or RegionBehavior mutation was attempted."] });
  const { packageData, candidateScope } = await loadSignalRuneCandidatePackage(runtime);
  const repairs = [];
  for (const room of candidateScope.rooms) {
    const blueprint = packageData.spatialBlueprints.find((candidate) => candidate.blueprintId === room.spatialBlueprintId);
    const regionPlan = packageData.regionPlans.find((candidate) => candidate.roomId === room.roomId);
    const asset = candidateScope.assets.find((candidate) => candidate.assetId === room.assetId);
    if (!blueprint || !regionPlan || !asset) throw new Error(`Candidate package is incomplete for ${room.roomId}.`);
    repairs.push({ room, blueprint, regionPlan, asset });
  }
  await Promise.all(repairs.map(({ room, asset }) => rendererPreflight(runtime, room, asset, packageData.packageId)));
  const results = [];
  for (const repair of repairs) results.push(await repairSceneRendererAndGeometry(runtime, repair.room, repair.blueprint, repair.regionPlan, repair.asset, packageData.packageId));
  return Object.freeze({
    receiptVersion: 1,
    operation: "ascendancy.repair.signal-rune-candidate",
    status: "PASS",
    evidenceClass: "deterministic",
    readyClaim: false,
    noWrite: false,
    candidateId: SIGNAL_RUNE_CANDIDATE_ID,
    packageId: packageData.packageId,
    target: { foundryVersion: runtime.game.version, systemId: runtime.game.system.id, systemVersion: runtime.game.system.version },
    scenes: Object.freeze(results),
    playerFacingMacroCount: 0,
  });
}

function expose(runtime) {
  if (!runtime.game || Object.prototype.hasOwnProperty.call(runtime.game, INSTALLER_KEY)) return;
  const api = Object.freeze({
    describe: () => Object.freeze({ packageId: MODULE_ID, exactFoundryVersion: EXACT_FOUNDRY_VERSION, system: `${SYSTEM_ID}@${SYSTEM_VERSION}`, owner: "Scene/Wall/base-Region only", readyClaim: false }),
    preview: () => runtimeGate(runtime),
    candidateTransportDiagnostic: () => readAscendancySignalRuneCandidateTransportDiagnostic(runtime),
    candidateWritePreview: () => previewAscendancySignalRuneCandidateWrite(runtime),
    createSignalRuneCandidate: () => openAscendancySignalRuneCandidateWriteControl(runtime),
    install: () => installAscendancyCampaign(runtime),
    repair: () => repairAscendancyCampaignRenderersAndGeometry(runtime),
  });
  Object.defineProperty(runtime.game, INSTALLER_KEY, { configurable: false, enumerable: false, value: api, writable: false });
}

export function registerControl(runtime) {
  if (typeof runtime.Hooks?.on !== "function") return;
  runtime.Hooks.on("getSceneControlButtons", (controls) => {
    if (!runtime.game?.user?.isGM) return;
    const tools = controls?.tokens?.tools;
    if (!tools || typeof tools !== "object" || Array.isArray(tools)) return;
    const nextOrder = Object.keys(tools).length;
    if (!tools["dicebox-ascendancy-install"]) tools["dicebox-ascendancy-install"] = {
      name: "dicebox-ascendancy-install", title: "Prepare DiceBox Ascendancy", icon: "fa-solid fa-dungeon", order: nextOrder,
      button: true, visible: true, onChange: () => installAscendancyCampaign(runtime).catch((error) => runtime.ui?.notifications?.error?.(`DiceBox install blocked: ${error.message}`)),
    };
    if (!tools["dicebox-ascendancy-repair"]) tools["dicebox-ascendancy-repair"] = {
      name: "dicebox-ascendancy-repair", title: "Repair DiceBox Ascendancy maps and geometry", icon: "fa-solid fa-hammer", order: nextOrder + 1,
      button: true, visible: true, onChange: () => repairAscendancyCampaignRenderersAndGeometry(runtime).catch((error) => runtime.ui?.notifications?.error?.(`DiceBox repair blocked: ${error.message}`)),
    };
    if (!tools[CANDIDATE_TRANSPORT_DIAGNOSTIC_CONTROL_ID]) tools[CANDIDATE_TRANSPORT_DIAGNOSTIC_CONTROL_ID] = {
      name: CANDIDATE_TRANSPORT_DIAGNOSTIC_CONTROL_ID, title: CANDIDATE_TRANSPORT_DIAGNOSTIC_TITLE, icon: "fa-solid fa-route", order: nextOrder + 2,
      button: true, visible: true, onChange: () => openAscendancySignalRuneCandidateTransportDiagnosticControl(runtime).catch((error) => runtime.ui?.notifications?.error?.("DiceBox candidate transport diagnostic blocked: " + error.message)),
    };
    if (!tools[CANDIDATE_WRITE_CONTROL_ID]) tools[CANDIDATE_WRITE_CONTROL_ID] = {
      name: CANDIDATE_WRITE_CONTROL_ID, title: CANDIDATE_WRITE_TITLE, icon: "fa-solid fa-dungeon", order: nextOrder + 3,
      button: true, visible: true, onChange: () => openAscendancySignalRuneCandidateWriteControl(runtime).catch((error) => runtime.ui?.notifications?.error?.("DiceBox Signal/Rune candidate creation blocked: " + error.message)),
    };
  });
}

if (typeof globalThis.Hooks?.once === "function") {
  // Foundry v14 constructs Scene Controls before the ready hook. Register
  // the callback at init so the first control render can include these
  // GM-only actions; each action remains independently exact-runtime gated.
  globalThis.Hooks.once("init", () => registerControl(globalThis));
  globalThis.Hooks.once("ready", () => {
    expose(globalThis);
    if (globalThis.game?.user?.isGM && globalThis.ui?.notifications) globalThis.ui.notifications.info("DiceBox Campaign Helper loaded. The Ascendancy installer is GM-only and exact-runtime-gated.");
  });
}
