// DiceBox Injector 2.0 prototype: pure, read-only preflight; no Foundry writes.
// Canonical authority: approved PREPARE scale + semantic keys, not rendered pixels or transient UUIDs.
export const BATTLEMAP_120 = Object.freeze({ gridType:0, gridSize:120, distance:5, units:"ft" });
export const TOKEN_SOURCE_TARGETS = Object.freeze({ Tiny:256, Small:512, Medium:512, Large:1024, Huge:1024, Gargantuan:2048 });
const finitePositive = x => Number.isFinite(x) && x>0;
const isInt = x => Number.isInteger(x) && x>0;
const near = (a,b) => Math.abs(a-b) < 0.00001;
const unique = arr => new Set(arr).size === arr.length;
const normalizeText = x => typeof x === "string" ? x.trim() : "";
const add = (into,code,reason) => into.push({code,reason});

export function previewInjector2(spec, observation={}) {
  const blockers=[], warnings=[], checks=[];
  if(!spec || typeof spec !== "object") return {status:"BLOCKED",mode:"PREVIEW_NO_WRITE",blockers:[{code:"SPEC_MISSING",reason:"No normalized specification"}],warnings,checks};
  const p=spec.scale??{}, art=spec.art??{}, expected=spec.expected??{};
  const result={status:"BLOCKED",mode:"PREVIEW_NO_WRITE",prototype:"dicebox-injector-2.0.0-prototype",semanticKey:spec.semanticKey??null,
    sceneName:spec.sceneName??null,scale:null,projection:null,tokenFootprintPolicy:"system-size",writes:0,checks,blockers,warnings};
  const requireField = (condition,code,reason) => {if(!condition)add(blockers,code,reason)};
  requireField(Boolean(normalizeText(spec.semanticKey)),"SEMANTIC_KEY_MISSING","Stable MapSpec semantic key required");
  requireField(Boolean(normalizeText(spec.sceneName)),"SCENE_NAME_MISSING","Exact authored Scene name required");
  requireField(Boolean(normalizeText(spec.folderName)),"FOLDER_NAME_MISSING","Exact expected parent folder required");
  requireField(spec.footprintApproved===true,"FOOTPRINT_NOT_APPROVED","Intended physical footprint must be approved during PREPARE");
  const dimensionsOK=[p.logicalColumns,p.logicalRows].every(isInt)&&[p.physicalWidthFt,p.physicalHeightFt].every(finitePositive);
  requireField(dimensionsOK,"DIMENSIONS_UNRESOLVED","Logical cells and physical feet required independently");
  const gridSize=p.gridSize??120,gridType=p.gridType??0,distance=p.distance??5,units=p.units??"ft";
  if(!(gridType===0&&gridSize===120&&distance===5&&units==="ft")){
    requireField(p.exceptionApproved===true&&normalizeText(p.exceptionReason).length>=8,
      "UNAPPROVED_SCALE_EXCEPTION","Default is Gridless / 120 px / 5 feet; deviations require approved PREPARE exception");
  }
  if(dimensionsOK){
    requireField(near(p.physicalWidthFt,p.logicalColumns*distance)&&near(p.physicalHeightFt,p.logicalRows*distance),
      "PHYSICAL_EXTENT_MISMATCH","Physical size must equal logical cells multiplied by distance");
    result.scale={gridType,gridSize,distance,units,logicalColumns:p.logicalColumns,logicalRows:p.logicalRows,
      physicalWidthFt:p.physicalWidthFt,physicalHeightFt:p.physicalHeightFt,
      sceneWidth:p.logicalColumns*gridSize,sceneHeight:p.logicalRows*gridSize};
  }
  const nativeOK=isInt(art.sourceWidth)&&isInt(art.sourceHeight);
  requireField(nativeOK,"ART_RASTER_MISSING","Original approved art raster dimensions required");
  requireField(/^[a-f0-9]{64}$/i.test(art.approvedSha256??""),"ART_HASH_MISSING","Approved art SHA-256 required");
  requireField(Boolean(normalizeText(art.path)),"ART_PATH_MISSING","Verified-path or embedded asset identity required");
  if(nativeOK&&result.scale){
    const {sceneWidth,sceneHeight,logicalColumns,logicalRows}=result.scale;
    const sx=sceneWidth/art.sourceWidth,sy=sceneHeight/art.sourceHeight;
    requireField(near(sx,sy),"ASPECT_RATIO_OR_TRANSFORM_MISMATCH","Spatial reprojection requires one uniform scale without cropping");
    result.projection={sourceSpace:"approved-image-pixels",targetSpace:"Foundry-scene-pixels",scaleX:sx,scaleY:sy,
      originalPixelsPerCellX:art.sourceWidth/logicalColumns,
      originalPixelsPerCellY:art.sourceHeight/logicalRows,
      targetPixelsPerCell:gridSize};
    if(sx>1+0.00001)add(warnings,"UPSCALE_NOT_NEW_DETAIL","Enlarging approved raster preserves geometry but cannot increase real source detail");
    if(art.sourceWidth>8000||art.sourceHeight>8000||sceneWidth>8000||sceneHeight>8000)
      add(warnings,"GPU_TEXTURE_DIMENSION_RISK","Scene may exceed conservative client GPU texture dimensions");
  }
  requireField(spec.geometryAuthority==="reconciled-blueprint","GEOMETRY_AUTHORITY_MISSING",
    "Approved MapSpec/Spatial Blueprint must own geometry, not painted pixels");
  for(const [key,name] of [["walls","wall"],["lights","light"],["regions","Region"],["behaviors","Region behavior"]]){
    const entries=expected[key];
    requireField(Array.isArray(entries),"MISSING_"+key.toUpperCase()+"_MANIFEST","Explicit "+name+" inventory required, including an empty array when intentionally absent");
    if(Array.isArray(entries)){
      requireField(entries.every(x=>Boolean(normalizeText(x.key)))&&unique(entries.map(x=>x.key)),
        "INVALID_"+key.toUpperCase()+"_KEYS","Every "+name+" must have a unique semantic key");
      if(key==="regions")for(const region of entries){
        if(region.required===true&&!region.mechanicsOwner){
          add(blockers,"REGION_MECHANICS_OWNER_MISSING","Required Region "+region.key+" has no installed native/module owner");
        }
        if(region.required===true&&region.state==="placeholder"){
          add(blockers,"REGION_PLACEHOLDER","Required Region "+region.key+" is not playable");
        }
      }
      if(key==="behaviors")for(const behavior of entries){
        if(behavior.required && behavior.state!=="ready" && behavior.state!=="deferred-approved")
          add(blockers,"REQUIRED_BEHAVIOR_UNRESOLVED","Required behavior "+behavior.key+" lacks a real configuration");
        if(behavior.targetUuid && !behavior.runtimeResolved)
          add(blockers,"STALE_UUID_BINDING","Behavior "+behavior.key+" uses an unverified document UUID");
      }
    }
  }
  const world=normalizeText(observation.worldId);
  if(world&&spec.worldId!==world)add(blockers,"WORLD_MISMATCH","Observed Foundry world differs from specification");
  if(observation.runtimeChecked){
    requireField(observation.isGM===true&&observation.activeGM===true,"ACTIVE_GM_REQUIRED","Live mutation requires current elected active GM");
    requireField(observation.foundryVersion==="14.367"&&observation.systemId==="dnd5e"&&observation.systemVersion==="5.3.3",
      "RUNTIME_PROFILE_MISMATCH","Exact-stack runtime must be attested before installation");
    requireField(observation.imageAvailable===true,"STAGED_IMAGE_UNAVAILABLE","Approved image must be served and verified");
    requireField(observation.imageHashMatches===true,"STAGED_IMAGE_UNVERIFIED","Served image hash must match approved art");
  }
  const sameName=observation.sceneMatches??[];
  const sameKey=observation.semanticMatches??[];
  if(sameName.length>1||sameKey.length>1)add(blockers,"AMBIGUOUS_SCENE_IDENTITY","Duplicate exact scene names or semantic keys found");
  if(sameName.length===1&&sameKey.length===1&&sameName[0].id!==sameKey[0].id)
    add(blockers,"SCENE_IDENTITY_COLLISION","Scene name and semantic key resolve to different documents");
  const existing=observation.scene??null;
  if(existing){
    if(normalizeText(existing.name)!==spec.sceneName||normalizeText(existing.folderName)!==spec.folderName)
      add(blockers,"EXISTING_SCENE_FOREIGN","Existing scene identity or folder mismatch");
    if(existing.semanticKey && existing.semanticKey!==spec.semanticKey)
      add(blockers,"EXISTING_SCENE_OWNER_MISMATCH","Existing scene has different semantic owner");
    if(result.scale && (!near(existing.width,result.scale.sceneWidth)||!near(existing.height,result.scale.sceneHeight)||
       existing.gridSize!==gridSize||existing.gridType!==gridType||existing.gridDistance!==distance))
      add(blockers,"EXISTING_SCENE_SCALE_MIGRATION_REQUIRED","Existing Scene cannot be silently resized or remapped; snapshot and approved migration required");
    if(existing.backgroundPath&&existing.backgroundPath!==art.path)
      add(blockers,"EXISTING_ART_CONFLICT","Existing scene art differs from approved path; preserve artwork");
    if(existing.semanticKey===null)add(warnings,"LEGACY_ADOPTION_PREVIEW_ONLY","Existing unflagged scene requires guarded legacy adoption before writing ownership flags");
  }
  if(blockers.length)result.status="BLOCKED";
  else if(warnings.length)result.status="READY_WITH_WARNINGS";
  else result.status="READY";
  checks.push({name:"non-mutating prototype",result:"PASS",writes:0});
  return result;
}

export function mapImagePointToScene(point,projection) {
  if(!Array.isArray(point)||point.length!==2||!point.every(Number.isFinite))throw new Error("Invalid MapSpec point");
  if(!projection || !finitePositive(projection.scaleX)||!finitePositive(projection.scaleY)||!near(projection.scaleX,projection.scaleY))
    throw new Error("No approved uniform coordinate transform");
  return [point[0]*projection.scaleX,point[1]*projection.scaleY];
}
