const PREVIEW_ID="central-lodge-cl21-e1-preview-v001";
const SCENE_ID="Zq8iXByDVhHRbA7w",LEDGER_ID="xhlXv6CCH34HVga3",KERNEL_ID="FHQiFYx6OntZVo9d";
const REGION_ID="vrJhFjH9RQyKoaXU",TILE_ID="VS2E5k2zKpk1U6ee";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="0b39046a2eb2bae365417a98b22f39611bcbfeb71c24f8a78864adf0dec9ed2e";
const RESTORED="worlds/the-lost-mine-of-phandalin/assets/central-lodge/e1/hound-statue-restored-eye.webp";
const MISSING="worlds/the-lost-mine-of-phandalin/assets/central-lodge/e1/hound-statue-missing-eye.webp";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const clone=v=>foundry.utils.deepClone(v),dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}},sid=d=>dbx(d)?.stableId??null;
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=s=>Array.from(s.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatch=req=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) return;',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});'
].join("\n");
const socketReq={contract:"dicebox-region-behavior/v1",action:"socket",trigger:"TOKEN_ENTER",itemKey:"black-garnet-eye",statePath:"puzzles.e1.blackGarnetEyeInstalled",consume:false,set:[{path:"puzzles.e1.houndResolved",value:true},{path:"puzzles.e1.estatePlanObserved",value:true}],missingMessage:"<p>The hound statue has one precisely cut empty eye socket. Whatever belongs there is still missing.</p>",successMessage:"<p>The <strong>Black Garnet Eye</strong> seats into the hound's empty socket. A concealed seam releases, exposing a hidden fragment of the old estate plan.</p>"};
const socketSource=[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) return;',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'const result = await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(socketReq)+'}});',
'if (!["PASS","ALREADY_INSTALLED"].includes(result?.status)) return result;',
'const gms = Array.from(game.users ?? []).filter(u => u.active && u.isGM).sort((a,b)=>a.id.localeCompare(b.id));',
'if (gms[0]?.id !== game.user?.id) return result;',
'const l = game.journal.get("xhlXv6CCH34HVga3");',
'const s = l?.getFlag?.("world","dicebox")?.state ?? {};',
'if (foundry.utils.getProperty(s,"puzzles.e1.houndResolved") !== true) return result;',
'const tile = game.scenes.get("Zq8iXByDVhHRbA7w")?.tiles.get("VS2E5k2zKpk1U6ee");',
'if (!tile) return result;',
'const restored = tile.flags?.["dicebox-campaign-helper"]?.restoredTexture ?? "worlds/the-lost-mine-of-phandalin/assets/central-lodge/e1/hound-statue-restored-eye.webp";',
'const updates = {};',
'if (tile.texture?.src !== restored) updates["texture.src"] = restored;',
'if (tile.flags?.["dicebox-campaign-helper"]?.houndEyeState !== "restored") updates["flags.dicebox-campaign-helper.houndEyeState"] = "restored";',
'if (Object.keys(updates).length) await tile.update(updates);',
'return result;'
].join("\n");
const specs=[
 {key:"hound-notice",stableId:"dbx:central-lodge:e1:behavior:hound-notice",action:"notice",source:dispatch({contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"e1.hound",dc:6,stage2Skill:"Perception",successMessage:"<p>One of the stone hound's eyes is a dark inset. The other socket is precisely cut and empty rather than simply broken away.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate inspection reveals the hound's deliberately fitted empty eye socket."})},
 {key:"recent-use-observation",stableId:"dbx:central-lodge:e1:behavior:recent-use-observation",action:"observe",source:dispatch({contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"e1.recent-use",oncePerActor:true,statePath:"puzzles.e1.recentUseObserved",value:true,message:"<p>Near the hound pedestal, fresh scuffing and displaced grime cut across the older neglect. Someone has been near this mechanism more recently than the ruined grounds suggest.</p>"})},
 {key:"black-garnet-eye-install",stableId:"dbx:central-lodge:e1:behavior:black-garnet-eye-install",action:"socket",source:socketSource}
];
const failures=[],scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID),region=game.scenes.get(SCENE_ID)?.regions.get(REGION_ID),tile=game.scenes.get(SCENE_ID)?.tiles.get(TILE_ID);
let regions=0,behaviors=0;for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
const e1Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+r.behaviors.size,0):null,kernelHash=await sha(kernel?.command??""),geometryHash=scene?await sha(canon(geom(scene))):null;
if(regions!==202||behaviors!==69||scene?.regions?.size!==6||e1Count!==0)failures.push(`Baseline mismatch ${regions}/${behaviors}, E1 ${scene?.regions?.size}/${e1Count}`);
if(kernelHash!==EXPECTED_KERNEL_HASH||geometryHash!==EXPECTED_GEOMETRY_HASH)failures.push("Hash drift.");
if(!region||region.behaviors.size!==0||sid(region)!=="dbx:central-lodge:e1:region:e1-hound-notice")failures.push("Hound Region drift.");
if(!tile||tile.texture?.src!==MISSING||tile.flags?.["dicebox-campaign-helper"]?.houndEyeState!=="missing"||tile.flags?.["dicebox-campaign-helper"]?.restoredTexture!==RESTORED)failures.push("Hound Tile baseline drift.");
for(const id of ["QS7OpvIilyyDpmLc","w7DHAoAVyAi6gwKw","R0aN9IzIMhF2o7uB","OgRDOqo0w50kNDR2","cTPCmA5xzXS0ETOk"]){const r=scene?.regions.get(id);if(!r||r.behaviors.size)failures.push("Transition drift "+id);}
if(game.items.filter(i=>sid(i)==="dbx:central-lodge:item:black-garnet-eye").length!==1)failures.push("Black Garnet Eye registry drift.");
const all=LODGE_SCENES.flatMap(id=>Array.from(game.scenes.get(id)?.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));for(const spec of specs)if(all.some(b=>sid(b)===spec.stableId))failures.push(spec.key+": collision.");
const state=clone(ledger?.getFlag("world","dicebox")?.state??{}),e1=foundry.utils.getProperty(state,"puzzles.e1")??{};
if(Number(state?.revision)!==0||Object.keys(state?.notices??{}).length)failures.push("Ledger baseline drift.");
for(const k of ["houndNoticeResolved","blackGarnetEyeInstalled","houndResolved","estatePlanObserved","recentUseObserved"])if(e1[k]!==false)failures.push("E1 state drift "+k);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;const rows=[];for(const spec of specs){let syntax="PASS";try{new AsyncFunction("event",spec.source)}catch(e){syntax="FAIL";failures.push(spec.key+": syntax "+e.message)}rows.push({key:spec.key,regionId:REGION_ID,stableId:spec.stableId,action:spec.action,sourceHash:await sha(spec.source),syntax});}
return{operation:"central-lodge.cl21.e1.preview",previewId:PREVIEW_ID,status:failures.length?"BLOCKED":"PASS",noWrite:true,failures,baseline:{scenes:21,regions,behaviors,e1Regions:scene?.regions?.size??null,e1Behaviors:e1Count,kernelHash,geometryHash,tileTexture:tile?.texture?.src??null,tileState:tile?.flags?.["dicebox-campaign-helper"]?.houndEyeState??null,ledgerRevision:state?.revision??null},plannedBehaviors:rows,expectedAfterApply:{regions:202,behaviors:72,e1Regions:6,e1Behaviors:3,transitionBehaviors:0,tileStillMissingUntilGameplay:true},nextGate:failures.length?"STOP":"CL-21 E1 APPLY v001"};