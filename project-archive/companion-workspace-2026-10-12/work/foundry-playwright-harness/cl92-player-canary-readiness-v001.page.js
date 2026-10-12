// CL-92 controlled player-canary readiness only. Never executes a Macro or RegionBehavior.
const OP="cl92.player-canary-readiness.readonly.v001";
const root="the-lost-mine-of-phandalin",ver="14.367",system="5.3.3";
const sha=async src=>Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(src??"")))),n=>n.toString(16).padStart(2,"0")).join("");
const lines=[
 {kind:"travel",name:"E1 to M1 front entrance",scene:"Zq8iXByDVhHRbA7w",region:"QS7OpvIilyyDpmLc",id:"HBtxj5OwVSOJdqnC",hash:"f144c80ca7789ea0ca246a43529bea56b53776d965b1c6471670a89abf236b0f",audience:"Zq8iXByDVhHRbA7w"},
 {kind:"travel",name:"T3 ancient passage to F1",scene:"aIKQmFiuXWipEdyb",region:"Tkg7XpsF7X1P3ZVJ",id:"tSqhDN5CtAHzccmf",hash:"c179ae83855e6eb136a1225bfbb882ab9c6b7bcd3f0773df3654f82b2b23d6cb",audience:"aIKQmFiuXWipEdyb"},
 {kind:"travel",name:"T3 branch return to N3",scene:"aIKQmFiuXWipEdyb",region:"YElrtisbXN3DJ2Sw",id:"pZpcYXFn517t6L5U",hash:"051c669835aaed94f0497ebe6e54590d37df97eceb271b611b0263ca95b8f963",audience:"aIKQmFiuXWipEdyb"},
 {kind:"macro",name:"M1 distant footsteps one-shot",scene:"U8S5ZrTjaPIkTUIL",id:"P7mgEkmAUiJXYdUD",hash:"4ff5a82aa5d57f8831f47063fab893eaea4d315942d59b9fbda99a0a1a9a42b6",flag:"m1DistantFootstepsPlayed",audience:"U8S5ZrTjaPIkTUIL"},
 {kind:"macro",name:"M2 haunted piano one-shot",scene:"JZkxX6lUQe8Nc8xJ",id:"VHVC7yVlrNS7mWGJ",hash:"c27e902c6232b946ee36a61572ac17a88cd5fca54acbe391afd7fdbf483e0e3b",flag:"m2HauntedPianoPlayed",audience:"JZkxX6lUQe8Nc8xJ"}
],results=[],errors=[];
const userStatus={activeGMs:game.users.filter(u=>u.active&&u.isGM).length,activePlayers:game.users.filter(u=>u.active&&!u.isGM).length};
if(game.world.id!==root||(game.version??game.release?.version)!==ver||game.system.version!==system)errors.push("Exact stack mismatch");
const ledger=game.journal.get("xhlXv6CCH34HVga3")?.getFlag("world","dicebox")?.state??{};
if(ledger.revision!==1)errors.push("Ledger revision advanced; reconcile before canary");
if(game.macros.size!==134)errors.push("World Macro count changed: "+game.macros.size);
for(const l of lines){
 const scene=game.scenes.get(l.scene),doc=l.kind==="macro"?game.macros.get(l.id):scene?.regions.get(l.region)?.behaviors.get(l.id);
 const cmd=l.kind==="macro"?doc?.command:doc?.system?.source;
 const digest=doc?await sha(cmd):null;
 const activeAudience=game.users.filter(u=>u.active&&!u.isGM&&u.viewedScene===l.audience).length;
 const sceneFlag=l.flag?scene?.getFlag("world","dicebox")?.cl52?.[l.flag]:null;
 const sourceValid=Boolean(doc&&digest===l.hash),unplayed=l.flag?sceneFlag==null:null;
 const needsReview=!sourceValid||doc?.disabled===true||(l.flag&&!unplayed);
 const status=needsReview?"REVIEW_SOURCE_OR_CONSUMED":activeAudience===0?"DEFERRED_NO_PLAYER":"READY_FOR_GM_CONTROLLED_CANARY_NOT_EXECUTED";
 results.push({name:l.name,kind:l.kind,sceneId:l.scene,id:l.id,documentExists:Boolean(doc),sourceSha256:digest,sourceHashMatches:sourceValid,disabled:doc?.disabled??null,oneShotFlag:l.flag??null,oneShotConsumedValue:sceneFlag??null,activeNonGMSceneViewers:activeAudience,status,events:l.kind==="travel"&&doc?.system?.events&&typeof doc.system.events[Symbol.iterator]==="function"?[...doc.system.events]:[]});
 if(!sourceValid)errors.push("Source or document mismatch: "+l.name);
}
return{operation:OP,noWrite:true,status:errors.length?"BLOCKED":"PASS_WITH_DEFERRED_PLAYER_CANARIES",errors,users:userStatus,scenes:21,macros:game.macros.size,ledgerRevision:ledger.revision,results,notes:["No Macro executed and no scene/flag/token/player state changed.","Source certification does not prove player delivery or teleport behavior.","User/presence gate must be rechecked immediately before any player canary."]};
