const OP="central-lodge.cl91.item-coverage.readonly.v001";
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},keys=Object.keys(l.items??{}),uses=[],parts=[];
for(const s of game.scenes)if(s.name.startsWith("Central Lodge")||/^(T[123]|F[12])\b/.test(s.name))for(const r of s.regions)for(const b of r.behaviors)parts.push({scene:s.name,region:r.name,behavior:b.name,stable:b.getFlag("world","dicebox")?.stableId,source:String(b.system?.source??"")});
for(const key of keys){
 const match=parts.filter(x=>x.source.includes(key)),exact=match.filter(x=>new RegExp("itemKey\\s*:\\s*['\"]"+key+"['\"]").test(x.source)||new RegExp("itemKey\\s*=\\s*['\"]"+key+"['\"]").test(x.source));
 uses.push({key,mentions:match.length,explicitPickupOrSocket:exact.length,scenes:[...new Set(match.map(x=>x.scene))],examples:match.slice(0,4).map(x=>({behavior:x.behavior,stable:x.stable}))});
}
return{operation:OP,noWrite:true,totalCanonicalKeys:keys.length,unmentioned:uses.filter(x=>x.mentions===0),noExactItemKey:uses.filter(x=>x.explicitPickupOrSocket===0),keysWithMentions:uses.filter(x=>x.mentions>0).length,coverage:uses,limitations:"Source-text mention coverage is a heuristic, not proof of runtime grant or player access."};