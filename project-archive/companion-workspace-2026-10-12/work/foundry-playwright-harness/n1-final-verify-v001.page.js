const SCENE_ID="MAbLfBqG7qIVVuLN",LEDGER_ID="xhlXv6CCH34HVga3",KERNEL_ID="FHQiFYx6OntZVo9d";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814",EXPECTED_GEOMETRY_HASH="07db85982fb80f1447b320caeff0ff9089e8ff7b18b0f1fea3ab1ac2bba83ce6";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[
["ZF81UaNygOG9OXAw","g9OhfDhT1ooLMytV","dbx:central-lodge:n1:behavior:walkable-railway-notice","47ce22a0b101f0534b27824e36b813e8e17f5f328b535b7b3afb4581480ff4da","notice"],
["hV4iOL6KOPhBZwsJ","hVHd0u0oGGs9RuTg","dbx:central-lodge:n1:behavior:station-power-notice","0a6d897162daf74208f572dd3f75b8678ba80a7541b01e1051b197e3e12b5f97","notice"],
["ZE79ZOgMrGndy9UC","Wkt3tjGMeTcbAp8z","dbx:central-lodge:n1:behavior:house-proof-install","a67f33f0d63baf17d545c8579806dcc2714d541a088e618b3b4e720dfd74f492","socket"],
["ohCGqONUaUR3RRQ4","PrARTvhoOdP6Hw66","dbx:central-lodge:n1:behavior:garden-proof-install","9266f569f30695f01ff29475af18aaa3d34ce7abeb1a8d7ace4cd63a2bd8aae6","socket"],
["8ax8SHsJA66p2BWY","DCiJSu6Fhgk99YsG","dbx:central-lodge:n1:behavior:rail-proof-install","8647d425cfd18c28f15f08db80c2ddc28dc60d94e5d66e3059506df6574c6e57","socket"],
["kj5R2Ugu0Fx83SPT","KzJqBPzzR8nqyETR","dbx:central-lodge:n1:behavior:three-proof-station-power","89d09a622bdc97b00172b198fb28d99e6991591fc8dee7fcac072a02e58c15a5","gate"],
["NcQ41UotoRiFvHLE","rE05s2DYz9o8Mfk1","dbx:central-lodge:n1:behavior:estate-railway-interpretation","3edaf21909cdf6de77223017de91d81ba449b57d17d8cc8e713c1ffa7b03bf27","observe"]
];
const clone=v=>foundry.utils.deepClone(v),dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}},sid=d=>dbx(d)?.stableId??null;
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=s=>Array.from(s.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const failures=[],scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id),rs=Array.from(s?.regions??[]);if(!s){failures.push("Missing "+id);continue;}regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
const nc=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+r.behaviors.size,0):null;if(regions!==202||behaviors!==97||scene?.regions?.size!==11||nc!==7)failures.push("Count mismatch");
const kh=await sha(kernel?.command??""),gh=scene?await sha(canon(geom(scene))):null;if(kh!==EXPECTED_KERNEL_HASH||gh!==EXPECTED_GEOMETRY_HASH)failures.push("Hash drift");
const rows=[];for(const [rid,bid,stableId,hash,action] of expected){const r=scene?.regions.get(rid),b=r?.behaviors.get(bid);if(!r||!b){failures.push(stableId+": missing");continue;}const f=dbx(b),h=await sha(b.system?.source??"");if(sid(b)!==stableId||h!==hash||f.regionStableId!==sid(r)||f.behaviorSpec?.action!==action)failures.push(stableId+": mismatch");rows.push({id:bid,stableId,action,sourceHash:h,status:"PASS"});}
for(const id of ["h0rAVwjsaVkKLQBa","8TWHLmhVBx24YcZh","xsitdXO94BHJkYKX","Kymbmb5D0f5KEkL5"]){const r=scene?.regions.get(id);if(!r||r.behaviors.size)failures.push("Deferred drift "+id);}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{}),n1=clone(foundry.utils.getProperty(state,"puzzles.n1")??{});if(Number(state?.revision)!==0||Object.keys(state?.notices??{}).length)failures.push("Ledger drift");
for(const k of ["walkableRailwayNoticeResolved","stationPowerNoticeResolved","railwayPowered","estateRailwayInterpreted"])if(n1[k]!==false)failures.push("State drift "+k);
for(const k of ["house","garden","rail"])if(n1.proofs?.[k]!==false)failures.push("Proof drift "+k);
if("railCarActivated" in n1)failures.push("Invented railCarActivated appeared");
return{operation:"central-lodge.cl30.n1.final-verify",status:failures.length?"FAIL":"PASS",noWrite:true,failures,baseline:{scenes:21,regions,behaviors,n1Regions:scene?.regions?.size??null,n1Behaviors:nc},kernelHash:kh,geometryHash:gh,behaviors:rows,ledger:{revision:state?.revision??null,notices:state?.notices??null,n1},phaseDisposition:failures.length?"CL-30 VERIFY FAILED":"CL-30 N1 GAMEPLAY INSTALLED / RAIL CAR, LIGHTING & TRANSITIONS DEFERRED",nextPhase:failures.length?"STOP":"CL-31 — N2 Grotto Station"};