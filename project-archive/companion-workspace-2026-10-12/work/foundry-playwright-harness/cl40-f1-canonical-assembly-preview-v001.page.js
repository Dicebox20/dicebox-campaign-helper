// CL-40 F1 canonical Cicada Item authority PREVIEW v001; read-only.
const OP="central-lodge.cl40.f1.canonical-assembly.preview.v001";
const F1="La9krMOMBhAhDLi6",RID="cAPhThdExniaYnbx",BID="VPsFO5t8IhCzf5wn";
const PRE_HASH="db4261f29091505f039fd9db1e7dffaa97f193e9eefc803bb9396e08b2b4d7d3",GEOM="6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5";
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const s=game.scenes.get(F1),b=s?.regions.get(RID)?.behaviors.get(BID),src=b?.system?.source??"",fail=[],oldHash=await sha(src);
const anchors=["const inventory = [];","const missing = Object.entries(parts)"];
const start=src.indexOf(anchors[0]),end=src.indexOf(anchors[1],start);
if(oldHash!==PRE_HASH||start<0||end<=start||src.includes("canonicalStableId"))fail.push("F1 legacy source drift");
const newBlock=`const inventory = [];
for (const a of actors) {
  for (const item of a.items ?? []) {
    const flags = item.getFlag?.("world", "dicebox") ?? {};
    const stableId = flags.canonicalStableId ?? flags.stableId ?? null;
    inventory.push({actor:a, item, stableId});
  }
}
const findPart = key => inventory.find(x => x.stableId === "dbx:central-lodge:item:" + key);
const parts = {
  body: findPart("infernal-cicada-body"),
  wingI: findPart("cicada-wing-i"),
  wingII: findPart("cicada-wing-ii"),
  wingIII: findPart("cicada-wing-iii"),
  wingIV: findPart("cicada-wing-iv")
};
`;
const candidate=(start>=0&&end>start)?(src.slice(0,start)+newBlock+src.slice(end)).trimEnd():null;
if(candidate){try{new (Object.getPrototypeOf(async function(){}).constructor)("event",candidate)}catch(err){fail.push("F1 syntax: "+err)}}
const selected=["infernal-cicada-body","cicada-wing-i","cicada-wing-ii","cicada-wing-iii","cicada-wing-iv"],items=selected.map(key=>({key,matches:game.items.filter(i=>i.getFlag("world","dicebox")?.stableId==="dbx:central-lodge:item:"+key).map(i=>({id:i.id,name:i.name}))}));
for(const x of items)if(x.matches.length!==1)fail.push("Missing canonical "+x.key);
const geo=s?await sha(canon(Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id)))):null;
if(geo!==GEOM)fail.push("Geometry drift");
const flags=s?.getFlag("world","dicebox")?.f1,ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(flags?.cicadaInstalled!==false||flags?.innerWardResolved!==false||ledger.revision!==0)fail.push("Gameplay already active");
const fakeNames=selected.map(key=>({name:key,stableId:null})),validCopies=selected.map(key=>({name:"unknown",stableId:"dbx:central-lodge:item:"+key}));
const recognized=copies=>selected.every(key=>copies.some(item=>item.stableId==="dbx:central-lodge:item:"+key));
const mock={canonicalRecognized:recognized(validCopies),spoofedNamesRejected:!recognized(fakeNames),missingPartRejected:!recognized(validCopies.slice(0,4))};
if(!Object.values(mock).every(Boolean))fail.push("Mock selector contract failure");
return{operation:OP,status:fail.length?"BLOCKED":"PASS",noWrite:true,failures:fail,oldHash,newHash:candidate?await sha(candidate):null,oldLength:src.length,newLength:candidate?.length,geometryHash:geo,items,selectorMock:mock,behaviorId:BID,sceneFlags:flags,noWriteLimitation:"No player or Foundry gameplay invocation; candidate only.",proposedSource:candidate};
