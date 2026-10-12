const fs=require("node:fs"); let s=fs.readFileSync("cl90-kernel-request-contract-audit-v001.page.js","utf8");
const a='const rec={...basics,action,statePath:p,itemKey:it,missingPath:',b='const rec={...basics,action,statePath:p,itemKey:it,requirements:reqs,missingPath:';
if(!s.includes(a))throw Error("Shape drift");s=s.replace(a,b);
const end=s.indexOf("\nreturn{operation:ID,status:");
if(end<0)throw Error("Final return drift");
s=s.slice(0,end)+`
const writers=new Map();for(const e of entries){if(!e.statePath||!["observe","socket","gate","pickup"].includes(e.action))continue;const a=writers.get(e.statePath)??[];a.push({scene:e.scene,behavior:e.behavior,id:e.id,action:e.action});writers.set(e.statePath,a)}
const gates=entries.filter(e=>e.action==="gate").map(e=>({
 scene:e.scene,behavior:e.behavior,statePath:e.statePath,requirements:e.requirements.map(r=>({type:r.type??"state",path:r.path??null,itemKey:r.itemKey??null,equals:r.value??r.equals??true,producers:writers.get(r.path)??[],current:r.path?foundry.utils.getProperty(ledger,r.path):r.itemKey?ledger.items?.[r.itemKey]:null}))
}));
const gap=gates.flatMap(g=>g.requirements.filter(x=>x.type==="state"&&x.current===false&&x.producers.length===0).map(x=>({gate:g.behavior,missingWriter:x.path})));
return{operation:"central-lodge.cl91.kernel-gate-writer-graph.v001",noWrite:true,counts:{scenes:counts.scenes,regions:counts.regions,behaviors:counts.behaviors,staticRequests:counts.staticRequests,dynamicRequests:counts.dynamicRequests,knownProducerPaths:writers.size},staticMismatches:issues,gates,unproducedFalseRequirements:gap,explicitEmptyClockWriter:!(writers.get("puzzles.m1.clockSettingResolved")?.length),explicitEmptyT3BranchWriter:!(writers.get("puzzles.n3.t3BranchUnlocked")?.length),limitations:["No dynamic source object parsing for three GM-adjudicated pickups.","A missing direct producer may be intentionally deferred to another workflow or Scene flag."]};
`;
fs.writeFileSync("cl91-kernel-gate-writer-graph-v001.page.js",s);
console.log("CL91 gate-writer source generated");
