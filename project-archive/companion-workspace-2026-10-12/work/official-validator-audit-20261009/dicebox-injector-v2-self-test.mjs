import assert from "node:assert/strict";
import {previewInjector2,mapImagePointToScene,BATTLEMAP_120,TOKEN_SOURCE_TARGETS} from "./dicebox-injector-v2-core.mjs";
const copy=x=>structuredClone(x);
const hash="dad418cf5ff2eb0a1cd0491881a60452b28b91325f0b65cd968b410dfba70e9a";
const spec={semanticKey:"btr-expedition-m01-forgotten-road",sceneName:"M01 — The Forgotten Road",
folderName:"Beyond the Realms — Underdark Expedition",worldId:"the-forgotten-realms",footprintApproved:true,
geometryAuthority:"reconciled-blueprint",
scale:{logicalColumns:24,logicalRows:16,physicalWidthFt:120,physicalHeightFt:80,gridType:0,gridSize:120,distance:5,units:"ft"},
art:{sourceWidth:1536,sourceHeight:1024,approvedSha256:hash,path:"worlds/the-forgotten-realms/assets/dicebox-expedition/M01_Forgotten_Road_final.png"},
expected:{walls:[{key:"w1"}],lights:[{key:"torch1"}],regions:[{key:"mine1",required:true,mechanicsOwner:"regionwright-mining"}],
behaviors:[{key:"mining",required:true,state:"ready"}]}};
const existing={name:spec.sceneName,folderName:spec.folderName,semanticKey:spec.semanticKey,width:2880,height:1920,gridType:0,gridSize:120,gridDistance:5,backgroundPath:spec.art.path};
const observation={worldId:"the-forgotten-realms",sceneMatches:[{id:"s1"}],semanticMatches:[{id:"s1"}],scene:existing};
let checks=0;
function check(name,edit,want){const a=copy(spec),b=copy(observation);edit(a,b);const o=previewInjector2(a,b);assert.equal(o.status,want.status,name+" status");if(want.code)assert.ok(o.blockers.some(x=>x.code===want.code),name+" code");assert.equal(o.writes,0);checks++;}
assert.equal(BATTLEMAP_120.gridSize,120);checks++;
assert.equal(TOKEN_SOURCE_TARGETS.Medium,512);checks++;
check("canonical plan",(a,b)=>{}, {status:"READY_WITH_WARNINGS"});
check("missing approved footprint",(a)=>{a.footprintApproved=false},{status:"BLOCKED",code:"FOOTPRINT_NOT_APPROVED"});
check("missing physical feet",(a)=>{a.scale.physicalWidthFt=null},{status:"BLOCKED",code:"DIMENSIONS_UNRESOLVED"});
check("physical mismatch",(a)=>{a.scale.physicalWidthFt=180},{status:"BLOCKED",code:"PHYSICAL_EXTENT_MISMATCH"});
check("silent 64px scale",(a)=>{a.scale.gridSize=64},{status:"BLOCKED",code:"UNAPPROVED_SCALE_EXCEPTION"});
check("approved scale exception",(a,b)=>{a.scale.gridSize=64;a.scale.exceptionApproved=true;a.scale.exceptionReason="Historic grandfathered map";b.scene.width=1536;b.scene.height=1024;b.scene.gridSize=64},{status:"READY"});
check("aspect warp",(a)=>{a.art.sourceHeight=1000},{status:"BLOCKED",code:"ASPECT_RATIO_OR_TRANSFORM_MISMATCH"});
check("art hash missing",(a)=>{a.art.approvedSha256=""},{status:"BLOCKED",code:"ART_HASH_MISSING"});
check("geometry authority missing",(a)=>{a.geometryAuthority="pixels"},{status:"BLOCKED",code:"GEOMETRY_AUTHORITY_MISSING"});
check("duplicate wall semantic keys",(a)=>{a.expected.walls.push({key:"w1"})},{status:"BLOCKED",code:"INVALID_WALLS_KEYS"});
check("mechanic placeholder",(a)=>{a.expected.regions[0].state="placeholder"},{status:"BLOCKED",code:"REGION_PLACEHOLDER"});
check("mechanic owner missing",(a)=>{delete a.expected.regions[0].mechanicsOwner},{status:"BLOCKED",code:"REGION_MECHANICS_OWNER_MISSING"});
check("behavior unconfigured",(a)=>{a.expected.behaviors[0].state="unknown"},{status:"BLOCKED",code:"REQUIRED_BEHAVIOR_UNRESOLVED"});
check("unverified UUID",(a)=>{a.expected.behaviors[0].targetUuid="Scene.xyz.Region.abc"},{status:"BLOCKED",code:"STALE_UUID_BINDING"});
check("world mismatch",(a,b)=>{b.worldId="wrong"},{status:"BLOCKED",code:"WORLD_MISMATCH"});
check("runtime permission denied",(a,b)=>{b.runtimeChecked=true;b.isGM=false;b.activeGM=false;b.foundryVersion="14.367";b.systemId="dnd5e";b.systemVersion="5.3.3";b.imageAvailable=true;b.imageHashMatches=true},{status:"BLOCKED",code:"ACTIVE_GM_REQUIRED"});
check("served image unavailable",(a,b)=>{b.runtimeChecked=true;b.isGM=true;b.activeGM=true;b.foundryVersion="14.367";b.systemId="dnd5e";b.systemVersion="5.3.3";b.imageAvailable=false;b.imageHashMatches=true},{status:"BLOCKED",code:"STAGED_IMAGE_UNAVAILABLE"});
check("scene collision",(a,b)=>{b.sceneMatches=[{id:"s1"},{id:"s2"}]},{status:"BLOCKED",code:"AMBIGUOUS_SCENE_IDENTITY"});
check("scene disagreement",(a,b)=>{b.semanticMatches=[{id:"else"}]},{status:"BLOCKED",code:"SCENE_IDENTITY_COLLISION"});
check("wrong folder",(a,b)=>{b.scene.folderName="Elsewhere"},{status:"BLOCKED",code:"EXISTING_SCENE_FOREIGN"});
check("stale scale",(a,b)=>{b.scene.width=1536;b.scene.height=1024;b.scene.gridSize=64},{status:"BLOCKED",code:"EXISTING_SCENE_SCALE_MIGRATION_REQUIRED"});
check("legacy scene not silently adopted",(a,b)=>{b.scene.semanticKey=null},{status:"READY_WITH_WARNINGS"});
const out=previewInjector2(spec,observation);assert.equal(out.scale.sceneWidth,2880);assert.equal(out.scale.sceneHeight,1920);assert.equal(out.projection.scaleX,1.875);assert.deepEqual(mapImagePointToScene([500,400],out.projection),[937.5,750]);checks++;
assert.throws(()=>mapImagePointToScene([0,2],{scaleX:2,scaleY:3}),/uniform/);checks++;
console.log(JSON.stringify({operation:"dicebox-injector-2.0.prototype-preflight-self-test",status:"PASS",cases:checks,sourceRaster:"1536x1024",candidateScale:"24x16 logical spaces => 2880x1920",liveWrites:0}));
