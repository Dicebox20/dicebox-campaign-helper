// DiceBox Central Lodge CL13 The Seventh Winter. Runs only as a RegionBehavior source.
// One approved primary-active GM performs the ledger write. Player enters clock Region.
// Does not grant Items, teleport, modify Scenes, or alter existing behaviors.
const DBX_SCENE_ID = "U8S5ZrTjaPIkTUIL";
const DBX_REGION_ID = "3tIrR12uv8ppFkOb";
const DBX_LEDGER_ID = "xhlXv6CCH34HVga3";
if (event?.name !== "tokenMoveIn" || event?.region?.id !== DBX_REGION_ID) return;
const gms = game.users.filter(u=>u.active && u.isGM).sort((a,b)=>a.id.localeCompare(b.id));
if (gms[0]?.id !== game.user.id || !game.user?.isGM) return;
const scene = game.scenes.get(DBX_SCENE_ID);
const region = scene?.regions.get(DBX_REGION_ID);
const tokenDoc = event?.data?.token?.document ?? event?.data?.token ?? null;
const movement = event?.data?.movement ?? null;
const requester = event?.user ?? null;
const actorDoc = tokenDoc?.actor ?? null;
if (!region || event.region.id !== region.id || !tokenDoc || tokenDoc.parent?.id !== scene.id || !actorDoc || !requester?.active) return;
if (!movement?.id || !movement?.origin || !movement?.destination) return;
if (!Number.isFinite(movement.origin.x) || !Number.isFinite(movement.origin.y)
 || !Number.isFinite(movement.destination.x) || !Number.isFinite(movement.destination.y)) return;
if (movement.origin.x === movement.destination.x && movement.origin.y === movement.destination.y) return;
if (movement.user?.id && movement.user.id !== requester.id) return;
if (!requester.isGM && !actorDoc.testUserPermission(requester, CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER)) return;
const ledger = game.journal.get(DBX_LEDGER_ID);
const readState = () => ledger?.getFlag("world","dicebox")?.state ?? null;
const get = (path) => foundry.utils.getProperty(readState() ?? {},path);
if (!ledger || get("puzzles.m1.silverFamilyEmblemInstalled") !== true || get("puzzles.m1.clockSettingResolved") === true) return;
const Dialog = foundry.applications.api.DialogV2;
if (typeof Dialog?.input !== "function" || typeof Dialog?.query !== "function") return;
const kernel = game.macros.find(m => m.getFlag?.("world","dicebox")?.stableId === "dbx:central-lodge:macro:runtime");
if (!kernel) return;
const pending = globalThis.__diceboxM1ClockPending ??= new Set();
const lockKey = String(tokenDoc.uuid ?? tokenDoc.id);
if (pending.has(lockKey)) return;
pending.add(lockKey);
try {
 const cfg = {
  window:{title:"The Seventh Winter — Grandfather Clock"},
  content:'<p>The Silver Family Emblem releases the clockwork. Beneath the face: <em>"The last heir shall guide the little hand. The winters between our graves shall guide the great."</em></p><p>Set the hands:</p><div style="display:flex;gap:1rem"><label>Hour<input type="number" name="hour" min="1" max="12" step="1" value="12"></label><label>Minute<input type="number" name="minute" min="0" max="59" step="1" value="0"></label></div>',
  ok:{label:"Set Hands"},rejectClose:false
 };
 let chosen;
 if (requester.id === game.user.id) chosen = await Dialog.input(cfg);
 else chosen = await requester.query("dialog",{type:"input",config:cfg},{timeout:45000});
 if (!chosen) return;
 const hour=Number(chosen.hour),minute=Number(chosen.minute);
 if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour<1 || hour>12 || minute<0 || minute>59) return;
 if (hour!==4 || minute!==35) {
  const wrong={window:{title:"The Clock Resists"},content:"<p>The gears turn, then settle back into place. Nothing is consumed, and the hands can be tried again.</p>",rejectClose:false};
  if(requester.id===game.user.id) await Dialog.prompt(wrong);
  else await requester.query("dialog",{type:"prompt",config:wrong},{timeout:20000});
  return;
 }
 // Re-read after potentially lengthy player dialogue; never use an old state snapshot.
 if (game.scenes.get(DBX_SCENE_ID)?.tokens.get(tokenDoc.id)?.actor?.id !== actorDoc.id) return;
 if (!requester.active || (!requester.isGM && !actorDoc.testUserPermission(requester,CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER))) return;
 if (get("puzzles.m1.silverFamilyEmblemInstalled") !== true || get("puzzles.m1.clockSettingResolved") === true) return;
 const res=await kernel.execute({actor:actorDoc,token:tokenDoc,event,speaker:{dicebox:{
  contract:"dicebox-region-behavior/v1",action:"observe",trigger:"TOKEN_MOVE_IN",
  observationKey:"m1.seventh-winter-clock-0435",oncePerActor:false,
  statePath:"puzzles.m1.clockSettingResolved",value:true,
  message:"<p>The fourth hour and seventh five-minute interval align. The clock strikes once, and a concealed compartment unlatches. The two objects inside can now be recovered separately.</p>"
 }}});
 if (res?.status!=="PASS" || get("puzzles.m1.clockSettingResolved")!==true) console.error("[CL13] Clock solver did not receive authoritative committed PASS",res?.status);
} finally {
 pending.delete(lockKey);
}
