const OP="central-lodge.cl41.f2.readonly-runtime-preview.v001",S="HWitOe1wSid7MZ1y",s=game.scenes.get(S);
const locks=[["8Zk4Ga0CFO0xbYVU","7wCbrpm6YPgmfGMI","a74d6c2dbd626d07e0fb97fc089ad94b7b5ba218fbf5a8ab9b02033ce5dae4ff"],["2f98fKSwA34QxIav","6LMqwMo5LcyCARzw","dbc3f10bd97a40a2955772c68bd86e5525f8a25cfabbd3f424ae18ccfa22e065"],["3pRBuusouxgRsjs7","2ePEI7One8xCfs34","79d417e439e49a303233cb2ec35c5cd5f4513250d9061e629b70316751595a0e"],["6mCOKYku9wgt58Ik","27VZWUxVJDhgr87E","8951cf45cb58f8b0a2527601f2c96668e7a2f43335c32dc8ed3cd43c417628e5"]];
const sha=async t=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(t??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const fail=[],behaviors=[];
const geo=s?await sha(JSON.stringify(norm(Array.from(s.regions).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null}}).sort((a,b)=>a.id.localeCompare(b.id))))):null;
if(geo!=="b2001545ca35276b6a34799945e55f03648e326bd119f2f741619d9e5f6e2eca")fail.push("F2 geometry drift");
const flags=s?.getFlag("world","dicebox")?.f2??{},st=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(flags.ritualActive!==true||flags.ritualStage!=="ACTIVE_RITUAL_BASELINE"||flags.resolution!=="UNRESOLVED"||flags.arrivalStage!==0)fail.push("F2 ritual state drift");
if(st.revision!==0||s?.tokens.size!==0)fail.push("Gameplay canary or placed tokens");
for(const [rid,bid,h] of locks){const b=s?.regions.get(rid)?.behaviors.get(bid),src=b?.system?.source??"",actual=await sha(src);if(actual!==h||b?.disabled!==false)fail.push("Behavior source drift "+bid);const srcLooksObserver=src.includes("ChatMessage.create")||src.includes("createScrollingText");if(!srcLooksObserver)fail.push("Observer semantics missing "+bid);behaviors.push({id:bid,name:b?.name,sourceHash:actual,behaviorEnabled:b?.disabled===false,observer:srcLooksObserver});}
const t=Array.from(s?.regions??[]).reduce((a,r)=>a+r.behaviors.size,0);
if(s?.regions.size!==8||t!==4)fail.push("F2 roster drift");
const transitionSource=game.scenes.get("La9krMOMBhAhDLi6")?.regions.get("iuoEHBXWtXgzYmMh")?.behaviors.get("FElgIMZFVX5GleSy")?.system?.source??"";
if(!transitionSource.includes("Scene.HWitOe1wSid7MZ1y.Region.pplHOCmUZOqFymOy"))fail.push("F1->F2 destination drift");
return{operation:OP,status:fail.length?"BLOCKED":"PASS_EXISTING_BEHAVIORS_NO_WRITE",noWrite:true,failures:fail,f2SceneId:S,f2Regions:s?.regions.size,f2Behaviors:t,geometryHash:geo,flags,behaviorSources:behaviors,readyFor:"CL-41 plan further ritual escalation and optional safe behavior additions; preserve no conventional puzzle lock.",noGameplayCanary:true};