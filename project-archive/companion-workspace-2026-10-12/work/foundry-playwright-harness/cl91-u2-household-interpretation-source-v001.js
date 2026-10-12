// CL91 authored U2 household-history interpretation, Foundry 14.367 RegionBehavior.
// Source-only until exact preview and guarded installation. No items, walls, travel, or scene edits.
// Deliberate full party evidence visited, not succeeded Notice rolls.
const SCENE_ID="PVf6Gbrv9HbB88uZ",REGION_ID="qa4n4o834OZTKPoV",LEDGER_ID="xhlXv6CCH34HVga3";
if(event?.name!=="tokenMoveIn"||event?.region?.id!==REGION_ID)return;
const primary=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
if(!game.user?.isGM||primary?.id!==game.user.id)return;
const scene=game.scenes.get(SCENE_ID),region=scene?.regions.get(REGION_ID);
const token=event?.data?.token??null,movement=event?.data?.movement??null,actor=token?.actor??null,requester=event?.user??null;
if(!scene||!region||!token||token.parent?.id!==SCENE_ID||!actor||!requester?.active)return;
if(!movement?.id||!movement.origin||!movement.destination||typeof movement.finished?.then!=="function")return;
const from=movement.origin,to=movement.destination;
if(![from.x,from.y,to.x,to.y].every(Number.isFinite)||(from.x===to.x&&from.y===to.y))return;
if(!requester.isGM&&!actor.testUserPermission(requester,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;
const ledger=game.journal.get(LEDGER_ID);
const state=()=>ledger?.getFlag("world","dicebox")?.state??null;
const noticesAttempted=(key,s)=>Object.values(s?.notices?.[key]??{}).some(x=>x?.attempted===true);
const eligible=()=>{
 const s=state();
 return s?.puzzles?.u2?.servantHistoryObserved===true &&
  s?.puzzles?.u2?.servantHistoryInterpreted===false &&
  noticesAttempted("u2.servant-room-absence",s) &&
  noticesAttempted("u2.nursery-contradiction",s);
};
if(!ledger||!eligible())return;
const kernel=game.macros.find(m=>m.getFlag?.("world","dicebox")?.stableId==="dbx:central-lodge:macro:runtime");
if(!kernel||typeof kernel.execute!=="function")return;
const lock=globalThis.__diceboxU2HistoryInterpretationLock??={inFlight:false};
if(lock.inFlight)return;
lock.inFlight=true;
try{
 let finished=false;
 try{finished=await movement.finished}catch(e){return}
 if(finished!==true)return;
 const current=game.scenes.get(SCENE_ID)?.tokens.get(token.id);
 if(!current||current.actor?.id!==actor.id||current.x!==to.x||current.y!==to.y)return;
 if(!requester.active||(!requester.isGM&&!actor.testUserPermission(requester,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)))return;
 if(!eligible())return; // Re-evaluate live state after movement completes.
 const result=await kernel.execute({actor,token,event,speaker:{dicebox:{
  contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_MOVE_IN",
  observationKey:"u2.household-history-interpreted",oncePerActor:false,
  statePath:"puzzles.u2.servantHistoryInterpreted",value:true,
  message:"<p>The cleared servants’ rooms, traces of work, and nursery objects that seem recently arranged cannot all be explained by simple abandonment. Someone handled these rooms after the household’s usual routine ended. Who did so, and why, remain unknown.</p>"
 }}});
 if(result?.status!=="PASS"||state()?.puzzles?.u2?.servantHistoryInterpreted!==true)
  console.error("[CL91 U2] Authoritative interpretation result unverified; do not replay blindly.",result?.status);
}finally{lock.inFlight=false}
