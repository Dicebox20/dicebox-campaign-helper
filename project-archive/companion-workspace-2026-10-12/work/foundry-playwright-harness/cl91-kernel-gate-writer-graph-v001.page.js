// CL-90 authoritative DiceBox kernel request-shape static audit. Read only; never eval scripts.
const ID="central-lodge.cl90.kernel-request-contract-audit.v001",
ids=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"],
ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},issues=[],entries=[],counts={scenes:ids.length,regions:0,behaviors:0,staticRequests:0,dynamicRequests:0};
const scanSource=(src)=>{
 const rx=/speaker\s*:\s*\{\s*dicebox\s*:\s*\{/g,objs=[],errors=[];
 let m;while((m=rx.exec(src))){const start=m.index+m[0].length-1;let depth=0,quote=false,escape=false,end=-1;for(let i=start;i<src.length;i++){const ch=src[i];if(quote){if(escape)escape=false;else if(ch==="\\")escape=true;else if(ch==='"')quote=false;}else{if(ch==='"')quote=true;else if(ch==="{")depth++;else if(ch==="}"){depth--;if(depth===0){end=i+1;break;}}}}if(end<0){errors.push("unclosed request JSON");continue;}const sub=src.slice(start,end);try{objs.push(JSON.parse(sub))}catch(e){errors.push("dynamic/unparseable request:"+String(e).slice(0,120))}rx.lastIndex=end;
 }return{objs,errors};
};
for(const id of ids){const s=game.scenes.get(id);if(!s){issues.push({kind:"SCENE_MISSING",id});continue;}counts.regions+=s.regions.size;
 for(const r of s.regions){for(const b of r.behaviors){counts.behaviors++;const src=String(b.system?.source??""),scan=scanSource(src);
 counts.staticRequests+=scan.objs.length;counts.dynamicRequests+=scan.errors.length;
 const basics={scene:s.name,region:r.name,behavior:b.name,id:b.id};
 for(const msg of scan.errors)entries.push({...basics,kind:"DYNAMIC_CODE",reason:msg});
 for(const x of scan.objs){
  const p=x.statePath??null,reqs=x.requirements??[],it=x.itemKey??null;
  const missingPath= p&&foundry.utils.getProperty(ledger,p)===undefined;
  const reqUnknown=reqs.filter(q=>q?.type==="state"&&foundry.utils.getProperty(ledger,q.path)===undefined).map(q=>q.path);
  const itemUnknown=it&&ledger.items?.[it]===undefined;
  const action=x.action??"none";
  const rec={...basics,action,statePath:p,itemKey:it,requirements:reqs,missingPath:Boolean(missingPath),unknownRequirements:reqUnknown,itemUnknown:Boolean(itemUnknown),requestContract:x.contract};
  entries.push(rec);
  if(missingPath||reqUnknown.length||itemUnknown)issues.push({...rec,kind:"CANONICAL_CONTRACT_MISMATCH"});
 }
 }}
}
const byAction={};for(const e of entries)if(e.action)byAction[e.action]=(byAction[e.action]??0)+1;
const writers=new Map();for(const e of entries){if(!e.statePath||!["observe","socket","gate","pickup"].includes(e.action))continue;const a=writers.get(e.statePath)??[];a.push({scene:e.scene,behavior:e.behavior,id:e.id,action:e.action});writers.set(e.statePath,a)}
const gates=entries.filter(e=>e.action==="gate").map(e=>({
 scene:e.scene,behavior:e.behavior,statePath:e.statePath,requirements:e.requirements.map(r=>({type:r.type??"state",path:r.path??null,itemKey:r.itemKey??null,equals:r.value??r.equals??true,producers:writers.get(r.path)??[],current:r.path?foundry.utils.getProperty(ledger,r.path):r.itemKey?ledger.items?.[r.itemKey]:null}))
}));
const gap=gates.flatMap(g=>g.requirements.filter(x=>x.type==="state"&&x.current===false&&x.producers.length===0).map(x=>({gate:g.behavior,missingWriter:x.path})));
return{operation:"central-lodge.cl91.kernel-gate-writer-graph.v001",noWrite:true,counts:{scenes:counts.scenes,regions:counts.regions,behaviors:counts.behaviors,staticRequests:counts.staticRequests,dynamicRequests:counts.dynamicRequests,knownProducerPaths:writers.size},staticMismatches:issues,gates,unproducedFalseRequirements:gap,explicitEmptyClockWriter:!(writers.get("puzzles.m1.clockSettingResolved")?.length),explicitEmptyT3BranchWriter:!(writers.get("puzzles.n3.t3BranchUnlocked")?.length),limitations:["No dynamic source object parsing for three GM-adjudicated pickups.","A missing direct producer may be intentionally deferred to another workflow or Scene flag."]};
