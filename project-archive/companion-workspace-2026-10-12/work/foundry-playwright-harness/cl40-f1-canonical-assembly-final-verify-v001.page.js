const OP="central-lodge.cl40.f1.canonical-assembly.final-verify.v001";
const s=game.scenes.get("La9krMOMBhAhDLi6"),r=s?.regions.get("cAPhThdExniaYnbx"),b=r?.behaviors.get("VPsFO5t8IhCzf5wn"),errors=[];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),x=>x.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const geo=await sha(canon(Array.from(s?.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id))));
const st=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{},ss=s.getFlag("world","dicebox")?.f1??{},src=b?.system?.source??"";
if(await sha(src)!=="830030f02434d2654346d0cfde4a2e73bdb600a3b98412ca1e433b46fc99f2b7")errors.push("Assembly source hash drift");
for(const [rid,bid,hash] of [["bpjGc2NlZB8zCxmX","jmTli5qX0dmPexKp","978e0a0b7821e349e112f9587249b3c35a0735aa5ff6564be2bd01444c58271d"],["rJk5e9pqhY0KbsYV","J532Dz50Qua3tLky","058fe8a634791b2dcf0f016c6318c18bcea955f2471b5605da6eb674ac6ff184"],["iuoEHBXWtXgzYmMh","FElgIMZFVX5GleSy","da494b469d921661803360ca1d0f1699ad5f8950b3ae084d58efd124d01bac25"]])if(await sha(s.regions.get(rid)?.behaviors.get(bid)?.system?.source??"")!==hash)errors.push("Foreign F1 behavior drift "+bid);
if(geo!=="6aa46295e7c4ba743246763116772ab67051de2ad7e9444012413922ffe714b5"||s.regions.size!==6||Array.from(s.regions).reduce((n,r)=>n+r.behaviors.size,0)!==4)errors.push("F1 geometry/roster drift");
if(!src.includes('flags.canonicalStableId ?? flags.stableId')||src.includes("const findPart = test => inventory.find(x => test(x.name))"))errors.push("Canonical selector missing");
const expected=["infernal-cicada-body","cicada-wing-i","cicada-wing-ii","cicada-wing-iii","cicada-wing-iv"];for(const key of expected){if(!src.includes('findPart("'+key+'")'))errors.push("Missing key "+key);}
if(st.revision!==0||ss.cicadaInstalled!==false||ss.innerWardResolved!==false)errors.push("Gameplay state changed");
return{operation:OP,status:errors.length?"FAIL":"PASS",noWrite:true,errors,assemblyBehaviorId:b?.id,sourceHash:await sha(src),f1GeometryHash:geo,f1RegionCount:s.regions.size,f1BehaviorCount:4,ledgerRevision:st.revision,transitionUnchanged:true,noGameplayCanary:true};
