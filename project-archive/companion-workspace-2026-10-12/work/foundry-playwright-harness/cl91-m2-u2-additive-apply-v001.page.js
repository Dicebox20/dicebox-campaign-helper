// CL91 exact snapshot guarded schema-only migration. ONE LIVE ACTION. DO NOT REPLAY.
const EXPECTED_SHA="8ea18562658ee2a255f2f17401424af160ad62de5ec5ff44f997b570a8a2cec7";
const HASH=async s=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(s)))),b=>b.toString(16).padStart(2,"0")).join("");
const stable=o=>{if(Array.isArray(o))return o.map(stable);if(o&&typeof o==="object"){const out={};for(const k of Object.keys(o).sort())out[k]=stable(o[k]);return out;}return o;};
const isEqual=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
if(game.version!=="14.367"||game.world.id!=="the-lost-mine-of-phandalin"||game.system.id!=="dnd5e"||game.system.version!=="5.3.3"
 ||game.user.name!=="Assistant Gamemaster"||!game.user.isGM||game.users.some(u=>u.active&&!u.isGM))throw Error("WRONG_STACK_OR_PLAYER_ACTIVE");
const ledger=game.journal.get("xhlXv6CCH34HVga3");
if(ledger?.getFlag("world","dicebox")?.stableId!=="dbx:central-lodge:state")throw Error("WRONG_LEDGER_ID");
const raw=ledger.getFlag("world","dicebox").state,oldHash=await HASH(JSON.stringify(raw));
if(oldHash!==EXPECTED_SHA||raw?.revision!==1
 ||raw.puzzles?.m2?.founderPortraitObserved!==false||raw.puzzles?.u2?.servantHistoryInterpreted!==false
 ||Object.hasOwn(raw.puzzles.m2,"founderPortraitOpened")||Object.hasOwn(raw.puzzles.u2,"servantHistoryObserved"))
 throw Error("LEDGER_SNAPSHOT_OR_STAGE_CHANGED");
const m2=game.scenes.get("JZkxX6lUQe8Nc8xJ")?.regions.get("FRY091GwobgD2M5i")?.behaviors.get("IdriZEGhxUY9whcV");
const u2scene=game.scenes.get("PVf6Gbrv9HbB88uZ");
const u2=u2scene?.regions.find(r=>r.behaviors.has("J11ZvQh4lqzEsvRi"))?.behaviors.get("J11ZvQh4lqzEsvRi");
if(await HASH(m2?.system?.source??"")!=="bbf7de80e832e453ff9c284b36194a42a7190d18847e29be1d5b49b654a09ec2"
||await HASH(u2?.system?.source??"")!=="f815c0920579b163800a7bf5548d252dad398aeb245e90c48ce5363b0defd372"
||await HASH(game.macros.get("FHQiFYx6OntZVo9d")?.command??"")!=="6264c467211d4f5c94cfaaa9437eae88582599061b9d8a4951391830a3e8f814")
throw Error("BEHAVIOR_OR_KERNEL_SHA_DRIFT");
const scenes=["0CSBwzcszPKyaB8u","5K1uASAARnX8aZhP","EDdktL7VUihbpKe9","UNySMm7YkyYfh41x","Zq8iXByDVhHRbA7w","sI4YVZZChgey1qNi","iqfCcDpEer4pwrJj","DLcheEi6e5OHOYmU","U8S5ZrTjaPIkTUIL","JZkxX6lUQe8Nc8xJ","LXTA8mx1rJ2L6e2J","MAbLfBqG7qIVVuLN","4pc5akMBieHU7GvV","pHQvDUDlyWZFuNrX","if9iWDRjSwI87EeX","PVf6Gbrv9HbB88uZ","La9krMOMBhAhDLi6","ImeIdHbYb6kZKAdt","ez9MSQ8QIO4cW6zo","aIKQmFiuXWipEdyb","HWitOe1wSid7MZ1y"].map(x=>game.scenes.get(x));
if(scenes.some(s=>!s)||scenes.reduce((n,s)=>n+s.regions.size,0)!==202
 ||scenes.reduce((n,s)=>n+[...s.regions].reduce((m,r)=>m+r.behaviors.size,0),0)!==117)
throw Error("SCENE_OR_BEHAVIOR_ROSTER_CHANGED");
const next=JSON.parse(JSON.stringify(raw));
next.puzzles.m2.founderPortraitOpened=false;next.puzzles.u2.servantHistoryObserved=false;
next.revision=2;next.updatedAt=new Date().toISOString();
if(next.puzzles.m2.founderPortraitOpened!==false||next.puzzles.u2.servantHistoryObserved!==false)
 throw Error("PREPARED_STATE_INVALID");
// No higher-layer user state beyond the two new booleans, revision, updatedAt.
const original=JSON.parse(JSON.stringify(next));
delete original.puzzles.m2.founderPortraitOpened;delete original.puzzles.u2.servantHistoryObserved;
original.revision=raw.revision;original.updatedAt=raw.updatedAt;
if(!isEqual(original,raw))throw Error("PREPARED_STATE_MODIFIES_UNRELATED_FIELDS");
await ledger.update({"flags.world.dicebox.state":next});
const reread=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state;
if(!isEqual(reread,next))throw Error("OUTCOME_UNKNOWN_POST_COMMIT: do not retry");
return {operation:"cl91-m2-u2-additive-apply-v001",status:"PASS",noWrite:false,ledgerId:ledger.id,
 previousRevision:raw.revision,newRevision:reread.revision,oldSha:oldHash,newSha:await HASH(JSON.stringify(reread)),
 addedFields:{"puzzles.m2.founderPortraitOpened":reread.puzzles.m2.founderPortraitOpened,"puzzles.u2.servantHistoryObserved":reread.puzzles.u2.servantHistoryObserved},
 preservedM2Observed:reread.puzzles.m2.founderPortraitObserved,preservedU2Interpreted:reread.puzzles.u2.servantHistoryInterpreted};
