const ids=[["M1","U8S5ZrTjaPIkTUIL"],["N3","pHQvDUDlyWZFuNrX"]],res=[];
for(const [key,id] of ids){
 const s=game.scenes.get(id),regs=[];
 for(const r of s.regions){const f=r.getFlag("world","dicebox")??{},bs=[];for(const b of r.behaviors){let src=b.system?.source??"";bs.push({id:b.id,name:b.name,stableId:b.getFlag("world","dicebox")?.stableId,events:Array.from(b.system?.events??[]),source:key==="M1"?src:(/(wheel|overlay|cartography|route|plate|branch|departure)/i.test(b.name)?src:src.slice(0,170))});}
 regs.push({id:r.id,name:r.name,stableId:f.stableId,regionClass:f.regionClass,role:f.regionRole,bindingStatus:f.bindingStatus,behaviors:bs});
 }res.push({key,id,sceneFlags:s.getFlag("world","dicebox"),tokens:s.tokens.size,regions:regs});
}
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
return{operation:"cl91-clock-n3-mechanism-deep-intake",noWrite:true,scenes:res,ledgerM1:l.puzzles?.m1,ledgerN3:l.puzzles?.n3,ledgerItems:Object.fromEntries(Object.entries(l.items??{}).filter(([k])=>/emblem|baggage|reliquary|wheel|route/.test(k)))};