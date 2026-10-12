const IDS=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const all=IDS.map(id=>game.scenes.get(id)),regions=all.flatMap(s=>Array.from(s.regions).map(r=>({r,scene:s}))),empties=regions.filter(({r})=>r.behaviors.size===0);
const texts=[];
for(const s of all){for(const r of s.regions){for(const b of r.behaviors)texts.push({name:s.name+" | "+b.name,text:String(b.system?.source??"")});}
const flagText=JSON.stringify(s.flags??{});texts.push({name:s.name+" flags",text:flagText});}
for(const m of game.macros??[])texts.push({name:"Macro | "+m.name,text:String(m.command??"")});
const direct=[],unreferenced=[];
for(const {r,scene} of empties){const sid=r.getFlag("world","dicebox")?.stableId??"",needles=[r.uuid,r.id,sid].filter(Boolean);
const refs=texts.filter(t=>needles.some(needle=>t.text.includes(needle))).map(t=>t.name);
const x={scene:scene.name,id:r.id,name:r.name,stableId:sid,refCount:refs.length,examples:refs.slice(0,4)};
if(refs.length)direct.push(x);else unreferenced.push(x);
}
const staticClasses={};for(const x of unreferenced){const r=regions.find(z=>z.r.id===x.id)?.r;const f=r?.getFlag("world","dicebox")??{};const kind=f.regionClass??f.class??f.regionRole??"unknown";staticClasses[kind]=(staticClasses[kind]??0)+1;}
return{operation:"cl.region-empty-reference-audit.v001",noWrite:true,scenes:all.length,zeroBehavior:empties.length,directRefs:direct.length,noLiteralRefs:unreferenced.length,unreferencedByClass:staticClasses,direct,warning:"Absence of literal references does not establish unused: many of these named Regions are placeholders in campaign source plans, and external modules/flags can refer dynamically."};