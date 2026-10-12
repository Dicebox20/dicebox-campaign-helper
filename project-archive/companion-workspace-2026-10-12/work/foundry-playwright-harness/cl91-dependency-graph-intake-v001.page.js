// CL91 snapshot dependency graph; no document mutations.
const ID="central-lodge.cl91.dependency-graph-intake-v001";
const l=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},p=l.puzzles??{},keys=Object.keys(p);
const puzzles=Object.fromEntries(keys.map(k=>[k,JSON.parse(JSON.stringify(p[k]))]));
const itemLedger=Object.fromEntries(Object.entries(l.items??{}).map(([k,v])=>[k,{recovered:v?.recovered,installed:v?.installed,stableId:v?.stableId,scene:v?.scene}]));
const kernel=game.macros.get("FHQiFYx6OntZVo9d")?.command??"";
const actions=[...kernel.matchAll(/case\s*["']([^"']+)["']/g)].map(m=>m[1]);
const list=["cl90-preaudit-readonly-v001.page.js","cl50-t3-f1-final-verify-v001.page.js"];
const raw=JSON.stringify(puzzles),summary=Object.entries(puzzles).map(([k,v])=>({key:k,keys:Object.keys(v??{}),truthy:Object.entries(v??{}).filter(([kk,vv])=>vv===true).map(([kk])=>kk)}));
return{operation:ID,noWrite:true,revision:l.revision,topLevelKeys:Object.keys(l),puzzleSummaries:summary,puzzles,itemLedger,actions,kernelLength:kernel.length};