# EXT-05 - Forgotten Gazebo background-only BUILD

Owner will place Walls and doors. No Regions or behaviors are installed. Scale is provisional and preserves the source image aspect ratio.

```javascript
// DICEBOX_BUILD_CONTRACT: dicebox-scene-injector-build/v2
// DICEBOX_SINGLE_MACRO: true
// DICEBOX_SCENE_ID: CAVEXT05Scene001
// DICEBOX_ART_MODE: verified-path
// DICEBOX_WORKFLOW: PREPARE -> RENDER -> INSPECT(PASS=APPROVED) -> BUILD
// DICEBOX_SCALE_PROFILE: battlemap-120
// DICEBOX_GRID_TYPE: gridless
// DICEBOX_GRID_SIZE: 120
// DICEBOX_GRID_DISTANCE: 5
// DICEBOX_GRID_UNITS: ft
// DICEBOX_LOGICAL_SIZE: 16x12
// DICEBOX_SCENE_PIXELS: 1920x1440
// DICEBOX_TOKEN_FOOTPRINT_POLICY: system-size
// DICEBOX_TOKEN_ART_SCALE_POLICY: visual-only
// DICEBOX_DISCOVERY_CONTRACT: dicebox-discovery/v1
// DICEBOX_DISCOVERY_COUNT: 0
// DICEBOX_DISCOVERY_DENSITY: ordinary
// DICEBOX_DISCOVERY_VISIBLE_ANCHORS: true
// DICEBOX_DISCOVERY_NOTICE_POLICY: flat-d20-no-modifiers
// DICEBOX_DISCOVERY_NOTICE_STATE: per-character-once-until-reset
// OWNER DIRECTED: NO WALLS, NO DOORS, NO REGION GEOMETRY
(async()=>{
const SPEC=Object.freeze({"sceneId":"CAVEXT05Scene001","key":"EXT-05","title":"EXT-05 - Forgotten Gazebo","manifestId":"EXT-05","path":"Maps/cabin-in-the-ashen-veil/ext-05_forgotten-gazebo_owner-approved.png","sha256":"9750d785c05078bec3014f00ea139f37b6d6340560a475c2a462cb9673cf45b2","bytes":4029887,"dims":[1448,1086]});
const DICEBOX_SCENE_SCALE=Object.freeze({
 gridType:0,gridSize:120,distance:5,units:"ft",
 logicalColumns:16,logicalRows:12,width:1920,height:1440
});
const result={operation:"cav.background-only-scene-build",sceneId:SPEC.sceneId,sceneKey:SPEC.key,status:"BLOCKED",created:false,artSha256:SPEC.sha256,ownerPlacesWalls:true};
try{
if(location.origin!=="http://127.0.0.1:30000"||location.pathname!=="/game"||
 !game?.ready||game.world?.id!=="cabin-in-the-ashen-veil"||
 !game.user?.isGM||game.users?.activeGM?.id!==game.user.id)throw Error("Active GM/origin/world gate failed");
if(game.version!=="14.367"||game.system?.id!=="dnd5e"||game.system?.version!=="5.3.3")throw Error("Exact-stack mismatch");
const present=game.scenes.get(SPEC.sceneId)||game.scenes.contents.find(s=>s.getFlag("dicebox-campaign-helper","cavStructuralSceneKey")===SPEC.key);
if(present){result.status="SKIPPED_EXISTING";result.existingId=present.id;console.log("[CAV_BG_RECEIPT] "+JSON.stringify(result));return;}
const check=async(a)=>{
const response=await fetch("/"+a.path,{cache:"no-store"});
if(!response.ok)throw Error("Image not available "+response.status);
const bytes=new Uint8Array(await response.arrayBuffer());
if(bytes.length!==a.bytes||bytes[0]!==137||bytes[1]!==80||bytes[2]!==78||bytes[3]!==71)throw Error("PNG signature/size mismatch");
const d=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
if(d.getUint32(16,false)!==a.dims[0]||d.getUint32(20,false)!==a.dims[1])throw Error("PNG dimensions mismatch");
if(!crypto?.subtle)throw Error("SHA unavailable");
const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");
if(hash!==a.sha256)throw Error("Owner approved image hash mismatch");
};
await check({path:SPEC.path,bytes:SPEC.bytes,dims:SPEC.dims,sha256:SPEC.sha256});
if(SPEC.alt)await check(SPEC.alt);
result.artVerified=true;
const data={
 _id:SPEC.sceneId,name:SPEC.title,
 width:DICEBOX_SCENE_SCALE.width,height:DICEBOX_SCENE_SCALE.height,padding:0,
 grid:{type:DICEBOX_SCENE_SCALE.gridType,size:DICEBOX_SCENE_SCALE.gridSize,distance:DICEBOX_SCENE_SCALE.distance,units:DICEBOX_SCENE_SCALE.units},
 levels:[{_id:"defaultLevel0000",name:"Ground Level",elevation:{bottom:0,top:20},background:{src:SPEC.path}}],
 initialLevel:"defaultLevel0000",
 walls:[],regions:[],active:false,navigation:true,
 flags:{"dicebox-campaign-helper":{
  cavStructuralSceneKey:SPEC.key,phase:"BACKGROUND_ONLY_OWNER_WALLS",ownerPlacesWalls:true,
  geometryStatus:"PROVISIONAL_OWNER_TO_SET_WALLS_AND_APPROVE_SCALE",
  manifestId:SPEC.manifestId,approvedArtSha256:SPEC.sha256,alternateBackground:SPEC.alt||null,
  regionBehaviorCount:0
 }}};
const Cls=CONFIG.Scene.documentClass;const preview=new Cls(data);preview.validate({strict:true});
if(preview.levels.size!==1||preview.walls.size||preview.regions.size||preview.levels.contents[0]?.background.src!==SPEC.path)throw Error("Native dry-run failed");
const created=await Cls.create(data,{keepId:true});
result.created=created?.id===SPEC.sceneId;
const s=game.scenes.get(SPEC.sceneId);
if(!s)throw Error("Created Scene absent on readback");
result.levelCount=s.levels.size;result.wallCount=s.walls.size;result.regionCount=s.regions.size;result.uuid=s.uuid;
result.path=s.levels.contents[0]?.background.src;result.width=s.width;result.height=s.height;
result.status=result.created&&result.levelCount===1&&result.wallCount===0&&result.regionCount===0&&result.path===SPEC.path&&result.width===DICEBOX_SCENE_SCALE.width&&result.height===DICEBOX_SCENE_SCALE.height?"READY_FOR_OWNER_WALLS":"FAILED_POSTREAD";
}catch(e){
 const s=game?.scenes?.get(SPEC.sceneId);result.status=s?"OUTCOME_NEEDS_REVIEW":"BLOCKED_OR_UNKNOWN";
 result.reason=String(e?.message??e).slice(0,350);if(s){result.created=true;result.uuid=s.uuid;}
}
console.log("[CAV_BG_RECEIPT] "+JSON.stringify(result));
})();
```
