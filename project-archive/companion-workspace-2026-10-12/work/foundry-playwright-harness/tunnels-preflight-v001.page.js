// CL-33 T1/T2/T3 READ-ONLY intake v001: NO create/update/delete/macro execution.
const ID="central-lodge-cl33-tunnels-preflight-v001";
const targets=[["T1","ImeIdHbYb6kZKAdt"],["T2","ez9MSQ8QIO4cW6zo"],["T3","aIKQmFiuXWipEdyb"]];
const IDs=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const dbx=v=>v?.getFlag?.("world","dicebox")??{},sid=v=>dbx(v)?.stableId??null;
const scenes=[];let regionTotal=0,behaviorTotal=0,failures=[];
for(const sceneId of IDs){const s=game.scenes.get(sceneId);if(!s){failures.push("Missing canonical Scene "+sceneId);continue;}const rr=Array.from(s.regions??[]);regionTotal+=rr.length;behaviorTotal+=rr.reduce((n,r)=>n+r.behaviors.size,0);}
for(const [key,id] of targets){
 const s=game.scenes.get(id);if(!s){failures.push("Missing "+key);continue;}
 const regs=[];
 for(const r of s.regions){
  const meta=dbx(r),bs=[];
  for(const b of r.behaviors){
   const bmeta=dbx(b);
   bs.push({id:b.id,name:b.name,type:b.type,disabled:b.disabled,stableId:sid(b),eventList:b.system?.events??[],sourceHash:await sha(b.system?.source??""),sourcePreview:(b.system?.source??"").slice(0,220),meta:bmeta});
  }
  regs.push({id:r.id,name:r.name,stableId:sid(r),regionClass:meta?.regionClass??meta?.class??null,metadata:meta,shapeCount:r.shapes?.length??r.toObject().shapes?.length??0,behaviors:bs});
 }
 const geo=Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id));
 scenes.push({key,id,name:s.name,sceneStableId:sid(s),regions:s.regions.size,behaviors:regs.reduce((a,r)=>a+r.behaviors.length,0),geometryHash:await sha(JSON.stringify(norm(geo))),sceneFlags:dbx(s),ambientLights:s.lights?.size??null,drawings:s.drawings?.size??null,tiles:s.tiles?.size??null,regionsDetail:regs});
}
const ledger=game.journal.get("xhlXv6CCH34HVga3"),state=foundry.utils.deepClone(dbx(ledger)?.state??{});
const keys=["cicada-wing-iii","railway-switch-wheel","recent-route-fragment"];const items=keys.map(key=>({key,items:game.items.filter(i=>sid(i)==="dbx:central-lodge:item:"+key).map(i=>({id:i.id,name:i.name,stableId:sid(i),flags:dbx(i)}))}));
const kernel=game.macros.get("FHQiFYx6OntZVo9d");const kernelHash=await sha(kernel?.command??"");
if(regionTotal!==202||behaviorTotal!==112)failures.push("Global baseline drift");
if(kernelHash!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")failures.push("Kernel drift");
if(state.revision!==0||Object.keys(state.notices??{}).length)failures.push("Ledger drift");
return{operation:ID,status:failures.length?"BLOCKED":"PASS",noWrite:true,failures,baseline:{scenes:IDs.length,regions:regionTotal,behaviors:behaviorTotal,kernelHash,ledgerRevision:state.revision},scenes,items,tunnelState:{t1:state?.puzzles?.t1,t2:state?.puzzles?.t2,t3:state?.puzzles?.t3,n3:state?.puzzles?.n3,railway:state?.railway,items:state?.items},nextGate:"CL-33 evidence and authority reconciliation"};