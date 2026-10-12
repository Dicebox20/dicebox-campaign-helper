'use strict';
// Build exact-source, no-write live preview. Does not invoke Foundry by itself.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const here=__dirname,manifest=JSON.parse(fs.readFileSync(path.join(here,'cl50-r1-staged-sources-v001.manifest.json'),'utf8'));
const locked=manifest.routes.map(r=>({name:r.key,sourceHash:r.sha256,config:r,source:fs.readFileSync(path.join(here,r.file),'utf8').trimEnd()}));
const lit=JSON.stringify(locked);
const out=[
'// CL-50 R1 bidirectional 2-source guarded PREVIEW; NOT an installer.',
'const OP="cl50.r1.guarded-readonly-preview.v001",expected='+lit+';',
'const roster=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];',
'const errors=[],notes=[],audit=[];',
'const hash=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v))),x=>x.toString(16).padStart(2,"0")).join("");',
'const world=game.world?.id,ver=(game.version??game.release?.version),sys=game.system?.version;',
'const state=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};',
'if(world!=="the-lost-mine-of-phandalin"||ver!=="14.367"||sys!=="5.3.3")errors.push("Wrong world/version");',
'if(state.revision!==1)errors.push("Ledger revision not initial 1");',
'if(roster.some(id=>!game.scenes.has(id))||roster.length!==21||game.macros.size!==134)errors.push("Canonical Scene roster or Macro count drift");',
'let regions=0,behaviors=0;for(const id of roster){const s=game.scenes.get(id);if(!s)continue;regions+=s.regions.size;for(const r of s.regions)behaviors+=r.behaviors.size;}',
'if(regions!==202||behaviors!==116)errors.push("Region or behavior count drift");',
'if([...game.scenes].reduce((n,s)=>n+s.tokens.size,0)<0)errors.push("Impossible token count");',
'for(const r of expected){',
' const c=r.config,s=game.scenes.get(c.sourceScene),t=game.scenes.get(c.targetScene),src=s?.regions?.get(c.sourceRegion),mouth=t?.regions?.get(c.targetRegion);',
' if(!s||!t||!src||!mouth){errors.push(r.name+" scene/endpoint missing");continue;}',
' if(src.behaviors.size!==0)errors.push(r.name+" source not empty");',
' const sf=src.getFlag("world","dicebox")??{};',
' if(sf.stableId!==c.sourceStable||mouth.getFlag("world","dicebox")?.stableId!==c.targetStable)errors.push(r.name+" stable IDs drift");',
' if((sf.destinationStableSceneId??null)!==null||((sf.bindingStatus??null)!==null&&sf.bindingStatus!=="UNBOUND_DO_NOT_GUESS"))errors.push(r.name+" already bound");',
' const scriptHash=await hash(r.source);if(scriptHash!==r.sourceHash)errors.push(r.name+" source SHA drift");',
' const found=[...game.scenes].flatMap(x=>[...x.regions].flatMap(y=>[...y.behaviors].filter(b=>b.getFlag("world","dicebox")?.stableId===c.behaviorStable)));',
' if(found.length)errors.push(r.name+" duplicate stable ID");',
' const ephemeral=new foundry.documents.RegionDocument({name:"Preview only",hidden:true,shapes:[{type:"rectangle",...c.destinationRect,rotation:0,hole:false,gridBased:false}]},{parent:t});',
' const sample=await ephemeral.spawnTokens([{name:"Ephemeral preview",width:1,height:1,actorLink:false,x:0,y:0}],{create:false,placement:"center",snap:false});',
' const token=sample?.[0],insideMouth=token?.testInsideRegion(mouth),overlaps=[...t.regions].filter(z=>token?.testInsideRegion(z)).map(z=>({id:z.id,name:z.name,behaviors:z.behaviors.size}));',
' if(!token||insideMouth)errors.push(r.name+" landing overlaps return mouth");',
' const gate=t.regions.get("kj5R2Ugu0Fx83SPT");if(t.id==="MAbLfBqG7qIVVuLN"&&token?.testInsideRegion(gate))errors.push(r.name+" arrival triggers N1 power gate");',
' if(token&&[...t.tokens].some(e=>token.x<e.x+e.width*t.grid.size&&token.x+token.width*t.grid.size>e.x&&token.y<e.y+e.height*t.grid.size&&token.y+token.height*t.grid.size>e.y))errors.push(r.name+" arrival token occupied");',
' audit.push({route:r.name,sourceScene:s.id,sourceRegion:src.id,destinationScene:t.id,destinationMouth:mouth.id,scriptSHA256:scriptHash,sourceBindingStatus:sf.bindingStatus??null,sourceDestination:sf.destinationStableSceneId??null,targetRect:c.destinationRect,arrivalTokenTopLeft:token?{x:token.x,y:token.y}:null,insideReturnMouth:insideMouth,otherRegionOverlaps:overlaps,sourceBehaviors:src.behaviors.size,sourceSceneTokens:s.tokens.size,destinationSceneTokens:t.tokens.size});',
'}',
'const t1=game.scenes.get("ImeIdHbYb6kZKAdt")?.getFlag("world","dicebox")?.route??{};',
'if(t1.orientationStatus!=="UNBOUND_DO_NOT_GUESS"||t1.terminalA!==null||t1.terminalB!==null)errors.push("T1 Scene route flags unexpectedly changed");',
'return{operation:OP,noWrite:true,status:errors.length?"BLOCKED":"PASS_STAGED_FOR_GUARDED_APPLY",errors,notes,counts:{canonicalScenes:roster.length,worldScenes:game.scenes.size,regions,behaviors,macros:game.macros.size,ledgerRevision:state.revision},t1RouteFlag:t1,preview:audit,unexecuted:["no createEmbeddedDocuments","no Region update","no Macro execution","no audio","no token teleport"],limits:["1x1 tokens only","players not present for canary","Preview validates simulated position only, not moved-player presentation"]};'
].join('\n')+'\n';
const file=path.join(here,'cl50-r1-guarded-preview-v001.page.js');
fs.writeFileSync(file,out,'utf8');
console.log(JSON.stringify({status:'PREVIEW_FILE_BUILT_NO_WORLD_WRITE',file,bytes:Buffer.byteLength(out),sha256:crypto.createHash('sha256').update(out).digest('hex')},null,2));
