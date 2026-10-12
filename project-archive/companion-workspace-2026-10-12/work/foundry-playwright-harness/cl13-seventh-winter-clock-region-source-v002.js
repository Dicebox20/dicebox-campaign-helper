// DiceBox CL13 The Seventh Winter: offline-staged revised Foundry v14.367 RegionBehavior.
// This source does not self-install or touch the world until a separately guarded APPLY.
// Authoritative clock solution: 04:35. Never auto-awards compartment Items.
const SCENE_ID = "U8S5ZrTjaPIkTUIL";
const REGION_ID = "3tIrR12uv8ppFkOb";
const LEDGER_ID = "xhlXv6CCH34HVga3";
const PATH = "puzzles.m1.clockSettingResolved";
if (event?.name !== "tokenMoveIn" || event?.region?.id !== REGION_ID) return;
const activeGMs = game.users.filter(u=>u.active&&u.isGM).sort((a,b)=>a.id.localeCompare(b.id));
if (!game.user?.isGM || activeGMs[0]?.id !== game.user.id) return;
const scene = game.scenes.get(SCENE_ID);
const region = scene?.regions.get(REGION_ID);
const movedToken = event.data?.token ?? null;
const movement = event.data?.movement ?? null;
const requestingUser = event.user ?? null;
if (!scene || !region || !movedToken || movedToken.parent?.id !== SCENE_ID) return;
if (!requestingUser?.active || !movement?.id || !movement.origin || !movement.destination) return;
if (typeof movement.finished?.then !== "function") return;
const oldPos=movement.origin,finalPos=movement.destination;
if (![oldPos.x,oldPos.y,finalPos.x,finalPos.y].every(Number.isFinite)) return;
if (oldPos.x===finalPos.x && oldPos.y===finalPos.y) return; // Ignore elevation/resize-only events.
if (requestingUser.id !== game.user.id && requestingUser.isGM) return; // Other GM activity is not automatic player intent.
const tokenActor = movedToken.actor;
if (!tokenActor || (!requestingUser.isGM &&
 !tokenActor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))) return;
const ledger = game.journal.get(LEDGER_ID);
const state = ()=>ledger?.getFlag("world","dicebox")?.state??null;
const get = p=>foundry.utils.getProperty(state()??{},p);
if (!ledger || get("puzzles.m1.silverFamilyEmblemInstalled")!==true || get(PATH)===true) return;
const Dialog = foundry.applications?.api?.DialogV2;
if (typeof Dialog?.input!=="function" || typeof requestingUser.query!=="function") return;
const kernel = game.macros.find(m=>m.getFlag?.("world","dicebox")?.stableId==="dbx:central-lodge:macro:runtime");
if (!kernel || typeof kernel.execute!=="function") return;
// Single GM-client clock lock prevents two different Tokens from completing the same clock concurrently.
const clockLock = globalThis.__diceboxM1SeventhWinterLock ??= {inFlight:false};
if (clockLock.inFlight) return;
clockLock.inFlight=true;
try {
 // Move-In can precede the end of animation. Never prompt for canceled/unfinished movement.
 let completed=false;
 try {completed=await movement.finished;} catch(e){return;}
 if (completed!==true) return;
 const latest = game.scenes.get(SCENE_ID)?.tokens.get(movedToken.id);
 if (!latest || latest.actor?.id!==tokenActor.id ||
 latest.x!==finalPos.x || latest.y!==finalPos.y) return;
 if (!requestingUser.active || (!requestingUser.isGM &&
 !tokenActor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))) return;
 if (get("puzzles.m1.silverFamilyEmblemInstalled")!==true || get(PATH)===true) return;
 const cfg={
  window:{title:"The Seventh Winter — Grandfather Clock"},
  content:'<p>The Silver Family Emblem releases the clockwork. Beneath the face: <em>"The last heir shall guide the little hand. The winters between our graves shall guide the great."</em></p><p>Set the hands:</p><div style="display:flex;gap:1rem"><label>Hour<input type="number" name="hour" min="1" max="12" step="1" value="12"></label><label>Minute<input type="number" name="minute" min="0" max="59" step="1" value="0"></label></div>',
  ok:{label:"Set Hands"},rejectClose:false
 };
 let answer;
 try {
  if (requestingUser.id===game.user.id) answer=await Dialog.input(cfg);
  else answer=await requestingUser.query("dialog",{type:"input",config:cfg},{timeout:45000});
 } catch(e){return;}
 if (!answer) return;
 const h=Number(answer.hour),m=Number(answer.minute);
 if (!Number.isInteger(h)||!Number.isInteger(m)||h<1||h>12||m<0||m>59)return;
 if(h!==4||m!==35){
  const errorMessage={window:{title:"The Clock Resists"},
   content:"<p>The gears turn, then settle back into place. Nothing is consumed, and the hands can be tried again.</p>",
   rejectClose:false};
  try{
   if(requestingUser.id===game.user.id)await Dialog.prompt(errorMessage);
   else await requestingUser.query("dialog",{type:"prompt",config:errorMessage},{timeout:20000});
  }catch(e){}
  return;
 }
 // Prompt may have taken many seconds. Read state and Token anew before trying one controlled write.
 const current=game.scenes.get(SCENE_ID)?.tokens.get(movedToken.id);
 if (!current || current.actor?.id!==tokenActor.id ||
 current.x!==finalPos.x||current.y!==finalPos.y)return;
 if (!requestingUser.active || (!requestingUser.isGM &&
 !tokenActor.testUserPermission(requestingUser,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)))return;
 if (get("puzzles.m1.silverFamilyEmblemInstalled")!==true || get(PATH)===true)return;
 const outcome=await kernel.execute({actor:tokenActor,token:movedToken,event,
  speaker:{dicebox:{
   contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_MOVE_IN",
   observationKey:"m1.seventh-winter-clock-0435",oncePerActor:false,
   statePath:PATH,value:true,
   message:"<p>The fourth hour and seventh five-minute interval align. The clock strikes once, and a concealed compartment unlatches. The two objects inside can now be recovered separately.</p>"
  }}});
 if(outcome?.status!=="PASS" || get(PATH)!==true)console.error("[CL13] Authoritative clock result unknown; do not replay blindly.",outcome?.status);
}finally{clockLock.inFlight=false;}
