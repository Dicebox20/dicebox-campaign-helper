const names=[["M1","U8S5ZrTjaPIkTUIL"],["M2","JZkxX6lUQe8Nc8xJ"],["U2","PVf6Gbrv9HbB88uZ"]],out=[];
for(const [key,id] of names){const s=game.scenes.get(id);for(const r of s.regions)for(const b of r.behaviors){const src=String(b.system?.source??"");out.push({scene:key,region:r.name,behavior:b.name,behaviorId:b.id,source:src});}}
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state?.puzzles??{};
return{operation:"cl91.m1-m2-u2-statepath-reconciliation",noWrite:true,canonical:{m1:l.m1,m2:l.m2,u2:l.u2},behaviorSources:out};