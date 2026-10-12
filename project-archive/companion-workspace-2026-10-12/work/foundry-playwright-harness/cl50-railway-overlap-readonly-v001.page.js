// CL-50 overlap diagnosis; read-only, no scripts executed.
const targets=[
{scene:"MAbLfBqG7qIVVuLN",name:"N1 East",regions:["ZF81UaNygOG9OXAw","kj5R2Ugu0Fx83SPT"]},
{scene:"4pc5akMBieHU7GvV",name:"N2 A/B",regions:["yjBrtTpesvH5gJKv","q8sQMxxeIMSkjCTX","8s78TfboLnycmqRY"]},
{scene:"pHQvDUDlyWZFuNrX",name:"N3 West",regions:["kuJ5pPqDjTJur5l4","pqLFzMbGtFhKbCNK"]}
];
const rows=[],errors=[];
for(const t of targets){
 const s=game.scenes.get(t.scene);if(!s){errors.push("Scene missing: "+t.scene);continue;}
 for(const rid of t.regions){
  const r=s.regions.get(rid);if(!r){errors.push("Region missing: "+rid);continue;}
  rows.push({landing:t.name,region:r.name,id:r.id,stableId:r.getFlag("world","dicebox")?.stableId,
   shape:r.toObject().shapes,behaviors:[...r.behaviors].map(b=>{
   const source=String(b.system?.source??"");
   return {name:b.name,id:b.id,stableId:b.getFlag("world","dicebox")?.stableId,events:b.system?.events??null,disabled:b.disabled,
    sourceLength:source.length,hasTeleport:source.includes("teleportToken("),
    hasDiceboxDispatch:/speaker\s*:\s*\{\s*dicebox/.test(source),
    action:(source.match(/action\s*:\s*["']([^"']+)/)||[])[1]??null,
    sourcePrefix:source.slice(0,650)};
   })});
 }
}
return {operation:"cl50.railway-overlap-readonly-v001",status:errors.length?"PARTIAL":"PASS",noWrite:true,errors,rows};
