const VERIFY_ID="central-lodge-cl16-m3-safe-final-verify-v001";
const SCENE_ID="LXTA8mx1rJ2L6e2J";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="8473a9fe2a2298839cd87f4e1ea5ba7a6f260562fe76421c711772901febf77a";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[
 ["bell-board-notice","we3V3jbMDvVDaO4U","5VfWgedqEWFVvczI","dbx:central-lodge:m3:behavior:bell-board-notice","3391a7e83728bc0c71dbca6ab6b2aeffa721895f978f5d11123dd077bf29e909","notice",null],
 ["servant-bell-pull-install","E7xtQDQRNA4AtY1i","zhrDou7CR8b4v7jq","dbx:central-lodge:m3:behavior:servant-bell-pull-install","c380953514c5b018c8dc7b14ff6f347c273c6d800b5c47e5e29bc57c0df1bdf4","socket",null],
 ["recent-use-notice","bgvESHTFewT9ZV8x","wkqZPDzpjMBfeqHC","dbx:central-lodge:m3:behavior:recent-use-notice","fab86fa328f38f63327609ffb5b47fe1d844870dbb3c4ca62d984f26b6bee435","notice",null],
 ["bell-crest-recovery","IkmwmsbHadINctLc","MwkyV1WZolF2GnzE","dbx:central-lodge:m3:behavior:bell-crest-recovery","8e037130223044b6f418b3134283545b37bfdf69c526313b25a846758bf1dd45","pickup","puzzles.m3.bellBoardResolved"]
];
const deferredIds=["T1KuiXb5o8mjTS2w","wd7S4Exyz2WQYLUY","BsM7Jxecq3ayjYKn","OQupzv9slrPmj1GM","THTJHTfaBGTGqaiZ","1uOskLbiMaYJkFmZ"];
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const stableIdOf=d=>dbx(d)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const failures=[],warnings=[];
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
if(!scene)failures.push("M3 missing.");if(!ledger)failures.push("Ledger missing.");if(!kernel)failures.push("Kernel missing.");
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
if(regions!==202)failures.push(`Regions ${regions}; expected 202.`);if(behaviors!==55)failures.push(`Behaviors ${behaviors}; expected 55.`);
const m3Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;if(scene?.regions?.size!==10||m3Count!==4)failures.push(`M3 baseline ${scene?.regions?.size}/${m3Count}; expected 10/4.`);
const kernelHash=kernel?await sha256(kernel.command??""):null;if(kernelHash!==EXPECTED_KERNEL_HASH)failures.push("Kernel hash drift.");
const geometryHash=scene?await sha256(canonical(geom(scene))):null;if(geometryHash!==EXPECTED_GEOMETRY_HASH)failures.push("M3 geometry drift.");
const rows=[];
for(const [key,regionId,behaviorId,stableId,hash,action,requiredStatePath] of expected){
 const r=scene?.regions.get(regionId),b=r?.behaviors.get(behaviorId);
 if(!r||!b){failures.push(key+": binding missing.");continue;}
 const f=dbx(b),h=await sha256(b.system?.source??"");
 if(stableIdOf(b)!==stableId)failures.push(key+": stableId mismatch.");
 if(h!==hash)failures.push(key+": source hash mismatch.");
 if(f.regionStableId!==stableIdOf(r))failures.push(key+": regionStableId mismatch.");
 if(f.behaviorSpec?.action!==action)failures.push(key+": action mismatch.");
 if(requiredStatePath&&f.behaviorSpec?.requiredStatePath!==requiredStatePath)failures.push(key+": requiredStatePath mismatch.");
 if(requiredStatePath&&!String(b.system?.source??"").includes(requiredStatePath))failures.push(key+": wrapper does not enforce requiredStatePath.");
 rows.push({key,id:b.id,stableId:stableIdOf(b),action:f.behaviorSpec?.action??null,sourceType:f.behaviorSpec?.sourceType??null,requiredStatePath:f.behaviorSpec?.requiredStatePath??null,sourceHash:h,regionId:r.id,regionStableId:f.regionStableId??null,status:"PASS"});
}
const deferred=deferredIds.map(id=>{const r=scene?.regions.get(id);if(!r){failures.push("Deferred Region missing "+id);return{id,name:null,behaviors:null,status:"FAIL"};}if(r.behaviors.size!==0)failures.push(r.name+" unexpectedly has "+r.behaviors.size+" behavior(s).");return{id,name:r.name,behaviors:r.behaviors.size,status:r.behaviors.size===0?"PASS":"FAIL"};});
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});
if(Number(state?.revision)!==0)failures.push("Ledger revision drift.");
if(Object.keys(state?.notices??{}).length!==0)failures.push("Ledger notices not empty.");
const m3State=clone(foundry.utils.getProperty(state,"puzzles.m3")??{});
for(const key of ["bellBoardNoticeResolved","servantBellPullInstalled","bellBoardResolved","serviceRouteUnlocked","recentUseObserved"]){if(m3State[key]!==false)failures.push(`puzzles.m3.${key} is ${m3State[key]}; expected false before gameplay.`);}
for(const itemKey of ["servant-bell-pull","bell-crest"]){const m=game.items.filter(i=>stableIdOf(i)===`dbx:central-lodge:item:${itemKey}`);if(m.length!==1)failures.push(itemKey+": canonical Item count "+m.length);}
return{operation:"central-lodge.cl16.m3.safe-final-verify",verifyId:VERIFY_ID,status:failures.length?"FAIL":"PASS",noWrite:true,failures,warnings,
 baseline:{scenes:LODGE_SCENES.length,regions,behaviors,m3Regions:scene?.regions?.size??null,m3Behaviors:m3Count},
 kernelHash,geometryHash,behaviors:rows,deferred,ledger:{revision:state?.revision??null,notices:state?.notices??null,m3:m3State},
 phaseDisposition:failures.length?"CL-16 VERIFY FAILED":"CL-16 PARTIAL / BELL BOARD OPERATION & SERVICE ROUTE DEFERRED",
 nextPhase:failures.length?"STOP":"CL-17 — U1 Family & Guest Rooms"};