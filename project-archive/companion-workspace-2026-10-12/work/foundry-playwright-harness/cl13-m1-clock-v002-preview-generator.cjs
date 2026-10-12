'use strict';
const fs=require('node:fs'),path=require('node:path');
const root=__dirname;
const source=fs.readFileSync(path.join(root,'cl13-seventh-winter-clock-region-source-v002.js'),'utf8');
const ids=['0CSBwzcszPKyaB8u','5K1uASAARnX8aZhP','EDdktL7VUihbpKe9','UNySMm7YkyYfh41x','Zq8iXByDVhHRbA7w','sI4YVZZChgey1qNi','iqfCcDpEer4pwrJj','DLcheEi6e5OHOYmU','U8S5ZrTjaPIkTUIL','JZkxX6lUQe8Nc8xJ','LXTA8mx1rJ2L6e2J','MAbLfBqG7qIVVuLN','4pc5akMBieHU7GvV','pHQvDUDlyWZFuNrX','if9iWDRjSwI87EeX','PVf6Gbrv9HbB88uZ','La9krMOMBhAhDLi6','ImeIdHbYb6kZKAdt','ez9MSQ8QIO4cW6zo','aIKQmFiuXWipEdyb','HWitOe1wSid7MZ1y'];
const preview=`// CL13 revised v002 fully read-only preview, no Foundry mutation.
const staged=${JSON.stringify(source)};
const cids=${JSON.stringify(ids)};
const digest=async x=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(x)))),b=>b.toString(16).padStart(2,"0")).join("");
const scenes=cids.map(id=>game.scenes.get(id));
if(scenes.some(x=>!x))throw Error('CANONICAL_SCENE_MISSING');
const regions=scenes.reduce((n,s)=>n+s.regions.size,0);
const behaviors=scenes.reduce((n,s)=>n+Array.from(s.regions).reduce((v,r)=>v+r.behaviors.size,0),0);
const scene=game.scenes.get('U8S5ZrTjaPIkTUIL');
const region=scene?.regions.get('3tIrR12uv8ppFkOb');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state;
const expectedSha='e669a6f7703eaada989886a6fd3058eab50df8d5661379aa27d10bc3ebedbeed';
const sh=await digest(staged);
const owned=[
 ['U1','if9iWDRjSwI87EeX','V1JRfiR56dgVGRa3','875pl2PyFUnEYO75','d37b49522da7e80c2ecbfb4ed9b031a827193620a7d315e1c1a69e3357ca45c4'],
 ['E4','DLcheEi6e5OHOYmU','eRjDUWAIS206MyZV','AjFHwHDxH7Pg9Vel','b7516e6f5fcd64822766fe7645d8c1462de9c318b2248fe3fcde010f28d1b93e'],
 ['M1','U8S5ZrTjaPIkTUIL','5H97UQm6VF3vw5Ru','1SyWN6w9CrUxgVhb','fa47aeb7a166b0e3dd84ffb6c6f30445f0c4fb4677eb71f1b58d9fcdee3c578a']];
const current=[];
for(const [name,s,r,b,expected] of owned){
 const beh=game.scenes.get(s)?.regions.get(r)?.behaviors.get(b);
 const sha=await digest(beh?.system?.source??'');
 current.push({name,behaviorId:b,sourceSha:sha,expected,matched:sha===expected});
}
const duplicates=scenes.flatMap(s=>Array.from(s.regions)).flatMap(r=>Array.from(r.behaviors))
 .filter(b=>b.getFlag('world','dicebox')?.stableId==='dbx:central-lodge:m1:behavior:clock-setting-seventh-winter-v002').length;
const okay=sh===expectedSha&&regions===202&&behaviors===116&&current.every(c=>c.matched)
 &&game.version==='14.367'&&game.system.id==='dnd5e'&&game.system.version==='5.3.3'
 &&game.world.id==='the-lost-mine-of-phandalin'&&region?.behaviors.size===0&&duplicates===0
 &&ledger?.revision===1&&ledger.puzzles.m1.clockSettingResolved===false;
return {operation:'cl13.seventh-winter.v002.preview',status:okay?'PASS_STAGED_NO_WRITE':'BLOCKED',
 noWrite:true,sourceSha:sh,version:'v002',canonical:{scenes:scenes.length,regions,behaviors},
 clock:{regionId:region?.id,behaviorCount:region?.behaviors.size,stableId:region?.getFlag('world','dicebox')?.stableId},
 pinnedSources:current,ledgerRevision:ledger?.revision,duplicateCount:duplicates,
 approvedAnswer:'04:35',next:'guarded install only after E4 checkpoint safety blocker reconciled'};
`;
const out=path.join(root,'cl13-m1-clock-v002-preview-readonly.page.js');
fs.writeFileSync(out,preview,'utf8');
console.log('PREVIEW_CREATED',out,'source_bytes',source.length);
