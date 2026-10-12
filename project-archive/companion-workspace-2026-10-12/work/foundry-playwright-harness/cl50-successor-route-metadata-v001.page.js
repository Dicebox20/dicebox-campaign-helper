// CL-50 successor live read-only railway authority audit. No Foundry mutations.
const SCENES=[
["N1","MAbLfBqG7qIVVuLN"],["T1","ImeIdHbYb6kZKAdt"],
["N2","4pc5akMBieHU7GvV"],["T2","ez9MSQ8QIO4cW6zo"],
["N3","pHQvDUDlyWZFuNrX"]];
const rows=[],errors=[];
for(const [key,id] of SCENES){
 const s=game.scenes.get(id); if(!s){errors.push("Missing "+key+" "+id);continue;}
 const f=s.getFlag("world","dicebox")??{};
 const routeFields=Object.fromEntries(Object.entries(f).filter(([k])=>/rail|tunnel|route|station|transition|bound|sceneKey|stableId/i.test(k)));
 const regions=[];
 for(const r of s.regions){
  if(!/rail|tunnel|mouth|entrance|exit|transition|passage|platform/i.test(r.name))continue;
  const rf=r.getFlag("world","dicebox")??{};
  const fields=Object.fromEntries(Object.entries(rf).filter(([k])=>/dest|route|trans|bound|stable|regionRole|anchor|gate|prereq/i.test(k)));
  regions.push({name:r.name,id:r.id,fields,shapes:r.toObject().shapes,behaviors:[...r.behaviors].map(b=>({id:b.id,name:b.name,disabled:b.disabled,type:b.type,events:b.system?.events??null}))});
 }
 rows.push({key,id,title:s.name,background:s.background?.src??null,foreground:s.foreground??null,dimensions:{width:s.width,height:s.height},sceneFields:routeFields,regions});
}
return{operation:"cl50-successor-route-metadata-v001",status:errors.length?"PARTIAL":"PASS",noWrite:true,errors,scenes:rows};