// Independent CL-33 FINAL VERIFY v001, read only, frozen expected hashes.
const OP="central-lodge.cl33.migration.final-verify.v001";
const sceneMap=[["T1","ImeIdHbYb6kZKAdt","af259bcba633d5c90822622b3090c70b7e0ea5d1d0bce856554f0c9f578c22bd",6,3],["T2","ez9MSQ8QIO4cW6zo","a1533208d558f2a88a1ea68c427b632dde511a03accfb779c569b095563ad84f",6,3],["T3","aIKQmFiuXWipEdyb","e372066d468469936ce90a6065a567c0dff0d8fff6d5a48fb07404e1e0ceeead",6,3]];
const expect=[
 {key:"cicada-wing-iii",sceneId:"ImeIdHbYb6kZKAdt",regionId:"4faM8b9bJkKVYGjL",stableId:"dbx:central-lodge:t1:behavior:wing-iii-canonical-recovery",hash:"3a94336de7085861509386213400fc77fddb1159848b12c46d1449076421470a",events:["tokenEnter","tokenMoveWithin"]},
 {key:"railway-switch-wheel",sceneId:"ez9MSQ8QIO4cW6zo",regionId:"vmWCcb1mGibdl5Xv",id:"6s7f7pxMVLNNRBZR",stableId:"dbx:central-lodge:t2:behavior:switch-wheel-recovery",hash:"ed1b14b30ad8e91eb63c0ef3d249b6628e7f5d7dd9233e22e827e73847ef37d4",events:["tokenEnter"]},
 {key:"recent-route-fragment",sceneId:"aIKQmFiuXWipEdyb",regionId:"0105bbMLlC1Inzhb",id:"sY1XXM7Xz6Jj9gmR",stableId:"dbx:central-lodge:t3:behavior:route-fragment-recovery",hash:"59a275202cbc89f6ec974c12b5b0dd28a3b3e7f75428ba297dd46897c0ae9b38",events:["tokenEnter"]}
];
const allScenes=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const sha=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geo=s=>Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
const fail=[],installed=[];let regions=0,behaviors=0;
for(const id of allScenes){const s=game.scenes.get(id);if(!s){fail.push("missing scene "+id);continue;}regions+=s.regions.size;behaviors+=Array.from(s.regions).reduce((sum,r)=>sum+r.behaviors.size,0);}
if(regions!==202||behaviors!==113)fail.push("global counts drift "+regions+"/"+behaviors);
for(const [key,id,hash,rn,bn] of sceneMap){const s=game.scenes.get(id);if(!s){fail.push("missing "+key);continue;}const count=Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0);const h=await sha(JSON.stringify(norm(geo(s))));if(s.regions.size!==rn||count!==bn||h!==hash)fail.push(key+" geometry/count drift");}
for(const x of expect){const r=game.scenes.get(x.sceneId)?.regions.get(x.regionId),matches=Array.from(r?.behaviors??[]).filter(b=>b.getFlag("world","dicebox")?.stableId===x.stableId),b=matches[0];if(matches.length!==1||(x.id&&b?.id!==x.id)||b?.disabled!==false||await sha(b?.system?.source??"")!==x.hash)fail.push(x.key+" behavior drift");const e=b?.system?.events;if(e&&JSON.stringify(Array.from(e).sort())!==JSON.stringify(x.events.slice().sort()))fail.push(x.key+" events drift");installed.push({key:x.key,id:b?.id,sourceHash:await sha(b?.system?.source??""),events:e?Array.from(e):null});}
const old=game.scenes.get("ImeIdHbYb6kZKAdt")?.regions.get("4faM8b9bJkKVYGjL")?.behaviors.get("uIUnGXarsob4WQub");if(await sha(old?.system?.source??"")!=="2424223932f3f85f200909df4e5b8cf17576cd2e74723394e3e52b2457fe77f7")fail.push("T1 existing notice changed");
const kernel=game.macros.get("FHQiFYx6OntZVo9d"),ledger=game.journal.get("xhlXv6CCH34HVga3"),state=ledger?.getFlag("world","dicebox")?.state??{};
if(await sha(kernel?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")fail.push("kernel drift");
if(state.revision!==0||Object.keys(state.notices??{}).length||expect.some(x=>state.items?.[x.key]?.recovered!==false))fail.push("ledger drift");
return{operation:OP,status:fail.length?"FAIL":"PASS",noWrite:true,failures:fail,baseline:{scenes:allScenes.length,regions,behaviors,ledgerRevision:state.revision,kernelHash:await sha(kernel?.command??"")},installed,noGameplayCanary:true};
