/**
 * Foreman source-only candidate: disposable Foundry v14.367 installer adapter.
 * NOT registered by module.json, NOT production-authorized, NOT player-view proof.
 * GM approval supplied by an independently trusted host; the JS callback alone
 * does not constitute cryptographic authorization.
 */
import {previewSemanticSceneForActiveGm, MODULE_ID} from './semantic-scene-v14-slice.js';

const WORLD = 'dbx-test-world';
const VERSION = '14.367';
const SYSTEM = 'dnd5e';
const SYSTEM_VERSION = '5.3.3';
const PHASES = ['Wall', 'AmbientLight', 'Region'];
const COLLECTIONS = Object.freeze({Wall:'walls',AmbientLight:'lights',Region:'regions'});
function fail(code){throw new Error(`DCH_DISPOSABLE_INSTALL_${code}`);}
function arr(v) { return Array.isArray(v) ? v : Array.isArray(v?.contents) ? v.contents : null; }
function owner(doc) { return doc?.flags?.[MODULE_ID] ?? null; }
function sameOwner(doc, src, stableId) {
  const f = owner(doc);
  return f?.stableId === stableId && f?.blueprintId === src.id
    && f?.blueprintSha256 === src.sha256 && f?.blueprintRevision === src.revision;
}
function verifyExecutionIdentity(runtime,auth,src) {
  const game = runtime?.game;
  if (game?.version !== VERSION || game?.world?.id !== WORLD
      || game?.system?.id !== SYSTEM || game?.system?.version !== SYSTEM_VERSION) fail('EXACT_FIXTURE');
  if (!game.user?.isGM || !game.user?.id || game.users?.activeGM?.id !== game.user.id) fail('ELECTED_GM');
  if (auth?.worldId !== WORLD || auth.currentSingleWriterId !== game.user.id
      || auth.activeGmId !== game.user.id) fail('WRITER_AUTH');
  if (src && (auth.approvedBlueprintId!==src.id
      || auth.approvedBlueprintSha256!==src.sha256
      || auth.approvedBlueprintRevision!==src.revision)) fail('APPROVAL_REVISION');
}
function guard(runtime, auth, blueprint) {
  verifyExecutionIdentity(runtime,auth);
  const game = runtime.game;
  const candidate = previewSemanticSceneForActiveGm(blueprint, runtime, auth);
  verifyExecutionIdentity(runtime,auth,candidate.sourceBlueprint);
  const coll = arr(game.scenes);
  if (!coll) fail('SCENE_COLLECTION');
  const duplicates = coll.filter(scene => {
    const f = owner(scene);
    return f?.blueprintId === candidate.sourceBlueprint.id;
  });
  if (duplicates.length) fail('PREEXISTING_BLUEPRINT');
  for (const type of PHASES) if (!Array.isArray(candidate.documents[type]) || candidate.documents[type].length < 1) fail('DOCUMENT_SET');
  return candidate;
}

export function previewDisposableSceneInstallV14({runtime,authorization,blueprint}) {
  const candidate = guard(runtime,authorization,blueprint);
  return Object.freeze({
    mode:'disposable-v14.367-source-candidate', evidenceClass:'source-only', writesAllowed:false,
    worldId:WORLD, blueprint:structuredClone(candidate.sourceBlueprint),
    phases:PHASES.map(type => ({type,count:candidate.documents[type].length})),
    blockers:['Unverified host authorization signature and actual Foundry 14.367 DataModels',
      'No real player-view receipt or gameplay validation']
  });
}

/**
 * Opt-in installer candidate for separately authorized disposable-fixture use.
 * The host MUST provide trusted, out-of-band verifyApproval and validateModels
 * callbacks. Neither callback may originate from model output or scene data.
 * Never exported to the user-facing model tool catalog without a separate audit.
 */
export async function installDisposableSceneV14({runtime,authorization,blueprint,verifyApproval,validateModels}) {
  const candidate = guard(runtime,authorization,blueprint);
  if (typeof verifyApproval !== 'function' || typeof validateModels !== 'function') fail('TRUSTED_GATE_MISSING');
  const src=candidate.sourceBlueprint;
  const proof = await verifyApproval({worldId:WORLD,gmId:runtime.game.user.id,blueprint:src});
  if (proof !== true) fail('APPROVAL_UNVERIFIED');
  // Async host approval may have yielded to a new world, GM or blueprint;
  // a fresh uniqueness and identity check is required before persistence.
  guard(runtime,authorization,blueprint);
  const sceneData = {
    name:candidate.foundryScene.name, width:candidate.foundryScene.width,
    height:candidate.foundryScene.height, grid:structuredClone(candidate.foundryScene.grid),
    flags:{[MODULE_ID]:{
      source:'approved-spatial-blueprint', blueprintId:src.id,
      blueprintSha256:src.sha256,blueprintRevision:src.revision,
      stableId:`scene:${src.id}`, status:'disposable-provisional'
    }}
  };
  const validate = await validateModels({scene:structuredClone(sceneData),
    documents:structuredClone(candidate.documents),worldId:WORLD,version:VERSION});
  if (validate !== true) fail('MODEL_VALIDATION_UNVERIFIED');
  guard(runtime,authorization,blueprint);
  if (typeof runtime.Scene?.create !== 'function') fail('SCENE_CREATE_UNAVAILABLE');
  // No other world document is changed. When a partial write occurs, preserve
  // the disposable scene and return an explicit recovery-needed receipt.
  let created=null, phase='Scene'; const counts={Wall:0,AmbientLight:0,Region:0};
  try {
    created=await runtime.Scene.create(sceneData);
    verifyExecutionIdentity(runtime,authorization,src);
    if (!created?.id) fail('SCENE_CREATE_REREAD');
    let reread=runtime.game.scenes.get?.(created.id);
    if (!reread || reread.id!==created.id || !sameOwner(reread,src,`scene:${src.id}`)) fail('SCENE_OWNERSHIP_REREAD');
    for (const type of PHASES) {
      phase=type;
      verifyExecutionIdentity(runtime,authorization,src);
      if (typeof reread.createEmbeddedDocuments!=='function') fail('CHILD_API_UNAVAILABLE');
      const docs=candidate.documents[type];
      const payload=docs.map(d=>structuredClone(d.data));
      const returned=await reread.createEmbeddedDocuments(type,payload);
      verifyExecutionIdentity(runtime,authorization,src);
      if (!Array.isArray(returned) || returned.length!==payload.length) fail('CHILD_CREATE_RECEIPT');
      reread=runtime.game.scenes.get?.(created.id);
      const collection=arr(reread?.[COLLECTIONS[type]]);
      if (!collection) fail('CHILD_COLLECTION_REREAD');
      for (const d of docs) {
        const matches=collection.filter(x=>sameOwner(x,src,d.stableId));
        if (matches.length!==1 || !matches[0]?.id) fail('CHILD_OWNERSHIP_REREAD');
      }
      counts[type]=docs.length;
    }
    return Object.freeze({status:'DISPOSABLE_APPLY_RECEIPT',evidenceClass:'runtime-unspecified',
      worldId:WORLD,blueprint:src,sceneId:created.id,createdCounts:counts,
      actualPlayerViewVerified:false,foundryDataModelProvenByExternalReceipt:false,
      acceptanceClaim:false});
  } catch (error) {
    return Object.freeze({status:'PARTIAL_OR_BLOCKED',evidenceClass:'runtime-unspecified',
      worldId:WORLD,blueprint:src,sceneId:created?.id??null,failedPhase:phase,
      reasonCode:typeof error?.message==='string' && /^DCH_DISPOSABLE_INSTALL_[A-Z_]+$/.test(error.message)
        ? error.message : 'DCH_DISPOSABLE_INSTALL_RUNTIME_FAILURE',
      recoveryRequired:Boolean(created),
      createdCounts:counts,acceptanceClaim:false});
  }
}
