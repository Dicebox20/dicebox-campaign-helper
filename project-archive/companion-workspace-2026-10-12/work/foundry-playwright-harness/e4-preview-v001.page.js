const PREVIEW_ID="central-lodge-cl20-e4-preview-v001";
const SCENE_ID="DLcheEi6e5OHOYmU", LEDGER_ID="xhlXv6CCH34HVga3", KERNEL_ID="FHQiFYx6OntZVo9d";
const WALL_ID="kyoCHP9xmMSxCIwi";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="2c3a3508a9f8b4ed842c7df4113bba4a81b3893401ed00cc43d0a435812e73a5";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const R={falseNotice:"wzANpkb9bbFlB8z9",childNotice:"BjAgwMeaS9UUi7er",door:"ppLE2BNr2T42PC5n",signet:"Z9AXol3CV5PhrCVm",eye:"I5EVCuhR8GLs3u1B",child:"LcSdZqeU33Bc7RH8",cicada:"Pqi9XGwL9kku1Eri",story:"eRjDUWAIS206MyZV",seal:"MadPtMvvYh3WRYHE",light:"CSJtnWMkBw8HZY4o",transition:"AYKGbprBZQrcBlgV"};
const clone=v=>foundry.utils.deepClone(v);
const dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}};
const sid=d=>dbx(d)?.stableId??null;
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v;
const canon=v=>JSON.stringify(norm(v));
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=s=>Array.from(s.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const dispatch=req=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) return;',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'return await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});'
].join("\n");
const gatedPickup=(req,path)=>[
'const l = game.journal.get("xhlXv6CCH34HVga3");',
'const s = l?.getFlag?.("world","dicebox")?.state ?? {};',
'if (foundry.utils.getProperty(s,'+JSON.stringify(path)+') !== true) return;',
...dispatch(req).split("\n")
].join("\n");
const gateDoor=req=>[
'const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");',
'if (!k) return;',
'const t = event?.data?.token ?? event?.token ?? null;',
'const a = t?.actor ?? null;',
'const result = await k.execute({actor:a,token:t,event,speaker:{dicebox:'+JSON.stringify(req)+'}});',
'if (!["PASS","ALREADY_RESOLVED"].includes(result?.status)) return result;',
'const gms = Array.from(game.users ?? []).filter(u => u.active && u.isGM).sort((a,b)=>a.id.localeCompare(b.id));',
'if (gms[0]?.id !== game.user?.id) return result;',
'const l = game.journal.get("xhlXv6CCH34HVga3");',
'const s = l?.getFlag?.("world","dicebox")?.state ?? {};',
'if (foundry.utils.getProperty(s,"puzzles.e4.mausoleumResolved") !== true) return result;',
'const w = game.scenes.get("DLcheEi6e5OHOYmU")?.walls.get("kyoCHP9xmMSxCIwi");',
'if (w && w.ds !== CONST.WALL_DOOR_STATES.OPEN) await w.update({ds:CONST.WALL_DOOR_STATES.OPEN});',
'return result;'
].join("\n");
const gateReq={contract:"dicebox-region-behavior/v1",action:"gate",trigger:"TOKEN_ENTER",statePath:"puzzles.e4.mausoleumResolved",
 requirements:["stag-crest","rose-crest","bell-crest","crown-crest"].map(itemKey=>({type:"itemRecovered",itemKey})),
 set:["stag","rose","bell","crown"].map(k=>({path:`puzzles.e4.crests.${k}`,value:true})),
 incompleteMessage:"<p>The mausoleum door bears four empty crest recesses. The mechanism will not release until the complete family set has been recovered.</p>",
 successMessage:"<p>The Stag, Rose, Bell, and Crown crests answer the mausoleum lock. Stone shifts behind the fittings and the crypt door releases.</p>"};
const specs=[
 {key:"false-burial-notice",regionId:R.falseNotice,stableId:"dbx:central-lodge:e4:behavior:false-burial-notice",action:"notice",source:dispatch({contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"e4.false-burial",dc:6,stage2Skill:"Investigation",successMessage:"<p>One burial arrangement is wrong: marker, grave, and surviving family record do not agree. The inconsistency is specific enough to warrant deliberate examination.</p>",followUp:"Suggested follow-up: Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate examination of the burial contradiction remains possible."})},
 {key:"child-burial-notice",regionId:R.childNotice,stableId:"dbx:central-lodge:e4:behavior:child-burial-notice",action:"notice",source:dispatch({contract:"dicebox-discovery/v1",action:"notice",trigger:"TOKEN_ENTER",noticeKey:"e4.child-burial",dc:6,stage2Skill:"Perception",successMessage:"<p>A small detail at the child burial stands apart from the weathering around it, drawing attention to something that can still be recovered by careful search.</p>",followUp:"Suggested follow-up: Perception or Investigation.",failure:"silent",oncePerCharacter:true,autoAwardItem:false,criticalClueFallback:"Deliberate search of the child-burial context remains possible."})},
 {key:"mausoleum-four-crest-gate",regionId:R.door,stableId:"dbx:central-lodge:e4:behavior:four-crest-mausoleum-gate",action:"gate",source:gateDoor(gateReq)},
 {key:"founders-signet-recovery",regionId:R.signet,stableId:"dbx:central-lodge:e4:behavior:founders-signet-recovery",action:"pickup",source:gatedPickup({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"founders-signet",statePath:"items.founders-signet.recovered",value:true,message:"<p>You recover the <strong>Founder’s Signet</strong> from the crypt.</p>",persistentPickup:true},"puzzles.e4.mausoleumResolved")},
 {key:"black-garnet-eye-recovery",regionId:R.eye,stableId:"dbx:central-lodge:e4:behavior:black-garnet-eye-recovery",action:"pickup",source:gatedPickup({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"black-garnet-eye",statePath:"items.black-garnet-eye.recovered",value:true,message:"<p>You recover the <strong>Black Garnet Eye</strong> from the deeper crypt cache.</p>",persistentPickup:true},"puzzles.e4.mausoleumResolved")},
 {key:"child-bracelet-recovery",regionId:R.child,stableId:"dbx:central-lodge:e4:behavior:child-bracelet-recovery",action:"pickup",source:dispatch({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"child-bracelet",statePath:"items.child-bracelet.recovered",value:true,message:"<p>You recover the <strong>Child Bracelet</strong> from the child-burial context.</p>",persistentPickup:true})},
 {key:"cicada-wing-ii-recovery",regionId:R.cicada,stableId:"dbx:central-lodge:e4:behavior:cicada-wing-ii-recovery",action:"pickup",source:gatedPickup({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"cicada-wing-ii",statePath:"items.cicada-wing-ii.recovered",value:true,message:"<p>You recover <strong>Infernal Cicada Wing II</strong> from the deeper crypt.</p>",persistentPickup:true},"puzzles.e4.mausoleumResolved")},
 {key:"false-burial-interpretation",regionId:R.story,stableId:"dbx:central-lodge:e4:behavior:false-burial-interpretation",action:"observe",source:dispatch({contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",observationKey:"e4.false-burial-interpretation",oncePerActor:true,statePath:"puzzles.e4.falseBurialInterpreted",value:true,message:"<p>Examining the grave, marker, and burial evidence together confirms the contradiction: at least one supposed interment is false or incomplete.</p>"})},
 {key:"covenant-seal-recovery",regionId:R.seal,stableId:"dbx:central-lodge:e4:behavior:covenant-seal-recovery",action:"pickup",source:gatedPickup({contract:"dicebox-region-behavior/v1",action:"pickup",trigger:"TOKEN_ENTER",itemKey:"asmodean-covenant-seal",statePath:"items.asmodean-covenant-seal.recovered",value:true,message:"<p>You recover the <strong>Asmodean Covenant Seal</strong> from the protected burial context.</p>",persistentPickup:true},"puzzles.e4.mausoleumResolved")}
];
const failures=[], scene=game.scenes.get(SCENE_ID), ledger=game.journal.get(LEDGER_ID), kernel=game.macros.get(KERNEL_ID);
let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
const e4Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+r.behaviors.size,0):null;
const kernelHash=await sha(kernel?.command??""), geometryHash=scene?await sha(canon(geom(scene))):null;
if(regions!==202||behaviors!==60||scene?.regions?.size!==11||e4Count!==0) failures.push(`Baseline mismatch ${regions}/${behaviors}, E4 ${scene?.regions?.size}/${e4Count}`);
if(kernelHash!==EXPECTED_KERNEL_HASH) failures.push("Kernel drift."); if(geometryHash!==EXPECTED_GEOMETRY_HASH) failures.push("Geometry drift.");
const wall=scene?.walls.get(WALL_ID); if(!wall||wall.door!==1||wall.ds!==0) failures.push("Crest door baseline drift.");
for(const spec of specs){const r=scene?.regions.get(spec.regionId);if(!r)failures.push(spec.key+": Region missing.");else if(r.behaviors.size)failures.push(spec.key+": Region not empty.");}
for(const id of [R.light,R.transition]){const r=scene?.regions.get(id);if(!r||r.behaviors.size)failures.push("Deferred Region drift "+id);}
const all=LODGE_SCENES.flatMap(id=>Array.from(game.scenes.get(id)?.regions??[])).flatMap(r=>Array.from(r.behaviors??[]));
for(const spec of specs)if(all.some(b=>sid(b)===spec.stableId))failures.push(spec.key+": stable-ID collision.");
for(const key of ["stag-crest","rose-crest","bell-crest","crown-crest","founders-signet","black-garnet-eye","child-bracelet","asmodean-covenant-seal","cicada-wing-ii"]){if(game.items.filter(i=>sid(i)===`dbx:central-lodge:item:${key}`).length!==1)failures.push("Item mismatch "+key);}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{}); if(Number(state?.revision)!==0||Object.keys(state?.notices??{}).length)failures.push("Ledger baseline drift.");
const e4=foundry.utils.getProperty(state,"puzzles.e4")??{};
for(const k of ["falseBurialNoticeResolved","childBurialNoticeResolved","mausoleumResolved","falseBurialInterpreted","childBurialInterpreted"])if(e4[k]!==false)failures.push("E4 state drift "+k);
for(const k of ["stag","rose","bell","crown"])if(e4.crests?.[k]!==false)failures.push("Crest state drift "+k);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const rows=[];for(const spec of specs){let syntax="PASS";try{new AsyncFunction("event",spec.source)}catch(e){syntax="FAIL";failures.push(spec.key+": syntax "+e.message)}rows.push({key:spec.key,regionId:spec.regionId,stableId:spec.stableId,action:spec.action,sourceHash:await sha(spec.source),syntax});}
return{operation:"central-lodge.cl20.e4.preview",previewId:PREVIEW_ID,status:failures.length?"BLOCKED":"PASS",noWrite:true,failures,baseline:{scenes:21,regions,behaviors,e4Regions:scene?.regions?.size??null,e4Behaviors:e4Count,kernelHash,geometryHash,doorState:wall?.ds??null,ledgerRevision:state?.revision??null},plannedBehaviors:rows,expectedAfterApply:{regions:202,behaviors:69,e4Regions:11,e4Behaviors:9,lightBehaviors:0,transitionBehaviors:0},nextGate:failures.length?"STOP":"CL-20 E4 APPLY v001"};