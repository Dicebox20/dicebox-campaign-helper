// CL13 The Seventh Winter: read-only inventory. No mutations or arbitrary script eval.
const sceneIds=['U8S5ZrTjaPIkTUIL','DLcheEi6e5OHOYmU'];
const scenes=sceneIds.map(id=>{const s=game.scenes.get(id);return s?{
 id:s.id,name:s.name,regions:s.regions.map(r=>({id:r.id,name:r.name,
 behaviorCount:r.behaviors.size,behaviorNames:r.behaviors.map(b=>b.name),
 shapeKinds:r.shapes?.map?.(a=>a.type).slice(0,5)??[]
 }))}: {id,missing:true}});
const m1=game.scenes.get(sceneIds[0]);
const clock=m1?.regions.get('3tIrR12uv8ppFkOb');
const ledger=game.journal.get('xhlXv6CCH34HVga3')?.getFlag('world','dicebox')?.state??{};
const names=['U1','E4','M1','Clock','Genealogy','Grave','Family Record'];
const relevantScenes=game.scenes.filter(s=>names.some(n=>s.name.toLowerCase().includes(n.toLowerCase())))
.map(s=>({id:s.id,name:s.name}));
const journals=game.journal.filter(j=>/genealog|family|grave|clock|chronolog|estate|reliquary/i.test(j.name))
.slice(0,20).map(j=>({id:j.id,name:j.name,pageTitles:j.pages.map(p=>p.name).slice(0,8)}));
const canonicalItems=game.items.filter(i=>/Family Reliquary Key|Brass Baggage Token|Silver Family Emblem/i.test(i.name))
.map(i=>({id:i.id,name:i.name,stableId:i.getFlag('world','dicebox')?.stableId}));
return {operation:'cl13.m1-clock-readonly-inventory-v001',noWrite:true,
identity:{world:game.world.id,foundry:game.version,system:game.system.id,systemVersion:game.system.version,user:game.user.name,isGM:game.user.isGM},
scenes,clock:{exists:!!clock,behaviorCount:clock?.behaviors.size},relevantScenes,journals,canonicalItems,
ledger:{revision:ledger.revision,puzzles:{m1:ledger.puzzles?.m1},items:{familyReliquaryKey:ledger.items?.familyReliquaryKey,brassBaggageToken:ledger.items?.brassBaggageToken}}};
