'use strict';
// Bounded CL-50 R1 source staging only; NEVER dispatches to Foundry.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const here=__dirname;
const routes=[
{key:'n1-to-t1',sourceScene:'MAbLfBqG7qIVVuLN',sourceRegion:'xsitdXO94BHJkYKX',sourceStable:'dbx:central-lodge:n1:region:n1-rail-tunnel-east',targetScene:'ImeIdHbYb6kZKAdt',targetRegion:'ewIAYppRLvgIV1b7',targetStable:'dbx:central-lodge:t1:region:mouth-a',binding:'BOUND_CL50_R1_N1_TO_T1',targetSceneStable:'dbx:central-lodge:t1',behaviorStable:'dbx:central-lodge:n1:behavior:r1-n1-east-to-t1-a',destinationRect:{x:430,y:1240,width:380,height:400},directionText:'Walk east from the Lodge railway station into the Grotto railway tunnel.',yes:'Enter T1',dialogTitle:'Railway: Lodge Station to Tunnel'},
{key:'t1-to-n1',sourceScene:'ImeIdHbYb6kZKAdt',sourceRegion:'ewIAYppRLvgIV1b7',sourceStable:'dbx:central-lodge:t1:region:mouth-a',targetScene:'MAbLfBqG7qIVVuLN',targetRegion:'xsitdXO94BHJkYKX',targetStable:'dbx:central-lodge:n1:region:n1-rail-tunnel-east',binding:'BOUND_CL50_R1_T1_TO_N1',targetSceneStable:'dbx:central-lodge:n1',behaviorStable:'dbx:central-lodge:t1:behavior:r1-t1-a-to-n1-east',destinationRect:{x:3722,y:1310,width:136,height:320},directionText:'Leave the Grotto railway tunnel and return to the Lodge station.',yes:'Return to N1',dialogTitle:'Railway: Tunnel to Lodge Station'}
];
function build(config){
const c=JSON.stringify(config);
return [
'// DiceBox CL-50 R1 original approved N1 East <-> T1 Mouth A. Source only; GM-confirmed one-way handler.',
'const __c='+c+';',
'if(game.world?.id!=="the-lost-mine-of-phandalin" || (game.version??game.release?.version)!=="14.367" || game.system?.version!=="5.3.3") return;',
'const __primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];',
'if(!__primary || !game.user?.isGM || game.user.id!==__primary.id) return;',
'const __token=event?.data?.token??event?.token??null;',
'const __actor=__token?.actor??null;',
'const __source=event?.region?.parent??game.scenes.get(__c.sourceScene);',
'const __src=__source?.regions?.get(__c.sourceRegion);',
'const __toScene=game.scenes.get(__c.targetScene);',
'const __destMouth=__toScene?.regions?.get(__c.targetRegion);',
'if(!__token||!__actor||__token.parent?.id!==__c.sourceScene||__source?.id!==__c.sourceScene||!__src||!__destMouth) return;',
'const __sf=__src.getFlag("world","dicebox")??{};',
'if(__sf.stableId!==__c.sourceStable||__sf.destinationStableSceneId!==__c.targetSceneStable||__sf.bindingStatus!==__c.binding) return;',
'if(__destMouth.getFlag("world","dicebox")?.stableId!==__c.targetStable) return;',
'if(Number(__token.width)!==1||Number(__token.height)!==1){ui.notifications?.warn("This route is staged for one-square tokens only. Request GM manual Scene transfer for larger tokens.");return;}',
'const __slots=globalThis.__diceboxCl50R1Travel??={pending:new Set(),cooldownUntil:new Map()};',
'const __key=String(__actor.uuid??__actor.id??__token.id);',
'if(__slots.pending.has(__key)||Date.now()<(__slots.cooldownUntil.get(__key)??0))return;',
'__slots.pending.add(__key);',
'try{',
' const __ephemeral=new foundry.documents.RegionDocument({name:"DiceBox R1 Temporary Arrival",hidden:true,shapes:[{type:"rectangle",...__c.destinationRect,rotation:0,hole:false,gridBased:false}]},{parent:__toScene});',
' const __sample=(await __ephemeral.spawnTokens([__token],{create:false,placement:"center",snap:false,avoidOccupied:true}))?.[0];',
' if(!__sample||__sample.testInsideRegion(__destMouth))throw Error("Arrival placement overlaps return mouth");',
' if([...__toScene.regions].some(r=>r.id!==__destMouth.id&&r.behaviors.size>0&&(r.getFlag("world","dicebox")?.regionClass==="transition"||r.getFlag("world","dicebox")?.regionRole==="scene-transition-anchor")&&__sample.testInsideRegion(r)))throw Error("Arrival intersects another transition");',
' const __gs=__toScene.grid.size;',
' const __tx=__sample.x,__ty=__sample.y,__tw=__gs*Number(__sample.width),__th=__gs*Number(__sample.height);',
' if(!(__tx>=0&&__ty>=0&&__tx+__tw<=__toScene.width&&__ty+__th<=__toScene.height))throw Error("Arrival out of bounds");',
' if([...__toScene.tokens].some(t=>__tx<t.x+Number(t.width)*__gs&&__tx+__tw>t.x&&__ty<t.y+Number(t.height)*__gs&&__ty+__th>t.y))throw Error("Arrival occupied");',
' const __yes=await foundry.applications.api.DialogV2.confirm({window:{title:__c.dialogTitle},content:"<p>"+__c.directionText+"</p><p>This moves the selected character with GM confirmation. Proceed?</p>",yes:{label:__c.yes},no:{label:"Remain Here"},modal:true,rejectClose:false});',
' if(!__yes){__slots.cooldownUntil.set(__key,Date.now()+12000);return;}',
' const __now=game.scenes.get(__c.sourceScene)?.regions.get(__c.sourceRegion);',
' const __nowTarget=game.scenes.get(__c.targetScene)?.regions.get(__c.targetRegion);',
' if(!__now||__now.getFlag("world","dicebox")?.bindingStatus!==__c.binding||__nowTarget?.getFlag("world","dicebox")?.stableId!==__c.targetStable||__token.parent?.id!==__c.sourceScene)throw Error("Endpoint drift after consent");',
' __slots.cooldownUntil.set(__key,Date.now()+20000);',
' const __moved=await __ephemeral.teleportToken(__token,{placement:"center",snap:false,avoidOccupied:true,pan:true});',
' if(__moved?.parent?.id!==__c.targetScene)throw Error("Teleport outcome unknown: require GM manual verification; do not retry");',
' let __aud=game.users.get(event?.user?.id)??null;',
' if(!__aud||__aud.isGM)__aud=game.users.find(u=>u.active&&!u.isGM&&u.character?.id===__actor.id)??null;',
' if(!__aud){const __owners=game.users.filter(u=>u.active&&!u.isGM&&__actor.testUserPermission(u,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER));if(__owners.length===1)__aud=__owners[0];}',
' if(__aud)await __toScene.pullUsers([__aud.id]);',
'}catch(__error){console.error("[DiceBox CL-50 R1] Travel not certified; GM may navigate manually.",__error);ui.notifications?.warn("Railway transfer not confirmed. GM should inspect source and destination; do not repeat until reconciled.");}',
'finally{__slots.pending.delete(__key);}'
].join('\n');
}
const outputs=[];
for(const config of routes){
 const text=build(config);
 const f='cl50-r1-'+config.key+'-source-v001.txt';
 fs.writeFileSync(path.join(here,f),text+'\n','utf8');
 outputs.push({file:f,sha256:crypto.createHash('sha256').update(text).digest('hex'),bytes:Buffer.byteLength(text),...config});
}
const manifest={schemaVersion:'1.0.0',workUnit:'central-lodge-cl50-r1-bidirectional-stage-v001',evidence:'local-staged-not-installed',routes:outputs};
fs.writeFileSync(path.join(here,'cl50-r1-staged-sources-v001.manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({status:'SOURCES_STAGED_NO_LIVE_WRITE',routes:outputs.map(x=>({file:x.file,sha256:x.sha256,bytes:x.bytes}))},null,2));
