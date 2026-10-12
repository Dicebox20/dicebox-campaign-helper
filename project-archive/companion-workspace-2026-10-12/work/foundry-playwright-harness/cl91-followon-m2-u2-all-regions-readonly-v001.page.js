// Read-only CL91 M2/U2 full behavior and notice map
const sha=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(x)))),a=>a.toString(16).padStart(2,'0')).join('');
const scenes=[["M2","JZkxX6lUQe8Nc8xJ"],["U2","PVf6Gbrv9HbB88uZ"]];
const out=[];
for(const [short,id] of scenes){const scene=game.scenes.get(id);
out.push({scene:short,name:scene?.name,regions:scene?.regions.map(r=>({id:r.id,name:r.name,stableId:r.getFlag('world','dicebox')?.stableId,shapeCount:r.shapes?.length,behaviorCount:r.behaviors.size,behaviorDetails:r.behaviors.map(b=>({id:b.id,name:b.name,stableId:b.getFlag('world','dicebox')?.stableId,events:Array.from(b.system?.events??[]),type:b.type,enabled:!b.disabled,sha:'',source:b.system?.source??''}))}))});}
return{operation:'cl91-followon-m2-u2-all-regions-readonly',noWrite:true,foundry:game.version,state:game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state?.puzzles,scenes:out};
