const SCENE_ID="DLcheEi6e5OHOYmU",LEDGER_ID="xhlXv6CCH34HVga3",KERNEL_ID="FHQiFYx6OntZVo9d",WALL_ID="kyoCHP9xmMSxCIwi";
const EXPECTED_KERNEL_HASH="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814";
const EXPECTED_GEOMETRY_HASH="2c3a3508a9f8b4ed842c7df4113bba4a81b3893401ed00cc43d0a435812e73a5";
const LODGE_SCENES=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"];
const expected=[
["wzANpkb9bbFlB8z9","8iw5GCP7Yi1Vdobs","dbx:central-lodge:e4:behavior:false-burial-notice","448bea32d125b9d983bd381272b7ea9b13a58de4c14978e8337856976822afae","notice"],
["BjAgwMeaS9UUi7er","lY1YaRijgE9ySzic","dbx:central-lodge:e4:behavior:child-burial-notice","cf94a65c6dafeba8191e3103261bed1664f4e95afaf7f2c207d28c798bdda715","notice"],
["ppLE2BNr2T42PC5n","YksbwIC8uH8ks1ns","dbx:central-lodge:e4:behavior:four-crest-mausoleum-gate","d32856e375861613dc46b84ac376833ab5648057fe6486908c41b4f9410a5a3f","gate"],
["Z9AXol3CV5PhrCVm","QxQqIHbbZxQ16jqq","dbx:central-lodge:e4:behavior:founders-signet-recovery","0a1bcb2d643796581daff6d7612e9f65448402f697456199df30b96c8481b31f","pickup"],
["I5EVCuhR8GLs3u1B","skYfqVpUlIrcZE54","dbx:central-lodge:e4:behavior:black-garnet-eye-recovery","8cdbebdf653b16022f460423ddc34ae187193085de211bdd4478a0c8f6975dee","pickup"],
["LcSdZqeU33Bc7RH8","39Q7XSofYxvGEIX1","dbx:central-lodge:e4:behavior:child-bracelet-recovery","e8fd4f248801d5cebb31369a29f8b95372b3040567d5f8968cc449314f556c63","pickup"],
["Pqi9XGwL9kku1Eri","fJTQJygj5X1aC16D","dbx:central-lodge:e4:behavior:cicada-wing-ii-recovery","ad01c713ce9b74e0d706b0de714896066d81561a08492e9d5ac6950bcc423591","pickup"],
["eRjDUWAIS206MyZV","AjFHwHDxH7Pg9Vel","dbx:central-lodge:e4:behavior:false-burial-interpretation","c410b2cfac3e8d272de32f4d52b01aebce17886c575ba226050afadff31dc905","observe"],
["MadPtMvvYh3WRYHE","EcSly1GuaMrwpXAX","dbx:central-lodge:e4:behavior:covenant-seal-recovery","acf26d870332a8766849ff0df0ef6d5c283d09e4fc6667825b18af14d9a5dd67","pickup"]
];
const clone=v=>foundry.utils.deepClone(v),dbx=d=>{try{return clone(d?.getFlag?.("world","dicebox")??{});}catch{return{};}},sid=d=>dbx(d)?.stableId??null;
const norm=v=>Array.isArray(v)?v.map(norm):v&&typeof v==="object"?Object.fromEntries(Object.keys(v).sort().map(k=>[k,norm(v[k])])):v,canon=v=>JSON.stringify(norm(v));
const sha=async v=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v??"")))),b=>b.toString(16).padStart(2,"0")).join("");
const geom=s=>Array.from(s.regions??[]).map(r=>{const o=r.toObject();return{id:r.id,shapes:o.shapes??null,elevation:o.elevation??null,visibility:o.visibility??null,locked:o.locked??null};}).sort((a,b)=>a.id.localeCompare(b.id));
const failures=[],scene=game.scenes.get(SCENE_ID),ledger=game.journal.get(LEDGER_ID),kernel=game.macros.get(KERNEL_ID);let regions=0,behaviors=0;
for(const id of LODGE_SCENES){const s=game.scenes.get(id);if(!s){failures.push("Missing Scene "+id);continue;}const rs=Array.from(s.regions??[]);regions+=rs.length;behaviors+=rs.reduce((n,r)=>n+r.behaviors.size,0);}
const e4Count=scene?Array.from(scene.regions??[]).reduce((n,r)=>n+r.behaviors.size,0):null;if(regions!==202||behaviors!==69||scene?.regions?.size!==11||e4Count!==9)failures.push("Count mismatch.");
const kernelHash=await sha(kernel?.command??""),geometryHash=scene?await sha(canon(geom(scene))):null;if(kernelHash!==EXPECTED_KERNEL_HASH||geometryHash!==EXPECTED_GEOMETRY_HASH)failures.push("Hash drift.");
const wall=scene?.walls.get(WALL_ID);if(!wall||wall.door!==1||wall.ds!==0)failures.push("Crest door changed before gameplay.");
const rows=[];for(const [regionId,bid,stableId,hash,action] of expected){const r=scene?.regions.get(regionId),b=r?.behaviors.get(bid);if(!r||!b){failures.push(stableId+": missing");continue;}const f=dbx(b),h=await sha(b.system?.source??"");if(sid(b)!==stableId||h!==hash||f.regionStableId!==sid(r)||f.behaviorSpec?.action!==action)failures.push(stableId+": metadata/source mismatch");rows.push({id:b.id,stableId,action,sourceHash:h,regionId,status:"PASS"});}
for(const id of ["CSJtnWMkBw8HZY4o","AYKGbprBZQrcBlgV"]){const r=scene?.regions.get(id);if(!r||r.behaviors.size!==0)failures.push("Deferred Region drift "+id);}
const state=clone(ledger?.getFlag("world","dicebox")?.state??{});if(Number(state?.revision)!==0||Object.keys(state?.notices??{}).length)failures.push("Ledger drift.");const e4=clone(foundry.utils.getProperty(state,"puzzles.e4")??{});
for(const k of ["falseBurialNoticeResolved","childBurialNoticeResolved","mausoleumResolved","falseBurialInterpreted","childBurialInterpreted"])if(e4[k]!==false)failures.push("E4 state drift "+k);
for(const k of ["stag","rose","bell","crown"])if(e4.crests?.[k]!==false)failures.push("Crest state drift "+k);
return{operation:"central-lodge.cl20.e4.final-verify",status:failures.length?"FAIL":"PASS",noWrite:true,failures,baseline:{scenes:21,regions,behaviors,e4Regions:scene?.regions?.size??null,e4Behaviors:e4Count},kernelHash,geometryHash,door:{id:wall?.id??null,ds:wall?.ds??null},behaviors:rows,ledger:{revision:state?.revision??null,notices:state?.notices??null,e4},phaseDisposition:failures.length?"CL-20 VERIFY FAILED":"CL-20 E4 GAMEPLAY INSTALLED / LIGHTING & TRANSITION DEFERRED",nextPhase:failures.length?"STOP":"CL-21 — E1 backtrack"};