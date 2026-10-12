// CL91 M2 Founder Portrait: single serialized Notice -> observation -> Signet pickup.
// Existing Notice and Signet source bodies below are embedded verbatim from actual Foundry.
// Replaces only original outer Signet RegionBehavior source; inner Notice is disabled separately.
// Gameplay behavior not certified until the user runs final campaign acceptance.
if(event?.name&&event.name!=="tokenEnter")return;
if(event?.region?.id&&event.region.id!=="FRY091GwobgD2M5i")return;
const gm=game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id))[0];
if(!game.user?.isGM||gm?.id!==game.user.id)return;
const scene=game.scenes.get("JZkxX6lUQe8Nc8xJ");
const token=event?.data?.token??event?.token??null,actor=token?.actor??null;
if(!token||!actor||token.parent?.id!=="JZkxX6lUQe8Nc8xJ")return;
const requestingUser=event?.user??null;
if(requestingUser&&!requestingUser.isGM&&!actor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))return;
const ledger=game.journal.get("xhlXv6CCH34HVga3");
const getState=()=>ledger?.getFlag("world","dicebox")?.state??null;
if(!ledger||!getState()||typeof game.macros.find!=="function")return;
const controller=globalThis.__diceboxM2FounderPortraitQueue??={tail:Promise.resolve()};
const previous=controller.tail;
let release;
controller.tail=new Promise(resolve=>release=resolve);
await previous.catch(()=>{});
try {
 const state=getState();
 if(state?.puzzles?.m2?.founderPortraitObserved!==true&&state?.puzzles?.m2?.founderPortraitObserved!==false)return;
 const originalNotice=async()=>{
// BEGIN ORIGINAL M2 PORTRAIT NOTICE SOURCE (unchanged)
const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");
if (!k) { console.error("[Central Lodge M2] Runtime Kernel missing."); return; }
const t = event?.data?.token ?? event?.token ?? null;
const a = t?.actor ?? null;
return await k.execute({actor:a,token:t,event,speaker:{dicebox:{"contract":"dicebox-discovery/v1","action":"notice","trigger":"TOKEN_ENTER","noticeKey":"m2.portrait-eye","dc":6,"stage2Skill":"Investigation","successMessage":"<p>The founder’s portrait is subtly wrong. One eye does not match the other, and close inspection reveals a fitted recess where a small artificial eye was meant to sit.</p>","followUp":"Suggested follow-up: Investigation.","failure":"silent","oncePerCharacter":true,"autoAwardItem":false,"criticalClueFallback":"The portrait remains physically examinable, and the eye mechanism can still be used if the missing Glass Eye is recovered."}}});
// END ORIGINAL M2 PORTRAIT NOTICE SOURCE
 };
 const noticeResult=await originalNotice();
 if(!["PASS","ALREADY_ATTEMPTED"].includes(noticeResult?.status))return;
 if(getState()?.puzzles?.m2?.founderPortraitObserved===false){
  const k=game.macros.find(m=>m.getFlag?.("world","dicebox")?.stableId==="dbx:central-lodge:macro:runtime");
  if(!k)return;
  const observed=await k.execute({actor,token,event,speaker:{dicebox:{
   contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_ENTER",
   observationKey:"m2.founder-portrait-examined",oncePerActor:false,
   statePath:"puzzles.m2.founderPortraitObserved",value:true,
   message:"<p>You study the founder’s stern expression and the workmanship of the frame. Some details seem intentionally altered, although their purpose is not yet clear.</p>"
  }}});
  if(observed?.status!=="PASS"||getState()?.puzzles?.m2?.founderPortraitObserved!==true)return;
 }
 const originalSignet=async()=>{
// BEGIN ORIGINAL M2 SIGNET PICKUP SOURCE (unchanged)
const k = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");
if (!k) { console.error("[Central Lodge M2] Runtime Kernel missing."); return; }
const t = event?.data?.token ?? event?.token ?? null;
const a = t?.actor ?? null;
if (!a) return;
const hasRequired = Array.from(a.items ?? []).some(i => i.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:item:founders-signet");
if (!hasRequired) return;
return await k.execute({actor:a,token:t,event,speaker:{dicebox:{"contract":"dicebox-region-behavior/v1","action":"pickup","trigger":"TOKEN_ENTER","itemKey":"old-estate-survey","statePath":"puzzles.m2.founderPortraitOpened","value":true,"message":"<p>The Founder’s Signet engages a concealed fitting in the Founder Portrait. A hidden compartment releases, revealing the <strong>Old Estate Survey</strong>.</p>","persistentPickup":true}}});
// END ORIGINAL M2 SIGNET PICKUP SOURCE
 };
 return await originalSignet();
}finally{release();}