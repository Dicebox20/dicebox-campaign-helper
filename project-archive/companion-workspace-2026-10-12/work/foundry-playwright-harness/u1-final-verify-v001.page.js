const SCENE_ID="if9iWDRjSwI87EeX";
const LEDGER_ID="xhlXv6CCH34HVga3";
const KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="51c37b027918cb3623f5dc89966cd92e41efce44b28a2893e9a32ad8d04c2815";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[
["family-records-notice","fgo4icYioZu3ekbr","ZdgUuixSscsdZ8Ql","dbx:central-lodge:u1:behavior:family-records-notice","8d2bde8d3871c9689a19c80f948b8ea11b428609c7e984dc2664fa61c78f2553","notice"],
["guest-room-absence-notice","KEFEScgW7Yrureyv","OZvjOBwdkp5CAMjM","dbx:central-lodge:u1:behavior:guest-room-absence-notice","6d435d45853afcaadd815da66732baaa62ffd6c96a3267b4776208e147697153","notice"],
["house-proof-recovery","VxHb5vakdakd4s8t","8jArBYyNFWjNexMv","dbx:central-lodge:u1:behavior:house-proof-recovery","23862e0410c80b69cf1b802dbbe5eef6b73ab62b912977c93e19ecbdabb935f0","pickup"],
["crown-crest-recovery","W5HLOhbQGxd0QykN","iyIMKoCyaf9NMUih","dbx:central-lodge:u1:behavior:crown-crest-recovery","426ef4663c90c03686f8b5b2b84398ba2e9e143974dbcd03b35aeb15e56cc3c0","pickup"],
["family-records-observation","V1JRfiR56dgVGRa3","875pl2PyFUnEYO75","dbx:central-lodge:u1:behavior:family-records-interpretation","6ed84ac9a24b5fe4db0c513b819e3409fbaf0dff637c4502d878cdd7da51fae3","observe"]
];
const deferredIds=["6yT5660qN4dVJ4Fa","8Og9F4LZoOXXewI5","CN7RgLIuaVpgHFUI","LvQ6X54sZgtIvpQW","PsFcL2Leau8GV8zb"];
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const sid=d=>dbx(d)?.stableId??null;
const normalize=v=>Array.isArray(v)?v.map(normalize):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
const canonical=v=>JSON.stringify(normalize(v));
const sha256=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=scene=>Array.from(scene.regions??[]).map(r=>{const s=r.toObject();return{id:r.id,shapes:s.shapes??null,elevation:s.elevation??null,visibility:s.visibility??null,locked:s.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const failures=[],rows=[];
const scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);
let regions=0,behaviors=0;for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0);}
const u1Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+Array.from(r.behaviors??[]).length,0):null;
if(regions!==202||behaviors!==60||scene?.regions?.size!==10||u1Count!==5)failures.push(`Count mismatch: ${regions}/${behaviors}, U1 ${scene?.regions?.size}/${u1Count}.`);
const kernelHash=await sha256(kernel?.command??"");if(kernelHash!==EXPECTED_KERNEL_HASH)failures.push("Kernel drift.");
const geometryHash=scene?await sha256(canonical(geom(scene))):null;if(geometryHash!==EXPECTED_GEOMETRY_HASH)failures.push("Geometry drift.");
for(const [key,regionId,bid,stableId,hash,action] of expected){const r=scene?.regions.get(regionId),b=r?.behaviors.get(bid);if(!r||!b){failures.push(key+": missing binding.");continue;}const f=dbx(b),h=await sha256(b.system?.source??"");if(sid(b)!==stableId||h!==hash||f.regionStableId!==sid(r)||f.behaviorSpec?.action!==action)failures.push(key+": metadata/source mismatch.");rows.push({key,id:b.id,stableId:sid(b),action:f.behaviorSpec?.action??null,sourceHash:h,regionId:r.id,regionStableId:f.regionStableId??null,status:"PASS"});}
const deferred=deferredIds.map(id=>{const r=scene?.regions.get(id);if(!r){failures.push("Deferred Region missing "+id);return{id,name:null,behaviors:null,status:"FAIL"};}if(r.behaviors.size!==0)failures.push(r.name+" unexpectedly has behaviors.");return{id,name:r.name,behaviors:r.behaviors.size,status:r.behaviors.size===0?"PASS":"FAIL"};});
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});if(Number(state?.revision)!==0||Object.keys(state?.notices??{}).length!==0)failures.push("Ledger drift before gameplay.");
const u1=clone(foundry.utils.getProperty(state,"puzzles.u1")??{});for(const k of ["familyRecordsNoticeResolved","guestRoomAbsenceNoticeResolved","familyRecordsInterpreted"])if(u1[k]!==false)failures.push(`puzzles.u1.${k} drift.`);
return{operation:"central-lodge.cl17.u1.final-verify",status:failures.length?"FAIL":"PASS",noWrite:true,failures,baseline:{scenes:21,regions,behaviors,u1Regions:scene?.regions?.size??null,u1Behaviors:u1Count},kernelHash,geometryHash,behaviors:rows,deferred,ledger:{revision:state?.revision??null,notices:state?.notices??null,u1},phaseDisposition:failures.length?"CL-17 VERIFY FAILED":"CL-17 U1 GAMEPLAY INSTALLED / LIGHTING & TRANSITIONS DEFERRED",nextPhase:failures.length?"STOP":"CL-20 — E4 Family Graveyard & Crypt"};